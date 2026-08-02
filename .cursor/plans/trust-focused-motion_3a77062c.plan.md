---
name: trust-focused-motion
overview: Refine the existing CSS-only landing page with restrained, one-time motion that supports the hero-to-video-to-request sequence, while prioritizing proof and conversion clarity over decorative animation.
todos:
  - id: sequence-and-measure
    content: Align sticky CTA timing with the video narrative and instrument bridge/CTA engagement
    status: completed
  - id: add-restrained-motion
    content: Implement the hero entrance and one-time section reveals with reduced-motion fallbacks
    status: completed
  - id: strengthen-proof
    content: Add verifiable proof and point-of-collection privacy/delivery context
    status: completed
  - id: validate-experience
    content: Test accessibility, mobile clearance, performance, and conversion-event accuracy
    status: completed
isProject: false
---

# Trust-Focused Landing Page Recommendations

## Recommended motion hierarchy
- Add a single hero entrance in [components/landing/hero.tsx](components/landing/hero.tsx) and [app/globals.css](app/globals.css): headline and support copy fade upward 10–16px, staggered by roughly 80ms, with the sequence finished within 450ms. Keep content visible in the server-rendered HTML so JavaScript failure never hides the value proposition.
- Add one-time viewport reveals to the video bridge, trust section, and desktop CTA. Use 16–20px movement, 300–400ms `ease-out`, and small 60–80ms child staggering. A shared IntersectionObserver helper is preferable to adding Framer Motion for this small page.
- Keep the native dialog opening instantly in [components/landing/review-request-cta.tsx](components/landing/review-request-cta.tsx). Motion at the commitment point adds delay without improving confidence.
- Retain the existing button, CTA-arrow, and video-play hover feedback in [app/globals.css](app/globals.css), but standardize hover timing around 150–180ms and avoid combined scale plus large shadow changes.

## Conversion improvements before extra animation
- Defer the mobile sticky CTA until the visitor reaches or passes the video, so it supports the stated “watch, then request” sequence rather than competing with it from first paint.
- Track CTA opens separately from first form focus in [lib/analytics.ts](lib/analytics.ts) and [components/landing/review-request-cta.tsx](components/landing/review-request-cta.tsx). Also track the hero-to-video bridge so the funnel can distinguish attention, intent, and form engagement.
- On video completion, reveal a static, concise next-step cue near the existing CTA instead of pulsing or looping the button.
- Add a privacy-notice link at the point of data collection in [components/landing/review-request-form.tsx](components/landing/review-request-form.tsx), and publish a clear delivery timeframe once the operational SLA is dependable.

## Trust recommendations
- Do not animate the current “100+ UK Law Firms analysed” or similar figures as count-ups unless the claims are documented and current. Count-up motion makes a claim feel more assertive, not more verified.
- Prioritize one concrete proof artifact over a logo marquee: a redacted sample review, a specific methodology statement, or a sourced outcome will build more trust than ambient movement.
- Use a logo marquee only if there are enough authorized client logos to avoid obvious repetition; otherwise use a static strip. If added, make it 30s+, pause on hover/focus, and stop under reduced motion.
- Replace the form’s lock emoji with the existing SVG visual language for a more consistent professional tone.

## Motion to avoid here
- Skip parallax, looping decorative movement, animated counters for unsupported claims, bouncy easing, full-page loaders, and repeated scroll animations.
- Do not add a general animation library unless later page complexity justifies its runtime and maintenance cost.

## Accessibility and performance guardrails
- Preserve the existing `prefers-reduced-motion` handling in [app/globals.css](app/globals.css), and ensure revealed content is fully visible when reduced motion is active or JavaScript is unavailable.
- Add a reduced-transparency fallback for the blurred sticky CTA and modal backdrop.
- Animate only `opacity` and `transform`; avoid layout properties and keep the page interactive immediately.

## Suggested rollout order
1. Fix mobile CTA sequencing and add funnel analytics.
2. Add the restrained hero entrance and one-time section reveals.
3. Improve proof, privacy context, and delivery expectations.
4. Test mobile sticky-CTA clearance and complete the pending items in [.cursor/plans/mobile-optimisation_99c12e16.plan.md](.cursor/plans/mobile-optimisation_99c12e16.plan.md).
5. Validate keyboard behavior, reduced motion/transparency, mobile breakpoints, and Core Web Vitals before considering optional logo or number motion.