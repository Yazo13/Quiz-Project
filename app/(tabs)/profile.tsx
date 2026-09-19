import { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MeshBackground } from '../../src/components/MeshBackground';
import { Avatar, Chip, DottedRule, Fire } from '../../src/components/Primitives';
import { Segmented } from '../../src/components/Segmented';
import { Tactile, TactileLabel, TactileSurface } from '../../src/components/Tactile';
import { achievements, sortForShelf } from '../../src/data/achievements';
import { PLAYER_INITIALS, PLAYER_NAME, useStandings } from '../../src/data/standings';
import { useArmed } from '../../src/hooks/useArmed';
import { Strings, localeNames, useLocale, useSetLocale, useT } from '../../src/i18n';
import { relative } from '../../src/lib/time';
import { Locale, WIN_THRESHOLD, useAccuracy, useGame } from '../../src/store/game';
import { border, color, radius, screenPad, tabBarSpace } from '../../src/theme/tokens';
import { Display, Eyebrow, UI } from '../../src/theme/type';

const trophyTints = [color.gold2, color.forest, color.coral, color.sky2, color.gold];

/** How many past rounds the shelf shows before it stops being a summary. */
const RECENT_ROUNDS = 5;

function whenLabel(at: number, when: Strings['wallet']['when']) {
  const { unit, value } = relative(at);
  if (unit === 'now') return when.now;
  return when[unit](value);
}
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
  const recent = roundHistory.slice(0, RECENT_ROUNDS);
  const haptics = useGame((st) => st.haptics);
  const setHaptics = useGame((st) => st.setHaptics);
  const resetProgress = useGame((s) => s.resetProgress);

  /**
   * Wiping progress is the most destructive thing in the app — tokens,
   * rounds, streak and every earned trophy, with nothing to restore from. It
   * fired on a single tap while buying a token pack needed two.
   */
  const { armed: resetArmed, press: pressReset } = useArmed<'reset'>();

  const tapReset = () => {
    if (pressReset('reset')) resetProgress();
  };

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

        {/* Recent rounds — the store has kept this history all along and
            nothing showed it. */}
        <View style={{ paddingHorizontal: screenPad, paddingTop: 24 }}>
          <Display size={22} style={{ marginBottom: 10 }}>
            {t.profile.recentRounds}
          </Display>

          <TactileSurface radius={radius.soft}>
            {recent.length === 0 ? (
              <View style={{ paddingHorizontal: 14, paddingVertical: 24, alignItems: 'center' }}>
                <UI size={13} color={color.ink3}>
                  {t.profile.noRounds}
                </UI>
              </View>
            ) : (
              recent.map((r, i) => {
                const won = r.correct >= WIN_THRESHOLD;
                return (
                  <View
                    key={r.id}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                      paddingHorizontal: 14,
                      paddingVertical: 12,
                      borderTopWidth: i === 0 ? 0 : border.hairline,
                      borderTopColor: color.line,
                    }}
                  >
                    <View
                      style={{
                        width: 34,
                        height: 34,
                        borderWidth: border.thin,
                        borderColor: color.lineStrong,
                        backgroundColor: won ? color.forest : color.bgWarm,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Display size={18} color={won ? color.white : color.ink3}>
                        {r.correct}
                      </Display>
                    </View>

                    <View style={{ flex: 1 }}>
                      <UI size={13} weight="bold">
                        {t.profile.roundScore(r.correct, r.total)}
                      </UI>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 1 }}>
                        {r.bestStreak > 0 && <Fire size={10} />}
                        <UI size={11} color={color.ink3}>
                          {whenLabel(r.at, t.wallet.when)}
                          {r.bestStreak > 0 ? ` · ×${r.bestStreak}` : ''}
                        </UI>
                      </View>
                    </View>

                    <Display size={18} color={won ? color.forest : color.ink3}>
                      {t.profile.roundReward(r.earned)}
                    </Display>
                  </View>
                );
              })
            )}
          </TactileSurface>
        </View>

        {/* Language — the one setting that changes every other screen, so it
            sits above the debug shortcuts rather than buried under them. */}
        <View style={{ paddingHorizontal: screenPad, paddingTop: 24 }}>
          <Eyebrow size={11} style={{ marginBottom: 10 }}>
            {t.profile.language}
          </Eyebrow>
          <Segmented
            selected={locale}
            onChange={setLocale}
            options={(Object.keys(localeNames) as Locale[]).map((code) => ({
              value: code,
              label: localeNames[code],
            }))}
          />
        </View>

        {/* Vibration — the design leans on the press feel, so this is on by
            default, but an app that buzzes on every tap needs a way to stop. */}
        <View style={{ paddingHorizontal: screenPad, paddingTop: 24 }}>
          <Eyebrow size={11} style={{ marginBottom: 10 }}>
            {t.profile.haptics}
          </Eyebrow>
          <Segmented
            selected={haptics}
            onChange={setHaptics}
            options={[
              { value: true, label: t.profile.hapticsOn },
              { value: false, label: t.profile.hapticsOff },
            ]}
          />
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
          <UI size={11} color={color.ink3} style={{ marginBottom: 10 }}>
            {t.profile.resetNote}
          </UI>
          <Tactile
            height={48}
            radius={radius.sharp}
            background={resetArmed ? color.coral : undefined}
            onPress={tapReset}
            accessibilityLabel={resetArmed ? t.profile.resetConfirm : t.profile.reset}
          >
            <TactileLabel color={resetArmed ? color.white : color.coral}>
              {resetArmed ? t.profile.resetConfirm : t.profile.reset}
            </TactileLabel>
          </Tactile>
        </View>
      </ScrollView>
    </View>
  );
}
