// Daily problem: a deterministic pick from the gradable problems for a given YYYY-MM-DD, plus the recent archive.
import { addDays } from './schedule.ts';

export type DailyEntry = { id: string; title: string; type: string; difficulty: string; minutes: number; track: string };

/** FNV-1a over the date string, so every visitor gets the same problem on the same calendar date. */
export function hashDate(date: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < date.length; i++) {
    h ^= date.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/** `pool` must be sorted by id; the build does that so the pick only changes when the bank changes. */
export function dailyFor<T extends { id: string }>(date: string, pool: T[]): T | undefined {
  if (!pool.length) return undefined;
  return pool[hashDate(date) % pool.length];
}

export function archive<T extends { id: string }>(today: string, pool: T[], days = 30): { date: string; problem: T }[] {
  const out: { date: string; problem: T }[] = [];
  for (let i = 1; i <= days; i++) {
    const date = addDays(today, -i);
    const problem = dailyFor(date, pool);
    if (problem) out.push({ date, problem });
  }
  return out;
}

export function formatDate(date: string): string {
  const d = new Date(`${date}T12:00:00Z`);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });
}
