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
      <div className="mx-auto flex w-full max-w-[1024px] flex-col items-center px-4 pt-14 pb-16 lg:px-12 lg:pt-20 lg:pb-24">
        <h2
          id="security-heading"
          className="m-0 text-center text-h2 text-ink max-w-[22ch]"
        >
          {copy.heading}
        </h2>
        <ul className="m-0 mt-8 flex list-none flex-wrap items-center justify-center gap-x-6 gap-y-5 p-0 md:mt-10 lg:flex-nowrap lg:gap-x-12">
          {copy.badges.map((badge) => (
            <li key={badge.id} className="flex items-center justify-center">
              <Image
                src={badge.src}
                alt={badge.alt}
                width={badge.width}
                height={badge.height}
                unoptimized
                className="h-10 w-auto object-contain lg:h-16"
              />
            </li>
          ))}
        </ul>
        <a
          href={copy.linkHref}
          className="mt-10 inline-flex min-h-11 items-center text-small text-brand underline underline-offset-4 hover:text-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand md:mt-12"
        >
          {copy.linkLabel}
        </a>
      </div>
    </section>
  );
}
