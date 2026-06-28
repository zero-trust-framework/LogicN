# Galerina — Phase 59-60 RC Summary

**Date:** 2026-06-02
**Status:** Phase 60 complete — v1.0 RC candidate
**Runtime-in-Galerina:** 80%

---

## Live .fungi HTTP Services — All 13

Services are listed in phase order. Each is a governed HTTP endpoint where the
routing, effect checking, and audit trail are declared in Galerina source.

| # | File | Phase | Route | Notes |
|---|---|---|---|---|
| 1 | `verifyPasswordService.fungi` | 34 | POST /auth/verify | First live .fungi service — **25% milestone** |
| 2 | `healthCheck.fungi` | 41 | GET /health | Liveness probe |
| 3 | `rateStatus.fungi` | 41 | GET /rate-status | Rate limit counter endpoint — **27% milestone** |
| 4 | `capabilityResolverService.fungi` | 51 | POST /capability/resolve | Runtime capability host stub |
| 5 | `auditWriterService.fungi` | 52 | POST /audit/write | Governed audit path in Galerina |
| 6 | `stdlibCoreService.fungi` | 53 | POST /stdlib/demo | Stdlib core demo endpoint |
| 7 | `routeDispatcherService.fungi` | 54 | POST /dispatch | Route dispatch in Galerina — **50% milestone** |
| 8 | `governanceVerifierService.fungi` | 56 | POST /governance/verify | Governance verification layer |
| 9 | `effectCheckerService.fungi` | 57 | POST /effect/check | Effect checker in Galerina — **60% milestone** |
| 10 | `proofGraphService.fungi` | 59 | POST /proof/generate | Proof chain generation |
| 11 | `bytecodeRouterService.fungi` | 59 | POST /tier/select | Execution tier selection — **75% milestone** |
| 12 | `economicsRouterService.fungi` | 59 | POST /economics/route | Cost-based routing decisions |
| 13 | `v1RcStatusService.fungi` | 60 | GET /v1/rc-status | v1.0 RC readiness dashboard — **80% milestone** |

> Note: `compilationService.fungi`, `capabilityHostService.fungi`, `auditChainService.fungi`,
> `governanceService.fungi`, `proofVerifierService.fungi`, `routingPolicyService.fungi`,
> `runtimeProfileService.fungi`, `typeRegistryService.fungi`, `valueClassificationService.fungi`,
> `manifestVerificationService.fungi`, `economicsService.fungi` are also live .fungi services
> supplementing the core 13.

---

## Runtime-in-Galerina Progress Table

| Phase | Runtime % | Key Deliverable |
|---|---|---|
| 34 | 25% | `verifyPasswordService.fungi` — first live governed HTTP service |
| 41 | 27% | `healthCheck.fungi` + `rateStatus.fungi` — second and third services |
| 50 | 35% | Stage B compiles first complete flow (self-hosting bootstrap) |
| 54 | 50% | `routeDispatcherService.fungi` — core HTTP dispatch in Galerina |
| 57 | 60% | `effectCheckerService.fungi` — effect checker in Galerina |
| 59 | 75% | Capability host complete — 3 new services (proof graph, bytecode router, economics router) |
| 60 | 80% | `v1RcStatusService.fungi` — v1.0 RC all governed services live |

---

## v1.0 RC Definition

A v1.0 Release Candidate is declared when **all four gates** are green:

1. **Runtime %: 80%+** — at least 80% of the runtime path is governed Galerina source,
   not TypeScript shims. Reached at Phase 60.

2. **Audit pass clean** — all audit findings from Audit Pass 1-3 resolved. No open
   `CRITICAL` or `HIGH` findings in `galerina-audit-2026-06-01.md`. All `FUNGI-SEC-*`
   diagnostics firing correctly in the effect checker.

3. **Benchmarks green** — all benchmark tiers at ⚪ (white) or better vs Node.js.
   No ⚫ (black) tiers permitted in the RC profile. The `governance-cost` and
   `compute-mix` benchmark cases must be at ⚪ minimum.

4. **Documentation consistent** — grammar (`galerina-grammar.ebnf`), spec manifest
   (`galerina-spec-manifest.yaml`), `AI_INDEX.md`, and KB files all agree on:
   - Canonical syntax (contract-inside-body style, `effects {}` optional for pure)
   - Reserved keywords (including `target`, `flow`, `event` — see grammar EBNF)
   - Phase numbers and runtime % values

---

## What Phases 61-75 Will Complete

These phases finish the Stage B self-hosting arc and bring the runtime to 100%.

### Stage B Self-Hosting Milestones (Phases 61-65)

| Phase | Theme | Deliverable |
|---|---|---|
| 61 | Parser resilience | `parser.fungi` handles contract-before-body style (standalone `contract {}` block before `{` body). Phase 61 delivered — brace-counting skip added. |
| 62 | Contract body parsing | `parser.fungi` extracts `effects {}` list from contract blocks into `FlowDecl.effects` array |
| 63 | Route declaration parsing | `parser.fungi` emits `RouteDecl` records for `route GET/POST "path" { ... }` |
| 64 | Stage B type checker — call resolution | `type-checker.fungi` resolves cross-flow call return types; emits `FUNGI-TYPE-005` on arity mismatch |
| 65 | Stage B effect checker stub | `effect-checker.fungi` verifies declared vs observed effects; gates on `pure` == no effects |

### Stage B Compilation Arc (Phases 66-70)

| Phase | Theme | Deliverable |
|---|---|---|
| 66 | GIR emitter in Galerina | `gir-emitter.fungi` emits Governed IR from Stage B AST |
| 67 | Stage B compiles a service | `compilationService.fungi` self-compiles through Stage B pipeline |
| 68 | Stage B output runs live | Stage B compiled flows handle real HTTP requests |
| 69 | Stage B passes CEC examples | All current examples parse + type-check through Stage B pipeline |
| 70 | Stage B vs Stage A parity | Automated parity check: Stage B output == Stage A output for all services |

### Full Self-Hosting (Phases 71-75)

| Phase | Theme | Deliverable |
|---|---|---|
| 71 | TypeScript bootstrap minimal | Stage A TS reduced to loader + WASM host only |
| 72 | Stage B handles all contract sections | Economics, privacy, audit, response sections parsed and emitted |
| 73 | Runtime % 90% | All governance checks run in Galerina-compiled code |
| 74 | Stage A bootstrap retired | TypeScript removed from hot paths; pure WASM execution |
| 75 | v1.0 Final | Stage B replaces Stage A entirely. Runtime = 100%. v1.0 released. |

---

## Phase 59-60 Technical Notes

### Phase 59 — Three New Capability Host Services

**`proofGraphService.fungi`** (POST /proof/generate)
- Maps flow qualifiers to proof levels (pure=0, guarded=1, secure=2, other=3)
- Returns governance proof summary with sufficiency check against policy minimum
- All logic is pure (compile-time provable); the HTTP handler is `secure`

**`bytecodeRouterService.fungi`** (POST /tier/select)
- Selects execution tier: `bytecode`, `wasm`, `sync`, `tree` based on qualifier + effect flags
- Maps tiers to traffic-light colours (green=fast path, white=acceptable, red=governed overhead)
- Enables the runtime to auto-route flows to the fastest safe executor

**`economicsRouterService.fungi`** (POST /economics/route)
- Infers execution target from flow properties: enclave (safety-critical), gpu (AI), cpu (DB write), wasm (default)
- Maps target to risk tier: critical / elevated / standard
- Note: `target` is a reserved keyword — parameter renamed to `execTarget` in `inferRiskTier`

### Phase 60 — v1.0 RC Status Service

**`v1RcStatusService.fungi`** (GET /v1/rc-status)
- Returns runtime percentage, live service count, current phase, and governance status
- All metrics are pure-flow computed (compile-time constants updated each phase)
- Provides a governed API endpoint for CI/CD RC gate checks

### Phase 61 — Stage B Parser Contract-Before-Body

`parser.fungi` extended to skip a standalone `contract { ... }` block that appears
between the return type annotation and the flow body `{ ... }`.

Pattern handled:
```
pure flow foo(x: String): Int
contract { intent { "..." } }
{
  return 0
}
```

Implementation: after return type parsing, if next token is `contract`, advance past
it then brace-count to skip the entire contract block before continuing to the body.
This makes `parser.fungi` resilient to both style variants in the wild.

---

## Reserved Keyword Note for .fungi Authors

The following identifiers cannot be used as parameter names or variable names
(parser rejects them):

- `target` — use `execTarget`, `tgt`, `dest`
- `flow` — use `flowName`, `fd`, `f`
- `event` — use `eventName`, `evt`
- `contract` — use `contractSpec`, `spec`
- `route` — use `routePath`, `routeSpec`

See `galerina-grammar.ebnf` for the complete reserved keyword list.
