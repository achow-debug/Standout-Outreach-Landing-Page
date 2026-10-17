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
    <section
      className="official-results relative z-10 rounded-t-[2rem] shadow-[0_-12px_32px_-16px_rgba(17,23,41,0.12)] md:rounded-t-[3rem]"
      aria-labelledby="results-label"
    >
      <div className="page-shell official-results-inner">
        <SectionLabel id="results-label">{sectionLabels.results}</SectionLabel>
        <ProofCard />
        <ProofStrip />
        <TrustBadges />
      </div>
    </section>
  );
}
