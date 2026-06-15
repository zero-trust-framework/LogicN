# LogicN Target JS

`logicn-target-js` defines JavaScript output target planning contracts.

Use this package for:

```text
browser JavaScript output planning
Node.js JavaScript output planning
ES module output metadata
source map output rules
server-only import blocking for JS targets
secret and environment access denial for browser JS
JavaScript bundle report contracts
framework adapter output metadata
```

It must not become a JavaScript runtime, bundler, browser engine, Node API clone,
Express clone or frontend framework. It describes where LogicN output goes and
which safety checks must be reported.

`logicn-target-js` should work with `logicn-target-wasm` for hybrid browser
output: JavaScript for browser integration and WebAssembly for heavy
browser-safe compute.

For server-side JavaScript, Node.js support should be treated as an optional
target. It may emit Node-compatible module metadata, source maps and server
bundle reports, but LogicN applications must not be required to run on Node.js.
