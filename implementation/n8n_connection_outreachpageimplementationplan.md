# n8n connection — outreach page implementation plan

**Status:** Plan only — do not change product code until this document is approved  
**Created:** 2026-08-14  
**File:** `implementation/n8n_connection_outreachpageimplementationplan.md`  
**Related (superseded for this workstream):** `implementation/N8N_WEBHOOK_PLAN.md`

---

## 1. Goal

When a visitor fills the contact form and clicks **Claim My Free Strategy Call**, the site must:

1. Collect **name**, **work email**, **firm website**, **prioritised area of law**, and a required **GDPR compliance checkbox**.
2. Validate on the Next.js / Vercel server (never in the browser against n8n).
3. `POST` a signed JSON payload to the n8n webhook whose URL is stored in the environment variable **`n8n_connection_outreachpage`**.
4. Keep the existing success / error UI.
5. Leave all downstream work (Sheets, email, CRM, Slack, booking) to n8n.

There is **no admin section**. Webhook URL and secrets live only in environment variables (local `.env.local` and Vercel project settings).

The website is **lead ingress**. n8n is the **operations layer**.

---

## 2. Why Vercel sits in the middle (CORS)

The browser must **not** call n8n.

- n8n webhooks typically do not send CORS headers that allow this origin.
- The site CSP already sets `connect-src 'self'` (plus Plausible). A browser `fetch` to n8n would be blocked even if CORS were opened.
- The webhook URL must never ship to the client (`NEXT_PUBLIC_*` is forbidden).

**Correct path (already in the repo):**

```
Browser  →  POST /api/review-request  (same origin, Vercel serverless)
         →  server fetch → n8n webhook (n8n_connection_outreachpage)
```

Do **not** add a second client-side webhook caller.

---

## 3. Current state (reuse, do not rebuild)

The submit pipeline already exists. This work **completes the contract**, **renames the webhook env var**, and **adds GDPR consent** — it does not invent a second form.

| Piece | Location | Status vs this plan |
|---|---|---|
| Four qualification fields + CTA | `components/landing/review-request-form.tsx` | Done — GDPR checkbox **missing** (privacy is a sentence, not a required control) |
| Client + server validation | `lib/review-request-schema.ts` | Done for four fields — must add consent |
| Same-origin API | `app/api/review-request/route.ts` | Done — keep |
| Server processing + webhook POST | `lib/review-request-service.ts` | Done — HMAC, 12s timeout, no PII in logs. Reads `outreach_Strategy_Call_request` then `N8N_WEBHOOK_URL` |
| Email copy for n8n | `lib/review-request-emails.ts` | Done — keep; add consent fields to internal email |
| Env placeholders | `.env.example` | Currently `outreach_Strategy_Call_request` + `N8N_WEBHOOK_SECRET` |
| Secret leak check | `scripts/check-secrets.mjs` | Must include the new env name |
| CSP | `next.config.ts` | Done — browser cannot `connect` to n8n |
| Privacy page | `app/privacy/page.tsx` + `lib/site-config.ts` | Exists; update collect / lawful-basis wording once the checkbox is live |
| Production env | Vercel | **Open** — launch checklist still lists n8n as unset |

**Local behaviour today:** if the webhook URL is missing, development accepts the submit (`dev_accept_without_webhook`). Production returns **503**. Keep that.

**Gap today:** HMAC signing is skipped when `N8N_WEBHOOK_SECRET` is unset. Production should **require** the secret (fail closed), not post unsigned bodies.

---

## 4. Recommended architecture

```
Visitor
  → name, work email, firm website, prioritised area of law
  → ticks GDPR checkbox
  → clicks “Claim My Free Strategy Call”
  → POST /api/review-request  (same origin)
       → Zod validation (including gdpr_consent === true)
       → honeypot + min fill time + IP rate limit
       → build payload (lead_id, attribution, consent audit, email copy)
       → HMAC-SHA256 sign
       → POST process.env.n8n_connection_outreachpage
            headers: X-Standout-Timestamp, X-Standout-Signature, X-Standout-Lead-Id
  → n8n (verify signature → persist / notify / continue)
  → API returns { ok: true, lead_id }
  → modal success state
```

---

## 5. Suggested changes (approve or reject before coding)

These are improvements over “just POST the four fields”. Default recommendation: **accept all**.

### 5.1 Canonical env var (requested)

Use **`n8n_connection_outreachpage`** as the only webhook URL key.

- Never `NEXT_PUBLIC_n8n_connection_outreachpage`.
- Vercel env keys are case-sensitive; the name must match exactly.
- In server code, read `process.env.n8n_connection_outreachpage` (bracket access is fine: `process.env["n8n_connection_outreachpage"]`).
- Remove the dual fallback (`outreach_Strategy_Call_request` / `N8N_WEBHOOK_URL`) once the new key is set, so production cannot silently hit a stale URL.

**Keep a second env var for the HMAC secret:** `N8N_WEBHOOK_SECRET`.  
A webhook URL in env is not authentication. Anyone who guesses or leaks the n8n URL could inject fake leads unless n8n verifies the signature.

### 5.2 Required GDPR checkbox (requested)

Replace the passive “By submitting…” line with a **required checkbox**.

- Unchecked → client and server reject; n8n is not called.
- Label must include a link to `/privacy`.
- Scope: contact about **this strategy call request**, not a separate marketing newsletter (unless legal later asks for that).
- Server must not trust a hidden `true` default. Require an explicit checked value (`"on"`, `"true"`, or `true`).
- Forward an audit trail to n8n (not just a boolean):

| Key | Purpose |
|---|---|
| `gdpr_consent` | Always `true` on forwarded payloads |
| `gdpr_consented_at` | ISO-8601 server timestamp |
| `gdpr_consent_version` | Short string, e.g. `"outreach-form-v1"` so copy changes are auditable |
| `gdpr_consent_text` | Exact label text the visitor agreed to (or a hash of it) |

### 5.3 Production must require HMAC

If `NODE_ENV !== "development"` and `N8N_WEBHOOK_SECRET` is missing → **503**, same as a missing webhook URL. Do not send unsigned production traffic.

### 5.4 n8n should respond fast

The site aborts the n8n `fetch` after **12 seconds**. In n8n:

1. **Webhook** node (POST).
2. **Verify HMAC + timestamp** (reject if skew > 5 minutes).
3. **Respond to Webhook** immediately with `200 { "ok": true, "lead_id": "..." }`.
4. Then continue the workflow (Sheet, email, Slack) **after** the HTTP response.

If n8n waits for Gmail / Sheets before responding, visitors will see a timeout even when the lead was saved.

### 5.5 No retries from Next.js

Do not retry failed n8n calls from the API. A retry can create duplicate leads. n8n should treat `lead_id` as idempotent.

### 5.6 Schema version bump

When consent fields are added, bump `REVIEW_REQUEST_SCHEMA_VERSION` from `"1.1"` to `"1.2"` so n8n can branch safely.

### 5.7 Lawful-basis copy

`lib/site-config.ts` currently describes **pre-contract steps + legitimate interests**. A required checkbox is **consent** (or at least recorded agreement). After the checkbox ships, update privacy copy so the form and `/privacy` tell the same story. Do not leave “lawful basis pending” placeholders in production.

---

## 6. Data collected and payload contract

### 6.1 Visitor-submitted fields

| Form field | JSON key | Rules |
|---|---|---|
| Name | `name` | 2–80 chars, trimmed; spreadsheet formula-injection prefix stripped |
| Work email | `work_email` | Valid email, lowercased |
| Firm website | `website` | Bare domain or URL; normalised to `https://` |
| Prioritised area of law | `prioritised_area_of_law` | Select; **label** sent to n8n (e.g. `Personal Injury`), not the internal slug |
| GDPR checkbox | `gdpr_consent` | Required; must be true to proceed |

Allowed area-of-law labels (`lib/landing-copy.ts`):

- Personal Injury
- Family / Divorce
- Immigration
- Conveyancing / Property
- Wills, Trusts & Probate
- Employment
- Criminal
- Commercial / Corporate
- Other / Multiple

Honeypot (`company_website`) and `form_started_at` are **not** forwarded to n8n.

### 6.2 Server-added fields

| Key | Purpose |
|---|---|
| `schema_version` | `"1.2"` after this work |
| `lead_id` | UUID generated server-side |
| `requested_at` | ISO-8601 timestamp |
| `status` | Always `"Requested"` on ingress |
| `source`, `medium`, `campaign`, `content`, `term` | UTM / attribution (nullable) |
| `landing_path` | Path the form was submitted from |
| `referrer_domain` | Referrer host, if any |
| `gdpr_consent` / `gdpr_consented_at` / `gdpr_consent_version` / `gdpr_consent_text` | Consent audit |
| `emails.confirmation` | `{ to, from, subject, text }` for the visitor |
| `emails.internal` | `{ to, from, subject, text }` for Standout |

### 6.3 Example body n8n will receive

```json
{
  "schema_version": "1.2",
  "lead_id": "3f2a9c1e-4b8d-4e11-9c22-8a7b6d5e4f30",
  "requested_at": "2026-08-14T17:00:00.000Z",
  "name": "Sarah Jenkins",
  "work_email": "sarah@smithlaw.co.uk",
  "website": "https://smithlaw.co.uk",
  "prioritised_area_of_law": "Personal Injury",
  "gdpr_consent": true,
  "gdpr_consented_at": "2026-08-14T17:00:00.000Z",
  "gdpr_consent_version": "outreach-form-v1",
  "gdpr_consent_text": "I agree that Standout Group may process my details and contact me about this free strategy call. See the Privacy Notice.",
  "source": "linkedin",
  "medium": "social",
  "campaign": null,
  "content": null,
  "term": null,
  "landing_path": "/",
  "referrer_domain": null,
  "status": "Requested",
  "emails": {
    "confirmation": {
      "to": "sarah@smithlaw.co.uk",
      "from": "achow@standoutgroup.net",
      "subject": "We received your strategy call request — https://smithlaw.co.uk",
      "text": "Hello Sarah Jenkins,\n\nThank you for claiming a free strategy call..."
    },
    "internal": {
      "to": "achow@standoutgroup.net",
      "from": "achow@standoutgroup.net",
      "subject": "[Strategy call] https://smithlaw.co.uk — 3f2a9c1e-...",
      "text": "New free strategy call request\n\nlead_id: ..."
    }
  }
}
```

### 6.4 Headers n8n must verify

| Header | Value |
|---|---|
| `Content-Type` | `application/json` |
| `X-Standout-Timestamp` | Unix milliseconds as a string |
| `X-Standout-Signature` | hex HMAC-SHA256 of `` `${timestamp}.${rawBody}` `` using `N8N_WEBHOOK_SECRET` |
| `X-Standout-Lead-Id` | Same UUID as `lead_id` |

Reject if the signature does not match, or timestamp skew is greater than **5 minutes**.

Respond **200** with `{ "ok": true, "lead_id": "<uuid>" }` so the landing page can treat the submit as complete. Duplicate `lead_id` should still return 200 (`duplicate: true` optional) and must not append a second Sheet row.

---

## 7. Environment variables

Server-only. Never commit real values.

| Variable | Required in production | Purpose |
|---|---|---|
| `n8n_connection_outreachpage` | Yes | Full n8n **production** webhook URL |
| `N8N_WEBHOOK_SECRET` | Yes | Shared HMAC secret; long random string (password manager + Vercel + n8n) |

Optional while building: a **test** webhook URL in Preview / `.env.local`, production URL only on the Production environment in Vercel.

`.env.example` should declare both as empty:

```
# n8n webhook (server-only — never expose to the browser)
n8n_connection_outreachpage=
N8N_WEBHOOK_SECRET=
```

**Vercel:** Project → Settings → Environment Variables. Encrypt both. Scope Production (and Preview if testing). Redeploy after setting.

**Local:** copy `.env.example` → `.env.local`. Leave empty only if you want the existing “accept without forwarding” dev shortcut.

---

## 8. Implementation phases

Do not start a later phase until the current one is checked off.

### Phase 0 — Confirm reuse of `/api/review-request`

**Work:**

- Confirm the four fields and CTA in `review-request-form.tsx`.
- Confirm `processReviewRequest` is the only outbound n8n caller.
- Confirm client components never read webhook env vars.
- Confirm CSP `connect-src` does not include n8n.

**Exit:** This file’s change log notes we reuse the existing API.

### Phase 1 — GDPR checkbox + schema

**Work:**

- Add copy in `lib/landing-copy.ts` (checkbox label, error if unchecked, keep Privacy Notice link).
- Add a real checkbox in `review-request-form.tsx` (accessible: `required`, `aria-invalid`, error text, 44px tap target).
- Extend Zod in `lib/review-request-schema.ts`; include `gdpr_consent` in `VISIBLE_FIELD_NAMES` / field errors.
- Block submit when unchecked (client + server).
- Align `/privacy` collect body with the new fields + consent.
- Minimal CSS only (`.field--checkbox` / `.request-privacy-line`) so the modal still fits on mobile.

**Exit:** Unchecked submit never hits n8n; checked submit still reaches the API.

### Phase 2 — Webhook client + env rename

**Work:**

- Read webhook URL only from `n8n_connection_outreachpage`.
- Require `N8N_WEBHOOK_SECRET` in production.
- Attach consent audit fields; bump schema to `1.2`.
- Include consent on the internal notification email.
- Update `.env.example`, `scripts/check-secrets.mjs`, README, `ops/launch-checklist.json`.
- Keep timeout, no PII logs, no retries.

**Files expected to change:**  
`lib/review-request-service.ts`, `lib/review-request-schema.ts`, `lib/review-request-emails.ts`, `.env.example`, `scripts/check-secrets.mjs`, `README.md`, `ops/launch-checklist.json`.

**Out of scope:** admin UI, storing leads in Next.js, extra qualification fields.

**Exit:** `npm run lint`, `npm run check:launch`; production still refuses submit without both env vars.

### Phase 3 — n8n workflow (outside this repo)

n8n lives in Standout’s n8n instance. `ops/n8n-enquiry-reviews.workflow.json` is the **contract**, not an importable export.

**Minimum nodes:**

1. Webhook — POST; copy production URL into `n8n_connection_outreachpage`.
2. Verify HMAC of `` `${X-Standout-Timestamp}.${rawBody}` ``; reject bad/stale signatures.
3. Validate required keys including `gdpr_consent === true`.
4. Idempotency on `lead_id`.
5. Respond 200 quickly, then persist / notify.
6. First operational action (Sheet row, Slack, email, CRM). Prefer `payload.emails.*` so copy stays aligned with the site.

Use n8n’s **test** URL while building; switch Vercel Production to the **production** URL only when the workflow is active.

**Exit:** Valid signed POST accepted; invalid signature rejected.

### Phase 4 — Wire env and end-to-end test

1. Generate `N8N_WEBHOOK_SECRET`.
2. Set `n8n_connection_outreachpage` + secret in `.env.local` against the n8n **test** webhook.
3. Submit the form (including GDPR tick) with realistic dummy data.
4. Confirm n8n shows the four visitor fields, consent audit, and `lead_id`.
5. Confirm the modal success state.
6. Repeat with production webhook + Vercel env.
7. Mark `ops/launch-checklist.json` item `n8n-webhook` done only after one live submit succeeds.

**Exit:** One successful production-like submit observed in n8n; visitor sees “Your strategy call request has been received.”

### Phase 5 — Downstream n8n (not blocking the site)

After ingress works:

- Enquiry Reviews Google Sheet (add `gdpr_consent` / `gdpr_consented_at` columns)
- Confirmation email to `work_email`
- Internal notification to `achow@standoutgroup.net`
- Later: qualification, assignment, booking — all n8n

---

## 9. Security and privacy rules

- Browser never receives the webhook URL or secret.
- No `NEXT_PUBLIC_` prefix on n8n vars.
- Do not put secrets in `implementation/`, `ops/`, README, or client components.
- HMAC + timestamp skew check on n8n is mandatory before trusting a body.
- Rate limit, honeypot, and minimum fill time stay on the Next.js API.
- Logs: `lead_id`, HTTP status, error class only — never name, email, or website.
- Privacy notice already names n8n as a processor; keep that list accurate.

---

## 10. What we will not do

- No admin dashboard, login, or credential UI on this microsite.
- No browser `fetch` to n8n (CORS / CSP / secret leakage).
- No storing leads in a Next.js database as part of this work.
- No inventing a live webhook URL in git.
- No extra marketing-newsletter checkbox unless the owner asks.
- No changing the four qualification fields unless the owner asks.

---

## 11. Test plan

| Check | Expected |
|---|---|
| Empty / invalid fields | Field errors; n8n not called |
| GDPR unchecked | Field error; n8n not called |
| GDPR checked + valid fields | Payload includes consent audit; UI success when webhook OK |
| Honeypot filled | API returns success; n8n not called |
| Missing env in production | 503, generic visitor message |
| Missing secret in production | 503 (after Phase 2) |
| Missing env in development | Submit succeeds locally; no webhook POST |
| Valid submit + live webhook | n8n receives JSON; UI success |
| Bad HMAC | n8n rejects; site 502 retry message |
| Duplicate `lead_id` | n8n 200; no second row |
| Secrets check | `npm run check:launch` still passes |
| Modal on 390px | Checkbox + CTA still usable; no overflow |

---

## 12. Files in play

| Path | Role |
|---|---|
| `components/landing/review-request-form.tsx` | Collect fields + GDPR checkbox; POST `/api/review-request` |
| `lib/landing-copy.ts` | Checkbox / error copy |
| `app/api/review-request/route.ts` | Same-origin ingress |
| `lib/review-request-service.ts` | Validate, sign, `fetch` n8n |
| `lib/review-request-schema.ts` | Field contract |
| `lib/review-request-emails.ts` | Email bodies in payload |
| `app/privacy/page.tsx` / `lib/site-config.ts` | Privacy alignment |
| `.env.example` | Empty env keys |
| `scripts/check-secrets.mjs` | Forbid client leakage of the new env name |
| `ops/n8n-enquiry-reviews.workflow.json` | n8n contract |
| `ops/launch-checklist.json` | Production blocker `n8n-webhook` |
| `implementation/n8n_connection_outreachpageimplementationplan.md` | This plan |

---

## 13. Open items for the owner

1. Confirm the suggested changes in §5 (especially requiring HMAC in production and bumping schema to 1.2).
2. n8n instance (cloud vs self-hosted) and first downstream action after ingest.
3. Who generates and stores `N8N_WEBHOOK_SECRET`.
4. Whether Preview deploys hit a **test** webhook or stay unconfigured.
5. Exact GDPR checkbox wording (draft in §6.3) vs legal review.
6. Whether lawful basis on `/privacy` should stay “legitimate interests + pre-contract” **and** the checkbox, or switch the form processing basis to **consent**. Recommendation: keep legitimate interests / pre-contract as the primary basis for B2B strategy-call contact, and treat the checkbox as **recorded agreement + transparency** (still required in the UI). Confirm with whoever owns privacy copy.

---

## Change log

| Date | Note |
|---|---|
| 2026-08-14 | Plan created. Reuse existing Vercel `/api/review-request` path. Canonical webhook env: `n8n_connection_outreachpage`. Add required GDPR checkbox + consent audit fields. Live n8n + production env still to be wired after approval. |
