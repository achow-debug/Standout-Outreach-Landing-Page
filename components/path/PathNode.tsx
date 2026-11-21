"use client";

import { useRef } from "react";
import * as m from "motion/react-m";
import { useInView, useReducedMotion } from "motion/react";

type PathNodeProps = {
  /** Larger end-of-path node (16px). Default 12px. */
  terminal?: boolean;
};

/**
 * Path node for section eyebrows (§7.3).
 * Place inside a `relative` Eyebrow. Hidden below lg.
 * One ring pulse ever; reduced motion: filled, no pulse.
 */
export function PathNode({ terminal = false }: PathNodeProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "0px 0px -40% 0px" });
  const active = Boolean(reduce || inView);
  const size = terminal ? 16 : 12;

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className="absolute top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:block"
      style={{
        left: "calc(-1 * var(--path-gutter))",
        width: size,
        height: size,
      }}
    >
      <m.span
        className="absolute inset-0 rounded-full"
        initial={false}
        animate={{
          backgroundColor: active ? "var(--color-brand)" : "var(--color-paper)",
          borderColor: active
            ? "var(--color-brand)"
            : "var(--color-line-strong)",
          scale: active ? 1 : 0.85,
        }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ borderWidth: 1.5, borderStyle: "solid" }}
      />
      {active && !reduce ? (
        <m.span
          className="absolute inset-0 rounded-full border border-brand"
          initial={{ scale: 1, opacity: 0.35 }}
          animate={{ scale: 2.4, opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
      ) : null}
    </span>
  );
}
