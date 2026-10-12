"use client";

import { useEffect, useRef, useState } from "react";
import { researchStats } from "@/content/landing";
import { sources } from "@/content/sources";
import { Sheet } from "@/components/official/sheet";
import { openSourcesSection } from "@/components/official/source-button";

const COUNT_MS = 900;

const stats = [
  {
    id: "firms",
    figure: researchStats.firmsFigure,
    label: researchStats.firmsLabel,
  },
  {
    id: "leak",
    figure: researchStats.leakFigure,
    label: researchStats.leakLabel,
  },
] as const;

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

function Stat({
  figure,
  label,
  progress,
}: {
  figure: string;
  label: string;
  progress: number;
}) {
  const { value, suffix } = parseFigure(figure);
  const display =
    progress >= 1 ? figure : `${Math.round(value * progress)}${suffix}`;

  return (
    <div className="official-proof-item">
      <p className="official-proof-figure t-stat">
        <span className="sr-only">{figure}</span>
        <span aria-hidden="true">{display}</span>
      </p>
      <p className="official-proof-body t-small">{label}</p>
    </div>
  );
}

/**
 * Two research figures, side by side from 360px.
 * The finished number renders first; the count-up runs once in view.
 */
export function ProofStrip() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
  const seeAllRef = useRef(false);
  const [progress, setProgress] = useState(1);
  const [open, setOpen] = useState(false);

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

  useEffect(() => {
    if (open || !seeAllRef.current) return;
    seeAllRef.current = false;
    openSourcesSection();
  }, [open]);

  return (
    <div ref={sectionRef} className="official-proof">
      <div className="official-proof-grid">
        {stats.map((item) => (
          <Stat
            key={item.id}
            figure={item.figure}
            label={item.label}
            progress={progress}
          />
        ))}
      </div>
      <button
        type="button"
        className="methodology-button"
        onClick={() => setOpen(true)}
      >
        {researchStats.methodButton}
      </button>
      <Sheet
        open={open}
        onOpenChange={setOpen}
        title={sources.mysteryShop.title}
      >
        <p className="methodology-lead">
          <strong>{sources.mysteryShop.leadBold}</strong>
        </p>
        {sources.mysteryShop.paragraphs.map((paragraph) => (
          <p key={paragraph} className="methodology-body">
            {paragraph}
          </p>
        ))}
        <button
          type="button"
          className="source-sheet-see-all"
          onClick={() => {
            seeAllRef.current = true;
            setOpen(false);
          }}
        >
          {researchStats.seeAll}
        </button>
      </Sheet>
    </div>
  );
}
