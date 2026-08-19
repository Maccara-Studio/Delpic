import type { StateCreator } from "zustand";

import { MAX_UNDO_HISTORY } from "@/lib/constants";

import type { AppState } from "../types";

export type SwipeDirection = "left" | "right";

export interface SwipeHistoryEntry {
  assetId: string;
  direction: SwipeDirection;
  wasStagedForTrash: boolean;
}

export interface SessionSlice {
  cursorIndex: number;
  lastReviewedAssetId: string | null;
  history: SwipeHistoryEntry[];
  setCursor: (index: number, assetId: string | null) => void;
  recordSwipe: (entry: SwipeHistoryEntry) => void;
  popHistory: () => SwipeHistoryEntry | undefined;
  resetSession: () => void;
}

export const createSessionSlice: StateCreator<AppState, [], [], SessionSlice> = (set, get) => ({
  cursorIndex: 0,
  lastReviewedAssetId: null,
  history: [],
  setCursor: (index, assetId) => set({ cursorIndex: index, lastReviewedAssetId: assetId }),
  recordSwipe: (entry) =>
    set((state) => ({ history: [...state.history, entry].slice(-MAX_UNDO_HISTORY) })),
  popHistory: () => {
    const { history } = get();
    const last = history[history.length - 1];
    if (last) {
      set({ history: history.slice(0, -1) });
    }
    return last;
  },
  resetSession: () => set({ cursorIndex: 0, lastReviewedAssetId: null, history: [] }),
});
