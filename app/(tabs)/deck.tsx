import { useCallback, useEffect, useState } from "react";
import { AppState, Linking, Pressable, StyleSheet, Text, View } from "react-native";

import { Screen } from "@/components/common/Screen";
import { SwipeDeck } from "@/components/deck/SwipeDeck";
import { checkPermissions, openMediaPermissionPicker, requestPermissions } from "@/services/mediaLibrary";

type PermissionStatus = "checking" | "granted" | "limited" | "denied";

interface PermissionState {
  status: PermissionStatus;
  canAskAgain: boolean;
}

export default function DeckScreen() {
  const [permission, setPermission] = useState<PermissionState>({ status: "checking", canAskAgain: true });

  const resolveStatus = useCallback((granted: boolean, accessPrivileges?: "all" | "limited" | "none"): PermissionStatus => {
    if (!granted) return "denied";
    return accessPrivileges === "limited" ? "limited" : "granted";
  }, []);

  const ensurePermission = useCallback(async () => {
    const existing = await checkPermissions();
    const result = existing.granted ? existing : await requestPermissions();
    setPermission({ status: resolveStatus(result.granted, result.accessPrivileges), canAskAgain: result.canAskAgain });
  }, [resolveStatus]);

  useEffect(() => {
    ensurePermission();
  }, [ensurePermission]);

  // Granting via "Open Settings" happens outside the app — nothing tells us the OS-level
  // permission changed until we come back, so re-check whenever the app returns to foreground.
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        ensurePermission();
      }
    });
    return () => subscription.remove();
  }, [ensurePermission]);

  if (permission.status === "checking") {
    return <Screen title="Deck" />;
  }

  if (permission.status === "denied") {
    return (
      <Screen title="Deck">
        <Text style={styles.message}>Delpic needs access to your photos and videos to help you declutter them.</Text>
        {permission.canAskAgain ? (
          <Pressable onPress={ensurePermission} style={styles.button} accessibilityRole="button">
            <Text style={styles.buttonText}>Grant Access</Text>
          </Pressable>
        ) : (
          <Pressable onPress={() => Linking.openSettings()} style={styles.button} accessibilityRole="button">
            <Text style={styles.buttonText}>Open Settings</Text>
          </Pressable>
        )}
      </Screen>
    );
  }

  return (
    <View style={styles.container}>
      {permission.status === "limited" && (
        <View style={styles.limitedBanner}>
          <Text style={styles.limitedBannerText}>You&apos;ve only shared some photos with Delpic.</Text>
          <Pressable onPress={() => openMediaPermissionPicker().then(ensurePermission)} accessibilityRole="link">
            <Text style={styles.limitedBannerLink}>Select more</Text>
          </Pressable>
        </View>
      )}
      <SwipeDeck />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  message: {
    textAlign: "center",
    paddingHorizontal: 32,
    color: "#374151",
  },
  button: {
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    backgroundColor: "#111",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  limitedBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 8,
    backgroundColor: "#fef3c7",
  },
  limitedBannerText: {
    fontSize: 13,
    color: "#92400e",
  },
  limitedBannerLink: {
    fontSize: 13,
    fontWeight: "600",
    color: "#92400e",
    textDecorationLine: "underline",
  },
});
