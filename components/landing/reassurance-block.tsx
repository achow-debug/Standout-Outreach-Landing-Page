import { landingCopy } from "@/lib/landing-copy";

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

  if (name === "chart") {
    return (
      <svg {...common}>
        <path d="M4 19V5" />
        <path d="M4 19h16" />
        <path d="M8 15v-3" />
        <path d="M12 15V8" />
        <path d="M16 15v-5" />
      </svg>
    );
  }

  if (name === "lock") {
    return (
      <svg {...common}>
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M12 3 5 6v5c0 4.5 3 8.2 7 9.5 4-1.3 7-5 7-9.5V6l-7-3Z" />
      <path d="M9.5 12.5 11.5 14.5 15 11" />
    </svg>
  );
}

/**
 * Compact trust badges stacked under the video — icon + one short line each.
 */
export function ReassuranceBlock() {
  const { items } = landingCopy.reassurance;

  return (
    <section className="trust-grid" aria-label="Why firms trust this review">
      <ul className="trust-grid-list">
        {items.map((item) => (
          <li key={item.id} className="trust-card">
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
    </section>
  );
}
