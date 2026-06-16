# LogicN — No Cleartext Semantic Embedding Across a Trust Boundary (U2/#204, LLN-PRIVACY-002)

**Status:** ENFORCED (Stage-A compile-time, `value-state-checker.ts`). Date: 2026-06-16.
**Origin:** tri-encryption R&D verdict 5 (`logicn-rd-adoption-2026-06-16.md`, U2/#204). Design
selected + adversarially hardened via a verify-before-build workflow (12-agent map/design/judge +
2 adversarial skeptics). KB cross-refs: [[logicn-contract-privacy-observability]] (the declarative
`privacy {}` block, LLN-PRIVACY-001), `pattern-10-verify-before-decrypt-gate.lln`, `logicn-substrate-contracts`
(LLN-SUBSTRATE-001 crypto-on-core).

## The invariant

*A cleartext semantic embedding may not cross a trust boundary.* An embedding vector is **invertible**:
embedding-inversion attacks (vec2text) reconstruct ~90%+ of the source text from a cleartext vector. So
shipping a semantic vector to an untrusted sink leaks the source content as surely as shipping the text.
The R&D remedy: **encrypt the vector; filter only at trusted endpoints** (after decryption).

## The model (chosen mechanism: SealTaint)

Three candidate mechanisms were scored (type-qualifier / declarative egress-rule / taint-propagation).
**Taint-propagation won** (architecture-fit 9, security 9) because it is the only one that holds the line
against laundering: a vector sliced/normalized/concatenated/reshaped is *still* inversion-bearing, so a
one-hop or type-only check fails open. It rides the **live `checkValueStates` pass** (wired at
`cli.ts`/`runtime.ts`), reusing the exact propagation that already powers LLN-VALUESTATE-005 and the
(now-fixed) secret-egress guard.

- **Sensitivity flag.** `BindingInfo.embeddingDerived` (mirrors `tainted`). A binding is stamped when it
  (a) is typed `Embedding`/`EmbeddingResult` (type backstop), or (b) is initialised from an embedding
  source, or (c) **derives** from an embedding-stamped binding.
- **Source recognizer** (`isEmbeddingSourceExpression`): the REAL shipped symbols — the `EmbeddingModel`
  value (`@logicn/ai-types`), canonical call `EmbeddingModel.run(...)`/`.infer`/`.embed`, plus the common
  `embed`/`embedQuery`/`embedDocuments` methods. (The original design's `model.embed` matched nothing —
  caught by the adversarial review.)
- **Propagation** (`derivesFromEmbedding`): walks slice/member/concat/record/list/non-sealing-call.
- **Discharge:** `seal()` / `encrypt()` ONLY. Unlike the generic taint chain, validate/parse/decode do
  NOT declassify an embedding (a decoded vector is still invertible). Crypto stays engine-side
  (govern-don't-absorb): the compiler recognizes the state transition, not the cipher.
- **Sink rule** (`checkArgForEmbeddingNetwork`, **LLN-PRIVACY-002**): a still-cleartext embedding reaching
  a network sink (`isNetworkSink`: http/https/net/socket/ws + fetch + email) is an error. Composes with
  pattern-10: SealTaint answers "may this leave cleartext?" (no, unless sealed); `keyRelease` answers "may
  it be decrypted here?" (only at a verified, key-holding endpoint).

```
secure flow route(req: Request) -> Int
contract { effects { ai.inference  network.outbound } } {
  let v = EmbeddingModel.run(req)        // v : embeddingDerived
  let r = http.post(remoteRouter, v)     // ✗ LLN-PRIVACY-002 — cleartext embedding egress
  let s = seal(v)                        // s : discharged
  let ok = http.post(remoteRouter, s)    // ✓ sealed vector may cross
  return 0
}
```

## Adversarial corrections applied (vs the raw design)

1. **Code collision avoided** — `LLN-PRIVACY-001` is reserved for the `privacy {}` block's declarative
   `deny protected X to Y` clause; this dataflow rule took **LLN-PRIVACY-002**.
2. **Propagating flag, NOT typeName** — keyed on a propagating `embeddingDerived` flag set on derived
   bindings, so slice/concat/record do not launder (the typeName-one-hop trap that the secret guard fell
   into — fixed in the same session, see below).
3. **Real recognizer symbols** — `EmbeddingModel.*` / `EmbeddingResult` / `Embedding`, not `model.embed`.
4. **Seal-only discharge** — the six USER_GATE_NAME_PREFIXES (validate/sanitize/check/verify/parse/decode)
   do NOT discharge this flag.

## Sibling fix (same session)

The fail-open auditor empirically proved **LLN-SECRET-002 itself** leaked on derived secrets
(`key.slice(0,5)` → `http.post` produced no diagnostic). Fixed first (`derivesFromSecret`, redact-discharge)
so secrets are not weaker than embeddings; SealTaint then mirrors that proven pattern with seal-discharge.

## Residual holes / deferred (honest limits — shared with the taint/secret guards)

- **Container read-back across statements** is only partly modelled: `{ v: e }` to a sink is caught (record
  literal + member-access on a stamped container), but storing into a collection and reading an element back
  in a later statement is not deeply tracked. Same limitation as LLN-VALUESTATE-005 / LLN-SECRET-002.
- **Inter-flow body descent** — passing an embedding into a user flow is a call-site signal
  (LLN-VALUESTATE-004 is warning-only) and the pass does not descend into the callee body. Cross-flow
  routing can still leak; escalating embedding-tainted inter-flow args to an error is a follow-up.
- **Runtime backstop** — the DRCM monitor scans only `__tag==='secure'` values; embeddings are not
  secure-tagged, so compile-time is the sole enforcement for this rule today.
- **CRYPTO_EFFECT** (`substrate-inference.ts`) covers `crypto.hash|sign|verify` only — extend to
  `crypto.encrypt`/`crypto.seal` to make the LLN-SUBSTRATE-001 "seal lands on a deterministic lane"
  composition real (deferred; orthogonal to the egress invariant).
- **Tensor<Float32,[N]>** is intentionally NOT treated as an embedding (too generic); recognition is
  precise to `Embedding`/`EmbeddingResult`/`EmbeddingModel`. Widen later if needed.

## Tests

`tests/embedding-egress-privacy.test.mjs` — 10 cases: direct/typed/inline sources fire; slice/concat/
record/double-derived (the laundering corpus) fire; seal()-via-binding, inline seal(), and derived
non-embedding stay clean. Compiler package green (3,389 tests, 0 fail).
