// =============================================================================
// substrate-math.ts (compiler) — re-export of the shared @galerinaa/substrate-math
//
// The pure NMR calculus was extracted into the @galerinaa/substrate-math package
// (single source of truth, shared with galerina-tower-citizen) — removing the
// copy-and-drift risk the golden-value oracle previously guarded. This thin shim
// keeps substrate-inference.ts's `./substrate-math.js` import path stable.
//
// Spec: docs/Knowledge-Bases/galerina-substrate-contracts.md §6.
// =============================================================================

export type { SubstrateNoiseParams } from "@galerinaa/substrate-math";
export { singleLaneErrorProbability, nmrFailureProbability, flipProbability } from "@galerinaa/substrate-math";
