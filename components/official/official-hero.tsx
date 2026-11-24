"use client";

import { ENQUIRY_CHECK_HREF, SPEAK_TO_ALEX_HREF } from "@/lib/cta";
import { officialCopy } from "@/lib/official-copy";
import { FirmTypeRotator } from "@/components/official/firm-type-rotator";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

/**
 * Centred hero (§10.3). H1 is static for LCP. One purple highlight: the
 * rotating firm-type line. CTAs use the shared Button.
 */
export function OfficialHero() {
  const { hero } = officialCopy;

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
        <FirmTypeRotator size="hero" className="mt-6 lg:mt-8" />

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
