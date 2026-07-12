import { landingCopy } from "@/lib/landing-copy";
import { siteConfig } from "@/lib/site-config";

/**
 * Centred brand wordmark + offer copy.
 * Gradient lettering, capsule eyebrow and fluid type for Phase 3.
 */
export function Hero() {
  const { hero } = landingCopy;

  return (
    <header className="hero-surface">
      <p className="brand-mark">
        <span className="brand-mark-name">{siteConfig.businessName}</span>
      </p>

      <p className="hero-eyebrow">
        <span className="hero-eyebrow-icon" aria-hidden="true">
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M2.25 1.2v7.6L8.5 5 2.25 1.2z" fill="currentColor" />
          </svg>
        </span>
        <span className="hero-eyebrow-text">{hero.eyebrow}</span>
      </p>

      <h1 className="hero-title">{hero.h1}</h1>
      <p className="hero-supporting">{hero.supporting}</p>
    </header>
  );
}
