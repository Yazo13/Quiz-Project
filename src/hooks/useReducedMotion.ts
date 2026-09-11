import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/**
 * Whether the viewer has asked the OS to reduce motion.
 *
 * The design leans on perpetual motion — the mesh field breathes, the balance
 * pulses, the live dot and the streak flame never stop. That is the intended
 * character, but ambient animation with no off switch is a real problem for
 * vestibular disorders, and the setting exists precisely so an app can stand
 * down.
 *
 * Animation that carries information is exempt and stays on: the quiz timer
 * bar is the clock, not decoration, and freezing it would hide the one thing
 * the screen exists to communicate.
 */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let active = true;

    AccessibilityInfo.isReduceMotionEnabled()
      .then((value) => {
        if (active) setReduced(value);
      })
      .catch(() => {});

    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced);

    return () => {
      active = false;
      sub.remove();
    };
  }, []);

  return reduced;
}
