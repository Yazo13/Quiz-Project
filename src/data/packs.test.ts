import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  TOKENS_PER_DOLLAR,
  headline,
  packs,
  priceLabel,
  worthInDollars,
} from './packs.ts';

describe('the pack shelf', () => {
  it('rises in price, so the grid reads in order', () => {
    for (let i = 1; i < packs.length; i++) {
      assert.ok(packs[i].usd > packs[i - 1].usd, `pack ${i} is not dearer`);
      assert.ok(packs[i].tokens > packs[i - 1].tokens, `pack ${i} is not bigger`);
    }
  });

  it('gets better value the more you buy, which the bonuses claim', () => {
    for (let i = 1; i < packs.length; i++) {
      const rate = (p: (typeof packs)[number]) => p.tokens / p.usd;
      assert.ok(rate(packs[i]) > rate(packs[i - 1]), `pack ${i} is worse value`);
    }
  });

  it('marks exactly one headline pack and one best-value pack', () => {
    assert.equal(packs.filter((p) => p.badge === 'popular').length, 1);
    assert.equal(packs.filter((p) => p.badge === 'best').length, 1);
  });

  it('puts the best-value badge on the best value', () => {
    const best = packs.reduce((a, b) => (b.tokens / b.usd > a.tokens / a.usd ? b : a));
    assert.equal(best.badge, 'best');
  });
});

describe('priceLabel', () => {
  it('always shows two decimals', () => {
    assert.equal(priceLabel(0.99), '$0.99');
    assert.equal(priceLabel(5), '$5.00');
    assert.equal(priceLabel(79.99), '$79.99');
  });
});

describe('the rate', () => {
  it('comes off the headline pack rather than a literal', () => {
    assert.equal(headline.badge, 'popular');
    assert.equal(TOKENS_PER_DOLLAR, headline.tokens / headline.usd);
  });

  it('values the headline pack at its own price', () => {
    assert.equal(worthInDollars(headline.tokens), headline.usd.toFixed(2));
  });

  it('values an empty balance at nothing', () => {
    assert.equal(worthInDollars(0), '0.00');
  });

  it('stays in the neighbourhood the old literal put it in', () => {
    // It was a hand-copied 120 tokens to the dollar.
    assert.ok(Math.abs(TOKENS_PER_DOLLAR - 120) < 1);
  });
});
