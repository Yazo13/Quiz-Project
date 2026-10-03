/**
 * Shuffling, done once and properly.
 *
 * `[...].sort(() => Math.random() - 0.5)` is the usual shortcut and it does
 * not produce a uniform order — the comparator is inconsistent, so the result
 * depends on the sort's internals. The quiz's 50/50 used it to choose which
 * two wrong answers to strike out, and measured over 300,000 draws the last
 * wrong answer survived 50% of the time against 25% for each of the other
 * two. A coin flip that favours one side is not the power-up the player paid
 * twenty-five tokens for.
 */

/** Fisher-Yates, in place. Every ordering equally likely. */
export function shuffle<T>(items: T[]): T[] {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

/**
 * `count` items drawn from `items` without replacement, each equally likely.
 * Does not touch the array it is given.
 */
export function pick<T>(items: readonly T[], count: number): T[] {
  return shuffle([...items]).slice(0, Math.max(0, count));
}
