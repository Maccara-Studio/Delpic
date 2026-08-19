import type { MediaType } from "expo-media-library";
import type { StateCreator } from "zustand";

import type { AppState } from "../types";

export interface StagedAsset {
  id: string;
  filename: string | null;
  mediaType: MediaType;
  stagedAt: number;
}

export interface TrashSlice {
  stagedAssets: StagedAsset[];
  addToTrash: (asset: StagedAsset) => void;
  removeFromTrash: (assetId: string) => void;
  clearTrash: () => void;
}

export const createTrashSlice: StateCreator<AppState, [], [], TrashSlice> = (set) => ({
  stagedAssets: [],
  addToTrash: (asset) =>
    set((state) => ({ stagedAssets: [...state.stagedAssets, asset] })),
  removeFromTrash: (assetId) =>
    set((state) => ({ stagedAssets: state.stagedAssets.filter((a) => a.id !== assetId) })),
  clearTrash: () => set({ stagedAssets: [] }),
});
