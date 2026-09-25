import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { LIVE_MINUTES, START_HOUR, tournamentAt } from './tournament.ts';

/** A local-time timestamp, so the test reads the way the schedule does. */
const at = (day: number, h: number, m = 0, s = 0) =>
  new Date(2026, 8, day, h, m, s).getTime();

describe('tournamentAt', () => {
  it('counts down to this evening from the morning', () => {
    const { live, secondsUntil, startsAt } = tournamentAt(at(24, 9, 0));
    assert.equal(live, false);
    assert.equal(secondsUntil, (START_HOUR - 9) * 3600);
    assert.equal(new Date(startsAt).getHours(), START_HOUR);
    assert.equal(new Date(startsAt).getDate(), 24);
  });

  it('is live from the opening second', () => {
    assert.equal(tournamentAt(at(24, START_HOUR, 0, 0)).live, true);
    assert.equal(tournamentAt(at(24, START_HOUR, LIVE_MINUTES - 1)).live, true);
  });

  it('closes after its hour and points at tomorrow', () => {
    const after = tournamentAt(at(24, START_HOUR + 1, 0, 1));
    assert.equal(after.live, false);
    assert.equal(new Date(after.startsAt).getDate(), 25);
    assert.equal(new Date(after.startsAt).getHours(), START_HOUR);
  });

  it('never reports a negative wait', () => {
    for (let h = 0; h < 24; h++) {
      assert.ok(tournamentAt(at(24, h, 30)).secondsUntil >= 0, `hour ${h}`);
    }
  });

  it('gives the same answer for the same moment, however often it is asked', () => {
    const moment = at(24, 11, 22, 33);
    assert.deepEqual(tournamentAt(moment), tournamentAt(moment));
  });

  it('keeps ticking down rather than resetting, minute by minute', () => {
    let previous = Infinity;
    for (let m = 0; m < 180; m++) {
      const { secondsUntil } = tournamentAt(at(24, 9, m));
      assert.ok(secondsUntil < previous, `minute ${m} did not advance`);
      previous = secondsUntil;
    }
  });
});
