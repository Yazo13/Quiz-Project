import { Scene, ranges, skies, structures } from './Scene';

/**
 * The frame a question is asked about.
 *
 * The quiz showed the same estate illustration for every question while the
 * caption underneath announced a different media ID each time. Since the whole
 * anti-AI premise is that the answer is in the picture, a picture that never
 * changes undercuts the format more than any styling choice could.
 *
 * Until a server issues real images, the composition is derived from the media
 * ID: the same ID always produces the same frame, and different IDs differ in
 * light, terrain and what is standing in them. Deterministic rather than
 * random, so a question looks the same every time it is dealt.
 */

/** Small deterministic hash — same string in, same number out. */
function hash(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function QuestionScene({
  mediaId,
  width = '100%',
  height = '100%',
  accessibilityLabel,
}: {
  mediaId: string;
  width?: number | string;
  height?: number | string;
  accessibilityLabel?: string;
}) {
  const h = hash(mediaId);

  return (
    <Scene
      idKey={`q${mediaId}`}
      sky={skies[h % skies.length]}
      range={ranges[(h >> 3) % ranges.length]}
      structure={structures[(h >> 6) % structures.length]}
      // Stepped across the frame rather than free, so the sun never lands
      // behind whatever is standing in the middle.
      sunX={60 + ((h >> 9) % 5) * 62}
      sunY={54 + ((h >> 12) % 3) * 14}
      rows={4 + ((h >> 15) % 3)}
      width={width}
      height={height}
      accessibilityLabel={accessibilityLabel}
    />
  );
}
