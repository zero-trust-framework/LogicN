// Fuse B3 — end-to-end fusion test for the reference REST adapter.
//
// Builds on the B2 governed component loader (../../logicn-framework-app-kernel/
// dist/fuse-loader.js). It FUSES this package's *built* dist/ artifacts (governed,
// placeholder-signed .wasm + signed manifest with an embedded `fuse` block) into a
// host-callable component, then invokes the adapter's flows and asserts the REST
// dispatch end-to-end — proving the /src → governed .wasm → fused component path.
//
// PRECONDITION: the package must be built first:
//   cd <repo root> && node logicn.mjs build --package packages-logicn/logicn-api-protocol-rest
import assert from "node:assert/strict";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { mkdtempSync, mkdirSync, cpSync, rmSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";

// The B2 loader lives in the app-kernel package's dist/.
import { fusePackage } from "../../logicn-framework-app-kernel/dist/fuse-loader.js";

const here = dirname(fileURLToPath(import.meta.url));
// tests/ → package dir (this is the package being fused).
const PKG_DIR = join(here, "..");
const PKG_NAME = "logicn-api-protocol-rest";
const WASM_PATH = join(PKG_DIR, "dist", `${PKG_NAME}.wasm`);

// HTTP method codes on the wire ABI: 1=GET, 2=POST, 3=PUT, 4=DELETE.
// Path codes on the wire ABI:        1=/health, 2=/orders, 3=/orders/{id}.

// A warn sink so any loader WARN output is captured, not printed to the test log.
function capturingWarn() {
  const lines = [];
  return { warn: (m) => lines.push(m), lines };
}

// ── 1 — the built package FUSES and its governed flows run end-to-end ─────────
test("the built REST adapter fuses and invoke('main') routes POST /orders → 201", async () => {
  assert.ok(existsSync(WASM_PATH), "package must be built first (logicn build --package …)");
  const { warn, lines } = capturingWarn();

  // Placeholder-signed (Ed25519+ML-DSA-65) → treated as unsigned by the loader, so
  // we must opt in with allowUnsigned (fail-closed without it; covered in test 4).
  const component = await fusePackage(PKG_DIR, { allowUnsigned: true, warn });

  assert.equal(component.name, PKG_NAME);
  assert.equal(component.seam, "protocol.inbound");
  assert.deepEqual([...component.capabilities], ["network.inbound"]);

  // main() runs the representative POST /orders request → 201 Created.
  assert.equal(component.invoke("main"), 201);
  // allowUnsigned must announce that it admitted an unsigned manifest.
  assert.ok(lines.some((l) => l.includes("LLN-FUSE-UNSIGNED-ALLOWED")), "expected unsigned-allowed warning");
});

// ── 2 — the full REST dispatch matrix routes correctly through the fused wasm ──
test("the fused adapter dispatches the full (method, path) REST matrix", async () => {
  const { warn } = capturingWarn();
  const component = await fusePackage(PKG_DIR, { allowUnsigned: true, warn });

  // dispatch(method, path) → HTTP status. Deny-by-default for unknown routes/verbs.
  const cases = [
    // method, path, expected status, label
    [1, 1, 200, "GET /health → 200 OK"],
    [2, 1, 405, "POST /health → 405 Method Not Allowed"],
    [1, 2, 200, "GET /orders → 200 OK (list)"],
    [2, 2, 201, "POST /orders → 201 Created"],
    [3, 2, 405, "PUT /orders (collection) → 405"],
    [1, 3, 200, "GET /orders/{id} → 200 OK"],
    [3, 3, 200, "PUT /orders/{id} → 200 OK (replaced)"],
    [4, 3, 204, "DELETE /orders/{id} → 204 No Content"],
    [2, 3, 405, "POST /orders/{id} (item) → 405"],
    [1, 9, 404, "GET /unknown → 404 Not Found (deny-by-default)"],
    [0, 2, 400, "bad method → 400 Bad Request"],
  ];
  for (const [method, path, expected, label] of cases) {
    assert.equal(component.invoke("dispatch", method, path), expected, label);
  }

  // The per-route helpers are exported and individually callable too.
  assert.equal(component.invoke("routeHealth", 1), 200, "routeHealth GET");
  assert.equal(component.invoke("routeOrders", 2), 201, "routeOrders POST");
  assert.equal(component.invoke("routeOrderItem", 4), 204, "routeOrderItem DELETE");
});

// ── 3 — a tampered .wasm (hash ≠ signed descriptor) is rejected, fail-closed ──
test("a tampered .wasm (sha256 mismatch vs signed descriptor) is rejected before fusion", async () => {
  const root = mkdtempSync(join(tmpdir(), "lln-b3-"));
  const pkg = join(root, PKG_NAME);
  mkdirSync(pkg, { recursive: true });
  cpSync(PKG_DIR, pkg, { recursive: true });
  try {
    // Corrupt the wasm by appending a byte; the embedded (signed) descriptor's
    // wasmSha256 no longer matches, so fusion must throw before instantiation.
    const tamperedWasm = join(pkg, "dist", `${PKG_NAME}.wasm`);
    const original = readFileSync(tamperedWasm);
    writeFileSync(tamperedWasm, Buffer.concat([original, Buffer.from([0x00])]));

    await assert.rejects(
      () => fusePackage(pkg, { allowUnsigned: true, warn: () => {} }),
      /LLN-FUSE-HASH-MISMATCH/,
      "tampered wasm must be refused with a hash-mismatch fusion error",
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

// ── 4 — an unsigned manifest is fail-closed without allowUnsigned ─────────────
test("the placeholder-signed manifest is refused unless allowUnsigned is set", async () => {
  await assert.rejects(
    () => fusePackage(PKG_DIR, { warn: () => {} }),
    /LLN-FUSE-UNSIGNED/,
    "unsigned manifest must be refused fail-closed when allowUnsigned is not set",
  );
});
