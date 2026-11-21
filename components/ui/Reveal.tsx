"use client";

import { useRef, type ReactNode } from "react";
import * as m from "motion/react-m";
import { useInView, useReducedMotion } from "motion/react";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const DURATION = 0.5; /* --dur-reveal */
const STAGGER_S = 0.06; /* 60ms */
const MAX_STAGGER = 6;

type RevealProps = {
  children: ReactNode;
  className?: string;
  /**
   * Stagger index among siblings (0-based). Capped at 5 so max delay is 300ms.
   * Only for heading groups, chip grids, step items and cards — never lines.
   */
  index?: number;
  /** When false, renders children without motion (e.g. above the fold). */
  enabled?: boolean;
};

/**
 * Below-the-fold scroll reveal (§8.3).
 * opacity 0→1, y 16→0, once, viewport margin -15%.
 */
export function Reveal({
  children,
  className,
  index = 0,
  enabled = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, {
    once: true,
    margin: "0px 0px -15% 0px",
  });

  if (!enabled || reduce) {
    return <div className={className}>{children}</div>;
  }

  const delay = Math.min(index, MAX_STAGGER - 1) * STAGGER_S;
  const show = inView;

  return (
    <m.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: DURATION, ease: EASE_OUT, delay }}
    >
      {children}
    </m.div>
  );
}
