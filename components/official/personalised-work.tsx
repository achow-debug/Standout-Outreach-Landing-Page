import { officialCopy } from "@/lib/official-copy";

const copy = officialCopy.personalised;

type Row = (typeof copy.rows)[number];

/**
 * Two alternating feature rows after the tools strip.
 * Empty grey media boxes are reserved for later HTML embeds.
 */
export function PersonalisedWork() {
  return (
    <section
      id="personalised"
      className="relative z-10 -mt-10 scroll-mt-24 rounded-t-[2rem] bg-canvas lg:-mt-16 lg:rounded-t-[3.75rem]"
      aria-labelledby="personalised-heading"
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-16 px-6 py-20 md:gap-20 md:px-8 md:py-28 lg:gap-24 lg:py-32">
        {copy.rows.map((row, index) => (
          <FeatureRow key={row.id} row={row} index={index} />
        ))}
      </div>
    </section>
  );
}

function FeatureRow({ row, index }: { row: Row; index: number }) {
  const textFirst = index % 2 === 0;

  return (
    <div className="grid w-full grid-cols-1 items-center gap-8 md:gap-12 lg:grid-cols-2 lg:gap-16">
      <div
        className={`flex items-center justify-center ${
          textFirst ? "lg:justify-end" : "lg:order-last lg:justify-start"
        }`}
      >
        <div className="flex w-full max-w-[34rem] flex-col items-center text-center lg:items-start lg:text-left">
          <p className="m-0 text-small font-semibold tracking-[0.01em] text-ink-muted">
            {row.subheader}
          </p>
          <h2
            id={index === 0 ? "personalised-heading" : undefined}
            className="m-0 mt-3 text-h2 text-ink max-w-[20ch] md:mt-4"
          >
            {row.heading}
          </h2>
          <p className="m-0 mt-3 text-lead text-ink-muted max-w-[60ch] md:mt-4">
            {row.body}
          </p>
        </div>
      </div>
      <div
        className={`relative flex items-center justify-center ${
          textFirst ? "lg:justify-start" : "lg:order-first lg:justify-end"
        }`}
      >
        <div
          className="aspect-[5/4] w-full max-w-[520px] rounded-2xl bg-[color-mix(in_oklab,var(--color-ink)_10%,var(--color-canvas))]"
          aria-hidden
          data-embed-slot={row.id}
        />
      </div>
    </div>
  );
}
