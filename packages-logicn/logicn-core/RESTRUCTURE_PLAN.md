# LogicN Repository Restructure Plan

This document describes the intended repository layout for LogicN and the documentation work needed to keep the language design coherent as it grows.

## Main Rule

The repository root should describe the project, its governance, legal status, contribution model, and high-level design.

Detailed language rules, runtime behaviour, compiler internals, target support, diagnostics, examples, and technical specifications should live in focused directories and documents.

LogicN may begin with ternary logic, but it should be designed as Omni-logic compatible from the start.

---

## Omni-Logic Compatibility Rule

LogicN must not be hard-coded as only a 3-way logic language.

The original LogicN concept focuses on 3-way / ternary logic because of the relationship with photonic and non-binary computing models.

However, the language should be designed as **Omni-logic compatible**, meaning future logic widths such as 4-way, 5-way or other multi-state systems can be supported without breaking the language design.

The language should support:

```text
binary logic      = 2-state logic
ternary logic     = 3-state logic
quaternary logic  = 4-state logic
n-state logic     = future configurable logic width
omni logic        = abstraction over multiple logic widths
```

The language should avoid naming internal systems in a way that prevents future expansion.

Prefer:

```text
logic-state
logic-width
logic-mode
logic-target
omni-logic
multi-state
```

Avoid hard-coding everything as:

```text
ternary-only
three-way-only
photonic-only
```

LogicN can still have ternary support as a first-class feature, but the compiler, runtime, schemas and documentation should be prepared for wider logic systems.

---

## Target Structure

Recommended final structure:

```text
LogicN/
├── README.md
├── ABOUT.md
├── CONCEPT.md
├── SPEC.md
├── OMNI_LOGIC.md
├── REQUIREMENTS.md
├── DESIGN.md
├── ARCHITECTURE.md
├── SECURITY.md
├── AI-INSTRUCTIONS.md
├── GETTING_STARTED.md
├── DEMO_hello_WORLD.md
├── ROADMAP.md
├── TASKS.md
├── TODO.md
├── CHANGELOG.md
├── LICENSE
├── LICENCE.md
├── NOTICE.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── GOVERNANCE.md
├── GIT.md
├── COMPILED_APP_GIT.md
├── TRADEMARKS.md
├── .env.example
├── .gitignore
├── package.json
│
├── compiler/
├── runtime/
├── tooling/
├── examples/
├── grammar/
├── schemas/
├── tests/
└── docs/
```

Root files should stay short enough to act as entry points. Large, specific language design material should move into `docs/`.

---

## What Should Be in `docs/`

Recommended files:

```text
docs/language-rules.md
docs/syntax.md
docs/type-system.md
docs/memory-safety.md
docs/memory-error-correction.md
docs/security-model.md
docs/json-native-design.md
docs/api-native-design.md
docs/webhooks.md
docs/strict-comments.md
docs/strict-global-registry.md
docs/run-and-compile-modes.md
docs/pure-flow-caching.md
docs/memory-pressure-and-disk-spill.md
docs/omni-logic.md
docs/logic-widths.md
docs/logic-targets.md
docs/ai-token-reduction.md
docs/contracts.md
docs/modules-and-visibility.md
docs/standard-library.md
docs/error-codes.md
docs/warnings-and-diagnostics.md
docs/system-health-warnings.md
docs/disk-memory-and-cache-warnings.md
docs/compiler-backends.md
docs/testing.md
docs/observability.md
docs/interoperability.md
docs/xml-support.md
docs/graphql-support.md
docs/glossary.md
```

Existing root-level technical documents should be moved into `docs/` once references are updated.

---

## Omni-Logic Design Requirement

LogicN should be designed around a logic abstraction layer.

The language may start with:

```text
binary
ternary
```

But the compiler should later aLOw:

```text
logic width 2
logic width 3
logic width 4
logic width 5
logic width n
```

Example conceptual syntax:

```LogicN
logic mode ternary

state false
state unknown
state true
```

Future-compatible conceptual syntax:

```LogicN
logic width 5

state false
state low
state unknown
state high
state true
```

The compiler should treat logic modes as target capabilities.

Example:

```text
target cpu {
  logic_width: 2
}

target ternary-sim {
  logic_width: 3
}

target omni-sim {
  logic_width: dynamic
}
```

This prevents LogicN from being trapped as a ternary-only language.

### Required Compiler Behaviour

The compiler should report when a selected target does not support the requested logic width.

Example warning:

```text
logicn-WARN-LOGIC-001: Target "cpu" does not natively support logic width 3. Falling back to binary simulation.
```

Example error:

```text
logicn-ERR-LOGIC-001: Target "ternary-sim" supports logic width 3, but this program requested logic width 5.
```

---

## Memory Error Correction

LogicN should include a documented model for memory error detection, correction and recovery.

This does not mean LogicN can magically fix faulty hardware. Instead, LogicN should standardise how the compiler and runtime detect, report and respond to memory-related problems.

LogicN should distinguish between:

```text
memory pressure       = memory is running low
memory limit reached  = aLOwed memory limit has been exceeded
memory corruption     = unexpected or invalid memory state detected
bad memory            = possible unreliable memory/hardware issue
cache overflow        = cache memory limit exceeded
disk spill            = memory data moved to disk
disk spill failure    = data could not be written to disk
rollback recovery     = previous safe state restored
```

### Expected Recovery Behaviour

Where possible, LogicN should attempt safe recovery in this order:

```text
1. warn
2. reduce cache use
3. move non-critical cache data to general memory
4. spill safe temporary data to disk
5. rollback to last safe checkpoint
6. fail safely with a structured error
```

### Memory Correction Features

LogicN should support or document:

```text
checkpointing
rollback
state verification
hash/checksum validation
safe retry
cache demotion
disk spill
structured memory reports
```

### Example Warning

```text
logicn-WARN-MEM-001: Cached memory limit reached. Cache entry moved to general memory.
```

### Example Error

```text
logicn-ERR-MEM-001: Memory integrity check failed. Runtime restored previous checkpoint.
```

### Example Fatal Error

```text
logicn-FATAL-MEM-001: Memory corruption detected and recovery failed. Execution stopped safely.
```

### Required Report Output

Memory reports should be written to a structured report format.

Example:

```json
{
  "code": "logicn-WARN-MEM-001",
  "level": "warning",
  "category": "memory",
  "message": "Cached memory limit reached. Cache entry moved to general memory.",
  "recoveryAction": "cache_demoted_to_general_memory",
  "source": {
    "file": "examples/cache-demo.lln",
    "line": 42
  }
}
```

---

## Standardised Warnings and Diagnostics

LogicN should have standard warning, error and fatal diagnostic codes.

Diagnostics should use a predictable format:

```text
logicn-WARN-CATEGORY-NUMBER
logicn-ERR-CATEGORY-NUMBER
logicn-FATAL-CATEGORY-NUMBER
```

Examples:

```text
logicn-WARN-MEM-001
logicn-ERR-MEM-001
logicn-FATAL-MEM-001

logicn-WARN-DISK-001
logicn-ERR-DISK-001
logicn-FATAL-DISK-001

logicn-WARN-LOGIC-001
logicn-ERR-LOGIC-001

logicn-WARN-CACHE-001
logicn-ERR-CACHE-001

logicn-WARN-TARGET-001
logicn-ERR-TARGET-001
```

### Diagnostic Levels

```text
info     = useful information
warning  = problem detected, execution can continue
error    = operation failed, app may recover
fatal    = unsafe to continue
```

### Diagnostic Categories

```text
MEM       memory
DISK      disk and filesystem
CACHE     cache system
LOGIC     binary/ternary/omni logic
TARGET    compiler target support
TYPE      type system
NULL      null/undefined safety
SEC       security
ENV       environment variables
IO        input/output
NET       network
API       API calls
BUILD     build system
RUNTIME   runtime system
```

### Required Diagnostic Fields

All structured diagnostics should include:

```text
code
level
category
message
source file
source line
target
recovery action
timestamp
```

Example:

```json
{
  "code": "logicn-WARN-DISK-001",
  "level": "warning",
  "category": "disk",
  "message": "Available disk space is low.",
  "target": "cpu",
  "recoveryAction": "continue_with_warning",
  "source": {
    "file": "compiler/logicn.js",
    "line": 120
  },
  "timestamp": "2026-05-03T00:00:00Z"
}
```

---

## Disk, Memory and Hardware Warnings

LogicN should standardise warnings for system health issues.

### Disk Warnings

```text
logicn-WARN-DISK-001: Available disk space is low.
logicn-WARN-DISK-002: Disk write speed is below expected threshold.
logicn-WARN-DISK-003: Disk spill mode enabled due to memory pressure.
logicn-ERR-DISK-001: Failed to write spill file.
logicn-ERR-DISK-002: Failed to read spill file.
logicn-FATAL-DISK-001: Disk unavailable and no safe memory fallback exists.
```

### Memory Warnings

```text
logicn-WARN-MEM-001: Cached memory limit reached. Cache entry moved to general memory.
logicn-WARN-MEM-002: General memory pressure detected.
logicn-WARN-MEM-003: Memory spill to disk started.
logicn-WARN-MEM-004: Memory checkpoint created due to risk threshold.
logicn-ERR-MEM-001: Memory integrity check failed. Runtime restored previous checkpoint.
logicn-ERR-MEM-002: Memory limit exceeded and recovery was required.
logicn-FATAL-MEM-001: Memory corruption detected and recovery failed.
```

### Cache Warnings

```text
logicn-WARN-CACHE-001: Cached function memory limit reached.
logicn-WARN-CACHE-002: Cache entry demoted to general memory.
logicn-WARN-CACHE-003: Cache entry spilled to disk.
logicn-ERR-CACHE-001: Cache restore failed.
logicn-ERR-CACHE-002: Cache checksum mismatch.
```

### Logic Warnings

```text
logicn-WARN-LOGIC-001: Target does not natively support requested logic width. Using simulation.
logicn-WARN-LOGIC-002: Logic width conversion may lose state precision.
logicn-ERR-LOGIC-001: Requested logic width is unsupported by selected target.
logicn-ERR-LOGIC-002: Invalid logic state for current logic mode.
```

### Hardware / Target Warnings

```text
logicn-WARN-TARGET-001: Selected target is experimental.
logicn-WARN-TARGET-002: Selected target does not support native parallel execution.
logicn-WARN-TARGET-003: Accelerator target unavailable. Falling back to CPU.
logicn-ERR-TARGET-001: Selected target is not installed.
logicn-ERR-TARGET-002: Target backend failed during compilation.
```

---

## Missing High-Priority Files

Add these if they do not already exist:

```text
SPEC.md
GOVERNANCE.md
OMNI_LOGIC.md
docs/ai-token-reduction.md
docs/error-codes.md
docs/contracts.md
docs/modules-and-visibility.md
docs/standard-library.md
docs/testing.md
docs/observability.md
docs/compiler-backends.md
docs/xml-support.md
docs/graphql-support.md
docs/omni-logic.md
docs/logic-widths.md
docs/logic-targets.md
docs/memory-error-correction.md
docs/warnings-and-diagnostics.md
docs/system-health-warnings.md
docs/disk-memory-and-cache-warnings.md
```

---

## README.md Fix

The README should become the project entry point, not the full specification.

It should include:

```text
project summary
core goals
quick start
repository structure
links to SPEC.md, DESIGN.md, ARCHITECTURE.md and docs/
current prototype status
contribution links
license links
```

Also add a short Omni-logic note:

```markdown
## Omni-Logic Direction

LogicN starts with strong support for binary and ternary logic, but the language should not be limited to only 3-way logic.

The long-term design goal is Omni-logic compatibility, aLOwing future logic widths such as 4-state, 5-state or configurable n-state systems where supported by the compiler, runtime or target backend.
```

---

## TODO.md Updates

Add missing work:

```markdown
- [ ] Add OMNI_LOGIC.md
- [ ] Add docs/omni-logic.md
- [ ] Add docs/logic-widths.md
- [ ] Add docs/logic-targets.md
- [ ] Add docs/memory-error-correction.md
- [ ] Add docs/warnings-and-diagnostics.md
- [ ] Add docs/system-health-warnings.md
- [ ] Add docs/disk-memory-and-cache-warnings.md
- [ ] Define standard warning/error/fatal diagnostic code format
- [ ] Add memory pressure warning examples
- [ ] Add disk spill warning examples
- [ ] Add bad memory / memory integrity failure examples
- [ ] Add target fallback warning examples
```

---

## CHANGELOG.md Update

Add this under `[Unreleased]`:

```markdown
### Added

- Planned Omni-logic compatibility so LogicN is not limited to ternary-only logic.
- Planned future logic-width support for binary, ternary, quaternary and n-state logic systems.
- Planned memory error correction documentation.
- Planned standard warning, error and fatal diagnostic code format.
- Planned disk, memory, cache and target health warning documentation.

### Changed

- Clarified that LogicN starts with ternary support but should remain future-compatible with wider multi-state logic systems.
```

---

## Suggested Move Commands

Create the missing structure:

```bash
mkdir -p docs runtime tooling tests
```

Move existing detailed documents into `docs/` after updating links:

```bash
git mv language-rules.md docs/language-rules.md
git mv syntax.md docs/syntax.md
git mv type-system.md docs/type-system.md
git mv memory-safety.md docs/memory-safety.md
git mv memory-pressure-and-disk-spill.md docs/memory-pressure-and-disk-spill.md
git mv security-model.md docs/security-model.md
git mv json-native-design.md docs/json-native-design.md
git mv strict-comments.md docs/strict-comments.md
git mv strict-global-registry.md docs/strict-global-registry.md
git mv run-and-compile-mode.md docs/run-and-compile-modes.md
```

Optional new docs:

```bash
touch OMNI_LOGIC.md
touch docs/omni-logic.md
touch docs/logic-widths.md
touch docs/logic-targets.md
touch docs/memory-error-correction.md
touch docs/warnings-and-diagnostics.md
touch docs/system-health-warnings.md
touch docs/disk-memory-and-cache-warnings.md
```

---

## Implementation Order

Recommended order:

```text
1. Add missing root governance/spec files.
2. Add docs/, runtime/, tooling/ and tests/ directories.
3. Move detailed root-level technical files into docs/.
4. Add Omni-logic planning documents.
5. Add memory error correction planning documents.
6. Add warning and diagnostic code planning documents.
7. Update README.md links and short Omni-logic direction note.
8. Update TODO.md with missing documentation work.
9. Update CHANGELOG.md under [Unreleased].
10. Run link checks and verify package scripts still work.
```

---

## Final Target

The repository should clearly show:

```text
root = LogicN package root
compiler/ = prototype compiler and CLI
examples/ = LogicN example source files
grammar/ = grammar and token definitions
schemas/ = generated report schemas
docs/ = detailed language design documents
tests/ = future tests
runtime/ = future runtime
tooling/ = future developer tooling
omni-logic = future-compatible logic-width abstraction
diagnostics = standard warnings, errors and fatal reports
```

Final rule:

```text
LogicN may begin with ternary logic, but it should be designed as Omni-logic compatible from the start.
```
