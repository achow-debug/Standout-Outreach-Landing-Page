type FaqItem = {
  question: string;
  answer: string;
};

type BeforeYouBookProps = {
  items: FaqItem[];
};

/**
 * FAQ accordion under the form. Native details/summary with shared name
 * so only one opens at a time in supporting browsers.
 */
export function BeforeYouBook({ items }: BeforeYouBookProps) {
  return (
    <section
      className="rounded-t-[2rem] bg-surface lg:rounded-t-[3.75rem]"
      aria-labelledby="before-you-book-heading"
    >
      <div className="mx-auto max-w-3xl px-6 py-12 md:px-8 md:py-16">
        <h2
          id="before-you-book-heading"
          className="text-center text-h2 text-ink"
        >
          Before you book
        </h2>

        <div className="mt-8 flex flex-col gap-3">
          {items.map((item) => {
            const answer = item.answer.trim() || "Answer coming soon.";
            return (
              <details
                key={item.question}
                name="before-you-book"
                className="group rounded-xl border border-line bg-paper open:bg-surface"
              >
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold text-ink marker:content-none [&::-webkit-details-marker]:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
                  <span>{item.question}</span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="shrink-0 text-ink-muted transition-transform duration-150 group-open:rotate-180 motion-reduce:transition-none"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </summary>
                <div className="border-t border-line px-5 py-4 text-body text-ink-muted">
                  <p className="m-0">{answer}</p>
                </div>
              </details>
            );
          })}
        </div>
      </div>
    </section>
  );
}
