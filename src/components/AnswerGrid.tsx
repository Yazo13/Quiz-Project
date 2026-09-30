import { View } from 'react-native';

import { border, color, depth, radius } from '../theme/tokens';
import { Display, UI } from '../theme/type';
import { Tactile } from './Tactile';

const LETTERS = ['A', 'B', 'C', 'D'];

/** Colours for one answer in whatever state the round has put it in. */
function paint(state: { correct: boolean; wrong: boolean; revealed: boolean }) {
  if (state.correct) return { bg: color.forest, fg: color.white, badge: color.gold, badgeFg: color.ink };
  if (state.wrong) return { bg: color.coral, fg: color.white, badge: color.ink, badgeFg: color.white };
  // Everything else dims once the answer is out, so the two that matter stand
  // alone rather than competing with three live-looking buttons.
  if (state.revealed) return { bg: color.bgCream, fg: color.ink3, badge: color.bgWarm, badgeFg: color.ink };
  return { bg: color.surface, fg: color.ink, badge: color.bgWarm, badgeFg: color.ink };
}

export function AnswerGrid({
  answers,
  correct,
  selected,
  revealed,
  struck,
  onChoose,
}: {
  answers: readonly string[];
  /** Index of the right answer, for after the reveal. */
  correct: number;
  /** What the player picked, or null while the question is still open. */
  selected: number | null;
  revealed: boolean;
  /** Indexes the 50/50 has crossed out. */
  struck: readonly number[];
  onChoose: (index: number) => void;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginTop: 14 + depth,
        marginBottom: 18,
      }}
    >
      {answers.map((answer, i) => {
        const letter = LETTERS[i];
        const isStruck = struck.includes(i);
        const { bg, fg, badge, badgeFg } = paint({
          correct: revealed && i === correct,
          wrong: revealed && selected === i && i !== correct,
          revealed,
        });

        return (
          <View key={answer} style={{ width: '48%', opacity: isStruck ? 0.3 : 1 }}>
            <Tactile
              height={86}
              // A and D sharp, B and C soft — the alternating radius rule.
              radius={i === 0 || i === 3 ? radius.sharp : radius.soft}
              background={bg}
              disabled={revealed || isStruck}
              silent
              // The letter badge and the answer read as two separate strings
              // otherwise, and a struck-out option looks identical to a live
              // one without the state.
              accessibilityLabel={`${letter}. ${answer}`}
              selected={selected === i}
              onPress={() => onChoose(i)}
            >
              <View
                style={{
                  flex: 1,
                  width: '100%',
                  padding: 12,
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <View
                  style={{
                    width: 26,
                    height: 26,
                    backgroundColor: badge,
                    borderWidth: border.thin,
                    borderColor: color.lineStrong,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Display size={18} color={badgeFg}>
                    {letter}
                  </Display>
                </View>
                <UI size={17} weight="bold" color={fg}>
                  {answer}
                </UI>
              </View>
            </Tactile>
          </View>
        );
      })}
    </View>
  );
}
