import { officialCopy, type OfficialWhoItsForItem } from "@/lib/official-copy";

const ITEM_DELAYS = [
  "motion-enter--0",
  "motion-enter--1",
  "motion-enter--2",
] as const;

function WhoItem({
  item,
  delayClass,
}: {
  item: OfficialWhoItsForItem;
  delayClass: string;
}) {
  return (
    <li className={`official-who-item motion-enter ${delayClass}`}>
      <span className="official-who-index" aria-hidden="true">
        {item.index}
      </span>
      <div className="official-who-item-copy">
        <h3 className="official-who-item-title">{item.title}</h3>
        <p className="official-who-item-body">{item.body}</p>
      </div>
    </li>
  );
}

/**
 * Light qualification band: headline left, A/B/C audience list right.
 */
export function WhoItsFor() {
  const { eyebrow, heading, supporting, items } = officialCopy.whoItsFor;

  return (
    <section
      className="official-who"
      id="who-its-for"
      aria-labelledby="official-who-heading"
      tabIndex={-1}
    >
      <div className="page-shell official-who-inner">
        <div className="official-who-intro">
          <p className="official-who-eyebrow">{eyebrow}</p>
          <h2 id="official-who-heading" className="official-who-heading">
            {heading}
          </h2>
          <p className="official-who-supporting">{supporting}</p>
        </div>
        <ol className="official-who-list">
          {items.map((item, index) => (
            <WhoItem
              key={item.id}
              item={item}
              delayClass={ITEM_DELAYS[index] ?? "motion-enter--0"}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}
