import { officialCopy, type OfficialWhoItsForItem } from "@/lib/official-copy";

function WhoItem({ item }: { item: OfficialWhoItsForItem }) {
  return (
    <li className="official-who-item">
      <span className="official-who-rule" aria-hidden="true" />
      <h3 className="official-who-item-title t-h3">{item.title}</h3>
      <p className="official-who-item-body t-body">{item.body}</p>
    </li>
  );
}

/**
 * Qualification band. Items use a short purple rule instead of A/B/C letters.
 */
export function WhoItsFor() {
  const { eyebrow, heading, headingAccent, supporting, items } =
    officialCopy.whoItsFor;

  return (
    <section
      className="official-who"
      id="who-its-for"
      aria-labelledby="official-who-heading"
      tabIndex={-1}
    >
      <div className="page-shell official-who-inner">
        <div className="official-who-intro">
          <p className="official-who-eyebrow t-label">{eyebrow}</p>
          <h2 id="official-who-heading" className="official-who-heading t-h2-feature">
            <span className="official-who-heading-line">{heading}</span>
            <span className="official-who-heading-line">{headingAccent}</span>
          </h2>
          <p className="official-who-supporting t-lead">{supporting}</p>
        </div>
        <ol className="official-who-list">
          {items.map((item) => (
            <WhoItem key={item.id} item={item} />
          ))}
        </ol>
      </div>
    </section>
  );
}
