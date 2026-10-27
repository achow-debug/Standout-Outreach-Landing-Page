"use client";

import { useEffect, useState } from "react";
import { AnnotatedIntakeDemo } from "@/components/official/annotated-intake-demo";
import { officialCopy } from "@/lib/official-copy";

const SCENES = officialCopy.showcase.scenes;
const SCENE_COUNT = SCENES.length;
const INTAKE_INDEX = SCENES.findIndex((scene) => scene.id === "intake");
const AUTOPLAY_MS = 4000;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Product showcase: annotated intake demo by default, then the remaining
 * scene cards. Autoplay never runs while the interactive demo is active.
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
  const [paused, setPaused] = useState(false);
  const onDemo = SCENES[active]?.id === "intake";

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 1023px)");
    // Never auto-rotate away from the interactive demo.
    if (paused || onDemo || prefersReducedMotion() || !mobile.matches) return;
    const id = window.setInterval(() => {
      setActive((current) => nextNonIntakeIndex(current));
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, onDemo]);

  function selectScene(index: number) {
    setActive(index);
    setPaused(true);
  }

  return (
    <div className="mx-auto flex w-full max-w-[520px] flex-col bg-canvas pt-6 lg:hidden">
      <div className="relative min-h-[4.25rem] px-4">
        {SCENES.map((scene, index) => (
          <p
            key={scene.id}
            className={`absolute inset-x-4 bottom-0 text-center text-[1.625rem] leading-[1.15] font-bold tracking-[-0.02em] text-ink whitespace-pre-line transition-opacity duration-300 motion-reduce:transition-none ${
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
      <div className="px-3 pt-4 pb-8">
        <ShowcaseBody active={active} />
      </div>
    </div>
  );
}

function DesktopShowcase() {
  const [active, setActive] = useState(Math.max(0, INTAKE_INDEX));
  const [chosen, setChosen] = useState(false);
  const [hovering, setHovering] = useState(false);
  const onDemo = SCENES[active]?.id === "intake";
  const paused = chosen || hovering || onDemo;
  const scene = SCENES[active];

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    if (paused || prefersReducedMotion()) return;

    let id = 0;
    const stop = () => window.clearInterval(id);
    const start = () => {
      stop();
      if (!desktop.matches) return;
      id = window.setInterval(() => {
        setActive((current) => nextNonIntakeIndex(current));
      }, AUTOPLAY_MS);
    };
    const onChange = () => start();

    start();
    desktop.addEventListener("change", onChange);
    return () => {
      stop();
      desktop.removeEventListener("change", onChange);
    };
  }, [paused]);

  function selectScene(index: number) {
    setActive(index);
    setChosen(true);
  }

  return (
    <div
      className="relative hidden overflow-hidden bg-canvas lg:block"
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
    >
      <PhotoFrame crop="left" />
      <div className="relative z-20 mx-auto flex w-full max-w-[1120px] flex-col gap-10 px-10 py-16 xl:px-4 xl:py-24">
        <div className="flex flex-wrap items-end gap-x-8 gap-y-3" role="tablist" aria-label="Scenes">
          {SCENES.map((item, index) => {
            const selected = index === active;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={selected}
                className={`border-b-2 pb-2 text-left text-base leading-snug transition-opacity duration-150 motion-reduce:transition-none ${
                  selected
                    ? "border-[color-mix(in_oklab,var(--color-ink)_70%,transparent)] text-ink opacity-100"
                    : "border-transparent text-ink opacity-40 hover:opacity-70"
                }`}
                onClick={() => selectScene(index)}
              >
                {item.title}
              </button>
            );
          })}
        </div>

        {onDemo ? (
          <div className="flex justify-center">
            <AnnotatedIntakeDemo />
          </div>
        ) : (
          <div className="flex items-center justify-between gap-16">
            <div className="max-w-[34rem]">
              <p className="text-h2 text-ink">{scene.title}</p>
              <p className="text-lead mt-4 text-ink">{scene.detail}</p>
            </div>
            <div className="w-[min(340px,32vw)] shrink-0">
              <EmptySceneCard sceneId={scene.id} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ShowcaseBody({ active }: { active: number }) {
  const scene = SCENES[active];
  if (scene?.id === "intake") {
    return <AnnotatedIntakeDemo />;
  }
  return (
    <div className="relative mt-2 min-h-40">
      <EmptySceneCard sceneId={scene.id} />
    </div>
  );
}

/** Skip the interactive demo when autoplaying secondary scenes. */
function nextNonIntakeIndex(current: number): number {
  for (let step = 1; step <= SCENE_COUNT; step += 1) {
    const next = (current + step) % SCENE_COUNT;
    if (SCENES[next]?.id !== "intake") return next;
  }
  return current;
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

function EmptySceneCard({ sceneId }: { sceneId: string }) {
  return (
    <div
      className="min-h-40 rounded-2xl bg-surface"
      data-scene={sceneId}
      aria-hidden
    />
  );
}
