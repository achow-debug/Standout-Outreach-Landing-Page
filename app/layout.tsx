import localFont from "next/font/local";
import { Source_Sans_3, Source_Serif_4 } from "next/font/google";
import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AnalyticsProviderScript } from "@/components/landing/analytics-provider-script";
import { Providers } from "@/app/providers";
import { officialCopy } from "@/lib/official-copy";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";
import "./forms.css";
import "./demo.css";

const generalSans = localFont({
  src: [
    { path: "./fonts/GeneralSans-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/GeneralSans-Semibold.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-general-sans",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
  variable: "--font-source-sans",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-serif",
  preload: false,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F7F4EE",
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
    icon: [{ url: "/favicon.png", type: "image/png", sizes: "32x32" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
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
    <html
      lang="en-GB"
      className={`${generalSans.variable} ${sourceSans.variable} ${sourceSerif.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://assets.calendly.com" />
        <link rel="preconnect" href="https://calendly.com" />
      </head>
      <body className="font-sans antialiased bg-paper text-ink">
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <Providers>{children}</Providers>
        <AnalyticsProviderScript />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
