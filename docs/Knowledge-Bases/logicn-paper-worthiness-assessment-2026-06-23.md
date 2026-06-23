# Paper-Worthiness Assessment — full-corpus refresh (2026-06-23)

## Bottom line

**0 flagship papers. 0 workshop notes. Defensive-publication only.** An independent real-prior-art pass (WebSearch) across all four lanes — measured-negatives, methodology/measurement, formal/system-design, and the 2026-06-23 delta — **confirms** the standing 0-flagship verdict rather than overturning it. Nothing clears the two-arm bar. The correct instrument everywhere remains **defensive-publication + Apache-2.0**; the three load-bearing defensive-pub notes (No-Coercion, crypto-on-core-rejected, K3 governance algebra) are already written in `LogicN-Patens/`.

## The bar (applied strictly)

A finding is **paper-worthy only if BOTH**: (1) it is **genuinely novel** versus the *real, cited* prior art (not "novel inside our brainstorm"), **AND** (2) it carries a **measured result or measured negative**. Either arm alone is insufficient:
- Novel-but-unmeasured → at most defensive-publication.
- Measured-but-re-derives-known → at most defensive-publication (a datapoint that confirms a known law).
- A *retracted/unreliable* measurement → nothing (no defensible number).
- Category-correction / build-sequencing observation with no disproven hypothesis-with-data → nothing.

This is the standing LogicN posture: **no new crypto/science by design**, so the *expected* yield is zero papers and a stack of timestamped defensive-pub notes.

## Per-candidate verdict table

| Finding | Class | Measured? | Novel vs prior art | Verdict | Killer / saver citation |
|---|---|---|---|---|---|
| Benchmark unit-truth discipline (one-shared-unit guard; ~1,900x nbody / 43x pipeline self-correction) | methodology | YES (project telemetry) | No — re-derives | **defensive-pub** | Marr et al., "Are We Fast Yet?" DLS 2016 (10.1145/2989225.2989232) — *kills novelty* |
| Compile-cache ~38x slower (~56ns branchless compile vs ~2150ns SHA-256 key); GateCache left unwired | measured-negative | YES (i9-9900K microbench) | No — re-derives | **defensive-pub** | Zhang & Sanchez, MICRO 2019 (memoization 41% slower for ~19-instr fns) — *kills novelty* |
| R&D 0076 — K3 hard-fail vs soft-fail revocation availability benchmark (27/27, exit 0) | measured-negative | YES (1st-party) | borderline → no | **defensive-pub** | arXiv 2604.05119 (2026): 8.2% measured fail-closed availability hit — *kills the last novel limb* |
| SEC-002 mutation-per-gate (re-introduce the hole; mutate the authoritative layer) | methodology | No (CI gate, no score study) | No — re-derives | **defensive-pub** | DeMillo-Lipton-Sayward 1978 + access-control mutation operators (arXiv 2303.04247) — *kills novelty* |
| Prove-maths methodology (graded PROVEN/SAMPLED/ASSERTED; Z3 i32 translation-validation) | methodology | YES (verification sense) | No — re-derives | **defensive-pub** | Pnueli-Siegel-Singerman, translation validation, TACAS 1998 — *kills novelty* |
| K3 three-valued fail-closed governance algebra (vAnd=min; unknown→DENY; empty→INDET) | formal | No | No — re-derives | **defensive-pub** | Bruns & Huth, "Access control via Belnap logic," ACM TISSEC 14(1) 2011 — *kills novelty* |
| No-Coercion property (e=min(t*,r)≤t*; analog can degrade, never key) | formal | No | No — re-derives | **defensive-pub** | Zdancewic & Myers, "Robust Declassification," CSFW 2001 — *kills novelty* |
| Substrate NMR failure model (closed-form von-Neumann residual; safety-not-availability split) | formal | Modeled, no silicon | No — re-derives | **defensive-pub** | von Neumann, "Probabilistic Logics…," 1956 — *kills novelty* |
| DRCM 3-tier invariant model (invariant{}+DbC ensure+monotonic overlay; loosen=fail-open refuted) | system-design | No | No — re-derives | **defensive-pub** | Meyer, Design by Contract (Eiffel) 1986/1992 + IEC 61508 — *kills novelty* |
| Incoherent-lane = two-valued {0,+1} K3 sub-lattice (intensity optics can't carry DENY) | system-design | No | No — re-derives | **defensive-pub** | Nature Comms 2024 s41467-024-55139-4 (incoherent optics non-negative) — *kills novelty* |
| Photonic/analog state can't be a key or sole auth factor (PUF PAC-learnable + No-Coercion) | reference-only | No | No — re-derives | **defensive-pub** | "Learnability of Optical PUFs…" IEEE T-IFS 2025; Rührmair et al. CCS 2010 — *kills novelty* |
| S1 K3 cert/channel gate (revocation-unknown→DENY via vAnd over a library-validated chain) | system-design | No | No — re-derives | **nothing** | RFC 7633 OCSP Must-Staple (2015) already encodes unknown→reject — *no surviving limb* |
| Cache-structure-not-trust law (never cache the allow/deny ruling; signed content-hash keys) | system-design | No | No — re-derives | **nothing** | NIST SP 800-207 (per-request eval) + Bazel/Nix content-addressing — *no surviving limb* |
| Channel-verdict: mTLS peer-cert as one K3 factor folded fail-closed | system-design | No | No — re-derives | **nothing** | RFC 8705 OAuth 2.0 mTLS client auth — *no surviving limb* |
| Filtered-search-as-deny-by-default (push ACL into the tri-pipe vector kernel) | system-design | No (unbuilt) | No — re-derives | **nothing** | ACORN (arXiv 2403.04871) / HoneyBee / Curator 2024-25 — *no surviving limb* |
| Secret-egress SECRET-002 defense-in-depth (VSC-003 memberExpr bypass fix; taxonomy split) | system-design | No | No — re-derives | **nothing** | Myers Jif/JFlow IFC + taint typing — *bug-fix + hygiene, not a result* |
| #219 audit/coverage/R&D-standards + SEC-002 program (largest gate) | methodology | No (self-described aspirational) | No — synthesis-by-design | **nothing** | StrykerJS/PIT + SLSA/in-toto/Sigstore (self-cited as "grounded, not invented") — *curated checklist* |
| Verify-before-build (~80% of "new" R&D re-derives shipped arch) | methodology | Project-specific yield | No — re-derives | **nothing** | Boehm cost-of-late-rework + spike/POC practice — *standard hygiene* |
| Governed tree-walker "10^3–10^6x slower than native" | measured-negative | RETRACTED (units misread) | No — textbook | **nothing** | OCamli ~2000x folklore + *internal retraction* (logicn-benchmark-snapshot-2026-06-22.md) — *fails both arms* |
| Affine/move-once authority has no consumer (R&D 0087) | reference-only | No (grep finding) | No — re-derives | **nothing** | Walker, "Substructural Type Systems," ATTAPL 2005 — *build-sequencing note* |
| FHE encrypted-similarity never line-rate + wrong threat model | reference-only | Borrowed (cited 3rd-party numbers) | No — re-derives | **nothing** | Ducas-Micciancio FHEW EUROCRYPT 2015 + SoK arXiv:2504.11604 — *explicitly disclaims novelty* |
| Tri-logic (K3) does NOT speed up JSON parsing (category error) | reference-only | None (no parser built) | No — re-derives | **nothing** | simdjson, Langdale & Lemire, VLDB-J 28 (2019) — *no experiment, nothing to defend* |
| Auto-promotion to photonic substrate refused without authorization | system-design | No | No — re-derives | **nothing** | Meech et al. arXiv:2205.08512 (analog photonics non-reproducible) + effect-system PL principles — *policy, not result* |

## Strongest candidate + the gap

**Benchmark unit-truth discipline.** It is the only candidate whose measured arm is real *and* striking (nbody ~1,900x and collection-pipeline 43x self-corrections, now code-enforced). It dies on the **novelty arm**: the method *is* Marr et al. "Are We Fast Yet?" (DLS 2016) + Mytkowicz (ASPLOS 2009) + Kalibera-Jones (ISMM 2013), and the numbers are LogicN's own telemetry self-audit, not a generalizable result.

**What is missing to clear even a workshop bar:** a *novel, generalizable, controlled* delta beyond a known-discipline instance — concretely, (a) show that "diagnostic-tier-as-winner" (a warm LRU passive tier presented as a compute win) is a **distinct bias class not covered** by the cross-language-benchmarking literature, with a **prevalence study across multiple third-party suites/runtimes**, and (b) quantify how often the inner-op-vs-whole-call unit mismatch **silently inverts published** cross-language results outside LogicN. Absent that, it stays a defensive-publication.

## What to actually do

1. **Publish nothing as a paper.** The 0-flagship strategy is correct and now triple-confirmed.
2. **File / refresh defensive-publication notes** (see list) so the negative record is timestamped and citable, each with its real prior-art citation inline. Most already exist in `LogicN-Patens/`; add the compile-cache ~38x datapoint and the benchmark unit-truth self-correction as new dated notes.
3. **Do NOT publish the governed-tree-walker slowdown in any form** until the unit-normalization fix lands and a defensible single LogicN-vs-native ×slower number exists — the current headline is internally retracted and the harness is flagged unreliable in both directions.
4. **Keep R&D 0076** as a re-runnable defensive-pub datapoint, *not* a workshop submission — arXiv 2604.05119 (2026) now reports the same measured fail-closed-availability framing.
5. **Cite the RFCs/standards inline** for the cert-gate, mTLS-factor, and Must-Staple work (RFC 7633/7469/5705/8471/8705; NIST SP 800-207); they are implementation docs, not contributions.
6. Treat the #219 standards program and SEC-002 as **adoption checklists of others' published methods** — exactly how the source doc frames them — not as research output.

## Defensive-publication items (the negative record, citable — NOT papers)
- Compile-cache net-negative datapoint: caching the ai{} governance policy is ~38x slower than recompiling (~56ns branchless compilePolicy at hybrid-engine.ts:317-321 vs ~2150ns canonicalize+SHA-256 cache key, i9-9900K) — therefore GateCache (#194) is deliberately left unwired; confirms Zhang & Sanchez MICRO 2019 (memoization net-negative for sub-100ns functions). Timestamped first-party number.
- Benchmark unit-truth self-correction: governance-instrumented-interpreter-vs-native comparisons silently invert (nbody false 'LogicN beats Node 62.7K/s' was actually Node ~1,900x faster once normalized to force-evals/s; collection-pipeline false 43x win was an elements/sec-vs-whole-pipeline-pass unit bug), now code-enforced via assertBenchmarkUnits + compare.mjs §1.5/§1.6 (PROD_POOL excludes warm diagnostic tiers; comparable:false for non-unit-aligned workloads; mul-adds/s size-invariant unit). Instance of Marr et al. DLS 2016 discipline.
- R&D 0076 measured negative: first-party re-runnable benchmark (27/27, exit 0) of the cert-gate K3 hard-fail vs soft-fail availability / false-deny-vs-MITM-exposure tradeoff over a cited OCSP/CRL outage range with seeded Monte-Carlo and a LogicN-vs-baseline column. Keep as a citable datapoint, not a submission; near-contemporaneous prior art (arXiv 2604.05119, 8.2% fail-closed availability hit) reports the same framing.
- K3 three-valued fail-closed governance algebra (vAnd=min-trit; unknown(0)→DENY by the algebra not a flag; empty-clause→INDETERMINATE deny-by-default) as the LogicN boundary verdict lattice — application of Kleene-1952 / Belnap-1977 / Bruns-Huth-2011; already filed as note-01 in LogicN-Patens/.
- No-Coercion property: degrade-only side-signal fold e=min(t*,r)≤t* means an untrusted/analog/photonic reading can lower but never raise a verdict ('a signal can contribute without becoming a key') — application of robust-declassification lattice-meet monotonicity (Zdancewic-Myers CSFW 2001) + macaroon attenuation (Birgisson NDSS 2014); already filed as note-01.
- Crypto-on-core rejected path: photonic/analog substrate state cannot be a cryptographic key or sole auth factor — noisy linear-optical PUFs are poly-time PAC-learnable (IEEE T-IFS 2025; Rührmair CCS 2010) so the unspoofable-optical-identity premise is false; photonic state demoted to a degrade-only K3 tamper signal under a digital Ed25519+ML-DSA-65 signature; already filed as note-03.
- Substrate NMR failure model: closed-form von-Neumann N-modular-redundancy residual error with dead-lane→erasure-to-0 and the safety-not-availability separation (substrate noise denies a legit ALLOW, never manufactures an illegit ALLOW), cross-validated by a deterministic seeded Monte-Carlo — conservative fail-closed spec for a not-yet-existent photonic/ternary backend (von Neumann 1956).
- DRCM 3-tier invariant model (invariant{} static-proof + DbC ensure post-conditions + monotonic-tighten-only emergency overlay; loosen-on-low-risk refuted as fail-open) — composition of Meyer DbC + runtime enforcement + IEC-61508 fail-safe graceful degradation; records the monotonicity discipline catch.
- Incoherent-lane typing constraint: an intensity/incoherent photonic lane is non-negative and therefore a two-valued {0,+1} K3 sub-lattice that structurally cannot carry the DENY (-1) trit; only sign-carrying coherent/phase lanes may carry a full K3 verdict — K3-vocabulary re-expression of the known non-negative-incoherent-optics constraint (Nature Comms 2024 s41467-024-55139-4).

> Workflow w4zqo3nu8 (2026-06-23, full-corpus pass, 4 lanes + skeptic judge, real prior-art search). Supersedes the 0065-0070-scoped 2026-06-22 assessment. PENDING EXTENSION: 0091 + the TritMesh/3D + coverage-audit R&D (owner ask 2026-06-23) — assess those for paper-worthiness when they land.
