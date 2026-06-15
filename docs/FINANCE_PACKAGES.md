# Finance Packages

Status: archived post-v2 planning.

Finance package folders have been moved out of the active workspace to:

```text
C:\laragon\www\LogicN_Archive\packages-logicn\LogicN-finance-core
```

This document is retained as planning context only. Finance packages must not
be part of the active v1 build graph.

## Purpose

LogicN should treat finance as a serious domain package layer, not as core language
syntax and not as a claim that LogicN is ready to run live trading infrastructure.

The finance opportunity is strongest around safe data handling, typed
messaging, auditability, deterministic maths, market data, event streams,
research workflows and integration with mature systems.

## External Projects To Learn From

QuickFIX is an open-source FIX engine with FIX 4.0 through 5.0 SP2 and
FIXT 1.1 support, language bindings, database-backed stores, SSL/TLS and
pluggable stores/logging. QuickFIX/J is the Java implementation and describes
FIX as a messaging standard for real-time securities transactions.

QuantLib is a free/open-source quantitative finance library for modelling,
trading and risk management. OpenGamma Strata is an open-source analytics and
market-risk Java library with modules for measures, calculation, loaders,
pricers, market data, products, data and basics.

Apache Kafka is a distributed event-streaming platform used for high-performance
data pipelines, streaming analytics, integration and mission-critical
applications. FINOS FDC3 is an open standard for financial desktop applications
to interoperate through app launching, context sharing and intents.

OpenBB shows the value of connecting proprietary, licensed and public financial
data sources into research notebooks, REST APIs, dashboards and AI-agent workflows. GS Quant
shows how notebook-oriented tooling remains important for quant research, derivatives analysis,
trading strategies and risk-management workflows, while some APIs require
institutional credentials.

References:

- https://github.com/quickfix/quickfix
- https://github.com/quickfix-j/quickfixj
- https://www.quantlib.org/
- https://github.com/OpenGamma/Strata
- https://github.com/apache/kafka
- https://github.com/finos/FDC3
- https://github.com/OpenBB-finance/OpenBB
- https://github.com/goldmansachs/gs-quant

## Package Strategy

Start grouped:

```text
packages-logicn/LogicN-finance-core/
```

Split later only after contracts are stable:

```text
packages-logicn/LogicN-finance-core-math/
packages-logicn/LogicN-finance-core-calendar/
packages-logicn/LogicN-finance-core-market-data/
packages-logicn/LogicN-finance-core-order/
packages-logicn/LogicN-finance-core-fix/
packages-logicn/LogicN-finance-core-audit/
packages-logicn/LogicN-finance-core-compliance/
packages-logicn/LogicN-finance-core-risk/
packages-logicn/LogicN-finance-core-pricing/
packages-logicn/LogicN-finance-core-products/
packages-logicn/LogicN-finance-core-scenarios/
packages-logicn/LogicN-finance-core-fdc3/
```

Keep general infrastructure outside finance:

```text
packages-logicn/LogicN-stream/
packages-logicn/LogicN-stream-kafka/
packages-logicn/LogicN-schema-registry/
packages-logicn/LogicN-ffi/
packages-logicn/LogicN-ffi-cpp/
packages-logicn/LogicN-ffi-java/
packages-logicn/LogicN-ffi-python/
packages-logicn/LogicN-replay/
packages-logicn/logicn-core-runtime-low-latency/
```

## First Phase

Build contracts in this order:

```text
LogicN-finance-core-math
LogicN-finance-core-calendar
LogicN-finance-core-market-data
LogicN-finance-core-audit
LogicN-finance-core-fix
```

This keeps the beta realistic. LogicN should first prove it can model financial
data, rounding, identifiers, timestamps, market events, validation and audit
evidence safely.

## Later Phases

After the base contracts are stable:

```text
LogicN-stream-kafka
LogicN-schema-registry
LogicN-ffi-cpp
LogicN-ffi-java
LogicN-ffi-python
LogicN-finance-core-risk
LogicN-finance-core-pricing
LogicN-finance-core-fdc3
logicn-core-runtime-low-latency
LogicN-replay
```

Interop should be controlled by policy. A LogicN app may wrap mature external
finance systems, but the wrapper must declare memory isolation,
network permissions, credentials policy, audit requirements and fallback
behaviour.

## Non-Goals

Do not start finance support by building:

```text
full stock exchange matching engine
HFT engine
broker-dealer platform
settlement system
clearing system
custody platform
trading advice engine
```

These are regulated and high-risk systems. LogicN beta work should focus on typed
contracts, validation, replay, audit and safe integration first.
