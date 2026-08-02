/**
 * Centralised copy for the Legal Enquiry Review landing page.
 */

export const landingCopy = {
  meta: {
    title: "Legal Enquiry Review | Standout Group",
    description:
      "Poor enquiry handling can cost UK law firms over £1 million a year in lost revenue. Watch how Standout Group’s review works, then request yours free.",
  },
  hero: {
    audience: "Exclusively for UK Law Firms",
    h1: "Our analysis of 100+ UK law firms found 70% are losing over £100K a year to unfollowed enquiries",
    supporting:
      "Most of that comes down to slow or inconsistent follow-up — not a lack of leads. Starting your free pilot takes about 5 minutes.",
    bridge: "Watch how it works.",
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
        title: "Data-Backed",
        body: "100+ UK Law Firms analysed to design this system",
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
        body: "Fully SRA and GDPR compliant by design",
      },
    ],
    /** Risk-reversal explanation for the free 30-day pilot. */
    methodology: {
      heading: "",
      body: [
        "We handle all the setup. For 30 days, we run, measure, and share the results with you.",
        "No pressure. No obligation. We only work together if it makes sense for both of us.",
      ],
    },
  },
  cta: {
    label: "Start your free 30-day pilot",
    mobileLabel: "Start Free 30-Day Pilot →",
    microcopy:
      "A free 30-day pilot to fix where your enquiries are being lost — you'll decide whether to take it further or not",
    /** Shown once after the breakdown video finishes — static cue, no motion. */
    afterVideoCue: "Ready when you are — start your free 30-day pilot below.",
  },
  reviewRequest: {
    heading: "Start your free 30-day pilot",
    subtitle: "Where should we send your free 30-day pilot details?",
    submitCta: "Start My Free 30-Day Pilot →",
    submittingCta: "Sending request…",
    trustLine:
      "100% Free • No sales call required • No obligation to take it further",
    privacyLinkLabel: "Privacy notice",
    errorSummaryHeading: "Please correct the following:",
    submitError:
      "Something went wrong sending your request. Please try again in a moment.",
    fields: {
      name: {
        label: "Your Name",
        autocomplete: "name" as const,
        placeholder: "e.g. Sarah Jenkins",
      },
      firmName: {
        label: "Law Firm Name",
        autocomplete: "organization" as const,
        placeholder: "e.g. Smith & Partners Solicitors",
      },
      workEmail: {
        label: "Work Email",
        autocomplete: "email" as const,
        placeholder: "sarah@smithlaw.co.uk",
      },
      website: {
        label: "Your Firm's Website",
        autocomplete: "url" as const,
        placeholder: "smithlaw.co.uk",
      },
    },
  },
  confirmation: {
    heading: "Your pilot request has been received.",
    body: "We'll check the website details and email you with the next step. You do not need to book a call or provide access to anything.",
    /** Prefixed when siteConfig.reviewDeliveryTiming is set. */
    timingPrefix: "Expected timing:",
  },
  footer: {
    copyright: "© 2026 Standout Group. All rights reserved.",
  },
  privacyPage: {
    title: "Privacy Notice",
    intro:
      "This notice explains how Standout Group handles personal data submitted through the Legal Enquiry Review request form on this page.",
    sectionHeadings: {
      controller: "Who controls the data",
      collect: "What we collect and why",
      lawfulBasis: "Lawful basis",
      processors: "Processors",
      retention: "Retention",
      rights: "Your rights",
    },
    collectBody:
      "We collect your name, firm name, work email and website address so we can prepare and deliver a public-facing Legal Enquiry Review and communicate with you about that request.",
    lawfulBasisPending:
      "The lawful basis for processing will be confirmed by the business after appropriate legal review and inserted here before production use.",
    processorsPending:
      "Depending on the live configuration, processors may include hosting (for example Vercel), workflow automation (for example n8n), email delivery, analytics and spreadsheet providers used to manage review requests. Approved processor details will be listed here before production.",
    retentionPending:
      "Retention periods for review requests and unsuccessful prospects will be defined with the business and inserted here before production. Do not treat any placeholder period as policy.",
    rightsBody:
      "You may request access to, correction of, or deletion of your personal data. Contact {email} for privacy questions or rights requests.",
  },
} as const;
