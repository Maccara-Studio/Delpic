import { StyleSheet, Text, View } from "react-native";

export function ProgressBar({ reviewed, loaded }: { reviewed: number; loaded: number }) {
  const ratio = loaded > 0 ? Math.min(reviewed / loaded, 1) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${ratio * 100}%` }]} />
      </View>
      <Text style={styles.label}>{reviewed} reviewed</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    gap: 4,
  },
  track: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "#e5e5e5",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: "#3b82f6",
  },
  label: {
    fontSize: 12,
    color: "#666",
  },
});
