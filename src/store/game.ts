import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Explicit extensions: node:test imports this module directly and Node's ESM
// loader resolves the real filename.
import { earnedByRound } from '../data/achievements.ts';
import type { CategoryKey } from '../data/questions';
import { didWin } from '../lib/score.ts';
import type { RoundResult } from '../lib/score.ts';
import { startOfDay, startOfDays } from '../lib/time.ts';

// The store stays the one import every screen reaches for, so what moved out
// of it is passed straight back through.
export { MIN_WIN_LENGTH, WIN_SHARE, didWin } from '../lib/score.ts';
export type { RoundResult } from '../lib/score.ts';

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

/** A new player starts with enough to enter a tournament and feel the economy. */
const STARTING_TOKENS = 1248;
const STARTING_POINTS = 6422;

/** Cost of one tournament seat, and of a retry after losing. */
export const ENTRY_COST = 50;
/** Cost of the 50/50 power-up inside a round. */
export const POWERUP_COST = 25;
/** Paid once a calendar day for opening the app. */
export const DAILY_TOKENS = 25;

/** Local calendar day, so "once a day" means what the player's clock says. */
function dayKey(at: number) {
  const d = new Date(at);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

/** True when the daily bonus has not been taken on this calendar day. */
export function dailyAvailable(lastDailyAt: number | null, now = Date.now()) {
  return lastDailyAt === null || dayKey(lastDailyAt) !== dayKey(now);
}

/**
 * How many finished rounds are kept for the profile's history.
 *
 * A display limit, not an accounting one: see `daily` below for why the two
 * had to stop being the same number.
 */
const ROUND_HISTORY = 30;
/** How far back the per-day tally is kept. A fortnight past the weekly board. */
const DAILY_KEPT_DAYS = 21;
/** Today and the six days before it, which is what a weekly figure means. */
export const WEEK_DAYS = 7;

/** What one local day came to. */
export interface DayTotals {
  points: number;
  /** Tokens won by playing — round rewards and the daily bonus, not purchases. */
  earned: number;
}

/** Per-day totals, keyed by that day's local midnight. */
export type Daily = Record<string, DayTotals>;

const NO_DAY: DayTotals = { points: 0, earned: 0 };

/**
 * Totals that only ever go up, for the figures that claim to be lifetime ones.
 *
 * The profile's round count was the length of the stored history, which stops
 * at thirty — a player on their two hundredth round had been reading "30" for
 * weeks. Accuracy had the same shape without looking like it: a mean over the
 * last thirty rounds, under a label that just says Accuracy.
 */
export interface Career {
  /** Rounds finished, ever. */
  rounds: number;
  /** Questions seen and answers got right, ever. */
  seen: number;
  correct: number;
}

/** A player who has finished nothing yet. */
const NO_CAREER: Career = { rounds: 0, seen: 0, correct: 0 };

/**
 * Points scored on or after `from`, which must be a local midnight.
 *
 * Pure so the windows can be tested without a clock.
 */
function sumSince(daily: Daily, from: number, of: (d: DayTotals) => number): number {
  return Object.entries(daily).reduce(
    (sum, [at, day]) => (Number(at) >= from ? sum + of(day) : sum),
    0,
  );
}

export function pointsSince(daily: Daily, from: number): number {
  return sumSince(daily, from, (d) => d.points);
}

/**
 * Tokens won on or after `from`.
 *
 * The wallet's "earned this week" used to be summed out of the ledger, which
 * keeps fifty entries — two a round, so a busy week ran off the end of it and
 * the figure came out low. It counted bought packs as earnings too.
 */
export function earnedSince(daily: Daily, from: number): number {
  return sumSince(daily, from, (d) => d.earned);
}

/** Adds a round's points to today's entry and drops anything long past. */
function addDaily(daily: Daily, add: Partial<DayTotals>, now = Date.now()): Daily {
  const today = String(startOfDay(now));
  const keep = startOfDays(DAILY_KEPT_DAYS, now);
  const so_far = daily[today] ?? NO_DAY;
  const next: Daily = {
    [today]: {
      points: so_far.points + (add.points ?? 0),
      earned: so_far.earned + (add.earned ?? 0),
    },
  };
  for (const [at, day] of Object.entries(daily)) {
    if (at !== today && Number(at) >= keep) next[at] = day;
  }
  return next;
}

/**
 * Records trophies not already held, keeping the first date for each.
 *
 * Exported so the write-once rule can be pinned down with explicit
 * timestamps; two rounds scored in the same millisecond would otherwise make
 * the test vacuous.
 */
export function bank(held: Record<string, number>, ids: string[], at: number) {
  const next = { ...held };
  for (const id of ids) if (next[id] === undefined) next[id] = at;
  return next;
}

const POINTS_PER_CORRECT = 120;
/** Won rounds pay per correct answer plus a streak kicker; losses pay a floor. */
const TOKENS_PER_CORRECT = 50;
const TOKENS_PER_STREAK = 5;
const CONSOLATION_TOKENS = 15;

export function roundPoints(correct: number) {
  return correct * POINTS_PER_CORRECT;
}

export function roundTokens(correct: number, total: number, bestStreak: number) {
  return didWin(correct, total)
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
  /**
   * Points scored per local day, keyed by that day's midnight.
   *
   * The leaderboard's own "today" and "weekly" figures used to be summed out
   * of `rounds`, which keeps only the last thirty. Anyone playing more than
   * that inside a week had the earlier days quietly dropped from their own
   * total, so the board ranked them below where they had actually finished.
   * This tally is not capped by round count, only by age.
   */
  daily: Daily;
  /**
   * Trophies earned, as id to the moment they were earned. Write-once: a
   * trophy is banked here as its round is scored, so it survives that round
   * dropping out of the capped history. Nothing but a reset removes one.
   */
  trophies: Record<string, number>;
  career: Career;
  /** Tournament ids the player has paid into. */
  joined: string[];
  /** When the daily bonus was last taken. Null until the first claim. */
  lastDailyAt: number | null;
  /** Whether presses vibrate. On by default; the design leans on the feel. */
  haptics: boolean;
  /**
   * False until the player picks a language themselves. While it is false the
   * app is free to follow the device; once they choose, their choice sticks
   * even if they later change the phone's language.
   */
  localePinned: boolean;

  setLocale: (locale: Locale) => void;
  /** Adopts a language without marking it as the player's own choice. */
  suggestLocale: (locale: Locale) => void;
  /** Credits the daily bonus. Returns false when it is already taken today. */
  claimDaily: () => boolean;
  setHaptics: (on: boolean) => void;
  /** Returns false when the balance is short; the caller decides how to refuse. */
  spend: (kind: TxKind, amount: number, detail?: string) => boolean;
  credit: (kind: TxKind, amount: number, detail?: string) => void;
  joinTournament: (id: string, cost: number, detail?: string) => boolean;
  finishRound: (input: {
    correct: number;
    total: number;
    bestStreak: number;
    avgMs: number;
    subject?: CategoryKey;
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
      daily: {},
      trophies: {},
      career: NO_CAREER,
      joined: [],
      lastDailyAt: null,
      haptics: true,
      localePinned: false,

      setLocale: (locale) => set({ locale, localePinned: true }),
      suggestLocale: (locale) => {
        if (get().localePinned) return;
        set({ locale });
      },

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

      setHaptics: (on) => set({ haptics: on }),

      claimDaily: () => {
        const now = Date.now();
        if (!dailyAvailable(get().lastDailyAt, now)) return false;
        get().credit('daily', DAILY_TOKENS);
        set((st) => ({
          lastDailyAt: now,
          daily: addDaily(st.daily, { earned: DAILY_TOKENS }, now),
        }));
        return true;
      },

      joinTournament: (id, cost, detail) => {
        if (get().joined.includes(id)) return true;
        if (!get().spend('entry', cost, detail)) return false;
        set((s) => ({ joined: [...s.joined, id] }));
        return true;
      },

      finishRound: ({ correct, total, bestStreak, avgMs, subject }) => {
        const won = didWin(correct, total);
        const points = roundPoints(correct);
        const earned = roundTokens(correct, total, bestStreak);
        const result: RoundResult = {
          id: nextId(),
          at: Date.now(),
          correct,
          total,
          bestStreak,
          points,
          earned,
          avgMs,
          subject,
        };

        set((s) => ({
          points: s.points + points,
          tokens: s.tokens + earned,
          // The round's own streak is what carries forward — a round that
          // ended on a wrong answer starts the next one from zero.
          streak: bestStreak,
          rounds: [result, ...s.rounds].slice(0, ROUND_HISTORY),
          daily: addDaily(s.daily, { points, earned }),
          trophies: bank(s.trophies, earnedByRound(result), result.at),
          career: {
            rounds: s.career.rounds + 1,
            seen: s.career.seen + total,
            correct: s.career.correct + correct,
          },
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
          daily: {},
          trophies: {},
          career: NO_CAREER,
          joined: [],
          lastDailyAt: null,
        }),
    }),
    {
      name: 'gargari-quiz/v1',
      storage: createJSONStorage(() => storage),
      version: 5,
      migrate: (persisted, from) => {
        const state = persisted as GameState;

        // v0 had no localePinned. Those installs were already running in a
        // language the player has been looking at, so adopting the device
        // language underneath them would be a surprise — treat it as pinned.
        if (from < 1) state.localePinned = true;

        // v1 had no per-day tally. Seeding it from the stored rounds keeps
        // the board steady across the upgrade; those rounds are all that was
        // ever counted anyway, so nothing is lost that was not lost already.
        if (from < 2) {
          state.daily = (state.rounds ?? []).reduce<Daily>((acc, r) => {
            const day = String(startOfDay(r.at));
            const so_far = acc[day] ?? NO_DAY;
            acc[day] = {
              points: so_far.points + r.points,
              earned: so_far.earned + r.earned,
            };
            return acc;
          }, {});
        }

        // v2 had no trophy record, so the shelf was only as long as the
        // surviving history. Replaying that history here recovers everything
        // still visible; anything already pruned was gone before this ran.
        if (from < 3) {
          state.trophies = (state.rounds ?? [])
            .slice()
            .reverse()
            .reduce<Record<string, number>>(
              (held, r) => bank(held, earnedByRound(r), r.at),
              {},
            );
        }

        // v3 counted rounds and accuracy off the stored history. Seeding the
        // totals from it is the best that can be done now — rounds already
        // pruned were never counted under the old code either.
        if (from < 4) {
          state.career = (state.rounds ?? []).reduce<Career>(
            (c, r) => ({
              rounds: c.rounds + 1,
              seen: c.seen + r.total,
              correct: c.correct + r.correct,
            }),
            NO_CAREER,
          );
        }

        // v4's tally held a bare points number per day. The tokens half was
        // read out of the ledger instead, and could not be recovered from it
        // now, so past days start at zero earned rather than guessing.
        if (from < 5) {
          state.daily = Object.entries(
            (state.daily ?? {}) as unknown as Record<string, number | DayTotals>,
          ).reduce<Daily>((acc, [at, day]) => {
            acc[at] = typeof day === 'number' ? { points: day, earned: 0 } : day;
            return acc;
          }, {});
        }

        return state;
      },
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

/** Tokens won this week — the wallet's "earned this week". */
export function useWeeklyEarned() {
  return useGame((s) => earnedSince(s.daily, startOfDays(WEEK_DAYS)));
}

/**
 * Correct answers over questions seen, for the whole account.
 *
 * It used to be averaged over the stored rounds, so it quietly became "your
 * last thirty rounds" — a long record could not be moved by a bad week, or by
 * a good one.
 */
export function useAccuracy() {
  return useGame((s) => (s.career.seen ? s.career.correct / s.career.seen : null));
}
