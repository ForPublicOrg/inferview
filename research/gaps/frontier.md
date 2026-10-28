# Gap report: architecture advances, long context, multimodal and vector systems

Research angle: long context, hybrid and alternative architectures, multimodal models, image and video generation basics, embedding internals, vector database internals, reranker training and search evaluation.

Every source below was fetched and read on 2026-10-28 unless the row says otherwise. Where a number comes from an abstract, it is the authors' own claim; the "Numbers" section says so when it matters. Company names appear only where the cited page names the company next to the question.

Note on paths: on 2026-10-28 the working tree moved lessons from `src/content/lessons/<track>/<slug>.mdx` to `src/content/lessons/<track>/<module>/overview.mdx` (uncommitted at the time of writing). Paths below use the new layout. `SPEC.md` now names `research/curriculum-v2.json`, which does not exist yet; the placements suggested in section 2 are written so they can be copied into it.

---

## 1. What exists today and what is missing

### Method

Every lesson and problem under `src/content` was searched for the topic terms of this angle. Terms with zero matching files: `YaRN`, `attention sink`, `StreamingLLM`, `Mamba`, `state space`, `diffusion`, `video`, `hard negative`, `InfoNCE`, `turbopuffer`, `DiskANN`. The curriculum in `research/brief.json` has no entry for RoPE scaling, SSMs, diffusion, vision-language models, speech models or image generation; its only multimodal items are "Multimodal RAG over images and slides" and "Design a multimodal file uploader".

### File by file

| File | What it covers for this angle | Level today | What is missing |
|---|---|---|---|
| `lessons/foundations/attention/overview.mdx` | A table of GQA, MLA, sliding-window layers, linear-attention hybrids (Qwen3.8-27B, 3 Gated DeltaNet per full-attention layer), FlashAttention; Gemma 3 KV overhead numbers; KV bytes per token for Llama 3.1 8B | Good survey, one row per technique | How RoPE works and how a model is stretched past its training length (PI, NTK, YaRN, Llama 3 `rope_type`, LongRoPE, static YaRN caveat); attention sinks; iRoPE and no-position layers; sparse attention (DeepSeek DSA); why SSMs fail at copying; diffusion language models. Nothing a staff candidate could use to answer "how would you take this 32K model to 128K". |
| `lessons/foundations/embeddings/overview.mdx` | Contrastive training in two paragraphs; Matryoshka truncation and re-normalisation; int8 and binary storage; model table; instruction prefixes | Solid user-level view | The training mechanics an interviewer probes: InfoNCE and temperature, in-batch negatives and why batch size matters, GradCache, hard-negative mining and the false-negative problem, MatryoshkaLoss, CLIP's symmetric loss. No "fine-tune an embedder for your domain" workflow. |
| `lessons/foundations/model-landscape/overview.mdx` | "Advertised context versus effective context": Lost in the Middle, RULER, NoLiMa, Context Rot | Correct and sourced | How a needle test is built, why HELMET found it does not predict downstream results, and how to build a long-context eval for your own task. |
| `lessons/inference/inference-anatomy/overview.mdx` | Prefill and decode, KV cache bytes, "Why GQA, MQA and MLA exist" | Strong | KV compression as a family: eviction (H2O, SnapKV), sinks plus window (StreamingLLM), quantisation (KIVI), offload, top-k sparse attention. Capacity math for hybrid models whose linear layers hold a fixed state. |
| `lessons/rag/retrieval-foundations/overview.mdx` | IVF, HNSW, PQ, binary quantisation; pgvector filter gotcha; pgvector dimension limits; "pin 0.8.3 or later" | Good first pass | HNSW internals past the sketch (neighbour-selection heuristic, memory per vector, deletes and tombstones); filtered ANN as a design problem (pre, post, inline; ACORN; Qdrant filterable HNSW and `full_scan_threshold`; pgvector `hnsw.iterative_scan` and `hnsw.max_scan_tuples`); SSD-resident indexes (DiskANN); object-storage-backed engines (turbopuffer); RaBitQ; sharding, multi-tenancy and freshness. pgvector's README now shows 0.8.7. |
| `lessons/rag/hybrid-search/overview.mdx` | Fusion, rerankers as "spend compute where it changes the answer", query transformation | Practitioner level | How rerankers are trained (BCE vs listwise losses, mining parameters, distillation vs contrastive), LLM listwise reranking, measured gains from fine-tuning a small reranker. |
| `lessons/rag/advanced-rag/overview.mdx` | Late interaction and ColPali; long context vs RAG; cache-augmented generation | Good decision content | ColBERT internals: MaxSim, ColBERTv2 residual compression, PLAID, MUVERA, and the storage math that decides whether late interaction is affordable. |
| `lessons/rag/ingestion/overview.mdx` | Mentions ColPali and vision for PDFs | Pointer only | A playbook for OCR pipeline vs VLM-native parsing vs page-image retrieval, with token costs per page. |
| `lessons/system-design/case-realtime/overview.mdx` | Pipeline vs speech-to-speech, semantic VAD, barge-in, WebRTC with ephemeral secrets, Realtime session cost model, latency widget with an 800 ms budget | Good, product level | A sourced per-stage budget from microphone to speaker; turn-detection models (Smart Turn); full-duplex models (Moshi); what ASR and TTS models do inside; telephony overhead. The 800 ms figure is one vendor's target (see section 5). |
| `lessons/system-design/case-retrieval/overview.mdx`, `problems/system-design/sys-007.mdx` | PDF page token costs (Claude, Gemini 258 per page) | Correct | No general image-token model across providers (Claude 28 px patches, OpenAI 32 px patches with a multiplier or 512 px tiles, Gemini 258-token tiles, video and audio token rates). |
| `lessons/evals/golden-sets/overview.mdx` | NDCG and recall@k as metrics | Metric definitions | Search evaluation as a practice: judgment pools, graded labels, LLM relevance assessors and their limits, the BEIR and BRIGHT gap, offline vs online disagreement. |
| Problems `fnd-005`, `fnd-006`, `fnd-012`, `fnd-015`, `inf-002`, `rag-003`, `rag-004`, `rag-005`, `rag-006`, `rag-017`, `sys-010`, `sys-011` | Similarity metric choice, embedding upgrade debug, 1M window miss, KV estimates, flat vs IVF vs HNSW, LIMIT 10 returns 3 rows, 50M chunks memory, PDF chunking, reranker choice, voice design, moderation cascade | Mostly medium difficulty | No code problem for HNSW, PQ, InfoNCE, MaxSim or RoPE; no estimate for image or video tokens; no debug for RoPE scaling, sink eviction, false negatives or filtered recall at a new selectivity; no critique or workflow problems (types the new spec adds) anywhere in this angle. |

### Missing entirely

Image and video generation; vision-language model architecture; speech recognition, TTS and full-duplex models; SSMs and Mamba; diffusion language models; RoPE scaling; attention sinks; KV compression beyond GQA and MLA; embedding training; reranker training; search evaluation methodology; SSD and object-storage vector indexes; filtered ANN algorithms.

### Level

Where the angle is covered, it is covered as "know that X exists and what it buys". The interview sources in section 3 ask candidates to implement CLIP loss, explain which KV tensors are cached and where RoPE bugs appear, design a video VLM end to end, and fix filtered recall without destroying latency. That is the bar to write to.

---

## 2. Material to add

Kinds follow the new `SPEC.md`: `lesson`, `teardown`, `playbook`, `paper` (paper walkthrough), plus `lab` (progressive build, section 10 of the spec). Placement is a suggestion as `track/module`; four new modules are proposed: `foundations/long-context`, `foundations/architectures`, `foundations/multimodal` and `rag/vector-systems`, plus `rag/search-quality`. Level is the reader the item is written for.

### A. Long context

**A1. RoPE from the inside, and how a context window is stretched** (lesson, staff; `foundations/long-context`)
RoPE rotates query and key pairs by a position-dependent angle so the dot product depends on relative distance. Position Interpolation squeezes positions into the trained range instead of extrapolating, with fine-tuning within 1,000 steps to 32,768 tokens; YaRN rescales frequencies unevenly and claims 10 times fewer tokens and 2.5 times fewer steps than earlier methods; Llama 3.1 ships a `rope_type: llama3` block with factor 8 from an original 8,192 positions; LongRoPE searches per-dimension factors to reach 2,048K. The engineering point: these are config changes with a quality cost, and Qwen's card warns that static YaRN can hurt short inputs. Widget: rotate a 2-D pair at several frequencies and watch which dimensions wrap past the trained length.
Sources: RoFormer https://arxiv.org/abs/2104.09864 (not fetched in this pass; already cited in `research/tracks/foundations.md`); PI https://arxiv.org/abs/2306.15595; YaRN https://arxiv.org/abs/2309.00071; LongRoPE https://arxiv.org/abs/2402.13753; Llama 3.1 config https://huggingface.co/unsloth/Meta-Llama-3.1-8B-Instruct/blob/main/config.json; Qwen3-8B card https://huggingface.co/Qwen/Qwen3-8B; Llama 4 iRoPE https://ai.meta.com/blog/llama-4-multimodal-intelligence/. All checked 2026-10-28 except RoFormer.

**A2. YaRN, walked through** (paper, staff; `foundations/long-context`)
What problem PI left (high-frequency dimensions lose local resolution), the per-frequency ramp, the attention temperature term, and what shipped because of it (gpt-oss extends dense layers to 131,072 tokens with YaRN; Qwen3 documents a factor-4 YaRN block). Interview angle: "why not just raise the base".
Sources: https://arxiv.org/abs/2309.00071; gpt-oss model card https://arxiv.org/html/2508.10925; https://huggingface.co/Qwen/Qwen3-8B. Checked 2026-10-28.

**A3. Attention sinks and streaming** (paper, senior; `foundations/long-context`)
StreamingLLM showed window attention collapses once the first tokens are evicted, because heads park attention on initial tokens "even if they are not semantically important"; keeping those few KV entries recovers quality, runs to 4 million tokens and is up to 22.2 times faster than sliding-window recompute. gpt-oss bakes the idea into the model with a learned per-head bias in the softmax denominator. Engineering consequence: any KV eviction policy must pin the sink tokens.
Sources: https://arxiv.org/abs/2309.17453; https://arxiv.org/html/2508.10925. Checked 2026-10-28.

**A4. Shrinking the KV cache: a decision guide** (playbook, staff; `inference/inference-anatomy`)
Four families with different failure modes: architectural (GQA, MQA, MLA, hybrid linear layers; fixed at training time), eviction (H2O keeps 20% heavy hitters plus recent tokens; SnapKV picks per-head positions from an observation window and reports 380K tokens on one A100-80GB), quantisation (KIVI: keys per channel, values per token, 2 bits, 2.6 times less peak memory), and top-k sparse attention (DeepSeek DSA keeps 2,048 KV tokens per query, O(Lk) core attention). Worked case: serve a 128K-context assistant on a fixed GPU budget; what to measure after (task accuracy at length, not needle accuracy).
Sources: H2O https://arxiv.org/abs/2306.14048; SnapKV https://arxiv.org/abs/2404.14469; KIVI https://arxiv.org/abs/2402.02750; DeepSeek-V3.2 https://arxiv.org/html/2512.02556; MQA https://arxiv.org/abs/1911.02150; GQA https://arxiv.org/abs/2305.13245; DeepSeek-V2 https://arxiv.org/abs/2405.04434. Checked 2026-10-28.

**A5. Testing long context honestly** (lesson plus lab, senior; `evals/agent-evals` or `foundations/long-context`)
The needle test plants a fact at a depth in Paul Graham essays and sweeps length and depth; RULER found only half of 17 models held up at 32K despite near-perfect needle scores; NoLiMa removed lexical overlap and 11 of 13 models fell below half their short-context score at 32K; HELMET (59 models) found needle results "do not reliably predict downstream performance". Lab: build a probe suite in Pyodide against a scripted mock model: single needle, multi-needle, no-overlap needle, multi-hop chain, aggregation; then a report that plots score by length.
Sources: https://github.com/gkamradt/LLMTest_NeedleInAHaystack; RULER https://arxiv.org/abs/2404.06654; NoLiMa https://arxiv.org/abs/2502.05167; HELMET https://arxiv.org/abs/2410.02694. Checked 2026-10-28.

### B. Architectures

**B1. MLA and the KV bytes table** (paper, staff; `foundations/architectures`)
DeepSeek-V2's latent attention: compress K and V into a shared latent, cache the latent, keep a small decoupled RoPE key because rotation does not commute with the absorbed projection. Reported: 93.3% smaller KV cache and 5.76 times max generation throughput against DeepSeek 67B. Pair with an estimate problem comparing MHA, GQA-8 and MLA bytes per token from published configs.
Sources: https://arxiv.org/abs/2405.04434; DeepSeek-V3 config https://huggingface.co/deepseek-ai/DeepSeek-V3/blob/main/config.json (not fetched in this pass; already cited in `research/tracks/foundations.md`). Paper checked 2026-10-28.

**B2. State space models and why production uses hybrids** (lesson, staff; `foundations/architectures`)
Mamba makes the SSM parameters input-dependent so the fixed-size state can choose what to keep; claims 5 times higher inference throughput and linear scaling. Mamba-2 recasts SSMs as structured matrices related to attention, 2 to 8 times faster. The catch: "Repeat After Me" proves a two-layer transformer can copy exponentially long strings while a fixed state cannot, and finds pretrained transformers "dramatically outperform" SSMs at copying and retrieval from context. So shipped models keep some attention: Jamba 1 attention per 7 Mamba layers with a 4 GB KV cache at 256K against Mixtral's 32 GB; Kimi Linear 3 KDA per 1 MLA layer; Qwen3.8-27B 3 Gated DeltaNet per 1 gated attention layer. Systems analogy: a fixed-size ring buffer summary vs a full log.
Sources: Mamba https://arxiv.org/abs/2312.00752; Mamba-2 https://arxiv.org/abs/2405.21060; Repeat After Me https://arxiv.org/abs/2402.01032; Jamba https://arxiv.org/html/2403.19887; Gated DeltaNet https://arxiv.org/abs/2412.06464; Kimi Linear https://arxiv.org/html/2510.26692; Qwen3.8-27B card https://huggingface.co/Qwen/Qwen3.8-27B. Checked 2026-10-28.

**B3. Layer layouts in open-weight configs** (teardown, staff; `foundations/architectures`)
A side-by-side reading of real configs: gpt-oss (alternating 128-token banded window and dense layers, 64 query heads, 8 KV heads, learned sinks, YaRN to 131,072), Gemma 3 (5 local to 1 global), Jamba (1:7, MoE every other layer, 16 experts top-2), Kimi Linear (3:1, 48B total, 3B active), MiniMax-01 (lightning attention, 456B total, 45.9B active, 1M training context, 4M at inference), Llama 4 (iRoPE, no-position layers interleaved), DeepSeek-V3.2 (DSA). What is not public: training data mix and most ablations. Interview use: "given this config, how much KV per token at 128K".
Sources: https://arxiv.org/html/2508.10925; https://arxiv.org/html/2403.19887; https://arxiv.org/html/2510.26692; https://arxiv.org/abs/2501.08313; https://ai.meta.com/blog/llama-4-multimodal-intelligence/; https://arxiv.org/html/2512.02556; Gemma 3 numbers already sourced in `foundations/attention`. Checked 2026-10-28.

**B4. Diffusion language models** (lesson, senior; `foundations/architectures`)
Generate by iteratively unmasking many positions in parallel instead of one token at a time. LLaDA 8B is reported competitive with LLaMA3 8B on in-context learning and better on a reversal poem task; Mercury Coder reports 1,109 and 737 tokens per second on H100 and up to 10 times faster than speed-optimised models, measured by Artificial Analysis. Engineering angle: what parallel decoding does to streaming UX, KV caching and structured output.
Sources: LLaDA https://arxiv.org/abs/2502.09992; Mercury https://arxiv.org/abs/2506.17298. Checked 2026-10-28.

### C. Multimodal

**C1. How a vision-language model sees** (lesson, senior; `foundations/multimodal`)
ViT turns an image into patch tokens; CLIP trains image and text towers on 400 million pairs with a contrastive loss; LLaVA connects a vision encoder to an LLM with a projector and GPT-4-generated instruction data; Qwen2.5-VL trains a native dynamic-resolution ViT with window attention and absolute time encoding for hour-long video; Llama 4 uses early fusion with a MetaCLIP-based encoder. Systems view: the encoder is a lexer for pixels and the projector is the ABI between two compilers. Covers frozen vs trained components, which the TikTok question below asks about.
Sources: ViT https://arxiv.org/abs/2010.11929; CLIP https://arxiv.org/abs/2103.00020; LLaVA https://arxiv.org/abs/2304.08485; Qwen2.5-VL https://arxiv.org/abs/2502.13923; https://ai.meta.com/blog/llama-4-multimodal-intelligence/. Checked 2026-10-28.

**C2. What an image, a page, a second of video and a second of audio cost** (playbook plus estimate problems, senior; `foundations/multimodal`)
Claude: one visual token per 28 by 28 patch, capped at 1,568 tokens (standard) or 4,784 tokens and 2,576 px long edge (Claude 4.7 and later). OpenAI patch models: 32 px patches times a 1.2 multiplier (1,229 tokens for 1024 by 1024 on the documented example); tile models: 85 base plus 170 per 512 px tile for gpt-4o and gpt-4.1. Gemini: 258 tokens per image up to 384 px, larger images in 768 px tiles at 258 each; audio 32 tokens per second; video documented as 263 tokens per second and, in a table on the same page, about 100 (low) or 300 (high) per second. Widget: drop in dimensions, pick provider, get tokens and cost. Decision: downsample, crop, or switch tier.
Sources: https://platform.claude.com/docs/en/build-with-claude/vision; https://developers.openai.com/api/docs/guides/images-vision; https://ai.google.dev/gemini-api/docs/tokens. Checked 2026-10-28.

**C3. Documents: OCR pipeline, VLM parsing or page-image retrieval** (playbook, senior; `rag/ingestion`)
Three routes with different failure modes and costs. ColPali embeds page images as multi-vectors with late interaction and reports beating text-extraction pipelines on its ViDoRe benchmark while being simpler; Qwen2.5-VL targets invoices, forms and tables; Claude and Gemini price pages as images. Worked case: 200-page contracts with tables and stamps.
Sources: ColPali https://arxiv.org/abs/2407.01449; https://arxiv.org/abs/2502.13923; provider pages in C2. Checked 2026-10-28.

**C4. Speech models for engineers** (lesson, senior; `foundations/multimodal`)
ASR (Whisper trained on 680,000 hours of multilingual, multitask data), TTS with time to first byte as the metric that matters, and full-duplex speech LLMs (Moshi models user and agent audio as parallel streams, 160 ms theoretical and 200 ms practical latency). Turn detection as its own model: VAD alone vs semantic VAD (OpenAI `semantic_vad` with an eagerness setting) vs Pipecat's Smart Turn (about 30 ms per classification on a cloud vCPU, 23 languages).
Sources: Whisper https://arxiv.org/abs/2212.04356; Moshi https://arxiv.org/abs/2410.00037; https://developers.openai.com/api/docs/guides/realtime-vad; https://www.voiceaiandvoiceagents.com. Checked 2026-10-28.

**C5. A voice turn, millisecond by millisecond** (teardown plus lab, staff; `system-design/case-realtime`)
Teardown of the Pipecat maintainers' published round-trip table: microphone, Opus encode, network, jitter buffer, transcription and endpointing 300 ms, LLM time to first byte 650 ms, sentence aggregation, TTS 120 ms, playback; the table sums to 1,293 ms. Their June 2026 update sets 1,500 ms as the target and says to avoid spikes. Lab: a discrete-event simulator in Python where the reader adds streaming TTS, speculative LLM start on interim transcripts, filler phrases for slow tools and barge-in truncation, with tests on P50 and P95.
Sources: https://www.voiceaiandvoiceagents.com; https://arxiv.org/abs/2410.00037; the existing Realtime cost sources in `case-realtime`. Checked 2026-10-28.

**C6. Image and video generation for the AI engineer** (lesson, senior; `foundations/multimodal`)
Enough to design and serve, not to train: DDPM's noise-and-denoise loop; latent diffusion moves the work into an autoencoder's latent space; classifier-free guidance trades diversity for quality with one model trained conditional and unconditional; DiT replaces the U-Net with a transformer and reaches FID 2.27 on ImageNet 256; flow matching and rectified flow (Stable Diffusion 3, separate weights per modality) straighten the path and cut steps; Movie Gen is a 30B transformer generating 16-second 1080p video at 16 fps from up to 73K video tokens. Serving levers: step count, distillation, caching the text encoder, batching by resolution.
Sources: DDPM https://arxiv.org/abs/2006.11239 (not fetched in this pass; cite after a check); LDM https://arxiv.org/abs/2112.10752; CFG https://arxiv.org/abs/2207.12598; DiT https://arxiv.org/abs/2212.09748; Flow Matching https://arxiv.org/abs/2210.02747; SD3 https://arxiv.org/abs/2403.03206; Movie Gen https://arxiv.org/abs/2410.13720. Checked 2026-10-28 except DDPM.

### D. Embeddings, vector systems, reranking, search evaluation

**D1. Training an embedding model** (lesson plus lab, staff; `foundations/embeddings`)
InfoNCE with in-batch negatives (Sentence Transformers' MultipleNegativesRankingLoss "requires a larger batch size for better performance"); GradCache to get large batches without the memory; explicit hard negatives (DPR used BM25 negatives and beat BM25 by 9 to 19 points top-20; ANCE refreshes negatives from an ANN index during training); false negatives (NV-Retriever's positive-aware mining, GISTEmbed's guide model, the `NO_DUPLICATES` batch sampler); weak-supervision pretraining (E5 was the first to beat BM25 zero-shot on BEIR); MatryoshkaLoss. Lab: implement CLIP-style symmetric loss and a miner with `range_min`, `range_max`, `margin` in stdlib Python on toy vectors, with tests that catch a false negative.
Sources: https://sbert.net/docs/package_reference/sentence_transformer/losses.html; DPR https://arxiv.org/abs/2004.04906; ANCE https://arxiv.org/abs/2007.00808; NV-Retriever https://arxiv.org/abs/2407.15831; E5 https://arxiv.org/abs/2212.03533; Matryoshka https://arxiv.org/abs/2205.13147; CLIP https://arxiv.org/abs/2103.00020. Checked 2026-10-28.

**D2. Late interaction, walked through** (paper, staff; `rag/advanced-rag`)
ColBERT keeps one vector per token and scores with MaxSim, claiming two orders of magnitude faster than BERT rerankers and four orders fewer FLOPs per query; ColBERTv2 cuts the storage blow-up by 6 to 10 times with residual compression; PLAID cuts search latency up to 7 times on GPU and 45 times on CPU at 140M passages; MUVERA turns multi-vector sets into fixed-dimensional encodings for ordinary MIPS, with 10% better recall and 90% lower latency on average on BEIR. Estimate problem: storage for 10M passages at 128 tokens and 128 dims.
Sources: https://arxiv.org/abs/2004.12832; https://arxiv.org/abs/2112.01488; https://arxiv.org/abs/2205.09707; https://arxiv.org/abs/2405.19504. Checked 2026-10-28.

**D3. HNSW, built by hand** (lesson plus lab, senior; `rag/vector-systems`)
Layers drawn from an exponentially decaying distribution, greedy descent, the neighbour-selection heuristic the paper says matters at high recall and on clustered data, `M`, `ef_construction`, `ef_search`, memory per node, why deletes need tombstones or rebuilds. Lab in stdlib Python: insert, search, measure recall against brute force at several `ef_search` values, then add a filter and watch recall fall.
Sources: HNSW https://arxiv.org/abs/1603.09320; pgvector README https://github.com/pgvector/pgvector; PracHub vector database guide https://prachub.com/resources/vector-database-interview-questions-hnsw-ivf-filtering-and-recall-vs-latency. Checked 2026-10-28.

**D4. Filtered vector search** (playbook plus debug and critique problems, staff; `rag/vector-systems`)
Pre-filter (exact over the subset), post-filter (pgvector's README: 10% selectivity with `ef_search` 40 gives about 4 rows), inline or filter-aware traversal (Qdrant adds payload-based edges if payload indexes exist before the graph is built, and switches to full scan below `full_scan_threshold`, 10,000 KB in the sample config; ACORN's predicate subgraph traversal reports 2 to 1,000 times higher throughput at fixed recall), iterative scans (pgvector `hnsw.iterative_scan`, `hnsw.max_scan_tuples` 20,000 by default), and partitioning per tenant. Inputs that change the choice: selectivity, correlation between filter and query, tenant count.
Sources: https://github.com/pgvector/pgvector; https://qdrant.tech/documentation/concepts/indexing/; ACORN https://arxiv.org/abs/2403.04871. Checked 2026-10-28.

**D5. Vector quantisation** (lesson plus estimate, senior; `rag/vector-systems`)
Scalar int8, binary with rescoring (pgvector `binary_quantize` expression index then rerank the top 20 by full vectors), product quantisation (sub-vector codebooks, asymmetric distance tables), RaBitQ (D-bit codes with a theoretical error bound, claims a clear margin over PQ). Systems analogy: lossy compression with a verification pass.
Sources: PQ, Jégou et al. https://hal.archives-ouvertes.fr/file/index/docid/825085/filename/jegou_pq_postprint.pdf (surfaced by search, not opened in this pass); RaBitQ https://arxiv.org/abs/2405.12497; https://github.com/pgvector/pgvector; existing HF embedding-quantization source. Checked 2026-10-28 except the PQ PDF.

**D6. Indexes on SSD and object storage** (teardown, staff; `rag/vector-systems`)
DiskANN serves a billion points from one 64 GB RAM workstation with SSD at over 5,000 QPS, under 3 ms mean latency and 95%+ 1-recall@1 on SIFT1B. turbopuffer keeps data in object storage with a WAL per namespace, a SPFresh-based centroid index (chosen over graphs because it suits object storage), NVMe and memory caches; cold p50 874 ms and warm p50 14 ms at 1M documents, one WAL commit per namespace per second, strong consistency by default with an eventual option up to about an hour stale. Interview use: "design vector search for a million tenants".
Sources: DiskANN https://proceedings.neurips.cc/paper/2019/hash/09853c7fb1d3f8ee67a61b6bf4a7f8e6-Abstract.html; https://turbopuffer.com/docs/architecture; Faiss https://arxiv.org/abs/2401.08281. Checked 2026-10-28.

**D7. Rerankers: choosing and training** (lesson, senior; `rag/hybrid-search`)
Cross-encoder training with BCE on mined hard negatives as a strong default; listwise losses (LambdaLoss, ListNet); measured gains in the Sentence Transformers write-up (GooAQ NDCG@10 from 59.12 retriever-only to 77.14 with a fine-tuned 150M ModernBERT reranker over the top 30); distillation beats contrastive only when the teacher is stronger; LLM rerankers (a distilled 440M model beat a 3B supervised model on BEIR in the RankGPT paper).
Sources: https://huggingface.co/blog/train-reranker; https://arxiv.org/abs/2507.08336; https://arxiv.org/abs/2304.09542; BEIR https://arxiv.org/abs/2104.08663. Checked 2026-10-28.

**D8. Search evaluation** (lesson plus workflow problem, staff; `rag/search-quality`)
Judgment pools and graded relevance; BEIR's finding that BM25 is a robust baseline across 18 datasets; BRIGHT's reasoning-heavy queries where the top MTEB model drops from 59.0 to 18.3 NDCG@10; LLM relevance labelling at Bing (as accurate as human labellers at a fraction of the cost, but paraphrased prompts change accuracy) and UMBRELA's open reproduction (correlates with system rankings on TREC DL 2019 to 2023, used in TREC 2024 RAG); offline-online disagreement. Workflow problem: set up an eval for a new enterprise search with no labels.
Sources: https://arxiv.org/abs/2104.08663; BRIGHT https://arxiv.org/abs/2407.12883; https://arxiv.org/abs/2309.10621; https://arxiv.org/abs/2406.06519. Checked 2026-10-28.

### Suggested problems for this angle (new types included)

| Id idea | Type | Level | Seed |
|---|---|---|---|
| RoPE scaled, short prompts got worse | debug | staff | Qwen card static-YaRN warning |
| Evicted the first four tokens, output turned to noise | debug | senior | StreamingLLM |
| KV bytes per token: MHA vs GQA-8 vs MLA vs Jamba at 256K | estimate | senior | DeepSeek-V2, Jamba configs |
| Implement RoPE on a toy pair and check relative-position invariance | code | senior | RoFormer |
| Image tokens for a 1920 by 1080 screenshot on three providers | estimate | senior | C2 sources |
| Critique a voice-agent design that waits for the full LLM reply | critique | senior | Pipecat table |
| Implement symmetric CLIP loss | code | senior | Uber question |
| Hard-negative miner that keeps false negatives | debug | staff | NV-Retriever |
| Filtered search returns 11 of 50 at 140 ms | debug | staff | PracHub guide scenario |
| Implement MaxSim and measure storage | code | senior | ColBERT |
| Design vector search for a million small tenants | design | staff | turbopuffer, pgvector |
| Build the relevance-judgment workflow for a new search product | workflow | staff | Bing, UMBRELA |

---

## 3. Interview questions collected

Type uses the spec's types. Level is our judgement. "Company" is filled only where the cited page names the company with the question; PracHub entries are candidate-reported and paraphrased by PracHub, not company statements.

| # | Question (source wording or close paraphrase) | Type | Level | Source | Company named |
|---|---|---|---|---|---|
| 1 | Explain FlashAttention, KV cache, and RoPE (technical screen, MLE) | concept | senior | https://prachub.com/interview-questions/explain-flashattention-kv-cache-and-rope | TikTok |
| 2 | Design efficient Transformer inference with KV cache: which tensors are cached per layer, variable-length batches, beam search or speculative branching, contexts of 100K+ tokens, memory layout, precision, and common bugs including RoPE position mistakes (onsite) | design | staff | https://prachub.com/interview-questions/design-efficient-transformer-inference-with-kv-cache | Startups.com |
| 3 | Design a real-time AI voice system: ingestion, ASR, orchestration, TTS, session state, interruptions, safety, latency and cost (technical screen, SWE) | design | staff | https://prachub.com/interview-questions/design-a-real-time-ai-voice-system | Decagon |
| 4 | Explain how a CLIP-style model works, common contrastive losses, the weaknesses of bi-encoder retrieval, alternatives (cross-encoders, hybrid, generative retrieval), and how to handle popularity bias | concept | senior | https://prachub.com/interview-questions/explain-clip-contrastive-losses-and-retrieval-limits | Snapchat |
| 5 | Implement the symmetric CLIP contrastive loss from paired image and text embeddings; explain normalisation, temperature and labels | code | senior | https://prachub.com/interview-questions/implement-clip-contrastive-loss | Uber |
| 6 | Design a video vision-language model end to end: data, architecture, objectives, evaluation, serving (onsite) | design | staff | https://prachub.com/interview-questions/design-a-video-vlm-end-to-end | Microsoft |
| 7 | What is a vision encoder, how is it trained, what bottlenecks LLM inference, and how would you cut memory and latency? | concept | senior | https://prachub.com/interview-questions/explain-vision-encoders-and-llm-bottlenecks | Apple |
| 8 | Design the training of a model that maps several modalities into one embedding space: architecture, supervision and losses, evaluation, deployment | design | staff | https://prachub.com/interview-questions/design-training-for-multimodal-embedding-model | TikTok |
| 9 | Walk through your VLM project: encoder, LLM, where fusion happens, what was frozen, data leakage, latency, failure modes such as OCR errors and counting | behavioural | senior | https://prachub.com/interview-questions/explain-your-vlm-project-end-to-end | TikTok |
| 10 | Design an image generation system (data, diffusion vs autoregressive, conditioning, safety, eval, inference optimisation), extend it to text-and-image in and out, then explain a recent paper | design | staff | https://prachub.com/interview-questions/design-image-and-multimodal-generation-systems | Meta |
| 11 | What is the biggest challenge in training multimodal foundation models? Compare reasoning LLMs with chat LLMs | concept | senior | https://prachub.com/interview-questions/explain-challenges-in-training-multimodal-llms | Zillow |
| 12 | Optimise vector semantic search for an assistant: embedding choice or training, ANN and sharding, hybrid plus rerank, caching, tenant isolation, freshness (onsite) | design | staff | https://prachub.com/interview-questions/optimize-vector-semantic-search-for-an-assistant | Microsoft |
| 13 | Design enterprise search with RAG over 5M documents, searchable within 5 minutes, 300 QPS, p95 under 1.2 s, under $0.002 a query, with ACLs, NDCG@k and recall@k offline and A/B online | design | staff | https://prachub.com/interview-questions/design-an-ml-search-system-with-rag | OpenAI |
| 14 | Design LLM search when documents and pasted queries exceed the context window; follow-ups on chunking misses, cross-document synthesis, permissions in caches, a 200-page summary (onsite) | design | staff | https://prachub.com/interview-questions/design-llm-search-handling-long-token-inputs | OpenAI |
| 15 | Design a RAG ranking pipeline: indexing, retrieval and ranking, latency, access control, evaluation (onsite, SWE) | design | senior | https://prachub.com/interview-questions/design-a-rag-ranking-pipeline | Microsoft |
| 16 | Build a candidate search system with semantic retrieval over resumes, noisy structured data and hard filters that must exclude (onsite) | design | senior | https://prachub.com/interview-questions/build-a-candidate-search-system | Mercor |
| 17 | Design two-stage retrieval and ranking with user and listing embeddings; labels, position bias, evaluation (onsite) | design | staff | https://prachub.com/interview-questions/design-user-embedding-semantic-search | Airbnb |
| 18 | What do M, efConstruction and efSearch control? Where does HNSW become difficult? | concept | senior | https://prachub.com/resources/vector-database-interview-questions-hnsw-ivf-filtering-and-recall-vs-latency | none |
| 19 | Your HNSW index returns 50 neighbours in 18 ms at 96% recall; add tenant, category and inventory filters and it returns 11 results in 140 ms. What failed, and how do you fix filtered recall without destroying latency? | debug | staff | same PracHub guide | none |
| 20 | Pre-filtering, post-filtering and inline filtering: differences, and why post-filtering returns fewer than k | concept | senior | same PracHub guide | none |
| 21 | What is the nlist versus nprobe trade-off, and when would you add product quantisation? | concept | senior | same PracHub guide | none |
| 22 | How do you handle fresh writes, updates and deletes in a vector index? What changes when it is sharded? | design | staff | same PracHub guide | none |
| 23 | Offline recall is good but online search quality is bad. What do you check? | debug | staff | same PracHub guide | none |
| 24 | How does RoPE work, and why is it preferred over learned positional embeddings? | concept | senior | https://github.com/amitshekhariitbhu/ai-engineering-interview-questions | none |
| 25 | Your Transformer runs out of memory on long documents because of quadratic self-attention. How do you scale it? | debug | senior | same repo | none |
| 26 | How does sliding window attention work? | concept | senior | same repo | none |
| 27 | Implement multi-head attention, then convert it to grouped-query attention | code | senior | same repo | none |
| 28 | Budget the end-to-end latency for a real-time voice agent (VAD, ASR, LLM, TTS, network). Where does the time go? | estimate | senior | same repo | none |
| 29 | What is speculative (preemptive) LLM generation in a voice agent, and how does it reduce latency? | concept | senior | same repo | none |
| 30 | Cascaded ASR, LLM and TTS vs native speech-to-speech: what are the trade-offs? | concept | senior | same repo | none |
| 31 | How do diffusion language models work? | concept | staff | same repo | none |
| 32 | Your diffusion model takes too long per image. How do you speed up sampling? | debug | senior | same repo | none |
| 33 | Your VLM answers single-image questions but fails on multi-page documents. How do you fix it? | debug | senior | same repo | none |
| 34 | Your multimodal LLM ignores the image and describes from text alone. How do you fix it? | debug | senior | same repo | none |
| 35 | What is ColBERT, and how does late interaction retrieval work? | concept | senior | same repo | none |
| 36 | Your vector database for RAG uses too much memory. How do you reduce it? | debug | senior | same repo | none |
| 37 | Your new embedding model has different dimensions from the vectors in production. How do you handle the mismatch? | workflow | senior | same repo | none |
| 38 | How do you fine-tune an embedding model for a specific domain? | workflow | staff | same repo | none |
| 39 | How do you benchmark and evaluate embedding model quality? | concept | senior | same repo | none |
| 40 | Design a text-to-video generation service (Sora-like) | design | staff | same repo | none |
| 41 | Design the ranking system combining BM25, dense retrieval and LLM reranking across multiple indexes | design | staff | https://www.techinterview.org/companies/perplexity/ | none (the guide labels its prompts "sample" and gives no sourcing, so no company attribution) |
| 42 | How would you evaluate an answer's citation quality? | concept | senior | same guide | none (same reason) |

---

## 4. Numbers and facts to know

All checked 2026-10-28. "Abstract" means the figure is the authors' claim in the abstract; "up to" figures are maxima, not typical.

### Long context

| Fact | Source |
|---|---|
| Position Interpolation extends LLaMA 7B to 65B to 32,768 tokens with fine-tuning within 1,000 steps; interpolation bound at least about 600 times smaller than extrapolation (abstract) | https://arxiv.org/abs/2306.15595 |
| YaRN: 10 times fewer tokens and 2.5 times fewer training steps than previous methods (abstract) | https://arxiv.org/abs/2309.00071 |
| LongRoPE: 2,048K tokens with up to 1K fine-tuning steps at 256K training length; 8 times extension without fine-tuning (abstract) | https://arxiv.org/abs/2402.13753 |
| Llama 3.1 8B config: `rope_type` llama3, factor 8.0, low_freq_factor 1.0, high_freq_factor 4.0, original_max_position_embeddings 8,192, rope_theta 500,000, max_position_embeddings 131,072 | https://huggingface.co/unsloth/Meta-Llama-3.1-8B-Instruct/blob/main/config.json |
| Qwen3-8B: 32,768 native; YaRN factor 4.0 on original 32,768; static YaRN "may impact performance on shorter texts", add only when needed | https://huggingface.co/Qwen/Qwen3-8B |
| gpt-oss: alternating banded window (128 tokens) and dense layers; 64 query heads, 8 KV heads; dense layers extended to 131,072 with YaRN; learned per-head bias in the softmax denominator | https://arxiv.org/html/2508.10925 |
| StreamingLLM: stable to 4 million tokens and more; up to 22.2 times faster than sliding-window recompute (abstract) | https://arxiv.org/abs/2309.17453 |
| H2O: 20% heavy hitters; throughput up to 29, 29 and 3 times over DeepSpeed Zero-Inference, HF Accelerate and FlexGen on OPT-6.7B and OPT-30B; latency up to 1.9 times lower (abstract) | https://arxiv.org/abs/2306.14048 |
| SnapKV: at 16K input, 3.6 times generation speed and 8.2 times memory efficiency; up to 380K tokens on one A100-80GB (abstract) | https://arxiv.org/abs/2404.14469 |
| KIVI: 2-bit KV, keys per channel, values per token; 2.6 times less peak memory including weights; up to 4 times larger batch; 2.35 to 3.47 times throughput (abstract) | https://arxiv.org/abs/2402.02750 |
| DeepSeek-V3.2 DSA: lightning indexer plus top-k selection of 2,048 KV tokens per query; core attention O(L^2) to O(Lk); indexer still O(L^2) but cheap | https://arxiv.org/html/2512.02556 |
| RULER: 17 models claiming 32K or more; only half satisfactory at 32K; near-perfect vanilla needle scores (abstract) | https://arxiv.org/abs/2404.06654 |
| NoLiMa: 13 models claiming 128K or more; 11 below 50% of short-context baseline at 32K; GPT-4o 99.3% to 69.7% | https://arxiv.org/abs/2502.05167 |
| HELMET: 59 models, 7 categories; needle results "do not reliably predict downstream performance" | https://arxiv.org/abs/2410.02694 |
| Llama 4 Scout: 10 million token context; iRoPE interleaves layers without positional embeddings and scales attention temperature at inference | https://ai.meta.com/blog/llama-4-multimodal-intelligence/ |

### Architectures

| Fact | Source |
|---|---|
| MQA: keys and values shared across heads; much faster decoding with minor quality loss (abstract) | https://arxiv.org/abs/1911.02150 |
| GQA: uptraining MHA checkpoints uses 5% of original pre-training compute (abstract) | https://arxiv.org/abs/2305.13245 |
| DeepSeek-V2: 236B total, 21B active, 128K context; KV cache 93.3% smaller and 5.76 times max generation throughput vs DeepSeek 67B; 42.5% lower training cost (abstract) | https://arxiv.org/abs/2405.04434 |
| Mamba: 5 times higher inference throughput than Transformers; linear in sequence length; 3B matches Transformers twice its size (abstract) | https://arxiv.org/abs/2312.00752 |
| Mamba-2: 2 to 8 times faster core layer (abstract) | https://arxiv.org/abs/2405.21060 |
| Two-layer transformer can copy exponentially long strings; fixed-state models cannot; transformers dramatically outperform SSMs at copying and retrieval from context (abstract) | https://arxiv.org/abs/2402.01032 |
| Jamba: attention to Mamba 1:7; MoE every other layer, 16 experts, top-2; 256K context; fits one 80 GB GPU; KV cache 4 GB at 256K vs Mixtral 32 GB | https://arxiv.org/html/2403.19887 |
| Kimi Linear: 3 KDA layers per MLA layer; 48B total, 3B active; KV up to 75% smaller than full MLA; up to 6 times decoding throughput at 1M; RULER 84.3 at 128K vs 81.3 for full MLA | https://arxiv.org/html/2510.26692 |
| Qwen3.8-27B: 16 blocks of (3 Gated DeltaNet plus 1 gated attention); 262,144 native, extensible to 1,000,000 | https://huggingface.co/Qwen/Qwen3.8-27B |
| MiniMax-01: lightning attention; 456B total, 45.9B active; 1M tokens in training, 4M at inference (abstract) | https://arxiv.org/abs/2501.08313 |
| Mercury Coder Mini and Small: 1,109 and 737 tokens per second on H100; up to 10 times faster than speed-optimised models on average (abstract, measured by Artificial Analysis) | https://arxiv.org/abs/2506.17298 |
| LLaDA 8B: competitive with LLaMA3 8B in in-context learning; beats GPT-4o on a reversal poem task (abstract, no score given) | https://arxiv.org/abs/2502.09992 |

### Multimodal

| Fact | Source |
|---|---|
| CLIP: 400 million image-text pairs; zero-shot ImageNet matches the original ResNet-50; over 30 datasets (abstract) | https://arxiv.org/abs/2103.00020 |
| LLaVA: 85.1% relative score vs GPT-4 on its synthetic instruction set; 92.53% on ScienceQA with GPT-4 (abstract) | https://arxiv.org/abs/2304.08485 |
| Claude: tokens = ceil(width/28) times ceil(height/28); standard tier 1,568 px long edge and 1,568 tokens; high-resolution tier (Claude 4.7 and later) 2,576 px and 4,784 tokens; 1000 by 1000 is 1,296 tokens; up to 600 images per request (100 on 200K-context models); 8000 by 8000 max | https://platform.claude.com/docs/en/build-with-claude/vision |
| OpenAI patch models (gpt-5.4, gpt-5.5, gpt-6-astra): 32 px patches, multiplier 1.2, 1024 by 1024 is 1,229 tokens; reject above 30,000 patches. Tile models: gpt-4o and gpt-4.1 85 base plus 170 per 512 px tile; gpt-5.1 70 plus 140 | https://developers.openai.com/api/docs/guides/images-vision |
| Gemini: images up to 384 px in both dimensions 258 tokens; larger images in 768 px tiles at 258 each; audio 32 tokens per second; video 263 tokens per second in text, about 100 (low) or 300 (high) per second in the page's table at 1 fps | https://ai.google.dev/gemini-api/docs/tokens |
| Whisper: 680,000 hours of multilingual, multitask supervision (abstract) | https://arxiv.org/abs/2212.04356 |
| Moshi: full-duplex, 160 ms theoretical and 200 ms practical latency (abstract) | https://arxiv.org/abs/2410.00037 |
| Pipecat primer round trip: transcription and endpointing 300 ms, LLM TTFB 650 ms, TTS TTFB 120 ms, jitter buffers 40 ms each way; table sums to 1,293 ms; 1,500 ms target (June 2026 update); Smart Turn about 30 ms per classification, 23 languages; default VAD stop 0.8 s | https://www.voiceaiandvoiceagents.com |
| OpenAI Realtime: `server_vad` (example 0.5 threshold, 300 ms prefix padding, 500 ms silence) and `semantic_vad` with eagerness low, medium (auto), high; no numeric timeouts published | https://developers.openai.com/api/docs/guides/realtime-vad |
| DiT-XL/2: FID 2.27 on class-conditional ImageNet 256 (abstract) | https://arxiv.org/abs/2212.09748 |
| Movie Gen: 30B transformer; 1080p; 16 s at 16 fps; up to 73K video tokens in training (abstract) | https://arxiv.org/abs/2410.13720 |

### Embeddings, vector systems, reranking, evaluation

| Fact | Source |
|---|---|
| DPR beats Lucene BM25 by 9 to 19 points absolute in top-20 passage retrieval (abstract) | https://arxiv.org/abs/2004.04906 |
| ANCE: negatives from an ANN index refreshed during training; almost 100 times faster than sparse retrieval plus BERT reranking at nearly matching accuracy (abstract) | https://arxiv.org/abs/2007.00808 |
| E5: first model to beat BM25 zero-shot on BEIR (abstract) | https://arxiv.org/abs/2212.03533 |
| NV-Retriever-v1: positive-aware mining removes false negatives; 60.9 on MTEB Retrieval (abstract) | https://arxiv.org/abs/2407.15831 |
| Matryoshka: up to 14 times smaller embeddings at equal ImageNet-1K accuracy; up to 14 times retrieval speed-ups (abstract) | https://arxiv.org/abs/2205.13147 |
| ColBERT: two orders of magnitude faster and four orders fewer FLOPs per query than BERT rerankers (abstract) | https://arxiv.org/abs/2004.12832 |
| ColBERTv2: late interaction footprint cut 6 to 10 times (abstract) | https://arxiv.org/abs/2112.01488 |
| PLAID: up to 7 times (GPU) and 45 times (CPU) lower latency than vanilla ColBERTv2, up to 140M passages (abstract) | https://arxiv.org/abs/2205.09707 |
| MUVERA: 2 to 5 times fewer candidates for the same recall; average 10% better recall with 90% lower latency on BEIR (abstract) | https://arxiv.org/abs/2405.19504 |
| HNSW: logarithmic complexity claim; neighbour heuristic matters at high recall and on clustered data (abstract) | https://arxiv.org/abs/1603.09320 |
| DiskANN: 1B points on one workstation with 64 GB RAM plus SSD; over 5,000 QPS, under 3 ms mean, 95%+ 1-recall@1 on SIFT1B; 5 to 10 times more points per node than HNSW or NSG at high recall | https://proceedings.neurips.cc/paper/2019/hash/09853c7fb1d3f8ee67a61b6bf4a7f8e6-Abstract.html |
| ACORN: 2 to 1,000 times higher throughput at fixed recall for filtered search (abstract) | https://arxiv.org/abs/2403.04871 |
| pgvector 0.8.7: HNSW defaults m 16, ef_construction 64, ef_search 40; `hnsw.max_scan_tuples` 20,000; index limits vector 2,000 dims, halfvec 4,000, bit 64,000, sparsevec 1,000 non-zeros; 10% filter with ef_search 40 gives about 4 rows | https://github.com/pgvector/pgvector |
| Qdrant: filter-aware HNSW edges only if payload indexes exist before the graph is built; `full_scan_threshold` 10,000 KB in the sample config (1 KB is one 256-dim vector) | https://qdrant.tech/documentation/concepts/indexing/ |
| turbopuffer: SPFresh-based centroid index on object storage; cold p50 874 ms and warm p50 14 ms at 1M docs; object storage round trip about 100 ms; write p50 165 ms for 500 kB; one WAL commit per namespace per second; eventual mode up to about 1 hour stale | https://turbopuffer.com/docs/architecture |
| Reranker fine-tune: GooAQ NDCG@10 59.12 retriever only, 74.87 jina-reranker-v2 (278M), 77.14 fine-tuned ModernBERT-base (150M), 79.42 fine-tuned ModernBERT-large (396M), reranking top 30 | https://huggingface.co/blog/train-reranker |
| Distillation beats contrastive training for rerankers only with a stronger teacher (abstract) | https://arxiv.org/abs/2507.08336 |
| RankGPT paper: distilled 440M model beats a 3B supervised model on BEIR (abstract) | https://arxiv.org/abs/2304.09542 |
| BEIR: 18 datasets; BM25 robust; reranking and late interaction best zero-shot at high compute cost (abstract) | https://arxiv.org/abs/2104.08663 |
| BRIGHT: 1,384 queries; SFR-Embedding-Mistral 59.0 NDCG@10 on MTEB vs 18.3 on BRIGHT; explicit reasoning about the query adds up to 12.2 points (abstract) | https://arxiv.org/abs/2407.12883 |
| Bing: LLM relevance labels as accurate as human labellers at a fraction of the cost; prompt paraphrases change accuracy (abstract) | https://arxiv.org/abs/2309.10621 |
| UMBRELA: open reproduction with GPT-4o; correlates with system rankings on TREC DL 2019 to 2023; used in TREC 2024 RAG (abstract) | https://arxiv.org/abs/2406.06519 |

---

## 5. Misconceptions a reviewer should check

1. **"It passes needle-in-a-haystack, so it handles long context."** RULER, NoLiMa and HELMET all show needle scores near perfect while realistic or no-overlap tasks fall apart. Any lesson that uses a needle score as evidence of usable context is wrong.
2. **"Raise the RoPE base or add YaRN and the window is free."** Qwen's card says static YaRN can hurt short inputs and should be added only when needed. Check that context-extension content names the short-context cost and says fine-tuning budgets (PI within 1,000 steps) are claims for specific models.
3. **"Attention sinks are important tokens."** StreamingLLM says the first tokens attract attention "even if they are not semantically important". The fix is to keep their KV entries, not to put important content there. gpt-oss replaces the sink token with a learned softmax bias.
4. **"Linear attention or Mamba removes the long-context problem."** Fixed-state models are provably limited at copying, and every shipped example in section 4 keeps some full attention (1:7, 3:1). Check that hybrid ratios are quoted from the paper or config, and that Kimi Linear's 75% and 6 times are "up to" figures against full MLA, not against GQA.
5. **"MLA cuts the KV cache by 93.3%."** That number is against DeepSeek 67B, a dense MHA model. The existing attention lesson computes 71 times against a full multi-head layout from the V3 config; both are fine if the baseline is stated. A comparison against a GQA-8 model is smaller and must be computed, not borrowed.
6. **"Images cost width times height divided by 750 tokens."** That rule of thumb circulates from older Claude guidance; it is not on the current Claude vision page (checked 2026-10-28), which counts 28 px patches with tier caps, OpenAI's newer models count 32 px patches with a 1.2 multiplier, older OpenAI models use 85 plus 170 per tile, Gemini uses 258-token tiles. Any image-token number must name the model family.
7. **"Gemini video is 263 tokens per second."** The same page also gives about 100 (low resolution) and 300 (high resolution) per second at 1 fps. State which setting a figure assumes.
8. **"800 ms voice-to-voice is the industry standard."** It is one vendor's P50 target (already labelled so in `system-design/framework`). The Pipecat maintainers' June 2026 update sets 1,500 ms and measures a typical stack at about 1.3 s. The `case-realtime` widget default of 800 ms should be labelled as an assumption.
9. **"Moshi responds in 160 ms."** 160 ms is theoretical; the paper gives 200 ms in practice.
10. **"Diffusion LMs are 10 times faster."** Mercury's figure is "up to 10x on average" for coder models against speed-optimised models, measured by a third party. It is not a general speed claim for the model family.
11. **"Add a WHERE clause to vector search."** With post-filtering, pgvector's own example returns about 4 rows for LIMIT-like behaviour at 10% selectivity. Fixes depend on selectivity: iterative scans, higher ef_search, partitions, filter-aware graphs or exact search on the subset.
12. **"Qdrant filtering just works."** Filter-aware edges exist only if payload indexes were created before the graph. Content that skips index order is incomplete.
13. **"pgvector 0.8.3 is current."** The README now shows 0.8.7. The existing "pin 0.8.3 or later" advice stays correct as a floor; any "latest version" wording should be dated.
14. **"HNSW is O(log n), so it scales."** The paper's claim is about unfiltered search on its benchmarks; memory (full vectors plus graph in RAM), deletes and filters are where it gets hard. DiskANN and centroid indexes on object storage exist because of the RAM cost.
15. **"Object-storage vector databases are slow."** turbopuffer's warm p50 is 14 ms at 1M documents; the cold p50 is 874 ms. The design question is how often a namespace is cold.
16. **"More in-batch negatives is always better" and "the hardest negatives are best."** Duplicates and unlabelled positives in a batch become false negatives (Sentence Transformers' `NO_DUPLICATES` sampler, GISTEmbed's guide model); NV-Retriever exists because the hardest mined negatives are often unlabelled positives.
17. **"The top MTEB model is the best retriever."** BRIGHT shows the then top MTEB model dropping from 59.0 to 18.3 NDCG@10 on reasoning-heavy queries. Shortlist from leaderboards, decide on your own queries.
18. **"LLM relevance labels can replace human judges."** Bing reports human-level accuracy, but also that paraphrasing the prompt changes it; UMBRELA's correlation is with system rankings, not with individual human labels. Calibrate on a human-labelled slice.
19. **"Late interaction storage is prohibitive."** ColBERTv2 cuts the footprint 6 to 10 times and MUVERA reduces search to single-vector MIPS; it is still larger than one vector per passage, so the storage math has to be shown, not asserted either way.
20. **"Fine-tuned rerankers need a big model."** The Sentence Transformers write-up has a 150M fine-tuned reranker beating a 1.54B general one on its domain, and the author says the advantage is domain-specific. Do not generalise beyond the evaluated domain.
21. **"Distil the reranker from an LLM and it will be better."** Distillation helps only when the teacher is stronger than the student; otherwise contrastive training is the robust baseline.
22. **Company attribution.** PracHub pages are candidate reports paraphrased by PracHub, and search snippets can mislabel the company: one search result attributed the user-embedding search question to Snapchat, while the page itself says Airbnb. The techinterview.org Perplexity guide labels its prompts "sample" and cites nothing, so it supports no company tag.
23. **Abstract numbers presented as measurements.** Most figures in section 4 are authors' claims from abstracts, often "up to". Lessons should say "the paper reports" and keep the baseline next to the number.
