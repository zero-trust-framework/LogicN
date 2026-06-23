/**
 * End-to-end tests for the LogicN HTTP API-server adapter.
 *
 * These drive a REAL kernel through a REAL socket: createAppKernel → createApiServer
 * → listen(0) → fire requests with node:http and assert the responses. Nothing is
 * mocked; the kernel's fixed pipeline produces the 404/405/422 statuses, and the
 * adapter's additive body cap produces the 413.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";

import { createAppKernel } from "../../logicn-framework-app-kernel/dist/index.js";
import { createApiServer, listen } from "../dist/index.js";

/** Build a kernel with one public POST /charge route → 200 {ok:true}. */
function buildKernel() {
  return createAppKernel({
    routes: [
      {
        method: "POST",
        path: "/charge",
        handler: "charge",
        auth: { mode: "public" },
      },
    ],
    dispatch: {
      charge: () => ({ status: 200, body: { ok: true } }),
    },
  });
}

/** Fire a single request through the socket and collect the full response. */
function request(port, { method, path, headers = {}, body }) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      { host: "127.0.0.1", port, method, path, headers },
      (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () =>
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: Buffer.concat(chunks).toString("utf8"),
          }),
        );
      },
    );
    req.on("error", reject);
    if (body !== undefined) req.write(body);
    req.end();
  });
}

/** Spin up the adapter, run `fn(port)`, always close the server. */
async function withServer(opts, fn) {
  const server = createApiServer({ kernel: buildKernel(), ...opts });
  const { port } = await listen(server, 0);
  try {
    return await fn(port);
  } finally {
    await new Promise((r) => server.close(() => r(undefined)));
  }
}

const JSON_HEADERS = { "content-type": "application/json" };

test("POST /charge with valid JSON → 200 {ok:true}", async () => {
  await withServer({}, async (port) => {
    const res = await request(port, {
      method: "POST",
      path: "/charge",
      headers: JSON_HEADERS,
      body: JSON.stringify({ amount: 100 }),
    });
    assert.equal(res.status, 200);
    assert.deepEqual(JSON.parse(res.body), { ok: true });
  });
});

test("GET /charge (wrong method on a known path) → 405", async () => {
  await withServer({}, async (port) => {
    const res = await request(port, { method: "GET", path: "/charge" });
    assert.equal(res.status, 405);
  });
});

test("POST /nope (unknown path) → 404", async () => {
  await withServer({}, async (port) => {
    const res = await request(port, {
      method: "POST",
      path: "/nope",
      headers: JSON_HEADERS,
      body: "{}",
    });
    assert.equal(res.status, 404);
  });
});

test("oversized body (> adapter maxBodyBytes) → 413", async () => {
  // Configure a tiny adapter cap so the additive DoS guard trips before the kernel.
  await withServer({ maxBodyBytes: 64 }, async (port) => {
    const big = "x".repeat(4096);
    const res = await request(port, {
      method: "POST",
      path: "/charge",
      headers: JSON_HEADERS,
      body: big,
    });
    assert.equal(res.status, 413);
  });
});

test("malformed JSON body → 422", async () => {
  await withServer({}, async (port) => {
    const res = await request(port, {
      method: "POST",
      path: "/charge",
      headers: JSON_HEADERS,
      body: "{ not valid json ",
    });
    assert.equal(res.status, 422);
  });
});
