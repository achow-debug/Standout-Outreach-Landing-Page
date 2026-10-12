"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type PracticeArea =
  | "family"
  | "conveyancing"
  | "wills-probate-private-client";

type PracticeAreaContextValue = {
  practiceArea: PracticeArea | null;
  setPracticeArea: (practiceArea: PracticeArea) => void;
};

const PracticeAreaContext = createContext<PracticeAreaContextValue | null>(null);

/**
 * Set by the practice-area cards. Stays selected so later bookings
 * send it as utm_content.
 */
export function PracticeAreaProvider({ children }: { children: ReactNode }) {
  const [practiceArea, setPracticeArea] = useState<PracticeArea | null>(null);
  const value = useMemo(
    () => ({ practiceArea, setPracticeArea }),
    [practiceArea],
  );

  return (
    <PracticeAreaContext.Provider value={value}>
      {children}
    </PracticeAreaContext.Provider>
  );
}

export function usePracticeArea(): PracticeAreaContextValue {
  const value = useContext(PracticeAreaContext);
  if (!value) {
    throw new Error("usePracticeArea must be used inside PracticeAreaProvider");
  }
  return value;
}
