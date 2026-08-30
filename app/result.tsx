import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import Svg, { Path } from 'react-native-svg';

import { BrokenCompassMark, TrophyMark } from '../src/components/EndStateMark';
import { MeshBackground } from '../src/components/MeshBackground';
import { Coin, DottedRule } from '../src/components/Primitives';
import { Tactile, TactileLabel, TactileSurface } from '../src/components/Tactile';
import { ROUND_LENGTH } from '../src/data/questions';
import { useT } from '../src/i18n';
import { ENTRY_COST, WIN_THRESHOLD, useGame } from '../src/store/game';
import { color, radius, screenPad } from '../src/theme/tokens';
import { Display, Eyebrow, UI } from '../src/theme/type';

export default function ResultScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const t = useT();
  const params = useLocalSearchParams<{ round?: string; outcome?: string }>();

  const rounds = useGame((s) => s.rounds);
  const spend = useGame((s) => s.spend);
  const [short, setShort] = useState(false);

  // A real round arrives by id. The profile's two preview buttons pass an
  // outcome instead, so the screen can be seen without playing.
  const round = params.round ? rounds.find((r) => r.id === params.round) : undefined;
  const won = round ? round.correct >= WIN_THRESHOLD : params.outcome !== 'loss';

  const correct = round?.correct ?? (won ? 9 : 4);
  const total = round?.total ?? ROUND_LENGTH;
  const streak = round?.bestStreak ?? (won ? 7 : 0);
  const avgTime = t.result.seconds(
    ((round?.avgMs ?? (won ? 4200 : 4800)) / 1000).toFixed(1),
  );
  const reward = round?.earned ?? (won ? 480 : 15);

  const retry = () => {
    if (!spend('entry', ENTRY_COST, 'Retry')) {
      setShort(true);
      return;
    }
    router.replace('/quiz');
  };

  return (
    <View style={{ flex: 1 }}>
      <MeshBackground dim={!won} />

      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <LottieView
          source={
            won
              ? require('../assets/lottie/victory-burst.json')
              : require('../assets/lottie/defeat-drift.json')
          }
          autoPlay
          loop
          resizeMode="cover"
          style={StyleSheet.absoluteFill}
        />
      </View>

      <View
        style={{
          flex: 1,
          alignItems: 'center',
          paddingHorizontal: 22,
          paddingTop: insets.top + 40,
          paddingBottom: Math.max(insets.bottom, 12) + 10,
        }}
      >
        <View style={{ marginTop: 20, marginBottom: 18 }}>
          {won ? <TrophyMark /> : <BrokenCompassMark />}
        </View>

        <Eyebrow
          size={12}
          color={won ? color.coral : color.ink3}
          style={{ letterSpacing: 2.4, marginBottom: 6 }}
        >
          {won ? t.result.won : t.result.lost}
        </Eyebrow>

        <Display size={68} style={{ textAlign: 'center' }}>
          {won ? t.result.wonTitle : t.result.lostTitle}
        </Display>

        {/* Stats */}
        <View style={{ width: '100%', marginTop: 22 }}>
          <TactileSurface
            radius={won ? radius.soft : radius.sharp}
            background={won ? color.ink : color.surface}
          >
            <View style={{ paddingHorizontal: 18, paddingVertical: 16 }}>
              <View style={{ flexDirection: 'row' }}>
                {[
                  { v: `${correct} / ${total}`, l: t.result.correct },
                  { v: `×${streak}`, l: t.result.streak, tint: color.coral },
                  { v: avgTime, l: t.result.avgTime },
                ].map((s) => (
                  <View key={s.l} style={{ flex: 1, alignItems: 'center' }}>
                    <Display
                      size={26}
                      color={s.tint ?? (won ? color.gold : color.ink)}
                      style={{ fontVariant: ['tabular-nums'] }}
                    >
                      {s.v}
                    </Display>
                    <Eyebrow
                      size={9}
                      color={won ? 'rgba(255,255,255,0.55)' : color.ink3}
                      style={{ marginTop: 2 }}
                    >
                      {s.l}
                    </Eyebrow>
                  </View>
                ))}
              </View>

              {won ? (
                <View
                  style={{
                    height: 1.5,
                    backgroundColor: 'rgba(255,255,255,0.12)',
                    marginTop: 14,
                    marginBottom: 12,
                  }}
                />
              ) : (
                <DottedRule style={{ marginTop: 14, marginBottom: 12 }} />
              )}

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Eyebrow size={11} color={won ? 'rgba(255,255,255,0.6)' : color.ink3}>
                  {won ? t.result.reward : t.result.consolation}
                </Eyebrow>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Coin size={20} />
                  <Display size={30} color={won ? color.gold : color.forest}>
                    +{reward}
                  </Display>
                </View>
              </View>
            </View>
          </TactileSurface>
        </View>

        <View style={{ flex: 1 }} />

        <View style={{ width: '100%', gap: 10 }}>
          <Tactile
            variant={won ? 'coral' : short ? 'paper' : 'forest'}
            height={56}
            radius={radius.sharp}
            onPress={won ? () => router.replace('/') : retry}
          >
            <TactileLabel color={short && !won ? color.ink : color.white}>
              {won
                ? t.result.claim
                : short
                  ? t.result.notEnough
                  : t.result.tryAgain(ENTRY_COST)}
            </TactileLabel>
            {won ? (
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M5 12h14m-6-6l6 6-6 6"
                  stroke={color.white}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            ) : (
              <Coin size={16} />
            )}
          </Tactile>

          <Tactile
            variant="paper"
            height={48}
            radius={radius.soft}
            onPress={() => router.replace('/')}
          >
            <TactileLabel color={color.ink}>
              {won ? t.result.share : t.result.backToArena}
            </TactileLabel>
          </Tactile>
        </View>

        <View style={{ height: screenPad }} />
      </View>
    </View>
  );
}
