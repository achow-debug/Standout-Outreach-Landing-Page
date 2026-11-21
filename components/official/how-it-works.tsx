import type { ReactNode } from "react";
import { CtaMicrocopy } from "@/components/official/cta-microcopy";
import { SourceButton } from "@/components/official/source-button";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionShell } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { StepList } from "@/components/ui/StepList";
import { howItWorks as howCopy, sectionLabels } from "@/content/landing";
import { SPEAK_TO_ALEX_HREF } from "@/lib/cta";
import { officialCopy } from "@/lib/official-copy";

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
 * How it works (§10.7). Step circles sit on the enquiry path on lg+.
 * Path wiring lands in the motion phase; circles already align to the path line.
 */
export function HowItWorks() {
  const {
    heading,
    headingSecond,
    pill,
    steps,
    addOn,
    compliance,
    ctaLabel,
  } = officialCopy.howItWorks;

  const stepItems = steps.map((step) => ({
    title: step.title,
    body: (
      <>
        <p className="m-0">{keepCompound(step.body, "follow-up")}</p>
        <p className="m-0 mt-3">
          <strong>You get:</strong>{" "}
          {keepCompound(step.youGet, "follow-up")}
        </p>
        {step.id === "handle-what-happens-next" ? (
          <a
            className="mt-3 inline-flex min-h-11 items-center font-semibold text-brand underline-offset-4 hover:underline"
            href={howCopy.proofHref}
          >
            {howCopy.proofLink}
          </a>
        ) : null}
      </>
    ),
  }));

  return (
    <SectionShell
      id="how-it-works"
      tone="paper"
      pathAlign
      className="scroll-mt-(--nav-offset)"
    >
      <Reveal>
        <Eyebrow>{sectionLabels.how}</Eyebrow>
        <h2
          id="official-how-heading"
          className="mt-4 max-w-heading font-display text-h2 text-ink"
        >
          <span className="block">{heading}</span>
          <span className="block">{headingSecond}</span>
        </h2>
      </Reveal>

      <p className="mt-5 max-w-lead text-lead text-ink-muted lg:mt-6">
        {howCopy.intro}
      </p>

      <aside className="mt-10 max-w-prose border-l-2 border-brand pl-6">
        <p className="m-0 font-display text-h2 text-ink tabular-nums">
          {howCopy.calloutFigure}
        </p>
        <p className="m-0 mt-3 text-body text-ink-muted">{howCopy.calloutBody}</p>
        <p className="m-0 mt-3 text-small text-ink-subtle">
          {howCopy.calloutCredit}
          <SourceButton sourceId={howCopy.calloutSourceId} />
        </p>
      </aside>

      <p className="mt-8 max-w-lead text-lead text-ink-muted">
        {howCopy.afterCallout}
      </p>

      <p className="mt-12 text-small font-semibold text-ink-muted lg:mt-16">
        {pill}
      </p>

      <StepList className="mt-12" steps={stepItems} />

      <div className="mt-12 max-w-prose border-t border-line pt-12">
        <p className="m-0 font-sans text-eyebrow uppercase text-ink-muted">
          {addOn.kicker}
        </p>
        <h3 className="mt-3 font-display text-h3 text-ink">{addOn.title}</h3>
        <p className="mt-3 text-body text-ink-muted">{addOn.body}</p>
      </div>

      <ol className="mt-12 m-0 flex list-none flex-col gap-8 border-t border-line p-0 pt-12">
        {howCopy.timeline.map((stage) => {
          const after = "afterHref" in stage ? stage : null;
          return (
            <li key={stage.title}>
              <p className="m-0 font-display text-h3 text-ink">{stage.title}</p>
              <p className="m-0 mt-3 max-w-prose text-body text-ink-muted">
                {stage.description}
              </p>
              {after ? (
                <a
                  className="mt-3 inline-flex min-h-11 items-center font-semibold text-brand underline-offset-4 hover:underline"
                  href={after.afterHref}
                >
                  {after.afterLink}
                </a>
              ) : null}
            </li>
          );
        })}
      </ol>

      <div
        className="mt-12 max-w-prose border-t border-line pt-12"
        role="note"
        aria-labelledby="official-how-compliance-heading"
      >
        <p className="m-0 text-small font-semibold text-ink-muted">
          {howCopy.legalLabel}
        </p>
        <h3
          id="official-how-compliance-heading"
          className="mt-3 font-display text-h3 text-ink"
        >
          {compliance.title}
        </h3>
        <p className="mt-3 text-body text-ink-muted">{howCopy.legalBody}</p>
      </div>

      <div className="mt-12">
        <Button
          variant="primary"
          size="lg"
          href={SPEAK_TO_ALEX_HREF}
          className="w-full sm:w-auto"
          data-booking-cta=""
        >
          {ctaLabel}
        </Button>
        <div className="mt-4">
          <CtaMicrocopy tone="light" />
        </div>
      </div>
    </SectionShell>
  );
}
