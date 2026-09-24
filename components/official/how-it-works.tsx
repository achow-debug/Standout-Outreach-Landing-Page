"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useBooking } from "@/components/official/booking-provider";
import { useInView } from "@/hooks/use-in-view";
import { officialCopy } from "@/lib/official-copy";

const ACCENT_SPAN = "font-bold text-[var(--official-headline-ink)]";

function accentPhrase(text: string, phrase?: string): ReactNode {
  if (!phrase) return text;
  const index = text.indexOf(phrase);
  if (index === -1) return text;
  return (
    <>
      {text.slice(0, index)}
      <span className={ACCENT_SPAN}>{phrase}</span>
      {text.slice(index + phrase.length)}
    </>
  );
}

function ShieldIcon() {
  return (
    <svg
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
      <path d="M12 3 4.5 6.8v5.4c0 4.4 3.1 8.4 7.5 9.3 4.4-.9 7.5-4.9 7.5-9.3V6.8z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function HowStep({
  index,
  title,
  body,
  youGet,
  nextReached,
  onReach,
}: {
  index: number;
  title: string;
  body: string;
  youGet: string;
  nextReached: boolean;
  onReach: (index: number) => void;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, threshold: 0.3 });

  useEffect(() => {
    if (inView) onReach(index);
  }, [inView, index, onReach]);

  return (
    <li
      ref={ref}
      className={inView ? "official-how-step is-reached" : "official-how-step"}
      data-fill={nextReached ? "true" : "false"}
    >
      <span className="official-how-dot" aria-hidden="true" />
      <p className="official-how-step-label t-small">Step {index + 1}</p>
      <h3 className="official-how-step-title t-h3">{title}</h3>
      <p className="official-how-step-body t-body">{body}</p>
      <p className="official-how-you-get t-body">
        <strong>You get:</strong> {youGet}
      </p>
    </li>
  );
}

/**
 * Merged process section: pilot steps, timeline, paid add-on, compliance.
 * The progress line fills as each step enters view.
 */
export function HowItWorks() {
  const {
    eyebrow,
    heading,
    headingSecond,
    intro,
    introAccentPhrase,
    pill,
    steps,
    timeline,
    addOn,
    compliance,
    ctaLabel,
    ctaNote,
  } = officialCopy.howItWorks;
  const { openBooking } = useBooking();
  const [reached, setReached] = useState<boolean[]>(() => steps.map(() => false));

  const onReach = useCallback((index: number) => {
    setReached((prev) => {
      if (prev[index]) return prev;
      const next = [...prev];
      next[index] = true;
      return next;
    });
  }, []);

  return (
    <section
      className="official-how"
      id="how-it-works"
      aria-labelledby="official-how-heading"
      tabIndex={-1}
    >
      <div className="page-shell official-how-inner">
        <div className="official-how-stage">
          <div className="official-how-sticky">
          <div className="official-how-intro">
            <p className="official-how-eyebrow t-kicker">{eyebrow}</p>
            <h2 id="official-how-heading" className="official-how-heading t-h2">
              <span className="official-how-heading-line">{heading}</span>
              <span className="official-how-heading-line">{headingSecond}</span>
            </h2>
            <p className="official-how-intro-body t-lead">
              {accentPhrase(intro, introAccentPhrase)}
            </p>
          </div>
          <div className="official-how-cta">
            <button
              type="button"
              className="btn btn-primary btn-cta"
              data-booking-cta=""
              onClick={() => openBooking("how")}
            >
              {ctaLabel}
              <span className="btn-cta-arrow" aria-hidden="true">
                →
              </span>
            </button>
            <p className="official-how-cta-note t-small">{ctaNote}</p>
          </div>
          </div>

          <div className="official-how-main">
          <div className="official-how-panel">
            <p className="official-how-pill t-small">{pill}</p>
            <ol className="official-how-steps">
              {steps.map((step, index) => (
                <HowStep
                  key={step.id}
                  index={index}
                  title={step.title}
                  body={step.body}
                  youGet={step.youGet}
                  nextReached={Boolean(reached[index + 1])}
                  onReach={onReach}
                />
              ))}
            </ol>
          </div>

          <ol className="official-how-timeline">
            {timeline.map((item) => (
              <li key={item.id} className="official-how-timeline-item">
                <span className="official-how-timeline-dot" aria-hidden="true" />
                <p className="official-how-timeline-label">{item.label}</p>
                <p className="official-how-timeline-caption t-small">{item.caption}</p>
              </li>
            ))}
          </ol>

          <div className="official-how-addon">
            <p className="official-how-addon-pill t-small">{addOn.kicker}</p>
            <h3 className="official-how-step-title t-h3">{addOn.title}</h3>
            <p className="official-how-step-body t-body">{addOn.body}</p>
          </div>
          </div>
        </div>

        <div
          className="official-how-compliance"
          role="note"
          aria-labelledby="official-how-compliance-heading"
        >
          <div className="official-how-compliance-lead">
            <p className="official-how-compliance-label t-kicker">
              <ShieldIcon />
              {compliance.kicker}
            </p>
            <h3 id="official-how-compliance-heading" className="official-how-step-title t-h3">
              {compliance.title}
            </h3>
          </div>
          <p className="official-how-step-body t-body">{compliance.body}</p>
        </div>
      </div>
    </section>
  );
}
