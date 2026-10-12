import { officialCopy } from "@/lib/official-copy";

/**
 * Regulatory lockups under the hero. Stacked on the phone, one row from 768px.
 * Marks are monograms in the site palette, not trademarked crests.
 */
export function TrustBadges() {
  const { items } = officialCopy.trustBadges;

  return (
    <div className="official-trust" role="region" aria-label="Regulatory and security standards">
      <ul className="official-trust-list">
        {items.map((item) => (
          <li key={item.id} className="official-trust-item">
            <span className="official-trust-mark" aria-hidden="true">
              {item.mark}
            </span>
            <span className="official-trust-copy">
              <span className="official-trust-title">{item.title}</span>
              <span className="official-trust-detail t-small">{item.detail}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
