"use client";

import Image from "next/image";
import { useBooking } from "@/components/official/booking-provider";
import { officialCopy } from "@/lib/official-copy";
import { siteConfig } from "@/lib/site-config";

/**
 * Full-bleed navy close on mobile. After a booking, this section
 * crossfades to the thank-you state in place.
 */
export function OfficialFinalCta() {
  const {
    eyebrow,
    heading,
    headingAccent,
    buttonLabel,
    nextLabel,
    nextSteps,
  } = officialCopy.finalCta;
  const thankYou = officialCopy.thankYou;
  const { portraitSrc, portraitAlt } = officialCopy.founder;
  const { openBooking, booked } = useBooking();

  return (
    <section
      className="official-apply"
      id="book"
      aria-labelledby="official-apply-heading"
      tabIndex={-1}
    >
      <div className="page-shell official-apply-inner">
        <div className={booked ? "official-apply-panel is-thanks" : "official-apply-panel"}>
          {booked ? (
            <div className="official-apply-thanks">
              <div className="official-apply-thanks-frame">
                <Image
                  src={portraitSrc}
                  alt={portraitAlt}
                  width={400}
                  height={400}
                  className="official-apply-thanks-photo"
                />
              </div>
              <h2 id="official-apply-heading" className="official-apply-heading t-h2">
                {thankYou.heading}
              </h2>
              <ul className="official-apply-steps">
                {thankYou.steps.map((step) => (
                  <li key={step} className="t-body">
                    {step}
                  </li>
                ))}
              </ul>
              <div className="official-apply-contacts">
                <a href={`mailto:${siteConfig.contactEmail}`}>
                  Email
                  <span>{siteConfig.contactEmail}</span>
                </a>
                <a
                  href={siteConfig.contactWhatsAppHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <>
              <p className="official-apply-eyebrow t-kicker t-kicker--on-dark">
                {eyebrow}
              </p>
              <h2 id="official-apply-heading" className="official-apply-heading t-h2">
                <span className="official-apply-heading-line official-apply-heading-line--muted">
                  {heading}
                </span>{" "}
                <span className="official-apply-heading-line">{headingAccent}</span>
              </h2>
              <div className="official-apply-next">
                <p className="official-apply-next-label t-kicker t-kicker--on-dark">
                  {nextLabel}
                </p>
                <ol className="official-apply-steps official-apply-steps--row">
                  {nextSteps.map((step, index) => (
                    <li key={step}>
                      <span className="official-apply-step-num" aria-hidden="true">
                        {index + 1}
                      </span>
                      <span className="t-body">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <button
                type="button"
                className="btn btn-primary btn-on-dark btn-cta official-apply-cta"
                data-booking-cta=""
                onClick={() => openBooking("final")}
              >
                {buttonLabel}
                <span className="btn-cta-arrow" aria-hidden="true">
                  →
                </span>
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
