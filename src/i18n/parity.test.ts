import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { en } from './en.ts';
import { ka } from './ka.ts';

/**
 * TypeScript already forces the Georgian table to have every key the English
 * one does. What it does not catch is a translated function that quietly takes
 * a different number of arguments than the call site passes — the extra one is
 * simply ignored, and a label renders with a number missing rather than
 * failing to compile.
 *
 * It also cannot see an entry left in English by accident, or a string that
 * was emptied while editing.
 */

type Table = Record<string, unknown>;

/** Every leaf path in the table, e.g. `arena.battles.geography`. */
function paths(node: unknown, prefix = ''): string[] {
  if (node === null || typeof node !== 'object') return [prefix];
  return Object.entries(node as Table).flatMap(([key, value]) =>
    paths(value, prefix ? `${prefix}.${key}` : key),
  );
}

function at(node: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => (acc as Table)?.[key], node);
}

/**
 * Entries that are the same in both languages on purpose — a brand name, or a
 * card number. Anything else matching English exactly is a missed translation.
 */
const SHARED = new Set(['wallet.payMethod']);

describe('the Georgian table', () => {
  const enPaths = paths(en);

  it('covers every English entry and adds none of its own', () => {
    assert.deepEqual(paths(ka).sort(), enPaths.sort());
  });

  it('keeps strings as strings and functions as functions', () => {
    for (const path of enPaths) {
      assert.equal(
        typeof at(ka, path),
        typeof at(en, path),
        `${path} changed kind between locales`,
      );
    }
  });

  it('takes the same arguments as the English version', () => {
    for (const path of enPaths) {
      const source = at(en, path);
      if (typeof source !== 'function') continue;
      assert.equal(
        (at(ka, path) as Function).length,
        source.length,
        `${path} takes a different number of arguments, so a value would go missing`,
      );
    }
  });

  it('leaves nothing blank', () => {
    for (const table of [en, ka]) {
      for (const path of enPaths) {
        const value = at(table, path);
        if (typeof value === 'string') {
          assert.ok(value.trim().length > 0, `${path} is empty`);
        }
      }
    }
  });

  it('is actually translated', () => {
    const untranslated = enPaths.filter((path) => {
      if (SHARED.has(path)) return false;
      const source = at(en, path);
      return typeof source === 'string' && at(ka, path) === source;
    });
    assert.deepEqual(untranslated, [], 'these still read as English');
  });

  it('produces a usable string from every function', () => {
    // Called with plausible arguments; the point is that nothing throws and
    // nothing comes back with an "undefined" spliced into it.
    for (const path of enPaths) {
      const fn = at(ka, path);
      if (typeof fn !== 'function') continue;
      const args = Array.from({ length: fn.length }, (_, i) => (i === 0 ? 7 : 3));
      const out = String((fn as (...a: unknown[]) => unknown)(...args));
      assert.ok(out.length > 0, `${path} returned nothing`);
      assert.ok(!out.includes('undefined'), `${path} left an argument unfilled`);
    }
  });
});
