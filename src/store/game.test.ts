import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';

import {
  ENTRY_COST,
  POWERUP_COST,
  WIN_THRESHOLD,
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
    assert.equal(result.earned, roundTokens(9, 7));
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
    assert.ok(roundTokens(WIN_THRESHOLD, 0) > 15);
    assert.equal(roundTokens(WIN_THRESHOLD - 1, 9), 15, 'a long streak cannot rescue a loss');
  });

  it('carries the round peak forward as the new streak', () => {
    state().finishRound({ correct: 9, total: 10, bestStreak: 7, avgMs: 4200 });
    assert.equal(state().streak, 7);

    // A bad round resets it, even though the previous one was strong.
    state().finishRound({ correct: 1, total: 10, bestStreak: 0, avgMs: 5000 });
    assert.equal(state().streak, 0);
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
