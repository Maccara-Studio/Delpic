import { useCallback, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from "react-native-reanimated";

import { MOCK_ONBOARDING_CARDS, type MockOnboardingCard } from "@/data/mockOnboardingAssets";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";

function cardAt(cursor: number): MockOnboardingCard {
  return MOCK_ONBOARDING_CARDS[cursor % MOCK_ONBOARDING_CARDS.length]!;
}

interface MockCardProps {
  card: MockOnboardingCard;
  interactive: boolean;
  onSwipeComplete?: () => void;
  onExitAnimationFinished?: () => void;
}

function MockCard({ card, interactive, onSwipeComplete, onExitAnimationFinished }: MockCardProps) {
  const { gesture, translateX, translateY } = useSwipeGesture({
    enabled: interactive,
    onSwipeComplete: () => onSwipeComplete?.(),
    onExitAnimationFinished,
  });

  const cardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(translateX.value, [-300, 0, 300], [-12, 0, 12], Extrapolation.CLAMP);
    return {
      transform: [{ translateX: translateX.value }, { translateY: translateY.value }, { rotate: `${rotate}deg` }],
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.card, { backgroundColor: card.color }, cardStyle]}>
        <Text style={styles.emoji}>{card.emoji}</Text>
        <Text style={styles.caption}>{card.caption}</Text>
      </Animated.View>
    </GestureDetector>
  );
}

// Mirrors SwipeDeck's real pattern: the cursor (which card is on top) advances immediately on
// swipe release, and the swiped-away card keeps rendering — same component instance, own entry
// in a flat keyed list — until its own fly-off spring finishes, instead of gating the next card
// on that animation. A version that waited for onExitAnimationFinished before advancing felt
// noticeably laggy by comparison.
export function OnboardingDeckPreview() {
  const cursorRef = useRef(0);
  const [cursor, setCursor] = useState(0);
  const [exitingCursors, setExitingCursors] = useState<number[]>([]);

  const handleSwipeComplete = useCallback(() => {
    const current = cursorRef.current;
    cursorRef.current = current + 1;
    setCursor(current + 1);
    setExitingCursors((prev) => [...prev, current]);
  }, []);

  const handleExitAnimationFinished = useCallback((exitedCursor: number) => {
    setExitingCursors((prev) => prev.filter((c) => c !== exitedCursor));
  }, []);

  // Every entry is keyed by its cursor number alone (never role-prefixed) so a card keeps the
  // same component instance — and in-flight shared values — as it moves from "top" to
  // "exiting", the same trick SwipeDeck uses. Buried is listed before top so top paints over it.
  const entries = [
    { cursorValue: cursor + 1, interactive: false },
    { cursorValue: cursor, interactive: true },
    ...exitingCursors.filter((c) => c !== cursor).map((c) => ({ cursorValue: c, interactive: false })),
  ];

  return (
    <View style={styles.container}>
      {entries.map(({ cursorValue, interactive }) => (
        <MockCard
          key={cursorValue}
          card={cardAt(cursorValue)}
          interactive={interactive}
          onSwipeComplete={interactive ? handleSwipeComplete : undefined}
          onExitAnimationFinished={() => handleExitAnimationFinished(cursorValue)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 48,
    marginVertical: 16,
  },
  card: {
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  emoji: {
    fontSize: 56,
  },
  caption: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
