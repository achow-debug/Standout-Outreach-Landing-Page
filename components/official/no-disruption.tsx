import { ToolsTrustRow } from "@/components/forms/ToolsTrustRow";
import { officialCopy } from "@/lib/official-copy";

const copy = officialCopy.noDisruption;

/**
 * Quiet proof under the three showcase cards.
 * Fyxer's connected-tools strip: white panel, centred heading, logo row.
 * The heading stays near-black. Purple is only the verifiable ICO number.
 */
export function NoDisruption() {
  return (
    <section
      id="no-disruption"
      className="relative z-10 -mt-10 scroll-mt-24 rounded-t-[2rem] bg-surface lg:-mt-16 lg:rounded-t-[3.75rem]"
      aria-labelledby="no-disruption-heading"
    >
      <div className="page-shell flex flex-col items-center px-6 pt-10 pb-[4.5rem] text-center md:px-8 md:pt-14 md:pb-28 lg:pt-16 lg:pb-32">
        <h2
          id="no-disruption-heading"
          className="text-h2 text-ink mx-auto text-center"
        >
          No complicated software. <br className="hidden sm:inline" />
          No change to how your team works.
        </h2>
        <p className="mt-3 max-w-[60ch] mx-auto text-center text-lead text-ink md:mt-4">
          {copy.body}
        </p>
        <ToolsTrustRow />
      </div>
    </section>
  );
}
