"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { officialCopy } from "@/lib/official-copy";

const SCENES = officialCopy.showcase.scenes;
const SCENE_COUNT = SCENES.length;
const AUTOPLAY_MS = 4000;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function sceneIndex(progress: number) {
  return Math.min(SCENE_COUNT - 1, Math.floor(progress * SCENE_COUNT));
}

function barFill(progress: number, index: number) {
  const scaled = progress * SCENE_COUNT;
  if (index < Math.floor(scaled)) return 1;
  if (index === Math.floor(scaled)) return scaled - index;
  if (progress >= 1 && index === SCENE_COUNT - 1) return 1;
  return 0;
}

/**
 * Fyxer product showcase: three scenes.
 * Mobile is a centred caption, dots, and an empty card over a blank photo crop.
 * Desktop is a sticky one-screen panel; scrolling about three screens advances the scene.
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
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 1023px)");
    if (paused || prefersReducedMotion() || !mobile.matches) return;
    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % SCENE_COUNT);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  function selectScene(index: number) {
    setActive(index);
    setPaused(true);
  }

  return (
    <div className="mx-auto flex w-full max-w-[480px] flex-col bg-canvas pt-6 lg:hidden">
      <div className="relative min-h-16 px-4">
        {SCENES.map((scene, index) => (
          <p
            key={scene.id}
            className={`absolute inset-x-4 bottom-0 text-center text-h2 text-ink whitespace-pre-line transition-opacity duration-300 motion-reduce:transition-none ${
              index === active ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={index !== active}
          >
            {scene.mobileCaption}
          </p>
        ))}
      </div>
      <div className="flex justify-center pt-3" role="tablist" aria-label="Scenes">
        {SCENES.map((scene, index) => {
          const selected = index === active;
          return (
            <button
              key={scene.id}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-label={scene.title}
              className="p-1.5"
              onClick={() => selectScene(index)}
            >
              <span
                className={`block size-1.5 rounded-full ${
                  selected
                    ? "bg-[color-mix(in_oklab,var(--color-ink)_70%,transparent)]"
                    : "bg-[color-mix(in_oklab,var(--color-ink)_15%,transparent)]"
                }`}
              />
            </button>
          );
        })}
      </div>
      <ShowcaseStage active={active} />
    </div>
  );
}

function DesktopShowcase() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const active = sceneIndex(progress);

  const measure = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const rect = root.getBoundingClientRect();
    const total = root.offsetHeight - window.innerHeight;
    const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 0));
    setProgress(total > 0 ? scrolled / total : 0);
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  function scrollToScene(index: number) {
    const root = rootRef.current;
    if (!root) return;
    const total = root.offsetHeight - window.innerHeight;
    const top = root.getBoundingClientRect().top + window.scrollY;
    const target = top + (index / SCENE_COUNT) * total;
    window.scrollTo({
      top: target,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }

  return (
    <div ref={rootRef} className="relative hidden h-[300svh] lg:block">
      <div className="sticky top-0 h-svh overflow-hidden bg-canvas">
        <PhotoFrame crop="left" />
        <div className="absolute top-[4%] left-[72px] z-20 flex w-[345.6px] max-w-[360px] flex-col">
          {SCENES.map((scene, index) => {
            const fill = barFill(progress, index);
            const current = index === active;
            return (
              <button
                key={scene.id}
                type="button"
                className={`flex flex-col items-start gap-2 py-2 text-left transition-opacity duration-150 motion-reduce:transition-none ${
                  current ? "opacity-100" : "opacity-35"
                }`}
                aria-current={current ? "step" : undefined}
                onClick={() => scrollToScene(index)}
              >
                <span className="text-h2 text-ink">{scene.title}</span>
                <span className="text-lead text-ink">{scene.detail}</span>
                <span className="mt-1 block h-[3px] w-full overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--color-ink)_10%,transparent)]">
                  <span
                    className="block h-full origin-left rounded-full bg-[color-mix(in_oklab,var(--color-ink)_70%,transparent)]"
                    style={{ transform: `scaleX(${fill})` }}
                  />
                </span>
              </button>
            );
          })}
        </div>
        <div className="absolute top-[12%] right-[8%] z-10 w-[min(320px,34vw)]">
          <CardStack active={active} />
        </div>
      </div>
    </div>
  );
}

function ShowcaseStage({ active }: { active: number }) {
  return (
    <div className="relative mt-4 aspect-[375/320] w-full overflow-hidden">
      <div className="absolute bottom-0 aspect-[2222/1728] w-full">
        <PhotoFrame crop="center" />
      </div>
      <div className="absolute top-[2%] right-3 left-[41%]">
        <CardStack active={active} />
      </div>
    </div>
  );
}

/**
 * Empty photo slot. Crops match the reference so a photograph can drop in later:
 * mobile cover, subject centred; desktop cover, subject in the left half.
 */
function PhotoFrame({ crop }: { crop: "center" | "left" }) {
  const position = crop === "center" ? "center" : "left center";
  return (
    <div
      aria-hidden
      className={
        crop === "left"
          ? "pointer-events-none absolute bottom-0 left-[-42%] aspect-[4000/1728] w-[180%]"
          : "absolute inset-0"
      }
      data-photo-crop={crop}
      style={{ objectFit: "cover", objectPosition: position }}
    />
  );
}

function CardStack({ active }: { active: number }) {
  return (
    <div className="relative min-h-40">
      {SCENES.map((scene, index) => (
        <div
          key={scene.id}
          className={`absolute inset-0 rounded-2xl bg-surface transition-opacity duration-300 motion-reduce:transition-none ${
            index === active ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          aria-hidden={index !== active}
        />
      ))}
    </div>
  );
}
