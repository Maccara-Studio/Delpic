import type { StateCreator } from "zustand";

import type { AppState } from "../types";

export interface OnboardingSlice {
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
}

export const createOnboardingSlice: StateCreator<AppState, [], [], OnboardingSlice> = (set) => ({
  hasCompletedOnboarding: false,
  completeOnboarding: () => set({ hasCompletedOnboarding: true }),
});
