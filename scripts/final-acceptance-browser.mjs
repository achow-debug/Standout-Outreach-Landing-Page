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
    dialogCount: document.querySelectorAll("dialog.review-modal").length,
    banned: [
      "Book a strategy call",
      "transcript",
      "MIT study",
      "Helping UK law firms convert more",
    ].filter((s) => text.toLowerCase().includes(s.toLowerCase())),
    hasPrivacyLinkInChrome: Boolean(
      document.querySelector(
        '.page-shell a[href="/privacy"], .site-footer a[href="/privacy"], .hero-surface a[href="/privacy"]',
      ),
    ),
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
record("no_privacy_link_on_landing_chrome", !scope.hasPrivacyLinkInChrome);

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
  open: document.querySelector("dialog.review-modal")?.open ?? false,
  modalOpen: document.documentElement.classList.contains("modal-open"),
  fields: document.querySelectorAll(".request-form .field").length,
}));
record("modal_opens", opened.open && opened.modalOpen && opened.fields === 4);

const privacyInModal = await page.evaluate(() =>
  Boolean(document.querySelector("dialog.review-modal a[href='/privacy']")),
);
record("privacy_link_in_modal", privacyInModal);

await page.keyboard.press("Escape");
await page.waitForTimeout(120);
const closed = await page.evaluate(() => ({
  open: document.querySelector("dialog.review-modal")?.open ?? false,
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
await page.fill('input[name="firm_name"]', "Test Firm LLP");
await page.fill('input[name="work_email"]', "alex@testfirm.co.uk");
await page.fill('input[name="website"]', "testfirm.co.uk");

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
  success.title === "Your pilot request has been received." &&
    Boolean(success.body),
  JSON.stringify(success),
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
await page.fill('input[name="firm_name"]', "Test Firm LLP");
await page.fill('input[name="work_email"]', "alex@testfirm.co.uk");
await page.fill('input[name="website"]', "testfirm.co.uk");
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
await page.fill('input[name="firm_name"]', "Test Firm LLP");
await page.fill('input[name="work_email"]', "alex@testfirm.co.uk");
await page.fill('input[name="website"]', "testfirm.co.uk");
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
  document.querySelector(".trust-grid")?.scrollIntoView({
    block: "start",
    behavior: "instant",
  });
});
await page.waitForTimeout(120);
const stickyThroughTrust = await page.evaluate(() => {
  const sticky = document.querySelector(".mobile-sticky-cta-wrapper");
  const footer = document.querySelector(".site-footer");
  if (!sticky || !footer) {
    return { pass: false, detail: "missing sticky or footer" };
  }
  const dockClearance =
    (Number.parseFloat(
      getComputedStyle(document.documentElement)
        .getPropertyValue("--mobile-sticky-cta-height")
        .trim(),
    ) || 88) + 24;
  const footerTop = footer.getBoundingClientRect().top;
  // Matches observer: landmark must enter the area above the dock.
  const inClearance = footerTop < window.innerHeight - dockClearance;
  const visible = sticky.classList.contains("is-visible");
  return {
    // Require trust scroll position to be outside footer clearance, then
    // the dock must still be visible (the regression this check guards).
    pass: !inClearance && visible,
    detail: `is-visible=${visible} footerTop=${Math.round(footerTop)} inClearance=${inClearance}`,
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
