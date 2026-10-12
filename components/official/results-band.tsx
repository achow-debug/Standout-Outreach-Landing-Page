import { ProofCard } from "@/components/official/proof-card";
import { SectionLabel } from "@/components/official/section-label";
import { ProofStrip } from "@/components/official/proof-strip";
import { TrustBadges } from "@/components/official/trust-badges";
import { sectionLabels } from "@/content/landing";

/**
 * Results band under the hero.
 * Order: proof card, research stats, credentials.
 */
export function ResultsBand() {
  return (
    <section className="official-results" aria-labelledby="results-label">
      <div className="page-shell official-results-inner">
        <SectionLabel id="results-label">{sectionLabels.results}</SectionLabel>
        <ProofCard />
        <ProofStrip />
        <TrustBadges />
      </div>
    </section>
  );
}
