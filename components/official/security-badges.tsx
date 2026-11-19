import { officialCopy } from "@/lib/official-copy";

const copy = officialCopy.security;

/**
 * Security panel: centred heading, labelled badge placeholders, one link.
 * Official badge artwork drops in later — grey labelled slots for now.
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
        <ul className="m-0 mt-8 flex list-none flex-wrap items-center justify-center gap-x-5 gap-y-5 p-0 md:mt-10 lg:flex-nowrap lg:gap-x-10">
          {copy.badges.map((badge) => (
            <li key={badge.id}>
              <span
                className="flex h-20 w-[7.5rem] items-center justify-center rounded-2xl bg-[color-mix(in_oklab,var(--color-ink)_8%,white)] px-3 text-center text-small font-semibold tracking-[0.01em] text-ink-muted md:h-[5.5rem] md:w-36"
                role="img"
                aria-label={badge.label}
              >
                {badge.label}
              </span>
            </li>
          ))}
        </ul>
        <a
          href={copy.linkHref}
          className="mt-10 inline-flex min-h-11 max-w-[36ch] items-center justify-center text-center text-small text-brand underline underline-offset-4 hover:text-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand md:mt-12 md:max-w-none"
        >
          {copy.linkLabel}
        </a>
      </div>
    </section>
  );
}
