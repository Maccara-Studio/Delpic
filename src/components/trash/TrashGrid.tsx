import { FlatList, StyleSheet, Text, View } from "react-native";

import type { StagedAsset } from "@/store/slices/trashSlice";

import { TrashItem } from "./TrashItem";

const NUM_COLUMNS = 3;

interface TrashGridProps {
  assets: StagedAsset[];
  onRestore: (assetId: string) => void;
  /** Extra bottom padding so the last row isn't hidden behind the floating action bar. */
  bottomInset: number;
}

export function TrashGrid({ assets, onRestore, bottomInset }: TrashGridProps) {
  if (assets.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Nothing staged for deletion.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={assets}
      numColumns={NUM_COLUMNS}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <TrashItem asset={item} onRestore={onRestore} />}
      contentContainerStyle={[styles.grid, { paddingBottom: bottomInset }]}
      columnWrapperStyle={styles.row}
    />
  );
}

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: "#888",
    fontSize: 15,
  },
  grid: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 10,
  },
  row: {
    gap: 10,
  },
});
