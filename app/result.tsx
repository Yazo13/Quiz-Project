import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import Svg, { Path } from 'react-native-svg';

import { BrokenCompassMark, TrophyMark } from '../src/components/EndStateMark';
import { MeshBackground } from '../src/components/MeshBackground';
import { Coin, DottedRule } from '../src/components/Primitives';
import { Tactile, TactileSurface, tactileLabel } from '../src/components/Tactile';
import { ROUND_LENGTH } from '../src/data/questions';
import { color, radius, screenPad } from '../src/theme/tokens';
import { Display, Eyebrow, UI } from '../src/theme/type';

export default function ResultScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ outcome?: string; correct?: string; streak?: string }>();

  const won = params.outcome !== 'loss';
  const correct = Number(params.correct ?? (won ? 9 : 4));
  const streak = Number(params.streak ?? (won ? 7 : 0));
  const avgTime = won ? '4.2s' : '4.8s';
  const reward = won ? 480 : 15;

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
          {won ? 'You won the round' : 'Round over'}
        </Eyebrow>

        <Display size={68} style={{ lineHeight: 58, textAlign: 'center' }}>
          {won ? 'Glory!' : 'Lost the\ntrail'}
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
                  { v: `${correct} / ${ROUND_LENGTH}`, l: 'Correct' },
                  { v: `×${streak}`, l: 'Streak', tint: color.coral },
                  { v: avgTime, l: 'Avg time' },
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
                  {won ? 'Reward' : 'Consolation'}
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
            variant={won ? 'coral' : 'forest'}
            height={56}
            radius={radius.sharp}
            onPress={() => (won ? router.replace('/') : router.replace('/quiz'))}
          >
            <Text style={[tactileLabel, { color: color.white }]}>
              {won ? 'Claim & continue' : 'Try again · 50'}
            </Text>
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
            <Text style={[tactileLabel, { color: color.ink }]}>
              {won ? 'Share result' : 'Back to Arena'}
            </Text>
          </Tactile>
        </View>

        <View style={{ height: screenPad }} />
      </View>
    </View>
  );
}
