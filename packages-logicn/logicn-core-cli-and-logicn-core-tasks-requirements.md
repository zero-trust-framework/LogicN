# LogicN CLI and LogicN Tasks Requirements

This document defines the requirements for two LogicN tooling packages:

```text
/packages-logicn/logicn-core-cli
/packages-logicn/logicn-core-tasks
```

These packages provide command-line tooling and safe project automation. They
must not contain business logic, routing logic, database logic, authentication
logic, template rendering or application-specific behaviour.

Their purpose is to help developers:

```text
check LogicN code
build LogicN projects
run LogicN projects
serve compiled outputs
generate reports
run safe project tasks
inspect project structure
inspect security rules
inspect generated artefacts
```

## Package Roles

`logicn-core-cli` is the developer command-line interface for LogicN. It coordinates LogicN
packages and provides commands such as:

```text
LogicN check
LogicN build
LogicN run
LogicN serve
LogicN reports
LogicN security:check
LogicN routes
LogicN task
```

`logicn-core-tasks` is the safe task runner for LogicN projects. It provides a secure
alternative to raw shell scripts for repeatable automation such as cleaning
build output, generating reports, generating OpenAPI files, copying safe assets,
running checks, preparing deployment files and running build pipelines.

## Main Design Rule

```text
LogicN CLI provides developer commands.
LogicN Tasks provides safe project automation.
Raw shell is an unsafe compatibility feature, not normal LogicN behaviour.
```

The relationship is:

```text
Developer
  ->
logicn-core-cli
  ->
logicn-core-tasks when running project tasks
  ->
compiler / runtime / server packages
```

`logicn-core-cli` may call `logicn-core-tasks`. `logicn-core-tasks` must also be usable by other tooling
without requiring direct terminal use.

## Required CLI Commands

Minimum early commands:

```text
LogicN check
LogicN build
LogicN run
LogicN serve
LogicN reports
LogicN security:check
LogicN routes
LogicN task
```

Later commands:

```text
LogicN new
LogicN test
LogicN generate:openapi
LogicN generate:schema
LogicN generate:types
LogicN generate:docs
LogicN inspect:effects
LogicN inspect:memory
LogicN inspect:targets
LogicN inspect:permissions
```

## CLI Security Requirements

The CLI must not silently weaken project security. It should respect
environment mode, warn on unsafe features, fail production builds on critical
issues, redact secrets, avoid printing `SecureString` values, avoid printing
tokens and write security and failure reports.

Production mode should fail if unsafe shell, raw SQL, raw HTML, eval or dynamic
code is enabled without explicit reason; request body limits are missing;
security report generation is disabled; or secrets are compiled into output.

Supported environment modes:

```text
development
test
staging
production
```

## CLI Reports

The CLI should generate and display:

```text
target-report.json
security-report.json
memory-report.json
api-report.json
route-report.json
effects-report.json
permissions-report.json
failure-report.json
ai-guide.json
```

CLI output must never print `SecureString` values, bearer tokens, API keys, raw
cookies, database passwords, full secret environment values or private key
material.

## Task Requirements

`logicn-core-tasks` should support named tasks, descriptions, dependencies, inputs,
outputs, permissions, effects, timeouts, safe file operations, safe environment
access, safe logging, report generation and dry run mode.

Task effects include:

```text
filesystem
network
database
environment
shell
compiler
reports
crypto
```

Tasks should not receive broad access by default. A task should explicitly
request read paths, write paths, network hosts, environment variables, database
access and shell access if unsafe.

## Unsafe Shell Support

Raw shell may be supported later, but only as an explicit unsafe compatibility
feature.

Rules:

```text
shell disabled by default
shell requires unsafe task
shell requires reason
shell requires timeout
shell requires permissions
shell command must be reportable
shell output must redact secrets
production mode may deny shell entirely
```

## Dry Run Mode

Tasks should support dry run:

```bash
LogicN task build --dry-run
```

Dry run should show the task name, dependency order, requested effects,
requested permissions, files that would be read or written, commands that would
run and reports that would be generated. Dry run must not modify files.

## Package Boundaries

Neither `logicn-core-cli` nor `logicn-core-tasks` should contain application behaviour. They
should not contain routing logic, ORM logic, authentication logic, template
rendering, admin dashboards, payment logic, email provider logic, queue driver
logic, CMS features or business rules.

## Early TODO

For `logicn-core-cli`:

```text
[ ] Add command router
[ ] Add LogicN check command
[ ] Add LogicN build command
[ ] Add LogicN run command
[ ] Add LogicN serve command
[ ] Add LogicN reports command
[ ] Add LogicN security:check command
[ ] Add LogicN routes command
[ ] Add LogicN task command
[ ] Add environment mode support
[ ] Add safe output redaction
[ ] Add structured CLI errors
[ ] Add report summary output
[ ] Add tests
```

For `logicn-core-tasks`:

```text
[ ] Define TaskDefinition type
[ ] Define TaskEffect type
[ ] Define TaskPermission type
[ ] Load tasks.lln
[ ] Run named task
[ ] Support task dependencies
[ ] Detect circular dependencies
[ ] Add dry run mode
[ ] Add filesystem permissions
[ ] Add environment permissions
[ ] Add report generation
[ ] Add unsafe shell placeholder
[ ] Deny shell by default
[ ] Add task-report.json output
[ ] Add tests
```

## Final Principle

```text
/logicn-core-cli is the developer command tool.
/logicn-core-tasks is the safe automation/task runner.
```

Terminal commands belong in `logicn-core-cli`. Automation belongs in `logicn-core-tasks`. Raw
shell should be disabled by default, explicit when enabled, permissioned,
limited, reported, redacted and treated as unsafe compatibility.

## Detailed CLI Requirements

`logicn-core-cli` should be used for checking LogicN source, building LogicN projects, running
LogicN projects, serving LogicN APIs, generating reports, generating schemas, running
tests, running tasks, inspecting project structure, inspecting routes,
inspecting permissions, inspecting effects, inspecting memory behaviour and
checking security policy.

Command responsibilities:

| Command | Purpose |
| --- | --- |
| `LogicN check` | Parse and type-check a LogicN project |
| `LogicN build` | Build project outputs |
| `LogicN run` | Run a LogicN entrypoint |
| `LogicN serve` | Start the API server package |
| `LogicN reports` | Generate or display reports |
| `LogicN security:check` | Check security rules and unsafe features |
| `LogicN routes` | List declared API routes |
| `LogicN task <name>` | Run a safe task through `logicn-core-tasks` |
| `LogicN test` | Run tests when testing support exists |
| `LogicN new` | Create a project scaffold later |

Example environment usage:

```bash
LogicN build --env production
LogicN serve --env development
LogicN security:check --env production
```

Production mode must be strict. Development mode may be more verbose, but must
still protect secrets.

CLI output should support plain text, JSON output, machine-readable errors,
human-readable diagnostics, safe tables and report summaries.

Redaction examples:

```text
DATABASE_PASSWORD=SecureString(redacted)
AUTH_TOKEN=SecureString(redacted)
```

Recommended `logicn-core-cli` folder structure:

```text
/packages-logicn/logicn-core-cli
  README.md
  TODO.md
  package.json
  tsconfig.json

  /src
    index.ts
    cli.ts

    /commands
      check-command.ts
      build-command.ts
      run-command.ts
      serve-command.ts
      reports-command.ts
      security-check-command.ts
      routes-command.ts
      task-command.ts

    /config
      load-project-config.ts
      load-env-config.ts
      cli-options.ts

    /output
      print-error.ts
      print-warning.ts
      print-success.ts
      print-table.ts
      print-report-summary.ts

    /security
      redact-cli-output.ts
      check-production-mode.ts

    /types
      cli-command.ts
      cli-context.ts
      cli-result.ts

  /tests
    cli-command.test.ts
    check-command.test.ts
    build-command.test.ts
    security-check-command.test.ts
```

The first scaffold may stay smaller while keeping these boundaries clear.

## Detailed Task Requirements

`logicn-core-tasks` should provide safe project automation for cleaning build output,
generating reports, generating OpenAPI files, generating JSON schemas, copying
safe assets, running checks, running tests, preparing deployment files, running
migration commands later, running build steps and running release checks.

Raw shell scripts are high risk because they can cause remote code execution,
file deletion, secret leakage, environment leakage, cross-platform failures,
supply-chain attacks, server compromise and unsafe deployment behaviour. LogicN
should support typed, permissioned tasks first.

## LogicN Task File

A project may define tasks in a file such as:

```text
tasks.lln
```

Example:

```LogicN
task generateReports {
  effects [filesystem, reports]

  permissions {
    write "./build/reports"
  }

  run {
    reports.generateSecurity()
    reports.generateMemory()
    reports.generateRoutes()
  }
}
```

Run with:

```bash
LogicN task generateReports
```

## Task Effects

Each task should declare effects:

```text
filesystem
network
database
environment
shell
compiler
reports
crypto
```

Example:

```LogicN
task buildApi {
  effects [filesystem, compiler, reports]

  permissions {
    read "./src"
    write "./build"
  }

  run {
    compiler.check()
    compiler.build()
    reports.generate()
  }
}
```

## Task Permissions

Tasks should not receive broad access by default. A task should explicitly
request read paths, write paths, network hosts, environment variables, database
access and shell access if unsafe.

Example:

```LogicN
task copyPublicAssets {
  effects [filesystem]

  permissions {
    read "./public"
    write "./build/public"
  }

  run {
    filesystem.copy("./public", "./build/public")
  }
}
```

## Unsafe Shell Example

Raw shell may be supported later, but only as an explicit unsafe compatibility
feature.

```LogicN
unsafe task legacyDeploy {
  reason "Temporary legacy deployment script until native LogicN deploy task exists"

  effects [shell, filesystem, network]

  permissions {
    shell allow "./deploy.sh"
    read "./build"
    environment allow ["APP_ENV", "DEPLOY_TARGET"]
    network allow ["deploy.example.com"]
  }

  limits {
    timeout 60s
    memory 128mb
  }

  run {
    shell.exec("./deploy.sh")
  }
}
```

## Task Dependencies

Tasks should support dependencies:

```LogicN
task build {
  depends [clean, check]

  run {
    compiler.build()
  }
}
```

Rules:

```text
detect circular dependencies
report dependency order
fail safely
do not continue after failed required dependency
allow optional dependencies only when explicit
```

## Dry Run Output

Dry run should show:

```text
task name
dependency order
effects requested
permissions requested
files that would be read
files that would be written
commands that would run
reports that would be generated
```

Dry run must not modify files.

## Task Reports

`logicn-core-tasks` should generate reports such as:

```text
build/reports/task-report.json
```

Example:

```json
{
  "task": "buildApi",
  "status": "passed",
  "effects": ["filesystem", "compiler", "reports"],
  "permissions": {
    "read": ["./src"],
    "write": ["./build"]
  },
  "durationMs": 240,
  "warnings": []
}
```

Unsafe shell report example:

```json
{
  "task": "legacyDeploy",
  "unsafe": true,
  "reason": "Temporary legacy deployment script until native LogicN deploy task exists",
  "effects": ["shell", "filesystem", "network"],
  "status": "passed"
}
```

## Task Error Handling

Tasks should return typed results:

```LogicN
task clean -> Result<TaskOk, TaskError> {
  effects [filesystem]

  permissions {
    write "./build"
  }

  run {
    filesystem.remove("./build")
    return Ok(TaskOk)
  }
}
```

Task errors should include task name, error code, safe message, internal
diagnostic message, source location, effect involved, permission involved and
suggested fix.

## Safe Built-In Task Operations

`logicn-core-tasks` should prefer safe built-in operations over raw shell:

```text
filesystem.copy()
filesystem.remove()
filesystem.mkdir()
filesystem.exists()
compiler.check()
compiler.build()
reports.generate()
schemas.generateJson()
openapi.generate()
tests.run()
```

These operations must be permission checked.

## Recommended Task Folder Structure

```text
/packages-logicn/logicn-core-tasks
  README.md
  TODO.md
  package.json
  tsconfig.json

  /src
    index.ts

    /parser
      parse-task-file.ts

    /runner
      run-task.ts
      run-task-graph.ts
      task-context.ts
      task-result.ts
      dry-run.ts

    /effects
      filesystem-effect.ts
      compiler-effect.ts
      reports-effect.ts
      environment-effect.ts
      shell-effect.ts

    /permissions
      check-task-permissions.ts
      filesystem-permissions.ts
      network-permissions.ts
      environment-permissions.ts
      shell-permissions.ts

    /reports
      task-report.ts
      unsafe-task-report.ts

    /errors
      task-error.ts
      permission-error.ts
      task-cycle-error.ts

    /types
      task-definition.ts
      task-effect.ts
      task-permission.ts
      task-status.ts

  /examples
    tasks.lln

  /tests
    task-parse.test.ts
    task-runner.test.ts
    task-permissions.test.ts
    dry-run.test.ts
    unsafe-shell.test.ts
```

Minimal early structure:

```text
/packages-logicn/logicn-core-tasks
  README.md
  TODO.md
  package.json
  tsconfig.json

  /src
    index.ts
    load-tasks.ts
    run-task.ts
    check-permissions.ts
    dry-run.ts
    task-report.ts
    types.ts

  /examples
    tasks.lln

  /tests
    run-task.test.ts
```

## CLI and Tasks Relationship

Flow:

```text
logicn-core-cli
  receives command
  loads project config
  loads tasks.lln
  calls logicn-core-tasks
  logicn-core-tasks checks permissions
  logicn-core-tasks runs task
  logicn-core-tasks returns result
  logicn-core-cli prints output
```

`logicn-core-tasks` should be usable without the CLI by other tools if needed.

## Production Rules

In production mode:

```text
unsafe shell should be denied unless explicitly allowed
tasks must declare effects
tasks must declare permissions
task failures must stop dependent tasks
secrets must be redacted
task reports should be generated
destructive tasks should require explicit confirmation or production-safe flag
```

Example destructive command:

```bash
LogicN task clean --env production
```

This should fail unless the task is production-approved.

## Development Rules

In development mode:

```text
more detailed diagnostics allowed
dry run encouraged
local task generation allowed
unsafe task warnings shown clearly
source-mapped task errors shown
```

Still denied in development:

```text
printing SecureString
printing bearer tokens
printing full cookies
unbounded shell execution
unbounded file deletion
silent network access
```

## Future Features

Later versions may support:

```text
deployment helper tasks
migration helper tasks
test runner integration
container build tasks
release tasks
package publishing tasks
cloud deployment adapters
CI/CD report output
machine-readable task graphs
```

These should be optional and package-based.
