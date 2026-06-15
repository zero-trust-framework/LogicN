# LogicN Data DB

`logicn-data-db` defines the umbrella typed database boundary contracts.

LogicN should treat the database as a typed, validated, permissioned and
reportable data boundary.

Use this package for:

```text
database model flow contracts
typed query and command boundaries
safe response mapping requirements
parameterised database access policy
raw SQL denial policy
model permission integration
database archive references
database report index contracts
```

It must not implement a database engine, ORM, migration tool or provider
adapter.
