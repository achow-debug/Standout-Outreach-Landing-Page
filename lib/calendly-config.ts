/**
 * Public Calendly embed config (no Scheduling API).
 *
 * Event types, locations, and invitee questions are managed in Calendly.
 * Prefill keys map by question order, not label — confirm in the Calendly UI:
 *   built-in name  → prefill.name
 *   built-in email → prefill.email (use work email)
 *   custom a1      → Firm website (recommended required)
 *   custom a2      → Prioritised area of law (optional; same labels as AREA_OF_LAW_OPTIONS)
 *
 * Calendly iframe CSS cannot use Source Sans 3, --radius-md, or hover tokens.
 * Branding is query-param colours plus our modal chrome only.
 */

export const CALENDLY_WIDGET_SCRIPT_SRC =
  "https://assets.calendly.com/assets/external/widget.js";
export const CALENDLY_WIDGET_STYLESHEET_HREF =
  "https://assets.calendly.com/assets/external/widget.css";

/** Hex without `#` — Calendly embed query params. Mirrors app/globals.css. */
export const CALENDLY_EMBED_COLORS = {
  primary: "6b2c5f",
  text: "0f172a",
  background: "ffffff",
} as const;

export type CalendlyEmbedMode = "inline" | "popup";

/** Optional future pre-step. Pass undefined in v1. */
export type CalendlyPrefill = {
  name?: string;
  email?: string;
  customAnswers?: {
    a1?: string;
    a2?: string;
    a3?: string;
  };
};

export type CalendlyUtm = {
  utmCampaign?: string;
  utmSource?: string;
  utmMedium?: string;
  utmContent?: string;
  utmTerm?: string;
};

function envFlagEnabled(value: string | undefined): boolean {
  if (!value) return false;
  const normalised = value.trim().toLowerCase();
  return normalised === "1" || normalised === "true" || normalised === "yes";
}

/**
 * Only allow the public Calendly booking origin so a bad env value cannot
 * become an arbitrary iframe.
 */
export function parseCalendlyEventUrl(
  raw: string | undefined,
): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  try {
    const url = new URL(trimmed);
    if (url.protocol !== "https:") return null;
    if (url.hostname !== "calendly.com") return null;
    if (url.pathname.length < 2) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function getCalendlyEventUrl(): string | null {
  return parseCalendlyEventUrl(process.env.NEXT_PUBLIC_CALENDLY_EVENT_URL);
}

export function getCalendlyEmbedMode(): CalendlyEmbedMode {
  const mode = (process.env.NEXT_PUBLIC_CALENDLY_EMBED_MODE ?? "inline")
    .trim()
    .toLowerCase();
  return mode === "popup" ? "popup" : "inline";
}

export function shouldHideCalendlyGdprBanner(): boolean {
  return envFlagEnabled(process.env.NEXT_PUBLIC_CALENDLY_HIDE_GDPR_BANNER);
}

export function isCalendlyEnabled(): boolean {
  return (
    envFlagEnabled(process.env.NEXT_PUBLIC_CALENDLY_ENABLED) &&
    getCalendlyEventUrl() !== null
  );
}

/**
 * Build the embed URL with colour / chrome params.
 * hide_event_type_details stays off so invitees still see duration and location.
 */
export function buildCalendlyEmbedUrl(
  eventUrl: string,
  options?: { hideGdprBanner?: boolean },
): string {
  const url = new URL(eventUrl);
  url.searchParams.set("primary_color", CALENDLY_EMBED_COLORS.primary);
  url.searchParams.set("text_color", CALENDLY_EMBED_COLORS.text);
  url.searchParams.set("background_color", CALENDLY_EMBED_COLORS.background);
  url.searchParams.set("hide_landing_page_details", "1");
  if (options?.hideGdprBanner) {
    url.searchParams.set("hide_gdpr_banner", "1");
  }
  return url.toString();
}
