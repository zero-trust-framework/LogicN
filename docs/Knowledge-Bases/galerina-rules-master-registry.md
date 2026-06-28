# Galerina — Master Rules Registry (Consolidated Snapshot)

**Version:** 1.0 (2026-06-28) — generated consolidation
**Status:** Consolidated, read-only snapshot. **NOT the source of truth.**

> **Source-of-truth note.** This file is a *consolidated, point-in-time index* of every Galerina
> governance / security / compliance rule and `FUNGI-*` diagnostic code found across the Knowledge-Base
> docs and the package sources, assembled to give one place to look up "all rules".
> The **authoritative, living source of truth for numbered rules + diagnostic codes is
> [`galerina-governance-rules.md`](galerina-governance-rules.md)** — when this snapshot and that
> registry disagree, that registry wins. Compliance-package codes live in
> [`galerina-compliance-governance.md`](galerina-compliance-governance.md) /
> [`galerina-compliance-packages.md`](galerina-compliance-packages.md); type/operator/field codes live
> in [`galerina-trust-sensitivity-type-rules.md`](galerina-trust-sensitivity-type-rules.md),
> [`operator-type-rules.md`](operator-type-rules.md), and [`field-read-rules.md`](field-read-rules.md).

All governance/diagnostic codes use the **`FUNGI-*`** namespace (the legacy `FUNGI-*` namespace is retired).

**Enforcement legend:**
- **ENFORCED** — the compiler/runtime rejects (or traps on) violations today.
- **ADVISORY / WARN** — emitted as a warning, not a hard failure.
- **PLANNED** — scheduled for a DRCM phase / future version; parsed or specified but not yet enforced.
- **PRINCIPLE** — architecture discipline, not (yet) compiler-enforced.
- **RUNTIME** — fires at runtime (trap / audit event), not at compile time.

**How to read the tables:** `Code (FUNGI-*) | Rule / what it enforces | Enforcement | Source doc`.
Source-doc shorthand: **gov** = `galerina-governance-rules.md`; **comp-gov** = `galerina-compliance-governance.md`;
**comp** = `galerina-compliance.md`; **comp-pkg** = `galerina-compliance-packages.md`;
**trust** = `galerina-trust-sensitivity-type-rules.md`; **op** = `operator-type-rules.md`; **field** = `field-read-rules.md`.

---

## ⚠️ Policy Disambiguation (carried from the SoT)

Three distinct "policy"-related concepts exist in Galerina and must never be confused:

| Concept | Syntax | Location | Purpose |
|---|---|---|---|
| **Domain Guard Policy** | `policy DomainName { permitted_effects {} enforced_limits {} }` | External file in `governance/policies/` | Immutable ceiling; referenced via `[conforms_to: X]` on `contract {}` |
| **`access {}` Capability Negotiation (v2.1)** | `access { purpose "..." allow T to "..." }` | Inline block **between** `contract {}` and `{ body }` | Active negotiation of call-boundary rights; replaces deprecated inline `policy {}` |
| **Emergency Policy Overlay** | `policy { emergency { on X { deny Y } } }` | Inline block **between** `contract {}` and `{ body }` | Runtime monotonic security overlay per-flow |

- Domain Guard Policies → rules K-000, FUNGI-GOV-004, FUNGI-LIMIT-001, FUNGI-GOV-019 (see `galerina-domain-guard-policies.md`)
- `access {}` / legacy inline `policy {}` → S-009, FUNGI-SYNTAX-LEGACY-003
- Emergency Policy Overlays → S-008, M-001..M-003, FUNGI-MONO-001/002/003

---

## 1. Syntax & Contract Structure (S-/C-)

| Code (FUNGI-*) | Rule / what it enforces | Enforcement | Source doc |
|---|---|---|---|
| FUNGI-GOV-001 | S-001: `contract {}` placed inside the flow body (must sit between signature and body) | ENFORCED | gov |
| FUNGI-GOV-005 | S-002: flow qualifier (`pure`/`guarded`/`secure`) must match the authority declared | ENFORCED | gov |
| FUNGI-GOV-010 | S-003 / A-001 / A-003: missing `intent {}` on a secure/guarded flow, OR logic/URLs/vars smuggled into an `intent {}` string (prompt-injection guard) | ENFORCED | gov |
| FUNGI-EFFECT-001 | S-004 / E-001: side effect performed but not declared in `effects {}` (deny-by-default; omitting `effects` = pure) | ENFORCED | gov |
| FUNGI-GOV-020 | S-008: `policy {}` placed inside `contract {}` (must be a separate block) | PLANNED (DRCM Phase 4) | gov |
| FUNGI-SYNTAX-LEGACY-003 | S-009: inline `policy {}` between contract and body — use `access {}`; `policy` keyword reserved for State Mutation Governance | ADVISORY (v2.1) | gov |
| FUNGI-INV-003 | S-005: `invariant {}` misplaced (outside `contract {}`) / declared empty | ENFORCED (empty-block, task #36) + PLANNED (misplacement, Phase 2) | gov |
| FUNGI-STEP-001 | S-006: `step` used as a contract clause instead of a body-level keyword | PLANNED (DRCM Phase 5) | gov |
| FUNGI-GOV-003 | C-001: `request {}` / `response {}` on a non-API/internal/pure flow | ENFORCED | gov |
| FUNGI-GOV-018 | C-003: `liability {}` hand-authored in source (it is auto-computed) | ENFORCED | gov |
| FUNGI-GOV-017 | C-004: `cyber_physical_hardening {}` without ASIC hardware + high liability | ENFORCED | gov |
| *(no code)* | S-000: module path separator `::` canonical (both `::` and `.` accepted) | ENFORCED (Stage A) | gov |
| *(no code)* | S-007: named arguments at call sites unsupported in Stage A — use positional | ENFORCED (Stage A parser) | gov |
| *(no code)* | C-002: `secrets {}` / `economics {}` / `epilogue {}` are auto-by-default; declaring = explicit override | ENFORCED | gov |
| *(no code)* | C-005: AI may only *propose* widening of authority/effects/secrets via propose→verify→approve | PRINCIPLE + PLANNED | gov |

---

## 2. Effects (E-)

| Code (FUNGI-*) | Rule / what it enforces | Enforcement | Source doc |
|---|---|---|---|
| FUNGI-EFFECT-001 | E-001: all external access must be declared in `effects {}` (families: `audit.write`, `ledger.mutate`, `network.outbound/inbound`, `storage.read/write`, `state.mutate`, `db.read/write`, `secret.access`, `shell.execute`, `ai.call`) | ENFORCED | gov |
| FUNGI-EFFECT-002 | E-002: effects are additive — declaring a subset of what the body performs is rejected | ENFORCED | gov |
| FUNGI-EFFECT-003 | E-003: any effect in a `pure` flow is always a hard error (no warning) | ENFORCED | gov |

---

## 3. Secrets, Value-State & Privacy Taint (K-004, P-002, AU-003)

| Code (FUNGI-*) | Rule / what it enforces | Enforcement | Source doc |
|---|---|---|---|
| FUNGI-SECRET-001 | K-004 / A-005: `SecureString` (anything reading from / derived from `secret.get`/`vault.read`/`kms.decrypt`/`secrets.*`) flows to a log/audit sink. Declassifier: `redact()` | ENFORCED | gov |
| FUNGI-SECRET-002 | K-004: secret flows to a network/egress sink (http/https/fetch/email). Also fires on `SecureString == x` (use `constantTimeEquals()`). Declassifier: `redact()` | ENFORCED | gov, op |
| FUNGI-SECRET-003 | K-004 / AU-003: secret flows to serialize/JSON/audit-record sink. Declassifier: `redact()` | ENFORCED | gov |
| FUNGI-SECRET-004 | K-004: secret-dependent branch / control flow (timing side-channel, CWE-208). Mitigation: `Crypto.constantTimeEquals()` / balance both arms | ENFORCED (warning) | gov |
| FUNGI-PRIVACY-002 | P-002: cleartext semantic embedding (`Embedding`/`EmbeddingResult`, vec2text-invertible) flows to network/egress. Declassifier (sole): `seal()` / `encrypt()` — `validate`/`parse`/`decode` do NOT declassify | ENFORCED | gov |
| FUNGI-PRIVACY-001 | declarative `privacy {}` block `deny protected X to Y` clause | PLANNED (Phase 10C+) | gov |
| FUNGI-SECRET-BREACH | K-005 / AU-002: secret detected in output stream by DSS sink monitor (cleartext-prefix scan), runtime trap 3001 | PLANNED (Phase 1) | gov |
| FUNGI-SECRET-FATAL | secret breach caused a DSS permission drop | PLANNED (Phase 1) | gov |
| FUNGI-CLI-REDACT-001 | CLI output tripwire: a bare credential (PEM/`AKIA…`/`ghp_…`/`xox?-…`/JWT) or `key=value` secret reached CLI output; `redactCliOutputChecked` scrubs + surfaces the marker. Defense-in-depth, not the primary boundary | ENFORCED (R&D 0094) | gov |

> Derivation propagates: a secret carried through `slice`/concat/member/record/non-redacting call stays `SecureString`. `redact()` is the sole declassifier. **Bool-typed** results of secret comparisons are exempt from taint; a `trap` that fires before a sink clears the taint chain.

---

## 4. Capabilities & Network/SSRF (K-/I-)

| Code (FUNGI-*) | Rule / what it enforces | Enforcement | Source doc |
|---|---|---|---|
| FUNGI-CAP-001 | K-000/K-001: raw-string capability declaration, or wildcard `*` in `NetworkTarget` (must use typed `SystemCapability` / algebraic `NetworkTarget` variants) | PLANNED (DRCM Phase 4) | gov |
| FUNGI-CAP-002 | K-002: `UnrestrictedInternet` network target without explicit `authority {}` policy authorization | PLANNED (DRCM Phase 4) | gov |
| FUNGI-CAP-003 | K-003: path traversal / symlink-escape / Unicode-bypass in a filesystem capability path (canonicalized at compile time) | PLANNED (DRCM Phase 4) | gov |
| FUNGI-CAP-004 | I-002: guest DWI isolate attempted to mutate V_DPM directly | PLANNED (DRCM Phase 5) | gov |
| FUNGI-CAP-CONFUSION | capability request fails structural match | PLANNED (DRCM Phase 4) | gov |
| FUNGI-STEP-002 | I-001: cross-trust-boundary call made without `step` (no live pointers may cross; `step` allocates a shared-nothing ≤4 MB DWI isolate) | PLANNED (DRCM Phase 5) | gov |

> Architecture rules without their own code: I-003 (DWI isolates shared-nothing, no global mutable state — structurally enforced by the WASM linear-memory model); I-004 (DSS itself is a `.fungi`→WASM program; Wasmtime is the TCB).

---

## 5. Monotonic Security / DRCM Posture (M-)

| Code (FUNGI-*) | Rule / what it enforces | Enforcement | Source doc |
|---|---|---|---|
| FUNGI-MONO-001 | M-001: attempted capability expansion — once a V_DPM bit is cleared it cannot be re-set in the same session (Monotonic Security Rule) | PLANNED (DRCM Phase 4) | gov |
| FUNGI-MONO-002 | M-002: capability requested beyond the Wasmtime launch configuration (DPM bounded by OCI/gVisor Layer-2) | PLANNED (DRCM Phase 5) | gov |
| FUNGI-MONO-003 | M-003: emergency policy overlay attempted de-escalation (overlays are one-way; may escalate Tier1→2→3, never revert) | PLANNED (DRCM Phase 4) | gov |

---

## 6. Invariants & Termination (INV-/TERM-)

| Code (FUNGI-*) | Rule / what it enforces | Enforcement | Source doc |
|---|---|---|---|
| FUNGI-INV-000 | RUNTIME — `unreachable` hardware trap fired; DSS emits Audit Event (CBOR Tag 410) | PLANNED (DRCM Phase 5, #76) | gov |
| FUNGI-INV-001 | pre-condition `ensure expr` statically proved false at compile time | ENFORCED (task #36) | gov |
| FUNGI-INV-002 | post-condition `ensure` failed after body (DbC output post-condition) | PLANNED (Phase 2) | gov |
| FUNGI-INV-003 | `invariant {}` declared empty, or misplaced outside `contract {}` | ENFORCED (empty) + PLANNED (misplacement) | gov |
| FUNGI-INV-004 | `ensure` expression references a symbol not in the flow's parameter scope | ENFORCED (task INV-004) | gov |
| FUNGI-TERM-001 | `decreases` annotation violation (termination proof) | ENFORCED | gov |

---

## 7. Substrate / Crypto-Lane / Tiering (SUBSTRATE-/CRYPTO-/TIER-)

| Code (FUNGI-*) | Rule / what it enforces | Enforcement | Source doc |
|---|---|---|---|
| FUNGI-SUBSTRATE-001 | crypto-on-core: `crypto.hash/sign/verify/encrypt/decrypt/seal` must run on a deterministic bit-exact (digital) lane | ENFORCED | gov |
| FUNGI-SUBSTRATE-005 | compute-only-lane: a network/persistence/secret/process external-reach effect declared on a noisy/photonic lane — that lane is an untrusted Tier-3 compute-only accelerator with ZERO external reach; effect must move to a digital lane (confused-deputy fence) | ENFORCED | gov |
| FUNGI-CRYPTO-PQ-001 | `crypto.sign` in a certified profile must declare a PQ/hybrid algorithm (`crypto.sign.hybrid`/`mldsa65`/`slhdsa`) | ENFORCED (certified profiles) | gov |
| FUNGI-RETAIN-001 | sound-erasure: a write-once/fixed-media substrate (`eraseModel: crypto-only`) may only receive KEM-DEM ciphertext; cleartext-secret-tainted value reaching it is fail-closed. "Delete" = key destruction + witness (NIST SP 800-88 "Purge") | ENFORCED at decision core + signed discovery rail (R&D 0116/0118); Stage-1 trap / Stage-3 witness owner-gated; physical dispatch HW-gated | gov |

---

## 8. Tenant Isolation / IDOR (TENANT-)

| Code (FUNGI-*) | Rule / what it enforces | Enforcement | Source doc |
|---|---|---|---|
| FUNGI-TENANT-001 | dangling `tenant.scope` caller-scope binding with no `.tenant_scoped` data-access effect to bind (advisory) | ENFORCED (R&D 0109) | gov |
| FUNGI-TENANT-002 | tenant-scoped data access (`*.tenant_scoped`) not bound to the caller's proven scope — deny-by-default IDOR / OWASP-A01 compile gate, fail-closed in every profile (capability intersection over the manifest) | ENFORCED (R&D 0109) | gov |
| FUNGI-TENANT-003 | body-dataflow proof that the tenant binding is actually applied (deferred follow-on to TENANT-002) | PLANNED (deferred) | gov |

---

## 9. Identity, Attestation & Proof Receipts (ID-/PROOF-CERT-/ASSUME-/AU-)

| Code (FUNGI-*) | Rule / what it enforces | Enforcement | Source doc |
|---|---|---|---|
| FUNGI-ID-001 | ID-001/ID-003: compiled artifact's `.lmanifest` missing, tampered, or signature/hash verification failed (Ed25519 + ML-DSA-65; SHA-256 binary hash). Hard admission gate | PLANNED (DRCM Phase 3) | gov |
| FUNGI-PROOF-CERT-001 | certified profile refuses a Phase-1 placeholder / undecodable `zk_snark_receipt` proof (forgeable public-input recompute). CWE-347/345 | ENFORCED (R&D 0094, certified path) | gov |
| FUNGI-PROOF-CERT-002 | certified profile rejected a `zk_snark_receipt` that did not `verify() === true` against the claimed input (or no verifier supplied — deny-by-default) | ENFORCED (R&D 0094, certified path) | gov |
| FUNGI-ASSUME-001 | PT-001: `assuming(flowRef,"claim")` condition not found in the referenced flow's manifest ProofObligations | PLANNED (task #73) | gov |
| FUNGI-ASSUME-002 | referenced manifest signature invalid or expired | PLANNED (task #74) | gov |
| FUNGI-ASSUME-003 | manifest `sourceHash` mismatch — referenced flow changed since the manifest was signed | PLANNED (task #74) | gov |
| FUNGI-ASSUME-004 | condition found as `runtime-precheck` only (partial proof — WAT gate still needed) | PLANNED (task #74) | gov |
| FUNGI-AU-001 | AU-001: `epilogue { strategy: none }` on a high-trust flow (`max_risk_liability: high`) | PLANNED (DRCM Phase 6) | gov |

> ID-002 (ML-DSA-65 = minimum PQ signing algorithm for `.lmanifest`, epilogue receipts, GovernanceSignature) and AU-002 (output streams pass the Secret Sink Monitor) are PRINCIPLE/PLANNED rules without distinct compile codes.

---

## 10. Resilience / Fault-Handling / Observability (RES-/FAULT-/OBS-)

| Code (FUNGI-*) | Rule / what it enforces | Enforcement | Source doc |
|---|---|---|---|
| FUNGI-RES-001 | `retry` on `database.write`/`gateway.charge` without `idempotent: true` | ENFORCED (task #58) | gov |
| FUNGI-RES-CB-PENDING | declared-but-inert safety control: `resilience { fallback circuit_breaker }` is a NO-OP today (DRCM Phase 5) — must not read as enforced | ENFORCED warning (R&D 0120) | gov |
| FUNGI-FAULT-001 | `on_denial_fault retry` — retrying a capability denial collides with deny-only monotonicity (FUNGI-MONO-001) | ENFORCED (0017) | gov |
| FUNGI-FAULT-002 | `fallback <flow>` whose effect-set is not a subset of the post-fault capability set | PLANNED (0017 follow-on) | gov |
| FUNGI-FAULT-003 | fail-OPEN fault action (`log` outside the `on_rotation_fault` back-compat opt-in — keeps serving past the fault) | ENFORCED (0017) | gov |
| FUNGI-FAULT-004 | `fallback <flow>` recursion/cycle beyond depth-1 | PLANNED (0017 follow-on) | gov |
| FUNGI-OBS-001 | explicit `observability {}` on a `pure` flow (no side effects to observe) | ENFORCED (task #58) | gov |

---

## 11. Economics (EC-)

| Code (FUNGI-*) | Rule / what it enforces | Enforcement | Source doc |
|---|---|---|---|
| FUNGI-EC-001 | EC-002: static cost overflow — estimated loop cost exceeds `max_aggregate_flow_budget` | PLANNED (DRCM Phase 5) | gov |
| FUNGI-EC-002 | EC-003: `charge_failure_tolerance_ratio` breached — DPM quarantine triggered (monotonic, per M-001) | PLANNED (DRCM Phase 5) | gov |

> EC-001 (economics auto-by-default; declare only to override) is a no-code ENFORCED rule.

---

## 12. Resources / Isolation Runtime (RESOURCE-)

| Code (FUNGI-*) | Rule / what it enforces | Enforcement | Source doc |
|---|---|---|---|
| FUNGI-RESOURCE-001 | fuel exhaustion in a DWI isolate | PLANNED (DRCM Phase 5) | gov |

---

## 13. Supply-Chain / SBOM / Workspace-Index Integrity (SBOM-/INTEL-/SUPPLY-)

| Code (FUNGI-*) | Rule / what it enforces | Enforcement | Source doc |
|---|---|---|---|
| FUNGI-SBOM-001 | CycloneDX SBOM must never claim integrity it lacks — a component without a well-formed `sha256:<64hex>` hash is emitted `galerina:integrity=UNVERIFIED`, BOM marked `complete=false` (fail-closed) | ENFORCED (R&D 0120-F3) | gov |
| FUNGI-INTEL-001 | poisoned-index guard: `workspace.lindex` bound under an integrity tag (HMAC-SHA256 if `GALERINA_INDEX_HMAC_KEY` set, else SHA-256); mismatch → discard cache + full re-parse (fail-closed) | ENFORCED (R&D 0098) | gov |
| FUNGI-INTEL-002 | a caller-supplied `indexDir` containing a `..` traversal segment is refused before any write (CWE-22) | ENFORCED (R&D 0098) | gov |
| FUNGI-SUPPLY-001 | OWASP-A06: supply-chain attestation drift against the hash-pinned lockfile | PLANNED / package-level (described in comp-gov OWASP table) | comp-gov |

---

## 14. Imports & Source Boundary (IMPORT-/IM-)

| Code (FUNGI-*) | Rule / what it enforces | Enforcement | Source doc |
|---|---|---|---|
| FUNGI-IMPORT-005 | IM-: import path escapes the allowed project root — pre-governance path traversal (must stay within `GALERINA_FS_ROOT`/cwd; segment-safe + post-symlink-canonicalization) | ENFORCED | gov |
| FUNGI-IMPORT-006 | imported file exceeds the maximum import size — compile-time read-DoS guard (stat-checked before read) | ENFORCED | gov |
| FUNGI-IMPORT-001 | IM-001: `import "./path.fungi"` target file not found at the resolved path | PLANNED (v2.1) | gov |
| FUNGI-IMPORT-002 | IM-002: imported file has parse errors — cannot merge DAG | PLANNED (v2.1) | gov |
| FUNGI-IMPORT-003 | IM-003: circular import detected in the import chain | PLANNED (v2.1) | gov |
| FUNGI-IMPORT-004 | IM-004: imported symbol name conflicts with a local definition (local wins) | PLANNED warning (v2.1) | gov |

---

## 15. Access / Assimilation / Gate (ACCESS-/ASSIMILATE-/GATE-)

| Code (FUNGI-*) | Rule / what it enforces | Enforcement | Source doc |
|---|---|---|---|
| FUNGI-ACCESS-001 | AC-001: `access { grant X }` references an unknown capability name | PLANNED warning (v2.1) | gov |
| FUNGI-ACCESS-002 | AC-002: `grant` capability not declared in the flow's `effects {}` | PLANNED warning (v2.1) | gov |
| FUNGI-ASSIMILATE-001 | AS-001: `assimilate` plugin declared outside `boot.fungi` (boot-time only) | PLANNED warning (v2.1) | gov |
| FUNGI-ASSIMILATE-002 | AS-002: `assimilation_memory_budget` not declared in `governance {}` | PLANNED warning (v2.1) | gov |
| FUNGI-ASSIMILATE-003 | AS-003: assimilated plugin has no `access { grant }` block (inherits no capabilities) | PLANNED error (v2.1) | gov |
| FUNGI-GATE-001 | GT-001: `gate(condition)` references a condition not in `knownDomainGuards` | PLANNED warning → Phase-5 error (v2.1) | gov |
| FUNGI-GATE-002 | GT-002: `gate {}` wrapping a `pure flow` (redundant — pure flows have no effects) | PLANNED (v2.1) | gov |

---

## 16. Static Declarations & Bitfields (STATIC-/BF-)

| Code (FUNGI-*) | Rule / what it enforces | Enforcement | Source doc |
|---|---|---|---|
| FUNGI-STATIC-001 | ST-001: `static` value is not a compile-time constant (contains runtime expressions) | PLANNED (v2.1) | gov |
| FUNGI-STATIC-002 | ST-002: `static` name declared more than once in scope | PLANNED (v2.1) | gov |
| FUNGI-BF-001 | BF-001: two fields in a `bitfield` use the same bit position | PLANNED (v2.1) | gov |
| FUNGI-BF-002 | BF-002: bit position exceeds 31 (V_DPM is a 32-bit register) | PLANNED (v2.1) | gov |

---

## 17. Feature Gates & Lifecycle (FG-/DRCM-/DEP-)

| Code (FUNGI-*) | Rule / what it enforces | Enforcement | Source doc |
|---|---|---|---|
| FUNGI-DRCM-UNSUPPORTED | A-004: bare `step`/DRCM syntax used without an `@experimental_profile` wrapper in `--release` | PLANNED (parser, 2026-07) | gov |
| FUNGI-FG-001 | FG-001: `@experimental_profile` wraps already-stable syntax (cleanup signal) | PLANNED (parser, 2026-07) | gov |
| FUNGI-DEP-001 | LC-002: deprecated syntax in use — migration available | PLANNED (post-DRCM) | gov |

---

## 18. Type System — Trust/Sensitivity & Operators (TYPE-/SAFETY-)

| Code (FUNGI-*) | Rule / what it enforces | Enforcement | Source doc |
|---|---|---|---|
| FUNGI-TYPE-003 | a domain/brand type (`Email`, `CustomerId`, `Array<Email>`, …) assigned from a raw `unsafe let` value — domain types imply validation. Trust (`unsafe let`/`safe mut`) and sensitivity (`protected`/`redacted`) are independent axes | (documented Phase 9B target) | trust |
| FUNGI-TYPE-004 | InvalidBinaryOperation — operator applied to unsupported operand types: `String + Int`, cross-currency `Money<GBP> + Money<USD>`, `Tri && / ||`, `Tri` as branch condition, `String < String`, undeclared-`Eq` record `==` | (Phase 7B target) | op |
| FUNGI-TYPE-005 | InvalidUnaryOperation — `!` on non-`Bool`, unary `-` on non-numeric, `!Tri` | (Phase 7B target) | op |
| FUNGI-SAFETY-001 | `Tri` used as a truthy/falsy branch condition (must `match` all three of `True`/`False`/`Unknown`) | (referenced alongside TYPE-004) | op |

> Field-read rules (`field-read-rules.md`): explicit `allow read … fields:[…]` allow-lists are safest; `all except […]` is broad/riskier; `all current except […]` snapshots the resolved field set and denies future fields until review; `fields: all` requires stronger review. These are *authoring/report* rules (warnings + field-read report entries), not yet a numbered `FUNGI-*` code in the registry.

---

## 19. Compliance — PII / PHI / PCI / SOX / GDPR (compliance package codes)

> These codes come from the compliance KBs (`comp-gov`, `comp-pkg`). They describe the compliance-package
> layer (`@galerina/compliance-*`, Phase 38/46+). Several are **package-level / planned** rather than core-compiler-enforced today.

| Code (FUNGI-*) | Rule / what it enforces | Enforcement | Source doc |
|---|---|---|---|
| FUNGI-PII-001 | `PII<T>` value reached an unapproved sink (e.g. logger) | PLANNED / package (comp-gov) | comp-gov |
| FUNGI-PII-002 | `PII<T>` stored without an encryption declaration | PLANNED / package | comp-gov |
| FUNGI-PII-003 | `PII<T>` transmitted without a consent check | PLANNED / package | comp-gov |
| FUNGI-PHI-001 | `PHI<T>` value reached an unapproved sink (HIPAA) | PLANNED / package | comp-gov |
| FUNGI-PHI-002 | `PHI<T>` access lacks a declared purpose (HIPAA Minimum-Necessary) | PLANNED / package | comp-gov |
| FUNGI-PCI-001 | PCI cardholder data reached a non-PCI context | PLANNED / package | comp-gov |
| FUNGI-PCI-002 | raw PAN (`PCI<String>`) stored after authorization | PLANNED / package | comp-gov |
| FUNGI-AUDIT-001 | regulated write lacks the `audit.write` effect (SOX/GDPR) | PLANNED / package | comp-gov |
| FUNGI-AUDIT-002 | immutable audit log (`audit.immutable`) cannot be deleted | PLANNED / package | comp-gov |
| FUNGI-CONSENT-001 | personal data processed without a consent check | PLANNED / package | comp-gov |
| FUNGI-RETENTION-001 | retention schedule required for this data type | PLANNED / package | comp-gov |
| FUNGI_HIPAA_001 | PHI without `protected_boundary` (exported by `@galerina/compliance-hipaa`) | PLANNED / package (comp-pkg) | comp-pkg |
| FUNGI_EU_AI_001 | high-risk AI without event logging (EU AI Act Art. 12; `@galerina/compliance-eu-ai-act`) | PLANNED / package | comp-pkg |

**OWASP Top-10 compiler-coverage mapping** (comp-gov): A01 Broken Access Control → capability system / `FUNGI-TENANT-002`; A02 Crypto Failures → compile-time crypto policy; A03 Injection → `Tainted<T>` propagation; A04 Insecure Design → effect/intent graph; A05 Misconfiguration → production-profile gates; A06 Vulnerable Components → `FUNGI-SUPPLY-001`; A07 Auth/Session → `SecureString`/`ProtectedSecret<T>`; A08 Integrity Failures → governance manifests; A09 Logging Failures → `audit.write` + `PII<T>` sink block; A10 SSRF → network allowlist (`network.external`).

**Regulatory mapping** (comp): EU AI Act Art. 12/13, HIPAA §164.312, SOC 2 TSC, SEC 17a-4, ISO 27001, NIST CSF 2.0 — satisfied structurally via GovernanceGraph/ProofGraph/CapabilityGraph/PrivacyGraph/LineageGraph/AuditGraph/CostGraph + `galerina-verify` offline proof CLI. These are architecture mappings, not individual `FUNGI-*` codes.

---

## 20. Process / Testing / CI (no diagnostic codes — discipline rules)

| Rule | What it enforces | Enforcement | Source doc |
|---|---|---|---|
| P-001 / T-005 | run graph + full tests at every phase/Stop boundary (`run-phase-close.mjs`: 13 suites + security audit + graph re-index) | ENFORCED (Stop hook) | gov |
| P-002 | update docs/KB in the same session as any syntax/semantics/architecture change | PRINCIPLE | gov |
| P-003 | DRCM implementation (#30–#44) blocked until primary runtime roadmap completes | PRINCIPLE | gov |
| P-004 / T-004 | Stage B must keep parity with Stage A — R6 corpus (5 flows, 21 cases) is the minimum gate | ENFORCED (CI) | gov |
| P-005 | no Rust in the project except benchmark harnesses | PRINCIPLE | gov |
| T-001 | every `FUNGI-*` code must have a negative test (`tests/negative/`) | PRINCIPLE + PLANNED | gov |
| T-002 | DRCM containment tests must attempt real violations (path traversal, fuel exhaustion, secret injection, V_DPM mutation, manifest tamper) | PLANNED (Phase 7) | gov |
| T-003 | architecture patterns 1–6 must have working compiled examples | PENDING (#46) | gov |
| T-006 | Goal A acceptance: static proof eliminates runtime overhead (≤5% delta) | PLANNED (post-Phase 2) | gov |
| T-007 | Goal B acceptance: single-cycle bitmask trap fires on a revoked capability | PLANNED (post-Phase 5) | gov |
| T-008 | Goal C acceptance: an isolated fault does not crash the supervisor / siblings | PLANNED (post-Phase 5) | gov |
| LC-001 | contract updates are atomic — partial migrations rejected at the admission gate | PLANNED (post-DRCM) | gov |
| LC-003 | `@experimental_profile` blocks graduate by removing the directive + recompiling | PRINCIPLE | gov |

---

## 21. Comment / Annotation Syntax (from the SoT)

| Syntax | Token | Purpose |
|---|---|---|
| `// text` | `comment` | Code documentation — discarded after parse |
| `/// text` | `docComment` | API documentation — extracted by doc tooling |
| `;; text` | `govComment` | Governance annotation — scanned by verifier, stored in `.lmanifest` (`governanceAnnotations[]`) |
| `/* text */` | `comment` | Block comment — discarded after parse |
| `;` (trailing) | `newline` | Optional statement separator — silently collapsed |

---

## 22. Registry-vs-Code Gap Analysis

This snapshot indexes **105** distinct `FUNGI-*` codes from the documentation sources and **459** distinct
`FUNGI-*` codes referenced in `packages-galerina/**/src/**/*.ts`. The two sets diverge substantially — most
notably, a large body of compiler-enforced codes exists **in code but is absent from every KB doc** (the prose
registry covers the governance/DRCM surface thoroughly but lags the lexer/parser/type-checker/config/package
diagnostic surface).

### 22a. Codes found ONLY in code (enforced/referenced in `src`, NOT in any doc source)

These are the real "documentation gaps" — diagnostics live in the implementation but the registry/KB does not
list them. Grouped by family (count shown). Descriptions are NOT transcribed because they are not authored in the
KB; treat the family name as the only verified fact. **The single biggest gap is the `CONFIG`, `LOGIC`, `TYPE-007+`,
`TAINT`, `VAULT`, `FUSE-*`, `PCI-003+`, `MEMORY`, `BORDER`, `PGRAPH`, `PROFILE`, `SYNTAX-00x`, and `LEX` families.**

- **Lexer/Parser:** FUNGI-LEX-001..006; FUNGI-PARSE / -001/-002/-003 / -DEPTH-001; FUNGI-PARSE-DEPTH-001; FUNGI-SYNTAX-001/002/003/005/006/007/008/009/010; FUNGI-SYNTAX-LEGACY-001/002
- **Type system (beyond -003/-004/-005):** FUNGI-TYPE-001, -002, -007..-023, -030, -031
- **Config / profile gates:** FUNGI-CONFIG (+ -001..-027), FUNGI-CONFIG-GOV-001/002/003, FUNGI-PROFILE (+ -001..-007, -005B)
- **Governance (registry lists 001/003/005/010/017/018/019/020 only):** FUNGI-GOV-002, -006..-009, -011..-016, FUNGI-GOV-3VL-001
- **Taint / value-state:** FUNGI-TAINT (+ -001..-006); FUNGI-VALUESTATE (+ -001..-003, -005..-008) *(note: registry text references VALUESTATE-004 but it is not in the code grep)*
- **Secrets/vault extra:** FUNGI-VAULT-001..005; FUNGI-SECRET (bare)
- **Logic / Tri / decision:** FUNGI-LOGIC-001..014; FUNGI-TRI-001..005; FUNGI-DECISION-001..005; FUNGI-MATCH-001; FUNGI-SAFETY-002..006; FUNGI-GOV-3VL-001
- **Primitives:** FUNGI-BYTE-001..005; FUNGI-CHAR-001..004; FUNGI-STRING-001..004; FUNGI-NUMERIC-001, FUNGI-NUMERIC-OP-001, FUNGI-FLOAT-NAN-001
- **Memory safety:** FUNGI-MEMORY-001..008; FUNGI-RAWPTR-001
- **Effects extra:** FUNGI-EFFECT-004, -005; FUNGI-RUNTIME-EFFECT-GATE
- **Supply-chain / package fuse (signing/registry/revocation):** FUNGI-FUSE-* (29 codes incl. -HASH-MISMATCH, -SIG-INVALID, -KEY-REVOKED, -REVOCATION-UNVERIFIABLE, -UNSIGNED, -HYBRID-*, -SET-*); FUNGI-PKG-001..006; FUNGI-SBOM-001 *(SBOM-001 IS documented — listed here only because the FUSE/PKG neighbours are not)*
- **Manifest integrity:** FUNGI-MANIFEST-DEPTH, -DUPLICATE-KEY, -LENGTH-OVERFLOW; FUNGI-WASM-ADMIT; FUNGI-PASSPORT-002; FUNGI-PROV-001
- **Proof/Privacy graphs:** FUNGI-PGRAPH-001..005/010..013/020..023/030; FUNGI-GRAPH-001..006; FUNGI-DAG-001/002
- **Compliance PCI extra (registry/comp lists 001/002 only):** FUNGI-PCI-000, -003..-010
- **Substrate/hardware extra:** FUNGI-SUBSTRATE-002/003/004, -DEADZONE; FUNGI-HW-001..004; FUNGI-COMPUTE-001; FUNGI-HINT-COMPUTE-001; FUNGI-TIER-001; FUNGI-BACKEND-001
- **Borders / boundaries / binding / context:** FUNGI-BORDER-001..005; FUNGI-BOUNDARY; FUNGI-BOOL-BOUNDARY-001..005; FUNGI-BINDING-001..006; FUNGI-CONTEXT-001; FUNGI-BLOCK-001..004
- **Economics extra:** FUNGI-ECON-001/002/003 *(distinct from the documented EC-001/EC-002 codes)*
- **Naming / style / architecture:** FUNGI-NAME-001..003; FUNGI-NAMING-001..005; FUNGI-STYLE-001/002, -SEC-001; FUNGI-ARCH-001/002; FUNGI-INHERIT-001/002
- **Runtime / trap / safety:** FUNGI-RUNTIME-002..007; FUNGI-TRAP-001/002; FUNGI-TIMEOUT
- **Misc / infra:** FUNGI-AFFINE-001; FUNGI-ANTI-ABUSE-001; FUNGI-AUDIT-003; FUNGI-BUILD-001; FUNGI-EVENT-001..005; FUNGI-INTENT-001..005; FUNGI-NET-001/002; FUNGI-OBS-002; FUNGI-OMNI-001..005; FUNGI-PIPELINE-001..005; FUNGI-REPORT-001/005; FUNGI-SEC-014/020/021; FUNGI-SOURCE-ESCAPE-001; FUNGI-STDLIB-001/002; FUNGI-IMPORT-000; FUNGI-GEN-TEST-005
- **Placeholders (not real codes — template/example strings in source):** FUNGI-G, FUNGI-XXX-NNN, FUNGI-SERIES-NNN, FUNGI-PROOF-CERT-00 (truncated literal). These should be ignored.

### 22b. Codes found ONLY in the docs (in a KB source, NOT matched in `src`)

These are documented but not (yet) wired in the scanned `src` — i.e. **planned/spec-only** codes. This is expected
for DRCM-phase and compliance-package codes:

- **DRCM-phase planned:** FUNGI-CAP-002, -003, -004, FUNGI-CAP-CONFUSION; FUNGI-STEP-001, -002; FUNGI-MONO-003; FUNGI-RESOURCE-001; FUNGI-SECRET-FATAL; FUNGI-FG-001
- **Resilience follow-ons:** FUNGI-FAULT-002, -004
- **Lifecycle:** FUNGI-DEP-001 (and the `FUNGI-DEP` family stem)
- **Compliance package layer (Phase 38/46+, package-enforced not core):** FUNGI-PII-001/002/003; FUNGI-PHI-001/002; FUNGI-CONSENT-001; FUNGI-RETENTION-001; FUNGI-AUDIT-001/002; FUNGI-SUPPLY-001; FUNGI-PRIVACY-001
  - *(`FUNGI_HIPAA_001` / `FUNGI_EU_AI_001` from comp-pkg use underscores and live in the compliance packages, not scanned `src`.)*

> **Caveats.** (1) The "only in code" set is computed over `packages-galerina/**/src/**/*.ts` only — tests,
> generated WAT, and non-`packages-galerina` trees were not scanned, so a doc-only code could still be enforced
> elsewhere. (2) Family-stem hits (e.g. bare `FUNGI-GOV`, `FUNGI-FUSE`) are template/prefix constants, not
> distinct diagnostics. (3) `FUNGI-MONO-003` and the `compliance` codes are *intentionally* doc-ahead-of-code
> (planned). The actionable gap is **22a**: a large enforced diagnostic surface (config, logic, type, taint,
> vault, fuse, memory, border, pgraph, primitives) that the prose registry in `galerina-governance-rules.md`
> does not yet enumerate.

---

*End of consolidated snapshot. Authoritative source: `galerina-governance-rules.md`.*
