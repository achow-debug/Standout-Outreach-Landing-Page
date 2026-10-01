import { officialCopy } from "@/lib/official-copy";

/**
 * Three regulatory protections for the firm. One column on the phone,
 * three columns from 768px.
 */
export function ColpPeaceOfMind() {
  const { heading, items } = officialCopy.colp;

  return (
    <section
      className="official-colp"
      id="colp"
      aria-labelledby="official-colp-heading"
    >
      <div className="page-shell official-colp-inner">
        <h2 id="official-colp-heading" className="official-colp-heading t-h2">
          {heading}
        </h2>
        <ul className="official-colp-list">
          {items.map((item) => (
            <li key={item.id} className="official-colp-item">
              <h3 className="official-colp-title t-h3">{item.title}</h3>
              <p className="official-colp-body t-body">{item.body}</p>
              <p className="official-colp-value t-small">{item.value}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
