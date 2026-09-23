import { Source_Sans_3 } from "next/font/google";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AnalyticsProviderScript } from "@/components/landing/analytics-provider-script";
import { officialCopy } from "@/lib/official-copy";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-source-sans",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: officialCopy.meta.title,
  description: officialCopy.meta.description,
  metadataBase: new URL(siteConfig.productionDomain),
  alternates: {
    canonical: siteConfig.canonicalPath,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: officialCopy.meta.title,
    description: officialCopy.meta.description,
    url: siteConfig.canonicalPath,
    siteName: siteConfig.businessName,
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary",
    title: officialCopy.meta.title,
    description: officialCopy.meta.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className={sourceSans.variable} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://assets.calendly.com" />
        <link rel="preconnect" href="https://calendly.com" />
      </head>
      <body className="font-sans antialiased">
        {/*
          Enables CSS load/scroll motion only when JS runs and the visitor
          has not requested reduced motion. Without this class, content stays
          fully visible — no-JS never hides the value prop.
          Runs before paint; suppressHydrationWarning on <html> allows the
          early `motion-ok` class without a React hydration mismatch.
        */}
        <Script
          id="motion-ok"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.classList.add("motion-ok")}}catch(e){}})();`,
          }}
        />
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        {children}
        <AnalyticsProviderScript />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
