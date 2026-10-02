import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { BattleList } from '../../src/components/BattleList';
import { EstateScene } from '../../src/components/EstateScene';
import { GlassCard } from '../../src/components/GlassCard';
import { MeshBackground } from '../../src/components/MeshBackground';
import { Avatar, Chip, Coin, CompassMark, LiveDot } from '../../src/components/Primitives';
import { Tactile, TactileLabel, TactileSurface } from '../../src/components/Tactile';
import { TokenBalance } from '../../src/components/TokenBalance';
import { type Battle, battleCount, quizHref } from '../../src/data/battles';
import { presenceAt, seedFor, usePresenceClock } from '../../src/data/presence';
import { PLAYER_INITIALS, PLAYER_NAME } from '../../src/data/rivals';
import { GRAND_ID, tournamentAt } from '../../src/data/tournament';
import { useCountdownTo } from '../../src/hooks/useCountdown';
import { useT } from '../../src/i18n';
import { formatHMS } from '../../src/lib/time';
import { DAILY_TOKENS, ENTRY_COST, dailyAvailable, useGame } from '../../src/store/game';
import { border, color, depth, radius, screenPad, tabBarSpace } from '../../src/theme/tokens';
import { Display, Eyebrow, UI, textStyles } from '../../src/theme/type';

/** Baseline for the arena-wide figure; the rest drift around their own. */
const LIVE_BASE = 12408;

/**
 * The prize categories the scroller offers. How many battles each holds is
 * counted from the battle list rather than written down beside it — the tile
 * filters that list, so the two have to agree.
 */
const categories = [
  { id: 'travel', glyph: '✈', tint: color.coralSoft },
  { id: 'tech', glyph: '◉', tint: '#D9E7FF' },
  { id: 'cash', glyph: '$', tint: color.goldSoft },
  { id: 'experience', glyph: '★', tint: color.sky },
] as const;

/** The featured tournament draws a bigger crowd than any single battle. */
const GRAND_BASE = 3402;

export default function ArenaScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  // Simulated until there is a presence endpoint — see src/data/presence.ts.
  // It is also the clock the schedule is read against: reading Date.now()
  // here instead would make the render impure, and the tick is state.
  const now = usePresenceClock();

  // The schedule is derived from the clock rather than counted from a fixed
  // duration, so the countdown survives leaving the tab and coming back. The
  // countdown reaching zero is what flips the seat over, so a tick slower
  // than a second is enough to notice a sitting opening.
  const { startsAt, live } = tournamentAt(now);
  const { seconds: total, done } = useCountdownTo(startsAt);
  const started = live || done;
  const { h, m, s } = formatHMS(total);
  // Null means no filter. Tapping the selected category clears it, which is
  // the only way back to the full list from the scroller itself.
  const [category, setCategory] = useState<string | null>(null);
  const t = useT();


  const tokens = useGame((s) => s.tokens);
  const joined = useGame((s) => s.joined.includes(GRAND_ID));
  const joinTournament = useGame((s) => s.joinTournament);
  const spend = useGame((s) => s.spend);
  const [short, setShort] = useState(false);

  const lastDailyAt = useGame((s) => s.lastDailyAt);
  const claimDaily = useGame((s) => s.claimDaily);
  // Recomputed each render rather than cached: the screen is long-lived and
  // the answer changes at midnight without anything else changing.
  const [dailyTaken, setDailyTaken] = useState(false);
  const dailyOpen = !dailyTaken && dailyAvailable(lastDailyAt);

  const takeDaily = () => {
    claimDaily();
    setDailyTaken(true);
  };

  // The seat is bought once; entering again afterwards is free.
  const enterGrand = () => {
    if (joined || joinTournament(GRAND_ID, ENTRY_COST, t.arena.grandTournament)) {
      router.push('/quiz');
      return;
    }
    setShort(true);
  };

  const enterBattle = (battle: Battle) => {
    if (!spend('entry', ENTRY_COST, t.arena.battles[battle.key])) {
      setShort(true);
      return;
    }
    router.push(quizHref(battle));
  };

  const seatLabel = started
    ? t.arena.enterLive
    : joined
    ? t.arena.enterTournament
    : short && tokens < ENTRY_COST
      ? t.arena.notEnough
      : t.arena.reserveSeat(ENTRY_COST);

  return (
    <View style={{ flex: 1 }}>
      <MeshBackground />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: tabBarSpace }}
      >
        {/* Identity + balance */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: screenPad,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Avatar initials={PLAYER_INITIALS} background={color.coral} size={40} />
            <View>
              <Eyebrow size={11}>{t.arena.role}</Eyebrow>
              <UI size={16} weight="bold">
                {PLAYER_NAME}
              </UI>
            </View>
          </View>
          <TokenBalance amount={tokens} onPress={() => router.push('/wallet')} />
        </View>

        {/* Daily bonus — only while there is one to take, so the arena does
            not carry a permanently dead row. */}
        {dailyOpen && (
          <View style={{ paddingHorizontal: screenPad, paddingTop: 14 }}>
            <Tactile
              variant="gold"
              height={52}
              radius={radius.soft}
              onPress={takeDaily}
              accessibilityLabel={`${t.arena.daily} — ${t.arena.dailyClaim(DAILY_TOKENS)}`}
            >
              <Coin size={18} />
              <TactileLabel color={color.ink}>{t.arena.daily}</TactileLabel>
              <UI size={13} weight="bold" color={color.forest}>
                {t.arena.dailyClaim(DAILY_TOKENS)}
              </UI>
            </Tactile>
          </View>
        )}

        {/* Hero */}
        <View
          style={{
            paddingHorizontal: screenPad,
            paddingTop: 18,
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}
        >
          <Display size={48}>{t.arena.title}</Display>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2, paddingTop: 6 }}>
            <LiveDot size={8} />
            <Eyebrow size={11} color={color.coral}>
              {t.arena.live(presenceAt(LIVE_BASE, 0, now))}
            </Eyebrow>
          </View>
        </View>

        {/* Grand Tournament */}
        <View style={{ paddingHorizontal: screenPad, paddingTop: 14 }}>
          <TactileSurface radius={radius.soft}>
            <View style={{ height: 180, borderBottomWidth: border.thick, borderBottomColor: color.lineStrong }}>
              <EstateScene />

              <Chip
                label={t.arena.grandTournament}
                background={color.coral}
                foreground={color.white}
                style={{ position: 'absolute', top: 12, left: 12 }}
              />

              <View
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderWidth: border.thin,
                  borderColor: color.lineStrong,
                  backgroundColor: 'rgba(255,255,255,0.85)',
                }}
              >
                <CompassMark size={11} />
                <Eyebrow size={10}>{t.arena.place}</Eyebrow>
              </View>

              {/* Frosted prize callout */}
              <GlassCard
                radius={16}
                style={{ position: 'absolute', left: 12, right: 12, bottom: 12 }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    gap: 10,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Eyebrow size={10}>{t.arena.prize}</Eyebrow>
                    <Display size={22}>{t.arena.prizeName}</Display>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Eyebrow size={10}>{t.arena.worth}</Eyebrow>
                    <Display size={22} color={color.forest}>
                      ₾4,800
                    </Display>
                  </View>
                </View>
              </GlassCard>
            </View>

            {/* Countdown */}
            <View style={{ padding: 14 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}
              >
                <Eyebrow size={11} color={started ? color.coral : color.ink3}>
                  {started ? t.arena.started : t.arena.startsIn}
                </Eyebrow>
                <Eyebrow size={11} color={color.coral}>
                  {t.arena.hot(presenceAt(GRAND_BASE, seedFor(GRAND_ID), now))}
                </Eyebrow>
              </View>

              {started ? (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                    borderWidth: border.thin,
                    borderColor: color.lineStrong,
                    backgroundColor: color.coralSoft,
                    paddingVertical: 12,
                    paddingHorizontal: 14,
                    marginBottom: 12,
                  }}
                >
                  <LiveDot size={8} />
                  <Display size={22} color={color.ink}>
                    {t.arena.started}
                  </Display>
                </View>
              ) : (
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
                {[
                  { v: h, l: t.arena.hours },
                  { v: m, l: t.arena.minutes },
                  { v: s, l: t.arena.seconds },
                ].map((unit) => (
                  <View
                    key={unit.l}
                    style={{
                      flex: 1,
                      borderWidth: border.thin,
                      borderColor: color.lineStrong,
                      backgroundColor: color.bgCream,
                      paddingVertical: 8,
                      alignItems: 'center',
                    }}
                  >
                    <Display size={36} style={textStyles.tabular}>
                      {unit.v}
                    </Display>
                    <Eyebrow size={9} style={{ letterSpacing: 1.4, marginTop: 2 }}>
                      {unit.l}
                    </Eyebrow>
                  </View>
                ))}
              </View>
              )}

              <Tactile
                variant="forest"
                height={52}
                radius={radius.sharp}
                onPress={enterGrand}
              >
                <TactileLabel color={color.white}>{seatLabel}</TactileLabel>
                {!joined && <Coin size={16} />}
                <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M5 12h14m-6-6l6 6-6 6"
                    stroke={color.white}
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </Tactile>
            </View>
          </TactileSurface>
        </View>

        {/* Categories */}
        <View style={{ paddingTop: 26 }}>
          <View
            style={{
              paddingHorizontal: screenPad,
              flexDirection: 'row',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}
          >
            <Display size={22}>{t.arena.choosePrize}</Display>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={category ? t.arena.seeAllActive : t.arena.seeAll}
              onPress={() => setCategory(null)}
              disabled={!category}
              // Twelve-point text is the only way back to the unfiltered list.
              hitSlop={{ top: 14, bottom: 14, left: 10, right: 10 }}
            >
              <UI size={12} weight="bold" color={category ? color.coral : color.ink3}>
                {category ? t.arena.seeAllActive : t.arena.seeAll}
              </UI>
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: screenPad, gap: 10, paddingBottom: depth }}
          >
            {categories.map((c) => {
              const active = category === c.id;
              // Radius alternates deliberately — sharp, soft, sharp, soft.
              const r = c.id === 'travel' || c.id === 'cash' ? radius.sharp : radius.soft;

              return (
                <Tactile
                  key={c.id}
                  radius={r}
                  height={140}
                  variant="cream"
                  background={active ? color.ink : c.tint}
                  onPress={() => setCategory(active ? null : c.id)}
                  selected={active}
                  accessibilityLabel={t.categories[c.id]}
                  style={{ width: 128 }}
                >
                  <View
                    style={{
                      flex: 1,
                      width: '100%',
                      padding: 12,
                      justifyContent: 'space-between',
                    }}
                  >
                    <Display size={32} color={active ? color.white : color.ink}>
                      {c.glyph}
                    </Display>
                    <View>
                      <Display size={20} color={active ? color.white : color.ink}>
                        {t.categories[c.id]}
                      </Display>
                      <UI
                        size={10}
                        weight="semibold"
                        color={active ? 'rgba(255,255,255,0.7)' : color.ink3}
                        style={{ marginTop: 2 }}
                      >
                        {/* Cash is a prize type rather than a set of prizes, so it keeps
                            its own label. */}
                        {c.id === 'cash'
                          ? t.arena.cashPool
                          : t.arena.prizeCount(battleCount(c.id))}
                      </UI>
                    </View>
                  </View>
                </Tactile>
              );
            })}
          </ScrollView>
        </View>

        <BattleList category={category} now={now} onEnter={enterBattle} />
      </ScrollView>
    </View>
  );
}
