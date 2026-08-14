# N8N Webhook Implementation Plan

**Status:** Plan only — no code changes until this document is approved  
**Created:** 2026-08-14  
**Goal:** When a visitor submits **Claim my free strategy call**, send the collected lead to an n8n workflow via webhook. No admin UI. Credentials and webhook URLs live in environment variables only.

---

## 1. Outcome

A completed form submit must:

1. Collect **name**, **work email**, **law firm website**, and **prioritised area of law**.
2. Validate and anti-spam check on the Next.js server (never in the browser against n8n).
3. `POST` a signed JSON payload to the n8n production webhook.
4. Show the existing success / error UI on the landing page.
5. Leave all downstream work (Sheets, email, CRM, Slack, booking) to n8n.

The website is a **lead ingress**. n8n is the **operations layer**.

---

## 2. Current state (do not rebuild)

The site already implements this path. This plan is to **verify, complete live wiring, and lock the contract** — not to add a second submit pipeline.

| Piece | Location | Status |
|---|---|---|
| Form fields + CTA | `components/landing/review-request-form.tsx` | Done — four required fields; submit CTA is “Claim My Free Strategy Call” |
| Client validation | `lib/review-request-schema.ts` | Done — Zod; website normalised to HTTPS |
| Same-origin API | `app/api/review-request/route.ts` | Done — `POST /api/review-request` |
| Server processing + webhook POST | `lib/review-request-service.ts` | Done — HMAC sign, 12s timeout, no PII in logs |
| Email copy for n8n to send | `lib/review-request-emails.ts` | Done — confirmation + internal notification bodies in the payload |
| Env placeholders | `.env.example` | Done — empty `N8N_WEBHOOK_URL` / `N8N_WEBHOOK_SECRET` |
| Secret leak check | `scripts/check-secrets.mjs` | Done — forbids `N8N_*` in client components |
| Workflow contract (ops spec, not an importable n8n file) | `ops/n8n-enquiry-reviews.workflow.json` | Spec exists; **live n8n workflow is not confirmed** |
| Production env | Vercel / host | **Open** — launch checklist still lists n8n as unset |

**Browser must never call n8n.** CSP `connect-src 'self'` already blocks that. The form posts only to `/api/review-request`.

**Local behaviour today:** if `N8N_WEBHOOK_URL` or `N8N_WEBHOOK_SECRET` is missing, development accepts the submit (`dev_accept_without_webhook`) so the UI can be tested. Production returns **503** until both env vars are set.

---

## 3. Architecture

```
Visitor
  → fills name, work email, firm website, prioritised area of law
  → clicks “Claim My Free Strategy Call”
  → POST /api/review-request  (same origin)
       → Zod validation
       → honeypot + min fill time + IP rate limit
       → build payload (lead_id, attribution, email copy)
       → HMAC-SHA256 sign
       → POST N8N_WEBHOOK_URL
            headers: X-Standout-Timestamp, X-Standout-Signature, X-Standout-Lead-Id
  → n8n workflow (verify signature → persist / notify / whatever is next)
  → API returns { ok: true, lead_id }
  → modal success state
```

**No admin section.** Webhook URL and secret are server-only env vars (`N8N_*`, never `NEXT_PUBLIC_*`).

---

## 4. Data collected and payload contract

### 4.1 Fields the visitor submits

| Form field | JSON key | Notes |
|---|---|---|
| Name | `name` | 2–80 chars, trimmed; spreadsheet formula-injection prefix stripped |
| Work email | `work_email` | Valid email, lowercased |
| Law firm website | `website` | Bare domain or URL; normalised to `https://` |
| Prioritised area of law | `prioritised_area_of_law` | Select; **label** sent to n8n (e.g. `Personal Injury`), not the internal slug |

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

### 4.2 Server-added fields (always included)

| Key | Purpose |
|---|---|
| `schema_version` | Currently `"1.1"` |
| `lead_id` | UUID generated server-side |
| `requested_at` | ISO-8601 timestamp |
| `status` | Always `"Requested"` on ingress |
| `source`, `medium`, `campaign`, `content`, `term` | UTM / attribution (nullable) |
| `landing_path` | Path the form was submitted from |
| `referrer_domain` | Referrer host, if any |
| `emails.confirmation` | `{ to, from, subject, text }` for the visitor |
| `emails.internal` | `{ to, from, subject, text }` for Standout |

Honeypot (`company_website`) and `form_started_at` are **not** forwarded to n8n.

### 4.3 Example body n8n will receive

```json
{
  "schema_version": "1.1",
  "lead_id": "3f2a9c1e-4b8d-4e11-9c22-8a7b6d5e4f30",
  "requested_at": "2026-08-14T13:00:00.000Z",
  "name": "Sarah Jenkins",
  "work_email": "sarah@smithlaw.co.uk",
  "website": "https://smithlaw.co.uk",
  "prioritised_area_of_law": "Personal Injury",
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

### 4.4 Request headers n8n must verify

| Header | Value |
|---|---|
| `Content-Type` | `application/json` |
| `X-Standout-Timestamp` | Unix milliseconds as a string |
| `X-Standout-Signature` | hex HMAC-SHA256 of `` `${timestamp}.${rawBody}` `` using `N8N_WEBHOOK_SECRET` |
| `X-Standout-Lead-Id` | Same UUID as `lead_id` |

Reject if:

- signature does not match, or
- timestamp skew is greater than **5 minutes**

Respond **200** with `{ "ok": true, "lead_id": "<uuid>" }` on success so the landing page can treat the submit as complete.

---

## 5. Environment variables

Server-only. Never commit real values. Never prefix with `NEXT_PUBLIC_`.

| Variable | Where | Required in production |
|---|---|---|
| `N8N_WEBHOOK_URL` | `.env.local` (dev), Vercel env (prod/preview) | Yes — full n8n webhook URL, production path |
| `N8N_WEBHOOK_SECRET` | same | Yes — shared HMAC secret; generate a long random string |

`.env.example` already declares both as empty. Keep it that way.

**Vercel:** add both as encrypted env vars for Production (and Preview if you want to test against an n8n test webhook). Redeploy after setting.

**Local:** copy `.env.example` → `.env.local` and fill both to exercise a real n8n test webhook. Leave them empty only if you want the existing “accept without forwarding” dev shortcut.

---

## 6. Implementation phases

Do not start a later phase until the current one is done and checked off here.

### Phase 0 — Confirm the existing site path (no product change)

**Goal:** Prove the current form → API → webhook client is the one we will keep.

**Work:**

- Walk the four fields and CTA in `review-request-form.tsx`.
- Confirm `processReviewRequest` is the only outbound n8n caller.
- Confirm client components never read `process.env.N8N_*`.
- Confirm CSP does not allow browser `connect-src` to n8n.

**Exit:** Written confirmation in this file’s change log that we reuse the existing API.

### Phase 1 — Lock and (if needed) tighten the site webhook client

**Goal:** Production-ready POST from Next.js. Prefer small fixes over a rewrite.

**Likely work (only if audit finds a gap):**

- Keep HMAC, timeout, and error mapping (502 on n8n failure, 503 if env missing in production).
- Do not log name, email, or website.
- Do not add retries that could duplicate leads unless n8n is proven idempotent on `lead_id` first.
- Optional: treat n8n `2xx` with `{ ok: true }` as success; still fail closed on non-2xx.

**Files that may change:** `lib/review-request-service.ts`, `.env.example` comments only.

**Out of scope here:** admin UI, storing leads in the Next.js app, changing form fields.

**Exit:** `npm run lint`, `npm run check:launch` (secrets check), production still refuses submit without both env vars.

### Phase 2 — Stand up the n8n webhook (outside this repo)

**Goal:** A live (or test) webhook that accepts the contract in §4.

n8n lives in Standout’s n8n instance, not in this Next.js codebase. `ops/n8n-enquiry-reviews.workflow.json` is the **contract**, not an importable workflow export.

**Minimum workflow nodes:**

1. **Webhook** — POST, production URL; copy that URL into `N8N_WEBHOOK_URL`.
2. **Verify HMAC** — recompute hex HMAC of `` `${X-Standout-Timestamp}.${rawBody}` ``; reject bad/stale signatures.
3. **Validate** — require `lead_id`, `name`, `work_email`, `website`, `prioritised_area_of_law`, `requested_at`.
4. **Idempotency** — if `lead_id` already processed, return 200 `{ ok: true, duplicate: true }` (do not append twice).
5. **First operational action** — whatever “work from there” means for now (Sheet row, Slack, email, CRM). Use `payload.emails.*` if sending mail from n8n so copy stays aligned with the site.
6. **Respond** — 200 `{ ok: true, lead_id }`.

Use n8n’s **test** webhook URL while building; switch the site env to the **production** URL only when the workflow is active.

Store the same HMAC secret in n8n credentials / env as `N8N_WEBHOOK_SECRET` on Vercel.

**Exit:** A test POST with a valid signature is accepted; an invalid signature is rejected.

### Phase 3 — Wire environment and end-to-end test

**Goal:** A real form submit on the site creates a lead in n8n.

**Work:**

1. Generate `N8N_WEBHOOK_SECRET`.
2. Set `N8N_WEBHOOK_URL` + secret in `.env.local` against the n8n **test** webhook.
3. Submit the landing form with dummy but realistic data.
4. Confirm n8n execution shows the four visitor fields plus `lead_id`.
5. Confirm the modal success state still appears.
6. Repeat with the production webhook + Vercel env once Phase 2 is live.
7. Mark `ops/launch-checklist.json` item `n8n-webhook` done only after production env is set and one live submit succeeds.

**Exit:** One successful production (or production-like) submit observed in n8n; visitor sees “Your strategy call request has been received.”

### Phase 4 — Downstream n8n (after ingress works)

Not blocking the website. Build in n8n after Phase 3:

- Enquiry Reviews Google Sheet (columns already listed in `lib/review-request-emails.ts` / the ops spec)
- Confirmation email to `work_email`
- Internal notification to `achow@standoutgroup.net`
- Later: qualification, assignment, booking — all n8n, not this repo

---

## 7. Security and privacy rules

- Browser never receives the webhook URL or secret.
- No `NEXT_PUBLIC_N8N_*`.
- Do not put secrets in `implementation/`, `ops/`, README, or client components.
- HMAC + timestamp skew check on n8n is mandatory before trusting a body.
- Rate limit, honeypot, and minimum fill time stay on the Next.js API.
- Logs: `lead_id`, HTTP status, error class only — never PII.
- Privacy notice already names n8n as a processor (`lib/site-config.ts`).

---

## 8. What we will not do

- No admin dashboard, login, or credential UI on this microsite.
- No second form endpoint that posts straight to n8n from the browser.
- No storing leads in a Next.js database as part of this work.
- No inventing a live webhook URL in git.
- No changing the four qualification fields unless the owner asks.

---

## 9. Test plan

| Check | How |
|---|---|
| Empty / invalid fields | Client + API return field errors; n8n is not called |
| Honeypot filled | API returns success; n8n is not called |
| Missing env in production | 503, generic visitor message |
| Missing env in development | Submit succeeds locally; no webhook POST |
| Valid submit + live webhook | n8n receives JSON; UI success |
| Bad HMAC | n8n rejects; site shows retry error (502) |
| Duplicate `lead_id` | n8n 200 duplicate; no second row |
| Secrets check | `npm run check:launch` / `scripts/check-secrets.mjs` still passes |

---

## 10. Files in play

| Path | Role |
|---|---|
| `components/landing/review-request-form.tsx` | Collects the four fields; POSTs to `/api/review-request` |
| `app/api/review-request/route.ts` | Same-origin ingress |
| `lib/review-request-service.ts` | Validate, sign, `fetch` n8n |
| `lib/review-request-schema.ts` | Field contract |
| `lib/review-request-emails.ts` | Email bodies embedded in payload |
| `.env.example` | Empty env keys |
| `ops/n8n-enquiry-reviews.workflow.json` | n8n contract / sheet columns |
| `ops/launch-checklist.json` | Production blocker `n8n-webhook` |
| `implementation/N8N_WEBHOOK_PLAN.md` | This plan |

---

## 11. Open items for the owner

1. n8n instance URL / which environment (cloud vs self-hosted) to use for production.
2. First downstream action after ingest (Sheet, email, Slack, or “webhook received only”).
3. Who generates and stores `N8N_WEBHOOK_SECRET` (password manager + Vercel + n8n).
4. Whether preview deploys should hit a **test** n8n webhook or stay unconfigured (503 / no live leads).

---

## Change log

| Date | Note |
|---|---|
| 2026-08-14 | Plan created. Site already posts signed payloads to `N8N_WEBHOOK_URL`; live n8n + production env still to be wired. |
