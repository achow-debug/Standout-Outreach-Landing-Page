import { MotionBootstrap } from "@/components/landing/motion-bootstrap";
import { ReviewRequestShell } from "@/components/landing/review-request-cta";
import { SiteFooter } from "@/components/landing/site-footer";
import { BookingProvider } from "@/components/official/booking-provider";
import { DpaRequestProvider } from "@/components/official/dpa-request";
import { PracticeAreaProvider } from "@/components/official/practice-area";
import { NoDisruption } from "@/components/official/no-disruption";
import { PersonalisedWork } from "@/components/official/personalised-work";
import { SecurityBadges } from "@/components/official/security-badges";
import { OfficialHero } from "@/components/official/official-hero";
import { ProductShowcase } from "@/components/official/product-showcase";
import { OfficialFinalCta } from "@/components/official/final-cta";
import { SiteHeader } from "@/components/official/site-header";
import { WhatPartnersSay } from "@/components/official/what-partners-say";
import { SourcesSection } from "@/components/official/sources-section";

/**
 * Official homepage: header → hero → product showcase → no disruption →
 * personalised rows → security → partners → closing CTA → footer.
 * Longer sections live on Who we partner with, How it works, and Customer stories.
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
