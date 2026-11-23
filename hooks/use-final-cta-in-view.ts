"use client";

import { useSyncExternalStore } from "react";

let finalCtaInView = false;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return finalCtaInView;
}

function getServerSnapshot() {
  return false;
}

/** Publish whether the final CTA section is in view (Task 9). */
export function setFinalCtaInView(value: boolean) {
  if (finalCtaInView === value) return;
  finalCtaInView = value;
  listeners.forEach((listener) => listener());
}

/** Subscribe to final-CTA visibility for the nav enquiry button. */
export function useFinalCtaInView() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
