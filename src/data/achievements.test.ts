import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { achievements, sortForShelf, type AchievementId } from './achievements.ts';
import type { RoundResult } from '../store/game.ts';

let seq = 0;
function round(over: Partial<RoundResult> = {}): RoundResult {
  seq++;
  return {
    id: `r${seq}`,
    at: 1_000_000 + seq * 1000,
    correct: 5,
    total: 10,
    bestStreak: 2,
    points: 600,
    earned: 15,
    avgMs: 4000,
    ...over,
  };
}

const earnedIds = (rounds: RoundResult[], tokens = 0) =>
  achievements({ rounds, tokens })
    .filter((a) => a.earned)
    .map((a) => a.id)
    .sort();

describe('achievements', () => {
  it('gives a new player nothing', () => {
    assert.deepEqual(earnedIds([]), []);
  });

  it('awards the first round for finishing one, however badly', () => {
    assert.deepEqual(earnedIds([round({ correct: 0 })]), ['firstRound']);
  });

  it('separates finishing from winning', () => {
    assert.ok(!earnedIds([round({ correct: 5 })]).includes('firstWin'));
    assert.ok(earnedIds([round({ correct: 6 })]).includes('firstWin'));
  });

  it('awards a perfect round only when nothing was missed', () => {
    assert.ok(!earnedIds([round({ correct: 9, total: 10 })]).includes('perfect'));
    assert.ok(earnedIds([round({ correct: 10, total: 10 })]).includes('perfect'));
  });

  it('does not count an empty round as perfect', () => {
    assert.ok(!earnedIds([round({ correct: 0, total: 0 })]).includes('perfect'));
  });

  it('wants the quick round to be a won one', () => {
    // Fast but wrong is racing, not skill.
    assert.ok(!earnedIds([round({ avgMs: 1000, correct: 2 })]).includes('quickDraw'));
    assert.ok(earnedIds([round({ avgMs: 1000, correct: 8 })]).includes('quickDraw'));
  });

  it('counts a ten-answer streak across any round', () => {
    assert.ok(!earnedIds([round({ bestStreak: 9 })]).includes('streak10'));
    assert.ok(earnedIds([round({ bestStreak: 10 })]).includes('streak10'));
  });

  it('counts rounds and tokens toward the ones that accumulate', () => {
    const list = achievements({ rounds: [round(), round()], tokens: 1250 });
    const regular = list.find((a) => a.id === 'regular')!;
    const hoard = list.find((a) => a.id === 'hoard')!;

    assert.deepEqual(regular.progress, { have: 2, need: 25 });
    assert.deepEqual(hoard.progress, { have: 1250, need: 5000 });
    assert.ok(!regular.earned && !hoard.earned);
  });

  it('does not let progress run past the target', () => {
    const list = achievements({ rounds: [], tokens: 99_999 });
    const hoard = list.find((a) => a.id === 'hoard')!;
    assert.deepEqual(hoard.progress, { have: 5000, need: 5000 });
    assert.ok(hoard.earned);
  });

  it('dates an award from the earliest round that earned it', () => {
    const first = round({ correct: 10, total: 10, at: 500 });
    const later = round({ correct: 10, total: 10, at: 9000 });
    // Stored newest first.
    const list = achievements({ rounds: [later, first], tokens: 0 });
    assert.equal(list.find((a) => a.id === 'perfect')!.at, 500);
  });
});

describe('sortForShelf', () => {
  it('puts earned first, then whatever is closest', () => {
    const list = achievements({ rounds: [round(), round()], tokens: 4000 });
    const order = sortForShelf(list);

    const firstUnearned = order.findIndex((a) => !a.earned);
    assert.ok(order.slice(0, firstUnearned).every((a) => a.earned));
    assert.ok(order.slice(firstUnearned).every((a) => !a.earned));

    // 4000/5000 beats 2/25, so the hoard should lead the locked ones.
    const locked = order.slice(firstUnearned).map((a) => a.id as AchievementId);
    assert.ok(locked.indexOf('hoard') < locked.indexOf('regular'));
  });

  it('leaves the input alone', () => {
    const list = achievements({ rounds: [round()], tokens: 0 });
    const before = list.map((a) => a.id);
    sortForShelf(list);
    assert.deepEqual(
      list.map((a) => a.id),
      before,
    );
  });
});
