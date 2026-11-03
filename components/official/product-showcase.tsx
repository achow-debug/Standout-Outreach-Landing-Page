"use client";

import { useEffect, useState, type AnimationEvent } from "react";
import { FilePenLine, Shield, Sparkles, type LucideIcon } from "lucide-react";
import { AnnotatedIntakeDemo } from "@/components/official/annotated-intake-demo";
import { officialCopy } from "@/lib/official-copy";

const SCENES = officialCopy.showcase.scenes;
const SCENE_COUNT = SCENES.length;
const INTAKE_INDEX = SCENES.findIndex((scene) => scene.id === "intake");
const AUTOPLAY_MS = 5000;

const SCENE_ICONS: Record<string, LucideIcon> = {
  intake: FilePenLine,
  legal: Shield,
  known: Sparkles,
};

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
    <div className="mx-auto flex w-full max-w-[520px] flex-col bg-canvas pt-4 lg:hidden">
      {onDemo ? null : (
        <div className="relative min-h-[3.75rem] px-4">
          {SCENES.map((scene, index) => {
            const Icon = SCENE_ICONS[scene.id] ?? FilePenLine;
            const selected = index === active;
            return (
              <div
                key={scene.id}
                className={`absolute inset-x-4 bottom-0 flex items-start justify-center gap-2.5 transition-opacity duration-300 motion-reduce:transition-none ${
                  selected ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
                aria-hidden={!selected}
              >
                <Icon
                  aria-hidden
                  className="mt-1 size-5 shrink-0 text-ink-muted opacity-55"
                  strokeWidth={1.75}
                />
                <p className="text-center text-[1.5rem] leading-[1.15] font-bold tracking-[-0.02em] text-ink whitespace-pre-line">
                  {scene.mobileCaption}
                </p>
              </div>
            );
          })}
        </div>
      )}
      <div className="flex justify-center pt-2" role="tablist" aria-label="Scenes">
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
      <div className={`px-3 pt-3 ${onDemo ? "pb-12" : "pb-8"}`}>
        <ShowcaseBody active={active} />
      </div>
    </div>
  );
}

function DesktopShowcase() {
  const [active, setActive] = useState(Math.max(0, INTAKE_INDEX));
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const onDemo = SCENES[active]?.id === "intake";
  const fillPaused = hovering || focused;
  const scene = SCENES[active];
  /** Autoplay only on non-intake scenes when motion is allowed. Hover pauses mid-fill. */
  const autoplayActive = !onDemo && !reduceMotion;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  function selectScene(index: number) {
    setActive(index);
    setProgressKey((key) => key + 1);
  }

  function handleProgressEnd(event: AnimationEvent<HTMLSpanElement>) {
    if (event.animationName !== "showcase-tab-progress") return;
    if (!autoplayActive || fillPaused) return;
    setActive((current) => nextNonIntakeIndex(current));
  }

  return (
    <div
      className="relative hidden overflow-hidden bg-canvas lg:block"
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
    >
      <PhotoFrame crop="left" />
      <div
        className={`relative z-20 mx-auto flex w-full max-w-[1120px] flex-col px-10 xl:px-4 ${
          onDemo ? "gap-6 py-10 xl:py-12" : "gap-10 py-16 xl:py-24"
        }`}
      >
        <div
          className="flex flex-wrap items-end gap-x-8 gap-y-3"
          role="tablist"
          aria-label="Scenes"
          onFocusCapture={() => setFocused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
              setFocused(false);
            }
          }}
        >
          {SCENES.map((item, index) => {
            const selected = index === active;
            const Icon = SCENE_ICONS[item.id] ?? FilePenLine;
            const runProgress = selected && autoplayActive;
            return (
              <button
                key={`${item.id}-${runProgress ? progressKey : "static"}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-label={item.title}
                className={`showcase-tab group flex w-14 flex-col items-center gap-2.5 transition-opacity duration-150 motion-reduce:transition-none ${
                  selected ? "opacity-100" : "opacity-40 hover:opacity-70"
                }`}
                onClick={() => selectScene(index)}
              >
                <Icon
                  aria-hidden
                  className="size-6 text-ink"
                  strokeWidth={1.75}
                />
                <span className="showcase-tab-track relative block h-0.5 w-full overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--color-ink)_15%,transparent)]">
                  <span
                    className={`showcase-tab-fill absolute inset-y-0 left-0 origin-left rounded-full bg-[color-mix(in_oklab,var(--color-ink)_70%,transparent)] ${
                      runProgress
                        ? `is-running${fillPaused ? " is-paused" : ""}`
                        : selected
                          ? "is-complete"
                          : ""
                    }`}
                    onAnimationEnd={handleProgressEnd}
                  />
                </span>
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
              <p className="text-lead mt-3 text-ink md:mt-4">{scene.detail}</p>
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
