/**
 * Approved copy for this plan. The live page still reads `lib/official-copy.ts`
 * until a later task wires a section to this module.
 * Strings here are exact, including the "could been been" sentence.
 */

export const sectionLabels = {
  hero: "Law firm growth partner",
  results: "Results",
  reviews: "Reviews",
  who: "Who it's for",
  how: "How it works",
  compare: "Compare",
  compliance: "Compliance",
  founder: "Founder",
  faqs: "FAQs",
} as const;

export const hero = {
  /** Owner has not chosen. Option A is the default until they confirm. */
  selected: "A",
  headline: "Stop losing the clients who already found you.",
  subline:
    "We turn the work you already attract into retained matters. Free for 30 days.",
  options: {
    B: {
      headline: "Your next client has already enquired.",
      subline:
        "Make sure they hear from you first. We build the follow-up that answers enquiries in minutes, not hours, without more ad spend or a website relaunch. Free for 30 days.",
    },
    C: {
      headline: "Judge us on results before you pay a penny.",
      subline:
        "A free 30-day pilot built to turn more of your enquiries into retained matters, measured against numbers we agree before we start.",
    },
  },
  imagePlaceholder:
    "[[TBC: hero image (founder photo or pilot system screenshot)]]",
} as const;

export const ctaMicrocopy = {
  line1:
    "We begin with a 20-minute strategy call, booked when it suits you.",
  /** "Registered with the ICO" is the link. The rest is plain text. */
  icoLink: "Registered with the ICO",
  line2AfterLink:
    " (ZC264255). Your details are only used to arrange your call.",
} as const;

export const proofCard = {
  id: "proof",
  from: "14 hrs",
  to: "5 min",
  labelLine1: "Cut in response time during Standout’s Pilot.",
  labelLine2: "Wills & probate firm, South Yorkshire, August 2026",
  why: "Firms that contact an online enquiry within the hour are nearly 7× as likely to reach a meaningful conversation as those that wait longer.",
  credit: "Harvard Business Review, 2011",
  sourceId: "hbr-2011",
} as const;

export const researchStats = {
  firmsFigure: "100+",
  firmsLabel: "law firms mystery-shopped before we built this process",
  leakFigure: "70%",
  leakLabel:
    "of the firms we tested were losing an estimated £100K+ a year to mishandled enquiries",
  methodButton: "How we measured this",
  seeAll: "See all sources & methodology",
} as const;

export const credentials = {
  icoTitle: "Registered with the ICO",
  icoNumber: "Registration number ZC264255",
  icoRegisterLabel: "Check the ICO register",
  icoRegisterUrl: "https://ico.org.uk/ESDWebPages/Search",
  icoMeaningLabel: "What does this mean?",
  sraTitle: "Built around the SRA Codes of Conduct and Transparency Rules",
  sraBody:
    "Standout Group is not a law firm and is not regulated by the SRA.",
} as const;

export const icoExplainer = {
  title: "What our ICO registration means",
  paragraphs: [
    "Registration with the Information Commissioner's Office, the UK's data protection regulator, is a legal requirement for organisations like ours that handle personal data. You can check our entry (ZC264255) on the ICO's public register.",
    "When you book a call, we collect your name, work email and firm website through our booking tool and use them only to arrange and prepare for the call. [Booking data is kept for 30 days then deleted.",
    "When we work with your firm, enquiry data passes through our automations to your own systems, and only Alex can access it. We do not store any sensitive client data and all data we receive from enquiry-handling is deleted after 30 days. We act as your data processor under a Data Processing Agreement.",
    "Questions about your data? Email achow@standoutgroup.net.",
  ],
  registerLabel: "Check the ICO register",
  email: "achow@standoutgroup.net",
} as const;

export const reviewOutcomePlaceholder =
  "[[TBC: measurable outcome from this firm's work with us]]";

export const reviews = {
  heading: "Don't take our word for it.",
  florenda: {
    id: "review-florenda",
    name: "Florenda A",
    role: "Conveyancing law specialist",
    region: "Staffordshire",
    date: "July 2026",
    outcome: reviewOutcomePlaceholder,
    photo: null,
  },
  jayden: {
    id: "review-jayden",
    name: "Jayden C",
    role: "Family law specialist",
    region: "Greater Manchester",
    date: "September 2026",
    outcome: reviewOutcomePlaceholder,
    photo: null,
    /** Do not render until the owner confirms Jayden approved it. */
    trimmedQuote:
      "I found Alex after he emailed me describing problems I recognised. What got us working together was that it was low risk and definitely sounded worth trying.",
    trimmedQuoteApproved: false,
  },
} as const;

export const whoItsFor = {
  heading: "You bring the ambition. We build the system.",
  supporting:
    "Just a firm worth building on, and the will to build it. We partner with family, conveyancing, wills, probate, and private client firms to make it happen.",
  cards: [
    {
      id: "practice-family",
      context: "family",
      title: "Family law",
      summary:
        "Enquiries often arrive late in the evening from people under strain, so the first calm, clear reply is what gets the call booked.",
      excerpt:
        "“…it was framed as a collaboration, not a sales pitch.” Jayden C, family law specialist",
      linkLabel: "Read Jayden’s review",
      linkHref: "#review-jayden",
    },
    {
      id: "practice-conveyancing",
      context: "conveyancing",
      title: "Residential conveyancing",
      summary:
        "Buyers ask several firms for quotes at once, so speed and a clear price decide who gets instructed.",
      excerpt:
        "“That phased approach, not a big-bang relaunch, is why we said yes.” Florenda A, conveyancing law specialist",
      linkLabel: "Read Florenda’s review",
      linkHref: "#review-florenda",
    },
    {
      id: "practice-wills",
      context: "wills-probate-private-client",
      title: "Wills, probate & private client",
      summary: "Families need reassurance, not a hard sell.",
      excerpt: null,
      linkLabel: "See our wills & probate pilot result",
      linkHref: "#proof",
    },
  ],
  transparency:
    "Every conveyancing and probate page we build includes the price and service information the SRA Transparency Rules require.",
} as const;

export const howItWorks = {
  heading: "More retained matters. Fewer enquiries lost along the way.",
  intro:
    "Every unqualified enquiry that reaches a fee-earner is time that could been been spent towards billable work. Every qualified one that sits in an inbox overnight is a client calling your competitor instead. Most firms don't have a lead problem. They have a handling problem, and it's costing them without anyone seeing exactly where.",
  calloutFigure: "28%",
  calloutBody:
    "When mystery shoppers sent web enquiries to 50 personal injury and 50 wills practices, only 28% got a non-automated reply within 15 minutes.",
  calloutCredit: "First4Lawyers, 2023",
  calloutSourceId: "first4lawyers-2023",
  afterCallout: "Here's how we close the gap.",
  proofLink: "The system behind our 14 hrs → 5 min result ↑",
  proofHref: "#proof",
  /**
   * The plan calls this a five-stage timeline. The table has four stages
   * and a blank row. These four are the approved copy. Do not invent a fifth.
   */
  timeline: [
    {
      title: "20-minute strategy call",
      description:
        "Booked when it suits you. We learn your goals, priorities and urgency, then we recommend the strategy.",
    },
    {
      title: "Live within 7 days, measurable ROI in 9 weeks",
      description:
        "Your system goes live in 1 week. Within 9 weeks, campaigns mature to deliver a clear, measurable increase in instructed matters and a positive ROI.",
    },
    {
      title: "30-day free pilot",
      description:
        "Launching a 30-day free pilot to capture immediate enquiries. Three markers to measure success, and the price post-pilot if you decide to continue, agreed before we start.",
      afterLink: "What happens after the 30 days?",
      afterHref: "#faq-after-30-days",
    },
    {
      title: "Day-30 review",
      description:
        "We review the numbers together. You decide whether to continue.",
    },
  ],
  legalLabel: "SRA and UK GDPR",
  legalBody:
    "Legal marketing runs on rules general marketing agencies bolt-on as an afterthought. Every page, form and follow-up sequence Standout Group build is designed around your SRA obligations and UK GDPR from the start, not added afterwards as a disclaimer at the bottom of the page.",
} as const;

export const comparison = {
  heading: "Traditional agencies vs. Standout Group’s 30-day pilot",
  columns: {
    traditional: "Traditional agencies",
    pilot: "Standout Group’s 30-day pilot",
  },
  rows: [
    {
      id: "contract",
      label: "Contract terms",
      traditional: "6 to 12-month lock-in",
      pilot:
        "30-day pilot, then you decide whether to continue based on results. No retainer terms.",
    },
    {
      id: "setup",
      label: "Setup time",
      traditional: "4–6 weeks onboarding",
      pilot: "Live within 7 days",
    },
    {
      id: "data",
      label: "Data ownership",
      traditional: "Agency owns campaign assets",
      /**
       * Existing cell is "You keep 100% of leads". It does not say the firm
       * owns the system. Kept until the owner confirms. The fallback below
       * is the plan's replacement if they want the fuller line.
       */
      pilot: "You keep 100% of leads",
      pilotFallback: "You keep every lead and all enquiry data",
    },
  ],
} as const;

export const compliance = {
  heading: "Built for your COLP's peace of mind",
  items: [
    {
      id: "sra-aligned-marketing",
      title: "SRA-aligned marketing",
      body: "All ad copy, landing pages and lead funnels are checked against the SRA Codes of Conduct and Transparency Rules before they go live.",
      note: "Empower your public image to grow boldly, backed by complete accuracy and compliance..",
    },
    {
      id: "data-protection",
      title: "Data protection (DPA)",
      body: "A Data Processing Agreement is agreed with every engagement before anything goes live, to meet UK GDPR requirements.",
      note: "Simplifies compliance auditing.",
      button: "Request our standard DPA",
    },
    {
      id: "ethical-lead-capture",
      title: "Ethical lead capture",
      body: "Zero deceptive hooks, exaggerated claims, or unvetted lead syndication.",
      note: "Protects the firm's brand reputation.",
    },
  ],
} as const;

export const dpaRequest = {
  title: "Request our standard DPA",
  intro:
    "Enter your work email and we'll send you our standard Data Processing Agreement to review.",
  emailLabel: "Work email",
  privacy:
    "We'll only use your email to send the DPA and answer questions about it. See our Privacy Policy.",
  submit: "Send me the DPA",
  invalidEmail:
    "Enter a valid email address, like name@yourfirm.co.uk.",
  success:
    "Request sent. We'll email the DPA to {email} within [[TBC: timeframe, e.g. one working day]].",
  error:
    "Your request didn't go through. Check your connection and try again, or email achow@standoutgroup.net.",
} as const;

export const faqs = [
  {
    id: "faq-after-30-days",
    question: "What happens after the 30 days?",
    answer:
      "Before day one, we agree on the three numbers that define success (tailored to your goals, for example, enquiry-to-consultation rate) and our monthly retainer fee if you choose to continue. On day 30, we review those numbers with you then you decide if you would like to continue. If we continue, you become our only partner for your practice area in your county, we won't take on a competing firm on your patch. We set the next three targets together, and you get a monthly performance review with Alex, so the focus stays on growing your firm. If you do not wish to continue, you keep every lead and all enquiry data we have generated for you, and the system we built is switched off.",
  },
  {
    id: "faq-sra",
    question: "Are you regulated by the SRA?",
    answer:
      "No, and we don't need to be. Standout Group doesn't give legal advice or carry out reserved legal activities, because we work on the business side of your firm, helping you win more of the high-value, healthy-margin work you want. However, your firm is regulated, and everything we create for you is your firm's publicity. That's why every page, ad and follow-up we build is crafted to boldly grow your firm while keeping you fully compliant under the SRA Codes of Conduct and Transparency Rules- giving your COLP complete confidence to sign it off.",
  },
  {
    id: "faq-sensitive-data",
    question: "How do you handle sensitive data?",
    paragraphs: [
      "You remain in complete control of your data. As an ICO-registered provider (ZC264255), we operate strictly as your data processor under a formal Data Processing Agreement put in place before launch.",
      "To protect your firm and your clients, our forms, chatbots, and follow-ups are designed for safe conversion—gathering exactly what’s needed to book the consultation while keeping sensitive case details secure until they reach your team.",
    ],
    dpaLink: "Request our standard DPA",
  },
] as const;

export const footerCompliance = {
  title: "Compliance & data governance",
  paragraphs: [
    "Standout Group is a law firm growth partner specialising in UK law firms. We are not a law firm and are not regulated by the SRA. The marketing we create for firms is designed around the SRA Codes of Conduct and Transparency Rules.",
    "Standout Group is registered with the Information Commissioner's Office (ZC264255) and complies with UK GDPR and PECR. Our outreach to law firms, by email and occasionally by phone, is carried out under the lawful basis of legitimate interests.",
  ],
} as const;

export { getSource, sources, type SourceId } from "./sources";
