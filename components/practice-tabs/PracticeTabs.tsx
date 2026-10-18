"use client";

import {
  useEffect,
  useRef,
  useState,
  type AnimationEvent,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { trackEvent } from "@/lib/analytics";
import { practiceAreas, type PracticeAreaId } from "@/components/practice-tabs/practiceAreas";

const ROTATE_MS = 6500;

const TAB_CLASS =
  "group relative flex w-full min-w-0 flex-row items-start justify-start gap-1.5 rounded-xl border bg-white px-2 pt-3 pb-3.5 min-h-[76px] text-left shadow-sm cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 md:gap-2 md:rounded-none md:border-0 md:bg-transparent md:px-0 md:pt-1 md:pb-4 md:min-h-0 md:shadow-none";

function nextArea(id: PracticeAreaId): PracticeAreaId {
  const index = practiceAreas.findIndex((area) => area.id === id);
  return practiceAreas[(index + 1) % practiceAreas.length].id;
}

export function PracticeTabs() {
  const [activeId, setActiveId] = useState<PracticeAreaId>("family-law");
  const [autoRotate, setAutoRotate] = useState(true);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);
  const [touchPaused, setTouchPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const tracked = useRef<Set<PracticeAreaId>>(new Set());

  const rotating = autoRotate && !reducedMotion;
  const running =
    rotating &&
    inView &&
    !pageHidden &&
    !hoverPaused &&
    !focusPaused &&
    !touchPaused;

  const rotatingRef = useRef(rotating);
  rotatingRef.current = rotating;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const apply = () => setPageHidden(document.visibilityState === "hidden");
    apply();
    document.addEventListener("visibilitychange", apply);
    return () => document.removeEventListener("visibilitychange", apply);
  }, []);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (!entry.isIntersecting) setTouchPaused(false);
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  function selectTab(id: PracticeAreaId, method: "click" | "keyboard") {
    setAutoRotate(false);
    setActiveId(id);
    if (method !== "click" || tracked.current.has(id)) return;
    tracked.current.add(id);
    trackEvent("practice_area_selected", { area: id });
  }

  function onTabListKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const index = practiceAreas.findIndex((area) => area.id === activeId);
    let nextIndex = index;

    if (event.key === "ArrowRight") {
      nextIndex = (index + 1) % practiceAreas.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (index - 1 + practiceAreas.length) % practiceAreas.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = practiceAreas.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    const id = practiceAreas[nextIndex].id;
    selectTab(id, "keyboard");
    const tab = document.getElementById(`tab-${id}`);
    if (tab instanceof HTMLElement) {
      tab.focus({
        preventScroll: true,
        focusVisible: true,
      } as FocusOptions & { focusVisible?: boolean });
    }
  }

  function onProgressEnd(event: AnimationEvent<HTMLSpanElement>) {
    if (event.animationName !== "practice-tab-progress") return;
    if (!rotatingRef.current) return;
    setActiveId((current) => nextArea(current));
  }

  return (
    <section
      ref={sectionRef}
      aria-label="Practice areas"
      className="relative z-10 -mt-10 rounded-t-[2rem] bg-white py-12 shadow-[0_-12px_40px_-16px_rgba(17,12,46,0.12)] md:-mt-16 md:rounded-t-[3rem] md:py-16"
    >
      <div className="page-shell">
        <div
          onMouseEnter={() => setHoverPaused(true)}
          onMouseLeave={() => setHoverPaused(false)}
          onFocus={() => setFocusPaused(true)}
          onBlur={(event: FocusEvent<HTMLDivElement>) => {
            const next = event.relatedTarget;
            if (!(next instanceof Node) || !event.currentTarget.contains(next)) {
              setFocusPaused(false);
            }
          }}
        >
          <div
            role="tablist"
            aria-label="Practice areas"
            className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-6"
            onKeyDown={onTabListKeyDown}
          >
            {practiceAreas.map((area) => {
              const active = area.id === activeId;
              const Icon = area.icon;
              return (
                <button
                  key={area.id}
                  type="button"
                  role="tab"
                  id={`tab-${area.id}`}
                  aria-selected={active}
                  aria-controls={`panel-${area.id}`}
                  tabIndex={active ? 0 : -1}
                  className={`${TAB_CLASS} ${
                    active
                      ? "border-brand/40 bg-brand/[0.04] text-neutral-900 md:bg-transparent"
                      : "border-neutral-200 text-neutral-500 md:hover:text-neutral-900"
                  }`}
                  onClick={() => selectTab(area.id, "click")}
                >
                  <Icon
                    aria-hidden="true"
                    strokeWidth={1.75}
                    className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400 md:mt-1 md:h-5 md:w-5"
                  />
                  <span className="min-w-0 text-[11px] font-semibold leading-snug md:text-lg md:font-medium">
                    {area.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-[3px] overflow-hidden rounded-b-xl bg-neutral-100 md:h-[2px] md:rounded-none md:bg-neutral-200 md:group-hover:bg-neutral-300"
                  >
                    <span
                      data-progress
                      key={active && rotating ? activeId : "idle"}
                      className="block h-full w-full origin-left bg-brand"
                      style={progressStyle(active, rotating, running)}
                      onAnimationEnd={
                        active && rotating ? onProgressEnd : undefined
                      }
                    />
                  </span>
                </button>
              );
            })}
          </div>

          {practiceAreas.map((area) => {
            const active = area.id === activeId;
            return (
              <div
                key={area.id}
                role="tabpanel"
                id={`panel-${area.id}`}
                aria-labelledby={`tab-${area.id}`}
                tabIndex={0}
                hidden={!active}
                className="mt-5 rounded-3xl focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none md:mt-8 md:rounded-[2rem]"
                onPointerDown={(event: PointerEvent<HTMLDivElement>) => {
                  if (event.pointerType === "touch") setTouchPaused(true);
                }}
              >
                <div
                  className="flex min-h-[440px] rounded-3xl bg-neutral-100/80 p-3 md:min-h-[540px] md:rounded-[2rem] md:p-10"
                  style={
                    reducedMotion
                      ? undefined
                      : { animation: "practice-panel-in 300ms ease-out" }
                  }
                >
                  <div className="flex flex-1 items-center justify-center rounded-2xl border-2 border-dashed border-neutral-300 text-sm text-neutral-500">
                    {area.label} — content coming soon
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function progressStyle(
  active: boolean,
  rotating: boolean,
  running: boolean,
): CSSProperties {
  if (!active || !rotating) {
    return { transform: active ? "scaleX(1)" : "scaleX(0)" };
  }
  return {
    transform: "scaleX(0)",
    animation: `practice-tab-progress ${ROTATE_MS}ms linear forwards`,
    animationPlayState: running ? "running" : "paused",
  };
}
