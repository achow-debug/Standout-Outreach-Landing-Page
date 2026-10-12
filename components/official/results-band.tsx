import { SectionLabel } from "@/components/official/section-label";
import { ProofStrip } from "@/components/official/proof-strip";
import { TrustBadges } from "@/components/official/trust-badges";
import { sectionLabels } from "@/content/landing";

/**
 * Results band under the hero.
 * Order: proof card, research stats, credentials.
 * The proof card is filled in by task 3.2; the id is the in-page anchor.
 */
export function ResultsBand() {
  return (
    <section className="official-results" aria-labelledby="results-label">
      <div className="page-shell official-results-inner">
        <SectionLabel id="results-label">{sectionLabels.results}</SectionLabel>
        <article id="proof" className="results-proof" />
        <ProofStrip />
        <TrustBadges />
      </div>
    </section>
  );
}
