import type { NextConfig } from "next";

/**
 * Security headers for the outreach microsite.
 * Keep submission same-origin. Calendly is framed only as an embed (no Scheduling API).
 * Cross-Origin-Opener-Policy: same-origin is compatible with the inline iframe;
 * if popup mode breaks in Safari, COOP is the first header to revisit.
 */
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "img-src 'self' data: blob: https://calendly.com https://*.calendly.com",
      "media-src 'self' blob:",
      "font-src 'self' data: https://assets.calendly.com",
      "style-src 'self' 'unsafe-inline' https://assets.calendly.com",
      "script-src 'self' 'unsafe-inline' https://plausible.io https://assets.calendly.com https://www.google.com https://www.gstatic.com",
      "connect-src 'self' https://plausible.io https://calendly.com https://api.calendly.com",
      "frame-src https://calendly.com https://www.google.com",
      "upgrade-insecure-requests",
    ].join("; "),
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/video/:path*",
        headers: [
          {
            key: "Accept-Ranges",
            value: "bytes",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/legal-enquiry-review",
        destination: "/",
        permanent: true,
      },
      {
        source: "/legal-enquiry-journey-review",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
