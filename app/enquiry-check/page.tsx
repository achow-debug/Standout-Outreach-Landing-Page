import type { Metadata, Viewport } from "next";
import { FormPageLayout } from "@/components/forms/FormPageLayout";
import { enquiryCheckForm } from "@/lib/forms/config";

export const metadata: Metadata = {
  title: "Free enquiry check | Standout Group",
  description: enquiryCheckForm.subline,
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

export default function EnquiryCheckPage() {
  return <FormPageLayout config={enquiryCheckForm} />;
}
