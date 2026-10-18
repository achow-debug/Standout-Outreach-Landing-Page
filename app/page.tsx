import { MotionBootstrap } from "@/components/landing/motion-bootstrap";
import { ReviewRequestShell } from "@/components/landing/review-request-cta";
import { SiteFooter } from "@/components/landing/site-footer";
import { BookingProvider } from "@/components/official/booking-provider";
import { DpaRequestProvider } from "@/components/official/dpa-request";
import { PracticeAreaProvider } from "@/components/official/practice-area";
import { ColpPeaceOfMind } from "@/components/official/colp-peace-of-mind";
import { Faq } from "@/components/official/faq";
import { OfficialFinalCta } from "@/components/official/final-cta";
import { MeetTheFounder } from "@/components/official/meet-the-founder";
import { OfficialHero } from "@/components/official/official-hero";
import { PracticeTabs } from "@/components/practice-tabs/PracticeTabs";
import { AgencyComparison } from "@/components/official/agency-comparison";
import { HowItWorks } from "@/components/official/how-it-works";
import { SiteHeader } from "@/components/official/site-header";
import { StickyCta } from "@/components/official/sticky-cta";
import { WhatPartnersSay } from "@/components/official/what-partners-say";
import { WhoItsFor } from "@/components/official/who-its-for";

/**
 * Official homepage: header → hero → practice areas → partners →
 * who it's for → how it works → comparison → COLP → founder → FAQ → book → footer.
 * Mobile sticky CTA sits outside main.
 */
export default function HomePage() {
  return (
    <ReviewRequestShell>
      <PracticeAreaProvider>
        <BookingProvider>
          <DpaRequestProvider>
            <main id="main-content" tabIndex={-1}>
              <MotionBootstrap />
              <SiteHeader />
              <OfficialHero />
              <PracticeTabs />
              <WhatPartnersSay />
              <WhoItsFor />
              <HowItWorks />
              <AgencyComparison />
              <ColpPeaceOfMind />
              <MeetTheFounder />
              <Faq />
            </main>
            <div className="official-close">
              <OfficialFinalCta />
              <SiteFooter />
            </div>
            <StickyCta />
          </DpaRequestProvider>
        </BookingProvider>
      </PracticeAreaProvider>
    </ReviewRequestShell>
  );
}
