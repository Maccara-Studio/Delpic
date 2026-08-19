import { Redirect } from "expo-router";

import { useAppStore } from "@/store/useAppStore";

export default function Index() {
  const hasCompletedOnboarding = useAppStore((s) => s.hasCompletedOnboarding);
  return <Redirect href={hasCompletedOnboarding ? "/(tabs)/deck" : "/onboarding"} />;
}
