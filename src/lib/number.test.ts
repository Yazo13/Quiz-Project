import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { group } from './number.ts';

describe('group', () => {
  it('leaves short numbers alone', () => {
    assert.equal(group(0), '0');
    assert.equal(group(7), '7');
    assert.equal(group(999), '999');
  });

  it('groups from the right in threes', () => {
    assert.equal(group(1000), '1,000');
    assert.equal(group(12408), '12,408');
    assert.equal(group(123456), '123,456');
    assert.equal(group(1234567), '1,234,567');
  });

  it('keeps the sign outside the grouping', () => {
    assert.equal(group(-50), '-50');
    assert.equal(group(-12408), '-12,408');
  });

  it('truncates rather than rounding, so a balance never reads high', () => {
    assert.equal(group(1248.9), '1,248');
  });
});
