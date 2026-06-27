# Outbound egress: force-HTTPS boot setting + local-dev loopback + internal-proxy allow-list

**Owner asks (2026-06-27):** "add something in the main/boot settings to force https on http" + "be a bit
smart and not block local development like `http://localhost`" + "even in production we need to work with an
internal proxy." Shipped: `5f73cb2` (force-HTTPS) + `74d720c` (loopback-dev) + `b6033e1` (internal-proxy
allow-list). Source of truth: `@galerina/core-config` `resolveEgressTls`
(`packages-galerina/galerina-core-config/src/posture.ts`); enforced at the outbound dial
(`galerina-core-compiler/src/stdlib.ts` `networkAsync`) over the `@galerina/core-network` egress guard.

## Behaviour (fail-secure on every axis)

| Outbound target | Default (no env) | Dev signal* | Production | Plaintext opt-out** | Allow-listed*** |
|---|---|---|---|---|---|
| `https://public:443` | ✅ allow | ✅ | ✅ | ✅ | ✅ |
| `https://public:8443` (odd port) | ❌ port denied | ❌ | ❌ | ✅ (ports unlocked) | ✅ |
| `http://public` (plaintext) | ❌ TLS required | ❌ | ❌ | ✅ | ✅ |
| `http://localhost:3000` (loopback) | ❌ SSRF | ✅ **allow** | ❌ | ✅ (plaintext) | ✅ |
| `http://proxy.internal:8080` (internal proxy) | ❌ SSRF | ❌ SSRF | ❌ SSRF | ❌ SSRF | ✅ **allow** |
| `http://10.0.0.5` / `169.254.169.254` (private/metadata) | ❌ SSRF | ❌ SSRF | ❌ SSRF | ❌ SSRF | ❌ SSRF (unless that exact host is listed) |

\* **Dev signal** = `NODE_ENV=development` OR `GALERINA_PROFILE=development` OR `GALERINA_ALLOW_LOCALHOST=true`.
Opens **loopback ONLY** (localhost / 127.0.0.0/8 / ::1) — never private LAN, metadata, or link-local — and
**never in production**. A localhost dev server is local IPC, so TLS + port checks are skipped for it.

\** **Plaintext opt-out** = `GALERINA_ALLOW_PLAINTEXT_EGRESS=true` (operator override; relaxes force-HTTPS
entirely — not for production). Surfaced (`relaxed: true`), never silent.

\*** **Internal-proxy allow-list** = `GALERINA_EGRESS_ALLOWED_HOSTS=host1,host2` (comma/space-separated exact
hosts). Admits those hosts in **EVERY environment including production** — over plaintext / any port / internal
host — bypassing SSRF + force-HTTPS **for the listed hosts ONLY** (everything else stays denied). For a corp
egress proxy: `even in production we work with an internal proxy` without relaxing the posture for anything
else. Allow-listed hosts also skip the DNS-rebind recheck (the allow-list IS the explicit trust decision).

## Why this shape
- **Force-HTTPS** stops payload/credential leakage over plaintext to anything that leaves the machine, and the
  `[443]` port lock is egress filtering against exfiltration to non-web service ports (22/3306/6379/…).
- **Loopback-dev** keeps `http://localhost` working for local development without weakening SSRF for any
  remote target — the most-secure default (deny loopback) holds unless an explicit development signal is present.
- **Internal-proxy allow-list** is the production-valid escape hatch: an operator names the exact hosts they
  trust (a corp egress proxy / internal service), and ONLY those are admitted — over plaintext / any port /
  internal host — in every environment. It is exact-host, not a category relaxation, so the SSRF posture for
  everything else is unchanged; an allow-listed host is operator-trusted, so it also skips the DNS-rebind recheck.
- Ordering: the SSRF host-category denial runs FIRST, so a plaintext URL to an internal host is still reported
  as the SSRF finding; force-HTTPS / port checks apply only to an otherwise-allowed PUBLIC host (loopback +
  allow-listed hosts short-circuit those checks).

## Tests
`galerina-core-network/tests/egress-guard.test.mjs` (guard + allowLoopback) · `galerina-core-config/tests/
egress-tls.test.mjs` (resolveEgressTls) · `galerina-core-compiler/tests/stdlib/force-https-egress.test.mjs`
(dial: force-HTTPS, loopback-dev, internal-proxy-in-production, fail-secure, production-denies-loopback). Full suite 60/60 · 5,945.

## Follow-up (owner-gated)
Thread the egress policy fully through `StdlibContext`→interpreter→cli for per-route / per-config control +
audit (today it's an env knob + the core-config SoT). See [outstanding-rd-and-todos](galerina-outstanding-rd-and-todos-2026-06-23.md).
