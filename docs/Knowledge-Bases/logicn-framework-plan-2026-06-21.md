# LogicN application framework — detailed plan (2026-06-21)

Companion to the flowchart (source → signed WASM → admission → Tri-Pipe execution). This is the
architecture, the locked decisions, shipped-vs-build status, and the forward roadmap — including the
binary/hybrid/photonic fault-tolerance dimension (a dedicated re-R&D is in flight; its ranked
hardening plan folds into §6 when it lands).

## 1. What it is
A **zero-trust application framework**: compile-time conventions + a library of signed, governed
packages **fused at declared seams — NOT runtime middleware**. Governance is part of execution, not a
layer around it. The substrate (LogicN language + runtime) is **Binary/Hybrid/Photonic ("Tri-Pipe")
ready**; the framework / admission / crypto surface is **Binary-only by invariant**.

## 2. The stack (L0–L4)
| Layer | What | Status |
|---|---|---|
| **L0 Substrate** | language, compiler, governed tree-walker, WASM emitter | SHIPPED |
| **L1 Engines / Tri-Pipe** | `logicn-tower-citizen` + photonic emulator + `ExecutionRouter` + hardware-tier | SHIPPED |
| **L2 Admission / fusion border** | `fuse-loader.ts` 3 gates + `border-check` + `LinkError` + arena trap | SHIPPED; **vocabulary unified this session (B2)** |
| **L3 Framework conventions** | App-Kernel host + app-layout scaffolder + protocol adapters | scaffolder **BUILT (B1)**; kernel = non-bypassable admission gate |
| **L4 App** | a concrete `my-logicn-app/` (TritMesh = example only) | convention + scaffold |

## 3. Build & distribution
- `logicn build App.lln` → **one signed `build/App.wasm` + signed `.lmanifest`** (CBOR, Ed25519).
  Intra-app flows fuse to one wasm (`module-registry.ts`); cross-package = one signed wasm per
  package, host-linked at the fuse border (`planComposition`).
- **Capability binding lives in the signed `.lmanifest fuse{}` block** — never in `.tmf`.
- App layout (B1 scaffolder): `App.lln + App.manifest + flows/ + deps/ + proofs/`, deny-by-default.
- Distribution: `package-logicn.json` + lock + the **governed resolver** (hash + Ed25519 signature +
  registry origin + `installScript:deny`, LLN-PKG-001..006). `.env` = runtime-only secrets, never
  compiled in (prod = vault/KMS).

## 4. The admission border (security keystone)
Three **fail-closed** gates, deny-by-default:
1. **hash-pin** — `.wasm` sha256 must equal the signed descriptor.
2. **signature + revocation** — valid Ed25519 from a non-revoked key (revocation now enforced at the
   fuse gate **and** the resolver **and** `bridge-attest verify`, this session).
3. **closed capabilities** — a declared cap with no host-import factory refuses to fuse; an
   unresolved import is a link-time `LinkError → CRITICAL_SECURITY_VIOLATION`.

**Unified capability vocabulary (B2 this session):** the compiler ontology (`capability-types.ts`,
bit-wired to V_DPM) is canonical; `border-check` aliases onto it; the fusion gate is drift-guarded —
the two admission gates can no longer diverge.

## 5. Execution & the Tri-Pipe
`ExecutionRouter` routes each eligible compute kernel:
- **Binary** — default + universal fallback (the whole governed/crypto/admission surface).
- **Hybrid** — Binary core + offloaded kernels whose result is **Freivalds-cheap-verified**; net-win
  partitioned.
- **Photonic** — fully-eligible kernels only, **emulated today** (perf projected, not measured).

**Invariant:** crypto · governance · K3 · admission · secrets = **Binary-only**. Hybrid/Photonic must
**fail-safe to Binary**.

## 6. Fault tolerance / stability (re-R&D in flight)
Already shipped (don't re-derive): fail-closed core · arena bound + no `memory.grow` · integer
overflow/division traps that propagate out of bindings · DbC output post-conditions (`ensure result`)
· K3 dead-zone as fail-**safe** (0 = indeterminate → availability, not safety) · NMR closed-form
substrate tolerance · `substrate{}` + `verifySubstrate` · DRCM containment + Wasmtime TCB + fuel ·
fault-injection diagnostic suite · engineering goal C (no system crash).

A dedicated **Tri-Pipe fault-tolerance re-R&D** (multi-agent) is mapping these across all three pipes,
finding stability gaps the Tri-Pipe introduces (e.g. an offload failing without a verified binary
fallback; a photonic drift not failing safe; cross-pipe inconsistency), proposing hardening, and
adversarially verifying it. Its **ranked stability plan + Tri-Pipe fault model** will be appended here.

## 7. Roadmap / next
- **Built this session:** B1 scaffolder · B2 admission unification · revocation into resolver +
  bridge-attest.
- **Verified already shipped:** B3 linker · B4 revocation-at-fuse · B5 resolver core · B6 examples.
- **Net-new to build (owner-directed):** B5a signed central registry index · B6 richer worked example
  · the fault-tolerance hardenings from the in-flight re-R&D.
- **Gated:** DRCM Phase 5 (kernel → `DSS.wasm` on Wasmtime TCB) · untrusted-peer memory isolation
  (#102-104) · B8 SPSC ring-buffer transport.

Locked decisions: all **Apache-2.0** (no BSL) · `kernel.ts` = non-bypassable admission gate (not
middleware) · TritMesh = example name only · Binary-only crypto/governance/admission.
