"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import { useBookingOptional } from "@/components/official/booking-provider";
import {
  DpaRequestProvider,
  DpaRequestTrigger,
  useDpaRequestOptional,
} from "@/components/official/dpa-request";
import { credentials, footerCompliance } from "@/content/landing";
import { officialCopy } from "@/lib/official-copy";
import { landingCopy } from "@/lib/landing-copy";
import { siteConfig } from "@/lib/site-config";
import { FaGoogle, FaLinkedin } from "react-icons/fa";
import { SiClaude, SiPerplexity } from "react-icons/si";

const ASK_AI_PROMPT = "How can Standout Group, the law firm growth partner, help me?";
const askAiQuery = encodeURIComponent(ASK_AI_PROMPT);

const footerIconLinkClass =
  "inline-flex size-11 items-center justify-center rounded-full bg-white/10 !text-white transition-colors hover:bg-white/20";

function OpenAiIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5" fill="currentColor">
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
    </svg>
  );
}

function FooterDpaBoundary({ children }: { children: ReactNode }) {
  const existing = useDpaRequestOptional();
  if (existing) return children;
  return <DpaRequestProvider>{children}</DpaRequestProvider>;
}

function FooterBookingLink({
  label,
  cta,
}: {
  label: string;
  cta: "start-free" | "speak-to-alex";
}) {
  const booking = useBookingOptional();

  if (!booking) {
    return (
      <Link className="site-footer-link" href="/#book">
        {label}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className="site-footer-link"
      data-cta={cta}
      data-booking-cta=""
      onClick={() => booking.openBooking("footer")}
    >
      {label}
    </button>
  );
}

/**
 * Dark site footer. Brand, link groups, tagline, and legal bar.
 */
export function SiteFooter() {
  return (
    <FooterDpaBoundary>
      <SiteFooterContent />
    </FooterDpaBoundary>
  );
}

function SiteFooterContent() {
  const { footer } = landingCopy;
  const year = new Date().getFullYear();
  const explore = officialCopy.nav.items.map((item) => ({
    href: `/#${item.id}`,
    label: item.label,
  }));

  return (
    <footer className="site-footer" id="site-footer">
      <div className="page-shell site-footer-inner">
        <p className="site-footer-about t-body">{footer.about}</p>

        <div className="site-footer-groups">
          <nav className="site-footer-group" aria-label="Get started">
            <p className="site-footer-group-title">Get started</p>
            <div className="site-footer-group-list">
              <FooterBookingLink label="Start your free pilot" cta="start-free" />
              <FooterBookingLink label="Speak to Alex" cta="speak-to-alex" />
            </div>
          </nav>

          <nav className="site-footer-group" aria-label="How it works">
            <p className="site-footer-group-title">How it works</p>
            <div className="site-footer-group-list">
              {explore.map((item) => (
                <a key={item.href} className="site-footer-link" href={item.href}>
                  {item.label}
                </a>
              ))}
            </div>
          </nav>

          <nav className="site-footer-group" aria-label="Research">
            <p className="site-footer-group-title">Research</p>
            <div className="site-footer-group-list">
              <button type="button" className="site-footer-link">
                Sources & methodology
              </button>
            </div>
          </nav>

          <nav className="site-footer-group" aria-label="Connect">
            <p className="site-footer-group-title">Connect</p>
            <div className="site-footer-group-list">
              <a className="site-footer-link" href={`mailto:${siteConfig.contactEmail}`}>
                {siteConfig.contactEmail}
              </a>
              <a
                className="site-footer-link"
                href={siteConfig.contactWhatsAppHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp {siteConfig.contactPhone}
              </a>
            </div>
          </nav>

          <div className="site-footer-group flex flex-col gap-5">
            <div>
              <p className="site-footer-group-title">Ask AI about Standout Group</p>
              <div className="flex flex-wrap gap-2">
                <a
                  className={footerIconLinkClass}
                  href={`https://chatgpt.com/?q=${askAiQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Ask ChatGPT about Standout Group"
                >
                  <OpenAiIcon />
                </a>
                <a
                  className={footerIconLinkClass}
                  href={`https://claude.ai/new?q=${askAiQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Ask Claude about Standout Group"
                >
                  <SiClaude aria-hidden="true" className="size-5" />
                </a>
                <a
                  className={footerIconLinkClass}
                  href={`https://www.perplexity.ai/search?q=${askAiQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Ask Perplexity about Standout Group"
                >
                  <SiPerplexity aria-hidden="true" className="size-5" />
                </a>
              </div>
            </div>
            <div>
              <p className="site-footer-group-title">Follow us</p>
              <div className="flex flex-wrap gap-2">
                <a
                  className={footerIconLinkClass}
                  href="https://uk.linkedin.com/showcase/standoutgroup/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Standout Group on LinkedIn"
                >
                  <FaLinkedin aria-hidden="true" className="size-5" />
                </a>
                <a
                  className={footerIconLinkClass}
                  href="https://www.google.com/search?q=Standout%20Group"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Find Standout Group on Google"
                >
                  <FaGoogle aria-hidden="true" className="size-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <p className="max-w-3xl text-[clamp(1.75rem,2.4vw,2.75rem)] font-semibold leading-snug text-white">
          Established law firms should not have to choose between the expertise that
          built their reputation and the technology needed to compete in {year}.
        </p>

        <p
          className="w-full whitespace-nowrap text-[clamp(3rem,11vw,10rem)] font-semibold leading-none tracking-tight text-white"
          aria-hidden="true"
        >
          Standout <span className="text-brand-lavender">Group</span>
        </p>

        <div className="site-footer-bar">
          <div>
            <p className="site-footer-copy t-small">
              © {year} Standout Group · Sheffield, UK · ICO{" "}
              {credentials.icoNumber.replace("Registration number ", "")}
            </p>
            <nav className="site-footer-legal" aria-label="Terms and privacy">
              <Link href="/terms">Terms</Link>
              <Link href="/privacy">Privacy</Link>
            </nav>
          </div>
          <nav className="site-footer-legal" aria-label="Legal">
            <Link href="/privacy">Privacy policy</Link>
            <button type="button">Compliance & data governance</button>
            <a href={`mailto:${siteConfig.contactEmail}?subject=Unsubscribe`}>
              Unsubscribe
            </a>
            <DpaRequestTrigger>Request our standard DPA</DpaRequestTrigger>
          </nav>
        </div>

        <div hidden>
          {footerCompliance.paragraphs.map((paragraph) => (
            <p key={paragraph} className="site-footer-compliance-copy t-small">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </footer>
  );
}
