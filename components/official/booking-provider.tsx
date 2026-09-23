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
import { loadCalendly, openCalendlyPopup } from "@/lib/booking";
import {
  getCalendlyEventUrl,
  isCalendlyEnabled,
} from "@/lib/calendly-config";

export type BookingLocation = "header" | "hero" | "how" | "sticky" | "final";

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

/**
 * One booking handler for every official CTA.
 * Calendly stays off the initial page load and warms on first intent.
 */
export function BookingProvider({ children }: { children: ReactNode }) {
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
            : location === "how"
              ? "official_how"
              : location === "sticky"
                ? "sticky_mobile"
                : "official_apply";
        openModal(null, fallback);
        return;
      }

      setBookingOpen(true);
      void openCalendlyPopup().catch(() => {
        setBookingOpen(false);
        const eventUrl = getCalendlyEventUrl();
        if (eventUrl) {
          window.open(eventUrl, "_blank", "noopener,noreferrer");
        }
      });
    },
    [openModal],
  );

  return (
    <BookingContext.Provider value={{ openBooking, bookingOpen, booked }}>
      {children}
    </BookingContext.Provider>
  );
}
