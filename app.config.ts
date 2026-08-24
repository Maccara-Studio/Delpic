import type { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "Delpic",
  slug: "delpic",
  owner: "maccarastudio",
  version: "1.1.4",
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
      projectId: "9fa2d4ce-ecca-4e30-9694-d49a45365a2c",
    },
  },
  plugins: [
    "expo-router",
    "expo-status-bar",
    "expo-image",
    [
      "expo-splash-screen",
      {
        image: "./assets/splash-mark.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#DE6461",
      },
    ],
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
