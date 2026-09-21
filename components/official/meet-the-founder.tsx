"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { officialCopy } from "@/lib/official-copy";

/**
 * Navy accordion modelled on Student Venture’s “Built around you” band.
 * Opens when the visitor arrives on #founder.
 */
export function MeetTheFounder() {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const { heading, portraitAlt, portraitSrc, paragraphs } =
    officialCopy.founder;
  const [lead, ...rest] = paragraphs;

  useEffect(() => {
    const details = detailsRef.current;
    if (!details) return;

    const openIfFounderHash = () => {
      if (window.location.hash === "#founder") {
        details.open = true;
      }
    };

    openIfFounderHash();
    window.addEventListener("hashchange", openIfFounderHash);

    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest('a[href="#founder"]')) {
        details.open = true;
      }
    };
    document.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("hashchange", openIfFounderHash);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <section
      className="official-founder"
      id="founder"
      aria-labelledby="official-founder-heading"
      tabIndex={-1}
    >
      <div className="page-shell official-founder-inner">
        <details ref={detailsRef} className="official-founder-panel">
          <summary className="official-founder-summary">
            <span className="official-founder-summary-copy">
              <h2
                id="official-founder-heading"
                className="official-founder-eyebrow"
              >
                {heading}
              </h2>
              <span className="official-founder-lead">{lead}</span>
            </span>
            <span className="official-founder-chevron" aria-hidden="true" />
          </summary>
          <div className="official-founder-body">
            <div className="official-founder-portrait">
              <Image
                src={portraitSrc}
                alt={portraitAlt}
                fill
                className="official-founder-photo"
                sizes="(min-width: 768px) 28rem, 20rem"
              />
            </div>
            <div className="official-founder-copy-stack">
              {rest.map((paragraph) => (
                <p key={paragraph} className="official-founder-copy">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </details>
      </div>
    </section>
  );
}
