# Galerina — Diagnostic Numbering Strategy

## Status

```
Phase 7 prerequisite — resolved before 7A implementation begins
Decision recorded: Phase 6 shipped; formal-type-system-spec.md numbering is canonical for FUNGI-TYPE-*
```

---

## The Problem

Two Galerina KB documents historically defined `FUNGI-TYPE-*` numbering independently:

| Code | `formal-type-system-spec.md` | `compiler-diagnostics.md` (old) |
|---|---|---|
| `FUNGI-TYPE-001` | UnknownType | TYPE_MISMATCH |
| `FUNGI-TYPE-002` | TypeMismatch | UNKNOWN_TYPE |
| `FUNGI-TYPE-003` | InvalidNominalConversion | ARITY_MISMATCH |
| `FUNGI-TYPE-009` | InvalidGenericInstantiation | *(not listed)* |

This created a conflict with real consequences: the compiler, test fixtures, IDE integrations,
AI tooling, and governance reports all depend on stable diagnostic identities.

---

## The Decision (recorded here permanently)

**Phase 6 shipped against `formal-type-system-spec.md` numbering.**

The implementation already has a dependency on those identifiers. Renumbering would require:
- code churn across type-checker, value-state checker, effect checker
- fixture and snapshot migration
- test file updates
- AI tooling and IDE reference updates

That cost has no architectural benefit.

### Canonical ownership model

| Concern | Canonical owner |
|---|---|
| `FUNGI-TYPE-*` numeric definitions and semantics | `formal-type-system-spec.md` |
| Operational summary / compiler presentation | `compiler-diagnostics.md` (defers) |
| Implementation mapping | compiler source |
| Test fixtures | implementation-defined |

`compiler-diagnostics.md` must **not** redefine `FUNGI-TYPE-*` numbering.
It may summarize and reference codes, but the formal type-system spec is the authority.

---

## Why This Is the Right Long-Term Architecture

### 1. Avoids breaking the existing implementation

Phase 6 is already shipped. Keeping those identifiers avoids unnecessary churn.

### 2. The formal spec is more complete

`formal-type-system-spec.md` defines 22 codes with richer semantic meaning and type-system intent.
`compiler-diagnostics.md` had only 8 partial codes before Phase 7.

### 3. Diagnostic codes are compiler API surface

Once external tooling depends on:

```
FUNGI-TYPE-001
FUNGI-TYPE-004
FUNGI-TYPE-009
```

those identifiers are effectively public ABI. Keeping the already-shipped numbering
preserves backward compatibility with test snapshots and tooling integrations.

### 4. Prevents future spec drift

Adding a single authority prevents the divergence pattern:

```
spec updated
↓
diagnostics file forgotten
↓
compiler implemented against wrong numbering
↓
fixtures inconsistent
```

---

## Governance Rule

> A diagnostic ID may only have one canonical semantic definition source.

All other documents may:
- reference IDs
- summarize IDs
- categorize IDs operationally
- link to the canonical definition

But must **not** redefine numbering independently.

---

## Future Automation Path

Later Galerina tooling can auto-generate from the canonical source:
- IDE hover documentation
- JSON diagnostic schemas
- Machine-readable compiler catalogs
- AI context manifests
- Localized error messages

This works cleanly only when numbering is centralized in one source.

---

## For Future Diagnostic Series

Each new series must declare its canonical owner at creation time:

```
FUNGI-EFFECT-*    → effect-checker-and-boundary-checker.md
FUNGI-MATCH-*     → formal-type-system-spec.md (Section 13)
FUNGI-NAME-*      → formal-type-system-spec.md (Section 13)
FUNGI-VALUESTATE-* → value-state-annotations.md
FUNGI-SECRET-*    → value-state-annotations.md
FUNGI-GRAPH-*     → fungi-graph library (separate repo)
```

`compiler-diagnostics.md` lists all series with a pointer to each canonical owner.
It is an index, not a definition source.

---

## See Also

- `docs/Knowledge-Bases/formal-type-system-spec.md` — canonical FUNGI-TYPE-* definitions
- `docs/Knowledge-Bases/compiler-diagnostics.md` — operational index of all diagnostic series
- `docs/Knowledge-Bases/value-state-annotations.md` — FUNGI-VALUESTATE-* and FUNGI-SECRET-*
- `docs/Knowledge-Bases/effect-checker-and-boundary-checker.md` — FUNGI-EFFECT-*
