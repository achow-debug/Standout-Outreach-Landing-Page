"use client";

import { useEffect, useRef, useState } from "react";
import { Sheet } from "@/components/official/sheet";

type Review = {
  id: string;
  name: string;
  specialism: string;
  location: string;
  pullQuote: string;
  fullQuote: string;
};

const reviews: Review[] = [
  {
    id: "florenda-a",
    name: "Florenda A",
    specialism: "Conveyancing law specialist",
    location: "Staffordshire",
    pullQuote:
      "Standout didn’t promise a flood of new clients. They proposed diagnosing first. I agreed to expand only once we could see it working.",
    fullQuote:
      "Standout didn’t promise a fancy website redesign or a flood of new clients. They proposed diagnosing first, fixing our highest-value pages, then improving how we captured and tracked enquiries. I agreed to expand only once we could see it working. That phased approach, not a big-bang relaunch, is why we would tell a partner who is sitting on the fence about Standout Group: you have no reason to wait.",
  },
  {
    id: "jayden-c",
    name: "Jayden C",
    specialism: "Family law specialist",
    location: "Greater Manchester",
    pullQuote:
      "The call was framed as a collaboration, not a sales pitch. Without Alex’s help, I would have missed opportunities that turned into commissions.",
    fullQuote:
      "I found Standout Group after Alex emailed me, an email that described problems I recognised. What got me on the call was that it was framed as a collaboration, not a sales pitch. Without Alex’s help, I would have missed opportunities that turned into commissions.",
  },
];

/** Set a path here when a band photo is ready. The scrim paints only then. */
const backgroundSrc: string | null = null;

function firstName(name: string) {
  return name.split(/\s+/).find(Boolean) ?? name;
}

function initialsFromName(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0] ?? "")
    .join("")
    .toUpperCase();
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function ReviewCard({
  item,
  onReadFull,
}: {
  item: Review;
  onReadFull: (id: string) => void;
}) {
  return (
    <li id={item.id} className="official-partners-card">
      <figure className="official-partners-figure">
        <div className="official-partners-quote-block">
          <blockquote className="official-partners-quote">
            <p>
              <span className="official-partners-quote-mark" aria-hidden="true">
                “
              </span>
              {item.pullQuote}”
            </p>
          </blockquote>
          <button
            type="button"
            className="official-partners-more"
            onClick={() => onReadFull(item.id)}
          >
            Read {firstName(item.name)}’s full review
          </button>
        </div>
        <figcaption className="official-partners-caption">
          <span className="official-partners-identity">
            <span className="official-partners-name">{item.name}</span>
            <span className="official-partners-role">
              {item.specialism} · {item.location}
            </span>
          </span>
          <span className="official-partners-portrait" aria-hidden="true">
            {initialsFromName(item.name)}
          </span>
        </figcaption>
      </figure>
    </li>
  );
}

function ArrowIcon({ direction }: { direction: "previous" | "next" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d={direction === "previous" ? "M10 3 5 8l5 5" : "M6 3l5 5-5 5"}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Partner reviews in a peeking swipe row. Both cards stay in the row at every width.
 */
export function WhatPartnersSay() {
  const rowRef = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const [openId, setOpenId] = useState<string | null>(null);
  const openReview = reviews.find((item) => item.id === openId) ?? null;

  function scrollToReview(next: number) {
    const row = rowRef.current;
    const card = row?.querySelectorAll<HTMLElement>(".official-partners-card")[next];
    if (!row || !card) return;
    const padding = Number.parseFloat(getComputedStyle(row).paddingLeft) || 0;
    const left =
      card.getBoundingClientRect().left -
      row.getBoundingClientRect().left +
      row.scrollLeft -
      padding;
    row.scrollTo({
      left,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }

  function step(delta: number) {
    const count = reviews.length;
    const next = (index + delta + count) % count;
    setIndex(next);
    scrollToReview(next);
  }

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const cards = [...row.querySelectorAll<HTMLElement>(".official-partners-card")];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const target = visible[0]?.target;
        if (!target) return;
        const next = cards.indexOf(target as HTMLElement);
        if (next >= 0) setIndex((current) => (current === next ? current : next));
      },
      { root: row, threshold: 0.6 },
    );
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="official-partners"
      id="partners"
      aria-labelledby="official-partners-heading"
      tabIndex={-1}
    >
      <div className="official-partners-photo" data-photo-slot="" aria-hidden="true">
        {backgroundSrc ? (
          <img src={backgroundSrc} alt="" className="official-partners-bg" />
        ) : null}
      </div>
      {backgroundSrc ? <div className="official-partners-scrim" aria-hidden="true" /> : null}
      <div className="page-shell official-partners-inner">
        <div className="official-partners-toolbar">
          <h2 id="official-partners-heading" className="official-partners-heading t-h2">
            Trusted by people clients count on
          </h2>
          <div className="official-partners-nav">
            <button type="button" aria-label="Previous review" onClick={() => step(-1)}>
              <ArrowIcon direction="previous" />
            </button>
            <button type="button" aria-label="Next review" onClick={() => step(1)}>
              <ArrowIcon direction="next" />
            </button>
          </div>
        </div>
        <ul ref={rowRef} className="official-partners-grid">
          {reviews.map((item) => (
            <ReviewCard key={item.id} item={item} onReadFull={setOpenId} />
          ))}
        </ul>
      </div>
      <Sheet
        open={openReview !== null}
        onOpenChange={(open) => {
          if (!open) setOpenId(null);
        }}
        title={openReview?.name ?? "Review"}
      >
        {openReview ? <p className="official-partners-full">{openReview.fullQuote}</p> : null}
      </Sheet>
    </section>
  );
}
