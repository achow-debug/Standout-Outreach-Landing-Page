import { landingCopy } from "@/lib/landing-copy";

/**
 * Restrained copyright-only footer beneath the conversion CTA.
 */
export function MinimalFooter() {
  return (
    <footer className="site-footer">
      <div className="page-shell">
        <p className="site-footer-copy">{landingCopy.footer.copyright}</p>
        <p className="site-footer-compliance">{landingCopy.footer.compliance}</p>
      </div>
    </footer>
  );
}
