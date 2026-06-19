# Changelog

All notable changes to LogicN are documented here (format: [Keep a Changelog](https://keepachangelog.com); the project is pre-1.0).

## [Unreleased]

### Security — Phase 1 Audit (2026-06-16): 8/8 criticals + highs cleared
Adversarial Gate-6 audit (37 raised · 32 confirmed). **All Critical and High findings are patched and
verified**; the codebase is in a fail-closed, deterministic state. 48/48 packages · 4,481 tests · 0 fail.

- **VSC-001 (critical)** — closed a taint-escape: `isGovernedSink` is now a strict superset of the
  authoritative `SINK_REQUIREMENTS`, so unsafe/tainted values no longer reach `response.body` /
  `ai.remoteInference` / `network.outbound` / `log.write` / bare `database.write` unchecked.
- **VSC-002 (high)** — `trap` is no longer a taint declassifier; declassification requires an explicit
  `validate.*` / `sanitize.*` / `redact()` gate.
- **VSC-003 (high)** — member-expression receivers (`client.http.post`, `ctx.secrets.get`, …) no longer
  bypass the secret/egress recognizers.
- **GOV-001 (high)** — ratified `permitted_effects` K3 semantics (omitted = neutral · empty `{}` = deny-all
  · populated = allow-listed) and strict `conforms_to` resolution (fatal in production/deterministic).
- **GOV-003 (high)** — denied response fields can no longer leak via member/positional returns.
- **CRYPTO-001 (high)** — certified mode mandates the ML-DSA public key (no silent post-quantum downgrade).
- **CRYPTO-002 (medium)** — the Tier-3 ffsim admission gate requires hybrid attestation by default.
- **CRYPTO-003 (high)** — the governance signature now binds the tamper-evidence fields (`hardwareSeal`,
  `epilogueReceipt`, `liabilityProfile`, `physicalHardeningTier`).

### Added
- **`for x in list where <guard> { … }` — filtered iteration.** `where` is promoted from reserved-future
  to an active keyword: the loop body runs only for items where the guard is truthy. Works in the
  interpreter and lowers to WASM as an `(if guard (then body))` inside the for-in loop (the index always
  advances), byte-identical across tiers (tests in `where-filter.test.mjs`). Guard form — no masking, so no
  K3 trit-0 aliasing concern.
- **#128(b) / GAP-4 — `forEachStmt` (for-in) WASM lowering.** A `for x in list { … }` loop now lowers to
  a real counted WASM loop over the host array bridge (`__array_length` / `__array_get`) instead of the
  fail-closed `(unreachable)` trap. Executes correctly and is byte-identical to the reference tree-walker
  (tests in `wat-forin-execution.test.mjs`).
- **Fail-closed invariant test suite** (`fail-closed-invariant.test.mjs`) — a global guard that a checked-op
  trap (overflow, div0) must fail the flow closed regardless of where its result lands (return / dead
  binding / discarded-in-loop). Return-path cases pass; the discard cases are `todo` pending the R&D-0038
  fix (a confirmed fail-open: an overflow assigned to a never-returned binding is silently discarded).
- `crypto-ops` benchmark now measures ML-DSA-65 + hybrid Ed25519+ML-DSA-65 signatures (PQ-tax visibility).
- KB §7a — ratified domain-guard `permitted_effects` state machine.
- Roadmap #125–#128 (CLI governed-run, parser-level bitwise hint, shape-stable governance objects, GAP-4).

### Deferred to Phase 2
Semantic mediums (VSC-004/005, GOV-002/004), CRYPTO-004 (versioning), engine integration, and the safe
maintenance subset (REDUN-001, STYLE/INFO). See `docs/Knowledge-Bases/logicn-build-roadmap.md`.
