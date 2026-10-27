/**
 * Typed content for the annotated Standout Legal enquiry demo.
 * Compiled from standout-legal-enquiry-content.md — strings are exact.
 */

export type IntakeNoteId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17;

export type IntakeScreenId =
  | "welcome"
  | "help"
  | "urgency"
  | "stage"
  | "signals"
  | "callback"
  | "contact"
  | "success"
  | "exit";

export type IntakeRoute = "urgent" | "nonUrgent";

export type CallbackWindowId = "asap" | "morning" | "afternoon" | "evening";

export type HelpOptionId =
  | "divorce"
  | "children"
  | "cohabitation"
  | "nuptial"
  | "abuse"
  | "other";

export type UrgencyOptionId = "urgent" | "advice";

export type StageOptionId =
  | "thinking"
  | "recently"
  | "court"
  | "change";

export type SignalOptionId =
  | "business"
  | "overseas"
  | "abroad"
  | "trusts"
  | "pensions"
  | "nup"
  | "none";

export type IntakeCitation = {
  figure: string;
  text: string;
  sourceLabel: string;
  sourceUrl: string;
};

export type IntakeNote = {
  id: IntakeNoteId;
  title: string;
  forClient: string;
  forFirm: string;
  citation?: IntakeCitation;
};

export type ChoiceOption<Id extends string> = {
  id: Id;
  label: string;
  description: string;
  /** Brass-edge highlight (urgent / ASAP priority options). */
  brassEdge?: boolean;
};

// ── Demo layer (Standout Group chrome) ──────────────────────────────────────

export const intakeDemoChrome = {
  brand: "Standout Group",
  instruction:
    "Use the form as a client would. Tap the numbered dots to see why each detail is there.",
  notesLabel: "Notes",
  disclaimer:
    "Standout Legal is a fictional firm. Rankings, accreditations and registration numbers are placeholders.",
} as const;

// ── Firm chrome (inside the form frame) ─────────────────────────────────────

export const intakeFirmChrome = {
  firmName: "Standout Legal",
  accreditations: "Legal 500 · Chambers · Resolution",
  exitLabel: "Exit",
  trustFooter:
    "Standout Legal LLP is authorised and regulated by the Solicitors Regulation Authority (SRA no. 000000). Everything you share is confidential.",
} as const;

// ── Welcome ─────────────────────────────────────────────────────────────────

export const intakeWelcome = {
  eyebrow: "PRIVATE ENQUIRY",
  heading: "Let’s talk, in confidence.",
  reassurances: [
    {
      id: "privacy" as const,
      icon: "shield-lock" as const,
      text: "Your information remains private",
    },
    {
      id: "no-commitment" as const,
      icon: "speech" as const,
      text: "Conversation about options, no commitment",
    },
  ],
  beginLabel: "Begin",
  effortHint: "Takes about 2 minutes",
} as const;

// ── Step 1: Help with ───────────────────────────────────────────────────────

export const intakeHelp = {
  heading: "What would you like help with?",
  hint: "Choose any that apply.",
  continueLabel: "Continue",
  options: [
    {
      id: "divorce",
      label: "Divorce and finances",
      description: "Dividing property, pensions, businesses and maintenance",
    },
    {
      id: "children",
      label: "Arrangements for children",
      description: "Where children live and time with each parent",
    },
    {
      id: "cohabitation",
      label: "Separating without marriage",
      description: "Property and finances for couples who lived together",
    },
    {
      id: "nuptial",
      label: "Pre- or post-nuptial agreement",
      description: "Protecting assets before or during a marriage",
    },
    {
      id: "abuse",
      label: "Protection from domestic abuse",
      description: "Court orders to keep you and your family safe",
    },
    {
      id: "other",
      label: "Something else",
      description: "You can tell us more at the end",
    },
  ] as const satisfies readonly ChoiceOption<HelpOptionId>[],
};

// ── Step 2: Urgency ─────────────────────────────────────────────────────────

export const intakeUrgency = {
  heading: "Is anything time-critical right now?",
  hint: "For example, a hearing in the coming weeks, or concern about your safety, your children or assets being moved.",
  options: [
    {
      id: "urgent",
      label: "Yes, I need help urgently",
      description:
        "We’ll prioritise your enquiry and only ask what we need to call you.",
      brassEdge: true,
      leadsTo: "callback" as const,
      route: "urgent" as const,
    },
    {
      id: "advice",
      label: "No, I’d like advice on next steps",
      description: "We’ll arrange a call at a time that suits you.",
      leadsTo: "stage" as const,
      route: "nonUrgent" as const,
    },
  ] as const satisfies readonly (ChoiceOption<UrgencyOptionId> & {
    leadsTo: "callback" | "stage";
    route: IntakeRoute;
  })[],
};

// ── Step 3: Stage (non-urgent) ──────────────────────────────────────────────

export const intakeStage = {
  heading: "Where are things at the moment?",
  options: [
    {
      id: "thinking",
      label: "Thinking about separating",
      description: "Exploring your options before deciding anything",
    },
    {
      id: "recently",
      label: "Recently separated",
      description: "Looking for advice on what happens next",
    },
    {
      id: "court",
      label: "Court proceedings have started",
      description: "A case is already underway",
    },
    {
      id: "change",
      label: "I have a solicitor and want to change",
      description: "A second opinion or new representation",
    },
  ] as const satisfies readonly ChoiceOption<StageOptionId>[],
};

// ── Step 4: Signals (non-urgent) ────────────────────────────────────────────

export const intakeSignals = {
  heading: "Are any of these part of the picture?",
  hint: "Choose any that apply. This helps us match you with the partner best suited to your matter.",
  continueLabel: "Continue",
  options: [
    {
      id: "business",
      label: "A business or company shares",
      description: "",
    },
    {
      id: "overseas",
      label: "Property or assets overseas",
      description: "",
    },
    {
      id: "abroad",
      label: "A spouse or children living abroad",
      description: "",
    },
    {
      id: "trusts",
      label: "Trusts, inheritance or family wealth",
      description: "",
    },
    {
      id: "pensions",
      label: "Significant pensions or investments",
      description: "",
    },
    {
      id: "nup",
      label: "An existing pre- or post-nup",
      description: "",
    },
  ] as const satisfies readonly ChoiceOption<Exclude<SignalOptionId, "none">>[],
  noneOption: {
    id: "none" as const,
    label: "None of these, or I’m not sure",
    description: "",
  } satisfies ChoiceOption<"none">,
};

// ── Callback ────────────────────────────────────────────────────────────────

export const intakeCallback = {
  urgent: {
    badge: "Priority enquiry",
    heading: "We’ll treat your enquiry as a priority.",
    subtext:
      "Choose how soon you’d like a partner to call you. All times are UK time, Monday to Friday.",
    asap: {
      id: "asap" as const,
      label: "As soon as possible",
      description: "A family partner will call you as a priority",
      brassEdge: true,
    },
  },
  nonUrgent: {
    heading: "When would you like us to call?",
    subtext: "All times are UK time, Monday to Friday.",
    asap: {
      id: "asap" as const,
      label: "As soon as possible",
      description: "We’ll call at the first opportunity",
      brassEdge: false,
    },
  },
  orChooseLabel: "Or choose a time",
  continueLabel: "Continue",
  windows: [
    {
      id: "morning" as const,
      label: "Morning",
      hours: "8am to 12pm",
    },
    {
      id: "afternoon" as const,
      label: "Afternoon",
      hours: "12pm to 3pm",
    },
    {
      id: "evening" as const,
      label: "Evening",
      hours: "3pm to 6pm",
    },
  ],
} as const;

// ── Contact ─────────────────────────────────────────────────────────────────

export const intakeContact = {
  heading: "How can we reach you?",
  subtext: "We only use these details to arrange your call.",
  fields: {
    name: {
      label: "Full name",
      required: true,
      error: "Enter your name so we know who to ask for.",
    },
    phone: {
      label: "Phone number",
      required: true,
      error:
        "Enter a phone number with at least 10 digits, for example 07700 900123.",
    },
    email: {
      label: "Email address",
      required: true,
      error: "Enter an email address like name@example.com.",
    },
  },
  discretion: {
    voicemail: "Is it safe to leave you a voicemail?",
    email: "Is it safe to email you?",
    yes: "Yes",
    no: "No",
  },
  optionalNote: {
    label: "Anything you’d like us to know before we call?",
    hint: "(optional)",
  },
  submitUrgent: "Request my priority callback",
  submitNonUrgent: "Request my callback",
  lockLine: "Encrypted and seen only by our family partners.",
} as const;

// ── Success ─────────────────────────────────────────────────────────────────

export const intakeSuccess = {
  urgentBadge: "Flagged as a priority",
  eyebrow: "ENQUIRY RECEIVED",
  heading: (firstName: string) => `Thank you, ${firstName}.`,
  subtext: "Here is what happens next.",
  timeline: [
    {
      title: "A family partner reviews your enquiry.",
      body: "It is read personally by a partner, never by a call centre.",
    },
    {
      title: "We call you.",
      /** Call-time and contact-limit clauses are appended at runtime. */
      bodyLead: "We’ll call",
    },
    {
      title: "Your first consultation.",
      body: "A confidential conversation about your options, with no obligation to go further.",
    },
  ] as const,
  callTimeWording: {
    asapUrgent: "as a priority, as soon as possible",
    asapNonUrgent: "as soon as possible",
    windowPrefix: "in your chosen window:",
  } as const,
  noVoicemail: "We won’t leave a voicemail.",
  noEmail: "We won’t email you.",
  /** Demo-only: restart the form (also auto-fires after SUCCESS_RESTART_MS). */
  restartLabel: "Start again",
  restartDelayMs: 5000,
} as const;

/** Build the success “We’ll call …” sentence fragment for the chosen window. */
export function formatCallTimeWording(
  windowId: CallbackWindowId,
  route: IntakeRoute,
): string {
  if (windowId === "asap") {
    return route === "urgent"
      ? intakeSuccess.callTimeWording.asapUrgent
      : intakeSuccess.callTimeWording.asapNonUrgent;
  }
  const window = intakeCallback.windows.find((w) => w.id === windowId);
  if (!window) return intakeSuccess.callTimeWording.asapNonUrgent;
  return `${intakeSuccess.callTimeWording.windowPrefix} ${window.label.toLowerCase()}, ${window.hours}`;
}

// ── Exit (demo only) ────────────────────────────────────────────────────────

export const intakeExit = {
  heading: "On a live site, the page would be gone.",
  body: "This button instantly replaces the form with a neutral page, such as a weather forecast, and removes it from the browser’s Back history. We’ve paused it here so you don’t lose your place in the demo.",
  backLabel: "Back to the demo",
} as const;

// ── Flow helpers ────────────────────────────────────────────────────────────

/** Ordered screens for each route (excluding welcome, success, exit). */
export const intakeRouteSteps: Record<IntakeRoute, readonly IntakeScreenId[]> = {
  urgent: ["help", "urgency", "callback", "contact"],
  nonUrgent: ["help", "urgency", "stage", "signals", "callback", "contact"],
} as const;

export const intakeStepCount = {
  urgent: 4,
  nonUrgent: 6,
} as const;

/** Next screen after a completed step, given the selected route. */
export function nextIntakeScreen(
  current: IntakeScreenId,
  route: IntakeRoute | null,
): IntakeScreenId {
  if (current === "welcome") return "help";
  if (current === "help") return "urgency";
  if (current === "urgency") {
    return route === "urgent" ? "callback" : "stage";
  }
  if (current === "stage") return "signals";
  if (current === "signals") return "callback";
  if (current === "callback") return "contact";
  if (current === "contact") return "success";
  return "welcome";
}

// ── Annotations (notes 1–17) ────────────────────────────────────────────────

export const intakeNotes: Record<IntakeNoteId, IntakeNote> = {
  1: {
    id: 1,
    title: "Proof where people compare",
    forClient:
      "Independent rankings sit right under the firm’s name, so they are visible on every step of the form.",
    forFirm:
      "Family clients compare firms more than most, so the proof belongs on the form, not three clicks away on an About page.",
    citation: {
      figure: "55%",
      text: "of people looking for family law services shopped around, the highest of any area surveyed.",
      sourceLabel: "Legal Services Consumer Panel, 2022",
      sourceUrl:
        "https://legalfutures.co.uk/latest-news/consumers-increasingly-shopping-around-for-lawyers-panel-finds",
    },
  },
  2: {
    id: 2,
    title: "A quick way out",
    forClient:
      "Someone looking at options on a shared laptop can leave in one tap. The form is swapped for a neutral page.",
    forFirm:
      "Shows, before a single question, that the firm understands family clients. It is standard practice on UK family and domestic abuse sites.",
  },
  3: {
    id: 3,
    title: "An invitation, not a screening",
    forClient:
      "The first line promises a confidential conversation, with no hint that they might be turned away.",
    forFirm:
      "Replaces “whether we may be able to assist”, which made enquirers feel screened out before they had started.",
  },
  4: {
    id: 4,
    title: "Privacy and no commitment, up front",
    forClient:
      "Answers the two worries people have before typing anything sensitive: who will see it, and whether they are committing to anything.",
    forFirm: "Trust is built before the first question, so fewer people leave at the start.",
    citation: {
      figure: "82%",
      text: "of consumers said reputation was the most important factor when choosing a legal provider.",
      sourceLabel: "Legal Services Consumer Panel, 2022",
      sourceUrl:
        "https://legalfutures.co.uk/latest-news/consumers-increasingly-shopping-around-for-lawyers-panel-finds",
    },
  },
  5: {
    id: 5,
    title: "The effort, stated up front",
    forClient:
      "“Takes about 2 minutes” tells them how much time it takes before they commit to starting.",
    forFirm: "A short, known task is easier to start and easier to finish.",
    citation: {
      figure: "17%",
      text: "of US online shoppers have abandoned an order because checkout was too long or complicated. This is an ecommerce benchmark, used here as a guide.",
      sourceLabel: "Baymard Institute, 2025",
      sourceUrl: "https://baymard.com/lists/cart-abandonment-rate",
    },
  },
  6: {
    id: 6,
    title: "One question per screen",
    forClient:
      "Six options, each with a plain-English description, instead of a 16-row wall. They recognise their situation without needing legal terms.",
    forFirm:
      "Cleaner categories arrive in your inbox, so the enquiry reaches the right partner first time.",
    citation: {
      figure: "20–60%",
      text: "fewer form elements could be shown by default in most checkouts, according to Baymard’s usability research.",
      sourceLabel: "Baymard Institute, 2025",
      sourceUrl:
        "https://baymard.com/research-articles/ecommerce-checkout-usability-report-and-benchmark",
    },
  },
  7: {
    id: 7,
    title: "The urgent fast lane",
    forClient:
      "Choosing “urgent” makes the form shorter: 4 steps instead of 6. Watch the step counter change on the next screen.",
    forFirm:
      "Time-critical matters are flagged as a priority before the enquirer tries the next firm on their list.",
    citation: {
      figure: "82%",
      text: "of consumers rated timeliness of response as the most important factor when looking for a lawyer (US survey).",
      sourceLabel: "Clio Legal Trends Report 2019",
      sourceUrl:
        "https://www.2civility.org/clio-legal-trends-report-finds-law-firms-arent-responsive-to-potential-clients/",
    },
  },
  8: {
    id: 8,
    title: "Stage, kept apart from urgency",
    forClient: "One tap and the form moves on by itself.",
    forFirm:
      "Because stage and urgency are separate questions, you learn both how far along they are and how fast to act.",
  },
  9: {
    id: 9,
    title: "High-value signals, without asking about money",
    forClient:
      "Nobody is asked for a figure, so it never feels like a means test.",
    forFirm:
      "Business interests, overseas assets, trusts and existing nuptial agreements point to complex, high-value matters, so the right partner makes the call.",
  },
  10: {
    id: 10,
    title: "An honest way out",
    forClient: "“Not sure” is a valid answer, so nobody is forced to guess.",
    forFirm: "Keeps the signals accurate. A forced choice produces false flags.",
  },
  11: {
    id: 11,
    title: "A promise without a stopwatch",
    forClient:
      "Urgent enquirers are told they are a priority. Everyone else chooses a time that suits them.",
    forFirm:
      "No fixed deadline is promised, so the firm never breaks one on a busy day.",
    citation: {
      figure: "79%",
      text: "of consumers expect a response from a law firm within 24 hours (US survey).",
      sourceLabel: "Clio Legal Trends Report 2019",
      sourceUrl:
        "https://www.attorneyatwork.com/2019-clio-legal-trends-report-lawyers-fail-to-communicate-value/",
    },
  },
  12: {
    id: 12,
    title: "They choose when you call",
    forClient: "Morning, afternoon or evening windows fit around work and family.",
    forFirm: "Calling when someone expects it means more calls are answered.",
    citation: {
      figure: "48%",
      text: "of firms either didn’t answer the phone or failed to call back in a 2024 secret-shopper test of 500 US firms.",
      sourceLabel: "Clio Legal Trends Report 2024",
      sourceUrl:
        "https://abovethelaw.com/2024/10/law-firms-failing-at-the-single-most-basic-lawyering-task/",
    },
  },
  13: {
    id: 13,
    title: "Discretion built in",
    forClient:
      "They can say no voicemails and no emails, which matters on a shared phone or inbox.",
    forFirm: "Your team knows how to make contact safely before the first call.",
  },
  14: {
    id: 14,
    title: "Optional, never required",
    forClient:
      "Room to explain in their own words, with no pressure to write anything.",
    forFirm: "The partner has context before dialling, so the first call goes further.",
  },
  15: {
    id: 15,
    title: "Reassurance at the moment of disclosure",
    forClient:
      "Confidentiality is restated just as they hand over their name and number.",
    forFirm:
      "This is the point where people hesitate most, so the reassurance protects completion.",
  },
  16: {
    id: 16,
    title: "What happens next",
    forClient:
      "A clear three-step timeline replaces “we’ll be in touch”, with their own call time and contact limits repeated back to them.",
    forFirm:
      "Fewer “did you get my enquiry?” calls, and an enquirer who is less likely to keep shopping around.",
    citation: {
      figure: "64%",
      text: "of consumers said they had contacted a law firm that never responded (US survey).",
      sourceLabel: "Clio Legal Trends Report 2019",
      sourceUrl:
        "https://www.2civility.org/clio-legal-trends-report-finds-law-firms-arent-responsive-to-potential-clients/",
    },
  },
  17: {
    id: 17,
    title: "Regulation, at the start and the end",
    forClient:
      "SRA regulation and confidentiality are confirmed on the first and last screens, and kept out of the way while they answer questions.",
    forFirm:
      "Shows the standards behind the name. On a live site, show only rankings the firm actually holds, with its real SRA number.",
  },
};

/** Which notes appear on which screen (for pin placement). */
export const intakeNotesByScreen: Record<
  Exclude<IntakeScreenId, "exit">,
  readonly IntakeNoteId[]
> = {
  welcome: [1, 2, 3, 4, 5, 17],
  help: [1, 2, 6],
  urgency: [1, 2, 7],
  stage: [1, 2, 8],
  signals: [1, 2, 9, 10],
  callback: [1, 2, 11, 12],
  contact: [1, 2, 13, 14, 15],
  success: [1, 2, 16, 17],
};

export const intakeNoteAudienceLabels = {
  forClient: "For your client",
  forFirm: "For your firm",
} as const;
