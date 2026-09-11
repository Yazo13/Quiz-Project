// The extension is explicit because the node:test suite imports this file
// directly, and Node's ESM loader resolves the real filename. tokens.ts has no
// relative imports of its own, so the chain ends there — which is the point of
// keeping the roster out of standings.ts, where it would drag the store and
// React into a plain data test.
import { color } from '../theme/tokens.ts';

/** Points earned inside a window. `all` includes everything on the account. */
export interface Points {
  day: number;
  week: number;
  all: number;
}

export interface Standing {
  name: string;
  points: Points;
  streak: number;
  /** Percent, stored rather than generated so re-renders don't reshuffle it. */
  accuracy: number;
  tint: string;
  initials: string;
  /** Shown when the board is filtered to friends. */
  friend?: boolean;
  you?: boolean;
}

/**
 * Standing in for the other players until there is a server. Their figures are
 * fixed; only the player's move, so climbing is real even though the
 * opposition is not.
 *
 * Each carries a day and a week total as well as an all-time one, because the
 * board's filters have to compare like with like — and the orders differ
 * between windows on purpose, otherwise switching filter would look broken.
 */
export const rivals: Standing[] = [
  { name: 'Lasha M.', points: { day: 980, week: 4120, all: 9180 }, streak: 12, accuracy: 91, tint: color.gold, initials: 'LM', friend: true },
  { name: 'Nino K.', points: { day: 1240, week: 3860, all: 8420 }, streak: 7, accuracy: 86, tint: color.coral, initials: 'NK' },
  { name: 'Tako J.', points: { day: 640, week: 3510, all: 7964 }, streak: 4, accuracy: 82, tint: color.forest, initials: 'TJ', friend: true },
  { name: 'Giorgi P.', points: { day: 1460, week: 2980, all: 7210 }, streak: 3, accuracy: 78, tint: color.sky2, initials: 'GP' },
  { name: 'Mariam V.', points: { day: 120, week: 2640, all: 6890 }, streak: 0, accuracy: 71, tint: '#5A3540', initials: 'MV', friend: true },
  { name: 'Salome B.', points: { day: 870, week: 2210, all: 6201 }, streak: 2, accuracy: 69, tint: color.forest, initials: 'SB' },
  { name: 'Irakli D.', points: { day: 0, week: 1980, all: 5984 }, streak: 0, accuracy: 66, tint: '#8E5A1B', initials: 'ID' },
  { name: 'Anna L.', points: { day: 1580, week: 1840, all: 5712 }, streak: 8, accuracy: 88, tint: '#3F5F4A', initials: 'AL', friend: true },
  { name: 'Beka R.', points: { day: 240, week: 1530, all: 5503 }, streak: 1, accuracy: 62, tint: '#7E2D26', initials: 'BR' },
];

export const PLAYER_NAME = 'Davit G.';
export const PLAYER_INITIALS = 'DG';
