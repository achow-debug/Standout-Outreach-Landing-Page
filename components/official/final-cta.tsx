"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { setFinalCtaInView } from "@/hooks/use-final-cta-in-view";
import { ENQUIRY_CHECK_HREF } from "@/lib/cta";
import { officialCopy } from "@/lib/official-copy";

/**
 * Final CTA. Dark plum card with three steps and one enquiry-review button.
 */
export function OfficialFinalCta() {
  const { steps, primaryCta } = officialCopy.finalCta;
  const { headingLead, headingAccent } = officialCopy.hero;
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setFinalCtaInView(Boolean(entry?.isIntersecting));
      },
      { threshold: 0.25 },
    );

    observer.observe(section);
    return () => {
      observer.disconnect();
      setFinalCtaInView(false);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="book"
      aria-labelledby="final-cta-heading"
      className="scroll-mt-(--nav-offset) bg-paper py-16 lg:py-24"
    >
      <Container>
        <div className="rounded-lg bg-night px-6 py-14 text-night-text theme-night md:px-10 lg:px-16 lg:py-24">
          <h2
            id="final-cta-heading"
            className="m-0 max-w-[22ch] font-display text-display text-night-text"
          >
            {headingLead}{" "}
            <span className="text-night-accent">{headingAccent}</span>
          </h2>

          <ol className="m-0 mt-12 flex list-none flex-col gap-10 p-0 text-left lg:mt-16 lg:grid lg:grid-cols-3 lg:grid-rows-[auto_auto_1fr] lg:gap-x-12 lg:gap-y-4">
            {steps.map((step, index) => {
              const isLast = index === steps.length - 1;
              return (
                <li
                  key={step.title}
                  className="relative grid grid-cols-[2.5rem_1fr] gap-x-4 lg:grid lg:grid-cols-1 lg:row-span-3 lg:grid-rows-subgrid lg:gap-x-0 lg:after:absolute lg:after:top-5 lg:after:left-10 lg:after:h-px lg:after:w-[calc(100%+0.5rem)] lg:after:bg-night-accent/25 lg:last:after:hidden"
                >
                  {!isLast ? (
                    <span
                      aria-hidden="true"
                      className="absolute top-10 bottom-[-2.5rem] left-5 z-0 w-px -translate-x-1/2 bg-night-accent/25 lg:hidden"
                    />
                  ) : null}
                  <span
                    aria-hidden="true"
                    className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border border-night-accent/40 font-sans text-base font-semibold text-night-accent"
                  >
                    {index + 1}
                  </span>
                  <div className="min-w-0 lg:contents">
                    <h3 className="m-0 font-display text-[1.25rem] font-semibold leading-[1.2] tracking-[-0.01em] text-paper lg:text-2xl">
                      {step.title}
                    </h3>
                    <p className="m-0 mt-2 font-sans text-[1.0625rem] leading-[1.6] text-paper/75 lg:mt-0 lg:max-w-[38ch] lg:text-lg">
                      {step.body}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="mt-12 flex w-full justify-center lg:mt-16">
            <Button
              variant="inverse"
              size="lg"
              href={ENQUIRY_CHECK_HREF}
              data-cta="measure-enquiries"
              className="w-full lg:w-auto"
            >
              {primaryCta}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
