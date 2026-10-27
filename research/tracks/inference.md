# Track research: Inference, serving and cost

Track slug: `inference`. Modules: `inference-anatomy`, `batching`, `faster-cheaper`, `gateways-finops`, `operating`. Problem id prefix: `inf`. Core slots: 10 (SPEC section 7).

Every source below was opened on 2026-10-28 unless a different date is given. "Checked" means the page was fetched and the quoted figure was found on it. Where a figure is computed rather than quoted, the arithmetic is shown and the inputs are sourced. Figures that could not be sourced are listed under "Not sourced" at the end of each module; lessons should not state them.

Abbreviations: TTFT (time to first token), TPOT (time per output token), ITL (inter-token latency), KV (key/value), TP (tensor parallelism), PP (pipeline parallelism), GQA (grouped-query attention), MQA (multi-query attention), MLA (multi-head latent attention), bpw (bits per weight).

---

## 1. Verified facts by module

### 1.1 inference-anatomy (prefill, decode, KV cache, GQA, metrics)

**Model configs used for KV cache math** (all checked 2026-10-28)

| Model | Layers | Query heads | KV heads | Head dim | Source |
|---|---|---|---|---|---|
| Llama 3 8B | 32 | 32 | 8 | 128 (4096 / 32) | Llama 3 paper, Table 3: https://arxiv.org/html/2407.21783 |
| Llama 3 70B | 80 | 64 | 8 | 128 (8192 / 64) | same |
| Llama 3 405B | 126 | 128 | 8 | 128 (16384 / 128) | same |
| Qwen3-32B | 64 | 64 | 8 | 128 (explicit `head_dim`; 5120 / 64 would give 80, so do not derive it) | https://huggingface.co/Qwen/Qwen3-32B/raw/main/config.json |
| gpt-oss-120b | 36, alternating `sliding_attention` and `full_attention`, `sliding_window` 128 | 64 | 8 | 64 | https://huggingface.co/openai/gpt-oss-120b/raw/main/config.json |
| DeepSeek-V3 | 61 | 128 | MLA: caches the `kv_lora_rank` 512 latent plus the `qk_rope_head_dim` 64 decoupled key per token per layer | n/a | https://huggingface.co/deepseek-ai/DeepSeek-V3/raw/main/config.json and DeepSeek-V2 paper Table 1: https://arxiv.org/html/2405.04434 |

Other config facts: Llama 3 uses GQA "with 8 key-value heads to improve inference speed", which also shrinks the KV cache (Llama 3 paper). Vocabulary sizes: 128,000 (Llama 3), 151,936 (Qwen3-32B), 201,088 (gpt-oss-120b). gpt-oss-120b has 128 experts with 4 active per token and ships MXFP4 weights, leaving attention, router, embeddings and LM head unquantized. DeepSeek-V3 has 256 routed experts with 8 per token. All from the configs above.

**KV cache formula and computed sizes** (snippets 1 and 2, BF16 = 2 bytes)

- Per token: `2 (K and V) x layers x kv_heads x head_dim x bytes_per_element`.
- Llama 3 8B: 131,072 B (128 KiB) per token. Llama 3 70B: 327,680 B (320 KiB). Llama 3 405B: 516,096 B (504 KiB). Qwen3-32B: 262,144 B (256 KiB).
- Llama 3 70B at 32,768 context and batch 8: 85.9 GB (exactly 80 GiB). This is the brief's estimate question; the answer depends on using 8 KV heads, not 64.
- With 64 KV heads (full multi-head attention) the same model's cache would be 8 times larger.
- gpt-oss-120b: only the 18 full-attention layers grow with context; the 18 sliding layers cap at 128 tokens. About 1.21 GB per sequence at 32,768 tokens and 4.84 GB at 131,072, assuming a BF16 KV cache.
- DeepSeek-V3 MLA: 61 x (512 + 64) x 2 B = 70,272 B per token. The DeepSeek-V2 paper gives MLA's cache as `(d_c + d_h^R) l` elements per token versus `2 n_h d_h l` for MHA, `2 n_g d_h l` for GQA and `2 d_h l` for MQA (Table 1). Its abstract reports that DeepSeek-V2 "reduces the KV cache by 93.3%" and raises maximum generation throughput to 5.76 times that of DeepSeek 67B: https://arxiv.org/abs/2405.04434

**vLLM paper numbers on KV cache** (Kwon et al., SOSP 2023): https://arxiv.org/abs/2309.06180 and https://arxiv.org/html/2309.06180

- OPT-13B KV cache per token: 800 KB, computed as 2 x 5120 (hidden) x 40 (layers) x 2 bytes.
- OPT can generate up to 2048 tokens, so one request's KV cache "can be as much as 1.6 GB".
- On an A100 40GB serving a 13B model, about 65% of memory holds weights and close to 30% holds request state.
- In existing systems "only 20.4% - 38.2% of the KV cache memory is used to store the actual token states".
- Abstract: vLLM "improves the throughput of popular LLMs by 2-4" times at the same latency versus FasterTransformer and Orca.
- Default block size: 16 tokens.
- The vLLM launch blog (2023-06-20) says existing systems "waste 60% - 80% of memory", that PagedAttention limits waste to the last block, "under 4%", and claims up to 24x throughput versus Hugging Face Transformers and 3.5x versus TGI on LLaMA-7B (A10G) and LLaMA-13B (A100 40GB). Sharing cuts memory "by up to 55%" for parallel sampling and beam search: https://vllm.ai/blog/2023-06-20-vllm

**MQA and GQA**

- GQA paper (Ainslie et al., 2023): uptrains multi-head checkpoints with "5% of original pre-training compute"; GQA uses more than one but fewer KV heads than query heads; quality close to MHA at speed close to MQA: https://arxiv.org/abs/2305.13245
- MQA keeps a single KV head. The original MQA paper (arXiv 1911.02150) was not re-fetched in this pass; cite it via the GQA paper or fetch before quoting.

**GPU specs (memory bandwidth is the decode bound)**

| GPU | Memory | Bandwidth | FP8 Tensor | BF16 Tensor | TDP | Source |
|---|---|---|---|---|---|---|
| H100 SXM | 80 GB | 3.35 TB/s | 3,958 TFLOPS (with sparsity) | 1,979 TFLOPS (with sparsity) | up to 700 W | https://www.nvidia.com/en-us/data-center/h100/ |
| H100 NVL | 94 GB | 3.9 TB/s | 3,341 TFLOPS (with sparsity) | 1,671 TFLOPS (with sparsity) | 350 to 400 W | same |
| H200 SXM | 141 GB | 4.8 TB/s | 3,958 TFLOPS (sparse figure) | not recorded | up to 700 W | https://www.nvidia.com/en-us/data-center/h200/ |
| DGX B200 (8 GPUs) | 1,440 GB total | 64 TB/s total HBM3e | 72 PFLOPS (sparse) | not recorded | not recorded | https://www.nvidia.com/en-us/data-center/dgx-b200/ (FP4: 144 PFLOPS sparse, 72 dense) |

Derived, with the arithmetic shown: DGX B200 per GPU is 1,440 / 8 = 180 GB and 64 / 8 = 8 TB/s. NVIDIA's tensor figures carry a sparsity asterisk and dense is half. H100 SXM dense BF16 is therefore about 989.5 TFLOPS, and its ridge point is about 989.5e12 / 3.35e12 = 295 FLOPs per byte (snippet 3).

**Why decode is bandwidth bound** (computed in snippet 3): each decode step reads every weight once for the whole batch plus each sequence's own KV cache. A 70B-class model in FP8 (about 70 GB) on one H200 at 4.8 TB/s has a floor of 14.7 ms per step at batch 1, so at most about 68 tokens/s per user. At batch 32 with 4,096-token contexts the floor rises to 23.5 ms per step (at most 42.5 tok/s per user) while total throughput rises to about 1,360 tok/s, using 112.9 GB. Batch 64 at the same context needs 155.9 GB and does not fit. These are upper bounds from a bandwidth model, not measurements.

**Latency metrics**

- NVIDIA NIM benchmarking docs: TTFT is "the time from query submission to the first received token"; `e2e_latency = TTFT + generation_time`; ITL is "also known as time per output token (TPOT)", with `ITL = (e2e_latency - TTFT) / (total_output_tokens - 1)`, so the first token is excluded; the page notes tools differ on whether TTFT is included. System TPS = total output tokens / (last response time - first request time); per-user TPS = output length / e2e latency: https://docs.nvidia.com/nim/benchmarking/llm/latest/metrics.html
- Databricks (MosaicML team, 2023-10-12): latency = TTFT + TPOT x output tokens; MBU = achieved bandwidth / peak bandwidth, where achieved = (parameter bytes + KV bytes) / TPOT; worked example: 7B in 16-bit at 14 ms TPOT moves about 1 TB/s, 50% MBU on a 2 TB/s part. "Input length is not significant for performance but important for hardware requirements." In one A100 example, batch 64 raised latency about 4x while throughput rose about 14x: https://www.databricks.com/blog/llm-inference-performance-engineering-best-practices
- Goodput: DistServe frames it as the maximum request rate served while meeting both TTFT and TPOT SLOs (abstract wording, no formal definition there): https://arxiv.org/abs/2401.09670
- vLLM Prometheus metric names, read from `vllm/v1/metrics/loggers.py` on main: `vllm:time_to_first_token_seconds`, `vllm:inter_token_latency_seconds`, `vllm:request_time_per_output_token_seconds`, `vllm:e2e_request_latency_seconds`, `vllm:request_queue_time_seconds`, `vllm:num_requests_running`, `vllm:num_requests_waiting`, `vllm:kv_cache_usage_perc`, `vllm:prefix_cache_hits`, `vllm:prefix_cache_queries`, `vllm:num_preemptions`: https://raw.githubusercontent.com/vllm-project/vllm/main/vllm/v1/metrics/loggers.py and https://docs.vllm.ai/en/latest/design/metrics.html

Not sourced: the exact parameter count of Llama 3 70B (Table 3 gives architecture only; write "about 70B"); activation memory during serving; any measured tokens/s for a specific GPU and model.

### 1.2 batching (continuous batching, PagedAttention, chunked prefill, scheduling)

- Orca (Yu et al., OSDI 2022) introduced iteration-level scheduling and selective batching; up to 36.9x throughput over FasterTransformer on GPT-3 175B at the same latency: https://www.usenix.org/conference/osdi22/presentation/yu
- Anyscale blog (2023-06-22; Daniel, Shen, Liang, Liaw): "Up to 23x throughput improvement using continuous batching" when combined with vLLM's memory optimizations; about 8x is credited to continuous batching alone over naive batching: https://www.anyscale.com/blog/continuous-batching-llm-inference
- PagedAttention: KV cache in fixed-size blocks mapped by a per-request block table, like OS virtual-memory pages; default block size 16; waste limited to the last block (vLLM paper and blog above).
- Sarathi-Serve (Agrawal et al.; arXiv 2024-03-04, v3 2024-06-17; the abstract page lists no venue): chunked prefills split a prefill into near-equal chunks batched with decodes ("stall-free" scheduling); 2.6x serving capacity over vLLM for Mistral-7B on one A100, up to 3.7x for Yi-34B on two A100s, up to 5.6x end to end for Falcon-180B with PP: https://arxiv.org/abs/2403.02310
- vLLM V1 (alpha announced 2025-01-27): 1.7x throughput over V0; prefix caching on by default with "less than 1% decrease in throughput even when the cache hit rate is 0%"; one scheduler expresses each step as `{request_id: num_tokens}`, which covers chunked prefill, prefix caching and speculative decoding without separate prefill and decode phases; EngineCore runs scheduler and executor in an isolated process and overlaps tokenization and detokenization; piecewise CUDA graphs and FlashAttention 3: https://vllm.ai/blog/2025-01-27-v1-alpha-release
- vLLM optimization docs: "In vLLM V1, the default preemption mode is `RECOMPUTE` rather than `SWAP`"; chunked prefill "is enabled by default whenever possible"; lower `max_num_batched_tokens` (for example 2048) gives better ITL, higher gives better TTFT, and more than 8192 is suggested for throughput: https://docs.vllm.ai/en/latest/configuration/optimization.html
- vLLM V1 guide: "We have fully deprecated V0"; removed `best_of`, per-request logits processors and GPU-CPU KV cache swapping ("vLLM V1 no longer requires KV cache swapping to handle request preemptions"); prompt logprobs bypass the prefix cache: https://docs.vllm.ai/en/latest/usage/v1_guide.html
- V0 code removal is reported for release v0.11.0 ("V1 is the only engine in the codebase now") by a third-party mirror of the release notes: https://newreleases.io/project/pypi/vllm/release/0.11.0. Confirm on the GitHub release page before quoting.
- Latest release on the vLLM GitHub releases page: v0.32.0, dated 18 Oct (2026); notes mention NVFP4 KV cache support on more GPU generations: https://github.com/vllm-project/vllm/releases
- nano-vLLM (about 1,200 lines) is cited in brief.json as a reading target; the line count was not re-verified in this pass.

Not sourced: a general "continuous batching gives N times" figure. The 23x and 36.9x numbers are workload- and baseline-specific; quote them with their conditions or use the snippet 6 toy simulator.

### 1.3 faster-cheaper (quantization, speculative decoding, prefix caching, disaggregation, parallelism, small-model routing)

**Quantization**

- GPTQ (Frantar et al., ICLR 2023): one-shot weight quantization using approximate second-order information; 3 or 4 bits; a 175B model quantized in about four GPU hours; about 3.25x speedup on A100 and 4.5x on A6000 over FP16: https://arxiv.org/abs/2210.17323
- AWQ (Lin et al.; MLSys 2024 Best Paper per the arXiv comments; v6 revised 2026-04-25): "Protecting only 1% salient weights can greatly reduce quantization error"; salient channels are chosen from activation statistics; the TinyChat 4-bit runtime is over 3x faster than Hugging Face FP16: https://arxiv.org/abs/2306.00978
- FP8 formats (Micikevicius et al., 2022): E4M3 (4 exponent bits, 3 mantissa bits, no infinities, one NaN pattern) and E5M2 (IEEE-style special values); FP8 post-training quantization handled language models that int8 did not: https://arxiv.org/abs/2209.05433. The abstract page does not say which format to use for what.
- GGUF is a file format (tensors plus metadata) from the llama.cpp author, not a quantization algorithm. Bits per weight: Q2_K 2.625, Q3_K 3.4375, Q4_K 4.5, Q5_K 5.5, Q6_K 6.5625, IQ4_XS 4.25; legacy Q8_0 uses blocks of 32 weights with one scale: https://huggingface.co/docs/hub/gguf. The Q8_0 block is `ggml_half d; int8_t qs[32]`, so 8.5 bpw: https://raw.githubusercontent.com/ggml-org/llama.cpp/master/ggml/src/ggml-common.h
- Computed weight sizes for a 70B-class model (snippet 12): BF16 140 GB, FP8 70 GB, Q8_0 74.4 GB, Q6_K 57.4 GB, Q4_K 39.4 GB, bare INT4 35 GB.
- vLLM quantized KV cache: `fp8_e4m3` (CUDA 11.8+ and ROCm) and `fp8_e5m2` (CUDA 11.8+); scales default to 1.0 without calibration; llm-compressor calibration recommended; sliding-window layers "are more sensitive to KV-cache quantization": https://docs.vllm.ai/en/latest/features/quantization/quantized_kvcache.html. FP8 halves KV bytes per element versus BF16 by arithmetic; the page gives no measured capacity multiplier.

**Speculative decoding**

- Leviathan, Kalman, Matias (arXiv 2022-11-30, ICML 2023): 2X-3X on T5-XXL "with identical outputs". Equation (1): expected tokens per run `(1 - alpha^(gamma+1)) / (1 - alpha)`. Theorem 3.8: walltime improvement `(1 - alpha^(gamma+1)) / ((1 - alpha)(gamma c + 1))`, where c is the draft's cost relative to the target. A draft about two orders of magnitude smaller usually worked best, and c was always below 0.05 in their experiments: https://arxiv.org/abs/2211.17192 (formulas read from the PDF)
- Chen et al. (DeepMind, 2023-02-02): modified rejection sampling "preserves the distribution of the target model within hardware numerics"; 2-2.5x on Chinchilla 70B in a distributed setup: https://arxiv.org/abs/2302.01318
- Medusa (2024-01-19): extra decoding heads plus tree attention; Medusa-1 over 2.2x, Medusa-2 2.3x to 3.6x. Its "typical acceptance" scheme does not claim to preserve the base model's distribution ("we do not insist on an exact correspondence"): https://arxiv.org/abs/2401.10774 and https://arxiv.org/html/2401.10774
- EAGLE (2024-01-26): feature-level autoregression; 2.7x to 3.5x latency speedup and doubled throughput on LLaMA2-Chat 70B while maintaining "the distribution of the generated text": https://arxiv.org/abs/2401.15077
- EAGLE-3 (2025-03-03, v3 2025-04-23): direct token prediction with multi-layer feature fusion ("training-time test"); up to 6.5x speedup, about 1.4x over EAGLE-2, and 1.38x throughput in SGLang at batch 64: https://arxiv.org/abs/2503.01840
- MagicDec (v5 2025-04-02): speculative decoding can help at large batch for moderate to long contexts because KV loading grows with batch; up to 2.51x for Llama3.1-8B at batch 32 to 256: https://arxiv.org/abs/2408.11049
- vLLM docs: methods include EAGLE (config value `eagle3` for EAGLE-3), MTP, draft model, PARD, n-gram, suffix decoding, and a lossy "FLy" verification; sampling is "theoretically lossless up to the precision limits of hardware numerics"; batch size changes can shift logprobs: https://docs.vllm.ai/en/latest/features/speculative_decoding/
- SGLang docs: EAGLE-2, EAGLE-3 (recommended), MTP, STANDALONE draft model, NGRAM; parameters `--speculative-num-steps`, `--speculative-eagle-topk`, `--speculative-num-draft-tokens`; LLaMA-Instruct 3.1 8B on one H100 on MT-Bench: 158.34 tok/s without speculation, 244.10 with EAGLE-2, 373.25 with EAGLE-3: https://docs.sglang.io/advanced_features/speculative_decoding.html

**Prefix caching and RadixAttention**

- vLLM automatic prefix caching: each full block is hashed from the parent hash, the block's tokens and extra keys (LoRA id, multimodal hashes, and `cache_salt` injected into the first block); "We only cache full blocks"; reference counts protect in-use blocks; LRU eviction from a free queue: https://docs.vllm.ai/en/latest/design/prefix_caching.html
- SGLang (Zheng et al.; arXiv v1 2023-12-12, v2 2024-06-06): RadixAttention keeps KV for prompts and outputs in a radix tree with LRU eviction of leaves; up to 6.4x throughput (abstract); longest-shared-prefix-first scheduling is equivalent to DFS order, and Theorem 3.1 says DFS order gives the optimal hit rate for a batch when the cache holds at least the longest request: https://arxiv.org/abs/2312.07104 and https://arxiv.org/html/2312.07104. The LMSYS launch blog (2024-01-17) says "up to 5 times higher throughput": https://lmsys.org/blog/2024-01-17-sglang/
- SGLang docs describe the runtime as built on "RadixAttention, prefix caching, and multi-GPU parallelism" and claim use across more than 400,000 GPUs (project claim): https://docs.sglang.io/
- LMCache (2025-10-08, v2 2025-12-05): a KV cache layer that offloads to CPU and storage, shares KV across vLLM and SGLang, and moves KV for disaggregation; "up to 15x improvement in throughput" on multi-round QA and document analysis (author claim): https://arxiv.org/abs/2510.09665

**Disaggregated prefill and decode**

- DistServe (OSDI 2024): colocating the phases causes interference; 7.4x more requests or a 12.6x tighter SLO while meeting latency for over 90% of requests: https://arxiv.org/abs/2401.09670
- Splitwise (arXiv 2023-11-30): 1.4x throughput at 20% lower cost, or 2.35x throughput at the same cost and power: https://arxiv.org/abs/2311.18677
- vLLM docs: "Disaggregated prefill DOES NOT improve throughput"; the reasons to use it are tuning TTFT and ITL separately and controlling tail ITL; connectors include NixlConnector, LMCacheConnectorV1 and MooncakeConnector; marked experimental: https://docs.vllm.ai/en/latest/features/disagg_prefill.html
- SGLang PD disaggregation: "Incoming prefill batches frequently interrupt ongoing decode batches"; transfer engines Mooncake and NIXL; a router in PD mode: https://docs.sglang.io/advanced_features/pd_disaggregation.html
- NVIDIA Dynamo (2025-03-18): planner, KV-aware router (radix tree of request hashes), distributed KV cache manager, NIXL transfer library; backends TensorRT-LLM, vLLM, SGLang; vendor claims "up to 30x" more requests for DeepSeek-R1 on GB200 NVL72 (FP4, ISL/OSL 32K/8K, projected) and more than 2x for Llama 70B on Hopper (vLLM, FP8, ISL/OSL 3K/50): https://developer.nvidia.com/blog/introducing-nvidia-dynamo-a-low-latency-distributed-inference-framework-for-scaling-reasoning-ai-models/
- llm-d (2025-05-20; authors from Red Hat, Google and IBM): Kubernetes-native distributed inference on vLLM with the Inference Gateway, prefix- and KV-cache-aware routing, disaggregated serving and KV offloading: https://llm-d.ai/blog/llm-d-announce

**Parallelism**

- Megatron-LM (2019): intra-layer (tensor) parallelism from a few communication ops; 8.3B parameters on 512 GPUs at 15.1 PFLOPs, 76% scaling efficiency: https://arxiv.org/abs/1909.08053
- vLLM guidance: use TP "When the model is too large to fit on a single GPU" (higher TP adds synchronization overhead); use PP when TP is maxed out "or across nodes" (higher PP adds latency): https://docs.vllm.ai/en/latest/configuration/optimization.html
- Expert parallelism: the Dynamo post's DeepSeek-R1 configuration lists EP settings; no general EP sizing rule was sourced.

**Routing to smaller models**

- FrugalGPT (2023-05-09): an LLM cascade matching the best single model "with up to 98% cost reduction", or 4% better accuracy at the same cost (authors' benchmarks): https://arxiv.org/abs/2305.05176
- RouteLLM (v4 2025-02-23): routers trained on preference data; cost reductions "over 2 times in certain cases" without quality loss: https://arxiv.org/abs/2406.18665

Not sourced: a general accuracy-loss figure for INT4 or FP8 on current models (model- and task-specific; lessons should tell readers to measure on their own eval set); distillation speed or cost figures.

### 1.4 gateways-finops (gateways, routing, batch APIs, prompt caching prices, budgets)

**Hosted API list prices** (USD per million tokens, all checked 2026-10-28; lessons must carry this date)

OpenAI, https://developers.openai.com/api/docs/pricing (redirect target of platform.openai.com/docs/pricing). Standard tier, short context:

| Model | Input | Cached input | 30m cache write | 12h cache write | Output |
|---|---|---|---|---|---|
| gpt-6-astra | 10.00 | 1.00 | 12.50 | 25.00 | 50.00 |
| gpt-6.1-sol | 2.00 | 0.10 | 2.50 | 5.00 | 10.00 |
| gpt-6.1-terra | 1.00 | 0.05 | 1.25 | 2.50 | 5.00 |
| gpt-6-luna | 0.10 | 0.01 | 0.125 | 0.25 | 0.50 |

The same page lists a Batch tier at half these rates (gpt-6-astra 5.00 input, 25.00 output), a "Fast" tier at double, an "Ultrafast" tier at six times for gpt-6-astra and gpt-6.1-sol, a 10% uplift for regional processing on models released on or after 2026-03-05, and the note "Priority processing was renamed Fast mode on July 30, 2026." Older rows still listed: gpt-5.5 at 5.00 input, 0.50 cached, 30.00 output; gpt-5.4 at 2.50, 0.25, 15.00.

Anthropic, https://platform.claude.com/docs/en/about-claude/pricing (redirect target of docs.anthropic.com):

| Model | Base input | 5m cache write | 1h cache write | Cache hit | Output |
|---|---|---|---|---|---|
| Claude Fable 5.1 | 10 | 12.50 | 20 | 0.25 | 50 |
| Claude Opus 5.5 | 4 | 5 | 8 | 0.20 | 20 |
| Claude Opus 5 | 5 | 6.25 | 10 | 0.50 | 25 |
| Claude Sonnet 5.5 | 2 | 2.50 | 4 | 0.10 | 10 |
| Claude Sonnet 5 | 2 | 2.50 | 4 | 0.20 | 10 |
| Claude Haiku 5.5 (prompt up to 100,000 tokens) | 0.10 | 0.125 | 0.20 | 0.01 | 0.50 |
| Claude Haiku 5.5 (prompt over 100,000 tokens) | 0.50 | 0.625 | 1 | 0.05 | 2.50 |
| Claude Haiku 4.5 | 1 | 1.25 | 2 | 0.10 | 5 |

Multipliers on the same page: 5-minute write 1.25x, 1-hour write 2x, cache read 0.1x base input, except 0.05x on Opus 5.5 and Sonnet 5.5 and 0.025x on Fable 5.1 and Mythos 5.1. Batch API: "50 percent discount on both input and output tokens". Fast mode for Opus 5.5 costs $8 input and $40 output and is not available with Batch. US-only inference (`inference_geo: "us"`) is 1.1x for Claude 4.6 and later. Claude 4.6 and later (except Haiku 5.5) bill the full 1M context window at standard rates. Claude 4.7 and later use a tokenizer that "produces approximately 30% more tokens for the same text".

Google Gemini, https://ai.google.dev/gemini-api/docs/pricing (page shows "Last updated 2026-10-27 UTC"), paid tier:

| Model | Input | Output (incl. thinking) | Context cache read | Batch input / output |
|---|---|---|---|---|
| gemini-3.1-pro-preview, prompts up to 200k | 2.00 | 12.00 | 0.20, plus 4.50 per M tokens per hour storage | 1.00 / 6.00 |
| gemini-3.1-pro-preview, prompts over 200k | 4.00 | 18.00 | 0.40 | 2.00 / 9.00 |
| gemini-3.8-flash (through 2026-12-31) | 0.75 | 3.75 | 0.075 | 0.375 / 1.875 |
| gemini-3.8-flash (from 2027-01-01) | 1.50 | 7.50 | 0.15 | 0.75 / 3.75 |
| gemini-3.5-flash-lite | 0.30 | 2.50 | 0.03 | 0.15 / 1.25 |

**Batch APIs**

- OpenAI Batch: "50% cost discount compared to synchronous APIs"; "Each batch completes within 24 hours"; a separate rate-limit pool; up to 50,000 requests and 200 MB per input file: https://developers.openai.com/api/docs/guides/batch
- Anthropic and Gemini Batch: 50% (pricing pages above).

**Prompt caching mechanics**

- OpenAI: the minimum cacheable prompt is 1,024 tokens for GPT-5.6 and later; routing uses a hash of the initial tokens plus an optional `prompt_cache_key`; for GPT-5.6 and later, `prompt_cache_options.ttl` is "30m" (default, 1.25x write) or "12h" (2.5x write); caches are not shared across organizations: https://developers.openai.com/api/docs/guides/prompt-caching
- Anthropic: the minimum cacheable length is model-specific (512 tokens for the 5.x generation listed, 1,024 for Sonnet 4.5 and 4.6, 4,096 for Opus 4.5, Opus 4.6 and Haiku 4.5); shorter prompts are processed without caching "and no error is returned"; up to 4 breakpoints; prefix order is `tools`, `system`, then `messages`, and a change at one level invalidates that level and all later ones: https://platform.claude.com/docs/en/build-with-claude/prompt-caching

**Gateways**

- LiteLLM proxy budgets: `max_budget` and `budget_duration` per key, user, team and customer; budgets need Postgres, and the global `max_budget` "fails open" without a database; `tpm_limit`, `rpm_limit`, `max_parallel_requests`; budget reservation estimates cost before the call; fail-closed options return 503 during Redis outages: https://docs.litellm.ai/docs/proxy/users
- LiteLLM Router: strategies `simple-shuffle` (default, recommended), `least-busy`, `usage-based-routing` (not recommended for production), `latency-based-routing`, `cost-based-routing`; `num_retries`; a deployment cools down after `allowed_fails` (default 3 per minute) for `cooldown_time` (default 5 s): https://docs.litellm.ai/docs/routing
- Portkey AI Gateway: fallbacks, load balancing across keys, conditional routing, retries, timeouts, simple and semantic caching, budget and rate limits; open source, runnable with `npx @portkey-ai/gateway` (licence not stated on that page): https://portkey.ai/docs/product/ai-gateway
- OpenRouter provider routing: by default prefers providers without significant outages in the last 30 seconds and weights each by "the inverse square of its price" (a $1 provider is about 9 times likelier to be tried first than a $3 one); `sort` by price, throughput or latency disables load balancing; other fields: `allow_fallbacks`, `order`, `only`, `ignore`, `data_collection`, `quantizations`, `max_price`: https://openrouter.ai/docs/features/provider-routing
- OpenRouter fees: "there is no markup on inference pricing"; a 5.5% platform fee on credit purchases (Standard plan); BYOK free up to $25,000 of list-price usage per month, then 5%: https://openrouter.ai/docs/faq and https://openrouter.ai/pricing
- OpenRouter Auto Router (`openrouter/auto`): classifies each prompt into about 30 task types and ranks models by trailing 7-day spend share, with a `cost_tier` setting; no extra fee: https://openrouter.ai/docs/features/model-routing

**FinOps**

- FinOps Foundation pages returned HTTP 403 to the fetcher (https://www.finops.org/wg/finops-for-ai-overview/ and https://www.finops.org/wg/token-economics-saas/). Search snippets indicate the Foundation recommends unit metrics such as cost per query, user or workflow. Treat this as unverified until someone opens the page in a browser.
- Snippet 8 shows that prompt caching at a low hit rate costs more than no caching because of the write premium. This follows from the published multipliers.

Not sourced: GPU hourly rental prices (no provider page fetched; snippet 8 takes them as inputs), any "typical" cache hit rate, any "typical" cascade escalation rate.

### 1.5 operating (autoscaling, SLOs, rollout, load testing)

- GKE autoscaling best practices (last updated 2026-10-26): recommends queue size (to maximise throughput within a latency target) and batch size (for lower latency targets) as autoscaling metrics; GPU utilization "Does not measure how much work is being done while the GPU is active": https://docs.cloud.google.com/kubernetes-engine/docs/best-practices/machine-learning/inference/autoscaling
- Google SRE workbook: an SLI as good events divided by total events; "the error budget is 100% minus the SLO"; an error budget policy can freeze risky launches: https://sre.google/workbook/implementing-slos/
- vLLM exposes queue, running, waiting, KV usage and preemption metrics (section 1.1) that map onto these autoscaling and SLO signals.
- The techinterview.org prompt "Design an LLM Inference API" (published 2026-04-16) uses 10M calls per day, about 1,000 rps at peak, TTFT under 500 ms and at least 30 tokens/s. These are interview assumptions, not industry facts: https://www.techinterview.org/post/3233460079/design-an-llm-inference-api/

Not sourced: GPU node cold-start durations, model load times, multi-region failover times. Lessons should say "measure in your environment" and use the capacity snippet with labelled assumptions.

---

## 2. Latest developments (2025 and 2026) to cover

| Topic | What to teach | Primary source and date |
|---|---|---|
| vLLM V1 engine | One token-budget scheduler, prefix caching and chunked prefill on by default, recompute preemption, no KV swap | https://vllm.ai/blog/2025-01-27-v1-alpha-release (2025-01-27); https://docs.vllm.ai/en/latest/usage/v1_guide.html; https://docs.vllm.ai/en/latest/configuration/optimization.html |
| V0 removal | V1 is the only engine from v0.11.0 | https://newreleases.io/project/pypi/vllm/release/0.11.0 (mirror; confirm on GitHub) |
| vLLM current release | v0.32.0 on 18 Oct 2026, NVFP4 KV cache on more GPUs | https://github.com/vllm-project/vllm/releases |
| EAGLE-3 | Direct token prediction plus multi-layer features; recommended in SGLang docs | https://arxiv.org/abs/2503.01840 (2025-03-03); https://docs.sglang.io/advanced_features/speculative_decoding.html |
| Speculative decoding at large batch | Can help at long context (MagicDec) but often hurts throughput when the step is compute bound | https://arxiv.org/abs/2408.11049 (v5 2025-04-02); https://www.techinterview.org/post/3233477300/why-speculative-decoding-is-faster/ (2026-08-10) |
| MTP, n-gram and suffix speculation | Built-in heads and model-free drafts in vLLM and SGLang | https://docs.vllm.ai/en/latest/features/speculative_decoding/ |
| Disaggregated serving | Dynamo, llm-d, vLLM connectors (NIXL, LMCache, Mooncake), SGLang PD mode | Dynamo 2025-03-18; llm-d 2025-05-20; vLLM and SGLang docs (URLs in 1.3) |
| KV cache tiering | LMCache offload and cross-engine sharing | https://arxiv.org/abs/2510.09665 (2025-10-08) |
| Open-weight model configs | gpt-oss (sliding plus full layers, MXFP4), DeepSeek-V3 MLA, Qwen3 GQA | Hugging Face configs (section 1.1) |
| FP8 and FP4 | FP8 KV cache in vLLM; NVFP4 KV cache in vLLM v0.32.0; FP4 tensor throughput on Blackwell | vLLM docs; vLLM releases; DGX B200 page |
| Prompt caching price changes | OpenAI charges cache writes (1.25x for 30m, 2.5x for 12h) on GPT-5.6 and later; Anthropic cache-hit multiplier varies by model | OpenAI prompt caching guide and pricing; Anthropic pricing (checked 2026-10-28) |
| Speed tiers | OpenAI Fast and Ultrafast tiers, Priority renamed Fast mode on 2026-07-30; Anthropic Fast mode at a premium | OpenAI pricing; Anthropic pricing |
| Router products | OpenRouter Auto Router by task type and spend share; LiteLLM cost-based routing and budget reservation | OpenRouter docs; LiteLLM docs |
| Autoscaling signals | Queue size and batch size rather than GPU utilization | GKE doc, updated 2026-10-26 |
| Tokenizer cost drift | Newer Claude tokenizer produces about 30% more tokens for the same text | Anthropic pricing page |

---

## 3. Interview questions collected (38)

"Company" is filled only where the source names the company for that exact question. Types follow SPEC section 6. Difficulty is my rating for a senior candidate.

| # | Question (source wording, trimmed where long) | Type | Difficulty | Module | Source | Company named by source |
|---|---|---|---|---|---|---|
| 1 | Why is prefill compute-bound and decode memory-bandwidth-bound? | concept | medium | inference-anatomy | https://github.com/amitshekhariitbhu/ai-engineering-interview-questions | none |
| 2 | Estimate the KV cache memory needed to serve a large model. How does it constrain batch size and context length? | estimate | medium | inference-anatomy | same | none |
| 3 | Estimate the GPU memory needed to serve a 70B model (weights, KV cache, activations). Does it fit on a single 80 GB GPU? | estimate | medium | inference-anatomy | same | none |
| 4 | Do the roofline math: how many tokens/sec can one H100 produce for a 70B model at batch size 1? | estimate | hard | inference-anatomy | same | none |
| 5 | What are TTFT, TPOT, and throughput, and how do they trade against each other? | concept | easy | inference-anatomy | same | none |
| 6 | Why is the first token slower than the rest in an LLM? | concept | easy | inference-anatomy | same | none |
| 7 | How to calculate size of KV cache | estimate | easy | inference-anatomy | https://github.com/llmgenai/LLMInterviewQuestions | none |
| 8 | Design an inference batching system for a single GPU that can handle up to 100 inputs per batch while users wait synchronously | design | hard | batching | https://www.aced.io/blog/ai-engineer-interview-questions | Anthropic |
| 9 | Design an end-to-end batching system for LLM queries. | design | hard | batching | same | Anthropic |
| 10 | Design an API that lets users sample from large language models efficiently, with good batching and request orchestration. | design | hard | batching | same | Anthropic |
| 11 | Trace a prompt through an LLM inference engine, using a vLLM-style paged-KV architecture as the reference (admission, prefill, decoding, PagedAttention, block table, continuous batching). Follow-ups: why contiguous per-request allocation wastes memory; how block tables enable noncontiguous storage; what changes when requests finish at different times or long prompts enter an active batch. | concept | medium | batching | https://prachub.com/interview-questions/trace-an-llm-request-through-a-paged-kv-inference-engine (posted 2026-09-14) | AMD (Software Engineer, onsite) |
| 12 | How does continuous batching improve LLM inference throughput? | concept | easy | batching | https://github.com/amitshekhariitbhu/ai-engineering-interview-questions | none |
| 13 | What is chunked prefill, and why does it improve tail latency under mixed traffic? | concept | medium | batching | same | none |
| 14 | Implement a memory allocator for variable-size KV cache | code | hard | batching | https://www.techinterview.org/post/3233475331/ai-inference-infrastructure-interview-prep-2026-vllm-triton/ (updated 2026-05-06) | none |
| 15 | Implement a request scheduler with priority and preemption | code | hard | batching | same | none |
| 16 | We need to optimize inference for batch size 128. Should we use speculative decoding? | mcq | hard | faster-cheaper | https://aiinterviewprep.substack.com/p/advanced-nlp-interview-questions-2e4 (2025-12-12) | none usable: the post frames it as a hypothetical "interview at OpenAI" role-play, not a report |
| 17 | You turned on speculative decoding and throughput went down, what happened? | debug | medium | faster-cheaper | https://www.techinterview.org/post/3233477300/why-speculative-decoding-is-faster/ (2026-08-10) | none |
| 18 | Why not draft 20 tokens instead of 4? | estimate | medium | faster-cheaper | same | none |
| 19 | Design normal and speculative decoding with correct proposal verification, rejection, sampling, EOS, positions and KV cache state, then build a fair speed benchmark. | code | hard | faster-cheaper | https://prachub.com/interview-questions/implement-and-benchmark-speculative-decoding (posted 2026-09-03) | SpaceX (Research Scientist, technical screen; the source writes "Spacex") |
| 20 | How does EAGLE (feature-level speculative decoding) work? How does Medusa work? | concept | hard | faster-cheaper | https://github.com/amitshekhariitbhu/ai-engineering-interview-questions | none |
| 21 | Explain post-training quantization (PTQ) vs quantization-aware training (QAT). What breaks when you push weights to 2-4 bits? | concept | medium | faster-cheaper | same | none |
| 22 | You quantized your LLM, but accuracy dropped significantly. How do you minimize quantization loss? | debug | medium | faster-cheaper | same | none |
| 23 | Should you quantize the KV cache? | concept | medium | faster-cheaper | https://prachub.com/resources/llm-inference-optimization-interview-questions-quantization-batching-kv-cache-and-latency (2026-09-06) | none |
| 24 | When does prefix caching help? | mcq (adapted from a concept prompt) | easy | faster-cheaper | same | none |
| 25 | What is Prefill-Decode Disaggregation, and when does it pay off? | concept | hard | faster-cheaper | https://github.com/amitshekhariitbhu/ai-engineering-interview-questions | none |
| 26 | How do you choose between TP=2 and TP=4 for a given model? | concept | hard | faster-cheaper | https://www.techinterview.org/post/3233475331/ai-inference-infrastructure-interview-prep-2026-vllm-triton/ | none |
| 27 | How would you serve a 70B model on 4 A100 80GB? | estimate | hard | faster-cheaper | same | none |
| 28 | When would you choose vLLM vs SGLang vs TensorRT-LLM? | concept | medium | faster-cheaper | https://github.com/amitshekhariitbhu/ai-engineering-interview-questions | none |
| 29 | Design an AI gateway/proxy for managing LLM access across an organization. | design | medium | gateways-finops | same | none |
| 30 | Implement a token-bucket rate limiter for an LLM API where cost scales with tokens, then make it distributed. | code | medium | gateways-finops | same | none |
| 31 | Implement a GPU credit management system. | code | medium | gateways-finops | https://www.aced.io/blog/ai-engineer-interview-questions | OpenAI |
| 32 | What are the cost trade-offs between self-hosted and API-based AI inference? | estimate | medium | gateways-finops | https://github.com/amitshekhariitbhu/ai-engineering-interview-questions | none |
| 33 | How to estimate the cost of running SaaS-based and Open Source LLM models? | estimate | medium | gateways-finops | https://github.com/llmgenai/LLMInterviewQuestions | none |
| 34 | What is model routing at the infrastructure level, and how do you route requests based on complexity and cost? | design | medium | gateways-finops | https://github.com/amitshekhariitbhu/ai-engineering-interview-questions | none |
| 35 | Design a multi-tenant inference service with priority queues and rate limits | design | hard | gateways-finops | https://www.techinterview.org/post/3233475331/ai-inference-infrastructure-interview-prep-2026-vllm-triton/ | none |
| 36 | Your LLM endpoint's p99 latency doubled after a deploy with no model change. How do you diagnose it? | debug | hard | operating | https://github.com/amitshekhariitbhu/ai-engineering-interview-questions | none |
| 37 | Design an LLM inference API (streaming and batch, several model sizes, about 1,000 rps peak, TTFT under 500 ms, at least 30 tok/s); follow-ups on autoscaling with slow model loads and per-customer adapters. | design | hard | operating | https://www.techinterview.org/post/3233460079/design-an-llm-inference-api/ (2026-04-16) | none for this question; the page lists OpenAI, Anthropic and Scale AI as companies that ask "this type", which is not enough for `companies` |
| 38 | Describe a time when you had to choose between model accuracy and latency. How did you make the decision? | behavioural | medium | operating | https://github.com/amitshekhariitbhu/ai-engineering-interview-questions | none |

Other source-listed questions that overlap the above and work as follow-ups: "How do you handle model updates and migrations without downtime?", "How do you handle cold start latency for serverless AI deployments?", "How do you implement auto-scaling for AI workloads?", "What is a gateway pattern for LLM API management?" (amitshekhariitbhu); "How do you define and measure inference latency?", "How would you diagnose a latency regression?", "How do you design a credible benchmark?" (prachub resources page).

### Recommended for the problem bank (15), with core marked (10)

| Pick | Q# | Proposed id | Type | Module | Core | Note for the writer |
|---|---|---|---|---|---|---|
| 1 | 1 | inf-001 | concept | inference-anatomy | yes | The base idea the other answers lean on |
| 2 | 2 | inf-002 | estimate | inference-anatomy | yes | Fix the model as Llama 3 70B, 32k context, batch 8, BF16 KV: 85.9 GB; accept 80 to 92 so GiB rounding passes |
| 3 | 4 | inf-003 | estimate | inference-anatomy | yes | Bandwidth floor; give H100 SXM 3.35 TB/s and FP8 weights, or TP=2, so the model fits |
| 4 | 11 | inf-004 | concept | batching | yes | Company-named (AMD); covers PagedAttention, block tables, continuous batching |
| 5 | 8 | inf-005 | design | batching | yes | Company-named (Anthropic) |
| 6 | 14 | inf-006 | code | batching | yes | Block allocator with a free list, stdlib only (seed: snippet 7) |
| 7 | 16 | inf-007 | mcq | faster-cheaper | yes | Correct choice: it depends on whether the step is compute bound, which turns on context length and draft cost; cite MagicDec and the techinterview article; leave `companies` empty |
| 8 | 17 | inf-008 | debug | faster-cheaper | yes | Throughput fell after enabling speculation |
| 9 | 30 | inf-009 | code | gateways-finops | yes | Token-charged rate limiter with reserve and settle (seed: snippet 10) |
| 10 | 29 | inf-010 | design | gateways-finops | yes | Gateway: auth, quotas, routing, fallbacks, caching, logging, budgets |
| 11 | 22 | inf-011 | debug | faster-cheaper | no | Quantization accuracy drop |
| 12 | 24 | inf-012 | mcq | faster-cheaper | no | Which prompt layout gets prefix cache hits; a timestamp at the top kills reuse |
| 13 | 32 | inf-013 | estimate | gateways-finops | no | Self-host vs API break-even with stated inputs (seed: snippet 8) |
| 14 | 36 | inf-014 | debug | operating | no | p99 doubled after deploy: batch limits, chunked prefill budget, prefix cache hit rate, preemptions |
| 15 | 37 | inf-015 | design | operating | no | Inference API with autoscaling and SLOs |

Types covered: concept, estimate, debug, code, design, mcq. Behavioural (Q38) belongs in the rounds track. If a 16th problem is wanted, Q19 (company-named, SpaceX) is the next pick; a full version is heavy for Pyodide, but a stdlib version that only checks acceptance and resampling fits (seed: snippet 5).

---

## 4. Misconceptions and gotchas for reviewers

1. **Query heads used instead of KV heads.** Llama 3 70B has 64 query heads and 8 KV heads; using 64 overstates the KV cache 8 times.
2. **head_dim derived as hidden / heads.** Qwen3-32B has hidden 5120 and 64 heads but `head_dim` 128, not 80. Read `head_dim` from config.json when it is present.
3. **Missing factor of 2 or bytes per element.** K and V are both stored; BF16 is 2 bytes; FP8 KV is 1 byte.
4. **One formula for every architecture.** Sliding-window layers (gpt-oss-120b) cap at the window; MLA (DeepSeek-V3) stores a latent plus a RoPE key, not per-head K and V.
5. **GB versus GiB.** 85.9 GB is 80 GiB. Estimate bands must accept both.
6. **NVIDIA tensor TFLOPS quoted as dense.** The H100 and H200 pages mark tensor figures as sparse; dense is half.
7. **"Decode is slow because attention is quadratic."** At short context, decode is slow because every step rereads all weights; with a KV cache, per-step attention work grows linearly with context.
8. **"Larger batches are free."** Throughput rises but per-user TPOT also rises (Databricks example: about 4x latency for about 14x throughput at batch 64), and KV memory caps the batch.
9. **Continuous batching credited to vLLM.** Iteration-level scheduling comes from Orca (OSDI 2022); vLLM's contribution is PagedAttention memory management.
10. **PagedAttention described as a faster attention kernel.** It is a memory layout and allocator (block tables) that allows larger batches and sharing; the kernel has to read non-contiguous blocks.
11. **vLLM's two headline numbers mixed up.** The paper says 2-4x versus FasterTransformer and Orca; the blog says up to 24x versus Hugging Face Transformers. Different baselines.
12. **vLLM V0 behaviour taught as current.** V1 preempts by recompute, has no GPU-CPU swap, turns prefix caching and chunked prefill on by default, and removed `best_of`. Lessons that describe `swap_space` as the preemption path are out of date.
13. **"Speculative decoding changes the output."** With rejection sampling it preserves the target distribution up to hardware numerics. Medusa's typical acceptance and vLLM's FLy verification do not preserve it, and in vLLM batch-size changes can shift logprobs.
14. **"Speculative decoding always helps" or "never helps at large batch".** It tends to hurt when the target is compute bound and drafts get rejected, yet MagicDec reports gains at batch 32 to 256 for long contexts because KV reads dominate. The honest answer is conditional.
15. **Longer drafts are always better.** Expected tokens per pass approach `1 / (1 - alpha)` while draft cost grows linearly with gamma (snippet 4).
16. **"Disaggregation increases throughput."** vLLM's docs say it does not; it separates TTFT and ITL tuning and controls tail ITL. DistServe's gains are goodput under SLOs.
17. **Prefix caching on any shared substring.** Only exact prefixes count, and vLLM caches only full blocks. A timestamp or user name at the top of a system prompt removes reuse (snippet 7).
18. **Caching always saves money.** Writes cost 1.25x to 2.5x input depending on provider and TTL, so at low hit rates caching costs more than not caching (snippet 8). Anthropic also skips caching below the model's minimum length without an error.
19. **"Cache reads are 10% of input" hard-coded.** Anthropic's multiplier is 0.1x for most models, 0.05x for Opus 5.5 and Sonnet 5.5, and 0.025x for Fable 5.1 and Mythos 5.1. OpenAI's cached rate varies by model (gpt-6.1-sol 5% of input, gpt-6-astra 10%).
20. **Price per token compared across tokenizers.** Anthropic states its newer tokenizer produces about 30% more tokens for the same text. Compare cost per task on your own data.
21. **Undated prices.** Every price needs a "checked on" date. Gemini 3.8 Flash prices double on 2027-01-01 per its pricing page.
22. **GGUF called a quantization method.** GGUF is a container format; Q4_K is 4.5 bpw, not 4.
23. **"INT4 weight-only quantization speeds up everything."** It cuts bytes read in memory-bound decode; compute-bound prefill gains less. Measure accuracy on your own eval set; no general loss figure is sourced here.
24. **FP8 role assignments stated without a source.** The FP8 formats abstract does not assign E4M3 and E5M2 to forward and backward passes; cite the paper body if a lesson does.
25. **TTFT and ITL definitions vary by tool.** NVIDIA's ITL excludes the first token; other tools include it. Means hide tails; report p50, p95 and p99 (snippet 9).
26. **System throughput confused with per-user speed.** System TPS can rise while each user sees slower tokens.
27. **Autoscaling on GPU utilization.** GKE notes the metric does not measure how much work is done while the GPU is active; use queue size or batch size.
28. **"OpenRouter adds no fees."** There is no markup on inference, but there is a 5.5% fee on credit purchases and 5% on BYOK usage above $25,000 a month.
29. **LiteLLM budgets without a database.** Budgets need Postgres; the global `max_budget` fails open without one.
30. **Batch APIs for interactive traffic.** OpenAI's batch window is 24 hours; batch is for offline work.
31. **TP across nodes.** vLLM docs point to PP once TP is maxed out or across nodes; TP needs fast links inside a node.
32. **Company attribution from framing.** The Substack "interview at OpenAI" post is a role-play; do not put OpenAI in `companies` for that question.

---

## 5. Runnable Python snippets

All snippets use the standard library only, so they run in Pyodide without extra packages. Each was run with Python 3.12.6 on 2026-10-28 and the output below is pasted as produced. Inputs marked illustrative are assumptions for exercises, not facts.

### Snippet 1: KV cache size from published configs (verified)

```python
# KV cache bytes per token and total, from published configs.
def kv_bytes_per_token(layers, kv_heads, head_dim, bytes_per_elem=2):
    # 2 = one K vector and one V vector per layer per KV head
    return 2 * layers * kv_heads * head_dim * bytes_per_elem

def kv_total_gb(per_token, context, batch):
    return per_token * context * batch / 1e9

configs = {
    # name: (layers, kv_heads, head_dim)
    "Llama 3 8B":   (32, 8, 4096 // 32),
    "Llama 3 70B":  (80, 8, 8192 // 64),
    "Llama 3 405B": (126, 8, 16384 // 128),
    "Qwen3-32B":    (64, 8, 128),
}
for name, (L, kvh, hd) in configs.items():
    b = kv_bytes_per_token(L, kvh, hd)
    print(f"{name:13s} {b:>8,d} B/token  {b/1024:6.0f} KiB/token")

per_tok = kv_bytes_per_token(80, 8, 128)
print("Llama 3 70B, 32k context, batch 8:",
      round(kv_total_gb(per_tok, 32_768, 8), 1), "GB")
# Same model if it had used full multi-head attention (64 KV heads):
mha = kv_bytes_per_token(80, 64, 128)
print("Same model with 64 KV heads:", mha // per_tok, "x larger")
```

Output:

```
Llama 3 8B     131,072 B/token     128 KiB/token
Llama 3 70B    327,680 B/token     320 KiB/token
Llama 3 405B   516,096 B/token     504 KiB/token
Qwen3-32B      262,144 B/token     256 KiB/token
Llama 3 70B, 32k context, batch 8: 85.9 GB
Same model with 64 KV heads: 8 x larger
```

### Snippet 2: sliding-window and MLA corrections (verified)

```python
# Two configs where the simple formula needs adjusting.

# gpt-oss-120b: 36 layers alternate sliding-window (128 tokens) and full attention,
# 8 KV heads, head_dim 64 (config.json on Hugging Face).
def gpt_oss_kv_bytes(context, layers=36, kv_heads=8, head_dim=64, window=128, b=2):
    per_layer_token = 2 * kv_heads * head_dim * b
    full = layers // 2
    sliding = layers - full
    return full * per_layer_token * context + sliding * per_layer_token * min(context, window)

for ctx in (1_000, 32_768, 131_072):
    print(f"gpt-oss-120b ctx={ctx:>7,d}: {gpt_oss_kv_bytes(ctx)/1e9:.2f} GB per sequence")

# DeepSeek-V3 with MLA caches one latent (kv_lora_rank) plus one decoupled RoPE key
# per token per layer, shared by all heads (DeepSeek-V2 paper, Table 1).
layers, kv_lora_rank, rope_dim = 61, 512, 64
mla = layers * (kv_lora_rank + rope_dim) * 2  # BF16
print("DeepSeek-V3 MLA:", mla, "B/token")
# What plain MHA would cost with 128 heads, K dim 128+64 and V dim 128:
mha = layers * 128 * ((128 + 64) + 128) * 2
print("DeepSeek-V3 if cached as MHA:", mha, "B/token, ratio", round(mha / mla, 1))
```

Output:

```
gpt-oss-120b ctx=  1,000: 0.04 GB per sequence
gpt-oss-120b ctx= 32,768: 1.21 GB per sequence
gpt-oss-120b ctx=131,072: 4.84 GB per sequence
DeepSeek-V3 MLA: 70272 B/token
DeepSeek-V3 if cached as MHA: 4997120 B/token, ratio 71.1
```

The "if cached as MHA" line is a hypothetical comparison for teaching. DeepSeek's own 93.3% figure compares DeepSeek-V2 against DeepSeek 67B, a different model.

### Snippet 3: decode bandwidth floor and ridge point (verified)

```python
# Decode is bounded by memory bandwidth: each step reads every weight once
# (shared by the batch) plus each sequence's own KV cache.
H200_BW, H200_MEM = 4.8e12, 141e9      # NVIDIA H200 spec page
H100_BW = 3.35e12                      # NVIDIA H100 SXM spec page
H100_BF16_DENSE = 1979e12 / 2          # spec lists 1,979 TFLOPS with sparsity

weights = 70e9 * 1          # a 70B-class model in FP8: about 1 byte per weight
kv_per_token = 327_680      # Llama 3 70B, BF16 KV cache (snippet 1)

def step_floor_s(batch, ctx, bw):
    return (weights + kv_per_token * ctx * batch) / bw

for batch, ctx in [(1, 1_000), (16, 4_096), (32, 4_096), (64, 4_096)]:
    need = weights + kv_per_token * ctx * batch
    if need > H200_MEM:
        print(f"batch={batch:3d} ctx={ctx:5d}: needs {need/1e9:5.1f} GB, does not fit one H200")
        continue
    t = step_floor_s(batch, ctx, H200_BW)
    print(f"batch={batch:3d} ctx={ctx:5d}: step >= {t*1e3:5.1f} ms, "
          f"per user <= {1/t:5.1f} tok/s, total <= {batch/t:5.0f} tok/s, uses {need/1e9:5.1f} GB")

# Ridge point: FLOPs per byte needed before compute becomes the limit.
print("H100 SXM ridge point about", round(H100_BF16_DENSE / H100_BW), "FLOPs/byte")
# BF16 decode does about 2 FLOPs per weight per sequence and reads 2 bytes per
# weight once per step, so its intensity is roughly `batch` FLOPs/byte (KV reads ignored).
```

Output:

```
batch=  1 ctx= 1000: step >=  14.7 ms, per user <=  68.3 tok/s, total <=    68 tok/s, uses  70.3 GB
batch= 16 ctx= 4096: step >=  19.1 ms, per user <=  52.5 tok/s, total <=   840 tok/s, uses  91.5 GB
batch= 32 ctx= 4096: step >=  23.5 ms, per user <=  42.5 tok/s, total <=  1360 tok/s, uses 112.9 GB
batch= 64 ctx= 4096: needs 155.9 GB, does not fit one H200
H100 SXM ridge point about 295 FLOPs/byte
```

### Snippet 4: speculative decoding expected tokens and speedup (verified)

```python
import random

def expected_tokens(alpha, gamma):
    # Leviathan et al. 2023, Equation (1): tokens produced per target-model pass
    return (1 - alpha ** (gamma + 1)) / (1 - alpha)

def walltime_speedup(alpha, gamma, c):
    # Theorem 3.8: c = cost of one draft step relative to one target step
    return (1 - alpha ** (gamma + 1)) / ((1 - alpha) * (gamma * c + 1))

def simulate(alpha, gamma, runs=200_000, seed=0):
    rng = random.Random(seed)
    total = 0
    for _ in range(runs):
        accepted = 0
        while accepted < gamma and rng.random() < alpha:
            accepted += 1
        total += accepted + 1   # the target always contributes one token
    return total / runs

for alpha in (0.6, 0.8):
    for gamma in (2, 4, 8):
        print(f"alpha={alpha} gamma={gamma}: E={expected_tokens(alpha, gamma):.3f} "
              f"sim={simulate(alpha, gamma):.3f} "
              f"speedup(c=0.05)={walltime_speedup(alpha, gamma, 0.05):.2f}")

best = max(range(1, 21), key=lambda g: walltime_speedup(0.8, g, 0.05))
print("best gamma for alpha=0.8, c=0.05:", best)
```

Output:

```
alpha=0.6 gamma=2: E=1.960 sim=1.960 speedup(c=0.05)=1.78
alpha=0.6 gamma=4: E=2.306 sim=2.307 speedup(c=0.05)=1.92
alpha=0.6 gamma=8: E=2.475 sim=2.477 speedup(c=0.05)=1.77
alpha=0.8 gamma=2: E=2.440 sim=2.438 speedup(c=0.05)=2.22
alpha=0.8 gamma=4: E=3.362 sim=3.358 speedup(c=0.05)=2.80
alpha=0.8 gamma=8: E=4.329 sim=4.324 speedup(c=0.05)=3.09
best gamma for alpha=0.8, c=0.05: 8
```

### Snippet 5: speculative sampling preserves the target distribution (verified)

```python
import random
from collections import Counter

def speculative_sample(p, q, rng):
    """One draft token from q, verified against target p.
    Returns a token whose distribution equals p (Leviathan et al. 2023; Chen et al. 2023)."""
    vocab = range(len(p))
    x = rng.choices(vocab, weights=q)[0]
    if rng.random() < min(1.0, p[x] / q[x]):
        return x                                   # accept the draft
    residual = [max(0.0, pi - qi) for pi, qi in zip(p, q)]
    return rng.choices(vocab, weights=residual)[0]  # resample from norm(max(0, p - q))

p = [0.5, 0.3, 0.2, 0.0]   # target model
q = [0.25, 0.25, 0.25, 0.25]  # cheap draft model
rng = random.Random(42)
n = 200_000
counts = Counter(speculative_sample(p, q, rng) for _ in range(n))
print("empirical:", [round(counts[i] / n, 3) for i in range(len(p))], "target:", p)
alpha = sum(min(pi, qi) for pi, qi in zip(p, q))
print("acceptance rate alpha = sum(min(p, q)) =", alpha)
```

Output:

```
empirical: [0.5, 0.301, 0.199, 0.0] target: [0.5, 0.3, 0.2, 0.0]
acceptance rate alpha = sum(min(p, q)) = 0.7
```

### Snippet 6: static vs continuous batching, toy simulator (verified)

```python
import random

def static_batching(lengths, max_batch):
    """Each batch runs until its longest request finishes. Returns decode steps."""
    steps = 0
    for i in range(0, len(lengths), max_batch):
        steps += max(lengths[i:i + max_batch])
    return steps

def continuous_batching(lengths, max_batch):
    """Iteration-level scheduling (Orca): a finished slot is refilled on the next step."""
    queue = list(lengths)
    running = []
    steps = 0
    while queue or running:
        while queue and len(running) < max_batch:
            running.append(queue.pop(0))
        steps += 1
        running = [r - 1 for r in running if r > 1]   # one token per running request
    return steps

rng = random.Random(7)
lengths = [rng.choice([20, 50, 400]) for _ in range(256)]   # output tokens per request
useful = sum(lengths)
for name, fn in [("static", static_batching), ("continuous", continuous_batching)]:
    steps = fn(lengths, max_batch=16)
    print(f"{name:10s}: {steps:5d} steps, slot utilisation {useful / (steps * 16):.0%}")
```

Output:

```
static    :  6400 steps, slot utilisation 38%
continuous:  2580 steps, slot utilisation 93%
```

The utilisation figures come from this toy workload only (lengths drawn from 20, 50 and 400 tokens) and must not be presented as a general result.

### Snippet 7: paged KV allocator, waste, and prefix block hashing (verified)

```python
import hashlib

BLOCK = 16   # vLLM's default block size (vLLM paper, section 4)

class BlockAllocator:
    def __init__(self, num_blocks):
        self.free = list(range(num_blocks))
        self.tables = {}       # request id -> list of physical block ids
        self.lengths = {}

    def append_token(self, rid):
        n = self.lengths.get(rid, 0)
        if n % BLOCK == 0:                 # current block full, or first token
            if not self.free:
                raise MemoryError("no free KV blocks: preempt or queue")
            self.tables.setdefault(rid, []).append(self.free.pop())
        self.lengths[rid] = n + 1

    def release(self, rid):
        self.free.extend(self.tables.pop(rid))
        self.lengths.pop(rid)

def contiguous_waste(actual_tokens, reserved_max):
    """Pre-allocating max length per request, as pre-paging systems did."""
    return 1 - sum(actual_tokens) / (reserved_max * len(actual_tokens))

def paged_waste(actual_tokens):
    used_slots = sum(-(-t // BLOCK) * BLOCK for t in actual_tokens)
    return 1 - sum(actual_tokens) / used_slots

alloc = BlockAllocator(num_blocks=8)
for _ in range(40):
    alloc.append_token("a")
print("request a: 40 tokens ->", alloc.tables["a"], "blocks")
alloc.release("a")
print("free blocks after release:", len(alloc.free))

toks = [37, 410, 1203, 95, 2000]
print(f"contiguous (reserve 2048 each) waste: {contiguous_waste(toks, 2048):.0%}")
print(f"paged (block 16) waste: {paged_waste(toks):.1%}")

# Prefix caching keys each full block by its parent hash and its own tokens,
# so a block is shared only when the whole prefix before it matches.
def block_hashes(token_ids, salt=""):
    hashes, parent = [], salt
    for i in range(0, len(token_ids) - len(token_ids) % BLOCK, BLOCK):
        h = hashlib.sha256(f"{parent}|{token_ids[i:i + BLOCK]}".encode()).hexdigest()[:12]
        hashes.append(h)
        parent = h
    return hashes   # the trailing partial block is not cached

system = list(range(100, 148))              # 48-token shared system prompt
a = block_hashes(system + [1, 2, 3, 4] * 5)
b = block_hashes(system + [9, 9, 9, 9] * 5)
c = block_hashes([7] + system + [1, 2, 3, 4] * 5)   # one token prepended
shared = lambda x, y: sum(1 for i, j in zip(x, y) if i == j)
print("a vs b shared blocks:", shared(a, b), "of", len(a))
print("a vs c shared blocks:", shared(a, c), "(a prepended token shifts every block)")
```

Output:

```
request a: 40 tokens -> [7, 6, 5] blocks
free blocks after release: 8
contiguous (reserve 2048 each) waste: 63%
paged (block 16) waste: 0.8%
a vs b shared blocks: 3 of 4
a vs c shared blocks: 0 (a prepended token shifts every block)
```

The 63% contiguous waste is for these five made-up request lengths; the vLLM paper's 20.4% to 38.2% utilisation figure is the sourced number.

### Snippet 8: API cost with caching and batch, plus a self-host helper (verified)

```python
# Monthly API cost with prompt caching and the Batch API.
# Prices: Claude Haiku 4.5 list prices per million tokens, Anthropic pricing page,
# checked 2026-10-28: input $1, 5-minute cache write $1.25, cache hit $0.10, output $5.
PRICE = {"input": 1.00, "cache_write": 1.25, "cache_read": 0.10, "output": 5.00}

def request_cost(prefix_tokens, fresh_tokens, output_tokens, cache_hit, batch=False):
    if cache_hit:
        cost = prefix_tokens * PRICE["cache_read"]
    else:
        cost = prefix_tokens * PRICE["cache_write"]
    cost += fresh_tokens * PRICE["input"] + output_tokens * PRICE["output"]
    cost /= 1e6
    return cost * 0.5 if batch else cost   # Batch API: 50% off input and output

reqs = 1_000_000   # requests per month (an assumption for the exercise)
for hit_rate in (0.0, 0.5, 0.9):
    per = (hit_rate * request_cost(6_000, 500, 300, True)
           + (1 - hit_rate) * request_cost(6_000, 500, 300, False))
    print(f"cache hit rate {hit_rate:.0%}: ${per * reqs:,.0f} per month")

no_cache = request_cost(0, 6_500, 300, False) * reqs
print(f"no caching at all: ${no_cache:,.0f} per month")

# Self-host break-even needs your own quotes: GPU $/hour and measured tokens/s.
def self_host_cost_per_m_output(gpu_hourly_usd, gpus, measured_output_tok_s, utilisation):
    tokens_per_hour = measured_output_tok_s * 3600 * utilisation
    return gpu_hourly_usd * gpus / tokens_per_hour * 1e6
# Example with placeholder inputs, not sourced prices:
print(f"self-host: ${self_host_cost_per_m_output(4.0, 2, 1500, 0.4):.2f} per M output tokens")
```

Output:

```
cache hit rate 0%: $9,500 per month
cache hit rate 50%: $6,050 per month
cache hit rate 90%: $3,290 per month
no caching at all: $8,000 per month
self-host: $3.70 per M output tokens
```

The self-host line uses placeholder inputs (GPU price, throughput, utilisation) and is not a sourced cost. The request mix (6,000-token cached prefix, 500 fresh tokens, 300 output tokens, 1M requests a month) is illustrative.

### Snippet 9: TTFT, ITL, E2E and percentiles from timestamps (verified)

```python
import math

def request_metrics(t_submit, token_times):
    """TTFT, ITL and E2E as defined in NVIDIA's NIM benchmarking docs:
    ITL = (e2e - TTFT) / (output_tokens - 1), so the first token is excluded."""
    ttft = token_times[0] - t_submit
    e2e = token_times[-1] - t_submit
    n = len(token_times)
    itl = (e2e - ttft) / (n - 1) if n > 1 else 0.0
    return {"ttft": ttft, "itl": itl, "e2e": e2e, "user_tps": n / e2e}

def percentile(values, pct):
    """Nearest-rank percentile, enough for a dashboard check."""
    s = sorted(values)
    k = max(0, math.ceil(pct / 100 * len(s)) - 1)
    return s[k]

# A request submitted at t=0: first token at 0.80 s, then one token every 25 ms.
times = [0.80 + 0.025 * i for i in range(200)]
m = request_metrics(0.0, times)
print({k: round(v, 3) for k, v in m.items()})

ttfts = [0.3] * 95 + [4.0] * 5          # 5% of requests queued behind a long prefill
print("mean TTFT:", round(sum(ttfts) / len(ttfts), 3), "p50:", percentile(ttfts, 50),
      "p99:", percentile(ttfts, 99))
```

Output:

```
{'ttft': 0.8, 'itl': 0.025, 'e2e': 5.775, 'user_tps': 34.632}
mean TTFT: 0.485 p50: 0.3 p99: 4.0
```

### Snippet 10: per-tenant token budget with reserve and settle (verified)

```python
import time

class TenantBudget:
    """Token bucket per tenant, charged in tokens rather than requests.
    Reserve the worst case (prompt + max_tokens) up front, refund on completion."""
    def __init__(self, tokens_per_minute, burst=None, clock=time.monotonic):
        self.rate = tokens_per_minute / 60.0
        self.capacity = burst or tokens_per_minute
        self.level = float(self.capacity)
        self.clock = clock
        self.last = clock()

    def _refill(self):
        now = self.clock()
        self.level = min(self.capacity, self.level + (now - self.last) * self.rate)
        self.last = now

    def try_reserve(self, prompt_tokens, max_tokens):
        self._refill()
        need = prompt_tokens + max_tokens
        if need > self.level:
            return None             # caller returns 429 with Retry-After
        self.level -= need
        return need

    def settle(self, reserved, prompt_tokens, output_tokens):
        self.level = min(self.capacity, self.level + reserved - (prompt_tokens + output_tokens))

fake_now = [0.0]
b = TenantBudget(tokens_per_minute=10_000, clock=lambda: fake_now[0])
r = b.try_reserve(2_000, 4_000)
print("reserved:", r, "left:", b.level)
b.settle(r, 2_000, 300)                       # model stopped early
print("after settle:", b.level)
print("second big request:", b.try_reserve(3_000, 6_000))
fake_now[0] = 30.0                            # 30 s later the bucket has refilled
print("after 30 s:", b.try_reserve(3_000, 6_000) is not None)
print("request larger than the burst ever admits:", b.try_reserve(3_000, 20_000) is not None)
```

Output:

```
reserved: 6000 left: 4000
after settle: 7700
second big request: None
after 30 s: True
request larger than the burst ever admits: False
```

### Snippet 11: cascade routing cost (verified)

```python
# Two-model cascade: try the small model, escalate when a checker rejects its answer.
# Costs are relative to one large-model call; plug in real per-request costs.
def cascade_cost(cost_small, cost_large, escalation_rate, checker_cost=0.0):
    return cost_small + checker_cost + escalation_rate * cost_large

for esc in (0.1, 0.3, 0.6, 0.9):
    c = cascade_cost(cost_small=0.10, cost_large=1.0, escalation_rate=esc, checker_cost=0.02)
    print(f"escalate {esc:.0%}: {c:.2f} of large-only cost")
print("break-even escalation rate:", round(1.0 - 0.10 - 0.02, 2))
# Escalated requests pay the latency of both calls, so p95 latency rises with escalation.
```

Output:

```
escalate 10%: 0.22 of large-only cost
escalate 30%: 0.42 of large-only cost
escalate 60%: 0.72 of large-only cost
escalate 90%: 1.02 of large-only cost
break-even escalation rate: 0.88
```

### Snippet 12: weight memory by format (verified)

```python
# Weight memory by format. Bits per weight for GGUF K-quants come from the
# Hugging Face GGUF docs table (Q4_K = 4.5, Q6_K = 6.5625, Q8_0 = 8 bits plus a scale per 32).
BPW = {"BF16": 16, "FP8": 8, "Q8_0": 8 + 16 / 32, "Q6_K": 6.5625, "Q4_K": 4.5, "INT4 (no scales)": 4}

def weight_gb(params, bits_per_weight):
    return params * bits_per_weight / 8 / 1e9

for fmt, bpw in BPW.items():
    print(f"70B in {fmt:16s}: {weight_gb(70e9, bpw):6.1f} GB")
```

Output:

```
70B in BF16            :  140.0 GB
70B in FP8             :   70.0 GB
70B in Q8_0            :   74.4 GB
70B in Q6_K            :   57.4 GB
70B in Q4_K            :   39.4 GB
70B in INT4 (no scales):   35.0 GB
```

### Snippet 13: replicas from Little's law and spare capacity for slow cold starts (verified)

```python
import math
# Little's law: requests in flight = arrival rate x time in system.
def replicas_needed(peak_rps, mean_e2e_s, max_concurrency_per_replica, headroom=0.7):
    in_flight = peak_rps * mean_e2e_s
    return math.ceil(in_flight / (max_concurrency_per_replica * headroom))

# Inputs are illustrative: measure max_concurrency at your TPOT SLO with a load test.
print(replicas_needed(peak_rps=50, mean_e2e_s=8.0, max_concurrency_per_replica=64))
# A replica that takes minutes to cold start cannot absorb a spike that arrives in seconds:
def spare_needed(spike_rps_increase, mean_e2e_s, max_conc, cold_start_s, ramp_s):
    # if the spike fully arrives before new replicas are ready, hold spare capacity now
    if cold_start_s > ramp_s:
        return math.ceil(spike_rps_increase * mean_e2e_s / max_conc)
    return 0
print(spare_needed(20, 8.0, 64, cold_start_s=300, ramp_s=60))
```

Output:

```
9
3
```

Inputs are illustrative. The spare-capacity rule is a simplification for a design discussion, not a sourced policy.

---

## 6. Sources

All 82 URLs below are cited in this file. Two FinOps Foundation pages returned HTTP 403 and are marked as not read.

1. https://arxiv.org/html/2407.21783 (checked 2026-10-28)
2. https://huggingface.co/Qwen/Qwen3-32B/raw/main/config.json (checked 2026-10-28)
3. https://huggingface.co/openai/gpt-oss-120b/raw/main/config.json (checked 2026-10-28)
4. https://huggingface.co/deepseek-ai/DeepSeek-V3/raw/main/config.json (checked 2026-10-28)
5. https://arxiv.org/html/2405.04434 (checked 2026-10-28)
6. https://arxiv.org/abs/2405.04434 (checked 2026-10-28)
7. https://arxiv.org/abs/2309.06180 (checked 2026-10-28)
8. https://arxiv.org/html/2309.06180 (checked 2026-10-28)
9. https://vllm.ai/blog/2023-06-20-vllm (checked 2026-10-28)
10. https://arxiv.org/abs/2305.13245 (checked 2026-10-28)
11. https://www.nvidia.com/en-us/data-center/h100/ (checked 2026-10-28)
12. https://www.nvidia.com/en-us/data-center/h200/ (checked 2026-10-28)
13. https://www.nvidia.com/en-us/data-center/dgx-b200/ (checked 2026-10-28)
14. https://docs.nvidia.com/nim/benchmarking/llm/latest/metrics.html (checked 2026-10-28)
15. https://www.databricks.com/blog/llm-inference-performance-engineering-best-practices (checked 2026-10-28)
16. https://arxiv.org/abs/2401.09670 (checked 2026-10-28)
17. https://raw.githubusercontent.com/vllm-project/vllm/main/vllm/v1/metrics/loggers.py (checked 2026-10-28)
18. https://docs.vllm.ai/en/latest/design/metrics.html (checked 2026-10-28)
19. https://www.usenix.org/conference/osdi22/presentation/yu (checked 2026-10-28)
20. https://www.anyscale.com/blog/continuous-batching-llm-inference (checked 2026-10-28)
21. https://arxiv.org/abs/2403.02310 (checked 2026-10-28)
22. https://vllm.ai/blog/2025-01-27-v1-alpha-release (checked 2026-10-28)
23. https://docs.vllm.ai/en/latest/configuration/optimization.html (checked 2026-10-28)
24. https://docs.vllm.ai/en/latest/usage/v1_guide.html (checked 2026-10-28)
25. https://newreleases.io/project/pypi/vllm/release/0.11.0 (checked 2026-10-28)
26. https://github.com/vllm-project/vllm/releases (checked 2026-10-28)
27. https://arxiv.org/abs/2210.17323 (checked 2026-10-28)
28. https://arxiv.org/abs/2306.00978 (checked 2026-10-28)
29. https://arxiv.org/abs/2209.05433 (checked 2026-10-28)
30. https://huggingface.co/docs/hub/gguf (checked 2026-10-28)
31. https://raw.githubusercontent.com/ggml-org/llama.cpp/master/ggml/src/ggml-common.h (checked 2026-10-28)
32. https://docs.vllm.ai/en/latest/features/quantization/quantized_kvcache.html (checked 2026-10-28)
33. https://arxiv.org/abs/2211.17192 (checked 2026-10-28)
34. https://arxiv.org/abs/2302.01318 (checked 2026-10-28)
35. https://arxiv.org/abs/2401.10774 (checked 2026-10-28)
36. https://arxiv.org/html/2401.10774 (checked 2026-10-28)
37. https://arxiv.org/abs/2401.15077 (checked 2026-10-28)
38. https://arxiv.org/abs/2503.01840 (checked 2026-10-28)
39. https://arxiv.org/abs/2408.11049 (checked 2026-10-28)
40. https://docs.vllm.ai/en/latest/features/speculative_decoding/ (checked 2026-10-28)
41. https://docs.sglang.io/advanced_features/speculative_decoding.html (checked 2026-10-28)
42. https://docs.vllm.ai/en/latest/design/prefix_caching.html (checked 2026-10-28)
43. https://arxiv.org/abs/2312.07104 (checked 2026-10-28)
44. https://arxiv.org/html/2312.07104 (checked 2026-10-28)
45. https://lmsys.org/blog/2024-01-17-sglang/ (checked 2026-10-28)
46. https://docs.sglang.io/ (checked 2026-10-28)
47. https://arxiv.org/abs/2510.09665 (checked 2026-10-28)
48. https://arxiv.org/abs/2311.18677 (checked 2026-10-28)
49. https://docs.vllm.ai/en/latest/features/disagg_prefill.html (checked 2026-10-28)
50. https://docs.sglang.io/advanced_features/pd_disaggregation.html (checked 2026-10-28)
51. https://developer.nvidia.com/blog/introducing-nvidia-dynamo-a-low-latency-distributed-inference-framework-for-scaling-reasoning-ai-models/ (checked 2026-10-28)
52. https://llm-d.ai/blog/llm-d-announce (checked 2026-10-28)
53. https://arxiv.org/abs/1909.08053 (checked 2026-10-28)
54. https://arxiv.org/abs/2305.05176 (checked 2026-10-28)
55. https://arxiv.org/abs/2406.18665 (checked 2026-10-28)
56. https://developers.openai.com/api/docs/pricing (checked 2026-10-28)
57. https://platform.claude.com/docs/en/about-claude/pricing (checked 2026-10-28)
58. https://ai.google.dev/gemini-api/docs/pricing (checked 2026-10-28)
59. https://developers.openai.com/api/docs/guides/batch (checked 2026-10-28)
60. https://developers.openai.com/api/docs/guides/prompt-caching (checked 2026-10-28)
61. https://platform.claude.com/docs/en/build-with-claude/prompt-caching (checked 2026-10-28)
62. https://docs.litellm.ai/docs/proxy/users (checked 2026-10-28)
63. https://docs.litellm.ai/docs/routing (checked 2026-10-28)
64. https://portkey.ai/docs/product/ai-gateway (checked 2026-10-28)
65. https://openrouter.ai/docs/features/provider-routing (checked 2026-10-28)
66. https://openrouter.ai/docs/faq (checked 2026-10-28)
67. https://openrouter.ai/pricing (checked 2026-10-28)
68. https://openrouter.ai/docs/features/model-routing (checked 2026-10-28)
69. https://www.finops.org/wg/finops-for-ai-overview/ (attempted 2026-10-28, HTTP 403, not read)
70. https://www.finops.org/wg/token-economics-saas/ (attempted 2026-10-28, HTTP 403, not read)
71. https://docs.cloud.google.com/kubernetes-engine/docs/best-practices/machine-learning/inference/autoscaling (checked 2026-10-28)
72. https://sre.google/workbook/implementing-slos/ (checked 2026-10-28)
73. https://www.techinterview.org/post/3233460079/design-an-llm-inference-api/ (checked 2026-10-28)
74. https://www.techinterview.org/post/3233477300/why-speculative-decoding-is-faster/ (checked 2026-10-28)
75. https://github.com/amitshekhariitbhu/ai-engineering-interview-questions (checked 2026-10-28)
76. https://github.com/llmgenai/LLMInterviewQuestions (checked 2026-10-28)
77. https://www.aced.io/blog/ai-engineer-interview-questions (checked 2026-10-28)
78. https://prachub.com/interview-questions/trace-an-llm-request-through-a-paged-kv-inference-engine (checked 2026-10-28)
79. https://www.techinterview.org/post/3233475331/ai-inference-infrastructure-interview-prep-2026-vllm-triton/ (checked 2026-10-28)
80. https://aiinterviewprep.substack.com/p/advanced-nlp-interview-questions-2e4 (checked 2026-10-28)
81. https://prachub.com/interview-questions/implement-and-benchmark-speculative-decoding (checked 2026-10-28)
82. https://prachub.com/resources/llm-inference-optimization-interview-questions-quantization-batching-kv-cache-and-latency (checked 2026-10-28)
