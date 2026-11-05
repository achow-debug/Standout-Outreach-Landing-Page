type StepIndicatorProps = {
  currentStep: number;
  totalSteps?: number;
};

/**
 * Three numbered circles joined by 1px lines. Non-interactive.
 * Current: purple fill + white number. Completed: purple + check. Upcoming: grey.
 */
export function StepIndicator({
  currentStep,
  totalSteps = 3,
}: StepIndicatorProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i);

  return (
    <ol
      className="m-0 flex list-none items-center justify-center gap-0 p-0"
      aria-label={`Step ${currentStep + 1} of ${totalSteps}`}
    >
      {steps.map((step, index) => {
        const completed = step < currentStep;
        const current = step === currentStep;

        return (
          <li key={step} className="flex items-center">
            <span
              className={`flex size-10 items-center justify-center rounded-full text-sm font-semibold ${
                completed || current
                  ? "bg-brand text-white"
                  : "bg-line text-ink-muted"
              }`}
              aria-current={current ? "step" : undefined}
              aria-label={
                completed
                  ? `Step ${step + 1} completed`
                  : current
                    ? `Step ${step + 1}, current`
                    : `Step ${step + 1}`
              }
            >
              {completed ? (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              ) : (
                <span aria-hidden="true">{step + 1}</span>
              )}
            </span>
            {index < totalSteps - 1 ? (
              <span
                className={`mx-1 h-px w-8 sm:w-12 ${
                  step < currentStep ? "bg-brand" : "bg-line"
                }`}
                aria-hidden="true"
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
