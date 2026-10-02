import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { depth, tabBar, tabBarSpace } from './tokens.ts';

describe('tabBarSpace', () => {
  it('clears the bar on a device that reports no inset', () => {
    // Floor + gap, because the bar still sits off the bottom edge.
    assert.equal(
      tabBarSpace(0),
      tabBar.height + tabBar.insetFloor + tabBar.gap + depth,
    );
  });

  it('matches the old flat 110 where that figure came from', () => {
    // A notched iPhone reports 34, which is what the hardcoded value fitted.
    assert.equal(tabBarSpace(34), 110);
  });

  it('gives a device without an inset less room, not the same', () => {
    assert.ok(tabBarSpace(0) < tabBarSpace(34));
    assert.equal(110 - tabBarSpace(0), 22, 'the dead space that used to be there');
  });

  it('ignores an inset smaller than the floor', () => {
    assert.equal(tabBarSpace(5), tabBarSpace(0));
    assert.equal(tabBarSpace(tabBar.insetFloor), tabBarSpace(0));
  });

  it('grows with a larger inset', () => {
    assert.equal(tabBarSpace(50) - tabBarSpace(40), 10);
  });

  it('always leaves room for the bar itself and its shadow', () => {
    for (const inset of [0, 12, 20, 34, 48]) {
      assert.ok(tabBarSpace(inset) >= tabBar.height + depth, `inset ${inset}`);
    }
  });
});
