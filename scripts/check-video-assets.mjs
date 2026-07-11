#!/usr/bin/env node
/**
 * Fails production/enforced builds when required video assets are missing.
 * Local and preview builds warn only, so development can proceed without final media.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const videoDir = path.join(root, "public", "video");

const required = [
  "legal-enquiry-review.mp4",
  "legal-enquiry-review-captions.vtt",
  "legal-enquiry-review-poster.webp",
];

const enforce =
  process.env.REQUIRE_VIDEO_ASSETS === "1" ||
  process.env.VERCEL_ENV === "production";

const missing = required.filter(
  (file) => !fs.existsSync(path.join(videoDir, file)),
);

if (missing.length === 0) {
  console.log("[video-assets] All required video assets present.");
  process.exit(0);
}

const message = `Missing video assets in public/video/: ${missing.join(", ")}`;

if (enforce) {
  console.error(`[video-assets] ${message}`);
  console.error(
    "[video-assets] Production builds require the final MP4, captions and poster.",
  );
  process.exit(1);
}

console.warn(`[video-assets] ${message}`);
console.warn(
  "[video-assets] Development placeholder will render until assets are added.",
);
process.exit(0);
