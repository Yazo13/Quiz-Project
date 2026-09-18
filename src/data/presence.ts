import { useEffect, useState } from 'react';

/**
 * How many people the arena claims are playing.
 *
 * Every figure on that screen was a literal — "12,408 live" beside a pulsing
 * dot, and a fixed player count on each battle row. The dot animated, the
 * numbers never moved, and the longer the screen stayed open the more plainly
 * it read as a picture of a busy app rather than a busy app.
 *
 * There is no server to ask, so these are simulated, exactly like the rival
 * roster. The point of putting them here is that the simulation is named and
 * in one place: when a presence endpoint exists, this module is what it
 * replaces, and no screen has to change.
 *
 * The drift is a slow sine rather than a random walk. Random jitter reads as
 * noise and can swing in a way a real crowd would not; a sine wanders within a
 * band and stays plausible however long you watch it.
 */

/** How far a figure may stray from its baseline, as a fraction. */
const SWING = 0.04;
/** The quicker wander, in ms. Slow enough that a glance sees a steady number. */
const PERIOD = 6 * 60_000;
/**
 * A second, slower wander laid over the first.
 *
 * One sine alone repeats exactly every PERIOD, and six minutes is short
 * enough for someone watching the arena to notice the same figures coming
 * back around. Two periods that do not divide into each other take far longer
 * to line up again than anyone will sit on the screen.
 */
const SLOW_PERIOD = 43 * 60_000;
const SLOW_SHARE = 0.35;
/** How often the screen re-reads the clock. */
const TICK = 8_000;

/**
 * The count for one baseline at a given moment.
 *
 * Deterministic: the same baseline, seed and timestamp always give the same
 * figure, which keeps two rows from moving in lockstep and makes it testable.
 */
export function presenceAt(base: number, seed: number, at: number): number {
  const fast = Math.sin((at / PERIOD) * Math.PI * 2 + seed);
  const slow = Math.sin((at / SLOW_PERIOD) * Math.PI * 2 + seed * 1.7);
  const wander = fast * (1 - SLOW_SHARE) + slow * SLOW_SHARE;
  return Math.max(0, Math.round(base * (1 + wander * SWING)));
}

/** Re-renders on a slow tick so the figures above it move. */
export function usePresenceClock(tick = TICK): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), tick);
    return () => clearInterval(id);
  }, [tick]);

  return now;
}

/** Turns a key into a stable phase offset, so rows drift independently. */
export function seedFor(key: string): number {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) % 628;
  return h / 100;
}
