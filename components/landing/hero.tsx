import { landingCopy } from "@/lib/landing-copy";
import { siteConfig } from "@/lib/site-config";
import type { ReactNode } from "react";

const ACCENT_SPAN = "text-[var(--color-accent)] font-extrabold";

/** Wrap an exact phrase in the brand accent span; visible text unchanged. */
function accentPhrase(text: string, phrase: string): ReactNode {
  const index = text.indexOf(phrase);
  if (index === -1) return text;
  return (
    <>
      {text.slice(0, index)}
      <span className={ACCENT_SPAN}>{phrase}</span>
      {text.slice(index + phrase.length)}
    </>
  );
}

/**
 * Centred brand wordmark, audience capsule, headline and supporting copy.
 */
export function Hero() {
  const { hero } = landingCopy;
  const [standout, group] = siteConfig.businessName.split(" ");

  return (
    <header className="hero-surface flex flex-col items-center gap-5 pt-8 pb-6 md:gap-6 md:pt-6 md:pb-8">
      <p className="brand-mark text-center">
        <span className="brand-mark-name">
          {standout}{" "}
          <span className="brand-mark-accent">{group}</span>
        </span>
      </p>

      <p className="hero-audience inline-block bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full text-center">
        {hero.audience}
      </p>

      <h1 className="hero-title w-full text-center text-slate-950">
        {accentPhrase(hero.h1, "£1 million")}
      </h1>
      <p className="hero-supporting w-full text-center text-slate-800">
        {hero.supporting}
      </p>
    </header>
  );
}
