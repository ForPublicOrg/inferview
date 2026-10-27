# Track 9 research: Coding rounds, behavioural and customer craft

Track slug: `rounds`. Modules: `hand-write`, `llm-app-coding`, `take-home-debug`, `ai-collab-coding`, `customer-craft`, `behavioural`. Problem id prefix: `rnd`. Core slots (SPEC section 7): 11.

Every source below was opened and checked on 2026-10-28 unless the entry says otherwise. "Checked" means the page was fetched and the quoted or paraphrased fact was read on it. Source ids like [S24] point to the table in section 6.

Provenance labels used in this file:

- **official**: the company's own site, docs, engineering blog, job post or spec.
- **press**: a news outlet reporting on the company.
- **vendor guide**: an interview-prep business writing about a company's loop. Treat as unverified.
- **candidate report**: an anonymous or named candidate's own write-up, or an aggregator page quoting one.
- **question bank**: an open-source question list on GitHub.

## 1. Verified facts per module

### 1.1 hand-write

| Fact | Value | Source |
|---|---|---|
| Scaled dot-product attention | Attention(Q, K, V) = softmax(QK^T / sqrt(d_k)) V. Dot products are divided by sqrt(d_k) because for large d_k they "grow large in magnitude, pushing the softmax function into regions" with very small gradients | [S43] Vaswani et al. 2017, section 3.2.1 |
| Base Transformer head config | h = 8 heads, d_k = d_v = d_model / h = 64 | [S43] section 3.2.2 |
| Top-p (nucleus) definition | V(p) is "the smallest set" of tokens whose summed probability is at least p; the distribution is then re-scaled over V(p) | [S44] Holtzman et al., ICLR 2020, eq. 2 and 3 |
| Min-p definition | p_scaled = p_base x p_max; keep tokens with probability >= p_scaled. ICLR 2025 oral; arXiv v8 revised 20 Nov 2025 | [S45] Nguyen et al. |
| Min-p adoption | The paper says min-p "has been adopted by" Hugging Face Transformers and vLLM among others (authors' claim, not checked against those codebases here) | [S45] abstract |
| BPE toy dictionary | Algorithm 1 uses {'l o w </w>': 5, 'l o w e r </w>': 2, 'n e w e s t </w>': 6, 'w i d e s t </w>': 3} with num_merges = 10 | [S46] Sennrich et al. 2016, Algorithm 1 |
| BPE Figure 1 caveat | The Figure 1 merges (r plus end-of-word, l o, lo w, e r plus end-of-word) come from a different dictionary, {low, lowest, newer, wider}, not from the Algorithm 1 dictionary | [S46] Figure 1 caption |
| BPE vocabulary size | final symbol vocabulary = initial vocabulary + number of merges; the merge count is the only hyperparameter | [S46] section 3.2 |
| Online softmax | max and normaliser computed in one pass; memory accesses drop "from 4 down to 3 per vector element" | [S47] Milakov and Gimelshein 2018 |
| KV cache definition and scale | "The attention key and value tensors of each layer, which we refer to as the KV cache". PaLM 540B example: batch 512, context 2048, KV cache totals 3 TB, 3 times the parameter size | [S48] Pope et al. 2022, section 2 |
| LoRA init and scaling | A gets a random Gaussian init, B is zero so BA = 0 at the start; the update is scaled by alpha / r | [S49] Hu et al. 2021, section 4.1 |
| LoRA headline numbers | Versus GPT-3 175B fine-tuned with Adam: trainable parameters cut by 10,000 times and GPU memory by 3 times; no extra inference latency because W = W0 + BA can be merged | [S49] abstract and section 4.1 |
| Beam search | keeps several sequences per step and returns the one with the highest overall probability; Hugging Face calls it "best suited for input-grounded tasks"; `num_beams=1` is greedy | [S50] Transformers v5.21.0 docs |
| Greedy default length | Transformers greedy search generates at most 20 new tokens unless GenerationConfig says otherwise | [S50] |
| Embedding normalisation | OpenAI embeddings "are normalized to length 1", so dot product equals cosine similarity and cosine and Euclidean distance give identical rankings | [S36] |
| AUC as a ranking probability | No primary source was fetched for the Mann-Whitney equivalence in this pass. The snippet in section 5 checks the pairwise definition against the rank-sum form numerically instead. Cite a statistics reference before a lesson states it as a sourced fact. | not sourced |
| Real tokenizer counts | Not covered here; the foundations track owns tokenizer measurements (SPEC section 2, `scripts/tokens.mjs`) | n/a |

### 1.2 llm-app-coding

| Fact | Value | Source |
|---|---|---|
| Claude API limiter algorithm | "The API uses the token bucket algorithm"; capacity "is continuously replenished up to your maximum limit, rather than being reset at fixed intervals" | [S24] |
| Short-interval enforcement | "a rate of 60 requests per minute (RPM) might be enforced as 1 request per second" | [S24] |
| Limit dimensions | requests per minute (RPM), input tokens per minute (ITPM), output tokens per minute (OTPM), per model class | [S24] |
| Cache-aware ITPM | For most models only `input_tokens` + `cache_creation_input_tokens` count toward ITPM; `cache_read_input_tokens` do not (Claude Haiku 3.5 is the stated exception) | [S24] |
| Worked cache example | a 2,000,000 ITPM limit with an 80 percent cache hit rate allows 10,000,000 total input tokens per minute | [S24] |
| OTPM and max_tokens | "The `max_tokens` parameter does not factor into OTPM rate limit calculations" | [S24] |
| Start tier, Claude Opus 5.5 | 1,000 RPM, 2,000,000 ITPM, 400,000 OTPM. Build: 5,000 / 5,000,000 / 1,000,000. Scale: 10,000 / 10,000,000 / 2,000,000 | [S24] |
| Rate-limit headers | `retry-after` (seconds) and `anthropic-ratelimit-{requests,tokens,input-tokens,output-tokens}-{limit,remaining,reset}`; reset values use RFC 3339 | [S24] |
| Spend-cap 429 | same `rate_limit_error` type but no `retry-after`; retries, including SDK retries, keep failing until access resumes; `error.details.error_code` is `enforced_spend_limit_reached` | [S24], [S25] |
| Claude error codes | 400 invalid_request_error, 401 authentication_error, 402 billing_error, 403 permission_error, 404 not_found_error, 409 conflict_error, 413 request_too_large, 429 rate_limit_error, 500 api_error, 504 timeout_error, 529 overloaded_error | [S25] |
| Anthropic SDK retries | transient failures are retried "with exponential backoff, twice by default, honoring the `retry-after` header when present"; `max_retries` configures it | [S25] |
| OpenAI Python SDK retries | "retried 2 times by default, with a short exponential backoff"; covers connection errors, 408, 409, 429 and >=500; default timeout 10 minutes; timed-out requests are retried | [S33] README |
| Streams are not retried | OpenAI SDK: "Stream consumption is not automatically retried, because replaying a request could duplicate output" | [S33] README |
| Claude request size limits | Messages API 32 MB, Token Counting 32 MB, Batch API 256 MB, Files API 500 MB; larger requests get 413 | [S25] |
| Claude SSE event flow | message_start; per content block a content_block_start, one or more content_block_delta and a content_block_stop; one or more message_delta; message_stop. Any number of `ping` events may appear | [S26] |
| Cumulative usage | "The token counts shown in the `usage` field of the `message_delta` event are *cumulative*." | [S26] |
| Mid-stream errors | an error can arrive as `event: error` after the API already returned 200, for example `overloaded_error` | [S25], [S26] |
| Unknown events | "new event types may be added, and your code should handle unknown event types gracefully" | [S26] |
| Tool input streaming | `input_json_delta` carries `partial_json` strings; accumulate and parse at `content_block_stop` | [S26] |
| Stream recovery | Claude 4.5 and earlier: resend the partial output as the start of an assistant message. Claude 4.6 and later: send a user message containing the partial response and an instruction to continue, because prefill returns a 400 on 4.6 and later | [S26], [S25] |
| OpenAI Responses streaming | typed semantic events such as `response.created`, `response.output_text.delta`, `response.completed` and `error` | [S35] |
| SSE wire format | lines end in CRLF, LF or CR; a blank line dispatches the event; a line starting with ":" is ignored; one leading space after the colon is removed; each `data` line is appended plus LF and the final LF is dropped; an event with no terminating blank line at end of stream is discarded | [S38] WHATWG HTML |
| Tool result placement | `tool_result` blocks must immediately follow the tool use turn, must come first in the user content array, and each carries `tool_use_id`; `is_error: true` reports a failure | [S29] |
| Forced tool choice | Claude Opus 5.5, Sonnet 5.5, Fable 5.1 and Mythos 5.1 reject `tool_choice` `any` and `tool` with a 400; docs recommend `auto` plus strict tool use | [S25], [S30] |
| Tool-response size | "For Claude Code, we restrict tool responses to 25,000 tokens by default" | [S32] Sep 11, 2025 |
| Claude Message Batches | 50 percent cost reduction; up to 100,000 requests or 256 MB per batch; batch expires if not done within 24 hours; results available for 29 days; result types succeeded, errored, canceled, expired; results "not guaranteed to be in the same order", match on `custom_id` | [S27], [S28] |
| OpenAI Batch API | 50 percent discount; completion window can only be `24h`; up to 50,000 requests and a 200 MB input file per batch; up to 2,000 batch creations per hour; "output line order may not match the input line order", use `custom_id` | [S34] |
| Claude list pagination | query `after_id`, `before_id`, `limit` (default 20, range 1 to 1000); response `data`, `has_more`, `first_id`, `last_id` | [S28] |
| OpenAI SDK pagination | auto-paginating iterators, plus `.has_next_page()` and `.get_next_page()`; cursor field `after` | [S33] README |
| Claude context editing | beta header `context-management-2025-06-27`; `clear_tool_uses_20250919` defaults: trigger 100,000 input tokens, keep 3 tool uses; `clear_thinking_20251015` for thinking blocks; can be combined with the memory tool | [S31] |
| LangGraph memory | checkpointers give "short-term, thread-scoped memory" keyed by `thread_id`; stores give "long-term, cross-thread memory"; InMemorySaver, SqliteSaver, PostgresSaver | [S37] (the page does not state a version number) |
| Retry amplification | five-deep call stack with three retries per layer: "the load on the database will increase 243x"; advice is to "retry at a single point in the stack" and to limit retries locally with a token bucket | [S40] AWS Builders' Library, Dec 5, 2019 |
| Jitter | AWS compares "Full Jitter", "Equal Jitter" and "Decorrelated Jitter"; Equal Jitter does worst; jittered backoff "should be considered a standard approach for remote clients". The formulas are images on the page, so the full-jitter formula in section 5 (`uniform(0, min(cap, base * 2 ** attempt))`) is transcribed from the figure and should be re-checked by eye | [S39] Mar 4, 2015 |
| Pyodide limits | `threading`, `multiprocessing` and `sockets` "can be imported, but are not functional"; network calls go through the browser; `run_until_complete()` "cannot block like a normal event loop would" | [S41], [S42] (docs show version 314.0.7) |

### 1.3 take-home-debug

| Fact | Value | Source |
|---|---|---|
| Anthropic performance take-home | Python simulator of a fake accelerator "with characteristics that resemble TPUs"; in use since early 2024; over 1,000 candidates completed it | [S8] Jan 21, 2026 |
| Time limits | version 1: 4 hours; version 2: 2 hours | [S8] |
| AI use on that take-home | Anthropic's default is no AI on take-homes, but "For this take-home, we explicitly indicate otherwise" | [S8], [S1] |
| Published cycle counts (lower is better) | Claude Opus 4, many hours: 2164. Opus 4.5, casual Claude Code session: 1790. Opus 4.5, 2 hours in harness: 1579. Sonnet 4.5, over 2 hours: 1548. Opus 4.5, 11.5 hours: 1487. Opus 4.5, improved harness: 1363. Candidates who beat 1487 are invited to email the team. No exact human score is published. | [S8] |
| Open challenge repo | github.com/anthropics/original_performance_takehome, created 2026-01-19 per the GitHub API | [S9] |
| Design principles Anthropic lists | representative of real work; long enough horizon; high signal with many chances to show skill; no narrow domain prerequisites; engaging; redesigned as models improve | [S8] |
| OpenAI skills assessment formats | "pair coding interviews, take-home projects, technical tests, etc."; a role may have more than one | [S7] |
| OpenAI engineering criteria | "well-designed solutions to the challenge, high-quality code, optimal performance, and good test coverage" | [S7] |
| OpenAI final loop | "4-6 hours of final interviews with 4-6 people over 1-2 days"; decision expected within one week | [S7] |
| Meta AI-enabled round structure | reported as one multi-file codebase with bug-fix, implementation and optimisation phases in about 60 minutes | [S5] vendor guide built from candidate reports |
| Public AI-company take-home rubrics | None found beyond [S8] and [S7]. A vendor guide describes a 3 to 4 hour Claude app take-home for Anthropic Applied AI with no official confirmation | [S15] vendor guide |

### 1.4 ai-collab-coding

| Company | What the source says | Date | Source |
|---|---|---|---|
| Anthropic | Live interviews: no AI assistance "unless we indicate otherwise". Take-homes: "Complete these without Claude unless we indicate otherwise." Applications: write the first draft yourself, then refine with Claude. Preparing with Claude is encouraged. | last updated Jul 10, 2025 | [S1] official |
| Anthropic | Interviews over Google Meet; "For technical roles, we use live coding tools like Colab and CodeSignal"; looking things up is allowed | undated, checked | [S10] official |
| Anthropic | Performance take-home explicitly allows AI | Jan 21, 2026 | [S8] official |
| OpenAI | "Expectations for AI and other tools vary by interview: some formats intentionally allow them, while others are designed to assess your independent problem-solving without AI tools." | undated, checked | [S7] official |
| Meta | "many of Meta's interviews now include an AI assistant built into the interview environment"; "Candidates are expected to use this AI assistant"; the CoderPad assistant includes Claude, ChatGPT, Gemini and Meta's models; "No outside AI tools or assistance are authorized"; AI-Native Coding Interview languages: Python, Java, TypeScript, C++, C#, Kotlin, Swift, Rust, Go; a practice session is provided | undated, checked | [S3] official |
| Meta | First public report of the change, from internal messages | Jul 29, 2025 | [S4] press |
| Canva | Backend, Machine Learning and Frontend candidates are expected to use tools such as Copilot, Cursor and Claude; AI-Assisted Coding replaces the Computer Science Fundamentals round; interviewers ask five questions including "Can they identify and fix issues in AI-generated code?" | Jun 11, 2025 | [S2] official |
| Google | Pilot letting junior and mid-level SWE candidates in select US areas use Gemini in a "code comprehension" round from H2 2026; spokesperson confirmation was given to Business Insider | May 14, 2026 | [S51] press, syndicated; the Business Insider original was not opened |

Meta's rubric is not published on [S3] beyond evaluating "the problem-solving, coding, debugging, and collaboration skills". Vendor guides list four competencies (problem solving, code quality, verification, communication) [S5]; treat that list as unverified.

### 1.5 customer-craft

| Fact | Value | Source |
|---|---|---|
| Anthropic FDE (London) responsibilities | "Work within customer systems to build production applications with Claude models"; "Deliver technical artifacts for customers like MCP servers, sub-agents, and agent skills"; "Travel frequently (25-50%) to customer sites" | [S11] official job post |
| Anthropic FDE requirements | "4+ years of experience in a technical, customer facing role"; "Production experience with LLMs including advanced prompt engineering, agent development, evaluation frameworks"; Python | [S11] |
| Anthropic application form | a 200 to 400 word "Why Anthropic?" answer; candidates confirm they read the AI guidance | [S11] |
| OpenAI FDSWE responsibilities | "Embed deeply with strategic customers"; "experiment-driven, iterative approach"; "Prepare detailed scopes of work and project plans for both proof-of-concept prototypes and full production deployments"; travel up to 50 percent; 7+ years of full-stack experience | [S12] official job post |
| Customer-discovery simulation at Anthropic | Described only by vendor guides: [S15] says 60 to 90 minutes with the interviewer playing a buyer; [S16] lists a "customer-conversation simulation" stage with no source. No official or first-hand candidate source was found. | [S15], [S16] unverified |
| Discovery topics a vendor guide lists | how the buyer evaluates AI tools today, past failed deployments, compliance, latency, data residency, the workflow being replaced | [S15] vendor guide |

### 1.6 behavioural

| Fact | Value | Source |
|---|---|---|
| STAR | "The cornerstone of these interviews is the STAR method: situation, task, action, and result." Use "I" for your own contribution, include precise metrics, tie stories to the Leadership Principles | [S22] official (Amazon) |
| Amazon Leadership Principles | 16 principles, from Customer Obsession to Success and Scale Bring Broad Responsibility | [S23] official |
| Anthropic stated values | Act for the global good; Hold light and shade; Be good to our users; Ignite a race to the top on safety; Do the simple thing that works; Be helpful, honest, and harmless; Put the mission first | [S10] official |
| OpenAI: what they look for | "collaboration, effective communication, openness to feedback, and alignment with our mission and values" | [S7] official |
| Anthropic behavioural themes (reported) | why Anthropic, moral conflict, executive pressure, tough feedback, times the candidate was wrong; the values round may be run by non-technical interviewers | [S13] vendor guide, candidate-sourced |

Numbers that could not be sourced and must not appear in lessons: the "share of loop" percentages in `brief.json` `interview_question_taxonomy` (marked "indicative" there with no primary source); the "roughly 60%" filter rate and "73%" survey figure in [S15] (no citation in the post); pass rates or offer rates for any company.

## 2. Latest developments (2025 and 2026) that interviews ask about

1. **AI tools are now part of the coding loop at several companies, with opposite defaults.** Canva requires AI tools in its AI-Assisted Coding round (official, Jun 11, 2025) [S2]. Meta's AI-Native Coding Interview expects candidates to use a built-in multi-model assistant (official careers page; first reported Jul 29, 2025) [S3], [S4]. OpenAI says the policy varies by format [S7]. Anthropic defaults to no AI in live interviews and take-homes unless stated (Jul 10, 2025) [S1]. Google is piloting Gemini in a code comprehension round (press, May 14, 2026) [S51].
2. **Take-homes are being redesigned because models solve them.** Anthropic's performance take-home went through three versions after Claude Opus 4 and Opus 4.5 matched or beat most applicants within the time limit; the original is now an open challenge (official, Jan 21, 2026) [S8], [S9].
3. **Forward-deployed roles ship agent artefacts.** Anthropic's FDE post lists MCP servers, sub-agents and agent skills as customer deliverables and asks for evaluation-framework experience [S11]. OpenAI's FDSWE post asks for scopes of work covering prototypes and production deployments [S12]. Both checked 2026-10-28; the Anthropic post is dated Sep 14, 2026 by a job-board mirror.
4. **Rate limiting is token-bucket and cache-aware.** Claude rate limits use a token bucket and leave cache reads out of ITPM on most models [S24]. The classic "write a rate limiter" question changes: cost is tokens rather than requests, and output tokens count as they are produced.
5. **Streaming is typed events, not raw text.** Claude SSE has a fixed event order, cumulative usage in `message_delta`, `ping`, mid-stream `error`, and `input_json_delta` partial JSON for tool inputs [S26]. OpenAI's Responses API streams typed semantic events [S35]. A current streaming-parser question should include tool-input deltas.
6. **Stream recovery changed with Claude 4.6.** Prefill is rejected on 4.6 and later, so a resumed stream sends the partial text in a user message with an instruction to continue [S25], [S26].
7. **Forced tool choice is gone on the newest Claude models.** Opus 5.5, Sonnet 5.5, Fable 5.1 and Mythos 5.1 return a 400 for `tool_choice` `any` or `tool`; the docs point to `auto` plus strict tool use [S25], [S30].
8. **Context management moved into the API and the framework.** Claude context editing clears old tool results and thinking blocks past a token trigger and pairs with the memory tool [S31]. LangGraph separates thread-scoped checkpointers from cross-thread stores [S37]. A conversation-memory problem should ask which layer owns trimming.
9. **Tool design guidance is published.** Anthropic's Sep 11, 2025 post covers namespacing, high-signal responses, pagination and truncation, and actionable error messages [S32].
10. **Batch APIs are the expected answer for offline LLM jobs.** Both providers give 50 percent off, a 24-hour window and unordered results keyed by `custom_id` [S27], [S34].
11. **Min-p is the sampler candidates are now asked to compare with top-p.** ICLR 2025 oral, revised Nov 2025 [S45].

The STAR method and the Amazon principles have no 2025 or 2026 change; both pages are current and were checked on 2026-10-28 [S22], [S23].

## 3. Real interview questions (40 collected)

Columns: type is the SPEC problem type it fits best; "Company" is filled only when the cited page names the company for that question; "Prov." is the provenance label. Questions marked (paraphrased) were shortened; the rest are quoted or near-verbatim from the source.

| # | Question | Type | Diff. | Module | Source | Company | Prov. |
|---|---|---|---|---|---|---|---|
| Q1 | Implement scaled dot-product attention with a causal mask from scratch (NumPy or PyTorch). | code | medium | hand-write | [S20] | none | question bank |
| Q2 | Implement multi-head attention, then convert it to grouped-query attention. | code | hard | hand-write | [S20]; also listed in [S21] | none | question bank |
| Q3 | Implement a KV cache and single-step decode for causal multi-head attention. | code | hard | hand-write | [S20] | none | question bank |
| Q4 | Implement BPE (Byte Pair Encoding) training and encoding from scratch. | code | hard | hand-write | [S20]; also [S21] | none | question bank |
| Q5 | Implement top-k, top-p, and temperature sampling over a logits vector. | code | medium | hand-write | [S20] | none | question bank |
| Q6 | Compare greedy decoding, beam search, top-k, top-p, and temperature sampling. When does each fail? | mcq | easy | hand-write | [S20] | none | question bank |
| Q7 | Implement cosine similarity, dot product, and Euclidean distance functions from scratch. | code | easy | hand-write | [S20] | none | question bank |
| Q8 | Hand-write AUC (listed as an interview hand-coding task, difficulty two stars of five). | code | medium | hand-write | [S21] | none | question bank |
| Q9 | Hand-write softmax and LayerNorm. (paraphrased from two list entries) | code | easy | hand-write | [S21] | none | question bank |
| Q10 | Estimate the KV cache memory needed to serve a large model. How does it constrain batch size and context length? | estimate | medium | hand-write | [S20] | none | question bank |
| Q11 | Implement an LRU cache with O(1) get/put, then add per-entry TTL. | code | medium | llm-app-coding | [S20] | none | question bank |
| Q12 | Implement an LRU cache, then extend it as new constraints get added across stages. | code | medium | llm-app-coding | [S13] | Anthropic (FDE) | vendor guide |
| Q13 | Implement a token-bucket rate limiter for an LLM API where cost scales with tokens, then make it distributed. | code | medium | llm-app-coding | [S20] | none | question bank |
| Q14 | Write an async batch processor that runs an LLM call over 50,000 documents with a concurrency limit, retries with jitter, and error isolation. | code | medium | llm-app-coding | [S20] | none | question bank |
| Q15 | Write a streaming SSE parser for LLM token streams that handles arbitrary chunk boundaries. | code | medium | llm-app-coding | [S20] | none | question bank |
| Q16 | Implement a minimal agent loop with tool dispatch, error handling, and a step budget. | code | medium | llm-app-coding | [S20] | none | question bank |
| Q17 | Implement a conversation memory system for a chatbot (sliding window, summary, buffer). | code | medium | llm-app-coding | [S20] | none | question bank |
| Q18 | Implement a retry mechanism with exponential backoff for LLM API calls. | code | easy | llm-app-coding | [S20] | none | question bank |
| Q19 | Implement pagination for an API to retrieve all results, then do some computation with the JSON response. | code | easy | llm-app-coding | [S17] | Sierra (Senior AI Engineer) | candidate report |
| Q20 | Build an in-memory database with SQL-like operations: insert, select with AND-ed WHERE conditions, ORDER BY. (paraphrased) | code | medium | llm-app-coding | [S18] | OpenAI (reports dated Mar and Jun 2026) | candidate report |
| Q21 | Multi-level CodeSignal in-memory key-value database: set, get, delete, then locking and undo. (paraphrased) | code | medium | llm-app-coding | [S18] | Anthropic (report dated Apr 2026) | candidate report |
| Q22 | Write a web crawler limited to one hostname, single-threaded first, then make it multithreaded (thread pool expected). (paraphrased) | code | medium | llm-app-coding | [S19]; also [S14] | Anthropic (SWE phone screen, Sep 2025) | candidate report |
| Q23 | Write a function that determines the longest-running function based on stack trace samples. | code | medium | llm-app-coding | [S14]; variant in [S13] | Anthropic | vendor guide |
| Q24 | Read a set of files and eliminate duplicates. | code | medium | llm-app-coding | [S13] | Anthropic (FDE) | vendor guide |
| Q25 | This agent loops forever on some inputs. Find out why and fix it. | debug | medium | take-home-debug | [S16] | none | vendor guide |
| Q26 | Here are 50 markdown docs. Build a Q&A system, an eval set of 20 questions, and report recall@5 and faithfulness. | design | hard | take-home-debug | [S16] | none | vendor guide |
| Q27 | Optimise a kernel for a simulated TPU-like accelerator; scored in clock cycles (published take-home, now an open challenge). (paraphrased) | code | hard | take-home-debug | [S8], [S9] | Anthropic (performance engineering) | official |
| Q28 | In one multi-file codebase: fix bugs, implement a feature such as a maze solver with path printing, then optimise for larger test tiers, using the built-in AI assistant. (paraphrased) | debug | medium | ai-collab-coding | [S5] | Meta | vendor guide, candidate-sourced |
| Q29 | Build a control system that manages aircraft takeoffs and landings at a busy airport, using AI tools of your choice. (paraphrased from the example that replaced a Game of Life question) | design | hard | ai-collab-coding | [S2] | Canva | official |
| Q30 | Your LLM coding assistant generates outdated code using deprecated libraries. How do you fix it? | concept | easy | ai-collab-coding | [S20] | none | question bank |
| Q31 | A customer says the bot "feels dumb." What do you change first? | concept | medium | customer-craft | [S16] | none | vendor guide |
| Q32 | Role-play: a VP of Engineering at a large fintech doubts that Claude does anything ChatGPT cannot, and asks you to convince them. Run discovery instead of pitching. (paraphrased) | behavioural | hard | customer-craft | [S15] | Anthropic (Applied AI) | vendor guide, unverified |
| Q33 | A non-technical executive asks why your AI feature cannot be 100% accurate. How do you explain LLM limitations? | concept | medium | customer-craft | [S20] | none | question bank |
| Q34 | Your PM wants to ship an AI feature with a 15% hallucination rate on edge cases. How do you communicate the risk? | behavioural | medium | customer-craft | [S20] | none | question bank |
| Q35 | How do you decide whether a problem needs AI or a traditional software solution? | concept | easy | customer-craft | [S20] | none | question bank |
| Q36 | Tell me about a challenging AI project you worked on: problem, approach, trade-offs, outcome. | behavioural | medium | behavioural | [S20] | none | question bank |
| Q37 | Describe a time when you had to choose between model accuracy and latency. How did you make the decision? | behavioural | medium | behavioural | [S20] | none | question bank |
| Q38 | What concerns do you have with Anthropic's mission or direction? | behavioural | medium | behavioural | [S14] | Anthropic | vendor guide |
| Q39 | How do you balance delivery speed with security concerns? | behavioural | medium | behavioural | [S14] | Anthropic | vendor guide |
| Q40 | Why did you use machine learning or an LLM for this problem, and how did you know it fit? | behavioural | medium | behavioural | [S13] | Anthropic (FDE hiring manager round) | vendor guide |

Company attribution rule for the bank (SPEC section 6): only Q27 (Anthropic, official) and Q29 (Canva, official) have a primary source naming the company. Q12, Q19 to Q24, Q28, Q32, Q38 to Q40 name a company only through vendor guides or candidate reports. If the `companies` field is used for those, the URL must be the cited page and the problem text should say "reported by candidates".

### 3.1 Recommended for the problem bank (15), with core picks (11)

Coverage: code 7, debug 2, estimate 1, mcq 1, concept 2, design 1, behavioural 1. Every SPEC type appears. Rounds carries the behavioural problems, so a second behavioural item is listed as non-core.

| Rec | From | Proposed problem | Type | Diff. | Core | Why |
|---|---|---|---|---|---|---|
| R1 | Q5 | Top-p, min-p and temperature sampler with seeded tests | code | medium | yes | Asked widely; exact definitions are sourced [S44], [S45]; runs in Pyodide |
| R2 | Q1 | Causal scaled dot-product attention in pure Python | code | medium | yes | The canonical hand-write question; mask and scale are common bugs [S43] |
| R3 | Q4 | BPE train and encode on the Sennrich dictionary | code | hard | no | Overlaps foundations/tokens; keep as a stretch problem |
| R4 | Q3 | KV cache decode step equals full recompute | code | hard | no | Good staff-level stretch; links to inference track |
| R5 | Q15 | SSE parser that survives any chunk split, plus `input_json_delta` accumulation | code | medium | yes | Directly tests the 2026 streaming format [S26], [S38] |
| R6 | Q13 | Token-bucket limiter charged in tokens with a fake clock | code | medium | yes | Matches how the Claude API limits [S24] |
| R7 | Q14 | Async batch with semaphore, retry-after, full jitter, per-item error isolation | code | medium | yes | Common LLM-app task; checks retry amplification knowledge [S40] |
| R8 | Q19 | Pagination loop that drops the last page or never ends: find and fix | debug | easy | yes | Company-reported (Sierra); `has_more` and cursor semantics are sourced [S28] |
| R9 | Q28 | AI-assistant output with a subtle bug in a small codebase: pick the defect | debug | medium | yes | Tests the verification skill Canva and Meta name [S2], [S3] |
| R10 | Q10 | KV cache bytes for a stated config, then max batch at a given memory | estimate | medium | yes | Only estimate type that fits; formula from [S48] and snippet below |
| R11 | Q6 | Which decoding method fits which task, with one correct choice | mcq | easy | no | Cheap gradable item; Hugging Face guidance is sourced [S50] |
| R12 | Q31 | "Feels dumb": turn the complaint into a hypothesis, metric and experiment | concept | medium | yes | Customer-craft core skill |
| R13 | Q33 | Explain to an executive why the model makes things up | concept | medium | no | Overlaps safety/hallucination lesson |
| R14 | Q26 | 3-hour take-home: Q&A over 50 docs with a 20-question eval; what you cut and what the README reports | design | hard | yes | Matches OpenAI's stated criteria [S7] and Anthropic's take-home principles [S8] |
| R15 | Q36 | STAR story for a shipped LLM feature with a measured outcome and a failure | behavioural | medium | yes | STAR is sourced [S22]; applies to every loop |

Core (11): R1, R2, R5, R6, R7, R8, R9, R10, R12, R14, R15. The mcq (R11) stays in the bank as a non-core gradable item; SPEC requires an mcq per track, not a core one. If the agents track already has a core debug problem on checking generated code, swap R9 for R11 in core.

## 4. Misconceptions and gotchas for lesson reviewers

### hand-write

- Top-p keeps the smallest set whose cumulative probability reaches p, so the token that crosses p is included [S44]. "Keep tokens with probability above p" is a different (wrong) filter. Sort descending first and renormalise over the kept set.
- Floating point at the boundary: summing in a different order can land at 0.7999999 instead of 0.8; tests should not put p exactly on a cumulative boundary unless the reference does the same summation.
- Temperature 0 is not a division; implement greedy as argmax. The order of temperature, top-k and top-p differs between libraries; a lesson must state the order it uses rather than claim one universal order (not sourced here).
- Min-p threshold is relative: p_base times the top probability, not an absolute floor [S45].
- Attention scale is sqrt(d_k), not d_k and not sqrt(d_model) [S43]. Apply the mask before softmax with negative infinity; multiplying weights by zero after softmax leaves rows that no longer sum to 1. A row where every position is masked (padding) produces NaN.
- The causal mask hides j > i. Off-by-one (j >= i) hides the token from itself.
- Softmax and cross-entropy: subtract the max before exp; compute cross-entropy from logits with log-sum-exp rather than taking log of a softmax output.
- BPE: at encode time apply merges in learned rank order; greedy longest-match is a different tokenizer. Sennrich's Figure 1 merges do not come from the Algorithm 1 dictionary [S46]. With that dictionary three pairs tie at count 9 on the first merge, so the result depends on tie-breaking; tests must fix a rule.
- KV cache stores K and V, not Q. The memory formula has a factor of 2 (K and V) and multiplies by batch and sequence length; grouped-query attention reduces the number of KV heads, not query heads.
- Beam search sums log-probabilities; Hugging Face recommends it for input-grounded tasks, not open-ended text [S50]. It returns the highest overall probability, which is not the same as the best answer.
- LoRA: B starts at zero, so the adapted layer initially equals the base layer; alpha / r scaling is part of the forward pass [S49].
- Cosine similarity is undefined for a zero vector. For OpenAI embeddings the dot product already equals cosine because vectors have length 1 [S36]; other providers may differ, so do not generalise.
- AUC ties count one half; dropping ties inflates or deflates the score.

### llm-app-coding

- Retrying on top of the SDK multiplies attempts: both the Anthropic and OpenAI SDKs already retry twice by default [S25], [S33]. A lesson that adds its own retry loop should set `max_retries=0` or explain the product of attempts. Retrying at every layer amplifies load (243x in the AWS five-layer example) [S40].
- Honour `retry-after` when present [S24]. A 429 from the monthly spend cap has no `retry-after` and will not clear by retrying [S24].
- Do not retry 400-class validation errors; retry 429, 5xx, 529 and connection errors. Side-effecting calls need idempotency before retrying [S40].
- Streams are not retried automatically by the OpenAI SDK because replay could duplicate output [S33]. Retrying a stream needs resume logic, and the Claude resume method changed at 4.6 [S26].
- SSE chunk boundaries do not align with events or lines; buffer until a blank line [S38]. Multiple `data:` lines join with a newline. Strip one space after the colon, not all whitespace. Ignore comment lines and `ping` events; handle unknown event types without crashing [S26].
- `message_delta` usage is cumulative; summing every delta over-counts output tokens [S26].
- `partial_json` fragments are not valid JSON on their own; parse once at `content_block_stop` or use a partial-JSON parser [S26].
- An error can arrive after HTTP 200 inside the stream [S26]; status-code checks alone miss it.
- Token bucket is not a fixed window: capacity refills continuously, and 60 RPM may be enforced per second [S24]. A limiter charged per request misses token-heavy requests; the Claude API limits input and output tokens separately and does not charge `max_tokens` against OTPM [S24].
- Tool results: every `tool_use` id needs exactly one `tool_result` in the next user turn, placed before any text; parallel calls return all results in one message [S29]. Report tool failures with `is_error: true` instead of raising out of the loop.
- Forcing a tool with `tool_choice` returns 400 on Opus 5.5, Sonnet 5.5, Fable 5.1 and Mythos 5.1 [S25]. Code samples copied from older docs will break.
- Batch results are unordered on both providers; join on `custom_id` [S28], [S34]. Requests still unprocessed at 24 hours expire (Claude does not bill expired requests) [S27].
- Pagination: stop on `has_more == false`, not on an empty page; pass `last_id` as `after_id` [S28]. Guard against a cursor that does not advance.
- Conversation memory: trim whole turns, keep the history starting on a user turn, and never split a tool_use from its tool_result. On the newest Claude models, a replayed thinking block whose earlier history was edited is rejected or dropped, so trimming must keep the history append-only or strip those blocks [S25].
- Pyodide has no working threads or sockets and its event loop cannot block [S41], [S42]. Code problems must use fake clocks and injected `sleep` functions; `threading`-based rate limiters and `time.sleep` backoff tests will not run in the browser runner.

### take-home-debug

- Anthropic's default is no AI on take-homes unless the instructions say otherwise [S1]; the performance take-home is an explicit exception [S8]. Lessons must not say "Anthropic bans AI in all assessments" or "Anthropic allows AI on take-homes".
- The performance take-home time limit changed from 4 hours to 2 hours [S8]; quote the version.
- No public rubric exists for most AI-company take-homes. OpenAI's stated criteria [S7] are the only official rubric-like text found; vendor rubrics are unverified.
- Vendor statistics in [S15] ("roughly 60%", "73%") have no citation and must not be repeated.

### ai-collab-coding

- Policies differ by company and by round, and change over time [S1], [S2], [S3], [S7]. A lesson must date each policy and tell the reader to confirm with the recruiter, which OpenAI and Meta both say [S7], [S3].
- Meta says candidates are expected to use the assistant and that no outside AI tools are allowed [S3]. Older vendor posts quote Meta materials calling AI use optional [S6]; that may be stale.
- Google's pilot is reported by press only, with the spokesperson quote second-hand [S51].
- The scored behaviours that have official wording are Canva's five questions [S2]. Four-dimension rubrics attributed to Anthropic or Meta come from vendor guides.

### customer-craft

- The Anthropic customer-discovery simulation is unverified; label it "reported by prep guides" and avoid stating its length or weight as fact [S15], [S16].
- FDE posts list deliverables (MCP servers, sub-agents, agent skills) and travel ranges; quote them with the posting date because postings close and change [S11], [S12].
- Pitching instead of asking is the failure mode vendor guides describe; the source is a vendor guide [S15], so present it as practice advice, not as a known scoring rule.

### behavioural

- Amazon lists 16 Leadership Principles on its current page [S23]; check any count copied from an older prep guide against that page.
- STAR answers should name the candidate's own action ("I") and a measured result [S22]. A lesson's example metrics must be labelled as a scenario, never presented as a real outcome.
- Anthropic's values list on the careers page [S10] is the only primary source for values-round preparation; question lists attributed to Anthropic values rounds are vendor-sourced [S13], [S14].

## 5. Runnable Python snippets
All snippets are Python 3 standard library only, so they fit the Pyodide code runner (SPEC section 6). Each was run with CPython 3.12.6 on Windows on 2026-10-28 and its asserts passed; the printed output is shown under each. None was run inside Pyodide: mark them **verified in CPython, unverified in Pyodide**. Snippets 7 and 10 were written to avoid threads and blocking sleeps because of the Pyodide limits in [S41] and [S42].

### 5.1 s1_softmax.py

Stable softmax, log-sum-exp cross-entropy and the one-pass online normaliser [S47]. Module: hand-write.

```python
import math

def softmax(xs):
    m = max(xs)                      # subtract the max so exp() cannot overflow
    exps = [math.exp(x - m) for x in xs]
    s = sum(exps)
    return [e / s for e in exps]

def logsumexp(xs):
    m = max(xs)
    return m + math.log(sum(math.exp(x - m) for x in xs))

def cross_entropy(logits, target):
    return logsumexp(logits) - logits[target]

def online_softmax_normalizer(xs):
    # one pass: running max m and running sum d (Milakov and Gimelshein 2018)
    m, d = float("-inf"), 0.0
    for x in xs:
        m_new = max(m, x)
        d = d * math.exp(m - m_new) + math.exp(x - m_new)
        m = m_new
    return m, d

p = softmax([1000.0, 1001.0, 1002.0])
assert abs(sum(p) - 1) < 1e-12 and p[2] > p[1] > p[0]
assert abs(cross_entropy([2.0, 1.0, 0.1], 0) - 0.4170300162778335) < 1e-12
m, d = online_softmax_normalizer([1000.0, 1001.0, 1002.0])
assert abs(math.exp(1002.0 - m) / d - p[2]) < 1e-12
print("softmax ok", [round(v, 4) for v in p])
```

Output:

```text
softmax ok [0.09, 0.2447, 0.6652]
```

### 5.2 s2_attention.py

Causal scaled dot-product attention in pure Python lists, no NumPy [S43]. Module: hand-write.

```python
import math

def matmul(a, b):
    return [[sum(a[i][k] * b[k][j] for k in range(len(b))) for j in range(len(b[0]))]
            for i in range(len(a))]

def transpose(m):
    return [list(r) for r in zip(*m)]

def softmax_row(row):
    m = max(row)
    e = [math.exp(x - m) if x != float("-inf") else 0.0 for x in row]
    s = sum(e)
    return [x / s for x in e]

def attention(Q, K, V, causal=True):
    d_k = len(Q[0])
    scores = matmul(Q, transpose(K))                       # (T, T)
    for i in range(len(scores)):
        for j in range(len(scores[0])):
            scores[i][j] /= math.sqrt(d_k)
            if causal and j > i:                           # mask the future
                scores[i][j] = float("-inf")
    weights = [softmax_row(r) for r in scores]
    return matmul(weights, V), weights

Q = [[1.0, 0.0], [0.0, 1.0], [1.0, 1.0]]
K = [[1.0, 0.0], [0.0, 1.0], [1.0, 1.0]]
V = [[1.0, 2.0], [3.0, 4.0], [5.0, 6.0]]
out, w = attention(Q, K, V)
assert w[0] == [1.0, 0.0, 0.0]                  # first token can only see itself
assert all(abs(sum(r) - 1) < 1e-12 for r in w)
assert out[0] == [1.0, 2.0]
print("attention ok", [[round(x, 4) for x in r] for r in out])
```

Output:

```text
attention ok [[1.0, 2.0], [2.3395, 3.3395], [3.5105, 4.5105]]
```

### 5.3 s3_sampling.py

Temperature, top-p [S44] and min-p [S45] filters with a seeded sampler. Module: hand-write.

```python
import math, random

def probs_from_logits(logits, temperature=1.0):
    if temperature <= 0:
        raise ValueError("use argmax for greedy decoding, not temperature 0")
    z = [x / temperature for x in logits]
    m = max(z)
    e = [math.exp(x - m) for x in z]
    s = sum(e)
    return [x / s for x in e]

def top_p_filter(probs, p):
    # smallest set whose cumulative probability reaches p (Holtzman et al. 2020), then renormalise
    order = sorted(range(len(probs)), key=lambda i: probs[i], reverse=True)
    keep, cum = [], 0.0
    for i in order:
        keep.append(i)
        cum += probs[i]
        if cum >= p:
            break
    total = sum(probs[i] for i in keep)
    return {i: probs[i] / total for i in keep}

def min_p_filter(probs, p_base):
    # keep tokens with probability >= p_base * p_max (Nguyen et al., ICLR 2025)
    threshold = p_base * max(probs)
    keep = [i for i, q in enumerate(probs) if q >= threshold]
    total = sum(probs[i] for i in keep)
    return {i: probs[i] / total for i in keep}

def sample(dist, rng):
    r, cum = rng.random(), 0.0
    for i, q in dist.items():
        cum += q
        if r < cum:
            return i
    return i                                            # guard against float round-off

probs = [0.5, 0.3, 0.15, 0.05]
assert sorted(top_p_filter(probs, 0.8)) == [0, 1]       # 0.5 + 0.3 reaches 0.8
assert sorted(top_p_filter(probs, 0.81)) == [0, 1, 2]
assert sorted(min_p_filter(probs, 0.2)) == [0, 1, 2]    # threshold 0.2 * 0.5 = 0.1
rng = random.Random(0)
draws = [sample(top_p_filter(probs, 0.8), rng) for _ in range(10000)]
assert set(draws) == {0, 1}
print("sampling ok", round(draws.count(0) / len(draws), 3))
```

Output:

```text
sampling ok 0.623
```

### 5.4 s4_bpe.py

BPE training with an explicit tie-break and rank-ordered encoding on the Sennrich dictionary [S46]. The first merge printed is ('e', 's') because of the tie-break rule; three pairs tie at 9. Module: hand-write.

```python
from collections import Counter

def train_bpe(word_counts, num_merges):
    # word_counts: {"low": 5, ...}; words are split into characters plus an end-of-word marker
    vocab = {tuple(w) + ("</w>",): c for w, c in word_counts.items()}
    merges = []
    for _ in range(num_merges):
        pairs = Counter()
        for symbols, c in vocab.items():
            for a, b in zip(symbols, symbols[1:]):
                pairs[(a, b)] += c
        if not pairs:
            break
        # deterministic tie-break: highest count, then lexicographically smallest pair
        best = min(pairs, key=lambda p: (-pairs[p], p))
        merges.append(best)
        new_vocab = {}
        for symbols, c in vocab.items():
            out, i = [], 0
            while i < len(symbols):
                if i + 1 < len(symbols) and (symbols[i], symbols[i + 1]) == best:
                    out.append(symbols[i] + symbols[i + 1]); i += 2
                else:
                    out.append(symbols[i]); i += 1
            new_vocab[tuple(out)] = c
        vocab = new_vocab
    return merges

def encode_word(word, merges):
    # apply merges in the order they were learned (rank order), not greedily by length
    ranks = {m: r for r, m in enumerate(merges)}
    symbols = list(word) + ["</w>"]
    while True:
        candidates = [(ranks[p], i) for i, p in enumerate(zip(symbols, symbols[1:])) if p in ranks]
        if not candidates:
            return symbols
        _, i = min(candidates)
        symbols[i:i + 2] = [symbols[i] + symbols[i + 1]]

# the dictionary from Algorithm 1 of Sennrich et al. (2016)
merges = train_bpe({"low": 5, "lower": 2, "newest": 6, "widest": 3}, 10)
print("merges", merges[:4])
assert merges[0] in {("e", "s"), ("s", "t"), ("t", "</w>")}   # all three pairs have count 9
assert encode_word("lowest", merges)[-1].endswith("</w>")
print("bpe ok", encode_word("lowest", merges))
```

Output:

```text
merges [('e', 's'), ('es', 't'), ('est', '</w>'), ('l', 'o')]
bpe ok ['low', 'est</w>']
```

### 5.5 s5_kvcache.py

KV cache decode equals full recompute, plus the KV cache size formula [S48]. The config in the last line is a toy, not a real model. Module: hand-write (estimate).

```python
import math, random

def attend(q, keys, values):
    d = len(q)
    scores = [sum(a * b for a, b in zip(q, k)) / math.sqrt(d) for k in keys]
    m = max(scores)
    w = [math.exp(s - m) for s in scores]
    z = sum(w)
    return [sum(wi * v[j] for wi, v in zip(w, values)) / z for j in range(len(values[0]))]

rng = random.Random(1)
T, d = 5, 4
xs = [[rng.uniform(-1, 1) for _ in range(d)] for _ in range(T)]
proj = lambda x, s: [xi * s for xi in x]          # stand-in for W_q, W_k, W_v

# without a cache: recompute K and V for the whole prefix at every step
no_cache = []
for t in range(T):
    keys = [proj(x, 0.5) for x in xs[:t + 1]]
    vals = [proj(x, 2.0) for x in xs[:t + 1]]
    no_cache.append(attend(proj(xs[t], 1.0), keys, vals))

# with a cache: append one K and one V per step, reuse the rest
k_cache, v_cache, cached = [], [], []
for t in range(T):
    k_cache.append(proj(xs[t], 0.5)); v_cache.append(proj(xs[t], 2.0))
    cached.append(attend(proj(xs[t], 1.0), k_cache, v_cache))

assert all(abs(a - b) < 1e-12 for r1, r2 in zip(no_cache, cached) for a, b in zip(r1, r2))

def kv_cache_bytes(layers, kv_heads, head_dim, seq_len, batch, bytes_per_elem):
    return 2 * layers * kv_heads * head_dim * seq_len * batch * bytes_per_elem   # 2 = K and V

# toy config, not a real model: 32 layers, 8 KV heads, head_dim 128, 8,192 tokens, fp16
print("kv cache ok", kv_cache_bytes(32, 8, 128, 8192, 1, 2) / 2**30, "GiB")
```

Output:

```text
kv cache ok 1.0 GiB
```

### 5.6 s6_beam.py

Beam search over a toy model where greedy is not optimal (0.30 versus 0.36) [S50]. Module: hand-write.

```python
import math

def beam_search(next_logprobs, start, beam_width, max_len, eos):
    # next_logprobs(seq) -> {token: logprob}; scores are sums of log-probabilities
    beams = [(0.0, [start])]
    finished = []
    for _ in range(max_len):
        candidates = []
        for score, seq in beams:
            for tok, lp in next_logprobs(seq).items():
                candidates.append((score + lp, seq + [tok]))
        candidates.sort(key=lambda c: c[0], reverse=True)
        beams = []
        for score, seq in candidates[:beam_width]:
            (finished if seq[-1] == eos else beams).append((score, seq))
        if not beams:
            break
    finished.extend(beams)
    return max(finished, key=lambda c: c[0])

# toy model where greedy picks "a" first but "b" leads to a more likely sequence
table = {
    ("<s>",): {"a": math.log(0.6), "b": math.log(0.4)},
    ("<s>", "a"): {"x": math.log(0.5), "y": math.log(0.5)},
    ("<s>", "b"): {"x": math.log(0.9), "y": math.log(0.1)},
}
def model(seq):
    return table.get(tuple(seq), {"</s>": 0.0})

greedy = beam_search(model, "<s>", 1, 3, "</s>")
beam = beam_search(model, "<s>", 2, 3, "</s>")
assert greedy[1][:3] == ["<s>", "a", "x"] and beam[1][:3] == ["<s>", "b", "x"]
print("beam ok", round(math.exp(greedy[0]), 2), round(math.exp(beam[0]), 2))
```

Output:

```text
beam ok 0.3 0.36
```

### 5.7 s7_ratelimit_retry.py

Token bucket with an injected clock [S24] and retry that obeys retry-after, else full jitter [S39], [S40]. No real sleeping, so it can run in Pyodide. Module: llm-app-coding.

```python
import random

class TokenBucket:
    """Capacity refills continuously at `rate` per second, like the Claude API limiter."""
    def __init__(self, capacity, rate, now):
        self.capacity, self.rate = capacity, rate
        self.tokens, self.last = capacity, now

    def try_take(self, cost, now):
        self.tokens = min(self.capacity, self.tokens + (now - self.last) * self.rate)
        self.last = now
        if cost > self.capacity:
            raise ValueError("request can never fit in this bucket")
        if self.tokens >= cost:
            self.tokens -= cost
            return 0.0                                  # no wait
        return (cost - self.tokens) / self.rate         # seconds until it would fit

class Transient(Exception):
    def __init__(self, retry_after=None):
        self.retry_after = retry_after

def call_with_retries(fn, sleep, rng, max_retries=4, base=0.5, cap=30.0):
    for attempt in range(max_retries + 1):
        try:
            return fn()
        except Transient as e:
            if attempt == max_retries:
                raise
            if e.retry_after is not None:
                delay = e.retry_after                   # the server told us; obey it
            else:
                delay = rng.uniform(0, min(cap, base * 2 ** attempt))   # "full jitter"
            sleep(delay)

# deterministic test with a fake clock: no real sleeping, works in Pyodide
b = TokenBucket(capacity=10, rate=2, now=0.0)
assert b.try_take(8, now=0.0) == 0.0
assert b.try_take(5, now=0.0) == 1.5                    # 2 tokens left, need 3 more at 2/s
assert b.try_take(5, now=1.5) == 0.0

slept, calls = [], {"n": 0}
def flaky():
    calls["n"] += 1
    if calls["n"] == 1:
        raise Transient(retry_after=2.0)
    if calls["n"] < 4:
        raise Transient()
    return "ok"

assert call_with_retries(flaky, slept.append, random.Random(0)) == "ok"
assert slept[0] == 2.0 and len(slept) == 3 and all(0 <= s <= 30 for s in slept)
print("bucket and retry ok", [round(s, 3) for s in slept])
```

Output:

```text
bucket and retry ok [2.0, 0.844, 1.516]
```

### 5.8 s8_sse.py

Incremental SSE parser tested at every split point of a Claude-style stream, then `partial_json` accumulation [S26], [S38]. Module: llm-app-coding.

```python
import json

class SSEParser:
    """Incremental parser for text/event-stream. Feed arbitrary chunks; get complete events."""
    def __init__(self):
        self.buf = ""
        self.event, self.data = "", []

    def feed(self, chunk):
        self.buf += chunk
        events = []
        while True:
            # a line ends at CRLF, LF or CR; wait for more input if a CR might be half of CRLF
            idx = min((i for i in (self.buf.find("\r\n"), self.buf.find("\n"), self.buf.find("\r")) if i != -1),
                      default=-1)
            if idx == -1 or (self.buf[idx] == "\r" and idx == len(self.buf) - 1):
                return events
            line = self.buf[:idx]
            self.buf = self.buf[idx + (2 if self.buf.startswith("\r\n", idx) else 1):]
            if line == "":                              # blank line dispatches the event
                if self.data:
                    events.append((self.event or "message", "\n".join(self.data)))
                self.event, self.data = "", []
            elif line.startswith(":"):                  # comment, ignore
                continue
            else:
                field, _, value = line.partition(":")
                if value.startswith(" "):
                    value = value[1:]                   # strip exactly one leading space
                if field == "event":
                    self.event = value
                elif field == "data":
                    self.data.append(value)

stream = (
    'event: content_block_delta\r\n'
    'data: {"type":"content_block_delta","index":0,"delta":{"type":"input_json_delta","partial_json":"{\\"city\\": \\"Par"}}\r\n\r\n'
    ': keep-alive comment\n\n'
    'event: content_block_delta\n'
    'data: {"type":"content_block_delta","index":0,"delta":{"type":"input_json_delta","partial_json":"is\\"}"}}\n\n'
    'event: ping\ndata: {"type":"ping"}\n\n'
)
# split at every possible boundary, including between \r and \n, and check the result never changes
expected = None
for cut in range(1, len(stream)):
    p = SSEParser()
    evs = p.feed(stream[:cut]) + p.feed(stream[cut:])
    expected = expected or evs
    assert evs == expected, cut

partial = ""
for name, data in expected:
    msg = json.loads(data)
    if msg["type"] == "content_block_delta" and msg["delta"]["type"] == "input_json_delta":
        partial += msg["delta"]["partial_json"]         # parse only after content_block_stop
assert json.loads(partial) == {"city": "Paris"}
print("sse ok", [e[0] for e in expected])
```

Output:

```text
sse ok ['content_block_delta', 'content_block_delta', 'ping']
```

### 5.9 s9_tools.py

Tool dispatcher with one `tool_result` per `tool_use`, `is_error` for failures and a step budget [S29]. Module: llm-app-coding.

```python
import json

TOOLS = {}
def tool(fn):
    TOOLS[fn.__name__] = fn
    return fn

@tool
def get_weather(city: str) -> str:
    return {"Paris": "18 C"}.get(city, "unknown city")

def run_agent(model_step, user_msg, max_steps=5):
    """model_step(messages) returns an assistant message dict with a content list."""
    messages = [{"role": "user", "content": user_msg}]
    for _ in range(max_steps):
        reply = model_step(messages)
        messages.append(reply)
        calls = [b for b in reply["content"] if b["type"] == "tool_use"]
        if reply.get("stop_reason") != "tool_use" or not calls:
            return messages
        results = []
        for c in calls:                                  # every tool_use gets exactly one tool_result
            fn = TOOLS.get(c["name"])
            try:
                if fn is None:
                    raise KeyError(f"no tool named {c['name']}")
                out, err = fn(**c["input"]), False
            except Exception as e:                       # report the error to the model, do not crash
                out, err = f"{type(e).__name__}: {e}", True
            results.append({"type": "tool_result", "tool_use_id": c["id"], "content": out, "is_error": err})
        messages.append({"role": "user", "content": results})   # all results in one user turn
    raise RuntimeError("step budget exhausted")

script = iter([
    {"role": "assistant", "stop_reason": "tool_use", "content": [
        {"type": "tool_use", "id": "t1", "name": "get_weather", "input": {"city": "Paris"}},
        {"type": "tool_use", "id": "t2", "name": "get_forecast", "input": {}}]},
    {"role": "assistant", "stop_reason": "end_turn", "content": [{"type": "text", "text": "18 C in Paris."}]},
])
msgs = run_agent(lambda m: next(script), "Weather in Paris?")
res = msgs[2]["content"]
assert [r["tool_use_id"] for r in res] == ["t1", "t2"] and res[1]["is_error"] is True
looping = lambda m: {"role": "assistant", "stop_reason": "tool_use", "content": [
    {"type": "tool_use", "id": f"t{len(m)}", "name": "get_weather", "input": {"city": "Paris"}}]}
try:
    run_agent(looping, "loop", max_steps=3); raise AssertionError("should stop")
except RuntimeError:
    pass
print("tool dispatch ok", json.dumps(res[1]))
```

Output:

```text
tool dispatch ok {"type": "tool_result", "tool_use_id": "t2", "content": "KeyError: 'no tool named get_forecast'", "is_error": true}
```

### 5.10 s10_async_batch.py

Async batch with a semaphore, retry with jitter for transient errors, no retry for permanent ones, per-item error isolation, results ordered by index. Uses `asyncio.run`; in Pyodide call `await run_batch(...)` at top level instead, because the browser event loop cannot block [S42]. Module: llm-app-coding.

```python
import asyncio, random

async def run_batch(items, call, concurrency=4, max_retries=3, base=0.01, seed=0):
    sem = asyncio.Semaphore(concurrency)
    rng = random.Random(seed)
    in_flight = {"now": 0, "peak": 0}

    async def one(idx, item):
        async with sem:
            in_flight["now"] += 1
            in_flight["peak"] = max(in_flight["peak"], in_flight["now"])
            try:
                for attempt in range(max_retries + 1):
                    try:
                        return idx, "ok", await call(item)
                    except TimeoutError as e:            # transient: retry with jitter
                        if attempt == max_retries:
                            return idx, "error", repr(e)
                        await asyncio.sleep(rng.uniform(0, base * 2 ** attempt))
                    except ValueError as e:              # permanent: do not retry
                        return idx, "error", repr(e)
            finally:
                in_flight["now"] -= 1

    results = await asyncio.gather(*(one(i, x) for i, x in enumerate(items)))
    return sorted(results), in_flight["peak"]              # results keyed by index, not arrival order

attempts = {}
async def fake_llm(x):
    attempts[x] = attempts.get(x, 0) + 1
    await asyncio.sleep(0.001)
    if x == 3 and attempts[x] < 3:
        raise TimeoutError("slow")
    if x == 7:
        raise ValueError("bad input")
    return x * 10

results, peak = asyncio.run(run_batch(list(range(10)), fake_llm))
assert peak <= 4
assert results[3] == (3, "ok", 30) and attempts[3] == 3
assert results[7][1] == "error" and attempts[7] == 1      # one bad item does not sink the batch
print("async batch ok", peak, sum(1 for r in results if r[1] == "ok"))
```

Output:

```text
async batch ok 4 9
```

### 5.11 s11_pagination_memory.py

Cursor pagination modelled on `after_id` / `last_id` / `has_more` [S28] with a stuck-cursor guard, and a token-budget history trimmer that drops whole turns. Word count stands in for a tokenizer. Module: llm-app-coding.

```python
def paginate(fetch_page, limit=2):
    """fetch_page(after_id, limit) -> {"data": [...], "has_more": bool, "last_id": str|None}"""
    after = None
    while True:
        page = fetch_page(after, limit)
        yield from page["data"]
        if not page["has_more"]:
            return
        if page["last_id"] is None or page["last_id"] == after:
            raise RuntimeError("cursor did not advance")   # guard against an infinite loop
        after = page["last_id"]

DB = [{"id": f"b{i}"} for i in range(5)]
def fake_list(after_id, limit):
    start = 0 if after_id is None else [r["id"] for r in DB].index(after_id) + 1
    data = DB[start:start + limit]
    return {"data": data, "has_more": start + limit < len(DB), "last_id": data[-1]["id"] if data else None}

assert [r["id"] for r in paginate(fake_list)] == ["b0", "b1", "b2", "b3", "b4"]

def fit_history(system, turns, budget, count=lambda s: len(s.split())):
    """Keep the system prompt and the newest turns that fit; drop whole turns, oldest first."""
    used = count(system)
    kept = []
    for t in reversed(turns):
        cost = count(t["content"])
        if used + cost > budget:
            break
        kept.append(t); used += cost
    kept.reverse()
    while kept and kept[0]["role"] != "user":          # history must start on a user turn
        kept.pop(0)
    return kept

turns = [{"role": "user", "content": "one two three"}, {"role": "assistant", "content": "four five"},
         {"role": "user", "content": "six"}, {"role": "assistant", "content": "seven eight"},
         {"role": "user", "content": "nine ten"}]
kept = fit_history("be brief", turns, budget=9)
assert [t["content"] for t in kept] == ["six", "seven eight", "nine ten"]
print("pagination and memory ok")
```

Output:

```text
pagination and memory ok
```

### 5.12 s12_metrics.py

Cosine similarity with a zero-vector guard and AUC two ways (pairwise and rank-sum) checked against each other, ties counted as one half. Module: hand-write.

```python
import math

def cosine(a, b):
    na, nb = math.sqrt(sum(x * x for x in a)), math.sqrt(sum(x * x for x in b))
    if na == 0 or nb == 0:
        raise ValueError("cosine similarity is undefined for a zero vector")
    return sum(x * y for x, y in zip(a, b)) / (na * nb)

def auc(scores, labels):
    """Probability a random positive outranks a random negative; ties count one half."""
    pos = [s for s, y in zip(scores, labels) if y == 1]
    neg = [s for s, y in zip(scores, labels) if y == 0]
    if not pos or not neg:
        raise ValueError("AUC needs at least one positive and one negative")
    wins = sum(1.0 if p > n else 0.5 if p == n else 0.0 for p in pos for n in neg)
    return wins / (len(pos) * len(neg))

def auc_fast(scores, labels):
    """O(n log n) rank-sum (Mann-Whitney U) form with average ranks for ties."""
    order = sorted(range(len(scores)), key=lambda i: scores[i])
    ranks = [0.0] * len(scores)
    i = 0
    while i < len(order):
        j = i
        while j + 1 < len(order) and scores[order[j + 1]] == scores[order[i]]:
            j += 1
        for k in range(i, j + 1):
            ranks[order[k]] = (i + j) / 2 + 1
        i = j + 1
    n_pos = sum(labels); n_neg = len(labels) - n_pos
    rank_sum = sum(r for r, y in zip(ranks, labels) if y == 1)
    return (rank_sum - n_pos * (n_pos + 1) / 2) / (n_pos * n_neg)

assert abs(cosine([1, 0], [1, 1]) - 1 / math.sqrt(2)) < 1e-12
s, y = [0.9, 0.8, 0.8, 0.3, 0.1], [1, 0, 1, 0, 0]
assert auc(s, y) == auc_fast(s, y) == 5.5 / 6
print("metrics ok", round(auc(s, y), 4))
```

Output:

```text
metrics ok 0.9167
```

### 5.13 s13_lora.py

LoRA layer: zero-initialised B so the first forward pass equals the base layer, and merged weights give the same output [S49]. Module: hand-write.

```python
import random

def matvec(M, x):
    return [sum(m * xi for m, xi in zip(row, x)) for row in M]

class LoRALinear:
    """y = W0 x + (alpha / r) * B A x, with W0 frozen, A random, B zero (Hu et al. 2021)."""
    def __init__(self, W0, r, alpha, rng):
        d, k = len(W0), len(W0[0])
        self.W0, self.scale = W0, alpha / r
        self.A = [[rng.gauss(0, 0.02) for _ in range(k)] for _ in range(r)]   # r x k
        self.B = [[0.0] * r for _ in range(d)]                                 # d x r

    def __call__(self, x):
        base = matvec(self.W0, x)
        delta = matvec(self.B, matvec(self.A, x))
        return [b + self.scale * dl for b, dl in zip(base, delta)]

    def merged(self):
        BA = [[sum(self.B[i][t] * self.A[t][j] for t in range(len(self.A))) for j in range(len(self.A[0]))]
              for i in range(len(self.B))]
        return [[w + self.scale * ba for w, ba in zip(wr, bar)] for wr, bar in zip(self.W0, BA)]

rng = random.Random(0)
W0 = [[rng.uniform(-1, 1) for _ in range(6)] for _ in range(4)]
layer = LoRALinear(W0, r=2, alpha=4, rng=rng)
x = [rng.uniform(-1, 1) for _ in range(6)]
assert layer(x) == matvec(W0, x)                         # B = 0, so training starts at the base model
layer.B[0][1] = 0.5                                      # pretend one gradient step happened
assert all(abs(a - b) < 1e-12 for a, b in zip(layer(x), matvec(layer.merged(), x)))
print("lora ok, trainable", 2 * 6 + 4 * 2, "vs full", 4 * 6)
```

Output:

```text
lora ok, trainable 20 vs full 24
```

## 6. Sources

All checked 2026-10-28. "Source date" is the date printed on the page, or "undated" when none is shown.

| Id | Title | URL | Provenance | Source date |
|---|---|---|---|---|
| S1 | How to collaborate with Claude during our hiring process (Guidance on candidates' AI usage) | https://www.anthropic.com/candidate-ai-guidance | official | last updated 2025-07-10 |
| S2 | Yes, You Can Use AI in Our Interviews (Simon Newton, Canva) | https://canva.dev/blog/engineering/yes-you-can-use-ai-in-our-interviews | official | 2025-06-11 |
| S3 | Meta Careers: hiring process | https://www.metacareers.com/hiring-process/ | official | undated |
| S4 | Meta is going to let job candidates use AI during coding tests (Jason Koebler, 404 Media) | https://www.404media.co/meta-is-going-to-let-job-candidates-use-ai-during-coding-tests/ | press | 2025-07-29 |
| S5 | Meta AI-enabled coding interview guide (Evan King, Hello Interview) | https://hellointerview.com/blog/meta-ai-enabled-coding | vendor guide | undated, refers to Oct 2025 rollout |
| S6 | How to use AI in Meta's AI-assisted coding interview (Githire B. Wahome, interviewing.io) | https://interviewing.io/blog/how-to-use-ai-in-meta-s-ai-assisted-coding-interview-with-real-prompts-and-examples | vendor guide | undated |
| S7 | OpenAI interview guide | https://openai.com/interview-guide/ | official | undated |
| S8 | Designing AI-resistant technical evaluations (Tristan Hume, Anthropic) | https://www.anthropic.com/engineering/AI-resistant-technical-evaluations | official | 2026-01-21 |
| S9 | anthropics/original_performance_takehome | https://github.com/anthropics/original_performance_takehome | official | repo created 2026-01-19 |
| S10 | Anthropic careers | https://www.anthropic.com/careers | official | undated |
| S11 | Anthropic job post: Forward Deployed Engineer, London | https://job-boards.greenhouse.io/anthropic/jobs/5423029008 | official | posted 2026-09-14 per the General Catalyst job-board mirror |
| S12 | OpenAI job post: Forward Deployed Software Engineer, SF | https://openai.com/careers/forward-deployed-software-engineer-sf/ | official | undated |
| S13 | Anthropic Forward Deployed Engineer interview guide (Aced, formerly Exponent) | https://www.aced.io/guides/anthropic-forward-deployed-engineer-interview | vendor guide | undated ("updated a month ago") |
| S14 | Anthropic interview process (Aced) | https://www.aced.io/blog/anthropic-interview-process | vendor guide | undated |
| S15 | Anthropic Applied AI Engineer interview process (Perspective AI) | https://getperspective.ai/blog/anthropic-applied-ai-engineer-interview-process-frontier-lab-2026/markdown | vendor guide | 2026-05-29 |
| S16 | What applied-AI engineer interviews test in 2026 (techinterview.org) | https://www.techinterview.org/post/3233476824/ai-engineer-interview-rag-agents-evals/ | vendor guide | 2026-07-23 |
| S17 | Sierra AI Senior AI Engineer interview experience (Aced) | https://www.aced.io/experiences/sierra-ai-senior-ai-engineer-interview-087f4e | candidate report | undated |
| S18 | In-Memory Database: Implement SQL-Like Operations (Hello Interview community) | https://www.hellointerview.com/community/questions/memory-database-sql/cmbsl00wk004v07adwuorveqo | candidate report | reports dated 2026-03 to 2026-06 |
| S19 | Anthropic SWE interview: web crawler with a late multithreading push (PracHub) | https://prachub.com/interview-experiences/anthropic-software-engineer-interview-experience-a-web-crawler-question-that-turned-into-a-late-multithreading-push | candidate report | interview Sep 2025, page 2026-08-24 |
| S20 | amitshekhariitbhu/ai-engineering-interview-questions (Apache-2.0) | https://github.com/amitshekhariitbhu/ai-engineering-interview-questions | question bank | last push 2026-10-26 |
| S21 | bbruceyuan/AI-Interview-Code (Apache-2.0) | https://github.com/bbruceyuan/AI-Interview-Code | question bank | last push 2026-05-04 |
| S22 | Amazon interview guide (About Amazon) | https://www.aboutamazon.com/news/workplace/amazon-interview-guide | official | undated |
| S23 | Amazon Leadership Principles | https://www.amazon.jobs/content/en/our-workplace/leadership-principles | official | undated |
| S24 | Claude API: Rate limits | https://platform.claude.com/docs/en/api/rate-limits | official docs | undated, checked |
| S25 | Claude API: Errors | https://platform.claude.com/docs/en/api/errors | official docs | undated, checked |
| S26 | Claude API: Streaming messages | https://platform.claude.com/docs/en/build-with-claude/streaming | official docs | undated, checked |
| S27 | Claude API: Batch processing | https://platform.claude.com/docs/en/build-with-claude/batch-processing | official docs | undated, checked |
| S28 | Claude API: List Message Batches | https://platform.claude.com/docs/en/api/messages/batches/list | official docs | undated, checked |
| S29 | Claude API: Handle tool calls | https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls | official docs | undated, checked |
| S30 | Claude API: Define tools | https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools | official docs | undated, checked |
| S31 | Claude API: Context editing | https://platform.claude.com/docs/en/build-with-claude/context-editing | official docs | strategy ids dated 2025-06-27 to 2025-10-15 |
| S32 | Writing effective tools for AI agents (Ken Aizawa, Anthropic) | https://www.anthropic.com/engineering/writing-tools-for-agents | official | 2025-09-11 |
| S33 | openai/openai-python README | https://github.com/openai/openai-python | official | main branch, checked |
| S34 | OpenAI Batch API guide | https://developers.openai.com/api/docs/guides/batch | official docs | undated, checked |
| S35 | OpenAI streaming responses guide | https://developers.openai.com/api/docs/guides/streaming-responses | official docs | undated, checked |
| S36 | OpenAI embeddings guide (FAQ) | https://developers.openai.com/api/docs/guides/embeddings | official docs | undated, checked |
| S37 | LangGraph persistence | https://docs.langchain.com/oss/python/langgraph/persistence | official docs | undated, no version stated |
| S38 | HTML Living Standard: Server-sent events | https://html.spec.whatwg.org/multipage/server-sent-events.html | spec | living standard, checked |
| S39 | Exponential Backoff And Jitter (Marc Brooker, AWS Architecture Blog) | https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/ | official | 2015-03-04 |
| S40 | Timeouts, retries, and backoff with jitter (AWS Builders' Library) | https://builder.aws.com/content/3EumjoZascWd1oZiEgL8ORlv3qE/timeouts-retries-and-backoff-with-jitter | official | 2019-12-05 |
| S41 | Pyodide: Python compatibility and WebAssembly constraints | https://pyodide.org/en/stable/usage/wasm-constraints.html | official docs | stable docs, version 314.0.7 shown |
| S42 | Pyodide: webloop API | https://pyodide.org/en/stable/usage/api/python-api/webloop.html | official docs | stable docs |
| S43 | Attention Is All You Need (Vaswani et al.) | https://arxiv.org/abs/1706.03762 | paper | 2017 |
| S44 | The Curious Case of Neural Text Degeneration (Holtzman et al., ICLR 2020) | https://arxiv.org/abs/1904.09751 | paper | 2019, ICLR 2020 |
| S45 | Turning Up the Heat: Min-p Sampling for Creative and Coherent LLM Outputs (Nguyen et al., ICLR 2025) | https://arxiv.org/abs/2407.01082 | paper | v8 revised 2025-11-20 |
| S46 | Neural Machine Translation of Rare Words with Subword Units (Sennrich et al.) | https://arxiv.org/abs/1508.07909 | paper | 2015, ACL 2016 |
| S47 | Online normalizer calculation for softmax (Milakov and Gimelshein) | https://arxiv.org/abs/1805.02867 | paper | 2018 |
| S48 | Efficiently Scaling Transformer Inference (Pope et al.) | https://arxiv.org/abs/2211.05102 | paper | 2022 |
| S49 | LoRA: Low-Rank Adaptation of Large Language Models (Hu et al.) | https://arxiv.org/abs/2106.09685 | paper | 2021 |
| S50 | Hugging Face Transformers: Generation strategies | https://huggingface.co/docs/transformers/generation_strategies | official docs | v5.21.0 |
| S51 | Google will let candidates use AI in interviews (Chase Kell, Moneywise via Yahoo Finance) | https://finance.yahoo.com/sectors/technology/articles/asking-kid-math-test-without-151500986.html | press | 2026-05-14 |

Sources found but not opened, so not used for any fact above: 1Point3Acres Anthropic CodeSignal threads, Glassdoor reviews, LeetCode discuss posts (all returned 403 to the fetcher), the Business Insider original behind [S51], and Fortune's July 2025 report on Anthropic's policy change.
