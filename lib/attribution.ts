/**
 * First-party attribution helpers for review requests.
 * Persist allowlisted UTMs in sessionStorage; never store PII in campaign params.
 */

export const ATTRIBUTION_STORAGE_KEY = "sg_attribution";

export type StoredAttribution = {
  source: string | null;
  medium: string | null;
  campaign: string | null;
  content: string | null;
  term: string | null;
};

/** Recommended outreach UTM conventions from the implementation plan. */
export const CHANNEL_UTM_CONVENTIONS = [
  {
    channel: "Cold email",
    utm_source: "outbound_email",
    utm_medium: "email",
  },
  {
    channel: "LinkedIn",
    utm_source: "linkedin",
    utm_medium: "dm",
  },
  {
    channel: "WhatsApp Business",
    utm_source: "whatsapp",
    utm_medium: "message",
  },
  {
    channel: "Cold-call follow-up",
    utm_source: "cold_call",
    utm_medium: "follow_up_link",
  },
] as const;

const UTM_MAP = {
  utm_source: "source",
  utm_medium: "medium",
  utm_campaign: "campaign",
  utm_content: "content",
  utm_term: "term",
} as const;

export function captureAttributionFromSearch(
  search: string,
): StoredAttribution | null {
  const params = new URLSearchParams(search);
  let found = false;
  const attribution: StoredAttribution = {
    source: null,
    medium: null,
    campaign: null,
    content: null,
    term: null,
  };

  for (const [utmKey, field] of Object.entries(UTM_MAP) as Array<
    [keyof typeof UTM_MAP, keyof StoredAttribution]
  >) {
    const value = params.get(utmKey);
    if (value && value.trim()) {
      attribution[field] = value.trim().slice(0, 200);
      found = true;
    }
  }

  return found ? attribution : null;
}

export function persistAttribution(attribution: StoredAttribution): void {
  try {
    sessionStorage.setItem(
      ATTRIBUTION_STORAGE_KEY,
      JSON.stringify(attribution),
    );
  } catch {
    // Private mode / blocked storage.
  }
}

export function readPersistedAttribution(): StoredAttribution | null {
  try {
    const raw = sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredAttribution;
  } catch {
    return null;
  }
}

/** Capture UTMs from the current URL into session storage when present. */
export function ensureAttributionCaptured(): StoredAttribution | null {
  if (typeof window === "undefined") return null;

  const fromUrl = captureAttributionFromSearch(window.location.search);
  if (fromUrl) {
    persistAttribution(fromUrl);
    return fromUrl;
  }

  return readPersistedAttribution();
}

/**
 * Build an outreach landing URL with allowlisted UTMs.
 * Never put email, name or company into campaign parameters.
 */
export function buildOutreachLandingUrl(options: {
  baseUrl?: string;
  source: string;
  medium: string;
  campaign: string;
  content?: string;
  term?: string;
}): string {
  const base = options.baseUrl ?? "https://standoutgroup.net/";
  const url = new URL(base);
  url.searchParams.set("utm_source", options.source);
  url.searchParams.set("utm_medium", options.medium);
  url.searchParams.set("utm_campaign", options.campaign);
  if (options.content) url.searchParams.set("utm_content", options.content);
  if (options.term) url.searchParams.set("utm_term", options.term);
  return url.toString();
}
