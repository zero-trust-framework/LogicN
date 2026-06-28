# Galerina — Phases 41–60 Roadmap

**Primary goal: Runtime written in Galerina at 100%**
**Current state (after Phase 40): Runtime = 25% | 2,791 tests | 0 failures**

---

## Completed baseline (for context)

| Phase | Delivered |
|---|---|
| 34 | verifyPasswordService.fungi — first live .fungi HTTP service. **Runtime = 25%** |
| 35 | Password.verify/hash — stable API facade (bcrypt now, Argon2 later) |
| 36 | Argon2id + Deno WebGPU GPU benchmark live |
| 37 | Password.migrate — auto rehash bcrypt→Argon2id on successful verify |
| 38 | Deno WebGPU: RTX 3050 Ti, 3.99M ops/sec — first real GPU number |
| 39 | GovernanceSignature Ed25519 — signProofGraph/verifyGovernanceSignature |
| 40 | Stage B executable — compiler.capabilities.fungi + lexer.fungi running |
| 41 | healthCheck.fungi (GET /health) + rateStatus.fungi (GET /rate-status) — second and third live .fungi HTTP services. **Runtime = 27%** |

---

## The 4 Streams (Phases 41–60)

These phases run across four parallel concerns that must advance together:

```
A: Deployment surface      — more live .fungi files, more runtime %
B: Stage B self-hosting    — Galerina compiling Galerina
C: Performance             — close the tree-walker black gap
D: Security/compliance     — post-quantum, hardware trust, OWASP complete
```

The Runtime % only advances on Stream A. Streams B/C/D are prerequisites or
parallel-value work. Phases are ordered to unblock each other correctly.

---

## Phase 41 — Second Governed HTTP Endpoint ✓ DELIVERED
**Theme: Runtime coverage**
**Runtime %: 27%**
**Stream: A**
**Status: Complete — 2026-06-01**

**Syntax additions implemented in Phase 41** (now canonical — documented in `galerina-grammar.ebnf` v1.1):

| Addition | Rule |
|---|---|
| `when` guard arms | `match score { when score >= 90 => return "critical" }` |
| Integer/string literal arms | `match code { 200 => return "ok" }` |
| Inline contract style | `contract {}` as first item inside flow body `{}` |
| `:` preferred return type | `pure flow foo(x: Int) : String` |
| `effects {}` optional | Omission on `pure flow` means no effects |
| Top-level public result types | `type FooResult = Result<X, E>` at compilation unit level |
| `else if` hard error | FUNGI-SYNTAX-010 — use `match` or sequential `if` |
| `unsafe let` at boundary | `unsafe let rawId: String = request.params.id` |

```galerina
// Phase 41 canonical style
type HealthResult = Result<Response, RuntimeError>

secure flow healthCheck(readonly request: Request) : Response {
  contract {
    effects { network.inbound audit.write }
    intent { "Liveness probe — returns runtime version, governance proof, and uptime." }
  }
  return {
    status: "ok"
    runtime: "galerina-stage-a"
    governance: "verified"
  }
}

route GET "/health" {
  response Response
  flow healthCheck
}
```

Also: `rateStatus.fungi` — returns current rate-limit counters for the IP.
Two new .fungi routes = ~2% runtime increment.

**Tests:** route parsing, healthCheck execution, multi-route server, JSON response shape.

---

## Phase 42 — wasmtime CLI + Standalone WASM Deployment
**Theme: Standalone deployment**
**Runtime %: 30%**
**Stream: A**

```bash
galerina build --target wasm-wasi -o verifyPassword.wasm services/auth/verifyPassword.fungi
wasmtime run verifyPassword.wasm
```

- Wire `--target wasm-wasi` flag in CLI → WAT emitter → WASM binary
- WASI HTTP shim: Node.js host shell feeds HTTP request → WASM stdin, reads response → stdout
- Cold-start target: <50ms (WASM binary, minimal init)
- Flush audit entries to file before shutdown (WASI `fd_write`)

**Why now:** Standalone WASM removes Node.js from the production path for pure flows.
Runtime % increases because the *WASM binary is compiled from .fungi source* — that IS
the runtime in Galerina.

**Research needed:** Confirm wasmtime 1.x WASI HTTP proposal status. Use shim if unstable.

---

## Phase 43 — Deno Deploy First Live Endpoint
**Theme: Production traffic**
**Runtime %: 32%**
**Stream: A**
**Status: Infrastructure ready — Deno adapter created, full bridge Phase 54**

- Deploy `verifyPasswordService.fungi` to Deno Deploy via `deno deploy`
- Audit → Deno KV (persistent, replicated)
- ProofGraph downloadable from `GET /governance/proof` → JSON
- Cold-start target: <100ms on Deno Deploy free tier

**Why now:** First external real traffic through a governed Galerina service.
Deno 2.8.1 is already installed. Deno Deploy WASM support confirmed.

---

## Phase 44 — ValueGraph Risk-Adjusted Routing Live
**Theme: Economics in production**
**Runtime %: 33%**
**Stream: A**

Wire `CostGraph.selectRoute` into the HTTP dispatch path so that routing decisions
are made by the economics engine, not hardcoded:

```galerina
secure flow routeRequest(readonly request: Request) -> Response
contract {
  effects { network.inbound audit.write }
  economics {
    prefer { target wasm }
    budget { max_cost_gbp 0.01 }
  }
}
```

- `CostGraph` reads `InferredEconomics` from the flow (Phase 33 auto-inference)
- Routes pure flows to WASM, effectful flows to governed CPU
- Log routing decision in audit event

**Why now:** The economics model exists (Phase 29). Connecting it to dispatch makes it real.

---

## Phase 45 — Bytecode VM Expansion (Records + Bool/Branch)
**Theme: Performance — close the black gap**
**Runtime %: 33% (perf, not Runtime %)**
**Stream: C**

Phase 33A telemetry revealed: `governance-cost` hits ⚫ because it falls out of
the integer bytecode VM (recursion, mixed types). Phase 33B target: widen the VM.

Expand `compileToBytecode` to handle:
- `Bool` opcodes: `OP_AND`, `OP_OR`, `OP_NOT`, `OP_EQ`, `OP_NEQ`
- Branch opcodes: `OP_JMPIF`, `OP_JMPIFNOT`, `OP_JMP` (for `if/else`)
- `String` scalar flow fast-path: small string compare + return
- Record field opcodes: `OP_FIELD_GET` with static slot index (Phase 33C)

Expected: `governance-cost` and `compute-mix` move from ⚫ to 🔴/🟡 or better.

**Tests:** semantic parity (optimised == tree-walker output), governance parity,
determinism, benchmark regression ceiling.

---

## Phase 46 — Stage B Parser Complete
**Theme: Self-hosting — syntax completeness**
**Runtime %: 33%**
**Stream: B**

`parser.fungi` currently handles flow headers only. Extend to parse:

- `contract { ... }` blocks (all sections: effects, economics, privacy, audit)
- Flow bodies: `let`, `mut`, `if`, `match`, `return`
- `fn` declarations inside flow bodies
- Record literals `{ field: value }`
- `route` declarations

Target: `parser.fungi` can parse all 223 CEC examples with 0 errors.

**Gate:** Stage B parser parity test suite — TS parser vs parser.fungi output on all CEC files.

---

## Phase 47 — Stage B Type Checker Stub
**Theme: Self-hosting — semantic layer**
**Runtime %: 33%**
**Stream: B**

`type-checker.fungi` — minimal type inference engine that:
- Resolves flow names to their declared return types
- Checks call argument counts
- Emits `FUNGI-TYPE-001` (UnknownType) and `FUNGI-TYPE-005` (InvalidCallArgType)

Not a complete type checker — a bootstrap stub that can validate simple flows
without needing the full type algebra.

**Why now:** Type checking is needed for Stage B to produce useful diagnostics
before the effect checker and governance verifier ports.

---

## Phase 48 — Request Body Taint Auto-Detection
**Theme: Security — HTTP boundary**
**Runtime %: 33%**
**Stream: D**

Currently `request.body` must be manually untainted. Auto-taint at HTTP boundary:
- Any value accessed via `request.body`, `request.params`, `request.headers`,
  or `request.query` is automatically `Tainted<String>` without explicit annotation
- No opt-out — this is the security invariant at the HTTP boundary
- FUNGI-TAINT-007: `UntrustedHttpParam` — fired when route param used without sanitiser

**Why now:** Phase 34 built the HTTP service. Phase 48 makes it safe by default.

---

## Phase 49 — Cache Scoping + Request Size Hardening
**Theme: Security — runtime hardening**
**Runtime %: 33%**
**Stream: D**

Two runtime security fixes identified in Phase 34 security review:

1. **LRU cache scoping per-request**: pure-flow cache must not cross request boundaries
   for flows that touch request context. Cache key includes `traceId`.
2. **Request size limit before governance**: current limit is checked after parsing headers.
   Move the 1MB body limit to the very first read event.
3. **Deployment profile: strict default** — production starts in `deterministic` mode
   unless explicitly configured otherwise.

---

## Phase 50 — Stage B Compiles First Complete Flow
**Theme: Self-hosting — first compilation**
**Runtime %: 35% (small increment: Stage B output runs)**
**Stream: B**

Stage B pipeline is now:
```
lexer.fungi → parser.fungi → type-checker.fungi → output IR
```

Milestone: compile `pure flow add(a: Int, b: Int) -> Int contract { effects {} } { return a + b }`
through the full Stage B pipeline and produce a GIR node that the Stage A executor
can run. Result must match Stage A output.

**This is the proof-of-concept moment for self-hosting.** Not a complete compiler —
but the first time Galerina code compiles Galerina code to something executable.

**Tests:** Stage B pipeline parity (output == Stage A output), 10 simple flows,
recursive flow, effectful flow, all produce matching results.

---

## Phase 51 — HTTP Capability Host Stub in Galerina
**Theme: Runtime in Galerina — capability layer**
**Runtime %: 38%**
**Stream: A**

The first internal runtime component expressed as a `.fungi` file:

```galerina
secure flow resolveCapability(name: String, request: Request) -> CapabilityResult
contract {
  effects { network.inbound audit.write }
  intent { "Resolve and validate a runtime capability by name." }
}
{ ... }
```

This replaces the TypeScript `CapabilityHost` class for the subset of capabilities
used by verifyPasswordService.fungi. The .fungi file IS the capability host for
those flows — not a wrapper.

---

## Phase 52 — Audit Writer in Galerina
**Theme: Runtime in Galerina — audit layer**
**Runtime %: 42%**
**Stream: A**

```galerina
// audit-writer.fungi
secure flow appendAuditEvent(event: AuditEvent) -> Result<Unit, AuditError>
contract {
  effects { filesystem.write audit.write }
  intent { "Append one JSONL audit record, fail-closed in production." }
}
{ ... }

secure flow buildFlowAuditEvent(flowName: String, ...) -> AuditEvent
contract { effects {} }
{ ... }
```

The governed audit path IS Galerina source. The TypeScript `audit-writer.ts` becomes
the Stage A bootstrap — Stage B will eventually replace it entirely.

**Why now:** Every governed execution writes audit events. Making the audit writer
a .fungi file directly grows the Runtime % by a meaningful amount.

---

## Phase 53 — Stdlib Core in Galerina (String, Int, Math)
**Theme: Runtime in Galerina — stdlib**
**Runtime %: 46%**
**Stream: A**

Express the most-called stdlib functions as `.fungi` files:

```galerina
// stdlib-string.fungi
pure flow String.contains(s: String, sub: String) -> Bool
pure flow String.startsWith(s: String, prefix: String) -> Bool
pure flow String.slice(s: String, start: Int, end: Int) -> String
...

// stdlib-math.fungi
pure flow Math.min(a: Int, b: Int) -> Int
pure flow Math.max(a: Int, b: Int) -> Int
pure flow Math.clamp(n: Int, lo: Int, hi: Int) -> Int
...
```

These are pure flows — they compile to WASM automatically and run at native speed.
The TypeScript implementations remain as fallbacks for the bootstrap period.

---

## Phase 54 — Route Dispatcher in Galerina
**Theme: Runtime in Galerina — HTTP layer**
**Runtime %: 50% 🎯**
**Stream: A**

```galerina
// route-dispatcher.fungi
secure flow dispatch(request: Request, routes: RouteRegistry) -> Response
contract {
  effects { network.inbound audit.write }
  intent { "Match incoming HTTP request to a route and execute the bound flow." }
}
{ ... }
```

The route dispatch path — previously TypeScript — is now a governed Galerina flow.
HTTP request arrives → `dispatch.fungi` → matched flow → governed execution → response.

**This is the 50% milestone.** The core request/response cycle lives in Galerina.

---

## Phase 55 — GovernanceSignature ML-DSA (Post-Quantum)
**Theme: Security — post-quantum attestation**
**Runtime %: 50%**
**Stream: D**

Phase 39 shipped Ed25519 signing. Phase 55 adds ML-DSA (NIST FIPS 204):

- `npm install ml-dsa` (or equivalent)
- Dual-signature transition: `ed25519 + ml-dsa-65` in hybrid mode
- `GovernanceSignature.algorithm: "ed25519" | "ml-dsa-65" | "hybrid"`
- Attestation policy: `pq_strict` profile requires ML-DSA only
- `FUNGI-HW-101` through `FUNGI-HW-104` diagnostics (from post-quantum hardware security spec)

**Why now:** Phase 39 built the signing infrastructure. ML-DSA is a drop-in addition.

---

## Phase 56 — Governance Verifier Stub in Galerina
**Theme: Runtime in Galerina — verification**
**Runtime %: 55%**
**Stream: A + B**

```galerina
// governance-verifier.fungi
secure flow verifyFlow(flowMeta: FlowMeta, profile: String) -> VerificationResult
contract {
  effects { audit.write }
  intent { "Verify that a flow satisfies the governance contract for the given profile." }
}
{ ... }
```

The TypeScript `governance-verifier.ts` is the reference. The .fungi version handles
the subset of checks needed for the live HTTP flows. Stage B is used to compile it.

---

## Phase 57 — Effect Checker in Galerina
**Theme: Runtime in Galerina — static analysis**
**Runtime %: 60% 🎯**
**Stream: A + B**

```galerina
// effect-checker.fungi
pure flow checkFlowEffects(flow: FlowDecl, ast: AST) -> Array<EffectDiagnostic>
contract {
  effects {}
  intent { "Verify declared effects match observed effects." }
}
{ ... }
```

When the effect checker runs in Galerina, the compiler's own analysis is governed.
A major milestone: Galerina checks Galerina using Galerina.

---

## Phase 58 — CUDA/GPU Compute Backend
**Theme: Hardware — GPU execution**
**Runtime %: 60%**
**Stream: C**

CUDA is installed (`v13.3`). nvcc isn't in PATH but the runtime is available.

- Fix `nvcc` PATH (add `C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v13.3\bin`)
- `npm install cuda-js` or compile a Rust CUDA kernel via `cudarc`
- Wire into `gpu-plan.ts`: `WebGPUComputePlan.execute()` dispatches to real CUDA
- Benchmark: arithmetic-threshold on GPU should reach 100B+ ops/sec

**Why now:** GPU hardware is confirmed. Deno WebGPU benchmark showed 3.99M ops/sec
on the RTX 3050 Ti. Real CUDA should be 25-100× faster for integer compute.

---

## Phase 59 — Capability Host Complete in Galerina
**Theme: Runtime in Galerina — capability host**
**Runtime %: 75% 🎯**
**Stream: A**

All capability resolution moves to Galerina:
- `resolveCapability.fungi` handles all registered effects
- `auditWriter.fungi`, `networkCapability.fungi`, `cryptoCapability.fungi`
- TypeScript becomes a thin loader that bootstraps the Stage A executor and
  feeds it the capability host flows

The TypeScript shell is now purely a bootstrap mechanism — all logic is .fungi.

**Major milestone.** The "capability host in Galerina = 75%" goal from the original
roadmap is reached.

---

## Phase 60 — v1.0 Release Candidate
**Theme: v1.0 RC**
**Runtime %: 80%**
**Stream: All**

- All security audit findings resolved (Audit Pass 3 clean)
- All benchmark tiers green or white vs Node.js
- CLI: `galerina check`, `galerina build`, `galerina serve`, `galerina diff` all stable
- `@galerina/core-compiler`, `@galerina/core-economics`, `@galerina/devtools-security`
  published to npm (private registry or public)
- Stage B compiles a non-trivial service end-to-end
- Documentation complete: grammar, spec manifest, AI_INDEX, KB all consistent
- One real external deployment (Deno Deploy or DigitalOcean)

**Remaining 20% (Phases 61-80):**
- Stage B replaces Stage A entirely (compiler self-hosted)
- v1.0 final release

---

## The 20-Phase Arc

```
Phase 41: Second HTTP endpoints (GET /health, rate status) ✓   → Runtime 27%
Phase 42: wasmtime CLI + standalone WASM deployment            → Runtime 30%
Phase 43: Deno Deploy first live endpoint                       → Runtime 32%
Phase 44: ValueGraph risk routing in production                 → Runtime 33%
Phase 45: Bytecode VM expansion (records, bool, branches)       [perf, ⚫→🟡]
Phase 46: Stage B parser complete (all syntax)                  [self-hosting]
Phase 47: Stage B type checker stub                             [self-hosting]
Phase 48: Request body auto-taint at HTTP boundary              [security]
Phase 49: Cache scoping + request size hardening                [security]
Phase 50: Stage B compiles first complete flow            🎯 35%
Phase 51: HTTP capability host stub in Galerina                  → Runtime 38%
Phase 52: Audit writer in Galerina                               → Runtime 42%
Phase 53: Stdlib core in Galerina (String, Int, Math)            → Runtime 46%
Phase 54: Route dispatcher in Galerina                    🎯 50% MILESTONE
Phase 55: GovernanceSignature ML-DSA (post-quantum)             [security]
Phase 56: Governance verifier stub in Galerina                   → Runtime 55%
Phase 57: Effect checker in Galerina                     🎯 60% MILESTONE
Phase 58: CUDA/GPU compute backend                              [hardware]
Phase 59: Capability host complete in Galerina           🎯 75% MILESTONE
Phase 60: v1.0 Release Candidate                       → Runtime 80%
```

---

## Milestone Summary

| Milestone | Phase | Runtime % | Key deliverable |
|---|---|---|---|
| Standalone WASM | 42 | 30% | `galerina build --target wasm-wasi` |
| Live traffic | 43 | 32% | Deno Deploy endpoint |
| Self-hosting bootstrap | 50 | 35% | Stage B compiles a flow |
| Core dispatch in Galerina | 54 | **50%** | Route dispatcher .fungi |
| Checker in Galerina | 57 | **60%** | Effect checker .fungi |
| Capability host | 59 | **75%** | All capability resolution in .fungi |
| v1.0 RC | 60 | 80% | Full governed stack |
| v1.0 final | ~75 | 100% | Stage B replaces Stage A |

---

## Locking Decisions Made

| Decision | Rationale |
|---|---|
| `else if` → hard error (FUNGI-SYNTAX-010) | Galerina uses `match`; no TS baggage |
| `with effects [...]` → hard error (FUNGI-SYNTAX-LEGACY-001) | `contract { effects {} }` is canonical |
| `:` return type is modern preferred form | Cleaner, TypeScript-familiar; `->` still accepted |
| `safe flow`/`guard flow` → warning | Migration path, not immediate break |
| `effects {}` optional for `pure flow` | Omission = pure; no boilerplate for simple flows |
| Inline contract style preferred | `contract {}` as first item in body `{}` for compact flows |
| `when` guard arms in `match` | Boolean guards without nested if; improves readability |
| Integer/string literal match arms | `200 => return "ok"` without wrapping in enum |
| Top-level `type` preferred over `contract.types` | Visible to routes/tests without importing internals |
| `unsafe let` at HTTP boundary | Marks untrusted request input; requires gate before governed sink |
| Password track: bcrypt→Argon2id→migration | Phases 35-37 done, abstracted behind `Password.*` |
| GovernanceSignature: Ed25519 now, ML-DSA Phase 55 | Dual-sig transition |
| HTTP substrate: Node.js bootstrap, WASM target | Phase 42 |

---

## What Phases 61-80 Cover

Brief preview (not planned in detail yet):

- **61-65**: Stage B compiler handles full grammar (all contract sections)
- **66-70**: Stage B output runs production flows (fully self-hosted for subset)
- **71-75**: Stage B passes all 223 CEC examples through its own pipeline
- **76-80**: Stage A TypeScript bootstrap retired; v1.0 final

> These phases depend on Stage B progress in 46-57. Plan them when Phase 57 lands.
