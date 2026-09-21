import {
  officialCopy,
  type OfficialPartnersItem,
} from "@/lib/official-copy";

const ITEM_DELAYS = ["motion-enter--0", "motion-enter--1"] as const;

function PartnerCard({
  item,
  delayClass,
}: {
  item: OfficialPartnersItem;
  delayClass: string;
}) {
  return (
    <li className={`official-partners-card motion-enter ${delayClass}`}>
      <figure className="official-partners-figure">
        <blockquote className="official-partners-quote">
          <p>{item.quote}</p>
        </blockquote>
        <figcaption className="official-partners-caption">
          <p className="official-partners-name">{item.name}</p>
          <p className="official-partners-role">{item.role}</p>
        </figcaption>
      </figure>
    </li>
  );
}

/**
 * Light corroboration band: full-width intro, two equal 12px quote cards.
 */
export function WhatPartnersSay() {
  const { eyebrow, heading, items } = officialCopy.partners;

  return (
    <section
      className="official-partners"
      id="what-partners-say"
      aria-labelledby="official-partners-heading"
      tabIndex={-1}
    >
      <div className="page-shell official-partners-inner">
        <div className="official-partners-intro motion-enter motion-enter--0">
          <p className="official-partners-eyebrow">{eyebrow}</p>
          <h2
            id="official-partners-heading"
            className="official-partners-heading"
          >
            {heading}
          </h2>
        </div>
        <ul className="official-partners-grid">
          {items.map((item, index) => (
            <PartnerCard
              key={item.id}
              item={item}
              delayClass={ITEM_DELAYS[index] ?? "motion-enter--0"}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
