import Script from "next/script";

/**
 * Optional Plausible loader. Renders nothing when analytics is disabled.
 * Lazy-loaded so it does not compete with LCP / video poster.
 */
export function AnalyticsProviderScript() {
  const provider = (
    process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER ?? "none"
  ).toLowerCase();
  const domain =
    process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN ??
    process.env.NEXT_PUBLIC_ANALYTICS_ID;

  if (provider !== "plausible" || !domain) {
    return null;
  }

  return (
    <Script
      defer
      data-domain={domain}
      src="https://plausible.io/js/script.tagged-events.js"
      strategy="lazyOnload"
    />
  );
}
