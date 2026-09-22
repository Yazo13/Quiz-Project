import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  CATEGORY_KEYS,
  ROUND_LENGTH,
  asCategory,
  bankFor,
  buildRound,
  questions,
  shuffleAnswers,
} from './questions.ts';

describe('the question bank', () => {
  it('holds at least a full round, or rounds would repeat', () => {
    assert.ok(
      questions.length >= ROUND_LENGTH,
      `bank has ${questions.length}, a round needs ${ROUND_LENGTH}`,
    );
  });

  it('lets every category field a full round on its own', () => {
    const counts = new Map<string, number>();
    for (const q of questions) counts.set(q.category, (counts.get(q.category) ?? 0) + 1);

    for (const [category, count] of counts) {
      assert.ok(
        count >= ROUND_LENGTH,
        `${category} has ${count}, a round needs ${ROUND_LENGTH}`,
      );
    }
  });

  it('covers every category the arena offers', () => {
    const offered = ['travel', 'tech', 'cash', 'experience'];
    const present = new Set(questions.map((q) => q.category));
    // `cash` is a prize type rather than a subject, so it is deliberately not
    // a question category — the rest must be there.
    for (const category of offered.filter((c) => c !== 'cash')) {
      assert.ok(present.has(category as never), `no questions for ${category}`);
    }
  });

  it('gives every question a unique id and media id', () => {
    assert.equal(new Set(questions.map((q) => q.id)).size, questions.length);
    assert.equal(new Set(questions.map((q) => q.mediaId)).size, questions.length);
  });

  it('carries four answers in both languages', () => {
    for (const q of questions) {
      assert.equal(q.answers.en.length, 4, `question ${q.id}`);
      assert.equal(q.answers.ka.length, 4, `question ${q.id}`);
      assert.ok(q.prompt.en.length > 0 && q.prompt.ka.length > 0, `question ${q.id}`);
    }
  });

  it('points `correct` at an answer that exists', () => {
    for (const q of questions) {
      assert.ok(q.correct >= 0 && q.correct <= 3, `question ${q.id}`);
      assert.ok(q.answers.en[q.correct], `question ${q.id}`);
      assert.ok(q.answers.ka[q.correct], `question ${q.id}`);
    }
  });

  it('does not always put the answer in the same slot', () => {
    const slots = new Set(questions.map((q) => q.correct));
    assert.ok(slots.size >= 3, 'a predictable slot is a free pass for the player');
  });
});

describe('buildRound', () => {
  it('deals a full round', () => {
    assert.equal(buildRound().length, ROUND_LENGTH);
  });

  it('never repeats a question inside one round', () => {
    // Shuffled, so worth running more than once.
    for (let attempt = 0; attempt < 200; attempt++) {
      const round = buildRound();
      assert.equal(new Set(round.map((q) => q.id)).size, round.length);
    }
  });

  it('only deals questions from the bank', () => {
    const ids = new Set(questions.map((q) => q.id));
    for (const q of buildRound()) assert.ok(ids.has(q.id));
  });

  it('shuffles rather than dealing the bank in order', () => {
    const inOrder = questions
      .slice(0, ROUND_LENGTH)
      .map((q) => q.id)
      .join();
    let differed = false;
    for (let attempt = 0; attempt < 50 && !differed; attempt++) {
      if (buildRound().map((q) => q.id).join() !== inOrder) differed = true;
    }
    assert.ok(differed);
  });

  it('deals what it can when the bank is smaller than a round', () => {
    const short = questions.slice(0, 3);
    assert.equal(buildRound(ROUND_LENGTH, short).length, 3);
  });

  it('reorders the answers it deals', () => {
    const original = questions[0].answers.en.join();
    let moved = false;
    for (let attempt = 0; attempt < 50 && !moved; attempt++) {
      const dealt = buildRound(ROUND_LENGTH).find((q) => q.id === questions[0].id);
      if (dealt && dealt.answers.en.join() !== original) moved = true;
    }
    assert.ok(moved, 'a fixed position is memorable across rounds');
  });
});

describe('bankFor', () => {
  it('plays the whole bank when no subject is given', () => {
    assert.equal(bankFor().length, questions.length);
    assert.equal(bankFor(undefined).length, questions.length);
  });

  it('narrows to one subject, and only that subject', () => {
    for (const key of CATEGORY_KEYS) {
      const bank = bankFor(key);
      assert.ok(bank.length > 0, `${key} is empty`);
      assert.ok(bank.every((q) => q.category === key), `${key} leaked another subject`);
    }
  });

  it('still fills a full round after narrowing', () => {
    for (const key of CATEGORY_KEYS) {
      const round = buildRound(ROUND_LENGTH, bankFor(key));
      assert.equal(round.length, ROUND_LENGTH, `${key} came up short`);
      assert.ok(round.every((q) => q.category === key));
    }
  });
});

describe('asCategory', () => {
  it('accepts the real ones', () => {
    for (const key of CATEGORY_KEYS) assert.equal(asCategory(key), key);
  });

  it('rejects anything else, since it arrives from a URL', () => {
    // `cash` is a prize type and has no questions — the important refusal.
    assert.equal(asCategory('cash'), undefined);
    assert.equal(asCategory(''), undefined);
    assert.equal(asCategory('Travel'), undefined);
    assert.equal(asCategory(undefined), undefined);
    assert.equal(asCategory(42), undefined);
    assert.equal(asCategory(['travel']), undefined);
  });

  it('falls back to the whole bank when it refuses', () => {
    assert.equal(bankFor(asCategory('cash')).length, questions.length);
  });
});

describe('shuffleAnswers', () => {
  it('keeps correct pointing at the same answer text', () => {
    for (const q of questions) {
      const before = { en: q.answers.en[q.correct], ka: q.answers.ka[q.correct] };
      for (let attempt = 0; attempt < 50; attempt++) {
        const dealt = shuffleAnswers(q);
        assert.equal(dealt.answers.en[dealt.correct], before.en, `question ${q.id}`);
        assert.equal(dealt.answers.ka[dealt.correct], before.ka, `question ${q.id}`);
      }
    }
  });

  it('keeps both languages in the same order', () => {
    for (const q of questions) {
      const dealt = shuffleAnswers(q);
      // Every English answer must sit at the index its Georgian twin does.
      for (let i = 0; i < 4; i++) {
        const source = q.answers.en.indexOf(dealt.answers.en[i]);
        assert.equal(dealt.answers.ka[i], q.answers.ka[source], `question ${q.id}`);
      }
    }
  });

  it('keeps all four answers, losing and duplicating none', () => {
    for (const q of questions) {
      const dealt = shuffleAnswers(q);
      assert.deepEqual([...dealt.answers.en].sort(), [...q.answers.en].sort());
      assert.deepEqual([...dealt.answers.ka].sort(), [...q.answers.ka].sort());
    }
  });

  it('does not mutate the bank', () => {
    const snapshot = questions.map((q) => q.answers.en.join());
    questions.forEach(shuffleAnswers);
    assert.deepEqual(
      questions.map((q) => q.answers.en.join()),
      snapshot,
    );
  });
});
