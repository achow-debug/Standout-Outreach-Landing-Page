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
    h1: "Is poor enquiry handling quietly costing your firm £1 million?",
    supporting:
      "The average UK legal firm leaks over seven figures a year in lost revenue. Find out if you're one of them in 5 minutes.",
    bridge: "Watch how, then request your free enquiry review",
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
        body: "100+ UK Law Firms analysed to build this engine.",
      },
      {
        id: "enterprise",
        icon: "lock" as const,
        title: "Enterprise Grade",
        body: "Built on isolated, bank-grade AI infrastructure.",
      },
      {
        id: "compliance",
        icon: "shield" as const,
        title: "SRA Compliant",
        body: "Fully GDPR & SRA conscious by design.",
      },
    ],
  },
  cta: {
    label: "Request your free enquiry review",
    mobileLabel: "Request Free Review →",
    microcopy:
      "A free straight look at where your enquiries are being lost — you'll decide whether to take it further or not",
  },
  reviewRequest: {
    heading: "Request your free enquiry review",
    subtitle: "Where should we send your custom enquiry review?",
    submitCta: "Request My Free Enquiry Review →",
    submittingCta: "Sending request…",
    trustLine: "🔒 100% Free • No sales call required • No obligation to take it further",
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
    heading: "Your review request has been received.",
    body: "We'll check the website details and email you with the next step. You do not need to book a call or provide access to anything.",
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
