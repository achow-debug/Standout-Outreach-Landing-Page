import Link from "next/link";
import { landingCopy } from "@/lib/landing-copy";
import { getLegalIdentityLine, siteConfig } from "@/lib/site-config";

export function MinimalFooter() {
  const year = new Date().getFullYear();
  const identityLine = getLegalIdentityLine();

  return (
    <footer className="site-footer">
      <div className="page-shell site-footer-inner">
        <p className="m-0">
          © {year} {siteConfig.businessName}
        </p>
        <p className="m-0">
          <a href={`mailto:${siteConfig.contactEmail}`}>
            {siteConfig.contactEmail}
          </a>
        </p>
        <p className="m-0">
          <Link href="/privacy">{landingCopy.footer.privacyLabel}</Link>
        </p>
        <p className="m-0 site-footer-location">
          {landingCopy.footer.locationNote}
        </p>
        {identityLine ? (
          <p className="m-0 site-footer-identity">{identityLine}</p>
        ) : null}
      </div>
    </footer>
  );
}
