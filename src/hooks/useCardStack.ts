import { useCallback, useEffect, useRef, useState } from "react";

import { DECK_PREFETCH_THRESHOLD, DECK_STACK_SIZE, MAX_UNDO_HISTORY } from "@/lib/constants";
import { fetchAssetsPage } from "@/services/mediaLibrary";
import type { SwipeDirection } from "@/store/slices/sessionSlice";
import { useAppStore } from "@/store/useAppStore";
import type { ReviewableAsset } from "@/types/media";

export function useCardStack() {
  const cursorIndex = useAppStore((s) => s.cursorIndex);
  const canUndo = useAppStore((s) => s.history.length > 0);

  const [assets, setAssets] = useState<ReviewableAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const hasNextPageRef = useRef(true);
  const isFetchingRef = useRef(false);

  const loadNextPage = useCallback(async () => {
    if (isFetchingRef.current || !hasNextPageRef.current) return;
    isFetchingRef.current = true;
    try {
      const { assets: page, hasNextPage } = await fetchAssetsPage({ offset: assets.length });
      hasNextPageRef.current = hasNextPage;
      setAssets((prev) => [...prev, ...page]);
      setLoadError(false);
    } catch {
      // Leave hasNextPageRef untouched so the next prefetch trigger (or an explicit retry)
      // attempts this same page again instead of silently giving up on the rest of the library.
      setLoadError(true);
    } finally {
      isFetchingRef.current = false;
      setIsLoading(false);
    }
  }, [assets.length]);

  useEffect(() => {
    loadNextPage();
    // Only runs once on mount to load the first page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (assets.length - cursorIndex <= DECK_PREFETCH_THRESHOLD) {
      loadNextPage();
    }
  }, [cursorIndex, assets.length, loadNextPage]);

  const visibleAssets = assets.slice(cursorIndex, cursorIndex + DECK_STACK_SIZE);

  // completeSwipe/undo write directly via useAppStore.setState/getState (one atomic update
  // touching session + trash together, always reading the freshest cursorIndex) instead of
  // calling each slice action separately from a React-render-time closure — swipes can come
  // in well under 100ms apart, faster than a React re-render, so this hot path can't afford
  // to trust stale closures or trigger three separate MMKV writes per swipe.
  const completeSwipe = useCallback(
    (asset: ReviewableAsset, direction: SwipeDirection) => {
      const state = useAppStore.getState();
      const wasStagedForTrash = direction === "left";

      useAppStore.setState({
        cursorIndex: state.cursorIndex + 1,
        lastReviewedAssetId: asset.id,
        history: [...state.history, { assetId: asset.id, direction, wasStagedForTrash }].slice(-MAX_UNDO_HISTORY),
        stagedAssets: wasStagedForTrash
          ? [
              ...state.stagedAssets,
              { id: asset.id, filename: asset.filename, mediaType: asset.mediaType, stagedAt: Date.now() },
            ]
          : state.stagedAssets,
      });
    },
    [],
  );

  const undo = useCallback(() => {
    const state = useAppStore.getState();
    const entry = state.history[state.history.length - 1];
    if (!entry) return;

    const newIndex = state.cursorIndex - 1;
    const newLastReviewed = newIndex > 0 ? (assets[newIndex - 1]?.id ?? null) : null;

    useAppStore.setState({
      cursorIndex: newIndex,
      lastReviewedAssetId: newLastReviewed,
      history: state.history.slice(0, -1),
      stagedAssets: entry.wasStagedForTrash
        ? state.stagedAssets.filter((a) => a.id !== entry.assetId)
        : state.stagedAssets,
    });
  }, [assets]);

  return {
    visibleAssets,
    isLoading,
    isEmpty: !isLoading && !loadError && assets.length === 0,
    isDeckFinished: !isLoading && assets.length > 0 && cursorIndex >= assets.length,
    hasLoadError: loadError && assets.length === 0,
    retryLoad: loadNextPage,
    reviewedCount: cursorIndex,
    loadedCount: assets.length,
    canUndo,
    completeSwipe,
    undo,
  };
}
