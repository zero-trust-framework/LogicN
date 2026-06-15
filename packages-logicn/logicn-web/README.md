# LogicN Web

`logicn-web` is the umbrella package for browser-safe LogicN web contracts.

Use this package for:

```text
browser runtime profile boundaries
typed browser rendering pipeline ownership
shared web package policy
browser-safe imports and effects
web render, state, component, router and event package coordination
web reports index
```

It must not become a browser engine, JavaScript framework clone, CMS, admin UI,
page builder or mandatory frontend framework.

Core rule:

```text
Data received by the browser must be validated before it becomes UI.
```

Browser rendering should be package-owned and reportable:

```text
API response
  -> validate schema
  -> convert to typed state
  -> sanitise unsafe content
  -> compare with current UI state
  -> render or update only changed parts
  -> report errors, security and performance
```

Package split:

```text
logicn-web-render      typed safe browser rendering contracts
logicn-web-state       client state, diff and hydration contracts
logicn-web-components  component boundary and prop contracts
logicn-web-router      browser route, navigation and link contracts
logicn-web-events      typed browser event contracts
```

`logicn-data-json` owns JSON validation and decoding contracts.
`logicn-data-html` owns SafeHtml, sanitization and unsafe HTML reports.
`logicn-core-security` owns browser security policy, secret denial and report
redaction. `logicn-target-js` and `logicn-target-wasm` own output target
planning.
