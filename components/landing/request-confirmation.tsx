"use client";

import { useEffect, useRef } from "react";
import { landingCopy } from "@/lib/landing-copy";

/**
 * Success state after a review request is accepted.
 * No calendar CTA — confirmation only.
 */
export function RequestConfirmation() {
  const { confirmation } = landingCopy;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  return (
    <div
      ref={containerRef}
      className="confirmation"
      role="status"
      aria-live="polite"
      tabIndex={-1}
    >
      <h2 id="request-heading" className="section-heading">
        {confirmation.heading}
      </h2>
      <p className="section-supporting" style={{ marginBottom: 0 }}>
        {confirmation.body}
      </p>
    </div>
  );
}
