import { View } from 'react-native';

import type { Ranked } from '../data/standings';
import { useT } from '../i18n';
import { group } from '../lib/number';
import { border, color, radius, screenPad } from '../theme/tokens';
import { Display, UI, textStyles } from '../theme/type';
import { Avatar, Chip, Fire } from './Primitives';

/** Fifth place and up is a long streak; below that the flame means little. */
const HOT_STREAK = 5;

/**
 * The top three, second on the left and first raised in the middle.
 *
 * A filtered board can be short, so whichever of the three is missing is
 * dropped rather than rendered as a hole.
 */
export function Podium({ board }: { board: Ranked[] }) {
  const t = useT();
  const top = [board[1], board[0], board[2]].filter(Boolean);

  return (
    <View
      style={{
        paddingHorizontal: screenPad,
        paddingTop: 20,
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 8,
      }}
    >
      {top.map((p) => {
        const first = p.rank === 1;
        const blockHeight = first ? 168 : p.rank === 2 ? 138 : 120;
        const medal = first ? color.gold : p.rank === 2 ? '#C8C8D0' : color.gold2;

        return (
          <View key={p.name} style={{ flex: first ? 1.2 : 1, alignItems: 'center' }}>
            <View style={{ marginBottom: 8 }}>
              <Avatar initials={p.initials} background={p.tint} size={first ? 64 : 50} />
              {p.streak >= HOT_STREAK && (
                <View style={{ position: 'absolute', top: -6, right: -10 }}>
                  <Fire size={18} />
                </View>
              )}
            </View>
            {/* Every row in the list below says which one is you. The
                podium said nothing, so climbing into the top three took
                your name off the marked row and put it on an unmarked
                plinth — the one place it most needs saying. */}
            <UI size={13} weight="bold" style={{ marginBottom: 2 }} color={p.you ? color.coral : color.ink}>
              {p.name}
            </UI>
            {p.you && (
              <Chip
                label={t.leaderboard.you}
                size={9}
                background={color.coral}
                foreground={color.white}
                style={{ paddingHorizontal: 6, paddingVertical: 1, marginBottom: 2 }}
              />
            )}
            <Display size={18} style={textStyles.tabular}>
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
  );
}
