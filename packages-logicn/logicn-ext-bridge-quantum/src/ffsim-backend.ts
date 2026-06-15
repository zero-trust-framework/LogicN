// ffsim-backend.ts — the QuantumSimBackend.
//
// Phase 1 (this file): env-detect + the PRE-SPAWN governance gate (Hardened Border
// Stage 2). It does NOT execute ffsim yet — real out-of-process run is Phase 2. Every
// job still passes the full limit gate; a breach traps with LOAD→TRAP→ERASE and NO spawn.
import { createHash } from "node:crypto";
import { detectFfsim, type FfsimEnv } from "./env-detect.js";
import { checkJobLimits } from "./limits.js";
import type { QuantumJob, QuantumLimits, QuantumResult, QuantumSimBackend } from "./quantum-contract.js";

const BACKEND_ID = "ffsim-quantum-v1";

function inputHash(job: QuantumJob): string {
  return createHash("sha256")
    .update(JSON.stringify([job.op, job.norb, job.nelec, job.seed, job.params]))
    .digest("hex");
}

export class FfsimBackend implements QuantumSimBackend {
  readonly backendId = BACKEND_ID;
  #env: FfsimEnv;

  /** `env` is injectable for deterministic tests; defaults to a live `detectFfsim()` probe. */
  constructor(env?: FfsimEnv) { this.#env = env ?? detectFfsim(); }

  get available(): boolean { return this.#env.available; }

  async initialize(): Promise<void> { /* per-call spawn (RATIFIED §13.6) — no warm pool to init. */ }
  async shutdown(): Promise<void> { /* no persistent worker in v1. */ }

  async run(job: QuantumJob, limits: QuantumLimits): Promise<QuantumResult> {
    const startedAt = Date.now();
    const provBase = {
      backendVersion: this.#env.ffsimVersion ?? "",
      backendArtifactHash: "", seed: job.seed, rayonThreads: limits.rayonThreads,
      tolerance: limits.tolerance, inputHash: inputHash(job), outputHash: "",
    };

    // Stage 2 — Interrogate: the pre-spawn limit gate. A breach is LOAD→TRAP→ERASE, no spawn.
    const verdict = checkJobLimits(job, limits);
    if (!verdict.ok) {
      return {
        correlationId: job.correlationId, backendId: BACKEND_ID, executedNatively: false,
        scalars: {}, artifacts: [], provenance: provBase,
        latencyMs: Date.now() - startedAt, trapFired: true,
        errorCode: verdict.errorCode, reason: verdict.reason,
      };
    }

    // Stage 3 — Execute: the real out-of-process ffsim run is Phase 2. Phase 1 is honest:
    // it governs the job but does not execute it, and never fakes a result.
    const reason = this.#env.available
      ? "limits OK; ffsim present — real out-of-process execution is Phase 2 (not yet implemented)"
      : `ffsim unavailable: ${this.#env.reason ?? "not detected"}`;
    return {
      correlationId: job.correlationId, backendId: BACKEND_ID, executedNatively: false,
      scalars: {}, artifacts: [], provenance: provBase,
      latencyMs: Date.now() - startedAt, trapFired: false, reason,
    };
  }
}
