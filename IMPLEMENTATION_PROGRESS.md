# Pilot Conversion Flow — Implementation Progress

> Working file for context retention across phases.  
> Status: **Plan complete · Phase 1 audit complete · Phases 2–16 not started**  
> Last updated: 2026-08-03

---

## Objective

Redesign and implement the pilot enquiry flow so it feels like a natural continuation of the landing page rather than an intrusive application form.

Submitting the form must **not** imply that the pilot has begun, that work has been authorised, or that a contract has been created.

---

## Intended conversion journey

**Watch the video → Book the 20-minute pilot call → Tell us about your firm → Choose a time → Receive confirmation and preparation details.**

Concrete steps:

1. Visitor watches (or inspects) the breakdown video.
2. Clicks a consistent primary CTA: **Book the 20-minute pilot call**.
3. Completes a short qualification form (Step 1 of 2).
4. Immediately chooses a call time (Step 2 — embedded scheduler).
5. Sees confirmation with date, time, timezone, agenda, and preparation guidance.

---

## Files and components involved

### Primary conversion surface

| Role | Path |
|---|---|
| Page composition | `app/page.tsx` |
| Modal shell, desktop CTA, sticky mobile CTA | `components/landing/review-request-cta.tsx` |
| Qualification form | `components/landing/review-request-form.tsx` |
| Central copy | `lib/landing-copy.ts` |
| Form validation schema | `lib/review-request-schema.ts` |
| Submit API | `app/api/review-request/route.ts` |
| Lead processing / emails | `lib/review-request-service.ts`, `lib/review-request-emails.ts` |
| Modal / sticky / form styles | `app/globals.css` |
| Site config (timing, video paths, privacy) | `lib/site-config.ts` |

### Supporting surfaces (in scope for later phases)

| Role | Path |
|---|---|
| Trust cards | `components/landing/reassurance-block.tsx` |
| Video player | `components/landing/enquiry-video-player.tsx` |
| Missing-video placeholder | `components/landing/video-poster-placeholder.tsx` |
| Video asset checks | `lib/video-assets.ts`, `public/video/README.md`, `scripts/check-video-assets.mjs` |
| Analytics | `lib/analytics.ts`, `lib/landing-events.ts` |
| Acceptance / copy audits | `scripts/final-acceptance-browser.mjs`, `scripts/check-copy-audit.mjs` |
| Privacy copy (fields / purpose) | `app/privacy/page.tsx`, `lib/landing-copy.ts` → `privacyPage` |

### Not present today (must be introduced)

| Gap | Planned addition |
|---|---|
| Scheduling / calendar embed | New isolated component (e.g. `components/landing/pilot-call-scheduler.tsx`) + config keys in `lib/site-config.ts` / env |
| Two-step flow state | Extend modal shell / form (Step 1 → Step 2 → confirmation) |
| Practice-area field | Schema + form + API payload |
| “What happens next?” disclosure | New UI in modal Step 1 |

---

## Implementation phases

| Phase | Name | Status |
|---|---|---|
| 1 | Audit the existing conversion flow | **Complete** (documented below) |
| 2 | Correct the conversion language | Planned |
| 3 | Reframe the modal content | Planned |
| 4 | Simplify and improve the form fields | Planned |
| 5 | Reposition risk reducers | Planned |
| 6 | Build the two-step flow | Planned |
| 7 | Rebuild mobile behaviour | Planned |
| 8 | Improve desktop modal layout | Planned |
| 9 | Resolve competing CTAs | Planned |
| 10 | Fix modal interaction and accessibility | Planned |
| 11 | Improve the post-submission state | Planned |
| 12 | Correct the video failure state | Planned |
| 13 | Correct trust and compliance claims | Planned |
| 14 | Analytics and conversion tracking | Planned |
| 15 | Error, loading and edge states | Planned |
| 16 | Quality assurance | Planned |

**Working rule:** Do not begin the next phase until the current phase has been inspected, implemented, tested, and summarised in this file.

---

## Technical constraints discovered

1. **Stack:** Next.js 15 (App Router) + React 19 + TypeScript + Tailwind 4 + Zod. No unit/integration test suite in `package.json` (lint, build, and custom check scripts only).
2. **No scheduler exists.** Grep found no Calendly, Cal.com, or booking iframe. React’s internal `scheduler` package is unrelated. Step 2 requires a new isolated integration; do not fabricate production booking URLs or credentials.
3. **Lead pipeline is enquiry-request oriented.** `/api/review-request` → `processReviewRequest` (n8n / Sheets / Resend). Step 1 should still capture the lead, then hand off to scheduling without a “wait one business day” visitor promise.
4. **Native `<dialog>` + `showModal()`** already used. Provides baseline focus management and Escape. Scroll lock via `html.modal-open { overflow: hidden }`.
5. **Sticky CTA already partially suppressed while modal open** via CSS (`html.modal-open .mobile-sticky-cta-wrapper`), but may remain keyboard-focusable (see audit).
6. **Modal can auto-open from query params** `?request=received` / `?request=error` (no-JS / redirect fallback). Not opened on load/scroll/video alone — except this URL recovery path.
7. **Video MP4 and poster are missing** from `public/video/` (only captions VTT + README). Non-production shows `VideoPosterPlaceholder` with copy “Breakdown video unavailable”. Production build enforces assets via `check-video-assets.mjs` when `VERCEL_ENV=production` or `REQUIRE_VIDEO_ASSETS=1`.
8. **Copy and acceptance scripts hard-code current CTA language** (`Request your free 30-day pilot`, `Request My Pilot`, “within one business day”). Phases 2/11/16 must update `scripts/final-acceptance-browser.mjs` and related audits, or QA will fail against the new journey.
9. **Privacy / email copy still assumes firm name + one-business-day response.** Schema, emails, and privacy notice need coordinated updates when fields change.
10. **Preserve design system:** brand colours (`#3b2c4d` primary), typography, and existing visual identity unless a change is explicitly required by a phase.

---

## Decisions (plan-time)

| Decision | Choice | Rationale |
|---|---|---|
| Primary CTA label | **Book the 20-minute pilot call** | Preferred label from brief; communicates conversation, not pilot start |
| Secondary CTA (if needed) | Check whether my firm is suitable | Only if page context clearly requires softer framing |
| Firm name field | Remove from Step 1 | Infer from website / email domain / call |
| Practice area | Required select + “Other” free text | Pilot scoped to one practice area |
| Scheduler provider | TBD — config-driven embed | No provider in repo; isolate component + document env keys; do not invent URLs |
| Desktop layout | Prefer two-column modal | Fits brief preferred option; fall back to compact single column only if two-column conflicts with existing dialog patterns |
| Mobile layout | Full-screen sheet (`100dvh`) below ~640px | Replace current centred card (`max-width: 440px`) |
| Confirmation | After booking, not after Step 1 | Step 1 → scheduler; booking → confirmation + prep |
| Analytics | Extend `lib/analytics.ts` allowlist | Keep PII blocked; rename/map events carefully for Plausible continuity |
| Auto-open via `?request=` | Keep for error recovery; avoid success auto-open that skips scheduling | Align with explicit-CTA rule once two-step flow exists |

---

# Phase 1 — Audit findings

**Status:** Complete (inspection only; no behavioural code changes)

## What opens the form / modal

- **Desktop:** `#final-cta` button in `ReviewRequestCta` → `openModal(..., "inline_desktop")`.
- **Mobile:** Sticky dock button in `MobileStickyCta` → `openModal(..., "sticky_mobile")`.
- **Mechanism:** `ReviewRequestShell` context + `<dialog className="review-modal">` → `dialog.showModal()`.
- **Does not open on:** page load alone, scroll alone, or video playback alone.
- **Does open automatically when:** URL has `?request=received` (success state) or `?request=error` (form with initial error) — then query param is stripped via `history.replaceState`.

## Background scroll and interaction

- Scroll lock: `document.documentElement.classList.add("modal-open")` → `html.modal-open { overflow: hidden }`.
- Native modal dialog makes the page inert for pointer/keyboard in supporting browsers via `showModal()`.
- Backdrop click closes (`event.target === event.currentTarget`).
- Escape closes via native dialog behaviour (no custom “block Escape while submitting” yet).

## Sticky CTA while modal open

- CSS hides sticky wrapper when `html.modal-open` (visibility/opacity/pointer-events).
- Sticky `inert` / `tabIndex` currently depend only on unlock + suppress, **not** modal-open state → risk of focusable sticky while visually hidden (Phase 9/10).

## Modal dimensions (current)

| Viewport | Behaviour |
|---|---|
| Desktop / ≥640px | Width `min(100% - 2rem, 37.5rem)` (~600px); max-height ~`92dvh`; centred card |
| Mobile / ≤639px | Width `calc(100% - 32px)`, **max-width 440px**, centred card, max-height ~`92dvh` — **not** a full-screen sheet |

## Current field list

1. Name  
2. Firm name (`firm_name`)  
3. Work email  
4. Firm website  

Honeypot: `company_website`. No practice area. No phone / size / budget.

## Current submit behaviour

- Client validation via Zod (`validateReviewRequestFields`).
- `POST /api/review-request` with attribution + honeypot + timing.
- Double-submit guarded with `isSubmittingRef`.
- On success: `onComplete` → modal success state (not scheduling).
- Expectation copy: respond **within one business day**.

## Current success state

- Heading: “Your pilot request has been received.”
- Body repeats one-business-day wait + “did not start work or create a contract.”
- Optional `siteConfig.reviewDeliveryTiming` line (currently `null`).
- No calendar, no confirmed slot, no preparation checklist.

## Calendar / scheduling

- **None.** No embed, no provider config, no booking confirmation UI.

## Video failure state

- MP4 + poster missing; captions present.
- Non-production: `VideoPosterPlaceholder` with title **“Breakdown video unavailable”** and developer-oriented subtitle.
- Production enforcement: build fails if assets missing under production/enforcement flags — so production should not ship the placeholder, but local/preview currently exposes the unavailable message.

## Accessibility notes

| Area | Finding |
|---|---|
| Dialog | Uses `<dialog>` + `aria-labelledby`; good baseline |
| Close control | 44×44px target; label currently `Close` (brief prefers `Close dialog`) |
| Focus restore | Restores to triggering CTA on `close` |
| Focus trap | Native `showModal()` |
| Sticky + modal | Sticky may remain focusable when only CSS-hidden |
| Form | Labels present; error summary with `role="alert"`; honeypot `aria-hidden` |
| Escape while submitting | Not blocked |

## Competing / inconsistent CTA labels

| Location | Current copy |
|---|---|
| Desktop CTA | “Request your free 30-day pilot” |
| Mobile sticky | “Request My Pilot →” |
| Modal heading | “Request your free 30-day pilot” |
| Modal submit | “Request My Pilot” |
| After-video cue | “Ready when you are — request your free 30-day pilot below.” |
| Section `aria-label` | “Request a pilot” |
| Hero supporting | “Starting your free pilot takes about 5 minutes.” |

## Trust / compliance language (for Phase 13)

| Current | Issue |
|---|---|
| “Data-Backed” / “100+ UK Law Firms analysed…” | Vague title; body closer to desired precision |
| “5-Minute Follow-Up” / “Enquiries followed up within 5 minutes” | Implies substantive legal response SLA |
| “SRA Compliant” / “Fully SRA and GDPR compliant by design” | Absolute compliance claim |

## Analytics events (current)

| Event | When |
|---|---|
| `landing_view` | Page load |
| `bridge_to_video_click` | Bridge link |
| `video_play` / `video_progress` / `video_complete` | Player |
| `review_cta_open` | Modal open |
| `review_form_start` | First field focus |
| `review_form_error` | Validation / submission / network |
| `review_request_success` | Successful API submit |

Missing for new journey: modal closed, step labels, scheduler displayed, slot selected, call booked / failed, “What happens next?” opened.

## Phase 1 summary

The page already has a solid modal shell, sticky CTA suppression (visual), validation, and lead API — but the journey is a **single-step enquiry request with a delayed-response promise**, not a **qualify → book call** flow. Mobile is a squeezed card, not a sheet. There is no scheduler. Copy and trust claims need tightening. Video missing-asset UX exposes developer language in non-production.

**Next phase:** Phase 2 — Correct the conversion language.

---

# Phases 2–16 — Implementation plan (no code yet)

## Phase 2: Correct the conversion language

**Goal:** One consistent primary CTA that books a conversation, not “starts” or “requests” a pilot as if work begins.

**Work:**

1. Update `lib/landing-copy.ts`:
   - `cta.label` → **Book the 20-minute pilot call**
   - `cta.mobileLabel` → same preferred label (or short mobile-safe equivalent that keeps the same meaning)
   - `cta.microcopy`, `cta.afterVideoCue`, modal heading/submit, confirmation, hero supporting line — remove “start my pilot” / “request my pilot” / misleading commitment
   - Remove visitor-facing “one business day” wait wherever scheduling replaces that promise
2. Align `aria-label`s on CTA sections with the new action.
3. Update confirmation / email strings in `lib/review-request-emails.ts` and `siteConfig` comments so they do not contradict immediate scheduling.
4. Update acceptance/copy audit scripts that assert old strings.

**Test:** Grep the UI surface for old CTA strings; visual check desktop + sticky + modal open trigger labels.

**Exit:** Every visible pilot CTA uses consistent booking language; no “wait one business day” before booking.

---

## Phase 3: Reframe the modal content

**Goal:** Modal advances the next decision; does not repeat the page proposition.

**Work:**

1. Replace heading with: **First, let’s check whether the pilot fits your firm** (or Step 1 heading variant from Phase 6).
2. Add scope statement: one priority practice area, one landing page, one measurable enquiry journey.
3. Add **Step 1 of 2: Tell us about your firm**.
4. Supporting copy: short questions → choose 20-minute call time; submission does not start work or create a contract.
5. Keep intro brief — no long paragraphs.

**Files:** primarily `lib/landing-copy.ts`, `components/landing/review-request-cta.tsx` header region.

**Test:** Open modal; confirm heading/scope/step label/commitment copy only.

---

## Phase 4: Simplify and improve form fields

**Goal:** Four qualification fields only; practice area required.

**Fields:**

1. Name  
2. Work email  
3. Firm website  
4. Priority practice area (select: Family law, Conveyancing, Personal injury, Employment law, Wills and probate, Criminal law, Commercial law, Immigration, Other + conditional text)

**Work:**

1. Remove `firm_name` from visible schema unless backend temporarily needs a derived placeholder (document if deriving server-side from domain).
2. Extend Zod schema + API + email templates + privacy copy for `practice_area` (+ `practice_area_other`).
3. Clear labels, blur validation, helpful messages.
4. Do not add phone, firm size, budget, or long free text.

**Test:** Client + server validation for each field; “Other” requires concise entry; bare domains still normalise.

---

## Phase 5: Reposition risk reducers

**Goal:** Reassurance at the decision point; one short disclaimer under the CTA.

**Work:**

1. Move three risk reducers near heading or above primary CTA:
   - No setup fee during the pilot.
   - No payment details required.
   - No long-term commitment.
2. Directly under CTA only: **This does not start work or create a contract.**
3. Collapse further detail into expandable **What happens next?**
4. Remove large disclaimer block under the button.

**Test:** Visual hierarchy; expand/collapse keyboard accessibility.

---

## Phase 6: Build the two-step flow

**Goal:** Visible Step 1 → Step 2 scheduling without a thank-you dead end.

**Step 1**

- Heading: Tell us about your firm  
- Four fields + risk reducers  
- CTA: **Continue to available times** (not Submit / Request pilot)

**Step 2**

- Heading: Choose a 20-minute call  
- Embed calendar immediately after successful Step 1 validation/submit  
- Preserve Step 1 data; prefill scheduler where the provider allows  
- Agenda + “Booking the call does not start the pilot or create a contract.”

**Scheduler plan:**

1. Add config placeholders, e.g. `NEXT_PUBLIC_SCHEDULER_PROVIDER` + `NEXT_PUBLIC_SCHEDULER_URL` (or Cal.com embed link) in `siteConfig` / env — values supplied by owner, never invented.
2. New component: isolated embed + loading / missing-config / error states.
3. Wire postMessage or provider callbacks when available for “slot selected” / “booked” events; document limitations if provider only supports iframe without callbacks.

**Test:** Valid Step 1 transitions in-modal to scheduler; back/close behaviour defined; missing config shows actionable empty state.

---

## Phase 7: Rebuild mobile behaviour

**Goal:** Full-screen sheet below ~640px.

**CSS / structure:**

- `position: fixed` dialog filling viewport  
- Width 100%; height `100dvh`  
- Sticky header; scrollable body; optional sticky bottom action  
- Safe-area padding; 16–20px horizontal padding  
- No 440px centred card  

**Test widths:** 320, 375, 390, 430; short and tall heights; mobile keyboard open if feasible in browser QA.

---

## Phase 8: Improve desktop modal layout

**Goal:** Efficient laptop layout; max height ~85vh.

**Preferred:** Two-column modal — left: heading, scope, explanation, risk reducers, step summary; right: form / scheduler.

**Fallback:** Compact single column with shared field rows (name + practice area; email + website) if two-column conflicts with dialog constraints.

**Test:** 1024×768, 1280×800, 1440×900, 1920×1080; no content below viewport without internal scroll.

---

## Phase 9: Resolve competing CTAs

**Goal:** One dominant action while conversion UI is active.

**Work:**

1. When modal/sheet open: hide sticky CTA, set `inert`, `aria-hidden`, `tabIndex={-1}` (not CSS-only).
2. Optionally keep IntersectionObserver suppression for inline `#final-cta` vs sticky when both could appear.
3. Ensure modal primary action is never covered by sticky dock.

**Test:** Tab order with modal open; sticky not focusable; pointer events blocked.

---

## Phase 10: Fix modal interaction and accessibility

**Goal:** Explicit open only; inert background; consistent close control.

**Work:**

1. Confirm no open on load/scroll/video (revisit `?request=` success path so it does not skip scheduling).
2. Stronger backdrop opacity if needed; keep scroll lock.
3. Close button: label `Close dialog`; 44×44; sticky in header; hover + focus; same design all states.
4. Block Escape (and backdrop close) while submission/booking is in flight if required.
5. Focus move into modal on open; restore to CTA on close (already partially implemented).

**Test:** Keyboard-only, Escape, focus restore, screen-reader labels.

---

## Phase 11: Improve post-submission / post-booking state

**Goal:** After booking — confirmation with real details; never a vague “we’ll be in touch.”

**Include:**

- Confirmed date, time, timezone, ~20-minute duration  
- Agenda + preparation guidance  
- Pilot not started; no contract created  
- Add-to-calendar / reschedule when provider supports  

**Test:** Mock or sandbox booking → confirmation content complete.

---

## Phase 12: Correct the video failure state

**Priority:**

1. Real video when asset configured  
2. Designed loading state while loading  
3. Branded poster + clear fallback action if temporarily unavailable  
4. If no production asset: **hide entire video section** until configured (do not show “Breakdown video unavailable” as primary content)

**Work:** Adjust `app/page.tsx` + placeholder/player; keep developer logging; preserve build enforcement for true production.

**Test:** Missing asset in dev does not show unavailable headline as hero content; ready asset plays.

---

## Phase 13: Correct trust and compliance claims

**Proposed replacements (only if owner confirms facts):**

| From | To |
|---|---|
| Data-Backed | Based on an analysis of 100+ UK law-firm websites. |
| 5-minute follow-up | Immediate acknowledgement configured around the firm’s approved process. |
| Fully SRA and GDPR compliant | Designed for firm approval, data minimisation and existing regulatory processes. |

**Assumption to confirm with owner before shipping Phase 13:** the 100+ firm analysis claim is accurate (hero already uses related proof language).

**Test:** No absolute compliance guarantees; no invented stats.

---

## Phase 14: Analytics and conversion tracking

**Minimum events (extend `AnalyticsEventName` + allowlisted props):**

| Event | Trigger |
|---|---|
| Primary CTA clicked / modal opened | Existing `review_cta_open` (keep or alias) |
| Modal closed | New |
| Step 1 started | Map from / replace `review_form_start` |
| Step 1 validation error | Extend `review_form_error` |
| Step 1 completed | Replace or follow `review_request_success` |
| Scheduler displayed | New |
| Call slot selected | New |
| Call booked | New |
| Booking failed | New |
| “What happens next?” opened | New |

**Rules:** No names, emails, websites, or free-text in props. Document final names in this file when implemented.

**Planned event name list (draft — confirm at Phase 14):**

- `pilot_cta_click` (or retain `review_cta_open`)
- `pilot_modal_open` / `pilot_modal_close`
- `pilot_step1_start`
- `pilot_step1_validation_error`
- `pilot_step1_complete`
- `pilot_scheduler_display`
- `pilot_slot_selected`
- `pilot_call_booked`
- `pilot_booking_failed`
- `pilot_what_happens_next_open`

---

## Phase 15: Error, loading and edge states

Cover: form loading, validation failure, network failure, scheduler loading, config missing, scheduler unavailable, booking failure, duplicate submission, successful booking.

- Prevent double submit  
- Preserve entered data on recoverable errors  
- Actionable messages (e.g. retry or return to previous step)

---

## Phase 16: Quality assurance

Manual journey checklist from the brief (video → CTA → sticky gone → scroll lock → Step 1 → validation → Step 2 → booking → confirmation → close/reopen → keyboard → Escape → SR → reduced motion → mobile → desktop).

**Automated:**

```bash
npm run lint
npx tsc --noEmit   # if not covered by build
npm run build
npm run check:copy
npm run check:launch   # as appropriate for env
npm run check:acceptance
```

No unit test suite exists today — do not claim unit coverage unless tests are added. Resolve implementation-caused failures; do not suppress.

---

# Acceptance criteria checklist

Use at end of Phase 16 (all must be verified):

- [ ] Form opens only after explicit CTA click  
- [ ] CTA describes booking a 20-minute call  
- [ ] ≤ four initial qualification fields  
- [ ] Priority practice area collected  
- [ ] One-practice-area scope stated  
- [ ] Step 1 and Step 2 clearly labelled  
- [ ] Calendar appears immediately after Step 1  
- [ ] No one-business-day wait before booking  
- [ ] Mobile full-screen sheet (`100dvh`)  
- [ ] Desktop efficient layout; ~85vh max  
- [ ] Background scroll/interaction disabled while open  
- [ ] Sticky CTAs gone / inert while conversion active  
- [ ] Close control consistent and accessible  
- [ ] Risk reducers before main decision  
- [ ] One short disclaimer under CTA; details in “What happens next?”  
- [ ] Video section does not expose unavailable placeholder in production UX  
- [ ] Trust/compliance language defensible  
- [ ] Confirmation includes booking + preparation details  
- [ ] No submission language implies work/contract started  
- [ ] Analytics cover stages without PII  
- [ ] Mobile, desktop, keyboard, and build testing passed  

---

# Phase change log

### Phase 1 — 2026-08-03

- **Changed:** Documentation only; created this plan/progress file.  
- **Files changed:** `IMPLEMENTATION_PROGRESS.md` (created).  
- **Tested:** Static inspection of conversion components, copy, CSS, analytics, video assets, API, package scripts.  
- **Unresolved:** Scheduler provider not chosen; video MP4/poster still missing; owner confirmation needed for 100+ analysis wording in Phase 13.  
- **Next:** Phase 2 — Correct the conversion language.

---

# Final deliverables (fill at completion)

1. Summary of previous conversion problems — _pending_  
2. Summary of new conversion journey — _pending_  
3. Files changed — _pending_  
4. Components created/modified — _pending_  
5. Analytics events added/changed — _pending_  
6. Scheduler configuration required — _pending_  
7. Assumptions — see Decisions + Phase 13 confirmation  
8. Remaining limitations — _pending_  
9. Lint / typecheck / tests / build results — _pending_  
10. Confirmation this file is complete and accurate — _pending_
