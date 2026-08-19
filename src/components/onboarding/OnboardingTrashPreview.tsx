import { StyleSheet, Text, View } from "react-native";

const MOCK_TILES = ["#38bdf8", "#f97316", "#a855f7", "#22c55e"];

export function OnboardingTrashPreview() {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {MOCK_TILES.map((color, i) => (
          <View key={i} style={[styles.tile, { backgroundColor: color }]} />
        ))}
      </View>
      <View style={styles.actionBar}>
        <Text style={styles.actionBarText}>Delete 4 items</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    gap: 24,
    paddingHorizontal: 48,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
  },
  tile: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },
  actionBar: {
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ef4444",
  },
  actionBarText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});
