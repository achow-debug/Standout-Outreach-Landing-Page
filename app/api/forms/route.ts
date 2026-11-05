import { NextResponse } from "next/server";
import { validateSubmission } from "@/lib/forms/validation";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: false }, { status: 400 });

  // Honeypot: pretend it worked, discard it.
  if (body.company_fax) return NextResponse.json({ ok: true });

  const result = validateSubmission(body);
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, errors: result.errors },
      { status: 400 },
    );
  }

  // TODO (automation phase): forward result.data to the n8n webhook.
  return NextResponse.json({ ok: true });
}
