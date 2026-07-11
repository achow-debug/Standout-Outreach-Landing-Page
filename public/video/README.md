# Video assets (Phase 2+)

Required production files in this folder:

| File | Purpose |
|---|---|
| `legal-enquiry-review.mp4` | Self-hosted five-minute breakdown |
| `legal-enquiry-review-captions.vtt` | WebVTT captions (draft outline captions are present) |
| `legal-enquiry-review-poster.webp` | Lightweight 16:9 poster (target under 150KB) |

## Behaviour

- **Non-production:** If the MP4 is missing, the page shows a clearly labelled development placeholder. It does not pretend a video is available.
- **Production / enforced:** `npm run build` fails when assets are missing (`VERCEL_ENV=production` or `REQUIRE_VIDEO_ASSETS=1`).

```bash
npm run check:video
REQUIRE_VIDEO_ASSETS=1 npm run check:video
```

## Player requirements (implemented)

- Native HTML5 `<video>` with `controls`, `playsInline`, `preload="metadata"`
- No autoplay
- Captions via `<track kind="captions">`
- 16:9 `aspect-ratio` to prevent layout shift
- Playback-error fallback with an accessible direct MP4 link
- Play / progress (25/50/75/90) / complete events once per session
