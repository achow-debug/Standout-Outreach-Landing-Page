import type { Metadata } from "next";
import { MotionBootstrap } from "@/components/landing/motion-bootstrap";
import { SiteFooter } from "@/components/landing/site-footer";
import { BookingProvider } from "@/components/official/booking-provider";
import { DpaRequestProvider } from "@/components/official/dpa-request";
import { Faq } from "@/components/official/faq";
import { MeetTheFounder } from "@/components/official/meet-the-founder";
import { PracticeAreaProvider } from "@/components/official/practice-area";
import { SiteHeader } from "@/components/official/site-header";
import { SourcesSection } from "@/components/official/sources-section";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `Customer stories | ${siteConfig.businessName}`,
  description:
    "Our story and frequently asked questions about working with Standout Group.",
  alternates: {
    canonical: "/customer-stories",
  },
};

export default function CustomerStoriesPage() {
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
            <MeetTheFounder />
            <Faq />
          </main>
          <SiteFooter />
          <SourcesSection />
        </DpaRequestProvider>
      </BookingProvider>
    </PracticeAreaProvider>
  );
}
