"use client";

import {
  attributionProps,
  getDeviceCategory,
  hasSessionFlag,
  setSessionFlag,
  trackEvent,
} from "@/lib/analytics";
import { landingCopy } from "@/lib/landing-copy";

/**
 * Hero → video lead-in. Tracks intent once per session, then scrolls via the hash.
 */
export function VideoBridgeLink() {
  const { hero } = landingCopy;

  function handleClick() {
    const flag = "bridge_to_video_click";
    if (!hasSessionFlag(flag)) {
      setSessionFlag(flag);
      trackEvent("bridge_to_video_click", {
        ...attributionProps(),
        device_category: getDeviceCategory(),
        landing_path:
          typeof window !== "undefined" ? window.location.pathname : "/",
      });
    }
  }

  return (
    <a href="#video" className="btn-watch-outline" onClick={handleClick}>
      {hero.bridge}
    </a>
  );
}
