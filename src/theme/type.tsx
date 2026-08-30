import { StyleSheet, Text, TextProps } from 'react-native';

import { useLocale } from '../i18n';
import { color, fontSets, typeMetrics } from './tokens';

type Weight = 'regular' | 'medium' | 'semibold' | 'bold';

interface BaseProps extends TextProps {
  size?: number;
  color?: string;
}

/**
 * Condensed display face for titles and numbers.
 *
 * The point size is treated as the English size and scaled per locale, so a
 * call site can keep asking for `size={48}` and get a headline that fits in
 * either script — Georgian sets in a much wider face and would otherwise clip.
 */
export function Display({ size = 24, color: c = color.ink, style, ...rest }: BaseProps) {
  const locale = useLocale();
  const m = typeMetrics[locale];
  const scaled = size * m.displayScale;

  return (
    <Text
      {...rest}
      style={[
        {
          fontFamily: fontSets[locale].display,
          fontSize: scaled,
          // Bebas sits tight; matching the web's line-height:1 needs a nudge.
          // Georgian needs the opposite — room for ascenders and descenders.
          lineHeight: scaled * m.displayLineHeight,
          color: c,
          letterSpacing: scaled * m.displayTracking,
        },
        style,
      ]}
    />
  );
}

/** Geometric sans for everything that isn't a title. */
export function UI({
  size = 14,
  color: c = color.ink,
  weight = 'regular',
  style,
  ...rest
}: BaseProps & { weight?: Weight }) {
  const locale = useLocale();
  return (
    <Text
      {...rest}
      style={[{ fontFamily: fontSets[locale][weight], fontSize: size, color: c }, style]}
    />
  );
}

/**
 * The small tracked-out label above almost every section.
 *
 * Uppercased and widely tracked in English. Georgian has no uppercase, so the
 * transform is dropped and the tracking pulled in — spaced-out Mkhedruli is
 * markedly harder to read.
 */
export function Eyebrow({ size = 11, color: c = color.ink3, style, ...rest }: BaseProps) {
  const locale = useLocale();
  const m = typeMetrics[locale];

  return (
    <Text
      {...rest}
      style={[
        {
          fontFamily: fontSets[locale].bold,
          fontSize: size,
          color: c,
          letterSpacing: size * m.eyebrowTracking,
          textTransform: m.upper ? 'uppercase' : 'none',
        },
        style,
      ]}
    />
  );
}

export const textStyles = StyleSheet.create({
  tabular: { fontVariant: ['tabular-nums'] },
});
