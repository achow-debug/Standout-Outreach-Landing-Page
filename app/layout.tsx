import { Source_Sans_3 } from "next/font/google";
import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AnalyticsProviderScript } from "@/components/landing/analytics-provider-script";
import { landingCopy } from "@/lib/landing-copy";
import { siteConfig } from "@/lib/site-config";
import { getVideoAssetStatus } from "@/lib/video-assets";
import "./globals.css";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-sans",
});

const posterAvailable = getVideoAssetStatus().poster;

export const metadata: Metadata = {
  title: landingCopy.meta.title,
  description: landingCopy.meta.description,
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
    title: landingCopy.meta.title,
    description: landingCopy.meta.description,
    url: siteConfig.canonicalPath,
    siteName: siteConfig.businessName,
    type: "website",
    locale: "en_GB",
    ...(posterAvailable
      ? {
          images: [
            {
              url: siteConfig.video.posterPath,
              width: 1280,
              height: 720,
              alt: "Legal Enquiry Review video poster",
            },
          ],
        }
      : {}),
  },
  twitter: {
    card: posterAvailable ? "summary_large_image" : "summary",
    title: landingCopy.meta.title,
    description: landingCopy.meta.description,
    ...(posterAvailable ? { images: [siteConfig.video.posterPath] } : {}),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className={sourceSans.variable} suppressHydrationWarning>
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
