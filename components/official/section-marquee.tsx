import { officialCopy } from "@/lib/official-copy";

function MarqueeList({ inert }: { inert?: boolean }) {
  const items = officialCopy.nav.items;

  return (
    <ul className="section-marquee-list" aria-hidden={inert || undefined}>
      {items.map((item) => (
        <li key={`${inert ? "clone-" : ""}${item.id}`}>
          {inert ? (
            <span className="section-marquee-link">{item.label}</span>
          ) : (
            <a className="section-marquee-link" href={`#${item.id}`}>
              {item.label}
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}

/**
 * Slow in-page jump list. The duplicate track is hidden from AT and tab order.
 */
export function SectionMarquee() {
  return (
    <nav className="section-marquee" aria-label="On this page">
      <div className="section-marquee-viewport">
        <div className="section-marquee-track">
          <MarqueeList />
          <MarqueeList inert />
        </div>
      </div>
    </nav>
  );
}

/**
 * Empty destinations for marquee and header hashes. No section UI yet.
 */
export function OfficialSectionStubs() {
  return (
    <div className="official-section-stubs">
      {officialCopy.nav.items
        .filter(
          (item) =>
            item.id !== "founder" &&
            item.id !== "who-its-for" &&
            item.id !== "what-we-cover" &&
            item.id !== "what-you-get" &&
            item.id !== "what-partners-say",
        )
        .map((item) => (
          <section key={item.id} id={item.id} tabIndex={-1}>
            <h2 className="sr-only">{item.label}</h2>
          </section>
        ))}
    </div>
  );
}
