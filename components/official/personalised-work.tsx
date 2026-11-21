import { Eyebrow } from "@/components/ui/Eyebrow";
import { Placeholder } from "@/components/ui/Placeholder";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { officialCopy } from "@/lib/official-copy";

const copy = officialCopy.personalised;

type Row = (typeof copy.rows)[number];

/**
 * Feature rows (§10.6). Full-bleed surface-alt, no rounded corners.
 * Path nodes are reserved for How it works only.
 */
export function PersonalisedWork() {
  return (
    <section
      id="personalised"
      className="section-y bg-surface-alt"
      aria-labelledby="personalised-heading"
    >
      <Container>
        <div className="flex flex-col gap-16 lg:gap-24 lg:pl-(--path-gutter)">
          {copy.rows.map((row, index) => (
            <FeatureRow key={row.id} row={row} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function FeatureRow({ row, index }: { row: Row; index: number }) {
  const textFirst = index % 2 === 0;

  return (
    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
      <Reveal
        index={0}
        className={
          textFirst
            ? "lg:col-span-6"
            : "lg:col-span-6 lg:col-start-7 lg:row-start-1"
        }
      >
        <Eyebrow>{row.subheader}</Eyebrow>
        <h2
          id={index === 0 ? "personalised-heading" : undefined}
          className="mt-4 max-w-heading font-display text-h2 text-ink"
        >
          {row.heading}
        </h2>
        <p className="mt-5 max-w-lead text-lead text-ink-muted lg:mt-6">
          {row.body}
        </p>
      </Reveal>

      <Reveal
        index={1}
        className={
          textFirst
            ? "flex items-center lg:col-span-6"
            : "flex items-center lg:col-span-6 lg:col-start-1 lg:row-start-1"
        }
      >
        <Placeholder slot={row.id} />
      </Reveal>
    </div>
  );
}
