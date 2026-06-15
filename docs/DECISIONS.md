# Decisions

This file records important project decisions.

## Decision Template

### Decision Title

**Date:** YYYY-MM-DD

**Status:** Proposed / Accepted / Rejected / Replaced

**Context:**

Describe the situation.

**Decision:**

Describe the decision.

**Reason:**

Explain why this decision was made.

**Consequences:**

Describe the impact of the decision.

---

## Decisions

### Keep Low-Bit AI Syntax Backend-Neutral

**Date:** 2026-05-08

**Status:** Accepted

**Context:**

Microsoft BitNet provides optimized 1-bit/1.58-bit LLM inference, with
CPU-focused support that is useful when GPU, NPU or other accelerators are not
available. BitNet b1.58 uses ternary weights, which resembles LogicN `Tri` values
but does not have the same language-level meaning.

**Decision:**

LogicN will model low-bit AI as a generic compute target through `low_bit_ai` and
`ternary_ai`. BitNet is an optional backend inside `logicn-ai-lowbit`, not a source
syntax target and not part of `logicn-core` or `logicn-core-logic`. Generic AI inference
contracts belong in `logicn-ai`. CPU fallback planning belongs in `logicn-target-cpu`,
and optimized CPU kernel contracts belong in `logicn-cpu-kernels`.

**Reason:**

This keeps LogicN CPU/binary compatible by default while allowing a faster local AI
path for compatible low-bit models. It also avoids locking LogicN source syntax to
one named backend that could later be replaced. Language semantics stay in
`logicn-core` and `logicn-core-logic`, while AI inference and CPU kernel concerns live in
dedicated packages.

**Consequences:**

Compute policies may select `low_bit_ai` or `ternary_ai` as AI inference
fallbacks and must report the selected backend. AI output remains untrusted by
default and cannot directly authorize high-impact actions.

---

### Keep Project Graph Backends Swappable

**Date:** 2026-05-08

**Status:** Accepted

**Context:**

Graphify-style tooling can help LogicN generate project knowledge graphs from code,
docs and other project material. However, Graphify is an implementation choice
that may be replaced by another graph tool or LogicN-native scanner later.

**Decision:**

LogicN will expose generic project graph commands and contracts such as `LogicN graph`,
graph nodes, graph edges, graph reports and graph backend policy. Graphify may
be used as an optional backend, including from a pinned Git package, but it must
not become LogicN syntax or a required CLI command.

**Reason:**

This keeps LogicN project graph output stable while allowing the underlying graph
backend to change. It also prevents AI/tooling support from becoming a compiler
or runtime authority.

**Consequences:**

Project graph backends must be selected by policy. Git-sourced backends must be
explicitly allowed and pinned. Model-assisted extraction remains opt-in and
reported.
