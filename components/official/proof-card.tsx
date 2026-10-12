"use client";

import { useRef } from "react";
import { proofCard } from "@/content/landing";
import { NoBreak } from "@/components/official/no-break";
import { SourceButton } from "@/components/official/source-button";
import { useInView } from "@/hooks/use-in-view";

/**
 * Headline result. `14 hrs` is visible first; the arrow and `5 min`
 * fade in once, the first time at least half the card is in view.
 * Reduced motion and no-JS show the finished figure immediately.
 */
export function ProofCard() {
  const ref = useRef<HTMLElement>(null);
  const revealed = useInView(ref, { once: true, threshold: 0.5 });

  return (
    <article
      ref={ref}
      id={proofCard.id}
      className={revealed ? "results-proof is-revealed" : "results-proof"}
    >
      <p className="results-proof-figure">
        <NoBreak>
          <span className="results-proof-from">{proofCard.from}</span>
          <span className="results-proof-after">
            {" → "}
            <span className="results-proof-to">{proofCard.to}</span>
          </span>
        </NoBreak>
      </p>
      <p className="results-proof-label">
        {proofCard.labelLine1}
        <br />
        {proofCard.labelLine2}
      </p>
      <p className="results-proof-why">{proofCard.why}</p>
      <p className="results-proof-credit">
        <span>{proofCard.credit}</span>
        <SourceButton sourceId={proofCard.sourceId} />
      </p>
    </article>
  );
}
