import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/**
 * The single source of truth for everything the player owns or has done.
 *
 * Every screen used to carry its own hardcoded numbers, so the balance in the
 * header and the balance in the wallet were two unrelated literals. They all
 * read from here now, which also pins down the shape the server will need to
 * return once there is one — the fields below are deliberately the ones a
 * `GET /me` would carry.
 */

export type Locale = 'ka' | 'en';

export type TxKind =
  | 'entry'
  | 'reward'
  | 'consolation'
  | 'pack'
  | 'powerup'
  | 'daily';

export interface Tx {
  id: string;
  kind: TxKind;
  /** Signed: negative is a spend. */
  amount: number;
  at: number;
  /** Optional detail appended to the translated label, e.g. a tournament name. */
  detail?: string;
}

export interface RoundResult {
  id: string;
  at: number;
  correct: number;
  total: number;
  bestStreak: number;
  points: number;
  /** Tokens credited for the round. */
  earned: number;
  /** Mean answer time in ms; unanswered questions count as the full limit. */
  avgMs: number;
}

/** A new player starts with enough to enter a tournament and feel the economy. */
const STARTING_TOKENS = 1248;
const STARTING_POINTS = 6422;

/** Correct answers at or above this win the round. */
export const WIN_THRESHOLD = 6;
/** Cost of one tournament seat, and of a retry after losing. */
export const ENTRY_COST = 50;
/** Cost of the 50/50 power-up inside a round. */
export const POWERUP_COST = 25;
const POINTS_PER_CORRECT = 120;
/** Won rounds pay per correct answer plus a streak kicker; losses pay a floor. */
const TOKENS_PER_CORRECT = 50;
const TOKENS_PER_STREAK = 5;
const CONSOLATION_TOKENS = 15;

export function roundPoints(correct: number) {
  return correct * POINTS_PER_CORRECT;
}

export function roundTokens(correct: number, bestStreak: number) {
  return correct >= WIN_THRESHOLD
    ? correct * TOKENS_PER_CORRECT + bestStreak * TOKENS_PER_STREAK
    : CONSOLATION_TOKENS;
}

interface GameState {
  locale: Locale;
  tokens: number;
  points: number;
  /** Carries across rounds — a wrong answer inside a round resets it. */
  streak: number;
  ledger: Tx[];
  rounds: RoundResult[];
  /** Tournament ids the player has paid into. */
  joined: string[];

  setLocale: (locale: Locale) => void;
  /** Returns false when the balance is short; the caller decides how to refuse. */
  spend: (kind: TxKind, amount: number, detail?: string) => boolean;
  credit: (kind: TxKind, amount: number, detail?: string) => void;
  joinTournament: (id: string, cost: number, detail?: string) => boolean;
  finishRound: (input: {
    correct: number;
    total: number;
    bestStreak: number;
    avgMs: number;
  }) => RoundResult;
  resetProgress: () => void;
}

let seq = 0;
/** Ledger ids only need to be unique within a device, and stable once written. */
const nextId = () => `${Date.now().toString(36)}-${(seq++).toString(36)}`;

/**
 * AsyncStorage's web build reaches straight for `window.localStorage`, which
 * does not exist while `expo export` prerenders the routes in Node. Falling
 * back to a map there keeps the build working; nothing written during a
 * prerender needs to survive it anyway.
 */
const scratch = new Map<string, string>();
const isServer = typeof window === 'undefined';

const storage = {
  getItem: (key: string) =>
    isServer ? Promise.resolve(scratch.get(key) ?? null) : AsyncStorage.getItem(key),
  setItem: (key: string, value: string) => {
    if (isServer) {
      scratch.set(key, value);
      return Promise.resolve();
    }
    return AsyncStorage.setItem(key, value);
  },
  removeItem: (key: string) => {
    if (isServer) {
      scratch.delete(key);
      return Promise.resolve();
    }
    return AsyncStorage.removeItem(key);
  },
};

export const useGame = create<GameState>()(
  persist(
    (set, get) => ({
      locale: 'ka',
      tokens: STARTING_TOKENS,
      points: STARTING_POINTS,
      streak: 0,
      ledger: [],
      rounds: [],
      joined: [],

      setLocale: (locale) => set({ locale }),

      spend: (kind, amount, detail) => {
        if (get().tokens < amount) return false;
        set((s) => ({
          tokens: s.tokens - amount,
          ledger: [
            { id: nextId(), kind, amount: -amount, at: Date.now(), detail },
            ...s.ledger,
          ].slice(0, 50),
        }));
        return true;
      },

      credit: (kind, amount, detail) =>
        set((s) => ({
          tokens: s.tokens + amount,
          ledger: [
            { id: nextId(), kind, amount, at: Date.now(), detail },
            ...s.ledger,
          ].slice(0, 50),
        })),

      joinTournament: (id, cost, detail) => {
        if (get().joined.includes(id)) return true;
        if (!get().spend('entry', cost, detail)) return false;
        set((s) => ({ joined: [...s.joined, id] }));
        return true;
      },

      finishRound: ({ correct, total, bestStreak, avgMs }) => {
        const won = correct >= WIN_THRESHOLD;
        const points = roundPoints(correct);
        const earned = roundTokens(correct, bestStreak);
        const result: RoundResult = {
          id: nextId(),
          at: Date.now(),
          correct,
          total,
          bestStreak,
          points,
          earned,
          avgMs,
        };

        set((s) => ({
          points: s.points + points,
          tokens: s.tokens + earned,
          // The round's own streak is what carries forward — a round that
          // ended on a wrong answer starts the next one from zero.
          streak: bestStreak,
          rounds: [result, ...s.rounds].slice(0, 30),
          ledger: [
            {
              id: nextId(),
              kind: won ? ('reward' as const) : ('consolation' as const),
              amount: earned,
              at: Date.now(),
              detail: `${correct}/${total}`,
            },
            ...s.ledger,
          ].slice(0, 50),
        }));

        return result;
      },

      resetProgress: () =>
        set({
          tokens: STARTING_TOKENS,
          points: STARTING_POINTS,
          streak: 0,
          ledger: [],
          rounds: [],
          joined: [],
        }),
    }),
    {
      name: 'gargari-quiz/v1',
      storage: createJSONStorage(() => storage),
    },
  ),
);

/**
 * True once the saved state has been read, so the first paint can show the
 * real balance rather than the starting one.
 *
 * Hydration usually finishes before React mounts — the store starts reading at
 * import time — so `hasHydrated` is checked up front as well as subscribed to;
 * waiting only on the event would hang forever in that case. The timeout is
 * the last resort: if storage never answers, the app opens on defaults instead
 * of sitting on the splash screen.
 */
export function useHydrated(timeoutMs = 1500) {
  const [hydrated, setHydrated] = useState(() => useGame.persist.hasHydrated());

  useEffect(() => {
    if (hydrated) return;
    const done = () => setHydrated(true);
    const unsub = useGame.persist.onFinishHydration(done);
    if (useGame.persist.hasHydrated()) done();
    const timer = setTimeout(done, timeoutMs);
    return () => {
      unsub();
      clearTimeout(timer);
    };
  }, [hydrated, timeoutMs]);

  return hydrated;
}

/** Tokens credited in the last seven days — the wallet's "earned this week". */
export function useWeeklyEarned() {
  return useGame((s) => {
    const since = Date.now() - 7 * 24 * 3600 * 1000;
    return s.ledger
      .filter((t) => t.at >= since && t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
  });
}

/** Correct answers over questions seen, across every stored round. */
export function useAccuracy() {
  return useGame((s) => {
    const seen = s.rounds.reduce((n, r) => n + r.total, 0);
    if (!seen) return null;
    return s.rounds.reduce((n, r) => n + r.correct, 0) / seen;
  });
}

export function useBestStreak() {
  return useGame((s) => s.rounds.reduce((m, r) => Math.max(m, r.bestStreak), 0));
}
