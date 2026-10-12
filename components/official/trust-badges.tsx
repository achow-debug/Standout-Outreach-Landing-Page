"use client";

import { useState } from "react";
import { credentials } from "@/content/landing";
import { IcoExplainer } from "@/components/official/ico-explainer";

const icon = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
  className: "credential-icon",
};

function PadlockIcon() {
  return (
    <svg {...icon}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg {...icon}>
      <path d="M7 3.5h7l5 5V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1z" />
      <path d="M14 3.5V9h5.5" />
      <path d="M9 13h6" />
      <path d="M9 17h6" />
    </svg>
  );
}

/**
 * ICO and SRA credentials. Line icons only: no boxed marks and no ICO logo.
 */
export function TrustBadges() {
  const [explainOpen, setExplainOpen] = useState(false);

  return (
    <div className="credentials" role="region" aria-label="Regulatory credentials">
      <div className="credential">
        <PadlockIcon />
        <div className="credential-copy">
          <p className="credential-title">{credentials.icoTitle}</p>
          <p className="credential-detail">{credentials.icoNumber}</p>
          <div className="credential-actions">
            <a
              className="credential-link"
              href={credentials.icoRegisterUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {credentials.icoRegisterLabel}
            </a>
            <button
              type="button"
              className="credential-link"
              onClick={() => setExplainOpen(true)}
            >
              {credentials.icoMeaningLabel}
            </button>
          </div>
        </div>
      </div>
      <div className="credential">
        <DocumentIcon />
        <div className="credential-copy">
          <p className="credential-title">{credentials.sraTitle}</p>
          <p className="credential-detail">{credentials.sraBody}</p>
        </div>
      </div>
      <IcoExplainer open={explainOpen} onOpenChange={setExplainOpen} />
    </div>
  );
}
