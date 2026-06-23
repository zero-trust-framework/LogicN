// host/server.ts — the example app's host: it FUSES the governed greeting component,
// wires ONE route through the App Kernel's fixed pipeline, and serves it over HTTP.
// This is the only place the app's compiled .wasm meets the kernel.
//
// The pipeline of trust (scaffold -> fuse -> kernel -> serve):
//   1. `logicn build --package packages/greeting` produced a signed greeting.wasm +
//      greeting.lmanifest.json — deny-by-default, capabilities [].
//   2. fusePackage admits it FAIL-CLOSED: sha256 pin -> Ed25519 signature -> (optional)
//      revocation, then instantiates it with a CLOSED, capability-bounded import object.
//      A tampered, or unsigned-without-allowance, binary is refused — never run.
//   3. createAppKernel runs the fixed, non-bypassable gate pipeline. The /hello handler
//      is reached ONLY after the route, body-size, content-type, auth, decode,
//      idempotency and concurrency gates pass; it then invokes the fused component's
//      main() (the governed compute) for the HTTP status.
//   4. createApiServer is a thin transport that funnels every request through the
//      kernel — no policy, auth, or routing lives here.

import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import {
  createAppKernel,
  fusePackage,
  type AppKernel,
  type FusedComponent,
  type RouteDeclaration,
  type HandlerDispatch,
} from "../../logicn-framework-app-kernel/dist/index.js";
import { createApiServer, listen } from "../../logicn-framework-api-server/dist/index.js";
import { loadConfig, type AppConfig } from "./config.js";

// At runtime this module is dist/server.js, one level under the app root. Resolve the
// app's own files relative to that, and the repo governance dir (public signing keys)
// two levels above the app (… /packages-logicn/<app> -> repo root -> governance).
const HERE = dirname(fileURLToPath(import.meta.url));
const APP_ROOT = join(HERE, "..");

/** Stable, resolved paths the host (and its tests) operate on. */
export const paths = {
  appRoot: APP_ROOT,
  configPath: join(APP_ROOT, "config", "app.config.json"),
  manifestPath: join(APP_ROOT, "App.manifest"),
  greetingDir: join(APP_ROOT, "packages", "greeting"),
  governanceDir: join(APP_ROOT, "..", "..", "governance"),
} as const;

/** Options controlling how the governed greeting component is admitted. */
export interface FuseOptions {
  /** Directory of `signing-key-<id>.pub.pem` public keys. Defaults to the repo governance dir. */
  readonly governanceDir?: string;
  /**
   * Admit an unsigned manifest (DEV only). Default false (fail-closed). The in-repo build is
   * signed by a known key, so this stays off; a copy built outside the repo (no public key
   * present) may set it to boot in development.
   */
  readonly allowUnsigned?: boolean;
}

/**
 * Fuse the governed greeting package, fail-closed. Returns the admitted component whose
 * `invoke("main")` runs the signed .wasm. Throws (LLN-FUSE-*) on tamper / bad signature /
 * unknown capability.
 */
export function fuseGreeting(opts: FuseOptions = {}): Promise<FusedComponent> {
  const governanceDir = opts.governanceDir ?? paths.governanceDir;
  return fusePackage(paths.greetingDir, {
    governanceDir,
    ...(opts.allowUnsigned === true ? { allowUnsigned: true } : {}),
  });
}

/**
 * Build the App Kernel over a single route → the fused greeting compute. The route is
 * declared `public`: an EXPLICIT, audited relaxation of the secure default (auth required)
 * appropriate for a hello-world endpoint — the kernel records it as relaxation "auth:public".
 */
export function createGreetingKernel(config: AppConfig, greeting: FusedComponent): AppKernel {
  const route: RouteDeclaration = {
    method: "GET",
    path: config.greeting.route,
    handler: "greeting",
    auth: { mode: "public" },
  };
  const dispatch: HandlerDispatch = {
    greeting: () => {
      // The fused component's i32 result IS the HTTP status: 200 on success; the
      // governed flow's fail-closed wildcard would return 500.
      const status = greeting.invoke("main");
      return { status, body: { message: config.greeting.message, status } };
    },
  };
  return createAppKernel({
    routes: [route],
    dispatch,
    posture: config.posture,
    env: config.env,
  });
}

/** A running HTTP server bound to an ephemeral or configured port. */
export interface StartedServer {
  readonly server: ReturnType<typeof createApiServer>;
  readonly port: number;
  /** Stop accepting connections and resolve once the server has closed. */
  close(): Promise<void>;
}

/**
 * Start the example app end-to-end: load config (unless provided), fuse the greeting,
 * build the kernel, and serve it over HTTP. Pass `port: 0` via config for an ephemeral
 * test port. The caller owns the returned server and must `close()` it.
 */
export async function startServer(config?: AppConfig, fuseOpts: FuseOptions = {}): Promise<StartedServer> {
  const cfg = config ?? loadConfig(paths.configPath);
  const greeting = await fuseGreeting(fuseOpts);
  const kernel = createGreetingKernel(cfg, greeting);
  const server = createApiServer({ kernel });
  const { port } = await listen(server, cfg.http.port);
  return {
    server,
    port,
    close: () => new Promise<void>((resolve) => server.close(() => resolve())),
  };
}

export { loadConfig, parseConfig } from "./config.js";
export type { AppConfig, AppEnv, AppPosture } from "./config.js";
