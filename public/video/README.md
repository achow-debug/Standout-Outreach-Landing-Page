# Video assets (Phase 2+)

Required production files in this folder:

| File | Purpose |
|---|---|
| `legal-enquiry-review.mp4` | Self-hosted breakdown video |
| `legal-enquiry-review-captions.vtt` | WebVTT captions |
| `legal-enquiry-review-poster.webp` | Real 16:9 poster preview (target under 150KB) — not a flat gradient |

## Behaviour

- **Non-production:** If the MP4 is missing, the page shows a clearly labelled unavailable state. It does not pretend a finished thumbnail is present.
- **Production / enforced:** `npm run build` fails when assets are missing (`VERCEL_ENV=production` or `REQUIRE_VIDEO_ASSETS=1`).

```bash
npm run check:video
REQUIRE_VIDEO_ASSETS=1 npm run check:video
```

## Player requirements (Phase 4)

- Responsive `16:9` frame with large radius, restrained border and soft shadow
- Custom centred purple play control (`Play the full breakdown`) until playback starts
- Native HTML5 controls after playback starts
- `playsInline`, `preload="metadata"`, no autoplay
- Captions via `<track kind="captions">` when the VTT is present
- Aspect-ratio reserved to prevent layout shift
- Playback-error fallback with an accessible direct MP4 link
- Play / progress (25/50/75/90) / complete events once per session
- No transcript link, duration badge or decorative text overlay
