import { useEffect } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

import { color, mesh } from '../theme/tokens';

/**
 * The "subtle moving mesh gradient" from the brief.
 *
 * CSS builds this from four stacked `radial-gradient(at x% y%, …)` layers
 * drifting via background-position. The RN equivalent is one SVG radial
 * gradient per blob — a linear gradient inside a circular View looks close
 * in a mockup but leaves a visible straight edge where the stops run out,
 * which reads as a seam rather than a haze.
 *
 * The field breathes on an 18s loop, matching @keyframes meshDrift.
 */
export function MeshBackground({ dim = false }: { dim?: boolean }) {
  const { width, height } = useWindowDimensions();
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withRepeat(
      withTiming(1, { duration: 18000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [t]);

  const breathe = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + t.value * 0.04 }],
  }));

  return (
    <View
      style={[StyleSheet.absoluteFill, { backgroundColor: color.bgPaper, overflow: 'hidden' }]}
      pointerEvents="none"
    >
      <Animated.View style={[StyleSheet.absoluteFill, breathe]}>
        {mesh.map((blob, i) => {
          const size = Math.max(width, height) * blob.size;
          return (
            <MeshBlob
              key={blob.color}
              tint={blob.color}
              size={size}
              left={width * blob.x - size / 2}
              top={height * blob.y - size / 2}
              phase={i}
              t={t}
            />
          );
        })}
      </Animated.View>

      {dim && (
        <View
          style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(24,21,18,0.05)' }]}
        />
      )}
    </View>
  );
}

function MeshBlob({
  tint,
  size,
  left,
  top,
  phase,
  t,
}: {
  tint: string;
  size: number;
  left: number;
  top: number;
  phase: number;
  t: SharedValue<number>;
}) {
  // Each blob drifts on its own vector, so the field never moves as one
  // block — that difference is what makes it read as alive.
  const dx = phase % 2 === 0 ? 1 : -1;
  const dy = phase < 2 ? 1 : -1;

  const drift = useAnimatedStyle(() => ({
    transform: [{ translateX: t.value * 26 * dx }, { translateY: t.value * 20 * dy }],
  }));

  const id = `mesh-${tint.slice(1)}`;

  return (
    <Animated.View style={[{ position: 'absolute', left, top, width: size, height: size }, drift]}>
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient id={id} cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={tint} stopOpacity="0.95" />
            <Stop offset="0.45" stopColor={tint} stopOpacity="0.55" />
            <Stop offset="1" stopColor={tint} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect width={size} height={size} fill={`url(#${id})`} />
      </Svg>
    </Animated.View>
  );
}
