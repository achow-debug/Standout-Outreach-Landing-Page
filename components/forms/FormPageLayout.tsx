import Link from "next/link";
import { BeforeYouBook } from "@/components/forms/BeforeYouBook";
import { MultiStepForm } from "@/components/forms/MultiStepForm";
import { ToolsTrustRow } from "@/components/forms/ToolsTrustRow";
import { siteConfig } from "@/lib/site-config";
import type { FormConfig } from "@/lib/forms/config";

type FormPageLayoutProps = {
  config: FormConfig;
};

/**
 * Shared chrome for /enquiry-check and /speak-to-alex:
 * wordmark + Back header, two-column desktop grid, trust row, FAQ.
 */
export function FormPageLayout({ config }: FormPageLayoutProps) {
  const [standout, group] = siteConfig.businessName.split(" ");

  return (
    <div className="min-h-dvh bg-paper text-ink">
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="brand-mark text-[1.125rem] leading-none no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand lg:text-[1.25rem]"
          >
            <span className="brand-mark-name whitespace-nowrap">
              {standout} <span className="brand-mark-accent">{group}</span>
            </span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-base font-semibold text-ink no-underline hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back
          </Link>
        </div>
      </header>

      <main className="form-page-main">
        <div className="mx-auto max-w-6xl px-6 pt-8 pb-10 lg:pt-14 lg:pb-16">
          <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,32rem)] lg:items-start lg:gap-16">
            {/* Headline — centred on mobile, left on desktop */}
            <div className="mb-8 text-center lg:mb-0 lg:pt-2 lg:text-left">
              <h1 className="text-h2 text-ink">{config.headline}</h1>
              <p className="mt-3 text-lead text-ink-muted lg:mt-4">
                {config.subline}
              </p>
            </div>

            {/* Form column */}
            <div>
              <MultiStepForm config={config} />
              <div className="mx-auto mt-8 max-w-lg lg:mt-10">
                <ToolsTrustRow compact />
              </div>
            </div>
          </div>
        </div>

        <BeforeYouBook items={config.faq} />
      </main>
    </div>
  );
}
