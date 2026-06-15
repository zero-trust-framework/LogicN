# Package Naming

## Purpose

This document defines the package naming scheme for `packages-logicn/`.

```text
packages/       normal app/vendor package space
packages-logicn/    LogicN language, runtime, tooling, target and domain packages
```

Use grouped names so package purpose is visible from the directory alone.

## Naming Rule

Use:

```text
LogicN-[family]-[purpose]
```

Ungrouped names are allowed only for stable root packages whose responsibility is
already clear:

```text
logicn-core
logicn-ai
```

`logicn-core` is the language root. `logicn-ai` is the generic AI contract root.
`logicn-core-photonic` is the photonic concept/model root, not a compiler target.

When a core package has both a grouped `logicn-core-*` name and an older ungrouped
name, keep the grouped `logicn-core-*` package as canonical. Merge any unique source,
tests, manifests or current generated artifacts into the grouped package, then
remove the stale ungrouped package folder.

## Package Families

| Family | Meaning | Examples |
|---|---|---|
| `logicn-core-*` | Core language, toolchain, runtime, network policy and safe developer automation | `logicn-core-compiler`, `logicn-core-runtime`, `logicn-core-network`, `logicn-core-security`, `logicn-core-cli`, `logicn-core-tasks` |
| `logicn-ai-*` | AI workload, model, agent and AI compute-model packages | `logicn-ai-agent`, `logicn-ai-neural`, `logicn-ai-neuromorphic`, `logicn-ai-lowbit` |
| `logicn-data-*` | Data processing, parsing, search, archive, typed database boundary, streaming and report contracts | `logicn-data-html`, `logicn-data-search`, `logicn-data-db`, `logicn-data-response` |
| `logicn-web-*` | Browser-safe web rendering, state, component, router and event contracts | `logicn-web-render`, `logicn-web-state`, `logicn-web-components` |
| `logicn-db-*` | Database provider adapter contract packages | `logicn-db-postgres`, `logicn-db-mysql`, `logicn-db-sqlite` |
| `logicn-target-*` | Compiler/output targets and backend planning | `logicn-target-cpu`, `logicn-target-gpu`, `logicn-target-wasm`, `logicn-target-photonic` |
| `logicn-cpu-*` | CPU implementation and optimized kernel packages | `logicn-cpu-kernels`, future `logicn-cpu-photonic-sim` |
| `LogicN-gpu-*` | GPU implementation and optimized kernel packages | future `LogicN-gpu-kernels` |
| `logicn-framework-*` | Optional framework, server and app boundary packages | `logicn-framework-app-kernel`, `logicn-framework-api-server`, `logicn-framework-example-app` |
| `logicn-devtools-*` | Development-only tools not needed by production installs | `logicn-devtools-project-graph` |
| `logicn-tools-*` | Tools that may run in development or staging but are not core runtime packages | `logicn-tools-benchmark` |
| `LogicN-finance-*` | Finance domain package family | `LogicN-finance-core` |
| `LogicN-electrical-*` | Electrical infrastructure domain package family | `LogicN-electrical-core` |
| `LogicN-ot-*` | Operational-technology integration package family | `LogicN-ot-core`, future `LogicN-ot-opcua` |
| `LogicN-database-*` | Database domain package family | future package family |
| `LogicN-industrial-*` | Industrial domain package family | future package family |
| `LogicN-science-*` | Science domain package family | future package family |
| `LogicN-manufacturing-*` | Manufacturing domain package family | future package family |

## Current Package Names

```text
logicn-core
logicn-core-cli
logicn-core-compiler
logicn-core-compute
logicn-core-config
logicn-core-logic
logicn-core-network
logicn-core-photonic
logicn-core-reports
logicn-core-runtime
logicn-core-security
logicn-core-tasks
logicn-core-vector
logicn-ai
logicn-ai-agent
logicn-ai-lowbit
logicn-ai-neural
logicn-ai-neuromorphic
logicn-data
logicn-data-archive
logicn-data-database
logicn-data-db
logicn-data-html
logicn-data-json
logicn-data-model
logicn-data-pipeline
logicn-data-query
logicn-data-reports
logicn-data-response
logicn-data-search
logicn-web
logicn-web-render
logicn-web-state
logicn-web-components
logicn-web-router
logicn-web-events
logicn-db-firestore
logicn-db-mysql
logicn-db-opensearch
logicn-db-postgres
logicn-db-sqlite
logicn-target-ai-accelerator
logicn-target-native
logicn-target-cpu
logicn-target-gpu
logicn-target-js
logicn-target-photonic
logicn-target-wasm
logicn-cpu-kernels
logicn-framework-app-kernel
logicn-framework-api-server
logicn-framework-example-app
logicn-devtools-project-graph
logicn-tools-benchmark
```

Archived post-v2 domain package names:

```text
LogicN-finance-core
LogicN-electrical-core
LogicN-ot-core
```

These packages are preserved under `C:\laragon\www\LogicN_Archive\packages-logicn\`
and must not be part of the active v1 build graph.

## Devtools Rule

Packages needed only by developers should use `logicn-devtools-*` when they inspect,
map, scaffold or explain the project. They should not be production runtime
dependencies.

Use `logicn-tools-*` for broader utilities such as benchmark runners, diagnostics or
release tooling that may run in development or staging.

Production profiles must not enable `logicn-devtools-*` or `logicn-tools-benchmark` by
default. A production build that includes one of these packages requires an
explicit production package override with a reason and report output.

## Enterprise Package Root

Enterprise-only packages live outside the active package collection:

```text
packages-logicn-enterprise/
```

Do not add packages from `packages-logicn-enterprise/` to `logicn.workspace.json`
or production package profiles unless the project owner explicitly unlocks the
named enterprise package or feature area.

Current enterprise package family:

```text
logicn-compliance
logicn-compliance-accessibility
logicn-compliance-ai
logicn-compliance-audit
logicn-compliance-data
logicn-compliance-deployment
logicn-compliance-privacy
logicn-compliance-reports
logicn-compliance-retention
logicn-compliance-security
```

## Target Rule

`logicn-target-*` packages describe where compiled LogicN code is going.

Do not rename target packages to I/O packages. For example, `logicn-target-native`
means future native executable output planning. `logicn-target-photonic` means compiler
mapping to photonic hardware, simulators or plans.

I/O packages can be added later for data movement, but core network policy is
owned by `logicn-core-network`:

```text
logicn-core-network
logicn-io-network
LogicN-io-storage
LogicN-io-binary
LogicN-io-optical
LogicN-io-photonic
```

These should not replace compiler target packages. Prefer `logicn-core-network`
for the shared network policy, permission, profile and report contracts used by
the runtime, security package, app kernel and API server.

## Photonic Rule

Use these names for photonic work:

```text
logicn-core-photonic      photonic concepts, types, models, APIs and simulations
logicn-target-photonic    compiler target planning for photonic hardware, simulators or plans
logicn-cpu-photonic-sim   future CPU implementation package for photonic simulation
logicn-cpu-photonic-kernels future CPU kernels for photonic-style numerical simulation
```

Do not use `logicn-core-potonic`; that is a typo. Do not use a bare
`LogicN-photonic` package name under the grouped naming scheme. Do not use
`logicn-cpu-photonic` for the general concept package, because CPU packages should
own CPU implementations or kernels, not photonic vocabulary.

## Rename Checklist

When renaming a package, update:

```text
directory paths
package.json names
logicn.workspace.json
docs and examples
tests
imports and relative paths
generated project graph outputs
changelog and migration notes
```
