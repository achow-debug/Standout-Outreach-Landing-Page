import { siteConfig } from "@/lib/site-config";

type ReviewIdentity = {
  lead_id: string;
  requested_at: string;
  name: string;
  firm_name: string;
  work_email: string;
  website: string;
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
 * Keep wording aligned with the page: no calendar CTA, no fixed delivery promise.
 */

export function buildConfirmationEmail(payload: ReviewIdentity): {
  to: string;
  from: string;
  subject: string;
  text: string;
} {
  const lines = [
    `Hello ${payload.name},`,
    "",
    `Thank you for requesting a free Legal Enquiry Review for ${payload.firm_name} (${payload.website}).`,
    "",
    "I will check the website details and email you with the next step. The review uses only publicly visible pages. It does not require system access, a test enquiry, or a call.",
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
    subject: `We received your Legal Enquiry Review request — ${payload.firm_name}`,
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
    subject: `[Enquiry Review] ${payload.firm_name} — ${payload.lead_id}`,
    text: [
      "New Legal Enquiry Review request",
      "",
      `lead_id: ${payload.lead_id}`,
      `requested_at: ${payload.requested_at}`,
      `firm_name: ${payload.firm_name}`,
      `website: ${payload.website}`,
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
  "firm_name",
  "work_email",
  "website",
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
