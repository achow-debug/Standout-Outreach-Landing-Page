import { compliance, sectionLabels } from "@/content/landing";
import { DpaRequestTrigger } from "@/components/official/dpa-request";
import { SectionLabel } from "@/components/official/section-label";

/**
 * Three regulatory protections for the firm. One column on the phone,
 * three columns from 768px.
 * The DPA button opens the shared request sheet.
 */
export function ColpPeaceOfMind() {
  return (
    <section
      className="official-colp"
      id="colp"
      aria-labelledby="official-colp-heading"
    >
      <div className="page-shell official-colp-inner">
        <div className="official-colp-intro">
          <SectionLabel>{sectionLabels.compliance}</SectionLabel>
          <h2 id="official-colp-heading" className="official-colp-heading t-h2">
            {compliance.heading}
          </h2>
        </div>
        <ul className="official-colp-list">
          {compliance.items.map((item) => (
            <li key={item.id} className="official-colp-item">
              <h3 className="official-colp-title t-h3">{item.title}</h3>
              <p className="official-colp-body text-lead text-ink">{item.body}</p>
              <p className="official-colp-value mt-3 text-small text-ink-muted">{item.note}</p>
              {"button" in item ? (
                <DpaRequestTrigger className="official-colp-dpa">
                  {item.button}
                </DpaRequestTrigger>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
