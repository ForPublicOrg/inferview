# Gap report: AI workflow design and durable execution

Research angle: how to design and run AI workflows in production, from the workflow-or-agent decision to durable execution, retries, approvals, batch lanes, budgets, observability, testing, low-code tools, document pipelines and public case studies.

Checked: 2026-10-28. Every source below was opened on that date unless a line says otherwise. Where a page could not be fetched, the entry says so and the claim is marked unverified. Content paths reflect the tree as it stood on 2026-10-28, after lessons moved to `src/content/lessons/<track>/<module>/overview.mdx`.

Level bar: the reader ships distributed systems. Do not explain queues, retries or state machines; explain what changes when one step is a metered, non-deterministic model call.

---

## 1. What exists today, and what is missing

### What exists

Workflow material is spread across eight lessons and about a dozen problems. None of it is a module of its own, and no lesson is about workflows as the main subject.

| File | What it covers for this angle | Depth | Gap |
|---|---|---|---|
| `src/content/lessons/apis/prompting/overview.mdx`, section "One big prompt or a chain" | One paragraph naming Anthropic's five workflow patterns, one paragraph on chain versus monolith | Introductory | Patterns are named, not taught: no failure modes, no cost or latency arithmetic, no code per pattern, no gates between steps |
| `src/content/lessons/agents/agent-loop/overview.mdx`, sections "Termination", "Planning, reflection and verification" | Step, spend and wall-clock budgets; stuck detector; evaluator-optimizer as reflection | Senior | Budgets are per run, not per step; nothing on workflows as the default shape |
| `src/content/lessons/agents/memory-state/overview.mdx`, sections "Checkpoints are a write-ahead log", "Crash, then resume", "Durable execution engines" | LangGraph checkpoints and durability modes, interrupt rules, journal-plus-idempotency-key simulator (`AgentsResume` widget), Temporal determinism and the 51,200-event limit, Inngest memoized steps | Senior, the strongest existing material | One section per engine; no versioning of running workflows, no Restate, DBOS, Lambda durable functions, Cloudflare Workflows or Vercel Workflow SDK, no comparison of replay models, no testing |
| `src/content/lessons/apis/frameworks/overview.mdx`, section "Choosing, and the cost of leaving" | LangGraph's checkpointer and interrupts named as the reason to take a framework | Brief | No low-code tools at all (n8n, Dify, Flowise, Zapier) |
| `src/content/lessons/apis/api-anatomy/overview.mdx`, section "Idempotency, timeouts and the batch lane" | Claude Message Batches limits (50%, 100,000 requests or 256 MB, 24 hours, `custom_id`) | Senior | Batch as an API feature, not as a workflow stage with polling, partial failure and re-submission |
| `src/content/lessons/inference/gateways-finops/overview.mdx` | Batch pricing across providers, OpenAI batch limits | Senior | No per-step budget design, no flex tier |
| `src/content/lessons/rounds/llm-app-coding/overview.mdx`, "Six patterns the round tests" | Which errors to retry, token-bucket limiting, batch APIs for offline jobs, spend-cap 429 without `retry-after` | Senior | Retries per call, not retries inside a durable step; no retry-layer placement |
| `src/content/lessons/system-design/case-agents/overview.mdx`, "The idea: a job scheduler with an untrusted planner" | Agents as a job system with checkpoints and exactly-once effects | Senior, one paragraph | The framing is right and stops there |
| `src/content/lessons/system-design/case-retrieval/overview.mdx`, "Insurance claims", "Compliance and document-heavy workflows" | Claims pipeline token control; audit trail of document versions | Senior | No document pipeline as a workflow: no confidence routing, no review queue, no throughput design |
| `src/content/lessons/rag/ingestion/overview.mdx` | Parsing, chunking, freshness | Senior | Ingestion as retrieval prep only; extraction pipelines (fields into a system of record) are absent |

Problems that touch the angle:

| Problem | Type | What it tests | Gap |
|---|---|---|---|
| `agt-004` Workflow, ReAct loop or state machine? | concept | The control-flow dial on three systems | Good. Seniority is `[mid, senior]`; the new spec drops `mid` |
| `agt-012` A refund agent that waits for a human | design | Persistence, interrupt, resume, no double payout | Good. The only HITL design problem |
| `agt-013` The agent that forgot what it finished | debug | Checkpoint and progress state | Agent-flavoured, not workflow-flavoured |
| `rnd-008` Run an LLM call over thousands of documents | code | Retry classification, backoff, per-item isolation | Single process, no durability, no batch API path |
| `api-002`, `api-003` | code, debug | Retry and 429 storms | Call level only |
| `sys-007` Insurance-claims agent with token cost control | design | Document-heavy pipeline | Framed as an agent; most of the right answer is a workflow |
| `inf-010`, `api-012`, `sys-003` | design, estimate | Batch pricing as a cost lever | Pricing only |

### What is missing

1. A module (or track) whose subject is AI workflows. The patterns, durable execution, approvals, batch lanes and document pipelines each appear as a paragraph inside something else. A senior candidate asked "design the workflow for X" has no single place to learn the shape of a good answer.
2. Durable execution as a comparison. The site covers three engines in one section and never states the difference between replay-from-history (Temporal, Inngest, DBOS, Lambda durable functions, Restate, Vercel Workflow SDK) and checkpoint-per-super-step with re-execution on time travel (LangGraph). That difference decides how you test and how you deploy.
3. Changing code while runs are in flight: Temporal patching and Worker Versioning, continue-as-new, Anthropic's rainbow deployments for agents. Absent.
4. Retry placement and retry budgets across layers (the 243x amplification example), Temporal's unlimited-attempts default, and the interaction between retries and non-deterministic model output. Absent.
5. Human-in-the-loop as a product and security problem: timeouts, escalation, who may approve, tamper-proof resume state (the OpenAI Agents SDK warning that deserialization does not authenticate the snapshot or the reviewer). Only the LangGraph mechanics exist.
6. Structured handoffs between steps: typed contracts, payload limits (2 MB Temporal, 4 MiB Inngest step output, 1 MiB Cloudflare step return), passing references instead of blobs. Absent.
7. Queues and backpressure for LLM work: age of oldest message, per-tenant fairness, spillover, DLQs, provider token buckets, cache-aware rate limits, batch queue limits. Absent as a topic.
8. Per-step cost and latency budgets and model cascades with measured numbers. Only per-run budgets exist.
9. Per-step observability with the OpenTelemetry `invoke_workflow`, `invoke_agent`, `execute_tool` spans. The site has an mcq on GenAI conventions (`evl-003`) but no workflow span model.
10. Testing workflows: replay tests in CI, time skipping, mocked activities, kill-at-every-boundary tests, recorded model responses as golden traces. Absent.
11. Low-code versus code: n8n, Dify, Flowise, Zapier Agents, their licences, their durability and their limits. Absent.
12. Back-office case studies with public write-ups (Uber invoices, Instacart catalog attributes, Grab data classification, Airbnb test migration, Duolingo agent platform). Absent; the only case-study material is the Anthropic research system.
13. New problem types from the updated spec (`critique`, `workflow`) have no problems in this area, and no lab exists for it.

---

## 2. Material to add

Proposed home: a module `workflows` (or a short track, "AI workflows and durable execution") placed after `apis` and before `agents`, because the site's own position (agt-004, Anthropic, OpenAI and 12-factor agents) is that most production systems are workflows with model steps, and agents come after. Each topic below says what kind of item it is: lesson, teardown, lab, playbook or paper walkthrough.

### 2.1 Workflow or agent: the control-flow decision (playbook)

The decision: who owns control flow for each step, code or the model. Inputs that change it: whether the steps can be drawn before the request arrives, whether a wrong step is reversible, whether the task needs judgement over unstructured input, how long it waits, and what it costs per run. Options and when each wins: a single call with retrieval; a fixed chain with programmatic gates; a router; a graph with model calls at chosen nodes; an open agent loop with budgets. Worked decision on a stated case (vendor-invoice intake with a refund branch), then what to measure after deciding (share of inputs that leave the happy path, cost per item, human-review rate). Anthropic's definitions are the anchor: workflows are "orchestrated through predefined code paths", agents "dynamically direct their own processes". OpenAI's guide gives three criteria for when an agent earns its place and says a deterministic solution may suffice otherwise. The 12-factor agents essay argues good agents are "mostly deterministic code, with LLM steps sprinkled in". Interview payoff: candidates who name a framework instead of a shape lose points; this playbook trains the shape.

Sources:
- Anthropic, Building effective agents (2024-12-19): https://www.anthropic.com/engineering/building-effective-agents (checked 2026-10-28)
- OpenAI, A practical guide to building agents (PDF): https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf (checked 2026-10-28)
- HumanLayer, 12-factor agents: https://github.com/humanlayer/12-factor-agents (checked 2026-10-28)

### 2.2 The five patterns as code, with their failure modes (lesson)

Prompt chaining, routing, parallelisation (sectioning and voting), orchestrator-workers and evaluator-optimiser, each written as 15 to 30 lines of Python against a mock model, each with its own failure mode and its own cost and latency arithmetic. Chaining: latency adds, and a gate between steps (schema, totals add up) is what makes it better than one prompt. Routing: the classifier's confusion matrix becomes the system's error floor. Parallelisation: latency is the slowest branch, cost is the sum; voting needs an aggregation rule you can defend. Orchestrator-workers: the plan is model output, so it needs the same validation as any tool call; Anthropic's research system shows the cost (about 15 times the tokens of chat) and the payoff. Evaluator-optimiser: works when "clear evaluation criteria" exist; needs an iteration cap and a check that the critic is not the generator grading itself. Widget idea: a pattern sandbox where the reader sets per-step latency, cost and error rate and sees the end-to-end figures.

Sources:
- Anthropic, Building effective agents: https://www.anthropic.com/engineering/building-effective-agents (checked 2026-10-28)
- Anthropic, How we built our multi-agent research system (2025-06-13): https://www.anthropic.com/engineering/multi-agent-research-system (checked 2026-10-28)

### 2.3 State machines and DAGs for model pipelines (lesson, plus a teardown)

Explicit states, transitions guarded by deterministic validation, per-state retry limits, and a terminal "needs human" state. The teardown is Airbnb's Enzyme-to-RTL migration: each file moved through refactor, fix Jest, fix lint and tsc, then complete, advancing only when the previous state's validation passed; retries carried the validation errors and the latest file into the next prompt; the long tail needed 50 to 100 attempts and then manual work. That write-up is the best public example of "the workflow is the product, the model is a step". Contrast with DAG schedulers (topological order, fan-in, partial failure of a branch) using the Scale AI streaming-scheduler interview prompt. Teach the operational loop Airbnb called "sample, tune, sweep".

Sources:
- Airbnb, Accelerating Large-Scale Test Migration with LLMs: https://airbnb.tech/?p=366 (checked 2026-10-28; publication date not shown on the page)
- PracHub, Design a Streaming Job Scheduler (Scale AI): https://prachub.com/interview-questions/design-a-streaming-job-scheduler (checked 2026-10-28)

### 2.4 How durable execution engines actually resume (lesson)

One mechanism, several implementations, and the differences that matter in an interview. Replay from a recorded history: Temporal re-runs workflow code and compares emitted commands against the event history; Inngest re-runs the handler from the top and returns memoized step results (the TypeScript SDK v4 checkpoints ordinary steps in one handler invocation; Python uses a request per step); DBOS checkpoints each step into Postgres with no separate orchestration server; AWS Lambda durable functions replay a checkpoint log and can run for up to one year; Restate journals each step and offers keyed single-writer state; Cloudflare Workflows caches by step name; the Vercel Workflow SDK splits `"use workflow"` from `"use step"`. Checkpoint per super-step: LangGraph saves state at step boundaries and, on time travel, re-executes nodes after the checkpoint including model calls. The common contract: a step can run more than once, its saved result wins once it exists, anything external needs a key. Teach where each engine stores state, what it costs per step (DBOS: one write per step plus two per workflow), and what you operate. Widget idea: the same five-step refund flow run on "replay" and "re-execute" engines with a crash injected at each point.

Sources:
- Temporal, Workflow definition (determinism): https://docs.temporal.io/workflow-definition (checked 2026-10-28)
- Inngest, How functions are executed: https://www.inngest.com/docs/learn/how-functions-are-executed (checked 2026-10-28)
- DBOS, Architecture: https://docs.dbos.dev/architecture (checked 2026-10-28)
- DBOS, Workflow tutorial: https://docs.dbos.dev/python/tutorials/workflow-tutorial (checked 2026-10-28)
- AWS, Lambda durable functions basic concepts: https://docs.aws.amazon.com/lambda/latest/dg/durable-basic-concepts.html (checked 2026-10-28)
- Restate, Durable execution concepts: https://docs.restate.dev/concepts/durable_execution (checked 2026-10-28)
- Restate, AI agents: https://docs.restate.dev/ai (checked 2026-10-28)
- Cloudflare, Rules of Workflows: https://developers.cloudflare.com/workflows/build/rules-of-workflows/ (checked 2026-10-28)
- Workflow SDK, Workflows and steps: https://workflow-sdk.dev/docs/foundations/workflows-and-steps (checked 2026-10-28; the page does not name Vercel; the project links to github.com/vercel/workflow per search results, not opened)
- LangChain, LangGraph durable execution: https://docs.langchain.com/oss/python/langgraph/durable-execution (page redirected to the persistence overview when fetched on 2026-10-28; durability modes and the "starting point" rule taken from search excerpts of this page and its JavaScript twin, https://docs.langchain.com/oss/javascript/langgraph/durable-execution; verify before quoting)
- LangChain, LangGraph time travel: https://docs.langchain.com/oss/python/langgraph/use-time-travel (checked 2026-10-28)
- Pydantic AI, Durable execution overview: https://pydantic.dev/docs/ai/integrations/durable_execution/overview/ (checked 2026-10-28)

### 2.5 Determinism and changing code while runs are in flight (lesson)

What counts as non-deterministic in workflow code (reordering activities, changing activity types, reading the clock or random outside replay-safe APIs, changing a timer to or from zero), why a model call must be an activity or step, and how to ship a change: Temporal patching (`patched()` then `deprecate_patch()` then removal), Worker Versioning (pin runs to a deployment version), versioning by workflow type name (a cutover that does not move running executions), and continue-as-new to start a fresh history with carried state. Pair with Anthropic's rainbow deployments for long-running agents and with the Temporal blog's argument that a dynamic agent loop is compatible with deterministic workflow code because each model decision is recorded as an activity result. Interview angle: "you deployed and 3% of running workflows failed with a non-determinism error" is a realistic debug question.

Sources:
- Temporal, Workflow definition: https://docs.temporal.io/workflow-definition (checked 2026-10-28)
- Temporal, Python versioning: https://docs.temporal.io/develop/python/workflows/versioning (checked 2026-10-28)
- Temporal, Continue-As-New: https://docs.temporal.io/workflow-execution/continue-as-new (checked 2026-10-28)
- Temporal, Of course you can build dynamic AI agents with Temporal (2025-11-12): https://temporal.io/blog/of-course-you-can-build-dynamic-ai-agents-with-temporal (checked 2026-10-28)
- Anthropic, multi-agent research system (rainbow deployments): https://www.anthropic.com/engineering/multi-agent-research-system (checked 2026-10-28)

### 2.6 Idempotency and retries when a step is a model call (lesson, and lab steps)

At-least-once steps plus idempotent effects equals exactly-once outcomes; the existing memory-state lesson teaches that. What it does not teach: where retries live (one layer, or 5 layers of 3 retries become 243 times the load), retry budgets (token bucket for retries), which failures are retryable (a 429 from a Claude spend cap has no `retry-after` and keeps failing; OpenAI flex returns `429 Resource Unavailable` that is not billed), Temporal's default activity policy (1 s initial, coefficient 2.0, 100 s cap, unlimited attempts), the need for a start-to-close timeout, and what a retried model call means: a different output. Rules: record the model output once and treat it as the step result; derive idempotency keys from run id and step, not per attempt; Stripe keeps v1 keys for at least 24 hours and errors if parameters differ, so a key that outlives its run window or a retry with re-generated parameters both fail. Compensation (sagas) for steps that cannot be made idempotent: pair with 2.16.

Sources:
- AWS Builders' Library, Timeouts, retries and backoff with jitter: https://builder.aws.com/content/3EumjoZascWd1oZiEgL8ORlv3qE/timeouts-retries-and-backoff-with-jitter (checked 2026-10-28)
- Temporal, Retry policies: https://docs.temporal.io/encyclopedia/retry-policies (checked 2026-10-28)
- Temporal, Activity timeouts: https://docs.temporal.io/encyclopedia/detecting-activity-failures (checked 2026-10-28)
- Stripe, Idempotent requests: https://docs.stripe.com/api/idempotent_requests (checked 2026-10-28)
- Anthropic, Rate limits: https://platform.claude.com/docs/en/api/rate-limits (checked 2026-10-28)
- OpenAI, Flex processing: https://developers.openai.com/api/docs/guides/flex-processing (checked 2026-10-28)
- Inngest, Replay: https://www.inngest.com/docs/platform/replay (checked 2026-10-28)

### 2.7 Human-in-the-loop: interrupts, approvals and their failure modes (lesson)

Mechanics across stacks: LangGraph `interrupt()` and `Command(resume=...)` (node restarts on resume, index-matched resumes, no bare try/except, static interrupts only for debugging); OpenAI Agents SDK `needs_approval`, `RunResult.interruptions`, serialisable `RunState`; Temporal Signals versus Updates (Updates can be validated and return a result); Lambda durable function waits and callbacks; Vercel Workflow SDK webhooks; Dify's Human Input node (3-day default timeout, timeout branch or the workflow ends); Flowise human input with checkpoints; n8n per-tool review. Design questions the mechanics do not answer: who may approve (authorisation of the reviewer), what the reviewer sees (the exact arguments, not a model summary), what happens on timeout (escalate, auto-reject, never auto-approve money), what stops a replayed approval, and where resume state lives. The OpenAI docs warn that deserialising `RunState` "doesn't authenticate the snapshot or the reviewer" and that approval does not give exactly-once execution. OpenAI's guide gives the two triggers: exceeding failure thresholds and high-risk actions.

Sources:
- LangChain, LangGraph interrupts: https://docs.langchain.com/oss/python/langgraph/interrupts (checked 2026-10-28)
- OpenAI Agents SDK, Human in the loop: https://openai.github.io/openai-agents-python/human_in_the_loop/ (checked 2026-10-28)
- Temporal, Workflow message passing: https://docs.temporal.io/encyclopedia/workflow-message-passing (checked 2026-10-28)
- Dify, Human Input node: https://docs.dify.ai/en/use-dify/nodes/human-input (checked 2026-10-28)
- Flowise, Agentflow V2: https://docs.flowiseai.com/using-flowise/agentflowv2 (checked 2026-10-28)
- n8n, Human-in-the-loop for tools: https://docs.n8n.io/advanced-ai/human-in-the-loop-tools (found by search on 2026-10-28; content taken from the search excerpt, page not opened)
- OpenAI, A practical guide to building agents: https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf (checked 2026-10-28)

### 2.8 Structured handoffs between steps (lesson)

A step's output is the next step's input, so it gets a schema, a version and a size budget. Teach: typed contracts validated at the boundary (Pydantic or Zod) with a repair path; the claim-check pattern, because engines cap payloads (Temporal 2 MB per payload, Inngest 4 MiB step output and 32 MiB run state, Cloudflare 1 MiB step return); Anthropic subagents writing artifacts to storage and passing references; OpenAI Agents SDK handoffs as tools (`transfer_to_<agent>`), `input_type` for structured arguments, `input_filter` to control what history the next agent sees (by default it sees all of it). Security note: a handoff that forwards full history forwards any injected text with it.

Sources:
- OpenAI Agents SDK, Handoffs: https://openai.github.io/openai-agents-python/handoffs/ (checked 2026-10-28)
- Temporal Cloud, Limits: https://docs.temporal.io/cloud/limits (checked 2026-10-28)
- Inngest, Usage limits: https://www.inngest.com/docs/usage-limits/inngest (checked 2026-10-28)
- Cloudflare, Rules of Workflows: https://developers.cloudflare.com/workflows/build/rules-of-workflows/ (checked 2026-10-28)
- Anthropic, multi-agent research system (artifact outputs): https://www.anthropic.com/engineering/multi-agent-research-system (checked 2026-10-28)

### 2.9 Batch APIs as a workflow stage (lesson, plus an estimate problem)

The existing site prices batch work; it does not build the stage. Teach a batch stage as submit, poll, collect, reconcile, re-submit: results out of order (join on `custom_id`), partial failure (per-request `errored`, `expired`), expiry at 24 hours (Anthropic, OpenAI) or 48 hours (Gemini), result retention (29 days Anthropic, 30 days OpenAI output file, 6 weeks Gemini), batch queue limits as backpressure (Anthropic Start tier: 200,000 batch requests in the processing queue), prompt caching inside batches being best-effort and the 1-hour cache tip, and OpenAI flex as the middle lane at batch prices with possible 429s. Problem idea (estimate): a nightly 300,000-document enrichment against Anthropic's 100,000-request batch cap and queue limit; how many batches, what to promise downstream.

Sources:
- Anthropic, Batch processing: https://platform.claude.com/docs/en/build-with-claude/batch-processing (checked 2026-10-28)
- Anthropic, Rate limits (Message Batches section): https://platform.claude.com/docs/en/api/rate-limits (checked 2026-10-28)
- OpenAI, Batch API: https://developers.openai.com/api/docs/guides/batch (checked 2026-10-28)
- Google, Gemini Batch API: https://ai.google.dev/gemini-api/docs/batch-api (checked 2026-10-28)
- OpenAI, Flex processing: https://developers.openai.com/api/docs/guides/flex-processing (checked 2026-10-28)

### 2.10 Queues, backpressure and flow control for model work (lesson)

The provider's token bucket is the bottleneck and it is shared, so the workflow needs admission control. Teach: measure the age of the oldest message, not just depth; per-tenant isolation (separate queues, shuffle sharding, spillover queues); DLQs that page someone; heartbeats for long steps so they are not redelivered; Inngest's flow-control vocabulary (step concurrency, throttling queues extra runs, rate limiting drops them, debounce, priority, batching, singleton) as a ready-made checklist; n8n queue mode (Redis, workers at 10 concurrent jobs by default); cache-aware input limits on Claude (cached reads do not count toward ITPM on most models). Case: Grab mini-batched classification requests through a message queue with a workflow-level rate limiter because all deployments shared one 240K tokens-per-minute quota.

Sources:
- AWS Builders' Library, Avoiding insurmountable queue backlogs: https://builder.aws.com/content/3EuRcgkTP1MI0c7zM8W6HL3WIqA/avoiding-insurmountable-queue-backlogs (checked 2026-10-28)
- Inngest, Flow control: https://www.inngest.com/docs/guides/flow-control (checked 2026-10-28)
- n8n, Queue mode: https://docs.n8n.io/hosting/scaling/queue-mode/ (checked 2026-10-28)
- Anthropic, Rate limits: https://platform.claude.com/docs/en/api/rate-limits (checked 2026-10-28)
- Grab, LLM-powered data classification for data entities at scale: https://engineering.grab.com/llm-powered-data-classification (checked 2026-10-28)

### 2.11 Cost and latency budgets per step (playbook, plus an estimate problem)

Per-run caps exist on the site; per-step budgets do not. Playbook: give each step a token budget, a timeout derived from a latency percentile (AWS: pick an acceptable false-timeout rate such as 0.1% and read the matching percentile), a retry budget and a model tier; decide where a cascade pays (Instacart: a cheaper model matched quality on simpler attributes at a 70% cost reduction and lost 60% accuracy on difficult ones); move non-urgent steps to batch or flex at half price; account for prompt growth in retry loops (Airbnb's prompts reached 40,000 to 100,000 tokens and long-tail files took 50 to 100 attempts). Worked case: a three-step extraction pipeline with a review queue, costed per document with every assumption labelled.

Sources:
- AWS Builders' Library, Timeouts, retries and backoff with jitter: https://builder.aws.com/content/3EumjoZascWd1oZiEgL8ORlv3qE/timeouts-retries-and-backoff-with-jitter (checked 2026-10-28)
- Instacart, Scaling Catalog Attribute Extraction with Multi-modal LLMs (2025-08-01): https://company.instacart.com/tech-innovation/scaling-catalog-attribute-extraction-with-multi-modal-llms (checked 2026-10-28; tech.instacart.com returned 403)
- Airbnb, Accelerating Large-Scale Test Migration with LLMs: https://airbnb.tech/?p=366 (checked 2026-10-28)
- Anthropic, Batch processing: https://platform.claude.com/docs/en/build-with-claude/batch-processing (checked 2026-10-28)

### 2.12 Observability per step (lesson)

A workflow trace is a tree: workflow span, agent spans, model spans, tool spans. The OpenTelemetry GenAI conventions (status: Development) define `invoke_workflow {gen_ai.workflow.name}` as INTERNAL for "composable processes (e.g., graphs, orchestrators)", and say it should not be emitted when a workflow is an internal detail of an agent or tool; `invoke_agent` has CLIENT and INTERNAL variants; `execute_tool {gen_ai.tool.name}`; a `plan` span; skill-loading spans. Token usage attributes include cache read and write counts. Teach per-step metrics (latency, tokens, cost, retries, validation failures, human-review rate), linking engine run ids to trace ids, and Anthropic's practice of monitoring decision patterns without reading conversation content. The LangChain interview's "reconstruct a trace tree from a stream of log events" makes a good code problem.

Sources:
- OpenTelemetry, GenAI agent and framework spans: https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/gen-ai-agent-spans.md (checked 2026-10-28 via the raw file)
- Duolingo, production-ready AI agent platform (2026-08-04): https://blog.duolingo.com/production-ready-ai-agent-platform/ (checked 2026-10-28)
- Anthropic, multi-agent research system: https://www.anthropic.com/engineering/multi-agent-research-system (checked 2026-10-28)
- techinterview.org, LangChain interview guide: https://www.techinterview.org/companies/langchain/ (checked 2026-10-28)

### 2.13 Testing workflows: replay, golden traces and crash injection (lesson, plus lab steps)

Four layers. Unit: each step with fixtures and a recorded model response. Replay: download recent histories and replay them against new code in CI, failing the build on any non-determinism error (Temporal's documented practice). Time: a time-skipping environment so a 3-day approval timeout runs in milliseconds. Crash: kill the worker at every step boundary and inside every side-effecting step, then assert exactly one of each external effect. Golden traces: a stored trace (inputs, recorded model outputs, tool results) that the pipeline must reproduce step for step after a refactor; outcome evals over repeated live runs on top. Warn about the two meanings of replay: Temporal replay returns recorded results, LangGraph time travel re-executes later nodes including model calls, and Inngest Replay "creates new executions" whose side effects can repeat. Duolingo runs its eval suite as a Temporal workflow with deterministic graders first and an LLM judge only where diffs are too brittle.

Sources:
- Temporal, Python testing suite: https://docs.temporal.io/develop/python/testing-suite (checked 2026-10-28)
- LangChain, LangGraph time travel: https://docs.langchain.com/oss/python/langgraph/use-time-travel (checked 2026-10-28)
- Inngest, Replay: https://www.inngest.com/docs/platform/replay (checked 2026-10-28)
- Duolingo, production-ready AI agent platform: https://blog.duolingo.com/production-ready-ai-agent-platform/ (checked 2026-10-28)

### 2.14 Low-code tools versus code (playbook)

When n8n, Dify, Flowise or Zapier Agents is the right answer and when it is not, decided on durability, testing, versioning, review, tenancy and licence rather than taste. Facts to anchor it: n8n's Sustainable Use License allows use "only for your own internal business purposes or for non-commercial or personal use", with `.ee` files under a separate enterprise licence; n8n queue mode needs Postgres and Redis (no SQLite), defaults to 10 concurrent jobs per worker, and multi-main is self-hosted Enterprise only. Dify uses a modified Apache 2.0 that forbids running a multi-tenant service from the source without written authorisation and forbids removing the console logo; its nodes offer three error modes (stop, default value, fail branch) and a Human Input node with a 3-day default timeout. Flowise Agentflow V2 saves checkpoints so paused flows resume after restart and caps loops at 5 by default. Zapier's Agents page is marketing (it claims "9,000+ apps"), with no approval mechanics stated. The playbook should say plainly: low-code wins for internal automations owned by operations teams with few steps and a human downstream; code wins when the workflow is the product, needs tests in CI, multi-tenancy, or moves money.

Sources:
- n8n, LICENSE.md: https://github.com/n8n-io/n8n/blob/master/LICENSE.md (checked 2026-10-28)
- n8n, Queue mode: https://docs.n8n.io/hosting/scaling/queue-mode/ (checked 2026-10-28)
- n8n, Advanced AI overview: https://docs.n8n.io/advanced-ai/ (checked 2026-10-28)
- Dify, LICENSE: https://github.com/langgenius/dify/blob/main/LICENSE (checked 2026-10-28)
- Dify, Predefined error handling logic: https://docs.dify.ai/en/use-dify/build/predefined-error-handling-logic (checked 2026-10-28)
- Dify, Human Input node: https://docs.dify.ai/en/use-dify/nodes/human-input (checked 2026-10-28)
- Flowise, Agentflow V2: https://docs.flowiseai.com/using-flowise/agentflowv2 (checked 2026-10-28)
- Zapier, Agents: https://zapier.com/agents (checked 2026-10-28; marketing page)

### 2.15 Document pipelines (lesson, plus a teardown)

A document pipeline is ingestion, preprocessing, OCR or native PDF input, extraction to a schema, business-rule validation, confidence scoring, review routing and write-back to a system of record. Teach each stage's contract and failure mode, and the throughput math. Facts: Claude accepts up to 600 PDF pages per request (100 when the context window is under 1M tokens) and 32 MB, processes each page as text plus an image, at 1,500 to 3,000 text tokens per page plus image tokens. Confidence without labels: Instacart's self-verification prompt uses the probability of "yes" on the first token as the score and sends low-confidence values to human auditors. Uber's TextSense runs invoices through OCR, GPT-4 extraction, post-processing rules and a side-by-side review UI, orchestrated by Cadence. Grab writes predictions to Kafka and asks data owners to verify tags weekly. The teardown is Uber (see 2.16).

Sources:
- Anthropic, PDF support: https://platform.claude.com/docs/en/build-with-claude/pdf-support (checked 2026-10-28)
- Instacart, PARSE: https://company.instacart.com/tech-innovation/scaling-catalog-attribute-extraction-with-multi-modal-llms (checked 2026-10-28)
- Uber, Advancing Invoice Document Processing at Uber using GenAI (2025-04-17): https://www.uber.com/blog/advancing-invoice-document-processing-using-genai/ (checked 2026-10-28)
- Grab, LLM-powered data classification: https://engineering.grab.com/llm-powered-data-classification (checked 2026-10-28)

### 2.16 Back-office case studies (teardowns, one per system)

Each teardown follows the spec's teardown skeleton and states plainly what is not public.

1. Uber TextSense invoices: seven pipeline stages, model selection (fine-tuned Flan T5 over 90% on header fields but weak on line items; GPT-4 chosen), Cadence orchestration, reported 2x reduction in manual invoicing, 90% overall accuracy, 35% of invoices at 99.5% accuracy, 70% lower handling time, 25 to 30% cost savings. Not public: accuracy definition beyond exact and fuzzy matching, review thresholds, volumes. https://www.uber.com/blog/advancing-invoice-document-processing-using-genai/ (checked 2026-10-28)
2. Instacart PARSE catalog attributes: config-driven extraction platform, versioned prompts, self-verification confidence, human audit queue, cascade. Not public: confidence threshold, cascade details (in a figure). https://company.instacart.com/tech-innovation/scaling-catalog-attribute-extraction-with-multi-modal-llms (checked 2026-10-28)
3. Grab data classification ("Gemini" is Grab's internal orchestrator, not Google's model): request grouping, mini-batches through a queue, workflow-level rate limiter, JSON output with a default `<None>` tag, Kafka fan-out, weekly owner verification; more than 20,000 entities in the first month, an estimated 360 man-days a year saved on a stated 2-minutes-per-entity assumption. https://engineering.grab.com/llm-powered-data-classification (checked 2026-10-28)
4. Airbnb test migration: per-file state machine, validation-gated transitions, retries with errors in the prompt, 75% in four hours, 97% after four days of tuning, the rest by hand. https://airbnb.tech/?p=366 (checked 2026-10-28)
5. Duolingo agent platform and flag-removal agent: agent registry plus a Temporal `AgentWorkflow` wrapper, MCP tool calls as activities via the OpenAI Agents SDK Temporal plugin, evals as workflows; the flag remover keeps clone, agent run and PR creation in one activity because separate activities can land on different workers. https://blog.duolingo.com/production-ready-ai-agent-platform/ and https://blog.duolingo.com/buildingaiagents (both checked 2026-10-28)
6. Anthropic research system as orchestrator-workers: synchronous subagents, resume from failure, rainbow deploys, artifacts by reference. https://www.anthropic.com/engineering/multi-agent-research-system (checked 2026-10-28)

Leads not verified on 2026-10-28 (do not cite without opening): the Alan post on an LLM document pipeline (Medium returned 403), Lindy's Temporal case study (third-party host), Ramp's Policy Agent talk (only a third-party summary found).

### 2.17 Sagas and compensation (paper walkthrough)

Garcia-Molina and Salem, "Sagas", SIGMOD 1987: a long-lived transaction split into steps, each with a compensating action, so the system can undo partial progress without holding locks. Why it matters now: model-driven workflows call external systems that have no shared transaction, and some actions (an email, a payout) cannot be undone, only compensated or gated. Walk through forward recovery versus backward recovery, the ordering of compensations, and what to say in an interview when a step has no compensation (put the approval before it). Link to Temporal's and DBOS's patterns rather than quoting vendor numbers.

Sources:
- Garcia-Molina and Salem, Sagas, SIGMOD 1987, pages 249 to 259: https://doi.org/10.1145/38713.38742 (DOI confirmed via the DBLP and BibTeX records on 2026-10-28; full text not opened)

### 2.18 Lab: build a mini durable workflow engine (lab, 8 steps)

One program grown over eight steps in Pyodide, stdlib only, clock and RNG injected: (1) a step journal keyed by step name with JSON-only results; (2) replay from the top returning saved results; (3) a non-determinism check that fails when the step sequence differs from the journal; (4) retries with a policy object and non-retryable errors; (5) idempotency keys derived from run id and step, and a fake payment provider that deduplicates; (6) `interrupt` and `resume` with an approval value and a timeout branch; (7) a per-step token and cost budget that stops the run; (8) a crash-injection test harness that kills at every boundary and asserts one effect each. Builds directly on the existing `AgentsResume` widget's model.

Sources: Temporal workflow definition, Inngest execution model, LangGraph interrupts, Stripe idempotency (all above, checked 2026-10-28).

### 2.19 Lab: batch extraction pipeline with a review queue (lab, 6 steps)

(1) Typed extraction schema and validator; (2) a mock model with seeded errors; (3) a batch submitter that splits at a request cap, joins on `custom_id` and handles expired and errored items; (4) confidence scoring by a second "verify" call; (5) routing below a threshold to a review queue, with the threshold chosen from a labelled sample; (6) a cost and accuracy report per document. Mirrors Uber, Instacart and the batch docs.

Sources: Anthropic batch processing, OpenAI Batch API, Instacart PARSE, Uber TextSense (all above, checked 2026-10-28).

### 2.20 Problems to add (new spec types)

- `workflow`: vendor-invoice intake with a refund branch and a 2-day approval; checklist covers gates, idempotency keys, timeout behaviour, budgets, review routing.
- `workflow`: nightly re-classification of 300,000 support tickets; checklist covers batch lane, queue limits, reconciliation, partial failure, cost.
- `critique`: a LangGraph node that inserts a row and then calls `interrupt()` inside a bare `try/except`.
- `critique`: a design that stores `RunState` in a browser cookie and lets any logged-in user approve.
- `debug`: Temporal non-determinism error after a deploy that swapped a timer and an activity.
- `debug`: batch results joined by line number.
- `estimate`: 5 layers of 3 retries during a provider outage.
- `mcq`: Signal, Query or Update for an approval.
- `code`: reconstruct a trace tree from a stream of span events.

---

## 3. Interview questions collected

Provenance key: "reported" means a prep site lists it as asked by the named company (third-party, not confirmed by the company); "listed" means a prep site lists it without a company; "adapted" means written for Inferview from the named primary source, with no claim that any company asked it. Company is filled only when the source names it as the asker.

| # | Question | Type | Level | Provenance | Company | Source URL |
|---|---|---|---|---|---|---|
| 1 | Design LangGraph's persistence layer for stateful agents with human-in-the-loop interruption. | design | staff | reported | LangChain | https://www.techinterview.org/companies/langchain/ |
| 2 | Discuss the trade-offs of ReAct vs function calling vs LangGraph-style explicit state machines. | concept | senior | reported | LangChain | https://www.techinterview.org/companies/langchain/ |
| 3 | Implement an agent loop: given a set of tools, an LLM and a question, execute tool calls and return the final answer. | code | senior | reported | LangChain | https://www.techinterview.org/companies/langchain/ |
| 4 | Given a stream of log events, reconstruct a hierarchical trace. | code | senior | reported | LangChain | https://www.techinterview.org/companies/langchain/ |
| 5 | Design the evaluation platform supporting async runs across thousands of datasets with LLM graders. | design | staff | reported | LangChain | https://www.techinterview.org/companies/langchain/ |
| 6 | Design an inference service API where clients POST a job and later poll for results: statuses, idempotency keys, retries, rate limits, partial failure in a batch, a model version change mid-flight. | design | staff | reported | Anthropic | https://prachub.com/interview-questions/design-a-batch-inference-api |
| 7 | Design an end-to-end batching system for LLM queries. | design | senior | reported | Anthropic | https://www.aced.io/questions/5807/design-end-to-end-batching-system-for-llm-queries |
| 8 | Design an LLM request batching system that groups requests into shared inference calls under latency and size limits. | design | senior | reported | Anthropic | https://prachub.com/interview-questions/design-an-llm-request-batching-system |
| 9 | Build a feature that calls a hosted LLM API: separate transient from deterministic failures, validate the response in ordered checks, define the failure path, then handle a 3x cost overrun. | design | senior | reported | Scale AI | https://prachub.com/interview-questions/design-an-llm-api-pipeline |
| 10 | Build a scheduler that ingests tasks with deadlines and prerequisites, dispatches earliest deadline first, never leases a task to two workers, then scale it out with crash recovery. | code | senior | reported | Scale AI | https://prachub.com/interview-questions/design-a-streaming-job-scheduler |
| 11 | Implement a timeout refund workflow that is deterministic and safe to retry against an external payment integration. | code | senior | reported | DoorDash | https://prachub.com/coding-questions/implement-timeout-refund-workflow |
| 12 | Design the backend for a multi-agent fintech chat product with planning, retrieval, calculation, compliance and response agents, including failure handling. | design | senior | reported | Hebbia | https://prachub.com/interview-questions/design-a-multi-agent-chat-backend |
| 13 | Design chat over SEC filings with agent orchestration, streaming, cancellation and token-budget enforcement. | design | staff | reported | Hebbia | https://prachub.com/interview-questions/design-hebbia-chat-for-sec-filings |
| 14 | Design an agentic workflow to generate a one-hour movie: orchestration, state for continuity, quality and failure handling. | design | staff | reported | xAI | https://prachub.com/interview-questions/design-agentic-workflow-to-generate-a-1-hour-movie |
| 15 | How do you resume an agent that crashed mid-trace? | concept | senior | listed | | https://www.techinterview.org/post/3233474928/ai-agent-infrastructure-interview/ |
| 16 | How do you cap a customer's spend mid-trace, and bill a trace whose cost is unknown until it finishes? | design | staff | listed | | https://www.techinterview.org/post/3233474928/ai-agent-infrastructure-interview/ |
| 17 | How do you let developers replay a trace to investigate a bug? | concept | senior | listed | | https://www.techinterview.org/post/3233474928/ai-agent-infrastructure-interview/ |
| 18 | How do you alert on agents that loop, exceed budget or hallucinate tool calls? | concept | senior | listed | | https://www.techinterview.org/post/3233474928/ai-agent-infrastructure-interview/ |
| 19 | How do you route, queue and rate-limit tool calls across many customers? | design | senior | listed | | https://www.techinterview.org/post/3233474928/ai-agent-infrastructure-interview/ |
| 20 | Design a research-assistant agent platform where traces run for 30 minutes or more. | design | staff | listed | | https://www.techinterview.org/post/3233474928/ai-agent-infrastructure-interview/ |
| 21 | When does a deterministic workflow suffice instead of an agent? Name the criteria you use. | concept | senior | adapted | | https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf |
| 22 | Pick the workflow pattern (chain, router, parallel, orchestrator-workers, evaluator-optimiser) for three stated systems and give the failure mode of each choice. | concept | senior | adapted | | https://www.anthropic.com/engineering/building-effective-agents |
| 23 | After a deploy, some running workflows fail with a non-determinism error. What changed, and how do you ship that change safely? | debug | senior | adapted | | https://docs.temporal.io/workflow-definition |
| 24 | A long-lived agent workflow is approaching its event-history limit. What do you do, and what state do you carry over? | concept | senior | adapted | | https://docs.temporal.io/workflow-execution/continue-as-new |
| 25 | An approval node inserts a record, then calls `interrupt()`. After approval there are two records. Explain and fix. | debug | senior | adapted | | https://docs.langchain.com/oss/python/langgraph/interrupts |
| 26 | Your activity retry policy is the default. A step sends a malformed prompt that the provider rejects with a 400. What happens, and what do you configure? | mcq | senior | adapted | | https://docs.temporal.io/encyclopedia/retry-policies |
| 27 | Five service layers each retry three times while the model provider is down. What load reaches the provider, and where should retries live? | estimate | senior | adapted | | https://builder.aws.com/content/3EumjoZascWd1oZiEgL8ORlv3qE/timeouts-retries-and-backoff-with-jitter |
| 28 | For a reviewer's approve or reject on a running workflow, do you use a Signal, a Query or an Update? Why? | mcq | senior | adapted | | https://docs.temporal.io/encyclopedia/workflow-message-passing |
| 29 | Approval state is serialised and stored client-side between the pause and the resume. Critique the design. | critique | senior | adapted | | https://openai.github.io/openai-agents-python/human_in_the_loop/ |
| 30 | Batch results are joined back to inputs by line number. What breaks, and how do you reconcile errored and expired items? | debug | senior | adapted | | https://platform.claude.com/docs/en/build-with-claude/batch-processing |
| 31 | A nightly job classifies 300,000 documents. Synchronous calls under a concurrency cap, flex, or a batch API? Show the cost and the latency you promise downstream. | estimate | senior | adapted | | https://developers.openai.com/api/docs/guides/batch |
| 32 | Fifty tenants share one provider quota. Design admission control so one tenant's backfill does not starve the rest. | design | staff | adapted | | https://builder.aws.com/content/3EuRcgkTP1MI0c7zM8W6HL3WIqA/avoiding-insurmountable-queue-backlogs |
| 33 | How do you score confidence on an LLM extraction without labels, and how do you pick the review threshold? | concept | senior | adapted | | https://company.instacart.com/tech-innovation/scaling-catalog-attribute-extraction-with-multi-modal-llms |
| 34 | Design an invoice-processing pipeline that writes to the ERP and routes uncertain fields to people. | workflow | senior | adapted | | https://www.uber.com/blog/advancing-invoice-document-processing-using-genai/ |
| 35 | Your LLM migration pipeline succeeds on 75% of files in the first sweep. How do you get the long tail, and when do you stop automating? | behavioural | staff | adapted | | https://airbnb.tech/?p=366 |
| 36 | Which OpenTelemetry span do you emit for a graph run, an agent invocation and a tool call, and when should a framework not emit a workflow span? | concept | senior | adapted | | https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/gen-ai-agent-spans.md |
| 37 | You replay a LangGraph run from a checkpoint to debug it and the model answers differently. Bug or expected? How do you get a reproducible replay? | concept | senior | adapted | | https://docs.langchain.com/oss/python/langgraph/use-time-travel |
| 38 | After a fix you bulk-replay 3,000 failed runs. What can go wrong? | debug | senior | adapted | | https://www.inngest.com/docs/platform/replay |
| 39 | Thousands of agent runs are mid-flight when you need to ship a new prompt and tool. How do you deploy? | design | staff | adapted | | https://www.anthropic.com/engineering/multi-agent-research-system |
| 40 | An operations team wants to build the approval workflow in n8n or Dify. When do you agree, and what would make you move it to code? | concept | staff | adapted | | https://github.com/n8n-io/n8n/blob/master/LICENSE.md |
| 41 | A step must send an email that cannot be undone. How do you structure the workflow so a later failure does not leave the system inconsistent? | concept | staff | adapted | | https://doi.org/10.1145/38713.38742 |
| 42 | Clone a repo, run a coding agent on it, open a PR: one durable step or three? | concept | senior | adapted | | https://blog.duolingo.com/buildingaiagents |

Count: 42 questions; 14 reported with a company, 6 listed without a company, 22 adapted from primary sources. All URLs were opened on 2026-10-28 except where section 2 notes otherwise. Note that techinterview.org and PracHub are aggregators of candidate reports; treat their company tags as reported, not confirmed. A Ramp question about "multi-step expense categorization" surfaced only in a search summary of dataford.io (the page returned 429) and is excluded.

---

## 4. Numbers and facts to know

Every line was read on 2026-10-28 from the linked page.

### Definitions and guidance

- Anthropic: workflows are "orchestrated through predefined code paths"; agents "dynamically direct their own processes and tool usage". Post dated 2024-12-19. https://www.anthropic.com/engineering/building-effective-agents
- OpenAI's guide lists three conditions where agents add value: complex decision-making, difficult-to-maintain rules, heavy reliance on unstructured data; "Otherwise, a deterministic solution may suffice." Two human-intervention triggers: exceeding failure thresholds, high-risk actions. It recommends maximising a single agent before splitting. https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf
- 12-factor agents lists twelve factors including "Own your control flow", "Launch/Pause/Resume with simple APIs", "Contact humans with tool calls" and "Make your agent a stateless reducer". https://github.com/humanlayer/12-factor-agents

### Anthropic multi-agent research system (2025-06-13)

- Multi-agent (Opus 4 lead, Sonnet 4 subagents) beat single-agent Opus 4 by 90.2% on Anthropic's internal research eval.
- Token usage explained 80% of the variance on BrowseComp.
- Agents use about 4 times the tokens of chat; multi-agent systems about 15 times.
- Parallel tool calling cut research time by up to 90% on complex queries.
- Lead agents run subagents synchronously; rainbow deployments shift traffic gradually so running agents are not broken.
- Source: https://www.anthropic.com/engineering/multi-agent-research-system

### Temporal

- Workflow code must be deterministic; model calls, API calls and database queries belong in activities. https://docs.temporal.io/workflow-definition
- Default activity retry policy: initial interval 1 s, backoff coefficient 2.0, maximum interval 100 s (100 times the initial), maximum attempts unlimited, no non-retryable errors. Workflows do not retry by default. https://docs.temporal.io/encyclopedia/retry-policies
- An activity must have Start-To-Close or Schedule-To-Close; if neither is set the service rejects it. Schedule-To-Close and Schedule-To-Start default to infinity; heartbeat is disabled unless set. https://docs.temporal.io/encyclopedia/detecting-activity-failures
- Temporal Cloud per-execution limits: event history errors at 51,200 events or 50 MB, warns at 10,240 events or 10 MB; 2 MB per payload; 4 MB per transaction and per gRPC message; 2,000 incomplete activities, signals, child workflows and cancellations combined (500 or fewer recommended); 10,000 signals per execution; 10 in-flight updates and 2,000 total updates. https://docs.temporal.io/cloud/limits
- Versioning: patching (`patched()`, then `deprecate_patch()`, then removal), Worker Versioning (pin runs to deployment versions), or a new workflow type name, which does not move running executions. https://docs.temporal.io/develop/python/workflows/versioning
- Continue-As-New keeps the workflow id, starts a new run id and a fresh history, and carries state as arguments. https://docs.temporal.io/workflow-execution/continue-as-new
- Updates are synchronous and can be validated before entering history; Signals are asynchronous fire-and-forget; Queries read state and add nothing to history. https://docs.temporal.io/encyclopedia/workflow-message-passing
- Replay testing: download recent histories, replay with `Replayer`, fail CI on any error; the time-skipping environment fast-forwards timers except while activities run. https://docs.temporal.io/develop/python/testing-suite
- OpenAI Agents SDK integration announced 2025-07-30 as Public Preview; an update dated 2026-03-23 reports General Availability for Python; "every agent invocation is executed through a Temporal Activity". https://temporal.io/blog/announcing-openai-agents-sdk-integration
- Temporal's blog (2025-11-12) states OpenAI's Codex web agent is built on Temporal. https://temporal.io/blog/of-course-you-can-build-dynamic-ai-agents-with-temporal

### Inngest

- Replays the handler from the top and returns saved step results; TypeScript SDK v4 checkpoints ordinary steps without restarting the handler; Python uses standard orchestration (a request per step). https://www.inngest.com/docs/learn/how-functions-are-executed
- Platform limits: 1,000 steps per function, 4 MiB step output, 32 MiB run state, steps up to 2 hours, sleeps up to 1 year within the plan's run length (30 days Free, 90 days Pro, 366 days Business). https://www.inngest.com/docs/usage-limits/inngest
- Flow control: throttling queues excess runs, rate limiting drops them; also step concurrency, debounce, priority, batching, singleton. https://www.inngest.com/docs/guides/flow-control
- Replay "creates new executions, so check which charges, messages, or records could repeat". https://www.inngest.com/docs/platform/replay

### LangGraph

- Interrupts: the node restarts from its beginning on resume; resume values are matched by index; side effects before `interrupt()` must be idempotent; static interrupts "are not recommended for human-in-the-loop workflows". https://docs.langchain.com/oss/python/langgraph/interrupts
- Time travel: "Nodes after the checkpoint re-execute, including any LLM calls, API requests, and interrupts." https://docs.langchain.com/oss/python/langgraph/use-time-travel
- Durability modes `exit`, `async`, `sync`; the API reference gives `async` as the default (from search excerpts of https://docs.langchain.com/oss/python/langgraph/durable-execution and https://reference.langchain.com/python/langgraph/pregel/main/Pregel/ainvoke; verify on the pages before quoting).
- In-memory savers lose checkpoints on restart; production should use a persistent checkpointer such as `PostgresSaver`; keep `thread_id` under 255 characters for `PostgresSaver`. https://docs.langchain.com/oss/python/langgraph/persistence

### Other engines

- DBOS: one database write per step plus two per workflow; a workflow id acts as an idempotency key ("executes only once"); `DBOSStepNondeterminismError` on mismatch. https://docs.dbos.dev/architecture and https://docs.dbos.dev/python/tutorials/workflow-tutorial
- AWS Lambda durable functions: execution timeout default 86,400 s, maximum one year; retention default 14 days, maximum 90; waits do not count against the function timeout but do count against the execution timeout. https://docs.aws.amazon.com/lambda/latest/dg/durable-basic-concepts.html
- Cloudflare Workflows: step names are cache keys and must be deterministic; non-stream step return up to 1 MiB; keep step timeouts at 30 minutes or less. https://developers.cloudflare.com/workflows/build/rules-of-workflows/
- Workflow SDK: steps make up to 3 attempts by default; `Math.random` and `Date` are fixed during workflow runs, so secrets must be generated in a step. https://workflow-sdk.dev/docs/foundations/workflows-and-steps
- Pydantic AI lists durable backends Temporal, DBOS, Prefect, Restate, AWS Lambda, Absurd, pgtask and Apache Airflow, one engine per agent. https://pydantic.dev/docs/ai/integrations/durable_execution/overview/

### Retries and idempotency

- Five layers with three retries each multiply load by 243; "retry at a single point in the stack". Timeouts: choose a false-timeout rate such as 0.1% and use the matching latency percentile. https://builder.aws.com/content/3EumjoZascWd1oZiEgL8ORlv3qE/timeouts-retries-and-backoff-with-jitter
- Stripe v1 idempotency keys: up to 255 characters, may be pruned after at least 24 hours, error if parameters differ from the original, saved results include 500s. https://docs.stripe.com/api/idempotent_requests
- Claude spend-cap 429 has no `retry-after` header and keeps failing until access resumes; rate limits use a token bucket; on most models cached reads do not count toward ITPM. https://platform.claude.com/docs/en/api/rate-limits
- OpenAI flex: billed at Batch API rates; may return `429 Resource Unavailable`, not charged; default SDK timeout 10 minutes. https://developers.openai.com/api/docs/guides/flex-processing
- OpenAI Agents SDK: approval "doesn't guarantee exactly-once execution"; deserialising `RunState` does not authenticate the snapshot or the reviewer. https://openai.github.io/openai-agents-python/human_in_the_loop/

### Batch APIs

- Anthropic: 50% of standard price; up to 100,000 requests or 256 MB per batch; most finish within 1 hour; expire at 24 hours; results for 29 days; results in any order (use `custom_id`, 1 to 64 characters); caching in batches is best-effort; the docs suggest the 1-hour cache duration. Batch queue limits: Start tier 1,000 RPM and 200,000 batch requests in the processing queue; Build 2,000 and 300,000; Scale 4,000 and 500,000. https://platform.claude.com/docs/en/build-with-claude/batch-processing and https://platform.claude.com/docs/en/api/rate-limits
- OpenAI: 50% discount; 24-hour window; 50,000 requests and 200 MB per input file; 2,000 batches per hour; one model per file; output order may differ (use `custom_id`); output file deleted 30 days after completion; expired requests are written to the error file. https://developers.openai.com/api/docs/guides/batch
- Gemini: 50% of interactive cost; 24-hour target; inline requests under 20 MB, JSONL files up to 2 GB; jobs expire after 48 hours pending or running; results kept 6 weeks. https://ai.google.dev/gemini-api/docs/batch-api

### Queues and low-code

- AWS backlog guidance: measure the age of messages in the queue; isolate tenants with per-customer queues or shuffle sharding; spill excess to a separate queue; heartbeat long messages; alarm on any DLQ message. https://builder.aws.com/content/3EuRcgkTP1MI0c7zM8W6HL3WIqA/avoiding-insurmountable-queue-backlogs
- n8n queue mode: Redis broker, workers default to 10 concurrent jobs (5 or more recommended), no SQLite, multi-main is self-hosted Enterprise only. https://docs.n8n.io/hosting/scaling/queue-mode/
- n8n licence: Sustainable Use License, internal business or non-commercial use; `.ee` files need an enterprise licence. https://github.com/n8n-io/n8n/blob/master/LICENSE.md
- Dify licence: modified Apache 2.0; no multi-tenant service from source without written authorisation; console logo may not be removed. https://github.com/langgenius/dify/blob/main/LICENSE
- Dify error handling: None (default, stops the workflow), Default Value, Fail Branch, on LLM, HTTP, Code and Tool nodes; iteration modes `terminated`, `continue-on-error`, `remove-abnormal-output`. https://docs.dify.ai/en/use-dify/build/predefined-error-handling-logic
- Dify Human Input: default timeout 3 days; with no timeout branch the workflow ends. https://docs.dify.ai/en/use-dify/nodes/human-input
- Flowise Agentflow V2: checkpoints allow resume after restart; Loop node Max Loop Count defaults to 5. https://docs.flowiseai.com/using-flowise/agentflowv2

### Observability

- OpenTelemetry GenAI agent spans are in Development status; operation names include `create_agent`, `invoke_agent`, `invoke_workflow`, `execute_tool`, `plan`; `invoke_workflow` is INTERNAL and should not be reported for standalone agent invocations. https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/gen-ai-agent-spans.md

### Documents and case studies

- Claude PDF input: 32 MB per request; up to 600 pages (100 when the request's context window is under 1M tokens); each page as text plus image; 1,500 to 3,000 text tokens per page. https://platform.claude.com/docs/en/build-with-claude/pdf-support
- Uber TextSense (2025-04-17): 2x reduction in manual invoicing, 90% overall accuracy, 35% of invoices at 99.5% accuracy, 65% above 80%, 70% lower average handling time, 25 to 30% cost savings; Cadence for orchestration; GPT-4 chosen after fine-tuned models struggled on line items. https://www.uber.com/blog/advancing-invoice-document-processing-using-genai/
- Instacart PARSE (2025-08-01): organic attribute at 95% accuracy in one day versus one week; cheaper model matched quality at 70% lower cost on simpler attributes; less powerful models dropped 60% accuracy on difficult ones; multi-modal raised recall 10% on `sheet_count`. https://company.instacart.com/tech-innovation/scaling-catalog-attribute-extraction-with-multi-modal-llms
- Grab: more than 20,000 entities in the first month, 300 to 400 a day; about 360 man-days a year saved on a stated 2-minute-per-entity assumption; 240K tokens per minute shared Azure OpenAI quota; GPT-3.5 at 4,000 tokens context. Originally 2023, updated 2024-07-15. https://engineering.grab.com/llm-powered-data-classification
- Airbnb: nearly 3,500 test files; estimated 1.5 years by hand, done in 6 weeks; 75% in four hours, 97% after four days of tuning; prompts of 40,000 to 100,000 tokens with up to 50 related files; long tail retried 50 to 100 times. https://airbnb.tech/?p=366
- Duolingo (2026-08-04): agent creation from several weeks to "about 10 minutes"; no run counts reported. https://blog.duolingo.com/production-ready-ai-agent-platform/ ; flag-removal agent (2025-12-04): prototype in about 1 day, production in about 1 week. https://blog.duolingo.com/buildingaiagents

---

## 5. Misconceptions a reviewer should check

1. "Durable execution gives exactly-once." It gives at-least-once per step and exactly-once only for effects protected by an idempotency key or a deduplicating provider. The OpenAI Agents SDK says approval does not guarantee exactly-once either. Check any lesson that says "exactly once" without naming the key. Sources: memory-state lesson, https://openai.github.io/openai-agents-python/human_in_the_loop/
2. "Replay means the model is called again." On Temporal, Inngest, DBOS, Lambda durable functions and Restate, replay returns recorded results. On LangGraph time travel, nodes after the checkpoint re-execute, including model calls. Inngest's bulk Replay creates new executions. Three different meanings of one word. Sources: https://docs.langchain.com/oss/python/langgraph/use-time-travel , https://www.inngest.com/docs/platform/replay
3. "Workflow code can't contain an agent because agents are non-deterministic." The model's decision is an activity result recorded in history, so the orchestration stays deterministic on replay. Source: https://temporal.io/blog/of-course-you-can-build-dynamic-ai-agents-with-temporal
4. "Temporal retries a few times and gives up." The default activity policy has unlimited attempts; with no Schedule-To-Close, a permanently failing model call retries forever at 100-second intervals. Mark 400-class errors non-retryable. Source: https://docs.temporal.io/encyclopedia/retry-policies
5. "Every 429 is transient." A Claude spend-cap 429 has no `retry-after` and fails until access resumes; OpenAI flex 429s mean capacity, and the docs suggest falling back to standard tier. Source: https://platform.claude.com/docs/en/api/rate-limits , https://developers.openai.com/api/docs/guides/flex-processing
6. "Generate a fresh UUID for the idempotency key." Stripe suggests random keys, but per logical operation, not per attempt. A key generated inside the retried step changes on each replay and protects nothing. Also check that the key outlives the workflow's retry window (Stripe may prune after 24 hours). Source: https://docs.stripe.com/api/idempotent_requests
7. "Add retries at every layer for resilience." Five layers of three retries is 243 times the load on the failing dependency; retry in one place with a retry budget. Source: https://builder.aws.com/content/3EumjoZascWd1oZiEgL8ORlv3qE/timeouts-retries-and-backoff-with-jitter
8. "Code before `interrupt()` runs once." The node restarts from its first line on resume. Also: a bare `try/except` around `interrupt()` swallows the pause, and reordering interrupts misroutes resume values. Source: https://docs.langchain.com/oss/python/langgraph/interrupts
9. "Batch results come back in input order." Anthropic and OpenAI both say order is not guaranteed; join on `custom_id`. Also check that expired and errored items are re-submitted, not silently dropped. Sources: Anthropic and OpenAI batch docs above.
10. "Batch is just cheaper." It is also a separate rate-limit pool (OpenAI), a separate queue limit (Anthropic), a 24- or 48-hour window, and best-effort caching. A lesson that offers batch as the answer to a user-facing latency problem is wrong. Sources: batch docs above.
11. "The approval is safe because a human clicked it." Check who is authorised to approve, that the reviewer sees the real arguments, that resume state is stored server-side and not trusted from the client, and that timeout never auto-approves a money movement. Source: https://openai.github.io/openai-agents-python/human_in_the_loop/
12. "Pass the whole document between steps." Engines cap payloads (Temporal 2 MB, Inngest 4 MiB per step, Cloudflare 1 MiB per step return); pass references. Sources: limits pages above.
13. "Low-code tools are open source, so we can host them for customers." n8n's Sustainable Use License restricts use to internal business or non-commercial purposes; Dify forbids a multi-tenant service from source without authorisation. Sources: https://github.com/n8n-io/n8n/blob/master/LICENSE.md , https://github.com/langgenius/dify/blob/main/LICENSE
14. "Grab used Google Gemini." Grab's "Gemini" is its internal orchestration service; the model was GPT-3.5. Source: https://engineering.grab.com/llm-powered-data-classification
15. "Uber's 90% accuracy means 90% of invoices are right." The post reports 90% overall accuracy, 35% of invoices at 99.5% and 65% above 80%, without defining the metric beyond exact and fuzzy matching. Do not restate it as a per-invoice success rate. Source: https://www.uber.com/blog/advancing-invoice-document-processing-using-genai/
16. "A model call is a step; put it next to its side effects in the same step." Sometimes the opposite is right: Duolingo keeps clone, agent run and PR in one activity because separate activities may run on different workers without the clone. Step granularity follows locality and idempotency, not a rule. Source: https://blog.duolingo.com/buildingaiagents
17. "OpenTelemetry has a stable agent span standard." The GenAI agent and workflow spans are in Development status and moved to a separate repository; names and span kinds have changed between releases. Lessons should cite a date. Source: https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/gen-ai-agent-spans.md
18. "More agents means better results." Anthropic's own numbers pair the 90.2% gain with about 15 times the tokens, and OpenAI recommends maximising a single agent first. Check that any multi-agent recommendation states the cost. Sources: Anthropic research system post, OpenAI guide.
19. Existing content check: `agt-004` lists `seniority: [mid, senior]`; the updated spec allows only senior and staff. `src/content/lessons/apis/prompting/overview.mdx` names the five patterns without when-to-use guidance; if it stays, it should link to the new module rather than stand as the treatment.
20. Version drift: LangGraph durability defaults, Temporal Worker Versioning (the pre-2025 experimental method is scheduled for removal), Inngest's TypeScript v4 checkpointing and the OpenAI Agents SDK handoff beta (`nest_handoff_history`) all changed within the last year. Every lesson in this area needs an `updated` date and a re-check before publishing.
