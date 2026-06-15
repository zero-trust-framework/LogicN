# Server Platform Support

LogicN should support common server platforms without becoming those platforms.

Core rule:

```text
LogicN should not try to become Nginx, Apache, Node.js or Express.
LogicN should understand how to work with them, generate safe configuration for
them and optionally replace some of their jobs for LogicN-native apps.
```

This keeps LogicN deployment-friendly while preserving its route-first,
security-first design.

## Support Model

| Technology | Support level | LogicN role |
|---|---:|---|
| Nginx | Yes | Generate reverse proxy config |
| Apache | Yes | Generate vhost/reverse proxy config |
| Caddy | Yes | Generate simple HTTPS reverse proxy config |
| Node.js | Yes | Tooling platform and optional runtime target |
| Express | Optional | Adapter/interoperability target |
| Fastify / Hono | Later | Adapters if useful |
| LogicN-native API server | Yes | Long-term preferred secure API runtime |
| PHP-FPM style | Maybe | Interop only, not core LogicN |
| Static file serving | Yes | Basic built-in or reverse proxy-generated |
| WebSockets | Later | Typed real-time route support |
| gRPC | Later | Typed service target |
| WASM edge runtimes | Later | Secure portable deployment target |

## Reverse Proxies

LogicN does not need to copy Nginx, Apache or Caddy as language features. Those
tools are usually used for:

```text
reverse proxying
static file serving
TLS/HTTPS termination
load balancing
request routing
compression and cache layers
legacy PHP/server integration
```

LogicN should support them as deployment targets.

```LogicN
deploy_profile production {
  target linux_vps

  reverse_proxy nginx {
    domain "api.example.com"
    tls auto
    proxy_to "127.0.0.1:8080"

    security {
      max_body_size 1mb
      deny_hidden_files true
      security_headers true
      rate_limit "100 requests per minute"
    }
  }
}
```

Generated output may include:

```text
nginx.conf
apache-vhost.conf
Caddyfile
TLS checklist
security headers
rate-limit config
health check config
```

LogicN should derive those configs from route and deployment policy:

```text
This app needs HTTPS.
This route has max body size 1 MB.
This route needs webhook raw body.
This endpoint is health-only.
This path must not serve hidden files.
```

## Node.js

Node.js should be supported in two different ways.

First, as a tooling platform. Early LogicN tooling may be written in
TypeScript/Node.js:

```text
LogicN compiler prototype
LogicN CLI
LogicN package tooling
LogicN dev server
LogicN documentation generator
```

This does not mean every LogicN application must run on Node.js.

Second, as an optional runtime target:

```bash
logicn build --target node
```

Output may include:

```text
build/node/app.js
build/node/package.json
build/node/source-map.json
build/node/security-report.json
```

Node.js is a target, not the identity of LogicN. Long-term targets may include:

```text
native executable
WASM/WASI
container runtime
server runtime
edge runtime
Node.js target
```

## Express And Framework Adapters

LogicN should not depend on Express, but it should be possible to generate or
provide adapters for Express and similar frameworks.

Express-style code often leaves important behaviour spread across middleware
and convention:

```javascript
app.post("/orders", async (req, res) => {
  const order = await createOrder(req.body);
  res.json(order);
});
```

LogicN route contracts should be more explicit:

```LogicN
api OrdersApi {
  POST "/orders" {
    request CreateOrderRequest
    response OrderResponse

    errors [
      InvalidOrder,
      PaymentFailed,
      DatabaseUnavailable
    ]

    max_body_size 128kb
    timeout 5s

    handler CreateOrder.handle
  }
}
```

The route manifest should preserve:

```text
allowed method
request type
response type
possible errors
body size
timeout
handler
auth, CSRF, idempotency and effect policy
```

Adapters must not hide those facts. Express, Fastify, Hono, Lambda or edge
adapters should compile from the same LogicN route manifest and call the same
Secure App Kernel boundary.

## LogicN-Native API Server

LogicN should eventually have a native secure API server for LogicN-native apps.

```LogicN
server LogicNApiServer {
  port env "PORT"

  security {
    default_deny true
    max_body_size 1mb
    safe_errors true
    request_id true
    structured_logs true
  }

  routes [
    OrdersApi,
    PaymentWebhookApi,
    HealthApi
  ]
}
```

Recommended path:

```text
Short term: Node.js target and Express/Fastify adapters for adoption.
Long term: LogicN-native secure API server.
Always: generate Nginx, Apache and Caddy reverse proxy config.
```

## Server Concepts

LogicN should support web/server concepts directly as typed contracts:

```text
api
route
request
response
middleware-like policies
webhook
raw body
headers
cookies
sessions
CORS
rate limits
body limits
timeouts
health checks
readiness checks
safe errors
structured logs
request IDs
TLS/reverse proxy awareness
static files
streaming responses
file uploads
```

Later support may include:

```text
WebSockets
gRPC
server-sent events
edge worker routes
```

Webhook example:

```LogicN
api PaymentWebhookApi {
  POST "/webhooks/payment" {
    request raw_body
    response WebhookAccepted

    require_header "X-Signature-SHA256"
    max_body_size 64kb
    timeout 3s

    verify hmac_sha256 {
      secret env "WEBHOOK_SECRET"
      payload raw_body
      header "X-Signature-SHA256"
    }

    handler PaymentWebhook.handle
  }
}
```

## What LogicN Should Avoid

LogicN should avoid copying legacy server patterns into the language:

```text
global request objects
magic middleware order
untyped request bodies
silent fall-through routes
hidden exceptions
unsafe raw string headers
manual secret handling
manual body size checks everywhere
manual CORS scattered across files
```

LogicN should make these typed, declared and reportable instead.

## App Shape

A server-capable LogicN app might look like:

```text
my-logicn-app/
|-- api/
|   |-- orders-api.lln
|   `-- payment-webhook-api.lln
|-- flows/
|   `-- create-order.lln
|-- domain/
|   `-- orders.lln
|-- infrastructure/
|   `-- payment-provider.lln
|-- server/
|   `-- logicn-server.lln
|-- deploy/
|   |-- nginx.lln
|   |-- docker.lln
|   `-- kubernetes.lln
`-- policies/
    |-- security-policy.lln
    |-- crash-policy.lln
    `-- deployment-policy.lln
```

Example server file:

```LogicN
server AppServer {
  runtime logicn_native

  port env "PORT"

  routes [
    OrdersApi,
    PaymentWebhookApi
  ]

  health {
    live "/health"
    ready "/ready"
  }

  security {
    safe_errors true
    redact_secrets true
    request_id true
    rate_limit default "100/minute"
  }
}
```

## Package Ownership

```text
logicn-framework-api-server
  built-in HTTP API serving package

logicn-framework-app-kernel
  validation, auth, CSRF, idempotency, route policy and typed handler dispatch

logicn-target-js
  JavaScript/Node output planning and source-map/report contracts

logicn-target-wasm
  WASM/WASI and edge-compatible output planning

future adapter packages
  Express, Fastify, Hono, Lambda, Cloudflare and similar adapter output

deployment tooling
  Nginx, Apache, Caddy, systemd, Docker and Kubernetes generated config
```

## Design Rule

```text
Nginx / Apache / Caddy = deployment and reverse proxy targets.
Node.js = tooling platform and optional runtime target.
Express = optional compatibility adapter.
LogicN-native server = preferred long-term secure API runtime.
```

LogicN should let developers write route-first, typed API contracts and then
generate or target the appropriate runtime and deployment files.
