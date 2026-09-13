import { useMemo } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MeshBackground } from '../../src/components/MeshBackground';
import { Avatar, Chip, DottedRule, Fire } from '../../src/components/Primitives';
import { Tactile, TactileLabel, TactileSurface } from '../../src/components/Tactile';
import { achievements, sortForShelf } from '../../src/data/achievements';
import { PLAYER_INITIALS, PLAYER_NAME, useStandings } from '../../src/data/standings';
import { localeNames, useLocale, useSetLocale, useT } from '../../src/i18n';
import { Locale, useAccuracy, useGame } from '../../src/store/game';
import { border, color, radius, screenPad, tabBarSpace } from '../../src/theme/tokens';
import { Display, Eyebrow, UI } from '../../src/theme/type';

const trophyTints = [color.gold2, color.forest, color.coral, color.sky2, color.gold];
const trophyTint = (i: number) => trophyTints[i % trophyTints.length];

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const t = useT();
  const locale = useLocale();
  const setLocale = useSetLocale();

  const roundHistory = useGame((s) => s.rounds);
  const tokens = useGame((s) => s.tokens);
  const rounds = roundHistory.length;
  const streak = useGame((s) => s.streak);

  const shelf = useMemo(
    () => sortForShelf(achievements({ rounds: roundHistory, tokens })),
    [roundHistory, tokens],
  );
  const locked = shelf.filter((a) => !a.earned).length;
  const resetProgress = useGame((s) => s.resetProgress);
  const accuracy = useAccuracy();
  const { me } = useStandings();

  const stats = [
    { value: String(rounds), label: t.profile.rounds },
    { value: `×${streak}`, label: t.profile.streakLabel, tint: color.coral },
    {
      value: accuracy === null ? '—' : `${Math.round(accuracy * 100)}%`,
      label: t.profile.accuracy,
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
          <Eyebrow size={11}>{t.profile.eyebrow}</Eyebrow>
          <Display size={34} style={{ marginTop: 2 }}>
            {t.profile.title}
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
                      {streak > 0 ? t.profile.streak(streak) : t.profile.noStreak}
                    </UI>
                  </View>
                </View>
                <Chip
                  label={t.profile.rank(me.rank)}
                  background={color.ink}
                  foreground={color.gold}
                />
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
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}
          >
            <Display size={22}>{t.profile.trophies}</Display>
            {locked > 0 && (
              <UI size={11} weight="semibold" color={color.ink3}>
                {t.profile.lockedTrophies(locked)}
              </UI>
            )}
          </View>
          <View style={{ gap: 10 }}>
            {shelf.map((a, i) => (
              <View
                key={a.id}
                accessibilityLabel={`${t.profile.achievements[a.id].title} — ${t.profile.achievements[a.id].note}`}
                accessibilityState={{ disabled: !a.earned }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  backgroundColor: a.earned ? color.surface : color.bgCream,
                  borderWidth: border.medium,
                  borderColor: color.lineStrong,
                  borderRadius: i % 2 === 0 ? radius.sharp : radius.soft,
                  // Unearned entries stay legible but visibly not yours yet.
                  opacity: a.earned ? 1 : 0.55,
                }}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: a.earned ? trophyTint(i) : 'transparent',
                    borderWidth: border.thin,
                    borderStyle: a.earned ? 'solid' : 'dashed',
                    borderColor: color.lineStrong,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {!a.earned && a.progress && (
                    <UI size={10} weight="bold" color={color.ink3}>
                      {a.progress.have}
                    </UI>
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <UI size={14} weight="bold">
                    {t.profile.achievements[a.id].title}
                  </UI>
                  <UI size={11} color={color.ink3}>
                    {a.earned && a.at
                      ? new Date(a.at).toLocaleDateString()
                      : t.profile.achievements[a.id].note}
                  </UI>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Language — the one setting that changes every other screen, so it
            sits above the debug shortcuts rather than buried under them. */}
        <View style={{ paddingHorizontal: screenPad, paddingTop: 24 }}>
          <Eyebrow size={11} style={{ marginBottom: 10 }}>
            {t.profile.language}
          </Eyebrow>
          <View
            style={{
              flexDirection: 'row',
              borderWidth: border.medium,
              borderColor: color.lineStrong,
              backgroundColor: color.surface,
              overflow: 'hidden',
            }}
          >
            {(Object.keys(localeNames) as Locale[]).map((code) => {
              const active = locale === code;
              return (
                <Pressable
                  key={code}
                  accessibilityRole="button"
                  accessibilityLabel={localeNames[code]}
                  accessibilityState={{ selected: active }}
                  onPress={() => setLocale(code)}
                  style={{
                    flex: 1,
                    height: 46,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: active ? color.ink : 'transparent',
                  }}
                >
                  <UI size={14} weight="bold" color={active ? color.gold : color.ink}>
                    {localeNames[code]}
                  </UI>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={{ paddingHorizontal: screenPad, paddingTop: 24, gap: 10 }}>
          <Eyebrow size={11}>{t.profile.previewEndStates}</Eyebrow>
          <Tactile
            variant="coral"
            height={52}
            radius={radius.sharp}
            onPress={() => router.push('/result?outcome=win')}
          >
            <TactileLabel color={color.white}>{t.profile.victoryScreen}</TactileLabel>
          </Tactile>
          <Tactile
            variant="paper"
            height={52}
            radius={radius.soft}
            onPress={() => router.push('/result?outcome=loss')}
          >
            <TactileLabel color={color.ink}>{t.profile.defeatScreen}</TactileLabel>
          </Tactile>
        </View>

        {/* Wipes the persisted balance, history and ledger back to the
            starting state — the only way to replay the economy from zero. */}
        <View style={{ paddingHorizontal: screenPad, paddingTop: 24 }}>
          <Eyebrow size={11} style={{ marginBottom: 10 }}>
            {t.profile.dangerZone}
          </Eyebrow>
          <Tactile height={48} radius={radius.sharp} onPress={resetProgress}>
            <TactileLabel color={color.coral}>{t.profile.reset}</TactileLabel>
          </Tactile>
        </View>
      </ScrollView>
    </View>
  );
}
