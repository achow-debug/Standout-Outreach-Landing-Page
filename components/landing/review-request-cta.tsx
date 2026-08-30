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
import { VIDEO_COMPLETE_EVENT } from "@/lib/landing-events";
import { ReviewRequestForm } from "@/components/landing/review-request-form";
import { CalendlyEmbed } from "@/components/landing/calendly-embed";
import {
  attributionProps,
  getDeviceCategory,
  trackEvent,
} from "@/lib/analytics";
import {
  getCalendlyEmbedMode,
  isCalendlyEnabled,
} from "@/lib/calendly-config";
import { landingCopy } from "@/lib/landing-copy";
import { siteConfig } from "@/lib/site-config";

type CtaLocation = "inline_desktop" | "sticky_mobile";

type OpenFn = (
  trigger: HTMLButtonElement | null,
  location: CtaLocation,
) => void;

const ReviewModalContext = createContext<OpenFn | null>(null);

function useVideoCompleteFlag() {
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    function handleComplete() {
      setComplete(true);
    }

    window.addEventListener(VIDEO_COMPLETE_EVENT, handleComplete);
    return () => {
      window.removeEventListener(VIDEO_COMPLETE_EVENT, handleComplete);
    };
  }, []);

  return complete;
}

/**
 * Unlocks the mobile sticky CTA once the visitor scrolls toward the video.
 * Requires a small scroll so the dock never competes with the first impression,
 * even when the video partially fits in the initial viewport.
 * Fails open if the target is missing so conversion is never blocked.
 */
function useStickyCtaUnlocked() {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const target = document.getElementById("video");
    if (!target) {
      setUnlocked(true);
      return;
    }

    const unlock = () => setUnlocked(true);

    function check() {
      const el = document.getElementById("video");
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // First paint often shows part of the video; only unlock once the visitor
      // has scrolled, or the video has moved into the active reading band.
      const engaged =
        window.scrollY >= 24 || rect.top < window.innerHeight * 0.45;
      const videoApproaching = rect.top < window.innerHeight * 0.9;
      if (engaged && videoApproaching) {
        unlock();
        window.removeEventListener("scroll", check);
        window.removeEventListener("resize", check);
      }
    }

    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    check();

    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  return unlocked;
}

/** True when an element participates in layout (not `display: none`). */
function isLayoutVisible(el: Element): boolean {
  return window.getComputedStyle(el).display !== "none";
}

/**
 * Sticky dock visibility after unlock:
 * visible through video / trust / methodology; hide only in a small clearance
 * zone around an equivalent on-screen CTA or the footer (not when merely
 * reading trust). Modal open is handled separately via `html.modal-open`.
 */
function useStickyCtaSuppressed() {
  const [suppressed, setSuppressed] = useState(false);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;

    function clearanceRootMargin(): string {
      const raw = getComputedStyle(document.documentElement)
        .getPropertyValue("--mobile-sticky-cta-height")
        .trim();
      const dockPx = Number.parseFloat(raw) || 88;
      // Shrink the root from the bottom by the dock footprint so we only
      // suppress when the landmark enters the area above the dock (about to
      // be covered) — not while it merely peeks under the dock on short pages.
      return `0px 0px -${dockPx + 24}px 0px`;
    }

    function collectTargets(): Element[] {
      const targets: Element[] = [];
      const footer = document.querySelector(".site-footer");
      if (footer instanceof Element) targets.push(footer);

      // Equivalent in-page CTA only when it is a real on-screen peer.
      // On mobile `#final-cta` is `hidden md:block` — must not suppress.
      const finalCta = document.getElementById("final-cta");
      if (finalCta instanceof Element && isLayoutVisible(finalCta)) {
        targets.push(finalCta);
      }
      return targets;
    }

    function bind() {
      observer?.disconnect();
      observer = null;

      const targets = collectTargets();
      if (targets.length === 0) {
        setSuppressed(false);
        return;
      }

      const visibility = new Map<Element, boolean>();
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            visibility.set(entry.target, entry.isIntersecting);
          }
          setSuppressed([...visibility.values()].some(Boolean));
        },
        { root: null, threshold: 0, rootMargin: clearanceRootMargin() },
      );

      for (const target of targets) {
        visibility.set(target, false);
        observer.observe(target);
      }
    }

    bind();
    // Re-bind when `#final-cta` crosses the md visibility breakpoint.
    window.addEventListener("resize", bind);
    return () => {
      window.removeEventListener("resize", bind);
      observer?.disconnect();
    };
  }, []);

  return suppressed;
}

/**
 * Owns the enquiry modal and exposes open() to the page CTA.
 */
export function ReviewRequestShell({ children }: { children: ReactNode }) {
  const { reviewRequest, confirmation } = landingCopy;
  const titleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const lastLocationRef = useRef<CtaLocation>("inline_desktop");
  const successRef = useRef<HTMLDivElement>(null);
  const [formKey, setFormKey] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [initialError, setInitialError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const completedRef = useRef(false);
  const [standout, group] = siteConfig.businessName.split(" ");
  const calendlyEnabled = isCalendlyEnabled();
  const calendlyMode = getCalendlyEmbedMode();

  const openModal = useCallback(
    (trigger: HTMLButtonElement | null, location: CtaLocation) => {
      lastTriggerRef.current = trigger;
      lastLocationRef.current = location;

      trackEvent("review_cta_open", {
        ...attributionProps(),
        cta_location: location,
        device_category: getDeviceCategory(),
        landing_path:
          typeof window !== "undefined" ? window.location.pathname : "/",
        embed_mode: calendlyEnabled ? calendlyMode : null,
      });

      if (calendlyEnabled && calendlyMode === "popup") {
        document.documentElement.classList.add("modal-open");
        setDialogOpen(true);
        return;
      }

      const dialog = dialogRef.current;
      if (!dialog) return;
      if (dialog.open) return;

      document.documentElement.classList.add("modal-open");
      dialog.showModal();
      setDialogOpen(true);
    },
    [calendlyEnabled, calendlyMode],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    function handleClose() {
      document.documentElement.classList.remove("modal-open");
      setDialogOpen(false);
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
    if (calendlyEnabled) return;

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
      setDialogOpen(true);
    }

    params.delete("request");
    const next = `${window.location.pathname}${params.toString() ? `?${params}` : ""}${window.location.hash}`;
    window.history.replaceState({}, "", next);
  }, [calendlyEnabled]);

  function closeModal() {
    dialogRef.current?.close();
  }

  const handlePopupClosed = useCallback(() => {
    document.documentElement.classList.remove("modal-open");
    setDialogOpen(false);
    const trigger = lastTriggerRef.current;
    requestAnimationFrame(() => {
      trigger?.focus();
    });
  }, []);

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

      {calendlyEnabled && calendlyMode === "popup" && dialogOpen ? (
        <CalendlyEmbed
          ctaLocation={lastLocationRef.current}
          onPopupClosed={handlePopupClosed}
        />
      ) : null}

      <dialog
        ref={dialogRef}
        className={`review-modal${calendlyEnabled ? " review-modal--calendly" : ""}`}
        aria-labelledby={calendlyEnabled ? undefined : titleId}
        aria-label={
          calendlyEnabled ? reviewRequest.calendly.iframeTitle : undefined
        }
        onClick={handleBackdropClick}
      >
        <div className="review-modal-panel">
          <header className="review-modal-header">
            <div className="review-modal-heading">
              <p className="review-modal-brand brand-mark">
                <span className="brand-mark-name">
                  {standout}{" "}
                  <span className="brand-mark-accent">{group}</span>
                </span>
              </p>
              {calendlyEnabled ? null : (
                <h2 id={titleId} className="review-modal-title">
                  {isComplete ? confirmation.heading : reviewRequest.heading}
                </h2>
              )}
            </div>
            <button
              type="button"
              className="review-modal-close"
              onClick={closeModal}
              aria-label="Close"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
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
            {calendlyEnabled ? (
              calendlyMode === "inline" && dialogOpen ? (
                <CalendlyEmbed ctaLocation={lastLocationRef.current} />
              ) : null
            ) : isComplete ? (
              <div
                ref={successRef}
                className="review-modal-success"
                role="status"
                aria-live="polite"
                tabIndex={-1}
              >
                <p className="review-modal-success-body">{confirmation.body}</p>
                {siteConfig.reviewDeliveryTiming ? (
                  <p className="review-modal-success-timing">
                    {confirmation.timingPrefix}{" "}
                    {siteConfig.reviewDeliveryTiming}.
                  </p>
                ) : null}
              </div>
            ) : (
              <ReviewRequestForm
                key={formKey}
                initialError={initialError}
                onComplete={handleComplete}
              />
            )}
          </div>

          {calendlyEnabled ? (
            <footer className="review-modal-footer">
              <p className="review-modal-footer-copy">
                <span>{landingCopy.footer.copyrightShort}</span>
                <span className="review-modal-footer-sep" aria-hidden="true">
                  {" "}
                  ·{" "}
                </span>
                <span>{landingCopy.footer.compliance}</span>
                <span className="review-modal-footer-sep" aria-hidden="true">
                  {" "}
                  ·{" "}
                </span>
                <a href="/privacy" className="review-modal-footer-link">
                  {reviewRequest.privacyLinkLabel}
                </a>
              </p>
            </footer>
          ) : null}
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
  const videoComplete = useVideoCompleteFlag();

  if (!openModal) {
    throw new Error("ReviewRequestCta must be used inside ReviewRequestShell");
  }

  return (
    <section
      id="final-cta"
      className="cta-section hidden md:block"
      aria-label="Claim a free strategy call"
      data-reveal
    >
      {videoComplete ? (
        <p className="cta-after-video-cue" role="status">
          {cta.afterVideoCue}
        </p>
      ) : null}
      <button
        ref={buttonRef}
        type="button"
        className="btn btn-primary btn-cta"
        onClick={() => openModal(buttonRef.current, "inline_desktop")}
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
    </section>
  );
}

/**
 * Fixed bottom dock for mobile — unlocks near the video, stays visible through
 * trust/methodology, and hides only in the clearance zone around a visible
 * equivalent in-page CTA or the footer (also hidden while the modal is open).
 */
export function MobileStickyCta() {
  const { cta } = landingCopy;
  const openModal = useContext(ReviewModalContext);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const unlocked = useStickyCtaUnlocked();
  const suppressed = useStickyCtaSuppressed();
  const isVisible = unlocked && !suppressed;

  useEffect(() => {
    document.documentElement.classList.toggle(
      "sticky-cta-clearance",
      isVisible,
    );
    return () => {
      document.documentElement.classList.remove("sticky-cta-clearance");
    };
  }, [isVisible]);

  if (!openModal) {
    throw new Error("MobileStickyCta must be used inside ReviewRequestShell");
  }

  return (
    <div
      className={`mobile-sticky-cta-wrapper md:hidden${isVisible ? " is-visible" : ""}`}
      role="region"
      aria-label="Claim a free strategy call"
      aria-hidden={!isVisible}
      inert={!isVisible}
    >
      <div className="mobile-sticky-cta">
        <button
          ref={buttonRef}
          type="button"
          className="btn btn-primary btn-cta mobile-cta-bar-btn"
          tabIndex={isVisible ? 0 : -1}
          onClick={() => openModal(buttonRef.current, "sticky_mobile")}
        >
          {cta.label}
        </button>
      </div>
    </div>
  );
}
