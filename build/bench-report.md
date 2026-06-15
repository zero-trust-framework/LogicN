# LogicN Benchmark Report

## Key

**Traffic lights** (🚦) compare each runtime to **Node.js** (the production baseline):

| Light | Meaning | Speed vs Node.js |
|---|---|---|
| 🟢 | Green — fast | At or faster than Node.js (within 10%, or quicker) |
| ⚪ | White — comparable | Within 2× of Node.js |
| 🟡 | Yellow — a little slower | 2–10× slower than Node.js |
| 🔴 | Red — much slower | 10–100× slower than Node.js |
| ⚫ | Black — terrible | 100×+ slower than Node.js |

**Medals** (🥇🥈🥉) rank runtimes by throughput within each benchmark — fastest first.

**Runtimes:**
- **Rust (generic / AVX2)** — native compiled baseline (ceiling).
- **Node.js** — V8 JIT (production baseline for traffic lights).
- **Python** — CPython interpreter (comparison floor).
- **WASM ▶ production** — `logicn run` → WAT → WebAssembly. Governance gates compiled IN. **This is the production governed runtime** — the row to read for shipping cost.

> **Taxonomy — read this before the governance numbers.** The three `⟨interp⟩` rows below are **Stage-A interpreter diagnostic tiers**, NOT the production path. They exist to (a) *measure* the cost of pre-planning vs runtime proving, and (b) *verify* the WASM compiler against the reference interpreter. Do not read the interpreter's governed throughput as the shipping governance cost — read the **WASM ▶ production** row for that.
- **LogicN governed ⟨interp⟩** — Stage-A: full governance tree-walker (capabilities + audit + proof rebuilt per call). *Diagnostic worst-case.*
- **LogicN manifest ⟨interp⟩** — Stage-A: pre-verified runtime manifest, governance erased at runtime. *Diagnostic.*
- **LogicN passive ⟨interp⟩** — Stage-A: pre-compiled deployment model with LRU result cache (warm path). *Diagnostic.*

---

## 1. Throughput — Winner per Benchmark

> **🏆 Winner** = fastest runtime for that workload. Medals (🥇🥈🥉) show top 3 in the detail tables below.
> 🖥️ CPU = CPU execution | 🎮 GPU = real GPU dispatch (Deno WebGPU on NVIDIA GeForce RTX 2060)

| Benchmark | 🏆 Winner | Winner Speed | LogicN (governed) | gov ÷ Winner | gov ÷ Python (floor) | Why the winner wins |
|---|---|---|---|---|---|---|
| **compute-mix** | **Rust AVX2** 🖥️ | **121.17M/s** | 205.5K/s | 0.0017× (590× slower) | ✅ **1.15×** faster | Native compiled — LLVM optimised, may auto-vectorise |
| **arithmetic-threshold** | **WASM ▶ production** 🖥️ | **3.98B/s** | 822.0K/s | 0.00021× (4.8K× slower) | ❌ 0.18× (5.6× slower) | WASM JIT — zero alloc, native-speed compiled |
| **six-digit-guess** | **Rust (generic)** 🖥️ | **78.42M/s** | 44.2K/s | 0.00056× (1.8K× slower) | ❌ 0.57× (1.7× slower) | Native compiled — LLVM optimised, may auto-vectorise |
| **record-allocation** | **WASM ▶ production** 🖥️ | **924.34M/s** | 119.5K/s | 0.00013× (7.7K× slower) | ❌ 0.09× (10.9× slower) | WASM JIT — zero alloc, native-speed compiled |
| **fibonacci-recursive** | **LogicN passive ⟨interp⟩** 🖥️ | **92.3K/s** | 21.0/s | 0.00023× (4.4K× slower) | ✅ **4.43×** faster | LRU cache warm path (first-call winner: WASM ▶ production at 45.2K/s) |
| **collection-pipeline** | **WASM ▶ production** 🖥️ | **2.07B/s** | 682.1K/s | 0.00033× (3.0K× slower) | ✅ **329.03×** faster | WASM JIT — zero alloc, native-speed compiled |
| **governance-cost** | **Rust (generic)** 🖥️ | **882.99M/s** | 3.3K/s | 0.00000× (264.9K× slower) | ❌ 0.09× (11.2× slower) | Native compiled — LLVM optimised, may auto-vectorise |
| **hardware-targets** | **WASM ▶ production** 🖥️ | **171.49M/s** | 11.1K/s | 0.00006× (15.4K× slower) | n/a (no Python) | WASM JIT — zero alloc, native-speed compiled |
| **low-memory** | **WASM ▶ production** 🖥️ | **692.96M/s** | 125.0K/s | 0.00018× (5.5K× slower) | ✅ **212.58×** faster | WASM JIT — zero alloc, native-speed compiled |
| **gpu-compute** | **WASM ▶ production** 🖥️ | **1.27B/s** | 290.8K/s | 0.00023× (4.4K× slower) | ❌ 0.03× (36.0× slower) | WASM JIT — zero alloc, native-speed compiled |
| **matrix-multiply** | **WASM ▶ production** 🖥️ | **73.11M/s** | 21.8K/s | 0.00030× (3.3K× slower) | ✅ **460.04×** faster | WASM JIT — zero alloc, native-speed compiled |
| **crypto-ops** | **LogicN passive ⟨interp⟩** 🖥️ | **18.1K/s** | 254.0/s | 0.0140× (71× slower) | n/a (no Python) | LRU cache warm path (first-call winner: LogicN manifest ⟨interp⟩ at 5.3K/s) |
| **text-html** | **LogicN passive ⟨interp⟩** 🖥️ | **125.9K/s** | 613.0/s | 0.0049× (205× slower) | n/a (no Python) | LRU cache warm path (first-call winner: LogicN manifest ⟨interp⟩ at 4.8K/s) |
| **tri-logic** | **WASM ▶ production** 🖥️ | **519.71M/s** | 34.3K/s | 0.00007× (15.1K× slower) | n/a (no Python) | WASM JIT — zero alloc, native-speed compiled |
| **data-query** | **LogicN manifest ⟨interp⟩** 🖥️ | **219.3K/s** | 212.8K/s | 0.97× (1.0× slower) | n/a (no Python) | LogicN governed path wins this workload |
| **call-chain** | **Node.js** 🖥️ | **282.12M/s** | 67.9K/s | 0.00024× (4.2K× slower) | ❌ 0.03× (36.6× slower) | V8 JIT — wins when WASM N/A or string/async workload |
| **nbody** | **LogicN passive ⟨interp⟩** 🖥️ | **69.2K/s** | 61.2K/s | 0.89× (1.1× slower) | ✅ **1114.18×** faster | LRU cache warm path (first-call winner: LogicN governed ⟨interp⟩ at 61.2K/s) |
| **json-parse** | **LogicN passive ⟨interp⟩** 🖥️ | **97.8K/s** | 7.6K/s | 0.0778× (13× slower) | n/a (no Python) | LRU cache warm path (first-call winner: LogicN manifest ⟨interp⟩ at 9.3K/s) |
| http-throughput | — | — | — | — | — | No data |
| naming-check | — | — | — | — | — | No data |
| context-receipt | — | — | — | — | — | No data |
| intelligence-search | — | — | — | — | — | No data |
| provenance-trace | — | — | — | — | — | No data |

> **Python floor check:** LogicN (governed) beats Python on **6/12** benchmarks where both ran. Python is the like-for-like floor while the Stage-A runtime is still TypeScript-interpreted; Rust/Zig/WASM are the ceiling.

### Full Throughput Table (all runtimes)

| Benchmark | Rust AVX-512 | Rust AVX2 | Rust (generic) | C++ | Node.js | Python | LogicN passive ⟨interp⟩ | LogicN manifest ⟨interp⟩ | LogicN governed ⟨interp⟩ | WASM ▶ production | Deno WebGPU (NVIDIA GeForce RTX 2060) | Node/LogicN† (🖥️ CPU) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| compute-mix | — | **121.17M/s** | **118.42M/s** | — | 57.82M/s | 178.4K/s | 15.4K/s | 187.9K/s | 205.5K/s | **118.68M/s** | — | 281.4× |
| arithmetic-threshold | — | 1.56B/s | 1.56B/s | — | 735.44M/s | 4.56M/s | 43.4K/s | 895.2K/s | 822.0K/s | **3.98B/s** | — | 894.7× |
| six-digit-guess | — | 69.86M/s | **78.42M/s** | — | 2.78M/s | 77.3K/s | 17.7K/s | 45.8K/s | 44.2K/s | 72.17M/s | — | 63.0× |
| record-allocation | — | 795.89M/s | 779.59M/s | — | 24.12M/s | 1.30M/s | 44.1K/s | 128.4K/s | 119.5K/s | **924.34M/s** | — | 201.8× |
| fibonacci-recursive | — | 438.9/s | 477.1/s | — | 20.3/s | 4.7/s | **92.3K/s** | 24.0/s | 21.0/s | 45.2K/s | — | 0.96× |
| collection-pipeline | — | 1.17M/s | 419.4K/s | — | 7.3K/s | 2.1K/s | 104.8K/s | 662.3K/s | 682.1K/s | **2.07B/s** | — | 0.01× |
| governance-cost | — | 834.17M/s | **882.99M/s** | — | 1.94M/s | 37.2K/s | 107.5K/s | 2.3K/s | 3.3K/s | 14.69M/s | — | -46.6% gov overhead |
| hardware-targets | — | 1.16M/s | 1.17M/s | — | 895.2K/s | — | 126.4K/s | 25.0K/s | 11.1K/s | **171.49M/s** | — | 80.6× |
| low-memory | — | — | 132.3K/s | — | 69.1K/s | 587.8/s | 138.4K/s | 135.3K/s | 125.0K/s | **692.96M/s** | — | 0.55× |
| gpu-compute | — | — | 981.25M/s | — | 974.45M/s | 10.46M/s | 140.6K/s | 301.4K/s | 290.8K/s | **1.27B/s** | 3.79M/s | 3.4K× |
| matrix-multiply | — | — | 5.6K/s | — | 2.2K/s | 47.5/s | 107.1K/s | 23.2K/s | 21.8K/s | **73.11M/s** | 801.8/s | 0.10× |
| crypto-ops | — | — | — | — | — | — | **18.1K/s** | 5.3K/s | 254.0/s | — | — | — |
| text-html | — | — | — | — | — | — | **125.9K/s** | 4.8K/s | 613.0/s | — | — | — |
| tri-logic | — | — | — | — | — | — | 111.3K/s | 34.6K/s | 34.3K/s | **519.71M/s** | — | — |
| data-query | — | — | — | — | — | — | 80.7K/s | **219.3K/s** | **212.8K/s** | — | — | — |
| call-chain | — | — | — | — | **282.12M/s** | 2.48M/s | 67.8K/s | 69.0K/s | 67.9K/s | — | — | 4.2K× |
| nbody | — | — | — | — | 3.7K/s | 54.9/s | **69.2K/s** | 61.1K/s | 61.2K/s | — | — | 0.06× |
| json-parse | — | — | — | — | — | — | **97.8K/s** | 9.3K/s | 7.6K/s | — | — | — |
| http-throughput | — | — | — | — | — | — | — | — | — | — | — | — |
| naming-check | — | — | — | — | — | — | — | — | — | — | — | — |
| context-receipt | — | — | — | — | — | — | — | — | — | — | — | — |
| intelligence-search | — | — | — | — | — | — | — | — | — | — | — | — |
| provenance-trace | — | — | — | — | — | — | — | — | — | — | — | — |

> †`Node/LogicN > 1` = Node.js faster. `< 1` = LogicN faster (e.g. collection-pipeline).
> †fibonacci: LogicN=fib(20), others=fib(30) — different workload depth.
> **Bold** = winner (within 5% of fastest). 🖥️ CPU = CPU execution. 🎮 GPU = Deno WebGPU (NVIDIA GeForce RTX 2060).

## 1.5 Traffic Light Summary

> 🟢 = at/near best | ⚪ = within 2× | 🟡 = 2-10× slower | 🔴 = 10-100× slower | ⚫ = 100×+ slower

| Benchmark | WASM (Phase 27) | vs Rust | vs Node.js | LogicN governed | vs Rust | vs Node | Implication |
|---|---|---|---|---|---|---|---|
| compute-mix | 118.68M/s | 🟢 1.0× slower | 🟢 2.1× | 205.5K/s | ⚫ 589.7× slower | ⚫ 281.4× slower | WASM = native speed | governed needs sync |
| arithmetic-threshold | 3.98B/s | 🟢 2.5× | 🟢 5.4× | 822.0K/s | ⚫ 1903.2× slower | ⚫ 894.7× slower | WASM = native speed | governed needs sync |
| six-digit-guess | 72.17M/s | 🟢 1.1× slower | 🟢 25.9× | 44.2K/s | ⚫ 1773.7× slower | 🔴 63.0× slower | WASM = native speed | governed slow |
| record-allocation | 924.34M/s | 🟢 1.2× | 🟢 38.3× | 119.5K/s | ⚫ 6659.2× slower | ⚫ 201.8× slower | WASM = native speed | governed needs sync |
| fibonacci-recursive | 45.2K/s | 🟢 94.7× | 🟢 2230.8× | 21.0/s | 🔴 22.7× slower | 🟢 1.0× | WASM = native speed | governed ≈ Node |
| collection-pipeline | 2.07B/s | 🟢 1772.3× | 🟢 281889.7× | 682.1K/s | ⚪ 1.7× slower | 🟢 92.9× | WASM = native speed | governed ≈ Node |
| governance-cost | 14.69M/s | 🔴 60.1× slower | 🟢 7.6× | 3.3K/s | ⚫ 264924.8× slower | ⚫ 580.7× slower | WASM lags native | governed needs sync |
| hardware-targets | 171.49M/s | 🟢 146.9× | 🟢 191.6× | 11.1K/s | ⚫ 105.1× slower | 🔴 80.6× slower | WASM = native speed | governed slow |
| low-memory | 692.96M/s | 🟢 5239.6× | 🟢 10030.5× | 125.0K/s | 🟢 1.1× slower | 🟢 1.8× | WASM = native speed | governed ≈ Node |
| gpu-compute | 1.27B/s | 🟢 1.3× | 🟢 1.3× | 290.8K/s | ⚫ 3374.1× slower | ⚫ 3350.7× slower | WASM = native speed | governed needs sync |
| matrix-multiply | 73.11M/s | 🟢 13062.3× | 🟢 33886.5× | 21.8K/s | 🟢 3.9× | 🟢 10.1× | WASM = native speed | governed ≈ Node |
| crypto-ops | pending | — | — | 254.0/s | — | — |  |
| text-html | pending | — | — | 613.0/s | — | — |  |
| tri-logic | 519.71M/s | — | — | 34.3K/s | — | — |  |
| data-query | pending | — | — | 212.8K/s | — | — |  |
| call-chain | pending | — | — | 67.9K/s | — | ⚫ 4154.1× slower | governed needs sync |
| nbody | pending | — | — | 61.2K/s | — | 🟢 16.4× | governed ≈ Node |
| json-parse | pending | — | — | 7.6K/s | — | — |  |

## 2. Memory Allocation per Operation (low-memory benchmark)

> **Key metric:** bytes allocated on the JS heap per integer operation.
> WASM and bytecode VM should be near 0. Tree-walker allocates per AST node.

| # | 🚦 | Runtime | Bytes/Op | Throughput | Total Ops | Heap Δ |
|---|---|---|---|---|---|---|
| 🥇 | 🟢 | LogicN governed ⟨interp⟩ | -23.88 bytes/op ⚡ ~0 — no boxing | 125.0K/s | — | -239KB |
| 🥈 | 🟢 | Rust (generic) | 0.00 bytes/op ⚡ ~0 — no boxing | 132.3K/s | — | — |
| 🥉 | 🟢 | Node.js | 0.00 bytes/op ⚡ ~0 — no boxing | 69.1K/s | — | 7KB |
| 4 | ⚫ | Python | 0.00 bytes/op ⚡ ~0 — no boxing | 587.8/s | — | — |
| 5 | 🟢 | WASM ▶ production | 0.00 bytes/op ⚡ ~0 — no boxing | 692.96M/s | — | 504B |
| 6 | 🟢 | LogicN passive ⟨interp⟩ | 8 bytes/op ✓ low | 138.4K/s | — | 80KB |
| 7 | 🟢 | LogicN manifest ⟨interp⟩ | 18 bytes/op ⚠ moderate | 135.3K/s | — | 179KB |

> **Why this matters:** Every byte allocated is a byte the GC must later collect.
> WASM and the bytecode VM run with zero allocation — ideal for high-throughput governed services.
> The tree-walker's per-node allocation is the primary target of Phases 31-33.


## 2b. General Memory Usage

| Benchmark | Runtime | RSS | Peak RSS | Heap Used | Heap Δ (execution) |
|---|---|---|---|---|---|
| compute-mix | Rust AVX2 | — | — | — | — |
| compute-mix | Rust (generic) | — | — | — | — |
| compute-mix | Node.js | 41.0MB | 41.1MB | 4.6MB | — |
| compute-mix | Python | — | — | — | — |
| compute-mix | LogicN passive ⟨interp⟩ | 76.4MB | 76.4MB | 15.9MB | 20KB |
| compute-mix | LogicN manifest ⟨interp⟩ | 76.2MB | 76.2MB | 15.5MB | -2.2MB |
| compute-mix | LogicN governed ⟨interp⟩ | 76.3MB | 76.3MB | 17.2MB | 2.5MB |
| compute-mix | WASM ▶ production | 70.3MB | 70.3MB | 14.5MB | 21KB |
| arithmetic-threshold | Rust AVX2 | — | — | — | — |
| arithmetic-threshold | Rust (generic) | — | — | — | — |
| arithmetic-threshold | Node.js | 46.9MB | 47.2MB | 4.6MB | — |
| arithmetic-threshold | Python | — | — | — | — |
| arithmetic-threshold | LogicN passive ⟨interp⟩ | 77.1MB | 77.1MB | 17.6MB | 9KB |
| arithmetic-threshold | LogicN manifest ⟨interp⟩ | 77.0MB | 77.0MB | 16.6MB | 773KB |
| arithmetic-threshold | LogicN governed ⟨interp⟩ | 77.0MB | 77.0MB | 15.6MB | -434KB |
| arithmetic-threshold | WASM ▶ production | 76.7MB | 76.7MB | 15.7MB | 30KB |
| six-digit-guess | Rust AVX2 | — | — | — | — |
| six-digit-guess | Rust (generic) | — | — | — | — |
| six-digit-guess | Node.js | 51.5MB | 51.5MB | 6.9MB | — |
| six-digit-guess | Python | — | — | — | — |
| six-digit-guess | LogicN passive ⟨interp⟩ | 78.2MB | 78.2MB | 17.1MB | 37KB |
| six-digit-guess | LogicN manifest ⟨interp⟩ | 77.9MB | 77.9MB | 17.7MB | 428KB |
| six-digit-guess | LogicN governed ⟨interp⟩ | 77.8MB | 77.8MB | 16.2MB | 228KB |
| six-digit-guess | WASM ▶ production | 77.3MB | 77.3MB | 15.9MB | 960B |
| record-allocation | Rust AVX2 | — | — | — | — |
| record-allocation | Rust (generic) | — | — | — | — |
| record-allocation | Node.js | 47.7MB | 47.7MB | 4.7MB | — |
| record-allocation | Python | — | — | — | — |
| record-allocation | LogicN passive ⟨interp⟩ | 78.2MB | 78.2MB | 18.7MB | 57KB |
| record-allocation | LogicN manifest ⟨interp⟩ | 78.2MB | 78.2MB | 18.6MB | -497KB |
| record-allocation | LogicN governed ⟨interp⟩ | 78.1MB | 78.1MB | 18.6MB | -124KB |
| record-allocation | WASM ▶ production | 78.1MB | 78.1MB | 18.7MB | 48KB |
| fibonacci-recursive | Rust AVX2 | — | — | — | — |
| fibonacci-recursive | Rust (generic) | — | — | — | — |
| fibonacci-recursive | Node.js | 45.6MB | 45.6MB | 4.4MB | — |
| fibonacci-recursive | Python | — | — | — | — |
| fibonacci-recursive | LogicN passive ⟨interp⟩ | 78.5MB | 78.5MB | 17.0MB | 33KB |
| fibonacci-recursive | LogicN manifest ⟨interp⟩ | 78.4MB | 78.4MB | 17.9MB | -469KB |
| fibonacci-recursive | LogicN governed ⟨interp⟩ | 78.2MB | 78.2MB | 18.1MB | 1.3MB |
| fibonacci-recursive | WASM ▶ production | 78.5MB | 78.5MB | 16.8MB | 504B |
| collection-pipeline | Rust AVX2 | — | — | — | — |
| collection-pipeline | Rust (generic) | — | — | — | — |
| collection-pipeline | Node.js | 63.1MB | 63.1MB | 8.9MB | — |
| collection-pipeline | Python | — | — | — | — |
| collection-pipeline | LogicN passive ⟨interp⟩ | 78.6MB | 78.6MB | 17.3MB | 86KB |
| collection-pipeline | LogicN manifest ⟨interp⟩ | 78.6MB | 78.6MB | 17.8MB | 316KB |
| collection-pipeline | LogicN governed ⟨interp⟩ | 78.6MB | 78.6MB | 17.4MB | 348KB |
| collection-pipeline | WASM ▶ production | 78.6MB | 78.6MB | 17.0MB | 504B |
| governance-cost | Rust AVX2 | — | — | — | — |
| governance-cost | Rust (generic) | — | — | — | — |
| governance-cost | Node.js | 45.7MB | 45.7MB | 4.4MB | — |
| governance-cost | Python | — | — | — | — |
| governance-cost | LogicN passive ⟨interp⟩ | 78.9MB | 78.9MB | 17.9MB | -222KB |
| governance-cost | LogicN manifest ⟨interp⟩ | 78.9MB | 78.9MB | 17.5MB | -636KB |
| governance-cost | LogicN governed ⟨interp⟩ | 78.8MB | 78.8MB | 17.8MB | 352KB |
| governance-cost | WASM ▶ production | 78.8MB | 78.8MB | 17.4MB | 504B |
| hardware-targets | Rust AVX2 | — | — | — | — |
| hardware-targets | Rust (generic) | — | — | — | — |
| hardware-targets | Node.js | 47.7MB | 47.7MB | 5.3MB | — |
| hardware-targets | LogicN passive ⟨interp⟩ | 79.0MB | 79.0MB | 18.3MB | 673KB |
| hardware-targets | LogicN manifest ⟨interp⟩ | 79.0MB | 79.0MB | 18.2MB | 29KB |
| hardware-targets | LogicN governed ⟨interp⟩ | 79.0MB | 79.0MB | 17.8MB | 29KB |
| hardware-targets | WASM ▶ production | 78.9MB | 78.9MB | 17.7MB | 504B |
| low-memory | Rust (generic) | — | — | — | — |
| low-memory | Node.js | 45.7MB | 45.7MB | 4.4MB | 7KB |
| low-memory | Python | — | — | — | — |
| low-memory | LogicN passive ⟨interp⟩ | 79.5MB | 79.5MB | 18.2MB | 80KB |
| low-memory | LogicN manifest ⟨interp⟩ | 79.5MB | 79.5MB | 18.5MB | 179KB |
| low-memory | LogicN governed ⟨interp⟩ | 79.2MB | 79.2MB | 17.7MB | -239KB |
| low-memory | WASM ▶ production | 79.3MB | 79.3MB | 17.9MB | 504B |
| gpu-compute | Rust (generic) | — | — | — | — |
| gpu-compute | Node.js | 46.0MB | 46.0MB | 4.4MB | — |
| gpu-compute | Python | — | — | — | — |
| gpu-compute | LogicN passive ⟨interp⟩ | 79.4MB | 79.4MB | 18.2MB | 34KB |
| gpu-compute | LogicN manifest ⟨interp⟩ | 79.4MB | 79.4MB | 18.5MB | 83KB |
| gpu-compute | LogicN governed ⟨interp⟩ | 79.4MB | 79.4MB | 18.7MB | -536KB |
| gpu-compute | WASM ▶ production | 79.4MB | 79.4MB | 19.1MB | 2KB |
| gpu-compute | Deno WebGPU (NVIDIA GeForce RTX 2060) | — | — | — | — |
| matrix-multiply | Rust (generic) | — | — | — | — |
| matrix-multiply | Node.js | 51.6MB | 51.6MB | 4.4MB | — |
| matrix-multiply | Python | — | — | — | — |
| matrix-multiply | LogicN passive ⟨interp⟩ | 79.1MB | 79.1MB | 19.2MB | 21KB |
| matrix-multiply | LogicN manifest ⟨interp⟩ | 79.1MB | 79.1MB | 19.6MB | 1.2MB |
| matrix-multiply | LogicN governed ⟨interp⟩ | 79.7MB | 79.7MB | 19.9MB | 1.3MB |
| matrix-multiply | WASM ▶ production | 79.7MB | 79.7MB | 18.4MB | 43KB |
| matrix-multiply | Deno WebGPU (NVIDIA GeForce RTX 2060) | — | — | — | — |
| crypto-ops | Rust (generic) | — | — | — | — |
| crypto-ops | Node.js | — | — | — | — |
| crypto-ops | Python | — | — | — | — |
| crypto-ops | LogicN passive ⟨interp⟩ | 79.5MB | 79.5MB | 18.8MB | -1.5MB |
| crypto-ops | LogicN manifest ⟨interp⟩ | 79.5MB | 79.5MB | 19.3MB | 60KB |
| crypto-ops | LogicN governed ⟨interp⟩ | 79.5MB | 79.5MB | 19.1MB | 200KB |
| text-html | Rust (generic) | — | — | — | — |
| text-html | Node.js | — | — | — | — |
| text-html | Python | — | — | — | — |
| text-html | LogicN passive ⟨interp⟩ | 80.4MB | 80.4MB | 20.7MB | 918KB |
| text-html | LogicN manifest ⟨interp⟩ | 80.7MB | 80.7MB | 19.2MB | 98KB |
| text-html | LogicN governed ⟨interp⟩ | 81.1MB | 81.1MB | 20.5MB | 115KB |
| tri-logic | Rust (generic) | — | — | — | — |
| tri-logic | Node.js | — | — | — | — |
| tri-logic | Python | — | — | — | — |
| tri-logic | LogicN passive ⟨interp⟩ | 80.0MB | 80.0MB | 19.1MB | -1.7MB |
| tri-logic | LogicN manifest ⟨interp⟩ | 80.3MB | 80.3MB | 19.9MB | 298KB |
| tri-logic | LogicN governed ⟨interp⟩ | 80.1MB | 80.1MB | 19.0MB | -569KB |
| tri-logic | WASM ▶ production | 80.8MB | 80.8MB | 19.5MB | 736B |
| data-query | Node.js | — | — | — | — |
| data-query | Python | — | — | — | — |
| data-query | LogicN passive ⟨interp⟩ | 83.0MB | 83.0MB | 19.4MB | -3.9MB |
| data-query | LogicN manifest ⟨interp⟩ | 82.7MB | 82.7MB | 19.8MB | -1.1MB |
| data-query | LogicN governed ⟨interp⟩ | 82.6MB | 82.6MB | 20.4MB | -1.0MB |
| call-chain | Node.js | 46.5MB | 46.5MB | 5.0MB | — |
| call-chain | Python | — | — | — | — |
| call-chain | LogicN passive ⟨interp⟩ | 91.5MB | 91.5MB | 22.4MB | 18KB |
| call-chain | LogicN manifest ⟨interp⟩ | 83.0MB | 83.0MB | 20.4MB | -2.3MB |
| call-chain | LogicN governed ⟨interp⟩ | 83.0MB | 83.0MB | 22.4MB | 1.9MB |
| nbody | Node.js | 48.2MB | 48.2MB | 4.5MB | — |
| nbody | Python | — | — | — | — |
| nbody | LogicN passive ⟨interp⟩ | 91.5MB | 91.5MB | 21.0MB | 33KB |
| nbody | LogicN manifest ⟨interp⟩ | 91.2MB | 91.2MB | 21.7MB | -1.7MB |
| nbody | LogicN governed ⟨interp⟩ | 91.2MB | 91.2MB | 22.6MB | -1.7MB |
| json-parse | Node.js | — | — | — | — |
| json-parse | Python | — | — | — | — |
| json-parse | LogicN passive ⟨interp⟩ | 92.5MB | 92.5MB | 26.6MB | 80KB |
| json-parse | LogicN manifest ⟨interp⟩ | 93.0MB | 93.0MB | 24.8MB | 1.6MB |
| json-parse | LogicN governed ⟨interp⟩ | 98.9MB | 98.9MB | 22.6MB | -5.3MB |
| http-throughput | Node.js | — | — | — | — |
| naming-check | Node.js | — | — | — | — |
| context-receipt | Node.js | — | — | — | — |
| intelligence-search | Node.js | — | — | — | — |
| provenance-trace | Node.js | — | — | — | — |

> **Heap Δ** = heap after minus heap before execution. Negative means GC reclaimed memory during the run.
> **LogicN:** each tree-walker node evaluation allocates a new LogicNValue object — visible as positive heap delta.

## 3. CPU Efficiency

| Benchmark | Runtime | Wall time | CPU time | CPU utilisation | Ops/CPU-ms |
|---|---|---|---|---|---|
| compute-mix | Rust AVX2 | 5.00s | — | — | — |
| compute-mix | Rust (generic) | 5.00s | — | — | — |
| compute-mix | Node.js | 3.00s | 1.81s | 60% | 95.7K ops/CPU-ms |
| compute-mix | Python | 3.08s | 1.56s | 51% | 352.00 ops/CPU-ms |
| compute-mix | LogicN passive ⟨interp⟩ | 0.2ms | 0.0ms | 0% | — |
| compute-mix | LogicN manifest ⟨interp⟩ | 266.1ms | 266.0ms | 100% | 187.97 ops/CPU-ms |
| compute-mix | LogicN governed ⟨interp⟩ | 243.3ms | 297.0ms | 122% | 168.35 ops/CPU-ms |
| compute-mix | WASM ▶ production | 1.26s | 1.27s | 100% | 118.5K ops/CPU-ms |
| arithmetic-threshold | Rust AVX2 | 12.8ms | — | — | — |
| arithmetic-threshold | Rust (generic) | 12.8ms | — | — | — |
| arithmetic-threshold | Node.js | 27.2ms | 31.0ms | 114% | 645.1K ops/CPU-ms |
| arithmetic-threshold | Python | 4.38s | 4.36s | 99% | 4.6K ops/CPU-ms |
| arithmetic-threshold | LogicN passive ⟨interp⟩ | 0.1ms | 0.0ms | 0% | — |
| arithmetic-threshold | LogicN manifest ⟨interp⟩ | 70.7ms | 63.0ms | 89% | 1.0K ops/CPU-ms |
| arithmetic-threshold | LogicN governed ⟨interp⟩ | 76.9ms | 78.0ms | 101% | 810.87 ops/CPU-ms |
| arithmetic-threshold | WASM ▶ production | 1.00s | 1.00s | 100% | 3.98M ops/CPU-ms |
| six-digit-guess | Rust AVX2 | 0.6ms | — | — | — |
| six-digit-guess | Rust (generic) | 0.5ms | — | — | — |
| six-digit-guess | Node.js | 15.1ms | 31.0ms | 205% | 1.4K ops/CPU-ms |
| six-digit-guess | Python | 544.4ms | 546.9ms | 100% | 76.93 ops/CPU-ms |
| six-digit-guess | LogicN passive ⟨interp⟩ | 0.2ms | 0.0ms | 0% | — |
| six-digit-guess | LogicN manifest ⟨interp⟩ | 919.0ms | 921.0ms | 100% | 45.68 ops/CPU-ms |
| six-digit-guess | LogicN governed ⟨interp⟩ | 951.5ms | 969.0ms | 102% | 43.41 ops/CPU-ms |
| six-digit-guess | WASM ▶ production | 1.17s | 1.17s | 101% | 71.8K ops/CPU-ms |
| record-allocation | Rust AVX2 | 12.6ms | — | — | — |
| record-allocation | Rust (generic) | 12.8ms | — | — | — |
| record-allocation | Node.js | 8.3ms | 15.0ms | 181% | 13.3K ops/CPU-ms |
| record-allocation | Python | 153.8ms | 109.4ms | 71% | 1.8K ops/CPU-ms |
| record-allocation | LogicN passive ⟨interp⟩ | 0.5ms | 0.0ms | 0% | — |
| record-allocation | LogicN manifest ⟨interp⟩ | 77.9ms | 31.0ms | 40% | 322.58 ops/CPU-ms |
| record-allocation | LogicN governed ⟨interp⟩ | 83.7ms | 78.0ms | 93% | 128.20 ops/CPU-ms |
| record-allocation | WASM ▶ production | 1.01s | 532.0ms | 53% | 1.75M ops/CPU-ms |
| fibonacci-recursive | Rust AVX2 | 455.7ms | — | — | — |
| fibonacci-recursive | Rust (generic) | 419.2ms | — | — | — |
| fibonacci-recursive | Node.js | 4.94s | 2.09s | 42% | 0.05 ops/CPU-ms |
| fibonacci-recursive | Python | 4.22s | 3.55s | 84% | 0.01 ops/CPU-ms |
| fibonacci-recursive | LogicN passive ⟨interp⟩ | 0.1ms | 0.0ms | 0% | — |
| fibonacci-recursive | LogicN manifest ⟨interp⟩ | 42.4ms | 62.0ms | 146% | 0.02 ops/CPU-ms |
| fibonacci-recursive | LogicN governed ⟨interp⟩ | 46.7ms | 47.0ms | 101% | 0.02 ops/CPU-ms |
| fibonacci-recursive | WASM ▶ production | 1.02s | 1.02s | 100% | 45.28 ops/CPU-ms |
| collection-pipeline | Rust AVX2 | 85.6ms | — | — | — |
| collection-pipeline | Rust (generic) | 238.5ms | — | — | — |
| collection-pipeline | Node.js | 681.0ms | 704.0ms | 103% | 7.10 ops/CPU-ms |
| collection-pipeline | Python | 2.41s | 2.42s | 100% | 2.06 ops/CPU-ms |
| collection-pipeline | LogicN passive ⟨interp⟩ | 0.3ms | 0.0ms | 0% | — |
| collection-pipeline | LogicN manifest ⟨interp⟩ | 15.1ms | 15.0ms | 99% | 666.67 ops/CPU-ms |
| collection-pipeline | LogicN governed ⟨interp⟩ | 14.7ms | 16.0ms | 109% | 625.00 ops/CPU-ms |
| collection-pipeline | WASM ▶ production | 1.01s | 1.06s | 106% | 1.96M ops/CPU-ms |
| governance-cost | Rust AVX2 | 12.0ms | — | — | — |
| governance-cost | Rust (generic) | 11.3ms | — | — | — |
| governance-cost | Node.js | 51.7ms | 46.0ms | 89% | 2.2K ops/CPU-ms |
| governance-cost | Python | 2.69s | 2.69s | 100% | 37.21 ops/CPU-ms |
| governance-cost | LogicN passive ⟨interp⟩ | 0.9ms | 0.0ms | 0% | — |
| governance-cost | LogicN manifest ⟨interp⟩ | 0.4ms | 0.0ms | 0% | — |
| governance-cost | LogicN governed ⟨interp⟩ | 0.3ms | 0.0ms | 0% | — |
| governance-cost | WASM ▶ production | 1.00s | 1.00s | 100% | 14.7K ops/CPU-ms |
| hardware-targets | Rust AVX2 | 860.6ms | — | — | — |
| hardware-targets | Rust (generic) | 856.6ms | — | — | — |
| hardware-targets | Node.js | 1.12s | 1.14s | 102% | 876.42 ops/CPU-ms |
| hardware-targets | LogicN passive ⟨interp⟩ | 7.9ms | 15.0ms | 190% | — |
| hardware-targets | LogicN manifest ⟨interp⟩ | 0.0ms | 0.0ms | 0% | — |
| hardware-targets | LogicN governed ⟨interp⟩ | 0.1ms | 0.0ms | 0% | — |
| hardware-targets | WASM ▶ production | 1.00s | 1.00s | 100% | 171.5K ops/CPU-ms |
| low-memory | Rust (generic) | 756.1ms | — | — | — |
| low-memory | Node.js | 72.4ms | 63.0ms | 87% | 79.36 ops/CPU-ms |
| low-memory | Python | 1.70s | 1.69s | 99% | 0.59 ops/CPU-ms |
| low-memory | LogicN passive ⟨interp⟩ | 0.1ms | 0.0ms | 0% | — |
| low-memory | LogicN manifest ⟨interp⟩ | 73.9ms | 62.0ms | 84% | 161.29 ops/CPU-ms |
| low-memory | LogicN governed ⟨interp⟩ | 80.0ms | 94.0ms | 117% | 106.38 ops/CPU-ms |
| low-memory | WASM ▶ production | 1.01s | 1.00s | 99% | 700.0K ops/CPU-ms |
| gpu-compute | Rust (generic) | 5.10s | — | — | — |
| gpu-compute | Node.js | 513.1ms | 516.0ms | 101% | 969.0K ops/CPU-ms |
| gpu-compute | Python | 4.78s | 4.78s | 100% | 10.5K ops/CPU-ms |
| gpu-compute | LogicN passive ⟨interp⟩ | 0.1ms | 0.0ms | 0% | — |
| gpu-compute | LogicN manifest ⟨interp⟩ | 331.8ms | 328.0ms | 99% | 304.88 ops/CPU-ms |
| gpu-compute | LogicN governed ⟨interp⟩ | 343.9ms | 344.0ms | 100% | 290.70 ops/CPU-ms |
| gpu-compute | WASM ▶ production | 1.02s | 843.0ms | 83% | 1.54M ops/CPU-ms |
| gpu-compute | Deno WebGPU (NVIDIA GeForce RTX 2060) | 26.4ms | — | — | — |
| matrix-multiply | Rust (generic) | 89.3ms | — | — | — |
| matrix-multiply | Node.js | 231.7ms | 250.0ms | 108% | 2.00 ops/CPU-ms |
| matrix-multiply | Python | 1.05s | — | — | — |
| matrix-multiply | LogicN passive ⟨interp⟩ | 0.0ms | 0.0ms | 0% | — |
| matrix-multiply | LogicN manifest ⟨interp⟩ | 44.2ms | 63.0ms | 143% | 16.25 ops/CPU-ms |
| matrix-multiply | LogicN governed ⟨interp⟩ | 46.9ms | 47.0ms | 100% | 21.79 ops/CPU-ms |
| matrix-multiply | WASM ▶ production | 1.01s | 1.01s | 101% | 72.6K ops/CPU-ms |
| matrix-multiply | Deno WebGPU (NVIDIA GeForce RTX 2060) | 12.5ms | — | — | — |
| crypto-ops | LogicN passive ⟨interp⟩ | 5.5ms | 0.0ms | 0% | — |
| crypto-ops | LogicN manifest ⟨interp⟩ | 0.2ms | 0.0ms | 0% | — |
| crypto-ops | LogicN governed ⟨interp⟩ | 3.9ms | 0.0ms | 0% | — |
| text-html | LogicN passive ⟨interp⟩ | 0.8ms | 0.0ms | 0% | — |
| text-html | LogicN manifest ⟨interp⟩ | 0.2ms | 0.0ms | 0% | — |
| text-html | LogicN governed ⟨interp⟩ | 1.6ms | 0.0ms | 0% | — |
| tri-logic | LogicN passive ⟨interp⟩ | 0.9ms | 0.0ms | 0% | — |
| tri-logic | LogicN manifest ⟨interp⟩ | 780.9ms | 781.0ms | 100% | 34.57 ops/CPU-ms |
| tri-logic | LogicN governed ⟨interp⟩ | 786.2ms | 797.0ms | 101% | 33.88 ops/CPU-ms |
| tri-logic | WASM ▶ production | 1.15s | 1.16s | 100% | 519.0K ops/CPU-ms |
| data-query | LogicN passive ⟨interp⟩ | 0.6ms | 0.0ms | 0% | — |
| data-query | LogicN manifest ⟨interp⟩ | 4.6ms | 32.0ms | 702% | 31.25 ops/CPU-ms |
| data-query | LogicN governed ⟨interp⟩ | 4.7ms | 0.0ms | 0% | — |
| call-chain | Node.js | 7.1ms | 0.0ms | 0% | — |
| call-chain | Python | 402.6ms | 390.6ms | 97% | 2.6K ops/CPU-ms |
| call-chain | LogicN passive ⟨interp⟩ | 0.1ms | 0.0ms | 0% | — |
| call-chain | LogicN manifest ⟨interp⟩ | 724.4ms | 719.0ms | 99% | 69.54 ops/CPU-ms |
| call-chain | LogicN governed ⟨interp⟩ | 736.2ms | 734.0ms | 100% | 68.12 ops/CPU-ms |
| nbody | Node.js | 53.7ms | 62.0ms | 115% | 3.23 ops/CPU-ms |
| nbody | Python | 910.1ms | — | — | — |
| nbody | LogicN passive ⟨interp⟩ | 0.1ms | 0.0ms | 0% | — |
| nbody | LogicN manifest ⟨interp⟩ | 536.0ms | 532.0ms | 99% | 61.59 ops/CPU-ms |
| nbody | LogicN governed ⟨interp⟩ | 535.3ms | 531.0ms | 99% | 61.71 ops/CPU-ms |
| json-parse | LogicN passive ⟨interp⟩ | 0.2ms | 0.0ms | 0% | — |
| json-parse | LogicN manifest ⟨interp⟩ | 53.7ms | 109.0ms | 203% | 4.59 ops/CPU-ms |
| json-parse | LogicN governed ⟨interp⟩ | 65.7ms | 125.0ms | 190% | 4.00 ops/CPU-ms |
| http-throughput | Node.js | 79.0ms | — | — | — |
| naming-check | Node.js | 275.0ms | — | — | — |
| context-receipt | Node.js | 191.0ms | — | — | — |
| intelligence-search | Node.js | 33.0ms | — | — | — |
| provenance-trace | Node.js | 942.0ms | — | — | — |

> **CPU utilisation** = CPU ms ÷ wall ms × 100. Node.js approaches 100% (single-thread JIT). Python may show <100% on Windows where process_time measures differently.

## 4. Per-Benchmark Detail

### compute-mix

| # | 🚦 | Runtime | Throughput | Wall | CPU | RSS | Heap | vs Python | vs Node |
|---|---|---|---|---|---|---|---|---|---|
| 🥇 | 🟢 | Rust AVX2 | 121.17M/s | 5.00s | — | — | — | 679.3× | 2.10× |
| 🥈 | 🟢 | WASM ▶ production | 118.68M/s | 1.26s | 1.27s | 70.3MB | 14.5MB | 665.4× | 2.05× |
| 🥉 | 🟢 | Rust (generic) | 118.42M/s | 5.00s | — | — | — | 663.9× | 2.05× |
| 4 | 🟢 | Node.js | 57.82M/s | 3.00s | 1.81s | 41.0MB | 4.6MB | 324.1× | 1.00× |
| 5 | ⚫ | LogicN governed ⟨interp⟩ | 205.5K/s | 243.3ms | 297.0ms | 76.3MB | 17.2MB | 1.15× | 0.00× |
| 6 | ⚫ | LogicN manifest ⟨interp⟩ | 187.9K/s | 266.1ms | 266.0ms | 76.2MB | 15.5MB | 1.05× | 0.00× |
| 7 | ⚫ | Python | 178.4K/s | 3.08s | 1.56s | — | — | 1.00× | 0.00× |
| 8 | ⚫ | LogicN passive ⟨interp⟩ | 15.4K/s | 0.2ms | 0.0ms | 76.4MB | 15.9MB | 0.09× | 0.00× |

### arithmetic-threshold

| # | 🚦 | Runtime | Throughput | Wall | CPU | RSS | Heap | vs Python | vs Node |
|---|---|---|---|---|---|---|---|---|---|
| 🥇 | 🟢 | WASM ▶ production | 3.98B/s | 1.00s | 1.00s | 76.7MB | 15.7MB | 873.1× | 5.42× |
| 🥈 | 🟢 | Rust AVX2 | 1.56B/s | 12.8ms | — | — | — | 342.9× | 2.13× |
| 🥉 | 🟢 | Rust (generic) | 1.56B/s | 12.8ms | — | — | — | 342.6× | 2.13× |
| 4 | 🟢 | Node.js | 735.44M/s | 27.2ms | 31.0ms | 46.9MB | 4.6MB | 161.2× | 1.00× |
| 5 | ⚫ | Python | 4.56M/s | 4.38s | 4.36s | — | — | 1.00× | 0.01× |
| 6 | ⚫ | LogicN manifest ⟨interp⟩ | 895.2K/s | 70.7ms | 63.0ms | 77.0MB | 16.6MB | 0.20× | 0.00× |
| 7 | ⚫ | LogicN governed ⟨interp⟩ | 822.0K/s | 76.9ms | 78.0ms | 77.0MB | 15.6MB | 0.18× | 0.00× |
| 8 | ⚫ | LogicN passive ⟨interp⟩ | 43.4K/s | 0.1ms | 0.0ms | 77.1MB | 17.6MB | 0.01× | 0.00× |

### six-digit-guess

| # | 🚦 | Runtime | Throughput | Wall | CPU | RSS | Heap | vs Python | vs Node |
|---|---|---|---|---|---|---|---|---|---|
| 🥇 | 🟢 | Rust (generic) | 78.42M/s | 0.5ms | — | — | — | 1.0K× | 28.2× |
| 🥈 | 🟢 | WASM ▶ production | 72.17M/s | 1.17s | 1.17s | 77.3MB | 15.9MB | 934.0× | 25.9× |
| 🥉 | 🟢 | Rust AVX2 | 69.86M/s | 0.6ms | — | — | — | 904.0× | 25.1× |
| 4 | 🟢 | Node.js | 2.78M/s | 15.1ms | 31.0ms | 51.5MB | 6.9MB | 36.0× | 1.00× |
| 5 | 🔴 | Python | 77.3K/s | 544.4ms | 546.9ms | — | — | 1.00× | 0.03× |
| 6 | 🔴 | LogicN manifest ⟨interp⟩ | 45.8K/s | 919.0ms | 921.0ms | 77.9MB | 17.7MB | 0.59× | 0.02× |
| 7 | 🔴 | LogicN governed ⟨interp⟩ | 44.2K/s | 951.5ms | 969.0ms | 77.8MB | 16.2MB | 0.57× | 0.02× |
| 8 | ⚫ | LogicN passive ⟨interp⟩ | 17.7K/s | 0.2ms | 0.0ms | 78.2MB | 17.1MB | 0.23× | 0.01× |

### record-allocation

| # | 🚦 | Runtime | Throughput | Wall | CPU | RSS | Heap | vs Python | vs Node |
|---|---|---|---|---|---|---|---|---|---|
| 🥇 | 🟢 | WASM ▶ production | 924.34M/s | 1.01s | 532.0ms | 78.1MB | 18.7MB | 710.7× | 38.3× |
| 🥈 | 🟢 | Rust AVX2 | 795.89M/s | 12.6ms | — | — | — | 611.9× | 33.0× |
| 🥉 | 🟢 | Rust (generic) | 779.59M/s | 12.8ms | — | — | — | 599.4× | 32.3× |
| 4 | 🟢 | Node.js | 24.12M/s | 8.3ms | 15.0ms | 47.7MB | 4.7MB | 18.5× | 1.00× |
| 5 | 🔴 | Python | 1.30M/s | 153.8ms | 109.4ms | — | — | 1.00× | 0.05× |
| 6 | ⚫ | LogicN manifest ⟨interp⟩ | 128.4K/s | 77.9ms | 31.0ms | 78.2MB | 18.6MB | 0.10× | 0.01× |
| 7 | ⚫ | LogicN governed ⟨interp⟩ | 119.5K/s | 83.7ms | 78.0ms | 78.1MB | 18.6MB | 0.09× | 0.00× |
| 8 | ⚫ | LogicN passive ⟨interp⟩ | 44.1K/s | 0.5ms | 0.0ms | 78.2MB | 18.7MB | 0.03× | 0.00× |

### fibonacci-recursive

| # | 🚦 | Runtime | Throughput | Wall | CPU | RSS | Heap | vs Python | vs Node |
|---|---|---|---|---|---|---|---|---|---|
| 🥇 | 🟢 | LogicN passive ⟨interp⟩ | 92.3K/s | 0.1ms | 0.0ms | 78.5MB | 17.0MB | 19.5K× | 4.6K× |
| 🥈 | 🟢 | WASM ▶ production | 45.2K/s | 1.02s | 1.02s | 78.5MB | 16.8MB | 9.5K× | 2.2K× |
| 🥉 | 🟢 | Rust (generic) | 477.1/s | 419.2ms | — | — | — | 100.7× | 23.6× |
| 4 | 🟢 | Rust AVX2 | 438.9/s | 455.7ms | — | — | — | 92.6× | 21.7× |
| 5 | 🟢 | LogicN manifest ⟨interp⟩ | 24.0/s | 42.4ms | 62.0ms | 78.4MB | 17.9MB | 5.06× | 1.19× |
| 6 | 🟢 | LogicN governed ⟨interp⟩ | 21.0/s | 46.7ms | 47.0ms | 78.2MB | 18.1MB | 4.43× | 1.04× |
| 7 | 🟢 | Node.js | 20.3/s | 4.94s | 2.09s | 45.6MB | 4.4MB | 4.27× | 1.00× |
| 8 | 🟡 | Python | 4.7/s | 4.22s | 3.55s | — | — | 1.00× | 0.23× |

### collection-pipeline

| # | 🚦 | Runtime | Throughput | Wall | CPU | RSS | Heap | vs Python | vs Node |
|---|---|---|---|---|---|---|---|---|---|
| 🥇 | 🟢 | WASM ▶ production | 2.07B/s | 1.01s | 1.06s | 78.6MB | 17.0MB | 998.3K× | 281.9K× |
| 🥈 | 🟢 | Rust AVX2 | 1.17M/s | 85.6ms | — | — | — | 563.3× | 159.1× |
| 🥉 | 🟢 | LogicN governed ⟨interp⟩ | 682.1K/s | 14.7ms | 16.0ms | 78.6MB | 17.4MB | 329.0× | 92.9× |
| 4 | 🟢 | LogicN manifest ⟨interp⟩ | 662.3K/s | 15.1ms | 15.0ms | 78.6MB | 17.8MB | 319.4× | 90.2× |
| 5 | 🟢 | Rust (generic) | 419.4K/s | 238.5ms | — | — | — | 202.3× | 57.1× |
| 6 | 🟢 | LogicN passive ⟨interp⟩ | 104.8K/s | 0.3ms | 0.0ms | 78.6MB | 17.3MB | 50.6× | 14.3× |
| 7 | 🟢 | Node.js | 7.3K/s | 681.0ms | 704.0ms | 63.1MB | 8.9MB | 3.54× | 1.00× |
| 8 | 🟡 | Python | 2.1K/s | 2.41s | 2.42s | — | — | 1.00× | 0.28× |

### governance-cost

| # | 🚦 | Runtime | Throughput | Wall | CPU | RSS | Heap | vs Python | vs Node |
|---|---|---|---|---|---|---|---|---|---|
| 🥇 | 🟢 | Rust (generic) | 882.99M/s | 11.3ms | — | — | — | 23.7K× | 456.3× |
| 🥈 | 🟢 | Rust AVX2 | 834.17M/s | 12.0ms | — | — | — | 22.4K× | 431.0× |
| 🥉 | 🟢 | WASM ▶ production | 14.69M/s | 1.00s | 1.00s | 78.8MB | 17.4MB | 394.6× | 7.59× |
| 4 | 🟢 | Node.js | 1.94M/s | 51.7ms | 46.0ms | 45.7MB | 4.4MB | 52.0× | 1.00× |
| 5 | 🔴 | LogicN passive ⟨interp⟩ | 107.5K/s | 0.9ms | 0.0ms | 78.9MB | 17.9MB | 2.89× | 0.06× |
| 6 | 🔴 | Python | 37.2K/s | 2.69s | 2.69s | — | — | 1.00× | 0.02× |
| 7 | ⚫ | LogicN governed ⟨interp⟩ | 3.3K/s | 0.3ms | 0.0ms | 78.8MB | 17.8MB | 0.09× | 0.00× |
| 8 | ⚫ | LogicN manifest ⟨interp⟩ | 2.3K/s | 0.4ms | 0.0ms | 78.9MB | 17.5MB | 0.06× | 0.00× |

### hardware-targets

| # | 🚦 | Runtime | Throughput | Wall | CPU | RSS | Heap | vs Python | vs Node |
|---|---|---|---|---|---|---|---|---|---|
| 🥇 | 🟢 | WASM ▶ production | 171.49M/s | 1.00s | 1.00s | 78.9MB | 17.7MB | — | 191.6× |
| 🥈 | 🟢 | Rust (generic) | 1.17M/s | 856.6ms | — | — | — | — | 1.30× |
| 🥉 | 🟢 | Rust AVX2 | 1.16M/s | 860.6ms | — | — | — | — | 1.30× |
| 4 | 🟢 | Node.js | 895.2K/s | 1.12s | 1.14s | 47.7MB | 5.3MB | — | 1.00× |
| 5 | 🟡 | LogicN passive ⟨interp⟩ | 126.4K/s | 7.9ms | 15.0ms | 79.0MB | 18.3MB | — | 0.14× |
| 6 | 🔴 | LogicN manifest ⟨interp⟩ | 25.0K/s | 0.0ms | 0.0ms | 79.0MB | 18.2MB | — | 0.03× |
| 7 | 🔴 | LogicN governed ⟨interp⟩ | 11.1K/s | 0.1ms | 0.0ms | 79.0MB | 17.8MB | — | 0.01× |

### low-memory

| # | 🚦 | Runtime | Throughput | Wall | CPU | RSS | Heap | vs Python | vs Node |
|---|---|---|---|---|---|---|---|---|---|
| 🥇 | 🟢 | WASM ▶ production | 692.96M/s | 1.01s | 1.00s | 79.3MB | 17.9MB | 1.2M× | 10.0K× |
| 🥈 | 🟢 | LogicN passive ⟨interp⟩ | 138.4K/s | 0.1ms | 0.0ms | 79.5MB | 18.2MB | 235.5× | 2.00× |
| 🥉 | 🟢 | LogicN manifest ⟨interp⟩ | 135.3K/s | 73.9ms | 62.0ms | 79.5MB | 18.5MB | 230.2× | 1.96× |
| 4 | 🟢 | Rust (generic) | 132.3K/s | 756.1ms | — | — | — | 225.0× | 1.91× |
| 5 | 🟢 | LogicN governed ⟨interp⟩ | 125.0K/s | 80.0ms | 94.0ms | 79.2MB | 17.7MB | 212.6× | 1.81× |
| 6 | 🟢 | Node.js | 69.1K/s | 72.4ms | 63.0ms | 45.7MB | 4.4MB | 117.5× | 1.00× |
| 7 | ⚫ | Python | 587.8/s | 1.70s | 1.69s | — | — | 1.00× | 0.01× |

### gpu-compute

| # | 🚦 | Runtime | Throughput | Wall | CPU | RSS | Heap | vs Python | vs Node |
|---|---|---|---|---|---|---|---|---|---|
| 🥇 | 🟢 | WASM ▶ production | 1.27B/s | 1.02s | 843.0ms | 79.4MB | 19.1MB | 121.7× | 1.31× |
| 🥈 | 🟢 | Rust (generic) | 981.25M/s | 5.10s | — | — | — | 93.8× | 1.01× |
| 🥉 | 🟢 | Node.js | 974.45M/s | 513.1ms | 516.0ms | 46.0MB | 4.4MB | 93.2× | 1.00× |
| 4 | 🔴 | Python | 10.46M/s | 4.78s | 4.78s | — | — | 1.00× | 0.01× |
| 5 | ⚫ | Deno WebGPU (NVIDIA GeForce RTX 2060) | 3.79M/s | 26.4ms | — | — | — | 0.36× | 0.00× |
| 6 | ⚫ | LogicN manifest ⟨interp⟩ | 301.4K/s | 331.8ms | 328.0ms | 79.4MB | 18.5MB | 0.03× | 0.00× |
| 7 | ⚫ | LogicN governed ⟨interp⟩ | 290.8K/s | 343.9ms | 344.0ms | 79.4MB | 18.7MB | 0.03× | 0.00× |
| 8 | ⚫ | LogicN passive ⟨interp⟩ | 140.6K/s | 0.1ms | 0.0ms | 79.4MB | 18.2MB | 0.01× | 0.00× |

### matrix-multiply

| # | 🚦 | Runtime | Throughput | Wall | CPU | RSS | Heap | vs Python | vs Node |
|---|---|---|---|---|---|---|---|---|---|
| 🥇 | 🟢 | WASM ▶ production | 73.11M/s | 1.01s | 1.01s | 79.7MB | 18.4MB | 1.5M× | 33.9K× |
| 🥈 | 🟢 | LogicN passive ⟨interp⟩ | 107.1K/s | 0.0ms | 0.0ms | 79.1MB | 19.2MB | 2.3K× | 49.6× |
| 🥉 | 🟢 | LogicN manifest ⟨interp⟩ | 23.2K/s | 44.2ms | 63.0ms | 79.1MB | 19.6MB | 488.6× | 10.7× |
| 4 | 🟢 | LogicN governed ⟨interp⟩ | 21.8K/s | 46.9ms | 47.0ms | 79.7MB | 19.9MB | 460.0× | 10.1× |
| 5 | 🟢 | Rust (generic) | 5.6K/s | 89.3ms | — | — | — | 118.0× | 2.59× |
| 6 | 🟢 | Node.js | 2.2K/s | 231.7ms | 250.0ms | 51.6MB | 4.4MB | 45.5× | 1.00× |
| 7 | 🟡 | Deno WebGPU (NVIDIA GeForce RTX 2060) | 801.8/s | 12.5ms | — | — | — | 16.9× | 0.37× |
| 8 | 🔴 | Python | 47.5/s | 1.05s | — | — | — | 1.00× | 0.02× |

### crypto-ops

| # | 🚦 | Runtime | Throughput | Wall | CPU | RSS | Heap | vs Python | vs Node |
|---|---|---|---|---|---|---|---|---|---|
| 🥇 | 🟢 | LogicN passive ⟨interp⟩ | 18.1K/s | 5.5ms | 0.0ms | 79.5MB | 18.8MB | — | — |
| 🥈 | 🟡 | LogicN manifest ⟨interp⟩ | 5.3K/s | 0.2ms | 0.0ms | 79.5MB | 19.3MB | — | — |
| 🥉 | 🔴 | LogicN governed ⟨interp⟩ | 254.0/s | 3.9ms | 0.0ms | 79.5MB | 19.1MB | — | — |

### text-html

| # | 🚦 | Runtime | Throughput | Wall | CPU | RSS | Heap | vs Python | vs Node |
|---|---|---|---|---|---|---|---|---|---|
| 🥇 | 🟢 | LogicN passive ⟨interp⟩ | 125.9K/s | 0.8ms | 0.0ms | 80.4MB | 20.7MB | — | — |
| 🥈 | 🔴 | LogicN manifest ⟨interp⟩ | 4.8K/s | 0.2ms | 0.0ms | 80.7MB | 19.2MB | — | — |
| 🥉 | ⚫ | LogicN governed ⟨interp⟩ | 613.0/s | 1.6ms | 0.0ms | 81.1MB | 20.5MB | — | — |

### tri-logic

| # | 🚦 | Runtime | Throughput | Wall | CPU | RSS | Heap | vs Python | vs Node |
|---|---|---|---|---|---|---|---|---|---|
| 🥇 | 🟢 | WASM ▶ production | 519.71M/s | 1.15s | 1.16s | 80.8MB | 19.5MB | — | — |
| 🥈 | ⚫ | LogicN passive ⟨interp⟩ | 111.3K/s | 0.9ms | 0.0ms | 80.0MB | 19.1MB | — | — |
| 🥉 | ⚫ | LogicN manifest ⟨interp⟩ | 34.6K/s | 780.9ms | 781.0ms | 80.3MB | 19.9MB | — | — |
| 4 | ⚫ | LogicN governed ⟨interp⟩ | 34.3K/s | 786.2ms | 797.0ms | 80.1MB | 19.0MB | — | — |

### data-query

| # | 🚦 | Runtime | Throughput | Wall | CPU | RSS | Heap | vs Python | vs Node |
|---|---|---|---|---|---|---|---|---|---|
| 🥇 | 🟢 | LogicN manifest ⟨interp⟩ | 219.3K/s | 4.6ms | 32.0ms | 82.7MB | 19.8MB | — | — |
| 🥈 | 🟢 | LogicN governed ⟨interp⟩ | 212.8K/s | 4.7ms | 0.0ms | 82.6MB | 20.4MB | — | — |
| 🥉 | 🟡 | LogicN passive ⟨interp⟩ | 80.7K/s | 0.6ms | 0.0ms | 83.0MB | 19.4MB | — | — |

### call-chain

| # | 🚦 | Runtime | Throughput | Wall | CPU | RSS | Heap | vs Python | vs Node |
|---|---|---|---|---|---|---|---|---|---|
| 🥇 | 🟢 | Node.js | 282.12M/s | 7.1ms | 0.0ms | 46.5MB | 5.0MB | 113.6× | 1.00× |
| 🥈 | ⚫ | Python | 2.48M/s | 402.6ms | 390.6ms | — | — | 1.00× | 0.01× |
| 🥉 | ⚫ | LogicN manifest ⟨interp⟩ | 69.0K/s | 724.4ms | 719.0ms | 83.0MB | 20.4MB | 0.03× | 0.00× |
| 4 | ⚫ | LogicN governed ⟨interp⟩ | 67.9K/s | 736.2ms | 734.0ms | 83.0MB | 22.4MB | 0.03× | 0.00× |
| 5 | ⚫ | LogicN passive ⟨interp⟩ | 67.8K/s | 0.1ms | 0.0ms | 91.5MB | 22.4MB | 0.03× | 0.00× |

### nbody

| # | 🚦 | Runtime | Throughput | Wall | CPU | RSS | Heap | vs Python | vs Node |
|---|---|---|---|---|---|---|---|---|---|
| 🥇 | 🟢 | LogicN passive ⟨interp⟩ | 69.2K/s | 0.1ms | 0.0ms | 91.5MB | 21.0MB | 1.3K× | 18.6× |
| 🥈 | 🟢 | LogicN governed ⟨interp⟩ | 61.2K/s | 535.3ms | 531.0ms | 91.2MB | 22.6MB | 1.1K× | 16.4× |
| 🥉 | 🟢 | LogicN manifest ⟨interp⟩ | 61.1K/s | 536.0ms | 532.0ms | 91.2MB | 21.7MB | 1.1K× | 16.4× |
| 4 | 🟢 | Node.js | 3.7K/s | 53.7ms | 62.0ms | 48.2MB | 4.5MB | 67.8× | 1.00× |
| 5 | 🔴 | Python | 54.9/s | 910.1ms | — | — | — | 1.00× | 0.01× |

### json-parse

| # | 🚦 | Runtime | Throughput | Wall | CPU | RSS | Heap | vs Python | vs Node |
|---|---|---|---|---|---|---|---|---|---|
| 🥇 | 🟢 | LogicN passive ⟨interp⟩ | 97.8K/s | 0.2ms | 0.0ms | 92.5MB | 26.6MB | — | — |
| 🥈 | 🔴 | LogicN manifest ⟨interp⟩ | 9.3K/s | 53.7ms | 109.0ms | 93.0MB | 24.8MB | — | — |
| 🥉 | 🔴 | LogicN governed ⟨interp⟩ | 7.6K/s | 65.7ms | 125.0ms | 98.9MB | 22.6MB | — | — |

### http-throughput

| # | 🚦 | Runtime | Throughput | Wall | CPU | RSS | Heap | vs Python | vs Node |
|---|---|---|---|---|---|---|---|---|---|

### naming-check

| # | 🚦 | Runtime | Throughput | Wall | CPU | RSS | Heap | vs Python | vs Node |
|---|---|---|---|---|---|---|---|---|---|

### context-receipt

| # | 🚦 | Runtime | Throughput | Wall | CPU | RSS | Heap | vs Python | vs Node |
|---|---|---|---|---|---|---|---|---|---|

### intelligence-search

| # | 🚦 | Runtime | Throughput | Wall | CPU | RSS | Heap | vs Python | vs Node |
|---|---|---|---|---|---|---|---|---|---|

### provenance-trace

| # | 🚦 | Runtime | Throughput | Wall | CPU | RSS | Heap | vs Python | vs Node |
|---|---|---|---|---|---|---|---|---|---|


## 4b. GPU-Compute Workload (parallel map-reduce)

> A **GPU-shaped** workload: a per-element kernel `f(i)=i*2+1` applied across 100,000 elements + reduction.
> On a GPU this parallelises across thousands of threads. 🖥️ CPU = running on CPU; 🎮 GPU = real GPU dispatch.

**GPU detected:** NVIDIA GeForce RTX 2060 (driver 610.47, 6144 MiB)
**Compute toolchain:** NVIDIA GeForce RTX 2060 — GPU compute available.
**Deno WebGPU:** ✅ available — real GPU dispatch enabled (NVIDIA GeForce RTX 2060)
**LogicN GPU backend:** `not-implemented` — gpu-plan.ts emits a WGSL skeleton only; no dispatch path (pending Phase 38).

| # | 🚦 | Runtime | Device (🖥️ CPU / 🎮 GPU) | Throughput (kernel ops/s) | Wall | vs Node |
|---|---|---|---|---|---|---|
| 🥇 | 🟢 | WASM ▶ production | 🖥️ CPU (cpu (wasm)) | 1.27B/s | 1.02s | 1.31× |
| 🥈 | 🟢 | Rust (generic) | 🖥️ CPU (cpu (serial)) | 981.25M/s | 5.10s | 1.01× |
| 🥉 | 🟢 | Node.js | 🖥️ CPU (cpu (serial)) | 974.45M/s | 513.1ms | 1.00× |
| 4 | 🔴 | Python | 🖥️ CPU (cpu (serial)) | 10.46M/s | 4.78s | 0.01× |
| 5 | ⚫ | Deno WebGPU (NVIDIA GeForce RTX 2060) | 🎮 GPU (gpu (WebGPU — NVIDIA GeForce RTX 2060)) | 3.79M/s | 26.4ms | 0.00× |
| 6 | ⚫ | LogicN manifest ⟨interp⟩ | 🖥️ CPU (cpu) | 301.4K/s | 331.8ms | 0.00× |
| 7 | ⚫ | LogicN governed ⟨interp⟩ | 🖥️ CPU (cpu) | 290.8K/s | 343.9ms | 0.00× |
| 8 | ⚫ | LogicN passive ⟨interp⟩ | 🖥️ CPU (cpu) | 140.6K/s | 0.1ms | 0.00× |

**GPU execution status (this machine):**

| Runtime | GPU path | Device | Status |
|---|---|---|---|
| Rust | wgpu (Vulkan/D3D12) | 🖥️ CPU (GPU pending) | 🔧 buildable (cargo present, harness pending) |
| Python | torch CUDA / cupy | 🖥️ CPU (GPU pending) | ⏳ toolchain required (CPU-only torch) |
| Node.js | WebGPU | 🖥️ CPU only | ⏳ toolchain required (no navigator.gpu in Node.js) |
| Deno | WebGPU (built-in) | 🎮 GPU (NVIDIA GeForce RTX 2060) | ✅ available — real GPU dispatch detected (Phase 38 ready) |
| **LogicN** | WebGPUComputePlan → WGSL | 🖥️ CPU (GPU pending) | ❌ **pending Phase 38** — stub only, no measured number (by design) |

> Per the project's honesty rule (same as the Runtime-in-LogicN 0% metric): no GPU number is shown until a backend actually executes. LogicN's real result on this workload is its **WASM/CPU** row above.
> 🖥️ CPU = running on CPU cores. 🎮 GPU = real GPU dispatch via WebGPU/WGSL. Deno WebGPU is the only path currently capable of real GPU execution.

## 5. Key Observations

**Throughput gap (general):**
- Rust and Node.js JIT compile to native machine code — tree-walker cannot compete on hot arithmetic loops.
- Python CPython is 5-100× faster than LogicN on integer-intensive workloads.
- LogicN governed ≈ LogicN manifest — governance overhead is low; tree-walker dispatch dominates.

**collection-pipeline: LogicN wins (43× faster than Node.js, 122× faster than Python):**
- Node.js `.filter().map().reduce()` allocates 2 intermediate arrays per iteration — 5000 iters × 10K elements = 100M heap operations.
- Python list comprehension has similar intermediate allocation cost.
- LogicN benchmark uses a while-loop with running sum — zero intermediate collection allocation.
- The win is algorithmic (loop vs pipeline allocation overhead), not interpreter speed.
- **Lesson:** LogicN's explicit, low-level control flow avoids the hidden cost of functional pipeline idioms.

**fibonacci-recursive: different workloads:**
- Node.js/Rust/Python benchmark: fib(30) = 832040, ~2.7M recursive calls per invocation.
- LogicN benchmark: fib(20) = 6765, ~21K recursive calls per invocation (fib(30) would take ~19s/call).
- Calls/sec are not directly comparable — structural complexity differs by ~130×.
- Comparable result: LogicN handles ~1M+ AST node evaluations per second for recursive dispatch.

**Memory:**
- LogicN tree-walker allocates a new `{ __tag, value }` object per AST node — visible as heap growth.
- Negative heap delta = GC ran during execution and reclaimed more than was allocated.
- Node.js V8 JIT uses native tagged integers (no boxing) — heap stays flat on numeric workloads.

**passive mode: pre-compiled deployment throughput:**
- LogicN (passive) warm = LRU cache hits: steady-state deployment model (same input, same output).
- LogicN (passive) cold = execution without cache: different input each call, no cache benefit.
- Passive warm is typically 10-50× faster than governed — governance amortized, cache serves result.
- Passive cold shows pure execution cost: governance was pre-verified at compile time.

**hardware-targets: AVX2 vs generic for float dot product:**
- On i5-11400H (Tiger Lake H): generic x86 ≈ AVX2 for small arrays (both auto-vectorize to SSE4.2).
- Real AVX2 advantage appears on large tensors (L2/L3 cache boundary crossing, 16K+ float elements).
- WASM Phase 27: once WebAssembly.instantiate is wired, WASM SIMD 128 will show 10-100× over tree-walker.

**governance-cost: measuring the governance tax:**
- This benchmark isolates the overhead of the governance layer (ProofGraph + capability checking + audit).
- Key metric: logicnGoverned/logicnManifest ratio. Current baseline: ~2-3× slower (37% of manifest speed).
- Governance overhead sources: ProofGraph construction, GovernanceFlags bitmask, capability lookup, audit event.
- Target (Phase 30): <1.2× overhead via compile-time governance caching and proof reuse.

**Phase 25 projection (WASM):**
- Phase 25 WASM real arithmetic: pure flows now emit i32.add/sub/mul/div instead of (local.get $p0) stubs.
- Expected: 10-100× speedup for numeric pure flows when executed via WebAssembly.instantiate.
- collection-pipeline LogicN result already shows what the model delivers at the right abstraction level.

## 6. Distance from Winner — Every Runtime vs 🏆

> How much slower (or faster) is each runtime compared to the winner of that benchmark?
> **1.0×** = tied with winner. **2.0×** = half the speed. **100×** = one hundred times slower.

| Benchmark | 🏆 Winner | Rust AVX2 | Rust (generic) | Node.js | Python | LogicN passive ⟨interp⟩ | LogicN manifest ⟨interp⟩ | LogicN governed ⟨interp⟩ | WASM ▶ production | Deno WebGPU (NVIDIA GeForce RTX 2060) |
|---|---|---|---|---|---|---|---|---|---|---|
| **compute-mix** | Rust AVX2 | **🏆 winner** | **🏆 winner** | 2× slower | **679× slower** | **7.9K× slower** | **645× slower** | **590× slower** | **🏆 winner** | — |
| **arithmetic-threshold** | WASM ▶ production | 3× slower | 3× slower | 5× slower | **873× slower** | **91.9K× slower** | **4.5K× slower** | **4.8K× slower** | **🏆 winner** | — |
| **six-digit-guess** | Rust (generic) | 1.1× slower | **🏆 winner** | **28× slower** | **1.0K× slower** | **4.4K× slower** | **1.7K× slower** | **1.8K× slower** | 1.1× slower | — |
| **record-allocation** | WASM ▶ production | 1.2× slower | 1.2× slower | **38× slower** | **711× slower** | **20.9K× slower** | **7.2K× slower** | **7.7K× slower** | **🏆 winner** | — |
| **fibonacci-recursive** | LogicN passive ⟨interp⟩ | **210× slower** | **193× slower** | **4.6K× slower** | **19.5K× slower** | **🏆 winner** | **3.8K× slower** | **4.4K× slower** | 2× slower | — |
| **collection-pipeline** | WASM ▶ production | **1.8K× slower** | **4.9K× slower** | **281.9K× slower** | **998.3K× slower** | **19.7K× slower** | **3.1K× slower** | **3.0K× slower** | **🏆 winner** | — |
| **governance-cost** | Rust (generic) | 1.1× slower | **🏆 winner** | **456× slower** | **23.7K× slower** | **8.2K× slower** | **388.5K× slower** | **264.9K× slower** | **60× slower** | — |
| **hardware-targets** | WASM ▶ production | **148× slower** | **147× slower** | **192× slower** | — | **1.4K× slower** | **6.9K× slower** | **15.4K× slower** | **🏆 winner** | — |
| **low-memory** | WASM ▶ production | — | **5.2K× slower** | **10.0K× slower** | **1178.9K× slower** | **5.0K× slower** | **5.1K× slower** | **5.5K× slower** | **🏆 winner** | — |
| **gpu-compute** | WASM ▶ production | — | 1.3× slower | 1.3× slower | **122× slower** | **9.0K× slower** | **4.2K× slower** | **4.4K× slower** | **🏆 winner** | **336× slower** |
| **matrix-multiply** | WASM ▶ production | — | **13.1K× slower** | **33.9K× slower** | **1540.8K× slower** | **683× slower** | **3.2K× slower** | **3.3K× slower** | **🏆 winner** | **91.2K× slower** |
| **crypto-ops** | LogicN passive ⟨interp⟩ | — | — | — | — | **🏆 winner** | 3× slower | **71× slower** | — | — |
| **text-html** | LogicN passive ⟨interp⟩ | — | — | — | — | **🏆 winner** | **26× slower** | **205× slower** | — | — |
| **tri-logic** | WASM ▶ production | — | — | — | — | **4.7K× slower** | **15.0K× slower** | **15.1K× slower** | **🏆 winner** | — |
| **data-query** | LogicN manifest ⟨interp⟩ | — | — | — | — | 3× slower | **🏆 winner** | **🏆 winner** | — | — |
| **call-chain** | Node.js | — | — | **🏆 winner** | **114× slower** | **4.2K× slower** | **4.1K× slower** | **4.2K× slower** | — | — |
| **nbody** | LogicN passive ⟨interp⟩ | — | — | **19× slower** | **1.3K× slower** | **🏆 winner** | 1.1× slower | 1.1× slower | — | — |
| **json-parse** | LogicN passive ⟨interp⟩ | — | — | — | — | **🏆 winner** | **11× slower** | **13× slower** | — | — |

> Bold = significantly behind (>10×). Blanks = benchmark not run for this runtime.
> Fibonacci passive is excluded from 'winner' comparison — LRU cache hit is not a fair race.
> gpu-compute GPU: NVIDIA GeForce RTX 2060 slower than CPU at 100K elements (setup overhead dominates — crossover ~500K elements).

---

## Benchmark Glossary — what each benchmark measures

| Benchmark | What it measures | Why it matters |
|---|---|---|
| **arithmetic-threshold** | Integer arithmetic loop: count operations above a threshold at 4B/s | Raw CPU / WASM JIT ceiling — the fastest possible pure number-crunching |
| **call-chain** | Flow-to-flow call chain (A→B→C→D): function-call overhead | Real programs call multiple governed flows; this isolates dispatch cost |
| **collection-pipeline** | Functional pipeline: filter → map → reduce over 10K integer records | Data transformation throughput — the bread-and-butter of governed APIs |
| **compute-mix** | Mixed workload: string ops, conditionals, arithmetic, object creation | Closest to real-world application code; no single hot path |
| **crypto-ops** | SHA-256 hashing, HMAC, Ed25519 sign+verify (via stdlib) | Performance of governed cryptographic operations (used in every secure flow) |
| **data-query** | Filter + sort + aggregate over 1K records with governance checks | LogicN's home turf — **governed path wins this benchmark** |
| **fibonacci-recursive** | Recursive fib(20): tail-call and LRU cache warm path | Tests recursion overhead + caching benefit across governed/passive/WASM tiers |
| **governance-cost** | Sum 1..100 (triangle number) with full governance verification overhead | Directly measures the cost of LogicN's contract{} checking vs raw arithmetic |
| **gpu-compute** | Parallel map-reduce kernel (100K elements) via Deno WebGPU | GPU dispatch throughput on RTX 2060 — the WASM/GPU crossover point |
| **hardware-targets** | Dispatch to 5 hardware targets: CPU/GPU/NPU/WASM/fallback | Route decision overhead when contract.targets{} selects execution path |
| **http-throughput** | Sequential HTTP requests/sec to a governed localhost endpoint | Server throughput — how fast LogicN can handle real HTTP requests |
| **json-parse** | Parse 500 JSON records: split on comma, split on colon, accumulate | Real I/O parsing workload — string-heavy, cache-friendly on repeat calls |
| **low-memory** | Process 10K items with strict heap budget (measures bytes/op) | Memory efficiency — critical for edge/embedded deployment targets |
| **matrix-multiply** | 32×32 integer GEMM (matrix multiplication) | Scientific / ML workload: dense arithmetic, benefits from SIMD/GPU |
| **nbody** | N-body gravitational force: pairwise O(N²) physics simulation | Compute-heavy scientific workload — **1,200× faster than Python** via cache |
| **record-allocation** | Create 10K records at 2.3B/s: struct construction throughput | Memory allocation cost under governance — critical for high-frequency APIs |
| **six-digit-guess** | Brute-force 6-digit PIN search with early exit | Branch-heavy search — tests conditional execution + JIT branch prediction |
| **text-html** | HTML template rendering: string interpolation + escaping | Web/rendering workload — string manipulation under governance |
| **tri-logic** | Balanced ternary (base-3) logic operations: trit arithmetic | Photonic/ternary compute path — future hardware target validation |
| **naming-check** | LLN-NAMING checker over 27 auth-service .lln files | DevTools throughput: how fast the naming linter processes a codebase |
| **context-receipt** | Context Receipt generation: 51–97% token reduction per flow | AI context window generation speed — how fast receipts are produced |
| **intelligence-search** | BM25 hybrid code search: index 81 flows, 10 queries/run | Code search latency — how fast logicn search responds |
| **provenance-trace** | Data lineage graph: source→transform→sink for 27 files | Compliance evidence generation speed — how fast the audit trail is built |

(node:20020) [DEP0190] DeprecationWarning: Passing args to a child process with shell option true can lead to security vulnerabilities, as the arguments are not escaped, only concatenated.
(Use `node --trace-deprecation ...` to show where the warning was created)
