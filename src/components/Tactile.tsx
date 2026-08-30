import { ReactNode } from 'react';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { border, color, depth as DEPTH, font, radius } from '../theme/tokens';
import { UI } from '../theme/type';

/**
 * The design's `box-shadow: 0 4px 0 var(--line-strong)` — a hard, un-blurred
 * offset. React Native has no equivalent (its shadow props are always
 * blurred and, on Android, elevation-driven), so it is drawn as a solid
 * sibling sitting `depth` px lower than the content.
 *
 * The parent must not clip: the shadow deliberately extends past the
 * bottom edge.
 */
function HardShadow({ r, offset }: { r: number; offset: number }) {
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: offset,
        bottom: -offset,
        borderRadius: r,
        backgroundColor: color.lineStrong,
      }}
    />
  );
}

interface SurfaceProps {
  children?: ReactNode;
  /** 0 or 24 — see the radius token. */
  radius?: number;
  background?: string;
  borderWidth?: number;
  /** Only override on dark surfaces, where the ink border disappears. */
  borderColor?: string;
  /** 0 turns the hard shadow off. */
  depth?: number;
  style?: StyleProp<ViewStyle>;
}

/** A non-interactive card in the house style: thick border + hard shadow. */
export function TactileSurface({
  children,
  radius: r = radius.sharp,
  background = color.surface,
  borderWidth = border.thick,
  borderColor = color.lineStrong,
  depth = DEPTH,
  style,
}: SurfaceProps) {
  return (
    <View>
      {depth > 0 && <HardShadow r={r} offset={depth} />}
      <View
        style={[
          {
            borderWidth,
            borderColor,
            borderRadius: r,
            backgroundColor: background,
            overflow: 'hidden',
          },
          style,
        ]}
      >
        {children}
      </View>
    </View>
  );
}

export type TactileVariant = 'cream' | 'forest' | 'coral' | 'gold' | 'paper' | 'ink';

const variants: Record<TactileVariant, { bg: string; fg: string }> = {
  cream: { bg: color.surface, fg: color.ink },
  forest: { bg: color.forest, fg: color.white },
  coral: { bg: color.coral, fg: color.white },
  gold: { bg: color.gold, fg: color.ink },
  paper: { bg: color.bgCream, fg: color.ink },
  ink: { bg: color.ink, fg: color.white },
};

interface ButtonProps extends SurfaceProps {
  onPress?: () => void;
  variant?: TactileVariant;
  height?: number;
  disabled?: boolean;
  /** Skips the haptic tap — for rapid-fire controls like answer buttons. */
  silent?: boolean;
}

/**
 * The tactile button. Press does two things at once: the content slides down
 * into its own shadow (so the button visually flattens against the page),
 * and a spring overshoot fires on release for the bouncy game feel.
 */
export function Tactile({
  children,
  onPress,
  variant = 'cream',
  radius: r = radius.sharp,
  height = 56,
  depth = DEPTH,
  borderWidth = border.thick,
  borderColor = color.lineStrong,
  background,
  disabled,
  silent,
  style,
}: ButtonProps) {
  const v = variants[variant];
  const press = useSharedValue(0);
  const scale = useSharedValue(1);

  const content = useAnimatedStyle(() => ({
    transform: [{ translateY: press.value * depth }, { scale: scale.value }],
  }));

  // The shadow shrinks by exactly as much as the content descends, so the
  // button looks pressed flat rather than merely nudged.
  const shadow = useAnimatedStyle(() => ({
    top: depth * (1 - press.value * 0.75),
    bottom: -depth * (1 - press.value * 0.75),
  }));

  return (
    <Pressable
      disabled={disabled}
      onPressIn={() => {
        press.value = withTiming(1, { duration: 90 });
      }}
      onPressOut={() => {
        press.value = withTiming(0, { duration: 120 });
        // Matches the .spring keyframes: dip, overshoot, settle.
        scale.value = withSequence(
          withTiming(0.96, { duration: 70 }),
          withSpring(1, { damping: 7, stiffness: 220, mass: 0.6 }),
        );
      }}
      onPress={() => {
        if (!silent) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress?.();
      }}
      style={style}
    >
      <View>
        {depth > 0 && (
          <Animated.View
            pointerEvents="none"
            style={[
              {
                position: 'absolute',
                left: 0,
                right: 0,
                borderRadius: r,
                backgroundColor: color.lineStrong,
              },
              shadow,
            ]}
          />
        )}
        <Animated.View
          style={[
            {
              height,
              borderWidth,
              borderColor,
              borderRadius: r,
              backgroundColor: background ?? v.bg,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              gap: 8,
              overflow: 'hidden',
            },
            content,
          ]}
        >
          {children}
        </Animated.View>
      </View>
    </Pressable>
  );
}

/**
 * The button's own label. A component rather than a style object because the
 * face depends on the active locale, which only a hook can read.
 */
export function TactileLabel({
  children,
  color: c = color.ink,
  size = 16,
}: {
  children: ReactNode;
  color?: string;
  size?: number;
}) {
  return (
    <UI weight="bold" size={size} color={c} style={{ letterSpacing: 0.3 }}>
      {children}
    </UI>
  );
}

/**
 * @deprecated Pins the Latin face, so it renders boxes in Georgian. Kept only
 * until the last screen has moved to TactileLabel.
 */
export const tactileLabel = {
  fontFamily: font.bold,
  fontSize: 16,
  letterSpacing: 0.3,
} as const;
