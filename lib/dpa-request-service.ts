import { createHash } from "node:crypto";
import { dpaRequestSchema } from "@/lib/dpa-request-schema";

export type DpaRequestResult =
  | { ok: true }
  | { ok: false; status: number; error: "email" | "unavailable" };

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 8;

type RateBucket = { count: number; resetAt: number };
const rateBuckets = new Map<string, RateBucket>();

function pruneBuckets(now: number) {
  for (const [key, bucket] of rateBuckets) {
    if (bucket.resetAt <= now) rateBuckets.delete(key);
  }
}

function rateKey(ip: string | null, userAgent: string | null): string {
  const material = `${ip ?? "unknown"}|${userAgent ?? "unknown"}`;
  return createHash("sha256").update(material).digest("hex").slice(0, 32);
}

function withinRateLimit(key: string, now: number): boolean {
  pruneBuckets(now);
  const existing = rateBuckets.get(key);
  if (!existing || existing.resetAt <= now) {
    rateBuckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (existing.count >= RATE_LIMIT_MAX) return false;
  existing.count += 1;
  return true;
}

/**
 * Accept https webhooks, and http only for a local listener used in tests.
 * The placeholder in `.env.example` is not a destination.
 */
export function dpaWebhookUrl(): string | null {
  const raw = process.env.DPA_REQUEST_WEBHOOK_URL?.trim() ?? "";
  if (!raw || raw.includes("[[TBC")) return null;

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }

  if (url.protocol === "https:") return url.toString();

  const local =
    url.protocol === "http:" &&
    (url.hostname === "localhost" || url.hostname === "127.0.0.1");
  return local ? url.toString() : null;
}

/**
 * Validate the email, drop honeypot hits without forwarding, and POST the
 * payload to n8n. The email is never logged or written to browser storage.
 */
export async function processDpaRequest(
  rawBody: unknown,
  meta: { ip: string | null; userAgent: string | null },
): Promise<DpaRequestResult> {
  const now = Date.now();
  if (!withinRateLimit(rateKey(meta.ip, meta.userAgent), now)) {
    console.error("[dpa-request] rate_limited");
    return { ok: false, status: 429, error: "unavailable" };
  }

  const parsed = dpaRequestSchema.safeParse(rawBody);
  if (!parsed.success) {
    return { ok: false, status: 400, error: "email" };
  }

  if (parsed.data.company_website.trim() !== "") {
    console.error("[dpa-request] honeypot_triggered");
    return { ok: true };
  }

  const webhookUrl = dpaWebhookUrl();
  if (!webhookUrl) {
    console.error("[dpa-request] missing_webhook_config");
    return { ok: false, status: 503, error: "unavailable" };
  }

  const payload = {
    email: parsed.data.email,
    requestedAt: new Date(now).toISOString(),
    page: "landing" as const,
    source: "dpa-request" as const,
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12_000);
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      console.error("[dpa-request] webhook_http_error", {
        status: response.status,
      });
      return { ok: false, status: 502, error: "unavailable" };
    }

    return { ok: true };
  } catch (error) {
    const reason = error instanceof Error ? error.name : "unknown";
    console.error("[dpa-request] webhook_transport_error", { reason });
    return { ok: false, status: 502, error: "unavailable" };
  }
}
