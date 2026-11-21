"use client";

import { useState } from "react";
import { ctaMicrocopy } from "@/content/landing";
import { IcoExplainer } from "@/components/official/ico-explainer";

type CtaMicrocopyProps = {
  /** Light sections use ink. Night footer can pass dark later if needed. */
  tone?: "light" | "dark";
};

/**
 * Trust microcopy under CTAs. Copy unchanged.
 */
export function CtaMicrocopy({ tone = "light" }: CtaMicrocopyProps) {
  const [open, setOpen] = useState(false);
  const muted = tone === "dark" ? "text-night-muted" : "text-ink-subtle";
  const link =
    tone === "dark"
      ? "text-night-accent underline-offset-4 hover:underline"
      : "text-brand underline-offset-4 hover:underline";

  return (
    <div className={`flex max-w-prose flex-col gap-1 text-left text-small ${muted}`}>
      <p className="m-0">{ctaMicrocopy.line1}</p>
      <p className="m-0">
        <button
          type="button"
          className={`font-semibold ${link}`}
          onClick={() => setOpen(true)}
        >
          {ctaMicrocopy.icoLink}
        </button>
        {ctaMicrocopy.line2AfterLink}
      </p>
      <IcoExplainer open={open} onOpenChange={setOpen} />
    </div>
  );
}
