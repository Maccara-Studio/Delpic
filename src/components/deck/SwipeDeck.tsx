import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useCardStack } from "@/hooks/useCardStack";
import type { SwipeDirection } from "@/store/slices/sessionSlice";
import { useAppStore } from "@/store/useAppStore";
import type { ReviewableAsset } from "@/types/media";

import { ProgressBar } from "./ProgressBar";
import { SwipeCard } from "./SwipeCard";

interface DeckEntry {
  asset: ReviewableAsset;
  stackPosition: number;
  interactive: boolean;
}

export function SwipeDeck() {
  const {
    visibleAssets,
    isLoading,
    isEmpty,
    isDeckFinished,
    hasLoadError,
    retryLoad,
    reviewedCount,
    loadedCount,
    canUndo,
    completeSwipe,
    undo,
  } = useCardStack();
  const stagedCount = useAppStore((s) => s.stagedAssets.length);

  // Cards that have already been swiped (and thus dropped out of `visibleAssets`) but are
  // still visually flying off screen. Kept mounted here — same component instance, same key,
  // merged into a single list with the active stack below — so their exit animation can
  // finish independently without blocking the next card from becoming interactive right away.
  const [exitingAssets, setExitingAssets] = useState<ReviewableAsset[]>([]);

  const handleSwipeComplete = useCallback(
    (asset: ReviewableAsset, direction: SwipeDirection) => {
      completeSwipe(asset, direction);
      setExitingAssets((prev) => (prev.some((a) => a.id === asset.id) ? prev : [...prev, asset]));
    },
    [completeSwipe],
  );

  const handleExitAnimationFinished = useCallback((assetId: string) => {
    setExitingAssets((prev) => prev.filter((a) => a.id !== assetId));
  }, []);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Text>Loading your photos…</Text>
      </View>
    );
  }

  if (hasLoadError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Couldn&apos;t load your photos. Check your connection and try again.</Text>
        <Pressable onPress={retryLoad} style={styles.retryButton} accessibilityRole="button">
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  if (isEmpty) {
    return (
      <View style={styles.center}>
        <Ionicons name="images-outline" size={48} color="#9ca3af" />
        <Text style={styles.stateTitle}>No photos or videos found</Text>
        <Text style={styles.stateSubtitle}>Your camera roll appears to be empty.</Text>
      </View>
    );
  }

  if (isDeckFinished && exitingAssets.length === 0) {
    return (
      <View style={styles.center}>
        <Ionicons name="checkmark-circle" size={48} color="#22c55e" />
        <Text style={styles.stateTitle}>You&apos;ve reviewed everything!</Text>
        {stagedCount > 0 && (
          <Pressable
            onPress={() => router.push("/(tabs)/trash")}
            style={styles.retryButton}
            accessibilityRole="button"
          >
            <Text style={styles.retryButtonText}>Review Trash ({stagedCount})</Text>
          </Pressable>
        )}
      </View>
    );
  }

  // A single flat, keyed list — stack entries (buried-to-top, so the top card paints last/on
  // top) followed by exiting entries (painted above everything via zIndex). One list means one
  // unambiguous key-based reconciliation, so a card moving from "top of stack" to "exiting"
  // between renders keeps its component instance (and in-flight animation) instead of remounting.
  const stackEntries: DeckEntry[] = [...visibleAssets]
    .map((asset, stackPosition) => ({ asset, stackPosition, interactive: stackPosition === 0 }))
    .reverse();
  // Guard against an asset appearing in both groups at once (e.g. undo bringing a card back
  // into the visible stack before its own exit animation had a chance to finish and clean up).
  const visibleAssetIds = new Set(visibleAssets.map((a) => a.id));
  const exitingEntries: DeckEntry[] = exitingAssets
    .filter((asset) => !visibleAssetIds.has(asset.id))
    .map((asset) => ({ asset, stackPosition: -1, interactive: false }));
  const entries = [...stackEntries, ...exitingEntries];

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        {canUndo ? (
          <Pressable
            onPress={undo}
            style={styles.backButton}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Undo last swipe"
          >
            <Ionicons name="arrow-undo" size={20} color="#fff" />
          </Pressable>
        ) : (
          <View style={styles.backButtonPlaceholder} />
        )}
        <ProgressBar reviewed={reviewedCount} loaded={loadedCount} />
      </View>
      <View style={styles.deckContainer}>
        {entries.map(({ asset, stackPosition, interactive }) => (
          <SwipeCard
            key={asset.id}
            asset={asset}
            stackPosition={stackPosition}
            interactive={interactive}
            onSwipeComplete={interactive ? (direction) => handleSwipeComplete(asset, direction) : undefined}
            onExitAnimationFinished={() => handleExitAnimationFinished(asset.id)}
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
    gap: 12,
    paddingHorizontal: 32,
  },
  errorText: {
    textAlign: "center",
    color: "#6b7280",
  },
  stateTitle: {
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
  },
  stateSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
    backgroundColor: "#111",
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  header: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
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
  backButtonPlaceholder: {
    width: 40,
    height: 40,
  },
});
