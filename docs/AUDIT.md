# Codebase audit

Recorded on branch `cred_improvements` before the mobile-optimisation tasks. No application code was changed for this audit.

## Stack

- **Next.js 15.5.20** (package range `^15.5.2`). **App Router** (`app/`). There is no `pages/` directory.
- **Route handlers are available.** `next.config.ts` does not set `output: 'export'`. The existing handler is `POST` logic in `app/api/review-request/route.ts` (`runtime = "nodejs"`). A later `POST /api/dpa-request` can live beside it.
- **React 19.1.** TypeScript 5.9.
- **Tailwind CSS 4.3.2** via `@tailwindcss/postcss` (`@import "tailwindcss"` in `app/globals.css`). There is no `tailwind.config.*`. Theme tokens are CSS variables on `:root`, exposed to utilities in the `@theme inline` block in `app/globals.css`.
- **Fonts:** Geist and Geist Mono from `next/font/google` in `app/layout.tsx`, assigned to `--font-geist` and `--font-geist-mono`.

### Routes

| Route | File |
| --- | --- |
| `/` | `app/page.tsx` |
| `/privacy` | `app/privacy/page.tsx` |
| `/compliance` | `app/compliance/page.tsx` |
| `POST /api/review-request` | `app/api/review-request/route.ts` |

`/legal-enquiry-review` and `/legal-enquiry-journey-review` redirect to `/`.

## Colours and type

Defined in `app/globals.css` unless noted.

| Token | Exact value | Role |
| --- | --- | --- |
| `--color-ink` / `--official-band-dark` | `#0f172a` | Navy background (footer, dark bands, final CTA) |
| `--official-headline-ink` | `#020617` | Darkest heading ink on light sections |
| `--color-accent` | `#4f3192` | Logo purple. Also the light-background primary button |
| `--color-accent-hover` | `#462c82` | Purple button hover |
| `--color-accent-soft` | `#f0edf7` | Existing soft purple wash (not the plan's `#EEEAFB`) |
| `--official-accent-on-dark` | `#c4b5fd` | Lavender hero button (`btn-primary btn-on-dark`) and lavender text on navy |
| `--official-accent-on-dark-hover` | `#b7a4fc` | Lavender button hover |
| `--color-ink-muted` | `#334155` | Secondary text |
| `--color-ink-quiet` / `--official-headline-muted` | `#64748b` | Quieter grey (kickers, muted headlines) |
| `--official-muted-on-dark` | `#cbd5e1` | Muted text on navy (footer body) |
| `--color-bg` | `#f8fafc` | Page canvas |
| `--official-band-tint` | `#f1f5f9` | Light section wash |
| `--color-line` | `#e2e8f0` | Hairline borders |

The comment above `.t-label--on-dark` already records that `#4f3192` fails contrast on navy, which is why on-dark accents use `#c4b5fd`.

### Tailwind tokens added in task 1.1

Registered in the official `:root` block and in `@theme inline`, so these utilities exist: `bg-brand-purple`, `text-brand-purple`, `bg-brand-lavender`, `text-brand-lavender`, `bg-brand-lavender-tint`, `text-muted`. `text-ink` and `bg-ink` already came from `--color-ink`.

| Token | Value | Source |
| --- | --- | --- |
| `brand-purple` | `#4f3192` | `--color-accent` (logo purple) |
| `brand-lavender` | `#c4b5fd` | `--official-accent-on-dark` (hero button) |
| `brand-lavender-tint` | `#eeeafb` | New. Pills and highlighted cells on light backgrounds |
| `ink` | `#0f172a` | Existing `--color-ink`. Not retargeted: custom CSS uses it as the navy band colour |
| `muted` | `#334155` | Existing `--color-ink-muted`, which is also the body text colour |

Light-section headings use `--official-headline-ink` (`#020617`), which is darker than `ink`. `ink` was left on `#0f172a` so the navy bands do not shift.

`muted` (`#334155`) on text under 18px, contrast against every light background on the page plus the new tint. No darkening was required.

| Background | Hex | Contrast | AA 4.5:1 |
| --- | --- | --- | --- |
| White (comparison, compliance) | `#ffffff` | 10.35:1 | Pass |
| Page canvas | `#f8fafc` | 9.90:1 | Pass |
| Who it's for band | `#f1f5f9` | 9.45:1 | Pass |
| Existing purple wash | `#f0edf7` | 8.96:1 | Pass |
| New lavender tint | `#eeeafb` | 8.78:1 | Pass |

The quieter kicker grey `--color-ink-quiet` (`#64748b`) is not the `muted` token. It passes on white (4.76:1) and the canvas (4.55:1), and fails on the Who it's for band (4.34:1), the purple wash (4.12:1), and the lavender tint (4.03:1). Left unchanged here. Task 12.4 is the contrast sweep for that grey.

Heading scale already in use (do not replace blindly; Task 1.3 says to adjust to this scale):

- H1 `.t-display`: `clamp(2.5rem, 1.6rem + 4vw, 4.25rem)`, `text-wrap: balance`
- H2 `.t-h2`: `clamp(2rem, 1.5rem + 2.2vw, 3rem)`, `text-wrap: balance`
- Who it's for H2 `.t-h2-feature`: `clamp(2.25rem, 1.5rem + 3vw, 3.5rem)`
- Body `.t-body`: `text-wrap: pretty`

Section kickers use `.t-kicker`: Geist Mono, 12px, `letter-spacing: 0.06em`, colour `--color-ink-quiet`. On dark bands, `.t-kicker--on-dark` is `rgb(248 250 252 / 60%)`.

`viewport-fit=cover` is already set: `export const viewport` in `app/layout.tsx` includes `viewportFit: "cover"`.

## Landing page, in render order

`app/page.tsx` wraps the page in `ReviewRequestShell` (`components/landing/review-request-cta.tsx`) and `BookingProvider` (`components/official/booking-provider.tsx`). Copy for these sections lives in `lib/official-copy.ts`, except the footer paragraphs, which come from `lib/landing-copy.ts`.

| Order | Section | Component | Element id |
| --- | --- | --- | --- |
| 1 | Header | `components/official/site-header.tsx` | — |
| 2 | Hero | `components/official/official-hero.tsx` | `top` (CTA button `hero-cta`) |
| 3 | Trust badges (ICO / SRA) | `components/official/trust-badges.tsx` | — |
| 4 | Proof / results strip | `components/official/proof-strip.tsx` | — |
| 5 | Reviews | `components/official/what-partners-say.tsx` | `partners` |
| 6 | Who it's for | `components/official/who-its-for.tsx` | `who-its-for` |
| 7 | How it works | `components/official/how-it-works.tsx` | `how-it-works` |
| 8 | Comparison | `components/official/agency-comparison.tsx` | `agency-comparison` |
| 9 | Compliance (COLP) | `components/official/colp-peace-of-mind.tsx` | `colp` |
| 10 | Founder | `components/official/meet-the-founder.tsx` | `founder` |
| 11 | FAQs | `components/official/faq.tsx` | `faq` |
| 12 | Final CTA (also the thank-you state) | `components/official/final-cta.tsx` | `book` |
| 13 | Footer | `components/landing/site-footer.tsx` | `site-footer` |
| 14 | Sticky CTA (outside `<main>`) | `components/official/sticky-cta.tsx` | — |

**Founder exists** (`#founder`). **FAQ exists** (`#faq`, not `#faqs`).

Current FAQ questions, in order, from `officialCopy.faq.items`:

1. `existing-setup` — We already have a website and a marketing agency. Where does this fit?
2. `sra-obligations` — Will this affect our SRA obligations?
3. `time` — How much time will this take from me or my team?
4. `enquiry-data` — What happens to our enquiry and client data during the pilot?
5. `after-30-days` — What happens after the 30 days?
6. `the-call` — What happens on the conversation?

The FAQ is a hand-rolled multi-open accordion (`useState<string[]>`). Several items can be open at once. It sets `aria-expanded` and `aria-controls`. It does not open from a URL hash. Item DOM ids are generated with `useId()`, so they are not stable hashes.

Who it's for and How it works both use the monospace `.t-kicker` eyebrow.

## UI primitives and motion

Nothing from Radix, shadcn/ui, vaul, Headless UI, or Framer Motion is installed. `package.json` dependencies are Next, React, Zod, and the Vercel Analytics / Speed Insights packages.

Existing UI is hand-rolled:

- `components/landing/info-dialog.tsx` — native `<dialog>` with `showModal()`, Escape and backdrop close, and focus return. Used as footer info panels. It is a centred dialog, not a bottom sheet.
- `components/landing/review-request-cta.tsx` — the fallback booking modal when Calendly is off.
- `components/official/faq.tsx` — the accordion described above.
- `components/landing/motion-bootstrap.tsx` — one IntersectionObserver that adds `.is-revealed` to `[data-reveal]`. CSS transitions only. `html.motion-ok` is set by an inline script in `app/layout.tsx` when `prefers-reduced-motion` is not set. There is already scroll-reveal motion on the page; the plan allows one new automatic motion (the proof-card reveal).

## Calendly and the thank-you state

Config: `lib/calendly-config.ts`. The event URL is `process.env.NEXT_PUBLIC_CALENDLY_EVENT_URL`. Calendly is on only when `NEXT_PUBLIC_CALENDLY_ENABLED` is `1`, `true`, or `yes` and the URL host is `https://calendly.com`.

Loading (`lib/booking.ts`): not in the initial HTML. `loadCalendly()` injects the stylesheet `https://assets.calendly.com/assets/external/widget.css` and the script `https://assets.calendly.com/assets/external/widget.js`. `BookingProvider` warms that script on the first pointer/focus intent over `[data-booking-cta]`, and again on idle (about 4 seconds).

Opening: `openCalendlyPopup()` calls `window.Calendly.initPopupWidget({ url })`. The URL is `buildCalendlyEmbedUrl()`, which sets colour params and hides the landing-page details, event-type details, and GDPR banner. It does **not** set UTM params today. `CalendlyUtm` is typed in `lib/calendly-config.ts` but unused.

`openBooking(location)` in `components/official/booking-provider.tsx` is the single CTA handler. Current locations: `header | hero | how | sticky | final`. If Calendly is disabled, it opens the review-request modal instead.

Thank-you behaviour (`components/official/final-cta.tsx`):

- There is no separate thank-you section. `#book` crossfades in place when `booked` is true.
- `booked` is set when a `postMessage` from `https://calendly.com` has `event === "calendly.event_scheduled"`. A session flag `sg_booked` keeps that state for the visit.
- Closing the popup (`calendly.popup_closed`, or the `.calendly-overlay` node disappearing) only sets `bookingOpen` to false. It does not itself reveal the thank-you.
- After a real booking, once the popup has closed, the page scrolls to `#book`. Restoring `sg_booked` from session storage does not scroll.

A short GDPR line from `landingCopy.reviewRequest.trustMicrocopy.gdpr` is appended into `.calendly-popup` while it is open.

## Sticky CTA

`components/official/sticky-cta.tsx`. Mobile-only (hidden from `md` up in CSS).

It shows only when all of these are true:

- the hero button `#hero-cta` has scrolled above the viewport
- neither `#book` nor `#site-footer` is intersecting
- Calendly is not open
- the visitor has not already booked

Visibility toggles `html.official-sticky-on`, which adds bottom padding so the bar does not cover the page. The button calls `openBooking("sticky")`.

## Analytics

- **Vercel Analytics** and **Vercel Speed Insights** are mounted in `app/layout.tsx` (`@vercel/analytics/react`, `@vercel/speed-insights/next`). No custom Vercel event names are sent from this repo.
- **Plausible** is optional. `components/landing/analytics-provider-script.tsx` loads `https://plausible.io/js/script.tagged-events.js` only when `NEXT_PUBLIC_ANALYTICS_PROVIDER=plausible` and a domain is set. Default provider is `"none"`.
- Custom events go through `trackEvent()` in `lib/analytics.ts`. Names: `landing_view`, `bridge_to_video_click`, `video_play`, `video_progress`, `video_complete`, `review_cta_open`, `review_form_start`, `review_form_error`, `review_request_success`, `calendly_event_scheduled`, `calendly_embed_error`. Props are allow-listed. In development they are logged with `console.info`. Booking sends `review_cta_open` with `cta_location`.

## Copy modules

- Official homepage copy: `lib/official-copy.ts`.
- Older outreach / footer legal copy: `lib/landing-copy.ts`.
- Contact details already match the plan in `lib/site-config.ts` (`achow@standoutgroup.net`, WhatsApp `https://wa.me/447599569931`). LinkedIn is not in site config yet.

## Conflicts to resolve before later tasks

These disagree with the plan. Do not guess; confirm with the owner when that task starts.

1. **FAQ id and an existing "after 30 days" answer.** The section id is `faq` and the nav points at `#faq`. The plan's anchor is `#faqs`. There is already a question `after-30-days` ("What happens after the 30 days?") with different copy from the new `faq-after-30-days` item. Task 9.2 would add a second question with the same title.
2. **Booking location names.** The plan's `utm_term` values are `hero`, `how-it-works`, `practice-card`, `final`, `sticky`, `footer`. The code uses `how` (not `how-it-works`) and also has a header button (`header`) that the plan's list does not mention. There is no footer booking button yet.
3. **Hero button colour.** On the navy hero the button is lavender `#c4b5fd`, not logo purple `#4f3192`. Task 1.1's `brand-lavender` should use `#c4b5fd`.
4. **Existing motion.** Scroll reveals already run via `MotionBootstrap`. The plan says the proof-card reveal is the only new automatic motion. Leave the existing reveals in place unless a later task says otherwise.
