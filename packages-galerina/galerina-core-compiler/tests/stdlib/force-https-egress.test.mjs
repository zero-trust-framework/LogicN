// =============================================================================
// Force-HTTPS boot setting at the outbound dial (owner "force https on http").
//
// Default: plaintext PUBLIC http egress is DENIED (TLS required). An explicit operator opt-out
// (GALERINA_ALLOW_PLAINTEXT_EGRESS=true) relaxes it — but never relaxes the SSRF host guard.
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";
import { callStdlib } from "../../dist/index.js";

const ctx = { recordEffect: () => {}, resolveIdentifier: () => undefined, callFlow: async () => ({}), applyFn: async () => ({}) };
const str = (v) => ({ __tag: "string", value: v });
async function withFetch(fn, run) {
  const real = globalThis.fetch;
  globalThis.fetch = fn;
  try { return await run(); } finally { globalThis.fetch = real; }
}
const resp = (status, body = "OK") => ({
  status, ok: status >= 200 && status < 300,
  headers: { get: () => null }, arrayBuffer: async () => new TextEncoder().encode(body).buffer,
});

test("default (no env): plaintext PUBLIC http egress is denied (force-HTTPS)", async () => {
  delete process.env.GALERINA_ALLOW_PLAINTEXT_EGRESS;
  const r = await callStdlib("http.get", undefined, [str("http://example.com/x")], ctx);
  assert.equal(r.__tag, "err");
  assert.match(r.error?.value ?? "", /TLS \(https\) required|TLS_REQUIRED/);
});

test("operator opt-out (=true): plaintext public http egress is permitted", async () => {
  process.env.GALERINA_ALLOW_PLAINTEXT_EGRESS = "true";
  try {
    const r = await withFetch(() => resp(200, "OK-PLAINTEXT"), () =>
      callStdlib("http.get", undefined, [str("http://example.com/x")], ctx));
    assert.equal(r.__tag, "ok", `expected ok, got ${JSON.stringify(r)}`);
  } finally {
    delete process.env.GALERINA_ALLOW_PLAINTEXT_EGRESS;
  }
});

test("the opt-out does NOT relax SSRF — an internal plaintext host is still denied", async () => {
  process.env.GALERINA_ALLOW_PLAINTEXT_EGRESS = "true";
  try {
    const r = await callStdlib("http.get", undefined, [str("http://169.254.169.254/latest/meta-data/")], ctx);
    assert.equal(r.__tag, "err");
    assert.match(r.error?.value ?? "", /SSRF/);
  } finally {
    delete process.env.GALERINA_ALLOW_PLAINTEXT_EGRESS;
  }
});

test("https on 443 is unaffected (the normal path still works)", async () => {
  delete process.env.GALERINA_ALLOW_PLAINTEXT_EGRESS;
  const r = await withFetch(() => resp(200, "OK-TLS"), () =>
    callStdlib("http.get", undefined, [str("https://example.com/x")], ctx));
  assert.equal(r.__tag, "ok", `expected ok, got ${JSON.stringify(r)}`);
});
