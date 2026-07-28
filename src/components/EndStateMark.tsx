import { useEffect } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Path, Rect, Text as SvgText } from 'react-native-svg';

import { color, font } from '../theme/tokens';

const SIZE = 168;

/**
 * Victory mark — the trophy lands with a spring overshoot, then rocks gently
 * as if catching the light. (The CSS original is scaleIn + shine.)
 */
export function TrophyMark() {
  const enter = useSharedValue(0.3);
  const rock = useSharedValue(0);

  useEffect(() => {
    enter.value = withSpring(1, { damping: 8, stiffness: 140, mass: 0.8 });
    rock.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [enter, rock]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: enter.value }, { rotate: `${-4 + rock.value * 8}deg` }],
  }));

  return (
    <Animated.View style={[{ width: SIZE, height: SIZE }, style]}>
      <Svg width={SIZE} height={SIZE} viewBox="0 0 200 200">
        {/* plinth */}
        <Rect x="56" y="160" width="88" height="20" fill={color.ink} stroke={color.ink} strokeWidth="4" />
        <Rect x="72" y="140" width="56" height="22" fill={color.ink} stroke={color.ink} strokeWidth="4" />
        {/* cup */}
        <Path
          d="M50 30 L150 30 L142 100 Q142 130 100 130 Q58 130 58 100 Z"
          fill={color.gold}
          stroke={color.ink}
          strokeWidth="5"
          strokeLinejoin="round"
        />
        {/* handles */}
        <Path
          d="M50 40 Q25 45 25 70 Q25 95 50 95"
          fill="none"
          stroke={color.ink}
          strokeWidth="5"
          strokeLinecap="round"
        />
        <Path
          d="M150 40 Q175 45 175 70 Q175 95 150 95"
          fill="none"
          stroke={color.ink}
          strokeWidth="5"
          strokeLinecap="round"
        />
        {/* star */}
        <Path
          d="M100 56 L108 78 L130 78 L113 92 L120 114 L100 102 L80 114 L87 92 L70 78 L92 78 Z"
          fill={color.white}
          stroke={color.ink}
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <Circle cx="72" cy="55" r="4" fill={color.white} />
        <Circle cx="64" cy="68" r="2.5" fill={color.white} />
      </Svg>
    </Animated.View>
  );
}

/**
 * Defeat mark — a cracked compass that shakes once on arrival and then
 * wobbles, needle stuck. Softer than a hard failure state by design.
 */
export function BrokenCompassMark() {
  const shake = useSharedValue(0);
  const wobble = useSharedValue(0);

  useEffect(() => {
    shake.value = withSequence(
      withTiming(-3, { duration: 60 }),
      withTiming(3, { duration: 60 }),
      withTiming(-2, { duration: 60 }),
      withTiming(0, { duration: 60 }),
    );
    wobble.value = withRepeat(
      withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [shake, wobble]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: shake.value },
      { rotate: `${-4 + wobble.value * 8}deg` },
    ],
  }));

  return (
    <Animated.View style={[{ width: SIZE, height: SIZE }, style]}>
      <Svg width={SIZE} height={SIZE} viewBox="0 0 200 200">
        <Circle cx="100" cy="100" r="78" fill={color.surface2} stroke={color.ink} strokeWidth="5" />
        <Circle
          cx="100"
          cy="100"
          r="62"
          fill="none"
          stroke={color.ink}
          strokeWidth="3"
          strokeDasharray="4 6"
        />

        {(
          [
            ['N', 100, 44],
            ['S', 100, 170],
            ['W', 38, 106],
            ['E', 162, 106],
          ] as const
        ).map(([label, x, y]) => (
          <SvgText
            key={label}
            x={x}
            y={y}
            fontFamily={font.display}
            fontSize="16"
            fill={color.ink}
            textAnchor="middle"
          >
            {label}
          </SvgText>
        ))}

        {/* snapped needle */}
        <Path
          d="M100 100 L90 50 L100 80 Z"
          fill={color.coral}
          stroke={color.ink}
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <Path
          d="M100 100 L115 145 L100 120 Z"
          fill={color.ink}
          stroke={color.ink}
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <Circle cx="100" cy="100" r="6" fill={color.ink} />

        {/* crack across the glass */}
        <Path
          d="M60 50 L92 86 L86 96 L120 134"
          fill="none"
          stroke={color.ink}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <Path d="M92 86 L100 80" fill="none" stroke={color.ink} strokeWidth="2" />
      </Svg>
    </Animated.View>
  );
}
