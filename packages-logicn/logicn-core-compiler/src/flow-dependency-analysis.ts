// =============================================================================
// Flow dependency analysis — the //@USES / //@USEDBY / //@IMPACT vocabulary (R&D 0045)
//
// Computes, per flow, the OBSERVED call graph from the AST (no git, no extra analysis):
//   - USES   : upstream  — the flows THIS flow calls (out-edges)
//   - USEDBY : downstream — the flows that call THIS flow (direct callers / "dependants")
//   - IMPACT : transitive downstream blast-radius (every flow that reaches this via calls);
//              IMPACT 0 ⟺ nothing depends on it ⟹ safe to delete.
//
// Reuses the same callee-resolution pattern as LLN-GOV-013 (findNodes(flow,"callExpr") → match a
// flow name). Only flow→flow calls count; stdlib/method calls (`Db.fetch`) are not flows. This is
// the generated-tier data behind the `//lln:` comments the CLI writes; the contract.architecture
// `depends_on` (authored intent) should agree with `//lln: USES` (observed reality) — a mismatch is a WARN.
// =============================================================================

import type { AstNode } from "./parser.js";
import { findNodes } from "./gir-emitter.js";

export interface FlowDependencies {
  /** Upstream — flows THIS flow calls (sorted, unique, flow→flow only). */
  readonly uses: readonly string[];
  /** Downstream — flows that directly call THIS flow ("dependants"). */
  readonly usedBy: readonly string[];
  /** Transitive downstream blast-radius (all flows that reach this via calls). 0 ⟹ safe to delete. */
  readonly impact: number;
}

const FLOW_KINDS = new Set(["pureFlowDecl", "flowDecl", "secureFlowDecl", "guardedFlowDecl"]);

/**
 * Build the per-flow dependency map (USES / USEDBY / IMPACT) for a program AST.
 * Self-calls (recursion) are excluded (a flow does not "use" itself).
 */
export function analyzeFlowDependencies(ast: AstNode): Map<string, FlowDependencies> {
  // 1. Collect top-level flow declarations by name.
  const flowNodes = new Map<string, AstNode>();
  for (const child of ast.children ?? []) {
    if (FLOW_KINDS.has(child.kind) && (child.value ?? "") !== "") {
      flowNodes.set(child.value as string, child);
    }
  }
  const names = [...flowNodes.keys()];

  // 2. Direct edges from each flow's flow→flow callExpr nodes.
  const uses = new Map<string, Set<string>>();
  const usedBy = new Map<string, Set<string>>();
  for (const n of names) { uses.set(n, new Set()); usedBy.set(n, new Set()); }
  for (const [name, node] of flowNodes) {
    for (const call of findNodes(node, "callExpr")) {
      const callee = call.value ?? "";
      if (callee !== "" && callee !== name && flowNodes.has(callee)) {
        uses.get(name)!.add(callee);
        usedBy.get(callee)!.add(name);
      }
    }
  }

  // 3. Transitive downstream impact = the closure over USEDBY edges (cycle-safe).
  const out = new Map<string, FlowDependencies>();
  for (const name of names) {
    const seen = new Set<string>();
    const stack = [...usedBy.get(name)!];
    while (stack.length > 0) {
      const cur = stack.pop()!;
      if (cur === name || seen.has(cur)) continue;
      seen.add(cur);
      for (const up of usedBy.get(cur) ?? []) {
        if (up !== name && !seen.has(up)) stack.push(up);
      }
    }
    out.set(name, {
      uses: [...uses.get(name)!].sort(),
      usedBy: [...usedBy.get(name)!].sort(),
      impact: seen.size,
    });
  }
  return out;
}

/**
 * Render the canonical generated `//lln:` dependency comment lines for one flow (R&D 0045 vocabulary).
 * Count-prefixed `(N)` so the blast-radius is visible even if a long list is truncated by a writer.
 * USES/USEDBY are omitted when empty; IMPACT always renders (it carries the safe-to-delete signal).
 */
export function renderDependencyComments(deps: FlowDependencies): string[] {
  const lines: string[] = [];
  if (deps.uses.length > 0) {
    lines.push(`//lln: USES: (${deps.uses.length}) ${deps.uses.join(", ")}`);
  }
  if (deps.usedBy.length > 0) {
    lines.push(`//lln: USEDBY: (${deps.usedBy.length}) ${deps.usedBy.join(", ")}`);
  }
  lines.push(deps.impact === 0 ? `//lln: IMPACT: (0) — safe to delete` : `//lln: IMPACT: (${deps.impact})`);
  return lines;
}

/**
 * Rewrite a .lln source so each flow has its current generated `//lln:` block immediately above its
 * declaration. SILENTLY OVERWRITES the old contiguous `//lln:` block (R&D 0045 decision #3 — the generated
 * tier is machine-owned). Touches ONLY `//lln:` lines: removes the contiguous run of `//lln:` lines directly
 * above a flow declaration and inserts the fresh block — never a human `//` line, a `contract`, or any code.
 * Processes bottom-up so line indices stay valid; idempotent when the metadata is already current.
 * `genByFlow` maps a flow name → its fresh `//lln:` lines (renderDependencyComments + renderComplexityComment).
 */
export function rewriteGeneratedComments(
  source: string,
  genByFlow: ReadonlyMap<string, readonly string[]>,
): string {
  const lines = source.split("\n");
  const flowRe = /^(\s*)(?:pure\s+|secure\s+|guarded\s+)?flow\s+(\w+)\b/;
  for (let i = lines.length - 1; i >= 0; i--) {
    const fm = (lines[i] ?? "").match(flowRe);
    if (fm === null) continue;
    const gen = genByFlow.get(fm[2] as string);
    if (gen === undefined) continue;
    const indent = fm[1] ?? "";
    let start = i;
    while (start - 1 >= 0 && /^\s*\/\/lln:/.test(lines[start - 1] ?? "")) start--;
    lines.splice(start, i - start, ...gen.map((l) => indent + l));
    i = start; // continue scanning above the block we just wrote
  }
  return lines.join("\n");
}
