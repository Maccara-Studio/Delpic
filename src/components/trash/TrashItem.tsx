import { Image } from "expo-image";
import { MediaType } from "expo-media-library";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { resolvePlayableUri } from "@/services/mediaLibrary";
import type { StagedAsset } from "@/store/slices/trashSlice";

interface TrashItemProps {
  asset: StagedAsset;
  onRestore: (assetId: string) => void;
}

export function TrashItem({ asset, onRestore }: TrashItemProps) {
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

  return (
    <View style={styles.tile}>
      {uri ? (
        <Image source={{ uri }} style={styles.thumbnail} contentFit="cover" />
      ) : (
        <View style={[styles.thumbnail, styles.placeholder]} />
      )}
      {asset.mediaType === MediaType.VIDEO && <Text style={styles.videoBadge}>▶</Text>}
      <Pressable onPress={() => onRestore(asset.id)} style={styles.restoreButton} hitSlop={8}>
        <Text style={styles.restoreIcon}>↺</Text>
      </Pressable>
    </View>
  );
}

const TILE_SIZE = 110;

const styles = StyleSheet.create({
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#e5e5e5",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    backgroundColor: "#e5e5e5",
  },
  videoBadge: {
    position: "absolute",
    left: 6,
    bottom: 6,
    color: "#fff",
    fontSize: 14,
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowRadius: 3,
  },
  restoreButton: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  restoreIcon: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
});
