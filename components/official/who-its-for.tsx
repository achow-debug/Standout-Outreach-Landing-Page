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
 * Qualification band. Static cards under a left-aligned heading.
 * The section id stays so the “Who it’s for” nav link still lands here.
 */
export function WhoItsFor() {
  return (
    <section
      className="official-who scroll-mt-24! bg-surface!"
      id="who-its-for"
      aria-labelledby="official-who-heading"
      tabIndex={-1}
    >
      <div className="page-shell official-partners-inner gap-0! py-20! md:py-32!">
        <div className="official-partners-intro">
          <h2 id="official-who-heading" className="official-partners-heading text-h2 text-ink max-w-[22ch]">
            You bring the ambition.{" "}
            <span className="block">We build the system.</span>
          </h2>
          <p className="mt-5 text-lead text-ink-muted max-w-[60ch]">
            We partner with firms worth building on,{" "}
            <span className="block lg:inline">and the people with the will to build them.</span>
          </p>
        </div>
        <h3
          id="official-who-partners-label"
          className="m-0 mt-12 text-h3 text-ink md:mt-16"
        >
          Who we partner with
        </h3>
        <ul
          className="m-0 mt-5 grid list-none grid-cols-1 gap-8 p-0 md:grid-cols-3 md:gap-12"
          aria-labelledby="official-who-partners-label"
        >
          {cards.map((card) => (
            <li
              key={card.title}
              className="h-full rounded-xl border border-line bg-surface p-4"
            >
              <h4 className="m-0 text-h3 text-ink">{card.title}</h4>
              <p className="m-0 mt-4 text-body text-ink max-w-[62ch]">
                {card.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
