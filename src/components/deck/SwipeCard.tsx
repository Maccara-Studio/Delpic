import { Pressable, StyleSheet, Text } from "react-native";

import type { ReviewableAsset } from "@/types/media";

import { CardMedia } from "./CardMedia";

const STACK_OFFSET_Y = 10;
const STACK_SCALE_STEP = 0.05;

export interface SwipeCardProps {
  asset: ReviewableAsset;
  stackPosition: number;
  onPress?: () => void;
}

export function SwipeCard({ asset, stackPosition, onPress }: SwipeCardProps) {
  const scale = 1 - stackPosition * STACK_SCALE_STEP;
  const translateY = stackPosition * STACK_OFFSET_Y;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={[
        StyleSheet.absoluteFill,
        styles.card,
        {
          transform: [{ translateY }, { scale }],
          zIndex: -stackPosition,
        },
      ]}
    >
      <CardMedia asset={asset} />
      {stackPosition === 0 ? (
        <Text style={styles.debugHint}>Tap to advance (debug — swipe gestures land in Milestone 4)</Text>
      ) : null}
    </Pressable>
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
  debugHint: {
    position: "absolute",
    bottom: 8,
    alignSelf: "center",
    color: "#fff",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 11,
  },
});
