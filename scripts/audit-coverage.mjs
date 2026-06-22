#!/usr/bin/env node
// audit-coverage.mjs — #218 coverage cross-check (owner 2026-06-22): "review the graphs and check
// against what we audit." GRAPH THE AUDIT — this is the deterministic tool, never a manual pass.
//
// For a dimension, cross-check its INDEX (graph) against the AUDIT (registry/detector) BIDIRECTIONALLY:
//   1. index → audit : every real index entry is covered by the audit (no blind spots)
//   2. audit → index : every audit/registry entry maps to a real index entry (no phantoms / stale)
//   3. completeness  : the index ingests ALL sources (the Stage-D lesson — not just src)
// Emits build/coverage/coverage-<dimension>.md + exit code = actionable gap count (CI-gateable).
//
// Dimension implemented: `codes` (LLN-*/ERR-*). Inputs: build/code-index/code-index.json (the graph)
// + docs/Knowledge-Bases/logicn-governance-rules.md (the audit registry). Other dimensions register here
// as their index + audit land (#217 capabilities, project graph, etc.).
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const asJson = process.argv.includes("--json");
const soft = process.argv.includes("--soft"); // report-only (exit 0) — for run-phase-close wiring
const dim = process.argv.find((a) => !a.startsWith("--") && a !== process.argv[0] && a !== process.argv[1]) ?? "codes";

if (dim !== "codes") {
  console.error(`audit-coverage: dimension '${dim}' not implemented yet (have: codes)`);
  process.exit(2);
}

// ── load the index graph ─────────────────────────────────────────────────────
let index;
try {
  index = JSON.parse(readFileSync(join(ROOT, "build/code-index/code-index.json"), "utf8"));
} catch {
  console.error("audit-coverage: build/code-index/code-index.json missing — run `node scripts/code-index.mjs` first.");
  process.exit(2);
}

// ── load the audit registry ──────────────────────────────────────────────────
let registryText = "";
try {
  registryText = readFileSync(join(ROOT, "docs/Knowledge-Bases/logicn-governance-rules.md"), "utf8");
} catch { /* registry optional — absence = total registry blind spot, reported below */ }
const registryCodes = new Set((registryText.match(/LLN-[A-Z0-9]+-[0-9]+/g) ?? []));

// ── classify each code (from the graph) ──────────────────────────────────────
const entry = (c) => ({
  code: c.code,
  isLLN: String(c.code).startsWith("LLN-"),
  defs: (c.defs ?? []).length,
  emits: (c.emits ?? []).length,
  docOnly: c.docOnly === true,
});
const codes = index.map(entry);
const codeSet = new Set(codes.map((c) => c.code));

const docDrift = codes.filter((c) => c.docOnly);                       // documented, no src def/emit
const dead = codes.filter((c) => !c.docOnly && c.defs > 0 && c.emits === 0); // defined, never emitted
const inline = codes.filter((c) => c.emits > 0 && c.defs === 0);       // emitted, no exported constant (R4)
const srcRealLLN = codes.filter((c) => c.isLLN && !c.docOnly);
// (1) index → audit: real LLN diagnostics the governance registry does NOT list (blind spots)
const registryUncovered = srcRealLLN.filter((c) => !registryCodes.has(c.code));
// (2) audit → index: registry codes that don't exist anywhere in the index (phantom / stale registry)
const registryPhantom = [...registryCodes].filter((code) => !codeSet.has(code));

// actionable gap metric (coverage HOLES, not the known R4/doc backlog which is tracked separately)
const gaps = dead.length + registryUncovered.length + registryPhantom.length;

const lines = [];
lines.push("# Coverage cross-check — dimension: codes (#218)\n");
lines.push(`Index: build/code-index/code-index.json (${codes.length} codes) · Registry: logicn-governance-rules.md (${registryCodes.size} LLN codes)\n`);
lines.push("## Coverage HOLES (actionable)");
lines.push(`- DEAD (defined, never emitted): ${dead.length}${dead.length ? " — " + dead.map((c) => c.code).join(", ") : ""}`);
lines.push(`- REGISTRY-UNCOVERED (src-real LLN-* not in the governance registry — audit blind spot): ${registryUncovered.length}`);
lines.push(...registryUncovered.slice(0, 40).map((c) => `    ${c.code}`));
if (registryUncovered.length > 40) lines.push(`    …and ${registryUncovered.length - 40} more`);
lines.push(`- REGISTRY-PHANTOM (registry lists a code absent from the index — stale): ${registryPhantom.length}`);
lines.push(...registryPhantom.slice(0, 40).map((c) => `    ${c}`));
lines.push("\n## Known backlog (tracked elsewhere — reported, not counted as new holes)");
lines.push(`- DOC-ONLY drift (documented, no src def/emit): ${docDrift.length} (taxonomy audit R5)`);
lines.push(`- INLINE / no exported constant (R4): ${inline.length} (taxonomy audit Stage F)`);
lines.push("\n## Completeness note");
lines.push("- The #215 scanner is SRC-ONLY; doc/README-declared ownership is invisible to it (the Stage-D");
lines.push("  LLN-BOUNDARY lesson). REGISTRY-PHANTOM partly covers the reverse; a full doc-ownership check is");
lines.push("  the scanner §6 hardening (future).");
lines.push(`\n## TOTAL coverage holes: ${gaps} (dead ${dead.length} + registry-uncovered ${registryUncovered.length} + registry-phantom ${registryPhantom.length})`);

if (asJson) {
  console.log(JSON.stringify({
    dimension: "codes", totalCodes: codes.length, registryCodes: registryCodes.size,
    holes: gaps, dead: dead.map((c) => c.code), registryUncovered: registryUncovered.map((c) => c.code),
    registryPhantom, docDrift: docDrift.length, inline: inline.length,
  }, null, 2));
} else {
  console.log(lines.join("\n"));
}

try {
  mkdirSync(join(ROOT, "build/coverage"), { recursive: true });
  writeFileSync(join(ROOT, "build/coverage/coverage-codes.md"), lines.join("\n") + "\n");
} catch { /* non-fatal */ }

process.exit(soft ? 0 : Math.min(gaps, 250));
