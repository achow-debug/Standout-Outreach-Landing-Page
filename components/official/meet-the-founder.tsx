"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";
import { officialCopy } from "@/lib/official-copy";

/**
 * Full-bleed navy on mobile. The longer bio stays behind "Read Alex's story".
 */
export function MeetTheFounder() {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const {
    heading,
    caption,
    readMore,
    portraitAlt,
    portraitSrc,
    paragraphs,
  } = officialCopy.founder;
  const [statement, bioLead, ...bioRest] = paragraphs;

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
          <h2
            id="official-founder-heading"
            className="official-founder-eyebrow t-label t-label--on-dark"
          >
            {heading}
          </h2>
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
            <figcaption className="official-founder-caption t-small">
              {caption}
            </figcaption>
          </figure>
          <div className="official-founder-copy-col">
            <p className="official-founder-statement t-h3">{statement}</p>
            {bioLead ? <p className="official-founder-copy t-body">{bioLead}</p> : null}
            {bioRest.length > 0 ? (
              <>
                <button
                  type="button"
                  className="official-founder-more"
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
                      <p key={paragraph} className="official-founder-copy t-body">
                        {paragraph}
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
