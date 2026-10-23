import Image from "next/image";
import { officialCopy } from "@/lib/official-copy";

const copy = officialCopy.security;

/**
 * Fyxer security panel: white, centred heading, badge row, one link.
 * Purple is only the link. Badge artwork stays in its official colours.
 */
export function SecurityBadges() {
  return (
    <section
      id="security"
      className="relative z-10 -mt-10 scroll-mt-24 rounded-t-[2rem] bg-white lg:-mt-16 lg:rounded-t-[3.75rem]"
      aria-labelledby="security-heading"
    >
      <div className="mx-auto flex w-full max-w-[1024px] flex-col items-center px-4 py-16 lg:px-12 lg:py-24">
        <h2
          id="security-heading"
          className="m-0 text-center font-display text-[22.4px] leading-none font-medium tracking-[0.01em] text-balance text-ink lg:text-[35.2px]"
        >
          {copy.heading}
        </h2>
        <ul className="m-0 mt-8 flex list-none flex-wrap items-center justify-center gap-x-4 gap-y-3 p-0 lg:gap-x-8 lg:gap-y-4">
          {copy.badges.map((badge) => (
            <li key={badge.id}>
              <Image
                src={badge.src}
                alt={badge.alt}
                width={badge.width}
                height={badge.height}
                unoptimized
                className="h-[68px] w-auto object-contain lg:h-[110px]"
              />
            </li>
          ))}
        </ul>
        <a
          href={copy.linkHref}
          className="group mt-2 inline-flex items-center justify-center gap-1 text-center text-xs leading-4 underline transition-colors duration-150 hover:opacity-80 lg:text-sm lg:leading-5"
          style={{ color: "var(--color-purple)" }}
        >
          <span>{copy.linkLabel}</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            aria-hidden="true"
            className="size-4 shrink-0 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none"
          >
            <path
              d="M3 8h10M9 4l4 4-4 4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </section>
  );
}
