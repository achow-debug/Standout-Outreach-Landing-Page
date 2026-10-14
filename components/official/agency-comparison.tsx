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

function CrossIcon() {
  return (
    <svg
      className="official-compare-icon"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      className="official-compare-icon official-compare-icon--check"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
    </svg>
  );
}

/**
 * Light comparison between a traditional retainer and the 30-day pilot.
 * On a phone, each row is a label with two cells side by side.
 * Columns start at 768px.
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
        <div className="official-compare-intro">
          <SectionLabel>{sectionLabels.compare}</SectionLabel>
          <h2 id="official-compare-heading" className="official-compare-caption t-h2">
            {keepTogether(comparison.heading)}
          </h2>
        </div>
        <div className="official-compare-key" aria-hidden="true">
          <p>
            <CrossIcon />
            <span>{comparison.columns.traditional}</span>
          </p>
          <p>
            <CheckIcon />
            <span>{keepTogether(comparison.columns.pilot)}</span>
          </p>
        </div>
        <table className="official-compare-table">
          <caption className="official-compare-sr">{comparison.heading}</caption>
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
                <td className="official-compare-cell official-compare-cell--agency">
                  <span className="official-compare-sr">Traditional agencies: </span>
                  <CrossIcon />
                  <span>{keepTogether(row.traditional)}</span>
                </td>
                <td className="official-compare-cell official-compare-cell--pilot">
                  <span className="official-compare-sr">Standout’s 30-day pilot: </span>
                  <CheckIcon />
                  <span>{keepTogether(row.pilot)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
