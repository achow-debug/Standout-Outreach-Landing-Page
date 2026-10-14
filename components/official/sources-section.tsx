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
 * Closed by default. "See all sources & methodology" sets `open` and scrolls here.
 */
export function SourcesSection() {
  return (
    <div className="official-sources-band">
      <div className="page-shell official-sources-inner">
        <details id={sources.sectionId} className="official-sources">
          <summary className="official-sources-summary">{sources.summaryLabel}</summary>
          <div className="official-sources-list">
            {sources.items.map((item) => (
              <article key={item.id} className="official-sources-item">
                <h3 className="official-sources-heading t-h3">{item.credit}</h3>
                <p className="official-sources-copy t-body">
                  <Citation citation={item.citation} italicise={item.italicise} />
                </p>
                <p className="official-sources-copy t-body">{item.summary}</p>
                <a
                  className="official-sources-link"
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {sources.openSource}
                </a>
              </article>
            ))}

            <article className="official-sources-item">
              <h3 className="official-sources-heading t-h3">{sources.mysteryShop.title}</h3>
              <p className="official-sources-copy t-body">
                <strong>{sources.mysteryShop.leadBold}</strong>
              </p>
              {sources.mysteryShop.paragraphs.map((paragraph) => (
                <p key={paragraph} className="official-sources-copy t-body">
                  {paragraph}
                </p>
              ))}
            </article>

            <article className="official-sources-item">
              <h3 className="official-sources-heading t-h3">{sources.firstContactTitle}</h3>
              <p className="official-sources-copy t-body">{sources.firstContact}</p>
            </article>

            <article className="official-sources-item">
              <h3 className="official-sources-heading t-h3">{sources.nineWeekTitle}</h3>
              <p className="official-sources-copy t-body">
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
      </div>
    </div>
  );
}
