/**
 * Public reCAPTCHA v2 site key for the enquiry demo submit step.
 * Safe for the client bundle (NEXT_PUBLIC_*).
 */
export function getRecaptchaSiteKey(): string | null {
  const key = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim();
  return key ? key : null;
}

export function isRecaptchaEnabled(): boolean {
  return Boolean(getRecaptchaSiteKey());
}
