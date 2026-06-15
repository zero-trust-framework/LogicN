# Framework: Project Structure

## Purpose

Define where LogicN application files, framework package docs and generated
reports should live.

## Short Definition

Project structure separates application source, reusable LogicN package planning,
language-core documentation and generated output.

## Recommended Structure

```text
packages-logicn/
  logicn-core/
  logicn-framework-app-kernel/
  logicn-framework-api-server/
  logicn-framework-example-app/

docs/
  framework/
  contracts/
  policies/
  reports/
  rules/
  examples/
  Knowledge-Bases/

build/
  graph/
  reports/
```

## Security Rules

- Keep secrets out of source control.
- Keep generated machine-local capability profiles out of Git.
- Keep app-specific docs in `docs/`, not in `packages-logicn/logicn-core/`.
- Keep LogicN language-core docs in `packages-logicn/logicn-core/`, not in app docs.

## AI-Friendly Output

The project graph should be regenerated when package ownership, docs, reports,
package manifests or source contracts change.

## Generated Reports

```text
build/graph/logicn-devtools-project-graph.json
build/graph/LogicN_GRAPH_REPORT.md
build/graph/logicn-ai-map.md
```

## v1 Scope

Use the existing package layout and document framework concepts through the new
`docs/framework`, `docs/contracts`, `docs/policies`, `docs/reports` and
`docs/rules` folders.
