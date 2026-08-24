import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { SplashView } from "@/components/common/SplashView";
import { useAppStore } from "@/store/useAppStore";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [hasHydrated, setHasHydrated] = useState(() => useAppStore.persist.hasHydrated());

  useEffect(() => {
    if (hasHydrated) return;
    return useAppStore.persist.onFinishHydration(() => setHasHydrated(true));
  }, [hasHydrated]);

  // Hide the native OS splash (a small icon Android forces on us, no way around it) as soon as
  // JS is running, and hand off immediately to our own full-screen SplashView — which we fully
  // control — while the store finishes hydrating underneath it.
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  if (!hasHydrated) {
    return <SplashView />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="onboarding" options={{ presentation: "fullScreenModal" }} />
          <Stack.Screen name="settings/tip-jar" options={{ presentation: "modal", headerShown: true, title: "Tip Jar" }} />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
