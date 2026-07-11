import type { Metadata } from "next";
import Link from "next/link";
import { MinimalFooter } from "@/components/landing/minimal-footer";
import { landingCopy } from "@/lib/landing-copy";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `${landingCopy.privacyPage.title} | ${siteConfig.businessName}`,
  description:
    "How Standout Group handles personal data submitted through the Legal Enquiry Review request form.",
  alternates: {
    canonical: "/privacy",
  },
};

function buildPrivacySections() {
  const { privacyPage } = landingCopy;
  const { privacy } = siteConfig;
  const email = privacy.controllerEmail;

  const processorBody =
    privacy.processors.length > 0
      ? `Personal data submitted through this form may be processed by: ${privacy.processors.join("; ")}.`
      : privacyPage.processorsPending;

  return [
    {
      heading: privacyPage.sectionHeadings.controller,
      body: `${privacy.controllerName} is the controller of personal data submitted through this form. Contact: ${email}.`,
    },
    {
      heading: privacyPage.sectionHeadings.collect,
      body: privacyPage.collectBody,
    },
    {
      heading: privacyPage.sectionHeadings.lawfulBasis,
      body: privacy.lawfulBasis ?? privacyPage.lawfulBasisPending,
    },
    {
      heading: privacyPage.sectionHeadings.processors,
      body: processorBody,
    },
    {
      heading: privacyPage.sectionHeadings.retention,
      body: privacy.retentionPeriod ?? privacyPage.retentionPending,
    },
    {
      heading: privacyPage.sectionHeadings.rights,
      body: privacyPage.rightsBody.replace("{email}", email),
    },
  ];
}

export default function PrivacyPage() {
  const { privacyPage } = landingCopy;
  const sections = buildPrivacySections();

  return (
    <>
      <main id="main-content" className="page-shell py-[clamp(2.5rem,8vw,4rem)]" tabIndex={-1}>
        <p className="m-0 mb-6 text-[0.9375rem]">
          <Link href="/">← Back to Legal Enquiry Review</Link>
        </p>
        <h1 className="prose-measure m-0 mb-4 text-[clamp(1.75rem,4vw,2.25rem)] font-bold tracking-[-0.02em] text-[var(--color-ink)]">
          {privacyPage.title}
        </h1>
        <p className="prose-measure m-0 mb-10 text-[1.0625rem] text-[var(--color-ink-muted)]">
          {privacyPage.intro}
        </p>
        <div className="prose-measure flex flex-col gap-8">
          {sections.map((section, index) => {
            const headingId = `privacy-section-${index + 1}`;
            return (
              <section key={section.heading} aria-labelledby={headingId}>
                <h2
                  id={headingId}
                  className="m-0 mb-2 text-[1.125rem] font-bold text-[var(--color-ink)]"
                >
                  {section.heading}
                </h2>
                <p className="m-0 text-[1rem] leading-[1.6] text-[var(--color-ink-muted)]">
                  {section.body}
                </p>
              </section>
            );
          })}
        </div>
      </main>
      <MinimalFooter />
    </>
  );
}
