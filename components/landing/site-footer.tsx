"use client";

import Link from "next/link";
import { useEffect, type ReactNode } from "react";
import { useBookingOptional } from "@/components/official/booking-provider";
import {
  DpaRequestProvider,
  DpaRequestTrigger,
  useDpaRequestOptional,
} from "@/components/official/dpa-request";
import { openSourcesSection } from "@/components/official/source-button";
import { credentials } from "@/content/landing";
import { siteConfig } from "@/lib/site-config";

const ASK_AI_PROMPT = "How can Standout Group, the law firm growth partner, help me?";
const askAiQuery = encodeURIComponent(ASK_AI_PROMPT);
const LINKEDIN_URL = "https://uk.linkedin.com/showcase/standoutgroup/";

const siteLinks = [
  { href: "/#who-its-for", label: "Who we partner with" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#founder", label: "Founder" },
  { href: "/#faqs", label: "FAQs" },
] as const;

const askAiLinks = [
  {
    href: `https://chatgpt.com/?q=${askAiQuery}`,
    label: "Ask ChatGPT about Standout Group (opens in new tab)",
    tooltip: "Ask ChatGPT",
    icon: "chatgpt",
  },
  {
    href: `https://claude.ai/new?q=${askAiQuery}`,
    label: "Ask Claude about Standout Group (opens in new tab)",
    tooltip: "Ask Claude",
    icon: "claude",
  },
  {
    href: `https://www.perplexity.ai/search?q=${askAiQuery}`,
    label: "Ask Perplexity about Standout Group (opens in new tab)",
    tooltip: "Ask Perplexity",
    icon: "perplexity",
  },
] as const;

function FooterDpaBoundary({ children }: { children: ReactNode }) {
  const existing = useDpaRequestOptional();
  if (existing) return children;
  return <DpaRequestProvider>{children}</DpaRequestProvider>;
}

function FooterBookingControl({
  label,
  cta,
  className,
}: {
  label: string;
  cta: "start-free" | "speak-to-alex";
  className: string;
}) {
  const booking = useBookingOptional();

  if (!booking) {
    return (
      <Link className={className} href="/?book=1">
        {label}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={className}
      data-cta={cta}
      data-booking-cta=""
      disabled={cta === "start-free" && booking.booked}
      onClick={() => booking.openBooking("footer")}
    >
      {cta === "start-free" && booking.booked ? "Call booked" : label}
    </button>
  );
}

function FooterSourcesLink() {
  return (
    <a
      className="site-footer-link"
      href="/#sources"
      onClick={(event) => {
        const section = document.getElementById("sources");
        if (!(section instanceof HTMLDetailsElement)) return;
        event.preventDefault();
        openSourcesSection();
      }}
    >
      Sources & methodology
    </a>
  );
}

/**
 * Dark site footer. Mission and primary action, Site and Contact columns,
 * and a single legal bar.
 */
export function SiteFooter() {
  return (
    <FooterDpaBoundary>
      <SiteFooterContent />
    </FooterDpaBoundary>
  );
}

function SiteFooterContent() {
  const year = new Date().getFullYear();
  const icoNumber = credentials.icoNumber.replace("Registration number ", "");

  useEffect(() => {
    if (window.location.hash !== "#sources") return;
    openSourcesSection();
  }, []);

  return (
    <footer className="site-footer" id="site-footer">
      <div className="page-shell site-footer-inner">
        <div className="site-footer-top">
          <div className="site-footer-brand">
            <p className="site-footer-mission">
              Established firms shouldn’t have to choose between the expertise that
              built them and the technology to compete.
            </p>
            <FooterBookingControl
              label="Start for free"
              cta="start-free"
              className="btn btn-primary site-footer-cta"
            />
          </div>

          <nav className="site-footer-group" aria-label="Site">
            <p className="site-footer-group-title">Site</p>
            <div className="site-footer-group-list">
              {siteLinks.map((item) => (
                <a key={item.href} className="site-footer-link" href={item.href}>
                  {item.label}
                </a>
              ))}
              <FooterSourcesLink />
            </div>
          </nav>

          <div className="site-footer-contact">
            <nav className="site-footer-group site-footer-group--contact" aria-label="Contact">
              <p className="site-footer-group-title">Contact</p>
              <div className="site-footer-group-list">
                <a
                  className="site-footer-link site-footer-link--nowrap"
                  href={`mailto:${siteConfig.contactEmail}`}
                >
                  {siteConfig.contactEmail}
                </a>
                <a
                  className="site-footer-link site-footer-link--nowrap"
                  href={siteConfig.contactWhatsAppHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp {siteConfig.contactPhone}
                </a>
                <FooterBookingControl
                  label="Speak to Alex"
                  cta="speak-to-alex"
                  className="site-footer-link"
                />
              </div>
            </nav>

            <div className="site-footer-social">
              <FooterIconLink
                href={LINKEDIN_URL}
                label="Standout Group on LinkedIn (opens in new tab)"
                tooltip="LinkedIn"
              >
                <LinkedInMark />
              </FooterIconLink>
              <span className="site-footer-social-rule" aria-hidden="true" />
              <span className="site-footer-social-caption">Ask AI about us</span>
              <span className="site-footer-ask-icons">
                {askAiLinks.map((item) => {
                  const Icon = askAiIcons[item.icon];
                  return (
                    <FooterIconLink
                      key={item.icon}
                      href={item.href}
                      label={item.label}
                      tooltip={item.tooltip}
                    >
                      <Icon />
                    </FooterIconLink>
                  );
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="site-footer-bar">
          <p className="site-footer-copy t-small">
            © {year} Standout Group · Sheffield ·{" "}
            <span className="site-footer-nowrap">ICO {icoNumber}</span>
          </p>
          <nav className="site-footer-legal" aria-label="Legal">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/compliance">Compliance</Link>
            <DpaRequestTrigger>Request DPA</DpaRequestTrigger>
          </nav>
        </div>
      </div>
    </footer>
  );
}

function FooterIconLink({
  href,
  label,
  tooltip,
  children,
}: {
  href: string;
  label: string;
  tooltip: string;
  children: ReactNode;
}) {
  return (
    <a
      className="site-footer-icon"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      data-tooltip={tooltip}
    >
      {children}
    </a>
  );
}

function BrandMark({ children, viewBox }: { children: ReactNode; viewBox: string }) {
  return (
    <svg viewBox={viewBox} aria-hidden="true" focusable="false">
      {children}
    </svg>
  );
}

/** Official LinkedIn [in] bug, traced from the brand-kit InBug and drawn in one colour. */
function LinkedInMark() {
  return (
    <BrandMark viewBox="0 0 260 260">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M13 0H247A13 13 0 0 1 260 13V247A13 13 0 0 1 247 260H13A13 13 0 0 1 0 247V13A13 13 0 0 1 13 0Z M77 159.5V98H39V221H77V159.5Z M140.19 183.25L140.5 145.5L143.32 139.75C147.18 131.9 152.61 128.63 161.92 128.55C174.02 128.45 179.78 133.77 181.93 147C182.52 150.63 182.99 168.41 182.99 187.25L183 221H221V180.63C221 136.54 220.21 127.53 215.41 117.04C211.95 109.46 208.67 105.47 202.66 101.49C195.78 96.94 187.6 94.92 176 94.89C161.05 94.85 152.04 98.65 143.02 108.77L138 114.4V98H101V221H139.89L140.19 183.25Z M64.6 79.53C70.22 77.86 75.19 73.51 78.18 67.64C79.78 64.51 80.13 62.25 79.83 56.98C79.37 48.81 76.2 43.37 69.69 39.56C60.74 34.31 50.91 35.28 43.46 42.14C37.76 47.39 35.53 53.18 36.31 60.7C37.22 69.49 42.82 76.39 51.56 79.51C56.64 81.32 58.56 81.32 64.6 79.53Z"
      />
    </BrandMark>
  );
}

/** OpenAI Blossom from the 2025 brand kit — the ChatGPT product mark. */
function ChatGptMark() {
  return (
    <BrandMark viewBox="118.557 119.958 484.139 479.818">
      <path
        fill="currentColor"
        d="M304.246 294.611V249.028C304.246 245.189 305.687 242.309 309.044 240.392L400.692 187.612C413.167 180.415 428.042 177.058 443.394 177.058C500.971 177.058 537.44 221.682 537.44 269.182C537.44 272.54 537.44 276.379 536.959 280.218L441.954 224.558C436.197 221.201 430.437 221.201 424.68 224.558L304.246 294.611ZM518.245 472.145V363.224C518.245 356.505 515.364 351.707 509.608 348.349L389.174 278.296L428.519 255.743C431.877 253.826 434.757 253.826 438.115 255.743L529.762 308.523C556.154 323.879 573.905 356.505 573.905 388.171C573.905 424.636 552.315 458.225 518.245 472.141V472.145ZM275.937 376.182L236.592 353.152C233.235 351.235 231.794 348.354 231.794 344.515V238.956C231.794 187.617 271.139 148.749 324.4 148.749C344.555 148.749 363.264 155.468 379.102 167.463L284.578 222.164C278.822 225.521 275.942 230.319 275.942 237.039V376.186L275.937 376.182ZM360.626 425.122L304.246 393.455V326.283L360.626 294.616L417.002 326.283V393.455L360.626 425.122ZM396.852 570.989C376.698 570.989 357.989 564.27 342.151 552.276L436.674 497.574C442.431 494.217 445.311 489.419 445.311 482.699V343.552L485.138 366.582C488.495 368.499 489.936 371.379 489.936 375.219V480.778C489.936 532.117 450.109 570.985 396.852 570.985V570.989ZM283.134 463.99L191.486 411.211C165.094 395.854 147.343 363.229 147.343 331.562C147.343 294.616 169.415 261.509 203.48 247.593V356.991C203.48 363.71 206.361 368.508 212.117 371.866L332.074 441.437L292.729 463.99C289.372 465.907 286.491 465.907 283.134 463.99ZM277.859 542.68C223.639 542.68 183.813 501.895 183.813 451.514C183.813 447.675 184.294 443.836 184.771 439.997L279.295 494.698C285.051 498.056 290.812 498.056 296.568 494.698L417.002 425.127V470.71C417.002 474.549 415.562 477.429 412.204 479.346L320.557 532.126C308.081 539.323 293.206 542.68 277.854 542.68H277.859ZM396.852 599.776C454.911 599.776 503.37 558.513 514.41 503.812C568.149 489.896 602.696 439.515 602.696 388.176C602.696 354.587 588.303 321.962 562.392 298.45C564.791 288.373 566.231 278.296 566.231 268.224C566.231 199.611 510.571 148.267 446.274 148.267C433.322 148.267 420.846 150.184 408.37 154.505C386.775 133.392 357.026 119.958 324.4 119.958C266.342 119.958 217.883 161.22 206.843 215.921C153.104 229.837 118.557 280.218 118.557 331.557C118.557 365.146 132.95 397.771 158.861 421.283C156.462 431.36 155.022 441.437 155.022 451.51C155.022 520.123 210.682 571.466 274.978 571.466C287.931 571.466 300.407 569.549 312.883 565.228C334.473 586.341 364.222 599.776 396.852 599.776Z"
      />
    </BrandMark>
  );
}

/** Claude starburst from Anthropic's symbol. */
function ClaudeMark() {
  return (
    <BrandMark viewBox="0 0 100 100">
      <path
        fill="currentColor"
        d="m19.6 66.5 19.7-11 .3-1-.3-.5h-1l-3.3-.2-11.2-.3L14 53l-9.5-.5-2.4-.5L0 49l.2-1.5 2-1.3 2.9.2 6.3.5 9.5.6 6.9.4L38 49.1h1.6l.2-.7-.5-.4-.4-.4L29 41l-10.6-7-5.6-4.1-3-2-1.5-2-.6-4.2 2.7-3 3.7.3.9.2 3.7 2.9 8 6.1L37 36l1.5 1.2.6-.4.1-.3-.7-1.1L33 25l-6-10.4-2.7-4.3-.7-2.6c-.3-1-.4-2-.4-3l3-4.2L28 0l4.2.6L33.8 2l2.6 6 4.1 9.3L47 29.9l2 3.8 1 3.4.3 1h.7v-.5l.5-7.2 1-8.7 1-11.2.3-3.2 1.6-3.8 3-2L61 2.6l2 2.9-.3 1.8-1.1 7.7L59 27.1l-1.5 8.2h.9l1-1.1 4.1-5.4 6.9-8.6 3-3.5L77 13l2.3-1.8h4.3l3.1 4.7-1.4 4.9-4.4 5.6-3.7 4.7-5.3 7.1-3.2 5.7.3.4h.7l12-2.6 6.4-1.1 7.6-1.3 3.5 1.6.4 1.6-1.4 3.4-8.2 2-9.6 2-14.3 3.3-.2.1.2.3 6.4.6 2.8.2h6.8l12.6 1 3.3 2 1.9 2.7-.3 2-5.1 2.6-6.8-1.6-16-3.8-5.4-1.3h-.8v.4l4.6 4.5 8.3 7.5L89 80.1l.5 2.4-1.3 2-1.4-.2-9.2-7-3.6-3-8-6.8h-.5v.7l1.8 2.7 9.8 14.7.5 4.5-.7 1.4-2.6 1-2.7-.6-5.8-8-6-9-4.7-8.2-.5.4-2.9 30.2-1.3 1.5-3 1.2-2.5-2-1.4-3 1.4-6.2 1.6-8 1.3-6.4 1.2-7.9.7-2.6v-.2H49L43 72l-9 12.3-7.2 7.6-1.7.7-3-1.5.3-2.8L24 86l10-12.8 6-7.9 4-4.6-.1-.5h-.3L17.2 77.4l-4.7.6-2-2 .2-3 1-1 8-5.5Z"
      />
    </BrandMark>
  );
}

/** Perplexity asterisk mark. */
function PerplexityMark() {
  return (
    <BrandMark viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M22.3977 7.0896h-2.3106V.0676l-7.5094 6.3542V.1577h-1.1554v6.1966L4.4904 0v7.0896H1.6023v10.3976h2.8882V24l6.932-6.3591v6.2005h1.1554v-6.0469l6.9318 6.1807v-6.4879h2.8882V7.0896zm-3.4657-4.531v4.531h-5.355l5.355-4.531zm-13.2862.0676 4.8691 4.4634H5.6458V2.6262zM2.7576 16.332V8.245h7.8476l-6.1149 6.1147v1.9723H2.7576zm2.8882 5.0404v-3.8852h.0001v-2.6488l5.7763-5.7764v7.0111l-5.7764 5.2993zm12.7086.0248-5.7766-5.1509V9.0618l5.7766 5.7766v6.5588zm2.8882-5.0652h-1.733v-1.9723L13.3948 8.245h7.8478v8.087z"
      />
    </BrandMark>
  );
}

const askAiIcons = {
  chatgpt: ChatGptMark,
  claude: ClaudeMark,
  perplexity: PerplexityMark,
} as const;
