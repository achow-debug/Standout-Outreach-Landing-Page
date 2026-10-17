"use client";

import { useEffect, useRef, useState } from "react";
import { useBooking } from "@/components/official/booking-provider";
import { useCtaActions } from "@/lib/cta";
import { officialCopy } from "@/lib/official-copy";
import { siteConfig } from "@/lib/site-config";

const navCtaClass =
  "inline-flex h-10 items-center justify-center rounded-xl bg-brand px-3 text-sm font-semibold whitespace-nowrap text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:outline-none! disabled:cursor-default disabled:opacity-80 sm:px-4";

function MenuIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

/**
 * Floating pill nav. Start for free still goes through openBooking("header").
 */
export function SiteHeader() {
  const [standout, group] = siteConfig.businessName.split(" ");
  const navItems = officialCopy.nav.items;
  const { booked } = useBooking();
  const { startForFree, speakToAlex } = useCtaActions("header");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (media.matches) setMenuOpen(false);
    };
    closeOnDesktop();
    media.addEventListener("change", closeOnDesktop);
    window.addEventListener("resize", closeOnDesktop);
    return () => {
      media.removeEventListener("change", closeOnDesktop);
      window.removeEventListener("resize", closeOnDesktop);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      menuButtonRef.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header className="fixed inset-x-0 z-50 px-3 top-[calc(env(safe-area-inset-top)+0.75rem)] md:top-4 md:px-6">
      <nav
        className="site-nav mx-auto max-w-6xl rounded-2xl border border-ink/10 bg-white shadow-[0_1px_2px_rgba(17,23,41,0.04),0_8px_24px_rgba(17,23,41,0.06)]"
        aria-label="Page"
      >
        <div className="relative flex h-14 items-center justify-between px-4 md:h-16 md:px-6">
          <a
            href="#top"
            className="brand-mark site-nav-mark relative z-10 text-lg leading-none no-underline md:text-2xl"
            onClick={() => setMenuOpen(false)}
          >
            <span className="brand-mark-name whitespace-nowrap">
              {standout}{" "}
              <span className="brand-mark-accent">{group}</span>
            </span>
          </a>

          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="font-sans text-[15px] font-medium text-ink/75! no-underline transition-colors hover:text-ink!"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="relative z-10 flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              className={navCtaClass}
              data-cta="start-free"
              data-booking-cta=""
              disabled={booked}
              onClick={() => {
                setMenuOpen(false);
                startForFree();
              }}
            >
              {booked ? "Call booked" : "Start for free"}
            </button>
            <button
              ref={menuButtonRef}
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center text-ink lg:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        <div
          id="mobile-menu"
          hidden={!menuOpen}
          className="px-4 pb-4 md:px-6 lg:hidden"
        >
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="block border-t border-ink/10 py-3 font-sans text-base font-medium text-ink! no-underline"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <button
            type="button"
            className={`${navCtaClass} mt-3 w-full`}
            data-cta="start-free"
            data-booking-cta=""
            disabled={booked}
            onClick={() => {
              setMenuOpen(false);
              startForFree();
            }}
          >
            {booked ? "Call booked" : "Start for free"}
          </button>
          <button
            type="button"
            data-cta="speak-to-alex"
            data-booking-cta=""
            onClick={() => {
              setMenuOpen(false);
              speakToAlex();
            }}
            className="mt-2 inline-flex h-10 w-full items-center justify-center rounded-xl border border-ink/15 bg-white px-4 text-sm font-semibold text-ink shadow-sm transition-colors hover:border-ink/30 focus-visible:outline-none! focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            Speak to Alex
          </button>
        </div>
      </nav>
    </header>
  );
}
