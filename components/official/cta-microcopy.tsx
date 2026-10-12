import { ctaMicrocopy } from "@/content/landing";

type CtaMicrocopyProps = {
  /** Light sections use ink. Dark sections use the on-navy text colours. */
  tone?: "light" | "dark";
  /** Task 3.5 opens the ICO explainer from this control. */
  onIcoClick?: () => void;
};

export function CtaMicrocopy({ tone = "light", onIcoClick }: CtaMicrocopyProps) {
  return (
    <div className={`cta-microcopy cta-microcopy--${tone}`}>
      <p className="cta-microcopy-line">{ctaMicrocopy.line1}</p>
      <p className="cta-microcopy-legal">
        <button type="button" className="cta-microcopy-ico" onClick={onIcoClick}>
          {ctaMicrocopy.icoLink}
        </button>
        {ctaMicrocopy.line2AfterLink}
      </p>
    </div>
  );
}
