"use client";

import { useEffect, useState } from "react";
import * as m from "motion/react-m";
import { AnimatePresence, useReducedMotion } from "motion/react";
import { ENQUIRY_CHECK_HREF, SPEAK_TO_ALEX_HREF } from "@/lib/cta";
import { officialCopy } from "@/lib/official-copy";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

const ROTATE_MS = 3000;

/**
 * Centred hero (§10.3). H1 is static for LCP. One purple highlight: the
 * rotating firm-type line. CTAs use the shared Button.
 */
export function OfficialHero() {
  const { hero } = officialCopy;
  const firmTypes = hero.firmTypes;
  const longestFirmType = firmTypes.reduce((a, b) =>
    a.length >= b.length ? a : b,
  );

  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduceMotion || paused || firmTypes.length <= 1) return;

    const id = window.setInterval(() => {
      if (document.hidden) return;
      setIndex((current) => (current + 1) % firmTypes.length);
    }, ROTATE_MS);

    return () => window.clearInterval(id);
  }, [firmTypes.length, paused, reduceMotion]);

  const activeFirmType = firmTypes[index] ?? firmTypes[0];

  return (
    <section
      id="top"
      className="bg-paper"
      aria-labelledby="official-hero-heading"
      style={{
        paddingTop: "calc(var(--nav-offset) + clamp(2.5rem, 6vw, 5rem))",
      }}
    >
      <Container className="flex flex-col items-center text-center">
        <h1
          id="official-hero-heading"
          className="font-display text-display text-ink"
        >
          {hero.headingLead} {hero.headingAccent}
        </h1>

        {/*
          Subhead: line 1 medium muted; line 2 rotating brand (§10.3).
          Not an aria-live region (§8.3). Fixed box = longest phrase.
        */}
        <div
          className="mt-6 lg:mt-8"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node)) {
              setPaused(false);
            }
          }}
        >
          <p className="m-0 font-display text-h3 font-medium text-ink-muted">
            {hero.growthPartnerLead}
          </p>
          <p className="relative mx-auto mt-1 w-fit font-display text-h3 font-semibold text-brand">
            <span className="invisible block whitespace-nowrap" aria-hidden="true">
              {longestFirmType}
            </span>
            {reduceMotion ? (
              <span className="absolute inset-0 flex items-center justify-center whitespace-nowrap">
                {firmTypes[0]}
              </span>
            ) : (
              <span className="absolute inset-0 flex items-center justify-center">
                <AnimatePresence mode="wait" initial={false}>
                  <m.span
                    key={activeFirmType}
                    className="absolute inset-x-0 whitespace-nowrap"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{
                      duration: 0.4,
                      ease: [0.65, 0, 0.35, 1],
                    }}
                  >
                    {activeFirmType}
                  </m.span>
                </AnimatePresence>
              </span>
            )}
          </p>
        </div>

        <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-center">
          <Button
            id="hero-cta"
            variant="primary"
            size="lg"
            href={ENQUIRY_CHECK_HREF}
            data-cta="measure-enquiries"
            className="w-full sm:w-auto"
          >
            {hero.ctaLabel}
          </Button>
          <Button
            variant="secondary"
            size="lg"
            href={SPEAK_TO_ALEX_HREF}
            className="w-full sm:w-auto"
          >
            {hero.secondaryCtaLabel}
          </Button>
        </div>

        <p className="mt-4 mb-16 text-small text-ink-subtle lg:mb-20">
          {hero.caption}
        </p>
      </Container>
    </section>
  );
}
