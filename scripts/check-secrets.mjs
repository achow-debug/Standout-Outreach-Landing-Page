#!/usr/bin/env node
/**
 * Fails if server-only secrets appear in client-reachable source or env examples.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const SECRET_PATTERNS = [
  { name: "N8N_WEBHOOK_URL assignment in client", re: /N8N_WEBHOOK_URL\s*=\s*['"`]https?:\/\// },
  { name: "N8N_WEBHOOK_SECRET with value", re: /N8N_WEBHOOK_SECRET\s*=\s*['"`][^'"`]+['"`]/ },
  { name: "process.env.N8N in client components", re: /process\.env\.N8N_/ },
];

const IGNORE_DIRS = new Set([
  "node_modules",
  ".next",
  ".git",
  "ops",
  "scripts",
]);

/** Server-only modules that may reference N8N env vars. */
const SERVER_ALLOWLIST = new Set([
  path.join(root, "lib", "review-request-service.ts"),
  path.join(root, "app", "api", "review-request", "route.ts"),
  path.join(root, ".env.example"),
  path.join(root, ".env.local"),
  path.join(root, ".env"),
]);

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORE_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/\.(ts|tsx|js|jsx|mjs|css|md|json|example)$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

const files = [
  ...walk(path.join(root, "components")),
  ...walk(path.join(root, "app")),
  ...walk(path.join(root, "lib")),
  path.join(root, ".env.example"),
].filter((file) => fs.existsSync(file));

const findings = [];

for (const file of files) {
  if (SERVER_ALLOWLIST.has(file)) {
    // Still forbid real secret values in .env.example
    if (file.endsWith(".env.example")) {
      const text = fs.readFileSync(file, "utf8");
      for (const line of text.split("\n")) {
        if (/^N8N_WEBHOOK_URL=.+/.test(line) && !/^N8N_WEBHOOK_URL=\s*$/.test(line)) {
          findings.push(`${file}: N8N_WEBHOOK_URL must remain empty in .env.example`);
        }
        if (
          /^N8N_WEBHOOK_SECRET=.+/.test(line) &&
          !/^N8N_WEBHOOK_SECRET=\s*$/.test(line)
        ) {
          findings.push(`${file}: N8N_WEBHOOK_SECRET must remain empty in .env.example`);
        }
      }
    }
    continue;
  }

  const text = fs.readFileSync(file, "utf8");
  for (const pattern of SECRET_PATTERNS) {
    if (pattern.re.test(text)) {
      findings.push(`${file}: ${pattern.name}`);
    }
  }
}

if (findings.length > 0) {
  console.error("[secrets-check] Potential secret exposure:");
  for (const finding of findings) console.error(`  - ${finding}`);
  process.exit(1);
}

console.log("[secrets-check] No client-side N8N secrets detected.");
process.exit(0);
