# LogicN App

> **APP-LAYER TEMPLATE / SCAFFOLD — not a finished app.**
> `logicn-framework-example-app` is one of three **app-layer framework templates**
> (`logicn-framework-app-kernel`, `logicn-framework-api-server`,
> `logicn-framework-example-app`). It is an **empty example/app scaffold** showing
> where a consumer's own application code would live — it sits **above** the LogicN
> language + core runtime, is **not** part of the language or compiler, and is
> **not** the workspace default build target. Use it as a starting template, not as
> a shipped application. For what the framework layer is (and is explicitly NOT) and
> the phased build order, see the layer design doc:
> [`docs/Knowledge-Bases/logicn-framework-layer-design.md`](../../docs/Knowledge-Bases/logicn-framework-layer-design.md).

`packages-logicn/logicn-framework-example-app` is the bespoke application package for this workspace.

Use this package for:

```text
app entry files
app routes
app modules
app tests
app build configuration
app-specific source code
```

Do not put LogicN language documentation, package design notes or reusable framework
features here.

Package rule:

```text
packages-logicn/logicn-framework-example-app is the app.
packages-logicn/LogicN-* are reusable LogicN packages.
docs/ is app planning and operational documentation.
```
