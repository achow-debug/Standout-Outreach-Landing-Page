"use client";

import { useEffect, useRef, useState } from "react";
import { useBooking } from "@/components/official/booking-provider";
import { keepTogether } from "@/components/official/no-break";
import { officialCopy } from "@/lib/official-copy";

function useStickyCtaVisible(bookingOpen: boolean, booked: boolean) {
  const [pastHero, setPastHero] = useState(false);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const heroCta = document.getElementById("hero-cta");
    const ends = ["book", "site-footer"]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    const visible = new Set<Element>();

    const heroObs = new IntersectionObserver(([entry]) => {
      if (!entry) return;
      setPastHero(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    const endObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      });
      setAtEnd(visible.size > 0);
    });

    if (heroCta) heroObs.observe(heroCta);
    ends.forEach((el) => endObs.observe(el));
    return () => {
      heroObs.disconnect();
      endObs.disconnect();
    };
  }, []);

  return pastHero && !atEnd && !bookingOpen && !booked;
}

/**
 * Mobile-only bar. Appears after the hero CTA leaves the viewport,
 * and hides at the final CTA, the footer, during Calendly, and after booking.
 */
export function StickyCta() {
  const { openBooking, bookingOpen, booked } = useBooking();
  const { applyLabel } = officialCopy.header;
  const visible = useStickyCtaVisible(bookingOpen, booked);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const root = document.documentElement;
    const apply = () => {
      root.style.setProperty("--official-sticky-h", `${bar.offsetHeight}px`);
    };
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(bar);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--official-sticky-h");
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("official-sticky-on", visible);
    return () => {
      document.documentElement.classList.remove("official-sticky-on");
    };
  }, [visible]);

  return (
    <div
      ref={barRef}
      className={
        visible
          ? "official-sticky-cta is-visible border-t border-slate-900/5 bg-white/85 backdrop-blur-md"
          : "official-sticky-cta border-t border-slate-900/5 bg-white/85 backdrop-blur-md"
      }
      aria-hidden={!visible}
      inert={!visible}
    >
      <button
        type="button"
        className="btn btn-primary btn-cta official-sticky-cta-btn"
        data-booking-cta=""
        tabIndex={visible ? 0 : -1}
        onClick={() => openBooking("sticky")}
      >
        {keepTogether(applyLabel)}
      </button>
    </div>
  );
}
