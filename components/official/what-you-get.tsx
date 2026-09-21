import {
  officialCopy,
  type OfficialWhatYouGetItem,
} from "@/lib/official-copy";
import type { ReactNode } from "react";

const ACCENT_SPAN = "text-[var(--color-accent)] font-extrabold";

const ITEM_DELAYS = [
  "motion-enter--0",
  "motion-enter--1",
  "motion-enter--2",
  "motion-enter--3",
] as const;

function accentPhrases(
  text: string,
  phrases?: readonly string[],
): ReactNode {
  if (!phrases?.length) return text;

  const parts: ReactNode[] = [];
  let remaining = text;

  phrases.forEach((phrase, key) => {
    const index = remaining.indexOf(phrase);
    if (index === -1) return;
    if (index > 0) parts.push(remaining.slice(0, index));
    parts.push(
      <span key={key} className={ACCENT_SPAN}>
        {phrase}
      </span>,
    );
    remaining = remaining.slice(index + phrase.length);
  });

  if (remaining) parts.push(remaining);
  return parts.length ? <>{parts}</> : text;
}

function GetCard({
  item,
  delayClass,
}: {
  item: OfficialWhatYouGetItem;
  delayClass: string;
}) {
  return (
    <li className={`official-get-card motion-enter ${delayClass}`}>
      <span className="official-get-index" aria-hidden="true">
        {item.index}
      </span>
      <h3 className="official-get-card-title">{item.title}</h3>
      <p className="official-get-card-body">
        {accentPhrases(item.body, item.accentPhrases)}
      </p>
    </li>
  );
}

/**
 * Light offer band: headline left, six equal 12px cards for the 30-day pilot.
 */
export function WhatYouGet() {
  const { eyebrow, heading, headingAccent, items } = officialCopy.whatYouGet;

  return (
    <section
      className="official-get"
      id="what-you-get"
      aria-labelledby="official-get-heading"
      tabIndex={-1}
    >
      <div className="page-shell official-get-inner">
        <div className="official-get-intro motion-enter motion-enter--0">
          <p className="official-get-eyebrow">{eyebrow}</p>
          <h2 id="official-get-heading" className="official-get-heading">
            <span className="official-get-heading-line">{heading}</span>
            <span className="official-get-heading-line">{headingAccent}</span>
          </h2>
        </div>
        <ol className="official-get-grid">
          {items.map((item, index) => (
            <GetCard
              key={item.id}
              item={item}
              delayClass={ITEM_DELAYS[index] ?? "motion-enter--3"}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}
