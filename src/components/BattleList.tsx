import { Pressable, View } from 'react-native';

import { type Battle, battlesFor } from '../data/battles';
import { presenceAt, seedFor } from '../data/presence';
import { useT } from '../i18n';
import { border, color, radius, screenPad } from '../theme/tokens';
import { Display, Eyebrow, UI } from '../theme/type';
import { Chip, CompassMark, Fire } from './Primitives';

/**
 * The battles on offer below the featured tournament.
 *
 * The row styling runs off the position in the list rather than off the
 * battle: the first row is raised in gold and the corner radius alternates,
 * which is the design's 0/24 rhythm. That means the emphasis follows whatever
 * is on top of the current filter, which is the intent — the list always
 * leads with something.
 */
export function BattleList({
  category,
  now,
  refused,
  onEnter,
}: {
  /** The prize category selected in the scroller, or null for all of them. */
  category: string | null;
  /** The presence clock, so the player counts drift with the rest. */
  now: number;
  /** Key of the battle last refused for want of tokens, if any. */
  refused?: string | null;
  onEnter: (battle: Battle) => void;
}) {
  const t = useT();
  const shown = battlesFor(category);

  return (
    <View style={{ paddingHorizontal: screenPad, paddingTop: 24 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}
      >
        <Display size={22}>{t.arena.battlesToday}</Display>
        <Chip label={t.arena.roundLength} background={color.ink} foreground={color.white} />
      </View>

      <View style={{ gap: 10 }}>
        {shown.length === 0 && (
          <View
            style={{
              borderWidth: border.thin,
              borderStyle: 'dashed',
              borderColor: color.lineStrong,
              paddingVertical: 22,
              alignItems: 'center',
            }}
          >
            <UI size={13} weight="semibold" color={color.ink3}>
              {t.arena.noBattles}
            </UI>
          </View>
        )}
        {shown.map((b, i) => (
          <Pressable
            key={b.key}
            accessibilityRole="button"
            // The refusal is a colour change on one line otherwise, which
            // is nothing at all to a screen reader.
            accessibilityLabel={
              refused === b.key
                ? `${t.arena.battles[b.key]} — ${t.arena.notEnough}`
                : `${t.arena.battles[b.key]} · ${t.arena.playing(
                    presenceAt(b.players, seedFor(b.key), now),
                  )}`
            }
            onPress={() => onEnter(b)}
          >
            <View
              style={{
                borderWidth: border.medium,
                borderColor: color.lineStrong,
                borderRadius: i % 2 === 0 ? radius.sharp : radius.soft,
                backgroundColor: i === 0 ? color.goldSoft : color.surface,
                paddingHorizontal: 14,
                paddingVertical: 12,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderWidth: border.thin,
                  borderColor: color.lineStrong,
                  backgroundColor: i === 0 ? color.coral : i === 1 ? color.forest : color.ink,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CompassMark size={20} fill={color.white} />
              </View>

              <View style={{ flex: 1 }}>
                <UI size={15} weight="bold" numberOfLines={1}>
                  {t.arena.battles[b.key]}
                </UI>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 }}>
                  {/* The refusal replaces the crowd figure on the row that
                      was pressed, which is where the player is looking. */}
                  {refused === b.key ? (
                    <UI size={11} weight="bold" color={color.coral}>
                      {t.arena.notEnough}
                    </UI>
                  ) : (
                    <>
                      <UI size={11} weight="semibold" color={color.ink3}>
                        {t.arena.playing(presenceAt(b.players, seedFor(b.key), now))}
                      </UI>
                      {b.hot && <Fire size={12} />}
                    </>
                  )}
                </View>
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                <Display size={22} color={color.forest}>
                  {b.prize}
                </Display>
                <Eyebrow size={9}>{t.arena.pool}</Eyebrow>
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
