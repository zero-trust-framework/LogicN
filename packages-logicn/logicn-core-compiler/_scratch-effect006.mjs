// scratch: list LLN-EFFECT-006 over-declarations per example (read-only; delete after).
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { parseProgram, checkEffects } from "./dist/index.js";

const ROOT = "../../docs/examples";
function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    const s = statSync(p);
    if (s.isDirectory()) out.push(...walk(p));
    else if (e === "example.lln") out.push(p);
  }
  return out;
}
const files = walk(ROOT).sort();
let n = 0;
for (const f of files) {
  let parsed;
  try { parsed = parseProgram(readFileSync(f, "utf8"), f); } catch { continue; }
  let effects;
  try { effects = checkEffects(parsed.flows, parsed.ast); } catch { continue; }
  const over = effects.flatMap((r) => r.diagnostics).filter((d) => d.code === "LLN-EFFECT-006");
  if (over.length) {
    n++;
    const items = over.map((d) => {
      const m = d.message.match(/flow "([^"]+)" declares effect "([^"]+)"/);
      return m ? `${m[1]}:${m[2]}` : d.message;
    });
    console.log(`${f.replace(ROOT + "/", "").replace("/example.lln", "")}  ::  ${items.join("  ")}`);
  }
}
console.log(`\nTOTAL files with EFFECT-006: ${n}`);
