# LogicN Run Mode and Compile Mode

This document describes the proposed Run Mode and Compile Mode design for LogicN /
LogicN.

LogicN should be easy to run during development, while still offering full
production benefits when compiled.

## Summary

```text
Run Mode      = quick execution for scripts, learning and development
Compile Mode  = full production build with reports, manifests and target outputs
```

Core idea:

```text
LogicN should be easy to run like PHP, Ruby or JavaScript during development,
but should support production-oriented output later.
```

## Core Principle

```text
LogicN can run directly, but it becomes fully LogicN when it is checked, compiled,
mapped, reported and documented.
```

Run Mode should be convenient. Compile Mode should be complete.

## Execution Modes

| Mode | Purpose | Typical Command |
|---|---|---|
| `run` | Run a single script or project directly | `LogicN run hello.lln` |
| `run --generate` | Run and generate development docs/reports | `LogicN run --generate` |
| `generate` | Generate development docs/reports without running | `LogicN generate` |
| `dev` | Check, generate and run in development mode | `LogicN dev` |
| `dev --watch` | Check, generate, run and watch for changes | `LogicN dev --watch` |
| `serve` | Run a local API/web app in development mode | `LogicN serve --dev` |
| `check` | Validate without building output | `LogicN check` |
| `build` | Compile and generate full build artefacts | `LogicN build` |
| `build --release` | Production build | `LogicN build --mode release` |

## Run Mode

Run Mode aLOws LogicN source files to be executed directly.

```bash
LogicN run hello.lln
```

Run Mode is useful for small scripts, learning LogicN, local development, quick
tests, API prototypes, webhook testing, developer experiments and command-line
tools.

Run Mode must still enforce:

```text
strict types
no undefined
no silent null
explicit errors
SecureString rules
basic security checks
basic source location errors
```

## Checked Run Mode

Before execution, LogicN should:

```text
parse source
type-check source
security-check source
validate imports
validate strict comments where required
validate API/webhook contracts where relevant
run if valid
```

This gives a PHP-like workflow without losing LogicN's safety identity.

## Development Serve Mode

LogicN should support a development server mode:

```bash
LogicN serve --dev
```

This mode is for API development, webhook development, local testing,
MVC-style application development, hot reload and quick route testing.

The v0.1 prototype plans this mode but does not start a production HTTP runtime.

## Unified Development Command

LogicN should have a single command for development:

```bash
LogicN dev
```

This should:

```text
check source
generate development outputs
update AI guide
update API docs
update schemas
run the app
watch for changes if requested
```

Optional watch mode:

```bash
LogicN dev --watch
```

## Cached Run Mode

For faster development and server execution, LogicN may support cached IR or
bytecode:

```text
.lln source
    -> parse
    -> type/security check
    -> cached LogicN IR or bytecode
    -> runtime executes cached version
```

## Compile Mode

Compile Mode builds the project into production-ready outputs.

```bash
LogicN build --mode release --target all
```

Compile Mode is for production deployment, release builds, CI/CD pipelines,
security review, API documentation, AI guide generation, target compatibility
checks, deterministic builds, auditing and rollback.

## Development Generated Outputs

Generated explanation should not require a production compile.

In Run Mode or Dev Mode, LogicN may generate development outputs:

```text
.build-dev/
|-- app.api-report.json
|-- app.security-report.json
|-- app.source-map.json
|-- app.map-manifest.json
|-- app.ai-guide.md
|-- app.ai-context.json
|-- app.global-report.json
|-- app.memory-report.json
`-- docs/
    |-- api-guide.md
    |-- webhook-guide.md
    |-- type-reference.md
    |-- security-guide.md
    `-- docs-manifest.json
```

These outputs should explain checked source without requiring a production binary.

## Production Generated Outputs

Production artefacts require Compile Mode.

## Compile Mode Outputs

Compile Mode should produce:

```text
app.bin
app.wasm
app.gpu.plan
app.photonic.plan
app.ternary.sim
app.omni-logic.sim
app.openapi.json
app.api-report.json
app.security-report.json
app.target-report.json
app.failure-report.json
app.source-map.json
app.map-manifest.json
app.ai-guide.md
app.ai-context.json
app.build-manifest.json
```

## Suggested Workflow

```text
Use LogicN run while developing.
Use LogicN check before committing.
Use LogicN build before deployment.
Use LogicN build --mode release for production.
```

## AI Guide Rule

Every successful compile should be able to generate an AI guide.

```text
If the code compiles, the AI guide should describe the code that actually compiled.
```

The AI guide should update only after a successful compile. Failed builds should
write `app.failure-report.json` without overwriting the last valid AI guide
unless explicitly configured.

## boot.lln Configuration

```LogicN
runtime {
  run_mode "checked"
  cache_ir true
  hot_reload true
}

build {
  mode "release"
  deterministic true
  source_maps true
  reports true
  map_manifest true
  documentation true
  ai_context true
  ai_guide true
}
```

## Run Mode vs Compile Mode

| Feature | Run Mode | Compile Mode |
|---|---:|---:|
| Run small scripts | Yes | Yes |
| Local development | Yes | Yes |
| Hot reload | Yes | No / optional |
| Development docs/reports | Optional / dev mode | Yes |
| Strict type checking | Yes | Yes |
| Security checks | Basic / full depending mode | Full |
| CPU binary output | No | Yes |
| WASM output | No | Yes |
| GPU plan | Optional | Yes |
| Photonic plan | Optional | Yes |
| Ternary simulation | Optional | Yes |
| Source maps | Basic | Full |
| Map manifest | No / optional | Yes |
| Security report | Optional | Yes |
| Target report | Optional | Yes |
| API guide | Optional | Yes |
| AI guide | Optional | Yes |
| Build manifest | No | Yes |
| Deterministic build hashes | No | Yes |
| Production deployment | Not recommended | Recommended |

## Production Recommendation

Production should use Compile Mode:

```text
build once
generate reports
generate manifest
verify artefact
deploy same artefact to many servers
load secrets at runtime
```

Do not compile real secrets into the output.

## Final Rule

```text
Run fast while developing.
Generate explanations while checking.
Compile fully before deploying.
```
