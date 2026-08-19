import type { SessionSlice } from "./slices/sessionSlice";
import type { SettingsSlice } from "./slices/settingsSlice";

export type AppState = SessionSlice & SettingsSlice;
