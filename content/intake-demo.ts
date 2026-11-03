/**
 * Typed content for the annotated Standout Legal enquiry demo.
 * Compiled from New enquiry form demo.md — strings are exact.
 */

export type IntakeNoteId =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20;

export type IntakeScreenId =
  | "welcome"
  | "help"
  | "urgency"
  | "stage"
  | "signals"
  | "value"
  | "callback"
  | "contact"
  | "beforeCall"
  | "success"
  | "exit";

export type IntakeRoute = "urgent" | "nonUrgent";

export type IntakeDemoTab = "client" | "team";

export type CallbackWindowId = "asap" | "morning" | "afternoon" | "evening";

export type HelpOptionId =
  | "divorce"
  | "children"
  | "cohabitation"
  | "nuptial"
  | "abuse"
  | "other";

export type UrgencyOptionId =
  | "court-date"
  | "safety"
  | "abroad-risk"
  | "none";

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

export type ValueOptionId =
  | "under-250k"
  | "250k-1m"
  | "over-1m"
  | "prefer-not";

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
  /** Note 20 opens routing tables. */
  showRoutingTables?: boolean;
};

export type ChoiceOption<Id extends string> = {
  id: Id;
  label: string;
  description: string;
};

/** Fixed step numbers — skipped steps keep their number. */
export const intakeStepNumber: Record<
  Exclude<IntakeScreenId, "welcome" | "success" | "exit">,
  number
> = {
  help: 1,
  urgency: 2,
  stage: 3,
  signals: 4,
  value: 5,
  callback: 6,
  contact: 7,
  beforeCall: 8,
};

export const intakeTotalSteps = 8;

// ── Demo frame (outside the card) ───────────────────────────────────────────

export const intakeDemoChrome = {
  title: "A client enquiry, annotated",
  leadLine:
    "Use the form as a client would. Tap the numbered dots to see why each detail is there.",
  annotationsLabel: "Annotations",
  tabs: {
    client: "Client’s view",
    team: "What your team receives",
  },
  caption:
    "Standout Legal is a fictional firm. Rankings, accreditations and registration numbers are placeholders.",
  chooseHint: "Choose an option to continue",
  backLabel: "Back",
  continueLabel: "Continue",
} as const;

// ── Firm chrome (inside the card) ───────────────────────────────────────────

export const intakeFirmChrome = {
  firmName: "Standout Legal",
  accreditations: "Legal 500 · Chambers · Resolution",
  exitLabel: "Quick exit",
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

// ── Step 1: Help ────────────────────────────────────────────────────────────

export const intakeHelp = {
  heading: "What would you like help with?",
  hint: "Choose any that apply.",
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

// ── Step 2: Urgency (multi-select) ──────────────────────────────────────────

export const intakeUrgency = {
  heading: "Is anything time-critical right now?",
  hint: "Choose any that apply.",
  options: [
    {
      id: "court-date",
      label: "I have a court date coming up",
      description: "A hearing or court deadline in the coming weeks",
    },
    {
      id: "safety",
      label: "I’m worried about my or my children’s safety",
      description: "We’ll make sure someone calls you as a priority",
    },
    {
      id: "abroad-risk",
      label: "I’m worried my children may be taken abroad",
      description: "We can act quickly to help prevent it",
    },
  ] as const satisfies readonly ChoiceOption<
    Exclude<UrgencyOptionId, "none">
  >[],
  noneOption: {
    id: "none" as const,
    label: "No, nothing urgent",
    description: "We’ll arrange a call at a time that suits you",
  } satisfies ChoiceOption<"none">,
  alwaysVisible: [
    "If anything here is urgent, we’ll prioritise your enquiry and only ask what we need to call you.",
    "If you’re in immediate danger, call 999.",
  ] as const,
};

// ── Step 3: Stage ───────────────────────────────────────────────────────────

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

// ── Step 4: Signals ─────────────────────────────────────────────────────────

export const intakeSignals = {
  heading: "Are any of these part of the picture?",
  hint: "Choose any that apply. This helps us match you with the lawyer best suited to your matter.",
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

// ── Step 5: Value ───────────────────────────────────────────────────────────

export const intakeValue = {
  heading: "Roughly, what’s the combined value of property, savings and pensions?",
  subtext: "Optional. A rough idea helps us match you with the right lawyer.",
  options: [
    { id: "under-250k", label: "Under £250,000", description: "" },
    { id: "250k-1m", label: "£250,000 to £1 million", description: "" },
    { id: "over-1m", label: "Over £1 million", description: "" },
    { id: "prefer-not", label: "Prefer not to say", description: "" },
  ] as const satisfies readonly ChoiceOption<ValueOptionId>[],
};

// ── Step 6: Callback ────────────────────────────────────────────────────────

export const intakeCallback = {
  urgent: {
    badge: "Priority enquiry",
    heading: "We’ll treat your enquiry as a priority.",
    subtext:
      "Choose how soon you’d like us to call you. All times are UK time, Monday to Friday.",
    asap: {
      id: "asap" as const,
      label: "As soon as possible",
      description: "A family lawyer will call you as a priority",
    },
  },
  nonUrgent: {
    heading: "When would you like us to call?",
    subtext: "All times are UK time, Monday to Friday.",
    asap: {
      id: "asap" as const,
      label: "As soon as possible",
      description: "We’ll call at the first opportunity",
    },
  },
  orChooseLabel: "Or choose a time",
  windows: [
    { id: "morning" as const, label: "Morning", hours: "8am to 12pm" },
    { id: "afternoon" as const, label: "Afternoon", hours: "12pm to 3pm" },
    { id: "evening" as const, label: "Evening", hours: "3pm to 6pm" },
  ],
} as const;

// ── Step 7: Contact ─────────────────────────────────────────────────────────

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
  discretionLabel: "It’s safe to leave me a voicemail or email me.",
  lockLine: "Encrypted and seen only by our family team.",
} as const;

// ── Step 8: Before we call ──────────────────────────────────────────────────

export const intakeBeforeCall = {
  otherPerson: {
    label: "The other person’s full name",
    hint: "(optional)",
    helper:
      "So we can check for a conflict of interest before we call. We won’t contact them.",
  },
  optionalNote: {
    label: "Anything you’d like us to know before we call?",
    hint: "(optional)",
  },
  lockLine: "Encrypted and seen only by our family team.",
  submitUrgent: "Request my priority callback",
  submitNonUrgent: "Request my callback",
} as const;

// ── Success ─────────────────────────────────────────────────────────────────

export const intakeSuccess = {
  urgentBadge: "Flagged as a priority",
  eyebrow: "ENQUIRY RECEIVED",
  heading: (firstName: string) => `Thank you, ${firstName}.`,
  subtext: "Here is what happens next.",
  timeline: [
    {
      title: "Our family team reviews your enquiry.",
      body: "It’s read by a specialist family lawyer, never by a call centre.",
    },
    {
      title: "We call you.",
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
  noContact: "We won’t leave a voicemail or email you.",
  tryOtherRoute: "Try the other route",
} as const;

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

// ── Exit ────────────────────────────────────────────────────────────────────

export const intakeExit = {
  heading: "On a live site, the page would be gone.",
  body: "This button instantly replaces the form with a neutral page, such as a weather forecast, and removes it from the browser’s Back history. We’ve paused it here so you don’t lose your place in the demo.",
  backLabel: "Back to the demo",
} as const;

// ── Flow helpers ────────────────────────────────────────────────────────────

export function isChildrenOnlyMatter(help: readonly HelpOptionId[]): boolean {
  return help.length === 1 && help[0] === "children";
}

export function isUrgentSelection(
  urgency: readonly UrgencyOptionId[],
): boolean {
  return urgency.some((id) => id !== "none");
}

/** Ordered step screens for a route, including optional value skip. */
export function intakeStepsForAnswers(input: {
  route: IntakeRoute;
  help: readonly HelpOptionId[];
}): IntakeScreenId[] {
  const skipValue = isChildrenOnlyMatter(input.help);
  if (input.route === "urgent") {
    return skipValue
      ? ["help", "urgency", "callback", "contact", "beforeCall"]
      : ["help", "urgency", "value", "callback", "contact", "beforeCall"];
  }
  return skipValue
    ? ["help", "urgency", "stage", "signals", "callback", "contact", "beforeCall"]
    : [
        "help",
        "urgency",
        "stage",
        "signals",
        "value",
        "callback",
        "contact",
        "beforeCall",
      ];
}

export function nextIntakeScreen(
  current: IntakeScreenId,
  input: { route: IntakeRoute | null; help: readonly HelpOptionId[] },
): IntakeScreenId {
  if (current === "welcome") return "help";
  if (!input.route) {
    if (current === "help") return "urgency";
    return "welcome";
  }
  const steps = intakeStepsForAnswers({
    route: input.route,
    help: input.help,
  });
  const index = steps.indexOf(current);
  if (index < 0) return "help";
  if (index >= steps.length - 1) return "success";
  return steps[index + 1] ?? "success";
}

export function prevIntakeScreen(
  current: IntakeScreenId,
  input: { route: IntakeRoute | null; help: readonly HelpOptionId[] },
): IntakeScreenId {
  if (current === "help") return "welcome";
  if (!input.route) return "help";
  const steps = intakeStepsForAnswers({
    route: input.route,
    help: input.help,
  });
  const index = steps.indexOf(current);
  if (index <= 0) return "help";
  return steps[index - 1] ?? "help";
}

// ── Annotations (notes 1–20) — Task A will audit copy ───────────────────────

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
    title: "Quick exit",
    forClient:
      "Someone using a shared laptop or phone can leave in one tap. The form is replaced with a neutral page and removed from the browser’s Back history.",
    forFirm:
      "In family law, a quick-exit button is a safety feature for people experiencing abuse, and standard practice on UK family and domestic abuse sites. Having it on the form before a single question shows the firm understands its clients.",
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
      "Six options, each with a plain-English description, instead of a 16-row wall. Square checkboxes show they can choose more than one, and they recognise their situation without needing legal terms.",
    forFirm:
      "Cleaner categories arrive in your inbox, so the enquiry reaches the right person first time.",
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
    title: "A reason, not a label",
    forClient:
      "They say what’s urgent in plain terms. Urgent enquiries skip two questions, so there are fewer questions to answer when time matters most.",
    forFirm:
      "Almost everyone ticks a plain “urgent” box. A reason tells your team how fast to respond and who should pick it up, and it covers court dates, safety and child abduction risk in one question.",
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
    forClient: "One tap to answer, and nothing changes until they press Continue.",
    forFirm:
      "Because stage and urgency are separate questions, you learn both how far along they are and how fast to act.",
  },
  9: {
    id: 9,
    title: "High-value signals, without a means test",
    forClient:
      "Plain descriptions of their situation, with no exact figures, so it never feels like a means test.",
    forFirm:
      "Business interests, overseas assets, trusts and existing nuptial agreements point to complex or specialist matters, so the right person makes the call.",
  },
  10: {
    id: 10,
    title: "An honest way out",
    forClient: "“Not sure” is a valid answer, so nobody is forced to guess.",
    forFirm: "Keeps the signals accurate. A forced choice produces false flags.",
  },
  11: {
    id: 11,
    title: "A rough value, never a figure",
    forClient: "Three broad bands and “Prefer not to say”. Nobody is asked how they’ll pay.",
    forFirm:
      "Together with the signals, this does more for routing than any other question. It tells you whether it’s a partner matter or one for an associate, and whether your fees fit.",
  },
  12: {
    id: 12,
    title: "A promise without a stopwatch",
    forClient:
      "Urgent enquirers are told they are a priority. Everyone else chooses a time that suits them.",
    forFirm:
      "No fixed deadline is promised to the client, so the firm never breaks one on a busy day. Your team still sees its own response target on the record.",
    citation: {
      figure: "79%",
      text: "of consumers expect a response from a law firm within 24 hours (US survey).",
      sourceLabel: "Clio Legal Trends Report 2019",
      sourceUrl:
        "https://www.attorneyatwork.com/2019-clio-legal-trends-report-lawyers-fail-to-communicate-value/",
    },
  },
  13: {
    id: 13,
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
  14: {
    id: 14,
    title: "Discretion built in",
    forClient:
      "One tick says it’s safe to leave a voicemail or send an email. It’s unticked by default, which matters on a shared phone or inbox.",
    forFirm:
      "No automatic email goes out unless they tick it, and the instruction sits next to the phone number on your record, exactly where someone looks before dialling.",
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
    title: "The conflict check, before the call",
    forClient:
      "They’re told why the name is needed and that the other person won’t be contacted, so most people give it.",
    forFirm:
      "Your team runs the conflict check before dialling, so nobody spends twenty minutes on a call the firm then has to end. If it’s left blank, the record says to ask it first on the call.",
  },
  17: {
    id: 17,
    title: "Optional, never required",
    forClient:
      "Room to explain in their own words, with no pressure to write anything.",
    forFirm: "Whoever calls has context before dialling, so the first call goes further.",
  },
  18: {
    id: 18,
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
  19: {
    id: 19,
    title: "Regulation, at the start and the end",
    forClient:
      "SRA regulation and confidentiality are confirmed on the first and last screens, and kept out of the way while they answer questions.",
    forFirm:
      "Shows the standards behind the name. On a live site, show only rankings the firm actually holds, with its real SRA number.",
  },
  20: {
    id: 20,
    title: "Who calls, and how fast",
    forClient:
      "An urgent enquiry gets a call within the hour from whoever is free, not whoever is most senior.",
    forFirm:
      "Speed and seniority are decided separately. Urgent matters go to the first available fee earner with a partner notified, because waiting for a partner’s diary loses the client. “Prefer not to say” routes up, not down, because wealthy clients are among the most likely to keep their numbers private. The reason on the “Route to” line shows why the rule matched, so your team can trust it or override it.",
    showRoutingTables: true,
  },
};

export const intakeNotesByScreen: Record<
  Exclude<IntakeScreenId, "exit">,
  readonly IntakeNoteId[]
> = {
  welcome: [1, 2, 3, 4, 5, 19],
  help: [1, 2, 6],
  urgency: [1, 2, 7],
  stage: [1, 2, 8],
  signals: [1, 2, 9, 10],
  value: [1, 2, 11],
  callback: [1, 2, 12, 13],
  contact: [1, 2, 14, 15],
  beforeCall: [1, 2, 16, 17],
  success: [1, 2, 18, 19],
};

export const intakeNoteAudienceLabels = {
  forClient: "For your client",
  forFirm: "For your firm",
} as const;

/** Tab 2: What your team receives */
export const intakeTeamRecord = {
  sampleLabel: "Sample — complete the form to see yours.",
  yourLabel: "Your enquiry record",
  emptyHint:
    "Complete the form to see how this enquiry lands for your team.",
  labels: {
    routeTo: "Route to:",
    conflictCheck: "Conflict check:",
    matter: "Matter:",
    stage: "Stage:",
    flags: "Flags:",
    assetBand: "Asset band:",
    clientNote: "Client’s note:",
    bestTime: "Best time to call:",
    received: "Received:",
    checkBeforeCalling: "Check before calling",
    notProvided: "Not provided — ask first on the call",
    noNote: "No note",
    doNotContact: "Do not leave voicemail or email",
    contactOk: "Voicemail and email OK",
    notAskedUrgent: "Not asked (urgent route)",
    notAskedChildren: "Not asked (children only)",
  },
  sample: {
    priorityLine: "STANDARD · call in the morning window, within 1 working day",
    routeTo: "Partner — over £1m, business or company shares",
    name: "Rachel Ahmed",
    phone: "07700 900123",
    email: "rachel.ahmed@example.com",
    contactSafe: false,
    conflictName: "Daniel Ahmed",
    matter: "Divorce and finances",
    stage: "I have a solicitor and want to change",
    flags:
      "A business or company shares; Significant pensions or investments",
    assetBand: "Over £1 million",
    note: "My husband’s company is being valued next month and I’m not happy with how my current solicitor is handling it.",
    bestTime: "Morning, 8am to 12pm",
    received: "Tuesday 3 November, 9:14pm · Divorce and finances page",
  },
} as const;

export const intakeRoutingTables = {
  label: "Example rules: your firm sets its own.",
  howFast: {
    title: "How fast: urgency sets the response time",
    note: "If more than one applies, the highest priority wins.",
    rows: [
      {
        signal:
          "Safety concern, risk of children being taken abroad, or “Protection from domestic abuse” as the matter type",
        priority: "Urgent",
        handling:
          "First available fee earner calls back within the hour; partner notified",
      },
      {
        signal: "Court date coming up",
        priority: "Priority",
        handling: "Same-day callback",
      },
      {
        signal: "Nothing urgent",
        priority: "Standard",
        handling: "At the time the client chose, within one working day",
      },
    ],
  },
  whoHandles: {
    title: "Who handles it: value and complexity, first match wins",
    rows: [
      {
        signal: "Children or spouse abroad, or risk of children being taken abroad",
        routeTo: "International family specialist",
      },
      {
        signal: "Over £1m, business or company shares, or overseas property",
        routeTo: "Partner",
      },
      {
        signal: "£250k–£1m, or an existing pre- or post-nup",
        routeTo: "Senior associate",
      },
      {
        signal: "“Prefer not to say” with no other flags",
        routeTo: "Senior associate",
      },
      {
        signal: "Under £250k, or children-only with no flags",
        routeTo: "Associate",
      },
    ],
  },
} as const;

export type IntakeTeamAnswers = {
  help: readonly HelpOptionId[];
  urgency: readonly UrgencyOptionId[];
  route: IntakeRoute | null;
  stage: StageOptionId | null;
  signals: readonly SignalOptionId[];
  value: ValueOptionId | null;
  callback: CallbackWindowId | null;
  name: string;
  phone: string;
  email: string;
  contactSafe: boolean;
  otherPerson: string;
  note: string;
};

export type BuiltTeamRecord = {
  priorityLine: string;
  routeTo: string;
  name: string;
  phone: string;
  email: string;
  contactInstruction: string;
  conflictLine: string;
  matter: string;
  stage: string;
  flags: string;
  assetBand: string;
  note: string;
  bestTime: string;
  received: string;
};

function helpLabels(help: readonly HelpOptionId[]): string {
  return help
    .map((id) => intakeHelp.options.find((option) => option.id === id)?.label)
    .filter(Boolean)
    .join("; ");
}

function signalLabels(signals: readonly SignalOptionId[]): string {
  return signals
    .filter((id): id is Exclude<SignalOptionId, "none"> => id !== "none")
    .map(
      (id) =>
        intakeSignals.options.find((option) => option.id === id)?.label ?? id,
    )
    .join("; ");
}

function valueLabel(value: ValueOptionId | null): string {
  if (!value) return "";
  return intakeValue.options.find((option) => option.id === value)?.label ?? "";
}

function stageLabel(stage: StageOptionId | null): string {
  if (!stage) return "";
  return intakeStage.options.find((option) => option.id === stage)?.label ?? "";
}

function bestTimeLabel(
  callback: CallbackWindowId | null,
  route: IntakeRoute | null,
): string {
  if (!callback) return "";
  if (callback === "asap") {
    return route === "urgent"
      ? "As soon as possible (priority)"
      : "As soon as possible";
  }
  const window = intakeCallback.windows.find((item) => item.id === callback);
  return window ? `${window.label}, ${window.hours}` : "";
}

function computePriorityLine(input: IntakeTeamAnswers): string {
  const safety =
    input.urgency.includes("safety") ||
    input.urgency.includes("abroad-risk") ||
    input.help.includes("abuse");
  if (safety) {
    return "URGENT · call within 1 hour · partner notified";
  }
  if (input.urgency.includes("court-date")) {
    return "PRIORITY · same-day callback";
  }
  const time = bestTimeLabel(input.callback, input.route);
  if (input.callback === "asap") {
    return "STANDARD · call as soon as possible, within 1 working day";
  }
  if (time) {
    return `STANDARD · call in the ${time.toLowerCase().includes("morning") ? "morning" : time.toLowerCase().includes("afternoon") ? "afternoon" : "evening"} window, within 1 working day`;
  }
  return "STANDARD · within 1 working day";
}

function computeRouteTo(input: IntakeTeamAnswers): string {
  const flags = input.signals.filter((id) => id !== "none");
  const childrenOnly = isChildrenOnlyMatter(input.help);
  const abroad =
    flags.includes("abroad") || input.urgency.includes("abroad-risk");
  if (abroad) {
    return "International family specialist — children or spouse abroad";
  }
  if (
    input.value === "over-1m" ||
    flags.includes("business") ||
    flags.includes("overseas")
  ) {
    const reason =
      input.value === "over-1m"
        ? "over £1m"
        : flags.includes("business")
          ? "business or company shares"
          : "overseas property";
    return `Partner — ${reason}`;
  }
  if (input.value === "250k-1m" || flags.includes("nup")) {
    const reason =
      input.value === "250k-1m" ? "£250k–£1m" : "existing pre- or post-nup";
    return `Senior associate — ${reason}`;
  }
  if (input.value === "prefer-not" && flags.length === 0) {
    return "Senior associate — prefer not to say";
  }
  if (input.value === "under-250k" || (childrenOnly && flags.length === 0)) {
    return childrenOnly && flags.length === 0
      ? "Associate — children only, no flags"
      : "Associate — under £250k";
  }
  return "Associate — default";
}

/** Build the live team record from demo answers. */
export function buildIntakeTeamRecord(
  input: IntakeTeamAnswers,
): BuiltTeamRecord {
  const labels = intakeTeamRecord.labels;
  const matter = helpLabels(input.help) || "—";
  const flags = signalLabels(input.signals);
  const childrenOnly = isChildrenOnlyMatter(input.help);
  const stage =
    input.route === "urgent"
      ? labels.notAskedUrgent
      : stageLabel(input.stage) || "—";
  const assetBand = childrenOnly
    ? labels.notAskedChildren
    : valueLabel(input.value) || "—";

  const now = new Date();
  const received = `${now.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })}, ${now.toLocaleTimeString("en-GB", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })} · ${(helpLabels(input.help).split(";")[0] || "Enquiry").trim()} page`;

  return {
    priorityLine: computePriorityLine(input),
    routeTo: computeRouteTo(input),
    name: input.name.trim() || "—",
    phone: input.phone.trim() || "—",
    email: input.email.trim() || "—",
    contactInstruction: input.contactSafe
      ? labels.contactOk
      : labels.doNotContact,
    conflictLine: input.otherPerson.trim()
      ? `${input.otherPerson.trim()} · ${labels.checkBeforeCalling}`
      : labels.notProvided,
    matter,
    stage,
    flags: flags || "—",
    assetBand,
    note: input.note.trim() || labels.noNote,
    bestTime: bestTimeLabel(input.callback, input.route) || "—",
    received,
  };
}

export function sampleTeamRecordView(): BuiltTeamRecord {
  const sample = intakeTeamRecord.sample;
  return {
    priorityLine: sample.priorityLine,
    routeTo: sample.routeTo,
    name: sample.name,
    phone: sample.phone,
    email: sample.email,
    contactInstruction: intakeTeamRecord.labels.doNotContact,
    conflictLine: `${sample.conflictName} · ${intakeTeamRecord.labels.checkBeforeCalling}`,
    matter: sample.matter,
    stage: sample.stage,
    flags: sample.flags,
    assetBand: sample.assetBand,
    note: `“${sample.note}”`,
    bestTime: sample.bestTime,
    received: sample.received,
  };
}
