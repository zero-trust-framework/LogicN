// Force-HTTPS egress boot setting (owner "force https on http").
import { test } from "node:test";
import assert from "node:assert/strict";

const { resolveEgressTls, ALLOW_PLAINTEXT_EGRESS_ENV } = await import("../dist/index.js");

test("resolveEgressTls — default FORCES HTTPS (requireTls, port 443, not relaxed)", () => {
  const s = resolveEgressTls(undefined);
  assert.equal(s.requireTls, true);
  assert.deepEqual([...s.allowedPorts], [443]);
  assert.equal(s.relaxed, false);
});

test("resolveEgressTls — explicit truthy env relaxes force-HTTPS (operator override, surfaced)", () => {
  for (const v of ["true", "1"]) {
    const s = resolveEgressTls(v);
    assert.equal(s.requireTls, false, v);
    assert.equal(s.relaxed, true, v);
    assert.equal(s.allowedPorts.length, 0, v);
  }
});

test("resolveEgressTls — anything-but-exactly-truthy keeps force-HTTPS (fail-secure, case-sensitive)", () => {
  for (const v of ["false", "0", "", "yes", "TRUE", "True", undefined]) {
    assert.equal(resolveEgressTls(v).requireTls, true, String(v));
    assert.equal(resolveEgressTls(v).relaxed, false, String(v));
  }
});

test("ALLOW_PLAINTEXT_EGRESS_ENV is the documented env name", () => {
  assert.equal(ALLOW_PLAINTEXT_EGRESS_ENV, "GALERINA_ALLOW_PLAINTEXT_EGRESS");
});
