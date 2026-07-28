/**
 * Generates the two end-state Lottie files.
 *
 * They are written rather than hand-drawn because both are particle fields —
 * a few dozen near-identical layers whose only differences are position,
 * timing and tint. Editing the numbers here and re-running beats maintaining
 * 2,000 lines of JSON by hand.
 *
 *   node tools/make-lottie.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'lottie');

const W = 400;
const H = 760;
const FPS = 60;

/** #RRGGBB → Lottie's normalized [r, g, b, a]. */
const rgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255, 1];
};

// Deterministic PRNG so re-running the script doesn't churn the committed
// JSON with a fresh random layout every time.
let seed = 20260728;
const rand = () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

const shape = (kind, size, color) => ({
  ty: 'gr',
  it: [
    kind === 'ellipse'
      ? { ty: 'el', d: 1, s: { a: 0, k: [size, size] }, p: { a: 0, k: [0, 0] } }
      : {
          ty: 'rc',
          d: 1,
          s: { a: 0, k: kind === 'strip' ? [size, size * 0.4] : [size, size] },
          p: { a: 0, k: [0, 0] },
          r: { a: 0, k: 0 },
        },
    { ty: 'fl', c: { a: 0, k: color }, o: { a: 0, k: 100 }, r: 1 },
    {
      ty: 'tr',
      p: { a: 0, k: [0, 0] },
      a: { a: 0, k: [0, 0] },
      s: { a: 0, k: [100, 100] },
      r: { a: 0, k: 0 },
      o: { a: 0, k: 100 },
    },
  ],
});

const particle = ({ index, from, to, spin, fade, size, kind, color, start, end }) => ({
  ddd: 0,
  ind: index,
  ty: 4,
  nm: `p${index}`,
  sr: 1,
  ks: {
    o: {
      a: 1,
      k: [
        { t: start, s: [0] },
        { t: start + 6, s: [100] },
        { t: fade, s: [100] },
        { t: end, s: [0] },
      ],
    },
    r: {
      a: 1,
      k: [
        { t: start, s: [0] },
        { t: end, s: [spin] },
      ],
    },
    p: {
      a: 1,
      k: [
        { t: start, s: [...from, 0] },
        { t: end, s: [...to, 0] },
      ],
    },
    a: { a: 0, k: [0, 0, 0] },
    s: { a: 0, k: [100, 100, 100] },
  },
  ao: 0,
  shapes: [shape(kind, size, color)],
  ip: start,
  op: end,
  st: 0,
  bm: 0,
});

const wrap = (name, layers, op) => ({
  v: '5.7.4',
  fr: FPS,
  ip: 0,
  op,
  w: W,
  h: H,
  nm: name,
  ddd: 0,
  assets: [],
  layers,
});

// ── Victory: confetti thrown from the top edge ──────────────────────────
const victoryPalette = ['#F0B23E', '#FF4D2E', '#144132', '#8FBFA1', '#FFFFFF'].map(rgb);
const victoryOp = 240;

const victory = wrap(
  'victory-burst',
  Array.from({ length: 34 }, (_, i) => {
    const x = rand() * W;
    const start = Math.round(rand() * 70);
    const travel = 150 + Math.round(rand() * 70);
    return particle({
      index: i + 1,
      from: [x, -30],
      // Sideways drift as it falls, so the field doesn't read as a curtain.
      to: [x + (rand() - 0.5) * 140, H + 40],
      spin: 360 + Math.round(rand() * 540),
      size: 7 + Math.round(rand() * 9),
      kind: i % 3 === 0 ? 'ellipse' : i % 3 === 1 ? 'rect' : 'strip',
      color: victoryPalette[i % victoryPalette.length],
      start,
      fade: start + travel - 40,
      end: Math.min(victoryOp, start + travel),
    });
  }),
  victoryOp,
);

// ── Defeat: slow ash drifting down, muted and sparse ────────────────────
const defeatPalette = ['#9A907F', '#6B6358', '#EFE2C7'].map(rgb);
const defeatOp = 360;

const defeat = wrap(
  'defeat-drift',
  Array.from({ length: 16 }, (_, i) => {
    const x = rand() * W;
    const start = Math.round(rand() * 160);
    const travel = 300 + Math.round(rand() * 60);
    return particle({
      index: i + 1,
      from: [x, -20],
      to: [x + (rand() - 0.5) * 60, H + 30],
      spin: Math.round(rand() * 180) - 90,
      size: 4 + Math.round(rand() * 4),
      kind: 'ellipse',
      color: defeatPalette[i % defeatPalette.length],
      start,
      fade: start + travel - 90,
      end: Math.min(defeatOp, start + travel),
    });
  }),
  defeatOp,
);

mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, 'victory-burst.json'), JSON.stringify(victory));
writeFileSync(join(OUT, 'defeat-drift.json'), JSON.stringify(defeat));

console.log(`wrote ${victory.layers.length} + ${defeat.layers.length} layers to ${OUT}`);
