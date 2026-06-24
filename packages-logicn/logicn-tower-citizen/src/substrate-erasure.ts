/**
 * substrate-erasure.ts — LLN-RETAIN-001 sound-erasure admission gate (R&D 0116 / 0118).
 *
 * R&D 0116 found a silent fail-open: LogicN's secret-erasure is OVERWRITE-based (zero the arena
 * page / derived-secret buffer; B2/B2b in wat-emitter.ts). That is silently FALSE on write-once /
 * fixed media — a thermally-fixed photorefractive hologram cannot be erased optically (>170 °C
 * re-heat only), WORM glass is physically immutable, and unfixed holograms leave residual gratings
 * (data remanence). NIST SP 800-88 Rev. 1 names cryptographic-erase = the "Purge" technique for
 * exactly such media: seal before write, keep the DEK on overwritable silicon, "delete" = destroy
 * the key.
 *
 * This is the RUNTIME DEFENSE (stage 2) of the LLN-RETAIN-001 Hardware Protection Directive — the
 * Substrate Dispatch Gateway's fail-closed K3 admission check on every write to a governed substrate.
 *
 * ZERO-TRUST DISCOVERY RULE (the crux): an eraseModel is NEVER taken from a drive's self-report.
 * `overwrite` (the permissive model) is granted ONLY by a verified SIGNED attestation carrying the
 * `storage.admit` capability (the admitPhotonicConfig-style rail). An unknown / unattested / merely
 * self-claimed substrate FAILS CLOSED TO THE STRICTER MODEL (`crypto-only`) — so a WORM drive that
 * lies "overwrite" is denied because the lie is not signed. Deny-by-default.
 *
 * Invariant: crypto stays BINARY (this gate runs in the core). The decision is a pure K3 verdict;
 * the actual hardware dispatch + the signed-attestation verification (reusing photonic-admission's
 * hash-pin + Ed25519 + revocation) wire in when a real storage-admission path lands (HW-gated,
 * #102-106). The OBLIGATION is enforced now so it cannot be silently violated.
 */

import {
  Verdict,
  decideAtBoundary,
  type BoundaryDecision,
  type GovernanceDiagnostic,
} from "./three-valued-governance.js";

/** The capability a substrate descriptor MUST declare — and the admitter MUST hold — to mount storage. */
export const STORAGE_ADMIT_CAP = "storage.admit" as const;

/** The two erasure physics classes. `overwrite` = the data can be zeroed in place; `crypto-only` = it cannot. */
export type EraseModel = "overwrite" | "crypto-only";

/** A governed storage substrate. `claimedEraseModel` is an UNTRUSTED hint unless `attested` is true. */
export interface SubstrateDescriptor {
  /** Free-form id for audit (drive serial, mount point, mesh seam). */
  readonly id?: string;
  /** The eraseModel the substrate CLAIMS. Treated as an untrusted hint unless `attested === true`. */
  readonly claimedEraseModel?: EraseModel;
  /**
   * True IFF `claimedEraseModel` is backed by a VERIFIED signed attestation (hash-pinned + Ed25519
   * + non-revoked, carrying `storage.admit`). A self-reported boot value is NOT an attestation.
   */
  readonly attested?: boolean;
}

/** A value about to be written to a substrate. */
export interface WritePayload {
  /** True IFF the value is — or derives from — a secret (SealTaint; LLN-SECRET-002 / LLN-PRIVACY-002). */
  readonly isSecretTainted: boolean;
  /** True IFF the value is KEM-DEM ciphertext (sealed) — erasable by destroying its DEK. */
  readonly isSealed: boolean;
}

export interface SubstrateWriteAdmission {
  readonly decision: BoundaryDecision;
  /** True IFF the write is admitted (== decision.authorized). The gateway routes ONLY when true. */
  readonly admitted: boolean;
  /** The eraseModel actually enforced (after the fail-closed-to-stricter resolution). */
  readonly effectiveEraseModel: EraseModel;
  /** Audit reason. */
  readonly reason: string;
}

/**
 * Fail-closed-to-stricter resolution: `overwrite` is honoured ONLY when a verified attestation
 * vouches it; every other case (unknown, unattested, self-claimed, or claimed `crypto-only`)
 * resolves to `crypto-only`. This is the zero-trust core: a lying drive cannot downgrade itself.
 */
export function effectiveEraseModel(s: SubstrateDescriptor | undefined): EraseModel {
  return s?.attested === true && s.claimedEraseModel === "overwrite" ? "overwrite" : "crypto-only";
}

/**
 * The Substrate Dispatch Gateway's K3 admission check (LLN-RETAIN-001). Fail-closed, deny-by-default.
 * The hardware dispatch seam MUST call this BEFORE writing and route ONLY if `admitted`.
 *
 * Truth table (effectiveEraseModel × payload):
 *   overwrite                              → ALLOW  (overwrite-erase is sound; the retain gate passes)
 *   crypto-only · ¬secret                  → ALLOW  (public data carries no erasure obligation)
 *   crypto-only · secret · sealed          → ALLOW  (KEM-DEM ciphertext — crypto-erasable by DEK destruction)
 *   crypto-only · secret · ¬sealed         → DENY   (cleartext secret is UNERASABLE here — LLN-RETAIN-001)
 * A malformed/absent payload is treated as a secret (fail-closed): unknown taint ⇒ assume secret.
 */
export function admitSubstrateWrite(
  payload: WritePayload | undefined,
  substrate: SubstrateDescriptor | undefined,
  onDiagnostic?: (d: GovernanceDiagnostic) => void,
): SubstrateWriteAdmission {
  const model = effectiveEraseModel(substrate);
  const at = (v: Verdict, reason: string): SubstrateWriteAdmission => {
    const decision = decideAtBoundary(v, onDiagnostic);
    return { decision, admitted: decision.authorized, effectiveEraseModel: model, reason };
  };

  // Overwrite media (attested): overwrite-erasure is sound, so the RETAIN obligation is discharged.
  // (Other rules — LLN-SECRET sink discipline — still apply elsewhere; this gate is erasure-only.)
  if (model === "overwrite") return at(Verdict.ALLOW, "attested overwrite-erasable substrate — RETAIN obligation N/A");

  // Crypto-only media. Fail-closed on a malformed payload: unknown taint ⇒ assume secret.
  const tainted = payload?.isSecretTainted !== false; // anything not explicitly non-secret is treated as secret
  const sealed = payload?.isSealed === true;

  if (!tainted) return at(Verdict.ALLOW, "non-secret payload — no erasure obligation on crypto-only media");
  if (sealed) return at(Verdict.ALLOW, "secret is KEM-DEM-sealed — crypto-erasable by DEK destruction (LLN-RETAIN-001)");
  return at(
    Verdict.DENY,
    "LLN-RETAIN-001: cleartext secret to a crypto-only substrate is UNERASABLE (overwrite-erase impossible) — seal with KEM-DEM before write; deletion = destroy the DEK + mint a crypto-erase witness",
  );
}
