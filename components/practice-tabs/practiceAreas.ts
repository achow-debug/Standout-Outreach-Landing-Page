import type { LucideIcon } from "lucide-react";
import { Briefcase, Globe, KeyRound, ScrollText, Users } from "lucide-react";
import type { PracticeArea } from "@/components/official/practice-area";
import { whoItsFor } from "@/content/landing";

type PracticeCard = (typeof whoItsFor.cards)[number];

export type PracticeAreaId =
  | "family-law"
  | "conveyancing"
  | "wills-probate"
  | "employment"
  | "immigration";

export type PracticeAreaEntry = {
  id: PracticeAreaId;
  label: string;
  icon: LucideIcon;
  /** Sent with later bookings as utm_content. */
  bookingArea: PracticeArea;
  /** Finished copy where it already exists. New areas stay empty. */
  card: PracticeCard | null;
};

function cardById(id: PracticeCard["id"]): PracticeCard {
  const card = whoItsFor.cards.find((item) => item.id === id);
  if (!card) {
    throw new Error(`Missing practice-area copy: ${id}`);
  }
  return card;
}

export const practiceAreas: readonly PracticeAreaEntry[] = [
  {
    id: "family-law",
    label: "Family",
    icon: Users,
    bookingArea: "family",
    card: cardById("practice-family"),
  },
  {
    id: "conveyancing",
    label: "Landlord Financing & Conveyancing",
    icon: KeyRound,
    bookingArea: "conveyancing",
    card: cardById("practice-conveyancing"),
  },
  {
    id: "wills-probate",
    label: "Contentious Probate",
    icon: ScrollText,
    bookingArea: "wills-probate-private-client",
    card: cardById("practice-wills"),
  },
  {
    id: "employment",
    label: "Employment",
    icon: Briefcase,
    bookingArea: "employment",
    card: null,
  },
  {
    id: "immigration",
    label: "Immigration",
    icon: Globe,
    bookingArea: "immigration",
    card: null,
  },
];
