"use client";

import { useRef, type ReactNode } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/ui/Reveal";

export type StepListItem = {
  title: ReactNode;
  body: ReactNode;
};

type StepListProps = {
  steps: StepListItem[];
  className?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function StepCircle({
  index,
  active,
}: {
  index: number;
  active: boolean;
}) {
  return (
    <span
      className={cx(
        "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border border-line-strong font-display text-small font-semibold tabular-nums transition-[background-color,border-color,color] duration-(--dur-reveal) ease-(--ease-out)",
        active ? "border-brand bg-brand text-white" : "bg-paper text-ink",
      )}
      aria-hidden="true"
    >
      {index + 1}
    </span>
  );
}

function StepItem({
  step,
  index,
  isLast,
}: {
  step: StepListItem;
  index: number;
  isLast: boolean;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const reduce = useReducedMotion();
  /* Same reach margin as PathNode (§7.3) */
  const inView = useInView(ref, { once: true, margin: "0px 0px -40% 0px" });
  const active = Boolean(reduce || inView);

  return (
    <li ref={ref} className="relative flex gap-4 lg:block">
      {/*
        Mobile: circle in-flow beside the title.
        lg+: circle centred on the global path line (§6.6), optically aligned
        to the first line of the title via pt on the copy column.
      */}
      <div
        className={cx(
          "relative flex w-10 shrink-0 flex-col items-center self-stretch",
          "lg:absolute lg:top-0 lg:bottom-0 lg:left-[calc(-1*var(--path-gutter))] lg:w-10 lg:-translate-x-1/2",
        )}
      >
        <StepCircle index={index} active={active} />
        {/*
          Local connector for < lg only. On lg+ the global EnquiryPath is the
          connector; step circles sit on that line (§6.6, §7).
        */}
        {!isLast ? (
          <span
            aria-hidden="true"
            className="relative mt-0 w-px flex-1 bg-line lg:hidden"
          >
            <span
              className={cx(
                "absolute inset-0 origin-top bg-brand transition-transform duration-(--dur-reveal) ease-(--ease-out)",
                active ? "scale-y-100" : "scale-y-0",
              )}
            />
          </span>
        ) : null}
      </div>

      <Reveal index={index} className="min-w-0 flex-1 pt-2">
        <h3 className="font-display text-h3 text-ink">{step.title}</h3>
        <div className="mt-3 max-w-prose text-body text-ink-muted">
          {step.body}
        </div>
      </Reveal>
    </li>
  );
}

/**
 * Numbered step list (§6.6).
 * Circles sit on the enquiry path on lg+; connector fills as each step is reached.
 */
export function StepList({ steps, className }: StepListProps) {
  return (
    <ol className={cx("m-0 flex list-none flex-col gap-12 p-0", className)}>
      {steps.map((step, index) => (
        <StepItem
          key={index}
          step={step}
          index={index}
          isLast={index === steps.length - 1}
        />
      ))}
    </ol>
  );
}
