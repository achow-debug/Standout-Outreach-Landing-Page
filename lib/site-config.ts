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
   * Identity line in the hero — who is speaking.
   * Staffordshire trading history is not legal-sector proof; keep it in the footer.
   */
  proofLine: "A five-minute breakdown by Alex Chow, Standout Group",
  proofLineIsPlaceholder: false,
  /**
   * Optional delivery timing for confirmation email/page.
   * Leave null until the business can consistently meet a stated period.
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
    /** Approved lawful basis — leave null until business confirms */
    lawfulBasis: null as string | null,
    /** Approved retention period — leave null until business confirms */
    retentionPeriod: null as string | null,
    /**
     * Approved processor list for the privacy notice.
     * Leave empty until the live processor set is confirmed.
     */
    processors: [] as string[],
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
