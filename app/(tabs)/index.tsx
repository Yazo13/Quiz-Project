import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { EstateScene } from '../../src/components/EstateScene';
import { GlassCard } from '../../src/components/GlassCard';
import { MeshBackground } from '../../src/components/MeshBackground';
import {
  Avatar,
  Chip,
  Coin,
  CompassMark,
  Fire,
  LiveDot,
} from '../../src/components/Primitives';
import { Tactile, TactileSurface, tactileLabel } from '../../src/components/Tactile';
import { TokenBalance } from '../../src/components/TokenBalance';
import { formatHMS, useCountdown } from '../../src/hooks/useCountdown';
import { ENTRY_COST, useGame } from '../../src/store/game';
import { border, color, depth, radius, screenPad, tabBarSpace } from '../../src/theme/tokens';
import { Display, Eyebrow, UI } from '../../src/theme/type';

/** The one tournament the arena currently features. */
const GRAND_ID = 'grand-tsinandali';

const categories = [
  { id: 'travel', label: 'Travel', glyph: '✈', tint: color.coralSoft, prizes: '12 prizes' },
  { id: 'tech', label: 'Tech', glyph: '◉', tint: '#D9E7FF', prizes: '8 prizes' },
  { id: 'cash', label: 'Cash', glyph: '$', tint: color.goldSoft, prizes: '∞ pool' },
  { id: 'experience', label: 'Experience', glyph: '★', tint: color.sky, prizes: '5 prizes' },
];

const battles = [
  { title: 'Speed Run · Geography', players: 1284, prize: '50K', hot: true },
  { title: 'Tech Quickfire', players: 642, prize: '20K', hot: false },
  { title: 'Culture Clash', players: 2103, prize: '100K', hot: true },
];

export default function ArenaScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const total = useCountdown(3 * 3600 + 47 * 60 + 22);
  const { h, m, s } = formatHMS(total);
  const [category, setCategory] = useState('travel');

  const tokens = useGame((s) => s.tokens);
  const joined = useGame((s) => s.joined.includes(GRAND_ID));
  const joinTournament = useGame((s) => s.joinTournament);
  const spend = useGame((s) => s.spend);
  const [short, setShort] = useState(false);

  // The seat is bought once; entering again afterwards is free.
  const enterGrand = () => {
    if (joined || joinTournament(GRAND_ID, ENTRY_COST, 'Tsinandali')) {
      router.push('/quiz');
      return;
    }
    setShort(true);
  };

  const enterBattle = (title: string) => {
    if (!spend('entry', ENTRY_COST, title)) {
      setShort(true);
      return;
    }
    router.push('/quiz');
  };

  const seatLabel = joined
    ? 'Enter Tournament'
    : short && tokens < ENTRY_COST
      ? 'Not enough tokens'
      : `Reserve Seat · ${ENTRY_COST}`;

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
            <Avatar initials="DG" background={color.coral} size={40} />
            <View>
              <Eyebrow size={11} style={{ letterSpacing: 1.1 }}>
                Adventurer
              </Eyebrow>
              <UI size={16} weight="bold">
                Davit G.
              </UI>
            </View>
          </View>
          <TokenBalance amount={tokens} onPress={() => router.push('/wallet')} />
        </View>

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
          <Display size={48} style={{ lineHeight: 44 }}>
            {'The\nArena'}
          </Display>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2, paddingTop: 6 }}>
            <LiveDot size={8} />
            <Eyebrow size={11} color={color.coral}>
              12,408 live
            </Eyebrow>
          </View>
        </View>

        {/* Grand Tournament */}
        <View style={{ paddingHorizontal: screenPad, paddingTop: 14 }}>
          <TactileSurface radius={radius.soft}>
            <View style={{ height: 180, borderBottomWidth: border.thick, borderBottomColor: color.lineStrong }}>
              <EstateScene />

              <Chip
                label="Grand Tournament"
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
                <Eyebrow size={10}>Kakheti · GE</Eyebrow>
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
                    <Eyebrow size={10}>Prize</Eyebrow>
                    <Display size={22}>Tsinandali Estate · 2 nights</Display>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Eyebrow size={10}>Worth</Eyebrow>
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
                <Eyebrow size={11}>Tournament starts in</Eyebrow>
                <Eyebrow size={11} color={color.coral}>
                  ● Hot · 3,402 in
                </Eyebrow>
              </View>

              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
                {[
                  { v: h, l: 'Hours' },
                  { v: m, l: 'Min' },
                  { v: s, l: 'Sec' },
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
                    <Display size={36} style={{ fontVariant: ['tabular-nums'] }}>
                      {unit.v}
                    </Display>
                    <Eyebrow size={9} style={{ letterSpacing: 1.4, marginTop: 2 }}>
                      {unit.l}
                    </Eyebrow>
                  </View>
                ))}
              </View>

              <Tactile
                variant="forest"
                height={52}
                radius={radius.sharp}
                onPress={enterGrand}
              >
                <Text style={[tactileLabel, { color: color.white }]}>{seatLabel}</Text>
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
            <Display size={22}>Choose your prize</Display>
            <UI size={12} weight="bold" color={color.ink3}>
              See all →
            </UI>
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
                  onPress={() => setCategory(c.id)}
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
                        {c.label}
                      </Display>
                      <UI
                        size={10}
                        weight="semibold"
                        color={active ? 'rgba(255,255,255,0.7)' : color.ink3}
                        style={{ marginTop: 2 }}
                      >
                        {c.prizes}
                      </UI>
                    </View>
                  </View>
                </Tactile>
              );
            })}
          </ScrollView>
        </View>

        {/* Live battles */}
        <View style={{ paddingHorizontal: screenPad, paddingTop: 24 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}
          >
            <Display size={22}>Battles · Today</Display>
            <Chip label="5s rounds" background={color.ink} foreground={color.white} />
          </View>

          <View style={{ gap: 10 }}>
            {battles.map((b, i) => (
              <Pressable key={b.title} onPress={() => enterBattle(b.title)}>
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
                      {b.title}
                    </UI>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 }}>
                      <UI size={11} weight="semibold" color={color.ink3}>
                        {b.players.toLocaleString()} playing
                      </UI>
                      {b.hot && <Fire size={12} />}
                    </View>
                  </View>

                  <View style={{ alignItems: 'flex-end' }}>
                    <Display size={22} color={color.forest}>
                      {b.prize}
                    </Display>
                    <Eyebrow size={9} style={{ letterSpacing: 0.9 }}>
                      Pool
                    </Eyebrow>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
