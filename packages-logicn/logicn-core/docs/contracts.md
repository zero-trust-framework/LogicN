# Contracts

LogicN contracts describe externally visible behaviour that the compiler can validate or report.

The focused source example is:

```text
../examples/contracts.lln
```

It shows typed request/response records, a secure flow signature, explicit
`Result<T, E>` errors, declared effects and strict comments that can be extracted
into reports. Route-level API contracts are shown in `../examples/api-orders.lln`.

## Contract Types

```text
API request and response contracts
webhook payload contracts
JSON schema contracts
target capability contracts
memory safety contracts
diagnostic report contracts
module visibility contracts
```

## Contract Rule

If LogicN can generate or validate a contract, the build should be able to explain:

```text
where it came from
which source file defines it
which target or runtime uses it
which diagnostics apply
which generated report contains it
```
