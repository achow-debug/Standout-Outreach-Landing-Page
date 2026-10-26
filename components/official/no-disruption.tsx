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
      <div className="page-shell flex flex-col items-center px-6 py-20 text-center md:px-8 md:py-32">
        <h2 id="no-disruption-heading" className="text-h2 text-ink mx-auto text-center">
          No complicated software. <br className="hidden sm:inline" />
          No change to how your team works.
        </h2>
        <p className="mt-5 max-w-[60ch] mx-auto text-center text-lead font-semibold text-ink">
          {copy.body}
        </p>
        <p className="mt-12 text-small font-semibold text-ink-muted md:mt-16">{copy.label}</p>
        <ul className="m-0 mt-8 grid w-full list-none grid-cols-3 gap-y-8 p-0 md:grid-cols-6">
          {copy.tools.map((tool) => (
            <li key={tool.id} className="flex flex-col items-center">
              <img
                src={tool.src}
                alt=""
                className="h-10 w-auto max-w-full object-contain md:h-12"
              />
              <span className="text-small text-ink-muted mt-2">{tool.name}</span>
            </li>
          ))}
        </ul>
        <p className="mt-12 max-w-[60ch] text-small text-ink-muted md:mt-16">
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
