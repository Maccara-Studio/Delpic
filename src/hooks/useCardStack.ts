import { useCallback, useEffect, useRef, useState } from "react";

import { DECK_PREFETCH_THRESHOLD, DECK_STACK_SIZE } from "@/lib/constants";
import { fetchAssetsPage } from "@/services/mediaLibrary";
import { useAppStore } from "@/store/useAppStore";
import type { ReviewableAsset } from "@/types/media";

export function useCardStack() {
  const cursorIndex = useAppStore((s) => s.cursorIndex);
  const setCursor = useAppStore((s) => s.setCursor);

  const [assets, setAssets] = useState<ReviewableAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const hasNextPageRef = useRef(true);
  const isFetchingRef = useRef(false);

  const loadNextPage = useCallback(async () => {
    if (isFetchingRef.current || !hasNextPageRef.current) return;
    isFetchingRef.current = true;
    try {
      const { assets: page, hasNextPage } = await fetchAssetsPage({ offset: assets.length });
      hasNextPageRef.current = hasNextPage;
      setAssets((prev) => [...prev, ...page]);
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

  const advance = useCallback(() => {
    const current = assets[cursorIndex];
    if (!current) return;
    setCursor(cursorIndex + 1, current.id);
  }, [assets, cursorIndex, setCursor]);

  const goBack = useCallback(() => {
    if (cursorIndex === 0) return;
    const previousIndex = cursorIndex - 1;
    const previous = assets[previousIndex];
    setCursor(previousIndex, previous?.id ?? null);
  }, [assets, cursorIndex, setCursor]);

  return {
    visibleAssets,
    isLoading,
    isEmpty: !isLoading && assets.length === 0,
    isDeckFinished: !isLoading && assets.length > 0 && cursorIndex >= assets.length,
    canGoBack: cursorIndex > 0,
    advance,
    goBack,
  };
}
