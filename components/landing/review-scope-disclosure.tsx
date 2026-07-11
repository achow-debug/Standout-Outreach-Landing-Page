"use client";

import { useRef } from "react";
import { trackEvent } from "@/lib/analytics";

type ReviewScopeDisclosureProps = {
  label: string;
  body: string;
  location?: string;
};

/**
 * Inline review-scope disclosure above risk-reversal copy.
 * Uses native details/summary — no modal, no navigation away.
 */
export function ReviewScopeDisclosure({
  label,
  body,
  location = "review_request_form",
}: ReviewScopeDisclosureProps) {
  const openedRef = useRef(false);

  return (
    <details
      className="disclosure"
      onToggle={(event) => {
        const el = event.currentTarget;
        if (!el.open || openedRef.current) return;
        openedRef.current = true;
        trackEvent("review_scope_open", { location });
      }}
    >
      <summary>{label}</summary>
      <div className="disclosure-body">
        <p className="m-0">{body}</p>
      </div>
    </details>
  );
}
