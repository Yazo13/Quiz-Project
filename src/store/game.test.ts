import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';

import { startOfDay, startOfDays } from '../lib/time.ts';

import {
  DAILY_TOKENS,
  dailyAvailable,
  ENTRY_COST,
  POWERUP_COST,
  didWin,
  MIN_WIN_LENGTH,
  WIN_SHARE,
  bank,
  earnedSince,
  pointsSince,
  roundPoints,
  roundTokens,
  useGame,
  // Node's ESM loader wants the real filename; tsconfig allows the extension.
} from './game.ts';

/**
 * The economy is the one part of the app with rules rather than layout, so it
 * is worth pinning down. The store is plain state — no React needed to drive
 * it — so these run under `node --test` with type stripping.
 */

const state = () => useGame.getState();
const START_TOKENS = 1248;
const START_POINTS = 6422;

beforeEach(() => useGame.getState().resetProgress());

describe('spending', () => {
  it('charges the balance and records the reason', () => {
    assert.equal(state().spend('entry', ENTRY_COST, 'Tsinandali'), true);
    assert.equal(state().tokens, START_TOKENS - ENTRY_COST);

    const [row] = state().ledger;
    assert.equal(row.amount, -ENTRY_COST);
    assert.equal(row.kind, 'entry');
    assert.equal(row.detail, 'Tsinandali');
  });

  it('refuses an overdraft without touching anything', () => {
    assert.equal(state().spend('entry', START_TOKENS + 1), false);
    assert.equal(state().tokens, START_TOKENS);
    assert.equal(state().ledger.length, 0);
  });

  it('allows spending down to exactly zero', () => {
    assert.equal(state().spend('pack', START_TOKENS), true);
    assert.equal(state().tokens, 0);
    assert.equal(state().spend('powerup', POWERUP_COST), false);
  });
});

describe('tournament entry', () => {
  it('charges the first join only', () => {
    assert.equal(state().joinTournament('grand', ENTRY_COST), true);
    assert.equal(state().tokens, START_TOKENS - ENTRY_COST);

    assert.equal(state().joinTournament('grand', ENTRY_COST), true);
    assert.equal(state().tokens, START_TOKENS - ENTRY_COST, 're-entry should be free');
    assert.deepEqual(state().joined, ['grand']);
  });

  it('does not mark the player as joined when they cannot pay', () => {
    state().spend('pack', START_TOKENS);
    assert.equal(state().joinTournament('grand', ENTRY_COST), false);
    assert.deepEqual(state().joined, []);
  });
});

describe('finishing a round', () => {
  it('pays per correct answer plus a streak kicker on a win', () => {
    const result = state().finishRound({ correct: 9, total: 10, bestStreak: 7, avgMs: 4200 });

    assert.equal(result.points, roundPoints(9));
    assert.equal(result.earned, roundTokens(9, 10, 7));
    assert.equal(state().tokens, START_TOKENS + result.earned);
    assert.equal(state().points, START_POINTS + result.points);
    assert.equal(state().ledger[0].kind, 'reward');
  });

  it('pays a flat consolation on a loss but still scores the answers', () => {
    const result = state().finishRound({ correct: 3, total: 10, bestStreak: 2, avgMs: 4800 });

    assert.equal(result.earned, 15);
    assert.equal(result.points, roundPoints(3));
    assert.equal(state().ledger[0].kind, 'consolation');
  });

  it('treats the threshold itself as a win', () => {
    assert.ok(roundTokens(6, 10, 0) > 15);
    assert.equal(roundTokens(5, 10, 9), 15, 'a long streak cannot rescue a loss');
  });

  it('judges a shortened round on its own length', () => {
    // Five right out of seven beats the bar; under the old flat six it was a
    // loss purely because the round was cut short.
    assert.ok(didWin(5, 7));
    assert.ok(roundTokens(5, 7, 0) > 15);
  });

  it('will not call a handful of questions a win', () => {
    assert.equal(didWin(1, 1), false, 'one right answer is not a round');
    assert.equal(didWin(4, 4), false);
    assert.equal(didWin(MIN_WIN_LENGTH, MIN_WIN_LENGTH), true);
  });

  it('measures the share, not the count', () => {
    assert.equal(didWin(6, 10), true);
    assert.equal(didWin(6, 11), false, '6 of 11 is below the share');
    assert.equal(WIN_SHARE, 0.6);
  });

  it('never wins an empty round', () => {
    assert.equal(didWin(0, 0), false);
  });

  it('carries the round peak forward as the new streak', () => {
    state().finishRound({ correct: 9, total: 10, bestStreak: 7, avgMs: 4200 });
    assert.equal(state().streak, 7);

    // A bad round resets it, even though the previous one was strong.
    state().finishRound({ correct: 1, total: 10, bestStreak: 0, avgMs: 5000 });
    assert.equal(state().streak, 0);
  });

  it('remembers the subject, so play-again can deal it again', () => {
    const played = state().finishRound({
      correct: 7,
      total: 10,
      bestStreak: 3,
      avgMs: 4100,
      subject: 'travel',
    });
    assert.equal(played.subject, 'travel');
    assert.equal(state().rounds[0].subject, 'travel');
  });

  it('leaves a mixed round without one', () => {
    const played = state().finishRound({ correct: 7, total: 10, bestStreak: 3, avgMs: 4100 });
    assert.equal(played.subject, undefined);
  });

  it('keeps rounds newest first', () => {
    state().finishRound({ correct: 4, total: 10, bestStreak: 1, avgMs: 4000 });
    state().finishRound({ correct: 8, total: 10, bestStreak: 5, avgMs: 3000 });
    assert.deepEqual(
      state().rounds.map((r) => r.correct),
      [8, 4],
    );
  });
});

describe('the per-day points tally', () => {
  const played = (correct: number) =>
    state().finishRound({ correct, total: 10, bestStreak: 0, avgMs: 4000 });

  it('records a round against today, points and tokens both', () => {
    played(7);
    assert.deepEqual(state().daily[String(startOfDay())], {
      points: roundPoints(7),
      earned: roundTokens(7, 10, 0),
    });
  });

  it('counts the daily bonus as earned, but not as points', () => {
    state().claimDaily();
    assert.deepEqual(state().daily[String(startOfDay())], {
      points: 0,
      earned: DAILY_TOKENS,
    });
  });

  it('keeps a week of earnings whatever the ledger has room for', () => {
    // The bug: this figure was summed out of the ledger, which keeps fifty
    // entries — one a round, plus one for every purchase and entry fee.
    for (let i = 0; i < 60; i++) played(7);

    assert.equal(state().ledger.length, 50, 'the ledger is still capped');
    assert.equal(
      earnedSince(state().daily, startOfDays(7)),
      60 * roundTokens(7, 10, 0),
      'every round still counts towards the week',
    );
  });

  it('adds up several rounds on the same day', () => {
    played(7);
    played(4);
    assert.equal(
      pointsSince(state().daily, startOfDay()),
      roundPoints(7) + roundPoints(4),
    );
  });

  it('keeps counting past the round history limit', () => {
    // The bug this replaced: the board summed the player's own week out of
    // `rounds`, which stops at thirty, so a heavy week lost its earliest days.
    for (let i = 0; i < 35; i++) played(7);

    assert.equal(state().rounds.length, 30, 'the display history is still capped');
    assert.equal(
      pointsSince(state().daily, startOfDays(7)),
      35 * roundPoints(7),
      'every round still counts towards the week',
    );
  });

  it('is cleared by a reset', () => {
    played(7);
    state().resetProgress();
    assert.deepEqual(state().daily, {});
  });
});

describe('pointsSince and earnedSince', () => {
  const day = (back: number) => String(startOfDays(back + 1));
  const totals = (points: number, earned: number) => ({ points, earned });

  it('are zero on an empty tally', () => {
    assert.equal(pointsSince({}, startOfDays(7)), 0);
    assert.equal(earnedSince({}, startOfDays(7)), 0);
  });

  it('count the day the window opens on', () => {
    const tally = { [day(6)]: totals(500, 90) };
    assert.equal(pointsSince(tally, startOfDays(7)), 500);
    assert.equal(earnedSince(tally, startOfDays(7)), 90);
  });

  it('leave out anything before the window', () => {
    const tally = { [day(7)]: totals(500, 90) };
    assert.equal(pointsSince(tally, startOfDays(7)), 0);
    assert.equal(earnedSince(tally, startOfDays(7)), 0);
  });

  it('sum across the days inside it, each reading its own field', () => {
    const tally = {
      [day(0)]: totals(100, 10),
      [day(3)]: totals(200, 20),
      [day(6)]: totals(300, 30),
      [day(9)]: totals(400, 40),
    };
    assert.equal(pointsSince(tally, startOfDays(7)), 600);
    assert.equal(earnedSince(tally, startOfDays(7)), 60);
    assert.equal(pointsSince(tally, startOfDay()), 100);
    assert.equal(earnedSince(tally, startOfDay()), 10);
  });
});

describe('the career totals', () => {
  const played = (correct: number, total = 10) =>
    state().finishRound({ correct, total, bestStreak: 0, avgMs: 4000 });

  it('starts empty, with no accuracy to report', () => {
    assert.deepEqual(state().career, { rounds: 0, seen: 0, correct: 0 });
  });

  it('counts every round, every question and every right answer', () => {
    played(7);
    played(3, 5);
    assert.deepEqual(state().career, { rounds: 2, seen: 15, correct: 10 });
  });

  it('keeps counting past the round history limit', () => {
    // The bug: the profile showed the length of the stored history, which
    // stops at thirty, as the number of rounds the player had finished.
    for (let i = 0; i < 40; i++) played(7);

    assert.equal(state().rounds.length, 30);
    assert.equal(state().career.rounds, 40);
    assert.equal(state().career.seen, 400);
  });

  it('is cleared by a reset', () => {
    played(7);
    state().resetProgress();
    assert.deepEqual(state().career, { rounds: 0, seen: 0, correct: 0 });
  });
});

describe('the trophy record', () => {
  const played = (over: { correct?: number; bestStreak?: number; avgMs?: number } = {}) =>
    state().finishRound({
      correct: over.correct ?? 7,
      total: 10,
      bestStreak: over.bestStreak ?? 0,
      avgMs: over.avgMs ?? 4000,
    });

  it('banks what a round earns as it is scored', () => {
    const r = played({ correct: 10 });
    assert.deepEqual(Object.keys(state().trophies).sort(), [
      'firstRound',
      'firstWin',
      'perfect',
    ]);
    assert.equal(state().trophies.perfect, r.at);
  });

  it('survives the round that earned it dropping out of the history', () => {
    // The bug: a trophy was only ever as durable as the round behind it.
    const perfect = played({ correct: 10 });
    for (let i = 0; i < 35; i++) played({ correct: 7 });

    assert.ok(
      !state().rounds.some((r) => r.id === perfect.id),
      'the perfect round is gone from the history',
    );
    assert.equal(state().trophies.perfect, perfect.at, 'the trophy is not');
  });

  it('records nothing a round did not earn', () => {
    played({ correct: 2 });
    assert.deepEqual(Object.keys(state().trophies), ['firstRound']);
  });

  it('is cleared by a reset', () => {
    played({ correct: 10 });
    state().resetProgress();
    assert.deepEqual(state().trophies, {});
  });
});

describe('the daily bonus', () => {
  it('pays the first time it is asked for', () => {
    assert.equal(state().claimDaily(), true);
    assert.equal(state().tokens, START_TOKENS + DAILY_TOKENS);
    assert.equal(state().ledger[0].kind, 'daily');
  });

  it('refuses a second time on the same day', () => {
    state().claimDaily();
    const after = state().tokens;

    assert.equal(state().claimDaily(), false);
    assert.equal(state().tokens, after);
    assert.equal(state().ledger.length, 1, 'a refusal writes no ledger row');
  });

  it('opens again on the next calendar day, not after 24 hours', () => {
    const elevenPm = new Date(2026, 8, 13, 23, 0).getTime();
    const midnightPast = new Date(2026, 8, 14, 0, 30).getTime();
    const sameEvening = new Date(2026, 8, 13, 23, 59).getTime();

    assert.equal(dailyAvailable(elevenPm, sameEvening), false);
    assert.equal(dailyAvailable(elevenPm, midnightPast), true, 'ninety minutes later, new day');
  });

  it('is open to a player who has never claimed', () => {
    assert.equal(dailyAvailable(null), true);
  });

  it('is cleared by a reset', () => {
    state().claimDaily();
    state().resetProgress();
    assert.equal(state().lastDailyAt, null);
    assert.equal(state().claimDaily(), true);
  });
});

describe('language choice', () => {
  it('follows a suggestion until the player picks one', () => {
    useGame.setState({ locale: 'ka', localePinned: false });

    state().suggestLocale('en');
    assert.equal(state().locale, 'en');
  });

  it('stops following once the player has picked', () => {
    useGame.setState({ locale: 'ka', localePinned: false });

    state().setLocale('ka');
    assert.equal(state().localePinned, true);

    state().suggestLocale('en');
    assert.equal(state().locale, 'ka', 'a device language must not override a choice');
  });
});

describe('reset', () => {
  it('returns the player to the starting state', () => {
    state().spend('entry', ENTRY_COST);
    state().finishRound({ correct: 7, total: 10, bestStreak: 4, avgMs: 3500 });
    state().joinTournament('grand', ENTRY_COST);

    state().resetProgress();

    assert.equal(state().tokens, START_TOKENS);
    assert.equal(state().points, START_POINTS);
    assert.equal(state().streak, 0);
    assert.deepEqual(state().rounds, []);
    assert.deepEqual(state().ledger, []);
    assert.deepEqual(state().joined, []);
  });
});

describe('bank', () => {
  it('records a trophy with the moment it was earned', () => {
    assert.deepEqual(bank({}, ['perfect'], 100), { perfect: 100 });
  });

  it('keeps the first date when the same trophy comes round again', () => {
    assert.deepEqual(bank({ perfect: 100 }, ['perfect'], 900), { perfect: 100 });
  });

  it('adds alongside what is already held', () => {
    assert.deepEqual(bank({ perfect: 100 }, ['firstWin'], 900), {
      perfect: 100,
      firstWin: 900,
    });
  });

  it('leaves the record it was given alone', () => {
    const held = { perfect: 100 };
    bank(held, ['firstWin'], 900);
    assert.deepEqual(held, { perfect: 100 });
  });

  it('does nothing with an empty list', () => {
    assert.deepEqual(bank({ perfect: 100 }, [], 900), { perfect: 100 });
  });
});
