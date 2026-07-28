import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { border, color, font, radius } from '../theme/tokens';
import { Coin } from './Primitives';

/**
 * The top-right balance widget. The brief asks for "a subtle glow" — an
 * expanding gold halo on a 2.4s loop, which is the closest RN gets to the
 * CSS `goldGlow` keyframes (RN cannot animate box-shadow spread).
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
    opacity: 0.18 + t.value * 0.4,
    transform: [{ scale: 1 + t.value * 0.12 }],
  }));

  return (
    <Pressable onPress={onPress}>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: 'absolute',
              left: -8,
              right: -8,
              top: -8,
              bottom: -8,
              borderRadius: radius.soft,
              backgroundColor: color.gold,
            },
            glow,
          ]}
        />
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
