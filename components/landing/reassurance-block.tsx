import { landingCopy } from "@/lib/landing-copy";

type ReassuranceLineProps = {
  items: readonly string[];
  className: string;
};

function ReassuranceLine({ items, className }: ReassuranceLineProps) {
  return (
    <p className={`reassurance-line ${className}`}>
      {items.map((item, index) => (
        <span key={item} className="reassurance-item">
          <span className="reassurance-phrase">{item}</span>
          {index < items.length - 1 ? (
            <span className="reassurance-sep" aria-hidden="true">
              {" · "}
            </span>
          ) : null}
        </span>
      ))}
    </p>
  );
}

/**
 * Compact credibility + outcome lines directly beneath the video (Phase 5).
 * Uses only the two approved lines; phrases stack on narrow viewports.
 */
export function ReassuranceBlock() {
  const { reassurance } = landingCopy;

  return (
    <section
      className="reassurance-section"
      aria-label="Credibility and outcomes"
    >
      <ReassuranceLine
        items={reassurance.credibilityItems}
        className="reassurance-credibility"
      />
      <ReassuranceLine
        items={reassurance.outcomeItems}
        className="reassurance-outcome"
      />
    </section>
  );
}
