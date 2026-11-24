import type { Metadata } from "next";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/official/site-header";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `Security | ${siteConfig.businessName}`,
  description: "Security and data protection at Standout Group.",
  alternates: {
    canonical: "/security",
  },
};

/**
 * Empty shell so /security resolves. Body copy is out of scope for this pass.
 */
export default function SecurityPage() {
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
