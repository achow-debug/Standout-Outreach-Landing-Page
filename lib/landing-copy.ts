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
        body: "Personalised, automated follow-up acknowledges enquirers & gives them a clear next step, so your team receives clearer information. (Without the back & forth).",
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
    privacyLinkLabel: "Privacy Policy",
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
    title: "Privacy Policy",
    lastUpdated: "30 August 2026",
    intro:
      "This Privacy Policy explains how Standout Group (\"we\", \"us\", \"our\") collects, uses, and protects the personal data of visitors to standoutgroup.net (the \"Site\"), including anyone who submits our free enquiry audit request form.",
    sections: [
      {
        heading: "Who we are",
        blocks: [
          {
            type: "paragraph" as const,
            text: "Standout Group is the data controller responsible for the personal data described in this policy. If you have any questions about how we handle your data, you can contact us at achow@standoutgroup.net.",
          },
        ],
      },
      {
        heading: "What data we collect",
        blocks: [
          {
            type: "paragraph" as const,
            text: "When you request your free enquiry audit, we collect:",
          },
          {
            type: "bullets" as const,
            items: [
              "Your name",
              "Your work email address",
              "Your firm's website",
              "Your priority area of law",
            ],
          },
          {
            type: "paragraph" as const,
            text: "We also record the timestamp of your submission.",
          },
        ],
      },
      {
        heading: "How and why we use your data",
        blocks: [
          {
            type: "paragraph" as const,
            text: "We use the information you submit to:",
          },
          {
            type: "bullets" as const,
            items: [
              "Deliver the enquiry audit you requested and follow up with you about it",
              "Contact you about related services, where you've given us consent to do so",
            ],
          },
          {
            type: "paragraph" as const,
            text: "Our legal basis for processing this data is:",
          },
          {
            type: "bullets" as const,
            items: [
              "Legitimate interests — responding to an enquiry audit request you've actively initiated",
              "Consent — for any follow-up communications beyond delivering the audit itself, which is optional and which you can withdraw at any time",
            ],
          },
        ],
      },
      {
        heading: "Who we share your data with",
        blocks: [
          {
            type: "paragraph" as const,
            text: "We use the following third-party services to operate the Site and process your request. Each acts as a data processor on our behalf:",
          },
          {
            type: "bullets" as const,
            items: [
              "n8n — receives your form submission and passes it through our workflow automation",
              "Google Sheets — stores submitted enquiry audit requests",
              "Vercel — hosts the Site",
            ],
          },
        ],
      },
      {
        heading: "International data transfers",
        blocks: [
          {
            type: "paragraph" as const,
            text: "All personal data collected through the Site is handled and stored within the UK. We do not transfer your personal data outside the UK.",
          },
        ],
      },
      {
        heading: "How long we keep your data",
        blocks: [
          {
            type: "paragraph" as const,
            text: "We retain your data only for as long as necessary to deliver your enquiry audit and provide any related follow-up, after which it is deleted.",
          },
        ],
      },
      {
        heading: "Cookies and analytics",
        blocks: [
          {
            type: "paragraph" as const,
            text: "The Site uses Vercel Analytics to understand website traffic. Vercel Analytics does not use cookies — visitors are identified anonymously via a hashed value generated from the incoming request, and only aggregated, anonymised data is collected. No personal identifiers or cross-site tracking are used.",
          },
        ],
      },
      {
        heading: "Your rights",
        blocks: [
          {
            type: "paragraph" as const,
            text: "Under UK GDPR, you have the right to:",
          },
          {
            type: "bullets" as const,
            items: [
              "Access the personal data we hold about you",
              "Request correction of inaccurate data",
              "Request erasure of your data",
              "Restrict how we process your data",
              "Receive your data in a portable format",
              "Object to our processing of your data",
              "Lodge a complaint with the Information Commissioner's Office (ICO) if you believe your data has been mishandled",
            ],
          },
          {
            type: "paragraph" as const,
            text: "To exercise any of these rights, contact us at achow@standoutgroup.net.",
          },
        ],
      },
      {
        heading: "Marketing and opt-out",
        blocks: [
          {
            type: "paragraph" as const,
            text: "If we send you any communications beyond delivering your requested enquiry audit that count as marketing, you can opt out of these at any time using the unsubscribe link provided, in line with PECR requirements.",
          },
        ],
      },
      {
        heading: "Security",
        blocks: [
          {
            type: "paragraph" as const,
            text: "We take appropriate technical and organisational measures to protect your personal data against unauthorised access, loss, or misuse.",
          },
        ],
      },
      {
        heading: "Changes to this policy",
        blocks: [
          {
            type: "paragraph" as const,
            text: "We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated \"last updated\" date.",
          },
        ],
      },
      {
        heading: "Contact us",
        blocks: [
          {
            type: "paragraph" as const,
            text: "If you have any questions about this Privacy Policy or how your data is handled, please contact us at achow@standoutgroup.net.",
          },
        ],
      },
    ],
  },
} as const;
