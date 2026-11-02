import type { Metadata } from "next";
import { MotionBootstrap } from "@/components/landing/motion-bootstrap";
import { ReviewRequestShell } from "@/components/landing/review-request-cta";
import { SiteFooter } from "@/components/landing/site-footer";
import { AgencyComparison } from "@/components/official/agency-comparison";
import { BookingProvider } from "@/components/official/booking-provider";
import { ColpPeaceOfMind } from "@/components/official/colp-peace-of-mind";
import { DpaRequestProvider } from "@/components/official/dpa-request";
import { FirmDay } from "@/components/official/firm-day";
import { HowItWorks } from "@/components/official/how-it-works";
import { PracticeAreaProvider } from "@/components/official/practice-area";
import { SiteHeader } from "@/components/official/site-header";
import { SourcesSection } from "@/components/official/sources-section";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `How it works | ${siteConfig.businessName}`,
  description:
    "How Standout Group finds the fit, runs your firm’s day, and keeps compliance intact.",
  alternates: {
    canonical: "/how-it-works",
  },
};

export default function HowItWorksPage() {
  return (
    <ReviewRequestShell>
      <PracticeAreaProvider>
        <BookingProvider>
          <DpaRequestProvider>
            <main
              id="main-content"
              tabIndex={-1}
              className="pt-[calc(env(safe-area-inset-top)+5.5rem)] md:pt-[calc(env(safe-area-inset-top)+6rem)]"
            >
              <MotionBootstrap />
              <SiteHeader />
              <HowItWorks />
              <FirmDay />
              <AgencyComparison />
              <ColpPeaceOfMind />
            </main>
            <SiteFooter />
            <SourcesSection />
          </DpaRequestProvider>
        </BookingProvider>
      </PracticeAreaProvider>
    </ReviewRequestShell>
  );
}
