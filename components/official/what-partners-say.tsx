import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import {
  officialCopy,
  type OfficialPartnersItem,
} from "@/lib/official-copy";
import type { ReactNode } from "react";

function publicFileExists(src: string) {
  return existsSync(join(process.cwd(), "public", src.replace(/^\//, "")));
}

function initialsFromName(name: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.at(-1)?.[0] ?? "";
  return `${first}${last}`.toUpperCase();
}

function emphasize(quote: string, phrase?: string): ReactNode {
  if (!phrase) return quote;
  const index = quote.indexOf(phrase);
  if (index === -1) return quote;
  return (
    <>
      {quote.slice(0, index)}
      <strong>{phrase}</strong>
      {quote.slice(index + phrase.length)}
    </>
  );
}

function PartnerAvatar({ item }: { item: OfficialPartnersItem }) {
  const photo = item.photo ?? item.portraitSrc;
  if (photo && publicFileExists(photo)) {
    return (
      <Image
        src={photo}
        alt={item.portraitAlt}
        width={56}
        height={56}
        className="official-partners-avatar"
      />
    );
  }

  return (
    <span className="official-partners-avatar official-partners-avatar--mono" aria-hidden="true">
      {initialsFromName(item.name)}
    </span>
  );
}

function PartnerCard({ item }: { item: OfficialPartnersItem }) {
  return (
    <li className="official-partners-card">
      <span className="official-partners-mark" aria-hidden="true">
        “
      </span>
      <figure className="official-partners-figure">
        <blockquote className="official-partners-quote">
          <p className="t-body">
            <span className="official-partners-quote-mark" aria-hidden="true">
              “
            </span>
            {emphasize(item.quote, item.emphasis)}
            <span className="official-partners-quote-mark" aria-hidden="true">
              ”
            </span>
          </p>
        </blockquote>
        <figcaption className="official-partners-caption">
          <PartnerAvatar item={item} />
          <div className="official-partners-identity">
            <p className="official-partners-name t-body">{item.name}</p>
            {item.role ? (
              <p className="official-partners-role t-small">{item.role}</p>
            ) : null}
            {item.firm ? (
              <p className="official-partners-firm t-small">{item.firm}</p>
            ) : null}
          </div>
        </figcaption>
      </figure>
    </li>
  );
}

/**
 * Stacked partner quotes. Photos, firm and role render when the data has them.
 */
export function WhatPartnersSay() {
  const { heading, items } = officialCopy.partners;

  return (
    <section
      className="official-partners"
      id="partners"
      aria-labelledby="official-partners-heading"
      tabIndex={-1}
    >
      <div className="page-shell official-partners-inner">
        <div className="official-partners-intro">
          <h2 id="official-partners-heading" className="official-partners-heading t-h2">
            {heading}
          </h2>
        </div>
        <ul className="official-partners-grid">
          {items.map((item) => (
            <PartnerCard key={item.id} item={item} />
          ))}
        </ul>
      </div>
    </section>
  );
}
