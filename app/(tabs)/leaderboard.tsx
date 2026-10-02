import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MeshBackground } from '../../src/components/MeshBackground';
import { Podium } from '../../src/components/Podium';
import { RankList } from '../../src/components/RankList';
import { Chip, LiveDot } from '../../src/components/Primitives';
import { TactileSurface } from '../../src/components/Tactile';
import { Board, useStandings } from '../../src/data/standings';
import { useT } from '../../src/i18n';
import { group } from '../../src/lib/number';
import { useGame } from '../../src/store/game';
import { border, color, radius, screenPad, tabBarSpace } from '../../src/theme/tokens';
import { Display, Eyebrow, UI, textStyles } from '../../src/theme/type';

const filters: Board[] = ['today', 'weekly', 'grand', 'friends'];

export default function LeaderboardScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<Board>('today');
  const t = useT();

  const lastRound = useGame((s) => s.rounds[0]);
  const { board, me, ahead } = useStandings(filter);


  return (
    <View style={{ flex: 1 }}>
      <MeshBackground />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + 10, paddingBottom: tabBarSpace(insets.bottom) }}
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
                <Display size={24} color={color.white} style={textStyles.tabular}>
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
              <Pressable
                key={f}
                accessibilityRole="button"
                accessibilityLabel={t.leaderboard.filters[f]}
                accessibilityState={{ selected: active }}
                onPress={() => setFilter(f)}
                // A chip is about 24pt tall. These four switch the whole
                // board, so they get a target a thumb can find.
                hitSlop={{ top: 10, bottom: 10, left: 4, right: 4 }}
              >
                <Chip
                  label={t.leaderboard.filters[f]}
                  background={active ? color.coral : color.surface}
                  foreground={active ? color.white : color.ink}
                />
              </Pressable>
            );
          })}
        </ScrollView>

        <Podium board={board} />

        <RankList rows={board.slice(3)} />
      </ScrollView>
    </View>
  );
}
