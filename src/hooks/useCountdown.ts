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
 * What is in state is the clock, not the count. The count is derived, so a
 * deadline that moves is reflected on the next render rather than needing the
 * effect to push a new number in — and the effect does nothing but subscribe,
 * which is all an effect should do.
 *
 * Timers are throttled or stopped outright while the app is in the
 * background, hence the resync when it comes back.
 */
export function useCountdownTo(deadline: number): Countdown {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const read = () => setNow(Date.now());
    const id = setInterval(read, 1000);
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') read();
    });
    return () => {
      clearInterval(id);
      sub.remove();
    };
  }, []);

  const seconds = Math.max(0, Math.round((deadline - now) / 1000));
  return { seconds, done: seconds <= 0 };
}
