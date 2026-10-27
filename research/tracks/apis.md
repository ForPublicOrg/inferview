# Track research: Building with model APIs (`apis`)

Modules: `api-anatomy`, `prompting`, `structured-outputs`, `context-engineering`, `frameworks`.

Checked on 2026-10-28 unless a row says otherwise. Every row gives the URL that was fetched. "Search only" means the fact came from a search result summary and the page itself was not opened; treat those as leads, not citations. Model names, prices and limits in this track change every few months, so every lesson and problem that quotes one must carry its own `updated` date and source entry.

Inputs read first: `research/brief.json` (curriculum entry 2, `interview_question_taxonomy`, `all_sources`) and `research/raw-research.json`. The brief's JD figures (prompt engineering 29.1%, LLM integration 25.4%, RAG 35.9%, LangChain 18.8%, LangGraph 8.0%, LlamaIndex 5.8%) were re-checked against their source (row in 1.2) and match.

## 1. Verified facts by module

### 1.1 api-anatomy (messages, streaming, errors, rate limits, retries, batches)

| Fact | Value | Source | Checked |
|---|---|---|---|
| Current Claude lineup and API IDs | `claude-fable-5-1`, `claude-opus-5-5`, `claude-sonnet-5-5`, `claude-haiku-5-5`; all 1M-token context and 128K max output on the synchronous Messages API | https://platform.claude.com/docs/en/about-claude/models/overview | 2026-10-28 |
| Claude list prices per MTok (input / output) | Fable 5.1 $10 / $50; Opus 5.5 $4 / $20; Sonnet 5.5 $2 / $10; Haiku 5.5 $0.10 / $0.50 for prompts up to 100,000 tokens and $0.50 / $2.50 above | https://platform.claude.com/docs/en/about-claude/pricing | 2026-10-28 |
| Claude long-context pricing | Claude 4.6 and later (except Haiku 5.5) bill the full 1M window at standard rates; the page states a 900k-token request is billed at the same per-token rate as a 9k-token request | https://platform.claude.com/docs/en/about-claude/pricing | 2026-10-28 |
| Claude Batch API | 50% of standard prices; up to 100,000 requests or 256 MB per batch; most finish within 1 hour; requests not processed within 24 hours expire and are not billed; results downloadable for 29 days; results can return in any order, so match on `custom_id` (1 to 64 chars, `^[a-zA-Z0-9_-]{1,64}$`) | https://platform.claude.com/docs/en/build-with-claude/batch-processing | 2026-10-28 |
| Batch plus caching | Discounts stack; cache hits inside batches are best effort, and the page reports typical hit rates of 30% to 98% | https://platform.claude.com/docs/en/build-with-claude/batch-processing | 2026-10-28 |
| Claude rate limit algorithm | Token bucket, continuously replenished rather than reset at fixed intervals; limits are RPM, ITPM and OTPM per model class; a 60 RPM limit may be enforced as 1 request per second | https://platform.claude.com/docs/en/api/rate-limits | 2026-10-28 |
| Claude Start tier limits (Opus 5.5) | 1,000 RPM, 2,000,000 ITPM, 400,000 OTPM | https://platform.claude.com/docs/en/api/rate-limits | 2026-10-28 |
| Cache-aware ITPM | For most Claude models only `input_tokens` plus `cache_creation_input_tokens` count toward ITPM; `cache_read_input_tokens` do not (Haiku 3.5 is the listed exception). Page example: a 2,000,000 ITPM limit with an 80% hit rate allows 10,000,000 total input tokens per minute | https://platform.claude.com/docs/en/api/rate-limits | 2026-10-28 |
| OTPM and `max_tokens` (Claude) | OTPM counts tokens actually generated; `max_tokens` does not factor into OTPM | https://platform.claude.com/docs/en/api/rate-limits | 2026-10-28 |
| TPM and `max_tokens` (OpenAI) | OpenAI counts the larger of `max_tokens` and the estimated token count toward the limit; failed requests also count against per-minute limits | https://developers.openai.com/api/docs/guides/rate-limits | 2026-10-28 |
| Spend-cap 429 (Claude) | Same `rate_limit_error` type as a rate limit, but no `retry-after` header and `error.details.error_code` is `enforced_spend_limit_reached`; retries, including SDK retries, keep failing until access resumes | https://platform.claude.com/docs/en/api/rate-limits | 2026-10-28 |
| Claude error codes | 400 invalid_request_error, 401 authentication_error, 402 billing_error, 403 permission_error, 404 not_found_error, 409 conflict_error, 413 request_too_large, 429 rate_limit_error, 500 api_error, 504 timeout_error, 529 overloaded_error | https://platform.claude.com/docs/en/api/errors | 2026-10-28 |
| Claude request size limits | Messages 32 MB, Token Counting 32 MB, Batch 256 MB, Files 500 MB | https://platform.claude.com/docs/en/api/errors | 2026-10-28 |
| Rate limit headers | Claude: `retry-after` and `anthropic-ratelimit-{requests,tokens,input-tokens,output-tokens}-{limit,remaining,reset}` (reset in RFC 3339). OpenAI: `x-ratelimit-{limit,remaining,reset}-{requests,tokens}` and `Retry-After` | https://platform.claude.com/docs/en/api/rate-limits ; https://developers.openai.com/api/docs/guides/rate-limits | 2026-10-28 |
| OpenAI retry guidance | Exponential backoff with random jitter; treat `Retry-After` as a minimum; cap attempts and total retry time; do not retry quota or billing errors | https://developers.openai.com/api/docs/guides/rate-limits | 2026-10-28 |
| Anthropic Python SDK defaults | Retries 2 times by default with short exponential backoff on connection errors, 408, 409, 429 and >=500; default timeout 10 minutes, and timeouts are retried; raises `ValueError` if a non-streaming request is expected to take longer than about 10 minutes unless you stream or override `timeout` | https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/python (redirect target of /docs/en/api/sdks/python) | 2026-10-28 |
| OpenAI Python SDK defaults | Retries 2 times by default (connection errors, 408, 409, 429, >=500) with short exponential backoff; default timeout 10 minutes; README calls the Responses API the primary interface | https://github.com/openai/openai-python | 2026-10-28 |
| Vercel AI SDK `generateText` | `maxRetries` default 2; `stopWhen` default `isStepCount(1)`; `timeout` accepts `totalMs`, `stepMs`, `toolMs` and per-tool overrides | https://ai-sdk.dev/docs/reference/ai-sdk-core/generate-text | 2026-10-28 |
| Claude SSE event order | `message_start`; per content block `content_block_start`, one or more `content_block_delta`, `content_block_stop`; one or more `message_delta`; `message_stop`. `ping` events can appear anywhere; usage counts in `message_delta` are cumulative | https://platform.claude.com/docs/en/build-with-claude/streaming | 2026-10-28 |
| Tool input streaming (Claude) | `input_json_delta` carries partial JSON strings while the final `tool_use.input` is an object; accumulate and parse at `content_block_stop` or use a partial parser; per-tool `eager_input_streaming` enables fine-grained streaming | https://platform.claude.com/docs/en/build-with-claude/streaming | 2026-10-28 |
| Mid-stream errors | An `overloaded_error` can arrive inside a stream after HTTP 200 (it would be a 529 outside streaming) | https://platform.claude.com/docs/en/build-with-claude/streaming ; https://platform.claude.com/docs/en/api/errors | 2026-10-28 |
| Resuming an interrupted stream | Claude 4.5 and earlier: resend the partial text as the start of an assistant message. Claude 4.6 and later: add a user message asking the model to continue, because prefill is not supported | https://platform.claude.com/docs/en/build-with-claude/streaming | 2026-10-28 |
| OpenAI streaming of tool arguments | `response.output_item.added`, then `response.function_call_arguments.delta` events, then `response.function_call_arguments.done`; aggregate deltas by `output_index` | https://developers.openai.com/api/docs/guides/function-calling | 2026-10-28 |
| Claude API version 2026-10-21 | New `anthropic-version` value; `temperature`, `top_p` and `top_k` return 400 even at default values; `document` blocks in assistant messages and `citations` on user text blocks return 400; SDK 2.x sends the key as `Authorization: Bearer` instead of `X-Api-Key` | https://platform.claude.com/docs/en/api/migration-2026-10-21 | 2026-10-28 |
| OpenAI text prices (per 1M tokens, Standard, short context) | Examples: gpt-5.6-sol $4.00 input / $0.40 cached / $20.00 output; gpt-6.1-sol $2.00 / $0.10 / $10.00; gpt-5-mini $0.25 / $0.025 / $2.00. Batch and Flex listed at about 50% of Standard; "Priority processing was renamed Fast mode on July 30, 2026" | https://developers.openai.com/api/docs/pricing | 2026-10-28 |
| OpenAI reasoning tokens | Billed as output tokens and reported in `output_tokens_details.reasoning_tokens`; OpenAI recommends reserving at least 25,000 tokens for reasoning and output when starting out; a cut-off response has `status: incomplete` with reason `max_output_tokens`, possibly with no visible output | https://developers.openai.com/api/docs/guides/reasoning | 2026-10-28 |
| Claude thinking | Extended thinking (`budget_tokens`, minimum 1,024, below `max_tokens`) is deprecated on the 4.6 models and rejected with 400 on Claude 4.7 and later; use `thinking: {type: "adaptive"}` with `output_config.effort`. Opus 5.5 default effort is `medium`; thinking is always on for Opus 5.5 and Fable 5.1 | https://platform.claude.com/docs/en/build-with-claude/extended-thinking ; https://platform.claude.com/docs/en/api/errors ; https://platform.claude.com/docs/en/about-claude/models/overview | 2026-10-28 |
| Thinking blocks with tools | Pass back every `thinking` and `redacted_thinking` block unmodified; edited, reordered or filtered blocks return 400 | https://platform.claude.com/docs/en/api/errors | 2026-10-28 |
| Tool use overhead (Claude) | A tool-use system prompt is added whenever a tool is present: Opus 5.5 286 tokens (auto/none); Sonnet 4.6 497 (auto/none) and 589 (any/tool) | https://platform.claude.com/docs/en/about-claude/pricing | 2026-10-28 |
| Retries amplify load | A five-deep stack with three retries per layer raises load on a failing database 243 times; retry at one point in the stack; limit retries with a local token bucket; calls with side effects are not safe to retry unless idempotent | https://builder.aws.com/content/3EumjoZascWd1oZiEgL8ORlv3qE/timeouts-retries-and-backoff-with-jitter (Marc Brooker, Dec 5, 2019) | 2026-10-28 |
| Jitter strategies | Full, Equal and Decorrelated Jitter; Equal Jitter judged weakest; every jittered variant cuts work compared with plain exponential backoff. The formulas are images on the page and could not be extracted as text; a lesson must copy them from the page, not from this file | https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/ (Marc Brooker, Mar 4, 2015, updated May 2023) | 2026-10-28 |

Could not source: a published time-to-first-token figure from Anthropic or OpenAI. No provider page fetched gives one. Lessons should measure TTFT in a demo or present a toy number labelled as such.

### 1.2 prompting

| Fact | Value | Source | Checked |
|---|---|---|---|
| XML tags | Anthropic recommends wrapping instructions, context, examples and inputs in their own tags, for example `<instructions>`, `<context>`, `<input>` | https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices | 2026-10-28 |
| Few-shot count | Anthropic guidance: "Include 3–5 examples for best results" (vendor guidance, not a general law; the quote's dash is Anthropic's) | same | 2026-10-28 |
| Long documents first | Put long documents above the query; the page says queries at the end "can improve response quality by up to 30 percent in tests" (an Anthropic in-house claim with no dataset given) | same | 2026-10-28 |
| Prefill removed | Prefilling the last assistant turn is not supported from Claude 4.6 on and returns 400; the doc lists replacements (structured outputs, XML-tagged output, system-prompt instructions) | same ; https://platform.claude.com/docs/en/api/errors | 2026-10-28 |
| Sampling parameters | Under API version 2026-10-21, `temperature`, `top_p` and `top_k` are rejected; Claude 4.7 and later already accept only defaults; requests sample at temperature 1.0 | https://platform.claude.com/docs/en/api/migration-2026-10-21 | 2026-10-28 |
| Anthropic interactive tutorial | 9 chapters plus an appendix (structure, clarity, roles, separating data from instructions, output format, thinking step by step, examples, avoiding hallucinations, complex prompts); it uses Claude 3 Haiku, so its model-specific advice is dated | https://github.com/anthropics/prompt-eng-interactive-tutorial | 2026-10-28 |
| Workflow patterns | Prompt chaining, routing, parallelization (sectioning, voting), orchestrator-workers, evaluator-optimizer | https://www.anthropic.com/engineering/building-effective-agents (Dec 19, 2024) | 2026-10-28 |
| JD frequency | Prompt engineering 29.1%, LLM integration 25.4%, RAG 35.9% of 889 classified JDs from 5 cities (Berlin, Amsterdam, London, Los Angeles, New York); published Mar 4, 2026 | https://aishippingblog.com/p/what-1000-job-descriptions-reveal | 2026-10-28 |

Could not source: a general figure for how much chain-of-thought or self-consistency improves accuracy on a production task. Use the lesson's own toy eval rather than quoting one.

### 1.3 structured-outputs (JSON mode, schema-constrained decoding, tool calling)

| Fact | Value | Source | Checked |
|---|---|---|---|
| OpenAI JSON mode vs Structured Outputs | Both produce valid JSON; only Structured Outputs adheres to a schema; OpenAI recommends Structured Outputs over JSON mode when possible | https://developers.openai.com/api/docs/guides/structured-outputs | 2026-10-28 |
| OpenAI JSON mode gotchas | "the API will throw an error if the string "JSON" does not appear somewhere in the context"; without that instruction "the model may generate an unending stream of whitespace"; truncated output can be incomplete JSON | same (JSON mode section) | 2026-10-28 |
| Where the parameter lives (OpenAI) | Responses: `text.format` (`{type: "json_schema", strict: true, schema}`); Chat Completions: `response_format` | same ; https://developers.openai.com/api/docs/guides/migrate-to-responses | 2026-10-28 |
| OpenAI strict schema rules | `additionalProperties: false` on every object; every field listed in `required`; optional fields as a union with `null`; the root must be an object and not `anyOf` (a Zod discriminated union at the root is invalid); `$defs`/`$ref` and recursion supported; output follows schema key order | https://developers.openai.com/api/docs/guides/structured-outputs | 2026-10-28 |
| OpenAI schema limits | Up to 5,000 object properties and 10 levels of nesting; 120,000 characters total for property names, definition names, enum values and consts; 1,000 enum values in total; a single string enum over 250 values capped at 15,000 characters; unsupported everywhere: `allOf`, `not`, `dependentRequired`, `dependentSchemas`, `if`/`then`/`else` | same | 2026-10-28 |
| First-call latency | OpenAI: the first request with a new schema has extra latency. Anthropic: the grammar compiles on first use, compiled grammars are cached for 24 hours from last use, and compilation times out after 180 seconds | same ; https://platform.claude.com/docs/en/build-with-claude/structured-outputs | 2026-10-28 |
| Anthropic structured outputs | `output_config.format` with `type: "json_schema"`, plus `strict: true` on tools; status GA; the deprecated `output_format` parameter needs beta header `structured-outputs-2025-11-13`; works by compiling the schema into a grammar (constrained decoding) | https://platform.claude.com/docs/en/build-with-claude/structured-outputs | 2026-10-28 |
| Anthropic schema limits | Not supported: recursive schemas, external `$ref`, numeric constraints (`minimum`, `maximum`, `multipleOf`), string length constraints, array constraints beyond `minItems` 0 or 1, `additionalProperties` other than `false`. SDK helpers move such constraints into descriptions and validate locally | same | 2026-10-28 |
| Schema-valid output can still fail | Anthropic: `stop_reason: "refusal"` (HTTP 200, billed, may not match schema), `stop_reason: "max_tokens"` (truncated), enum values that differ only in case. OpenAI: a `refusal` content item, or `status: incomplete` with `max_output_tokens` | same ; https://developers.openai.com/api/docs/guides/structured-outputs | 2026-10-28 |
| Citations vs structured outputs (Claude) | Citations together with `output_config.format` return 400; `cited_text` does not count toward output tokens; plain text and PDFs are chunked into sentences, custom content is not re-chunked | https://platform.claude.com/docs/en/build-with-claude/citations | 2026-10-28 |
| Tool calling flow | Send tools; the model returns a call; your code runs it; send the result back; the model answers or calls again. In Responses, results go back as `function_call_output` items carrying the matching `call_id` | https://developers.openai.com/api/docs/guides/function-calling | 2026-10-28 |
| Strict default differs by API | Responses attempts strict mode by default and falls back if the schema is incompatible; Chat Completions functions are non-strict by default; Responses tool definitions are internally tagged (`name`, `parameters` at top level) while Chat Completions nests them under `function` | https://developers.openai.com/api/docs/guides/migrate-to-responses ; https://developers.openai.com/api/docs/guides/function-calling | 2026-10-28 |
| `tool_choice` and parallel calls (OpenAI) | `auto` (default), `required`, a named function, `allowed_tools`, `none`; `parallel_tool_calls: false` gives zero or one call; a soft suggestion of fewer than 20 functions at the start of a turn; custom tools can be constrained with `lark` or `regex` grammars | https://developers.openai.com/api/docs/guides/function-calling | 2026-10-28 |
| Forced tool use (Claude) | Opus 5.5, Sonnet 5.5, Fable 5.1 and Mythos 5.1 reject `tool_choice` of `any` or `tool` with 400; use `auto` with strict tool use, or structured outputs | https://platform.claude.com/docs/en/api/errors | 2026-10-28 |
| Partial JSON parsing | `pydantic_core.from_json(data, allow_partial=True)` parses `'["aa", "bb", "c'` to `['aa', 'bb']` | https://pydantic.dev/docs/validation/latest/concepts/json/ | 2026-10-28 |
| BFCL | Berkeley Function Calling Leaderboard V4, "Last Updated: 2026-04-12"; v3 added multi-turn, v4 added agentic evaluation | https://gorilla.cs.berkeley.edu/leaderboard.html | 2026-10-28 |
| Format restriction debate | Tam et al. (arXiv 2408.02442, Aug 2024) report reasoning declines under format restrictions. The dottxt rebuttal (Will Kurt, page undated) re-ran the tasks with Llama-3-8B-Instruct and found structured output matched or beat unstructured: GSM8K 0.78 vs 0.77, Last Letter 0.77 vs 0.73, Shuffle Object 0.44 vs 0.41, attributing the paper's gap to mismatched prompts and an LLM-based answer parser | https://arxiv.org/abs/2408.02442 ; https://blog.dottxt.ai/say-what-you-mean.html | 2026-10-28 |

### 1.4 context-engineering (budgets, caching, compaction)

| Fact | Value | Source | Checked |
|---|---|---|---|
| Claude cache pricing multipliers | 5-minute write 1.25x base input; 1-hour write 2x; read 0.1x by default, but 0.05x on Opus 5.5 and Sonnet 5.5 and 0.025x on Fable 5.1 and Mythos 5.1 | https://platform.claude.com/docs/en/build-with-claude/prompt-caching ; https://platform.claude.com/docs/en/about-claude/pricing | 2026-10-28 |
| Claude Opus 5.5 cache prices per MTok | Base input $4, 5m write $5, 1h write $8, cache hit $0.20, output $20 | https://platform.claude.com/docs/en/about-claude/pricing | 2026-10-28 |
| Claude minimum cacheable length | 512 tokens (Fable 5.1, Opus 5.5, Opus 5, Sonnet 5.5, Haiku 5.5 and others); 1,024 (Sonnet 4.6, Sonnet 4.5 and others); 2,048 (Opus 4.7, Haiku 3.5); 4,096 (Opus 4.6, Opus 4.5, Haiku 4.5). Shorter prompts are processed uncached and no error is returned | https://platform.claude.com/docs/en/build-with-claude/prompt-caching | 2026-10-28 |
| Claude cache mechanics | Up to 4 explicit breakpoints; prefix order `tools`, `system`, `messages`; 20-block lookback; default 5-minute TTL, refreshed free on each use and measured from the start of the request; a top-level `cache_control` turns on automatic caching | same | 2026-10-28 |
| What invalidates the Claude cache | Changing tool definitions invalidates everything; toggling web search or citations invalidates system and messages; changing `tool_choice` or adding images invalidates messages; changing thinking parameters or `output_config.effort` invalidates messages; changing `output_config.format` invalidates the prompt cache for the thread | https://platform.claude.com/docs/en/build-with-claude/prompt-caching ; https://platform.claude.com/docs/en/build-with-claude/structured-outputs | 2026-10-28 |
| Claude usage fields | `cache_creation_input_tokens`, `cache_read_input_tokens`, and `input_tokens` (only tokens after the last breakpoint); total input is the sum of the three | https://platform.claude.com/docs/en/build-with-claude/prompt-caching | 2026-10-28 |
| OpenAI prompt caching | On by default; minimum 1,024 tokens for GPT-5.6 and later; GPT-5.6 and later read at 0.1x input (0.05x for GPT-6.1 Sol and Terra) and write at 1.25x for `"30m"` and 2.5x for `"12h"`; `prompt_cache_key` helps routing; traffic "above 15 requests per minute can lead to overflow routing"; usage field `usage.input_tokens_details.cached_tokens`; earlier models round `cached_tokens` down to a multiple of 128 | https://developers.openai.com/api/docs/guides/prompt-caching | 2026-10-28 |
| Gemini implicit caching | On by default for Gemini 2.5 and newer; implicit minimum 2,048 tokens on Gemini 2.5 Flash and Pro and 4,096 on the Gemini 3.x and 4 models listed; the page gives no discount figure | https://ai.google.dev/gemini-api/docs/caching | 2026-10-28 |
| Context rot | Chroma tested 18 models (July 14, 2025): reliability drops as input grows even on simple tasks; a single distractor already hurts; shuffled haystacks scored better than coherent ones | https://www.trychroma.com/research/context-rot | 2026-10-28 |
| Lost in the middle | Liu et al., arXiv 2307.03172 (July 2023, TACL): accuracy is highest when relevant text sits at the start or end of the context; measured on 2023-era models | https://arxiv.org/abs/2307.03172 | 2026-10-28 |
| Anthropic context engineering | Sep 29, 2025: context as a finite "attention budget"; "context rot"; system prompts at the "right altitude"; minimal, non-overlapping tools; just-in-time retrieval; compaction, structured note-taking, and sub-agents that return condensed summaries of about 1,000 to 2,000 tokens | https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents | 2026-10-28 |
| LangChain context engineering | July 2, 2025: four strategies, write, select, compress, isolate; failure modes poisoning, distraction, confusion and clash, credited to Drew Breunig (June 22, 2025) | https://www.langchain.com/blog/context-engineering-for-agents | 2026-10-28 |
| Claude context editing | Beta header `context-management-2025-06-27`; `clear_tool_uses_20250919` defaults: trigger at 100,000 input tokens, keep 3 tool uses; `clear_thinking_20251015`; clearing tool results invalidates cached prefixes | https://platform.claude.com/docs/en/build-with-claude/context-editing | 2026-10-28 |
| Claude server-side compaction | Beta; on-demand compaction uses header `compact-2026-09-04` and a top-level `compaction` parameter; threshold compaction runs inside the request that crosses the trigger | https://platform.claude.com/docs/en/build-with-claude/compaction | 2026-10-28 |
| Tool output size | Anthropic: "For Claude Code, we restrict tool responses to 25,000 tokens by default"; in their example a concise response format used 72 tokens against 206 for the detailed one | https://www.anthropic.com/engineering/writing-tools-for-agents (Sep 11, 2025) | 2026-10-28 |

Could not source: a primary measurement of how often semantic caching returns a wrong answer. Teach the failure mode with a constructed example, not a rate.

### 1.5 frameworks

| Fact | Value | Source | Checked |
|---|---|---|---|
| LangChain and LangGraph 1.0 | Released Oct 22, 2025; `create_agent` runs on LangGraph; middleware with built-ins for human-in-the-loop, summarization and PII redaction; `.content_blocks` standard content; legacy code moved to `langchain-classic`; Python 3.10+; `langgraph.prebuilt` deprecated in favour of `langchain.agents`; no breaking changes until 2.0 | https://www.langchain.com/blog/langchain-langgraph-1dot0 | 2026-10-28 |
| `create_agent` parameters | `model`, `tools`, `system_prompt`, `response_format`, `checkpointer`, `middleware`, `state_schema`, `context_schema`, `name`; `before_model` and `after_model` hooks | https://docs.langchain.com/oss/python/langchain/agents | 2026-10-28 |
| LangChain structured output | `ProviderStrategy` (native provider structured output) is chosen when supported, otherwise `ToolStrategy` (tool calling); `handle_errors=True` by default re-prompts the model on validation errors; raw JSON Schema dicts must be wrapped explicitly | https://docs.langchain.com/oss/python/langchain/structured-output | 2026-10-28 |
| Vercel AI SDK 7 | June 25, 2026: `WorkflowAgent` (durable, resumable), experimental `HarnessAgent`, one-time telemetry registration, a `reasoning` option on `generateText`/`streamText`, `uploadFile`/`uploadSkill`, per-tool `contextSchema`, total, per-step, per-chunk and per-tool timeouts; codemod `npx @ai-sdk/codemod v7` | https://vercel.com/blog/ai-sdk-7 | 2026-10-28 |
| LiteLLM Router | Default routing `simple-shuffle`; also `least-busy`, `usage-based-routing`, `latency-based-routing`, `cost-based-routing`; defaults `allowed_fails` 3 and `cooldown_time` 5 seconds; exponential backoff for RateLimitError, immediate retry for generic errors | https://docs.litellm.ai/docs/routing | 2026-10-28 |
| LiteLLM proxy reliability | Retries first, then fallbacks in listed order; `context_window_fallbacks`, `content_policy_fallbacks`, `default_fallbacks`; the example config uses `cooldown_time: 30` and `num_retries: 3` (examples, not defaults) | https://docs.litellm.ai/docs/proxy/reliability | 2026-10-28 |
| When to skip a framework | Anthropic: start with direct API calls because many patterns need a few lines of code; frameworks can "obscure the underlying prompts"; "Incorrect assumptions about what's under the hood are a common source of customer error" | https://www.anthropic.com/engineering/building-effective-agents (Dec 19, 2024, before the 2025 window; use as background next to the 2025 posts) | 2026-10-28 |
| JD frequency of frameworks | LangChain 18.8%, LangGraph 8.0%, LlamaIndex 5.8% of 889 JDs from 5 cities | https://aishippingblog.com/p/what-1000-job-descriptions-reveal | 2026-10-28 |

Could not source: current download or adoption figures for LangChain, LiteLLM or the AI SDK from a primary page. Do not quote star counts or "most popular" claims.

## 2. Latest developments interviews ask about (2025 and 2026 primary sources)

1. **OpenAI Responses API vs Chat Completions.** Responses launched March 11, 2025 (date from search results, including https://simonwillison.net/2025/Mar/11/responses-vs-chat-completions/, search only; openai.com returned 403). The current migration guide says "Responses is recommended for all new projects", Chat Completions stays supported, and the Assistants API "officially sunset on August 26, 2026". Differences to teach: `input` plus typed output Items (`message`, `reasoning`, `function_call`, `function_call_output`) instead of `messages` and `choices`; responses stored by default (`store: false` turns it off); `previous_response_id` chaining does not carry `instructions`, and earlier input tokens are still billed; hosted tools (web search, file search, computer use, code interpreter, remote MCP, image generation); reasoning items stay in context, with `encrypted_content` for stateless use; from GPT-5.4, Chat Completions does not support tool calling with `reasoning_effort` other than `none`. Source: https://developers.openai.com/api/docs/guides/migrate-to-responses (checked 2026-10-28).
2. **Anthropic Messages API features.** Prompt caching with automatic mode and a 1-hour TTL (https://platform.claude.com/docs/en/build-with-claude/prompt-caching); Message Batches (https://platform.claude.com/docs/en/build-with-claude/batch-processing); thinking moved from `budget_tokens` to adaptive thinking plus `effort` (https://platform.claude.com/docs/en/build-with-claude/extended-thinking); citations GA with sentence chunking (https://platform.claude.com/docs/en/build-with-claude/citations); API version `2026-10-21`, which removes sampling parameters (https://platform.claude.com/docs/en/api/migration-2026-10-21). All checked 2026-10-28.
3. **Structured outputs and JSON schema modes.** OpenAI strict `json_schema` and its subset rules; Anthropic GA structured outputs through grammar compilation, with the beta header for the old parameter dated `2025-11-13`. Sources in 1.3.
4. **Tool calling formats.** OpenAI Responses internally tagged function tools, `call_id` pairing, `allowed_tools`, grammar-constrained custom tools; Claude `tool_use` and `tool_result` blocks with `strict: true`, and no forced tool choice on the newest models. Sources in 1.3.
5. **Streaming and partial JSON.** Claude `input_json_delta` and `eager_input_streaming`; OpenAI `response.function_call_arguments.delta`; Pydantic `allow_partial`. Sources in 1.1 and 1.3.
6. **Context engineering.** Anthropic (Sep 29, 2025), LangChain (July 2, 2025), Chroma context rot (July 14, 2025), Claude context editing (beta header dated 2025-06-27) and compaction (beta header dated 2026-09-04). Sources in 1.4.
7. **Prompt caching pricing.** Claude read multipliers now vary by model (0.1x, 0.05x or 0.025x); OpenAI GPT-5.6 and later add write charges (1.25x for 30 minutes, 2.5x for 12 hours) and an explicit breakpoint mode. Interviewers ask why reordering a prompt changes the bill. Sources in 1.4.
8. **Rate limit handling.** Token bucket semantics, cache-aware ITPM, the spend-cap 429 without `retry-after`, and OpenAI counting `max_tokens` toward TPM. Sources in 1.1.
9. **SDK retry defaults.** Both Python SDKs retry twice with a 10-minute timeout; the AI SDK `maxRetries` default is 2. Sources in 1.1.
10. **Vercel AI SDK.** Version 7, June 25, 2026 (https://vercel.com/blog/ai-sdk-7).
11. **LangChain 1.x.** 1.0 on Oct 22, 2025; structured output strategies documented for `langchain>=1.1` (https://docs.langchain.com/oss/python/langchain/structured-output).
12. **LiteLLM.** Router and proxy reliability docs (https://docs.litellm.ai/docs/routing, https://docs.litellm.ai/docs/proxy/reliability). Neither page carries a publication date, so cite them as "checked 2026-10-28".
13. **When to use no framework.** Anthropic's Dec 2024 post, plus its Sep 2025 tool-writing post, which runs its evals "in a simple agentic loop using direct LLM API calls" (paraphrase of https://www.anthropic.com/engineering/writing-tools-for-agents; verify the exact wording before quoting).
14. **Tool-calling evaluation.** BFCL V4 (last updated 2026-04-12) for the "right tool, right arguments" framing in the structured-outputs lesson.

## 3. Interview questions collected

Type codes follow SPEC section 6. Difficulty is our judgement. "Company" is filled only when the source itself names the company next to the question or round; otherwise it is "none". Reliability notes: aced.io and Blind are candidate reports (single, anecdotal); techinterview.org, getperspective.ai, careery.pro and prachub.com are third-party guides or aggregators whose claims are not confirmed by the companies; GitHub banks are community lists without company attribution.

| # | Question (verbatim where quoted) | Type | Difficulty | Module | Source | Company named by source |
|---|---|---|---|---|---|---|
| 1 | "Implement pagination for an API to retrieve all results. Then do some computation with the JSON response." | code | easy | api-anatomy | https://www.aced.io/experiences/sierra-ai-senior-ai-engineer-interview-087f4e | Sierra (candidate report) |
| 2 | "Debug and extend a Python codebase to add an async exponential retry mechanism with timeouts and backoff." | code | medium | api-anatomy | https://www.aced.io/blog/ai-engineer-interview-questions | Sierra |
| 3 | "Implement a retry mechanism with exponential backoff for LLM API calls." | code | medium | api-anatomy | https://github.com/amitshekhariitbhu/ai-engineering-interview-questions | none |
| 4 | Phone-screen task: "designing a token-budget allocator" | code | medium | context-engineering | https://getperspective.ai/blog/anthropic-applied-ai-engineer-interview-process-frontier-lab-2026/markdown | Anthropic (third-party guide dated 2026-05-29, not a candidate report) |
| 5 | Phone-screen task: "implementing a tool-use orchestrator" | code | medium | structured-outputs | same as 4 | Anthropic (same caveat) |
| 6 | "Write a function calling (tool use) handler for an LLM API." | code | medium | structured-outputs | https://github.com/amitshekhariitbhu/ai-engineering-interview-questions | none |
| 7 | "Implement streaming responses for an LLM API." | code | medium | api-anatomy | same as 6 | none |
| 8 | "Stream-process LLM response tokens with structured-output parsing (extract citations as they appear)" | code | hard | structured-outputs | https://www.techinterview.org/companies/perplexity/ | Perplexity (guide dated 2026-04-24, updated 2026-07-11) |
| 9 | Coding round examples: "parsing a tool-call schema", "handling a streaming response", "retrying failed API calls with backoff" | code | medium | api-anatomy | https://www.techinterview.org/companies/decagon-interview-guide/ | Decagon (guide dated 2026-05-05, updated 2026-10-16) |
| 10 | "Implement semantic caching for LLM queries (cache responses for semantically similar queries)." | code | medium | context-engineering | https://github.com/amitshekhariitbhu/ai-engineering-interview-questions | none |
| 11 | "Design and Implement a Rate Limiter with an AI Assistant, Then Defend and Test It" | code | medium | api-anatomy | https://prachub.com/interview-questions/design-and-implement-a-rate-limiter-with-an-ai-assistant-then-defend-and-test-it | Snowflake (ML Engineer onsite, listed 2026-09-07) |
| 12 | "What is the difference between structured output and function calling?" | concept | easy | structured-outputs | https://github.com/amitshekhariitbhu/ai-engineering-interview-questions | none |
| 13 | "How do you implement structured output from LLMs reliably in production?" | concept | medium | structured-outputs | same as 12 | none |
| 14 | "How does Prompt Caching work?" | concept | medium | context-engineering | same as 12 | none |
| 15 | "Your application is hitting LLM provider rate limits during peak hours. How do you handle it?" | debug | medium | api-anatomy | same as 12 | none |
| 16 | "Your LLM endpoint's p99 latency doubled after a deploy with no model change. How do you diagnose it?" | debug | hard | api-anatomy | same as 12 | none |
| 17 | "Your application depends on one LLM provider. How do you switch providers without downtime?" | design | hard | frameworks | same as 12 | none |
| 18 | "Your LLM costs are too high in production. How do you reduce costs without degrading quality?" | design | medium | context-engineering | same as 12 | none |
| 19 | "How do you estimate the cost of running an AI-powered feature in production?" | estimate | medium | api-anatomy | same as 12 | none |
| 20 | "Why is the first token slower than the rest in an LLM?" | concept | medium | api-anatomy | same as 12 | none |
| 21 | "Your few-shot prompting gives inconsistent results across similar inputs. How do you stabilize it?" | debug | medium | prompting | same as 12 | none |
| 22 | "Your LLM selects the right tool but extracts the wrong parameters. How do you fix parameter extraction?" | debug | medium | structured-outputs | same as 12 | none |
| 23 | "Your AI agent has many tools, but keeps picking the wrong one. How do you improve tool selection?" | debug | medium | structured-outputs | same as 12 | none |
| 24 | "Your chatbot loses context after 10 turns in a conversation. How do you maintain a long conversation context?" | design | medium | context-engineering | same as 12 | none |
| 25 | "What is the 'lost in the middle' problem in long-context prompting?" | concept | easy | context-engineering | same as 12 | none |
| 26 | "How does context compaction work?" | concept | medium | context-engineering | same as 12 | none |
| 27 | "How do you version and manage prompts in production?" | concept | medium | prompting | same as 12 | none |
| 28 | "How do you handle model updates and deprecations from providers?" | design | medium | prompting | https://raw.githubusercontent.com/ombharatiya/ai-system-design-guide/main/00-interview-prep/01-question-bank.md | none |
| 29 | "When should you use LangChain vs build from scratch?" | concept | medium | frameworks | same as 28 | none |
| 30 | "What is DSPy and when would you use it?" | concept | medium | frameworks | same as 28 | none |
| 31 | "What is LangGraph and when would you use it over LangChain?" | concept | medium | frameworks | https://careery.pro/blog/ai-careers/ai-engineer-interview-questions | none (LangChain named only as the subject) |
| 32 | "How would you handle rate limiting and cost control for LLM APIs?" | design | medium | api-anatomy | same as 31 | none |
| 33 | "Design a multi-model inference gateway." | design | hard | frameworks | same as 31 | none (OpenAI, Anthropic, Google named only as providers) |
| 34 | "Explain the difference between OpenAI functions vs LangChain Agents" | concept | easy | frameworks | https://github.com/llmgenai/LLMInterviewQuestions | none |
| 35 | "How to use stop sequences in LLMs?" | mcq (as written it is a concept question; usable as an mcq on stop reasons) | easy | api-anatomy | same as 34 | none |
| 36 | "How do you cap tool calls and spend per request so one runaway session can't cost fifty dollars?" | estimate | medium | context-engineering | https://www.techinterview.org/post/3233476824/ai-engineer-interview-rag-agents-evals/ | none (the article names Anthropic only for its process, not this question) |
| 37 | "Given a simple PDF-based workflow with long context windows, how would you improve reliability and performance?" (follow-ups: memory and chat history, avoiding timeouts, consistent output) | design | hard | context-engineering | https://www.aced.io/experiences/anthropic-machine-learning-engineer-interview-27873a | Anthropic (candidate report, ML Engineer, Prompt Engineer role) |
| 38 | "Here is a tooling scenario where the model has to make a plan and execute a tool. How would you solve it?" (follow-ups: MCP, managing the context window for long-running tasks) | design | hard | structured-outputs | same as 37 | Anthropic (same report) |

Loop evidence without a question text (not counted above): a Blind post dated May 18, 2025 reports a "CodeSignal assessment for prompt engineering" for an Anthropic Applied AI product engineer role, with commenters advising to read Anthropic's prompt engineering docs (https://www.teamblind.com/post/anthropic-applied-ai-product-engineer-interview-8bqjbuwx). Adjacent design questions that belong to other tracks: "Design an API that lets users sample from large language models efficiently, with good batching and request orchestration." (Anthropic) and "Design the OpenAI Playground." (OpenAI), both at https://www.aced.io/blog/ai-engineer-interview-questions; route them to `inference` and `system-design`.

### 3.1 Recommended for the problem bank (15, of which 11 core)

| Pick | From # | Proposed problem | Type | Difficulty | Core | Why |
|---|---|---|---|---|---|---|
| 1 | 1 | Fetch every page from a cursor API and aggregate the JSON | code | easy | yes | Company-attributed, plain plumbing that phone screens use; snippet 5.2 is the reference |
| 2 | 2, 3, 9 | Retry client with full jitter, `Retry-After` as a floor, a cap, and no retry on spend-cap 429 | code | medium | yes | Asked in three independent sources; snippet 5.1 |
| 3 | 4 | Token-budget allocator for system prompt, history and retrieved docs | code | medium | yes | Named in the brief and in the Anthropic guide; snippet 5.5 |
| 4 | 5, 6 | Tool-use orchestrator with `tool_use_id` pairing, error results and a step cap | code | medium | yes | Covers the function-calling protocol end to end; snippet 5.7 |
| 5 | 8, 9 | Accumulate streamed tool-call JSON and act only on complete arguments | code | hard | no | Streaming plus partial JSON; snippet 5.3 |
| 6 | 13 | Guarantee valid structured output: constrained decoding vs JSON mode vs validate-and-repair, and the cases that still fail | concept | medium | yes | Central to the module; facts in 1.3 |
| 7 | 12 | MCQ: which tool fits (JSON mode, strict schema output, function calling) for three scenarios | mcq | easy | yes | Gradable; distractor: "JSON mode guarantees the schema" |
| 8 | 14 | MCQ: which change keeps the prompt cache warm (timestamp in system prompt, reordered tools, new user turn, changed effort) | mcq | medium | yes | Gradable; answers in 1.4 and snippet 5.8 |
| 9 | 19 | Estimate the monthly cost of a feature with and without prompt caching | estimate | medium | yes | Gradable with a range; snippet 5.6 gives a worked case |
| 10 | 36 | Estimate a per-session spend cap and the step limit that enforces it | estimate | medium | no | Second estimate for the daily rotation |
| 11 | 15 | Peak-hour 429s: read headers, separate rate limit, spend cap and 529, then fix | debug | medium | yes | Gradable debug with choices; facts in 1.1 |
| 12 | 22 | Right tool, wrong arguments: find the cause in a tool definition | debug | medium | no | Tool description as prompt; ties to the Anthropic tools post |
| 13 | 17, 28 | Move to a new model or second provider without changing outputs unpredictably | design | hard | yes | Model upgrades and deprecations come up in several sources |
| 14 | 24, 26 | Keep facts alive across a long conversation: truncation, summaries, compaction, notes | design | medium | yes | Context engineering core; facts in 1.4 |
| 15 | 29 | Would you use LangChain for this service? Defend either answer | concept | medium | no | Frameworks module; answer can cite LangChain 1.0 and Anthropic's framework advice |

Types covered: code 5, concept 2, mcq 2, estimate 2, debug 2, design 2. Behavioural is left to the `rounds` track per SPEC section 7; no public source gave an API-specific behavioural question. Core count: 11, matching SPEC section 7.

## 4. Misconceptions and gotchas for reviewers

1. **"Set temperature to 0 for deterministic output."** On the Claude API version 2026-10-21, `temperature`, `top_p` and `top_k` are rejected with 400, and Claude 4.7 and later already accept only defaults (https://platform.claude.com/docs/en/api/migration-2026-10-21). The OpenAI reasoning guide documents `reasoning.effort` but nothing on temperature for reasoning models. A lesson that tells readers to lower temperature for consistency must say which model and API version, or use structured outputs and evals instead.
2. **Prefill to force JSON.** Not supported on Claude 4.6 and later (400). Old tutorials, including the Anthropic interactive tutorial built on Claude 3 Haiku, still teach it.
3. **Forcing a tool call.** `tool_choice` `any` or `tool` returns 400 on Opus 5.5, Sonnet 5.5 and Fable 5.1. OpenAI still supports `required` and named functions. Do not write provider-neutral advice that assumes forcing works everywhere.
4. **Extended thinking budgets.** `budget_tokens` is rejected on Claude 4.7 and later; current models use adaptive thinking with `effort`. Changing thinking settings or effort mid-conversation invalidates the message cache.
5. **JSON mode is not schema adherence.** JSON mode guarantees parseable JSON only, needs the word "JSON" in the context on OpenAI, and can emit endless whitespace without an instruction.
6. **"Structured outputs means the output is always valid."** Refusals, `max_tokens` truncation and enum case differences can still break the schema. Code must check `stop_reason` (Claude) or `status` and `refusal` (OpenAI) before parsing.
7. **Schema rules differ by provider.** OpenAI strict mode supports recursion and requires every field in `required`; Anthropic rejects recursive schemas and numeric or string-length constraints. A Zod discriminated union at the root fails OpenAI strict mode.
8. **Citations and structured outputs together.** Claude returns 400. A RAG lesson that wants both must pick one or use a two-step design.
9. **"Prompt caching gives a 90% discount."** True only for the default Claude multiplier (0.1x read). Opus 5.5 and Sonnet 5.5 read at 0.05x, Fable 5.1 at 0.025x; writes cost 1.25x or 2x; OpenAI GPT-5.6 and later now charge 1.25x or 2.5x for writes. State the model and date.
10. **Cache misses that look like bugs.** Prompts below the model's minimum (512 to 4,096 tokens on Claude, 1,024 on OpenAI GPT-5.6+) are silently uncached; a timestamp or user ID near the top of the system prompt breaks the prefix; reordering tools breaks everything after them; the Claude TTL counts from the start of the request, so a 4-minute stream leaves about 1 minute.
11. **Reading `input_tokens` as total input.** On Claude, `input_tokens` covers only tokens after the last breakpoint. Total input is the sum of `cache_read_input_tokens`, `cache_creation_input_tokens` and `input_tokens`. Cost dashboards built on `input_tokens` alone undercount.
12. **Rate limits reset every minute.** Claude uses a continuously refilled token bucket, and a per-minute limit can be enforced per second. Cached reads do not count toward Claude ITPM on most models. OpenAI counts the larger of `max_tokens` and the estimate toward TPM, while Claude OTPM ignores `max_tokens`. Do not generalise one provider's rule.
13. **Every 429 is retryable.** The Claude spend-cap 429 has no `retry-after` and will not clear by retrying; OpenAI says not to retry quota or billing errors. A 529 `overloaded_error` is a different condition from a 429.
14. **Stacking retries.** Both Python SDKs already retry twice. Wrapping them in another 3-attempt loop gives up to 9 attempts per call, and each layer of a call stack multiplies again (the AWS example reaches 243x). Teach `max_retries=0` on the SDK when the application owns the retry policy.
15. **Retrying side effects.** A retried tool call that sends an email or charges a card runs twice unless the operation is idempotent. The AWS Builders' Library article covers this; lessons should not show retries around non-idempotent tools without a key.
16. **Streaming parsing.** `input_json_delta` fragments are not valid JSON until `content_block_stop`; usage in `message_delta` is cumulative, so summing deltas double counts; errors can arrive after HTTP 200; `ping` events must be ignored, not treated as content.
17. **Batch results in input order.** Not guaranteed; match on `custom_id`. Expired requests are not billed.
18. **Responses API state.** `previous_response_id` does not carry `instructions`, and earlier turns are still billed as input. Responses are stored by default. Assistants API content is obsolete after August 26, 2026.
19. **Function definition shapes.** Chat Completions nests the function under `function` and is non-strict by default; Responses is internally tagged and attempts strict by default. Code samples that mix the two shapes will fail.
20. **Thinking blocks.** With tool use on Claude, thinking and redacted thinking blocks must be sent back unchanged. Filtering content by type and dropping them returns 400.
21. **"Structured output hurts reasoning" stated as fact.** The evidence is contested (Tam et al. 2024 versus the dottxt rebuttal). Present both, and prefer the lesson's own measurement.
22. **Bigger context window means no context problem.** Chroma's 2025 study shows degradation with length even on simple tasks. The "lost in the middle" U-shape was measured on 2023 models; describe it as a historical finding, not a law for current models.
23. **Long-context pricing.** Claude 4.6 and later bill 1M tokens at a flat rate (Haiku 5.5 has a tier above 100,000 tokens). OpenAI lists gpt-5.5 and gpt-5.4 prices for under 272K context. Do not claim either a universal surcharge or universal flat pricing.
24. **Framework APIs from old tutorials.** `create_react_agent` from `langgraph.prebuilt` is deprecated in favour of `langchain.agents.create_agent`; legacy chains live in `langchain-classic`. AI SDK code using `maxSteps` predates the `stopWhen` API; AI SDK 7 is current as of June 2026 and needs a codemod from 6.
25. **LiteLLM defaults.** The routing page gives `cooldown_time` 5 seconds as the default while the proxy reliability example uses 30; cite the example as an example.
26. **Vendor guidance quoted as universal.** "3 to 5 examples", "queries at the end improve quality by up to 30 percent" and "fewer than 20 functions" are vendor statements for their own models. Attribute them.
27. **Gateway auth header.** Claude SDK 2.x sends `Authorization: Bearer`; a proxy that reads `X-Api-Key` breaks after the upgrade.
28. **Pyodide and `asyncio.run`.** Snippet 5.2 uses `asyncio.run`, which is not the usual entry point inside Pyodide's browser event loop; the code runner should use top-level `await main()` instead. Not tested in Pyodide.
29. **Company tags.** Only rows in section 3 with a company in the last column may populate `companies`. Questions from getperspective.ai, techinterview.org and prachub.com are third-party guides; a reviewer may decide to leave `companies` empty for them.

## 5. Runnable Python snippets

All eight were run with Python 3.12.6 on Windows (`python -I`) on 2026-10-28 and passed their asserts. Standard library only, no network. Not yet run in Pyodide (see gotcha 28).

### 5.1 Retry with full jitter and Retry-After as a floor (module api-anatomy)

```python
import random

class RateLimited(Exception):
    def __init__(self, retry_after=None):
        self.retry_after = retry_after

def call_with_backoff(fn, *, max_attempts=5, base=0.5, cap=20.0,
                      sleep=None, rng=random.random):
    """Full jitter: sleep a random time in [0, min(cap, base * 2**attempt)].
    A Retry-After value from the server is a floor, not a suggestion."""
    for attempt in range(max_attempts):
        try:
            return fn()
        except RateLimited as e:
            if attempt == max_attempts - 1:
                raise
            delay = rng() * min(cap, base * 2 ** attempt)
            if e.retry_after is not None:
                delay = max(delay, e.retry_after)
            sleep(delay)

# test with a fake server that fails twice, then succeeds
calls, slept = [], []
def flaky():
    calls.append(1)
    if len(calls) == 1:
        raise RateLimited(retry_after=3.0)
    if len(calls) == 2:
        raise RateLimited()
    return "ok"

assert call_with_backoff(flaky, sleep=slept.append, rng=lambda: 0.5) == "ok"
assert len(calls) == 3
assert slept[0] == 3.0          # Retry-After wins over 0.5 * 0.5 = 0.25
assert slept[1] == 0.5          # 0.5 * min(20, 0.5 * 2**1) = 0.5
print("s1 ok", slept)
```

Output: `s1 ok [3.0, 0.5]`. The full-jitter formula in the docstring is the common form of AWS "Full Jitter"; check it against the image on the AWS post before a lesson attributes it.

### 5.2 Cursor pagination and bounded concurrency (module api-anatomy)

```python
import asyncio

# mock cursor-paginated API: 23 items, page size 5
DATA = [{"id": i, "amount": i * 10} for i in range(23)]
async def get_page(cursor=None, limit=5):
    await asyncio.sleep(0)
    start = int(cursor or 0)
    items = DATA[start:start + limit]
    nxt = start + limit if start + limit < len(DATA) else None
    return {"items": items, "next_cursor": None if nxt is None else str(nxt)}

async def fetch_all(get_page, max_pages=1000):
    out, cursor = [], None
    for _ in range(max_pages):          # guard against a cursor that never ends
        page = await get_page(cursor)
        out.extend(page["items"])
        cursor = page.get("next_cursor")
        if not cursor:
            return out
    raise RuntimeError("pagination did not terminate")

async def bounded_gather(coros, limit=4):
    sem = asyncio.Semaphore(limit)
    async def run(c):
        async with sem:
            return await c
    return await asyncio.gather(*(run(c) for c in coros))

async def main():
    items = await fetch_all(get_page)
    assert len(items) == 23 and items[-1]["id"] == 22
    assert sum(i["amount"] for i in items) == 2530
    async def work(x):
        await asyncio.sleep(0)
        return x * 2
    assert await bounded_gather([work(i) for i in range(10)], limit=3) == [i * 2 for i in range(10)]
    print("s2 ok", len(items))

asyncio.run(main())
```

Output: `s2 ok 23`.

### 5.3 Accumulating streamed tool-call JSON (module structured-outputs)

```python
import json

# Simulated Anthropic-style stream: tool input arrives as partial JSON strings
events = [
    {"type": "content_block_start", "index": 1, "content_block": {"type": "tool_use", "name": "get_weather", "input": {}}},
    {"type": "content_block_delta", "index": 1, "delta": {"type": "input_json_delta", "partial_json": "{\"location\": \"San Fra"}},
    {"type": "content_block_delta", "index": 1, "delta": {"type": "input_json_delta", "partial_json": "ncisco, CA\", \"unit\": \"f"}},
    {"type": "content_block_delta", "index": 1, "delta": {"type": "input_json_delta", "partial_json": "ahrenheit\"}"}},
    {"type": "content_block_stop", "index": 1},
]

buffers, tool_inputs = {}, {}
for ev in events:
    if ev["type"] == "content_block_delta" and ev["delta"]["type"] == "input_json_delta":
        buffers[ev["index"]] = buffers.get(ev["index"], "") + ev["delta"]["partial_json"]
    elif ev["type"] == "content_block_stop" and ev["index"] in buffers:
        tool_inputs[ev["index"]] = json.loads(buffers.pop(ev["index"]))  # parse once, at the stop event

try:
    json.loads("{\"location\": \"San Fra")      # what a mid-stream parse sees
    raise AssertionError("partial JSON should not parse")
except json.JSONDecodeError:
    pass
assert tool_inputs[1] == {"location": "San Francisco, CA", "unit": "fahrenheit"}
print("s3 ok", tool_inputs[1])
```

Output: `s3 ok {'location': 'San Francisco, CA', 'unit': 'fahrenheit'}`. Event names match the Claude streaming doc; the payload strings are invented for the example.

### 5.4 Validate-and-repair loop with a mock model (module structured-outputs)

```python
import json

SCHEMA = {"name": str, "email": str, "demo_requested": bool}

def validate(obj):
    errors = []
    if not isinstance(obj, dict):
        return ["top level must be an object"]
    for key, typ in SCHEMA.items():
        if key not in obj:
            errors.append(f"missing field: {key}")
        elif not isinstance(obj[key], typ):
            errors.append(f"{key} must be {typ.__name__}, got {type(obj[key]).__name__}")
    extra = set(obj) - set(SCHEMA)
    if extra:
        errors.append(f"unexpected fields: {sorted(extra)}")
    return errors

def extract(call_model, text, max_attempts=3):
    messages = [{"role": "user", "content": text}]
    for _ in range(max_attempts):
        raw = call_model(messages)
        try:
            obj = json.loads(raw)
            errors = validate(obj)
        except json.JSONDecodeError as e:
            obj, errors = None, [f"invalid JSON: {e.msg}"]
        if not errors:
            return obj
        messages += [{"role": "assistant", "content": raw},
                     {"role": "user", "content": "Fix these errors and reply with JSON only: " + "; ".join(errors)}]
    raise ValueError(f"no valid output after {max_attempts} attempts: {errors}")

# deterministic mock model: wrong type first, then fixed
replies = iter(['{"name": "John", "email": "j@example.com", "demo_requested": "yes"}',
                '{"name": "John", "email": "j@example.com", "demo_requested": true}'])
seen = []
def mock_model(messages):
    seen.append(len(messages))
    return next(replies)

assert extract(mock_model, "John (j@example.com) wants a demo")["demo_requested"] is True
assert seen == [1, 3]   # second call carries the bad reply and the error list
print("s4 ok")
```

Output: `s4 ok`. This is the fallback pattern for providers or schemas without constrained decoding. Note that with the Claude 4.6+ no-prefill rule the repair turn is a user message, which this loop already does.

### 5.5 Token-budget allocator (module context-engineering)

```python
def approx_tokens(text):
    # rough heuristic for English text; use the provider's token counter for real budgets
    return max(1, len(text) // 4)

def allocate(budget, system, history, docs, reserve_output):
    """system is mandatory; then the most recent history turns; then docs by score.
    Returns the pieces that fit, in prompt order."""
    remaining = budget - reserve_output - approx_tokens(system)
    if remaining < 0:
        raise ValueError("system prompt plus output reserve exceed the budget")
    kept_history = []
    for turn in reversed(history):                 # newest first
        cost = approx_tokens(turn)
        if cost > remaining:
            break                                   # keep turns contiguous: stop at the first that does not fit
        kept_history.insert(0, turn)
        remaining -= cost
    kept_docs = []
    for score, doc in sorted(docs, key=lambda d: -d[0]):
        cost = approx_tokens(doc)
        if cost <= remaining:                       # knapsack-greedy: skip a big doc, try smaller ones
            kept_docs.append(doc)
            remaining -= cost
    return {"system": system, "docs": kept_docs, "history": kept_history, "left": remaining}

sys_p = "x" * 400                    # 100 tokens
hist = ["a" * 800, "b" * 400, "c" * 200]   # 200, 100, 50 tokens; c is newest
docs = [(0.9, "d" * 2000), (0.8, "e" * 200), (0.5, "f" * 120)]   # 500, 50, 30 tokens
out = allocate(budget=600, system=sys_p, history=hist, docs=docs, reserve_output=200)
assert out["history"] == ["b" * 400, "c" * 200]     # 150 tokens, oldest turn dropped
assert out["docs"] == ["e" * 200, "f" * 120]        # 500-token doc does not fit in 150
assert out["left"] == 70
print("s5 ok", out["left"])
```

Output: `s5 ok 70`. The 4-characters-per-token rule is a heuristic, not a sourced constant; a lesson should say so or measure with `js-tiktoken` as SPEC section 2 does. Giving history priority over documents is one policy; a problem can ask for a fixed share per section instead.

### 5.6 Prompt-cache cost comparison (module context-engineering)

```python
# Prices in USD per million tokens for Claude Opus 5.5, from
# platform.claude.com/docs/en/about-claude/pricing (checked 2026-10-28)
BASE, WRITE_5M, READ = 4.00, 5.00, 0.20

def cost(prefix, suffix, n_requests, cached):
    if not cached:
        return n_requests * (prefix + suffix) * BASE / 1e6
    first = prefix * WRITE_5M / 1e6 + suffix * BASE / 1e6
    rest = (n_requests - 1) * (prefix * READ / 1e6 + suffix * BASE / 1e6)
    return first + rest

no_cache = cost(50_000, 500, 200, cached=False)
with_cache = cost(50_000, 500, 200, cached=True)
print(f"no cache ${no_cache:.2f}, with cache ${with_cache:.2f}")
assert round(no_cache, 2) == 40.40
assert round(with_cache, 2) == 2.64
# break-even: one write plus one read is already cheaper than two uncached sends
assert WRITE_5M + READ < 2 * BASE
print("s6 ok")
```

Output: `no cache $40.40, with cache $2.64` then `s6 ok`. Assumes all 200 requests land within the 5-minute TTL window and that every read hits; the scenario (50,000-token prefix, 500 new tokens, 200 requests) is invented and should be labelled as a scenario. Output tokens are left out on purpose because caching does not change them.

### 5.7 Tool-use orchestrator with a step cap (module structured-outputs)

```python
import json

def get_order(order_id):
    return {"order_id": order_id, "status": "shipped"}

TOOLS = {"get_order": get_order}

def run(call_model, user_msg, max_steps=5):
    messages = [{"role": "user", "content": user_msg}]
    for _ in range(max_steps):
        reply = call_model(messages)
        messages.append({"role": "assistant", "content": reply["content"]})
        calls = [b for b in reply["content"] if b["type"] == "tool_use"]
        if not calls:
            return reply["content"][0]["text"], messages
        results = []
        for c in calls:                           # one result per call, matched by id
            fn = TOOLS.get(c["name"])
            try:
                out = json.dumps(fn(**c["input"])) if fn else f"unknown tool {c['name']}"
                is_error = fn is None
            except Exception as e:                # return the error to the model instead of crashing
                out, is_error = f"{type(e).__name__}: {e}", True
            results.append({"type": "tool_result", "tool_use_id": c["id"],
                            "content": out, "is_error": is_error})
        messages.append({"role": "user", "content": results})
    raise RuntimeError(f"stopped after {max_steps} steps without a final answer")

script = iter([
    {"content": [{"type": "tool_use", "id": "t1", "name": "get_order", "input": {"order_id": "A7"}}]},
    {"content": [{"type": "text", "text": "Order A7 has shipped."}]},
])
answer, msgs = run(lambda m: next(script), "Where is order A7?")
assert answer == "Order A7 has shipped."
assert msgs[2]["content"][0]["tool_use_id"] == "t1"

looping = lambda m: {"content": [{"type": "tool_use", "id": "x", "name": "get_order", "input": {"order_id": "A7"}}]}
try:
    run(looping, "loop", max_steps=3)
    raise AssertionError("expected a stop")
except RuntimeError as e:
    assert "3 steps" in str(e)
print("s7 ok")
```

Output: `s7 ok`. Block shapes follow Claude's `tool_use` and `tool_result` naming; with OpenAI Responses the equivalents are `function_call` and `function_call_output` keyed by `call_id`.

### 5.8 Why prompt order changes the cache key (module context-engineering)

```python
import hashlib, json

def prefix_key(tools, system, messages):
    # caches match on an exact prefix: tools, then system, then messages
    blob = json.dumps({"tools": tools, "system": system}, sort_keys=False) + json.dumps(messages[:-1])
    return hashlib.sha256(blob.encode()).hexdigest()[:12]

tools = [{"name": "search"}, {"name": "fetch"}]
system = "You are a support agent. Policies: ..."
turns = [{"role": "user", "content": "hi"}, {"role": "assistant", "content": "hello"}]

a = prefix_key(tools, system, turns + [{"role": "user", "content": "q1"}])
b = prefix_key(tools, system, turns + [{"role": "user", "content": "q2"}])
c = prefix_key(tools, f"Today is 2026-10-28. {system}", turns + [{"role": "user", "content": "q2"}])
d = prefix_key(list(reversed(tools)), system, turns + [{"role": "user", "content": "q2"}])
assert a == b            # only the last user turn changed: prefix reusable
assert c != b            # a timestamp at the top of the system prompt busts the prefix
assert d != b            # reordering tool definitions busts it too
print("s8 ok")
```

Output: `s8 ok`. This is a teaching model of exact-prefix matching, not how any provider computes its cache key; OpenAI routes on a hash of initial tokens and Claude checks block-level breakpoints with a 20-block lookback.

## 6. Source list

Provider docs and specs (all checked 2026-10-28):

1. https://developers.openai.com/api/docs/guides/migrate-to-responses
2. https://developers.openai.com/api/docs/guides/prompt-caching
3. https://developers.openai.com/api/docs/guides/structured-outputs
4. https://developers.openai.com/api/docs/guides/function-calling
5. https://developers.openai.com/api/docs/guides/rate-limits
6. https://developers.openai.com/api/docs/guides/reasoning
7. https://developers.openai.com/api/docs/pricing
8. https://github.com/openai/openai-python
9. https://platform.claude.com/docs/en/about-claude/models/overview
10. https://platform.claude.com/docs/en/about-claude/pricing
11. https://platform.claude.com/docs/en/build-with-claude/prompt-caching
12. https://platform.claude.com/docs/en/build-with-claude/batch-processing
13. https://platform.claude.com/docs/en/build-with-claude/extended-thinking
14. https://platform.claude.com/docs/en/build-with-claude/structured-outputs
15. https://platform.claude.com/docs/en/build-with-claude/streaming
16. https://platform.claude.com/docs/en/build-with-claude/citations
17. https://platform.claude.com/docs/en/build-with-claude/context-editing
18. https://platform.claude.com/docs/en/build-with-claude/compaction
19. https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices
20. https://platform.claude.com/docs/en/api/rate-limits
21. https://platform.claude.com/docs/en/api/errors
22. https://platform.claude.com/docs/en/api/migration-2026-10-21
23. https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/python
24. https://ai.google.dev/gemini-api/docs/caching
25. https://ai-sdk.dev/docs/reference/ai-sdk-core/generate-text
26. https://vercel.com/blog/ai-sdk-7
27. https://www.langchain.com/blog/langchain-langgraph-1dot0
28. https://docs.langchain.com/oss/python/langchain/agents
29. https://docs.langchain.com/oss/python/langchain/structured-output
30. https://docs.litellm.ai/docs/routing
31. https://docs.litellm.ai/docs/proxy/reliability
32. https://pydantic.dev/docs/validation/latest/concepts/json/
33. https://gorilla.cs.berkeley.edu/leaderboard.html
34. https://github.com/anthropics/prompt-eng-interactive-tutorial

Engineering posts and papers (checked 2026-10-28):

35. https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
36. https://www.anthropic.com/engineering/writing-tools-for-agents
37. https://www.anthropic.com/engineering/building-effective-agents
38. https://www.langchain.com/blog/context-engineering-for-agents
39. https://www.trychroma.com/research/context-rot
40. https://arxiv.org/abs/2408.02442
41. https://blog.dottxt.ai/say-what-you-mean.html
42. https://arxiv.org/abs/2307.03172
43. https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/
44. https://builder.aws.com/content/3EumjoZascWd1oZiEgL8ORlv3qE/timeouts-retries-and-backoff-with-jitter
45. https://aishippingblog.com/p/what-1000-job-descriptions-reveal
46. https://simonwillison.net/2025/Mar/11/responses-vs-chat-completions/ (search only, not opened)

Interview sources (checked 2026-10-28):

47. https://github.com/amitshekhariitbhu/ai-engineering-interview-questions
48. https://github.com/llmgenai/LLMInterviewQuestions
49. https://raw.githubusercontent.com/ombharatiya/ai-system-design-guide/main/00-interview-prep/01-question-bank.md (only the first 100,000 characters of the file were read)
50. https://careery.pro/blog/ai-careers/ai-engineer-interview-questions
51. https://www.aced.io/blog/ai-engineer-interview-questions
52. https://www.aced.io/experiences/sierra-ai-senior-ai-engineer-interview-087f4e
53. https://www.aced.io/experiences/anthropic-machine-learning-engineer-interview-27873a
54. https://www.aced.io/blog/anthropic-interview-process (no API-specific questions found; listed for completeness)
55. https://www.techinterview.org/post/3233476824/ai-engineer-interview-rag-agents-evals/
56. https://www.techinterview.org/post/3233474915/openai-interview-process-2026-team-by-team/ (no API-specific questions found; listed for completeness)
57. https://www.techinterview.org/companies/decagon-interview-guide/
58. https://www.techinterview.org/companies/perplexity/
59. https://getperspective.ai/blog/anthropic-applied-ai-engineer-interview-process-frontier-lab-2026/markdown
60. https://prachub.com/interview-questions/design-and-implement-a-rate-limiter-with-an-ai-assistant-then-defend-and-test-it
61. https://www.teamblind.com/post/anthropic-applied-ai-product-engineer-interview-8bqjbuwx
