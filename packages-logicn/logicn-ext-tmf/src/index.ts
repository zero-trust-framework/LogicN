// @logicn/ext-tmf — the .tmf format engine (Phase 2, roadmap #6).
//
// Build order (specs frozen in LogicN-R-AND-D/tmf/spec/*):
//   ✅ Slice 1 — TMX-256 integrity core (TriMerkle-XOF / SHAKE256)        [this file]
//   ⬜ Slice 2 — container reader/writer (header + section table, §7/§8 fail-closed reader)
//   ⬜ Slice 3 — KEM-DEM confidentiality (ML-KEM-768 hybrid → SHAKE/HKDF → AES-256-GCM)
//   ⬜ Slice 4 — ML-DSA-65 signing over the root (#7), via @noble/post-quantum (hybrid Ed25519)
//   ⬜ Slice 5 — inclusion proofs + history chain + Governed Trust Capsule (#12)
export { H, ARITY, ABSENT, leafHash, nodeHash, topNode, tmxRoot } from "./tmx256.js";
