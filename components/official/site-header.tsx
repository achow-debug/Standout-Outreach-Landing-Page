"use client";

import { useEffect, useRef, useState } from "react";
import { useCtaActions } from "@/lib/cta";
import {
  officialCopy,
  type OfficialNavItem,
  type OfficialNavMenu,
} from "@/lib/official-copy";
import { siteConfig } from "@/lib/site-config";

const navPrimaryClass =
  "site-nav-cta site-nav-cta-primary inline-flex items-center justify-center rounded-lg bg-brand text-xs font-semibold whitespace-nowrap text-white focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:outline-none!";

const navSecondaryClass =
  "site-nav-cta site-nav-cta-secondary items-center justify-center rounded-lg border border-brand bg-transparent text-xs font-semibold whitespace-nowrap text-brand focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:outline-none!";

const barCtaClass = "h-8 px-3 lg:h-10 lg:px-4 xl:px-6";

function isNavMenu(item: OfficialNavItem): item is OfficialNavMenu {
  return item.kind === "menu";
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`site-nav-chevron${open ? " is-open" : ""}`}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function MenuToggle({ open }: { open: boolean }) {
  return (
    <span className="relative block h-5 w-5" aria-hidden="true">
      <span
        className={`site-nav-burger-bar absolute left-0 h-0.5 w-5 origin-center bg-current${open ? " top-[9px] rotate-45" : " top-[3px]"}`}
      />
      <span
        className={`site-nav-burger-bar absolute top-[9px] left-0 h-0.5 w-5 bg-current${open ? " opacity-0" : ""}`}
      />
      <span
        className={`site-nav-burger-bar absolute left-0 h-0.5 w-5 origin-center bg-current${open ? " top-[9px] -rotate-45" : " top-[15px]"}`}
      />
    </span>
  );
}

function PlaceholderList({ item }: { item: OfficialNavMenu }) {
  return (
    <ul className="flex flex-col gap-1 py-1">
      {item.children.map((child) => (
        <li key={child.id}>
          <span className="block px-3 py-1.5 text-sm text-muted">
            {child.label}
          </span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Floating nav card. Mobile is a 52px bar (logo, free enquiry check, menu).
 * Desktop is a card up to 1,280px wide with both CTAs.
 */
export function SiteHeader() {
  const [standout, group] = siteConfig.businessName.split(" ");
  const navItems = officialCopy.nav.items;
  const headerCta = officialCopy.header.ctaLabel;
  const askLabel = officialCopy.header.askLabel;
  const { startForFree, speakToAlex } = useCtaActions("header");
  const [menuOpen, setMenuOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [headerHidden, setHeaderHidden] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const headerHiddenRef = useRef(false);
  const triggerRefs = useRef(new Map<string, HTMLButtonElement>());

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const closeOnBreakpoint = () => {
      setMenuOpen(false);
      setOpenMenuId(null);
    };
    media.addEventListener("change", closeOnBreakpoint);
    return () => media.removeEventListener("change", closeOnBreakpoint);
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
        setOpenMenuId(null);
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
    if (!menuOpen && !openMenuId) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (openMenuId) {
        const id = openMenuId;
        const key = menuOpen ? `mobile:${id}` : `desktop:${id}`;
        setOpenMenuId(null);
        triggerRefs.current.get(key)?.focus();
        return;
      }
      setMenuOpen(false);
      menuButtonRef.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen, openMenuId]);

  useEffect(() => {
    if (!menuOpen && !openMenuId) return;
    const onPointer = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) {
        setOpenMenuId(null);
        setMenuOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [menuOpen, openMenuId]);

  const closeMenus = () => {
    setMenuOpen(false);
    setOpenMenuId(null);
  };

  return (
    <header
      className={`site-header fixed inset-x-0 z-50 px-3 top-[calc(env(safe-area-inset-top)+0.5rem)] md:top-4 md:px-6${headerHidden ? " is-header-hidden" : ""}`}
      inert={headerHidden}
    >
      <nav
        ref={navRef}
        className="site-nav mx-auto w-full max-w-[1280px] rounded-2xl border border-line bg-surface shadow-[0_1px_2px_rgba(17,23,41,0.04),0_8px_24px_rgba(17,23,41,0.06)]"
        aria-label="Page"
      >
        <div className="grid min-h-[52px] grid-cols-[auto_1fr_auto] items-center gap-2 px-3 lg:min-h-14 lg:gap-3 lg:px-4 xl:px-6">
          <a
            href="#top"
            className="brand-mark site-nav-mark text-base leading-none no-underline lg:text-lg xl:text-xl"
            onClick={closeMenus}
          >
            <span className="brand-mark-name whitespace-nowrap">
              {standout}{" "}
              <span className="brand-mark-accent">{group}</span>
            </span>
          </a>

          <div className="hidden items-center justify-center lg:flex">
            {navItems.map((item) => {
              if (!isNavMenu(item)) {
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    className="site-nav-link inline-flex h-9 items-center px-1.5 text-[13px] font-normal whitespace-nowrap no-underline xl:px-3 xl:text-[15px]"
                    onClick={closeMenus}
                  >
                    {item.label}
                  </a>
                );
              }

              const open = openMenuId === item.id;
              const panelId = `nav-menu-${item.id}`;
              return (
                <div key={item.id} className="relative">
                  <button
                    type="button"
                    ref={(node) => {
                      const key = `desktop:${item.id}`;
                      if (node) triggerRefs.current.set(key, node);
                      else triggerRefs.current.delete(key);
                    }}
                    className="site-nav-link inline-flex h-9 items-center gap-1 px-1.5 text-[13px] font-normal whitespace-nowrap xl:px-3 xl:text-[15px]"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenMenuId(open ? null : item.id)}
                  >
                    {item.label}
                    <Chevron open={open} />
                  </button>
                  <div
                    id={panelId}
                    className={`site-nav-panel absolute top-full left-0 z-30 mt-2 min-w-52 rounded-lg border border-line bg-surface shadow-[0_8px_24px_rgba(17,23,41,0.08)]${open ? " is-open" : ""}`}
                    aria-hidden={!open}
                    inert={!open}
                  >
                    <div className="site-nav-panel-inner">
                      <PlaceholderList item={item} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="col-start-3 flex items-center justify-end gap-1.5 lg:gap-2">
            <button
              type="button"
              className={`${navPrimaryClass} ${barCtaClass}`}
              data-cta="measure-enquiries"
              onClick={(event) => {
                closeMenus();
                startForFree(event.currentTarget);
              }}
            >
              {headerCta}
            </button>
            <button
              type="button"
              className={`${navSecondaryClass} ${barCtaClass} hidden lg:inline-flex`}
              onClick={() => {
                closeMenus();
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
              onClick={() => {
                setOpenMenuId(null);
                setMenuOpen((open) => !open);
              }}
            >
              <MenuToggle open={menuOpen} />
            </button>
          </div>
        </div>

        <div id="mobile-menu" hidden={!menuOpen} className="px-3 pb-4 lg:hidden">
          {navItems.map((item) => {
            if (!isNavMenu(item)) {
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className="site-nav-menu-link block border-t border-line py-3 text-lg font-semibold text-ink! no-underline"
                  onClick={closeMenus}
                >
                  {item.label}
                </a>
              );
            }

            const open = openMenuId === item.id;
            const panelId = `mobile-nav-menu-${item.id}`;
            return (
              <div key={item.id} className="border-t border-line">
                <button
                  type="button"
                  ref={(node) => {
                    const key = `mobile:${item.id}`;
                    if (node) triggerRefs.current.set(key, node);
                    else triggerRefs.current.delete(key);
                  }}
                  className="site-nav-menu-link flex w-full items-center justify-between py-3 text-left text-lg font-semibold text-ink"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenMenuId(open ? null : item.id)}
                >
                  {item.label}
                  <Chevron open={open} />
                </button>
                <div
                  id={panelId}
                  className={`site-nav-panel${open ? " is-open" : ""}`}
                  aria-hidden={!open}
                  inert={!open}
                >
                  <div className="site-nav-panel-inner">
                    <div className="pb-3 pl-4">
                      <PlaceholderList item={item} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="mt-3 flex flex-col gap-3">
            <button
              type="button"
              className={`${navPrimaryClass} h-10 w-full px-3`}
              data-cta="measure-enquiries"
              onClick={(event) => {
                closeMenus();
                startForFree(event.currentTarget);
              }}
            >
              {headerCta}
            </button>
            <button
              type="button"
              className={`${navSecondaryClass} h-10 w-full px-3 inline-flex`}
              onClick={() => {
                closeMenus();
                speakToAlex();
              }}
            >
              {askLabel}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
