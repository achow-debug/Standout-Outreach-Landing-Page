import { Briefcase, KeyRound, ScrollText, Users } from "lucide-react";

export const practiceAreas = [
  {
    id: "family-law",
    label: "Family",
    icon: Users,
  },
  {
    id: "conveyancing",
    label: "Landlord Financing & Conveyancing",
    icon: KeyRound,
  },
  {
    id: "wills-probate",
    label: "Contentious Probate",
    icon: ScrollText,
  },
  {
    id: "employment",
    label: "Employment",
    icon: Briefcase,
  },
] as const;

export type PracticeAreaId = (typeof practiceAreas)[number]["id"];
