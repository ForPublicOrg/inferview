# Track research: Evals and observability (slug `evals`)

Modules: `eval-thinking`, `golden-sets`, `llm-judge`, `agent-evals`, `evals-in-ci`.
Research date: 2026-10-28. Every source line carries the URL and the date it was checked. "Checked" means fetched and read on that date. "Snippet only" means the primary page refused automated fetches (HTTP 403), so the figure comes from the search engine's extract of that page plus secondary coverage; a person should open the page before the figure is published.

Inputs read first: `SPEC.md` (sections 4, 6, 7), `research/brief.json` (curriculum track "Evals and Observability", `interview_question_taxonomy`, `all_sources`), `research/raw-research.json` (eval-related takeaways). The brief's claims about the Maven course price and JD frequency (4.5%) were not rechecked here; treat them as unverified for lesson copy.

---

## 1. Verified facts by module

### 1.1 eval-thinking (error analysis, binary labels, tracing)

| Fact | Value | Source | Checked |
|---|---|---|---|
| Trace review volume | "We recommend reviewing at least 100 traces." Continue past 100 while still learning; stop at theoretical saturation (new traces stop revealing or changing failure modes). | Hamel Husain and Shreya Shankar, AI Evals FAQ (published 2026-09-18, modified 2026-09-21) https://hamel.dev/blog/posts/evals-faq/ | 2026-10-28 |
| Agent-assisted review | Annotate the first 30 traces yourself before asking an agent to find similar failures, so its guesses do not bias you. | same FAQ | 2026-10-28 |
| Re-run cadence | At least 100 fresh traces per error-analysis cycle; cycles typically 2 to 4 weeks; 10 to 20 traces weekly between cycles. | same FAQ | 2026-10-28 |
| Time spent on evals | The authors report spending "60-80% of our development time on error analysis and evaluation" on their own projects. Their experience, not a survey. | same FAQ | 2026-10-28 |
| Binary over Likert | Binary pass/fail forces a decision; adjacent Likert points are inconsistent across annotators and people drift to the middle. For gradual progress use several binary sub-checks. | same FAQ | 2026-10-28 |
| First failure | In multi-turn and multi-step traces, record the first upstream failure; downstream errors often follow from it. | same FAQ | 2026-10-28 |
| N-1 testing | Replay the first N-1 turns of a real conversation and test turn N; often better than fully simulated users because it uses real prefixes. | same FAQ | 2026-10-28 |
| Three levels of evaluation | Level 1 unit tests and assertions on every change; Level 2 human and model eval on a cadence; Level 3 A/B tests after significant product changes. Case study: Rechat's assistant Lucy. Post dated 2024-03-29. | Hamel Husain, Your AI Product Needs Evals https://hamel.dev/blog/posts/evals/ | 2026-10-28 |
| Criteria drift | "users need criteria to grade outputs, but grading outputs helps users define criteria." arXiv 2404.12272, 2024-04-18. | Shankar, Zamfirescu-Pereira, Hartmann, Parameswaran, Arawjo, Who Validates the Validators? https://arxiv.org/abs/2404.12272 | 2026-10-28 |
| OTel GenAI status | Every GenAI convention document is marked Status: Development (not Stable). | https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/README.md (repo last commit 2026-10-27) | 2026-10-28 |
| OTel GenAI location | The GenAI docs in the main `semantic-conventions` repo read "Moved" from release v1.42.0 (2026-06-12); v1.41.1 (2026-05-11) still held them. Latest main-repo release seen: v1.44.0 (2026-08-04). | https://github.com/open-telemetry/semantic-conventions/releases ; https://opentelemetry.io/docs/specs/semconv/gen-ai/ | 2026-10-28 |
| OTel inference span name | `{gen_ai.operation.name} {gen_ai.request.model}`, for example `chat some-model`. | https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/client-inference.md | 2026-10-28 |
| OTel token attributes | `gen_ai.usage.input_tokens`, `gen_ai.usage.output_tokens`, `gen_ai.usage.cache_read.input_tokens`, `gen_ai.usage.cache_write.input_tokens`, `gen_ai.usage.reasoning.output_tokens`. `gen_ai.usage.input_tokens` "SHOULD include all types of input tokens, including cached tokens." | same client-inference.md | 2026-10-28 |
| OTel content capture | `gen_ai.input.messages`, `gen_ai.output.messages`, `gen_ai.system_instructions`, `gen_ai.tool.definitions` are Opt-In because they may hold sensitive data; `_ref` variants hold a URI to external storage. | same client-inference.md; OpenTelemetry blog, Inside the LLM Call https://opentelemetry.io/blog/2026/genai-observability/ | 2026-10-28 |
| OTel prompt versioning | `gen_ai.prompt.name`, and `gen_ai.prompt.version` (conditionally required when the name is set). | same client-inference.md | 2026-10-28 |
| OTel provider attribute | `gen_ai.provider.name`. The older `gen_ai.system` is marked deprecated in v1.37.0 and replaced by `gen_ai.provider.name`. | https://github.com/open-telemetry/semantic-conventions/blob/v1.37.0/docs/registry/attributes/gen-ai.md | 2026-10-28 |
| OTel agent spans | `create_agent`, `invoke_agent` (span name `invoke_agent {gen_ai.agent.name}`), `invoke_workflow`, `execute_tool`; `invoke_agent` is defined for both CLIENT and INTERNAL span kinds. | https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/gen-ai-agent-spans.md | 2026-10-28 |
| OTel retrieval and memory spans | `retrieval` operation with `gen_ai.data_source.id`, `gen_ai.retrieval.top_k`; memory operations such as `search_memory`, `upsert_memory`. | https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/gen-ai-spans.md | 2026-10-28 |
| OTel metrics renamed | v1.37.0 (2025-08-25) defined `gen_ai.client.token.usage`. The current GenAI repo defines `gen_ai.client.inference.usage.input_tokens`, `.output_tokens`, `.cache_read.input_tokens` (and more) plus `gen_ai.client.inference.operation.*` histograms, `gen_ai.client.inference.duration`, `gen_ai.client.operation.duration`, `gen_ai.server.time_to_first_token`, `gen_ai.server.time_per_output_token`. | https://github.com/open-telemetry/semantic-conventions/blob/v1.37.0/docs/gen-ai/gen-ai-metrics.md ; https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/gen-ai-token-metrics.md ; https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/gen-ai-metrics.md | 2026-10-28 |
| OTel MCP and A2A | Separate convention documents for MCP and A2A exist in the GenAI repo. | https://github.com/open-telemetry/semantic-conventions-genai/tree/main/docs/gen-ai | 2026-10-28 |
| Stability opt-in | v1.37.0 told instrumentations to offer `OTEL_SEMCONV_STABILITY_OPT_IN=gen_ai_latest_experimental`. Not found in the new repo's README or spans pages; check before teaching it as current. | https://github.com/open-telemetry/semantic-conventions/blob/v1.37.0/docs/gen-ai/gen-ai-spans.md | 2026-10-28 |

### 1.2 golden-sets (datasets, assertions, metrics, contamination)

| Fact | Value | Source | Checked |
|---|---|---|---|
| Starting size for agent evals | "20-50 simple tasks drawn from real failures is a great start." | Anthropic Engineering, Demystifying evals for AI agents (2026-01-09) https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents | 2026-10-28 |
| Capability vs regression evals | Capability evals start at a low pass rate; regression evals sit near 100%; capability tasks "graduate" into the regression suite. | same Anthropic post | 2026-10-28 |
| Balanced sets | Test both when a behaviour should and should not occur, to avoid one-sided optimisation. | same Anthropic post | 2026-10-28 |
| CI vs production datasets | CI: small purpose-built sets ("100+ examples"), deterministic checks preferred. Production: sample live traces, reference-free evaluators run asynchronously, track confidence intervals, feed new failures back into the CI set. | Hamel and Shreya FAQ https://hamel.dev/blog/posts/evals-faq/ | 2026-10-28 |
| Off-the-shelf metrics | Generic metrics "waste time and create false confidence" as quality measures; useful only to find traces worth reading. BERTScore and ROUGE are generally not useful for LLM outputs. | same FAQ | 2026-10-28 |
| RAGAS faithfulness | (claims in the response supported by the retrieved context) / (total claims in the response). Range 0 to 1. Worked example: two claims, one unsupported, score 0.5. | https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/faithfulness/ | 2026-10-28 |
| RAGAS response (answer) relevancy | An LLM generates N questions from the response (default N = 3, set by `strictness`); score = mean cosine similarity between each generated question's embedding and the user input's embedding. Does not check factual accuracy; can fall outside 0 to 1 in principle. | https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/answer_relevance/ | 2026-10-28 |
| RAGAS context precision | Context Precision@K = sum over k of (Precision@k x v_k) / (number of relevant items in the top K), v_k in {0,1}. Variants: LLM-based with or without reference, non-LLM string similarity, ID-based. | https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/context_precision/ | 2026-10-28 |
| RAGAS context recall | LLM variant: (reference claims supported by the retrieved context) / (reference claims). Non-LLM: relevant contexts retrieved / reference contexts. | https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/context_recall/ | 2026-10-28 |
| RAGAS API status | Legacy metric API slated for deprecation in 0.4 and removal in 1.0; collections API recommended. Latest release v0.4.3 (2026-01-13). The GitHub repo now resolves to `vibrantlabsai/ragas` (was `explodinggradients/ragas`), Apache-2.0. | context_precision page above; https://github.com/vibrantlabsai/ragas | 2026-10-28 |
| RAGAS metric families | RAG metrics, Nvidia metrics, agent and tool metrics (Topic Adherence, Tool Call Accuracy, Tool Call F1, Agent Goal Accuracy), SQL, general rubric metrics. Page dated 2025-12-09. | https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/ | 2026-10-28 |
| RAGAS paper | Reference-free RAG evaluation, arXiv 2309.15217. | https://arxiv.org/abs/2309.15217 (from brief `all_sources`) | not rechecked |
| HumanEval | 164 problems (counted from the released `HumanEval.jsonl.gz`). Codex solved 28.8% with one sample and 70.2% with 100 samples per problem. arXiv 2107.03374, 2021-07-07. | https://github.com/openai/human-eval ; https://arxiv.org/abs/2107.03374 | 2026-10-28 |
| SWE-bench Verified contamination | OpenAI, 2026-02-23: stopped reporting SWE-bench Verified, citing contamination and flawed tests; audited 138 problems that o3 did not solve consistently over 64 runs, each reviewed by at least six engineers; at least 59.4% of audited problems had tests that reject correct submissions; recommended SWE-bench Pro. | https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/ (snippet only); secondary: https://decrypt.co/359012/openai-benchmark-measure-ai-coding-supremacy-contaminated | 2026-10-28 |

### 1.3 llm-judge (calibration, bias, pairwise vs pointwise)

| Fact | Value | Source | Checked |
|---|---|---|---|
| Judge-human agreement | Strong judges such as GPT-4 reach over 80% agreement with controlled and crowdsourced human preferences, the same level as human-human agreement in that data. 3K expert votes and 30K conversations released. | Zheng et al., Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena, arXiv 2306.05685 (v1 2023-06-09, v4 2023-12-24) https://arxiv.org/abs/2306.05685 | 2026-10-28 |
| MT-Bench size | 80 multi-turn questions, 8 categories, 10 each. | https://arxiv.org/html/2306.05685v4 | 2026-10-28 |
| Position bias numbers | With swapped order, GPT-4 was consistent in 65.0% of cases and favoured the first position 30.0% of the time. Mitigation used: judge both orders, count a win only if both agree, else a tie. | same | 2026-10-28 |
| Verbosity bias numbers | A "repetitive list" attack on 23 answers fooled Claude-v1 and GPT-3.5 in 91.3% of cases and GPT-4 in 8.7%. | same | 2026-10-28 |
| Self-enhancement | GPT-4 favoured itself by about 10% win rate, Claude-v1 by about 25%, GPT-3.5 not at all; the authors say their data cannot establish whether the bias exists. | same | 2026-10-28 |
| Self-preference mechanism | Evaluators recognise their own generations; after fine-tuning, self-recognition correlates linearly with self-preference; controlled experiments suggest a causal link. arXiv 2404.13076, 2024-04-15. | Panickssery, Bowman, Feng https://arxiv.org/abs/2404.13076 | 2026-10-28 |
| Position bias factors | 15 judges, over 150,000 instances. Bias is not random, varies by judge and task, is weakly affected by prompt length and strongly by the quality gap: consistency is worst when candidates are close in quality. Revision v9 2025-11-11, AACL-IJCNLP 2025. | Shi et al., Judging the Judges https://arxiv.org/abs/2406.07791 ; https://arxiv.org/html/2406.07791 | 2026-10-28 |
| Verbosity correction | Length-controlled AlpacaEval raises Spearman correlation with Chatbot Arena from 0.94 to 0.98. v2 2025-03-10. | Dubois et al. https://arxiv.org/abs/2404.04475 | 2026-10-28 |
| Pairwise vs pointwise | Pairwise protocols are more exposed to distractor features; pairwise preferences flip in about 35% of cases vs about 9% for absolute scores. Choose by dataset and goal. COLM 2025, v2 2025-08-21. | Tripathi, Wadhwa, Durrett, Niekum https://arxiv.org/abs/2504.14716 | 2026-10-28 |
| TPR/TNR (FAQ convention) | "positive" means an error is present. TPR = share of real failures the evaluator catches (8 of 10 = 80%); TNR = share of good outputs it passes (95 of 100 = 95%). | https://hamel.dev/blog/posts/evals-faq/ | 2026-10-28 |
| Judge validation data | Split labels roughly train 10-20%, dev 40-45%, test 40-45%; aim for 30 to 50 of each label in dev and test (another entry says at least 50 pass and 50 fail); 100 to 200 labelled examples per failure mode. | same FAQ; Hamel Husain, Using LLM-as-a-Judge (2024-10-29, modified 2026-09-01) https://hamel.dev/blog/posts/llm-judge/ | 2026-10-28 |
| Critique shadowing | A principal domain expert gives pass/fail plus a written critique; critiques become few-shot examples; iterate the judge until it agrees. The Honeycomb example passed 90% agreement in three iterations (an example, not a target). | https://hamel.dev/blog/posts/llm-judge/ | 2026-10-28 |
| Bias-corrected pass rate | `theta = (p_obs + TNR - 1) / (TPR + TNR - 1)` with a bootstrap interval, where this library's TPR is P(judge pass given human pass). MIT, last push 2025-05-25. | judgy https://github.com/ai-evals-course/judgy | 2026-10-28 |
| Grader taxonomy | Code-based, model-based, human; the post recommends deterministic graders where possible, LLM graders where necessary, human graders judiciously. Model graders need calibration against humans. | Anthropic, Demystifying evals for AI agents https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents | 2026-10-28 |
| Error bars | Treat eval questions as a sample from a super-population; gives formulas for comparing two models and planning evals. The abstract does not itself name clustered errors or paired tests; read the PDF before citing specifics. arXiv 2411.00640, 2024-11-01. | Evan Miller, Adding Error Bars to Evals https://arxiv.org/abs/2411.00640 | 2026-10-28 |

### 1.4 agent-evals (benchmarks, pass^k, trajectories)

| Fact | Value | Source | Checked |
|---|---|---|---|
| pass^k definition | pass^k = E_task[ C(c,k) / C(n,k) ] for n trials with c successes; pass@k = 1 - E_task[ C(n-c,k) / C(n,k) ]. pass^k is the chance that all k i.i.d. trials succeed. | Yao, Shinn, Razavi, Narasimhan, tau-bench, arXiv 2406.12045 (2024-06-17) https://arxiv.org/html/2406.12045 | 2026-10-28 |
| tau-bench sizes and results | tau-retail 115 tasks, tau-airline 50; gpt-4o (function calling) pass^1 61.2% retail, 35.2% airline; pass^8 under 25% in retail. | same | 2026-10-28 |
| tau2 and current repo | `sierra-research/tau2-bench`: airline, retail, telecom (plus mock, banking_knowledge, intake). Latest release v2.0.0 (2026-10-20), called "τ-bench 2.0", adds six languages and voice; the leaderboard at taubench.com keeps 1.x and 2.0 on separate tabs and they are not comparable. MIT. | https://github.com/sierra-research/tau2-bench | 2026-10-28 |
| pass^k intuition | 75% per-trial success over 3 trials gives 0.75^3, about 42%. | Anthropic, Demystifying evals for AI agents | 2026-10-28 |
| Saturation | Anthropic describes SWE-bench Verified scores rising from about 30% to over 80%. | same | 2026-10-28 |
| Grade outcomes | "often better to grade what the agent produced, not the path it took"; a 0% pass rate over many trials "is most often a signal of a broken task, not an incapable agent." | same | 2026-10-28 |
| Agent-type guidance | Coding: tests plus static analysis plus rubric. Conversational: end-state checks, transcript constraints, simulated user. Research: groundedness, coverage, source quality. Computer use: check the final state in a sandbox. | same | 2026-10-28 |
| Transition failure matrix | Rows: last successful state; columns: state of the first failure. FAQ text-to-SQL example: GenSQL to ExecSQL had 12 failures vs 2 for DecideTool to PlanCal. | Hamel and Shreya FAQ | 2026-10-28 |
| SWE-bench Verified | 500 instances (HF dataset `princeton-nlp/SWE-bench_Verified`, single test split); `FAIL_TO_PASS` lists the tests the fix must make pass and `PASS_TO_PASS` the tests that must keep passing. Released 2024-08-13. | https://huggingface.co/datasets/princeton-nlp/SWE-bench_Verified ; https://www.swebench.com/SWE-bench/ | 2026-10-28 |
| SWE-bench Verified construction | 93 Python-experienced developers annotated 1,699 random SWE-bench test samples; GPT-4o resolved 33.2% on Verified vs 16% on the original set. | https://openai.com/index/introducing-swe-bench-verified/ (snippet only) | 2026-10-28 |
| SWE-bench Pro | 1,865 problems from 41 repos: public (11 repos), held-out (12), commercial (18; results released, problems private). arXiv 2509.16941 (v1 2025-09-21, v2 2025-11-14). | https://arxiv.org/abs/2509.16941 | 2026-10-28 |
| SWE-bench Pro criticism | A 2026-02-24 personal audit of 100 random Pro problems reports weak tests and tests rejecting correct solutions. A commenter links an OpenAI post on X said to retract the Pro recommendation; not verified. | https://www.lesswrong.com/posts/nAMhbz5sfpcynjPP5/swe-bench-pro-is-even-worse | 2026-10-28 |
| GAIA | 466 questions: 166 dev with answers, 300 test with answers withheld; three levels (L1 at most one tool and 5 steps, L2 about 5 to 10 steps, L3 open-ended); quasi-exact-match grading. Humans 92% vs GPT-4 with plugins 15%. arXiv 2311.12983 (2023-11-21). | https://arxiv.org/abs/2311.12983 ; https://arxiv.org/html/2311.12983 | 2026-10-28 |
| BrowseComp | 1,266 questions with short verifiable answers. Accuracy: GPT-4o 0.6%, GPT-4o with browsing 1.9%, GPT-4.5 0.9%, o1 9.9%, Deep Research 51.5% (trained on data meant to help on such tasks). Human trainers solved 29.2% (367 of 1,255) and gave up on 70.8% after about two hours. arXiv 2504.12516 (2025-04-16). | https://arxiv.org/abs/2504.12516 ; https://arxiv.org/html/2504.12516 | 2026-10-28 |
| Terminal-Bench 2.0 | 89 tasks in terminal environments; frontier models and agents score under 65%. arXiv 2601.11868 (2026-01-17), ICLR 2026; tasks run on the Harbor harness. | https://arxiv.org/abs/2601.11868 | 2026-10-28 |
| WebArena | 812 tasks; best GPT-4 agent 14.41% vs humans 78.24% at publication (2023-07-25, v4 2024-04-16). | https://arxiv.org/abs/2307.13854 ; https://github.com/web-arena-x/webarena | 2026-10-28 |
| OSWorld | 369 tasks; humans over 72.36%, best model 12.24% at publication (2024-04-11). | https://arxiv.org/abs/2404.07972 | 2026-10-28 |
| BFCL versions | v1 AST, v2 live data, v3 multi-turn, v4 agentic (web search, memory, format sensitivity). | https://github.com/ShishirPatil/gorilla/tree/main/berkeley-function-call-leaderboard | 2026-10-28 |
| Trajectory match modes | agentevals: `strict`, `unordered`, `subset`, `superset`, plus trajectory LLM-as-judge and graph trajectory evaluators. MIT. | https://github.com/langchain-ai/agentevals | 2026-10-28 |
| Human handoffs | The trace continues until the user's need is resolved, not at handoff; log handoff reason, context passed, wait time, resolution. | Hamel and Shreya FAQ | 2026-10-28 |

### 1.5 evals-in-ci (gates, online evals, feedback loops, tools)

| Fact | Value | Source | Checked |
|---|---|---|---|
| Guardrails vs evaluators | Guardrails run inline before output reaches the user, fast and deterministic ("a few milliseconds"), for clear high-impact failures such as PII or malformed JSON. Evaluators run after generation, asynchronously, for nuanced quality. | Hamel and Shreya FAQ | 2026-10-28 |
| How often to run | Weigh eval cost, saturation and business value; cheap assertions on every change, expensive judges before release; retire or harden saturated evals. | same FAQ | 2026-10-28 |
| LangSmith online evals | Filters (negative feedback, tool calls, metadata, other evaluator scores), sampling rate (0.1 = 10% of matching runs), backfill only when the rule is created, weekly per-evaluator LLM spend cap (resets Monday 00:00 UTC), thread evaluators run when a thread goes idle; an online evaluator run upgrades the trace to extended retention. | https://docs.langchain.com/langsmith/online-evaluations | 2026-10-28 |
| LangSmith evaluator types | Code, LLM-as-judge, pairwise, human, decision model; reference-free evaluators work offline and online, reference-based only offline. | https://docs.langchain.com/langsmith/evaluation-concepts | 2026-10-28 |
| LangChain eval packages | langsmith-sdk v0.14.9 (2026-10-15), openevals v0.2.2 (2026-10-22), both MIT. | https://github.com/langchain-ai/langsmith-sdk ; https://github.com/langchain-ai/openevals | 2026-10-28 |
| Langfuse | Datasets, experiments (UI, SDK, or OpenTelemetry), LLM-as-a-judge on live traces, annotation queues, scores; a GitHub Action can fail a PR on a score threshold. Latest release v4.71.0 (2026-10-27). Core MIT, `ee/` folders under a separate licence. | https://langfuse.com/docs/evaluation/overview ; https://github.com/langfuse/langfuse | 2026-10-28 |
| Langfuse ownership | ClickHouse announced the acquisition on 2026-01-16 with its Series D; core stays MIT; Langfuse Cloud continues. | https://langfuse.com/blog/joining-clickhouse ; https://clickhouse.com/blog/clickhouse-acquires-langfuse-open-source-llm-observability (snippet only; the licence file naming ClickHouse as copyright holder was fetched) | 2026-10-28 |
| Braintrust | `Eval()` = data + task + scores; each run is a permanent experiment; autoevals scorers (MIT, py-0.4.1, 2026-10-21); Python SDK py-sdk-v0.48.1 (2026-10-26, Apache-2.0). `braintrustdata/eval-action@v2` runs `braintrust eval --jsonl` and posts a PR comment with score diffs; it needs `pull-requests: write`. | https://www.braintrust.dev/docs/start/eval-sdk ; https://github.com/braintrustdata/eval-action ; https://github.com/braintrustdata/autoevals | 2026-10-28 |
| Arize Phoenix | Tracing via OpenTelemetry with OpenInference instrumentation, LLM evals, datasets, experiments, playground; self-host with `pip install arize-phoenix` then `phoenix serve`. Licence: Elastic License 2.0. Latest release arize-phoenix-v20.26.1 (2026-10-25). | https://github.com/Arize-ai/phoenix | 2026-10-28 |
| promptfoo in CI | `npx promptfoo@latest eval -c promptfooconfig.yaml -o results.json`; `--fail-on-error`; custom gates parse `results.json` (the docs example fails under a 95% pass rate); cache via `PROMPTFOO_CACHE_PATH` and `PROMPTFOO_CACHE_TTL`; red team via `promptfoo redteam run` and `promptfoo/promptfoo-action@v1`. Page updated 2026-10-26. Latest release 0.125.1 (2026-10-25), MIT. | https://www.promptfoo.dev/docs/integrations/ci-cd/ ; https://github.com/promptfoo/promptfoo | 2026-10-28 |
| promptfoo ownership | OpenAI announced on 2026-03-09 that it would acquire Promptfoo and fold it into OpenAI Frontier. | https://openai.com/index/openai-to-acquire-promptfoo/ (snippet only); https://siliconangle.com/2026/03/09/openai-acquire-promptfoo-expand-ai-application-testing-capabilities/ | 2026-10-28 |
| OpenAI Evals platform deprecation | Announced 2026-06-03; existing evals read-only 2026-10-31; dashboard and API shut down 2026-11-30; graders for eval workflows are included; the migration guide points to promptfoo. | https://developers.openai.com/api/docs/deprecations | 2026-10-28 |
| OpenAI grader types | `string_check`, `text_similarity`, `score_model`, `python`, `multi` (the graders page carries the deprecation note). | https://developers.openai.com/api/docs/guides/graders | 2026-10-28 |
| Inspect (inspect-ai) | UK AI Security Institute and Meridian Labs; Task = Dataset + Solver + Scorer; `inspect eval file.py --model provider/model`; `inspect view` log viewer; sandboxes (Docker, Kubernetes, Modal, Proxmox, Vagrant); built-in `react()` agent; can run external agents such as Claude Code and Codex CLI. Release 0.3.285 (2026-10-25), MIT. | https://inspect.aisi.org.uk/ ; https://github.com/UKGovernmentBEIS/inspect_ai | 2026-10-28 |
| Coding-agent evals in practice | Start with public benchmarks (SWE-bench, Terminal-Bench, Aider Polyglot, HumanEval) for broad agents, then build a private benchmark of hard internal tasks with environments and tests. | Hamel and Shreya FAQ | 2026-10-28 |

Numbers that could not be sourced and must not appear in lessons without a new source: any "standard" judge-human agreement threshold (sources give examples, not targets; one prep guide suggests Cohen's kappa 0.6 to 0.8 without a source); any industry-wide share of teams running evals in CI; vendor pricing for Langfuse, Braintrust, LangSmith and Phoenix (not checked); current leaderboard leaders on any benchmark (they change often; link the leaderboard instead).

---

## 2. Latest developments interviews ask about (2025 and 2026 primary sources)

1. **SWE-bench Verified retired as a headline number.** OpenAI stopped reporting it on 2026-02-23 (contamination plus flawed tests) and pointed to SWE-bench Pro (arXiv 2509.16941, 2025-09). Pro has its own published criticism (2026-02-24). Interview angle: "Why can a benchmark score mislead you about your repo?" Sources: https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/ (snippet only), https://arxiv.org/abs/2509.16941, https://www.lesswrong.com/posts/nAMhbz5sfpcynjPP5/swe-bench-pro-is-even-worse. Checked 2026-10-28.
2. **Agent eval vocabulary from Anthropic (2026-01-09).** Task, trial, grader, transcript, outcome, eval harness vs agent harness, capability vs regression suites, pass@k vs pass^k, grade outcomes over paths, read the transcripts. https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents. Checked 2026-10-28.
3. **pass^k as the reliability metric.** tau-bench defined it; tau2 added telecom and dual control; the repo shipped "τ-bench 2.0" (v2.0.0, 2026-10-20) with multilingual and voice tasks. https://arxiv.org/html/2406.12045 ; https://github.com/sierra-research/tau2-bench. Checked 2026-10-28.
4. **Terminal-Bench 2.0** (89 tasks, ICLR 2026, Harbor harness) as the terminal-agent benchmark next to SWE-bench. https://arxiv.org/abs/2601.11868. Checked 2026-10-28.
5. **BrowseComp** (2025-04) for browsing agents: short verifiable answers keep grading cheap; human trainers gave up on 70.8%. https://arxiv.org/abs/2504.12516. Checked 2026-10-28.
6. **Pairwise vs pointwise is not settled in favour of pairwise.** Tripathi et al. (COLM 2025) show pairwise judgments are easier to sway with distractors. https://arxiv.org/abs/2504.14716. Checked 2026-10-28.
7. **Position bias depends on the quality gap** (Shi et al., revised 2025-11-11): judges are least consistent when answers are close. https://arxiv.org/abs/2406.07791. Checked 2026-10-28.
8. **Length control for verbosity bias** (Dubois et al., v2 2025-03-10). https://arxiv.org/abs/2404.04475. Checked 2026-10-28.
9. **Error analysis practice (Hamel Husain, Shreya Shankar).** The FAQ was republished in 2026-09 with agent-assisted trace review (label 30 yourself first), at least 100 traces, TPR/TNR with "positive = error", train/dev/test splits for judges, transition failure matrices for agents, N-1 testing for multi-turn, guardrails vs evaluators. https://hamel.dev/blog/posts/evals-faq/. Checked 2026-10-28.
10. **Bias-corrected success rates from imperfect judges** (judgy, 2025). https://github.com/ai-evals-course/judgy. Checked 2026-10-28.
11. **RAGAS collections API and agent metrics** (v0.4.x, 2026-01; docs dated 2025-12-09): faithfulness, response relevancy, context precision and recall, plus Tool Call Accuracy, Tool Call F1, Agent Goal Accuracy, Topic Adherence. https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/. Checked 2026-10-28.
12. **OpenTelemetry GenAI semantic conventions** moved to their own repo (from semconv v1.42.0, 2026-06-12), still Development status, now with agent, tool, retrieval, memory, MCP and A2A conventions, opt-in content capture, and cache and reasoning token attributes. https://github.com/open-telemetry/semantic-conventions-genai ; https://opentelemetry.io/blog/2026/genai-observability/. Checked 2026-10-28.
13. **Tooling consolidation in 2026.** ClickHouse acquired Langfuse (2026-01-16); OpenAI announced the Promptfoo acquisition (2026-03-09) and shuts its Evals platform on 2026-11-30 with a promptfoo migration guide. Lessons must not tell readers to start on the OpenAI Evals API. Sources in table 1.5. Checked 2026-10-28.
14. **Online evals with cost controls.** LangSmith online evaluators: filters, sampling rates, weekly spend caps, thread-level evaluators. https://docs.langchain.com/langsmith/online-evaluations. Checked 2026-10-28.
15. **Evals in CI as PR comments and gates.** Braintrust eval-action v2, the Langfuse GitHub Action, promptfoo CLI with `--fail-on-error`. Sources in table 1.5. Checked 2026-10-28.
16. **Inspect as the open harness for agent and safety evals**, with sandboxes and support for running external coding agents. https://inspect.aisi.org.uk/. Checked 2026-10-28.

---

## 3. Interview questions collected

Type key follows SPEC section 6. "Company" is filled only when the source names a company for that question. Difficulty is my rating for a senior candidate. All sources checked 2026-10-28.

Source reliability: every question source here is secondary (prep sites and GitHub question banks). No first-hand candidate write-up of an eval question was found on a company engineering blog. The Landed company guides cite numbered candidate reports whose links are not published in the repo, so those company attributions are weak; per SPEC section 6 they go into `companies` only if the problem author accepts the Landed page itself as the public source.

| # | Question (quoted, or marked as paraphrase) | Type | Diff. | Module | Source | Company named by source |
|---|---|---|---|---|---|---|
| 1 | "Here are 50 markdown docs. Build a Q&A system, an eval set of 20 questions, and report recall@5 and faithfulness." | design (take-home) | hard | golden-sets | https://www.techinterview.org/post/3233476824/ai-engineer-interview-rag-agents-evals/ (2026-07-23) | none |
| 2 | Build an automated faithfulness and relevance eval on about 30 sample pairs, then tune it against provided human labels (paraphrase). | code | medium | llm-judge | same | none |
| 3 | "Design a support assistant. How do you know it's helping and not making things worse?" | design | medium | eval-thinking | same | none |
| 4 | "How do you trace a multi-step run so you can see which tool call went sideways?" | concept | medium | eval-thinking | same | none |
| 5 | Outcome vs trajectory eval: when does each fail? (source wording, punctuation changed) | concept | medium | agent-evals | https://github.com/landedjobs/awesome-ai-engineer-interview/blob/main/content/04-evals-and-llm-as-judge.md | none |
| 6 | "Build a regression test set for a feature that ships weekly." | design | medium | evals-in-ci | same | none |
| 7 | "When do you trust GPT-4-as-judge vs a human?" | concept | medium | llm-judge | same | none |
| 8 | "Design an eval suite for a coding agent." | design | hard | agent-evals | same | none |
| 9 | "How do you evaluate a reasoning model differently?" | concept | hard | agent-evals | same | none |
| 10 | You report reliability for a customer-facing support agent. Which metric should the SLA use? (paraphrase of an MCQ: pass^k, pass@k, pass@1) | mcq | medium | agent-evals | https://github.com/landedjobs/awesome-ai-engineer-interview/blob/main/questions/evals.md | none |
| 11 | A security eval reports 0% pass@100 on a task where the agent should refuse an injected instruction. Most likely explanation? (paraphrase) | debug | medium | agent-evals | same | none |
| 12 | Final answers look fine, but cost creeps up and runs take extra tool calls. Which eval surfaces this? (paraphrase) | mcq | easy | agent-evals | same | none |
| 13 | "Why does AlpacaEval 2.0 use length-controlled win-rate?" | concept | medium | llm-judge | same | none |
| 14 | "Debug a sudden 5pp regression in your eval?" | debug | hard | evals-in-ci | https://github.com/landedjobs/awesome-ai-engineer-interview/blob/main/company/openai.md | OpenAI (cites an unlinked candidate report) |
| 15 | "Design an evaluation pipeline" | design | hard | evals-in-ci | same | OpenAI (cites an unlinked candidate report) |
| 16 | "How do you evaluate a generative model after fine-tuning?" | concept | medium | golden-sets | same | OpenAI (cites an unlinked candidate report) |
| 17 | "How would you evaluate the quality of a search-engine LLM answer?" | design | medium | golden-sets | https://github.com/landedjobs/awesome-ai-engineer-interview/blob/main/company/perplexity.md | Perplexity (cites an unlinked candidate report) |
| 18 | Take-home "Build an ML evaluation pipeline", with the follow-up "Which metric would you gate a model release on, and what's its failure mode?" | design | hard | evals-in-ci | https://github.com/landedjobs/awesome-ai-engineer-interview/blob/main/company/scale.md | Scale AI (take-home cites an unlinked candidate report; the follow-up is the guide's own suggestion) |
| 19 | "How would you define success metrics for an AI-oriented feature or product?" | design | medium | evals-in-ci | https://www.aced.io/blog/ai-engineer-interview-questions (formerly tryexponent.com; page says updated "a month ago", 2026) | Perplexity |
| 20 | A deployed conversational model gives confident but factually wrong answers in high-risk contexts. How would you investigate and mitigate it? (close paraphrase) | design | hard | eval-thinking | same | Anthropic (ML engineer loop) |
| 21 | "How do you catch regressions when you change a prompt or swap a model?" | concept | medium | evals-in-ci | same | none |
| 22 | "What does LLM-as-a-judge do, and what are its failure modes?" | concept | easy | llm-judge | same | none |
| 23 | "Pairwise comparison or absolute scoring?" | mcq | medium | llm-judge | https://prachub.com/resources/llm-evaluation-interview-questions-evals-llm-as-judge-drift-and-production-quality (2026-08-13) | none |
| 24 | "Offline quality improved, but production quality fell. How do you debug it?" | debug | hard | evals-in-ci | same | none |
| 25 | "What do you monitor before ground-truth labels arrive?" | concept | medium | evals-in-ci | same | none |
| 26 | "How do you detect evaluator drift?" | concept | hard | llm-judge | same | none |
| 27 | "How do you prevent benchmark overfitting and contamination?" | concept | medium | golden-sets | same | none |
| 28 | "Your new model version scores higher on every benchmark, but users say it got worse. Why does this happen, and how do you find the problem?" | debug | medium | golden-sets | https://github.com/amitshekhariitbhu/ai-engineering-interview-questions | none |
| 29 | "How would you evaluate an autonomous coding agent? Why can SWE-bench pass rates be misleading?" | concept | hard | agent-evals | same | none |
| 30 | "How do you compare two models or prompts in a statistically rigorous way?" | estimate | hard | evals-in-ci | same | none |
| 31 | "Explain BLEU, ROUGE, and BERTScore. When would you use each?" | concept | easy | golden-sets | same | none |
| 32 | "How do you evaluate a RAG system? Explain faithfulness, relevance, and context precision/recall." | concept | medium | golden-sets | same | none |
| 33 | "You have 100K user interactions. How do you build a 500-item eval set from them?" | design | medium | golden-sets | https://www.techinterview.org/post/3233475313/interviewing-ai-eval-engineering-roles-2026/ (2026-05-06, updated 2026-06-30) | none |
| 34 | "Your eval shows 95% pass rate but users complain. What is wrong?" | debug | medium | eval-thinking | same | none |
| 35 | "You need to evaluate a new model release this week. How do you decide if it is better?" | design | medium | evals-in-ci | same | none |
| 36 | "Your eval reports 82% pass on 100 examples. What does that number not tell you?" | estimate | medium | eval-thinking | https://github.com/ombharatiya/AI-Engineer-Interview-Questions/blob/main/07-evaluation-and-observability/questions.md | none |
| 37 | "Define pass@k. Why is the naive way of computing it problematic, and what's the fix?" | code | medium | agent-evals | same | none |
| 38 | "What are OpenTelemetry's GenAI semantic conventions, and why should you care?" | mcq | easy | eval-thinking | same | none |
| 39 | "How do you know your system is good?" followed by "Show me an eval you built." | behavioural | medium | eval-thinking | https://www.kore1.com/llm-engineer-interview-questions/ (updated 2026-07-17) | none |

Count: 39 questions.

### Recommended for the problem bank (15), with core marking (12 core)

| Pick | From # | Suggested id | Type | Module | Core | Why |
|---|---|---|---|---|---|---|
| 1 | 34 | evl-001 | debug | eval-thinking | yes | Metric up, users unhappy: stale or unrepresentative set, lenient judge, failure modes never labelled. |
| 2 | 36 | evl-002 | estimate | eval-thinking | yes | The Wilson 95% interval on 82/100 is about 0.733 to 0.883 (computed with snippet 6's `wilson`), so the band can be shown in front of the reader. |
| 3 | 38 | evl-003 | mcq | eval-thinking | no | Covers the OTel GenAI conventions that SPEC section 7 requires; distractors come from the older names (`gen_ai.system`, `gen_ai.client.token.usage`). |
| 4 | 33 | evl-004 | design | golden-sets | yes | Sampling, stratification, dedup, labelling budget, versioning. |
| 5 | 28 | evl-005 | debug | golden-sets | yes | Contamination and benchmark-vs-product distribution, with the 2026 SWE-bench Verified story. |
| 6 | 32 | evl-006 | concept | golden-sets | no | RAGAS definitions; overlaps the rag track, so non-core here. |
| 7 | 7 and 22 | evl-007 | concept | llm-judge | yes | "How do you know your LLM judge can be trusted?": TPR and TNR on held-out labels, splits, bias tests. |
| 8 | 23 | evl-008 | mcq | llm-judge | yes | Pairwise vs pointwise with the 2025 distractor result and the MT-Bench swap rule. |
| 9 | 2 | evl-009 | code | llm-judge | yes | Compute TPR, TNR, kappa and a bias-corrected pass rate (snippets 1 and 2), stdlib only. |
| 10 | 10 | evl-010 | estimate | agent-evals | yes | Given trials per task, compute pass^k; show that the pooled rate to the power k underestimates it (snippet 3). |
| 11 | 11 | evl-011 | debug | agent-evals | yes | 0% over many trials points at a broken task or grader (Anthropic 2026). |
| 12 | 29 | evl-012 | concept | agent-evals | yes | Outcome vs trajectory, harness dependence, contamination, private task sets. |
| 13 | 15 and 6 | evl-013 | design | evals-in-ci | yes | Eval-gated CI: tiered suites, hard gates vs statistical gates, PR diffs of flipped cases. OpenAI named via Landed (weak). |
| 14 | 30 | evl-014 | estimate | evals-in-ci | no | Paired comparison: overlapping intervals but a significant sign test on the flipped cases (snippet 6). |
| 15 | 19 | evl-015 | design | evals-in-ci | yes | Success metrics for an AI feature; Perplexity named by Aced. |

Type coverage of the 15: debug 3, estimate 3, mcq 2, concept 3, design 3, code 1. Behavioural is left to the rounds track (#39 can be linked from there). Core count: 12.

---

## 4. Misconceptions and gotchas a reviewer should check

1. **Raw agreement on imbalanced labels.** A judge that always says "pass" scores 90% agreement when 10% of traces fail, with TPR 0 and kappa 0 (snippet 1). Lessons must report TPR and TNR or a confusion matrix, not agreement alone.
2. **Which class is "positive".** The Hamel and Shreya FAQ defines positive as "error present" (TPR = failures caught). The judgy correction formula treats pass as the positive class. Mixing the two silently inverts the correction. State the convention every time.
3. **pass^k is not the pooled rate to the power k.** tau-bench computes C(c,k)/C(n,k) per task and averages. With uneven tasks the pooled shortcut underestimates: three tasks at 8/8, 6/8 and 2/8 give pass^4 = 0.405, while 0.667^4 is about 0.198 (snippet 3). Anthropic's 0.75^3 example illustrates independent trials; it is not the estimator.
4. **pass@k needs n >= k samples and the unbiased estimator** from Chen et al. 2021; plugging a pass@1 estimate into 1 - (1 - p)^k is biased.
5. **"GPT-4 agrees with humans 80% of the time"** is a pairwise-preference result on MT-Bench and Chatbot Arena data, equal to human-human agreement there. It is not a general accuracy figure for judges on your task.
6. **Self-enhancement is not proven in Zheng et al.** The authors say their data cannot establish it; the stronger evidence is Panickssery et al. 2024. Do not cite MT-Bench as proof.
7. **Position bias is worst when answers are close in quality**, not when they differ a lot (Shi et al.). An automated summary produced during this research had it backwards; check lesson wording.
8. **Pairwise is not automatically more reliable.** Tripathi et al. 2025: pairwise preferences flipped in about 35% of cases under distractors vs about 9% for absolute scores.
9. **RAGAS faithfulness measures support by the retrieved context, not truth.** A faithful answer is false when the context is wrong. Response relevancy does not check facts. Context recall needs a reference answer (LLM variant) or reference contexts.
10. **RAGAS API churn.** Legacy metric classes are deprecated in 0.4 and removed in 1.0, and the repo moved to `vibrantlabsai/ragas`. Code problems should not import RAGAS in Pyodide; implement the formula instead (snippet 5).
11. **SWE-bench Verified as "the" coding benchmark.** Since 2026-02-23 OpenAI no longer reports it, and Anthropic's January 2026 post calls it near saturation. Present it as history plus a contamination lesson; do not quote a "current best score".
12. **SWE-bench Pro as the clean replacement.** It has published criticism, and an OpenAI retraction of its recommendation is claimed in a comment but unverified. Write "OpenAI recommended Pro in February 2026" and stop there.
13. **SWE-bench grading** uses both FAIL_TO_PASS and PASS_TO_PASS tests; "the new test passes" misses the regression half.
14. **OTel GenAI is not stable** and moved repos in June 2026. `gen_ai.client.token.usage` and `gen_ai.system` are older names; current docs use `gen_ai.client.inference.usage.*` and `gen_ai.provider.name`. Content capture is opt-in, so "OTel records prompts" is wrong by default.
15. **Cached tokens.** OTel says `gen_ai.usage.input_tokens` SHOULD include cached tokens, while some provider APIs report cached tokens in a separate field. Cost code must neither double count nor drop them.
16. **"Phoenix is open source."** Its licence is Elastic License 2.0, which is source-available and not OSI-approved. Langfuse core is MIT with `ee/` exceptions. Say "self-hostable" unless the licence is OSI-approved.
17. **OpenAI Evals API as a starting point.** It goes read-only on 2026-10-31 and shuts down on 2026-11-30. Any lesson or problem built on it is out of date at launch.
18. **Similarity metrics as quality metrics.** BLEU, ROUGE and BERTScore are generally not useful for LLM output quality (FAQ); they still help for retrieval similarity or as signals to find traces.
19. **Likert scales "for nuance".** The sourced practice is binary per criterion; nuance comes from several binary checks.
20. **Overlapping confidence intervals do not mean "no difference"** in a paired design. Snippet 6: 170/200 and 163/200 have overlapping Wilson intervals, yet 9 regressions against 2 fixes give a one-sided sign-test p of about 0.033.
21. **0% across many trials** usually means a broken task or grader (Anthropic), not an incapable model.
22. **Grading paths too strictly.** Anthropic advises grading outcomes; exact tool-sequence matching penalises valid alternatives. Trajectory checks belong to diagnosis and efficiency, not as the only pass criterion.
23. **Trace counts.** The FAQ says "at least 100" and to continue while still learning; it does not say 100 is enough. 30 is the number to label yourself before agent help.
24. **Guardrail vs evaluator.** Guardrails are inline, fast and blocking; evaluators are asynchronous and measure quality. An async LLM judge is not a guardrail.
25. **Benchmark figures without date and harness.** WebArena 14.41%, OSWorld 12.24% and GAIA 15% (GPT-4 with plugins) are publication-time numbers from 2023 and 2024. Label them as such.
26. **Python snippet trap.** A comment in the first two lines containing `coding:` followed by a word (for example "open coding: count ...") is parsed as an encoding declaration and raises `SyntaxError: encoding problem`. Hit while verifying snippet 9; reviewers should check first-line comments in code problems.

---

## 5. Runnable Python snippets

All snippets use only the standard library (Pyodide-safe). Each was run with CPython 3.12.6 on 2026-10-28 using `python -W error` (no warnings), and the output shown is the actual output. Prices in snippet 10 are placeholder inputs, not facts.

### Snippet 1 (llm-judge): raw agreement vs TPR, TNR and Cohen's kappa

Status: verified (ran, exit 0).

```python
# Judge vs human labels: why raw agreement misleads on imbalanced data.
# Convention: "fail" is the positive class (the thing we want the judge to catch).
def confusion(human, judge, positive="fail"):
    tp = sum(h == positive and j == positive for h, j in zip(human, judge))
    fn = sum(h == positive and j != positive for h, j in zip(human, judge))
    tn = sum(h != positive and j != positive for h, j in zip(human, judge))
    fp = sum(h != positive and j == positive for h, j in zip(human, judge))
    return tp, fn, tn, fp

def report(human, judge):
    tp, fn, tn, fp = confusion(human, judge)
    n = len(human)
    agree = (tp + tn) / n
    tpr = tp / (tp + fn) if tp + fn else float("nan")   # failures caught
    tnr = tn / (tn + fp) if tn + fp else float("nan")   # passes correctly passed
    # Cohen's kappa: agreement corrected for chance
    p_h = (tp + fn) / n
    p_j = (tp + fp) / n
    p_e = p_h * p_j + (1 - p_h) * (1 - p_j)
    kappa = (agree - p_e) / (1 - p_e) if p_e < 1 else float("nan")
    return round(agree, 3), round(tpr, 3), round(tnr, 3), round(kappa, 3)

# 100 traces, 10 real failures. A lazy judge that always says "pass":
human = ["fail"] * 10 + ["pass"] * 90
lazy = ["pass"] * 100
print("always-pass judge:", report(human, lazy))
# A judge that catches 8 of 10 failures but wrongly fails 6 good outputs:
judge = ["fail"] * 8 + ["pass"] * 2 + ["fail"] * 6 + ["pass"] * 84
print("useful judge:     ", report(human, judge))
```

Output:

```text
always-pass judge: (0.9, 0.0, 1.0, 0.0)
useful judge:      (0.92, 0.8, 0.933, 0.623)
```

### Snippet 2 (llm-judge): correcting a judge-reported pass rate, with a bootstrap interval

Status: verified (ran, exit 0).

```python
# Correct a judge-reported pass rate for known judge error (Rogan-Gladen style),
# with a bootstrap interval. Stdlib only, so it runs in Pyodide.
import random

def corrected_pass_rate(p_obs, pass_recall, fail_recall):
    # pass_recall = P(judge says pass | human says pass)
    # fail_recall = P(judge says fail | human says fail)
    denom = pass_recall + fail_recall - 1
    if denom <= 0:
        raise ValueError("judge is no better than chance; correction undefined")
    return min(1.0, max(0.0, (p_obs + fail_recall - 1) / denom))

def rates(human, judge):
    hp = [j for h, j in zip(human, judge) if h == 1]
    hf = [j for h, j in zip(human, judge) if h == 0]
    return sum(hp) / len(hp), sum(1 - j for j in hf) / len(hf)

def bootstrap(human, judge, unlabeled, b=2000, seed=0):
    rng = random.Random(seed)
    lab = list(zip(human, judge))
    out = []
    for _ in range(b):
        s = [rng.choice(lab) for _ in lab]
        u = [rng.choice(unlabeled) for _ in unlabeled]
        h, j = zip(*s)
        if 0 not in h or 1 not in h:
            continue
        pr, fr = rates(h, j)
        try:
            out.append(corrected_pass_rate(sum(u) / len(u), pr, fr))
        except ValueError:
            pass
    out.sort()
    return out[int(0.025 * len(out))], out[int(0.975 * len(out)) - 1]

# Labeled test set: 1 = pass, 0 = fail (human) and the judge's verdicts.
human = [1] * 60 + [0] * 40
judge = [1] * 57 + [0] * 3 + [1] * 16 + [0] * 24  # judge misses 16 of 40 failures
pr, fr = rates(human, judge)
unlabeled = [1] * 785 + [0] * 215                  # judge says 78.5% pass in production
p_obs = sum(unlabeled) / len(unlabeled)
print("pass recall", round(pr, 3), "fail recall", round(fr, 3))
print("raw judge pass rate", p_obs)
print("corrected pass rate", round(corrected_pass_rate(p_obs, pr, fr), 3))
lo, hi = bootstrap(human, judge, unlabeled)
print("95% bootstrap interval", round(lo, 3), round(hi, 3))
```

Output:

```text
pass recall 0.95 fail recall 0.6
raw judge pass rate 0.785
corrected pass rate 0.7
95% bootstrap interval 0.564 0.814
```

### Snippet 3 (agent-evals): pass@k and pass^k from repeated trials

Status: verified (ran, exit 0).

```python
# pass@k (Chen et al. 2021) and pass^k (Yao et al. 2024, tau-bench) from n trials with c successes.
from math import comb

def pass_at_k(n, c, k):
    # probability that at least one of k samples (drawn without replacement from n) succeeds
    if n - c < k:
        return 1.0
    return 1.0 - comb(n - c, k) / comb(n, k)

def pass_hat_k(n, c, k):
    # probability that all k samples succeed
    return comb(c, k) / comb(n, k)

# One task run 8 times, 6 successes.
n, c = 8, 6
for k in (1, 2, 4, 8):
    print(k, round(pass_at_k(n, c, k), 3), round(pass_hat_k(n, c, k), 3))

# Averaged over tasks: three tasks, 8 trials each.
tasks = [(8, 8), (8, 6), (8, 2)]
for k in (1, 4):
    at = sum(pass_at_k(n, c, k) for n, c in tasks) / len(tasks)
    hat = sum(pass_hat_k(n, c, k) for n, c in tasks) / len(tasks)
    print("k=%d pass@k=%.3f pass^k=%.3f" % (k, at, hat))

# Independent-trial shortcut used for intuition: p ** k
print("0.75 ** 3 =", round(0.75 ** 3, 3))
```

Output:

```text
1 0.75 0.75
2 0.964 0.536
4 1.0 0.214
8 1.0 0.0
k=1 pass@k=0.667 pass^k=0.667
k=4 pass@k=0.929 pass^k=0.405
0.75 ** 3 = 0.422
```

### Snippet 4 (llm-judge): swap-order check for position bias (toy judge, no model call)

Status: verified (ran, exit 0).

```python
# Position-bias check: ask the judge twice with the order swapped.
# A win counts only if both orders agree; otherwise it is a tie (MT-Bench's conservative rule).
def judge_stub(first, second):
    # Stand-in for a model call. This toy judge prefers the longer answer,
    # and on near-ties it prefers whichever answer it saw first.
    if abs(len(first) - len(second)) <= 5:
        return "A"
    return "A" if len(first) > len(second) else "B"

def compare(x, y, judge=judge_stub):
    v1 = judge(x, y)                 # x shown first
    v2 = judge(y, x)                 # y shown first
    x_wins_1, x_wins_2 = v1 == "A", v2 == "B"
    if x_wins_1 and x_wins_2:
        return "x"
    if not x_wins_1 and not x_wins_2:
        return "y"
    return "tie (order-dependent)"

pairs = [
    ("Refunds take 5 days.", "Refunds take five business days."),
    ("Refunds take 5 days.", "Refunds take 5 days!"),
]
for x, y in pairs:
    print(repr(x), "vs", repr(y), "->", compare(x, y))
```

Output:

```text
'Refunds take 5 days.' vs 'Refunds take five business days.' -> y
'Refunds take 5 days.' vs 'Refunds take 5 days!' -> tie (order-dependent)
```

### Snippet 5 (golden-sets): recall@k, precision@k, MRR, nDCG and RAGAS-style context precision

Status: verified (ran, exit 0).

```python
# Retrieval metrics on one query, plus RAGAS-style context precision@K.
from math import log2

def recall_at_k(ranked, relevant, k):
    return len(set(ranked[:k]) & relevant) / len(relevant)

def precision_at_k(ranked, relevant, k):
    return len(set(ranked[:k]) & relevant) / k

def reciprocal_rank(ranked, relevant):
    for i, d in enumerate(ranked, 1):
        if d in relevant:
            return 1 / i
    return 0.0

def ndcg_at_k(ranked, relevant, k):
    dcg = sum(1 / log2(i + 1) for i, d in enumerate(ranked[:k], 1) if d in relevant)
    ideal = sum(1 / log2(i + 1) for i in range(1, min(len(relevant), k) + 1))
    return dcg / ideal

def context_precision(ranked, relevant):
    # RAGAS: sum over k of (precision@k * v_k) / number of relevant items in the top K
    K = len(ranked)
    v = [1 if d in relevant else 0 for d in ranked]
    hits = sum(v)
    if hits == 0:
        return 0.0
    return sum(precision_at_k(ranked, relevant, k) * v[k - 1] for k in range(1, K + 1)) / hits

ranked = ["d7", "d2", "d9", "d4", "d1"]
relevant = {"d2", "d4", "d8"}
print("recall@5", round(recall_at_k(ranked, relevant, 5), 3))
print("precision@5", round(precision_at_k(ranked, relevant, 5), 3))
print("MRR (one query)", round(reciprocal_rank(ranked, relevant), 3))
print("nDCG@5", round(ndcg_at_k(ranked, relevant, 5), 3))
print("context precision", round(context_precision(ranked, relevant), 3))
```

Output:

```text
recall@5 0.667
precision@5 0.4
MRR (one query) 0.5
nDCG@5 0.498
context precision 0.5
```

### Snippet 6 (evals-in-ci): paired CI gate with flipped cases, sign test and Wilson intervals

Status: verified (ran, exit 0).

```python
# CI gate on a paired eval: same cases, baseline vs candidate, binary pass/fail per case.
# Look at the cases that flipped, and use an exact sign test (McNemar's exact form) on them.
from math import comb, sqrt

def wilson(passes, n, z=1.96):
    p = passes / n
    centre = (p + z * z / (2 * n)) / (1 + z * z / n)
    half = z * sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / (1 + z * z / n)
    return centre - half, centre + half

def flips(base, cand):
    broke = [i for i, (b, c) in enumerate(zip(base, cand)) if b and not c]
    fixed = [i for i, (b, c) in enumerate(zip(base, cand)) if c and not b]
    return broke, fixed

def one_sided_p(broke, fixed):
    # P(at least `broke` regressions among the flips if flips were a fair coin)
    n = broke + fixed
    return sum(comb(n, i) for i in range(broke, n + 1)) / 2 ** n

def gate(base, cand, must_pass=(), alpha=0.05):
    broke, fixed = flips(base, cand)
    hard = [i for i in must_pass if not cand[i]]
    p = one_sided_p(len(broke), len(fixed)) if broke else 1.0
    ok = not hard and p >= alpha
    return ok, {"broke": broke, "fixed": fixed, "hard_failures": hard, "p": round(p, 4)}

base = [1] * 170 + [0] * 30
cand = base[:]
for i in (3, 10, 25, 40, 51, 77, 90, 120, 150):   # nine cases regress
    cand[i] = 0
for i in (175, 190):                             # two cases improve
    cand[i] = 1
print("baseline", sum(base), "/ 200, 95% CI", [round(x, 3) for x in wilson(sum(base), 200)])
print("candidate", sum(cand), "/ 200, 95% CI", [round(x, 3) for x in wilson(sum(cand), 200)])
print(gate(base, cand, must_pass=(0, 1, 2)))
```

Output:

```text
baseline 170 / 200, 95% CI [0.794, 0.893]
candidate 163 / 200, 95% CI [0.755, 0.863]
(False, {'broke': [3, 10, 25, 40, 51, 77, 90, 120, 150], 'fixed': [175, 190], 'hard_failures': [], 'p': 0.0327})
```

### Snippet 7 (golden-sets): Level 1 assertions for a JSON-extraction prompt

Status: verified (ran, exit 0).

```python
# Level 1 checks for a JSON-extraction prompt: cheap, deterministic, run on every change.
import json, re

REQUIRED = {"invoice_id": str, "total": (int, float), "currency": str, "due_date": str}

def check(output, source_text):
    failures = []
    try:
        data = json.loads(output)
    except json.JSONDecodeError as e:
        return ["not valid JSON: %s" % e.msg]
    for key, typ in REQUIRED.items():
        if key not in data:
            failures.append("missing " + key)
        elif not isinstance(data[key], typ):
            failures.append("wrong type for " + key)
    extra = set(data) - set(REQUIRED)
    if extra:
        failures.append("unexpected keys " + ",".join(sorted(extra)))
    if isinstance(data.get("currency"), str) and not re.fullmatch(r"[A-Z]{3}", data["currency"]):
        failures.append("currency is not a 3-letter code")
    if isinstance(data.get("due_date"), str) and not re.fullmatch(r"\d{4}-\d{2}-\d{2}", data["due_date"]):
        failures.append("due_date is not YYYY-MM-DD")
    if isinstance(data.get("invoice_id"), str) and data["invoice_id"] not in source_text:
        failures.append("invoice_id not found in source (possible fabrication)")
    return failures

src = "Invoice INV-2291. Amount due: 1,240.50 EUR by 2026-11-30."
cases = [
    '{"invoice_id": "INV-2291", "total": 1240.5, "currency": "EUR", "due_date": "2026-11-30"}',
    '{"invoice_id": "INV-2219", "total": "1240.50", "currency": "euro", "due_date": "30/11/2026"}',
    'Here is the JSON: {"invoice_id": "INV-2291"}',
]
for c in cases:
    print(check(c, src) or "pass")
```

Output:

```text
pass
['wrong type for total', 'currency is not a 3-letter code', 'due_date is not YYYY-MM-DD', 'invoice_id not found in source (possible fabrication)']
['not valid JSON: Expecting value']
```

### Snippet 8 (agent-evals): transition failure matrix from agent traces

Status: verified (ran, exit 0).

```python
# Transition failure matrix for agent traces: for each failed trace, record the last
# state that succeeded and the state where the first failure happened, then count pairs.
from collections import Counter

traces = [
    ["ParseRequest:ok", "DecideTool:ok", "GenSQL:ok", "ExecSQL:fail"],
    ["ParseRequest:ok", "DecideTool:ok", "GenSQL:fail"],
    ["ParseRequest:ok", "DecideTool:ok", "GenSQL:ok", "ExecSQL:fail"],
    ["ParseRequest:ok", "DecideTool:fail"],
    ["ParseRequest:ok", "DecideTool:ok", "GenSQL:ok", "ExecSQL:ok", "Answer:ok"],
    ["ParseRequest:ok", "DecideTool:ok", "GenSQL:ok", "ExecSQL:ok", "Answer:fail"],
]

def first_failure(trace):
    last_ok = "START"
    for step in trace:
        state, status = step.split(":")
        if status == "fail":
            return last_ok, state
        last_ok = state
    return None

matrix = Counter(t for t in map(first_failure, traces) if t)
states = ["START", "ParseRequest", "DecideTool", "GenSQL", "ExecSQL", "Answer"]
print("last ok | failed at".ljust(20) + "".join(s[:8].rjust(10) for s in states[1:]))
for row in states[:-1]:
    print(row.ljust(20) + "".join(str(matrix.get((row, col), 0)).rjust(10) for col in states[1:]))
print("most common:", matrix.most_common(1))
```

Output:

```text
last ok | failed at   ParseReq  DecideTo    GenSQL   ExecSQL    Answer
START                        0         0         0         0         0
ParseRequest                 0         1         0         0         0
DecideTool                   0         0         1         0         0
GenSQL                       0         0         0         2         0
ExecSQL                      0         0         0         0         1
most common: [(('GenSQL', 'ExecSQL'), 2)]
```

### Snippet 9 (eval-thinking): saturation check while reading traces

Status: verified (ran, exit 0).

```python
# Saturation check while reading traces: count new failure categories per batch of 10 traces.
# Stop reading when several batches in a row add nothing new (and you have read enough to trust that).
labels = [
    {"wrong_date"}, set(), {"ignored_policy"}, set(), {"wrong_date"}, set(), {"tone"}, set(), set(), {"hallucinated_listing"},
    set(), {"wrong_date"}, set(), {"handoff_late"}, set(), set(), {"tone"}, set(), set(), set(),
    {"ignored_policy"}, set(), set(), set(), {"wrong_date"}, set(), set(), set(), set(), set(),
    set(), set(), {"tone"}, set(), set(), set(), set(), {"wrong_date"}, set(), set(),
]
seen = set()
for start in range(0, len(labels), 10):
    batch = set().union(*labels[start:start + 10])
    new = batch - seen
    seen |= batch
    print("traces %2d-%2d: %d new categories %s" % (start + 1, start + 10, len(new), sorted(new)))
```

Output:

```text
traces  1-10: 4 new categories ['hallucinated_listing', 'ignored_policy', 'tone', 'wrong_date']
traces 11-20: 1 new categories ['handoff_late']
traces 21-30: 0 new categories []
traces 31-40: 0 new categories []
```

### Snippet 10 (eval-thinking): per-call record using OTel GenAI attribute names

Status: verified (ran, exit 0).

```python
# What to record per LLM call, using OpenTelemetry GenAI attribute names (status: Development).
# Plain dicts so it runs anywhere; a real app would set these on an OTel span.
import time, uuid

def record_llm_call(model, prompt_version, input_tokens, output_tokens, cache_read_tokens,
                    started, ended, finish_reason, price_in, price_out, price_cache_read):
    # Prices are inputs (USD per million tokens) taken from the provider's price page on the day you run this.
    uncached = input_tokens - cache_read_tokens
    cost = (uncached * price_in + cache_read_tokens * price_cache_read + output_tokens * price_out) / 1e6
    return {
        "trace_id": uuid.uuid4().hex,
        "name": "chat " + model,
        "gen_ai.operation.name": "chat",
        "gen_ai.provider.name": "example-provider",
        "gen_ai.request.model": model,
        "gen_ai.response.model": model + "-2026-01-01",   # log the resolved version, not only the alias
        "gen_ai.usage.input_tokens": input_tokens,
        "gen_ai.usage.output_tokens": output_tokens,
        "gen_ai.usage.cache_read.input_tokens": cache_read_tokens,
        "gen_ai.response.finish_reasons": [finish_reason],
        "gen_ai.prompt.name": "support-answer",
        "gen_ai.prompt.version": prompt_version,
        "duration_s": round(ended - started, 3),
        "app.cost_usd": round(cost, 6),                   # app-specific, not a GenAI convention
    }

t0 = time.time()
span = record_llm_call("example-model", "support-v14", 12000, 450, 10000, t0, t0 + 2.4, "stop",
                       price_in=3.0, price_out=15.0, price_cache_read=0.3)
for k, v in span.items():
    print(k, "=", v)
```

Output:

```text
trace_id = 7b96b8a61da34618b3c6448d9b010534
name = chat example-model
gen_ai.operation.name = chat
gen_ai.provider.name = example-provider
gen_ai.request.model = example-model
gen_ai.response.model = example-model-2026-01-01
gen_ai.usage.input_tokens = 12000
gen_ai.usage.output_tokens = 450
gen_ai.usage.cache_read.input_tokens = 10000
gen_ai.response.finish_reasons = ['stop']
gen_ai.prompt.name = support-answer
gen_ai.prompt.version = support-v14
duration_s = 2.4
app.cost_usd = 0.01575
```

### Notes for lesson and problem authors

- Snippet 4 uses a stub judge on purpose: its first pair also shows verbosity bias (the longer answer wins in both orders), which a lesson can point out.
- Snippet 6's `wilson(82, 100)` gives about 0.733 to 0.883, the band for question #36.
- Snippet 10 records `gen_ai.usage.input_tokens` as the total including cached tokens, as the OTel docs say, and subtracts the cached part before pricing.

---

## 6. Source list

- https://arxiv.org/abs/2107.03374 (checked 2026-10-28)
- https://arxiv.org/abs/2306.05685 (checked 2026-10-28)
- https://arxiv.org/abs/2307.13854 (checked 2026-10-28)
- https://arxiv.org/abs/2309.15217 (not rechecked (from brief all_sources))
- https://arxiv.org/abs/2311.12983 (checked 2026-10-28)
- https://arxiv.org/abs/2404.04475 (checked 2026-10-28)
- https://arxiv.org/abs/2404.07972 (checked 2026-10-28)
- https://arxiv.org/abs/2404.12272 (checked 2026-10-28)
- https://arxiv.org/abs/2404.13076 (checked 2026-10-28)
- https://arxiv.org/abs/2406.07791 (checked 2026-10-28)
- https://arxiv.org/abs/2411.00640 (checked 2026-10-28)
- https://arxiv.org/abs/2504.12516 (checked 2026-10-28)
- https://arxiv.org/abs/2504.14716 (checked 2026-10-28)
- https://arxiv.org/abs/2509.16941 (checked 2026-10-28)
- https://arxiv.org/abs/2601.11868 (checked 2026-10-28)
- https://arxiv.org/html/2306.05685v4 (checked 2026-10-28)
- https://arxiv.org/html/2311.12983 (checked 2026-10-28)
- https://arxiv.org/html/2406.07791 (checked 2026-10-28)
- https://arxiv.org/html/2406.12045 (checked 2026-10-28)
- https://arxiv.org/html/2504.12516 (checked 2026-10-28)
- https://clickhouse.com/blog/clickhouse-acquires-langfuse-open-source-llm-observability (2026-10-28, snippet only (page returned 403 or was read through search extracts))
- https://decrypt.co/359012/openai-benchmark-measure-ai-coding-supremacy-contaminated (checked 2026-10-28)
- https://developers.openai.com/api/docs/deprecations (checked 2026-10-28)
- https://developers.openai.com/api/docs/guides/graders (checked 2026-10-28)
- https://docs.langchain.com/langsmith/evaluation-concepts (checked 2026-10-28)
- https://docs.langchain.com/langsmith/online-evaluations (checked 2026-10-28)
- https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/ (checked 2026-10-28)
- https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/answer_relevance/ (checked 2026-10-28)
- https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/context_precision/ (checked 2026-10-28)
- https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/context_recall/ (checked 2026-10-28)
- https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/faithfulness/ (checked 2026-10-28)
- https://github.com/Arize-ai/phoenix (checked 2026-10-28)
- https://github.com/ShishirPatil/gorilla/tree/main/berkeley-function-call-leaderboard (checked 2026-10-28)
- https://github.com/UKGovernmentBEIS/inspect_ai (checked 2026-10-28)
- https://github.com/ai-evals-course/judgy (checked 2026-10-28)
- https://github.com/amitshekhariitbhu/ai-engineering-interview-questions (checked 2026-10-28)
- https://github.com/braintrustdata/autoevals (checked 2026-10-28)
- https://github.com/braintrustdata/eval-action (checked 2026-10-28)
- https://github.com/landedjobs/awesome-ai-engineer-interview/blob/main/company/openai.md (checked 2026-10-28)
- https://github.com/landedjobs/awesome-ai-engineer-interview/blob/main/company/perplexity.md (checked 2026-10-28)
- https://github.com/landedjobs/awesome-ai-engineer-interview/blob/main/company/scale.md (checked 2026-10-28)
- https://github.com/landedjobs/awesome-ai-engineer-interview/blob/main/content/04-evals-and-llm-as-judge.md (checked 2026-10-28)
- https://github.com/landedjobs/awesome-ai-engineer-interview/blob/main/questions/evals.md (checked 2026-10-28)
- https://github.com/langchain-ai/agentevals (checked 2026-10-28)
- https://github.com/langchain-ai/langsmith-sdk (checked 2026-10-28)
- https://github.com/langchain-ai/openevals (checked 2026-10-28)
- https://github.com/langfuse/langfuse (checked 2026-10-28)
- https://github.com/ombharatiya/AI-Engineer-Interview-Questions/blob/main/07-evaluation-and-observability/questions.md (checked 2026-10-28)
- https://github.com/open-telemetry/semantic-conventions-genai (checked 2026-10-28)
- https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/README.md (checked 2026-10-28)
- https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/client-inference.md (checked 2026-10-28)
- https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/gen-ai-agent-spans.md (checked 2026-10-28)
- https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/gen-ai-metrics.md (checked 2026-10-28)
- https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/gen-ai-spans.md (checked 2026-10-28)
- https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/gen-ai-token-metrics.md (checked 2026-10-28)
- https://github.com/open-telemetry/semantic-conventions-genai/tree/main/docs/gen-ai (checked 2026-10-28)
- https://github.com/open-telemetry/semantic-conventions/blob/v1.37.0/docs/gen-ai/gen-ai-metrics.md (checked 2026-10-28)
- https://github.com/open-telemetry/semantic-conventions/blob/v1.37.0/docs/gen-ai/gen-ai-spans.md (checked 2026-10-28)
- https://github.com/open-telemetry/semantic-conventions/blob/v1.37.0/docs/registry/attributes/gen-ai.md (checked 2026-10-28)
- https://github.com/open-telemetry/semantic-conventions/releases (checked 2026-10-28)
- https://github.com/openai/human-eval (checked 2026-10-28)
- https://github.com/promptfoo/promptfoo (checked 2026-10-28)
- https://github.com/sierra-research/tau2-bench (checked 2026-10-28)
- https://github.com/vibrantlabsai/ragas (checked 2026-10-28)
- https://github.com/web-arena-x/webarena (checked 2026-10-28)
- https://hamel.dev/blog/posts/evals-faq/ (checked 2026-10-28)
- https://hamel.dev/blog/posts/evals/ (checked 2026-10-28)
- https://hamel.dev/blog/posts/llm-judge/ (checked 2026-10-28)
- https://huggingface.co/datasets/princeton-nlp/SWE-bench_Verified (checked 2026-10-28)
- https://inspect.aisi.org.uk/ (checked 2026-10-28)
- https://langfuse.com/blog/joining-clickhouse (2026-10-28, snippet only (page returned 403 or was read through search extracts))
- https://langfuse.com/docs/evaluation/overview (checked 2026-10-28)
- https://openai.com/index/introducing-swe-bench-verified/ (2026-10-28, snippet only (page returned 403 or was read through search extracts))
- https://openai.com/index/openai-to-acquire-promptfoo/ (2026-10-28, snippet only (page returned 403 or was read through search extracts))
- https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/ (2026-10-28, snippet only (page returned 403 or was read through search extracts))
- https://opentelemetry.io/blog/2026/genai-observability/ (checked 2026-10-28)
- https://opentelemetry.io/docs/specs/semconv/gen-ai/ (checked 2026-10-28)
- https://prachub.com/resources/llm-evaluation-interview-questions-evals-llm-as-judge-drift-and-production-quality (checked 2026-10-28)
- https://siliconangle.com/2026/03/09/openai-acquire-promptfoo-expand-ai-application-testing-capabilities/ (checked 2026-10-28)
- https://www.aced.io/blog/ai-engineer-interview-questions (checked 2026-10-28)
- https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents (checked 2026-10-28)
- https://www.braintrust.dev/docs/start/eval-sdk (checked 2026-10-28)
- https://www.kore1.com/llm-engineer-interview-questions/ (checked 2026-10-28)
- https://www.lesswrong.com/posts/nAMhbz5sfpcynjPP5/swe-bench-pro-is-even-worse (checked 2026-10-28)
- https://www.promptfoo.dev/docs/integrations/ci-cd/ (checked 2026-10-28)
- https://www.swebench.com/SWE-bench/ (checked 2026-10-28)
- https://www.techinterview.org/post/3233475313/interviewing-ai-eval-engineering-roles-2026/ (checked 2026-10-28)
- https://www.techinterview.org/post/3233476824/ai-engineer-interview-rag-agents-evals/ (checked 2026-10-28)

Source count: 88 distinct URLs.
