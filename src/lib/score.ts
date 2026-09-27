/**
 * What a finished round is, and what counts as winning one.
 *
 * Both used to live in the store. They moved here because the trophy shelf
 * needs them too, and the store needs the shelf's rules in return — a round
 * has to be checked for trophies at the moment it is scored, since the round
 * history it would otherwise be read back out of does not keep everything.
 * Two modules importing each other is a cycle; both importing this is not.
 *
 * Nothing here touches state, storage or React.
 */
import type { CategoryKey } from '../data/questions';

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
  /**
   * The category the round was played on, or undefined for a mixed round.
   * Kept so "play again" can deal the same subject again.
   */
  subject?: CategoryKey;
}

/**
 * Share of a round that has to be right to win it.
 *
 * It used to be a flat six correct, which assumed every round was ten
 * questions long. Since leaving early became possible, rounds can be any
 * length — and a seven-question round answered five right, which is better
 * than the bar, was still recorded as a loss because five is less than six.
 */
export const WIN_SHARE = 0.6;
/**
 * Rounds shorter than this are recorded but never count as wins.
 *
 * Without a floor, quitting after one correct answer would be a perfect score
 * and pay a win — entry fee back plus the streak kicker, for one question.
 */
export const MIN_WIN_LENGTH = 5;

/** Whether a round of this length and score counts as won. */
export function didWin(correct: number, total: number): boolean {
  if (total < MIN_WIN_LENGTH) return false;
  return correct / total >= WIN_SHARE;
}
