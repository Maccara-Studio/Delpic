import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { OnboardingDeckPreview } from "@/components/onboarding/OnboardingDeckPreview";
import { OnboardingStepBubble } from "@/components/onboarding/OnboardingStepBubble";
import { OnboardingTrashPreview } from "@/components/onboarding/OnboardingTrashPreview";
import { OnboardingWelcomePreview } from "@/components/onboarding/OnboardingWelcomePreview";
import { useTranslations } from "@/i18n";
import { useAppStore } from "@/store/useAppStore";

const STEP_IDS = ["welcome", "deck", "trash"] as const;
type StepId = (typeof STEP_IDS)[number];

const STEP_PREVIEWS: Record<StepId, React.ComponentType> = {
  welcome: OnboardingWelcomePreview,
  deck: OnboardingDeckPreview,
  trash: OnboardingTrashPreview,
};

export default function OnboardingScreen() {
  const t = useTranslations().onboarding;
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const [stepIndex, setStepIndex] = useState(0);

  const stepId = STEP_IDS[stepIndex]!;
  const isLastStep = stepIndex === STEP_IDS.length - 1;
  const StepPreview = STEP_PREVIEWS[stepId];
  const stepCopy = t[stepId];

  const finish = () => {
    completeOnboarding();
    router.replace("/(tabs)/deck");
  };

  const handleNext = () => {
    if (isLastStep) {
      finish();
    } else {
      setStepIndex((i) => i + 1);
    }
  };

  const handleBack = () => setStepIndex((i) => Math.max(0, i - 1));

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right", "bottom"]}>
      <Pressable onPress={finish} style={styles.skipButton} hitSlop={12}>
        <Text style={styles.skipText}>{t.skip}</Text>
      </Pressable>

      <View style={styles.previewArea}>
        <StepPreview />
      </View>

      <View style={styles.dots}>
        {STEP_IDS.map((id) => (
          <View key={id} style={[styles.dot, id === stepId && styles.dotActive]} />
        ))}
      </View>

      <View style={styles.bubbleArea}>
        <OnboardingStepBubble title={stepCopy.title} body={stepCopy.body} />
      </View>

      <View style={styles.footer}>
        {stepIndex > 0 ? (
          <Pressable onPress={handleBack} style={styles.secondaryButton} hitSlop={8}>
            <Text style={styles.secondaryButtonText}>{t.back}</Text>
          </Pressable>
        ) : (
          <View style={styles.secondaryButtonPlaceholder} />
        )}
        <Pressable onPress={handleNext} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>{isLastStep ? t.getStarted : t.next}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  skipButton: {
    alignSelf: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  skipText: {
    color: "#888",
    fontSize: 15,
    fontWeight: "600",
  },
  previewArea: {
    flex: 1,
  },
  dots: {
    flexDirection: "row",
    alignSelf: "center",
    gap: 8,
    marginBottom: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ddd",
  },
  dotActive: {
    backgroundColor: "#111",
  },
  bubbleArea: {
    paddingHorizontal: 20,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  primaryButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    paddingHorizontal: 16,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonPlaceholder: {
    width: 16,
  },
  secondaryButtonText: {
    color: "#111",
    fontSize: 15,
    fontWeight: "600",
  },
});
