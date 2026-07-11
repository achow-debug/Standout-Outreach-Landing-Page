import { z } from "zod";

export const REVIEW_REQUEST_SCHEMA_VERSION = "1.0";

export const FORMULA_INJECTION_PREFIX = /^[=+\-@\t\r]/;

/** Characters that can trigger spreadsheet formula injection when a cell starts with them. */
export function sanitizeSheetCell(value: string): string {
  if (FORMULA_INJECTION_PREFIX.test(value)) {
    return `'${value}`;
  }
  return value;
}

/**
 * Accept a bare domain or full URL, normalise to HTTPS, reject unsafe schemes.
 */
export function normalizeWebsiteUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) {
    throw new Error("Website is required");
  }

  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("file:") ||
    lower.startsWith("vbscript:") ||
    lower.startsWith("blob:")
  ) {
    throw new Error("Website must be an http or https address");
  }

  let candidate = trimmed;
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) {
    candidate = `https://${trimmed}`;
  }

  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    throw new Error("Enter a valid website address");
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Website must be an http or https address");
  }

  url.protocol = "https:";
  url.hash = "";

  // Drop a lone trailing slash on the origin for cleaner storage.
  if (url.pathname === "/" && !url.search) {
    return url.origin;
  }

  return url.toString();
}

const websiteField = z
  .string()
  .trim()
  .min(1, "Enter a website address")
  .max(2048, "Website address is too long")
  .transform((value, ctx) => {
    try {
      return normalizeWebsiteUrl(value);
    } catch (error) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          error instanceof Error ? error.message : "Enter a valid website address",
      });
      return z.NEVER;
    }
  });

/** Fields the browser may submit. Attribution is optional and allowlisted server-side. */
export const reviewRequestFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter a name of at least 2 characters")
    .max(80, "Name must be 80 characters or fewer"),
  firm_name: z
    .string()
    .trim()
    .min(2, "Enter a firm name of at least 2 characters")
    .max(120, "Firm name must be 120 characters or fewer"),
  work_email: z
    .string()
    .trim()
    .min(1, "Enter a work email address")
    .max(254, "Email must be 254 characters or fewer")
    .email("Enter a valid work email address"),
  website: websiteField,
  /** Invisible honeypot — must remain empty. */
  company_website: z.string().optional().default(""),
  /** Client-rendered timestamp (ms) for timing checks. */
  form_started_at: z.coerce.number().optional(),
  source: z.string().max(120).optional().nullable(),
  medium: z.string().max(120).optional().nullable(),
  campaign: z.string().max(200).optional().nullable(),
  content: z.string().max(200).optional().nullable(),
  term: z.string().max(200).optional().nullable(),
  landing_path: z.string().max(500).optional().nullable(),
  referrer_domain: z.string().max(253).optional().nullable(),
});

export type ReviewRequestFormInput = z.input<typeof reviewRequestFormSchema>;
export type ReviewRequestFormValues = z.output<typeof reviewRequestFormSchema>;

export type FieldName = "name" | "firm_name" | "work_email" | "website";

export const VISIBLE_FIELD_NAMES: FieldName[] = [
  "name",
  "firm_name",
  "work_email",
  "website",
];

export type FieldErrors = Partial<Record<FieldName, string>>;

/**
 * Validate visible form fields. Returns field errors and parsed values when valid.
 */
export function validateReviewRequestFields(
  raw: Record<string, unknown>,
): {
  success: boolean;
  fieldErrors: FieldErrors;
  values?: Pick<
    ReviewRequestFormValues,
    "name" | "firm_name" | "work_email" | "website"
  >;
} {
  const visibleSchema = reviewRequestFormSchema.pick({
    name: true,
    firm_name: true,
    work_email: true,
    website: true,
  });

  const result = visibleSchema.safeParse(raw);

  if (result.success) {
    return { success: true, fieldErrors: {}, values: result.data };
  }

  const fieldErrors: FieldErrors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0];
    if (
      typeof key === "string" &&
      VISIBLE_FIELD_NAMES.includes(key as FieldName) &&
      !fieldErrors[key as FieldName]
    ) {
      fieldErrors[key as FieldName] = issue.message;
    }
  }

  return { success: false, fieldErrors };
}

/** Allowlisted attribution keys accepted from the client. */
export const ATTRIBUTION_KEYS = [
  "source",
  "medium",
  "campaign",
  "content",
  "term",
  "landing_path",
  "referrer_domain",
] as const;

export type AttributionFields = {
  [K in (typeof ATTRIBUTION_KEYS)[number]]: string | null;
};

export function pickAttribution(
  raw: Partial<Record<string, unknown>>,
): AttributionFields {
  const out = {} as AttributionFields;
  for (const key of ATTRIBUTION_KEYS) {
    const value = raw[key];
    if (typeof value === "string" && value.trim()) {
      out[key] = value.trim().slice(0, 500);
    } else {
      out[key] = null;
    }
  }
  return out;
}
