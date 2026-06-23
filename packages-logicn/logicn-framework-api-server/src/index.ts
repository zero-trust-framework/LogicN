/**
 * LogicN HTTP API-server adapter.
 *
 * A DELIBERATELY THIN node:http transport in front of the App Kernel. Its only
 * job is to turn a raw HTTP request into a normalised `LogicnKernelRequest`,
 * hand it to `kernel.handle()`, and write the kernel's typed response back onto
 * the socket. It is NOT a place for policy, middleware, auth, or routing — all
 * of that lives in the kernel's fixed, non-bypassable pipeline and MUST NOT be
 * pre-empted, re-ordered, or skipped here.
 *
 * The single exception is an ADDITIVE denial-of-service guard: a hard cap on how
 * many body bytes the adapter will buffer into memory before it even calls the
 * kernel. This protects the process from an attacker streaming an unbounded
 * body. It is purely additive — the kernel ALSO enforces its own (per-route,
 * posture-aware) body-size policy, and that check is never removed or relaxed by
 * this adapter. When the adapter cap trips we respond 413 and destroy the socket
 * WITHOUT buffering any further bytes.
 */
import http from "node:http";
import { randomUUID } from "node:crypto";
import type { AppKernel, LogicnKernelRequest, LogicnKernelResponse } from "../../logicn-framework-app-kernel/dist/index.js";
import type { HttpMethod } from "../../logicn-framework-app-kernel/dist/index.js";

/** Default hard cap on buffered body bytes (8 MiB). Additive to the kernel's own body-size gate. */
export const DEFAULT_MAX_BODY_BYTES = 8 * 1024 * 1024;
/** Default explicit transport timeouts (slowloris / idle-connection defence). Set so the guard is
 *  intentional, not dependent on the Node version's defaults. */
export const DEFAULT_REQUEST_TIMEOUT_MS = 30_000;
export const DEFAULT_HEADERS_TIMEOUT_MS = 10_000;
export const DEFAULT_IDLE_TIMEOUT_MS = 30_000;

export interface CreateApiServerOptions {
  readonly kernel: AppKernel;
  /** Hard cap on buffered body bytes before 413 + socket destroy. Default 8 MiB. */
  readonly maxBodyBytes?: number;
  /** Max ms for the whole request (slowloris body defence). Default 30s. */
  readonly requestTimeoutMs?: number;
  /** Max ms to receive the request headers. Default 10s. */
  readonly headersTimeoutMs?: number;
  /** Idle-socket timeout. Default 30s. */
  readonly idleTimeoutMs?: number;
}

/** A fail-closed 500 written when the kernel itself throws. Never leaks the error. */
const INTERNAL_ERROR_BODY = Buffer.from(
  JSON.stringify({ error: "internal_error" }),
  "utf8",
);

/** A 413 written by the adapter's own body cap (distinct from the kernel's 413). */
const PAYLOAD_TOO_LARGE_BODY = Buffer.from(
  JSON.stringify({ error: "payload_too_large" }),
  "utf8",
);

/** Buffer the request body up to `maxBodyBytes`. Resolves with the bytes, or
 *  rejects with a sentinel once the cap is exceeded (caller writes 413). */
class BodyCapExceeded extends Error {}

function bufferBody(
  req: http.IncomingMessage,
  maxBodyBytes: number,
): Promise<Uint8Array> {
  return new Promise<Uint8Array>((resolve, reject) => {
    const chunks: Buffer[] = [];
    let total = 0;
    let settled = false;

    const onData = (chunk: Buffer): void => {
      if (settled) return;
      total += chunk.length;
      if (total > maxBodyBytes) {
        // Stop buffering immediately — do NOT push this chunk or any further bytes.
        settled = true;
        cleanup();
        reject(new BodyCapExceeded());
        return;
      }
      chunks.push(chunk);
    };
    const onEnd = (): void => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(new Uint8Array(Buffer.concat(chunks, total)));
    };
    const onError = (err: Error): void => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(err);
    };
    const cleanup = (): void => {
      req.removeListener("data", onData);
      req.removeListener("end", onEnd);
      req.removeListener("error", onError);
    };

    req.on("data", onData);
    req.on("end", onEnd);
    req.on("error", onError);
  });
}

/** Lowercase every header name into a plain Record<string,string>. Array-valued
 *  headers (e.g. set-cookie on a request, repeated headers) are joined with ", ". */
function lowercaseHeaders(
  raw: http.IncomingHttpHeaders,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [name, value] of Object.entries(raw)) {
    if (value === undefined) continue;
    const key = name.toLowerCase();
    out[key] = Array.isArray(value) ? value.join(", ") : value;
  }
  return out;
}

/** Parse `req.url` into a kernel path + flat query Record. */
function parseUrl(rawUrl: string | undefined): {
  path: string;
  query: Record<string, string>;
} {
  const url = new URL(rawUrl ?? "/", "http://x");
  const query: Record<string, string> = {};
  for (const [k, v] of url.searchParams.entries()) {
    // Last value wins for repeated keys — a flat Record cannot represent arrays.
    query[k] = v;
  }
  return { path: url.pathname, query };
}

function normaliseMethod(raw: string | undefined): HttpMethod {
  // Uppercase the verb. The kernel route-matches on method, so an unknown verb
  // simply fails to match (→ 404/405); we never need to reject it here.
  const upper = (raw ?? "GET").toUpperCase();
  return upper as HttpMethod;
}

function writeResponse(
  res: http.ServerResponse,
  resp: LogicnKernelResponse,
): void {
  if (res.headersSent || res.writableEnded) return;
  res.writeHead(resp.status, { ...resp.headers });
  if (resp.body && resp.body.length > 0) {
    res.end(Buffer.from(resp.body));
  } else {
    res.end();
  }
}

/**
 * Create an HTTP server that funnels every request through the App Kernel.
 * The returned server is NOT yet listening — call `listen(server, port)`.
 */
export function createApiServer(opts: CreateApiServerOptions): http.Server {
  const { kernel } = opts;
  const maxBodyBytes =
    opts.maxBodyBytes !== undefined ? opts.maxBodyBytes : DEFAULT_MAX_BODY_BYTES;

  const server = http.createServer((req, res) => {
    void handleRequest(kernel, maxBodyBytes, req, res);
  });
  // Explicit transport timeouts — a slowloris / idle-connection defence at the toxic border, additive
  // to the body cap (the kernel cannot see transport-level stalls). Set intentionally rather than
  // inheriting the Node version's defaults (#211 inbound-listener hardening).
  server.requestTimeout = opts.requestTimeoutMs !== undefined ? opts.requestTimeoutMs : DEFAULT_REQUEST_TIMEOUT_MS;
  server.headersTimeout = opts.headersTimeoutMs !== undefined ? opts.headersTimeoutMs : DEFAULT_HEADERS_TIMEOUT_MS;
  server.timeout = opts.idleTimeoutMs !== undefined ? opts.idleTimeoutMs : DEFAULT_IDLE_TIMEOUT_MS;
  return server;
}

async function handleRequest(
  kernel: AppKernel,
  maxBodyBytes: number,
  req: http.IncomingMessage,
  res: http.ServerResponse,
): Promise<void> {
  // (1) Buffer the body under the hard adapter cap (additive DoS guard).
  let body: Uint8Array;
  try {
    body = await bufferBody(req, maxBodyBytes);
  } catch (err) {
    if (err instanceof BodyCapExceeded) {
      // 413 + destroy the socket WITHOUT buffering further bytes. Never reaches the kernel.
      if (!res.headersSent && !res.writableEnded) {
        res.writeHead(413, {
          "content-type": "application/json",
          connection: "close",
        });
        res.end(PAYLOAD_TOO_LARGE_BODY);
      }
      req.destroy();
      req.socket?.destroy();
      return;
    }
    // Transport error reading the body — fail closed, no leak.
    if (!res.headersSent && !res.writableEnded) {
      res.writeHead(500, { "content-type": "application/json" });
      res.end(INTERNAL_ERROR_BODY);
    }
    return;
  }

  // (2) Normalise into a LogicnKernelRequest.
  const { path, query } = parseUrl(req.url);
  const kreq: LogicnKernelRequest = {
    method: normaliseMethod(req.method),
    path,
    headers: lowercaseHeaders(req.headers),
    body,
    query,
    requestId: randomUUID(),
    receivedAt: Date.now(),
  };

  // (3) Hand to the kernel's fixed, non-bypassable pipeline. (4) Write its response.
  let resp: LogicnKernelResponse;
  try {
    resp = await kernel.handle(kreq);
  } catch {
    // Fail CLOSED — never leak the underlying error to the client.
    if (!res.headersSent && !res.writableEnded) {
      res.writeHead(500, { "content-type": "application/json" });
      res.end(INTERNAL_ERROR_BODY);
    }
    return;
  }

  writeResponse(res, resp);
}

/** Start listening on `port` (0 = ephemeral). Resolves with the bound address. */
export function listen(
  server: http.Server,
  port: number,
): Promise<{ address: string; port: number }> {
  return new Promise((resolve, reject) => {
    const onError = (err: Error): void => {
      server.removeListener("error", onError);
      reject(err);
    };
    server.once("error", onError);
    server.listen(port, () => {
      server.removeListener("error", onError);
      const addr = server.address();
      if (addr && typeof addr === "object") {
        resolve({ address: addr.address, port: addr.port });
      } else {
        resolve({ address: "127.0.0.1", port });
      }
    });
  });
}
