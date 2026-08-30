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
    h1: "We mystery-shopped 100+ UK law firms. Here’s what happened after we submitted an enquiry.",
    supporting:
      "Your team thinks every enquiry gets handled. We found out what actually happens.",
    bridge: "Watch the 90-second breakdown",
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
        icon: "check" as const,
        title: "Spend time on qualified, serious enquiries",
        body: "A landing page that qualifies leads so you can offer free consultations to prospects with real intent, not time-wasters.",
      },
      {
        id: "response-time",
        icon: "clock" as const,
        title: "Serious prospects prevented from going cold",
        body: "Personalised, automated follow-up gives enquirers a clear next step, so their enquiry reaches your team instead of sitting in an inbox.",
      },
      {
        id: "compliance",
        icon: "calendar" as const,
        title: "30-day free trial",
        body: "We offer a risk-free trial with no obligation. Choose to continue only after you see live results. We’re fully transparent about fees.",
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
    /** Shown once after the breakdown video finishes — static cue, no motion. */
    afterVideoCue: "Ready when you are — claim your free strategy call.",
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
    calendly: {
      loading: "Loading calendar…",
      iframeTitle: "Book a free strategy call",
      fallbackHeading: "The calendar could not be loaded.",
      fallbackBody:
        "Open the booking page in a new tab to choose a time for your free strategy call.",
      fallbackLink: "Open the calendar in a new tab",
      emailFallback: "Or email {email}",
    },
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
    /** Modal chrome — same identity, without “All rights reserved”. */
    copyrightShort: "© 2026 Standout Group",
    /** Review-modal chrome only — the page footer uses legalNotice. */
    compliance: "SRA and GDPR compliant.",
    about:
      "We're a specialist growth agency for UK law firms, engineering the systems that turn existing & paid traffic into profitable, retained matters. Founder Alex set out to qualify as a solicitor, before building Standout Group in 2025, after watching firms sold generic 'more leads' promises by cookie-cutter agencies. Since our first contract in January 2026, we've been growing with firms across Staffordshire & beyond.",
    legalNotice:
      "Standout Group are registered with the Information Commissioner's Office (ICO) and strictly operate in compliance with the UK GDPR and PECR. All outbound email and telemarketing activities are processed under the lawful basis of Legitimate Interests.",
    nav: {
      whyChooseUs: "Why choose us?",
      faq: "FAQ",
      contact: "Contact",
      privacyPolicy: "Privacy Policy",
    },
    whyChooseUs: {
      title: "Why choose us?",
      items: [
        {
          heading: "Built for law firms, not “businesses”",
          body: "Every system we build is designed around how legal enquiries actually convert, not repurposed from a generic marketing template.",
        },
        {
          heading: "Built around your SRA duties",
          body: "Nothing bypasses your client care process. Every enquiry's logged, tracked, and handled to GDPR standard- the way your SRA obligations already require.",
        },
        {
          heading: "A 24/7 accessible client-focused support",
          body: "A collaborative & supportive team, listening, adapting, even for complex requirements.",
        },
      ],
    },
    faq: {
      title: "FAQ",
      items: [
        {
          question:
            "How will Standout Group affect our firm's client care process?",
          answer:
            "It won't, our process runs inside your existing SRA obligations, not around them. Every enquiry that comes through during the 30 days is still logged and actioned the way your client care and complaints process already requires. Client data is handled to GDPR standard throughout. We're not a regulated entity ourselves, so we're not claiming compliance on our own behalf, the point is that the process is built to protect the compliance you already have in place.",
        },
        {
          question: "Is there a contract or commitment after trial ends?",
          answer: [
            "None. You decide whether to continue based on the results we've generated for you. Every enquiry we recover is yours to keep, whatever you decide.",
            "The landing page and workflows we build are simply the engine that powers the trial — so if you choose not to continue, that engine winds down. The enquiries it's already generated for you don't go anywhere.",
          ],
        },
        {
          question: "How much time will this take from me or my team?",
          answer: [
            "Next to none. We handle the setup and build your page — all of it, for free. The only thing we need from you is a high-quality version of your logo, and we take it from there.",
            "From here, the next step is a free 30-minute strategy call, where we'll show you exactly how our enquiry recovery system can start recovering the enquiries you're currently losing.",
          ],
        },
        {
          question:
            "What happens to our enquiry and client data during the trial?",
          answer:
            "Your enquiry and client data stays on your firm's own systems throughout. We never store, copy, or move it elsewhere. Access is limited to our team working directly with you, and it's only ever used to run it. We take privacy seriously and include a data processing agreement (DPA) in line with UK GDPR.",
        },
      ],
    },
    contact: {
      title: "Contact",
      emailLabel: "Email",
      phoneLabel: "Phone",
      whatsappLabel: "WhatsApp",
    },
  },
  privacyPage: {
    title: "Privacy Notice",
    intro:
      "This notice explains how Standout Group handles personal data submitted when you claim a free strategy call on this page, including details you enter in the Calendly booking widget.",
    sectionHeadings: {
      controller: "Who controls the data",
      collect: "What we collect and why",
      lawfulBasis: "Lawful basis",
      processors: "Processors",
      retention: "Retention",
      rights: "Your rights",
    },
    collectBody:
      "When you book a free strategy call, Calendly collects your name, work email, timezone and any invitee questions configured for that event (for example firm website and prioritised area of law). If the on-site request form is shown instead, we collect your name, work email, website address and prioritised area of law so we can review suitability and contact you about this request.",
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
