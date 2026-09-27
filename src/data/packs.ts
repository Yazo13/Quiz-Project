/**
 * The token packs the wallet sells.
 *
 * Prices are numbers rather than pre-rendered "$9.99" strings so the rate can
 * be worked out from them. The wallet's "≈ $10.40" line used to carry its own
 * literal — 120 tokens to the dollar, copied by hand off the headline pack —
 * which meant a price change silently left that line wrong.
 */

export type PackVariant = 'paper' | 'gold' | 'forest' | 'coral';

export interface Pack {
  tokens: number;
  /** US dollars. The store front-end will eventually get this from the OS. */
  usd: number;
  bonus?: string;
  variant: PackVariant;
  badge?: 'popular' | 'best';
}

/**
 * The shelf, cheapest first. Token counts climb faster than the price does,
 * which is what the bonus badges are saying.
 */
export const packs: Pack[] = [
  { tokens: 100, usd: 0.99, variant: 'paper' },
  { tokens: 550, usd: 4.99, bonus: '+10%', variant: 'paper' },
  { tokens: 1200, usd: 9.99, bonus: '+20%', variant: 'gold', badge: 'popular' },
  { tokens: 2800, usd: 19.99, bonus: '+40%', variant: 'forest' },
  { tokens: 6500, usd: 39.99, bonus: '+60%', variant: 'paper' },
  { tokens: 15000, usd: 79.99, bonus: '+100%', variant: 'coral', badge: 'best' },
];

/** A price as the store shows it. Always two decimals, so the grid stays even. */
export function priceLabel(usd: number): string {
  return `$${usd.toFixed(2)}`;
}

/**
 * The pack the store leads with, and the rate the balance is valued at.
 *
 * The headline pack rather than the best one: it is the price most players
 * actually pay, so it is the honest way to read a balance back as money.
 */
export const headline: Pack = packs.find((p) => p.badge === 'popular') ?? packs[0];

export const TOKENS_PER_DOLLAR = headline.tokens / headline.usd;

/** A token balance as approximate dollars, to two decimals. */
export function worthInDollars(tokens: number): string {
  return (tokens / TOKENS_PER_DOLLAR).toFixed(2);
}
