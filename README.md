# Standout Group — Legal Enquiry Review landing page

Outreach microsite for converting cold-outreach visitors into free Legal Enquiry Review requests.

**Production domain:** https://standoutgroup.net  
**Canonical route:** `/`

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- Zod (shared request validation)

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Copy `.env.example` to `.env.local`. Without `N8N_WEBHOOK_URL` / `N8N_WEBHOOK_SECRET`, local submissions are accepted in development only (no sheet/email).

## Configuration

Editable business identity, proof line, video paths and optional delivery timing live in `lib/site-config.ts`.  
Page copy lives in `lib/landing-copy.ts`.

## Review request workflow

- Browser posts to `POST /api/review-request` (same-origin only).
- Server validates, anti-spam checks, signs the payload, and forwards to n8n.
- n8n upserts the dedicated **Enquiry Reviews** sheet and sends confirmation + internal emails.
- Workflow contract and sheet columns: `ops/n8n-enquiry-reviews.workflow.json`.

## Analytics and attribution

- Events fire through `lib/analytics.ts` (sanitised props; `lead_id` is the only lead identifier).
- UTMs persist in session storage and are attached to the review request payload.
- Optional Plausible: set `NEXT_PUBLIC_ANALYTICS_PROVIDER=plausible` and `NEXT_PUBLIC_ANALYTICS_DOMAIN`.
- Commercial funnel formulas: `ops/commercial-funnel-metrics.json`.

## Launch checks

```bash
npm run check:launch   # video assets + secrets + copy audit
npm run build          # production build (prebuild runs video + secrets checks)
```

Launch readiness report: `ops/launch-readiness.json`  
Open business blockers: `ops/launch-checklist.json`

## Video assets

Place the final MP4 and WebP poster in `public/video/`. Draft captions and transcript are already present. Production builds fail if assets are missing when `VERCEL_ENV=production` or `REQUIRE_VIDEO_ASSETS=1`.

## Phase status

- Phases 1–6 engineering complete
- Launch still blocked on final media, privacy/legal identity values, and live n8n/sheet/email — see `ops/launch-checklist.json`
