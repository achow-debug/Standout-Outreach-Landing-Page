"use client";

import {
  createContext,
  useCallback,
  useContext,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { dpaRequest } from "@/content/landing";
import { dpaRequestSchema } from "@/lib/dpa-request-schema";
import { Sheet } from "@/components/official/sheet";

type DpaRequestContextValue = {
  openDpaRequest: () => void;
};

const DpaRequestContext = createContext<DpaRequestContextValue | null>(null);

export function useDpaRequest(): DpaRequestContextValue {
  const value = useContext(DpaRequestContext);
  if (!value) {
    throw new Error("useDpaRequest must be used within DpaRequestProvider");
  }
  return value;
}

/** The homepage already provides this. Other pages that share the footer do not. */
export function useDpaRequestOptional(): DpaRequestContextValue | null {
  return useContext(DpaRequestContext);
}

const PRIVACY_LINK = "Privacy Policy";
const ERROR_EMAIL = "achow@standoutgroup.net";

function PrivacyNote() {
  const text = dpaRequest.privacy;
  const index = text.indexOf(PRIVACY_LINK);
  if (index < 0) return <p className="dpa-privacy">{text}</p>;

  return (
    <p className="dpa-privacy">
      {text.slice(0, index)}
      <Link className="dpa-privacy-link" href="/privacy">
        {PRIVACY_LINK}
      </Link>
      {text.slice(index + PRIVACY_LINK.length)}
    </p>
  );
}

function ErrorNote() {
  const text = dpaRequest.error;
  const index = text.indexOf(ERROR_EMAIL);
  if (index < 0) return <>{text}</>;

  return (
    <>
      {text.slice(0, index)}
      <a className="dpa-mail" href={`mailto:${ERROR_EMAIL}`}>
        {ERROR_EMAIL}
      </a>
      {text.slice(index + ERROR_EMAIL.length)}
    </>
  );
}

function DpaRequestForm({ onSent }: { onSent: (email: string) => void }) {
  const emailId = useId();
  const errorId = useId();
  const honeypotId = useId();
  const formErrorId = useId();
  const sendingRef = useRef(false);
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [formError, setFormError] = useState(false);
  const [sending, setSending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sendingRef.current) return;

    const honeypot =
      new FormData(event.currentTarget).get("company_website")?.toString() ?? "";
    const parsed = dpaRequestSchema.safeParse({
      email,
      company_website: honeypot,
    });

    if (!parsed.success) {
      setFieldError(dpaRequest.invalidEmail);
      setFormError(false);
      return;
    }

    sendingRef.current = true;
    setSending(true);
    setFieldError(null);
    setFormError(false);

    try {
      const response = await fetch("/api/dpa-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: parsed.data.email,
          company_website: parsed.data.company_website,
        }),
      });

      if (response.status === 400) {
        setFieldError(dpaRequest.invalidEmail);
        return;
      }

      const body = (await response.json().catch(() => null)) as
        | { ok?: boolean }
        | null;

      if (!response.ok || !body?.ok) {
        setFormError(true);
        return;
      }

      onSent(parsed.data.email);
    } catch {
      setFormError(true);
    } finally {
      sendingRef.current = false;
      setSending(false);
    }
  }

  return (
    <form className="dpa-form" noValidate onSubmit={onSubmit}>
      <p className="dpa-intro">{dpaRequest.intro}</p>
      <div className={fieldError ? "field field--error" : "field"}>
        <label htmlFor={emailId}>{dpaRequest.emailLabel}</label>
        <input
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-required="true"
          aria-invalid={fieldError ? true : undefined}
          aria-describedby={fieldError ? errorId : undefined}
          value={email}
          disabled={sending}
          onChange={(event) => {
            setEmail(event.target.value);
            if (fieldError) setFieldError(null);
          }}
        />
        {fieldError ? (
          <p id={errorId} className="field-error" role="alert">
            {fieldError}
          </p>
        ) : null}
      </div>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor={honeypotId}>Company website</label>
        <input
          id={honeypotId}
          name="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>
      <PrivacyNote />
      {formError ? (
        <p id={formErrorId} className="dpa-form-error" role="alert">
          <ErrorNote />
        </p>
      ) : null}
      <button
        className="btn btn-primary dpa-submit"
        type="submit"
        disabled={sending}
        aria-busy={sending || undefined}
      >
        {sending ? <span className="dpa-spinner" aria-hidden="true" /> : null}
        {dpaRequest.submit}
      </button>
    </form>
  );
}

function DpaRequestBody() {
  const [sentEmail, setSentEmail] = useState<string | null>(null);

  if (sentEmail) {
    return (
      <p className="dpa-success" role="status">
        {dpaRequest.success.replace("{email}", sentEmail)}
      </p>
    );
  }

  return <DpaRequestForm onSent={setSentEmail} />;
}

function DpaRequestSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [session, setSession] = useState(0);

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) setSession((current) => current + 1);
      }}
      title={dpaRequest.title}
    >
      <DpaRequestBody key={session} />
    </Sheet>
  );
}

export function DpaRequestProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openDpaRequest = useCallback(() => setOpen(true), []);

  return (
    <DpaRequestContext.Provider value={{ openDpaRequest }}>
      {children}
      <DpaRequestSheet open={open} onOpenChange={setOpen} />
    </DpaRequestContext.Provider>
  );
}

export function DpaRequestTrigger({
  className,
  children,
  closeOtherFirst,
}: {
  className?: string;
  children: ReactNode;
  /** Close another sheet first so two dialogs are not open together. */
  closeOtherFirst?: () => void;
}) {
  const { openDpaRequest } = useDpaRequest();

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        if (closeOtherFirst) {
          closeOtherFirst();
          window.setTimeout(openDpaRequest, 0);
          return;
        }
        openDpaRequest();
      }}
    >
      {children}
    </button>
  );
}
