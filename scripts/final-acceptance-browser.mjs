/**
 * Final redesign acceptance browser checks.
 * Requires: production or dev server at BASE_URL, and playwright-core.
 *
 *   npx -y playwright-core@1.49.1 install # not required when using system Chrome
 *   BASE_URL=http://127.0.0.1:3456 node scripts/final-acceptance-browser.mjs
 */

import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright-core");

const BASE_URL = process.env.BASE_URL ?? "http://127.0.0.1:3456";
const CHROME =
  process.env.CHROME_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const browser = await chromium.launch({
  executablePath: CHROME,
  headless: true,
});
const page = await browser.newPage();
const report = { baseUrl: BASE_URL, checks: [] };

function record(id, pass, detail = "") {
  report.checks.push({ id, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"}  ${id}${detail ? ` — ${detail}` : ""}`);
}

async function gotoHome(width = 1280, height = 900) {
  await page.setViewportSize({ width, height });
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
}

/** Scroll to the video so the deferred mobile sticky CTA unlocks. */
async function unlockMobileStickyCta() {
  await page.evaluate(() => {
    document.getElementById("video")?.scrollIntoView({
      block: "center",
      behavior: "instant",
    });
  });
  await page.waitForSelector(".mobile-sticky-cta-wrapper.is-visible", { timeout: 5000 });
}

// Overflow across plan widths
for (const width of [375, 430, 768, 1024, 1440]) {
  await gotoHome(width, 900);
  const metrics = await page.evaluate(() => ({
    overflow:
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth + 1,
    h1Overflow: (() => {
      const el = document.querySelector(".hero-title");
      return el ? el.scrollWidth > el.clientWidth + 1 : null;
    })(),
    brandOverflow: (() => {
      const el = document.querySelector(".brand-mark-name");
      return el ? el.scrollWidth > el.clientWidth + 1 : null;
    })(),
  }));
  record(
    `overflow_${width}`,
    !metrics.overflow && !metrics.h1Overflow && !metrics.brandOverflow,
    JSON.stringify(metrics),
  );
}

await gotoHome(390, 844);

// Scope / copy
const scope = await page.evaluate(() => {
  const text = document.body.innerText;
  const sticky = document.querySelector(".mobile-sticky-cta-wrapper");
  return {
    h1Count: document.querySelectorAll("h1").length,
    h1: document.querySelector("h1")?.textContent?.trim() ?? "",
    footer: document.querySelector(".site-footer-copy")?.textContent?.trim() ?? "",
    stickyDeferred: sticky
      ? !sticky.classList.contains("is-visible")
      : false,
    dialogCount: document.querySelectorAll(
      "dialog.review-modal:not(.info-dialog)",
    ).length,
    banned: [
      "Book a strategy call",
      "transcript",
      "MIT study",
      "Helping UK law firms convert more",
    ].filter((s) => text.toLowerCase().includes(s.toLowerCase())),
    hasPrivacyLinkInFooter: Boolean(
      document.querySelector('.site-footer a[href="/privacy"]'),
    ),
    hasCookieSettings: /cookie settings/i.test(text),
  };
});
record("single_h1", scope.h1Count === 1, scope.h1);
record(
  "approved_h1",
  scope.h1 ===
    "Our analysis of 100+ UK law firms found 70% are losing over £100K a year to unfollowed enquiries",
);
record(
  "footer_exact",
  scope.footer === "© 2026 Standout Group. All rights reserved.",
);
record("sticky_cta_deferred_until_video", scope.stickyDeferred);
record("dialog_present", scope.dialogCount === 1);
record("no_banned_copy", scope.banned.length === 0, scope.banned.join(", "));
record("privacy_link_in_footer", scope.hasPrivacyLinkInFooter);
record("no_cookie_settings", !scope.hasCookieSettings);

await unlockMobileStickyCta();
const unlockedCta = await page.evaluate(() => {
  return [...document.querySelectorAll(".btn-cta")].filter((el) => {
    let node = el;
    while (node) {
      const style = window.getComputedStyle(node);
      if (style.display === "none" || style.visibility === "hidden") return false;
      node = node.parentElement;
    }
    return true;
  }).length;
});
record("one_page_cta", unlockedCta === 1, `visible=${unlockedCta}`);

// Modal open / Escape / focus return (mobile viewport → sticky dock CTA)
await page.click(".mobile-sticky-cta-wrapper .btn-cta");
const opened = await page.evaluate(() => ({
  open: document.querySelector("dialog.review-modal:not(.info-dialog)")?.open ?? false,
  modalOpen: document.documentElement.classList.contains("modal-open"),
  fields: document.querySelectorAll(".request-form .field").length,
}));
record("modal_opens", opened.open && opened.modalOpen && opened.fields === 4);

const modalCopy = await page.evaluate(() => {
  const modal = document.querySelector("dialog.review-modal:not(.info-dialog)");
  if (!modal) return null;
  const text = modal.innerText;
  const websiteInput = modal.querySelector('input[name="website"]');
  const hintId = websiteInput?.getAttribute("aria-describedby") ?? "";
  const hint = hintId
    ? modal.querySelector(`#${CSS.escape(hintId.split(/\s+/)[0])}`)
    : modal.querySelector(".field-hint");
  const privacyLink = modal.querySelector("a[href='/privacy']");
  const privacyLine = modal.querySelector(".request-privacy-line");
  return {
    heading: modal.querySelector(".review-modal-title")?.textContent?.trim() ?? "",
    submit: modal.querySelector('button[type="submit"]')?.textContent?.trim() ?? "",
    hasHint: Boolean(hint?.textContent?.includes("review your current enquiry journey")),
    hintDescribed:
      Boolean(websiteInput) &&
      (websiteInput.getAttribute("aria-describedby") ?? "").includes(
        hint?.id ?? "__missing__",
      ),
    hasExpectation: Boolean(modal.querySelector(".request-expectation-line")),
    hasTrust: Boolean(
      modal.querySelector(".request-trust-list")?.textContent?.includes(
        "no card required",
      ),
    ),
    privacyConsent: Boolean(
      privacyLine?.textContent?.includes("contact you about this call") &&
        privacyLink?.textContent?.trim() === "Privacy Policy",
    ),
    bannedLeftovers: [
      "Start My Free",
      "100% Free",
      "No sales call",
      "within one business day",
      "within 1 business day",
    ].filter((s) => text.toLowerCase().includes(s.toLowerCase())),
  };
});
record(
  "modal_request_framing",
  modalCopy?.heading === "Claim your free strategy call" &&
    modalCopy?.submit === "Claim My Free Strategy Call" &&
    modalCopy?.bannedLeftovers.length === 0,
  JSON.stringify(modalCopy),
);
record(
  "modal_hint_expectation_consent",
  Boolean(
    modalCopy?.hasHint &&
      modalCopy?.hintDescribed &&
      !modalCopy?.hasExpectation &&
      modalCopy?.hasTrust &&
      modalCopy?.privacyConsent,
  ),
  JSON.stringify(modalCopy),
);
record("privacy_link_in_modal", Boolean(modalCopy?.privacyConsent));

// Compact centred modal shell (design plan Phase 1 + 7) — not fullscreen
const modalShell = await page.evaluate(() => {
  const modal = document.querySelector("dialog.review-modal:not(.info-dialog)");
  if (!modal || !modal.open) return null;
  const rect = modal.getBoundingClientRect();
  const styles = getComputedStyle(modal);
  const panel = modal.querySelector(".review-modal-panel");
  const panelRect = panel?.getBoundingClientRect();
  const trustList = modal.querySelector(".request-trust-list");
  const trustItems = trustList
    ? [...trustList.querySelectorAll(".request-trust-item")].map((li) =>
        li.textContent?.replace(/^\s*✓\s*/, "").trim(),
      )
    : [];
  const brand = modal.querySelector(".review-modal-brand");
  const close = modal.querySelector(".review-modal-close");
  const submit = modal.querySelector(".request-submit-btn");
  const email = modal.querySelector('input[name="work_email"]');
  const website = modal.querySelector('input[name="website"]');
  return {
    width: Math.round(rect.width),
    height: Math.round(rect.height),
    left: Math.round(rect.left),
    right: Math.round(window.innerWidth - rect.right),
    top: Math.round(rect.top),
    bottom: Math.round(window.innerHeight - rect.bottom),
    viewportW: window.innerWidth,
    viewportH: window.innerHeight,
    maxWidth: styles.maxWidth,
    heightCss: styles.height,
    borderRadius: styles.borderRadius,
    panelHeight: panelRect ? Math.round(panelRect.height) : null,
    hasBrand: Boolean(brand?.textContent?.includes("Standout")),
    trustItemCount: trustItems.length,
    trustItems,
    hasLockIcon: Boolean(modal.querySelector(".request-trust-icon")),
    closeSize: close
      ? {
          w: Math.round(close.getBoundingClientRect().width),
          h: Math.round(close.getBoundingClientRect().height),
          label: close.getAttribute("aria-label"),
        }
      : null,
    submitHeight: submit
      ? Math.round(submit.getBoundingClientRect().height)
      : null,
    emailType: email?.getAttribute("type") ?? null,
    emailInputMode: email?.getAttribute("inputmode") ?? null,
    websiteType: website?.getAttribute("type") ?? null,
    websiteInputMode: website?.getAttribute("inputmode") ?? null,
  };
});
record(
  "modal_compact_card_mobile",
  Boolean(
    modalShell &&
      modalShell.viewportW <= 440 &&
      modalShell.left >= 14 &&
      modalShell.right >= 14 &&
      modalShell.width <= 440 &&
      modalShell.height < modalShell.viewportH * 0.95 &&
      modalShell.top > 8 &&
      modalShell.bottom > 8 &&
      modalShell.borderRadius !== "0px" &&
      (modalShell.maxWidth === "440px" ||
        Number.parseFloat(modalShell.maxWidth) === 440),
  ),
  JSON.stringify(modalShell),
);
record(
  "modal_brand_and_trust_stack",
  Boolean(
    modalShell?.hasBrand &&
      modalShell.trustItemCount === 2 &&
      !modalShell.hasLockIcon &&
      modalShell.trustItems?.some((t) => t.includes("no card required")) &&
      modalShell.trustItems?.some((t) => t.includes("No contract")),
  ),
  JSON.stringify({
    hasBrand: modalShell?.hasBrand,
    trustItems: modalShell?.trustItems,
    hasLockIcon: modalShell?.hasLockIcon,
  }),
);
record(
  "modal_close_and_cta_targets",
  Boolean(
    modalShell?.closeSize &&
      modalShell.closeSize.w >= 40 &&
      modalShell.closeSize.h >= 40 &&
      modalShell.closeSize.label === "Close" &&
      modalShell.submitHeight !== null &&
      modalShell.submitHeight >= 48 &&
      modalShell.submitHeight <= 56,
  ),
  JSON.stringify({
    close: modalShell?.closeSize,
    submitHeight: modalShell?.submitHeight,
  }),
);
record(
  "modal_field_input_modes",
  modalShell?.emailType === "email" &&
    modalShell?.emailInputMode === "email" &&
    modalShell?.websiteType === "text" &&
    modalShell?.websiteInputMode === "url",
  JSON.stringify({
    emailType: modalShell?.emailType,
    emailInputMode: modalShell?.emailInputMode,
    websiteType: modalShell?.websiteType,
    websiteInputMode: modalShell?.websiteInputMode,
  }),
);

await page.keyboard.press("Escape");
await page.waitForTimeout(120);
const closed = await page.evaluate(() => ({
  open: document.querySelector("dialog.review-modal:not(.info-dialog)")?.open ?? false,
  modalOpen: document.documentElement.classList.contains("modal-open"),
  focus: document.activeElement?.className ?? "",
}));
record(
  "escape_closes_and_returns_focus",
  !closed.open && !closed.modalOpen && closed.focus.includes("btn-cta"),
  closed.focus,
);

// Validation
await page.click(".mobile-sticky-cta-wrapper .btn-cta");
await page.click('button[type="submit"]');
const validation = await page.evaluate(() => ({
  summary: Boolean(document.querySelector(".form-error-summary")),
  invalid: document.querySelectorAll("[aria-invalid=true]").length,
}));
record(
  "client_validation",
  validation.summary && validation.invalid === 4,
  `invalid=${validation.invalid}`,
);

// Close/reopen preserves in-progress values
await page.fill('input[name="name"]', "Alex Test");
await page.keyboard.press("Escape");
await page.waitForTimeout(80);
await page.click(".mobile-sticky-cta-wrapper .btn-cta");
const preserved = await page.inputValue('input[name="name"]');
record("reopen_preserves_draft", preserved === "Alex Test", preserved);

// Fresh page for submission-path tests (avoids leftover validation UI state)
await gotoHome(390, 844);
await unlockMobileStickyCta();
await page.click(".mobile-sticky-cta-wrapper .btn-cta");

// Success path via mocked API
await page.unroute("**/api/review-request").catch(() => {});
await page.route("**/api/review-request", async (route) => {
  const request = route.request();
  if (request.method() !== "POST") return route.fallback();
  await route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ ok: true, lead_id: "test-lead-phase-final" }),
  });
});

await page.fill('input[name="name"]', "Alex Test");
await page.fill('input[name="work_email"]', "alex@testfirm.co.uk");
await page.fill('input[name="website"]', "testfirm.co.uk");
await page.selectOption('select[name="prioritised_area_of_law"]', "personal_injury");

const [response] = await Promise.all([
  page.waitForResponse(
    (res) =>
      res.url().includes("/api/review-request") && res.request().method() === "POST",
    { timeout: 8000 },
  ),
  page.click('button[type="submit"]'),
]);
const responseBody = await response.json().catch(() => null);
record(
  "api_mock_success_response",
  response.ok() && responseBody?.ok === true,
  JSON.stringify(responseBody),
);

await page.waitForSelector(".review-modal-success", { timeout: 5000 });
const success = await page.evaluate(() => ({
  title: document.querySelector(".review-modal-title")?.textContent?.trim(),
  body: document.querySelector(".review-modal-success-body")?.textContent?.trim(),
  summary: document.querySelector(".form-error-summary")?.textContent?.trim() ?? null,
}));
record(
  "success_state",
  success.title === "Your strategy call request has been received." &&
    Boolean(success.body?.includes("We'll review your firm and be in touch")) &&
    !Boolean(success.body?.toLowerCase().includes("business day")) &&
    !Boolean(success.body?.toLowerCase().includes("do not need to book a call")),
  JSON.stringify(success),
);

const successShell = await page.evaluate(() => {
  const modal = document.querySelector("dialog.review-modal:not(.info-dialog)");
  const panel = modal?.querySelector(".review-modal-panel");
  if (!modal || !panel) return null;
  const mr = modal.getBoundingClientRect();
  const pr = panel.getBoundingClientRect();
  return {
    modalH: Math.round(mr.height),
    panelH: Math.round(pr.height),
    delta: Math.round(Math.abs(mr.height - pr.height)),
    viewportH: window.innerHeight,
  };
});
record(
  "modal_success_hugs_content",
  Boolean(
    successShell &&
      successShell.delta <= 2 &&
      successShell.modalH < successShell.viewportH * 0.55,
  ),
  JSON.stringify(successShell),
);

// Close after success remounts fresh form
await page.keyboard.press("Escape");
await page.waitForTimeout(100);
await page.click(".mobile-sticky-cta-wrapper .btn-cta");
const fresh = await page.evaluate(() => ({
  name: document.querySelector('input[name="name"]')?.value ?? null,
  success: Boolean(document.querySelector(".review-modal-success")),
}));
record(
  "reopen_after_success_is_fresh",
  fresh.name === "" && !fresh.success,
  JSON.stringify(fresh),
);

// Server error path
await page.unroute("**/api/review-request");
await page.route("**/api/review-request", async (route) => {
  if (route.request().method() !== "POST") return route.fallback();
  await route.fulfill({
    status: 502,
    contentType: "application/json",
    body: JSON.stringify({
      ok: false,
      error: "We could not complete your request just now. Please try again in a moment.",
    }),
  });
});
await page.fill('input[name="name"]', "Alex Test");
await page.fill('input[name="work_email"]', "alex@testfirm.co.uk");
await page.fill('input[name="website"]', "testfirm.co.uk");
await page.selectOption('select[name="prioritised_area_of_law"]', "personal_injury");
await page.click('button[type="submit"]');
await page.waitForSelector(".form-error-summary", { timeout: 5000 });
const serverError = await page.evaluate(
  () => document.querySelector(".form-error-summary")?.textContent?.includes("could not complete") ?? false,
);
record("server_error_state", serverError);

// Duplicate-submit guard while in-flight (fresh page)
await gotoHome(390, 844);
await unlockMobileStickyCta();
await page.click(".mobile-sticky-cta-wrapper .btn-cta");
await page.unroute("**/api/review-request").catch(() => {});
let postCount = 0;
await page.route("**/api/review-request", async (route) => {
  if (route.request().method() !== "POST") return route.fallback();
  postCount += 1;
  await new Promise((r) => setTimeout(r, 800));
  await route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ ok: true, lead_id: "dup-test" }),
  });
});
await page.fill('input[name="name"]', "Alex Test");
await page.fill('input[name="work_email"]', "alex@testfirm.co.uk");
await page.fill('input[name="website"]', "testfirm.co.uk");
await page.selectOption('select[name="prioritised_area_of_law"]', "personal_injury");
await page.evaluate(() => {
  const btn = document.querySelector('button[type="submit"]');
  btn?.click();
  btn?.click();
});
await page.waitForSelector(".review-modal-success", { timeout: 5000 });
record("duplicate_submit_guard", postCount === 1, `posts=${postCount}`);

// Mobile trust grid present
await gotoHome(375, 812);
const trust = await page.evaluate(() => {
  const grid = document.querySelector(".trust-grid-list");
  const cards = document.querySelectorAll(".trust-card").length;
  const methodology = document.querySelector(".trust-methodology")?.textContent?.trim() ?? "";
  return {
    display: grid ? getComputedStyle(grid).display : null,
    cards,
    methodology,
  };
});
record(
  "trust_grid_on_mobile",
  trust.display === "flex" && trust.cards === 3 && trust.methodology.length > 0,
  JSON.stringify(trust),
);

// Sticky dock stays visible through trust (before footer clearance)
await unlockMobileStickyCta();
await page.evaluate(() => {
  const trust = document.querySelector(".trust-grid");
  const footer = document.querySelector(".site-footer");
  if (!trust || !footer) return;
  // Pin trust near the top, but keep enough room that the footer stays
  // below the sticky-dock clearance band (short pages can otherwise fail).
  const dockClearance =
    (Number.parseFloat(
      getComputedStyle(document.documentElement)
        .getPropertyValue("--mobile-sticky-cta-height")
        .trim(),
    ) || 88) + 24;
  const maxScroll =
    footer.offsetTop - (window.innerHeight - dockClearance) - 8;
  const prefer =
    trust.getBoundingClientRect().top + window.scrollY - 24;
  window.scrollTo(0, Math.max(0, Math.min(prefer, maxScroll)));
});
await page.waitForTimeout(120);
const stickyThroughTrust = await page.evaluate(() => {
  const sticky = document.querySelector(".mobile-sticky-cta-wrapper");
  const footer = document.querySelector(".site-footer");
  const trust = document.querySelector(".trust-grid");
  if (!sticky || !footer || !trust) {
    return { pass: false, detail: "missing sticky, trust, or footer" };
  }
  const dockClearance =
    (Number.parseFloat(
      getComputedStyle(document.documentElement)
        .getPropertyValue("--mobile-sticky-cta-height")
        .trim(),
    ) || 88) + 24;
  const footerTop = footer.getBoundingClientRect().top;
  const trustRect = trust.getBoundingClientRect();
  // Matches observer: landmark must enter the area above the dock.
  const inClearance = footerTop < window.innerHeight - dockClearance;
  const trustInView =
    trustRect.top < window.innerHeight && trustRect.bottom > 0;
  const visible = sticky.classList.contains("is-visible");
  return {
    // Require trust in view, outside footer clearance, dock still visible.
    pass: trustInView && !inClearance && visible,
    detail: `is-visible=${visible} footerTop=${Math.round(footerTop)} inClearance=${inClearance} trustInView=${trustInView}`,
  };
});
record(
  "sticky_cta_visible_through_trust",
  stickyThroughTrust.pass,
  stickyThroughTrust.detail,
);

const failed = report.checks.filter((c) => !c.pass);
report.passed = report.checks.length - failed.length;
report.failed = failed.length;
report.ok = failed.length === 0;

console.log("\n" + JSON.stringify({ passed: report.passed, failed: report.failed, ok: report.ok, failures: failed }, null, 2));
await browser.close();
process.exit(report.ok ? 0 : 1);
