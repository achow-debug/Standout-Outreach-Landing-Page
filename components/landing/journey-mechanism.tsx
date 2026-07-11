import { ExampleFinding } from "@/components/landing/example-finding";
import { landingCopy } from "@/lib/landing-copy";

/**
 * Compact two-sided journey: client question · stage · firm reality.
 * One composed strip — not a multi-screen process diagram.
 */
export function JourneyMechanism() {
  const { mechanism } = landingCopy;
  const { columnHeaders } = mechanism;

  return (
    <section
      aria-labelledby="mechanism-heading"
      className="mechanism-surface"
    >
      <div className="mechanism-inner">
        <h2 id="mechanism-heading" className="section-heading">
          {mechanism.heading}
        </h2>
        <p className="section-supporting">{mechanism.supporting}</p>

        <div className="journey-table-wrap">
          <span className="handoff-line handoff-line--mechanism" aria-hidden="true" />
          <table className="journey-table">
            <caption className="sr-only">
              Enquiry journey stages from prospective client and firm perspectives
            </caption>
            <thead>
              <tr>
                <th scope="col">{columnHeaders.client}</th>
                <th scope="col">{columnHeaders.stage}</th>
                <th scope="col">{columnHeaders.firm}</th>
              </tr>
            </thead>
            <tbody>
              {mechanism.stages.map((stage) => {
                const isHandoff =
                  "emphasize" in stage && stage.emphasize === true;

                return (
                  <tr
                    key={stage.id}
                    className={isHandoff ? "journey-row--handoff" : undefined}
                  >
                    <td data-label={columnHeaders.client}>
                      “{stage.clientSignal}”
                    </td>
                    <td data-label={columnHeaders.stage}>
                      <span className="journey-stage-name">{stage.label}</span>
                    </td>
                    <td data-label={columnHeaders.firm}>{stage.firmSignal}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="mechanism-deliverable">{mechanism.deliverable}</p>

        <ExampleFinding
          label={mechanism.exampleFindingLabel}
          finding={mechanism.exampleFinding}
        />
      </div>
    </section>
  );
}
