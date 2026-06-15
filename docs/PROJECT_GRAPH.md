# Project Graph

## Summary

LogicN should support project maps as optional developer tooling. The goal is to
help humans and AI assistants understand package ownership, documentation
links, policies, reports and design decisions without treating the graph as a
compiler or runtime authority.

Primary references:

- https://graphify.net/
- https://github.com/safishamsi/graphify

## Package

```text
packages-logicn/logicn-devtools-project-graph
```

The package owns graph contracts for:

```text
Package
Document
Flow
Type
Effect
Policy
UnsafeFeature
Report
Target
CompilerRule
RuntimeRule
SecurityRule
ComputeFeature
Decision
```

## Backend-Neutral Rule

Do not make developers write Graphify-specific LogicN syntax or commands. Keep the
stable surface generic:

```bash
LogicN graph
LogicN graph --out build/graph
LogicN graph query "Which package owns SecureString?"
```

Backend selection belongs in policy/configuration:

```text
project_graph {
  backend auto
  allow ["LogicN_native", "graphify", "future_standard"]
}
```

This lets LogicN use:

```text
LogicN_native today
graphify as an optional pinned Git backend
another graph backend later
```

without changing LogicN source, CLI commands or generated graph file names.

If a backend is loaded from Git, it must be explicitly allowed and pinned to a
commit, tag or versioned ref. Model-assisted extraction remains opt-in.

## Outputs

Recommended generated output paths:

```text
build/graph/logicn-devtools-project-graph.json
build/graph/logicn-devtools-project-graph.html
build/graph/LogicN_GRAPH_REPORT.md
build/graph/logicn-ai-map.md
```

## CLI Direction

Run from the repository root:

```powershell
cd C:\laragon\www\LogicN
node packages-logicn\logicn-core-cli\dist\index.js graph --out build\graph
```

This writes the graph outputs under `build\graph`. Once `logicn-core-cli` is linked or
published, use the stable installed CLI form:

```powershell
LogicN graph --out build\graph
```

AI coding tools should consult `build\graph\logicn-ai-map.md` or
`build\graph\LogicN_GRAPH_REPORT.md` when package ownership is unclear. If
`build\graph\logicn-devtools-project-graph.json` is missing, or if changes were made to
`AGENTS.md`, `logicn.workspace.json`, `docs/`, package README/TODO files, package
manifests or package source contracts, regenerate the graph before relying on
it.

Current commands:

```bash
LogicN graph
LogicN graph --out build/graph
LogicN graph query "Which package owns SecureString?"
LogicN graph explain logicn-core-security
LogicN graph path logicn-framework-api-server logicn-core-security
```

Current local Node equivalents:

```powershell
node packages-logicn\logicn-core-cli\dist\index.js graph query logicn-core-security --out build\graph
node packages-logicn\logicn-core-cli\dist\index.js graph explain package:logicn-core-security --out build\graph
node packages-logicn\logicn-core-cli\dist\index.js graph path package:logicn-devtools-project-graph report:project-graph --out build\graph
```

## Safety Rules

Project graphs must not:

```text
replace compiler checks
replace security reports
replace runtime enforcement
be required for production runtime
leak secrets into graph nodes or reports
silently send code, docs or media to model APIs
```

Project graph scans should:

```text
redact secrets by default
mark relationship confidence as EXTRACTED, INFERRED or AMBIGUOUS
make model-assisted extraction opt-in
record generated output paths
distinguish source facts from inferred relationships
```

## Native Mapper

The first implementation is the LogicN-native mapper in `packages-logicn/logicn-devtools-project-graph`.
It can scan workspace package paths and project docs, then map:

```text
workspace package paths from `logicn.workspace.json`, including `packages-logicn/`
README/TODO/docs files
package.json descriptions and dependencies
TypeScript exported types, interfaces and functions
generated graph report outputs
package mentions in documentation
```

This is intentionally lightweight and deterministic. Richer external tools can
be added later as backend adapters without changing `LogicN graph`.

When `packages-logicn/` package paths are listed in `logicn.workspace.json`, the native
mapper should treat them as LogicN package collection paths. They may be beta
domain packages or future package-repository mounts, but the graph remains
advisory and must not decide production package resolution.

The native helper also supports graph query, node explanation and path finding
over generated graph JSON.

## Boundary

The graph explains LogicN. It does not enforce LogicN.
