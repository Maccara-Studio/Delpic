import {
  Asset,
  AssetField,
  MediaType,
  Query,
  getPermissionsAsync,
  requestPermissionsAsync,
  type PermissionResponse,
} from "expo-media-library";
// presentPermissionsPickerAsync isn't part of the class-based API — only exported from /legacy,
// same as the other old-style free functions (see M2's lesson in DEVLOG.md).
import { presentPermissionsPickerAsync } from "expo-media-library/legacy";

import { MEDIA_PAGE_SIZE } from "@/lib/constants";
import type { ReviewableAsset } from "@/types/media";

export function checkPermissions(): Promise<PermissionResponse> {
  return getPermissionsAsync();
}

export function requestPermissions(): Promise<PermissionResponse> {
  return requestPermissionsAsync();
}

/** Lets the user pick additional photos/videos to share when they granted "limited" access. */
export function openMediaPermissionPicker(): Promise<void> {
  return presentPermissionsPickerAsync();
}

export interface FetchAssetsPageParams {
  offset: number;
  limit?: number;
}

export interface FetchAssetsPageResult {
  assets: ReviewableAsset[];
  hasNextPage: boolean;
}

export async function fetchAssetsPage({
  offset,
  limit = MEDIA_PAGE_SIZE,
}: FetchAssetsPageParams): Promise<FetchAssetsPageResult> {
  const metadata = await new Query()
    .within(AssetField.MEDIA_TYPE, [MediaType.IMAGE, MediaType.VIDEO])
    .orderBy({ key: AssetField.CREATION_TIME, ascending: false })
    .offset(offset)
    .limit(limit)
    .exeForMetadata();

  return {
    assets: metadata as ReviewableAsset[],
    hasNextPage: metadata.length === limit,
  };
}

export function resolvePlayableUri(assetId: string): Promise<string> {
  return new Asset(assetId).getUri();
}

export async function deleteAssetsBatch(assetIds: string[]): Promise<void> {
  await Asset.delete(assetIds.map((id) => new Asset(id)));
}
