# Delpic

Delpic is a mobile app that makes cleaning up your camera roll fast and painless. Swipe right to keep a photo or video, swipe left to send it to a trash queue, review that queue, then delete everything at once with a single confirmation — no more digging through thousands of photos one at a time.

## Features

- **Tinder-style review** — swipe through your camera roll one item at a time, newest first
- **Inline video playback** — videos autoplay (muted by default) right in the deck, no need to open them separately
- **Batched deletion** — nothing is deleted until you confirm the whole trash queue at once, with a single native OS prompt
- **Undo** — step back through your last several decisions if you change your mind
- **Resume where you left off** — your progress is saved locally and picks up right where you stopped, even after restarting the app
- **Guided onboarding** — a short interactive tour on first launch

## Status

Delpic is in active development and closed testing. It isn't published on any app store yet.

## Built with

Expo (React Native), Expo Router, Reanimated + Gesture Handler, Zustand + MMKV, expo-media-library, expo-video, and RevenueCat.

## License

All rights reserved — see [LICENSE](./LICENSE). This code is public for reference only; no permission is granted to reuse it.

---

## Development

The rest of this document is for people working on Delpic itself. See [PREREQUISITES.md](./PREREQUISITES.md) for one-time machine setup, [ARCHITECTURE.md](./ARCHITECTURE.md) for a map of what each file/folder is, and [DEVLOG.md](./DEVLOG.md) for a running log of what's been built per milestone.

### First-time setup

```sh
npm install
```

Connect your Android phone via USB (with USB debugging enabled — see PREREQUISITES.md), then confirm it's detected:

```sh
adb devices
```

You should see your device listed with status `device`.

### Day-to-day development (Android, over USB)

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

### iOS (no local Mac)

iOS builds run on Expo's cloud build service (EAS Build) since there's no local Mac available:

```sh
eas build --profile development --platform ios
```

Once the build finishes, install it on an iPhone via the link EAS gives you (or via TestFlight, once that's set up). After it's installed, iterate the same way as Android:

```sh
npm start
```

and connect from the installed dev client.

### Troubleshooting

- **`adb devices` shows nothing** — check USB debugging is enabled on the phone, try a different USB cable/port, reinstall the USB driver, and check for the "Allow USB debugging?" prompt on the phone screen.
- **`adb devices` shows `unauthorized`** — unlock the phone and tap "Allow" on the debugging prompt.
- **Metro bundler won't connect from the phone / dev client shows "no development server"** — make sure the phone and PC are either on the same network (if using Wi-Fi/Expo Go-style connection) or that the USB connection is active; try `adb reverse tcp:8081 tcp:8081` to force Metro traffic over the USB cable, then enter `http://localhost:8081` manually in the dev client rather than relying on auto-discovery.
- **Gradle build fails with SSL/certificate errors** (`PKIX path building failed`, etc.) — usually caused by antivirus software intercepting HTTPS. See the "Antivirus HTTPS scanning" section in [PREREQUISITES.md](./PREREQUISITES.md).
- **Gradle build fails on a CMake/native "configureCMakeDebug" step with a "restricted method" warning** — you're building with too new a JDK (25). See the JDK 17 section in [PREREQUISITES.md](./PREREQUISITES.md), and check `android/gradle/gradle-daemon-jvm.properties` doesn't have `toolchainVersion=25`.
- **"Which build do I need to redo?"** — JS-only change: no rebuild, just reload. New native dependency, changed native config (permissions, plugins, app icon, splash): rebuild with `npm run android` (or a new EAS build for iOS).
- **Just added a config plugin (new permissions, etc.) but the app doesn't reflect it** — the incremental prebuild that `npm run android` runs doesn't always merge new plugin output into an already-generated `android/` project. Delete the `android/` folder (and `ios/` if present — both are gitignored, fully regenerated) and rebuild to force a clean regeneration.
- **App shows a persistent blank white screen** — usually means Metro isn't actually reachable, even if a terminal window looks like it's still running. Check `Invoke-WebRequest http://localhost:8081/status` actually responds; if it hangs/errors, the Metro process likely died silently — kill stray `node` processes and restart with `npm start`.
- **Testing the permission flow again after it was already granted** — revoke it without digging through phone settings: `adb shell pm revoke com.delpic.app android.permission.READ_MEDIA_IMAGES`, same for `READ_MEDIA_VIDEO`, then `adb shell am force-stop com.delpic.app` and reopen the app.

### Type-checking & linting

```sh
npm run typecheck
```
