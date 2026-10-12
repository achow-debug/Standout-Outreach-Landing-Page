"use client";

import { useEffect, useRef, useState } from "react";
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

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function carouselActive() {
  return window.matchMedia("(max-width: 1023px)").matches;
}

function ReviewCard({ item }: { item: (typeof reviewCards)[number] }) {
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

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" fill="none">
      <path
        d={direction === "left" ? "M12.5 4.5 7 10l5.5 5.5" : "M7.5 4.5 13 10l-5.5 5.5"}
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Partner reviews. Below 1024px they sit in a swipeable row.
 * Jayden’s full quote stays until he approves the trimmed version.
 */
export function WhatPartnersSay() {
  const { heading } = officialCopy.partners;
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);

  function scrollToIndex(next: number) {
    const scroller = scrollerRef.current;
    if (!scroller || !carouselActive()) return;
    const clamped = Math.max(0, Math.min(reviewCards.length - 1, next));
    const card = scroller.querySelectorAll<HTMLElement>(".official-partners-card")[clamped];
    if (!card) return;
    const left =
      card.getBoundingClientRect().left -
      scroller.getBoundingClientRect().left +
      scroller.scrollLeft;
    scroller.scrollTo({
      left,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }

  function scrollCardIntoCarousel(id: string) {
    if (!reviewCards.some((item) => item.id === id)) return;
    const card = document.getElementById(id);
    const scroller = scrollerRef.current;
    if (!card || !scroller || !carouselActive()) return;
    const left =
      card.getBoundingClientRect().left -
      scroller.getBoundingClientRect().left +
      scroller.scrollLeft;
    scroller.scrollTo({
      left,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    function updateIndex() {
      const current = scrollerRef.current;
      if (!current || !carouselActive()) return;
      const cards = [...current.querySelectorAll<HTMLElement>(".official-partners-card")];
      let best = 0;
      let bestDistance = Number.POSITIVE_INFINITY;
      cards.forEach((card, cardIndex) => {
        const distance = Math.abs(
          card.getBoundingClientRect().left - current.getBoundingClientRect().left,
        );
        if (distance < bestDistance) {
          best = cardIndex;
          bestDistance = distance;
        }
      });
      setIndex((currentIndex) => (currentIndex === best ? currentIndex : best));
    }

    scroller.addEventListener("scroll", updateIndex, { passive: true });
    window.addEventListener("resize", updateIndex);

    function onHashChange() {
      const id = window.location.hash.replace(/^#/, "");
      scrollCardIntoCarousel(id);
    }

    function onClick(event: MouseEvent) {
      const link = (event.target as Element | null)?.closest("a[href]");
      if (!link) return;
      const href = link.getAttribute("href") ?? "";
      const id = href.startsWith("#") ? href.slice(1) : "";
      if (!reviewCards.some((item) => item.id === id)) return;
      window.requestAnimationFrame(() => scrollCardIntoCarousel(id));
    }

    onHashChange();
    window.addEventListener("hashchange", onHashChange);
    document.addEventListener("click", onClick);

    return () => {
      scroller.removeEventListener("scroll", updateIndex);
      window.removeEventListener("resize", updateIndex);
      window.removeEventListener("hashchange", onHashChange);
      document.removeEventListener("click", onClick);
    };
  }, []);

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
        <div
          className="reviews-carousel"
          role="region"
          aria-label="Reviews"
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") {
              event.preventDefault();
              scrollToIndex(index + 1);
            }
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              scrollToIndex(index - 1);
            }
          }}
        >
          <ul ref={scrollerRef} className="official-partners-grid reviews-scroller">
            {reviewCards.map((item) => (
              <ReviewCard key={item.id} item={item} />
            ))}
          </ul>
          <div className="reviews-controls">
            <button
              type="button"
              className="reviews-nav"
              aria-label="Previous review"
              aria-disabled={index === 0}
              onClick={() => scrollToIndex(index - 1)}
            >
              <Chevron direction="left" />
            </button>
            <p className="reviews-counter" aria-live="polite">
              {index + 1} of {reviewCards.length}
            </p>
            <button
              type="button"
              className="reviews-nav"
              aria-label="Next review"
              aria-disabled={index === reviewCards.length - 1}
              onClick={() => scrollToIndex(index + 1)}
            >
              <Chevron direction="right" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
