"use client";

import HeroBackground from "@/components/HeroBackground";
import { useCtaActions } from "@/lib/cta";
import { officialCopy } from "@/lib/official-copy";

/**
 * Centred hero on the light canvas.
 * Speak to Alex opens the existing booking popup via openBooking("hero").
 */
export function OfficialHero() {
  const { secondaryHref } = officialCopy.hero;
  const { startForFree, speakToAlex } = useCtaActions("hero");

  return (
    <section id="top" className="relative isolate bg-canvas" aria-labelledby="official-hero-heading">
      <HeroBackground />
      <div className="mx-auto flex max-w-5xl flex-col items-center px-5 pb-20 pt-32 text-center md:pb-24 md:pt-44">
        <div className="hero-in">
          <p className="text-base font-bold text-ink/55 md:text-xl">
            Online presence underselling your firm?
          </p>
          <h1
            id="official-hero-heading"
            className="mt-4 text-balance text-[clamp(2.25rem,6vw,5rem)] font-bold leading-[1.04] tracking-[-0.035em] text-ink"
          >
            <span className="md:block">Standout Group</span>{" "}
            <span className="md:block">makes you known for</span>{" "}
            <span className="md:block">
              your <span className="text-brand">best work</span>
            </span>
          </h1>
        </div>
        <div className="hero-in hero-in-delay mt-8 flex w-full max-w-xs flex-col items-center md:mt-10 md:max-w-none">
          <a
            href={secondaryHref}
            className="text-sm font-semibold text-ink! no-underline transition-colors hover:text-brand! md:text-base"
          >
            See how the pilot works
          </a>

          <div className="mt-3 flex w-full flex-col md:w-auto md:flex-row md:items-start md:gap-3">
            <button
              type="button"
              data-cta="speak-to-alex"
              data-booking-cta=""
              onClick={speakToAlex}
              className="inline-flex h-14 w-full items-center justify-center rounded-2xl border border-ink/15 bg-white px-6 text-base font-semibold text-ink shadow-sm transition-colors hover:border-ink/30 focus-visible:outline-none! focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-canvas md:h-16 md:w-64 md:text-lg"
            >
              Speak to Alex
            </button>

            <div className="mt-3 flex w-full flex-col items-center md:mt-0 md:w-64">
              <button
                id="hero-cta"
                type="button"
                data-cta="start-free"
                data-booking-cta=""
                onClick={startForFree}
                className="group inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-brand px-6 text-base font-semibold text-white shadow-lg shadow-brand/20 transition-colors hover:bg-brand-dark focus-visible:outline-none! focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-canvas md:h-16 md:text-lg"
              >
                Start for free
                <span
                  aria-hidden
                  className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                >
                  →
                </span>
              </button>
              <p className="mt-2 text-[0.9375rem] font-medium text-ink/70">
                30-day free pilot to see results
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
