import { siteConfig } from "@/lib/site-config";
import { areaOfLawLabel } from "@/lib/review-request-schema";

type ReviewIdentity = {
  lead_id: string;
  requested_at: string;
  name: string;
  work_email: string;
  website: string;
  prioritised_area_of_law: string;
  source: string | null;
  medium: string | null;
  campaign: string | null;
  content: string | null;
  term: string | null;
  landing_path: string | null;
  referrer_domain: string | null;
  status: string;
};

/**
 * Confirmation and internal notification copy for the n8n workflow.
 * Keep wording aligned with the page: strategy call request received,
 * we'll review and be in touch — no fixed response-time SLA.
 */

export function buildConfirmationEmail(payload: ReviewIdentity): {
  to: string;
  from: string;
  subject: string;
  text: string;
} {
  const areaLabel = areaOfLawLabel(payload.prioritised_area_of_law);
  const lines = [
    `Hello ${payload.name},`,
    "",
    `Thank you for claiming a free strategy call for ${payload.website} (${areaLabel}).`,
    "",
    "We'll review your firm and be in touch.",
  ];

  if (siteConfig.reviewDeliveryTiming) {
    lines.push("", `Expected timing: ${siteConfig.reviewDeliveryTiming}.`);
  }

  lines.push(
    "",
    `If any of the details above need correcting, reply to this email (${siteConfig.contactEmail}).`,
    "",
    "Standout Group",
    siteConfig.contactEmail,
  );

  return {
    to: payload.work_email,
    from: siteConfig.contactEmail,
    subject: `We received your strategy call request — ${payload.website}`,
    text: lines.join("\n"),
  };
}

export function buildInternalNotificationEmail(payload: ReviewIdentity): {
  to: string;
  from: string;
  subject: string;
  text: string;
} {
  return {
    to: siteConfig.contactEmail,
    from: siteConfig.contactEmail,
    subject: `[Strategy call] ${payload.website} — ${payload.lead_id}`,
    text: [
      "New free strategy call request",
      "",
      `lead_id: ${payload.lead_id}`,
      `requested_at: ${payload.requested_at}`,
      `website: ${payload.website}`,
      `prioritised_area_of_law: ${areaOfLawLabel(payload.prioritised_area_of_law)}`,
      `name: ${payload.name}`,
      `work_email: ${payload.work_email}`,
      `source: ${payload.source ?? "—"}`,
      `medium: ${payload.medium ?? "—"}`,
      `campaign: ${payload.campaign ?? "—"}`,
      `content: ${payload.content ?? "—"}`,
      `term: ${payload.term ?? "—"}`,
      `landing_path: ${payload.landing_path ?? "—"}`,
      `referrer_domain: ${payload.referrer_domain ?? "—"}`,
      `status: ${payload.status}`,
    ].join("\n"),
  };
}

/** Column order for the dedicated Enquiry Reviews Google Sheet. */
export const ENQUIRY_REVIEWS_SHEET_COLUMNS = [
  "lead_id",
  "requested_at",
  "name",
  "work_email",
  "website",
  "prioritised_area_of_law",
  "source",
  "medium",
  "campaign",
  "content",
  "term",
  "landing_path",
  "referrer_domain",
  "status",
  "assigned_to",
  "review_started_at",
  "review_delivered_at",
  "review_url",
  "discussion_booked_at",
  "discussion_held_at",
  "problem_verified_at",
  "problem_summary",
  "project_qualified_at",
  "paid_project_at",
  "project_value",
  "confirmation_email_sent_at",
  "last_error",
  "updated_at",
] as const;

export const ENQUIRY_REVIEW_STATUSES = [
  "Requested",
  "Validated",
  "In progress",
  "Delivered",
  "Discussion booked",
  "Discussion held",
  "Problem verified",
  "Project qualified",
  "Won",
  "Not suitable",
  "Closed",
] as const;
