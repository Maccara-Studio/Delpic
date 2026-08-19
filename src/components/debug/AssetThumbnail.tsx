import { Image } from "expo-image";
import { MediaType } from "expo-media-library";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { resolvePlayableUri } from "@/services/mediaLibrary";
import type { ReviewableAsset } from "@/types/media";

export function AssetThumbnail({ asset }: { asset: ReviewableAsset }) {
  const [uri, setUri] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    resolvePlayableUri(asset.id).then((resolved) => {
      if (!cancelled) {
        setUri(resolved);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [asset.id]);

  return (
    <View style={styles.container}>
      {uri ? (
        <Image source={{ uri }} style={styles.image} contentFit="cover" />
      ) : (
        <View style={[styles.image, styles.placeholder]} />
      )}
      <Text style={styles.label} numberOfLines={1}>
        {asset.mediaType === MediaType.VIDEO ? "🎥" : "🖼️"} {asset.filename ?? asset.id}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "33%",
    padding: 2,
  },
  image: {
    aspectRatio: 1,
    borderRadius: 4,
    backgroundColor: "#e5e5e5",
  },
  placeholder: {
    backgroundColor: "#d0d0d0",
  },
  label: {
    fontSize: 10,
    marginTop: 2,
  },
});
