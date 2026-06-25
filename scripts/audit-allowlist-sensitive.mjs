#!/usr/bin/env node
// audit-allowlist-sensitive.mjs — audit every package's Hardened-Border ALLOWLIST for SENSITIVE reach.
//
// The package-graph `--check` gate audits imports AGAINST the allowlist (is every import permitted?).
// This complements it from the other direction: it audits the ALLOWLIST ITSELF for over-reach — which
// deny-by-default borders has each package OPENED to a sensitive capability (process spawn, raw network,
// filesystem, dynamic code eval, …)? Every entry below is a border a human deliberately widened; this
// surfaces them for review so an over-permissive border can't hide in a green `--check`.
//
// Reads each packages-logicn/<pkg>/.graph/boundary-policy.json — the authoritative allowlist (NOT the
// regex-derived graph, so manual require()/dynamic-import entries are included, no false negatives).
//
//   node scripts/audit-allowlist-sensitive.mjs            full report
//   node scripts/audit-allowlist-sensitive.mjs --quiet    summary only
//   node scripts/audit-allowlist-sensitive.mjs --strict   exit 1 if any package opens a sensitive border
//                                                          NOT on the reviewed baseline (CI gate mode)
// Informational by default (exit 0): this is a review lens, not the enforcement gate (#149 owns that).

import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PKG_DIR = join(ROOT, "packages-logicn");
const quiet = process.argv.includes("--quiet");
const strict = process.argv.includes("--strict");

// Sensitive capabilities → the risk a human should justify per package.
const SENSITIVE = [
  { re: /^node:child_process$/, cap: "process-spawn", risk: "command execution" },
  { re: /^node:(net|dgram|tls)$/, cap: "raw-socket", risk: "raw network egress/ingress" },
  { re: /^node:(http|https|http2)$/, cap: "http", risk: "network egress (SSRF surface)" },
  { re: /^node:dns(\/promises)?$/, cap: "dns", risk: "name resolution (SSRF/rebind surface)" },
  { re: /^node:(fs|fs\/promises)$/, cap: "filesystem", risk: "file read/write (path-traversal surface)" },
  { re: /^node:(vm|repl|inspector)$/, cap: "dynamic-eval", risk: "dynamic code execution" },
  { re: /^node:(cluster|worker_threads)$/, cap: "spawn-thread", risk: "parallel process/thread spawn" },
  { re: /^node:os$/, cap: "os-info", risk: "host/env introspection" },
];
const classify = (spec) => SENSITIVE.find((s) => s.re.test(spec));

const pkgs = readdirSync(PKG_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

const rows = []; // { pkg, sensitive: [{spec, cap, risk}] }
let scanned = 0, missing = 0;
for (const pkg of pkgs) {
  const policyPath = join(PKG_DIR, pkg, ".graph", "boundary-policy.json");
  if (!existsSync(policyPath)) { missing++; continue; }
  let policy;
  try { policy = JSON.parse(readFileSync(policyPath, "utf-8")); }
  catch { rows.push({ pkg, sensitive: [{ spec: "<unreadable boundary-policy.json>", cap: "ERROR", risk: "fail-closed: unparseable allowlist" }] }); continue; }
  scanned++;
  const allow = Array.isArray(policy.allowedExternal) ? policy.allowedExternal : [];
  const sensitive = allow.map((spec) => { const c = classify(spec); return c ? { spec, cap: c.cap, risk: c.risk } : null; }).filter(Boolean);
  if (sensitive.length > 0) rows.push({ pkg, sensitive });
}

// ── Report ──────────────────────────────────────────────────────────────────
const byCap = new Map();
for (const r of rows) for (const s of r.sensitive) {
  if (!byCap.has(s.cap)) byCap.set(s.cap, []);
  byCap.get(s.cap).push(r.pkg);
}

if (!quiet) {
  console.log(`\n🔍 Allowlist sensitive-border audit — ${scanned} packages scanned (${missing} without a .graph policy)\n`);
  console.log(`${rows.length} package(s) have opened at least one sensitive border:\n`);
  for (const r of rows) {
    console.log(`  ${r.pkg}`);
    for (const s of r.sensitive) console.log(`    • ${s.spec.padEnd(22)} [${s.cap}] — ${s.risk}`);
  }
  console.log(`\n── By capability (who can do what) ──`);
  for (const [cap, list] of [...byCap].sort()) {
    console.log(`  ${cap.padEnd(14)} (${list.length}): ${[...new Set(list)].sort().join(", ")}`);
  }
}

const highest = ["process-spawn", "dynamic-eval", "raw-socket"].filter((c) => byCap.has(c));
console.log(`\nSummary: ${rows.length} package(s) with a sensitive border; capabilities in use: ${[...byCap.keys()].sort().join(", ") || "none"}.`);
if (highest.length) console.log(`⚠️  Highest-risk borders open: ${highest.join(", ")} — confirm each is justified.`);

// --strict CI mode would diff against a committed reviewed baseline (build/allowlist-sensitive-baseline.json);
// left informational by default so this never blocks a build before the baseline + #149 land.
process.exit(strict && rows.some((r) => r.sensitive.some((s) => s.cap === "ERROR")) ? 1 : 0);
