import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { ARM_TIMEOUT } from './useArmed.ts';

/**
 * useArmed is a hook, so its behaviour is exercised through the screens. What
 * is worth pinning here is the timeout itself: long enough that a deliberate
 * second tap lands, short enough that a control cannot sit primed while the
 * screen is left open and then fire on an unrelated later tap.
 */
describe('the arming window', () => {
  it('leaves room for a deliberate second tap', () => {
    assert.ok(ARM_TIMEOUT >= 2000, 'too short to confirm without rushing');
  });

  it('does not outlive the player’s attention', () => {
    assert.ok(ARM_TIMEOUT <= 10_000, 'a primed control should not survive a detour');
  });
});
