"use client";

import { useEffect, useState } from "react";
import { officialCopy } from "@/lib/official-copy";

const SCENES = officialCopy.showcase.scenes;
const SCENE_COUNT = SCENES.length;
const AUTOPLAY_MS = 4000;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Fyxer product showcase: three scenes.
 * Mobile is a centred caption, dots, and an empty card over a blank photo crop.
 * Desktop is one horizontal band: scene tabs, the active title, and an empty card.
 * Both autoplay until a scene is chosen, the pointer is over the band, or motion is reduced.
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
      <ShowcaseStage active={active} />
    </div>
  );
}

function DesktopShowcase() {
  const [active, setActive] = useState(0);
  const [chosen, setChosen] = useState(false);
  const [hovering, setHovering] = useState(false);
  const paused = chosen || hovering;
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
        setActive((current) => (current + 1) % SCENE_COUNT);
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
        <div className="flex items-center justify-between gap-16">
          <div className="max-w-[34rem]">
            <p className="text-h2 text-ink">{scene.title}</p>
            <p className="text-lead mt-4 text-ink">{scene.detail}</p>
          </div>
          <div className="w-[min(340px,32vw)] shrink-0">
            <CardStack active={active} />
          </div>
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
