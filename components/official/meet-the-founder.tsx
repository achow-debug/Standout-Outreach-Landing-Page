"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";
import { keepTogether } from "@/components/official/no-break";
import { officialCopy } from "@/lib/official-copy";

/**
 * Full-bleed navy on mobile. The longer bio stays behind "Read Alex's story".
 */
export function MeetTheFounder() {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const {
    eyebrow,
    heading,
    lead,
    readMore,
    portraitAlt,
    portraitSrc,
    paragraphs,
  } = officialCopy.founder;
  const [bioLead, ...bioRest] = paragraphs;

  useEffect(() => {
    const openIfFounderHash = () => {
      if (window.location.hash === "#founder") setOpen(true);
    };

    openIfFounderHash();
    window.addEventListener("hashchange", openIfFounderHash);

    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest('a[href="#founder"]')) setOpen(true);
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
        <div className="official-founder-panel">
          <p className="official-founder-eyebrow text-eyebrow text-on-dark-muted">
            {eyebrow}
          </p>
          <figure className="official-founder-portrait">
            <div className="official-founder-photo-frame">
              <Image
                src={portraitSrc}
                alt={portraitAlt}
                fill
                className="official-founder-photo"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
            </div>
          </figure>
          <div className="official-founder-copy-col">
            <h2 id="official-founder-heading" className="official-founder-statement text-h2 text-on-dark">
              {heading}
            </h2>
            <p className="official-founder-copy mt-5 text-lead text-on-dark-muted max-w-[60ch]">
              {lead}
            </p>
            {bioLead ? (
              <p className="official-founder-copy mt-4 text-body text-on-dark-muted max-w-[62ch]">
                {bioLead}
              </p>
            ) : null}
            {bioRest.length > 0 ? (
              <>
                <button
                  type="button"
                  className="official-founder-more text-brand-on-dark underline underline-offset-4 focus-visible:outline-brand-on-dark"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpen((value) => !value)}
                >
                  {readMore}
                </button>
                <div
                  id={panelId}
                  className="expand"
                  data-open={open ? "true" : "false"}
                >
                  <div className="official-founder-rest">
                    {bioRest.map((paragraph) => (
                      <p key={paragraph} className="official-founder-copy mt-4 text-body text-on-dark-muted max-w-[62ch]">
                        {keepTogether(paragraph)}
                      </p>
                    ))}
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
