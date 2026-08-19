import { StyleSheet } from "react-native";
import Animated, { Extrapolation, interpolate, useAnimatedStyle, type SharedValue } from "react-native-reanimated";

const OVERLAY_MAX_TRANSLATE = 120;
const BORDER_WIDTH = 8;

export function CardOverlay({ translateX }: { translateX: SharedValue<number> }) {
  const keepBorderStyle = useAnimatedStyle(() => {
    const opacity = interpolate(translateX.value, [0, OVERLAY_MAX_TRANSLATE], [0, 1], Extrapolation.CLAMP);
    return { opacity };
  });

  const trashBorderStyle = useAnimatedStyle(() => {
    const opacity = interpolate(translateX.value, [-OVERLAY_MAX_TRANSLATE, 0], [1, 0], Extrapolation.CLAMP);
    return { opacity };
  });

  return (
    <>
      <Animated.View
        style={[StyleSheet.absoluteFill, styles.border, styles.keepBorder, keepBorderStyle]}
        pointerEvents="none"
      />
      <Animated.View
        style={[StyleSheet.absoluteFill, styles.border, styles.trashBorder, trashBorderStyle]}
        pointerEvents="none"
      />
    </>
  );
}

const styles = StyleSheet.create({
  border: {
    borderRadius: 16,
    borderWidth: BORDER_WIDTH,
  },
  keepBorder: {
    borderColor: "#22c55e",
  },
  trashBorder: {
    borderColor: "#ef4444",
  },
});
