# Reports: Contract Index

## Purpose

The contract index report lists all contract boundaries in the application.

## Contains

```text
contract id
contract type
source file
source location
related route, flow, package or model
required reports
```

## Security Rules

- Missing public boundary contracts must be reported.
- Contract conflicts must link to the source declarations.
- AI-safe summaries should use contract names rather than raw payload examples.

## v1 Scope

Request, response, model, flow, policy and package contract indexing.
