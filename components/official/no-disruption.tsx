import { credentials } from "@/content/landing";
import { officialCopy } from "@/lib/official-copy";

const copy = officialCopy.noDisruption;

/**
 * Quiet proof under the three showcase cards.
 * Fyxer’s connected-tools strip: white panel, centred heading, logo row.
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
        <h2 id="no-disruption-heading" className="text-h2 text-ink mx-auto text-center">
          No complicated software. <br className="hidden sm:inline" />
          No change to how your team works.
        </h2>
        <p className="mt-3 max-w-[60ch] mx-auto text-center text-lead text-ink md:mt-4">
          {copy.body}
        </p>
        <p className="mt-8 text-small font-semibold text-ink-muted md:mt-10">{copy.label}</p>
        <ul className="m-0 mx-auto mt-3 flex w-full max-w-xl list-none flex-nowrap items-center justify-evenly gap-3 p-0 md:mt-4 md:max-w-2xl md:gap-6">
          {copy.tools.map((tool) => (
            <li key={tool.id} className="flex min-w-0 flex-1 items-center justify-center">
              <span className="flex size-7 items-center justify-center sm:size-8 md:size-10">
                <img
                  src={tool.src}
                  alt={tool.name}
                  className="max-h-full max-w-full object-contain"
                />
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-10 max-w-[60ch] text-small text-ink-muted md:mt-12">
          {copy.privacy}
          <a
            href={credentials.icoRegisterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand underline underline-offset-4 hover:text-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {copy.icoNumber}
            <span className="sr-only"> (opens the ICO register in a new tab)</span>
          </a>
          {copy.icoTail}
        </p>
      </div>
    </section>
  );
}
