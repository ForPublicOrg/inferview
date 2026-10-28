// Build-time helpers over the content collections: sorted lists, URLs and progress keys, catalog rows and title lookups.
// Every internal link to a lesson, module, lab or problem is built here, so a URL change happens in one place.
import { getCollection, type CollectionEntry } from 'astro:content';
import { TRACKS, getTrack, getModule, trackIndex } from '../data/tracks.ts';
import { isGradable, inDailyPool, typeLabel } from './schemas.ts';

export type Lesson = CollectionEntry<'lessons'>;
export type Problem = CollectionEntry<'problems'>;
export type Lab = CollectionEntry<'labs'>;

type LessonLike = { id: string; data: { track: string; module: string } };

const moduleIndex = (track: string, module: string) => getTrack(track)?.modules.findIndex((m) => m.slug === module) ?? -1;

/** Lessons in site order: track, then module, then `order` inside the module. */
export async function lessons(): Promise<Lesson[]> {
  const all = await getCollection('lessons');
  return all.sort(
    (a, b) =>
      trackIndex(a.data.track) - trackIndex(b.data.track) ||
      moduleIndex(a.data.track, a.data.module) - moduleIndex(b.data.track, b.data.module) ||
      a.data.order - b.data.order,
  );
}

export async function moduleLessons(track: string, module: string): Promise<Lesson[]> {
  return (await lessons()).filter((l) => l.data.track === track && l.data.module === module);
}

export async function problems(): Promise<Problem[]> {
  const all = await getCollection('problems');
  return all.sort((a, b) => a.data.id.localeCompare(b.data.id));
}

export async function labs(): Promise<Lab[]> {
  const all = await getCollection('labs');
  return all.sort(
    (a, b) =>
      trackIndex(a.data.track) - trackIndex(b.data.track) ||
      moduleIndex(a.data.track, a.data.module) - moduleIndex(b.data.track, b.data.module) ||
      a.id.localeCompare(b.id),
  );
}

/** The lesson's file name, which is its slug inside the module. */
export const lessonSlug = (l: { id: string }) => l.id.split('/').pop() ?? l.id;
export const trackUrl = (track: string) => `/learn/${track}`;
export const moduleUrl = (track: string, module: string) => `/learn/${track}/${module}`;
export const lessonUrl = (l: LessonLike) => `${moduleUrl(l.data.track, l.data.module)}/${lessonSlug(l)}`;
export const lessonKey = (l: LessonLike) => `lesson:${l.data.track}/${l.data.module}/${lessonSlug(l)}`;
export const problemUrl = (id: string) => `/problems/${id}`;
export const problemKey = (id: string) => `problem:${id}`;
export const labUrl = (slug: string) => `/labs/${slug}`;
/** Step numbers are 1-based, matching the step list the reader sees. */
export const labStepKey = (slug: string, step: number) => `lab:${slug}/${step}`;

/** One catalog row; also the shape embedded as JSON for client-side filtering and the mock loop. */
export type ProblemRow = {
  id: string;
  title: string;
  subtitle: string;
  track: string;
  trackShort: string;
  module: string;
  moduleTitle: string;
  type: string;
  typeLabel: string;
  difficulty: string;
  seniority: string[];
  minutes: number;
  core: boolean;
  tags: string[];
  companies: { name: string; url: string }[];
  gradable: boolean;
  /** In the pool the daily problem is drawn from. */
  daily: boolean;
};

export function toRow(p: Problem): ProblemRow {
  const d = p.data;
  return {
    id: d.id,
    title: d.title,
    subtitle: d.subtitle ?? '',
    track: d.track,
    trackShort: getTrack(d.track)?.short ?? d.track,
    module: d.module,
    moduleTitle: getModule(d.track, d.module)?.title ?? d.module,
    type: d.type,
    typeLabel: typeLabel(d.type),
    difficulty: d.difficulty,
    seniority: d.seniority,
    minutes: d.minutes,
    core: d.core,
    tags: d.tags,
    companies: d.companies,
    gradable: isGradable(d.type),
    daily: inDailyPool(d.type),
  };
}

export type IndexEntry = { title: string; url: string; kind: 'lesson' | 'problem' | 'lab'; track: string };

/** Key to title and URL for every lesson, problem and lab step, used by pages that render progress items client-side. */
export async function itemIndex(): Promise<Record<string, IndexEntry>> {
  const out: Record<string, IndexEntry> = {};
  for (const l of await lessons()) out[lessonKey(l)] = { title: l.data.title, url: lessonUrl(l), kind: 'lesson', track: l.data.track };
  for (const p of await problems()) out[problemKey(p.data.id)] = { title: p.data.title, url: problemUrl(p.data.id), kind: 'problem', track: p.data.track };
  for (const lab of await labs()) {
    lab.data.steps.forEach((s, i) => {
      out[labStepKey(lab.id, i + 1)] = { title: `${lab.data.title}, step ${i + 1}: ${s.title}`, url: labUrl(lab.id), kind: 'lab', track: lab.data.track };
    });
  }
  return out;
}

/** Per-track keys of every lesson and problem, so the client can compute percent done. */
export async function trackKeys(): Promise<Record<string, string[]>> {
  const out: Record<string, string[]> = Object.fromEntries(TRACKS.map((t) => [t.slug, [] as string[]]));
  for (const l of await lessons()) out[l.data.track]?.push(lessonKey(l));
  for (const p of await problems()) out[p.data.track]?.push(problemKey(p.data.id));
  return out;
}

/** Counts stated on the landing and about pages. Teardowns are lessons of kind teardown and are counted apart. */
export async function siteCounts(): Promise<{ lessons: number; teardowns: number; problems: number; labs: number }> {
  const all = await lessons();
  const teardowns = all.filter((l) => l.data.kind === 'teardown').length;
  return { lessons: all.length - teardowns, teardowns, problems: (await problems()).length, labs: (await labs()).length };
}

export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

export const DIFF_LABEL: Record<string, string> = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };
export const LEVEL_LABEL: Record<string, string> = { senior: 'Senior level', staff: 'Staff level' };
export const KIND_LABEL: Record<string, string> = { lesson: 'Lesson', teardown: 'Teardown', playbook: 'Playbook', paper: 'Paper walkthrough' };

export function formatDay(d: Date): string {
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
}
