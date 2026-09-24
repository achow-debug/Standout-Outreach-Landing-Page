import Link from "next/link";
import { officialCopy } from "@/lib/official-copy";
import { landingCopy } from "@/lib/landing-copy";
import { siteConfig } from "@/lib/site-config";

/**
 * Dark site footer. Nav links, then Privacy with the legal line.
 * Email and WhatsApp stay off this footer until a contact form exists.
 */
export function SiteFooter() {
  const { footer } = landingCopy;
  const [standout, group] = siteConfig.businessName.split(" ");
  const links = officialCopy.nav.items.map((item) => ({
    href: `/#${item.id}`,
    label: item.label,
  }));

  return (
    <footer className="site-footer" id="site-footer">
      <div className="page-shell site-footer-inner">
        <div className="site-footer-brand">
          <p className="brand-mark">
            <span className="brand-mark-name">
              {standout}{" "}
              <span className="brand-mark-accent">{group}</span>
            </span>
          </p>
          <p className="site-footer-about t-body">{footer.about}</p>
        </div>

        <nav className="site-footer-nav" aria-label="Company">
          {links.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="site-footer-meta">
          <p className="site-footer-legal">
            <Link href="/privacy">{footer.nav.privacyPolicy}</Link>
          </p>
          <p className="site-footer-compliance t-small">{footer.legalNotice}</p>
        </div>

        <p className="site-footer-copy t-small">{footer.copyright}</p>
      </div>
    </footer>
  );
}
