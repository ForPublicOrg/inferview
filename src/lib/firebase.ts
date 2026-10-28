// Firebase Auth (Google) and Firestore, loaded on demand so pages that never touch sign-in ship no Firebase code.
import type { FirebaseApp } from 'firebase/app';
import type { Auth, User } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

const config = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY ?? '',
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID ?? '',
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID ?? '',
};

export const firebaseConfigured = Boolean(config.apiKey && config.authDomain && config.projectId && config.appId);
/** Firestore location shown on the privacy page; optional. */
export const firebaseRegion = (import.meta.env.PUBLIC_FIREBASE_REGION ?? '').trim();

export type SessionUser = { uid: string; email: string | null; name: string | null };

type Ctx = {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  authMod: typeof import('firebase/auth');
  fsMod: typeof import('firebase/firestore');
};

let ctxPromise: Promise<Ctx> | null = null;

function load(): Promise<Ctx> {
  if (!firebaseConfigured) return Promise.reject(new Error('This build has no Firebase settings, so sign-in is off.'));
  // A failed load is not cached, so the next call retries the imports.
  ctxPromise ??= (async () => {
    const [appMod, authMod, fsMod] = await Promise.all([
      import('firebase/app'),
      import('firebase/auth'),
      import('firebase/firestore'),
    ]);
    const app = appMod.getApps()[0] ?? appMod.initializeApp(config);
    const auth = authMod.initializeAuth(app, {
      persistence: authMod.browserLocalPersistence,
      popupRedirectResolver: authMod.browserPopupRedirectResolver,
    });
    const db = fsMod.getFirestore(app);
    return { app, auth, db, authMod, fsMod };
  })().catch((e: unknown) => {
    ctxPromise = null;
    throw e;
  });
  return ctxPromise;
}

function toSessionUser(u: User | null): SessionUser | null {
  return u ? { uid: u.uid, email: u.email, name: u.displayName } : null;
}

/** Resolves once Firebase has restored any saved session, then reports every later change. */
export async function watchUser(cb: (u: SessionUser | null) => void): Promise<() => void> {
  const { auth, authMod } = await load();
  try {
    await authMod.getRedirectResult(auth);
  } catch (e) {
    console.warn('Redirect sign-in did not complete', e);
  }
  return authMod.onAuthStateChanged(auth, (u) => cb(toSessionUser(u)));
}

function provider(authMod: Ctx['authMod']) {
  const p = new authMod.GoogleAuthProvider();
  p.setCustomParameters({ prompt: 'select_account' });
  return p;
}

const REDIRECT_CODES = new Set(['auth/popup-blocked', 'auth/operation-not-supported-in-this-environment']);

/**
 * Popup first; falls back to a full-page redirect when the browser blocks popups. `onRedirect` runs immediately
 * before the page navigates away, so the caller can leave a note for the next page load to pick up the result.
 */
export async function signInWithGoogle(onRedirect?: () => void): Promise<SessionUser | null> {
  const { auth, authMod } = await load();
  try {
    const cred = await authMod.signInWithPopup(auth, provider(authMod));
    return toSessionUser(cred.user);
  } catch (e) {
    const code = (e as { code?: string }).code ?? '';
    if (REDIRECT_CODES.has(code)) {
      onRedirect?.();
      await authMod.signInWithRedirect(auth, provider(authMod));
      return null;
    }
    if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return null;
    throw e;
  }
}

export async function signOutUser(): Promise<void> {
  const { auth, authMod } = await load();
  await authMod.signOut(auth);
}

export async function readRemote(uid: string): Promise<unknown | null> {
  const { db, fsMod } = await load();
  const snap = await fsMod.getDoc(fsMod.doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
}

export async function writeRemote(uid: string, data: Record<string, unknown>): Promise<void> {
  const { db, fsMod } = await load();
  await fsMod.setDoc(fsMod.doc(db, 'users', uid), data);
}

/** Deletes the progress document, then the Auth user. Reauthenticates first so a cancelled popup deletes nothing. */
export async function deleteRemoteAndAccount(): Promise<void> {
  const { auth, authMod, db, fsMod } = await load();
  const user = auth.currentUser;
  if (!user) return;
  await authMod.reauthenticateWithPopup(user, provider(authMod));
  await fsMod.deleteDoc(fsMod.doc(db, 'users', user.uid));
  await authMod.deleteUser(user);
}
