/**
 * Centralised copy for the official Standout Group homepage.
 * Outreach / Legal Enquiry Review copy stays in landing-copy.ts.
 */

export const officialCopy = {
  meta: {
    title: "Standout Group, a law firm growth partner | Stop losing the clients who already found you.",
    description:
      "Standout Group is a law firm growth partner. We turn the work you already attract into retained matters. Free for 30 days.",
  },
  header: {
    applyLabel: "Apply For My 30-Day Pilot",
    applyHref: "#book",
    /** Same enquiry form as the hero. Shown alone on the closed mobile bar. */
    ctaLabel: "Free enquiry check",
    /** Same booking as the hero. Desktop bar, and the open mobile menu. */
    askLabel: "Speak to Alex",
  },
  hero: {
    eyebrow: "Keep everything that works",
    /** Near-black line. The accent sits after it, on its own line from the desktop breakpoint. */
    headingLead: "Turn more",
    headingAccent: "enquiries into instructions",
    ctaIntro: "Get started",
    ctaLabel: "See what happens to your enquiries",
    /** Opens the Speak to Alex booking, not the enquiry form. */
    secondaryCtaLabel: "Speak to Alex",
    caption: "Free enquiry report within 5 days. No obligation to commit.",
  },
  showcase: {
    scenes: [
      {
        id: "grow",
        title: "Grow deliberately",
        /** Two short lines so the 52px mobile caption slot can hold it. */
        mobileCaption: "Grow deliberately",
        detail: "by being selective about the matters you take on",
      },
      {
        id: "legal",
        title: "Built for legal, not bolted on",
        mobileCaption: "Built for legal\nnot bolted on",
        detail: "Designed around SRA/BSB compliance and GDPR from the start",
      },
      {
        id: "known",
        title: "Be known for your best work",
        mobileCaption: "Be known for\nyour best work",
        detail: "An online presence that reflects the quality of your work",
      },
    ],
  },
  noDisruption: {
    heading: "No complicated software. No change to how your team works.",
    body: "Enquiries arrive in the inbox or CRM your team already uses. After one 20-minute call and your logo, we build and run everything for 30 days, and nothing goes live until you've approved it.",
    label: "Delivers into the tools your firm already uses",
    tools: [
      { id: "outlook", name: "Outlook", mark: "O", color: "#0F6CBD" },
      { id: "gmail", name: "Gmail", mark: "M", color: "#C5221F" },
      { id: "microsoft-365", name: "Microsoft 365", mark: "365", color: "#107C41" },
      { id: "monday", name: "Monday CRM", mark: "M", color: "#F62B54" },
      { id: "clio", name: "Clio CRM", mark: "C", color: "#1A4F8B" },
      { id: "hubspot", name: "HubSpot CRM", mark: "H", color: "#FF7A59" },
    ],
    privacy: "Privacy is a fundamental human right. That's Standout Group.",
    icoLead: "ICO-registered (",
    icoNumber: "ZC264255",
    icoTail: ") provider.",
  },
  personalised: {
    rows: [
      {
        id: "clock",
        heading: "Never lose an enquiry to the clock",
        body: "Within minutes, your clients receive a calm, clear reply that reassures them, and they leave their details before they have thought to try anyone else.",
        card: "Businesses that reply within an hour are almost seven times likelier to get a proper conversation with the enquirer than those that wait just one hour more.",
        mention: "recommend",
        photoLabel: "Photo",
        badge: "HBR",
        sourceId: "hbr-2011",
      },
      {
        id: "matters",
        heading: "Spend your time on matters worth taking",
        body: "Enquiries that aren't a fit are obvious from the beginning",
        card: "Your intake form has already asked the right questions. Your team sends a clear next step without chasing.",
        mention: "Select high value work & healthy margins",
        photoLabel: "Photo",
      },
    ],
    ctaIntro: "Get started for free",
    ctaLabel: "See what happens to your enquiries",
    caption: "Free enquiry report within 5 days. No obligation to continue",
  },
  security: {
    heading: "Privacy & security built on your SRA obligations",
    linkLabel: "Learn more about our security practices",
    /** Destination page is built later. This href will 404 until then. */
    linkHref: "/security",
    badges: [
      {
        id: "cyber-essentials",
        src: "/images/security/cyber-essentials.svg",
        alt: "Cyber Essentials",
        width: 300,
        height: 72,
      },
      {
        id: "ico",
        src: "/images/security/ico.png",
        alt: "Information Commissioner's Office",
        width: 1056,
        height: 498,
      },
      {
        id: "google-partner",
        src: "/images/security/google-certified-partner.svg",
        alt: "Google Certified Partner",
        width: 152,
        height: 146,
      },
    ],
  },
  nav: {
    items: [
      { kind: "link", id: "security", label: "Security", href: "#security" },
      {
        kind: "menu",
        id: "partners",
        label: "Who we partner with",
        children: [
          { id: "partners-1", label: "Placeholder" },
          { id: "partners-2", label: "Placeholder" },
          { id: "partners-3", label: "Placeholder" },
        ],
      },
      {
        kind: "menu",
        id: "how-it-works",
        label: "How it works",
        children: [
          { id: "how-1", label: "Placeholder" },
          { id: "how-2", label: "Placeholder" },
          { id: "how-3", label: "Placeholder" },
        ],
      },
      {
        kind: "menu",
        id: "stories",
        label: "Customer stories",
        children: [
          { id: "stories-1", label: "Placeholder" },
          { id: "stories-2", label: "Placeholder" },
          { id: "stories-3", label: "Placeholder" },
        ],
      },
      { kind: "link", id: "founder", label: "Our story", href: "#founder" },
      { kind: "link", id: "faqs", label: "FAQs", href: "#faqs" },
    ],
  },
  whoItsFor: {
    eyebrow: "Who it’s for",
    items: [
      {
        id: "grow-deliberately",
        index: "A",
        title: "Law firms that want to grow deliberately",
        body: "More high-value work and healthy margins, not just enquiries coming in through the door.",
      },
      {
        id: "presence-undersells",
        index: "B",
        title:
          "Firms whose online presence undersells the quality of work they actually do",
        body: "Website, reviews, and reputation that don’t yet reflect where the firm wants to be positioned.",
      },
      {
        id: "selective-matters",
        index: "C",
        title:
          "Partners who want to be more selective about the matters they take on",
        body: "Understanding which work is genuinely profitable and building a pipeline that brings in more of it, instead of accepting whatever calls in.",
      },
    ],
  },
  howItWorks: {
    eyebrow: "How it works",
    heading: "More retained matters.",
    headingSecond: "Fewer enquiries lost along the way.",
    pill: "Included in your free 30-day pilot. See results before you decide whether to continue.",
    steps: [
      {
        id: "find-the-fit",
        title: "Find the fit",
        body: "We start with your market: your target clients, your strongest practice areas, and where competitors are winning enquiries that should be yours. Everything after this is built on what we find, not a template.",
        youGet: "a tailored audit",
      },
      {
        id: "fix-the-front-door",
        title: "Fix the front door",
        body: "Landing pages built to convert, and enquiry forms that ask the right questions upfront — so your team spends less time chasing details and more time on cases worth taking.",
        youGet: "a landing page and enquiry form built to convert",
      },
      {
        id: "handle-what-happens-next",
        title: "Handle what happens next",
        body: "Personal follow-up emails, lead qualification, and — where it earns its place — a chatbot that catches enquiries out of hours before they go cold. All of it feeding your existing CRM, so nothing falls through.",
        youGet: "follow-up that doesn’t wait",
      },
    ],
    addOn: {
      id: "fill-the-funnel",
      kicker: "Paid add-on",
      title: "Fill the funnel",
      body: "For firms who want traffic handled too, we manage Google Ads, Meta Ads, content and social — so the people landing on your site are already a good fit for what you do.",
    },
    compliance: {
      id: "built-for-legal",
      title: "Built for legal, not bolted on",
    },
    ctaLabel: "Apply For My 30-Day Pilot",
  },
  firmDay: {
    heading: "Your firm’s day with Standout Group",
    beats: [
      {
        id: "morning",
        kicker: "Morning",
        time: "7:40am",
        title: "Look as good online as you are in practice",
        body: "A prospective client searches on their phone before work. They find a page that loads fast, speaks to exactly what they’re facing and makes the next step obvious. The enquiries your competitors used to win start coming to you.",
        image: {
          src: "/images/firm-day/morning-page.webp",
          label: "Pilot landing page on a phone",
          alt: "A prospective client’s phone showing a fast landing page that speaks to their situation and makes the next step obvious.",
        },
      },
      {
        id: "lunchtime",
        kicker: "Lunchtime",
        time: "1:15pm",
        title: "Spend your time on the matters worth taking",
        body: "A house buyer asks three firms for a conveyancing quote over lunch. Your intake form, built for that practice area, has already asked the right questions. Your team sends a clear quote while the buyer is still deciding, without a single chasing email. Enquiries that aren’t a fit are obvious from the start.",
        image: {
          src: "/images/firm-day/lunch-form.webp",
          label: "Practice-area intake form",
          alt: "A conveyancing intake form that has already asked the questions a quote needs.",
        },
      },
      {
        id: "late-evening",
        kicker: "Late evening",
        time: "9:47pm",
        title: "Never lose an enquiry to the clock",
        body: "A family dealing with a bereavement gets in touch once the house is quiet. Within minutes they have a calm, clear reply that reassures rather than sells, and they leave their details before they’ve thought to try anyone else.",
        image: {
          src: "/images/firm-day/evening-chat.webp",
          label: "Chatbot mid-conversation, about 9:47pm",
          alt: "A calm reply at 9:47pm, mid-conversation with a family who got in touch after the house went quiet.",
        },
        proof: {
          lead: "Fourteen hours is the gap between a 7pm enquiry and a 9am reply. A South Yorkshire wills & probate firm closed that first reply time to five minutes during its pilot.",
          research:
            "Businesses that reply within an hour are almost seven times likelier to get a proper conversation with the enquirer than those that wait just one hour more.",
          credit: "Harvard Business Review research",
          sourceId: "hbr-2011",
        },
      },
      {
        id: "next-morning",
        kicker: "Next morning",
        time: "8:30am",
        title: "Start the day with enquiries ready to call back",
        body: "Your team arrives to enquiries ready to call back, each with the client’s details and matter type attached. Every enquiry is logged and consent is recorded. Nothing bypasses your own client-care or complaints process, so your SRA obligations stay intact.",
        image: {
          src: "/images/firm-day/next-morning.webp",
          label: "Logged enquiry ready to call back",
          alt: "An enquiry logged overnight, with the client’s details and matter type ready for a call back.",
        },
        proof: {
          lead: "Up to a fifth of enquiries to law firms never get a reply. In your firm, every one is answered and on record.",
          credit: "First4Lawyers, 2023",
          sourceId: "first4lawyers-2023",
        },
      },
    ],
    monthly: {
      kicker: "Monthly review",
      title:
        "A strategy built around your firm that is designed to be stronger every month",
      body: "At the end of each month, you’ll see exactly how the figures have moved, and what we’re changing as a result. If a question on the enquiry form is putting people off, we rewrite it. If your clients tend to reply in the evening, that’s when the follow-ups go out. As the numbers show which work earns the best margins, that’s where we focus our effort. All of it is shaped by your market, your clients and where you want to take the firm.",
    },
    ctaLabel: "Start for free",
    microcopy:
      "Free for 30 days. We partner with one firm per practice area in your county.",
  },
  partners: {
    eyebrow: "What partners say",
    heading: "Don’t take our word for it.",
    items: [
      {
        id: "florenda-abdo",
        quote:
          "Alex didn’t promise a fancy website redesign or a flood of new clients. He proposed diagnosing first, fixing our highest-value law pages, then improving how we captured and tracked enquiries. I agreed to expand only once we could see it working. That phased approach, not a big-bang relaunch, is why we said yes.",
        name: "Florenda A",
        role: "Conveyancing law specialist",
        firm: undefined,
        photo: undefined,
        portraitSrc: "/images/partners/florenda-abdo.jpg",
        portraitAlt: "Portrait of Florenda A, Conveyancing law specialist",
      },
      {
        id: "jayden-chow",
        quote:
          "I found Alex after he emailed me — an email that described problems I recognised. When he reached out, I didn’t book a call straight away. I looked into them first, the way I’d expect a client to look into us. What got me on the call was that it was framed as a collaboration, not a sales pitch.",
        name: "Jayden C",
        role: "Family law specialist",
        firm: undefined,
        photo: undefined,
        portraitSrc: "/images/partners/jayden-chow.jpg",
        portraitAlt: "Portrait of Jayden C, Family law specialist",
      },
    ],
  },
  faq: {
    heading: "FAQs",
    items: [
      {
        id: "existing-setup",
        question:
          "We already have a website and a marketing agency. Where does this fit?",
        answer:
          "Alongside them. We don’t replace your website or your agency. Most firms’ sites look fine; the losses happen after someone gets in touch, through a slow reply, no follow-up, or an enquiry that never becomes a consultation. Depending on your setup, the pilot runs on your existing site or from a standalone page, including if you don’t have a website yet.",
      },
      {
        id: "sra-obligations",
        question: "Will this affect our SRA obligations?",
        answer:
          "It’s built to keep them intact. Enquiries are logged and actioned promptly, consent and communications are tracked, and nothing bypasses your own client-care or complaints procedures.",
      },
      {
        id: "time",
        question: "How much time will this take from me or my team?",
        answer:
          "Next to none. We handle the setup and management for 30 days, all of it, for free. The only thing we need from you is a high-quality version of your logo, and we take it from there.\n\nFrom here, the next step is a collaborative conversation, where we'll discuss where we can potentially help.",
      },
      {
        id: "enquiry-data",
        question: "What happens to our enquiry and client data during the pilot?",
        answer:
          "Your enquiry and client data stays on your firm's own systems throughout. We never store, copy, or move it elsewhere. Access is limited to our team working directly with you, and it's only ever used to run it. We take privacy seriously and include a data processing agreement (DPA) in line with UK GDPR.",
      },
      {
        id: "after-30-days",
        question: "What happens after the 30 days?",
        answer:
          "We review the results with you. If you want to keep it running, ongoing work depends on your firm’s direction, and the cost depends entirely on scope of your operation. We’re proud to be fair & transparent about our pricing. If you decide not to continue, there’s no obligation, and we switch off everything we built.",
      },
      {
        id: "the-call",
        question: "What happens on the conversation?",
        answer:
          "We’ll look at how new clients reach your firm now, where they drop off, and what that’s likely costing you. If we don’t see a clear gap, we’ll say so.",
      },
    ],
  },
  founder: {
    heading: "Meet the founder",
    name: "Alex",
    readMore: "Read Alex's story",
    portraitAlt: "Alex, founder of Standout Group",
    portraitSrc: "/images/founder-alex.jpg",
    paragraphs: [
      "Alex founded Standout Group while training to qualify as a solicitor, with a belief that established law firms should not have to choose between the expertise that built their reputation and the technology needed to compete in 2026.",
      "His commercial experience across the automotive industry gave him a strong understanding of how businesses acquire customers, manage sales processes and identify the bottlenecks that prevent growth. Alongside that, working inside a top 500 law firm has given him a deeper understanding of how top players operate, the economics behind their work and the importance of protecting the standards and reputation they have built over many years.",
      "Alex believes the opportunity for established high street and regional firms is not to replace what already works, but to build on it: combining proven legal expertise with a stronger digital sales funnel, better enquiry handling, AI search visibility and the systems needed to turn more of existing demand into valuable instructions.",
      "That approach is deliberately evidence-led. Standout measures what is happening at each stage of the enquiry journey, uses those results to identify where opportunities are being lost, and adapts the strategy to the individual firm’s market, practice areas and objectives.",
      "It is also why Standout offers its work on a 30-day pilot. The goal is not to ask firms to believe a promise. It is to demonstrate measurable improvement in practice.",
    ],
  },
  finalCta: {
    headingLines: ["Fewer enquiries lost", "More of the right matters"],
    steps: [
      {
        title: "See what happens to your enquiries",
        body: "We trace how enquiries reach your firm, and where competitors are winning ones that should be yours.",
      },
      {
        title: "Approve your new enquiry journey",
        body: "We build the page, form and follow-up. Nothing goes live until you sign it off.",
      },
      {
        title: "Take on more of the right matters",
        body: "Every enquiry followed up and qualified, in the inbox or CRM you already use.",
      },
    ],
    primaryCta: "See what happens to your enquiries",
    secondaryCta: "Speak to Alex",
    trust: "ICO-registered · Data Processing Agreement · UK data only",
    microcopy: "Free enquiry report within 5 days. No obligation to commit.",
  },
  thankYou: {
    heading: "Your call is booked.",
    steps: [
      "Check your inbox for the confirmation.",
      "Add it to your calendar.",
    ],
  },
} as const;

export type OfficialNavItem = (typeof officialCopy.nav.items)[number];
export type OfficialNavLink = Extract<OfficialNavItem, { kind: "link" }>;
export type OfficialNavMenu = Extract<OfficialNavItem, { kind: "menu" }>;
export type OfficialWhoItsForItem =
  (typeof officialCopy.whoItsFor.items)[number];
export type OfficialHowItWorksStep =
  (typeof officialCopy.howItWorks.steps)[number];
export type OfficialPartnersItem =
  (typeof officialCopy.partners.items)[number];
