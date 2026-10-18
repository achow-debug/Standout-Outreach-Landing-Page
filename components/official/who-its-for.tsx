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
      className="official-who"
      id="who-its-for"
      aria-labelledby="official-who-heading"
      tabIndex={-1}
    >
      <div className="page-shell official-partners-inner">
        <div className="official-partners-intro max-w-2xl lg:max-w-md">
          <p className="text-left text-base font-bold text-ink/55 md:text-xl">
            Who it’s for
          </p>
          <h2 id="official-who-heading" className="official-partners-heading t-h2">
            You bring the ambition.{" "}
            <span className="block whitespace-nowrap text-brand">
              We build the system.
            </span>
          </h2>
          <p className="hero-supporting text-left!">
            We partner with firms worth building on, and the people with the will to build them.
          </p>
        </div>
        <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 md:gap-6 lg:grid-cols-3 lg:gap-8">
          {cards.map((card) => (
            <li
              key={card.title}
              className="h-full rounded-xl border border-line bg-surface p-4"
            >
              <h3 className="m-0 text-xl font-bold leading-[1.3] text-[color:var(--official-headline-ink)]">
                {card.title}
              </h3>
              <p className="t-body m-0! mt-1.5 max-w-none! font-normal text-muted">
                {card.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
