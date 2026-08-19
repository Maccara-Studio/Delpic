import type { OnboardingSlice } from "./slices/onboardingSlice";
import type { SessionSlice } from "./slices/sessionSlice";
import type { SettingsSlice } from "./slices/settingsSlice";
import type { TrashSlice } from "./slices/trashSlice";

export type AppState = SessionSlice & SettingsSlice & TrashSlice & OnboardingSlice;
