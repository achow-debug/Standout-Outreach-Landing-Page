import { comparison, sectionLabels } from "@/content/landing";
import { keepTogether } from "@/components/official/no-break";
import { SectionLabel } from "@/components/official/section-label";

/** Existing row kept with the approved comparison rows. */
const keptRows = [
  {
    id: "risk",
    label: "Regulatory risk",
    traditional: "Generic ads with SRA rules as an afterthought",
    pilot: "SRA-aligned marketing assets",
  },
] as const;

/**
 * Light comparison between a traditional retainer and the 30-day pilot.
 * Phone layout is a stacked card per row. Columns start at 768px.
 */
export function AgencyComparison() {
  const rows = [...comparison.rows, ...keptRows];

  return (
    <section
      className="official-compare"
      id="agency-comparison"
      aria-labelledby="official-compare-heading"
    >
      <div className="page-shell official-compare-inner">
        <table className="official-compare-table">
          <caption>
            <div className="official-compare-intro">
              <SectionLabel>{sectionLabels.compare}</SectionLabel>
              <h2 id="official-compare-heading" className="official-compare-caption t-h2">
                {keepTogether(comparison.heading)}
              </h2>
            </div>
          </caption>
          <thead>
            <tr>
              <th scope="col">Feature</th>
              <th scope="col">{comparison.columns.traditional}</th>
              <th scope="col">{keepTogether(comparison.columns.pilot)}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <th scope="row">{row.label}</th>
                <td data-label={comparison.columns.traditional}>
                  {keepTogether(row.traditional)}
                </td>
                <td data-label={comparison.columns.pilot}>{keepTogether(row.pilot)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
