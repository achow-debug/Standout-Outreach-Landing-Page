import type { Metadata, Viewport } from "next";
import { FormPageLayout } from "@/components/forms/FormPageLayout";
import { speakToAlexForm } from "@/lib/forms/config";

export const metadata: Metadata = {
  title: "Speak to Alex | Standout Group",
  description: speakToAlexForm.subline,
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

export default function SpeakToAlexPage() {
  return <FormPageLayout config={speakToAlexForm} />;
}
