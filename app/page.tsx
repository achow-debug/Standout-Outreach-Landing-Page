import { MotionBootstrap } from "@/components/landing/motion-bootstrap";
import { ReviewRequestShell } from "@/components/landing/review-request-cta";
import { SiteFooter } from "@/components/landing/site-footer";
import { BookingProvider } from "@/components/official/booking-provider";
import { DpaRequestProvider } from "@/components/official/dpa-request";
import { PracticeAreaProvider } from "@/components/official/practice-area";
import { ColpPeaceOfMind } from "@/components/official/colp-peace-of-mind";
import { Faq } from "@/components/official/faq";
import { MeetTheFounder } from "@/components/official/meet-the-founder";
import { NoDisruption } from "@/components/official/no-disruption";
import { PersonalisedWork } from "@/components/official/personalised-work";
import { SecurityBadges } from "@/components/official/security-badges";
import { OfficialHero } from "@/components/official/official-hero";
import { ProductShowcase } from "@/components/official/product-showcase";
import { AgencyComparison } from "@/components/official/agency-comparison";
import { FirmDay } from "@/components/official/firm-day";
import { HowItWorks } from "@/components/official/how-it-works";
import { OfficialFinalCta } from "@/components/official/final-cta";
import { SiteHeader } from "@/components/official/site-header";
import { WhatPartnersSay } from "@/components/official/what-partners-say";
import { SourcesSection } from "@/components/official/sources-section";
import { WhoItsFor } from "@/components/official/who-its-for";

/**
 * Official homepage: header → hero → product showcase → no disruption →
 * personalised rows → security → partners → who it's for → how it works →
 * firm’s day → comparison → COLP → founder → FAQ → closing CTA → footer.
 * Sources stays after the footer so an opened list does not split the close.
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
              <ProductShowcase />
              <NoDisruption />
              <PersonalisedWork />
              <SecurityBadges />
              <WhatPartnersSay />
              <WhoItsFor />
              <HowItWorks />
              <FirmDay />
              <AgencyComparison />
              <ColpPeaceOfMind />
              <MeetTheFounder />
              <Faq />
              <OfficialFinalCta />
            </main>
            <SiteFooter />
            <SourcesSection />
          </DpaRequestProvider>
        </BookingProvider>
      </PracticeAreaProvider>
    </ReviewRequestShell>
  );
}
