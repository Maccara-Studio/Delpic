import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

interface TrashActionBarProps {
  count: number;
  isDeleting: boolean;
  onDelete: () => void;
}

export function TrashActionBar({ count, isDeleting, onDelete }: TrashActionBarProps) {
  if (count === 0) return null;

  return (
    <Pressable
      onPress={onDelete}
      disabled={isDeleting}
      style={[styles.bar, isDeleting && styles.barDisabled]}
      accessibilityRole="button"
      accessibilityLabel={isDeleting ? "Deleting…" : `Delete ${count} item${count === 1 ? "" : "s"}`}
      accessibilityState={{ disabled: isDeleting, busy: isDeleting }}
    >
      {isDeleting ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.text}>
          Delete {count} item{count === 1 ? "" : "s"}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ef4444",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  barDisabled: {
    opacity: 0.7,
  },
  text: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});
