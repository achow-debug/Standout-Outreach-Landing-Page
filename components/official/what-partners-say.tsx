"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Sheet } from "@/components/official/sheet";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { officialCopy } from "@/lib/official-copy";

type Review = {
  id: string;
  name: string;
  specialism: string;
  location: string;
  pullQuote: string;
  fullQuote: string;
  portraitSrc?: string;
};

const reviews: Review[] = [
  {
    id: "florenda-a",
    name: "Florenda A",
    specialism: "Conveyancing law specialist",
    location: "Staffordshire",
    portraitSrc: "/images/partners/florenda-abdo.jpg",
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
    portraitSrc: "/images/partners/jayden-chow.jpg",
    pullQuote:
      "The call was framed as a collaboration, not a sales pitch. Without Alex’s help, I would have missed opportunities that turned into commissions.",
    fullQuote:
      "I found Standout Group after Alex emailed me, an email that described problems I recognised. What got me on the call was that it was framed as a collaboration, not a sales pitch. Without Alex’s help, I would have missed opportunities that turned into commissions.",
  },
];

const backgroundSrc = "/images/partners/office-session.jpg";

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
  index,
  onReadFull,
}: {
  item: Review;
  index: number;
  onReadFull: (id: string) => void;
}) {
  return (
    <li
      id={item.id}
      className="w-[min(100%,28rem)] shrink-0 snap-center"
    >
      <Reveal index={index} className="h-full">
        <div className="h-full rounded-lg border border-line bg-surface p-6">
          <figure className="m-0 flex h-full flex-col gap-6">
            <blockquote className="m-0 flex-1">
              <p className="m-0 text-body text-ink-muted text-pretty">
                <span aria-hidden="true">“</span>
                <span className="lg:hidden">{item.pullQuote}</span>
                <span className="hidden lg:inline">{item.fullQuote}</span>
                <span aria-hidden="true">”</span>
              </p>
            </blockquote>
            <button
              type="button"
              className="inline-flex min-h-11 items-center self-start text-small font-semibold text-brand underline-offset-4 hover:underline lg:hidden"
              onClick={() => onReadFull(item.id)}
            >
              Read {firstName(item.name)}’s full review
            </button>
            <figcaption className="flex items-center gap-4">
              <span className="relative size-12 shrink-0 overflow-hidden rounded-full bg-surface-alt">
                {item.portraitSrc ? (
                  <Image
                    src={item.portraitSrc}
                    alt=""
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                ) : (
                  <span className="flex size-full items-center justify-center text-small font-semibold text-ink-muted">
                    {initialsFromName(item.name)}
                  </span>
                )}
              </span>
              <span className="min-w-0 text-left">
                <span className="block text-small font-semibold text-ink">
                  {item.name}
                </span>
                <span className="block text-small text-ink-subtle">
                  {item.specialism} · {item.location}
                </span>
              </span>
            </figcaption>
          </figure>
        </div>
      </Reveal>
    </li>
  );
}

/**
 * Partner reviews. Surface-alt after security (paper).
 */
export function WhatPartnersSay() {
  const rowRef = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const [openId, setOpenId] = useState<string | null>(null);
  const openReview = reviews.find((item) => item.id === openId) ?? null;

  function scrollToReview(next: number) {
    const row = rowRef.current;
    const card = row?.children[next] as HTMLElement | undefined;
    if (!row || !card) return;
    card.scrollIntoView({
      inline: "center",
      block: "nearest",
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
    const cards = [...row.children] as HTMLElement[];
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
      className="relative section-y bg-surface-alt"
      id="partners"
      aria-labelledby="official-partners-heading"
      tabIndex={-1}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <Image
          src={backgroundSrc}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-20"
        />
      </div>

      <Container className="relative">
        <Reveal className="flex items-end justify-between gap-4 lg:pl-(--path-gutter)">
          <h2
            id="official-partners-heading"
            className="m-0 max-w-heading font-display text-h2 text-ink"
          >
            {officialCopy.partners.heading}
          </h2>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              aria-label="Previous review"
              className="inline-flex size-11 items-center justify-center rounded-full border border-line bg-surface text-ink hover:border-line-strong"
              onClick={() => step(-1)}
            >
              <ArrowIcon direction="previous" />
            </button>
            <button
              type="button"
              aria-label="Next review"
              className="inline-flex size-11 items-center justify-center rounded-full border border-line bg-surface text-ink hover:border-line-strong"
              onClick={() => step(1)}
            >
              <ArrowIcon direction="next" />
            </button>
          </div>
        </Reveal>

        <ul
          ref={rowRef}
          className="mt-12 flex list-none snap-x snap-mandatory gap-4 overflow-x-auto p-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mt-16 lg:pl-(--path-gutter)"
        >
          {reviews.map((item, index) => (
            <ReviewCard
              key={item.id}
              item={item}
              index={index}
              onReadFull={setOpenId}
            />
          ))}
        </ul>
      </Container>

      <Sheet
        open={openReview !== null}
        onOpenChange={(open) => {
          if (!open) setOpenId(null);
        }}
        title={openReview?.name ?? "Review"}
      >
        {openReview ? (
          <p className="m-0 text-body text-ink-muted">{openReview.fullQuote}</p>
        ) : null}
      </Sheet>
    </section>
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
