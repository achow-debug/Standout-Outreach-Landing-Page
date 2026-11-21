"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { getSource, sources, type SourceId } from "@/content/sources";
import { Sheet } from "@/components/official/sheet";

function Citation({
  citation,
  italicise,
}: {
  citation: string;
  italicise: string;
}) {
  const index = citation.indexOf(italicise);
  if (index < 0) return citation;

  return (
    <>
      {citation.slice(0, index)}
      <em>{italicise}</em>
      {citation.slice(index + italicise.length)}
    </>
  );
}

/** Closes nothing itself. Opens `<details id="sources">` and scrolls to it. */
export function openSourcesSection() {
  const section = document.getElementById(sources.sectionId);
  if (section instanceof HTMLDetailsElement) {
    section.open = true;
  }
  section?.scrollIntoView({ block: "start", behavior: "auto" });
}

export function SourceButton({
  sourceId,
  children,
  className,
  label,
}: {
  sourceId: SourceId;
  children?: ReactNode;
  className?: string;
  /** Accessible name when the visible label is a short wordmark. */
  label?: string;
}) {
  const source = getSource(sourceId);
  const [open, setOpen] = useState(false);
  const seeAllRef = useRef(false);

  useEffect(() => {
    if (open || !seeAllRef.current) return;
    seeAllRef.current = false;
    openSourcesSection();
  }, [open]);

  return (
    <>
      <button
        type="button"
        className={
          className ??
          "ml-2 inline-flex min-h-11 items-center text-small font-semibold text-brand underline-offset-4 hover:underline"
        }
        aria-label={label}
        onClick={() => setOpen(true)}
      >
        {children ?? sources.buttonLabel}
      </button>
      <Sheet open={open} onOpenChange={setOpen} title={source.credit}>
        <p className="m-0 text-body text-ink-muted">
          <Citation citation={source.citation} italicise={source.italicise} />
        </p>
        <p className="m-0 mt-3 text-body text-ink-muted">{source.summary}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            className="inline-flex min-h-11 items-center font-semibold text-brand underline-offset-4 hover:underline"
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {sources.openSource}
          </a>
          <button
            type="button"
            className="inline-flex min-h-11 items-center font-semibold text-ink underline-offset-4 hover:underline"
            onClick={() => {
              seeAllRef.current = true;
              setOpen(false);
            }}
          >
            {sources.seeAll}
          </button>
        </div>
      </Sheet>
    </>
  );
}
