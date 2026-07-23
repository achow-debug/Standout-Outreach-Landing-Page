"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type FocusEvent,
} from "react";
import {
  ensureAttributionCaptured,
  type StoredAttribution,
} from "@/lib/attribution";
import { attributionProps, trackEvent } from "@/lib/analytics";
import { landingCopy } from "@/lib/landing-copy";
import {
  type FieldErrors,
  type FieldName,
  validateReviewRequestFields,
  VISIBLE_FIELD_NAMES,
} from "@/lib/review-request-schema";

type FormValues = Record<FieldName, string>;

const EMPTY_VALUES: FormValues = {
  name: "",
  firm_name: "",
  work_email: "",
  website: "",
};

type ReviewRequestFormProps = {
  /** Fired synchronously when the request succeeds. */
  onComplete?: () => void;
  /** Prefill a form-level error (e.g. after a no-JS redirect). */
  initialError?: string | null;
};

/**
 * Enquiry-review form for the page modal: four required fields,
 * real `/api/review-request` submission, and concise error/loading states.
 */
export function ReviewRequestForm({
  onComplete,
  initialError = null,
}: ReviewRequestFormProps) {
  const { reviewRequest } = landingCopy;
  const { fields } = reviewRequest;
  const formId = useId();
  const idPrefix = formId.replace(/:/g, "");
  const summaryRef = useRef<HTMLDivElement>(null);
  const formStartedAtRef = useRef<number | null>(null);
  const formStartTrackedRef = useRef(false);
  const submitGenerationRef = useRef(0);
  const isSubmittingRef = useRef(false);

  const [values, setValues] = useState<FormValues>(EMPTY_VALUES);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(initialError);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const errorEntries = VISIBLE_FIELD_NAMES.filter((name) => fieldErrors[name]).map(
    (name) => ({ name, message: fieldErrors[name]! }),
  );
  const hasErrors = errorEntries.length > 0 || Boolean(formError);

  useEffect(() => {
    ensureAttributionCaptured();
  }, []);

  useEffect(() => {
    if (initialError) {
      setFormError(initialError);
    }
  }, [initialError]);

  useEffect(() => {
    if (hasErrors && summaryRef.current) {
      summaryRef.current.focus();
    }
  }, [hasErrors, fieldErrors, formError]);

  function fieldDomId(name: FieldName) {
    return `${idPrefix}-${name}`;
  }

  function markFormStarted() {
    if (formStartedAtRef.current === null) {
      formStartedAtRef.current = Date.now();
    }
    if (!formStartTrackedRef.current) {
      formStartTrackedRef.current = true;
      trackEvent("review_form_start", {
        ...attributionProps(),
        cta_location: "page_modal",
        landing_path:
          typeof window !== "undefined" ? window.location.pathname : "/",
      });
    }
  }

  function updateField(name: FieldName, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function validateField(name: FieldName) {
    const result = validateReviewRequestFields({ [name]: values[name], ...values });
    setFieldErrors((prev) => {
      const next = { ...prev };
      if (result.fieldErrors[name]) {
        next[name] = result.fieldErrors[name];
      } else {
        delete next[name];
      }
      return next;
    });
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    const name = event.target.name as FieldName;
    if (!VISIBLE_FIELD_NAMES.includes(name)) return;
    validateField(name);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmittingRef.current || isSubmitting) return;

    setFormError(null);

    const honeypot =
      new FormData(event.currentTarget).get("company_website")?.toString() ?? "";

    const result = validateReviewRequestFields(values);
    if (!result.success || !result.values) {
      setFieldErrors(result.fieldErrors);
      for (const name of Object.keys(result.fieldErrors) as FieldName[]) {
        trackEvent("review_form_error", {
          field: name,
          error_category: "validation",
          cta_location: "page_modal",
        });
      }
      return;
    }

    setFieldErrors({});
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    const generation = ++submitGenerationRef.current;
    let succeeded = false;

    try {
      const response = await fetch("/api/review-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...result.values,
          company_website: honeypot,
          form_started_at: formStartedAtRef.current ?? Date.now(),
          landing_path:
            typeof window !== "undefined" ? window.location.pathname : "/",
          referrer_domain: getReferrerDomain(),
          ...readStoredAttribution(),
        }),
      });

      if (generation !== submitGenerationRef.current) return;

      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        lead_id?: string;
        error?: string;
        fieldErrors?: FieldErrors;
      };

      if (!response.ok || !data.ok) {
        if (data.fieldErrors) {
          setFieldErrors(data.fieldErrors);
          trackEvent("review_form_error", {
            field: "form",
            error_category: "validation",
            cta_location: "page_modal",
          });
        } else {
          setFormError(data.error ?? reviewRequest.submitError);
          trackEvent("review_form_error", {
            field: "form",
            error_category: "submission",
            cta_location: "page_modal",
          });
        }
        return;
      }

      if (data.lead_id) {
        trackEvent("review_request_success", {
          lead_id: data.lead_id,
          ...attributionProps(),
          cta_location: "page_modal",
          landing_path:
            typeof window !== "undefined" ? window.location.pathname : "/",
        });
      }

      succeeded = true;
    } catch {
      if (generation !== submitGenerationRef.current) return;
      setFormError(reviewRequest.submitError);
      trackEvent("review_form_error", {
        field: "form",
        error_category: "network",
        cta_location: "page_modal",
      });
    } finally {
      if (generation === submitGenerationRef.current) {
        isSubmittingRef.current = false;
        setIsSubmitting(false);
      }
    }

    if (succeeded && generation === submitGenerationRef.current) {
      onComplete?.();
    }
  }

  return (
    <form
      className="request-form relative"
      action="/api/review-request"
      method="post"
      noValidate
      onSubmit={handleSubmit}
    >
      {hasErrors ? (
        <div
          ref={summaryRef}
          className="form-error-summary"
          role="alert"
          tabIndex={-1}
          aria-labelledby={`${formId}-error-summary-heading`}
        >
          <p
            id={`${formId}-error-summary-heading`}
            className="m-0 font-semibold"
          >
            {formError && errorEntries.length === 0
              ? formError
              : reviewRequest.errorSummaryHeading}
          </p>
          {errorEntries.length > 0 ? (
            <ul className="m-0 mt-2 list-disc ps-5">
              {errorEntries.map(({ name, message }) => (
                <li key={name}>
                  <a href={`#${fieldDomId(name)}`}>{message}</a>
                </li>
              ))}
            </ul>
          ) : null}
          {formError && errorEntries.length > 0 ? (
            <p className="m-0 mt-2">{formError}</p>
          ) : null}
        </div>
      ) : null}

      <div className="honeypot" aria-hidden="true">
        <label htmlFor={`${idPrefix}-company_website`}>Company website</label>
        <input
          type="text"
          id={`${idPrefix}-company_website`}
          name="company_website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <Field
        id={fieldDomId("name")}
        name="name"
        label={fields.name.label}
        autoComplete={fields.name.autocomplete}
        placeholder={fields.name.placeholder}
        value={values.name}
        error={fieldErrors.name}
        minLength={2}
        maxLength={80}
        disabled={isSubmitting}
        onChange={(value) => updateField("name", value)}
        onFocus={markFormStarted}
        onBlur={handleBlur}
      />

      <Field
        id={fieldDomId("firm_name")}
        name="firm_name"
        label={fields.firmName.label}
        autoComplete={fields.firmName.autocomplete}
        placeholder={fields.firmName.placeholder}
        value={values.firm_name}
        error={fieldErrors.firm_name}
        minLength={2}
        maxLength={120}
        disabled={isSubmitting}
        onChange={(value) => updateField("firm_name", value)}
        onFocus={markFormStarted}
        onBlur={handleBlur}
      />

      <Field
        id={fieldDomId("work_email")}
        name="work_email"
        label={fields.workEmail.label}
        type="email"
        autoComplete={fields.workEmail.autocomplete}
        placeholder={fields.workEmail.placeholder}
        value={values.work_email}
        error={fieldErrors.work_email}
        maxLength={254}
        disabled={isSubmitting}
        onChange={(value) => updateField("work_email", value)}
        onFocus={markFormStarted}
        onBlur={handleBlur}
      />

      <Field
        id={fieldDomId("website")}
        name="website"
        label={fields.website.label}
        autoComplete={fields.website.autocomplete}
        inputMode="url"
        placeholder={fields.website.placeholder}
        value={values.website}
        error={fieldErrors.website}
        disabled={isSubmitting}
        onChange={(value) => updateField("website", value)}
        onFocus={markFormStarted}
        onBlur={handleBlur}
      />

      <div className="request-submit">
        <button
          type="submit"
          className="btn btn-primary request-submit-btn"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting
            ? reviewRequest.submittingCta
            : reviewRequest.submitCta}
        </button>
        <p className="request-trust-line">{reviewRequest.trustLine}</p>
      </div>
    </form>
  );
}

type FieldProps = {
  id: string;
  name: FieldName;
  label: string;
  value: string;
  error?: string;
  type?: string;
  autoComplete?: string;
  inputMode?: "url" | "text" | "email";
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  disabled?: boolean;
  onChange: (value: string) => void;
  onFocus: () => void;
  onBlur: (event: FocusEvent<HTMLInputElement>) => void;
};

function Field({
  id,
  name,
  label,
  value,
  error,
  type = "text",
  autoComplete,
  inputMode,
  placeholder,
  minLength,
  maxLength,
  disabled,
  onChange,
  onFocus,
  onBlur,
}: FieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className={`field${error ? " field--error" : ""}`}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        required
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        minLength={minLength}
        maxLength={maxLength}
        value={value}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => onChange(event.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {error ? (
        <p id={errorId} className="field-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

const ATTRIBUTION_FALLBACK: StoredAttribution = {
  source: null,
  medium: null,
  campaign: null,
  content: null,
  term: null,
};

function readStoredAttribution(): StoredAttribution {
  return ensureAttributionCaptured() ?? ATTRIBUTION_FALLBACK;
}

function getReferrerDomain(): string | null {
  try {
    if (!document.referrer) return null;
    return new URL(document.referrer).hostname;
  } catch {
    return null;
  }
}
