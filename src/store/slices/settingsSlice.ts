import type { StateCreator } from "zustand";

import type { AppState } from "../types";

export interface SettingsValues {
  autoplayVideos: boolean;
  muteByDefault: boolean;
}

export interface SettingsSlice extends SettingsValues {
  updateSetting: <K extends keyof SettingsValues>(key: K, value: SettingsValues[K]) => void;
}

export const createSettingsSlice: StateCreator<AppState, [], [], SettingsSlice> = (set) => ({
  autoplayVideos: true,
  muteByDefault: true,
  updateSetting: (key, value) => set({ [key]: value } as Partial<AppState>),
});
