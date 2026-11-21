"use client";

import { useRef, type ReactNode } from "react";
import * as m from "motion/react-m";
import { useScroll, useSpring, useReducedMotion } from "motion/react";

type EnquiryPathProps = {
  children: ReactNode;
};

/**
 * Signature enquiry path (§7). lg+ only. Decorative (`aria-hidden`).
 * Progress tip follows a point 60% down the viewport.
 */
export function EnquiryPath({ children }: EnquiryPathProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 60%", "end 60%"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div ref={ref} className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 hidden lg:block"
        style={{
          left: "max(var(--gutter), calc((100% - var(--container-site)) / 2))",
        }}
      >
        <div className="absolute inset-y-0 w-px -translate-x-1/2 bg-line" />
        <m.div
          className="absolute inset-y-0 origin-top -translate-x-1/2 bg-brand will-change-transform"
          style={{ width: 1.5, scaleY: reduce ? 1 : progress }}
        />
      </div>
      {children}
    </div>
  );
}
