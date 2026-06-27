# RD-0138..0143 — "Automate the defence" with photonic / tri / Tower-Citizen / Tri-Pipe

**Source.** Owner notes `notes/75-improvments-r-d-1..6.md` (2026-06-27). Six visionary writeups, one per
Security-&-Governance category, each asking the same question: *how can Galerina go one step further and
**automate** the defence using the future-tech stack (Tower-Citizen, Tri-Pipe K3 lanes, Photonic Tri-Logic)?*

**Hub disposition (this doc).** Numbered, ZT-scored, and proven/disproven on absorption per the strict R&D
quality rules ([[feedback-rd-prove-own-maths]], [[feedback-rd-absorb-positive-and-negative]]). The **deep
per-claim proof matrix is handed to the encryption R&D worker** (`_session-bridge/` task) — this doc is the
hub-level verdict + the load-bearing proof. Machine-checkable artifact:
`scripts/rd-0138-0143-photonic-security-suite-proof.mjs` — **8/8 V-claims GREEN, 4 excluded-with-reason.**

> **AZT honesty bar / ZT score (0–10):** how zero-trust-SOUND the proposal is *as written*. The Tower-Citizen +
> K3 halves raise it (fail-closed, mostly shipped); the photonic "0-cycle / optical-crypto" and "Lane-0
> auto-mask-and-continue" framings lower it (crypto-on-core violation / fail-open if taken literally).

## The one pattern, across all six

Every note decomposes into the same three layers with the same verdict:

| Layer | As proposed | Verdict |
|---|---|---|
| **Tower-Citizen** (capability charters, AI cage, package isolation, temporal leasing, attestation chains) | issue a restricted Citizen Charter; the compiler/Tower strips tokens the Citizen lacks | ✅ **RE-DERIVES SHIPPED** — domain-guard policies (static manifest clamping), `capability-types` (V_DPM bitmask), `governAiProposal` (No-Coercion: an AI executes iff `min(core, ai)=ALLOW`), package `boundary-policy --check`, `fuse-loader` admission, `lease.ts` (TTL), revocation registry |
| **Tri-Pipe** ({+1, 0, −1} K3 lanes) | route execution by verdict; **Lane 0 = silently mask/scrub/attenuate and CONTINUE** | ⚠️ **MIXED** — the algebra re-derives `three-valued-governance` (fail-closed `DENY<INDET<ALLOW`); but **"mask-and-continue" is FAIL-OPEN unless a sanctioned declassifier** (proof V2). The sound, shipped form is `partialReturn`/`maskByVerdict` (typed `Masked` sentinel, no value flows) |
| **Photonic Tri-Logic** (optical FHE, 0-cycle phase gates, PUF signatures, phase-interlocked heartbeats, frequency-hopping) | enforce crypto/capability/audit *in the light*, at 0 CPU cycles | ❌ **REFUTE (standard overclaims)** — crypto-on-photonic violates the crypto-on-core invariant (`SPORE-SUBSTRATE-001`, No-Coercion: proof V1); "0 CPU cycles / speed-of-light = free" is `latency≠work` (proof V3). Govern-don't-absorb: photonic = **degrade-only K3 tamper signal UNDER the digital Ed25519+ML-DSA gate**, never the gate |

**Net:** ~⅔ re-derives the shipped Tower-Citizen + K3 architecture; the photonic "automate at 0 cost" claims
refute as the usual overclaims; and the **one genuinely net-new + dangerous idea is "Tri-Pipe Lane 0 =
auto-mask-and-continue"**, which is sound *only* as an explicit, audited declassifier (which Galerina already
ships as `partialReturn`). Each refusal ships paired with a govern-don't-absorb form ([[feedback-rd-refusal-pairs-with-work-with-it]]).

## Per-note verdicts

### RD-0138 — Data Privacy · **ZT 5**
- Tower-Citizen "cage the AI" (strip `pii.read` so a hallucinating agent *physically lacks the vocabulary* to write a breach) → ✅ re-derives `governAiProposal` + domain-guard effect clamping (sound, headline-true).
- Tri-Pipe "Lane 0 auto-masks PII in transit and the app keeps running" → ⚠️ **fail-open unless a declassifier** (V2). Sound form: `partialReturn` / `SPORE-PRIVACY-002` seal-taint at the sink.
- "Photonic optical Homomorphic Encryption, 0-latency unbreakable privacy" → ❌ REFUTE (crypto-on-photonic; FHE is digital-RLWE-OK but never line-rate, **TRACK** per [[logicn-fhe-encrypted-similarity-verdict]]).

### RD-0139 — Supply-Chain · **ZT 6**
- Tower-Citizen "immutable package charters — strip `network.egress` at compile, no malicious update can dial out" → ✅ re-derives `boundary-policy --check` (literally used in this session's build C), `fuse-loader`, capability charters. Net-new adjacent: the owner-authorized **supply-chain attestation core** `@galerina/ext-attestation` ([[logicn-owner-decisions-2026-06-26]]).
- Tri-Pipe "Lane 0 clones + scrubs credentials, hands a sanitized struct to the dependency" → ⚠️ the sound version is `partialReturn`; "hands a value and continues" needs the declassifier asterisk.
- "Photonic WDM dependency audit at 0-latency" → ❌ REFUTE (0-cycle overclaim; WDM = vocabulary). Supply-chain is one of Galerina's strongest areas → ZT 6.

### RD-0140 — Audit / Provenance · **ZT 6**
- Tower-Citizen "genetic data-lineage DAG; a lineage mismatch quarantines the data" → ✅ re-derives the shipped provenance graph / `proof-graph` / W3C-PROV.
- Tri-Pipe "the execution lane IS the audit receipt; Lane 0 emits a Transformation Receipt" → ✅ sound + aligns with append-only audit + `partialReturn` diagnostics.
- "Optical PUF = unforgeable signature; WDM streams immutable logs at speed of light" → ❌ REFUTE — optical state is PAC-learnable, **cannot be a crypto signature** (V1 No-Coercion); govern-don't-absorb = degrade-only tamper signal under the digital signature. The **blind-observability exporter** (Prometheus+OTLP, structure-not-data) is the real, buildable telemetry win ([[logicn-social-ecosystem-cloud-native]]).

### RD-0141 — Capability Control · **ZT 5**
- Tower-Citizen "temporal capability leasing — token self-destructs after 5ms" → ✅ re-derives `lease.ts` (`checkLease`, TTL, R&D 0109 G6) + revocation registry. Live residual: mid-compute revocation ([[logicn-notes-37-38-39-verdict]]).
- Tri-Pipe "Lane 0 attenuation — downsample/redact on the fly, virtualized hardware register" → ⚠️ `partialReturn` declassifier IF audited; else fail-open.
- "Optical phase gates enforce capability at 0 CPU cycles, physically impossible to bypass" → ❌ REFUTE (V1: an optical control-λ can't be the authority — No-Coercion; V3: 0-cycle).

### RD-0142 — Fail-Close Auth · **ZT 4** (lowest)
- Tower-Citizen "decentralized attestation chains; swap to a Quarantined Profile on anomaly" → ✅ re-derives `bridge-attestation` + epoch-attestation + the auth package ([[logicn-auth-package]]).
- Tri-Pipe **"Lane 0 degrade-only: swap real DB records for SYNTHETIC data / caches when the auth server drops, keep running"** → ❌ **the most anti-ZT idea in the batch.** Serving synthetic/cached data on auth failure can mask a breach and is a correctness hazard; it partially *contradicts* the category (fail-CLOSE). Secure default = **fail-closed DENY**, or an explicitly-audited, signed, read-only degraded mode — never silent synthetic substitution. ZT 4.
- "Phase-interlocked optical heartbeat IS the auth gate; data light destructively cancels if auth drops, 0 cycles" → ❌ REFUTE (V1 + V3); govern-don't-absorb = heartbeat is a degrade-only liveness *signal* under the digital auth decision.

### RD-0143 — Two net-new categories · **ZT 5**
- **Zero-Storage Secrets** ("transient phase keys; no static RAM buffer to dump") → ✅ DIGITAL half re-derives the secrets-management R&D (ephemeral `.env` ~85% shipped, secret-zeroing `rd-0055 B2`; net-new = `#110 secrets{}` body-drop, [[logicn-secrets-management-rd-2026-06-23]]). ❌ "photonic wave-keys / secret-as-light-in-flight" = REFUTE (crypto-on-photonic).
- **Polymorphic Obfuscation** ("moving-target JIT re-mapping + frequency-hopping every cycle defeats Ghidra/IDA + timing attacks") → ❌ REFUTE — (a) perf-impossible (V3); (b) **security-by-obscurity is a known-weak control = anti-ZT as a primary defence** (X4). Govern-don't-absorb: the sound substitute is **constant-time traversal** (already a keeper) + the **RD-0130 constant-time lint** + capability fencing — defensive anti-side-channel, not obfuscation.

### RD-0137 — Tarmeties (housekeeping, prior hub assessment) · **ZT 7**
The owner-floated 2nd product (ungoverned/speed sibling; shared `spore-` packages, both `.spore`, CLI
`spore foo`). THEORETICAL, post-Galerina-v1. Overall ZT 7; the one fail-open landmine = **governed-artifact-
run-ungoverned mode confusion** (a `.spore` built under Galerina governance executed by Tarmeties' ungoverned
runtime must be impossible-by-construction, not opt-in). Not yet a buildable spec — recorded for the ledger.

## Honest residuals + handover
- This doc is the hub verdict + the load-bearing proof (V1–V3, 8/8). The **exhaustive per-claim proof matrix
  per note** is dispatched to the encryption R&D worker (`_session-bridge/`), e.g. a named-machine photonic
  envelope (X1) and a digital-RLWE FHE feasibility bench (X2).
- The cross-cutting net-new — **formalize "Tri-Pipe Lane 0" as a typed, audited declassifier rail** (extend
  `partialReturn` to the runtime data plane with a `SPORE-DECLASSIFY-*` obligation so "mask-and-continue" is
  only ever reachable through it) — is a candidate build, **owner-gated** (not started).
- No crypto-on-core was weakened; every photonic claim demoted to degrade-only under the digital gate.
