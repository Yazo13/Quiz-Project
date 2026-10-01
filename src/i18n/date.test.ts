import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { en } from './en.ts';
import { ka } from './ka.ts';
import { dateParts } from '../lib/time.ts';

/**
 * `dateLabel` itself lives in the barrel, which pulls in React and the store.
 * Its two halves are testable on their own, and they are the parts that were
 * wrong: the split, and the tables.
 */
const label = (at: number, strings: typeof en) => {
  const { day, month, year } = dateParts(at);
  return strings.date(day, strings.months[month], year);
};

describe('the month tables', () => {
  it('each name twelve months', () => {
    assert.equal(en.months.length, 12);
    assert.equal(ka.months.length, 12);
  });

  it('repeat none of them', () => {
    assert.equal(new Set(en.months).size, 12);
    assert.equal(new Set(ka.months).size, 12);
  });

  it('are actually translated', () => {
    for (let i = 0; i < 12; i++) {
      assert.notEqual(ka.months[i], en.months[i], `month ${i}`);
    }
  });
});

describe('a formatted date', () => {
  const at = new Date(2026, 8, 4).getTime();

  it('reads in the app language, not the device one', () => {
    assert.equal(label(at, en), '4 Sep 2026');
    assert.equal(label(at, ka as typeof en), '4 სექ, 2026');
  });

  it('carries the day, the month and the year in both', () => {
    for (const strings of [en, ka as typeof en]) {
      const out = label(at, strings);
      assert.match(out, /4/);
      assert.match(out, /2026/);
      assert.ok(out.includes(strings.months[8]));
    }
  });

  it('names every month without falling off the table', () => {
    for (let m = 0; m < 12; m++) {
      const out = label(new Date(2026, m, 15).getTime(), en);
      assert.ok(!out.includes('undefined'), `month ${m}`);
    }
  });
});
