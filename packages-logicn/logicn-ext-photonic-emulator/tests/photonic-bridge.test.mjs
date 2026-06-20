// photonic-bridge.test.mjs — the backend honours the neutral contract, fail-closed.

import { test } from "node:test";
import assert from "node:assert/strict";
import { PhotonicEmulatorBridge, tmacExact } from "../dist/index.js";
import { validateManifestShape, assertDeterminism } from "../../logicn-inference-bridge-contract/dist/index.js";

// Pack a trit array into BitNet I2_S i32 words (mirrors the engine's packTrits/decoder).
function packTrits(trits) {
  const words = Math.max(1, Math.ceil(trits.length / 16));
  const out = new Int32Array(words);
  for (let idx = 0; idx < trits.length; idx++) {
    const v = trits[idx] ?? 0;
    const enc = v === -1 ? 0 : v === 0 ? 1 : 2;
    const local = idx % 16, byteIdx = (local / 4) | 0, posInByte = local % 4;
    const shift = byteIdx * 8 + (3 - posInByte) * 2;
    out[(idx / 16) | 0] = (out[(idx / 16) | 0] | (enc << shift)) | 0;
  }
  return out;
}
const op = (trits, acts, corr = "c1") => ({ opClass: "feedforward", precision: "ternary", correlationId: corr, weights: packTrits(trits), activations: Int32Array.from(acts), count: trits.length, scale: 1 });

test("implements InferenceBridge with honest emulation flags", () => {
  const b = new PhotonicEmulatorBridge();
  assert.equal(b.bridgeId, "photonic-emulator");
  assert.equal(b.technique, "ternary");
  assert.equal(b.nativeAvailable, false); // emulated, not silicon
  assert.equal(typeof b.execute, "function");
  assert.equal(typeof b.initialize, "function");
  assert.equal(typeof b.shutdown, "function");
});

test("manifest is admissible under the SHIPPED validateManifestShape (tolerance fully pinned)", () => {
  const b = new PhotonicEmulatorBridge();
  assert.equal(b.manifest.determinismMode, "tolerance");
  assert.deepEqual(validateManifestShape(b.manifest), { ok: true });
  // The declared band may not be tighter than the measured witness epsilon.
  assert.ok(b.manifest.tolerance >= b.manifest.toleranceWitness.epsilonMeasured);
});

test("a tolerance manifest missing a pin is REJECTED (the fail-closed rail is real)", () => {
  const b = new PhotonicEmulatorBridge();
  const noEnv = { ...b.manifest }; delete noEnv.pinnedEnvHash;
  const noArtifact = { ...b.manifest }; delete noArtifact.backendArtifactHash;
  assert.equal(validateManifestShape(noEnv).ok, false);
  assert.equal(validateManifestShape(noArtifact).ok, false);
});

test("execute reports executedNatively=false + deterministic=false (honest analog)", () => {
  const b = new PhotonicEmulatorBridge();
  const r = b.execute(op([1, -1, 0, 1], [3, 2, 1, -2]));
  assert.equal(r.executedNatively, false);
  assert.equal(r.deterministic, false);
  assert.equal(r.technique, "ternary");
  assert.equal(typeof r.value, "number");
});

test("the photonic result correctly FAILS the bit-exact determinism oracle (why it needs tolerance re-verify)", () => {
  const b = new PhotonicEmulatorBridge();
  assert.throws(() => assertDeterminism(b.execute(op([1, -1, 0, 1], [3, 2, 1, -2]))), /CITIZEN_STANDARD_VIOLATION/);
});

test("executeExact returns the exact digital T-MAC (the cheap re-verify reference)", () => {
  const b = new PhotonicEmulatorBridge();
  const trits = [1, -1, 0, 1, 1, -1], acts = [3, 2, 1, -2, 0, 3];
  assert.equal(b.executeExact(op(trits, acts)), tmacExact(trits, acts, trits.length, 1));
});

test("a corrupt packed trit (0b11 sentinel) traps, never silently masks to 0", () => {
  const b = new PhotonicEmulatorBridge();
  // Element 0's 2-bit field lives at bit-shift 6 in the I2_S word, so the 0b11 sentinel goes there.
  const bad = { opClass: "feedforward", precision: "ternary", correlationId: "x", weights: Int32Array.from([0b11 << 6]), activations: Int32Array.from([1]), count: 1, scale: 1 };
  assert.throws(() => b.execute(bad), /PHOTONIC_CORRUPT_TRIT/);
});

test("a native handle (number weights) is refused — emulation needs packed trits", () => {
  const b = new PhotonicEmulatorBridge();
  const handle = { opClass: "feedforward", precision: "ternary", correlationId: "x", weights: 42, activations: Int32Array.from([1]), count: 1, scale: 1 };
  assert.throws(() => b.execute(handle), /PHOTONIC_EMULATOR/);
});
