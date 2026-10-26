"use client";

import { useRef } from "react";
import { SourceButton } from "@/components/official/source-button";
import { useCtaActions } from "@/lib/cta";
import { officialCopy } from "@/lib/official-copy";

const copy = officialCopy.personalised;

const ctaButtonClass =
  "inline-flex w-full items-center justify-center min-h-[52px] px-6 rounded-xl bg-brand text-white text-button hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-auto";

const badgeClass =
  "absolute -top-3.5 -right-2 z-20 inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-xl border-0 bg-surface px-2 text-small font-semibold text-ink-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand lg:-top-5 lg:-left-5 lg:right-auto";

type Row = (typeof copy.rows)[number];

function hasBadge(row: Row): row is Extract<Row, { badge: string }> {
  return "badge" in row;
}

/**
 * Two feature rows after the tools strip.
 * Paper canvas, purple only on each card’s mention.
 * Photos stay labelled placeholders until the real crops are dropped in.
 */
export function PersonalisedWork() {
  const { startForFree } = useCtaActions("personalised");
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <section
      id="personalised"
      className="relative z-10 -mt-10 scroll-mt-24 rounded-t-[2rem] bg-canvas lg:-mt-16 lg:rounded-t-[3.75rem]"
      aria-labelledby="personalised-heading"
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-12 px-6 py-20 md:gap-16 md:px-8 md:py-32">
        {copy.rows.map((row, index) => (
          <FeatureRow key={row.id} row={row} index={index} />
        ))}
        <div className="mx-auto flex w-full max-w-[421px] flex-col items-center gap-4 pt-4 text-center lg:pt-8">
          <button
            ref={buttonRef}
            type="button"
            data-cta="measure-enquiries"
            onClick={() => startForFree(buttonRef.current)}
            className={ctaButtonClass}
          >
            {copy.ctaLabel}
          </button>
          <p className="mt-3 text-small text-ink-muted">{copy.caption}</p>
        </div>
      </div>
    </section>
  );
}

function FeatureRow({ row, index }: { row: Row; index: number }) {
  const textFirst = index % 2 === 0;

  return (
    <div className="grid w-full grid-cols-1 items-center gap-8 md:gap-12 lg:grid-cols-2">
      <div
        className={`flex items-center justify-center lg:px-8 lg:py-16 ${
          textFirst ? "lg:justify-end" : "lg:justify-start"
        }`}
      >
        <div className="flex w-full max-w-[480px] flex-col gap-3 text-center lg:gap-6 lg:text-left">
          <h2
            id={index === 0 ? "personalised-heading" : undefined}
            className="m-0 text-h2 text-ink max-w-[22ch]"
          >
            {row.heading}
          </h2>
          <p className="m-0 mt-5 text-lead text-ink-muted max-w-[60ch]">
            {row.body}
          </p>
        </div>
      </div>
      <div
        className={`relative flex items-center justify-center lg:min-h-[420px] ${
          textFirst ? "lg:justify-start" : "lg:order-first lg:justify-end"
        }`}
      >
        <div className="relative w-full max-w-[500px]">
          <div className="aspect-[5/4] overflow-hidden rounded-2xl">
            <div
              className="flex h-full items-center justify-center bg-surface"
              role="img"
              aria-label={row.photoLabel}
            >
              <p className="m-0 text-small font-semibold text-ink-muted">{row.photoLabel}</p>
            </div>
          </div>
          <div
            className={`absolute z-10 w-[min(17.5rem,86%)] rounded-2xl border border-line bg-surface px-4 py-3 lg:w-72 ${
              textFirst
                ? "top-[8%] right-4 pr-10 pl-3 lg:right-6 lg:pr-4 lg:pl-10"
                : "bottom-[8%] left-4 px-3 lg:left-6 lg:px-4"
            }`}
          >
            {hasBadge(row) ? (
              <SourceButton
                sourceId={row.sourceId}
                label="Harvard Business Review"
                className={badgeClass}
              >
                {row.badge}
              </SourceButton>
            ) : null}
            <p className="m-0 text-lead text-ink">{row.card}</p>
            <p className="m-0 mt-3 text-small font-semibold text-ink-muted">{row.mention}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
