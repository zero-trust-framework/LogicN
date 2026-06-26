# Galerina — Task Ledger #1–#148 (graph-review checklist)

**Generated:** 2026-06-06 · **Re-verified:** 2026-06-15 · **State (2026-06-15 snapshot; CURRENT 2026-06-22 = 53/53 · ~5,020 live / 4,993 version.json — see galerina-roadmap-and-percent-audit-2026-06-22.md + version.json; §9 supersedes the §1 rollup; overall ~73%):** 48/48 packages · 4,360 tests · 0 fail · graph 2,995 nodes / 3,764 edges (1,839 files) · governance NEUTRAL.
*(The original 44/44 · 4,128 figure was a 2026-06-06 snapshot; counts re-run this session via `node scripts/run-all-tests.cjs` + `cli graph`. See SOT §1.)*

## How to use this (the point)
When you change a file, find its **code area** in §4, read off the **task IDs** that touch
it, and re-verify those features. Cross-check with the project graph
(`node scripts/run-phase-close.mjs` → graph:reindex, or the devtools-project-graph) to see
which flows/packages depend on the changed node. Status legend: ✅ done · 🔶 in-progress · 🔲 pending.

---

## 1. Status rollup
- **Done:** 137+ · **In-progress:** 1 (#105 parity-gated) · **Pending (in-repo):** #69, #110, #147, #148, #177, #199(Ph2). *(#146 was here — now ✅ BUILT, corrected 2026-06-22.)* **Blocked (external infra):** #102, #103, #104, #106. *(§2 rows below were stale for #143/#145/#199 — corrected 2026-06-15.)*
- **P9 critical path:** #144 ✅ → #145 ✅ → #143 ✅ — **P9 tokenize byte-parity COMPLETE (2026-06-06, see §3).** The §2 table rows had not been updated; now reconciled.
- **Post-P9 (frozen until P9 parity + gaps review):** #146, #147, #148. **Post-P9 DSS.wasm:** #102–#104, #106.

---

## 2. Task ledger (#1–#148)

| # | Title (abbrev) | Status | Subsystem |
|---|---|---|---|
| 1–3 | Graph generator: place / build / wire+run | ✅ | devtools-project-graph |
| 4–10 | SPORE-GOV-010 intent cleanup + auditor minimal-example rule | ✅ | examples · devtools-security |
| 11–13 | call-chain benchmark (.spore + mirrors + runner) | ✅ | devtools-benchmarks |
| 14 | Full benchmark suite + compare | ✅ | devtools-benchmarks |
| 15–16 | Bytecode-VM CALL fix + compiler tests | ✅ | core-compiler (interpreter) |
| 17–18 | Security audit sweep · examples up-to-date | ✅ | devtools-security · examples |
| 19 | Roadmap to 100% Runtime-in-Galerina | ✅ | docs |
| 20–22 | compare.mjs label fixes · http-throughput | ✅ | devtools-benchmarks |
| 23 | Physics N-body benchmark | ✅ | devtools-benchmarks |
| 24–27 | Self-hosting Stage B stubs · type-checker.spore subset | ✅ | core-compiler/self-hosted |
| 28 | ext-secrets-aws vault | ✅ | ext-secrets-vault |
| 29 | ext-proof-snarkjs Groth16 | ✅ | ext-proof-snarkjs |
| 30–35 | DRCM Phase 1: cap audit / scanner / CAS / CBOR / key custody / receipt sep | ✅ | core-compiler (manifest/proof/capability) |
| 36 | DRCM P2: invariant{} parser + static proof + WAT gate | ✅ | core-compiler (parser, wat-emitter) |
| 37 | DRCM P3: .lmanifest pipeline + admission gate | ✅ | core-compiler (manifest-generator, governance-verifier) |
| 38–39 | DRCM P4: SystemCapabilityType · policy{} monotonicity | ✅ | core-compiler (capability-types, governance-verifier) |
| 40–41 | DRCM P5: DWI step keyword + fuel · DSS supervisor .spore | ✅ | core-compiler · self-hosted/dss |
| 42 | DRCM P6: Epilogue Receipt + ledger | ✅ | core-compiler (proof-chain, manifest) |
| 43–44 | DRCM P7: OWASP negative suite · OCI/gVisor deploy | ✅ | tests · scripts (Dockerfile, deploy-linux) |
| 45 | SPORE-GOV/EFFECT/CAP code wiring | ✅ | core-compiler (governance-verifier) |
| 46–49 | Pattern examples + README + graph index | ✅ | tests/patterns · docs |
| 50 | T/FG/EC/ID/AU/LC diagnostic categories | ✅ | core-compiler (diagnostics) |
| 51 | @experimental_profile directive | ✅ | core-compiler (parser) |
| 52 | security::interim BoundaryProxy | ✅ | core-compiler |
| 53 | KNOWLEDGE-BASE-INDEX.md | ✅ | docs |
| 54 | T-006/007/008 goal harness | ✅ | tests |
| 55 | Named arguments at call sites | ✅ | core-compiler (parser, interpreter) |
| 56 | Domain Guard Policies (Static Manifest Clamping) | ✅ | core-compiler (governance-verifier) |
| 57 | Record constructor in let bindings | ✅ | core-compiler (parser) |
| 58 | resilience{} + observability{} blocks | ✅ | core-compiler (resilience-inference) |
| 59 | Change-class review workflow + CI | ✅ | scripts · .github |
| 60 | Contract clause reference | ✅ | docs |
| 61 | `::` module separator | ✅ | core-compiler (parser) |
| 62 | Multi-variant match arms `A|B =>` | ✅ | core-compiler (parser, interpreter) |
| 63 | governance-impact.json artifact | ✅ | core-compiler · scripts |
| 64–65 | galerina check --diff · init-env | ✅ | core-compiler (cli) |
| 66 | observability{} ⊄ privacy{} verifier | ✅ | core-compiler (governance-verifier) |
| 67–68 | .lmanifest CBOR (RFC 8949) + secure parser | ✅ | core-compiler (manifest-generator, cbor) |
| 69 | **Floor-specific dev-tools graphs** | 🔲 | devtools-project-graph |
| 70 | WAT single-exit body transform | ✅ | core-compiler (wat-emitter) |
| 71 | galerina check --what-if (Shadow Policy) | ✅ | core-compiler (governance-verifier) |
| 72 | parent_policy: inheritance + subset | ✅ | core-compiler (governance-verifier) |
| 73–74 | assuming{} proof-tracing block + verify | ✅ | core-compiler (parser, governance-verifier) |
| 75 | Governance-as-Evidence (CBOR Tag 410) | ✅ | core-compiler (manifest-generator) |
| 76 | SPORE-INV-000 DSS trap handler + audit event | ✅ | core-compiler · self-hosted/dss |
| 77 | Execution DAG (Tag 414) | ✅ | core-compiler (execution-graph) |
| 78 | MMCP typed memory views (Tag 415) | ✅ | core-compiler |
| 79 | Pre-resolved Policy DAG (Tag 416) | ✅ | core-compiler (governance-verifier) |
| 80 | Behavioral Fingerprinting CFG hash (Tag 417) | ✅ | core-compiler |
| 81 | `trap` keyword | ✅ | core-compiler (parser, wat-emitter) |
| 82 | `governed` flow qualifier | ✅ | core-compiler |
| 83 | `view(cap)` MMCP annotation | ✅ | core-compiler |
| 84 | Match exhaustiveness (SPORE-MATCH-001) | ✅ | core-compiler (type-checker) |
| 85 | DSS.spore V_DPM bit layout + bitmask | ✅ | self-hosted/dss · capability-types |
| 86 | `static` compile-time constants | ✅ | core-compiler (interpreter, governance-verifier) |
| 87 | `bitfield` V_DPM register | ✅ | core-compiler (parser, wat-emitter) |
| 88 | `gate {}` admission guard | ✅ | core-compiler (governance-verifier) |
| 89 | `access {}` enforcement | ✅ | core-compiler (governance-verifier) |
| 90 | `policy {}` state mutation governance — **RESERVED/future** (parser accepts `policy{}` as a silent alias, `parser.ts:2672`; only emergency-transition MONO #39 is live, NOT mut-var governance — corrected 2026-06-22) | 🔲 | core-compiler (governance-verifier) |
| 91 | vdpm.spore → `bitfield V_DPM` | ✅ | self-hosted/dss |
| 92 | import plugin assimilate/evict | ✅ | core-compiler (module-registry) |
| 93 | `;;` govComment manifest collection | ✅ | core-compiler (lexer, manifest) |
| 94 | import ./path.spore DAG merge | ✅ | core-compiler (module-registry) |
| 95–96 | Tower execution log + test gate | ✅ | scripts · tests |
| 97 | Stage B lexer.spore functional | ✅ | self-hosted/lexer.spore |
| 98 | Stage B parser.spore functional | ✅ | self-hosted/parser.spore |
| 99 | Stage B type-checker.spore functional | ✅ | self-hosted/type-checker.spore |
| 100 | Stage B governance-verifier.spore functional | ✅ | self-hosted/governance-verifier.spore |
| 101 | R6 corpus 100% Stage-A==Stage-B | ✅ | tests/r6-corpus |
| 102 | **dss/index.spore → build/dss.wasm** | 🔲 | self-hosted/dss · wat pipeline |
| 103 | **Wasmtime component supervises DWI** | 🔲 | runtime (Post-P9) |
| 104 | **Real Wasmtime fuel per DWI** | 🔲 | runtime (Post-P9) |
| 105 | **WASM admission-gate harness** (security core ✅; tokenize byte-parity ✅ via #144/#145 — `wat-p9-tokenize-parity` 21/21; real-DSS `galerina run` gated on #102/#103) | 🔶 | core-compiler/wasm-runtime.ts |
| 106 | **Epilogue receipts signed by DSS.wasm** | 🔲 | runtime (Post-P9) |
| 107–109 | **Ed25519** keygen · build-time manifest signing · admission verify gate (ML-DSA-65 PQ upgrade planned — see §9) | ✅ | core-compiler (attestation, manifest-generator, cli) |
| 110 | **Key rotation in secrets{}** | 🔲 | core-compiler (secrets) · ext-secrets-vault |
| 111–113 | Linux deploy · galerina deploy · OCI/gVisor | ✅ | scripts · core-cli |
| 114–117 | Package gate · SOT update · R6 final · v1.0 | ✅ | repo-wide · docs |
| 118 | P9.2 WAT String/Record linear-memory | ✅ | core-compiler (wat-emitter) |
| 119 | P9.3 stdlib method calls → host imports | ✅ | core-compiler (wat-emitter) |
| 120 | P9.4 guarded bodies + record layout (umbrella) | ✅ | core-compiler (wat-emitter) |
| 121–122 | Brain→Brawn BridgeRegistry · ai{} gov enforcement | ✅ | tower-citizen (hybrid-engine) |
| 123 | ext-bridge-cpp registry factory | ✅ | ext-bridge-cpp |
| 124–125 | CLI infer driver + ai{} contract · E2E | ✅ | galerina.mjs · tower-citizen |
| 126–129 | graph devtools · audit+tests · KB sync · benchmark table | ✅ | repo-wide |
| 130–136 | Sentinels: LSM · LSIO · LST · LSP · LSS · Egress + wiring | ✅ | core-sentinel-* |
| 137 | **CF-3/CF-7 bridge attestation** | ✅ | tower-citizen/bridge-attestation.ts · ext-bridge-cpp/addon-loader.ts |
| 138 | P9 certified mode mandates signed bridges | ✅ | tower-citizen (hybrid-engine, compiled-policy) |
| 139 | Enforced V_DPM capability gate | ✅ | tower-citizen (hybrid-engine) |
| 140 | Numeric policy table (CompiledPolicy) | ✅ | tower-citizen/compiled-policy.ts |
| 141 | P9.4b record struct layout (construct + field access) | ✅ | core-compiler/wat-emitter.ts |
| 142 | P9.4c guarded-flow export gating | ✅ | core-compiler/wat-emitter.ts |
| 143 | **P9 ceremony — tokenize byte-parity** (DONE 2026-06-06 — ledger §2 was stale; see §3) | ✅ | core-compiler · wasm-runtime |
| 144 | P9.4d enum-variant member lowering | ✅ | core-compiler/wat-emitter.ts (buildEnumVariants) |
| 145 | **P9 string runtime: type-aware `+`/`Char.toString` + `__str_concat`/`__char_to_string`/`__str_eq` + table exposure + output reader** | ✅ | core-compiler/wat-emitter.ts · wasm-runtime.ts (DONE 2026-06-06; ledger §2 was stale) |
| 146 | **Post-P9: compliance ledger over audit-egress** — ✅ **BUILT** (`devtools-pci/compliance-ledger.ts`, header "(#146)"; 9/9 tests; verified 2026-06-22) | ✅ | devtools-pci · sentinel-egress |
| 147 | **Post-P9: warm-sandbox + memory sanitizer** | 🔲 | core-compiler/wasm-runtime.ts |
| 148 | **Post-P9: 3 governance partials (token/cache/partial-eval)** | 🔲 | tower-citizen · core-compiler |

---

## 3. P9 tokenize byte-parity — ✅ DONE (2026-06-06)
- **#143 / #145 / #160 — ACHIEVED.** `lexer.spore` `tokenize` produces a byte-for-byte
  identical token stream in the Stage-A interpreter AND in real WASM through the #105
  admission gate (12-input corpus; `tests/wat-p9-tokenize-parity.test.mjs`). 3,295/3,295
  compiler tests green. Type-directed emitter lowering (Option<Char> sentinel dispatch,
  `charLiteral`→codepoint, `Char.toString`→`__char_to_string`, String `+`→`__str_concat`,
  String `==`/`!=`→`__str_eq`, `Array<String>.contains`→`__array_contains_str`, complete
  host stdlib + output reader). **Scope:** `tokenize` only; parser/type-checker/governance-
  verifier WASM parity remain.

## 3b. Post-parity Technical-Debt / Gaps Review — tasks #161–#191
Full grounded findings + fixes in **`docs/Knowledge-Bases/galerina-techdebt-gaps-review.md`**
(50 adversarially-verified findings). New tasks (one line each; details in the review doc).

**✅ Landed 2026-06-06 (first batch):** #161 (Array.count), #169 (Char classifiers
isUpper/isLower/isWhitespace), #170 (code-point host string indexing + interpreter
charCount reconciliation; non-BMP oracle test), #174 (kb-graph/diagnostic shell-injection
→ spawnSync), #175 (keygen 0o600), #185 (host-stdlib oracle test), #189 (parity corpus now spans
string/char literals, line/block comments, string concat, and escape sequences — 21
inputs, all byte-parity-clean), #191 (README/version.json P9 status), **#168**
(enum-variant `match tok.kind { Keyword => … }` → i32 tag dispatch via `enumVariantTag`;
verified in real WASM by `tests/wat-enum-match.test.mjs`). The #168 work also REWROTE the
statement-path match chain (`emitMatchArmStmt`), fixing two pre-existing #167-class silent
miscompiles: 3+-arm chains dropped the 3rd+ arm with imbalanced parens, and one-liner arm
bodies (`Red => return 10`) were mis-emitted as `;; unhandled stmt: numberLiteral`.
**3,314/3,314 compiler tests green** (tokenize parity preserved through the rewrite);
`galerina kb-graph` CLI re-verified. No latent bugs in the string-heavy lexer paths —
#160 type-directed lowering is sound across all token classes.

**✅ Landed 2026-06-06 (second batch — match dispatch):** **#164** Result `Ok(v)`/`Err(e)`
dispatch (new host `__result_tag`/`__result_value`; reads tag → unwraps payload → binds
v/e) + guard `when COND => body` arms (condition = the guard expr). Verified in real WASM
by `tests/wat-result-match.test.mjs`. The statement-path match dispatch is now COMPLETE:
Option (None/Some) · Result (Ok/Err) · enum variants (#168) · int literals · guard `when`
· wildcard default — all dispatch + bind correctly. **3,317/3,317 compiler tests green.**

**✅ Landed 2026-06-06 (third batch — host String methods):** **#162** host
`startsWith`/`endsWith`/`trim`/`indexOf`/`slice` (String-only → STDLIB_HOST_MAP) + type-
directed `contains` (String → `__str_contains` substring; Array<String> → `__array_contains_str`)
and `toUpper`/`toLower` (Char → `__char_to_upper/lower`; String → `__str_to_upper/lower`).
Host fns mirror src/stdlib.ts EXACTLY (slice/indexOf UTF-16, charAt/length code-point — the
interpreter's own inconsistency replicated for byte-parity). Verified in real WASM by
`tests/wat-string-methods.test.mjs`. **3,320/3,320 compiler tests green.**

**✅ Landed 2026-06-06 (fourth batch — records):** **#163** `#record-update`
(`{ ...base, field: v }`) — bump-allocate a fresh record of the base's type, copy ALL
base slots, overwrite the named fields; was a silent null-handle placeholder. Verified in
real WASM (`tests/wat-record-update.test.mjs`: overwrite per slot position + base not
mutated). **3,322/3,322 compiler tests green.** Parser-parity prerequisites now cleared:
**#161 · #162 · #163 · #164 · #168 · #169 done**; remaining for parser WASM parity:
#192 (match-as-expression parser), #193 (param-naming collision).

**✅ Landed 2026-06-21 — #165 (float arithmetic) DONE end-to-end.** Scalar `Float` is f64
(literals → f64.const, `+ - * /` → f64.*, comparisons → f64.cmp→i32 bool, mixed int operands
promote via f64.convert_i32_s). The prior batch shipped the OPCODE lowering but left three
defects that only a RUNTIME (WebAssembly.instantiate) check catches — `assembleWAT().valid`
false-greened them: (1) a float-returning flow was typed `(result i32)` over an f64 body; (2) a
float local was `(local $y i32)` set with an f64; (3) nested mixed arith (`(x*2)+1`) inferred Int,
so the outer op took the i32 path over an f64 operand / wrapped an already-f64 value in
convert_i32_s (bit-reinterpret → garbage). Fixes in `wat-emitter.ts`: result valtype keys off
FLOAT_WAT_TYPES; new `watStackType` declares each local with its initialiser's stack type
(safe-default i32 → invalid module → walker, never a mistyped valid store); `inferExprType` makes
float arithmetic contagious. New `tests/wat-f64-runtime-165.test.mjs` (8 tests) instantiates and
asserts computed results. Suite 53/53 · 4952. EDGE (walker-only, unchanged, no regression): a float
flow with an `invariant { ensure result … }` output post-condition — `$galerina_result` is i32.
Tri-Pipe verdict: **Binary-only** (exact IEEE-754 digital arithmetic; floats reach the photonic
seam only as tensor kernels, a separate path).

> Note: expression-position `match` (`return match …` / `let x = match …`) is a separate
> PARSER gap (parses `match` as an identifier) — the expression-path Option/enum/Result
> dispatch is correct by construction but unreachable/untestable until that parsing lands
> (task **#192**). The statement path (which all self-hosted flows use) is fully exercised.

| # | Task | Sev | Eff |
|---|------|-----|-----|
| 161 | Lower `Array.count()` (unblock all self-hosted loops) | high | S |
| 162 | Add host string methods (slice/startsWith/endsWith/toLower/toUpper/trim/indexOf/substr-contains) | high | M |
| 163 | Lower `#record-update` instead of null-handle placeholder | high | M |
| 164 | Sentinel/tag-dispatch Result `Ok/Err` + guard `when` match arms | high | L |
| 165 | Type-direct float arithmetic to f64 ops + f64 locals | medium | L |
| 166 | Fix `bodyTailIsUnreachable` for non-exhaustive match / normal-exit while | medium | M |
| 167 | Make WAT emitter placeholder fallbacks fail-closed (no silent return-0) | medium | M |
| 168 | Resolve enum-variant match arms (`match tok.kind {…}`) via `enumVariants` | high | M |
| ~~169~~ ✅ | Add host Char classifiers — **DONE** (verified 2026-06-21: `isUpper`/`isLower`/`isWhitespace` mapped `wat-emitter.ts:858-860`, declared `:2811-2813`, in oracle-tested `createHostRuntime`, and now in the `galerina.mjs` inline run-host which had drifted → `galerina run --wasm` failed at instantiate). `toUpper`/`toLower` = String-ambiguous → type-directed under #162. **FOLLOW-UP (audited 2026-06-21):** the `galerina.mjs` inline run-host is a stale partial copy of `createHostRuntime`, missing ~11 emittable imports — `__str_count`, `__str_starts_with`/`_ends_with`/`_contains`/`_index_of`, `__str_to_lower`/`_to_upper`/`_trim`/`_slice`, `__char_to_upper`/`_to_lower` — so `galerina run --wasm` fails at instantiate for string/char-heavy flows (emitter tree-shakes imports, so basic flows still work). Proper fix = unify onto `createHostRuntime` + switch result-reading to the rt intern/array tables (`rt.readString`); the intern-table coupling (`_hostStrings`/`_hostArrays`) makes it a careful, NOT-unattended refactor of a user-facing command. | high | M |
| 170 | Code-point-correct host string indexing + reconcile interpreter charCount | medium | S |
| 171 | Replace in-band `-1` None sentinel with boxed Option/Result handle. **🔍 root-caused 2026-06-21:** an `Option<T>` match lowers to a SIGN check (`wat-emitter.ts:1766-1793`: `i32.lt_s subject 0` ⇒ None, else Some), with None=`-1` and `Some(v)`=bare `v`, so **any `Some(x<0)` is silently dispatched as `None`**. The `:1768` comment bakes in the `Some ≥ 0` assumption — **latent, not active** (the corpus only produces `Option<Char>` from `charAt`, codepoints ≥ 0). Fix = boxed `{tag,value}` handle (or separate present-bit, cf. for/where mask); a `Some(-5)` repro needs the `Some(Int)` construction path lowered to WASM first (same work item). **DEFERRED — wide blast radius, owner-supervised.** | high | M |
| 172 | Stop i32-truncating `__int_to_str` | low | S |
| 173 | Bind certified-profile + sha256 into WASM admission signature pre-image | high | M |
| ~~174~~ ✅ | Fix command injection in `galerina kb-graph` / `diagnostic` — **DONE** (verified 2026-06-21: `spawnSync` + argv arrays, `shell:false`; no shell-string concat; `galerina.mjs:556-592`). | — | S |
| ~~175~~ ✅ | Write keygen private-key file with 0o600 — **DONE** (verified 2026-06-21: `galerina.mjs:320` + `governance/key-lifecycle.mjs:145-146` write `.env.galerina-signing` at `mode: 0o600` + `chmodSync` best-effort). | — | S |
| 176 | Import-closure validation + attestation freshness/revocation in #105 gate | medium | M |
| 177 | Deprecated `policy {}` alias → `accessDecl` (or hard-reject) | low | M |
| 178 | Cross-module `assuming()` proof-borrowing fail-closed in `--release` | medium | M |
| 179 | Fail closed on non-numeric RHS in interpreter numeric comparisons | low | S |
| 180 | Replace placeholder manifest signatures with real ML-DSA-65 (or hard-fail) | low | M |
| 181 | Wire GovernanceEnforcer 0→1 commit gate into `TowerRuntime.execute` + de-stub outputHash | medium | M |
| 182 | Make `signAudit` a real signature (or rename misleading `mldsa65:` prefix) | medium | M |
| 183 | BitNet CPU/GPU `execute()` fail-closed on `canCommit()` (CF-5) | medium | S |
| 184 | Gate `tmacVector` COMMIT through `checkTransition` | low | S |
| 185 | Truth-table oracle test for type-directed WAT host fns | medium | S |
| 186 | Enforce + test disallowed-host-import rejection in #105 gate | medium | M |
| 187 | Isolated WAT tests for `bodyTailIsUnreachable` ifStmt branch | low | S |
| 188 | Isolated WAT tests for Option<T> match in expression position | low | M |
| 189 | Extend tokenize parity corpus: string/char literals + comments | medium | S |
| 190 | Wrong-key + malformed-signature rejection tests for #105 gate | low | S |
| 191 | Reconcile README + version.json P9 byte-parity status with SOT | medium | S |
| 192 | Parser: support `match` in expression position (`return match …` / `let x = match …`) — currently parses `match` as an identifier, splitting arms into stray blocks (found verifying #168) | medium | M |
| 193 | WAT emitter: a user variable named `p0`/`p1`/`p2`/… collides with the positional param WAT name `$p<i>` → "redefinition of parameter" link error. Prefix params (`$__arg<i>`) or locals to avoid the clash (found verifying #163) | low | S |
| 194 | **Caching of logic/governance for speed** (USER PRIORITY, sooner). Cache the compiled evaluator (#140 numeric policy table); zero-trust invariant: NEVER cache a final allow/deny decision. Shadow-mode → enforce. Design per Galerina's real `flow`+`contract` model. See checkpoint §8.2 | high | M |
| 195 | OS/Hardware-compromised posture as `off \| auto \| on` (default `auto`, fail-secure). USER directive. Config knob read by DSS + #105 gate + Tower hot path. See checkpoint §8.1 | medium | M |
| ~~196~~ | ~~Ternary XOR / SUM gate~~ — **NOT ADOPTED** (notes discussion). Binary XOR already covered (`^`→i32.xor); that answers the question. | — | — |
| ~~197~~ | ~~Zig-ready IR track~~ — **REJECTED 2026-06-06** ("Do NOT add Zig to this project"). WASM + native stay as-is. | — | — |
| ~~198~~ | ~~Language-Framework Hybrid / remove middleware~~ — **NOT ADOPTED.** Notes were DISCUSSION ONLY; their code examples don't reflect real Galerina. Galerina stays a TypeScript-like `flow`+`contract` language. `galerina-framework-*` packages remain scaffolds (#154). | — | — |
| **ZTF** | **Zero Trust Framework** — umbrella project over Galerina + siblings; a governing SECURITY BAR (deny-by-default, no ambient authority, explicit capability, fail-closed, actor-aware audit, OS/HW-as-compromised). Every component must warrant the badge. See checkpoint §8.7. | — | principle |
| — | **CLEANUP (done 2026-06-06):** removed stale `scripts/run-all-tests.js`; fixed the 2 broken `.claude/settings.json` refs (`test-core`/`test-all` → `.cjs`); renamed `scripts/{mark-core-change,run-core-tests}.js` → `.cjs` (were broken by root `type:module`). | — | done |
| — | **NOTE: `notes/30-notes*.md` are DISCUSSION ONLY.** AI-written code examples may not reflect real Galerina. Do NOT build from them; Galerina stays `flow`+`contract`. | — | — |
| 199 | **`@galerinaa/ext-bridge-quantum` — governed out-of-process bridge for IBM `ffsim`** (fermionic quantum-chemistry sim, Apache-2.0). DESIGN COMPLETE, build not started. *Govern it, don't absorb it:* ffsim's Python/Rust stays out-of-process (Tier-3 untrusted, Toxic Border); no math reimplemented in core. **⚠️ STATUS CORRECTED 2026-06-15: Phase 0 + Phase 1 SHIPPED & TESTED** (`tolerance` manifest schema in `inference-bridge-contract` + pure-TS governance core in `galerina-ext-bridge-quantum`, 12 tests). FFSM `SESSION-HANDOFF.md` "nothing built / start at Phase 0" is STALE — resume at **Phase 1.5** (AuditLogger + Ed25519 attestation) → **Phase 2** (real `ffsim_worker.py` + child_process, external-infra-gated on a pinned Linux venv). New job-oriented `QuantumSimBackend` contract (NOT the ternary `InferenceBridge`); `quantum {}` contract sub-block (analog of `ai {}`); pre-spawn **subspace-dim gate** `C(norb,nα)·C(norb,nβ)` as the real memory governor; **tolerance-determinism** (never bit-exact) → needs additive `manifest.ts` extension (`DeterminismMode+="tolerance"`, `pinnedEnvHash`, `backendArtifactHash`); reuses CF-3/CF-7 attestation (#137/#138). **All 7 design decisions RATIFIED 2026-06-15:** tolerance-certified admissible iff 3 pins present (pinnedEnvHash+tolerance+backendArtifactHash), fail-closed; crypto-exclusion = **`SPORE-SUBSTRATE-001`** (declare ffsim path `lane: noisy`, reuse shipped `verifySubstrate` — no new machinery); receipt signs SHA-256 on the deterministic core; per-call spawn v1; OCI/gVisor sandbox Stage B. Full spec + skeleton + checklist + resolved decisions in **`docs/Knowledge-Bases/galerina-ext-bridge-quantum-design.md`**. Corrects `notes/33` ffsim↔ternary/NTT/BitNet/MeshQL conflations. **Phase 0 = additive `inference-bridge-contract` manifest schema change (decided, §9.1) gates everything.** | 🔲 | ext-bridge-quantum (new) · inference-bridge-contract · tower-citizen · substrate-model |
| 200 | **Lower member access on a NON-IDENTIFIER receiver to WASM.** Currently FAIL-CLOSED → walker: `memberExpr` lowering (`wat-emitter.ts:1026-1066`) handles only an *identifier* receiver; any non-identifier receiver falls through to `(unreachable) ;; unresolved member` → walker fallback (correct, no WASM). **Confirmed 2026-06-21 by probe:** nested `a.b.c.v` AND flow-call result `mkP().x` both fail (TRAP / invalid module). Record *construction*, 1-level `o.tag`, record params, and **bind-then-access (`let p = mkP() … p.x`) all work — so the WORKAROUND today is to bind the receiver to a local first.** **Fix:** build a record field-TYPE map (the `Type` half of each `name: Type` paramDecl — already parsed in `buildRecordLayouts:397`) threaded like `recordLayouts`, + make `memberExpr` lowering RECURSIVE on the receiver (resolve receiver record-type + pointer via a helper, then `i32.load` the field at its offset). Additive — only the currently-fail-closed nested path changes; **verify the WASM result matches the walker EXACTLY** (a wrong offset would be worse than the current fallback). Found by probe 2026-06-21. | medium | M |

---

## 4. Code-area → task review reverse index (graph triggers)
*Change a file in the left column → re-verify the task IDs on the right.*

| Code area | Tasks to review |
|---|---|
| `core-compiler/wat-emitter.ts` | 36, 70, 81, 87, 118, 119, 120, 141, 142, **144**, **145** |
| `core-compiler/wasm-runtime.ts` | **105**, **143**, **145**, 147 |
| `core-compiler/governance-verifier.ts` | 37, 38, 39, 45, 56, 66, 71, 72, 74, 79, 88, 89, 90, 100 |
| `core-compiler/manifest-generator.ts` · cbor | 33, 37, 67, 68, 75, 77, 78, 79, 80, 108 |
| `core-compiler/parser.ts` · lexer.ts | 36, 51, 55, 57, 61, 62, 73, 81, 87, 93, 144 (enumDecl) |
| `core-compiler/interpreter.ts` | 15, 55, 62, 86 |
| `core-compiler/attestation.ts` | 34, 35, 107, 108, 109, 137 (Ed25519 pattern reused) |
| `core-compiler/capability-types.ts` | 38, 85 |
| `core-compiler/self-hosted/lexer.spore` | 97, 101, **143**, **145** |
| `core-compiler/self-hosted/{parser,type-checker,govern}.spore` | 98, 99, 100, 101 |
| `core-compiler/self-hosted/dss/*.spore` | 41, 76, 85, 91, 102 |
| `tower-citizen/hybrid-engine.ts` | 121, 122, 138, 139, 140 |
| `tower-citizen/bridge-attestation.ts` | 137, 138 |
| `tower-citizen/compiled-policy.ts` | 140 |
| `inference-bridge-contract/*` | 121, 137 (manifest schema), 199 (tolerance/backendArtifactHash extension — design) |
| `ext-bridge-cpp/*` | 123, 137 (addon hash) |
| `ext-bridge-quantum/*` (new — design only) | 199 (ffsim out-of-process bridge) |
| `core-sentinel-*` | 130–136 |
| `devtools-pci/*` | 146 |
| `devtools-security/*` | 9, 10, 17 |
| `devtools-project-graph/*` | 1, 2, 3, 69 |
| `devtools-benchmarks/*` | 11–14, 20–23, 129 |
| `scripts/run-phase-close.mjs` · CI | 59, 63, 95, 96 |
| `galerina.mjs` (CLI) · core-cli | 64, 65, 112, 124, 137 (`bridge-attest`) |
| `docs/Knowledge-Bases/*` | 19, 49, 53, 60 + this ledger |

*Maintenance: when a task lands or a file moves, update the row above. Re-run `run-phase-close.mjs`
after edits to refresh graph node/edge counts and confirm audit/governance stay green.*

---

## 5. Milestone #200 / P10 — Post-P9 Integrity & Graph-Indexing Close-Out (2026-06-15)

Full record: **[galerina-200-closeout-2026-06-15.md](galerina-200-closeout-2026-06-15.md)**.
Verified state: **48/48 packages · 4,360 tests · 0 fail**; graph **3,533 nodes / 3,969 edges**.

| # | Item | Status |
|---|---|---|
| 200 | **Post-P9 integrity close-out (umbrella)** | ✅ in-repo portion COMPLETE |
| 200a | Doc reconciliation (SOT/ledger counts, #143/#145 un-staled, #199 corrected, FFSM banner) | ✅ |
| 200b | **#177 graph fix** — `createFileNode`+`extractGalerinaSymbols` galerina-source nodes; +3 pkgs to workspace | ✅ |
| 200c | `SecretSinkMonitor` dead-duplicate consolidation + graph regen | ✅ |
| 200d | Full-repo deep audit (48 confirmed / 1 refuted; 10H/17M/21L) | ✅ |
| 200e | External idea-mining (8 repos → 12 ranked; [galerina-external-idea-mining-2026-06-15.md](galerina-external-idea-mining-2026-06-15.md)) | ✅ |

**Open follow-ups become the roadmap (NOT part of #200):**
- **#201 — "calibration-as-attestation" lane (increments 1-2 LANDED 2026-06-15 — see §6):** measured-tolerance/precision-attestation contract work (idea-mining #5→#2+#12→#3+#4→#1); extends `BridgeManifest`+`DeterminismMode "tolerance"`.
- **#202 (proposed) — honesty pass (#179-class):** H3/H4 ML-DSA naming, manifest CBOR/JSON header, LEXER_PARITY downgrade, scaffold relabeling, README overclaims, `canCommit` wiring-or-docstring.
- **#177-followon:** add the remaining ~34 real packages to `galerina.workspace.json` (graph under-coverage; #155-adjacent).
- **User-gated (TCB/decisions):** H1 cert-profile pre-image · H2 `policy{}` fail-open (parser) · H5 fusion-B2 ABI · #149 key rotation+force-push.
- **External-infra:** real DSS.wasm (#102-106) · ffsim Phase 2 (#199) · ML-DSA-65 manifest wiring.
- ⚠️ **dead-export findings are "wire-or-verify", NOT "delete"** — some (e.g. plugin-schema.ts) are pending-integration security code per P9-144.

---

## 6. Session continuation (2026-06-15 cont.) — #201 lane opened + audit-fix landings

Verified: **48/48 · 4,368 tests · 0 fail**. 7 commits on top of `Initial commit` (all local). KB: [galerina-precision-attestation.md](galerina-precision-attestation.md).

| # | Item | Status | Commit |
|---|---|---|---|
| 201 | **Calibration-as-attestation lane (umbrella)** | 🔶 contract-package portion landed | — |
| 201.1 | Measured-attestation manifest fields: `comparabilityHash`, fidelity floor (`minFidelity`/`measuredFidelity`), `toleranceWitness {N,ε,std,noiseModelId}` + the **"can't claim a tighter band than measured"** invariant. Opt-in, hash-preserving, fail-closed. | ✅ | `659b90c` |
| 201.2 | `QuantizationMethod` axis (none/qat/gptq/awq/marlin/nf4/gguf) + optional `quantizationMethod` field (idea #5 done as a SEPARATE axis — widening `PrecisionTechnique` would break the Tower's exhaustive `Record<PrecisionTechnique,_>` maps). | ✅ | `31b44ee` |
| AF-1 | **border-check** fail-closed admission gate: 13 spawn-CLI regression tests (P9-144 §83) + wired into `run-phase-close`. | ✅ | `2d584c0` |
| AF-2 | **Sentinel instanceof fix:** `Object.setPrototypeOf` restored in memory/state error classes (consistent with egress/io) + regression test. | ✅ | `beb575b` |
| AF-3 | `type-registry.ts:145` stale comment → inline `EffectFlags`. | ✅ | `beb575b` |
| AF-4 | **Graph duplicates:** verified NOT mergeable (`project-graph` is a vendored external repo + `graph-algorithms` is compiler-used); hardened our `canReach` + do-not-merge marker. | ✅ | `f57ef02` |

**#201 — enforcement + still-open (corrected 2026-06-16):**
- ✅ **Universal enforcement VERIFIED (not a gap).** The Tower admission gate `hybrid-engine.ts:265 → verifyAttestation → validateManifestShape` (`bridge-attestation.ts:71`, fail-closed) runs ALL #201 checks; `attestationHash` hashes the `canonNum`-hardened pre-image. Proven end-to-end by `bridge-attestation.test.mjs` (non-finite tolerance / below-floor fidelity / tighter-than-measured witness all DENY at admission). *(The earlier "not wired" note was a grep `head` truncation false-negative — caught by reading the code.)*
- 🔒 **Attestation-injectivity fail-open FIXED** (`66e1b48`): non-finite numeric fields can no longer alias two manifests to one sha256.
- **Still open:** **#1** precision-attestation gate (compiler-side) · **#3/#4** substrate integration (`verifySubstrate` + the witness) · storage/compute-precision split (needs `int4`/`int8` in the routing enum + both Tower Records) · **#2** comparability + mandatory-witness as required pins for `determinismMode='tolerance'` (with ffsim-manifest migration).

---

## 8. R&D 0059–0064 triage → proposed tasks #201–#210 (2026-06-22)

Full triage: **[galerina-rd-0059-0064-triage-2026-06-22.md](galerina-rd-0059-0064-triage-2026-06-22.md)**
(ground-truthed against live source; design-only). Supersedes nothing — these are NEW proposed tasks layered
over the #1–#200 register above. Convergent #1 = **#201** (least-privilege minimality, partially shipped).

| # | Task (abbrev) | Status | Source | Subsystem |
|---|---|---|---|---|
| 201 | Escalate `SPORE-EFFECT-002 OVERDECLARED_EFFECT` warning → profile-gated fail-closed error + port to Stage-B | 🔲 | 0062§2 ∧ 0063§3 | core-compiler (effect-checker) |
| 202 | Transitive capability-mask `⊆` proof across the signed-package dep graph | 🔲 | 0062§3 | core-compiler · framework-app-kernel |
| 203 | Full contract digest — extend effects-only `behavioralFingerprint` to limits/substrate/invariant | 🔲 | 0062§5 | core-compiler (manifest-generator) |
| 204 | Signed-package audit graph: `galerina graph --package` + central auditor over the admission surface | 🔲 | 0064 | core-cli · devtools-graph-project |
| 205 | Unify `TypeId.Unknown` with the governance K3 algebra (one Kleene lattice) — the 0061 headline | 🔲 | 0061§2 | core-compiler (type-checker · governance-verifier) |
| 206 | Package-standard profile + basic-rules checker + `@galerinaa-core/*` verified tier + level-1-only deep deps | 🔲 | 0062§2/§4 | core-compiler (package-resolver) |
| 207 | Idempotency effect-annotation → `resilience{}` retry-legality (unblocks `SPORE-FAULT-005` fallback-half) | 🔲 | 0059§6 | core-compiler (resilience-inference) |
| 208 | Per-granted-capability egress-policy binding | 🔲 | 0063§3 | core-network |
| 209 | Key-custody hardening — name-similarity / expected-key check at grant/sign | 🔲 | 0063§3 · 0057 | governance · secrets |
| 210 | TS7-native `tsc` host build + 53-pkg parallelism + watch (NOT a compiler rewrite) | 🔲 | 0060 | toolchain (#155-adjacent) |

*Already tracked elsewhere (no new task):* 0059 Global Safety Theorem SMT obligations → 0024/0040 Z3 track;
`SPORE-FAULT-005` → fault-tolerance doc §9; per-block differential → formal-verification-direction.md.
**Owner-gated steers:** #201 (breaking-in-prod), #205 (architecture), #210 (toolchain commitment).

---

## 9. Tracker reconciliation (2026-06-22) — corrections + new tasks #211–#212

Wide KB-vs-todos-vs-R&D-vs-roadmap reconciliation (23-agent workflow, every flagged finding adversarially
verified against live source). **Headline: no R&D output is unreflected** — every 0001–0064 report has a
production home. The findings are tracker drift + two genuinely-missed security gaps.

**New tasks (CONFIRMED missed — in NO tracker AND not implemented):**
| # | Task | Subsystem |
|---|---|---|
| 211 | **governance-telemetry inbound-hardening gate** — the exporter's HTTP listener (`galerina-governance-telemetry/src/server.ts`) has only 405/404/500: no request timeout, rate-limit, body-size cap, slowloris guard, `SecurityPosture` honor, or run-under-App-Kernel (12-point border gate items 1/9/10/12). **Security: an unhardened inbound listener on a zero-trust component.** | galerina-governance-telemetry |
| 212 | **kernel→runtime governance-deny bridge** (owner-gated) — the `503 + X-Galerina-State` backpressure handshake needs a runtime-denial→kernel-response bridge that does not exist (`kernel.ts` `KernelErrorCode` has no `governance_deny`; no `X-Galerina-State` in any `.ts`). Named unbuilt/held-back in KB, in no tracker. | framework-app-kernel · runtime |

**Stale-mark corrections applied 2026-06-22:** #90 ✅→🔲 (RESERVED, not built — was conflated with #39);
#146 🔲→✅ (BUILT); prove-own-maths §3 — 6 OWED items marked PROVEN (2026-06-18 benches); status-count
headers across build-roadmap / this ledger / SOT / KB-INDEX / roadmap-2026-06-17 reconciled to **53/53 · 4,989**;
absorption-catalog staleness flagged; key-custody `bridge-attest` wiring marked done.

**build-roadmap "🟡 Open" tables are stale** (DONE but still listed open — verified against source; fix when
that doc is next edited): #68 (CBOR secure parser), #72 (`parent_policy` ⊆), #76 (SPORE-INV-000), #91 (`bitfield
V_DPM`), #125 (`run --governed`), #126 (bitwise hint — doc self-contradicts), #128 (for-in WASM — doc
self-contradicts). Correctly open: #69, #147, #148, #171, #172, #192, #193, #200, CF-4, CF-5. **REFUTED** (leave
open, only half-done): #177 (deprecation advisory not emitted), #119 (native BitNet runtime absent).

**OWNER DECISIONS NEEDED** (surfaced, not parked — per `feedback-owner-gated-means-ask`):
- **0056 / 0057 / 0058** framework architecture (B1–B8) — owner-DIRECTED but PARKED under a "HOLD rule" in
  roadmap-2026-06-21; the standing rule treats owner-directed designs as GO. Confirm build-vs-hold.
- **#201** least-privilege minimality escalation (breaking-in-prod) · **#205** Kleene-lattice unification
  (architecture) · **#210** TS7 host build (toolchain commitment) — from the 0059–0064 triage.
- **#212** kernel→runtime governance-deny bridge (security-sensitive) · **H2** inline `contract` `policy{}`
  allow/deny parsed but enforced by no checker (a deny-by-default fail-open).

**✅ B8 HTTP-transport UNLOCKED (owner decision, 2026-06-22).** The owner's transport R&D landed (TLSTP grounding
`wi3py3913` + worker dones 0065/0066/0068, independently rule-audited = compliant) and the owner has LIFTED the lock
— **B8 is now GO.** Build per the absorbed design `rd-tlstp-transport-auth-cluster-2026-06-22.md`. **BUILD-FIRST =
the S1 K3 cert/channel-validation gate** (the converged lead: `cert_verdict = vAnd(pin_match, chain_valid,
not_expired, revocation_fresh) ∈ {+1,0,−1}`, **revocation-unknown→DENY**, over a library-validated chain;
crypto-digital, reuses `decideAtBoundary`; hardens MITM for BOTH TLSTP and vanilla HTTPS). Then 0066's first-3
sequence (bind shipped admission to the handshake · raw-byte shim + idempotency-gated 0-RTT · Recovering FSM +
ECH/OHTTP). Crypto stays Binary; photonics feed a K3 verdict only; the in-sandbox-isolation guarantee stays
aspirational (#102-106). **#211 listener hardening is now in-scope too.** Memory: [[feedback-http-transport-owner-locked]] (now UNLOCKED).
  - **✅ S1 CERT-GATE LANDED 2026-06-23** — built as `packages-galerina/galerina-core-network/src/cert-gate.ts` (+ `tests/cert-gate.test.mjs`, 22 tests; core-network 104→126; suite 53/53 · 5,042). Pure-governance K3 fold (`certVerdict = allOf([pin_match, chain_valid, not_expired, revocation_fresh])`); revocation-unknown→DENY by the algebra; every missing/errored/throwing factor defaults to `0`; out-of-domain side-signals throw a fail-closed `SecurityTrap`. Reuses `vAnd`/`allOf`/`decideAtBoundary` verbatim (no new crypto, no ASN.1/OCSP parsing). Adversarially verified (workflow `wjwg2fari`, 4 lenses: 3 clean, 1 test-gap closed with 5 SEC-002 mutation guards). Commits `f9060df` (gate) + `37c57d4` (docs/%-audit). **NOT yet wired into `kernel.ts:307` live admission (guide step 5 = the next #1 roadmap item).** This supersedes the "Awaiting owner go: build S1 cert-gate" item below. R&D follow-on filed to the bridge as `tasks/0078` (OCSP staple-caching for `revocation_fresh` availability). See `galerina-roadmap-and-percent-audit-2026-06-23.md`.
  - *(history) Was ⛔ OWNER-LOCKED 2026-06-22* pending the owner's transport R&D; that R&D is now done + absorbed + rule-audited → lock lifted same day.
  - **R&D decision-support for B8 filed 2026-06-22** (owner's notes `notes/41-tritmesh` + `notes/42-auth` = the
    "TLSTP" transport+auth series, the R&D behind this lock): `galerina-tlstp-transport-auth-rnd-2026-06-22.md`
    (18-agent workflow `wi3py3913`, adversarially verified). Headline: ~75-85% RE-DERIVES shipped architecture
    (content-addressed signed admission, deny-by-default caps, K3 conjunctive gate, anti-downgrade floor, KEM-DEM,
    capsule macaroon caveats — all shipped/decided; cite, don't rebuild). 3 hard tensions: (1) "Ternary Ephemeral
    Ratchet" folding analog `E_ternary` into the KDF = HARD crypto-on-core violation → REFUTE; (2) continuous float
    trust `T_c` as the gate CONFLICTS with discrete fail-closed K3 → telemetry-only, discretize via vAnd; (3)
    in-sandbox-TLS-termination "mathematical security" rests on DRCM/DSS.wasm (115-byte stub) = aspirational-HW.
    13 owner decisions tabled; net-new-buildable lead = the **K3 cert-validation gate** (re-R&D 0002). B8 build
    decisions (WASI-vs-raw-bytes=raw per 0058; legacy=prefer-proxy; morphing=opt-in; SNI=ECH+OHTTP; downgrade=Noise
    pattern) all in the doc §"B8/HTTP guidance". Crypto stays Binary; photonics feed K3 verdict only. No code written.
  - **Worker dones 0065/0066/0068 ABSORBED 2026-06-22** → `docs/Knowledge-Bases/rd-absorbed/rd-tlstp-transport-auth-cluster-2026-06-22.md`.
    0065 = TLSTP digital-core spec (5 survivors S1-S5: K3 cert-gate · asymmetric KEM-rekey ratchet+PCS · digital-FEC-under-AEAD ·
    Recovering-FSM-above-K3 · opt-in morphing). 0066 = B8 adapter design (request path wire→raw-byte-shim→verifyWasm→fuse→K3→flow;
    first-3-to-build; tiered). 0068 = governance for REGULAR HTTP/SSL APIs (MITM/SSRF/token/response threat table; over-someone-else's-PKI).
    **All 3 converge on the same BUILD-FIRST: the K3 cert/channel-validation gate (S1)** — revocation-unknown→DENY over a
    library-validated chain, works for BOTH bespoke TLSTP and vanilla third-party HTTPS, zero new crypto. Owner-gated (B8-adjacent).
    8 TLSTP clusters all have R&D numbers (1→0066,2→0065+#12,3→0069,4→0065,5→0065,6→0070,7→0066+0068,8→0052/0055/0058).
  - **ALL 6 worker dones + the hub workflow now LANDED + explained 2026-06-22** → narrative explainer
    `docs/Knowledge-Bases/galerina-transport-auth-research-explained-2026-06-22.md` (use/no-use disposition table for EVERY
    finding, both directions). 0067 boundary+prove-maths audit: **13/14 crossings fail-closed**; the ONE fail-open =
    bare flow-param trusted-by-default (`value-state-checker.ts:1162-1191`) → fix = **34B routeDecl auto-taint** (34A
    `tainted` discharge already ships); **next proof = promote 0014-C3 overflow-equivalence SAMPLED→Z3-PROVEN** (proof
    already prints `[PROVEN]`, just delegate) + apply stale-claim corrections. 0069 DTM = degrade-only K3 telemetry
    (No-Coercion proven, codomain {−1,0}, rides 0050 exporter). 0070 photonic TamperTrust resolver (deviation→trit→vAnd,
    `cnf`-row under digital sig; optical front-end aspirational-HW). **9 findings ADOPTED, ~8 REFUTED (each w/ a digital
    replacement), rest HW-gated.** Rule-audit `wd7f3ccri` = rules genuinely used (2 minor cite notes, one resolved:
    `build/dss-supervisor.wasm` really is 115 bytes; 0068 `verifyWasm`→`wasm-runtime.ts:99` fixed in the absorbed doc).
    NEW follow-up build items: **34B routeDecl auto-taint** (close fail-open), **0014-C3→Z3** (promote proof).
  - **✅ TRANSPORT/AUTH R&D PHASE CLOSED 2026-06-22 (owner: "all R&D done").** Full closure: every open thread from
    0065-0070 harvested (`wnqemkxny`) + dedup-clustered → **closure tasks 0071-0074 queued in the bridge** for the
    owner's manual R&D session (0071 capsule signing-spec reconciliation · 0072 prove-maths closure incl. 0014-C3→Z3 ·
    0073 R&D-record hygiene · 0074 = CLOSURE INDEX manifest). **Paper-worthiness** of 0065-0070 (`wuyrn9956`,
    prior-art-verified) = **0 papers** (consistent with the standing 0-flagship strategy); 3 defensive-pub candidates
    (no-coercion-K3, prove-maths-methodology, crypto-on-core-refutations — all known-results), 1 not-publishable
    (TLSTP=named RFCs); only future paper path = a MEASURED availability/false-deny negative (K3 hard- vs soft-fail).
    See [[galerina-ip-paper-strategy]]. **Awaiting owner go (build/IP, held):** build S1 cert-gate (B8 unlocked) · seed
    the 3 defensive-pub notes. New KB doc this phase: `galerina-transport-auth-research-explained-2026-06-22.md`.
  - **✅ SHUTDOWN-CLOSE 2026-06-22 (owner: per-finding docs + graph/audit/benchmark + push, then pause).** Authored
    **8 per-finding KB build-guides** (maths-in-detail + worked examples + the hard build path) via workflow
    `weo2wrl1p` — `galerina-tlstp-{s1-cert-gate, s2-kem-ratchet, s3-digital-fec, s4-recovering-fsm, s5-morphing-frames,
    0069-dtm-degrade-only, 0070-tampertrust}.md` + `galerina-b8-governed-transport.md` + the overarching
    **`galerina-tlstp-build-guide-index.md`** (the ordered hard path, Phase 0→5 + B8). Maths spot-verified rigorous
    (S1 K3-lattice soundness proof; S3 Reed–Solomon MDS over GF(2⁸)). **R&D coverage confirmed COMPLETE for TLSTP +
    B8** (design/build R&D done; residuals are build-execution + substrate #102-106, not R&D gaps). **Full benchmark**
    run (exit 0) → `galerina-benchmark-snapshot-2026-06-22.md` (honest scoreboard: governed interp ~10³–10⁵× slower than
    native = expected; 14 comparable unit-aligned, 3 flagged-incomparable). Graph re-run (3796 nodes); audit sweep
    clean (provenance green, coverage 0 holes, lint 178 `--soft` baseline). All committed + **pushed to origin/main**.
    Then PAUSED for shutdown.
  - **Benchmark snapshot CORRECTED 2026-06-22 (`f60a0d9`):** the suite's `normThroughput` OVER-counts galerinaPassive
    on reduced-work benches (binary-trees count-only → shows Galerina 273× *faster* than Rust — not credible). Snapshot
    now uses native `operationsPerSecond` (reliable) + Galerina raw rates separately; clean Galerina-vs-native ×slower
    needs workload-equivalence (R&D 0039). See [[galerina-benchmark-suite]]. **All outstanding documents committed**
    (generated reports CODE_INDEX/REGISTRY/coverage/graph + `results/latest.json` + owner edits to
    `workspace.lindex`/`api-protocol-rest/index.spore`). Excluded by design: `_scratch-effect006.mjs` (WIP scratch),
    nested `galerina-devtools-project-graph/` repo, generated build JSON + test temp dirs.
  - **✅ CLOSURE CLUSTER 0071-0077 DONE + ABSORBED 2026-06-22** → `docs/Knowledge-Bases/rd-absorbed/rd-tlstp-closure-0071-0077-2026-06-22.md`.
    Worker completed the ENTIRE closure/verification queue. **0071** capsule signing-spec reconciled to one method
    (direct `CBOR(Sig_structure)`, no pre-hash, RFC 9964) — **the 3-edit PRODUCTION fix APPLIED this session** to
    `packages-galerina/galerina-ext-tmf/spec/governed-trust-capsule-v0.md` (§8 steps 4/5 + canonical-method blockquote;
    unblocks capsule reader #12). **0072** prove-maths closure: **7 verdicts SAMPLED/ASSERTED→PROVEN** (0014-C3 via
    Z3; div/rem `X==X` → real cross-encoding; 0031-C1/C3/C7, 0022-A4/B5 vs shipped dist; 0059 L1/L3/n-ary 18 SMT);
    0024-C2/C4 stay EXCL-SLV + X1 EXCLUDED (honest). **0073** record-hygiene (4 stale corrections + cite re-anchors +
    2 new 0054 proof scripts 24/24+23/23). **0075** 3 defensive-pub notes WRITTEN into `Galerina-Patens/` (note-01/02/03,
    novelty-disclaimed) — **NB Galerina-Patens is NOT a git repo (un-versioned; git-init = owner decision).** **0076**
    measured-negative bench done → **borderline-NO even reframed** (re-derives Web-PKI soft-fail consensus). **0077**
    Kleene-lattice unify → **ADOPT-WITH-CHANGES** (per-axis provenance; category-conflation real: ill-typed = structural
    reject ≠ policy DENY; INDETERMINATE must be ADDED). Bridge tasks 0001-0077 all done; R&D side fully closed.
  - **Note-41 (TritMesh monolith/data-arch) dedicated build-guide authored 2026-06-22** (owner-requested parity with the
    0065-0070 set) → `docs/Knowledge-Bases/galerina-tritmesh-monolith-data-architecture.md` (maths + examples + hard path;
    honest tiering — mostly re-derive/refute/HW-gated: govern-don't-absorb content-addressing SHIPPED, arena/SoA SHIPPED
    (0055), edge-client chunk→E2EE→CID data-plane + tree-walker-into-WASM (#125) = NET-NEW, in-sandbox isolation =
    aspirational #102-106, key-in-.tmf + semantic-clustering-on-trits = REFUTED). **`Galerina-Patens` git-init'd**
    (`3e69b23`, branch main, README + 3 defensive-pub notes now version-controlled; **no remote** configured yet).

**Filed / decided 2026-06-22 (owner session):**
- **#201 → built as a NEW code `SPORE-EFFECT-006 OVERDECLARED_EFFECT`** (error, ALL profiles), NOT an escalation
  of the overloaded `SPORE-EFFECT-002` (owner-directed de-overload). `002` now carries ONLY the transitive-missing
  (soundness) case. Owner chose strict-all-profiles, so the build must also fix every over-declared fixture/example.
- **#213 — SPORE-* diagnostic taxonomy audit** ✅ **AUDIT DONE 2026-06-22** (build paused for it). Full report:
  **[galerina-diagnostic-code-taxonomy-audit-2026-06-22.md](galerina-diagnostic-code-taxonomy-audit-2026-06-22.md)**.
  All 336 `SPORE-*` codes / ~90 families swept (7 auditors + adversarial verify); **~30 confirmed diseased** via
  5 recurring root causes (R1 overloaded · R2 split-across-codes · R3 divergent duplicate defs across packages
  · R4 inline-no-constant · R5 dead/unregistered). **Most alarming:** `SPORE-MEMORY-001..007` are dead yet wired
  as production-BLOCKING gates (false enforcement). P0 security overloads: SECRET-002, PRIVACY-002, GOV-004,
  MONO-001, INV-002, ASSIMILATE-002, NET-001/002. The #201 `EFFECT-006` split aligns with the policy; devtools
  `effect-graph.ts` still has the old inverted EFFECT-002 (must re-sync). **Remediation 🔲 gated on owner.**
  Non-`SPORE-*` namespaces ✅ DONE (`wdjnqlw27`, §6): **`ERR_*` is diseased too — 2 security HIGHs**
  (`ERR_BRIDGE_UNATTESTED` collapses ~5 attestation failures incl. misconfig-vs-forgery; `ERR_BRIDGE_DISPATCH_FAULT`
  conflates bridge-crash vs determinism-integrity breach) + a 3rd unused naming scheme (`Galerina-ERR-*`). **CBOR
  tags + HTTP `KernelErrorCode` are CLEAN** (single-source helpers — the target shape). HTTP §6b: 2 minor
  consistency notes only (backpressure 429-vs-503; telemetry hand-rolls statuses).
- **#215 — diagnostic-registry conformance lint** (the durable fix). **🔶 STAGE 1 BUILT 2026-06-22** —
  `scripts/audit-diagnostic-codes.mjs`, a re-runnable, CI-gateable scanner (exit = #violations). Baseline:
  V1 overload **23** (incl. all P0 security codes), V2 collision **1**, V3 severity-vocab **17**, V4
  multi-severity **3**; it independently re-found the manual audit + surfaced extras (GATE-001, TYPE-008/023,
  GRAPH-001/VALUESTATE-005 case-dups). **Pending hardening:** free-text `ERR_` modes, dead/unregistered
  cross-ref, the `MEMORY-*` dead-production-gate check, then flip to CI-enforce. Remediation stages then clean
  families until each category → 0. (Remediation being done in token-staged increments at owner's "next".)
- **Code-index dev tool** (`scripts/code-index.mjs`, owner-requested 2026-06-22): re-runnable map of EVERY
  code (`SPORE-*`/`ERR_*`) → definition site + names + severity + every emit/test/doc location. **Query
  `build/code-index/CODE_INDEX.md` instead of grepping** (token-saver); `node scripts/code-index.mjs`
  regenerates (+ a full-location `code-index.json`). Quantified the disease: **268 codes emitted with NO
  exported constant** (R4), **462 doc-only/phantom mentions** (R5 / doc-drift), 3 dead-defined — across 444
  src-real codes (364 SPORE + 80 ERR, 157 families). Complements the #215 scanner (scanner = gate; index = map).
- **#216 — WASM build-provenance metadata** (owner-requested 2026-06-22): every `build/*.wasm` (+ its
  `.lmanifest`) should carry build provenance — Galerina version (`version.json`), git commit / package version,
  repo URL, build timestamp, author (git config) — alongside the existing `sourceHash`/`governanceSignature`/
  `signedAt`. Extend `manifest-generator.ts` + the `galerina build` path. Verify-first: `signedAt`/`keyId`/
  `sourceHash` exist today; version/commit/repo/author likely don't. 🔲
- **#217 — Capability/syntax index dev tool** (owner-requested 2026-06-22; applies the build-tools-to-save-
  tokens rule). **SCOPE WIDENED 2026-06-22 to the FULL language surface** (owner: "full scope"): operators
  (arithmetic/comparison/logical/bitwise-rejected), keywords + constructs (flow/secure/guarded/pure, match,
  for, where, trap, static, bitfield, import…), **governance blocks** (contract/effects/invariant/limits/
  gate/access/guard/policy/assuming/resilience/observability/secrets/epilogue), **Tri-Pipe / substrate /
  hardware** directives (`hardware()`/`substrate{}`/`compute target`/binary|hybrid|photonic tiers), stdlib
  functions, effect families, types (Int/Float/Bool/Tri/Decision/Result/Option/Tensor/Brand/protected/Secret),
  and CLI commands. Each capability → (a) WHERE its logic lives (lexer/parser/type-checker/effect-checker/
  interpreter/wat-emitter), (b) where it's tested, (c) where it's demonstrated (examples corpus), (d) its
  governing diagnostics (cross-link to the code-index). Like `scripts/code-index.mjs` but for capabilities.
  🔲 scoped, build on go (broad/fuzzy extraction — wants a clean token budget).
- **#218 — Coverage cross-check framework** (owner-directed 2026-06-22, motivated by the "codes" near-miss):
  for EACH governed dimension build a comprehensive index (codes ✅ `code-index`; capabilities/syntax = #217;
  flows/deps ✅ project graph; governance rules; effects; non-SPORE namespaces), then **cross-check each audit
  against its index bidirectionally** — (1) every index entry was audited (no blind spots), (2) every finding
  maps to an index entry (no phantoms), (3) the index ingests ALL sources incl. docs/README/registry (the
  Stage-D lesson, not just `src`). Output `coverage-<dimension>.md` reports; wire green ones into phase-close.
  **🔶 codes dimension BUILT + RUN 2026-06-22** (`scripts/audit-coverage.mjs codes` + phase-close `--soft`):
  graph-the-audit, deterministic. First run: 930 indexed vs 67 registry → 317 src-real SPORE-* registry-uncovered
  + 40 dead candidates (≥8 false-positive from a code-index result-object emit-detection gap) + 0 phantoms;
  report `build/coverage/coverage-codes.md`. Other dimensions (#217 capabilities, flows/deps) pending.
- **code-index emit-fix (follow-up #1, 2026-06-22, adversarially verified `wwyui0w35`):** the indexer now
  counts result-object/constant emits (`code: ERR_X`) + multi-line `throw new XError(\n CODE,…)` windows, and
  EXCLUDES comments + TS type positions (`readonly code: "SPORE-X"`, `"X"|"Y"` unions) — the verifier caught 7
  over-match false-emits (type-decls/comments incl. the indexer's own) which are now fixed. Cleared all 8
  ERR_REGISTRY_* false-"dead". **Two deferred follow-ups (verifier-specified):** (a) **const-id→code
  resolution** — `code: SPORE_BOOL_BOUNDARY_001_FAILED_CLOSED` (unquoted SPORE *constant*, ≠ code string) is still
  unrecognised, so `SPORE-BOOL-BOUNDARY-001/002` show as false-"dead" despite live production callers
  (`bool-enforce.ts validateBoolBoundary`); needs a two-pass const-identifier→code map. (b) **CODE_RE
  truncation** — `SPORE-PROFILE-005B` is truncated to `005` (the `[0-9]`-terminated pattern drops a trailing
  letter). Both are code-index accuracy fixes (dev-tool, not production). 🔲
- **UNIVERSAL-COVERAGE REQUIREMENT (owner 2026-06-22, hard rule):** everything in Galerina must be indexed by
  ≥1 audit; an orphan (covered by NO index/audit) is a gap. End-state: `audit-coverage` shows 0 orphans + 0
  phantoms per dimension. Folds into #218.
  **✅ codes dimension MET 2026-06-22 (cluster ① fixed):** built `scripts/gen-code-registry.mjs` — the DERIVED
  code registry (std #10, generated from the code-index → every code registered BY CONSTRUCTION), wired into
  phase-close. `audit-coverage codes` now reports **930/930 catalogued, NO ORPHANS, 0 coverage holes**. The
  "317 registry-uncovered" were NEVER orphans — reframed as a governance-rules.md CURATION backlog (317) +
  doc-drift (468 phantom) + R4-inline (288) + RESERVED-dead (32), all tracked for incremental adoption, none
  exit-failing. Catalog: `build/code-registry/REGISTRY.md`. Remaining clusters: ② phantom-triage (DOC-004),
  ③ RESERVED wire-or-retire, ④ governance curation; + the const-id false-dead (BOOL-BOUNDARY-001/002).
- **#219 — research-grounded Audit Coverage & R&D Standards** (owner 2026-06-22): the standards we require are
  benchmarked against best-practice + production examples from mature projects (Rust diagnostic registry + UI
  tests · Roslyn/Clang analyzer groups · ESLint docs+tests-per-rule · Cedar/OPA policy coverage · SLSA/in-toto/
  Sigstore provenance · proof-gated research). Output: a Galerina "Audit Coverage & R&D Standards" doc each
  enforcer (#215/#218/ENV/SEC/BLD/DOC) is measured against. **✅ Research DONE + standards doc written 2026-06-22**
  (`wb3hevspu`, 7 agents): **20 grounded standards** in [galerina-audit-coverage-and-rd-standards.md](galerina-audit-coverage-and-rd-standards.md)
  — 2 anchors (universal-coverage; fail-closed-gate-test) + registry-completeness/ID-space/atomic-scaffolding,
  per-rule triad + pos/neg coverage + exhaustive snapshots + executable-doc-examples + derived-catalog,
  policy-coverage-threshold, mutation/property/differential/fuzz/proof/model-checking, and graded-provenance +
  identity-bound-keys + reproducibility-freshness. The Rust `tidy` bidirectional `E####` reconcile = our exact
  universal-coverage model. Each maps to an enforcer; adoption is incremental (drive each metric green → flip to
  CI-enforce). 🔶 remaining: adopt the standards into the enforcers.
  **Trigger: run as an end-of-roadmap pass over ALL items (finished + unfinished); gated to "once the current
  roadmap is finished."** #217 is a prerequisite (capabilities/syntax index). Full plan:
  [galerina-coverage-crosscheck-methodology.md](galerina-coverage-crosscheck-methodology.md). 🔲
- **Binding engineering processes (owner 2026-06-22, "graph it, don't do it manually" — locked STRICT):**
  All tool-based; the LLM builds/extends the detector and reads its output, never hand-audits.
  - **TASK-ENV-001** — generalize the #215 scanner into an extensible pre-commit/CI **convention-linter gate**
    for ALL codebase conventions (`scripts/lint-conventions.mjs`: a check-registry, aggregate report,
    exit = total violations; wired into `run-phase-close`). PRINCIPLE: no convention is "binding" until a tool
    enforces it (else it's advisory and rots). The umbrella the other gates register into.
  - **TASK-SEC-002** — **mutation / red-team test per gate**: ✅ **v1 BUILT 2026-06-22** — `scripts/audit-mutation.mjs`
    (Stryker-style). For each registered fail-closed gate it RE-INTRODUCES the hole (a source mutation), runs that
    gate's adversarial test, and asserts the test now FAILS (mutant KILLED); a SURVIVING mutant = the test doesn't
    guard the hole. v1 catalog = the 3 B5a registry-index fail-opens (**truthy-verifier `!result`** — the exact one
    the review caught — **replay floor `>`→`>=`**, **duplicate `>1`→`>2`**); all 3 KILLED against production.
    **git-backed SAFETY**: target files must be git-clean before mutation; reverted with `git checkout` in a finally;
    post-run git-clean assertion; final clean rebuild. Registered in `lint-conventions` as a **heavy** check (run with
    `--full` — rebuilds per mutant ~40s; the fast phase-close sweep skips it). +3 hermetic fixture tests (tmp git repo,
    proves KILL + SURVIVE + git-safety; tooling suite now **23/23**). Follow-on: extend the catalog to fuse-loader
    gates 1–3, secret-egress, and i32-overflow as those get adversarial tests. `fast-check` available for fuzz mutants.
  - **TASK-BLD-003** — **artifact provenance + freshness** (folds in #216): ✅ **v1 BUILT 2026-06-22** —
    `scripts/lib/provenance.mjs` (`writeProvenance()` stamps a sidecar `provenance.json` = {tool, gitCommit, builtAt,
    node}) wired into the 3 JSON generators (code-index, gen-code-registry, kb-index); `scripts/audit-provenance.mjs`
    gate flags **MISSING / UNSTAMPED / STALE** (a source mtime newer than the artifact). Registered in
    `lint-conventions` CHECKS + settings.json; runs in phase-close via the umbrella (step 5b, after the step-5a regen,
    so a clean tree is green). +3 fixture tests (`dev-tools-scripts.test.mjs`, now **29/29**). Verified green right
    after regen; correctly reports STALE when sources are edited post-regen. v2 (later): extend to graph/.wasm/.lmanifest
    + a gitCommit-ancestor check.
  - **TASK-DOC-004** — **doc↔source drift detector**: ✅ **v1 BUILT 2026-06-22** — `scripts/audit-doc-drift.mjs`,
    registered in `lint-conventions` CHECKS + settings.json + 4 fixture tests (`dev-tools-scripts.test.mjs`, now
    **20/20**). v1 scope = the #1 stale class: doc "living metrics" — GLOBAL test/package COUNTS — vs the
    `version.json` authority; low-noise (living docs only — dated-filename snapshots + change-log/superseded/
    verified:/→ lines + per-package counts all exempt). Surfaces **24 living-doc count-drift** claims today
    (build-roadmap/SOT/README/CHANGELOG/roadmap.md/fault-tolerance/ledger banners). KNOWN v1 limit: historical
    table-rows *inside* living docs still counted → **v2 = opt-in `<!-- LIVE:testCount -->` markers** (Rust-tidy
    style, zero false positives); the real remedy for the drift itself is **#150 CI auto-count**. Does NOT yet do
    "X shipped" semantic claims (harder; v3).
  Build sequence: **ENV-001 (umbrella ✅) → DOC-004 (✅ v1) + BLD-003 (✅ v1) → SEC-002 (✅ v1)**. **The 4-process
  tooling program is now COMPLETE (all four v1 built).** Memory:
  [[feedback-tooled-engineering-processes]]. Sit alongside #218 (coverage cross-check) as the QA-tooling program.
- **Full code review 2026-06-22 (`wn8v30euh`, 6 agents): VERDICT = expand graph scope, but FIX BEFORE ADD.**
  3 prod suites green (3684+80+90). Two real problem areas found:
  - ✅ **B5a kernel fail-opens FIXED** (`b0428b0`, kernel 87/87): truthy-verifier admit, multi-module
    registryCheck bypass, issuedAt replay/rollback + canon/schema/duplicate hardening + 7 adversarial tests.
  - ✅ **Audit-toolchain regex bugs FIXED (`6141bac`):** NEW shared `scripts/lib/codes.mjs` (one regex +
    `scripts/tests/codes.test.mjs` 7/7 — first script test) fixes (a) 005B truncation, (b) range phantoms,
    (e) the divergent audit-coverage regex. (c) const-identifier resolution → the **28 false-deads are now
    correctly LIVE**. `dead` reconciled across all tools = defined AND truly-unreferenced; new `referenced`
    status for def-no-detected-emit-but-tested. **Registry now live:37 · referenced:11 · dead:0 — the RESERVED
    list is EMPTY/SAFE** (was 32, mostly live/tested). (d) object-literal-def was attempted then REVERTED
    (over-corrected into 95 new false-deads); live-vs-inline accuracy is a noted lower-priority backlog.
  - 🔲 **New tooling (after the scanner is trustworthy):** project-graph coverage dimension in audit-coverage
    (layering/dependency-direction + R3 cross-family collision — the graph is indexed but never audited);
    **SEC-002 mutation/fail-closed detector** (slot reserved in lint-conventions; would have caught the B5a
    fail-open); then #217 capability/syntax, effects, contract-clause coverage, DOC-004.
  - ✅ **Script tests DONE:** `scripts/tests/codes.test.mjs` (7, shared-regex) + `dev-tools-scripts.test.mjs`
    (13: fixture-tree subprocess tests of code-index/gen-code-registry/audit-coverage — trailing-letter, const-id
    emit, multi-line throw, comment/type-decl exclusion, dead-detection, coverage-holes — **+4 DOC-004 doc-drift**).
    **20/20**, wired into phase-close (`f64ba52`). lint-conventions crash-as-tool-error FIXED (`f6c09cc`). All 5
    dev-tool scripts (code-index/gen-code-registry/audit-coverage/audit-doc-drift + the codes lib) have test coverage.
- **RULE (binding, owner 2026-06-22):** if a task can be made cheaper by building/extending a dev tool, do
  that — and consider it at the START of every task. Memory: `feedback-build-tools-to-save-tokens`.
- **#214 — framework developer-tests folder** (owner-raised): the B1 scaffolder emits a `tests/` dir for
  developer-authored tests, kept SEPARATE from generated / contract-driven tests (R&D 0016) so a regen never
  clobbers hand-written ones. Folds into the framework B-series. 🔲
- **#201 SCOPE CORRECTED 2026-06-22 (the strict EFFECT-006 build revealed the real shape):** of 61 flagged
  flows, MOST are NOT over-declarations. Three categories — (A) **effect-checker mapping gaps** (~35: the flow
  DOES use the effect but the inference regex misses the call — `EmbeddingModel.embed`/`.classify`/`.forward`
  not matched by `\w+Model\.(run|infer)`; `PaymentGateway.charge` not matched by `\w+Payment\.`; no
  `process.spawn` pattern); (B) **pii/phi** (~10) which are TYPE-driven (writing a `protected`-PII-typed value),
  not name-mapped — needs new type-aware inference; (C) **true over-declarations** (few — e.g. 152 declares
  `database.write` but only parses a file; 151 declares `audit.write`, never audits). **Owner decisions:**
  full principled fix + **ALL effects operation-inferred** (no declarative exemption — pii/phi must be inferred
  from a protected-type write op). **Build sub-steps (held uncommitted until ALL 61 green):** ①extend
  `EFFECT_CALL_PATTERNS` for A (AI `\w+Model\.\w+`, payment `\w*Payment\w*\.`, `process.spawn`); ②NEW type-driven
  pii/phi inference (a write/read op on a protected PII/PHI-branded value → pii/phi.*; needs a brand→family map
  — likely a micro owner-decision on which brands = pii vs phi); ③remove the genuine over-declarations (C);
  ④update the 2 warning-asserting unit tests → EFFECT-006 error; ⑤port the over-declaration check to the
  Stage-B `effect-checker.spore`; ⑥register `SPORE_EFFECT_006` metadata + diagnostics-spec doc. EFFECT-002 keeps
  ONLY the transitive-missing case. Convergent #1 of 0062∧0063; folds into the #213 SPORE-* taxonomy audit.
- **B5a DONE 2026-06-22:** signed central registry index built + wired (kernel `registry-index.ts` +
  `fusePackage` Gate 2c `registryCheck`; fail-closed; 8 `ERR_REGISTRY_*`; 80/80). Commits `65d8ac9` (module)
  + `1ecef1f` (wiring). The supply-chain layer of the certified-package-registry vision. Remaining greenlit:
  #201 (blocked on owner pii/phi map), #202 transitive mask-⊆ (effect-checker — after #201 to avoid stash conflict).
- **Greenlit this session:** #201 (build now), B5a signed registry index, #202 transitive mask-⊆. Ordering
  rule (owner): build the earliest-in-the-runtime-pipeline gated item first. Loop may attempt careful-code
  (#200 etc.) with full WASM-vs-walker verification, backing out + flagging if anything looks off.
- **#201 STATUS 2026-06-22 (classified + decided; build checkpointed at green pending owner map):** the strict
  EFFECT-006 build flagged 39 example flows; an 8-agent workflow classified them **A=24 inference-gap · B=11
  pii/phi · C=13 true-over-decl** (full plan: [galerina-effect006-build-plan-2026-06-22.md](galerina-effect006-build-plan-2026-06-22.md)).
  Surfaced findings: the EFFECT-006 observed-set skips local `fnDecl` bodies + has narrow receiver patterns +
  no cross-flow callee propagation (→ category A is a real inference fix with global blast radius), and a
  genuine rule conflict (EFFECT-006 vs negative-test/governance-mandated effects). **Owner decisions:** D1 =
  **suppress EFFECT-006 when the effect is already invalid-named (EFFECT-004/005) or governance-mandated
  (GOV-002/AUDIT-001)**; D2 = **owner will specify the pii/phi brand→family map** (BLOCKS category B / sub-step
  ②). Build split: **Part 1** (A inference + C example fixes + D1 + ⑥ metadata + ④ tests + interim pii/phi
  exemption) — unblocked but large/risky (cross-flow propagation + D1(b) governance-suppression are non-trivial);
  **Part 2** (populate map → ② type-driven pii/phi inference → remove interim exemption → ⑤ Stage-B port). WIP
  (① AI/payment patterns + EFFECT-006 emit) is in `git stash`; baseline re-greened (3684/0). **NEXT: owner
  provides the pii/phi brand map, then execute Part 1 + Part 2 as one verified push.**

---

## 7. R&D adoption — `.tmf` / tri-encryption (2026-06-16)

Full review: **[galerina-rd-adoption-2026-06-16.md](galerina-rd-adoption-2026-06-16.md)**. Both R&D tracks are
R&D-only; the `.tmf` engine + confidentiality build are **gated on owner go**. Crypto stays the engine layer.

**Usable in Galerina NOW (govern-don't-absorb) — proposed:**
| # | Task | From | Status |
|---|---|---|---|
| 203 | **Verify-before-decrypt key-release pattern** — `tests/patterns/pattern-10-verify-before-decrypt-gate.spore` (collapse/authorize/keyRelease, fail-closed). `galerina check` clean + runs on WASM (collapse(0)=-1; keyRelease(t,t,1)=1; keyRelease(f,t,1) & (t,t,0)=-1). Galerina governs confidentiality; crypto stays engine-side. | tri-enc U1 | ✅ **LANDED 2026-06-16** |
| 204 | **"No cleartext semantic embedding across a trust boundary" rule** — candidate `SPORE-PRIVACY-*` data-exposure diagnostic (unencrypted embedding/attribute vector crossing egress/wire = violation). | tri-enc U2 (verdict 5) | 🔲 proposed (MED) |
| — | Strengthen `SPORE-SUBSTRATE-001` substrate KB with the crypto-on-core evidence + extend wording to "encryption/hashing/signatures" (`future-substrates` contradiction already ✅ fixed). | U3 | 🔶 partial |
| — | Ground `fp4_block` `PrecisionTechnique` with the verified NVFP4 byte facts (16×E2M1 + 1-byte scale = 9 B/block, lossy, not-ternary). `TECHNIQUE_BITS fp4_block=4` already correct. | U4 | ✅ done (comment) |

**NOT usable / gated:** `.tmf` Rust engine · KEM-DEM impl · TMX/container/NVFP4 specs · ML-DSA-65 hybrid spec (feeds #34 when it lands) · FFSM Phase 2 · MeshQL DB layer.

## 10. Outstanding R&D + To-Dos catalog (2026-06-23)

The complete, current catalog of everything outstanding — R&D gaps, designed-but-unbuilt items, build items, and
**missing/incomplete packages** — lives in **[galerina-outstanding-rd-and-todos-2026-06-23.md](galerina-outstanding-rd-and-todos-2026-06-23.md)** (single source of truth). Highlights:

- **R&D dispatched to the bridge:** `0078` OCSP-staple · `0079` framework-structure · `0080` memory-cleanup ·
  **`0081`** component photonic/tri gap verdicts · **`0082`** packages photonic/tri + **missing/incomplete/stub package status** ·
  **`0083`** closed-capabilities photonic/tri · **`0084`** security-standards × K3 (**PCI/DSS + full OWASP + CWE/NIST/MITRE/SLSA**) ·
  **`0085`** **RAG-vulnerabilities rulebook-curator** (`E:\projects\RAG-vulnerabilities`) → reconcile `GALERINA_SECURITY_RULEBOOK` with the SPORE registry + RAG/LLM-retrieval threat class.
- **R&D designed (build pending):** [`contract.permissions{}`](galerina-contract-permissions-design.md) (V_PERM + SPORE-PERM-001..006) ·
  DRCM degrade-only operand · CBOR SubstrateAttestation Tag-418 · core-economics/core-security photonic lanes — see [galerina-architecture-rd-2026-06-23.md](galerina-architecture-rd-2026-06-23.md).
- **Top build items:** ① wire S1 cert-gate into `kernel.ts:307` (closes the audit's only HIGH) · ② verify+fix WAT codegen fail-opens #163/#165 · ③ tainted-by-default entry params · ④ graph auto-discover.
- **Missing/incomplete packages:** `framework-api-server`/`-example-app` have no `src/` (build); the `data-*/web-*/db-*/target-{js,wasm,native,gpu}` stubs need a build-vs-stay-stub + photonic/tri verdict (R&D 0082).
- **Phase-4 audit:** no critical/exploitable, no regressions; one HIGH (`kernel.ts:307` presence-only auth) → closed by build ①.
