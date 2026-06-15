# JavaScript, TypeScript and Framework Target Examples

Status: Draft.

These examples show how LogicN should expose safe JavaScript, TypeScript, Node, WASM
and framework-adapter outputs without becoming React, React Native, Angular or
Node framework syntax.

---

## Good Examples

ESM JavaScript output:

```LogicN
target javascript {
  module esm
  typescript_declarations true
  source_maps true
}
```

Node output:

```LogicN
target node {
  module esm
  version ">=22"
  workers true
  source_maps true
}
```

Type-safe model export:

```LogicN
export client_safe type UserProfile {
  id: UserId
  name: String
  email: Email
}
```

Client-safe pure flow:

```LogicN
export client_safe pure flow calculateVat(subtotal: Money) -> Money {
  return subtotal * 0.20
}
```

Server-only API handler:

```LogicN
export server_only secure flow createOrder(req: Request) -> Result<Response, ApiError>
effects [database.write, network.inbound] {
  ...
}
```

Worker-safe compute:

```LogicN
export worker_safe pure vector float flow createEmbedding(text: Text) -> TextEmbedding {
  compute auto {
    return TextEmbeddingModel.encode(text)
  }
}
```

React adapter output:

```LogicN
target react-adapter {
  hooks true
  fetch_clients true
  validation_schemas true
}
```

React Native adapter output:

```LogicN
target react-native-adapter {
  hooks true
  fetch_clients true
  validation_schemas true
  native_boundary_manifest true
  permissions_report true
}
```

Angular adapter output:

```LogicN
target angular-adapter {
  services true
  validators true
  signal_wrappers true
}
```

Framework-neutral API source:

```LogicN
api OrdersApi {
  POST "/orders" {
    request CreateOrderRequest
    response CreateOrderResponse
    handler createOrder
  }
}
```

---

## Bad Examples

Client-safe flow reading a secret:

```LogicN
export client_safe secure flow getSecret() -> SecureString
effects [secret.read] {
  return env.secret("API_KEY")
}
```

Expected diagnostic:

```text
client_export_forbidden_effect
```

Reason:

```text
client_safe exports cannot use secret.read or be emitted into browser bundles.
```

---

Server-only flow exported to React client adapter:

```LogicN
target react-adapter {
  hooks true
  include server_only
}
```

Expected diagnostic:

```text
server_only_export_in_client_adapter
```

Reason:

```text
React client wrappers must not expose server_only exports directly.
```

---

Worker-safe flow using DOM:

```LogicN
export worker_safe flow readTitle() -> String
effects [dom.read] {
  return document.title
}
```

Expected diagnostic:

```text
worker_export_forbidden_effect
```

Reason:

```text
worker_safe exports cannot depend on DOM effects.
```

---

React component syntax in LogicN core:

```LogicN
react component OrderCard {
  jsx "<div>{order.id}</div>"
}
```

Expected diagnostic:

```text
framework_component_syntax_not_core_language
```

Reason:

```text
React components and JSX belong in React packages or adapter output, not core LogicN.
```

---

React Native screen syntax in LogicN core:

```LogicN
react_native screen OrderScreen {
  tsx "<View><Text>{order.id}</Text></View>"
}
```

Expected diagnostic:

```text
mobile_framework_syntax_not_core_language
```

Reason:

```text
React Native screens, JSX/TSX, navigation and native project files belong in
React Native packages or adapter output, not core LogicN.
```

---

Angular decorator syntax in LogicN core:

```LogicN
@Component({
  selector: "order-card"
})
class OrderCard {}
```

Expected diagnostic:

```text
framework_decorator_syntax_not_core_language
```

Reason:

```text
Angular decorators and components belong in generated Angular adapter code or
Angular source files, not core LogicN syntax.
```

---

## Expected Reports

```text
js-target-report.json
typescript-declarations-report.json
framework-boundary-report.json
framework-adapter-manifest.json
react-native-native-boundary-report.json
react-native-permissions-report.json
wasm-bridge-report.json
worker-bridge-report.json
client-server-split-report.json
```

Reports should explain:

```text
which exports are client_safe, server_only or worker_safe
which effects caused rejected client exports
which TypeScript declarations were generated
which framework adapter files were generated
which React Native native boundaries and permissions were declared
which WASM bridge functions exist
which worker exports transfer, clone or reject data
which generated locations map back to .lln source
```
