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
