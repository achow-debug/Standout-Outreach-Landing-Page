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
          className="m-0 text-center text-h2 text-ink max-w-[22ch]"
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
                className={`${badge.className} object-contain`}
              />
            </li>
          ))}
        </ul>
        <a
          href={copy.linkHref}
          className="mt-8 inline-flex min-h-11 items-center text-small text-brand underline underline-offset-4 hover:text-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          {copy.linkLabel}
        </a>
      </div>
    </section>
  );
}
