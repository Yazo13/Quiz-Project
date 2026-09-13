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
 * The frame a question is asked about.
 *
 * The quiz showed the same estate illustration for every question while the
 * caption underneath announced a different media ID each time. Since the whole
 * anti-AI premise is that the answer is in the picture, a picture that never
 * changes undercuts the format more than any styling choice could.
 *
 * Until a server issues real images, the scene is derived from the media ID:
 * the same ID always produces the same frame, and different IDs differ in
 * light, terrain and what is standing in it. Deterministic rather than random,
 * so a question looks the same every time it is dealt.
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

const skies = [
  { name: 'golden', stops: ['#F8E1B2', '#F5C691', '#E8A07C'], sun: '#FFD58A', core: '#FFE4A8' },
  { name: 'dawn', stops: ['#FBE4D8', '#F3C6C2', '#D79BA6'], sun: '#FFD9C2', core: '#FFF0E2' },
  { name: 'blue', stops: ['#CFE0EC', '#A8C3D8', '#7C9BB8'], sun: '#E8F1F7', core: '#FFFFFF' },
  { name: 'noon', stops: ['#DCEBF2', '#BEDCE8', '#9BC6D8'], sun: '#FFF6D8', core: '#FFFFFF' },
];

/** Ridge silhouettes, back and front, as pairs of path data. */
const ranges = [
  {
    back: 'M0 130 L60 90 L100 110 L160 70 L220 100 L280 80 L340 105 L400 90 L400 200 L0 200 Z',
    front: 'M0 160 L70 120 L120 140 L180 110 L240 130 L310 115 L400 135 L400 240 L0 240 Z',
  },
  {
    back: 'M0 120 L50 100 L110 64 L170 96 L230 72 L300 104 L360 84 L400 100 L400 200 L0 200 Z',
    front: 'M0 150 L60 132 L130 104 L190 136 L250 116 L320 140 L400 122 L400 240 L0 240 Z',
  },
  {
    back: 'M0 138 L70 104 L130 122 L190 84 L260 112 L330 92 L400 118 L400 200 L0 200 Z',
    front: 'M0 168 L80 134 L140 152 L210 120 L270 144 L340 124 L400 148 L400 240 L0 240 Z',
  },
];

/** What is standing in the middle distance. */
type Structure = 'estate' | 'tower' | 'chapel' | 'none';
const structures: Structure[] = ['estate', 'tower', 'chapel', 'none'];

export function QuestionScene({
  mediaId,
  width = '100%',
  height = '100%',
}: {
  mediaId: string;
  width?: number | string;
  height?: number | string;
}) {
  const h = hash(mediaId);
  const sky = skies[h % skies.length];
  const range = ranges[(h >> 3) % ranges.length];
  const structure = structures[(h >> 6) % structures.length];
  // Kept clear of the structure so the two never overlap.
  const sunX = 60 + ((h >> 9) % 5) * 62;
  const sunY = 54 + ((h >> 12) % 3) * 14;
  const rows = 4 + ((h >> 15) % 3);

  // Gradient ids must be unique per rendered scene or one frame picks up
  // another's fill — they share a document on web.
  const id = (part: string) => `q${mediaId}-${part}`;

  return (
    <Svg width={width} height={height} viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id={id('sky')} x1="0" x2="0" y1="0" y2="1">
          <Stop offset="0" stopColor={sky.stops[0]} />
          <Stop offset="0.6" stopColor={sky.stops[1]} />
          <Stop offset="1" stopColor={sky.stops[2]} />
        </LinearGradient>
        <LinearGradient id={id('mtn')} x1="0" x2="0" y1="0" y2="1">
          <Stop offset="0" stopColor="#3A6B5A" />
          <Stop offset="1" stopColor="#1F4A3A" />
        </LinearGradient>
        <LinearGradient id={id('mtn2')} x1="0" x2="0" y1="0" y2="1">
          <Stop offset="0" stopColor="#6B8A6F" />
          <Stop offset="1" stopColor="#3F5F4A" />
        </LinearGradient>
        <LinearGradient id={id('vine')} x1="0" x2="0" y1="0" y2="1">
          <Stop offset="0" stopColor="#B5C58A" />
          <Stop offset="1" stopColor="#7F9B5E" />
        </LinearGradient>
      </Defs>

      <Rect width="400" height="240" fill={`url(#${id('sky')})`} />

      <Circle cx={sunX} cy={sunY} r="34" fill={sky.sun} opacity="0.9" />
      <Circle cx={sunX} cy={sunY} r="22" fill={sky.core} />

      <Path d={range.back} fill={`url(#${id('mtn2')})`} opacity="0.7" />
      <Path d={range.front} fill={`url(#${id('mtn')})`} />

      {structure === 'estate' && (
        <>
          <Rect x="160" y="155" width="90" height="45" fill="#F4E3C4" />
          <Polygon points="155,155 205,135 255,155" fill="#7E2D26" />
          <Rect x="175" y="170" width="10" height="18" fill="#2A2620" />
          <Rect x="200" y="170" width="10" height="18" fill="#2A2620" />
          <Rect x="225" y="170" width="10" height="18" fill="#2A2620" />
        </>
      )}
      {structure === 'tower' && (
        <>
          <Rect x="188" y="128" width="34" height="72" fill="#E8D7B4" />
          <Polygon points="183,128 205,104 227,128" fill="#5A3540" />
          <Rect x="199" y="146" width="12" height="16" fill="#2A2620" />
        </>
      )}
      {structure === 'chapel' && (
        <>
          <Rect x="172" y="158" width="62" height="42" fill="#EFE2C7" />
          <Polygon points="167,158 203,132 239,158" fill="#4A5B52" />
          <Rect x="199" y="112" width="5" height="22" fill="#4A5B52" />
          <Rect x="194" y="120" width="16" height="5" fill="#4A5B52" />
          <Rect x="196" y="176" width="12" height="24" fill="#2A2620" />
        </>
      )}

      {Array.from({ length: rows }, (_, i) => (
        <Path
          key={i}
          d={`M0 ${200 + i * 7} Q200 ${195 + i * 7} 400 ${200 + i * 7}`}
          stroke={`url(#${id('vine')})`}
          strokeWidth="2.5"
          fill="none"
        />
      ))}

      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
        <Circle key={i} cx={20 + i * 42} cy={230} r="6" fill="#5A3540" />
      ))}
    </Svg>
  );
}
