"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  CalendarCheck,
  LayoutTemplate,
  Lock,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import * as m from "motion/react-m";
import { LayoutGroup, useReducedMotion } from "motion/react";
import { AnnotatedIntakeDemo } from "@/components/official/annotated-intake-demo";
import { BrowserFrame } from "@/components/ui/BrowserFrame";
import { Container } from "@/components/ui/Container";
import { Placeholder } from "@/components/ui/Placeholder";
import { intakeDemoChrome } from "@/content/intake-demo";
import { officialCopy } from "@/lib/official-copy";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const DEMO_ENTRANCE_S = 0.7; /* --dur-large */
const DEMO_DELAY_S = 0.15;

const SCENES = officialCopy.showcase.scenes;
const SCENE_COUNT = SCENES.length;
const INTAKE_INDEX = Math.max(
  0,
  SCENES.findIndex((scene) => scene.id === "intake"),
);

const SCENE_ICONS: Record<(typeof SCENES)[number]["id"], LucideIcon> = {
  intake: CalendarCheck,
  geo: Sparkles,
  settlement: LayoutTemplate,
};

/**
 * Full-bleed demo carousel (§6.8, §10.4).
 * Shared fixed-height frames; left-aligned active card with right peeks on
 * desktop (label-driven); swipe + snap on mobile; labelled controls.
 */
function startScrollLeft(
  scroller: HTMLElement,
  slide: HTMLElement,
): number {
  const padLeft = Number.parseFloat(getComputedStyle(scroller).paddingLeft) || 0;
  const target = slide.offsetLeft - padLeft;
  const max = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
  return Math.max(0, Math.min(target, max));
}

export function ProductShowcase() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(INTAKE_INDEX);
  const [annotationsOn, setAnnotationsOn] = useState(false);
  const reduce = useReducedMotion();
  const programmaticScrollRef = useRef(false);
  const scrollSettleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const scrollToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const scroller = scrollerRef.current;
      if (!scroller) return;
      const slide = scroller.querySelector<HTMLElement>(
        `[data-slide-index="${index}"]`,
      );
      if (!slide) return;

      programmaticScrollRef.current = true;
      setActive(index);
      scroller.scrollTo({
        left: startScrollLeft(scroller, slide),
        behavior,
      });

      if (scrollSettleTimerRef.current) {
        clearTimeout(scrollSettleTimerRef.current);
      }
      scrollSettleTimerRef.current = setTimeout(
        () => {
          programmaticScrollRef.current = false;
          scrollSettleTimerRef.current = null;
        },
        behavior === "smooth" ? 500 : 0,
      );
    },
    [],
  );

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const slides = Array.from(
      scroller.querySelectorAll<HTMLElement>("[data-slide-index]"),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        if (programmaticScrollRef.current) return;
        let best: { index: number; ratio: number } | null = null;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number(
            (entry.target as HTMLElement).dataset.slideIndex,
          );
          if (Number.isNaN(index)) continue;
          if (!best || entry.intersectionRatio > best.ratio) {
            best = { index, ratio: entry.intersectionRatio };
          }
        }
        if (best) setActive(best.index);
      },
      { root: scroller, threshold: [0.4, 0.55, 0.7] },
    );

    for (const slide of slides) observer.observe(slide);
    return () => {
      observer.disconnect();
      if (scrollSettleTimerRef.current) {
        clearTimeout(scrollSettleTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    /* Start on the intake demo */
    scrollToIndex(INTAKE_INDEX, "auto");
  }, [scrollToIndex]);

  return (
    <section
      id="ui-showcase"
      className="scroll-mt-(--nav-offset) bg-surface-alt pb-10 pt-6 lg:pb-12 lg:pt-8"
      aria-label="What changes"
    >
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Product demos"
        className="relative"
      >
        {/*
          Hero pattern (§8.3): only the demo frame enters on load —
          opacity 0→1, y 24→0, --dur-large, delay 150ms. H1/CTAs stay static.
        */}
        <m.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: DEMO_ENTRANCE_S,
            ease: EASE_OUT,
            delay: reduce ? 0 : DEMO_DELAY_S,
          }}
        >
          <div
            ref={scrollerRef}
            tabIndex={0}
            className="showcase-scroller"
            aria-live="polite"
          >
            {SCENES.map((scene, index) => {
              const selected = index === active;
              return (
                <article
                  key={scene.id}
                  data-slide-index={index}
                  data-scene={scene.id}
                  aria-hidden={!selected}
                  aria-label={`${scene.title} (${index + 1} of ${SCENE_COUNT})`}
                  className="showcase-slide"
                >
                  <BrowserFrame
                    fill
                    demoTheme={scene.id === "intake"}
                    address={scene.addressBar}
                  >
                    {scene.id === "intake" ? (
                      <div className="demo-frame-body">
                        <AnnotatedIntakeDemo
                          hideChrome
                          annotationsOn={annotationsOn}
                          onAnnotationsOnChange={setAnnotationsOn}
                        />
                      </div>
                    ) : (
                      <SceneSlide title={scene.title} detail={scene.detail}>
                        <Placeholder
                          slot={scene.id}
                          aspectClassName="aspect-4/3"
                          className="max-h-full"
                        />
                      </SceneSlide>
                    )}
                  </BrowserFrame>
                </article>
              );
            })}
          </div>
        </m.div>

        <Container className="mt-5">
          <div className="flex flex-col items-center gap-4">
            <div className="flex w-full max-w-3xl flex-col items-center justify-center gap-3 sm:flex-row sm:items-center sm:gap-5">
              <p
                key={SCENES[active]?.id}
                className="m-0 max-w-xl text-center font-demo text-small text-ink-muted sm:flex-1 lg:text-body"
                aria-live="polite"
              >
                {SCENES[active]?.frameCaption}
              </p>
              {active === INTAKE_INDEX ? (
                <label className="flex shrink-0 items-center justify-center gap-2 text-small text-ink-muted">
                  <span>{intakeDemoChrome.annotationsLabel}</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={annotationsOn}
                    className={`relative h-6 w-10 shrink-0 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                      annotationsOn ? "bg-brand" : "bg-ink/20"
                    }`}
                    onClick={() => setAnnotationsOn((on) => !on)}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 size-5 rounded-full bg-white transition-transform ${
                        annotationsOn ? "translate-x-4" : ""
                      }`}
                    />
                  </button>
                </label>
              ) : null}
            </div>
            {/* Desktop: full labelled controls with large hit targets */}
            <LayoutGroup id="showcase-tabs-desktop">
              <div
                role="tablist"
                aria-label="Choose a product demo"
                className="hidden w-full max-w-4xl flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-center md:flex"
              >
                {SCENES.map((scene, index) => {
                  const selected = index === active;
                  const Icon = SCENE_ICONS[scene.id];
                  return (
                    <button
                      key={scene.id}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      className={`relative min-h-11 overflow-hidden rounded-md px-3.5 py-2.5 text-left text-small transition-colors duration-(--dur-micro) ease-(--ease-out) focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:max-w-[15.5rem] sm:flex-1 sm:text-center ${
                        selected
                          ? "text-paper"
                          : "bg-surface text-ink-muted ring-1 ring-line hover:bg-surface-alt hover:text-ink"
                      }`}
                      onClick={() => scrollToIndex(index)}
                    >
                      {selected && !reduce ? (
                        <m.span
                          layoutId="showcase-tab-pill-desktop"
                          className="absolute inset-0 rounded-md bg-ink shadow-sm"
                          transition={{
                            type: "spring",
                            stiffness: 420,
                            damping: 34,
                          }}
                          aria-hidden
                        />
                      ) : null}
                      {selected && reduce ? (
                        <span
                          className="absolute inset-0 rounded-md bg-ink shadow-sm"
                          aria-hidden
                        />
                      ) : null}
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <Icon
                          aria-hidden
                          className="size-4 shrink-0"
                          strokeWidth={selected ? 2.25 : 1.75}
                        />
                        <span>{scene.navLabel}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </LayoutGroup>

            {/* Mobile: compact labelled controls — same job, less chrome */}
            <LayoutGroup id="showcase-tabs-mobile">
              <div
                role="tablist"
                aria-label="Choose a product demo"
                className="flex w-full max-w-md justify-center gap-1.5 md:hidden"
              >
                {SCENES.map((scene, index) => {
                  const selected = index === active;
                  const Icon = SCENE_ICONS[scene.id];
                  return (
                    <button
                      key={scene.id}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      aria-label={scene.navLabel}
                      className={`relative min-h-11 flex-1 overflow-hidden rounded-md px-2 py-2 text-center text-[0.6875rem] leading-snug transition-colors duration-(--dur-micro) ease-(--ease-out) focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                        selected
                          ? "text-paper"
                          : "bg-surface text-ink-muted ring-1 ring-line"
                      }`}
                      onClick={() => scrollToIndex(index)}
                    >
                      {selected && !reduce ? (
                        <m.span
                          layoutId="showcase-tab-pill-mobile"
                          className="absolute inset-0 rounded-md bg-ink"
                          transition={{
                            type: "spring",
                            stiffness: 420,
                            damping: 34,
                          }}
                          aria-hidden
                        />
                      ) : null}
                      {selected && reduce ? (
                        <span
                          className="absolute inset-0 rounded-md bg-ink"
                          aria-hidden
                        />
                      ) : null}
                      <span className="relative z-10 flex flex-col items-center justify-center gap-1">
                        <Icon
                          aria-hidden
                          className="size-3.5 shrink-0"
                          strokeWidth={selected ? 2.25 : 1.75}
                        />
                        <span>{scene.navLabelShort}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </LayoutGroup>

            <p className="m-0 flex items-center gap-2 text-small text-ink-muted">
              <Lock
                aria-hidden
                className="size-3.5 shrink-0 opacity-70"
                strokeWidth={1.75}
              />
              <span>{officialCopy.showcase.lockLine}</span>
            </p>
          </div>
        </Container>
      </div>
    </section>
  );
}

function SceneSlide({
  title,
  detail,
  children,
}: {
  title: string;
  detail: string;
  children: ReactNode;
}) {
  return (
    <div className="showcase-scene">
      <div className="showcase-scene-copy text-left">
        <h3 className="font-demo text-h3 text-ink lg:text-h2">{title}</h3>
        <p className="text-small text-ink-muted lg:text-body">{detail}</p>
      </div>
      <div className="showcase-scene-media">{children}</div>
    </div>
  );
}
