#!/usr/bin/env node
// code-index.mjs — index EVERY diagnostic/error code in LogicN: its definition, its name/severity,
// and every place it is emitted / tested / documented. A re-runnable dev tool that SAVES TOKENS —
// query build/code-index/CODE_INDEX.md instead of re-grepping the tree. (Owner request, 2026-06-22.)
//
// Namespaces indexed: LLN-<FAMILY>-NNN (diagnostics) and ERR_<...> (runtime errors).
// Output: build/code-index/code-index.json (machine) + CODE_INDEX.md (human/AI-browsable) + a stdout summary.
// Roles per occurrence: def (exported const / make*Diag definition / object literal with name+severity),
//   emit (push/throw/code: site), test, doc (.md), lln (.lln), ref (any other mention).
import { readdirSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const SCAN = ["packages-logicn", "docs", "scripts"].map((d) => join(ROOT, d));
const OUT = join(ROOT, "build", "code-index");
const EXT = /\.(ts|mjs|cjs|lln|md)$/;
const SKIP = new Set(["node_modules", "dist", ".git"]);
const CODE_RE = /(LLN-[A-Z0-9]+-[A-Z0-9-]*[0-9]|ERR_[A-Z0-9_]+)/g;
const CODE_TEST = /^(LLN-[A-Z0-9]+-[A-Z0-9-]*[0-9]|ERR_[A-Z0-9_]+)$/;

function walk(dir) {
  const out = [];
  let ents;
  try { ents = readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const d of ents) {
    if (SKIP.has(d.name)) continue;
    const p = join(dir, d.name);
    if (d.isDirectory()) out.push(...walk(p));
    else if (EXT.test(d.name) && !d.name.endsWith(".d.ts")) out.push(p);
  }
  return out;
}

const idx = new Map(); // code -> { occ:[{file,line,role}], names:Set, sevs:Set }
const get = (c) => { if (!idx.has(c)) idx.set(c, { occ: [], names: new Set(), sevs: new Set() }); return idx.get(c); };
const familyOf = (c) => c.startsWith("ERR_") ? "ERR_*" : (c.match(/^LLN-([A-Z0-9]+)-/)?.[1] ?? "?");
const nsOf = (c) => c.startsWith("ERR_") ? "ERR" : "LLN";

for (const file of SCAN.flatMap(walk)) {
  const rel = relative(ROOT, file).replace(/\\/g, "/");
  const isTest = /\/tests?\//.test(rel) || /\.test\./.test(rel);
  const isDoc = rel.endsWith(".md");
  const isLln = rel.endsWith(".lln");
  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // multi-line make*Diag(code, name, ...): attribute the windowed (code, name) as an emit at the
    // make-line, even when the code/name args sit on the following lines (common in governance-verifier.ts).
    if (/make\w*Diag\(/.test(line)) {
      const win = line.slice(line.search(/make\w*Diag\(/)) + " " + lines.slice(i + 1, Math.min(i + 5, lines.length)).join(" ");
      const margs = [...win.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
      const ci = margs.findIndex((a) => CODE_TEST.test(a));
      if (ci >= 0) {
        const e = get(margs[ci]);
        e.occ.push({ file: rel, line: i + 1, role: isDoc ? "doc" : isTest ? "test" : "emit" });
        const nm = margs[ci + 1];
        if (nm && /^[A-Za-z][A-Za-z0-9_]*$/.test(nm) && !isDoc && !isTest) e.names.add(nm);
      }
    }
    const codes = [...new Set([...line.matchAll(CODE_RE)].map((m) => m[1]))];
    if (!codes.length) continue;
    const hasNameSev = /name:\s*"[^"]+"/.test(line) && /severity:\s*"[^"]+"/.test(line);
    const isDef = /export const\s+\w+/.test(line) || hasNameSev;
    const isMake = /make\w*Diag\(/.test(line);
    const isEmit = isMake || /code:\s*"/.test(line) || /\bthrow\b/.test(line) || /\.push\(/.test(line);
    for (const code of codes) {
      const e = get(code);
      let role = isDoc ? "doc" : isTest ? "test" : isLln ? "lln" : (isDef ? "def" : isEmit ? "emit" : "ref");
      e.occ.push({ file: rel, line: i + 1, role });
      // capture name/severity only at code-bearing src lines (def/emit), within a tight window
      if (!isDoc && !isTest && (isDef || isEmit)) {
        for (let j = i; j < Math.min(i + 6, lines.length); j++) {
          const nm = lines[j].match(/name:\s*"([^"]+)"/); if (nm) e.names.add(nm[1]);
          const sv = lines[j].match(/severity:\s*"([^"]+)"/); if (sv) e.sevs.add(sv[1]);
        }
        if (isMake) {
          const win = line.slice(line.search(/make\w*Diag\(/)) + " " + lines.slice(i + 1, Math.min(i + 4, lines.length)).join(" ");
          const args = [...win.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
          if (args[0] === code && args[1] && /^[A-Za-z][A-Za-z0-9_]*$/.test(args[1])) e.names.add(args[1]);
        }
      }
    }
  }
}

// ── assemble ──
const codes = [...idx.entries()].map(([code, e]) => {
  const seen = new Set();
  const occ = e.occ.filter((o) => { const k = `${o.file}:${o.line}:${o.role}`; if (seen.has(k)) return false; seen.add(k); return true; });
  return {
    code, namespace: nsOf(code), family: familyOf(code),
    occurrences: occ.length,
    docOnly: occ.every((o) => o.role === "doc"),
    defs: occ.filter((o) => o.role === "def").map((o) => `${o.file}:${o.line}`),
    emits: occ.filter((o) => o.role === "emit").map((o) => `${o.file}:${o.line}`),
    tests: occ.filter((o) => o.role === "test").length,
    docs: occ.filter((o) => o.role === "doc").length,
    names: [...e.names], severities: [...e.sevs],
    allSites: occ.map((o) => `${o.role} ${o.file}:${o.line}`),
  };
}).sort((a, b) => a.code.localeCompare(b.code));

mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, "code-index.json"), JSON.stringify(codes, null, 2));

// markdown (browsable map): grouped by family
const byFam = new Map();
for (const c of codes) { if (!byFam.has(c.family)) byFam.set(c.family, []); byFam.get(c.family).push(c); }
const md = ["# LogicN — Code Index (generated by scripts/code-index.mjs)", "",
  `${codes.length} codes (${codes.filter((c) => !c.docOnly).length} src-real + ${codes.filter((c) => c.docOnly).length} doc-only/phantom) · ${codes.reduce((s, c) => s + c.occurrences, 0)} occurrences · ${[...byFam.keys()].length} families.`,
  "Query this instead of grepping. Regenerate: `node scripts/code-index.mjs`.", ""];
for (const fam of [...byFam.keys()].sort()) {
  md.push(`## ${fam} (${byFam.get(fam).length})`, "", "| code | name(s) | severity | def | emit | test | doc |", "|---|---|---|---|---|---|---|");
  for (const c of byFam.get(fam)) {
    md.push(`| ${c.code} | ${c.names.join(" / ") || "—"} | ${c.severities.join("/") || "—"} | ${c.defs[0] ?? "—"} | ${c.emits.length} | ${c.tests} | ${c.docs} |`);
  }
  md.push("");
}
writeFileSync(join(OUT, "CODE_INDEX.md"), md.join("\n"));

// stdout summary (concise — don't pull the whole index into context)
const nNoDef = codes.filter((c) => c.defs.length === 0 && c.emits.length > 0).length;
const nDeadDef = codes.filter((c) => c.defs.length > 0 && c.emits.length === 0 && c.tests === 0).length;
const srcCodes = codes.filter((c) => !c.docOnly);
const docOnly = codes.filter((c) => c.docOnly);
console.log(`code-index: ${codes.length} total = ${srcCodes.length} src-real + ${docOnly.length} doc-only/phantom · ${srcCodes.filter((c) => c.namespace === "LLN").length} LLN-src, ${srcCodes.filter((c) => c.namespace === "ERR").length} ERR-src · ${[...byFam.keys()].length} families`);
console.log(`  inline (emit, no exported const): ${nNoDef}   defined-but-never-emitted/tested: ${nDeadDef}   doc-only/phantom codes: ${docOnly.length}`);
console.log(`  -> build/code-index/CODE_INDEX.md + code-index.json`);
