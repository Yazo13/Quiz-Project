import type { ComponentProps } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { useLocale, useT } from '../i18n';
import { border, color, depth, fontSets, radius, typeMetrics } from '../theme/tokens';

const icons: Record<string, string> = {
  index: 'M3 11l9-8 9 8v10H3z',
  leaderboard: 'M4 21V9h4v12zm6 0V3h4v18zm6 0v-8h4v8z',
  wallet: 'M3 7h18v12H3zM3 7l3-3h12l3 3',
  profile: 'M12 12a4 4 0 100-8 4 4 0 000 8zm-7 9a7 7 0 1114 0',
};

// expo-router bundles its own copy of the bottom-tabs navigator rather than
// depending on @react-navigation/bottom-tabs, so the prop type is read off
// the public Tabs component instead of imported from a package.
type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

/**
 * The floating dark tab bar. Not a system tab bar — it sits inset from the
 * edges on the same hard shadow as every other raised surface.
 */
export function TabBar({ state, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const t = useT();
  const locale = useLocale();

  const labels: Record<string, string> = {
    index: t.tabs.arena,
    leaderboard: t.tabs.ranks,
    wallet: t.tabs.wallet,
    profile: t.tabs.you,
  };

  return (
    <View
      style={{
        position: 'absolute',
        left: 12,
        right: 12,
        bottom: Math.max(insets.bottom, 12) + 8,
      }}
    >
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: depth,
          bottom: -depth,
          borderRadius: radius.soft,
          backgroundColor: color.lineStrong,
        }}
      />
      <View
        style={{
          height: 64,
          borderRadius: radius.soft,
          backgroundColor: color.ink,
          borderWidth: border.thick,
          borderColor: color.lineStrong,
          flexDirection: 'row',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const tint = focused ? color.gold : 'rgba(255,255,255,0.55)';

          return (
            <Pressable
              key={route.key}
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!focused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              }}
              style={{ flex: 1, alignItems: 'center', gap: 2 }}
            >
              <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                <Path
                  d={icons[route.name] ?? icons.index}
                  stroke={tint}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: fontSets[locale].bold,
                  // Georgian tab labels are longer; 10pt caps would clip.
                  fontSize: locale === 'ka' ? 9 : 10,
                  textTransform: typeMetrics[locale].upper ? 'uppercase' : 'none',
                  letterSpacing: locale === 'ka' ? 0 : 0.8,
                  color: tint,
                }}
              >
                {labels[route.name] ?? route.name}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
