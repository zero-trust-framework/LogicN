/**
 * three-valued-governance.ts — proved fail-closed governance verdicts (Direction A)
 *
 * A governance verdict is three-valued, encoded as a balanced trit:
 *   +1 = ALLOW          (proof discharged, posture positive — may authorize)
 *   -1 = DENY           (definite refusal)
 *    0 = INDETERMINATE  (proof undischarged / evidence incomplete / substrate 0)
 *
 * The calculus is Kleene strong three-valued logic (K3). It is NOT re-implemented:
 * it reuses the #173/#196 balanced-ternary gates from tpl-simulator.ts, which are
 * already exactly K3 over the trit (DENY < INDETERMINATE < ALLOW):
 *   minTrit = Kleene ∧   ·   maxTrit = Kleene ∨   ·   negTrit = Kleene ¬
 * We import and wrap them with Verdict-typed names so tpl-simulator's semantics
 * (depended on by gate()/tmacVector()/consensusTrit) are never altered here. The
 * exact K3 match is pinned by tests/three-valued-governance.test.mjs — if a future
 * change made the gates diverge from K3, that oracle fails.
 *
 * Verdicts stay three-valued through composition; they collapse to a binary
 * decision ONLY at the trust boundary:
 *   collapse(+1) = allow ;  collapse(0) = deny (audited) ;  collapse(-1) = deny
 *   authorize(v) ⇔ v = +1
 * An INDETERMINATE collapsed to deny emits LLN-GOV-3VL-001 — never silent.
 *
 * See docs/Knowledge-Bases/logicn-three-valued-governance.md for the spec, the
 * fail-closed soundness theorem, and the no-coercion proof.
 */

import { minTrit, maxTrit, negTrit } from "./tpl-simulator.js";

// ── The trit verdict ─────────────────────────────────────────────────────────

/** A governance verdict as a balanced trit. */
export type Verdict = -1 | 0 | 1;

/**
 * Named verdict states. Same numeric encoding as tpl-simulator's TritState
 * (COMMIT/HOLD/REJECT) and core-logic's Tri (TRUE/UNKNOWN/FALSE) — a Verdict IS
 * a trit, so the existing gates operate on it directly.
 */
export const Verdict = {
  DENY: -1,          // definite refusal
  INDETERMINATE: 0,  // fail-closed neutral — undecided
  ALLOW: 1,          // may authorize
} as const;

// ── Kleene K3 calculus — Verdict-typed aliases of the shipped gates ───────────

/** Kleene ∧ (AND) — the more-cautious verdict wins (fail-closed). Delegates to minTrit. */
export function vAnd(a: Verdict, b: Verdict): Verdict {
  return minTrit(a, b) as Verdict;
}

/** Kleene ∨ (OR) — the more-permissive verdict wins. Delegates to maxTrit. */
export function vOr(a: Verdict, b: Verdict): Verdict {
  return maxTrit(a, b) as Verdict;
}

/** Kleene ¬ (NOT) — ALLOW ↔ DENY; INDETERMINATE ↦ INDETERMINATE (indeterminacy preserved). */
export function vNot(a: Verdict): Verdict {
  return negTrit(a) as Verdict;
}

// ── Composition (deny-by-default empty handling) ──────────────────────────────

/**
 * Conjunctive composition — "authorize only if EVERY clause allows."
 *
 * Deny-by-default: an empty clause set is INDETERMINATE (no clause granted
 * anything → no positive evidence → collapses to deny), NOT the vacuous-truth
 * ALLOW that a bare ∧-fold identity would give. Non-empty sets reduce WITHOUT an
 * ALLOW seed, so a single ALLOW clause is preserved (allOf([+1]) === ALLOW).
 */
export function allOf(verdicts: readonly Verdict[]): Verdict {
  if (verdicts.length === 0) return Verdict.INDETERMINATE;
  return verdicts.reduce((acc, v) => vAnd(acc, v));
}

/**
 * Disjunctive composition — "authorize if SOME clause allows."
 * Deny-by-default empty handling mirrors allOf: [] → INDETERMINATE → deny.
 */
export function anyOf(verdicts: readonly Verdict[]): Verdict {
  if (verdicts.length === 0) return Verdict.INDETERMINATE;
  return verdicts.reduce((acc, v) => vOr(acc, v));
}

// ── The collapse rule + authorization (the trust boundary) ────────────────────

/** Collapse a three-valued verdict to a binary decision. INDETERMINATE and DENY both deny. */
export function collapse(v: Verdict): "allow" | "deny" {
  return v === Verdict.ALLOW ? "allow" : "deny";
}

/** Fail-closed soundness: a verdict authorizes IFF it is exactly ALLOW (+1). */
export function authorize(v: Verdict): boolean {
  return v === Verdict.ALLOW;
}

// ── Audited boundary decision — LLN-GOV-3VL-001 ───────────────────────────────

/** The diagnostic code for an indeterminate verdict collapsed to deny at a boundary. */
export const GOV_3VL_DIAGNOSTIC = "LLN-GOV-3VL-001" as const;

/** Structured diagnostic record (shape compatible with the LogicDiagnostic family). */
export interface GovernanceDiagnostic {
  readonly code: typeof GOV_3VL_DIAGNOSTIC;
  readonly name: "INDETERMINATE_COLLAPSED_TO_DENY";
  readonly severity: "warning";
  readonly message: string;
}

/** Result of resolving a verdict at the trust boundary. */
export interface BoundaryDecision {
  readonly verdict: Verdict;
  readonly decision: "allow" | "deny";
  readonly authorized: boolean;
  /** Non-null IFF an INDETERMINATE verdict was collapsed to deny (LLN-GOV-3VL-001). */
  readonly diagnostic: GovernanceDiagnostic | null;
}

function indeterminateDiagnostic(): GovernanceDiagnostic {
  return {
    code: GOV_3VL_DIAGNOSTIC,
    name: "INDETERMINATE_COLLAPSED_TO_DENY",
    severity: "warning",
    message: "indeterminate governance verdict reached a trust boundary → collapsed to deny",
  };
}

/**
 * Resolve a verdict at the trust boundary, fail-closed and audited.
 *
 * - ALLOW (+1)         → authorized, decision "allow", no diagnostic.
 * - DENY (-1)          → not authorized, decision "deny", no diagnostic (ordinary policy denial).
 * - INDETERMINATE (0)  → not authorized, decision "deny", diagnostic LLN-GOV-3VL-001.
 *
 * The diagnostic is returned IN the result whenever a 0 is collapsed — it is
 * structurally impossible to drop an indeterminate verdict silently. The optional
 * sink lets a caller forward it to the AuditLogger egress.
 */
export function decideAtBoundary(
  v: Verdict,
  onDiagnostic?: (d: GovernanceDiagnostic) => void,
): BoundaryDecision {
  const diagnostic = v === Verdict.INDETERMINATE ? indeterminateDiagnostic() : null;
  if (diagnostic && onDiagnostic) onDiagnostic(diagnostic);
  return {
    verdict: v,
    decision: collapse(v),
    authorized: authorize(v),
    diagnostic,
  };
}
