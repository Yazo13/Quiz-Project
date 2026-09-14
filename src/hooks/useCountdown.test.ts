import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { formatHMS } from './useCountdown.ts';

describe('formatHMS', () => {
  it('pads every field to two digits', () => {
    assert.deepEqual(formatHMS(0), { h: '00', m: '00', s: '00' });
    assert.deepEqual(formatHMS(9), { h: '00', m: '00', s: '09' });
    assert.deepEqual(formatHMS(61), { h: '00', m: '01', s: '01' });
  });

  it('splits hours, minutes and seconds', () => {
    // The arena's own starting figure.
    assert.deepEqual(formatHMS(3 * 3600 + 47 * 60 + 22), { h: '03', m: '47', s: '22' });
  });

  it('lets the hour field grow past two digits rather than wrapping', () => {
    assert.deepEqual(formatHMS(100 * 3600), { h: '100', m: '00', s: '00' });
  });

  it('clamps a negative count rather than printing a minus', () => {
    assert.deepEqual(formatHMS(-5), { h: '00', m: '00', s: '00' });
  });

  it('ignores a fractional second', () => {
    assert.deepEqual(formatHMS(61.9), { h: '00', m: '01', s: '01' });
  });
});
