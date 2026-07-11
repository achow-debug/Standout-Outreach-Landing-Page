import { siteConfig } from "@/lib/site-config";
import {
  ensureAttributionCaptured,
  type StoredAttribution,
} from "@/lib/attribution";

export type AnalyticsEventName =
  | "landing_view"
  | "hero_video_cta_click"
  | "video_play"
  | "video_progress"
  | "video_complete"
  | "transcript_open"
  | "review_scope_open"
  | "example_finding_open"
  | "review_form_start"
  | "review_form_error"
  | "review_request_success";

export type AnalyticsProps = Record<
  string,
  string | number | boolean | null | undefined
>;

/** Keys that must never reach the analytics platform. */
const BLOCKED_PROP_KEYS = new Set([
  "name",
  "firm_name",
  "firm",
  "company",
  "work_email",
  "email",
  "website",
  "url",
  "phone",
  "message",
  "company_website",
  "value",
  "submitted_value",
]);

/** Only allowlisted behavioural / attribution props may be sent. */
const ALLOWED_PROP_KEYS = new Set([
  "lead_id",
  "video_id",
  "video_version",
  "duration_seconds",
  "milestone",
  "cta_location",
  "location",
  "finding_id",
  "field",
  "error_category",
  "landing_path",
  "device_category",
  "source",
  "medium",
  "campaign",
  "content",
  "term",
  "referrer_domain",
]);

type PlausibleFn = (
  event: string,
  options?: { props?: Record<string, string | number | boolean> },
) => void;

declare global {
  interface Window {
    plausible?: PlausibleFn;
  }
}

const SESSION_PREFIX = "sg_analytics:";

export function hasSessionFlag(key: string): boolean {
  try {
    return sessionStorage.getItem(`${SESSION_PREFIX}${key}`) === "1";
  } catch {
    return false;
  }
}

export function setSessionFlag(key: string): void {
  try {
    sessionStorage.setItem(`${SESSION_PREFIX}${key}`, "1");
  } catch {
    // Private mode / blocked storage — treat as unset next time.
  }
}

export function getDeviceCategory(): "mobile" | "tablet" | "desktop" | "unknown" {
  if (typeof window === "undefined") return "unknown";
  const width = window.innerWidth;
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

export function attributionProps(
  attribution?: StoredAttribution | null,
): AnalyticsProps {
  const captured = attribution ?? ensureAttributionCaptured();
  return {
    source: captured?.source ?? null,
    medium: captured?.medium ?? null,
    campaign: captured?.campaign ?? null,
    content: captured?.content ?? null,
    term: captured?.term ?? null,
  };
}

/**
 * Strip PII and unknown keys. `lead_id` is the only lead identifier allowed.
 */
export function sanitizeAnalyticsProps(props: AnalyticsProps): AnalyticsProps {
  const clean: AnalyticsProps = {};

  for (const [key, value] of Object.entries(props)) {
    if (BLOCKED_PROP_KEYS.has(key)) continue;
    if (!ALLOWED_PROP_KEYS.has(key)) continue;
    if (value === undefined) continue;
    clean[key] = value;
  }

  return clean;
}

function toPlausibleProps(
  props: AnalyticsProps,
): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(props)) {
    if (value === null || value === undefined) continue;
    out[key] = value;
  }
  return out;
}

function forwardToProvider(
  name: AnalyticsEventName,
  props: AnalyticsProps,
): void {
  const provider = (
    process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER ?? "none"
  ).toLowerCase();

  if (provider === "none" || !provider) {
    return;
  }

  if (provider === "plausible") {
    if (typeof window !== "undefined" && typeof window.plausible === "function") {
      window.plausible(name, { props: toPlausibleProps(props) });
    }
    return;
  }

  // Unknown provider — no-op rather than throw.
}

/**
 * Privacy-conscious analytics facade.
 * Analytics failure must never block video playback or form submission.
 */
export function trackEvent(
  name: AnalyticsEventName,
  props: AnalyticsProps = {},
): void {
  try {
    const payload = sanitizeAnalyticsProps({
      ...props,
      video_id: props.video_id ?? siteConfig.video.id,
      video_version: props.video_version ?? siteConfig.video.version,
    });

    if (process.env.NODE_ENV === "development") {
      console.info("[analytics]", { event: name, ...payload });
    }

    forwardToProvider(name, payload);
  } catch {
    // Swallow — tracking must not interrupt the visitor experience.
  }
}
