import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MeshBackground } from '../../src/components/MeshBackground';
import { PackGrid } from '../../src/components/PackGrid';
import { Coin } from '../../src/components/Primitives';
import { Segmented } from '../../src/components/Segmented';
import { Tactile, TactileLabel, TactileSurface } from '../../src/components/Tactile';
import { Strings, useT } from '../../src/i18n';
import { succeeded } from '../../src/lib/feedback';
import { group } from '../../src/lib/number';
import { relative } from '../../src/lib/time';
import { useGame, useWeeklyEarned } from '../../src/store/game';
import { border, color, radius, screenPad, tabBarSpace } from '../../src/theme/tokens';
import { Display, Eyebrow, UI } from '../../src/theme/type';

/** Tokens per US dollar, taken from the headline $9.99 / 1,200 pack. */
const TOKENS_PER_DOLLAR = 120;

function whenLabel(at: number, when: Strings['wallet']['when']) {
  const { unit, value } = relative(at);
  if (unit === 'now') return when.now;
  return when[unit](value);
}

export default function WalletScreen() {
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<'store' | 'activity'>('store');
  const t = useT();

  const tokens = useGame((s) => s.tokens);
  const ledger = useGame((s) => s.ledger);
  const credit = useGame((s) => s.credit);
  const weekly = useWeeklyEarned();

  const buyPack = (amount: number) => {
    // Standing in for the real IAP call, which needs a development build.
    credit('pack', amount, group(amount));
    succeeded();
    setMode('activity');
  };

  return (
    <View style={{ flex: 1 }}>
      <MeshBackground />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + 10, paddingBottom: tabBarSpace }}
      >
        <View style={{ paddingHorizontal: screenPad }}>
          <Eyebrow size={11}>{t.wallet.eyebrow}</Eyebrow>
          <Display size={34} style={{ marginTop: 2 }}>
            {t.wallet.title}
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
                {t.wallet.balance}
              </Eyebrow>
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6, marginTop: 4 }}>
                <Display size={64} color={color.gold} style={{ fontVariant: ['tabular-nums'] }}>
                  {group(tokens)}
                </Display>
                <View style={{ paddingBottom: 8 }}>
                  <Coin size={22} />
                </View>
              </View>
              <UI size={12} weight="semibold" color="rgba(255,255,255,0.7)" style={{ marginTop: 6 }}>
                {t.wallet.summary((tokens / TOKENS_PER_DOLLAR).toFixed(2), weekly)}
              </UI>

              <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
                <View style={{ flex: 1 }}>
                  <Tactile
                    variant="gold"
                    height={44}
                    radius={radius.sharp}
                    borderWidth={border.medium}
                    onPress={() => setMode('store')}
                  >
                    <TactileLabel size={13} color={color.ink}>
                      {t.wallet.topUp}
                    </TactileLabel>
                  </Tactile>
                </View>
                <View style={{ flex: 1 }}>
                  {/* Withdrawal needs a payout provider that does not exist
                      yet. Disabled and labelled, rather than looking live and
                      doing nothing when tapped. */}
                  <Tactile
                    height={44}
                    radius={radius.soft}
                    depth={0}
                    background="transparent"
                    borderWidth={border.medium}
                    // The ink border would vanish against the dark card.
                    borderColor="rgba(255,255,255,0.25)"
                    disabled
                    accessibilityLabel={`${t.wallet.cashOut} — ${t.wallet.soon}`}
                  >
                    <TactileLabel size={13} color="rgba(255,255,255,0.45)">
                      {t.wallet.cashOut}
                    </TactileLabel>
                    <UI size={10} weight="bold" color="rgba(255,255,255,0.35)">
                      {t.wallet.soon}
                    </UI>
                  </Tactile>
                </View>
              </View>
            </View>
          </TactileSurface>
        </View>

        {/* Segmented control */}
        <View style={{ paddingHorizontal: screenPad, paddingTop: 16 }}>
          <Segmented
            height={42}
            size={12}
            activeColor={color.white}
            selected={mode}
            onChange={setMode}
            options={[
              { value: 'store' as const, label: t.wallet.store },
              { value: 'activity' as const, label: t.wallet.activity },
            ]}
          />
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
              <Display size={22}>{t.wallet.packs}</Display>
              <Eyebrow size={11} color={color.forest}>
                {t.wallet.oneTap}
              </Eyebrow>
            </View>

            <PackGrid onBuy={buyPack} />

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
                    {t.wallet.payMethod}
                  </UI>
                  <UI size={11} color={color.ink3}>
                    {t.wallet.payNote}
                  </UI>
                </View>
                {/* Same again: managing cards needs the payment provider. */}
                <Pressable disabled accessibilityLabel={`${t.wallet.change} — ${t.wallet.soon}`}>
                  <Eyebrow size={12} color={color.ink4}>
                    {t.wallet.change}
                  </Eyebrow>
                </Pressable>
              </View>
            </View>
          </>
        ) : (
          <View style={{ paddingHorizontal: screenPad, paddingTop: 20 }}>
            <Display size={22} style={{ marginBottom: 10 }}>
              {t.wallet.recent}
            </Display>
            {ledger.length === 0 ? (
              <TactileSurface radius={radius.sharp}>
                <View style={{ paddingHorizontal: 14, paddingVertical: 28, alignItems: 'center' }}>
                  <Display size={22} color={color.ink3}>
                    {t.wallet.emptyTitle}
                  </Display>
                  <UI
                    size={12}
                    color={color.ink3}
                    style={{ marginTop: 4, textAlign: 'center' }}
                  >
                    {t.wallet.emptyBody}
                  </UI>
                </View>
              </TactileSurface>
            ) : (
            <TactileSurface radius={radius.sharp}>
              {ledger.map((a, i) => {
                const positive = a.amount > 0;
                return (
                  <View
                    key={a.id}
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
                        {t.wallet.tx[a.kind]}
                        {a.detail ? ` · ${a.detail}` : ''}
                      </UI>
                      <UI size={11} color={color.ink3}>
                        {whenLabel(a.at, t.wallet.when)}
                      </UI>
                    </View>
                    <Display size={20} color={positive ? color.forest : color.coral}>
                      {positive ? '+' : ''}
                      {group(a.amount)}
                    </Display>
                  </View>
                );
              })}
            </TactileSurface>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
