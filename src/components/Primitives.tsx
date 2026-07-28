import { useEffect } from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, Path, RadialGradient, Stop } from 'react-native-svg';

import { border, color, font, radius } from '../theme/tokens';

/** The token coin — a gold sphere with a rim light and a dark rim. */
export function Coin({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20">
      <Defs>
        <RadialGradient id="coin" cx="0.32" cy="0.3" r="0.85">
          <Stop offset="0" stopColor="#FFE38A" />
          <Stop offset="0.55" stopColor="#F0B23E" />
          <Stop offset="1" stopColor="#B47A14" />
        </RadialGradient>
      </Defs>
      <Circle cx="10" cy="10" r="9.2" fill="url(#coin)" stroke="#B47A14" strokeWidth="1.4" />
      <Path d="M4 14a7 7 0 0012 0" fill="rgba(0,0,0,0.14)" />
    </Svg>
  );
}

/** Initials avatar with the house border. */
export function Avatar({
  initials,
  background = color.forest,
  foreground = color.white,
  size = 36,
}: {
  initials: string;
  background?: string;
  foreground?: string;
  size?: number;
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: background,
        borderWidth: border.thin,
        borderColor: color.lineStrong,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          fontFamily: font.bold,
          fontSize: size * 0.36,
          color: foreground,
        }}
      >
        {initials}
      </Text>
    </View>
  );
}

/** The sticker chip — pill, thick border, tracked-out uppercase. */
export function Chip({
  label,
  background = color.surface,
  foreground = color.ink,
  size = 11,
  style,
}: {
  label: string;
  background?: string;
  foreground?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View
      style={[
        {
          borderWidth: border.thin,
          borderColor: color.lineStrong,
          borderRadius: radius.pill,
          paddingHorizontal: 10,
          paddingVertical: 4,
          backgroundColor: background,
          alignSelf: 'flex-start',
        },
        style,
      ]}
    >
      <Text
        style={{
          fontFamily: font.semibold,
          fontSize: size,
          letterSpacing: size * 0.06,
          textTransform: 'uppercase',
          color: foreground,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

/** Streak flame — flickers on a 1.3s loop, same as the CSS. */
export function Fire({ size = 14 }: { size?: number }) {
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withRepeat(
      withTiming(1, { duration: 650, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [t]);

  const flicker = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + t.value * 0.08 }, { rotate: `${-2 + t.value * 4}deg` }],
  }));

  return (
    <Animated.View style={flicker}>
      <Text style={{ fontSize: size }}>🔥</Text>
    </Animated.View>
  );
}

/** Four-point compass star — the app's recurring mark. */
export function CompassMark({ size = 14, fill = color.ink }: { size?: number; fill?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 1L14 10L23 12L14 14L12 23L10 14L1 12L10 10Z" fill={fill} />
    </Svg>
  );
}

/** The live pulse dot used next to "12,408 live" and similar. */
export function LiveDot({ size = 8, tint = color.coral }: { size?: number; tint?: string }) {
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withRepeat(withTiming(1, { duration: 900 }), -1, true);
  }, [t]);

  const halo = useAnimatedStyle(() => ({
    opacity: 0.35 - t.value * 0.25,
    transform: [{ scale: 1 + t.value * 0.9 }],
  }));

  return (
    <View style={{ width: size * 2.5, height: size * 2.5, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: size * 2.2,
            height: size * 2.2,
            borderRadius: size * 1.1,
            backgroundColor: tint,
          },
          halo,
        ]}
      />
      <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: tint }} />
    </View>
  );
}

/** Dotted rule — the CSS `.dotted-rule` divider. */
export function DottedRule({ style }: { style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[{ flexDirection: 'row', height: 2, overflow: 'hidden' }, style]}>
      {Array.from({ length: 60 }).map((_, i) => (
        <View
          key={i}
          style={{
            width: 2,
            height: 2,
            borderRadius: 1,
            marginRight: 6,
            backgroundColor: color.lineStrong,
          }}
        />
      ))}
    </View>
  );
}
