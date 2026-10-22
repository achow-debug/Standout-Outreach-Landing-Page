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
      <div className="page-shell flex flex-col items-center px-6 pt-16 pb-20 text-center lg:pt-20 lg:pb-28">
        <h2
          id="no-disruption-heading"
          className="m-0 max-w-[22rem] font-display text-[22px] leading-none font-medium tracking-[0.01em] text-balance text-ink lg:max-w-[36rem] lg:text-[30px]"
        >
          {copy.heading}
        </h2>
        <p className="m-0 mt-6 max-w-[38rem] text-base leading-relaxed text-ink lg:mt-8">
          {copy.body}
        </p>
        <p className="m-0 mt-10 text-sm leading-5 font-medium text-ink lg:mt-12">
          {copy.label}
        </p>
        <ul className="m-0 mt-6 grid w-full max-w-[22rem] list-none grid-cols-3 justify-items-center gap-x-4 gap-y-8 p-0 lg:mt-8 lg:flex lg:max-w-none lg:flex-wrap lg:justify-center lg:gap-x-12 lg:gap-y-8">
          {copy.tools.map((tool) => (
            <li key={tool.id} className="flex w-[6.5rem] flex-col items-center gap-2">
              <span
                aria-hidden
                className={`flex size-12 shrink-0 items-center justify-center rounded-xl font-semibold text-white shadow-[0_0_0_4px_var(--color-accent-soft)] ${
                  tool.mark.length > 1 ? "text-[11px] tracking-tight" : "text-[15px]"
                }`}
                style={{ backgroundColor: tool.color }}
              >
                {tool.mark}
              </span>
              <span className="text-xs leading-4 text-ink">{tool.name}</span>
            </li>
          ))}
        </ul>
        <p className="m-0 mt-10 flex max-w-[18rem] flex-col items-center gap-1 text-sm leading-5 text-muted lg:mt-12 lg:block lg:max-w-none">
          <span className="order-2 text-balance lg:order-none">{copy.privacy} </span>
          <span className="order-1 lg:order-none">
            {copy.icoLead}
            <a
              href={credentials.icoRegisterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline decoration-[color:var(--color-purple)] underline-offset-2 hover:opacity-80"
              style={{ color: "var(--color-purple)" }}
            >
              {copy.icoNumber}
              <span className="sr-only"> (opens the ICO register in a new tab)</span>
            </a>
            {copy.icoTail}
          </span>
        </p>
      </div>
    </section>
  );
}
