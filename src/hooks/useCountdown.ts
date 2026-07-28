import { useEffect, useState } from 'react';

/** Ticks down once a second and stops at zero. */
export function useCountdown(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  return seconds;
}

/** Splits a second count into zero-padded hh / mm / ss. */
export function formatHMS(total: number) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return {
    h: pad(Math.floor(total / 3600)),
    m: pad(Math.floor((total % 3600) / 60)),
    s: pad(total % 60),
  };
}
