"use client";

import { useState, type KeyboardEvent } from "react";
import { PhoneFrame } from "@/components/official/phone-frame";
import { SourceButton } from "@/components/official/source-button";
import { keepTogether } from "@/components/official/no-break";
import { Button } from "@/components/ui/Button";
import { SectionShell } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SPEAK_TO_ALEX_HREF } from "@/lib/cta";
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
      className={`size-5 shrink-0 text-ink-muted transition-transform duration-(--dur-micro) ease-(--ease-out) motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
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
      <p className="m-0 text-body text-ink-muted">{beat.body}</p>
      {proof ? (
        <div className="mt-4">
          <p className="m-0 text-body text-ink-muted">{proof.lead}</p>
          {proof.research ? (
            <p className="m-0 mt-3 text-body text-ink-muted">{proof.research}</p>
          ) : null}
          <p className="m-0 mt-3 flex flex-wrap items-center gap-1 text-small font-semibold text-ink-muted">
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
  const [openId, setOpenId] = useState<string>(beats[0].id);

  function toggle(id: string) {
    setOpenId((current) => (current === id ? "" : id));
  }

  return (
    <SectionShell
      id="firm-day"
      tone="surface-alt"
      pathAlign
      aria-labelledby="firm-day-heading"
    >
      <Reveal>
        <h2
          id="firm-day-heading"
          className="m-0 max-w-heading font-display text-h2 text-ink"
        >
          {heading}
        </h2>
      </Reveal>

      <div
        className="mt-12 hidden border-t border-line md:block lg:mt-16"
        onKeyDown={onDesktopKeyDown}
      >
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
                  className="flex w-full items-center gap-4 py-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => toggle(beat.id)}
                >
                  <span className="w-56 shrink-0 text-small font-semibold text-ink-muted">
                    {beat.kicker} · {beat.time}
                  </span>
                  <span className="min-w-0 flex-1 font-display text-h3 text-ink">
                    {beat.title}
                  </span>
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

      <div className="mt-12 flex flex-col gap-12 md:hidden">
        {beats.map((beat) => (
          <article key={beat.id}>
            <p className="m-0 text-small font-semibold text-ink-muted">
              {beat.kicker} · {beat.time}
            </p>
            <h3 className="m-0 mt-2 font-display text-h3 text-ink">
              {beat.title}
            </h3>
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

      <div className="mt-12 border-t border-line pt-10">
        <p className="m-0 font-sans text-eyebrow uppercase text-ink-muted">
          {monthly.kicker}
        </p>
        <h3 className="m-0 mt-3 max-w-heading font-display text-h3 text-ink">
          {monthly.title}
        </h3>
        <p className="m-0 mt-3 max-w-prose text-body text-ink-muted">
          {monthly.body}
        </p>
        <div className="mt-10">
          <Button
            variant="primary"
            size="lg"
            href={SPEAK_TO_ALEX_HREF}
            className="w-full sm:w-auto"
            data-booking-cta=""
          >
            {keepTogether(ctaLabel)}
          </Button>
          <p className="m-0 mt-4 max-w-prose text-small text-ink-subtle">
            {microcopy}
          </p>
        </div>
      </div>
    </SectionShell>
  );
}
