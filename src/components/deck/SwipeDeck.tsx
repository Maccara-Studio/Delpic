import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useCardStack } from "@/hooks/useCardStack";

import { SwipeCard } from "./SwipeCard";

export function SwipeDeck() {
  const { visibleAssets, isLoading, isEmpty, isDeckFinished, canGoBack, advance, goBack } = useCardStack();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Text>Loading your photos…</Text>
      </View>
    );
  }

  if (isEmpty) {
    return (
      <View style={styles.center}>
        <Text>No photos or videos found.</Text>
      </View>
    );
  }

  if (isDeckFinished) {
    return (
      <View style={styles.center}>
        <Text>You&apos;ve reviewed everything! 🎉</Text>
      </View>
    );
  }

  const stacked = visibleAssets
    .map((asset, stackPosition) => ({ asset, stackPosition }))
    .reverse();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        {canGoBack ? (
          <Pressable onPress={goBack} style={styles.backButton} hitSlop={12}>
            <Text style={styles.backButtonText}>←</Text>
          </Pressable>
        ) : null}
      </View>
      <View style={styles.deckContainer}>
        {stacked.map(({ asset, stackPosition }) => (
          <SwipeCard
            key={asset.id}
            asset={asset}
            stackPosition={stackPosition}
            onPress={stackPosition === 0 ? advance : undefined}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    height: 52,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  deckContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 20,
  },
});
