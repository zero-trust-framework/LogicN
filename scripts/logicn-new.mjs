#!/usr/bin/env node
/**
 * logicn-new — opinionated SECURE package scaffolder (DX, task #176)
 *
 * Usage:
 *   node scripts/logicn-new.mjs <target-dir> [--name <pkg>]
 *
 * Generates a minimal, strict, governed LogicN package ready for
 * `logicn build --package <target-dir>`:
 *
 *   <target-dir>/
 *     package.lln.json   name/version/kind/provides/entry/seam/capabilities
 *     src/index.lln      governed `pure flow main() -> Int` stub
 *     README.md
 *     tests/.gitkeep
 *
 * Design principles (Zero Trust):
 *   - Deny-by-default: the stub declares NO capabilities ([] in the descriptor)
 *     and is a `pure flow` with no `effects {}` — least-capability by default.
 *   - Fail-closed: any `match` the author adds must keep its mandatory `_ =>`
 *     wildcard (LLN-TYPE-023); the generated stub demonstrates this.
 *   - VERIFY BEFORE BUILD: the entry compiles as-is to dist/<name>.wasm.
 *
 * This is a STANDALONE script and deliberately does NOT touch logicn.mjs.
 */

import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join, basename, resolve } from "node:path";

// ── Argument parsing ────────────────────────────────────────────────────────
function parseArgs(argv) {
  const args = argv.slice(2);
  let targetDir = null;
  let name = null;
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--name") {
      name = args[++i];
      if (!name) fail("--name requires a value");
    } else if (a === "--help" || a === "-h") {
      printUsage();
      process.exit(0);
    } else if (a.startsWith("--")) {
      fail(`unknown flag: ${a}`);
    } else if (targetDir === null) {
      targetDir = a;
    } else {
      fail(`unexpected argument: ${a}`);
    }
  }
  if (!targetDir) {
    printUsage();
    fail("missing <target-dir>");
  }
  return { targetDir, name };
}

function printUsage() {
  console.log(`logicn-new — scaffold an opinionated SECURE LogicN package

Usage:
  node scripts/logicn-new.mjs <target-dir> [--name <pkg>]

After scaffolding:
  node logicn.mjs build --package <target-dir>
  # → <target-dir>/dist/<name>.wasm`);
}

function fail(msg) {
  console.error(`Error: ${msg}`);
  process.exit(1);
}

// ── Package-name sanitisation ───────────────────────────────────────────────
// Package names must be a safe, lowercase, kebab-case identifier so the emitted
// dist/<name>.wasm path and the manifest `name` are predictable and non-hostile.
function sanitizeName(raw) {
  const cleaned = String(raw)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-") // collapse anything unsafe to a dash
    .replace(/^[-._]+|[-._]+$/g, "") // trim leading/trailing separators
    .replace(/-{2,}/g, "-");        // collapse repeated dashes
  return cleaned;
}

// ── Templates ───────────────────────────────────────────────────────────────
function packageDescriptor(name) {
  // Deny-by-default: an empty capabilities array. Least-capability — the author
  // opts INTO each capability explicitly as the package grows.
  return JSON.stringify(
    {
      name,
      version: "0.1.0",
      kind: "pure-transform",
      provides: name,
      entry: "src/index.lln",
      seam: "compute.pure",
      capabilities: [],
    },
    null,
    2
  ) + "\n";
}

function indexLln(name) {
  return `// ${name} — opinionated SECURE LogicN package (scaffolded by logicn-new).
//
// Deny-by-default, fail-closed, least-capability:
//   - \`pure flow\` declares NO effects — it cannot touch network, storage,
//     secrets, the database, or run inference. Add an \`effects {}\` block AND
//     the matching capability in package.lln.json only when you truly need it.
//   - Every \`match\` MUST end with a mandatory \`_ =>\` wildcard (LLN-TYPE-023):
//     undeclared inputs fail closed to a safe default, never fall through.
//
// Build:  node logicn.mjs build --package <this-dir>  →  dist/${name}.wasm

pure flow main() -> Int
contract {
  intent { "Entry point for the ${name} package. Replace with the real governed logic." }
}
{
  // Demonstration of the mandatory fail-closed wildcard on a match.
  let status: Int = 0
  match status {
    0 => return 0       // OK — nominal exit
    _ => return 1       // fail-closed: any other state is treated as an error
  }
}
`;
}

function readme(name) {
  return `# ${name}

A governed LogicN package scaffolded with \`logicn new\`.

## Build

\`\`\`sh
node logicn.mjs build --package .
# → dist/${name}.wasm  (+ .wat, .lmanifest, .fuse.json)
\`\`\`

## Security posture

This package is **secure by default**:

- **Deny-by-default capabilities.** \`package.lln.json\` declares an empty
  \`"capabilities": []\` list. The entry flow is \`pure\` with no \`effects {}\`
  block, so it cannot reach the network, storage, secrets, the database, or
  inference. Grant a capability only by adding it to both the \`effects {}\`
  block of a flow and the descriptor's \`capabilities\` array.
- **Fail-closed control flow.** Every \`match\` ends with a mandatory \`_ =>\`
  wildcard (LLN-TYPE-023): an unrecognised input lands on a safe default
  instead of falling through.
- **Least capability.** Add only what the package provably needs, nothing more.

## Layout

\`\`\`
package.lln.json   descriptor: name / kind / provides / entry / seam / capabilities
src/index.lln      governed \`pure flow main() -> Int\` entry
tests/             your .lln tests
README.md          this file
\`\`\`
`;
}

// ── Scaffolding ─────────────────────────────────────────────────────────────
function writeFileStrict(path, content, what) {
  if (existsSync(path)) {
    fail(`refusing to overwrite existing ${what}: ${path}`);
  }
  writeFileSync(path, content);
  console.log(`   + ${path}`);
}

function main() {
  const { targetDir, name: nameFlag } = parseArgs(process.argv);
  const absTarget = resolve(targetDir);

  // Derive the package name from --name, else from the target directory name.
  const rawName = nameFlag ?? basename(absTarget);
  const name = sanitizeName(rawName);
  if (!name) {
    fail(`could not derive a valid package name from "${rawName}" (use --name)`);
  }

  // Create directory tree. mkdir recursive is idempotent for the dirs, but we
  // refuse to clobber any of the FILES we generate (fail-closed).
  mkdirSync(absTarget, { recursive: true });
  mkdirSync(join(absTarget, "src"), { recursive: true });
  mkdirSync(join(absTarget, "tests"), { recursive: true });

  console.log(`logicn-new — scaffolding secure package "${name}" into ${absTarget}`);
  writeFileStrict(join(absTarget, "package.lln.json"), packageDescriptor(name), "package.lln.json");
  writeFileStrict(join(absTarget, "src", "index.lln"), indexLln(name), "src/index.lln");
  writeFileStrict(join(absTarget, "README.md"), readme(name), "README.md");
  writeFileStrict(join(absTarget, "tests", ".gitkeep"), "", "tests/.gitkeep");

  console.log(`
✅ Scaffolded "${name}".

Next:
  node logicn.mjs build --package ${targetDir}
  # → ${join(targetDir, "dist", name + ".wasm")}`);
}

main();
