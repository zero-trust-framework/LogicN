// =============================================================================
// substrate-math.ts (compiler) — re-export of the shared @logicn/substrate-math
//
// The pure NMR calculus was extracted into the @logicn/substrate-math package
// (single source of truth, shared with logicn-tower-citizen) — removing the
// copy-and-drift risk the golden-value oracle previously guarded. This thin shim
// keeps substrate-inference.ts's `./substrate-math.js` import path stable.
//
// Spec: docs/Knowledge-Bases/logicn-substrate-contracts.md §6.
// =============================================================================

export type { SubstrateNoiseParams } from "@logicn/substrate-math";
export { singleLaneErrorProbability, nmrFailureProbability, flipProbability } from "@logicn/substrate-math";
