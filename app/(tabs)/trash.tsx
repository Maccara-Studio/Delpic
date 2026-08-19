import { Text } from "react-native";

import { Screen } from "@/components/common/Screen";
import { useAppStore } from "@/store/useAppStore";

export default function TrashScreen() {
  const stagedCount = useAppStore((s) => s.stagedAssets.length);

  return (
    <Screen title="Trash">
      <Text>{stagedCount} item(s) staged for deletion</Text>
    </Screen>
  );
}
