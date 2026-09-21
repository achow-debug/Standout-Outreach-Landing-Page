import { officialCopy } from "@/lib/official-copy";
import { siteConfig } from "@/lib/site-config";

const HEADER_NAV_IDS = ["why-choose-us", "faq", "founder"] as const;

/**
 * Official-site chrome: split wordmark, compact desktop nav, primary Apply.
 */
export function SiteHeader() {
  const [standout, group] = siteConfig.businessName.split(" ");
  const { applyLabel, applyHref } = officialCopy.header;
  const navItems = officialCopy.nav.items.filter((item) =>
    HEADER_NAV_IDS.includes(item.id),
  );

  return (
    <header className="official-header">
      <div className="page-shell official-header-inner">
        <p className="brand-mark official-header-mark">
          <span className="brand-mark-name">
            {standout}{" "}
            <span className="brand-mark-accent">{group}</span>
          </span>
        </p>
        <nav className="official-header-nav" aria-label="Page">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="official-header-nav-link"
            >
              {item.id === "faq" ? "FAQ" : item.label}
            </a>
          ))}
        </nav>
        <a
          href={applyHref}
          className="btn btn-primary btn-cta official-header-cta"
        >
          {applyLabel}
          <span className="btn-cta-arrow" aria-hidden="true">
            →
          </span>
        </a>
      </div>
    </header>
  );
}
