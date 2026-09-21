---
name: Founder photo and hero
overview: On Offical-website-v1, lift founder type for credibility without shouting, drop the 001 index, place Alex’s cropped portrait in a larger circle, move the section to sit after the proof strip, and update the hero plus metadata copy.
todos:
  - id: hero-meta-copy
    content: Update hero H1, supporting line, and meta title/description in official-copy.ts
    status: pending
  - id: founder-copy-css
    content: Remove 001; lead+body type scale; drop index styles
    status: pending
  - id: founder-photo
    content: Add founder-alex.jpg and next/image circular crop (head/shoulders, larger well)
    status: pending
  - id: page-order
    content: Render MeetTheFounder after proof, before marquee; dedupe OfficialSectionStubs
    status: pending
  - id: verify-ui
    content: "Check desktop/mobile: order, crop, type hierarchy, hero copy, #founder jump"
    status: pending
isProject: false
---

# Founder type, portrait, placement, and hero copy

Work only on `Offical-website-v1`. Tokens stay locked to [`app/globals.css`](../../app/globals.css) and [`/Users/alexchow/Downloads/Personal Folder/Standout Group/My official website/style-reference.md`](/Users/alexchow/Downloads/Personal%20Folder/Standout%20Group/My%20official%20website/style-reference.md). No new colours, fonts, or radii.

## Copy formatting recommendation (do not bold the whole bio)

Law-firm credibility here is composure, not volume. The style reference already gives **H1 700**, **supporting 600**, **body 400**. Making five paragraphs bold would compete with the hero and flatten hierarchy.

Use a **lead + body** treatment:

- **Heading** — keep 700, bump one step so it reads as a real section: `1.5rem` → `1.75rem` md, still `#020617`, tracking `-0.02em`. Stays below the hero H1 (`1.5rem` → `3rem`).
- **Opening paragraph** — the origin sentence is the hook. Same size as the hero supporting line (`1.125rem` → `1.25rem` md), **weight 600**, colour `#1e293b` (supporting ink). Not 700.
- **Remaining four paragraphs** — still 400, `--color-ink-muted`, but size up from `1rem` to `1.0625rem` / `1.125rem` md, line-height `1.6`. Readable, not shouty.
- **Do not** extrabold names, “30-day”, or “2026” in this band. Plum accents stay reserved for proof figures, “Group”, and outline controls.

## Page order

You asked for founder as an early credibility beat. New order:

`header → hero → proof strip → Meet the founder → marquee → remaining stubs`

- Render [`MeetTheFounder`](../../components/official/meet-the-founder.tsx) from [`app/page.tsx`](../../app/page.tsx) after the hero/proof `page-shell`, before [`SectionMarquee`](../../components/official/section-marquee.tsx).
- Remove the `id === "founder"` special case in `OfficialSectionStubs` so `#founder` exists once.

## Portrait (chosen crop)

The source is a full-length evening shot. A circle cannot show the diploma without shrinking the face. **Crop head and upper shoulders** (black crew neck + lapels), face centred, `object-fit: cover`, `object-position` toward the upper third (~`50% 18%`). Larger well so it reads as a person, not a chip: about **4.5rem** mobile / **6.5rem** desktop.

- Copy the attached file into [`public/images/founder-alex.jpg`](../../public/images/founder-alex.jpg) (keep the original; crop via CSS, not a second asset unless quality is poor).
- Use `next/image` (already used on the outreach video poster): circular overflow, `alt` from `portraitAlt`.
- Drop initials fallback once the image is in.
- Hairline `1px` `--color-line` ring on the circle so it sits on the white card.

## Remove `001`

- Delete `index` from [`lib/official-copy.ts`](../../lib/official-copy.ts).
- Remove the index node from the component and all `.official-founder-index` CSS / forced-colours rules.
- Meta row becomes portrait-only, still overlapping the card top.

## Hero copy

In [`officialCopy.hero`](../../lib/official-copy.ts) (curly apostrophe, trailing periods to match the current H1/supporting pattern):

- `h1`: `Enabling ambitious law firms to thrive in 2026 and beyond.`
- `supporting`: `The UK’s most innovative law firm growth accelerator.`

Also update `officialCopy.meta` so search/social does not still say “scaler”:

- `title`: `Standout Group | Enabling ambitious law firms to thrive`
- `description`: lead with the new supporting line.

No hero layout change. The longer H1 already uses `text-wrap: balance` and `max-width: 48rem`; only retune size if it wraps to four lines on a 390px viewport.

## Verify

Desktop and mobile: founder sits under proof, marquee still jumps to `#founder`, photo crop is face-forward, `001` gone, lead paragraph 600 / rest 400, hero strings and document title match.
