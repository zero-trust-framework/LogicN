// execution-router.ts — the LogicN Execution Router: one decision across all routing axes.
//
// LogicN's execution routing was, until now, three separate routers a caller had to consult
// individually. This is the single front door that unifies them into ONE ExecutionDecision:
//
//   AXIS-1  capability tier   hardware() → {binary|hybrid|photonic}   (@logicn/hardware-tier)
//   AXIS-2  precision technique routePrecision(opClass, ctx)            (@logicn/tower-citizen)
//   AXIS-3  per-kernel offload PartitionDecider.decide(kernel)         (@logicn/ext-photonic-emulator)
//
// It COMPOSES the existing, proven routers — it re-derives no routing maths. Fail-closed and
// consistent with the Tri-Pipe: photonic offload is only ever considered for a TERNARY op on an
// offload-capable tier (hybrid/photonic); a binary tier, a non-ternary precision, or any uncertainty
// resolves to the digital path. Worst case == binary digital == today.

import { routePrecision, type RoutingContext, type PrecisionDecision } from "../../logicn-tower-citizen/dist/index.js";
import { resolveHardware, type Tier } from "../../logicn-hardware-tier/dist/index.js";
import { PartitionDecider, type KernelCost, type Target } from "../../logicn-ext-photonic-emulator/dist/index.js";
import type { InferenceOpClass } from "../../logicn-inference-bridge-contract/dist/index.js";

export interface CapabilityInput {
  /** Attested hardware target id (e.g. "photonic", "gpu", "cpu"). */
  readonly targetId: string;
  /** Result of verifyAttestation(att, policy).ok — attested, not self-claimed. */
  readonly attestationVerified: boolean;
  /** Pure tensor / no crypto-control (gates the photonic ceiling). Default false. */
  readonly componentFullyEligible?: boolean;
}

export interface ExecutionRouteInput {
  /** The op being routed (drives the precision decision). */
  readonly opClass: InferenceOpClass;
  /** Precision-router context (governance tier, fp4 hw, air-gap, declared tolerance). */
  readonly routing: RoutingContext;
  /** Attested hardware capability (drives the tier). */
  readonly capability: CapabilityInput;
  /** Per-kernel cost inputs (drive the offload decision: n, lane, isCrypto, …). */
  readonly kernel: KernelCost;
}

export interface ExecutionDecision {
  /** AXIS-1: the cached capability tier. */
  readonly tier: Tier;
  /** AXIS-2: the precision technique + scheduling + provenance. */
  readonly precision: PrecisionDecision;
  /** AXIS-3: the per-kernel offload target (digital | photonic). */
  readonly offloadTarget: Target;
  /** Why the offload target was chosen. */
  readonly offloadReason: string;
  /** True iff this op runs on the photonic backend (offloadTarget === "photonic"). */
  readonly photonic: boolean;
  /** Unified human-readable rationale across all three axes (→ audit trail). */
  readonly reason: string;
}

/** The unified router. Pure + deterministic: same input → same decision (reproducible audit). */
export class ExecutionRouter {
  private readonly decider: PartitionDecider;
  constructor(decider: PartitionDecider = new PartitionDecider()) { this.decider = decider; }

  route(input: ExecutionRouteInput): ExecutionDecision {
    // AXIS-1 — capability tier (attested, fail-closed to binary).
    const tier = resolveHardware({
      targetId: input.capability.targetId,
      attestationVerified: input.capability.attestationVerified,
      componentFullyEligible: input.capability.componentFullyEligible ?? false,
    });
    // AXIS-2 — precision technique for this op.
    const precision = routePrecision(input.opClass, input.routing);

    // AXIS-3 — photonic offload is ONLY considered for a TERNARY op on an offload-capable tier;
    // otherwise (binary tier / non-ternary precision) it is inert and the per-kernel router never runs.
    const offloadEligible = (tier === "hybrid" || tier === "photonic") && precision.precision === "ternary";
    const decision = offloadEligible
      ? this.decider.decide(input.kernel)
      : {
          target: "digital" as Target,
          reason: tier === "binary"
            ? "binary tier — no photonic offload"
            : `precision '${precision.precision}' is not ternary — photonic offload inert`,
        };

    return {
      tier,
      precision,
      offloadTarget: decision.target,
      offloadReason: decision.reason,
      photonic: decision.target === "photonic",
      reason: `tier=${tier} · precision=${precision.precision} (${precision.reason}) · offload=${decision.target} (${decision.reason})`,
    };
  }
}

/** Build a LogicN Execution Router. */
export function createExecutionRouter(): ExecutionRouter {
  return new ExecutionRouter();
}
