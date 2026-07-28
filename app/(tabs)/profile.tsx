import { ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MeshBackground } from '../../src/components/MeshBackground';
import { Avatar, Chip, DottedRule, Fire } from '../../src/components/Primitives';
import { Tactile, TactileSurface, tactileLabel } from '../../src/components/Tactile';
import { PLAYER_INITIALS, PLAYER_NAME, useStandings } from '../../src/data/standings';
import { useAccuracy, useGame } from '../../src/store/game';
import { border, color, radius, screenPad, tabBarSpace } from '../../src/theme/tokens';
import { Display, Eyebrow, UI } from '../../src/theme/type';

const trophies = [
  { title: 'Kakheti Grand · 3rd', when: 'May 2026', tint: color.gold2 },
  { title: 'Speed Run · Winner', when: 'Apr 2026', tint: color.forest },
  { title: 'Tech Quickfire · 2nd', when: 'Mar 2026', tint: color.coral },
];

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const rounds = useGame((s) => s.rounds.length);
  const streak = useGame((s) => s.streak);
  const resetProgress = useGame((s) => s.resetProgress);
  const accuracy = useAccuracy();
  const { me } = useStandings();

  const stats = [
    { value: String(rounds), label: 'Rounds' },
    { value: `×${streak}`, label: 'Streak', tint: color.coral },
    {
      value: accuracy === null ? '—' : `${Math.round(accuracy * 100)}%`,
      label: 'Accuracy',
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      <MeshBackground />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + 10, paddingBottom: tabBarSpace }}
      >
        <View style={{ paddingHorizontal: screenPad }}>
          <Eyebrow size={11}>Your Record</Eyebrow>
          <Display size={34} style={{ marginTop: 2 }}>
            Profile
          </Display>
        </View>

        {/* Identity card */}
        <View style={{ paddingHorizontal: screenPad, paddingTop: 14 }}>
          <TactileSurface radius={radius.soft}>
            <View style={{ padding: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Avatar initials={PLAYER_INITIALS} background={color.coral} size={56} />
                <View style={{ flex: 1 }}>
                  <Display size={26}>{PLAYER_NAME}</Display>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                    {streak > 0 && <Fire size={12} />}
                    <UI size={12} weight="bold" color={streak > 0 ? color.coral : color.ink3}>
                      {streak > 0 ? `${streak} answer streak` : 'No streak yet'}
                    </UI>
                  </View>
                </View>
                <Chip label={`Rank #${me.rank}`} background={color.ink} foreground={color.gold} />
              </View>

              <DottedRule style={{ marginVertical: 14 }} />

              <View style={{ flexDirection: 'row' }}>
                {stats.map((s) => (
                  <View key={s.label} style={{ flex: 1, alignItems: 'center' }}>
                    <Display size={26} color={s.tint ?? color.ink}>
                      {s.value}
                    </Display>
                    <Eyebrow size={9} style={{ marginTop: 2 }}>
                      {s.label}
                    </Eyebrow>
                  </View>
                ))}
              </View>
            </View>
          </TactileSurface>
        </View>

        {/* Trophies */}
        <View style={{ paddingHorizontal: screenPad, paddingTop: 24 }}>
          <Display size={22} style={{ marginBottom: 10 }}>
            Trophy shelf
          </Display>
          <View style={{ gap: 10 }}>
            {trophies.map((t, i) => (
              <View
                key={t.title}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  backgroundColor: color.surface,
                  borderWidth: border.medium,
                  borderColor: color.lineStrong,
                  borderRadius: i % 2 === 0 ? radius.sharp : radius.soft,
                }}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: t.tint,
                    borderWidth: border.thin,
                    borderColor: color.lineStrong,
                  }}
                />
                <View style={{ flex: 1 }}>
                  <UI size={14} weight="bold">
                    {t.title}
                  </UI>
                  <UI size={11} color={color.ink3}>
                    {t.when}
                  </UI>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* End states are otherwise only reachable by finishing a round —
            these shortcuts keep them reviewable. */}
        <View style={{ paddingHorizontal: screenPad, paddingTop: 24, gap: 10 }}>
          <Eyebrow size={11}>Preview end states</Eyebrow>
          <Tactile
            variant="coral"
            height={52}
            radius={radius.sharp}
            onPress={() => router.push('/result?outcome=win')}
          >
            <Text style={[tactileLabel, { color: color.white }]}>Victory screen</Text>
          </Tactile>
          <Tactile
            variant="paper"
            height={52}
            radius={radius.soft}
            onPress={() => router.push('/result?outcome=loss')}
          >
            <Text style={[tactileLabel, { color: color.ink }]}>Defeat screen</Text>
          </Tactile>
        </View>

        {/* Wipes the persisted balance, history and ledger back to the
            starting state — the only way to replay the economy from zero. */}
        <View style={{ paddingHorizontal: screenPad, paddingTop: 24 }}>
          <Eyebrow size={11} style={{ marginBottom: 10 }}>
            Danger zone
          </Eyebrow>
          <Tactile height={48} radius={radius.sharp} onPress={resetProgress}>
            <Text style={[tactileLabel, { color: color.coral }]}>Reset progress</Text>
          </Tactile>
        </View>
      </ScrollView>
    </View>
  );
}
