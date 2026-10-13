"use client";

import { useCallback } from "react";
import { Accordion, type AccordionEntry } from "@/components/official/accordion";
import { useBooking } from "@/components/official/booking-provider";
import { keepTogether } from "@/components/official/no-break";
import { usePracticeArea, type PracticeArea } from "@/components/official/practice-area";
import { SectionLabel } from "@/components/official/section-label";
import { sectionLabels, whoItsFor } from "@/content/landing";
import { officialCopy, type OfficialWhoItsForItem } from "@/lib/official-copy";

function WhoItem({ item }: { item: OfficialWhoItsForItem }) {
  return (
    <li className="official-who-item">
      <span className="official-who-rule" aria-hidden="true" />
      <h3 className="official-who-item-title t-h3">{item.title}</h3>
      <p className="official-who-item-body t-body">{item.body}</p>
    </li>
  );
}

function areaForCard(id: string): PracticeArea | null {
  const card = whoItsFor.cards.find((item) => item.id === id);
  return card ? card.context : null;
}

function PracticeAreaCards() {
  const { setPracticeArea } = usePracticeArea();
  const { openBooking } = useBooking();
  const applyLabel = officialCopy.header.applyLabel;

  const onValueChange = useCallback(
    (id: string) => {
      const area = areaForCard(id);
      if (area) setPracticeArea(area);
    },
    [setPracticeArea],
  );

  const items: AccordionEntry[] = whoItsFor.cards.map((card) => ({
    id: card.id,
    title: (
      <span className="practice-card-copy">
        <span className="practice-card-title">{card.title}</span>
        <span className="practice-card-summary t-body">{card.summary}</span>
      </span>
    ),
    children: (
      <div className="practice-card-panel">
        {card.excerpt ? (
          <p className="practice-card-excerpt t-body">{card.excerpt}</p>
        ) : null}
        <a className="practice-card-link" href={card.linkHref}>
          {card.linkLabel}
        </a>
        <button
          type="button"
          className="btn btn-primary practice-card-cta"
          data-booking-cta=""
          onClick={() => openBooking("practice-card")}
        >
          {keepTogether(applyLabel)}
          <span className="btn-cta-arrow" aria-hidden="true">
            →
          </span>
        </button>
      </div>
    ),
  }));

  return (
    <Accordion className="practice-cards" items={items} onValueChange={onValueChange} />
  );
}

/**
 * Qualification band. Practice-area cards sit under the subline.
 * The qualifier list stays below them.
 */
export function WhoItsFor() {
  const { items } = officialCopy.whoItsFor;

  return (
    <section
      className="official-who"
      id="who-its-for"
      aria-labelledby="official-who-heading"
      tabIndex={-1}
    >
      <div className="page-shell official-who-inner">
        <div className="official-who-intro">
          <SectionLabel>{sectionLabels.who}</SectionLabel>
          <h2 id="official-who-heading" className="official-who-heading t-h2-feature">
            {whoItsFor.heading}
          </h2>
          <p className="official-who-supporting t-lead">{whoItsFor.supporting}</p>
        </div>
        <div className="official-who-main">
          <PracticeAreaCards />
          <p className="official-who-transparency t-body">{whoItsFor.transparency}</p>
          <ol className="official-who-list">
            {items.map((item) => (
              <WhoItem key={item.id} item={item} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
