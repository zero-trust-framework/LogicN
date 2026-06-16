# #201 — Calibration-as-Attestation: the measured half of the tolerance/determinism model

**Lane opened:** 2026-06-15. **Source:** [logicn-external-idea-mining-2026-06-15.md](logicn-external-idea-mining-2026-06-15.md)
(8 vendored repos → ideas #1/#2/#3/#5/#12). **Principle:** *govern, don't absorb* — LogicN
**declares → verifies → records** numeric facts; the bridge computes them. No kernel/noise math in core,
no new crypto (SHA-256 + Ed25519 only).

## The gap this closes

The shipped `DeterminismMode "tolerance"` (FFSM Phase 0) pins *environment hashes* (`pinnedEnvHash`
+ `backendArtifactHash` + a positive `tolerance`, fail-closed all-3-pins) — but the word **"tolerance"
had no enforced numeric witness**. A bridge could *claim* an arbitrarily tight band with nothing measured
behind it, and "how close to ideal was this run" was unrecorded. This lane adds the **measured half**.

## Increment 1 — measured manifest fields (LANDED 2026-06-15)

`@logicn/inference-bridge-contract/src/manifest.ts` — all **optional**, **opt-in**, **hash-preserving**
(a manifest that sets none serializes byte-identically; existing inference/ffsim hashes unaffected — proven
by `contract.test.mjs`). 9/9 contract tests green.

| Field | Idea | Meaning | Fail-closed check |
|---|---|---|---|
| `comparabilityHash?` | #2 | sha256 of the matched comparability set (prompt/template/gen-settings/sample-count/judge) | must be sha256 hex if present |
| `measuredFidelity?` | #12 | 0..1 closeness-to-reference oracle the **bridge supplies** | must be in [0,1] |
| `minFidelity?` | #12 | 0..1 declared **floor** | requires `measuredFidelity` present **and** ≥ floor, else DENY ("floor unproven") |
| `toleranceWitness {redundancyN, epsilonMeasured, stdDev, noiseModelId}` | #3 | binds declared `tolerance` to a measured (N, ε, std) curve + the noise model it was measured under | N≥1, ε>0, std≥0, noiseModelId required; **declared `tolerance` must be ≥ `epsilonMeasured`** |

**Core invariant (idea #3):** *a tolerance backend may NOT claim a tighter band than it measured.*
`tolerance < epsilonMeasured` → DENY. This is what turns `redundancy:N`/`tolerance:ε` from author-asserted
constants into verifiable claims.

Candidate diagnostics (when wired into the compiler/Tower admission path): **LLN-PRECISION-ATTEST** (declared
≠ observed precision), **LLN-PRECISION-FIDELITY** (below floor), **LLN-PRECISION-WITNESS** (claim tighter
than measured).

## Enforcement (VERIFIED 2026-06-16 — already wired, not a gap)

The #201 checks are enforced at the Tower's bridge-admission gate, end-to-end:
`hybrid-engine.ts:265` → `verifyAttestation` (`bridge-attestation.ts:71`, fail-closed) → `validateManifestShape`.
`attestationHash` hashes the `canonNum`-hardened pre-image, so the NaN/Infinity collision is closed.
Proven by `logicn-tower-citizen/tests/bridge-attestation.test.mjs` ("ENFORCES the #201 manifest checks
end-to-end"): a non-finite tolerance, a below-floor `measuredFidelity`, and a tighter-than-measured witness
all DENY at admission. So no "universal enforcement" wiring is needed (an earlier note claiming otherwise
was a grep-truncation false negative).

## Next increments (not yet built)

1. ✅ **#5 — quantization taxonomy (LANDED as `QuantizationMethod`, increment 2).** Verify-before-build
   showed `PrecisionTechnique` is the routing/compute-format enum, consumed by the Tower's **exhaustive**
   `Record<PrecisionTechnique,_>` maps (`TECHNIQUE_SOURCE`/`TECHNIQUE_BITS`) — so widening *it* is wrong
   (breaks the Tower + conflates routing with declaration). Instead added a SEPARATE `QuantizationMethod`
   axis (`none|qat|gptq|awq|marlin|nf4|gguf`) + an optional `quantizationMethod` manifest field, hash-preserving
   via a third monotonic extension tier. **Deferred:** the storage-vs-compute-precision split (needs `int4`/`int8`
   added to the routing enum + both Tower Records updated — a real cross-package change, not done here).
2. **#1 — precision-attestation gate (compiler/Tower side):** read the bridge's exported quant config vs
   tensor headers, enforce `declared == observed` per module, record the coverage table as a signed manifest
   record. Closes the Brawn fail-open (a bridge shipping a layer at the wrong precision / a swapped tokenizer
   passes the naive `packageHash` pin today).
3. **#3/#4 — substrate integration (⚠️ DESIGN DECISION NEEDED — verify-before-build, 2026-06-16):**
   `substrate-inference.ts` *deliberately* holds every flow to a **fixed, conservative `LANE_PROFILE`
   noise floor** "so it cannot be gamed downward to make a tolerance pass" (the author declares the
   *guarantee*; the floor is not author-supplied). Idea #3's `toleranceWitness` is **author-supplied** — i.e.
   the exact gaming vector that design prevents. So binding a witness into `verifySubstrate` is safe ONLY if
   the witness is **ATTESTED** (the signed `toleranceWitness` already on the BridgeManifest) and the flow's
   `substrate{}` lane is connected to that attested bridge — a real cross-surface design decision (flow-contract
   ↔ signed-manifest), **not a clean additive build.** Idea #4's "typed reducer" likewise needs **edge-level
   dataflow analysis** (the current B3/`LLN-SUBSTRATE-004` checks the flow's `redundancy` *declaration*, not
   dataflow edges). Both gated on the owner's call: *do we let an attested witness refine the conservative
   floor, and how is the witness trust-bound to the flow?* The `NoiseModel` descriptor (#8) rides on the same decision.
4. **#2 — comparability enforcement:** promote `comparabilityHash` from "validated if present" to a required
   pin for tolerance mode **with migration** (the ffsim manifest + its tests must add it) — deferred so the
   first increment stays non-breaking.

## Guardrails (from the idea-mining synthesis)

- Do **not** port ModelOpt scale math / SPDNN noise simulators into core — DECLARE + VERIFY + RECORD only.
- `PrecisionTechnique`/`NoiseModel` stay a **closed governance vocabulary**, not a config dump.
- Reuse Ed25519 + SHA-256; no TMX/tree-hash smuggled in via "streaming substrate" framing.
