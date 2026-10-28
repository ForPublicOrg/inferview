// Progress store (SPEC section 8): localStorage always, plus the user's Firestore document after Google sign-in.
import { addDays, daysBetween, isDateString, localDate, MAX_INTERVAL, nextInterval, type Rating } from './schedule.ts';
import * as fb from './firebase.ts';
import { firebaseConfigured, type SessionUser } from './firebase.ts';

export type Item = { s: 'seen' | 'done'; r?: Rating; due?: string; i?: number; n: number; at: number };
/** A lab or multistage problem in progress: the step reached (1-based), the editor contents, and when either last changed. */
export type LabState = { step: number; code: string; at: number };
export type Progress = { v: 1; streak: { count: number; last: string }; items: Record<string, Item>; labs?: Record<string, LabState> };
export type AuthState =
  | { status: 'unconfigured' }
  | { status: 'loading' }
  | { status: 'signed-out' }
  | { status: 'signed-in'; user: SessionUser }
  | { status: 'error'; message: string };

export const STORAGE_KEY = 'inferview-progress';
const SIGNED_IN_FLAG = 'inferview-signed-in';
export const PROGRESS_EVENT = 'inferview:progress';
export const AUTH_EVENT = 'inferview:auth';
export const MAX_IMPORT_BYTES = 1_000_000;
export const MAX_ITEMS = 5000;
const KEY_RE = /^(lesson:[a-z0-9-]+\/[a-z0-9-]+\/[a-z0-9-]+|problem:[a-z]{3}-\d{3}|lab:[a-z0-9-]+\/\d{1,2})$/;
// Lesson keys before lessons moved into module folders; each old lesson became the module's "overview" lesson.
const LEGACY_LESSON_RE = /^lesson:([a-z0-9-]+)\/([a-z0-9-]+)$/;
// Lab slugs, plus "problem:<id>" for the stage reached in a multistage problem.
const LAB_SLUG_RE = /^([a-z0-9]+(-[a-z0-9]+)*|problem:[a-z]{3}-[0-9]{3})$/;
/** Matches the per-lab cap in firestore.rules. */
export const MAX_LAB_CODE = 20_000;
export const MAX_LAB_STEP = 10;
const MAX_LABS = 100;
const SYNC_DELAY_MS = 1500;

export function emptyProgress(): Progress {
  return { v: 1, streak: { count: 0, last: '' }, items: {} };
}

function isItem(x: unknown): x is Item {
  if (!x || typeof x !== 'object') return false;
  const o = x as Record<string, unknown>;
  const allowed = new Set(['s', 'r', 'due', 'i', 'n', 'at']);
  if (Object.keys(o).some((k) => !allowed.has(k))) return false;
  if (o.s !== 'seen' && o.s !== 'done') return false;
  if (o.r !== undefined && !(o.r === 1 || o.r === 2 || o.r === 3 || o.r === 4)) return false;
  if (o.due !== undefined && !isDateString(o.due)) return false;
  if (o.i !== undefined && (typeof o.i !== 'number' || !Number.isInteger(o.i) || o.i < 1 || o.i > MAX_INTERVAL)) return false;
  if (typeof o.n !== 'number' || !Number.isInteger(o.n) || o.n < 0 || o.n > 1_000_000) return false;
  if (typeof o.at !== 'number' || !Number.isFinite(o.at) || o.at < 0) return false;
  return true;
}

function isLabState(x: unknown): x is LabState {
  if (!x || typeof x !== 'object' || Array.isArray(x)) return false;
  const o = x as Record<string, unknown>;
  if (Object.keys(o).some((k) => k !== 'step' && k !== 'code' && k !== 'at')) return false;
  if (typeof o.step !== 'number' || !Number.isInteger(o.step) || o.step < 1 || o.step > MAX_LAB_STEP) return false;
  if (typeof o.code !== 'string' || o.code.length > MAX_LAB_CODE) return false;
  return typeof o.at === 'number' && Number.isFinite(o.at) && o.at >= 0;
}

/**
 * Returns a clean copy when `x` has exactly the Progress shape, otherwise null. Never evaluates input.
 * Old two-part lesson keys are renamed to their module's overview lesson, keeping the newer entry on a clash.
 */
export function validateProgress(x: unknown): Progress | null {
  if (!x || typeof x !== 'object' || Array.isArray(x)) return null;
  const o = x as Record<string, unknown>;
  if (Object.keys(o).some((k) => !['v', 'streak', 'items', 'labs'].includes(k))) return null;
  if (o.v !== 1) return null;
  const st = o.streak as Record<string, unknown> | undefined;
  if (!st || typeof st !== 'object' || Object.keys(st).some((k) => k !== 'count' && k !== 'last')) return null;
  if (typeof st.count !== 'number' || !Number.isInteger(st.count) || st.count < 0) return null;
  if (typeof st.last !== 'string' || (st.last !== '' && !isDateString(st.last))) return null;
  const items = o.items;
  if (!items || typeof items !== 'object' || Array.isArray(items)) return null;
  const entries = Object.entries(items as Record<string, unknown>);
  if (entries.length > MAX_ITEMS) return null;
  const clean: Record<string, Item> = {};
  for (const [raw, v] of entries) {
    const legacy = raw.match(LEGACY_LESSON_RE);
    const k = legacy ? `lesson:${legacy[1]}/${legacy[2]}/overview` : raw;
    if (!KEY_RE.test(k) || !isItem(v)) return null;
    const item: Item = { s: v.s, n: v.n, at: v.at };
    if (v.r !== undefined) item.r = v.r;
    if (v.due !== undefined) item.due = v.due;
    if (v.i !== undefined) item.i = v.i;
    const cur = clean[k];
    if (!cur || item.at > cur.at) clean[k] = item;
  }
  const out: Progress = { v: 1, streak: { count: st.count, last: st.last }, items: clean };
  if (o.labs !== undefined) {
    if (!o.labs || typeof o.labs !== 'object' || Array.isArray(o.labs)) return null;
    const labEntries = Object.entries(o.labs as Record<string, unknown>);
    if (labEntries.length > MAX_LABS) return null;
    const labs: Record<string, LabState> = {};
    for (const [slug, v] of labEntries) {
      if (!LAB_SLUG_RE.test(slug) || !isLabState(v)) return null;
      labs[slug] = { step: v.step, code: v.code, at: v.at };
    }
    out.labs = labs;
  }
  return out;
}

function readLocal(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress();
    return validateProgress(JSON.parse(raw)) ?? emptyProgress();
  } catch {
    return emptyProgress();
  }
}

let cache: Progress | null = null;

export function getProgress(): Progress {
  cache ??= readLocal();
  return cache;
}

function emit(): void {
  document.dispatchEvent(new CustomEvent(PROGRESS_EVENT, { detail: getProgress() }));
}

function persist(p: Progress, push = true): void {
  cache = p;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch (e) {
    console.warn('Could not save progress in this browser', e);
  }
  emit();
  if (push) scheduleSync();
}

/** Subscribe to progress changes in this tab and in other tabs; the callback runs once immediately. */
export function onProgress(cb: (p: Progress) => void): () => void {
  const handler = () => cb(getProgress());
  const storage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    cache = null;
    cb(getProgress());
  };
  document.addEventListener(PROGRESS_EVENT, handler);
  window.addEventListener('storage', storage);
  cb(getProgress());
  return () => {
    document.removeEventListener(PROGRESS_EVENT, handler);
    window.removeEventListener('storage', storage);
  };
}

export function getItem(key: string): Item | undefined {
  return getProgress().items[key];
}

export function markSeen(key: string): void {
  if (!KEY_RE.test(key)) return;
  const p = structuredClone(getProgress());
  if (p.items[key]) return;
  p.items[key] = { s: 'seen', n: 0, at: Date.now() };
  persist(p);
}

/** Records a completion. Gradable completions (mcq, debug, code, estimate) also advance the streak. */
export function complete(key: string, gradable: boolean): void {
  if (!KEY_RE.test(key)) return;
  const p = structuredClone(getProgress());
  const prev = p.items[key];
  p.items[key] = { ...prev, s: 'done', n: (prev?.n ?? 0) + 1, at: Date.now() };
  if (gradable) p.streak = bumpStreak(p.streak, localDate());
  persist(p);
}

export function getLab(slug: string): LabState | undefined {
  return getProgress().labs?.[slug];
}

/** Saves the lab's step and code. Returns false, saving nothing, when the code is over the size cap. */
export function saveLab(slug: string, step: number, code: string): boolean {
  if (!LAB_SLUG_RE.test(slug) || code.length > MAX_LAB_CODE) return false;
  const p = structuredClone(getProgress());
  const s = Math.min(Math.max(1, Math.trunc(step)), MAX_LAB_STEP);
  p.labs = { ...p.labs, [slug]: { step: s, code, at: Date.now() } };
  persist(p);
  return true;
}

export function rate(key: string, r: Rating): string | null {
  if (!KEY_RE.test(key)) return null;
  const p = structuredClone(getProgress());
  const prev = p.items[key];
  const today = localDate();
  const i = nextInterval(r, prev);
  const due = addDays(today, i);
  p.items[key] = { s: prev?.s ?? 'seen', n: (prev?.n ?? 0) + 1, r, due, i, at: Date.now() };
  persist(p);
  return due;
}

function bumpStreak(st: Progress['streak'], today: string): Progress['streak'] {
  if (st.last === today) return st;
  if (st.last && daysBetween(st.last, today) === 1) return { count: st.count + 1, last: today };
  return { count: 1, last: today };
}

/** The streak as it stands today: it survives until the end of the day after the last gradable completion. */
export function currentStreak(p: Progress = getProgress(), today = localDate()): number {
  if (!p.streak.last) return 0;
  const gap = daysBetween(p.streak.last, today);
  return gap === 0 || gap === 1 ? p.streak.count : 0;
}

export function dueKeys(p: Progress = getProgress(), today = localDate()): string[] {
  return Object.entries(p.items)
    .filter(([, it]) => it.due && it.due <= today)
    .sort((a, b) => (a[1].due ?? '').localeCompare(b[1].due ?? ''))
    .map(([k]) => k);
}

export function upcomingKeys(p: Progress = getProgress(), today = localDate(), days = 7): string[] {
  const end = addDays(today, days);
  return Object.entries(p.items)
    .filter(([, it]) => it.due && it.due > today && it.due <= end)
    .sort((a, b) => (a[1].due ?? '').localeCompare(b[1].due ?? ''))
    .map(([k]) => k);
}

/**
 * Per-item and per-lab merge keeping the newer `at`. The streak with the later `last` wins and ties keep the higher
 * count; when the other streak ended the day before, the newer day continues it.
 */
export function mergeProgress(a: Progress, b: Progress): Progress {
  const items: Record<string, Item> = { ...a.items };
  for (const [k, v] of Object.entries(b.items)) {
    const cur = items[k];
    if (!cur || v.at > cur.at) items[k] = v;
  }
  const bNewer = b.streak.last > a.streak.last || (b.streak.last === a.streak.last && b.streak.count > a.streak.count);
  const newer = bNewer ? b.streak : a.streak;
  const older = bNewer ? a.streak : b.streak;
  let streak = { ...newer };
  if (older.last && newer.last && daysBetween(older.last, newer.last) === 1) {
    streak = { count: Math.max(newer.count, older.count + 1), last: newer.last };
  }
  const out: Progress = { v: 1, streak, items };
  if (a.labs || b.labs) {
    const labs: Record<string, LabState> = { ...a.labs };
    for (const [k, v] of Object.entries(b.labs ?? {})) {
      const cur = labs[k];
      if (!cur || v.at > cur.at) labs[k] = v;
    }
    out.labs = labs;
  }
  return out;
}

export function exportJSON(): string {
  return JSON.stringify(getProgress(), null, 2);
}

/** Validates and merges an exported file into the current progress. Returns the number of items imported. */
export function importJSON(text: string): number {
  if (text.length > MAX_IMPORT_BYTES) throw new Error('That file is larger than 1 MB, which is more than any real progress file.');
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('That file is not valid JSON.');
  }
  const incoming = validateProgress(parsed);
  if (!incoming) throw new Error('That file does not match the Inferview progress format, so nothing was imported.');
  const merged = mergeProgress(getProgress(), incoming);
  if (Object.keys(merged.items).length > MAX_ITEMS) throw new Error('Importing this file would exceed the item limit.');
  persist(merged);
  return Object.keys(incoming.items).length;
}

/** Local data is cleared only after the remote delete succeeds; on failure, syncing resumes. */
export async function deleteAll(): Promise<void> {
  if (auth.status === 'signed-in') {
    if (syncTimer) clearTimeout(syncTimer);
    syncTimer = null;
    deleting = true;
    try {
      await fb.deleteRemoteAndAccount();
    } catch (e) {
      deleting = false;
      scheduleSync();
      throw e;
    }
    deleting = false;
    remoteUid = null;
    localStorage.removeItem(SIGNED_IN_FLAG);
  }
  localStorage.removeItem(STORAGE_KEY);
  cache = emptyProgress();
  emit();
  setAuth(firebaseConfigured ? { status: 'signed-out' } : { status: 'unconfigured' });
}

let auth: AuthState = firebaseConfigured ? { status: 'signed-out' } : { status: 'unconfigured' };
let remoteUid: string | null = null;
let syncTimer: ReturnType<typeof setTimeout> | null = null;
let watching = false;
// While true, no sync runs, so a pending write cannot recreate the document being deleted.
let deleting = false;
// While true, the signed-out callback leaves the flag alone so a redirect sign-in can finish on the next load.
let signingIn = false;

export function getAuth(): AuthState {
  return auth;
}

function setAuth(next: AuthState): void {
  auth = next;
  document.dispatchEvent(new CustomEvent(AUTH_EVENT, { detail: next }));
}

export function onAuth(cb: (a: AuthState) => void): () => void {
  const handler = (e: Event) => cb((e as CustomEvent<AuthState>).detail);
  document.addEventListener(AUTH_EVENT, handler);
  cb(auth);
  return () => document.removeEventListener(AUTH_EVENT, handler);
}

function scheduleSync(): void {
  if (!remoteUid || deleting) return;
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(() => void flush(), SYNC_DELAY_MS);
}

async function flush(): Promise<void> {
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = null;
  if (!remoteUid || deleting) return;
  try {
    await fb.writeRemote(remoteUid, getProgress());
  } catch (e) {
    console.warn('Could not sync progress; it is still saved in this browser', e);
  }
}

async function onSignedIn(user: SessionUser): Promise<void> {
  remoteUid = user.uid;
  localStorage.setItem(SIGNED_IN_FLAG, '1');
  try {
    const remote = validateProgress(await fb.readRemote(user.uid));
    const merged = remote ? mergeProgress(getProgress(), remote) : getProgress();
    persist(merged, false);
    await fb.writeRemote(user.uid, merged);
  } catch (e) {
    console.warn('Could not read synced progress', e);
  }
  setAuth({ status: 'signed-in', user });
}

async function startWatching(): Promise<void> {
  if (watching || !firebaseConfigured) return;
  watching = true;
  setAuth({ status: 'loading' });
  try {
    await fb.watchUser((user) => {
      if (user) void onSignedIn(user);
      else {
        remoteUid = null;
        if (!signingIn) localStorage.removeItem(SIGNED_IN_FLAG);
        setAuth({ status: 'signed-out' });
      }
    });
  } catch (e) {
    watching = false;
    setAuth({ status: 'error', message: (e as Error).message });
  }
}

/** Called once per page. Loads Firebase only when this browser signed in before. */
export function initSync(): void {
  if (!firebaseConfigured) return;
  let flagged = false;
  try {
    flagged = localStorage.getItem(SIGNED_IN_FLAG) === '1';
  } catch {
    flagged = false;
  }
  if (flagged) void startWatching();
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && syncTimer) void flush();
  });
}

export async function signIn(): Promise<void> {
  if (!firebaseConfigured) return;
  let redirecting = false;
  signingIn = true;
  try {
    localStorage.setItem(SIGNED_IN_FLAG, '1');
    await startWatching();
    const user = await fb.signInWithGoogle(() => {
      redirecting = true;
      localStorage.setItem(SIGNED_IN_FLAG, '1');
    });
    if (!user && !redirecting && auth.status !== 'signed-in') {
      localStorage.removeItem(SIGNED_IN_FLAG);
      if (auth.status === 'loading') setAuth({ status: 'signed-out' });
    }
  } catch (e) {
    localStorage.removeItem(SIGNED_IN_FLAG);
    setAuth({ status: 'error', message: (e as Error).message });
  } finally {
    signingIn = false;
  }
}

export async function signOut(): Promise<void> {
  await flush();
  await fb.signOutUser();
  remoteUid = null;
  localStorage.removeItem(SIGNED_IN_FLAG);
  setAuth({ status: 'signed-out' });
}
