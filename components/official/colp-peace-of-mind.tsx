import { DpaRequestTrigger } from "@/components/official/dpa-request";
import { SectionLabel } from "@/components/official/section-label";
import { PathNode } from "@/components/path/PathNode";
import { SectionShell } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { compliance, sectionLabels } from "@/content/landing";

/**
 * Compliance protections. Alternates to surface-alt after paper compare.
 */
export function ColpPeaceOfMind() {
  return (
    <SectionShell
      id="colp"
      tone="surface-alt"
      pathAlign
      aria-labelledby="official-colp-heading"
    >
      <SectionLabel node={<PathNode terminal />}>
        {sectionLabels.compliance}
      </SectionLabel>
      <Reveal>
        <h2
          id="official-colp-heading"
          className="mt-4 max-w-heading font-display text-h2 text-ink"
        >
          {compliance.heading}
        </h2>
      </Reveal>
      <ul className="mt-12 m-0 grid list-none grid-cols-1 gap-12 p-0 md:grid-cols-3 lg:mt-16">
        {compliance.items.map((item, index) => (
          <li key={item.id}>
            <Reveal index={index}>
              <h3 className="m-0 font-display text-h3 text-ink">{item.title}</h3>
              <p className="m-0 mt-3 text-lead text-ink-muted">{item.body}</p>
              <p className="m-0 mt-3 text-small text-ink-subtle">{item.note}</p>
              {"button" in item ? (
                <DpaRequestTrigger className="mt-4 inline-flex min-h-11 items-center font-semibold text-brand underline-offset-4 hover:underline">
                  {item.button}
                </DpaRequestTrigger>
              ) : null}
            </Reveal>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
