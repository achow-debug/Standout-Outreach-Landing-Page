"use client";

import { useState } from "react";
import { ctaMicrocopy } from "@/content/landing";
import { IcoExplainer } from "@/components/official/ico-explainer";

type CtaMicrocopyProps = {
  /** Light sections use ink. Dark sections use the on-navy text colours. */
  tone?: "light" | "dark";
};

export function CtaMicrocopy({ tone = "light" }: CtaMicrocopyProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`cta-microcopy cta-microcopy--${tone}`}>
      <p className="cta-microcopy-line">{ctaMicrocopy.line1}</p>
      <p className="cta-microcopy-legal">
        <button
          type="button"
          className="cta-microcopy-ico"
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
