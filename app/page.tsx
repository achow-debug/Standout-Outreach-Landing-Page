import { MotionBootstrap } from "@/components/landing/motion-bootstrap";
import { ReviewRequestShell } from "@/components/landing/review-request-cta";
import { SiteFooter } from "@/components/landing/site-footer";
import { BookingProvider } from "@/components/official/booking-provider";
import { Faq } from "@/components/official/faq";
import { OfficialFinalCta } from "@/components/official/final-cta";
import { MeetTheFounder } from "@/components/official/meet-the-founder";
import { OfficialHero } from "@/components/official/official-hero";
import { ProofStrip } from "@/components/official/proof-strip";
import { HowItWorks } from "@/components/official/how-it-works";
import { SiteHeader } from "@/components/official/site-header";
import { StickyCta } from "@/components/official/sticky-cta";
import { WhatPartnersSay } from "@/components/official/what-partners-say";
import { WhoItsFor } from "@/components/official/who-its-for";

/**
 * Official homepage: header → hero → proof → who it's for → how it works →
 * partners → founder → FAQ → book → footer. Mobile sticky CTA sits outside main.
 */
export default function HomePage() {
  return (
    <ReviewRequestShell>
      <BookingProvider>
        <main id="main-content" tabIndex={-1}>
          <MotionBootstrap />
          <SiteHeader />
          <OfficialHero />
          <div className="page-shell official-proof-shell">
            <ProofStrip />
          </div>
          <WhoItsFor />
          <HowItWorks />
          <WhatPartnersSay />
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
