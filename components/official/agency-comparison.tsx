import { keepTogether } from "@/components/official/no-break";
import { SectionLabel } from "@/components/official/section-label";
import { PathNode } from "@/components/path/PathNode";
import { SectionShell } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { comparison, sectionLabels } from "@/content/landing";

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
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      aria-hidden="true"
      className="mt-1 shrink-0 text-ink-subtle"
    >
      <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="mt-1 shrink-0 text-brand"
    >
      <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
    </svg>
  );
}

/**
 * Comparison table. Paper after how-it-works steps.
 */
export function AgencyComparison() {
  const rows = [...comparison.rows, ...keptRows];

  return (
    <SectionShell id="agency-comparison" tone="paper" pathAlign>
      <SectionLabel node={<PathNode />}>{sectionLabels.compare}</SectionLabel>
      <Reveal>
        <h2
          id="official-compare-heading"
          className="mt-4 max-w-heading font-display text-h2 text-ink"
        >
          {keepTogether(comparison.heading)}
        </h2>
      </Reveal>

      <div className="mt-12 overflow-x-auto lg:mt-16">
        <table className="w-full min-w-[40rem] border-collapse text-left">
          <caption className="sr-only">{comparison.heading}</caption>
          <thead>
            <tr className="border-b border-line">
              <th
                scope="col"
                className="py-3 pr-4 text-eyebrow uppercase text-ink-muted"
              >
                Feature
              </th>
              <th
                scope="col"
                className="py-3 pr-4 text-eyebrow uppercase text-ink-muted"
              >
                {comparison.columns.traditional}
              </th>
              <th
                scope="col"
                className="py-3 text-eyebrow uppercase text-ink-muted"
              >
                {keepTogether(comparison.columns.pilot)}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-line">
                <th
                  scope="row"
                  className="py-4 pr-4 align-top font-display text-h3 text-ink"
                >
                  {row.label}
                </th>
                <td className="py-4 pr-4 align-top text-body text-ink-muted">
                  <span className="flex gap-2">
                    <CrossIcon />
                    <span>{keepTogether(row.traditional)}</span>
                  </span>
                </td>
                <td className="py-4 align-top text-body text-ink-muted">
                  <span className="flex gap-2">
                    <CheckIcon />
                    <span>{keepTogether(row.pilot)}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionShell>
  );
}
