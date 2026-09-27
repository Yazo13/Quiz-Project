import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  achievements,
  earnedByRound,
  sortForShelf,
  type AchievementId,
} from './achievements.ts';
import type { RoundResult } from '../lib/score.ts';

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

const earnedIds = (
  rounds: RoundResult[],
  tokens = 0,
  awarded: Record<string, number> = {},
) =>
  achievements({ rounds, tokens, awarded })
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

describe('earnedByRound', () => {
  it('always credits the round itself', () => {
    assert.deepEqual(earnedByRound(round({ correct: 0 })), ['firstRound']);
  });

  it('credits a win, and a perfect one twice over', () => {
    assert.deepEqual(earnedByRound(round({ correct: 6 })), ['firstRound', 'firstWin']);
    assert.deepEqual(earnedByRound(round({ correct: 10 })), [
      'firstRound',
      'firstWin',
      'perfect',
    ]);
  });

  it('credits a long streak whether or not the round was won', () => {
    assert.ok(earnedByRound(round({ correct: 2, bestStreak: 10 })).includes('streak10'));
  });

  it('will not credit speed for a round that was lost', () => {
    const fast = round({ correct: 2, avgMs: 1000 });
    assert.ok(!earnedByRound(fast).includes('quickDraw'), 'racing through wrong answers');
    assert.ok(earnedByRound(round({ correct: 8, avgMs: 1000 })).includes('quickDraw'));
  });

  it('agrees with what the shelf derives from the same round', () => {
    for (const r of [
      round({ correct: 0 }),
      round({ correct: 6 }),
      round({ correct: 10, bestStreak: 10, avgMs: 900 }),
    ]) {
      assert.deepEqual(earnedByRound(r).sort(), earnedIds([r]));
    }
  });
});

describe('a banked trophy', () => {
  it('stays on the shelf after its round is gone', () => {
    // The bug: the perfect round has scrolled out of the capped history, so
    // nothing in `rounds` shows it any more.
    const later = [round({ correct: 5 })];
    assert.ok(!earnedIds(later).includes('perfect'), 'nothing left to derive it from');
    assert.ok(earnedIds(later, 0, { perfect: 42 }).includes('perfect'));
  });

  it('keeps the date it was actually earned on', () => {
    const shelf = achievements({
      rounds: [round({ at: 9_000_000 })],
      tokens: 0,
      awarded: { firstRound: 123 },
    });
    assert.equal(shelf.find((a) => a.id === 'firstRound')?.at, 123);
  });

  it('is earned even with no rounds left at all', () => {
    assert.deepEqual(earnedIds([], 0, { firstWin: 1, streak10: 2 }), [
      'firstWin',
      'streak10',
    ]);
  });

  it('does not invent one the record has not banked', () => {
    assert.ok(!earnedIds([round({ correct: 5 })], 0, {}).includes('firstWin'));
  });
});

describe('the regular trophy', () => {
  const held = (played: number) =>
    achievements({ rounds: [], tokens: 0, played }).find((a) => a.id === 'regular')!;

  it('counts rounds finished, not rounds still stored', () => {
    // The stored history caps at thirty, so its length cannot be the count.
    assert.equal(held(24).earned, false);
    assert.equal(held(25).earned, true);
    assert.deepEqual(held(24).progress, { have: 24, need: 25 });
  });

  it('does not show more progress than the trophy needs', () => {
    assert.deepEqual(held(300).progress, { have: 25, need: 25 });
  });

  it('falls back to the rounds it was given when no count comes with them', () => {
    const shelf = achievements({ rounds: [round(), round()], tokens: 0 });
    assert.deepEqual(shelf.find((a) => a.id === 'regular')?.progress, {
      have: 2,
      need: 25,
    });
  });
});
