# Track 8: AI system design (`system-design`)

Research notes for the lessons and problem bank of the AI system design track. Modules, in SPEC order: `framework`, `capacity`, `case-retrieval`, `case-agents`, `case-realtime`.

All pages were checked on 2026-10-28 unless a row says otherwise. Source keys like [S12] point to the numbered list in section 6, which carries the URL for each. Vendor prices change often and several 2026 prices below are promotional with an end date; lessons must print the "checked" date next to any price and should pass prices into calculators as inputs, not constants.

Evidence grades used below:

- **primary**: vendor documentation, spec, paper, model card, or the company's own engineering post.
- **secondary**: prep sites, aggregators, community repos. Used only for interview questions and for framing, never for a number a lesson relies on.
- **unsourced**: something the brief or common interview lore asserts that I could not trace to a source. Flagged explicitly; do not print as fact.

---

## 1. Verified facts per module

### 1.1 `framework`: delivery framework and rubric

| Fact | Value | Source | Grade |
|---|---|---|---|
| Hello Interview's delivery framework for a general system design round | Requirements (~5 min), core entities (~2 min), API or system interface (~5 min), optional data flow (~5 min), high-level design (~10 to 15 min), deep dives (~10 min) | [S37] | secondary (prep site, but the framework most candidates have seen) |
| SPIDER framework for AI design rounds, 43 of 45 minutes | Scope 5, Prioritize 3, Initial architecture 10, Deep dive 15, Evaluation and observability 5, Reliability and scale 5 | [S60] | secondary (MIT-licensed community guide, refreshed October 2026) |
| What 2026 interviewers grade, per one prep site | "Cost and operations have changed from bonus points to explicit evaluation criteria in system design interviews." | [S68] | secondary |
| AI-era prompts listed for 2026 general SWE loops | "Design an LLM inference API", "Design a RAG system over enterprise documents", "Design a model serving platform", "Design AI agent infrastructure" | [S66] | secondary |
| Anthropic design round focus, per candidate reports | The onsite includes "System design for a multi-tenant Claude deployment"; the round "increasingly focuses on evaluation harnesses, not RAG architecture" | [S69] | secondary, unverified candidate reports, published 2026-05-29 |
| An eval set can start small | Anthropic's research-agent team began with "a set of about 20 queries representing real usage patterns" | [S26] | primary, 2025-06-13 |
| The four rubric names in `brief.json` (problem navigation, solution design, technical excellence, communication) | **Could not source.** The Hello Interview delivery page [S37] does not list them. Present them in the lesson as Inferview's own rubric, not as any company's. | none | unsourced |
| "800 ms latency target" | Appears as an example target in a 2026 interview write-up [S63]. It is an interview convention, not a measured human threshold. For voice, ElevenLabs states a P50 time-to-first-audio target under 800 ms and P95 under 1.5 s [S14]. | [S63], [S14] | secondary / primary (vendor framing) |

Framework content worth teaching (all sourced):

- **Ask for the source of truth and the action boundary early.** Agent prompts ("can refund money", "takes actions on behalf of a user") change the design more than scale does. The Sierra and Anthropic prompts in section 3 are all of this shape.
- **Name the eval plan before the architecture is finished.** Candidate reports say Anthropic's round weights evaluation harnesses [S69]; techinterview's sample prompt is "how do you know it's helping and not making things worse" [S63].
- **Token economics are part of requirements.** Agents use about 4x the tokens of chat and multi-agent systems about 15x [S26]; output tokens cost 5x input on several current price lists (for example $2 in and $10 out per million tokens on Claude Sonnet 5 and gpt-6.1-sol) [S1], [S2].

### 1.2 `capacity`: capacity and cost workshop

#### Prices checked 2026-10-28 (USD per million tokens)

Anthropic [S1]:

| Model | Input | 5-min cache write | 1-hour cache write | Cache hit | Output |
|---|---|---|---|---|---|
| Claude Fable 5.1 | 10 | 12.50 | 20 | 0.25 (0.025x) | 50 |
| Claude Opus 5.5 | 4 | 5 | 8 | 0.20 (0.05x) | 20 |
| Claude Opus 5 / 4.8 / 4.7 / 4.6 / 4.5 | 5 | 6.25 | 10 | 0.50 | 25 |
| Claude Sonnet 5.5 | 2 | 2.50 | 4 | 0.10 (0.05x) | 10 |
| Claude Sonnet 5 | 2 | 2.50 | 4 | 0.20 | 10 |
| Claude Sonnet 4.6 / 4.5 | 3 | 3.75 | 6 | 0.30 | 15 |
| Claude Haiku 5.5, prompt up to 100,000 tokens | 0.10 | 0.125 | 0.20 | 0.01 | 0.50 |
| Claude Haiku 5.5, prompt over 100,000 tokens | 0.50 | 0.625 | 1 | 0.05 | 2.50 |
| Claude Haiku 4.5 | 1 | 1.25 | 2 | 0.10 | 5 |

Other Anthropic pricing facts [S1]:

- Cache multipliers: 5-minute write 1.25x base input, 1-hour write 2x, read 0.1x (0.05x on Opus 5.5 and Sonnet 5.5, 0.025x on Fable 5.1 and Mythos 5.1). The page states a 5-minute cache pays off after one read and a 1-hour cache after two.
- Batch API: 50 percent off input and output. Batch and caching discounts stack.
- Long context: Claude 4.6 and later (except Haiku 5.5) bill the full 1M-token window at standard rates ("A 900k-token request is billed at the same per-token rate as a 9k-token request"). Haiku 5.5 switches to the higher price for the whole request once the prompt passes 100,000 tokens, cache reads included.
- Data residency: `inference_geo: "us"` multiplies every token category by 1.1x on Claude 4.6 and later.
- Tokenizer: Claude 4.7 and later "produces approximately 30% more tokens for the same text". A token count measured on Sonnet 4.6 under-counts the same prompt on newer models.
- Tool use adds a hidden system prompt: 286 tokens on Opus 5.5 and Sonnet 5.5 with `tool_choice` auto, 497 on Sonnet 4.6. Declaring `computer_toolset_20260801` adds about 4,500 input tokens and `browser_toolset_20260801` about 6,600.
- Web search: $10 per 1,000 searches plus the tokens of the results.
- Fast mode: Opus 5.5 at $8 in / $40 out; not available with Batch.

OpenAI [S2] (standard tier, prompts up to 272K input tokens):

| Model | Input | Cached input | 30-min cache write | 12-hour cache write | Output |
|---|---|---|---|---|---|
| gpt-6-astra | 10.00 | 1.00 | 12.50 | 25.00 | 50.00 |
| gpt-6.1-sol | 2.00 | 0.10 | 2.50 | 5.00 | 10.00 |
| gpt-6.1-terra | 1.00 | 0.05 | 1.25 | 2.50 | 5.00 |
| gpt-6-luna | 0.10 | 0.01 | 0.125 | 0.25 | 0.50 |
| gpt-5.4-mini | 0.75 | 0.075 | not listed | not listed | 4.50 |
| gpt-5-mini | 0.25 | 0.025 | not listed | not listed | 2.00 |

Other OpenAI pricing facts [S2], [S38]:

- Above 272K input tokens the long-context rate applies; for the listed models input roughly doubles (gpt-6.1-sol: $4.00 in, $0.20 cached, $15.00 out).
- Batch and Flex list 50 percent of Standard; Fast lists about 2x Standard (ratio computed from the table; the page does not state a percentage). Priority processing was renamed Fast on 2026-07-30.
- Regional (data residency) endpoints carry a 10 percent uplift for models released on or after 2026-03-05.
- `text-embedding-3-small` $0.02, `text-embedding-3-large` $0.13; `omni-moderation-latest` is free.
- Changelog [S38]: 12-hour prompt caching added 2026-10-20 at 2.5x the input price for writes; `prompt_cache_retention` defaults to 24h for non-ZDR organizations since 2026-05-29.

Google Gemini [S3] (paid tier, standard):

- `gemini-3.8-flash`: $0.75 in / $3.75 out through 2026-12-31, then $1.50 / $7.50 from 2027-01-01. Output price includes thinking tokens.
- `gemini-4-argon`: $2.00 / $10.00 through 2026-11-30, then $4.00 / $20.00 from 2026-12-01. Implicit caching only.
- `gemini-3.5-flash-lite`: $0.30 in / $2.50 out.
- **Reviewer note:** two of these prices change within weeks of the check date. Any lesson that quotes them must show the end date or use a later-dated price.

#### Caching mechanics that change capacity math

- Anthropic [S4]: minimum cacheable prefix is 512 tokens on the 5.x models, 1,024 on Opus 4.8 and Sonnet 5 / 4.6 / 4.5, 4,096 on Opus 4.6 / 4.5 and Haiku 4.5. Up to 4 breakpoints. The lookback checks "at most 20 positions for each breakpoint". The cache hierarchy is tools, then system, then messages: a change to tool definitions invalidates everything after it. "Different organizations never share caches", and caches are isolated per workspace on the Claude API.
- OpenAI [S5]: minimum cacheable prompt 1,024 tokens for GPT-5.6 and later; earlier models round cached tokens down to multiples of 128. On earlier models routing uses a hash of the prefix plus `prompt_cache_key`, and "traffic above 15 requests per minute can lead to overflow routing" for one key.
- Anthropic rate limits [S6]: "For most Claude models, only uncached input tokens count toward your ITPM rate limits." Worked example on the page: a 2,000,000 ITPM limit with an 80 percent cache hit rate processes 10,000,000 total input tokens per minute. `max_tokens` does not count toward OTPM. Limits use a token bucket; 60 RPM "might be enforced as 1 request per second". Sharp increases can trigger 429 "acceleration limits".
- Anthropic tiers [S6]: Start tier for Opus 5.5 is 1,000 RPM, 2,000,000 ITPM, 400,000 OTPM; Scale tier is 10,000 RPM, 10,000,000 ITPM, 2,000,000 OTPM. Monthly spend caps: Start $500, Build $1,000, Scale $200,000.

#### Latency vocabulary [S25]

NVIDIA's benchmarking docs define TTFT ("the time from query submission to the first received token"), inter-token latency ("the average time between consecutive tokens", also called TPOT), end-to-end latency = TTFT + generation time, ITL = (e2e latency minus TTFT) / (output tokens minus 1), and per-user TPS, which approaches 1/ITL for long outputs.

#### Hardware and model configs (for GPU-count questions)

| Item | Value | Source |
|---|---|---|
| H100 SXM | 80 GB, 3.35 TB/s, BF16 Tensor 1,979 TFLOPS and FP8 3,958 TFLOPS **with sparsity** (NVIDIA footnote), up to 700 W, NVLink 900 GB/s | [S20] |
| H100 NVL | 94 GB, 3.9 TB/s, BF16 1,671 TFLOPS with sparsity | [S20] |
| Llama 3.1 70B | 80 layers, hidden 8192, 64 attention heads, 8 KV heads (head dim 128 by division), vocab 128,256, 131,072 positions, BF16 | [S21] (ungated mirror of Meta's config; Meta's repo is gated) |
| gpt-oss-120b | 117B total, 5.1B active; 36 layers, 64 heads, 8 KV heads, head dim 64, 128 experts with 4 active, alternating sliding-window (128) and full attention; MXFP4 MoE weights; "fit into a single 80GB GPU" | [S22] |
| Qwen3-235B-A22B | 235B total, 22B active; 94 layers, 4 KV heads, head dim 128, 128 experts with 8 active; 32,768 native context, 131,072 with YaRN | [S23] |
| Qwen3-32B | 64 layers, 8 KV heads, head dim 128 | [S24] |

Derived (computed in snippet 2, section 5): Llama 3.1 70B with a BF16 KV cache holds 2 x 80 x 8 x 128 x 2 bytes = 327,680 bytes (320 KiB) per token, so one 8,192-token sequence takes 2.5 GiB.

**Could not source:** a stable public hourly price for an H100 or B200. Cloud list prices vary by provider, region and commitment; a lesson should take $/GPU-hour as an input labelled "you supply this" rather than print a number. Likewise there is no public, dated semantic-cache hit rate worth quoting; treat hit rate as a slider.

### 1.3 `case-retrieval`: enterprise search, support assistant, document pipeline, code review bot

Enterprise search with permissions:

- Microsoft states Copilot "only surfaces organizational data to which individual users have at least view permissions", and that the Semantic Index "honors the user identity-based access boundary so that the grounding process only accesses content that the current user is authorized to access" (page dated 2026-07-09) [S46]. This is the reference behaviour for "enterprise search with permissions".
- Pinecone recommends one namespace per tenant [S50]. Its own cost example: querying one 1 GB namespace among 100 tenants costs 1 read unit, while metadata filtering inside a single 100 GB namespace costs 100 read units for the same query. `$in` / `$nin` filters accept at most 10,000 values, and filtering by large lists of user IDs is called an anti-pattern. Namespaces per serverless index range from 100 (Starter) to 1,000,000 (Enterprise).
- Embedding sizes [S51]: `text-embedding-3-small` 1536 dims, `-large` 3072, both 8,192 max input tokens; the `dimensions` parameter shortens vectors; "OpenAI embeddings are normalized to length 1". Large at 256 dims outperforms ada-002 at 1536 on MTEB per the page.
- Contextual retrieval [S44] (2024-09-19, still the primary source for these numbers): contextual embeddings cut top-20 retrieval failure 35 percent (5.7 to 3.7 percent); adding contextual BM25, 49 percent (to 2.9); adding reranking, 67 percent (to 1.9). One-off cost $1.02 per million document tokens with prompt caching. For knowledge bases under 200,000 tokens the post suggests putting the whole corpus in the prompt.

Document pipeline and multimodal upload:

- Claude PDF input [S48]: 32 MB per request, 600 pages (100 when the request's context window is under 1M tokens); each page costs "1,500 to 3,000 tokens per page" of text plus image tokens, because every page is also rendered as an image.
- Gemini PDF input [S49] (page updated 2026-10-08): "Each document page is equivalent to 258 tokens"; up to 50 MB or 1,000 pages; extracted native text is not billed.

Code review bot:

- GitHub Copilot code review [S47]: reviews only when assigned unless automatic review is configured; reviews do not count toward required approvals by default; dependency manifests, lock files, logs and SVGs are excluded; instructions come from `.github/copilot-instructions.md`, path-specific `.instructions.md` files, `AGENTS.md`, and `.github/skills/`, read **from the head branch**; cost per review estimated at about $0.05 to $1 (Lite) and $0.25 to $5 (Balanced), excluding Actions minutes.
- Reviewer note (my inference from [S47], not a GitHub statement): because instructions are read from the PR's head branch, the PR author controls part of the reviewer's prompt. That is a prompt-injection surface worth raising in a code-review-bot design.

Customer-support assistant:

- tau-bench introduced pass^k, reliability over k repeated trials; GPT-4o-based agents were "quite inconsistent (pass^8 <25% in retail)" [S29] (2024-06-17).
- tau2-bench adds a dual-control setting where "both agent and user make use of tools", and reports "significant performance drops when agents shift from no-user to dual-control" [S28] (2025-06-09).

### 1.4 `case-agents`: coding agent, multi-tenant agent platform, MCP knowledge agent, policy-following support agent, eval-gated CI/CD

- Anthropic's multi-agent research system [S26] (2025-06-13): agents use "about 4× more tokens than chat interactions"; multi-agent "about 15× more tokens than chats"; the multi-agent system "outperformed single-agent Claude Opus 4 by 90.2%" on an internal research eval; on BrowseComp "token usage by itself explains 80% of the variance"; parallel tool calls "cut research time by up to 90% for complex queries"; deploys use "rainbow deployments to avoid disrupting running agents"; agents resume from checkpoints after errors.
- Context engineering [S27] (2025-09-29): compaction, structured note-taking outside the window, sub-agents with clean context returning condensed summaries, and just-in-time retrieval of identifiers instead of preloading content.
- Agent Skills [S54]: progressive disclosure in three levels. Metadata (`name` up to 64 chars, `description` up to 1,024 chars) is always loaded at about 100 tokens per skill; the `SKILL.md` body loads when triggered (under 5k tokens); bundled files load only when read and scripts return only their output. On the Claude API, skills run in a container with no network access. The doc says "Use Skills only from trusted sources".
- Claude Managed Agents [S55]: hosted agent harness (agent, environment, session, events), beta header `managed-agents-2026-04-01`; stateful by design and therefore not eligible for ZDR or HIPAA BAA coverage.
- MCP [S45]: current revision is **2026-07-28**. Versions are negotiated per request via `_meta`; `server/discover` returns versions and capabilities; revisions `2025-11-25` and earlier are the handshake-based ones. Deprecated features stay at least twelve months (ninety days under the expedited exception).
- A2A [S56]: latest released version 1.0.0; core objects Agent Card, Task, Message, Artifact; task states include INPUT_REQUIRED and AUTH_REQUIRED; bindings JSON-RPC, gRPC and HTTP+JSON. The page says A2A is joining the Agentic AI Foundation.
- LangGraph interrupts [S52]: need a checkpointer and a `thread_id`; resume with `Command(resume=...)`; on resume "the runtime restarts the entire node from the beginning", so side effects before `interrupt()` must be idempotent. Directly relevant to "an agent that can refund money".
- OpenAI Agents SDK guardrails [S53]: input guardrails run only for the first agent, output guardrails only for the agent producing the final output; input guardrails run in parallel by default, so the agent may already have used tokens or run tools before a tripwire cancels it; `run_in_parallel=False` blocks first.

### 1.5 `case-realtime`: voice, moderation, multi-tenant chat with billing, rollout, caching layers, fallback

Voice agents:

- OpenAI Realtime API GA on 2025-08-28; gpt-realtime-2.1 and 2.1 mini released 2026-07-06; dedicated SIP IP ranges 2026-01-13; GPT-Live 1 GA 2026-09-10 [S38].
- Prices [S2]: gpt-realtime-2.1 audio $32 in / $0.40 cached / $64 out; text $4 / $0.40 / $24. gpt-realtime-2.1-mini audio $10 / $0.30 / $20. GPT-Live 1 voice sessions $0.05 per minute, billed per second, backend model and tool use charged separately. Transcription: gpt-4o-transcribe $0.006/min estimated, gpt-4o-mini-transcribe $0.003/min estimated, gpt-realtime-whisper $0.017/min.
- Token accounting [S9]: user audio is "1 token per 100 ms", assistant audio "1 token per 50ms". "The entire conversation is sent to the model for each Response", so cost per turn grows with session length. `retention_ratio` below 1.0 truncates more aggressively; truncation "busts the cache near the beginning of the conversation". A GPT-Live WebRTC session bills 15 seconds at initialization.
- Turn detection [S10]: `server_vad` (silence-based; sample config threshold 0.5, prefix padding 300 ms, silence 500 ms; the page states no defaults) and `semantic_vad` (eagerness `low`, `medium`, `high`; `auto` equals medium).
- Transport [S11]: WebRTC for browsers, WebSocket for servers; browsers get an ephemeral secret from `POST /v1/realtime/client_secrets`, never the API key.
- Gemini Live [S3], [S13]: `gemini-3.8-live` audio $3.00 per million input tokens (or $0.005/min) and $12.00 output (or $0.018/min). Without context compression, audio-only sessions are limited to 15 minutes and audio-video to 2 minutes; a connection lasts about 10 minutes; resumption tokens are valid 2 hours; the server sends `GoAway` with `timeLeft`.
- Human turn-taking [S15]: across 10 languages, "an overall mode of 0 ms", per-language modes between 0 and +200 ms, overall mean +208 ms; Danish mean +469 ms, Japanese +7 ms.
- Example latency budget [S14] (ElevenLabs, published 2026-06-23, updated 2026-10-09): capture and endpointing 120 ms P50 / 280 P95, STT finalization 60 / 150, network 60 / 160, LLM TTFT 250 / 600, TTS first audio 110 / 220, player buffering 80 / 150; end-to-end about 680 ms P50, 1,560 ms P95. "Overlapping stages, rather than running them in series, recovers most of the budget."
- LiveKit [S16]: the audio turn-detector model is on by default in `AgentSession`; after a false interruption the agent resumes where it left off by default.
- OpenAI's voice-agent guide [S12] frames the choice as speech-to-speech (one session handles audio turns, tools and interruptions) versus a chained STT, agent, TTS pipeline used "when each stage needs to be visible or replaceable", which also yields text for policy checks before the agent replies. It gives no latency comparison; do not invent one.

Moderation:

- OpenAI `omni-moderation-latest` [S32]: free; text and images, not audio; 13 categories, 7 of them text-only; returns `flagged`, `categories`, `category_scores`, `category_applied_input_types`; "custom policies that rely on `category_scores` may need recalibration over time" because the model is upgraded in place.
- Llama Guard 4 [S35]: 12B dense, multimodal, MLCommons hazard taxonomy S1 to S14 (S14 code interpreter abuse, text only). Meta found "input filtering reduces safety violation rate and raises overall refusal rate more than output filtering does"; categories like defamation, IP and elections need up-to-date knowledge and "more complex systems". The card shows no release date.
- gpt-oss-safeguard [S33], [S34] (technical report dated 2025-10-29): policy-as-input reasoning classifier, 20b (fits 16 GB) and 120b, Apache 2.0. Limitations, quoted from the report: "classifiers trained on tens of thousands of high-quality labeled samples can still perform better", and it "can be time and compute-intensive". OpenAI uses smaller classifiers to pick what to assess and sometimes runs the reasoner asynchronously.
- Constitutional Classifiers [S30] (2025-02-03): jailbreak success 86 percent without, 4.4 percent with; 0.38 percent higher refusals; 23.7 percent more compute. Next generation [S31] (2026-01-09): two-stage cascade where a linear probe on activations screens all traffic and escalates to a probe plus exchange-classifier ensemble; about 1 percent compute overhead on Opus 4.0 traffic and 0.05 percent refusals on harmless queries over a month of Sonnet 4.5 traffic.
- Hello Interview's harmful-content breakdown uses Facebook post moderation as its subject and a two-stage lightweight-then-heavy cascade [S36]. It does not say Facebook asks the question.

Multi-tenant chat backend with conversation state and billing:

- OpenAI conversation state [S39]: manual history, `previous_response_id`, or the Conversations API (released 2025-08-20 [S38]). Response objects are kept 30 days by default (`store: false` opts out); conversation objects are not subject to that TTL. With `previous_response_id`, all previous input tokens in the chain are billed as input again.
- Anthropic usage fields [S6]: `total_input_tokens = cache_read_input_tokens + cache_creation_input_tokens + input_tokens`; `input_tokens` counts only tokens after the last cache breakpoint. Billing code that reads only `input_tokens` under-bills cached traffic.
- Stripe meters [S40], [S41]: aggregation `sum`, `count` or `last`; raw or pre-aggregated ingestion; events processed asynchronously; meter-event cancellations only within 24 hours; Stripe now recommends Metronome for new usage-based integrations.
- OpenTelemetry GenAI conventions moved to their own repository [S42]; the old spec page "is no longer maintained in this repository". The new repo's README showed no stability level on the check date. Lessons should link the repo, not quote attribute names from memory.

Model rollout and A/B:

- Anthropic deprecations [S8]: at least 60 days' notice before retirement; requests to retired models fail. Example: `claude-sonnet-4-5-20250929` deprecated 2026-09-30, retiring 2026-11-30.
- API-version breakage [S8], [S7]: API version `2026-10-21` removes `temperature`, `top_p` and `top_k` (400 error); Claude 4.6 and later reject assistant-message prefill; Claude 4.7 and later reject `thinking: {"type": "enabled"}`. A model swap is also a request-shape change.
- Rainbow deployments for long-running agents [S26].

Caching layers:

- Exact versus semantic [S18] (Redis LangCache): a semantic cache "gives up the guarantee that a cache hit is always correct"; default similarity threshold 0.85, suggested start 0.8 to 0.9; start tight and loosen while spot-checking. RedisVL uses a distance threshold where lower is stricter, so "threshold" points in opposite directions in two Redis products.
- vCache [S17] (v1 2025-02-06, v5 2026-02-21): argues a single static similarity threshold has no correctness guarantee; learns a per-entry threshold with a user-set error bound; reports up to 12.5x higher hit rate and 26x lower error than static baselines.
- Serving-layer prefix cache [S19] (vLLM): block hash = parent hash + block tokens + extra keys (LoRA id, multimodal hashes); only full blocks cached; LRU eviction; default hash sha256; `cache_salt` scopes reuse to a trust group and is documented as a defence against timing attacks that infer cached content from latency.

Fallback and degradation:

- Anthropic errors [S7]: 429 `rate_limit_error`, 500 `api_error`, 504 `timeout_error`, 529 `overloaded_error` ("high traffic across all users"). SDKs retry transient failures twice by default with exponential backoff, honouring `retry-after`. Errors can arrive mid-stream after a 200. Messages request limit 32 MB, Batch 256 MB.
- Spend-cap 429s carry no `retry-after` and keep failing until the next month [S6], so a retry loop cannot fix them.
- LiteLLM router [S43]: default routing `simple-shuffle`; cooldown after `allowed_fails` = 3 with `cooldown_time` = 5 s; `max_fallbacks` default 5; rate-limit errors back off exponentially, generic errors retry immediately.
- AWS Builders' Library [S70] (Jacob Gabrielson, 2019-12-05; cited for the argument, not as a 2025/2026 development): rarely exercised fallback paths fail when needed and can amplify outages; convert fallback into failover that runs continuously, or improve the primary path.

---

## 2. Latest developments that 2026 interviews ask about

Each row has a primary source dated 2025 or 2026 (dates from the page or the vendor changelog).

| Topic | What changed and why a design answer should mention it | Source | Date |
|---|---|---|---|
| Delivery framework for AI rounds | Evaluation and reliability get their own timed phases (SPIDER) and cost is graded explicitly. Primary anchor: Anthropic's own practice of starting evals with about 20 real queries and using rainbow deploys. | [S26], [S60], [S68] | 2025-06-13 |
| Context engineering | Compaction, note files and sub-agents are now standard answers to "the conversation outgrows the window". | [S27] | 2025-09-29 |
| Cache-aware capacity | Provider caches have tiered TTLs (Anthropic 5 min / 1 h; OpenAI 30 min / 12 h with 2.5x write) and cheaper reads on the newest models (0.05x, 0.025x). Cached reads do not count toward Anthropic ITPM. | [S1], [S2], [S6], [S38] | 2026-10-20 (OpenAI 12 h) |
| Long-context pricing split | Anthropic bills 1M context flat on 4.6 and later; OpenAI roughly doubles input above 272K; Haiku 5.5 reprices the whole request above 100K. "Put it all in context" versus RAG is now a per-vendor pricing question. | [S1], [S2] | checked 2026-10-28 |
| Fast and priority tiers | OpenAI Fast (renamed from Priority 2026-07-30) at about 2x; Anthropic fast mode on Opus 5.5 at 2x. Latency can be bought, which changes the latency-versus-cost trade-off. | [S1], [S2], [S38] | 2026-07-30 |
| Enterprise search | Permission-trimmed grounding as product behaviour; namespace-per-tenant isolation in vector stores. | [S46], [S50] | 2026-07-09 |
| Customer-support agents | Dual-control evaluation (tau2-bench) and pass^k reliability; refunds need human-in-the-loop with idempotent side effects and blocking guardrails. | [S28], [S52], [S53] | 2025-06-09 |
| Agent platforms | Agent Skills (progressive disclosure), MCP 2026-07-28 (per-request version negotiation), A2A 1.0.0, hosted harnesses (Claude Managed Agents beta). | [S45], [S54], [S55], [S56] | 2026 |
| Code review bot | Whole-repo context gathering and agentic fixes in GitHub's reviewer; per-review cost estimates; instructions read from the head branch. | [S47] | checked 2026-10-28 |
| Document pipeline | Native PDF input with per-page token costs (Claude 1,500 to 3,000 text tokens plus image; Gemini 258 per page). | [S48], [S49] | 2026-10-08 (Gemini page) |
| Real-time voice | Realtime API GA, then gpt-realtime-2.1 and GPT-Live with per-minute pricing; Gemini 3.8 Live with session and connection limits; semantic VAD. | [S38], [S2], [S13], [S10] | 2025-08-28 to 2026-09-10 |
| Moderation | Policy-as-prompt reasoning classifiers (gpt-oss-safeguard) next to trained classifiers; cascade architectures at about 1 percent overhead. | [S34], [S31] | 2025-10-29, 2026-01-09 |
| Multi-tenant chat and billing | Server-side conversation objects; cache-aware usage fields; Stripe steering new usage billing to Metronome. | [S39], [S6], [S41] | 2025-08-20 (Conversations API) |
| Model rollout | 60-day deprecation windows; API version 2026-10-21 removes sampling parameters; thinking-parameter changes across model generations. | [S8], [S7] | 2026-10-21 |
| Caching layers | Verified semantic caching with error bounds; tenant-salted prefix caches. | [S17], [S19] | 2026-02-21 (vCache v5) |
| Fallback and degradation | Spend-cap 429s without `retry-after`; mid-stream errors after a 200; router cooldowns and fallback caps. | [S6], [S7], [S43] | checked 2026-10-28 |

---

## 3. Interview questions collected

40 questions. "Company" is filled only when the source names the company next to that question. Difficulty is my judgment from the scope of the prompt; no source assigns difficulty. Several sources are prep sites that aggregate unverified candidate reports; section 6 notes this per source.

| # | Question (as worded in the source, lightly trimmed) | Type | Difficulty | Source | Company named by source |
|---|---|---|---|---|---|
| Q1 | Design a support assistant. How do you know it's helping and not making things worse? | design | medium | [S63] | none (Anthropic named only for loop structure) |
| Q2 | You have a 200-page PDF and a question. What happens between enter and the answer? | concept | easy | [S63] | none |
| Q3 | How do you cap tool calls and spend per request so one runaway session can't cost fifty dollars? | concept | medium | [S63] | none |
| Q4 | How would you define success metrics for an AI-oriented feature or product? | concept | medium | [S67] | Perplexity |
| Q5 | Design a system for an LLM responding to user queries. | design | medium | [S68] | Google |
| Q6 | Design the OpenAI Playground. | design | medium | [S67], [S68] | OpenAI |
| Q7 | Design a batch inference API for a GPU cluster. | design | hard | [S68] | Anthropic |
| Q8 | Design an inference batching system for a single GPU handling up to 100 inputs per batch while users wait synchronously. | design | hard | [S67] | Anthropic |
| Q9 | Design an API that lets users sample from large language models efficiently, with good batching and request orchestration. | design | hard | [S67] | Anthropic |
| Q10 | Design an insurance-claims agent that ingests claims and outputs an approval decision using RAG, with infra and storage choices and LLM token cost control. | design | hard | [S67] | Scale AI |
| Q11 | Design an agentic AI system to power customer support for Spotify. | design | hard | [S67] | Sierra |
| Q12 | Design an AI system that integrates with a third-party company's data and workflows. | design | hard | [S67] | Sierra |
| Q13 | Design a file uploader for an AI chat app that handles large multimodal uploads and feeds them into a model's context. | design | medium | [S67] | xAI |
| Q14 | Design a document processing pipeline that ingests and indexes large volumes of heterogeneous documents for LLM use. | design | medium | [S67] | Databricks |
| Q15 | A deployed conversational model gives confident but factually wrong answers in high-risk contexts. How would you investigate and mitigate it? | debug | hard | [S67] | Anthropic (ML engineer loop) |
| Q16 | Design a real-time voice AI application. | design | hard | [S67] | none |
| Q17 | Design an agentic AI system that can autonomously adapt to new tasks. | design | hard | [S68] | Anthropic |
| Q18 | Design a customer-support chatbot on a third-party LLM (rate limits, fallback, state). | design | medium | [S68] | none |
| Q19 | Design safeguards for an AI system that takes actions on behalf of a user. | design | hard | [S68] | none |
| Q20 | System design for a multi-tenant Claude deployment, focused on the evaluation harness. | design | hard | [S69] | Anthropic (unverified candidate reports) |
| Q21 | Design a multi-tenant chat backend: conversation state, content moderation pipeline, billing for token-based pricing. | design | hard | [S64] | OpenAI (Applied track focus areas; the page lists topics, not a verbatim prompt) |
| Q22 | Design an enterprise RAG assistant over 10M documents with per-user permissions. | design | hard | [S57] | none |
| Q23 | Design a real-time AI transcription system for concurrent audio streams. | design | medium | [S57] | none |
| Q24 | Design a content moderation system using AI. | design | medium | [S57] | none |
| Q25 | Design a multi-tenant AI chatbot platform where each business gets a custom chatbot. | design | hard | [S57] | none |
| Q26 | Design an AI gateway/proxy for managing LLM access across an organization. | design | medium | [S57] | none |
| Q27 | How do you implement caching strategies for LLM applications? | concept (fits mcq) | medium | [S57] | none |
| Q28 | How do you approach capacity planning for an AI system? | estimate | medium | [S57] | none |
| Q29 | How do you estimate the cost of running an AI-powered feature in production? | estimate | easy | [S57] | none |
| Q30 | Your LLM endpoint's p99 latency doubled after a deploy with no model change. How do you diagnose it? | debug | medium | [S57] | none |
| Q31 | Your application is hitting LLM provider rate limits during peak hours. How do you handle it? | debug | medium | [S57] | none |
| Q32 | One LLM provider outage took down your entire system. How do you eliminate single points of failure? | design | medium | [S57] | none |
| Q33 | How do you implement A/B testing for LLM systems? | concept | medium | [S57] | none |
| Q34 | How do you roll out new model versions without breaking existing prompts? | concept | medium | [S65] | none |
| Q35 | Design a code-review tool that uses an LLM to suggest improvements. (Whiteboard variant: 50,000 PRs/day, review ready about 2 minutes after PR creation.) | design | medium | [S65], [S62] | none |
| Q36 | Real-time content moderation: 1 million posts/day, under 500 ms before posts are visible, 10 languages. | design / estimate | hard | [S62] | none |
| Q37 | Enterprise RAG: 10M documents, 50,000 employees, p95 under 3 seconds, English/Spanish/Mandarin, 35 minutes. | design | hard | [S62] | none |
| Q38 | Design an LLM inference API. | design | hard | [S66] | none |
| Q39 | Harmful content detection for a social network's posts (Facebook post moderation as the worked subject). | design | medium | [S36] | none (Facebook is the subject, not named as asking) |
| Q40 | Your LLM costs are too high in production. How do you reduce costs without degrading quality? | debug | medium | [S57] | none |

Notes on the pool:

- No public source gave an AI-system-design **mcq** or **code** question verbatim. The recommended mcq is a conversion of Q27. SPEC section 7 does not require a code problem for this track; snippet 7 (token bucket) or snippet 8 (layered cache) can back one if the bank wants it.
- Q7, Q8, Q9 and Q38 overlap the `inference` track. Keep them there unless the inference bank is short.
- No source in this pool names a company for a voice-agent design question.
- Also consulted and consistent with the pool, without adding new wording: the case-study list in [S58], the design scenarios in [S59] (support chatbot, document pipeline, enterprise RAG, code assistant, moderation), and the seven GenAI case types in [S71]. None of them names a company for a question.

### Recommended for the problem bank (15), with core flags (11 core, matching SPEC section 7)

| Slot | Based on | Module | Type | Difficulty | Core | Why this one |
|---|---|---|---|---|---|---|
| sys-001 | Q1 | framework | design | medium | yes | Exercises the whole framework; "how do you know it helps" forces an eval plan |
| sys-002 | Q4 | framework | concept | medium | yes | Company-attributed (Perplexity); success metrics plus guardrail metrics |
| sys-003 | Q29 (+Q40) | capacity | estimate | easy | yes | 1M queries/day cost with and without prefix caching; snippet 1 gives the accepted band |
| sys-004 | Q28 | capacity | estimate | medium | yes | Traffic to concurrency to replicas with Little's law; snippets 2 and 3 |
| sys-005 | Q30 | capacity | debug | medium | yes | Trace shows the cache hit rate collapsed after a template change put a timestamp first |
| sys-006 | Q22 (+Q37) | case-retrieval | design | hard | yes | Permission-trimmed retrieval, namespaces versus filters, index sizing (snippet 4) |
| sys-007 | Q10 | case-retrieval | design | hard | yes | Company-attributed (Scale AI); heterogeneous documents plus token cost control |
| sys-008 | Q11 | case-agents | design | hard | yes | Company-attributed (Sierra); policy tools, refunds behind interrupts, pass^k evals |
| sys-009 | Q20 (+Q25) | case-agents | design | hard | yes | Company-attributed (Anthropic, unverified reports); multi-tenant isolation plus eval harness |
| sys-010 | Q16 | case-realtime | design | hard | yes | Speech-to-speech versus chained pipeline, latency budget, cost per minute (snippets 5 and 6) |
| sys-011 | Q24 (+Q36, Q39) | case-realtime | design | medium | yes | Cascade of cheap and expensive classifiers, thresholds, appeals, recalibration |
| sys-012 | Q21 | case-realtime | design | hard | no | Company-attributed topic (OpenAI); conversation state, metering, idempotent usage events |
| sys-013 | Q34 (+Q33) | case-realtime | concept | medium | no | Pinning, shadow traffic, deterministic bucketing (snippet 10), deprecation windows |
| sys-014 | Q27 | capacity | mcq | medium | no | Which change keeps the prefix cache warm; tenant-scoped semantic cache keys |
| sys-015 | Q31 (+Q32) | case-realtime | debug | medium | no | Retry storm on 429s plus a spend-cap 429 that never recovers; breaker and failover |

Alternates if a slot fails review: Q35 (code review bot, case-agents, design), Q14 (document pipeline, Databricks, design), Q3 (spend caps, concept), and a `code` problem built on snippet 7.

Type coverage of the 15: design 8 (SPEC needs at least six), estimate 2, debug 2, concept 2, mcq 1. Module coverage: framework 2, capacity 4, case-retrieval 2, case-agents 2, case-realtime 5. If the lesson writer wants case-agents heavier, swap sys-013 for Q35.

---

## 4. Misconceptions and gotchas for lesson review

1. **"Caching always saves money."** A cache write costs 1.25x (5 min) or 2x (1 h) on Anthropic [S1] and 1.25x (30 min) or 2.5x (12 h) on OpenAI's newest models [S2], [S38]. With a 0.1x read and a 1.25x write, a 5-minute cache breaks even at about a 22 percent hit rate (1.25 minus 1.15h = 1 gives h of about 0.217); snippet 1 shows a 20 percent hit rate costing more than no cache.
2. **"Cache reads are 10 percent of input."** Not on the newest models: 0.05x on Opus 5.5 and Sonnet 5.5, 0.025x on Fable 5.1 [S1]; 0.05x on gpt-6.1-sol and gpt-6.1-terra [S2]. Quote the multiplier with the model.
3. **Volatile content at the top of the prompt** (timestamps, user names, experiment flags) busts the prefix cache on every request. Anthropic's hierarchy is tools, then system, then messages, and a tool-definition change invalidates all three [S4].
4. **Token counts transfer between models.** Claude 4.7 and later produce about 30 percent more tokens for the same text [S1]. Re-measure after a model change.
5. **`input_tokens` is total input.** On Anthropic it is only the tokens after the last cache breakpoint [S6]; billing code must sum all three fields.
6. **`previous_response_id` makes history free.** All prior input in the chain is billed again [S39]. The same holds for Realtime, where "the entire conversation is sent to the model for each Response" [S9].
7. **Rate limits are only RPM.** Anthropic enforces RPM, ITPM and OTPM separately, as a token bucket, with short-interval enforcement and acceleration limits [S6]. Cached reads do not count toward ITPM on most models, so caching raises effective throughput as well as cutting cost.
8. **"Retrying fixes a 429."** A spend-cap 429 has no `retry-after` and keeps failing until the month rolls over [S6]; a 529 is provider-wide overload [S7]. Retrying both without a breaker multiplies load.
9. **Fallback is free reliability.** An untested fallback path can make an outage worse [S70]; routers need cooldowns and fallback caps [S43]. A secondary model also changes quality, so label degraded responses and evaluate the fallback path too.
10. **Streaming makes the model faster.** "Streaming does not make the model faster; it simply starts outputting to the user while it is still generating" [S14]. It improves perceived latency, not cost or total time.
11. **Voice latency is the sum of stage averages.** Stages overlap in a good pipeline, and P95 is what users notice; the ElevenLabs table goes from about 680 ms at P50 to 1,560 ms at P95 [S14]. A design that quotes only P50 is incomplete.
12. **"Humans reply in 200 ms, so the bot must too."** Stivers et al. report a mean of +208 ms and a mode of 0 ms, with language means from +7 ms to +469 ms [S15]. Use it to explain why voice agents feel slow, not as an SLA.
13. **Speech-to-speech removes the need for transcripts.** The chained pipeline exists to inspect or transform intermediate text and run policy checks [S12]; speech-to-speech designs still need a transcript path for audit and moderation.
14. **A semantic cache hit is a correct answer.** A semantic cache "gives up the guarantee that a cache hit is always correct" [S18]; static thresholds carry no error guarantee [S17]. Personalised or account-specific answers must not come from a shared semantic cache, and keys must include tenant and model version (snippet 8).
15. **Shared prefix caches are harmless across tenants.** Provider caches are isolated per organization and workspace [S4]; in self-hosted vLLM, cross-tenant prefix reuse is a timing side channel unless `cache_salt` is used [S19].
16. **Multi-tenancy is a `tenant_id` filter.** Post-retrieval filtering and unscoped cache keys leak data [S61]; Pinecone documents namespace-per-tenant for isolation and cost [S50].
17. **Moderation scores are stable.** OpenAI warns that thresholds on `category_scores` may need recalibration as the model is upgraded [S32]. Pin and re-evaluate thresholds.
18. **A reasoning safety classifier beats a trained one.** OpenAI's own report says classifiers trained on tens of thousands of labeled samples can still do better, and the reasoner is compute-intensive [S34]. Cascades (cheap first, expensive on escalation) are the documented pattern [S31], [S36].
19. **Swapping the model ID is the whole migration.** API version 2026-10-21 removed sampling parameters, and newer Claude models reject prefill and the old thinking parameter [S7], [S8]. Pin model and API version and rerun evals on any change.
20. **Prices in a lesson are timeless.** Gemini 3.8 Flash and Gemini 4 Argon prices double on announced dates within weeks of this check [S3]; GPT-5.6 Sol is on promotional pricing [S2]. Print the check date.
21. **H100 "1,979 TFLOPS BF16".** NVIDIA marks that figure "with sparsity" [S20]; dense throughput is half. Decode is usually memory-bandwidth bound, so 3.35 TB/s matters more than peak FLOPS for tokens per second.
22. **KV size from attention heads.** KV bytes scale with KV heads: Llama 3.1 70B has 64 attention heads but 8 KV heads [S21]. Using 64 overstates the cache 8x.
23. **LangGraph `interrupt()` resumes at the same line.** It reruns the whole node [S52]; a refund issued before the interrupt runs twice unless it is idempotent.
24. **Input guardrails stop the agent before it acts.** In the OpenAI Agents SDK they run in parallel by default and the agent may already have called tools [S53]; use blocking mode for side-effecting agents.
25. **The four-part rubric is "the" big-tech rubric.** No source found; present it as Inferview's rubric (section 1.1).
26. **Interview prompts attributed to companies are confirmed.** Every company tag in section 3 comes from prep sites that aggregate candidate reports ([S67], [S68], [S69], [S64]); none is a company's own statement. The `companies` field in problem frontmatter should link those pages and the lesson should not say "Company X asks".

---

## 5. Runnable Python snippets

All snippets use the standard library only, so they run in Pyodide. Each was run with Python 3.12.6 on 2026-10-28 using `python -I`; the printed output follows each listing (status: verified). Prices inside them are the 2026-10-28 values from section 1 and must be passed in or updated by the lesson.

### Snippet 1. Daily cost with a cached prefix (capacity; backs sys-003 and gotcha 1)

```python
# Daily cost of an LLM feature with a cached shared prefix.
# Prices are USD per million tokens; pass them in so the numbers stay dated.
def daily_cost(queries_per_day, prefix_tokens, dynamic_tokens, output_tokens,
               price_in, price_out, hit_rate=0.0, read_mult=0.1, write_mult=1.25):
    per_m = 1_000_000
    if hit_rate == 0.0:
        prefix_cost = prefix_tokens * price_in             # caching off
    else:
        prefix_cost = prefix_tokens * price_in * (
            hit_rate * read_mult + (1 - hit_rate) * write_mult)  # a miss writes the cache
    cost_in = (prefix_cost + dynamic_tokens * price_in) / per_m
    cost_out = output_tokens * price_out / per_m
    return queries_per_day * (cost_in + cost_out)

# 1M queries/day, 2,000-token shared prefix, 1,500 tokens of retrieved chunks,
# 300 output tokens, $2 in / $10 out per million tokens.
args = (1_000_000, 2000, 1500, 300, 2.0, 10.0)
print(f"no cache: ${daily_cost(*args):,.0f}/day")
print(f"90% hits: ${daily_cost(*args, hit_rate=0.9):,.0f}/day")
print(f"20% hits: ${daily_cost(*args, hit_rate=0.2):,.0f}/day")
```

Output:

```text
no cache: $10,000/day
90% hits: $6,860/day
20% hits: $10,080/day
```

### Snippet 2. KV-cache bytes per token and concurrent sequences (capacity; backs sys-004)

```python
# KV-cache bytes per token and how many concurrent sequences fit on one GPU.
def kv_bytes_per_token(layers, kv_heads, head_dim, bytes_per_value=2):
    return 2 * layers * kv_heads * head_dim * bytes_per_value   # 2 = keys and values

# Llama 3.1 70B config.json: 80 layers, 8 KV heads, hidden 8192 / 64 heads = 128 head dim.
per_tok = kv_bytes_per_token(80, 8, 128)            # BF16 cache
print(f"Llama 3.1 70B KV per token: {per_tok:,} bytes ({per_tok/1024:.0f} KiB)")

ctx = 8192                                          # tokens per sequence (prompt + output)
per_seq_gib = per_tok * ctx / 2**30
print(f"one {ctx}-token sequence: {per_seq_gib:.2f} GiB")

# Assumption for the exercise: 8 x 80 GB GPUs, BF16 weights (70e9 params x 2 bytes),
# and 10% of memory held back for activations and fragmentation.
total = 8 * 80e9
weights = 70e9 * 2
free_for_kv = total * 0.9 - weights
print(f"memory left for KV: {free_for_kv/1e9:.0f} GB")
print(f"concurrent {ctx}-token sequences: {int(free_for_kv // (per_tok * ctx))}")
```

Output:

```text
Llama 3.1 70B KV per token: 327,680 bytes (320 KiB)
one 8192-token sequence: 2.50 GiB
memory left for KV: 436 GB
concurrent 8192-token sequences: 162
```

### Snippet 3. Traffic to replicas with Little's law (capacity; backs sys-004)

```python
# Traffic to concurrency to replicas, using Little's law (L = arrival rate x time in system).
import math

def replicas_needed(peak_rps, mean_latency_s, max_concurrent_per_replica, headroom=0.7):
    in_flight = peak_rps * mean_latency_s                  # Little's law
    usable = max_concurrent_per_replica * headroom          # do not plan to run at 100%
    return in_flight, math.ceil(in_flight / usable)

# 1M queries/day with a peak-to-average ratio of 3 (an assumption to state out loud).
avg_rps = 1_000_000 / 86_400
peak_rps = avg_rps * 3
# 300 output tokens at a measured 40 ms per output token, plus 0.5 s to first token.
latency = 0.5 + 300 * 0.040
in_flight, n = replicas_needed(peak_rps, latency, max_concurrent_per_replica=64)
print(f"average {avg_rps:.1f} rps, peak {peak_rps:.1f} rps, latency {latency:.1f} s")
print(f"in flight at peak: {in_flight:.0f} requests, replicas: {n}")
```

Output:

```text
average 11.6 rps, peak 34.7 rps, latency 12.5 s
in flight at peak: 434 requests, replicas: 10
```

### Snippet 4. Vector index size and embedding cost (case-retrieval; backs sys-006)

```python
# Vector index size and one-off embedding cost for enterprise search.
docs = 100_000_000
chunks_per_doc = 8            # assumption: state it, then show what happens if it doubles
tokens_per_chunk = 400
dims = 1536                   # text-embedding-3-small default output size
bytes_per_float = 4           # float32 before any quantization

vectors = docs * chunks_per_doc
raw_tb = vectors * dims * bytes_per_float / 1e12
print(f"{vectors:,} vectors, {raw_tb:.1f} TB of float32 vectors before index overhead")
print(f"at 256 dims and int8: {vectors * 256 * 1 / 1e12:.2f} TB")

price_per_m = 0.02            # text-embedding-3-small, USD per 1M tokens (checked 2026-10-28)
embed_cost = vectors * tokens_per_chunk / 1e6 * price_per_m
print(f"one full embedding pass: ${embed_cost:,.0f}")
```

Output:

```text
800,000,000 vectors, 4.9 TB of float32 vectors before index overhead
at 256 dims and int8: 0.20 TB
one full embedding pass: $6,400
```

### Snippet 5. Voice latency: series versus streamed (case-realtime; backs sys-010)

```python
# Voice turn latency: stages in series versus streamed and overlapped.
# Stage numbers are the P50 example from ElevenLabs' latency post (checked 2026-10-28).
stages = {
    "capture + endpointing": 120,
    "STT finalization": 60,
    "network": 60,
    "LLM time to first token": 250,
    "TTS time to first audio": 110,
    "player buffering": 80,
}
print("budget if TTS could start on the first LLM token:", sum(stages.values()), "ms")

# Streaming changes what you wait for: the LLM's first sentence, not its whole answer.
# If the reply is 60 tokens at 25 ms per token and TTS needed the full text first:
full_reply_ms = stages["LLM time to first token"] + 60 * 25
blocking = sum(v for k, v in stages.items() if k != "LLM time to first token") + full_reply_ms
print("TTS waits for the whole reply:", blocking, "ms")

# Speaking from the first clause (say 8 tokens) instead:
first_clause_ms = stages["LLM time to first token"] + 8 * 25
streamed = sum(v for k, v in stages.items() if k != "LLM time to first token") + first_clause_ms
print("TTS starts on the first clause:", streamed, "ms")
```

Output:

```text
budget if TTS could start on the first LLM token: 680 ms
TTS waits for the whole reply: 2180 ms
TTS starts on the first clause: 880 ms
```

### Snippet 6. Speech-to-speech session cost as history grows (case-realtime; backs sys-010)

```python
# Speech-to-speech session cost when the whole conversation is re-sent each turn.
# OpenAI Realtime: user audio ~10 tokens/s, assistant audio ~20 tokens/s.
# gpt-realtime-2.1 audio prices per 1M tokens (checked 2026-10-28): $32 in, $0.40 cached in, $64 out.
P_IN, P_CACHED, P_OUT = 32.0, 0.40, 64.0

def session_cost(turns, user_s, agent_s, cache_hit=0.0):
    history = 0.0          # audio tokens already in the conversation
    total = 0.0
    for _ in range(turns):
        user_tok, agent_tok = user_s * 10, agent_s * 20
        fresh = user_tok
        reused = history                                # earlier turns are input again
        total += (reused * (cache_hit * P_CACHED + (1 - cache_hit) * P_IN)
                  + fresh * P_IN + agent_tok * P_OUT) / 1e6
        history += user_tok + agent_tok
    return total

minutes = 10 * (5 + 10) / 60
for hit in (0.0, 0.9):
    c = session_cost(turns=10, user_s=5, agent_s=10, cache_hit=hit)
    print(f"10 turns, {minutes:.1f} min of audio, cache hit {hit:.0%}: ${c:.3f} (${c/minutes:.3f}/min)")
```

Output:

```text
10 turns, 2.5 min of audio, cache hit 0%: $0.504 ($0.202/min)
10 turns, 2.5 min of audio, cache hit 90%: $0.184 ($0.074/min)
```

### Snippet 7. Per-tenant token bucket with settle-up (capacity and fallback; candidate code problem)

```python
# Per-tenant token bucket that charges estimated tokens up front and settles afterwards.
import time

class TokenBucket:
    def __init__(self, capacity, refill_per_s, now=time.monotonic):
        self.capacity, self.refill, self.now = capacity, refill_per_s, now
        self.level, self.t = capacity, now()

    def _top_up(self):
        t = self.now()
        self.level = min(self.capacity, self.level + (t - self.t) * self.refill)
        self.t = t

    def try_take(self, n):
        self._top_up()
        if self.level >= n:
            self.level -= n
            return True
        return False

    def settle(self, estimated, actual):
        self.level = min(self.capacity, self.level + estimated - actual)  # refund or charge the gap

clock = [0.0]
b = TokenBucket(capacity=10_000, refill_per_s=1_000, now=lambda: clock[0])
print(b.try_take(8_000), b.try_take(3_000))   # True False: 2,000 left
clock[0] += 1.0                               # one second refills 1,000
print(b.try_take(3_000))                      # True: 3,000 available
b.settle(estimated=3_000, actual=1_200)       # the reply was shorter than estimated
print(round(b.level))                         # 1,800 refunded
```

Output:

```text
True False
True
1800
```

### Snippet 8. Exact plus semantic cache scoped by tenant and model (caching layers; backs sys-014)

```python
# Two cache layers in front of a model: exact match, then semantic match.
# The cache key always includes the tenant and the model version.
import hashlib, math, re
from collections import Counter

def embed(text):                        # toy bag-of-words vector; a real system calls an embedding model
    return Counter(re.findall(r"[a-z0-9]+", text.lower()))

def cosine(a, b):
    dot = sum(a[k] * b[k] for k in a)
    na = math.sqrt(sum(v * v for v in a.values()))
    nb = math.sqrt(sum(v * v for v in b.values()))
    return dot / (na * nb) if na and nb else 0.0

class LayeredCache:
    def __init__(self, threshold):
        self.threshold, self.exact, self.semantic = threshold, {}, []

    def _key(self, tenant, model, prompt):
        return hashlib.sha256(f"{tenant}|{model}|{prompt}".encode()).hexdigest()

    def get(self, tenant, model, prompt):
        hit = self.exact.get(self._key(tenant, model, prompt))
        if hit:
            return "exact", hit
        q = embed(prompt)
        best = max(((cosine(q, v), ans) for t, m, v, ans in self.semantic
                    if t == tenant and m == model), default=(0.0, None))
        return ("semantic", best[1]) if best[0] >= self.threshold else ("miss", None)

    def put(self, tenant, model, prompt, answer):
        self.exact[self._key(tenant, model, prompt)] = answer
        self.semantic.append((tenant, model, embed(prompt), answer))

c = LayeredCache(threshold=0.8)
c.put("acme", "m-2026-10", "how do I reset my password", "Use Settings > Security.")
print(c.get("acme", "m-2026-10", "how do I reset my password"))       # exact
print(c.get("acme", "m-2026-10", "How do I reset my password?"))      # semantic: punctuation differs
print(c.get("globex", "m-2026-10", "how do I reset my password"))     # miss: other tenant
print(c.get("acme", "m-2026-10", "how do I reset my 2FA device"))     # miss at 0.8
c.threshold = 0.6
print(c.get("acme", "m-2026-10", "how do I reset my 2FA device"))     # false positive at 0.6
```

Output:

```text
('exact', 'Use Settings > Security.')
('semantic', 'Use Settings > Security.')
('miss', None)
('miss', None)
('semantic', 'Use Settings > Security.')
```

### Snippet 9. Circuit breaker with a labelled degraded path (fallback; backs sys-015)

```python
# Circuit breaker in front of a primary model, with a degraded path that is labelled as such.
class Breaker:
    def __init__(self, fail_limit=3, cooldown_s=30.0):
        self.fail_limit, self.cooldown = fail_limit, cooldown_s
        self.fails, self.opened_at = 0, None

    def allow(self, now):
        if self.opened_at is None:
            return True
        return now - self.opened_at >= self.cooldown      # half-open: let one probe through

    def record(self, ok, now):
        if ok:
            self.fails, self.opened_at = 0, None
        else:
            self.fails += 1
            if self.fails >= self.fail_limit:
                self.opened_at = now

def answer(prompt, primary, secondary, breaker, now):
    if breaker.allow(now):
        try:
            out = primary(prompt)
            breaker.record(True, now)
            return {"text": out, "served_by": "primary", "degraded": False}
        except Exception:
            breaker.record(False, now)
    out = secondary(prompt)          # e.g. a smaller model, a cached answer, or a canned handoff
    return {"text": out, "served_by": "secondary", "degraded": True}

def flaky(prompt):
    raise TimeoutError("529 overloaded")

b = Breaker(fail_limit=2, cooldown_s=30)
for t in (0, 1, 2, 40):
    r = answer("hi", flaky if t < 40 else (lambda p: "ok"), lambda p: "fallback", b, t)
    print(t, r["served_by"], "breaker open" if b.opened_at is not None else "breaker closed")
```

Output:

```text
0 secondary breaker closed
1 secondary breaker open
2 secondary breaker open
40 primary breaker closed
```

### Snippet 10. Deterministic A/B bucketing for prompt or model rollout (backs sys-013)

```python
# Deterministic A/B assignment: the same user always lands in the same arm,
# and a new experiment name reshuffles users so experiments do not correlate.
import hashlib

def arm(user_id, experiment, treatment_pct):
    h = int(hashlib.sha256(f"{experiment}:{user_id}".encode()).hexdigest()[:8], 16)
    return "treatment" if (h % 10_000) < treatment_pct * 100 else "control"

users = [f"u{i}" for i in range(20_000)]
share = sum(arm(u, "prompt-v7", 5) == "treatment" for u in users) / len(users)
print(f"treatment share at 5%: {share:.3f}")
print(arm("u42", "prompt-v7", 5) == arm("u42", "prompt-v7", 5))   # stable: True
# Ramping 5% -> 20% keeps everyone already in treatment there (monotone in the hash).
moved_out = sum(arm(u, "prompt-v7", 5) == "treatment" and arm(u, "prompt-v7", 20) == "control"
                for u in users)
print("users who left treatment when ramping to 20%:", moved_out)
```

Output:

```text
treatment share at 5%: 0.050
True
users who left treatment when ramping to 20%: 0
```

---

## 6. Sources

All checked 2026-10-28. "Date" is the page's own publication or update date where it shows one; vendor docs pages usually show none, in which case the check date is the only date.

### Primary (vendor docs, specs, papers, model cards, company engineering posts)

| Key | Source | URL | Date on page |
|---|---|---|---|
| S1 | Anthropic: Pricing | https://platform.claude.com/docs/en/about-claude/pricing | none (content refers to 2026 dates) |
| S2 | OpenAI: API pricing | https://developers.openai.com/api/docs/pricing | none (content refers to 2026 dates) |
| S3 | Google: Gemini API pricing | https://ai.google.dev/gemini-api/docs/pricing | none (prices with 2026 end dates) |
| S4 | Anthropic: Prompt caching | https://platform.claude.com/docs/en/build-with-claude/prompt-caching | none |
| S5 | OpenAI: Prompt caching guide | https://developers.openai.com/api/docs/guides/prompt-caching | none |
| S6 | Anthropic: Rate limits | https://platform.claude.com/docs/en/api/rate-limits | none |
| S7 | Anthropic: API errors | https://platform.claude.com/docs/en/api/errors | none |
| S8 | Anthropic: Model deprecations | https://platform.claude.com/docs/en/about-claude/model-deprecations | latest entry 2026-09-30 |
| S9 | OpenAI: Realtime costs | https://developers.openai.com/api/docs/guides/realtime-costs | none |
| S10 | OpenAI: Realtime voice activity detection | https://developers.openai.com/api/docs/guides/realtime-vad | none |
| S11 | OpenAI: Realtime API guide | https://developers.openai.com/api/docs/guides/realtime | none |
| S12 | OpenAI: Voice agents guide | https://developers.openai.com/api/docs/guides/voice-agents | none |
| S13 | Google: Gemini Live API session management | https://ai.google.dev/gemini-api/docs/live-session | none |
| S14 | ElevenLabs: Voice agent latency optimization | https://elevenlabs.io/blog/voice-agent-latency-optimization | 2026-06-23, updated 2026-10-09 |
| S15 | Stivers et al., Universals and cultural variation in turn-taking in conversation (PNAS 2009, open-access copy) | https://pmc.ncbi.nlm.nih.gov/articles/PMC2705608/ | 2009 |
| S16 | LiveKit: Turns and turn detection | https://docs.livekit.io/agents/build/turns/ | none |
| S17 | Schroeder et al., vCache: Verified Semantic Prompt Caching | https://arxiv.org/abs/2502.03771 | v1 2025-02-06, v5 2026-02-21 |
| S18 | Redis: LangCache concepts | https://redis.io/docs/latest/develop/ai/context-engine/langcache/concepts/ | none |
| S19 | vLLM: Automatic prefix caching design | https://docs.vllm.ai/en/latest/design/prefix_caching.html | none |
| S20 | NVIDIA: H100 product page | https://www.nvidia.com/en-us/data-center/h100/ | none |
| S21 | Llama 3.1 70B Instruct config.json (NousResearch mirror of Meta's gated repo) | https://huggingface.co/NousResearch/Meta-Llama-3.1-70B-Instruct/blob/main/config.json | none |
| S22 | OpenAI: gpt-oss-120b model card and config | https://huggingface.co/openai/gpt-oss-120b | none |
| S23 | Qwen: Qwen3-235B-A22B model card and config | https://huggingface.co/Qwen/Qwen3-235B-A22B | none |
| S24 | Qwen: Qwen3-32B config | https://huggingface.co/Qwen/Qwen3-32B | none |
| S25 | NVIDIA NIM: LLM benchmarking metrics | https://docs.nvidia.com/nim/benchmarking/llm/latest/metrics.html | none |
| S26 | Anthropic Engineering: How we built our multi-agent research system | https://www.anthropic.com/engineering/multi-agent-research-system | 2025-06-13 |
| S27 | Anthropic Engineering: Effective context engineering for AI agents | https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents | 2025-09-29 |
| S28 | Barres et al., tau2-Bench: Evaluating Conversational Agents in a Dual-Control Environment | https://arxiv.org/abs/2506.07982 | 2025-06-09 |
| S29 | Yao et al., tau-bench (introduces pass^k) | https://arxiv.org/abs/2406.12045 | 2024-06-17 |
| S30 | Anthropic: Constitutional Classifiers | https://www.anthropic.com/research/constitutional-classifiers | 2025-02-03 |
| S31 | Anthropic: Next-generation Constitutional Classifiers | https://www.anthropic.com/research/next-generation-constitutional-classifiers | 2026-01-09 |
| S32 | OpenAI: Moderation guide | https://developers.openai.com/api/docs/guides/moderation | none |
| S33 | OpenAI: gpt-oss-safeguard-20b model card | https://huggingface.co/openai/gpt-oss-safeguard-20b | collection updated 2025-10-29 |
| S34 | OpenAI: Technical report, gpt-oss-safeguard (PDF; text extracted locally with pdftotext) | https://cdn.openai.com/pdf/08b7dee4-8bc6-4955-a219-7793fb69090c/Technical_report__Research_Preview_of_gpt_oss_safeguard.pdf | 2025-10-29 |
| S35 | Meta: Llama Guard 4 12B model card | https://github.com/meta-llama/PurpleLlama/blob/main/Llama-Guard4/12B/MODEL_CARD.md | none |
| S38 | OpenAI: API changelog | https://developers.openai.com/api/docs/changelog | entries 2025-06-27 to 2026-10-20 |
| S39 | OpenAI: Conversation state guide | https://developers.openai.com/api/docs/guides/conversation-state | none |
| S40 | Stripe: Create and configure a meter | https://docs.stripe.com/billing/subscriptions/usage-based/meters/configure | none |
| S41 | Stripe: Record usage for billing | https://docs.stripe.com/billing/subscriptions/usage-based/recording-usage | none |
| S42 | OpenTelemetry: GenAI semantic conventions repository | https://github.com/open-telemetry/semantic-conventions-genai | none |
| S43 | LiteLLM: Router, load balancing and fallbacks | https://docs.litellm.ai/docs/routing | none |
| S44 | Anthropic Engineering: Contextual retrieval | https://www.anthropic.com/engineering/contextual-retrieval | 2024-09-19 |
| S45 | Model Context Protocol: Versioning | https://modelcontextprotocol.io/specification/versioning | current revision 2026-07-28 |
| S46 | Microsoft Learn: Data, privacy, and security for Microsoft Copilot | https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-privacy | 2026-07-09 |
| S47 | GitHub Docs: About Copilot code review | https://docs.github.com/en/copilot/concepts/agents/code-review | none |
| S48 | Anthropic: PDF support | https://platform.claude.com/docs/en/build-with-claude/pdf-support | none |
| S49 | Google: Gemini document processing | https://ai.google.dev/gemini-api/docs/document-processing | 2026-10-08 |
| S50 | Pinecone: Implement multitenancy | https://docs.pinecone.io/guides/index-data/implement-multitenancy | none |
| S51 | OpenAI: Embeddings guide | https://developers.openai.com/api/docs/guides/embeddings | none |
| S52 | LangChain: LangGraph interrupts | https://docs.langchain.com/oss/python/langgraph/interrupts | none (mentions langgraph>=1.2.12) |
| S53 | OpenAI Agents SDK (Python): Guardrails | https://openai.github.io/openai-agents-python/guardrails/ | none |
| S54 | Anthropic: Agent Skills overview | https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview | none |
| S55 | Anthropic: Claude Managed Agents overview | https://platform.claude.com/docs/en/managed-agents/overview | beta header dated 2026-04-01 |
| S56 | A2A Protocol: Specification | https://a2a-protocol.org/latest/specification/ | latest version 1.0.0 |
| S70 | AWS Builders' Library: Avoiding fallback in distributed systems (Jacob Gabrielson) | https://builder.aws.com/content/3EuS9Sakq7L3VLQIF3qzfMfke1Y/avoiding-fallback-in-distributed-systems | 2019-12-05 |

### Secondary (prep sites, community guides, question banks)

| Key | Source | URL | Date on page | Caveat |
|---|---|---|---|---|
| S36 | Hello Interview: Harmful content detection (ML system design breakdown) | https://www.hellointerview.com/learn/ml-system-design/problem-breakdowns/harmful-content | none | does not name an asking company |
| S37 | Hello Interview: Delivery framework | https://www.hellointerview.com/learn/system-design/in-a-hurry/delivery | none | general system design, not AI-specific |
| S57 | amitshekhariitbhu/ai-engineering-interview-questions (Apache-2.0) | https://github.com/amitshekhariitbhu/ai-engineering-interview-questions | none | questions only, no company tags |
| S58 | ombharatiya/ai-system-design-guide README (MIT; 15 case studies) | https://github.com/ombharatiya/ai-system-design-guide | refreshed October 2026 per README | consulted for case-study coverage |
| S59 | ombharatiya question bank | https://raw.githubusercontent.com/ombharatiya/ai-system-design-guide/main/00-interview-prep/01-question-bank.md | none | consulted; scenarios overlap Q1, Q14, Q22, Q24, Q35 |
| S60 | ombharatiya answer frameworks (SPIDER) | https://raw.githubusercontent.com/ombharatiya/ai-system-design-guide/main/00-interview-prep/02-answer-frameworks.md | none | community framework |
| S61 | ombharatiya common pitfalls | https://raw.githubusercontent.com/ombharatiya/ai-system-design-guide/main/00-interview-prep/03-common-pitfalls.md | none | its cost example uses a $2/$10 model; recheck any number it quotes |
| S62 | ombharatiya whiteboard exercises | https://raw.githubusercontent.com/ombharatiya/ai-system-design-guide/main/00-interview-prep/04-whiteboard-exercises.md | none | constraints are the guide's, not a company's |
| S63 | techinterview.org: What applied-AI engineer interviews test in 2026 | https://www.techinterview.org/post/3233476824/ai-engineer-interview-rag-agents-evals/ | 2026-07-23 | unnamed candidate reports |
| S64 | techinterview.org: OpenAI interview process 2026, team by team | https://www.techinterview.org/post/3233474915/openai-interview-process-2026-team-by-team/ | 2026-05-04, updated 2026-07-13 | focus areas, not verbatim prompts |
| S65 | techinterview.org: ML engineer interview in the post-LLM era | https://www.techinterview.org/post/3233474925/ml-engineer-interview-post-llm-era/ | 2026-07-13 | no company attribution |
| S66 | techinterview.org: AI in system design interviews, 2026 | https://www.techinterview.org/post/3233474919/ai-in-system-design-interviews-2026/ | 2026-07-12 | no company attribution |
| S67 | Exponent (aced.io): AI engineer interview questions | https://www.aced.io/blog/ai-engineer-interview-questions | "last updated a month ago", 2026 | company-attributed, paraphrased, partly paywalled |
| S68 | Exponent (aced.io): System design interview guide | https://www.aced.io/blog/system-design-interview-guide | "last updated a month ago", images dated May 2026 | company-attributed, aggregated reports |
| S69 | getperspective.ai: Anthropic Applied AI Engineer interview process | https://getperspective.ai/blog/anthropic-applied-ai-engineer-interview-process-frontier-lab-2026/markdown | 2026-05-29 | vendor blog, unverified candidate reports |
| S71 | alirezadir/AIMLInterviews, ML system design chapter (MIT) | https://raw.githubusercontent.com/alirezadir/AIMLInterviews/main/src/MLSD/ml-system-design.md | none | consulted; GenAI section lists seven case types, no company tags |


Total distinct sources: 71 (keys S1 to S71; S36 and S37 are listed with the secondary sources).

Pages tried and not usable on the check date: Meta's gated Llama 3.1 repo (401, replaced by the mirror in S21), openai.com blog posts (403, replaced by the changelog S38 and the technical report S34), the PNAS article page (403, replaced by the PMC copy S15), 1point3acres interview thread 1161152 (403), igotanoffer GenAI system design article (403), datatalks.club LLM system design guide (404 after redirect). None of them is cited.
