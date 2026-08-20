import { useCallback, useMemo, useRef } from "react";
import { Dimensions } from "react-native";
import { Gesture } from "react-native-gesture-handler";
import { runOnJS, useSharedValue, withSpring } from "react-native-reanimated";

import { SNAP_BACK_SPRING_CONFIG, SWIPE_SPRING_CONFIG } from "@/lib/animatedConfig";
import { SWIPE_DISTANCE_RATIO, SWIPE_VELOCITY_THRESHOLD } from "@/lib/constants";
import type { SwipeDirection } from "@/store/slices/sessionSlice";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * SWIPE_DISTANCE_RATIO;

interface UseSwipeGestureParams {
  enabled: boolean;
  onSwipeComplete: (direction: SwipeDirection) => void;
  onExitAnimationFinished?: () => void;
}

export function useSwipeGesture({ enabled, onSwipeComplete, onExitAnimationFinished }: UseSwipeGestureParams) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // Gesture Handler recommends memoizing the gesture object — recreating it on every render
  // (as this component's props naturally do, since callbacks close over per-card data) can
  // make the native recognizer briefly unresponsive, which under rapid consecutive swipes
  // showed up as both a forced delay before the next swipe registered and, occasionally, the
  // same swipe being reported twice. Callbacks are read through refs so the memoized gesture
  // never goes stale without needing `enabled` (its one real dependency) to change.
  const onSwipeCompleteRef = useRef(onSwipeComplete);
  onSwipeCompleteRef.current = onSwipeComplete;
  const onExitAnimationFinishedRef = useRef(onExitAnimationFinished);
  onExitAnimationFinishedRef.current = onExitAnimationFinished;

  const handleSwipeComplete = useCallback((direction: SwipeDirection) => {
    onSwipeCompleteRef.current(direction);
  }, []);

  const handleExitAnimationFinished = useCallback(() => {
    onExitAnimationFinishedRef.current?.();
  }, []);

  // `enabled` is applied imperatively below instead of through this memo's deps. `.enabled()`
  // mutates and returns the same gesture instance (builder pattern), so toggling it in place
  // keeps GestureDetector attached to one stable native handler. Rebuilding the whole Gesture.Pan
  // (as putting `enabled` in the deps here used to do) forces a detach/reattach of the native
  // recognizer on every toggle — under rapid undo taps, stackPosition flips interactive on/off
  // several times within milliseconds, and that churn was enough to wedge the native gesture
  // handler entirely (cards frozen, no crash, since the JS/state side kept working fine).
  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .onUpdate((event) => {
          "worklet";
          translateX.value = event.translationX;
          translateY.value = event.translationY * 0.3;
        })
        .onEnd((event) => {
          "worklet";
          const isFling = Math.abs(event.velocityX) > SWIPE_VELOCITY_THRESHOLD;
          const passedThreshold = Math.abs(event.translationX) > SWIPE_THRESHOLD;

          if (isFling || passedThreshold) {
            const direction: SwipeDirection = event.translationX > 0 ? "right" : "left";
            const targetX = direction === "right" ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5;
            // Advance the data model immediately — the next card must become interactive
            // right away so rapid consecutive swipes aren't throttled by animation duration.
            // The spring below plays out independently on the way out; its "finished"
            // callback only drives cleanup (unmounting the departed card), never gating.
            translateX.value = withSpring(targetX, SWIPE_SPRING_CONFIG, (finished) => {
              if (finished) {
                runOnJS(handleExitAnimationFinished)();
              }
            });
            runOnJS(handleSwipeComplete)(direction);
          } else {
            translateX.value = withSpring(0, SNAP_BACK_SPRING_CONFIG);
            translateY.value = withSpring(0, SNAP_BACK_SPRING_CONFIG);
          }
        }),
    [handleSwipeComplete, handleExitAnimationFinished, translateX, translateY],
  );
  gesture.enabled(enabled);

  return { gesture, translateX, translateY };
}
