# App-Framework Build (B1–B6) — outcome 2026-06-21

Owner greenlit the app-framework build (master prompt `MASTER-PROMPT-zero-trust-ecosystem-build.md`,
items B1–B8), full-auto, review at the end. Decisions taken at the start: B1 first; app layout
`App.lln + App.manifest + flows/ deps/ proofs/`; B2 canonical schema = the compiler ontology
(see below). Verify-before-build governed throughout — the master prompt's "BUILD THIS — NEW" list
overlapped heavily with shipped work, so most B-items were verified, not re-derived.

## Outcome per item

| Item | State | Evidence |
|---|---|---|
| **B1 — app-layout scaffolder** | **BUILT** (`2c9a441`) | `logicn new app <dir>` mode added to `scripts/logicn-new.mjs`: emits `App.lln` (governed composition-root) + `App.manifest` (deny-by-default descriptor → folded into the signed `.lmanifest` at build) + `flows/ deps/ proofs/` + README + .gitignore. Verified end-to-end (scaffold → `logicn build App.lln` → signed `build/App.wasm` + Ed25519 `.lmanifest`; `run --invoke main` → 0). +6 tests (`logicn-core-cli`). |
| **B2 — unify the two admission gates** | **BUILT** (`d3b698c`) | Found THREE divergent capability vocabularies (border-check plugin allow-list; compiler `KNOWN_CAPABILITIES` wired to V_DPM bits; runtime fusion registry). Made the **compiler ontology canonical** (owner decision); added `CAPABILITY_ALIASES` + `ADMISSION_CAPABILITIES` + `normalizeCapability`/`isAdmissibleCapability` in `capability-types.ts` (purely additive — no renames, no bit changes, no caps dropped). `border-check` now validates against it (alias-aware); the fusion gate is bound by a kernel drift-check. +9 tests. |
| **B3 — inter-module code-routing linker** | **VERIFIED SHIPPED** | `planComposition`/`fusePackages` (`fuse-loader.ts`): set-signed (one unsigned member refuses the whole set, `LLN-FUSE-SET-UNSIGNED`), acyclic (`LLN-FUSE-SET-CYCLE`), provider-before-consumer ordering, ambiguity/self-provide refusal, deny-by-default over the `capabilityRegistry` hook. Tested in `fuse-compose.test.mjs` (kernel 60/60). |
| **B4 — enforced revocation at admit/fuse** | **VERIFIED SHIPPED** | `logicn fuse` injects `revocationCheck = isKeyRevoked` + `assertRegistryTrustworthy` (fail-closed); fuse-loader Gate 2b refuses a validly-signed-but-revoked key (`LLN-FUSE-KEY-REVOKED`); `governance/revocations.json` carries the real revoked key `8eecf4…`. Tested: `tests/revocation/` (22/22) + `fuse-loader.test.mjs` 5b. The earlier "markdown-only, nothing denies" note is now STALE. |
| **B5 — live package registry/resolver** | **MOSTLY SHIPPED** | `package-resolver.ts` governs `hash` (content-address), `signature` (Ed25519), `registry` (auditable origin), `installScript:"deny"`; LLN-PKG-001..005 (capability-non-expansion, untrusted-registry, provenance, install-deny). Tested in `governed-resolver.test.mjs`. **Genuine NEW residual:** a *signed central registry index* (the "live registry" the memory flagged as new) + wiring **revocation into resolution** (defense-in-depth; resolver doesn't yet check signing-key revocation). |
| **B6 — populate example app + api-server** | **MOSTLY SHIPPED** | `examples/fuse-demo/my-custom-api-rest` (a built, fused, signed example) + `logicn-api-protocol-rest` (the shipped reference REST adapter, e2e). No `logicn-framework-example-app` *package*, but a new TritMesh worked-app conflicts with "TritMesh not active." Residual: a richer worked example if desired. |
| B7 / B8 | **DROPPED / GATED** | B7 (cross-tier BSL contamination lint) DROPPED — BSL reversed, all Apache-2.0. B8 (SPSC ring-buffer) gated on isolation (#102-104). |

## Genuinely-new work BUILT vs verified
- **Built (the real gaps):** B1 scaffolder, B2 admission-vocabulary unification — both with tests, pushed.
- **Verified already shipped (no re-derivation):** B3, B4, and the core of B5 + B6.

## Residual NEW slices (owner to direct)
1. **B5a — signed central registry index** + a verifying resolver entry (hash + signature + revocation BEFORE admission). The one item flagged genuinely-new.
2. **B5b / B4-residual — wire revocation into more gates**: the package resolver (resolution-time defense-in-depth) and `bridge-attest` / `border-check` (per the `revocations.json` hardening note).
3. **B6 — a richer worked example** (within the TritMesh-as-example-only constraint).

## Decisions recorded
- B2 canonical schema = **compiler ontology** (border-check's was the least load-bearing; taking it literally would have broken V_DPM/governance/.lln and dropped `shell.execute`/`native.call`).
- All Apache-2.0; B7 + folder-level BSL dropped.
