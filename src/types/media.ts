import type { AssetMetadata } from "expo-media-library";
import { MediaType } from "expo-media-library";

export type ReviewableMediaType = MediaType.IMAGE | MediaType.VIDEO;

export interface ReviewableAsset extends AssetMetadata {
  mediaType: ReviewableMediaType;
}
