"use client";

import { useState, type KeyboardEvent } from "react";
import { useBooking } from "@/components/official/booking-provider";
import { PhoneFrame } from "@/components/official/phone-frame";
import { SourceButton } from "@/components/official/source-button";
import { keepTogether } from "@/components/official/no-break";
import { officialCopy } from "@/lib/official-copy";
import type { SourceId } from "@/content/sources";

type FirmBeat = (typeof officialCopy.firmDay.beats)[number];

type BeatProof = {
  lead: string;
  research?: string;
  credit: string;
  sourceId: SourceId;
};

function proofFor(beat: FirmBeat): BeatProof | null {
  if (!("proof" in beat)) return null;
  return beat.proof;
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-5 w-5 shrink-0 text-ink-quiet motion-safe:transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function BeatCopy({ beat }: { beat: FirmBeat }) {
  const proof = proofFor(beat);

  return (
    <div>
      <p className="t-body m-0">{beat.body}</p>
      {proof ? (
        <div className="mt-4">
          <p className="t-body m-0">{proof.lead}</p>
          {proof.research ? (
            <p className="t-body m-0 mt-3">{proof.research}</p>
          ) : null}
          <p className="m-0 mt-2 flex flex-wrap items-center gap-1 text-sm font-semibold text-ink">
            {proof.credit}
            <SourceButton sourceId={proof.sourceId} />
          </p>
        </div>
      ) : null}
    </div>
  );
}

function onDesktopKeyDown(event: KeyboardEvent<HTMLDivElement>) {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) return;
  if (!target.id.startsWith("firm-day-trigger-")) return;

  const triggers = Array.from(
    event.currentTarget.querySelectorAll<HTMLButtonElement>(
      "[id^='firm-day-trigger-']",
    ),
  );
  const index = triggers.indexOf(target);
  if (index < 0) return;

  let next = index;
  if (event.key === "ArrowDown" || event.key === "ArrowRight") {
    next = (index + 1) % triggers.length;
  } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
    next = (index - 1 + triggers.length) % triggers.length;
  } else if (event.key === "Home") {
    next = 0;
  } else if (event.key === "End") {
    next = triggers.length - 1;
  } else {
    return;
  }

  event.preventDefault();
  triggers[next]?.focus();
}

/**
 * A day after the fix: four clock beats, then the month.
 * Desktop keeps one beat open. Mobile stacks the day so it can be read by scrolling.
 */
export function FirmDay() {
  const { heading, beats, monthly, ctaLabel, microcopy } = officialCopy.firmDay;
  const { openBooking } = useBooking();
  const [openId, setOpenId] = useState<string>(beats[0].id);

  function toggle(id: string) {
    setOpenId((current) => (current === id ? "" : id));
  }

  return (
    <section
      id="firm-day"
      className="scroll-mt-24 bg-white"
      aria-labelledby="firm-day-heading"
    >
      <div className="page-shell py-16">
        <h2 id="firm-day-heading" className="t-h2 m-0 max-w-3xl">
          {heading}
        </h2>

        <div className="mt-8 hidden border-t border-line md:block" onKeyDown={onDesktopKeyDown}>
          {beats.map((beat) => {
            const open = openId === beat.id;
            const triggerId = `firm-day-trigger-${beat.id}`;
            const panelId = `firm-day-panel-${beat.id}`;
            return (
              <div key={beat.id} className="border-b border-line">
                <h3 className="m-0">
                  <button
                    type="button"
                    id={triggerId}
                    className="flex w-full items-center gap-4 py-4 text-left font-[inherit] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => toggle(beat.id)}
                  >
                    <span className="t-label w-56 shrink-0">
                      {beat.kicker} · {beat.time}
                    </span>
                    <span className="t-h3 min-w-0 flex-1">{beat.title}</span>
                    <Chevron open={open} />
                  </button>
                </h3>
                {open ? (
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={triggerId}
                    className="grid grid-cols-[minmax(0,1fr)_15rem] items-start gap-10 pb-8"
                  >
                    <BeatCopy beat={beat} />
                    <PhoneFrame
                      src={beat.image.src}
                      alt={beat.image.alt}
                      label={beat.image.label}
                    />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col gap-12 md:hidden">
          {beats.map((beat) => (
            <article key={beat.id}>
              <p className="t-label m-0">
                {beat.kicker} · {beat.time}
              </p>
              <h3 className="t-h3 m-0 mt-2">{beat.title}</h3>
              <div className="mt-3">
                <BeatCopy beat={beat} />
              </div>
              <div className="mt-6">
                <PhoneFrame
                  src={beat.image.src}
                  alt={beat.image.alt}
                  label={beat.image.label}
                />
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 border-t border-line pt-10 md:mt-14">
          <p className="t-label m-0">{monthly.kicker}</p>
          <h3 className="t-h3 m-0 mt-2 max-w-3xl">{monthly.title}</h3>
          <p className="t-body m-0 mt-4 max-w-3xl">{monthly.body}</p>
          <div className="mt-8">
            <button
              type="button"
              className="btn btn-primary btn-cta"
              data-booking-cta=""
              onClick={() => openBooking("firm-day")}
            >
              {keepTogether(ctaLabel)}
              <span className="btn-cta-arrow" aria-hidden="true">
                →
              </span>
            </button>
            <p className="m-0 mt-3 max-w-md text-[0.9375rem] font-medium leading-snug text-ink/70">
              {microcopy}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
