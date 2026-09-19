import { Pressable, View } from 'react-native';

import { tapped } from '../lib/feedback';
import { border, color } from '../theme/tokens';
import { UI } from '../theme/type';

/**
 * The house segmented control: a hard-bordered row where the chosen segment
 * fills with ink.
 *
 * It had been written out three times — store/activity in the wallet, and
 * language and vibration in the profile — each about thirty lines differing
 * only in height, label size and the colour of the active text. Each copy also
 * had to remember its own accessibility state, and none of them gave the
 * haptic tap that every other control in the app does.
 */

export interface Segment<T> {
  value: T;
  label: string;
}

export function Segmented<T>({
  options,
  selected,
  onChange,
  height = 46,
  size = 14,
  activeColor = color.gold,
}: {
  options: Segment<T>[];
  selected: T;
  onChange: (value: T) => void;
  height?: number;
  size?: number;
  /** Colour of the chosen segment's label against the ink fill. */
  activeColor?: string;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        borderWidth: border.medium,
        borderColor: color.lineStrong,
        backgroundColor: color.surface,
        overflow: 'hidden',
      }}
    >
      {options.map((option) => {
        const active = option.value === selected;
        return (
          <Pressable
            key={String(option.value)}
            accessibilityRole="button"
            accessibilityLabel={option.label}
            accessibilityState={{ selected: active }}
            onPress={() => {
              if (active) return;
              tapped();
              onChange(option.value);
            }}
            style={{
              flex: 1,
              height,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: active ? color.ink : 'transparent',
            }}
          >
            <UI size={size} weight="bold" color={active ? activeColor : color.ink}>
              {option.label}
            </UI>
          </Pressable>
        );
      })}
    </View>
  );
}
