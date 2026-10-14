/**
 * Appendix A, exact copy. Journal titles in `italicise` are rendered in italics.
 * Rendered by `SourcesSection` (`id="sources"`).
 */

export const sources = {
  buttonLabel: "Source",
  seeAll: "See all sources & methodology",
  openSource: "Open the source",
  summaryLabel: "Sources & methodology",
  sectionId: "sources",
  items: [
    {
      id: "hbr-2011",
      credit: "Harvard Business Review, 2011",
      citation:
        "Oldroyd, J. B., McElheran, K. and Elkington, D. (2011) 'The Short Life of Online Sales Leads', Harvard Business Review, 89(3), p. 28.",
      italicise: "Harvard Business Review",
      url: "https://scholarsarchive.byu.edu/facpub/9711",
      summary:
        "An analysis of 1.25 million sales leads received by 42 US companies. Firms that tried to contact a lead within an hour were nearly seven times as likely to qualify it, meaning a meaningful conversation with a key decision-maker, as firms that tried even an hour later.",
    },
    {
      id: "first4lawyers-2023",
      credit: "First4Lawyers, 2023",
      citation:
        "First4Lawyers, ninth annual white paper (2023), reported in Rose, N. (2023) 'Law firms \"failing to respond\" to consumer enquiries', Legal Futures, 21 September.",
      italicise: "Legal Futures",
      url: "https://www.legalfutures.co.uk/latest-news/law-firms-failing-to-respond-to-consumer-enquiries",
      summary:
        "Mystery shoppers from insight6 contacted 50 personal injury and 50 wills practices by phone and through their websites. For web enquiries, 28% received a non-automated reply by phone or email within 15 minutes.",
    },
  ],
  mysteryShop: {
    title: "Standout Group mystery shop",
    leadBold:
      "70% of UK law firms are losing an estimated £100K+ every year to missed or mishandled enquiries.",
    paragraphs: [
      "To measure the real-world cost of poor lead handling, we mystery shopped over 100 UK law firms- tracking response times, reply quality, and follow-up persistence.",
      "By combining this data with average practice-area client values and conservative monthly enquiry estimates, the financial leak across the industry became clear. Most firms aren't losing prospects to better competitors- they are losing them to basic response failures.",
    ],
  },
  firstContactTitle: "First contact speed",
  firstContact:
    "In a live August 2026 pilot with a South Yorkshire Wills & Probate firm, automated lead capture slashed first-response times from 14 hours down to 5 minutes with a personalised email response.",
  nineWeekTitle: "Fast deployment. Measurable growth.",
  nineWeek: [
    { text: "Your system goes live within " },
    { text: "7 days", strong: true },
    { text: ", followed by a " },
    { text: "30-day live pilot", strong: true },
    { text: ". Within " },
    { text: "9 weeks", strong: true },
    {
      text: ", campaigns mature to deliver a clear, measurable increase in instructed matters and a positive ROI.",
    },
  ],
} as const;

export type SourceId = (typeof sources.items)[number]["id"];

export function getSource(id: SourceId) {
  const source = sources.items.find((item) => item.id === id);
  if (!source) {
    throw new Error(`Unknown source: ${id}`);
  }
  return source;
}
