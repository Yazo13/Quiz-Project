import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

export interface Countdown {
  seconds: number;
  /** True once the clock has run out, so callers can change what they show. */
  done: boolean;
}

/**
 * Counts down to a moment rather than for a duration.
 *
 * A duration lives in state and starts over whenever the component mounts,
 * which is how the arena's tournament stayed three and three quarter hours
 * away no matter how long the app had been open. A deadline is read off the
 * clock, so remounting, backgrounding the app or leaving it open overnight
 * all give the honest answer.
 *
 * Timers are throttled or stopped outright while the app is in the
 * background, so the clock is also resynced whenever it comes back.
 */
export function useCountdownTo(deadline: number): Countdown {
  const left = () => Math.max(0, Math.round((deadline - Date.now()) / 1000));
  const [seconds, setSeconds] = useState(left);

  useEffect(() => {
    setSeconds(left());
    const id = setInterval(() => setSeconds(left()), 1000);
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') setSeconds(left());
    });
    return () => {
      clearInterval(id);
      sub.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deadline]);

  return { seconds, done: seconds <= 0 };
}
