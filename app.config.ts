import type { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "Delpic",
  slug: "Delpic",
  version: "1.0.0",
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
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/android-icon-foreground.png",
      backgroundImage: "./assets/android-icon-background.png",
      monochromeImage: "./assets/android-icon-monochrome.png",
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  plugins: [
    "expo-router",
    "expo-status-bar",
    "expo-image",
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
