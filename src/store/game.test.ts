import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';

import {
  DAILY_TOKENS,
  dailyAvailable,
  ENTRY_COST,
  POWERUP_COST,
  didWin,
  MIN_WIN_LENGTH,
  WIN_SHARE,
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
