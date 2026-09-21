import { officialCopy, type OfficialProofItem } from "@/lib/official-copy";
import type { ReactNode } from "react";

const ACCENT_SPAN = "text-[var(--color-accent)] font-extrabold";

function accentPhrase(text: string, phrase?: string): ReactNode {
  if (!phrase) return text;
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

function ProofItem({ item }: { item: OfficialProofItem }) {
  return (
    <div className="official-proof-item">
      <p className="official-proof-figure">{item.figure}</p>
      <p className="official-proof-body">
        {accentPhrase(item.body, item.accentPhrase)}
      </p>
    </div>
  );
}

/**
 * Light four-up proof strip. Not the locked three-card trust module.
 */
export function ProofStrip() {
  const { eyebrow, items } = officialCopy.proof;

  return (
    <section className="official-proof" aria-label={eyebrow}>
      <p className="official-proof-eyebrow">{eyebrow}</p>
      <div className="official-proof-grid">
        {items.map((item) => (
          <ProofItem key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
