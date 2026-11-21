import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/landing/site-footer";
import { Container } from "@/components/ui/Container";
import { landingCopy } from "@/lib/landing-copy";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `${landingCopy.compliancePage.title} | ${siteConfig.businessName}`,
  description: landingCopy.compliancePage.intro,
  alternates: {
    canonical: "/compliance",
  },
};

export default function CompliancePage() {
  const { compliancePage } = landingCopy;

  return (
    <>
      <main
        id="main-content"
        className="bg-paper"
        tabIndex={-1}
        style={{
          paddingTop: "calc(var(--nav-offset) + clamp(2.5rem, 6vw, 5rem))",
          paddingBottom: "var(--section-y)",
        }}
      >
        <Container>
          <div className="max-w-prose lg:pl-(--path-gutter)">
            <p className="m-0 mb-6 text-small">
              <Link
                href="/"
                className="font-semibold text-brand underline-offset-4 hover:underline"
              >
                ← Back to homepage
              </Link>
            </p>
            <h1 className="m-0 mb-10 font-display text-h2 text-ink">
              {compliancePage.title}
            </h1>
            <div className="flex flex-col gap-8">
              <p className="m-0 text-lead text-ink-muted">
                {compliancePage.intro}
              </p>
              <section aria-labelledby="compliance-ico">
                <h2
                  id="compliance-ico"
                  className="m-0 mb-2 font-display text-h3 text-ink"
                >
                  {compliancePage.icoHeading}
                </h2>
                <p className="m-0 text-body text-ink-muted">
                  {compliancePage.icoBody}
                </p>
              </section>
              <section aria-labelledby="compliance-retention">
                <h2
                  id="compliance-retention"
                  className="m-0 mb-2 font-display text-h3 text-ink"
                >
                  {compliancePage.retentionHeading}
                </h2>
                <p className="m-0 text-body text-ink-muted">
                  {siteConfig.privacy.retentionPeriod}
                </p>
                <p className="m-0 mt-3 text-body text-ink-muted">
                  {compliancePage.retentionPending}
                </p>
              </section>
              <section aria-labelledby="compliance-pledge">
                <h2
                  id="compliance-pledge"
                  className="m-0 mb-2 font-display text-h3 text-ink"
                >
                  {compliancePage.pledgeHeading}
                </h2>
                <p className="m-0 text-body text-ink-muted">
                  {compliancePage.pledge}
                </p>
                <p className="m-0 mt-3 text-body text-ink-muted">
                  {compliancePage.pendingReview}
                </p>
              </section>
            </div>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
