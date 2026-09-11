import { useMemo } from 'react';

import { useAccuracy, useGame } from '../store/game';
import { color } from '../theme/tokens';
import {
  PLAYER_INITIALS,
  PLAYER_NAME,
  Points,
  Standing,
  rivals,
} from './rivals';

export { PLAYER_INITIALS, PLAYER_NAME, rivals } from './rivals';
export type { Points, Standing } from './rivals';

/** Which slice of the board the leaderboard is showing. */
export type Board = 'today' | 'weekly' | 'grand' | 'friends';

export interface Ranked extends Omit<Standing, 'points'> {
  rank: number;
  /** The figure for the window being shown, already selected. */
  pts: number;
}

/** Shown until enough rounds exist to compute a real figure. */
const DEFAULT_ACCURACY = 84;

const DAY = 24 * 60 * 60 * 1000;
const WEEK = 7 * DAY;

function pick(points: Points, board: Board) {
  if (board === 'today') return points.day;
  if (board === 'weekly') return points.week;
  return points.all;
}

/**
 * The board for one filter, with the player slotted in by points.
 *
 * The player's day and week figures are summed from their own round history,
 * so the filters move the board rather than only recolouring a chip. All-time
 * uses the account total, which includes the points they started with.
 *
 * Profile reads rank from here too, so the badge and the board cannot disagree.
 */
export function useStandings(board: Board = 'grand') {
  const points = useGame((s) => s.points);
  const rounds = useGame((s) => s.rounds);
  const streak = useGame((s) => s.streak);
  const accuracy = useAccuracy();

  return useMemo(() => {
    const now = Date.now();
    const since = (window: number) =>
      rounds.reduce((sum, r) => (now - r.at <= window ? sum + r.points : sum), 0);

    const me: Standing = {
      name: PLAYER_NAME,
      points: { day: since(DAY), week: since(WEEK), all: points },
      streak,
      accuracy: accuracy === null ? DEFAULT_ACCURACY : Math.round(accuracy * 100),
      tint: color.coral,
      initials: PLAYER_INITIALS,
      you: true,
      friend: true,
    };

    const roster = board === 'friends' ? rivals.filter((r) => r.friend) : rivals;

    const table: Ranked[] = [...roster, me]
      .map(({ points: p, ...rest }) => ({ ...rest, pts: pick(p, board) }))
      .sort((a, b) => b.pts - a.pts)
      .map((s, i) => ({ ...s, rank: i + 1 }));

    const self = table.find((s) => s.you)!;
    return {
      board: table,
      me: self,
      /** The player directly above — the one worth chasing. Undefined at #1. */
      ahead: table[self.rank - 2] as Ranked | undefined,
    };
  }, [board, points, rounds, streak, accuracy]);
}
