# Profile Installers

## Purpose

LogicN should use one language and one shared syntax, with different project
profiles controlling packages, effects, targets and runtime rules.

Do not create separate LogicN languages for web apps, agents, systems services
or kernel research.

Use:

```text
same LogicN syntax
same compiler frontend
same core type system
different profiles
different allowed packages
different allowed effects
different installer presets
```

## Installer Position

LogicN may expose different installer entry points or templates for convenience,
but they must resolve through the same package/profile system.

Recommended model:

```text
logicn install --profile web_app
logicn install --profile server_app
logicn install --profile agent_app
logicn install --profile systems_service
logicn install --profile kernel
```

Friendly wrappers may exist:

```text
logicn new web
logicn new server
logicn new agent
logicn new systems-service
logicn new kernel-research
```

Those wrappers must not bypass profile checks. They should only select a
profile, scaffold expected files and install the allowed package set.

Do not make unrelated installers with separate dependency rules, separate syntax
rules or separate compiler behavior.

## Profile Families

### `web_app`

For HTTP APIs, webhooks and normal backend applications.

Allowed package families:

```text
logicn-core-*
logicn-data-*
logicn-db-*
logicn-framework-app-kernel
logicn-framework-api-server
logicn-core-network
logicn-core-security
logicn-core-config
logicn-core-reports
logicn-target-wasm
logicn-target-cpu
```

Denied package families:

```text
logicn-os
kernel/driver packages
raw hardware packages
enterprise-only packages unless explicitly unlocked
```

Allowed effects should focus on typed HTTP, validation, database access,
network calls, safe logging, queues and deployment reports.

Denied effects include raw memory, MMIO, DMA, interrupt control and kernel mode.

### `server_app`

For long-running services, workers, scheduled tasks and queues.

Allowed package families:

```text
logicn-core-*
logicn-data-*
logicn-db-*
logicn-framework-app-kernel
logicn-core-runtime
logicn-core-network
logicn-core-security
logicn-core-config
logicn-core-reports
logicn-target-cpu
logicn-target-wasm
logicn-target-native
```

Server apps may share most web-app packages, but should not require route/API
packages unless the project actually exposes HTTP.

### `agent_app`

For local and small-team AI agent workflows.

Allowed package families:

```text
logicn-core-*
logicn-ai
logicn-ai-agent
logicn-ai-lowbit
logicn-ai-neural
logicn-ai-neuromorphic
logicn-core-runtime
logicn-core-security
logicn-core-config
logicn-core-reports
logicn-target-cpu
logicn-target-wasm
logicn-target-ai-accelerator
```

Agent profiles should allow supervised local agents, typed messages, tool
permissions, local audit logs and provider-neutral AI contracts.

Enterprise agent orchestration, central dashboards, team governance, approval
queues and compliance evidence exports remain enterprise-only and locked by
`../ENTERPRISE.md` until explicitly unlocked.

### `systems_service`

For low-level user-space services, native daemons and infrastructure tooling.

Allowed package families:

```text
logicn-core-*
logicn-target-native
logicn-target-cpu
logicn-core-network
logicn-core-security
logicn-core-config
logicn-core-reports
future systems packages
```

Systems services may require stricter memory and allocation rules than normal
web/server profiles.

Denied package families:

```text
logicn-framework-api-server unless explicitly needed
logicn-os
kernel/driver packages
enterprise-only packages unless explicitly unlocked
```

### `kernel`

Kernel and driver work is last-stage research only.

The profile may be documented as a future profile, but it must not be made an
active v1 installer target.

Allowed future package families:

```text
logicn-core
logicn-core-compiler
logicn-core-security
logicn-target-native
future systems packages
future OS/kernel packages
```

Denied packages:

```text
logicn-framework-api-server
logicn-framework-app-kernel
logicn-ai-agent
logicn-data-*
logicn-db-*
normal web/server packages
enterprise-only packages unless explicitly unlocked
```

Kernel profile requirements should include:

```text
no hidden allocation
no GC
deterministic memory
reviewed unsafe blocks
explicit hardware permissions
kernel-safe reports
```

Until the core compiler, parser, checker, memory model and package manager are
stable, kernel and driver profiles remain documentation-only.

## Package Layer Rule

Use one-way dependencies.

Good:

```text
web/server packages -> core runtime/security/config/reports -> core
agent packages -> core runtime/security/reports -> core
target packages -> core compiler/reports -> core
future systems packages -> core
future OS packages -> future systems packages -> core
```

Bad:

```text
logicn-core depends on web/server/agent packages
web/server packages depend on OS/kernel packages
OS/kernel packages depend on web/API packages
free/open packages depend on locked enterprise packages
```

## Installer Resolution Rule

Installers must install the smallest package set required by the selected
profile.

They must not install every LogicN package by default.

Required installer behavior:

- read the selected project profile
- resolve only allowed package families
- deny packages blocked by that profile
- deny default-disabled development and benchmark packages in production
- deny enterprise-only packages unless explicitly unlocked
- produce a package resolution report
- record selected profile and package refs in `logicn.lock.json` once that
  schema exists

Recommended installer report fields:

```text
selected_profile
requested_packages
resolved_packages
denied_packages
denied_effects
target_outputs
enterprise_locked_packages
development_only_packages
production_overrides
```

## Compiler Enforcement

Installers should prevent invalid package sets early, but the compiler checker
must remain authoritative.

The future checker should validate:

```text
profile
package imports
effects
permissions
targets
unsafe boundaries
enterprise lock state
```

Example web-app denial:

```text
LOGICN-PROFILE-001

Package logicn.os is not allowed in profile web_app.

Move this code to a systems or kernel profile project.
```

Example kernel denial:

```text
LOGICN-PROFILE-002

Package logicn.web is not allowed in profile kernel.

Use a user-space service or management interface instead.
```

## Project Templates

Web app projects should scaffold:

```text
logicn.project.json
boot.lln
main.lln
api/
flows/
domain/
infrastructure/
policies/
```

Agent projects should scaffold:

```text
logicn.project.json
boot.lln
main.lln
agents/
tools/
workflows/
policies/
reports/
```

Systems service projects should scaffold:

```text
logicn.project.json
boot.lln
main.lln
services/
policies/
reports/
```

Kernel research projects should remain locked and should not be scaffolded as an
ordinary v1 project type.

## Recommended Decision

Use profile-aware installers, not separate languages.

The installer surface can feel different for different project types, but all
installers must use the same package resolver, lockfile, compiler frontend and
profile checker.
