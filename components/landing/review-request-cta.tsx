"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { ReviewRequestForm } from "@/components/landing/review-request-form";
import { landingCopy } from "@/lib/landing-copy";

type OpenFn = (trigger: HTMLButtonElement | null) => void;

const ReviewModalContext = createContext<OpenFn | null>(null);

/**
 * Owns the enquiry modal and exposes open() to the page CTA.
 */
export function ReviewRequestShell({ children }: { children: ReactNode }) {
  const { reviewRequest, confirmation } = landingCopy;
  const titleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const [formKey, setFormKey] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [initialError, setInitialError] = useState<string | null>(null);
  const completedRef = useRef(false);

  const openModal = useCallback((trigger: HTMLButtonElement | null) => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    lastTriggerRef.current = trigger;
    if (dialog.open) return;
    document.documentElement.classList.add("modal-open");
    dialog.showModal();
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    function handleClose() {
      document.documentElement.classList.remove("modal-open");
      if (completedRef.current) {
        completedRef.current = false;
        setIsComplete(false);
        setFormKey((key) => key + 1);
      }
      const trigger = lastTriggerRef.current;
      requestAnimationFrame(() => {
        trigger?.focus();
      });
    }

    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, []);

  useEffect(() => {
    if (isComplete) {
      successRef.current?.focus();
    }
  }, [isComplete]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("request");
    if (!status) return;

    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      document.documentElement.classList.add("modal-open");
      if (status === "received") {
        completedRef.current = true;
        setIsComplete(true);
      } else if (status === "error") {
        setInitialError(landingCopy.reviewRequest.submitError);
      }
      dialog.showModal();
    }

    params.delete("request");
    const next = `${window.location.pathname}${params.toString() ? `?${params}` : ""}${window.location.hash}`;
    window.history.replaceState({}, "", next);
  }, []);

  function closeModal() {
    dialogRef.current?.close();
  }

  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  }

  function handleComplete() {
    completedRef.current = true;
    setInitialError(null);
    setIsComplete(true);
  }

  return (
    <ReviewModalContext.Provider value={openModal}>
      {children}

      <dialog
        ref={dialogRef}
        className="review-modal"
        aria-labelledby={titleId}
        onClick={handleBackdropClick}
      >
        <div className="review-modal-panel">
          <header className="review-modal-header">
            <div className="review-modal-heading">
              <h2 id={titleId} className="review-modal-title">
                {isComplete ? confirmation.heading : reviewRequest.heading}
              </h2>
              {!isComplete ? (
                <p className="review-modal-subtitle">{reviewRequest.subtitle}</p>
              ) : null}
            </div>
            <button
              type="button"
              className="review-modal-close"
              onClick={closeModal}
              aria-label="Close"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </header>

          <div className="review-modal-body">
            {isComplete ? (
              <div
                ref={successRef}
                className="review-modal-success"
                role="status"
                aria-live="polite"
                tabIndex={-1}
              >
                <p className="review-modal-success-body">{confirmation.body}</p>
              </div>
            ) : (
              <ReviewRequestForm
                key={formKey}
                initialError={initialError}
                onComplete={handleComplete}
              />
            )}
          </div>
        </div>
      </dialog>
    </ReviewModalContext.Provider>
  );
}

/**
 * Single high-impact page CTA that opens the shared enquiry modal.
 */
export function ReviewRequestCta() {
  const { cta } = landingCopy;
  const openModal = useContext(ReviewModalContext);
  const buttonRef = useRef<HTMLButtonElement>(null);

  if (!openModal) {
    throw new Error("ReviewRequestCta must be used inside ReviewRequestShell");
  }

  return (
    <section
      className="cta-section hidden md:block"
      aria-label="Request a review"
    >
      <button
        ref={buttonRef}
        type="button"
        className="btn btn-primary btn-cta"
        onClick={() => openModal(buttonRef.current)}
      >
        <span>{cta.label}</span>
        <span className="btn-cta-arrow" aria-hidden="true">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
          </svg>
        </span>
      </button>
      <p className="cta-microcopy text-slate-900">{cta.microcopy}</p>
    </section>
  );
}

/**
 * Fixed bottom dock for mobile viewports — always-available conversion CTA.
 */
export function MobileStickyCta() {
  const { cta } = landingCopy;
  const openModal = useContext(ReviewModalContext);
  const buttonRef = useRef<HTMLButtonElement>(null);

  if (!openModal) {
    throw new Error("MobileStickyCta must be used inside ReviewRequestShell");
  }

  return (
    <div
      className="mobile-cta-bar fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200/80 bg-white/85 p-4 shadow-lg backdrop-blur-md md:hidden"
      role="region"
      aria-label="Request a review"
    >
      <button
        ref={buttonRef}
        type="button"
        className="btn btn-primary btn-cta mobile-cta-bar-btn"
        onClick={() => openModal(buttonRef.current)}
      >
        {cta.mobileLabel}
      </button>
    </div>
  );
}
