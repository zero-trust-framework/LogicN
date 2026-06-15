// =============================================================================
// Manifest Generator — Security Invariant Regression Test
//
// Pins the property that the source-file PATH is bound INSIDE the
// cryptographically signed manifest body. The signing target is
// sha256Hex(canonicalJson(manifestBody)) (see generateManifest:589-606 in
// src/manifest-generator.ts); the Ed25519 / ML-DSA-65 signatures in logicn.mjs
// cover exactly that body hash. Because `sourceFile` is a member of `manifestBody`
// (alongside `sourceHash`), the path and the source content are sealed together
// under ONE signature — an attacker cannot swap or reorder the path a manifest
// claims to describe without invalidating the signature.
//
// WHY THIS TEST EXISTS: surfaced by the TMX-256 / TriMerkle-XOF boundary review
// (notes/32). A future refactor could plausibly "tidy" the manifest by moving
// `sourceFile` out of the signed body into a cosmetic sibling field — silently
// reopening a swap/reorder attack surface. This test fails loudly if that happens.
//
// SCOPE GUARD: this is a TEST-ONLY safeguard for a property the generator ALREADY
// has. It deliberately keeps SHA-256 as the hash primitive and introduces NO
// TriMerkle / tree-hash machinery (that is TritMesh-only).
// =============================================================================

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  generateManifest,
  canonicalJson,
  sha256Hex,
} from "../dist/manifest-generator.js";

// ---------------------------------------------------------------------------
// Minimal valid inputs (shapes per src/parser.ts FlowMeta / SourceLocation)
// ---------------------------------------------------------------------------

const SOURCE = `pure flow calculateVat(price: Money) -> Money {
  return price
}
`;

/** One minimal, well-formed FlowMeta. */
const FLOWS = [
  {
    name: "calculateVat",
    qualifier: "pure",
    params: ["price: Money"],
    returnType: "Money",
    declaredEffects: [],
    location: { file: "examples/vat.lln", line: 1, column: 1 },
  },
];

// A FIXED timestamp pins both `generatedAt` and `policyResolutionDag.resolvedAt`
// (generateManifest:584,602), so two manifests differing ONLY by sourceFile are
// otherwise byte-identical — isolating the path as the sole hash driver.
const GENERATED_AT = "2026-06-15T00:00:00.000Z";

// Windows-style path (backslashes) and its expected normalized form.
const WIN_PATH = "C:\\wwwprojects\\LogicN\\examples\\vat.lln";
const POSIX_PATH = "C:/wwwprojects/LogicN/examples/vat.lln";

const PLACEHOLDER_PREFIX = "placeholder:sha256:";

/** Strip the signature → the exact object that was the signing target. */
function bodyOf(manifest) {
  const { governanceSignature, ...body } = manifest;
  return body;
}

/** Recover the signed body hash embedded in the (placeholder) signature. */
function embeddedBodyHash(manifest) {
  const sig = manifest.governanceSignature.ed25519;
  assert.ok(sig.startsWith(PLACEHOLDER_PREFIX), `unexpected signature form: ${sig}`);
  return sig.slice(PLACEHOLDER_PREFIX.length);
}

function makeManifest(sourceFile) {
  return generateManifest(SOURCE, sourceFile, FLOWS, undefined, GENERATED_AT);
}

// ---------------------------------------------------------------------------
// (a) sourceFile is present in the manifest
// ---------------------------------------------------------------------------

describe("manifest-generator: sourceFile presence", () => {
  it("the returned manifest carries a non-empty sourceFile", () => {
    const m = makeManifest(WIN_PATH);
    assert.equal(typeof m.sourceFile, "string");
    assert.ok(m.sourceFile.length > 0, "sourceFile must not be empty");
  });

  it("sourceFile is a member of the SIGNED body, not the signature wrapper", () => {
    const m = makeManifest(WIN_PATH);
    assert.ok(
      Object.prototype.hasOwnProperty.call(bodyOf(m), "sourceFile"),
      "sourceFile must live in the manifest body (the signing target)",
    );
  });
});

// ---------------------------------------------------------------------------
// (b) sourceFile is covered by bodyHash / the signature
// ---------------------------------------------------------------------------

describe("manifest-generator: sourceFile is bound inside the signed body hash", () => {
  it("recomputed sha256(canonicalJson(body)) matches the signed body hash", () => {
    const m = makeManifest(POSIX_PATH);
    const recomputed = sha256Hex(canonicalJson(bodyOf(m)));
    assert.equal(
      recomputed,
      embeddedBodyHash(m),
      "the body we recompute (which includes sourceFile) must hash to the signed body hash",
    );
  });

  it("the signed canonical bytes literally contain the path", () => {
    const m = makeManifest(POSIX_PATH);
    const canon = canonicalJson(bodyOf(m));
    assert.ok(
      canon.includes(POSIX_PATH),
      "the path must appear in the canonical bytes that are hashed and signed",
    );
  });

  it("mutating ONLY sourceFile changes the signed body hash (path is inside the body, not cosmetic)", () => {
    const m = makeManifest(POSIX_PATH);
    const body = bodyOf(m);

    const originalHash = sha256Hex(canonicalJson(body));
    assert.equal(originalHash, embeddedBodyHash(m), "sanity: recomputed == signed");

    // Tamper with the path alone — every other field byte-identical.
    const tampered = { ...body, sourceFile: "C:/attacker/swapped.lln" };
    const tamperedHash = sha256Hex(canonicalJson(tampered));

    assert.notEqual(
      tamperedHash,
      originalHash,
      "Changing only sourceFile MUST change the body hash. If it did not, the path " +
        "would be outside the signature and a swap/reorder attack would go undetected.",
    );
  });

  it("two manifests differing ONLY by sourceFile produce different signatures (anti-swap, end-to-end)", () => {
    const a = makeManifest("C:/wwwprojects/LogicN/examples/vat.lln");
    const b = makeManifest("C:/wwwprojects/LogicN/examples/other.lln");

    // Control: identical SOURCE ⇒ identical sourceHash. The ONLY varying input is the path.
    assert.equal(a.sourceHash, b.sourceHash, "control: same source content ⇒ same sourceHash");

    assert.notEqual(
      embeddedBodyHash(a),
      embeddedBodyHash(b),
      "body hash must differ when only the path differs",
    );
    assert.notEqual(
      a.governanceSignature.ed25519,
      b.governanceSignature.ed25519,
      "Ed25519 signature must differ when only the path differs",
    );
    assert.notEqual(
      a.governanceSignature.mlDsa65,
      b.governanceSignature.mlDsa65,
      "ML-DSA-65 signature must differ when only the path differs",
    );
  });
});

// ---------------------------------------------------------------------------
// (c) backslashes normalized to forward slashes — BEFORE signing
// ---------------------------------------------------------------------------

describe("manifest-generator: sourceFile path normalization", () => {
  it("normalizes backslashes to forward slashes", () => {
    const m = makeManifest(WIN_PATH);
    assert.equal(m.sourceFile, POSIX_PATH);
    assert.ok(!m.sourceFile.includes("\\"), "no backslashes may remain in sourceFile");
  });

  it("the NORMALIZED path (not the raw backslash form) is what gets signed", () => {
    const m = makeManifest(WIN_PATH);
    const canon = canonicalJson(bodyOf(m));
    assert.ok(canon.includes(POSIX_PATH), "normalized path must be in the signed canonical bytes");

    // Equivalence: signing the backslash path and the forward-slash path yields the
    // same body hash — normalization happens upstream of the signature, so the two
    // spellings are not distinguishable swap targets.
    const fromWin = makeManifest(WIN_PATH);
    const fromPosix = makeManifest(POSIX_PATH);
    assert.equal(
      embeddedBodyHash(fromWin),
      embeddedBodyHash(fromPosix),
      "backslash and forward-slash spellings of the same path must sign identically",
    );
  });
});
