import type { Metadata } from "next";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/official/site-header";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `Sources & methodology | ${siteConfig.businessName}`,
  description: "Sources and methodology for Standout Group claims.",
  alternates: {
    canonical: "/sources",
  },
};

/**
 * Empty shell so /sources resolves. Body copy is out of scope for this pass.
 */
export default function SourcesPage() {
  return (
    <>
      <main
        id="main-content"
        className="bg-paper"
        tabIndex={-1}
        style={{
          paddingTop: "calc(var(--nav-offset) + clamp(2.5rem, 6vw, 5rem))",
          paddingBottom: "var(--section-y)",
          minHeight: "40vh",
        }}
      >
        <SiteHeader />
      </main>
      <SiteFooter />
    </>
  );
}
