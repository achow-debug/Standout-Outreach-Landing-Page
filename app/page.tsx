import { MotionBootstrap } from "@/components/landing/motion-bootstrap";
import { MeetTheFounder } from "@/components/official/meet-the-founder";
import { OfficialHero } from "@/components/official/official-hero";
import { ProofStrip } from "@/components/official/proof-strip";
import {
  OfficialSectionStubs,
  SectionMarquee,
} from "@/components/official/section-marquee";
import { SiteHeader } from "@/components/official/site-header";
import { WhatWeCover } from "@/components/official/what-we-cover";
import { WhatPartnersSay } from "@/components/official/what-partners-say";
import { WhatYouGet } from "@/components/official/what-you-get";
import { WhoItsFor } from "@/components/official/who-its-for";

/**
 * Official homepage: sticky header → full-bleed dark hero → light proof →
 * who it’s for → what we cover → what you get → what partners say →
 * founder accordion → marquee → section stubs.
 */
export default function HomePage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <MotionBootstrap />
      <SiteHeader />
      <OfficialHero />
      <div className="page-shell official-proof-shell">
        <ProofStrip />
      </div>
      <WhoItsFor />
      <WhatWeCover />
      <WhatYouGet />
      <WhatPartnersSay />
      <MeetTheFounder />
      <SectionMarquee />
      <OfficialSectionStubs />
    </main>
  );
}
