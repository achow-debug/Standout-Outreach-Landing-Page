"use client";

import { useCallback } from "react";
import {
  useBooking,
  type BookingLocation,
} from "@/components/official/booking-provider";

/**
 * Primary and secondary CTAs, defined once for the nav and the hero.
 * Both call the existing openBooking handler. Start for free reuses that
 * popup until its destination is confirmed — swap only startForFree.
 * `location` stays the call site so booking analytics keep their current values.
 */
export function useCtaActions(location: BookingLocation) {
  const { openBooking } = useBooking();

  const startForFree = useCallback(() => {
    openBooking(location);
  }, [location, openBooking]);

  const speakToAlex = useCallback(() => {
    openBooking(location);
  }, [location, openBooking]);

  return { startForFree, speakToAlex };
}
