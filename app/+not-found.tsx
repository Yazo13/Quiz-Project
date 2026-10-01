import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrokenCompassMark } from '../src/components/EndStateMark';
import { MeshBackground } from '../src/components/MeshBackground';
import { Tactile, TactileLabel } from '../src/components/Tactile';
import { useT } from '../src/i18n';
import { color, radius, screenPad } from '../src/theme/tokens';
import { Display, Eyebrow, UI } from '../src/theme/type';

/**
 * A route that does not exist.
 *
 * expo-router has its own fallback, and it is a bare "Unmatched Route" page in
 * the system font with a link back — fine in development, and the only thing
 * standing behind a mistyped URL on the web build or a bad `gargariquiz://`
 * link on a phone. The app already has a styled screen for a crash; this is
 * the same courtesy for a wrong address.
 */
export default function NotFoundScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const t = useT();

  return (
    <View style={{ flex: 1, backgroundColor: color.bgPaper }}>
      <MeshBackground dim />

      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: screenPad,
          paddingTop: insets.top + 24,
          paddingBottom: Math.max(insets.bottom, 12) + 24,
        }}
      >
        <BrokenCompassMark />

        <Eyebrow size={12} color={color.ink3} style={{ marginTop: 18, marginBottom: 6 }}>
          {t.notFound.eyebrow}
        </Eyebrow>
        <Display size={52} style={{ textAlign: 'center' }}>
          {t.notFound.title}
        </Display>
        <UI
          size={13}
          color={color.ink3}
          style={{ textAlign: 'center', marginTop: 10, marginBottom: 24 }}
        >
          {t.notFound.body}
        </UI>

        <View style={{ width: '100%' }}>
          <Tactile
            variant="forest"
            height={56}
            radius={radius.sharp}
            onPress={() => router.replace('/')}
          >
            <TactileLabel color={color.white}>{t.notFound.back}</TactileLabel>
          </Tactile>
        </View>
      </View>
    </View>
  );
}
