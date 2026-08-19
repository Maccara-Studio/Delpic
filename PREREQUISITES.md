# Prerequisites

Everything you need installed and configured before you can build and run Delpic. This project uses native modules (MMKV, RevenueCat, expo-media-library, expo-video), so it cannot run in the plain Expo Go app — you always need a custom **dev client** built for this project.

## 1. Node.js

- Install Node.js 22 LTS or newer (SDK 57 requires Node 22.13+).
- Verify: `node --version`

## 2. Android toolchain (for local USB builds)

You don't need Android Studio's emulator — you'll run the app on your physical phone over USB — but you do need the Android SDK and `adb` that come with it.

1. Install [Android Studio](https://developer.android.com/studio).
2. During setup (Standard install type), the Android SDK, platform-tools, and an SDK platform get installed automatically.
3. Open **More Actions → SDK Manager** and make sure these are checked (Show Package Details to see exact versions):
   - **SDK Platforms** tab: the platform matching this project's `compileSdkVersion` (currently **Android 36**) — Android Studio's default install may only include the newest platform, so check this explicitly.
   - **SDK Tools** tab: **Android SDK Command-line Tools (latest)**.
4. Set environment variables (Windows, System Properties > Environment Variables, User scope):
   - `ANDROID_HOME` and `ANDROID_SDK_ROOT` = `%LOCALAPPDATA%\Android\Sdk`
   - Add to `PATH`: `%ANDROID_HOME%\platform-tools`, `%ANDROID_HOME%\cmdline-tools\latest\bin`
5. Verify: open a **new** terminal and run `adb --version`.

### JDK — use 17, not the JDK bundled with Android Studio

Android Studio ships its own bundled JDK (JBR), but recent versions bundle a very new JDK (25 as of writing) that **breaks native Android builds** (Reanimated/Screens CMake configure steps fail with a cryptic "restricted method in java.lang.System has been called" error). Android/React Native's Gradle tooling is validated against **JDK 17**.

Get a JDK 17 without a separate manual installer, straight from Android Studio:
1. Open any Android project in Android Studio (e.g. this project's `android/` folder after your first `npx expo run:android` attempt has generated it).
2. **File → Settings → Build, Execution, Deployment → Build Tools → Gradle**.
3. Under **Gradle JVM criteria**, set **Version** to **17** and apply — Android Studio downloads a matching JDK automatically into `%USERPROFILE%\.gradle\jdks\`.
4. Set the environment variable `JAVA_HOME` (User scope) to that downloaded path, e.g. `%USERPROFILE%\.gradle\jdks\eclipse_adoptium-17-amd64-windows.2` (check the exact folder name on your machine), and add `%JAVA_HOME%\bin` to the front of `PATH`.
5. **Known follow-up issue:** the IDE sometimes auto-generates/updates `android/gradle/gradle-daemon-jvm.properties` with `toolchainVersion=25` (pinning Gradle's daemon to the broken JDK 25 regardless of `JAVA_HOME`). If a build fails complaining about downloading a "languageVersion=25" toolchain, open that file and change `toolchainVersion=25` to `toolchainVersion=17`, then run `.\gradlew.bat --stop` in `android/` before rebuilding.
6. Verify: open a **new** terminal and run `java -version` — should report `17.x`.

## 3. Enable USB debugging on your Android phone

1. Settings → About phone → tap **Build number** 7 times to unlock Developer Options.
2. Settings → System → Developer options → enable **USB debugging**.
3. Connect the phone to your PC with a USB cable.
4. Your phone will show an "Allow USB debugging?" prompt the first time — tap **Allow** (optionally check "always allow from this computer").
5. If Windows doesn't detect the phone, install your phone manufacturer's USB driver, or the generic [Google USB Driver](https://developer.android.com/studio/run/win-usb).
6. Verify: `adb devices` should list your device with status `device` (not `unauthorized` or `offline`).

### Antivirus HTTPS scanning breaks Gradle downloads (Norton, and similar tools)

Some antivirus products (Norton's "Web/Mail Shield" is a confirmed case) intercept HTTPS traffic and re-sign it with their own root certificate. Windows trusts this certificate (the antivirus installs it into the Windows certificate store), but **Java does not** — it has its own separate trust store — so Gradle builds fail with errors like:

```
PKIX path building failed: unable to find valid certification path to requested target
```

when downloading Gradle itself, JDK toolchains, or Maven/Android dependencies (`dl.google.com`, `repo.maven.apache.org`, etc.).

**Fix:** import your antivirus's HTTPS-scanning root certificate into each JDK's trust store you use for building (both Android Studio's bundled JBR and the separate JDK 17 from the step above, since they have independent `cacerts` files):

1. Find the certificate: Windows Settings → search "Manage user certificates" → **Trusted Root Certification Authorities → Certificates**. Look for an entry from your antivirus vendor (e.g. "Norton Web/Mail Shield Root"). Right-click → **All Tasks → Export** → base-64 or DER `.cer` file.
2. Import it into a JDK's trust store with `keytool` (run as Administrator only if the JDK lives under `Program Files`, e.g. Android Studio's bundled JBR — a JDK under your user profile, like the Gradle-downloaded JDK 17, does **not** need elevation):
   ```
   keytool -importcert -noprompt -trustcacerts -alias my-antivirus-root -file path\to\exported.cer -keystore "<JDK_HOME>\lib\security\cacerts" -storepass changeit
   ```
3. Stop any running Gradle daemon so it picks up the change: in `android/`, run `.\gradlew.bat --stop`.

If you don't use an antivirus with HTTPS scanning, you can skip this entirely — you'll simply never see this error.

## 4. EAS CLI (for iOS builds — no Mac required)

Since iOS builds need macOS and none is available locally, iOS dev-client builds run on Expo's cloud via EAS Build.

1. `npm install -g eas-cli`
2. `npx expo login` (or `eas login`) — create a free Expo account if you don't have one.
3. Verify: `eas --version`

## 5. Third-party accounts (not needed on day one, but plan ahead)

These aren't required until later milestones, but each has setup lead time, so don't leave them to the last minute:

- **Apple Developer account** — needed for EAS iOS builds and StoreKit sandbox testing (required before the RevenueCat milestone).
- **Google Play Console account** — needed to upload a signed build to an internal testing track for Android in-app purchase testing.
- **RevenueCat account** — free to create, used to configure the `premium_access` entitlement and connect it to both stores.

## Quick checklist

- [ ] `node --version` → 22.13+
- [ ] `adb --version` works in a new terminal
- [ ] Phone shows up in `adb devices` as `device`
- [ ] `java -version` → 17.x (not a bundled JDK 25 from Android Studio)
- [ ] Android SDK Platform 36 and Command-line Tools installed (SDK Manager)
- [ ] If you run antivirus with HTTPS scanning: its root cert is imported into every JDK's `cacerts`
- [ ] `eas --version` works and `eas whoami` shows you're logged in
