import { z } from "zod";
import { dpaRequest } from "@/content/landing";

export const DPA_EMAIL_ERROR = dpaRequest.invalidEmail;

const emailField = z
  .string({ required_error: DPA_EMAIL_ERROR, invalid_type_error: DPA_EMAIL_ERROR })
  .trim()
  .min(1, DPA_EMAIL_ERROR)
  .max(254, DPA_EMAIL_ERROR)
  .email(DPA_EMAIL_ERROR)
  .transform((value) => value.toLowerCase());

/** Visitor payload. The honeypot must stay empty. */
export const dpaRequestSchema = z.object({
  email: emailField,
  company_website: z.string().optional().default(""),
});

export type DpaRequestInput = z.infer<typeof dpaRequestSchema>;
