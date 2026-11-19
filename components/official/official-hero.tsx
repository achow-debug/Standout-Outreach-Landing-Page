"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ENQUIRY_CHECK_HREF, SPEAK_TO_ALEX_HREF } from "@/lib/cta";
import { officialCopy } from "@/lib/official-copy";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

const heroPrimaryClass = `inline-flex w-full items-center justify-center min-h-[52px] px-6 rounded-xl bg-brand text-white text-button no-underline shadow-[var(--shadow-cta)] transition-[background-color,box-shadow] duration-150 hover:bg-[color-mix(in_oklab,var(--color-brand-hover)_88%,black)] hover:shadow-[0_10px_26px_-6px_rgb(79_49_146_/_45%)] sm:min-h-[58px] sm:px-8 sm:text-[1.125rem] sm:w-auto ${focusRing}`;

const heroSecondaryClass = `inline-flex w-full items-center justify-center min-h-[52px] px-6 rounded-xl border-2 border-ink bg-surface text-ink text-button no-underline transition-colors duration-150 hover:bg-ink/5 sm:min-h-[58px] sm:px-8 sm:text-[1.125rem] sm:w-auto ${focusRing}`;

const ROTATE_MS = 2000;

/**
 * Centred hero on the paper canvas: headline, growth-partner firm-type
 * rotator, two CTAs, caption. Form/card lives in the showcase below.
 */
export function OfficialHero() {
  const { hero } = officialCopy;
  const firmTypes = hero.firmTypes;
  const longestFirmType = firmTypes.reduce((a, b) =>
    a.length >= b.length ? a : b,
  );
  const [index, setIndex] = useState(0);
  /** Assume reduced until measured so SSR and first paint stay static. */
  const [reduceMotion, setReduceMotion] = useState(true);
  const [motionReady, setMotionReady] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setReduceMotion(media.matches);
      setMotionReady(true);
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!motionReady || reduceMotion || firmTypes.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % firmTypes.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [firmTypes.length, motionReady, reduceMotion]);

  const activeFirmType = firmTypes[index] ?? firmTypes[0];

  return (
    <section id="top" className="bg-canvas" aria-labelledby="official-hero-heading">
      <div className="official-hero-inner mx-auto flex w-full max-w-[1200px] flex-col items-center px-6 text-center">
        <div className="hero-in w-full">
          <h1
            id="official-hero-heading"
            className="official-hero-title text-display text-ink mx-auto max-w-[22ch] lg:max-w-[24ch]"
          >
            {hero.headingLead}{" "}
            <span className="text-brand">{hero.headingAccent}</span>
          </h1>
          {/* Centred growth-partner subhead: niche may wrap under the lead. */}
          <p className="hero-growth-line text-ink">
            <span className="hero-growth-lead">{hero.growthPartnerLead}</span>{" "}
            <span className="hero-firm-rotator" aria-live="polite" aria-atomic="true">
              <span className="hero-firm-rotator-sizer" aria-hidden="true">
                {longestFirmType}
              </span>
              {reduceMotion || !motionReady ? (
                <span className="hero-firm-rotator-static text-brand">
                  {firmTypes[0]}
                </span>
              ) : (
                <span className="hero-firm-rotator-viewport" aria-hidden>
                  <span
                    className="hero-firm-rotator-track"
                    style={{
                      // Row height is 1em of the growth line; keep offset in em.
                      transform: `translateY(-${index}em)`,
                    }}
                  >
                    {firmTypes.map((type) => (
                      <span
                        key={type}
                        className="hero-firm-rotator-item text-brand"
                      >
                        {type}
                      </span>
                    ))}
                  </span>
                </span>
              )}
              <span className="sr-only">{activeFirmType}</span>
            </span>
          </p>
        </div>
        <div className="hero-in hero-in-delay official-hero-ctas flex w-full flex-col items-center">
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-center sm:gap-4">
            <Link
              id="hero-cta"
              href={ENQUIRY_CHECK_HREF}
              data-cta="measure-enquiries"
              className={heroPrimaryClass}
            >
              {hero.ctaLabel}
            </Link>
            <Link href={SPEAK_TO_ALEX_HREF} className={heroSecondaryClass}>
              {hero.secondaryCtaLabel}
            </Link>
          </div>
          <p className="official-hero-caption text-small text-ink-muted">
            {hero.caption}
          </p>
        </div>
      </div>
    </section>
  );
}
