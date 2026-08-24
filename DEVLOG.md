# Development Log

Chronological record of what was done per milestone and the key problems hit along the way. Kept concise — one line per issue, not a full narrative. See git history for exact diffs.

---

## Milestone 1 — Scaffold + navigation

**Built:** Expo SDK 57 / RN 0.86 / TS scaffold, Expo Router + Reanimated 4 + Gesture Handler + dev-client, `(tabs)` nav shell (Deck/Trash/Settings + Onboarding/Tip Jar modals), `app.config.ts`, `PREREQUISITES.md`/`README.md`, first on-device USB build.

**Fixed:**
- npm peer conflict (expo-router's web deps) → `.npmrc` `legacy-peer-deps=true`.
- Reanimated 4 needs `react-native-worklets` as a separate package.
- JDK 25 (Android Studio's bundled JBR) breaks native builds (AGP/Prefab bug) → use JDK 17, and watch for `gradle-daemon-jvm.properties` silently re-pinning JDK 25.
- Norton AV intercepts HTTPS → import its root cert into every JDK's own `cacerts`, not just Windows' store.
- Dev client can't auto-discover Metro over USB → enter `http://localhost:8081` manually (works via `adb reverse`).

**Status:** Runs on-device via USB, empty tab nav works. ✅

---

## Milestone 2 — Media Library service + permissions

**Built:** `src/services/mediaLibrary.ts` (`expo-media-library`'s new class-based `Query`/`Asset` API — the old free-functions throw unless imported from `/legacy`), permission plugin config, debug thumbnail grid to validate against real photos.

**Fixed:**
- Permissions missing from manifest after adding the plugin to an already-generated `android/` → incremental prebuild doesn't inject new plugin permissions; delete `android/` and rebuild from scratch. **(Recurring lesson — see M5, M7-tooling.)**
- Blank screen → Metro had silently died; restart it.

**Status:** Real photos/videos load, permission flow verified end-to-end. ✅

---

## Milestone 3 — Static swipe deck + session persistence

**Built:** `react-native-mmkv` v4 (Nitro Modules, `createMMKV()` not `new MMKV()`) + Zustand slices (`sessionSlice`, `settingsSlice`) under one `persist()`, splash screen held until store hydration, static 3-card stack (`useCardStack`, `SwipeDeck`, `SwipeCard`, `CardMedia`).

**Fixed:**
- Standing practice established: always check a new dependency's own shipped `.d.ts` files before coding against it — this stack's APIs change too fast to trust memory/docs.
- First JS bundle after a native rebuild can take minutes — give it time before assuming it's broken.
- Cards rendered full-bleed (no safe-area/margin) → double-nested `Pressable`+`View` with `width/height:'100%'` measured wrong on Android; use `StyleSheet.absoluteFill` + `SafeAreaView` instead.

**Status:** Static stack shows real media, cursor persists across app restarts. ✅

---

## Milestone 4 — Gestures, spring animation, trash queue, undo

**Built:** `trashSlice` + `history` ring buffer for undo, `useSwipeGesture` (Pan gesture, fling/distance thresholds, spring physics), `CardOverlay` (colored border), gesture-driven `SwipeCard`/`SwipeDeck`, `ProgressBar`, "Restart from Beginning" in Settings.

**Fixed** (the most iteration of any milestone):
- Snap-back spring overshot → critically damped + `overshootClamping: true`.
- Swipes throttled to animation duration (250-500ms), breaking the <100ms rapid-swipe requirement → decoupled data-model advance (immediate, on release) from the fly-off animation (purely visual).
- Decoupling meant departing cards popped instead of flying off → added an "exiting" ghost layer in `SwipeDeck`, same component instance/key preserved across the stack↔exiting transition.
- Duplicate-key warning + forced delay under rapid swiping → `Gesture.Pan()` was being recreated every render; memoize it (gesture-handler's own recommendation).
- Stuck/oversized unresponsive card after Restart/fast-undo → a card pulled back into the stack mid-exit kept its stale off-screen `translateX`; reset shared values specifically on the "exiting → back in stack" transition.
- `adb reverse tcp:8081 tcp:8081` needs re-running if the adb daemon respawns mid-session.

**Status:** Swipes feel snappy with no overshoot, rapid consecutive swipes aren't throttled, undo/progress persist correctly. ✅

---

## Milestone 5 — Video engine

**Built:** `expo-video` (`VideoCardPlayer` — loop, muted/autoplay from `settingsSlice`, mute toggle), `CardMedia` gains `isActive` to gate real playback to the top card only.

**Fixed:** New native module → full `android/` regen instead of incremental prebuild (per M2's lesson). No pause/lifecycle code needed beyond mount-gating — `isActive` going false on swipe already unmounts the player right on decision.

**Status:** One video active at a time, mute toggle works, no audio bleed on swipe. ✅

---

## Milestone 6 — Trash queue + batch delete

**Built:** `TrashGrid`/`TrashItem`/`TrashActionBar` (3-col grid, restore, floating delete bar), `trash.tsx` wired to `deleteAssetsBatch` behind a confirm `Alert` (single native OS confirmation for the whole batch).

**Fixed:** Metro failed to resolve a just-created file in a new `src/components/trash/` directory (stale resolver cache) → restart Metro; no rebuild needed since no native dep was added.

**Status:** Batch delete works with one native confirmation, queue clears after. ✅

---

## Tooling — App icon, tab bar icons, EAS preview builds

**Built:** `@expo/vector-icons`/`expo-font` for real tab icons + an explicit "undo" icon (was a plain "←"), app icon set generated from a user-supplied design via a one-off local `sharp` script (removed after use), EAS Build configured for `.apk` internal-distribution preview builds.

**Fixed:**
- iOS icon needs zero alpha channel (source had semi-transparent edges) → flattened with `sharp`.
- `eas login` opened a password prompt because the account has no password (GitHub OAuth only) → always `eas login --browser`.
- `eas init` on a dynamic (`.ts`) config fails one missing field at a time (`extra.eas.projectId`, `owner`, `slug` mismatch) → expect multiple manual-fix-and-retry rounds, not one shot.
- Dev client couldn't reach Metro at all: LAN IP unreachable, then `--localhost` mode bound only to IPv6 `[::1]` while adb's bridge connects via IPv4 `127.0.0.1` → `NODE_OPTIONS=--dns-result-order=ipv4first` before `expo start --localhost`, every time, on this machine.
- New icon files didn't show up on-device → asset changes only take effect on the *next* native rebuild, editing the PNG alone does nothing.
- Adaptive-icon foreground had a visible white seam → caused by compositing a resized copy with soft/semi-transparent source edges onto a transparent canvas; reusing the full-bleed flattened icon directly (no resize/composite) fixed it, at the cost of a bit more edge-cropping risk on aggressive launcher masks.

**Status:** Real tab/undo icons, launcher icon matches the design, first EAS preview `.apk` built and shared with testers. ✅

---

## Milestone 7 — Onboarding tutorial

**Built:** `onboardingSlice` (`hasCompletedOnboarding`, gates `index.tsx`'s redirect target), minimal i18n scaffold (`src/i18n/`, English only, structured for Milestone 11), 3-step guided tour (Welcome → Deck → Trash) with a real swipeable mock deck (`useSwipeGesture` reused directly, no OS media permission needed), "Replay Tutorial" in Settings, permission still requested only after onboarding (on the real Deck tab).

**Fixed:**
- Mock deck swipe felt laggy vs. the production deck → same fix as M4's ghost-layer ($4): advance immediately, keep a stable per-appearance key across the interactive→exiting transition, don't gate on animation-finish.
- Dropped a 4th "Settings" step after review — redundant with the real Settings tab.
- Same Metro stale-resolver issue as M6 for new directories → `expo start --localhost --clear`.

**Status:** First launch goes straight into the tour, mock swipe feels as responsive as the real deck, replay works, permission requested only after. ✅

---

## Milestone 8 — Monetization (RevenueCat)

**Deferred.** Not started — the user isn't sure yet whether a paid model is worth pursuing, and didn't want to commit to an Apple Developer account (99$/yr) before validating the app with real users. Revisit once there's evidence the app is worth monetizing. See Milestones 9/10 for the polish work done instead while this stays on hold.

---

## Milestone 9 — Settings + bug fixes

**Built:** Real toggles for `autoplayVideos`/`muteByDefault` in Settings (was dead state with no UI), bumped `MAX_UNDO_HISTORY` 10 → 30. Dropped the `hapticsEnabled` setting and the Tip Jar entry point entirely — not worth building ahead of Milestone 8.

**Fixed:**
- Landscape photos/videos were cropped to fill the portrait card (`contentFit: "cover"`) instead of showing the full frame — switched `CardMedia`/`VideoCardPlayer` to `"contain"`. Real bug for a review app: you can't decide keep/delete on a photo you can't fully see.
- Spamming the undo button froze the deck (no crash, review count kept updating) — root cause: a card whose exit spring gets interrupted by undo (before it finishes flying off) never fires its "finished" callback, so it stayed stuck in `SwipeDeck`'s exiting-cards list forever. Undo far enough for that same card to fall back out of the visible window, and it reappeared as a stale, centered, non-interactive ghost stacked on top of the real card — blocking every swipe. Fixed by explicitly clearing it from that list at the moment it's rescued back into the stack, not just when its own animation naturally completes.
- Along the way, also stopped fully recreating the swipe gesture on every interactive/buried toggle (`.enabled()` mutates the existing gesture instead) — cheaper, and avoids native gesture-handler churn under rapid state changes.

**Status:** Settings toggles work and persist, landscape media displays fully, undo is spam-safe. ✅

---

## Milestone 10 — Error handling, empty states, accessibility

**Built:** Permission-denied screen now offers "Grant Access" (if askable again) or "Open Settings", re-checks permission automatically when the app returns to foreground (needed since granting via Settings happens outside the app), and surfaces Android/iOS "limited" photo access with a banner to select more. `useCardStack` catches page-load failures instead of hanging on "Loading…" forever, with a Retry button. Empty-library and "all reviewed" states got icons/copy, the latter linking to the Trash tab when items are staged. Accessibility labels/roles added to every icon-only control (undo, mute, restore, delete bar) and the remaining buttons/switches.

**Skipped:** Dark mode (not wanted) and swipe-gesture accessibility actions (the core task is inherently visual — a screen reader user can't judge a photo they can't see, so the effort didn't justify touching the recently-stabilized gesture code). Production EAS profile was already correct as scaffolded (defaults to `.aab` + `autoIncrement`); `eas submit` credentials are blocked on the Play Console account.

**Status:** No more dead-end screens; permission, load-failure, and empty/finished states all have a way forward. ✅

---

## Tooling — splash screen

**Built:**
- `README.md` restructured product-first (pitch, features, status, license) with the existing dev setup moved under a `## Development` section; `LICENSE` (all rights reserved) and `PRIVACY.md` added.
- Play Store 512×512 icon generated from the existing source design.

**Fixed:**
- `git push`/`eas login` failing with an SSL error → same Norton HTTPS interception as PREREQUISITES.md already documents for Gradle, just hitting git this time → `git config http.sslBackend schannel` to use Windows' own trusted cert store instead of git's bundled CA bundle.
- The splash screen had never actually been configured despite `expo-splash-screen` being in `plugins` — `assets/splash-icon.png` turned out to be the unused Expo template placeholder (concentric circles), not a real asset.
- First attempt (reusing `icon.png`, centered, small) showed pale streaks at its rounded corners — same root cause as the M6.5 adaptive-icon seam bug, just visible again at a different size/background. Fixed by cropping a border-free version of the artwork (`splash-mark.png`) for that fallback use.
- Tried a full-bleed gradient + wordmark splash image next — discovered Android 12+ hard-locks the native splash screen to a small centered icon on a solid background; there is no config option to make a native splash cover the full screen. Ended up building a custom in-app splash (`SplashView`, `expo-linear-gradient`) that takes over immediately once JS starts, giving full control over layout, with the native icon/background color chosen to blend into it for a seamless handoff.

**Status:** Repo is clean and rebranded, Play Store prerequisites are lined up except for account verification, splash screen shows the intended full-screen design via the custom JS splash. ✅
