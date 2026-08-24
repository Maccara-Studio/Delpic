import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";

// Shown while the store is hydrating, right after the OS's own unavoidable native splash
// (a small centered icon — Android 12+ doesn't allow a custom full-screen native splash).
// Matching backgroundColor between the two keeps the handoff from being a jarring flash.
export function SplashView() {
  return (
    <LinearGradient
      colors={["#FC9E3F", "#DE6461", "#9636BB"]}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <View style={styles.textBlock}>
        <Text style={styles.title}>Delpic</Text>
        <Text style={styles.tagline}>A new easy way to delete your pictures</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  textBlock: {
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 44,
    fontWeight: "600",
    color: "#ffffff",
  },
  tagline: {
    fontSize: 16,
    color: "#ffffff",
    opacity: 0.92,
    textAlign: "center",
  },
});
