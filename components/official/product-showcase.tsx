"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { AnnotatedIntakeDemo } from "@/components/official/annotated-intake-demo";
import { officialCopy } from "@/lib/official-copy";

const SCENES = officialCopy.showcase.scenes;
const SCENE_COUNT = SCENES.length;
const INTAKE_INDEX = SCENES.findIndex((scene) => scene.id === "intake");
const AUTOPLAY_MS = 5000;
/** Focused card ~60–70vw across desktop widths (viewport is ≤1280). */
const CARD_WIDTH_RATIO = 0.72;
const CARD_GAP_PX = 28;
const SWIPE_THRESHOLD_PX = 56;

/**
 * Product showcase: annotated intake demo by default, then the remaining
 * scene cards. Desktop autoplay never runs while the interactive demo is active.
 */
export function ProductShowcase() {
  return (
    <section id="ui-showcase" className="bg-canvas" aria-label="What changes">
      <MobileShowcase />
      <DesktopShowcase />
    </section>
  );
}

function MobileShowcase() {
  const [active, setActive] = useState(Math.max(0, INTAKE_INDEX));
  const [dragOffset, setDragOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    moved: boolean;
  } | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const node = viewportRef.current;
    if (!node) return;
    const update = () => setViewportWidth(node.clientWidth);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const selectScene = useCallback((index: number) => {
    setActive(((index % SCENE_COUNT) + SCENE_COUNT) % SCENE_COUNT);
    setDragOffset(0);
  }, []);

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    const target = event.target as HTMLElement | null;
    if (
      target?.closest(
        "button, a, input, textarea, select, label, [role='tab'], .sl-pin",
      )
    ) {
      return;
    }
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      moved: false,
    };
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const delta = event.clientX - drag.startX;
    if (Math.abs(delta) > 6) drag.moved = true;
    setDragOffset(delta);
  }

  function endDrag(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const delta = event.clientX - drag.startX;
    dragRef.current = null;
    setDragging(false);
    setDragOffset(0);
    if (Math.abs(delta) >= SWIPE_THRESHOLD_PX) {
      selectScene(active + (delta < 0 ? 1 : -1));
    }
  }

  const trackOffset =
    viewportWidth > 0 ? -active * viewportWidth + dragOffset : dragOffset;

  return (
    <div className="mobile-showcase lg:hidden">
      <div
        ref={viewportRef}
        className="mobile-showcase-viewport"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div
          className={`mobile-showcase-track${dragging ? " is-dragging" : ""}${
            reduceMotion ? " motion-reduce" : ""
          }`}
          style={{ transform: `translate3d(${trackOffset}px, 0, 0)` }}
        >
          {SCENES.map((scene) => (
            <article
              key={scene.id}
              className={`mobile-showcase-card${
                scene.id === "intake" ? " mobile-showcase-card--intake" : ""
              }`}
              style={{ width: viewportWidth > 0 ? `${viewportWidth}px` : "100%" }}
              data-scene={scene.id}
            >
              <div className="mobile-showcase-card-inner">
                {scene.id === "intake" ? (
                  <AnnotatedIntakeDemo hideChrome />
                ) : (
                  <div className="mobile-showcase-scene">
                    <div className="mobile-showcase-scene-copy">
                      <h3 className="m-0 text-h2 text-ink">{scene.title}</h3>
                      <p className="m-0 text-body text-ink-muted">{scene.detail}</p>
                    </div>
                    <div
                      className="mobile-showcase-scene-media"
                      aria-hidden
                    />
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>

      <div
        className="mobile-showcase-dots"
        role="tablist"
        aria-label="Feature cards"
      >
        {SCENES.map((scene, index) => {
          const selected = index === active;
          return (
            <button
              key={scene.id}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-label={scene.title}
              className="rounded-full p-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              onClick={() => selectScene(index)}
            >
              <span
                className={`block size-2 rounded-full transition-[background-color,transform] duration-200 ${
                  selected
                    ? "scale-110 bg-[color-mix(in_oklab,var(--color-ink)_75%,transparent)]"
                    : "bg-[color-mix(in_oklab,var(--color-ink)_18%,transparent)]"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DesktopShowcase() {
  const [active, setActive] = useState(Math.max(0, INTAKE_INDEX));
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    lastX: number;
    moved: boolean;
  } | null>(null);
  const onDemo = SCENES[active]?.id === "intake";
  const pauseAutoplay = hovering || focused || dragging;
  const autoplayActive = !onDemo && !reduceMotion;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const node = viewportRef.current;
    if (!node) return;
    const update = () => setViewportWidth(node.clientWidth);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!autoplayActive || pauseAutoplay) return;
    const id = window.setInterval(() => {
      setActive((current) => nextNonIntakeIndex(current));
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [autoplayActive, pauseAutoplay, active]);

  const cardWidth =
    viewportWidth > 0
      ? Math.min(viewportWidth * CARD_WIDTH_RATIO, window.innerWidth * 0.7)
      : 0;
  const trackOffset =
    viewportWidth > 0
      ? (viewportWidth - cardWidth) / 2 -
        active * (cardWidth + CARD_GAP_PX) +
        dragOffset
      : 0;

  const selectScene = useCallback((index: number) => {
    setActive(((index % SCENE_COUNT) + SCENE_COUNT) % SCENE_COUNT);
    setDragOffset(0);
  }, []);

  function step(delta: number) {
    selectScene(active + delta);
  }

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    // Let interactive form controls keep their own pointer handling.
    const target = event.target as HTMLElement | null;
    if (target?.closest("button, a, input, textarea, select, label, [role='tab']")) {
      return;
    }
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      lastX: event.clientX,
      moved: false,
    };
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const delta = event.clientX - drag.startX;
    if (Math.abs(delta) > 6) drag.moved = true;
    drag.lastX = event.clientX;
    setDragOffset(delta);
  }

  function endDrag(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const delta = event.clientX - drag.startX;
    dragRef.current = null;
    setDragging(false);
    setDragOffset(0);
    if (Math.abs(delta) >= SWIPE_THRESHOLD_PX) {
      selectScene(active + (delta < 0 ? 1 : -1));
    }
  }

  return (
    <div
      className="relative hidden bg-canvas lg:block"
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
    >
      <div
        className="relative z-20 mx-auto flex w-full max-w-[1280px] flex-col gap-5 px-0 pb-14 pt-2 xl:gap-6 xl:pb-16 xl:pt-3"
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setFocused(false);
          }
        }}
      >
        <div className="relative">
          <div
            ref={viewportRef}
            className="showcase-carousel-viewport"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            <div
              className={`showcase-carousel-track${dragging ? " is-dragging" : ""}${reduceMotion ? " motion-reduce" : ""}`}
              style={{ transform: `translate3d(${trackOffset}px, 0, 0)` }}
            >
              {SCENES.map((scene, index) => {
                const selected = index === active;
                return (
                  <article
                    key={scene.id}
                    className={`showcase-carousel-card${selected ? " is-active" : ""}`}
                    style={{
                      width: cardWidth > 0 ? `${cardWidth}px` : `${CARD_WIDTH_RATIO * 100}%`,
                      marginRight: index < SCENE_COUNT - 1 ? CARD_GAP_PX : 0,
                    }}
                    aria-hidden={!selected}
                    data-scene={scene.id}
                  >
                    {selected ? null : (
                      <button
                        type="button"
                        className="showcase-carousel-hit"
                        aria-label={`Show ${scene.title}`}
                        onClick={() => selectScene(index)}
                      />
                    )}
                    <div className="showcase-carousel-card-inner">
                      {scene.id === "intake" ? (
                        <AnnotatedIntakeDemo hideChrome />
                      ) : (
                        <div className="showcase-scene-stack">
                          <div className="showcase-scene-stack-copy">
                            <h3 className="m-0 text-h2 text-ink">{scene.title}</h3>
                            <p className="m-0 text-lead text-ink-muted">
                              {scene.detail}
                            </p>
                          </div>
                          <EmptySceneCard sceneId={scene.id} />
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            className="showcase-carousel-arrow showcase-carousel-arrow--prev"
            aria-label="Previous feature"
            onClick={() => step(-1)}
          >
            <ChevronLeft aria-hidden className="size-5" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            className="showcase-carousel-arrow showcase-carousel-arrow--next"
            aria-label="Next feature"
            onClick={() => step(1)}
          >
            <ChevronRight aria-hidden className="size-5" strokeWidth={1.75} />
          </button>
        </div>

        <div className="mx-auto flex w-full max-w-[42rem] flex-col items-center gap-3 px-8 text-center">
          <div
            className="flex items-center justify-center gap-2"
            role="tablist"
            aria-label="Feature cards"
          >
            {SCENES.map((scene, index) => {
              const selected = index === active;
              return (
                <button
                  key={scene.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-label={scene.title}
                  className="rounded-full p-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  onClick={() => selectScene(index)}
                >
                  <span
                    className={`block size-2 rounded-full transition-[background-color,transform] duration-200 ${
                      selected
                        ? "scale-110 bg-[color-mix(in_oklab,var(--color-ink)_75%,transparent)]"
                        : "bg-[color-mix(in_oklab,var(--color-ink)_18%,transparent)] hover:bg-[color-mix(in_oklab,var(--color-ink)_35%,transparent)]"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <p className="m-0 flex items-center justify-center gap-1.5 text-small text-ink-muted">
            <Lock aria-hidden className="size-3.5 shrink-0 opacity-70" strokeWidth={1.75} />
            <span>{officialCopy.showcase.lockLine}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

/** Skip the interactive demo when autoplaying secondary scenes (desktop). */
function nextNonIntakeIndex(current: number): number {
  for (let step = 1; step <= SCENE_COUNT; step += 1) {
    const next = (current + step) % SCENE_COUNT;
    if (SCENES[next]?.id !== "intake") return next;
  }
  return current;
}

function EmptySceneCard({ sceneId }: { sceneId: string }) {
  return (
    <div
      className="showcase-scene-media"
      data-scene={sceneId}
      aria-hidden
    />
  );
}
