import { KeyRound, ScrollText, Users } from "lucide-react";

export const practiceAreas = [
  {
    id: "family-law",
    label: "Family Law",
    shortLabel: "Family Law",
    icon: Users,
  },
  {
    id: "conveyancing",
    label: "Residential Conveyancing",
    shortLabel: "Conveyancing",
    icon: KeyRound,
  },
  {
    id: "wills-probate",
    label: "Wills, Probate & Private Client",
    shortLabel: "Wills & Probate",
    icon: ScrollText,
  },
] as const;

export type PracticeAreaId = (typeof practiceAreas)[number]["id"];
