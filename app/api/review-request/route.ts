import { NextResponse } from "next/server";
import { processReviewRequest } from "@/lib/review-request-service";

export const runtime = "nodejs";

function clientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || null;
  }
  return request.headers.get("x-real-ip");
}

async function parseBody(request: Request): Promise<unknown> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return request.json();
  }

  if (
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data")
  ) {
    const form = await request.formData();
    const raw: Record<string, string> = {};
    for (const [key, value] of form.entries()) {
      if (typeof value === "string") {
        raw[key] = value;
      }
    }
    return raw;
  }

  try {
    return await request.json();
  } catch {
    return {};
  }
}

/**
 * Same-origin review request endpoint.
 * Browser must not call the n8n webhook directly.
 */
export async function POST(request: Request) {
  let rawBody: unknown;

  try {
    rawBody = await parseBody(request);
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  const result = await processReviewRequest(rawBody, {
    ip: clientIp(request),
    userAgent: request.headers.get("user-agent"),
  });

  const acceptsHtml = (request.headers.get("accept") ?? "").includes("text/html");

  if (!result.ok) {
    if (acceptsHtml) {
      return NextResponse.redirect(new URL("/?request=error", request.url), {
        status: 303,
      });
    }

    return NextResponse.json(
      {
        ok: false,
        error: result.error,
        ...(result.fieldErrors ? { fieldErrors: result.fieldErrors } : {}),
      },
      { status: result.status },
    );
  }

  if (acceptsHtml) {
    return NextResponse.redirect(
      new URL("/?request=received", request.url),
      { status: 303 },
    );
  }

  return NextResponse.json({ ok: true, lead_id: result.lead_id });
}

export async function GET() {
  return NextResponse.json({ ok: false, error: "Method not allowed." }, {
    status: 405,
  });
}
