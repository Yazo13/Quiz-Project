/**
 * Gargari Quiz — adventures palette.
 * Mirrors design/tokens.css. Keep the two in sync when either moves.
 */

export const color = {
  bgPaper: '#F2E9D5',
  bgCream: '#FAF4E5',
  bgWarm: '#EFE2C7',
  surface: '#FFFFFF',
  surface2: '#FFFAEC',

  ink: '#181512',
  ink2: '#3A332B',
  ink3: '#6B6358',
  ink4: '#9A907F',

  forest: '#144132',
  forest2: '#1F5B45',
  forest3: '#0B2B20',

  coral: '#FF4D2E',
  coral2: '#E83F22',
  coralSoft: '#FFD9CE',

  gold: '#F0B23E',
  gold2: '#D89923',
  goldSoft: '#FBE6B0',

  sky: '#BFD9C7',
  sky2: '#8FBFA1',

  white: '#FFFFFF',

  /** Hairline separators inside cards. */
  line: 'rgba(24,21,18,0.12)',
  /** The signature border + hard-shadow colour. */
  lineStrong: 'rgba(24,21,18,0.85)',
} as const;

/**
 * Radius is deliberately binary — 0 or 24, nothing between. Adjacent
 * elements alternate between the two; that alternation is the signature.
 */
export const radius = {
  sharp: 0,
  soft: 24,
  /** Pills (chips, avatars) are the one exception. */
  pill: 999,
} as const;

/** Border weights used on interactive surfaces. */
export const border = {
  hairline: 1.5,
  thin: 2,
  medium: 2.5,
  thick: 3,
} as const;

/** Offset of the hard "tactile" shadow, in px. */
export const depth = 4;

export const font = {
  /** Condensed, uppercase — titles and numbers. */
  display: 'BebasNeue_400Regular',
  regular: 'SpaceGrotesk_400Regular',
  medium: 'SpaceGrotesk_500Medium',
  semibold: 'SpaceGrotesk_600SemiBold',
  /** Space Grotesk tops out at 700; the design's 800 maps here. */
  bold: 'SpaceGrotesk_700Bold',
} as const;

/**
 * Neither Bebas Neue nor Space Grotesk carries Georgian glyphs — set either
 * one in Georgian and every character renders as a box. Noto Sans Georgian
 * covers both roles there, with the heaviest weight standing in for the
 * condensed display face.
 */
export const fontSets = {
  en: font,
  ka: {
    display: 'NotoSansGeorgian_800ExtraBold',
    regular: 'NotoSansGeorgian_400Regular',
    medium: 'NotoSansGeorgian_500Medium',
    semibold: 'NotoSansGeorgian_600SemiBold',
    bold: 'NotoSansGeorgian_700Bold',
  },
} as const;

/**
 * Bebas is condensed and all-caps; Noto Georgian is neither. Georgian titles
 * set at the same point size run far wider and clip, so they are scaled down
 * and given the extra leading their ascenders and descenders need.
 *
 * `upper` is off for Georgian because the script has no uppercase — the
 * transform is a no-op there, and the tracking that suits small caps only
 * makes Georgian labels harder to read.
 */
export const typeMetrics = {
  en: {
    displayScale: 1,
    displayLineHeight: 1.02,
    displayTracking: 0.005,
    eyebrowTracking: 0.12,
    upper: true,
  },
  ka: {
    displayScale: 0.72,
    displayLineHeight: 1.2,
    displayTracking: 0,
    eyebrowTracking: 0.04,
    upper: false,
  },
} as const;

/** The mesh-gradient blobs, as [color, x, y] in fractions of the screen. */
export const mesh = [
  { color: '#FFE6B0', x: 0.18, y: 0.22, size: 0.9 },
  { color: '#FFC8B6', x: 0.82, y: 0.18, size: 0.85 },
  { color: '#C7DDC9', x: 0.22, y: 0.88, size: 0.95 },
  { color: '#F2E9D5', x: 0.78, y: 0.82, size: 1.05 },
] as const;

export const screenPad = 18;
/** Height the tab bar occupies, so scroll views can clear it. */
export const tabBarSpace = 110;
