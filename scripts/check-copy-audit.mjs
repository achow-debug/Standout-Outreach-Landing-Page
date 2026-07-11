#!/usr/bin/env node
/**
 * Copy / launch readiness audit against known placeholders and prohibited claims.
 * Exits 0 with a report; use --strict to fail when unresolved launch blockers remain.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const strict = process.argv.includes("--strict");

function read(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}

const blockers = [];
const warnings = [];
const passed = [];

// Video assets
const videoFiles = [
  "public/video/legal-enquiry-review.mp4",
  "public/video/legal-enquiry-review-poster.webp",
  "public/video/legal-enquiry-review-captions.vtt",
];
for (const file of videoFiles) {
  if (exists(file)) passed.push(`Asset present: ${file}`);
  else blockers.push(`Missing production asset: ${file}`);
}

const transcript = read("lib/landing-copy.ts");
if (/Draft transcript aligned/.test(transcript)) {
  blockers.push("Video transcript is still a draft placeholder in lib/landing-copy.ts");
} else {
  passed.push("Transcript does not contain draft placeholder wording");
}

const siteConfig = read("lib/site-config.ts");
if (/proofLineIsPlaceholder:\s*true/.test(siteConfig)) {
  warnings.push(
    "Proof line is still marked placeholder — substantiate, revise or remove before launch",
  );
} else {
  passed.push("Proof line placeholder flag cleared");
}

if (/lawfulBasis:\s*null/.test(siteConfig)) {
  blockers.push("Privacy lawful basis is unset in lib/site-config.ts");
} else {
  passed.push("Lawful basis configured");
}

if (/retentionPeriod:\s*null/.test(siteConfig)) {
  blockers.push("Privacy retention period is unset in lib/site-config.ts");
} else {
  passed.push("Retention period configured");
}

if (/companyNumber:\s*null/.test(siteConfig)) {
  warnings.push("Legal entity company number unset — complete footer identity before production");
}

if (/registeredAddress:\s*null/.test(siteConfig)) {
  warnings.push("Legal entity registered address unset — complete footer identity before production");
}

const prohibited = [
  /Your firm is losing leads/i,
  /reception team is too slow/i,
  /We guarantee more retained cases/i,
  /AI will transform your law firm/i,
  /Only a few spaces remain/i,
  /Book a strategy call/i,
  /authorised enquiry test/i,
];

const copySources = [
  "lib/landing-copy.ts",
  "lib/review-request-emails.ts",
  "components/landing",
  "app/page.tsx",
  "app/privacy/page.tsx",
];

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/\.(ts|tsx)$/.test(entry.name)) files.push(full);
  }
  return files;
}

const files = copySources.flatMap((rel) => {
  const full = path.join(root, rel);
  if (fs.statSync(full).isDirectory()) return walk(full);
  return [full];
});

let prohibitedHits = 0;
for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  for (const pattern of prohibited) {
    if (pattern.test(text)) {
      prohibitedHits += 1;
      blockers.push(`Prohibited claim pattern in ${path.relative(root, file)}: ${pattern}`);
    }
  }
}

if (prohibitedHits === 0) {
  passed.push("No prohibited claim patterns found in page/email copy");
}

console.log("\n[copy-audit] Launch readiness\n");
console.log(`Passed (${passed.length}):`);
for (const item of passed) console.log(`  ✓ ${item}`);
if (warnings.length) {
  console.log(`\nWarnings (${warnings.length}):`);
  for (const item of warnings) console.log(`  ! ${item}`);
}
if (blockers.length) {
  console.log(`\nBlockers (${blockers.length}):`);
  for (const item of blockers) console.log(`  ✗ ${item}`);
}

const report = {
  generated_at: new Date().toISOString(),
  passed,
  warnings,
  blockers,
  launch_ready: blockers.length === 0,
};

fs.mkdirSync(path.join(root, "ops"), { recursive: true });
fs.writeFileSync(
  path.join(root, "ops", "launch-readiness.json"),
  JSON.stringify(report, null, 2) + "\n",
);

console.log("\nWrote ops/launch-readiness.json");

if (strict && blockers.length > 0) {
  process.exit(1);
}

process.exit(0);
