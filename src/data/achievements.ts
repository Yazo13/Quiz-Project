import { WIN_THRESHOLD, type RoundResult } from '../store/game.ts';

/**
 * The trophy shelf, earned rather than written down.
 *
 * It used to be three hardcoded lines — "Kakheti Grand · 3rd", dated May 2026
 * — shown to every player including one who had never finished a round. A
 * shelf that says the same thing no matter what you do is decoration, and the
 * screen it sits on is called Your Record.
 *
 * Each definition is a pure test against stored progress, so the whole set can
 * be checked without rendering anything.
 */

export type AchievementId =
  | 'firstRound'
  | 'firstWin'
  | 'perfect'
  | 'streak10'
  | 'quickDraw'
  | 'regular'
  | 'hoard';

export interface Progress {
  rounds: RoundResult[];
  tokens: number;
}

export interface Achievement {
  id: AchievementId;
  earned: boolean;
  /** When it was earned, where a single round can be pointed at. */
  at?: number;
  /** How far along, for the ones that count up. `null` when not a counter. */
  progress: { have: number; need: number } | null;
}

/** Rounds run newest first, so the earliest match is the last one found. */
function earliest(rounds: RoundResult[], test: (r: RoundResult) => boolean) {
  let found: RoundResult | undefined;
  for (const r of rounds) if (test(r)) found = r;
  return found;
}

const REGULAR_ROUNDS = 25;
const HOARD_TOKENS = 5000;
/** Mean answer time that counts as quick, in ms. Half the budget. */
const QUICK_MS = 2500;

export function achievements({ rounds, tokens }: Progress): Achievement[] {
  const first = earliest(rounds, () => true);
  const win = earliest(rounds, (r) => r.correct >= WIN_THRESHOLD);
  const perfect = earliest(rounds, (r) => r.total > 0 && r.correct === r.total);
  const streak = earliest(rounds, (r) => r.bestStreak >= 10);
  // A quick round only counts if it was a win; racing through wrong answers
  // is not the skill being rewarded.
  const quick = earliest(
    rounds,
    (r) => r.avgMs > 0 && r.avgMs < QUICK_MS && r.correct >= WIN_THRESHOLD,
  );

  const bestStreak = rounds.reduce((m, r) => Math.max(m, r.bestStreak), 0);

  return [
    { id: 'firstRound', earned: !!first, at: first?.at, progress: null },
    { id: 'firstWin', earned: !!win, at: win?.at, progress: null },
    { id: 'perfect', earned: !!perfect, at: perfect?.at, progress: null },
    {
      id: 'streak10',
      earned: !!streak,
      at: streak?.at,
      progress: { have: Math.min(bestStreak, 10), need: 10 },
    },
    { id: 'quickDraw', earned: !!quick, at: quick?.at, progress: null },
    {
      id: 'regular',
      earned: rounds.length >= REGULAR_ROUNDS,
      progress: { have: Math.min(rounds.length, REGULAR_ROUNDS), need: REGULAR_ROUNDS },
    },
    {
      id: 'hoard',
      earned: tokens >= HOARD_TOKENS,
      progress: { have: Math.min(tokens, HOARD_TOKENS), need: HOARD_TOKENS },
    },
  ];
}

/** Earned first, then the ones closest to being earned. */
export function sortForShelf(list: Achievement[]): Achievement[] {
  const share = (a: Achievement) =>
    a.progress ? a.progress.have / a.progress.need : 0;

  return [...list].sort((a, b) => {
    if (a.earned !== b.earned) return a.earned ? -1 : 1;
    if (a.earned) return (b.at ?? 0) - (a.at ?? 0);
    return share(b) - share(a);
  });
}
