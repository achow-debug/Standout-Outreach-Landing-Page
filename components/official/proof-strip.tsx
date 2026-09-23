"use client";

import { useEffect, useRef, useState } from "react";
import { officialCopy, type OfficialProofItem } from "@/lib/official-copy";
import type { ReactNode } from "react";

const ACCENT_SPAN = "text-[var(--color-accent)] font-bold";
const COUNT_MS = 900;

function accentPhrase(text: string, phrase?: string): ReactNode {
  if (!phrase) return text;
  const index = text.indexOf(phrase);
  if (index === -1) return text;
  return (
    <>
      {text.slice(0, index)}
      <span className={ACCENT_SPAN}>{phrase}</span>
      {text.slice(index + phrase.length)}
    </>
  );
}

function parseFigure(figure: string): { value: number; suffix: string } {
  const match = figure.match(/^(\d+)(.*)$/);
  if (!match) {
    return { value: 0, suffix: figure };
  }
  return { value: Number(match[1]), suffix: match[2] };
}

function easeOut(t: number) {
  return 1 - (1 - t) ** 3;
}

function ProofItem({
  item,
  progress,
}: {
  item: OfficialProofItem;
  progress: number;
}) {
  const { value, suffix } = parseFigure(item.figure);
  const display =
    progress >= 1 ? item.figure : `${Math.round(value * progress)}${suffix}`;

  return (
    <div className="official-proof-item">
      <p className="official-proof-figure t-stat">
        <span className="sr-only">{item.figure}</span>
        <span aria-hidden="true">{display}</span>
      </p>
      <p className="official-proof-body t-small">
        {accentPhrase(item.body, item.accentPhrase)}
      </p>
    </div>
  );
}

/**
 * Two proof figures. The finished number is what renders first;
 * the count-up runs once the strip enters view.
 */
export function ProofStrip() {
  const { eyebrow, items } = officialCopy.proof;
  const sectionRef = useRef<HTMLElement>(null);
  const startedRef = useRef(false);
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    if (!document.documentElement.classList.contains("motion-ok")) {
      return;
    }

    const section = sectionRef.current;
    if (!section) return;

    const play = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / COUNT_MS);
        setProgress(easeOut(t));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        setProgress(0);
        play();
      },
      { threshold: 0.3 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="official-proof" aria-label={eyebrow}>
      <p className="official-proof-eyebrow t-small">{eyebrow}</p>
      <div className="official-proof-grid">
        {items.map((item) => (
          <ProofItem key={item.id} item={item} progress={progress} />
        ))}
      </div>
    </section>
  );
}
