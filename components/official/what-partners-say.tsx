"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Review = {
  id: string;
  name: string;
  specialism: string;
  location: string;
  pullQuote: string;
  fullQuote: string;
  photo?: string; // optional, e.g. "/reviews/florenda-a.jpg"
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

const headingColour = "text-[color:var(--official-headline-ink)]";

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

function ReviewAvatar({ name, photo }: { name: string; photo?: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl md:h-16 md:w-16 md:rounded-2xl">
      {photo && !failed ? (
        <Image
          src={photo}
          alt={name}
          fill
          sizes="64px"
          className="object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="avatar--initials h-full w-full">{initialsFromName(name)}</span>
      )}
    </div>
  );
}

function ReviewCard({ item }: { item: Review }) {
  return (
    <li
      id={item.id}
      className="official-partners-card flex h-full w-[85%]! shrink-0 basis-[85%]! snap-start flex-col bg-surface! p-6! last:mr-[15%]! md:w-auto! md:basis-auto! md:p-8! md:last:mr-0!"
    >
      <blockquote>
        <p
          className={`relative font-bold text-xl leading-[1.35] tracking-[-0.01em] [text-wrap:pretty] md:text-[22px] md:leading-[1.3] lg:text-2xl lg:tracking-[-0.015em] ${headingColour}`}
        >
          <span aria-hidden="true" className="absolute right-full select-none">“</span>
          {item.pullQuote}”
        </p>
      </blockquote>
      <button
        type="button"
        className="mt-4 inline-flex min-h-[44px] items-center gap-1 text-sm font-semibold text-brand underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        Read {firstName(item.name)}’s full review →
      </button>
      <div className="mt-auto flex items-end justify-between gap-4 pt-8">
        <div>
          <p className={`font-bold text-base ${headingColour}`}>{item.name}</p>
          <p className="official-partners-role mt-0.5! text-sm">
            {item.specialism} · {item.location}
          </p>
        </div>
        <ReviewAvatar name={item.name} photo={item.photo} />
      </div>
    </li>
  );
}

/**
 * Partner reviews. Below md they sit in a scroll-snap row; from md they sit in a grid.
 */
export function WhatPartnersSay() {
  const rowRef = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);

  function scrollToReview(next: number) {
    const row = rowRef.current;
    const card = row?.querySelectorAll<HTMLElement>(".official-partners-card")[next];
    if (!row || !card) return;
    const padding = Number.parseFloat(getComputedStyle(row).paddingLeft) || 0;
    const left =
      card.getBoundingClientRect().left - row.getBoundingClientRect().left + row.scrollLeft - padding;
    row.scrollTo({
      left,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
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
      className="official-partners bg-surface"
      id="partners"
      aria-labelledby="official-partners-heading"
      tabIndex={-1}
    >
      <div className="page-shell official-partners-inner gap-0! py-12! md:py-16!">
        <div className="official-partners-intro mb-8 md:mb-10">
          <h2 id="official-partners-heading" className="official-partners-heading t-h2">
            Trusted by people clients count on
          </h2>
        </div>
        <div>
          <ul
            ref={rowRef}
            className="flex items-stretch gap-4 overflow-x-auto snap-x snap-mandatory -mx-5 px-5 scroll-px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 lg:gap-8"
          >
            {reviews.map((item) => (
              <ReviewCard key={item.id} item={item} />
            ))}
          </ul>
          <div className="mt-5 flex justify-center md:hidden">
            {reviews.map((item, dotIndex) => {
              const active = index === dotIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`Show review ${dotIndex + 1}`}
                  aria-current={active ? "true" : undefined}
                  className="inline-flex items-center justify-center p-3 focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-brand"
                  onClick={() => scrollToReview(dotIndex)}
                >
                  <span
                    className={`block h-1.5 rounded-full transition-all duration-300 ${
                      active ? "w-5 bg-current text-brand" : "w-1.5 bg-line"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
