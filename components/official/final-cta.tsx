"use client";

import Image from "next/image";
import { useBooking } from "@/components/official/booking-provider";
import { Button } from "@/components/ui/Button";
import { SectionShell } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { StepList } from "@/components/ui/StepList";
import { ENQUIRY_CHECK_HREF, SPEAK_TO_ALEX_HREF } from "@/lib/cta";
import { officialCopy } from "@/lib/official-copy";
import { siteConfig } from "@/lib/site-config";
import type { ReactNode } from "react";

/** Wrap hyphenated compounds so they never break (§3.3). Copy unchanged. */
function keepCompound(text: string, compound: string): ReactNode {
  const parts = text.split(compound);
  if (parts.length === 1) return text;
  return parts.reduce<ReactNode[]>((acc, part, index) => {
    if (index > 0) {
      acc.push(
        <span key={`c-${index}`} className="whitespace-nowrap">
          {compound}
        </span>,
      );
    }
    if (part) acc.push(part);
    return acc;
  }, []);
}

/**
 * Final CTA (§10.8). Paper background. Left-aligned on the content line on lg+
 * (terminal PathNode wired in motion phase). Centred on mobile.
 */
export function OfficialFinalCta() {
  const { headingLines, steps, primaryCta, secondaryCta, trust, microcopy } =
    officialCopy.finalCta;
  const thankYou = officialCopy.thankYou;
  const { portraitSrc, portraitAlt } = officialCopy.founder;
  const { booked } = useBooking();

  const stepItems = steps.map((step) => ({
    title: step.title,
    body: <p className="m-0">{keepCompound(step.body, "follow-up")}</p>,
  }));

  return (
    <SectionShell
      id="book"
      tone="paper"
      pathAlign
      className="scroll-mt-(--nav-offset)"
      contentClassName="relative max-lg:text-center"
    >
      {/*
        Terminal PathNode sits on the path line here in the motion phase
        (<PathNode terminal />). Keep this wrapper relative for alignment.
      */}
      <Reveal>
        <h2
          id="official-closing-heading"
          className="font-display text-h2 text-ink max-lg:mx-auto"
        >
          {headingLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>
      </Reveal>

      <StepList
        className="mt-12 text-left lg:mt-16"
        steps={stepItems}
      />

      <div className="mt-12 flex w-full flex-col gap-3 sm:flex-row max-lg:items-stretch sm:max-lg:justify-center lg:justify-start">
        <Button
          variant="primary"
          size="lg"
          href={ENQUIRY_CHECK_HREF}
          data-cta="measure-enquiries"
          className="w-full sm:w-auto"
        >
          {primaryCta}
        </Button>
        <Button
          variant="secondary"
          size="lg"
          href={SPEAK_TO_ALEX_HREF}
          className="w-full sm:w-auto"
        >
          {secondaryCta}
        </Button>
      </div>

      <p className="mt-4 text-small text-ink-subtle text-pretty">{trust}</p>
      <p className="mt-2 text-small text-ink-subtle text-pretty">{microcopy}</p>

      {booked ? (
        <div className="mt-12 flex w-full max-w-lead flex-col gap-4 border-t border-line pt-10 max-lg:mx-auto max-lg:items-center">
          <div className="relative size-16 overflow-hidden rounded-full">
            <Image
              src={portraitSrc}
              alt={portraitAlt}
              width={128}
              height={128}
              className="absolute inset-0 size-full origin-[50%_8%] scale-[2] object-cover object-[50%_8%]"
            />
          </div>
          <h3 className="m-0 font-display text-h2 text-ink">{thankYou.heading}</h3>
          <ul className="m-0 mt-2 flex list-none flex-col gap-3 p-0 text-lead text-ink-muted">
            {thankYou.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
          <div className="flex flex-col gap-1">
            <a
              className="inline-flex min-h-11 items-center gap-3 text-brand underline-offset-4 hover:underline"
              href={`mailto:${siteConfig.contactEmail}`}
            >
              Email
              <span className="font-normal">{siteConfig.contactEmail}</span>
            </a>
            <a
              className="inline-flex min-h-11 items-center text-brand underline-offset-4 hover:underline"
              href={siteConfig.contactWhatsAppHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
          </div>
        </div>
      ) : null}
    </SectionShell>
  );
}
