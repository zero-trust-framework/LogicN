import { test } from "node:test";
import assert from "node:assert/strict";
import { assertDeterminism, validateManifestShape, canonicalManifestString, oracleAgrees } from "../dist/index.js";

function caught(fn) { try { fn(); return null; } catch (e) { return e; } }
const H = "a".repeat(64);

test("assertDeterminism throws on a non-deterministic ternary result", () => {
  assert.doesNotThrow(() => assertDeterminism({ value: 1, executedNatively: false, bridgeId: "b", technique: "ternary", latencyMs: 0, deterministic: true }));
  const err = caught(() => assertDeterminism({ value: 1, executedNatively: true, bridgeId: "b", technique: "ternary", latencyMs: 0, deterministic: false }));
  assert.ok(err); assert.match(String(err.message), /CITIZEN_STANDARD_VIOLATION/);
  // non-ternary non-deterministic is allowed
  assert.doesNotThrow(() => assertDeterminism({ value: 0, executedNatively: false, bridgeId: "b", technique: "fp4_block", latencyMs: 0, deterministic: false }));
});

test("validateManifestShape enforces hashes + certified determinism", () => {
  const base = { bridgeId: "bitnet-cpu", packageName: "@logicn/ext-bridge-cpp", packageHash: H, sourceEngine: "microsoft/BitNet", precision: "ternary", layoutVersion: "i2s-v1", hardwareIdentity: "x86_64-avx2", determinismMode: "exact", certificationProfile: "certified" };
  assert.equal(validateManifestShape(base).ok, true);
  assert.equal(validateManifestShape({ ...base, packageHash: "nothex" }).ok, false);
  assert.equal(validateManifestShape({ ...base, determinismMode: "unverified" }).ok, false, "certified cannot be unverified");
  assert.equal(validateManifestShape({ ...base, certificationProfile: "dev", determinismMode: "unverified" }).ok, true, "dev may be unverified");
});

test("canonicalManifestString is deterministic + order-stable", () => {
  const m = { bridgeId: "b", packageName: "p", packageHash: H, sourceEngine: "e", precision: "ternary", layoutVersion: "v1", hardwareIdentity: "hw", determinismMode: "exact", certificationProfile: "dev" };
  assert.equal(canonicalManifestString(m), canonicalManifestString({ ...m }));
});

test("oracleAgrees compares the scaled integer accumulator bit-exactly", () => {
  const a = { value: 42, technique: "ternary", bridgeId: "x", executedNatively: true, latencyMs: 0, deterministic: true };
  const b = { value: 42, technique: "ternary", bridgeId: "oracle", executedNatively: false, latencyMs: 0, deterministic: true };
  assert.equal(oracleAgrees(a, b), true);
  assert.equal(oracleAgrees({ ...a, value: 43 }, b), false);
});

test("validateManifestShape: determinismMode=tolerance is admissible ONLY when fully pinned (fail-closed, ffsim §13.1)", () => {
  const tol = {
    bridgeId: "ffsim-quantum-v1", packageName: "@logicn/ext-bridge-quantum", packageHash: H,
    sourceEngine: "qiskit-community/ffsim", layoutVersion: "ffsim-job-v1", hardwareIdentity: "py-ffsim-oop",
    determinismMode: "tolerance", certificationProfile: "certified",
    domain: "quantum", tolerance: 1e-8, pinnedEnvHash: H, backendArtifactHash: H,  // precision OMITTED (N/A for quantum)
  };
  assert.equal(validateManifestShape(tol).ok, true, "fully-pinned tolerance + certified is admissible");
  assert.equal(tol.precision, undefined, "precision is optional for domain:quantum");
  // Fail-closed: any missing pin invalidates, even (especially) under certified.
  assert.equal(validateManifestShape({ ...tol, tolerance: undefined }).ok, false, "missing tolerance");
  assert.equal(validateManifestShape({ ...tol, pinnedEnvHash: undefined }).ok, false, "missing pinnedEnvHash");
  assert.equal(validateManifestShape({ ...tol, backendArtifactHash: undefined }).ok, false, "missing backendArtifactHash");
  assert.equal(validateManifestShape({ ...tol, tolerance: 0 }).ok, false, "tolerance must be > 0");
  assert.equal(validateManifestShape({ ...tol, pinnedEnvHash: "nothex" }).ok, false, "pins must be sha256 hex");
});

test("canonicalManifestString: extension fields leave existing inference-manifest hashes byte-identical", () => {
  const inf = {
    bridgeId: "bitnet-cpu", packageName: "@logicn/ext-bridge-cpp", packageHash: H, nativeAddonHash: H,
    sourceEngine: "microsoft/BitNet", precision: "ternary", layoutVersion: "i2s-v1",
    hardwareIdentity: "x86_64-avx2", determinismMode: "exact", certificationProfile: "certified",
  };
  // The pre-extension 10-field pre-image, byte-for-byte (what attested hashes were pinned against).
  const expected = JSON.stringify([
    inf.bridgeId, inf.packageName, inf.packageHash, inf.nativeAddonHash, inf.sourceEngine,
    inf.precision, inf.layoutVersion, inf.hardwareIdentity, inf.determinismMode, inf.certificationProfile,
  ]);
  assert.equal(canonicalManifestString(inf), expected, "inference manifest serialization is unchanged by the extension");
  // A quantum manifest DOES append the extension block → a distinct pre-image.
  const q = { ...inf, domain: "quantum", precision: undefined, determinismMode: "tolerance", tolerance: 1e-8, pinnedEnvHash: H, backendArtifactHash: H };
  assert.notEqual(canonicalManifestString(q), expected);
  assert.match(canonicalManifestString(q), /quantum/);
});
