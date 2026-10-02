import { View } from 'react-native';

import type { Achievement } from '../data/achievements';
import { dateLabel, useT } from '../i18n';
import { border, color, radius, screenPad } from '../theme/tokens';
import { Display, UI } from '../theme/type';

const trophyTints = [color.gold2, color.forest, color.coral, color.sky2, color.gold];
const trophyTint = (i: number) => trophyTints[i % trophyTints.length];

/**
 * The trophy shelf, earned rather than written down.
 *
 * Takes the shelf already sorted — which ones are earned and in what order is
 * the achievements module's decision, not this one's.
 */
export function TrophyShelf({ shelf }: { shelf: Achievement[] }) {
  const t = useT();
  const locked = shelf.filter((a) => !a.earned).length;

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
                {a.earned && a.at ? dateLabel(a.at, t) : t.profile.achievements[a.id].note}
              </UI>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
