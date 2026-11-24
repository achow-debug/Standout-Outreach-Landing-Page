import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/landing/site-footer";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `Terms | ${siteConfig.businessName}`,
  description: "Terms of use for Standout Group.",
  alternates: {
    canonical: "/terms",
  },
};

/**
 * Minimal placeholder so /terms does not 404. Legal copy is out of scope.
 */
export default function TermsPage() {
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
                ← Back home
              </Link>
            </p>
            <h1 className="m-0 mb-3 font-display text-h2 text-ink">Terms</h1>
            <p className="m-0 text-body text-ink-muted">
              Terms of use will be published here shortly.
            </p>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
