import { StyleSheet, Text, View } from "react-native";

interface OnboardingStepBubbleProps {
  title: string;
  body: string;
}

export function OnboardingStepBubble({ title, body }: OnboardingStepBubbleProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.tail} />
      <View style={styles.bubble}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{body}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
  },
  tail: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#fff",
  },
  bubble: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    gap: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    color: "#444",
  },
});
