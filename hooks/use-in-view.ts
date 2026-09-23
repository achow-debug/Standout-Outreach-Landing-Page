"use client";

import { useEffect, useState, type RefObject } from "react";

type UseInViewOptions = {
  once?: boolean;
  threshold?: number;
};

/**
 * Fires when `ref` enters the viewport. Under reduced motion it reports
 * in-view immediately so callers can show their finished state.
 */
export function useInView(
  ref: RefObject<Element | null>,
  { once = true, threshold = 0.3 }: UseInViewOptions = {},
) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, once, threshold]);

  return inView;
}
