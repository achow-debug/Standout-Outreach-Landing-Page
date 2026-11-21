import { SectionShell } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

const cards = [
  {
    title: "Law firms that want to grow deliberately",
    body: "More high-value work and healthy margins, not just enquiries coming in through the door.",
  },
  {
    title: "Firms whose online presence undersells the quality of work they actually do",
    body: "Website, reviews, and reputation that don’t yet reflect where the firm wants to be positioned.",
  },
  {
    title: "Partners who want to be more selective about the matters they take on",
    body: "Understanding which work is genuinely profitable and building a pipeline that brings in more of it, instead of accepting whatever calls in.",
  },
] as const;

/**
 * Qualification band. Left-aligned under the content line.
 */
export function WhoItsFor() {
  return (
    <SectionShell
      id="who-its-for"
      tone="paper"
      pathAlign
      aria-labelledby="official-who-heading"
    >
      <Reveal>
        <h2
          id="official-who-heading"
          className="max-w-heading font-display text-h2 text-ink"
        >
          <span className="block">You bring the ambition.</span>
          <span className="block">We build the system.</span>
        </h2>
      </Reveal>
      <p className="mt-5 max-w-lead text-lead text-ink-muted lg:mt-6">
        We partner with firms worth building on,{" "}
        <span className="block lg:inline">
          and the people with the will to build them.
        </span>
      </p>

      <Reveal>
        <h3
          id="official-who-partners-label"
          className="mt-12 font-display text-h3 text-ink lg:mt-16"
        >
          Who we partner with
        </h3>
      </Reveal>
      <ul
        className="m-0 mt-8 grid list-none grid-cols-1 gap-12 p-0 md:grid-cols-3"
        aria-labelledby="official-who-partners-label"
      >
        {cards.map((card, index) => (
          <li key={card.title}>
            <Reveal index={index}>
              <h4 className="m-0 font-display text-h3 text-ink">{card.title}</h4>
              <p className="m-0 mt-3 max-w-prose text-body text-ink-muted">
                {card.body}
              </p>
            </Reveal>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
