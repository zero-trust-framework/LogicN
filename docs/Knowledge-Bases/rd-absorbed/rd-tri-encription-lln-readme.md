<!-- ABSORBED R&D SOURCE — verbatim mirror. LogicN is the main library; the R&D repo is upstream/authoring.
     Source: LogicN-R-AND-D/tri-encription/lln/README.md  ·  Pinned: R&D fb68d06 (2026-06-16)
     Integrated LogicN view: logicn-rd-adoption-2026-06-16.md  ·  Catalog: logicn-rd-absorption-catalog.md
     Rule: edit the upstream source then re-vendor; do not fork this copy (feedback-auto-import-rd-docs). -->

> **Absorbed R&D source (verbatim).** This is the archived upstream document. Curated/integrated view: `logicn-rd-adoption-2026-06-16.md`. See `logicn-rd-absorption-catalog.md` for the full ledger. Internal links below point at the upstream R&D tree.

---
# `tri-encription/lln` — the governance layer, cloned in real LogicN (`.lln`)

A working LogicN clone of the part of the bench that LogicN is *actually for*: the **K3
governance / key-release calculus** and the **verify-before-decrypt decision** of
[`../research/LLN-AMD-024-tmf-confidentiality.md`](../research/LLN-AMD-024-tmf-confidentiality.md)
(§1.2, §3). It mirrors [`../bench/lib/k3.mjs`](../bench/lib/k3.mjs), but type-checks +
governance-verifies clean and **runs on the real LogicN compile→WASM path** — so these are
genuine compiler results, not a simulation. This is the purpose-#2 dogfooding: build it in
`.lln`, get real results, and record every gap honestly.

## The honest split: what `.lln` can and can't do here

| Layer | Home | Why |
|---|---|---|
| **K3 governance / key-release gate** (this file) | **`.lln`, runs on WASM** | three-valued fail-closed decision logic is exactly LogicN's domain |
| **Crypto math** (ML-KEM, ML-DSA, SHA-256/SHAKE, AES-GCM, Reed-Solomon GF(256)) | **engine layer (the TS bench)** | **Blocked in `.lln`**: no byte buffers, no bitwise operators, no crypto primitives (logicn-issues 0002/0003). LogicN governs; the engine computes. |

## Run it

```sh
LOGICN=C:/wwwprojects/LogicN/logicn.mjs
node $LOGICN check k3-gate.lln                       # -> 0 errors, 0 governance warnings
node $LOGICN run   k3-gate.lln --invoke collapse 0   # -> -1   (unknown collapses to deny)
node $LOGICN run   k3-gate.lln --invoke keyRelease 1 1 1   # -> 1   (allow)
```

## Real results (compiled to WASM and executed)

`logicn check k3-gate.lln` → **`✅ 0 errors, 0 governance warnings`**. Then, invoking the
exported flows (WASM, Intel i9-9900K / Node v24):

| Invocation | Meaning | Output | Expected |
|---|---|---|---|
| `collapse 1` / `collapse 0` / `collapse -1` | `collapse(0)==deny` | `1` / `-1` / `-1` | ✅ |
| `negTrit 1` / `negTrit 0` | Kleene ¬ (¬0 = 0) | `-1` / `0` | ✅ |
| `minTrit 1 -1` | Kleene AND (cautious wins) | `-1` | ✅ |
| `maxTrit -1 1` | Kleene OR (permissive wins) | `1` | ✅ |
| `consensus 1 1 -1` / `consensus 0 0 1` | TMR median-of-three | `1` / `0` | ✅ |
| `keyRelease 1 1 1` | integrity+auth ok, govern allow | `1` | ✅ |
| `keyRelease 1 1 0` | governance unknown → fail closed | `-1` | ✅ |
| `keyRelease 0 1 1` | integrity FAIL → fail closed | `-1` | ✅ |
| `keyRelease 1 0 1` | authenticity FAIL → fail closed | `-1` | ✅ |

The verify-before-decrypt gate is reproduced exactly: a key is released (`+1`) **only** when
integrity AND authenticity pass AND the governance verdict collapses to Allow; every other
input — including a `0`/Unknown verdict — fails closed to `-1`.

## Policy composition + egress seam (`k3-policy.lln`)

[`k3-policy.lln`](k3-policy.lln) extends the clone with the Phase-3 governance pieces, as executable
policy (`logicn check` → **0 errors, 0 governance warnings**; every flow `--invoke`-verified on WASM):

| Invocation | Meaning | Output | Expected |
|---|---|---|---|
| `allOf3 1 1 0` / `allOf3 1 1 1` | Kleene AND fold (fail-closed conjunction) | `0` / `1` | ✅ |
| `anyOf3 -1 -1 0` / `anyOf3 -1 -1 1` | Kleene OR fold (disjunction) | `0` / `1` | ✅ |
| `allOfEmpty` / `anyOfEmpty` | empty fold → Unknown (no vacuous allow) | `0` / `0` | ✅ |
| `authorizeRead 1 1 1 1` (ok,ok,allow,trusted) | release plaintext | `1` | ✅ |
| `authorizeRead 1 1 1 0` (…UNtrusted dest) | no plaintext to untrusted egress | `-1` | ✅ |
| `authorizeRead 1 1 0 1` (…unknown verdict) | fail closed | `-1` | ✅ |
| `egressRedact 1 0` (semantic, UNtrusted) | redact / keep encrypted (verdict 5) | `-1` | ✅ |
| `egressRedact 1 1` (semantic, trusted) | filter at trusted endpoint → may emit | `1` | ✅ |
| `egressRedact 0 0` (opaque, UNtrusted) | opaque metadata may transit | `1` | ✅ |
| `readAndEmit 1 1 1 0 1` (…UNtrust, semantic) | combined gate fails closed | `-1` | ✅ |

This encodes the metadata-minimization verdict (LLN-AMD-024 verdict 5 = CROSSOVER F9) as runnable governance: a
semantic/embedding section's plaintext can be released **only** after integrity + authenticity + an
`Allow` verdict, and **only** to a trusted endpoint — never as cleartext toward an untrusted in-network
destination.

## LogicN dogfooding findings (candidate `logicn-issues`)

Recorded here rather than filed into `TritMesh/logicn-issues/` (that repo is out of scope for
this R&D). Source of record with full repros: [`logicn-gaps-candidate-issues.md`](logicn-gaps-candidate-issues.md).
Status re-verified 2026-06-16.

1. ✅ **FIXED — `governance` reserved word.** The diagnostic now names the cause (*"…reserved
   LogicN keyword and cannot be used as an identifier. Rename the parameter (e.g. `governance_`)"*).
   Stays reserved by design; minor cosmetic follow-on-cascade residual remains.
2. ⚠️ **PARTIALLY ADDRESSED — `secure flow main` not in the `--invoke` surface.** The diagnostic
   is now clear and self-documenting (explains secure/effectful flows run in the governed runtime,
   not raw WASM `--invoke`, and lists the invokable surface). The functional gap (executing an
   effectful `main` from the CLI) remains.
3. ✅ **FIXED — CLI Bool mis-marshal.** `true`/`false` now marshal correctly (`keyRelease true true 1`
   → `1`).
4. 🆕 **NEW (major) — `for … in` is silently not compiled to WASM.** A `List<Int>` param + a
   `for x in xs { acc = … }` fold type-checks clean, **but** the loop is never code-generated: the WAT emits
   `(i32.const 0) ;; unhandled stmt: forEachStmt` (a no-op stub), so the flow silently returns its first arg
   verbatim — `allOfList 5 9 9` → `5` (not the fold `1`). A type-checking `for` fold that does nothing at
   runtime is a silent correctness gap (same family as the now-fixed #3). See
   [`probe-list-allof.lln`](probe-list-allof.lln). Workaround: `k3-policy.lln` uses fixed-arity `allOf2/allOf3`.
5. **(Known blocker)** No byte buffers / bitwise ops / crypto primitives ⇒ the crypto math
   stays the engine layer (logicn-issues 0002/0003). Relatedly, there is **no native
   three-valued/trit type with a proven `collapse`** (TritMesh design-note 01 gap #1 /
   issue 0005), so the calculus is modelled over `Int` (`-1/0/+1`, LogicN's documented internal
   encoding) rather than an enum — `Int` is also what compiles to a clean WASM invoke surface.

See also: [`../bench/`](../bench) (the engine-layer TS reference + benchmark) and the research
notes in [`../research/`](../research).
