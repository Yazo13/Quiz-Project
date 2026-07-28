import { ReactNode } from 'react';
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';

import { radius } from '../theme/tokens';

/**
 * Frosted glass, used for prize and reward callouts. The web version is
 * `backdrop-filter: blur(18px) saturate(160%)`; expo-blur is the native
 * equivalent.
 *
 * On Android the blur is more expensive and less faithful, so a slightly
 * heavier white wash carries the effect instead.
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

  return (
    <View style={[{ borderRadius: r, overflow: 'hidden' }, style]}>
      <BlurView
        intensity={Platform.OS === 'android' ? intensity * 0.6 : intensity}
        tint={tint}
        style={StyleSheet.absoluteFill}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: dark ? 'rgba(20,65,50,0.45)' : 'rgba(255,255,255,0.45)',
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
