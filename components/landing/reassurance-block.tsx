import { landingCopy } from "@/lib/landing-copy";
import type { CSSProperties } from "react";

type TrustIcon = (typeof landingCopy.reassurance.items)[number]["icon"];

function TrustSignalIcon({ name }: { name: TrustIcon }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  if (name === "check") {
    return (
      <svg {...common}>
        <path d="M20 6 9 17l-5-5" />
      </svg>
    );
  }

  if (name === "clock") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
    </svg>
  );
}

/**
 * Compact trust badges stacked under the video — icon + one short line each.
 */
export function ReassuranceBlock() {
  const { items, methodology } = landingCopy.reassurance;

  return (
    <section
      className="trust-grid"
      aria-label="Why firms trust this review"
      data-reveal
    >
      <ul className="trust-grid-list">
        {items.map((item, index) => (
          <li
            key={item.id}
            className="trust-card"
            data-reveal-child
            style={{ "--reveal-index": index } as CSSProperties}
          >
            <span className="trust-card-icon">
              <TrustSignalIcon name={item.icon} />
            </span>
            <p className="trust-card-line">
              <span className="trust-card-title">{item.title}</span>
              <span className="trust-card-sep" aria-hidden="true">
                {" "}
                ·{" "}
              </span>
              <span className="trust-card-body">{item.body}</span>
            </p>
          </li>
        ))}
      </ul>
      {methodology.heading || methodology.body.length > 0 ? (
        <div className="trust-methodology">
          {methodology.heading ? (
            <p className="trust-methodology-heading">{methodology.heading}</p>
          ) : null}
          {methodology.body.map((paragraph, index) => (
            <p key={index} className="trust-methodology-body">
              {paragraph}
            </p>
          ))}
        </div>
      ) : null}
    </section>
  );
}
