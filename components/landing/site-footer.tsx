"use client";

import Link from "next/link";
import { type MouseEvent, type ReactNode } from "react";
import { useBookingOptional } from "@/components/official/booking-provider";
import {
  DpaRequestProvider,
  DpaRequestTrigger,
  useDpaRequestOptional,
} from "@/components/official/dpa-request";
import { Accordion } from "@/components/official/accordion";
import { keepTogether } from "@/components/official/no-break";
import { footerCompliance } from "@/content/landing";
import { officialCopy } from "@/lib/official-copy";
import { landingCopy } from "@/lib/landing-copy";
import { siteConfig } from "@/lib/site-config";

const COMPLIANCE_ID = "site-compliance";

function FooterDpaBoundary({ children }: { children: ReactNode }) {
  const existing = useDpaRequestOptional();
  if (existing) return children;
  return <DpaRequestProvider>{children}</DpaRequestProvider>;
}

function openCompliance(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
  const hash = `#${COMPLIANCE_ID}`;
  if (window.location.hash === hash) {
    history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  }
  window.location.hash = COMPLIANCE_ID;
}

function ApplyLink() {
  const booking = useBookingOptional();
  const label = keepTogether(officialCopy.finalCta.buttonLabel);

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
      onClick={() => booking.openBooking("footer")}
    >
      {label}
    </button>
  );
}

/**
 * Dark site footer. Brand, link groups, then the compliance accordion.
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
  const [standout, group] = siteConfig.businessName.split(" ");
  const explore = officialCopy.nav.items.map((item) => ({
    href: `/#${item.id}`,
    label: item.label,
  }));

  return (
    <footer className="site-footer" id="site-footer">
      <div className="page-shell site-footer-inner">
        <div className="site-footer-brand">
          <p className="brand-mark">
            <span className="brand-mark-name">
              {standout} <span className="brand-mark-accent">{group}</span>
            </span>
          </p>
          <p className="site-footer-about t-body">{footer.about}</p>
        </div>

        <div className="site-footer-groups">
          <nav className="site-footer-group" aria-label="Explore">
            <p className="site-footer-group-title">Explore</p>
            <div className="site-footer-group-list">
              {explore.map((item) => (
                <a key={item.href} className="site-footer-link" href={item.href}>
                  {item.label}
                </a>
              ))}
            </div>
          </nav>

          <nav className="site-footer-group" aria-label="Get started">
            <p className="site-footer-group-title">Get started</p>
            <div className="site-footer-group-list">
              <ApplyLink />
              <DpaRequestTrigger className="site-footer-link">
                Request our standard DPA
              </DpaRequestTrigger>
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
              <a
                className="site-footer-link"
                href={siteConfig.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </div>
          </nav>

          <nav className="site-footer-group" aria-label="Legal">
            <p className="site-footer-group-title">Legal</p>
            <div className="site-footer-group-list">
              <Link className="site-footer-link" href="/privacy">
                Privacy policy
              </Link>
              <a
                className="site-footer-link"
                href={`#${COMPLIANCE_ID}`}
                onClick={openCompliance}
              >
                Compliance & data governance
              </a>
              <a
                className="site-footer-link"
                href={`mailto:${siteConfig.contactEmail}?subject=Unsubscribe`}
              >
                Unsubscribe
              </a>
            </div>
          </nav>
        </div>

        <Accordion
          className="site-footer-compliance"
          items={[
            {
              id: COMPLIANCE_ID,
              title: footerCompliance.title,
              children: footerCompliance.paragraphs.map((paragraph) => (
                <p key={paragraph} className="site-footer-compliance-copy t-small">
                  {paragraph}
                </p>
              )),
            },
          ]}
        />

        <p className="site-footer-copy t-small">
          © {new Date().getFullYear()} Standout Group. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
