"use client";

import { useEffect, useRef, useState } from "react";
import { useCtaActions } from "@/lib/cta";
import { officialCopy } from "@/lib/official-copy";
import { siteConfig } from "@/lib/site-config";

const navPrimaryClass =
  "inline-flex h-10 items-center justify-center rounded-xl bg-brand px-3 text-sm font-semibold whitespace-nowrap text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:outline-none! disabled:cursor-default disabled:opacity-80 lg:h-8 lg:px-3.5";

const navSecondaryClass =
  "h-10 items-center justify-center rounded-xl border border-brand bg-transparent px-3.5 text-sm font-semibold whitespace-nowrap text-brand transition-colors hover:bg-accent-soft focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:outline-none! lg:h-8";

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
 * Floating nav. Mobile is a 56px pill (logo, enquiry check, menu).
 * Desktop is a card up to 1,000px wide and about 48px tall.
 */
export function SiteHeader() {
  const [standout, group] = siteConfig.businessName.split(" ");
  const navItems = officialCopy.nav.items;
  const headerCta = officialCopy.header.ctaLabel;
  const askLabel = officialCopy.header.askLabel;
  const { startForFree, speakToAlex } = useCtaActions("header");
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const headerHiddenRef = useRef(false);

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
    headerHiddenRef.current = false;
    setHeaderHidden(false);
  }, [menuOpen]);

  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      lastY = y;
      if (menuOpen) return;

      if (y < 48) {
        if (headerHiddenRef.current) {
          headerHiddenRef.current = false;
          setHeaderHidden(false);
        }
        return;
      }

      if (delta > 6 && !headerHiddenRef.current) {
        headerHiddenRef.current = true;
        setHeaderHidden(true);
        return;
      }

      if (delta < -6 && headerHiddenRef.current) {
        headerHiddenRef.current = false;
        setHeaderHidden(false);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

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
    <header
      className={`site-header fixed inset-x-0 z-50 px-3 top-[calc(env(safe-area-inset-top)+0.75rem)] md:top-4 md:px-6${headerHidden ? " is-header-hidden" : ""}`}
      inert={headerHidden}
    >
      <nav
        className={`site-nav mx-auto w-full max-w-[1000px] border border-line bg-surface shadow-[0_1px_2px_rgba(17,23,41,0.04),0_8px_24px_rgba(17,23,41,0.06)] lg:h-12 lg:rounded-2xl${menuOpen ? " rounded-3xl" : " h-14 rounded-full"}`}
        aria-label="Page"
      >
        <div className="grid h-full grid-cols-[auto_1fr_auto] items-center gap-2 px-3 lg:gap-6 lg:px-5">
          <a
            href="#top"
            className="brand-mark site-nav-mark text-lg leading-none no-underline lg:text-xl"
            onClick={() => setMenuOpen(false)}
          >
            <span className="brand-mark-name whitespace-nowrap">
              {standout}{" "}
              <span className="brand-mark-accent">{group}</span>
            </span>
          </a>

          <div className="hidden items-center justify-center gap-7 lg:flex">
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

          <div className="col-start-3 flex items-center justify-end gap-1.5 lg:gap-2">
            <button
              type="button"
              className={navPrimaryClass}
              data-cta="measure-enquiries"
              onClick={(event) => {
                setMenuOpen(false);
                startForFree(event.currentTarget);
              }}
            >
              {headerCta}
            </button>
            <button
              type="button"
              className={`${navSecondaryClass} hidden lg:inline-flex`}
              onClick={() => {
                setMenuOpen(false);
                speakToAlex();
              }}
            >
              {askLabel}
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
          className="px-3 pb-4 lg:hidden"
        >
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="block border-t border-line py-3 font-sans text-base font-medium text-ink! no-underline"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <button
            type="button"
            className={`${navSecondaryClass} mt-3 inline-flex w-full`}
            onClick={() => {
              setMenuOpen(false);
              speakToAlex();
            }}
          >
            {askLabel}
          </button>
        </div>
      </nav>
    </header>
  );
}
