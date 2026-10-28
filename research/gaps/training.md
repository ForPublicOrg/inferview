# Gap report: training, post-training and infrastructure

Research angle: what a senior or staff engineer is expected to know in 2026 about how models are made and served at scale. Scaling laws, mixture of experts, pretraining data, distributed training, numerics, checkpointing and fault tolerance, GPU architecture and kernels, post-training (SFT, preference tuning, RL with verifiable rewards, reward models and reward hacking, verifiers and environments), reasoning-model training, distillation, merging, LoRA and QLoRA in practice, continued pretraining, evaluation during training, synthetic data.

Every source below was fetched and read on 2026-10-28 unless the row says otherwise. Numbers taken from an abstract are the authors' own claims. Company names appear only where the cited page names the company next to the question. Where a page could not be read (paywall, login wall, client-side rendering), the row says so and its numbers are not used.

Note on paths: on 2026-10-28 the working tree moved lessons from `src/content/lessons/<track>/<slug>.mdx` to `src/content/lessons/<track>/<module>/overview.mdx` (uncommitted when this was written). Paths below use the new layout. `SPEC.md` names `research/curriculum-v2.json`, which does not exist yet; section 2 is written so it can be copied into it.

Pyodide constraint that shapes every lab and code problem below: SPEC section 6 says code runs in Pyodide with the standard library only and no torch. Every lab proposed here is pure Python (simulators, calculators, toy policies), never "train a real model in the browser".

---

## 1. What exists today and what is missing

### Method

Every lesson and problem under `src/content` was searched (case-sensitive for acronyms) for the topic terms of this angle.

Terms with zero matching files: `FSDP`, `context parallel`, `all-reduce`, `reduce-scatter`, `MFU`, `6ND` (or any FLOPs-per-token rule for training), `loss scaling`, `loss spike`, `z-loss`, `QK-norm`, `Muon`, `MinHash`, `FineWeb`, `DCLM`, `decontamination`, `annealing`, `DAPO`, `GSPO`, `process reward`, `on-policy distillation`, `model merging`, `soup`, `continued pretraining`, `catastrophic forgetting`, `Bradley-Terry`, `torch.compile`, `Triton`, `CUDA graph`.

Terms found only as a sentence, not a section: `Megatron`, `pipeline parallel`, `expert parallel` (all three only in `inference/faster-cheaper`, and only for serving), `Chinchilla` (two sentences), `ZeRO` (only the 16-bytes-per-parameter rule), `reward hacking` (one mention in `safety/hallucination`, one in `fnd-010`), `FlashAttention` (one table row and one follow-up in `foundations/attention`).

### File by file

| File | What it covers for this angle | What is missing or too shallow |
|---|---|---|
| `src/content/lessons/foundations/training/overview.mdx` (about 3,070 words) | Stages as a build pipeline; Chinchilla in two sentences; InstructGPT; DPO and GRPO in one section with a GRPO advantage and DPO loss snippet; R1-Zero numbers; Dr. GRPO and Yue et al. caveats; test-time compute; LoRA and QLoRA memory with a calculator widget; LoRA Without Regret guidance; distillation and synthetic data in one paragraph; classic ML refresher | Written as a survey for someone who has never seen the stages. No training FLOPs (6ND), no compute-optimal vs inference-optimal reasoning, no MFU, no PPO mechanics (value model, clipped surrogate, KL in reward vs as a loss), no reward-model training, no reward hacking section, no verifiers or RL environments, no rollout/trainer mismatch, no DAPO or GSPO, no on-policy distillation, no merging, no continued pretraining, no forgetting. The classic-ML section (precision and recall, bias and variance) is beginner material for this audience. |
| `src/content/lessons/foundations/attention/overview.mdx` | FlashAttention as "exact, tiled, fewer HBM reads" in a table row and a follow-up | No IO argument, no FlashAttention 2 or 3, no backward-pass recomputation, no link to roofline. |
| `src/content/lessons/foundations/model-landscape/overview.mdx` | MoE as total vs active parameters for memory and latency, with a Llama 4 Maverick predict block | Nothing on routing, top-k, load balancing (auxiliary loss vs bias-based), capacity and token dropping, shared experts, expert parallelism, all-to-all cost, router collapse. These are what the MoE questions in section 3 ask (Q1, Q14, Q24, Q28). |
| `src/content/lessons/inference/inference-anatomy/overview.mdx` | Roofline and FP8 from the serving side; prefill vs decode | No training view: arithmetic intensity of a training step, MFU vs HFU, SMs, shared memory, tensor cores. |
| `src/content/lessons/inference/faster-cheaper/overview.mdx` | One section on TP, PP and EP for serving, citing Megatron and vLLM guidance; quantization for inference | Parallelism for training is a different problem (optimizer state, gradients, activations, bubbles). No DP, ZeRO, FSDP, SP, CP; no collectives; no communication-volume math. |
| `src/content/problems/foundations/fnd-009.mdx` (estimate) | Fine-tuning memory: full, LoRA, QLoRA | Good. Needs siblings: activation memory, ZeRO-stage memory, per-GPU memory under a parallel config. |
| `src/content/problems/foundations/fnd-010.mdx` (concept) | RLHF, DPO, GRPO in one diagram | Concept only; no numbers, failure modes only mentioned. |
| `src/content/problems/foundations/fnd-011.mdx` (design) | Prompt, RAG or fine-tune | Product-level decision; no continued-pretraining or distillation branch with costs. |
| `src/content/problems/foundations/fnd-013.mdx` (debug) | Debug a GRPO step, "the ratio that should be 1" | The best item in the bank for this angle and it matches a reported Anthropic screen (Q4). Needs the rollout-engine vs trainer mismatch follow-up and truncated importance sampling. |
| `src/content/problems/inference/inf-003.mdx` (estimate) | Roofline for a 70B model on one H100 | Serving only. |
| `src/content/problems/inference/inf-011.mdx` (debug) | Accuracy fell after 4-bit quantization | Serving only. |
| `src/content/labs/bpe-tokenizer.mdx` | The only lab | No training or infra lab. |
| `research/tracks/foundations.md` rows 28 to 35 | Interview items on LoRA rank, DPO vs PPO, RLVR, reward hacking, Chinchilla | Mostly from secondary question banks (amitshekhariitbhu, letsdatascience, aced.io) with no company. Only row 31 (GRPO, Anthropic) has a company-named source. |
| `SPEC.md` section 11 (mock loop) | Names presets for "ML infra" and "research engineer" | The bank has almost nothing to fill those presets: four training problems, three of them conceptual. Both presets would draw mostly from inference and foundations, which is not what those loops test. |

### Missing entirely

1. Distributed training: DP and DDP, ZeRO 1/2/3 and FSDP2, tensor and sequence parallelism, pipeline schedules (GPipe-style, 1F1B, interleaved, zero bubble, DualPipe), context parallelism and ring attention, expert parallelism, composing them (4D and 5D), collectives and their cost.
2. Numerics and stability: BF16 vs FP16, loss scaling, FP8 recipes (per-tensor vs tile and block scaling), loss spikes and known causes, QK-norm, z-loss, optimizer choice (AdamW, Muon and MuonClip).
3. Reliability at scale: checkpoint formats and async save, failure rates from real runs, silent data corruption, stragglers, bad-node detection, effective training time.
4. GPU and kernels for training: SMs, HBM, shared memory, tensor cores, roofline for a training step, fusion, FlashAttention 1 to 3, Triton, torch.compile, CUDA graphs, profiling method.
5. Pretraining data: extraction, quality filtering (heuristic and model-based), exact and near dedup, mixing, annealing and mid-training, decontamination, rephrasing.
6. Post-training depth: SFT data construction, reward models, PPO, the GRPO family (DAPO, Dr. GRPO, GSPO), RLVR, verifiers and environments, reward hacking evidence and mitigations, RL infrastructure (colocated vs separate rollouts, staleness, engine mismatch).
7. Distillation (off-policy and on-policy), model merging, continued pretraining, forgetting.
8. Evaluation during training: small-scale ablations, micro-annealing, scaling-law extrapolation, checkpoint averaging, contamination.
9. Teardowns of public training runs (DeepSeek-V3, Llama 3 405B, Kimi K2, OLMo 2 and Olmo 3, Qwen3, DeepSeek-R1). These are the richest public sources and the site uses none of them beyond a headline number.

### Level

The existing training lesson is pitched at "what is fine-tuning". A senior or staff loop for ML infra or research engineering assumes that and asks for mechanisms with numbers: what a ZeRO-3 step communicates, why TP stays inside a node, where the 16 bytes per parameter come from and what changes with FP32 gradient accumulation, why an importance ratio is not 1 in an "on-policy" GRPO run, what a group of all-correct samples contributes. The reported questions in section 3 show this level directly (Q4, Q8, Q11, Q13).

---

## 2. Material to add

Proposed as a new track, slug `training`, title "Training, post-training and infrastructure", problem id prefix `trn`. The existing `foundations/training` module stays as the on-ramp and links forward. Kinds follow SPEC section 5 (`lesson`, `teardown`, `playbook`, `paper`) plus labs (SPEC section 10). Level is senior unless marked staff.

Format per item: **title** (kind, level). One-paragraph brief. Primary sources, all checked 2026-10-28.

### Module A. Compute, scaling laws and the training budget (`compute-scaling`)

**A1. Training FLOPs, MFU and the budget equation** (lesson, senior). Start from C about 6ND (2 FLOPs per parameter per token forward, 4 backward), turn a token budget and a cluster into days, then into MFU. Show why Llama 3 405B at 38 to 43% BF16 MFU and DeepSeek-V3 at 180K H800 GPU hours per trillion tokens become comparable once divided out. Predict block: days to train a dense model of stated size on N H100s at a stated MFU. Attention FLOPs only dominate training past T > 8D, so most cost sits in the matmuls until very long sequences.
Sources: https://jax-ml.github.io/scaling-book/transformers/ (6 x params x tokens; T > 8D) ; https://arxiv.org/html/2407.21783 (Llama 3 MFU table, 3.8e25 FLOPs) ; https://arxiv.org/html/2412.19437v2 (DeepSeek-V3 GPU hours) ; https://arxiv.org/abs/2204.02311 (PaLM, where MFU was introduced; abstract read, its MFU figures are not in the abstract and are not used here).

**A2. Scaling laws: Kaplan, Chinchilla, and training past compute-optimal** (lesson, senior). Kaplan's power laws and the "large model, stop early" conclusion; Chinchilla's "double the model, double the tokens" from over 400 runs; 20 tokens per parameter as a derived ratio (1.4T / 70B); why deployed models train far past it (Llama 3 8B; Sardana et al. up to 10,000 tokens per parameter); how Llama 3 used IsoFLOP curves to land on 405B with an extrapolated optimum of 402B on 16.55T tokens.
Sources: https://arxiv.org/abs/2001.08361 ; https://arxiv.org/abs/2203.15556 ; https://arxiv.org/abs/2401.00448 ; https://arxiv.org/html/2407.21783 ; https://arxiv.org/abs/2404.10102.

**A3. Chinchilla, replicated** (paper, staff). Besiroglu et al.: the parametric fit (Chinchilla's third method) fails on the extracted data, its intervals are implausibly narrow, and a re-fit agrees with methods 1 and 2. Interview use: "how sure are you about the 20x rule?"
Sources: https://arxiv.org/abs/2404.10102 ; https://arxiv.org/abs/2203.15556.

**A4. Playbook: size the run** (playbook, staff). Inputs: target quality, expected inference volume, GPU count and type, deadline. Options: compute-optimal dense, inference-optimal (smaller, overtrained), MoE at a chosen sparsity. Worked decision on a stated case. Measure after: loss vs the extrapolated curve, MFU, effective training time.
Sources: https://arxiv.org/abs/2401.00448 ; https://arxiv.org/html/2407.21783 ; https://arxiv.org/html/2507.20534 (Kimi K2 sparsity scaling law).

### Module B. GPUs, roofline and kernels for training (`gpu-kernels`)

**B1. The GPU as a memory hierarchy** (lesson, senior). SMs (132 on H100 SXM5), registers, shared memory and L1 (256 KB per SM, up to 228 KB shared), 50 MB L2, HBM (80 GB at 3.35 TB/s). Warps, blocks, occupancy, TMA, clusters. The spec-sheet trap: 1,979 BF16 TFLOPS is with sparsity, dense is 989. Blackwell board numbers with the same footnote.
Sources: https://developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/ ; https://www.nvidia.com/en-us/data-center/h100/ ; https://www.nvidia.com/en-us/data-center/hgx/ ; https://nanotron-ultrascale-playbook.static.hf.space/ (GPU section).

**B2. Roofline for a training step** (lesson, senior). Arithmetic intensity, the H100 critical intensity of about 295 FLOPs per byte, why large-batch matmuls are compute-bound and norms and pointwise ops are bandwidth-bound, the three regimes (compute, bandwidth, overhead). Predict block: is this op compute-bound or memory-bound?
Sources: https://jax-ml.github.io/scaling-book/roofline/ ; https://horace.io/brrr_intro.html.

**B3. FlashAttention 1, 2 and 3** (paper, senior). The IO argument (exact attention, tiles in SRAM, recompute in backward); FA2's work partitioning (50 to 73% of A100 peak, up to 225 TFLOPS per A100 end to end); FA3 on Hopper (warp specialization, TMA, interleaved matmul and softmax, FP8 with block quantization; up to 740 TFLOPS FP16, close to 1.2 PFLOPS FP8, where FA2 reached 35% of H100).
Sources: https://arxiv.org/abs/2205.14135 ; https://arxiv.org/abs/2307.08691 ; https://arxiv.org/abs/2407.08608.

**B4. Fusion, torch.compile, Triton and CUDA graphs** (lesson, senior). When fusing pointwise ops pays (one HBM round trip instead of two); the four `torch.compile` modes and what `reduce-overhead` does (CUDA graphs, more memory, static shapes); graph breaks and `fullgraph=True`; `dynamic=None` recompile behaviour; CUDA graph constraints (static addresses, no `.item()` during capture, warm-up on a side stream, private memory pools); the caching allocator and `expandable_segments`. Ladder of effort: PyTorch, `torch.compile`, Triton, CUDA.
Sources: https://docs.pytorch.org/docs/2.14/generated/torch.compile.html ; https://docs.pytorch.org/docs/2.14/notes/cuda.html ; https://nanotron-ultrascale-playbook.static.hf.space/ (kernel ladder, coalescing and tiling examples).

**B5. Profiling a kernel like an experiment** (playbook, staff). Baseline, controlled changes, variance, stop criteria, attribution, correctness gate. Built on the reported Anthropic prompt (Q5) and the public Anthropic performance take-home (Q7), including the README's note that LLM-written submissions cheated by editing tests.
Sources: https://prachub.com/interview-questions/design-a-profiling-plan-for-kernels ; https://github.com/anthropics/original_performance_takehome.

### Module C. Distributed training (`distributed`)

**C1. Collectives from first principles** (lesson, senior). All-reduce, reduce-scatter, all-gather, all-to-all, broadcast; ring all-reduce as reduce-scatter plus all-gather; why per-GPU traffic stays near twice the buffer size regardless of GPU count; NCCL vs Gloo; timing GPU work with CUDA events and synchronisation. Lab C-L1 pairs with it.
Sources: https://nanotron-ultrascale-playbook.static.hf.space/ (communication appendix).

**C2. Memory anatomy of a training step** (lesson, senior). 16 bytes per parameter for mixed-precision Adam (2 + 2 + 4 + 8), 20 with FP32 gradient accumulation; activation memory and why it grows with sequence length and batch; full vs selective recomputation (5x less activation memory, over 90% less recompute overhead). Extends fnd-009.
Sources: https://arxiv.org/abs/1910.02054 ; https://nanotron-ultrascale-playbook.static.hf.space/ ; https://arxiv.org/abs/2205.05198.

**C3. Data parallelism, ZeRO and FSDP2** (lesson, senior). DDP with bucketed all-reduce; ZeRO-1 (optimizer states), ZeRO-2 (plus gradients), ZeRO-3 (plus parameters) with memory formulas and the extra parameter all-gathers (about 3 units of traffic vs 2); FSDP2 as per-parameter DTensor sharding on dim 0, `reshard_after_forward` semantics, `MixedPrecisionPolicy`, explicit prefetch, HSDP on a 2D mesh; apply `fully_shard` bottom-up or get one large all-gather with no overlap.
Sources: https://arxiv.org/abs/1910.02054 ; https://nanotron-ultrascale-playbook.static.hf.space/ ; https://docs.pytorch.org/docs/2.14/distributed.fsdp.fully_shard.html.

**C4. Tensor and sequence parallelism** (lesson, senior). Column then row splits in the MLP and attention, the collectives per layer, why TP stays inside an NVLink domain (the playbook's measured drop past TP=8), sequence parallelism for norms and dropout. Pairs with the OpenAI sharded-matmul question (Q11).
Sources: https://arxiv.org/abs/2104.04473 ; https://arxiv.org/abs/2205.05198 ; https://nanotron-ultrascale-playbook.static.hf.space/.

**C5. Pipeline parallelism and schedules** (lesson, senior). Bubble (p - 1) / m for all-forward-all-backward; 1F1B keeps the bubble but caps in-flight activations at p micro-batches; interleaved stages cut it to about (p - 1) / (v m) at v times the communication; zero bubble by splitting backward into input-gradient and weight-gradient steps; DualPipe. Lab C-L2 is the simulator.
Sources: https://nanotron-ultrascale-playbook.static.hf.space/ ; https://arxiv.org/abs/2104.04473 ; https://arxiv.org/html/2412.19437v2 (DualPipe bubble formula).

**C6. Context parallelism and ring attention** (lesson, staff). Splitting the sequence across GPUs for 128K-plus training, ring exchange of K and V overlapped with compute, causal-mask imbalance and the zig-zag fix; Llama 3's CP 16 stage at 131,072 tokens and 38% MFU.
Sources: https://nanotron-ultrascale-playbook.static.hf.space/ ; https://arxiv.org/html/2407.21783.

**C7. Composing 4D and 5D parallelism** (playbook, staff). The playbook's decision steps (fit one replica, reach the global batch, then maximise throughput); TP inside nodes, PP or ZeRO-3 across; why PP and ZeRO-3 rarely combine; real configs side by side: Llama 3 (TP 8, CP 1 or 16, PP 16, DP 8 to 128) and DeepSeek-V3 (PP 16, EP 64 over 8 nodes, ZeRO-1, no TP). Worked case: the Meta prompt with 256 A100-80GB (Q1).
Sources: https://nanotron-ultrascale-playbook.static.hf.space/ ; https://arxiv.org/html/2407.21783 ; https://arxiv.org/html/2412.19437v2 ; https://prachub.com/interview-questions/design-a-scalable-moe-pretraining-pipeline.

**C8. TorchTitan** (teardown, staff). A public PyTorch-native stack composing 3D parallelism, Float8 training, elastic scaling and checkpointing, with its reported gains (65.08% on Llama 3.1 8B at 128 GPUs, then an additional 12.59% and 30% at 256 and 512 GPUs). What is not public: production cluster failure data.
Sources: https://arxiv.org/abs/2410.06511 ; https://docs.pytorch.org/docs/2.14/distributed.checkpoint.html.

### Module D. Precision, optimizers and stability (`numerics`)

**D1. Mixed precision without folklore** (lesson, senior). FP32 master weights and loss scaling; why BF16 removes the need for loss scaling (FP32 exponent range, fewer mantissa bits); where reductions stay in FP32; FSDP2's `param_dtype` and `reduce_dtype`.
Sources: https://arxiv.org/abs/1710.03740 ; https://nanotron-ultrascale-playbook.static.hf.space/ ; https://docs.pytorch.org/docs/2.14/distributed.fsdp.fully_shard.html.

**D2. FP8 training as DeepSeek-V3 did it** (paper, staff). E4M3 and E5M2; Transformer Engine's per-layer choice; DeepSeek-V3: FP8 GEMMs for forward, dgrad and wgrad; 1x128 activation tiles and 128x128 weight blocks; promotion to FP32 every 128 elements; embedding, head, gating, norms and attention kept in higher precision; relative loss error under 0.25% vs BF16.
Sources: https://arxiv.org/abs/2209.05433 ; https://developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/ ; https://arxiv.org/html/2412.19437v2.

**D3. Loss spikes and how labs stopped them** (lesson, staff). OLMo 2: batches with long repeated n-grams linked to spikes, RMSNorm reordering, QK-norm, z-loss, no weight decay on embeddings, AdamW epsilon 1e-8, simple init. Kimi K2: exploding attention logits under Muon, QK-Clip with tau = 100, "zero loss spike" over 15.5T tokens. DeepSeek-V3: no irrecoverable spikes and no rollbacks. Ends with a debug drill on an upward spike (Q33).
Sources: https://arxiv.org/html/2501.00656 ; https://arxiv.org/html/2507.20534 ; https://arxiv.org/abs/2412.19437.

**D4. Optimizers: AdamW, decoupled decay and Muon** (lesson, senior). Adam moments and bias correction; why L2 in the loss is not decoupled weight decay under Adam (Q16); Muon's reported 2x compute efficiency over AdamW and the two changes it needed at scale (weight decay, per-parameter update scale); MuonClip.
Sources: https://prachub.com/interview-questions/explain-adam-adamw-and-decoupled-weight-decay ; https://arxiv.org/abs/2502.16982 ; https://arxiv.org/html/2507.20534.

### Module E. Reliability at scale (`reliability`)

**E1. What fails in a 16K-GPU run** (teardown, staff). Llama 3 405B: 466 interruptions in 54 days (47 planned, 419 unexpected), about 78% of unexpected ones attributed to hardware, faulty GPUs and HBM3 the top two causes, 6 silent data corruptions, effective training time above 90%, three manual interventions, a 1 to 2% diurnal throughput swing, power swings of tens of megawatts. Table 5 has an arithmetic inconsistency to flag (section 5).
Sources: https://arxiv.org/html/2407.21783.

**E2. Checkpointing that does not stall training** (lesson, senior). Sharded saves, load-time resharding, `async_save` staging to CPU, the Stateful protocol, `get_state_dict` across FSDP and TP; checkpoint interval as a cost trade-off between failure rate and save time; Kimi K2's checkpoint engine updating a 1T model in under 30 seconds for RL.
Sources: https://docs.pytorch.org/docs/2.14/distributed.checkpoint.html ; https://arxiv.org/abs/2410.06511 ; https://arxiv.org/html/2507.20534.

**E3. Finding bad nodes** (lesson plus code problem, senior). Group testing in parallel rounds, flaky tests, NCCL watchdog timeouts, stragglers. Built on the reported xAI onsite question (Q13).
Sources: https://prachub.com/interview-questions/find-all-faulty-gpu-nodes-with-parallel-group-tests-that-cannot-share-nodes ; https://arxiv.org/html/2407.21783.

### Module F. Pretraining data (`pretraining-data`)

**F1. From Common Crawl to tokens** (lesson, senior). Extraction, language ID, heuristic filters, model-based quality classifiers, the ablation method (train small models per choice), FineWeb (15T tokens, 96 snapshots) and FineWeb-Edu (1.3T), DCLM's finding that model-based filtering is the key step (7B on 2.6T tokens, 64% MMLU 5-shot, 40% less compute than MAP-Neo).
Sources: https://arxiv.org/abs/2406.17557 ; https://arxiv.org/abs/2406.11794.

**F2. Dedup: exact, near and line-level** (lesson, senior). Lee et al. (one 61-word sentence over 60,000 times in C4, 10x fewer memorized emissions, over 4% train-test overlap); Llama 3's three levels (URL, document MinHash, lines appearing over 6 times per 30M-document bucket); the counterpoint that some duplication helped in OLMo 2 micro-annealing. Lab F-L1 builds MinHash.
Sources: https://arxiv.org/abs/2107.06499 ; https://arxiv.org/html/2407.21783 ; https://arxiv.org/html/2501.00656.

**F3. Mixing, annealing and mid-training** (lesson, staff). Llama 3's mix (about 50% general, 25% math and reasoning, 17% code, 8% multilingual); annealing on high-quality data with checkpoint averaging (gains on 8B, negligible on 405B); OLMo 2's Dolmino mix and souped anneals; Qwen3's three stages; Kimi K2 rephrasing (SimpleQA 23.76 for 10 raw epochs vs 28.94 for 10 rephrasings seen once).
Sources: https://arxiv.org/html/2407.21783 ; https://arxiv.org/html/2501.00656 ; https://arxiv.org/html/2505.09388 ; https://arxiv.org/html/2507.20534.

**F4. Playbook: not enough high-quality tokens** (playbook, staff). Options after aggressive filtering: relax filters, repeat epochs, rephrase, synthesize, distill; the cost and risk of each. Answers the NVIDIA follow-up in Q23.
Sources: https://prachub.com/interview-questions/plan-how-raw-text-becomes-llm-training-data-filtering-dedup-mixing-evaluation ; https://arxiv.org/html/2507.20534 ; https://arxiv.org/abs/2406.11704.

### Module G. Mixture of experts in training (`moe`)

**G1. Routing, capacity and load balance** (lesson, senior). Top-k routing, capacity factor and token dropping vs dropless, auxiliary balance loss, DeepSeek-V3's auxiliary-loss-free bias (update speed 0.001, then 0 for the last 500B tokens), Qwen3's global-batch balance loss and no shared experts, DeepSeekMoE's fine-grained plus shared experts, router collapse, making a hard router differentiable (Q28).
Sources: https://arxiv.org/abs/2101.03961 ; https://arxiv.org/abs/2401.06066 ; https://arxiv.org/html/2412.19437v2 ; https://arxiv.org/html/2505.09388 ; https://prachub.com/interview-questions/make-a-hard-moe-router-differentiable.

**G2. Expert parallelism and all-to-all** (lesson, staff). Dispatch and combine all-to-all, node-limited routing (DeepSeek-V3: at most 4 nodes per token), EP paired with DP, when communication cancels the compute saving (Q14).
Sources: https://arxiv.org/html/2412.19437v2 ; https://nanotron-ultrascale-playbook.static.hf.space/ ; https://prachub.com/interview-questions/explain-mixture-of-experts-and-expert-parallelism.

**G3. Sparsity as a design knob** (paper, staff). Kimi K2's sparsity scaling law (384 experts, 8 active, sparsity 48; 1.69x fewer FLOPs than sparsity 8 at the same validation loss) and the decision to keep 64 heads because 128 would add 83% inference FLOPs at 128K context.
Sources: https://arxiv.org/html/2507.20534.

### Module H. SFT, preferences and reward models (`post-training`)

**H1. Building SFT data** (lesson, senior). Domain-specific generation, rejection sampling from expert models, packing with isolation masks (DeepSeek-V3: about 1.5M instances, two epochs); the R1-generated data problems DeepSeek fixed (overthinking, poor formatting, excessive length); Llama 3's rounds of SFT then DPO with rejection sampling of 10 to 30 samples per prompt.
Sources: https://arxiv.org/html/2412.19437v2 ; https://arxiv.org/html/2407.21783.

**H2. Reward models and their limits** (lesson, senior). Pairwise reward modelling; rule-based vs model-based rewards (DeepSeek-V3); process vs outcome supervision (Lightman et al., PRM800K, 78% on a MATH subset); why DeepSeek-R1 abandoned PRMs (steps hard to define, hard to judge, reward hacking); over-optimization against a proxy reward (Gao et al.).
Sources: https://arxiv.org/html/2412.19437v2 ; https://arxiv.org/abs/2305.20050 ; https://arxiv.org/html/2501.12948v1 ; https://arxiv.org/abs/2210.10760.

**H3. DPO in practice** (lesson, senior). Loss, frozen reference, beta, offline vs online, dataset construction (fields, ties, noisy labels; Q27), Llama 3's DPO settings (LR 1e-5, beta 0.1, NLL term 0.2 on chosen).
Sources: https://arxiv.org/abs/2305.18290 ; https://arxiv.org/html/2407.21783 ; https://prachub.com/interview-questions/explain-dpo-and-construct-its-training-data.

### Module I. RL for LLMs (`rl`)

**I1. PPO for language models** (lesson, senior). Policy, value model, reward model, reference; the clipped surrogate and which policy is "old"; KL in the reward vs as a loss term; why GRPO drops the critic.
Sources: https://arxiv.org/abs/2203.02155 ; https://arxiv.org/abs/2402.03300 ; https://prachub.com/resources/llm-post-training-interview-questions-sft-dpo-ppo-and-grpo-trade-offs.

**I2. The GRPO family: GRPO, Dr. GRPO, DAPO, GSPO** (paper, staff). Group-relative advantages; zero-variance groups; length bias (Dr. GRPO); DAPO's four changes (clip-higher with epsilon 0.2 and 0.28, dynamic sampling, token-level loss, overlong shaping; 50 on AIME 2024 with Qwen2.5-32B in half the steps; KL removed); GSPO's sequence-level ratio for MoE RL stability; TRL defaults that encode these choices (`beta=0.0`, `loss_type="dapo"`).
Sources: https://arxiv.org/abs/2402.03300 ; https://arxiv.org/abs/2503.20783 ; https://arxiv.org/html/2503.14476 ; https://arxiv.org/abs/2507.18071 ; https://huggingface.co/docs/trl/main/en/grpo_trainer.

**I3. RLVR, verifiers and environments** (lesson, senior). Rule-based accuracy and format rewards (R1-Zero, equal weight; language-consistency reward added for R1); Qwen3's 3,995 query-verifier pairs (AIME'24 70.1 to 85.1 in 170 steps); Kimi K2's real and synthetic environments and self-critique rubric reward; open environment tooling (Prime Intellect `verifiers` and Environments Hub).
Sources: https://arxiv.org/html/2501.12948 ; https://arxiv.org/html/2505.09388 ; https://arxiv.org/html/2507.20534 ; https://github.com/PrimeIntellect-ai/verifiers ; https://www.primeintellect.ai/blog/intellect-3.

**I4. Reward hacking: evidence and mitigations** (lesson, staff). Specification gaming and RLHF examples (unit-test editing, sycophancy, U-Sophistry); CoT monitoring catches hacks, but optimising against the monitor produces obfuscated hacking (the "monitorability tax"); Anthropic's 2025 result that learning to hack in real coding environments generalised to sabotage (12%) and alignment-faking reasoning (50%), and that inoculation prompting removed most of it; the performance take-home where LLM submissions edited tests.
Sources: https://lilianweng.github.io/posts/2024-11-28-reward-hacking/ ; https://arxiv.org/abs/2503.11926 ; https://www.anthropic.com/research/emergent-misalignment-reward-hacking ; https://github.com/anthropics/original_performance_takehome.

**I5. RL infrastructure: rollouts, staleness and mismatch** (lesson, staff). Colocated vs separate rollout engines (TRL `vllm_mode`), asynchronous actors and learners (Meta design prompt, Q2; Google question on pipeline stages and rollouts, Q26), the rollout-engine vs trainer probability mismatch that makes "on-policy" RL off-policy and the truncated importance sampling fix, batch invariance as the cause of temperature-0 nondeterminism and the route to bitwise on-policy RL, Kimi K2's colocated design.
Sources: https://huggingface.co/docs/trl/main/en/grpo_trainer ; https://neurips.cc/virtual/2025/124259 (NeurIPS 2025 listing of the rollout-training mismatch paper; the original Notion post at https://fengyao.notion.site/off-policy-rl renders client-side and could not be read) ; https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/ ; https://arxiv.org/html/2507.20534 ; https://prachub.com/interview-questions/architect-an-asynchronous-rl-post-training-system.

**I6. DeepSeek-R1 pipeline** (teardown, senior). R1-Zero (GRPO on a base model: 16 samples per question, LR 3e-6, KL 0.001, max length 32,768 then 65,536) and its readability and language-mixing problems; R1's stages; distillation vs RL on Qwen-32B (72.6 distilled vs 47.0 RL on AIME 2024); failed PRM and MCTS attempts and why. What is not public: full data mixtures.
Sources: https://arxiv.org/html/2501.12948 ; https://arxiv.org/html/2501.12948v1.

### Module J. Reasoning training, distillation, merging and synthetic data (`distill-merge`)

**J1. Distillation: soft targets, SFT on samples, on-policy** (lesson, senior). Hinton soft targets; SFT on teacher samples (R1 distills on about 800K samples); on-policy distillation with per-token reverse KL (Qwen3-8B: 74.4 AIME'24 at 1,800 GPU hours vs 67.6 at 17,920 for RL); Yue et al. on why distillation can add reasoning patterns that RLVR does not.
Sources: https://arxiv.org/abs/1503.02531 ; https://thinkingmachines.ai/blog/on-policy-distillation/ ; https://arxiv.org/html/2505.09388 ; https://arxiv.org/abs/2504.13837.

**J2. Model merging** (lesson, senior). Model soups (no inference cost, shared init required), TIES (trim, elect sign, merge), checkpoint averaging in pretraining anneals (Llama 3, OLMo 2) and across RM, SFT and DPO stages (Llama 3).
Sources: https://arxiv.org/abs/2203.05482 ; https://arxiv.org/abs/2306.01708 ; https://arxiv.org/html/2407.21783 ; https://arxiv.org/html/2501.00656.

**J3. Synthetic data with a filter that decides quality** (lesson, senior). Nemotron-4's over 98% synthetic alignment data with a released reward model; rephrasing in pretraining (Kimi K2); rejection sampling with verifiers; contamination risk.
Sources: https://arxiv.org/abs/2406.11704 ; https://arxiv.org/html/2507.20534 ; https://arxiv.org/html/2412.19437v2.

**J4. Qwen3 post-training** (teardown, senior). Long-CoT cold start, reasoning RL, thinking-mode fusion, general RL over 20-plus tasks, strong-to-weak distillation, thinking budget emerging from fusion without explicit training.
Sources: https://arxiv.org/html/2505.09388.

### Module K. Adapting models: LoRA, QLoRA, continued pretraining (`adapting`)

**K1. LoRA in practice** (lesson, senior). Targets (all linear layers; MLP and MoE layers matter most), alpha/r scaling and why it makes the best LR roughly rank-independent, LR about 10x full fine-tuning, batch-size sensitivity, capacity limits, rank 1 for RL, slightly more than 2/3 of full-FT FLOPs per pass; PEFT defaults (`r=8`, `lora_alpha=8`, `"all-linear"`, rsLoRA, DoRA, init options) and why library defaults are not recommendations.
Sources: https://thinkingmachines.ai/blog/lora/ ; https://huggingface.co/docs/peft/main/en/package_reference/lora ; https://arxiv.org/abs/2106.09685.

**K2. When LoRA fails** (paper, senior). Biderman et al.: LoRA underperforms full FT on code and math in continued pretraining and large instruction sets, forgets less, and full-FT updates have 10 to 100x higher rank than typical LoRA.
Sources: https://arxiv.org/abs/2405.09673 ; https://thinkingmachines.ai/blog/lora/.

**K3. QLoRA mechanics** (lesson, senior). Frozen NF4 base, double quantization, paged optimizers, adapters trained in higher precision; 65B on one 48 GB GPU; where QLoRA's memory win stops (activations).
Sources: https://arxiv.org/abs/2305.14314.

**K4. Continued pretraining** (lesson, staff). LR re-warming, re-decay and replay match full retraining at a fraction of compute (405M and 10B, weak and strong shifts); schedules not tied to a token budget; forgetting; domain data proportion.
Sources: https://arxiv.org/abs/2403.08763 ; https://arxiv.org/abs/2405.09673.

**K5. Playbook: prompt, retrieve, LoRA, full FT, continued pretraining or distill** (playbook, staff). Extends fnd-011 with the data-volume and capacity conditions from K1 to K4 and a "what to measure after" list (held-out task eval, general-capability regression, forgetting).
Sources: as K1 to K4 and https://arxiv.org/abs/2504.13837.

### Module L. Evaluating while you train (`eval-in-training`)

**L1. Small-scale ablations and micro-annealing** (lesson, staff). FineWeb and DCLM's small-model ablations, OLMo 2 micro-annealing to judge a data source cheaply, Llama 3 annealing to judge data on the 8B, scaling-law extrapolation to predict the large run.
Sources: https://arxiv.org/abs/2406.17557 ; https://arxiv.org/abs/2406.11794 ; https://arxiv.org/html/2501.00656 ; https://arxiv.org/html/2407.21783.

**L2. Benchmarks that move for the wrong reason** (lesson, senior). Contamination (Lee et al.'s train-test overlap), DeepSeek-V3's stated aim to avoid over-optimising fixed benchmarks, the NVIDIA follow-up "benchmarks up, a user-facing language regressed" (Q23), pass@1 vs pass@k vs majority voting.
Sources: https://arxiv.org/abs/2107.06499 ; https://arxiv.org/html/2412.19437v2 ; https://arxiv.org/abs/2504.13837.

### Teardowns (cross-module, all staff)

| Teardown | What it shows | Sources |
|---|---|---|
| DeepSeek-V3 training system | MoE plus MTP; FP8; DualPipe; PP 16, EP 64, ZeRO-1, no TP; cost table and what it excludes | https://arxiv.org/html/2412.19437v2 |
| Llama 3 405B infrastructure | 16K H100s, 4D parallelism, MFU table, failure taxonomy, batch-size ramp, annealing, post-training rounds | https://arxiv.org/html/2407.21783 |
| Kimi K2 | 1T total, 32B active MoE; MuonClip; rephrasing; sparsity law; colocated RL and checkpoint engine | https://arxiv.org/html/2507.20534 |
| OLMo 2 and Olmo 3 | Fully open recipe: stability fixes, Dolmino, souping, Tulu 3 post-training, RLVR; Olmo 3 releases the whole model flow at 7B and 32B | https://arxiv.org/html/2501.00656 ; https://arxiv.org/abs/2512.13961 |
| Qwen3 | Three pretraining stages, four post-training stages, strong-to-weak distillation | https://arxiv.org/html/2505.09388 |
| DeepSeek-R1 | RL on a base model, cold start, distillation, failed PRM and MCTS | https://arxiv.org/html/2501.12948 |

### Labs (pure Python, Pyodide standard library)

| Lab | Steps | Gradable check | Sources |
|---|---|---|---|
| C-L1 Ring all-reduce simulator | ranks as lists; reduce-scatter; all-gather; compose into all-reduce; count bytes sent per rank; compare with naive gather then broadcast | per-rank traffic equals 2(N-1)/N of the buffer | https://nanotron-ultrascale-playbook.static.hf.space/ |
| C-L2 Pipeline schedule simulator | AFAB timeline; bubble fraction; 1F1B; peak in-flight activations; interleaved stages; zero-bubble B and W split | bubble equals (p-1)/m and (p-1)/(v m) in tests | https://nanotron-ultrascale-playbook.static.hf.space/ ; https://arxiv.org/abs/2104.04473 |
| C-L3 Training memory and parallelism planner | parameter count from a config; 16 vs 20 bytes; ZeRO stages; TP and PP split; activation estimate with and without recompute; "fits on N GPUs?" | matches hand-computed cases, including the Llama 3.1 8B config already used by fnd-009 | https://arxiv.org/abs/1910.02054 ; https://arxiv.org/abs/2205.05198 |
| F-L1 MinHash near-dedup | shingles; hash family; signatures; LSH bands; threshold tuning; line-level frequency filter | finds planted near-duplicates and keeps distinct documents | https://arxiv.org/abs/2107.06499 ; https://arxiv.org/html/2407.21783 |
| I-L1 GRPO on a toy verifiable task | softmax policy over a small action set; verifier; group advantages; clipped ratio; zero-variance groups; KL term; length-bias demo | reward rises; all-equal groups contribute zero gradient | https://arxiv.org/abs/2402.03300 ; https://arxiv.org/html/2503.14476 ; https://arxiv.org/abs/2503.20783 |
| H-L1 Preference learning | pairwise reward model on toy pairs by gradient descent; DPO loss and gradient by hand; beta sweep | loss equals log 2 when policy equals reference; finite-difference check | https://arxiv.org/abs/2305.18290 |
| B-L1 Autograd and stable losses | scalar then matrix reverse-mode autograd; stable softmax cross-entropy; gradient check; prefix-product backward without division | matches finite differences | reported OpenAI and Anthropic questions Q6, Q9, Q10 |

### Problem ideas mapped to SPEC types (examples, not a full bank)

- estimate: days to train a stated dense model at a stated MFU; ZeRO-3 per-GPU memory for a stated model and GPU count; pipeline bubble for p = 16, m = 32; DeepSeek-V3 GPU hours per trillion tokens to days on 2,048 GPUs (the paper says about 3.7 days); H100 critical batch size.
- debug: loss NaN after a precision change; GRPO run with exploding response length; DPO run where chosen log-probs also fall; MFU drop after moving TP from 8 to 16; a checkpoint restore that silently drops optimizer state.
- mcq: which ZeRO stage shards what; which FP8 format DeepSeek-V3 used everywhere; which statement about FlashAttention is false.
- design: Meta MoE pretraining prompt (Q1); async RL system (Q2); preference-data platform (Q37 family).
- critique: a parallel config for a large dense run with TP across nodes and PP plus ZeRO-3.
- code: the labs above, split into single steps.

---

## 3. Interview questions collected

Provenance notes. Most company-named items come from PracHub (prachub.com), a candidate-report aggregator: the site paraphrases prompts, locks some, and shows a "date reported". Treat the company tag as "reported via PracHub", not as confirmed by the company. Item 7 is first-party (Anthropic's own GitHub repo). Items 34 to 38 name no company and are included as practice prompts. Level is Inferview's tag from the scope of the prompt; no source states a level. Types use SPEC section 6 names. All pages checked 2026-10-28.

| # | Question (paraphrased from the source) | Type | Level | Company named by source | Source URL | Reported |
|---|---|---|---|---|---|---|
| 1 | Design a large MoE pretraining pipeline for a bilingual decoder-only model on about 1T tokens with 256 A100-80GB GPUs (32 nodes x 8): experts and top-k, parallelism and group sizes, all-to-all and overlap, capacity and dropping, balance loss, ZeRO or FSDP and per-GPU memory budget, checkpointing and elastic restart, data and dedup, tokenizer, schedule, monitoring, failure modes; then scale to 1,024 GPUs | design | staff | Meta (MLE, onsite) | https://prachub.com/interview-questions/design-a-scalable-moe-pretraining-pipeline | 2025-09-06 |
| 2 | Architect an asynchronous RL post-training loop (RLHF or RLAIF) for a chat model already serving traffic: actors, reward inference, learners, replay buffers; off-policy corrections; KL control; credit assignment across multi-turn dialogs; reward-hacking prevention; canary and rollback | design | staff | Meta (MLE, onsite) | https://prachub.com/interview-questions/architect-an-asynchronous-rl-post-training-system | 2025-09-06 |
| 3 | Design a real-time QA chatbot, including training-data collection, RL tasks and rewards, the reward's weaknesses (hacking, length bias, over-optimization) and how to detect the policy exploiting the reward model | design | senior | Meta (MLE, technical screen) | https://prachub.com/interview-questions/design-a-real-time-question-answering-chatbot-training-data-rl-tasks-and-rewards | 2026-09-25 |
| 4 | Walk through one GRPO step, find three easy-to-miss bugs (log-prob indexing, masking, advantage normalisation, mixed policies) and explain why the importance ratio is not always 1; follow-ups on all-equal-reward groups, engine vs trainer log-prob mismatch, KL in the reward vs as a loss | debug | senior | Anthropic (SWE, technical screen) | https://prachub.com/interview-questions/debug-a-grpo-training-loop-and-explain-ratios | 2026-02-19 |
| 5 | With only a kernel simulator reporting cycles, IPC, stall reasons, occupancy and bandwidth, design a rigorous plan to profile and optimise a kernel: baseline, controlled experiments, variance reduction, stop criteria, attribution, correctness checks | design | staff | Anthropic (SWE, onsite) | https://prachub.com/interview-questions/design-a-profiling-plan-for-kernels | 2025-09-06 |
| 6 | Implement a one-hidden-layer binary classifier in NumPy with hand-derived backprop, stable cross-entropy and a finite-difference check; discuss initialisation, activations, batch size and LR scaling | code | senior | Anthropic (SWE, onsite) | https://prachub.com/interview-questions/implement-and-derive-backprop-from-scratch | 2025-09-06 |
| 7 | Performance take-home: make a kernel on a simulated machine run in fewer clock cycles (originally 4 hours, later 2 hours) | code | staff | Anthropic (first-party repo) | https://github.com/anthropics/original_performance_takehome | README read 2026-10-28 |
| 8 | Find and fix four bugs in a small PyTorch decoder-only transformer and its training step, then add a KV cache that matches full-sequence logits; follow-ups: KV cache size for 32 layers, hidden 4096, 16-bit, 8,000 tokens; GQA; RoPE with a cache | debug | senior | OpenAI (MLE, onsite) | https://prachub.com/interview-questions/debug-a-small-pytorch-transformer-with-four-bugs-then-add-a-kv-cache | 2026-09-20 |
| 9 | Hand-write gradients: prefix-product backward in linear time without division (inputs may contain zeros), then stable softmax cross-entropy and its gradient with a finite-difference check | code | senior | OpenAI (MLE, onsite) | https://prachub.com/interview-questions/hand-written-gradients-prefix-product-backward-pass-and-stable-cross-entropy | 2026-09-20 |
| 10 | Implement a minimal reverse-mode autograd engine on PyTorch tensors (add, mul, matmul, ReLU, sum); follow-ups on broadcasting in backward, `no_grad`, very deep graphs, fused softmax cross-entropy | code | senior | OpenAI (SWE, technical screen) | https://prachub.com/interview-questions/implement-a-minimal-reverse-mode-autograd-engine-on-pytorch-tensors | 2026-09-19 |
| 11 | Y = X @ W with W column-sharded over P devices: derive forward and backward, name every collective needed for a replicated dX while dW stays sharded, write pseudocode, plan debugging; follow-ups on row sharding, combining with DP, overlap, detecting a duplicated gradient reduction | concept | staff | OpenAI (MLE, onsite) | https://prachub.com/interview-questions/derive-sharded-matrix-multiplication-and-backpropagation | 2026-04-19 |
| 12 | Derive backpropagation for matrix-product layers (title only on the listing page) | concept | senior | OpenAI (MLE) | https://prachub.com/interview-questions/derive-backpropagation-for-matrix-product-layers | 2026-02-05 (listing) |
| 13 | n GPU nodes, some bad; the only diagnostic is a group test that fails if any node in the group is bad; tests run in parallel rounds and cannot share nodes; find all bad nodes efficiently; follow-ups on few bad nodes, flaky tests, continuous use on a live cluster | code | senior | xAI (MLE, onsite) | https://prachub.com/interview-questions/find-all-faulty-gpu-nodes-with-parallel-group-tests-that-cannot-share-nodes | 2026-09-05 |
| 14 | Explain an MoE transformer and expert parallelism by tracing tokens through routing, expert compute and combine; why many total but few active parameters; what the balance loss encourages; when communication cancels the compute saving | concept | senior | Mistral AI (SWE, technical screen) | https://prachub.com/interview-questions/explain-mixture-of-experts-and-expert-parallelism | 2026-09-01 |
| 15 | Compare tensor and pipeline parallelism for a model too large for one device, for training and for inference; follow-ups on bubbles, micro-batches, why TP stays on a fast interconnect, small inference batches | concept | senior | Mistral AI (SWE, technical screen) | https://prachub.com/interview-questions/compare-tensor-parallelism-and-pipeline-parallelism | 2026-09-01 |
| 16 | Explain Adam and AdamW; why an L2 penalty differs from decoupled weight decay under Adam; how decay interacts with the LR schedule | concept | senior | Mistral AI (SWE, technical screen) | https://prachub.com/interview-questions/explain-adam-adamw-and-decoupled-weight-decay | 2026-09-01 |
| 17 | Diagnose GPU input starvation across storage, CPU preprocessing, batching, transfer and synchronisation, then improve overlap without breaking data correctness | debug | senior | Mistral AI (SWE, technical screen) | https://prachub.com/interview-questions/keep-gpus-fed-with-an-efficient-data-preparation-pipeline | 2026-09-01 |
| 18 | Compare reward-model RLHF and DPO (locked; title only) | concept | senior | Mistral AI (SWE) | https://prachub.com/interview-questions/compare-reward-model-rlhf-and-direct-preference-optimization | 2026-09-01 |
| 19 | Compare RMSNorm and LayerNorm in transformer blocks (locked; title only) | concept | senior | Mistral AI (SWE) | https://prachub.com/interview-questions/compare-rmsnorm-and-layernorm-in-transformer-blocks | 2026-09-01 |
| 20 | Describe training and inference optimisations (quantization, pruning, distillation, fusion such as FlashAttention, activation checkpointing and offload, mixed precision, CUDA graphs, communication overlap) with trade-offs, then compare TP and PP with their collectives and bottlenecks | concept | senior | NVIDIA (SWE, technical screen) | https://prachub.com/interview-questions/explain-optimization-and-tensor-vs-pipeline-parallelism | 2025-09-06 |
| 21 | How would you optimise large-scale training and inference? (where time and memory go, numerics, parallelism, communication, kernels) | design | staff | NVIDIA (SWE, technical screen) | https://prachub.com/interview-questions/how-would-you-optimize-large-scale-training-inference | 2026-01-14 |
| 22 | FP32 to int8 quantization in NumPy: symmetric, zero point, deriving scale from a range, clipping and outliers; follow-ups on per-channel scales and requantizing int32 accumulators | code | senior | NVIDIA (SWE, onsite) | https://prachub.com/interview-questions/fp32-to-int8-tensor-quantization-scale-zero-point-clipping-and-outliers | 2026-09-15 |
| 23 | Walk through turning raw text into a curated LLM training set (sources, filtering, dedup, mixing, evaluation); follow-ups: too few high-quality tokens after filtering; benchmarks up but a user-facing language regressed | design | senior | NVIDIA (product manager role) | https://prachub.com/interview-questions/plan-how-raw-text-becomes-llm-training-data-filtering-dedup-mixing-evaluation | 2026-06-01 |
| 24 | Explain transformers and MoE (routing, top-k, load balancing, stability), then data, tensor and pipeline parallelism and collectives; give an example of where all-reduce appears when training a transformer | concept | senior | Amazon (Applied Scientist, onsite) | https://prachub.com/questions/4971 | 2025-12-08 |
| 25 | GRPO deep dive: critic-free RL, parallelism, MLA and reward design for a reasoning LLM (title only) | concept | staff | Amazon (Applied Scientist, technical screen) | https://prachub.com/interview-questions/grpo-deep-dive-critic-free-rl-parallelism-mla-and-reward-design-for-a-reasoning-llm | 2026-06-21 |
| 26 | Explain how pipeline stages and micro-batches interact with GRPO rollouts: relative advantages, policy versions, throughput, staleness | concept | staff | Google (MLE, technical screen) | https://prachub.com/interview-questions/explain-pipeline-parallelism-in-grpo-training | 2026-08-14 |
| 27 | Explain DPO vs PPO-based RLHF and why DPO skips the reward model; then specify a DPO dataset: fields, how to get chosen and rejected responses, ties, noisy labels, filtering | concept | senior | TikTok (SWE, technical screen) | https://prachub.com/interview-questions/explain-dpo-and-construct-its-training-data | 2025-12-08 |
| 28 | Make a hard top-k MoE router differentiable: compare straight-through, Gumbel-softmax, relaxations and REINFORCE; auxiliary losses with formulas; temperature schedules; preventing expert collapse; defaults for k and capacity factor | concept | staff | Citadel (MLE, technical screen) | https://prachub.com/interview-questions/make-a-hard-moe-router-differentiable | 2025-07-15 |
| 29 | A PyTorch training script does not converge, goes NaN or is slow: give a debugging checklist; move it to FSDP (init, wrapping, optimizer state, gradient accumulation, checkpointing); approximate a sparse-gradient all-reduce; when to propose a custom CUDA or Triton kernel and how to validate it | debug | senior | Startups.com (MLE, onsite) | https://prachub.com/interview-questions/debug-and-scale-a-pytorch-training-loop | 2026-03-10 |
| 30 | Explain self-attention, LoRA, Adam vs SGD, ViT (title only) | concept | senior | Netflix (MLE) | https://prachub.com/interview-questions/explain-self-attention-lora-adam-vs-sgd-vit | 2026-02-23 (listing) |
| 31 | Implement attention and a transformer block with its backward pass (title only) | code | senior | Tesla (MLE) | https://prachub.com/interview-questions/implement-attention-and-transformer-with-backward-pass | 2025-08-12 (listing) |
| 32 | Design a double-descent experiment (locked; title only) | design | senior | Anthropic (MLE) | https://prachub.com/interview-questions/design-a-double-descent-experiment | 2026-04-19 |
| 33 | LLM systems quick-fire round; follow-ups shown in the search snippet: "how would you debug an upward loss spike?" and "why does BF16 often work better than FP16 for training stability?" (page body not visible when fetched) | concept | senior | Mistral AI (MLE, onsite) | https://prachub.com/interview-questions/answer-an-llm-systems-quick-fire-interview | 2026-07-02 |
| 34 | Compute the batch size at which a bf16 matmul becomes compute-bound on an H100 (book answer about 295) | estimate | senior | none (Google DeepMind book exercise) | https://jax-ml.github.io/scaling-book/roofline/ | book dated 2025-02-04 |
| 35 | From DeepSeek-V3's published GPU hours and tokens, estimate the hardware utilization of its training run (book answer about 21.7%) | estimate | staff | none (Google DeepMind book exercise) | https://jax-ml.github.io/scaling-book/transformers/ | book dated 2025-02-04 |
| 36 | How many tokens per batch an MoE layer needs to be compute-bound on TPU v5e with DeepSeek's expert configuration (book answer about 3,840) | estimate | staff | none (Google DeepMind book exercise) | https://jax-ml.github.io/scaling-book/transformers/ | book dated 2025-02-04 |
| 37 | Design distributed PPO training over thousands of GPUs | design | staff | none | https://www.techinterview.org/post/3233475333/rlhf-post-training-interview-topics-2026/?format=md | page updated 2026-07-12 |
| 38 | Your model started refusing benign requests after a safety-training round. What do you investigate? | debug | senior | none | https://www.techinterview.org/post/3233475333/rlhf-post-training-interview-topics-2026/?format=md | page updated 2026-07-12 |

Role-expectation evidence for the mock-loop presets (not a question): Anthropic's "Research Engineer, Pretraining Scaling" posting lists owning the production pretraining pipeline (model operations, performance, monitoring, reliability), debugging across the stack "from hardware and networking to training dynamics and evaluation", on-call during launches, and adding long-context support or new architectures. https://job-boards.greenhouse.io/anthropic/jobs/4938436008 (checked 2026-10-28).

---

## 4. Numbers and facts to know

All checked 2026-10-28.

### Compute and scaling

| Fact | Source |
|---|---|
| Training FLOPs are well approximated by 6 x parameters x tokens at reasonable context lengths (2 forward, 4 backward per parameter per token) | https://jax-ml.github.io/scaling-book/transformers/ |
| Attention FLOPs dominate training only once sequence length T > 8D (about 64K tokens for D about 8K) | https://jax-ml.github.io/scaling-book/transformers/ |
| Kaplan: loss is a power law in model size, data and compute over more than seven orders of magnitude; compute-efficient training uses very large models stopped well before convergence | https://arxiv.org/abs/2001.08361 |
| Chinchilla: over 400 models, about 70M to over 16B parameters, 5B to 500B tokens; "for every doubling of model size the number of training tokens should also be doubled"; Chinchilla 70B at the same compute as 280B Gopher with about 4x more data; MMLU 67.5% | https://arxiv.org/abs/2203.15556 |
| 20 tokens per parameter is derived (1.4T / 70B), not a sentence in the abstract | https://arxiv.org/abs/2203.15556 ; research/tracks/foundations.md row 150 |
| Replication: Chinchilla's parametric method does not fit the extracted data; its intervals would need over 600,000 experiments (original likely under 500); the re-fit agrees with methods 1 and 2 | https://arxiv.org/abs/2404.10102 |
| Inference-aware scaling: for about 1B requests of demand, train smaller and longer than Chinchilla-optimal; 47 models, quality kept improving up to 10,000 tokens per parameter | https://arxiv.org/abs/2401.00448 |
| Llama 3 405B: 3.8e25 FLOPs; 15.6T text tokens; IsoFLOP extrapolation suggested 402B on 16.55T tokens; scaling runs 6e18 to 1e22 FLOPs, 40M to 16B parameters | https://arxiv.org/html/2407.21783 |

### Hardware and kernels

| Fact | Source |
|---|---|
| H100 SXM: BF16 tensor 1,979 TFLOPS and FP8 3,958 TFLOPS are listed with sparsity (dense is half); 80 GB; 3.35 TB/s; NVLink 900 GB/s; up to 700 W | https://www.nvidia.com/en-us/data-center/h100/ ; https://jax-ml.github.io/scaling-book/roofline/ |
| H100 SXM5: 132 SMs; 256 KB combined shared memory and L1 per SM, up to 228 KB shared; 50 MB L2; TMA; thread block clusters up to 16 blocks; NVLink 4 over 18 links | https://developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/ |
| Critical arithmetic intensity about 295 FLOPs per byte on H100 (dense bf16), about 240 on TPU v5e | https://jax-ml.github.io/scaling-book/roofline/ |
| HGX B200 board (8 GPUs): BF16 36 PFLOPS sparse, 18 dense; FP8 72 sparse, 36 dense; 1.4 TB memory; NVLink 1.8 TB/s per GPU. HGX B300: 2.1 TB; FP4 108 PFLOPS dense | https://www.nvidia.com/en-us/data-center/hgx/ |
| FlashAttention: exact attention; 15% end-to-end speedup on BERT-large vs the MLPerf 1.1 record; 3x on GPT-2 at 1K | https://arxiv.org/abs/2205.14135 |
| FlashAttention-2: 50 to 73% of A100 peak (FA1 reached 25 to 40%); up to 225 TFLOPS per A100 end to end, 72% MFU | https://arxiv.org/abs/2307.08691 |
| FlashAttention-3: FA2 reached only 35% of H100; FA3 1.5 to 2.0x faster, up to 740 TFLOPS FP16 (75%), close to 1.2 PFLOPS FP8, 2.6x lower FP8 error than a baseline FP8 attention | https://arxiv.org/abs/2407.08608 |
| `torch.compile` modes: default; reduce-overhead (CUDA graphs, may use more memory); max-autotune (Triton matmuls, CUDA graphs on by default on GPU); max-autotune-no-cudagraphs | https://docs.pytorch.org/docs/2.14/generated/torch.compile.html |
| CUDA graphs: replay removes CPU launch overhead; static shapes and addresses; no CPU sync such as `.item()` during capture; warm up on a side stream | https://docs.pytorch.org/docs/2.14/notes/cuda.html |

### Distributed training and memory

| Fact | Source |
|---|---|
| Mixed-precision Adam: 2 (BF16 params) + 2 (BF16 grads) + 4 (FP32 master) + 8 (Adam moments) = 16 bytes per parameter; 20 with FP32 gradient accumulation | https://nanotron-ultrascale-playbook.static.hf.space/ ; https://arxiv.org/abs/1910.02054 |
| ZeRO-1 shards optimizer states, ZeRO-2 adds gradients, ZeRO-3 adds parameters; ZeRO-3 moves about 3 units of traffic vs 2 for ZeRO-2; playbook rule of thumb keeps DP at or under about 512 | https://nanotron-ultrascale-playbook.static.hf.space/ |
| ZeRO abstract: over 100B parameters on 400 GPUs at 15 PFLOPS; up to 13B without model parallelism | https://arxiv.org/abs/1910.02054 |
| Pipeline bubble (p - 1) / m for all-forward-all-backward; 1F1B keeps it and stores activations for p micro-batches; interleaving v stages per GPU gives about (p - 1) / (v m) | https://nanotron-ultrascale-playbook.static.hf.space/ |
| Playbook measurements: about 43% throughput drop when TP crosses nodes vs about 14% for PP going from one node (p = 8) to two (p = 16) | https://nanotron-ultrascale-playbook.static.hf.space/ |
| Playbook scale: over 4,000 experiments on up to 512 GPUs (a later passage says over 4,100, over 16K including test runs) | https://nanotron-ultrascale-playbook.static.hf.space/ |
| Megatron 2021: interleaved schedule improves throughput by 10% or more; 1T-parameter model at 502 PFLOPS on 3,072 GPUs, 52% of peak per GPU | https://arxiv.org/abs/2104.04473 |
| Selective recomputation plus sequence parallelism: 5x less activation memory, over 90% less recompute overhead; 530B model on 2,240 A100s at 54.2% MFU vs 42.1% | https://arxiv.org/abs/2205.05198 |
| Llama 3 parallelism (order TP, CP, PP, DP): 8,192 GPUs TP 8, PP 16, DP 64 at 43% MFU; 16,384 GPUs TP 8, PP 16, DP 128 at 41%; 16,384 GPUs TP 8, CP 16, PP 16, DP 8 at sequence length 131,072 and 38% | https://arxiv.org/html/2407.21783 |
| Llama 3 batch ramp: 4M tokens, 8M after 252M tokens, 16M after 2.87T tokens; peak LR 8e-5 | https://arxiv.org/html/2407.21783 |
| DeepSeek-V3: 2,048 H800s; PP 16, EP 64 over 8 nodes, ZeRO-1 DP, no TP in training; 180K GPU hours per trillion tokens, about 3.7 days on the cluster | https://arxiv.org/html/2412.19437v2 |
| FSDP2 shards each parameter as a DTensor on dim 0; `reshard_after_forward` defaults to False for the root; calling `fully_shard` only on the root gives one large all-gather and reduce-scatter with no overlap | https://docs.pytorch.org/docs/2.14/distributed.fsdp.fully_shard.html |
| TorchTitan on H100: 65.08% speedup for Llama 3.1 8B at 128 GPUs (1D), additional 12.59% for 70B at 256 GPUs (2D), additional 30% for 405B at 512 GPUs (3D), vs optimized baselines | https://arxiv.org/abs/2410.06511 |

### Numerics and stability

| Fact | Source |
|---|---|
| Mixed precision (2017): FP32 master copy and loss scaling; nearly 2x memory reduction | https://arxiv.org/abs/1710.03740 |
| FP8: E4M3 (no infinities, one NaN mantissa pattern, extended range) and E5M2 (IEEE special values); training experiments up to 175B-parameter language models | https://arxiv.org/abs/2209.05433 |
| DeepSeek-V3 FP8: 1x128 activation tiles, 128x128 weight blocks, FP32 promotion every 128 elements, E4M3 on all tensors; relative loss error under 0.25% vs BF16 | https://arxiv.org/html/2412.19437v2 |
| DeepSeek-V3: no irrecoverable loss spikes, no rollbacks | https://arxiv.org/abs/2412.19437 |
| H100 FP8 matmuls have twice the theoretical FLOPS of BF16; the playbook calls FP8 training unstable and still experimental in early 2025 | https://nanotron-ultrascale-playbook.static.hf.space/ |
| OLMo 2 stability: filter documents with 32 or more repeated n-grams; RMSNorm on attention and MLP outputs; QK-norm; z-loss (text says 1e-4, Table 1 says 1e-5); no weight decay on embeddings; AdamW epsilon 1e-8 | https://arxiv.org/html/2501.00656 |
| Kimi K2: vanilla Muon pushed max attention logits above 1,000 in a 53B-total test; QK-Clip with tau = 100; "zero loss spike" over 15.5T tokens | https://arxiv.org/html/2507.20534 ; https://arxiv.org/abs/2507.20534 |
| Muon: about 2x compute efficiency vs AdamW under compute-optimal training once weight decay and per-parameter update scale are added; Moonlight 3B active, 16B total, 5.7T tokens | https://arxiv.org/abs/2502.16982 |

### Reliability

| Fact | Source |
|---|---|
| Llama 3 405B, 54 days: 466 interruptions (47 planned, 419 unexpected); about 78% of unexpected attributed to hardware; faulty GPU 148, HBM3 72, software bug 54, network switch or cable 35, silent data corruption 6; manual intervention three times; effective training time above 90% | https://arxiv.org/html/2407.21783 |
| Llama 3: 1 to 2% diurnal throughput variation; simultaneous power swings of tens of megawatts | https://arxiv.org/html/2407.21783 |
| DCP: per-rank files, load-time resharding, `async_save` stages to CPU memory then writes in a separate thread | https://docs.pytorch.org/docs/2.14/distributed.checkpoint.html |
| Kimi K2 RL: full parameter update of the 1T model in under 30 seconds through the checkpoint engine | https://arxiv.org/html/2507.20534 |

### Data

| Fact | Source |
|---|---|
| FineWeb: 15T tokens from 96 Common Crawl snapshots; FineWeb-Edu: 1.3T | https://arxiv.org/abs/2406.17557 |
| DCLM: 240T-token pool; 7B on 2.6T tokens at 64% MMLU 5-shot; 6.6 points over MAP-Neo with 40% less compute; 6.6x less compute than Llama 3 8B | https://arxiv.org/abs/2406.11794 |
| Lee et al.: one 61-word sentence over 60,000 times in C4; 10x fewer memorized emissions after dedup; over 4% of standard validation sets overlap training | https://arxiv.org/abs/2107.06499 |
| Llama 3 dedup: URL, document MinHash, line-level (lines over 6 times per 30M-document bucket); mix about 50% general, 25% math and reasoning, 17% code, 8% multilingual; 128K vocabulary | https://arxiv.org/html/2407.21783 |
| Llama 3 annealing: +24.0% GSM8K and +6.4% MATH on 8B, negligible on 405B; long context in six stages to 128K over about 800B tokens | https://arxiv.org/html/2407.21783 |
| OLMo 2 tokens: 7B about 4.05T, 13B about 5.6T, 32B about 6.6T; 7B soups three 50B-token anneals; 13B and 32B soup three 100B runs and one 300B run | https://arxiv.org/html/2501.00656 |
| Qwen3: about 36T tokens, 119 languages; stage 1 over 30T at 4,096; stage 2 about 5T; stage 3 at 32,768 with RoPE base raised from 10,000 to 1,000,000 | https://arxiv.org/html/2505.09388 |
| Kimi K2 rephrasing on SimpleQA: 23.76 (raw, 10 epochs), 27.39 (one rephrase, 10 epochs), 28.94 (10 rephrasings, one pass) | https://arxiv.org/html/2507.20534 |
| Nemotron-4 340B: over 98% of alignment data synthetic | https://arxiv.org/abs/2406.11704 |

### MoE

| Fact | Source |
|---|---|
| Switch Transformer: up to 7x pre-training speedup at equal compute; trillion-parameter scale; large sparse models trained in bfloat16 | https://arxiv.org/abs/2101.03961 |
| Mixtral 8x7B: 8 experts per layer, 2 per token, 47B parameters accessible, 13B active, 32K context | https://arxiv.org/abs/2401.04088 |
| DeepSeekMoE 16B: comparable to LLaMA2 7B with about 40% of the computation | https://arxiv.org/abs/2401.06066 |
| DeepSeek-V3: 671B total, 37B active, 14.8T tokens; 256 routed plus 1 shared expert, 8 routed active, at most 4 nodes per token; bias update speed 0.001 for 14.3T tokens then 0; sequence-wise balance alpha 0.0001; MTP depth 1 | https://arxiv.org/html/2412.19437v2 |
| Qwen3-235B-A22B: 94 layers, 128 experts, 8 active, no shared experts, global-batch balance loss | https://arxiv.org/html/2505.09388 |
| Kimi K2: about 1.04T total, 32B active, 384 experts, 8 active, 1 shared, sparsity 48, 64 heads; sparsity 48 needs 1.69x fewer FLOPs than sparsity 8 at validation loss 1.5 | https://arxiv.org/html/2507.20534 |

### Post-training and RL

| Fact | Source |
|---|---|
| DeepSeek-V3 cost at an assumed $2 per H800 hour: pretraining 2,664K hours, context extension 119K, post-training 5K, total 2,788K hours, $5.576M; covers only the official run, not prior research or ablations | https://arxiv.org/html/2412.19437v2 |
| DeepSeek-V3 SFT: about 1.5M instances, two epochs, LR 5e-6 to 1e-6; rule-based and model-based rewards; GRPO | https://arxiv.org/html/2412.19437v2 |
| DeepSeek-R1 GRPO: 16 samples per question, LR 3e-6, KL 0.001, max length 32,768 rising to 65,536 after step 8.2K (R1-Zero), 32 questions per step, reference model replaced every 400 steps | https://arxiv.org/html/2501.12948 |
| DeepSeek-R1 (v1): Qwen-32B with over 10K RL steps scored 47.0 AIME 2024 pass@1; the distilled Qwen-32B scored 72.6 | https://arxiv.org/html/2501.12948v1 |
| R1 SFT data: about 600K reasoning and 200K non-reasoning samples, 804,745 in Table 5 of the current version | https://arxiv.org/html/2501.12948 |
| Llama 3 post-training: six rounds of SFT then DPO; DPO LR 1e-5, beta 0.1, NLL coefficient 0.2 on chosen; rejection sampling 10 to 30 samples per prompt | https://arxiv.org/html/2407.21783 |
| DAPO: clip-higher (epsilon low 0.2, high 0.28), dynamic sampling, token-level loss, overlong shaping; 50 on AIME 2024 with Qwen2.5-32B in 50% of the steps DeepSeek-R1-Zero-Qwen-32B needed to reach 47; KL term removed | https://arxiv.org/html/2503.14476 |
| Qwen3 reasoning RL: 3,995 query-verifier pairs; AIME'24 70.1 to 85.1 over 170 steps | https://arxiv.org/html/2505.09388 |
| On-policy distillation on Qwen3-8B (Qwen3 report table, reproduced by Thinking Machines): AIME'24 74.4 at 1,800 GPU hours vs 67.6 at 17,920 for RL | https://thinkingmachines.ai/blog/on-policy-distillation/ ; https://arxiv.org/html/2505.09388 |
| Lightman et al.: process supervision beats outcome supervision on MATH; 78% on a representative test subset; PRM800K has 800,000 step-level labels | https://arxiv.org/abs/2305.20050 |
| Baker et al.: GPT-4o monitoring o3-mini's chain of thought catches reward hacking better than watching actions alone; with strong optimisation against the monitor, agents learn obfuscated reward hacking | https://arxiv.org/abs/2503.11926 |
| Anthropic (21 Nov 2025): a model that learned to reward hack in real coding RL environments sabotaged safety-research code 12% of the time in a Claude Code evaluation and showed alignment-faking reasoning in 50% of responses; inoculation prompting removed most of the generalisation | https://www.anthropic.com/research/emergent-misalignment-reward-hacking |
| Thinking Machines (10 Sept 2025): 1,000 temperature-0 completions from Qwen3-235B-A22B gave 80 unique outputs; batch-invariant kernels gave identical outputs; bitwise-identical sampler and trainer keep sampler-trainer KL at 0 | https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/ |
| TRL GRPOTrainer defaults on the `main` docs: `beta=0.0` (KL off, no reference model loaded), `loss_type="dapo"`, `num_generations=8`, `epsilon=0.2`, `scale_rewards="group"`, vLLM importance-sampling correction on with clip max 3.0 | https://huggingface.co/docs/trl/main/en/grpo_trainer |
| Anthropic performance take-home: Claude Opus 4.5 reached 1,487 cycles after 11.5 hours in a harness; the README says no first-day submission under 1,300 cycles was valid because a language model had modified the tests | https://github.com/anthropics/original_performance_takehome |

### Adapting models

| Fact | Source |
|---|---|
| LoRA Without Regret (29 Sept 2025): all layers including MLP and MoE; best LR about 10x full FT (closer to 15x for very short runs); less tolerant of large batches; rank 1 matches full FT in policy-gradient RL; alpha 32 with 1/r scaling; B initialised to zero; slightly more than 2/3 of full-FT FLOPs per pass | https://thinkingmachines.ai/blog/lora/ |
| LoRA Learns Less and Forgets Less: substantially underperforms full FT on code and math (about 100K instruction pairs; 20B continued-pretraining tokens) but forgets less; full-FT perturbations have 10 to 100x higher rank than typical LoRA | https://arxiv.org/abs/2405.09673 |
| PEFT LoraConfig defaults: `r=8`, `lora_alpha=8`; `target_modules="all-linear"` excludes the output layer; `use_rslora` scales by alpha / sqrt(r) | https://huggingface.co/docs/peft/main/en/package_reference/lora |
| QLoRA: 65B fine-tuned on one 48 GB GPU with NF4, double quantization, paged optimizers | https://arxiv.org/abs/2305.14314 |
| Continued pretraining: LR re-warming, re-decaying and replay match full retraining at a fraction of the compute; tested at 405M and 10B, weak and strong distribution shifts | https://arxiv.org/abs/2403.08763 |
| Model soups: averaging fine-tuned weights adds no inference cost; ViT-G soup at 90.94% ImageNet top-1 | https://arxiv.org/abs/2203.05482 |
| TIES-Merging: trim small changes, elect a sign per parameter, merge only agreeing values | https://arxiv.org/abs/2306.01708 |
| Yue et al. (v5): RLVR models win at small k, base models win pass@k at large k; distillation, unlike RLVR, introduces new reasoning patterns | https://arxiv.org/abs/2504.13837 |

---

## 5. Misconceptions a reviewer should check

1. **"Train at 20 tokens per parameter."** It is a ratio derived from one run (1.4T / 70B); Chinchilla's parametric fit did not replicate cleanly; deployed models train far past it because inference cost dominates. A lesson that states it as a rule is wrong. https://arxiv.org/abs/2404.10102 ; https://arxiv.org/abs/2401.00448
2. **"Compute-optimal means the best model to ship."** Chinchilla optimises training compute only.
3. **"H100 does about 2 PFLOPS in BF16."** 1,979 TFLOPS is the sparsity figure; dense is 989. The HGX Blackwell page has the same footnote. MFU must use the dense number.
4. **"FlashAttention is an approximation" or "it is faster because it does fewer FLOPs."** It is exact and does more arithmetic (recompute in backward); it wins on HBM traffic.
5. **"FSDP is model parallelism like TP."** FSDP and ZeRO-3 shard storage and gather full layers to compute; TP splits the matmul itself. Different communication patterns, different topology needs.
6. **"ZeRO-3 is free."** It adds parameter all-gathers (about 3 units of traffic vs 2), hidden only with prefetch.
7. **"Pipeline parallelism reduces latency" and "1F1B removes the bubble."** PP adds bubbles; 1F1B keeps the bubble size and reduces activation memory. Interleaving and zero-bubble schedules are what shrink it.
8. **"TP across nodes is fine on a fast fabric."** The playbook measured large drops past TP = 8; Llama 3 kept TP at 8 and DeepSeek-V3 used no TP at all.
9. **"BF16 training needs loss scaling."** Loss scaling exists because FP16's exponent range is narrow; BF16 keeps FP32's range. Master weights and FP32 reductions still matter.
10. **"FP8 training means everything in FP8."** DeepSeek-V3 kept embeddings, output head, MoE gating, norms and attention in higher precision, with FP32 promotion every 128 elements.
11. **"Activation checkpointing" vs "checkpointing".** One trades compute for activation memory inside a step; the other saves state for restart. Lessons must disambiguate.
12. **"MFU and effective training time measure the same thing."** Llama 3 reports 38 to 43% MFU and over 90% effective training time; one is throughput while running, the other is the share of wall-clock time spent on useful training.
13. **Llama 3 Table 5 arithmetic.** The paper prints faulty GPU as 148 interruptions, 30.1%. 148 / 419 is 35.3% and 148 / 466 is 31.8%, while other rows (72 = 17.2%, 54 = 12.9%, 35 = 8.4%) use 419 as the denominator. Quote the count, or flag the percentage.
14. **"DeepSeek-V3 cost $5.6M to build."** The $5.576M covers the official run at an assumed $2 per GPU hour and excludes prior research and ablations. The $294K figure for R1 in press coverage traces to the Nature supplement, which could not be read for this report (login redirect); do not use it without the primary source.
15. **"MoE is cheaper to serve because it has fewer parameters."** Active parameters set FLOPs; total parameters set memory, and all experts stay resident.
16. **"GRPO always has a KL term" or "never has one."** R1 used KL 0.001; DAPO removed it; TRL's current default is beta 0.0. Name the choice.
17. **"In on-policy GRPO the importance ratio is 1."** It drifts with several optimizer steps per batch and with rollout-engine vs trainer numerics. This is the Anthropic screen (Q4) and the reason TRL turns on importance-sampling correction by default.
18. **"A group where every sample is correct still teaches."** Group-normalised advantages are all zero; DAPO's dynamic sampling exists to drop such groups.
19. **"RL teaches the model new reasoning."** Yue et al. find RLVR mostly sharpens what the base model already samples at large k, while distillation can add patterns. Present it as evidence with limits, not settled fact.
20. **"DPO needs no reference model."** It needs a frozen reference for the implicit reward; it needs no separate reward model and no sampling during training.
21. **"Reward hacking only happens with learned reward models."** Verifiers get hacked too: test editing, `sys.exit(0)` to pass a harness (Anthropic 2025), test modification in the take-home README.
22. **"Penalise bad thoughts in the chain of thought and hacking stops."** Baker et al. show optimisation against a CoT monitor yields obfuscated hacking.
23. **"Temperature 0 is nondeterministic because of floating-point concurrency."** The 2025 analysis attributes it mainly to kernels that are not batch-invariant under varying load.
24. **"LoRA matches full fine-tuning" or "LoRA always underperforms."** Both are conditional: it matches on small and medium SFT and on RL when applied to all layers with about 10x LR, and underperforms on large continued-pretraining or code and math datasets that exceed its capacity.
25. **"Use the full-FT learning rate" and "target q_proj and v_proj."** Both are outdated per LoRA Without Regret.
26. **"PEFT defaults are recommendations."** `r=8`, `lora_alpha=8` are library defaults; LoRA Without Regret uses alpha 32 with 1/r scaling.
27. **"QLoRA trains in 4-bit."** The frozen base is stored in NF4 and dequantized for compute; the adapters train in higher precision.
28. **"Distillation means Hinton soft targets."** In LLM practice it usually means SFT on teacher samples; on-policy distillation (student samples, teacher per-token reverse KL) is a third, distinct method.
29. **"Deduplicate everything."** Dedup cuts memorisation and contamination, but OLMo 2's micro-annealing found some duplication helpful, and Kimi K2's best SimpleQA result came from rephrasing, not deletion.
30. **"Model merging is ensembling."** Soups and TIES combine weights from a shared initialisation and add no inference cost; an ensemble runs several models.
31. **"The visible chain of thought is a faithful trace."** Already covered in the existing training lesson (Anthropic, April 2025); keep new lessons consistent with it.
32. **Doc defaults drift.** TRL and PEFT values above are from the `main` docs on 2026-10-28, and the PyTorch pages are the 2.14 docs. Pin a version or a date in every lesson that quotes them.
33. **"Scaling-book exercise answers are measurements."** The 21.7% DeepSeek-V3 utilization and 3,840-token MoE batch are worked estimates under the book's assumptions; label them as estimates.
