/**
 * Editable site configuration for the Legal Enquiry Review landing page.
 * Keep business identity, proof, assets and optional delivery timing here.
 */

export const siteConfig = {
  businessName: "Standout Group",
  contactEmail: "achow@standoutgroup.net",
  contactPhone: "07599 569931",
  contactPhoneHref: "tel:+447599569931",
  contactWhatsAppHref: "https://wa.me/447599569931",
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
   * Leave null by default — the page does not promise a fixed response SLA.
   * If set, keep it honest and non-committal (e.g. clarifying detail only).
   */
  reviewDeliveryTiming: null as string | null,
  video: {
    id: "legal-enquiry-review",
    version: "1.0",
    mp4Path: "/video/breakdown.mp4",
    captionsPath: "/video/legal-enquiry-review-captions.vtt",
    posterPath: "/video/poster.jpg",
    durationLabel: "5-minute",
  },
  privacy: {
    controllerName: "Standout Group",
    controllerEmail: "achow@standoutgroup.net",
    /**
     * Aligned with the 30 August 2026 Privacy Policy on /privacy.
     */
    lawfulBasis:
      "Legitimate interests — responding to an enquiry audit request the visitor has actively initiated. Consent — for any follow-up communications beyond delivering the audit itself, which is optional and can be withdrawn at any time.",
    retentionPeriod:
      "We retain enquiry audit request data only for as long as necessary to deliver the audit and provide any related follow-up, after which it is deleted.",
    processors: [
      "Workflow automation (n8n)",
      "Lead storage (Google Sheets)",
      "Hosting (Vercel)",
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
