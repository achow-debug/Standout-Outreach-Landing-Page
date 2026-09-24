"use client";

import { useId, useState } from "react";
import { officialCopy } from "@/lib/official-copy";

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={open ? "official-faq-chevron is-open" : "official-faq-chevron"}
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

/**
 * Draft FAQ. Answers marked TODO still need Alex's approval.
 * Several items can be open at once.
 */
export function Faq() {
  const { heading, items } = officialCopy.faq;
  const baseId = useId();
  const [openIds, setOpenIds] = useState<string[]>([]);

  function toggle(id: string) {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }

  return (
    <section
      className="official-faq"
      id="faq"
      aria-labelledby="official-faq-heading"
      tabIndex={-1}
    >
      <div className="page-shell official-faq-inner">
        <h2 id="official-faq-heading" className="official-faq-heading t-h2">
          {heading}
        </h2>
        <div className="official-faq-list">
          {items.map((item) => {
            const open = openIds.includes(item.id);
            const buttonId = `${baseId}-${item.id}-button`;
            const panelId = `${baseId}-${item.id}-panel`;

            return (
              <div key={item.id} className="official-faq-item">
                <button
                  id={buttonId}
                  type="button"
                  className="official-faq-trigger"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => toggle(item.id)}
                >
                  <span className="official-faq-question">{item.question}</span>
                  <Chevron open={open} />
                </button>
                <div
                  id={panelId}
                  className="expand"
                  data-open={open ? "true" : "false"}
                  role="region"
                  aria-labelledby={buttonId}
                >
                  <div>
                    {item.answer.split("\n\n").map((paragraph) => (
                      <p key={paragraph} className="official-faq-answer t-body">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
