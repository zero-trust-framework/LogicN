# LogicN Package Collection

`packages-logicn/` is the home for active reusable LogicN packages in this beta
workspace. It is split from ordinary app/vendor packages.

Current beta rule:

```text
packages/       normal app/vendor package space
packages-logicn/    LogicN package collection and beta LogicN package experiments
```

The long-term direction is:

```text
my-logicn-app/
|-- package.json       normal app/runtime ecosystem dependencies
|-- package-logicn.json    LogicN package manifest
|-- logicn.lock.json       locked LogicN package graph
|-- packages/          normal vendor/app packages
|-- packages-logicn/       LogicN packages, optionally a nested Git repository
|-- boot.lln
`-- main.lln
```

`packages-logicn/` may later become its own Git repository or submodule. If a
`.git` directory is added, it must be intentional and documented.

## Production Boundary

Production app installs should only fetch LogicN packages required by the selected
runtime profile. Development-only packages, staging packages, diagnostics,
generators and experimental packages should require an explicit development or
staging profile.

## V1 Surface Freeze

The active v1 surface is intentionally narrow:

```text
core language syntax
core type system
explicit Result / Option error and missing-value handling
memory-safety model
CPU target
WASM target
core reports, config, security, runtime, compiler and CLI tooling
core network I/O policy and report contracts
```

Everything beyond CPU and WASM target support is post-v1 unless it is required
to specify the core type system. Domain packages and regulated/safety-heavy
packages should stay outside the active workspace until the parser, memory
model and v1 examples are stable.

## Naming

Package names follow the family-prefix rule documented in
`../docs/PACKAGE_NAMING.md`.

Use:

```text
logicn-[family]-[purpose]
```

Development-only packages should use `logicn-devtools-*` or `logicn-tools-*` so they are
not mistaken for production runtime dependencies.

## Current Packages

- `logicn-core/` - LogicN language rules, syntax, type system, examples and core docs.
- `logicn-core-compiler/` - compiler pipeline contracts.
- `logicn-core-runtime/` - execution contracts for checked or compiled LogicN code.
- `logicn-core-network/` - network I/O policy, profile, permission and report contracts.
- `logicn-core-security/` - security primitives, redaction, permissions and reports.
- `logicn-core-config/` - project config and environment mode contracts.
- `logicn-core-reports/` - shared report schemas and report-writing contracts.
- `logicn-core-logic/` - `Tri`, `LogicN`, Decision, RiskLevel and Omni logic.
- `logicn-core-vector/` - vector, matrix, tensor and numeric operation concepts.
- `logicn-core-compute/` - compute planning, capabilities, effects and target selection.
- `logicn-core-cli/` - developer command tooling.
- `logicn-core-tasks/` - safe typed project automation.
- `logicn-ai/` - post-v1 generic AI inference contracts and AI safety policy.
- `logicn-ai-agent/` - post-v1 supervised AI agent and tool-permission contracts.
- `logicn-ai-lowbit/` - post-v1 low-bit and ternary AI backend contracts.
- `logicn-ai-neural/` - post-v1 neural workload contracts.
- `logicn-ai-neuromorphic/` - post-v1 spike and event-signal workload contracts.
- `logicn-data/` - post-v1 data-processing package umbrella contracts.
- `logicn-data-*` - post-v1 HTML, search, archive, JSON, database archive,
  typed database boundary, model, query, response, streaming pipeline and
  data-processing report contracts.
- `logicn-web/` and `logicn-web-*` - post-v1 typed browser rendering, client
  state, component, router and browser event contracts.
- `logicn-db-*` - post-v1 database provider adapter contracts for PostgreSQL,
  MySQL, SQLite, OpenSearch and Firestore-style systems.
- `logicn-core-photonic/` - post-v1 photonic concepts, models, APIs and simulations.
- `logicn-target-cpu/` and `logicn-target-wasm/` - v1 compiler/output target packages.
- `logicn-target-js/` - post-v1 JavaScript output planning for browser and
  framework adapter targets.
- Other `logicn-target-*` packages - post-v1 target planning.
- `logicn-cpu-kernels/` - optimized CPU kernel contracts.
- `logicn-framework-app-kernel/` - optional secure application kernel.
- `logicn-framework-api-server/` - built-in HTTP API transport package.
- `logicn-framework-example-app/` - minimal example/template app package.
- `logicn-devtools-project-graph/` - development-only project graph tooling.
- `logicn-tools-benchmark/` - benchmark and diagnostic tooling.

Archived package planning lives outside this active workspace:

```text
C:\laragon\www\LogicN_Archive\packages-logicn\logicn-finance-core
C:\laragon\www\LogicN_Archive\packages-logicn\logicn-electrical-core
C:\laragon\www\LogicN_Archive\packages-logicn\logicn-ot-core
```

Enterprise-only packages live outside this active package collection:

```text
../packages-logicn-enterprise/
```

The compliance package family has been moved there and must not be treated as
part of the active v1 build graph unless explicitly unlocked.
