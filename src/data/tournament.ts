/**
 * When the featured tournament runs.
 *
 * The arena's countdown started from a literal — three hours, forty-seven
 * minutes, twenty-two seconds — held in React state. It reset to that figure
 * every time the screen mounted, so switching to the wallet and back put the
 * tournament three and three quarter hours away again, and it never once
 * reached zero.
 *
 * There is no scheduling endpoint to ask, so the schedule is derived from the
 * wall clock instead: the same rule on every device, no state to drift, and a
 * countdown that survives a tab switch, a backgrounded app and midnight. When
 * a real schedule arrives this module is what it replaces.
 */

/** The tournament the arena currently features. */
export const GRAND_ID = 'grand-tsinandali';

/** Local hour the round opens. Evening, when the crowd figures peak. */
export const START_HOUR = 20;
/** How long it stays open once it has begun. */
export const LIVE_MINUTES = 60;

const HOUR = 3_600_000;
const DAY = 24 * HOUR;

export interface Tournament {
  /** When the next sitting opens, as a timestamp. */
  startsAt: number;
  /** True while a sitting is underway, which changes the seat's label. */
  live: boolean;
  /** Seconds until it opens; zero while one is live. */
  secondsUntil: number;
}

/**
 * The schedule as of `at`.
 *
 * Deterministic, and in local time on purpose — a tournament billed as an
 * evening fixture should be an evening fixture wherever it is read.
 */
export function tournamentAt(at: number = Date.now()): Tournament {
  const start = new Date(at);
  start.setHours(START_HOUR, 0, 0, 0);
  let startsAt = start.getTime();

  const liveUntil = startsAt + LIVE_MINUTES * 60_000;
  if (at >= startsAt && at < liveUntil) {
    return { startsAt, live: true, secondsUntil: 0 };
  }

  // Past today's sitting, so the next one is tomorrow's. Built from a fresh
  // Date rather than by adding a day of milliseconds, which would land an
  // hour out either side of a daylight-saving change.
  if (at >= liveUntil) {
    const next = new Date(startsAt + DAY);
    next.setHours(START_HOUR, 0, 0, 0);
    startsAt = next.getTime();
  }

  return {
    startsAt,
    live: false,
    secondsUntil: Math.max(0, Math.round((startsAt - at) / 1000)),
  };
}
