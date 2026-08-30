"use client";

import Link from "next/link";
import { useState } from "react";
import {
  FooterInfoDialog,
  type FooterInfoPanel,
} from "@/components/landing/info-dialog";
import { landingCopy } from "@/lib/landing-copy";
import { siteConfig } from "@/lib/site-config";

/**
 * Dark two-column site footer: about, company nav, ICO notice, privacy.
 */
export function SiteFooter() {
  const { footer } = landingCopy;
  const [standout, group] = siteConfig.businessName.split(" ");
  const [panel, setPanel] = useState<FooterInfoPanel | null>(null);

  return (
    <>
      <footer className="site-footer">
        <div className="page-shell site-footer-inner">
          <div className="site-footer-brand">
            <p className="brand-mark">
              <span className="brand-mark-name">
                {standout}{" "}
                <span className="brand-mark-accent">{group}</span>
              </span>
            </p>
            <p className="site-footer-about">{footer.about}</p>
          </div>

          <div className="site-footer-meta">
            <nav className="site-footer-nav" aria-label="Company">
              <button type="button" onClick={() => setPanel("whyChooseUs")}>
                {footer.nav.whyChooseUs}
              </button>
              <span className="site-footer-sep" aria-hidden="true">
                |
              </span>
              <button type="button" onClick={() => setPanel("faq")}>
                {footer.nav.faq}
              </button>
              <span className="site-footer-sep" aria-hidden="true">
                |
              </span>
              <button type="button" onClick={() => setPanel("contact")}>
                {footer.nav.contact}
              </button>
            </nav>

            <p className="site-footer-compliance">{footer.legalNotice}</p>

            <div className="site-footer-legal">
              <Link href="/privacy">{footer.nav.privacyPolicy}</Link>
              <p className="site-footer-copy">{footer.copyright}</p>
            </div>
          </div>
        </div>
      </footer>

      <FooterInfoDialog panel={panel} onClose={() => setPanel(null)} />
    </>
  );
}
