# Dev-Tools for Production — map + prioritized proposal (2026-06-24)

> **Scope.** Tooling that helps developers (a) **build governed apps on the App Kernel** (the *framework*)
> and (b) **author / publish / admit third-party extensions** (the *extended framework*). This is the
> "look into dev tools for production" deliverable. All findings verified against source in
> `C:/wwwprojects/LogicN` on 2026-06-24. **Honest labels: [SHIPPED] / [IN-FLIGHT] / [ABSENT] / [DESIGN].**

---

## 0. Headline — verify-before-build correction

A survey pass proposed `logicn new plugin` as the #1 "lowest-risk, highest-value, missing" build. **That is
wrong, and verify-before-build caught it:** the scaffolder `scripts/logicn-new.mjs` **already has a `package`
mode** (the default), and it already emits the deny-by-default four-artifact skeleton the authoring guide §3
describes:

- `package.lln.json` with `"capabilities": []` (deny-by-default, least-capability),
- `src/index.lln` — a `pure flow` with **no `effects {}`** (cannot touch network/storage/secrets/db/inference),
  ending in a mandatory fail-closed `_ =>` wildcard (LLN-TYPE-023),
- `tests/`, `README.md` documenting the secure posture.

So **"no plugin scaffolder" is [SHIPPED], not [ABSENT].** Building `logicn new plugin` from scratch would have
duplicated `logicn new package`. The *real* delta is much smaller (see §3a).

---

## 1. [SHIPPED] — what production already has

**Devtools packages** (`packages-logicn/logicn-devtools-*`, all test-bearing, Apache-2.0). Today they target the
**first-party monorepo** (graph *source*), not yet a third-party *signed admission surface*:

| Package | What it does |
|---|---|
| `devtools-project-graph` | effect/boundary/audit graphs over monorepo source (engine behind `logicn` graph reports) |
| `devtools-package-graph` | per-package boundary graph + **Hardened Border CI gate**; graphs *source* |
| `devtools-graph-algorithms` | internal graph algorithms (planned `lln-graph` extraction) |
| `devtools-flowgraph` | cycles, dead flows, authority-escalation, PII-leakage paths, missing audit coverage |
| `devtools-security` | taint / profiles / governance / hardware / sandbox / ReDoS → structured audit report |
| `devtools-provenance` | data lineage / PII-flow tracker |
| `devtools-pci` | PCI-DSS 4.0.1 contract-pattern audit |
| `devtools-naming` | Zero-Ambiguity naming enforcer |
| `devtools-intelligence` | BM25 + structural `.lln` code search (effects/economics/governance-aware) |
| `devtools-context` | AI Context-Receipt generator (token reduction from `.lln`) |
| `devtools-kb-graph` | KB cross-reference graph (wired to CLI `logicn kb-graph`) |
| `devtools-benchmarks` | governance-overhead benchmarks vs Python/Node/C++/Rust |

**Framework / extension-loading surface** (`logicn-framework-app-kernel`, Apache-2.0, tested):
- `kernel.ts` — fixed non-bypassable 12-step governed request pipeline + secure-default route policy.
- `fuse-loader.ts` — the **3-gate admission border** (sha256 hash-pin → Ed25519 sig + revocation →
  deny-by-default closed capability imports → `LinkError`/`CRITICAL_SECURITY_VIOLATION`); plus
  `planComposition` / `fusePackages` set-level host-link.
- `registry-index.ts` — **B5a signed central registry index** (`logicn-registry-index/v1`): tamper-evident
  certified-package catalog with cert levels + risk ratings, fail-closed `ERR_REGISTRY_*`, crypto-agnostic
  injected verify. **The data structure + verifier are SHIPPED and tested** — what is missing is the CLI/resolve
  *wiring* (see §2).
- `route-defaults.ts`, `logicn-api-protocol-rest`, and a real `logicn-framework-api-server/src/index.ts`
  (thin governed HTTP/HTTPS transport in front of the kernel, optional TLS cert-gate).
- governed `package-resolver.ts` — `LLN-PKG-001..006` (hash + Ed25519 + auditable registry origin +
  `installScript:"deny"` + signing-key revocation).

**Shipped CLI verbs** (`logicn.mjs` + `scripts/logicn-new.mjs`):
`new [package|app]`, `build --package <dir>`, `fuse`, `check`, `run --governed`, `bridge-attest verify`,
`kb-graph`, `deps`.

---

## 2. [ABSENT] — the genuine gaps (verified not in the CLI)

- **`logicn publish`** — sign a `RegistryEntry` and append it to the signed index; **no resolver path consults
  the index before admission yet**. The `registry-index.ts` module exists + is tested; the *wiring* is the
  residual. **NOTE: this touches the Ed25519 signing path** — the same path the in-flight verify/run-side
  PQ-floor work modifies. **Do not build `publish` until the PQ-floor lands** (collision risk).
- **`logicn audit <pkg|app>`** — one developer command fronting the already-tested `devtools-security` +
  `devtools-flowgraph` + `devtools-provenance` (+ over-declaration). No new analysis logic — pure composition
  + a CLI verb. **No crypto/signing overlap → safe to build alongside the PQ-floor work.**
- **`logicn graph --package <dir>`** — the signed-package admission/audit graph (0064): ingest the *signed*
  `.lmanifest` mask + provenance + revocation + transitive-mask chain, **derived-from-verified, never a
  self-declared trust input**. `devtools-package-graph` graphs *monorepo source*, not the signed admission
  surface. Reaches full value only once the transitive-mask ⊆ proof (#202) lands → sequences last.

## 3a. [IN-FLIGHT / refinement] — the *real* scaffolder delta

The `package` scaffold is correct but minimal: a `pure flow main() -> Int` with a bare `contract { intent }`.
The authoring guide §13 *package-standard checklist* asks an exemplary plugin to also carry `limits {}` and
`invariant { ensure result }`, and to keep `tests/` distinct from generated `proofs/`. So the scaffold could be
upgraded into a **golden plugin template** (the plugin analog of the SHIPPED example-app golden template) —
**but** naively adding an `effects {}` block would be an `LLN-EFFECT-006` over-declaration (you'd declare an
effect the stub never uses). The honest upgrade is therefore a *design* task, not a 15-minute drop:
- a `pure`-default variant (today's, but + `limits {}` + an output `invariant` where the return type supports it),
- optionally a `--with-effects <cap>` worked variant that declares *and uses* one capability (e.g. `audit.write`)
  so the example is least-privilege-correct, mirroring guide §8.
Recommend giving this the same single-source-of-truth treatment the example app got (`logicn new app` copies a
real, building template) rather than hand-emitting strings.

---

## 4. Prioritized proposal (corrected; security-first; lowest-risk → highest-value)

1. **`logicn audit <pkg|app>`** — compose the already-tested devtools behind one verb. **No core change, no
   crypto overlap, safe to build now.** Doubles as the seed for the `[DESIGN #206]` package-standard checker.
   *This is now the true #1* (the old #1 `logicn new plugin` is redundant — §0).
2. **Golden plugin template** (§3a) — upgrade `logicn new package` to model the §13 profile; design-gated
   (avoid the over-declaration trap), single-source-of-truth like the example app.
3. **Wire `registry-index.ts` → publish + resolve** (`logicn publish` + resolver consults index before the fuse
   border). Completes B5a end-to-end. **BLOCKED on the verify/run-side PQ-floor landing** (shared signing path).
4. **`logicn graph --package`** admission-graph → central auditor. Highest supply-chain value; depends on the
   #202 transitive-mask proof → sequences last.

**Out of scope for this track:** the owner-gated photonic seams (0057) and the dropped B7 BSL lint (all
Apache-2.0).

---

## See also
[logicn-third-party-plugin-authoring-guide.md](logicn-third-party-plugin-authoring-guide.md) (§3 four artifacts,
§13 checklist) · [logicn-framework-example-app-golden] (the SHIPPED app golden template `logicn new app` copies)
· [logicn-roadmap-and-percent-audit-2026-06-21.md](logicn-roadmap-and-percent-audit-2026-06-21.md) (B-series).
