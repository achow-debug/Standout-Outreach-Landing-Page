import { Container } from "@/components/ui/Container";
import { sources } from "@/content/sources";

function Citation({
  citation,
  italicise,
}: {
  citation: string;
  italicise: string;
}) {
  const index = citation.indexOf(italicise);
  if (index < 0) return citation;

  return (
    <>
      {citation.slice(0, index)}
      <em>{italicise}</em>
      {citation.slice(index + italicise.length)}
    </>
  );
}

/**
 * Sources band after the footer. Closed by default.
 */
export function SourcesSection() {
  return (
    <div className="border-t border-line bg-paper">
      <Container className="py-8">
        <details id={sources.sectionId} className="group">
          <summary className="cursor-pointer list-none font-sans text-small font-semibold text-ink-muted underline-offset-4 hover:text-ink hover:underline [&::-webkit-details-marker]:hidden">
            {sources.summaryLabel}
          </summary>
          <div className="mt-8 flex flex-col gap-10">
            {sources.items.map((item) => (
              <article key={item.id}>
                <h3 className="m-0 font-display text-h3 text-ink">{item.credit}</h3>
                <p className="m-0 mt-3 max-w-prose text-body text-ink-muted">
                  <Citation citation={item.citation} italicise={item.italicise} />
                </p>
                <p className="m-0 mt-3 max-w-prose text-body text-ink-muted">
                  {item.summary}
                </p>
                <a
                  className="mt-3 inline-flex min-h-11 items-center font-semibold text-brand underline-offset-4 hover:underline"
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {sources.openSource}
                </a>
              </article>
            ))}

            <article>
              <h3 className="m-0 font-display text-h3 text-ink">
                {sources.mysteryShop.title}
              </h3>
              <p className="m-0 mt-3 max-w-prose text-body text-ink-muted">
                <strong>{sources.mysteryShop.leadBold}</strong>
              </p>
              {sources.mysteryShop.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="m-0 mt-3 max-w-prose text-body text-ink-muted"
                >
                  {paragraph}
                </p>
              ))}
            </article>

            <article>
              <h3 className="m-0 font-display text-h3 text-ink">
                {sources.firstContactTitle}
              </h3>
              <p className="m-0 mt-3 max-w-prose text-body text-ink-muted">
                {sources.firstContact}
              </p>
            </article>

            <article>
              <h3 className="m-0 font-display text-h3 text-ink">
                {sources.nineWeekTitle}
              </h3>
              <p className="m-0 mt-3 max-w-prose text-body text-ink-muted">
                {sources.nineWeek.map((part) =>
                  "strong" in part && part.strong ? (
                    <strong key={part.text}>{part.text}</strong>
                  ) : (
                    <span key={part.text}>{part.text}</span>
                  ),
                )}
              </p>
            </article>
          </div>
        </details>
      </Container>
    </div>
  );
}
