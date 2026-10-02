import { View } from 'react-native';

import type { Ranked } from '../data/standings';
import { useT } from '../i18n';
import { group } from '../lib/number';
import { border, color, radius, screenPad } from '../theme/tokens';
import { Display, Eyebrow, UI, textStyles } from '../theme/type';
import { HOT_STREAK } from './Podium';
import { Avatar, Chip, Fire } from './Primitives';
import { TactileSurface } from './Tactile';

/** Everyone the podium does not show, which is fourth place down. */
export function RankList({ rows }: { rows: Ranked[] }) {
  const t = useT();

  return (
    <View style={{ paddingHorizontal: screenPad, paddingTop: 20 }}>
      <TactileSurface radius={radius.soft}>
        {rows.map((p, i) => (
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
              style={[textStyles.tabular, { width: 28, textAlign: 'center' }]}
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
                      color={p.streak >= HOT_STREAK ? color.coral : color.ink3}
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
              <Display size={20} style={textStyles.tabular}>
                {group(p.pts)}
              </Display>
              <Eyebrow size={9}>{t.leaderboard.pts}</Eyebrow>
            </View>
          </View>
        ))}
      </TactileSurface>
    </View>
  );
}
