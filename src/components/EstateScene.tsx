import { Scene, ranges, skies } from './Scene';

/**
 * Tsinandali Estate — the Grand Tournament prize art.
 *
 * Vector rather than a photo so it ships with the bundle and stays crisp at
 * any frame size; swap for a real image when the prize catalogue is wired up.
 *
 * Unlike the question frames this composition is fixed. It is a specific
 * place, so the golden light, the first ridge line and the estate itself are
 * chosen rather than derived.
 */
export function EstateScene({
  width = '100%',
  height = '100%',
}: {
  width?: number | string;
  height?: number | string;
}) {
  return (
    <Scene
      idKey="estate"
      sky={skies[0]}
      range={ranges[0]}
      structure="estate"
      sunX={310}
      sunY={70}
      rows={6}
      width={width}
      height={height}
    />
  );
}
