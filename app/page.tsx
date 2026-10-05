import { MotionBootstrap } from "@/components/landing/motion-bootstrap";
import { ReviewRequestShell } from "@/components/landing/review-request-cta";
import { SiteFooter } from "@/components/landing/site-footer";
import { BookingProvider } from "@/components/official/booking-provider";
import { ColpPeaceOfMind } from "@/components/official/colp-peace-of-mind";
import { Faq } from "@/components/official/faq";
import { OfficialFinalCta } from "@/components/official/final-cta";
import { MeetTheFounder } from "@/components/official/meet-the-founder";
import { OfficialHero } from "@/components/official/official-hero";
import { TrustBadges } from "@/components/official/trust-badges";
import { ProofStrip } from "@/components/official/proof-strip";
import { AgencyComparison } from "@/components/official/agency-comparison";
import { HowItWorks } from "@/components/official/how-it-works";
import { SiteHeader } from "@/components/official/site-header";
import { StickyCta } from "@/components/official/sticky-cta";
import { WhatPartnersSay } from "@/components/official/what-partners-say";
import { WhoItsFor } from "@/components/official/who-its-for";

/**
 * Official homepage: header → hero → trust badges → proof → partners →
 * who it's for → how it works → comparison → COLP → founder → FAQ → book → footer.
 * Mobile sticky CTA sits outside main.
 */
export default function HomePage() {
  return (
    <ReviewRequestShell>
      <BookingProvider>
        <main id="main-content" tabIndex={-1}>
          <MotionBootstrap />
          <SiteHeader />
          <OfficialHero />
          <TrustBadges />
          <div className="page-shell official-proof-shell">
            <ProofStrip />
          </div>
          <WhatPartnersSay />
          <WhoItsFor />
          <HowItWorks />
          <AgencyComparison />
          <ColpPeaceOfMind />
          <MeetTheFounder />
          <Faq />
          <OfficialFinalCta />
        </main>
        <SiteFooter />
        <StickyCta />
      </BookingProvider>
    </ReviewRequestShell>
  );
}
