# Compiler Diagnostics

## Definition

Galerina compiler and runtime diagnostics are machine-readable and human-readable.
Every warning, error, and fatal diagnostic has a structured code, source location,
problem description, and suggested fix. Diagnostics are designed for both human
developers and AI tooling.

## Diagnostic Format

Every diagnostic includes:

```json
{
  "code": "LNN-ERR-TYPE-001",
  "severity": "error",
  "file": "src/orders.fungi",
  "line": 14,
  "column": 22,
  "expected": "Int",
  "actual": "String",
  "problem": "Cannot add String and Int.",
  "suggestedFix": "Use toInt() to convert the String explicitly.",
  "safeExample": "let total: Int = toInt(raw_count) + 5"
}
```

Diagnostics must not include:

```text
raw secrets
real tokens
private keys
full .env contents
production data
```

## Severity Levels

```text
WARN  — non-fatal, execution can continue
ERR   — recoverable error, compilation or execution blocked
FATAL — unrecoverable, runtime must halt
```

## Code Ranges

| Range | Category |
| --- | --- |
| `LNN-WARN-MEM-*` | Memory warnings |
| `LNN-ERR-MEM-*` | Recoverable memory errors |
| `LNN-FATAL-MEM-*` | Unrecoverable memory errors |
| `LNN-WARN-DISK-*` | Disk warnings |
| `LNN-ERR-DISK-*` | Disk errors |
| `LNN-FATAL-DISK-*` | Unrecoverable disk errors |
| `LNN-WARN-CACHE-*` | Cache warnings |
| `LNN-ERR-CACHE-*` | Cache errors |
| `LNN-WARN-LOGIC-*` | Logic-width warnings |
| `LNN-ERR-LOGIC-*` | Logic-width errors |
| `LNN-WARN-TARGET-*` | Target support warnings |
| `LNN-ERR-TARGET-*` | Target support errors |
| `LNN-ERR-TYPE-*` | Type errors |
| `LNN-ERR-NULL-*` | Null / None errors |
| `LNN-WARN-BUILD-*` | Build warnings |
| `LNN-ERR-SEC-*` | Security errors |
| `LNN-WARN-SEC-*` | Security warnings |
| `LNN-WARN-API-*` | API warnings |
| `LNN-SEC-*` | Security rule violations (compiler) |
| `LNN-MEM-*` | Memory model violations (compiler) |
| `LNN-STYLE-*` | Code style violations (compiler) |
| `LNN-TRUST-*` | Trust/signing violations (runtime) |
| `LNN-AI-*` | AI-generated code risk (runtime) |

## Core Compiler Codes

### Type Errors

```text
LNN-ERR-TYPE-001: Type mismatch — expected X, got Y
LNN-ERR-TYPE-002: Field X is not a member of type Y
LNN-ERR-TYPE-003: Non-exhaustive match — missing enum case: X
LNN-ERR-NULL-001: Null is not a valid value — use Option<T>
LNN-ERR-NULL-002: None used where a value is required — unwrap or handle None
```

### Security Errors

```text
LNN-SEC-014: fn declarations cannot request runtime authority.
             Move this operation into a flow or pass the required value as an argument.
LNN-SEC-041: Cannot use unsafe value in expression.
             Validate first: validate.X(value) -> safe X
```

### Memory Errors

```text
LNN-MEM-021: Use after release — variable was released on line N.
LNN-MEM-022: Release of borrowed value — can only release owned local values.
```

### Style Warnings

```text
LNN-STYLE-012: Nesting depth exceeds 2. Consider extracting to a named fn or flow.
```

### Trust Errors (runtime)

```text
LNN-TRUST-041: Local self-signed artifact cannot run in production profile.
               Use CI/OIDC, trusted registry, or organisation signing.
```

### AI Risk Codes

```text
LNN-AI-PRIV-001: AI-generated high-risk flow requires production approval.
```

## Implemented Prototype Codes

These codes are emitted by the current Node.js prototype:

```text
LNN-ERR-TARGET-002   — target not available
LNN-WARN-TARGET-003  — accelerator fallback to CPU
LNN-WARN-LOGIC-001   — logic width simulation
LNN-ERR-LOGIC-001    — unsupported logic width
LNN-WARN-DISK-003    — disk space warning
LNN-ERR-DISK-001     — disk write failure
LNN-WARN-MEM-002     — memory limit approaching
LNN-WARN-MEM-005     — cache memory warning
LNN-ERR-MEM-006      — memory integrity check failed
LNN-ERR-TYPE-001     — type mismatch
LNN-ERR-TYPE-002     — unknown field
LNN-ERR-TYPE-003     — non-exhaustive match
LNN-ERR-NULL-001     — null not allowed
LNN-ERR-NULL-002     — unexpected None
LNN-WARN-BUILD-002   — build warning
LNN-ERR-SEC-001      — security policy violation
LNN-WARN-SEC-002     — security warning
LNN-WARN-API-001     — API configuration warning
```

## Source Mapping

Diagnostics map to original `.fungi` source files even when compiled output runs:

```text
Type error:
Cannot add String and Int.

Original source:
  src/orders.fungi:14:22

Suggestion:
  Convert the String explicitly using toInt().
```

## Report Files

The build system generates:

```text
app.security-report.json  — security settings, permissions, unsafe usage
app.build-manifest.json   — source hash, output hash, dependency hashes, timestamp
app.failure-report.json   — error type, source location, target, suggested fix
```

The build manifest includes:

```text
source hash
output hash
dependency hashes
compiler version
build mode
target outputs
created timestamp
```

## CI Rules

CI should fail if:

```text
unsafe code introduced without explicit profile allowance
secret logging detected
webhooks lack verification
API routes lack timeouts
JSON policies missing
dependencies request risky permissions
target fallback is unsafe
```

## Core Principle

```text
Every diagnostic is structured, source-mapped, and actionable.
Diagnostics never expose secrets.
Both humans and AI tools can act on diagnostics.
```

---

## FUNGI-Series Diagnostic Codes

All Phase 4+ diagnostics use the `FUNGI-CATEGORY-NNN` format. These replace and extend the
older `LNN-*` codes as the compiler matures.

| FUNGI Series | Purpose |
|---|---|
| `FUNGI-PARSE-*` | Parser: unexpected tokens, malformed syntax |
| `FUNGI-AST-*` | AST schema validation |
| `FUNGI-INTENT-GRAPH-*` | Intent graph structural errors |
| `FUNGI-TYPE-*` | Core type checker (Phase 5) |
| `FUNGI-NAME-*` | Name resolution (Phase 5) |
| `FUNGI-MATCH-*` | Match exhaustiveness (Phase 5) |
| `FUNGI-EFFECT-*` | Effect checker |
| `FUNGI-SEC-*` | Security and authority rule violations |
| `FUNGI-INTENT-*` | Intent declaration errors |
| `FUNGI-PIPELINE-*` | Pipeline chain type errors |
| `FUNGI-BINDING-*` | Binding mutability |
| `FUNGI-MEMORY-*` | Memory model |
| `FUNGI-SAFETY-*` | Safety rule violations |
| `FUNGI-SYNTAX-*` | Syntax rule violations |
| `FUNGI-RAWPTR-*` | Raw pointer ban |
| `FUNGI-FUSE-*` | Pipeline fusion optimisation reports |
| `FUNGI-GRAPH-*` | Governance flow-graph (devtools-flowgraph): structural (cycle) + governance (dead flow, authority escalation, PII-leakage path, missing audit coverage) |
| `FUNGI-GOV-3VL-*` | Three-valued governance verdict collapse (runtime, fail-closed) |
| `FUNGI-SUBSTRATE-*` | Substrate failure-mode guarantees vs a seeded noise model (Direction C, fail-closed) |
| `FUNGI-RUNTIME-*` | Runtime enforcement |

### Parser (Phase 4)

```text
FUNGI-PARSE-001   Unexpected token
FUNGI-PARSE-002   Expected declaration keyword
FUNGI-PARSE-003   Unterminated string literal
FUNGI-PARSE-004   Invalid numeric literal
FUNGI-PARSE-005   Unclosed block or bracket
FUNGI-PARSE-006   Missing return type annotation
FUNGI-PARSE-007   Duplicate declaration in same scope
FUNGI-PARSE-008   Invalid escape sequence
FUNGI-PARSE-009   Reserved keyword used as identifier
FUNGI-PARSE-010   Placement hint on non-flow/non-alloc context
FUNGI-PARSE-011   Ownership expression outside allowed context
FUNGI-PARSE-012   GPU stream used in non-compute context
FUNGI-PARSE-013   Atomic operation on non-atomic memory region (parse-level)
FUNGI-PARSE-014   Quantized type used outside neural/AI context
```

### Published AST Schema

```text
FUNGI-AST-001     AST schema version not recognized
FUNGI-AST-002     Node kind missing required span
FUNGI-AST-003     Invalid discriminant in union node
FUNGI-AST-004     Schema export contains unresolved reference
FUNGI-AST-005     AST truncated at syntax error boundary
FUNGI-AST-006     --resolved mode requires prior --syntax-only pass
```

### Intent Graph

```text
FUNGI-INTENT-GRAPH-001   Intent graph node references unknown flow
FUNGI-INTENT-GRAPH-002   Intent graph edge has unknown source node
FUNGI-INTENT-GRAPH-003   Transitive edge conflicts with declared edge
FUNGI-INTENT-GRAPH-004   Privacy redaction removed required node
FUNGI-INTENT-GRAPH-005   Intent graph schema version mismatch
FUNGI-INTENT-GRAPH-006   Source map entry refers to unknown file
```

### Effect Checker

```text
FUNGI-EFFECT-001   Undeclared effect used inside flow
FUNGI-EFFECT-002   Effect propagation: transitive effect not declared
FUNGI-EFFECT-003   Effect boundary violation
FUNGI-EFFECT-004   Forbidden effect inside compute-restricted flow
```

### Security and Authority

```text
FUNGI-SEC-014      FN_AUTHORITY_OR_EFFECTS_DENIED  fn declarations cannot request
                 runtime authority, declare effects, or spawn governed work
```

### Capability Checker

```text
FUNGI-TARGET-CAP-001   Effect forbidden inside GPU-targeted flow
FUNGI-TARGET-CAP-002   Deterministic flow cannot use nondeterministic effect
```

### Capability Imports

```text
FUNGI-CAPABILITY-IMPORT-001   Import introduces undeclared capability
FUNGI-CAPABILITY-IMPORT-002   Import introduces network effect not declared in project
FUNGI-CAPABILITY-IMPORT-003   Import introduces secret access
FUNGI-CAPABILITY-IMPORT-004   Transitive dependency widens authority
FUNGI-CAPABILITY-IMPORT-005   Package manifest missing export-level capability declarations
FUNGI-CAPABILITY-IMPORT-006   Package capability changed since last review
FUNGI-CAPABILITY-IMPORT-007   Calling flow does not inherit required capabilities
```

### Memory Safety (canonical series: FUNGI-MEMORY-*)

The `FUNGI-MEMORY-*` series is canonical. The former `FUNGI-OWN-*` series is
retired — see `galerina-memory-borrow-move-pinned.md` for the mapping.

```text
FUNGI-MEMORY-001   USE_AFTER_MOVE              Moved value used after ownership transferred
FUNGI-MEMORY-002   BORROW_AFTER_MOVE           Cannot borrow a value after ownership has moved
FUNGI-MEMORY-003   BORROW_ESCAPES_SCOPE        Borrowed reference cannot outlive its owner
FUNGI-MEMORY-004   READONLY_MUTATION           Cannot mutate a value through a readonly reference
FUNGI-MEMORY-005   MUTABLE_ALIAS               Mutable borrow cannot coexist with another active borrow
FUNGI-MEMORY-006   BOUNDS_VIOLATION            Index may be outside collection bounds
FUNGI-MEMORY-007   UNCHECKED_ACCESS_OUTSIDE_UNSAFE  Unchecked access outside approved unsafe block
FUNGI-MEMORY-008   UNSAFE_MEMORY_REQUIRES_FALLBACK  Unsafe memory op must declare a safe fallback
```

### Safety (canonical series: FUNGI-SAFETY-*)

Replaces the deprecated `Galerina_COMPILER_*` codes from the Stage 1 scanner.
All new safety-checker diagnostics must use this series. `Galerina_COMPILER_*`
codes are frozen — do not extend them.

```text
FUNGI-SAFETY-001   TRI_BRANCH_CONDITION        Tri used directly as a branch condition
FUNGI-SAFETY-002   UNSAFE_LOGIC_ASSIGNMENT     Implicit conversion between Tri/Bool/Decision
FUNGI-SAFETY-003   TRI_UNKNOWN_AS_TRUE         Tri unknown mapped to true without policy
FUNGI-SAFETY-004   SECRET_LITERAL              Raw secret literal detected in source
FUNGI-SAFETY-005   UNSAFE_DYNAMIC_CODE         eval/Function/unsafe_exec in Galerina source
FUNGI-SAFETY-006   TRI_MATCH_NOT_EXHAUSTIVE    Tri match missing one or more cases
```

#### Deprecated — Stage 1 Legacy (Galerina_COMPILER_*)

These codes are emitted by the Stage 1 `validateCoreSyntaxSafety` scanner and
are frozen for compatibility. They must not be extended. All new diagnostics
must use `FUNGI-SAFETY-*` or another canonical `FUNGI-SERIES-NNN` family.

```text
Galerina_COMPILER_TRI_BRANCH_CONDITION       → FUNGI-SAFETY-001 (canonical)
Galerina_COMPILER_UNSAFE_LOGIC_ASSIGNMENT   → FUNGI-SAFETY-002 (canonical)
Galerina_COMPILER_TRI_UNKNOWN_AS_TRUE        → FUNGI-SAFETY-003 (canonical)
Galerina_COMPILER_SECRET_LITERAL             → FUNGI-SAFETY-004 (canonical)
Galerina_COMPILER_UNSAFE_DYNAMIC_CODE        → FUNGI-SAFETY-005 (canonical)
Galerina_COMPILER_TRI_MATCH_NOT_EXHAUSTIVE   → FUNGI-SAFETY-006 (canonical)
```

### Syntax (canonical series: FUNGI-SYNTAX-*)

```text
FUNGI-SYNTAX-001   VAR_NOT_SUPPORTED           var is not a valid Galerina keyword
FUNGI-SYNTAX-002   CONST_NOT_SUPPORTED         const is not a valid Galerina keyword
FUNGI-SYNTAX-003   FUTURE_RESERVED_KEYWORD     Future-reserved keyword used as identifier
FUNGI-SYNTAX-004   ACTIVE_KEYWORD_AS_IDENT     Active keyword used as identifier
FUNGI-SYNTAX-005   TOP_LEVEL_FN_DENIED         fn may only appear inside a flow body
FUNGI-SYNTAX-006   INVALID_BINDING_PREFIX      Unrecognised binding prefix (not let/mut/unsafe let/safe mut)
FUNGI-SYNTAX-007   MISSING_RETURN_TYPE         Flow or fn declaration is missing a return type annotation
FUNGI-SYNTAX-008   UNSAFE_LET_AT_TOP_LEVEL   unsafe let is only allowed inside a secure flow (boundary data must be owned by a governed flow)
FUNGI-SYNTAX-009   EMIT_AT_TOP_LEVEL   Events may only be emitted inside flows (declare globally, emit inside governed execution)
FUNGI-SYNTAX-010   ELSE_IF_DENIED              'else if' is not valid Galerina syntax; use 'match' or sequential 'if'
```

Legacy syntax errors (hard errors):

```text
FUNGI-SYNTAX-LEGACY-001   WITH_EFFECTS_REMOVED   'with effects [...]' is no longer valid; use contract { effects {} }
FUNGI-SYNTAX-LEGACY-002   REMOVED_FLOW_QUALIFIER  'safe flow', 'unsafe flow', 'guard flow' are removed qualifiers
```

### Style (canonical series: FUNGI-STYLE-*)

Advisory diagnostics for code style. These are warnings, not errors (unless a strict
profile upgrades them).

```text
FUNGI-STYLE-001   FlowNameCamelCase   Flow and fn names should use camelCase (e.g. getUser, createPatient)
                                          (Note: in v1 this is now elevated to FUNGI-SYNTAX-010 hard error)
FUNGI-STYLE-002   TypeNamePascalCase   Type, record, and enum names should use PascalCase (e.g. UserId, PatientRecord)
```

### Taint (canonical series: FUNGI-TAINT-*)

Taint diagnostics enforce that external/untrusted data does not reach governed sinks
without an explicit sanitiser boundary. Introduced in Phase 28.

```text
FUNGI-TAINT-001   INJECTION_SINK_TAINTED       Tainted value at injection sink (database.query, html.render, shell.exec)
                                              — use a named stdlib sanitiser (Sql.escape, Html.escape, Shell.quote)
FUNGI-TAINT-002   LOGIC_SINK_UNVALIDATED       Unvalidated value at business-logic sink — validate before use
FUNGI-TAINT-003   WrongContextUntaint   A value cleaned for one sink context is used in a sink expecting a different context
FUNGI-TAINT-004   UNTAINT_BOUNDARY_REQUIRED    Tainted value used in context requiring explicit untaint
FUNGI-TAINT-005   TAINTED_RETURN               Tainted value returned from flow without explicit declassification
FUNGI-TAINT-006   CROSS_BOUNDARY_TAINT         Tainted value crosses a trust boundary without sanitiser
FUNGI-TAINT-007   UNTRUSTED_HTTP_PARAM         Route param used without sanitiser (auto-taint at HTTP boundary)
```

### Profile (canonical series: FUNGI-PROFILE-*)

Profile enforcement diagnostics. Emitted when a flow's behaviour violates the
active compilation profile (strict, high_integrity, etc.). Introduced in Phase 28.

```text
FUNGI-PROFILE-001   STRICT_EFFECT_DENIED        Effect not permitted in 'strict' profile
FUNGI-PROFILE-002   HIGH_INTEGRITY_SINK_DENIED  Governed sink not permitted in 'high_integrity' profile
FUNGI-PROFILE-003   ExceptionControlFlowProhibited   Exception control flow (try/catch/throw) is prohibited; Galerina uses Result<T, Error>
FUNGI-PROFILE-004   PROFILE_UNSAFE_BINDING      unsafe let binding not permitted in this profile without gateway
FUNGI-PROFILE-005   PROFILE_AUDIT_REQUIRED      Profile requires audit.write effect; flow does not declare it
FUNGI-PROFILE-005B  PROFILE_AUDIT_INCOMPLETE    Audit event produced but missing required fields for this profile
FUNGI-PROFILE-006   PROFILE_TAINT_CHECK_DENIED  Profile requires taint checking; flow bypasses it
FUNGI-PROFILE-007   PROFILE_SIGNATURE_REQUIRED  Profile requires governance signature; proof not provided
```

### Hardware Trust (canonical series: FUNGI-HW-*)

Hardware trust profile diagnostics (Phase 13+) and post-quantum attestation
diagnostics (Phase 55+). See `galerina-post-quantum-hardware-security.md`.

```text
FUNGI-HW-001   HARDWARE_CLASS_MISMATCH        Flow requires hardware class X; target provides class Y
FUNGI-HW-002   PROOF_LEVEL_INSUFFICIENT       Flow requires proof level X; current level is Y
FUNGI-HW-003   AcceleratorPlaneRequiresAttestation   A photonic/neuromorphic AcceleratorPlane at ProofLevel.Escalated requires runtime attestation
FUNGI-HW-004   UNKNOWN_HARDWARE_TARGET        Target not in the hardware-trust registry — yellow uncertainty (K3 INDETERMINATE), build proceeds; auto-clears once registered (R&D 0045 tier D)
FUNGI-HW-101   MISSING_REQUIRED_ATTESTATION   High-trust flow requires attestation; none provided
FUNGI-HW-102   UNSUPPORTED_ATTESTATION_ALG    Attestation algorithm not accepted by target trust profile
FUNGI-HW-103   HYBRID_ATTESTATION_INCOMPLETE  Hybrid mode requires both ed25519 and ML-DSA signatures; one missing
FUNGI-HW-104   ATTESTATION_EVIDENCE_STALE     Attestation evidence schema version is outdated for this profile
```

> Phase 55: ML-DSA-65 (NIST FIPS 204) is the post-quantum signature algorithm.
> `fungi.gov.sig.v2` artifact format carries dual signatures (ed25519 + ml-dsa-65)
> in hybrid mode. `generateHybridGovernanceKeyPair` produces the key pair.
> Attestation policy profiles: `compat` (ed25519 or ML-DSA), `hybrid` (both required),
> `pq_strict` (ML-DSA only). See `galerina-roadmap-phases-41-60.md §Phase 55`.

### Binding (canonical series: FUNGI-BINDING-*)

```text
FUNGI-BINDING-001   IMMUTABLE_LET_REASSIGNMENT     Cannot reassign immutable let binding
FUNGI-BINDING-002   READONLY_REASSIGNMENT          Cannot reassign readonly binding
FUNGI-BINDING-003   READONLY_PROPERTY_MUTATION     Cannot mutate through a readonly binding
FUNGI-BINDING-004   MUT_IN_PURE_CONTEXT            mut binding used in a pure flow or safe context
```

### Intent (canonical series: FUNGI-INTENT-*)

```text
FUNGI-INTENT-001   INTENT_BEHAVIOR_MISMATCH        Declared intent conflicts with inferred behavior
FUNGI-INTENT-002   MISSING_REQUIRED_INTENT         Governed surface requires an intent declaration
FUNGI-INTENT-003   UNSAFE_MISSING_REASON_OR_FALLBACK  Unsafe block must declare reason and fallback
FUNGI-INTENT-004   PRIVILEGED_MISSING_CAPABILITY   Privileged flow must declare its required capability
FUNGI-INTENT-005   EXPERIMENTAL_IN_PRODUCTION      Experimental code in a production build target
```

### Type Checker (canonical series: FUNGI-TYPE-*)

> **Canonical source for `FUNGI-TYPE-*` diagnostic numbering and semantics:**
> `docs/Knowledge-Bases/formal-type-system-spec.md`
>
> This document provides an operational summary only. It does **not** redefine
> or duplicate `FUNGI-TYPE-*` numbering. The formal type-system spec is the single
> source of truth for all `FUNGI-TYPE-*` codes — 22 codes defined there, not here.
> See `docs/Knowledge-Bases/galerina-diagnostic-numbering-strategy.md` for the
> ownership rationale.

The `LNN-ERR-TYPE-*` codes (older series) are frozen — do not extend.
`FUNGI-TYPE-NUMERIC-*` remains a separate sub-series for GPU/tensor numeric types.

Summary of key codes — full definitions in `formal-type-system-spec.md`:

```text
FUNGI-TYPE-001   UnknownType                  Referenced type not in scope
FUNGI-TYPE-002   TypeMismatch                 Cannot assign/convert type X to type Y
FUNGI-TYPE-003   InvalidNominalConversion     Implicit nominal alias conversion denied
FUNGI-TYPE-004   InvalidBinaryOperation       Operator not valid for these operand types
FUNGI-TYPE-005   InvalidUnaryOperation        Unary operator requires different operand type
FUNGI-TYPE-006   InvalidCallArgument          Argument type mismatch at call site
FUNGI-TYPE-007   InvalidArgumentCount         Wrong number of arguments
FUNGI-TYPE-008   InvalidReturnType            Return type does not match declaration
FUNGI-TYPE-009   InvalidGenericInstantiation  Wrong number of generic type arguments
FUNGI-TYPE-020   ShadowedBinding              Binding shadows outer-scope name (warning)
FUNGI-TYPE-021   NonExhaustiveMatch           (retired) superseded by FUNGI-TYPE-023 mandatory wildcard
FUNGI-TYPE-022   UnreachablePattern           Pattern already covered by an earlier `_`/`else` arm
FUNGI-TYPE-023   DeferredTypeCheck   A type check was deferred (could not be resolved at this point)
```

### Numeric Lowering (canonical series: FUNGI-NUMERIC-*)

Backend numeric-lowering safety gate. A scalar numeric type that the WASM backend
cannot yet lower **without data loss** is rejected fail-closed rather than emitted as a
silently-truncating module — "always make the most secure choice". Enforced unconditionally
by `checkValueStates` (value-state-checker.ts), so it fires on both the governed runtime
and the production build. Only the data-losing 64-bit widths are gated: `Int8`/`Int16`
widen to i32 and `Float32` widens to f64 (no value loss), so they are deliberately not
flagged; a generic position like `Tensor<Int64,[4]>` (an opaque i32 handle whose base type
is `Tensor`) is not flagged either.

```text
FUNGI-NUMERIC-001     UnsupportedNumericWidth   Scalar Int64/UInt64 not yet faithfully lowered — the WASM backend would silently truncate it from 64 to 32 bits; rejected fail-closed until i64 lowering lands
FUNGI-NUMERIC-OP-001  PartialDecimalOperator    Operator '/' or '%' on a Decimal is rejected and redirected to the obligation-carrying method form — exact decimal division is non-terminating (1/3) and needs an explicit rounding policy + scale (a silent default rounding on money is a fail-open). Use a.divide(b, scale, mode) / a.remainder(b); modes: halfEven|halfUp|halfDown|up|down|ceiling|floor
```

### Web fail-closed contract (canonical series: FUNGI-WEB-*) — RESERVED, RD-0100

Reserved namespace for the deny-by-default `galerina-web-*` frontend contracts. The 6 packages are
stubs today; these codes are the enforced fail-closed invariants their future implementation MUST
emit (unknown → DENY). The full machine-readable contract lives in
`governance/web-failclosed-contract.json` and is guarded by `scripts/audit-web-stub-guard.mjs`
(an impl may not ship without its `*.failclosed.test` acceptance suite). Codes are RESERVED until
implementation lands — no emitter exists yet, by design.

```text
FUNGI-WEB-001   UnsanitisedHtmlSink         HTML reaches a DOM sink without the galerina-data-html sanitiser (web-render R2; CWE-79/116)
FUNGI-WEB-002   RawHtmlInProduction         RawHtml in a production render plan without a reviewed trusted override fails closed (web-render R3; CWE-79)
FUNGI-WEB-003   SilentUnsafeRender          An unsafe-render decision (sanitiser drop / override) not recorded in the report (web-render R5)
FUNGI-WEB-010   UntrustedStateLaundering    Untrusted source becomes typed state without an explicit validate→convert step (web-state S1; CWE-501)
FUNGI-WEB-011   UnvalidatedRehydration      Serialized/persisted state trusted verbatim without re-validation (web-state S4; CWE-501)
FUNGI-WEB-020   UnvalidatedRouteParam       A route param drives a fetch/render before typed-contract validation (web-router U1; CWE-20)
FUNGI-WEB-021   OpenRedirect                Redirect/navigation target off the allowlist (web-router U2; CWE-601)
FUNGI-WEB-022   UnsafeLinkScheme            Generated link uses javascript:/data:/vbscript: scheme (web-router U3; CWE-79)
FUNGI-WEB-030   RawEventExposed             A raw browser Event object exposed to app logic instead of a typed payload (web-events E1; CWE-862)
FUNGI-WEB-031   PrivilegedActionNoGesture   Privileged action (clipboard/geolocation/payment/…) without a verified user-gesture (web-events E2; CWE-862/1173)
FUNGI-WEB-040   UnsanitisedSlotHtml         Slot/child content reaches a DOM HTML sink unsanitised (web-components C1; CWE-79)
FUNGI-WEB-041   UntypedComponentProp        An untyped/any prop reaches a render sink (web-components C2; CWE-20)
FUNGI-WEB-042   UndeclaredComponentEffect   An undeclared component side-effect (network/storage/navigation) denied (web-components C3; CWE-862)
FUNGI-WEB-050   SanitiseStageSkipped        Render pipeline skips the sanitise stage for HTML content at the umbrella boundary (web umbrella U-1; CWE-79)
```

### Affine passport typestate (canonical series: FUNGI-AFFINE-* / FUNGI-PASSPORT-*) — RD-0111

Compile-time enforcement of an **affine consume-once** + **monotone Raw→Verified→Authorized→Sealed**
typestate on `Passport`-typed values, in `value-state-checker.ts` (the same pass the governed runtime +
production build run). Lifts the rd-0087 proven abstract invariant into the shipped source checker.
Binary/digital — pure type-system analysis, touches no crypto byte (governs *who may use* a sealed
value; never performs the seal). Deny-by-default: an un-gated/unknown passport is Raw=0 (most restricted).

```text
FUNGI-AFFINE-001     PassportConsumedTwice   An authority passport, already consumed at a sink, is re-used at a second sink — affine/linear single-use violation (CWE-664, resource-lifetime/replay)
FUNGI-PASSPORT-002   PassportStateSkip       A passport at a sink whose required stage exceeds the value's current stage (Raw<Verified<Authorized<Sealed) — illegal stage skip (CWE-696, incorrect order)
```

### Name Resolution (canonical series: FUNGI-NAME-*)

```text
FUNGI-NAME-001   UNDECLARED_NAME          Name not defined in current scope
FUNGI-NAME-002   DUPLICATE_NAME           Name already declared in this scope
FUNGI-NAME-003   CrossModuleShadow   Local binding shadows a built-in domain type; rename to avoid confusion
FUNGI-NAME-004   PRIVATE_ACCESS           Name is not exported from its defining package
FUNGI-NAME-005   AMBIGUOUS_NAME           Name resolves to multiple candidates
```

### Match Exhaustiveness (canonical series: FUNGI-MATCH-*)

```text
FUNGI-MATCH-001   NON_EXHAUSTIVE_MATCH    match is missing case(s): X
FUNGI-MATCH-002   UNREACHABLE_PATTERN     Pattern is unreachable — already covered by earlier arm
FUNGI-MATCH-003   INVALID_PATTERN_TYPE    Pattern cannot match against this type
FUNGI-MATCH-004   CATCH_ALL_HIDES_CASES   Wildcard _ arm prevents exhaustiveness check of remaining cases
```

Note: as of task #174 every `match` must end with a **mandatory wildcard** `_ =>` (or `else =>`) —
`FUNGI-TYPE-023 MissingWildcardArm` (fail-closed, deny-by-default). This supersedes variant-coverage
exhaustiveness (`FUNGI-TYPE-021` retired). `FUNGI-SAFETY-006` still covers Tri-specific match safety
(`TRI_MATCH_NOT_EXHAUSTIVE`); `FUNGI-MATCH-001` remains as the general coverage diagnostic alias.

### Value-State (canonical series: FUNGI-SAFETY-*, extended)

```text
FUNGI-SAFETY-007   UNSAFE_VALUE_IN_SAFE_CONTEXT     unsafe unvalidated value used where safe validated required
FUNGI-SAFETY-008   BOUNDARY_VALUE_NOT_VALIDATED     Value from external boundary used before validation
```

### Pipeline (canonical series: FUNGI-PIPELINE-*)

```text
FUNGI-PIPELINE-001   UNKNOWN_PIPELINE_METHOD         Unknown method in pipeline chain
FUNGI-PIPELINE-002   PIPELINE_TYPE_MISMATCH          Stage output type does not match next stage input
FUNGI-PIPELINE-003   UNHANDLED_FALLIBLE_PIPELINE     Fallible stage produces unhandled Result
FUNGI-PIPELINE-004   PIPELINE_UNDECLARED_EFFECT      Stage requires effect not declared on enclosing flow
FUNGI-PIPELINE-005   PIPELINE_READONLY_MUTATION      Stage attempts to mutate a readonly receiver
```

### Typed Content Blocks (canonical series: FUNGI-BLOCK-*)

```text
FUNGI-BLOCK-001   UNKNOWN_CONTENT_BLOCK_TYPE    Unknown typed block type (valid: html, dom, script, css)
FUNGI-BLOCK-002   UNCLOSED_CONTENT_BLOCK        Typed content block opened but never closed
FUNGI-BLOCK-003   MISMATCHED_CONTENT_BLOCK_MARKER  Closing marker does not match opening marker
FUNGI-BLOCK-004   SECRET_IN_CONTENT_BLOCK       ProtectedSecret emitted into a typed content block
```

### String (canonical series: FUNGI-STRING-*)

```text
FUNGI-STRING-001   INVALID_UTF8_DECODE             decode produced invalid UTF-8
FUNGI-STRING-002   SECRET_STORED_AS_STRING         Secret value stored in plain String
FUNGI-STRING-003   IMPLICIT_STRING_BYTE_CONVERSION Bytes assigned to String without explicit decode
FUNGI-STRING-004   AMBIGUOUS_STRING_LENGTH         .length without charCount() or encodedLength()
```

### Char (canonical series: FUNGI-CHAR-*)

```text
FUNGI-CHAR-001   CHAR_BYTE_CONFUSION             Char assigned to Byte without explicit conversion
FUNGI-CHAR-002   INVALID_CHAR_LITERAL            Character literal contains invalid Unicode scalar
FUNGI-CHAR-003   MULTI_CHAR_LITERAL              Char literal contains more than one character unit
FUNGI-CHAR-004   IMPLICIT_CHAR_NUMBER_CONVERSION Char used as integer without .codePoint()
```

### Byte (canonical series: FUNGI-BYTE-*)

```text
FUNGI-BYTE-001   BYTE_OUT_OF_RANGE              Byte literal outside 0–255 range
FUNGI-BYTE-002   BYTE_OVERFLOW                  Byte arithmetic result may exceed 255
FUNGI-BYTE-003   IMPLICIT_BYTE_STRING_CONVERSION  Bytes assigned to String without explicit decode
FUNGI-BYTE-004   RAW_BYTES_LOGGED               Raw Bytes passed to log sink without redaction
FUNGI-BYTE-005   UNBOUNDED_BYTES_READ           Bytes read without declared memory limit
```

### Raw Pointer (canonical series: FUNGI-RAWPTR-*)

Raw pointer access is banned in normal Galerina code. The `FUNGI-RAWPTR-*` series
covers violations of the raw pointer ban introduced in Phase 3.

```text
FUNGI-RAWPTR-001   RAW_POINTER_OUTSIDE_UNSAFE    Raw pointer access outside approved unsafe block
```

### Data Layout

```text
LN-LAYOUT-001   Invalid alignment value (not a supported power-of-two)
LN-LAYOUT-002   Packed/SIMD conflict
LN-LAYOUT-003   Unsupported SIMD field type
LN-LAYOUT-004   GPU transfer requires stable layout
LN-LAYOUT-005   Target does not support requested alignment
LN-LAYOUT-006   Layout conversion requires explicit copy
LN-LAYOUT-007   Dynamic field prevents zero-copy
LN-LAYOUT-008   Native ABI layout is unstable
```

### Type System

```text
FUNGI-TYPE-NUMERIC-001   Float16 not supported by target
FUNGI-TYPE-NUMERIC-002   Implicit narrowing conversion rejected
FUNGI-TYPE-NUMERIC-003   Tensor shape mismatch
FUNGI-TYPE-NUMERIC-004   Quantized type used where full precision required
FUNGI-TYPE-NUMERIC-005   SIMD vector width incompatible with target
```

### Neural IR / Tensors

```text
FUNGI-TENSOR-001   Matrix dimensions do not align
FUNGI-TENSOR-002   Incompatible tensor ranks
FUNGI-TENSOR-003   Dtype mismatch
FUNGI-TENSOR-004   Layout mismatch
FUNGI-TENSOR-005   Broadcast rule failed
FUNGI-TENSOR-006   Dynamic dimension requires runtime guard
FUNGI-TENSOR-007   Backend does not support operator
FUNGI-TENSOR-008   Backend does not support dtype/layout combination
FUNGI-TENSOR-009   Precision policy would be violated
FUNGI-TENSOR-010   Native neural call lacks shape contract
```

### Quantization

```text
FUNGI-QUANT-001   Quantized value used where full precision required
FUNGI-QUANT-002   Full-precision value used where quantized required
FUNGI-QUANT-003   Incompatible quantization schemes
FUNGI-QUANT-004   Missing calibration profile
FUNGI-QUANT-005   Implicit dequantization forbidden
FUNGI-QUANT-006   Implicit quantization forbidden
FUNGI-QUANT-007   Backend does not support quantization scheme
FUNGI-QUANT-008   Accuracy evidence required by policy
FUNGI-QUANT-009   Quantized accumulation type mismatch
FUNGI-QUANT-010   Precision downgrade not approved
```

### NPU Targets

```text
FUNGI-NPU-001   NPU target unavailable for deployment platform
FUNGI-NPU-002   Operator unsupported by selected NPU provider
FUNGI-NPU-003   Dtype unsupported by selected NPU provider
FUNGI-NPU-004   Dynamic shape unsupported by selected NPU provider
FUNGI-NPU-005   Quantization required for NPU target
FUNGI-NPU-006   Fallback required but not declared
FUNGI-NPU-007   Selected provider would violate precision policy
FUNGI-NPU-008   Selected provider cannot satisfy memory budget
FUNGI-NPU-009   Runtime fallback occurred and was reported
FUNGI-NPU-010   NPU target requested but neural IR is opaque native call
```

### GPU Synchronisation

```text
FUNGI-GPU-SYNC-001   Shared memory written without barrier before read
FUNGI-GPU-SYNC-002   Atomic operation on non-atomic memory region
FUNGI-GPU-SYNC-003   Stream awaited after stream was already completed
FUNGI-GPU-SYNC-004   Concurrent kernels on same stream must be sequential
FUNGI-GPU-SYNC-005   Memory fence required before cross-stream visibility
```

### Cross-Target Verification

```text
FUNGI-VERIFY-001   Cross-target verification failed within tolerance
FUNGI-VERIFY-002   Verification tolerance not declared for this target
```

### Compute Resource Budgets

```text
FUNGI-BUDGET-001   Flow exceeds declared VRAM budget
FUNGI-BUDGET-002   Register usage exceeds declared limit
FUNGI-BUDGET-003   Occupancy constraint cannot be met for this kernel
FUNGI-BUDGET-004   Timeout budget exceeded
```

### Compiler Optimizations

```text
FUNGI-COMPTIME-001   Effectful flow cannot execute at compile time
FUNGI-COMPTIME-002   Nondeterministic operation in comptime flow
FUNGI-COMPTIME-003   Compile-time evaluation exceeded resource budget
FUNGI-COMPTIME-004   Comptime flow attempted forbidden runtime access
FUNGI-COMPTIME-005   Secret value cannot be embedded into compile-time constant
FUNGI-COMPTIME-006   Target-dependent comptime result detected
FUNGI-COMPTIME-007   Recursive comptime evaluation exceeded limit
FUNGI-COMPTIME-008   Unsupported type for compile-time serialization

FUNGI-FUSE-001   Pipeline fused successfully (report)
FUNGI-FUSE-002   Fusion skipped — effect ordering conflict
FUNGI-FUSE-003   Fusion skipped — intermediate materialisation required
FUNGI-FUSE-004   Fusion skipped — lifetime escape
FUNGI-FUSE-005   Fusion skipped — error order ambiguity
FUNGI-FUSE-006   Fusion would change short-circuit behavior

FUNGI-BOUNDS-001   Bounds check eliminated by range proof
FUNGI-BOUNDS-002   Bounds check retained — collection may mutate
FUNGI-BOUNDS-003   Bounds check retained — index range is unknown
FUNGI-BOUNDS-004   Bounds check retained — alias may resize collection
FUNGI-BOUNDS-005   Bounds check retained — integer overflow proof failed
FUNGI-BOUNDS-006   Unsafe unchecked access rejected
```

### Profile-Guided Optimization

```text
FUNGI-PGO-001   Profile evidence ignored — workload hash changed
FUNGI-PGO-002   Profile evidence ignored — target is not approved
FUNGI-PGO-003   Profile evidence stale for current backend version
FUNGI-PGO-004   Tuned launch exceeds memory budget
FUNGI-PGO-005   Tuned launch failed correctness verification
FUNGI-PGO-006   Profile requested forbidden precision relaxation
FUNGI-PGO-007   No profile evidence available; using baseline planner
FUNGI-PGO-008   Tuned launch selected from trusted profile evidence
```

### Backend

```text
FUNGI-BACKEND-001   Target backend not available
FUNGI-BACKEND-002   Feature not lowerable to selected backend
FUNGI-BACKEND-003   Runtime ABI mismatch
FUNGI-BACKEND-004   Unsafe native lowering requires explicit permission
FUNGI-BACKEND-005   Source map unavailable for optimised output
FUNGI-BACKEND-006   Backend optimisation would violate security boundary
FUNGI-BACKEND-007   Target fallback denied by policy
```

### Incremental Compilation

```text
FUNGI-INCR-001   Semantic hash mismatch — recompile required
FUNGI-INCR-002   Dependency graph changed — partial invalidation
FUNGI-INCR-003   Cached artefact expired
FUNGI-INCR-004   Incremental build skipped security-sensitive change
```

### Native Module System

```text
FUNGI-MODULE-001   Package governance manifest missing
FUNGI-MODULE-002   Package install scripts are forbidden
FUNGI-MODULE-003   Package authority not accepted
FUNGI-MODULE-004   Package manifest hash changed
FUNGI-MODULE-005   Package requested undeclared capability
FUNGI-MODULE-006   Package used effect not declared in manifest
FUNGI-MODULE-007   Package signature verification failed
FUNGI-MODULE-008   Package version is floating in production profile
FUNGI-MODULE-009   Transitive dependency authority changed
FUNGI-MODULE-010   Package export requires ungranted capability
```

### Constraint-Complete Signatures

```text
FUNGI-CONSTRAINT-001   Caller does not declare required effects
FUNGI-CONSTRAINT-002   Caller missing required capability
FUNGI-CONSTRAINT-003   Caller does not handle declared error type
FUNGI-CONSTRAINT-004   Transitive constraint not covered by caller
FUNGI-CONSTRAINT-005   Signature export missing from package manifest
```

### Test Generation

```text
FUNGI-GEN-TEST-001   No public API or flow contracts found for test generation
FUNGI-GEN-TEST-002   Generated test references missing type
FUNGI-GEN-TEST-003   Effect mock type mismatch
FUNGI-GEN-TEST-004   Capability not grantable in test context
FUNGI-GEN-TEST-005   Generated test file would overwrite developer changes
FUNGI-GEN-TEST-006   Flow has no declared effects — no mocks generated
FUNGI-GEN-TEST-007   Boundary test missing for declared external boundary
```

### Governance Summary

```text
FUNGI-GOV-SUMMARY-001   Governance summary missing required fact
FUNGI-GOV-SUMMARY-002   Profile context unknown for summary generation
FUNGI-GOV-SUMMARY-003   Summary references unpublished capability
FUNGI-GOV-SUMMARY-004   Uncertainty level too high to emit summary
FUNGI-GOV-SUMMARY-005   Summary template missing for this profile
```

### Three-Valued Governance (canonical series: FUNGI-GOV-3VL-*)

Runtime governance verdicts are three-valued (Kleene K3): `ALLOW +1 / DENY -1 /
INDETERMINATE 0`. Verdicts compose with `vAnd`(∧)/`vOr`(∨)/`vNot`(¬) and collapse at
the trust boundary — `INDETERMINATE` and `DENY` both deny; only `ALLOW` authorizes
(`authorize(v) ⇔ v=+1`, proved fail-closed). When an `INDETERMINATE` verdict reaches a
boundary it is collapsed to `deny` **and audited** (never silent). Implemented in
`galerina-tower-citizen/src/three-valued-governance.ts`. Spec + soundness proof:
`docs/Knowledge-Bases/galerina-three-valued-governance.md`.

```text
FUNGI-GOV-3VL-001   INDETERMINATE_COLLAPSED_TO_DENY   Indeterminate governance verdict reached a
                  trust boundary → collapsed to deny (severity: warning; fail-safe, audited).
```

> Complements the **compile-time** `FUNGI-SAFETY-003 TRI_UNKNOWN_AS_TRUE` (which bans mapping
> `Tri.unknown → true` without a policy in source). `FUNGI-GOV-3VL-001` is the runtime trust-boundary
> counterpart: the policy is "unknown → deny, audited." Same fail-closed, deny-by-default spirit.

### REPL

```text
FUNGI-REPL-001   Effect not permitted in current REPL profile
FUNGI-REPL-002   Secret cannot be revealed in REPL session
FUNGI-REPL-003   Capability not granted for this REPL session
FUNGI-REPL-004   Expression would cross a boundary not permitted in session
FUNGI-REPL-005   REPL session audit write failed
FUNGI-REPL-006   Session capability grant would exceed profile maximum
FUNGI-REPL-007   Interactive session requires --profile flag
FUNGI-REPL-008   Session audit report could not be generated
```

### Compliance

```text
FUNGI-PII-001    PII data used without explicit pii.read or pii.write effect
FUNGI-PHI-001    PHI data used without phi.read or phi.write effect (HIPAA)
FUNGI-PCI-001    PCI data used without pci.read or pci.write effect (PCI-DSS)
FUNGI-AUDIT-001  Audit-required flow did not produce audit.write effect
FUNGI-CONSENT-001  User consent check required before PII processing
```

### Photonic Compute

```text
FUNGI-PHOTONIC-001   Photonic op used outside photonic compute block
FUNGI-PHOTONIC-002   Wavelength out of supported range for target device
FUNGI-PHOTONIC-003   Phase value exceeds device precision
FUNGI-PHOTONIC-004   Delay line exceeds device buffer capacity
FUNGI-PHOTONIC-005   Optical signal loss exceeds tolerance threshold
FUNGI-PHOTONIC-006   O/E conversion required but not declared
FUNGI-PHOTONIC-007   Photonic target requires classical fallback declaration
FUNGI-PHOTONIC-008   Interference pattern cannot be resolved statically
FUNGI-PHOTONIC-009   Photonic effect used in non-photonic flow
FUNGI-PHOTONIC-010   Wavelength domain parallelism requires explicit route declaration
```

### Substrate Failure-Mode (canonical series: FUNGI-SUBSTRATE-*)

Semantic-guarantee codes proven against a **seeded software noise model** (Direction C). Distinct from
and complementary to `FUNGI-PHOTONIC-*` (which are *hardware-capability* codes — static device
properties): `FUNGI-SUBSTRATE-*` assert *tolerance / redundancy / determinism* guarantees against the
modeled phase-drift / crosstalk / lane-failure / readout noise. The model is fail-closed — substrate
noise can cost availability, never safety (`effectiveVerdict = vAnd(ideal, reading)` can never upgrade
a `0`/`-1` into `+1`; inherits the Direction A No-Coercion theorem). Implemented in
`galerina-tower-citizen/src/substrate-model.ts`. Spec: `docs/Knowledge-Bases/galerina-substrate-failure-model.md`.

```text
FUNGI-SUBSTRATE-001   CRYPTO_ON_NOISY_LANE                Hash/Sign/crypto effect on a noisy lane —
                    integrity needs bit-exactness, cannot be tolerance-bounded (error, always; the
                    durable Direction B1 invariant, registered now).
FUNGI-SUBSTRATE-002   TOLERANCE_UNACHIEVABLE_UNDER_NOISE  Declared tolerance not provable under the modeled
                    noise at the declared redundancy (error in production/deterministic; warning in dev).
FUNGI-SUBSTRATE-003   REDUNDANCY_INSUFFICIENT             Declared redundancy cannot meet tolerance under the
                    model, incl. the pBad ≥ 0.5 "voting won't converge" case (error, always).
FUNGI-SUBSTRATE-004   UNVOTED_ANALOG_INTO_DETERMINISTIC   Un-voted (N=1) noisy result feeds a context
                    requiring determinism (strict profile / crypto boundary) (error, always).
```

> These are a higher-severity category than the runtime `FUNGI-GOV-3VL-001` (warning): that flags an
> expected, safe runtime collapse (indeterminate → deny, audited); `FUNGI-SUBSTRATE-*` are compile-time
> *unproven-guarantee* assertions — correctness, not information. The compiler verifier pass that
> emits these from a parsed `substrate { lane, tolerance, redundancy }` block is **Direction B**
> (deferred); Direction C ships the model + checker + codes as a self-contained library.

### Runtime

```text
FUNGI-RUNTIME-001   Native runtime ABI version mismatch                                  (reserved — not yet wired)
FUNGI-RUNTIME-002   Flow or call could not be resolved (flow not found / unresolved call)
FUNGI-RUNTIME-003   Uncaught runtime exception during flow execution
FUNGI-RUNTIME-004   Assignment to an undeclared binding
FUNGI-RUNTIME-005   Unauthorized access to a governed value (UnauthorizedGovernedValueAccess)
FUNGI-RUNTIME-006   Declared contract limit exceeded — request_time / network_requests / memory / concurrent_tasks (RateLimitExceeded)
FUNGI-RUNTIME-007   Manifest requires an audit entry but AuditLog.write was not called
```

> **Source of truth = the code, not this table.** These descriptions are corrected to the wired
> emitters (`security-policy.ts` `FUNGI_RUNTIME_006` / `FUNGI_RUNTIME_005`; `interpreter.ts` for
> 002/003/004/007). The earlier draft of this block mislabelled six of seven codes (e.g. 006 read
> "Audit event stream write failed", but the wired code is `RateLimitExceeded`); fixed 2026-06-24.
> 001 is reserved — no emitter references it yet.
>
> **`FUNGI-RUNTIME-006` enforcement is COOPERATIVE, not preemptive — read this honestly.** The deadline
> is polled at flow entry, at each loop iteration, and at statement boundaries; at those poll-sites an
> exceeded limit fails **closed** (the flow is aborted with an error result). But a single in-flight
> host/bridge/builtin call is awaited with no timeout, so it is **not interrupted mid-call** — the
> overrun is caught at the *next* poll-site, or, if the long call is the flow's last act, only by the
> flow-exit `request_time` check, which emits an **after-the-fact advisory** (the work already ran).
> So 006's "the flow has been aborted" message is accurate for the poll-site path but over-claims for
> the exit-advisory path. True mid-call preemption needs the WASM fuel counter (gated on #103/#104);
> the diagnostic-taxonomy audit (2026-06-22) tracks splitting the advisory case out as `FUNGI-RUNTIME-009`.

### Graph Structure (fungi-graph library)

```text
FUNGI-GRAPH-001   Graph contains a cycle where a DAG is required
FUNGI-GRAPH-002   DeadFlow   A declared flow is unreachable / never invoked (dead flow)
FUNGI-GRAPH-003   AuthorityEscalation   A flow escalates authority beyond its declared grant (authority escalation)
FUNGI-GRAPH-004   PiiLeakagePath   A dataflow path carries PII to an unsanitised sink (PII leakage path)
FUNGI-GRAPH-005   MissingAuditCoverage   A governed flow lacks required audit coverage (missing audit coverage)
```

### Supply Chain

```text
FUNGI-SUPPLY-001   Dependency content hash mismatch
FUNGI-SUPPLY-002   Package signature verification failed
FUNGI-SUPPLY-003   Unsigned package rejected by policy
FUNGI-SUPPLY-004   Dependency graph hash mismatch
FUNGI-SUPPLY-005   Known vulnerability in dependency
```

## Reconciled emitted codes (2026-06-16)

Codes that were emitted by the compiler but not yet documented here at the time the
diagnostic-namespace conformance test was added (see `galerina-diagnostic-namespace-ownership.md`).
Descriptions taken from each code's actual emission site. This shrinks the `PENDING_REGISTRATION`
allowlist from 65 → 1.

### Lexer

```text
FUNGI-LEX-001   Generic type nesting exceeds maximum depth (8 levels)
FUNGI-LEX-002   String literal / identifier exceeds maximum length (10,000 chars)
FUNGI-LEX-003   Invalid unicode escape sequence in a string literal
FUNGI-LEX-004   File exceeds maximum size (10MB)
FUNGI-LEX-005   Line exceeds maximum length (10,000 chars)
FUNGI-LEX-006   Lexer hit the maximum diagnostic count (100); further errors suppressed
```

### Type checker

```text
FUNGI-TYPE-010   Type does not satisfy the required generic constraint
FUNGI-TYPE-011   Collection element type does not match the declared element type
FUNGI-TYPE-012   Ok/Err branch type does not match the declared Result<T,E>
FUNGI-TYPE-013   Protected secret value cannot use this operator (use constantTimeEquals())
FUNGI-TYPE-014   Calling this function requires an effect the current flow does not declare
FUNGI-TYPE-015   Governed sink requires a safe/validated binding; received an unsafe binding
FUNGI-TYPE-016   Tensor shapes are incompatible for this operation
FUNGI-TYPE-017   Cannot mix quantized (Int8) and float (Float32) without explicit dequantize()
FUNGI-TYPE-018   This type cannot exist in the selected compute target
FUNGI-TYPE-019   Symbol is not defined in the current scope
FUNGI-TYPE-030   Tensor element types do not match (Float32 vs Int8)
FUNGI-TYPE-031   Tensor dimension/rank counts do not match
```

### Binding / value-state

```text
FUNGI-BINDING-005       Cannot reassign an immutable 'let' binding (use 'mut')
FUNGI-BINDING-006       Cannot change the type of a 'mut' binding on reassignment (type-stable)
FUNGI-VALUESTATE-005    A value derived from an unsafe binding reached a governed sink (taint survives transformation, e.g. .trim())
FUNGI-VALUESTATE-006    A protected value used where the plain type is required (declare 'protected X' or pass an authorised gate)
FUNGI-VALUESTATE-007    A redacted value cannot be converted back to its original type (redaction is irreversible)
FUNGI-VALUESTATE-008    An unmarked boundary input (a bare param of a secure/guarded flow) reached a governed sink without a gate — the "34B hole" (R&D 0093). Stage-1 WARNING; escalates to error in production/deterministic. Fix: validate.*/sanitize.* before the sink, or declare the param 'tainted' and gate it.
```

### Effect / stdlib

```text
FUNGI-EFFECT-005    Effect is a broad alias; use the canonical effect name to precisely declare authority
FUNGI-STDLIB-001    A stdlib call requires an effect not declared in the contract
FUNGI-STDLIB-002    Unrecognised method on an effectful module — deny-by-default; declare the effect or use a recognised operation
FUNGI-TIER-001      Under-declared flow tier — a flow/guarded declaration uses a secure-tier effect (egress, secret/crypto material, high-consequence sink, process exec) but is not declared 'secure', so the secure-only obligations (intent justification, epilogue proof, secret-egress sealing) never attach. Production-gated floor (build-production/build-deterministic); fix: declare it 'secure flow'.
```

### Governance / value classification

```text
FUNGI-GOV-006   Secure flow has high max_risk_liability but no epilogue {} proof strategy
FUNGI-GOV-007   Privileged flow declares no effects or capabilities (should explicitly declare authority)
FUNGI-GOV-009   Privileged flow declares no effects or capabilities (should explicitly declare authority)
FUNGI-GOV-011   Contract set referenced with 'use' is not declared at program scope
FUNGI-GOV-012   Contract set requires audit.write but the flow does not declare it
FUNGI-GOV-013   A pure flow calls a flow with effects (pure flows cannot cross into governed boundaries)
FUNGI-GOV-014   Flow declares prefer [...] compute targets but no fallback target (native crash → unrecoverable failure)
FUNGI-ARCH-001  contract.architecture volatility must be LOW, MED, or HIGH (invalid token — R&D 0045 fail-closed value check)
FUNGI-ARCH-002  Stable-Dependencies violation: a more-stable flow must not depend on a more-volatile one (R&D 0045, always a hard error)
FUNGI-VAL-001   A safety_critical flow must declare audit.write
FUNGI-VAL-002   A safety_critical flow must declare 'require deterministic_execution'
FUNGI-VAL-003   Unrecognised classification in contract.value
```

### Security / anti-abuse

```text
FUNGI-SEC-020            Runtime behaviour modification (monkey-patching) is prohibited; use adapters/interfaces/mocks
FUNGI-SEC-021            Prototype/object mutation after definition is prohibited
FUNGI-SOURCE-ESCAPE-001  Source calls eval()/dynamic code loading — bypasses governance and capability checks
FUNGI-STYLE-SEC-001      Binding name looks sensitive; use SecureString or protected String
FUNGI-ANTI-ABUSE-001     Background execution (process/worker.spawn, event.schedule) requires an explicit effect declaration
```

### Network / package supply

```text
FUNGI-NET-001   Network call target is not in the flow's declared allowlist
FUNGI-NET-002   Network call resolved to a private/reserved IP (SSRF prevention)
FUNGI-PKG-001   Package declares capabilities not present in the lockfile (breaking security change)
FUNGI-PKG-002   Package from an unregistered/unverified registry
FUNGI-PKG-003   Package has no content-addressable hash (no tamper detection / reproducible build)
FUNGI-PKG-004   Package declares an install script (denied by default)
FUNGI-PKG-005   Package has no signature (origin cannot be cryptographically verified)
FUNGI-PKG-006   Package is signed by a REVOKED key (revocation refused at resolution time, defense-in-depth)
```

### Border (plugin input validation) / economics / misc

```text
FUNGI-BORDER-001   Plugin input is required but missing
FUNGI-BORDER-002   Plugin input type mismatch (expected vs actual)
FUNGI-BORDER-003   FIELD_TOO_LARGE   A plugin/border input field exceeds its declared maximum size
FUNGI-BORDER-004   Plugin input value below the declared minimum
FUNGI-ECON-001     Flow execution may exceed the declared economic budget
FUNGI-ECON-002     Protected data binding has no lineage declaration
FUNGI-ECON-003     AI model call uses a model not in the contract's approved_models list
FUNGI-EVENT-001    Event emitted but not declared at program scope
FUNGI-EVENT-002    Event declared but never emitted
FUNGI-EVENT-003    Contract declares 'emits X' but no global 'event X' declaration exists
FUNGI-EVENT-004    Event emitted more than once in a flow (possibly unintentional)
FUNGI-EVENT-005    Event emitted but not declared in contract.events
FUNGI-COMPUTE-001  Pattern may not map efficiently to the declared compute target (NPU/GPU/TPU)
FUNGI-CONTEXT-001  A required context field (contract.context) is never accessed in the flow body
FUNGI-BUILD-001    Non-deterministic build: identical source produced different output on recompilation
FUNGI-WAT-STUB     WAT emitter stub (a target path not yet fully emitted)
```

### Runtime governance codes

```text
FUNGI-RUNTIME-EFFECT-GATE   Runtime denial: a dispatched flow declares effects disallowed in the active deployment profile (route-dispatcher)
```

