import { StyleSheet, Text, View } from "react-native";

export function OnboardingWelcomePreview() {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🧹</Text>
      <Text style={styles.appName}>Delpic</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  emoji: {
    fontSize: 88,
  },
  appName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111",
  },
});
