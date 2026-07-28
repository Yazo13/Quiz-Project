import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';

import { EstateScene } from '../src/components/EstateScene';
import { Avatar, Chip, Coin, Fire } from '../src/components/Primitives';
import { Tactile } from '../src/components/Tactile';
import { ROUND_LENGTH, TIME_LIMIT, questionAt } from '../src/data/questions';
import { border, color, depth, radius } from '../src/theme/tokens';
import { Display, Eyebrow, UI } from '../src/theme/type';

const opponents = [
  { initials: 'NK', tint: '#FF4D2E' },
  { initials: 'AS', tint: '#144132' },
  { initials: 'GL', tint: '#F0B23E' },
  { initials: 'TM', tint: '#5A3540' },
];

export default function QuizScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(3);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);

  const question = questionAt(index);

  // The bar is driven by Reanimated so the depletion stays smooth on the UI
  // thread; the numeric readout ticks separately at 10 Hz, which is all the
  // precision a player can read anyway.
  const progress = useSharedValue(1);
  const tick = useRef<ReturnType<typeof setInterval> | null>(null);
  const deadline = useRef(Date.now() + TIME_LIMIT * 1000);

  const stopTimers = useCallback(() => {
    if (tick.current) clearInterval(tick.current);
    tick.current = null;
    progress.value = progress.value; // freeze wherever it got to
  }, [progress]);

  const timeOut = useCallback(() => {
    setRevealed(true);
    setStreak(0);
    stopTimers();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }, [stopTimers]);

  // One timer lifecycle per question.
  useEffect(() => {
    deadline.current = Date.now() + TIME_LIMIT * 1000;
    setTimeLeft(TIME_LIMIT);
    progress.value = 1;
    progress.value = withTiming(
      0,
      { duration: TIME_LIMIT * 1000, easing: Easing.linear },
      (finished) => {
        if (finished) runOnJS(timeOut)();
      },
    );

    tick.current = setInterval(() => {
      const left = Math.max(0, (deadline.current - Date.now()) / 1000);
      setTimeLeft(left);
      if (left <= 0 && tick.current) {
        clearInterval(tick.current);
        tick.current = null;
      }
    }, 100);

    return () => {
      if (tick.current) clearInterval(tick.current);
      tick.current = null;
    };
  }, [index, progress, timeOut]);

  const urgent = timeLeft < 2 && !revealed;

  const bar = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));

  const choose = (i: number) => {
    if (revealed) return;
    stopTimers();
    setSelected(i);
    setRevealed(true);

    if (i === question.correct) {
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      setStreak(0);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const next = () => {
    if (index + 1 >= ROUND_LENGTH) {
      const finalScore = score;
      router.replace(
        `/result?outcome=${finalScore >= 6 ? 'win' : 'loss'}&correct=${finalScore}&streak=${streak}`,
      );
      return;
    }
    setSelected(null);
    setRevealed(false);
    setIndex((i) => i + 1);
  };

  const correctPicked = selected === question.correct;

  return (
    <View style={{ flex: 1, backgroundColor: color.bgPaper }}>
      {/* Depleting progress bar — the whole screen's clock */}
      <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 16 }}>
        <View
          style={{
            height: 12,
            backgroundColor: color.bgWarm,
            borderWidth: border.medium,
            borderColor: color.lineStrong,
            overflow: 'hidden',
          }}
        >
          <Animated.View
            style={[
              { height: '100%', backgroundColor: urgent ? color.coral : color.forest },
              bar,
            ]}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 12,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Chip
              label={`Q ${index + 1} / ${ROUND_LENGTH}`}
              background={color.ink}
              foreground={color.white}
            />
            <Chip label={question.category} />
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {/* Anti-cheat indicator */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Svg width={11} height={13} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M5 11V7a7 7 0 0114 0v4M4 11h16v10H4z"
                  stroke={color.forest}
                  strokeWidth={2.5}
                />
              </Svg>
              <Eyebrow size={10} color={color.forest}>
                Secure
              </Eyebrow>
            </View>
            <Display
              size={28}
              color={urgent ? color.coral : color.ink}
              style={{ width: 56, textAlign: 'right', fontVariant: ['tabular-nums'] }}
            >
              {timeLeft.toFixed(1)}s
            </Display>
          </View>
        </View>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 8 }}>
        <Display size={30} style={{ lineHeight: 29, marginBottom: 12 }}>
          {question.prompt}
        </Display>

        {/* Media box — the core of the anti-AI format */}
        <View>
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: depth,
              bottom: -depth,
              borderRadius: radius.soft,
              backgroundColor: color.lineStrong,
            }}
          />
          <View
            style={{
              height: 200,
              borderRadius: radius.soft,
              borderWidth: border.thick,
              borderColor: color.lineStrong,
              overflow: 'hidden',
            }}
          >
            <EstateScene />

            <View
              style={{
                position: 'absolute',
                top: 10,
                left: 10,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                paddingHorizontal: 8,
                paddingVertical: 4,
                backgroundColor: 'rgba(20,21,18,0.85)',
                borderWidth: 1.5,
                borderColor: '#000',
              }}
            >
              <Svg width={10} height={10} viewBox="0 0 24 24" fill="none">
                <Circle cx="12" cy="12" r="3" fill={color.white} />
                <Circle cx="12" cy="12" r="9" stroke={color.white} strokeWidth={2} />
              </Svg>
              <Eyebrow size={9} color={color.white}>
                Live image
              </Eyebrow>
            </View>

            <View
              style={{
                position: 'absolute',
                bottom: 8,
                right: 10,
              }}
            >
              <UI size={10} weight="bold" color={color.white}>
                ID #{question.mediaId} · Verified ✓
              </UI>
            </View>
          </View>
        </View>

        {/* Answers */}
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 10,
            marginTop: 14 + depth,
            marginBottom: 18,
          }}
        >
          {question.answers.map((answer, i) => {
            const letter = ['A', 'B', 'C', 'D'][i];
            const isCorrect = revealed && i === question.correct;
            const isWrong = revealed && selected === i && i !== question.correct;

            let bg: string = color.surface;
            let fg: string = color.ink;
            let badge: string = color.bgWarm;
            let badgeFg: string = color.ink;

            if (isCorrect) {
              bg = color.forest;
              fg = color.white;
              badge = color.gold;
            } else if (isWrong) {
              bg = color.coral;
              fg = color.white;
              badge = color.ink;
              badgeFg = color.white;
            } else if (revealed) {
              bg = color.bgCream;
              fg = color.ink3;
            }

            return (
              <View key={answer} style={{ width: '48%' }}>
                <Tactile
                  height={86}
                  // A and D sharp, B and C soft — the alternating radius rule.
                  radius={i === 0 || i === 3 ? radius.sharp : radius.soft}
                  background={bg}
                  disabled={revealed}
                  silent
                  onPress={() => choose(i)}
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

        {/* Power-up row before the answer, verdict after it */}
        {!revealed ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 14,
              paddingVertical: 10,
              borderWidth: border.thin,
              borderStyle: 'dashed',
              borderColor: color.lineStrong,
              backgroundColor: 'rgba(255,255,255,0.55)',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Coin size={18} />
              <UI size={13} weight="semibold" color={color.ink2}>
                50/50 power-up · 25 tokens
              </UI>
            </View>
            <Pressable
              style={{
                backgroundColor: color.ink,
                paddingHorizontal: 12,
                paddingVertical: 6,
              }}
            >
              <Eyebrow size={12} color={color.white} style={{ letterSpacing: 0.7 }}>
                Use
              </Eyebrow>
            </Pressable>
          </View>
        ) : (
          <View>
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: depth,
                bottom: -depth,
                backgroundColor: color.lineStrong,
              }}
            />
            <View
              style={{
                backgroundColor: correctPicked ? color.forest : color.ink,
                borderWidth: border.thick,
                borderColor: color.lineStrong,
                paddingHorizontal: 14,
                paddingVertical: 12,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
              }}
            >
              <View style={{ flex: 1 }}>
                <Display size={20} color={correctPicked ? color.gold : color.coral}>
                  {correctPicked
                    ? '+120 pts · Correct!'
                    : selected === null
                      ? 'Time out'
                      : 'Wrong'}
                </Display>
                <UI size={11} color="rgba(255,255,255,0.8)" style={{ marginTop: 2 }}>
                  Streak: {correctPicked ? `×${streak}` : 'Reset to 0'}
                </UI>
              </View>
              <Pressable
                onPress={next}
                style={{
                  backgroundColor: color.gold,
                  borderWidth: border.thin,
                  borderColor: color.lineStrong,
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                }}
              >
                <Eyebrow size={13} color={color.ink} style={{ letterSpacing: 0.8 }}>
                  {index + 1 >= ROUND_LENGTH ? 'Finish →' : 'Next →'}
                </Eyebrow>
              </Pressable>
            </View>
          </View>
        )}

        <View style={{ flex: 1 }} />

        {/* Live opponents */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            paddingTop: 14,
            paddingBottom: Math.max(insets.bottom, 12) + 10,
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            {opponents.map((o, i) => (
              <View key={o.initials} style={{ marginLeft: i === 0 ? 0 : -10 }}>
                <Avatar initials={o.initials} background={o.tint} size={28} />
              </View>
            ))}
          </View>
          <UI size={11} weight="semibold" color={color.ink3}>
            + 1,280 playing now
          </UI>
          <View style={{ flex: 1 }} />
          <Fire size={16} />
          <Display size={22} color={color.coral}>
            ×{streak}
          </Display>
        </View>
      </View>
    </View>
  );
}
