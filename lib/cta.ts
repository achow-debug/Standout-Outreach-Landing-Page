"use client";

import { useCallback } from "react";
import {
  useReviewModal,
  type CtaLocation,
} from "@/components/landing/review-request-cta";
import {
  useBooking,
  type BookingLocation,
} from "@/components/official/booking-provider";

function formLocation(location: BookingLocation): CtaLocation {
  if (location === "header") return "official_header";
  if (location === "hero") return "official_hero";
  if (location === "how-it-works") return "official_how";
  return "official_apply";
}

/**
 * Shared actions for the nav and the hero.
 * The primary action opens the enquiry form and does not book a call.
 * Speak to Alex remains a booking for any caller that still asks for a conversation.
 */
export function useCtaActions(location: BookingLocation) {
  const { openBooking } = useBooking();
  const openModal = useReviewModal();

  const startForFree = useCallback(
    (trigger: HTMLButtonElement | null = null) => {
      openModal(trigger, formLocation(location), { formOnly: true });
    },
    [location, openModal],
  );

  const speakToAlex = useCallback(() => {
    openBooking(location);
  }, [location, openBooking]);

  return { startForFree, speakToAlex };
}
