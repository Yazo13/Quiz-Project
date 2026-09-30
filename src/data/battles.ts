import type { Href } from 'expo-router';

/**
 * The battles the arena lists under the featured tournament.
 *
 * Simulated like the rest of the crowd: `players` is a baseline that
 * src/data/presence drifts around, not a live count.
 *
 * `category` is the prize on offer, which is what the scroller filters by.
 * `subject` is what the round actually asks about — a separate thing, and
 * absent on the cash battles, which pay out in tokens rather than belonging
 * to a topic. Those play the whole bank.
 */
export const battles = [
  { key: 'geography', category: 'travel', subject: 'travel', players: 1284, prize: '50K', hot: true },
  { key: 'tech', category: 'tech', subject: 'tech', players: 642, prize: '20K', hot: false },
  { key: 'culture', category: 'experience', subject: 'experience', players: 2103, prize: '100K', hot: true },
  { key: 'cellar', category: 'travel', subject: 'culture', players: 418, prize: '15K', hot: false },
  { key: 'jackpot', category: 'cash', players: 3960, prize: '250K', hot: true },
  { key: 'nightOwl', category: 'cash', players: 704, prize: '40K', hot: false },
] as const;

export type Battle = (typeof battles)[number];

/** Only battles with a subject narrow the round; the rest play everything. */
export function quizHref(battle: Battle): Href {
  return 'subject' in battle ? `/quiz?subject=${battle.subject}` : '/quiz';
}

/** The battles on offer for one prize category, or all of them. */
export function battlesFor(category: string | null): readonly Battle[] {
  return category ? battles.filter((b) => b.category === category) : battles;
}

/**
 * How many battles a prize category has on offer.
 *
 * The category tiles carried their own counts — twelve prizes for travel,
 * eight for tech — while tapping travel revealed two battles. A number that
 * disagrees with what pressing it shows is worse than no number.
 */
export function battleCount(category: string): number {
  return battlesFor(category).length;
}
