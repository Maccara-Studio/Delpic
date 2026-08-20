import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

import { useAppStore } from "@/store/useAppStore";

interface VideoCardPlayerProps {
  uri: string;
}

// Mounted only for the active top-of-stack card (see CardMedia) — creation/unmount of this
// component is what starts/releases the native player, which is what keeps only one video
// playing at a time and memory stable across many swipes.
export function VideoCardPlayer({ uri }: VideoCardPlayerProps) {
  const autoplayVideos = useAppStore((s) => s.autoplayVideos);
  const muteByDefault = useAppStore((s) => s.muteByDefault);
  const [muted, setMuted] = useState(muteByDefault);

  const player = useVideoPlayer(uri, (p) => {
    p.loop = true;
    p.muted = muteByDefault;
    if (autoplayVideos) p.play();
  });

  useEffect(() => {
    player.muted = muted;
  }, [player, muted]);

  return (
    <>
      <VideoView style={styles.media} player={player} contentFit="contain" nativeControls={false} />
      <Pressable
        style={styles.muteButton}
        onPress={() => setMuted((m) => !m)}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel={muted ? "Unmute video" : "Mute video"}
      >
        <Text style={styles.muteIcon}>{muted ? "🔇" : "🔊"}</Text>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  media: {
    flex: 1,
    borderRadius: 16,
  },
  muteButton: {
    position: "absolute",
    bottom: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  muteIcon: {
    fontSize: 16,
  },
});
