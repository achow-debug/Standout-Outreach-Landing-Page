import type { Metadata } from "next";
import { SiteFooter } from "@/components/landing/site-footer";
import { AgencyComparison } from "@/components/official/agency-comparison";
import { BookingProvider } from "@/components/official/booking-provider";
import { ColpPeaceOfMind } from "@/components/official/colp-peace-of-mind";
import { DpaRequestProvider } from "@/components/official/dpa-request";
import { FirmDay } from "@/components/official/firm-day";
import { HowItWorks } from "@/components/official/how-it-works";
import { PracticeAreaProvider } from "@/components/official/practice-area";
import { SiteHeader } from "@/components/official/site-header";
import { EnquiryPath } from "@/components/path/EnquiryPath";
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
    <PracticeAreaProvider>
      <BookingProvider>
        <DpaRequestProvider>
          <main
            id="main-content"
            tabIndex={-1}
            style={{
              paddingTop: "calc(var(--nav-offset) + clamp(2.5rem, 6vw, 5rem))",
            }}
          >
            <SiteHeader />
            {/* Enquiry path is limited to this page for now (§7 + product decision). */}
            <EnquiryPath>
              <HowItWorks />
              <FirmDay />
              <AgencyComparison />
              <ColpPeaceOfMind />
            </EnquiryPath>
          </main>
          <SiteFooter />
        </DpaRequestProvider>
      </BookingProvider>
    </PracticeAreaProvider>
  );
}
