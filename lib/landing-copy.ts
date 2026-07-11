/**
 * Centralised launch-direction copy for the Legal Enquiry Review landing page.
 * Edit copy here rather than inside component structure.
 */

export const landingCopy = {
  meta: {
    title: "Legal Enquiry Review | Standout Group",
    description:
      "A free, public-facing review of what a prospective client experiences between asking your firm for help and reaching the right person.",
  },
  hero: {
    eyebrow: "FOR UK LAW FIRMS",
    h1: "What happens after a prospective client decides to ask your firm for help?",
    supporting:
      "A five-minute look at where a client's need for guidance meets the firm's real enquiry process.",
    primaryCta: "Watch the 5-minute breakdown",
  },
  video: {
    heading: "Watch: What happens between enquiry and response",
    transcriptLabel: "Read video transcript",
    transcript: `Draft transcript aligned to the five-minute outline. Replace with the proofread transcript of the final recording before launch.

0:00–0:35 — A prospective client may arrive distressed, uncertain or unfamiliar with what to do next. The firm may be excellent once the right person is involved; this review looks at the journey required to reach them.

0:35–1:20 — Two realities meet: the client’s need for guidance and reassurance, and the firm’s shared inboxes, reception routing, incomplete messages, competing priorities and unclear response ownership.

1:20–2:15 — An observable example: a practice-area page, its call to action, the form it leads to, and what is—or is not—explained about the next step.

2:15–3:25 — The review method separates observation and evidence from possible implication, then asks a question for the firm to verify—never assuming an internal problem from the public website alone.

3:25–4:15 — You receive a short recorded walkthrough, annotated evidence and the priority questions needed to verify any operational or commercial implication.

4:15–5:00 — The review uses only the public website. No system access, no test enquiry, and no call required. Request it below when you are ready.`,
    fallbackMessage:
      "This video could not be played in your browser. Open the MP4 directly to watch the breakdown.",
    directLinkLabel: "Open the video file directly",
    posterTitle: "The five-minute breakdown",
    posterSubtitle: "Enquiry to response — both sides of the journey",
  },
  mechanism: {
    heading: "One journey. Seen from both sides.",
    supporting:
      "What the prospective client can see—and where the firm’s process needs to be verified.",
    columnHeaders: {
      client: "Prospective client",
      stage: "Journey stage",
      firm: "Firm reality",
    },
    stages: [
      {
        id: "service-page",
        label: "Service page",
        clientSignal: "Is this the right help?",
        firmSignal: "Enquiry source",
      },
      {
        id: "cta-form",
        label: "Form",
        clientSignal: "What should I explain?",
        firmSignal: "Information required",
      },
      {
        id: "handoff",
        label: "Handoff",
        clientSignal: "Has someone received it?",
        firmSignal: "Ownership and routing",
        emphasize: true,
      },
      {
        id: "next-step",
        label: "Response",
        clientSignal: "What happens next?",
        firmSignal: "Responsibility and visibility",
      },
    ],
    deliverable:
      "You receive a short recorded review, annotated observations and the questions needed to verify any possible implication.",
    exampleFindingLabel: "See an example finding",
    exampleFinding: {
      observation:
        "A family-law page directs visitors to the firm's general contact form.",
      evidence:
        "“Contact our team” opens /contact, which asks for basic contact details and a free-text message.",
      implication:
        "A prospective client may not know whether the enquiry has reached the relevant team or what happens next; the firm may need to route the message manually.",
      question:
        "How are these enquiries acknowledged, assigned and followed up today?",
    },
  },
  reviewRequest: {
    heading: "Request your free enquiry review",
    supporting:
      "Tell me which firm to review. I’ll look at one public journey and send you the evidence.",
    submitCta: "Request my free enquiry review",
    submittingCta: "Sending request…",
    scopeLink: "See exactly what I review",
    scopeDisclosure:
      "I will review one relevant service page, its primary action, the public enquiry form it leads to, the guidance given before submission, the visible explanation of what happens next and the mobile experience. I will not submit a test enquiry. Any internal implication will be presented as a question to verify—not as an assumed fact.",
    riskReversal: "Public website only · No access · No obligation",
    privacyMicrocopyBeforeLink:
      "By requesting a review, you agree that Standout Group may use these details to prepare and deliver it. See the ",
    privacyMicrocopyAfterLink: ".",
    errorSummaryHeading: "Please correct the following:",
    submitError:
      "Something went wrong sending your request. Please try again in a moment.",
    fields: {
      name: { label: "Name", autocomplete: "name" as const },
      firmName: { label: "Firm name", autocomplete: "organization" as const },
      workEmail: { label: "Work email", autocomplete: "email" as const },
      website: {
        label: "Website",
        autocomplete: "url" as const,
        placeholder: "examplelegal.co.uk",
      },
    },
  },
  confirmation: {
    heading: "Your review request has been received.",
    body: "I will check the website details and email you with the next step. You do not need to book a call or provide access to anything.",
  },
  footer: {
    privacyLabel: "Privacy Notice",
    locationNote: "Based in Staffordshire · Working with UK firms",
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
