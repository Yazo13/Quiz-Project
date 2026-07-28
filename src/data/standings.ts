import { useMemo } from 'react';

import { useAccuracy, useGame } from '../store/game';
import { color } from '../theme/tokens';

export interface Standing {
  name: string;
  pts: number;
  streak: number;
  /** Percent, stored rather than generated so re-renders don't reshuffle it. */
  accuracy: number;
  tint: string;
  initials: string;
  you?: boolean;
}

export interface Ranked extends Standing {
  rank: number;
}

/**
 * Standing in for the other players until there is a server. Their scores are
 * fixed; only the player's move, so climbing the board is real even though the
 * opposition is not.
 */
export const rivals: Standing[] = [
  { name: 'Lasha M.', pts: 9180, streak: 12, accuracy: 91, tint: color.gold, initials: 'LM' },
  { name: 'Nino K.', pts: 8420, streak: 7, accuracy: 86, tint: color.coral, initials: 'NK' },
  { name: 'Tako J.', pts: 7964, streak: 4, accuracy: 82, tint: color.forest, initials: 'TJ' },
  { name: 'Giorgi P.', pts: 7210, streak: 3, accuracy: 78, tint: color.sky2, initials: 'GP' },
  { name: 'Mariam V.', pts: 6890, streak: 0, accuracy: 71, tint: '#5A3540', initials: 'MV' },
  { name: 'Salome B.', pts: 6201, streak: 2, accuracy: 69, tint: color.forest, initials: 'SB' },
  { name: 'Irakli D.', pts: 5984, streak: 0, accuracy: 66, tint: '#8E5A1B', initials: 'ID' },
  { name: 'Anna L.', pts: 5712, streak: 8, accuracy: 88, tint: '#3F5F4A', initials: 'AL' },
  { name: 'Beka R.', pts: 5503, streak: 1, accuracy: 62, tint: '#7E2D26', initials: 'BR' },
];

export const PLAYER_NAME = 'Davit G.';
export const PLAYER_INITIALS = 'DG';
/** Shown until enough rounds exist to compute a real figure. */
const DEFAULT_ACCURACY = 84;

/**
 * The full board with the player slotted in by points. Both the leaderboard
 * and the profile badge read rank from here, so the two can never disagree.
 */
export function useStandings() {
  const points = useGame((s) => s.points);
  const streak = useGame((s) => s.streak);
  const accuracy = useAccuracy();

  return useMemo(() => {
    const me: Standing = {
      name: PLAYER_NAME,
      pts: points,
      streak,
      accuracy: accuracy === null ? DEFAULT_ACCURACY : Math.round(accuracy * 100),
      tint: color.coral,
      initials: PLAYER_INITIALS,
      you: true,
    };
    const board: Ranked[] = [...rivals, me]
      .sort((a, b) => b.pts - a.pts)
      .map((s, i) => ({ ...s, rank: i + 1 }));

    const self = board.find((s) => s.you)!;
    return {
      board,
      me: self,
      /** The player directly above — the one worth chasing. Undefined at #1. */
      ahead: board[self.rank - 2] as Ranked | undefined,
    };
  }, [points, streak, accuracy]);
}
