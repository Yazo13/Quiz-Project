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
import { LinearGradient } from 'expo-linear-gradient';

import { color, mesh } from '../theme/tokens';

/**
 * The "subtle moving mesh gradient" from the brief.
 *
 * CSS gets this from four `radial-gradient(at x% y%, …)` layers drifting via
 * background-position. RN has no radial gradient primitive, so each blob is
 * an oversized circular View with a LinearGradient fading to transparent,
 * blurred by its own scale — soft enough that the seams don't read.
 *
 * The whole field breathes on an 18s loop, matching @keyframes meshDrift.
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

  const drift = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + t.value * 0.04 }],
  }));

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: color.bgPaper, overflow: 'hidden' }]}>
      <Animated.View style={[StyleSheet.absoluteFill, drift]}>
        {mesh.map((blob, i) => {
          const size = Math.max(width, height) * blob.size;
          return (
            <MeshBlob
              key={i}
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
          style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(24,21,18,0.06)' }]}
          pointerEvents="none"
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
  // Alternating drift directions keep the blobs from moving as one block,
  // which is what makes the field read as "alive" rather than as a zoom.
  const dir = phase % 2 === 0 ? 1 : -1;

  const move = useAnimatedStyle(() => ({
    transform: [
      { translateX: t.value * 24 * dir },
      { translateY: t.value * 18 * (phase < 2 ? 1 : -1) },
    ],
  }));

  return (
    <Animated.View
      style={[{ position: 'absolute', left, top, width: size, height: size }, move]}
      pointerEvents="none"
    >
      <LinearGradient
        colors={[tint, withAlpha(tint, 0.55), 'rgba(242,233,213,0)']}
        locations={[0, 0.45, 1]}
        start={{ x: 0.35, y: 0.3 }}
        end={{ x: 0.9, y: 1 }}
        style={{ width: size, height: size, borderRadius: size / 2, opacity: 0.85 }}
      />
    </Animated.View>
  );
}

/** #RRGGBB → rgba(), so the blob can fade out on its own hue. */
function withAlpha(hex: string, alpha: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}
