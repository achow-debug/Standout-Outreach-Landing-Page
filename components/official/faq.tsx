"use client";

import { faqs as newFaqs, sectionLabels } from "@/content/landing";
import { Accordion, type AccordionEntry } from "@/components/official/accordion";
import { DpaRequestTrigger } from "@/components/official/dpa-request";
import { SectionLabel } from "@/components/official/section-label";
import { Reveal } from "@/components/ui/Reveal";
import { SectionShell } from "@/components/ui/Container";
import { officialCopy } from "@/lib/official-copy";

function Answer({ text }: { text: string }) {
  return text.split("\n\n").map((paragraph) => (
    <p key={paragraph} className="m-0 [&+&]:mt-3">
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
              <p key={paragraph} className="m-0 [&+&]:mt-3">
                {paragraph}
              </p>
            ))}
            {"dpaLink" in item ? (
              <DpaRequestTrigger className="mt-4 inline-flex min-h-11 items-center font-semibold text-brand underline-offset-4 hover:underline">
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
    <SectionShell
      id="faqs"
      tone="paper"
      pathAlign
      aria-labelledby="official-faq-heading"
      className="scroll-mt-(--nav-offset)"
    >
      <Reveal>
        <SectionLabel>{sectionLabels.faqs}</SectionLabel>
        <h2
          id="official-faq-heading"
          className="mt-4 max-w-heading font-display text-h2 text-ink"
        >
          {officialCopy.faq.heading}
        </h2>
      </Reveal>
      <Accordion items={items} className="mt-12 lg:mt-16" />
    </SectionShell>
  );
}
