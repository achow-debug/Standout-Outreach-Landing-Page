import { officialCopy } from "@/lib/official-copy";

const copy = officialCopy.noDisruption;

type ToolsTrustRowProps = {
  /** Tighter spacing when nested under a form card. */
  compact?: boolean;
  /** Landing uses larger pills; form pages stay modest. */
  size?: "sm" | "lg";
  className?: string;
};

/**
 * Connected-tools strip: name pills with logos beside labels.
 */
export function ToolsTrustRow({
  compact = false,
  size = "sm",
  className = "",
}: ToolsTrustRowProps) {
  const large = size === "lg";

  return (
    <div
      className={`flex flex-col items-center text-center ${compact ? "gap-0" : ""} ${className}`}
    >
      <ul
        className={`m-0 mx-auto flex w-full list-none flex-wrap items-center justify-center p-0 ${
          large
            ? "mt-8 max-w-5xl gap-3 md:mt-10 md:gap-3.5"
            : `max-w-3xl gap-2 md:gap-2.5 ${compact ? "mt-3 md:mt-4" : "mt-6 md:mt-8"}`
        }`}
      >
        {copy.tools.map((tool) => {
          const src =
            "src" in tool && typeof tool.src === "string" ? tool.src : undefined;
          return (
            <li key={tool.id}>
              <span
                className={`inline-flex items-center gap-2 rounded-md border border-line bg-white text-ink ${
                  large
                    ? "min-h-12 px-3.5 py-2.5 text-small md:min-h-14 md:px-4"
                    : "min-h-10 px-2.5 py-1.5 text-eyebrow md:min-h-11 md:px-3 md:text-small"
                }`}
              >
                {src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={src}
                    alt=""
                    className={`shrink-0 object-contain ${
                      large ? "size-10" : "size-7 md:size-8"
                    }`}
                  />
                ) : null}
                <span className="font-semibold whitespace-nowrap">{tool.name}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
