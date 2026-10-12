import type { CalendlyUtm } from "@/lib/calendly-config";
import {
  buildCalendlyEmbedUrl,
  CALENDLY_WIDGET_SCRIPT_SRC,
  CALENDLY_WIDGET_STYLESHEET_HREF,
  getCalendlyEventUrl,
} from "@/lib/calendly-config";

const SCRIPT_ID = "calendly-widget-js";
const STYLESHEET_ID = "calendly-widget-css";

let loading: Promise<void> | null = null;

/** Load the Calendly widget once. Safe to call from several CTAs. */
export function loadCalendly(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Calendly cannot load during SSR"));
  }
  if (window.Calendly) return Promise.resolve();
  if (loading) return loading;

  loading = new Promise<void>((resolve, reject) => {
    if (!document.getElementById(STYLESHEET_ID)) {
      const css = document.createElement("link");
      css.id = STYLESHEET_ID;
      css.rel = "stylesheet";
      css.href = CALENDLY_WIDGET_STYLESHEET_HREF;
      document.head.appendChild(css);
    }

    const existing = document.getElementById(SCRIPT_ID);
    if (existing instanceof HTMLScriptElement) {
      if (window.Calendly) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Calendly script failed")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = CALENDLY_WIDGET_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Calendly script failed"));
    document.body.appendChild(script);
  });

  loading = loading.catch((error: unknown) => {
    loading = null;
    throw error;
  });

  return loading;
}

/** Open the existing Calendly popup. Does not change the event type or questions. */
export function bookingPopupUrl(utm: CalendlyUtm): string | null {
  const eventUrl = getCalendlyEventUrl();
  if (!eventUrl) return null;
  const url = new URL(buildCalendlyEmbedUrl(eventUrl));
  if (utm.utmSource) url.searchParams.set("utm_source", utm.utmSource);
  if (utm.utmMedium) url.searchParams.set("utm_medium", utm.utmMedium);
  if (utm.utmCampaign) url.searchParams.set("utm_campaign", utm.utmCampaign);
  if (utm.utmContent) url.searchParams.set("utm_content", utm.utmContent);
  if (utm.utmTerm) url.searchParams.set("utm_term", utm.utmTerm);
  return url.toString();
}

export async function openCalendlyPopup(utm: CalendlyUtm): Promise<void> {
  const url = bookingPopupUrl(utm);
  if (!url) {
    throw new Error("Calendly URL is not configured");
  }
  await loadCalendly();
  if (!window.Calendly) {
    throw new Error("Calendly failed to load");
  }
  window.Calendly.initPopupWidget({ url, utm });
}
