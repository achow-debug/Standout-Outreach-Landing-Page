# Video assets (Phase 2+)

Required production files in this folder:

| File | Public URL | Purpose |
|---|---|---|
| `breakdown.mp4` | `/video/breakdown.mp4` | Self-hosted breakdown video |
| `poster.jpg` | `/video/poster.jpg` | Real 16:9 poster preview (target under 150KB) |
| `legal-enquiry-review-captions.vtt` | `/video/legal-enquiry-review-captions.vtt` | WebVTT captions |

## Where to upload

Drop the encoded files into **this folder** (`public/video/`) using the exact filenames above:

```
public/video/breakdown.mp4
public/video/poster.jpg
```

Next.js serves anything in `public/` from the site root, so those files become `/video/breakdown.mp4` and `/video/poster.jpg`. Commit them with the repo (or Git LFS if the MP4 is large), then redeploy.

Do not commit invented placeholder MP4/JPEG binaries that fake production readiness.

Then re-run:

```bash
npm run check:video
npm run check:launch
```

Until those files exist, `ops/launch-readiness.json` correctly reports `launch_ready: false` with the missing-asset blockers.

## Behaviour

- **Facade:** The player shows `poster.jpg` and a play overlay. The MP4 is not requested until play is clicked.
- **After play:** The facade swaps to a native `<video>` (`controls`, `autoPlay`, `playsInline`, `preload="metadata"`) in a reserved 16:9 frame.
- **Load error:** If the MP4 fails, a fallback message and a direct file link are shown instead of a broken player.
- **Production / enforced:** `npm run build` fails when assets are missing (`VERCEL_ENV=production` or `REQUIRE_VIDEO_ASSETS=1`).

```bash
npm run check:video
REQUIRE_VIDEO_ASSETS=1 npm run check:video
```
