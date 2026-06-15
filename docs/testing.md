# Testing

## Summary

This workspace currently uses the LogicN core prototype for checked Run Mode smoke
tests. These tests execute `.lln` source directly and do not produce compiled
artefacts.

## Current Smoke Tests

The app-kernel package has checked Run Mode fixtures:

```text
packages-logicn/logicn-framework-app-kernel/tests/hello-world.lln
packages-logicn/logicn-framework-app-kernel/tests/vector-function.lln
packages-logicn/logicn-framework-app-kernel/tests/sum.lln
packages-logicn/logicn-framework-app-kernel/tests/decimal-sum.lln
packages-logicn/logicn-framework-app-kernel/tests/json-return.lln
```

Run all app-kernel fixtures from the workspace root:

```bash
npm.cmd --prefix packages-logicn/logicn-framework-app-kernel test
```

Expected output includes:

```text
hello from LogicN app kernel test
vector total: 6
sum: 5
decimal sum: 3.50
json ids: 1,2,3 test: xxx
```

## Test Types

- Checked Run Mode smoke tests
- Unit tests
- Integration tests
- Security checks
- Manual testing
- Build verification

## Test Structure

```text
packages-logicn/logicn-framework-example-app/tests/
|-- unit/
`-- integration/

packages-logicn/logicn-framework-app-kernel/tests/
|-- hello-world.lln
|-- vector-function.lln
|-- sum.lln
|-- decimal-sum.lln
`-- json-return.lln
```
