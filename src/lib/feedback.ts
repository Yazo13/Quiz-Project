import * as Haptics from 'expo-haptics';

import { useGame } from '../store/game';

/**
 * Haptics, with an off switch.
 *
 * Every press in the app buzzed and there was no way to stop it — the tab bar,
 * every answer, every purchase. Plenty of people turn vibration off at the OS
 * level for exactly this, but Android apps can fire haptics regardless, so the
 * setting has to live here.
 *
 * The store is read imperatively rather than through a hook: these are called
 * from event handlers, not render, and threading a hook through every button
 * would put the setting in the way of the code that uses it.
 */
function enabled() {
  return useGame.getState().haptics;
}

/** A press landed. The lightest of the three. */
export function tapped() {
  if (enabled()) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

/** Something went right — a correct answer, a completed purchase. */
export function succeeded() {
  if (enabled()) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}

/** Something went wrong — a wrong answer. */
export function failed() {
  if (enabled()) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
}

/** Time ran out. Distinct from a wrong answer, which the player chose. */
export function warned() {
  if (enabled()) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
}
