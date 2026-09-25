/**
 * Relative timestamps, split into a unit and a value rather than a finished
 * string, so the wallet can render them in either language without this file
 * knowing anything about wording.
 */

export type RelativeUnit = 'now' | 'minute' | 'hour' | 'day';

export interface Relative {
  unit: RelativeUnit;
  value: number;
}

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function relative(at: number, now = Date.now()): Relative {
  const ago = Math.max(0, now - at);
  if (ago < MINUTE) return { unit: 'now', value: 0 };
  if (ago < HOUR) return { unit: 'minute', value: Math.floor(ago / MINUTE) };
  if (ago < DAY) return { unit: 'hour', value: Math.floor(ago / HOUR) };
  return { unit: 'day', value: Math.floor(ago / DAY) };
}

/** Splits a second count into zero-padded hh / mm / ss. */
export function formatHMS(total: number) {
  const safe = Math.max(0, Math.floor(total));
  const pad = (n: number) => String(n).padStart(2, '0');
  return {
    h: pad(Math.floor(safe / 3600)),
    m: pad(Math.floor((safe % 3600) / 60)),
    s: pad(safe % 60),
  };
}

/**
 * Midnight at the start of the local day containing `at`.
 *
 * Windows built by subtracting a fixed number of hours drift against the
 * calendar: at one in the morning a rolling twenty-four hours still holds
 * most of yesterday evening, which is not what "today" says. Built from a
 * Date so a daylight-saving change moves the boundary with the clock.
 */
export function startOfDay(at: number = Date.now()): number {
  const d = new Date(at);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/**
 * Midnight at the start of a window of `days` calendar days ending today.
 * `days = 1` is today alone; `days = 7` is today and the six before it.
 */
export function startOfDays(days: number, at: number = Date.now()): number {
  const d = new Date(startOfDay(at));
  d.setDate(d.getDate() - (Math.max(1, Math.floor(days)) - 1));
  return d.getTime();
}
