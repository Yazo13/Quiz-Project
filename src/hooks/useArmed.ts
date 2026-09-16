import { useCallback, useEffect, useRef, useState } from 'react';

/** How long an armed control waits for its second press before giving up. */
export const ARM_TIMEOUT = 4000;

/**
 * Two-press confirmation, without a dialog.
 *
 * The first press arms a control and the second one commits it. Nothing is
 * blocked and no modal is thrown in the way — the button itself changes to say
 * what the next press will do, and forgets after a few seconds so a control
 * cannot sit primed while the screen is left open.
 *
 * `press` returns true when the value was already armed, which is the caller's
 * cue to go ahead. Arming a different value moves the arm rather than
 * confirming, so a misfire on a neighbouring row cannot commit the wrong one.
 */
export function useArmed<T>(timeout = ARM_TIMEOUT) {
  const [armed, setArmed] = useState<T | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  }, []);

  useEffect(() => clear, [clear]);

  const disarm = useCallback(() => {
    clear();
    setArmed(null);
  }, [clear]);

  const press = useCallback(
    (value: T) => {
      clear();
      if (armed === value) {
        setArmed(null);
        return true;
      }
      setArmed(value);
      timer.current = setTimeout(() => setArmed(null), timeout);
      return false;
    },
    [armed, clear, timeout],
  );

  return { armed, press, disarm };
}
