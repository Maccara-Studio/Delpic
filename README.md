# Delpic

A photo & video decluttering app: swipe right to keep, swipe left to stage for deletion, review your trash queue, then delete everything in one native confirmation.

Built with Expo (React Native), Expo Router, Reanimated + Gesture Handler, Zustand + MMKV, expo-media-library, expo-video, and RevenueCat.

See [PREREQUISITES.md](./PREREQUISITES.md) first if this is your first time setting up the project.

## First-time setup

```sh
npm install
```

Connect your Android phone via USB (with USB debugging enabled — see PREREQUISITES.md), then confirm it's detected:

```sh
adb devices
```

You should see your device listed with status `device`.

## Day-to-day development (Android, over USB)

The first time, or whenever a native dependency/config plugin changes, build and install the custom dev client onto your phone:

```sh
npm run android
```

This compiles a native Android build (takes a few minutes the first time) and installs it directly on your connected phone via `adb`.

For everyday work after that, you don't need to rebuild — just start the Metro bundler and connect to the already-installed dev client:

```sh
npm start
```

Then open the Delpic dev client app on your phone. If it doesn't auto-detect the running server (the "Fetch development servers" button can fail to find it over USB), open the dev client's **Home** tab and enter the URL manually:

```
http://localhost:8081
```

This works because `npx expo run:android`/`expo start` automatically set up `adb reverse tcp:8081 tcp:8081`, which forwards the phone's `localhost:8081` to the PC over the USB cable. You can check this is active with `adb reverse --list`.

**Rule of thumb:** JS/TS-only change → `npm start` is enough. Added or changed a native dependency (anything installed via `npx expo install` that touches native code) or edited `app.config.ts` plugins → rebuild with `npm run android`.

## iOS (no local Mac)

iOS builds run on Expo's cloud build service (EAS Build) since there's no local Mac available:

```sh
eas build --profile development --platform ios
```

Once the build finishes, install it on an iPhone via the link EAS gives you (or via TestFlight, once that's set up). After it's installed, iterate the same way as Android:

```sh
npm start
```

and connect from the installed dev client.

## Troubleshooting

- **`adb devices` shows nothing** — check USB debugging is enabled on the phone, try a different USB cable/port, reinstall the USB driver, and check for the "Allow USB debugging?" prompt on the phone screen.
- **`adb devices` shows `unauthorized`** — unlock the phone and tap "Allow" on the debugging prompt.
- **Metro bundler won't connect from the phone / dev client shows "no development server"** — make sure the phone and PC are either on the same network (if using Wi-Fi/Expo Go-style connection) or that the USB connection is active; try `adb reverse tcp:8081 tcp:8081` to force Metro traffic over the USB cable, then enter `http://localhost:8081` manually in the dev client rather than relying on auto-discovery.
- **Gradle build fails with SSL/certificate errors** (`PKIX path building failed`, etc.) — usually caused by antivirus software intercepting HTTPS. See the "Antivirus HTTPS scanning" section in [PREREQUISITES.md](./PREREQUISITES.md).
- **Gradle build fails on a CMake/native "configureCMakeDebug" step with a "restricted method" warning** — you're building with too new a JDK (25). See the JDK 17 section in [PREREQUISITES.md](./PREREQUISITES.md), and check `android/gradle/gradle-daemon-jvm.properties` doesn't have `toolchainVersion=25`.
- **"Which build do I need to redo?"** — JS-only change: no rebuild, just reload. New native dependency, changed native config (permissions, plugins, app icon, splash): rebuild with `npm run android` (or a new EAS build for iOS).

## Type-checking & linting

```sh
npm run typecheck
```
