import { Avatar } from "@/components/official/avatar";
import { SectionLabel } from "@/components/official/section-label";
import { reviews, sectionLabels } from "@/content/landing";
import { officialCopy } from "@/lib/official-copy";

const reviewCards = [reviews.florenda, reviews.jayden] as const;

function quoteFor(name: string) {
  const match = officialCopy.partners.items.find((item) => item.name === name);
  if (!match) {
    throw new Error(`Missing review quote for ${name}`);
  }
  return match.quote;
}

function ReviewCard({
  item,
}: {
  item: (typeof reviewCards)[number];
}) {
  return (
    <li id={item.id} className="official-partners-card">
      <p className="review-outcome">{item.outcome}</p>
      <figure className="official-partners-figure">
        <blockquote className="official-partners-quote">
          <p className="t-body">{quoteFor(item.name)}</p>
        </blockquote>
        <figcaption className="official-partners-caption">
          <Avatar name={item.name} photo={item.photo} />
          <div className="official-partners-identity">
            <p className="official-partners-name t-body">{item.name}</p>
            <p className="official-partners-role t-small">{item.role}</p>
            <p className="review-meta t-small">
              {item.region}, {item.date}
            </p>
          </div>
        </figcaption>
      </figure>
    </li>
  );
}

/**
 * Partner reviews. Photos stay as initials until the owner supplies them.
 * Jayden’s full quote stays until he approves the trimmed version.
 */
export function WhatPartnersSay() {
  const { heading } = officialCopy.partners;

  return (
    <section
      className="official-partners"
      id="partners"
      aria-labelledby="official-partners-heading"
      tabIndex={-1}
    >
      <div className="page-shell official-partners-inner">
        <div className="official-partners-intro">
          <SectionLabel id="reviews-label">{sectionLabels.reviews}</SectionLabel>
          <h2 id="official-partners-heading" className="official-partners-heading t-h2">
            {heading}
          </h2>
        </div>
        <ul className="official-partners-grid">
          {reviewCards.map((item) => (
            <ReviewCard key={item.id} item={item} />
          ))}
        </ul>
      </div>
    </section>
  );
}
