import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/landing/site-footer";
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
      <main id="main-content" className="page-shell py-[clamp(2.5rem,8vw,4rem)]" tabIndex={-1}>
        <p className="m-0 mb-6 text-[0.9375rem]">
          <Link href="/">← Back to homepage</Link>
        </p>
        <h1 className="prose-measure m-0 mb-10 text-[clamp(1.75rem,4vw,2.25rem)] font-bold tracking-[-0.02em] text-[var(--color-ink)]">
          {compliancePage.title}
        </h1>
        <div className="prose-measure flex flex-col gap-8">
          <p className="m-0 text-[1.0625rem] leading-[1.6] text-[var(--color-ink-muted)]">
            {compliancePage.intro}
          </p>
          <section aria-labelledby="compliance-ico">
            <h2 id="compliance-ico" className="m-0 mb-2 text-[1.125rem] font-bold text-[var(--color-ink)]">
              {compliancePage.icoHeading}
            </h2>
            <p className="m-0 text-[1rem] leading-[1.6] text-[var(--color-ink-muted)]">
              {compliancePage.icoBody}
            </p>
          </section>
          <section aria-labelledby="compliance-retention">
            <h2
              id="compliance-retention"
              className="m-0 mb-2 text-[1.125rem] font-bold text-[var(--color-ink)]"
            >
              {compliancePage.retentionHeading}
            </h2>
            <p className="m-0 text-[1rem] leading-[1.6] text-[var(--color-ink-muted)]">
              {siteConfig.privacy.retentionPeriod}
            </p>
            <p className="m-0 mt-3 text-[1rem] leading-[1.6] text-[var(--color-ink-muted)]">
              {compliancePage.retentionPending}
            </p>
          </section>
          <section aria-labelledby="compliance-pledge">
            <h2
              id="compliance-pledge"
              className="m-0 mb-2 text-[1.125rem] font-bold text-[var(--color-ink)]"
            >
              {compliancePage.pledgeHeading}
            </h2>
            <p className="m-0 text-[1rem] leading-[1.6] text-[var(--color-ink-muted)]">
              {compliancePage.pledge}
            </p>
            <p className="m-0 mt-3 text-[1rem] leading-[1.6] text-[var(--color-ink-muted)]">
              {compliancePage.pendingReview}
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
