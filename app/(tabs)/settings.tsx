import { router } from "expo-router";
import { Alert, Pressable, StyleSheet, Text } from "react-native";

import { Screen } from "@/components/common/Screen";
import { useAppStore } from "@/store/useAppStore";

export default function SettingsScreen() {
  const resetSession = useAppStore((s) => s.resetSession);
  const clearTrash = useAppStore((s) => s.clearTrash);

  const handleRestart = () => {
    Alert.alert(
      "Restart from beginning?",
      "This resets your progress back to the most recent photo and clears anything staged for deletion (nothing already deleted from your device is affected).",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Restart",
          style: "destructive",
          onPress: () => {
            resetSession();
            clearTrash();
          },
        },
      ],
    );
  };

  return (
    <Screen title="Settings">
      <Pressable onPress={handleRestart} style={styles.button}>
        <Text style={styles.buttonText}>Reset Review Progress</Text>
      </Pressable>
      <Pressable onPress={() => router.push("/onboarding")} style={styles.secondaryButton}>
        <Text style={styles.secondaryButtonText}>Replay Tutorial</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#ef4444",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#f3f4f6",
  },
  secondaryButtonText: {
    color: "#111",
    fontWeight: "600",
  },
});
