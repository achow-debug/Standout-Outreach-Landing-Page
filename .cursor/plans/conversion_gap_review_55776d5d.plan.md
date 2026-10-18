---
name: Conversion gap review
overview: Phased implementation of the confirmed conversion fixes. One phase at a time. Brand visuals, the headline, the support line, the footer, and unconfirmed pages stay as they are.
todos:
  - id: phase-1-trust
    content: "Phase 1 — Trust row: ICO number ZC264255, remove the ISO badge, leave SRA as it is"
    status: completed
  - id: phase-2-hero-pilot
    content: Phase 2 — Add the confirmed 30-day pilot sentence under the unchanged hero support line
    status: completed
  - id: phase-3-proof
    content: Phase 3 — Drop the 2025 eyebrow, keep both findings verbatim, add the response-time result
    status: completed
  - id: phase-4-partners
    content: Phase 4 — Move full partner quotes under the proof strip and shorten public names
    status: completed
  - id: phase-5-crop
    content: Phase 5 — Fix the mobile hero crop so the business cards stay in frame
    status: completed
  - id: phase-6-sticky
    content: Phase 6 — Increase sticky-bar clearance so the comparison and COLP sections clear the button
    status: completed
  - id: phase-7-verify
    content: Phase 7 — Verify desktop and mobile in the browser
    status: completed
isProject: false
---

# Conversion fixes, one phase at a time

Work in order. Finish a phase and check it before starting the next. If a step is not covered here, stop and ask. Do not invent copy, credentials, client names, or layout.

## Confirmed decisions

- ICO is registered. Public number: **ZC264255**. Homepage trust row title stays **ICO Registered**. Detail becomes **ZC264255**.
- Remove the **Cyber Essentials · ISO 27001** badge until that certificate is held.
- Leave the **SRA Standards Aligned** badge word for word.
- Headline stays: **Enabling ambitious law firms to thrive** / **in 2026 and beyond.**
- Support line stays: **The UK’s most innovative law firm growth partner.**
- Add this sentence directly under that support line, before the button: **Start with a free 30-day pilot. You keep the leads, with no 12-month lock-in, and a complete DPA.**
- Proof sentences stay word for word. Remove the eyebrow **Since launching in 2025**. Add an unattributed result: **Response time cut from 14 hours to 5 minutes.**
- Move the partners section to sit directly under the proof strip. Keep both quotes in full. Visible names become **Florenda A** and **Jayden C**. Do not repeat the section later.
- Same hero photograph. On small screens, crop it so the cards are in the frame.
- Raise the page clearance under the mobile sticky button so the comparison’s last row and the COLP section clear a two-line button, including the safe area.
- Footer stays as it is.

## Why the hero sentence is this one

The button already says “Apply For My 30-Day Pilot”, and the three checks already list the terms. A visitor can still miss the offer because the sentence under the headline never mentions it. Changing the eyebrow to “30-day pilot” only renames a label. A pill that repeats the button does not state that the firm keeps the leads, avoids a 12-month lock-in, and receives a DPA. The new sentence uses claims already on the page, in [lib/official-copy.ts](lib/official-copy.ts) (the free pilot in How it works, and the three hero checks), and places them where the eye lands after the brand line.

## Leave unchanged

- Palette, type scale, purple pill buttons, wordmark.
- Headline and the support sentence above.
- Comparison table, COLP section, How it works, FAQ, founder story.
- Footer, including legal links and the absence of an email.
- Partner quote text and roles.
- No new revenue figures, client logos, firm names on the response-time line, or a cohort countdown.
- Do not edit [app/compliance/page.tsx](app/compliance/page.tsx) or `icoBody` in [lib/landing-copy.ts](lib/landing-copy.ts). That compliance page still says “ICO Reg: pending”. Stop and ask before touching it.

## Phase 1 — Trust row

Files: [lib/official-copy.ts](lib/official-copy.ts). [components/official/trust-badges.tsx](components/official/trust-badges.tsx) only if it assumes three items.

- ICO item: `title` **ICO Registered**, `detail` **ZC264255**.
- Delete the `security` item (Cyber Essentials · ISO 27001 / Certification pending).
- Leave the SRA item untouched.
- The row may render two items. Keep the existing mark, type, and border styles.

Done when the homepage trust row shows ICO Registered with ZC264255, SRA Standards Aligned, and no pending certification.

## Phase 2 — Hero pilot sentence

Files: [lib/official-copy.ts](lib/official-copy.ts), [components/official/official-hero.tsx](components/official/official-hero.tsx).

- Add the sentence as its own copy field. Render it immediately after the existing support paragraph and before the button.
- Use the same colour and type as the support line. No new colour, button style, or pill.
- Leave the eyebrow, headline, button label, secondary link, and three checks as they are.

Done when the hero reads: headline, then “The UK’s most innovative law firm growth partner.”, then “Start with a free 30-day pilot. You keep the leads, with no 12-month lock-in, and a complete DPA.”, then the existing button.

If that sentence pushes the button below the first screen at 390px wide, stop and ask before removing the checks or changing type size.

## Phase 3 — Proof strip

Files: [lib/official-copy.ts](lib/official-copy.ts), [components/official/proof-strip.tsx](components/official/proof-strip.tsx).

- Remove the visible eyebrow **Since launching in 2025**.
- Keep both figures and both sentences exactly:
  - **100+** — Law firms analysed before building this process
  - **70%** — Law firms identified to be leaking £100K+ in revenue per year to mishandled enquiries
- Add **Response time cut from 14 hours to 5 minutes.** as a full-width line under those two figures. No giant number, no firm name, no “Finding” label.
- Give the section an accessible name once the eyebrow is gone. Use **Findings**.

Done when the 2025 line is gone, both original sentences match the copy above, and the response-time sentence sits under them.

## Phase 4 — Partner quotes

Files: [app/page.tsx](app/page.tsx), [lib/official-copy.ts](lib/official-copy.ts).

- Move `WhatPartnersSay` to directly after the proof strip.
- Page order becomes: header, hero, trust, proof, partners, who it’s for, how it works, comparison, COLP, founder, FAQ, final CTA, footer.
- Set `name` and `portraitAlt` to **Florenda A** and **Jayden C**. Keep each quote and role in full.
- Leave image file names as they are.

Done when both full quotes appear once, under the proof strip, with those shortened public names.

## Phase 5 — Mobile hero crop

File: [app/globals.css](app/globals.css), rule `.official-hero-photo`.

- Keep `src` `/images/hero-business-cards.jpg`.
- Below 1024px the frame is `4 / 3` and `object-position: 50% 70%` shows the balcony edge. Change the small-screen position so the card stack is inside the frame.
- Leave the desktop crop if the cards are already visible in the `3 / 4` frame.

Done when a phone-width screenshot shows the cards, and a desktop screenshot still shows the cards.

## Phase 6 — Sticky bar clearance

File: [app/globals.css](app/globals.css), `html.official-sticky-on body`.

- The bar is mobile-only. Current clearance is `96px`, which is short when **Apply For My 30-Day Pilot** wraps to two lines.
- Increase bottom padding so the last comparison row and the COLP block clear the button plus `env(safe-area-inset-bottom)`.
- Do not change the button label, the footer, or when the bar appears.

Done when, at 390px with the bar visible, the regulatory-risk row and the last COLP item can be scrolled fully above the button.

## Phase 7 — Verify

Check in the browser at desktop width and at 390px:

- Trust row copy and the removed ISO badge.
- Hero sentence order, with the original support line still present.
- Proof copy, response-time line, and partner quotes once, with shortened names.
- Hero image subject on both widths.
- Sticky bar overlapping neither the comparison’s last row nor COLP.
- Footer visually unchanged.

Run the project’s existing copy check if it asserts any string this work changed. Update an assertion only when it fails because of a change listed above.
