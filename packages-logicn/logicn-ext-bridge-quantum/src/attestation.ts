// attestation.ts — Phase 1.5 (CF-3/CF-7): attest + admit the ffsim BridgeManifest via
// tower-citizen's bridge-attestation. Uses the hybrid Ed25519+ML-DSA-65 path now available (#34):
// Ed25519-only and hybrid are both supported, and a hybrid policy (one carrying an ML-DSA public
// key) requires BOTH signatures — an Ed25519-only attestation is denied (no PQ downgrade).
// Pure governance, no ffsim. (The AuditLogger lifecycle wiring is the remaining Phase-1.5 step.)
import {
  signManifest, verifyAttestation, signManifestHybrid, verifyAttestationHybrid,
  type AttestationPolicy, type AttestationResult,
} from "../../logicn-tower-citizen/dist/index.js";
import type { BridgeManifest, BridgeAttestation } from "../../logicn-inference-bridge-contract/dist/index.js";

/**
 * Sign the ffsim manifest. Hybrid (Ed25519 + ML-DSA-65) when an ML-DSA secret key is supplied;
 * otherwise classical Ed25519. The signing key lives in key custody (#149), never in the package.
 */
export async function attestFfsimManifest(
  manifest: BridgeManifest,
  privateKeyPem: string,
  mlDsaPrivateKey?: Uint8Array,
): Promise<BridgeAttestation> {
  return mlDsaPrivateKey !== undefined
    ? signManifestHybrid(manifest, privateKeyPem, mlDsaPrivateKey)
    : signManifest(manifest, privateKeyPem);
}

/**
 * Admit (verify) the ffsim backend's attestation before any job runs (CF-3/CF-7). If the policy
 * carries an ML-DSA public key, BOTH halves must verify (verifyAttestationHybrid — no PQ downgrade);
 * otherwise classical Ed25519. Fails CLOSED on a missing, downgraded, or tampered attestation.
 */
export async function verifyFfsimAdmission(
  attestation: BridgeAttestation | undefined,
  policy: AttestationPolicy,
): Promise<AttestationResult> {
  return policy.mlDsaPublicKey !== undefined
    ? verifyAttestationHybrid(attestation, policy, policy.mlDsaPublicKey)
    : verifyAttestation(attestation, policy);
}
