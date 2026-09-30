import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { CATEGORY_KEYS } from './questions.ts';
import { battleCount, battles, battlesFor, quizHref } from './battles.ts';

describe('the battle list', () => {
  it('gives every battle its own key', () => {
    assert.equal(new Set(battles.map((b) => b.key)).size, battles.length);
  });

  it('only names subjects the question bank can actually deal', () => {
    for (const b of battles) {
      if ('subject' in b) {
        assert.ok(
          CATEGORY_KEYS.includes(b.subject),
          `${b.key} asks for ${b.subject}, which has no questions`,
        );
      }
    }
  });

  it('leaves the cash battles without a subject, since cash is a prize', () => {
    for (const b of battles) {
      assert.equal('subject' in b, b.category !== 'cash', b.key);
    }
  });
});

describe('quizHref', () => {
  it('narrows the round when the battle has a subject', () => {
    assert.equal(quizHref(battles[0]), '/quiz?subject=travel');
  });

  it('plays the whole bank when it does not', () => {
    const cash = battles.find((b) => b.category === 'cash')!;
    assert.equal(quizHref(cash), '/quiz');
  });
});

describe('battlesFor', () => {
  it('returns everything when nothing is selected', () => {
    assert.equal(battlesFor(null).length, battles.length);
  });

  it('returns only the category asked for', () => {
    const shown = battlesFor('cash');
    assert.ok(shown.length > 0);
    assert.ok(shown.every((b) => b.category === 'cash'));
  });

  it('returns nothing for a category with no battles, rather than everything', () => {
    assert.deepEqual(battlesFor('nonsense'), []);
  });
});

describe('battleCount', () => {
  it('matches what filtering to that category shows', () => {
    for (const category of new Set(battles.map((b) => b.category))) {
      assert.equal(battleCount(category), battlesFor(category).length, category);
    }
  });

  it('adds up to the whole list', () => {
    const total = [...new Set(battles.map((b) => b.category))].reduce(
      (sum, c) => sum + battleCount(c),
      0,
    );
    assert.equal(total, battles.length);
  });

  it('is zero for a category that has none', () => {
    assert.equal(battleCount('nonsense'), 0);
  });
});
