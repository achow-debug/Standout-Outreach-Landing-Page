"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";
import { keepTogether } from "@/components/official/no-break";
import { SectionShell } from "@/components/ui/Container";
import { officialCopy } from "@/lib/official-copy";

/**
 * Founder story on night. Longer bio stays behind "Read Alex's story".
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
      if (target.closest('a[href="#founder"], a[href$="#founder"]')) setOpen(true);
    };
    document.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("hashchange", openIfFounderHash);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <SectionShell
      id="founder"
      tone="night"
      pathAlign
      aria-labelledby="official-founder-heading"
      className="scroll-mt-(--nav-offset)"
    >
      <p className="m-0 font-sans text-eyebrow uppercase text-night-muted">
        {eyebrow}
      </p>

      <div className="mt-8 grid grid-cols-1 items-start gap-10 lg:mt-12 lg:grid-cols-12 lg:gap-8">
        <figure className="m-0 lg:col-span-5">
          <div className="relative aspect-4/5 overflow-hidden rounded-lg bg-night-raised">
            <Image
              src={portraitSrc}
              alt={portraitAlt}
              fill
              className="object-cover object-[50%_8%]"
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          </div>
        </figure>

        <div className="lg:col-span-7">
          <h2
            id="official-founder-heading"
            className="m-0 max-w-heading font-display text-h2 text-night-text"
          >
            {heading}
          </h2>
          <p className="mt-5 max-w-lead text-lead text-night-muted lg:mt-6">
            {lead}
          </p>
          {bioLead ? (
            <p className="mt-4 max-w-prose text-body text-night-muted">
              {bioLead}
            </p>
          ) : null}
          {bioRest.length > 0 ? (
            <>
              <button
                type="button"
                className="mt-4 inline-flex min-h-11 items-center font-sans text-button text-night-accent underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-night-accent"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpen((value) => !value)}
              >
                {readMore}
              </button>
              {open ? (
                <div id={panelId} className="mt-4 flex flex-col gap-4">
                  {bioRest.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="m-0 max-w-prose text-body text-night-muted"
                    >
                      {keepTogether(paragraph)}
                    </p>
                  ))}
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    </SectionShell>
  );
}
