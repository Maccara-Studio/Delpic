import { router } from "expo-router";
import { Alert, Pressable, StyleSheet, Switch, Text, View } from "react-native";

import { Screen } from "@/components/common/Screen";
import { useAppStore } from "@/store/useAppStore";

export default function SettingsScreen() {
  const resetSession = useAppStore((s) => s.resetSession);
  const clearTrash = useAppStore((s) => s.clearTrash);
  const autoplayVideos = useAppStore((s) => s.autoplayVideos);
  const muteByDefault = useAppStore((s) => s.muteByDefault);
  const updateSetting = useAppStore((s) => s.updateSetting);

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
      <View style={styles.section}>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.rowLabel}>Autoplay videos</Text>
            <Text style={styles.rowDescription}>Play videos automatically when they reach the top of the deck.</Text>
          </View>
          <Switch
            value={autoplayVideos}
            onValueChange={(value) => updateSetting("autoplayVideos", value)}
            accessibilityLabel="Autoplay videos"
          />
        </View>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.rowLabel}>Mute by default</Text>
            <Text style={styles.rowDescription}>Videos start muted; tap the speaker icon to unmute.</Text>
          </View>
          <Switch
            value={muteByDefault}
            onValueChange={(value) => updateSetting("muteByDefault", value)}
            accessibilityLabel="Mute by default"
          />
        </View>
      </View>

      <Pressable onPress={handleRestart} style={styles.button} accessibilityRole="button">
        <Text style={styles.buttonText}>Reset Review Progress</Text>
      </Pressable>
      <Pressable
        onPress={() => router.push("/onboarding")}
        style={styles.secondaryButton}
        accessibilityRole="button"
      >
        <Text style={styles.secondaryButtonText}>Replay Tutorial</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    width: "100%",
    paddingHorizontal: 20,
    gap: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    gap: 12,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: "600",
  },
  rowDescription: {
    fontSize: 12,
    color: "#6b7280",
  },
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
    marginTop: 12,
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
