# Pre-governance threat-model — the trust gap before any governance runs (2026-06-25)

Owner asked: R&D vulnerabilities **before any governance runs** (prompted by the parser-DoS finding). Untrusted
`.fungi` is **read → lexed → parsed → indexed → import-resolved** *before* `checkEffects`/`checkValueStates`/
`verifyGovernance`/fuse-admission exist — anything an attacker can do in that window bypasses the deny-by-default
model because the model hasn't started. Workflow `wf_2dc8737d-521` (11 agents, repros required, red-team verify).

> **Headline:** the file-ingestion stage had two exploitable DoS holes (now FIXED), import resolution has a path
> traversal (queued), and — the good news — the **AST-confusion / governance-evasion class is well-defended**: the
> lexer is ASCII-only for identifiers + fail-closed on unknown chars, so homoglyph / Trojan-Source / BOM evasion
> can't form a misleading AST. The scariest class is blocked; the residue is DoS + a traversal.

## Findings

| # | Stage | Threat | Sev | Status |
|---|---|---|---|---|
| 1 | Ingest | **Unbounded `readFileSync` before the post-allocation 10MB guard** — a 500MB `.fungi` commits +500MB RSS before FUNGI-LEX-004 rejects it (OOM under a tight heap); the guard checks `source.length` *after* decoding | **high** | **✅ FIXED `6cae531`** — `readUntrustedSource()` statSyncs the on-disk size first |
| 2 | Ingest | **Uncaught `ERR_STRING_TOO_LONG`** — a >512MB `.fungi` crashes `galerina check` with a raw Node error, no diagnostic (main path wasn't try/caught) | medium | **✅ FIXED `6cae531`** — read failures → FUNGI-BACKEND-001, fail-closed |
| 3 | Resolution | **Import-path traversal** — a malicious `.fungi` can `import "../../../../x.fungi"` to read + ingest an out-of-tree file *before governance* (`resolveFileImports`/`module-registry.ts:191` has no root confinement). Limited to `.fungi`-suffixed targets | medium | **TODO #38** — confine `resolve(sourceDir, relPath)` to the package/project root (mirror the deploy hardening galerina.mjs:221-224), reject a `..`-escaping path with a fail-closed FUNGI-IMPORT-* |
| 4 | Lexer | Encoding / BOM / NUL / zero-width / RTL-override / homoglyph **governance-evasion** | info | **HARDENED** — ASCII-only `isIdentStart/Continue` (lexer.ts:843-849) + fail-closed unknown-char (lexer.ts:822-830) means no Unicode identifier/homoglyph keyword can form; every probe yielded ERROR diagnostics. (BOM leading-strip added separately `41ba125` for usability, without weakening the unknown-char rule.) |

## Posture
The trust gap is **now adequately defended on the two highest-risk axes**: the AST-confusion governance-evasion
class (the one that would silently defeat *all* governance) is structurally blocked by ASCII-only identifiers +
fail-closed lexing, and the ingestion memory/crash DoS is closed. The remaining **import-path traversal (#38)** is
the one real residual — a read of an out-of-tree `.fungi` before governance — worth closing with a root-confinement
guard. Recommended systematic follow-up (low priority, defense-in-depth): a uniform max-file-size pre-check at
*every* untrusted `readFileSync` (the import-resolver read too), and the parse-depth guard already added
(`150db7e`) generalized as a shared bound across all AST walkers.

*Source: workflow `wf_2dc8737d-521` (2026-06-25). Companion: the broader threat-model
`galerina-threat-model-unleashed-2026-06-25.md`.*
