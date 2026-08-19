import { useEffect, useState } from "react";
import { Text } from "react-native";

import { Screen } from "@/components/common/Screen";
import { SwipeDeck } from "@/components/deck/SwipeDeck";
import { checkPermissions, requestPermissions } from "@/services/mediaLibrary";

type PermissionState = "checking" | "denied" | "granted";

export default function DeckScreen() {
  const [permissionState, setPermissionState] = useState<PermissionState>("checking");

  useEffect(() => {
    let cancelled = false;

    async function ensurePermission() {
      const existing = await checkPermissions();
      const permission = existing.granted ? existing : await requestPermissions();
      if (!cancelled) {
        setPermissionState(permission.granted ? "granted" : "denied");
      }
    }

    ensurePermission();
    return () => {
      cancelled = true;
    };
  }, []);

  if (permissionState === "checking") {
    return <Screen title="Deck" />;
  }

  if (permissionState === "denied") {
    return (
      <Screen title="Deck">
        <Text>Media library access denied.</Text>
      </Screen>
    );
  }

  return <SwipeDeck />;
}
