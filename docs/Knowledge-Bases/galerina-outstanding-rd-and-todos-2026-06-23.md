# Galerina — Outstanding R&D + To-Dos catalog (2026-06-23)

Single source-of-truth for everything outstanding this cycle. Owner ask: *"anything not fully R&D, even a small
detail, send to R&D (multiple jobs); make sure it's correctly logged in R&D / todos / KB / docs; make sure missing
& incomplete packages are on the todo and/or R&D."* Status keys: **📤 dispatched** (R&D bridge task filed) · **🧪
designed** (design exists in KB, build pending) · **🔨 build** (engineering, no R&D needed) · **📋 todo** (logged,
unscheduled).

> **Rebuilt roadmap (SECURITY-FIRST): [galerina-roadmap-2026-06-23.md](galerina-roadmap-2026-06-23.md)** — fix security
> issues first; missing/stub packages are *consider-not-always*.
>
> **Landed since this catalog was first written (2026-06-23 cont.):** ✅ S1 cert-gate · ✅ sentinel-egress flaky fix ·
> ✅ graph-coverage fix (+28 pkgs) · ✅ 6 architecture diagrams · ✅ architecture + compiler-intelligence R&D
> (designs) · ✅ `contract.permissions{}` design · ✅ R&D results log + 95-row ledger · ✅ **3 dev tools**
> (status/rd-absorb/stray-docs, wired into the Stop cadence) · ✅ **api-server HTTP transport** (serves end-to-end,
> fail-closed, 5/5 e2e + adversarially reviewed). Live status: `node scripts/status.mjs`.

## A. R&D dispatched to the bridge (`C:\wwwprojects\Galerina-R-AND-D\_session-bridge\tasks\`)
| Task | Topic | Status |
|---|---|---|
| 0078 | OCSP staple-caching for the S1 `revocation_fresh` sub-verdict (availability vs Zero-Trust) | 📤 |
| 0079 | Is the application-framework structure best-possible for AI comprehension? | 📤 |
| 0080 | `contract{}` memory-cleanup / arena-reuse directive (zero-on-exit secrets) | 📤 |
| **0081** | Per-component photonic/tri gap verdicts (parser, tiered-runtime, resilience, test-gen, effect-checker, interpreter, WASM-P9, PQ/HW, .tmf, symbol-resolver, parity) | 📤 |
| **0082** | 16-packages photonic/tri verdicts + **missing/incomplete/stub package status** | 📤 |
| **0083** | Closed-capabilities photonic/tri variant (or confirm n/a) | 📤 |
| **0084** | Security standards × K3 three-valued — **PCI/DSS + full OWASP (Top10/ASVS/API/LLM) + CWE/NIST/MITRE/SLSA** (unknown→INDETERMINATE fail-closed) | 📤 |
| **0085** | **RAG-vulnerabilities rulebook-curator** (`E:\projects\RAG-vulnerabilities`) → reconcile `GALERINA_SECURITY_RULEBOOK` with the FUNGI registry + RAG/LLM-retrieval threat class | 📤 |

## B. R&D designed (in KB; build pending) — [galerina-architecture-rd-2026-06-23.md](galerina-architecture-rd-2026-06-23.md)
| Item | Where | Status |
|---|---|---|
| `contract.permissions { hardware.camera }` device-permission clause (V_PERM + FUNGI-PERM-001..006) | [galerina-contract-permissions-design.md](galerina-contract-permissions-design.md) | 🧪 |
| DRCM degrade-only photonic-confidence operand (keep V_DPM Binary) | arch-rd #13 | 🧪 |
| CBOR `.lmanifest` SubstrateAttestation tag (Tag 418) | arch-rd #7 | 🧪 |
| core-economics photonic ExecutionTarget + degrade-only cost axis (brake-only) | arch-rd #14 | 🧪 |
| core-security photonic-lane taint/egress rule | arch-rd #15 | 🧪 |
| Standardise `withSideSignal`/`vAnd` as the ONLY photonic/sentinel→verdict channel | arch-rd #6 | 🧪 |
| Per-package Tri-Pipe coverage as machine-checkable metadata | arch-rd #16 | 🧪 |
| **Compiler Intelligence (Doc 005)** — §2 Governance DCE pass (`FUNGI-GDCE-001`) · §3a `substrate{photonic}` envelope keyword · §3b value-level substrate-taint · §4 auto-resilience AST→GIR wrap | [compiler-intelligence](galerina-compiler-intelligence-deterministic-foresight.md) (wf `w2gzcbx9d`) | 🧪 design-complete → build |

### 2026-06-27 — net-new ADOPTABLES from the "automate the defence" R&D (RD-0137..0153)

The three batches (RD-0138..0143 + RD-0144..0149 + RD-0151..0153, notes `75-improvments-r-d-1..15`) mostly
re-derived shipped architecture or refuted photonic overclaims; these are the **genuinely net-new, sound items
we will adopt** (design-only, **owner-gated** — ask before building). Proven: `scripts/rd-0138-0143-...-proof.mjs`
(8/8) + `rd-0144-0149-...-proof.mjs` (6/6) + `rd-0151-0153-...-proof.mjs` (6/6). KB:
[photonic-security](galerina-rd-0138-0143-photonic-security-automation.md) ·
[governed-chaos](galerina-rd-0144-0149-governed-chaos-multisubstrate.md) ·
[assimilation-ambiguity-neural](galerina-rd-0151-0153-assimilation-ambiguity-neural.md) ·
[graph-as-data-spine (RD-0150)](galerina-rd-0150-graph-as-data-io-border-concept.md).

| Item | What / why | Status |
|---|---|---|
| **RD-0150 — graph as the data spine (API/DB I/O)** | ZT 7. HYBRID property-graph: graph SPINE (reachability/capability/K3-verdict/provenance — "no edge = no reach", IDOR structurally closed) + columnar/SoA PAYLOAD (bulk scans). Win security+org, mixed speed. **Next step: prototype the SPINE against a columnar payload behind a RED/perf harness**; carry the 0037 separate-presence-channel discipline + a mandatory traversal-budget gate (CWE-400); do NOT claim crypto-sharding or any perf number until benchmarked. Hardest open = cross-tenant edge crypto custody. | 🧪 design → prototype, **owner-gated** |
| **Lane-0 declassifier rail** (`FUNGI-DECLASSIFY-*`) | The cross-cutting net-new: formalize "Tri-Pipe Lane 0 = mask-and-continue" as a typed, signed, AUDITED declassifier over the shipped `partialReturn`/`maskByVerdict`, so mask-and-continue is reachable ONLY through it (never a silent safety bypass). Sound form of every note's Lane-0 idea. | 🧪 design → build, **owner-gated** |
| **Shadow/canary AI-proposal deploy** | RD-0149 lead: fork live traffic to an AI proposal SAFELY = the note-54 data-plane border (shipped this session, `tower-citizen/data-plane-border.ts`) + attenuated capability tokens + Freivalds verify + the Lane-0 declassifier rail. Proven (V3) it must sit behind the border or it leaks. | 🧪 design → build, **owner-gated** |
| **Hardware Citizen attestation** (RD-0151) | Attest a hot-plugged substrate (accelerator/FPGA/quantum/neuromorphic) before it gets a capability charter. Re-derives bridge-attestation, extended to dynamic HW. | 🔒 design, **HW-gated** (DRCM Ph5 / #102-106) |
| **Model Weight Charter + anti-poisoning invariant** (RD-0153) | Signed charter over a model's weights so a capability-adding weight drift is denied (No-Coercion at the tensor admission boundary). The sound in-core half of "governed AI"; activation-clamping stays in the ext-bridge. | 🧪 design → build, **owner-gated** |
| Thread force-HTTPS / egress policy through `StdlibContext`→interpreter→cli | Today it's an env knob + core-config `resolveEgressTls` SoT; full threading makes it per-route/per-config + auditable. | 📋 todo |
| Structured/tamper-evident egress **audit sink** (`AuditLogger` via `StdlibContext`) | The shipped allow-list audit (`2aed510`, `stdlib.ts:1261 auditAllowlistedEgress`) is **stderr-only, best-effort, deduped first-use-per-host** — good observability, NOT a tamper-evident log. Thread an `AuditLogger` through `StdlibContext` (same effort as the egress-policy threading above) so allow-list bypass admissions reach a real sink. R&D-verified tier-2 (gap-A UPDATE 4); per-flow egress = the row above. | 📋 todo, **owner-gated** |
| Delete duplicate note `75-improvments-r-d-11` | Byte-identical to note 10 (RD-0148 = dup of RD-0147). | 📋 todo (owner) |

## C. Build items (engineering — no further R&D needed)
| # | Item | Source | Status |
|---|---|---|---|
| 1 | **Wire S1 cert-gate into `kernel.ts:307`** (closes the audit's only HIGH; both audit + R&D rank #1) | audit + arch-rd #1 | 🔨 |
| 2 | **Fix the 2 WAT codegen fail-opens (#163 record-update → silent `i32.const 0`, #165 float)** — **VERIFIED REAL** 2026-06-23 (techdebt review:54-73; these are the #161-191 set, distinct from the #128 set the Phase-4 audit called "hardened" — both true). Fix-forward = emit `unreachable` (fail-closed) or lower properly; check WASM-parity test impact first | arch-rd #3 | 🔨 |
| 3 | Tainted-by-default at posture-gated entry boundaries (the 34B `value-state-checker.ts:1162-1191` hole) | audit + arch-rd #4 | 🔨 |
| 4 | Auto-discover `packages-galerina/*` as the project-graph manifest (kill the drift this session fixed by hand) | this session + arch-rd #5 | 🔨 |
| 5 | Expand the SEC-002 mutant catalog (3 B5a → one per shipped fail-closed gate; incl. cert-gate's 5 in-test guards) | audit + arch-rd #9 | 🔨 |
| 6 | De-color the tree-walker · 0014 fidelity harness · ML-DSA-65 #34 · hostile-host I/O contract (XL, #102-106) | arch-rd #8/#11/#12/last | 🔨 |
| 7 | #149 CI secret-scan + re-sign legacy old-key artifacts | audit (devsecops) | 🔨 |
| 8 | Adopt tower-citizen K3 `decideAtBoundary` as the universal admission collapse | arch-rd #2 | 🔨 |

## D. Missing / incomplete packages (todo + R&D 0082)
- `galerina-framework-api-server` → ✅ **BUILT** (real Node HTTP transport over the kernel; serves end-to-end, fail-closed, 5/5 e2e). `galerina-framework-example-app` still README+TODO → 🔨 build a real runnable example on the framework (NEAR).
- **Planned stubs in `galerina.workspace.json`** (README+package.json, not test-bearing): `galerina-data*` family, `galerina-web*` family, `galerina-db-*` adapters, `galerina-target-{js,wasm,native,gpu}` → 📋 classify (build vs stay-stub) per R&D 0082.
- **Photonic/tri verdict for each** → R&D 0082 (most target-* are software-tier n/a; real photonic target = `galerina-target-photonic`).

## E. Carried doc/tooling work (Phase 3 / earlier batch)
- `docs/contracts` correctness gate: add `assuming{}` doc, `permissions{}` (boot/task) doc, reconcile vs the clause-reference. 📋
- notes/ → KB refactor (copy KB-worthy content out, strip `/notes` refs from README). 📋
- ✅ **DONE** — stray `*.md` tracker shipped as `scripts/audit-stray-docs.mjs` (outside-/docs + duplicate basenames + kb-graph orphans/broken-links; `--summary` wired into the Stop hook).
- Benchmark rebuild: winner-ordered tables · min-token devtool · accuracy · **add "1 Billion Nested Loop Iterations"** · confirm correct file. 📋
- Audit hygiene: 10 stale `build/egress-test-*` ledgers committed; leftover `_scratch-effect006.mjs`; `.gitignore` `egress-it-*` doesn't match `egress-test-*`. 🔨

## F. Audit posture (Phase 4, workflow `wj6vrjkmg`)
No critical/exploitable issues; **no regressions this cycle**. One **HIGH** (pre-existing): `kernel.ts:307` presence-only
auth (cert-gate unwired) → closed by C#1. Full detail: task output `wj6vrjkmg.output`.

> Pointers: bridge `_session-bridge/tasks/0081-0085` · [architecture R&D](galerina-architecture-rd-2026-06-23.md) ·
> [permissions design](galerina-contract-permissions-design.md) · [2026-06-23 roadmap+%audit](galerina-roadmap-and-percent-audit-2026-06-23.md) · ledger §10.

## 2026-06-28 — shipped + new R&D (mesh-database batch · PCI tool · rules export)

**Shipped this session (origin/main):**
- ✅ **Egress allow-list AUDIT + operator SSRF warning** (`2aed510`) — discharges the worker's gap-A suggestion
  (audit-log of admitted hosts + operator-doc warning) for `GALERINA_EGRESS_ALLOWED_HOSTS`. Full suite 60/60 · 5,948.
- ✅ **Memory index cleaned** (0 dangling / 0 orphan); dup note `75-improvments-r-d-11` deleted (clears the 📋 above).
- ✅ **R&D RD-0154..0167 absorbed** — TritMesh/`.fungi` mesh-database, 8 notes → 14 branches, all proven. KB:
  [tritmesh-mesh-database](galerina-rd-0154-0167-tritmesh-mesh-database.md) + results-log rows.

**Net-new owner-gated build leads (from RD-0154..0167):**
| Item | What / why | Status |
|---|---|---|
| **Graph as a SIGNED primary index in `.fungi`** (RD-0167) | In-passport adjacency index that speeds I/O — proven: UNSIGNED = silent read-redirection vuln, so signing is mandatory. Prototype behind a RED/perf harness; overlaps RD-0150. Defensive-pub worthy. | 🧪 design → prototype, **owner-gated** |
| **Cross-language ternary PRE-FILTER lib** (RD-0163, note-04 ask) | New repo under `C:\wwwprojects` (php/node/c++/c#/java/ts) exposing the bit-packed SIMD dot-product as a deny-only PERF gate **in front of** real crypto. NOT a security boundary — ship with the forgery caveat. | 🧪 design → build, **owner-gated** |
| **Zero-copy data plane** (RD-0161/0162) | NVMe-DMA + io_uring + stream-backpressure for the egress path. The engineering is the win (not "O(1)"). | 📋 todo |
| **TritMesh deployment taxonomy** | Core / Symbiotic / Wavefront naming + decoupled/headless `.fungi`-stream-back architecture. | 📋 todo |

**New R&D / tooling:**
- 🧪 **RD-0168 — graph-driven PCI/DSS + security compliance scanner** (owner ask) — extends `galerina-devtools-pci`
  with graph reachability (PAN/secret → egress/log sinks lacking an encrypt/redact/audit edge → fail-closed; K3
  unknown→INDETERMINATE). PoC `scripts/rd-0168-graph-pci-compliance-scanner-proof.mjs`.
- ⚠️ **Rules-registry reconciliation (HIGH-VALUE finding):** the consolidated
  [rules-master-registry](galerina-rules-master-registry.md) found **~350 `FUNGI-*` codes ENFORCED in `src` but
  ABSENT from any rules doc** (CONFIG/LOGIC/TYPE/TAINT/VAULT/VALUESTATE/FUSE/PKG/PCI/MEMORY/… families). The
  governance-rules registry is materially incomplete vs what the compiler actually enforces — worth a reconcile pass.
- 📋 Rules exported to markdown: [governance rules](galerina-rules-master-registry.md) + [R&D rules](galerina-rnd-rules-and-standards.md).

## 2026-06-28 (cont.) — dev-tooling housekeeping

- ✅ **fuse-rebuild fix** (`c8343cd`): `scripts/rebuild-fusable-packages.mjs` now SKIPS packages with no `.fungi`
  source — an ext-bridge with a `.ts` entry (e.g. `galerina-ext-bridge-quantum`) carries a `package.fungi.json`
  descriptor but is not a fusable `.fungi` module, so handing it to `galerina build` failed with FUNGI-PARSE-001
  ("Unexpected token }"). Reports "N skipped" instead of a false failure.
- ✅ **Memory dangling `[[links]]` trimmed** 28→0 (2 real renames fixed: `parallel-worker-cadence`→
  `feedback-parallel-worker-cadence`, `logicn-contract-authoring-guide`→`project-logicn-contract-authoring`;
  26 dead forward-refs de-linked, text kept). memory-graph now 0 dangling / 0 orphan / 0 dangling-links.
- ✅ **New dev tool `scripts/audit-syntax.mjs`** (`ed3d919`, error→tooling rule) — scans ALL `.fungi` (shipped
  `parseProgram`) + `.ts` (TS parse-diagnostics) for parse / bad-syntax errors ("Unexpected token }" and kin)
  IN-PROCESS, no `galerina build`; `--summary` / `--json` / `--all`. Heartbeat baseline = **1** real finding; `--all`
  = 28 (per-package example / `tests/` fixture / `docs/examples` draft corpora excluded by default). **NOT auto-wired
  into the Stop cadence** — the auto-mode classifier gated adding an unrequested executable hook; wire on owner GO.
- ⚠️ **Real finding (audit-syntax) — `packages-galerina/galerina-core-security/src/interim.fungi`** fails to parse
  (7× FUNGI-PARSE-001: anonymous record literals at top level + `target` as a reserved-word parameter). WIP/draft in
  `src/`; fix it or move it out of the build path.
- 📋 **Rebrand cruft:** **5** stale `package.fungi-.json` files (pre-rebrand), each byte-identical to its
  `package.fungi.json` sibling (api-protocol-rest · ext-bridge-quantum · app-kernel compose fixtures ×2 ·
  example-app/greeting) — safe `git rm` once confirmed nothing reads `.fungi-`; owner-gated `.fungi-`→`.fungi` cleanup.
- ⚠️ **Hook tree-churn (FYI):** the project Stop hooks (`rebuild-fusable-packages` + `lint-fungi`/phase-close)
  regenerate `dist/` and add `//fungi: IMPACT/COMPLEXITY` metadata to example `src/index.fungi` on every Stop, so
  the working tree re-dirties by design. The regenerated `.lmanifest` (1270→5632 B = a signing/format change) is
  NOT auto-committed — needs an owner call given the offline-key / re-sign-owed posture.
