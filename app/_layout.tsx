import { useEffect } from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import {
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk';
import {
  NotoSansGeorgian_400Regular,
  NotoSansGeorgian_500Medium,
  NotoSansGeorgian_600SemiBold,
  NotoSansGeorgian_700Bold,
  NotoSansGeorgian_800ExtraBold,
} from '@expo-google-fonts/noto-sans-georgian';

import { useHydrated } from '../src/store/game';
import { color } from '../src/theme/tokens';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    BebasNeue_400Regular,
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
    // Both scripts are loaded up front rather than on demand: switching
    // language mid-session must not leave a screen in boxes while a face
    // downloads.
    NotoSansGeorgian_400Regular,
    NotoSansGeorgian_500Medium,
    NotoSansGeorgian_600SemiBold,
    NotoSansGeorgian_700Bold,
    NotoSansGeorgian_800ExtraBold,
  });

  // Reading the saved balance is fast, but not instant — without this the
  // arena paints the starting 1,248 and then snaps to the real figure.
  const hydrated = useHydrated();
  const ready = (fontsLoaded || fontError) && hydrated;

  useEffect(() => {
    // The whole design is font-driven; showing it in the system face first
    // would reflow every screen, so hold the splash until the faces land.
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: color.bgPaper }}>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: color.bgPaper },
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="quiz" options={{ animation: 'fade' }} />
            <Stack.Screen
              name="result"
              options={{ animation: 'fade', gestureEnabled: false }}
            />
          </Stack>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
