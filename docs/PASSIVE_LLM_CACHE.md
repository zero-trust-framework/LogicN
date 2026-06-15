# Passive LLM Cache

## Purpose

LogicN may support a built-in passive generic cache for LLM and embedding calls.

Passive means:

```text
The developer calls the LLM normally.
LogicN decides whether the request is safe and useful to cache.
LogicN generates the cache key.
LogicN stores or reuses the result.
LogicN records the cache decision in reports.
```

Developers should not need to hand-write:

```text
check cache
if exists return cached
else call LLM
save result
return result
```

The cache is automatic only when it is safe, typed, source-tracked,
privacy-checked and reportable.

## Use Cases

Passive LLM caching can help with:

| Cache type | Example |
| --- | --- |
| Prompt/response cache | Same task, same context, same model settings |
| Embedding cache | Same text converted to a vector more than once |
| RAG/chunk cache | Same document chunks reused across AI tasks |
| Schema output cache | Same input converted to the same typed JSON result |
| Code-analysis cache | Same source file analysed repeatedly |
| Local model cache | Local LLM outputs reused without recomputing |
| Provider cache | OpenAI-compatible, local and other providers behind one LogicN interface |

## Developer Experience

Developer code stays simple:

```logicn
let result = LLM.ask<SupportReply>({
  model: "best:support",
  system: "You are a support assistant.",
  input: customerQuestion,
  output: SupportReply
})
```

LogicN treats the call as:

```text
1. Check whether the LLM call is cacheable.
2. Redact secrets if required.
3. Generate a strict cache key.
4. Check the selected cache store.
5. Return a valid cached result when allowed.
6. Otherwise call the LLM provider.
7. Validate the typed output schema.
8. Store the safe result when policy allows it.
9. Record the cache event in a report.
```

The developer gets simple code. LogicN gets traceability.

## Policy Example

Example cache policy:

```logicn
llm_cache PassiveLLMCache {
  mode passive
  default enabled

  store local "./.logicn/cache/llm"
  scope project

  ttl {
    default 7 days
    embeddings 30 days
    code_analysis 14 days
    user_chat 0 seconds
  }

  privacy {
    redact_secrets true
    redact_tokens true
    redact_authorization_headers true
    redact_payment_data true

    cache_personal_data false
    cache_raw_user_messages false
  }

  key {
    include provider
    include model
    include model_version
    include system_prompt_hash
    include input_hash
    include output_schema_hash
    include tool_manifest_hash
    include temperature
    include top_p
    include seed
    include context_hash
    include logicn_version
    include security_policy_hash
  }

  safety {
    require_schema_validation true
    reject_if_secret_detected true
    reject_if_untrusted_context true
    isolate_by_project true
    isolate_by_tenant true
  }

  reports {
    write_cache_report true
    write_ai_cache_manifest true
    include_hit_miss_stats true
  }
}
```

## Explicit Overrides

Sensitive calls can disable caching:

```logicn
let reply = LLM.ask<ChatReply>({
  model: "best:support",
  input: liveCustomerMessage,
  output: ChatReply
}) cache off
```

Repeatable safe tasks can request a stricter cache policy:

```logicn
let summary = LLM.ask<InvoiceSummary>({
  model: "best:extraction",
  task: "summarise_invoice",
  input: redactedInvoiceText,
  output: InvoiceSummary
}) cache {
  mode passive
  ttl 24 hours
  store encrypted
  reason "Repeated invoice extraction during import"
}
```

Overrides must still pass safety checks. `cache always` must not mean "cache
secrets anyway".

## Strict Cache Keys

LLM cache keys must be stricter than `hash(prompt)`.

The key should include:

```text
provider
model
model version
system prompt hash
input hash
context hash
output schema hash
tool manifest hash
temperature
top_p
seed where available
LogicN version
security policy hash
package lock hash where relevant
source hash where relevant
```

Example key material:

```json
{
  "provider": "local",
  "model": "llama3.1",
  "modelVersion": "8b-q4",
  "systemPromptHash": "abc123",
  "inputHash": "def456",
  "contextHash": "ghi789",
  "outputSchemaHash": "schema001",
  "toolManifestHash": "tools002",
  "temperature": 0,
  "topP": 1,
  "seed": 42,
  "logicnVersion": "0.1.0"
}
```

This prevents reuse across different models, tools, schemas, prompts, policies
or security contexts.

## Typed Output Rule

LogicN should not cache unvalidated free text by default.

Preferred:

```logicn
type ProductTags = {
  category: String
  tags: List<String>
  confidence: Confidence
}

let result = LLM.ask<ProductTags>({
  input: productDescription,
  output: ProductTags
})
```

Before caching, LogicN must validate:

```text
schema shape
required fields
confidence fields
unsafe content checks
secret leakage checks
data classification policy
```

## Embedding Cache

Embeddings are a strong use case for exact passive caching.

```logicn
let vector = LLM.embed(documentText)
```

Embedding cache keys should include:

```text
text hash
embedding model
embedding model version
normalisation settings
chunking settings
provider
tenant/project isolation key
```

Example policy:

```logicn
embedding_cache {
  enabled true
  ttl 90 days
  store vector
  key include [text_hash, model, model_version, chunk_policy]
}
```

## Code-Analysis And AI Context Cache

LogicN can cache AI-oriented project context:

```text
file summaries
package summaries
security summaries
public API summaries
dependency maps
generated AI context
```

Example:

```logicn
ai_context_cache {
  enabled true
  store "./.logicn/cache/ai-context"

  invalidate_when {
    source_file_changed
    package_manifest_changed
    security_policy_changed
    compiler_version_changed
  }
}
```

Generated AI context must not contain secret values or raw private data.

## Provider Interface

LogicN should keep LLM calls provider-neutral.

Example:

```logicn
llm_provider LocalLlama {
  type local
  endpoint "http://localhost:11434"
  models ["llama3.1", "codellama"]
}

llm_provider OpenAICompatible {
  type openai_compatible
  endpoint env "LLM_API_URL"
  key env "LLM_API_KEY"
}
```

Application code can stay generic:

```logicn
let result = LLM.ask<CodeReview>({
  model: "best:code",
  input: sourceFile,
  output: CodeReview
})
```

Provider, model and model-version facts remain part of the cache key.

## Cache Stores

LogicN may support multiple stores:

```logicn
llm_cache {
  store memory
}
```

```logicn
llm_cache {
  store local "./.logicn/cache/llm"
}
```

```logicn
llm_cache {
  store redis env "REDIS_URL"
}
```

```logicn
llm_cache {
  store database "llm_cache"
}
```

```logicn
llm_cache {
  store encrypted "./secure-cache"
}
```

Production stores require:

```text
tenant isolation
encryption at rest
TTL
redaction
purge support
audit logging
permission checks
```

## Default Denies

LogicN should refuse passive caching for:

```text
passwords
API keys
access tokens
payment card data
authentication headers
raw customer chat messages
medical data
legal case data
private documents
unredacted personal data
webhook secrets
one-time codes
session cookies
```

Example diagnostic:

```json
{
  "code": "LOGICN-LLM-CACHE-003",
  "severity": "blocked",
  "message": "LLM cache refused because input may contain secrets or personal data.",
  "file": "support-chat.ln",
  "line": 28,
  "suggestion": "Use cache off, redact input, or use encrypted tenant-isolated cache."
}
```

## Cache Modes

Recommended modes:

| Mode | Meaning |
| --- | --- |
| `off` | Never cache |
| `passive` | LogicN decides using policy |
| `always` | Cache only if security checks pass |
| `readonly` | Use cache but do not write new entries |
| `refresh` | Call model again and update cache |
| `strict` | Exact match only |
| `semantic` | Use similar previous result only when explicitly allowed |

For secure apps, the default should be:

```text
mode passive
semantic false
```

## Exact Versus Semantic Cache

Exact cache:

```text
same input + same model + same schema + same policy = reuse result
```

Good for:

```text
embeddings
document summaries
code analysis
data extraction
classification
```

Semantic cache:

```text
similar input = maybe reuse result
```

Semantic cache is riskier and requires explicit permission.

Example policy:

```logicn
semantic_cache {
  enabled true
  threshold 0.94
  allowed_tasks ["faq_answer", "documentation_help"]
  denied_tasks ["payment", "auth", "legal", "medical", "security"]
}
```

Semantic cache must be denied by default for:

```text
payments
legal decisions
medical advice
security decisions
webhooks
financial calculations
access control
```

## Invalidation

LogicN should invalidate passive LLM cache entries when important inputs change:

```text
model changed
model version changed
system prompt changed
output schema changed
tools changed
RAG context changed
security policy changed
LogicN compiler version changed
package version changed
source file changed
tenant/project isolation key changed
```

Cache invalidation must be reportable.

## Report Shape

Example report:

```json
{
  "llmCache": {
    "enabled": true,
    "store": "local",
    "entries": 142,
    "hits": 87,
    "misses": 55,
    "blocked": 9,
    "blockedReasons": [
      "secret_detected",
      "personal_data_detected",
      "schema_validation_failed"
    ],
    "models": [
      "local:llama3.1",
      "openai-compatible:gpt-4.1-mini"
    ],
    "semanticCacheEnabled": false,
    "secretValuesStored": false
  }
}
```

Reports must never include prompt text, raw user text, secret values or
credentials unless an explicit secure evidence policy allows a redacted form.

## Relationship To Agents

Agent LLM cache uses the same passive cache rules, with additional agent
isolation:

```text
agent name
agent role
tool manifest hash
visibility scope hash
approval policy hash
tenant/project isolation key
```

This aligns with `MULTI_AGENT_RUNTIME.md`: agents must not cache
secret-containing prompts or uncontrolled memory.

## Best Design Rule

```text
LLM caching is automatic only when it is safe, typed, source-tracked,
privacy-checked and reportable.
```
