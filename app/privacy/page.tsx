import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/landing/site-footer";
import { landingCopy } from "@/lib/landing-copy";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `${landingCopy.privacyPage.title} | ${siteConfig.businessName}`,
  description: landingCopy.privacyPage.intro,
  alternates: {
    canonical: "/privacy",
  },
};

type PrivacyBlock = (typeof landingCopy.privacyPage.sections)[number]["blocks"][number];

function PrivacyBlockContent({ block }: { block: PrivacyBlock }) {
  if (block.type === "paragraph") {
    return (
      <p className="m-0 text-[1rem] leading-[1.6] text-[var(--color-ink-muted)]">
        {block.text}
      </p>
    );
  }

  return (
    <ul className="m-0 list-disc space-y-1 pl-5 text-[1rem] leading-[1.6] text-[var(--color-ink-muted)]">
      {block.items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default function PrivacyPage() {
  const { privacyPage } = landingCopy;

  return (
    <>
      <main id="main-content" className="page-shell py-[clamp(2.5rem,8vw,4rem)]" tabIndex={-1}>
        <p className="m-0 mb-6 text-[0.9375rem]">
          <Link href="/">← Back to Legal Enquiry Review</Link>
        </p>
        <h1 className="prose-measure m-0 mb-3 text-[clamp(1.75rem,4vw,2.25rem)] font-bold tracking-[-0.02em] text-[var(--color-ink)]">
          {privacyPage.title}
        </h1>
        <p className="prose-measure m-0 mb-4 text-[0.9375rem] text-[var(--color-ink-muted)]">
          Last updated: {privacyPage.lastUpdated}
        </p>
        <p className="prose-measure m-0 mb-10 text-[1.0625rem] text-[var(--color-ink-muted)]">
          {privacyPage.intro}
        </p>
        <div className="prose-measure flex flex-col gap-8">
          {privacyPage.sections.map((section, index) => {
            const headingId = `privacy-section-${index + 1}`;
            return (
              <section key={section.heading} aria-labelledby={headingId}>
                <h2
                  id={headingId}
                  className="m-0 mb-2 text-[1.125rem] font-bold text-[var(--color-ink)]"
                >
                  {section.heading}
                </h2>
                <div className="flex flex-col gap-3">
                  {section.blocks.map((block, blockIndex) => (
                    <PrivacyBlockContent
                      key={`${section.heading}-${block.type}-${blockIndex}`}
                      block={block}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
