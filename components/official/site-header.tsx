"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import * as m from "motion/react-m";
import { AnimatePresence } from "motion/react";
import {
  officialCopy,
  type OfficialNavItem,
  type OfficialNavMenu,
} from "@/lib/official-copy";
import { ENQUIRY_CHECK_HREF, SPEAK_TO_ALEX_HREF } from "@/lib/cta";
import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

function isNavMenu(item: OfficialNavItem): item is OfficialNavMenu {
  return item.kind === "menu";
}

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
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
      className={cx(
        "transition-transform duration-(--dur-micro) ease-(--ease-out)",
        open && "rotate-180",
      )}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span className="relative block size-5" aria-hidden="true">
      <span
        className={cx(
          "absolute left-0 h-0.5 w-5 origin-center bg-ink transition-transform duration-(--dur-micro) ease-(--ease-out)",
          open ? "top-2 rotate-45" : "top-1",
        )}
      />
      <span
        className={cx(
          "absolute top-2 left-0 h-0.5 w-5 bg-ink transition-opacity duration-(--dur-micro) ease-(--ease-out)",
          open && "opacity-0",
        )}
      />
      <span
        className={cx(
          "absolute left-0 h-0.5 w-5 origin-center bg-ink transition-transform duration-(--dur-micro) ease-(--ease-out)",
          open ? "top-2 -rotate-45" : "top-3",
        )}
      />
    </span>
  );
}

function Logo({ onNavigate }: { onNavigate?: () => void }) {
  const [standout, group] = siteConfig.businessName.split(" ");
  return (
    <Link
      href="/"
      className="font-sans text-body font-bold leading-none text-ink no-underline"
      onClick={onNavigate}
    >
      <span className="whitespace-nowrap">
        {standout} <span className="text-brand">{group}</span>
      </span>
    </Link>
  );
}

function DropdownItems({
  item,
  onNavigate,
}: {
  item: OfficialNavMenu;
  onNavigate?: () => void;
}) {
  return (
    <ul className="m-0 flex list-none flex-col p-0">
      {item.children.map((child) => {
        const href = "href" in child ? child.href : undefined;
        return (
          <li key={child.id}>
            {href ? (
              <a
                href={href}
                className="block rounded-md px-3 py-2 text-small font-semibold text-ink no-underline hover:bg-surface-alt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                onClick={onNavigate}
              >
                {child.label}
              </a>
            ) : (
              <span className="block px-3 py-2 text-small text-ink-muted">
                {child.label}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function DesktopDropdown({
  item,
  open,
  onToggle,
  onNavigate,
  triggerRef,
}: {
  item: OfficialNavMenu;
  open: boolean;
  onToggle: () => void;
  onNavigate: () => void;
  triggerRef: (node: HTMLButtonElement | null) => void;
}) {
  const panelId = useId();

  return (
    <div className="relative">
      <button
        type="button"
        ref={triggerRef}
        className="inline-flex items-center gap-1 font-sans text-small font-semibold text-ink-muted no-underline hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
      >
        {item.label}
        <Chevron open={open} />
      </button>
      <AnimatePresence>
        {open ? (
          <m.div
            id={panelId}
            role="menu"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-full left-0 z-30 mt-2 min-w-52 rounded-lg border border-line bg-surface p-2 shadow-md"
          >
            <DropdownItems item={item} onNavigate={onNavigate} />
          </m.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/**
 * Floating nav (§6.2). Never hides on scroll. Shadow after 8px.
 * Logo left edge = container content edge (path line).
 */
export function SiteHeader() {
  const navItems = officialCopy.nav.items;
  const headerCta = officialCopy.header.ctaLabel;
  const headerCtaMobile = officialCopy.header.ctaLabelMobile;
  const askLabel = officialCopy.header.askLabel;

  const [menuOpen, setMenuOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const triggerRefs = useRef(new Map<string, HTMLButtonElement>());
  const sheetTitleId = useId();

  const closeMenus = useCallback(() => {
    setMenuOpen(false);
    setOpenMenuId(null);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const onChange = () => closeMenus();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [closeMenus]);

  useEffect(() => {
    if (!menuOpen && !openMenuId) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (openMenuId) {
        const id = openMenuId;
        setOpenMenuId(null);
        triggerRefs.current.get(`desktop:${id}`)?.focus();
        return;
      }
      setMenuOpen(false);
      menuButtonRef.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen, openMenuId]);

  useEffect(() => {
    if (!openMenuId) return;
    const onPointer = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [openMenuId]);

  /* Body scroll lock + focus trap for mobile sheet */
  useEffect(() => {
    if (!menuOpen) return;
    const html = document.documentElement;
    const body = document.body;
    const scrollY = window.scrollY;
    html.classList.add("sheet-open");
    body.style.setProperty("top", `-${scrollY}px`, "important");

    const sheet = sheetRef.current;
    const focusable = sheet?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable?.[0];
    const last = focusable?.[focusable.length - 1];
    first?.focus();

    const onTab = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onTab);

    return () => {
      html.classList.remove("sheet-open");
      body.style.removeProperty("top");
      window.scrollTo(0, scrollY);
      document.removeEventListener("keydown", onTab);
    };
  }, [menuOpen]);

  return (
    <header className="fixed top-3 inset-x-0 z-50">
      <Container>
        <nav
          ref={navRef}
          aria-label="Page"
          data-scrolled={scrolled ? "true" : undefined}
          className={cx(
            "flex h-(--nav-h) items-center gap-2 overflow-hidden rounded-lg border border-line bg-surface/85 px-3 backdrop-blur-md transition-shadow duration-(--dur-ui) ease-(--ease-out) sm:gap-4 sm:px-4 lg:px-6",
            scrolled && "shadow-sm",
          )}
        >
          <Logo onNavigate={closeMenus} />

          <div className="hidden flex-1 items-center justify-center gap-8 lg:flex">
            {navItems.map((item) => {
              if (!isNavMenu(item)) {
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    className="font-sans text-small font-semibold text-ink-muted no-underline hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                    onClick={closeMenus}
                  >
                    {item.label}
                  </a>
                );
              }
              return (
                <DesktopDropdown
                  key={item.id}
                  item={item}
                  open={openMenuId === item.id}
                  onToggle={() =>
                    setOpenMenuId(openMenuId === item.id ? null : item.id)
                  }
                  onNavigate={closeMenus}
                  triggerRef={(node) => {
                    const key = `desktop:${item.id}`;
                    if (node) triggerRefs.current.set(key, node);
                    else triggerRefs.current.delete(key);
                  }}
                />
              );
            })}
          </div>

          <div className="ml-auto flex min-w-0 items-center gap-1.5 sm:gap-2">
            <Button
              variant="primary"
              size="md"
              href={ENQUIRY_CHECK_HREF}
              data-cta="measure-enquiries"
              className="shrink-0 whitespace-nowrap max-lg:h-9 max-lg:px-3 max-lg:text-[0.8125rem]"
              onClick={closeMenus}
            >
              <span className="lg:hidden">{headerCtaMobile}</span>
              <span className="hidden lg:inline">{headerCta}</span>
            </Button>
            {/* Wrapper so Button’s inline-flex cannot override mobile hiding. */}
            <div className="hidden lg:contents">
              <Button
                variant="secondary"
                size="md"
                href={SPEAK_TO_ALEX_HREF}
                onClick={closeMenus}
              >
                {askLabel}
              </Button>
            </div>
            <button
              ref={menuButtonRef}
              type="button"
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-ink sm:size-11 lg:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-sheet"
              onClick={() => {
                setOpenMenuId(null);
                setMenuOpen((open) => !open);
              }}
            >
              <MenuIcon open={menuOpen} />
            </button>
          </div>
        </nav>
      </Container>

      <AnimatePresence>
        {menuOpen ? (
          <m.div
            id="mobile-nav-sheet"
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={sheetTitleId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex flex-col bg-paper lg:hidden"
          >
            <div className="flex h-(--nav-h) items-center justify-between border-b border-line px-6">
              <Logo onNavigate={closeMenus} />
              <p id={sheetTitleId} className="sr-only">
                Menu
              </p>
              <button
                type="button"
                className="inline-flex size-11 items-center justify-center rounded-md text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                aria-label="Close menu"
                onClick={() => {
                  setMenuOpen(false);
                  menuButtonRef.current?.focus();
                }}
              >
                <MenuIcon open />
              </button>
            </div>

            <div className="flex flex-1 flex-col overflow-y-auto px-6 py-8">
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <MobileNavBlock
                    key={item.id}
                    item={item}
                    openMenuId={openMenuId}
                    setOpenMenuId={setOpenMenuId}
                    onNavigate={closeMenus}
                  />
                ))}
              </div>
              <div className="mt-10 flex flex-col gap-3">
                <Button
                  variant="primary"
                  size="md"
                  href={ENQUIRY_CHECK_HREF}
                  className="w-full"
                  data-cta="measure-enquiries"
                  onClick={closeMenus}
                >
                  {headerCta}
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  href={SPEAK_TO_ALEX_HREF}
                  className="w-full"
                  onClick={closeMenus}
                >
                  {askLabel}
                </Button>
              </div>
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

function MobileNavBlock({
  item,
  openMenuId,
  setOpenMenuId,
  onNavigate,
}: {
  item: OfficialNavItem;
  openMenuId: string | null;
  setOpenMenuId: (id: string | null) => void;
  onNavigate: () => void;
}) {
  if (!isNavMenu(item)) {
    return (
      <a
        href={item.href}
        className="font-display text-h3 text-ink no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        onClick={onNavigate}
      >
        {item.label}
      </a>
    );
  }

  const open = openMenuId === item.id;
  return (
    <div>
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 py-2 text-left font-display text-h3 text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        aria-expanded={open}
        onClick={() => setOpenMenuId(open ? null : item.id)}
      >
        {item.label}
        <Chevron open={open} />
      </button>
      {open ? (
        <div className="pb-4 pl-4">
          <DropdownItems item={item} onNavigate={onNavigate} />
        </div>
      ) : null}
    </div>
  );
}
