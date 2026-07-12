"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { ReviewRequestForm } from "@/components/landing/review-request-form";
import { landingCopy } from "@/lib/landing-copy";

/**
 * Single page CTA that opens the enquiry-review form in a native modal dialog.
 */
export function ReviewRequestCta() {
  const { cta, reviewRequest, confirmation } = landingCopy;
  const titleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const [formKey, setFormKey] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [initialError, setInitialError] = useState<string | null>(null);
  const completedRef = useRef(false);

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
      requestAnimationFrame(() => {
        ctaRef.current?.focus();
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

  function openModal() {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    document.documentElement.classList.add("modal-open");
    dialog.showModal();
  }

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
    <section className="cta-section" aria-label="Request a review">
      <button
        ref={ctaRef}
        type="button"
        className="btn btn-primary btn-cta"
        onClick={openModal}
      >
        {cta.label}
      </button>

      <dialog
        ref={dialogRef}
        className="review-modal"
        aria-labelledby={titleId}
        onClick={handleBackdropClick}
      >
        <div className="review-modal-panel">
          <header className="review-modal-header">
            <h2 id={titleId} className="review-modal-title">
              {isComplete ? confirmation.heading : reviewRequest.heading}
            </h2>
            <button
              type="button"
              className="review-modal-close"
              onClick={closeModal}
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
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
    </section>
  );
}
