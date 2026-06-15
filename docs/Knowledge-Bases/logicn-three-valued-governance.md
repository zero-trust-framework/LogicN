# LogicN Three-Valued Governance — Direction A sub-spec (proved fail-closed)

**Status:** spike sub-spec + implementation (Direction **A** of the photonic/ternary R&D agenda).
**Date:** 2026-06-15.
**Parent agenda:** `logicn-photonic-tri-substrate-rd-agenda.md` §3 (Direction A).
**Provenance:** the TMX-256 boundary review (`notes/31–33`) clarified the legitimate lane —
*govern* an emerging substrate, never *absorb* its hardware or crypto. This doc is the first
contained spike in that lane: make a governance **verdict** three-valued and **prove** it cannot
fail open.
**Implements on:** the `#173/#196` balanced-ternary gates in
`packages-logicn/logicn-tower-citizen/src/tpl-simulator.ts` (`minTrit / maxTrit / negTrit`).
**Module:** `packages-logicn/logicn-tower-citizen/src/three-valued-governance.ts`.
**Guardrails honoured:** deny-by-default / fail-closed; no invented crypto; no `.tmf`/TritMesh
coupling; LogicN stays a TypeScript-like `flow`+`contract` language (the module is plain TS, no
Rust/Zig). This is **Direction A only** — B (substrate/tolerance contracts) and C (noise model) are
explicitly out of scope and noted as follow-ups in §10.

---

## 1. Why three values

LogicN governance is effectively two-valued (allow / deny). But in practice a verdict can be
*neither*: a proof obligation is **undischarged**, evidence is **incomplete**, posture is
**uncertain**, or an analog/ternary substrate emits a literal `0`. Collapsing all of that into
`allow` is unsafe; collapsing it into `deny` *at the moment it arises* throws away the information
that an audit needs ("we denied because we could not decide", not "we denied because the policy
said no"). LogicN makes the third value **first-class through composition**, then collapses it to
`deny` **only at the trust boundary**, and **only with an audit record**.

The third value is `indeterminate` (`0`), distinct from "absent" — exactly the `Tri.UNKNOWN`
distinction `logicn-core` already documents (`tri-logic.md` §4: *"`unknown` is not the same as
`null`"*). This module is the **governance-verdict** specialisation of that idea, living next to the
balanced-ternary gates it reuses.

### Prior art (named, accurate)
- **Kleene strong three-valued logic (K3)** — `TRUE / FALSE / UNKNOWN`, conservative propagation
  (`U ∧ F = F`, `U ∨ T = T`, else `U`). The formal model this spec adopts.
- **SQL `NULL`** — three-valued logic in production for decades: a `WHERE` row survives only when the
  predicate is `TRUE`; `UNKNOWN` is excluded. The real-world "unknown ⇒ exclude/deny" precedent.
- **OPA `undefined`** and **Cedar deny-by-default** — policy-engine framings of the same gap, but
  neither ships a *proved* three-valued fail-closed calculus. That proof is the point of this spike.
- **Łukasiewicz Ł3 / Belnap four-valued** — alternatives. We start K3 (see §10 open question).

---

## 2. The trit verdict

A governance verdict is a **balanced trit** — the same numeric encoding the whole ternary stack
already agrees on, so the calculus is shared, not re-implemented:

| Verdict | trit | `tpl-simulator` `TritState` | `core-logic` `Tri` | meaning |
|---|---:|---|---|---|
| `ALLOW`         | `+1` | `COMMIT` | `TRI_TRUE`    | proof discharged, posture positive → may authorize |
| `DENY`          | `-1` | `REJECT` | `TRI_FALSE`   | definite refusal |
| `INDETERMINATE` | ` 0` | `HOLD`   | `TRI_UNKNOWN` | proof undischarged / evidence incomplete / substrate `0` |

`INDETERMINATE` is the **fail-closed neutral**, identical to the Epistemic-Hold posture
`tpl-simulator` already encodes as `HOLD = 0` and `consensusTrit`'s tie value. Because all three
encodings (`Verdict`, `TritState`, `Tri`) use the **same** `-1/0/+1`, a `Verdict` *is* a trit and
the existing gates operate on it directly — no conversion, no second algebra to keep in sync.

---

## 3. The Kleene K3 calculus — confirmed against the shipped gates

Direction A reuses three gates from `tpl-simulator.ts` as the verdict calculus:

- **Kleene ∧ (AND)** = `minTrit` — "the more-cautious input wins" (fail-closed).
- **Kleene ∨ (OR)**  = `maxTrit` — "the more-permissive input wins".
- **Kleene ¬ (NOT)** = `negTrit` — `+1 ↔ -1`, `0 ↦ 0`.

**These match the K3 truth tables exactly** under the order `DENY(-1) < INDETERMINATE(0) <
ALLOW(+1)`. Verified case-by-case (this is acceptance test #1, encoded in the oracle test, not just
asserted here):

**∧ = `minTrit` (9/9):**

| ∧ | `-1` | `0` | `+1` |
|---|---|---|---|
| **`-1`** | `-1` | `-1` | `-1` |
| **`0`**  | `-1` | `0`  | `0`  |
| **`+1`** | `-1` | `0`  | `+1` |

**∨ = `maxTrit` (9/9):**

| ∨ | `-1` | `0` | `+1` |
|---|---|---|---|
| **`-1`** | `-1` | `0`  | `+1` |
| **`0`**  | `0`  | `0`  | `+1` |
| **`+1`** | `+1` | `+1` | `+1` |

**¬ = `negTrit` (3/3):** `¬(-1) = +1`, `¬(0) = 0`, `¬(+1) = -1`.

> **No adaptation was needed.** `minTrit`/`maxTrit`/`negTrit` already *are* Kleene K3 over the
> balanced trit. We therefore do **not** touch `tpl-simulator`'s semantics (other code — gates,
> T-MAC, consensus — depends on them); the verdict module imports the gates and wraps them with
> `Verdict`-typed names (`vAnd`/`vOr`/`vNot`). If a future change ever made these diverge from K3,
> the oracle test in §8.1 fails — the match is pinned, not trusted.

**Indeterminacy is preserved under ¬.** `¬(0) = 0`: a negation never turns "we don't know" into a
definite verdict. Only *definite* verdicts flip. This is the first half of why `0` cannot become
`ALLOW` (the second half is composition, §6).

### Composition operators

- `vAnd(a, b)` / `vOr(a, b)` / `vNot(a)` — binary/unary gates above.
- `allOf(verdicts)` — conjunctive fold (`vAnd`). "Authorize only if **every** clause allows."
- `anyOf(verdicts)` — disjunctive fold (`vOr`). "Authorize if **some** clause allows."

**Empty-set rule (deny-by-default, binding):** `allOf([])` and `anyOf([])` both return
`INDETERMINATE` — **not** the mathematical fold identity (`+1` for ∧, `-1` for ∨). An empty clause
set means *no clause granted anything*, so there is no positive evidence to authorize on; the honest
verdict is "indeterminate" → collapses to `deny` (§4). Concretely the folds reduce **without an
`ALLOW` seed** (so a single `ALLOW` clause is preserved: `allOf([+1]) = +1`), and special-case the
empty list to `INDETERMINATE`. This prevents a "vacuous truth" allow.

---

## 4. The collapse rule (the trust boundary)

Inside composition the verdict stays three-valued. At the **trust boundary** — the single point
where a verdict becomes an authorization decision — it collapses to a binary outcome:

```
collapse(+1) = allow
collapse( 0) = deny      ← audited: LLN-GOV-3VL-001
collapse(-1) = deny
authorize(v) ⇔ v = +1
```

Only `ALLOW (+1)` authorizes. `INDETERMINATE (0)` and `DENY (-1)` both deny. The collapse of an
`INDETERMINATE` is **never silent**: it emits diagnostic `LLN-GOV-3VL-001` (§7) so an auditor can
distinguish "denied by policy" from "denied because undecided".

---

## 5. The theorem — fail-closed soundness

> **Theorem (Fail-Closed Soundness).** For every verdict `v ∈ {-1, 0, +1}`,
> `authorize(v) ⇔ v = +1`. Equivalently `collapse(0) = collapse(-1) = deny` and
> `collapse(+1) = allow`. **No `INDETERMINATE` verdict can ever authorize.**

This is the boundary half, and it is trivially exhaustive over three values (§8.3).

> **Theorem (No Coercion in Composition).** Let `E` be any expression built from `vAnd`, `vOr`,
> `vNot` over leaf verdicts in `{-1, 0, +1}`. Let `E[0→-1]` be `E` with every leaf of value `0`
> replaced by `-1`. Then:
> - `(P+)` `eval(E) = +1  ⟹  eval(E[0→-1]) = +1`, and
> - `(P-)` `eval(E) = -1  ⟹  eval(E[0→-1]) = -1`.
>
> **Consequence:** a *definite* verdict (`±1`) never depends on an `INDETERMINATE` input — the
> `0`s are not load-bearing. In particular an `ALLOW` is always "earned" by genuine `ALLOW`
> evidence; **`0` cannot be coerced into the `+1` that authorizes, anywhere in composition.**

**Proof (structural induction, mutual on P+ and P-).**
- *Leaf:* if `eval = +1` the leaf is `+1` (not `0`), unchanged by `[0→-1]`; likewise `-1`. ✔
- *`vNot a`:* `eval(¬a)=+1 ⟹ eval(a)=-1 ⟹` (P-) `eval(a[0→-1])=-1 ⟹ eval(¬a[0→-1])=+1`.
  `eval(¬a)=-1 ⟹ eval(a)=+1 ⟹` (P+) `… = -1`. ✔ (uses `¬(0)=0`, so a `0` under `¬` stays `0` and
  never reaches a definite branch.)
- *`vAnd a b` (min):* `min=+1 ⟹ a=b=+1 ⟹` (P+) both stay `+1 ⟹ min=+1`. `min=-1 ⟹ a=-1 ∨ b=-1`;
  the `-1` operand stays `-1` by (P-), and `min ≤ -1 ⟹ min=-1`. ✔
- *`vOr a b` (max):* `max=+1 ⟹ a=+1 ∨ b=+1`; that operand stays `+1` by (P+), and `max ≥ +1 ⟹
  max=+1`. `max=-1 ⟹ a=b=-1 ⟹` (P-) both stay `-1 ⟹ max=-1`. ✔ ∎

Both theorems are pinned as **exhaustive** tests (§8): the boundary theorem over all 3 values, the
composition theorem over **all expression trees up to depth 4** (operators `{¬, ∧, ∨}`, leaves
`{-1,0,+1}`) — a finite, fully-enumerated space, not a sample.

---

## 6. Why this is genuinely fail-closed (intuition)

Two independent guarantees stack:
1. **Boundary:** the only gate to authorization is `v = +1`. A `0` or `-1` at the boundary denies.
2. **Calculus:** the Kleene gates can never *manufacture* a `+1` from a `0` (§5, No-Coercion). A `0`
   propagates as `0` until either a genuine `+1` (under ∨) or a genuine `-1` (under ∧/¬-chains)
   resolves it — and if it reaches the boundary still `0`, it denies and is audited.

So there is no path — boundary or compositional — by which "we don't know" becomes "allow".

---

## 7. Diagnostic — `LLN-GOV-3VL-001`

| Field | Value |
|---|---|
| **code** | `LLN-GOV-3VL-001` |
| **name** | `INDETERMINATE_COLLAPSED_TO_DENY` |
| **severity** | `warning` (fail-*safe*: the system denied correctly; the warning flags that a decision was *undecidable*, which an operator/auditor should see) |
| **message** | `indeterminate governance verdict reached a trust boundary → collapsed to deny` |
| **family** | `LLN-GOV-*` (alongside `LLN-GOV-SUMMARY-*`, `LLN-GOV-004`) |

**Never silent.** `decideAtBoundary` returns the diagnostic record *in the result* whenever it
collapses an `INDETERMINATE` — it is structurally impossible to collapse a `0` without producing the
record. An optional `onDiagnostic` sink lets callers route it to the `AuditLogger` egress. A `DENY
(-1)` at the boundary is an ordinary policy denial and does **not** emit `LLN-GOV-3VL-001` (it is not
indeterminate). Registered in `docs/Knowledge-Bases/compiler-diagnostics.md` → "Governance Summary"
neighbourhood, new "Three-Valued Governance" subsection.

**Relationship to existing Tri-safety codes.** `LLN-SAFETY-003 TRI_UNKNOWN_AS_TRUE` (compiler) bans
mapping `Tri.unknown → true` *without a policy* in source. `LLN-GOV-3VL-001` is the **runtime**
counterpart at the governance trust boundary: the policy here is "unknown → deny, audited". They are
complementary, same fail-closed spirit at two layers.

---

## 8. Acceptance tests (all in `tests/three-valued-governance.test.mjs`)

Mapping to the agenda §3 acceptance list (`1`–`4`) plus the two soundness encodings:

1. **Kleene oracle (agenda #1).** All 9 `∧`, 9 `∨`, 3 `¬` cases match an *independent* K3 reference
   table **and** match `vAnd/vOr/vNot` (which delegate to `minTrit/maxTrit/negTrit`). A real oracle,
   not a backend-vs-backend differential (the `#185` pattern).
2. **Collapse rule.** `collapse(+1)=allow`, `collapse(0)=deny`, `collapse(-1)=deny`.
3. **Boundary soundness (agenda #2, Theorem 1).** `authorize(v) ⇔ v = +1`, exhaustive over `{-1,0,+1}`;
   and for `allOf`, authorization ⇔ **every** clause is `+1` (exhaustive over all assignments, `n≤4`).
4. **Undischarged obligation (agenda #3).** A clause set containing an `INDETERMINATE` denies, and
   `decideAtBoundary` produces `LLN-GOV-3VL-001` (audited, non-null), exactly once, for the `0` case.
5. **No-coercion property (Theorem 2).** Over **all** expression trees to depth 4: `eval(E)=+1 ⟹
   eval(E[0→-1])=+1` and `eval(E)=-1 ⟹ eval(E[0→-1])=-1`. Zeros never load-bearing for a definite
   verdict ⇒ `0` cannot be coerced to `+1`.
6. **Differential / no regression (agenda #4).** Restricted to leaves `{-1,+1}` (no `0` ever arises),
   the calculus is *exactly* two-valued Boolean: `vAnd`=AND, `vOr`=OR, `vNot`=NOT, `authorize∘collapse`
   = classical "allow iff true", and **zero** `LLN-GOV-3VL-001` diagnostics are emitted across every
   Boolean-only composition. Existing two-valued policies behave identically.
7. **Out-of-set trap.** Non-trit inputs throw `SecurityTrap` (inherited from the `assertTrit` guard in
   the underlying gates) — no silent coercion of toxic input.
8. **Empty-set deny-by-default.** `allOf([])` and `anyOf([])` are `INDETERMINATE` → deny.

---

## 9. Module API (summary)

```ts
// three-valued-governance.ts  (logicn-tower-citizen)
export const Verdict = { DENY: -1, INDETERMINATE: 0, ALLOW: 1 } as const;
export type  Verdict = -1 | 0 | 1;

export function vAnd(a: Verdict, b: Verdict): Verdict;   // = minTrit (Kleene ∧)
export function vOr (a: Verdict, b: Verdict): Verdict;    // = maxTrit (Kleene ∨)
export function vNot(a: Verdict): Verdict;                // = negTrit (Kleene ¬)

export function allOf(vs: readonly Verdict[]): Verdict;   // conjunctive; [] → INDETERMINATE
export function anyOf(vs: readonly Verdict[]): Verdict;   // disjunctive; [] → INDETERMINATE

export function collapse(v: Verdict): "allow" | "deny";   // 0,-1 → deny ; +1 → allow
export function authorize(v: Verdict): boolean;           // ⇔ v === ALLOW

export const GOV_3VL_DIAGNOSTIC = "LLN-GOV-3VL-001";
export interface GovernanceDiagnostic { code; name; severity; message; }
export interface BoundaryDecision { verdict; decision; authorized; diagnostic; }
export function decideAtBoundary(
  v: Verdict, onDiagnostic?: (d: GovernanceDiagnostic) => void,
): BoundaryDecision;   // emits LLN-GOV-3VL-001 iff v === INDETERMINATE
```

---

## 10. Follow-ups (explicitly NOT in this spike)

- **Direction B — substrate/tolerance contracts.** `substrate{}`/`tolerance{}` blocks; the
  crypto-on-deterministic-core invariant (`LLN-SUBSTRATE-CRYPTO-ON-NOISY`). Reuses these verdicts.
- **Direction C — substrate noise model.** Seeded phase-drift/crosstalk model extending
  `tpl-simulator`; `LLN-SUBSTRATE-*` diagnostics. Direction B's B2 obligation checks against it.
- **Open question (K3 vs Belnap).** If an audit ever needs to distinguish *conflicting* evidence
  (`both`) from *no* evidence (`neither`), revisit with Belnap four-valued. Start K3; the verdict
  type is the natural extension point.

## 11. Cross-references

`logicn-photonic-tri-substrate-rd-agenda.md` (parent, §3) · `notes/31–33` (TMX boundary) ·
`tpl-simulator.ts` (`#173/#196` gates) · `tests/ternary-ops.test.mjs` (gate truth tables) ·
`wat-host-stdlib-oracle.test.mjs` (`#166/#185` oracle pattern) · `compiler-diagnostics.md`
(`LLN-GOV-3VL-001` registry) · `logicn-core/docs/tri-logic.md` (`Tri`/`unknown` vs `null`) ·
`logicn-core-logic` (`Tri`/`Decision` types — same `-1/0/+1` encoding).
