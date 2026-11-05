import type { Metadata } from "next";
import { MotionBootstrap } from "@/components/landing/motion-bootstrap";
import { SiteFooter } from "@/components/landing/site-footer";
import { BookingProvider } from "@/components/official/booking-provider";
import { DpaRequestProvider } from "@/components/official/dpa-request";
import { PracticeAreaProvider } from "@/components/official/practice-area";
import { SiteHeader } from "@/components/official/site-header";
import { SourcesSection } from "@/components/official/sources-section";
import { WhoItsFor } from "@/components/official/who-its-for";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `Who we partner with | ${siteConfig.businessName}`,
  description:
    "We partner with law firms worth building on, and the people with the will to build them.",
  alternates: {
    canonical: "/who-we-partner-with",
  },
};

export default function WhoWePartnerWithPage() {
  return (
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
            <WhoItsFor />
          </main>
          <SiteFooter />
          <SourcesSection />
        </DpaRequestProvider>
      </BookingProvider>
    </PracticeAreaProvider>
  );
}
