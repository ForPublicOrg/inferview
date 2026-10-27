// Build-time helpers over the content collections: sorted lists, catalog index rows and title lookups.
import { getCollection, type CollectionEntry } from 'astro:content';
import { TRACKS, getTrack, getModule, trackIndex } from '../data/tracks.ts';
import { isGradable } from './schemas.ts';

export type Lesson = CollectionEntry<'lessons'>;
export type Problem = CollectionEntry<'problems'>;

export async function lessons(): Promise<Lesson[]> {
  const all = await getCollection('lessons');
  return all.sort((a, b) => trackIndex(a.data.track) - trackIndex(b.data.track) || a.data.order - b.data.order);
}

export async function problems(): Promise<Problem[]> {
  const all = await getCollection('problems');
  return all.sort((a, b) => a.data.id.localeCompare(b.data.id));
}

export const lessonUrl = (l: { data: { track: string; module: string } }) => `/learn/${l.data.track}/${l.data.module}`;
export const problemUrl = (id: string) => `/problems/${id}`;
export const lessonKey = (l: { data: { track: string; module: string } }) => `lesson:${l.data.track}/${l.data.module}`;
export const problemKey = (id: string) => `problem:${id}`;

/** One catalog row; also the shape embedded as JSON for client-side filtering. */
export type ProblemRow = {
  id: string;
  title: string;
  subtitle: string;
  track: string;
  trackShort: string;
  module: string;
  moduleTitle: string;
  type: string;
  difficulty: string;
  seniority: string[];
  minutes: number;
  core: boolean;
  tags: string[];
  companies: { name: string; url: string }[];
  gradable: boolean;
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
    difficulty: d.difficulty,
    seniority: d.seniority,
    minutes: d.minutes,
    core: d.core,
    tags: d.tags,
    companies: d.companies,
    gradable: isGradable(d.type),
  };
}

/** Key to title and URL for every lesson and problem, used by pages that render progress items client-side. */
export async function itemIndex(): Promise<Record<string, { title: string; url: string; kind: 'lesson' | 'problem'; track: string }>> {
  const out: Record<string, { title: string; url: string; kind: 'lesson' | 'problem'; track: string }> = {};
  for (const l of await lessons()) out[lessonKey(l)] = { title: l.data.title, url: lessonUrl(l), kind: 'lesson', track: l.data.track };
  for (const p of await problems()) out[problemKey(p.data.id)] = { title: p.data.title, url: problemUrl(p.data.id), kind: 'problem', track: p.data.track };
  return out;
}

/** Per-track keys of every lesson and problem, so the client can compute percent done. */
export async function trackKeys(): Promise<Record<string, string[]>> {
  const out: Record<string, string[]> = Object.fromEntries(TRACKS.map((t) => [t.slug, [] as string[]]));
  for (const l of await lessons()) out[l.data.track]?.push(lessonKey(l));
  for (const p of await problems()) out[p.data.track]?.push(problemKey(p.data.id));
  return out;
}

export const DIFF_LABEL: Record<string, string> = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };

export function formatDay(d: Date): string {
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
}
