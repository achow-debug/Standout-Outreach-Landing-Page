import Image from "next/image";
import { officialCopy } from "@/lib/official-copy";

/**
 * Full-bleed navy hero: left copy, right photo. Watch is visual-only until a later slice.
 */
export function OfficialHero() {
  const {
    eyebrow,
    h1,
    h1Accent,
    supporting,
    watchLabel,
    imageSrc,
    imageAlt,
  } = officialCopy.hero;

  return (
    <section className="official-hero" aria-labelledby="official-hero-heading">
      <div className="page-shell official-hero-inner">
        <div className="official-hero-copy">
          <p className="official-hero-eyebrow">{eyebrow}</p>
          <h1
            id="official-hero-heading"
            className="official-hero-title motion-enter motion-enter--0"
          >
            <span className="official-hero-title-lead">{h1}</span>
            <span className="official-hero-title-accent">{h1Accent}</span>
          </h1>
          <p className="official-hero-supporting motion-enter motion-enter--1">
            {supporting}
          </p>
          <button
            type="button"
            className="btn-watch-outline motion-enter motion-enter--2"
            aria-label={watchLabel}
          >
            {watchLabel}
            <span className="btn-cta-arrow" aria-hidden="true">
              →
            </span>
          </button>
        </div>
        <div className="official-hero-media motion-enter motion-enter--3">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={1200}
            height={900}
            priority
            className="official-hero-photo"
            sizes="(min-width: 768px) 34rem, 100vw"
          />
        </div>
      </div>
    </section>
  );
}
