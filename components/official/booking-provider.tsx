"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useReviewModal } from "@/components/landing/review-request-cta";
import {
  attributionProps,
  getDeviceCategory,
  trackEvent,
} from "@/lib/analytics";
import { loadCalendly, bookingPopupUrl, openCalendlyPopup } from "@/lib/booking";
import { usePracticeArea, type PracticeArea } from "@/components/official/practice-area";
import { landingCopy } from "@/lib/landing-copy";
import {
  isCalendlyEnabled,
} from "@/lib/calendly-config";

/** `header` is the existing header Apply button. Footer has no Apply button yet. */
export type BookingLocation =
  | "header"
  | "hero"
  | "how-it-works"
  | "personalised"
  | "firm-day"
  | "practice-card"
  | "final"
  | "footer";

const BOOKED_KEY = "sg_booked";

type BookingContextValue = {
  openBooking: (location: BookingLocation) => void;
  bookingOpen: boolean;
  booked: boolean;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function useBooking(): BookingContextValue {
  const value = useContext(BookingContext);
  if (!value) {
    throw new Error("useBooking must be used inside BookingProvider");
  }
  return value;
}

/** Legal pages share the footer but do not mount the booking popup. */
export function useBookingOptional(): BookingContextValue | null {
  return useContext(BookingContext);
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function readBookedFlag() {
  try {
    return sessionStorage.getItem(BOOKED_KEY) === "1";
  } catch {
    return false;
  }
}

function writeBookedFlag() {
  try {
    sessionStorage.setItem(BOOKED_KEY, "1");
  } catch {
    // Private mode — the thank-you state still shows for this visit.
  }
}

function bookingUtm(location: BookingLocation, practiceArea: PracticeArea | null) {
  return {
    utmSource: "standoutgroup.net",
    utmMedium: "landing-page",
    utmCampaign: "30-day-pilot",
    utmContent: practiceArea ?? "none",
    utmTerm: location,
  };
}

/**
 * One booking handler for every official CTA.
 * Calendly stays off the initial page load and warms on first intent.
 */
export function BookingProvider({ children }: { children: ReactNode }) {
  const { practiceArea } = usePracticeArea();
  const openModal = useReviewModal();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [booked, setBooked] = useState(false);
  const locationRef = useRef<BookingLocation>("final");
  const fromStorageRef = useRef(false);
  const pendingScrollRef = useRef(false);

  useEffect(() => {
    if (readBookedFlag()) {
      fromStorageRef.current = true;
      setBooked(true);
    }

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== "https://calendly.com") return;
      const data = event.data as { event?: string } | null;
      if (!data || typeof data.event !== "string") return;

      if (data.event === "calendly.event_scheduled") {
        writeBookedFlag();
        pendingScrollRef.current = true;
        setBooked(true);
        trackEvent("calendly_event_scheduled", {
          ...attributionProps(),
          cta_location: locationRef.current,
          device_category: getDeviceCategory(),
          embed_mode: "popup",
        });
      }

      if (data.event === "calendly.popup_closed") {
        setBookingOpen(false);
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    if (!bookingOpen) return;

    let seen = Boolean(document.querySelector(".calendly-overlay"));
    const observer = new MutationObserver(() => {
      const open = Boolean(document.querySelector(".calendly-overlay"));
      if (open) seen = true;
      if (seen && !open) {
        setBookingOpen(false);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [bookingOpen]);

  useEffect(() => {
    if (!booked || bookingOpen) return;
    if (fromStorageRef.current) {
      fromStorageRef.current = false;
      pendingScrollRef.current = false;
      return;
    }
    if (!pendingScrollRef.current) return;
    pendingScrollRef.current = false;

    const target = document.getElementById("book");
    target?.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
  }, [booked, bookingOpen]);

  useEffect(() => {
    let warmed = false;

    const warm = () => {
      if (warmed || !isCalendlyEnabled()) return;
      warmed = true;
      void loadCalendly().catch(() => {
        warmed = false;
      });
    };

    const onIntent = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest("[data-booking-cta]")) warm();
    };

    document.addEventListener("pointerenter", onIntent, true);
    document.addEventListener("touchstart", onIntent, {
      capture: true,
      passive: true,
    });
    document.addEventListener("focusin", onIntent);

    let cancelIdle = () => {};
    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (typeof idleWindow.requestIdleCallback === "function") {
      const id = idleWindow.requestIdleCallback(() => warm(), { timeout: 4000 });
      cancelIdle = () => idleWindow.cancelIdleCallback?.(id);
    } else {
      const id = window.setTimeout(warm, 4000);
      cancelIdle = () => window.clearTimeout(id);
    }

    return () => {
      document.removeEventListener("pointerenter", onIntent, true);
      document.removeEventListener("touchstart", onIntent, true);
      document.removeEventListener("focusin", onIntent);
      cancelIdle();
    };
  }, []);

  useEffect(() => {
    if (!bookingOpen) return;

    const noteId = "calendly-trust-microcopy";
    const text = landingCopy.reviewRequest.trustMicrocopy.gdpr;

    const place = () => {
      if (document.getElementById(noteId)) return;
      const popup = document.querySelector(".calendly-popup");
      if (!popup) return;
      const note = document.createElement("p");
      note.id = noteId;
      note.className = "t-small trust-microcopy trust-microcopy--popup";
      note.textContent = text;
      popup.appendChild(note);
    };

    place();
    const observer = new MutationObserver(place);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [bookingOpen]);

  const openBooking = useCallback(
    (location: BookingLocation) => {
      locationRef.current = location;
      trackEvent("review_cta_open", {
        ...attributionProps(),
        cta_location: location,
        device_category: getDeviceCategory(),
        landing_path: window.location.pathname,
        embed_mode: isCalendlyEnabled() ? "popup" : null,
      });

      if (!isCalendlyEnabled()) {
        const fallback =
          location === "header"
            ? "official_header"
            : location === "how-it-works"
              ? "official_how"
              : location === "personalised"
                ? "official_personalised"
                : "official_apply";
        openModal(null, fallback);
        return;
      }

      setBookingOpen(true);
      void openCalendlyPopup(bookingUtm(location, practiceArea)).catch(() => {
        setBookingOpen(false);
        const popupUrl = bookingPopupUrl(bookingUtm(location, practiceArea));
        if (popupUrl) {
          window.open(popupUrl, "_blank", "noopener,noreferrer");
        }
      });
    },
    [openModal, practiceArea],
  );

  const bookParamHandled = useRef(false);

  useEffect(() => {
    if (bookParamHandled.current) return;
    const url = new URL(window.location.href);
    if (url.searchParams.get("book") !== "1") return;
    bookParamHandled.current = true;
    url.searchParams.delete("book");
    const next = `${url.pathname}${url.search}${url.hash}`;
    window.history.replaceState(null, "", next);
    openBooking("footer");
  }, [openBooking]);

  return (
    <BookingContext.Provider value={{ openBooking, bookingOpen, booked }}>
      {children}
    </BookingContext.Provider>
  );
}
