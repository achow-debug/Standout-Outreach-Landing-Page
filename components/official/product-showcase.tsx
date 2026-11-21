"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Lock } from "lucide-react";
import * as m from "motion/react-m";
import { useReducedMotion } from "motion/react";
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

/**
 * Full-bleed demo carousel (§6.8, §10.4).
 * Shared fixed-height frames; scroll-snap with desktop side peeks; dots-only nav.
 */
function centerScrollLeft(
  scroller: HTMLElement,
  slide: HTMLElement,
): number {
  const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
  const target = slideCenter - scroller.clientWidth / 2;
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
        left: centerScrollLeft(scroller, slide),
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
      className="bg-surface-alt pb-10 pt-2 lg:pb-12"
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
            {active === INTAKE_INDEX ? (
              <label className="flex items-center justify-center gap-2 text-small text-ink-muted">
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
            <div
              role="tablist"
              aria-label="Choose a product demo"
              className="flex items-center justify-center gap-2"
            >
              {SCENES.map((scene, index) => {
                const selected = index === active;
                return (
                  <button
                    key={scene.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-label={`Show ${scene.title}`}
                    className={`size-2.5 rounded-full transition-[background-color,transform] duration-(--dur-micro) ease-(--ease-out) focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                      selected
                        ? "scale-110 bg-ink"
                        : "bg-line-strong hover:bg-ink-subtle"
                    }`}
                    onClick={() => scrollToIndex(index)}
                  />
                );
              })}
            </div>

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
        <h3 className="font-display text-h3 text-ink lg:text-h2">{title}</h3>
        <p className="text-small text-ink-muted lg:text-body">{detail}</p>
      </div>
      <div className="showcase-scene-media">{children}</div>
    </div>
  );
}
