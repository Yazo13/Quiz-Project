import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

import { border, color, font, radius } from '../theme/tokens';
import { Coin } from './Primitives';

const HALO_PAD = 22;

/**
 * The top-right balance widget. The brief asks for "a subtle glow", and the
 * CSS gets it from an animated box-shadow spread, which RN cannot animate.
 *
 * A plain tinted View pulsing behind the pill reads as a solid plate — with
 * no blur there is nothing to make the edge disappear. So the halo is an SVG
 * radial gradient fading to zero alpha, and only its opacity and scale
 * animate on the 2.4s loop.
 */
export function TokenBalance({ amount, onPress }: { amount: number; onPress?: () => void }) {
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [t]);

  const glow = useAnimatedStyle(() => ({
    opacity: 0.45 + t.value * 0.4,
    transform: [{ scale: 0.96 + t.value * 0.12 }],
  }));

  return (
    <Pressable onPress={onPress}>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: 'absolute',
              left: -HALO_PAD,
              right: -HALO_PAD,
              top: -HALO_PAD,
              bottom: -HALO_PAD,
            },
            glow,
          ]}
        >
          <Svg width="100%" height="100%">
            <Defs>
              <RadialGradient id="token-halo" cx="50%" cy="50%" r="50%">
                <Stop offset="0.35" stopColor={color.gold} stopOpacity="0.55" />
                <Stop offset="0.7" stopColor={color.gold} stopOpacity="0.22" />
                <Stop offset="1" stopColor={color.gold} stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#token-halo)" />
          </Svg>
        </Animated.View>
        <View
          style={{
            height: 36,
            paddingLeft: 8,
            paddingRight: 12,
            borderRadius: radius.soft,
            backgroundColor: color.surface,
            borderWidth: border.thin,
            borderColor: color.lineStrong,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Coin size={18} />
          <Text
            style={{
              fontFamily: font.bold,
              fontSize: 14,
              color: color.ink,
              fontVariant: ['tabular-nums'],
            }}
          >
            {amount.toLocaleString()}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
