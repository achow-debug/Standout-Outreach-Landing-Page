"use client";

import { faqs as newFaqs, sectionLabels } from "@/content/landing";
import { Accordion, type AccordionEntry } from "@/components/official/accordion";
import { DpaRequestTrigger } from "@/components/official/dpa-request";
import { SectionLabel } from "@/components/official/section-label";
import { officialCopy } from "@/lib/official-copy";

function Answer({ text }: { text: string }) {
  return text.split("\n\n").map((paragraph) => (
    <p key={paragraph} className="official-faq-answer t-body">
      {paragraph}
    </p>
  ));
}

/**
 * One answer open at a time. New questions lead; existing answers are unchanged
 * where they conflict with the plan (see PLACEHOLDERS.md).
 */
export function Faq() {
  const items: AccordionEntry[] = [
    ...newFaqs.map((item) => ({
      id: item.id,
      title: item.question,
      children:
        "paragraphs" in item ? (
          <>
            {item.paragraphs.map((paragraph) => (
              <p key={paragraph} className="official-faq-answer t-body">
                {paragraph}
              </p>
            ))}
            {"dpaLink" in item ? (
              <DpaRequestTrigger className="official-faq-dpa">
                {item.dpaLink}
              </DpaRequestTrigger>
            ) : null}
          </>
        ) : (
          <Answer text={item.answer} />
        ),
    })),
    ...officialCopy.faq.items.map((item) => ({
      id: item.id,
      title: item.question,
      children: <Answer text={item.answer} />,
    })),
  ];

  return (
    <section
      className="official-faq"
      id="faqs"
      aria-labelledby="official-faq-heading"
      tabIndex={-1}
    >
      <div className="page-shell official-faq-inner">
        <div className="official-faq-intro">
          <SectionLabel>{sectionLabels.faqs}</SectionLabel>
          <h2 id="official-faq-heading" className="official-faq-heading t-h2">
            {officialCopy.faq.heading}
          </h2>
        </div>
        <Accordion items={items} className="official-faq-list" />
      </div>
    </section>
  );
}
