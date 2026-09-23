"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { useBooking } from "@/components/official/booking-provider";
import { officialCopy } from "@/lib/official-copy";
import { siteConfig } from "@/lib/site-config";

const HEADER_NAV_IDS = [
  "who-its-for",
  "how-it-works",
  "founder",
  "faq",
] as const;
type HeaderNavId = (typeof HEADER_NAV_IDS)[number];

function isHeaderNavId(value: string): value is HeaderNavId {
  return (HEADER_NAV_IDS as readonly string[]).includes(value);
}

/**
 * Official-site chrome. Logo only below lg; the CTA lives in the hero
 * and the sticky bar. A hairline and shadow appear after 8px of scroll.
 */
export function SiteHeader() {
  const [standout, group] = siteConfig.businessName.split(" ");
  const { applyLabel } = officialCopy.header;
  const navItems = officialCopy.nav.items.filter((item) =>
    HEADER_NAV_IDS.includes(item.id),
  );
  const { openBooking, booked } = useBooking();
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState<HeaderNavId | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const pillMotion = useRef(false);
  const [pill, setPill] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
    on: boolean;
    motion: boolean;
  }>({ x: 0, y: 0, w: 0, h: 0, on: false, motion: false });

  useEffect(() => {
    const updateScrolled = () => {
      setScrolled(window.scrollY > 8);
    };

    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });
    return () => window.removeEventListener("scroll", updateScrolled);
  }, []);

  useEffect(() => {
    const sections = HEADER_NAV_IDS.map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))
      .sort((a, b) => a.offsetTop - b.offsetTop);

    if (sections.length === 0) return;

    const visible = new Set<string>();
    const observable = sections.filter((el) => el.offsetHeight > 0);
    const hero = document.getElementById("top");
    let heroInBand = false;

    const applyActive = () => {
      if (heroInBand) {
        setActiveId(null);
        return;
      }

      const current = [...observable]
        .reverse()
        .find((el) => visible.has(el.id));
      setActiveId(current && isHeaderNavId(current.id) ? current.id : null);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target.id === "top") {
            heroInBand = entry.isIntersecting;
            continue;
          }
          if (entry.isIntersecting) {
            visible.add(entry.target.id);
          } else {
            visible.delete(entry.target.id);
          }
        }
        applyActive();
      },
      {
        root: null,
        rootMargin: "-40% 0px -55% 0px",
        threshold: 0,
      },
    );

    if (hero) observer.observe(hero);
    for (const section of observable) {
      observer.observe(section);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const measure = () => {
      const link = activeId
        ? nav.querySelector<HTMLAnchorElement>(`a[href="#${activeId}"]`)
        : null;

      if (!link) {
        setPill((prev) =>
          prev.on ? { ...prev, on: false, motion: pillMotion.current } : prev,
        );
        return;
      }

      const next = {
        x: link.offsetLeft,
        y: link.offsetTop,
        w: link.offsetWidth,
        h: link.offsetHeight,
        on: true,
        motion: pillMotion.current,
      };
      setPill((prev) =>
        prev.on === next.on &&
        prev.x === next.x &&
        prev.y === next.y &&
        prev.w === next.w &&
        prev.h === next.h &&
        prev.motion === next.motion
          ? prev
          : next,
      );
      pillMotion.current = true;
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(nav);
    return () => observer.disconnect();
  }, [activeId]);

  return (
    <header
      className={
        scrolled
          ? "official-header is-scrolled bg-white supports-[backdrop-filter]:bg-white/80 supports-[backdrop-filter]:backdrop-blur-md supports-[backdrop-filter]:backdrop-saturate-150"
          : "official-header bg-white supports-[backdrop-filter]:bg-white/80 supports-[backdrop-filter]:backdrop-blur-md supports-[backdrop-filter]:backdrop-saturate-150"
      }
    >
      <div className="page-shell official-header-inner">
        <a href="#top" className="brand-mark official-header-mark">
          <span className="brand-mark-name">
            {standout}{" "}
            <span className="brand-mark-accent">{group}</span>
          </span>
        </a>
        <nav
          ref={navRef}
          className="official-header-nav"
          aria-label="Page"
          style={
            {
              "--pill-x": `${pill.x}px`,
              "--pill-y": `${pill.y}px`,
              "--pill-w": `${pill.w}px`,
              "--pill-h": `${pill.h}px`,
            } as CSSProperties
          }
        >
          <span
            className={
              pill.on
                ? "official-header-pill is-visible"
                : "official-header-pill"
            }
            data-motion={pill.motion ? "true" : "false"}
            aria-hidden="true"
          />
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`official-header-nav-link${activeId === item.id ? " is-active" : ""}`}
              aria-current={activeId === item.id ? "location" : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          className="btn btn-primary btn-cta official-header-cta"
          data-booking-cta=""
          disabled={booked}
          onClick={() => openBooking("header")}
        >
          {booked ? "Call booked" : applyLabel}
          {booked ? null : (
            <span className="btn-cta-arrow" aria-hidden="true">
              →
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
