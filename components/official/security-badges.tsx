import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { officialCopy } from "@/lib/official-copy";

const copy = officialCopy.security;

/**
 * Security panel. Paper after surface-alt features.
 */
export function SecurityBadges() {
  return (
    <section
      id="security"
      className="section-y bg-paper"
      aria-labelledby="security-heading"
    >
      <Container className="flex flex-col items-center text-center">
        <Reveal>
          <h2
            id="security-heading"
            className="font-display text-h2 text-ink"
          >
            {copy.heading}
          </h2>
        </Reveal>
        <ul className="m-0 mt-12 flex list-none flex-wrap items-center justify-center gap-4 p-0 lg:mt-16">
          {copy.badges.map((badge, index) => {
            const src =
              "src" in badge && typeof badge.src === "string"
                ? badge.src
                : undefined;
            return (
              <li key={badge.id}>
                <Reveal index={index}>
                  {src ? (
                    <Image
                      src={src}
                      alt={badge.label}
                      width={128}
                      height={96}
                      sizes="(min-width: 768px) 128px, 112px"
                      className="h-20 w-28 object-contain md:h-24 md:w-32"
                    />
                  ) : (
                    <span className="inline-flex h-20 w-28 items-center justify-center text-small font-semibold text-ink-muted md:h-24 md:w-32">
                      {badge.label}
                    </span>
                  )}
                </Reveal>
              </li>
            );
          })}
        </ul>
        <a
          href={copy.linkHref}
          className="mt-10 inline-flex min-h-11 items-center justify-center text-small font-semibold text-brand underline-offset-4 hover:underline"
        >
          {copy.linkLabel}
        </a>
      </Container>
    </section>
  );
}
