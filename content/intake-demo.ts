/**
 * Typed content for the annotated Standout Legal enquiry demo.
 * Compiled from Newenquiryformdemo.md — strings are exact.
 */

export type IntakeNoteId =
  | 1
  | 2
  | 3
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
  | 20
  | 21;

export type IntakeScreenId =
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

export type IntakeNoteSection = {
  label: string;
  body: string;
};

export type IntakeNote = {
  id: IntakeNoteId;
  title: string;
  /** Shown in this order: only the parts that apply. */
  sections: readonly IntakeNoteSection[];
  citation?: IntakeCitation;
  /** Note 19 opens the routing tables. */
  showRoutingTables?: boolean;
};

export const intakeNoteLabels = {
  canWeAct: "Can we act?",
  shouldPursue: "Should we pursue it?",
  helpsConvert: "How it helps convert",
  clientBelieves: "What the client believes",
  protectsFirm: "How it protects the firm",
  whyHere: "Why it sits here",
} as const;

export type ChoiceOption<Id extends string> = {
  id: Id;
  label: string;
  description: string;
};

/** Fixed step numbers — skipped steps keep their number. */
export const intakeStepNumber: Record<
  Exclude<IntakeScreenId, "success" | "exit">,
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
  title: "See our enquiry form yourself",
  leadLine:
    "Use the form as a client would. Tap the numbered dots to see why each detail is there.",
  annotationsLabel: "Our annotations",
  tabs: {
    client: "Client’s view",
    team: "What your team receives",
  },
  chooseHint: "Choose an option to continue",
  backLabel: "Back",
  continueLabel: "Continue",
} as const;

// ── Firm chrome (inside the card) ───────────────────────────────────────────

export const intakeFirmChrome = {
  firmName: "Sample Family Law",
  introHeading: "Talk to our family solicitor, in confidence.",
  trustLines: [
    "Example ranking shown for demo",
    "Example review count for demo",
    "Example directory listing for demo",
  ] as const,
  callFallback: "Prefer to call? 01XXX XXXXXX",
  callFallbackHref: "tel:01XXXXXXXXX",
  exitLabel: "Quick exit",
  /** Confidentiality line only — SRA number lives on the demo badge. */
  trustFooter: "Everything you share is confidential.",
  sraBadge: {
    number: "847291",
    /** Fixed for SSR/client parity in the demo badge. */
    dateLabel: "8 Nov 2026",
    firmLine:
      "Sample Family Law LLP is authorised and regulated by the Solicitors Regulation Authority",
    demoLabel: "Demo SRA badge — non-functional",
  },
} as const;

// ── Step 1: Help ────────────────────────────────────────────────────────────

export const intakeHelp = {
  heading: "What would you like help with?",
  hint: "Choose any that apply.",
  options: [
    {
      id: "divorce",
      label: "Divorce and finances",
      description: "Assets, pensions and maintenance",
    },
    {
      id: "children",
      label: "Arrangements for children",
      description: "Where they live and spend time",
    },
    {
      id: "cohabitation",
      label: "Separating without marriage",
      description: "For couples who lived together",
    },
    {
      id: "nuptial",
      label: "Pre- or post-nuptial agreement",
      description: "Protecting assets in a marriage",
    },
    {
      id: "abuse",
      label: "Protection from domestic abuse",
      description: "Court orders to keep you safe",
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
      description: "A hearing or court deadline soon",
    },
    {
      id: "safety",
      label: "I’m worried about my or my children’s safety",
      description: "We’ll call you as a priority",
    },
    {
      id: "abroad-risk",
      label: "I’m worried my children may be taken abroad",
      description: "We can act quickly to prevent it",
    },
  ] as const satisfies readonly ChoiceOption<
    Exclude<UrgencyOptionId, "none">
  >[],
  noneOption: {
    id: "none" as const,
    label: "No, nothing urgent",
    description: "We’ll call when it suits you",
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
      description: "Exploring your options first",
    },
    {
      id: "recently",
      label: "Recently separated",
      description: "Advice on what happens next",
    },
    {
      id: "court",
      label: "Court proceedings have started",
      description: "A case is already underway",
    },
    {
      id: "change",
      label: "I have a solicitor and want to change",
      description: "A second opinion or new solicitor",
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
  subtext:
    "Optional. A rough idea helps us match you with the right lawyer and give you a clearer fee estimate.",
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
      description: "We’ll call you as a priority",
    },
  },
  nonUrgent: {
    heading: "When would you like us to call?",
    subtext: "All times are UK time, Monday to Friday.",
    asap: {
      id: "asap" as const,
      label: "As soon as possible",
      description: "At the first opportunity",
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
  privacyNotice:
    "By continuing you confirm you’ve read our privacy notice. We use your details only to arrange your callback.",
  captchaError: "Confirm you’re not a robot before requesting your callback.",
  captchaMissingKey:
    "Add NEXT_PUBLIC_RECAPTCHA_SITE_KEY to enable the live reCAPTCHA widget in this demo.",
  lockLine: "Encrypted and seen only by our family team.",
  submitUrgent: "Request my priority callback",
  submitNonUrgent: "Request my callback",
} as const;

// ── Success ─────────────────────────────────────────────────────────────────

export const intakeSuccess = {
  urgentBadge: "Flagged as a priority",
  eyebrow: "Enquiry received",
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
  if (!input.route) {
    if (current === "help") return "urgency";
    return "help";
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
  if (current === "help") return "help";
  if (!input.route) return "help";
  const steps = intakeStepsForAnswers({
    route: input.route,
    help: input.help,
  });
  const index = steps.indexOf(current);
  if (index <= 0) return "help";
  return steps[index - 1] ?? "help";
}

// ── Annotations (notes 1–19) ───────────────────────────────────────────────

const L = intakeNoteLabels;

export const intakeNotes: Record<IntakeNoteId, IntakeNote> = {
  1: {
    id: 1,
    title: "Proof where people compare",
    sections: [
      {
        label: L.helpsConvert,
        body: "Family clients compare firms more than most, so the proof belongs on the form, not three clicks away on an About page. Plain lines they recognise — ranking, Google reviews, Legal 500 — beat directory names most people have never heard of.",
      },
      {
        label: L.clientBelieves,
        body: "“This firm is ranked, reviewed, and established.” Three short trust lines sit under the invitation on every step, so the proof travels with the form.",
      },
    ],
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
    sections: [
      {
        label: L.helpsConvert,
        body: "Someone using a shared laptop or phone can start the form knowing they can leave in one tap. The form is replaced with a neutral page and removed from the browser’s Back history.",
      },
      {
        label: L.clientBelieves,
        body: "“They understand people in my situation.” In family law, a quick-exit button is a safety feature for people experiencing abuse, and standard practice on UK family and domestic abuse sites. Having it on the form before a single question shows the firm understands its clients.",
      },
    ],
  },
  3: {
    id: 3,
    title: "An invitation, not a screening",
    sections: [
      {
        label: L.helpsConvert,
        body: "Names the situation in the header — talking to a family solicitor, in confidence — so the first question feels like a conversation, not a gate.",
      },
      {
        label: L.clientBelieves,
        body: "“They want to hear from me.” The header promises a confidential conversation with a family solicitor, with no hint that they might be turned away.",
      },
    ],
  },
  6: {
    id: 6,
    title: "The matter, in plain English",
    sections: [
      {
        label: L.canWeAct,
        body: "It checks the matter is within the firm’s expertise.",
      },
      {
        label: L.shouldPursue,
        body: "Financial remedy work (“Divorce and finances” on the form) and international matters are usually the highest-value work. International elements are picked up later in the form, on steps 2 and 4.",
      },
      {
        label: L.helpsConvert,
        body: "It routes the enquiry to the right specialist. Six options with plain-English descriptions replace a 16-row wall, so cleaner categories reach the right person first time.",
      },
      {
        label: L.clientBelieves,
        body: "“They handle exactly this.” They recognise their situation without needing legal terms, and square checkboxes show they can choose more than one.",
      },
    ],
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
    sections: [
      {
        label: L.shouldPursue,
        body: "It measures urgency. A court date, a safety concern and a risk of children being taken abroad each call for a different response, and almost everyone would tick a plain “urgent” box.",
      },
      {
        label: L.helpsConvert,
        body: "It sets how fast the firm responds and who picks it up. Urgent enquirers skip two questions, so there’s less to answer when time matters most.",
      },
      {
        label: L.clientBelieves,
        body: "“They get how urgent this is.”",
      },
    ],
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
    sections: [
      {
        label: L.shouldPursue,
        body: "It measures willingness to proceed. Someone who has a solicitor and wants to change, or whose court proceedings have started, is high-intent and usually ready to pay fees. “Thinking about separating” is a nurture lead.",
      },
      {
        label: L.helpsConvert,
        body: "Because stage and urgency are separate questions, your team learns both how far along they are and how fast to act.",
      },
      {
        label: L.clientBelieves,
        body: "“I can be honest about where I am.” One tap to answer, and nothing changes until they press Continue.",
      },
    ],
  },
  9: {
    id: 9,
    title: "High-value signals, without a means test",
    sections: [
      {
        label: L.shouldPursue,
        body: "Business interests, overseas assets, trusts and existing nuptial agreements point to complex or specialist matters. An international element usually means more complexity and higher fees, often a boutique’s sweet spot.",
      },
      {
        label: L.helpsConvert,
        body: "The right person makes the first call.",
      },
      {
        label: L.clientBelieves,
        body: "“They’re not judging my finances.” Plain descriptions of their situation, with no figures, so it never feels like a means test.",
      },
    ],
  },
  10: {
    id: 10,
    title: "An honest way out",
    sections: [
      {
        label: L.shouldPursue,
        body: "It keeps the signals accurate. A forced choice produces false flags.",
      },
      {
        label: L.clientBelieves,
        body: "“I don’t have to guess.” “Not sure” is a valid answer.",
      },
    ],
  },
  11: {
    id: 11,
    title: "A rough value, never a figure",
    sections: [
      {
        label: L.shouldPursue,
        body: "It covers profitability and ability to pay. That’s a real filter in family work, because no-win-no-fee agreements aren’t available in family proceedings. Together with the signals, this does more for routing than any other question: it tells you whether it’s a partner matter or one for an associate, and whether your fees fit.",
      },
      {
        label: L.helpsConvert,
        body: "It tells the firm which fee conversation to have, such as a fixed-fee package or hourly rates. It also prepares whoever calls to raise a legal services payment order where the other party controls the money, and to signpost anyone who needs legal aid, which most boutique firms don’t offer. Nobody is asked on the form how they’ll pay.",
      },
      {
        label: L.clientBelieves,
        body: "“They’re asking so they can help me.” Bands feel far less intrusive than exact figures, and “Prefer not to say” is always there. The subtext says a rough idea helps match them with the right lawyer and give a clearer fee estimate, which makes the question a benefit to them.",
      },
    ],
  },
  12: {
    id: 12,
    title: "A promise without a stopwatch",
    sections: [
      {
        label: L.protectsFirm,
        body: "No fixed deadline is promised to the client, so the firm never breaks one on a busy day. Your team still sees its own response target on the record.",
      },
      {
        label: L.clientBelieves,
        body: "Urgent enquirers are told they are a priority. Everyone else chooses a time that suits them.",
      },
    ],
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
    sections: [
      {
        label: L.helpsConvert,
        body: "Calling when someone expects it means more calls are answered.",
      },
      {
        label: L.clientBelieves,
        body: "Morning, afternoon or evening windows fit around work and family.",
      },
    ],
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
    title: "Safe to contact, at the moment of disclosure",
    sections: [
      {
        label: L.helpsConvert,
        body: "It gives the firm what it needs for a fast response. Confidentiality is restated just as they hand over their name and number. That’s the point where people hesitate most, so the reassurance protects completion.",
      },
      {
        label: L.clientBelieves,
        body: "“They know it might not be safe to contact me.” For anyone in an abusive relationship, a confirmation email or voicemail can be seen by the other party, and asking shows the firm understands that. The box is unticked by default, which matters on a shared phone or inbox.",
      },
      {
        label: L.protectsFirm,
        body: "No automatic email goes out unless they tick it, and the instruction sits next to the phone number on your record, exactly where someone looks before dialling.",
      },
      {
        label: L.whyHere,
        body: "By this step they’re invested, and contact details feel less exposing once the firm has shown it’s relevant.",
      },
    ],
  },
  15: {
    id: 15,
    title: "The conflict check, before the call",
    sections: [
      {
        label: L.canWeAct,
        body: "This is the conflict check. Without it, the firm can’t safely hold a substantive conversation, so your team runs it before dialling and nobody spends twenty minutes on a call the firm then has to end. If it’s left blank, the record says to ask it first on the call.",
      },
      {
        label: L.protectsFirm,
        body: "The form only asks for broad answers, and the record holds back the one free-text note until the conflict check is marked as cleared. That limits the risk of the firm being “conflicted out” by a spouse who approaches several top firms.",
      },
      {
        label: L.clientBelieves,
        body: "“I can see why they need this.” Explaining the reason turns a friction point into a trust signal, and being told the other person won’t be contacted means most people give the name.",
      },
    ],
  },
  16: {
    id: 16,
    title: "Optional, never required",
    sections: [
      {
        label: L.helpsConvert,
        body: "Whoever calls has context before dialling, so the first call goes further.",
      },
      {
        label: L.protectsFirm,
        body: "The note is held back on the record until the conflict check is cleared (see note 15).",
      },
      {
        label: L.clientBelieves,
        body: "“I can explain in my own words, if I want to.” There’s room to explain, with no pressure to write anything.",
      },
    ],
  },
  17: {
    id: 17,
    title: "What happens next",
    sections: [
      {
        label: L.helpsConvert,
        body: "Fewer “did you get my enquiry?” calls, and an enquirer who is less likely to keep shopping around.",
      },
      {
        label: L.clientBelieves,
        body: "“I know exactly what happens now.” A clear three-step timeline replaces “we’ll be in touch”, with their own call time and contact limits repeated back to them.",
      },
    ],
    citation: {
      figure: "64%",
      text: "of consumers said they had contacted a law firm that never responded (US survey).",
      sourceLabel: "Clio Legal Trends Report 2019",
      sourceUrl:
        "https://www.2civility.org/clio-legal-trends-report-finds-law-firms-arent-responsive-to-potential-clients/",
    },
  },
  18: {
    id: 18,
    title: "The SRA digital badge",
    sections: [
      {
        label: L.helpsConvert,
        body: "Regulated firms must display the SRA digital badge prominently. On a live firm site that is the official Yoshki badge tied to the firm’s mySRA domain. This demo shows a non-functional stand-in so COLPs can see where the badge belongs — on the final screens, with the firm’s SRA number on the badge itself.",
      },
      {
        label: L.clientBelieves,
        body: "“This is a properly regulated firm.” The badge and confidentiality line sit where people submit sensitive details, not buried in a footer three scrolls away.",
      },
      {
        label: L.protectsFirm,
        body: "A text line with a placeholder SRA number is not the badge. Live sites use the official embed; never invent a number that could be mistaken for a real firm.",
      },
    ],
  },
  19: {
    id: 19,
    title: "Who calls, and how fast",
    sections: [
      {
        label: L.shouldPursue,
        body: "“Prefer not to say” routes up, not down, because wealthy clients are among the most likely to keep their numbers private.",
      },
      {
        label: L.helpsConvert,
        body: "Speed and seniority are decided separately. Urgent matters go to the first available fee earner with a partner notified, because waiting for a partner’s diary loses the client. The reason on the “Route to” line shows why the rule matched, so your team can trust it or override it.",
      },
      {
        label: L.clientBelieves,
        body: "“They called me straight back.” An urgent enquiry gets a call within the hour from whoever is free, not whoever is most senior.",
      },
    ],
    showRoutingTables: true,
  },
  20: {
    id: 20,
    title: "Privacy notice at the point of collection",
    sections: [
      {
        label: L.protectsFirm,
        body: "UK GDPR expects a privacy notice where personal data is collected. Family enquiries often include sensitive details, so the notice belongs on the last step before submit — not only in a site footer.",
      },
      {
        label: L.clientBelieves,
        body: "“I can see how my details will be used.” The line confirms the firm only uses what they shared to arrange the callback.",
      },
      {
        label: L.whyHere,
        body: "It sits after contact details and just before submit, when the person has already invested and is deciding whether to send.",
      },
    ],
  },
  21: {
    id: 21,
    title: "reCAPTCHA before submit",
    sections: [
      {
        label: L.protectsFirm,
        body: "A checkbox captcha on the final step stops bulk bot submissions from filling the inbox with fake enquiries, without adding friction to every earlier question.",
      },
      {
        label: L.helpsConvert,
        body: "Bots rarely complete a multi-step form and a captcha. Real clients meet it once, at the moment of send.",
      },
      {
        label: L.whyHere,
        body: "Placing reCAPTCHA only on the submit step keeps earlier screens calm, and still blocks automated abuse where it matters.",
      },
    ],
  },
};

export const intakeNotesByScreen: Record<
  Exclude<IntakeScreenId, "exit">,
  readonly IntakeNoteId[]
> = {
  help: [1, 2, 3, 6],
  urgency: [1, 2, 3, 7],
  stage: [1, 2, 3, 8],
  signals: [1, 2, 3, 9, 10],
  value: [1, 2, 3, 11],
  callback: [1, 2, 3, 12, 13],
  contact: [1, 2, 3, 14],
  beforeCall: [1, 2, 3, 15, 16, 18, 20, 21],
  success: [1, 2, 3, 17, 18],
};

/** Tab 2: What your team receives */
export const intakeTeamRecord = {
  sampleLabel: "Sample — complete the form to see yours",
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
    heldBack: "Held back until the conflict check is cleared.",
    markCleared: "Mark as cleared",
    markChecked: "Mark as checked on the call",
    cleared: "Cleared",
    fullNote: "Full note in your CRM",
    doNotContact: "Do not leave voicemail or email",
    contactOk: "Voicemail and email OK",
    notAskedUrgent: "Not asked (urgent route)",
    notAskedChildren: "Not asked (children only)",
  },
  sample: {
    priorityLine: "Standard · call in the morning window, within 1 working day",
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

export type PriorityKind = "urgent" | "priority" | "standard";

export type BuiltTeamRecord = {
  priorityKind: PriorityKind;
  priorityDetail: string;
  routeTo: string;
  name: string;
  phone: string;
  email: string;
  contactInstruction: string;
  conflictName: string | null;
  matter: string;
  stage: string;
  flags: string;
  assetBand: string;
  /** Null when the client left the note blank. */
  noteText: string | null;
  bestTime: string;
  received: string;
};

function splitPriorityLine(line: string): {
  priorityKind: PriorityKind;
  priorityDetail: string;
} {
  const [badge, ...rest] = line.split(" · ");
  const normalized = badge.toLowerCase();
  const priorityKind: PriorityKind =
    normalized === "urgent" || normalized === "priority"
      ? normalized
      : "standard";
  return { priorityKind, priorityDetail: rest.join(" · ") };
}

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
    return "Urgent · call within 1 hour · partner notified";
  }
  if (input.urgency.includes("court-date")) {
    return "Priority · same-day callback";
  }
  const time = bestTimeLabel(input.callback, input.route);
  if (input.callback === "asap") {
    return "Standard · call as soon as possible, within 1 working day";
  }
  if (time) {
    const windowName = time.toLowerCase().includes("morning")
      ? "morning"
      : time.toLowerCase().includes("afternoon")
        ? "afternoon"
        : "evening";
    return `Standard · call in the ${windowName} window, within 1 working day`;
  }
  return "Standard · within 1 working day";
}

function computeRouteTo(input: IntakeTeamAnswers): string {
  const flags = input.signals.filter((id) => id !== "none");
  const childrenOnly = isChildrenOnlyMatter(input.help);
  const abroad =
    flags.includes("abroad") || input.urgency.includes("abroad-risk");
  if (abroad) {
    const reasons = [
      flags.includes("abroad") ? "children or spouse abroad" : null,
      input.urgency.includes("abroad-risk")
        ? "risk of children being taken abroad"
        : null,
    ].filter(Boolean);
    return `International family specialist — ${reasons.join(", ") || "children or spouse abroad"}`;
  }
  const partnerReasons = [
    input.value === "over-1m" ? "over £1m" : null,
    flags.includes("business") ? "business or company shares" : null,
    flags.includes("overseas") ? "overseas property" : null,
  ].filter(Boolean);
  if (partnerReasons.length > 0) {
    return `Partner — ${partnerReasons.join(", ")}`;
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
  const flagList = signalLabels(input.signals);
  const childrenOnly = isChildrenOnlyMatter(input.help);
  const stage =
    input.route === "urgent"
      ? labels.notAskedUrgent
      : stageLabel(input.stage) || "—";
  const flags =
    input.route === "urgent"
      ? labels.notAskedUrgent
      : flagList ||
        (input.signals.includes("none")
          ? intakeSignals.noneOption.label
          : "—");
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

  const priority = splitPriorityLine(computePriorityLine(input));
  const conflictName = input.otherPerson.trim() || null;
  const noteText = input.note.trim() || null;

  return {
    ...priority,
    routeTo: computeRouteTo(input),
    name: input.name.trim() || "—",
    phone: input.phone.trim() || "—",
    email: input.email.trim() || "—",
    contactInstruction: input.contactSafe
      ? labels.contactOk
      : labels.doNotContact,
    conflictName,
    matter,
    stage,
    flags: flags || "—",
    assetBand,
    noteText,
    bestTime: bestTimeLabel(input.callback, input.route) || "—",
    received,
  };
}

export function sampleTeamRecordView(): BuiltTeamRecord {
  const sample = intakeTeamRecord.sample;
  return {
    ...splitPriorityLine(sample.priorityLine),
    routeTo: sample.routeTo,
    name: sample.name,
    phone: sample.phone,
    email: sample.email,
    contactInstruction: intakeTeamRecord.labels.doNotContact,
    conflictName: sample.conflictName,
    matter: sample.matter,
    stage: sample.stage,
    flags: sample.flags,
    assetBand: sample.assetBand,
    noteText: sample.note,
    bestTime: sample.bestTime,
    received: sample.received,
  };
}
