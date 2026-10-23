"use client";

import { useRef } from "react";
import { SourceButton } from "@/components/official/source-button";
import { useCtaActions } from "@/lib/cta";
import { officialCopy } from "@/lib/official-copy";

const copy = officialCopy.personalised;

const ctaButtonClass =
  "inline-flex h-14 w-full items-center justify-center gap-2 rounded-lg px-5 text-base font-semibold whitespace-nowrap transition-colors focus-visible:outline-none! focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-canvas lg:w-auto";

const badgeClass =
  "absolute -top-3.5 -right-2 z-20 flex size-9 cursor-pointer items-center justify-center rounded-[10px] border-0 bg-white/80 p-0 text-[11px] font-semibold tracking-tight text-ink shadow-[inset_0_3.5px_3.5px_rgba(255,255,255,0.25),inset_0_-3.5px_3.5px_rgba(255,255,255,0.25),0_20px_44px_rgba(157,159,185,0.3)] backdrop-blur-[7px] focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none lg:-top-5 lg:-left-5 lg:right-auto lg:size-11 lg:text-xs";

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
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 px-4 py-16 lg:gap-10 lg:px-6 lg:py-24">
        {copy.rows.map((row, index) => (
          <FeatureRow key={row.id} row={row} index={index} />
        ))}
        <div className="mx-auto flex w-full max-w-[421px] flex-col items-center gap-4 pt-4 text-center lg:pt-8">
          <p className="m-0 text-base text-ink">{copy.ctaIntro}</p>
          <button
            ref={buttonRef}
            type="button"
            data-cta="measure-enquiries"
            onClick={() => startForFree(buttonRef.current)}
            className={`group ${ctaButtonClass} bg-brand text-white shadow-lg shadow-brand/20 hover:bg-brand-dark`}
          >
            {copy.ctaLabel}
            <span
              aria-hidden
              className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
            >
              →
            </span>
          </button>
          <p className="m-0 max-w-[22rem] text-sm text-muted lg:max-w-none">
            {copy.caption}
          </p>
        </div>
      </div>
    </section>
  );
}

function FeatureRow({ row, index }: { row: Row; index: number }) {
  const textFirst = index % 2 === 0;

  return (
    <div className="grid w-full grid-cols-1 items-center gap-6 lg:grid-cols-2">
      <div
        className={`flex items-center justify-center lg:px-8 lg:py-16 ${
          textFirst ? "lg:justify-end" : "lg:justify-start"
        }`}
      >
        <div className="flex w-full max-w-[480px] flex-col gap-3 text-center lg:gap-6 lg:text-left">
          <h2
            id={index === 0 ? "personalised-heading" : undefined}
            className="m-0 font-display text-[28px] leading-[1.1] font-semibold tracking-[0.01em] text-balance text-ink lg:text-[48px]"
          >
            {row.heading}
          </h2>
          <p className="m-0 text-base leading-[1.3] text-balance text-ink">
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
              className="flex h-full items-center justify-center border border-dashed border-line bg-surface"
              role="img"
              aria-label={row.photoLabel}
            >
              <p className="m-0 text-sm font-medium text-muted">{row.photoLabel}</p>
            </div>
          </div>
          <div
            className={`absolute z-10 w-[min(17.5rem,86%)] rounded-xl border border-line bg-white py-2.5 shadow-[0_4px_0_0_rgba(0,0,0,0.25)] lg:w-72 lg:py-3 ${
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
            <p className="m-0 text-xs leading-snug font-medium text-ink lg:text-sm">
              {row.card}
            </p>
            <div aria-hidden className="my-2 h-px bg-ink/5" />
            <p className="m-0 text-xs leading-snug font-medium text-brand lg:text-sm">
              {row.mention}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
