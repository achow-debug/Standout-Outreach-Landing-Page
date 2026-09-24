"use client";

import Image from "next/image";
import { useBooking } from "@/components/official/booking-provider";
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
  const {
    eyebrow,
    h1,
    h1Accent,
    supporting,
    ctaLabel,
    secondaryLabel,
    secondaryHref,
    reassurance,
    imageSrc,
    imageAlt,
  } = officialCopy.hero;
  const { openBooking } = useBooking();

  return (
    <section
      className="official-hero"
      id="top"
      aria-labelledby="official-hero-heading"
    >
      <div className="page-shell official-hero-inner">
        <div className="official-hero-copy">
          <p className="official-hero-eyebrow t-kicker t-kicker--on-dark">{eyebrow}</p>
          <h1 id="official-hero-heading" className="official-hero-title t-display">
            <span className="official-hero-title-lead">{h1}</span>
            <span className="official-hero-title-accent">{h1Accent}</span>
          </h1>
          <p className="official-hero-supporting t-lead">{supporting}</p>
          <button
            id="hero-cta"
            type="button"
            className="btn btn-primary btn-on-dark btn-cta official-hero-cta"
            data-booking-cta=""
            onClick={() => openBooking("hero")}
          >
            {ctaLabel}
            <span className="btn-cta-arrow" aria-hidden="true">
              →
            </span>
          </button>
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
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority
            quality={80}
            className="official-hero-photo"
            sizes="(min-width: 1024px) 40vw, 100vw"
          />
        </div>
      </div>
    </section>
  );
}
