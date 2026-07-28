import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Polygon,
  Rect,
  Stop,
} from 'react-native-svg';

/**
 * Tsinandali Estate — the Grand Tournament prize art. Vector rather than a
 * photo so it ships with the bundle and stays crisp at any frame size;
 * swap for a real image when the prize catalogue is wired up.
 */
export function EstateScene({ width = '100%', height = '100%' }: { width?: number | string; height?: number | string }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="estate-sky" x1="0" x2="0" y1="0" y2="1">
          <Stop offset="0" stopColor="#F8E1B2" />
          <Stop offset="0.6" stopColor="#F5C691" />
          <Stop offset="1" stopColor="#E8A07C" />
        </LinearGradient>
        <LinearGradient id="estate-mtn" x1="0" x2="0" y1="0" y2="1">
          <Stop offset="0" stopColor="#3A6B5A" />
          <Stop offset="1" stopColor="#1F4A3A" />
        </LinearGradient>
        <LinearGradient id="estate-mtn2" x1="0" x2="0" y1="0" y2="1">
          <Stop offset="0" stopColor="#6B8A6F" />
          <Stop offset="1" stopColor="#3F5F4A" />
        </LinearGradient>
        <LinearGradient id="estate-vine" x1="0" x2="0" y1="0" y2="1">
          <Stop offset="0" stopColor="#B5C58A" />
          <Stop offset="1" stopColor="#7F9B5E" />
        </LinearGradient>
      </Defs>

      <Rect width="400" height="240" fill="url(#estate-sky)" />

      {/* sun */}
      <Circle cx="310" cy="70" r="34" fill="#FFD58A" opacity="0.9" />
      <Circle cx="310" cy="70" r="22" fill="#FFE4A8" />

      {/* distant ridges */}
      <Path
        d="M0 130 L60 90 L100 110 L160 70 L220 100 L280 80 L340 105 L400 90 L400 200 L0 200 Z"
        fill="url(#estate-mtn2)"
        opacity="0.7"
      />
      <Path
        d="M0 160 L70 120 L120 140 L180 110 L240 130 L310 115 L400 135 L400 240 L0 240 Z"
        fill="url(#estate-mtn)"
      />

      {/* the estate itself */}
      <Rect x="160" y="155" width="90" height="45" fill="#F4E3C4" />
      <Polygon points="155,155 205,135 255,155" fill="#7E2D26" />
      <Rect x="175" y="170" width="10" height="18" fill="#2A2620" />
      <Rect x="200" y="170" width="10" height="18" fill="#2A2620" />
      <Rect x="225" y="170" width="10" height="18" fill="#2A2620" />

      {/* vineyard rows */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Path
          key={i}
          d={`M0 ${200 + i * 7} Q200 ${195 + i * 7} 400 ${200 + i * 7}`}
          stroke="url(#estate-vine)"
          strokeWidth="2.5"
          fill="none"
        />
      ))}

      {/* foreground vines */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
        <Circle key={i} cx={20 + i * 42} cy={230} r="6" fill="#5A3540" />
      ))}
    </Svg>
  );
}
