import { useCallback, useState } from "react";
import { Alert, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { TrashActionBar } from "@/components/trash/TrashActionBar";
import { TrashGrid } from "@/components/trash/TrashGrid";
import { deleteAssetsBatch } from "@/services/mediaLibrary";
import { useAppStore } from "@/store/useAppStore";

const ACTION_BAR_INSET = 82;

export default function TrashScreen() {
  const stagedAssets = useAppStore((s) => s.stagedAssets);
  const removeFromTrash = useAppStore((s) => s.removeFromTrash);
  const clearTrash = useAppStore((s) => s.clearTrash);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = useCallback(() => {
    const assetsToDelete = useAppStore.getState().stagedAssets;
    Alert.alert(
      "Delete permanently?",
      `This will permanently delete ${assetsToDelete.length} item(s) from your device. This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setIsDeleting(true);
            try {
              await deleteAssetsBatch(assetsToDelete.map((asset) => asset.id));
              clearTrash();
            } catch {
              // The user cancelled the native confirmation, or the OS refused — leave the queue untouched.
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ],
    );
  }, [clearTrash]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <Text style={styles.title}>Trash</Text>
      <TrashGrid
        assets={stagedAssets}
        onRestore={removeFromTrash}
        bottomInset={stagedAssets.length > 0 ? ACTION_BAR_INSET : 0}
      />
      <TrashActionBar count={stagedAssets.length} isDeleting={isDeleting} onDelete={handleDelete} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginVertical: 12,
  },
});
