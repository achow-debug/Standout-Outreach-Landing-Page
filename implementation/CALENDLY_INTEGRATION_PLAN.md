# Calendly Embed Integration Plan

**Status:** Plan only — no code changes until this document is approved  
**Created:** 2026-08-15  
**Goal:** Let visitors book a free strategy call from the existing **Claim My Free Strategy Call** CTAs using a **Calendly embed only** (no Scheduling API). Event types, invitee questions, and locations stay in Calendly. This site hosts a branded booking surface and a fallback if the widget fails to load.

---

## 0. Repo facts this plan is tailored to

| Fact | Detail |
|---|---|
| Framework | **Next.js 15 App Router** (`app/`), React 19, TypeScript |
| Styling | **Tailwind CSS v4** + custom tokens in `app/globals.css` |
| Hosting | **Vercel** (`prebuild` runs `scripts/check-secrets.mjs` + video checks) |
| Routes | `/` (landing) and `/privacy`. Almost no client-side route churn, but `/privacy` is a real navigation. |
| Primary CTAs | Desktop `#final-cta` (`hidden md:block`) and mobile sticky dock — both call `openModal()` in `ReviewRequestShell` |
| Current conversion | Native `<dialog>` containing `ReviewRequestForm` → `POST /api/review-request` → n8n |
| Analytics | Plausible via `lib/analytics.ts`; **no first-party cookie banner** (Plausible is cookieless) |
| CSP | Strict in `next.config.ts`: `default-src 'self'`, **no `frame-src`**, so Calendly iframes are **blocked today** |
| Admin UI | None on this site — keep it that way |

Brand colours already in CSS (hex, no `#` for Calendly query params):

| Token | Hex | Suggested Calendly param |
|---|---|---|
| `--color-accent` | `6b2c5f` | `primary_color` (matches brand mark + mobile CTA) |
| `--color-ink` | `0f172a` | `text_color` |
| `--color-surface` | `ffffff` | `background_color` |
| `--color-bg` | `f8fafc` | page canvas only — do not pass as widget background (widget sits on white modal) |

Calendly **cannot** use Source Sans 3, border-radius tokens, or any CSS inside the iframe. Branding is colour + surrounding chrome only.

---

## (a) Recommended embed approach

### Recommendation: Advanced JS embed (`widget.js` + `initInlineWidget`) inside the existing modal

**Primary flow (ship this):**

1. Visitor clicks **Claim My Free Strategy Call** (desktop inline or mobile sticky — unchanged labels).
2. Existing `ReviewRequestShell` `<dialog>` opens (existing scroll lock, `html.modal-open`, sticky-CTA suppression, focus restore).
3. Modal body mounts a **client-only** Calendly inline widget (`Calendly.initInlineWidget`) into a reserved-height container.
4. `widget.js` loads **on first CTA click**, not on initial page load.

**Optional alternative (flag, not default):** `Calendly.initPopupWidget` from the same CTA, skipping our modal. Use only if inline-in-modal fails UX QA (height/Safari). Do not run both overlays at once.

### Why advanced JS embed, not a raw iframe

| Need | Raw `<iframe src="https://calendly.com/...">` | Advanced JS (`widget.js`) |
|---|---|---|
| Brand query params (`primary_color`, `text_color`, `background_color`, `hide_gdpr_banner`) | Yes (URL query) | Yes |
| Invitee questions configured in Calendly | Yes (iframe shows event type) | Yes |
| Prefill `name` / `email` / custom answers later | Awkward URL encoding | First-class `prefill` + `customAnswers` |
| Listen for `calendly.event_scheduled` (analytics, close modal) | Manual `postMessage` parsing | Documented `CalendlyEvent` / message API |
| Same loader for inline **and** popup | No | Yes |
| On-demand script, cleanup on unmount | DIY | Still DIY, but one supported surface |
| Extra request (`widget.js` + `widget.css`) | Avoided | One extra third-party script — **acceptable if deferred until CTA click** |

A bare iframe is a valid **fallback** (see rollout). It is not the primary implementation because we will want scheduled-event analytics and optional prefill without a rewrite.

### Why inline-in-our-modal, not an always-visible in-page widget

The landing layout fights a page-level inline scheduler:

- `#final-cta` is **hidden on mobile**; conversion is the sticky dock.
- Sticky dock + a tall in-page Calendly iframe would double the CTA and cause layout shift.
- The modal already owns a11y, backdrop, and `inert` behaviour.

So “inline embed on the CTA button” here means: **CTA click → branded dialog → Calendly inline widget**, not a widget sitting on the page at all times.

### Explicit non-goals

- No Calendly Scheduling API, OAuth, or server-side event-type listing.
- No admin panel, no event-type picker, no question builder on this site.
- Single event-type URL (env var; placeholder OK until the live Calendly link exists).
- Do not replace Calendly’s internals with custom CSS.

---

## (b) Step-by-step tasks (checkable)

### Phase 0 — Calendly account (outside the repo)

- [ ] Create / confirm one **event type** (e.g. 20-minute strategy call) and copy its public URL (`https://calendly.com/<slug>/<event>`).
- [ ] Set duration, timezone handling (UK / Europe-London default if most invitees are UK), and location (Zoom / phone / Google Meet) **inside Calendly**.
- [ ] Add **Invitee questions** in Calendly to match current qualification intent:
  - Built-in: **Name**, **Email** (treat email as work email in the question helper text).
  - Custom: **Firm website** (required).
  - Custom (recommended): **Prioritised area of law** (same options as `AREA_OF_LAW_OPTIONS` in `lib/landing-copy.ts`), unless the call itself will cover this.
- [ ] Confirm notification emails / calendar invites in Calendly (this site will not send booking mail unless n8n is wired later).
- [ ] Note question **order** — Calendly prefill `a1`, `a2`, … maps by order, not by label.

### Phase 1 — Config and CSP (blocking)

- [ ] Add `lib/calendly-config.ts` reading public env + brand colour map (see §d).
- [ ] Add empty placeholders to `.env.example` (URL only; no secrets).
- [ ] Set the same vars in **Vercel Preview** and **Production**.
- [ ] Widen CSP in `next.config.ts` just enough for Calendly (see §d). Without this, the widget is a blank box.
- [ ] Confirm `Cross-Origin-Opener-Policy: same-origin` still works with **inline iframe**. If popup mode is enabled later and Safari breaks, document COOP as the first suspect.

### Phase 2 — Client embed component

- [ ] Add `components/landing/calendly-embed.tsx` (`"use client"`).
- [ ] Load `https://assets.calendly.com/assets/external/widget.js` **once**, only after the modal opens (dynamic `<script>`, not in `app/layout.tsx`).
- [ ] Optionally load `widget.css` only if popup mode is used; inline mode does not need the floating-badge CSS.
- [ ] Guard `window` / `document` so the component never runs during SSR.
- [ ] Call `Calendly.initInlineWidget({ url, parentElement, prefill?, utm? })` after the script `load` event.
- [ ] Destroy / empty the parent node on unmount and on dialog `close` so `/privacy` navigation and reopen do not duplicate iframes.
- [ ] Reserve min-height (e.g. 650–700px desktop, ~100dvh-aware on mobile) **before** the iframe paints to avoid CLS.
- [ ] Show a skeleton / “Loading calendar…” state; after timeout (e.g. 8s) show fallback link (Phase 6).

### Phase 3 — Wire CTAs (keep one booking flow)

- [ ] Keep `ReviewRequestCta` and `MobileStickyCta` click handlers; they already call `openModal`.
- [ ] In `ReviewRequestShell`, when Calendly is enabled, render `CalendlyEmbed` instead of `ReviewRequestForm` (and skip the current success-from-API state for that path).
- [ ] Keep modal heading from `landingCopy.reviewRequest.heading` (“Claim your free strategy call”).
- [ ] Feature flag: if URL missing / flag off, keep today’s form (safe rollback).
- [ ] Do **not** add a second visible “Book on Calendly” button on the page.

### Phase 4 — Branding params

- [ ] Append embed params (hex **without** `#`):
  - `primary_color=6b2c5f`
  - `text_color=0f172a`
  - `background_color=ffffff`
  - `hide_landing_page_details=1` (event type already chosen)
  - `hide_event_type_details=1` only if the modal heading already states what they are booking; otherwise leave details visible for trust.
- [ ] `hide_gdpr_banner`: **default `0` (show banner)** for UK launch. Revisit only after privacy copy names Calendly as a processor (see §Security).
- [ ] Document in a short comment that iframe CSS cannot match `--radius-md` or Source Sans 3.

### Phase 5 — Analytics (no PII)

- [ ] Subscribe to Calendly `message` events; on `calendly.event_scheduled` fire a new allowlisted event e.g. `calendly_event_scheduled`.
- [ ] Props: `cta_location`, `device_category`, attribution UTMs already captured in `lib/attribution.ts`. **Never** send name, email, website, or event UUID if it could be treated as PII in Plausible.
- [ ] Keep existing `review_cta_open` on modal open.
- [ ] Do not send invitee answers to Plausible.

### Phase 6 — Reliability, fallback, privacy copy

- [ ] Fallback UI inside the modal: “Open the calendar in a new tab” using the same event URL (`rel="noopener noreferrer"`).
- [ ] If script blocked (adblocker), show fallback immediately after timeout — do not leave an empty dialog.
- [ ] Update `landingCopy.privacyPage` + `siteConfig.privacy.processors` to include **Calendly**.
- [ ] Update collect-body copy: booking data is entered **in Calendly**, not only via `/api/review-request`.
- [ ] Decide form deprecation: flagged off when Calendly is live; keep API route for rollback, do not delete in the first PR.

### Phase 7 — QA and rollout

- [ ] Walk §e checklist on Preview.
- [ ] Enable production env URL; confirm CSP headers on the live response (`curl -I`).
- [ ] Optional: `NEXT_PUBLIC_CALENDLY_EMBED_MODE=popup` on Preview only to A/B the alternative.

---

## (c) Files / components to add or modify

Paths are from the repo root.

### Add

| Path | Role |
|---|---|
| `lib/calendly-config.ts` | Public event URL, embed mode, colour strings, `hide_gdpr_banner`, `isCalendlyEnabled()`. Safe for client bundles (`NEXT_PUBLIC_*` only). |
| `components/landing/calendly-embed.tsx` | Client widget host: script load, `initInlineWidget` / optional popup, skeleton, timeout fallback, message listener, cleanup. |
| `types/calendly.d.ts` (optional) | Minimal `window.Calendly` typings so we do not use `any`. |

### Modify

| Path | Change |
|---|---|
| `next.config.ts` | CSP: `frame-src`, `script-src`, `style-src`, `connect-src`, `img-src` for Calendly (and Recaptcha if Calendly still frames Google). |
| `.env.example` | Document `NEXT_PUBLIC_CALENDLY_EVENT_URL`, `NEXT_PUBLIC_CALENDLY_ENABLED`, `NEXT_PUBLIC_CALENDLY_EMBED_MODE`, `NEXT_PUBLIC_CALENDLY_HIDE_GDPR_BANNER`. |
| `lib/site-config.ts` | Add `calendly` colour defaults (or re-export from `calendly-config`); add `"Scheduling (Calendly)"` to `privacy.processors`. |
| `lib/landing-copy.ts` | Modal helper line under heading (optional); fallback link label; privacy intro/collect text for booking-in-Calendly. |
| `components/landing/review-request-cta.tsx` | `ReviewRequestShell` body: Calendly vs form based on flag; keep CTA buttons as-is. |
| `app/globals.css` | `.calendly-embed-host` min-height, overflow, reduced-motion (no extra animation); modal body scroll for tall widget on small screens. |
| `lib/analytics.ts` | Add `calendly_event_scheduled` (and optionally `calendly_embed_error`) to `AnalyticsEventName` + allowlist. |
| `app/privacy/page.tsx` | Only if metadata/description still says “form” only — align with booking widget. |
| `ops/launch-checklist.json` | New items: Calendly URL, CSP, Preview booking, privacy processor. |
| `README.md` | One short subsection: booking is Calendly embed; event URL is env; questions live in Calendly. |
| `scripts/check-secrets.mjs` | No change required if we only add `NEXT_PUBLIC_CALENDLY_*` (public URL is not a secret). Do **not** put webhook signing secrets in client env. |

### Leave unchanged in the first implementation

| Path | Why |
|---|---|
| `components/landing/review-request-form.tsx` | Rollback path while flag is off. |
| `app/api/review-request/route.ts` | Same. |
| `lib/review-request-service.ts` | n8n remains for the form path; Calendly webhooks are a future paid upgrade. |
| `app/layout.tsx` | Do **not** add Calendly `next/script` globally (hurts LCP / TBT). |

### Exact CTA touchpoints (do not add new ones)

- `ReviewRequestCta` — `components/landing/review-request-cta.tsx` (`#final-cta`)
- `MobileStickyCta` — same file
- Shell / dialog — `ReviewRequestShell` in the same file
- Page composition — `app/page.tsx` (already wraps both in `ReviewRequestShell`)

---

## (d) Environment / config

### Vercel + `.env.local`

| Variable | Public? | Purpose |
|---|---|---|
| `NEXT_PUBLIC_CALENDLY_EVENT_URL` | Yes | Full event-type URL. Placeholder: `https://calendly.com/your-org/strategy-call` |
| `NEXT_PUBLIC_CALENDLY_ENABLED` | Yes | `1` / `true` to swap form → widget. Omit or `0` = current form. |
| `NEXT_PUBLIC_CALENDLY_EMBED_MODE` | Yes | `inline` (default) or `popup` (optional alternative). |
| `NEXT_PUBLIC_CALENDLY_HIDE_GDPR_BANNER` | Yes | `0` default; `1` only after legal sign-off. |

Event URL is **not** a secret (it is the public booking page). Still keep it in env so Preview and Production can point at different Calendly event types (e.g. internal test vs live).

Brand colours stay in **code** (`lib/calendly-config.ts` mirroring `app/globals.css`), not env, unless design starts A/B testing palettes.

### CSP additions (`next.config.ts`)

Today `frame-src` is unset, so it falls back to `default-src 'self'`. Minimum widen:

```
script-src  'self' 'unsafe-inline' https://plausible.io https://assets.calendly.com
style-src   'self' 'unsafe-inline' https://assets.calendly.com
frame-src   https://calendly.com https://www.google.com
img-src     'self' data: blob: https://*.calendly.com https://calendly.com
connect-src 'self' https://plausible.io https://calendly.com https://api.calendly.com
font-src    'self' data: https://assets.calendly.com
```

**Verify in a real booking**, not just the spinner: Calendly sometimes frames Google Recaptcha (`https://www.google.com` / `https://www.gstatic.com`). If the widget loads but submit hangs, add those hosts rather than switching to `*`.

Do not use `unsafe-eval` unless a staging capture proves Calendly requires it (it should not for the official embed).

### Prefill mapping (implement later, types now)

Calendly built-ins vs our current form:

| On-site field (future pre-step) | Calendly |
|---|---|
| Name | `prefill.name` |
| Work email | `prefill.email` |
| Firm website | `prefill.customAnswers.a1` (or whichever index the website question occupies) |

Do **not** require a pre-step form in v1. Export a `CalendlyPrefill` type and pass `undefined`.

---

## (e) QA checklist

### Functional

- [ ] Desktop CTA opens modal; Calendly date picker is usable; booking completes; Calendly confirmation shows.
- [ ] Mobile sticky CTA: same, with modal filling the viewport; iframe scrolls inside modal body; sticky dock hidden/`inert` while open.
- [ ] Reopen after close: one iframe only; previous month/state not required to persist.
- [ ] `/privacy` then back: no leftover Calendly listeners or duplicate scripts causing errors.
- [ ] Fallback link opens the same event type in a new tab and is keyboard-reachable.
- [ ] Feature flag off: original form + n8n path still works.
- [ ] Timezone: browser TZ shown correctly; a UK slot is the slot that lands on the calendar (test with OS TZ set to `Europe/London` and to `America/New_York`).
- [ ] Invitee questions: name, email, firm website (and area of law if configured) appear **in the embed**, not only on calendly.com.
- [ ] Location (Meet/Zoom/phone) matches Calendly event settings on the confirmation screen.

### Browsers / devices

- [ ] Chrome latest (macOS)
- [ ] Safari latest (macOS) — third-party cookies / iframe height
- [ ] iOS Safari (sticky dock + `dvh` / visual viewport when keyboard opens on email field)
- [ ] Android Chrome
- [ ] Reduced motion: no extra motion from our skeleton; Calendly internals are out of scope

### Performance

- [ ] Landing LCP unchanged: **no** Calendly script in the initial HTML/`layout`.
- [ ] Network panel: `widget.js` appears only after CTA click.
- [ ] Reserved min-height: no large layout jump when iframe appears.
- [ ] Lighthouse (mobile, Preview): note TBT/CLS delta vs current; target “no regression on first load”.

### Blockers / privacy

- [ ] Adblocker (uBlock Origin default): timeout → fallback link, not an infinite skeleton.
- [ ] Strict Tracking Prevention (Safari): widget still books **or** fallback is obvious.
- [ ] Calendly GDPR / cookie banner: visible when `hide_gdpr_banner=0`; document screenshot for legal.
- [ ] This site still has **no** first-party cookie banner; confirm that is still acceptable once Calendly’s iframe may set **third-party** cookies (see §Security).
- [ ] CSP: no console `Refused to frame` / `Refused to load script` on a successful booking.

### Accessibility

- [ ] Focus moves into the dialog on open; Escape / close restores the CTA (already implemented — do not regress).
- [ ] Iframe has a title, e.g. `Book a free strategy call`.
- [ ] Keyboard: tab into Calendly controls (best-effort; Calendly owns the iframe).

---

## (f) Rollout plan

```
Preview (Vercel)
  NEXT_PUBLIC_CALENDLY_ENABLED=1
  NEXT_PUBLIC_CALENDLY_EVENT_URL=<test event type>
        ↓ QA §e
Production
  Same flags + live event URL
        ↓
Kill switch: set ENABLED=0 (or unset URL) → form path returns
```

### Feature flag

Treat **enabled + non-empty URL** as the flag. No extra admin UI. Preview and Production can differ.

### Staging verification

1. Book a throwaway slot on the Preview URL.
2. Confirm Calendly email / calendar invite (Calendly-side).
3. Confirm Plausible (or dev `console.info`) saw `review_cta_open` and `calendly_event_scheduled` with **no** email/name.
4. `curl -I` production/Preview and read CSP.

### Fallback if Calendly fails to load

| Failure | Visitor sees |
|---|---|
| Script/iframe blocked or timeout | Message + “Open calendar in new tab” |
| Env URL missing | Do not open an empty modal; keep the existing form **or** disable CTA with internal logging — prefer **keep form** |
| Calendly.com outage after iframe load | New-tab fallback still works if Calendly is up; if Calendly is down, show the same message and optional `mailto:` to `siteConfig.contactEmail` |

Do not auto-submit anything to n8n from a Calendly booking in v1 (no API, no webhook on free embed).

### Suggested PR split

1. CSP + config + dead embed component behind flag (flag off in Production).
2. Wire modal + analytics + privacy copy; enable on Preview.
3. Enable Production after one real test booking.

---

## (g) Future upgrades

Out of scope for v1; do not build now.

### Prefill from a small on-site pre-step

Re-introduce a short form (name, work email, firm website) in the modal **above** or **before** the widget. On continue, call `initInlineWidget` with:

```ts
prefill: {
  name,
  email: workEmail,
  customAnswers: { a1: firmWebsite /* confirm index in Calendly */ },
}
```

Keep the widget as the commit step. Do not POST those fields to `/api/review-request` unless product still wants a Sheets row before a slot is chosen.

### UTM / attribution into Calendly

`initInlineWidget` accepts `utm: { utmCampaign, utmSource, utmMedium, utmContent, utmTerm }`. Map from `lib/attribution.ts` (`ensureAttributionCaptured()`). Useful for Calendly’s own reports; still do not send PII to Plausible.

### Tracking

- `calendly.date_and_time_selected` / `calendly.event_type_viewed` if funnel drop-off matters.
- Tie `cta_location` (`inline_desktop` | `sticky_mobile`) through to scheduled event.

### Webhooks / Scheduling API (paid Calendly)

If the plan is upgraded later:

- Calendly **webhook** `invitee.created` → n8n (replace or complement the form webhook).
- Then this site can stop asking duplicate questions.
- Still **no** Scheduling API required for the landing page if the embed remains the UI.
- Signing secrets stay **server-only** (same pattern as `N8N_WEBHOOK_SECRET`); never `NEXT_PUBLIC_*`.

### Dual-write / CRM

n8n can upsert Sheets from Calendly webhooks later. Until then, **Calendly is the system of record for bookings**; the existing form/n8n path is only the flag-off fallback.

---

## Security / privacy (v1)

### What data is passed by this site

| Direction | Data |
|---|---|
| Site → Calendly iframe (v1) | Event URL, colour params, optional `hide_gdpr_banner`. **No** name/email/website unless we add prefill later. |
| Visitor → Calendly | Whatever Calendly asks (name, email, custom questions, timezone). Processed by Calendly as a **processor / sub-processor** — disclose in `/privacy`. |
| Site → Plausible | Behavioural events only (`review_cta_open`, `calendly_event_scheduled`). Blocked keys in `lib/analytics.ts` already forbid email/name/website. |
| Site → n8n | **None** on the Calendly path. |

### GDPR banner

Calendly can show its own cookie/GDPR banner inside the iframe. For a UK law-firm audience:

- **v1 default:** leave the banner on (`hide_gdpr_banner` unset or `0`).
- Hiding it is “appropriate” only if legal confirms: (1) Calendly is named as a processor, (2) PECR/cookie use of the embed is covered, (3) hiding does not strip a consent Calendly still requires.

This microsite currently has **no** site-wide cookie banner because Plausible is cookieless. The Calendly iframe may still set **Calendly cookies** in a third-party context. That is a legal review item, not an engineering skip.

### Cookies / storage

- `widget.js` is third-party JavaScript from `assets.calendly.com`.
- Booking UI runs on `calendly.com` in an iframe (third-party).
- Safari ITP may limit those cookies; booking usually still works; QA both.
- Do not store invitee PII in `sessionStorage` unless a future pre-step needs it, and never send it to analytics.

### XSS / URL safety

- Allow only `https://calendly.com/` URLs in `calendly-config` (reject other hosts) so a bad env value cannot become an open iframe.
- `rel="noopener noreferrer"` on the fallback link.

---

## Branding limitations (set expectations)

Calendly embed customisation is **query params only**:

- Can: primary / text / background colour, hide some chrome, hide GDPR banner.
- Cannot: custom fonts (Source Sans 3), button radius, plum hover (`--color-accent-hover`), layout of time slots, or CSS overrides inside the iframe.

Our modal header (brand mark + heading + close) is the main brand wrap. The calendar will still look like Calendly with plum accents.

---

## Success criteria

- One primary path: **Claim My Free Strategy Call** → modal → Calendly inline embed → booked slot.
- Optional popup mode exists behind `NEXT_PUBLIC_CALENDLY_EMBED_MODE=popup` but is not the default.
- Event types and questions are edited **only** in Calendly.
- First-load Lighthouse is not paying for `widget.js`.
- CSP allows Calendly without `*`.
- Kill switch restores the existing form.
- Privacy notice lists Calendly; analytics never receive invitee fields.
