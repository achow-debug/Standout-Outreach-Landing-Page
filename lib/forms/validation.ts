import {
  AREAS_OF_LAW,
  FEE_EARNERS,
  HELP_OPTIONS_ENQUIRY,
  HELP_OPTIONS_SPEAK,
  MAX_DETAILS_CHARS,
  MAX_WORDS,
  OTHER,
  type FormId,
} from "@/lib/forms/config";

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type FormValues = {
  email: string;
  fullName: string;
  website: string;
  noWebsite: boolean;
  areasOfLaw: string[];
  feeEarners: string;
  helpWith: string;
  details: string;
  company_fax: string;
};

export const EMPTY_FORM_VALUES: FormValues = {
  email: "",
  fullName: "",
  website: "",
  noWebsite: false,
  areasOfLaw: [],
  feeEarners: "",
  helpWith: "",
  details: "",
  company_fax: "",
};

export type FieldErrors = Partial<Record<keyof FormValues, string>>;

export const ERROR_MESSAGES = {
  email: "Enter a valid email address, like name@yourfirm.co.uk",
  fullName: "Enter your full name",
  website: "Enter your firm's website, like smithlaw.co.uk",
  areasOfLaw: "Select at least one area of law",
  feeEarners: "Select your number of fee earners",
  helpWith: "Select how we can help",
  detailsRequired: "Tell us what you need help with",
  detailsTooLong: "Keep this to 500 words or fewer",
} as const;

/** Count words with the plan's rule. */
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Trim, strip spaces, require at least one dot, then store with https://
 * if no protocol was typed.
 */
export function normalizeWebsite(raw: string): string | null {
  const cleaned = raw.trim().replace(/\s+/g, "");
  if (!cleaned || !cleaned.includes(".")) return null;

  const lower = cleaned.toLowerCase();
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("file:") ||
    lower.startsWith("vbscript:") ||
    lower.startsWith("blob:")
  ) {
    return null;
  }

  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(cleaned)) {
    try {
      const url = new URL(cleaned);
      if (url.protocol !== "http:" && url.protocol !== "https:") return null;
      return cleaned;
    } catch {
      return null;
    }
  }

  return `https://${cleaned}`;
}

export function isValidEmail(raw: string): boolean {
  return EMAIL_RE.test(raw.trim());
}

export type StepIndex = 0 | 1 | 2;

/** Validate a single step. Returns field errors (empty when valid). */
export function validateStep(
  formId: FormId,
  step: StepIndex,
  values: FormValues,
): FieldErrors {
  const errors: FieldErrors = {};

  if (step === 0) {
    if (!isValidEmail(values.email)) {
      errors.email = ERROR_MESSAGES.email;
    }
    return errors;
  }

  if (step === 1) {
    if (!values.fullName.trim()) {
      errors.fullName = ERROR_MESSAGES.fullName;
    }

    if (formId === "enquiry-check") {
      if (!normalizeWebsite(values.website)) {
        errors.website = ERROR_MESSAGES.website;
      }
      if (values.areasOfLaw.length === 0) {
        errors.areasOfLaw = ERROR_MESSAGES.areasOfLaw;
      } else {
        const allowed = new Set<string>(AREAS_OF_LAW);
        if (values.areasOfLaw.some((area) => !allowed.has(area))) {
          errors.areasOfLaw = ERROR_MESSAGES.areasOfLaw;
        }
      }
    } else {
      if (!values.noWebsite && !normalizeWebsite(values.website)) {
        errors.website = ERROR_MESSAGES.website;
      }
      if (
        !values.feeEarners ||
        !(FEE_EARNERS as readonly string[]).includes(values.feeEarners)
      ) {
        errors.feeEarners = ERROR_MESSAGES.feeEarners;
      }
    }

    return errors;
  }

  // Step 2 (index 2) — how can we help + details
  const helpOptions =
    formId === "enquiry-check" ? HELP_OPTIONS_ENQUIRY : HELP_OPTIONS_SPEAK;
  if (
    !values.helpWith ||
    !(helpOptions as readonly string[]).includes(values.helpWith)
  ) {
    errors.helpWith = ERROR_MESSAGES.helpWith;
  }

  const wordCount = countWords(values.details);
  if (wordCount > MAX_WORDS) {
    errors.details = ERROR_MESSAGES.detailsTooLong;
  } else if (values.helpWith === OTHER && !values.details.trim()) {
    errors.details = ERROR_MESSAGES.detailsRequired;
  }

  return errors;
}

export type SubmissionStage = "email" | "complete";

export type SubmissionPayload = {
  form: FormId;
  stage: SubmissionStage;
  email: string;
  fullName?: string;
  website?: string | null;
  noWebsite?: boolean;
  areasOfLaw?: string[] | null;
  feeEarners?: string | null;
  helpWith?: string;
  details?: string;
  company_fax?: string;
  submittedAt: string;
};

export type ValidateSubmissionResult =
  | { ok: true; data: SubmissionPayload }
  | { ok: false; errors: FieldErrors | { form?: string; stage?: string } };

function isFormId(value: unknown): value is FormId {
  return value === "enquiry-check" || value === "speak-to-alex";
}

/**
 * Server-side validation for POST /api/forms.
 * Early email save and full complete submissions.
 */
export function validateSubmission(body: unknown): ValidateSubmissionResult {
  if (!body || typeof body !== "object") {
    return { ok: false, errors: { form: "Invalid payload" } };
  }

  const raw = body as Record<string, unknown>;

  if (!isFormId(raw.form)) {
    return { ok: false, errors: { form: "Unknown form" } };
  }

  const formId = raw.form;
  const stage = raw.stage === "email" || raw.stage === "complete" ? raw.stage : null;
  if (!stage) {
    return { ok: false, errors: { stage: "Unknown stage" } };
  }

  const email = typeof raw.email === "string" ? raw.email.trim() : "";
  if (!isValidEmail(email)) {
    return { ok: false, errors: { email: ERROR_MESSAGES.email } };
  }

  const submittedAt =
    typeof raw.submittedAt === "string" && raw.submittedAt
      ? raw.submittedAt
      : new Date().toISOString();

  if (stage === "email") {
    return {
      ok: true,
      data: {
        form: formId,
        stage: "email",
        email,
        submittedAt,
      },
    };
  }

  const values: FormValues = {
    email,
    fullName: typeof raw.fullName === "string" ? raw.fullName : "",
    website: typeof raw.website === "string" ? raw.website : "",
    noWebsite: Boolean(raw.noWebsite),
    areasOfLaw: Array.isArray(raw.areasOfLaw)
      ? raw.areasOfLaw.filter((v): v is string => typeof v === "string")
      : [],
    feeEarners: typeof raw.feeEarners === "string" ? raw.feeEarners : "",
    helpWith: typeof raw.helpWith === "string" ? raw.helpWith : "",
    details: typeof raw.details === "string" ? raw.details : "",
    company_fax: typeof raw.company_fax === "string" ? raw.company_fax : "",
  };

  // Character backstop before word check.
  if (values.details.length > MAX_DETAILS_CHARS) {
    return {
      ok: false,
      errors: { details: ERROR_MESSAGES.detailsTooLong },
    };
  }

  const step0 = validateStep(formId, 0, values);
  const step1 = validateStep(formId, 1, values);
  const step2 = validateStep(formId, 2, values);
  const errors = { ...step0, ...step1, ...step2 };

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  const website =
    formId === "speak-to-alex" && values.noWebsite
      ? null
      : normalizeWebsite(values.website);

  const data: SubmissionPayload = {
    form: formId,
    stage: "complete",
    email,
    fullName: values.fullName.trim(),
    website,
    noWebsite: formId === "speak-to-alex" ? values.noWebsite : false,
    areasOfLaw: formId === "enquiry-check" ? values.areasOfLaw : null,
    feeEarners: formId === "speak-to-alex" ? values.feeEarners : null,
    helpWith: values.helpWith,
    details: values.details.trim(),
    submittedAt,
  };

  return { ok: true, data };
}

/** Build the complete-stage client payload from form values. */
export function buildCompletePayload(
  formId: FormId,
  values: FormValues,
): SubmissionPayload {
  const website =
    formId === "speak-to-alex" && values.noWebsite
      ? null
      : normalizeWebsite(values.website);

  return {
    form: formId,
    stage: "complete",
    email: values.email.trim(),
    fullName: values.fullName.trim(),
    website,
    noWebsite: formId === "speak-to-alex" ? values.noWebsite : false,
    areasOfLaw: formId === "enquiry-check" ? values.areasOfLaw : null,
    feeEarners: formId === "speak-to-alex" ? values.feeEarners : null,
    helpWith: values.helpWith,
    details: values.details.trim(),
    company_fax: values.company_fax,
    submittedAt: new Date().toISOString(),
  };
}
