import type { StateCreator } from "zustand";

import type { AppState } from "../types";

export interface SessionSlice {
  cursorIndex: number;
  lastReviewedAssetId: string | null;
  setCursor: (index: number, assetId: string | null) => void;
  resetSession: () => void;
}

export const createSessionSlice: StateCreator<AppState, [], [], SessionSlice> = (set) => ({
  cursorIndex: 0,
  lastReviewedAssetId: null,
  setCursor: (index, assetId) => set({ cursorIndex: index, lastReviewedAssetId: assetId }),
  resetSession: () => set({ cursorIndex: 0, lastReviewedAssetId: null }),
});
