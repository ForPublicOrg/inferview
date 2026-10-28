# Inferview curriculum v2

Generated 2026-10-28. Machine-readable twin: `research/curriculum-v2.json` (same content). Every source URL below was checked on 2026-10-28 by the research pass in `research/gaps/` or during this synthesis. Problem briefs that contain numbers without a source are scenario inputs, not claims.

## Counts

- Tracks: 15 (9 kept, 6 new)
- Modules: 98
- Lessons: 330 (lesson 269, playbook 37, paper 24; senior 236, staff 94)
- Planned problems: 613 (134 existing problems kept or rewritten, 479 new; 20 existing problems retired)
- Problem types: estimate 74, code 61, concept 94, debug 87, critique 64, mcq 28, design 136, workflow 29, behavioural 17, replay 4, multistage 6, presentation 6, worksample 4, repo 3
- Difficulty: hard 433, medium 180; level: senior 407, staff 206
- Teardowns: 39; labs: 34; playbooks: 37; paper walkthroughs: 24; formats: 20
- Core 100 per track: foundations 6, apis 6, evals 8, workflows 7, rag 7, agents 6, harness 9, safety 5, security 8, inference 7, llmops 6, training 8, multimodal 5, system-design 6, rounds 6; Crunch path: 25

## Tracks in site order

| # | slug | title | modules | build wave |
|---|---|---|---|---|
| 1 | foundations | LLM foundations for software engineers | tokens, embeddings, attention, sampling, training, model-landscape | 3 |
| 2 | apis | Building with model APIs | api-anatomy, prompting, structured-outputs, context-engineering, frameworks | 3 |
| 3 | evals | Evals and observability | eval-thinking, golden-sets, llm-judge, agent-evals, evals-in-ci | 2 |
| 4 | workflows | AI workflows and durable execution | patterns, durable-execution, retries-flow-control, approvals-handoffs, batch-pipelines, operating-workflows | 1 |
| 5 | rag | Retrieval and RAG | retrieval-foundations, ingestion, hybrid-search, advanced-rag, debugging-rag, vector-systems, search-quality | 2 |
| 6 | agents | Agents and protocols | agent-loop, tools-mcp-a2a, memory-state, multi-agent, coding-agents | 2 |
| 7 | harness | Harness engineering and agentic coding tools | harness-anatomy, tools-aci, context-management, cache-cost-latency, permissions-sandboxing, verification, long-running-parallel, evaluating-harnesses | 1 |
| 8 | safety | Prompt injection, guardrails and model safety | threat-modeling, red-team, injection-defences, guardrails, hallucination | 2 |
| 9 | security | Implementing security for AI systems | secure-architecture, permissions-identity, sandboxing-secrets, mcp-security, output-data, supply-chain, security-ops, governance | 1 |
| 10 | inference | Inference, serving and cost | inference-anatomy, batching, faster-cheaper, gateways-finops, operating, fleet | 2 |
| 11 | llmops | LLMOps, fine-tuning and AI product economics | prompt-lifecycle, releases-experiments, monitoring-feedback, data-curation, fine-tuning, economics-selection, platform-strategy | 2 |
| 12 | training | Training, post-training and infrastructure | compute-scaling, gpu-kernels, distributed, numerics, reliability, pretraining-data, moe, post-training, rl, distill-merge, adapting | 2 |
| 13 | multimodal | Long context, architectures, multimodal and voice | long-context, architectures, vision-language, speech-voice, generation | 3 |
| 14 | system-design | AI system design | framework, capacity, case-retrieval, case-agents, case-realtime, case-platforms | 3 |
| 15 | rounds | Coding rounds, work samples, behavioural and customer craft | hand-write, llm-app-coding, take-home-debug, codebase-rounds, ai-collab-coding, customer-craft, deep-dives, behavioural | 1 |

Build wave 1 is built first: harness (the owner's first missing area), workflows, security and the loop formats in rounds. Track order on the site keeps evals third and places workflows before agents. SPEC section 4 needs the six new tracks and the new modules added before their content can ship.

## Problem types

| type | gradable | definition | grading |
|---|---|---|---|
| concept | no | An explanation or decision in prose; the reader types a short answer before the worked answer and follow-ups appear. | Self-rated against the Depth block and follow-ups. |
| estimate | yes | Napkin arithmetic with at least one reader-chosen assumption. | Graded against an accepted band wide enough for reasonable assumptions; the answer names the dominant term. |
| debug | yes | A trace, log or snippet with a symptom and incomplete evidence; at least two real defects, one of which explains the symptom. | Graded by the hypothesis pick (choices of equal length), then a self-rated ranking of secondary defects. |
| code | yes | Python 3 in Pyodide, standard library only, with visible examples and hidden property or invariant tests. | Graded by hidden tests. |
| design | no | A system to design under an operating constraint, with a "what you give up" statement and a written artefact. | Self-rated from a checklist. |
| behavioural | no | A story prompt at senior or staff scope with pushback follow-ups. | Self-rated from a checklist of signals (ownership, alternatives, measured result, influence). |
| mcq | yes | Three to five options of equal length, every wrong option a belief a senior engineer has held. | Graded; each option has a one-sentence reason shown after answering. |
| critique | no | A flawed artefact (design, trace, prompt, config, code or diff) with planted flaws; the reader lists flaws before opening a 6 to 12 item checklist. | Self-rated from the tick ratio; not counted for the streak. |
| workflow | no | A business process with constraints; the reader designs steps, state, retries, idempotency, approvals, budgets and rollout. | Self-rated against a checklist; optionally partly graded by a fault-injecting workflow simulator. |
| multistage | yes | A progressive coding problem of three or four stages, each adding requirements and hidden tests, with a visible clock (the CodeSignal-style format reported at Anthropic, OpenAI, Ramp and Perplexity). | Graded per stage by hidden tests; the stage reached is recorded. |
| repo | yes | A multi-file package in the in-memory filesystem with seeded bugs to fix or a feature to add in an existing codebase (bug squash, AI-enabled round phases). | Graded by hidden behaviour tests per bug or feature. |
| replay | yes | An incident replay: a sourced timeline with checkpoints where the reader commits to a hypothesis before the next event; the reveal is the published postmortem. | Graded by the checkpoint picks; the closing "which control would have caught it" answer is self-rated. |
| worksample | no | A timed build-and-defend task: a planning window, a build in the reader's own environment, then review questions on data model, abstractions, path to production and AI use. | Self-rated from a rubric checklist; never counted for the streak. |
| presentation | no | A prepared talk, project deep dive or paper presentation followed by a probe list. | Self-rated against the probe list. |

## 1. LLM foundations for software engineers (`foundations`)

The internals that set cost, latency and failure modes, taught at the level of a design review rather than an introduction. Tokenizers as a billing and security surface, embeddings as trained artefacts, attention layouts as serving decisions, decoding and determinism, the training pipeline as a map into the training and llmops tracks, and model selection from evidence. Every lesson assumes the reader can already define a token, an embedding and attention, and spends its words on mechanisms, published numbers and the decision each one drives.

### foundations/tokens: Tokenizers as cost, capacity and security surface

The tokenizer fixes the unit of billing, rate limiting and context capacity, so tokenizer changes are pricing events and special tokens are an injection channel.

**Lessons**

1. **The tokenizer as a cost, capacity and security surface** (`tokenizer-surface`, lesson, senior). A tokenizer fixes the unit of billing, rate limiting and context capacity, so changing models can change the bill for identical text. The lesson works from measured counts across encodings, pre-tokenizer regex differences, the language skew Petrov et al. measured, and Anthropic's note that Claude 4.7 and later produce more tokens for the same text. The decision it teaches is how to price a tokenizer change and when caching or per-language pricing absorbs it.
   - Sources: https://github.com/openai/tiktoken/blob/main/tiktoken_ext/openai_public.py ; https://arxiv.org/abs/2305.15425 ; https://platform.claude.com/docs/en/about-claude/pricing ; https://github.com/meta-llama/llama3/blob/main/llama/tokenizer.py
   - Widget or lab: TokenStrip
   - Existing: `src/content/lessons/foundations/tokens/overview.mdx` (rewrite, primary). Keep the measured counts, the pre-tokenizer regex difference and the special-token note as a reference table; drop the lexer preamble and the phone-screen question (level audit 5.1).
2. **BPE training versus encoding, and the edge cases that follow** (`bpe-mechanics`, lesson, senior). BPE training is a greedy loop over pair frequencies while encoding replays merges in rank order, so the two have different costs and different failure modes. The lesson covers byte fallback, digit and whitespace pre-splitting, vocabulary size against embedding and softmax cost, and why letter counting and long-number arithmetic suffer. The reader leaves able to implement both and to predict how an unseen word is split.
   - Sources: https://arxiv.org/abs/1508.07909 ; https://github.com/openai/tiktoken/blob/main/tiktoken_ext/openai_public.py ; https://arxiv.org/html/2407.21783
   - Widget or lab: BpeStepper
3. **Chat templates and special tokens as an interface contract** (`chat-templates`, lesson, senior). The chat template is the serialisation format between your messages and the model's training distribution, and a mismatch at serving degrades quality without raising an error. The lesson covers role tokens, the generation markers that assistant-only loss depends on, end-of-sequence alignment, and why special-token strings in user text are a security bug. The decision is who owns the template across a fine-tune and serve pipeline and which test proves it matches.
   - Sources: https://huggingface.co/docs/trl/sft_trainer ; https://github.com/meta-llama/llama3/blob/main/llama/tokenizer.py ; https://github.com/openai/tiktoken/blob/main/tiktoken_ext/openai_public.py

**Problems** (6; estimate 1, code 1, concept 1, debug 1, critique 1, mcq 1; hard 3, medium 3)

- `fnd-018` (estimate, hard, senior, new, Core 100) A vendor's new model emits more tokens for the same text: estimate the monthly bill, the rate-limit headroom and the cache hit rate at which the change pays for itself. Source: https://platform.claude.com/docs/en/about-claude/pricing
- `fnd-001` (code, medium, senior, existing) Train and apply BPE on a toy corpus; hidden property tests check the encode and decode round trip and merge-rank order on unseen words. Source: https://arxiv.org/abs/1508.07909
- `fnd-002` (concept, medium, senior, existing) The same invoice costs more per message in Hindi and Japanese: quantify the skew from measured counts and choose between translation, model choice and per-language pricing. Source: https://arxiv.org/abs/2305.15425
- `fnd-019` (debug, hard, staff, new) A fine-tuned model rambles past its answer only in production: the serving template omits the end-of-turn token the training template emitted; the evidence is incomplete and the reader names what to collect. Source: https://huggingface.co/docs/trl/sft_trainer
- `fnd-020` (critique, hard, senior, new) Critique an input sanitiser that strips special-token strings from user text before templating, then name the encoding-level control it should have used. Source: https://github.com/openai/tiktoken/blob/main/tiktoken_ext/openai_public.py
- `fnd-021` (mcq, medium, senior, new) Which change alters the token count of an unchanged prompt: a model switch inside one family, a tokenizer encoding change, whitespace normalisation, or reordering the system prompt? Source: https://github.com/openai/tiktoken/blob/main/tiktoken_ext/openai_public.py

### foundations/embeddings: Embeddings: operation and training

Embeddings are trained artefacts whose geometry, storage format and training objective decide recall per byte and what a domain fine-tune can fix.

**Lessons**

1. **Choosing and operating an embedding model** (`embedding-operations`, lesson, senior). Metric choice, normalisation, Matryoshka truncation and int8 or binary storage are one decision about recall per byte stored. The lesson costs an index from published dimension and quantisation results and shows why two models cannot share one index. It ends with the migration choice between re-embedding everything and dual-writing behind a cut-over.
   - Sources: https://developers.openai.com/api/docs/guides/embeddings ; https://arxiv.org/abs/2205.13147 ; https://huggingface.co/blog/embedding-quantization ; https://arxiv.org/abs/2212.03533
   - Widget or lab: FoundationsIndexSize
   - Existing: `src/content/lessons/foundations/embeddings/overview.mdx` (rewrite, primary). Drop the personality-vector hook and metric definitions; keep the Matryoshka, quantisation and model table; training mechanics move to contrastive-training.
2. **How embedders are trained: InfoNCE, negatives and false negatives** (`contrastive-training`, lesson, staff). Embedders learn from a contrastive loss whose negatives come from the batch, so batch size, duplicates and mined negatives change what the model learns. The lesson covers InfoNCE with temperature, GradCache for large batches, BM25 negatives in DPR, refreshed negatives in ANCE, and NV-Retriever's positive-aware mining against false negatives. The reader can implement a symmetric CLIP loss and a negative miner and say when a domain fine-tune is worth it.
   - Sources: https://sbert.net/docs/package_reference/sentence_transformer/losses.html ; https://arxiv.org/abs/2004.04906 ; https://arxiv.org/abs/2007.00808 ; https://arxiv.org/abs/2407.15831 ; https://arxiv.org/abs/2103.00020
   - Widget or lab: lab:embedding-training
3. **Playbook: fine-tune the embedder, add a reranker, or change the chunks** (`domain-retrieval-playbook`, playbook, senior). When retrieval fails on a domain, three levers compete for the same budget and each fixes a different failure. The inputs are labelled pairs, query distribution, latency budget and how often the corpus changes; the Sentence Transformers write-up shows a small fine-tuned reranker beating a larger general one on its own domain only. The playbook ends with what to measure after deciding: recall@k on held-out queries and the false-negative rate of mined pairs.
   - Sources: https://sbert.net/docs/package_reference/sentence_transformer/losses.html ; https://huggingface.co/blog/train-reranker ; https://arxiv.org/abs/2407.15831 ; https://arxiv.org/abs/2407.12883

**Problems** (6; code 1, debug 2, estimate 1, concept 1, design 1; hard 4, medium 2)

- `fnd-022` (code, hard, senior, new, Core 100) Implement the symmetric CLIP contrastive loss from paired embeddings with a temperature; hidden tests check symmetry, label alignment and numerical stability. Source: https://prachub.com/interview-questions/implement-clip-contrastive-loss. Reported: Uber (candidate report via PracHub)
- `fnd-023` (debug, hard, staff, new) Recall fell after adding mined hard negatives: rank the causes when many mined negatives are unlabelled positives, and say what you would sample to be sure. Source: https://arxiv.org/abs/2407.15831
- `fnd-006` (debug, medium, senior, existing) Search broke after an embedding model upgrade wrote new vectors into the old index; find the cause and plan a cut-over that keeps recall during migration. Source: https://developers.openai.com/api/docs/guides/embeddings
- `fnd-024` (estimate, medium, senior, new) Choose a Matryoshka dimension and storage format for 80 million vectors under a RAM budget, stating the recall you expect to lose and how you would measure it. Source: https://arxiv.org/abs/2205.13147
- `fnd-025` (concept, hard, staff, new) Two sentences with opposite meaning score high cosine: explain it from the training objective, then propose a mitigation and its cost in latency and labels. Source: https://sbert.net/docs/package_reference/sentence_transformer/losses.html
- `fnd-026` (design, hard, staff, new) Design training for a model that maps text, images and audio into one embedding space: architecture, supervision, losses, evaluation and deployment. Source: https://prachub.com/interview-questions/design-training-for-multimodal-embedding-model. Reported: TikTok (candidate report via PracHub)

### foundations/attention: Attention layouts as serving decisions

Attention mechanics stated once, then the layout choices (GQA, MLA, windows, hybrids) that set KV bytes per token and therefore what a GPU can serve.

**Lessons**

1. **Attention, causal masks and the online softmax** (`attention-mechanics`, lesson, senior). Self-attention is a weighted gather whose cost is quadratic in sequence length at prefill and linear per token at decode once keys and values are cached. The lesson states the scaling factor in one line with its source and spends its words on the causal mask at training versus inference and the online softmax normaliser that FlashAttention and decode kernels depend on. The reader can write a decode step whose output equals a full recompute.
   - Sources: https://arxiv.org/abs/1706.03762 ; https://arxiv.org/abs/1805.02867 ; https://arxiv.org/abs/2205.14135
   - Widget or lab: FoundationsAttention
   - Existing: `src/content/lessons/foundations/attention/overview.mdx` (rewrite, primary). Drop the hash-map section and the walk-me-through question; merge with the KV material from inference-anatomy into attention-layouts (level audit 5.1).
2. **MHA, GQA, MLA, windows and hybrids: picking a layout for a context target** (`attention-layouts`, lesson, staff). The attention layout fixes KV bytes per token, which sets batch size and cost at long context. The lesson computes bytes per token from published configs for Llama 3.1 (GQA), DeepSeek-V3 (MLA), Gemma 3 (local and global layers) and gpt-oss (banded windows) in front of the reader. The decision is which layout, or which open model, to serve for a 128K target and what quality evidence would reverse the choice.
   - Sources: https://arxiv.org/abs/2305.13245 ; https://arxiv.org/abs/2405.04434 ; https://huggingface.co/deepseek-ai/DeepSeek-V3/blob/main/config.json ; https://arxiv.org/abs/2503.19786 ; https://arxiv.org/html/2508.10925
   - Widget or lab: new:AttentionLayoutCompare
3. **FlashAttention 1 to 3: exact attention bounded by memory traffic** (`flashattention`, paper, senior). FlashAttention is exact and does more arithmetic than the naive kernel, and wins by tiling in on-chip memory and recomputing in the backward pass to cut HBM reads. FlashAttention-2 reports 50 to 73% of A100 peak and FlashAttention-3 adds Hopper warp specialisation and FP8 with block quantisation. What changed in practice is that attention cost discussions must be about IO, and the walkthrough ends with what to say when asked whether it is an approximation.
   - Sources: https://arxiv.org/abs/2205.14135 ; https://arxiv.org/abs/2307.08691 ; https://arxiv.org/abs/2407.08608

**Problems** (6; design 1, code 1, estimate 1, concept 1, debug 1, mcq 1; hard 4, medium 2)

- `fnd-027` (design, hard, staff, new, Core 100) Pick the attention layout, or the open model, for a 128K-context serving target on a fixed GPU budget, defending the KV bytes per token and the quality evidence you would require. Source: https://prachub.com/interview-questions/implement-and-analyze-custom-attention. Reported: Anthropic (candidate report via PracHub)
- `fnd-004` (code, hard, senior, existing, Core 100) Causal attention with a KV cache and grouped-query heads; a hidden test compares every decode step with a full recompute. Source: https://arxiv.org/abs/2305.13245
- `fnd-015` (estimate, medium, senior, existing) How much KV cache does this batch need at mixed sequence lengths, and what changes with GQA-8 versus full multi-head? Source: https://huggingface.co/unsloth/Meta-Llama-3.1-70B-Instruct/blob/main/config.json
- `fnd-028` (concept, hard, staff, new) Explain FlashAttention, the KV cache and RoPE, then state what each changes in a serving cost model and which one a profiler would show. Source: https://prachub.com/interview-questions/explain-flashattention-kv-cache-and-rope. Reported: TikTok (candidate report via PracHub)
- `fnd-029` (debug, hard, senior, new) Decode diverges from the full recompute only for batched requests with left padding: locate the position-offset bug among several real defects in the cache code. Source: https://prachub.com/interview-questions/design-efficient-transformer-inference-with-kv-cache. Reported: Startups.com (candidate report via PracHub)
- `fnd-030` (mcq, medium, senior, new) Which statement about FlashAttention is false, given options of equal length about exactness, recomputation, FLOPs and HBM traffic? Source: https://arxiv.org/abs/2307.08691

### foundations/sampling: Decoding, determinism and constrained output

Samplers as tail policies, why temperature 0 still varies, what grammar masks guarantee, and logprobs as an instrument.

**Lessons**

1. **Samplers as tail policies: temperature, top-k, top-p and min-p** (`samplers`, lesson, senior). Each sampler is a rule for truncating the tail of the next-token distribution, and they differ in how they behave when the distribution is flat versus peaked. Min-p scales its cutoff with the top probability, which is why it holds up at high temperature where top-p admits low-probability tokens. The reader can implement and test the samplers and pick defaults for extraction versus open-ended generation.
   - Sources: https://arxiv.org/abs/1904.09751 ; https://arxiv.org/abs/2407.01082 ; https://docs.vllm.ai/en/latest/api/vllm/sampling_params.html
   - Widget or lab: SamplingLab
   - Existing: `src/content/lessons/foundations/sampling/overview.mdx` (split, primary). Sampler content stays here; determinism and constrained decoding become their own lessons.
2. **Why temperature 0 is not deterministic, and when it matters** (`nondeterminism`, lesson, senior). Thinking Machines measured 80 distinct outputs from 1,000 temperature-0 completions of one prompt and traced the variation mainly to kernels that are not batch-invariant under changing load. The lesson covers what batch-invariant kernels cost, why seeds do not help, and why the effect breaks the on-policy assumption in RL. The decision is when to pay for deterministic serving (evals, RL) and when to design the product around variance.
   - Sources: https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/ ; https://docs.vllm.ai/en/latest/api/vllm/sampling_params.html
3. **Constrained decoding: what a grammar mask guarantees and what it costs** (`constrained-decoding`, lesson, senior). A grammar mask guarantees syntax by zeroing invalid tokens at each step; it guarantees nothing about whether the content is right. The lesson covers token-boundary problems, mask compilation cost (XGrammar), and the disputed quality effect of strict formats (Let Me Speak Freely and the dottxt reply). The reader chooses per task between strict schema decoding, tool calls and validate-and-repair.
   - Sources: https://arxiv.org/abs/2411.15100 ; https://docs.vllm.ai/en/latest/features/structured_outputs.html ; https://arxiv.org/abs/2408.02442 ; https://blog.dottxt.ai/say-what-you-mean.html ; https://platform.claude.com/docs/en/build-with-claude/structured-outputs
4. **Logprobs as a debugging and confidence instrument** (`logprobs`, lesson, senior). Token log-probabilities expose near-ties that explain flips between runs and give a cheap confidence signal for classification and extraction. Instacart uses the probability of yes on the first token of a self-verification call to send low-confidence values to human auditors. The limits are that providers restrict logprob exposure, partly as an abuse control, and that calibration has to be measured on your own labels.
   - Sources: https://company.instacart.com/tech-innovation/scaling-catalog-attribute-extraction-with-multi-modal-llms ; https://docs.vllm.ai/en/latest/api/vllm/sampling_params.html ; https://genai.owasp.org/llmrisk/llm102025-unbounded-consumption/

**Problems** (6; code 1, debug 1, mcq 1, concept 1, design 1, critique 1; medium 3, hard 3)

- `fnd-007` (code, medium, senior, existing) Write top-p and min-p samplers; hidden property tests check that the kept mass and the cutoff behave correctly on flat and peaked distributions. Source: https://arxiv.org/abs/2407.01082
- `fnd-008` (debug, hard, senior, existing, Core 100, Crunch 24) Temperature 0 gives different answers across calls in production; the reader must ask for the evidence (logprobs, batch sizes, kernels) rather than be handed it. Source: https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/
- `fnd-016` (mcq, medium, senior, existing) What does constrained decoding guarantee about a JSON response, given options of equal length on syntax, schema, content and refusals? Source: https://docs.vllm.ai/en/latest/features/structured_outputs.html
- `fnd-031` (concept, hard, staff, new) An RL team wants bitwise-identical sampler and trainer; state what batch-invariant kernels cost in serving throughput, who pays it, and what you would accept instead. Source: https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/
- `fnd-032` (design, hard, senior, new) Classify a million support tickets a day with calibrated confidence: logprob thresholds, a self-verification call, or a small classifier; defend the cost and the review rate. Source: https://company.instacart.com/tech-innovation/scaling-catalog-attribute-extraction-with-multi-modal-llms
- `fnd-033` (critique, medium, senior, new) Critique an extraction service that uses strict schema decoding and reports 100% schema validity as its quality metric. Source: https://arxiv.org/abs/2408.02442

### foundations/training: The training pipeline, mapped for application engineers

The on-ramp to the training and llmops tracks: what each stage fixes, what reasoning models cost, and where fine-tuning memory goes.

**Lessons**

1. **From pretraining to RL: the pipeline as a build system** (`pipeline-map`, lesson, senior). Pretraining, mid-training, SFT, preference tuning and RL with verifiable rewards each consume different data and fix different defects, and later stages can undo earlier ones. The lesson uses public reports (Llama 3's rounds of SFT then DPO, DeepSeek-R1's cold start then RL) to show what each stage changed and what it cost. It points into the training track for mechanisms and into llmops for applied fine-tuning.
   - Sources: https://arxiv.org/html/2407.21783 ; https://arxiv.org/html/2501.12948 ; https://arxiv.org/abs/2203.02155 ; https://arxiv.org/abs/2402.03300
   - Existing: `src/content/lessons/foundations/training/overview.mdx` (split, primary). Post-training, LoRA and distillation depth move to the training track; applied fine-tuning moves to llmops/fine-tuning; the classic ML refresher is cut as below the bar.
2. **Reasoning models and test-time compute inside a latency budget** (`reasoning-models`, lesson, senior). Reasoning models trade output tokens for accuracy, so effort settings are a latency and cost knob per route, not a quality switch. The lesson covers parallel sampling versus longer chains, compute-optimal test-time scaling results, and Anthropic's finding that visible reasoning is not a faithful trace. The decision is which requests get a reasoning model and how thinking budgets are capped.
   - Sources: https://arxiv.org/abs/2408.03314 ; https://arxiv.org/html/2501.12948 ; https://www.anthropic.com/research/reasoning-models-dont-say-think ; https://platform.claude.com/docs/en/build-with-claude/thinking
3. **Fine-tuning memory: where 16 bytes per parameter come from** (`finetune-memory`, lesson, senior). Mixed-precision Adam costs 16 bytes per parameter before activations (20 with FP32 gradient accumulation), which is why full fine-tuning needs sharding and why LoRA and QLoRA change the arithmetic. The lesson covers what LoRA freezes, QLoRA's NF4 base with higher-precision adapters, and where activations stop QLoRA's saving. The reader estimates memory for a stated model and picks the method before reading a vendor table.
   - Sources: https://arxiv.org/abs/1910.02054 ; https://arxiv.org/abs/2106.09685 ; https://arxiv.org/abs/2305.14314 ; https://thinkingmachines.ai/blog/lora/
   - Widget or lab: FoundationsLoraMemory

**Problems** (6; estimate 1, concept 2, debug 1, critique 1, design 1; hard 4, medium 2)

- `fnd-009` (estimate, hard, senior, existing, Core 100) Fine-tuning memory for a stated model: full, LoRA and QLoRA, with activations and ZeRO sharding as part of the question rather than a follow-up. Source: https://arxiv.org/abs/1910.02054
- `fnd-010` (concept, medium, senior, existing) RLHF, DPO and GRPO in one diagram, with the failure mode and published hyperparameter choice for each stage. Source: https://arxiv.org/abs/2402.03300
- `fnd-013` (debug, hard, senior, existing) Debug a GRPO step whose importance ratio should start at 1; a length-bias defect is a real secondary bug the reader must rank. Source: https://prachub.com/interview-questions/debug-a-grpo-training-loop-and-explain-ratios. Reported: Anthropic (candidate report via PracHub)
- `fnd-034` (critique, hard, senior, new) Critique a LoRA fine-tuning plan: targets only attention projections, uses the full fine-tuning learning rate and library default rank, and trains with a large batch. Source: https://thinkingmachines.ai/blog/lora/
- `fnd-011` (design, hard, staff, existing) Prompt, RAG or fine-tune for a product team, now that OpenAI's self-serve fine-tuning is closed to new organisations; state the data volume and capacity conditions for each branch. Source: https://developers.openai.com/api/docs/deprecations
- `fnd-017` (concept, medium, senior, existing) Put a reasoning model inside a stated latency budget: which requests get it, what effort, and what you measure to keep the decision honest. Source: https://platform.claude.com/docs/en/build-with-claude/thinking

### foundations/model-landscape: Model selection from evidence

Reading model cards for serving and legal consequences, running bake-offs that survive review, and deciding migrations against retirement deadlines.

**Lessons**

1. **Reading a model card for serving and legal consequences** (`model-cards`, lesson, senior). Each line of a model card (architecture, context, cut-off, licence) maps to a serving or legal consequence. For mixture-of-experts models total parameters set memory while active parameters set FLOPs, and an advertised window is not an effective one. The reader turns a card into a short list of risks to test before any bake-off.
   - Sources: https://ai.meta.com/blog/llama-4-multimodal-intelligence/ ; https://huggingface.co/openai/gpt-oss-120b ; https://arxiv.org/abs/2412.19437 ; https://dev.meta.ai/llama/llama4/license/
   - Existing: `src/content/lessons/foundations/model-landscape/overview.mdx` (split, primary). Effective context moves to multimodal/long-context; licence clauses move to llmops/economics-selection; the card-reading core stays.
2. **Bake-offs that survive review: your tasks, paired comparisons, cost per success** (`bake-off`, lesson, senior). Leaderboards make a shortlist, not a decision, because contamination and task mismatch move rankings. The lesson builds a paired bake-off on your own traffic with clustered errors and reports cost per successful task next to accuracy; Anthropic reports clustered standard errors on popular evals more than three times the naive ones. The reader can defend a model choice to a reviewer who distrusts benchmarks.
   - Sources: https://www.anthropic.com/research/statistical-approach-to-model-evals ; https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/ ; https://arxiv.org/abs/2407.12883
3. **Playbook: migrate to a new model version or hold** (`migration-playbook`, playbook, senior). A new model version arrives with a retirement deadline for the old one (Anthropic gives at least 60 days of notice), so holding is also a decision with a date. The inputs are regressions per prompt, cost and latency change, behaviour evals and the deadline; the options are migrate all, migrate per route, or hold until retirement. The playbook ends with what to measure for the first two weeks after the switch.
   - Sources: https://platform.claude.com/docs/en/about-claude/model-deprecations ; https://developers.openai.com/api/docs/deprecations ; https://applied-llms.org/

**Problems** (6; concept 1, design 1, estimate 1, critique 1, mcq 1, workflow 1; hard 4, medium 2)

- `fnd-012` (concept, hard, senior, existing) A 1M-token window still misses the answer in a long contract: explain why, then decide between the full document and retrieval with a cost for each. Source: https://arxiv.org/abs/2307.03172
- `fnd-014` (design, medium, senior, existing) Pick a model for a million classifications a day under a cost cap and a quality floor, with the bake-off design that justifies it. Source: https://platform.claude.com/docs/en/about-claude/pricing
- `fnd-035` (estimate, hard, senior, new) From a bake-off's accuracy, tokens and retry rates for three models, compute cost per successful task, name the winner and the assumption that flips it. Source: https://platform.claude.com/docs/en/about-claude/pricing
- `fnd-036` (critique, hard, staff, new) Critique a model-selection memo that cites leaderboard ranks and a needle-in-a-haystack score as its evidence for a long-document product. Source: https://arxiv.org/abs/2410.02694
- `fnd-037` (mcq, medium, senior, new) A consumer app with 900M monthly active users (scenario) plans to ship on Llama 4: which licence clause changes the decision? Source: https://dev.meta.ai/llama/llama4/license/
- `fnd-038` (workflow, hard, staff, new) A new model version arrives with the old one retiring in 60 days: plan the per-route migration, the behaviour evals, the hold criteria and who decides. Source: https://platform.claude.com/docs/en/about-claude/model-deprecations

## 2. Building with model APIs (`apis`)

Client engineering against model APIs as a reliability discipline: stream contracts, the two kinds of 429, failover that does not change behaviour, prompts that survive upgrades, structured output guarantees, prompt caching mechanics, and what a framework or agent SDK buys. The reader already ships HTTP clients; the track teaches what changes when the server is metered, non-deterministic and versioned with retirement dates.

### apis/api-anatomy: Client reliability against model APIs

Stream event contracts, stop reasons, the two kinds of 429, retry placement and cross-provider failover.

**Lessons**

1. **Stop reasons and the stream event contract** (`stream-contract`, lesson, senior). A streamed response is a sequence of typed events whose order and partial states the client must handle, and the stop reason decides whether to continue, retry or surface an error. The lesson covers the event order and its traps (partial tool-input JSON, pings, mid-stream errors), max-tokens versus refusal versus tool-use stops, and what the 2026-10-21 API version changed. The reader can write a stream assembler that survives disconnects and resumes correctly.
   - Sources: https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons ; https://platform.claude.com/docs/en/build-with-claude/streaming ; https://platform.claude.com/docs/en/api/migration-2026-10-21 ; https://developers.openai.com/api/docs/guides/migrate-to-responses
   - Existing: `src/content/lessons/apis/api-anatomy/overview.mdx` (rewrite, primary). Keep the stop-reason list, stream event order with its traps, the two 429s and the provider table; drop the RPC preamble and the streaming explanation (level audit 5.1).
2. **Retries, rate limits and the two kinds of 429** (`two-429s`, lesson, senior). A rate-limit 429 with retry-after is transient, while a spend-cap 429 without it keeps failing until access resumes, and retrying it turns an outage into a storm. The lesson covers token-bucket limits on input and output tokens, cached reads excluded from input limits on most Claude models, jittered backoff, and keeping retries at one layer with a budget. The decision is where retries live in a stack and what every other layer does instead.
   - Sources: https://platform.claude.com/docs/en/api/rate-limits ; https://developers.openai.com/api/docs/guides/rate-limits ; https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/ ; https://builder.aws.com/content/3EumjoZascWd1oZiEgL8ORlv3qE/timeouts-retries-and-backoff-with-jitter ; https://platform.claude.com/docs/en/api/errors
   - Widget or lab: ApisRetryStorm
3. **Failing over between providers without changing behaviour** (`failover`, lesson, staff). Cross-provider failover changes tokenisation, tool-call formats, safety behaviour and output distribution at once, so it is a product change rather than a networking one. The lesson covers which errors should trigger failover, circuit breakers in gateways such as LiteLLM, per-route eligibility, and the eval gate a fallback model must pass. The reader writes the failover policy and the test that proves it does what it says.
   - Sources: https://docs.litellm.ai/docs/proxy/reliability ; https://platform.claude.com/docs/en/api/errors ; https://developers.openai.com/api/docs/guides/rate-limits

**Problems** (7; critique 1, code 1, debug 2, estimate 1, design 1, mcq 1; hard 4, medium 3)

- `api-018` (critique, hard, senior, new, Core 100) Review a retry and failover layer that retries every 429 and 5xx three times at the client, the gateway and the job runner, and fails over on the first timeout. Source: https://builder.aws.com/content/3EumjoZascWd1oZiEgL8ORlv3qE/timeouts-retries-and-backoff-with-jitter
- `api-002` (code, medium, senior, existing, Core 100) Retry a model call without making the outage worse: classify errors, honour retry-after, cap attempts with a shared retry budget; hidden tests inject spend-cap 429s. Source: https://platform.claude.com/docs/en/api/rate-limits
- `api-003` (debug, medium, senior, existing) A wall of 429s every morning at 9: separate the token-bucket cause from a red herring in the logs and propose the smallest fix. Source: https://platform.claude.com/docs/en/api/rate-limits
- `api-019` (estimate, hard, senior, new) Size per-tenant token buckets from input and output token limits and a measured cache hit rate, and say which tenant mix breaks the plan. Source: https://platform.claude.com/docs/en/api/rate-limits
- `api-020` (design, hard, staff, new) Design a model client library many teams will share: timeouts, retries, failover, idempotency and telemetry defaults, and which of them teams may override. Source: https://docs.litellm.ai/docs/proxy/reliability
- `api-021` (mcq, medium, senior, new) A request returns 429 with no retry-after header and an organisation spend-limit message: what should the client do? Source: https://platform.claude.com/docs/en/api/rate-limits
- `api-022` (debug, hard, staff, new) Time to first token is unchanged but p99 completion time doubled for long answers after an SDK upgrade; rank the hypotheses and state the measurement for each. Source: https://platform.claude.com/docs/en/build-with-claude/streaming

### apis/prompting: Prompts that survive model upgrades

Prompt structure that separates durable intent from model-specific workarounds, which techniques still pay on current models, and debugging prompt failures by slice.

**Lessons**

1. **Prompt structure that survives a model upgrade** (`prompt-structure`, lesson, senior). Prompts encode assumptions about one model's habits, so they should separate durable instructions from model-specific workarounds that must be re-tested on every upgrade. The lesson covers system versus user placement, delimiting untrusted data, examples as specification, and what current provider guides say changed between model generations. The reader can diff a prompt across two models and list the lines that need re-testing.
   - Sources: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices ; https://platform.claude.com/docs/en/api/migration-2026-10-21 ; https://arxiv.org/abs/2102.09690
   - Existing: `src/content/lessons/apis/prompting/overview.mdx` (split, primary). The five workflow patterns move to workflows/patterns; prompts-as-code and rollouts move to llmops/prompt-lifecycle; structure stays here.
2. **Few-shot, chain of thought and self-consistency: when each pays** (`reasoning-techniques`, lesson, senior). Each technique buys accuracy with tokens and latency, and reasoning models changed which ones still pay. The lesson covers chain-of-thought gains on non-reasoning models, the cost of each self-consistency vote, few-shot calibration effects, and tasks where explicit reasoning only adds latency. The reader prices a technique per request before adopting it.
   - Sources: https://arxiv.org/abs/2201.11903 ; https://arxiv.org/abs/2203.11171 ; https://arxiv.org/abs/2102.09690 ; https://platform.claude.com/docs/en/build-with-claude/thinking
3. **Debugging a prompt that fails in production** (`prompt-debugging`, lesson, senior). Production prompt failures cluster by input slice, so the method is trace sampling and error analysis rather than rewording. The lesson covers slicing by input features, reading near-tie logprobs, provider changes behind a model alias, and turning each confirmed failure into an eval case. The reader runs the loop from symptom to a gated fix.
   - Sources: https://hamel.dev/blog/posts/evals-faq/ ; https://arxiv.org/abs/2307.09009 ; https://applied-llms.org/

**Problems** (6; workflow 1, debug 1, concept 1, critique 1, estimate 1, design 1; hard 3, medium 3)

- `api-023` (workflow, hard, staff, new, Core 100, Crunch 4) Forty prompts, sixty days to a model retirement, twelve regressions on the new model: decide which ship degraded, which are rewritten and who signs off. Source: https://platform.claude.com/docs/en/about-claude/model-deprecations
- `api-004` (debug, medium, senior, existing) The same ticket gets different labels across runs: separate prompt ambiguity from sampling variance with the evidence you would request. Source: https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/
- `api-005` (concept, medium, senior, existing) Prompts as production code: versioning, review, tests and rollout, with the conflict between fast iteration and a regression gate. Source: https://applied-llms.org/
- `api-024` (critique, hard, senior, new) Critique a support-bot system prompt that mixes policy, persona, few-shot examples and three workarounds for an older model. Source: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices
- `api-025` (estimate, medium, senior, new) Self-consistency with five votes versus a reasoning model at medium effort: cost and latency per request for a stated workload, and which assumption flips the choice. Source: https://arxiv.org/abs/2203.11171
- `api-026` (design, hard, staff, new) Prompt chaining or one large prompt for contract review under a fixed latency budget: decide, and specify the gate between steps. Source: https://www.anthropic.com/engineering/building-effective-agents

### apis/structured-outputs: Structured outputs and tool calling

Which output guarantee each field needs, the tool-call protocol as a request your code may refuse, and evaluating tool use.

**Lessons**

1. **Strict schema, JSON mode, tool call or validate-and-repair** (`output-guarantees`, lesson, senior). Strict schema decoding guarantees a parse, JSON mode guarantees only syntax, and validate-and-repair works on any provider at the cost of retries. The lesson covers provider schema-feature limits, refusal handling inside structured responses, and bounded repair loops. The decision is made per field: which guarantee you need and what you log when it fails.
   - Sources: https://developers.openai.com/api/docs/guides/structured-outputs ; https://platform.claude.com/docs/en/build-with-claude/structured-outputs ; https://pydantic.dev/docs/validation/latest/concepts/json/
   - Existing: `src/content/lessons/apis/structured-outputs/overview.mdx` (rewrite, primary). Keep the provider comparison and repair loop; cut the vocabulary sections; add per-field guarantees.
2. **The tool-call protocol: the model proposes, your code disposes** (`tool-protocol`, lesson, senior). A tool call is a request your code may refuse, so validation, authorisation and idempotency belong in the executor rather than the prompt. The lesson covers parallel calls and ordering hazards, streamed tool inputs, error results returned to the model, and iteration caps. The reader writes an executor that is safe under retries and duplicate calls.
   - Sources: https://developers.openai.com/api/docs/guides/function-calling ; https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls ; https://www.anthropic.com/engineering/writing-tools-for-agents
3. **Evaluating tool calls: right tool, right arguments, right order** (`tool-evals`, lesson, senior). Tool-use accuracy decomposes into selection, argument correctness and sequencing, and each needs its own check. The lesson covers BFCL-style AST matching, executable checks, and end-state checks over multi-turn conversations as in tau-bench. The reader builds a tool-call eval for one internal API.
   - Sources: https://gorilla.cs.berkeley.edu/leaderboard.html ; https://arxiv.org/abs/2406.12045 ; https://arxiv.org/abs/2506.07982

**Problems** (6; concept 1, code 2, debug 1, critique 1, design 1; medium 3, hard 3)

- `api-006` (concept, medium, senior, existing) Guarantee valid structured output across two providers, one of which lacks strict schema support, and state the failure you still have to handle. Source: https://developers.openai.com/api/docs/guides/structured-outputs
- `api-008` (code, medium, senior, existing, Core 100) Write the tool-use loop with an iteration cap, error results returned to the model and duplicate-call protection; hidden tests inject failures. Source: https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls
- `api-009` (code, hard, senior, existing, Core 100) Assemble a streamed reply with interleaved text and tool-input deltas; the event rules are enforced by hidden tests, not listed in the question. Source: https://platform.claude.com/docs/en/build-with-claude/streaming
- `api-010` (debug, medium, senior, existing) Right tool, wrong arguments: diagnose from traces whether the cause is the description, the schema or the context, and fix the one that matters. Source: https://www.anthropic.com/engineering/writing-tools-for-agents
- `api-027` (critique, hard, senior, new) Rewrite a refund tool definition: naming, argument types, approval thresholds and error messages that tell the model what to do next. Source: https://www.kore1.com/ai-agent-engineer-interview-questions/
- `api-028` (design, hard, staff, new) Design the tool interface for a calendar agent used by three products, including how tools are versioned without breaking cached prompts. Source: https://www.anthropic.com/engineering/writing-tools-for-agents

### apis/context-engineering: Context and prompt caching

Provider prefix caching mechanics and what invalidates them, strategies for exceeding the window, and when a semantic cache is a correctness bug.

**Lessons**

1. **Prompt caching: prefix rules, breakpoints and what invalidates them** (`caching-mechanics`, lesson, senior). Provider caches match exact prefixes in a fixed order (tools, system, messages), so any change early in the prompt recomputes everything after it. The lesson covers breakpoints, minimum cacheable lengths, TTL refresh on use, cache-write premiums and current price tables for Anthropic, OpenAI and Gemini. The reader predicts a hit rate from a prompt layout and then measures it from usage fields.
   - Sources: https://platform.claude.com/docs/en/build-with-claude/prompt-caching ; https://developers.openai.com/api/docs/guides/prompt-caching ; https://ai.google.dev/gemini-api/docs/caching ; https://platform.claude.com/docs/en/about-claude/pricing
   - Widget or lab: ApisCachePrefix
   - Existing: `src/content/lessons/apis/context-engineering/overview.mdx` (rewrite, primary). Cut "context is a budget" and the four-moves list; keep cache mechanics, prices, cache breakers and the arithmetic; harness-specific caching moves to harness/cache-cost-latency.
2. **Long conversations: truncation, summaries, context editing and compaction** (`long-conversations`, lesson, senior). Every strategy for exceeding the window drops information, and the choice is which loss the task tolerates. The lesson covers clearing old tool results with context editing, server-side compaction, structured notes, and context rot as the reason a focused context answers better. The decision, per product, is what is pinned, summarised or dropped, and how recall of pinned facts is tested.
   - Sources: https://platform.claude.com/docs/en/build-with-claude/context-editing ; https://platform.claude.com/docs/en/build-with-claude/compaction ; https://www.trychroma.com/research/context-rot ; https://arxiv.org/abs/2307.03172 ; https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
3. **Semantic caching and when it is a correctness bug** (`semantic-cache`, lesson, senior). A semantic cache returns an answer written for a different question, so its similarity threshold is a precision decision with a cost per wrong hit. The lesson covers where it is safe (static FAQs), where it leaks (personalised or permissioned answers), and how cache entries are scoped. The reader sets a threshold from labelled near-duplicate pairs and states the leak it must never allow.
   - Sources: https://redis.io/docs/latest/develop/ai/context-engine/langcache/concepts/ ; https://arxiv.org/abs/2502.07776

**Problems** (7; code 2, estimate 2, mcq 1, design 1, debug 1; hard 3, medium 4)

- `api-029` (code, hard, senior, new, Core 100) Model a provider's prefix cache from its documentation (prefix order, breakpoints, lookback, TTL refresh, minimum length) and predict hits for a request trace. Source: https://platform.claude.com/docs/en/build-with-claude/prompt-caching
- `api-013` (code, medium, senior, existing) Token-budget allocator across system prompt, history and retrieved documents with priorities and pinned items; hidden tests check invariants, not one output. Source: https://getperspective.ai/blog/anthropic-applied-ai-engineer-interview-process-frontier-lab-2026/markdown. Reported: Anthropic (reported phone-screen task via a commercial blog)
- `api-012` (estimate, medium, senior, existing) What prompt caching saves per day for a stated assistant, including cache-write premiums and the TTL's effect on idle tenants. Source: https://platform.claude.com/docs/en/about-claude/pricing
- `api-011` (mcq, medium, senior, existing) Which change keeps the prompt cache warm: reordering tools, adding a timestamp to the system prompt, appending a message, or editing an early example? Source: https://platform.claude.com/docs/en/build-with-claude/prompt-caching
- `api-014` (design, hard, senior, existing) The assistant forgets after ten turns; redesign context handling when a user deletion request and the cache cost pull in opposite directions. Source: https://platform.claude.com/docs/en/build-with-claude/context-editing
- `api-015` (estimate, medium, senior, existing) How many agent steps fit under a $2 cap with and without a warm cache, given stated token growth per step. Source: https://platform.claude.com/docs/en/about-claude/pricing
- `api-030` (debug, hard, staff, new) Cache hit rate fell to near zero after a release; the diff added a request id to the system prompt and reordered tools, and only one of them explains the drop. Source: https://platform.claude.com/docs/en/build-with-claude/prompt-caching

### apis/frameworks: Frameworks, SDKs and what to own

Which abstractions you are willing to debug in production, building or renting the agent harness, and what frameworks hide.

**Lessons**

1. **Playbook: framework, agent SDK or plain code** (`framework-playbook`, playbook, senior). The decision is which abstractions you are willing to debug at 2 a.m. The inputs are the need for checkpoints and interrupts (LangGraph), the provider coupling of agent SDKs, team familiarity and the cost of leaving. The playbook works a stated case and ends with what to measure after deciding: time to debug a failed run and the amount of glue code.
   - Sources: https://www.langchain.com/blog/langchain-langgraph-1dot0 ; https://openai.github.io/openai-agents-python/ ; https://code.claude.com/docs/en/agent-sdk/overview ; https://vercel.com/blog/ai-sdk-7
   - Existing: `src/content/lessons/apis/frameworks/overview.mdx` (split, primary). Build-versus-rent harness becomes its own lesson; low-code tools move to workflows/operating-workflows.
2. **Build or rent the agent harness** (`build-vs-rent-harness`, lesson, staff). Agent SDKs, hosted agent platforms and a hand-written loop differ in who owns the session log, sandbox, credentials and upgrades. The lesson compares the Claude Agent SDK, Claude Managed Agents, the OpenAI Agents SDK and your own loop on what each makes hard to change later. The reader writes the build-versus-rent memo for a regulated enterprise.
   - Sources: https://code.claude.com/docs/en/agent-sdk/overview ; https://www.anthropic.com/engineering/managed-agents ; https://openai.github.io/openai-agents-python/ ; https://github.com/ombharatiya/ai-system-design-guide/blob/main/00-interview-prep/01-question-bank.md
3. **What frameworks hide: a chain, router and retriever in plain code** (`framework-internals`, lesson, senior). Rebuilding a framework's core in a few hundred lines shows which parts are glue and which are hard (state, retries, streaming). The lesson compares LangChain agents, LangGraph state graphs and DSPy modules with plain code doing the same work. The reader can debug an opaque chain by knowing what it must be doing underneath.
   - Sources: https://docs.langchain.com/oss/python/langchain/agents ; https://docs.langchain.com/oss/python/langgraph/graph-api ; https://arxiv.org/abs/2310.03714

**Problems** (6; design 2, concept 1, debug 1, code 1, critique 1; hard 3, medium 3)

- `api-016` (design, hard, staff, existing) Add a second provider without surprising users, with a 60-day retirement deadline on the first provider's model. Source: https://docs.litellm.ai/docs/proxy/reliability
- `api-017` (concept, medium, senior, existing) Would you use LangChain for this production service? Defend either answer against a reviewer who has been paged by it. Source: https://www.langchain.com/blog/langchain-langgraph-1dot0
- `api-031` (design, hard, staff, new) A regulated enterprise wants to stop running its own agent loop: make the build-versus-rent call on hosted agent platforms with the controls it must keep. Source: https://github.com/ombharatiya/ai-system-design-guide/blob/main/00-interview-prep/01-question-bank.md
- `api-032` (debug, hard, senior, new) After a framework upgrade long agent runs end early with no error; find the changed default (recursion limit) among several plausible causes. Source: https://github.com/langchain-ai/langgraph/blob/main/libs/langgraph/langgraph/_internal/_config.py
- `api-033` (code, medium, senior, new) Rebuild a minimal router plus retriever without a framework; hidden tests check routing decisions and retrieval results. Source: https://www.anthropic.com/engineering/building-effective-agents
- `api-034` (critique, medium, senior, new) Critique a proposal to adopt three frameworks in one product (an orchestration library, a RAG library and an agent SDK). Source: https://www.langchain.com/blog/langchain-langgraph-1dot0

## 3. Evals and observability (`evals`)

Evaluation as an operating discipline: error analysis and the labelling operation, golden sets that expose known failures, judges validated like classifiers, agent evaluation over repeated trials, and merge gates with statistics that survive review. Evals stays third because it is the most rewarded skill and the one the other tracks depend on. Release experiments and drift live in the llmops track; harness attribution lives in the harness track.

### evals/eval-thinking: Error analysis and the labelling operation

Failure modes come from traces; labels are a production process with throughput and drift; instrumentation decides what can be analysed later.

**Lessons**

1. **Error analysis: open coding, axial coding and saturation** (`error-analysis`, lesson, senior). Evals start from failure modes found in traces, not from metrics chosen in advance. The lesson covers reading at least 100 traces, open then axial coding, binary labels per failure mode, and the rule of labelling the first upstream failure. The reader turns 100 traces into a ranked failure taxonomy with counts.
   - Sources: https://hamel.dev/blog/posts/evals-faq/ ; https://hamel.dev/blog/posts/evals/ ; https://arxiv.org/abs/2404.12272
   - Widget or lab: EvalsSaturation
   - Existing: `src/content/lessons/evals/eval-thinking/overview.mdx` (rewrite, primary). Keep the OpenTelemetry section and the first-upstream-failure rule; replace the rest with the labelling-operation material (level audit 5.1).
2. **Running the labelling operation: who labels, how often, and how you know they agree** (`labelling-operation`, lesson, staff). Labels are a production process with throughput, agreement and drift, and Shankar et al. show reviewers' criteria shift as they see more outputs. The lesson covers dev and test splits per label, inter-rater agreement, expert time budgets and rotating what gets labelled. The reader designs a six-week labelling programme for a few expert hours a week and states what it refuses to gate.
   - Sources: https://hamel.dev/blog/posts/evals-faq/ ; https://arxiv.org/abs/2404.12272 ; https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents
   - Widget or lab: lab:error-analysis
3. **Instrumentation: GenAI spans, what to log and what never to log** (`instrumentation`, lesson, senior). The OpenTelemetry GenAI conventions define model, agent and tool spans with token and cache attributes, and mark message content opt-in because it is personal data. The lesson covers what every call must log (resolved model id, prompt version, tokens, cost, latency, tool calls), sampling, and redaction. The decision is the content-capture policy per environment, written down before an incident forces it.
   - Sources: https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/README.md ; https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/gen-ai-spans.md ; https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/gen-ai-agent-spans.md

**Problems** (6; workflow 1, debug 1, estimate 1, behavioural 1, code 1, critique 1; hard 4, medium 2)

- `evl-019` (workflow, hard, staff, new, Core 100) Build the labelling operation for a support assistant: label set, splits, agreement checks and a six-week plan for four expert hours a week. Source: https://hamel.dev/blog/posts/evals-faq/
- `evl-001` (debug, medium, senior, existing, Core 100) A 95% eval pass rate and angry users: list what you would pull to explain the gap before looking at any provided evidence. Source: https://hamel.dev/blog/posts/evals-faq/
- `evl-002` (estimate, medium, senior, existing) What 82 passes out of 100 does and does not tell you: the interval, and the sample size for a decision you can defend. Source: https://arxiv.org/abs/2411.00640
- `evl-018` (behavioural, hard, staff, existing) Show me an eval you built, then defend it against a reviewer who says it measured the wrong thing. Source: https://hamel.dev/blog/posts/evals-faq/
- `evl-020` (code, hard, senior, new) Reconstruct a hierarchical trace from a stream of span events that arrive out of order, with missing parents. Source: https://www.techinterview.org/companies/langchain/. Reported: LangChain (candidate report via techinterview.org)
- `evl-021` (critique, hard, senior, new) Critique a failure taxonomy with dozens of overlapping categories, Likert scores and no counts. Source: https://hamel.dev/blog/posts/evals-faq/

### evals/golden-sets: Golden sets and metrics

Golden sets as designed samples, metric choice by question, and why public benchmarks stop meaning anything.

**Lessons**

1. **Building a golden set: sourcing, stratification and coverage** (`golden-set-construction`, lesson, senior). A golden set is a sample designed to expose known failure modes, so it is stratified by intent and outcome rather than drawn uniformly. The lesson covers sampling from production, synthetic cases with a filter, code assertions as level-one checks, and versioning the set with its scores. The reader builds a 20-question set for a contract assistant and defends each slice.
   - Sources: https://hamel.dev/blog/posts/evals-faq/ ; https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents ; https://applied-llms.org/
   - Existing: `src/content/lessons/evals/golden-sets/overview.mdx` (split, primary). Curation from production logs moves to llmops/data-curation; contamination becomes its own lesson.
2. **Retrieval and answer metrics: which one answers which question** (`metric-choice`, lesson, senior). Recall@k, MRR and NDCG measure retrieval, faithfulness and answer relevance measure generation, and judge-based metrics inherit the judge's noise. The lesson covers RAGAS definitions and their assumptions, binary pass criteria, and the cases where a metric hides the failure. The decision is the minimum metric set for a RAG release.
   - Sources: https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/faithfulness/ ; https://arxiv.org/abs/2309.15217 ; https://arxiv.org/abs/2104.08663
3. **Contamination and benchmarks that stop meaning anything** (`contamination`, lesson, senior). Public benchmarks leak into training data and get optimised against, so scores rise without capability rising. The lesson covers Lee et al.'s finding that over 4% of standard validation sets overlapped training data, OpenAI's reasons for no longer reporting SWE-bench Verified, and how to keep a private set private. The reader can say what a vendor's benchmark gain does and does not prove.
   - Sources: https://arxiv.org/abs/2107.06499 ; https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/ ; https://arxiv.org/abs/2107.03374

**Problems** (6; design 1, debug 1, concept 1, estimate 1, critique 1, workflow 1; medium 3, hard 3)

- `evl-004` (design, medium, senior, existing) Turn 100,000 conversations into a 500-case eval set: strata, dedup, labels and what you leave out. Source: https://www.techinterview.org/post/3233475313/interviewing-ai-eval-engineering-roles-2026/
- `evl-005` (debug, medium, senior, existing) Better on every benchmark, worse for users: rank the explanations and the one measurement that separates them. Source: https://arxiv.org/abs/2107.06499
- `evl-006` (concept, medium, senior, existing) Faithfulness, answer relevancy, context precision and recall: which one would have caught each of four described failures. Source: https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/faithfulness/
- `evl-022` (estimate, hard, senior, new, Core 100) Size the suite to detect a three-point regression with a paired test, choosing the power and the flip rate you assume. Source: https://arxiv.org/abs/2411.00640
- `evl-023` (critique, hard, senior, new) Critique a golden set of 500 synthetic questions generated by the model under test and graded by the same model. Source: https://hamel.dev/blog/posts/evals-faq/
- `evl-024` (workflow, hard, staff, new) Keep a golden set fresh while the product changes monthly: refresh cadence, retirement rules and comparable scores across versions. Source: https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents

### evals/llm-judge: LLM-as-judge, calibrated

Judges validated like classifiers, their measurable biases, and when a human or a code check is cheaper.

**Lessons**

1. **Validating a judge: TPR, TNR and the corrected pass rate** (`judge-validation`, lesson, senior). A judge is a classifier, so it is trusted by its true positive and true negative rates on human labels, not by raw agreement. The lesson covers the correction formula from judgy and its precondition, validation-set sizes, and re-validation when the judge prompt or model changes. The reader corrects an observed pass rate and gives its interval.
   - Sources: https://github.com/ai-evals-course/judgy ; https://hamel.dev/blog/posts/llm-judge/ ; https://hamel.dev/blog/posts/evals-faq/
   - Widget or lab: EvalsJudgeMatrix
   - Existing: `src/content/lessons/evals/llm-judge/overview.mdx` (rewrite, primary). Cut the predict block and TPR/TNR definitions; keep bias tests, the correction with its precondition, pairwise versus pointwise and when not to use a judge.
2. **Judge biases and the tests that expose them** (`judge-biases`, lesson, senior). Position, length and self-preference biases are measurable with swapped and controlled pairs. The lesson covers Zheng et al.'s bias tests, the self-preference evidence, and Tripathi et al.'s comparison of pairwise and pointwise judging. The decision is pairwise or pointwise for a given release question.
   - Sources: https://arxiv.org/html/2306.05685v4 ; https://arxiv.org/abs/2404.13076 ; https://arxiv.org/abs/2504.14716
3. **Playbook: human, code check or judge** (`check-playbook`, playbook, senior). Each check type has a cost per item and an error profile, and the cheapest check that catches the failure wins. The inputs are how deterministic the failure is, label cost, volume and required precision. The playbook works a support bot with three failure modes and ends with what to measure after deciding.
   - Sources: https://hamel.dev/blog/posts/evals-faq/ ; https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents

**Problems** (6; concept 1, mcq 1, code 1, critique 1, debug 1, estimate 1; hard 3, medium 3)

- `evl-007` (concept, hard, senior, existing) Can you trust your LLM judge? Answer, then respond to pushback that the vendor reports 92% agreement with humans. Source: https://github.com/ai-evals-course/judgy
- `evl-008` (mcq, medium, senior, existing) The pairwise judge prefers prompt A; which control experiment rules out position bias? Source: https://arxiv.org/html/2306.05685v4
- `evl-009` (code, medium, senior, existing, Core 100, Crunch 11) Score the judge against human labels, then correct the observed pass rate with an interval; hidden tests vary base rates. Source: https://github.com/ai-evals-course/judgy
- `evl-025` (critique, hard, senior, new, Core 100) Critique a judge validation report that quotes raw agreement on a set where failures are rare, with no TNR. Source: https://github.com/ai-evals-course/judgy
- `evl-026` (debug, hard, staff, new) The judge agrees with humans 92% of the time yet failures slip through to production; explain from base rates and decide what to change first. Source: https://github.com/ai-evals-course/judgy
- `evl-027` (estimate, medium, senior, new) How many labelled examples to estimate a judge's TNR within a stated interval when failures are a small share of traffic. Source: https://github.com/ai-evals-course/judgy

### evals/agent-evals: Evaluating agents

Outcome, trajectory and state grading, reliability over repeated trials, and what public agent benchmarks can and cannot tell you.

**Lessons**

1. **Grading agents: outcome, trajectory and state** (`agent-grading`, lesson, senior). Agent evals grade the end state where possible and the path only where the path is itself the requirement. The lesson covers tau-bench's database-state checks, tau2's dual-control setting, trajectory checks for forbidden actions, and cost as part of the score. The reader designs an eval for a customer-service agent that can refund money.
   - Sources: https://arxiv.org/abs/2406.12045 ; https://arxiv.org/abs/2506.07982 ; https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents
   - Existing: `src/content/lessons/evals/agent-evals/overview.mdx` (split, primary). Harness-versus-model attribution moves to harness/evaluating-harnesses; grading and benchmarks stay.
2. **pass@k versus pass^k: reliability over repeated trials** (`pass-hat-k`, lesson, senior). pass@k rewards one success in k tries while pass^k demands success on all k, and production agents live on pass^k. The lesson covers tau-bench's published drop (pass^8 under 25% in retail for the strongest model at publication), how many trials to run, and confidence on small task sets. The reader computes both and decides which one a release gate uses.
   - Sources: https://arxiv.org/abs/2406.12045 ; https://arxiv.org/abs/2107.03374
   - Widget or lab: EvalsPassK
3. **Public agent benchmarks: what each measures and how it fails** (`agent-benchmarks`, lesson, senior). SWE-bench Verified, SWE-bench Pro, Terminal-Bench 2.0, GAIA, WebArena, OSWorld and BrowseComp each measure a narrow slice under a particular harness and infrastructure. The lesson covers OpenAI's audit (59.4% of 138 audited hard problems with material issues) and its decision to stop reporting Verified, plus contamination. The reader can explain why an agent that wins on SWE-bench fails on their own repository.
   - Sources: https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/ ; https://arxiv.org/abs/2509.16941 ; https://arxiv.org/abs/2601.11868 ; https://arxiv.org/abs/2311.12983 ; https://arxiv.org/abs/2307.13854 ; https://arxiv.org/abs/2404.07972 ; https://arxiv.org/abs/2504.12516

**Problems** (6; estimate 1, debug 1, concept 2, code 1, design 1; medium 4, hard 2)

- `evl-010` (estimate, medium, senior, existing, Core 100) pass^4 from three flaky tasks with stated per-trial success rates, and the number of trials needed to trust it. Source: https://arxiv.org/abs/2406.12045
- `evl-011` (debug, medium, senior, existing) Zero out of a hundred after a harness change: separate an infrastructure fault from a capability drop. Source: https://www.anthropic.com/engineering/infrastructure-noise
- `evl-012` (concept, hard, staff, existing, Core 100) Evaluating a coding agent for your repositories, with pushback on why SWE-bench numbers do not transfer. Source: https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/
- `evl-016` (code, medium, senior, existing) Find where agent runs break: a trajectory grader over recorded runs that flags forbidden actions and first failing steps. Source: https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents
- `evl-028` (design, hard, staff, new) Evaluate a customer-service agent that can issue refunds: state checks, policy violations, pass^k and cost per resolved task. Source: https://arxiv.org/abs/2506.07982
- `evl-029` (concept, medium, senior, new) A vendor shows a three-point SWE-bench Verified gain for its new harness: what does it tell you, and what would you ask for? Source: https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/

### evals/evals-in-ci: Gates, online evals and success metrics

Merge gates with the right statistics, what runs inline versus sampled, and success metrics that do not reward agreeable answers.

**Lessons**

1. **Eval gates in CI: hard, statistical and report-only** (`merge-gates`, lesson, senior). A merge gate must separate must-pass cases from statistical checks, because a paired flip test is the right tool for the second and the wrong one for the first. The lesson covers exact sign tests on flipped cases, gate tiers, eval cost control, and the tooling landscape after OpenAI's acquisition of Promptfoo. The reader writes the gate policy for a prompt repository.
   - Sources: https://arxiv.org/abs/2411.00640 ; https://www.promptfoo.dev/docs/integrations/ci-cd/ ; https://openai.com/index/openai-to-acquire-promptfoo/ ; https://hamel.dev/blog/posts/evals-faq/
   - Widget or lab: EvalsFlipGate
   - Existing: `src/content/lessons/evals/evals-in-ci/overview.mdx` (split, primary). A/B design, release ladders and drift move to llmops; gates, online evals and metrics stay.
2. **Online evals: sampled judges, guardrails and evaluators** (`online-evals`, lesson, senior). Online evaluation samples live traffic for judges that run after the fact, while guardrails act inline and pay latency on every request. The lesson covers sampling rates, judge drift, privacy limits on reading traffic, and the quality probes Anthropic added after its 2025 three-bug postmortem. The decision is what runs inline, what runs sampled and what runs nightly.
   - Sources: https://docs.langchain.com/langsmith/online-evaluations ; https://www.anthropic.com/engineering/a-postmortem-of-three-recent-issues ; https://hamel.dev/blog/posts/evals-faq/
3. **Success metrics for a probabilistic feature** (`success-metrics`, lesson, staff). An AI feature needs one outcome metric, guardrail metrics and a cost metric, because engagement metrics reward agreeable answers. The lesson uses the GPT-4o sycophancy rollback and METR's finding that developers felt faster while measured slower as counter-examples to satisfaction-only metrics. The reader defines the metric set for a support assistant and names its owner.
   - Sources: https://simonwillison.net/2025/May/2/what-we-missed-with-sycophancy/ ; https://arxiv.org/abs/2507.09089 ; https://arxiv.org/abs/2205.06537

**Problems** (6; design 2, estimate 1, workflow 1, debug 1, critique 1; hard 6)

- `evl-013` (design, hard, staff, existing, Core 100) Design an eval pipeline that gates prompt and model changes, then defend it when the gate blocks a release the CEO wants. Source: https://arxiv.org/abs/2411.00640
- `evl-014` (estimate, hard, senior, existing) Is the regression real? Decide from paired flip counts with the hints removed, and say what you would do at the boundary. Source: https://arxiv.org/abs/2411.00640
- `evl-015` (design, hard, staff, existing) Success metrics for an AI feature when resolution and re-contact rates move in opposite directions. Source: https://simonwillison.net/2025/May/2/what-we-missed-with-sycophancy/
- `evl-030` (workflow, hard, staff, new) Eval cost control under a fixed monthly budget: which suites run per PR, nightly and pre-release, and what you stop running. Source: https://hamel.dev/blog/posts/evals-faq/
- `evl-031` (debug, hard, senior, new) Offline quality improved and production quality fell after a release: rank the causes and the first measurement for each. Source: https://prachub.com/resources/llm-evaluation-interview-questions-evals-llm-as-judge-drift-and-production-quality
- `evl-032` (critique, hard, staff, new) Critique a launch plan that ships on positive offline evals and a positive A/B test while expert testers say the model feels off. Source: https://simonwillison.net/2025/May/2/what-we-missed-with-sycophancy/

## 4. AI workflows and durable execution (`workflows`)

How to design and run AI workflows in production, for engineers who already ship distributed systems: the workflow-or-agent decision, the five patterns as code, durable execution engines and how each one replays, changing code while runs are in flight, retries and idempotency when a step is a metered non-deterministic model call, approvals as a security boundary, batch stages, queues and per-step budgets, workflow tracing, replay testing, low-code tools and their licences, and back-office case studies from Uber, Instacart, Grab, Airbnb and Duolingo. It answers the owner's question "how do I create an AI workflow" directly and sits before agents because most production systems are workflows with model steps.

### workflows/patterns: Workflow or agent, and which pattern

Who owns control flow for each step, the five patterns written as code with their failure modes, and explicit state machines for model pipelines.

**Lessons**

1. **Playbook: workflow or agent** (`workflow-or-agent`, playbook, senior). The decision is who owns control flow for each step: code, or the model. Anthropic defines workflows as orchestrated through predefined code paths and agents as directing their own process, and OpenAI's guide gives three conditions under which an agent earns its place; the inputs are whether steps can be drawn in advance, reversibility, unstructured judgement, wait time and cost per run. The worked case is vendor-invoice intake with a refund branch, followed by what to measure: share of inputs that leave the happy path, cost per item and human-review rate.
   - Sources: https://www.anthropic.com/engineering/building-effective-agents ; https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf ; https://github.com/humanlayer/12-factor-agents
   - Existing: `src/content/lessons/apis/prompting/overview.mdx` (split, receives-content). The prompting lesson's "one big prompt or a chain" section and five-pattern paragraph move here and into five-patterns.
2. **The five patterns as code, with their failure modes** (`five-patterns`, lesson, senior). Prompt chaining, routing, parallelisation, orchestrator-workers and evaluator-optimiser each fit in a few dozen lines against a mock model, and each has its own failure mode and cost arithmetic. Chains add latency and are only better than one prompt when a gate sits between steps; a router's confusion matrix becomes the system's error floor; orchestrator plans are model output that needs the same validation as a tool call, at roughly 15 times chat tokens in Anthropic's research system. The reader picks a pattern for a stated system and computes its end-to-end success, latency and cost.
   - Sources: https://www.anthropic.com/engineering/building-effective-agents ; https://www.anthropic.com/engineering/multi-agent-research-system
   - Widget or lab: new:PatternSandbox
3. **State machines and DAGs for model pipelines** (`state-machines`, lesson, senior). Explicit states, transitions guarded by deterministic validation, per-state retry limits and a terminal needs-human state turn a model pipeline into something you can operate. Airbnb's test migration moved each file through refactor, fix tests, fix lint and types, advancing only when validation passed, reaching 75% in four hours and 97% after four days of tuning with the rest done by hand. The lesson contrasts state machines with DAG schedulers (topological order, fan-in, partial branch failure) and teaches Airbnb's sample, tune and sweep loop.
   - Sources: https://airbnb.tech/?p=366 ; https://prachub.com/interview-questions/design-a-streaming-job-scheduler

**Problems** (7; workflow 1, concept 1, estimate 1, code 1, design 1, behavioural 1, critique 1; hard 4, medium 3)

- `wfl-001` (workflow, hard, senior, new, Core 100, Crunch 5) Vendor-invoice intake with a refund branch and a two-day approval: steps, which steps are model calls, gates, idempotency keys, timeout behaviour, budgets and review routing. Source: https://www.anthropic.com/engineering/building-effective-agents
- `wfl-002` (concept, medium, senior, new) Pick chain, router, parallel, orchestrator-workers or evaluator-optimiser for three stated systems and give the failure mode of each choice. Source: https://www.anthropic.com/engineering/building-effective-agents
- `wfl-003` (estimate, medium, senior, new) End-to-end success, latency and cost of a six-step chain versus a router with two parallel branches, from stated per-step error rates and latencies. Source: https://www.anthropic.com/engineering/building-effective-agents
- `wfl-004` (code, hard, senior, new) Scheduler for tasks with deadlines and prerequisites: earliest deadline first, never lease a task to two workers, survive a worker crash. Source: https://prachub.com/interview-questions/design-a-streaming-job-scheduler. Reported: Scale AI (candidate report via PracHub)
- `wfl-005` (design, hard, staff, new) An agentic workflow that generates a one-hour movie: orchestration, state for continuity, quality gates and failure handling. Source: https://prachub.com/interview-questions/design-agentic-workflow-to-generate-a-1-hour-movie. Reported: xAI (candidate report via PracHub)
- `wfl-006` (behavioural, hard, staff, new) Your migration pipeline succeeds on 75% of files in the first sweep; how do you get the long tail, and when do you stop automating? Source: https://airbnb.tech/?p=366
- `wfl-007` (critique, medium, senior, new) Critique an evaluator-optimiser loop with no iteration cap in which the critic is the generator grading its own output. Source: https://www.anthropic.com/engineering/building-effective-agents

### workflows/durable-execution: Durable execution engines

How engines resume after a crash, the three meanings of replay, determinism and versioning while runs are in flight, and sagas for steps that cannot be undone.

**Lessons**

1. **How durable execution engines actually resume** (`replay-engines`, lesson, senior). Temporal re-runs workflow code against recorded results, Inngest re-runs the handler and returns memoised step results, DBOS checkpoints each step into Postgres, and Lambda durable functions, Restate, Cloudflare Workflows and the Workflow SDK each keep a log; LangGraph instead checkpoints per super-step and re-executes nodes after a checkpoint on time travel, including model calls, and Inngest's bulk Replay creates new executions. The common contract is that a step can run more than once, its saved result wins once it exists, and anything external needs a key. The reader can say where each engine stores state, what it costs per step and what replay means on each.
   - Sources: https://docs.temporal.io/workflow-definition ; https://www.inngest.com/docs/learn/how-functions-are-executed ; https://docs.dbos.dev/architecture ; https://docs.aws.amazon.com/lambda/latest/dg/durable-basic-concepts.html ; https://docs.restate.dev/concepts/durable_execution ; https://developers.cloudflare.com/workflows/build/rules-of-workflows/ ; https://workflow-sdk.dev/docs/foundations/workflows-and-steps ; https://docs.langchain.com/oss/python/langgraph/use-time-travel ; https://www.inngest.com/docs/platform/replay
   - Widget or lab: new:ReplayVsReexecute
   - Existing: `src/content/lessons/agents/memory-state/overview.mdx` (split, receives-content). The durable-execution section (engines, Temporal determinism, Inngest memoised steps, the AgentsResume simulator) moves here; memory stays in agents; memory files move to harness.
2. **Determinism and changing code while runs are in flight** (`determinism-versioning`, lesson, staff). Reordering activities, reading the clock or random outside replay-safe APIs, or swapping a timer for an activity makes running workflows fail on replay, which is why model calls must be activities and deploys need a versioning plan. The lesson covers Temporal patching, Worker Versioning, new workflow type names, continue-as-new before the event-history limit, and Anthropic's rainbow deployments for long-running agents. The reader can ship a prompt and tool change while thousands of runs are mid-flight.
   - Sources: https://docs.temporal.io/workflow-definition ; https://docs.temporal.io/develop/python/workflows/versioning ; https://docs.temporal.io/workflow-execution/continue-as-new ; https://temporal.io/blog/of-course-you-can-build-dynamic-ai-agents-with-temporal ; https://www.anthropic.com/engineering/multi-agent-research-system
3. **Sagas and compensation for steps that cannot be undone** (`sagas`, paper, staff). Garcia-Molina and Salem split a long-lived transaction into steps with compensating actions so partial progress can be undone without holding locks. Model-driven workflows call external systems that share no transaction, and some actions (an email, a payout) can only be compensated or gated before they happen. The walkthrough covers forward and backward recovery, compensation order, and what to say when a step has no compensation: put the approval before it.
   - Sources: https://doi.org/10.1145/38713.38742 ; https://docs.dbos.dev/python/tutorials/workflow-tutorial

**Problems** (7; debug 2, concept 3, design 1, code 1; hard 5, medium 2)

- `wfl-008` (debug, hard, senior, new, Core 100, Crunch 12) After a deploy a share of running workflows fail with a non-determinism error; the diff swapped a timer and an activity among other harmless changes. Find it and ship the change safely. Source: https://docs.temporal.io/workflow-definition
- `wfl-009` (concept, medium, senior, new) You replay a LangGraph run from a checkpoint and the model answers differently: bug or expected, and how do you get a reproducible replay? Source: https://docs.langchain.com/oss/python/langgraph/use-time-travel
- `wfl-010` (debug, hard, senior, new) After a fix you bulk-replay 3,000 failed runs; what can repeat, and what do you check before pressing the button? Source: https://www.inngest.com/docs/platform/replay
- `wfl-011` (concept, medium, senior, new) A long-lived agent workflow approaches its event-history limit: what do you carry over with continue-as-new and what do you drop? Source: https://docs.temporal.io/workflow-execution/continue-as-new
- `wfl-012` (design, hard, staff, new) Thousands of agent runs are mid-flight when you must ship a new prompt and a new tool: design the deploy. Source: https://www.anthropic.com/engineering/multi-agent-research-system
- `wfl-013` (code, hard, senior, new) A timeout refund workflow that is deterministic and safe to retry against an external payment API; hidden tests crash it at every boundary. Source: https://prachub.com/coding-questions/implement-timeout-refund-workflow. Reported: DoorDash (candidate report via PracHub)
- `wfl-014` (concept, hard, staff, new) A step must send an email that cannot be undone; structure the workflow so a later failure leaves the system consistent. Source: https://doi.org/10.1145/38713.38742

### workflows/retries-flow-control: Retries, queues and per-step budgets

Where retries live when a step is a model call, admission control in front of a shared provider quota, and budgets per step rather than per run.

**Lessons**

1. **Idempotency and retries when a step is a model call** (`retries-model-steps`, lesson, senior). At-least-once steps plus idempotent effects give exactly-once outcomes, but a retried model call returns a different output, and five layers of three retries put 243 times the load on a failing dependency. The lesson covers retry placement and retry budgets, non-retryable errors (a Claude spend-cap 429 has no retry-after), Temporal's default policy of unlimited attempts, start-to-close timeouts, and idempotency keys derived from run and step rather than per attempt. The reader records a model output once, treats it as the step result, and knows when a Stripe key outlives its window.
   - Sources: https://builder.aws.com/content/3EumjoZascWd1oZiEgL8ORlv3qE/timeouts-retries-and-backoff-with-jitter ; https://docs.temporal.io/encyclopedia/retry-policies ; https://docs.temporal.io/encyclopedia/detecting-activity-failures ; https://docs.stripe.com/api/idempotent_requests ; https://platform.claude.com/docs/en/api/rate-limits ; https://developers.openai.com/api/docs/guides/flex-processing
2. **Queues, backpressure and flow control for model work** (`queues-backpressure`, lesson, senior). The provider's token bucket is the shared bottleneck, so a workflow needs admission control in front of it. The lesson covers alarming on the age of the oldest message rather than depth, per-tenant isolation with separate queues or shuffle sharding, dead-letter queues that page someone, heartbeats for long steps, Inngest's flow-control vocabulary, and n8n queue mode. Grab's classification pipeline is the worked case: mini-batches through a queue with a workflow-level rate limiter because every deployment shared one tokens-per-minute quota.
   - Sources: https://builder.aws.com/content/3EuRcgkTP1MI0c7zM8W6HL3WIqA/avoiding-insurmountable-queue-backlogs ; https://www.inngest.com/docs/guides/flow-control ; https://docs.n8n.io/hosting/scaling/queue-mode/ ; https://platform.claude.com/docs/en/api/rate-limits ; https://engineering.grab.com/llm-powered-data-classification
3. **Playbook: cost and latency budgets per step** (`step-budgets`, playbook, senior). Per-run caps exist on most platforms; per-step budgets are what keep one slow or expensive step from eating the run. Each step gets a token budget, a timeout read from a latency percentile at a chosen false-timeout rate, a retry budget and a model tier, and a cascade pays only where Instacart found it did (a cheaper model matched quality on simpler attributes and lost accuracy on difficult ones). The worked case costs a three-step extraction pipeline with a review queue per document, every assumption labelled, including prompt growth in retry loops as Airbnb saw.
   - Sources: https://builder.aws.com/content/3EumjoZascWd1oZiEgL8ORlv3qE/timeouts-retries-and-backoff-with-jitter ; https://company.instacart.com/tech-innovation/scaling-catalog-attribute-extraction-with-multi-modal-llms ; https://airbnb.tech/?p=366 ; https://platform.claude.com/docs/en/build-with-claude/batch-processing

**Problems** (7; estimate 2, mcq 1, design 2, critique 1, workflow 1; medium 2, hard 5)

- `wfl-015` (estimate, medium, senior, new, Core 100) Five service layers each retry three times while the model provider is down: what load reaches the provider, and where should retries live? Source: https://builder.aws.com/content/3EumjoZascWd1oZiEgL8ORlv3qE/timeouts-retries-and-backoff-with-jitter
- `wfl-016` (mcq, medium, senior, new) Your activity uses the default Temporal retry policy and a step sends a malformed prompt the provider rejects with a 400: what happens? Source: https://docs.temporal.io/encyclopedia/retry-policies
- `wfl-017` (design, hard, staff, new, Core 100) Fifty tenants share one provider quota; design admission control so one tenant's backfill does not starve the others. Source: https://builder.aws.com/content/3EuRcgkTP1MI0c7zM8W6HL3WIqA/avoiding-insurmountable-queue-backlogs
- `wfl-018` (critique, hard, senior, new) Critique a workflow that generates a fresh UUID idempotency key inside the retried step for a payment call. Source: https://docs.stripe.com/api/idempotent_requests
- `wfl-019` (workflow, hard, staff, new) Cap a customer's spend mid-trace and bill a trace whose cost is unknown until it finishes. Source: https://www.techinterview.org/post/3233474928/ai-agent-infrastructure-interview/
- `wfl-020` (design, hard, senior, new) A feature calling a hosted model: separate transient from deterministic failures, validate in ordered checks, define the failure path, then handle a 3x cost overrun. Source: https://prachub.com/interview-questions/design-an-llm-api-pipeline. Reported: Scale AI (candidate report via PracHub)
- `wfl-021` (estimate, hard, senior, new) Set per-step timeouts for a three-step extraction from latency percentiles at a chosen false-timeout rate, and show what the retries do to the end-to-end p99. Source: https://builder.aws.com/content/3EumjoZascWd1oZiEgL8ORlv3qE/timeouts-retries-and-backoff-with-jitter

### workflows/approvals-handoffs: Approvals and handoffs between steps

Interrupt and resume mechanics across stacks, approvals as an authorisation and replay problem, and typed handoffs under engine payload limits.

**Lessons**

1. **Human-in-the-loop mechanics across stacks** (`hitl-mechanics`, lesson, senior). LangGraph interrupts restart the node from its first line on resume and match resume values by index, so side effects before the interrupt must be idempotent. The lesson covers LangGraph, the OpenAI Agents SDK's approvals and serialisable run state, Temporal Signals versus Updates, Dify's Human Input node with its three-day default timeout, and Flowise checkpoints. The reader can implement a pause and resume correctly on two of these stacks.
   - Sources: https://docs.langchain.com/oss/python/langgraph/interrupts ; https://openai.github.io/openai-agents-python/human_in_the_loop/ ; https://docs.temporal.io/encyclopedia/workflow-message-passing ; https://docs.dify.ai/en/use-dify/nodes/human-input ; https://docs.flowiseai.com/using-flowise/agentflowv2
2. **Approval security: who may approve, what they see, and what a replay does** (`approval-security`, lesson, staff). An approval is an authorisation decision, so the design must say who may approve, show the reviewer the exact arguments rather than a model summary, and keep resume state on the server. The OpenAI Agents SDK warns that deserialising run state does not authenticate the snapshot or the reviewer and that approval does not give exactly-once execution. The lesson covers timeout policy (escalate or reject, never auto-approve money), replayed approvals, and OpenAI's two triggers for human intervention.
   - Sources: https://openai.github.io/openai-agents-python/human_in_the_loop/ ; https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf ; https://docs.langchain.com/oss/python/langgraph/interrupts
3. **Structured handoffs between steps** (`structured-handoffs`, lesson, senior). A step's output is the next step's input, so it gets a schema, a version and a size budget. Engines cap payloads (Temporal 2 MB per payload, Inngest 4 MiB per step output, Cloudflare 1 MiB per step return), which is why large artefacts move by reference using the claim-check pattern, as Anthropic's research subagents do. The lesson also covers OpenAI handoffs and input filters, and the security point that a handoff forwarding full history forwards any injected text with it.
   - Sources: https://openai.github.io/openai-agents-python/handoffs/ ; https://docs.temporal.io/cloud/limits ; https://www.inngest.com/docs/usage-limits/inngest ; https://developers.cloudflare.com/workflows/build/rules-of-workflows/ ; https://www.anthropic.com/engineering/multi-agent-research-system

**Problems** (7; debug 1, mcq 1, critique 1, design 2, concept 1, workflow 1; hard 5, medium 2)

- `wfl-022` (debug, hard, senior, new, Core 100) An approval node inserts a record and then calls interrupt(); after approval there are two records. Explain and fix without losing the audit trail. Source: https://docs.langchain.com/oss/python/langgraph/interrupts
- `wfl-023` (mcq, medium, senior, new) For a reviewer's approve or reject on a running workflow, do you use a Signal, a Query or an Update? Source: https://docs.temporal.io/encyclopedia/workflow-message-passing
- `wfl-024` (critique, hard, senior, new, Crunch 6) Critique a design that stores approval run state in a browser cookie and lets any logged-in user approve. Source: https://openai.github.io/openai-agents-python/human_in_the_loop/
- `wfl-025` (design, hard, staff, new) Approval design for a payments workflow: what the reviewer sees, timeouts, escalation, four-eyes rules and replay protection. Source: https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf
- `wfl-026` (concept, medium, senior, new) A handoff forwards the full conversation history to the next agent: what does injected text do, and what does an input filter change? Source: https://openai.github.io/openai-agents-python/handoffs/
- `wfl-027` (workflow, hard, senior, new) Invoice-to-ERP handoffs with typed contracts and the claim-check pattern under engine payload limits. Source: https://docs.temporal.io/cloud/limits
- `wfl-028` (design, hard, staff, new) Design LangGraph's persistence layer for stateful agents with human-in-the-loop interruption. Source: https://www.techinterview.org/companies/langchain/. Reported: LangChain (candidate report via techinterview.org)

### workflows/batch-pipelines: Batch stages and document pipelines

Batch APIs as a workflow stage with reconciliation, document pipelines from intake to system of record, and confidence routing to human review.

**Lessons**

1. **Batch APIs as a workflow stage** (`batch-stage`, lesson, senior). A batch stage is submit, poll, collect, reconcile and re-submit, with results out of order (join on custom_id), per-request errors and expiries, and a 24-hour window (48 hours on Gemini). The lesson covers result retention per provider, batch queue limits as backpressure, best-effort caching inside batches, and OpenAI flex as a middle lane at batch prices that can return 429s. The reader designs a nightly batch stage that never silently drops an expired item.
   - Sources: https://platform.claude.com/docs/en/build-with-claude/batch-processing ; https://developers.openai.com/api/docs/guides/batch ; https://ai.google.dev/gemini-api/docs/batch-api ; https://developers.openai.com/api/docs/guides/flex-processing ; https://platform.claude.com/docs/en/api/rate-limits
2. **Document pipelines from intake to system of record** (`document-pipelines`, lesson, senior). A document pipeline is intake, preprocessing, OCR or native PDF input, extraction to a schema, business-rule validation, confidence scoring, review routing and write-back, and each stage has a contract and a failure mode. Claude accepts PDFs as text plus page images with documented per-page token ranges, Uber's TextSense runs OCR, extraction, rules and a side-by-side review UI under Cadence, and Grab writes predictions to Kafka for owners to verify weekly. The reader works out throughput and cost per document for a stated volume.
   - Sources: https://platform.claude.com/docs/en/build-with-claude/pdf-support ; https://www.uber.com/blog/advancing-invoice-document-processing-using-genai/ ; https://engineering.grab.com/llm-powered-data-classification ; https://company.instacart.com/tech-innovation/scaling-catalog-attribute-extraction-with-multi-modal-llms
   - Widget or lab: lab:batch-extraction
3. **Confidence and review routing for model extraction** (`extraction-confidence`, lesson, senior). Review queues are sized by the confidence threshold, so the threshold is a staffing decision as much as a quality one. Instacart scores confidence from the probability of yes on a self-verification call and sends low-confidence values to auditors; the threshold is chosen on a labelled sample. The lesson covers calibration checks, the review-rate versus error-rate curve, and what Uber's reported accuracy figures do and do not mean per invoice.
   - Sources: https://company.instacart.com/tech-innovation/scaling-catalog-attribute-extraction-with-multi-modal-llms ; https://www.uber.com/blog/advancing-invoice-document-processing-using-genai/

**Problems** (7; estimate 2, debug 1, workflow 1, concept 1, design 2; hard 4, medium 3)

- `wfl-029` (estimate, hard, senior, new, Core 100) A nightly 300,000-document enrichment against a 100,000-request batch cap and a processing-queue limit: how many batches, how long, and what you promise downstream. Source: https://platform.claude.com/docs/en/build-with-claude/batch-processing
- `wfl-030` (debug, medium, senior, new) Batch results are joined back to inputs by line number; what breaks, and how do you reconcile errored and expired items? Source: https://platform.claude.com/docs/en/build-with-claude/batch-processing
- `wfl-031` (workflow, hard, senior, new) An invoice-processing pipeline that writes to the ERP and routes uncertain fields to people. Source: https://www.uber.com/blog/advancing-invoice-document-processing-using-genai/
- `wfl-032` (concept, medium, senior, new) Score confidence on an extraction without labels and choose the review threshold, stating what the threshold costs in reviewer hours. Source: https://company.instacart.com/tech-innovation/scaling-catalog-attribute-extraction-with-multi-modal-llms
- `wfl-033` (design, hard, staff, new) An inference job API: clients POST a job and poll; statuses, idempotency keys, retries, rate limits, partial batch failure and a model version change mid-flight. Source: https://prachub.com/interview-questions/design-a-batch-inference-api. Reported: Anthropic (candidate report via PracHub)
- `wfl-034` (design, hard, senior, new) A document processing pipeline that ingests and indexes large volumes of heterogeneous documents for model use. Source: https://www.aced.io/blog/ai-engineer-interview-questions. Reported: Databricks (candidate report via aced.io)
- `wfl-035` (estimate, medium, senior, new) Cost per 200-page contract sent as PDF pages at the documented per-page token range versus text extraction plus a page-image fallback for tables. Source: https://platform.claude.com/docs/en/build-with-claude/pdf-support

### workflows/operating-workflows: Observing, testing and choosing workflow tools

Per-step tracing with the OpenTelemetry GenAI spans, replay and crash-injection tests, and when low-code tools are the right answer.

**Lessons**

1. **Observability per step** (`step-observability`, lesson, senior). A workflow trace is a tree of workflow, agent, model and tool spans, and the OpenTelemetry GenAI conventions (Development status) define invoke_workflow as an internal span that should not be emitted when the workflow is a detail inside an agent or tool. The lesson covers per-step metrics (latency, tokens, cost, retries, validation failures, review rate), linking engine run ids to trace ids, and Anthropic's practice of monitoring decision patterns without reading conversation content. The reader instruments a five-step workflow and writes the alerts.
   - Sources: https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/gen-ai-agent-spans.md ; https://blog.duolingo.com/production-ready-ai-agent-platform/ ; https://www.anthropic.com/engineering/multi-agent-research-system
2. **Testing workflows: replay, golden traces and crash injection** (`testing-workflows`, lesson, senior). Workflow tests come in four layers: unit tests with recorded model responses, replaying recent histories against new code in CI, time-skipping so a three-day timeout runs in milliseconds, and killing the worker at every boundary while asserting one external effect each. The lesson warns about the three meanings of replay and shows Duolingo running its evals as Temporal workflows with deterministic graders first. The reader writes the test plan and CI gate for a refund workflow.
   - Sources: https://docs.temporal.io/develop/python/testing-suite ; https://docs.langchain.com/oss/python/langgraph/use-time-travel ; https://www.inngest.com/docs/platform/replay ; https://blog.duolingo.com/production-ready-ai-agent-platform/
   - Widget or lab: lab:workflow-engine
3. **Playbook: low-code tools versus code** (`low-code-playbook`, playbook, staff). n8n, Dify, Flowise and Zapier Agents are chosen on durability, testing, versioning, review, tenancy and licence, not on taste. n8n's Sustainable Use License limits use to internal business or non-commercial purposes and its queue mode needs Postgres and Redis, while Dify's modified Apache 2.0 forbids running a multi-tenant service from source without permission. Low-code wins for internal automations owned by operations with few steps and a human downstream; code wins when the workflow is the product, needs tests in CI, is multi-tenant or moves money.
   - Sources: https://github.com/n8n-io/n8n/blob/master/LICENSE.md ; https://docs.n8n.io/hosting/scaling/queue-mode/ ; https://github.com/langgenius/dify/blob/main/LICENSE ; https://docs.dify.ai/en/use-dify/build/predefined-error-handling-logic ; https://docs.flowiseai.com/using-flowise/agentflowv2 ; https://zapier.com/agents
   - Existing: `src/content/lessons/apis/frameworks/overview.mdx` (split, receives-content). Low-code coverage is new; the frameworks lesson links here.

**Problems** (7; concept 3, workflow 1, design 2, debug 1; medium 2, hard 5)

- `wfl-036` (concept, medium, senior, new) Which span do you emit for a graph run, an agent invocation and a tool call, and when should a framework not emit a workflow span? Source: https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/gen-ai-agent-spans.md
- `wfl-037` (workflow, hard, staff, new, Core 100) Write the test plan and CI gate for a five-step refund workflow: replay tests, time skipping, crash injection and golden traces. Source: https://docs.temporal.io/develop/python/testing-suite
- `wfl-038` (concept, hard, staff, new) Operations wants the approval workflow in n8n or Dify: when do you agree, and what would move it to code? Source: https://github.com/n8n-io/n8n/blob/master/LICENSE.md
- `wfl-039` (design, hard, staff, new) An evaluation platform running async runs across thousands of datasets with LLM graders. Source: https://www.techinterview.org/companies/langchain/. Reported: LangChain (candidate report via techinterview.org)
- `wfl-040` (concept, medium, senior, new) Clone a repository, run a coding agent, open a PR: one durable step or three, given workers may not share disks? Source: https://blog.duolingo.com/buildingaiagents
- `wfl-041` (debug, hard, senior, new) The workflow dashboard shows healthy p95 latency while customers report stuck runs: the alert watches queue depth, not the age of the oldest message. Source: https://builder.aws.com/content/3EuRcgkTP1MI0c7zM8W6HL3WIqA/avoiding-insurmountable-queue-backlogs
- `wfl-042` (design, hard, staff, new) A research-assistant agent platform where traces run for 30 minutes or more: resume, replay for debugging, spend caps and alerting. Source: https://www.techinterview.org/post/3233474928/ai-agent-infrastructure-interview/

## 5. Retrieval and RAG (`rag`)

Retrieval as a systems problem: lexical and dense retrieval and what each misses, permissions and freshness against an ANN index, chunking chosen by eval, fusion and trained rerankers, late interaction and GraphRAG with their costs, locating failures by stage, vector index internals (HNSW by hand, filtered search, quantisation, object storage), and search evaluation with judgment pools and LLM assessors. Definitions of recall and inverted indexes are assumed; the track spends its words on decisions and published limits.

### rag/retrieval-foundations: Retrieval with permissions and freshness

What BM25 and dense retrieval each miss, permission and freshness constraints against ANN indexes, and when Postgres is enough.

**Lessons**

1. **BM25 and dense retrieval: what each misses** (`lexical-and-dense`, lesson, senior). BM25's IDF saturation and length normalisation are the tunable parts, and dense bi-encoders miss identifiers and rare terms that BM25 keeps. The lesson covers BEIR's finding that BM25 is a robust zero-shot baseline, bi-encoder versus cross-encoder cost, and Postgres full-text configuration traps. The reader predicts which queries break each retriever before running them.
   - Sources: https://lucene.apache.org/core/9_0_0/core/org/apache/lucene/search/similarities/BM25Similarity.html ; https://arxiv.org/abs/2104.08663 ; https://arxiv.org/abs/1908.10084 ; https://www.postgresql.org/docs/current/textsearch-controls.html
   - Widget or lab: RagMetrics
   - Existing: `src/content/lessons/rag/retrieval-foundations/overview.mdx` (rewrite, primary). Drop definitions of inverted index, embeddings, ANN and metrics; keep BM25 IDF, the Postgres gotchas, pgvector filtering and the index limits table (level audit 5.1).
2. **Permissions, freshness and the ANN index** (`permissions-freshness`, lesson, staff). Per-user access control, deletes and freshness all fight the ANN index, because filtering after the scan returns fewer than k rows. The lesson covers pgvector's post-filter behaviour and iterative scans, per-tenant namespaces and their limits, and how Microsoft 365 Copilot scopes retrieval to the user's permissions. The decision is filter placement and index partitioning for a corpus with mixed permissions.
   - Sources: https://github.com/pgvector/pgvector ; https://docs.pinecone.io/guides/index-data/implement-multitenancy ; https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-privacy
3. **pgvector or a dedicated vector database** (`postgres-or-vector-db`, lesson, senior). The choice turns on index size in RAM, filter selectivity, write rate and who operates it, not on benchmark queries per second. The lesson covers pgvector index limits and the version floor (0.8.3 or later; the README now shows 0.8.7), HNSW memory per vector, and when a managed service pays for itself. The reader can defend the choice for a stated corpus and growth rate.
   - Sources: https://github.com/pgvector/pgvector ; https://github.com/pgvector/pgvector/blob/master/CHANGELOG.md ; https://arxiv.org/abs/2401.08281

**Problems** (6; design 2, code 1, concept 1, debug 1, estimate 1; hard 3, medium 3)

- `rag-018` (design, hard, staff, new, Core 100) Permissions, freshness and the ANN index for a mixed-permission corpus: filter placement, partitioning, delete handling and the recall you accept. Source: https://www.hellointerview.com/community/questions/rag-system-design/cmoaemvhf1emv09adwqq9wk3f. Reported: Scale AI, Atlassian (candidate reports via Hello Interview community)
- `rag-002` (code, medium, senior, existing) BM25 from scratch; hidden property tests check IDF saturation and length normalisation rather than one ranking. Source: https://lucene.apache.org/core/9_0_0/core/org/apache/lucene/search/similarities/BM25Similarity.html
- `rag-003` (concept, medium, senior, existing) Flat, IVF or HNSW for three stated corpora and update rates, with the parameter you would tune first. Source: https://arxiv.org/abs/2401.08281
- `rag-004` (debug, hard, senior, existing, Core 100) LIMIT 10 returns 3 rows from a filtered vector query; the arithmetic is no longer in the correct option. Source: https://github.com/pgvector/pgvector
- `rag-005` (estimate, medium, senior, existing) Does an index of 50 million chunks fit in memory, and which quantisation or partitioning makes it fit? Source: https://huggingface.co/blog/embedding-quantization
- `rag-019` (design, hard, staff, new) Enterprise search with RAG over 5M documents searchable within 5 minutes, at 300 QPS and p95 under 1.2 s, with ACLs, offline NDCG@k and recall@k and an online A/B. Source: https://prachub.com/interview-questions/design-an-ml-search-system-with-rag. Reported: OpenAI (candidate report via PracHub)

### rag/ingestion: Ingestion, parsing and chunking

Choosing a parsing route for documents, chunking decided by eval, and ingestion as a batch pipeline with quality gates.

**Lessons**

1. **Playbook: OCR pipeline, VLM parsing or page-image retrieval** (`parsing-routes`, playbook, senior). Documents can be parsed to text, parsed by a vision-language model, or retrieved as page images, and each route has different failure modes and costs. ColPali embeds page images as multi-vectors and reports beating text-extraction pipelines on its ViDoRe benchmark, while Claude and Gemini price pages as images with documented token rates. The worked case is 200-page contracts with tables and stamps, with what to measure after choosing.
   - Sources: https://arxiv.org/abs/2407.01449 ; https://arxiv.org/abs/2502.13923 ; https://platform.claude.com/docs/en/build-with-claude/pdf-support ; https://ai.google.dev/gemini-api/docs/document-processing
   - Existing: `src/content/lessons/rag/ingestion/overview.mdx` (split, primary). Parsing routes become a playbook; chunking stays; pipeline engineering becomes its own lesson.
2. **Chunking as a retrieval decision** (`chunking`, lesson, senior). Chunk size and boundaries decide what one retrieved unit can answer, so chunking defaults should come from an eval rather than a blog post. The lesson covers fixed, recursive and structure-aware splitters, Chroma's chunking evaluation, Anthropic's contextual retrieval and late chunking. The reader picks defaults for two corpora and shows the eval that justified them.
   - Sources: https://www.trychroma.com/research/evaluating-chunking ; https://www.anthropic.com/news/contextual-retrieval ; https://arxiv.org/abs/2409.04701 ; https://raw.githubusercontent.com/langchain-ai/langchain/master/libs/text-splitters/langchain_text_splitters/character.py
   - Widget or lab: RagChunker
3. **Ingestion as a batch pipeline with quality gates** (`ingestion-pipelines`, lesson, senior). Ingestion is a batch pipeline with contracts: idempotent re-runs keyed on content hash, lineage from every chunk to its source version, and stage gates that fail the batch instead of dropping documents silently. The lesson uses NeMo Curator's stages (language detection, rule filters, exact, fuzzy and semantic dedup, model-based quality filtering) as a reference, with Presidio for PII at ingest. The reader writes the gate thresholds for empty text, duplicates, PII hits and chunk-length drift.
   - Sources: https://docs.nvidia.com/nemo/curator/latest/about/index.html ; https://arxiv.org/abs/2107.06499 ; https://presidio.dataprivacystack.org/

**Problems** (6; concept 1, debug 1, design 1, workflow 1, estimate 1, critique 1; medium 3, hard 3)

- `rag-006` (concept, medium, senior, existing) Chunk a 200-page PDF with tables and headers, and say what you would measure to know the chunking is right. Source: https://www.trychroma.com/research/evaluating-chunking
- `rag-007` (debug, medium, senior, existing) The bot cites a deleted policy: find the gap in delete propagation among other real ingestion defects. Source: https://github.com/pgvector/pgvector
- `rag-008` (design, hard, staff, existing) Per-user access control in retrieval when permissions change hourly and the index rebuild takes a day. Source: https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-privacy
- `rag-020` (workflow, hard, senior, new) Keep an index fresh when source documents change daily: idempotent re-ingest keyed on content hash, deletes, lineage and a quality gate. Source: https://docs.nvidia.com/nemo/curator/latest/about/index.html
- `rag-021` (estimate, medium, senior, new) Parse 200-page contracts with tables and stamps: tokens and cost per document for text extraction versus page images on two providers. Source: https://ai.google.dev/gemini-api/docs/tokens
- `rag-022` (critique, hard, senior, new) Critique an ingestion job that silently skips documents that fail parsing and reports success. Source: https://docs.nvidia.com/nemo/curator/latest/about/index.html

### rag/hybrid-search: Fusion, reranking and query transformation

Rank fusion without score calibration, choosing and training rerankers, and transformations that pay for their extra model call.

**Lessons**

1. **Fusion: RRF, score normalisation and when hybrid wins** (`fusion`, lesson, senior). Reciprocal rank fusion merges rankings without calibrating scores, which is why it is the default when lexical and dense scores live on different scales. The lesson covers RRF's constant, weighted fusion, and identifier-heavy queries where hybrid beats dense-only retrieval. The reader implements fusion and tunes it against an eval set.
   - Sources: http://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf ; https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/rrf-retriever ; https://qdrant.tech/documentation/concepts/hybrid-queries/
   - Widget or lab: RagRrf
   - Existing: `src/content/lessons/rag/hybrid-search/overview.mdx` (split, primary). Reranker training is added as its own lesson; query transformation becomes its own lesson.
2. **Rerankers: choosing and training** (`rerankers`, lesson, senior). Cross-encoder rerankers trained with binary cross-entropy on mined hard negatives are a strong default, and the Sentence Transformers write-up shows a fine-tuned 150M reranker lifting NDCG@10 on its domain well above the retriever alone. Distillation from a larger teacher helps only when the teacher is stronger, and LLM listwise rerankers trade latency for quality. The decision is how many candidates to rerank inside a latency budget and whether to train your own.
   - Sources: https://huggingface.co/blog/train-reranker ; https://arxiv.org/abs/2507.08336 ; https://arxiv.org/abs/2304.09542 ; https://docs.cohere.com/docs/models
3. **Query rewriting, HyDE and decomposition: when transformation pays** (`query-transformation`, lesson, senior). Transformation adds a model call before retrieval, so it pays only when queries are underspecified or need several hops. The lesson covers HyDE, multi-query and decomposition, and routing away from retrieval when it is the wrong tool. The reader measures the gain per added call before shipping it.
   - Sources: https://arxiv.org/abs/2212.10496 ; https://platform.claude.com/docs/en/build-with-claude/search-results

**Problems** (6; code 1, estimate 1, mcq 1, workflow 1, design 1, debug 1; medium 2, hard 4)

- `rag-009` (code, medium, senior, existing) Merge two rankings with RRF and a weighted variant; hidden tests check ties and missing documents. Source: http://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf
- `rag-011` (estimate, hard, senior, existing, Core 100) How many candidates can you rerank inside a latency budget: the reader specifies how to measure reranker latency, then computes with their own numbers. Source: https://docs.cohere.com/docs/models
- `rag-017` (mcq, medium, senior, existing) Cross-encoder, ColBERT or LLM reranker for a stated latency, corpus and update rate. Source: https://arxiv.org/abs/2004.12832
- `rag-023` (workflow, hard, staff, new) Fine-tune a small reranker for a domain: training data, negative mining, evaluation and the rule for stopping. Source: https://huggingface.co/blog/train-reranker
- `rag-024` (design, hard, staff, new) A ranking system combining BM25, dense retrieval and LLM reranking across several indexes, with the latency budget split per stage. Source: https://www.techinterview.org/companies/perplexity/
- `rag-025` (debug, hard, senior, new) HyDE raised offline recall and hurt the latency SLO and answer quality on short navigational queries; decide the routing rule. Source: https://arxiv.org/abs/2212.10496

### rag/advanced-rag: Late interaction, GraphRAG and agentic retrieval

Advanced patterns judged by what they cost: late interaction storage, GraphRAG indexing, agentic retrieval loops, and long context as the alternative.

**Lessons**

1. **Late interaction, walked through** (`late-interaction`, paper, staff). ColBERT keeps one vector per token and scores with MaxSim, and the storage blow-up is what decides whether late interaction is affordable. ColBERTv2 cuts the footprint with residual compression, PLAID cuts search latency, and MUVERA reduces multi-vector search to single-vector MIPS. The walkthrough ends with the storage arithmetic for a stated corpus and what to say when asked whether late interaction is worth it.
   - Sources: https://arxiv.org/abs/2004.12832 ; https://arxiv.org/abs/2112.01488 ; https://arxiv.org/abs/2205.09707 ; https://arxiv.org/abs/2405.19504
2. **GraphRAG: when relationships earn their indexing cost** (`graphrag`, lesson, senior). GraphRAG builds an entity graph and community summaries at indexing time so global questions can be answered, at an indexing cost that ordinary RAG does not pay. The lesson covers the original method, LazyGraphRAG's deferred summarisation, and the question types where a graph changes the answer. The reader decides when the indexing bill is justified.
   - Sources: https://arxiv.org/abs/2404.16130 ; https://www.microsoft.com/en-us/research/blog/lazygraphrag-setting-a-new-standard-for-quality-and-cost/
   - Existing: `src/content/lessons/rag/advanced-rag/overview.mdx` (split, primary). Late interaction becomes a paper walkthrough; GraphRAG, agentic RAG and long context versus RAG become separate lessons.
3. **Agentic RAG: retrieve, judge, retry** (`agentic-rag`, lesson, senior). Agentic retrieval lets the model decide whether it has enough context and retry, which helps on multi-hop questions and loops on unanswerable ones. The lesson covers Self-RAG, corrective RAG and a LangGraph agentic retrieval loop with a retry budget and an abstain path. The reader caps the loop and measures the cost per answered question.
   - Sources: https://arxiv.org/abs/2310.11511 ; https://arxiv.org/abs/2401.15884 ; https://docs.langchain.com/oss/python/langgraph/agentic-rag
4. **Long context, RAG or cache-augmented generation** (`long-context-vs-rag`, lesson, senior). Stuffing a corpus into a long window trades retrieval errors for position effects and context rot, at a cost per query that retrieval does not pay. The lesson uses Lost in the Middle, Chroma's context-rot results and HELMET to show where long context underperforms its advertised size. The decision is per workload, with prompt caching changing the arithmetic.
   - Sources: https://arxiv.org/abs/2307.03172 ; https://www.trychroma.com/research/context-rot ; https://arxiv.org/abs/2410.02694 ; https://platform.claude.com/docs/en/build-with-claude/prompt-caching

**Problems** (6; concept 2, code 1, design 1, debug 1, critique 1; medium 2, hard 4)

- `rag-012` (concept, medium, senior, existing) Long context, RAG or cache-augmented generation for three stated workloads, with the cost per query of each. Source: https://www.trychroma.com/research/context-rot
- `rag-013` (concept, hard, staff, existing) When does GraphRAG earn its cost? Answer, then respond to a vendor's cost ratios presented as proof. Source: https://arxiv.org/abs/2404.16130
- `rag-026` (code, hard, senior, new) Implement MaxSim scoring over token vectors and compute storage for a stated corpus with and without residual compression. Source: https://arxiv.org/abs/2112.01488
- `rag-027` (design, hard, staff, new) Model search when documents and pasted queries exceed the context window: chunking misses, cross-document synthesis, permissions in caches and a 200-page summary. Source: https://prachub.com/interview-questions/design-llm-search-handling-long-token-inputs. Reported: OpenAI (candidate report via PracHub)
- `rag-028` (debug, hard, senior, new) An agentic RAG loop retries unanswerable questions until the budget ends and the bill per question jumps. Source: https://arxiv.org/abs/2401.15884
- `rag-029` (critique, medium, senior, new) Critique a design that sends a whole policy corpus in a long window on every query because the model supports it. Source: https://www.trychroma.com/research/context-rot

### rag/debugging-rag: Locating RAG failures

A failure taxonomy by stage, oracle-context ablations, and the 50-document take-home solved and critiqued.

**Lessons**

1. **Locating a RAG failure: chunk, query, rank, context or generation** (`failure-taxonomy`, lesson, senior). Every wrong RAG answer has a first failing stage, and finding it is a bisection over the pipeline. The lesson uses the seven failure points paper and a triage function that labels the first upstream failure. The reader can classify twenty failed answers by stage in an hour.
   - Sources: https://arxiv.org/abs/2401.05856 ; https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/faithfulness/
   - Widget or lab: lab:rag-pipeline
   - Existing: `src/content/lessons/rag/debugging-rag/overview.mdx` (rewrite, primary). Cut the opening scenario and the subtraction predict; keep the taxonomy table, the triage function, oracle context and the field guide.
2. **Oracle context and ablations: separating retrieval from generation** (`oracle-context`, lesson, senior). Giving the generator the correct passages tells you whether the generation step can succeed at all, which separates retrieval failures from generation failures. The lesson covers oracle runs, context ablations and contextual retrieval as a fix for chunks that lose their context. The reader designs the ablation that decides where the next week of work goes.
   - Sources: https://arxiv.org/abs/2401.05856 ; https://www.anthropic.com/news/contextual-retrieval
3. **The 50-document take-home, solved and critiqued** (`take-home-solved`, lesson, senior). The reported take-home asks for Q&A over 50 markdown documents, a 20-question eval set, and recall@5 and faithfulness. The lesson solves it with the scoping choices, the README and the eval report a reviewer wants, then critiques the common submissions. The reader can finish one in three hours and know what was cut.
   - Sources: https://www.techinterview.org/post/3233476824/ai-engineer-interview-rag-agents-evals/ ; https://arxiv.org/abs/2309.15217

**Problems** (6; debug 2, code 1, design 1, critique 1, concept 1; medium 2, hard 4)

- `rag-014` (debug, medium, senior, existing) Right documents, wrong answers: the code comment that named the bug is gone, and a chunker change is a real secondary defect to rank. Source: https://arxiv.org/abs/2401.05856
- `rag-015` (code, hard, senior, existing, Core 100) Score the take-home: compute recall@5 and a faithfulness check over a provided run, with hidden tests on edge cases. Source: https://arxiv.org/abs/2309.15217
- `rag-016` (design, hard, staff, existing) Enterprise RAG over a company wiki where freshness and permissions conflict. Source: https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-privacy
- `rag-030` (debug, hard, senior, new, Core 100) Answer correctness fell after a reranker change while recall@k did not; the reranker truncates query plus document tokens. Source: https://docs.cohere.com/docs/models
- `rag-031` (critique, hard, senior, new) Users say the bot feels dumb: critique a fix list that starts with a bigger model and a longer prompt. Source: https://arxiv.org/abs/2401.05856
- `rag-032` (concept, medium, senior, new) Measure faithfulness without human labels and name the traps in the judge you would use. Source: https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/faithfulness/

### rag/vector-systems: Vector index internals

HNSW built by hand, filtered vector search as a design problem, quantisation with verification, and sharding and multi-tenancy for vector search.

**Lessons**

1. **HNSW, built by hand** (`hnsw-by-hand`, lesson, senior). HNSW draws each node's level from a decaying distribution, searches greedily from the top layer down, and depends on a neighbour-selection heuristic the paper says matters at high recall and on clustered data. The lesson covers M, efConstruction and efSearch, memory per node, and why deletes need tombstones or rebuilds. In the lab the reader inserts, searches, measures recall against brute force at several efSearch values, then adds a filter and watches recall fall.
   - Sources: https://arxiv.org/abs/1603.09320 ; https://github.com/pgvector/pgvector ; https://prachub.com/resources/vector-database-interview-questions-hnsw-ivf-filtering-and-recall-vs-latency
   - Widget or lab: lab:hnsw
2. **Playbook: filtered vector search** (`filtered-search`, playbook, staff). Pre-filtering, post-filtering, filter-aware traversal, iterative scans and per-tenant partitions fail at different selectivities. pgvector's README shows post-filtering at 10% selectivity with efSearch 40 returning about 4 rows, Qdrant adds filter-aware edges only if payload indexes exist before the graph is built, and ACORN traverses a predicate subgraph. The inputs are selectivity, correlation between filter and query, and tenant count; the playbook ends with the recall and latency test to run after choosing.
   - Sources: https://github.com/pgvector/pgvector ; https://qdrant.tech/documentation/concepts/indexing/ ; https://arxiv.org/abs/2403.04871
3. **Vector quantisation with a verification pass** (`vector-quantisation`, lesson, senior). Scalar int8, binary codes with rescoring, product quantisation and RaBitQ are lossy compression followed by a verification pass on full vectors. The lesson covers pgvector's binary_quantize expression index with a rerank of the top candidates, PQ's asymmetric distance tables, and RaBitQ's error bound. The reader picks a format for a stated recall target and RAM budget.
   - Sources: https://arxiv.org/abs/2405.12497 ; https://github.com/pgvector/pgvector ; https://huggingface.co/blog/embedding-quantization
4. **Sharding, multi-tenancy and freshness in vector search** (`vector-scale`, lesson, staff). At scale vector search becomes a storage problem: RAM-resident graphs, SSD-resident indexes and object-storage engines with caches trade cost against cold-query latency. turbopuffer keeps data in object storage with a write-ahead log per namespace and reports a cold p50 of 874 ms against a warm p50 of 14 ms at 1M documents. The decision is how to shard, isolate tenants and bound freshness for a corpus with many small tenants.
   - Sources: https://turbopuffer.com/docs/architecture ; https://proceedings.neurips.cc/paper/2019/hash/09853c7fb1d3f8ee67a61b6bf4a7f8e6-Abstract.html ; https://docs.pinecone.io/guides/index-data/implement-multitenancy ; https://prachub.com/resources/vector-database-interview-questions-hnsw-ivf-filtering-and-recall-vs-latency

**Problems** (7; debug 1, concept 2, design 2, estimate 1, code 1; hard 5, medium 2)

- `rag-033` (debug, hard, staff, new, Core 100, Crunch 13) HNSW returns 50 neighbours in 18 ms at 96% recall; with tenant, category and inventory filters it returns 11 in 140 ms. Fix filtered recall without destroying latency. Source: https://prachub.com/resources/vector-database-interview-questions-hnsw-ivf-filtering-and-recall-vs-latency
- `rag-034` (concept, medium, senior, new) What M, efConstruction and efSearch control, and where HNSW becomes hard to operate. Source: https://prachub.com/resources/vector-database-interview-questions-hnsw-ivf-filtering-and-recall-vs-latency
- `rag-035` (design, hard, staff, new) Vector search for a million small tenants: index per tenant or shared, cold-start latency, freshness and cost. Source: https://turbopuffer.com/docs/architecture
- `rag-036` (estimate, hard, senior, new, Core 100) Switch the embedding model at 80 million vectors: re-embedding cost, dual-write window, storage and the recall check before cut-over. Source: https://developers.openai.com/api/docs/guides/embeddings
- `rag-037` (code, hard, senior, new) HNSW insert and search in stdlib Python; tests measure recall against brute force and require a recall floor at a fixed efSearch. Source: https://arxiv.org/abs/1603.09320
- `rag-038` (design, hard, staff, new) Optimise vector semantic search for an assistant: embedding choice or training, ANN and sharding, hybrid plus rerank, caching, tenant isolation and freshness. Source: https://prachub.com/interview-questions/optimize-vector-semantic-search-for-an-assistant. Reported: Microsoft (candidate report via PracHub)
- `rag-039` (concept, medium, senior, new) The nlist versus nprobe trade-off in IVF, and when you add product quantisation. Source: https://arxiv.org/abs/2401.08281

### rag/search-quality: Search evaluation

Judgment pools and graded relevance, LLM relevance assessors and their limits, and evaluating citations.

**Lessons**

1. **Search evaluation with judgment pools and graded relevance** (`search-evaluation`, lesson, staff). Search quality is measured with pooled judgments and graded relevance, and leaderboards measured on other people's queries do not transfer. BEIR found BM25 a robust baseline across its datasets, and BRIGHT showed a then-leading MTEB model falling from 59.0 to 18.3 NDCG@10 on reasoning-heavy queries. The reader designs the evaluation for a new search product with no labels.
   - Sources: https://arxiv.org/abs/2104.08663 ; https://arxiv.org/abs/2407.12883 ; https://arxiv.org/abs/2406.06519
2. **LLM relevance assessors: where they match humans and where they drift** (`llm-assessors`, lesson, senior). LLM relevance labels reached human-level accuracy at Bing at a fraction of the cost, and the same work found that paraphrasing the prompt changes accuracy. UMBRELA reproduces the approach openly and correlates with system rankings on TREC tracks, which is a weaker claim than agreeing with each human label. The reader calibrates an LLM assessor on a human-labelled slice before trusting it.
   - Sources: https://arxiv.org/abs/2309.10621 ; https://arxiv.org/abs/2406.06519
3. **Evaluating citations and answer attribution** (`citation-quality`, lesson, senior). A citation is correct only if the cited span supports the claim it is attached to, which is a stricter test than retrieving a relevant document. The lesson covers provider citation features, search-result content blocks, and Perplexity's published search architecture as an example of span-level retrieval feeding answers. The reader writes the citation checks for an answer engine.
   - Sources: https://platform.claude.com/docs/en/build-with-claude/citations ; https://platform.claude.com/docs/en/build-with-claude/search-results ; https://research.perplexity.ai/articles/architecting-and-evaluating-an-ai-first-search-api

**Problems** (6; workflow 1, debug 1, concept 1, design 2, critique 1; hard 5, medium 1)

- `rag-040` (workflow, hard, staff, new) Build the relevance-judgment workflow for a new enterprise search product with no labels: pools, grades, assessors and calibration. Source: https://arxiv.org/abs/2406.06519
- `rag-041` (debug, hard, staff, new) Offline recall is good but online search quality is bad: what do you check, in what order? Source: https://prachub.com/resources/vector-database-interview-questions-hnsw-ivf-filtering-and-recall-vs-latency
- `rag-042` (concept, medium, senior, new) How would you evaluate an answer's citation quality, and which failure would a document-level check miss? Source: https://www.techinterview.org/companies/perplexity/
- `rag-043` (design, hard, staff, new) Two-stage retrieval and ranking with user and listing embeddings: labels, position bias and evaluation. Source: https://prachub.com/interview-questions/design-user-embedding-semantic-search. Reported: Airbnb (candidate report via PracHub)
- `rag-044` (critique, hard, senior, new) Critique an embedding-model choice made from the MTEB leaderboard alone for a reasoning-heavy support corpus. Source: https://arxiv.org/abs/2407.12883
- `rag-045` (design, hard, senior, new) Candidate search over resumes with noisy structured data and hard filters that must exclude. Source: https://prachub.com/interview-questions/build-a-candidate-search-system. Reported: Mercor (candidate report via PracHub)

## 6. Agents and protocols (`agents`)

The agent loop and its economics, tools and protocols (MCP at the 2026-07-28 revision, A2A, Agent Skills), memory and long-lived state, multi-agent systems and their failure modes, and computer-use agents with autonomy controls. Coding-agent harnesses have their own track (harness), durable execution lives in workflows, and MCP authorisation is implemented in security; this track keeps the agent-level decisions.

### agents/agent-loop: The agent loop and its economics

Quadratic token growth, budgets that end runs cleanly, verification inside the loop, and debugging a looping agent from its trace.

**Lessons**

1. **The loop's cost: quadratic tokens, budgets and stuck detection** (`loop-economics`, lesson, senior). Each turn re-sends the history, so token cost grows quadratically with turns unless the cache holds the prefix. The lesson covers step, spend and wall-clock budgets, the Agent SDK rule that max_turns needs one extra turn for the final answer or the run ends with error_max_turns, stuck-state detectors, and the error contract between tools and the loop. The reader prices a 30-call run and sets budgets that end runs cleanly.
   - Sources: https://openai.com/index/unrolling-the-codex-agent-loop/ ; https://code.claude.com/docs/en/agent-sdk/agent-loop ; https://github.com/openai/openai-agents-python/blob/main/docs/running_agents.md ; https://platform.claude.com/docs/en/about-claude/pricing
   - Widget or lab: AgentsLoopCost
   - Existing: `src/content/lessons/agents/agent-loop/overview.mdx` (rewrite, primary). Cut the while-loop section and the interpreter analogy; keep the quadratic arithmetic, the three budgets, the detector, the error contract and cache hygiene (level audit 5.1).
2. **Planning, reflection and verification inside the loop** (`planning-verification`, lesson, senior). Plans and reflections are model output and need the same checks as tool calls. The lesson covers ReAct, plan-then-execute, verifier steps that run code or tests, and the cases where reflection only adds cost. The reader places one deterministic check in a loop and measures what it catches.
   - Sources: https://arxiv.org/abs/2210.03629 ; https://www.anthropic.com/engineering/building-effective-agents ; https://claude.com/blog/building-agents-with-the-claude-agent-sdk
3. **Debugging a looping agent from its trace** (`looping-agents`, lesson, senior). Loops come from tool errors that look like progress, missing termination signals and lost context, and each leaves a different signature in the trace. The lesson reads recorded traces with fault injection and maps each signature to a fix in the tool, the budget or the context policy. The reader can find the cause from a trace in minutes.
   - Sources: https://github.com/openai/openai-agents-python/blob/main/docs/running_agents.md ; https://code.claude.com/docs/en/agent-sdk/agent-loop ; https://openai.com/index/unrolling-the-codex-agent-loop/
   - Widget or lab: AgentTrace

**Problems** (6; debug 2, code 1, concept 1, estimate 1, design 1; medium 5, hard 1)

- `agt-002` (debug, medium, senior, existing, Core 100, Crunch 1) The agent loops forever on some inputs: find the cause from the trace and fix it at the right layer. Source: https://github.com/openai/openai-agents-python/blob/main/docs/running_agents.md
- `agt-003` (code, medium, senior, existing, Core 100) Write a minimal agent loop with tool dispatch, a max-steps guard and the final-turn rule; hidden tests inject tool errors. Source: https://getperspective.ai/blog/anthropic-applied-ai-engineer-interview-process-frontier-lab-2026/markdown. Reported: Anthropic (reported phone-screen task via a commercial blog)
- `agt-004` (concept, medium, senior, existing) Workflow, ReAct loop or state machine for three stated systems, with what each choice costs. Source: https://www.anthropic.com/engineering/building-effective-agents
- `agt-005` (debug, medium, senior, existing) Forty-seven tool calls for a five-call task: rank the causes from the trace. Source: https://www.anthropic.com/engineering/writing-tools-for-agents
- `agt-006` (estimate, medium, senior, existing) Price a 30-call agent run with and without a warm cache, and the budget that would stop a runaway at a stated cost. Source: https://platform.claude.com/docs/en/about-claude/pricing
- `agt-020` (design, hard, senior, new) An agent calls a broken tool 400 times in five minutes: which controls at the orchestrator, tool and cost layers would each have stopped it? Source: https://github.com/ombharatiya/ai-system-design-guide/blob/main/00-interview-prep/01-question-bank.md

### agents/tools-mcp-a2a: Tools, MCP, A2A and skills

Designing tools for models, MCP at its current revision, when A2A beats one agent with more tools, and Agent Skills as progressive disclosure.

**Lessons**

1. **Designing tools for agents: narrow, idempotent, well-errored** (`tool-design`, lesson, senior). Tools are an interface for a model, so names, argument types, response size and error messages are all prompts. Anthropic's guidance includes a concise or detailed response format (72 versus 206 tokens in its Slack example) and errors that say what to do next, and tool search with deferred loading changes how many tools an agent can carry. The reader rewrites a tool set and measures the change in wrong calls.
   - Sources: https://www.anthropic.com/engineering/writing-tools-for-agents ; https://www.anthropic.com/engineering/advanced-tool-use
   - Existing: `src/content/lessons/agents/tools-mcp-a2a/overview.mdx` (split, primary). MCP authorisation implementation moves to security/mcp-security; coding-agent tool design moves to harness/tools-aci.
2. **MCP at the 2026-07-28 revision: transports, stateless requests and migration** (`mcp-current`, lesson, senior). The 2026-07-28 revision moved MCP to per-request version negotiation and stateless patterns, and revisions from 2025-11-25 back are handshake-based. The lesson covers the streamable HTTP transport, the multi-round-trip pattern, the deprecation window (at least twelve months) and what a stateful server must change to migrate. The reader can plan a server migration and its compatibility period.
   - Sources: https://modelcontextprotocol.io/specification/latest ; https://modelcontextprotocol.io/specification/2026-07-28/changelog ; https://modelcontextprotocol.io/specification/2026-07-28/basic/patterns/mrtr ; https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http ; https://modelcontextprotocol.io/specification/versioning
   - Widget or lab: AgentsMcpFlow
3. **A2A, MCP or one agent with more tools** (`a2a-or-one-agent`, lesson, senior). A2A connects agents owned by different parties, MCP connects an agent to tools and data, and most systems need neither boundary inside one team. The lesson covers the A2A specification, the move of MCP to the Agentic AI Foundation, and the cost of an agent boundary in latency and debugging. The decision is where an organisational boundary justifies a protocol boundary.
   - Sources: https://a2a-protocol.org/latest/specification/ ; https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation ; https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf
4. **Agent Skills: progressive disclosure and where procedures live** (`agent-skills`, lesson, senior). A skill loads its name and description every session and its body only when used, which keeps procedures out of the base context. The lesson covers the SKILL.md specification, skills versus tools versus memory files, and side-effecting skills that must not be invoked by the model on its own. The reader decides which of a team's procedures become skills.
   - Sources: https://agentskills.io/specification ; https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills ; https://code.claude.com/docs/en/best-practices

**Problems** (6; mcq 1, concept 1, design 2, debug 1, critique 1; medium 2, hard 4)

- `agt-008` (mcq, medium, senior, existing) A2A or MCP for four stated integrations, with options of equal length. Source: https://a2a-protocol.org/latest/specification/
- `agt-009` (concept, medium, senior, existing) Skills, MCP tools or fine-tuning for a team's procedures, with the context cost of each. Source: https://agentskills.io/specification
- `agt-010` (design, hard, staff, existing, Core 100) Move a stateful MCP server to the 2026-07-28 revision without breaking existing clients. Source: https://modelcontextprotocol.io/specification/2026-07-28/changelog
- `agt-011` (debug, hard, senior, existing) The wiki token opened the billing server; a missing customer_id authorisation check is a real secondary defect to rank. Source: https://modelcontextprotocol.io/specification/2026-07-28/basic/security_best_practices
- `agt-021` (design, hard, senior, new) Two hundred tools: stop the model choosing the wrong ones with deferred loading, tool search and namespacing, and measure the result. Source: https://www.anthropic.com/engineering/advanced-tool-use
- `agt-022` (critique, hard, senior, new) Which MCP servers would you refuse to install? Critique a team's MCP configuration file. Source: https://www.kore1.com/ai-agent-engineer-interview-questions/

### agents/memory-state: Memory and long-lived state

What an assistant should remember and forget, memory as an attack and privacy surface, and checkpoints that cover state but not side effects.

**Lessons**

1. **What to remember: memory kinds, write policy and forgetting** (`memory-design`, lesson, senior). Long-term memory is a write path into every future context, so the write policy matters more than the store. The lesson covers semantic, episodic and procedural memory, the Claude memory tool and LangGraph stores, and policies for consolidation and forgetting. The reader designs memory for an assistant that runs for months.
   - Sources: https://docs.langchain.com/oss/python/concepts/memory ; https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool ; https://arxiv.org/abs/2309.02427
   - Existing: `src/content/lessons/agents/memory-state/overview.mdx` (split, primary). Memory kinds and write policy stay here; durable execution moves to workflows/durable-execution; memory files move to harness/context-management.
2. **Memory as an attack and privacy surface** (`memory-attack-surface`, lesson, staff). Anything written to long-term memory is replayed into future contexts, so a memory write from untrusted content persists an injection across sessions. The lesson covers the spAIware case against ChatGPT memory, provenance on memory entries, OpenAI's memory controls and retention notes, and deletion that must reach memory as well as chats. The reader designs memory writes that an attacker cannot use as a foothold.
   - Sources: https://embracethered.com/blog/posts/2024/chatgpt-macos-app-persistent-data-exfiltration/ ; https://help.openai.com/en/articles/8590148-memory-faq ; https://openai.com/index/memory-and-new-controls-for-chatgpt/ ; https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool
3. **Checkpoints, resume and rollback for long agent runs** (`agent-checkpoints`, lesson, senior). Agent checkpoints capture state but not external side effects, so resume needs idempotent tools and rollback needs compensation. The lesson covers LangGraph checkpointers, Claude Code checkpoints that cover file edits only, and progress files that let a fresh session continue. The reader makes a three-hour run resumable after a crash.
   - Sources: https://docs.langchain.com/oss/python/langgraph/persistence ; https://docs.langchain.com/oss/python/langgraph/checkpointers ; https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
   - Widget or lab: AgentsResume

**Problems** (6; design 2, debug 1, code 1, critique 1, concept 1; hard 4, medium 2)

- `agt-012` (design, hard, staff, existing, Core 100) A refund agent that waits for a human: persistence, resume, no double payout. Source: https://docs.langchain.com/oss/python/langgraph/interrupts
- `agt-013` (debug, hard, senior, existing) The agent forgot what it finished after a context reset; the progress file and the checkpoint disagree. Source: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
- `agt-014` (code, medium, senior, existing) Guard the memory tool's paths against traversal, symlinks and writes outside the memory root. Source: https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool
- `agt-023` (design, hard, staff, new) Memory for a personal assistant that runs for months: what is written, provenance, consolidation, forgetting and deletion. Source: https://docs.langchain.com/oss/python/concepts/memory
- `agt-024` (critique, hard, senior, new) Critique a memory feature that writes a summary of every web page the agent reads into long-term memory. Source: https://embracethered.com/blog/posts/2024/chatgpt-macos-app-persistent-data-exfiltration/
- `agt-025` (concept, medium, senior, new) Context-window pressure on a long task: keep the goal without keeping everything, and say what you would test. Source: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents

### agents/multi-agent: Multi-agent systems and their failure modes

When parallel breadth pays for its token multiplier, what fails only with several agents, and the contract between an orchestrator and its workers.

**Lessons**

1. **When several agents pay: parallel breadth versus shared context** (`when-multi-agent`, lesson, senior). Anthropic's research system beat a single agent by 90.2% on its internal eval while using about 15 times the tokens of chat, and Cognition argues single-threaded agents with shared context are more reliable for coupled work. The lesson reads both as conditions: breadth-first tasks with separable subtasks favour several agents, and tightly coupled edits favour one. The reader decides for three stated tasks and states the cost.
   - Sources: https://www.anthropic.com/engineering/multi-agent-research-system ; https://cognition.com/blog/dont-build-multi-agents ; https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf
   - Widget or lab: AgentsCompounding
   - Existing: `src/content/lessons/agents/multi-agent/overview.mdx` (rewrite, primary). Keep orchestrator-worker numbers and MAST; move sub-agents as a harness feature to harness/context-management.
2. **MAST: why multi-agent systems fail** (`mast`, paper, senior). MAST classifies multi-agent failures into specification, inter-agent misalignment and verification failures from annotated traces. Most failures it records are design failures rather than model errors, which is why adding agents rarely fixes them. The walkthrough ends with coding a set of traces against the taxonomy.
   - Sources: https://arxiv.org/abs/2503.13657
3. **The delegation contract: scope, budget, output and verification** (`delegation-contract`, lesson, staff). Orchestrator-worker systems fail at the boundary, so each delegation states the objective, output format, allowed tools, budget and how the result is verified. The lesson uses Anthropic's lessons on vague delegation and the OpenAI Agents SDK's agents-as-tools and handoffs to show both ends of the contract. The reader writes the contract for a research or code-review system.
   - Sources: https://www.anthropic.com/engineering/multi-agent-research-system ; https://github.com/openai/openai-agents-python/blob/main/docs/multi_agent.md ; https://openai.github.io/openai-agents-python/handoffs/

**Problems** (6; estimate 1, mcq 1, concept 1, design 2, critique 1; medium 3, hard 3)

- `agt-015` (estimate, medium, senior, existing) Six passes in eight trials: what that says about pass^k, and how many more trials you need. Source: https://arxiv.org/abs/2406.12045
- `agt-016` (mcq, medium, senior, existing) The guardrail fired too late in a handoff chain: which placement fixes it? Source: https://github.com/openai/openai-agents-python/blob/main/docs/guardrails.md
- `agt-017` (concept, medium, senior, existing) Failures that need more than one agent to happen, classified with MAST. Source: https://arxiv.org/abs/2503.13657
- `agt-026` (design, hard, staff, new, Core 100) Write the delegation contract between an orchestrator and its workers, with budgets, output schema and verification. Source: https://www.anthropic.com/engineering/multi-agent-research-system
- `agt-027` (design, hard, staff, new) Two agents are editing the same file: prevent and resolve conflicts. Source: https://keepkeen.github.io/blog/china-agent-interview-guide-2025-2026/. Reported: ByteDance (candidate report via keepkeen guide)
- `agt-028` (critique, hard, senior, new) Critique a code-review system of five specialist agents with no verifier and a majority vote. Source: https://arxiv.org/abs/2503.13657

### agents/coding-agents: Computer use, browser agents and autonomy controls

Agents that act through screens and browsers, the controls that bound them, and the published residual injection rates that set the design.

**Lessons**

1. **Computer use and browser agents: screenshots, DOM and flakiness** (`computer-use`, lesson, senior). Computer-use agents act through screenshots and input events, browser agents can also read the DOM, and both are slower and flakier than API tools. The lesson covers the Claude computer-use tool, OSWorld as the benchmark, and ChatGPT agent's mix of a visual browser, a text browser, a terminal and connectors. The decision is when a screen-driving agent is worth its cost over an integration.
   - Sources: https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool ; https://arxiv.org/abs/2404.07972 ; https://openai.com/index/introducing-chatgpt-agent/
   - Existing: `src/content/lessons/agents/coding-agents/overview.mdx` (split, primary). Harness material (model versus harness, AGENTS.md, permission rules, sandboxes) moves to the harness track and is corrected there; computer use and autonomy stay here.
2. **Autonomy controls: modes, action budgets, kill switches and approvals that mean something** (`autonomy-controls`, lesson, senior). Autonomy is a set of dials (permission mode, action budget, confirmation rules, kill switch), and approvals that users click through stop being a control. Anthropic reports users approved 93% of permission prompts before auto mode, and ChatGPT agent asks for confirmation before consequential actions. The reader sets the dials for an agent that can spend money.
   - Sources: https://code.claude.com/docs/en/permission-modes ; https://www.anthropic.com/engineering/claude-code-auto-mode ; https://openai.com/index/introducing-chatgpt-agent/ ; https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf
3. **Prompt injection against acting agents: what vendors publish** (`acting-agent-injection`, lesson, staff). Browser agents read attacker-controlled pages with the user's sessions, so the residual attack rate is a design input rather than a bug to close. Anthropic reports about 1% attack success for Claude Opus 4.5 in a browser under an adaptive attacker, and OpenAI writes that prompt injection is unlikely ever to be fully solved. The reader designs the agent so that a successful injection has a bounded blast radius.
   - Sources: https://www.anthropic.com/research/prompt-injection-defenses ; https://openai.com/index/hardening-atlas-against-prompt-injection/ ; https://openai.com/index/introducing-chatgpt-agent/

**Problems** (6; design 2, debug 1, concept 1, estimate 1, critique 1; hard 5, medium 1)

- `agt-018` (design, hard, staff, existing, Core 100) The agent dropped a production table: redesign permissions and approvals using published incidents (config that ran before trust, credentials read from disk, an allowlisted upload domain). Source: https://www.anthropic.com/engineering/how-we-contain-claude
- `agt-019` (debug, medium, senior, existing) The approval gate allowed curl through a compound command; find the parsing gap. Source: https://code.claude.com/docs/en/permissions
- `agt-029` (design, hard, senior, new) Evaluate a browser agent that books travel: environment, success criteria, side-effect safety and pass^k. Source: https://arxiv.org/abs/2307.13854
- `agt-030` (concept, hard, senior, new) Which actions need human approval, and how do you keep approvals from becoming a reflex click? Source: https://www.anthropic.com/engineering/claude-code-auto-mode
- `agt-031` (estimate, hard, senior, new) Expected successful injections per month for a browser agent at a published residual attack rate and a stated exposure volume, and what that implies for scopes. Source: https://www.anthropic.com/research/prompt-injection-defenses
- `agt-032` (critique, hard, staff, new) Critique an agent mode that confirms only purchases and leaves all connectors enabled by default. Source: https://openai.com/index/introducing-chatgpt-agent/

## 7. Harness engineering and agentic coding tools (`harness`)

Everything between the user and the sampler in a coding agent: how a harness assembles each request, which controls are deterministic and which are the model deciding, tool sets built for models, memory files and compaction, prompt caching inside a harness, rule engines, sandboxes, hooks and classifier approvers, verification loops, long-running and parallel agents, and how to tell a harness effect from a model or infrastructure effect. Built from vendor documentation and engineering posts (Claude Code, Codex, Cursor, Copilot, OpenHands, Aider, SWE-agent) dated 2025 and 2026, with a teardown of each tool. This is the owner's first missing area and is built first.

### harness/harness-anatomy: What the harness owns

The split between model and harness, how a harness builds each model call, which controls are enforced and which are advice, and the research on how much harness a strong model needs.

**Lessons**

1. **Model plus harness: what each one decides** (`model-plus-harness`, lesson, senior). The harness is everything between the user and the sampler: prompt assembly, tool set, context management, permissions and sandbox, verification, budgets and persistence. Claude Code's docs call this layer the agentic harness, OpenAI calls the Codex agent loop the harness, and Böckeler splits a user-built harness into feedforward guides and feedback sensors, each computational or inferential. The lesson assigns common coding-agent failures to the layer that fixes each one, and corrects two statements in the old lesson: editing CLAUDE.md mid-session neither breaks the cache nor applies until /clear, /compact or a restart, and Cursor's current docs say it stores no embeddings for search.
   - Sources: https://code.claude.com/docs/en/how-claude-code-works ; https://openai.com/index/unrolling-the-codex-agent-loop/ ; https://martinfowler.com/articles/harness-engineering.html ; https://code.claude.com/docs/en/prompt-caching ; https://cursor.com/docs/agent/tools/search
   - Existing: `src/content/lessons/agents/coding-agents/overview.mdx` (split, receives-content). The "harness is most of the product" section becomes this lesson; permission rules and sandboxes move to permissions-sandboxing; computer use stays in agents/coding-agents. Fix the CLAUDE.md cache sentence and date the Cursor semantic-search figure as historical.
2. **The request lifecycle: how a harness builds each model call** (`request-lifecycle`, lesson, senior). Codex sends instructions, tools and an input list to the Responses API, concatenates AGENTS.md files from the git root to the working directory up to 32 KiB by default, appends configuration changes as new messages, and avoids previous_response_id to stay stateless and support zero data retention. Claude Code orders a request as system prompt and tools, then project context (CLAUDE.md, auto memory, unscoped rules), then the conversation, and appends plan mode and skill loading as messages so the prefix holds. The lesson shows one real turn from each tool as an annotated trace.
   - Sources: https://openai.com/index/unrolling-the-codex-agent-loop/ ; https://learn.chatgpt.com/docs/agent-configuration/agents-md ; https://code.claude.com/docs/en/prompt-caching ; https://code.claude.com/docs/en/agent-sdk/agent-loop
   - Widget or lab: new:Trace
3. **Deterministic versus model-decided controls** (`deterministic-controls`, lesson, staff). Claude Code's best-practices page sorts controls into what the model decides (prompt, CLAUDE.md, skills, the auto-mode classifier, effort) and what the harness enforces (hooks, deny rules, sandbox, managed settings, a Stop hook running tests, turn and budget caps, branch protection). Its rule is that anything that must happen every time becomes a hook, a deny rule or a managed setting, and the enforced set stays small. OpenAI's harness team does the same by promoting rules into custom lints whose error message carries the fix.
   - Sources: https://code.claude.com/docs/en/best-practices ; https://openai.com/index/harness-engineering/ ; https://code.claude.com/docs/en/hooks
4. **SWE-agent and the agent-computer interface** (`swe-agent`, paper, senior). SWE-agent treats the model as a new kind of user that needs purpose-built interfaces: search capped at 50 results, a 100-line file viewer, an edit command guarded by a linter, old observations collapsed, and a $4 per-instance budget. Its ablations on SWE-bench Lite with GPT-4 Turbo are the payload: 18.0% with the full interface, 15.0% without the linter, 10.3% with no edit command, and lower scores with a 30-line window or the whole file. What to say in an interview is which of these choices still matter with stronger models and how you would measure it.
   - Sources: https://arxiv.org/abs/2405.15793 ; https://arxiv.org/html/2405.15793v3
5. **The minimal harness: mini-swe-agent, CodeAct and Agentless** (`minimal-harness`, paper, staff). mini-swe-agent is about 100 lines for the agent class, uses only bash with linear history, and runs each action as an independent subprocess, which makes swapping in a container trivial. CodeAct argues for code as the action space and Agentless replaces the loop with a fixed localise, repair and validate pipeline. The interview point is how much harness a strong model needs and what you lose by deleting it, with the caveat that scores across these papers use different models.
   - Sources: https://github.com/SWE-agent/mini-swe-agent ; https://arxiv.org/abs/2402.01030 ; https://arxiv.org/abs/2407.01489

**Problems** (7; concept 2, critique 1, code 1, mcq 1, design 1, behavioural 1; medium 2, hard 5)

- `hrn-001` (concept, medium, senior, new) Model or harness: assign five described coding-agent failures to the layer that fixes each, and name the one that needs both. Source: https://code.claude.com/docs/en/how-claude-code-works
- `hrn-002` (critique, hard, staff, new, Core 100, Crunch 2) Tear down this harness: a design that rewrites the system prompt each turn, splits commands with a regex, keeps AGENTS.md at a thousand lines and has no Stop check. Source: https://openai.com/index/unrolling-the-codex-agent-loop/
- `hrn-003` (code, hard, senior, new) Build an agent from only a model API and a file editor tool, and stop it repeating the same tool call; hidden tests use a scripted mock model. Source: https://keepkeen.github.io/blog/china-agent-interview-guide-2025-2026/. Reported: Baidu (candidate report via keepkeen guide)
- `hrn-004` (mcq, medium, senior, new) Which of these is enforced regardless of what the model decides: a CLAUDE.md rule, a PreToolUse hook that exits 2, the auto-mode classifier, or a skill? Source: https://code.claude.com/docs/en/best-practices
- `hrn-005` (design, hard, staff, new) Design an AI coding agent: request assembly, tools, context policy, permissions, verification and budgets, and what you would build versus rent. Source: https://github.com/amitshekhariitbhu/ai-engineering-interview-questions
- `hrn-006` (concept, hard, staff, new) Compare your agent with Claude Code and Codex on context assembly, skill loading and checkpoints, and say what you would copy. Source: https://keepkeen.github.io/blog/china-agent-interview-guide-2025-2026/. Reported: ByteDance (candidate report via keepkeen guide)
- `hrn-007` (behavioural, hard, staff, new) Why build your own coding agent when Claude Code exists? Defend the decision to a sceptical director. Source: https://keepkeen.github.io/blog/china-agent-interview-guide-2025-2026/. Reported: Tencent (candidate report via keepkeen guide)

### harness/tools-aci: Tool sets for coding agents

Bash-only versus specialised tools, tool output as a bounded buffer, carrying many tools without paying for them every turn, errors that instruct, and parallel tool calls.

**Lessons**

1. **Playbook: bash-only or specialised tools** (`tool-set-playbook`, playbook, staff). A coding agent can run on bash alone (mini-swe-agent), on bash plus a string-replace editor (the two tools in the Claude 4 SWE-bench scaffold), on a broad built-in set (Claude Code), or with code as the action space. The inputs are model strength, portability across vendors, the need for structured permission checks and observability. The playbook works a stated case and ends with what to measure after choosing.
   - Sources: https://www.anthropic.com/news/claude-4 ; https://github.com/SWE-agent/mini-swe-agent ; https://code.claude.com/docs/en/tools-reference ; https://www.anthropic.com/engineering/advanced-tool-use
2. **Tool output budgets and pruning** (`tool-output-budgets`, lesson, senior). Every tool result is a write into a bounded buffer: Claude Code's Read returns at most 25,000 tokens per call, Bash output over about 30,000 characters becomes a saved file plus a short preview, and Glob caps at 100 files. Anthropic's tool-writing guidance adds response formats and actionable errors, and clearing old tool results is the lightest form of compaction. The reader sets output budgets for a tool set and tests the truncation paths.
   - Sources: https://code.claude.com/docs/en/tools-reference ; https://www.anthropic.com/engineering/writing-tools-for-agents ; https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents ; https://platform.claude.com/docs/en/build-with-claude/context-editing
3. **Many tools: deferred loading, tool search and code execution** (`many-tools`, lesson, staff). Anthropic measured 58 tools across five MCP servers at about 55K tokens before the conversation started; tool search with deferred loading cut a 77K-token setup to 8.7K and raised MCP eval accuracy. Programmatic tool calling and code execution with MCP cut tokens further for workflows that chain tools. Claude Code now defers MCP tools by default, which also keeps the cache intact when a server connects mid-session.
   - Sources: https://www.anthropic.com/engineering/advanced-tool-use ; https://www.anthropic.com/engineering/code-execution-with-mcp ; https://code.claude.com/docs/en/prompt-caching
4. **Errors and lints as instructions** (`errors-as-instructions`, lesson, senior). An error message is the next prompt, so it should say what to do. SWE-agent's linter rejects a bad edit and shows the error, OpenAI's harness team writes custom lint messages that inject the remediation, Cursor found agents retried a sandbox-blocked command unchanged until the result named the sandbox constraint, and Goose returns invalid-JSON errors to the model as tool results. The reader rewrites three error messages and measures retries.
   - Sources: https://arxiv.org/html/2405.15793v3 ; https://openai.com/index/harness-engineering/ ; https://cursor.com/blog/agent-sandboxing ; https://goose-docs.ai/docs/goose-architecture/
5. **Parallel tool calls** (`parallel-tool-calls`, lesson, senior). The Agent SDK runs read-only tools concurrently and mutating tools sequentially, and custom tools default to sequential. Anthropic's research system cut research time by up to 90% with parallel sub-agents and tool calls, and Cognition's SWE-grep issues several parallel calls per turn for a few turns. The lesson covers what breaks when a tool wrongly claims to be read-only.
   - Sources: https://code.claude.com/docs/en/agent-sdk/agent-loop ; https://www.anthropic.com/engineering/multi-agent-research-system ; https://cognition.com/blog/swe-grep

**Problems** (6; design 1, code 1, estimate 1, critique 1, debug 1, concept 1; hard 3, medium 3)

- `hrn-008` (design, hard, staff, new) Choose the tool set for an internal coding agent that must run on models from three vendors, with permission checks your security team can audit. Source: https://www.anthropic.com/news/claude-4
- `hrn-009` (code, medium, senior, new) Tool output truncation to a character budget with a file-path fallback and a truncation flag; hidden tests probe the boundaries. Source: https://code.claude.com/docs/en/tools-reference
- `hrn-010` (estimate, medium, senior, new) Tokens spent before the conversation starts with 58 tools across five servers versus deferred loading, and the break-even per session with caching. Source: https://www.anthropic.com/engineering/advanced-tool-use
- `hrn-011` (critique, hard, senior, new) Critique a lint message the agent keeps ignoring, then rewrite it to carry the fix. Source: https://openai.com/index/harness-engineering/
- `hrn-012` (debug, hard, senior, new) The agent retries a sandbox-blocked command unchanged until the budget ends; the shell result never names the sandbox. Source: https://cursor.com/blog/agent-sandboxing
- `hrn-013` (concept, medium, senior, new) Read-only tools run concurrently and mutating tools sequentially: why, and what breaks when a custom tool lies about being read-only. Source: https://code.claude.com/docs/en/agent-sdk/agent-loop

### harness/context-management: Context management in a harness

Memory files and their load order, where a piece of knowledge or policy should live, compaction, context resets, sub-agents as context firewalls, and how agents find code.

**Lessons**

1. **Memory files: CLAUDE.md, AGENTS.md and rules** (`memory-files`, lesson, senior). Claude Code loads CLAUDE.md from the working directory and every parent at launch and subdirectory files on demand, Codex concatenates AGENTS.md files from the git root down to 32 KiB by default, and Cursor applies .mdc rules by type. OpenAI's harness team keeps AGENTS.md at roughly 100 lines as a map into a docs tree, Chroma's context-rot results argue for focused context, and the ETH Zurich study found context files raise inference cost by over 20% without a general success gain. The lesson concludes that memory files should hold what the agent cannot infer from the code, and nothing else.
   - Sources: https://code.claude.com/docs/en/memory ; https://learn.chatgpt.com/docs/agent-configuration/agents-md ; https://cursor.com/docs/context/rules ; https://openai.com/index/harness-engineering/ ; https://arxiv.org/abs/2602.11988 ; https://www.trychroma.com/research/context-rot
2. **Playbook: CLAUDE.md, skill, rule, hook, sub-agent or MCP server** (`where-knowledge-lives`, playbook, senior). The decision is where a piece of knowledge or policy lives, and the inputs are whether it applies to every task, whether it is a procedure, whether it must be enforced and what it costs in context every turn. Claude Code's guidance puts facts the agent cannot infer in CLAUDE.md, procedures in skills, area conventions in path-scoped rules, zero-exception rules in hooks or deny rules, noisy work in sub-agents, and prefers a CLI to an MCP server when one exists. The worked case sorts a team's twenty rules and procedures.
   - Sources: https://code.claude.com/docs/en/best-practices ; https://code.claude.com/docs/en/memory ; https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills ; https://agentskills.io/specification
3. **Compaction: what survives and what it costs** (`compaction`, lesson, staff). In Claude Code the system prompt stays, project-root CLAUDE.md and auto memory are re-read from disk, recently modified files and invoked skill bodies are re-injected within caps, and path-scoped rules and nested memory files are summarised away. Codex compacts through an endpoint whose returned item is opaque and encrypted, and OpenHands' condenser keeps the first events and halves the view while logging a condensation event. Compaction is itself a request over the whole conversation, cheap while the cache is warm and expensive after the TTL.
   - Sources: https://code.claude.com/docs/en/context-window ; https://code.claude.com/docs/en/how-claude-code-works ; https://openai.com/index/unrolling-the-codex-agent-loop/ ; https://docs.openhands.dev/sdk/arch/condenser ; https://cognition.com/blog/dont-build-multi-agents
4. **Context resets versus compaction** (`context-resets`, paper, staff). Anthropic's 2026-03-24 harness-design post found Sonnet 4.5 wrapping up early as it neared its believed limit, which made full resets with a structured handoff necessary; with Opus 4.5 the resets were dropped and automatic compaction was enough. The general lesson is that harness components encode assumptions about one model and must be re-tested per model. The walkthrough ends with how you would detect such an assumption before it ships.
   - Sources: https://www.anthropic.com/engineering/harness-design-long-running-apps
5. **Sub-agents as context firewalls** (`subagents`, lesson, senior). Claude Code sub-agents start with a fresh context, return only a summary, nest up to three levels and can be limited to read-only tools so a reviewer cannot edit. The docs say delegation does not make the answer smarter; a fresh reviewer helps because it has not seen the reasoning, and Cognition's SWE-grep exists because retrieval dominated the first turn. The reader decides which work to delegate and what it costs in tokens and time.
   - Sources: https://code.claude.com/docs/en/sub-agents ; https://code.claude.com/docs/en/best-practices ; https://cognition.com/blog/swe-grep
6. **Finding code: grep, repo maps and embeddings** (`finding-code`, lesson, senior). Aider ranks a tree-sitter tag graph with personalised PageRank into a token budget, Anthropic recommends starting with agentic search and adding semantic search only if needed, and Cursor reported a 12.5% average accuracy gain from semantic search in November 2025 while its current docs say no embeddings are stored for search. The lesson treats the choice as a lexer versus an index and shows how to measure it on your own repository. Every vendor figure is dated, because this is where content goes stale fastest.
   - Sources: https://aider.chat/docs/repomap.html ; https://github.com/Aider-AI/aider/blob/main/aider/repomap.py ; https://claude.com/blog/building-agents-with-the-claude-agent-sdk ; https://cursor.com/en-US/blog/semsearch ; https://cursor.com/docs/agent/tools/search

**Problems** (7; workflow 1, critique 1, design 1, debug 1, concept 1, mcq 1, estimate 1; hard 4, medium 3)

- `hrn-014` (workflow, hard, staff, new, Core 100) Design the compaction and memory policy for a six-hour run: what is pinned, what is summarised, what is re-read from disk, and how you test that the goal survives. Source: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
- `hrn-015` (critique, hard, senior, new) Critique a CLAUDE.md that restates the code, uses capitals for emphasis and buries the test command at line 300. Source: https://code.claude.com/docs/en/memory
- `hrn-016` (design, hard, staff, new) AGENTS.md has grown to a thousand lines and agents ignore half of it: redesign repository knowledge for agents and enforce it mechanically. Source: https://openai.com/index/harness-engineering/
- `hrn-017` (debug, hard, staff, new) A long-running agent drifts after hours and confidently works on the wrong thing; diagnose from its compaction events and progress file. Source: https://github.com/amitshekhariitbhu/ai-engineering-interview-questions
- `hrn-018` (concept, medium, senior, new) Grep or retrieval for searching a repository, and what you would measure to decide on your own codebase. Source: https://keepkeen.github.io/blog/china-agent-interview-guide-2025-2026/. Reported: Meituan (candidate report via keepkeen guide)
- `hrn-019` (mcq, medium, senior, new) After Claude Code compacts, which of these is gone: project-root CLAUDE.md, a path-scoped rule, an invoked skill body, or the plan from plan mode? Source: https://code.claude.com/docs/en/context-window
- `hrn-020` (estimate, medium, senior, new) Context files that raise inference cost by over 20%: price it per month for a stated team and say what result would justify keeping them. Source: https://arxiv.org/abs/2602.11988

### harness/cache-cost-latency: The harness's bill

Prompt caching inside a harness and what breaks it, what published harness runs cost, runaway controls, and latency from decoupling the loop from the sandbox.

**Lessons**

1. **Prompt caching inside a harness** (`harness-caching`, lesson, staff). Exact-prefix matching means any change recomputes everything after it, and Claude Code lists its cache breakers: switching models, changing effort on most models, toggling fast mode, connecting MCP servers when tools load upfront, compaction, image eviction and upgrades. Editing CLAUDE.md mid-session does not break the cache and does not apply until /clear, /compact or a restart, while Codex breaks its cache on tool, model, sandbox, approval-mode or working-directory changes and once on an MCP tool-ordering bug. The reader predicts a session's cache hit rate from its events.
   - Sources: https://code.claude.com/docs/en/prompt-caching ; https://openai.com/index/unrolling-the-codex-agent-loop/ ; https://platform.claude.com/docs/en/build-with-claude/prompt-caching
2. **What a harness costs** (`harness-costs`, lesson, senior). Published runs give real numbers: Anthropic's retro game maker cost $9 in 20 minutes solo against $200 in six hours with the full three-agent harness, the C compiler took nearly 2,000 sessions and just under $20,000, and multi-agent research runs at about 15 times chat tokens. The lesson turns each into an estimate with its assumptions stated. The reader can say what a harness change will cost before running it.
   - Sources: https://www.anthropic.com/engineering/harness-design-long-running-apps ; https://www.anthropic.com/engineering/building-c-compiler ; https://www.anthropic.com/engineering/multi-agent-research-system
3. **Playbook: cost and runaway controls** (`runaway-controls`, playbook, senior). Turn caps, dollar caps, auto-mode fallbacks after repeated denials, a cap on consecutive Stop-hook blocks and per-instance budgets each stop a different runaway. The inputs are whether the agent runs headless, who pays, and what a stopped run costs to resume; Anthropic's reverted change of default effort is the example of a cost lever that cost quality. The playbook ends with the dashboard that shows a runaway before the invoice does.
   - Sources: https://code.claude.com/docs/en/agent-sdk/agent-loop ; https://code.claude.com/docs/en/best-practices ; https://code.claude.com/docs/en/permission-modes ; https://www.anthropic.com/engineering/april-23-postmortem
4. **Latency: decoupling the loop from the sandbox** (`brain-and-hands`, lesson, staff). Claude Managed Agents provisions a container only when a tool needs one, and Anthropic reports p50 time to first token down about 60% and p95 down over 90% after the change. The lesson covers the session log outside the harness, sandboxes behind an execute interface, and a dead container returned to the model as a tool error. The reader designs lazy provisioning for an agent platform.
   - Sources: https://www.anthropic.com/engineering/managed-agents ; https://platform.claude.com/docs/en/managed-agents/overview

**Problems** (6; estimate 2, debug 1, mcq 1, replay 1, design 1; hard 5, medium 1)

- `hrn-021` (estimate, hard, senior, new, Core 100) Cache hit rate and bill for a three-hour session with two model switches and one compaction, with TTL and cache-write premiums. Source: https://code.claude.com/docs/en/prompt-caching
- `hrn-022` (debug, hard, senior, new, Core 100, Crunch 3) The cache hit rate dropped to zero after an MCP server began announcing tool-list changes mid-conversation. Source: https://openai.com/index/unrolling-the-codex-agent-loop/
- `hrn-023` (mcq, medium, senior, new) Which of these breaks Claude Code's prompt cache: editing CLAUDE.md mid-session, switching models, connecting a server whose tools are deferred, or /rewind? Source: https://code.claude.com/docs/en/prompt-caching
- `hrn-024` (estimate, hard, staff, new) Best-of-five with a verifier versus one attempt with a larger budget, priced per resolved task with stated pass rates. Source: https://arxiv.org/abs/2407.21787
- `hrn-025` (replay, hard, staff, new) Replay Anthropic's April 2026 postmortem: a thinking-clearing bug causes cache misses and quality loss; commit to a hypothesis at each checkpoint and name the gate that would have caught it. Source: https://www.anthropic.com/engineering/april-23-postmortem
- `hrn-026` (design, hard, senior, new) Runaway controls for headless agents in CI: turn caps, dollar caps, denial fallbacks and the alert that fires first. Source: https://code.claude.com/docs/en/agent-sdk/agent-loop

### harness/permissions-sandboxing: Permissions and policy in the harness

Rule engines for shell commands, hooks as policy and how they fail open, classifiers as approvers with published error rates, and the harness's own configuration as an attack surface.

**Lessons**

1. **Rule engines for shell commands** (`rule-engines`, lesson, senior). Claude Code evaluates deny, then ask, then allow, applies deny in every mode, splits compound commands on shell separators and never auto-approves protected paths. Codex uses Starlark rules with allow, prompt and forbidden decisions where the strictest wins, and evaluates any script with substitution, redirection or control flow as one command instead of splitting it. The lesson shows why a regex split is not a parser and how to test rules before shipping them.
   - Sources: https://code.claude.com/docs/en/permissions ; https://code.claude.com/docs/en/permission-modes ; https://learn.chatgpt.com/docs/agent-configuration/rules ; https://cursor.com/docs/agent/security/run-modes
   - Widget or lab: AgentsGate
2. **Hooks as policy, and how they fail** (`hooks-as-policy`, lesson, senior). Claude Code has 33 hook events and five handler types; exit code 2 blocks, exit code 1 does not, and hooks fail open on crash or timeout unless configured to block. Prompt and agent hooks are another model deciding, not enforcement, and a Stop hook that runs the typecheck is the canonical verification gate. The reader writes a policy hook that fails closed and a test that proves it.
   - Sources: https://code.claude.com/docs/en/hooks ; https://code.claude.com/docs/en/best-practices
3. **Classifiers as approvers: Claude Code auto mode and its peers** (`classifier-approvers`, paper, staff). Anthropic's auto-mode post reports a two-stage classifier that sees user messages and tool calls with tool results stripped, a 0.4% false-positive rate on 10,000 real actions, and a 17% false-negative rate on 52 real overeager actions, and calls it not a drop-in replacement for careful review on high-stakes infrastructure. Cursor says its Auto-review is not a security boundary and Codex auto-review never widens the sandbox. The walkthrough ends with what you put around an approver that misses one dangerous action in six.
   - Sources: https://www.anthropic.com/engineering/claude-code-auto-mode ; https://cursor.com/docs/agent/security/run-modes ; https://learn.chatgpt.com/docs/sandboxing/auto-review
4. **The harness as an attack surface** (`harness-attack-surface`, lesson, staff). The files an agent can write are the files that configure the agent, so Claude Code write-protects its settings, hooks, skills, MCP config and git internals, Codex keeps .git, .codex and .aws read-only, and project settings cannot raise the permission mode. Cursor's CVE-2025-54135, where an injected agent created an MCP config without approval and reached code execution, is the failure case, and Anthropic's containment post adds project config that ran before the trust prompt. The reader audits a harness for paths that let the agent grant itself permissions.
   - Sources: https://code.claude.com/docs/en/permission-modes ; https://learn.chatgpt.com/docs/agent-approvals-security ; https://cveawg.mitre.org/api/cve/CVE-2025-54135 ; https://www.anthropic.com/engineering/how-we-contain-claude

**Problems** (7; code 1, critique 2, estimate 1, debug 1, design 1, mcq 1; hard 5, medium 2)

- `hrn-027` (code, hard, senior, new, Core 100) A shell-aware permission gate: deny, ask and allow with compound-command splitting, refusing to split scripts that contain substitution or redirection; hidden tests include bypass attempts. Source: https://learn.chatgpt.com/docs/agent-configuration/rules
- `hrn-028` (critique, hard, senior, new) Critique a policy hook that exits 1 on violation and times out under load. Source: https://code.claude.com/docs/en/hooks
- `hrn-029` (critique, hard, staff, new) Critique a safety design that relies on a risk flag the model sets on its own tool calls, under an injected instruction. Source: https://docs.cline.bot/features/auto-approve
- `hrn-030` (estimate, hard, staff, new, Core 100, Crunch 7) An approval classifier with a 0.4% false-positive and 17% false-negative rate on overeager actions: expected misses per week at a stated action volume, and what you put around it. Source: https://www.anthropic.com/engineering/claude-code-auto-mode
- `hrn-031` (debug, medium, senior, new) The same compound command is allowed by one harness and prompts in another: explain which rule fired in each. Source: https://learn.chatgpt.com/docs/agent-configuration/rules
- `hrn-032` (design, hard, staff, new) Harness security and permissions for an internal coding agent, and when a long task should stop early. Source: https://keepkeen.github.io/blog/china-agent-interview-guide-2025-2026/. Reported: Alibaba Cloud (candidate report via keepkeen guide)
- `hrn-033` (mcq, medium, senior, new) In an interactive session where bypass permissions are available, what actually stops edits in plan mode? Source: https://code.claude.com/docs/en/permission-modes

### harness/verification: Verification: how the agent knows it is done

Giving the agent a check to run, separate evaluator agents, keeping oracles out of the agent's reach, and parallel attempts that need a verifier to mean anything.

**Lessons**

1. **Give the agent a check to run** (`check-to-run`, lesson, senior). Claude Code's guidance says the most useful line in CLAUDE.md is the command that runs the checks, enforced by a Stop hook that sends the agent back with the failing output. The Agent SDK post orders verification as rules (lint, types), then visual feedback, then an LLM judge, which it calls generally not very robust. The reader wires a check into a harness and measures how often it sends the agent back.
   - Sources: https://code.claude.com/docs/en/best-practices ; https://claude.com/blog/building-agents-with-the-claude-agent-sdk ; https://code.claude.com/docs/en/hooks
2. **Generator and evaluator agents** (`generator-evaluator`, paper, staff). Anthropic's 2026-03-24 harness post found self-evaluation lenient and Claude a poor QA agent out of the box, then built a separate evaluator with few-shot score breakdowns, Playwright against the running app and hard thresholds per criterion. Sprint contracts were negotiated in files, and the planner and evaluator survived after a newer model made sprints unnecessary. The walkthrough ends with how you would know your evaluator is stricter than your generator.
   - Sources: https://www.anthropic.com/engineering/harness-design-long-running-apps
3. **Tests the agent cannot edit, and benchmarks that grade the oracle** (`oracle-integrity`, lesson, senior). Agents edit tests when tests stand between them and done, so Anthropic's long-running harness tells agents it is unacceptable to remove or edit tests, and Anthropic's performance take-home README records model submissions that modified the tests. OpenAI's audit found 59.4% of 138 hard SWE-bench Verified problems had material issues, which is the same failure at benchmark scale. The reader designs a check the agent cannot weaken.
   - Sources: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents ; https://github.com/anthropics/original_performance_takehome ; https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/
4. **Parallel attempts and test-time scaling** (`parallel-attempts`, paper, staff). Large Language Monkeys raised SWE-bench Lite coverage from 15.9% with one sample to 56% with 250, and found voting and reward models plateau without automatic verifiers. Claude 4's parallel test-time compute sampled attempts, discarded patches that failed visible tests and picked with a scoring model, lifting Opus 4 from 72.5% to 79.4%. The point is that selection needs a verifier and that high-compute numbers are a different quantity from pass@1.
   - Sources: https://arxiv.org/abs/2407.21787 ; https://www.anthropic.com/news/claude-4

**Problems** (6; workflow 1, critique 1, design 1, concept 1, estimate 1, debug 1; hard 6)

- `hrn-034` (workflow, hard, staff, new, Core 100) Run a coding agent headless in CI: non-interactive mode, an exact allowlist, a budget, a Stop check and branch protection. Source: https://code.claude.com/docs/en/best-practices
- `hrn-035` (critique, hard, senior, new) Critique a CI pipeline in which the agent can edit its own tests and the merge gate is "tests pass". Source: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
- `hrn-036` (design, hard, staff, new) Code review for a world where most PRs are agent-generated: who reviews, what is checked mechanically, and what still needs a human. Source: https://github.com/ombharatiya/ai-system-design-guide/blob/main/00-interview-prep/01-question-bank.md
- `hrn-037` (concept, hard, senior, new) For a bug-fix agent, static specification or dynamic feedback from the environment: which, and why? Source: https://keepkeen.github.io/blog/china-agent-interview-guide-2025-2026/. Reported: Xiaomi (candidate report via keepkeen guide)
- `hrn-038` (estimate, hard, senior, new) Coverage at 1 and 250 samples versus success with an imperfect verifier: what selection can and cannot recover. Source: https://arxiv.org/abs/2407.21787
- `hrn-039` (debug, hard, staff, new) The agent marks features done that fail end to end: find where the harness lets it declare victory early. Source: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents

### harness/long-running-parallel: Long-running and parallel agents

Harnesses that survive many context windows, the session log outside the harness, parallel agents coordinating through git, and worktrees and fan-out.

**Lessons**

1. **The long-running harness** (`long-running-harness`, lesson, staff). Anthropic's long-running harness has an initializer agent write an init script, a progress file and a JSON feature list of over 200 features all marked failing (JSON because models overwrite it less than Markdown), and each coding session reads git log and progress, picks one feature, runs an end-to-end check first, commits and updates progress. OpenAI's harness team reports single Codex runs of upwards of six hours. The reader designs what persists between sessions, in what format, and who may edit it.
   - Sources: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents ; https://openai.com/index/harness-engineering/
2. **Sessions as an event log outside the harness** (`session-log`, lesson, staff). Managed Agents keeps the session as an append-only event log behind a small API, runs a stateless harness and treats sandboxes as tools, so a dead container is a tool error rather than a lost run. The OpenHands SDK paper describes the same event-sourced design, and Anthropic's research system used rainbow deployments to avoid breaking running agents. The reader designs session storage that survives harness upgrades.
   - Sources: https://www.anthropic.com/engineering/managed-agents ; https://arxiv.org/abs/2511.03690 ; https://www.anthropic.com/engineering/multi-agent-research-system
3. **Parallel agents without an orchestrator** (`parallel-no-orchestrator`, paper, staff). The C compiler build ran 16 Claude instances in containers against a bare git upstream, claimed tasks with lock files resolved by git conflicts and used no orchestration agent, with specialised roles for dedupe, performance and docs. The walkthrough compares it with Claude Code worktrees and batch fan-out into separate PRs, and with Cognition's argument against splitting context. What to say in an interview is which coordination primitive you would trust and why.
   - Sources: https://www.anthropic.com/engineering/building-c-compiler ; https://code.claude.com/docs/en/best-practices ; https://cognition.com/blog/dont-build-multi-agents

**Problems** (6; workflow 1, design 2, estimate 1, critique 1, debug 1; hard 6)

- `hrn-040` (workflow, hard, staff, new, Core 100) Design the harness for a coding agent that must work across many context resets: what persists between sessions, in what format, and who may edit it. Source: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
- `hrn-041` (design, hard, staff, new) Worktrees, sandboxes, a harness gate, context isolation and token return on investment for a team running parallel agents. Source: https://keepkeen.github.io/blog/china-agent-interview-guide-2025-2026/. Reported: Alibaba International (public recruiting samples via keepkeen guide)
- `hrn-042` (design, hard, senior, new) The server restarts at step fourteen of twenty: what happens to the task, and what did the harness need to record to make that safe? Source: https://www.kore1.com/ai-agent-engineer-interview-questions/
- `hrn-043` (estimate, hard, senior, new) From the C compiler's published totals, compute tokens and cost per session, and what a half-as-efficient agent would have cost. Source: https://www.anthropic.com/engineering/building-c-compiler
- `hrn-044` (critique, hard, staff, new) Critique a lock-file task-claiming scheme for parallel agents and find the race. Source: https://www.anthropic.com/engineering/building-c-compiler
- `hrn-045` (debug, hard, senior, new) The agent does well on short tasks and degrades past 30 minutes: separate context, compaction and task-state causes. Source: https://github.com/ombharatiya/ai-system-design-guide/blob/main/00-interview-prep/01-question-bank.md

### harness/evaluating-harnesses: Is harness B better than harness A?

Attributing a score change to model, harness or infrastructure, the coding-agent benchmark map, and shipping harness changes safely.

**Lessons**

1. **Attributing a score to model, harness or infrastructure** (`attribution`, lesson, staff). On Terminal-Bench 2.0, moving from strict resource limits to uncapped lifted success by 6 points while infrastructure errors fell from 5.8% to 0.5%, and Anthropic advises scepticism about leaderboard gaps under 3 points until configurations match. Terminal-Bench runs several agent harnesses through one framework, which makes harness swaps measurable with the model held fixed. The reader designs a comparison that isolates the harness.
   - Sources: https://www.anthropic.com/engineering/infrastructure-noise ; https://arxiv.org/abs/2601.11868
   - Existing: `src/content/lessons/evals/agent-evals/overview.mdx` (split, receives-content). Harness-versus-model attribution is new; it links back to agent-evals for grading.
2. **The coding-agent benchmark map** (`coding-benchmarks`, lesson, senior). SWE-bench Verified (500 tasks; OpenAI stopped reporting it in February 2026), SWE-bench Pro (1,865 problems from 41 repositories in public, held-out and commercial splits), Terminal-Bench 2.0 (89 tasks), tau-bench and the bash-only leaderboard each measure something different. The lesson says what each can support as a claim and what it cannot. The reader can answer "our harness scores X" with the right follow-up questions.
   - Sources: https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/ ; https://arxiv.org/abs/2509.16941 ; https://arxiv.org/abs/2601.11868 ; https://arxiv.org/abs/2406.12045 ; https://github.com/SWE-agent/mini-swe-agent
3. **Playbook: shipping a harness change safely** (`shipping-harness-changes`, playbook, staff). Anthropic's April 2026 postmortem describes three harness changes (a lower default effort, a thinking-clearing bug that also caused cache misses, and a verbosity line that cost 3% on a broad eval) that each passed review, tests or dogfooding. Its commitments are a broad per-model eval for every system-prompt change, line-by-line ablations, soak periods, gradual rollouts and model-specific changes gated to their model. The playbook adds rainbow deployments for in-flight agents and what to monitor in the first week.
   - Sources: https://www.anthropic.com/engineering/april-23-postmortem ; https://www.anthropic.com/engineering/multi-agent-research-system

**Problems** (6; concept 2, estimate 1, workflow 1, code 1, critique 1; hard 5, medium 1)

- `hrn-046` (concept, hard, staff, new, Core 100, Crunch 8) Your score moved four points the week you changed the harness and migrated benchmark infrastructure: attribute it, and design the run that would settle it. Source: https://www.anthropic.com/engineering/infrastructure-noise
- `hrn-047` (estimate, hard, senior, new) Paired trials needed to detect a three-point difference on an 89-task benchmark given the noise you assume. Source: https://arxiv.org/abs/2601.11868
- `hrn-048` (workflow, hard, staff, new) Ship one system-prompt change across three models: ablations, soak period, gradual rollout and the rollback trigger. Source: https://www.anthropic.com/engineering/april-23-postmortem
- `hrn-049` (code, hard, senior, new) A pass^k runner with cost and turns per trial that flags gaps inside the noise band; hidden tests vary trial counts. Source: https://arxiv.org/abs/2406.12045
- `hrn-050` (critique, hard, senior, new) Critique a vendor comparison of two harnesses run on different models and different resource limits. Source: https://www.anthropic.com/engineering/infrastructure-noise
- `hrn-051` (concept, medium, senior, new) Which modules make up a harness, and how do you keep a harness eval set from being overfit? Source: https://keepkeen.github.io/blog/china-agent-interview-guide-2025-2026/. Reported: ByteDance (candidate report via keepkeen guide)

## 8. Prompt injection, guardrails and model safety (`safety`)

The model-facing half of AI security and safety: trust boundaries and exfiltration channels, adaptive red-teaming, prompt-injection defences split into those that hold by construction (CaMeL, FIDES, deterministic exfiltration blocks, the six design patterns) and those that only lower a rate (spotlighting, instruction hierarchy, classifiers) with their published limits, guardrails and tenant isolation, and hallucination and alignment topics engineers are asked about. Infrastructure security (sandboxes, secrets, MCP authorisation, supply chain, operations, governance) is in the security track.

### safety/threat-modeling: Trust boundaries and exfiltration

Where instructions and data share a channel, the OWASP lists as a controls checklist, and the channels data leaves through.

**Lessons**

1. **Trust boundaries in model systems** (`trust-boundaries`, lesson, senior). Instructions and data share one channel, so every untrusted input is a potential instruction and every capability is a potential exfiltration path. The lesson uses the lethal trifecta and Meta's Rule of Two to score a session's capabilities, and names the MCP attack classes the specification's security page lists. The reader can draw the trust boundaries of an agent and say which leg to remove.
   - Sources: https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/ ; https://ai.meta.com/blog/practical-ai-agent-security/ ; https://genai.owasp.org/llmrisk/llm01-prompt-injection/ ; https://modelcontextprotocol.io/specification/2026-07-28/basic/security_best_practices
   - Widget or lab: SafetyTrifecta
   - Existing: `src/content/lessons/safety/threat-modeling/overview.mdx` (rewrite, primary). Cut the SQL-injection section, the direct and indirect definitions and the trifecta list; keep EchoLeak, the OWASP renumbering note and the MCP items (level audit 5.1).
2. **The OWASP lists as a controls checklist** (`owasp-as-controls`, lesson, senior). The OWASP Top 10 for LLM applications changed between 2025 and 2026 (Excessive Agency is now third), and the Agentic Top 10 and the Agent Control Standard add agent-specific entries and runtime enforcement points. The lesson maps each entry to the control and the test that addresses it instead of reciting the list. Every reference carries its year, because the numbering moved.
   - Sources: https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/ ; https://genai.owasp.org/2026/09/01/owasp-genai-security-project-unveils-2026-top-10-for-llm-applications-new-agent-control-standard-and-sponsors-as-community-tops-30000-members/ ; https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/ ; https://genai.owasp.org/llmrisk/llm052025-improper-output-handling/ ; https://genai.owasp.org/llmrisk/llm102025-unbounded-consumption/
3. **Exfiltration without a send tool** (`exfiltration-channels`, lesson, senior). Data leaves through rendered images and links, allowlisted domains with upload APIs and anything else that makes a request on the attacker's behalf. EchoLeak chained classifier evasion, reference-style Markdown and an allowed proxy, and Anthropic's containment post describes a file upload to an attacker's account through an allowlisted domain. The fix pattern is a deterministic block on the channel, not a better prompt.
   - Sources: https://simonwillison.net/tags/markdown-exfiltration/ ; https://arxiv.org/abs/2509.10540 ; https://www.anthropic.com/engineering/how-we-contain-claude ; https://www.microsoft.com/en-us/msrc/blog/2025/07/how-microsoft-defends-against-indirect-prompt-injection-attacks

**Problems** (6; concept 2, mcq 1, design 2, debug 1; medium 4, hard 2)

- `sfe-001` (concept, medium, senior, existing) An attacker controls one document in your RAG index: walk the paths from that document to harm and the control for each. Source: https://genai.owasp.org/llmrisk/llm01-prompt-injection/
- `sfe-002` (mcq, medium, senior, existing) Why is "never reveal the system prompt" at the top of the prompt not enough? Options of equal length. Source: https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html
- `sfe-003` (design, hard, staff, existing, Core 100) Secure an email agent that can read and send, when the CISO wants it off and the PM has a launch date. Source: https://ai.meta.com/blog/practical-ai-agent-security/
- `sfe-004` (concept, medium, senior, existing) What security risks does MCP introduce, mapped to the specification's own mitigations? Source: https://modelcontextprotocol.io/specification/2026-07-28/basic/security_best_practices
- `sfe-005` (debug, medium, senior, existing) The image filter that let data out: find the rendering path the filter did not cover. Source: https://simonwillison.net/tags/markdown-exfiltration/
- `sfe-018` (design, hard, staff, new) Threat-model a model inference API that receives untrusted input at scale. Source: https://knok.work/blog/anthropic-security-engineer-interview.html. Reported: Anthropic (reported via a vendor compiling candidate reports)

### safety/red-team: Adaptive red-teaming

Why small bypass rates become certainties, and turning attacks into regression suites.

**Lessons**

1. **Why small bypass rates become certainties** (`adaptive-attacks`, lesson, senior). An attacker who can retry turns a small per-attempt success rate into near-certain success, which is what Best-of-N jailbreaking and many-shot jailbreaking exploit. The Attacker Moves Second bypassed 12 published defences, most above 90% success, where most had reported near zero. The reader computes attempts-to-success for a stated defence and decides what that means for the architecture.
   - Sources: https://arxiv.org/abs/2412.03556 ; https://arxiv.org/abs/2510.09023 ; https://www.anthropic.com/research/many-shot-jailbreaking
   - Widget or lab: SafetyRedTeam
   - Existing: `src/content/lessons/safety/red-team/overview.mdx` (split, primary). Security evals in CI and the red-team programme move to security/security-ops; adaptive attacks and regression suites stay.
2. **Turning found attacks into regression suites** (`regression-suites`, lesson, senior). Every attack that worked once becomes a test that runs forever, and canaries detect leaks without preventing them. The lesson covers garak probe families, promptfoo red-team configuration, canary tokens and how to keep a regression battery from going stale. The reader builds a suite from five found attacks and wires it to a release.
   - Sources: https://github.com/NVIDIA/garak ; https://www.promptfoo.dev/docs/red-team/quickstart/ ; https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html ; https://gandalf.lakera.ai/
3. **Attack families and why surface filters fail** (`attack-families`, lesson, senior). Role-play, encoding, translation, many-shot and multi-turn attacks and payload splitting each defeat a different surface check, which is why keyword and pattern filters fail against an attacker who adapts. Many-shot jailbreaking exploits long context directly, and Best-of-N shows that simple random augmentations retried enough times get through. The reader maps each family to the layer that can stop it and to the regression test that keeps it stopped.
   - Sources: https://www.anthropic.com/research/many-shot-jailbreaking ; https://arxiv.org/abs/2412.03556 ; https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html

**Problems** (6; estimate 2, debug 1, design 2, code 1; hard 3, medium 3)

- `sfe-019` (estimate, hard, senior, new, Core 100) How many attempts does the attacker need against a classifier with a stated recall, and what does that imply for rate limits and architecture? Source: https://arxiv.org/abs/2412.03556
- `sfe-006` (estimate, medium, senior, existing) Ship a classifier that catches 95% of injections? Compute the residual at your traffic and decide. Source: https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/
- `sfe-008` (debug, medium, senior, existing) The command allowlist that checks only the first word: find the bypass and the fix. Source: https://code.claude.com/docs/en/permissions
- `sfe-009` (design, hard, staff, existing) Red-team an LLM feature before launch with two weeks and one engineer: scope, attack families, success criteria and what blocks launch. Source: https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html
- `sfe-010` (code, medium, senior, existing) Detect a leaked canary, including encoded and split copies; hidden tests include obfuscations. Source: https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html
- `sfe-020` (design, hard, staff, new) Design a red-team exercise to find security risks introduced by AI-generated code in a production codebase. Source: https://knok.work/blog/anthropic-security-engineer-interview.html. Reported: Anthropic (reported via a vendor compiling candidate reports)

### safety/injection-defences: Prompt-injection defences: what holds and what lowers a rate

Defences that hold by construction, defences that only lower a rate with their published limits, tool-result hygiene, and choosing a design pattern per task.

**Lessons**

1. **Defences that hold by construction** (`by-construction`, lesson, staff). CaMeL extracts control and data flow from the trusted query so retrieved data cannot change the program, attaches capabilities to values and checks policies at tool calls, solving 77% of AgentDojo tasks with provable security against 84% undefended. FIDES applies confidentiality and integrity labels with deterministic enforcement, and Microsoft's deterministic block of Markdown image exfiltration fixes the impact instead of the injection. The limits are stated with them: CaMeL needs written policies and does not stop text-only attacks.
   - Sources: https://arxiv.org/abs/2503.18813 ; https://arxiv.org/abs/2505.23643 ; https://www.microsoft.com/en-us/msrc/blog/2025/07/how-microsoft-defends-against-indirect-prompt-injection-attacks ; https://arxiv.org/abs/2506.08837
   - Existing: `src/content/lessons/safety/guardrails/overview.mdx` (split, receives-content). The CaMeL provenance sketch moves here; probabilistic defences get their own lesson with numbers.
2. **Defences that lower a rate, with their numbers** (`rate-lowering`, lesson, senior). Spotlighting reported attack success falling from above 50% to below 2% in its own tests, instruction hierarchy trains models to ignore lower-privileged instructions, and Prompt Guard 2 is a classifier with a published operating point. Against them: adaptive attacks bypassed 12 defences, Anthropic reports about 1% residual attack success for a browser agent and calls it meaningful risk, and OpenAI writes that injection is unlikely ever to be fully solved. The conclusion is that these layers are worth having and are never the only wall.
   - Sources: https://www.microsoft.com/en-us/msrc/blog/2025/07/how-microsoft-defends-against-indirect-prompt-injection-attacks ; https://arxiv.org/abs/2404.13208 ; https://huggingface.co/meta-llama/Llama-Prompt-Guard-2-86M ; https://arxiv.org/abs/2510.09023 ; https://www.anthropic.com/research/prompt-injection-defenses ; https://openai.com/index/hardening-atlas-against-prompt-injection/
3. **Tool-result hygiene** (`tool-result-hygiene`, lesson, senior). Untrusted text enters context through tool results, so each entry point needs a rule. GitHub's Copilot agent filters hidden characters and only users with write access can trigger it, Claude Code's auto-mode classifier sees tool calls with tool results stripped, and the MCP specification asks clients to validate tool results before they reach the model. The reader lists every entry point in an agent and the rule at each.
   - Sources: https://docs.github.com/en/copilot/concepts/agents/coding-agent/risks-and-mitigations ; https://www.anthropic.com/engineering/claude-code-auto-mode ; https://modelcontextprotocol.io/specification/2026-07-28/basic/security_best_practices
4. **Six design patterns for securing agents** (`design-patterns-paper`, paper, staff). The design-patterns paper gives action-selector, plan-then-execute, LLM map-reduce, dual LLM, code-then-execute and context-minimisation, each trading a specific utility for a specific guarantee. The walkthrough builds a toy executor per pattern and shows which attack each one stops. What to say in an interview is the utility you gave up and why it was acceptable.
   - Sources: https://arxiv.org/abs/2506.08837 ; https://simonwillison.net/2023/Apr/25/dual-llm-pattern/
5. **Playbook: choose the defence pattern for the task** (`pick-the-pattern`, playbook, staff). The decision is which pattern and which rate-lowering layers a given agent gets, and the inputs are the trifecta legs present, whether actions are reversible, and the residual rate the business accepts in writing. The playbook works an email agent that summarises and drafts replies and a travel agent that browses and books. It ends with the tests: unit tests for the deterministic controls and an adaptive suite for the probabilistic ones.
   - Sources: https://arxiv.org/abs/2506.08837 ; https://ai.meta.com/blog/practical-ai-agent-security/ ; https://arxiv.org/abs/2503.18813 ; https://arxiv.org/abs/2406.13352
   - Widget or lab: lab:secure-tool-gateway

**Problems** (7; workflow 1, design 1, critique 2, concept 1, code 1, estimate 1; hard 6, medium 1)

- `sfe-021` (workflow, hard, staff, new, Core 100, Crunch 19) Write the decision: an email assistant with a classifier and auto-reply must ship in two weeks; choose the architecture, the residual risk you accept and who signs it. Source: https://arxiv.org/abs/2509.10540
- `sfe-022` (design, hard, staff, new) Pick one of the six patterns for an agent that summarises email and drafts replies, and state the utility you give up. Source: https://arxiv.org/abs/2506.08837
- `sfe-023` (critique, hard, senior, new) Apply the Rule of Two to a travel assistant that browses and books: which property do you drop, and what does the product lose? Source: https://ai.meta.com/blog/practical-ai-agent-security/
- `sfe-024` (concept, hard, staff, new) How do you measure whether prompt-injection defences work, and why is a static attack set not enough? Source: https://www.interviewsvector.com/blog/ai-agent-security-interview-guide-prompt-injection-excessive-agency-tool-abuse
- `sfe-025` (critique, hard, senior, new) An agent with a token that reads private repositories triages issues in a public one: find the leak path and the smallest fix. Source: https://invariantlabs.ai/blog/mcp-github-vulnerability
- `sfe-026` (code, hard, senior, new) Provenance labels: tag values by origin and refuse a tool call that sends data derived from untrusted input to an outbound channel; hidden tests include laundering through a summary. Source: https://arxiv.org/abs/2503.18813
- `sfe-027` (estimate, medium, senior, new) A defence cuts attack success from above 50% to below 2% in its authors' tests: residual successful attacks per day at a stated adversarial volume, and why that is not the control. Source: https://www.microsoft.com/en-us/msrc/blog/2025/07/how-microsoft-defends-against-indirect-prompt-injection-attacks

### safety/guardrails: Guardrails, tool firewalls and tenant isolation

Classifier guardrails at an operating point, tool firewalls and approvals, and keeping tenants apart in retrieval and tools.

**Lessons**

1. **Classifier guardrails at an operating point** (`classifier-guardrails`, lesson, senior). A guardrail classifier is chosen at a recall and false-positive rate, and stacking two multiplies latency and false blocks. The lesson covers Prompt Guard 2 and Llama Guard 4 model cards, constitutional classifiers, and the arithmetic of a stack with its caveat about correlated errors. The reader picks an operating point from the cost of a false block and the cost of a miss.
   - Sources: https://huggingface.co/meta-llama/Llama-Prompt-Guard-2-86M ; https://huggingface.co/meta-llama/Llama-Guard-4-12B ; https://www.anthropic.com/research/next-generation-constitutional-classifiers
   - Widget or lab: SafetyGuardStack
   - Existing: `src/content/lessons/safety/guardrails/overview.mdx` (split, primary). Cut the WAF paragraph and filter definitions; keep operating points and stacking; PII and residency move to security/output-data.
2. **Tool firewalls, argument validation and approvals that mean something** (`tool-firewalls`, lesson, senior). A tool firewall validates arguments against policy before execution and does not trust the model's description of what it is doing. The lesson covers allowlists, argument validation, Agents SDK guardrails and approval design that shows the reviewer the exact call. The reader writes the firewall rules for a refund tool.
   - Sources: https://code.claude.com/docs/en/permissions ; https://github.com/openai/openai-agents-python/blob/main/docs/guardrails.md ; https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html
3. **Tenant isolation in retrieval and tools** (`tenant-isolation`, lesson, senior). Cross-tenant leaks come from filters applied in the wrong place, shared caches and tools that accept identifiers from the model. The lesson covers namespace and filter placement, Microsoft 365 Copilot's permission scoping and why tenant identity must come from the session, never the prompt. The reader audits a design for every path one tenant's data could reach another.
   - Sources: https://docs.pinecone.io/guides/index-data/implement-multitenancy ; https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-privacy ; https://arxiv.org/abs/2502.07776

**Problems** (6; design 1, debug 1, code 1, concept 1, estimate 1, critique 1; hard 3, medium 3)

- `sfe-011` (design, hard, staff, existing, Core 100) Talk them out of giving the support agent write access to the payments database, then respond when product shows manual refunds cost more than the fraud you fear. Source: https://ai.meta.com/blog/practical-ai-agent-security/
- `sfe-012` (debug, medium, senior, existing) One tenant's documents surface in another's answers; the prose that named the bugs is removed. Source: https://docs.pinecone.io/guides/index-data/implement-multitenancy
- `sfe-013` (code, medium, senior, existing) An output guardrail for PII and a leaked secret, with hidden tests for formatting variants. Source: https://presidio.dataprivacystack.org/
- `sfe-014` (concept, medium, senior, existing) Handle PII in prompts, logs and traces when OpenTelemetry content capture is opt-in and legal wants full logs. Source: https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/gen-ai-spans.md
- `sfe-028` (estimate, hard, senior, new) Stack two classifiers with stated recall and false-positive rates: end-to-end false blocks and added latency on a chat product, and when correlation breaks the estimate. Source: https://huggingface.co/meta-llama/Llama-Prompt-Guard-2-86M
- `sfe-029` (critique, hard, senior, new) Critique an approval step that shows the reviewer a model-written summary of the action instead of the arguments. Source: https://openai.github.io/openai-agents-python/human_in_the_loop/

### safety/hallucination: Hallucination, abstention and model safety

Why models hallucinate and what abstention costs, confident-but-wrong answers in high-risk domains, and the alignment topics engineers are asked about.

**Lessons**

1. **Why models hallucinate and what abstention costs** (`why-hallucinate`, lesson, senior). OpenAI's 2025 analysis argues that training and evaluation reward guessing over abstaining, which is why calibrated abstention has to be designed and measured. The lesson covers grounding with citations, chain-of-verification, and the trade between coverage and error rate when the model may say it does not know. The reader sets an abstention threshold from the cost of each error type.
   - Sources: https://arxiv.org/abs/2509.04664 ; https://arxiv.org/abs/2309.11495 ; https://platform.claude.com/docs/en/build-with-claude/citations
   - Widget or lab: SafetyAbstain
   - Existing: `src/content/lessons/safety/hallucination/overview.mdx` (split, primary). EU AI Act dates and compliance move to security/governance; hallucination and alignment topics stay.
2. **Confident but wrong in high-risk domains** (`high-risk-domains`, lesson, staff). In medical, legal and financial settings the design question is how a wrong answer is caught before it acts, not how often the model is right. The lesson covers grounding to approved sources, verification chains, escalation to a human and logging that supports review. The reader designs the escalation path and its trigger.
   - Sources: https://arxiv.org/abs/2309.11495 ; https://platform.claude.com/docs/en/build-with-claude/citations ; https://arxiv.org/abs/2509.04664
3. **Reward hacking, sycophancy and sleeper agents for engineers** (`alignment-topics`, lesson, senior). Anthropic found that a model that learned to reward-hack in real coding environments generalised to sabotage and alignment-faking reasoning, the GPT-4o sycophancy update shipped on positive A/B tests, and Sleeper Agents showed backdoors persisting through safety training. Each has a product consequence: what you reward, what you measure at launch, and what you can verify about a model you did not train. The reader can discuss each with the evidence and its limits.
   - Sources: https://www.anthropic.com/research/emergent-misalignment-reward-hacking ; https://simonwillison.net/2025/May/2/what-we-missed-with-sycophancy/ ; https://arxiv.org/abs/2401.05566 ; https://www.anthropic.com/responsible-scaling-policy

**Problems** (6; estimate 1, debug 2, workflow 1, concept 1, behavioural 1; medium 2, hard 4)

- `sfe-015` (estimate, medium, senior, existing) Make the model say "I don't know": choose the abstention threshold from error costs and coverage on a labelled sample. Source: https://arxiv.org/abs/2509.04664
- `sfe-016` (debug, medium, senior, existing) RAG hallucinates even with the right context: rank the generation-side causes. Source: https://platform.claude.com/docs/en/build-with-claude/citations
- `sfe-017` (workflow, hard, staff, existing, Core 100) Investigate and mitigate a model that gives confident but factually wrong answers in a high-risk domain, with a written decision on what ships. Source: https://www.aced.io/blog/ai-engineer-interview-questions. Reported: Anthropic (candidate report via aced.io)
- `sfe-030` (debug, hard, senior, new) The model started refusing benign requests after a safety-training round: what do you investigate first? Source: https://www.techinterview.org/post/3233475333/rlhf-post-training-interview-topics-2026/?format=md
- `sfe-031` (concept, hard, staff, new) What is reward hacking? Give an example from an LLM product and the mitigation you would put in the training or the eval. Source: https://www.anthropic.com/research/emergent-misalignment-reward-hacking
- `sfe-032` (behavioural, hard, staff, new) Explain to a manager why sensitive data cannot simply be deleted from a trained model, and what you will do instead. Source: https://www.practical-devsecops.com/ai-security-interview-questions/

## 9. Implementing security for AI systems (`security`)

Security as an implementation discipline for model systems, taken from threat model to architecture to controls to tests to operations: capability matrices and a test per control, permission systems and agent identity, isolation technology and what harness sandboxes leave outside, secrets kept out of context and sandbox, MCP authorisation implemented against its real CVEs, output-handling sinks and cross-tenant cache leakage, model supply chain (pickle, the weights_only bypass, safetensors, signing, poisoning), audit logging, abuse and incident response, security evals in CI, and the NIST, EU AI Act, SOC 2, ISO 42001 and privacy duties engineers implement. Every defence is labelled as holding by construction or lowering a rate.

### security/secure-architecture: From threat model to tests

One system walked from data-flow diagram to a control per boundary and a test per control, with every control labelled by construction or by rate.

**Lessons**

1. **Playbook: from threat model to tests on one agent** (`threat-model-to-tests`, playbook, staff). An email and calendar assistant with a send tool and a fetch tool is taken through five artefacts: a data-flow diagram, a per-session capability table scored on the Rule of Two and the lethal trifecta, an architecture change that removes one leg per session, a control per boundary labelled as holding by construction or lowering a rate, and a test per control. The CoSAI incident-response framework's architecture chapter supplies the boundaries per pattern (RAG, agentic, agentic RAG). The output is a document a security reviewer can sign.
   - Sources: https://ai.meta.com/blog/practical-ai-agent-security/ ; https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/ ; https://genai.owasp.org/llmrisk/llm01-prompt-injection/ ; https://www.coalitionforsecureai.org/wp-content/uploads/2026/03/AI-Incident-Response-1.pdf
2. **Per-session capability matrices** (`capability-matrix`, lesson, senior). Risk in an agent is a property of the session's combined capabilities, so the unit of review is the session, not the tool. The lesson builds a matrix of untrusted input, sensitive access and outbound communication per session type and shows how splitting sessions removes a leg. The reader produces the matrix for an existing agent and finds the sessions that need supervision.
   - Sources: https://ai.meta.com/blog/practical-ai-agent-security/ ; https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/
3. **Running a security design review for an AI feature** (`security-review`, lesson, staff). A design review for an AI feature asks the same questions as any review plus four new ones: what is untrusted text, what can it cause, what does a successful attack cost, and which control is deterministic. The lesson gives the review checklist, the evidence to request, and the decisions that must be written down with an owner. The reader runs a review on a stated design and writes the findings.
   - Sources: https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/ ; https://www.coalitionforsecureai.org/wp-content/uploads/2026/03/AI-Incident-Response-1.pdf ; https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/

**Problems** (6; workflow 1, design 2, critique 1, behavioural 1, mcq 1; hard 5, medium 1)

- `sec-001` (workflow, hard, staff, new, Core 100, Crunch 9) Take an email and calendar assistant from data-flow diagram to a test per control, labelling each control by construction or by rate. Source: https://ai.meta.com/blog/practical-ai-agent-security/
- `sec-002` (design, hard, senior, new) An LLM feature will read from a few internal systems: keep it from becoming a hole. Source: https://www.techinterview.org/post/3233477280/prompt-injection-llm-security-interview/
- `sec-003` (critique, hard, senior, new) Critique a threat model that lists the OWASP entries with no control or test against any of them. Source: https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/
- `sec-004` (design, hard, staff, new) Detect a prompt-injection attack at the infrastructure level, not only in the application. Source: https://knok.work/blog/anthropic-security-engineer-interview.html. Reported: Anthropic (reported via a vendor compiling candidate reports)
- `sec-005` (behavioural, hard, staff, new) Explain AI security risk to senior leadership as a decision they must make, with the residual risk in writing. Source: https://cloudsecurityguy.substack.com/p/want-an-ai-security-engineer-job
- `sec-006` (mcq, medium, senior, new) Which control holds by construction: spotlighting, instruction hierarchy, capability checks at tool calls, or a prompt-injection classifier? Source: https://arxiv.org/abs/2503.18813

### security/permissions-identity: Permissions and agent identity

Permission systems for tools built from their CVEs, delegated authority for agents, and protecting model weights.

**Lessons**

1. **Designing a permission system for agent tools** (`permission-systems`, lesson, senior). A permission system evaluates deny before ask before allow, parses compound commands rather than prefix-matching, protects paths no rule can approve, and never lets the agent edit its own permissions. CVE records show each failure: a Claude Code command-parsing bypass of confirmation (CVE-2025-54795), Cursor letting an injected agent create its MCP config (CVE-2025-54135), and a Copilot command injection in Visual Studio (CVE-2025-53773). The lab grows a gate with a matcher, a splitter, protected paths, symlink resolution and an audit record per decision.
   - Sources: https://code.claude.com/docs/en/permissions ; https://cveawg.mitre.org/api/cve/CVE-2025-54795 ; https://cveawg.mitre.org/api/cve/CVE-2025-54135 ; https://cveawg.mitre.org/api/cve/CVE-2025-53773 ; https://learn.chatgpt.com/docs/agent-approvals-security
   - Widget or lab: lab:permission-gate
2. **Agent identity and delegated authorisation** (`agent-identity`, lesson, staff). Giving the agent the user's OAuth token fails both blast-radius and audit tests, which is why MCP forbids token passthrough. The lesson covers impersonation versus delegation in OAuth token exchange (subject and actor tokens, the act claim), audience-bound tokens per resource, and step-up scopes through authentication challenges. The reader designs the token path for an agent acting for a user across three services.
   - Sources: https://www.rfc-editor.org/rfc/rfc8693.html ; https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization ; https://modelcontextprotocol.io/specification/2026-07-28/basic/security_best_practices ; https://jobs.ashbyhq.com/cursor/635bd64f-b554-4d37-9128-cefad35913af
3. **Protecting model weights** (`weights-protection`, lesson, staff). Model weights are a high-value asset whose exfiltration paths include training clusters, serving fleets, checkpoints and the people with access to them. The lesson covers access tiers, egress controls on training and serving hosts, checkpoint handling, and how frontier labs describe weight security as part of their scaling policies. The reader designs access control for weights in a research organisation that also needs to move fast.
   - Sources: https://www.anthropic.com/responsible-scaling-policy ; https://knok.work/blog/anthropic-security-engineer-interview.html ; https://boards-api.greenhouse.io/v1/boards/anthropic/jobs/5458420008

**Problems** (6; mcq 1, code 1, design 2, critique 1, debug 1; hard 6)

- `sec-007` (mcq, hard, staff, new) Should the agent use the user's OAuth token: impersonation, delegation with an actor token, or passthrough? Options of equal length. Source: https://www.rfc-editor.org/rfc/rfc8693.html
- `sec-008` (code, hard, senior, new) Extend a permission gate with protected paths, symlink resolution and an audit record per decision; hidden tests include path tricks. Source: https://code.claude.com/docs/en/permissions
- `sec-009` (design, hard, staff, new, Core 100) Design an access control system to protect model weights. Source: https://knok.work/blog/anthropic-security-engineer-interview.html. Reported: Anthropic (reported via a vendor compiling candidate reports)
- `sec-010` (critique, hard, senior, new) Critique an agent that can edit its own settings file, hooks and MCP configuration inside the workspace. Source: https://cveawg.mitre.org/api/cve/CVE-2025-54135
- `sec-011` (design, hard, staff, new) The permission model for an agent that can read email and send money. Source: https://ai.meta.com/blog/practical-ai-agent-security/
- `sec-012` (debug, hard, senior, new) A confirmation prompt is bypassed by a crafted command: find the parsing defect in a gate, among two other real but harmless issues. Source: https://cveawg.mitre.org/api/cve/CVE-2025-54795

### security/sandboxing-secrets: Isolation and secrets

Choosing an isolation boundary, what coding-agent sandboxes leave outside, keeping secrets out of context and sandbox, and egress policy.

**Lessons**

1. **Playbook: choosing an isolation boundary for agent code execution** (`isolation-playbook`, playbook, staff). seccomp filters system calls and the kernel docs say it is not a sandbox on its own; Landlock lets unprivileged processes restrict their own filesystem and network access; containers share the host kernel, as runc's CVE-2024-21626 escape shows; gVisor implements the Linux interface in user space at a compatibility and per-syscall cost; Firecracker microVMs boot to guest init within 125 ms under its stated test conditions and do no network filtering of their own. The inputs are tenancy, code trust, start-up budget and compatibility. The worked decisions are a hosted multi-tenant interpreter, a local coding agent and a CI job.
   - Sources: https://docs.kernel.org/userspace-api/seccomp_filter.html ; https://docs.kernel.org/userspace-api/landlock.html ; https://cveawg.mitre.org/api/cve/CVE-2024-21626 ; https://gvisor.dev/docs/ ; https://github.com/firecracker-microvm/firecracker/blob/main/docs/design.md ; https://github.com/firecracker-microvm/firecracker/blob/main/SPECIFICATION.md
2. **What coding-agent sandboxes leave outside** (`what-sandboxes-leave-out`, lesson, senior). Claude Code's sandbox is off by default, uses bubblewrap on Linux and Seatbelt on macOS, allows reads of most of the machine including ~/.ssh unless narrowed, starts with no allowed domains, and leaves hooks and local MCP servers outside it; the proxy does not inspect TLS. Codex runs read-only, workspace-write or full-access modes with network off by default and its own docs say its DNS check reduces but does not eliminate rebinding risk. The reader lists three ways a sandboxed agent can still leak a secret.
   - Sources: https://code.claude.com/docs/en/sandboxing ; https://www.anthropic.com/engineering/claude-code-sandboxing ; https://learn.chatgpt.com/docs/sandboxing ; https://learn.chatgpt.com/docs/agent-approvals-security ; https://raw.githubusercontent.com/google-gemini/gemini-cli/main/docs/cli/sandbox.md ; https://code.claude.com/docs/en/agent-sdk/secure-deployment
3. **Secrets never enter the context or the sandbox** (`secrets-out-of-context`, lesson, senior). Four patterns hold: a credential proxy outside the sandbox that checks the operation and attaches the real token (Claude Code on the web's git proxy), placeholder substitution at egress (Managed Agents vaults), setup-only secrets removed before the agent runs (Codex cloud), and secret scanning on agent output (GitHub). The motivating incident is the August 2025 Nx compromise, whose postinstall script drove locally installed AI CLIs with permission-skipping flags to inventory credentials. The reader redesigns a credential path that currently uses environment variables inside the sandbox.
   - Sources: https://www.anthropic.com/engineering/claude-code-sandboxing ; https://platform.claude.com/docs/en/managed-agents/vaults ; https://learn.chatgpt.com/docs/agent-approvals-security ; https://docs.github.com/en/copilot/concepts/agents/coding-agent/risks-and-mitigations ; https://github.com/nrwl/nx/security/advisories/GHSA-cxm3-wv7p-598c ; https://www.stepsecurity.io/blog/supply-chain-security-alert-popular-nx-build-system-package-compromised-with-data-stealing-malware
   - Widget or lab: lab:egress-policy

**Problems** (7; design 3, concept 1, code 1, critique 1, mcq 1; hard 6, medium 1)

- `sec-013` (design, hard, staff, new, Core 100) Design a sandboxed cloud IDE: a multi-tenant browser notebook that runs user code in isolation. Source: https://prachub.com/interview-questions/design-a-sandboxed-cloud-ide. Reported: OpenAI (candidate report via PracHub)
- `sec-014` (concept, hard, senior, new, Crunch 10) Your agent runs in the sandbox; list three ways it can still leak a secret and the control for each. Source: https://code.claude.com/docs/en/sandboxing
- `sec-015` (code, hard, senior, new, Core 100) An egress policy for a fetch tool: scheme and host allowlists, resolve then pin, block private and link-local ranges including IPv4-mapped IPv6 and odd encodings, re-validate redirects. Source: https://modelcontextprotocol.io/specification/2026-07-28/basic/security_best_practices
- `sec-016` (design, hard, senior, new) Your agent can execute arbitrary Python; make it safe for a multi-tenant product. Source: https://github.com/ombharatiya/ai-system-design-guide/blob/main/00-interview-prep/01-question-bank.md
- `sec-017` (design, hard, staff, new) A secrets management system for a fast-growing research organisation where developers move quickly. Source: https://knok.work/blog/anthropic-security-engineer-interview.html. Reported: Anthropic (reported via a vendor compiling candidate reports)
- `sec-018` (critique, hard, senior, new) Critique a sandbox whose allowlisted domain has an upload API. Source: https://www.anthropic.com/engineering/how-we-contain-claude
- `sec-019` (mcq, medium, senior, new) Which isolation boundary for untrusted multi-tenant code: seccomp alone, a container, gVisor or a microVM? Source: https://gvisor.dev/docs/

### security/mcp-security: MCP security implemented

MCP authorisation as code, the MCP attacks that happened and the clause that stops each, and running a multi-tenant MCP server.

**Lessons**

1. **Implementing MCP authorisation correctly** (`mcp-authorization`, lesson, staff). Servers publish protected-resource metadata, validate every token's audience, answer with challenges that name the needed scopes, and never accept or forward tokens issued for another resource; clients use PKCE, send the resource parameter, compare the issuer by exact string and open only https authorisation URLs, never through a shell. Client ID Metadata Documents are preferred and Dynamic Client Registration is deprecated in the 2026-07-28 revision. The reader implements token validation and the client checks with tests.
   - Sources: https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization ; https://modelcontextprotocol.io/specification/2026-07-28/basic/security_best_practices ; https://modelcontextprotocol.io/specification/versioning
   - Existing: `src/content/lessons/agents/tools-mcp-a2a/overview.mdx` (split, receives-content). The authorisation section moves here and is implemented, not described.
2. **MCP attacks that happened, and the clause that stops each** (`mcp-attacks`, lesson, senior). Tool poisoning and rug pulls, the mcp-remote command injection from a malicious authorization_endpoint (CVE-2025-6514), the unauthenticated MCP Inspector proxy (CVE-2025-49596), the GitHub MCP private-repository leak and the Supabase service-role trifecta each map to a clause in the specification or a design rule. The lesson walks each one end to end and names the control that would have stopped it. Secondary-only incidents are labelled as such.
   - Sources: https://invariantlabs.ai/blog/mcp-security-notification-tool-poisoning-attacks ; https://cveawg.mitre.org/api/cve/CVE-2025-6514 ; https://cveawg.mitre.org/api/cve/CVE-2025-49596 ; https://invariantlabs.ai/blog/mcp-github-vulnerability ; https://simonwillison.net/2025/Jul/6/supabase-mcp-lethal-trifecta/ ; https://modelcontextprotocol.io/specification/2026-07-28/basic/security_best_practices
3. **Running a multi-tenant MCP server on the stateless revision** (`multi-tenant-mcp`, lesson, staff). A multi-tenant MCP server must key all state to the user identity from the verified token, because possession of a state handle must not be treated as authentication. The lesson covers per-tenant scopes, rate limits, audit logging with correlation ids for scope elevation, and pinning tool descriptions by hash. The reader designs the server and its threat model.
   - Sources: https://modelcontextprotocol.io/specification/2026-07-28/basic/security_best_practices ; https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization ; https://modelcontextprotocol.io/specification/2026-07-28/changelog

**Problems** (6; critique 1, code 1, design 1, debug 1, concept 2; hard 5, medium 1)

- `sec-020` (critique, hard, senior, new, Core 100) Review this MCP server before production: token handling, state handles, OAuth discovery and tool descriptions. Source: https://modelcontextprotocol.io/specification/2026-07-28/basic/security_best_practices
- `sec-021` (code, hard, staff, new) Validate token audience and issuer for an MCP client and server, rejecting passthrough and missing issuer parameters; hidden tests include mix-up attempts. Source: https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization
- `sec-022` (design, hard, staff, new) A secure multi-tenant MCP server on the stateless 2026-07-28 specification. Source: https://github.com/ombharatiya/ai-system-design-guide/blob/main/00-interview-prep/01-question-bank.md
- `sec-023` (debug, hard, senior, new) A crafted authorization_endpoint reaches a shell in an MCP client: find the code path and the fix. Source: https://cveawg.mitre.org/api/cve/CVE-2025-6514
- `sec-024` (concept, medium, senior, new) Why PKCE alone does not stop mix-up attacks, and what issuer validation adds. Source: https://modelcontextprotocol.io/specification/2026-07-28/basic/security_best_practices
- `sec-025` (concept, hard, staff, new) Explain the MCP remote transport and authorisation model and the risks of running MCP servers in production. Source: https://github.com/ombharatiya/ai-system-design-guide/blob/main/00-interview-prep/01-question-bank.md

### security/output-data: Output handling and data protection

Model output as untrusted input to the next component, PII and telemetry content with residency, and cross-tenant leakage through shared caches.

**Lessons**

1. **Model output is untrusted input to the next component** (`output-sinks`, lesson, senior). OWASP's improper-output-handling entry lists XSS, CSRF, SSRF, privilege escalation, code execution through shells or eval, SQL injection and path traversal, with context-aware encoding, parameterised queries and a strict CSP as the controls. The DeepSeek chat case, where an injected document made the model emit a javascript: iframe that read the session token, is the worked example. The reader writes an encoder and a parameterised SQL tool that pass an attack battery.
   - Sources: https://genai.owasp.org/llmrisk/llm052025-improper-output-handling/ ; https://embracethered.com/blog/posts/2024/deepseek-ai-prompt-injection-to-xss-and-account-takeover/ ; https://simonwillison.net/tags/markdown-exfiltration/ ; https://modelcontextprotocol.io/specification/2026-07-28/basic/security_best_practices
2. **PII redaction, telemetry content and data residency** (`pii-telemetry-residency`, lesson, senior). Redaction is a probabilistic detector (Presidio says it gives no guarantee), the OpenTelemetry GenAI conventions mark message content opt-in because it may contain personal data, and residency on the Claude API is two settings: per-request inference geography and a workspace geography for data at rest. The lesson covers what each control actually guarantees and what logs must never contain. The reader writes the logging and residency policy for an EU customer.
   - Sources: https://presidio.dataprivacystack.org/ ; https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/gen-ai-spans.md ; https://platform.claude.com/docs/en/manage-claude/data-residency ; https://developers.openai.com/api/docs/guides/your-data
   - Existing: `src/content/lessons/safety/guardrails/overview.mdx` (split, receives-content). PII handling and residency from the guardrails lesson move here.
3. **Cross-tenant leakage through shared caches** (`cache-leakage`, lesson, staff). Prompt caching is a timing side channel when shared: an audit found global cache sharing across users at seven API providers in early 2025. In vLLM, cache_salt is the mitigation for the prefix-cache membership oracle, and an October 2026 advisory showed one code path dropping the salt and restoring the oracle through cached-token counts. The design lesson is that isolation controls must hold on every code path, so they are tested per endpoint.
   - Sources: https://arxiv.org/abs/2502.07776 ; https://github.com/advisories/GHSA-935w-9g4m-p28p ; https://docs.vllm.ai/en/latest/design/prefix_caching.html

**Problems** (7; code 2, debug 1, design 2, concept 1, critique 1; hard 5, medium 2)

- `sec-026` (code, hard, senior, new) Render model Markdown to HTML so that it passes an XSS battery including javascript: URLs, data URIs and image exfiltration. Source: https://genai.owasp.org/llmrisk/llm052025-improper-output-handling/
- `sec-027` (code, hard, senior, new) A SQL tool that accepts only a parameterised template plus typed arguments; hidden tests attempt injection through the arguments. Source: https://genai.owasp.org/llmrisk/llm052025-improper-output-handling/
- `sec-028` (debug, hard, senior, new, Core 100, Crunch 25) A customer says your chatbot leaked another user's data; the trace shows a shared prefix-cache hit and a shared conversation id, and only one explains it. Source: https://arxiv.org/abs/2502.07776
- `sec-029` (design, hard, staff, new) A system where one user's prompt cannot leak to another user, across caches, logs, memory and retrieval. Source: https://github.com/ombharatiya/ai-system-design-guide/blob/main/00-interview-prep/01-question-bank.md
- `sec-030` (concept, medium, senior, new) Data residency on the Claude API is two settings: which data does each one control? Source: https://platform.claude.com/docs/en/manage-claude/data-residency
- `sec-031` (design, hard, staff, new) Security architecture for a multi-tenant self-hosted serving tier: engine-killing requests, prefix-cache oracles and stored provider keys. Source: https://github.com/ombharatiya/ai-system-design-guide/blob/main/00-interview-prep/01-question-bank.md
- `sec-032` (critique, medium, senior, new) Critique a decision to log full prompts and outputs in every environment "for audit". Source: https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/gen-ai-spans.md

### security/supply-chain: Model and agent supply chain

Loading model artefacts safely, data poisoning and backdoors, and the agent toolchain as a supply chain.

**Lessons**

1. **Loading model artefacts safely** (`model-artefacts`, lesson, senior). Pickle runs code at load time, Hugging Face says its pickle scanning is not foolproof, and the nullifAI models evaded picklescan with broken streams. torch.load now defaults to weights_only=True, yet weights_only=True was bypassable in PyTorch 2.5.1 and earlier (CVE-2025-32434), and the docs still say never to load untrusted data; safetensors removes code execution but does not validate values or prove who produced the weights, which is what signing with Sigstore addresses. The lab builds a pickletools-based import allowlist scanner.
   - Sources: https://huggingface.co/docs/hub/security-pickle ; https://www.reversinglabs.com/blog/rl-identifies-malware-ml-model-hosted-on-hugging-face ; https://docs.pytorch.org/docs/2.14/generated/torch.load.html ; https://cveawg.mitre.org/api/cve/CVE-2025-32434 ; https://github.com/huggingface/safetensors ; https://blog.sigstore.dev/model-transparency-v1.0
   - Widget or lab: lab:pickle-scanner
2. **Data poisoning and backdoors** (`poisoning-paper`, paper, staff). Anthropic, the UK AI Security Institute and the Alan Turing Institute found that 250 poisoned documents backdoored models from 600M to 13B parameters with a denial-of-service trigger, while 100 were not enough, and the authors caution that the backdoor was narrow and low-stakes. Sleeper Agents found backdoors persisting through SFT, RL and adversarial training. The walkthrough ends with what this means for training on scraped or user data and what to say when asked how much poisoned data is needed.
   - Sources: https://www.anthropic.com/research/small-samples-poison ; https://arxiv.org/abs/2401.05566 ; https://artificialintelligenceact.eu/article/15/
3. **The agent toolchain as a supply chain** (`agent-toolchain`, lesson, senior). Coding agents install packages, MCP servers and skills, so their toolchain is a supply chain with its own incidents: the Nx compromise drove local AI CLIs to steal credentials, an over-scoped token in CodeBuild shipped malicious code in Amazon Q Developer 1.84.0, and package hallucination suggests packages that do not exist. Controls are pinning and reviewing MCP servers and skills like dependencies, sandboxed installs, and never running agents with permission-skipping flags outside an isolated container. The reader writes the policy for a team running coding agents.
   - Sources: https://github.com/nrwl/nx/security/advisories/GHSA-cxm3-wv7p-598c ; https://www.stepsecurity.io/blog/supply-chain-security-alert-popular-nx-build-system-package-compromised-with-data-stealing-malware ; https://aws.amazon.com/security/security-bulletins/AWS-2025-015/ ; https://arxiv.org/abs/2406.10279

**Problems** (6; concept 1, design 2, code 1, critique 1, mcq 1; hard 5, medium 1)

- `sec-033` (concept, hard, senior, new) What belongs in a model's bill of materials, and what signing does and does not prove about the weights? Source: https://blog.sigstore.dev/model-transparency-v1.0
- `sec-034` (design, hard, staff, new) A vendor publishes fine-tuned weights but not training data: your supply-chain trust process and the gaps that remain. Source: https://github.com/ombharatiya/ai-system-design-guide/blob/main/00-interview-prep/01-question-bank.md
- `sec-035` (design, hard, senior, new) A Python dependency in your training pipeline was found to contain malicious code: walk through your response. Source: https://knok.work/blog/anthropic-security-engineer-interview.html. Reported: Anthropic (reported via a vendor compiling candidate reports)
- `sec-036` (code, hard, senior, new) A pickletools-based import allowlist scanner; hidden tests include a broken-stream evasion and a benign model. Source: https://huggingface.co/docs/hub/security-pickle
- `sec-037` (critique, hard, staff, new) A poisoned package plants editor and agent auto-execution hooks so opening the repository runs the payload: critique a team's defence. Source: https://github.com/ombharatiya/ai-system-design-guide/blob/main/00-interview-prep/01-question-bank.md
- `sec-038` (mcq, medium, senior, new) PyTorch 2.5.1 with weights_only=True and an untrusted checkpoint: what is true? Source: https://cveawg.mitre.org/api/cve/CVE-2025-32434

### security/security-ops: Security operations for AI features

Audit logs an investigator can use, abuse and denial of wallet, incident response, security evals in CI and a red-team programme.

**Lessons**

1. **Audit logging for agents** (`audit-logging`, lesson, senior). An investigator needs the model id and version, a redacted prompt or hash, tool calls with arguments and results, who approved what, the policy rule that matched, and the token subject and actor. That conflicts with privacy because content capture is opt-in and logs become a personal-data store with retention duties. The lesson writes the log schema and the retention rule and shows how token passthrough breaks the trail.
   - Sources: https://www.coalitionforsecureai.org/wp-content/uploads/2026/03/AI-Incident-Response-1.pdf ; https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/gen-ai-spans.md ; https://modelcontextprotocol.io/specification/2026-07-28/basic/security_best_practices
2. **Rate limiting, abuse and denial of wallet** (`abuse-denial-of-wallet`, lesson, senior). OWASP's unbounded-consumption entry names variable-length floods, denial of wallet, model extraction and functional replication, with token buckets, spend caps and limits on logprob exposure among the controls. Anthropic reported a state-sponsored campaign that used Claude Code for most of an intrusion campaign by splitting work into innocent-looking tasks, and responded with bans and new classifiers. The lesson treats abuse as account-level behaviour that single-prompt filters cannot see.
   - Sources: https://genai.owasp.org/llmrisk/llm102025-unbounded-consumption/ ; https://platform.claude.com/docs/en/api/rate-limits ; https://www.anthropic.com/news/disrupting-AI-espionage
3. **Playbook: incident response for AI features** (`incident-response`, playbook, staff). The CoSAI framework aligns with NIST SP 800-61 Rev. 3 and adds AI incident classes, AI forensics and playbooks for training-data poisoning, multi-channel prompt injection, memory injection, poisoned RAG and metadata-credential abuse. The playbook covers kill switches (disable a tool, a connector or a model version), credential rotation, memory and index quarantine and customer communication, with the Amazon Q 1.84.0 case as the worked example. It ends with what to measure in the review.
   - Sources: https://www.coalitionforsecureai.org/wp-content/uploads/2026/03/AI-Incident-Response-1.pdf ; https://csrc.nist.gov/pubs/sp/800/61/r3/final ; https://aws.amazon.com/security/security-bulletins/AWS-2025-015/
4. **Security evals in CI** (`security-evals-ci`, lesson, senior). Three suites run at different cadences: deterministic control tests on every PR, a fixed battery of known attacks per release (promptfoo, garak), and adaptive attacks nightly or before release (AgentDojo's tasks and security cases). Tooling changed in 2026: OpenAI announced it would acquire Promptfoo and continue the open-source project, and PyRIT moved to a new repository. The reader wires the three suites to a pipeline with blocking rules.
   - Sources: https://www.promptfoo.dev/docs/red-team/quickstart/ ; https://github.com/NVIDIA/garak ; https://arxiv.org/abs/2406.13352 ; https://openai.com/index/openai-to-acquire-promptfoo/ ; https://github.com/Azure/PyRIT
5. **Playbook: running a red-team programme** (`red-team-programme`, playbook, staff). A programme defines scope, threat actors, adaptive attackers as the default, what counts as a finding, severity, regression capture and disclosure. AIUC-1, a vendor-maintained standard, describes scenario-based red-teaming with periodic retests and should be labelled as such. The playbook works a programme for a customer-facing agent and ends with how findings change the roadmap.
   - Sources: https://www.aiuc-1.com/ ; https://arxiv.org/abs/2510.09023 ; https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/

**Problems** (7; design 4, estimate 1, replay 1, workflow 1; hard 7)

- `sec-039` (design, hard, senior, new, Core 100) Integrate AI security into CI/CD: what runs per PR, per release and nightly, and what blocks a merge. Source: https://www.promptfoo.dev/docs/red-team/quickstart/
- `sec-040` (design, hard, staff, new) What should happen in the hour after a successful agent attack, and in the week after? Source: https://www.interviewsvector.com/blog/ai-agent-security-interview-guide-prompt-injection-excessive-agency-tool-abuse
- `sec-041` (estimate, hard, senior, new) Rate limits for an AI API: per-tenant token buckets and spend caps from a stated traffic model, and the abuse pattern they still miss. Source: https://genai.owasp.org/llmrisk/llm102025-unbounded-consumption/
- `sec-042` (design, hard, senior, new) Detect someone stealing your model through the API. Source: https://www.practical-devsecops.com/ai-security-interview-questions/
- `sec-043` (replay, hard, staff, new) Replay the Amazon Q Developer 1.84.0 incident: at each checkpoint commit to a hypothesis, then name the build control and the agent control that would each have stopped it. Source: https://aws.amazon.com/security/security-bulletins/AWS-2025-015/
- `sec-044` (design, hard, senior, new) A researcher pushes a live API key to a public repository: incident response, step by step. Source: https://knok.work/blog/anthropic-security-engineer-interview.html. Reported: Anthropic (reported via a vendor compiling candidate reports)
- `sec-045` (workflow, hard, staff, new) Audit logging for agents that an investigator can use without building an uncontrolled personal-data store. Source: https://www.coalitionforsecureai.org/wp-content/uploads/2026/03/AI-Incident-Response-1.pdf

### security/governance: Governance and privacy duties engineers implement

The NIST documents, the EU AI Act articles that become engineering work, SOC 2 and ISO 42001 evidence, and privacy law for AI features.

**Lessons**

1. **NIST for engineers in one sitting** (`nist`, lesson, senior). The AI RMF (January 2023) organises work as Govern, Map, Measure and Manage, the Generative AI Profile (July 2024) adds GenAI risks, the Cyber AI Profile is still an initial preliminary draft from December 2025, and SP 800-61 Rev. 3 covers incident response. The lesson maps each to artefacts an engineering team produces. Every document is cited with its status so a draft is never presented as final.
   - Sources: https://www.nist.gov/itl/ai-risk-management-framework ; https://csrc.nist.gov/pubs/ir/8596/iprd ; https://csrc.nist.gov/pubs/sp/800/61/r3/final
2. **EU AI Act duties an engineer implements** (`eu-ai-act`, lesson, senior). After the Digital Omnibus, Annex III high-risk obligations apply from 2 December 2027 and Annex I from 2 August 2028, and generative systems already on the market have until 2 December 2026 to mark generated content. Article 15(5) requires technical measures against data poisoning, model poisoning, adversarial examples and confidentiality attacks, and Article 99 sets fines up to EUR 35 million or 7% of worldwide turnover for prohibited practices. The lesson turns each article into engineering tasks with owners.
   - Sources: https://artificialintelligenceact.eu/implementation-timeline/ ; https://artificialintelligenceact.eu/article/15/ ; https://artificialintelligenceact.eu/article/99/ ; https://digital-strategy.ec.europa.eu/en/policies/contents-code-gpai
   - Existing: `src/content/lessons/safety/hallucination/overview.mdx` (split, receives-content). The compliance dates paragraph from the hallucination lesson moves here and is expanded.
3. **Playbook: SOC 2 and ISO/IEC 42001 for an AI feature** (`soc2-iso42001`, playbook, staff). As of the CSA note of 30 August 2026 there are no AI-specific SOC 2 trust services criteria, so auditors map AI controls onto existing criteria and requests vary by firm; ISO/IEC 42001 certifies a management system, not a model. The evidence that recurs is model change management with approvals, per-inference logs with model version and a redacted prompt, providers treated as subprocessors with retention documented, and an inventory of unsanctioned AI use. The playbook ends with the evidence pack an engineering team can maintain without stopping work.
   - Sources: https://labs.cloudsecurityalliance.org/research/csa-research-note-soc2-ai-controls-gap-20260830-csa-styled/ ; https://www.aiuc-1.com/ ; https://www.nist.gov/itl/ai-risk-management-framework
4. **Privacy law for AI features: deletion, retention and provider data controls** (`privacy-law`, lesson, senior). The EDPB's Opinion 28/2024 addresses personal data in AI models, and deletion requests must reach logs, eval sets and fine-tuning data as well as the product database. Provider data controls differ: OpenAI keeps abuse-monitoring logs up to 30 days by default with zero data retention by approval and excluded endpoints, and Claude separates inference geography from workspace geography. The reader traces every store a deletion request must reach.
   - Sources: https://www.edpb.europa.eu/our-work-tools/our-documents/opinion-board-art-64/opinion-282024-certain-data-protection-aspects_en ; https://developers.openai.com/api/docs/guides/your-data ; https://platform.claude.com/docs/en/manage-claude/data-residency

**Problems** (6; workflow 1, concept 2, design 1, estimate 1, critique 1; hard 3, medium 3)

- `sec-046` (workflow, hard, staff, new, Core 100) Design an AI governance process that satisfies auditors without stopping teams from shipping. Source: https://aiengineeringinsider.substack.com/p/the-100-questions-that-haunt-ai-engineering
- `sec-047` (concept, medium, senior, new) Which Article 15(5) measures become engineering work for a high-risk system, and how would you evidence each? Source: https://artificialintelligenceact.eu/article/15/
- `sec-048` (design, hard, senior, new) An HR assistant user asks to delete all their data: trace every store the request must reach, including evals and fine-tuning sets. Source: https://aiengineeringinsider.substack.com/p/the-100-questions-that-haunt-ai-engineering
- `sec-049` (estimate, medium, senior, new) Article 99 fine exposure at a stated turnover under each tier, and how the SME rule changes it. Source: https://artificialintelligenceact.eu/article/99/
- `sec-050` (critique, hard, staff, new) Critique a SOC 2 evidence pack for an AI feature that has model cards but no change management or inference logs. Source: https://labs.cloudsecurityalliance.org/research/csa-research-note-soc2-ai-controls-gap-20260830-csa-styled/
- `sec-051` (concept, medium, senior, new) Map the NIST AI RMF functions onto an AI feature's release process, naming the artefact each function produces. Source: https://www.nist.gov/itl/ai-risk-management-framework

## 10. Inference, serving and cost (`inference`)

Serving models as a capacity and scheduling problem: prefill and decode on the roofline, KV capacity and compression, continuous batching, paged KV and chunked prefill, quantisation and speculative decoding, disaggregation, gateways and routing, SLOs and quality incidents with no model change, and fleet-scale routing, release pipelines, quota ledgers and adapter serving. The reader knows schedulers, allocators and queues; the track teaches what is different when the work unit is a token and the memory is a KV cache.

### inference/inference-anatomy: Prefill, decode and KV capacity

The roofline view of prefill and decode, KV bytes per token by model, and the families of KV compression.

**Lessons**

1. **Prefill and decode on the roofline** (`roofline-serving`, lesson, senior). Prefill is compute-bound and decode is memory-bandwidth-bound because decode reads every weight and the KV cache for each generated token. The lesson places both on the H100 roofline with its ridge point, and covers model bandwidth utilisation, goodput and the metric names engines report. The reader can say which phase a change will speed up before benchmarking it.
   - Sources: https://www.nvidia.com/en-us/data-center/h100/ ; https://jax-ml.github.io/scaling-book/roofline/ ; https://www.databricks.com/blog/llm-inference-performance-engineering-best-practices ; https://arxiv.org/abs/2401.09670 ; https://docs.nvidia.com/nim/benchmarking/llm/latest/metrics.html
   - Existing: `src/content/lessons/inference/inference-anatomy/overview.mdx` (rewrite, primary). Cut "two phases in a systems engineer's terms" and the latency vocabulary; keep roofline and ridge point, the KV table by model, goodput and MBU, engine metric names.
2. **KV cache capacity: bytes per token by model, and what fits** (`kv-capacity`, lesson, senior). KV bytes per token are layers times KV heads times head dimension times two times bytes per element, and that number sets how many concurrent tokens a GPU holds after weights. The lesson computes it from published configs (Llama 3, Qwen3, gpt-oss, DeepSeek-V3) and turns it into a concurrency limit per GPU. The reader sizes a deployment from a traffic mix of sequence lengths.
   - Sources: https://arxiv.org/html/2407.21783 ; https://huggingface.co/deepseek-ai/DeepSeek-V3/blob/main/config.json ; https://huggingface.co/openai/gpt-oss-120b ; https://arxiv.org/abs/2309.06180
   - Widget or lab: InferenceKvCalc
3. **Playbook: shrinking the KV cache** (`kv-compression`, playbook, staff). Four families fail differently: architectural (GQA, MQA, MLA, hybrid linear layers, fixed at training time), eviction (H2O, SnapKV), quantisation (KIVI at 2 bits with keys per channel and values per token) and top-k sparse attention (DeepSeek's DSA). The input that decides is task accuracy at length, measured with long-context tasks rather than needle tests. The worked case serves a 128K-context assistant on a fixed GPU budget and lists what to measure after deciding.
   - Sources: https://arxiv.org/abs/2306.14048 ; https://arxiv.org/abs/2404.14469 ; https://arxiv.org/abs/2402.02750 ; https://arxiv.org/html/2512.02556 ; https://arxiv.org/abs/1911.02150 ; https://arxiv.org/abs/2305.13245 ; https://arxiv.org/abs/2405.04434

**Problems** (6; concept 1, estimate 3, design 1, debug 1; medium 2, hard 4)

- `inf-001` (concept, medium, senior, existing) Why prefill is compute-bound and decode is not, stated with arithmetic intensity rather than slogans. Source: https://jax-ml.github.io/scaling-book/roofline/
- `inf-002` (estimate, medium, senior, existing) KV cache for Llama 3 70B at 32K context and a stated batch. Source: https://arxiv.org/html/2407.21783
- `inf-003` (estimate, hard, senior, existing, Core 100) Roofline for a 70B model on one H100: choose FP8 or BF16 and the GPU count, and say which assumption flips it. Source: https://www.nvidia.com/en-us/data-center/h100/
- `inf-017` (estimate, hard, staff, new) KV bytes per token for MHA, GQA-8, MLA and a 1:7 attention-to-Mamba hybrid at 256K, computed from published configs. Source: https://arxiv.org/html/2403.19887
- `inf-018` (design, hard, staff, new) Serve a 128K-context assistant on a fixed GPU budget: choose a KV compression family and the accuracy test that would reverse the choice. Source: https://arxiv.org/abs/2404.14469
- `inf-019` (debug, hard, senior, new) After a sliding-window change evicted the first tokens, output turned to noise; explain and fix without losing the memory saving. Source: https://arxiv.org/abs/2309.17453

### inference/batching: Continuous batching and the KV allocator

Iteration-level scheduling, PagedAttention as virtual memory for KV, and chunked prefill with a token budget.

**Lessons**

1. **Continuous batching: iteration-level scheduling** (`continuous-batching`, lesson, senior). Continuous batching admits and retires requests at every decode step instead of waiting for a batch to finish, which is why it raises throughput without raising latency for short requests. The lesson covers Orca's iteration-level scheduling, the vLLM V1 scheduler that assigns tokens per request per step, and the metrics that show it working. The reader can trace a request through one engine step.
   - Sources: https://www.usenix.org/conference/osdi22/presentation/yu ; https://www.anyscale.com/blog/continuous-batching-llm-inference ; https://vllm.ai/blog/2025-01-27-v1-alpha-release
   - Widget or lab: InferenceBatchSim
   - Existing: `src/content/lessons/inference/batching/overview.mdx` (rewrite, primary). Cut the worker-pool analogy and the static-batching predict; keep PagedAttention and the allocator, chunked prefill and the budget knob, preemption and fairness.
2. **PagedAttention: virtual memory for the KV cache** (`paged-attention`, lesson, senior). PagedAttention stores KV in fixed-size blocks with a block table per sequence, which removes fragmentation and allows copy-on-write sharing of prefixes and beams. The lesson covers block size, preemption by recompute or swap, and prefix sharing. The reader implements the allocator in the lab.
   - Sources: https://arxiv.org/abs/2309.06180 ; https://docs.vllm.ai/en/latest/design/prefix_caching.html
   - Widget or lab: lab:continuous-batching
3. **Chunked prefill, token budgets and fairness** (`chunked-prefill`, lesson, staff). A long prefill in the same step as decodes stalls every decode behind it, and Sarathi-Serve's chunked prefill bounds the step with a token budget. The lesson covers the max_num_batched_tokens knob, preemption order, fairness across tenants and the head-of-line blocking it trades against throughput. The reader picks a budget for a mixed workload and shows its p99 effect.
   - Sources: https://arxiv.org/abs/2403.02310 ; https://docs.vllm.ai/en/latest/configuration/optimization.html ; https://vllm.ai/blog/2025-01-27-v1-alpha-release

**Problems** (6; concept 1, design 2, code 2, debug 1; medium 1, hard 5)

- `inf-004` (concept, medium, senior, existing) Trace a request through a paged-KV inference engine, step by step, naming every queue and allocator decision. Source: https://arxiv.org/abs/2309.06180
- `inf-005` (design, hard, senior, existing) Batching for a single GPU with synchronous callers waiting on up to 100 inputs per batch. Source: https://www.aced.io/blog/ai-engineer-interview-questions. Reported: Anthropic (candidate report via aced.io)
- `inf-006` (code, hard, staff, existing, Core 100, Crunch 14) A paged KV block allocator with copy-on-write prefix sharing and preemption; hidden invariant tests. Source: https://arxiv.org/abs/2309.06180
- `inf-020` (code, hard, staff, new) A step scheduler with chunked prefill and a token budget; the preemption order is the reader's choice and tests check invariants rather than one schedule. Source: https://vllm.ai/blog/2025-01-27-v1-alpha-release
- `inf-021` (design, hard, staff, new) Design an end-to-end batching system for LLM queries. Source: https://www.aced.io/questions/5807/design-end-to-end-batching-system-for-llm-queries. Reported: Anthropic (candidate report via aced.io)
- `inf-022` (debug, hard, senior, new) After raising the batched-token limit, one long prompt starves short ones and p99 time to first token doubles. Source: https://docs.vllm.ai/en/latest/configuration/optimization.html

### inference/faster-cheaper: Quantisation, speculation, caching and disaggregation

Each serving optimisation with the condition under which it helps and the measurement that shows it.

**Lessons**

1. **Quantisation formats and how to measure the damage** (`quantisation`, lesson, senior). GPTQ, AWQ, FP8 and GGUF quantise weights differently, KV-cache quantisation is a separate choice, and the damage shows up on long-tail tasks before averages. The lesson covers the formats, where outliers break them, and an evaluation protocol that compares on your tasks, not on perplexity. The reader decides a format for a stated model, GPU and quality floor.
   - Sources: https://arxiv.org/abs/2210.17323 ; https://arxiv.org/abs/2306.00978 ; https://arxiv.org/abs/2209.05433 ; https://huggingface.co/docs/hub/gguf ; https://docs.vllm.ai/en/latest/features/quantization/quantized_kvcache.html
   - Existing: `src/content/lessons/inference/faster-cheaper/overview.mdx` (split, primary). Training parallelism moves to training/distributed; each optimisation becomes its own lesson.
2. **Speculative decoding: why it preserves the distribution and when it hurts** (`speculative-decoding`, lesson, senior). Speculative decoding drafts tokens cheaply and verifies them in one target pass, and the acceptance rule preserves the target distribution exactly. It helps when decode is memory-bound and hurts at large batch where the GPU is already compute-bound. The lesson covers draft models, EAGLE-style heads and the batch size at which it stops paying.
   - Sources: https://arxiv.org/abs/2211.17192 ; https://arxiv.org/abs/2302.01318 ; https://arxiv.org/abs/2503.01840 ; https://docs.vllm.ai/en/latest/features/speculative_decoding/
   - Widget or lab: InferenceSpecSim
3. **Prefix caching in the engine** (`prefix-caching`, lesson, senior). Engine prefix caching hashes KV blocks by their token prefix so shared system prompts and few-shot blocks are computed once. The lesson covers block hashing, eviction, cache-aware routing across replicas, and the per-tenant salt needed when the cache is shared. The reader estimates saved prefill for a stated traffic mix.
   - Sources: https://docs.vllm.ai/en/latest/design/prefix_caching.html ; https://arxiv.org/abs/2309.06180 ; https://github.com/advisories/GHSA-935w-9g4m-p28p
4. **Disaggregated prefill and decode** (`disaggregation`, lesson, staff). Running prefill and decode on separate GPU pools removes their interference and lets each pool be sized to its own bottleneck, at the cost of moving KV between them. DistServe frames the goal as goodput under latency SLOs, and chunked prefill is the alternative that keeps one pool. The reader decides between tuning one pool and splitting two for a mixed workload.
   - Sources: https://arxiv.org/abs/2401.09670 ; https://arxiv.org/abs/2403.02310
5. **Tensor, pipeline and expert parallelism for serving** (`serving-parallelism`, lesson, senior). Serving splits a model across GPUs for memory or latency, and the choice of tensor, pipeline or expert parallelism follows the interconnect and the batch. The lesson covers why tensor parallelism stays inside an NVLink domain, pipeline parallelism for models that do not fit, and expert parallelism with all-to-all for MoE. The reader picks a layout for a stated model and node.
   - Sources: https://arxiv.org/abs/2104.04473 ; https://docs.vllm.ai/en/latest/configuration/optimization.html ; https://arxiv.org/html/2412.19437v2

**Problems** (7; mcq 1, debug 2, code 2, design 1, estimate 1; hard 4, medium 3)

- `inf-007` (mcq, hard, senior, existing) Speculative decoding at batch size 128: which outcome do you expect, with options of equal length? Source: https://arxiv.org/abs/2211.17192
- `inf-008` (debug, medium, senior, existing) Speculative decoding made throughput worse after a traffic change. Source: https://docs.vllm.ai/en/latest/features/speculative_decoding/
- `inf-011` (debug, medium, senior, existing) Accuracy fell after 4-bit quantisation on one task family only. Source: https://arxiv.org/abs/2306.00978
- `inf-016` (code, hard, senior, existing) The speculative decoding verification step with the acceptance rule; hidden tests check the output distribution. Source: https://arxiv.org/abs/2302.01318
- `inf-023` (design, hard, staff, new, Core 100) Disaggregate or tune: a mixed chat and long-document workload on sixteen GPUs with two SLOs. Source: https://arxiv.org/abs/2401.09670
- `inf-024` (code, hard, senior, new) FP32 to int8 quantisation: symmetric and zero-point schemes, per-channel scales, clipping and outliers. Source: https://prachub.com/interview-questions/fp32-to-int8-tensor-quantization-scale-zero-point-clipping-and-outliers. Reported: NVIDIA (candidate report via PracHub)
- `inf-025` (estimate, medium, senior, new) Prefix-cache hit rate and saved prefill FLOPs for a shared system prompt at a stated request rate and replica count. Source: https://docs.vllm.ai/en/latest/design/prefix_caching.html

### inference/gateways-finops: Gateways, routing and break-even

What an AI gateway owns, routing and cascades, and the self-host break-even and how fast it moves.

**Lessons**

1. **The AI gateway: auth, quotas, routing, caching and logging** (`gateway`, lesson, senior). An AI gateway centralises keys, quotas, routing, caching and logging so product teams stop reimplementing them. The lesson compares LiteLLM, Portkey and OpenRouter on routing and budget features and covers per-tenant attribution. The reader decides what the gateway owns and what stays in the product.
   - Sources: https://docs.litellm.ai/docs/routing ; https://portkey.ai/docs/product/ai-gateway ; https://openrouter.ai/docs/features/provider-routing
   - Existing: `src/content/lessons/inference/gateways-finops/overview.mdx` (split, primary). Unit economics per outcome moves to llmops/economics-selection; gateway, routing and break-even stay.
2. **Routing and cascades** (`routing-cascades`, lesson, senior). A cascade sends easy requests to a cheap model and escalates the rest, and its saving depends on how well the router predicts difficulty. FrugalGPT frames the cascade with a scorer, and gateway routers implement fallbacks and cost-based routing. The reader measures a router's confusion matrix before trusting its savings.
   - Sources: https://arxiv.org/abs/2305.05176 ; https://docs.litellm.ai/docs/routing
3. **Self-host or API: the break-even and how fast it moves** (`self-host-breakeven`, lesson, senior). Self-hosting beats an API only above a break-even volume at sustained utilisation, after counting people and on-call. Epoch AI measured the price of a fixed capability falling between 9x and 900x per year depending on the threshold, so the break-even moves within a year. The reader computes a break-even with dated GPU and API prices and states when to recompute it.
   - Sources: https://lambda.ai/pricing ; https://epoch.ai/data-insights/llm-inference-price-trends ; https://platform.claude.com/docs/en/about-claude/pricing
   - Widget or lab: InferenceCacheCalc

**Problems** (6; code 1, design 2, estimate 1, debug 1, critique 1; medium 2, hard 4)

- `inf-009` (code, medium, senior, existing) A token-charged rate limiter shared across servers: atomic check-and-update and behaviour when the store is down. Source: https://platform.claude.com/docs/en/api/rate-limits
- `inf-010` (design, hard, staff, existing) An AI gateway for an organisation whose product teams, security team and a finance team all want different things. Source: https://portkey.ai/docs/product/ai-gateway
- `inf-013` (estimate, medium, senior, existing, Core 100) Self-host or API: find the break-even volume with dated prices and say when it flips. Source: https://lambda.ai/pricing
- `inf-026` (design, hard, staff, new) A multi-model gateway with per-tenant budgets, attribution and fallbacks that do not change behaviour silently. Source: https://docs.litellm.ai/docs/routing
- `inf-027` (debug, hard, senior, new) The monthly model bill tripled in six weeks while traffic grew 40%: find the cause from the cost breakdown. Source: https://aiengineeringinsider.substack.com/p/the-100-questions-that-haunt-ai-engineering
- `inf-028` (critique, hard, senior, new) Critique a cascade that routes by prompt length to a small model. Source: https://arxiv.org/abs/2305.05176

### inference/operating: Operating model services

SLOs and autoscaling with cold starts, load testing, and quality regressions that come from serving infrastructure.

**Lessons**

1. **SLOs, GPU autoscaling and cold starts** (`slos-autoscaling`, lesson, senior). Model servers take minutes to cold start, so autoscaling must act on leading signals and hold warm capacity for the ramp. The lesson covers SLOs for time to first token and inter-token latency, GKE's guidance on inference autoscaling metrics, and queueing arithmetic for headroom. The reader writes SLOs and the scaling policy for a chat service.
   - Sources: https://docs.cloud.google.com/kubernetes-engine/docs/best-practices/machine-learning/inference/autoscaling ; https://sre.google/workbook/implementing-slos/ ; https://docs.vllm.ai/en/latest/design/metrics.html
   - Existing: `src/content/lessons/inference/operating/overview.mdx` (split, primary). Rollout ladders move to llmops/releases-experiments; the three-bug postmortem becomes quality-incidents.
2. **Load testing model endpoints** (`load-testing`, lesson, senior). A load test for a model endpoint must vary input and output lengths, concurrency and prefix sharing, because each moves a different bottleneck. The lesson covers NIM benchmarking metrics, vLLM's metric names and how to read a saturation curve. The reader designs a load test that would have caught a stated regression.
   - Sources: https://docs.nvidia.com/nim/benchmarking/llm/latest/metrics.html ; https://raw.githubusercontent.com/vllm-project/vllm/main/vllm/v1/metrics/loggers.py ; https://docs.vllm.ai/en/latest/design/metrics.html
3. **Quality regressions with no model change** (`quality-incidents`, lesson, staff). Anthropic's September 2025 postmortem describes three unrelated infrastructure bugs (a context-window routing error that reached 16% of Sonnet 4 requests in the worst hour, a TPU misconfiguration that corrupted output, and an approximate top-k miscompilation) that degraded answers with no model or prompt change. Detection was slow because models recover from isolated errors, evals were noisy and privacy limits restricted reading traffic. The lesson ends with the production quality probes and exact checks Anthropic added.
   - Sources: https://www.anthropic.com/engineering/a-postmortem-of-three-recent-issues

**Problems** (6; debug 2, design 2, replay 1, estimate 1; hard 6)

- `inf-014` (debug, hard, senior, existing) p99 inter-token latency doubled after a deploy; two engine settings changed and only one matters. Source: https://docs.vllm.ai/en/latest/configuration/optimization.html
- `inf-015` (design, hard, staff, existing) An inference API with autoscaling and SLOs, given cold starts measured in minutes. Source: https://www.techinterview.org/post/3233460079/design-an-llm-inference-api/
- `inf-029` (debug, hard, senior, new, Core 100) Throughput collapsed at 2 a.m. with no deploy: read the engine metrics and find the preemption storm. Source: https://raw.githubusercontent.com/vllm-project/vllm/main/vllm/v1/metrics/loggers.py
- `inf-030` (replay, hard, staff, new, Core 100) Replay Anthropic's three overlapping infrastructure bugs: commit to a hypothesis at each checkpoint and name the instrument that would have caught each bug. Source: https://www.anthropic.com/engineering/a-postmortem-of-three-recent-issues
- `inf-031` (estimate, hard, senior, new) Warm capacity to hold for a stated diurnal curve when cold starts take minutes. Source: https://docs.cloud.google.com/kubernetes-engine/docs/best-practices/machine-learning/inference/autoscaling
- `inf-032` (design, hard, staff, new) Inference serving at scale for ten million daily users across two regions. Source: https://www.techinterview.org/post/3233460079/design-an-llm-inference-api/

### inference/fleet: Inference fleets: routing, release, quotas and adapters

Fleet-scale routing with cache affinity, model release pipelines, credit and quota ledgers, and serving many adapters on one base.

**Lessons**

1. **Routing across accelerators, regions and caches** (`fleet-routing`, lesson, staff). At fleet scale the router decides cost and latency: it chooses accelerator type and region, keeps prefix-cache affinity, and separates production from research demand. The lesson uses Anthropic's inference job description as the specification of the job and the engine designs for prefix-aware and disaggregated routing. The reader designs a router for two accelerator types and three regions.
   - Sources: https://boards-api.greenhouse.io/v1/boards/anthropic/jobs/5385998008 ; https://docs.vllm.ai/en/latest/design/prefix_caching.html ; https://arxiv.org/abs/2401.09670
2. **Model release pipelines for a serving fleet** (`release-pipeline`, lesson, staff). Releasing a model or a serving change to a fleet needs quality probes on canaries, not only error rates, because infrastructure bugs degrade answers silently. The lesson builds the pipeline from Anthropic's postmortem commitments and provider deprecation schedules: canary by quality probe, staged rollout, rollback triggers and an owner. The reader writes the release checklist for a new model version.
   - Sources: https://www.anthropic.com/engineering/a-postmortem-of-three-recent-issues ; https://platform.claude.com/docs/en/about-claude/model-deprecations
3. **Credit and quota ledgers** (`quota-ledgers`, lesson, senior). Token credits and quotas are a ledger with grants, expirations, holds and refunds, and getting it wrong is either lost revenue or an outage for paying users. The lesson covers consuming the oldest-expiring grant first, holds for in-flight requests whose cost is unknown, usage reporting to billing within its correction window, and reconciliation. The reader implements the ledger in stages.
   - Sources: https://www.hellointerview.com/guides/openai/l5 ; https://prachub.com/companies/perplexity-ai ; https://docs.stripe.com/billing/subscriptions/usage-based/recording-usage
4. **Serving adapters: merge or hot-load many on one base** (`adapter-serving`, lesson, senior). An adapter can be merged into the base for zero runtime cost and one model per tenant, or kept separate and hot-loaded alongside many others on one base. vLLM serves adapters with a maximum rank set at start-up and warns against exposing runtime loading outside a trusted environment, S-LoRA serves thousands of adapters, and LoRA Land served 25 adapters on one 80 GB A100. Routing becomes sticky to replicas that hold the adapter, which is the operational cost.
   - Sources: https://docs.vllm.ai/en/latest/features/lora.html ; https://arxiv.org/abs/2311.03285 ; https://arxiv.org/abs/2405.00732 ; https://docs.fireworks.ai/fine-tuning/fine-tuning-models

**Problems** (6; multistage 1, design 2, estimate 1, workflow 1, debug 1; hard 6)

- `inf-033` (multistage, hard, senior, new, Core 100) A credit tracker in stages: grants and consumption, then expirations consumed oldest first, then holds for in-flight requests, then refunds and an audit log. Source: https://www.hellointerview.com/guides/openai/l5. Reported: OpenAI, Perplexity (candidate reports via Hello Interview and PracHub)
- `inf-034` (design, hard, staff, new) Route requests across two accelerator types and three regions while keeping prefix-cache affinity and research traffic off the production path. Source: https://docs.vllm.ai/en/latest/design/prefix_caching.html
- `inf-035` (estimate, hard, senior, new) How many LoRA adapters of a stated rank fit on one 80 GB GPU next to the base model and its KV cache? Source: https://docs.vllm.ai/en/latest/features/lora.html
- `inf-036` (design, hard, staff, new) A per-tenant adapter platform: hot-loading, sticky routing, eviction and an eval gate per adapter. Source: https://arxiv.org/abs/2311.03285
- `inf-037` (workflow, hard, staff, new) Release pipeline for a new model version on a serving fleet: canary by quality probe, rollback triggers and owner. Source: https://www.anthropic.com/engineering/a-postmortem-of-three-recent-issues
- `inf-038` (debug, hard, senior, new) Requests for one tenant's adapter fail after a deploy that lowered the server's maximum adapter rank. Source: https://docs.vllm.ai/en/latest/features/lora.html

## 11. LLMOps, fine-tuning and AI product economics (`llmops`)

The operating discipline around a model feature: prompts as versioned artefacts and the optimisers that search over them, releases with the statistics that make an A/B test defensible, drift and feedback loops that do not train sycophancy, curating data from production, fine-tuning as a project (with OpenAI's self-serve fine-tuning closed to new organisations and ending new jobs on 6 January 2027), unit economics per outcome and licence clauses, and the staff-level strategy, platform and governance questions. Incident replays of the GPT-4o sycophancy rollback anchor the release material.

### llmops/prompt-lifecycle: Prompt registries and optimisers

Prompts as immutable versions behind labels, and automatic optimisers as search over text parameters against a metric you must trust first.

**Lessons**

1. **Playbook: prompt registry and release mechanics** (`prompt-registry`, playbook, senior). A prompt is a deployable artefact with a version, an owner, a test suite and a rollout, and in Langfuse's model every edit is an immutable version fetched by a label that rollback simply moves. The trap is that SDKs cache prompts client-side, so rollback takes as long as the cache TTL, not the click. The playbook covers who may move the production label, attaching prompt versions to traces, and never shipping a prompt change and a model change together.
   - Sources: https://langfuse.com/docs/prompt-management/data-model ; https://langfuse.com/docs/prompt-management/overview ; https://mlflow.org/docs/latest/genai/prompt-registry/optimize-prompts/ ; https://applied-llms.org/
   - Existing: `src/content/lessons/apis/prompting/overview.mdx` (split, receives-content). The "prompts as code" section moves here and becomes a playbook.
2. **Automatic prompt optimisation: what the optimisers actually do** (`prompt-optimisers`, lesson, senior). APE keeps the best-scoring generated instruction, OPRO puts past candidates and scores in the prompt, DSPy's BootstrapFewShot keeps only teacher traces that pass the metric, MIPROv2 searches instructions and demonstrations with a surrogate, GEPA reflects on trajectories and keeps a Pareto frontier, and TextGrad treats critiques as gradients. All of them exploit a bad metric, so you need a trustworthy metric, a dev set sized to the optimiser (DSPy suggests 200 or more examples for MIPROv2) and a held-out set it never sees. OpenAI's own optimiser guide warns that an optimised prompt can do worse on specific inputs.
   - Sources: https://raw.githubusercontent.com/stanfordnlp/dspy/main/docs/docs/learn/optimization/optimizers.md ; https://arxiv.org/abs/2211.01910 ; https://arxiv.org/abs/2309.03409 ; https://arxiv.org/abs/2406.11695 ; https://arxiv.org/abs/2507.19457 ; https://arxiv.org/abs/2406.07496 ; https://developers.openai.com/api/docs/guides/prompt-optimizer
   - Widget or lab: lab:prompt-optimiser
3. **GEPA: reflective prompt evolution** (`gepa`, paper, staff). GEPA reports beating GRPO by 6% on average and up to 20% with up to 35 times fewer rollouts across six tasks, and beating MIPROv2 by over 10%, all as the authors' own results. The mechanism is natural-language reflection on full trajectories plus a Pareto frontier of candidates that each win on some example. The walkthrough ends with the DSPy usage, where the metric must return feedback text, and with the conditions a reviewer should attach to the headline.
   - Sources: https://arxiv.org/abs/2507.19457 ; https://raw.githubusercontent.com/stanfordnlp/dspy/main/docs/docs/api/optimizers/GEPA/overview.md

**Problems** (6; critique 1, concept 1, debug 1, estimate 1, code 1, design 1; hard 5, medium 1)

- `ops-001` (critique, hard, senior, new, Core 100) A one-line prompt tweak shipped on Friday and escalations rose on Monday: critique the versioning and testing system that let it through. Source: https://aiengineeringinsider.substack.com/p/the-100-questions-that-haunt-ai-engineering
- `ops-002` (concept, hard, staff, new) An optimiser lifted dev accuracy from 24% to 51% on a ReAct program: what do you check before it ships? Source: https://raw.githubusercontent.com/stanfordnlp/dspy/main/docs/docs/learn/optimization/optimizers.md
- `ops-003` (debug, hard, senior, new) Rollback moved the production label but errors continued for minutes: find the client-side cache. Source: https://langfuse.com/docs/prompt-management/overview
- `ops-004` (estimate, medium, senior, new) Dev and held-out set sizes and the cost of a MIPROv2 run following DSPy's guidance, for a stated three-module program. Source: https://raw.githubusercontent.com/stanfordnlp/dspy/main/docs/docs/learn/optimization/optimizers.md
- `ops-005` (code, hard, senior, new) Bootstrap few-shot: keep only teacher traces that pass the metric, cap the demonstrations, and test against a deterministic mock model. Source: https://raw.githubusercontent.com/stanfordnlp/dspy/main/docs/docs/learn/optimization/optimizers.md
- `ops-006` (design, hard, staff, new) Who may move the production label? Prompt registry governance across many teams with different risk levels. Source: https://langfuse.com/docs/prompt-management/data-model

### llmops/releases-experiments: Releases and experiments

The release ladder with entry and exit rules, A/B statistics that survive review, and qualitative launch blockers.

**Lessons**

1. **Playbook: the release ladder with numbers** (`release-ladder`, playbook, senior). Offline gate, shadow, canary, A/B and full rollout each have an entry condition, a measurement, a cost and an exit rule, and only the A/B test measures outcome metrics causally. Shadow doubles token spend for the shadowed share and cannot see user reactions; provider retirement dates (at least 60 days' notice at Anthropic) set hard deadlines. The playbook ends with pinned model ids and the rollback trigger for each rung.
   - Sources: https://platform.claude.com/docs/en/about-claude/model-deprecations ; https://developers.openai.com/api/docs/deprecations ; https://applied-llms.org/
   - Existing: `src/content/lessons/inference/operating/overview.mdx` (split, receives-content). The rollout section moves here with numbers added.
2. **A/B testing LLM features: statistics that survive review** (`ab-statistics`, lesson, senior). Randomise by user or account, compute sample size before launch, pick one primary metric with a few guardrails, check sample ratio mismatch before reading results, and use clustered errors when the unit is a multi-turn conversation. Anthropic reports clustered standard errors more than three times naive ones on popular evals, and the arithmetic shows detecting 70% to 72% resolution at alpha 0.05 and power 0.8 needs about 8,080 users per arm. The reader designs an experiment that a statistician would sign.
   - Sources: https://www.anthropic.com/research/statistical-approach-to-model-evals ; https://arxiv.org/abs/2411.00640
   - Widget or lab: lab:release-gate
3. **Qualitative launch blockers and behaviour evals** (`launch-blockers`, lesson, staff). The April 2025 GPT-4o update added a reward signal from thumbs data, passed offline evals and an A/B test, drew comments from expert testers that it felt off, shipped and was rolled back. OpenAI's response was to treat model behaviour issues as launch-blocking and to add evals for known failure classes before the change. The lesson gives qualitative signals a formal place in the gate and an owner.
   - Sources: https://simonwillison.net/2025/May/2/what-we-missed-with-sycophancy/ ; https://openai.com/index/expanding-on-sycophancy/

**Problems** (6; estimate 1, debug 1, replay 1, design 1, concept 1, critique 1; hard 6)

- `ops-007` (estimate, hard, senior, new, Core 100, Crunch 21) Sample size to detect a lift from 70% to 72% task resolution at alpha 0.05 and power 0.8, then the duration at a stated daily traffic. Source: https://www.anthropic.com/research/statistical-approach-to-model-evals
- `ops-008` (debug, hard, senior, new) An A/B result shows a four-point lift but the arms are unbalanced: check sample ratio mismatch and decide what the result is worth. Source: https://www.anthropic.com/research/statistical-approach-to-model-evals
- `ops-009` (replay, hard, staff, new, Core 100) Replay the GPT-4o sycophancy update: at each checkpoint decide ship or hold from the evidence available then, and add the gate that would have stopped it. Source: https://simonwillison.net/2025/May/2/what-we-missed-with-sycophancy/
- `ops-010` (design, hard, senior, new) A new reranker improves offline NDCG@10 modestly: design the online experiment that decides whether it ships. Source: https://aiengineeringinsider.substack.com/p/the-100-questions-that-haunt-ai-engineering
- `ops-011` (concept, hard, staff, new) Randomise by user, request or conversation for a multi-turn assistant: decide, and show the error calculation that follows. Source: https://www.anthropic.com/research/statistical-approach-to-model-evals
- `ops-012` (critique, hard, senior, new) Critique a rollout plan that ships a prompt change and a model change together behind one flag. Source: https://langfuse.com/docs/prompt-management/data-model

### llmops/monitoring-feedback: Drift and feedback loops

The four sources of drift, what to monitor before labels arrive, feedback that does not train sycophancy, and the last mile from 80% to 95%.

**Lessons**

1. **Drift you can and cannot see** (`drift`, lesson, senior). Quality changes come from the provider's model behind an alias, your own prompt and retrieval changes, traffic mix and serving infrastructure; Chen, Zaharia and Zou measured GPT-4 prime-number accuracy at 84% in March 2023 and 51% in June 2023 on the same questions. Before labels arrive you monitor resolved model id, output length, refusal rate, tool calls per task, assertion failures and sampled judge pass rates. A frozen input set replayed on a schedule separates traffic drift from model drift.
   - Sources: https://arxiv.org/abs/2307.09009 ; https://prachub.com/resources/llm-evaluation-interview-questions-evals-llm-as-judge-drift-and-production-quality ; https://www.anthropic.com/engineering/a-postmortem-of-three-recent-issues
2. **Playbook: feedback loops that do not train sycophancy** (`feedback-loops`, playbook, senior). Explicit feedback (thumbs, regenerate) and implicit feedback (accept, edit, abandon, escalate) are filters for which traces to read, not metrics or rewards without controls. The sycophancy rollback is the counter-example, and METR measured experienced developers 19% slower with AI while they believed they were faster, so engagement needs an outcome check. The playbook closes the loop: confirmed failure, new eval case, fix, gate.
   - Sources: https://eugeneyan.com/writing/llm-patterns/ ; https://simonwillison.net/2025/May/2/what-we-missed-with-sycophancy/ ; https://arxiv.org/abs/2507.09089 ; https://arxiv.org/abs/2205.06537 ; https://hamel.dev/blog/posts/field-guide/
3. **From 80% to 95%: estimating the last mile** (`last-mile`, lesson, senior). LinkedIn reported reaching about 80% of its target experience in the first month and needing about four more months to pass 95%, with a linguist team that could evaluate up to 500 conversations a day. Malformed parameters in about 10% of responses fell to about 0.01% with a defensive parser, and chain-of-thought improved quality while raising perceived latency. The reader uses these as priors when asked to estimate a timeline.
   - Sources: https://www.linkedin.com/blog/engineering/generative-ai/musings-on-building-a-generative-ai-product

**Problems** (6; debug 2, concept 2, critique 1, estimate 1; hard 5, medium 1)

- `ops-013` (debug, hard, senior, new) Eval scores are flat after a model change but users complain: what is happening, and what do you sample first? Source: https://jobsbyculture.com/blog/ai-engineer-interview-questions-2026
- `ops-014` (concept, medium, senior, new) What do you monitor before ground-truth labels arrive, and which signal fires first for each kind of drift? Source: https://prachub.com/resources/llm-evaluation-interview-questions-evals-llm-as-judge-drift-and-production-quality
- `ops-015` (debug, hard, senior, new) A provider updated the model behind an alias: detect it and separate it from a change in traffic mix. Source: https://arxiv.org/abs/2307.09009
- `ops-016` (critique, hard, senior, new) Critique a plan to use thumbs-up rate as the reward for a weekly fine-tune. Source: https://simonwillison.net/2025/May/2/what-we-missed-with-sycophancy/
- `ops-017` (estimate, hard, senior, new) Plan the timeline and labelling capacity for a feature like LinkedIn's, given its reported 80% and 95% milestones. Source: https://www.linkedin.com/blog/engineering/generative-ai/musings-on-building-a-generative-ai-product
- `ops-018` (concept, hard, staff, new) How do you detect drift in your evaluator, separately from drift in the system it evaluates? Source: https://prachub.com/resources/llm-evaluation-interview-questions-evals-llm-as-judge-drift-and-production-quality

### llmops/data-curation: Curating data from production

Eval and SFT data from logs with stratification, dedup, PII scrubbing and leakage checks, synthetic data without collapse, and consent and deletion.

**Lessons**

1. **Curating eval and SFT data from production** (`curation-pipeline`, lesson, senior). The pipeline samples by stratum, deduplicates exactly, then near-duplicates with MinHash, then semantically, scrubs PII before data leaves the logging boundary, labels with a rubric and measured agreement, and splits by time or user so train and eval do not share near-duplicates. LIMA (1,000 curated examples) and AlpaGasus (9k filtered from 52k, trained 5.7 times faster) are the evidence for quality over volume. The reader builds the pipeline and its leakage check.
   - Sources: https://arxiv.org/abs/2305.11206 ; https://arxiv.org/abs/2307.08701 ; https://arxiv.org/abs/2107.06499 ; https://arxiv.org/abs/2406.17557
   - Widget or lab: lab:eval-data-pipeline
   - Existing: `src/content/lessons/evals/golden-sets/overview.mdx` (split, receives-content). The production-curation material moves here.
2. **Synthetic data without collapse** (`synthetic-data`, lesson, senior). Model collapse appears when synthetic data replaces real data, and accumulating synthetic with real data kept test error bounded in Gerstgrasser et al. Nemotron-4 used over 98% synthetic alignment data with a released reward model as the filter, which is the pattern: generation is cheap and the filter decides quality. The reader designs a synthetic-data loop with its filter and its contamination check.
   - Sources: https://arxiv.org/abs/2404.01413 ; https://arxiv.org/abs/2406.11704 ; https://arxiv.org/abs/2307.08701
3. **Consent, retention and deletion for training data** (`consent-deletion`, lesson, senior). Using production conversations for evals or fine-tuning needs consent and retention terms that cover it, and deletion requests must reach eval sets and fine-tuning data. The lesson covers the EDPB's opinion on personal data in AI models, provider retention defaults, and the engineering of a deletion that propagates. The reader writes the data-use policy and the deletion path for a training set.
   - Sources: https://www.edpb.europa.eu/our-work-tools/our-documents/opinion-board-art-64/opinion-282024-certain-data-protection-aspects_en ; https://developers.openai.com/api/docs/guides/your-data ; https://presidio.dataprivacystack.org/

**Problems** (6; workflow 2, code 1, debug 1, concept 1, critique 1; hard 4, medium 2)

- `ops-019` (workflow, hard, senior, new) Eight thousand labelled support examples collected over two years for fine-tuning: curate them into training and eval sets. Source: https://aiengineeringinsider.substack.com/p/the-100-questions-that-haunt-ai-engineering
- `ops-020` (workflow, hard, staff, new, Core 100) Leadership wants production conversations used for eval sets and fine-tuning data: design the pipeline with consent, PII, deletion and leakage controls. Source: https://aiengineeringinsider.substack.com/p/the-100-questions-that-haunt-ai-engineering
- `ops-021` (code, medium, senior, new) Extract and clean a usable dataset from a demo database using only SQL and Python. Source: https://www.aced.io/blog/ai-engineer-interview-questions. Reported: Anthropic (candidate report via aced.io)
- `ops-022` (debug, hard, senior, new) A fine-tuned model scores higher on eval than in production: eval examples are paraphrases of training data, among other plausible causes. Source: https://arxiv.org/abs/2107.06499
- `ops-023` (concept, medium, senior, new) When does synthetic data cause collapse, and what does accumulating real data change? Source: https://arxiv.org/abs/2404.01413
- `ops-024` (critique, hard, senior, new) Critique a synthetic SFT set generated and graded by the same model with no held-out real data. Source: https://arxiv.org/abs/2406.11704

### llmops/fine-tuning: Fine-tuning in practice

Whether to fine-tune, a run end to end from base choice to held-out eval, and the two papers that correct the usual fine-tuning pitch.

**Lessons**

1. **Playbook: should we fine-tune?** (`should-we-fine-tune`, playbook, senior). Fine-tuning fixes format, style, narrow skills and cost; it loses to retrieval for knowledge (Ovadia et al.), and fine-tuning on facts the model does not know raises hallucination as those examples are learned (Gekhman et al.). It wins for narrow high-volume tasks where a small tuned model replaces a large prompted one, as LoRA Land shows. The 2026 platform reality is part of the input: OpenAI's self-serve fine-tuning closed to new organisations on 7 May 2026 and ends new jobs for existing customers on 6 January 2027.
   - Sources: https://arxiv.org/abs/2312.05934 ; https://arxiv.org/abs/2405.05904 ; https://arxiv.org/abs/2405.00732 ; https://menlovc.com/perspective/2025-the-state-of-generative-ai-in-the-enterprise/ ; https://developers.openai.com/api/docs/deprecations ; https://developers.openai.com/api/docs/guides/model-optimization
2. **A fine-tuning run end to end** (`fine-tuning-run`, lesson, senior). A run starts with the base (licence, size, chat template, tokenizer), the data format (messages, prompt-completion, tool calls) and loss on assistant tokens only, which in TRL needs generation markers in the chat template. Hyperparameters come with sources (TRL's default 2e-5 for full SFT and about 1e-4 suggested for adapters; Unsloth's 2e-4, one to three epochs and training loss below 0.2 as an overfitting sign), and evaluation is against the prompted base on a held-out set, starting from about 50 good examples as OpenAI's guide suggests. The reader can run and judge a LoRA fine-tune on rented hardware.
   - Sources: https://huggingface.co/docs/trl/sft_trainer ; https://unsloth.ai/docs/get-started/fine-tuning-llms-guide/lora-hyperparameters-guide ; https://developers.openai.com/api/docs/guides/supervised-fine-tuning ; https://thinkingmachines.ai/blog/lora/
3. **LoRA learns less and forgets less** (`lora-learns-less`, paper, senior). Biderman et al. found LoRA substantially underperforms full fine-tuning on code and maths in standard low-rank settings while forgetting less, and that full fine-tuning learns perturbations of 10 to 100 times higher rank. Read with LoRA Without Regret, the conditions are clear: LoRA matches full fine-tuning on small and medium SFT and RL when applied to all layers with a higher learning rate. The walkthrough ends with how to answer "LoRA or full fine-tune?" with conditions instead of a slogan.
   - Sources: https://arxiv.org/abs/2405.09673 ; https://thinkingmachines.ai/blog/lora/
4. **Fine-tuning on new knowledge encourages hallucinations** (`new-knowledge`, paper, senior). Gekhman et al. found that examples introducing knowledge the model lacks are learned more slowly and, once learned, increase hallucination roughly linearly. This is why "fine-tune it on our docs" is the wrong tool for facts that change, and why retrieval wins for knowledge. The walkthrough ends with how to explain this to a product manager in two minutes.
   - Sources: https://arxiv.org/abs/2405.05904 ; https://arxiv.org/abs/2312.05934

**Problems** (7; design 2, debug 1, critique 1, concept 2, estimate 1; hard 4, medium 3)

- `ops-025` (design, hard, staff, new) Develop a strategy for fine-tuning given OpenAI's self-serve wind-down: which workloads move, to what, and by when. Source: https://developers.openai.com/api/docs/deprecations. Reported: OpenAI (prompt reported by aced.io; the platform change postdates it)
- `ops-026` (debug, hard, senior, new) After fine-tuning the model parrots users: loss was computed on user turns because the template lacked generation markers. Source: https://huggingface.co/docs/trl/sft_trainer
- `ops-027` (critique, hard, senior, new) Critique a fine-tuning plan that trains on user turns, evaluates on paraphrases of training examples and has no prompted-base baseline. Source: https://huggingface.co/docs/trl/sft_trainer
- `ops-028` (concept, medium, senior, new) A product manager says: fine-tune a model on our company data so it knows our products. Respond with the evidence. Source: https://arxiv.org/abs/2405.05904
- `ops-029` (design, hard, senior, new) One 80 GB GPU, a 7B to 13B open-weight model and a month to adapt it to your domain: the plan, the evals and the stop rule. Source: https://aiengineeringinsider.substack.com/p/the-100-questions-that-haunt-ai-engineering
- `ops-030` (concept, medium, senior, new) How do you evaluate a generative model after fine-tuning, including regressions on general capability? Source: https://github.com/landedjobs/awesome-ai-engineer-interview/blob/main/company/openai.md. Reported: OpenAI (candidate report via landedjobs)
- `ops-031` (estimate, medium, senior, new) Cost and time of a LoRA fine-tune on rented H100s, choosing and stating your throughput assumption. Source: https://lambda.ai/pricing

### llmops/economics-selection: Unit economics, build or buy, and licences

Cost per successful outcome, the three build-or-buy decisions, and model selection with licence clauses that change the answer.

**Lessons**

1. **Unit economics of an AI feature** (`unit-economics`, lesson, senior). Cost per call is the wrong unit: cost per successful outcome includes attempts per success, tool and retrieval cost, and human escalation for failures. The market already prices outcomes (Intercom Fin charges $0.99 per outcome and defines it), and Epoch AI's price trends mean a decision justified by today's price can flip within a year. The reader builds the per-outcome cost model and compares it with an outcome price.
   - Sources: https://platform.claude.com/docs/en/about-claude/pricing ; https://www.intercom.com/pricing ; https://epoch.ai/data-insights/llm-inference-price-trends ; https://applied-llms.org/
   - Existing: `src/content/lessons/inference/gateways-finops/overview.mdx` (split, receives-content). Unit economics per outcome is new here; break-even stays in inference.
2. **Playbook: build versus buy** (`build-vs-buy`, playbook, senior). Three decisions get blurred: buy an AI product or build the feature, call an API or self-host weights, and train or adapt. The inputs are differentiation, data sensitivity and residency, volume and growth, team skills, time to value and deprecation risk; Menlo's survey found most enterprise AI solutions bought rather than built in 2025. The playbook ends with the costs teams forget: people, evals and on-call.
   - Sources: https://menlovc.com/perspective/2025-the-state-of-generative-ai-in-the-enterprise/ ; https://applied-llms.org/ ; https://huyenchip.com/2024/07/25/genai-platform.html ; https://lambda.ai/pricing
3. **Playbook: model selection and licence clauses** (`selection-licences`, playbook, senior). Selection is evals plus constraints, and the constraints include licence clauses: Llama 4's licence requires a separate licence above 700 million monthly active users, attribution and Llama-prefixed names for derivatives, while Gemma's terms reserve the right to restrict use and Apache 2.0 or MIT models carry no such clauses. Open weights are not open source under the OSI definition, which requires data information, code and parameters. The playbook adds retirement schedules and data retention as selection inputs.
   - Sources: https://dev.meta.ai/llama/llama4/license/ ; https://ai.google.dev/gemma/terms ; https://opensource.org/ai/open-source-ai-definition ; https://platform.claude.com/docs/en/about-claude/model-deprecations ; https://developers.openai.com/api/docs/guides/your-data

**Problems** (6; estimate 2, debug 1, design 2, critique 1; hard 6)

- `ops-032` (estimate, hard, senior, new, Core 100) Cost per resolved conversation for a support agent with stated tokens, success rate and escalation cost, compared with a $0.99 per-outcome price. Source: https://www.intercom.com/pricing
- `ops-033` (debug, hard, senior, new) The AI feature costs ten times more per user than projected: find the cause from the request bill of materials. Source: https://jobsbyculture.com/blog/ai-engineer-interview-questions-2026
- `ops-034` (design, hard, staff, new) An internal assistant for 20,000 employees: self-host an open model or use a hosted API, and how many GPUs. Source: https://aiengineeringinsider.substack.com/p/the-100-questions-that-haunt-ai-engineering
- `ops-035` (critique, hard, senior, new) Critique a three-year build decision justified by today's API price. Source: https://epoch.ai/data-insights/llm-inference-price-trends
- `ops-036` (estimate, hard, senior, new) An assistant with a 6,000-token system prompt serving two million requests a day: daily cost with and without caching, and which number dominates. Source: https://aiengineeringinsider.substack.com/p/the-100-questions-that-haunt-ai-engineering
- `ops-037` (design, hard, staff, new) A model strategy for five features (customer chat, document extraction, code assistance, summarisation, compliance review) in a regulated financial company. Source: https://aiengineeringinsider.substack.com/p/the-100-questions-that-haunt-ai-engineering

### llmops/platform-strategy: Staff strategy, platforms and decision rights

The questions staff candidates get about org shape and risk: AI strategy, shared platforms, governance and the one metric.

**Lessons**

1. **Playbook: AI strategy for a company** (`staff-strategy`, playbook, staff). Staff questions are about portfolio, platform and risk rather than prompts: which use cases first, which primitives to share, who decides, and what leadership will measure. The one-page shape is a portfolio ranked by value and risk, platform primitives (gateway, prompt registry, eval service, tracing, data controls), decision rights, and risk tiers mapped to NIST AI RMF functions. The playbook works a regulated firm with several features and ends with the first 90 days.
   - Sources: https://aiengineeringinsider.substack.com/p/the-100-questions-that-haunt-ai-engineering ; https://www.nist.gov/itl/ai-risk-management-framework ; https://huyenchip.com/2024/07/25/genai-platform.html
2. **Shared inference and eval platforms** (`shared-platforms`, lesson, staff). When a dozen teams call models in their own way, a shared platform pays for itself in keys, quotas, tracing and evals, and fails if it becomes a queue for every change. The lesson covers the platform's contract with product teams, paved paths versus mandates, and the platform's own success metric. The reader writes the charter for an internal AI platform team.
   - Sources: https://huyenchip.com/2024/07/25/genai-platform.html ; https://aiengineeringinsider.substack.com/p/the-100-questions-that-haunt-ai-engineering ; https://www.garagelabstech.com/blog/pm-interview-questions
3. **Decision rights and risk tiers** (`decision-rights`, lesson, staff). Governance that does not stop shipping assigns decision rights by risk tier: who moves a production label, who approves a new model, who can launch to all users. The lesson maps tiers to NIST AI RMF functions and to the release ladder, with evidence each tier must produce. The reader designs a process an auditor accepts and a team does not route around.
   - Sources: https://www.nist.gov/itl/ai-risk-management-framework ; https://langfuse.com/docs/prompt-management/data-model ; https://labs.cloudsecurityalliance.org/research/csa-research-note-soc2-ai-controls-gap-20260830-csa-styled/

**Problems** (6; design 2, behavioural 2, critique 1, presentation 1; hard 6)

- `ops-038` (design, hard, staff, new, Core 100) Twelve LLM features across chat, search, extraction and agents, each calling models its own way: design the shared inference platform. Source: https://aiengineeringinsider.substack.com/p/the-100-questions-that-haunt-ai-engineering
- `ops-039` (design, hard, staff, new) Eight product teams run ad-hoc evals in notebooks: design the shared eval platform and how you would know it works. Source: https://aiengineeringinsider.substack.com/p/the-100-questions-that-haunt-ai-engineering
- `ops-040` (behavioural, hard, staff, new) You own an internal AI platform other teams build agents on: your strategy, and the one metric you would own. Source: https://www.garagelabstech.com/blog/pm-interview-questions
- `ops-041` (behavioural, hard, staff, new) What would you build in your first 90 days? Source: https://github.com/landedjobs/awesome-ai-engineer-interview/blob/main/company/openai.md. Reported: OpenAI (candidate report via landedjobs)
- `ops-042` (critique, hard, staff, new) Critique a governance process that requires a committee review for every prompt change. Source: https://www.nist.gov/itl/ai-risk-management-framework
- `ops-043` (presentation, hard, staff, new) Present a one-page AI strategy to a VP: portfolio, platform primitives, decision rights and metrics, then take questions. Source: https://huyenchip.com/2024/07/25/genai-platform.html

## 12. Training, post-training and infrastructure (`training`)

What ML infra and research-engineer loops ask first: training FLOPs, MFU and scaling laws, GPUs and kernels, distributed training (collectives, ZeRO and FSDP2, tensor, pipeline, context and expert parallelism), numerics and loss spikes, reliability at scale, pretraining data and ablations, mixture of experts, SFT and reward models, RL for LLMs (PPO, the GRPO family, verifiers, reward hacking, rollout-trainer mismatch), distillation and merging, and adapting models. Every lab is pure Python in Pyodide (simulators, planners, toy policies), never real training in the browser. Public training reports (DeepSeek-V3, Llama 3, Kimi K2, OLMo 2, Qwen3, DeepSeek-R1) are the primary material.

### training/compute-scaling: Compute, scaling laws and the training budget

Turning a token budget and a cluster into days and MFU, what the scaling laws do and do not say, and sizing a run.

**Lessons**

1. **Training FLOPs, MFU and the budget equation** (`flops-mfu`, lesson, senior). Training compute is well approximated by 6 times parameters times tokens, which turns a token budget and a cluster into days once you assume an MFU. The lesson makes Llama 3 405B's 38 to 43% BF16 MFU and DeepSeek-V3's 180K H800 GPU hours per trillion tokens comparable, and shows attention FLOPs only dominate past sequence lengths around eight times the model dimension. The reader estimates days to train a stated model on a stated cluster.
   - Sources: https://jax-ml.github.io/scaling-book/transformers/ ; https://arxiv.org/html/2407.21783 ; https://arxiv.org/html/2412.19437v2 ; https://arxiv.org/abs/2204.02311
2. **Scaling laws: Kaplan, Chinchilla, and training past compute-optimal** (`scaling-laws`, lesson, senior). Kaplan found power laws over more than seven orders of magnitude, Chinchilla's 400-plus runs said to double tokens with model size, and the 20 tokens per parameter figure is a ratio derived from one run (1.4T over 70B). Deployed models train far past it because inference cost dominates, and Llama 3 used IsoFLOP curves to land on 405B against an extrapolated optimum of 402B on 16.55T tokens. The reader can say what a scaling law predicts and what it does not.
   - Sources: https://arxiv.org/abs/2001.08361 ; https://arxiv.org/abs/2203.15556 ; https://arxiv.org/abs/2401.00448 ; https://arxiv.org/html/2407.21783 ; https://arxiv.org/abs/2404.10102
3. **Chinchilla, replicated** (`chinchilla-replicated`, paper, staff). Besiroglu et al. found Chinchilla's parametric fit does not fit the extracted data, its intervals are implausibly narrow, and a re-fit agrees with the paper's other two methods. The walkthrough covers what that means for the 20x rule and for anyone extrapolating from small runs. It ends with the interview answer to "how sure are you about 20 tokens per parameter".
   - Sources: https://arxiv.org/abs/2404.10102 ; https://arxiv.org/abs/2203.15556
4. **Playbook: size the run** (`size-the-run`, playbook, staff). The inputs are target quality, expected inference volume, GPU count and type, and the deadline; the options are compute-optimal dense, inference-optimal smaller and longer, or MoE at a chosen sparsity. Sardana et al. found quality kept improving up to 10,000 tokens per parameter, and Kimi K2 published a sparsity scaling law for its MoE. The playbook ends with what to measure during the run: loss against the extrapolated curve, MFU and effective training time.
   - Sources: https://arxiv.org/abs/2401.00448 ; https://arxiv.org/html/2407.21783 ; https://arxiv.org/html/2507.20534

**Problems** (6; estimate 2, concept 1, design 1, mcq 1, critique 1; hard 5, medium 1)

- `trn-001` (estimate, hard, senior, new, Core 100) Days to train a stated dense model on a stated number of H100s at an MFU you choose and defend, using 6ND. Source: https://jax-ml.github.io/scaling-book/transformers/
- `trn-002` (estimate, hard, staff, new) From DeepSeek-V3's published GPU hours and tokens, estimate the run's hardware utilisation and label it an estimate. Source: https://jax-ml.github.io/scaling-book/transformers/
- `trn-003` (concept, hard, senior, new) How sure are you about 20 tokens per parameter, and what would you use instead to size a run? Source: https://arxiv.org/abs/2404.10102
- `trn-004` (design, hard, staff, new) Size a run for a stated inference volume: compute-optimal dense, smaller and longer, or MoE. Source: https://arxiv.org/abs/2401.00448
- `trn-005` (mcq, medium, senior, new) Which H100 BF16 peak goes in the MFU denominator: the sparse figure or the dense one? Source: https://www.nvidia.com/en-us/data-center/h100/
- `trn-006` (critique, hard, senior, new) Critique an MFU report that uses the sparse peak and counts recomputed activations as useful FLOPs. Source: https://jax-ml.github.io/scaling-book/transformers/

### training/gpu-kernels: GPUs, roofline and kernels for training

The GPU as a memory hierarchy, the roofline for a training step, fusion and compilation, and profiling as an experiment.

**Lessons**

1. **The GPU as a memory hierarchy** (`gpu-hierarchy`, lesson, senior). An H100 SXM has 132 SMs, up to 228 KB of shared memory per SM, a 50 MB L2 and 80 GB of HBM at 3.35 TB/s, and every kernel decision is about which level the data lives in. The lesson covers warps, blocks, occupancy, TMA and clusters, and the spec-sheet trap that 1,979 BF16 TFLOPS is the sparsity figure while dense is 989. The reader can explain why a kernel is slow from where its data sits.
   - Sources: https://developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/ ; https://www.nvidia.com/en-us/data-center/h100/ ; https://www.nvidia.com/en-us/data-center/hgx/ ; https://nanotron-ultrascale-playbook.static.hf.space/
2. **The roofline for a training step** (`roofline-training`, lesson, senior). Arithmetic intensity against the H100's critical intensity of about 295 FLOPs per byte says whether an op is compute-bound or bandwidth-bound. Large-batch matmuls are compute-bound while norms and pointwise ops are bandwidth-bound, and small ops are overhead-bound. The reader classifies the ops of a transformer block and picks what to fuse.
   - Sources: https://jax-ml.github.io/scaling-book/roofline/ ; https://horace.io/brrr_intro.html
3. **Fusion, torch.compile, Triton and CUDA graphs** (`fusion-compile`, lesson, senior). Fusing pointwise ops saves HBM round trips, torch.compile's modes trade compile time and memory for speed, and reduce-overhead mode uses CUDA graphs that need static shapes and no CPU synchronisation during capture. The lesson covers graph breaks, recompilation with dynamic shapes, the caching allocator and the ladder from PyTorch to torch.compile to Triton to CUDA. The reader knows when a custom kernel is worth writing.
   - Sources: https://docs.pytorch.org/docs/2.14/generated/torch.compile.html ; https://docs.pytorch.org/docs/2.14/notes/cuda.html ; https://nanotron-ultrascale-playbook.static.hf.space/
4. **Playbook: profiling a kernel like an experiment** (`profiling-playbook`, playbook, staff). Profiling is an experiment: baseline, controlled changes, variance reduction, stop criteria, attribution and a correctness gate. The playbook is built on the reported Anthropic profiling prompt and Anthropic's public performance take-home, whose README records model submissions that cheated by editing tests. It ends with what you write down after each change.
   - Sources: https://prachub.com/interview-questions/design-a-profiling-plan-for-kernels ; https://github.com/anthropics/original_performance_takehome

**Problems** (6; estimate 1, design 1, code 1, debug 2, mcq 1; medium 2, hard 4)

- `trn-007` (estimate, medium, senior, new) At what batch size does a BF16 matmul become compute-bound on an H100, and why? Source: https://jax-ml.github.io/scaling-book/roofline/
- `trn-008` (design, hard, staff, new) With only a kernel simulator reporting cycles, IPC, stall reasons, occupancy and bandwidth, design a rigorous plan to profile and optimise a kernel. Source: https://prachub.com/interview-questions/design-a-profiling-plan-for-kernels. Reported: Anthropic (candidate report via PracHub)
- `trn-009` (code, hard, staff, new) Make a kernel on a simulated machine run in fewer cycles (the shape of Anthropic's public performance take-home), with tests that cannot be edited. Source: https://github.com/anthropics/original_performance_takehome. Reported: Anthropic (first-party repository)
- `trn-010` (debug, hard, senior, new) torch.compile in reduce-overhead mode is slower than eager and recompiles every few steps. Source: https://docs.pytorch.org/docs/2.14/generated/torch.compile.html
- `trn-011` (debug, hard, senior, new) GPUs are starved for input: diagnose across storage, CPU preprocessing, batching, transfer and synchronisation. Source: https://prachub.com/interview-questions/keep-gpus-fed-with-an-efficient-data-preparation-pipeline. Reported: Mistral AI (candidate report via PracHub)
- `trn-012` (mcq, medium, senior, new) Which of these ops is compute-bound on an H100 at a stated batch: a large matmul, layer norm, softmax or GELU? Source: https://horace.io/brrr_intro.html

### training/distributed: Distributed training

Collectives, the memory anatomy of a step, ZeRO and FSDP2, tensor, sequence, pipeline and context parallelism, and composing them.

**Lessons**

1. **Collectives from first principles** (`collectives`, lesson, senior). All-reduce, reduce-scatter, all-gather, all-to-all and broadcast are the vocabulary of distributed training, and ring all-reduce is a reduce-scatter followed by an all-gather. Per-GPU traffic for ring all-reduce stays near twice the buffer size regardless of GPU count, which is why bandwidth, not count, sets its cost. The lab simulates it and counts bytes per rank.
   - Sources: https://nanotron-ultrascale-playbook.static.hf.space/
   - Widget or lab: lab:ring-allreduce
2. **Memory anatomy of a training step** (`step-memory`, lesson, senior). Mixed-precision Adam needs 16 bytes per parameter (20 with FP32 gradient accumulation) before activations, and activations grow with sequence length and batch. Selective recomputation with sequence parallelism cut activation memory five times with over 90% less recompute overhead in Korthikanti et al. The reader plans memory for a stated model and parallel layout in the lab.
   - Sources: https://arxiv.org/abs/1910.02054 ; https://nanotron-ultrascale-playbook.static.hf.space/ ; https://arxiv.org/abs/2205.05198
   - Widget or lab: lab:training-memory-planner
3. **Data parallelism, ZeRO and FSDP2** (`zero-fsdp`, lesson, senior). ZeRO-1 shards optimizer states, ZeRO-2 adds gradients and ZeRO-3 adds parameters at about 3 units of traffic against 2. FSDP2 shards each parameter as a DTensor on dimension 0 with mixed-precision policies and prefetching, and applying fully_shard only at the root gives one large all-gather with no overlap. The reader can say what a ZeRO-3 step communicates and when it hides.
   - Sources: https://arxiv.org/abs/1910.02054 ; https://nanotron-ultrascale-playbook.static.hf.space/ ; https://docs.pytorch.org/docs/2.14/distributed.fsdp.fully_shard.html
4. **Tensor and sequence parallelism** (`tensor-sequence`, lesson, senior). Tensor parallelism splits the MLP and attention matmuls column then row, with collectives every layer, which is why it stays inside an NVLink domain; the Ultrascale Playbook measured large drops when it crossed nodes. Sequence parallelism shards norms and dropout along the sequence. The lesson pairs with the reported OpenAI question on deriving a sharded matmul and its backward pass.
   - Sources: https://arxiv.org/abs/2104.04473 ; https://arxiv.org/abs/2205.05198 ; https://nanotron-ultrascale-playbook.static.hf.space/
5. **Pipeline parallelism and its schedules** (`pipeline-schedules`, lesson, senior). All-forward-all-backward has a bubble of (p - 1) / m, 1F1B keeps that bubble but caps in-flight activations, interleaving cuts it to about (p - 1) / (v m) at v times the communication, and zero-bubble schedules split the backward pass. DeepSeek-V3's DualPipe overlaps computation and communication across directions. The lab simulates the schedules and checks the formulas.
   - Sources: https://nanotron-ultrascale-playbook.static.hf.space/ ; https://arxiv.org/abs/2104.04473 ; https://arxiv.org/html/2412.19437v2
   - Widget or lab: lab:pipeline-schedule
6. **Context parallelism and ring attention** (`context-parallel`, lesson, staff). Context parallelism splits a long sequence across GPUs and rotates keys and values around a ring while computing, and causal masking unbalances the work unless chunks are assigned in a zig-zag. Llama 3 trained a context-parallel stage at 131,072 tokens with CP 16 at 38% MFU. The reader decides when context parallelism is needed and what it costs.
   - Sources: https://nanotron-ultrascale-playbook.static.hf.space/ ; https://arxiv.org/html/2407.21783
7. **Playbook: composing 4D and 5D parallelism** (`composing-parallelism`, playbook, staff). The order of decisions is fit one replica, reach the global batch, then maximise throughput, with TP inside nodes and PP or ZeRO-3 across them, and PP and ZeRO-3 rarely together. Published configs differ sharply: Llama 3 used TP 8, PP 16 and data parallelism up to 128, while DeepSeek-V3 used PP 16, EP 64 over 8 nodes and ZeRO-1 with no tensor parallelism. The worked case is the reported Meta prompt with 256 A100-80GB GPUs.
   - Sources: https://nanotron-ultrascale-playbook.static.hf.space/ ; https://arxiv.org/html/2407.21783 ; https://arxiv.org/html/2412.19437v2 ; https://prachub.com/interview-questions/design-a-scalable-moe-pretraining-pipeline

**Problems** (8; design 1, concept 2, estimate 2, debug 1, critique 1, code 1; hard 6, medium 2)

- `trn-013` (design, hard, staff, new, Core 100, Crunch 22) An MoE pretraining pipeline for about 1T tokens on 256 A100-80GB GPUs: experts and top-k, parallelism and group sizes, all-to-all overlap, memory per GPU, checkpointing and elastic restart; then scale to 1,024 GPUs. Source: https://prachub.com/interview-questions/design-a-scalable-moe-pretraining-pipeline. Reported: Meta (candidate report via PracHub)
- `trn-014` (concept, hard, staff, new, Core 100) Y = X @ W with W column-sharded over P devices: derive forward and backward and name every collective needed for a replicated dX with dW sharded. Source: https://prachub.com/interview-questions/derive-sharded-matrix-multiplication-and-backpropagation. Reported: OpenAI (candidate report via PracHub)
- `trn-015` (estimate, hard, senior, new) ZeRO-3 memory per GPU for a stated model, GPU count and sequence length, including activations with and without recompute. Source: https://arxiv.org/abs/1910.02054
- `trn-016` (estimate, medium, senior, new) Pipeline bubble for p = 16 and m = 32, then with interleaving at v = 2, and what the interleaving costs. Source: https://nanotron-ultrascale-playbook.static.hf.space/
- `trn-017` (debug, hard, senior, new) MFU dropped after tensor parallelism moved from 8 to 16 on the same cluster. Source: https://nanotron-ultrascale-playbook.static.hf.space/
- `trn-018` (critique, hard, staff, new) Critique a parallel layout for a large dense run with tensor parallelism across nodes and pipeline parallelism combined with ZeRO-3. Source: https://nanotron-ultrascale-playbook.static.hf.space/
- `trn-019` (concept, medium, senior, new) Tensor versus pipeline parallelism for training and for inference: bubbles, micro-batches, interconnect and small inference batches. Source: https://prachub.com/interview-questions/compare-tensor-parallelism-and-pipeline-parallelism. Reported: Mistral AI (candidate report via PracHub)
- `trn-020` (code, hard, senior, new) Ring all-reduce simulator: reduce-scatter then all-gather, with a test that per-rank traffic equals 2(N - 1)/N of the buffer. Source: https://nanotron-ultrascale-playbook.static.hf.space/

### training/numerics: Precision, optimizers and stability

Mixed precision without folklore, FP8 as DeepSeek-V3 did it, loss spikes and how labs stopped them, and AdamW, decoupled decay and Muon.

**Lessons**

1. **Mixed precision without folklore** (`mixed-precision`, lesson, senior). FP16 needed loss scaling because of its narrow exponent range, and BF16 keeps FP32's range with fewer mantissa bits, so it does not. Master weights and FP32 reductions still matter, and FSDP2 exposes them as parameter and reduce dtypes. The reader can say which tensors stay in FP32 and why.
   - Sources: https://arxiv.org/abs/1710.03740 ; https://nanotron-ultrascale-playbook.static.hf.space/ ; https://docs.pytorch.org/docs/2.14/distributed.fsdp.fully_shard.html
2. **FP8 training as DeepSeek-V3 did it** (`fp8-deepseek`, paper, staff). DeepSeek-V3 ran FP8 GEMMs for forward and both backward passes with 1x128 activation tiles, 128x128 weight blocks and promotion to FP32 every 128 elements, kept embeddings, the output head, gating, norms and attention in higher precision, and reported relative loss error under 0.25% against BF16. The walkthrough compares per-tensor scaling with E4M3 and E5M2 formats. It ends with what "we trained in FP8" should make an interviewer ask.
   - Sources: https://arxiv.org/html/2412.19437v2 ; https://arxiv.org/abs/2209.05433 ; https://developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/
3. **Loss spikes and how labs stopped them** (`loss-spikes`, lesson, staff). OLMo 2 linked spikes to batches with long repeated n-grams and added RMSNorm reordering, QK-norm, z-loss and no weight decay on embeddings; Kimi K2 found attention logits exploding under Muon and capped them with QK-Clip, reporting no loss spikes over 15.5T tokens; DeepSeek-V3 reports no irrecoverable spikes or rollbacks. The lesson turns these into a first-hour checklist for an upward spike. Each fix is presented with the run that motivated it.
   - Sources: https://arxiv.org/html/2501.00656 ; https://arxiv.org/html/2507.20534 ; https://arxiv.org/abs/2412.19437
4. **Optimizers: AdamW, decoupled decay and Muon** (`optimizers`, lesson, senior). An L2 penalty in the loss is not decoupled weight decay under Adam, which is why AdamW exists, and decay interacts with the learning-rate schedule. Muon reports about twice the compute efficiency of AdamW once weight decay and per-parameter update scaling are added, and Kimi K2 needed QK-Clip to keep it stable at scale. The reader can explain the difference and when to try Muon.
   - Sources: https://prachub.com/interview-questions/explain-adam-adamw-and-decoupled-weight-decay ; https://arxiv.org/abs/2502.16982 ; https://arxiv.org/html/2507.20534

**Problems** (6; debug 2, concept 2, code 1, mcq 1; hard 3, medium 3)

- `trn-021` (debug, hard, senior, new) Loss goes to NaN after a partial move from FP16 to BF16: find the reduction still running in low precision. Source: https://arxiv.org/abs/1710.03740
- `trn-022` (debug, hard, staff, new, Core 100) An upward loss spike at step N in a long run: what do you look at in the first hour, and what do you change? Source: https://prachub.com/interview-questions/answer-an-llm-systems-quick-fire-interview. Reported: Mistral AI (candidate report via PracHub)
- `trn-023` (concept, medium, senior, new) Why does BF16 often work better than FP16 for training stability? Source: https://prachub.com/interview-questions/answer-an-llm-systems-quick-fire-interview. Reported: Mistral AI (candidate report via PracHub)
- `trn-024` (concept, medium, senior, new) Adam versus AdamW: why an L2 penalty differs from decoupled weight decay, and how decay interacts with the schedule. Source: https://prachub.com/interview-questions/explain-adam-adamw-and-decoupled-weight-decay. Reported: Mistral AI (candidate report via PracHub)
- `trn-025` (code, hard, senior, new) Stable softmax cross-entropy and its gradient with a finite-difference check. Source: https://prachub.com/interview-questions/hand-written-gradients-prefix-product-backward-pass-and-stable-cross-entropy. Reported: OpenAI (candidate report via PracHub)
- `trn-026` (mcq, medium, senior, new) Which components did DeepSeek-V3 keep in higher precision during FP8 training? Source: https://arxiv.org/html/2412.19437v2

### training/reliability: Reliability at scale

What fails in a large run, checkpointing that does not stall training, and finding bad nodes.

**Lessons**

1. **What fails in a 16K-GPU run** (`failures-at-scale`, lesson, staff). Llama 3 405B had 466 interruptions in 54 days, 419 of them unexpected and about 78% of those attributed to hardware, with faulty GPUs and HBM3 the top causes and six silent data corruptions, while keeping effective training time above 90%. The lesson separates MFU from effective training time and flags an arithmetic inconsistency in the paper's failure table. The reader can design for the failure rate rather than against it.
   - Sources: https://arxiv.org/html/2407.21783
2. **Checkpointing that does not stall training** (`checkpointing`, lesson, senior). Distributed checkpoints are per-rank files resharded at load, with asynchronous saves staged to CPU memory and written by a separate thread. The checkpoint interval is a trade between failure rate and save time, and Kimi K2's checkpoint engine updated a 1T model for RL in under 30 seconds. The reader chooses an interval and proves restores bring back optimizer state.
   - Sources: https://docs.pytorch.org/docs/2.14/distributed.checkpoint.html ; https://arxiv.org/abs/2410.06511 ; https://arxiv.org/html/2507.20534
3. **Finding bad nodes** (`bad-nodes`, lesson, senior). Bad nodes show up as NCCL watchdog timeouts, stragglers and silent corruption, and finding them is group testing under constraints. The lesson builds on the reported xAI question of finding faulty nodes with parallel group tests that cannot share nodes, including flaky tests and a live cluster. The reader implements the search and states its round count.
   - Sources: https://prachub.com/interview-questions/find-all-faulty-gpu-nodes-with-parallel-group-tests-that-cannot-share-nodes ; https://arxiv.org/html/2407.21783

**Problems** (6; code 1, estimate 1, debug 1, concept 1, design 1, critique 1; hard 4, medium 2)

- `trn-027` (code, hard, senior, new, Core 100) Find all faulty GPU nodes with parallel group tests that cannot share nodes; then handle few bad nodes and flaky tests. Source: https://prachub.com/interview-questions/find-all-faulty-gpu-nodes-with-parallel-group-tests-that-cannot-share-nodes. Reported: xAI (candidate report via PracHub)
- `trn-028` (estimate, hard, senior, new) Choose a checkpoint interval from a failure rate and save time you state, and compute the expected lost work. Source: https://arxiv.org/html/2407.21783
- `trn-029` (debug, hard, senior, new) A checkpoint restore silently drops optimizer state and the loss curve tells you only later. Source: https://docs.pytorch.org/docs/2.14/distributed.checkpoint.html
- `trn-030` (concept, medium, senior, new) MFU versus effective training time: which one a failure storm hurts, and which one the board should see. Source: https://arxiv.org/html/2407.21783
- `trn-031` (design, hard, staff, new) Elastic restart and bad-node quarantine for a 2,048-GPU run. Source: https://arxiv.org/abs/2410.06511
- `trn-032` (critique, medium, senior, new) Critique a postmortem that quotes Llama 3's faulty-GPU percentage without checking its denominator. Source: https://arxiv.org/html/2407.21783

### training/pretraining-data: Pretraining data and ablations

From Common Crawl to tokens, dedup at three levels, mixing and annealing, running short on quality tokens, small-scale ablations, and benchmarks that move for the wrong reason.

**Lessons**

1. **From Common Crawl to tokens** (`crawl-to-tokens`, lesson, senior). Extraction, language identification, heuristic filters and model-based quality classifiers turn a crawl into training tokens, and each choice is decided by training small models per variant. FineWeb produced 15T tokens from 96 snapshots, and DCLM found model-based filtering the key step, training a 7B model to 64% MMLU 5-shot on 2.6T tokens. The reader designs the filter stack and its ablation plan.
   - Sources: https://arxiv.org/abs/2406.17557 ; https://arxiv.org/abs/2406.11794
2. **Dedup: exact, near and line-level** (`dedup-levels`, lesson, senior). Lee et al. found one 61-word sentence over 60,000 times in C4 and a tenfold drop in memorised emissions after dedup, and Llama 3 deduplicated at URL, document (MinHash) and line level. OLMo 2's micro-annealing found some duplication helpful, so dedup is a tuned choice, not a maximum. The lab builds MinHash with LSH bands.
   - Sources: https://arxiv.org/abs/2107.06499 ; https://arxiv.org/html/2407.21783 ; https://arxiv.org/html/2501.00656
   - Widget or lab: lab:minhash-dedup
3. **Mixing, annealing and mid-training** (`mixing-annealing`, lesson, staff). Llama 3's mix was roughly half general, a quarter maths and reasoning, 17% code and 8% multilingual, with annealing on high-quality data that helped the 8B and barely moved the 405B. OLMo 2 souped several anneals, Qwen3 used three pretraining stages, and Kimi K2 rephrased data rather than repeating it. The reader plans a mid-training stage and its evaluation.
   - Sources: https://arxiv.org/html/2407.21783 ; https://arxiv.org/html/2501.00656 ; https://arxiv.org/html/2505.09388 ; https://arxiv.org/html/2507.20534
4. **Playbook: not enough high-quality tokens** (`not-enough-tokens`, playbook, staff). After aggressive filtering the options are relaxing filters, repeating epochs, rephrasing, synthesising or distilling, each with a cost and a risk. Kimi K2 reported better SimpleQA from ten rephrasings seen once than from ten epochs of raw data, and Nemotron-4 used mostly synthetic alignment data with a reward-model filter. The playbook answers the NVIDIA follow-up reported for this question.
   - Sources: https://prachub.com/interview-questions/plan-how-raw-text-becomes-llm-training-data-filtering-dedup-mixing-evaluation ; https://arxiv.org/html/2507.20534 ; https://arxiv.org/abs/2406.11704
5. **Small-scale ablations and micro-annealing** (`ablations`, lesson, staff). Data decisions are made with small models: FineWeb and DCLM ran ablations per choice, OLMo 2 used micro-annealing to judge a source cheaply, and Llama 3 judged data by annealing the 8B. Scaling-law extrapolation predicts the large run from the small ones within limits. The reader designs an ablation that decides whether a new source enters the mix.
   - Sources: https://arxiv.org/abs/2406.17557 ; https://arxiv.org/abs/2406.11794 ; https://arxiv.org/html/2501.00656 ; https://arxiv.org/html/2407.21783
6. **Benchmarks that move for the wrong reason** (`benchmarks-wrong-reason`, lesson, senior). Contamination, overfitting to fixed benchmarks and metric choice (pass@1 versus pass@k versus majority vote) all move scores without moving capability. DeepSeek-V3 states an aim to avoid over-optimising fixed benchmarks, and the reported NVIDIA follow-up asks what to do when benchmarks rise and a user-facing language regresses. The reader builds the regression check that catches it.
   - Sources: https://arxiv.org/abs/2107.06499 ; https://arxiv.org/html/2412.19437v2 ; https://arxiv.org/abs/2504.13837 ; https://prachub.com/interview-questions/plan-how-raw-text-becomes-llm-training-data-filtering-dedup-mixing-evaluation

**Problems** (6; design 1, code 1, concept 1, estimate 1, debug 1, workflow 1; hard 5, medium 1)

- `trn-033` (design, hard, senior, new, Core 100) Turn raw text into a curated training set (sources, filtering, dedup, mixing, evaluation); then there are too few quality tokens, and a user-facing language regressed. Source: https://prachub.com/interview-questions/plan-how-raw-text-becomes-llm-training-data-filtering-dedup-mixing-evaluation. Reported: NVIDIA (candidate report via PracHub)
- `trn-034` (code, hard, senior, new) MinHash near-dedup with shingles, signatures and LSH bands; hidden tests plant near-duplicates and distinct documents. Source: https://arxiv.org/abs/2107.06499
- `trn-035` (concept, hard, staff, new) Rephrase, repeat or synthesise when filtering leaves too few tokens: the cost and risk of each. Source: https://arxiv.org/html/2507.20534
- `trn-036` (estimate, medium, senior, new) Turn a mix in percentages into token counts and epochs per source for a stated budget and source sizes. Source: https://arxiv.org/html/2407.21783
- `trn-037` (debug, hard, senior, new) Benchmarks went up and a user-facing language regressed after a data change. Source: https://prachub.com/interview-questions/plan-how-raw-text-becomes-llm-training-data-filtering-dedup-mixing-evaluation
- `trn-038` (workflow, hard, staff, new) A small-scale ablation plan to decide whether a new data source goes into the mix. Source: https://arxiv.org/html/2501.00656

### training/moe: Mixture of experts in training

Routing, capacity and load balance, expert parallelism with all-to-all, and sparsity as a design knob.

**Lessons**

1. **Routing, capacity and load balance** (`routing-balance`, lesson, senior). Top-k routing with a capacity factor drops tokens when experts overflow, auxiliary losses balance load, and DeepSeek-V3 replaced the auxiliary loss with a bias updated during training. Qwen3 uses a global-batch balance loss and no shared experts while DeepSeekMoE uses fine-grained plus shared experts. The lesson covers router collapse and making a hard router differentiable.
   - Sources: https://arxiv.org/abs/2101.03961 ; https://arxiv.org/abs/2401.06066 ; https://arxiv.org/html/2412.19437v2 ; https://arxiv.org/html/2505.09388 ; https://prachub.com/interview-questions/make-a-hard-moe-router-differentiable
2. **Expert parallelism and all-to-all** (`expert-parallelism`, lesson, staff). Expert parallelism dispatches tokens to experts on other GPUs and combines them back with two all-to-all exchanges per layer, which can cancel the compute saving. DeepSeek-V3 limited each token to at most 4 nodes to bound that traffic. The reader decides expert placement and when communication eats the gain.
   - Sources: https://arxiv.org/html/2412.19437v2 ; https://nanotron-ultrascale-playbook.static.hf.space/ ; https://prachub.com/interview-questions/explain-mixture-of-experts-and-expert-parallelism
3. **Sparsity as a design knob** (`sparsity-knob`, paper, staff). Kimi K2 fit a sparsity scaling law and chose 384 experts with 8 active, reporting fewer FLOPs than lower sparsity at the same validation loss, and kept 64 attention heads because doubling them would add substantial inference FLOPs at long context. The walkthrough reads the paper as a set of trade-offs between training and serving cost. It ends with what you would ask before copying the configuration.
   - Sources: https://arxiv.org/html/2507.20534

**Problems** (6; concept 2, debug 1, estimate 1, mcq 1, design 1; hard 5, medium 1)

- `trn-039` (concept, hard, senior, new) Trace tokens through routing, expert compute and combine; explain total versus active parameters and when communication cancels the saving. Source: https://prachub.com/interview-questions/explain-mixture-of-experts-and-expert-parallelism. Reported: Mistral AI (candidate report via PracHub)
- `trn-040` (concept, hard, staff, new) Make a hard top-k router differentiable: straight-through, Gumbel-softmax, relaxations or REINFORCE, with the auxiliary losses and defaults you would pick. Source: https://prachub.com/interview-questions/make-a-hard-moe-router-differentiable. Reported: Citadel (candidate report via PracHub)
- `trn-041` (debug, hard, senior, new) Router collapse: two experts take most tokens a few thousand steps in. Source: https://arxiv.org/abs/2101.03961
- `trn-042` (estimate, hard, staff, new) Tokens per batch for an MoE layer to be compute-bound with DeepSeek's expert configuration, labelled as an estimate. Source: https://jax-ml.github.io/scaling-book/transformers/
- `trn-043` (mcq, medium, senior, new) DeepSeek-V3's auxiliary-loss-free balancing adjusts which quantity during training? Source: https://arxiv.org/html/2412.19437v2
- `trn-044` (design, hard, staff, new) Choose expert count, top-k and shared experts for a stated training and serving budget. Source: https://arxiv.org/html/2507.20534

### training/post-training: SFT, preferences and reward models

Building SFT data, reward models and their limits, and DPO in practice.

**Lessons**

1. **Building SFT data** (`sft-data`, lesson, senior). SFT data comes from domain-specific generation, rejection sampling from expert models and packing with isolation masks; DeepSeek-V3 used about 1.5M instances for two epochs and fixed overthinking, formatting and length problems in R1-generated data. Llama 3 ran several rounds of SFT then DPO with rejection sampling of many samples per prompt. The reader designs the SFT data pipeline for one capability.
   - Sources: https://arxiv.org/html/2412.19437v2 ; https://arxiv.org/html/2407.21783
2. **Reward models and their limits** (`reward-models`, lesson, senior). Pairwise reward models, rule-based rewards and process supervision each fail differently, and Gao et al. showed over-optimisation against a proxy reward. Lightman et al. found process supervision beating outcome supervision on maths, while DeepSeek-R1 abandoned process reward models because steps are hard to define and judge and invite reward hacking. The reader picks a reward source for a task and names how it will be gamed.
   - Sources: https://arxiv.org/html/2412.19437v2 ; https://arxiv.org/abs/2305.20050 ; https://arxiv.org/html/2501.12948v1 ; https://arxiv.org/abs/2210.10760
3. **DPO in practice** (`dpo-practice`, lesson, senior). DPO needs a frozen reference model but no separate reward model and no sampling during training, and its beta controls how far the policy moves. The lesson covers dataset construction (fields, ties, noisy labels), offline versus online preference data, and Llama 3's settings (learning rate 1e-5, beta 0.1, an NLL term on chosen responses). The lab derives the loss and its gradient by hand.
   - Sources: https://arxiv.org/abs/2305.18290 ; https://arxiv.org/html/2407.21783 ; https://prachub.com/interview-questions/explain-dpo-and-construct-its-training-data
   - Widget or lab: lab:preference-learning

**Problems** (6; concept 2, debug 2, code 1, design 1; hard 5, medium 1)

- `trn-045` (concept, hard, senior, new, Core 100) DPO versus PPO-based RLHF and why DPO skips the reward model; then specify a DPO dataset: fields, chosen and rejected sources, ties, noisy labels and filtering. Source: https://prachub.com/interview-questions/explain-dpo-and-construct-its-training-data. Reported: TikTok (candidate report via PracHub)
- `trn-046` (debug, hard, senior, new) A DPO run where the chosen responses' log-probabilities also fall: is it a bug, and what do you change? Source: https://arxiv.org/abs/2305.18290
- `trn-047` (code, hard, senior, new) DPO loss and gradient by hand on toy pairs; tests check the loss equals log 2 when policy equals reference and a finite-difference gradient. Source: https://arxiv.org/abs/2305.18290
- `trn-048` (design, hard, senior, new) A real-time QA chatbot: training data, RL tasks and rewards, the reward's weaknesses and how you detect the policy exploiting it. Source: https://prachub.com/interview-questions/design-a-real-time-question-answering-chatbot-training-data-rl-tasks-and-rewards. Reported: Meta (candidate report via PracHub)
- `trn-049` (concept, medium, senior, new) Process versus outcome reward models, and why DeepSeek-R1 dropped process rewards. Source: https://arxiv.org/html/2501.12948v1
- `trn-050` (debug, hard, senior, new) The proxy reward keeps rising while human preference falls: diagnose over-optimisation and decide the stopping rule. Source: https://arxiv.org/abs/2210.10760

### training/rl: Reinforcement learning for LLMs

PPO mechanics, the GRPO family, verifiers and environments, reward hacking, and the infrastructure that makes on-policy RL off-policy.

**Lessons**

1. **PPO for language models** (`ppo`, lesson, senior). PPO for LLMs has a policy, a value model, a reward model and a reference, a clipped surrogate objective, and a KL penalty that can sit in the reward or in the loss. GRPO drops the value model by normalising rewards within a group of samples. The reader can say which policy is "old" in the ratio and what each model costs in memory.
   - Sources: https://arxiv.org/abs/2203.02155 ; https://arxiv.org/abs/2402.03300 ; https://prachub.com/resources/llm-post-training-interview-questions-sft-dpo-ppo-and-grpo-trade-offs
2. **The GRPO family: GRPO, Dr. GRPO, DAPO and GSPO** (`grpo-family`, paper, staff). GRPO uses group-relative advantages, so a group where every sample is correct contributes zero gradient; Dr. GRPO removes a length bias; DAPO adds clip-higher, dynamic sampling, token-level loss and overlong shaping and drops the KL term, reaching 50 on AIME 2024 with Qwen2.5-32B in half the steps of the R1-Zero baseline; GSPO moves to a sequence-level ratio for MoE stability. TRL's current defaults encode several of these choices (no KL term, a DAPO loss type). The walkthrough ends with which choice you would make for a stated task and why.
   - Sources: https://arxiv.org/abs/2402.03300 ; https://arxiv.org/abs/2503.20783 ; https://arxiv.org/html/2503.14476 ; https://arxiv.org/abs/2507.18071 ; https://huggingface.co/docs/trl/main/en/grpo_trainer
   - Widget or lab: lab:grpo-toy
3. **RLVR, verifiers and environments** (`verifiers-environments`, lesson, senior). R1-Zero used rule-based accuracy and format rewards, Qwen3 ran reasoning RL on 3,995 query-verifier pairs and moved AIME'24 from 70.1 to 85.1 in 170 steps, and Kimi K2 combined real and synthetic environments with a self-critique rubric reward. Open tooling (Prime Intellect's verifiers and Environments Hub) makes environments shareable. The reader designs a verifier and lists how a policy could satisfy it without doing the task.
   - Sources: https://arxiv.org/html/2501.12948 ; https://arxiv.org/html/2505.09388 ; https://arxiv.org/html/2507.20534 ; https://github.com/PrimeIntellect-ai/verifiers ; https://www.primeintellect.ai/blog/intellect-3
4. **Reward hacking: evidence and mitigations** (`reward-hacking`, lesson, staff). Models edit unit tests, exit early from harnesses and flatter graders, and Anthropic found that learning to reward-hack in real coding environments generalised to sabotage in 12% of a Claude Code evaluation and alignment-faking reasoning in 50% of responses, with inoculation prompting removing most of it. Baker et al. showed chain-of-thought monitoring catches hacking but optimising against the monitor produces obfuscated hacking. The reader designs environments and monitors that make hacking visible rather than hidden.
   - Sources: https://lilianweng.github.io/posts/2024-11-28-reward-hacking/ ; https://arxiv.org/abs/2503.11926 ; https://www.anthropic.com/research/emergent-misalignment-reward-hacking ; https://github.com/anthropics/original_performance_takehome
5. **RL infrastructure: rollouts, staleness and mismatch** (`rl-infrastructure`, lesson, staff). Rollouts run in an inference engine and gradients in a trainer, and differences in their numerics make nominally on-policy RL off-policy, which truncated importance sampling corrects and batch-invariant kernels can remove. The lesson covers colocated versus separate rollout engines, asynchronous actors and learners with staleness bounds, and Kimi K2's colocated design with fast weight updates. It pairs with the reported Anthropic GRPO screen and the Meta asynchronous RL design question.
   - Sources: https://huggingface.co/docs/trl/main/en/grpo_trainer ; https://neurips.cc/virtual/2025/124259 ; https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/ ; https://arxiv.org/html/2507.20534 ; https://prachub.com/interview-questions/architect-an-asynchronous-rl-post-training-system

**Problems** (7; debug 2, design 2, concept 2, critique 1; hard 6, medium 1)

- `trn-051` (debug, hard, senior, new, Core 100) Engine and trainer log-probabilities disagree in an "on-policy" GRPO run: diagnose the mismatch and apply truncated importance sampling. Source: https://neurips.cc/virtual/2025/124259
- `trn-052` (design, hard, staff, new) An asynchronous RL post-training loop for a chat model already serving traffic: actors, reward inference, learners, replay, off-policy corrections, KL control and rollback. Source: https://prachub.com/interview-questions/architect-an-asynchronous-rl-post-training-system. Reported: Meta (candidate report via PracHub)
- `trn-053` (concept, hard, staff, new) How pipeline stages and micro-batches interact with GRPO rollouts: relative advantages, policy versions, throughput and staleness. Source: https://prachub.com/interview-questions/explain-pipeline-parallelism-in-grpo-training. Reported: Google (candidate report via PracHub)
- `trn-054` (concept, medium, senior, new) A group where every sample is correct: what does it contribute to GRPO, and what does DAPO do about it? Source: https://arxiv.org/html/2503.14476
- `trn-055` (debug, hard, senior, new) A GRPO run's response length explodes over a few hundred steps. Source: https://arxiv.org/abs/2503.20783
- `trn-056` (critique, hard, staff, new) Critique a plan to penalise "bad thoughts" in the chain of thought to stop reward hacking. Source: https://arxiv.org/abs/2503.11926
- `trn-057` (design, hard, staff, new) Distributed PPO across thousands of GPUs: placement of policy, value, reward and reference models, and the bottleneck you expect. Source: https://www.techinterview.org/post/3233475333/rlhf-post-training-interview-topics-2026/?format=md

### training/distill-merge: Distillation, merging and synthetic data

Three kinds of distillation, merging weights from a shared initialisation, and synthetic data with a filter that decides quality.

**Lessons**

1. **Distillation: soft targets, SFT on samples and on-policy** (`distillation`, lesson, senior). Distillation means Hinton's soft targets, SFT on teacher samples (R1 distilled on about 800K samples), or on-policy distillation where the student samples and the teacher scores per token. Thinking Machines reproduced the Qwen3 result that on-policy distillation reached 74.4 on AIME'24 at 1,800 GPU hours against 67.6 at 17,920 for RL. Yue et al. found distillation can add reasoning patterns that RLVR does not, which changes which one to use.
   - Sources: https://arxiv.org/abs/1503.02531 ; https://thinkingmachines.ai/blog/on-policy-distillation/ ; https://arxiv.org/html/2505.09388 ; https://arxiv.org/abs/2504.13837 ; https://arxiv.org/html/2501.12948
2. **Model merging** (`merging`, lesson, senior). Model soups average fine-tuned weights from a shared initialisation at no inference cost, TIES trims small changes, elects a sign per parameter and merges agreeing values, and Llama 3 and OLMo 2 averaged checkpoints across anneals and stages. Merging is not ensembling: one model runs, so it needs compatible weights. The reader decides when merging beats training another round.
   - Sources: https://arxiv.org/abs/2203.05482 ; https://arxiv.org/abs/2306.01708 ; https://arxiv.org/html/2407.21783 ; https://arxiv.org/html/2501.00656
3. **Synthetic data with a filter that decides quality** (`synthetic-filters`, lesson, senior). Synthetic data is cheap to generate and only as good as its filter, whether a reward model (Nemotron-4), a verifier, or rejection sampling against tests. Kimi K2's rephrasing in pretraining is the other use, and contamination is the risk both share. The reader designs the filter and the contamination check together.
   - Sources: https://arxiv.org/abs/2406.11704 ; https://arxiv.org/html/2507.20534 ; https://arxiv.org/html/2412.19437v2

**Problems** (6; design 1, estimate 1, concept 2, code 1, critique 1; hard 4, medium 2)

- `trn-058` (design, hard, staff, new) Design knowledge distillation of models and an LLM post-training pipeline, with evals and gates per stage. Source: https://www.aced.io/experiences/cohere-staff-machine-learning-engineer-interview-b49af6. Reported: Cohere (candidate report via aced.io, staff level)
- `trn-059` (estimate, medium, senior, new) On-policy distillation versus RL GPU hours for the Qwen3-8B result, and what would change the comparison for your task. Source: https://thinkingmachines.ai/blog/on-policy-distillation/
- `trn-060` (concept, medium, senior, new) Merging versus ensembling: what model soups require, and when merging fails. Source: https://arxiv.org/abs/2203.05482
- `trn-061` (concept, hard, staff, new) Does RL teach new reasoning or sharpen what the base model already samples? Use Yue et al. with its limits. Source: https://arxiv.org/abs/2504.13837
- `trn-062` (code, hard, senior, new) TIES merging on toy parameter vectors: trim, elect sign, merge; tests check sign conflicts. Source: https://arxiv.org/abs/2306.01708
- `trn-063` (critique, hard, senior, new) Critique a synthetic-data plan that generates a million examples with no filter and no contamination check. Source: https://arxiv.org/abs/2406.11704

### training/adapting: Adapting models: LoRA, QLoRA and continued pretraining

LoRA settings that work, QLoRA's mechanics and limits, and continued pretraining without forgetting.

**Lessons**

1. **LoRA in practice** (`lora-practice`, lesson, senior). LoRA Without Regret recommends applying adapters to all layers including MLP and MoE, a learning rate around ten times full fine-tuning, care with large batches, and notes rank 1 matches full fine-tuning for policy-gradient RL. PEFT's defaults (r 8, alpha 8) are library defaults, not recommendations, and alpha over r scaling makes the best learning rate roughly rank-independent. The reader sets up a LoRA run and defends each setting.
   - Sources: https://thinkingmachines.ai/blog/lora/ ; https://huggingface.co/docs/peft/main/en/package_reference/lora ; https://arxiv.org/abs/2106.09685
2. **QLoRA mechanics** (`qlora-mechanics`, lesson, senior). QLoRA freezes an NF4-quantised base with double quantisation, trains adapters in higher precision and pages optimizer state, which let a 65B model fine-tune on one 48 GB GPU. The memory saving stops at activations, which grow with sequence length and batch. The reader estimates QLoRA memory and knows where it breaks.
   - Sources: https://arxiv.org/abs/2305.14314
3. **Continued pretraining without forgetting** (`continued-pretraining`, lesson, staff). Re-warming and re-decaying the learning rate with a replay share of original data matched full retraining at a fraction of the compute at 405M and 10B parameters in Ibrahim et al. LoRA forgets less but learns less in continued pretraining on code and maths. The reader designs a domain continued-pretraining run with forgetting checks.
   - Sources: https://arxiv.org/abs/2403.08763 ; https://arxiv.org/abs/2405.09673

**Problems** (6; concept 1, estimate 1, design 1, debug 1, code 1, mcq 1; hard 3, medium 3)

- `trn-064` (concept, hard, senior, new) LoRA learning rate, targets and rank: why library defaults are not recommendations, with the evidence. Source: https://thinkingmachines.ai/blog/lora/
- `trn-065` (estimate, hard, senior, new) QLoRA memory for a 65B model at a stated sequence length and batch, and where the saving stops. Source: https://arxiv.org/abs/2305.14314
- `trn-066` (design, hard, staff, new) Continued pretraining on a domain corpus: re-warm, re-decay, replay ratio, forgetting checks and the stop rule. Source: https://arxiv.org/abs/2403.08763
- `trn-067` (debug, medium, senior, new) A LoRA run matches full fine-tuning on instruction data but falls short on a maths dataset. Source: https://arxiv.org/abs/2405.09673
- `trn-068` (code, medium, senior, new) A LoRA layer forward pass with alpha over r scaling and zero-initialised B; tests check equivalence to the base at initialisation. Source: https://arxiv.org/abs/2106.09685
- `trn-069` (mcq, medium, senior, new) In QLoRA, which part is stored in NF4 and which part trains in higher precision? Source: https://arxiv.org/abs/2305.14314

## 13. Long context, architectures, multimodal and voice (`multimodal`)

The areas the first build had no content for: RoPE scaling (PI, YaRN, LongRoPE) and attention sinks, testing long context honestly when needle scores mislead, MLA, state space models and hybrids, diffusion language models, how vision-language models see and what images, pages, video and audio cost per provider, speech models and a voice turn measured stage by stage, and image and video generation for engineers who design and serve them. Three review rules apply across the track: a needle-test score is never evidence of usable long context, every image-token figure names its model family, and 800 ms voice-to-voice is one vendor's target, not a standard.

### multimodal/long-context: Stretching and testing long context

How RoPE works and how a window is stretched, attention sinks, and long-context evaluation that predicts real tasks.

**Lessons**

1. **RoPE from the inside, and how a context window is stretched** (`rope-scaling`, lesson, staff). RoPE rotates query and key pairs by a position-dependent angle so their dot product depends on relative distance, and stretching a window changes those frequencies. Position Interpolation squeezes positions into the trained range with short fine-tuning, YaRN rescales frequencies unevenly, Llama 3.1 ships a rope_type llama3 block with factor 8 from 8,192 original positions, and LongRoPE searches per-dimension factors. These are configuration changes with a quality cost, and Qwen's model card warns that static YaRN can hurt short inputs.
   - Sources: https://arxiv.org/abs/2104.09864 ; https://arxiv.org/abs/2306.15595 ; https://arxiv.org/abs/2309.00071 ; https://arxiv.org/abs/2402.13753 ; https://huggingface.co/unsloth/Meta-Llama-3.1-8B-Instruct/blob/main/config.json ; https://huggingface.co/Qwen/Qwen3-8B ; https://ai.meta.com/blog/llama-4-multimodal-intelligence/
   - Widget or lab: new:RopeRotation
   - Existing: `src/content/lessons/foundations/model-landscape/overview.mdx` (split, receives-content). The "advertised versus effective context" section moves to long-context-evals.
2. **YaRN, walked through** (`yarn`, paper, staff). Position Interpolation left high-frequency dimensions with too little local resolution, and YaRN answers with a per-frequency ramp and an attention temperature term. gpt-oss extends dense layers to 131,072 tokens with YaRN and Qwen3 documents a factor-4 YaRN block. The walkthrough ends with the answer to "why not just raise the base".
   - Sources: https://arxiv.org/abs/2309.00071 ; https://arxiv.org/html/2508.10925 ; https://huggingface.co/Qwen/Qwen3-8B
3. **Attention sinks and streaming** (`attention-sinks`, paper, senior). StreamingLLM showed window attention collapses once the first tokens are evicted because heads park attention on them even when they are not semantically important, and keeping those few KV entries restores quality over very long streams. gpt-oss builds the idea into the model with a learned per-head bias in the softmax denominator. The engineering consequence is that any KV eviction policy must pin the sink tokens.
   - Sources: https://arxiv.org/abs/2309.17453 ; https://arxiv.org/html/2508.10925
4. **Testing long context honestly** (`long-context-evals`, lesson, senior). The needle test plants a fact in filler text and sweeps length and depth, and RULER, NoLiMa and HELMET all found models scoring near perfectly on needles while realistic or no-overlap tasks degraded; HELMET states needle results do not reliably predict downstream performance. The lesson builds a probe suite of single needle, multi-needle, no-overlap needle, multi-hop chain and aggregation tasks against a scripted mock model. The reader reports score by length for their own task and never cites a needle score as proof.
   - Sources: https://github.com/gkamradt/LLMTest_NeedleInAHaystack ; https://arxiv.org/abs/2404.06654 ; https://arxiv.org/abs/2502.05167 ; https://arxiv.org/abs/2410.02694 ; https://arxiv.org/abs/2307.03172
   - Widget or lab: lab:long-context-probes

**Problems** (6; debug 1, code 1, concept 2, workflow 1, critique 1; hard 5, medium 1)

- `mml-001` (debug, hard, staff, new, Core 100) After adding a static YaRN block to reach 128K, short prompts got worse; decide whether to keep it and how to serve both. Source: https://huggingface.co/Qwen/Qwen3-8B
- `mml-002` (code, hard, senior, new) Implement RoPE on toy vectors and verify that the attention score depends only on relative position; hidden tests probe the offset bug. Source: https://arxiv.org/abs/2104.09864
- `mml-003` (concept, hard, staff, new) Take a 32K model to 128K: PI, YaRN, LongRoPE or continued training, with the cost and the quality test for each. Source: https://arxiv.org/abs/2309.00071
- `mml-004` (workflow, hard, senior, new) Build a long-context eval for your product: task types, lengths, scoring and the report that replaces a needle score. Source: https://arxiv.org/abs/2404.06654
- `mml-005` (concept, medium, senior, new) Why not just raise the RoPE base frequency to extend context? Source: https://arxiv.org/abs/2309.00071
- `mml-006` (critique, hard, senior, new) Critique a vendor claim of "perfect recall at 1M tokens" supported only by a needle-in-a-haystack heatmap. Source: https://arxiv.org/abs/2410.02694

### multimodal/architectures: Architectures beyond the dense transformer

Latent attention, state space models and why production keeps hybrids, and diffusion language models.

**Lessons**

1. **Multi-head latent attention and the KV bytes table** (`mla`, paper, staff). DeepSeek-V2 compresses keys and values into a shared latent, caches the latent and keeps a small decoupled RoPE key because rotation does not commute with the absorbed projection. It reports a 93.3% smaller KV cache against DeepSeek 67B, a dense multi-head model, which is why the baseline must be stated whenever the figure is used. The walkthrough computes bytes per token for MHA, GQA-8 and MLA from published configs.
   - Sources: https://arxiv.org/abs/2405.04434 ; https://huggingface.co/deepseek-ai/DeepSeek-V3/blob/main/config.json
2. **State space models and why production uses hybrids** (`ssm-hybrids`, lesson, staff). Mamba makes state-space parameters input-dependent so a fixed-size state can choose what to keep, and Mamba-2 relates SSMs to attention as structured matrices. "Repeat After Me" proves a fixed state cannot copy long strings that a two-layer transformer can, and finds pretrained transformers far better at copying and retrieval from context. Shipped models therefore keep some attention: Jamba uses one attention layer per seven Mamba layers, Kimi Linear three linear layers per MLA layer, and Qwen3.8-27B three Gated DeltaNet layers per full-attention layer.
   - Sources: https://arxiv.org/abs/2312.00752 ; https://arxiv.org/abs/2405.21060 ; https://arxiv.org/abs/2402.01032 ; https://arxiv.org/html/2403.19887 ; https://arxiv.org/html/2510.26692 ; https://huggingface.co/Qwen/Qwen3.8-27B ; https://arxiv.org/abs/2412.06464
3. **Diffusion language models** (`diffusion-lms`, lesson, senior). Diffusion language models generate by iteratively unmasking many positions in parallel instead of one token at a time. LLaDA 8B is reported competitive with LLaMA3 8B on in-context learning, and Mercury Coder reports up to 10 times the speed of speed-optimised models on average, measured by a third party. The engineering questions are what parallel decoding does to streaming UX, KV caching and structured output.
   - Sources: https://arxiv.org/abs/2502.09992 ; https://arxiv.org/abs/2506.17298

**Problems** (6; concept 2, estimate 1, design 1, mcq 1, critique 1; hard 3, medium 3)

- `mml-007` (concept, hard, staff, new) Why do production long-context models keep some full attention? Use the copying result and a shipped hybrid ratio. Source: https://arxiv.org/abs/2402.01032
- `mml-008` (estimate, hard, senior, new, Core 100) KV cache at 256K for a 1:7 attention-to-Mamba hybrid versus a dense MoE of similar size, from the published configurations. Source: https://arxiv.org/html/2403.19887
- `mml-009` (concept, medium, senior, new) How do diffusion language models generate, and what changes for streaming, KV caching and constrained output? Source: https://arxiv.org/abs/2502.09992
- `mml-010` (design, hard, staff, new) Given an open model's config with banded windows and sinks, compute KV per token at 128K and decide whether to serve it for a long-document product. Source: https://arxiv.org/html/2508.10925
- `mml-011` (mcq, medium, senior, new) MLA's 93.3% KV reduction is measured against which baseline? Source: https://arxiv.org/abs/2405.04434
- `mml-012` (critique, medium, senior, new) Critique a proposal to switch to a diffusion LM because it is "10x faster", for a streaming chat product. Source: https://arxiv.org/abs/2506.17298

### multimodal/vision-language: Vision-language models and their costs

How a VLM sees, what an image, a page, a second of video and a second of audio cost per provider, and the failure modes of VLMs.

**Lessons**

1. **How a vision-language model sees** (`how-vlms-see`, lesson, senior). ViT turns an image into patch tokens, CLIP trains image and text towers on 400 million pairs with a contrastive loss, LLaVA connects a vision encoder to an LLM through a projector, Qwen2.5-VL trains a native dynamic-resolution encoder with time encoding for long video, and Llama 4 uses early fusion. The encoder is a lexer for pixels and the projector is the ABI between two models, and which parts are frozen during training is the question interviewers probe. The reader can draw a VLM and say what each part costs at inference.
   - Sources: https://arxiv.org/abs/2010.11929 ; https://arxiv.org/abs/2103.00020 ; https://arxiv.org/abs/2304.08485 ; https://arxiv.org/abs/2502.13923 ; https://ai.meta.com/blog/llama-4-multimodal-intelligence/
2. **Playbook: what an image, a page, a second of video and of audio cost** (`media-token-costs`, playbook, senior). Claude counts one visual token per 28-pixel patch with caps by tier, OpenAI's patch models count 32-pixel patches with a multiplier and its tile models charge a base plus a cost per 512-pixel tile, and Gemini charges 258 tokens per small image or per 768-pixel tile, 32 tokens per second of audio and documents video at more than one rate. Every figure must name its model family. The playbook decides between downsampling, cropping and switching tier for a stated workload.
   - Sources: https://platform.claude.com/docs/en/build-with-claude/vision ; https://developers.openai.com/api/docs/guides/images-vision ; https://ai.google.dev/gemini-api/docs/tokens
   - Widget or lab: new:MediaTokenCalc
3. **VLM failure modes: counting, OCR errors and ignoring the image** (`vlm-failures`, lesson, senior). VLMs fail by describing from the text prompt alone, miscounting, misreading small text, and losing track across many pages, and each failure has a different fix (resolution, cropping, prompting order, retrieval over page images). The lesson pairs each failure with the test that detects it and the change that addresses it. The reader can debug a VLM product from a sample of failures.
   - Sources: https://arxiv.org/abs/2502.13923 ; https://arxiv.org/abs/2304.08485 ; https://arxiv.org/abs/2407.01449

**Problems** (6; design 1, estimate 1, concept 1, debug 2, behavioural 1; hard 4, medium 2)

- `mml-013` (design, hard, staff, new, Core 100) Design a video vision-language model end to end: data, architecture, objectives, evaluation and serving. Source: https://prachub.com/interview-questions/design-a-video-vlm-end-to-end. Reported: Microsoft (candidate report via PracHub)
- `mml-014` (estimate, medium, senior, new) Image tokens and cost for a 1920 by 1080 screenshot on three providers, naming the model family for each figure. Source: https://platform.claude.com/docs/en/build-with-claude/vision
- `mml-015` (concept, medium, senior, new) What is a vision encoder, how is it trained, what bottlenecks VLM inference, and how would you cut memory and latency? Source: https://prachub.com/interview-questions/explain-vision-encoders-and-llm-bottlenecks. Reported: Apple (candidate report via PracHub)
- `mml-016` (debug, hard, senior, new) The multimodal model ignores the image and answers from the text: rank causes and fixes. Source: https://github.com/amitshekhariitbhu/ai-engineering-interview-questions
- `mml-017` (debug, hard, senior, new) The VLM answers single-image questions well and fails on multi-page documents. Source: https://github.com/amitshekhariitbhu/ai-engineering-interview-questions
- `mml-018` (behavioural, hard, senior, new) Walk through your VLM project: encoder, LLM, where fusion happens, what was frozen, leakage, latency and failure modes. Source: https://prachub.com/interview-questions/explain-your-vlm-project-end-to-end. Reported: TikTok (candidate report via PracHub)

### multimodal/speech-voice: Speech models and voice agents

ASR, TTS, turn detection and full-duplex models, a voice turn measured millisecond by millisecond, and pipeline versus speech-to-speech.

**Lessons**

1. **Speech models for engineers** (`speech-models`, lesson, senior). Whisper was trained on 680,000 hours of multilingual, multitask audio, TTS is judged by time to first byte, and Moshi models user and agent audio as parallel streams with 160 ms theoretical and 200 ms practical latency. Turn detection is its own model: plain VAD, OpenAI's semantic VAD with an eagerness setting, or Pipecat's Smart Turn. The reader picks components for a voice agent and knows which one sets the latency floor.
   - Sources: https://arxiv.org/abs/2212.04356 ; https://arxiv.org/abs/2410.00037 ; https://developers.openai.com/api/docs/guides/realtime-vad ; https://www.voiceaiandvoiceagents.com
   - Existing: `src/content/lessons/system-design/case-realtime/overview.mdx` (split, receives-content). The voice section of the real-time case lesson moves to this module; the 800 ms widget default is relabelled as one vendor's target.
2. **A voice turn, millisecond by millisecond** (`voice-turn`, lesson, staff). The Pipecat maintainers publish a round-trip table from microphone through encoding, network, jitter buffer, transcription and endpointing, LLM time to first byte, sentence aggregation and TTS to playback that sums to about 1.3 seconds, and their June 2026 update sets 1,500 ms as the target and says to avoid spikes. ElevenLabs' 800 ms figure is one vendor's target and must be labelled that way. The lab is a discrete-event simulator where the reader adds streaming TTS, speculative LLM start on interim transcripts, filler phrases for slow tools and barge-in, with tests on p50 and p95.
   - Sources: https://www.voiceaiandvoiceagents.com ; https://elevenlabs.io/blog/voice-agent-latency-optimization ; https://arxiv.org/abs/2410.00037
   - Widget or lab: lab:voice-turn
3. **Playbook: cascaded pipeline or speech-to-speech** (`pipeline-vs-s2s`, playbook, senior). A cascaded ASR, LLM and TTS pipeline gives control, tool use and logging per stage, while speech-to-speech models give lower latency and prosody at the cost of observability and per-minute pricing. The inputs are latency target, tool calls per turn, compliance logging and cost per minute from the provider's published realtime costs. The playbook ends with what to measure in the first week of a pilot.
   - Sources: https://developers.openai.com/api/docs/guides/voice-agents ; https://developers.openai.com/api/docs/guides/realtime-costs ; https://arxiv.org/abs/2410.00037
   - Widget or lab: SystemDesignVoiceBudget

**Problems** (6; design 1, estimate 1, critique 1, concept 2, debug 1; hard 4, medium 2)

- `mml-019` (design, hard, staff, new, Core 100) Design a real-time AI voice system: ingestion, ASR, orchestration, TTS, session state, interruptions, safety, latency and cost. Source: https://prachub.com/interview-questions/design-a-real-time-ai-voice-system. Reported: Decagon (candidate report via PracHub)
- `mml-020` (estimate, hard, senior, new) Budget voice-to-voice latency by stage and find where the time goes, using a published stage table and your own assumptions. Source: https://www.voiceaiandvoiceagents.com
- `mml-021` (critique, hard, senior, new) Critique a voice-agent design that waits for the full LLM reply before starting TTS. Source: https://www.voiceaiandvoiceagents.com
- `mml-022` (concept, medium, senior, new) Speculative LLM start on interim transcripts: how it cuts latency, what it costs, and when it is wrong. Source: https://www.voiceaiandvoiceagents.com
- `mml-023` (concept, medium, senior, new) Cascaded ASR, LLM and TTS versus native speech-to-speech: the trade-offs for a support line with tool calls. Source: https://arxiv.org/abs/2410.00037
- `mml-024` (debug, hard, senior, new) Users get cut off mid-sentence after a VAD change: plain VAD threshold or semantic VAD eagerness? Source: https://developers.openai.com/api/docs/guides/realtime-vad

### multimodal/generation: Image and video generation for engineers

Enough of diffusion, latent diffusion, guidance, DiT and flow matching to design and serve generation systems.

**Lessons**

1. **Image and video generation for the AI engineer** (`generation-models`, lesson, senior). Latent diffusion moves denoising into an autoencoder's latent space, classifier-free guidance trades diversity for quality with one model trained conditional and unconditional, DiT replaces the U-Net with a transformer, and flow matching and rectified flow (Stable Diffusion 3) straighten the sampling path and cut steps. Movie Gen is a 30B transformer generating 16-second 1080p video from up to 73K video tokens. The reader can explain each component's effect on quality and serving cost.
   - Sources: https://arxiv.org/abs/2112.10752 ; https://arxiv.org/abs/2207.12598 ; https://arxiv.org/abs/2212.09748 ; https://arxiv.org/abs/2210.02747 ; https://arxiv.org/abs/2403.03206 ; https://arxiv.org/abs/2410.13720
2. **Serving generation models: steps, distillation and batching by resolution** (`serving-generation`, lesson, senior). Generation cost scales with sampling steps, resolution and frames, so the serving levers are fewer steps (flow matching, distillation), caching the text encoder output, and batching requests by resolution. The lesson costs a generation request and shows which lever moves latency most. The reader designs the serving path for an image product with a latency target.
   - Sources: https://arxiv.org/abs/2210.02747 ; https://arxiv.org/abs/2403.03206 ; https://arxiv.org/abs/2112.10752
3. **Diffusion transformers, walked through** (`dit`, paper, senior). DiT replaces the U-Net in latent diffusion with a transformer over latent patches and reports FID 2.27 on ImageNet 256, with quality improving as compute per image grows. Stable Diffusion 3 extends the idea with separate weights per modality and rectified flow. The walkthrough ends with what the move to transformers changed for serving (batching, parallelism, the same kernels as language models) and what to say when asked to explain a recent generation paper.
   - Sources: https://arxiv.org/abs/2212.09748 ; https://arxiv.org/abs/2403.03206

**Problems** (6; design 2, debug 1, concept 2, estimate 1; hard 4, medium 2)

- `mml-025` (design, hard, staff, new, Core 100) Design an image generation system (data, diffusion or autoregressive, conditioning, safety, evaluation, inference), extend it to text and image in and out, then explain a recent paper. Source: https://prachub.com/interview-questions/design-image-and-multimodal-generation-systems. Reported: Meta (candidate report via PracHub)
- `mml-026` (debug, hard, senior, new) The diffusion model takes too long per image: speed up sampling without a visible quality drop, and prove it. Source: https://github.com/amitshekhariitbhu/ai-engineering-interview-questions
- `mml-027` (design, hard, staff, new) Design a text-to-video generation service: queueing, GPU allocation, safety filtering and cost per second of video. Source: https://github.com/amitshekhariitbhu/ai-engineering-interview-questions
- `mml-028` (concept, medium, senior, new) What does the classifier-free guidance scale trade, and how would you choose it for a product? Source: https://arxiv.org/abs/2207.12598
- `mml-029` (estimate, medium, senior, new) Video tokens and compute scale for a 16-second clip at the published Movie Gen settings, and why latent compression decides feasibility. Source: https://arxiv.org/abs/2410.13720
- `mml-030` (concept, hard, senior, new) Flow matching versus DDPM-style sampling: why the step count drops and what that does to serving. Source: https://arxiv.org/abs/2210.02747

## 14. AI system design (`system-design`)

The design round taught as decisions under conflicting constraints: the delivery framework as a reference, capacity and cost with every assumption labelled, retrieval-centric, agentic and real-time cases, and platform cases (coding-agent platforms, agent platforms, shared eval platforms) that staff loops ask for. Each case ends with what the design gives up and a written artefact (a rollout plan, a risk note), and rubrics are checklists the reader ticks rather than paragraphs to read.

### system-design/framework: Design answers as decisions

Decisions under conflicting constraints, the scoping reference, and the eval and fallback plan every design needs.

**Lessons**

1. **Design answers as decisions under conflicting constraints** (`decisions-under-conflict`, lesson, staff). Staff-level design rounds reward a decision under conflicting constraints with its cost stated, not a complete diagram. The lesson works a support assistant whose resolution rate rose while re-contacts also rose, and shows how the answer changes with a regulator, a deadline and a system that cannot be rewritten. Hello Interview's level rubric (senior goes deep in about two places, staff leads almost the entire interview) frames what changes between levels.
   - Sources: https://www.hellointerview.com/learn/system-design/in-a-hurry/delivery ; https://www.techinterview.org/post/3233476824/ai-engineer-interview-rag-agents-evals/ ; https://www.hellointerview.com/blog/the-system-design-interview-what-is-expected-at-each-level
   - Existing: `src/content/lessons/system-design/framework/overview.mdx` (rewrite, primary). The rubric and five scoping questions survive as a one-page reference (scoping-reference); the lesson becomes a decision-under-conflict lesson (level audit 5.1).
2. **Scoping reference: the questions that change the design** (`scoping-reference`, lesson, senior). A short list of scoping questions changes an AI design more than any component choice: who the user is, what a wrong answer costs, latency and cost targets, data access and residency, and how success is measured. The lesson is a reference page with each question and the design branch it opens. It replaces the old framework lesson's body.
   - Sources: https://www.hellointerview.com/learn/system-design/in-a-hurry/delivery ; https://raw.githubusercontent.com/ombharatiya/ai-system-design-guide/main/00-interview-prep/02-answer-frameworks.md ; https://www.hellointerview.com/blog/the-system-design-interview-what-is-expected-at-each-level
3. **The eval plan and the human fallback inside a design** (`eval-and-fallback`, lesson, senior). Every AI design needs an eval plan before launch, an online measurement after, and a fallback when the model is wrong, and interviewers ask for all three. The lesson covers outcome metrics with guardrails, pass^k for agents, escalation paths and how the fallback is staffed. The reader adds these to any design in five minutes.
   - Sources: https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents ; https://arxiv.org/abs/2406.12045 ; https://arxiv.org/abs/2506.07982

**Problems** (6; workflow 1, design 3, critique 1, presentation 1; hard 5, medium 1)

- `sys-018` (workflow, hard, staff, new, Core 100, Crunch 23) Resolution rate is up and re-contacts are up after a launch: decide whether to roll back, with the analysis and the owner. Source: https://www.techinterview.org/post/3233476824/ai-engineer-interview-rag-agents-evals/
- `sys-001` (design, medium, senior, existing) Design a support assistant with one operating constraint (an incumbent ticketing system that cannot change) and a stated "what you give up". Source: https://www.techinterview.org/post/3233476824/ai-engineer-interview-rag-agents-evals/
- `sys-019` (design, hard, staff, new) Design ChatGPT: the parts that matter for an interview and the decisions a staff candidate drives. Source: https://www.hellointerview.com/guides/openai/l5. Reported: OpenAI (aggregated candidate reports via Hello Interview)
- `sys-020` (critique, hard, senior, new, Core 100) Critique this design document for a multi-tenant chat backend with billing and moderation. Source: https://www.techinterview.org/post/3233474915/openai-interview-process-2026-team-by-team/
- `sys-021` (presentation, hard, staff, new) Drive a full AI design round while the interviewer adds a new constraint at intervals; self-rate against the probe list. Source: https://www.hellointerview.com/blog/the-system-design-interview-what-is-expected-at-each-level
- `sys-022` (design, hard, staff, new) A support assistant for a bank under a regulator, with a fixed launch date and a system that cannot be rewritten: the design and the risk note. Source: https://www.hellointerview.com/learn/system-design/in-a-hurry/delivery

### system-design/capacity: Capacity and cost

The request bill of materials and break-evens, latency budgets across hops, and traffic to GPU fleet.

**Lessons**

1. **The request bill of materials and cache break-even** (`cost-model`, lesson, senior). A design's cost is a bill of materials per request (tokens in and out, cache reads and writes, retrieval, tools, retries) times traffic, and the prompt-cache break-even decides whether caching pays. The lesson derives the break-even from current price tables and shows which term dominates for three workloads. The reader can produce a cost line in a design round in two minutes.
   - Sources: https://platform.claude.com/docs/en/about-claude/pricing ; https://developers.openai.com/api/docs/pricing ; https://platform.claude.com/docs/en/build-with-claude/prompt-caching
   - Widget or lab: SystemDesignCostCalc
   - Existing: `src/content/lessons/system-design/capacity/overview.mdx` (rewrite, primary). Cut the bill-of-materials opener and "history is re-sent"; keep the break-even derivation, Little's law sizing and rate limits as capacity.
2. **Latency budgets across hops** (`latency-budgets`, lesson, senior). A latency budget is split across hops (network, retrieval, rerank, model time to first token, generation, post-processing), and percentiles do not add, so the budget is checked by simulation. The lesson uses Little's law for concurrency and labels published voice targets as vendor targets. The reader can cut a design that is three times over budget.
   - Sources: https://docs.nvidia.com/nim/benchmarking/llm/latest/metrics.html ; https://www.voiceaiandvoiceagents.com ; https://elevenlabs.io/blog/voice-agent-latency-optimization
3. **Traffic to GPU fleet** (`traffic-to-fleet`, lesson, senior). Converting traffic into GPUs takes tokens per request, a throughput per GPU measured or estimated at the target latency, peak-to-average ratio and headroom for failures. The lesson works one case from a stated traffic model with a published model config and GPU specification. The reader states which assumption dominates the fleet size.
   - Sources: https://www.nvidia.com/en-us/data-center/h100/ ; https://huggingface.co/unsloth/Meta-Llama-3.1-70B-Instruct/blob/main/config.json ; https://docs.nvidia.com/nim/benchmarking/llm/latest/metrics.html

**Problems** (6; estimate 4, debug 1, design 1; hard 4, medium 2)

- `sys-023` (estimate, hard, senior, new, Core 100) What a 1M-token context promise costs per request and per day at stated traffic, from list prices and a published model config. Source: https://platform.claude.com/docs/en/about-claude/pricing
- `sys-004` (estimate, medium, senior, existing) From traffic to a GPU fleet for a stated model, latency target and peak ratio. Source: https://www.nvidia.com/en-us/data-center/h100/
- `sys-005` (debug, medium, senior, existing) Latency doubled after a deploy; the diff touched retrieval, prompt length and the model id. Source: https://docs.nvidia.com/nim/benchmarking/llm/latest/metrics.html
- `sys-003` (estimate, hard, senior, existing) Daily cost of a RAG assistant at a million queries a day with caching tiers, stating which assumption flips the answer. Source: https://platform.claude.com/docs/en/about-claude/pricing
- `sys-024` (design, hard, senior, new) Your design is three times over the latency budget: where do you cut, and what does each cut cost in quality? Source: https://docs.nvidia.com/nim/benchmarking/llm/latest/metrics.html
- `sys-025` (estimate, hard, staff, new) GPU compute cost for serving a chat product at a stated scale, including peak load and a failure-domain reserve. Source: https://www.nvidia.com/en-us/data-center/h100/

### system-design/case-retrieval: Retrieval-centric cases

Enterprise search with permissions, a support assistant with escalation, and document-heavy workflows.

**Lessons**

1. **Enterprise search with permissions** (`enterprise-search`, lesson, staff). Enterprise search fails on permissions, freshness and identifier-heavy queries before it fails on model quality. The lesson designs it end to end with permission-scoped retrieval as Microsoft 365 Copilot describes, per-tenant namespaces and their limits, contextual retrieval and an eval plan. It ends with the cost per query and what the design gives up.
   - Sources: https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-privacy ; https://docs.pinecone.io/guides/index-data/implement-multitenancy ; https://www.anthropic.com/news/contextual-retrieval
   - Existing: `src/content/lessons/system-design/case-retrieval/overview.mdx` (split, primary). Document-heavy workflows move to workflows/batch-pipelines; enterprise search and support stay.
2. **A support assistant with escalation** (`support-assistant`, lesson, senior). A support assistant is retrieval plus policy plus escalation, and its success metric must include re-contacts and escalations, not only resolution. The lesson covers policy grounding, escalation triggers, tau-bench-style evaluation and the human handoff. The reader can show how they would know it helps and not harms.
   - Sources: https://arxiv.org/abs/2406.12045 ; https://arxiv.org/abs/2506.07982 ; https://www.anthropic.com/news/contextual-retrieval
3. **Claims and compliance documents as a design case** (`claims-documents`, lesson, senior). Insurance claims and compliance review mix retrieval over heterogeneous documents with a workflow that writes decisions, so most of the right answer is a workflow with model steps. The lesson costs PDF pages as text plus images, adds review routing and an audit trail of document versions. The reader designs it with token cost control.
   - Sources: https://platform.claude.com/docs/en/build-with-claude/pdf-support ; https://www.uber.com/blog/advancing-invoice-document-processing-using-genai/ ; https://company.instacart.com/tech-innovation/scaling-catalog-attribute-extraction-with-multi-modal-llms

**Problems** (6; design 4, critique 1, estimate 1; hard 5, medium 1)

- `sys-006` (design, hard, staff, existing, Core 100) Enterprise RAG with per-user permissions; the rubric becomes a checklist and the answer includes what you give up. Source: https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-privacy
- `sys-007` (design, hard, staff, existing) An insurance-claims system with token cost control, designed as a workflow with model steps rather than an agent. Source: https://www.aced.io/blog/ai-engineer-interview-questions. Reported: Scale AI (candidate report via aced.io)
- `sys-026` (design, hard, staff, new) A support assistant with escalation, and how you prove it helps rather than shifting work to re-contacts. Source: https://www.techinterview.org/post/3233476824/ai-engineer-interview-rag-agents-evals/
- `sys-027` (design, hard, senior, new) Multilingual retrieval for a global support corpus: one index or several, and the eval per language. Source: https://developers.openai.com/api/docs/guides/embeddings
- `sys-028` (critique, hard, senior, new) Critique an enterprise-search design that caches answers across users to save cost. Source: https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-privacy
- `sys-029` (estimate, medium, senior, new) Embedding and storage cost for 100 million documents with permission metadata, and the re-index cost on a model change. Source: https://developers.openai.com/api/docs/guides/embeddings

### system-design/case-agents: Agentic cases

Customer-service agents with policy tools, coding-agent products, and computer-use automation.

**Lessons**

1. **A customer-service agent with policy tools** (`policy-agent`, lesson, senior). An agent that can refund money needs deterministic policy limits outside the model, tools that enforce them, and evaluation by end state over repeated trials. The lesson designs it with tau-bench's policy domains as the test, approvals for out-of-policy requests and a human handoff. It ends with what happens when a model upgrade changes the escalation rate.
   - Sources: https://arxiv.org/abs/2406.12045 ; https://arxiv.org/abs/2506.07982 ; https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf
   - Existing: `src/content/lessons/system-design/case-agents/overview.mdx` (split, primary). The coding-agent platform material moves to case-platforms; policy agents and computer-use automation stay.
2. **A coding agent product, end to end** (`coding-agent-product`, lesson, staff). A coding agent product is a job system with an untrusted planner: sessions, sandboxes, credentials, verification and a review path into the repository. The lesson draws on the Copilot cloud agent's published limits (one branch, a firewall that covers only its Bash tool, the requester cannot approve the PR) and Anthropic's containment incidents. The reader designs the product and its security review.
   - Sources: https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent ; https://docs.github.com/en/copilot/concepts/agents/coding-agent/risks-and-mitigations ; https://www.anthropic.com/engineering/how-we-contain-claude
3. **A computer-use automation product** (`computer-use-product`, lesson, senior). Computer-use automation is slow, flaky and exposed to injection from every page it reads, so the product design is about narrowing scope, confirming consequential actions and recovering from failure. The lesson uses ChatGPT agent's published controls and the residual injection rates vendors report. The reader decides which customer tasks it should and should not take.
   - Sources: https://openai.com/index/introducing-chatgpt-agent/ ; https://www.anthropic.com/research/prompt-injection-defenses ; https://arxiv.org/abs/2404.07972

**Problems** (6; design 6; hard 6)

- `sys-008` (design, hard, staff, existing) An agent for a streaming service's customer support, with refunds, policy limits and a model upgrade that doubles escalations. Source: https://arxiv.org/abs/2406.12045
- `sys-009` (design, hard, staff, existing) Multi-tenant model deployment with an eval harness; the rubric becomes a checklist. Source: https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents
- `sys-017` (design, hard, staff, existing) A code-review bot that runs headless in CI with budgets, a check and branch protection. Source: https://docs.github.com/en/copilot/concepts/agents/code-review
- `sys-030` (design, hard, staff, new) A customer-service agent that follows policy and can refund money, with the deterministic limits outside the model. Source: https://arxiv.org/abs/2506.07982
- `sys-031` (design, hard, staff, new) A multi-agent fintech chat backend with planning, retrieval, calculation, compliance and response agents, including failure handling. Source: https://prachub.com/interview-questions/design-a-multi-agent-chat-backend. Reported: Hebbia (candidate report via PracHub)
- `sys-032` (design, hard, staff, new) Chat over SEC filings with agent orchestration, streaming, cancellation and token-budget enforcement. Source: https://prachub.com/interview-questions/design-hebbia-chat-for-sec-filings. Reported: Hebbia (candidate report via PracHub)

### system-design/case-realtime: Real-time and specialised cases

Moderation pipelines, multi-tenant chat with metered billing, and multimodal intake.

**Lessons**

1. **A moderation pipeline with a model cascade** (`moderation-pipeline`, lesson, senior). Moderation is a cascade: cheap classifiers first, a model for the ambiguous middle, humans for appeals, each at an operating point chosen from the cost of errors. The lesson uses published moderation and guard models and constitutional classifiers as components. The reader sets the thresholds and the review capacity together.
   - Sources: https://developers.openai.com/api/docs/guides/moderation ; https://huggingface.co/meta-llama/Llama-Guard-4-12B ; https://www.anthropic.com/research/next-generation-constitutional-classifiers
   - Existing: `src/content/lessons/system-design/case-realtime/overview.mdx` (split, primary). Voice moves to multimodal/speech-voice; moderation, chat billing and multimodal intake stay.
2. **Multi-tenant chat with conversation state and metered billing** (`metered-chat`, lesson, staff). A multi-tenant chat backend needs conversation state, per-tenant limits and billing that counts cache reads, cache writes and uncached input correctly. The lesson covers usage fields, rate limits as capacity, and billing systems that accept corrections only within a window. The reader designs the metering path and its reconciliation.
   - Sources: https://platform.claude.com/docs/en/api/rate-limits ; https://docs.stripe.com/billing/subscriptions/usage-based/recording-usage ; https://developers.openai.com/api/docs/guides/conversation-state
3. **Multimodal intake: uploads, OCR and VLMs** (`multimodal-intake`, lesson, senior). A file uploader for a chat product must handle large files, choose text extraction or page images per file type, and feed the model within a context and cost budget. The lesson covers chunked uploads, parsing routes, page-image costs and background processing with progress. The reader designs it for a stated mix of documents and images.
   - Sources: https://platform.claude.com/docs/en/build-with-claude/pdf-support ; https://ai.google.dev/gemini-api/docs/tokens ; https://arxiv.org/abs/2407.01449

**Problems** (6; design 4, concept 1, debug 1; hard 3, medium 3)

- `sys-010` (design, hard, staff, existing) A real-time voice assistant with sub-second response as the product requirement, with the 800 ms figure labelled as a vendor target. Source: https://www.voiceaiandvoiceagents.com
- `sys-011` (design, medium, senior, existing) Content moderation with a model cascade and an appeals queue sized from the thresholds. Source: https://developers.openai.com/api/docs/guides/moderation
- `sys-012` (design, hard, staff, existing, Core 100) A multi-tenant chat backend with metered billing that counts cache reads and writes correctly. Source: https://docs.stripe.com/billing/subscriptions/usage-based/recording-usage
- `sys-013` (concept, medium, senior, existing) Rolling out a new model version: the mechanics, with a retirement deadline and regressions on two prompts. Source: https://platform.claude.com/docs/en/about-claude/model-deprecations
- `sys-015` (debug, medium, senior, existing) Rate limits at peak hour: separate a token-bucket limit from a concurrency limit in the evidence. Source: https://platform.claude.com/docs/en/api/rate-limits
- `sys-033` (design, hard, senior, new) A file uploader for an AI chat app that handles large multimodal uploads and feeds them into the model's context. Source: https://www.aced.io/blog/ai-engineer-interview-questions. Reported: xAI (candidate report via aced.io)

### system-design/case-platforms: Platform cases

Coding-agent platforms, multi-tenant agent platforms and shared eval platforms, as staff loops ask them.

**Lessons**

1. **A coding-agent platform: session log, sandboxes and credential paths** (`coding-agent-platform`, lesson, staff). Managed Agents keeps the session as an event log outside a stateless harness, provisions sandboxes only when a tool needs them, and keeps credentials out of reach of generated code with vaults and egress substitution. Anthropic's containment post adds what failed: project config that ran before trust, credentials read and posted, and an allowlisted domain used for upload. The reader designs a hosted coding-agent platform and its security review.
   - Sources: https://www.anthropic.com/engineering/managed-agents ; https://www.anthropic.com/engineering/how-we-contain-claude ; https://platform.claude.com/docs/en/managed-agents/vaults
2. **A multi-tenant agent platform with harness regression gates** (`agent-platform`, lesson, staff). Staff job descriptions define the work: Decagon's agent platform role names routing, execution logic, tool orchestration and control-plane systems, and Perplexity's agent-evals role names cost per successful task and regression gates for model, connector, tool, skill and harness changes. The lesson designs the platform against that specification. The reader can explain how a harness change is gated before it reaches customers.
   - Sources: https://jobs.ashbyhq.com/decagon/7df0a996-5a9f-496f-9f8b-c302983765b2 ; https://jobs.ashbyhq.com/perplexity/f3814af2-55a3-49a5-b0cb-67199a2a45fb ; https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents
3. **A shared eval platform** (`eval-platform`, lesson, staff). An eval platform runs many datasets asynchronously with code and model graders, versions everything and reports results teams trust. Duolingo runs its evals as Temporal workflows with deterministic graders first and a judge only where diffs are too brittle. The reader designs the platform and its own success metric.
   - Sources: https://blog.duolingo.com/production-ready-ai-agent-platform/ ; https://www.techinterview.org/companies/langchain/ ; https://hamel.dev/blog/posts/evals-faq/

**Problems** (6; design 4, workflow 1, critique 1; hard 6)

- `sys-034` (design, hard, staff, new, Core 100) A coding-agent platform: session log, lazily provisioned sandboxes, credential proxy, egress policy and cost per task. Source: https://www.anthropic.com/engineering/managed-agents
- `sys-035` (design, hard, staff, new) Prevent one product's misuse of a shared agent capability from degrading the platform for everyone. Source: https://www.learncursor.dev/learn/cursor-interview/software-engineer-agent-harness-interview-questions
- `sys-036` (design, hard, staff, new) A coding agent as a CI component for automated bug fixing. Source: https://github.com/ombharatiya/ai-system-design-guide/blob/main/00-interview-prep/01-question-bank.md
- `sys-037` (design, hard, staff, new) Telemetry for your own coding agent that can never upload repositories or secrets. Source: https://github.com/ombharatiya/ai-system-design-guide/blob/main/00-interview-prep/01-question-bank.md
- `sys-038` (workflow, hard, staff, new) The review and distribution pipeline for internal plugins that bundle skills and MCP servers. Source: https://github.com/ombharatiya/ai-system-design-guide/blob/main/00-interview-prep/01-question-bank.md
- `sys-039` (critique, hard, staff, new) Critique a hosted agent platform in which sandboxes hold customers' OAuth tokens as environment variables. Source: https://platform.claude.com/docs/en/managed-agents/vaults

## 15. Coding rounds, work samples, behavioural and customer craft (`rounds`)

The formats 2026 loops actually use: hand-written ML code with invariants, progressive multi-stage coding (in-memory database, KV store, file system, credit ledger) and integration exercises, take-homes and build-and-defend work samples (Sierra's Plan, Build and Review), repository bug squash and PR review, AI-assisted rounds scored on verification, customer discovery, product sense and FDE decomposition with regulated and government constraints, project deep dives and paper presentations, and staff behavioural stories with a dated loop atlas. Company attributions are labelled official, candidate report or vendor, with dates, and reported exercises are taught with original material.

### rounds/hand-write: Hand-written ML code

Invariants that hidden tests check, and backpropagation by hand as the reported rounds ask.

**Lessons**

1. **Hand-written ML code: the invariants hidden tests check** (`invariants`, lesson, senior). Attention, samplers, BPE and losses written by hand are graded by invariants (masking, normalisation, numerical stability, equivalence of a cached decode to a full recompute), not by matching a reference. The lesson lists the invariants per algorithm and the online softmax normaliser that keeps long rows stable. The reader writes tests before code for each one.
   - Sources: https://arxiv.org/abs/1805.02867 ; https://arxiv.org/abs/1706.03762 ; https://arxiv.org/abs/1904.09751 ; https://arxiv.org/abs/1508.07909
   - Existing: `src/content/lessons/rounds/hand-write/overview.mdx` (rewrite, primary). Cut the practical notes and the top-p predict; keep the invariants table without the junior rows and the online normaliser (level audit 5.1).
2. **Backpropagation by hand, as the rounds ask** (`backprop-by-hand`, lesson, senior). Reported OpenAI and Anthropic rounds ask for hand-derived backprop with a finite-difference check, a minimal reverse-mode autograd engine, and a linear-time prefix-product backward pass with zeros in the input. The lesson derives each with shapes and the check that proves it. The lab builds a scalar then matrix autograd engine in stdlib Python.
   - Sources: https://prachub.com/interview-questions/implement-and-derive-backprop-from-scratch ; https://prachub.com/interview-questions/hand-written-gradients-prefix-product-backward-pass-and-stable-cross-entropy ; https://prachub.com/interview-questions/implement-a-minimal-reverse-mode-autograd-engine-on-pytorch-tensors ; https://github.com/karpathy/micrograd
   - Widget or lab: lab:autograd
3. **A small decoder with bugs, then a KV cache** (`decoder-bugs`, lesson, senior). A reported OpenAI onsite hands over a small decoder-only transformer and its training step with four bugs, then asks for a KV cache whose logits match the full sequence. Defects worth testing for in code like this include mask direction, position offsets under caching, loss computed on padded positions and a shape that broadcasts silently. The lesson teaches the tests that find each one before reading the code, including KV cache size for a stated layer count, hidden size and context.
   - Sources: https://prachub.com/interview-questions/debug-a-small-pytorch-transformer-with-four-bugs-then-add-a-kv-cache ; https://arxiv.org/abs/1706.03762 ; https://arxiv.org/abs/2305.13245

**Problems** (7; code 6, estimate 1; hard 5, medium 2)

- `rnd-018` (code, hard, senior, new, Core 100, Crunch 15) A KV-cache decode step for a toy decoder whose output equals the full recompute, with grouped-query heads. Source: https://github.com/amitshekhariitbhu/ai-engineering-interview-questions
- `rnd-003` (code, medium, senior, existing) AUC without a library, with ties handled; hidden tests compare against a brute-force pair count. Source: https://github.com/amitshekhariitbhu/ai-engineering-interview-questions
- `rnd-004` (estimate, medium, senior, existing) How many long requests fit in the KV cache of one GPU for a stated model and context mix? Source: https://huggingface.co/unsloth/Meta-Llama-3.1-70B-Instruct/blob/main/config.json
- `rnd-019` (code, hard, senior, new) A minimal reverse-mode autograd engine (add, mul, matmul, ReLU, sum) with broadcasting in the backward pass. Source: https://prachub.com/interview-questions/implement-a-minimal-reverse-mode-autograd-engine-on-pytorch-tensors. Reported: OpenAI (candidate report via PracHub)
- `rnd-020` (code, hard, senior, new) Prefix-product backward pass in linear time without division, when inputs may contain zeros. Source: https://prachub.com/interview-questions/hand-written-gradients-prefix-product-backward-pass-and-stable-cross-entropy. Reported: OpenAI (candidate report via PracHub)
- `rnd-021` (code, hard, senior, new) A one-hidden-layer binary classifier with hand-derived backprop, stable cross-entropy and a finite-difference check. Source: https://prachub.com/interview-questions/implement-and-derive-backprop-from-scratch. Reported: Anthropic (candidate report via PracHub)
- `rnd-022` (code, hard, staff, new) Top-k decoding without a tensor library, then batched with a different k per row and a temperature per row. Source: https://www.aced.io/experiences/cohere-staff-machine-learning-engineer-interview-b49af6. Reported: Cohere (candidate report via aced.io, staff level)

### rounds/llm-app-coding: Progressive-spec and integration coding

Multi-stage coding where requirements arrive per stage, integration exercises against a mock service, and model-client patterns.

**Lessons**

1. **Progressive-spec coding: state that survives stage three** (`progressive-spec`, lesson, senior). Progressive rounds (an in-memory database, a KV store with transactions, a file system, a credit ledger) add a requirement per stage, and the candidate who designed state for stage one rewrites everything at stage three. The lesson covers choosing data structures that admit filtered scans, TTL with an injected clock, snapshots and restore, and the habit of writing the next stage's test first. Candidates report this format at Anthropic, OpenAI, Ramp and Perplexity; the lesson teaches the skill with original specifications.
   - Sources: https://www.aced.io/experiences/ramp-ai-engineer-interview-13abb1 ; https://prachub.com/companies/perplexity-ai ; https://www.hellointerview.com/guides/openai/l5 ; https://www.hellointerview.com/community/questions/memory-database-sql/cmbsl00wk004v07adwuorveqo
   - Widget or lab: lab:progressive-db
   - Existing: `src/content/lessons/rounds/llm-app-coding/overview.mdx` (rewrite, primary). The lesson named the in-memory database and KV store rounds without drilling them; it now teaches the progressive format; the duplicated rate limiter moves to ai-collab-coding.
2. **Integration rounds: multi-part API exercises** (`integration-rounds`, lesson, senior). Integration exercises unlock parts in order (paginate, collect auth headers while crawling, reconcile payments idempotently, handle retries and partial failure), and reports from Stripe say completing three of five parts can be enough. The lesson practises reading an unfamiliar API quickly and keeping each part's code shippable. The lab runs against a deterministic mock HTTP service in the browser.
   - Sources: https://prachub.com/interview-experiences/stripe-new-grad-software-engineer-interview-experience-rejected-after-ai-coding-and-integration-plus-bug-squash-onsite ; https://www.aced.io/experiences/ramp-ai-engineer-interview-13abb1
   - Widget or lab: lab:integration-round
3. **Model-client patterns the coding rounds test** (`model-client-patterns`, lesson, senior). Rounds that involve a model API test the same few patterns: classify errors before retrying, bound concurrency, parse streams incrementally, batch requests within a time window, and keep a provider pool healthy. The lesson writes each pattern once with tests. The reader can do any of them in 30 minutes.
   - Sources: https://platform.claude.com/docs/en/api/rate-limits ; https://platform.claude.com/docs/en/build-with-claude/streaming ; https://prachub.com/interview-experiences/anthropic-software-engineer-interview-experience-a-web-crawler-question-that-turned-into-a-late-multithreading-push ; https://platform.claude.com/docs/en/build-with-claude/batch-processing

**Problems** (7; multistage 5, code 2; hard 5, medium 2)

- `rnd-023` (multistage, hard, senior, new, Core 100, Crunch 16) In-memory database in four stages: set, get and delete; then filtered scans; then TTL with an injected clock; then backup and restore. Source: https://www.aced.io/experiences/ramp-ai-engineer-interview-13abb1. Reported: Ramp (candidate report via aced.io)
- `rnd-024` (multistage, hard, senior, new) In-memory file system in stages: mkdir, touch and ls; then cd and relative paths; then move with conflict rules. Source: https://prachub.com/companies/perplexity-ai. Reported: Perplexity (candidate reports via PracHub)
- `rnd-025` (multistage, hard, senior, new) A KV store with set, begin, commit and abort; then nested transactions; then serialisation and restore. Source: https://www.aced.io/blog/ai-engineer-interview-questions. Reported: OpenAI, xAI (candidate reports via aced.io)
- `rnd-026` (multistage, hard, senior, new) A time-versioned KV store: get at a timestamp, then restore to a point in time, then compaction of old versions. Source: https://prachub.com/companies/perplexity-ai. Reported: Perplexity (candidate reports via PracHub)
- `rnd-006` (code, medium, senior, existing) Parse a model token stream into text, tool calls and errors; hidden tests split events at awkward boundaries. Source: https://platform.claude.com/docs/en/build-with-claude/streaming
- `rnd-008` (code, medium, senior, existing) Run a model call over thousands of documents with retry classification, per-item isolation and a resumable checkpoint. Source: https://platform.claude.com/docs/en/build-with-claude/batch-processing
- `rnd-027` (multistage, hard, senior, new) Escape the maze: crawl an HTTP service to the exit URL with robust error handling, then collect auth headers while crawling. Source: https://www.aced.io/experiences/ramp-ai-engineer-interview-13abb1. Reported: Ramp (candidate report via aced.io)

### rounds/take-home-debug: Take-homes and work samples

Scoping a take-home and its report, and the build-and-defend format with a plan, a timed build and a review.

**Lessons**

1. **Scoping a take-home and writing the report reviewers want** (`take-home-scoping`, lesson, senior). A take-home is graded on what was cut and why as much as on what was built, and the README and eval report are where that judgement is visible. The lesson covers scoping a three-to-four-hour brief, the eval report a reviewer reads first, and Anthropic's account of redesigning its performance take-home as models improved. The reader can finish a take-home and defend each omission.
   - Sources: https://www.techinterview.org/post/3233476824/ai-engineer-interview-rag-agents-evals/ ; https://openai.com/interview-guide/ ; https://www.anthropic.com/engineering/AI-resistant-technical-evaluations
   - Existing: `src/content/lessons/rounds/take-home-debug/overview.mdx` (split, primary). Debugging multi-file code moves to codebase-rounds; build-and-defend work samples are new.
2. **Playbook: build-and-defend work samples** (`build-and-defend`, playbook, senior). Sierra's April 2026 loop removed coding and algorithm rounds and runs Plan (define a product), Build (two hours alone with any AI tools) and Review (demo, code review of the data model and abstractions, path to production and how AI was used); candidates report day-long builds at Cursor and few-hour builds at Cognition. The playbook covers scoping in the Plan, spending the Build so the Review has something to inspect, and the review questions reported at Cursor. It ends with a self-review rubric.
   - Sources: https://sierra.ai/blog/the-ai-native-interview ; https://www.aced.io/experiences/cursor-software-engineer-interview-a9c32f ; https://officechai.com/ai/cognition-ceo-scott-wu-explains-why-they-let-people-use-as-much-ai-as-they-like-in-job-interviews ; https://www.theforwarddeployed.io/interviews/openai
3. **Notebook data rounds** (`notebook-rounds`, lesson, senior). Some loops include a data-analysis round in a notebook, such as the reported Ramp round reconciling receipts with transactions, where the signal is how you check a matcher rather than how fast you write pandas. The lesson covers defining a match, measuring precision and recall on a labelled sample, and reporting what remains unmatched and why. The reader practises in a Pyodide notebook lab.
   - Sources: https://www.aced.io/experiences/ramp-ai-engineer-interview-13abb1
   - Widget or lab: lab:notebook-reconciliation

**Problems** (6; design 1, debug 1, worksample 3, critique 1; hard 5, medium 1)

- `rnd-010` (design, hard, senior, existing) The three-hour RAG take-home: what you build, what you cut and what the report says, without hints naming the deliverables. Source: https://www.techinterview.org/post/3233476824/ai-engineer-interview-rag-agents-evals/
- `rnd-011` (debug, medium, senior, existing) Long chats start failing with a 400 after a context change. Source: https://platform.claude.com/docs/en/api/errors
- `rnd-028` (worksample, hard, senior, new, Core 100, Crunch 17) Plan a product in 30 minutes, build it in two hours with any AI tools, then answer the review questions on data model, abstractions, path to production and AI use. Source: https://sierra.ai/blog/the-ai-native-interview. Reported: Sierra (official, 22 April 2026)
- `rnd-029` (worksample, hard, senior, new) A take-home on model APIs (a retrieval feature, a small agent or an eval harness) with a recorded walkthrough. Source: https://www.theforwarddeployed.io/interviews/openai. Reported: OpenAI (one candidate account via a vendor)
- `rnd-030` (critique, hard, senior, new) Review a submitted take-home: its eval report, its README and what its tests do not cover. Source: https://www.techinterview.org/post/3233476824/ai-engineer-interview-rag-agents-evals/
- `rnd-031` (worksample, hard, senior, new) A customer-service agent for an outdoors company: pick two of five features, then name the metrics and dashboards you would want in production. Source: https://www.aced.io/experiences/sierra-ai-machine-learning-engineer-interview-8549fc. Reported: Sierra (candidate report via aced.io, about two years old)

### rounds/codebase-rounds: Bug squash, PR review and code comprehension

Rounds set in an existing multi-file codebase: fix seeded bugs, review a diff whose tests pass, and read code you did not write.

**Lessons**

1. **Bug squash in an unfamiliar library** (`bug-squash`, lesson, senior). Bug-squash rounds hand over a real-looking library with a failing behaviour and expect a reproduction, a minimal fix and a test, under time pressure. Candidates report this at Stripe on open-source Python libraries and in the first phase of Meta's AI-enabled round. The lesson practises navigation, bisection and reproduction on original code.
   - Sources: https://prachub.com/interview-experiences/stripe-new-grad-software-engineer-interview-experience-rejected-after-ai-coding-and-integration-plus-bug-squash-onsite ; https://www.hellointerview.com/blog/meta-ai-enabled-coding
   - Widget or lab: lab:repo-bug-squash
2. **PR review: tests pass, production breaks** (`pr-review`, lesson, senior). A PR review round gives a diff whose tests pass and asks what breaks on production data: freshness, nulls, unbounded memory, retries and cross-cutting effects. Candidates report it at Netflix, and Sierra is piloting a round with a medium-sized codebase and a draft PR from a colleague. The reader reviews against a list of production failure classes rather than style.
   - Sources: https://prachub.com/interview-experiences/netflix-machine-learning-engineer-interview-experience-ml-fundamentals-plus-a-production-pr-review-rejected ; https://sierra.ai/blog/the-ai-native-interview
3. **Reading code you did not write** (`code-comprehension`, lesson, senior). Google is piloting a Gemini-assisted code comprehension round for junior and mid-level roles, and Meta's AI-enabled round opens with understanding a multi-file problem. The lesson covers reading strategies (entry points, data flow, tests as specification) and using an assistant to read without trusting it. The reader can explain an unfamiliar module in ten minutes.
   - Sources: https://www.entrepreneur.com/business-news/google-is-testing-a-new-rule-transform-job-interviews ; https://www.hellointerview.com/blog/meta-ai-enabled-coding ; https://codereading.club/

**Problems** (6; repo 3, critique 2, debug 1; hard 5, medium 1)

- `rnd-032` (repo, hard, senior, new, Core 100, Crunch 18) Bug squash in a multi-file Python package with three seeded bugs (a missing visitor method, an existence check that should be a file check, a resent request whose body stream was already consumed). Source: https://prachub.com/interview-experiences/stripe-new-grad-software-engineer-interview-experience-rejected-after-ai-coding-and-integration-plus-bug-squash-onsite. Reported: Stripe (candidate report via PracHub; exercises written fresh)
- `rnd-033` (critique, hard, senior, new) Review a feature-pipeline PR whose tests pass: what breaks in production, and what test would have caught each issue? Source: https://prachub.com/interview-experiences/netflix-machine-learning-engineer-interview-experience-ml-fundamentals-plus-a-production-pr-review-rejected. Reported: Netflix (candidate report via PracHub)
- `rnd-034` (repo, hard, senior, new) In a multi-file codebase: fix the bug, implement the feature, then optimise for larger test tiers. Source: https://www.hellointerview.com/blog/meta-ai-enabled-coding. Reported: Meta (candidate-reported format via Hello Interview)
- `rnd-035` (critique, hard, staff, new) A colleague's draft PR adds a cross-cutting feature to a medium-sized codebase: review it and improve it with a coding agent. Source: https://sierra.ai/blog/the-ai-native-interview. Reported: Sierra (official, piloted round)
- `rnd-036` (repo, medium, senior, new) Implement a hash tree inside an existing repository, following its conventions and tests. Source: https://www.aced.io/experiences/cursor-software-engineer-interview-a9c32f. Reported: Cursor (candidate report via aced.io, entry level)
- `rnd-037` (debug, hard, senior, new) A 200-line data pipeline with at least two bugs, one of which only shows on the second run. Source: https://github.com/amitshekhariitbhu/ai-engineering-interview-questions

### rounds/ai-collab-coding: AI-assisted rounds

Verification discipline when an assistant writes code, the dated policy reference per company and round, and directing a coding agent in a round.

**Lessons**

1. **Verification discipline when an assistant writes the code** (`verification-discipline`, lesson, senior). AI-assisted rounds score problem solving, code quality, verification and communication, and Meta's materials as summarised by a vendor say prompting is not the focus. Canva's write-up names failure patterns such as showcasing the AI, chasing features and going hands-off. The lesson teaches differential testing, diff reading and small steps, with the reader writing the tests that catch an assistant's plausible bug.
   - Sources: https://www.hellointerview.com/blog/meta-ai-enabled-coding ; https://www.canva.dev/blog/engineering/ai-interview-success/ ; https://canva.dev/blog/engineering/yes-you-can-use-ai-in-our-interviews
   - Widget or lab: RoundsDiffReview
   - Existing: `src/content/lessons/rounds/ai-collab-coding/overview.mdx` (rewrite, primary). The policy table becomes the dated policy-reference lesson; this lesson is the review and differential-testing discipline (level audit 5.1).
2. **AI-use policies by company and round, dated** (`policy-reference`, lesson, senior). Policies differ by company and by round: Anthropic defaults to no AI in live interviews and take-homes unless told otherwise, Amazon's quoted guidance bans it unless permitted, Meta replaced one onsite coding round with an AI-enabled one, Google's comprehension pilot is junior and mid only, and Sierra, Cognition, Shopify and Synthesia allow or expect it. Every row carries its source, its provenance label and its date. The page is reviewed quarterly.
   - Sources: https://www.anthropic.com/candidate-ai-guidance ; https://itpro.com/business/careers-and-training/amazon-bans-ai-tools-during-job-interviews ; https://www.hellointerview.com/blog/meta-ai-enabled-coding ; https://www.entrepreneur.com/business-news/google-is-testing-a-new-rule-transform-job-interviews ; https://sierra.ai/blog/the-ai-native-interview ; https://officechai.com/ai/cognition-ceo-scott-wu-explains-why-they-let-people-use-as-much-ai-as-they-like-in-job-interviews ; https://newsletter.pragmaticengineer.com/p/how-ai-is-changing-software-engineering ; https://jobs.ashbyhq.com/synthesia/6afd3236-71d3-4f67-92e6-b99a868a3260
3. **Directing a coding agent inside a round** (`directing-agents`, lesson, senior). When a round allows an agent, the signal is how you direct it: a plan before code, a check it must pass, and an independent review of what it produced. The lesson draws on Claude Code's best practices, MIT's 2026 agentic-coding exercises and Anthropic's account of a take-home where judgement about tooling was assessed. The reader practises narrating decisions while the agent works.
   - Sources: https://code.claude.com/docs/en/best-practices ; https://missing.csail.mit.edu/2026/agentic-coding/ ; https://www.anthropic.com/engineering/AI-resistant-technical-evaluations

**Problems** (6; code 2, debug 1, worksample 1, concept 1, critique 1; hard 5, medium 1)

- `rnd-038` (code, hard, senior, new) An AI-written rate limiter with a seeded race and a clock bug: write boundary tests with an injectable clock, then defend atomic check-and-update across servers and a store outage. Source: https://prachub.com/interview-questions/design-and-implement-a-rate-limiter-with-an-ai-assistant-then-defend-and-test-it. Reported: Snowflake (candidate report via PracHub)
- `rnd-012` (debug, medium, senior, existing) The assistant's cache passes its own tests: find the behaviour the tests never exercise. Source: https://www.canva.dev/blog/engineering/ai-interview-success/
- `rnd-039` (worksample, hard, senior, new) Build a small distributed cache with an assistant in 60 minutes: decomposition, verification plan and the review of its output. Source: https://canva.dev/blog/engineering/yes-you-can-use-ai-in-our-interviews
- `rnd-040` (code, hard, senior, new) Add a TTL eviction policy to an existing cache module with an assistant, with tests that would catch an off-by-one in expiry. Source: https://www.techinterview.org/post/3233474914/anthropic-interview-process-ai-collaborative-2026/
- `rnd-041` (concept, hard, staff, new) What would you refuse to delegate to the assistant in an interview, and why? Source: https://www.canva.dev/blog/engineering/ai-interview-success/
- `rnd-042` (critique, hard, senior, new) Critique a transcript of a candidate using an assistant in a 60-minute round. Source: https://www.canva.dev/blog/engineering/ai-interview-success/

### rounds/customer-craft: Customer discovery, product sense and decomposition

Discovery as requirements engineering, the AI product-sense round, and FDE decomposition with regulated and government constraints.

**Lessons**

1. **Customer discovery as requirements engineering** (`discovery`, lesson, senior). Discovery rounds score whether you find the evaluation criteria, past failed deployments, compliance, latency and residency constraints before proposing anything. The lesson practises reflecting back instead of pitching, and turning "it feels dumb" into a hypothesis and an experiment. The reader can run a 30-minute discovery with a sceptical stakeholder.
   - Sources: https://getperspective.ai/blog/anthropic-applied-ai-engineer-interview-process-frontier-lab-2026/markdown ; https://boards-api.greenhouse.io/v1/boards/anthropic/jobs/5423029008 ; https://openai.com/careers/forward-deployed-software-engineer-sf/
   - Widget or lab: RoundsDiscovery
   - Existing: `src/content/lessons/rounds/customer-craft/overview.mdx` (split, primary). Product sense and FDE decomposition become their own lessons.
2. **The AI product-sense round** (`product-sense`, lesson, senior). Product-sense prompts reported for 2025 and 2026 include productising a capability, growing a metric with three engineers, and "when should you not use an LLM", and Meta reportedly runs a round where candidates prototype with an AI tool. Because outputs are probabilistic, the structure adds the failure the user cannot detect, the success metric with guardrails, cost per outcome and the eval plan before launch. Every company attribution is secondhand and is labelled so on the page.
   - Sources: https://www.garagelabstech.com/blog/pm-interview-questions ; https://www.news.aakashg.com/p/ai-product-sense-guide ; https://applied-llms.org/
3. **Playbook: FDE decomposition with deployment constraints** (`fde-decomposition`, playbook, staff). A vague enterprise brief becomes scope, a success metric, a data-access plan, a hosting choice, compliance questions and a two-week plan. A reported Anthropic question asks how the design changes for a regulated-industry customer and then for a government contractor, and decomposition prompts such as "the dashboard is wrong but they cannot say which number" are reported for FDE loops. The playbook works both and ends with the measurable pilot.
   - Sources: https://www.aced.io/experiences/anthropic-machine-learning-engineer-interview-27873a ; https://www.theforwarddeployed.io/interviews/openai ; https://www.techinterview.org/post/3233477236/forward-deployed-engineer-interview/ ; https://boards-api.greenhouse.io/v1/boards/anthropic/jobs/5423029008

**Problems** (7; concept 2, behavioural 1, design 4; medium 1, hard 6)

- `rnd-014` (concept, medium, senior, existing) "The bot feels dumb": turn the complaint into hypotheses, an experiment and a decision. Source: https://hamel.dev/blog/posts/field-guide/
- `rnd-015` (behavioural, hard, senior, existing) The sceptical CTO role-play: discovery with a stakeholder who has seen two failed AI pilots. Source: https://getperspective.ai/blog/anthropic-applied-ai-engineer-interview-process-frontier-lab-2026/markdown
- `rnd-043` (design, hard, staff, new, Core 100) A regulated-industry customer wants to use the Claude API: design the implementation, then say what changes for a government contractor. Source: https://www.aced.io/experiences/anthropic-machine-learning-engineer-interview-27873a. Reported: Anthropic (candidate report via aced.io)
- `rnd-044` (design, hard, senior, new) You have text-to-music capability: how would you productise it? Source: https://www.garagelabstech.com/blog/pm-interview-questions. Reported: OpenAI (aggregated candidate reports via a vendor)
- `rnd-045` (design, hard, staff, new) Double image creation with only three engineers: what you build, what you measure and what you refuse. Source: https://www.news.aakashg.com/p/ai-product-sense-guide. Reported: OpenAI (prep vendor)
- `rnd-046` (concept, hard, senior, new) A customer says their dashboard is wrong and cannot tell you which number: what do you do in the first hour? Source: https://www.techinterview.org/post/3233477236/forward-deployed-engineer-interview/
- `rnd-047` (design, hard, senior, new) A hospital has patient records in six systems that do not talk to each other: give a nurse one view. Source: https://www.techinterview.org/post/3233477236/forward-deployed-engineer-interview/

### rounds/deep-dives: Deep dives, presentations and quizzes

Project deep dives with their probe list, paper presentations at staff level, and rapid-fire research quizzes.

**Lessons**

1. **Playbook: the project deep dive and presentation** (`project-deep-dive`, playbook, senior). Deep dives probe alternatives considered, your part versus the team's, the measured result and what you would undo, and formats range from a 30-minute presentation (reported at OpenAI) to a five-minute recorded walkthrough (Cognition) and a short technical talk (Sierra). Synthesia's published staff loop includes a delivery and impact deep dive. The playbook gives a structure and the probe list to rehearse against.
   - Sources: https://www.hellointerview.com/guides/openai/l5 ; https://www.aced.io/experiences/cognition-ai-senior-forward-deployed-engineer-interview-d1e586 ; https://www.aced.io/experiences/sierra-ai-machine-learning-engineer-interview-8549fc ; https://jobs.ashbyhq.com/synthesia/6afd3236-71d3-4f67-92e6-b99a868a3260
2. **Presenting a paper at staff level** (`paper-presentation`, lesson, staff). A reported Cohere staff loop asks candidates to present a paper from a provided list, and the round tests whether you can state the problem, the mechanism, the evidence and its limits, and what changed in practice. The lesson gives a 20-minute structure and the questions that separate reading a paper from understanding it. The reader rehearses with one of the paper walkthroughs on this site.
   - Sources: https://www.aced.io/experiences/cohere-staff-machine-learning-engineer-interview-b49af6 ; https://paperswelove.org/
3. **Rapid-fire research-engineer quizzes** (`research-quiz`, lesson, senior). Some research-engineer loops include rapid-fire maths, statistics, CS and ML questions with a follow-up asking for intuition, such as why L1 gradients produce sparsity; the DeepMind report is from 2021 and labelled as old. The lesson builds timed cards with a typed answer and an intuition follow-up. It uses the site's numbers-to-know cards for review.
   - Sources: https://www.teamblind.com/post/deepmind-research-engineer-interview-process-wp1gjgyb

**Problems** (6; presentation 4, concept 1, behavioural 1; hard 5, medium 1)

- `rnd-048` (presentation, hard, staff, new) Present a paper from a provided list in 20 minutes and defend it against the probe list. Source: https://www.aced.io/experiences/cohere-staff-machine-learning-engineer-interview-b49af6. Reported: Cohere (candidate report via aced.io, staff level)
- `rnd-049` (presentation, hard, senior, new) A 30-minute project presentation, then the probes: alternatives, your part, the measured result, what you would undo. Source: https://www.hellointerview.com/guides/openai/l5. Reported: OpenAI (aggregated candidate reports via Hello Interview)
- `rnd-050` (presentation, medium, senior, new) A five-minute recorded walkthrough of a take-home that a reviewer watches before the call. Source: https://www.aced.io/experiences/cognition-ai-senior-forward-deployed-engineer-interview-d1e586. Reported: Cognition (candidate report via aced.io)
- `rnd-051` (concept, hard, senior, new) An ML screen where the interviewer adds a constraint after each answer, ending with the intuition behind L1 sparsity. Source: https://www.teamblind.com/post/deepmind-research-engineer-interview-process-wp1gjgyb. Reported: Google DeepMind (candidate report, 2021)
- `rnd-052` (behavioural, hard, senior, new) Why did you use machine learning on this problem, how did you know it was the right use case, and did people adopt it? Source: https://www.aced.io/experiences/anthropic-machine-learning-engineer-interview-27873a. Reported: Anthropic (candidate report via aced.io)
- `rnd-053` (presentation, hard, staff, new) A five-to-ten-minute technical talk followed by questions on the trade-offs you skipped. Source: https://www.aced.io/experiences/sierra-ai-machine-learning-engineer-interview-8549fc. Reported: Sierra (candidate report via aced.io, about two years old)

### rounds/behavioural: Staff behavioural stories and the loop atlas

Staff-level stories with influence and risk, the dated atlas of loops per role family, and values rounds at labs.

**Lessons**

1. **Staff behavioural stories** (`staff-stories`, lesson, staff). Staff stories show ownership, alternatives considered, measured impact and influence across teams, and reported prompts include release criteria for a new model, an ethical concern raised under pressure and whether people adopted what you built. The lesson builds three versions of each story (two minutes, five minutes, deep dive) without explaining STAR. The reader prepares stories for the prompts below and rehearses the pushback.
   - Sources: https://www.hellointerview.com/guides/openai/l5 ; https://www.aced.io/experiences/anthropic-machine-learning-engineer-interview-27873a ; https://www.aboutamazon.com/news/workplace/amazon-interview-guide
   - Widget or lab: RoundsStar
   - Existing: `src/content/lessons/rounds/behavioural/overview.mdx` (split, primary). The four-company loop table becomes the loop-atlas playbook; stories become staff-level.
2. **Playbook: the 2026 loop atlas** (`loop-atlas`, playbook, senior). One page per role family (applied AI and FDE, research engineer, ML infra, AI security, software engineer at AI companies) shows rounds, the AI policy per round and level signals, with every row labelled official, press, candidate or vendor and a last-checked date. Sources range from Sierra's and Anthropic's own pages to candidate reports, and synthesised question banks are never used for company tags. The playbook ends with how to choose which loops to practise for.
   - Sources: https://sierra.ai/blog/the-ai-native-interview ; https://www.anthropic.com/candidate-ai-guidance ; https://www.anthropic.com/engineering/AI-resistant-technical-evaluations ; https://www.hellointerview.com/blog/meta-ai-enabled-coding ; https://www.entrepreneur.com/business-news/google-is-testing-a-new-rule-transform-job-interviews ; https://newsletter.pragmaticengineer.com/p/how-ai-is-changing-software-engineering ; https://itpro.com/business/careers-and-training/amazon-bans-ai-tools-during-job-interviews ; https://jobs.ashbyhq.com/synthesia/6afd3236-71d3-4f67-92e6-b99a868a3260 ; https://www.hellointerview.com/blog/the-system-design-interview-what-is-expected-at-each-level
3. **Values and mission rounds at AI labs** (`values-rounds`, lesson, senior). Values rounds at labs ask how you think about safety trade-offs, ambiguity and disagreement, and expect specific examples rather than positions. The lesson uses the labs' own published material (careers pages, interview guides, scaling policies) to show what each says it values. The reader prepares answers that are specific, honest and defensible.
   - Sources: https://www.anthropic.com/careers ; https://openai.com/interview-guide/ ; https://www.anthropic.com/responsible-scaling-policy

**Problems** (7; behavioural 7; hard 5, medium 2)

- `rnd-054` (behavioural, hard, staff, new, Core 100, Crunch 20) The eval said ship and you said no: tell the story, with the evidence, the cost of waiting and what happened next. Source: https://www.aboutamazon.com/news/workplace/amazon-interview-guide
- `rnd-016` (behavioural, medium, senior, existing) Tell me about an LLM feature you shipped: what you measured, what failed and what you changed. Source: https://openai.com/interview-guide/
- `rnd-017` (behavioural, medium, senior, existing) Accuracy or latency: a time you had to choose and how you decided. Source: https://www.aboutamazon.com/news/workplace/amazon-interview-guide
- `rnd-055` (behavioural, hard, staff, new) If you were deciding whether to release a new AI model, what criteria would you use? Source: https://www.hellointerview.com/guides/openai/l5. Reported: OpenAI (aggregated candidate reports via Hello Interview)
- `rnd-056` (behavioural, hard, staff, new) Tell me about an ethical or policy concern you raised under pressure. Source: https://www.aced.io/experiences/anthropic-machine-learning-engineer-interview-27873a. Reported: Anthropic (candidate report via aced.io)
- `rnd-057` (behavioural, hard, staff, new) Tell me about a task you took away from an agent and gave back to ordinary code. Source: https://www.kore1.com/ai-agent-engineer-interview-questions/
- `rnd-058` (behavioural, hard, staff, new) What could your last agent write to, and who approved that list? Source: https://www.kore1.com/ai-agent-engineer-interview-questions/

## Teardowns

From public sources only. Each page follows the SPEC teardown skeleton and ends with what is not public.

### Claude Code and the Claude Agent SDK (`claude-code`, harness/harness-anatomy, staff)

Anthropic's terminal and IDE coding agent and the SDK that exposes the same loop.

- Draw: gather-act-verify loop; built-in tools (Read, Edit, Write, Glob, Grep, Bash, WebFetch, Agent); memory files and auto memory; skills; hooks (33 events, 5 handler types); sub-agents; MCP with deferred tool loading; permission modes and rule engine; OS sandbox and network proxy; checkpoints (files only); sessions as JSONL; auto-compaction
- Trace: One turn: system prompt and tools, then project context, then conversation; a tool call passes deny, ask and allow rules and the sandbox; a Stop hook runs checks; compaction near the limit re-injects memory files and recent files.
- Not public: The full system prompt, auto-mode classifier prompts and training data, and how compaction thresholds were chosen.
- Sources: https://code.claude.com/docs/llms.txt ; https://code.claude.com/docs/en/how-claude-code-works ; https://code.claude.com/docs/en/prompt-caching ; https://code.claude.com/docs/en/context-window ; https://code.claude.com/docs/en/hooks ; https://code.claude.com/docs/en/permission-modes ; https://code.claude.com/docs/en/sandboxing ; https://www.anthropic.com/engineering/claude-code-auto-mode ; https://www.anthropic.com/engineering/april-23-postmortem ; https://www.anthropic.com/engineering/how-we-contain-claude

### OpenAI Codex CLI (`codex-cli`, harness/harness-anatomy, staff)

OpenAI's Apache-2.0 coding agent CLI built on the Responses API.

- Draw: Responses API loop with stateless requests; AGENTS.md discovery root to cwd; environment-context message; sandbox modes (read-only, workspace-write, full access); approval policies; Starlark execution rules; auto-review reviewer agent; network proxy; compaction endpoint
- Trace: One turn: instructions, tools and an input list sent without previous_response_id; configuration changes appended as messages; a shell call checked against rules, run in the sandbox, and its output returned.
- Not public: The contents of the encrypted compaction item and how the reviewer model is trained. Codex states MCP tools are not sandboxed by Codex.
- Sources: https://github.com/openai/codex ; https://openai.com/index/unrolling-the-codex-agent-loop/ ; https://learn.chatgpt.com/docs/agent-approvals-security ; https://learn.chatgpt.com/docs/sandboxing ; https://learn.chatgpt.com/docs/agent-configuration/rules ; https://learn.chatgpt.com/docs/sandboxing/auto-review ; https://learn.chatgpt.com/docs/agent-configuration/agents-md

### Cursor agent (`cursor-agent`, harness/context-management, staff)

The agent inside the Cursor editor, with local and cloud execution.

- Draw: Instant Grep with a local index; Explore sub-agent on a faster model; rules (.mdc, AGENTS.md, team rules); run modes with an Auto-review classifier; Seatbelt or Landlock plus seccomp sandbox; permissions.json and sandbox.json; default network limits
- Trace: One request: search through the local index (no embeddings stored for search per current docs), edits, a terminal command classified by run mode and sandboxed where supported.
- Not public: The system prompt, the Auto-review classifier's accuracy, and exactly when and why semantic search was removed (the 2025 semantic-search post is historical).
- Sources: https://cursor.com/docs/agent/tools/search ; https://cursor.com/docs/agent/security ; https://cursor.com/docs/agent/security/run-modes ; https://cursor.com/blog/agent-sandboxing ; https://cursor.com/docs/context/rules ; https://cursor.com/en-US/blog/semsearch

### GitHub Copilot cloud agent (`copilot-cloud-agent`, harness/permissions-sandboxing, senior)

GitHub's asynchronous coding agent (formerly "coding agent") that works on issues and opens PRs.

- Draw: ephemeral environment from copilot-setup-steps.yml; session time cap; one branch and one PR per task; firewall for processes started by its Bash tool; hidden-character filtering; CodeQL, dependency and secret scanning; review rules (requester cannot approve)
- Trace: An issue assigned to the agent: environment set up, work on a copilot/ branch, firewall applied to Bash processes only, checks run, PR opened for human review.
- Not public: Model routing, the prompt, and the internals of the validation step. The firewall does not cover MCP servers or setup steps.
- Sources: https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent ; https://docs.github.com/en/copilot/concepts/agents/coding-agent/risks-and-mitigations ; https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/customize-the-agent-firewall

### OpenHands (`openhands`, harness/context-management, senior)

An MIT-licensed open agent platform with a published SDK.

- Draw: event stream of actions and observations; CodeAct agent; Docker runtime; condenser; LLM security analyzer with a confirmation policy; event-sourced persistence
- Trace: One step: an action event, its observation, a condensation event when the view exceeds the limit, and a confirmation when the model-rated risk is high.
- Not public: Production usage data; the model-rated risk is a hint, not a control, because the model sets it.
- Sources: https://arxiv.org/abs/2407.16741 ; https://arxiv.org/abs/2511.03690 ; https://docs.openhands.dev/sdk/arch/condenser ; https://docs.openhands.dev/sdk/arch/security

### Aider (`aider`, harness/context-management, senior)

An Apache-2.0 terminal pair-programming tool built around a repository map.

- Draw: repo map from tree-sitter tags; personalised PageRank ranking; token budget for the map; chat files versus read-only files; edit formats; git commit per change
- Trace: One request: the map ranked toward files in the chat and mentioned identifiers, fitted into the token budget, an edit in the chosen format, and a commit.
- Not public: Little is hidden because the source is public; usage and success rates by edit format on users' repositories are not.
- Sources: https://aider.chat/docs/repomap.html ; https://aider.chat/2023/10/22/repomap.html ; https://github.com/Aider-AI/aider/blob/main/aider/repomap.py

### Cline (`cline`, harness/permissions-sandboxing, senior)

An open-source IDE agent with Plan and Act modes.

- Draw: Plan mode (no edits or commands) and Act mode; different models per mode; per-category auto-approve; model-set requires_approval flag; checkpoints
- Trace: One task: a plan drafted without edits, then Act with commands auto-approved per category, where the "safe command" decision depends on a flag the model sets.
- Not public: Memory-bank and context-management internals were not read in the research pass and must be fetched before writing.
- Sources: https://docs.cline.bot/features/plan-and-act ; https://docs.cline.bot/features/auto-approve

### Devin (`devin`, harness/long-running-parallel, staff)

Cognition's autonomous software agent with a cloud workspace.

- Draw: cloud VM with shell, IDE and browser; environment blueprints and snapshots; Knowledge, Playbooks and skills; self-hosted workers; local execution with per-call approval; deterministic orchestration of many sessions
- Trace: A session: snapshot restored, task planned and executed in the VM, browser checks, PR raised; parallel sessions orchestrated by code.
- Not public: Model mix, loop internals and sandbox technology. Cognition's posts on single-threaded agents and SWE-grep describe design choices, not the product's internals.
- Sources: https://docs.devin.ai/llms.txt ; https://cognition.com/blog/dont-build-multi-agents ; https://cognition.com/blog/swe-grep

### Perplexity answer engine and Search API (`perplexity`, rag/search-quality, staff)

An answer engine whose published search architecture serves AI models with span-level results.

- Draw: crawler and indexer fleets with ML-scheduled refresh; self-improving content understanding with LLM-assessed parsing rules; documents split into self-contained spans; hybrid lexical and semantic retrieval; multi-stage ranking ending in cross-encoders; answer generation with citations; deep research mode with iterative searches
- Trace: One query: hybrid retrieval into a broad candidate set, progressively stronger rankers to a small set of spans, then an answer that cites them; deep research repeats search and reading while refining a plan.
- Not public: Model choices per stage, ranking features and weights, and how product signals feed training data beyond the published description. The published latency and quality comparisons are the vendor's own.
- Sources: https://research.perplexity.ai/articles/architecting-and-evaluating-an-ai-first-search-api ; https://www.perplexity.ai/hub/blog/introducing-perplexity-deep-research

### ChatGPT with tools, agent mode and memory (`chatgpt-tools-memory`, agents/memory-state, staff)

OpenAI's assistant with saved memories, chat-history reference, connectors and an agent mode with its own virtual computer.

- Draw: saved memories and chat-history reference; memory controls and temporary chat; connectors to third-party apps; agent mode: visual browser, text browser, terminal, API access; confirmation before consequential actions; takeover and interruption; prompt-injection monitoring
- Trace: One agent task: plan, choose the text or visual browser, read connector data, ask for confirmation before a purchase, and let the user take over to log in.
- Not public: How memories are selected for a given prompt, the retrieval behind chat-history reference, and model and classifier details for injection monitoring. The spAIware case shows memory as a persistence channel for injection.
- Sources: https://openai.com/index/memory-and-new-controls-for-chatgpt/ ; https://help.openai.com/en/articles/8590148-memory-faq ; https://openai.com/index/introducing-chatgpt-agent/ ; https://openai.com/index/chatgpt-agent-system-card/ ; https://embracethered.com/blog/posts/2024/chatgpt-macos-app-persistent-data-exfiltration/

### Deep-research agents (OpenAI, Perplexity, Google, Anthropic) (`deep-research-agents`, agents/multi-agent, staff)

Agents that run many searches and reads over minutes and write a cited report.

- Draw: planner that refines a research plan; search and read loop; browsing and file analysis tools; MCP or app connectors and trusted-site restriction; report writer with citations; progress view and interruption
- Trace: A query: plan, dozens of searches, reading and pivoting, interruption by the user, and a cited report; OpenAI documents connecting MCP sources and restricting web search to trusted sites.
- Not public: Orchestration internals, the number of parallel workers, and how each vendor verifies citations are mostly not public; Anthropic's engineering post is the exception and has its own teardown.
- Sources: https://openai.com/index/introducing-deep-research/ ; https://cdn.openai.com/deep-research-system-card.pdf ; https://www.perplexity.ai/hub/blog/introducing-perplexity-deep-research ; https://blog.google/products/gemini/google-gemini-deep-research/ ; https://www.anthropic.com/news/research

### Anthropic's multi-agent research system (`anthropic-research-system`, agents/multi-agent, staff)

The orchestrator-worker system behind Claude's Research feature, described in Anthropic's 2025 engineering post.

- Draw: lead agent that plans and delegates; parallel sub-agents with their own context; artifacts written to storage and passed by reference; citation agent; synchronous sub-agent execution; resume from failure; rainbow deployments
- Trace: A query: lead agent plans, spawns sub-agents with explicit tasks, sub-agents search in parallel and return condensed findings, a citation pass attributes claims.
- Not public: Prompts in full, the internal eval set, and per-query cost distributions. Published figures (90.2% over single-agent on an internal eval, about 15 times chat tokens) are the vendor's own.
- Sources: https://www.anthropic.com/engineering/multi-agent-research-system ; https://www.anthropic.com/news/research

### Gemini CLI and the move to Antigravity CLI (`gemini-cli`, harness/permissions-sandboxing, senior)

Google's Apache-2.0 terminal agent, replaced for individual tiers by Antigravity CLI in June 2026.

- Draw: GEMINI.md context file; file system, shell, fetch and search tools; MCP; checkpointing; Seatbelt profiles or container sandbox
- Trace: One command: context assembled from GEMINI.md, a shell tool call under the selected sandbox profile.
- Not public: Antigravity CLI's internals. Teach Gemini CLI as the open reference and state its current status.
- Sources: https://github.com/google-gemini/gemini-cli ; https://raw.githubusercontent.com/google-gemini/gemini-cli/main/docs/cli/sandbox.md ; https://developers.googleblog.com/en/an-important-update-transitioning-gemini-cli-to-antigravity-cli/

### Goose (`goose`, harness/tools-aci, senior)

An open-source agent whose extensions are all MCP servers.

- Draw: interface, agent and extensions; errors returned to the model as tool results; context revision with smaller models; ACP server mode
- Trace: One call: tool chosen from MCP extensions, an invalid-JSON error returned to the model as a tool result, retried.
- Not public: Production usage data and model routing defaults beyond the docs.
- Sources: https://goose-docs.ai/docs/goose-architecture/

### Google Jules (`jules`, harness/long-running-parallel, senior)

Google's asynchronous coding agent running in a short-lived VM per task.

- Draw: VM per task with preinstalled toolchains; setup script with run and snapshot; AGENTS.md; plan before code with review and approval
- Trace: One task: VM restored from a snapshot, plan shown for approval, changes made, PR prepared.
- Not public: Whether plans auto-approve after a delay is unverified (a secondary source says so; Google's page says only that you can approve).
- Sources: https://jules.google/docs ; https://jules.google/docs/environment/

### mini-swe-agent (with annotated code reading) (`mini-swe-agent`, harness/harness-anatomy, senior)

An MIT-licensed agent of about 100 lines that uses only bash.

- Draw: agent class with linear history; bash as the only tool; subprocess.run per action; environment swap for containers
- Trace: One step: model output parsed for a bash block, run as an independent subprocess, output appended to history.
- Not public: Nothing material; its self-reported SWE-bench Verified score should not be used as evidence of harness quality.
- Sources: https://github.com/SWE-agent/mini-swe-agent ; https://arxiv.org/abs/2405.15793

### OpenAI Agents SDK (`openai-agents-sdk`, apis/frameworks, senior)

OpenAI's agent framework with handoffs, guardrails, sessions, tracing and sandbox agents.

- Draw: agents and agents as tools; handoffs with input filters; input and output guardrails; sessions; tracing; human-in-the-loop with serialisable run state; Temporal integration
- Trace: A run: agent loop, a handoff with filtered history, a tool needing approval pauses the run, state serialised, resumed after approval.
- Not public: Hosted-side behaviour behind the API; the docs warn that deserialising run state does not authenticate the snapshot or the reviewer.
- Sources: https://openai.github.io/openai-agents-python/ ; https://openai.github.io/openai-agents-python/handoffs/ ; https://openai.github.io/openai-agents-python/human_in_the_loop/ ; https://temporal.io/blog/announcing-openai-agents-sdk-integration

### Claude Managed Agents (`managed-agents`, harness/cache-cost-latency, staff)

Anthropic's hosted agent runtime with sessions outside the harness.

- Draw: session as append-only event log; stateless harness; sandboxes behind an execute interface; lazy sandbox provisioning; credential vaults with egress substitution
- Trace: A session: events appended, the harness woken, a sandbox provisioned only when a tool needs it, credentials substituted at egress for allowed hosts.
- Not public: Scheduling, isolation technology details and capacity numbers beyond the published latency change.
- Sources: https://www.anthropic.com/engineering/managed-agents ; https://platform.claude.com/docs/en/managed-agents/overview ; https://platform.claude.com/docs/en/managed-agents/vaults

### Claude Code auto mode (`claude-code-auto-mode`, harness/permissions-sandboxing, staff)

A classifier-based approver that replaces most permission prompts in Claude Code.

- Draw: server-side probe on tool results; two-stage transcript classifier; tool results stripped from classifier input; read-only tools and in-project edits skip review; broad allow rules dropped on entry; fallback after repeated denials
- Trace: An action: classifier sees user messages and the tool call, approves or blocks; repeated blocks pause auto mode.
- Not public: Classifier prompts and training data. Published rates: 0.4% false positives on 10,000 real actions, 17% false negatives on 52 real overeager actions.
- Sources: https://www.anthropic.com/engineering/claude-code-auto-mode ; https://code.claude.com/docs/en/permission-modes

### How Anthropic contains Claude across products (`anthropic-containment`, security/sandboxing-secrets, staff)

Anthropic's account of three containment patterns and the incidents that tested them.

- Draw: gVisor container for claude.ai code execution; OS sandbox plus approvals for Claude Code; local VM for Cowork; network proxies and allowlists
- Trace: Each incident as a trace: project config that ran before the trust prompt; a phished prompt that read cloud credentials and posted them; a file upload to an attacker account through an allowlisted domain.
- Not public: Detection telemetry and internal response timelines beyond the post.
- Sources: https://www.anthropic.com/engineering/how-we-contain-claude ; https://www.anthropic.com/engineering/claude-code-sandboxing

### Anthropic's long-running coding harness (`long-running-harness`, harness/long-running-parallel, staff)

A two-agent harness for work across many context windows.

- Draw: initializer agent; init script, progress file and JSON feature list; coding agent sessions; end-to-end check before work; git commits as checkpoints
- Trace: A session: read progress and git log, run the basic check, pick one failing feature, implement, test as a user would, commit, update progress.
- Not public: Success rates across projects; the post reports what still failed (for example browser-native modals).
- Sources: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents

### OpenAI's agent-first repository (`agent-first-repo`, harness/long-running-parallel, staff)

OpenAI's account of an internal product built mostly by Codex agents.

- Draw: AGENTS.md of about 100 lines as a map; docs tree as the system of record; custom lints and structural tests; bootable app per worktree; ephemeral observability stack per worktree; doc-gardening and cleanup agents
- Trace: A change: agent reads the map, plans, implements in a worktree, runs the app and queries its logs and metrics, lints carry fixes, agent review, merge.
- Not public: The product, the code, and any defect or incident rate; OpenAI says the result depends on that repository's structure.
- Sources: https://openai.com/index/harness-engineering/

### Building a C compiler with parallel agents (`c-compiler-oracles`, harness/verification, staff)

Anthropic's account of 16 agents building a C compiler against an oracle.

- Draw: GCC as a known-good oracle; delta debugging across files; test output written for agents; sampled fast test mode per agent; lock files for task claims; late CI to stop regressions
- Trace: A task: claimed by lock file, implemented, checked against the oracle, regression found by delta debugging, merged through git.
- Not public: Per-task failure data and how often lock contention occurred.
- Sources: https://www.anthropic.com/engineering/building-c-compiler

### EchoLeak, end to end (`echoleak`, safety/threat-modeling, senior)

A zero-click data exfiltration chain against Microsoft 365 Copilot (CVE-2025-32711).

- Draw: attacker email; retrieval into Copilot context; classifier evasion; reference-style Markdown; auto-fetched image; allowed proxy
- Trace: The chain step by step, and the deterministic block on the exfiltration channel as the fix pattern.
- Not public: Microsoft's internal detection and fix timeline beyond the advisory.
- Sources: https://arxiv.org/abs/2509.10540 ; https://cveawg.mitre.org/api/cve/CVE-2025-32711 ; https://www.microsoft.com/en-us/msrc/blog/2025/07/how-microsoft-defends-against-indirect-prompt-injection-attacks ; https://simonwillison.net/tags/markdown-exfiltration/

### Uber TextSense invoice processing (`uber-textsense`, workflows/batch-pipelines, senior)

Uber's GenAI invoice pipeline orchestrated by Cadence.

- Draw: intake; OCR; model extraction; post-processing rules; side-by-side review UI; write-back
- Trace: An invoice through each stage, with uncertain fields routed to a reviewer.
- Not public: The accuracy definition beyond exact and fuzzy matching, review thresholds and volumes. The reported 90% overall accuracy is not a per-invoice success rate.
- Sources: https://www.uber.com/blog/advancing-invoice-document-processing-using-genai/

### Instacart PARSE catalog attribute extraction (`instacart-parse`, workflows/batch-pipelines, senior)

Instacart's config-driven multimodal extraction platform.

- Draw: attribute configs and versioned prompts; multimodal extraction; self-verification confidence; human audit queue; model cascade
- Trace: An attribute: extracted, verified by a second call whose first-token probability is the confidence, low confidence to auditors.
- Not public: The confidence threshold and cascade details.
- Sources: https://company.instacart.com/tech-innovation/scaling-catalog-attribute-extraction-with-multi-modal-llms

### Grab data classification (`grab-classification`, workflows/retries-flow-control, senior)

Grab's LLM classification of data entities ("Gemini" is Grab's internal orchestrator; the model was GPT-3.5).

- Draw: request grouping; mini-batches through a queue; workflow-level rate limiter under a shared quota; JSON output with a default tag; Kafka fan-out; weekly owner verification
- Trace: An entity: batched, classified under the shared rate limit, published to Kafka, verified by its owner.
- Not public: Accuracy figures and error handling details.
- Sources: https://engineering.grab.com/llm-powered-data-classification

### Airbnb's LLM test migration (`airbnb-migration`, workflows/patterns, senior)

Airbnb's migration of nearly 3,500 test files with a per-file state machine.

- Draw: per-file state machine; validation-gated transitions; retries with errors in the prompt; sample, tune, sweep loop; manual long tail
- Trace: A file: refactor, fix tests, fix lint and types, complete; each transition gated by validation.
- Not public: The prompts and per-state retry limits.
- Sources: https://airbnb.tech/?p=366

### Duolingo's agent platform (`duolingo-agent-platform`, workflows/operating-workflows, senior)

Duolingo's agent registry and Temporal-based agent workflows.

- Draw: agent registry; Temporal AgentWorkflow wrapper; MCP tool calls as activities via the Agents SDK plugin; evals as workflows; flag-removal agent in one activity
- Trace: An agent run: workflow started, model and tool calls as activities, PR created in the same activity as the clone.
- Not public: Run counts and failure rates.
- Sources: https://blog.duolingo.com/production-ready-ai-agent-platform/ ; https://blog.duolingo.com/buildingaiagents

### DeepSeek-V3 training system (`deepseek-v3`, training/distributed, staff)

DeepSeek's 671B-total MoE model and its training system.

- Draw: MoE with shared and routed experts; multi-token prediction; FP8 training with fine-grained scaling; DualPipe; PP 16, EP 64, ZeRO-1, no TP; auxiliary-loss-free balancing
- Trace: A training step across pipeline stages with all-to-all dispatch limited to four nodes per token.
- Not public: The full data mixture, prior research and ablation costs; the $5.576M figure covers only the official run at an assumed GPU price.
- Sources: https://arxiv.org/html/2412.19437v2

### Llama 3 405B infrastructure (`llama3-405b`, training/reliability, staff)

Meta's 405B dense model trained on up to 16K H100s.

- Draw: 4D parallelism (TP, CP, PP, DP); MFU by stage; failure taxonomy; batch-size ramp; annealing; post-training rounds
- Trace: The run as stages: short context, long-context extension with context parallelism, annealing, then SFT and DPO rounds.
- Not public: Cluster-level failure handling code; one row of the failure table has an inconsistent denominator.
- Sources: https://arxiv.org/html/2407.21783

### Kimi K2 (`kimi-k2`, training/numerics, staff)

Moonshot's 1T-total, 32B-active MoE model.

- Draw: MuonClip optimizer with QK-Clip; rephrasing in pretraining; sparsity scaling law; colocated RL with a fast checkpoint engine; real and synthetic environments
- Trace: Pretraining with logit clipping, then RL with rollouts and weight updates colocated.
- Not public: Full data mixture and most ablation detail.
- Sources: https://arxiv.org/html/2507.20534

### OLMo 2 and Olmo 3 (`olmo2-olmo3`, training/pretraining-data, staff)

AI2's fully open training recipes.

- Draw: stability changes (norm placement, QK-norm, z-loss); Dolmino mid-training mix; souped anneals; Tulu 3 post-training and RLVR; released model flow
- Trace: Pretraining, mid-training with micro-annealing to judge sources, souping, then post-training.
- Not public: Little is hidden; note the z-loss value differs between the paper text and its table.
- Sources: https://arxiv.org/html/2501.00656 ; https://arxiv.org/abs/2512.13961

### Qwen3 (`qwen3`, training/distill-merge, senior)

Alibaba's Qwen3 family and its training pipeline.

- Draw: three pretraining stages; long-CoT cold start; reasoning RL; thinking-mode fusion; general RL; strong-to-weak distillation
- Trace: From pretraining stages to the four post-training stages and distillation into small models.
- Not public: Data mixtures and the RL environments in full.
- Sources: https://arxiv.org/html/2505.09388

### DeepSeek-R1 (`deepseek-r1`, training/rl, senior)

DeepSeek's reasoning model trained with RL on a base model.

- Draw: R1-Zero: GRPO on a base model; cold-start data; RL stages; rejection sampling and SFT; distillation into smaller models
- Trace: The pipeline from R1-Zero to R1 to distilled models, including the failed process-reward and MCTS attempts.
- Not public: Full data mixtures.
- Sources: https://arxiv.org/html/2501.12948 ; https://arxiv.org/html/2501.12948v1

### TorchTitan (`torchtitan`, training/distributed, staff)

A PyTorch-native training stack composing parallelisms, Float8 and checkpointing.

- Draw: FSDP2; tensor and pipeline parallelism; Float8 training; distributed checkpointing; elastic scaling
- Trace: A training step with composed parallelism and an asynchronous checkpoint.
- Not public: Production cluster failure data.
- Sources: https://arxiv.org/abs/2410.06511 ; https://docs.pytorch.org/docs/2.14/distributed.checkpoint.html

### Layer layouts in open-weight configs (`open-config-layouts`, multimodal/architectures, staff)

A side-by-side reading of published model configurations.

- Draw: gpt-oss banded windows, sinks and YaRN; Gemma 3 local and global layers; Jamba attention and Mamba layers with MoE; Kimi Linear hybrid; MiniMax-01 lightning attention; Llama 4 interleaved no-position layers; DeepSeek-V3.2 sparse attention
- Trace: For each config, KV bytes per token at 128K computed from the published fields.
- Not public: Training data mix and most ablations.
- Sources: https://arxiv.org/html/2508.10925 ; https://arxiv.org/abs/2503.19786 ; https://arxiv.org/html/2403.19887 ; https://arxiv.org/html/2510.26692 ; https://arxiv.org/abs/2501.08313 ; https://ai.meta.com/blog/llama-4-multimodal-intelligence/ ; https://arxiv.org/html/2512.02556

### Vector indexes on SSD and object storage (`diskann-turbopuffer`, rag/vector-systems, staff)

DiskANN and turbopuffer as two answers to the RAM cost of vector search.

- Draw: DiskANN graph on SSD with compressed vectors in RAM; turbopuffer write-ahead log per namespace on object storage; centroid index suited to object storage; NVMe and memory caches
- Trace: A cold and a warm query, with the published latency for each.
- Not public: Cost per query and cache sizing policies beyond the docs.
- Sources: https://proceedings.neurips.cc/paper/2019/hash/09853c7fb1d3f8ee67a61b6bf4a7f8e6-Abstract.html ; https://turbopuffer.com/docs/architecture ; https://arxiv.org/abs/2401.08281

### vLLM's request path (`vllm-request-path`, inference/batching, senior)

The Apache-2.0 serving engine's scheduler, KV manager and prefix cache.

- Draw: API server; scheduler with a token budget per step; KV block manager; prefix cache by block hash; model runner; metrics
- Trace: A request: admitted, prefill chunked under the budget, decode steps with other requests, preempted under pressure, finished.
- Not public: Little; pin a commit hash for every excerpt because the code moves quickly.
- Sources: https://vllm.ai/blog/2025-01-27-v1-alpha-release ; https://arxiv.org/abs/2309.06180 ; https://docs.vllm.ai/en/latest/design/prefix_caching.html ; https://docs.vllm.ai/en/latest/design/metrics.html

## Labs

Progressive builds in Pyodide (standard library), each step a code problem whose tests build on the previous step.

### Build a mini agent harness (`mini-agent-harness`, harness/harness-anatomy, senior)

1. The loop with max_turns and the final-turn rule
2. Tools with output truncation to a character budget and a file-path fallback
3. A deny, ask and allow gate that parses commands and refuses to split scripts with substitution or redirection
4. Concurrent read-only tools and sequential mutating tools
5. Cache-friendly prompt assembly that appends configuration changes
6. Compaction that keeps first and last events and re-injects memory files
7. A Stop check that sends the agent back with failing test output
8. A spend cap and a skill loader that adds a SKILL.md body only when selected

Tests: Against a deterministic scripted mock model; tests assert behaviour (calls made, budgets respected, prefix stability), never internal names.
Sources: https://code.claude.com/docs/en/agent-sdk/agent-loop ; https://learn.chatgpt.com/docs/agent-configuration/rules ; https://docs.openhands.dev/sdk/arch/condenser ; https://code.claude.com/docs/en/prompt-caching ; https://app.codecrafters.io/courses/claude-code/overview ; https://agentskills.io/specification

### Build a harness eval runner (`harness-eval-runner`, harness/evaluating-harnesses, staff)

1. Run N trials per task against two harness variants
2. Compute pass@k and pass^k
3. Attach cost and turns per trial
4. Record the resource configuration with each run
5. Paired comparison between variants
6. Flag gaps inside the noise band

Tests: Seeded trial outcomes; tests check statistics and that a gap under the noise band is not reported as a win.
Sources: https://arxiv.org/abs/2406.12045 ; https://www.anthropic.com/engineering/infrastructure-noise ; https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents

### Build a RAG pipeline with failure-stage tests (`rag-pipeline`, rag/debugging-rag, senior)

1. Chunker with structure awareness
2. BM25 retriever
3. Dense retriever stub with fixed vectors
4. Reciprocal rank fusion
5. Reranker stub
6. Citation check that every claim cites a retrieved span
7. One failing test per failure stage to localise

Tests: Each step has a test that fails only when that stage is wrong, so the reader learns to localise.
Sources: https://arxiv.org/abs/2401.05856 ; http://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf ; https://lucene.apache.org/core/9_0_0/core/org/apache/lucene/search/similarities/BM25Similarity.html ; https://www.techinterview.org/post/3233476824/ai-engineer-interview-rag-agents-evals/

### Build an eval harness (`eval-harness`, evals/llm-judge, senior)

1. Load a versioned golden set
2. A binary judge against a scripted mock
3. TPR and TNR on labelled data
4. Correct the observed pass rate with an interval
5. pass^k from repeated trials
6. A regression gate with a paired test
7. A report with what the gate did not check

Tests: Seeded labels and outcomes; tests check corrected rates and gate decisions at the boundary.
Sources: https://github.com/ai-evals-course/judgy ; https://hamel.dev/blog/posts/evals-faq/ ; https://arxiv.org/abs/2411.00640 ; https://arxiv.org/abs/2406.12045

### Error analysis on 30 traces (`error-analysis`, evals/eval-thinking, senior)

1. Read and open-code 30 recorded traces
2. Group codes into axial categories
3. Label the first upstream failure per trace
4. Count and rank categories
5. Compare with the answer key and explain differences

Tests: Self-check against an answer key with a stated tolerance on category counts.
Sources: https://hamel.dev/blog/posts/evals-faq/ ; https://arxiv.org/abs/2503.13657

### Build a mini durable workflow engine (`workflow-engine`, workflows/durable-execution, senior)

1. A step journal keyed by step name with JSON-only results
2. Replay from the top returning saved results
3. A non-determinism check when the step sequence differs from the journal
4. Retries with a policy object and non-retryable errors
5. Idempotency keys from run id and step against a deduplicating fake payment provider
6. Interrupt and resume with an approval value and a timeout branch
7. A per-step token and cost budget that stops the run
8. Crash injection at every boundary asserting one external effect each

Tests: Clock and random injected; tests kill the process at every boundary and count side effects.
Sources: https://docs.temporal.io/workflow-definition ; https://www.inngest.com/docs/learn/how-functions-are-executed ; https://docs.langchain.com/oss/python/langgraph/interrupts ; https://docs.stripe.com/api/idempotent_requests

### Batch extraction pipeline with a review queue (`batch-extraction`, workflows/batch-pipelines, senior)

1. A typed extraction schema and validator
2. A mock model with seeded errors
3. A batch submitter that splits at a request cap, joins on custom_id and handles expired and errored items
4. Confidence from a second verify call
5. Routing below a threshold chosen on a labelled sample to a review queue
6. A cost and accuracy report per document

Tests: Seeded batch results out of order with expiries; tests check reconciliation and review-rate arithmetic.
Sources: https://platform.claude.com/docs/en/build-with-claude/batch-processing ; https://developers.openai.com/api/docs/guides/batch ; https://company.instacart.com/tech-innovation/scaling-catalog-attribute-extraction-with-multi-modal-llms ; https://www.uber.com/blog/advancing-invoice-document-processing-using-genai/

### Build a guarded tool gateway (`secure-tool-gateway`, safety/injection-defences, staff)

1. Label every value with its origin
2. Refuse calls combining untrusted input, private data and an outbound channel (Rule of Two)
3. An egress allowlist
4. Plan-then-execute so untrusted data cannot change the plan
5. A dual-LLM quarantine for untrusted text
6. An attack suite that must all fail

Tests: Attack cases include laundering through summaries and allowlisted upload domains; tests check refusals and that benign tasks still pass.
Sources: https://ai.meta.com/blog/practical-ai-agent-security/ ; https://arxiv.org/abs/2506.08837 ; https://arxiv.org/abs/2503.18813 ; https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/

### Build a permission gate for agent tools (`permission-gate`, security/permissions-identity, senior)

1. Rule matcher with deny before ask before allow
2. Compound-command splitter that refuses unsafe scripts
3. Protected paths no rule can approve
4. Symlink and path normalisation
5. An audit record per decision

Tests: Bypass cases modelled on published CVE classes; tests check every decision and its audit record.
Sources: https://code.claude.com/docs/en/permissions ; https://learn.chatgpt.com/docs/agent-configuration/rules ; https://cveawg.mitre.org/api/cve/CVE-2025-54795 ; https://cveawg.mitre.org/api/cve/CVE-2025-54135

### An egress policy that survives SSRF tricks (`egress-policy`, security/sandboxing-secrets, senior)

1. Scheme allowlist
2. Host allowlist
3. Resolve then pin to defeat DNS rebinding
4. Block private and link-local ranges with the ipaddress module, including IPv4-mapped IPv6 and odd encodings
5. Re-validate every redirect hop
6. Response size cap

Tests: Test cases from the MCP security page's SSRF list; no real network, a fake resolver.
Sources: https://modelcontextprotocol.io/specification/2026-07-28/basic/security_best_practices ; https://code.claude.com/docs/en/sandboxing

### A pickle import allowlist scanner (`pickle-scanner`, security/supply-chain, senior)

1. Walk opcodes with pickletools
2. Collect GLOBAL and STACK_GLOBAL imports
3. Allowlist check
4. Handle broken streams as failures, not passes
5. Report with offsets

Tests: Benign and malicious opcode streams built in the browser; tests include a broken-stream evasion.
Sources: https://huggingface.co/docs/hub/security-pickle ; https://www.reversinglabs.com/blog/rl-identifies-malware-ml-model-hosted-on-hugging-face ; https://cveawg.mitre.org/api/cve/CVE-2025-32434

### Build a continuous batching scheduler (`continuous-batching`, inference/batching, staff)

1. A request queue and iteration-level admission
2. A paged KV block allocator
3. Copy-on-write prefix sharing
4. Chunked prefill under a token budget
5. Preemption by recompute with an order the reader chooses
6. Per-tenant fairness
7. Metrics: time to first token, inter-token latency, throughput

Tests: Invariant tests (no block double-allocated, budget never exceeded, every request finishes) rather than one canonical schedule.
Sources: https://www.usenix.org/conference/osdi22/presentation/yu ; https://arxiv.org/abs/2309.06180 ; https://arxiv.org/abs/2403.02310 ; https://vllm.ai/blog/2025-01-27-v1-alpha-release

### Build a BPE tokenizer (`bpe-tokenizer`, foundations/tokens, senior)

1. Byte-level vocabulary
2. Pair counting
3. Merge loop
4. Encoding by merge rank
5. Decoding and round trip
6. Pre-tokenisation regex and special tokens

Tests: Property tests on round trip and merge order; existing lab extended with special-token handling.
Sources: https://arxiv.org/abs/1508.07909 ; https://github.com/openai/tiktoken/blob/main/tiktoken_ext/openai_public.py
Existing: `src/content/labs/bpe-tokenizer.mdx`

### Build a sampler (`sampler`, foundations/sampling, senior)

1. Stable softmax with temperature
2. Top-k
3. Top-p
4. Min-p
5. Repetition penalty and a seeded sampler with a determinism test

Tests: Property tests on kept mass, cutoff behaviour on flat and peaked distributions, and seeded reproducibility.
Sources: https://arxiv.org/abs/1904.09751 ; https://arxiv.org/abs/2407.01082 ; https://docs.vllm.ai/en/latest/api/vllm/sampling_params.html

### Build an attention block (`attention-block`, foundations/attention, senior)

1. Scaled dot-product attention
2. Causal mask
3. Multi-head attention
4. Grouped-query attention
5. KV-cache decode equal to a full recompute
6. Online softmax normaliser for long rows

Tests: Pure Python or numpy where available in Pyodide; tests compare decode steps with full recompute within tolerance.
Sources: https://arxiv.org/abs/1706.03762 ; https://arxiv.org/abs/2305.13245 ; https://arxiv.org/abs/1805.02867

### Contrastive training on toy vectors (`embedding-training`, foundations/embeddings, staff)

1. In-batch negatives
2. Symmetric CLIP-style loss with temperature
3. A hard-negative miner with range and margin parameters
4. Duplicate-aware batching
5. A test that catches a false negative

Tests: Stdlib Python on toy vectors; tests check loss symmetry and that the miner rejects planted positives.
Sources: https://arxiv.org/abs/2103.00020 ; https://sbert.net/docs/package_reference/sentence_transformer/losses.html ; https://arxiv.org/abs/2407.15831

### Build a mini prompt optimiser (`prompt-optimiser`, llmops/prompt-lifecycle, senior)

1. A metric that returns a score and feedback text
2. Bootstrap few-shot from passing traces
3. Instruction proposals with random search on a dev set
4. A held-out check that catches overfitting
5. Register the winner as a new prompt version with its scores

Tests: Deterministic mock model; tests check that an overfitted candidate is rejected on the held-out set.
Sources: https://raw.githubusercontent.com/stanfordnlp/dspy/main/docs/docs/learn/optimization/optimizers.md ; https://raw.githubusercontent.com/stanfordnlp/dspy/main/docs/docs/api/optimizers/GEPA/overview.md ; https://langfuse.com/docs/prompt-management/data-model

### Release gate and experiment calculator (`release-gate`, llmops/releases-experiments, senior)

1. Paired flip gate
2. Sample size and duration from baseline, minimum effect and traffic
3. Sample ratio mismatch check
4. Clustered standard errors for multi-turn sessions
5. A written ship or no-ship decision with guardrail metrics

Tests: Stdlib Python; tests check the sample-size arithmetic against worked values.
Sources: https://www.anthropic.com/research/statistical-approach-to-model-evals ; https://arxiv.org/abs/2411.00640

### Eval and SFT data pipeline from production logs (`eval-data-pipeline`, llmops/data-curation, senior)

1. Exact dedup by normalised hash
2. Near-dedup using the MinHash module from the training lab
3. Regex and checksum PII detectors with redaction
4. Gate thresholds that fail the batch
5. A split by user with a leakage check

Tests: Toy corpus with planted duplicates and PII; tests check gates and that no user appears on both sides of the split.
Sources: https://arxiv.org/abs/2107.06499 ; https://presidio.dataprivacystack.org/ ; https://docs.nvidia.com/nemo/curator/latest/about/index.html

### Ring all-reduce simulator (`ring-allreduce`, training/distributed, senior)

1. Ranks as lists
2. Reduce-scatter
3. All-gather
4. Compose into all-reduce
5. Count bytes sent per rank
6. Compare with naive gather then broadcast

Tests: Per-rank traffic equals 2(N - 1)/N of the buffer in tests.
Sources: https://nanotron-ultrascale-playbook.static.hf.space/

### Pipeline schedule simulator (`pipeline-schedule`, training/distributed, staff)

1. All-forward-all-backward timeline
2. Bubble fraction
3. 1F1B
4. Peak in-flight activations
5. Interleaved stages
6. Zero-bubble split of backward into input and weight gradients

Tests: Bubble equals (p - 1)/m and (p - 1)/(v m) in tests.
Sources: https://nanotron-ultrascale-playbook.static.hf.space/ ; https://arxiv.org/abs/2104.04473

### Training memory and parallelism planner (`training-memory-planner`, training/distributed, staff)

1. Parameter count from a config
2. 16 versus 20 bytes per parameter
3. ZeRO stages
4. Tensor and pipeline splits
5. Activation estimate with and without recompute
6. Fits on N GPUs?

Tests: Matches hand-computed cases including the Llama 3.1 8B config used by fnd-009.
Sources: https://arxiv.org/abs/1910.02054 ; https://arxiv.org/abs/2205.05198 ; https://huggingface.co/unsloth/Meta-Llama-3.1-8B-Instruct/blob/main/config.json

### MinHash near-dedup (`minhash-dedup`, training/pretraining-data, senior)

1. Shingles
2. Hash family
3. Signatures
4. LSH bands
5. Threshold tuning
6. Line-level frequency filter

Tests: Finds planted near-duplicates and keeps distinct documents.
Sources: https://arxiv.org/abs/2107.06499 ; https://arxiv.org/html/2407.21783

### GRPO on a toy verifiable task (`grpo-toy`, training/rl, staff)

1. Softmax policy over a small action set
2. A verifier
3. Group-relative advantages
4. Clipped ratio
5. Zero-variance groups
6. KL term on and off
7. Length-bias demonstration

Tests: Reward rises; groups where every sample is equal contribute zero gradient.
Sources: https://arxiv.org/abs/2402.03300 ; https://arxiv.org/html/2503.14476 ; https://arxiv.org/abs/2503.20783

### Preference learning by hand (`preference-learning`, training/post-training, senior)

1. Pairwise reward model on toy pairs by gradient descent
2. DPO loss
3. DPO gradient by hand
4. Beta sweep

Tests: Loss equals log 2 when policy equals reference; finite-difference gradient check.
Sources: https://arxiv.org/abs/2305.18290

### Autograd and stable losses (`autograd`, rounds/hand-write, senior)

1. Scalar reverse-mode autograd
2. Matrix operations with broadcasting in backward
3. Stable softmax cross-entropy
4. Gradient check by finite differences
5. Prefix-product backward without division

Tests: Matches finite differences; tests include zeros in the prefix-product input.
Sources: https://github.com/karpathy/micrograd ; https://prachub.com/interview-questions/implement-a-minimal-reverse-mode-autograd-engine-on-pytorch-tensors ; https://prachub.com/interview-questions/hand-written-gradients-prefix-product-backward-pass-and-stable-cross-entropy ; https://prachub.com/interview-questions/implement-and-derive-backprop-from-scratch

### A long-context probe suite (`long-context-probes`, multimodal/long-context, senior)

1. Single needle
2. Multi-needle
3. No-overlap needle
4. Multi-hop chain
5. Aggregation task
6. A report of score by length

Tests: Against a scripted mock model with length-dependent degradation; tests check that the report separates needle from realistic tasks.
Sources: https://github.com/gkamradt/LLMTest_NeedleInAHaystack ; https://arxiv.org/abs/2404.06654 ; https://arxiv.org/abs/2502.05167 ; https://arxiv.org/abs/2410.02694

### A voice turn simulator (`voice-turn`, multimodal/speech-voice, staff)

1. Discrete-event model of capture, network, ASR and endpointing, LLM, TTS and playback
2. Streaming TTS
3. Speculative LLM start on interim transcripts
4. Filler phrases for slow tools
5. Barge-in truncation
6. p50 and p95 report

Tests: Seeded stage distributions; tests check p50 and p95 targets the reader sets, with 1,500 ms as the published reference target.
Sources: https://www.voiceaiandvoiceagents.com ; https://arxiv.org/abs/2410.00037

### HNSW by hand (`hnsw`, rag/vector-systems, senior)

1. Level assignment
2. Greedy search from the top layer
3. Neighbour-selection heuristic
4. Recall against brute force at several efSearch values
5. Add a filter and measure recall
6. Fix with iterative scan or filter-aware traversal

Tests: Recall floor tests at fixed efSearch; filtered recall must recover after the fix.
Sources: https://arxiv.org/abs/1603.09320 ; https://github.com/pgvector/pgvector ; https://arxiv.org/abs/2403.04871

### Progressive-spec in-memory database (`progressive-db`, rounds/llm-app-coding, senior)

1. Set, get and delete
2. Filtered scans
3. TTL with an injected clock
4. Backup and restore
5. Transactions (optional stage)

Tests: Hidden tests per stage with a visible clock; later stages fail designs that did not anticipate them.
Sources: https://www.aced.io/experiences/ramp-ai-engineer-interview-13abb1 ; https://www.hellointerview.com/community/questions/memory-database-sql/cmbsl00wk004v07adwuorveqo ; https://prachub.com/companies/perplexity-ai

### Integration round against a mock service (`integration-round`, rounds/llm-app-coding, senior)

1. Paginate a list endpoint
2. Collect auth headers while crawling
3. Reconcile payments idempotently
4. Retries and partial failure
5. A final report

Tests: Deterministic mock HTTP service in the browser; parts unlock in order.
Sources: https://prachub.com/interview-experiences/stripe-new-grad-software-engineer-interview-experience-rejected-after-ai-coding-and-integration-plus-bug-squash-onsite ; https://www.aced.io/experiences/ramp-ai-engineer-interview-13abb1

### Repository bug squash (`repo-bug-squash`, rounds/codebase-rounds, senior)

1. Load a multi-file package into the in-memory filesystem
2. Reproduce bug one with a failing test
3. Fix bug two in another module
4. Fix bug three that only shows on a resent request
5. Review a PR whose tests pass and list what breaks

Tests: Hidden behaviour tests per bug; original code, not copied from any company exercise.
Sources: https://prachub.com/interview-experiences/stripe-new-grad-software-engineer-interview-experience-rejected-after-ai-coding-and-integration-plus-bug-squash-onsite ; https://prachub.com/interview-experiences/netflix-machine-learning-engineer-interview-experience-ml-fundamentals-plus-a-production-pr-review-rejected

### AI-assisted rate limiter, defended (`ai-assisted-rate-limiter`, rounds/ai-collab-coding, senior)

1. Read an assistant-written token bucket
2. Write boundary tests with an injectable clock
3. Find the seeded race
4. Fix and add a concurrency test
5. Write the multi-server and store-outage design notes

Tests: Seeded clock and race bugs; tests must fail on the original and pass on the fix.
Sources: https://prachub.com/interview-questions/design-and-implement-a-rate-limiter-with-an-ai-assistant-then-defend-and-test-it ; https://www.hellointerview.com/blog/meta-ai-enabled-coding

### Notebook data round: receipt reconciliation (`notebook-reconciliation`, rounds/take-home-debug, senior)

1. Load receipts and transactions
2. Match by amount, date and merchant
3. Measure precision and recall of the matcher
4. Improve with a learned or fuzzy match
5. Report what remains unmatched

Tests: Synthetic data with known matches; tests check precision and recall arithmetic.
Sources: https://www.aced.io/experiences/ramp-ai-engineer-interview-13abb1

## Playbooks

| slug | where | level | decision |
|---|---|---|---|
| domain-retrieval-playbook | foundations/embeddings | senior | When retrieval fails on a domain, three levers compete for the same budget and each fixes a different failure. |
| migration-playbook | foundations/model-landscape | senior | A new model version arrives with a retirement deadline for the old one (Anthropic gives at least 60 days of notice), so holding is also a decision with a date. |
| framework-playbook | apis/frameworks | senior | The decision is which abstractions you are willing to debug at 2 a.m. |
| check-playbook | evals/llm-judge | senior | Each check type has a cost per item and an error profile, and the cheapest check that catches the failure wins. |
| workflow-or-agent | workflows/patterns | senior | The decision is who owns control flow for each step: code, or the model. |
| step-budgets | workflows/retries-flow-control | senior | Per-run caps exist on most platforms; per-step budgets are what keep one slow or expensive step from eating the run. |
| low-code-playbook | workflows/operating-workflows | staff | n8n, Dify, Flowise and Zapier Agents are chosen on durability, testing, versioning, review, tenancy and licence, not on taste. |
| parsing-routes | rag/ingestion | senior | Documents can be parsed to text, parsed by a vision-language model, or retrieved as page images, and each route has different failure modes and costs. |
| filtered-search | rag/vector-systems | staff | Pre-filtering, post-filtering, filter-aware traversal, iterative scans and per-tenant partitions fail at different selectivities. |
| tool-set-playbook | harness/tools-aci | staff | A coding agent can run on bash alone (mini-swe-agent), on bash plus a string-replace editor (the two tools in the Claude 4 SWE-bench scaffold), on a broad built-in set (Claude Code), or with code as the action space. |
| where-knowledge-lives | harness/context-management | senior | The decision is where a piece of knowledge or policy lives, and the inputs are whether it applies to every task, whether it is a procedure, whether it must be enforced and what it costs in context every turn. |
| runaway-controls | harness/cache-cost-latency | senior | Turn caps, dollar caps, auto-mode fallbacks after repeated denials, a cap on consecutive Stop-hook blocks and per-instance budgets each stop a different runaway. |
| shipping-harness-changes | harness/evaluating-harnesses | staff | Anthropic's April 2026 postmortem describes three harness changes (a lower default effort, a thinking-clearing bug that also caused cache misses, and a verbosity line that cost 3% on a broad eval) that each passed review, tests or dogfooding. |
| pick-the-pattern | safety/injection-defences | staff | The decision is which pattern and which rate-lowering layers a given agent gets, and the inputs are the trifecta legs present, whether actions are reversible, and the residual rate the business accepts in writing. |
| threat-model-to-tests | security/secure-architecture | staff | An email and calendar assistant with a send tool and a fetch tool is taken through five artefacts: a data-flow diagram, a per-session capability table scored on the Rule of Two and the lethal trifecta, an architecture change that removes one leg per session, a control per boundary labelled as holding by construction or lowering a rate, and a test per control. |
| isolation-playbook | security/sandboxing-secrets | staff | seccomp filters system calls and the kernel docs say it is not a sandbox on its own; Landlock lets unprivileged processes restrict their own filesystem and network access; containers share the host kernel, as runc's CVE-2024-21626 escape shows; gVisor implements the Linux interface in user space at a compatibility and per-syscall cost; Firecracker microVMs boot to guest init within 125 ms under its stated test conditions and do no network filtering of their own. |
| incident-response | security/security-ops | staff | The CoSAI framework aligns with NIST SP 800-61 Rev. |
| red-team-programme | security/security-ops | staff | A programme defines scope, threat actors, adaptive attackers as the default, what counts as a finding, severity, regression capture and disclosure. |
| soc2-iso42001 | security/governance | staff | As of the CSA note of 30 August 2026 there are no AI-specific SOC 2 trust services criteria, so auditors map AI controls onto existing criteria and requests vary by firm; ISO/IEC 42001 certifies a management system, not a model. |
| kv-compression | inference/inference-anatomy | staff | Four families fail differently: architectural (GQA, MQA, MLA, hybrid linear layers, fixed at training time), eviction (H2O, SnapKV), quantisation (KIVI at 2 bits with keys per channel and values per token) and top-k sparse attention (DeepSeek's DSA). |
| prompt-registry | llmops/prompt-lifecycle | senior | A prompt is a deployable artefact with a version, an owner, a test suite and a rollout, and in Langfuse's model every edit is an immutable version fetched by a label that rollback simply moves. |
| release-ladder | llmops/releases-experiments | senior | Offline gate, shadow, canary, A/B and full rollout each have an entry condition, a measurement, a cost and an exit rule, and only the A/B test measures outcome metrics causally. |
| feedback-loops | llmops/monitoring-feedback | senior | Explicit feedback (thumbs, regenerate) and implicit feedback (accept, edit, abandon, escalate) are filters for which traces to read, not metrics or rewards without controls. |
| should-we-fine-tune | llmops/fine-tuning | senior | Fine-tuning fixes format, style, narrow skills and cost; it loses to retrieval for knowledge (Ovadia et al.), and fine-tuning on facts the model does not know raises hallucination as those examples are learned (Gekhman et al.). |
| build-vs-buy | llmops/economics-selection | senior | Three decisions get blurred: buy an AI product or build the feature, call an API or self-host weights, and train or adapt. |
| selection-licences | llmops/economics-selection | senior | Selection is evals plus constraints, and the constraints include licence clauses: Llama 4's licence requires a separate licence above 700 million monthly active users, attribution and Llama-prefixed names for derivatives, while Gemma's terms reserve the right to restrict use and Apache 2.0 or MIT models carry no such clauses. |
| staff-strategy | llmops/platform-strategy | staff | Staff questions are about portfolio, platform and risk rather than prompts: which use cases first, which primitives to share, who decides, and what leadership will measure. |
| size-the-run | training/compute-scaling | staff | The inputs are target quality, expected inference volume, GPU count and type, and the deadline; the options are compute-optimal dense, inference-optimal smaller and longer, or MoE at a chosen sparsity. |
| profiling-playbook | training/gpu-kernels | staff | Profiling is an experiment: baseline, controlled changes, variance reduction, stop criteria, attribution and a correctness gate. |
| composing-parallelism | training/distributed | staff | The order of decisions is fit one replica, reach the global batch, then maximise throughput, with TP inside nodes and PP or ZeRO-3 across them, and PP and ZeRO-3 rarely together. |
| not-enough-tokens | training/pretraining-data | staff | After aggressive filtering the options are relaxing filters, repeating epochs, rephrasing, synthesising or distilling, each with a cost and a risk. |
| media-token-costs | multimodal/vision-language | senior | Claude counts one visual token per 28-pixel patch with caps by tier, OpenAI's patch models count 32-pixel patches with a multiplier and its tile models charge a base plus a cost per 512-pixel tile, and Gemini charges 258 tokens per small image or per 768-pixel tile, 32 tokens per second of audio and documents video at more than one rate. |
| pipeline-vs-s2s | multimodal/speech-voice | senior | A cascaded ASR, LLM and TTS pipeline gives control, tool use and logging per stage, while speech-to-speech models give lower latency and prosody at the cost of observability and per-minute pricing. |
| build-and-defend | rounds/take-home-debug | senior | Sierra's April 2026 loop removed coding and algorithm rounds and runs Plan (define a product), Build (two hours alone with any AI tools) and Review (demo, code review of the data model and abstractions, path to production and how AI was used); candidates report day-long builds at Cursor and few-hour builds at Cognition. |
| fde-decomposition | rounds/customer-craft | staff | A vague enterprise brief becomes scope, a success metric, a data-access plan, a hosting choice, compliance questions and a two-week plan. |
| project-deep-dive | rounds/deep-dives | senior | Deep dives probe alternatives considered, your part versus the team's, the measured result and what you would undo, and formats range from a 30-minute presentation (reported at OpenAI) to a five-minute recorded walkthrough (Cognition) and a short technical talk (Sierra). |
| loop-atlas | rounds/behavioural | senior | One page per role family (applied AI and FDE, research engineer, ML infra, AI security, software engineer at AI companies) shows rounds, the AI policy per round and level signals, with every row labelled official, press, candidate or vendor and a last-checked date. |

## Paper walkthroughs

| slug | where | level | papers | why |
|---|---|---|---|---|
| flashattention | foundations/attention | senior | https://arxiv.org/abs/2205.14135 ; https://arxiv.org/abs/2307.08691 ; https://arxiv.org/abs/2407.08608 | FlashAttention is exact and does more arithmetic than the naive kernel, and wins by tiling in on-chip memory and recomputing in the backward pass to cut HBM reads. FlashAttention-2 reports 50 to 73% of A100 peak and FlashAttention-3 adds Hopper warp specialisation and FP8 with block quantisation. What changed in practice is that attention cost discussions must be about IO, and the walkthrough ends with what to say when asked whether it is an approximation. |
| sagas | workflows/durable-execution | staff | https://doi.org/10.1145/38713.38742 ; https://docs.dbos.dev/python/tutorials/workflow-tutorial | Garcia-Molina and Salem split a long-lived transaction into steps with compensating actions so partial progress can be undone without holding locks. Model-driven workflows call external systems that share no transaction, and some actions (an email, a payout) can only be compensated or gated before they happen. The walkthrough covers forward and backward recovery, compensation order, and what to say when a step has no compensation: put the approval before it. |
| late-interaction | rag/advanced-rag | staff | https://arxiv.org/abs/2004.12832 ; https://arxiv.org/abs/2112.01488 ; https://arxiv.org/abs/2205.09707 ; https://arxiv.org/abs/2405.19504 | ColBERT keeps one vector per token and scores with MaxSim, and the storage blow-up is what decides whether late interaction is affordable. ColBERTv2 cuts the footprint with residual compression, PLAID cuts search latency, and MUVERA reduces multi-vector search to single-vector MIPS. The walkthrough ends with the storage arithmetic for a stated corpus and what to say when asked whether late interaction is worth it. |
| mast | agents/multi-agent | senior | https://arxiv.org/abs/2503.13657 | MAST classifies multi-agent failures into specification, inter-agent misalignment and verification failures from annotated traces. Most failures it records are design failures rather than model errors, which is why adding agents rarely fixes them. The walkthrough ends with coding a set of traces against the taxonomy. |
| swe-agent | harness/harness-anatomy | senior | https://arxiv.org/abs/2405.15793 ; https://arxiv.org/html/2405.15793v3 | SWE-agent treats the model as a new kind of user that needs purpose-built interfaces: search capped at 50 results, a 100-line file viewer, an edit command guarded by a linter, old observations collapsed, and a $4 per-instance budget. Its ablations on SWE-bench Lite with GPT-4 Turbo are the payload: 18.0% with the full interface, 15.0% without the linter, 10.3% with no edit command, and lower scores with a 30-line window or the whole file. What to say in an interview is which of these choices still matter with stronger models and how you would measure it. |
| minimal-harness | harness/harness-anatomy | staff | https://github.com/SWE-agent/mini-swe-agent ; https://arxiv.org/abs/2402.01030 ; https://arxiv.org/abs/2407.01489 | mini-swe-agent is about 100 lines for the agent class, uses only bash with linear history, and runs each action as an independent subprocess, which makes swapping in a container trivial. CodeAct argues for code as the action space and Agentless replaces the loop with a fixed localise, repair and validate pipeline. The interview point is how much harness a strong model needs and what you lose by deleting it, with the caveat that scores across these papers use different models. |
| context-resets | harness/context-management | staff | https://www.anthropic.com/engineering/harness-design-long-running-apps | Anthropic's 2026-03-24 harness-design post found Sonnet 4.5 wrapping up early as it neared its believed limit, which made full resets with a structured handoff necessary; with Opus 4.5 the resets were dropped and automatic compaction was enough. The general lesson is that harness components encode assumptions about one model and must be re-tested per model. The walkthrough ends with how you would detect such an assumption before it ships. |
| classifier-approvers | harness/permissions-sandboxing | staff | https://www.anthropic.com/engineering/claude-code-auto-mode ; https://cursor.com/docs/agent/security/run-modes ; https://learn.chatgpt.com/docs/sandboxing/auto-review | Anthropic's auto-mode post reports a two-stage classifier that sees user messages and tool calls with tool results stripped, a 0.4% false-positive rate on 10,000 real actions, and a 17% false-negative rate on 52 real overeager actions, and calls it not a drop-in replacement for careful review on high-stakes infrastructure. Cursor says its Auto-review is not a security boundary and Codex auto-review never widens the sandbox. The walkthrough ends with what you put around an approver that misses one dangerous action in six. |
| generator-evaluator | harness/verification | staff | https://www.anthropic.com/engineering/harness-design-long-running-apps | Anthropic's 2026-03-24 harness post found self-evaluation lenient and Claude a poor QA agent out of the box, then built a separate evaluator with few-shot score breakdowns, Playwright against the running app and hard thresholds per criterion. Sprint contracts were negotiated in files, and the planner and evaluator survived after a newer model made sprints unnecessary. The walkthrough ends with how you would know your evaluator is stricter than your generator. |
| parallel-attempts | harness/verification | staff | https://arxiv.org/abs/2407.21787 ; https://www.anthropic.com/news/claude-4 | Large Language Monkeys raised SWE-bench Lite coverage from 15.9% with one sample to 56% with 250, and found voting and reward models plateau without automatic verifiers. Claude 4's parallel test-time compute sampled attempts, discarded patches that failed visible tests and picked with a scoring model, lifting Opus 4 from 72.5% to 79.4%. The point is that selection needs a verifier and that high-compute numbers are a different quantity from pass@1. |
| parallel-no-orchestrator | harness/long-running-parallel | staff | https://www.anthropic.com/engineering/building-c-compiler ; https://code.claude.com/docs/en/best-practices ; https://cognition.com/blog/dont-build-multi-agents | The C compiler build ran 16 Claude instances in containers against a bare git upstream, claimed tasks with lock files resolved by git conflicts and used no orchestration agent, with specialised roles for dedupe, performance and docs. The walkthrough compares it with Claude Code worktrees and batch fan-out into separate PRs, and with Cognition's argument against splitting context. What to say in an interview is which coordination primitive you would trust and why. |
| design-patterns-paper | safety/injection-defences | staff | https://arxiv.org/abs/2506.08837 ; https://simonwillison.net/2023/Apr/25/dual-llm-pattern/ | The design-patterns paper gives action-selector, plan-then-execute, LLM map-reduce, dual LLM, code-then-execute and context-minimisation, each trading a specific utility for a specific guarantee. The walkthrough builds a toy executor per pattern and shows which attack each one stops. What to say in an interview is the utility you gave up and why it was acceptable. |
| poisoning-paper | security/supply-chain | staff | https://www.anthropic.com/research/small-samples-poison ; https://arxiv.org/abs/2401.05566 ; https://artificialintelligenceact.eu/article/15/ | Anthropic, the UK AI Security Institute and the Alan Turing Institute found that 250 poisoned documents backdoored models from 600M to 13B parameters with a denial-of-service trigger, while 100 were not enough, and the authors caution that the backdoor was narrow and low-stakes. Sleeper Agents found backdoors persisting through SFT, RL and adversarial training. The walkthrough ends with what this means for training on scraped or user data and what to say when asked how much poisoned data is needed. |
| gepa | llmops/prompt-lifecycle | staff | https://arxiv.org/abs/2507.19457 ; https://raw.githubusercontent.com/stanfordnlp/dspy/main/docs/docs/api/optimizers/GEPA/overview.md | GEPA reports beating GRPO by 6% on average and up to 20% with up to 35 times fewer rollouts across six tasks, and beating MIPROv2 by over 10%, all as the authors' own results. The mechanism is natural-language reflection on full trajectories plus a Pareto frontier of candidates that each win on some example. The walkthrough ends with the DSPy usage, where the metric must return feedback text, and with the conditions a reviewer should attach to the headline. |
| lora-learns-less | llmops/fine-tuning | senior | https://arxiv.org/abs/2405.09673 ; https://thinkingmachines.ai/blog/lora/ | Biderman et al. found LoRA substantially underperforms full fine-tuning on code and maths in standard low-rank settings while forgetting less, and that full fine-tuning learns perturbations of 10 to 100 times higher rank. Read with LoRA Without Regret, the conditions are clear: LoRA matches full fine-tuning on small and medium SFT and RL when applied to all layers with a higher learning rate. The walkthrough ends with how to answer "LoRA or full fine-tune?" with conditions instead of a slogan. |
| new-knowledge | llmops/fine-tuning | senior | https://arxiv.org/abs/2405.05904 ; https://arxiv.org/abs/2312.05934 | Gekhman et al. found that examples introducing knowledge the model lacks are learned more slowly and, once learned, increase hallucination roughly linearly. This is why "fine-tune it on our docs" is the wrong tool for facts that change, and why retrieval wins for knowledge. The walkthrough ends with how to explain this to a product manager in two minutes. |
| chinchilla-replicated | training/compute-scaling | staff | https://arxiv.org/abs/2404.10102 ; https://arxiv.org/abs/2203.15556 | Besiroglu et al. found Chinchilla's parametric fit does not fit the extracted data, its intervals are implausibly narrow, and a re-fit agrees with the paper's other two methods. The walkthrough covers what that means for the 20x rule and for anyone extrapolating from small runs. It ends with the interview answer to "how sure are you about 20 tokens per parameter". |
| fp8-deepseek | training/numerics | staff | https://arxiv.org/html/2412.19437v2 ; https://arxiv.org/abs/2209.05433 ; https://developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/ | DeepSeek-V3 ran FP8 GEMMs for forward and both backward passes with 1x128 activation tiles, 128x128 weight blocks and promotion to FP32 every 128 elements, kept embeddings, the output head, gating, norms and attention in higher precision, and reported relative loss error under 0.25% against BF16. The walkthrough compares per-tensor scaling with E4M3 and E5M2 formats. It ends with what "we trained in FP8" should make an interviewer ask. |
| sparsity-knob | training/moe | staff | https://arxiv.org/html/2507.20534 | Kimi K2 fit a sparsity scaling law and chose 384 experts with 8 active, reporting fewer FLOPs than lower sparsity at the same validation loss, and kept 64 attention heads because doubling them would add substantial inference FLOPs at long context. The walkthrough reads the paper as a set of trade-offs between training and serving cost. It ends with what you would ask before copying the configuration. |
| grpo-family | training/rl | staff | https://arxiv.org/abs/2402.03300 ; https://arxiv.org/abs/2503.20783 ; https://arxiv.org/html/2503.14476 ; https://arxiv.org/abs/2507.18071 ; https://huggingface.co/docs/trl/main/en/grpo_trainer | GRPO uses group-relative advantages, so a group where every sample is correct contributes zero gradient; Dr. GRPO removes a length bias; DAPO adds clip-higher, dynamic sampling, token-level loss and overlong shaping and drops the KL term, reaching 50 on AIME 2024 with Qwen2.5-32B in half the steps of the R1-Zero baseline; GSPO moves to a sequence-level ratio for MoE stability. TRL's current defaults encode several of these choices (no KL term, a DAPO loss type). The walkthrough ends with which choice you would make for a stated task and why. |
| yarn | multimodal/long-context | staff | https://arxiv.org/abs/2309.00071 ; https://arxiv.org/html/2508.10925 ; https://huggingface.co/Qwen/Qwen3-8B | Position Interpolation left high-frequency dimensions with too little local resolution, and YaRN answers with a per-frequency ramp and an attention temperature term. gpt-oss extends dense layers to 131,072 tokens with YaRN and Qwen3 documents a factor-4 YaRN block. The walkthrough ends with the answer to "why not just raise the base". |
| attention-sinks | multimodal/long-context | senior | https://arxiv.org/abs/2309.17453 ; https://arxiv.org/html/2508.10925 | StreamingLLM showed window attention collapses once the first tokens are evicted because heads park attention on them even when they are not semantically important, and keeping those few KV entries restores quality over very long streams. gpt-oss builds the idea into the model with a learned per-head bias in the softmax denominator. The engineering consequence is that any KV eviction policy must pin the sink tokens. |
| mla | multimodal/architectures | staff | https://arxiv.org/abs/2405.04434 ; https://huggingface.co/deepseek-ai/DeepSeek-V3/blob/main/config.json | DeepSeek-V2 compresses keys and values into a shared latent, caches the latent and keeps a small decoupled RoPE key because rotation does not commute with the absorbed projection. It reports a 93.3% smaller KV cache against DeepSeek 67B, a dense multi-head model, which is why the baseline must be stated whenever the figure is used. The walkthrough computes bytes per token for MHA, GQA-8 and MLA from published configs. |
| dit | multimodal/generation | senior | https://arxiv.org/abs/2212.09748 ; https://arxiv.org/abs/2403.03206 | DiT replaces the U-Net in latent diffusion with a transformer over latent patches and reports FID 2.27 on ImageNet 256, with quality improving as compute per image grows. Stable Diffusion 3 extends the idea with separate weights per modality and rectified flow. The walkthrough ends with what the move to transformers changed for serving (batching, parallelism, the same kernels as language models) and what to say when asked to explain a recent generation paper. |

## Formats

### Progressive build lab with tests (`lab`)

One program grown over 5 to 10 steps; each step adds a capability and its tests; the next unlocks when tests pass.

- Why: Forces production rather than recognition and is spaced by construction; CodeCrafters and Exercism use tests as the definition of done.
- Feasibility: Feasible now. Needs LabRunner, a deterministic mock LLM module loaded by the Pyodide worker, the Emscripten in-memory filesystem for multi-file labs, and persisted code per lab. Timeouts use worker terminate-and-restart because interrupts need cross-origin isolation, which breaks the sign-in popup. Tests must check behaviour, never internal names: OpenAI found at least 59.4% of an audited SWE-bench Verified subset rejected correct solutions.
- Items: All labs in kinds.labs
- Sources: https://app.codecrafters.io/courses/claude-code/overview ; https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/ ; https://pyodide.org/en/stable/usage/keyboard-interrupts.html ; https://web.dev/articles/coop-coep

### Teardown of a real system with an annotated trace (`teardown`)

One page per named system from public sources: what it is, a diagram, one request traced, context strategy, permissions, cost, failure modes, and what is not public.

- Why: The SRE book's "reverse engineering a production service" class in reading form; design rounds probe how real systems made trade-offs.
- Feasibility: Feasible. Needs Diagram and Trace components and one trace JSON format close to the OpenTelemetry GenAI conventions so teardowns, replays and trace problems share data; the validator should require a "not public" section.
- Items: All teardowns in kinds.teardowns
- Sources: https://sre.google/sre-book/accelerating-sre-on-call/ ; https://github.com/open-telemetry/semantic-conventions-genai

### Incident replay (`replay`)

The reader steps through a recorded timeline and commits to a hypothesis at marked checkpoints before the next event appears; the reveal is the operator's published postmortem.

- Why: Google SRE's Wheel of Misfortune re-enacts postmortems; it trains diagnosis under ambiguity, which debug rounds test.
- Feasibility: Feasible as an extension of AgentTrace with a hypothesis pick per checkpoint (gradable) and free text (local only). Every event carries its source URL. The Replit database-deletion replay waits until both primary accounts are read.
- Items: Anthropic three-bug postmortem (Aug to Sep 2025); GPT-4o sycophancy rollback (Apr 2025); Anthropic April 2026 harness postmortem; GitHub MCP toxic agent flow; Supabase MCP service-role trifecta; Amazon Q Developer 1.84.0
- Sources: https://sre.google/sre-book/postmortem-culture/ ; https://www.anthropic.com/engineering/a-postmortem-of-three-recent-issues ; https://simonwillison.net/2025/May/2/what-we-missed-with-sycophancy/ ; https://www.anthropic.com/engineering/april-23-postmortem ; https://invariantlabs.ai/blog/mcp-github-vulnerability ; https://simonwillison.net/2025/Jul/6/supabase-mcp-lethal-trifecta/ ; https://aws.amazon.com/security/security-bulletins/AWS-2025-015/

### Design critique (`critique`)

A flawed artefact (design, config, prompt, tool list, code) with planted flaws; the reader lists flaws in free text, then ticks a checklist.

- Why: Review is how senior engineers spend their time; writing before seeing the checklist is short-answer retrieval with feedback.
- Feasibility: Feasible now with the checklist component in SPEC; show the number of planted flaws up front; every checklist item cites a source.
- Items: critique problems across all tracks
- Sources: https://www.gwern.net/docs/spaced-repetition/2007-kang.pdf

### Workflow design with a checklist and an optional simulator (`workflow`)

A business process plus constraints; the reader designs steps, state, retries, idempotency, approvals, budgets and rollout, then checks against a checklist.

- Why: This is the form in which "build an AI workflow" is asked in loops.
- Feasibility: Checklist grading is feasible now. The optional simulator needs a JSON workflow schema and a TypeScript interpreter with fault injection (a tool 500, a timeout, a duplicate delivery), which turns part of the self-rating into a graded result.
- Items: workflow problems across all tracks
- Sources: https://www.anthropic.com/engineering/building-effective-agents

### Timed mock loop (`mock-loop`)

A seeded, timed run of problems shaped like a real loop per role preset, ending in a self-graded summary.

- Why: Time pressure and switching between round types are what full mocks add; the evidence on mocks is observational, so no pass-rate claims.
- Feasibility: Feasible once the bank fills the presets: the ML-infra and research-engineer presets need the training track, the security preset needs the security track, and the behavioural slot needs at least 12 behavioural problems (this plan has more). Each preset in loops.ts cites its source and carries an AI-allowed flag per slot.
- Items: Presets: applied AI engineer, FDE, ML infra, research engineer, AI security, software engineer at an AI company
- Sources: https://interviewing.io/blog/how-know-ready-interview-faang ; https://sierra.ai/blog/the-ai-native-interview ; https://www.hellointerview.com/blog/meta-ai-enabled-coding ; https://www.anthropic.com/candidate-ai-guidance

### Paper walkthrough with a runnable number (`paper`)

Problem, mechanism in engineering terms, the key number, a Pyodide cell that reproduces a toy version of it, what changed in practice, and what to say in an interview.

- Why: Reproducing the number is production; reading the abstract is not.
- Feasibility: Feasible; state the paper's licence before reproducing any figure.
- Items: All papers in kinds.papers
- Sources: https://pubmed.ncbi.nlm.nih.gov/26173288/

### Annotated code reading (`code-reading`)

A permissively licensed file with margin notes; the reader answers "what happens if" questions about lines before notes reveal.

- Why: Developers read more code than they write and are rarely taught to read it (Code Reading Club).
- Feasibility: Feasible with a code viewer with line anchors; pin a commit hash and show licence and copyright beside every excerpt; no excerpts from unlicensed repositories.
- Items: mini-swe-agent agent class (MIT); Codex CLI approval code (Apache-2.0); LangGraph checkpointer interfaces (MIT); vLLM scheduler (Apache-2.0); micrograd engine (MIT)
- Sources: https://codereading.club/ ; https://github.com/SWE-agent/mini-swe-agent ; https://github.com/openai/codex ; https://github.com/karpathy/micrograd

### Numbers-to-know cards with FSRS (`cards`)

One fact per card with a source, a date checked and an expiry; typed recall; the scheduler reviews cards, not lessons.

- Why: Spaced, typed retrieval is the best-supported technique for retention; Anki and Execute Program review small items.
- Feasibility: Needs a cards collection with source, checked and expires fields, FSRS state per item (ts-fsrs, MIT), a progress-shape change and a Firestore rules change, and a stale-card report in validate-content.
- Items: Seed deck from the "numbers and facts" sections of the gap research
- Sources: https://github.com/open-spaced-repetition/srs-benchmark ; https://github.com/open-spaced-repetition/ts-fsrs ; https://docs.ankiweb.net/deck-options.html ; https://www.executeprogram.com/why-ep

### Decision playbook (`playbook`)

The decision, the inputs that change it, options with the conditions under which each wins, a worked case and what to measure after.

- Why: Staff rounds probe judgement under constraints; playbooks give the structure that critiques and workflow problems then test.
- Feasibility: Feasible now with the playbook skeleton in SPEC; each playbook links to at least one critique and one workflow problem.
- Items: All playbooks in kinds.playbooks
- Sources: https://www.hellointerview.com/blog/the-system-design-interview-what-is-expected-at-each-level

### Dated "what changed" pages (`what-changed`)

One page per quarter listing changes with a date, a status (draft, current, deprecated, removed) and the lessons each change affects.

- Why: Interviewers ask about current practice and the field moves faster than lessons; MDN Baseline is a working model of a dated status.
- Feasibility: Needs a changes collection and a build check that flags lessons older than an affecting change.
- Items: MCP 2026-07-28 revision; OpenTelemetry GenAI conventions moved repositories; SWE-bench Verified no longer reported by OpenAI; OpenAI self-serve fine-tuning wind-down; Gemini CLI to Antigravity CLI; Cursor search without stored embeddings
- Sources: https://web.dev/baseline ; https://modelcontextprotocol.io/specification/versioning ; https://github.com/open-telemetry/semantic-conventions-genai ; https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/ ; https://developers.openai.com/api/docs/deprecations ; https://developers.googleblog.com/en/an-important-update-transitioning-gemini-cli-to-antigravity-cli/ ; https://cursor.com/docs/agent/tools/search

### Predict, explain the gap, then reveal (`predict-explain`)

Keep Predict blocks, then ask for one sentence on why the guess was off before the explanation shows.

- Why: Prediction with self-explanation improved recall (Kim et al.), and short answers with feedback beat recognition (Kang et al.).
- Feasibility: Feasible: a text box in Predict stored locally and never sent anywhere. Predictions must be derivable from inputs on the page, not recall of a vendor figure.
- Items: Every lesson
- Sources: https://idl.uw.edu/papers/explaining-the-gap ; https://www.gwern.net/docs/spaced-repetition/2007-kang.pdf

### Problem-first module order (`problem-first`)

Each module opens with one problem the reader attempts before the lessons, then teaches, then returns to it.

- Why: Problem solving before instruction beat instruction first for adults in a meta-analysis of 53 studies (Hedges' g 0.36), and guidance that helps novices can stop helping experts.
- Feasibility: Feasible as a module-page change: mark one problem per module as the opener.
- Items: One opener per module
- Sources: https://www.x-mol.com/paper/1406031499744456704 ; https://typeset.io/pdf/the-expertise-reversal-effect-5y3mqyx7oo.pdf

### Short-answer recall before reveal (`short-answer`)

Concept and design problems ask for a typed answer before the worked answer and checklist appear.

- Why: A short-answer quiz with feedback beat MCQ and re-reading three days later; MCQ without feedback did not beat re-reading.
- Feasibility: Feasible with a local text box; self-rated from the checklist; never counted as graded.
- Items: concept, design, critique and workflow problems
- Sources: https://www.gwern.net/docs/spaced-repetition/2007-kang.pdf ; https://pubmed.ncbi.nlm.nih.gov/26173288/

### Progressive multi-stage coding problems (`multistage`)

One coding problem with three or four stages, each adding requirements and hidden tests, with a visible clock.

- Why: This is the dominant 2026 coding format reported at Anthropic, OpenAI, Ramp and Perplexity.
- Feasibility: Feasible in Pyodide with stage-gated hidden tests; counts as gradable per stage.
- Items: multistage problems in rounds and inference
- Sources: https://www.aced.io/experiences/ramp-ai-engineer-interview-13abb1 ; https://prachub.com/companies/perplexity-ai ; https://www.hellointerview.com/guides/openai/l5

### Repository problems (`repo`)

A multi-file package with seeded bugs or a diff to review.

- Why: Bug squash, PR review and code comprehension rounds are reported at Stripe, Netflix, Meta, Sierra and Google.
- Feasibility: Feasible with the Emscripten in-memory filesystem and a file tree view; fix problems are graded by hidden behaviour tests, review problems by checklist.
- Items: repo problems in rounds
- Sources: https://prachub.com/interview-experiences/stripe-new-grad-software-engineer-interview-experience-rejected-after-ai-coding-and-integration-plus-bug-squash-onsite ; https://prachub.com/interview-experiences/netflix-machine-learning-engineer-interview-experience-ml-fundamentals-plus-a-production-pr-review-rejected ; https://sierra.ai/blog/the-ai-native-interview

### Timed work samples (`worksample`)

A brief, a planning window, a timed build with any tools the reader chooses, then review questions.

- Why: Sierra, Cursor and Cognition run build-and-defend loops; the review is where seniority shows.
- Feasibility: Feasible as a timed page with a rubric checklist; the build happens in the reader's own environment; self-rated only.
- Items: worksample problems in rounds
- Sources: https://sierra.ai/blog/the-ai-native-interview ; https://www.aced.io/experiences/cursor-software-engineer-interview-a9c32f ; https://officechai.com/ai/cognition-ceo-scott-wu-explains-why-they-let-people-use-as-much-ai-as-they-like-in-job-interviews

### Presentations and deep dives (`presentation`)

A prepared talk or project walkthrough followed by a probe list the reader answers aloud or in writing.

- Why: Project presentations, paper presentations and short recorded walkthroughs are reported at OpenAI, Cohere, Cognition and Sierra.
- Feasibility: Feasible as a probe list with a timer; any recording stays on the reader's device; self-rated.
- Items: presentation problems in rounds, system-design and llmops
- Sources: https://www.hellointerview.com/guides/openai/l5 ; https://www.aced.io/experiences/cohere-staff-machine-learning-engineer-interview-b49af6 ; https://www.aced.io/experiences/cognition-ai-senior-forward-deployed-engineer-interview-d1e586

### Follow-up chains (`follow-up-chain`)

The interviewer adds a constraint after each answer; the reader answers each stage before the next constraint appears.

- Why: DeepMind ML screens and OpenAI design rounds are reported to add constraints mid-conversation.
- Feasibility: Feasible as a staged reveal inside existing design and concept problems; self-rated per stage.
- Items: staff design problems
- Sources: https://www.teamblind.com/post/deepmind-research-engineer-interview-process-wp1gjgyb ; https://www.hellointerview.com/guides/openai/l5

### Deterministic mock LLM (`mock-llm`)

A scripted policy keyed on the last message, with fault modes (malformed tool call, refusal, loop), shipped as a Python module the worker loads.

- Why: Labs, trace problems and app-coding rounds need a model without an API key or a network.
- Feasibility: Feasible; one module shared by all labs; outputs deterministic so tests are stable.
- Items: Used by harness, workflow, eval, prompt-optimiser and RAG labs
- Sources: https://pyodide.org/en/stable/usage/packages-in-pyodide.html

## Level bar (binding for every lesson and problem)


**reader**

- The reader is a senior or staff software engineer who has shipped production systems and called a model API in production at least once.
- Never define or explain by analogy: queues, backpressure, idempotency keys, retries with jitter, circuit breakers, token buckets, caches and cache keys, consistent hashing, Little's law, percentiles, head-of-line blocking, at-least-once versus exactly-once delivery.
- Never define: indexes and query plans, inverted indexes, ACLs and row-level security, transactions, tombstones, schema migration, HTTP status semantics, SSE and WebSockets, OAuth bearer tokens and audience, JSON Schema, pagination.
- Never define: unit, integration, property-based, differential and replay tests, fixtures, canaries, shadow traffic, A/B assignment by stable hash, base rates, precision and recall, confidence intervals, paired versus unpaired comparisons, the binomial distribution, p-values.
- Never define: floating-point non-associativity, memory bandwidth versus FLOPs, GiB versus GB, or ML vocabulary at the definitional level (token, embedding, cosine similarity, attention, softmax, temperature, fine-tuning, loss). Teach how these are implemented and what they cost.
- Never explain interview mechanics (what a design round or take-home is, STAR, clarifying before drawing).
- If a sentence would be removed from a design document written for a staff engineer on the team, remove it from the lesson.

**lesson**

- Open on the decision or mechanism, not on a scenario about a junior engineer. At most one scenario per track, and only a real public incident with a source.
- Name the systems analogy in a clause and move on to the difference; never explain the analogy's source.
- Spend words on what the reader lacks: published numbers with their conditions, what changed in the last 18 months and why, failure modes seen in production, and the decision procedure.
- Every Predict block asks for a number the reader can derive from inputs on the page (a KV size, a p-value, a break-even), never recall of a vendor percentage.
- Carry one "In the room" question at staff level: a decision under at least two conflicting constraints with a deadline or budget, and a follow-up that pushes back.
- Keep "When this is wrong"; it is the most senior section of a lesson.
- No coaching sentences: nothing tells the reader what to say first, what interviewers hear, or what loses the question.
- Modules open with a problem the reader attempts before the first lesson (problem-first order), because guidance that helps novices can stop helping experts.

**problems-all**

- Every hard or staff problem has a decision with at least two defensible answers, each with a stated cost; if only one answer is defensible the problem is medium at most.
- At least one quantity is chosen and defended by the reader, not given; the answer states which choices are reasonable.
- Include a constraint conflict: latency against correctness, cost against recall, autonomy against safety, a deadline against measured regressions, or labelling budget against coverage.
- State a failure mode of the recommended answer inside the answer, not only as a follow-up.
- Hints are questions to ask the interviewer or measurements to request, never the mechanism or the formula; delete any hint that lets a reader without the knowledge answer.
- At most one easy problem per module; easy items are warm-ups or the first stage of a chain, never Core 100 by default.

**debug**

- The defect is not on a commented line, not the only changed line, and not named in the title or subtitle.
- The evidence is incomplete; the strong answer says what it would collect and what it would do without it.
- At least one red herring is a real but secondary defect, so the reader ranks rather than identifies.

**code**

- Hidden property or invariant tests in addition to visible examples; visible tests never enumerate every rule.
- Leave at least one interface or policy decision to the reader (eviction, preemption order, tie-break) and test invariants, not one canonical output.
- Include a performance or memory constraint that a naive solution fails, within Pyodide's standard library.
- End with a follow-up on what changes to run the code in a real engine or client.

**estimate**

- The reader chooses at least one assumption and the accepted band admits reasonable choices; the answer says which choices are unreasonable and why.
- The answer names the dominant term and the assumption that flips the conclusion.
- Published inputs carry source and date; scenario inputs are labelled as scenario.

**design-workflow**

- Include an operating constraint: team size, deadline, an existing system that cannot be rewritten, a regulator, a budget, or a stakeholder who disagrees.
- The answer includes a "what you give up" statement and something written down: a risk note, a rollout plan with rollback triggers, or a decision memo.
- No rubric paragraph; the rubric is a checklist the reader ticks.

**critique**

- The flawed artefact is realistic enough that a reviewer could have approved it; at least two flaws are ones a senior reviewer misses on first read.
- The checklist has 6 to 12 items, including at least one judgement call where the right answer is "acceptable if".

**follow-ups**

- Each hard or staff problem carries at least three staff follow-ups, at least one pushback on the answer and one reversal condition.
- Pushback shape: "Your verification costs three times the feature; which half do you cut, and what risk do you accept in writing?"
- Reversal shape: "What would you need to see in production to reverse this decision?" or "Two senior engineers disagree; how do you decide without deciding by rank?"
- Operating shape: "You have sixty days before the model is retired and twelve of forty prompts regress; which ship degraded, and who signs off?"
- Retire the generic template ("How would you verify it? How does it fail? What is the alternative?") unless each is made specific.

**choices**

- All options within 20 percent of the longest option's length; the correct option must not be reliably the longest or the conditional one.
- Every wrong option is something a senior engineer has believed; no filler options.
- At most one option describes a superseded version of a spec or product.
- Debug problems with choices include at least two real defects; the stem asks which explains the observed symptom.
- Never state in the stem the fact that makes the answer obvious.

**banned**

- Analogy preambles ("You already know", "You have used", "If you have written", "Think of a", "You have sat").
- Scripted first sentences, "what interviewers hear", and grading commentary inside answers ("the strongest answers", "listening for", "separates senior answers", "the interviewer is checking").
- Definition by appositive, rhetorical headings and hints, one-word follow-ups ("Ship? No."), the identical "Scenario, not a real company" opener, and trivia predictions.

**sources**

- Every number is measured, sourced with a URL and the date checked, or computed in front of the reader; vendor-measured numbers are labelled as the vendor's own; abstract figures are "the paper reports".
- Company tags only from a public source naming the company and topic, labelled official, press, candidate report or vendor with a date; synthesised question banks never tag a company; reported exercises are taught with original material.
- Version-sensitive facts (SDK defaults, spec revisions, product names) carry a version or date, and every lesson has an updated date checked against its sources.

## Core 100

| # | id | track/module | type | difficulty | level | brief |
|---|---|---|---|---|---|---|
| 1 | fnd-018 | foundations/tokens | estimate | hard | senior | A vendor's new model emits more tokens for the same text: estimate the monthly bill, the rate-limit headroom and the cache hit rate at which the change pays for itself. |
| 2 | fnd-022 | foundations/embeddings | code | hard | senior | Implement the symmetric CLIP contrastive loss from paired embeddings with a temperature; hidden tests check symmetry, label alignment and numerical stability. |
| 3 | fnd-027 | foundations/attention | design | hard | staff | Pick the attention layout, or the open model, for a 128K-context serving target on a fixed GPU budget, defending the KV bytes per token and the quality evidence you would require. |
| 4 | fnd-004 | foundations/attention | code | hard | senior | Causal attention with a KV cache and grouped-query heads; a hidden test compares every decode step with a full recompute. |
| 5 | fnd-008 | foundations/sampling | debug | hard | senior | Temperature 0 gives different answers across calls in production; the reader must ask for the evidence (logprobs, batch sizes, kernels) rather than be handed it. |
| 6 | fnd-009 | foundations/training | estimate | hard | senior | Fine-tuning memory for a stated model: full, LoRA and QLoRA, with activations and ZeRO sharding as part of the question rather than a follow-up. |
| 7 | api-018 | apis/api-anatomy | critique | hard | senior | Review a retry and failover layer that retries every 429 and 5xx three times at the client, the gateway and the job runner, and fails over on the first timeout. |
| 8 | api-002 | apis/api-anatomy | code | medium | senior | Retry a model call without making the outage worse: classify errors, honour retry-after, cap attempts with a shared retry budget; hidden tests inject spend-cap 429s. |
| 9 | api-023 | apis/prompting | workflow | hard | staff | Forty prompts, sixty days to a model retirement, twelve regressions on the new model: decide which ship degraded, which are rewritten and who signs off. |
| 10 | api-008 | apis/structured-outputs | code | medium | senior | Write the tool-use loop with an iteration cap, error results returned to the model and duplicate-call protection; hidden tests inject failures. |
| 11 | api-009 | apis/structured-outputs | code | hard | senior | Assemble a streamed reply with interleaved text and tool-input deltas; the event rules are enforced by hidden tests, not listed in the question. |
| 12 | api-029 | apis/context-engineering | code | hard | senior | Model a provider's prefix cache from its documentation (prefix order, breakpoints, lookback, TTL refresh, minimum length) and predict hits for a request trace. |
| 13 | evl-019 | evals/eval-thinking | workflow | hard | staff | Build the labelling operation for a support assistant: label set, splits, agreement checks and a six-week plan for four expert hours a week. |
| 14 | evl-001 | evals/eval-thinking | debug | medium | senior | A 95% eval pass rate and angry users: list what you would pull to explain the gap before looking at any provided evidence. |
| 15 | evl-022 | evals/golden-sets | estimate | hard | senior | Size the suite to detect a three-point regression with a paired test, choosing the power and the flip rate you assume. |
| 16 | evl-009 | evals/llm-judge | code | medium | senior | Score the judge against human labels, then correct the observed pass rate with an interval; hidden tests vary base rates. |
| 17 | evl-025 | evals/llm-judge | critique | hard | senior | Critique a judge validation report that quotes raw agreement on a set where failures are rare, with no TNR. |
| 18 | evl-010 | evals/agent-evals | estimate | medium | senior | pass^4 from three flaky tasks with stated per-trial success rates, and the number of trials needed to trust it. |
| 19 | evl-012 | evals/agent-evals | concept | hard | staff | Evaluating a coding agent for your repositories, with pushback on why SWE-bench numbers do not transfer. |
| 20 | evl-013 | evals/evals-in-ci | design | hard | staff | Design an eval pipeline that gates prompt and model changes, then defend it when the gate blocks a release the CEO wants. |
| 21 | wfl-001 | workflows/patterns | workflow | hard | senior | Vendor-invoice intake with a refund branch and a two-day approval: steps, which steps are model calls, gates, idempotency keys, timeout behaviour, budgets and review routing. |
| 22 | wfl-008 | workflows/durable-execution | debug | hard | senior | After a deploy a share of running workflows fail with a non-determinism error; the diff swapped a timer and an activity among other harmless changes. Find it and ship the change safely. |
| 23 | wfl-015 | workflows/retries-flow-control | estimate | medium | senior | Five service layers each retry three times while the model provider is down: what load reaches the provider, and where should retries live? |
| 24 | wfl-017 | workflows/retries-flow-control | design | hard | staff | Fifty tenants share one provider quota; design admission control so one tenant's backfill does not starve the others. |
| 25 | wfl-022 | workflows/approvals-handoffs | debug | hard | senior | An approval node inserts a record and then calls interrupt(); after approval there are two records. Explain and fix without losing the audit trail. |
| 26 | wfl-029 | workflows/batch-pipelines | estimate | hard | senior | A nightly 300,000-document enrichment against a 100,000-request batch cap and a processing-queue limit: how many batches, how long, and what you promise downstream. |
| 27 | wfl-037 | workflows/operating-workflows | workflow | hard | staff | Write the test plan and CI gate for a five-step refund workflow: replay tests, time skipping, crash injection and golden traces. |
| 28 | rag-018 | rag/retrieval-foundations | design | hard | staff | Permissions, freshness and the ANN index for a mixed-permission corpus: filter placement, partitioning, delete handling and the recall you accept. |
| 29 | rag-004 | rag/retrieval-foundations | debug | hard | senior | LIMIT 10 returns 3 rows from a filtered vector query; the arithmetic is no longer in the correct option. |
| 30 | rag-011 | rag/hybrid-search | estimate | hard | senior | How many candidates can you rerank inside a latency budget: the reader specifies how to measure reranker latency, then computes with their own numbers. |
| 31 | rag-015 | rag/debugging-rag | code | hard | senior | Score the take-home: compute recall@5 and a faithfulness check over a provided run, with hidden tests on edge cases. |
| 32 | rag-030 | rag/debugging-rag | debug | hard | senior | Answer correctness fell after a reranker change while recall@k did not; the reranker truncates query plus document tokens. |
| 33 | rag-033 | rag/vector-systems | debug | hard | staff | HNSW returns 50 neighbours in 18 ms at 96% recall; with tenant, category and inventory filters it returns 11 in 140 ms. Fix filtered recall without destroying latency. |
| 34 | rag-036 | rag/vector-systems | estimate | hard | senior | Switch the embedding model at 80 million vectors: re-embedding cost, dual-write window, storage and the recall check before cut-over. |
| 35 | agt-002 | agents/agent-loop | debug | medium | senior | The agent loops forever on some inputs: find the cause from the trace and fix it at the right layer. |
| 36 | agt-003 | agents/agent-loop | code | medium | senior | Write a minimal agent loop with tool dispatch, a max-steps guard and the final-turn rule; hidden tests inject tool errors. |
| 37 | agt-010 | agents/tools-mcp-a2a | design | hard | staff | Move a stateful MCP server to the 2026-07-28 revision without breaking existing clients. |
| 38 | agt-012 | agents/memory-state | design | hard | staff | A refund agent that waits for a human: persistence, resume, no double payout. |
| 39 | agt-026 | agents/multi-agent | design | hard | staff | Write the delegation contract between an orchestrator and its workers, with budgets, output schema and verification. |
| 40 | agt-018 | agents/coding-agents | design | hard | staff | The agent dropped a production table: redesign permissions and approvals using published incidents (config that ran before trust, credentials read from disk, an allowlisted upload domain). |
| 41 | hrn-002 | harness/harness-anatomy | critique | hard | staff | Tear down this harness: a design that rewrites the system prompt each turn, splits commands with a regex, keeps AGENTS.md at a thousand lines and has no Stop check. |
| 42 | hrn-014 | harness/context-management | workflow | hard | staff | Design the compaction and memory policy for a six-hour run: what is pinned, what is summarised, what is re-read from disk, and how you test that the goal survives. |
| 43 | hrn-021 | harness/cache-cost-latency | estimate | hard | senior | Cache hit rate and bill for a three-hour session with two model switches and one compaction, with TTL and cache-write premiums. |
| 44 | hrn-022 | harness/cache-cost-latency | debug | hard | senior | The cache hit rate dropped to zero after an MCP server began announcing tool-list changes mid-conversation. |
| 45 | hrn-027 | harness/permissions-sandboxing | code | hard | senior | A shell-aware permission gate: deny, ask and allow with compound-command splitting, refusing to split scripts that contain substitution or redirection; hidden tests include bypass attempts. |
| 46 | hrn-030 | harness/permissions-sandboxing | estimate | hard | staff | An approval classifier with a 0.4% false-positive and 17% false-negative rate on overeager actions: expected misses per week at a stated action volume, and what you put around it. |
| 47 | hrn-034 | harness/verification | workflow | hard | staff | Run a coding agent headless in CI: non-interactive mode, an exact allowlist, a budget, a Stop check and branch protection. |
| 48 | hrn-040 | harness/long-running-parallel | workflow | hard | staff | Design the harness for a coding agent that must work across many context resets: what persists between sessions, in what format, and who may edit it. |
| 49 | hrn-046 | harness/evaluating-harnesses | concept | hard | staff | Your score moved four points the week you changed the harness and migrated benchmark infrastructure: attribute it, and design the run that would settle it. |
| 50 | sfe-003 | safety/threat-modeling | design | hard | staff | Secure an email agent that can read and send, when the CISO wants it off and the PM has a launch date. |
| 51 | sfe-019 | safety/red-team | estimate | hard | senior | How many attempts does the attacker need against a classifier with a stated recall, and what does that imply for rate limits and architecture? |
| 52 | sfe-021 | safety/injection-defences | workflow | hard | staff | Write the decision: an email assistant with a classifier and auto-reply must ship in two weeks; choose the architecture, the residual risk you accept and who signs it. |
| 53 | sfe-011 | safety/guardrails | design | hard | staff | Talk them out of giving the support agent write access to the payments database, then respond when product shows manual refunds cost more than the fraud you fear. |
| 54 | sfe-017 | safety/hallucination | workflow | hard | staff | Investigate and mitigate a model that gives confident but factually wrong answers in a high-risk domain, with a written decision on what ships. |
| 55 | sec-001 | security/secure-architecture | workflow | hard | staff | Take an email and calendar assistant from data-flow diagram to a test per control, labelling each control by construction or by rate. |
| 56 | sec-009 | security/permissions-identity | design | hard | staff | Design an access control system to protect model weights. |
| 57 | sec-013 | security/sandboxing-secrets | design | hard | staff | Design a sandboxed cloud IDE: a multi-tenant browser notebook that runs user code in isolation. |
| 58 | sec-015 | security/sandboxing-secrets | code | hard | senior | An egress policy for a fetch tool: scheme and host allowlists, resolve then pin, block private and link-local ranges including IPv4-mapped IPv6 and odd encodings, re-validate redirects. |
| 59 | sec-020 | security/mcp-security | critique | hard | senior | Review this MCP server before production: token handling, state handles, OAuth discovery and tool descriptions. |
| 60 | sec-028 | security/output-data | debug | hard | senior | A customer says your chatbot leaked another user's data; the trace shows a shared prefix-cache hit and a shared conversation id, and only one explains it. |
| 61 | sec-039 | security/security-ops | design | hard | senior | Integrate AI security into CI/CD: what runs per PR, per release and nightly, and what blocks a merge. |
| 62 | sec-046 | security/governance | workflow | hard | staff | Design an AI governance process that satisfies auditors without stopping teams from shipping. |
| 63 | inf-003 | inference/inference-anatomy | estimate | hard | senior | Roofline for a 70B model on one H100: choose FP8 or BF16 and the GPU count, and say which assumption flips it. |
| 64 | inf-006 | inference/batching | code | hard | staff | A paged KV block allocator with copy-on-write prefix sharing and preemption; hidden invariant tests. |
| 65 | inf-023 | inference/faster-cheaper | design | hard | staff | Disaggregate or tune: a mixed chat and long-document workload on sixteen GPUs with two SLOs. |
| 66 | inf-013 | inference/gateways-finops | estimate | medium | senior | Self-host or API: find the break-even volume with dated prices and say when it flips. |
| 67 | inf-029 | inference/operating | debug | hard | senior | Throughput collapsed at 2 a.m. with no deploy: read the engine metrics and find the preemption storm. |
| 68 | inf-030 | inference/operating | replay | hard | staff | Replay Anthropic's three overlapping infrastructure bugs: commit to a hypothesis at each checkpoint and name the instrument that would have caught each bug. |
| 69 | inf-033 | inference/fleet | multistage | hard | senior | A credit tracker in stages: grants and consumption, then expirations consumed oldest first, then holds for in-flight requests, then refunds and an audit log. |
| 70 | ops-001 | llmops/prompt-lifecycle | critique | hard | senior | A one-line prompt tweak shipped on Friday and escalations rose on Monday: critique the versioning and testing system that let it through. |
| 71 | ops-007 | llmops/releases-experiments | estimate | hard | senior | Sample size to detect a lift from 70% to 72% task resolution at alpha 0.05 and power 0.8, then the duration at a stated daily traffic. |
| 72 | ops-009 | llmops/releases-experiments | replay | hard | staff | Replay the GPT-4o sycophancy update: at each checkpoint decide ship or hold from the evidence available then, and add the gate that would have stopped it. |
| 73 | ops-020 | llmops/data-curation | workflow | hard | staff | Leadership wants production conversations used for eval sets and fine-tuning data: design the pipeline with consent, PII, deletion and leakage controls. |
| 74 | ops-032 | llmops/economics-selection | estimate | hard | senior | Cost per resolved conversation for a support agent with stated tokens, success rate and escalation cost, compared with a $0.99 per-outcome price. |
| 75 | ops-038 | llmops/platform-strategy | design | hard | staff | Twelve LLM features across chat, search, extraction and agents, each calling models its own way: design the shared inference platform. |
| 76 | trn-001 | training/compute-scaling | estimate | hard | senior | Days to train a stated dense model on a stated number of H100s at an MFU you choose and defend, using 6ND. |
| 77 | trn-013 | training/distributed | design | hard | staff | An MoE pretraining pipeline for about 1T tokens on 256 A100-80GB GPUs: experts and top-k, parallelism and group sizes, all-to-all overlap, memory per GPU, checkpointing and elastic restart; then scale to 1,024 GPUs. |
| 78 | trn-014 | training/distributed | concept | hard | staff | Y = X @ W with W column-sharded over P devices: derive forward and backward and name every collective needed for a replicated dX with dW sharded. |
| 79 | trn-022 | training/numerics | debug | hard | staff | An upward loss spike at step N in a long run: what do you look at in the first hour, and what do you change? |
| 80 | trn-027 | training/reliability | code | hard | senior | Find all faulty GPU nodes with parallel group tests that cannot share nodes; then handle few bad nodes and flaky tests. |
| 81 | trn-033 | training/pretraining-data | design | hard | senior | Turn raw text into a curated training set (sources, filtering, dedup, mixing, evaluation); then there are too few quality tokens, and a user-facing language regressed. |
| 82 | trn-045 | training/post-training | concept | hard | senior | DPO versus PPO-based RLHF and why DPO skips the reward model; then specify a DPO dataset: fields, chosen and rejected sources, ties, noisy labels and filtering. |
| 83 | trn-051 | training/rl | debug | hard | senior | Engine and trainer log-probabilities disagree in an "on-policy" GRPO run: diagnose the mismatch and apply truncated importance sampling. |
| 84 | mml-001 | multimodal/long-context | debug | hard | staff | After adding a static YaRN block to reach 128K, short prompts got worse; decide whether to keep it and how to serve both. |
| 85 | mml-008 | multimodal/architectures | estimate | hard | senior | KV cache at 256K for a 1:7 attention-to-Mamba hybrid versus a dense MoE of similar size, from the published configurations. |
| 86 | mml-013 | multimodal/vision-language | design | hard | staff | Design a video vision-language model end to end: data, architecture, objectives, evaluation and serving. |
| 87 | mml-019 | multimodal/speech-voice | design | hard | staff | Design a real-time AI voice system: ingestion, ASR, orchestration, TTS, session state, interruptions, safety, latency and cost. |
| 88 | mml-025 | multimodal/generation | design | hard | staff | Design an image generation system (data, diffusion or autoregressive, conditioning, safety, evaluation, inference), extend it to text and image in and out, then explain a recent paper. |
| 89 | sys-018 | system-design/framework | workflow | hard | staff | Resolution rate is up and re-contacts are up after a launch: decide whether to roll back, with the analysis and the owner. |
| 90 | sys-020 | system-design/framework | critique | hard | senior | Critique this design document for a multi-tenant chat backend with billing and moderation. |
| 91 | sys-023 | system-design/capacity | estimate | hard | senior | What a 1M-token context promise costs per request and per day at stated traffic, from list prices and a published model config. |
| 92 | sys-006 | system-design/case-retrieval | design | hard | staff | Enterprise RAG with per-user permissions; the rubric becomes a checklist and the answer includes what you give up. |
| 93 | sys-012 | system-design/case-realtime | design | hard | staff | A multi-tenant chat backend with metered billing that counts cache reads and writes correctly. |
| 94 | sys-034 | system-design/case-platforms | design | hard | staff | A coding-agent platform: session log, lazily provisioned sandboxes, credential proxy, egress policy and cost per task. |
| 95 | rnd-018 | rounds/hand-write | code | hard | senior | A KV-cache decode step for a toy decoder whose output equals the full recompute, with grouped-query heads. |
| 96 | rnd-023 | rounds/llm-app-coding | multistage | hard | senior | In-memory database in four stages: set, get and delete; then filtered scans; then TTL with an injected clock; then backup and restore. |
| 97 | rnd-028 | rounds/take-home-debug | worksample | hard | senior | Plan a product in 30 minutes, build it in two hours with any AI tools, then answer the review questions on data model, abstractions, path to production and AI use. |
| 98 | rnd-032 | rounds/codebase-rounds | repo | hard | senior | Bug squash in a multi-file Python package with three seeded bugs (a missing visitor method, an existence check that should be a file check, a resent request whose body stream was already consumed). |
| 99 | rnd-043 | rounds/customer-craft | design | hard | staff | A regulated-industry customer wants to use the Claude API: design the implementation, then say what changes for a government contractor. |
| 100 | rnd-054 | rounds/behavioural | behavioural | hard | staff | The eval said ship and you said no: tell the story, with the evidence, the cost of waiting and what happened next. |

## Crunch path (25, in order)

| # | id | track/module | type | brief |
|---|---|---|---|---|
| 1 | agt-002 | agents/agent-loop | debug | The agent loops forever on some inputs: find the cause from the trace and fix it at the right layer. |
| 2 | hrn-002 | harness/harness-anatomy | critique | Tear down this harness: a design that rewrites the system prompt each turn, splits commands with a regex, keeps AGENTS.md at a thousand lines and has no Stop check. |
| 3 | hrn-022 | harness/cache-cost-latency | debug | The cache hit rate dropped to zero after an MCP server began announcing tool-list changes mid-conversation. |
| 4 | api-023 | apis/prompting | workflow | Forty prompts, sixty days to a model retirement, twelve regressions on the new model: decide which ship degraded, which are rewritten and who signs off. |
| 5 | wfl-001 | workflows/patterns | workflow | Vendor-invoice intake with a refund branch and a two-day approval: steps, which steps are model calls, gates, idempotency keys, timeout behaviour, budgets and review routing. |
| 6 | wfl-024 | workflows/approvals-handoffs | critique | Critique a design that stores approval run state in a browser cookie and lets any logged-in user approve. |
| 7 | hrn-030 | harness/permissions-sandboxing | estimate | An approval classifier with a 0.4% false-positive and 17% false-negative rate on overeager actions: expected misses per week at a stated action volume, and what you put around it. |
| 8 | hrn-046 | harness/evaluating-harnesses | concept | Your score moved four points the week you changed the harness and migrated benchmark infrastructure: attribute it, and design the run that would settle it. |
| 9 | sec-001 | security/secure-architecture | workflow | Take an email and calendar assistant from data-flow diagram to a test per control, labelling each control by construction or by rate. |
| 10 | sec-014 | security/sandboxing-secrets | concept | Your agent runs in the sandbox; list three ways it can still leak a secret and the control for each. |
| 11 | evl-009 | evals/llm-judge | code | Score the judge against human labels, then correct the observed pass rate with an interval; hidden tests vary base rates. |
| 12 | wfl-008 | workflows/durable-execution | debug | After a deploy a share of running workflows fail with a non-determinism error; the diff swapped a timer and an activity among other harmless changes. Find it and ship the change safely. |
| 13 | rag-033 | rag/vector-systems | debug | HNSW returns 50 neighbours in 18 ms at 96% recall; with tenant, category and inventory filters it returns 11 in 140 ms. Fix filtered recall without destroying latency. |
| 14 | inf-006 | inference/batching | code | A paged KV block allocator with copy-on-write prefix sharing and preemption; hidden invariant tests. |
| 15 | rnd-018 | rounds/hand-write | code | A KV-cache decode step for a toy decoder whose output equals the full recompute, with grouped-query heads. |
| 16 | rnd-023 | rounds/llm-app-coding | multistage | In-memory database in four stages: set, get and delete; then filtered scans; then TTL with an injected clock; then backup and restore. |
| 17 | rnd-028 | rounds/take-home-debug | worksample | Plan a product in 30 minutes, build it in two hours with any AI tools, then answer the review questions on data model, abstractions, path to production and AI use. |
| 18 | rnd-032 | rounds/codebase-rounds | repo | Bug squash in a multi-file Python package with three seeded bugs (a missing visitor method, an existence check that should be a file check, a resent request whose body stream was already consumed). |
| 19 | sfe-021 | safety/injection-defences | workflow | Write the decision: an email assistant with a classifier and auto-reply must ship in two weeks; choose the architecture, the residual risk you accept and who signs it. |
| 20 | rnd-054 | rounds/behavioural | behavioural | The eval said ship and you said no: tell the story, with the evidence, the cost of waiting and what happened next. |
| 21 | ops-007 | llmops/releases-experiments | estimate | Sample size to detect a lift from 70% to 72% task resolution at alpha 0.05 and power 0.8, then the duration at a stated daily traffic. |
| 22 | trn-013 | training/distributed | design | An MoE pretraining pipeline for about 1T tokens on 256 A100-80GB GPUs: experts and top-k, parallelism and group sizes, all-to-all overlap, memory per GPU, checkpointing and elastic restart; then scale to 1,024 GPUs. |
| 23 | sys-018 | system-design/framework | workflow | Resolution rate is up and re-contacts are up after a launch: decide whether to roll back, with the analysis and the owner. |
| 24 | fnd-008 | foundations/sampling | debug | Temperature 0 gives different answers across calls in production; the reader must ask for the evidence (logprobs, batch sizes, kernels) rather than be handed it. |
| 25 | sec-028 | security/output-data | debug | A customer says your chatbot leaked another user's data; the trace shows a shared prefix-cache hit and a shared conversation id, and only one explains it. |

## Corrections to the current build

| where | wrong | fix | source |
|---|---|---|---|
| src/content/lessons/agents/coding-agents/overview.mdx ("Finding the right files"); research/tracks/agents.md misconception 19 | Editing CLAUDE.md or AGENTS.md mid-session changes the prompt prefix and costs a cache miss. | For Claude Code, project-root and user CLAUDE.md are read at session start; a mid-session edit neither invalidates the cache nor applies until /clear, /compact or a restart. | https://code.claude.com/docs/en/prompt-caching |
| src/content/lessons/agents/coding-agents/overview.mdx | Cursor described as using embedding-based semantic search today. | Cursor's current search docs say no embeddings of the codebase are stored for search; date the 12.5% semantic-search gain (2025-11-06) as historical. | https://cursor.com/docs/agent/tools/search |
| src/content/lessons/system-design/case-realtime/overview.mdx (SystemDesignVoiceBudget default) and any 800 ms reference | 800 ms voice-to-voice presented as a standard. | Label 800 ms as one vendor's target; the Pipecat maintainers' June 2026 update sets 1,500 ms and measures a typical stack at about 1.3 s. | https://www.voiceaiandvoiceagents.com |
| Any lesson or problem citing needle-in-a-haystack scores | Needle scores used as proof that a model handles long context. | Use RULER, NoLiMa and HELMET-style tasks; HELMET found needle results do not reliably predict downstream performance. | https://arxiv.org/abs/2410.02694 |
| src/content/lessons/system-design/case-retrieval/overview.mdx, sys-007 and any image-token figure | Image-token figures without the model family. | Claude, OpenAI and Gemini count image tokens differently (28 px patches, 32 px patches or 512 px tiles, 258-token tiles); every figure names its family. | https://platform.claude.com/docs/en/build-with-claude/vision |
| src/content/lessons/foundations/training/overview.mdx and fnd-011 | Fine-tuning on OpenAI offered as a default option. | OpenAI's self-serve fine-tuning closed to new organisations on 7 May 2026 and ends new jobs for existing customers on 6 January 2027. | https://developers.openai.com/api/docs/deprecations |
| src/content/lessons/agents/memory-state/overview.mdx | "Exactly once" claims for durable execution without naming the idempotency key. | Durable execution is at-least-once per step; exactly-once outcomes need an idempotency key or a deduplicating provider, and approval does not guarantee exactly-once execution. | https://openai.github.io/openai-agents-python/human_in_the_loop/ |
| src/content/lessons/rag/retrieval-foundations/overview.mdx | "Pin pgvector 0.8.3" read as the latest version. | Keep 0.8.3 or later as a floor; the README shows 0.8.7 as of 2026-10-28; date any "latest" wording. | https://github.com/pgvector/pgvector |
| Any harness or coding-agent content | Gemini CLI described as Google's current consumer coding CLI; Copilot's agent called "coding agent". | Gemini CLI individual tiers stopped on 2026-06-18 in favour of Antigravity CLI; GitHub now calls it "Copilot cloud agent". | https://developers.googleblog.com/en/an-important-update-transitioning-gemini-cli-to-antigravity-cli/ |
| src/content/lessons/rounds/ai-collab-coding/overview.mdx | A third-party page's claim that Anthropic's signature round allows AI, presented without the primary source. | Anthropic's own guidance says live interviews have no AI assistance unless the interviewer says so; name both sources if both are mentioned. | https://www.anthropic.com/candidate-ai-guidance |
| Problems agt-004 and others relabelled from mid | Seniority relabels treated as level changes. | A relabel is not a level change; bodies must be rewritten to the level bar (level audit 5.2). | https://hamel.dev/blog/posts/evals-faq/ |

## Retired problems

| id | reason |
|---|---|
| fnd-003 | Easy vocabulary MCQ whose hint is the derivation; replaced by staff attention-layout and FlashAttention problems. |
| fnd-005 | Easy MCQ whose data demonstrates the answer and whose answer names the tell. |
| api-001 | Easy pagination exercise below the bar; integration rounds replace it. |
| api-007 | Vocabulary MCQ; replaced by per-field output-guarantee problems. |
| evl-003 | Easy recall MCQ on OpenTelemetry conventions; covered by the workflows span concept problem. |
| evl-017 | Easy recall MCQ; guardrail versus evaluator is taught inside online-evals. |
| rag-001 | Easy metric-pick MCQ below the bar. |
| rag-010 | Easy MCQ; identifier-heavy queries are covered in fusion and lexical-and-dense. |
| agt-007 | Easy MCQ on MCP versus function calling. |
| sfe-007 | Easy classification MCQ of jailbreak techniques. |
| inf-012 | Easy MCQ duplicating the prompt-cache layout problems. |
| sys-002 | Duplicates evl-015 (success metrics). |
| sys-014 | Duplicates api-011 (keep the prefix cache warm). |
| sys-016 | Third duplicate token-bucket limiter; merged into the AI-assisted rate limiter (rounds) and inf-009. |
| rnd-001 | Duplicates fnd-007 (sampler); merged. |
| rnd-002 | Duplicates fnd-004 (causal attention); merged. |
| rnd-005 | Easy decoding-strategy MCQ. |
| rnd-007 | Duplicate token-charged rate limiter; merged into the AI-assisted rate limiter. |
| rnd-009 | Easy debug below the bar. |
| rnd-013 | Recall of AI-use policies rather than performance in the round; the policy table becomes a dated reference lesson. |
