#!/usr/bin/env node
// =============================================================================================
// lln-astshape — AST-SHAPE INSPECTOR for build-spec authors
// ---------------------------------------------------------------------------------------------
// WHY THIS EXISTS: build-spec diff-level patches that TRAVERSE the AST (children[i], receiver-vs-
// arg in `recv.method(arg)`, annotated-typeName vs inferred-binding) have shipped real bugs that
// only surfaced on APPLY (RD-0103 secret-zeroing, RD-0111 chain-recognition, RD-0112 segment shape).
// The fix: BEFORE you write a traversal patch, dump the REAL node shape from the SHIPPED parser and
// confirm your assumptions. This tool is that check. Run it; paste its output into the build-spec
// as evidence (the adopted process rule for any AST-traversing patch).
//
// THE RD-0111 LESSON IT CATCHES (try: `node scripts/lln-astshape.mjs` with no args):
//   `authorize.passport(v)` parses to  callExpr value="passport"  children=[ id "authorize", id "v" ]
//   -> children[0] is the RECEIVER namespace ("authorize"), NOT the arg. A patch doing
//      `init.children?.[0]` grabs the receiver. The arg is children[1..]. This tool makes that obvious.
//
// USAGE:
//   node scripts/lln-astshape.mjs '<lln snippet>'      # inspect an inline snippet
//   node scripts/lln-astshape.mjs --file path.lln      # inspect a file
//   node scripts/lln-astshape.mjs --kind callExpr ...  # only print nodes of a given kind
//   node scripts/lln-astshape.mjs                      # demo: the RD-0111 construct + the lesson
//
// GROUNDING: imports the SHIPPED core-compiler parser (read-only), resolved relative to THIS script
// so it works from any checkout. Fail-closed: exit 2 if the dist is absent (build LogicN first).
// Deterministic, no writes, no network. crypto/substrate untouched.
// Productionized from R-AND-D tools/lln-astshape.mjs (worker, RD post-0112); path made relative.
// =============================================================================================
import { pathToFileURL, fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { readFileSync } from "node:fs";

const HERE = dirname(fileURLToPath(import.meta.url));
const DIST = join(HERE, "..", "packages-logicn", "logicn-core-compiler", "dist", "index.js");
let parseProgram;
try {
  ({ parseProgram } = await import(pathToFileURL(DIST).href));
  if (typeof parseProgram !== "function") throw new Error("dist did not export parseProgram");
} catch (e) {
  console.error("FAIL-CLOSED (exit 2): could not import the SHIPPED parser dist — build LogicN first.\n  " + e.message);
  process.exit(2);
}

// ---- arg parsing -----------------------------------------------------------------------------
const argv = process.argv.slice(2);
let onlyKind = null;
const ki = argv.indexOf("--kind");
if (ki !== -1) { onlyKind = argv[ki + 1]; argv.splice(ki, 2); }
let src, label;
const fi = argv.indexOf("--file");
if (fi !== -1) { const p = argv[fi + 1]; src = readFileSync(p, "utf8"); label = p; }
else if (argv.length && argv[0] !== "--demo") { src = argv[0]; label = "(inline)"; }

const DEMO = !src;
if (DEMO) {
  // wrap the bare expression in a minimal valid flow so the parser accepts it
  src = "flow demo(v: Int) -> Int contract { effects { network.outbound } } {\n  let a: Int = authorize.passport(verify.passport(v))\n  return a\n}";
  label = "(RD-0111 demo — authorize.passport(verify.passport(v)))";
}

// ---- parse (shipped) -------------------------------------------------------------------------
const prog = parseProgram(src, "astshape.lln");
const errs = (prog.diagnostics ?? []).filter((d) => d.severity === "error");
console.log("== lln-astshape :: " + label + " ==");
if (errs.length) {
  console.log("PARSE ERRORS (the snippet may need wrapping in a flow{} to parse):");
  for (const e of errs.slice(0, 6)) console.log("  " + (e.code ?? "?") + ": " + e.message);
  console.log("");
}

// ---- pretty-print the AST tree ---------------------------------------------------------------
// Member calls (callExpr with a receiver) are the #1 trap: children[0] = RECEIVER, children[1..] = args.
function isMemberCall(n) {
  return n && n.kind === "callExpr" && Array.isArray(n.children) && n.children.length >= 1 &&
    n.children[0] && n.children[0].kind === "identifier";
}
function annotate(node, idx, parent) {
  if (parent && parent.kind === "callExpr" && Array.isArray(parent.children)) {
    if (idx === 0) return "  ⟵ [0] RECEIVER (namespace, e.g. 'authorize'/'verify') — NOT the arg";
    return "  ⟵ [" + idx + "] arg " + (idx - 1);
  }
  return "";
}
function dump(node, depth, idx, parent) {
  if (!node || typeof node !== "object") return;
  const pad = "  ".repeat(depth);
  const v = node.value !== undefined ? " value=" + JSON.stringify(node.value) : "";
  const tn = node.typeName !== undefined ? " typeName=" + JSON.stringify(node.typeName) : " typeName=<none/inferred>";
  const show = !onlyKind || node.kind === onlyKind;
  if (show) console.log(pad + (node.kind ?? "?") + v + (node.kind === "identifier" || node.kind === "letDecl" ? tn : "") + annotate(node, idx, parent));
  const kids = node.children ?? [];
  for (let i = 0; i < kids.length; i++) dump(kids[i], depth + 1, i, node);
}
dump(prog.ast, 0, -1, null);

// ---- explicit member-call digest (the receiver-vs-arg trap, listed flat) ---------------------
const calls = [];
(function walk(n) { if (!n || typeof n !== "object") return; if (isMemberCall(n)) calls.push(n); for (const c of (n.children ?? [])) walk(c); })(prog.ast);
if (calls.length) {
  console.log("\n-- member-call digest (the receiver-vs-arg trap) --");
  for (const c of calls) {
    const recv = c.children[0];
    const args = c.children.slice(1);
    console.log("  " + JSON.stringify(recv.value) + "." + JSON.stringify(c.value) + "(" + args.map((a) => JSON.stringify(a.value)).join(", ") + ")");
    console.log("    method  = node.value            = " + JSON.stringify(c.value));
    console.log("    RECEIVER= children[0].value     = " + JSON.stringify(recv.value) + "   ← a patch doing children[0] grabs THIS, the namespace");
    console.log("    arg(s)  = children[1..].value   = [" + args.map((a) => JSON.stringify(a.value)).join(", ") + "]   ← the actual arguments");
  }
}

if (DEMO) {
  console.log("\nLESSON (RD-0111): the inflow passport is the ARG (children[1..]) and may be an UNANNOTATED");
  console.log("binding (typeName=<none>) carrying only a passportStage — recognize it by binding-resolution,");
  console.log("not by children[0] or typeName alone. Run this on YOUR construct before writing the traversal.");
}
process.exit(errs.length ? 1 : 0);
