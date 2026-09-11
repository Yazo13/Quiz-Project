import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { ROUND_LENGTH, buildRound, questions } from './questions.ts';

describe('the question bank', () => {
  it('holds at least a full round, or rounds would repeat', () => {
    assert.ok(
      questions.length >= ROUND_LENGTH,
      `bank has ${questions.length}, a round needs ${ROUND_LENGTH}`,
    );
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
});
