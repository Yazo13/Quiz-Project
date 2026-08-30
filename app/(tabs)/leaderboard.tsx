import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MeshBackground } from '../../src/components/MeshBackground';
import { Avatar, Chip, Fire, LiveDot } from '../../src/components/Primitives';
import { TactileSurface } from '../../src/components/Tactile';
import { useStandings } from '../../src/data/standings';
import { useT } from '../../src/i18n';
import { group } from '../../src/lib/number';
import { useGame } from '../../src/store/game';
import { border, color, radius, screenPad, tabBarSpace } from '../../src/theme/tokens';
import { Display, Eyebrow, UI } from '../../src/theme/type';

const filters = ['today', 'weekly', 'grand', 'friends'] as const;

export default function LeaderboardScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<(typeof filters)[number]>('today');
  const t = useT();

  const lastRound = useGame((s) => s.rounds[0]);
  const { board, me, ahead } = useStandings();

  // Visual order puts second on the left, first raised in the middle.
  const podium = [board[1], board[0], board[2]];
  const list = board.slice(3);

  return (
    <View style={{ flex: 1 }}>
      <MeshBackground />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + 10, paddingBottom: tabBarSpace }}
      >
        {/* Header */}
        <View
          style={{
            paddingHorizontal: screenPad,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View>
            <Eyebrow size={11}>{t.leaderboard.eyebrow}</Eyebrow>
            <Display size={34} style={{ marginTop: 2 }}>
              {t.leaderboard.title}
            </Display>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 2,
              paddingLeft: 6,
              paddingRight: 10,
              paddingVertical: 3,
              borderWidth: border.thin,
              borderColor: color.lineStrong,
              borderRadius: radius.soft,
              backgroundColor: color.surface,
            }}
          >
            <LiveDot size={7} />
            <Eyebrow size={10}>{t.leaderboard.live}</Eyebrow>
          </View>
        </View>

        {/* Your rank */}
        <View style={{ paddingHorizontal: screenPad, paddingTop: 12 }}>
          <TactileSurface radius={radius.soft} background={color.ink}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                paddingHorizontal: 14,
                paddingVertical: 12,
              }}
            >
              <Display size={56} color={color.gold} style={{ lineHeight: 48 }}>
                #{me.rank}
              </Display>
              <View style={{ flex: 1 }}>
                <Eyebrow size={11} color="rgba(255,255,255,0.6)">
                  {t.leaderboard.yourRank}
                </Eyebrow>
                <Display size={22} color={color.white}>
                  {lastRound ? t.leaderboard.lastRound(lastRound.points) : t.leaderboard.noRounds}
                </Display>
                <UI size={11} weight="semibold" color="rgba(255,255,255,0.7)" style={{ marginTop: 2 }}>
                  {ahead
                    ? t.leaderboard.toOvertake(ahead.pts - me.pts, ahead.name)
                    : t.leaderboard.leading}
                </UI>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Display size={24} color={color.white} style={{ fontVariant: ['tabular-nums'] }}>
                  {group(me.pts)}
                </Display>
                <Eyebrow size={9} color="rgba(255,255,255,0.6)">
                  {t.leaderboard.points}
                </Eyebrow>
              </View>
            </View>
          </TactileSurface>
        </View>

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: screenPad, paddingTop: 14, gap: 8 }}
        >
          {filters.map((f) => {
            const active = filter === f;
            return (
              <Pressable key={f} onPress={() => setFilter(f)}>
                <Chip
                  label={t.leaderboard.filters[f]}
                  background={active ? color.coral : color.surface}
                  foreground={active ? color.white : color.ink}
                />
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Podium */}
        <View
          style={{
            paddingHorizontal: screenPad,
            paddingTop: 20,
            flexDirection: 'row',
            alignItems: 'flex-end',
            gap: 8,
          }}
        >
          {podium.map((p) => {
            const first = p.rank === 1;
            const blockHeight = first ? 168 : p.rank === 2 ? 138 : 120;
            const medal = first ? color.gold : p.rank === 2 ? '#C8C8D0' : color.gold2;

            return (
              <View key={p.name} style={{ flex: first ? 1.2 : 1, alignItems: 'center' }}>
                <View style={{ marginBottom: 8 }}>
                  <Avatar initials={p.initials} background={p.tint} size={first ? 64 : 50} />
                  {p.streak >= 5 && (
                    <View style={{ position: 'absolute', top: -6, right: -10 }}>
                      <Fire size={18} />
                    </View>
                  )}
                </View>
                <UI size={13} weight="bold" style={{ marginBottom: 2 }}>
                  {p.name}
                </UI>
                <Display size={18} style={{ fontVariant: ['tabular-nums'] }}>
                  {group(p.pts)}
                </Display>

                {/* Plinth — open at the bottom, it runs off the screen edge */}
                <View
                  style={{
                    width: '100%',
                    height: blockHeight,
                    marginTop: 8,
                    backgroundColor: first
                      ? color.gold
                      : p.rank === 2
                        ? color.surface
                        : color.coralSoft,
                    borderWidth: border.thick,
                    borderBottomWidth: 0,
                    borderColor: color.lineStrong,
                    borderTopLeftRadius: first ? radius.soft : radius.sharp,
                    borderTopRightRadius: first ? radius.soft : radius.sharp,
                    alignItems: 'center',
                    paddingTop: 10,
                  }}
                >
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: medal,
                      borderWidth: border.medium,
                      borderColor: color.lineStrong,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Display size={22}>{String(p.rank)}</Display>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Rank list */}
        <View style={{ paddingHorizontal: screenPad, paddingTop: 20 }}>
          <TactileSurface radius={radius.soft}>
            {list.map((p, i) => (
              <View
                key={p.name}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  backgroundColor: p.you ? color.goldSoft : 'transparent',
                  borderTopWidth: i === 0 ? 0 : border.hairline,
                  borderTopColor: color.line,
                }}
              >
                <Display
                  size={22}
                  color={p.you ? color.coral : color.ink3}
                  style={{ width: 28, textAlign: 'center', fontVariant: ['tabular-nums'] }}
                >
                  {String(p.rank)}
                </Display>

                <Avatar initials={p.initials} background={p.tint} size={36} />

                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <UI size={14} weight="bold">
                      {p.name}
                    </UI>
                    {p.you && (
                      <Chip
                        label={t.leaderboard.you}
                        size={9}
                        background={color.coral}
                        foreground={color.white}
                        style={{ paddingHorizontal: 6, paddingVertical: 1 }}
                      />
                    )}
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 1 }}>
                    {p.streak > 0 && (
                      <>
                        <Fire size={11} />
                        <UI
                          size={11}
                          weight="bold"
                          color={p.streak >= 5 ? color.coral : color.ink3}
                        >
                          ×{p.streak}
                        </UI>
                        <View
                          style={{
                            width: 3,
                            height: 3,
                            borderRadius: 1.5,
                            backgroundColor: color.ink4,
                          }}
                        />
                      </>
                    )}
                    <UI size={11} color={color.ink3}>
                      {t.leaderboard.accuracy(p.accuracy)}
                    </UI>
                  </View>
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                  <Display size={20} style={{ fontVariant: ['tabular-nums'] }}>
                    {group(p.pts)}
                  </Display>
                  <Eyebrow size={9}>{t.leaderboard.pts}</Eyebrow>
                </View>
              </View>
            ))}
          </TactileSurface>
        </View>
      </ScrollView>
    </View>
  );
}
