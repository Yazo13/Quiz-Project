import { useEffect, useState } from 'react';

export interface Countdown {
  seconds: number;
  /** True once the clock has run out, so callers can change what they show. */
  done: boolean;
}

/**
 * Ticks down once a second and stops.
 *
 * It used to keep an interval running forever after reaching zero, writing 0
 * over 0 once a second for as long as the screen stayed open, and it gave the
 * caller no way to tell "three hours left" from "already started" — the arena
 * sat on 00:00:00 with the seat still on sale.
 *
 * The interval is torn down when the clock finishes rather than left spinning.
 */
export function useCountdown(initialSeconds: number): Countdown {
  const [seconds, setSeconds] = useState(() => Math.max(0, Math.floor(initialSeconds)));
  const done = seconds <= 0;

  useEffect(() => {
    if (done) return;
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [done]);

  return { seconds, done };
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
