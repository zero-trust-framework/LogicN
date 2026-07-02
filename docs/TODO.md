# TODO

Living task list. Authoritative forward view: `../ZTF-Knowledge-Bases/galerina-roadmap.md`.
% audit: `../ZTF-Knowledge-Bases/galerina-percent-audit-roadmap-2026-07-02.md` (**~90% shippable / ~64% full-vision**).
Consistency rules + gates: `docs/CONSISTENCY_GATES.md`.

**State (2026-07-02, verified by running):** 60/60 packages · 5,914 tests · 0 fail · phase-close ALL green ·
`audit-effect-canonicality --strict` 0 findings · `governance:diff` NEUTRAL · border 93/0. `main` **ahead 5, NOT pushed**.

## ✅ Done — 2026-07-01/02 (local, unpushed)
- [x] governance:diff fixture noise — gitignored `build/*.fungi` no longer phantom "added" — `941ec41`
- [x] **CG-7** annotation→re-fuse→unsigned cascade closed (both ends + detector) — `4190287`
- [x] **Declared-effect hardening** — `telemetry.read` canonical (bit 14) · `ai.infer`→alias · `eval.execute`
      DENY-ONLY (`FUNGI-EFFECT-006`, every profile) · Stage-B reconciled (C9 cleared) · C10 — `6bb63a1`
- [x] **CG-4 at the bundled CLI** — lenient build no longer mints a signed manifest for a production-violating
      artifact (was proven still hybrid-signing `effects{totally.fake.effect}`) — `2491de9`
- [x] **CG-6 corpus gate** — teaching corpus may declare only production-compilable effect names — `eb525e5`
- [x] **% audit + roadmap refresh (2026-07-02)** — 6-subsystem fleet audit + critic; new percent-audit doc,
      hub roadmap, runtime SOT banner; **fixed the anti-drift registry's own drift** in `docs/CONSISTENCY_GATES.md`
      (C9 reconciliation + V_DPM bits 20–23 were shipped but still listed pending).
- [x] **NUL-byte fix (owner-approved 2026-07-02)** — raw `0x00` in `kernel.ts` (admission kernel) +
      `inference-bridge-contract/src/manifest.ts` replaced with the byte-identical `\0` escape; both files
      are plain greppable text again; `source-hygiene-no-nul.test.mjs` allowlist now **EMPTY** (zero-tolerance).
- [x] **CG-7 third end (owner-approved 2026-07-02)** — direct `galerina build --package <pkg>` refuses when the
      manifest is **git-tracked** real-signed (committed ceremony fixture: greeting, fuse-demo, 2 compose
      fixtures) unless `--force`; untracked dev-signed manifests (api-protocol-rest's own tests) build freely;
      not-a-repo → protect. `rebuild-fusable-packages --force` forwards to the child. +2 regression tests.

## 🔲 Owner decisions (answered 2026-07-02 / still open)
- [x] ~~Domain-effect namespaces~~ — **DECIDED: keep-interim.** Aerospace allowlist stands WARN-level; any NEW
      invented name still blocks; posture A stays buildable later behind an explicit GO (verdict + N1–N4 proof
      recorded in the KB note).
- [ ] **Push** the local commits to `origin/main` — **owner chose HOLD (2026-07-02)**; stays local until an
      explicit push OK. Until pushed, remote CI is blind to CG-4/CG-6/CG-7.
- [ ] Offline re-sign ceremony owed: `greeting.lmanifest` (old-brand `lln.manifest.v1` schema).

## 🔲 NOW (buildable, no hard blocker; value-ordered)
- [ ] **Numeric doc-drift sweep** — stale comments say "64-bit not yet emitted" while the gate set is empty:
      `value-state-checker.ts:2166`, `u64-arith.ts:25`, `numeric-lowering.ts:26`, `cli-numeric-gate.test.mjs`
      header. Then extend `audit-doc-drift`/`diagnostic-doc-drift` to catch the "gated/not-yet-emitted" phrase
      class (error→tooling rule) so it can't recur.
- [ ] **`FUNGI-LIMIT-001`** — implement the `enforced_limits{}` ceiling check (`governance-verifier.ts:2694-2699`
      emits no diagnostic today; a declared-but-unenforced governance surface).
- [ ] **B5a signed registry index** — module is real + fail-closed *when injected* (`fuse-loader.ts:694/951`),
      but no signed index is distributed and nothing wires it by default. Make default-on or ship an index.
- [ ] Drive the `lint:conventions` umbrella (270 report-only findings) to 0, then drop `--soft`.

## ⏸ PAUSED by owner (2026-07-01) — `.gate` / `.graph`
- [ ] Do NOT build to a `.gate` compiler. Owner still finalizing the model (`.gate` = light-ASCII AI-authoring
      surface; `.graph` = ASCII Topology ONLY; runtime pure `.fungi`; one IR; deny-only signed-capability
      admission). R&D continues in-KB behind two open gates: **RD-0232b** (7 adversarial blockers → SPEC v0.2
      gated), **RD-0232c** (ZT-1: hand-copied `sens_class` registry drifted from prod `type-registry.ts` — must
      be machine-sourced; 7-tenet scorecard open). `.graph` A/B fair re-run is paused-coupled.
      Record: `.claude` memory `galerina-gate-graph-owner-revision-2026-07-01`; KB results-log RD-0232/b/c.

## 🔲 NEXT / carried forward
- [ ] App-kernel posture default (`kernel.ts:245` = `"off"`) — decide production-adaptive `"auto"` default.
- [ ] **web-* lead pair** (`galerina-web-render` + `galerina-web-state`) — largest shippable-scope gap.
- [ ] **Full-suite CI** (#155 npm workspaces) — get the crypto/border phase-close gates off local-only.
- [ ] Self-hosting: extend byte-parity tokenize → parser.
- [ ] Post-P9: DSS.wasm (#102–106); enhancements (#146, #156/#157 start, #158); CI secret-scan residual (#149).
- [ ] Hygiene: 2 untracked `RESUME-2026-07-01-continue*.md` at repo root; LICENSE copyright fill uncommitted.
