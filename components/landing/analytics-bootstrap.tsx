"use client";

import { useEffect } from "react";
import {
  attributionProps,
  getDeviceCategory,
  hasSessionFlag,
  setSessionFlag,
  trackEvent,
} from "@/lib/analytics";
import { ensureAttributionCaptured } from "@/lib/attribution";
import { siteConfig } from "@/lib/site-config";

/**
 * Captures UTMs once and fires `landing_view` once per session.
 * Must never throw or block rendering.
 */
export function AnalyticsBootstrap() {
  useEffect(() => {
    try {
      const attribution = ensureAttributionCaptured();

      const flag = "landing_view";
      if (hasSessionFlag(flag)) return;
      setSessionFlag(flag);

      trackEvent("landing_view", {
        ...attributionProps(attribution),
        landing_path:
          typeof window !== "undefined"
            ? window.location.pathname || siteConfig.canonicalPath
            : siteConfig.canonicalPath,
        device_category: getDeviceCategory(),
        referrer_domain: getReferrerDomain(),
      });
    } catch {
      // Analytics must never break the page.
    }
  }, []);

  return null;
}

function getReferrerDomain(): string | null {
  try {
    if (!document.referrer) return null;
    return new URL(document.referrer).hostname;
  } catch {
    return null;
  }
}
