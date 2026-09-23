import { Pressable, View } from 'react-native';

import { useArmed } from '../hooks/useArmed';
import { useT } from '../i18n';
import { tapped } from '../lib/feedback';
import { group } from '../lib/number';
import { border, color, radius, screenPad } from '../theme/tokens';
import { Display, Eyebrow, UI } from '../theme/type';
import { Coin } from './Primitives';
import { TactileSurface } from './Tactile';

type PackVariant = 'paper' | 'gold' | 'forest' | 'coral';

export interface Pack {
  tokens: number;
  price: string;
  bonus?: string;
  variant: PackVariant;
  badge?: 'popular' | 'best';
}

/**
 * The store shelf. Prices are the ones the design specified; the token counts
 * climb faster than the price does, which is what the bonus badges are saying.
 */
export const packs: Pack[] = [
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

/**
 * Buying takes two taps. A single one used to credit tokens outright, with no
 * confirmation and no way back, which is the wrong shape for a control that
 * will eventually charge a card. The arming lives here rather than on the
 * screen: it is a property of these buttons, and `onBuy` fires only on the
 * tap that commits.
 */
export function PackGrid({ onBuy }: { onBuy: (amount: number) => void }) {
  const t = useT();
  const { armed, press } = useArmed<number>();

  const tapPack = (amount: number) => {
    if (press(amount)) onBuy(amount);
    else tapped();
  };

  return (
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
                        {t.wallet.bonus(p.bonus)}
                      </UI>
                    )}
                  </View>
                  <Display size={36} color={v.fg} style={{ fontVariant: ['tabular-nums'] }}>
                    {group(p.tokens)}
                  </Display>
                  <Eyebrow
                    size={10}
                    color={onDark ? 'rgba(255,255,255,0.7)' : color.ink3}
                    style={{ marginTop: 2 }}
                  >
                    {t.wallet.tokens}
                  </Eyebrow>
                </View>

                <Pressable
                  onPress={() => tapPack(p.tokens)}
                  accessibilityRole="button"
                  // The price alone reads as a label; the pack it buys
                  // is the part a screen reader would otherwise miss.
                  accessibilityLabel={
                    armed === p.tokens
                      ? t.wallet.confirmBuy(p.price)
                      : `${group(p.tokens)} ${t.wallet.tokens} · ${p.price}`
                  }
                  style={{
                    height: 36,
                    marginTop: 10,
                    borderRadius: v.r === radius.soft ? 18 : radius.sharp,
                    backgroundColor:
                      armed === p.tokens
                        ? color.coral
                        : onDark
                          ? 'rgba(255,255,255,0.18)'
                          : color.ink,
                    borderWidth: border.thin,
                    borderColor: onDark ? 'rgba(255,255,255,0.4)' : color.lineStrong,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <UI size={13} weight="bold" color={color.white}>
                    {armed === p.tokens ? t.wallet.confirmBuy(p.price) : p.price}
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
                <UI size={9} weight="bold" color={color.white}>
                  {t.wallet.popular}
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
                <UI size={9} weight="bold" color={color.gold}>
                  {t.wallet.bestValue}
                </UI>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}
