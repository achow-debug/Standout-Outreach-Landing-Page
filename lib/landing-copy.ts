/**
 * Centralised copy for the Legal Enquiry Review landing page.
 * Visible page copy must match the approved redesign deck exactly.
 */

export const landingCopy = {
  meta: {
    title: "Legal Enquiry Review | Standout Group",
    description:
      "See how Standout Group helps UK law firms convert online demand. Watch the breakdown, then request your free enquiry review.",
  },
  hero: {
    /** Visible wording; play icon is rendered separately in the UI. */
    eyebrow: "Watch the full breakdown",
    h1: "See how we help UK Law Firms convert online demand",
    supporting:
      "A quick walkthrough of the exact innovative system we use to progress your online enquiries towards paying clients. Watch it, then request your free enquiry review.",
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
    /** Dot-separated statements; joined for display, split for responsive stacking. */
    credibilityItems: [
      "Built for UK law firms",
      "Works around your existing website and CRM",
      "No replacement system required",
    ] as const,
    outcomeItems: [
      "More qualified conversations",
      "Less administration",
      "Clearer marketing ROI",
    ] as const,
  },
  cta: {
    label: "Request your free enquiry review",
  },
  reviewRequest: {
    heading: "Request your free enquiry review",
    submitCta: "Request my free enquiry review",
    submittingCta: "Sending request…",
    errorSummaryHeading: "Please correct the following:",
    submitError:
      "Something went wrong sending your request. Please try again in a moment.",
    fields: {
      name: {
        label: "Name",
        autocomplete: "name" as const,
        placeholder: "Your name",
      },
      firmName: {
        label: "Firm name",
        autocomplete: "organization" as const,
        placeholder: "Your firm name",
      },
      workEmail: {
        label: "Work email",
        autocomplete: "email" as const,
        placeholder: "you@firm.co.uk",
      },
      website: {
        label: "Website",
        autocomplete: "url" as const,
        placeholder: "https://yourfirm.co.uk",
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
