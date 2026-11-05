export const OTHER = "Other, please specify below";
export const MAX_WORDS = 500;
export const MAX_DETAILS_CHARS = 5000;
export const PRIVACY_HREF = "/privacy";

export const AREAS_OF_LAW = [
  "Family",
  "Employment",
  "Conveyancing",
  "Wills and probate",
  "Personal injury",
  "Immigration",
  "Other",
] as const;

export const FEE_EARNERS = ["1–5", "6–20", "21–50", "51+"] as const;

export const HELP_OPTIONS_ENQUIRY = [
  "I'd like to discuss our business use case",
  "I'm a decision maker and I'm ready to go ahead",
  "I'd like to explore pricing options",
  "I'm looking for support on how you can help",
  OTHER,
] as const;

export const HELP_OPTIONS_SPEAK = [
  "I'd like to discuss our business use case",
  "I'm a decision maker and I'm ready to go ahead",
  "I'd like to explore pricing options",
  "I'd like to see a demo of your service",
  "I'd like to discuss affiliate/partnership opportunities",
  "I'm looking for support on how you can help",
  OTHER,
] as const;

export type FieldConfig =
  | {
      kind: "email" | "text" | "website";
      name: string;
      label: string;
      placeholder?: string;
      helper?: string;
      required: boolean;
    }
  | {
      kind: "select";
      name: string;
      label: string;
      options: readonly string[];
      required: boolean;
    }
  | {
      kind: "multiselect";
      name: string;
      label: string;
      helper?: string;
      options: readonly string[];
      required: boolean;
    }
  | {
      kind: "checkbox";
      name: string;
      label: string;
    }
  | { kind: "details"; name: "details" };

export type FormStep = {
  srHeading: string;
  fields: FieldConfig[];
  notice?: string;
  /** Shown under the details field on the final step. */
  consent?: string;
};

export type FormConfig = {
  id: "enquiry-check" | "speak-to-alex";
  headline: string;
  subline: string;
  cardHeading: string;
  steps: FormStep[];
  submitLabel: string;
  faq: { question: string; answer: string }[];
  thankYou: {
    /** Template with {firstName}, {website}, {email} placeholders. */
    body: string;
    nextSteps?: string[];
    soonerLabel: string;
    whatsappHref: string;
    whatsappLabel: string;
    emailHref: string;
    emailLabel: string;
    homeLabel: string;
  };
};

const SHARED_FAQ: FormConfig["faq"] = [
  { question: "Who will I speak to?", answer: "" },
  { question: "What's in the report?", answer: "" },
  { question: "Is there any obligation?", answer: "" },
  { question: "What happens to our data?", answer: "" },
  { question: "What do I need to get started?", answer: "" },
];

const EMAIL_PRIVACY_NOTICE =
  "We store your email when you press Continue, so we can follow up if you don't finish.";

const WHATSAPP_HREF = "https://wa.me/447599569931";
const CONTACT_EMAIL = "achow@standoutgroup.net";

export const enquiryCheckForm: FormConfig = {
  id: "enquiry-check",
  headline: "See what happens to your enquiries",
  subline: "Free enquiry report within 5 days. No obligation to commit.",
  cardHeading:
    "Fill in your details and we'll send you your enquiry report",
  submitLabel: "See what happens to your enquiries",
  steps: [
    {
      srHeading: "Step 1 of 3: Your email",
      notice: EMAIL_PRIVACY_NOTICE,
      fields: [
        {
          kind: "email",
          name: "email",
          label: "Work email",
          placeholder: "sarah@smithlaw.co.uk",
          helper: "You'll receive a confirmation after requesting",
          required: true,
        },
      ],
    },
    {
      srHeading: "Step 2 of 3: About your firm",
      fields: [
        {
          kind: "text",
          name: "fullName",
          label: "Full name",
          placeholder: "e.g. Sarah Jenkins",
          required: true,
        },
        {
          kind: "website",
          name: "website",
          label: "Your firm's website",
          placeholder: "smithlaw.co.uk",
          helper: "We use this to review your current enquiry journey.",
          required: true,
        },
        {
          kind: "multiselect",
          name: "areasOfLaw",
          label: "Your specialist areas of law",
          helper: "Select all that apply",
          options: AREAS_OF_LAW,
          required: true,
        },
      ],
    },
    {
      srHeading: "Step 3 of 3: How we can help",
      consent:
        "By submitting, you agree that Standout Group may contact you about your free enquiry check.",
      fields: [
        {
          kind: "select",
          name: "helpWith",
          label: "How can we help?",
          options: HELP_OPTIONS_ENQUIRY,
          required: true,
        },
        { kind: "details", name: "details" },
      ],
    },
  ],
  faq: SHARED_FAQ,
  thankYou: {
    body: "We'll review {website}'s enquiry journey and send your free report to {email} within 5 days.",
    nextSteps: [
      "We review how your website handles a new enquiry.",
      "We send your report within 5 days.",
      "You decide whether to take it further. There's no obligation.",
    ],
    soonerLabel: "Want to talk sooner?",
    whatsappHref: WHATSAPP_HREF,
    whatsappLabel: "WhatsApp",
    emailHref: `mailto:${CONTACT_EMAIL}`,
    emailLabel: CONTACT_EMAIL,
    homeLabel: "Back to Standout Group",
  },
};

export const speakToAlexForm: FormConfig = {
  id: "speak-to-alex",
  headline: "Speak to Alex",
  subline: "Tell us a little about your firm and we'll be in touch.",
  cardHeading: "Fill in your details and we'll be in touch",
  submitLabel: "Speak to Alex",
  steps: [
    {
      srHeading: "Step 1 of 3: Your email",
      notice: EMAIL_PRIVACY_NOTICE,
      fields: [
        {
          kind: "email",
          name: "email",
          label: "Work email",
          placeholder: "sarah@smithlaw.co.uk",
          helper: "We'll reach back out to you on this email",
          required: true,
        },
      ],
    },
    {
      srHeading: "Step 2 of 3: About your firm",
      fields: [
        {
          kind: "text",
          name: "fullName",
          label: "Full name",
          placeholder: "e.g. Sarah Jenkins",
          required: true,
        },
        {
          kind: "website",
          name: "website",
          label: "Your firm's website",
          placeholder: "smithlaw.co.uk",
          required: true,
        },
        {
          kind: "checkbox",
          name: "noWebsite",
          label: "We don't have a website yet",
        },
        {
          kind: "select",
          name: "feeEarners",
          label: "Number of fee earners",
          options: FEE_EARNERS,
          required: true,
        },
      ],
    },
    {
      srHeading: "Step 3 of 3: How we can help",
      consent:
        "By submitting, you agree that Standout Group may contact you about your enquiry.",
      fields: [
        {
          kind: "select",
          name: "helpWith",
          label: "How can we help?",
          options: HELP_OPTIONS_SPEAK,
          required: true,
        },
        { kind: "details", name: "details" },
      ],
    },
  ],
  faq: SHARED_FAQ,
  thankYou: {
    body: "We'll be in touch at {email} to arrange a time to speak with Alex.",
    soonerLabel: "Want to talk sooner?",
    whatsappHref: WHATSAPP_HREF,
    whatsappLabel: "WhatsApp",
    emailHref: `mailto:${CONTACT_EMAIL}`,
    emailLabel: CONTACT_EMAIL,
    homeLabel: "Back to Standout Group",
  },
};

export const FORM_CONFIGS = {
  "enquiry-check": enquiryCheckForm,
  "speak-to-alex": speakToAlexForm,
} as const;

export type FormId = keyof typeof FORM_CONFIGS;

export function getFormConfig(id: FormId): FormConfig {
  return FORM_CONFIGS[id];
}

/** Interpolate thank-you body placeholders. */
export function fillThankYouBody(
  template: string,
  values: { firstName: string; website: string; email: string },
): string {
  return template
    .replaceAll("{firstName}", values.firstName)
    .replaceAll("{website}", values.website)
    .replaceAll("{email}", values.email);
}

export function firstNameFromFullName(fullName: string): string {
  const first = fullName.trim().split(/\s+/).filter(Boolean)[0];
  return first ?? "";
}
