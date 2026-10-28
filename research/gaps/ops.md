# Gap report: LLMOps, prompt optimisation, fine-tuning in practice, data and product

Research angle: prompt management and optimisation, model rollout with statistics, drift and regressions, feedback loops, dataset curation for SFT and evals, data engineering for LLM apps, fine-tuning end to end, cost and unit economics, build versus buy, model selection and licensing, AI product sense, staff and leadership questions, compliance basics.

All sources below were checked on 2026-10-28 unless a line says otherwise. "Search only" marks a fact seen in search results whose primary page was not fetched; fetch it before any lesson quotes it. Numbers are quoted from the source or computed in this file with the arithmetic shown.

Note on paths: while this report was written, lessons moved from `src/content/lessons/<track>/<slug>.mdx` to `src/content/lessons/<track>/<module>/overview.mdx`, and SPEC.md gained lesson kinds (`lesson | teardown | playbook | paper`), labs (`src/content/labs/`) and the problem types `critique` and `workflow`. Paths below use the new layout.

---

## 1. What exists today and what is missing

### Summary

The site touches most of this angle in one or two paragraphs each, always inside a lesson about something else. Nothing teaches the operating discipline end to end: no prompt registry mechanics, no prompt optimiser beyond one paragraph on DSPy, no A/B test with a sample-size calculation, no production postmortem teardown, no SFT data pipeline, no adapter serving, no unit economics per outcome, no licence clauses, no product-sense round beyond discovery, and no staff-level strategy or governance material. The level problem the owner raised shows here too: rollouts are described as "shadow, then canary, then A/B" without the numbers that make it a senior answer (how many users, for how long, what stops it).

### File by file

| File | What it covers for this angle | What is missing |
|---|---|---|
| `lessons/apis/prompting/overview.mdx` | Section "Prompts as code: versions, tests, rollouts": prompt version string logged next to the model ID, golden set in CI, shadow then canary behind a flag. In-the-room question on rolling out a new model version. | Registry mechanics (immutable versions, labels as pointers, client cache TTL that delays rollback), who may edit prompts, prompt diffs reviewed like code, per-model prompt variants, linking prompt version to traces and eval scores. No optimisation. |
| `lessons/apis/frameworks/overview.mdx` | One paragraph on DSPy (cites arXiv 2310.03714) as "prompt optimisation against a metric". | MIPROv2, GEPA, BootstrapFewShot, APE, OPRO, TextGrad; data needed per optimiser; cost of an optimisation run; overfitting to a small dev set; when an optimiser beats a human. |
| `problems/apis/api-005.mdx`, `api-017.mdx` | Prompts as production code (concept); "Would you use LangChain" mentions DSPy in a follow-up. | No problem where the reader runs or critiques an optimiser. |
| `lessons/evals/evals-in-ci/overview.mdx` | Strongest file for this angle: exact sign test on flipped cases, hard, statistical and report-only gate tiers, tool landscape (Langfuse, promptfoo, OpenAI Evals shutdown), shadow, canary and A/B in three bullets, online judges with sampling, drift of model, traffic and judges, feedback as a filter, eval cost levers. | A/B test design for LLM features: unit of randomisation, sample size and power, guardrail metrics, sample ratio mismatch, peeking, variance reduction (CUPED), clustered errors for multi-turn sessions, novelty effects, how long to run. Real incidents (sycophancy rollback, Anthropic's three-bug postmortem). |
| `problems/evals/evl-004`, `evl-013`, `evl-014`, `evl-015`, `evl-017` | 500 eval cases from 100K conversations; gate design; "is the regression real"; success metrics; guardrail or evaluator. | No estimate problem on A/B sample size, no debug problem on a broken experiment (SRM, leaked assignment, metric diluted by non-exposed users), no critique of a launch plan. |
| `lessons/evals/golden-sets/overview.mdx` | Dataset versioning, drift and staleness; one sentence on deduplicating the eval set against fine-tuning data. | Curation pipeline for eval and SFT data from production logs: sampling, stratifying, dedup (exact, MinHash, semantic), PII scrubbing, consent and retention, labelling QA, train and eval leakage checks. |
| `lessons/inference/operating/overview.mdx` | "Rolling out a model change": quality, tokens and latency checks; shadow versus canary trade-off; per-customer LoRA adapters in a follow-up. | Rollback criteria with numbers, error-budget policy for model changes, provider-side incidents you cannot roll back (the Anthropic postmortem), adapter placement and routing. |
| `problems/system-design/sys-013.mdx` | Rolling out a new model version (concept). | Staff version: dozens of prompts, agent loops and a retirement date (the question setup exists; the answer has no sample-size or timeline math). |
| `lessons/foundations/training/overview.mdx` | Stages (SFT, DPO, GRPO, RLVR), LoRA and QLoRA memory, "LoRA Without Regret" findings, distillation, classic ML refresher. | Fine-tuning as a project: choosing a base (licence, size, chat template), data format (messages, prompt-completion, tool calls), loss masking on assistant turns, packing, hyperparameters and what overfitting looks like, held-out eval against the prompted base, serving the adapter (merge or hot-load, multi-LoRA), and the 2026 hosted-platform situation (OpenAI's self-serve fine-tuning wind-down). "LoRA learns less and forgets less" and "new knowledge raises hallucination" are absent. |
| `problems/foundations/fnd-009`, `fnd-011`, `fnd-013` | Memory estimate; prompt, RAG or fine-tune design; GRPO debug. | No problem on a broken SFT run (template mismatch, loss on user turns, eval leakage), none on adapter serving, none on data volume decisions. |
| `lessons/foundations/model-landscape/overview.mdx` | Three kinds of model, model-card reading, licence names in a table (Apache 2.0, MIT, modified MIT, Llama licence), benchmarks versus your task, bake-off. | Licence clauses that change a decision (Llama 4 700M MAU clause, "Built with Llama" and naming rule, Gemma terms versus Gemma 4 Apache path), OSI Open Source AI Definition, provider deprecation schedules as a selection input, data retention and residency as a selection input. |
| `lessons/inference/gateways-finops/overview.mdx`, `lessons/system-design/capacity/overview.mdx`, `problems/inference/inf-013.mdx` | Price tables, caching break-even, routing, budgets and attribution, self-host napkin math and break-even volume, request bill of materials. | Unit economics per outcome (cost per resolved task, gross margin per seat or per outcome), outcome-based pricing in the market (Intercom Fin), price decline trends and what they mean for build decisions, total cost of ownership beyond GPUs (people, evals, on-call), build versus buy beyond self-hosting. |
| `lessons/rag/ingestion/overview.mdx` | Parsing, chunking, metadata, access control, freshness. | Pipeline engineering: idempotent re-ingest, dedup of near-identical documents, PII detection at ingest, quality gates that fail a batch, lineage from chunk to source version. |
| `lessons/safety/guardrails/overview.mdx`, `problems/safety/sfe-014.mdx` | PII in prompts, logs and traces (Presidio). | Provider data controls (retention days, zero data retention, regional processing), deletion requests that reach eval sets and fine-tuning data. |
| `lessons/safety/hallucination/overview.mdx` | EU AI Act dates as amended by Regulation (EU) 2026/1744, GPAI Code of Practice. Already current. | US state law (Colorado SB 26-189 replacing SB 24-205), NIST AI RMF and its GenAI profile, ISO/IEC 42001, GDPR and the EDPB opinion on AI models, copyright exposure of training data. These belong in a compliance playbook, not a hallucination lesson. |
| `lessons/rounds/customer-craft/overview.mdx`, `problems/rounds/rnd-014`, `rnd-015` | Discovery as requirements engineering, questions to ask, scoping a vague ask, "does this need AI", explaining limits. | Product-sense round proper (design an AI product, grow a metric 10x, prioritise with three engineers), decomposition round (Palantir-style vague prompts), success metrics for probabilistic features, AI product economics, the Meta "product sense with AI" prototype format. |
| `lessons/rounds/behavioural/overview.mdx` | STAR, values rounds, loops as companies describe them. | Staff and leadership questions: AI strategy for a company, platform team charter, governance that does not stop shipping, first 90 days, saying no to a fine-tune, owning one metric for an internal AI platform. |

---

## 2. Material to add

Kinds follow the new SPEC: `lesson`, `teardown`, `playbook`, `paper` (walkthrough), plus `lab` (progressive build in `src/content/labs/`). Proposed placement names an existing track and module, or a new module where none fits. If the owner prefers one new track, these group cleanly as "LLMOps and product" with modules: prompt lifecycle, releases and experiments, monitoring and feedback, data for LLM apps, fine-tuning in practice, economics and selection, product and leadership.

### A. Prompt lifecycle

**A1. Prompt registry and release mechanics** (playbook; apis/prompting)
Brief: A prompt is a deployable artifact with a version, an owner, a test suite and a rollout. Teach the registry model that Langfuse documents: every edit creates an immutable numbered version, code fetches by label (`production` by default, `latest` moves automatically, custom labels for staging, tenants or A/B arms), and rollback is reassigning the label. The trap a senior engineer should name: the SDK caches prompts client-side, so after a label moves some traffic still runs the old version until the cache expires; rollback speed is the cache TTL, not the click. Cover who may move the `production` label, how the prompt version is attached to every trace, and how one prompt change and one model change are never shipped together.
Sources:
- Langfuse, Prompt management data model: https://langfuse.com/docs/prompt-management/data-model (checked 2026-10-28)
- Langfuse, Prompt management overview (client-side caching, "as fast as reading from memory"): https://langfuse.com/docs/prompt-management/overview (checked 2026-10-28)
- MLflow, Optimize prompts (Prompt Registry URIs such as `prompts:/qa/1`): https://mlflow.org/docs/latest/genai/prompt-registry/optimize-prompts/ (checked 2026-10-28)
- Applied LLMs, "Version and pin your models" and the 10% intent-classification drop after a model migration: https://applied-llms.org/ (checked 2026-10-28)

**A2. Automatic prompt optimisation: what the optimisers actually do** (lesson; apis/frameworks or new module apis/prompt-optimisation)
Brief: Engineers hear "DSPy" and stop. Teach the family as search over a program's text parameters against a metric. APE generates candidate instructions and keeps the best scorer. OPRO puts past candidates and scores in the prompt and asks the model for a better one. DSPy's BootstrapFewShot keeps only teacher traces that pass the metric as demonstrations. MIPROv2 proposes instructions and demonstrations per module and searches them with a surrogate model over minibatch scores. GEPA reflects on full trajectories in natural language, keeps a Pareto frontier of candidates that win on at least one example, and mutates from it. TextGrad treats critiques as "gradients" through a computation graph. The engineering points: you need a trustworthy metric first (the optimiser will exploit a bad judge), a dev set sized to the optimiser (DSPy's guidance is about 10 examples for BootstrapFewShot, 50 or more for random search, 200 or more for MIPROv2 to limit overfitting), a held-out set the optimiser never sees, and a review of the produced prompt before it ships. OpenAI's own optimiser documentation says an optimised prompt can do worse on specific inputs.
Sources:
- DSPy optimizers overview (data-size guidance, cost "on the order of $2 USD" for a simple run, reported before and after scores): https://raw.githubusercontent.com/stanfordnlp/dspy/main/docs/docs/learn/optimization/optimizers.md (checked 2026-10-28)
- DSPy GEPA overview (feedback metric returns score and feedback; Pareto frontier): https://raw.githubusercontent.com/stanfordnlp/dspy/main/docs/docs/api/optimizers/GEPA/overview.md (checked 2026-10-28)
- Zhou et al., Large Language Models Are Human-Level Prompt Engineers (APE): https://arxiv.org/abs/2211.01910 (checked 2026-10-28)
- Yang et al., Large Language Models as Optimizers (OPRO): https://arxiv.org/abs/2309.03409 (checked 2026-10-28)
- Opsahl-Ong et al., Optimizing Instructions and Demonstrations for Multi-Stage Language Model Programs (MIPRO): https://arxiv.org/abs/2406.11695 (checked 2026-10-28)
- Agrawal et al., GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning: https://arxiv.org/abs/2507.19457 (checked 2026-10-28)
- Yuksekgonul et al., TextGrad: https://arxiv.org/abs/2406.07496 (checked 2026-10-28)
- OpenAI, Prompt optimizer guide (needs three or more rows with grader results or annotations; cautions; dataset-backed optimiser deprecated with the Evals platform): https://developers.openai.com/api/docs/guides/prompt-optimizer (checked 2026-10-28)

**A3. Paper walkthrough: GEPA** (paper; same module)
Brief: Why reflective text feedback can beat a scalar reward with far fewer rollouts, what the Pareto frontier is for, and what the comparison with GRPO does and does not show (six tasks, the authors' own results). Pair it with the DSPy usage: the metric must return feedback text, not only a score.
Sources: https://arxiv.org/abs/2507.19457 ; https://raw.githubusercontent.com/stanfordnlp/dspy/main/docs/docs/api/optimizers/GEPA/overview.md (both checked 2026-10-28)

**A4. Lab: build a mini prompt optimiser** (lab)
Brief: In Pyodide with a deterministic mock LLM: step 1, a metric with feedback text; step 2, bootstrap few-shot (keep passing traces); step 3, an instruction proposer with random search on a dev set; step 4, a held-out check that catches the optimiser overfitting the dev set; step 5, register the winner as a new prompt version with its scores. Tests check each step. No real API key.
Sources: the DSPy and GEPA sources above; Langfuse data model for step 5.

### B. Releasing model and prompt changes

**B1. The release ladder with numbers** (playbook; evals/evals-in-ci or inference/operating)
Brief: Offline gate, shadow, canary, A/B, full rollout, each with an entry condition, what it measures, what it cannot measure, cost, and an exit rule. Shadow doubles token spend for the shadowed share and cannot see user reactions. Canary measures reactions on a small share with rollback by routing. A/B is the only rung that measures outcome metrics causally, and it needs a sample size. Include provider-side retirement dates as hard deadlines (Anthropic gives at least 60 days' notice for publicly released models; OpenAI's deprecations page lists removal dates) and pinning dated model IDs.
Sources:
- Anthropic, Model deprecations (at least 60 days' notice; status table): https://platform.claude.com/docs/en/about-claude/model-deprecations (checked 2026-10-28)
- OpenAI, Deprecations: https://developers.openai.com/api/docs/deprecations (checked 2026-10-28)
- Applied LLMs, "Version and pin your models", shadow pipeline: https://applied-llms.org/ (checked 2026-10-28)

**B2. A/B testing LLM features: statistics that survive review** (lesson; evals/evals-in-ci, new lesson)
Brief: The current lesson stops at "A/B test after significant changes". Teach: randomise by user or account, not by request, or the same user sees both arms inside one conversation; compute sample size before launch (worked example below); pick one primary outcome metric and a few guardrail metrics (cost per task, latency, escalation, policy violations); check sample ratio mismatch before reading any result; do not peek and stop early without a sequential method; use paired and clustered errors when the unit is a conversation with many turns; use pre-period covariates (CUPED) to cut variance on returning users. Tie this to the eval statistics Anthropic published (clustered standard errors can be over three times naive ones; paired differences exploit question-score correlation of about 0.3 to 0.7 between frontier models).
Worked number, computed here: to detect a lift from 70% to 72% task resolution at two-sided alpha 0.05 and power 0.8, n per arm = (1.96 + 0.84)^2 x (0.70 x 0.30 + 0.72 x 0.28) / 0.02^2, about 8,080 users per arm; for 70% to 75%, about 1,250 per arm; for 90% to 91%, about 13,490 per arm.
Sources:
- Anthropic, A statistical approach to model evaluations (19 November 2024): https://www.anthropic.com/research/statistical-approach-to-model-evals (checked 2026-10-28)
- Miller, Adding Error Bars to Evals: https://arxiv.org/abs/2411.00640 (cited in the existing lesson; re-fetch before quoting)
- Deng, Xu, Kohavi, Walker, CUPED (WSDM 2013), project page: https://exp-platform.com/cuped/ (search only; about 50% variance reduction on Bing)
- Statsig docs, variance reduction: https://docs.statsig.com/stats-engine/variance_reduction (search only)

**B3. Teardown: the GPT-4o sycophancy rollback (April to May 2025)** (teardown; evals/evals-in-ci)
Brief: A model update added a reward signal from thumbs-up and thumbs-down data, offline evaluations "generally looked good", A/B tests suggested the small number of users who tried it liked it, and some expert testers said it "felt" slightly off. It shipped and was rolled back. The lesson for operators: A/B tests on short-horizon satisfaction reward agreeable answers; qualitative launch blockers need a formal place in the gate; behaviour evals for known failure classes must exist before the change. OpenAI committed to treat model behaviour issues as launch-blocking. Public only: no internal metric values; say so.
Sources:
- OpenAI, Expanding on what we missed with sycophancy: https://openai.com/index/expanding-on-sycophancy/ (returned HTTP 403 to the fetcher on 2026-10-28; quotes taken via the next source)
- Simon Willison, quoting the OpenAI post (2 May 2025): https://simonwillison.net/2025/May/2/what-we-missed-with-sycophancy/ (checked 2026-10-28)

**B4. Teardown: Anthropic's postmortem of three infrastructure bugs (August to September 2025)** (teardown; inference/operating)
Brief: Three unrelated bugs degraded Claude responses: a context-window routing error (0.8% of Sonnet 4 requests at first, 16% at the worst hour on 31 August), a TPU misconfiguration that corrupted output, and an approximate top-k miscompilation in XLA. Why evaluations missed them (Claude often recovers from isolated mistakes, privacy limits on reading user traffic, different symptoms per platform, noisy evals) and the fixes (more sensitive evals, quality evals run continuously on production, detection tests for unexpected characters in deployment, exact top-k). The operator's lesson: quality regressions can come from serving infrastructure with no model or prompt change, so production canaries need quality probes, not only error rates.
Sources: Anthropic, A postmortem of three recent issues (17 September 2025): https://www.anthropic.com/engineering/a-postmortem-of-three-recent-issues (checked 2026-10-28)

**B5. Lab: release gate and experiment calculator** (lab)
Brief: Step 1, the paired flip gate (exists as a widget; reuse); step 2, a sample-size and duration calculator from baseline rate, minimum detectable effect and daily traffic; step 3, an SRM check (chi-square on assignment counts); step 4, a clustered standard error for multi-turn sessions; step 5, a written ship or no-ship decision with guardrail metrics. Stdlib Python only.
Sources: B2 sources.

### C. Monitoring, drift and feedback loops

**C1. Drift you can and cannot see** (lesson; evals/evals-in-ci, second lesson)
Brief: Four sources of change: the provider's model behind an alias (Chen, Zaharia and Zou measured GPT-4 prime-number accuracy at 84% in March 2023 and 51% in June 2023 on the same questions), your own prompt and retrieval changes, traffic mix, and serving infrastructure (B4). What to monitor before labels arrive: resolved model ID, output length, refusal rate, tool calls per task, assertion failure rate, judge pass rate per failure mode on sampled traces, user edits and abandonments. How to separate traffic drift from model drift: replay a frozen input set on a schedule.
Sources:
- Chen, Zaharia, Zou, How is ChatGPT's behavior changing over time?: https://arxiv.org/abs/2307.09009 (checked 2026-10-28)
- PracHub, LLM evaluation interview questions (drift, monitoring before ground truth, evaluator drift), 13 August 2026: https://prachub.com/resources/llm-evaluation-interview-questions-evals-llm-as-judge-drift-and-production-quality (checked 2026-10-28)
- Anthropic postmortem (B4)

**C2. Feedback loops that do not train sycophancy** (playbook; evals module)
Brief: Explicit feedback (thumbs, regenerate) and implicit feedback (accept, edit, copy, abandon, escalate). Use feedback as a filter for which traces to read, not as a metric or a reward without controls; B3 is the counter-example. For coding assistants, the accept rate predicted perceived productivity in GitHub's study, but a 2025 randomised trial found experienced developers 19% slower with AI while believing they were 20% faster, so self-report and engagement metrics need an outcome check. Close the loop: confirmed failure, new eval case, fix, gate.
Sources:
- Eugene Yan, Patterns for building LLM-based systems and products, section "Collect user feedback": https://eugeneyan.com/writing/llm-patterns/ (checked 2026-10-28; post date not shown in the fetched text)
- Ziegler et al., Productivity Assessment of Neural Code Completion: https://arxiv.org/abs/2205.06537 (checked 2026-10-28)
- Becker, Rush, Barnes, Rein (METR), Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity: https://arxiv.org/abs/2507.09089 (checked 2026-10-28)
- Peng et al., The Impact of AI on Developer Productivity: Evidence from GitHub Copilot: https://arxiv.org/abs/2302.06590 (checked 2026-10-28)
- Hamel Husain, A field guide to rapidly improving AI products (24 March 2025): https://hamel.dev/blog/posts/field-guide/ (checked 2026-10-28)

**C3. Teardown: LinkedIn's generative AI assistant** (teardown; rounds/customer-craft or system-design)
Brief: A public, specific account of the 80/95 problem: about 80% of the target experience in the first month, about four more months to pass 95%; a linguist team that could evaluate up to 500 conversations a day; roughly 10% of responses with malformed parameters, cut to about 0.01% with a defensive parser; chain-of-thought improving quality while raising perceived latency. Good material for "estimate the timeline" and "what would you measure" questions.
Sources: LinkedIn Engineering, Musings on building a generative AI product (25 April 2024): https://www.linkedin.com/blog/engineering/generative-ai/musings-on-building-a-generative-ai-product (checked 2026-10-28)

### D. Data for LLM apps

**D1. Curating eval and SFT data from production** (lesson; evals/golden-sets second lesson, or new module)
Brief: The pipeline: sample by stratum (intent, segment, outcome), not uniformly; dedup exact then near-duplicate (MinHash) then semantic; scrub PII before data leaves the logging boundary; check consent and retention terms; label with a rubric and measure agreement; split by time or by user so train and eval do not share near-duplicates; version the set. Evidence for quality over quantity: LIMA (1,000 curated examples), AlpaGasus (9k filtered from 52k Alpaca examples trained 5.7x faster and did better), Lee et al. (dedup cuts memorised emission tenfold; over 4% of standard validation sets overlapped training). Warn about synthetic data loops: collapse shows when synthetic data replaces real data; accumulating real plus synthetic avoided it in Gerstgrasser et al.
Sources:
- Zhou et al., LIMA: https://arxiv.org/abs/2305.11206 (checked 2026-10-28)
- Chen et al., AlpaGasus: https://arxiv.org/abs/2307.08701 (checked 2026-10-28)
- Lee et al., Deduplicating Training Data Makes Language Models Better: https://arxiv.org/abs/2107.06499 (checked 2026-10-28)
- Gerstgrasser et al., Is Model Collapse Inevitable?: https://arxiv.org/abs/2404.01413 (checked 2026-10-28)
- Penedo et al., The FineWeb Datasets: https://arxiv.org/abs/2406.17557 (checked 2026-10-28)

**D2. Data engineering for LLM apps: pipelines with quality gates** (lesson; rag/ingestion second lesson)
Brief: Treat ingestion and dataset builds as batch pipelines with contracts: idempotent re-runs keyed on content hash, lineage from every chunk or example to its source version, stage-level quality gates that fail the batch (empty-text rate, language mix, duplicate rate, PII hit rate, chunk-length distribution), and quarantine instead of silent drops. NeMo Curator's stage list (language detection, rule-based filtering, exact, fuzzy and semantic dedup, model-based quality filtering) is a useful reference architecture; Presidio for PII (already cited in the guardrails lesson).
Sources:
- NVIDIA NeMo Curator, About: https://docs.nvidia.com/nemo/curator/latest/about/index.html (checked 2026-10-28)
- Lee et al. dedup (above)

**D3. Lab: dedup, PII and gate pipeline** (lab)
Brief: Stdlib Python on a toy corpus: step 1, exact dedup by normalised hash; step 2, MinHash with shingles and LSH bands; step 3, regex and checksum PII detectors (emails, card numbers with Luhn) with redaction; step 4, gate thresholds that fail the batch; step 5, a train and eval split by user with a leakage check.
Sources: D1 and D2.

### E. Fine-tuning in practice

**E1. Should we fine-tune? A decision playbook** (playbook; foundations/training)
Brief: Inputs that decide it: is the gap format, style, a narrow skill, latency and cost, or missing knowledge? Knowledge injection loses to retrieval (Ovadia et al.), and fine-tuning on facts the model does not know raises hallucination as those examples are learned (Gekhman et al.). Prompting and RAG dominate enterprise customisation, with fine-tuning described as niche in Menlo's 2025 survey. Fine-tuning wins for narrow, high-volume tasks where a small tuned model replaces a large prompted one (LoRA Land: 310 adapters across 31 tasks averaged 10 points above GPT-4 on those tasks). Add the 2026 platform reality: OpenAI's self-serve fine-tuning closed to new organisations on 7 May 2026 and ends new jobs for existing customers on 6 January 2027, so "we will fine-tune on OpenAI" is no longer a default plan.
Sources:
- Ovadia et al., Fine-Tuning or Retrieval?: https://arxiv.org/abs/2312.05934 (checked 2026-10-28)
- Gekhman et al., Does Fine-Tuning LLMs on New Knowledge Encourage Hallucinations?: https://arxiv.org/abs/2405.05904 (checked 2026-10-28)
- Zhao et al., LoRA Land: https://arxiv.org/abs/2405.00732 (checked 2026-10-28)
- Menlo Ventures, 2025: The State of Generative AI in the Enterprise (9 December 2025): https://menlovc.com/perspective/2025-the-state-of-generative-ai-in-the-enterprise/ (checked 2026-10-28)
- OpenAI, Deprecations, "Update to OpenAI's self-serve fine-tuning": https://developers.openai.com/api/docs/deprecations (checked 2026-10-28)
- OpenAI, Model optimization guide ("winding down the fine-tuning platform"): https://developers.openai.com/api/docs/guides/model-optimization (checked 2026-10-28)
- Applied LLMs, "Don't finetune until you've proven it's necessary": https://applied-llms.org/ (checked 2026-10-28)

**E2. A fine-tuning run end to end** (lesson; foundations/training second lesson)
Brief: Base choice (licence, size, existing chat template, tokenizer); data format (conversational messages, prompt-completion, tool-call examples with a `tools` column); loss on assistant tokens only (TRL `assistant_only_loss`, which needs generation markers in the chat template; prompt-completion datasets mask the prompt by default); EOS alignment with the template (TRL's Qwen warning); packing; hyperparameters with sources (TRL default learning rate 2e-5 for full SFT, about 1e-4 suggested for adapters; Unsloth's LoRA guide: 2e-4, 1 to 3 epochs, rank 16 or 32, alpha equal to rank or twice it, all linear projections as targets, training loss below 0.2 as an overfitting sign); evaluation against the prompted base on a held-out set (OpenAI's guide: start with 50 good examples and evaluate; if 50 do nothing, rethink); what LoRA trades away (Biderman et al.: underperforms full fine-tuning on code and maths in standard low-rank settings, forgets less).
Sources:
- Hugging Face TRL, SFT Trainer (v1.16.0 docs): https://huggingface.co/docs/trl/sft_trainer (checked 2026-10-28)
- Unsloth, LoRA hyperparameters guide: https://unsloth.ai/docs/get-started/fine-tuning-llms-guide/lora-hyperparameters-guide (checked 2026-10-28)
- OpenAI, Supervised fine-tuning guide: https://developers.openai.com/api/docs/guides/supervised-fine-tuning (checked 2026-10-28)
- Biderman et al., LoRA Learns Less and Forgets Less: https://arxiv.org/abs/2405.09673 (checked 2026-10-28)
- Thinking Machines, LoRA Without Regret: https://thinkingmachines.ai/blog/lora/ (already cited in the training lesson)

**E3. Serving the adapter** (lesson; inference/faster-cheaper or inference/operating)
Brief: Merge the adapter into the base (no runtime cost, one model per tenant) or keep it separate and hot-load many adapters on one base (vLLM `--enable-lora`, `--max-lora-rank` sized to the largest adapter, the adapter selected through the `model` field; runtime load and unload endpoints that vLLM says not to expose outside a trusted environment). S-LoRA and LoRAX show the multi-tenant case (thousands of adapters; 25 Mistral-7B adapters on one 80 GB A100). Routing becomes sticky to replicas holding the adapter; hosted providers may require dedicated deployments for tuned models (Fireworks).
Sources:
- vLLM, LoRA adapters: https://docs.vllm.ai/en/latest/features/lora.html (checked 2026-10-28)
- Sheng et al., S-LoRA: https://arxiv.org/abs/2311.03285 (checked 2026-10-28)
- Zhao et al., LoRA Land (LoRAX deployment): https://arxiv.org/abs/2405.00732 (checked 2026-10-28)
- Fireworks, Fine-tuning models (tuned models served on dedicated deployments): https://docs.fireworks.ai/fine-tuning/fine-tuning-models (checked 2026-10-28)
- Thinking Machines, Tinker (training API primitives, LoRA, usage pricing): https://thinkingmachines.ai/tinker/ (checked 2026-10-28)

**E4. Paper walkthroughs: "LoRA learns less and forgets less" and "new knowledge encourages hallucinations"** (paper, two items)
Brief: Two papers that correct the most common fine-tuning pitches in interviews. The first explains why adapters are a safe default for style and narrow skills but not for large capability jumps in code or maths; the second explains why "fine-tune it on our docs" is the wrong tool for facts.
Sources: https://arxiv.org/abs/2405.09673 ; https://arxiv.org/abs/2405.05904 (both checked 2026-10-28)

**E5. Problems for E1 to E3** (problems)
Brief: a `debug` problem where the chat template at serving differs from training; a `critique` of a fine-tuning plan that trains on user turns, has eval examples paraphrased from training data and no prompted-base baseline; an `estimate` of adapter count per GPU; a `design` for a per-tenant adapter platform.

### F. Economics, build versus buy, model selection and licensing

**F1. Unit economics of an AI feature** (lesson; inference/gateways-finops second lesson or system-design/capacity)
Brief: Cost per call is the wrong unit. Model cost per successful outcome: (tokens per attempt x price + tool and retrieval cost) x attempts per success / success rate, plus human escalation cost for failures. Compare to the price the market sets per outcome (Intercom Fin charges $0.99 per outcome and defines what counts). Show how prompt caching, batch discounts (50% on Anthropic's Batch API) and model tiering move the number, using dated list prices. Add the trend: Epoch AI measured price to reach a fixed capability falling 9x to 900x per year depending on the threshold, about 40x per year for GPT-4-level GPQA performance, which means a build decision justified by today's API price can flip within a year.
Worked number, computed here from Anthropic's list prices: a Claude Sonnet 5.5 call with 3,000 input and 500 output tokens costs 3,000 x $2 / 1M + 500 x $10 / 1M = $0.006 + $0.005 = $0.011 before caching.
Sources:
- Anthropic, Pricing: https://platform.claude.com/docs/en/about-claude/pricing (checked 2026-10-28)
- Intercom, Pricing (Fin $0.99 per outcome): https://www.intercom.com/pricing (checked 2026-10-28)
- Epoch AI, LLM inference price trends (12 March 2025): https://epoch.ai/data-insights/llm-inference-price-trends (checked 2026-10-28)
- Applied LLMs, "Low-cost cognition" section: https://applied-llms.org/ (checked 2026-10-28)

**F2. Build versus buy playbook** (playbook; system-design/framework or new module)
Brief: Three separate decisions often blurred: buy an AI product or build the feature; call an API or self-host weights; train or adapt. Inputs: differentiation, data sensitivity and residency, volume and its growth, team skills, time to value, vendor lock-in and deprecation risk. Market context: Menlo's survey found 76% of enterprise AI solutions bought in 2025, up from 53% in 2024. Applied LLMs: "Don't build LLM features you can buy"; training from scratch almost never pays (BloombergGPT example). Self-host math exists in `inf-013`; link to it and add people cost and on-call.
Sources:
- Menlo Ventures 2025 report (above)
- Applied LLMs: https://applied-llms.org/ (checked 2026-10-28)
- Chip Huyen, Building A Generative AI Platform (25 July 2024): https://huyenchip.com/2024/07/25/genai-platform.html (checked 2026-10-28)
- Lambda, GPU cloud pricing (H100 SXM from $3.99 to $4.29 per GPU-hour on demand): https://lambda.ai/pricing (checked 2026-10-28)

**F3. Model selection and licence checklist** (playbook; foundations/model-landscape)
Brief: Selection is evals plus constraints. Constraints a senior engineer checks: licence clauses (Llama 4 Community License: a separate licence is needed above 700 million monthly active users, "Built with Llama" must be displayed, derived model names must start with "Llama"; Gemma terms reserve Google's right to restrict use and point Gemma 4 to a separate licence page; Apache 2.0 and MIT models have no such clauses), "open weights" versus the OSI Open Source AI Definition 1.0 (data information, code and parameters with use, study, modify, share freedoms), provider retirement schedules, data retention and residency, and the price trend.
Sources:
- Meta, Llama 4 Community License (effective 5 April 2025): https://dev.meta.ai/llama/llama4/license/ (checked 2026-10-28)
- Google, Gemma Terms of Use (last modified 1 April 2026): https://ai.google.dev/gemma/terms (checked 2026-10-28)
- Open Source Initiative, Open Source AI Definition 1.0: https://opensource.org/ai/open-source-ai-definition (checked 2026-10-28)
- Anthropic model deprecations; OpenAI deprecations (above)
- OpenAI, Data controls in the platform (abuse-monitoring logs up to 30 days by default, ZDR by approval, regional processing limited to some regions): https://developers.openai.com/api/docs/guides/your-data (checked 2026-10-28)

### G. Product sense and staff leadership

**G1. The AI product-sense round** (lesson; rounds/customer-craft second lesson)
Brief: Distinct from discovery. Formats reported in 2025 to 2026: design an AI product for a capability ("You have text-to-music capability. How would you productise it?", OpenAI), grow a metric with constraints ("double ChatGPT image creation with just three engineers", OpenAI), "When should you not use an LLM?" (LinkedIn), and Meta's reported "Product Sense with AI" round where the candidate prototypes with an AI tool. Teach a structure that differs from CIRCLES because outputs are probabilistic: user and job, does it need a model, the failure the user cannot detect, the success metric and its guardrails, the cost per outcome, the eval plan before launch, and how the feature changes as models improve. Provenance is secondhand for every company attribution; say so on the page.
Sources:
- Garage Labs, PM, AI PM and AI design interview questions (updated September 2026): https://www.garagelabstech.com/blog/pm-interview-questions (checked 2026-10-28)
- Aakash Gupta, The AI Product Sense Interview Guide (29 April 2026): https://www.news.aakashg.com/p/ai-product-sense-guide (checked 2026-10-28)
- Applied LLMs, product lessons ("Calibrate your risk tolerance based on the use case", human-in-the-loop UX): https://applied-llms.org/ (checked 2026-10-28)

**G2. Decomposition and customer rounds** (lesson; rounds/customer-craft)
Brief: Vague operational prompts ("A customer says their dashboard is wrong. They can't tell you which number. What do you do?") reported for Palantir-style FDE loops, and Anthropic's reported customer-conversation simulation (a fictional VP of Engineering at a fintech evaluating Claude for an internal copilot). Practise splitting the problem, picking what to build first, and the measurable pilot.
Sources:
- techinterview.org, What the forward deployed engineer interview really tests (updated 5 August 2026): https://www.techinterview.org/post/3233477236/forward-deployed-engineer-interview/ (checked 2026-10-28)
- Perspective AI, Anthropic Applied AI engineer interview process (29 May 2026; commercial blog, unsourced figures): https://getperspective.ai/blog/anthropic-applied-ai-engineer-interview-process-frontier-lab-2026/markdown (checked 2026-10-28)

**G3. Staff playbook: AI strategy, platform and governance** (playbook; rounds/behavioural or new module rounds/staff)
Brief: The questions staff candidates get are about org shape and risk, not prompts: a model strategy across several features in a regulated firm; a shared inference platform and a shared eval platform for many teams; an AI governance process "that satisfies auditors without stopping teams from shipping"; the one metric for an internal AI platform; the first 90 days. Teach a one-page strategy shape: portfolio of use cases ranked by value and risk, platform primitives (gateway, prompt registry, eval service, tracing, data controls), decision rights (who moves the production label, who approves a new model), risk tiers mapped to NIST AI RMF functions (Govern, Map, Measure, Manage), and the metrics leadership will ask for.
Sources:
- AI Engineering Insider, The 100 Questions That Haunt AI Engineering Interviews 2026 (26 October 2026): https://aiengineeringinsider.substack.com/p/the-100-questions-that-haunt-ai-engineering (checked 2026-10-28)
- NIST, AI Risk Management Framework (AI RMF 1.0 released 26 January 2023; GenAI profile NIST AI 600-1 on 26 July 2024; revision under way): https://www.nist.gov/itl/ai-risk-management-framework (checked 2026-10-28)
- Chip Huyen, Building A Generative AI Platform: https://huyenchip.com/2024/07/25/genai-platform.html (checked 2026-10-28)

### H. Compliance basics

**H1. Compliance for engineers shipping an AI feature** (playbook; safety, new lesson in safety/guardrails or a compliance module)
Brief: What an engineer must know and when to call counsel. EU AI Act: GPAI obligations since 2 August 2025, Annex III high-risk from 2 December 2027 and Annex I from 2 August 2028 after the Digital Omnibus (the hallucination lesson already has this; link, do not duplicate). GDPR: the EDPB's Opinion 28/2024 (18 December 2024) on personal data in AI models; deletion requests must reach logs, eval sets and fine-tuning data. US: Colorado replaced SB 24-205 with SB 26-189, signed 14 May 2026, effective 1 January 2027, focused on disclosure for automated decisions (search only; verify bill text). Provider data controls: retention, zero data retention, regional processing. Copyright exposure of training data: the Bartz v. Anthropic settlement of about $1.5 billion (search only; verify the court record). ISO/IEC 42001 as the certifiable AI management system standard (iso.org returned 403; verify).
Sources:
- EU AI Act implementation timeline (updated 31 August 2026): https://artificialintelligenceact.eu/implementation-timeline/ (checked 2026-10-28)
- European Commission, GPAI Code of Practice (published 10 July 2025): https://digital-strategy.ec.europa.eu/en/policies/contents-code-gpai (checked 2026-10-28)
- EDPB, Opinion 28/2024: https://www.edpb.europa.eu/our-work-tools/our-documents/opinion-board-art-64/opinion-282024-certain-data-protection-aspects_en (checked 2026-10-28; substantive content is in the PDF, not yet read)
- OpenAI data controls (above)
- Holland and Knight, Colorado Governor Signs SB 189: https://www.hklaw.com/en/insights/publications/2026/05/colorado-governor-signs-sb-189 (search only)
- JURIST, Judge approves record $1.5 billion AI copyright settlement involving Anthropic: https://www.jurist.org/news/2026/07/judge-approves-record-1-5-billion-settlement-involving-anthropic/ (search only)

---

## 3. Interview questions collected

Provenance labels: "company source" means the company itself; "candidate report" means an aggregator that says the question came from a candidate; "prep vendor" means a question bank or guide that gives no per-question source; "forum, unverified" means anonymous forum posts. Company is given only when the source names it. Levels are my assignment from the question's scope: senior for a bounded technical decision, staff for org, platform, strategy or multi-team scope.

| # | Question (verbatim where quoted) | Type | Level | Company | Source | Provenance |
|---|---|---|---|---|---|---|
| 1 | "Develop a strategy for OpenAI's fine-tuning capabilities using publicly available docs." | design (strategy) | staff | OpenAI | https://www.aced.io/blog/ai-engineer-interview-questions | prep vendor with company tag |
| 2 | "How do you evaluate a generative model after fine-tuning?" | concept | senior | OpenAI | https://github.com/landedjobs/awesome-ai-engineer-interview/blob/main/company/openai.md | candidate report |
| 3 | "Design an RLHF pipeline for a 70B model" | design | staff | OpenAI | same as 2 | candidate report |
| 4 | "Debug a sudden 5pp regression in your eval?" | debug | senior | OpenAI | same as 2 | candidate report |
| 5 | "What would you build at OpenAI in the first 90 days?" | product sense | staff | OpenAI | same as 2 | candidate report |
| 6 | "How would you define success metrics for an AI-oriented feature or product?" | design | senior | Perplexity | https://www.aced.io/blog/ai-engineer-interview-questions | prep vendor with company tag |
| 7 | "Build an ML evaluation pipeline" (take-home) | design | senior | Scale AI | https://github.com/landedjobs/awesome-ai-engineer-interview/blob/main/company/scale.md | candidate report |
| 8 | "Handed a messy dataset, build a working analysis" (FDE presentation) | workflow / customer | senior | Scale AI | same as 7 | candidate report |
| 9 | "Extract and clean a usable dataset from a company demo database using only SQL and Python." | code (data) | senior | Anthropic (ML engineer) | https://www.aced.io/blog/ai-engineer-interview-questions | prep vendor with company tag |
| 10 | "You have text-to-music capability. How would you productise it?" | product sense | senior | OpenAI | https://www.garagelabstech.com/blog/pm-interview-questions | aggregator citing Exponent reports, Dec 2025 to Mar 2026 |
| 11 | "You own an internal AI platform that other teams build agents on. What's your strategy, and if you could own only one metric, what would it be?" | product sense / strategy | staff | none named | same as 10 | aggregator citing Exponent's AI bank |
| 12 | "When should you not use an LLM?" | product sense | senior | LinkedIn | same as 10 | aggregator summary table |
| 13 | "How would you design safeguards for an AI system that takes actions on a user's behalf? How would you define its permission and control model?" | design | senior | tagged OpenAI, Amazon, Meta, Google, Netflix, Stripe | same as 10 | aggregator tags |
| 14 | "How do AI evals work? What metrics do you use to judge LLM output quality?" | concept | senior | tagged Intuit, Amazon, Visa, Snap, LinkedIn, Google | same as 10 | aggregator tags |
| 15 | "How would you increase Claude Code weekly active users 10x?" | product sense | staff | Anthropic (the article calls it a mock question) | https://www.news.aakashg.com/p/ai-product-sense-guide | prep vendor |
| 16 | "how would you double ChatGPT image creation with just three engineers?" | product sense | staff | OpenAI | same as 15 | prep vendor |
| 17 | "Design a real-time model A/B testing platform." | design | senior | OpenAI (SWE) | https://tianpan.co/forum/t/collecting-openai-interview-questions-2025-edition-share-your-experience/38 | forum, unverified |
| 18 | "Walk through how you'd launch a new AI capability to 100M users safely." | design / behavioural | staff | OpenAI (PM) | same as 17 | forum, unverified |
| 19 | "How would you structure pricing for a new AI capability that has uncertain demand?" | product sense (economics) | staff | OpenAI (finance) | same as 17 | forum, unverified |
| 20 | "Model the GPU compute costs for serving ChatGPT at current scale, including peak load scenarios." | estimate | staff | OpenAI (finance) | same as 17 | forum, unverified |
| 21 | "You have 100K user interactions. How do you build a 500-item eval set from them?" | design (data curation) | senior | none named | https://www.techinterview.org/post/3233475313/interviewing-ai-eval-engineering-roles-2026/ | prep vendor (already on site as evl-004) |
| 22 | "You need to evaluate a new model release this week. How do you decide if it is better?" | design | senior | none named | same as 21 | prep vendor |
| 23 | "Offline quality improved, but production quality fell. How do you debug it?" | debug | senior | none named | https://prachub.com/resources/llm-evaluation-interview-questions-evals-llm-as-judge-drift-and-production-quality | prep vendor |
| 24 | "What do you monitor before ground-truth labels arrive?" | concept | senior | none named | same as 23 | prep vendor |
| 25 | "How do you detect evaluator drift?" | concept | senior | none named | same as 23 | prep vendor |
| 26 | "How would you define a release gate?" | design | senior | none named | same as 23 | prep vendor |
| 27 | "A one-line prompt tweak shipped on Friday and support escalations are up on Monday." Design the prompt-versioning and regression-testing system that would have caught it. | critique / design | senior | none named | https://aiengineeringinsider.substack.com/p/the-100-questions-that-haunt-ai-engineering (Q5) | prep vendor |
| 28 | "Your assistant has a 6,000-token system prompt plus few-shot examples, serving 2 million requests a day." (cost) | estimate | senior | none named | same as 27 (Q13) | prep vendor |
| 29 | "You have a new reranker that improves nDCG@10 offline by a modest margin." "Design the online experiment to decide whether to ship it." | design (A/B) | senior | none named | same as 27 (Q43) | prep vendor |
| 30 | A product manager says, "Let's fine-tune a model on our company data so it knows our products." | concept / customer | senior | none named | same as 27 (Q66) | prep vendor |
| 31 | "You have one 80 GB GPU, a 7B to 13B open-weight model, and a month to adapt it to your domain." | design (fine-tuning plan) | senior | none named | same as 27 (Q67) | prep vendor |
| 32 | "You have 8,000 labeled examples collected from support agents over two years for fine-tuning." | workflow (data curation) | senior | none named | same as 27 (Q68) | prep vendor |
| 33 | Would you use preference tuning (DPO or RLHF-style methods), and how would you do it safely? | concept | staff | none named | same as 27 (Q72, paraphrased by the fetcher) | prep vendor |
| 34 | "A regulated financial company wants a model strategy for five LLM features:" "customer chat, document extraction, internal code assistance, summarization, and compliance review." | design (strategy) | staff | none named | same as 27 (Q75) | prep vendor |
| 35 | "Your company wants an internal assistant for 20,000 employees." "Leadership asks: should we self-host an open-weight model or use a hosted API, and how many GPUs would we need?" | estimate / design | staff | none named | same as 27 (Q77) | prep vendor |
| 36 | "Your company runs twelve LLM features across chat, search, extraction, and agents, each team calling models in its own way." Design a shared inference platform. | design (platform) | staff | none named | same as 27 (Q85) | prep vendor |
| 37 | "Eight product teams each run their own ad-hoc LLM evaluations in notebooks." "What does it contain, and how do you know it works?" | design (platform) | staff | none named | same as 27 (Q89) | prep vendor |
| 38 | "Leadership wants to use production conversations to improve the assistant" "through better evaluation sets and fine-tuning data." | workflow (data, privacy) | staff | none named | same as 27 (Q93) | prep vendor |
| 39 | HR assistant: "A user asks you to delete all their data." | design (privacy) | senior | none named | same as 27 (Q97) | prep vendor |
| 40 | "The board asks you to design an AI governance process that satisfies auditors without stopping teams from shipping." | design (governance) | staff | none named | same as 27 (Q98) | prep vendor |
| 41 | "Your monthly LLM bill tripled in six weeks while traffic grew only 40%." | debug (cost) | senior | none named | same as 27 (Q99) | prep vendor |
| 42 | "Your AI feature is 10x more expensive per user than projected. What do you do?" | debug (cost) | senior | none named | https://jobsbyculture.com/blog/ai-engineer-interview-questions-2026 | prep vendor compiled from candidate reports |
| 43 | "How would you design an A/B test for an LLM feature?" | design | senior | none named | same as 42 | prep vendor |
| 44 | "When do you self-host a model vs use an API?" | concept | senior | none named | same as 42 | prep vendor |
| 45 | "Your eval scores are flat after deploying a model change, but users are complaining. What's happening?" | debug | senior | none named | same as 42 | prep vendor |
| 46 | "How do you handle model updates and deprecations from providers?" | concept | senior | none named | https://raw.githubusercontent.com/ombharatiya/ai-system-design-guide/main/00-interview-prep/01-question-bank.md (Q35) | community guide |
| 47 | "What is DSPy and when would you use it?" | concept | senior | none named | same as 46 (Q36) | community guide |
| 48 | "How do you design a feedback loop for continuous improvement?" | design | senior | none named | same as 46 (Q37) | community guide |
| 49 | "A customer says their dashboard is wrong. They can't tell you which number. What do you do?" | customer (decomposition) | senior | article places decomposition rounds in Palantir's FDSE onsite but does not say this wording is Palantir's | https://www.techinterview.org/post/3233477236/forward-deployed-engineer-interview/ | prep vendor |
| 50 | "A hospital has patient records in six systems that don't talk to each other." "Walk me through how you'd give a nurse one view." | customer (decomposition) | senior | same caveat as 49 | same as 49 | prep vendor |
| 51 | Customer-conversation simulation: the interviewer plays a VP of Engineering at a 5,000-person fintech evaluating Claude for an internal copilot ("convince me"). | customer | senior | Anthropic | https://getperspective.ai/blog/anthropic-applied-ai-engineer-interview-process-frontier-lab-2026/markdown | commercial blog citing unnamed candidate reports; scenario, not verbatim question |

Gaps in the evidence: no company publishes LLMOps or fine-tuning questions verbatim. The closest company sources are job posts and interview guides already cited on the site (Anthropic careers, OpenAI interview guide). Questions 17 to 20 come from a forum thread of anonymous posts and should be labelled as such or dropped.

---

## 4. Numbers and facts to know

| Fact | Source (checked 2026-10-28 unless noted) |
|---|---|
| GEPA outperforms GRPO by 6% on average and by up to 20%, using up to 35x fewer rollouts, across six tasks; beats MIPROv2 by over 10% (for example +12% on AIME-2025). Accepted to ICLR 2026 (oral). Authors' own results. | https://arxiv.org/abs/2507.19457 |
| MIPRO outperforms baseline optimisers on five of seven multi-stage programs with Llama-3-8B, by as much as 13% accuracy. | https://arxiv.org/abs/2406.11695 |
| APE instructions match or beat human-written ones on 19 of 24 tasks. | https://arxiv.org/abs/2211.01910 |
| OPRO prompts beat human-designed prompts by up to 8% on GSM8K and up to 50% on Big-Bench Hard tasks. | https://arxiv.org/abs/2309.03409 |
| TextGrad raised GPT-4o zero-shot GPQA accuracy from 51% to 55%. | https://arxiv.org/abs/2406.07496 |
| DSPy guidance: about 10 examples for BootstrapFewShot, 50 or more for random search, 200 or more examples and 40 or more trials for MIPROv2; a simple optimisation run costs "on the order of $2 USD" and about ten minutes. Reported informal results: ReAct with MIPROv2 on HotPotQA 24% to 51%; BootstrapFinetune on Banking77 66% to 87%. | https://raw.githubusercontent.com/stanfordnlp/dspy/main/docs/docs/learn/optimization/optimizers.md |
| OpenAI's dataset-backed prompt optimiser needs at least three rows with responses and a grader result or annotation per row; it is deprecated with the Evals platform (read-only 31 October 2026, shut down 30 November 2026). | https://developers.openai.com/api/docs/guides/prompt-optimizer |
| Langfuse prompts: immutable numbered versions, labels as pointers (`production` default, `latest` automatic), rollback by moving the label, client-side cache can serve the old version until it expires. | https://langfuse.com/docs/prompt-management/data-model |
| A team saw a 10% drop in intent classification after migrating from gpt-3.5-turbo-0301 to gpt-3.5-turbo-1106. | https://applied-llms.org/ |
| GPT-4 prime-versus-composite accuracy: 84% in March 2023, 51% in June 2023, same questions. | https://arxiv.org/abs/2307.09009 |
| Anthropic postmortem (17 September 2025): context routing bug hit 0.8% of Sonnet 4 requests at first and 16% at the worst hour on 31 August; about 30% of Claude Code users who made requests in the period had at least one misrouted message. | https://www.anthropic.com/engineering/a-postmortem-of-three-recent-issues |
| Sycophancy rollback: the update added a reward signal from thumbs-up and thumbs-down data; offline evals "generally looked good"; A/B tests suggested the small number of users who tried it liked it; OpenAI committed to treat model behaviour issues as launch-blocking. | https://simonwillison.net/2025/May/2/what-we-missed-with-sycophancy/ (quoting https://openai.com/index/expanding-on-sycophancy/, which returned 403) |
| Clustered standard errors on popular evals can be over three times naive ones; question-score correlations between frontier models run about 0.3 to 0.7, which paired comparisons exploit. | https://www.anthropic.com/research/statistical-approach-to-model-evals |
| A/B sample size, computed here (alpha 0.05 two-sided, power 0.8): 70% to 72% needs about 8,080 users per arm; 70% to 75% about 1,250; 90% to 91% about 13,490. Formula n = (z_alpha/2 + z_beta)^2 (p1 q1 + p2 q2) / (p2 - p1)^2. | computed in this file |
| CUPED reduced variance by about 50% on Bing, equivalent to half the users or half the duration. | https://exp-platform.com/cuped/ (search only) |
| OpenAI announced on 2 September 2025 that it would acquire Statsig, an experimentation platform, reported at about $1.1 billion. | https://www.geekwire.com/2025/openai-acquires-statsig/ (search only) |
| LinkedIn: about 80% of the target experience in the first month, about four more months to pass 95%; linguists could evaluate up to 500 conversations a day; malformed parameters in about 10% of responses, about 0.01% after a defensive parser. | https://www.linkedin.com/blog/engineering/generative-ai/musings-on-building-a-generative-ai-product |
| METR randomised trial: 16 experienced developers, 246 tasks; AI increased completion time by 19%; developers forecast a 24% speedup and afterwards believed 20%. | https://arxiv.org/abs/2507.09089 |
| GitHub Copilot experiment: treatment group finished an HTTP-server task 55.8% faster. | https://arxiv.org/abs/2302.06590 |
| Acceptance rate of shown suggestions, not persistence, drives perceived productivity in code completion. | https://arxiv.org/abs/2205.06537 |
| LIMA: a 65B model tuned on 1,000 curated examples; responses equivalent or preferred to GPT-4 in 43% of cases, to Bard 58%, to DaVinci003 65%. | https://arxiv.org/abs/2305.11206 |
| AlpaGasus: 9k examples filtered from 52k; 7B training time 80 minutes down to 14 minutes (5.7x). | https://arxiv.org/abs/2307.08701 |
| Dedup: over 1% of unprompted output copied verbatim from training data; one 61-word sentence repeated over 60,000 times in C4; dedup cut memorised emission tenfold; over 4% of standard validation sets overlap training. | https://arxiv.org/abs/2107.06499 |
| FineWeb: 15 trillion tokens from 96 Common Crawl snapshots; FineWeb-Edu 1.3 trillion tokens. | https://arxiv.org/abs/2406.17557 |
| Model collapse appears when synthetic data replaces real data; accumulating real plus synthetic keeps test error bounded. | https://arxiv.org/abs/2404.01413 |
| Unsupervised fine-tuning gives modest gains; RAG consistently outperforms it for both seen and new knowledge. | https://arxiv.org/abs/2312.05934 |
| New-knowledge fine-tuning examples are learned slower and, once learned, linearly increase hallucination. | https://arxiv.org/abs/2405.05904 |
| LoRA underperforms full fine-tuning on code and maths in standard low-rank settings and forgets less; full fine-tuning learns perturbations with rank 10 to 100 times typical LoRA ranks. | https://arxiv.org/abs/2405.09673 |
| LoRA Land: 310 adapters (10 bases x 31 tasks); 4-bit LoRA models beat their base by 34 points and GPT-4 by 10 points on average on those tasks; 25 Mistral-7B adapters served on one 80 GB A100 with LoRAX. | https://arxiv.org/abs/2405.00732 |
| S-LoRA: up to 4x throughput over HF PEFT and vLLM with naive LoRA support; thousands of adapters on one or more GPUs. | https://arxiv.org/abs/2311.03285 |
| OpenAI SFT: minimum 10 examples, improvements typically seen from 50 to 100, start with 50; supported SFT models listed are the gpt-4.1 family. | https://developers.openai.com/api/docs/guides/supervised-fine-tuning |
| OpenAI self-serve fine-tuning: closed to organisations that never fine-tuned on 7 May 2026; closed to those without fine-tuned-model inference in the past 60 days on 2 July 2026; no new jobs for active customers from 6 January 2027; inference continues until the base model is deprecated. | https://developers.openai.com/api/docs/deprecations |
| TRL SFTConfig defaults: learning rate 2e-5, 3 epochs, max_length 1024, packing off; about 1e-4 suggested for adapters; `assistant_only_loss` needs `{% generation %}` markers in the chat template; prompt-completion datasets compute loss on the completion by default. | https://huggingface.co/docs/trl/sft_trainer |
| Unsloth LoRA guide: learning rate 2e-4 (5e-6 for DPO or GRPO), 1 to 3 epochs, rank 16 or 32 suggested, alpha equal to rank or twice it, effective batch 16, all attention and MLP projections as targets, training loss below 0.2 likely means overfitting. | https://unsloth.ai/docs/get-started/fine-tuning-llms-guide/lora-hyperparameters-guide |
| vLLM: `--enable-lora`, `--max-lora-rank` set to the largest adapter rank; adapter chosen through the `model` field; runtime adapter loading should not be used in production outside an isolated, trusted environment. | https://docs.vllm.ai/en/latest/features/lora.html |
| Anthropic list prices (per million tokens): Sonnet 5.5 $2 input, $10 output; Opus 5.5 $4 and $20; Haiku 5.5 $0.10 and $0.50 for prompts up to 100,000 tokens; Batch API 50% off input and output; cache hits at 0.05x base input on Opus 5.5 and Sonnet 5.5, 0.1x on most other models. | https://platform.claude.com/docs/en/about-claude/pricing |
| Anthropic gives at least 60 days' notice before retiring a publicly released model; claude-sonnet-4-5-20250929 retires 30 November 2026. | https://platform.claude.com/docs/en/about-claude/model-deprecations |
| Intercom Fin is priced at $0.99 per outcome; an outcome is a confirmed resolution, no further help requested, or a completed workflow including handoffs; charged once per conversation. | https://www.intercom.com/pricing |
| Epoch AI: price to reach a fixed capability fell 9x to 900x per year depending on the threshold; about 40x per year for GPT-4-level GPQA performance (12 March 2025). | https://epoch.ai/data-insights/llm-inference-price-trends |
| Lambda on-demand H100 SXM $3.99 to $4.29 per GPU-hour; B200 SXM6 $6.69 to $6.99 (plus tax). | https://lambda.ai/pricing |
| Menlo (survey of 495 US enterprise AI decision-makers, November 2025): enterprise generative AI spend $37B in 2025 versus $11.5B in 2024; 76% of AI solutions purchased versus 53% in 2024; enterprise LLM API share Anthropic 40%, OpenAI 27%, Google 21%; open-source 11% of usage; fine-tuning "niche". | https://menlovc.com/perspective/2025-the-state-of-generative-ai-in-the-enterprise/ |
| Applied LLMs: cost of a fixed benchmark level at one million tokens fell from $20 to under 10 cents in four years (halving about every six months); BloombergGPT (363B tokens, nine full-time employees) was outclassed by gpt-3.5-turbo and gpt-4 within a year. | https://applied-llms.org/ |
| Llama 4 Community License (effective 5 April 2025): licence from Meta required above 700 million monthly active users; "Built with Llama" displayed; derived model names begin with "Llama". | https://dev.meta.ai/llama/llama4/license/ |
| Gemma Terms of Use (last modified 1 April 2026) cover Gemma models in its appendix and point Gemma 4 to a separate licence page; Google reserves the right to restrict use "remotely or otherwise". | https://ai.google.dev/gemma/terms |
| OSI Open Source AI Definition 1.0 requires data information, full code and parameters, with freedoms to use, study, modify and share. | https://opensource.org/ai/open-source-ai-definition |
| OpenAI API data: abuse-monitoring logs kept up to 30 days by default; zero data retention by approval and not on `/v1/files`, `/v1/batches`, `/v1/vector_stores`; not used for training by default; regional processing only in the US, Europe and the UAE for some endpoints. | https://developers.openai.com/api/docs/guides/your-data |
| EU AI Act: GPAI rules apply from 2 August 2025; Annex III high-risk from 2 December 2027; Annex I from 2 August 2028; GPAI Code of Practice published 10 July 2025. | https://artificialintelligenceact.eu/implementation-timeline/ ; https://digital-strategy.ec.europa.eu/en/policies/contents-code-gpai |
| NIST AI RMF 1.0 released 26 January 2023; Generative AI Profile (NIST AI 600-1) 26 July 2024; the RMF is being revised under the White House AI Action Plan. | https://www.nist.gov/itl/ai-risk-management-framework |
| EDPB Opinion 28/2024 on personal data in AI models, adopted 18 December 2024. | https://www.edpb.europa.eu/our-work-tools/our-documents/opinion-board-art-64/opinion-282024-certain-data-protection-aspects_en |
| Colorado SB 26-189 signed 14 May 2026, repeals and replaces SB 24-205, effective 1 January 2027. | https://www.hklaw.com/en/insights/publications/2026/05/colorado-governor-signs-sb-189 (search only) |
| Bartz v. Anthropic: about $1.5 billion class settlement; preliminary approval September 2025, final approval reported July 2026. | https://www.jurist.org/news/2026/07/judge-approves-record-1-5-billion-settlement-involving-anthropic/ (search only) |

---

## 5. Misconceptions a reviewer should check

1. **"We will fine-tune on OpenAI."** OpenAI's self-serve fine-tuning is closed to new organisations since 7 May 2026 and ends new jobs for existing customers on 6 January 2027. Any lesson, problem or answer that offers it as a default option is out of date. The interview question "Develop a strategy for OpenAI's fine-tuning capabilities" now has a different correct opening. Check `foundations/training` and `fnd-011`.
2. **"Fine-tune it on our docs so it knows our products."** Knowledge injection by fine-tuning loses to retrieval, and fine-tuning on facts the model does not know increases hallucination (Ovadia et al.; Gekhman et al.). Fine-tuning is for format, style, narrow skills and cost, not for a changing corpus.
3. **"LoRA matches full fine-tuning."** True for small and medium SFT datasets when applied to all layers (LoRA Without Regret, cited in the training lesson), not for large capability gains in code or maths in standard low-rank settings (Biderman et al.). A lesson that states either finding without its conditions is wrong.
4. **"Overlapping confidence intervals mean no regression."** The existing evals lesson already corrects this for paired offline evals; check that new A/B material does not reintroduce it, and that it uses user-level randomisation and clustered errors for multi-turn sessions.
5. **"A positive A/B test is enough to ship."** The sycophancy rollback had positive A/B results and good offline evals. Short-horizon satisfaction can reward agreeable answers. Reviewers should check that any rollout answer has guardrail metrics and a named owner for qualitative launch blockers.
6. **"Thumbs-up rate is the quality metric."** It is a biased sample and, used as a reward, it can amplify agreeable answers. Use it as a filter for traces to read.
7. **"If the prompt and model did not change, quality did not change."** Serving infrastructure bugs degraded quality with no model change (Anthropic postmortem); providers also update models behind aliases (Chen et al.). Monitoring needs quality probes on production.
8. **"Rollback is instant with a prompt registry."** Clients cache prompts; after the label moves, traffic can run the old version until the cache TTL expires. State the TTL in any rollback claim.
9. **"An optimised prompt is strictly better."** Optimisers fit the dev set and the metric; OpenAI's documentation warns the optimised prompt can do worse on specific inputs, and DSPy recommends 200 or more examples for MIPROv2 to limit overfitting. Check that lessons keep a held-out set and a human review.
10. **"GEPA beats RL."** The paper's comparison covers six tasks and is the authors' own result. Quote the conditions ("on average 6%, up to 20%, up to 35x fewer rollouts") and not the title alone.
11. **"Open weights means open source."** Llama 4's licence has a 700M MAU clause, naming and attribution rules; Gemma's terms reserve remote restriction rights. The OSI definition requires data information, code and parameters. Check `foundations/model-landscape` wording.
12. **"More data is better for SFT."** LIMA (1,000 curated examples) and AlpaGasus (9k of 52k) show curation matters more than volume at small scale; OpenAI's own guide starts at 50 examples. Also check that eval sets are deduplicated against training data (over 4% overlap in standard sets, Lee et al.).
13. **"Synthetic data causes model collapse."** Collapse is shown when synthetic replaces real data; accumulating with real data avoided it in Gerstgrasser et al. Lessons should state the condition.
14. **"Coding assistants make developers faster, the acceptance rate proves it."** Acceptance rate predicts perceived productivity; the METR randomised trial measured a 19% slowdown for experienced developers on their own repositories while they believed they were faster. Product-sense answers should pair engagement metrics with an outcome measure.
15. **"Self-hosting is cheaper at scale."** Only after the break-even volume, at sustained utilisation, and counting people and on-call; API prices for a fixed capability have fallen 9x to 900x per year (Epoch AI), so the break-even moves. Check that `inf-013` and any new build-versus-buy material say the comparison is dated.
16. **"High-risk EU AI Act rules apply from August 2026."** Out of date since Regulation (EU) 2026/1744: Annex III from 2 December 2027, Annex I from 2 August 2028. The hallucination lesson is already correct; check new compliance material against it.
17. **"Colorado's AI Act takes effect 30 June 2026."** It was replaced by SB 26-189, effective 1 January 2027 (search only; verify against the bill text before publishing).
18. **"API data is used to train the provider's models."** Not by default on the OpenAI API; abuse-monitoring logs are kept up to 30 days unless the organisation has zero data retention, which is by approval and excludes some endpoints such as files and batches. Answers about PII must name retention, not only training.
19. **Company attribution of questions.** Most company tags in section 3 come from aggregators or anonymous forum posts. A reviewer should check that `companies` frontmatter is filled only where SPEC section 6 allows (a public source naming the company and the topic), and that forum-only items (questions 17 to 20) are not tagged.
20. **"Interview loop shares and round formats."** The customer-simulation and decomposition formats are described by prep vendors, not the companies; any claim about how many candidates a round filters (one source says about 60%, unsourced) must not appear on the site.
