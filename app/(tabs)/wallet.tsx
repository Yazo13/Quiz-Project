import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { MeshBackground } from '../../src/components/MeshBackground';
import { Coin } from '../../src/components/Primitives';
import { Tactile, TactileSurface, tactileLabel } from '../../src/components/Tactile';
import { border, color, radius, screenPad, tabBarSpace } from '../../src/theme/tokens';
import { Display, Eyebrow, UI } from '../../src/theme/type';

type PackVariant = 'paper' | 'gold' | 'forest' | 'coral';

const packs: {
  tokens: number;
  price: string;
  bonus?: string;
  variant: PackVariant;
  badge?: 'popular' | 'best';
}[] = [
  { tokens: 100, price: '$0.99', variant: 'paper' },
  { tokens: 550, price: '$4.99', bonus: '+10%', variant: 'paper' },
  { tokens: 1200, price: '$9.99', bonus: '+20%', variant: 'gold', badge: 'popular' },
  { tokens: 2800, price: '$19.99', bonus: '+40%', variant: 'forest' },
  { tokens: 6500, price: '$39.99', bonus: '+60%', variant: 'paper' },
  { tokens: 15000, price: '$79.99', bonus: '+100%', variant: 'coral', badge: 'best' },
];

const packStyles: Record<PackVariant, { bg: string; fg: string; r: number }> = {
  paper: { bg: color.surface, fg: color.ink, r: radius.sharp },
  gold: { bg: color.gold, fg: color.ink, r: radius.soft },
  forest: { bg: color.forest, fg: color.white, r: radius.sharp },
  coral: { bg: color.coral, fg: color.white, r: radius.soft },
};

const activity = [
  { label: 'Tournament entry · Tsinandali', amount: -50, when: '2m ago' },
  { label: 'Streak bonus ×3', amount: 120, when: '5m ago' },
  { label: 'Pack · 1,200', amount: 1200, when: '1h ago' },
  { label: 'Speed run reward', amount: 35, when: '3h ago' },
  { label: 'Power-up · 50/50', amount: -25, when: '3h ago' },
  { label: 'Daily check-in', amount: 10, when: 'yesterday' },
];

export default function WalletScreen() {
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<'store' | 'activity'>('store');

  return (
    <View style={{ flex: 1 }}>
      <MeshBackground />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + 10, paddingBottom: tabBarSpace }}
      >
        <View style={{ paddingHorizontal: screenPad }}>
          <Eyebrow size={11}>Your Treasury</Eyebrow>
          <Display size={34} style={{ marginTop: 2 }}>
            Wallet
          </Display>
        </View>

        {/* Balance hero */}
        <View style={{ paddingHorizontal: screenPad, paddingTop: 14 }}>
          <TactileSurface radius={radius.soft} background={color.ink}>
            <View style={{ paddingHorizontal: 18, paddingTop: 18, paddingBottom: 16 }}>
              {/* Decorative coins, clipped by the card's overflow */}
              <View
                pointerEvents="none"
                style={{
                  position: 'absolute',
                  right: -22,
                  top: -22,
                  width: 110,
                  height: 110,
                  borderRadius: 55,
                  backgroundColor: color.gold,
                  opacity: 0.85,
                  borderWidth: border.thick,
                  borderColor: color.lineStrong,
                }}
              />
              <View
                pointerEvents="none"
                style={{
                  position: 'absolute',
                  right: 50,
                  top: 80,
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: color.gold2,
                  opacity: 0.7,
                  borderWidth: border.medium,
                  borderColor: color.lineStrong,
                }}
              />

              <Eyebrow size={11} color="rgba(255,255,255,0.55)">
                Token Balance
              </Eyebrow>
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6, marginTop: 4 }}>
                <Display size={64} color={color.gold} style={{ fontVariant: ['tabular-nums'] }}>
                  1,248
                </Display>
                <View style={{ paddingBottom: 8 }}>
                  <Coin size={22} />
                </View>
              </View>
              <UI size={12} weight="semibold" color="rgba(255,255,255,0.7)" style={{ marginTop: 6 }}>
                ≈ $9.99 · Earned 240 this week
              </UI>

              <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
                <View style={{ flex: 1 }}>
                  <Tactile variant="gold" height={44} radius={radius.sharp} borderWidth={border.medium}>
                    <Text style={[tactileLabel, { fontSize: 13, color: color.ink }]}>＋ TOP UP</Text>
                  </Tactile>
                </View>
                <View style={{ flex: 1 }}>
                  <Tactile
                    height={44}
                    radius={radius.soft}
                    depth={0}
                    background="transparent"
                    borderWidth={border.medium}
                    style={{ opacity: 0.9 }}
                  >
                    <Text style={[tactileLabel, { fontSize: 13, color: color.white }]}>CASH OUT</Text>
                  </Tactile>
                </View>
              </View>
            </View>
          </TactileSurface>
        </View>

        {/* Segmented control */}
        <View style={{ paddingHorizontal: screenPad, paddingTop: 16 }}>
          <View
            style={{
              flexDirection: 'row',
              borderWidth: border.medium,
              borderColor: color.lineStrong,
              backgroundColor: color.surface,
              overflow: 'hidden',
            }}
          >
            {(['store', 'activity'] as const).map((m) => {
              const active = mode === m;
              return (
                <Pressable
                  key={m}
                  onPress={() => setMode(m)}
                  style={{
                    flex: 1,
                    height: 42,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: active ? color.ink : 'transparent',
                  }}
                >
                  <UI
                    size={12}
                    weight="bold"
                    color={active ? color.white : color.ink}
                    style={{ letterSpacing: 1.2, textTransform: 'uppercase' }}
                  >
                    {m}
                  </UI>
                </Pressable>
              );
            })}
          </View>
        </View>

        {mode === 'store' ? (
          <>
            <View
              style={{
                paddingHorizontal: screenPad,
                paddingTop: 20,
                paddingBottom: 10,
                flexDirection: 'row',
                alignItems: 'baseline',
                justifyContent: 'space-between',
              }}
            >
              <Display size={22}>Token Packs</Display>
              <Eyebrow size={11} color={color.forest}>
                One-tap buy ✓
              </Eyebrow>
            </View>

            <View
              style={{
                paddingHorizontal: screenPad,
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 10,
                rowGap: 18,
              }}
            >
              {packs.map((p) => {
                const v = packStyles[p.variant];
                const onDark = v.fg === color.white;

                return (
                  <View key={p.tokens} style={{ width: '48%' }}>
                    <TactileSurface radius={v.r} background={v.bg} style={{ minHeight: 156 }}>
                      <View style={{ padding: 14, flex: 1, justifyContent: 'space-between' }}>
                        <View>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                            <Coin size={22} />
                            {p.bonus && (
                              <UI
                                size={10}
                                weight="bold"
                                color={onDark ? color.gold : color.forest}
                                style={{ letterSpacing: 0.8 }}
                              >
                                {p.bonus} BONUS
                              </UI>
                            )}
                          </View>
                          <Display size={36} color={v.fg} style={{ fontVariant: ['tabular-nums'] }}>
                            {p.tokens.toLocaleString()}
                          </Display>
                          <Eyebrow
                            size={10}
                            color={onDark ? 'rgba(255,255,255,0.7)' : color.ink3}
                            style={{ marginTop: 2 }}
                          >
                            Tokens
                          </Eyebrow>
                        </View>

                        <Pressable
                          onPress={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)}
                          style={{
                            height: 36,
                            marginTop: 10,
                            borderRadius: v.r === radius.soft ? 18 : radius.sharp,
                            backgroundColor: onDark ? 'rgba(255,255,255,0.18)' : color.ink,
                            borderWidth: border.thin,
                            borderColor: onDark ? 'rgba(255,255,255,0.4)' : color.lineStrong,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <UI size={13} weight="bold" color={color.white}>
                            {p.price}
                          </UI>
                        </Pressable>
                      </View>
                    </TactileSurface>

                    {p.badge === 'popular' && (
                      <View
                        style={{
                          position: 'absolute',
                          top: -10,
                          left: 12,
                          backgroundColor: color.coral,
                          borderWidth: border.thin,
                          borderColor: color.lineStrong,
                          paddingHorizontal: 8,
                          paddingVertical: 3,
                        }}
                      >
                        <UI size={9} weight="bold" color={color.white} style={{ letterSpacing: 1 }}>
                          ★ POPULAR
                        </UI>
                      </View>
                    )}
                    {p.badge === 'best' && (
                      <View
                        style={{
                          position: 'absolute',
                          top: -10,
                          right: 12,
                          backgroundColor: color.ink,
                          borderWidth: border.thin,
                          borderColor: color.lineStrong,
                          paddingHorizontal: 8,
                          paddingVertical: 3,
                        }}
                      >
                        <UI size={9} weight="bold" color={color.gold} style={{ letterSpacing: 1 }}>
                          BEST VALUE
                        </UI>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>

            {/* Payment method */}
            <View style={{ paddingHorizontal: screenPad, paddingTop: 20 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  backgroundColor: color.surface,
                  borderWidth: border.thin,
                  borderColor: color.lineStrong,
                  borderStyle: 'dashed',
                }}
              >
                <View
                  style={{
                    width: 38,
                    height: 26,
                    borderRadius: 4,
                    backgroundColor: color.ink2,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Display size={11} color={color.white}>
                    Pay
                  </Display>
                </View>
                <View style={{ flex: 1 }}>
                  <UI size={13} weight="bold">
                    Apple Pay · •••• 4821
                  </UI>
                  <UI size={11} color={color.ink3}>
                    Default · One-tap enabled
                  </UI>
                </View>
                <Pressable>
                  <Eyebrow size={12} color={color.forest} style={{ letterSpacing: 0.5 }}>
                    Change
                  </Eyebrow>
                </Pressable>
              </View>
            </View>
          </>
        ) : (
          <View style={{ paddingHorizontal: screenPad, paddingTop: 20 }}>
            <Display size={22} style={{ marginBottom: 10 }}>
              Recent activity
            </Display>
            <TactileSurface radius={radius.sharp}>
              {activity.map((a, i) => {
                const positive = a.amount > 0;
                return (
                  <View
                    key={a.label}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                      paddingHorizontal: 14,
                      paddingVertical: 12,
                      borderTopWidth: i === 0 ? 0 : border.hairline,
                      borderTopColor: color.line,
                    }}
                  >
                    <View
                      style={{
                        width: 32,
                        height: 32,
                        borderWidth: border.thin,
                        borderColor: color.lineStrong,
                        backgroundColor: positive ? color.goldSoft : color.coralSoft,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Display size={20}>{positive ? '+' : '−'}</Display>
                    </View>
                    <View style={{ flex: 1 }}>
                      <UI size={13} weight="bold">
                        {a.label}
                      </UI>
                      <UI size={11} color={color.ink3}>
                        {a.when}
                      </UI>
                    </View>
                    <Display size={20} color={positive ? color.forest : color.coral}>
                      {positive ? '+' : ''}
                      {a.amount.toLocaleString()}
                    </Display>
                  </View>
                );
              })}
            </TactileSurface>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
