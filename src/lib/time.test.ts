import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { formatHMS, startOfDay, startOfDays } from './time.ts';

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

describe('startOfDay', () => {
  it('returns local midnight of the day it is given', () => {
    const noon = new Date(2026, 8, 25, 12, 34, 56, 789).getTime();
    const midnight = new Date(2026, 8, 25, 0, 0, 0, 0).getTime();
    assert.equal(startOfDay(noon), midnight);
  });

  it('leaves midnight itself alone', () => {
    const midnight = new Date(2026, 8, 25, 0, 0, 0, 0).getTime();
    assert.equal(startOfDay(midnight), midnight);
  });

  it('does not reach back into yesterday in the small hours', () => {
    // The case a rolling 24-hour window gets wrong: at 01:00, yesterday
    // evening is not today.
    const oneAm = new Date(2026, 8, 25, 1, 0).getTime();
    const yesterdayEvening = new Date(2026, 8, 24, 21, 0).getTime();
    assert.ok(yesterdayEvening < startOfDay(oneAm));
  });
});

describe('startOfDays', () => {
  it('counts today as one day', () => {
    const now = new Date(2026, 8, 25, 15, 0).getTime();
    assert.equal(startOfDays(1, now), startOfDay(now));
  });

  it('includes today and the six before it for a week', () => {
    const now = new Date(2026, 8, 25, 15, 0).getTime();
    assert.equal(startOfDays(7, now), new Date(2026, 8, 19, 0, 0, 0, 0).getTime());
  });

  it('crosses a month boundary by the calendar, not by arithmetic', () => {
    const now = new Date(2026, 8, 3, 15, 0).getTime();
    assert.equal(startOfDays(7, now), new Date(2026, 7, 28, 0, 0, 0, 0).getTime());
  });

  it('never returns a window shorter than a day', () => {
    const now = new Date(2026, 8, 25, 15, 0).getTime();
    assert.equal(startOfDays(0, now), startOfDay(now));
    assert.equal(startOfDays(-5, now), startOfDay(now));
  });
});
