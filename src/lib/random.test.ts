import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { pick, shuffle } from './random.ts';

/** Enough draws that a real bias shows and sampling noise does not. */
const DRAWS = 60_000;

describe('shuffle', () => {
  it('keeps every item, losing and duplicating none', () => {
    for (let attempt = 0; attempt < 200; attempt++) {
      const out = shuffle([1, 2, 3, 4, 5]);
      assert.deepEqual([...out].sort(), [1, 2, 3, 4, 5]);
    }
  });

  it('handles the degenerate sizes without complaint', () => {
    assert.deepEqual(shuffle([]), []);
    assert.deepEqual(shuffle([7]), [7]);
  });

  it('actually reorders', () => {
    const inOrder = [1, 2, 3, 4, 5, 6].join();
    let moved = false;
    for (let attempt = 0; attempt < 50 && !moved; attempt++) {
      if (shuffle([1, 2, 3, 4, 5, 6]).join() !== inOrder) moved = true;
    }
    assert.ok(moved);
  });

  it('puts each item in each position about equally often', () => {
    // The property the sort-based shortcut fails.
    const size = 4;
    const seen = Array.from({ length: size }, () => new Array(size).fill(0));
    for (let draw = 0; draw < DRAWS; draw++) {
      shuffle([0, 1, 2, 3]).forEach((item, position) => {
        seen[item][position]++;
      });
    }

    const expected = DRAWS / size;
    for (let item = 0; item < size; item++) {
      for (let position = 0; position < size; position++) {
        const share = seen[item][position] / expected;
        assert.ok(
          share > 0.9 && share < 1.1,
          `item ${item} landed in position ${position} ${(share * 100).toFixed(0)}% of the expected rate`,
        );
      }
    }
  });
});

describe('pick', () => {
  it('draws the number asked for', () => {
    assert.equal(pick([1, 2, 3], 2).length, 2);
    assert.equal(pick([1, 2, 3], 0).length, 0);
  });

  it('draws what it can when asked for more than there is', () => {
    assert.equal(pick([1, 2], 5).length, 2);
    assert.equal(pick([1, 2], -1).length, 0);
  });

  it('never draws the same item twice', () => {
    for (let attempt = 0; attempt < 500; attempt++) {
      const drawn = pick([1, 2, 3, 4, 5], 3);
      assert.equal(new Set(drawn).size, 3);
    }
  });

  it('leaves the array it was given alone', () => {
    const source = [1, 2, 3, 4];
    pick(source, 2);
    assert.deepEqual(source, [1, 2, 3, 4]);
  });

  it('draws two from three without favouring any of them', () => {
    // Exactly the 50/50's draw. The old code gave 50% / 25% / 25%.
    const seen = [0, 0, 0];
    for (let draw = 0; draw < DRAWS; draw++) {
      for (const i of pick([0, 1, 2], 2)) seen[i]++;
    }

    const expected = (DRAWS * 2) / 3;
    for (let i = 0; i < 3; i++) {
      const share = seen[i] / expected;
      assert.ok(
        share > 0.95 && share < 1.05,
        `index ${i} was drawn ${(share * 100).toFixed(0)}% of the expected rate`,
      );
    }
  });
});
