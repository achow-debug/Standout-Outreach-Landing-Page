"use client";

import { useKeyboardOffset } from "@/components/forms/useKeyboardOffset";

type ActionBarProps = {
  step: number;
  primaryLabel: string;
  submitting?: boolean;
  submitError?: string | null;
  onBack: () => void;
  formErrorEmail?: string;
};

/**
 * Back + Continue/submit. Fixed at the bottom below lg; static inside the card on lg+.
 * Translates up by the iOS keyboard overlap. Stays inside the <form>.
 */
export function ActionBar({
  step,
  primaryLabel,
  submitting = false,
  submitError = null,
  onBack,
  formErrorEmail = "achow@standoutgroup.net",
}: ActionBarProps) {
  const offset = useKeyboardOffset();
  const showBack = step > 0;
  const label = submitting ? "Sending…" : primaryLabel;

  return (
    <div
      className="form-action-bar fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper px-4 pt-3 lg:static lg:z-auto lg:mt-6 lg:border-0 lg:bg-transparent lg:px-0 lg:pt-0"
      style={{
        transform: offset > 0 ? `translateY(-${offset}px)` : undefined,
        paddingBottom:
          offset > 0
            ? "0.75rem"
            : "max(0.75rem, env(safe-area-inset-bottom))",
      }}
    >
      {submitError ? (
        <p
          className="mb-3 text-sm font-semibold text-[var(--color-error)]"
          role="alert"
        >
          We couldn&apos;t send your details. Try again, or email{" "}
          <a
            href={`mailto:${formErrorEmail}`}
            className="underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {formErrorEmail}
          </a>
          .
        </p>
      ) : null}

      <div className="flex items-stretch gap-3">
        {showBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label={`Back to step ${step}`}
            className="inline-flex size-12 shrink-0 items-center justify-center gap-1.5 rounded-xl border border-brand bg-transparent text-brand transition-colors hover:bg-brand-tint focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-auto sm:min-w-[5.5rem] sm:px-4"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            <span className="hidden text-button font-semibold sm:inline">
              Back
            </span>
          </button>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary min-h-14 flex-1 rounded-xl px-4 text-button font-semibold leading-tight text-balance disabled:cursor-wait"
        >
          {label}
        </button>
      </div>
    </div>
  );
}
