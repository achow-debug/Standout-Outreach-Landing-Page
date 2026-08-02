/**
 * Editable site configuration for the Legal Enquiry Review landing page.
 * Keep business identity, proof, assets and optional delivery timing here.
 */

export const siteConfig = {
  businessName: "Standout Group",
  contactEmail: "achow@standoutgroup.net",
  productionDomain: "https://standoutgroup.net",
  /** Canonical route for this dedicated outreach microsite */
  canonicalPath: "/",
  /**
   * Legacy proof line retained for audit scripts; methodology copy on the page
   * lives in landingCopy.reassurance.methodology.
   */
  proofLine:
    "Evidence before recommendations · No replacement CRM required",
  proofLineIsPlaceholder: false,
  /**
   * Optional extra timing line for confirmation email/page.
   * Leave null while the default “within one business day” SLA in
   * landingCopy.confirmation / review-request-emails is enough.
   * If set, it must not contradict that one-business-day response promise
   * (e.g. prefer clarifying detail, not a longer conflicting period).
   */
  reviewDeliveryTiming: null as string | null,
  video: {
    id: "legal-enquiry-review",
    version: "1.0",
    mp4Path: "/video/legal-enquiry-review.mp4",
    captionsPath: "/video/legal-enquiry-review-captions.vtt",
    posterPath: "/video/legal-enquiry-review-poster.webp",
    durationLabel: "5-minute",
  },
  privacy: {
    controllerName: "Standout Group",
    controllerEmail: "achow@standoutgroup.net",
    /**
     * Aligned with the confirmed Standout Group privacy notice (trading-name
     * controller path until the formal registered entity is published).
     */
    lawfulBasis:
      "Pilot requests and related correspondence are processed because they are necessary to take steps at your request before a potential contract, and to pursue our legitimate interest in reviewing suitability for the free 30-day pilot and communicating about that request in a way that does not override your rights.",
    retentionPeriod:
      "Pilot request records and related correspondence are kept while needed to assess eligibility for the free 30-day pilot, communicate about the request, handle follow-up questions and meet legal obligations, then deleted or anonymised. Fixed calendar retention periods will be published here if adopted.",
    /**
     * Live processor set for this microsite (same stack as the main Standout Group site).
     */
    processors: [
      "Hosting (Vercel)",
      "Workflow automation (n8n)",
      "Lead storage (Google Sheets)",
      "Transactional email (Resend)",
      "Analytics (Plausible Analytics)",
    ],
  },
  /**
   * Legal / trading identity for the footer.
   * Leave null fields until the operating entity details are confirmed.
   */
  legalEntity: {
    tradingName: "Standout Group",
    registeredName: null as string | null,
    companyNumber: null as string | null,
    registeredAddress: null as string | null,
  },
};

export type SiteConfig = typeof siteConfig;

export function getLegalIdentityLine(): string | null {
  const { legalEntity, businessName } = siteConfig;
  const parts = [
    legalEntity.registeredName ?? legalEntity.tradingName ?? businessName,
    legalEntity.companyNumber
      ? `Company No. ${legalEntity.companyNumber}`
      : null,
    legalEntity.registeredAddress,
  ].filter(Boolean);

  if (
    !legalEntity.registeredName &&
    !legalEntity.companyNumber &&
    !legalEntity.registeredAddress
  ) {
    // Do not expose unfinished internal language to prospects.
    return null;
  }

  return parts.join(" · ");
}
