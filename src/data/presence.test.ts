import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { presenceAt, seedFor } from './presence.ts';

const BASE = 12_408;
const MINUTE = 60_000;

describe('presenceAt', () => {
  it('returns the same figure for the same moment', () => {
    assert.equal(presenceAt(BASE, 0, 1_000_000), presenceAt(BASE, 0, 1_000_000));
  });

  it('stays within a plausible band of the baseline', () => {
    for (let minute = 0; minute < 600; minute++) {
      const value = presenceAt(BASE, 0, minute * MINUTE);
      assert.ok(
        value >= BASE * 0.95 && value <= BASE * 1.05,
        `drifted to ${value} at minute ${minute}`,
      );
    }
  });

  it('actually moves over the course of an hour', () => {
    // Sampled at the rate the screen re-reads the clock. Sampling on a
    // multiple of the drift period instead would alias down to a handful of
    // values and say nothing about what a player sees.
    const seen = new Set<number>();
    for (let second = 0; second < 3600; second += 8) {
      seen.add(presenceAt(BASE, 0, second * 1000));
    }
    assert.ok(seen.size > 200, `only ${seen.size} distinct figures in an hour`);
  });

  it('keeps rows off each other, so they do not rise and fall together', () => {
    const at = 4 * MINUTE;
    const a = presenceAt(1000, seedFor('geography'), at);
    const b = presenceAt(1000, seedFor('jackpot'), at);
    assert.notEqual(a, b);
  });

  it('never goes negative, whatever the baseline', () => {
    for (let minute = 0; minute < 100; minute++) {
      assert.ok(presenceAt(0, 1.5, minute * MINUTE) >= 0);
      assert.ok(presenceAt(3, 0.2, minute * MINUTE) >= 0);
    }
  });

  it('returns whole people', () => {
    for (let minute = 0; minute < 50; minute++) {
      assert.equal(presenceAt(BASE, 0.7, minute * MINUTE) % 1, 0);
    }
  });
});

describe('seedFor', () => {
  it('is stable for a key', () => {
    assert.equal(seedFor('cellar'), seedFor('cellar'));
  });

  it('separates the keys the arena actually uses', () => {
    const keys = ['geography', 'tech', 'culture', 'cellar', 'jackpot', 'nightOwl'];
    assert.equal(new Set(keys.map(seedFor)).size, keys.length);
  });
});
