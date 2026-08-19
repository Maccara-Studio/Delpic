import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text } from "react-native";

import { AssetThumbnail } from "@/components/debug/AssetThumbnail";
import { Screen } from "@/components/common/Screen";
import { checkPermissions, fetchAssetsPage, requestPermissions } from "@/services/mediaLibrary";
import type { ReviewableAsset } from "@/types/media";

type LoadState = "loading" | "denied" | "ready" | "error";

export default function DeckScreen() {
  const [state, setState] = useState<LoadState>("loading");
  const [assets, setAssets] = useState<ReviewableAsset[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const existing = await checkPermissions();
      const permission = existing.granted ? existing : await requestPermissions();

      if (!permission.granted) {
        if (!cancelled) setState("denied");
        return;
      }

      try {
        const { assets: page } = await fetchAssetsPage({ offset: 0 });
        if (!cancelled) {
          setAssets(page);
          setState("ready");
        }
      } catch {
        if (!cancelled) setState("error");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (state === "loading") {
    return <Screen title="Deck" />;
  }

  if (state === "denied") {
    return <Screen title="Deck"><Text>Media library access denied.</Text></Screen>;
  }

  if (state === "error") {
    return <Screen title="Deck"><Text>Failed to load media.</Text></Screen>;
  }

  return (
    <FlatList
      data={assets}
      keyExtractor={(item) => item.id}
      numColumns={3}
      contentContainerStyle={styles.list}
      ListHeaderComponent={<Text style={styles.header}>Deck — {assets.length} recent items (debug)</Text>}
      renderItem={({ item }) => <AssetThumbnail asset={item} />}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 8,
    paddingTop: 48,
  },
  header: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
});
