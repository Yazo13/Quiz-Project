import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useT } from '../i18n';
import { border, color, radius, screenPad } from '../theme/tokens';
import { Display, Eyebrow, UI } from '../theme/type';
import { BrokenCompassMark } from './EndStateMark';
import { MeshBackground } from './MeshBackground';
import { Tactile, TactileLabel, TactileSurface } from './Tactile';

/**
 * What the player sees when a screen throws.
 *
 * expo-router renders its own red diagnostic in development and a blank white
 * screen in production, which tells the player nothing and offers them nothing
 * to do. This keeps them inside the app: the broken compass the defeat screen
 * already uses, and a button that remounts the route.
 *
 * The message stays in the app's own language, but the error text itself is
 * shown verbatim — it is for whoever is reading a bug report, and translating
 * or paraphrasing it would only make that harder.
 */
export function CrashScreen({ error, retry }: { error: Error; retry: () => void }) {
  const t = useT();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: color.bgPaper }}>
      <MeshBackground dim />

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: screenPad,
          paddingTop: insets.top + 24,
          paddingBottom: Math.max(insets.bottom, 12) + 24,
        }}
      >
        <BrokenCompassMark />

        <Eyebrow size={12} color={color.ink3} style={{ marginTop: 18, marginBottom: 6 }}>
          {t.crash.eyebrow}
        </Eyebrow>
        <Display size={52} style={{ textAlign: 'center' }}>
          {t.crash.title}
        </Display>
        <UI
          size={13}
          color={color.ink3}
          style={{ textAlign: 'center', marginTop: 10, marginBottom: 20 }}
        >
          {t.crash.body}
        </UI>

        <View style={{ width: '100%', marginBottom: 20 }}>
          <TactileSurface radius={radius.sharp} background={color.surface2}>
            <View style={{ padding: 14 }}>
              <Eyebrow size={9} style={{ marginBottom: 6 }}>
                {t.crash.details}
              </Eyebrow>
              <UI
                size={12}
                color={color.ink2}
                // Long stack-ish strings would otherwise push the card wide.
                style={{ borderLeftWidth: border.thin, borderLeftColor: color.line, paddingLeft: 10 }}
              >
                {error?.message || String(error)}
              </UI>
            </View>
          </TactileSurface>
        </View>

        <View style={{ width: '100%' }}>
          <Tactile variant="forest" height={56} radius={radius.sharp} onPress={retry}>
            <TactileLabel color={color.white}>{t.crash.retry}</TactileLabel>
          </Tactile>
        </View>
      </ScrollView>
    </View>
  );
}
