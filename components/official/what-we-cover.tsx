import {
  officialCopy,
  type OfficialWhatWeCoverStep,
} from "@/lib/official-copy";
import type { ReactNode } from "react";

const ACCENT_SPAN = "text-[var(--color-accent)] font-extrabold";

const STEP_DELAYS = [
  "motion-enter--0",
  "motion-enter--1",
  "motion-enter--2",
] as const;

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

function CoverStep({
  item,
  delayClass,
}: {
  item: OfficialWhatWeCoverStep;
  delayClass: string;
}) {
  return (
    <li className={`official-cover-item motion-enter ${delayClass}`}>
      <span className="official-cover-index" aria-hidden="true">
        {item.index}
      </span>
      <div className="official-cover-item-copy">
        <h3 className="official-cover-item-title">{item.title}</h3>
        <p className="official-cover-item-body">{item.body}</p>
      </div>
    </li>
  );
}

/**
 * Light process band: headline left, 01–03 + optional + principle right.
 */
export function WhatWeCover() {
  const {
    eyebrow,
    heading,
    headingAccent,
    intro,
    introAccentPhrase,
    steps,
    optional,
    principle,
    footnote,
  } = officialCopy.whatWeCover;

  return (
    <section
      className="official-cover"
      id="what-we-cover"
      aria-labelledby="official-cover-heading"
      tabIndex={-1}
    >
      <div className="page-shell official-cover-inner">
        <div className="official-cover-intro">
          <p className="official-cover-eyebrow">{eyebrow}</p>
          <h2 id="official-cover-heading" className="official-cover-heading">
            <span className="official-cover-heading-line">{heading}</span>
            <span className="official-cover-heading-line">{headingAccent}</span>
          </h2>
          <p className="official-cover-intro-body">
            {accentPhrase(intro, introAccentPhrase)}
          </p>
        </div>
        <div className="official-cover-process">
          <ol className="official-cover-list">
            {steps.map((item, index) => (
              <CoverStep
                key={item.id}
                item={item}
                delayClass={STEP_DELAYS[index] ?? "motion-enter--0"}
              />
            ))}
          </ol>
          <p className="official-cover-footnote">{footnote}</p>
          <div className="official-cover-item official-cover-optional">
            <span className="official-cover-index official-cover-kicker">
              {optional.kicker}
            </span>
            <div className="official-cover-item-copy">
              <h3 className="official-cover-item-title">{optional.title}</h3>
              <p className="official-cover-item-body">{optional.body}</p>
            </div>
          </div>
          <div className="official-cover-principle">
            <h3 className="official-cover-item-title">{principle.title}</h3>
            <p className="official-cover-item-body">{principle.body}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
