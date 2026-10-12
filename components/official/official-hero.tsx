"use client";

import { useBooking } from "@/components/official/booking-provider";
import { CtaMicrocopy } from "@/components/official/cta-microcopy";
import { keepTogether } from "@/components/official/no-break";
import { SectionLabel } from "@/components/official/section-label";
import { hero as heroCopy, sectionLabels } from "@/content/landing";
import { officialCopy } from "@/lib/official-copy";

function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

/**
 * Navy hero. On mobile the CTA sits above the image so the first screen
 * shows the heading, subhead and button.
 */
export function OfficialHero() {
  const { ctaLabel, secondaryLabel, secondaryHref, reassurance } = officialCopy.hero;
  const { openBooking } = useBooking();

  return (
    <section
      className="official-hero"
      id="top"
      aria-labelledby="official-hero-heading"
    >
      <div className="page-shell official-hero-inner">
        <div className="official-hero-copy">
          <SectionLabel tone="dark">{sectionLabels.hero}</SectionLabel>
          <h1 id="official-hero-heading" className="official-hero-title t-display">
            {heroCopy.headline}
          </h1>
          <p className="official-hero-supporting t-lead">{heroCopy.subline}</p>
          <button
            id="hero-cta"
            type="button"
            className="btn btn-primary btn-on-dark btn-cta official-hero-cta"
            data-booking-cta=""
            onClick={() => openBooking("hero")}
          >
            {keepTogether(ctaLabel)}
            <span className="btn-cta-arrow" aria-hidden="true">
              →
            </span>
          </button>
          <CtaMicrocopy tone="dark" />
          <a className="official-hero-secondary" href={secondaryHref}>
            {secondaryLabel}
          </a>
          <ul className="official-hero-reassure">
            {reassurance.map((item) => (
              <li key={item}>
                <CheckIcon />
                <span className="t-small">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="official-hero-media">
          {/* When the real image is added, use next/image with priority, explicit dimensions and descriptive alt text. */}
          <p className="official-hero-placeholder">{heroCopy.imagePlaceholder}</p>
        </div>
      </div>
    </section>
  );
}
