# Placeholders

Visible `[[TBC: …]]` text, plus owner actions that must be settled before launch. Add a row whenever a task introduces one.

| Placeholder | File | What the owner needs to supply |
| --- | --- | --- |
| Hero headline: owner to confirm A, B or C | `content/landing.ts` | Confirm Option A, or choose B or C. A is implemented until you say otherwise. |
| `[[TBC: hero image (founder photo or pilot system screenshot)]]` | `content/landing.ts` | A founder photo or a screenshot of the pilot system, with alt text. |
| `[[TBC: measurable outcome from this firm's work with us]]` (Florenda A) | `content/landing.ts` | A measurable outcome from Florenda A’s firm, and consent to publish it. |
| `[[TBC: measurable outcome from this firm's work with us]]` (Jayden C) | `content/landing.ts` | A measurable outcome from Jayden C’s firm, and consent to publish it. |
| Florenda A photo | `content/landing.ts` | A photo of Florenda A. The initials circle stays until this exists. Consent for photo, region, date and outcome. |
| Jayden C photo | `content/landing.ts` | A photo of Jayden C. The initials circle stays until this exists. Consent for photo, region, date and outcome. |
| Jayden C approval for trimmed quote | `content/landing.ts` | Jayden’s approval of the trimmed quote. His full quote stays until then. |
| Direct ICO register link for ZC264255 | `content/landing.ts` | A direct register URL if one works. Until then the public search page is used: `https://ico.org.uk/ESDWebPages/Search`. |
| Owner to confirm the Transparency Rules line is true before launch | `content/landing.ts` | Confirm that every conveyancing and probate page we build includes the price and service information the SRA Transparency Rules require. |
| `[[TBC: timeframe, e.g. one working day]]` | `content/landing.ts` | How quickly we email the standard DPA after a request. |
| `[[TBC: n8n webhook URL]]` | `.env.example` (`DPA_REQUEST_WEBHOOK_URL`) | The n8n webhook URL for DPA requests. Until this is a real https URL, the request sheet shows the connection error. |
| ICO explainer: sentence begins with `[` | `content/landing.ts` | The second paragraph currently starts `[Booking data is kept for 30 days then deleted.` Confirm whether the `[` should be removed. |
| Journey timeline stage count | `content/landing.ts` | The plan says a five-stage timeline. The table has four stages. Confirm there is no fifth stage. |
| Data ownership cell | `content/landing.ts` | The live cell is `You keep 100% of leads`. It does not say the firm owns the system. Confirm we keep it, or switch to `You keep every lead and all enquiry data`. |
| Third “Who it’s for” qualifier | `lib/official-copy.ts` | The plan names two qualifiers to keep. A third exists: “Partners who want to be more selective about the matters they take on”. Confirm it stays. |
| Existing FAQ conflicts (do not rewrite until confirmed) | `lib/official-copy.ts` | See the list below. |

## Existing FAQ conflicts

These answers disagree with the plan. They stay as written until you say how to change them.

| Id | Conflict |
| --- | --- |
| `existing-setup` | Says “your agency” and “We don’t replace your website or your agency.” “Agency” is otherwise only allowed for traditional agencies in the comparison. |
| `time` | Ends with “a collaborative conversation”, which the copy sweep removes elsewhere. |
| `enquiry-data` | Says enquiry and client data stays on the firm’s systems and “We never store, copy, or move it elsewhere.” The new ICO explainer and sensitive-data FAQ say enquiry data passes through our automations, only Alex can access it, and it is deleted after 30 days. |
| `after-30-days` | Same question title as the new `faq-after-30-days` item, with different copy (no exclusivity, no “you keep every lead and all enquiry data”). Both questions are on the page until you choose one. |
