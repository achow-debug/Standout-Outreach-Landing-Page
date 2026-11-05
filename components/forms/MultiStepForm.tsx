"use client";

import {
  useEffect,
  useId,
  useReducer,
  useRef,
  type FormEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { ActionBar } from "@/components/forms/ActionBar";
import { StepIndicator } from "@/components/forms/StepIndicator";
import { TextField } from "@/components/forms/fields/TextField";
import { SelectField } from "@/components/forms/fields/SelectField";
import { MultiSelectField } from "@/components/forms/fields/MultiSelectField";
import { TextareaField } from "@/components/forms/fields/TextareaField";
import {
  OTHER,
  PRIVACY_HREF,
  fillThankYouBody,
  firstNameFromFullName,
  type FormConfig,
  type FormId,
} from "@/lib/forms/config";
import {
  EMPTY_FORM_VALUES,
  buildCompletePayload,
  normalizeWebsite,
  validateStep,
  type FieldErrors,
  type FormValues,
  type StepIndex,
} from "@/lib/forms/validation";

type FormState = {
  step: StepIndex;
  values: FormValues;
  errors: FieldErrors;
  liveFields: Set<keyof FormValues>;
  submitting: boolean;
  submitError: string | null;
  completed: boolean;
  fadeKey: number;
};

type Action =
  | {
      type: "setField";
      name: keyof FormValues;
      value: FormValues[keyof FormValues];
    }
  | { type: "setErrors"; errors: FieldErrors; live?: (keyof FormValues)[] }
  | { type: "goToStep"; step: StepIndex }
  | { type: "submitStart" }
  | { type: "submitFail" }
  | { type: "submitSuccess" };

function createInitialState(): FormState {
  return {
    step: 0,
    values: { ...EMPTY_FORM_VALUES },
    errors: {},
    liveFields: new Set(),
    submitting: false,
    submitError: null,
    completed: false,
    fadeKey: 0,
  };
}

function reducer(state: FormState, action: Action): FormState {
  switch (action.type) {
    case "setField": {
      const values = {
        ...state.values,
        [action.name]: action.value,
      } as FormValues;

      if (action.name === "noWebsite" && action.value === true) {
        values.website = "";
      }

      return { ...state, values, submitError: null };
    }
    case "setErrors": {
      const liveFields = new Set(state.liveFields);
      for (const key of action.live ?? (Object.keys(action.errors) as (keyof FormValues)[])) {
        liveFields.add(key);
      }
      return { ...state, errors: action.errors, liveFields };
    }
    case "goToStep":
      return {
        ...state,
        step: action.step,
        errors: {},
        submitError: null,
        fadeKey: state.fadeKey + 1,
      };
    case "submitStart":
      return { ...state, submitting: true, submitError: null };
    case "submitFail":
      return { ...state, submitting: false, submitError: "failed" };
    case "submitSuccess":
      return {
        ...state,
        submitting: false,
        completed: true,
        submitError: null,
        fadeKey: state.fadeKey + 1,
      };
    default:
      return state;
  }
}

function getFieldOrder(step: StepIndex, formId: FormId): (keyof FormValues)[] {
  if (step === 0) return ["email"];
  if (step === 1) {
    return formId === "enquiry-check"
      ? ["fullName", "website", "areasOfLaw"]
      : ["fullName", "website", "feeEarners"];
  }
  return ["helpWith", "details"];
}

type MultiStepFormProps = {
  config: FormConfig;
};

export function MultiStepForm({ config }: MultiStepFormProps) {
  const formId = config.id as FormId;
  const idPrefix = useId().replace(/:/g, "");
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);

  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const thankYouHeadingRef = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const emailedRef = useRef<string | null>(null);
  const pendingFocusRef = useRef<"step" | "thankYou" | "invalid" | null>(null);
  const firstInvalidIdRef = useRef<string | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  const stepConfig = config.steps[state.step];
  const isLastStep = state.step === config.steps.length - 1;
  const primaryLabel = isLastStep ? config.submitLabel : "Continue";
  const detailsRequired = state.values.helpWith === OTHER;

  useEffect(() => {
    const target = pendingFocusRef.current;
    if (!target) return;
    pendingFocusRef.current = null;

    if (target === "step" && stepHeadingRef.current) {
      stepHeadingRef.current.focus();
    } else if (target === "thankYou" && thankYouHeadingRef.current) {
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      thankYouHeadingRef.current.focus();
    } else if (target === "invalid" && firstInvalidIdRef.current) {
      const el = document.getElementById(firstInvalidIdRef.current);
      if (el instanceof HTMLElement) {
        el.focus();
      }
    }
  }, [state.step, state.errors, state.completed, state.fadeKey]);

  function fieldDomId(name: string) {
    return `${idPrefix}-${name}`;
  }

  function setField<K extends keyof FormValues>(name: K, value: FormValues[K]) {
    const prev = stateRef.current;
    const nextValues = { ...prev.values, [name]: value } as FormValues;
    if (name === "noWebsite" && value === true) {
      nextValues.website = "";
    }

    dispatch({ type: "setField", name, value });

    if (prev.liveFields.has(name) || (name === "noWebsite" && prev.liveFields.has("website"))) {
      const stepErrors = validateStep(formId, prev.step, nextValues);
      const nextErrors: FieldErrors = { ...prev.errors };

      for (const key of prev.liveFields) {
        if (stepErrors[key]) {
          nextErrors[key] = stepErrors[key];
        } else {
          delete nextErrors[key];
        }
      }

      if (name === "noWebsite" && value === true) {
        delete nextErrors.website;
      }

      // Always refresh the field that just changed if it was live.
      if (prev.liveFields.has(name)) {
        if (stepErrors[name]) {
          nextErrors[name] = stepErrors[name];
        } else {
          delete nextErrors[name];
        }
      }

      dispatch({ type: "setErrors", errors: nextErrors, live: [] });
    }
  }

  function saveEmailEarly(email: string) {
    if (emailedRef.current === email) return;
    emailedRef.current = email;

    void fetch("/api/forms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        form: formId,
        stage: "email",
        email,
        submittedAt: new Date().toISOString(),
      }),
      keepalive: true,
    }).catch(() => {
      // Never surface early-save failures.
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const errors = validateStep(formId, state.step, state.values);
    if (Object.keys(errors).length > 0) {
      const order = getFieldOrder(state.step, formId);
      firstInvalidIdRef.current = null;
      for (const name of order) {
        if (errors[name]) {
          firstInvalidIdRef.current = fieldDomId(name);
          break;
        }
      }
      pendingFocusRef.current = "invalid";
      dispatch({ type: "setErrors", errors });
      return;
    }

    if (state.step === 0) {
      saveEmailEarly(state.values.email.trim());
      pendingFocusRef.current = "step";
      dispatch({ type: "goToStep", step: 1 });
      return;
    }

    if (!isLastStep) {
      pendingFocusRef.current = "step";
      dispatch({ type: "goToStep", step: (state.step + 1) as StepIndex });
      return;
    }

    dispatch({ type: "submitStart" });

    try {
      const payload = buildCompletePayload(formId, state.values);
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        dispatch({ type: "submitFail" });
        return;
      }

      pendingFocusRef.current = "thankYou";
      dispatch({ type: "submitSuccess" });
    } catch {
      dispatch({ type: "submitFail" });
    }
  }

  function handleBack() {
    if (state.step === 0) return;
    pendingFocusRef.current = "step";
    dispatch({ type: "goToStep", step: (state.step - 1) as StepIndex });
  }

  if (state.completed) {
    const firstName = firstNameFromFullName(state.values.fullName);
    const websiteDisplay =
      normalizeWebsite(state.values.website)?.replace(/^https?:\/\//, "") ??
      state.values.website;
    const body = fillThankYouBody(config.thankYou.body, {
      firstName,
      website: websiteDisplay,
      email: state.values.email.trim(),
    });

    return (
      <div
        ref={cardRef}
        className="form-card rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-soft)] sm:p-8"
      >
        <div className="form-step-fade" key={state.fadeKey}>
          <h2
            ref={thankYouHeadingRef}
            tabIndex={-1}
            className="text-h3 text-ink outline-none"
          >
            {firstName ? `Thank you, ${firstName}` : "Thank you"}
          </h2>
          <p className="mt-3 text-body text-ink-muted">{body}</p>

          {config.thankYou.nextSteps && config.thankYou.nextSteps.length > 0 ? (
            <ol className="mt-6 list-decimal space-y-2 pl-5 text-body text-ink">
              {config.thankYou.nextSteps.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          ) : null}

          <p className="mt-6 text-body text-ink">
            {config.thankYou.soonerLabel}{" "}
            <a
              href={config.thankYou.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand underline underline-offset-4 hover:text-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              {config.thankYou.whatsappLabel}
            </a>
            {" · "}
            <a
              href={config.thankYou.emailHref}
              className="font-semibold text-brand underline underline-offset-4 hover:text-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              {config.thankYou.emailLabel}
            </a>
          </p>

          <p className="mt-8">
            <Link
              href="/"
              className="font-semibold text-brand underline underline-offset-4 hover:text-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              {config.thankYou.homeLabel}
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      className="form-card rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-soft)] sm:p-8"
    >
      <h2 className="text-center text-lg font-bold text-ink sm:text-xl">
        {config.cardHeading}
      </h2>

      <div className="mt-5">
        <StepIndicator
          currentStep={state.step}
          totalSteps={config.steps.length}
        />
      </div>

      <form noValidate onSubmit={handleSubmit} className="mt-6 relative">
        <div className="form-step-fade" key={state.fadeKey}>
          <h3
            ref={stepHeadingRef}
            tabIndex={-1}
            className="sr-only outline-none"
          >
            {stepConfig.srHeading}
          </h3>

          <div className="flex flex-col gap-5">
            {stepConfig.fields.map((field) =>
              renderField({
                field,
                values: state.values,
                errors: state.errors,
                fieldDomId,
                setField,
                detailsRequired,
                websiteDisabled:
                  formId === "speak-to-alex" && state.values.noWebsite,
              }),
            )}
          </div>

          {stepConfig.notice ? (
            <p className="mt-4 text-sm text-ink-muted">
              {stepConfig.notice}{" "}
              <Link
                href={PRIVACY_HREF}
                className="font-semibold text-brand underline underline-offset-2 hover:text-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                Privacy Policy
              </Link>
            </p>
          ) : null}

          {stepConfig.consent ? (
            <p className="mt-4 text-sm text-ink-muted">
              {stepConfig.consent}{" "}
              <Link
                href={PRIVACY_HREF}
                className="font-semibold text-brand underline underline-offset-2 hover:text-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                Privacy Policy
              </Link>
            </p>
          ) : null}

          <div
            aria-hidden="true"
            className="absolute h-px w-px overflow-hidden whitespace-nowrap [clip:rect(0,0,0,0)]"
          >
            <label htmlFor={fieldDomId("company_fax")}>Company fax</label>
            <input
              id={fieldDomId("company_fax")}
              name="company_fax"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={state.values.company_fax}
              onChange={(e) => setField("company_fax", e.target.value)}
            />
          </div>
        </div>

        <ActionBar
          step={state.step}
          primaryLabel={primaryLabel}
          submitting={state.submitting}
          submitError={state.submitError}
          onBack={handleBack}
        />
      </form>
    </div>
  );
}

type RenderFieldArgs = {
  field: FormConfig["steps"][number]["fields"][number];
  values: FormValues;
  errors: FieldErrors;
  fieldDomId: (name: string) => string;
  setField: <K extends keyof FormValues>(name: K, value: FormValues[K]) => void;
  detailsRequired: boolean;
  websiteDisabled: boolean;
};

function renderField({
  field,
  values,
  errors,
  fieldDomId,
  setField,
  detailsRequired,
  websiteDisabled,
}: RenderFieldArgs): ReactNode {
  switch (field.kind) {
    case "email":
    case "text":
    case "website":
      return (
        <TextField
          key={field.name}
          kind={field.kind}
          id={fieldDomId(field.name)}
          name={field.name}
          label={field.label}
          placeholder={field.placeholder}
          helper={field.helper}
          required={field.required}
          value={String(values[field.name as keyof FormValues] ?? "")}
          onChange={(v) => setField(field.name as keyof FormValues, v as never)}
          error={errors[field.name as keyof FormValues]}
          disabled={field.kind === "website" ? websiteDisabled : false}
        />
      );
    case "select":
      return (
        <SelectField
          key={field.name}
          id={fieldDomId(field.name)}
          name={field.name}
          label={field.label}
          options={field.options}
          required={field.required}
          value={String(values[field.name as keyof FormValues] ?? "")}
          onChange={(v) => setField(field.name as keyof FormValues, v as never)}
          error={errors[field.name as keyof FormValues]}
        />
      );
    case "multiselect":
      return (
        <MultiSelectField
          key={field.name}
          id={fieldDomId(field.name)}
          name={field.name}
          label={field.label}
          helper={field.helper}
          options={field.options}
          required={field.required}
          value={values.areasOfLaw}
          onChange={(v) => setField("areasOfLaw", v)}
          error={errors.areasOfLaw}
        />
      );
    case "checkbox":
      return (
        <label
          key={field.name}
          htmlFor={fieldDomId(field.name)}
          className="flex cursor-pointer items-start gap-3 text-base text-ink"
        >
          <input
            id={fieldDomId(field.name)}
            name={field.name}
            type="checkbox"
            checked={values.noWebsite}
            onChange={(e) => setField("noWebsite", e.target.checked)}
            className="mt-1 size-4 shrink-0 accent-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          />
          <span>{field.label}</span>
        </label>
      );
    case "details":
      return (
        <TextareaField
          key={field.name}
          id={fieldDomId("details")}
          name="details"
          label={
            detailsRequired
              ? "Please specify"
              : "Anything else we should know?"
          }
          optional={!detailsRequired}
          required={detailsRequired}
          value={values.details}
          onChange={(v) => setField("details", v)}
          error={errors.details}
        />
      );
    default:
      return null;
  }
}
