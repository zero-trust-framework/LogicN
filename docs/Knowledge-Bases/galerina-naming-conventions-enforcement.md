# Galerina — Naming Convention Enforcement (FUNGI-STYLE-*)

## Status

| Field | Value |
|---|---|
| Phase | 16 — Design + implementation plan |
| New checker | `namingPolicyChecker` (after name resolver, before type checker) |
| New diagnostics | `FUNGI-STYLE-001..004` |
| Configurable | project config severity (`warning` / `error`) |

---

## TL;DR

- Galerina enforces naming conventions via compiler diagnostics, not just IDE suggestions
- Semantic security naming: variables named `*Secret`, `*Token`, `*Id` trigger governance rules
- Configurable per-project: dev = warnings, production = errors

---

## Naming Convention Table

| Construct | Convention | Examples |
|---|---|---|
| flow names | `camelCase` | `getUser`, `createPatient` |
| fn names | `camelCase` | `validateEmail`, `computeVat` |
| variables | `camelCase` | `rawEmail`, `patientId` |
| types | `PascalCase` | `UserId`, `PatientRecord` |
| enums | `PascalCase` | `Status`, `ErrorKind` |
| enum variants | `PascalCase` | `Active`, `Pending` |
| constants | `SCREAMING_SNAKE` | upper-case only (compile-time `const`) |
| effects | `dot.case` | `database.read`, `network.outbound` |
| capabilities | `dot.case` | `host.database.read` |
| packages | `kebab-case` | `@galerina/healthcare-types` |
| files | `kebab-case` | `create-patient.fungi` |

---

## Diagnostics

### FUNGI-STYLE-001: Flow name must be camelCase

Emitted when a `flow` declaration does not follow camelCase.

```
error FUNGI-STYLE-001: flow name "Get_User" must be camelCase
  --> create-patient.fungi:4:6
  |
4 | flow Get_User(id: UserId) -> Patient
  |      ^^^^^^^^
  |
  = suggestedFix: rename to "getUser"
```

### FUNGI-STYLE-002: Type / Record / Enum name must be PascalCase

Emitted when a `type`, `record`, or `enum` declaration does not follow PascalCase.

```
error FUNGI-STYLE-002: type name "patient_record" must be PascalCase
  --> patient-types.fungi:2:6
  |
2 | type patient_record = { id: UserId, name: String }
  |      ^^^^^^^^^^^^^^
  |
  = suggestedFix: rename to "PatientRecord"
```

### FUNGI-STYLE-003: Variable binding must be camelCase

Emitted when a `let` or `mut` binding does not follow camelCase.

```
warning FUNGI-STYLE-003: variable "raw_email" must be camelCase
  --> validate-email.fungi:8:7
  |
8 |   let raw_email = input.email
  |       ^^^^^^^^^
  |
  = suggestedFix: rename to "rawEmail"
```

### FUNGI-STYLE-004: Effect name must use dot.case

Emitted when an effect declaration or reference does not use dot.case.

```
error FUNGI-STYLE-004: effect name "databaseRead" must be dot.case
  --> effects.fungi:1:8
  |
1 | effect databaseRead
  |        ^^^^^^^^^^^^
  |
  = suggestedFix: rename to "database.read"
```

---

## Semantic Security Rules

Security naming rules are checked regardless of the configured severity setting. They cannot be downgraded to `off`.

| Pattern | Rule | Requirement |
|---|---|---|
| `*Secret` | `FUNGI-STYLE-SEC-001` | must be `SecureString` or protected `String` |
| `*Token` | `FUNGI-STYLE-SEC-002` | must not be logged; logging any `*Token` binding is a compile error |
| `*Id` | `FUNGI-STYLE-SEC-003` | should be a typed identity, not plain `String` (warning by default) |
| `raw*` | `FUNGI-STYLE-SEC-004` | should be `unsafe let`; plain `let raw*` emits a warning |
| `redacted*` | `FUNGI-STYLE-SEC-005` | value must carry a `redacted` value-state annotation |

### Example — FUNGI-STYLE-SEC-001

```
error FUNGI-STYLE-SEC-001: binding "apiSecret" must have type SecureString or protected String
  --> auth-service.fungi:12:7
  |
12|   let apiSecret = config.get("API_SECRET")
  |       ^^^^^^^^^
  |
  = note: bindings ending in "Secret" are governed; plain String is not permitted
  = suggestedFix: change type to SecureString
```

### Example — FUNGI-STYLE-SEC-002

```
error FUNGI-STYLE-SEC-002: "accessToken" must not appear in a log expression
  --> request-handler.fungi:34:16
  |
34|   log.info("token={}", accessToken)
  |                        ^^^^^^^^^^^
  |
  = note: bindings ending in "Token" are redacted from all output channels
```

---

## Project Configuration

Severity is configurable per project. Security rules (`FUNGI-STYLE-SEC-*`) are always `error` and cannot be overridden.

```json
{
  "style": {
    "flowNames": "camelCase",
    "typeNames": "PascalCase",
    "variableNames": "camelCase",
    "effectNames": "dot.case",
    "severity": "error"
  }
}
```

| `severity` value | Effect |
|---|---|
| `"error"` | All FUNGI-STYLE-* violations block compilation |
| `"warning"` | Violations are reported but compilation continues |
| `"off"` | Style diagnostics are suppressed (security rules still apply) |

Typical project profiles:

- **development** — `"severity": "warning"` — non-blocking during active iteration
- **production / CI** — `"severity": "error"` — enforced at build time

---

## Implementation Plan

### 1. Create `src/naming-policy-checker.ts`

New compiler pass inserted after the symbol resolver and before the type checker. Operates only on declaration nodes — it does not walk arbitrary token sequences.

```
AST → symbol resolver → naming policy checker → type checker → effect checker → ...
```

Responsibilities:

- Walk all declaration nodes (`FlowDecl`, `FnDecl`, `LetDecl`, `MutDecl`, `TypeDecl`, `RecordDecl`, `EnumDecl`, `EffectDecl`)
- Apply the convention table for each node kind
- Apply semantic security pattern matching on all binding names
- Emit `FUNGI-STYLE-*` diagnostics with `suggestedFix` attached

### 2. Check declarations only

Convention checks are per-declaration, not per-use-site. A misspelled name at the declaration site is the canonical error location. References to a misspelled name are resolved by the symbol resolver, not duplicated here.

### 3. Emit diagnostics with `suggestedFix`

Every emitted diagnostic must include a `suggestedFix` field containing the corrected identifier. This field is consumed by the language server to offer one-click rename actions and by `galerina fix --style` (planned).

### 4. Export from `index.ts`

```ts
export { namingPolicyChecker } from "./naming-policy-checker";
```

### 5. Wire into `runtime.ts` pipeline

```ts
const pipeline = [
  parsePhase,
  symbolResolver,
  namingPolicyChecker,   // <-- new
  typeChecker,
  effectChecker,
  manifestGenerator,
];
```

---

## Compiler Pipeline Placement

```
Source (.fungi)
    |
    v
  Lexer / Parser
    |
    v
  AST
    |
    v
  Symbol Resolver       (binds names to declarations)
    |
    v
  Naming Policy Checker (FUNGI-STYLE-*)    <-- this document
    |
    v
  Type Checker          (FUNGI-TYPE-*)
    |
    v
  Effect Checker        (FUNGI-EFFECT-*)
    |
    v
  Manifest Generator
    |
    v
  Output / GIR
```

Placement after the symbol resolver ensures all names are fully resolved before style checks run. Placement before the type checker means naming violations are surfaced first, which produces cleaner error output.

---

## Example

Given:

```fungi
flow Get_User(id: user_id) -> Patient {
  let raw_patient_record = db.query(id)
  raw_patient_record
}
```

Diagnostics emitted:

```
error FUNGI-STYLE-001: flow name "Get_User" must be camelCase
  --> get-user.fungi:1:6
  = suggestedFix: "getUser"

error FUNGI-STYLE-002: type name "user_id" must be PascalCase
  --> get-user.fungi:1:16
  = suggestedFix: "UserId"

warning FUNGI-STYLE-003: variable "raw_patient_record" must be camelCase
  --> get-user.fungi:2:7
  = suggestedFix: "rawPatientRecord"
```

---

## Rules at a Glance

- Enforcement is per-declaration, not per-use-site
- Security naming rules (`FUNGI-STYLE-SEC-*`) are always enforced regardless of severity setting
- Every diagnostic includes a `suggestedFix`
- `galerina fix --style` (planned future command) can auto-apply all suggested renames
- Severity can be set to `warning`, `error`, or `off` per project; security rules cannot be set to `off`

---

## See Also

- `galerina-naming-conventions` — base naming convention reference
- `galerina-governed-identity` — typed identity and SecureString model
- `formal-type-system-spec` — type system underpinning security type requirements
