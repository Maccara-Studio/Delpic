import { useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from "react-native-reanimated";

import { useSwipeGesture } from "@/hooks/useSwipeGesture";
import type { SwipeDirection } from "@/store/slices/sessionSlice";
import type { ReviewableAsset } from "@/types/media";

import { CardMedia } from "./CardMedia";
import { CardOverlay } from "./CardOverlay";

const ROTATION_RANGE_DEG = 12;
const ROTATION_INPUT_RANGE = 300;

export interface SwipeCardProps {
  asset: ReviewableAsset;
  /** 0 = top of stack, 1/2 = buried, -1 = already swiped, animating out. */
  stackPosition: number;
  interactive: boolean;
  onSwipeComplete?: (direction: SwipeDirection) => void;
  onExitAnimationFinished?: () => void;
}

export function SwipeCard({ asset, stackPosition, interactive, onSwipeComplete, onExitAnimationFinished }: SwipeCardProps) {
  const { gesture, translateX, translateY } = useSwipeGesture({
    enabled: interactive,
    onSwipeComplete: (direction) => onSwipeComplete?.(direction),
    onExitAnimationFinished,
  });

  // Same asset.id means the same component instance is reused across renders (intentional —
  // it's what lets an exiting card's fly-off animation continue seamlessly). But if a card
  // that was mid-exit gets pulled back into the stack (undo right after swiping, or a session
  // reset/restart) before that exit animation finished, its shared values are still wherever
  // the fly-off left them — e.g. far off-screen — instead of centered. Snap back to center
  // only on that specific transition (exiting -> back in the stack), never when actually
  // leaving the stack, so the real exit animation is untouched.
  //
  // Interrupting the in-flight spring this way means it never reaches "finished", so its own
  // withSpring callback never calls onExitAnimationFinished — call it here instead. Without
  // this, rescued cards stay stuck in SwipeDeck's exitingAssets forever; undoing far enough
  // that the same card falls back out of the visible window makes it reappear as a stale,
  // centered, non-interactive ghost stacked above the real top card, blocking every swipe.
  const prevStackPositionRef = useRef(stackPosition);
  useEffect(() => {
    const wasExiting = prevStackPositionRef.current === -1;
    prevStackPositionRef.current = stackPosition;
    if (wasExiting && stackPosition !== -1) {
      translateX.value = 0;
      translateY.value = 0;
      onExitAnimationFinished?.();
    }
  }, [stackPosition, translateX, translateY, onExitAnimationFinished]);

  const cardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-ROTATION_INPUT_RANGE, 0, ROTATION_INPUT_RANGE],
      [-ROTATION_RANGE_DEG, 0, ROTATION_RANGE_DEG],
      Extrapolation.CLAMP,
    );
    return {
      transform: [{ translateX: translateX.value }, { translateY: translateY.value }, { rotate: `${rotate}deg` }],
      zIndex: -stackPosition,
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.card, cardStyle]}>
        <CardMedia asset={asset} isActive={stackPosition === 0} />
        <CardOverlay translateX={translateX} />
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
});
