"use client";

import { useEffect, useState } from "react";
import * as m from "motion/react-m";
import { AnimatePresence, useReducedMotion } from "motion/react";
import { officialCopy } from "@/lib/official-copy";

const ROTATE_MS = 3000;

type FirmTypeRotatorSize = "hero" | "footer";

type FirmTypeRotatorProps = {
  size?: FirmTypeRotatorSize;
  className?: string;
};

/** Footer-only: Title Case source → sentence case at render time. */
function toSentenceCase(value: string) {
  if (!value) return value;
  return value.charAt(0).toLowerCase() + value.slice(1).toLowerCase();
}

/**
 * Shared growth-partner firm-type line. Same list, 3s rotation, pause-on-hover,
 * and reduced-motion behaviour for hero (centred) and footer (smaller, left).
 */
export function FirmTypeRotator({
  size = "hero",
  className,
}: FirmTypeRotatorProps) {
  const { growthPartnerLead, firmTypes } = officialCopy.hero;
  const isFooter = size === "footer";
  const displayFirmTypes = isFooter
    ? firmTypes.map(toSentenceCase)
    : firmTypes;
  const longestFirmType = displayFirmTypes.reduce((a, b) =>
    a.length >= b.length ? a : b,
  );

  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduceMotion || paused || displayFirmTypes.length <= 1) return;

    const id = window.setInterval(() => {
      if (document.hidden) return;
      setIndex((current) => (current + 1) % displayFirmTypes.length);
    }, ROTATE_MS);

    return () => window.clearInterval(id);
  }, [displayFirmTypes.length, paused, reduceMotion]);

  const activeFirmType = displayFirmTypes[index] ?? displayFirmTypes[0];

  return (
    <div
      className={[
        isFooter ? "text-left" : undefined,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          setPaused(false);
        }
      }}
    >
      <p
        className={[
          "m-0 font-display font-medium",
          isFooter
            ? "text-sm text-night-muted sm:text-base"
            : "text-h3 text-ink-muted",
        ].join(" ")}
      >
        {growthPartnerLead}
      </p>
      <p
        className={[
          "relative mt-1 w-fit font-display",
          isFooter
            ? "text-base font-semibold text-night-muted sm:text-lg"
            : "mx-auto text-h3 font-semibold text-brand",
        ].join(" ")}
      >
        <span className="invisible block whitespace-nowrap" aria-hidden="true">
          {longestFirmType}
        </span>
        {reduceMotion ? (
          <span
            className={[
              "absolute inset-0 flex items-center whitespace-nowrap",
              isFooter ? "justify-start" : "justify-center",
            ].join(" ")}
          >
            {displayFirmTypes[0]}
          </span>
        ) : (
          <span
            className={[
              "absolute inset-0 flex items-center",
              isFooter ? "justify-start" : "justify-center",
            ].join(" ")}
          >
            <AnimatePresence mode="wait" initial={false}>
              <m.span
                key={activeFirmType}
                className={[
                  "absolute whitespace-nowrap",
                  isFooter ? "inset-y-0 left-0" : "inset-x-0",
                ].join(" ")}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{
                  duration: 0.4,
                  ease: [0.65, 0, 0.35, 1],
                }}
              >
                {activeFirmType}
              </m.span>
            </AnimatePresence>
          </span>
        )}
      </p>
    </div>
  );
}
