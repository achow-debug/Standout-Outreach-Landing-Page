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
        className={className ?? "source-button"}
        aria-label={label}
        onClick={() => setOpen(true)}
      >
        {children ?? sources.buttonLabel}
      </button>
      <Sheet open={open} onOpenChange={setOpen} title={source.credit}>
        <p className="source-sheet-citation">
          <Citation citation={source.citation} italicise={source.italicise} />
        </p>
        <p className="source-sheet-summary">{source.summary}</p>
        <div className="source-sheet-actions">
          <a
            className="source-sheet-link"
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {sources.openSource}
          </a>
          <button
            type="button"
            className="source-sheet-see-all"
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
