import { ReactNode } from 'react';
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';

import { radius } from '../theme/tokens';

/**
 * Frosted glass, used for prize and reward callouts. The web version is
 * `backdrop-filter: blur(18px) saturate(160%)`; expo-blur is the native
 * equivalent.
 *
 * On Android the blur is both more expensive and less faithful, so it is
 * eased off and a heavier wash carries the effect instead. The comment here
 * described that trade for a while before the wash half of it existed: the
 * blur was reduced, nothing compensated, and the frosting simply came out
 * thinner than designed on half the devices.
 */
export function GlassCard({
  children,
  intensity = 40,
  tint = 'light',
  radius: r = radius.soft,
  style,
}: {
  children?: ReactNode;
  intensity?: number;
  tint?: 'light' | 'dark';
  radius?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const dark = tint === 'dark';
  const android = Platform.OS === 'android';
  // Makes up for the lighter blur. Pure glass needs very little wash; a weak
  // blur behind a weak wash is neither.
  const wash = android ? 0.62 : 0.45;

  return (
    <View style={[{ borderRadius: r, overflow: 'hidden' }, style]}>
      <BlurView
        intensity={android ? intensity * 0.6 : intensity}
        tint={tint}
        style={StyleSheet.absoluteFill}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: dark
              ? `rgba(20,65,50,${wash})`
              : `rgba(255,255,255,${wash})`,
            borderWidth: 1,
            borderColor: dark ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.7)',
            borderRadius: r,
          },
        ]}
      />
      <View>{children}</View>
    </View>
  );
}
