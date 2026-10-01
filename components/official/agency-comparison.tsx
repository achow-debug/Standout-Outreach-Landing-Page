import { officialCopy } from "@/lib/official-copy";

/**
 * Light comparison between a traditional retainer and the 30-day pilot.
 * Phone layout is a stacked card per row. Columns start at 768px.
 */
export function AgencyComparison() {
  const { caption, columns, rows } = officialCopy.comparison;

  return (
    <section
      className="official-compare"
      id="agency-comparison"
      aria-labelledby="official-compare-heading"
    >
      <div className="page-shell official-compare-inner">
        <table className="official-compare-table">
          <caption>
            <h2 id="official-compare-heading" className="official-compare-caption t-h2">
              {caption}
            </h2>
          </caption>
          <thead>
            <tr>
              <th scope="col">{columns.feature}</th>
              <th scope="col">{columns.traditional}</th>
              <th scope="col">{columns.pilot}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <th scope="row">{row.feature}</th>
                <td data-label={columns.traditional}>{row.traditional}</td>
                <td data-label={columns.pilot}>{row.pilot}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
