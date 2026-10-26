"use client";

import { useRef } from "react";
import Image from "next/image";
import { useBooking } from "@/components/official/booking-provider";
import { useCtaActions } from "@/lib/cta";
import { officialCopy } from "@/lib/official-copy";
import { siteConfig } from "@/lib/site-config";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

const closePrimaryClass = `inline-flex w-full items-center justify-center min-h-[52px] px-6 rounded-xl bg-brand text-white text-button hover:bg-brand-hover sm:w-auto ${focusRing}`;

const closeSecondaryClass = `inline-flex w-full items-center justify-center min-h-[52px] px-6 rounded-xl border-[1.5px] border-ink text-ink text-button bg-transparent hover:bg-ink/5 sm:w-auto ${focusRing}`;

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
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center px-6 py-20 md:px-8 md:py-32">
        <h2
          id="official-closing-heading"
          className="m-0 flex flex-col items-center text-center text-h2 text-ink max-w-[22ch]"
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
                  className="official-closing-step-num relative z-10 flex size-11 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-small leading-none text-ink"
                >
                  {index + 1}
                </span>
                <div className="flex min-w-0 flex-col gap-2 pt-1.5 lg:pt-0">
                  <h3 className="m-0 text-h3 text-ink">{step.title}</h3>
                  <p className="m-0 mt-4 text-body text-ink max-w-[62ch]">
                    {step.body}
                  </p>
                  {isLast ? (
                    <ul className="m-0 flex list-none flex-wrap items-center gap-3 p-0 pt-2">
                      {tools.map((tool) => (
                        <li key={tool.id}>
                          <span
                            aria-hidden
                            className="flex h-12 items-center text-small font-semibold text-ink-muted md:h-14"
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

        <div className="mt-8 flex w-full flex-col items-center text-center">
          <div
            id="final-cta"
            className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-center"
          >
            <button
              ref={primaryRef}
              type="button"
              data-cta="measure-enquiries"
              onClick={() => startForFree(primaryRef.current)}
              className={closePrimaryClass}
            >
              {primaryCta}
            </button>
            <button
              type="button"
              data-booking-cta=""
              onClick={() => speakToAlex()}
              className={closeSecondaryClass}
            >
              {secondaryCta}
            </button>
          </div>
          <p className="mt-3 text-small text-ink-muted">{trust}</p>
          <p className="mt-3 text-small text-ink-muted">{microcopy}</p>
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
            <h3 className="m-0 text-h2 text-ink max-w-[22ch]">{thankYou.heading}</h3>
            <ul className="m-0 mt-5 flex list-none flex-col gap-4 p-0 text-lead text-ink-muted">
              {thankYou.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
            <div className="flex flex-col items-center">
              <a
                className="inline-flex min-h-11 items-center gap-3 text-brand underline underline-offset-4 hover:text-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                href={`mailto:${siteConfig.contactEmail}`}
              >
                Email
                <span className="font-normal">{siteConfig.contactEmail}</span>
              </a>
              <a
                className="inline-flex min-h-11 items-center text-brand underline underline-offset-4 hover:text-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
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
