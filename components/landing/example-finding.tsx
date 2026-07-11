"use client";

import { useRef } from "react";
import { trackEvent } from "@/lib/analytics";

type ExampleFindingData = {
  observation: string;
  evidence: string;
  implication: string;
  question: string;
};

type ExampleFindingProps = {
  label: string;
  finding: ExampleFindingData;
  findingId?: string;
};

/**
 * Collapsed-by-default example using native details/summary.
 * Labels observation, evidence, implication and verification question separately.
 */
export function ExampleFinding({
  label,
  finding,
  findingId = "family-law-general-contact",
}: ExampleFindingProps) {
  const openedRef = useRef(false);

  return (
    <details
      className="disclosure"
      onToggle={(event) => {
        const el = event.currentTarget;
        if (!el.open || openedRef.current) return;
        openedRef.current = true;
        trackEvent("example_finding_open", { finding_id: findingId });
      }}
    >
      <summary>{label}</summary>
      <div className="disclosure-body example-finding-body">
        <dl className="example-finding-list m-0">
          <div className="example-finding-row">
            <dt>Observation</dt>
            <dd>{finding.observation}</dd>
          </div>
          <div className="example-finding-row">
            <dt>Evidence</dt>
            <dd>{finding.evidence}</dd>
          </div>
          <div className="example-finding-row">
            <dt>Possible implication</dt>
            <dd>{finding.implication}</dd>
          </div>
          <div className="example-finding-row">
            <dt>Question to verify</dt>
            <dd>{finding.question}</dd>
          </div>
        </dl>
      </div>
    </details>
  );
}
