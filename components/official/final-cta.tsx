"use client";

import { useRef } from "react";
import Image from "next/image";
import { useBooking } from "@/components/official/booking-provider";
import { useCtaActions } from "@/lib/cta";
import { officialCopy } from "@/lib/official-copy";
import { siteConfig } from "@/lib/site-config";

const closeButtonClass =
  "inline-flex h-14 w-full items-center justify-center gap-2 rounded-lg px-5 text-base font-semibold whitespace-nowrap transition-colors focus-visible:outline-none! focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface lg:w-auto";

/**
 * Cream close before the footer. Two-line headline, three numbered steps,
 * then the enquiry form and Speak to Alex. A booking adds the thank-you
 * underneath and leaves this close in place.
 */
export function OfficialFinalCta() {
  const { headingLines, steps, primaryCta, secondaryCta, trust, microcopy } =
    officialCopy.finalCta;
  const tools = officialCopy.noDisruption.tools;
  const thankYou = officialCopy.thankYou;
  const { portraitSrc, portraitAlt } = officialCopy.founder;
  const { booked } = useBooking();
  const { startForFree, speakToAlex } = useCtaActions("final");
  const primaryRef = useRef<HTMLButtonElement>(null);

  return (
    <section
      className="official-closing scroll-mt-28 bg-surface"
      id="book"
      aria-labelledby="official-closing-heading"
      tabIndex={-1}
    >
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center px-4 py-16 lg:px-6 lg:py-24">
        <h2
          id="official-closing-heading"
          className="m-0 flex flex-col items-center text-center font-display text-[26px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink lg:text-5xl lg:leading-[1.1]"
        >
          {headingLines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>

        <ol className="m-0 mt-10 grid w-full max-w-[896px] list-none gap-0 p-0 text-left lg:mt-12 lg:grid-cols-3 lg:gap-14">
          {steps.map((step, index) => {
            const isLast = index === steps.length - 1;
            return (
              <li
                key={step.title}
                className="relative flex gap-5 pb-9 last:pb-0 lg:flex-col lg:gap-4 lg:pb-0"
              >
                {isLast ? null : (
                  <span
                    aria-hidden
                    className="absolute top-9 bottom-0 left-[17.5px] w-px bg-line lg:top-[17.5px] lg:-right-3 lg:bottom-auto lg:left-12 lg:h-px lg:w-auto"
                  />
                )}
                <span
                  aria-hidden
                  className="official-closing-step-num relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full border border-line bg-white text-sm leading-none text-ink"
                >
                  {index + 1}
                </span>
                <div className="flex min-w-0 flex-col gap-2 pt-1.5 lg:pt-0">
                  <h3 className="m-0 font-display text-lg leading-none font-medium tracking-[-0.01em] text-balance text-ink lg:text-xl">
                    {step.title}
                  </h3>
                  <p className="m-0 text-sm leading-snug text-pretty text-ink lg:w-[90%]">
                    {step.body}
                  </p>
                  {isLast ? (
                    <ul className="m-0 flex list-none flex-wrap items-center gap-3 p-0 pt-2">
                      {tools.map((tool) => (
                        <li key={tool.id}>
                          <span
                            aria-hidden
                            className={`flex size-6 items-center justify-center rounded-md font-semibold text-white ${
                              tool.mark.length > 1
                                ? "text-[8px] tracking-tight"
                                : "text-[11px]"
                            }`}
                            style={{ backgroundColor: tool.color }}
                          >
                            {tool.mark}
                          </span>
                          <span className="sr-only">{tool.name}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-10 flex w-full max-w-[421px] flex-col items-center gap-4 text-center lg:mt-14 lg:max-w-none">
          <div
            id="final-cta"
            className="flex w-full flex-col gap-4 lg:w-auto lg:flex-row lg:flex-wrap lg:justify-center"
          >
            <button
              ref={primaryRef}
              type="button"
              data-cta="measure-enquiries"
              onClick={() => startForFree(primaryRef.current)}
              className={`group ${closeButtonClass} bg-brand text-white shadow-lg shadow-brand/20 hover:bg-brand-dark`}
            >
              {primaryCta}
              <span
                aria-hidden
                className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
              >
                →
              </span>
            </button>
            <button
              type="button"
              data-booking-cta=""
              onClick={() => speakToAlex()}
              className={`${closeButtonClass} border border-brand bg-transparent text-brand hover:bg-accent-soft`}
            >
              {secondaryCta}
            </button>
          </div>
          <p className="m-0 text-sm leading-snug text-balance text-muted">{trust}</p>
          <p className="m-0 text-sm leading-snug text-balance text-muted">{microcopy}</p>
        </div>

        {booked ? (
          <div className="official-closing-thanks mt-12 flex w-full max-w-xl flex-col items-center gap-4 border-t border-line pt-10 text-center lg:mt-16">
            <div className="relative size-[4.5rem] overflow-hidden rounded-full">
              <Image
                src={portraitSrc}
                alt={portraitAlt}
                width={144}
                height={144}
                className="absolute inset-0 size-full origin-[50%_8%] scale-[2] object-cover object-[50%_8%]"
              />
            </div>
            <h3 className="m-0 font-display text-2xl leading-none font-semibold tracking-[-0.02em] text-ink">
              {thankYou.heading}
            </h3>
            <ul className="m-0 flex list-none flex-col gap-2 p-0 text-base leading-snug text-ink">
              {thankYou.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
            <div className="flex flex-col items-center">
              <a
                className="inline-flex min-h-11 items-center gap-3 font-semibold text-ink underline underline-offset-[3px] hover:text-brand"
                href={`mailto:${siteConfig.contactEmail}`}
              >
                Email
                <span className="font-normal">{siteConfig.contactEmail}</span>
              </a>
              <a
                className="inline-flex min-h-11 items-center font-semibold text-ink underline underline-offset-[3px] hover:text-brand"
                href={siteConfig.contactWhatsAppHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
