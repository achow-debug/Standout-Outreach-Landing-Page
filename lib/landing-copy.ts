/**
 * Centralised copy for the Legal Enquiry Review landing page.
 */

export const AREA_OF_LAW_OPTIONS = [
  { value: "personal_injury", label: "Personal Injury" },
  { value: "family_divorce", label: "Family / Divorce" },
  { value: "immigration", label: "Immigration" },
  { value: "conveyancing_property", label: "Conveyancing / Property" },
  { value: "wills_trusts_probate", label: "Wills, Trusts & Probate" },
  { value: "employment", label: "Employment" },
  { value: "criminal", label: "Criminal" },
  { value: "commercial_corporate", label: "Commercial / Corporate" },
  { value: "other_multiple", label: "Other / Multiple" },
] as const;

export type AreaOfLawValue = (typeof AREA_OF_LAW_OPTIONS)[number]["value"];

export const landingCopy = {
  meta: {
    title: "Legal Enquiry Review | Standout Group",
    description:
      "Poor enquiry handling can cost UK law firms over £1 million a year in lost revenue. Watch how Standout Group’s review works, then claim your free strategy call.",
  },
  hero: {
    audience: "Exclusively for UK Law Firms",
    h1: "We analysed 100+ UK law firms. 70% are leaking money the exact same way. See it in 90 seconds.",
    supporting:
      "Most firms assume this isn't happening at theirs. That's exactly what the other 70% assumed too.",
    bridge: "Check for yourself →",
  },
  video: {
    sectionLabel: "Breakdown video",
    playLabel: "Play the full breakdown",
    fallbackMessage:
      "This video could not be played in your browser. Open the MP4 directly to watch the breakdown.",
    directLinkLabel: "Open the video file directly",
    /** Shown only when the MP4 is missing in non-production. */
    posterTitle: "Breakdown video unavailable",
    posterSubtitle:
      "Add the MP4 and poster assets to public/video to preview the player.",
  },
  reassurance: {
    items: [
      {
        id: "data",
        icon: "chart" as const,
        title: "Live-Tracked",
        body: "Every result is measured and shared with you as it happens- nothing to just take our word for.",
      },
      {
        id: "response-time",
        icon: "lock" as const,
        title: "5-Minute Follow-Up",
        body: "Enquiries followed up within 5 minutes",
      },
      {
        id: "compliance",
        icon: "shield" as const,
        title: "SRA Compliant",
        body: "Built to SRA Transparency Rules requirements from day one",
      },
    ],
    /** Risk-reversal explanation for the free 30-day pilot. */
    methodology: {
      heading: "",
      body: [] as string[],
    },
  },
  cta: {
    label: "Claim My Free Strategy Call",
    mobileLabel: "Claim My Free Strategy Call",
    microcopy:
      "No obligation. We only work together if it makes sense for both of us.",
    /** Shown once after the breakdown video finishes — static cue, no motion. */
    afterVideoCue: "Ready when you are — claim your free strategy call below.",
  },
  reviewRequest: {
    heading: "Claim your free strategy call",
    subtitle:
      "Tell us about your firm and we will review your current enquiry journey before confirming the next steps.",
    submitCta: "Claim My Free Strategy Call",
    submittingCta: "Sending request…",
    trustItems: [
      "Free throughout the 30-day pilot — no card required",
      "No contract, no long-term commitment",
    ],
    submitConsent:
      "By submitting, you agree that Standout Group may contact you about this call.",
    privacyLinkLabel: "Privacy Notice",
    errorSummaryHeading: "Please correct the following:",
    submitError:
      "Something went wrong sending your request. Please try again in a moment.",
    fields: {
      name: {
        label: "Name",
        autocomplete: "name" as const,
        placeholder: "e.g. Sarah Jenkins",
      },
      workEmail: {
        label: "Work email",
        autocomplete: "email" as const,
        placeholder: "sarah@smithlaw.co.uk",
      },
      website: {
        label: "Firm website",
        autocomplete: "url" as const,
        placeholder: "smithlaw.co.uk",
        hint: "We use this to review your current enquiry journey.",
      },
      prioritisedAreaOfLaw: {
        label: "Prioritised area of law",
        placeholder: "Select an area of law",
        hint: "Choose the practice area you want us to prioritise.",
      },
    },
  },
  confirmation: {
    heading: "Your strategy call request has been received.",
    body: "We'll review your firm and be in touch.",
    /** Prefixed when siteConfig.reviewDeliveryTiming is set. */
    timingPrefix: "Expected timing:",
  },
  footer: {
    copyright: "© 2026 Standout Group. All rights reserved.",
  },
  privacyPage: {
    title: "Privacy Notice",
    intro:
      "This notice explains how Standout Group handles personal data submitted through the free strategy call request form on this page.",
    sectionHeadings: {
      controller: "Who controls the data",
      collect: "What we collect and why",
      lawfulBasis: "Lawful basis",
      processors: "Processors",
      retention: "Retention",
      rights: "Your rights",
    },
    collectBody:
      "We collect your name, work email, website address and prioritised area of law so we can review your suitability for a free strategy call and contact you about this request.",
    lawfulBasisPending:
      "The lawful basis for processing will be confirmed by the business after appropriate legal review and inserted here before production use.",
    processorsPending:
      "Depending on the live configuration, processors may include hosting (for example Vercel), workflow automation (for example n8n), email delivery, analytics and spreadsheet providers used to manage strategy call requests. Approved processor details will be listed here before production.",
    retentionPending:
      "Retention periods for strategy call requests and unsuccessful prospects will be defined with the business and inserted here before production. Do not treat any placeholder period as policy.",
    rightsBody:
      "You may request access to, correction of, or deletion of your personal data. Contact {email} for privacy questions or rights requests.",
  },
} as const;
