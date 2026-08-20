import type { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "Delpic",
  slug: "delpic",
  owner: "sam84723s-team",
  version: "1.1.2",
  scheme: "delpic",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  experiments: {
    typedRoutes: true,
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.delpic.app",
  },
  android: {
    package: "com.delpic.app",
    adaptiveIcon: {
      backgroundColor: "#dffcf7",
      foregroundImage: "./assets/android-icon-foreground.png",
      backgroundImage: "./assets/android-icon-background.png",
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  extra: {
    eas: {
      projectId: "a0454b58-77c4-4572-933c-c844a3421bef",
    },
  },
  plugins: [
    "expo-router",
    "expo-status-bar",
    "expo-image",
    "expo-splash-screen",
    "expo-video",
    "expo-font",
    [
      "expo-media-library",
      {
        photosPermission: "Delpic needs access to your photos and videos so you can review and declutter them.",
        savePhotosPermission: "Delpic uses this permission to manage library changes when you confirm a batch deletion.",
        isAccessMediaLocationEnabled: false,
        granularPermissions: ["photo", "video"],
      },
    ],
  ],
};

export default config;
