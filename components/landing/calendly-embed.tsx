"use client";

import { useEffect, useRef, useState } from "react";
import {
  attributionProps,
  getDeviceCategory,
  trackEvent,
} from "@/lib/analytics";
import {
  buildCalendlyEmbedUrl,
  CALENDLY_WIDGET_SCRIPT_SRC,
  CALENDLY_WIDGET_STYLESHEET_HREF,
  getCalendlyEmbedMode,
  getCalendlyEventUrl,
  type CalendlyPrefill,
} from "@/lib/calendly-config";
import { landingCopy } from "@/lib/landing-copy";
import { siteConfig } from "@/lib/site-config";
import type { CalendlyMessagePayload } from "@/types/calendly";

const SCRIPT_ID = "calendly-widget-js";
const STYLESHEET_ID = "calendly-widget-css";
const LOAD_TIMEOUT_MS = 8000;
const CALENDLY_ORIGIN = "https://calendly.com";

export type CalendlyCtaLocation = "inline_desktop" | "sticky_mobile";

type EmbedStatus = "loading" | "ready" | "error";

type CalendlyEmbedProps = {
  ctaLocation: CalendlyCtaLocation;
  /** Reserved for a future on-site pre-step. Unused in v1. */
  prefill?: CalendlyPrefill;
  onPopupClosed?: () => void;
};

let calendlyAssetsPromise: Promise<void> | null = null;

function loadCalendlyAssets(includeCss: boolean): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Calendly cannot load during SSR"));
  }
  if (window.Calendly) {
    return Promise.resolve();
  }
  if (calendlyAssetsPromise) {
    return calendlyAssetsPromise;
  }

  const pending = new Promise<void>((resolve, reject) => {
    if (includeCss && !document.getElementById(STYLESHEET_ID)) {
      const link = document.createElement("link");
      link.id = STYLESHEET_ID;
      link.rel = "stylesheet";
      link.href = CALENDLY_WIDGET_STYLESHEET_HREF;
      document.head.appendChild(link);
    }

    const existing = document.getElementById(SCRIPT_ID);
    if (existing instanceof HTMLScriptElement) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Calendly script failed")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = CALENDLY_WIDGET_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Calendly script failed"));
    document.body.appendChild(script);
  });

  calendlyAssetsPromise = pending;
  pending.catch(() => {
    calendlyAssetsPromise = null;
  });
  return pending;
}

function isCalendlyMessage(event: MessageEvent): boolean {
  return (
    event.origin === CALENDLY_ORIGIN &&
    typeof event.data === "object" &&
    event.data !== null &&
    "event" in event.data &&
    typeof (event.data as { event: unknown }).event === "string" &&
    (event.data as { event: string }).event.startsWith("calendly.")
  );
}

function calendlyEventName(event: MessageEvent): string | null {
  if (!isCalendlyMessage(event)) return null;
  return (event.data as { event: string }).event;
}

function titleInlineIframe(host: HTMLElement, title: string) {
  const iframe = host.querySelector("iframe");
  if (iframe && !iframe.getAttribute("title")) {
    iframe.setAttribute("title", title);
  }
}

/** Calendly’s default inline embed height; used until `page_height` arrives. */
const DEFAULT_EMBED_HEIGHT_PX = 700;

function parsePageHeightPx(payload: unknown): number | null {
  if (!payload || typeof payload !== "object" || !("height" in payload)) {
    return null;
  }
  const raw = (payload as { height?: unknown }).height;
  if (typeof raw === "number" && Number.isFinite(raw) && raw > 0) {
    return raw;
  }
  if (typeof raw === "string") {
    const parsed = Number.parseFloat(raw);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }
  return null;
}

function applyEmbedHeight(host: HTMLElement, px: number) {
  const next = `${Math.round(px)}px`;
  host.style.height = next;
  const iframe = host.querySelector("iframe");
  if (iframe) {
    iframe.style.height = next;
  }
}

export function CalendlyEmbed({
  ctaLocation,
  prefill,
  onPopupClosed,
}: CalendlyEmbedProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<EmbedStatus>("loading");
  const eventUrl = getCalendlyEventUrl();
  const embedMode = getCalendlyEmbedMode();
  const copy = landingCopy.reviewRequest.calendly;
  const contactEmail = siteConfig.contactEmail;

  useEffect(() => {
    if (!eventUrl) {
      setStatus("error");
      trackEvent("calendly_embed_error", {
        ...attributionProps(),
        cta_location: ctaLocation,
        device_category: getDeviceCategory(),
        embed_mode: embedMode,
      });
      return;
    }

    const bookingUrl = eventUrl;

    const host = hostRef.current;
    const isPopup = embedMode === "popup";
    let cancelled = false;
    let observer: MutationObserver | null = null;
    let timeoutId = 0;

    const embedUrl = buildCalendlyEmbedUrl(bookingUrl);

    function markReady() {
      if (cancelled) return;
      window.clearTimeout(timeoutId);
      setStatus("ready");
      if (host) {
        titleInlineIframe(host, copy.iframeTitle);
      }
    }

    function syncHeightFromPayload(payload: unknown) {
      if (!host) return;
      const px = parsePageHeightPx(payload);
      if (px) applyEmbedHeight(host, px);
    }

    function markError() {
      if (cancelled) return;
      window.clearTimeout(timeoutId);
      setStatus("error");
      trackEvent("calendly_embed_error", {
        ...attributionProps(),
        cta_location: ctaLocation,
        device_category: getDeviceCategory(),
        embed_mode: embedMode,
      });
      if (isPopup) {
        window.open(bookingUrl, "_blank", "noopener,noreferrer");
        onPopupClosed?.();
      }
    }

    function handleMessage(event: MessageEvent) {
      const name = calendlyEventName(event);
      if (!name) return;

      if (name === "calendly.page_height") {
        syncHeightFromPayload((event.data as CalendlyMessagePayload).payload);
        markReady();
        return;
      }

      if (
        name === "calendly.event_type_viewed" ||
        name === "calendly.popup_widget_ready"
      ) {
        markReady();
      }

      if (name === "calendly.event_scheduled") {
        trackEvent("calendly_event_scheduled", {
          ...attributionProps(),
          cta_location: ctaLocation,
          device_category: getDeviceCategory(),
          embed_mode: embedMode,
        });
      }

      if (name === "calendly.popup_closed") {
        onPopupClosed?.();
      }
    }

    window.addEventListener("message", handleMessage);

    timeoutId = window.setTimeout(() => {
      if (cancelled) return;
      if (host?.querySelector("iframe") || (isPopup && window.Calendly)) {
        markReady();
        return;
      }
      markError();
    }, LOAD_TIMEOUT_MS);

    loadCalendlyAssets(isPopup)
      .then(() => {
        if (cancelled || !window.Calendly) {
          markError();
          return;
        }

        if (isPopup) {
          window.Calendly.initPopupWidget({
            url: embedUrl,
            prefill,
          });
          return;
        }

        if (!host) {
          markError();
          return;
        }

        host.replaceChildren();
        applyEmbedHeight(host, DEFAULT_EMBED_HEIGHT_PX);
        window.Calendly.initInlineWidget({
          url: embedUrl,
          parentElement: host,
          prefill,
        });

        titleInlineIframe(host, copy.iframeTitle);
        observer = new MutationObserver(() => {
          titleInlineIframe(host, copy.iframeTitle);
          const iframe = host.querySelector("iframe");
          if (iframe && !iframe.style.height) {
            applyEmbedHeight(host, DEFAULT_EMBED_HEIGHT_PX);
          }
        });
        observer.observe(host, { childList: true, subtree: true });
      })
      .catch(() => {
        markError();
      });

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
      window.removeEventListener("message", handleMessage);
      observer?.disconnect();
      host?.replaceChildren();
      if (isPopup) {
        window.Calendly?.closePopupWidget?.();
      }
    };
  }, [
    copy.iframeTitle,
    ctaLocation,
    embedMode,
    eventUrl,
    onPopupClosed,
    prefill,
  ]);

  if (!eventUrl) {
    return null;
  }

  if (embedMode === "popup") {
    return null;
  }

  return (
    <div className="calendly-embed">
      {status === "loading" ? (
        <p className="calendly-embed-status" role="status">
          {copy.loading}
        </p>
      ) : null}

      {status === "error" ? (
        <div className="calendly-embed-fallback" role="alert">
          <p className="calendly-embed-fallback-heading">{copy.fallbackHeading}</p>
          <p className="calendly-embed-fallback-body">{copy.fallbackBody}</p>
          <a
            className="calendly-embed-fallback-link"
            href={eventUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {copy.fallbackLink}
          </a>
          <p className="calendly-embed-fallback-email">
            {copy.emailFallback.replace("{email}", contactEmail)}
          </p>
        </div>
      ) : null}

      <div
        ref={hostRef}
        className="calendly-embed-host"
        hidden={status === "error"}
      />
    </div>
  );
}
