import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { rivals } from './rivals.ts';

/**
 * useStandings is a hook, so the ranking itself is exercised through the data
 * it ranks. These cover the shape the board depends on — the parts that would
 * silently produce a wrong order rather than a crash.
 */

describe('the rival roster', () => {
  it('has enough players to fill a podium on every filter', () => {
    assert.ok(rivals.length >= 3);
    // The player joins the friends board too, so three friends is a full podium.
    assert.ok(rivals.filter((r) => r.friend).length >= 2);
  });

  it('gives everyone a figure for each window', () => {
    for (const r of rivals) {
      assert.equal(typeof r.points.day, 'number', r.name);
      assert.equal(typeof r.points.week, 'number', r.name);
      assert.equal(typeof r.points.all, 'number', r.name);
    }
  });

  it('keeps the windows consistent — a day cannot beat its own week', () => {
    for (const r of rivals) {
      assert.ok(r.points.day <= r.points.week, `${r.name}: day exceeds week`);
      assert.ok(r.points.week <= r.points.all, `${r.name}: week exceeds all-time`);
    }
  });

  it('orders differently by window, or the filters would look broken', () => {
    const byDay = [...rivals].sort((a, b) => b.points.day - a.points.day).map((r) => r.name);
    const byAll = [...rivals].sort((a, b) => b.points.all - a.points.all).map((r) => r.name);
    assert.notDeepEqual(byDay, byAll);
  });

  it('uses distinct names, which the board keys on', () => {
    assert.equal(new Set(rivals.map((r) => r.name)).size, rivals.length);
  });
});
