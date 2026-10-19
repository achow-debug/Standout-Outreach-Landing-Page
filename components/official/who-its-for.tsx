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
      className="official-who scroll-mt-24! bg-brand-lavender-tint!"
      id="who-its-for"
      aria-labelledby="official-who-heading"
      tabIndex={-1}
    >
      <div className="page-shell official-partners-inner gap-0! py-12! md:py-16!">
        <div className="official-partners-intro">
          <h2 id="official-who-heading" className="official-partners-heading t-h2">
            You bring the ambition.{" "}
            <span className="block whitespace-nowrap">
              We build the system.
            </span>
          </h2>
          <p className="hero-supporting max-w-none! text-left! font-normal! text-[color:#475569]! max-sm:text-base!">
            We partner with firms worth building on,{" "}
            <span className="block lg:inline">and the people with the will to build them.</span>
          </p>
        </div>
        <h3
          id="official-who-partners-label"
          className="m-0 mt-8 text-base font-semibold leading-snug text-[color:var(--official-headline-ink)] md:mt-10"
        >
          Who we partner with
        </h3>
        <ul
          className="m-0 mt-3 grid list-none grid-cols-1 gap-4 p-0 md:gap-6 lg:grid-cols-3 lg:gap-8"
          aria-labelledby="official-who-partners-label"
        >
          {cards.map((card) => (
            <li
              key={card.title}
              className="h-full rounded-xl border border-line bg-surface p-4"
            >
              <h4 className="m-0 text-lg font-semibold leading-snug text-[color:var(--official-headline-ink)] md:text-xl">
                {card.title}
              </h4>
              <p className="t-body m-0! mt-2.5! max-w-none! font-normal leading-[1.5]! text-[color:#1e293b]!">
                {card.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
