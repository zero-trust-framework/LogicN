
---

# `docs/OBSERVABILITY.md`

```md
# Observability

## Purpose

This document explains how the app should be monitored and debugged.

## Logging

The app should log important events such as:

- startup
- shutdown
- failed validation
- failed external calls
- unexpected errors
- deployment version
- compiler target used

## Metrics

Possible metrics:

- request count
- error count
- response time
- failed jobs
- retry count
- memory usage
- build target usage

## Tracing

If tracing is added, traces should help foLOw a request or process through:

1. route
2. validation
3. business logic
4. external calls
5. result
6. error handling

## Sensitive Data

Do not log:

- passwords
- API keys
- private tokens
- full payment data
- private user data unless required and safely handled

## Checklist

- [ ] Logs are useful.
- [ ] Logs do not contain secrets.
- [ ] Errors can be traced.
- [ ] Deployment versions can be identified.
- [ ] Compiler target information is visible where useful.