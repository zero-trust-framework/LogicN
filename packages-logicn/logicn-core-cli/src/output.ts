import { redactCliOutput } from "./security.js";
import type { CliResult } from "./types.js";

export function formatCliResult(result: CliResult): string {
  const lines = [result.message, ...(result.details ?? [])];
  return redactCliOutput(lines.join("\n"));
}
