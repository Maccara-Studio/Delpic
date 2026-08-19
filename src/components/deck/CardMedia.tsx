import { Image } from "expo-image";
import { MediaType } from "expo-media-library";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { resolvePlayableUri } from "@/services/mediaLibrary";
import type { ReviewableAsset } from "@/types/media";

import { VideoCardPlayer } from "./VideoCardPlayer";

function formatDuration(ms: number | null): string {
  if (!ms) return "0:00";
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

interface CardMediaProps {
  asset: ReviewableAsset;
  /** Only the active top-of-stack card gets a real, playing video player — buried/exiting cards get a static frame. */
  isActive: boolean;
}

export function CardMedia({ asset, isActive }: CardMediaProps) {
  const [uri, setUri] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    resolvePlayableUri(asset.id).then((resolved) => {
      if (!cancelled) setUri(resolved);
    });
    return () => {
      cancelled = true;
    };
  }, [asset.id]);

  if (asset.mediaType === MediaType.VIDEO) {
    if (isActive && uri) {
      return <VideoCardPlayer uri={uri} />;
    }
    return (
      <View style={[styles.media, styles.videoPlaceholder]}>
        <Text style={styles.playIcon}>▶</Text>
        <Text style={styles.duration}>{formatDuration(asset.duration)}</Text>
      </View>
    );
  }

  if (!uri) {
    return <View style={[styles.media, styles.imagePlaceholder]} />;
  }

  return <Image source={{ uri }} style={styles.media} contentFit="cover" />;
}

const styles = StyleSheet.create({
  media: {
    flex: 1,
    borderRadius: 16,
  },
  imagePlaceholder: {
    backgroundColor: "#e5e5e5",
  },
  videoPlaceholder: {
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  playIcon: {
    fontSize: 40,
    color: "#ffffff",
  },
  duration: {
    color: "#ffffff",
    fontSize: 14,
  },
});
