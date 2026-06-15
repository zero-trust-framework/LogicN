# LogicN Data Query

`logicn-data-query` defines typed database query and command contracts.

Use this package for:

```text
typed query declarations
typed command declarations
parameterised access policy
raw SQL denial and exception policy
typed result contracts
missing-result handling with Option
query report contracts
```

Raw SQL is denied by default. Provider packages must use typed or
parameterised query contracts unless an explicit reviewed override exists.
