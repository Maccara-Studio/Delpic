import { StyleSheet, Text } from "react-native";

import { Screen } from "@/components/common/Screen";

export default function TipJarScreen() {
  return (
    <Screen title="Tip Jar">
      <Text style={styles.body}>Support for tipping and Pro is coming in a future update. Thanks for trying Delpic!</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: 32,
    textAlign: "center",
    color: "#6b7280",
  },
});
