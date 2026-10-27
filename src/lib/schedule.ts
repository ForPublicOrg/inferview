// Review intervals and local-date helpers. Ratings 1 to 4 map to 1, 3, 7 and 21 days (SPEC section 8).

export type Rating = 1 | 2 | 3 | 4;

export const INTERVALS: Record<Rating, number> = { 1: 1, 2: 3, 3: 7, 4: 21 };
export const RATING_LABELS: Record<Rating, string> = { 1: 'Blanked', 2: 'Shaky', 3: 'Solid', 4: 'Could teach it' };
export const MAX_INTERVAL = 120;
const DAY = 86_400_000;

/** YYYY-MM-DD in the visitor's own time zone, so a streak day ends at their midnight, not UTC's. */
export function localDate(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function isDateString(s: unknown): s is string {
  return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(`${s}T00:00:00Z`));
}

/** Calendar arithmetic on YYYY-MM-DD strings, done in UTC so daylight-saving changes cannot skip a day. */
export function addDays(date: string, n: number): string {
  const t = Date.parse(`${date}T00:00:00Z`) + n * DAY;
  return new Date(t).toISOString().slice(0, 10);
}

export function daysBetween(from: string, to: string): number {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / DAY);
}

export type Previous = { r?: Rating; due?: string; at?: number; i?: number };

/**
 * Days until the next review. The base interval comes from the rating. Repeating a rating of 3 or 4 that is at least
 * as high as the last one doubles the previous interval (capped at 120 days); any lower rating falls back to the base.
 */
export function nextInterval(rating: Rating, prev?: Previous): number {
  let interval = INTERVALS[rating];
  if (prev?.r && rating >= 3 && rating >= prev.r) {
    // Items rated before the interval was stored fall back to the gap between the last activity and the due date.
    const prevInterval = prev.i ?? (prev.due && prev.at ? daysBetween(localDate(new Date(prev.at)), prev.due) : 0);
    if (prevInterval > 0) interval = Math.max(interval, Math.min(prevInterval * 2, MAX_INTERVAL));
  }
  return interval;
}

export function nextDue(rating: Rating, today: string, prev?: Previous): string {
  return addDays(today, nextInterval(rating, prev));
}

export function intervalFrom(today: string, due: string): number {
  return daysBetween(today, due);
}
