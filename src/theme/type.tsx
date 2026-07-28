import { StyleSheet, Text, TextProps } from 'react-native';

import { color, font } from './tokens';

type Weight = 'regular' | 'medium' | 'semibold' | 'bold';

interface BaseProps extends TextProps {
  size?: number;
  color?: string;
}

/**
 * Condensed uppercase display face. Bebas Neue has no lowercase glyphs, so
 * the uppercasing is done here rather than left to chance.
 */
export function Display({ size = 24, color: c = color.ink, style, ...rest }: BaseProps) {
  return (
    <Text
      {...rest}
      style={[
        {
          fontFamily: font.display,
          fontSize: size,
          // Bebas sits tight; matching the web's line-height:1 needs a nudge.
          lineHeight: size * 1.02,
          color: c,
          letterSpacing: size * 0.005,
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
  return (
    <Text {...rest} style={[{ fontFamily: font[weight], fontSize: size, color: c }, style]} />
  );
}

/** The small uppercase tracked-out label used above almost every section. */
export function Eyebrow({
  size = 11,
  color: c = color.ink3,
  style,
  ...rest
}: BaseProps) {
  return (
    <Text
      {...rest}
      style={[
        {
          fontFamily: font.bold,
          fontSize: size,
          color: c,
          letterSpacing: size * 0.12,
          textTransform: 'uppercase',
        },
        style,
      ]}
    />
  );
}

export const textStyles = StyleSheet.create({
  tabular: { fontVariant: ['tabular-nums'] },
});
