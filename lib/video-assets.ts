import fs from "fs";
import path from "path";
import { siteConfig } from "@/lib/site-config";

export type VideoAssetStatus = {
  mp4: boolean;
  captions: boolean;
  poster: boolean;
  /** True when the player can render a real native video element */
  ready: boolean;
};

function assetExists(publicPath: string): boolean {
  const relative = publicPath.replace(/^\//, "");
  return fs.existsSync(path.join(process.cwd(), "public", relative));
}

/**
 * Server-only check for self-hosted video assets.
 * Missing assets must never be treated as a silent empty player in production.
 */
export function getVideoAssetStatus(): VideoAssetStatus {
  const { video } = siteConfig;
  const mp4 = assetExists(video.mp4Path);
  const captions = assetExists(video.captionsPath);
  const poster = assetExists(video.posterPath);

  return {
    mp4,
    captions,
    poster,
    ready: mp4,
  };
}

export function isProductionAssetEnforcement(): boolean {
  return (
    process.env.REQUIRE_VIDEO_ASSETS === "1" ||
    process.env.VERCEL_ENV === "production"
  );
}
