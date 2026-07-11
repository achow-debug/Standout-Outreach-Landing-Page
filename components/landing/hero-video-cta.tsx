"use client";

import { trackEvent } from "@/lib/analytics";

type HeroVideoCtaProps = {
  label: string;
  targetId?: string;
};

/**
 * Smooth-scrolls to the video heading and moves keyboard focus there.
 * Does not start playback — the visitor must use the native play control.
 */
export function HeroVideoCta({
  label,
  targetId = "video",
}: HeroVideoCtaProps) {
  return (
    <a
      href={`#${targetId}`}
      className="btn btn-primary"
      onClick={(event) => {
        const target = document.getElementById(targetId);
        if (!target) return;

        event.preventDefault();
        trackEvent("hero_video_cta_click", { cta_location: "hero" });

        const reduceMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;

        target.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "start",
        });
        target.focus({ preventScroll: true });
      }}
    >
      {label}
    </a>
  );
}
