import { credentials } from "@/content/landing";
import { officialCopy } from "@/lib/official-copy";

const copy = officialCopy.noDisruption;

type ToolsTrustRowProps = {
  /** Tighter spacing when nested under a form card. */
  compact?: boolean;
  className?: string;
};

/**
 * "Delivers into the tools…" label, six tool logos, and the ICO line.
 * Shared by the landing "No complicated software" section and form pages.
 */
export function ToolsTrustRow({
  compact = false,
  className = "",
}: ToolsTrustRowProps) {
  return (
    <div
      className={`flex flex-col items-center text-center ${compact ? "gap-0" : ""} ${className}`}
    >
      <p
        className={`text-small font-semibold text-ink-muted ${compact ? "" : "mt-8 md:mt-10"}`}
      >
        {copy.label}
      </p>
      <ul
        className={`m-0 mx-auto flex w-full max-w-xl list-none flex-nowrap items-center justify-evenly gap-3 p-0 md:max-w-2xl md:gap-6 ${compact ? "mt-3 md:mt-4" : "mt-3 md:mt-4"}`}
      >
        {copy.tools.map((tool) => (
          <li
            key={tool.id}
            className="flex min-w-0 flex-1 items-center justify-center"
          >
            <span className="flex size-7 items-center justify-center sm:size-8 md:size-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={tool.src}
                alt={tool.name}
                className="max-h-full max-w-full object-contain"
              />
            </span>
          </li>
        ))}
      </ul>
      <p
        className={`max-w-[60ch] text-small text-ink-muted ${compact ? "mt-6 md:mt-8" : "mt-10 md:mt-12"}`}
      >
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
  );
}
