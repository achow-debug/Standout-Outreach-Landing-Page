"use client";

import Link from "next/link";
import { FirmTypeRotator } from "@/components/official/firm-type-rotator";
import { Container } from "@/components/ui/Container";
import { credentials } from "@/content/landing";
import { siteConfig } from "@/lib/site-config";

const ICO_ENTRY_URL = "https://ico.org.uk/ESDWebPages/Entry/ZC264255";
const ICO_NUMBER = credentials.icoNumber.replace("Registration number ", "");

const siteLinks = [
  { href: "/security", label: "Security" },
  { href: "/who-we-partner-with", label: "Who we partner with" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/customer-stories", label: "Who we are" },
  { href: "/customer-stories#faqs", label: "FAQs" },
] as const;

const footerLinkClass =
  "inline-flex min-h-11 items-center text-body text-night-text no-underline decoration-night-accent underline-offset-4 hover:underline focus-visible:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-night-accent";

const footerMetaLinkClass =
  "inline-flex items-center text-[13px] text-night-muted no-underline decoration-night-accent underline-offset-4 hover:underline focus-visible:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-night-accent";

const NOT_A_LAW_FIRM =
  "Standout Group is not a law firm and does not provide legal advice.";

/**
 * Site footer: contact + legal only on night aubergine.
 * Mobile: wordmark → contact → Explore → legal strip.
 * Desktop: brand | Explore | contact; single muted legal strip below.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();
  const { legalEntity, contactEmail, contactPhone, contactWhatsAppHref, linkedinUrl } =
    siteConfig;
  const [standout, group] = (legalEntity.tradingName ?? siteConfig.businessName).split(
    " ",
  );

  return (
    <footer
      id="site-footer"
      className="theme-night bg-night pt-(--section-y) pb-8 text-night-text"
    >
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 lg:items-start">
          {/* Brand + rotator */}
          <div className="flex flex-col items-start gap-4 lg:col-span-4">
            <Link
              href="/"
              className="font-sans text-h3 font-bold leading-none text-night-text no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-night-accent"
            >
              <span className="whitespace-nowrap">
                {standout}{" "}
                <span className="text-night-accent">{group}</span>
              </span>
            </Link>
            <FirmTypeRotator size="footer" />
            <p className="m-0 text-small text-night-muted">
              UK-only data handling · Data Processing Agreement before every
              pilot
            </p>
          </div>

          {/* Contact — first after brand on mobile */}
          <div className="order-2 lg:order-3 lg:col-span-4">
            <nav aria-label="Contact">
              <p className="m-0 font-sans text-eyebrow uppercase text-night-muted">
                Contact
              </p>
              <div className="mt-4 flex flex-col">
                <a
                  className={footerLinkClass}
                  href={contactWhatsAppHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp {contactPhone}
                </a>
                <a
                  className={`${footerLinkClass} [overflow-wrap:anywhere]`}
                  href={`mailto:${contactEmail}`}
                >
                  {contactEmail}
                </a>
                <a
                  className={footerLinkClass}
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </div>
            </nav>
          </div>

          {/* Explore links — after contact on mobile */}
          <nav
            className="order-3 lg:order-2 lg:col-span-4"
            aria-label="Explore"
          >
            <p className="m-0 font-sans text-eyebrow uppercase text-night-muted">
              Explore
            </p>
            <div className="mt-4 flex flex-col">
              {siteLinks.map((item) => (
                <a key={item.href} className={footerLinkClass} href={item.href}>
                  {item.label}
                </a>
              ))}
            </div>
          </nav>
        </div>

        {/* Single muted legal strip */}
        <div className="mt-16 border-t border-night-line pt-8 text-[13px] leading-relaxed text-night-muted">
          <p className="m-0 max-w-3xl">
            © {year} {legalEntity.tradingName} is a trading name of{" "}
            {legalEntity.registeredName}, a sole trader.{" "}
            {legalEntity.registeredAddress}
            <span aria-hidden="true"> · </span>
            <a
              className={`${footerMetaLinkClass} [overflow-wrap:anywhere]`}
              href={`mailto:${contactEmail}`}
            >
              {contactEmail}
            </a>
            <span aria-hidden="true"> · </span>
            <a
              className={footerMetaLinkClass}
              href={ICO_ENTRY_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              {ICO_NUMBER}
            </a>
          </p>
          <p className="m-0 mt-2">{NOT_A_LAW_FIRM}</p>
          <nav
            className="mt-4 flex flex-wrap gap-x-5 gap-y-2"
            aria-label="Legal"
          >
            <Link className={footerMetaLinkClass} href="/privacy">
              Privacy
            </Link>
            <Link className={footerMetaLinkClass} href="/privacy">
              Cookies
            </Link>
            <Link className={footerMetaLinkClass} href="/terms">
              Terms
            </Link>
            <Link className={footerMetaLinkClass} href="/sources">
              Sources &amp; methodology
            </Link>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
