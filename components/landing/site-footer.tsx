import Link from "next/link";
import { officialCopy } from "@/lib/official-copy";
import { landingCopy } from "@/lib/landing-copy";
import { siteConfig } from "@/lib/site-config";

/**
 * Dark site footer. Left-aligned on mobile, with email and WhatsApp as tap rows.
 */
export function SiteFooter() {
  const { footer } = landingCopy;
  const [standout, group] = siteConfig.businessName.split(" ");
  const links = [
    ...officialCopy.nav.items.map((item) => ({
      href: `/#${item.id}`,
      label: item.label,
    })),
    { href: "/privacy", label: footer.nav.privacyPolicy },
  ];

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
          {links.map((item) =>
            item.href.startsWith("/#") ? (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ) : (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="site-footer-meta">
          <div className="site-footer-contacts">
            <a href={`mailto:${siteConfig.contactEmail}`}>
              Email
              <span>{siteConfig.contactEmail}</span>
            </a>
            <a
              href={siteConfig.contactWhatsAppHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
          </div>
          <p className="site-footer-compliance t-small">{footer.legalNotice}</p>
        </div>

        <p className="site-footer-copy t-small">{footer.copyright}</p>
      </div>
    </footer>
  );
}
