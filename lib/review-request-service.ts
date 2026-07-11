import { createHash, createHmac, randomUUID } from "node:crypto";
import {
  buildConfirmationEmail,
  buildInternalNotificationEmail,
} from "@/lib/review-request-emails";
import {
  ATTRIBUTION_KEYS,
  pickAttribution,
  REVIEW_REQUEST_SCHEMA_VERSION,
  reviewRequestFormSchema,
  sanitizeSheetCell,
  type FieldErrors,
  type FieldName,
  VISIBLE_FIELD_NAMES,
} from "@/lib/review-request-schema";
import { siteConfig } from "@/lib/site-config";

export type ReviewRequestPayload = {
  schema_version: string;
  lead_id: string;
  requested_at: string;
  name: string;
  firm_name: string;
  work_email: string;
  website: string;
  source: string | null;
  medium: string | null;
  campaign: string | null;
  content: string | null;
  term: string | null;
  landing_path: string | null;
  referrer_domain: string | null;
  status: "Requested";
  emails: {
    confirmation: {
      to: string;
      from: string;
      subject: string;
      text: string;
    };
    internal: {
      to: string;
      from: string;
      subject: string;
      text: string;
    };
  };
};

export type ReviewRequestResult =
  | { ok: true; lead_id: string }
  | {
      ok: false;
      status: number;
      error: string;
      fieldErrors?: FieldErrors;
    };

const MIN_FORM_MS = 2_500;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 8;
const IDEMPOTENCY_TTL_MS = 24 * 60 * 60 * 1000;

type RateBucket = { count: number; resetAt: number };
type SeenLead = { seenAt: number };

const rateBuckets = new Map<string, RateBucket>();
const seenLeadIds = new Map<string, SeenLead>();

function pruneMaps(now: number) {
  for (const [key, bucket] of rateBuckets) {
    if (bucket.resetAt <= now) rateBuckets.delete(key);
  }
  for (const [key, entry] of seenLeadIds) {
    if (now - entry.seenAt > IDEMPOTENCY_TTL_MS) seenLeadIds.delete(key);
  }
}

function deriveRateKey(ip: string | null, userAgent: string | null): string {
  const material = `${ip ?? "unknown"}|${userAgent ?? "unknown"}`;
  return createHash("sha256").update(material).digest("hex").slice(0, 32);
}

function checkRateLimit(key: string, now: number): boolean {
  pruneMaps(now);
  const existing = rateBuckets.get(key);
  if (!existing || existing.resetAt <= now) {
    rateBuckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (existing.count >= RATE_LIMIT_MAX) {
    return false;
  }
  existing.count += 1;
  return true;
}

function fieldErrorsFromZod(
  issues: { path: (string | number)[]; message: string }[],
): FieldErrors {
  const fieldErrors: FieldErrors = {};
  for (const issue of issues) {
    const key = issue.path[0];
    if (
      typeof key === "string" &&
      VISIBLE_FIELD_NAMES.includes(key as FieldName) &&
      !fieldErrors[key as FieldName]
    ) {
      fieldErrors[key as FieldName] = issue.message;
    }
  }
  return fieldErrors;
}

export function signReviewRequestPayload(
  body: string,
  secret: string,
  timestamp: string,
): string {
  return createHmac("sha256", secret)
    .update(`${timestamp}.${body}`)
    .digest("hex");
}

/**
 * Validate, anti-spam, sign and forward a review request to n8n.
 * Never logs submitted PII.
 */
export async function processReviewRequest(
  rawBody: unknown,
  meta: {
    ip: string | null;
    userAgent: string | null;
  },
): Promise<ReviewRequestResult> {
  const now = Date.now();
  const rateKey = deriveRateKey(meta.ip, meta.userAgent);

  if (!checkRateLimit(rateKey, now)) {
    console.error("[review-request] rate_limited", { rateKey });
    return {
      ok: false,
      status: 429,
      error: "Too many requests. Please try again shortly.",
    };
  }

  const parsed = reviewRequestFormSchema.safeParse(rawBody);
  if (!parsed.success) {
    return {
      ok: false,
      status: 400,
      error: "Please correct the highlighted fields.",
      fieldErrors: fieldErrorsFromZod(parsed.error.issues),
    };
  }

  const data = parsed.data;

  // Honeypot — treat as success without forwarding (do not tip off bots).
  if (data.company_website && data.company_website.trim() !== "") {
    console.error("[review-request] honeypot_triggered");
    return { ok: true, lead_id: randomUUID() };
  }

  if (
    typeof data.form_started_at === "number" &&
    Number.isFinite(data.form_started_at) &&
    now - data.form_started_at < MIN_FORM_MS
  ) {
    console.error("[review-request] timing_reject");
    return {
      ok: false,
      status: 400,
      error: "Please take a moment to complete the form, then try again.",
    };
  }

  const attribution = pickAttribution(data);
  const leadId = randomUUID();
  const requestedAt = new Date(now).toISOString();

  const payloadBase = {
    schema_version: REVIEW_REQUEST_SCHEMA_VERSION,
    lead_id: leadId,
    requested_at: requestedAt,
    name: sanitizeSheetCell(data.name),
    firm_name: sanitizeSheetCell(data.firm_name),
    work_email: data.work_email.trim().toLowerCase(),
    website: data.website,
    source: attribution.source,
    medium: attribution.medium,
    campaign: attribution.campaign,
    content: attribution.content,
    term: attribution.term,
    landing_path: attribution.landing_path ?? siteConfig.canonicalPath,
    referrer_domain: attribution.referrer_domain,
    status: "Requested" as const,
  };

  const payload: ReviewRequestPayload = {
    ...payloadBase,
    emails: {
      confirmation: buildConfirmationEmail(payloadBase),
      internal: buildInternalNotificationEmail(payloadBase),
    },
  };

  // Local idempotency guard (n8n also dedupes by lead_id).
  if (seenLeadIds.has(leadId)) {
    return { ok: true, lead_id: leadId };
  }
  seenLeadIds.set(leadId, { seenAt: now });

  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  const webhookSecret = process.env.N8N_WEBHOOK_SECRET;

  if (!webhookUrl || !webhookSecret) {
    if (process.env.NODE_ENV === "development") {
      console.info("[review-request] dev_accept_without_webhook", {
        lead_id: leadId,
        attribution_keys: ATTRIBUTION_KEYS.filter(
          (key) => payload[key] != null,
        ),
      });
      return { ok: true, lead_id: leadId };
    }

    console.error("[review-request] missing_webhook_config");
    return {
      ok: false,
      status: 503,
      error:
        "The review request service is temporarily unavailable. Please try again later.",
    };
  }

  const body = JSON.stringify(payload);
  const timestamp = String(now);
  const signature = signReviewRequestPayload(body, webhookSecret, timestamp);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12_000);

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Standout-Timestamp": timestamp,
        "X-Standout-Signature": signature,
        "X-Standout-Lead-Id": leadId,
      },
      body,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      console.error("[review-request] webhook_http_error", {
        status: response.status,
        lead_id: leadId,
      });
      return {
        ok: false,
        status: 502,
        error:
          "We could not complete your request just now. Please try again in a moment.",
      };
    }

    return { ok: true, lead_id: leadId };
  } catch (error) {
    const reason = error instanceof Error ? error.name : "unknown";
    console.error("[review-request] webhook_transport_error", {
      reason,
      lead_id: leadId,
    });
    return {
      ok: false,
      status: 502,
      error:
        "We could not complete your request just now. Please try again in a moment.",
    };
  }
}
