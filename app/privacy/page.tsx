import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/landing/site-footer";
import { Container } from "@/components/ui/Container";
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
      <p className="m-0 text-body text-ink-muted">{block.text}</p>
    );
  }

  return (
    <ul className="m-0 list-disc space-y-1 pl-5 text-body text-ink-muted">
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
                ← Back to Legal Enquiry Review
              </Link>
            </p>
            <h1 className="m-0 mb-3 font-display text-h2 text-ink">
              {privacyPage.title}
            </h1>
            <p className="m-0 mb-4 text-small text-ink-muted">
              Last updated: {privacyPage.lastUpdated}
            </p>
            <p className="m-0 mb-10 text-lead text-ink-muted">
              {privacyPage.intro}
            </p>
            <div className="flex flex-col gap-8">
              {privacyPage.sections.map((section, index) => {
                const headingId = `privacy-section-${index + 1}`;
                return (
                  <section key={section.heading} aria-labelledby={headingId}>
                    <h2
                      id={headingId}
                      className="m-0 mb-2 font-display text-h3 text-ink"
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
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
