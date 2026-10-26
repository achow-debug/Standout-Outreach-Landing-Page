"use client";

import { useRef } from "react";
import { useCtaActions } from "@/lib/cta";
import { officialCopy } from "@/lib/official-copy";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

const heroPrimaryClass = `inline-flex w-full items-center justify-center min-h-[52px] px-6 rounded-xl bg-brand text-white text-button hover:bg-brand-hover sm:w-auto ${focusRing}`;

const heroSecondaryClass = `inline-flex w-full items-center justify-center min-h-[52px] px-6 rounded-xl border-[1.5px] border-ink text-ink text-button bg-transparent hover:bg-ink/5 sm:w-auto ${focusRing}`;

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
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center px-6 pb-20 text-center pt-[calc(env(safe-area-inset-top)+9.75rem)] md:px-8 md:pb-32 md:pt-[calc(env(safe-area-inset-top)+10rem)] lg:pt-[calc(env(safe-area-inset-top)+7.75rem)]">
        <div className="hero-in w-full">
          <p className="text-eyebrow text-ink-muted">{hero.eyebrow}</p>
          <h1 id="official-hero-heading" className="text-display text-ink max-w-[18ch] mx-auto mt-3">
            {hero.headingLead} <br className="hidden sm:inline" />
            <span className="text-brand">{hero.headingAccent}</span>
          </h1>
        </div>
        <div className="hero-in hero-in-delay mt-8 flex w-full flex-col items-center">
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-center">
            <button
              ref={buttonRef}
              id="hero-cta"
              type="button"
              data-cta="measure-enquiries"
              onClick={() => startForFree(buttonRef.current)}
              className={heroPrimaryClass}
            >
              {hero.ctaLabel}
            </button>
            <button type="button" onClick={() => speakToAlex()} className={heroSecondaryClass}>
              {hero.secondaryCtaLabel}
            </button>
          </div>
          <p className="mt-3 text-small text-ink-muted">{hero.caption}</p>
        </div>
      </div>
    </section>
  );
}
