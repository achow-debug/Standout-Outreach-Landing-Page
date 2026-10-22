"use client";

import { useRef } from "react";
import { useCtaActions } from "@/lib/cta";
import { officialCopy } from "@/lib/official-copy";

const heroButtonClass =
  "inline-flex h-14 w-full items-center justify-center gap-2 rounded-lg px-5 text-base font-semibold whitespace-nowrap transition-colors focus-visible:outline-none! focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-canvas lg:w-auto";

/**
 * Centred hero on the paper canvas, in the Fyxer stack:
 * eyebrow, two-part headline, a short line, two buttons, then a caption.
 * The primary button opens the enquiry form. Speak to Alex opens the booking.
 */
export function OfficialHero() {
  const { hero } = officialCopy;
  const { startForFree, speakToAlex } = useCtaActions("hero");
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <section id="top" className="bg-canvas" aria-labelledby="official-hero-heading">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-6 pb-16 text-center pt-[calc(env(safe-area-inset-top)+9.75rem)] md:pt-[calc(env(safe-area-inset-top)+10rem)] lg:pt-[calc(env(safe-area-inset-top)+7.75rem)]">
        <div className="hero-in w-full">
          <p className="text-[22px] font-medium leading-[1.25] text-muted lg:text-[26px]">
            {hero.eyebrow}
          </p>
          <h1
            id="official-hero-heading"
            className="mx-auto mt-3 w-full font-display text-[33px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink lg:mt-5 lg:max-w-[780px] lg:text-[64px] lg:leading-none"
          >
            {hero.headingLead}{" "}
            <br className="hidden lg:block" />
            <span className="text-brand">{hero.headingAccent}</span>
          </h1>
        </div>
        <div className="hero-in hero-in-delay mt-8 flex w-full max-w-[421px] flex-col items-center gap-4 lg:max-w-none">
          <p className="text-base font-normal text-ink">{hero.ctaIntro}</p>
          <div className="flex w-full flex-col items-stretch gap-4 lg:w-auto lg:flex-row lg:flex-wrap lg:items-center lg:justify-center">
            <button
              ref={buttonRef}
              id="hero-cta"
              type="button"
              data-cta="measure-enquiries"
              onClick={() => startForFree(buttonRef.current)}
              className={`group ${heroButtonClass} bg-brand text-white shadow-lg shadow-brand/20 hover:bg-brand-dark`}
            >
              {hero.ctaLabel}
              <span
                aria-hidden
                className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
              >
                →
              </span>
            </button>
            <button
              type="button"
              onClick={() => speakToAlex()}
              className={`${heroButtonClass} border border-brand bg-transparent text-brand hover:bg-accent-soft`}
            >
              {hero.secondaryCtaLabel}
            </button>
          </div>
          <p className="text-sm font-normal text-muted">{hero.caption}</p>
        </div>
      </div>
    </section>
  );
}
