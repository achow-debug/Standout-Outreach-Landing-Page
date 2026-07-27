"use client";

import { useEffect } from "react";

const FAILSAFE_MS = 1800;

/**
 * One-time scroll reveals for `[data-reveal]` elements.
 * Relies on `html.motion-ok` (set before paint) so no-JS and reduced-motion
 * visitors never see hidden content.
 */
export function MotionBootstrap() {
  useEffect(() => {
    if (!document.documentElement.classList.contains("motion-ok")) {
      return;
    }

    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    if (nodes.length === 0) return;

    const reveal = (el: HTMLElement) => {
      el.classList.add("is-revealed");
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          reveal(el);
          observer.unobserve(el);
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
    );

    for (const el of nodes) {
      observer.observe(el);
    }

    const failsafe = window.setTimeout(() => {
      for (const el of nodes) {
        reveal(el);
      }
    }, FAILSAFE_MS);

    return () => {
      observer.disconnect();
      window.clearTimeout(failsafe);
    };
  }, []);

  return null;
}
