# Track research: LLM foundations for software engineers

Track slug `foundations`. Modules: `tokens`, `embeddings`, `attention`, `sampling`, `training`, `model-landscape`. Problem id prefix `fnd`. Core 100 slots for this track: 12 (SPEC section 7).

Every fact below carries the URL it came from. All sources were checked on 2026-10-28 unless a row says otherwise. Labels used in the tables:

- **fetched**: read from the primary page or PDF on 2026-10-28.
- **config**: read from the model's published `config.json` on Hugging Face on 2026-10-28.
- **measured**: produced locally on 2026-10-28 with Python 3.12.6 and tiktoken 0.13.0.
- **computed**: arithmetic on fetched or config values, shown in section 5 so a reader can rerun it.
- **unsourced**: could not be confirmed from a primary source in this pass. Do not put these in a lesson as fact.

Frontier model names, prices and context sizes changed several times in 2026 and will change again. Lessons should teach how to read a model card and a price page, use the numbers below as a dated snapshot, and keep the stable teaching examples on open-weight models whose configs are published (Llama 3.1, Qwen3, Gemma 3, DeepSeek-V3, gpt-oss).

## 1. Verified facts by module

### 1.1 tokens

| Fact | Value | Label | Source |
|---|---|---|---|
| BPE for NMT subword units (Sennrich, Haddow, Birch) | arXiv 1508.07909, ACL 2016; toy corpus `low`, `lower`, `newest`, `widest` with counts 5, 2, 6, 3 in Algorithm 1 | fetched | https://arxiv.org/abs/1508.07909 |
| gpt2 / r50k_base size | n_vocab 50,257 (50,256 BPE ranks plus `<\|endoftext\|>` at 50256) | measured | https://github.com/openai/tiktoken/blob/main/tiktoken_ext/openai_public.py |
| cl100k_base size | 100,256 BPE ranks; n_vocab 100,277 including 5 special tokens (`<\|endoftext\|>` 100257, three FIM tokens 100258 to 100260, `<\|endofprompt\|>` 100276) | measured | same file; tiktoken 0.13.0 |
| o200k_base size | 199,998 BPE ranks; n_vocab 200,019 (`<\|endoftext\|>` 199999, `<\|endofprompt\|>` 200018) | measured | same file |
| o200k_harmony size (gpt-oss) | n_vocab 201,088, matching gpt-oss `vocab_size` 201088 | measured, config | same file; https://huggingface.co/openai/gpt-oss-120b/blob/main/config.json |
| Which OpenAI models use which encoding | o200k_base: gpt-4o, gpt-4.1, gpt-4.5, o1, o3, o4-mini, gpt-5 prefixes. cl100k_base: gpt-4, gpt-3.5-turbo, text-embedding-ada-002, text-embedding-3-small, text-embedding-3-large. o200k_harmony: gpt-oss | fetched | https://github.com/openai/tiktoken/blob/main/tiktoken/model.py |
| cl100k pre-tokenizer regex | letters match `\p{L}`; digits split as `\p{N}{1,3}` | fetched | openai_public.py (above) |
| o200k pre-tokenizer regex | letter classes include `\p{M}` (combining marks); digits still `\p{N}{1,3}` | fetched | openai_public.py (above) |
| OpenAI 3rd-gen embedding tokenizer | "use the `cl100k_base` encoding" | fetched | https://developers.openai.com/api/docs/guides/embeddings |
| Llama 3 tokenizer | Blog: "vocabulary of 128K tokens"; "up to 15% fewer tokens compared to Llama 2". Paper: "100K tokens from the tiktoken tokenizer with 28K additional tokens"; English compression from 3.17 to 3.94 characters per token vs Llama 2 | fetched | https://ai.meta.com/blog/meta-llama-3/ ; https://arxiv.org/abs/2407.21783 |
| Llama 3.1 `vocab_size` | 128,256; `bos_token_id` 128000, `eos_token_id` 128009 (so ids from 128000 up are special tokens; this reading is an inference from the config) | config | https://huggingface.co/unsloth/Meta-Llama-3.1-8B-Instruct/blob/main/config.json |
| Llama 4 `vocab_size` | 202,048 | config | https://huggingface.co/unsloth/Llama-4-Scout-17B-16E-Instruct/blob/main/config.json |
| Gemma 1/2 vocabulary | 256,000 (Gemma 2 9B `vocab_size`) | config | https://huggingface.co/unsloth/gemma-2-9b-it/blob/main/config.json |
| Gemma 3 vocabulary | Report: "SentencePiece tokenizer with split digits, preserved whitespace, and byte-level encodings ... The resulting vocabulary has 262k entries"; the same report's Table 1 caption says "256k entries" (262,144 = 256 x 1024). Config `vocab_size` 262144 (1B) and 262208 (27B, multimodal) | fetched, config | https://arxiv.org/abs/2503.19786 ; https://huggingface.co/unsloth/gemma-3-1b-it/blob/main/config.json |
| Gemma 4 vocabulary | `vocab_size` 262144 | config | https://huggingface.co/google/gemma-4-31B-it/blob/main/config.json |
| Qwen vocabulary | Qwen3 `vocab_size` 151,936; Qwen3.8 248,320 | config | https://huggingface.co/Qwen/Qwen3-8B/blob/main/config.json ; https://huggingface.co/Qwen/Qwen3.8-27B/blob/main/config.json |
| DeepSeek-V3 / R1 / V4 vocabulary | 129,280 | config | https://huggingface.co/deepseek-ai/DeepSeek-V3/blob/main/config.json |
| Mistral Small 3.1 vocabulary | 131,072 | config | https://huggingface.co/unsloth/Mistral-Small-3.1-24B-Instruct-2503/blob/main/config.json |
| Claude tokenizer change | "Claude 4.7 and later models ... use a newer tokenizer ... This tokenizer produces approximately 30% more tokens for the same text." Models overview: 1M tokens is about 555k words on the current tokenizer, about 750k words on models before it | fetched | https://platform.claude.com/docs/en/about-claude/pricing ; https://platform.claude.com/docs/en/about-claude/models/overview |
| Cross-language token cost | The same text in different languages can differ in token length "up to 15 times" (Petrov et al., NeurIPS 2023); gaps persist in multilingual tokenizers | fetched | https://arxiv.org/abs/2305.15425 |
| Under-trained ("glitch") tokens | Tokens "present in the tokenizer vocabulary but that are nearly or entirely absent during model training", found across many models (Land and Bartolo, EMNLP 2024) | fetched | https://arxiv.org/abs/2405.05417 |
| minbpe | Byte-level BPE reference in Python, MIT; `GPT4Tokenizer` reproduces GPT-4 tokenization | fetched | https://github.com/karpathy/minbpe |

Measured token counts (tiktoken 0.13.0, 2026-10-28; the non-English sentences are our own translations of "The capital of France is Paris."):

| Text | chars | cl100k_base | o200k_base |
|---|---|---|---|
| `The capital of France is Paris.` | 31 | 7 | 7 |
| `La capital de Francia es París.` | 31 | 9 | 7 |
| `フランスの首都はパリです。` | 13 | 11 | 11 |
| `फ्रांस की राजधानी पेरिस है।` | 27 | 27 | 10 |
| `Столица Франции: Париж.` | 23 | 13 | 9 |
| `法国的首都是巴黎。` | 9 | 11 | 6 |
| `عاصمة فرنسا هي باريس.` | 21 | 17 | 6 |
| `பிரான்சின் தலைநகரம் பாரிஸ்.` | 27 | 38 | 13 |
| `strawberry` | 10 | 3 (`str`,`aw`,`berry`) | 3 (`st`,`raw`,`berry`) |
| ` strawberry` (leading space) | 11 | 1 | 1 |
| `1234567` | 7 | 3 (`123`,`456`,`7`) | 3 |
| `2026-10-28` | 10 | 6 (`202`,`6`,`-`,`10`,`-`,`28`) | 6 |
| `hello  world` (two spaces) | 12 | 3 | 3 |

The existing `research/tokens.json` (js-tiktoken 1.0.15) agrees with these encoders on the English fox sentence (15 and 15) and the Hindi fox sentence (71 and 28).

Unsourced in this pass: the Llama 3 pre-tokenizer regex and how Llama 3 splits digits (likely tiktoken-style, not confirmed); token counts for any string on Claude or Gemini tokenizers (no offline tokenizer was used; both vendors offer token-counting endpoints).

### 1.2 embeddings

| Fact | Value | Label | Source |
|---|---|---|---|
| OpenAI text-embedding-3 dimensions | 1536 (small), 3072 (large) by default; the `dimensions` parameter shortens; manual truncation requires re-normalising | fetched | https://developers.openai.com/api/docs/guides/embeddings |
| OpenAI normalisation | "OpenAI embeddings are normalized to length 1"; cosine can be computed as a dot product; cosine and Euclidean give identical rankings | fetched | same |
| OpenAI limits and scores | max input 8192 tokens; MTEB 62.3% (3-small), 64.6% (3-large), 61.0% (ada-002); "pages per dollar" assumes about 800 tokens per page | fetched | same |
| text-embedding-3-small price | $0.02 per 1M tokens | fetched | https://developers.openai.com/api/docs/models/text-embedding-3-small |
| Matryoshka Representation Learning | Kusupati et al., arXiv 2205.13147 (2022, v4 2024): "up to 14x smaller embedding size for ImageNet-1K classification at the same level of accuracy"; no extra inference cost | fetched | https://arxiv.org/abs/2205.13147 |
| Gemini embeddings | `gemini-embedding-2` latest, `gemini-embedding-001` still available; both output 3072 dims by default, recommended 768, 1536 or 3072; both trained with MRL; v2 auto-normalises truncated output, 001 needs manual normalisation for non-3072 sizes; input limits 8,192 (v2) and 2,048 (001) tokens; `task_type` not accepted by v2 | fetched | https://ai.google.dev/gemini-api/docs/embeddings |
| Qwen3-Embedding | Paper (June 2025): 0.6B, 4B, 8B embedding and reranking models built on Qwen3, Apache 2.0. Card: dims 1024 / 2560 / 4096; 8B supports user-defined dims 32 to 4096 (MRL); 32K sequence length; instructions "typically" give "1% to 5%" improvement; 8B ranked No.1 on MTEB multilingual "as of June 5, 2025, score 70.58" | fetched | https://arxiv.org/abs/2506.05176 ; https://huggingface.co/Qwen/Qwen3-Embedding-8B |
| EmbeddingGemma | Paper (Sept 2025): about 300M parameters. Card: 768 dims, MRL truncation to 512, 256 or 128 then re-normalise; 2048-token input; query prompt `task: search result \| query: {content}`; float16 activations not supported | fetched | https://arxiv.org/abs/2509.20354 ; https://huggingface.co/google/embeddinggemma-300m |
| Embedding quantization | Binary cuts memory 32x, int8 4x; binary keeps about 92.5% of retrieval performance without rescoring and up to about 96% with rescoring; int8 speed-up 3.66x, binary 24.76x (HF blog, March 2024) | fetched | https://huggingface.co/blog/embedding-quantization |
| MMTEB | Feb 2025: more than 500 tasks across more than 250 languages; best public model in their evaluation was multilingual-e5-large-instruct at 560M parameters | fetched | https://arxiv.org/abs/2502.13595 |
| Storage napkin math | 10M vectors x 3072 dims x 4 bytes = 122.88 GB raw float32; 768 dims = 30.72 GB; binary at 3072 dims = 3.84 GB (raw vectors only, no ANN index overhead) | computed | section 5, snippet 4 |

Unsourced in this pass: any specific claim that embeddings fail on negation, or a rate for how often. A lesson can show it with an in-browser model and label it as a demonstration, not a statistic.

### 1.3 attention

| Fact | Value | Label | Source |
|---|---|---|---|
| Why divide by sqrt(d_k) | "We suspect that for large values of d_k, the dot products grow large in magnitude, pushing the softmax function into regions where it has extremely small gradients." Footnote: if q and k components are independent with mean 0 and variance 1, q.k has mean 0 and variance d_k | fetched (PDF) | https://arxiv.org/abs/1706.03762 |
| Transformer base config | N = 6, d_model = 512, d_ff = 2048, h = 8, d_k = d_v = 64; base 65M params, big 213M (Table 3) | fetched (PDF) | same |
| Training | base: 100,000 steps, 12 hours on 8 P100; big: 300,000 steps, 3.5 days | fetched | same |
| BLEU | EN-DE 28.4. EN-FR: the abstract (v7) says 41.8, section 6.1 says 41.0. Quote whichever you cite with its location | fetched | same |
| Complexity table | self-attention O(n^2 d) per layer with O(1) sequential ops; recurrent O(n d^2) with O(n) sequential ops | fetched | same |
| Positional encoding | sinusoids chosen because they "may allow the model to extrapolate to sequence lengths longer than the ones encountered during training"; learned positional embeddings gave "nearly identical results" | fetched | same |
| Original block | post-norm: `LayerNorm(x + Sublayer(x))` | fetched | same |
| GQA | Ainslie et al., EMNLP 2023: intermediate number of KV heads; uptrain MHA checkpoints with about 5% of pre-training compute; "quality close to multi-head attention with comparable speed to MQA" | fetched | https://arxiv.org/abs/2305.13245 |
| RoPE | encodes absolute position with a rotation matrix and adds explicit relative-position dependence; inter-token dependence decays with distance | fetched | https://arxiv.org/abs/2104.09864 |
| FlashAttention | exact attention with tiling and fewer HBM reads and writes; "uses less memory, linear in sequence length"; more FLOPs from recomputation yet faster (up to 7.6x on GPT-2 attention, Figure 1); 15% end to end on BERT-large, 3x on GPT-2 training | fetched (abstract and PDF) | https://arxiv.org/abs/2205.14135 |
| MLA (DeepSeek-V2) | compresses KV into a latent vector; KV cache reduced 93.3% vs DeepSeek 67B; MLA cache equals GQA with 2.25 groups (Table 1, section 2.1.4) | fetched | https://arxiv.org/abs/2405.04434 |
| Llama 3.1 8B | 32 layers, hidden 4096, 32 heads, 8 KV heads, head_dim 128, FFN 14336, RoPE theta 500000, max positions 131072 (Llama 3 RoPE scaling, factor 8 from 8192), RMSNorm | config | https://huggingface.co/unsloth/Meta-Llama-3.1-8B-Instruct/blob/main/config.json |
| Llama 3.1 70B | 80 layers, hidden 8192, 64 heads, 8 KV heads (head_dim 128 derived as 8192 / 64) | config | https://huggingface.co/unsloth/Meta-Llama-3.1-70B-Instruct/blob/main/config.json |
| Llama 3 405B | 126 layers, model dim 16,384, 128 heads; 15.6T tokens; 3.8 x 10^25 FLOPs; trained at 8K then extended to 128K in six stages using about 800B tokens; "compute in self-attention layers grows quadratically in the sequence length" | fetched (PDF) | https://arxiv.org/abs/2407.21783 |
| Gemma 3 attention | 5 local sliding-window layers per global layer, local span 1024; RoPE base 10k local, 1M global; "global only" config gives about 60% KV memory overhead at 32k vs under 15% with 1:3 and sw=1024 | fetched (PDF) | https://arxiv.org/abs/2503.19786 |
| gpt-oss attention | alternating `sliding_attention` (window 128) and `full_attention` layers; 64 query heads, 8 KV heads, head_dim 64 | config | https://huggingface.co/openai/gpt-oss-120b/blob/main/config.json |
| 2026 hybrid attention | Qwen3.8-27B: "16 x (3 x (Gated DeltaNet then FFN) then 1 x (Gated Attention then FFN))", 3 linear-attention layers per full-attention layer; 262,144 native context | fetched (card), config | https://huggingface.co/Qwen/Qwen3.8-27B |
| KV cache per token, Llama 3.1 8B (bf16) | 2 x 32 x 8 x 128 x 2 bytes = 131,072 bytes (128 KiB); 16 GiB for one 128K-token sequence; 4x larger without GQA | computed | section 5, snippet 5 |
| KV cache per token, DeepSeek-V3 | MLA caches 512 + 64 values per layer: about 68.6 KiB per token across 61 layers vs about 4.77 MiB for an MHA layout with the same head sizes (about 71x) | computed | snippet 5; https://huggingface.co/deepseek-ai/DeepSeek-V3/blob/main/config.json |

Unsourced in this pass: claims that particular heads "specialise" in syntax or coreference (interpretability papers exist, none fetched here); any single reason why decoder-only models "won". Keep both as hedged discussion or cite a paper first.

### 1.4 sampling

| Fact | Value | Label | Source |
|---|---|---|---|
| Nucleus (top-p) sampling | Holtzman et al., ICLR 2020: sample from the dynamic nucleus, truncating the unreliable tail; likelihood-maximising decoding gives "bland and repetitive" text | fetched | https://arxiv.org/abs/1904.09751 |
| min-p | Nguyen et al., ICLR 2025 oral: threshold scales with the top token's probability; gains largest at high temperature; adopted in HF Transformers and vLLM | fetched | https://arxiv.org/abs/2407.01082 |
| vLLM SamplingParams | `temperature` default 1.0, "Zero means greedy sampling" and forces top_p 1, top_k 0, min_p 0; `top_p` in (0, 1]; `top_k` 0 or -1 disables; `min_p` relative to the most likely token; `logprobs` returns up to logprobs+1 entries; per-request `seed` | fetched | https://docs.vllm.ai/en/latest/api/vllm/sampling_params.html |
| Temperature 0 nondeterminism | Thinking Machines (Horace He et al., 10 Sept 2025): 1,000 completions of Qwen3-235B-A22B-Instruct-2507 at temperature 0 gave 80 unique outputs, identical for 102 tokens, diverging at token 103 (992 "Queens, New York", 8 "New York City"). Cause: kernels are not batch-invariant and batch size changes with server load. With batch-invariant kernels all 1,000 matched. Cost on Qwen3-8B: 26 s default vLLM, 55 s unoptimised deterministic, 42 s with an improved attention kernel | fetched | https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/ |
| Claude sampling parameters | On Fable 5.1, Mythos 5.1, Fable 5, Mythos 5, Mythos Preview, Opus 5.5, Opus 5, Opus 4.8, Opus 4.7, Sonnet 5.5, Sonnet 5 and Haiku 5.5, non-default `temperature`, `top_p` or `top_k` return 400; `top_p` default 0.99. From API version `2026-10-21`, any of the three at any value returns 400 on every model. Older models on older API versions: `temperature` and `top_k` incompatible with thinking, `top_p` allowed 0.95 to 1 | fetched | https://platform.claude.com/docs/en/build-with-claude/thinking |
| Claude prefill | Claude 4.6 and later reject a prefilled final assistant turn with 400 | fetched | same |
| OpenAI sampling parameters | "When reasoning effort is not `none`, remove `temperature`, `top_p`, and `top_logprobs`"; remove `logprobs` in Chat Completions | fetched | https://developers.openai.com/api/docs/guides/latest-model |
| Open-weight recommended sampling | DeepSeek-R1: temperature 0.5 to 0.7 (0.6 recommended), no system prompt, start the response with `<think>\n`. Qwen3.8-27B thinking mode: temperature 1.0, top_p 0.95, top_k 20, min_p 0. DeepSeek-V4-Pro: temperature 1.0, top_p 0.95 for agentic use | fetched | https://github.com/deepseek-ai/DeepSeek-R1 ; https://huggingface.co/Qwen/Qwen3.8-27B ; https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro-0813 |
| Constrained decoding, Claude | JSON schema compiled to a grammar; first use of a schema adds compile latency; compiled grammars cached 24 hours from last use; unsupported: recursive schemas, numeric and string-length constraints, `additionalProperties` other than false; output can still miss the schema on `stop_reason: "refusal"` or `"max_tokens"`; enum casing not guaranteed; 180-second compile timeout; max 20 strict tools | fetched | https://platform.claude.com/docs/en/build-with-claude/structured-outputs |
| Constrained decoding, vLLM | backends xgrammar and guidance (`auto` picks per request); constraint types choice, regex, json, grammar, structural_tag; lm-format-enforcer deprecated from v0.33.0; reasoning parsers find boundaries by token id, so text-only literals like `</think>` in custom grammars are a trap | fetched | https://docs.vllm.ai/en/latest/features/structured_outputs.html |
| XGrammar | splits the vocabulary into context-independent tokens (prechecked) and context-dependent tokens (checked at runtime with a persistent stack); "up to 100x" speed-up; "near-zero overhead" end to end | fetched | https://arxiv.org/abs/2411.15100 |
| JSONSchemaBench | Jan 2025: 10K real-world JSON schemas; evaluates Guidance, Outlines, Llamacpp, XGrammar, OpenAI and Gemini on efficiency, coverage and quality | fetched | https://arxiv.org/abs/2501.10868 |
| Reasoning tokens | OpenAI: not visible, occupy context, billed as output; reserve "at least 25,000 tokens for reasoning and outputs" when starting; `incomplete` with reason `max_output_tokens` can happen before any visible output | fetched | https://developers.openai.com/api/docs/guides/reasoning |

Unsourced in this pass: whether the OpenAI `seed` parameter still exists on current models and what it guarantees. Do not mention it without checking the API reference.

### 1.5 training

| Fact | Value | Label | Source |
|---|---|---|---|
| InstructGPT | SFT on demonstrations, reward model on rankings, RL with PPO; outputs of 1.3B InstructGPT preferred by labellers over 175B GPT-3 "despite having 100x fewer parameters" | fetched | https://arxiv.org/abs/2203.02155 |
| DPO | Rafailov et al. 2023: closed-form optimal policy, "a simple classification loss", no sampling from the LM during fine-tuning; the title says the LM "is secretly a reward model" (implicit reward) | fetched | https://arxiv.org/abs/2305.18290 |
| GRPO | DeepSeekMath (Feb 2024): "GRPO foregoes the critic model, instead estimating the baseline from group scores"; rewards in a group are normalised by subtracting the group mean and dividing by the group standard deviation (section 4.1.2); DeepSeekMath 7B 51.7% on MATH, 60.9% with self-consistency over 64 samples; 120B math tokens | fetched (PDF) | https://arxiv.org/abs/2402.03300 |
| RLVR term | Tulu 3 (Nov 2024, rev. April 2025) introduces Reinforcement Learning with Verifiable Rewards; recipe SFT, DPO, RLVR on Llama 3.1 bases | fetched | https://arxiv.org/abs/2411.15124 |
| DeepSeek-R1-Zero | RL with GRPO directly on DeepSeek-V3-Base, no SFT; rule-based accuracy and format rewards; AIME 2024 pass@1 from 15.6% to 71.0% in v1 (January 2025) and 77.9% in v2 (January 2026, the Nature version the abs link now serves), 86.7% with majority voting; problems: poor readability, language mixing | fetched (PDF) | https://arxiv.org/abs/2501.12948 |
| DeepSeek-R1 | cold-start SFT, reasoning RL, rejection sampling into about 800k SFT samples (about 600k reasoning, about 200k other), second RL stage; AIME 2024 pass@1 79.8 vs o1-1217 79.2; MATH-500 97.3 vs 96.4; six distilled dense models (1.5B to 70B, Qwen2.5 and Llama bases) fine-tuned on the 800k samples; MIT licence; Nature 645, 633 to 638 (2025) | fetched | https://arxiv.org/abs/2501.12948 ; https://github.com/deepseek-ai/DeepSeek-R1 |
| DAPO | March 2025: open RL system; 50 points on AIME 2024 from the Qwen2.5-32B base; built on verl | fetched | https://arxiv.org/abs/2503.14476 |
| Dr. GRPO | March 2025: GRPO has an optimisation bias that "artificially increases response length", strongest for incorrect outputs; minimalist recipe 43.3% AIME 2024 with a 7B base | fetched | https://arxiv.org/abs/2503.20783 |
| Limits of RLVR | Yue et al., NeurIPS 2025 oral: RLVR models beat the base at small k, but "the base models achieve a higher pass@k score" at large k; distillation can add new reasoning patterns | fetched | https://arxiv.org/abs/2504.13837 |
| Test-time compute | Snell et al., Aug 2024: compute-optimal allocation is more than 4x more efficient than best-of-N; in a FLOPs-matched comparison a smaller model with test-time compute beat a 14x larger model on problems where the small model had non-trivial success | fetched | https://arxiv.org/abs/2408.03314 |
| s1 budget forcing | Jan 2025: 1,000 curated questions (s1K); appending "Wait" extends reasoning; AIME24 from 50% to 57% with more test-time compute | fetched | https://arxiv.org/abs/2501.19393 |
| CoT faithfulness | Anthropic, 3 April 2025: Claude 3.7 Sonnet mentioned the hint it used about 25% of the time, DeepSeek R1 about 39% | fetched | https://www.anthropic.com/research/reasoning-models-dont-say-think |
| LoRA | Hu et al. 2021: vs full fine-tuning GPT-3 175B with Adam, about 10,000x fewer trainable parameters and about 3x less GPU memory; no added inference latency | fetched | https://arxiv.org/abs/2106.09685 |
| QLoRA | Dettmers et al. 2023: fine-tune 65B on one 48GB GPU; NF4, double quantization, paged optimizers; Guanaco 99.3% of ChatGPT on the Vicuna benchmark after 24 hours on one GPU | fetched | https://arxiv.org/abs/2305.14314 |
| LoRA Without Regret | Thinking Machines (John Schulman et al., 29 Sept 2025): LoRA matches full fine-tuning on small-to-medium SFT datasets; apply to all layers, MLP and MoE layers matter most, attention-only underperforms; optimal LR about 10x full fine-tuning; in policy-gradient RL even rank 1 matches; LoRA is less tolerant of large batch sizes | fetched | https://thinkingmachines.ai/blog/lora/ |
| Training memory rule | Mixed-precision Adam: 2 + 2 + 12 = 16 bytes per parameter of model states, before activations (ZeRO, section 3.1); 1.5B GPT-2 needs at least 24 GB | fetched (PDF) | https://arxiv.org/abs/1910.02054 |
| Chinchilla | "for every doubling of model size the number of training tokens should also be doubled"; Chinchilla 70B trained on 1.4 trillion tokens (body text). "About 20 tokens per parameter" is 1.4T / 70B, a derived ratio, not a sentence in the abstract | fetched (PDF) | https://arxiv.org/abs/2203.15556 |
| Distillation | Hinton et al. 2015: train the small model on the large model's soft targets produced at a raised softmax temperature; same temperature during training, temperature 1 afterwards | fetched (PDF) | https://arxiv.org/abs/1503.02531 |
| Llama 3 data scale | over 15T tokens (blog); 405B on 15.6T tokens (paper) | fetched | https://ai.meta.com/blog/meta-llama-3/ ; https://arxiv.org/abs/2407.21783 |

### 1.6 model-landscape

Open-weight configs (architecture fields from `config.json`; MoE totals and actives from the model card or announcement):

| Model | Released | Total / active params | Layers | Heads / KV heads / head_dim | Config max positions | Notes | Source |
|---|---|---|---|---|---|---|---|
| Llama 3.1 8B | July 2024 | 8B dense | 32 | 32 / 8 / 128 | 131,072 | GQA, RoPE theta 500k | config above |
| Llama 3.1 70B | July 2024 | 70B dense | 80 | 64 / 8 / 128 | 131,072 | | config above |
| Llama 4 Scout | 5 Apr 2025 | 109B / 17B, 16 experts | 48 | 40 / 8 / 128 | 10,485,760 | blog: "fits on a single H100 GPU (with Int4 quantization)", 10M context | https://ai.meta.com/blog/llama-4-multimodal-intelligence/ ; https://huggingface.co/unsloth/Llama-4-Scout-17B-16E-Instruct/blob/main/config.json |
| Llama 4 Maverick | 5 Apr 2025 | 400B / 17B, 128 experts | 48 | 40 / 8 / 128 | 1,048,576 | MoE every other layer (`interleave_moe_layer_step` 2); "fits on a single H100 host" | same blog; https://huggingface.co/unsloth/Llama-4-Maverick-17B-128E-Instruct/blob/main/config.json |
| Qwen3-8B | 29 Apr 2025 | 8B dense | 36 | 32 / 8 / 128 | 40,960 (blog: 128K) | Apache 2.0; hybrid thinking via `enable_thinking` or `/think`, `/no_think` | https://qwenlm.github.io/blog/qwen3/ ; config |
| Qwen3-30B-A3B | 29 Apr 2025 | 30B / 3B, 128 experts, 8 active | 48 | 32 / 4 / 128 | 40,960 (blog: 128K) | 36T pretraining tokens, 119 languages | same; https://huggingface.co/Qwen/Qwen3-30B-A3B/blob/main/config.json |
| Qwen3-235B-A22B | 29 Apr 2025 | 235B / 22B, 128 experts, 8 active | 94 | 64 / 4 / 128 | 40,960 (blog: 128K) | | same; https://huggingface.co/Qwen/Qwen3-235B-A22B/blob/main/config.json |
| Qwen3.8-27B | Aug 2026 (card citation) | 27B dense, multimodal | 64 | 24 / 4 / 256 | 262,144 (card: extensible to 1M) | 3 Gated DeltaNet : 1 gated attention; thinking on by default; Apache 2.0 | https://huggingface.co/Qwen/Qwen3.8-27B |
| Qwen3.8-2.4T-A95B | Aug 2026 (HF repo created 2026-08-08) | name says 2.4T / 95B; 512 experts, 10 active | 92 | 64 / 4 / 256 | 262,144 | hybrid linear attention, `full_attention_interval` 4 | https://huggingface.co/Qwen/Qwen3.8-2.4T-A95B/blob/main/config.json |
| Gemma 3 27B | Mar 2025 | 27B dense | 62 | 32 / 16 / 128 | 131,072 | 5:1 local:global, window 1024 | https://arxiv.org/abs/2503.19786 ; https://huggingface.co/unsloth/gemma-3-27b-it/blob/main/config.json |
| Gemma 4 31B | 2026 (HF repo created 2026-03-11) | 31B dense | 60 | 32 / 16 / 256 | 262,144 | 5 sliding (1024) per full layer | https://ai.google.dev/gemma/docs/core ; https://huggingface.co/google/gemma-4-31B-it/blob/main/config.json |
| Gemma 4 26B A4B | 2026 | 26B / about 4B, 128 experts | 30 | 16 / 8 / 256 | 262,144 | docs: all 26B must be loaded into memory | same docs; https://huggingface.co/google/gemma-4-26B-A4B-it/blob/main/config.json |
| Mistral Small 3.1 | Mar 2025 | 24B dense | 40 | 32 / 8 / 128 | 131,072 | | config above |
| DeepSeek-V3 | 26 Dec 2024 (API) | 671B / 37B, 256 routed + 1 shared expert, 8 routed active | 61 | 128 / MLA (kv_lora_rank 512) | 163,840 | 14.8T tokens, 2.788M H800 GPU hours, FP8 weights, multi-token prediction, auxiliary-loss-free balancing | https://arxiv.org/abs/2412.19437 ; config |
| DeepSeek-R1 | 20 Jan 2025 (API) | same architecture as V3 | 61 | same | 163,840 | MIT | https://huggingface.co/deepseek-ai/DeepSeek-R1/blob/main/config.json |
| DeepSeek-V4-Pro-0813 | 13 Aug 2026 (GA) | Hub lists 1.7T params; active not stated | 61 | 128 / 1 / 512 | 1,048,576 | `index_topk` 1024 (sparse-attention indexer), 384 experts, 6 active; effort low/high/max; MIT | https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro-0813 ; https://api-docs.deepseek.com/updates |
| gpt-oss-120b | Aug 2025 | 117B / 5.1B, 128 experts, 4 active | 36 | 64 / 8 / 64 | 131,072 | MXFP4 MoE weights, single 80GB GPU, Apache 2.0, harmony format only, effort low/medium/high | https://huggingface.co/openai/gpt-oss-120b ; https://arxiv.org/abs/2508.10925 |
| gpt-oss-20b | Aug 2025 | 21B / 3.6B, 32 experts, 4 active | 24 | 64 / 8 / 64 | 131,072 | runs within 16GB | https://huggingface.co/openai/gpt-oss-20b |
| Kimi K2 | July 2025 | 1T / 32B, 384 experts, 8 active, 1 shared | 61 | 64 / MLA | 128K (card) | MuonClip optimizer, modified MIT | https://huggingface.co/moonshotai/Kimi-K2-Instruct |
| Mixtral 8x7B | Jan 2024 | 47B / 13B, 8 experts, top-2 | | | 32k | the classic MoE teaching example, Apache 2.0 | https://arxiv.org/abs/2401.04088 |

DeepSeek API dated releases (change log): V3 2024-12-26, R1 2025-01-20, V3-0324 2025-03-24, R1-0528 2025-05-28, V3.1 2025-08-21 (thinking and non-thinking in one model), V3.1-Terminus 2025-09-22, V3.2-Exp 2025-09-29, V3.2 2025-12-01, V4-Pro and V4-Flash 2026-04-24, V4-Pro GA 2026-08-13, V4.1-Flash 2026-09-10, V4.1-Flash-1017 2026-10-17. Source: https://api-docs.deepseek.com/updates

Hosted frontier snapshot on 2026-10-28 (USD per million tokens, input / output):

| Vendor | Model id | Price | Context / max output | Reasoning control | Source |
|---|---|---|---|---|---|
| OpenAI | `gpt-6-astra` | $10 / $50 | 1.05M / 128K | effort low to max; `none` returns 400 | https://developers.openai.com/api/docs/models ; https://developers.openai.com/api/docs/guides/reasoning |
| OpenAI | `gpt-6.1-sol` | $2 / $10 | 1.05M / 128K | effort low to max, default medium | same; https://developers.openai.com/api/docs/guides/latest-model |
| OpenAI | `gpt-6.1-terra` | $1 / $5 | 1.05M / 128K | effort none to max, default medium | same |
| OpenAI | `gpt-6-luna` | $0.10 / $0.50 | 1.05M / 128K | effort none to max | same |
| OpenAI | `gpt-5-2025-08-07` (deprecated) | $1.25 / $10, cached input $0.125 | 400K / 128K | reasoning tokens | https://developers.openai.com/api/docs/models/gpt-5 |
| Anthropic | `claude-fable-5-1` | $10 / $50 | 1M / 128K | adaptive thinking always on, default effort high | https://platform.claude.com/docs/en/about-claude/models/overview |
| Anthropic | `claude-opus-5-5` | $4 / $20 | 1M / 128K | adaptive always on, default effort medium | same |
| Anthropic | `claude-sonnet-5-5` | $2 / $10 | 1M / 128K | adaptive, default effort high | same |
| Anthropic | `claude-haiku-5-5` | from $0.10 / from $0.50 (higher rate above 100K-token prompts) | 1M / 128K | adaptive, default effort medium | same; https://platform.claude.com/docs/en/about-claude/pricing |
| Google | `gemini-4-argon` | $2 / $10 through 30 Nov 2026, then $4 / $20 | 1M | thinking level low, medium (default), high | https://ai.google.dev/gemini-api/docs/pricing ; https://ai.google.dev/gemini-api/docs/generate-content/thinking |
| Google | `gemini-3.8-flash` | $0.75 / $3.75 through 31 Dec 2026, then $1.50 / $7.50 | not stated on the models page | thinking level | same |
| Google | `gemini-2.5-pro` | $1.25 / $10 up to 200K prompt; $2.50 / $15 above | not stated here | thinking budget 128 to 32768, cannot disable | same |

Output prices include thinking or reasoning tokens for all three vendors (OpenAI reasoning guide, Anthropic thinking page, Gemini pricing page).

| Fact | Value | Label | Source |
|---|---|---|---|
| Lost in the Middle | Liu et al., TACL: performance highest when the relevant information is at the start or end of the input, degrades in the middle, even for long-context models | fetched | https://arxiv.org/abs/2307.03172 |
| RULER | 17 models, 13 tasks; all claim at least 32K context, "only half of them can maintain satisfactory performance at the length of 32K" | fetched | https://arxiv.org/abs/2404.06654 |
| NoLiMa | ICML 2025: needles with minimal lexical overlap; 13 models claiming at least 128K; at 32K, 11 fall below 50% of their short-context baseline; GPT-4o from 99.3% to 69.7% | fetched | https://arxiv.org/abs/2502.05167 |
| Context Rot | Chroma, 14 July 2025: 18 models; performance degrades with input length even on simple tasks; a single distractor reduces performance; shuffled haystacks scored better than coherent ones; LongMemEval focused prompts (about 300 tokens) beat full prompts (about 113k) | fetched | https://www.trychroma.com/research/context-rot |
| Leaderboard Illusion | April 2025: "27 private LLM variants tested by Meta in the lead-up to the Llama-4 release"; Google and OpenAI received about 19.2% and 20.4% of Arena data, 83 open-weight models together about 29.7% | fetched | https://arxiv.org/abs/2504.20879 |
| Claude model ids | every Claude id from the 4.6 generation on is a dateless pinned snapshot; earlier aliases resolve to dated ids | fetched | https://platform.claude.com/docs/en/about-claude/models/overview |
| Gemini thinking controls | `thinking_level` on Gemini 3 and later; `thinkingBudget` on 2.5 (Flash 0 to 24576, 0 disables; Pro 128 to 32768); thought signatures must be passed back for function calling on Gemini 3 and 4 | fetched | https://ai.google.dev/gemini-api/docs/generate-content/thinking |

Unsourced in this pass: Meta model releases after Llama 4 (secondary sites disagree; the `meta-llama` Hugging Face org lists no LLM newer than Llama 4 and Llama Guard 4 on 2026-10-28, checked via https://huggingface.co/api/models?author=meta-llama&sort=createdAt&direction=-1); parameter counts for Mistral Large 3, Large 4, Medium 3.5 and Small 4 (the models overview at https://docs.mistral.ai/getting-started/models/models_overview/ lists versions and licences, not sizes).


## 2. Latest developments interviews ask about (2025 and 2026 sources)

Each item names the module it belongs to, what a candidate is expected to say, and the primary source.

1. **Reasoning models and test-time compute** (training, sampling, model-landscape). Every current frontier API ships thinking by default and bills it as output: OpenAI `reasoning.effort` none to max and reserved budget advice (https://developers.openai.com/api/docs/guides/reasoning, checked 2026-10-28); Anthropic adaptive thinking with effort levels, summarised thinking billed at full thinking length (https://platform.claude.com/docs/en/build-with-claude/thinking); Gemini `thinking_level` and the older `thinkingBudget` (https://ai.google.dev/gemini-api/docs/generate-content/thinking). GPT-5 (snapshot `gpt-5-2025-08-07`) is now listed as deprecated (https://developers.openai.com/api/docs/models/gpt-5). Interview angle: latency and cost budgets now depend on an effort knob, not only on output length; `max_tokens` is the hard ceiling, effort is soft guidance.
2. **DeepSeek-R1 and R1-Zero** (training). RL on a base model with GRPO and rule-based rewards, published in Nature in 2025 (https://arxiv.org/abs/2501.12948 ; https://github.com/deepseek-ai/DeepSeek-R1). Distillation into small dense models by SFT on 800k samples.
3. **GRPO and RL with verifiable rewards** (training). GRPO drops the value model and uses group-normalised rewards (https://arxiv.org/abs/2402.03300). 2025 follow-ups that interviewers use for "what goes wrong": length bias and Dr. GRPO (https://arxiv.org/abs/2503.20783), DAPO (https://arxiv.org/abs/2503.14476), and the pass@k ceiling result (https://arxiv.org/abs/2504.13837). RLVR as a named stage in Tulu 3 (https://arxiv.org/abs/2411.15124, rev. April 2025). A public interview item asks candidates to debug a GRPO loop and explain the importance ratio (Anthropic, via PracHub, https://prachub.com/interview-questions/debug-a-grpo-training-loop-and-explain-ratios).
4. **DPO** (training). Still a standard post-training stage in open recipes (Tulu 3 above). Interview angle: offline preference loss with an implicit reward, no sampling during training, versus online RL.
5. **LoRA and QLoRA** (training). 2025 guidance from LoRA Without Regret: all layers including MLP, LR about 10x, rank 1 enough for RL, batch-size sensitivity (https://thinkingmachines.ai/blog/lora/, 29 Sept 2025). QLoRA memory facts from the 2023 paper remain the reference.
6. **Hybrid thinking in one model** (model-landscape). Qwen3 `enable_thinking` and `/think` (https://qwenlm.github.io/blog/qwen3/, April 2025); DeepSeek V3.1 hybrid modes (https://api-docs.deepseek.com/updates, 2025-08-21); Qwen3.8 thinking on by default with `reasoning_effort` (https://huggingface.co/Qwen/Qwen3.8-27B, Aug 2026).
7. **Matryoshka embeddings and instruction-aware embedders** (embeddings). Gemini embeddings trained with MRL and recommended sizes (https://ai.google.dev/gemini-api/docs/embeddings); Qwen3-Embedding with dims 32 to 4096 and instructions (https://arxiv.org/abs/2506.05176, June 2025); EmbeddingGemma 768 to 128 (https://arxiv.org/abs/2509.20354, Sept 2025); MMTEB (https://arxiv.org/abs/2502.13595, Feb 2025).
8. **Open-weight MoE as the default shape** (attention, model-landscape). Llama 4 (April 2025), Qwen3 MoE (April 2025), gpt-oss (Aug 2025), Kimi K2 (July 2025), Gemma 4 26B A4B (2026), DeepSeek V4 (2026). Interview angle: active parameters set compute per token, total parameters set memory.
9. **Attention variants in shipped configs** (attention). GQA everywhere; MLA in DeepSeek and Kimi; sliding-window plus global interleaving in Gemma 3, Gemma 4 and gpt-oss; linear-attention hybrids (Gated DeltaNet 3:1) in Qwen3.8; a sparse-attention indexer (`index_topk`) in DeepSeek V4. Sources: the configs in section 1.6.
10. **Tokenizers** (tokens). o200k_base for GPT-4o through GPT-5 and o200k_harmony for gpt-oss (https://github.com/openai/tiktoken/blob/main/tiktoken/model.py); Llama 3's 128K vocabulary built from 100K tiktoken tokens plus 28K (https://arxiv.org/abs/2407.21783); Claude's tokenizer change at 4.7 producing about 30% more tokens (https://platform.claude.com/docs/en/about-claude/pricing). Interview angle: the same prompt costs differently across model versions, so price per token is not comparable.
11. **Constrained decoding and structured outputs** (sampling). Anthropic structured outputs GA with documented limits (https://platform.claude.com/docs/en/build-with-claude/structured-outputs); vLLM backends (https://docs.vllm.ai/en/latest/features/structured_outputs.html); XGrammar (rev. May 2025, https://arxiv.org/abs/2411.15100); JSONSchemaBench (Jan 2025, https://arxiv.org/abs/2501.10868).
12. **Determinism** (sampling). Batch invariance as the root cause of temperature-0 drift (https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/, Sept 2025).
13. **Sampling knobs leaving frontier APIs** (sampling). Claude rejects non-default sampling parameters on current models and rejects them on every model from API version 2026-10-21 (https://platform.claude.com/docs/en/build-with-claude/thinking); OpenAI asks callers to remove temperature, top_p and logprobs when reasoning is on (https://developers.openai.com/api/docs/guides/latest-model). Interview angle: "how do you make output repeatable" now means evals, caching, constrained outputs and pinned snapshots, not temperature 0.
14. **Effective context versus advertised context** (model-landscape). NoLiMa (ICML 2025) and Context Rot (July 2025) for current evidence; RULER and Lost in the Middle for background.
15. **Benchmark trust** (model-landscape). The Leaderboard Illusion (April 2025) on private variant testing in Chatbot Arena.
16. **Chain-of-thought faithfulness** (training). Anthropic, April 2025: visible reasoning often omits the hint the model used (https://www.anthropic.com/research/reasoning-models-dont-say-think).

## 3. Interview questions collected

40 questions. "Company" is filled only when the source page names the company next to the question; PracHub and aced.io attributions are crowd-sourced or paraphrased reports, not company statements. Difficulty is our judgement.

| # | Question (source wording) | Module | Type | Difficulty | Source | Company named by source |
|---|---|---|---|---|---|---|
| 1 | What is a tokenizer, and why does token count drive both cost and context limits? | tokens | concept | easy | https://www.aced.io/blog/ai-engineer-interview-questions | none |
| 2 | Implement BPE (Byte Pair Encoding) training and encoding from scratch. | tokens | code | medium | https://github.com/amitshekhariitbhu/ai-engineering-interview-questions | none |
| 3 | Implement a Byte Pair Encoding (BPE) Tokenizer (technical screen) | tokens | code | medium | https://prachub.com/interview-questions/implement-a-byte-pair-encoding-bpe-tokenizer | Glean (Software Engineer) |
| 4 | How does Byte Pair Encoding (BPE) tokenization work, and what are its failure modes? | tokens | concept | medium | https://letsdatascience.com/blog/50-llm-and-ai-engineer-interview-questions-for-2026 | none |
| 5 | Your tokenizer splits important domain terms into meaningless subword pieces. How do you fix it? | tokens | debug | medium | https://github.com/amitshekhariitbhu/ai-engineering-interview-questions | none |
| 6 | A large vocabulary can cause computation issues and a small vocabulary can cause OOV issues, what approach would you use (shortened by us) | tokens | concept | medium | https://github.com/llmgenai/LLMInterviewQuestions | none |
| 7 | What is an embedding, and what does semantic similarity mean in a retrieval system? | embeddings | concept | easy | https://www.aced.io/blog/ai-engineer-interview-questions | none |
| 8 | Explain cosine similarity, dot product, and Euclidean distance for vector search. | embeddings | concept | easy | https://github.com/amitshekhariitbhu/ai-engineering-interview-questions | none |
| 9 | Your new embedding model has different dimensions from the existing vectors in production. How do you handle the mismatch? | embeddings | debug | medium | same | none |
| 10 | What is embedding dimensionality, and how does it affect performance and cost? | embeddings | estimate | medium | same | none |
| 11 | Why do we scale the dot product attention by sqrt(d_k) in the Transformer architecture? | attention | concept | medium | same | none |
| 12 | Implement scaled dot-product attention with a causal mask from scratch (NumPy or PyTorch). | attention | code | medium | same | none |
| 13 | Implement and analyze custom attention (onsite; masks, stable softmax, sqrt(d_k), complexity) | attention | code | hard | https://prachub.com/interview-questions/implement-and-analyze-custom-attention | Anthropic (Software Engineer) |
| 14 | Implement Multi-Head Attention from Scratch in NumPy (onsite) | attention | code | medium | https://prachub.com/coding-questions/implement-multi-head-attention-from-scratch-in-numpy | Amazon (Applied Scientist) |
| 15 | Why is attention O(n^2) in sequence length, and what have people done about it? | attention | concept | medium | https://www.techinterview.org/post/3233476821/what-llm-interviewers-ask-about-transformers/ | none |
| 16 | What is the difference between encoder-only (BERT), decoder-only (GPT), and encoder-decoder (T5) models? | attention | concept | easy | same | none |
| 17 | What is Grouped-Query Attention (GQA), and how does it differ from Multi-Head Attention (MHA)? | attention | concept | medium | https://github.com/amitshekhariitbhu/ai-engineering-interview-questions | none |
| 18 | How does Rotary Position Embedding (RoPE) work, and why is it preferred over learned positional embeddings? | attention | concept | hard | same | none |
| 19 | What is Multi-Head Latent Attention (MLA) and why did DeepSeek introduce it? | attention | concept | hard | https://letsdatascience.com/blog/50-llm-and-ai-engineer-interview-questions-for-2026 | none |
| 20 | Estimate the KV cache memory needed to serve a large model. How does it constrain batch size and context length? | attention | estimate | medium | https://github.com/amitshekhariitbhu/ai-engineering-interview-questions | none |
| 21 | What is Mixture of Experts (MoE), and how does it work in models like Mixtral? | attention | concept | medium | same | none |
| 22 | What does the temperature parameter control, and when would you set it near zero? | sampling | concept | easy | https://www.aced.io/blog/ai-engineer-interview-questions | none |
| 23 | Explain Top-k and Top-p Decoding (onsite) | sampling | concept | medium | https://prachub.com/interview-questions/explain-top-k-and-top-p-decoding | Cohere (Machine Learning Engineer) |
| 24 | Implement top-k, top-p, and temperature sampling over a logits vector. | sampling | code | medium | https://github.com/amitshekhariitbhu/ai-engineering-interview-questions | none |
| 25 | Implement Top-p (Nucleus) Sampling in NumPy (onsite) | sampling | code | medium | https://prachub.com/coding-questions/implement-top-p-nucleus-sampling-in-numpy | Amazon (Applied Scientist) |
| 26 | Your text generation repeats phrases in long outputs. How do you fix repetition? | sampling | debug | medium | https://github.com/amitshekhariitbhu/ai-engineering-interview-questions | none |
| 27 | Your LLM keeps ignoring your instructions. How do you make it follow structured output formats? | sampling | debug | medium | same | none |
| 28 | Prompting vs. RAG vs. fine-tuning: how do you choose? | training | design | medium | https://www.aced.io/blog/ai-engineer-interview-questions | none |
| 29 | Why did DPO displace PPO-based RLHF at many labs? When is online RL still better? | training | concept | hard | https://github.com/amitshekhariitbhu/ai-engineering-interview-questions | none |
| 30 | What is RLVR (Reinforcement Learning with Verifiable Rewards), and when does it beat a learned reward model? | training | concept | hard | same | none |
| 31 | Debug a GRPO training loop and explain ratios (technical screen) | training | debug | hard | https://prachub.com/interview-questions/debug-a-grpo-training-loop-and-explain-ratios | Anthropic (Software Engineer) |
| 32 | Do the GPU memory math for full fine-tuning a 7B model in bf16 with Adam. Now with LoRA and QLoRA. | training | estimate | hard | https://github.com/amitshekhariitbhu/ai-engineering-interview-questions | none |
| 33 | How do you choose LoRA rank r? What happens if you set it too low or too high? | training | concept | medium | https://letsdatascience.com/blog/50-llm-and-ai-engineer-interview-questions-for-2026 | none |
| 34 | What are scaling laws (Chinchilla), and how do they guide model size vs training data decisions? | training | concept | medium | https://github.com/amitshekhariitbhu/ai-engineering-interview-questions | none |
| 35 | Your RLHF-trained LLM is gaming the reward model instead of being genuinely helpful. How do you fix reward hacking? | training | debug | hard | same | none |
| 36 | Develop a strategy for OpenAI's fine-tuning capabilities | training | design | hard | https://www.aced.io/blog/ai-engineer-interview-questions | OpenAI |
| 37 | What is the lost-in-the-middle problem and how do you address it? | model-landscape | concept | medium | https://letsdatascience.com/blog/50-llm-and-ai-engineer-interview-questions-for-2026 | none |
| 38 | Your LLM-powered tool hits the context window limit on long documents. How do you handle it? | model-landscape | design | medium | https://github.com/amitshekhariitbhu/ai-engineering-interview-questions | none |
| 39 | What is the difference between open-source and closed-source LLMs? When would you choose one over the other? | model-landscape | design | medium | same | none |
| 40 | What are some new advancements in AI you find interesting? | model-landscape | behavioural | easy | https://www.aced.io/blog/ai-engineer-interview-questions | Anthropic |

Also seen and not counted: "Investigate and mitigate a model that gives confident but factually wrong answers in high-risk contexts" (Anthropic, ML engineer, aced.io) belongs to the safety track's hallucination module. A forum thread at https://tianpan.co/forum/t/collecting-openai-interview-questions-2025-edition-share-your-experience/38 lists OpenAI questions, but every post carries the same date within 17 minutes under persona-style names, so treat it as unreliable and do not attribute anything to OpenAI from it. The brief's own module questions (research/brief.json) have no public source and were not counted.

### 3.1 Recommended for the problem bank

14 problems, 12 core. Ids follow SPEC section 6. Seniority is a suggestion.

| id | Title | Module | Type | Difficulty | Seniority | Core | Built from # | Answer must cover (with section 1 sources) |
|---|---|---|---|---|---|---|---|---|
| fnd-001 | Train and apply BPE on a toy corpus | tokens | code | medium | mid, senior | yes | 2, 3 | merge counting, tie handling, encode by replaying merges in order, unseen words fall back to characters; snippet 1; Sennrich Algorithm 1 |
| fnd-002 | Same sentence, about 4x the tokens | tokens | estimate | easy | mid, senior | yes | 1, 4 | measured counts: Hindi 27 tokens vs English 7 on cl100k (3.9x), 10 vs 7 on o200k (1.4x); the window holds less text and costs scale with tokens; Claude 4.7 tokenizer about 30% more tokens; accept the answer as a ratio band, not a price |
| fnd-003 | Why divide by sqrt(d_k)? | attention | mcq | easy | mid | yes | 11, 13 | variance d_k argument from the paper footnote; distractors: "to make rows sum to 1", "to normalise V", "to keep gradients from exploding in the MLP"; snippet 3 variance demo |
| fnd-004 | Causal attention from scratch | attention | code | medium | senior | yes | 12, 13, 14 | scores, scaling, causal mask, stable softmax, fully masked row returns zeros; stdlib only for Pyodide; snippet 3 |
| fnd-005 | Cosine, dot or L2? | embeddings | mcq | easy | mid | yes | 7, 8 | equivalence only for unit vectors; L2 can rank a same-direction longer vector below an unrelated one; OpenAI normalisation statement; snippet 4 |
| fnd-006 | Search broke after the embedding upgrade | embeddings | debug | medium | mid, senior | yes | 9, 10 | mixed vector spaces in one index, missing query prefix, truncated vectors not re-normalised; choices built from those three plus a decoy (HNSW parameter); Gemini and EmbeddingGemma normalisation notes |
| fnd-007 | Nucleus sampling in 15 lines | sampling | code | medium | mid, senior | yes | 23, 24, 25 | stable softmax, sort, cumulative cut, renormalise, boundary convention stated in the prompt; snippet 2 |
| fnd-008 | Temperature 0, different answers | sampling | debug | medium | senior | yes | 22 | batch invariance (Thinking Machines), not "GPU randomness"; current Claude and OpenAI reasoning models reject temperature; fixes: pinned snapshot, evals that tolerate variation, batch-invariant kernels for self-hosting; snippet 7 |
| fnd-009 | Fine-tuning memory: full, LoRA, QLoRA | training | estimate | hard | senior, staff | yes | 32 | 16 bytes per parameter for mixed-precision Adam (ZeRO), LoRA trainable fraction (snippet 5), QLoRA 65B on 48GB; range for 7B full fine-tune around 112 GB of model states before activations |
| fnd-010 | RLHF, DPO and GRPO in one diagram | training | concept | medium | senior | yes | 29, 30 | InstructGPT pipeline, DPO implicit reward and offline data, GRPO group baseline and verifiable rewards, R1-Zero numbers, limits (Yue et al., Dr. GRPO) |
| fnd-011 | Prompt, RAG or fine-tune? | training | design | medium | senior, staff | yes | 28, 36 | knowledge vs behaviour vs format; freshness, data volume, latency, privacy; LoRA Without Regret for when fine-tuning is cheap enough |
| fnd-012 | The 1M-token window that still misses the answer | model-landscape | concept | medium | mid, senior | yes | 37, 38 | Lost in the Middle, RULER, NoLiMa, Context Rot; mitigations: retrieval, ordering, shorter focused prompts, measuring on your own data |
| fnd-013 | Debug a GRPO step | training | debug | hard | senior, staff | no | 31 | importance ratio should be 1 on the first update of fresh rollouts; causes of drift (multiple epochs per batch, sampler and trainer numerics, stale old-policy log-probs); zero advantage for all-equal groups; snippet 6 |
| fnd-014 | Pick a model for 1M classifications a day | model-landscape | design | medium | senior | no | 39 | dated price table, active vs total params for self-hosting, open-weight licences, evals on your task over leaderboards (Leaderboard Illusion), snapshot pinning |

Types covered: code 3, mcq 2, estimate 2, debug 3, concept 2, design 2. Behavioural is left to the rounds track. Prototype `problems.html` uses `att-002` for the sqrt(d_k) problem; under SPEC section 6 it becomes an `fnd-` id.

## 4. Misconceptions and gotchas for reviewers

### tokens
- "One token is about four characters" holds for English on these tokenizers and fails elsewhere: the Hindi sentence above is 27 characters and 27 cl100k tokens. Anthropic's own conversion changed from about 750k to about 555k words per 1M tokens with the 4.7 tokenizer.
- Vocabulary size has three conventions: BPE ranks (cl100k 100,256), n_vocab with special tokens (100,277), and model `vocab_size`, which may be padded or include reserved specials (Llama 3.1 128,256). A table that mixes them must say which. `prototypes/lesson.html` lists 100,256 and 199,998 (ranks) beside Llama 3's 128,256 (config); label the column.
- "Gemma 256,000" is Gemma 1 and 2. Gemma 3 and 4 have 262,144 (`vocab_size`), and the Gemma 3 report itself writes both "256k" and "262k". `SOURCES.md` and `prototypes/lesson.html` say 256,000 without naming the Gemma version.
- Byte-level BPE has no out-of-vocabulary failure: unseen text falls back to bytes. "What happens to an unseen word" is answered by "more tokens", not "UNK".
- The leading space is part of the token (` strawberry` 1 token, `strawberry` 3). Letter-counting failures are one consequence of tokenization, not the only cause; do not claim tokenization fully explains them.
- Digits are split left to right in groups of up to three by the cl100k and o200k regex. Do not generalise to other tokenizers without checking (Gemma uses split digits; Llama 3 not verified here).
- Token ids are rank numbers specific to one encoding. Never compare ids across tokenizers or treat ids as meaningful.
- Special-token strings in user input: tiktoken refuses `<|endoftext|>` by default. Lessons that encode untrusted text with specials allowed are teaching an injection bug.
- Price per token is not comparable across vendors or even across versions of one vendor's models, because the tokenizers differ.

### embeddings
- Cosine equals dot product only for unit-length vectors. L2 ranks the same as cosine only after normalisation (identity ||a-b||^2 = 2 - 2cos for unit vectors, snippet 4).
- Truncating a Matryoshka embedding breaks unit length. OpenAI, gemini-embedding-001 and EmbeddingGemma need re-normalisation; gemini-embedding-2 does it for you. Check which model a lesson uses.
- Two models with the same dimension still produce incompatible spaces. Re-embed the corpus; never mix in one index.
- Asymmetric prompts matter: EmbeddingGemma expects `task: search result | query:` for queries; Qwen3-Embedding reports 1% to 5% gains from instructions. Leaving them out is a silent quality bug.
- A top MTEB average does not mean best on your corpus; MMTEB found a 560M model ahead of billion-parameter models on its public ranking.
- Storage math in lessons covers raw vectors only; ANN indexes add overhead that varies by index type and was not measured here.
- Input limits differ: 8,192 tokens for OpenAI 3rd-gen and gemini-embedding-2, 2,048 for gemini-embedding-001 and EmbeddingGemma.

### attention
- The sqrt(d_k) scaling is about keeping softmax out of saturated, small-gradient regions as dot-product variance grows with d_k. It is not what makes rows sum to one (softmax does that).
- Quadratic cost is in the score computation over sequence length during prefill or training. FlashAttention is exact, uses linear memory and performs more FLOPs, not fewer; it wins by cutting HBM traffic.
- The KV cache grows linearly with tokens and batch; GQA divides it by query heads / KV heads (4x for Llama 3.1 8B), MLA shrinks it further (about 71x vs an MHA layout for DeepSeek-V3 by our computation).
- The original Transformer is post-norm with sinusoidal positions; current open models use pre-norm RMSNorm and RoPE. Do not present the 2017 block as what Llama runs.
- The 2017 paper's EN-FR BLEU is 41.8 in the abstract and 41.0 in section 6.1.
- MoE active parameters set compute per token; memory still holds all experts (Gemma 4 docs state this for 26B A4B). "17B active" does not mean a 17B memory footprint.
- Sliding-window and hybrid linear layers change the KV cache formula: only full-attention layers grow with context. Apply the per-layer formula only to the layers that use it.
- Llama 3.1's 131,072 max positions come from RoPE scaling over an 8,192 pretraining window plus long-context continued training; a config number is a capability ceiling, not evidence of quality at that length.

### sampling
- "Set temperature 0 for determinism" is wrong twice in 2026: drift comes from batch-variant kernels under load, and current Claude models and OpenAI reasoning models reject temperature (Claude from API version 2026-10-21 on every model). Lessons and problems must not instruct readers to set temperature on those APIs.
- Assistant-turn prefill (for example starting the reply with `{`) is rejected on Claude 4.6 and later; use structured outputs.
- Logprobs are not available from OpenAI when reasoning is on; a lesson that uses logprobs as a confidence tool should use an open-weight server (vLLM) or a non-reasoning setting.
- Top-p boundary conventions differ (keep the token that crosses p, or drop tokens at or below 1 - p). Tests must avoid exact-boundary inputs or state the convention.
- Filter order (temperature, then top-k, top-p, min-p) differs between libraries; state the order in any code problem.
- Constrained decoding guarantees the format, not the content (snippet 9 picks a valid but wrong label). Claude documents three ways a constrained response can still break: refusals, max_tokens truncation, enum casing.
- A tokenizer-level grammar must handle tokens that span grammar boundaries; that is why engines split context-independent and context-dependent tokens (XGrammar). A toy that masks whole strings hides this.
- Recommended sampling settings are model-specific (DeepSeek-R1 0.6, Qwen3.8 thinking 1.0 with top_k 20). A single "best temperature" claim is a red flag.

### training
- InstructGPT's "1.3B preferred over 175B" is a human-preference result on their prompt distribution, not a general capability claim.
- DPO has no separate reward model but does have an implicit one; it is offline unless data is regenerated.
- GRPO needs variance inside each group: groups where every sample gets the same reward contribute zero advantage (snippet 6). It also has a documented length bias (Dr. GRPO).
- RLVR improves pass@1 but the base model can win at large k (Yue et al.); do not write that RL "teaches new reasoning" without that caveat.
- R1-Zero's 86.7% is majority voting over 64 samples; the pass@1 figure is 77.9% in the current version (71.0% in the v1 preprint). R1's 79.8% is pass@1. Do not mix them.
- The "aha moment" is the R1 authors' description; treat it as their interpretation.
- "Chinchilla says 20 tokens per parameter" is derived from 1.4T / 70B; current models train far past it (Llama 3 8B on over 15T tokens). Chinchilla optimises training compute, not inference cost.
- LoRA's "10,000x fewer parameters, 3x less memory" is for GPT-3 175B with Adam; the ratio depends on rank, which matrices get adapters, and the base size.
- The 16-bytes-per-parameter rule covers model states only; activations, buffers and fragmentation come on top (ZeRO).
- "Distillation" for LLMs usually means SFT on teacher outputs (DeepSeek-R1 distill), not Hinton-style soft-target matching. Say which one.
- Thinking text returned by APIs is a summary (Anthropic) or hidden (OpenAI), and visible chain of thought is often unfaithful (Anthropic, April 2025). Do not teach thinking text as a faithful trace.
- Unverified claim to avoid: an interview guide states that GPT-4o and Claude 3 used DPO (https://letsdatascience.com/blog/50-llm-and-ai-engineer-interview-questions-for-2026); no primary source was found.

### model-landscape
- Advertised context is not effective context (RULER, NoLiMa, Context Rot). Llama 4 Scout's 10M is a supported length, not a quality result.
- Leaderboard ranks can be shaped by private testing and data access (Leaderboard Illusion).
- Prices and model names in this file are a 2026-10-28 snapshot; Gemini 4 Argon and 3.8 Flash list scheduled price increases on 1 Dec 2026 and 1 Jan 2027. Every price in a lesson needs its checked date.
- Compare cost per task, not per token: tokenizers differ, and reasoning effort changes output length.
- "Open weights" licences differ (Apache 2.0, MIT, modified MIT, Llama community licence); do not call them all open source.
- Pin model snapshots in examples: Claude ids from 4.6 on are dateless pinned snapshots, earlier aliases moved.
- Interview sources in section 3 are aggregators; company names attach only where the page names them, and even then they are candidate reports, not company statements.

### existing repository files
- `SOURCES.md` lists fonts as Inter, Fraunces and JetBrains Mono from Google Fonts, while SPEC section 2 fixes self-hosted IBM Plex. Not this track's content, but the reviewer should flag it.
- `prototypes/lesson.html` says Hindi "lands at about 1 character per token, because most Devanagari characters are not in the vocabulary and get split into their UTF-8 bytes". The cl100k regex also separates combining marks (`\p{M}`) from letters, which o200k fixed; both effects contribute. The 4.7x figure (71 / 15) matches our measurement.

## 5. Runnable snippets

All snippets are Python 3, standard library only (Pyodide-safe) except snippet 0, and were run with Python 3.12.6 on 2026-10-28 (`python -I file.py`). The output shown under each is the actual output of that run.


### Snippet 0. Measuring tokens with tiktoken (dev-time, needs tiktoken; module tokens)

Status: verified (ran without error, output below).

```python
# Dev-time only (needs `pip install tiktoken`; not available in Pyodide without a wheel).
import tiktoken

cl, o2 = tiktoken.get_encoding("cl100k_base"), tiktoken.get_encoding("o200k_base")
print(cl.n_vocab, o2.n_vocab)                       # includes special tokens
print([cl.decode([t]) for t in cl.encode("strawberry")], cl.encode(" strawberry"))
print([cl.decode([t]) for t in cl.encode("1234567")])
for text in ["The capital of France is Paris.", "La capital de Francia es París."]:
    print(len(cl.encode(text)), len(o2.encode(text)), text)
try:
    cl.encode("<|endoftext|>")                      # special-token text is rejected by default
except ValueError as e:
    print("ValueError:", str(e).splitlines()[0])
```

Output:

```text
100277 200019
['str', 'aw', 'berry'] [73700]
['123', '456', '7']
7 7 The capital of France is Paris.
9 7 La capital de Francia es París.
ValueError: Encountered text corresponding to disallowed special token '<|endoftext|>'.
```

### Snippet 1. BPE training and encoding on the Sennrich toy corpus (module tokens; problem fnd-001)

Status: verified (ran without error, output below).

```python
# Byte-pair encoding training on the Sennrich et al. (2016) toy corpus.
import re
from collections import Counter

def get_stats(vocab):
    pairs = Counter()
    for word, freq in vocab.items():
        symbols = word.split()
        for a, b in zip(symbols, symbols[1:]):
            pairs[a, b] += freq
    return pairs

def merge_vocab(pair, vocab):
    pattern = re.compile(r"(?<!\S)" + re.escape(" ".join(pair)) + r"(?!\S)")
    return {pattern.sub("".join(pair), w): f for w, f in vocab.items()}

vocab = {"l o w </w>": 5, "l o w e r </w>": 2, "n e w e s t </w>": 6, "w i d e s t </w>": 3}
merges = []
for _ in range(10):
    pairs = get_stats(vocab)
    if not pairs:
        break
    best = max(pairs, key=pairs.get)  # ties: first pair seen wins (dict order)
    vocab = merge_vocab(best, vocab)
    merges.append(best)

print(merges[:4])
print(vocab)

def encode(word, merges):
    symbols = list(word) + ["</w>"]
    for a, b in merges:  # apply merges in learned order
        i, out = 0, []
        while i < len(symbols):
            if i + 1 < len(symbols) and symbols[i] == a and symbols[i + 1] == b:
                out.append(a + b); i += 2
            else:
                out.append(symbols[i]); i += 1
        symbols = out
    return symbols

print(encode("lowest", merges))   # unseen word still encodes
print(encode("zzz", merges))      # falls back to single characters
```

Output:

```text
[('e', 's'), ('es', 't'), ('est', '</w>'), ('l', 'o')]
{'low</w>': 5, 'low e r </w>': 2, 'newest</w>': 6, 'wi d est</w>': 3}
['low', 'est</w>']
['z', 'z', 'z', '</w>']
```

### Snippet 2. Temperature, top-k, top-p, min-p (module sampling; problem fnd-007)

Status: verified (ran without error, output below).

```python
# Temperature, top-k, top-p (nucleus) and min-p over a logits dict. Stdlib only.
import math, random

def softmax(logits, temperature=1.0):
    if temperature <= 0:
        raise ValueError("temperature 0 means greedy: use argmax instead")
    scaled = {t: l / temperature for t, l in logits.items()}
    m = max(scaled.values())                      # subtract max for stability
    exps = {t: math.exp(v - m) for t, v in scaled.items()}
    z = sum(exps.values())
    return {t: e / z for t, e in exps.items()}

def top_k(probs, k):
    keep = dict(sorted(probs.items(), key=lambda kv: -kv[1])[:k])
    z = sum(keep.values())
    return {t: p / z for t, p in keep.items()}

def top_p(probs, p):
    keep, total = {}, 0.0
    for t, q in sorted(probs.items(), key=lambda kv: -kv[1]):
        keep[t] = q
        total += q
        if total >= p:                            # smallest set reaching p
            break
    z = sum(keep.values())
    return {t: q / z for t, q in keep.items()}

def min_p(probs, p_base):
    threshold = p_base * max(probs.values())      # scales with model confidence
    keep = {t: q for t, q in probs.items() if q >= threshold}
    z = sum(keep.values())
    return {t: q / z for t, q in keep.items()}

def sample(probs, rng):
    r, acc = rng.random(), 0.0
    for t, q in probs.items():
        acc += q
        if r < acc:
            return t
    return t                                      # guard against float round-off

logits = {"Paris": 5.0, "Lyon": 3.0, "Nice": 2.5, "the": 1.0, "banana": -2.0}
for T in (0.5, 1.0, 2.0):
    print(T, {t: round(p, 3) for t, p in softmax(logits, T).items()})
probs = softmax(logits, 2.0)                      # hot distribution: filters disagree
print("top_k=2", {t: round(p, 3) for t, p in top_k(probs, 2).items()})
print("top_p=0.9", {t: round(p, 3) for t, p in top_p(probs, 0.9).items()})
print("min_p=0.1", {t: round(p, 3) for t, p in min_p(probs, 0.1).items()})
rng = random.Random(0)
print([sample(top_p(probs, 0.9), rng) for _ in range(8)])
assert abs(sum(top_p(probs, 0.9).values()) - 1) < 1e-9
```

Output:

```text
0.5 {'Paris': 0.975, 'Lyon': 0.018, 'Nice': 0.007, 'the': 0.0, 'banana': 0.0}
1.0 {'Paris': 0.809, 'Lyon': 0.109, 'Nice': 0.066, 'the': 0.015, 'banana': 0.001}
2.0 {'Paris': 0.549, 'Lyon': 0.202, 'Nice': 0.157, 'the': 0.074, 'banana': 0.017}
top_k=2 {'Paris': 0.731, 'Lyon': 0.269}
top_p=0.9 {'Paris': 0.604, 'Lyon': 0.222, 'Nice': 0.173}
min_p=0.1 {'Paris': 0.559, 'Lyon': 0.206, 'Nice': 0.16, 'the': 0.076}
['Nice', 'Lyon', 'Paris', 'Paris', 'Paris', 'Paris', 'Lyon', 'Paris']
```

### Snippet 3. Causal scaled dot-product attention and the sqrt(d_k) variance check (module attention; problems fnd-003, fnd-004)

Status: verified (ran without error, output below).

```python
# Scaled dot-product attention with a causal mask, pure Python lists.
import math

def matmul(a, b):
    return [[sum(x * y for x, y in zip(row, col)) for col in zip(*b)] for row in a]

def transpose(m):
    return [list(r) for r in zip(*m)]

def softmax_row(row):
    m = max(row)
    if m == float("-inf"):                       # fully masked row: return zeros, not NaN
        return [0.0] * len(row)
    e = [math.exp(x - m) for x in row]
    s = sum(e)
    return [x / s for x in e]

def attention(Q, K, V, causal=True):
    d_k = len(K[0])
    scores = matmul(Q, transpose(K))             # (n_q, n_k)
    scores = [[s / math.sqrt(d_k) for s in row] for row in scores]
    if causal:
        scores = [[s if j <= i else float("-inf") for j, s in enumerate(row)]
                  for i, row in enumerate(scores)]
    weights = [softmax_row(r) for r in scores]
    return matmul(weights, V), weights

# 3 tokens, d_k = d_v = 2 (toy numbers)
Q = [[1.0, 0.0], [0.0, 1.0], [1.0, 1.0]]
K = [[1.0, 0.0], [0.0, 1.0], [1.0, 1.0]]
V = [[1.0, 2.0], [3.0, 4.0], [5.0, 6.0]]
out, w = attention(Q, K, V)
for row in w:
    print([round(x, 3) for x in row])
print([[round(x, 3) for x in r] for r in out])
assert w[0] == [1.0, 0.0, 0.0]                   # token 0 can only see itself
assert all(abs(sum(r) - 1) < 1e-9 for r in w)

# Why divide by sqrt(d_k): dot products of random unit-variance vectors have variance d_k.
import random, statistics
rng = random.Random(1)
for d in (4, 64, 1024):
    dots = []
    for _ in range(2000):
        q = [rng.gauss(0, 1) for _ in range(d)]
        k = [rng.gauss(0, 1) for _ in range(d)]
        dots.append(sum(a * b for a, b in zip(q, k)))
    print(d, round(statistics.pvariance(dots), 1), round(statistics.pvariance([x / math.sqrt(d) for x in dots]), 2))
```

Output:

```text
[1.0, 0.0, 0.0]
[0.33, 0.67, 0.0]
[0.248, 0.248, 0.503]
[[1.0, 2.0], [2.34, 3.34], [3.51, 4.51]]
4 3.9 0.96
64 62.6 0.98
1024 974.8 0.95
```

### Snippet 4. Cosine, dot, L2, Matryoshka truncation, index size (module embeddings; problem fnd-005)

Status: verified (ran without error, output below).

```python
# Cosine vs dot vs L2, and Matryoshka-style truncation with re-normalisation.
import math

def dot(a, b): return sum(x * y for x, y in zip(a, b))
def norm(a): return math.sqrt(dot(a, a))
def cosine(a, b): return dot(a, b) / (norm(a) * norm(b))
def l2(a, b): return math.sqrt(sum((x - y) ** 2 for x, y in zip(a, b)))
def normalize(a):
    n = norm(a)
    return [x / n for x in a]

q = [0.9, 0.1, 0.3, 0.2]
docs = {"short": [0.9, 0.1, 0.3, 0.2], "long": [2.7, 0.3, 0.9, 0.6], "other": [0.1, 0.9, 0.2, 0.4]}
for name, d in docs.items():
    print(name, "cos", round(cosine(q, d), 3), "dot", round(dot(q, d), 3), "l2", round(l2(q, d), 3))
# "long" is 3x "short": same direction, same cosine, larger dot, larger L2.

# After normalising, all three agree on the ranking: ||a-b||^2 = 2 - 2 cos(a, b).
qn = normalize(q)
for name, d in docs.items():
    dn = normalize(d)
    assert abs(l2(qn, dn) ** 2 - (2 - 2 * dot(qn, dn))) < 1e-12

# Truncating an embedding (Matryoshka) breaks unit length; re-normalise before using dot product.
full = normalize([0.5, -0.2, 0.7, 0.1, 0.05, -0.3, 0.2, 0.1])
cut = full[:4]
print("norm after truncation:", round(norm(cut), 3), "after re-normalising:", round(norm(normalize(cut)), 3))

# Storage napkin math: vectors x dims x bytes per value.
def index_bytes(n_vectors, dims, bytes_per_value):
    return n_vectors * dims * bytes_per_value
for dims, bpv, label in [(3072, 4, "3072 fp32"), (1536, 4, "1536 fp32"), (768, 4, "768 fp32"), (3072, 1, "3072 int8"), (3072, 1 / 8, "3072 binary")]:
    print(label, round(index_bytes(10_000_000, dims, bpv) / 1e9, 2), "GB for 10M vectors")
```

Output:

```text
short cos 1.0 dot 0.95 l2 0.0
long cos 1.0 dot 2.85 l2 1.949
other cos 0.325 dot 0.32 l2 1.153
norm after truncation: 0.92 after re-normalising: 1.0
3072 fp32 122.88 GB for 10M vectors
1536 fp32 61.44 GB for 10M vectors
768 fp32 30.72 GB for 10M vectors
3072 int8 30.72 GB for 10M vectors
3072 binary 3.84 GB for 10M vectors
```

### Snippet 5. KV cache, LoRA and fine-tuning memory, token cost with chat history, MLA (modules attention, training, tokens; problems fnd-002, fnd-009)

Status: verified (ran without error, output below).

```python
# Napkin math from published configs: weights, KV cache, LoRA parameters, token cost.

def weight_gb(params, bytes_per_param):
    return params * bytes_per_param / 1e9

def kv_cache_bytes_per_token(layers, kv_heads, head_dim, bytes_per_value=2):
    return 2 * layers * kv_heads * head_dim * bytes_per_value      # 2 = one K and one V

# Llama 3.1 8B config.json: 32 layers, 8 KV heads, head_dim 128 (4096 / 32 heads)
per_tok = kv_cache_bytes_per_token(32, 8, 128)
print("Llama 3.1 8B KV per token:", per_tok, "bytes =", per_tok / 1024, "KiB")
print("  one 128K-token sequence:", round(per_tok * 131072 / 2**30, 1), "GiB")
# Same model if it had used full multi-head attention (32 KV heads): GQA saves 4x
print("  with 32 KV heads instead:", kv_cache_bytes_per_token(32, 32, 128) / 1024, "KiB per token")
# Llama 3.1 70B: 80 layers, 8 KV heads, head_dim 128
print("Llama 3.1 70B KV per token:", kv_cache_bytes_per_token(80, 8, 128) / 1024, "KiB")
print("nominal 70B weights in bf16:", weight_gb(70e9, 2), "GB")

def lora_params(d_in, d_out, r):
    return r * (d_in + d_out)                                       # A: r x d_in, B: d_out x r

# One 4096 x 4096 projection: full update vs rank-16 LoRA
full = 4096 * 4096
lora = lora_params(4096, 4096, 16)
print("full:", full, "LoRA r=16:", lora, "ratio:", round(full / lora))

# Mixed-precision Adam model states (ZeRO paper, section 3.1): 2 (fp16 weights) + 2 (fp16 grads)
# + 12 (fp32 weights, momentum, variance) = 16 bytes per parameter, before activations and buffers.
print("7B full FT, 16 B/param:", weight_gb(7e9, 16), "GB before activations")

def monthly_cost(convs_per_day, turns, in_tok_per_turn, out_tok_per_turn, usd_in_per_m, usd_out_per_m, days=30):
    calls = convs_per_day * turns * days
    return calls * (in_tok_per_turn * usd_in_per_m + out_tok_per_turn * usd_out_per_m) / 1e6

# Illustrative prices (USD per million tokens), not tied to any vendor.
print("flat 2,000 input tokens per turn:", round(monthly_cost(50_000, 6, 2_000, 300, 1.00, 5.00)), "USD / month")

# Chat APIs are stateless: turn t re-sends the system prompt plus every earlier turn.
def monthly_cost_with_history(convs_per_day, turns, system_tok, user_tok, out_tok, usd_in, usd_out, days=30):
    total_in = total_out = 0
    history = system_tok
    for _ in range(turns):
        history += user_tok
        total_in += history          # whole history is input on every call
        total_out += out_tok
        history += out_tok           # the reply joins the history
    per_conv = (total_in * usd_in + total_out * usd_out) / 1e6
    return per_conv * convs_per_day * days

print("with history (1,500 system, 200 user, 300 reply):",
      round(monthly_cost_with_history(50_000, 6, 1_500, 200, 300, 1.00, 5.00)), "USD / month")

# DeepSeek-V3 config.json: 61 layers, 128 heads, qk_nope_head_dim 128, qk_rope_head_dim 64,
# v_head_dim 128, kv_lora_rank 512. MLA caches one compressed latent (512) plus one shared
# RoPE key (64) per layer instead of full per-head K and V (DeepSeek-V2 paper, section 2.1).
layers, heads = 61, 128
mha_values = heads * (128 + 64) + heads * 128          # per-head K (nope + rope) and V
mla_values = 512 + 64
print("DeepSeek-V3 KV per token, MHA-equivalent:", round(layers * mha_values * 2 / 2**20, 2), "MiB")
print("DeepSeek-V3 KV per token, MLA:", round(layers * mla_values * 2 / 2**10, 1), "KiB",
      "ratio", round(mha_values / mla_values, 1))
```

Output:

```text
Llama 3.1 8B KV per token: 131072 bytes = 128.0 KiB
  one 128K-token sequence: 16.0 GiB
  with 32 KV heads instead: 512.0 KiB per token
Llama 3.1 70B KV per token: 320.0 KiB
nominal 70B weights in bf16: 140.0 GB
full: 16777216 LoRA r=16: 131072 ratio: 128
7B full FT, 16 B/param: 112.0 GB before activations
flat 2,000 input tokens per turn: 31500 USD / month
with history (1,500 system, 200 user, 300 reply): 40050 USD / month
DeepSeek-V3 KV per token, MHA-equivalent: 4.77 MiB
DeepSeek-V3 KV per token, MLA: 68.6 KiB ratio 71.1
```

### Snippet 6. GRPO advantages, the clipped ratio, the DPO loss (module training; problems fnd-010, fnd-013)

Status: verified (ran without error, output below).

```python
# GRPO group-relative advantages, the PPO-style ratio, and the DPO loss on toy numbers.
import math, statistics

# GRPO (DeepSeekMath, section 4.1.2): sample G answers per prompt, score them with a
# verifiable reward, and normalise within the group. No learned value model.
def grpo_advantages(rewards, eps=1e-6):
    mu = statistics.mean(rewards)
    sd = statistics.pstdev(rewards)
    return [(r - mu) / (sd + eps) for r in rewards]

rewards = [1, 0, 0, 1, 0, 0, 0, 1]          # 8 samples, 3 passed the unit tests
print([round(a, 2) for a in grpo_advantages(rewards)])
print(grpo_advantages([1, 1, 1, 1]))          # all correct: zero signal from this prompt
print(grpo_advantages([0, 0, 0, 0]))          # all wrong: zero signal too

# Importance ratio pi_new / pi_old from log-probs; on the first update of fresh rollouts it is 1.
def ratio(logp_new, logp_old):
    return math.exp(logp_new - logp_old)

def clipped_objective(r, adv, eps=0.2):
    return min(r * adv, max(min(r, 1 + eps), 1 - eps) * adv)

print(ratio(-1.2, -1.2), round(clipped_objective(1.5, 1.0), 2), round(clipped_objective(0.5, -1.0), 2))

# DPO (Rafailov et al. 2023): loss = -log sigmoid(beta * ((logp_c - ref_c) - (logp_r - ref_r)))
def dpo_loss(logp_chosen, logp_rejected, ref_chosen, ref_rejected, beta=0.1):
    margin = beta * ((logp_chosen - ref_chosen) - (logp_rejected - ref_rejected))
    return -math.log(1 / (1 + math.exp(-margin)))

print(round(dpo_loss(-10.0, -12.0, -10.0, -12.0), 4))   # policy == reference: loss = log 2
print(round(dpo_loss(-9.0, -14.0, -10.0, -12.0), 4))    # policy prefers chosen more than ref: lower loss
assert abs(dpo_loss(-1, -1, -1, -1) - math.log(2)) < 1e-12
```

Output:

```text
[1.29, -0.77, -0.77, 1.29, -0.77, -0.77, -0.77, 1.29]
[0.0, 0.0, 0.0, 0.0]
[0.0, 0.0, 0.0, 0.0]
1.0 1.2 -0.8
0.6931
0.5544
```

### Snippet 7. Why reduction order changes results (module sampling; problem fnd-008)

Status: verified (ran without error, output below).

```python
# Floating-point addition is not associative, so reduction order changes results.
# A kernel whose reduction order depends on batch size gives different logits for the
# same request under different server load (Thinking Machines, Sept 2025).
import math, random

print((0.1 + 0.2) + 0.3, 0.1 + (0.2 + 0.3))           # 0.6000000000000001 vs 0.6

rng = random.Random(0)
vals = [rng.uniform(-1, 1) * 10 ** rng.randint(-6, 6) for _ in range(10_000)]
orders = {"as-is": sum(vals), "sorted": sum(sorted(vals)), "reversed": sum(reversed(vals)),
          "chunks of 7": sum(sum(vals[i:i + 7]) for i in range(0, len(vals), 7))}
for k, v in orders.items():
    print(f"{k:12s} {v!r}")
print("distinct results:", len(set(orders.values())), "exact:", math.fsum(vals))

# When two logits are nearly tied, a tiny numeric difference flips the greedy (argmax) choice.
run1 = {"Queens": 7.0000001, "New": 7.0}
run2 = {"Queens": 7.0, "New": 7.0000001}
print(max(run1, key=run1.get), max(run2, key=run2.get))
```

Output:

```text
0.6000000000000001 0.6
as-is        -619390.0956232712
sorted       -619390.0956232712
reversed     -619390.0956232712
chunks of 7  -619390.0956232705
distinct results: 2 exact: -619390.0956232712
Queens New
```

### Snippet 8. Log-probabilities as a debugging signal (module sampling)

Status: verified (ran without error, output below).

```python
# Log-probabilities as a debugging tool: sequence log-prob, perplexity, and a low-confidence flag.
import math

token_logprobs = [("The", -0.01), (" invoice", -0.20), (" total", -0.05), (" is", -0.02),
                  (" $", -0.30), ("4", -2.30), ("12", -1.60), (".", -0.10)]
total = sum(lp for _, lp in token_logprobs)
ppl = math.exp(-total / len(token_logprobs))
print("sequence logprob", round(total, 2), "prob", round(math.exp(total), 4), "perplexity", round(ppl, 2))
flagged = [(t, round(math.exp(lp), 2)) for t, lp in token_logprobs if lp < math.log(0.5)]
print("tokens below p=0.5:", flagged)   # the digits are where the model was unsure
```

Output:

```text
sequence logprob -4.58 prob 0.0103 perplexity 1.77
tokens below p=0.5: [('4', 0.1), ('12', 0.2)]
```

### Snippet 9. Constrained decoding in miniature (module sampling)

Status: verified (ran without error, output below).

```python
# Constrained decoding in miniature: mask any token that cannot extend a valid output.
# Real engines (XGrammar, llguidance, Outlines) compile a JSON schema or grammar into an
# automaton and precompute masks; this toy uses a fixed set of allowed strings.
import math

ALLOWED = ['{"label": "refund"}', '{"label": "cancel"}', '{"label": "other"}']
VOCAB = ['{"', 'label', '":', ' "', 'ref', 'und', 'can', 'cel', 'other', '"}', 'Sure', '!', ' ']

def valid_prefix(s):
    return any(a.startswith(s) for a in ALLOWED)

def fake_logits(prefix):
    # A model that would rather chat than emit JSON: "Sure" scores highest everywhere.
    return {t: (5.0 if t == "Sure" else 1.0 + 0.1 * len(t)) for t in VOCAB}

def greedy_constrained(max_steps=12):
    out = ""
    for _ in range(max_steps):
        logits = fake_logits(out)
        masked = {t: (l if valid_prefix(out + t) else -math.inf) for t, l in logits.items()}
        tok = max(masked, key=masked.get)
        if masked[tok] == -math.inf:
            raise RuntimeError("no valid continuation: grammar and vocabulary disagree")
        out += tok
        if out in ALLOWED:
            return out
    raise RuntimeError("ran out of steps before the output was complete")

print(greedy_constrained())   # valid JSON, but the label comes from the masked logits: format is guaranteed, correctness is not
print(max(fake_logits(""), key=fake_logits("").get))   # unconstrained greedy picks "Sure"
```

Output:

```text
{"label": "other"}
Sure
```


## 6. Sources

Every source below was opened on 2026-10-28.

### Tokenizers and tokens
1. tiktoken encodings, `openai_public.py`: https://github.com/openai/tiktoken/blob/main/tiktoken_ext/openai_public.py
2. tiktoken model-to-encoding map, `model.py`: https://github.com/openai/tiktoken/blob/main/tiktoken/model.py
3. tiktoken package (0.13.0 used for measurements): https://pypi.org/project/tiktoken/
4. Sennrich, Haddow, Birch, Neural Machine Translation of Rare Words with Subword Units: https://arxiv.org/abs/1508.07909
5. Karpathy, minbpe: https://github.com/karpathy/minbpe
6. Petrov et al., Language Model Tokenizers Introduce Unfairness Between Languages: https://arxiv.org/abs/2305.15425
7. Land and Bartolo, Fishing for Magikarp: https://arxiv.org/abs/2405.05417
8. Meta, Introducing Meta Llama 3: https://ai.meta.com/blog/meta-llama-3/
9. Llama 3 Herd of Models: https://arxiv.org/abs/2407.21783

### Embeddings
10. OpenAI embeddings guide: https://developers.openai.com/api/docs/guides/embeddings
11. OpenAI text-embedding-3-small model page: https://developers.openai.com/api/docs/models/text-embedding-3-small
12. Matryoshka Representation Learning: https://arxiv.org/abs/2205.13147
13. Gemini embeddings docs: https://ai.google.dev/gemini-api/docs/embeddings
14. Qwen3 Embedding paper: https://arxiv.org/abs/2506.05176
15. Qwen3-Embedding-8B model card: https://huggingface.co/Qwen/Qwen3-Embedding-8B
16. EmbeddingGemma paper: https://arxiv.org/abs/2509.20354
17. EmbeddingGemma model card: https://huggingface.co/google/embeddinggemma-300m
18. Hugging Face, Embedding Quantization: https://huggingface.co/blog/embedding-quantization
19. MMTEB: https://arxiv.org/abs/2502.13595

### Attention and architecture
20. Attention Is All You Need: https://arxiv.org/abs/1706.03762
21. GQA: https://arxiv.org/abs/2305.13245
22. RoFormer (RoPE): https://arxiv.org/abs/2104.09864
23. FlashAttention: https://arxiv.org/abs/2205.14135
24. DeepSeek-V2 (MLA): https://arxiv.org/abs/2405.04434
25. Mixtral of Experts: https://arxiv.org/abs/2401.04088

### Sampling and decoding
26. Holtzman et al., The Curious Case of Neural Text Degeneration: https://arxiv.org/abs/1904.09751
27. Nguyen et al., min-p sampling: https://arxiv.org/abs/2407.01082
28. vLLM SamplingParams: https://docs.vllm.ai/en/latest/api/vllm/sampling_params.html
29. vLLM structured outputs: https://docs.vllm.ai/en/latest/features/structured_outputs.html
30. Thinking Machines, Defeating Nondeterminism in LLM Inference: https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/
31. XGrammar: https://arxiv.org/abs/2411.15100
32. JSONSchemaBench: https://arxiv.org/abs/2501.10868
33. Anthropic structured outputs: https://platform.claude.com/docs/en/build-with-claude/structured-outputs

### Training and post-training
34. InstructGPT: https://arxiv.org/abs/2203.02155
35. DPO: https://arxiv.org/abs/2305.18290
36. DeepSeekMath (GRPO): https://arxiv.org/abs/2402.03300
37. Tulu 3 (RLVR): https://arxiv.org/abs/2411.15124
38. DeepSeek-R1 paper: https://arxiv.org/abs/2501.12948
39. DeepSeek-R1 repository: https://github.com/deepseek-ai/DeepSeek-R1
40. DAPO: https://arxiv.org/abs/2503.14476
41. Understanding R1-Zero-Like Training (Dr. GRPO): https://arxiv.org/abs/2503.20783
42. Yue et al., Does RL Really Incentivize Reasoning Capacity: https://arxiv.org/abs/2504.13837
43. Snell et al., Scaling LLM Test-Time Compute Optimally: https://arxiv.org/abs/2408.03314
44. s1: Simple test-time scaling: https://arxiv.org/abs/2501.19393
45. Anthropic, Reasoning models don't always say what they think: https://www.anthropic.com/research/reasoning-models-dont-say-think
46. LoRA: https://arxiv.org/abs/2106.09685
47. QLoRA: https://arxiv.org/abs/2305.14314
48. Thinking Machines, LoRA Without Regret: https://thinkingmachines.ai/blog/lora/
49. ZeRO: https://arxiv.org/abs/1910.02054
50. Chinchilla (Training Compute-Optimal LLMs): https://arxiv.org/abs/2203.15556
51. Hinton, Vinyals, Dean, Distilling the Knowledge in a Neural Network: https://arxiv.org/abs/1503.02531

### Open-weight models and configs
52. Llama 3.1 8B config (unsloth mirror of the Meta release): https://huggingface.co/unsloth/Meta-Llama-3.1-8B-Instruct/blob/main/config.json
53. Llama 3.1 70B config: https://huggingface.co/unsloth/Meta-Llama-3.1-70B-Instruct/blob/main/config.json
54. Meta, The Llama 4 herd: https://ai.meta.com/blog/llama-4-multimodal-intelligence/
55. Llama 4 Scout config: https://huggingface.co/unsloth/Llama-4-Scout-17B-16E-Instruct/blob/main/config.json
56. Llama 4 Maverick config: https://huggingface.co/unsloth/Llama-4-Maverick-17B-128E-Instruct/blob/main/config.json
57. Qwen3 announcement: https://qwenlm.github.io/blog/qwen3/
58. Qwen3-8B config: https://huggingface.co/Qwen/Qwen3-8B/blob/main/config.json
59. Qwen3-30B-A3B config: https://huggingface.co/Qwen/Qwen3-30B-A3B/blob/main/config.json
60. Qwen3-235B-A22B config: https://huggingface.co/Qwen/Qwen3-235B-A22B/blob/main/config.json
61. Qwen3.8-27B model card and config: https://huggingface.co/Qwen/Qwen3.8-27B
62. Qwen3.8-2.4T-A95B config: https://huggingface.co/Qwen/Qwen3.8-2.4T-A95B/blob/main/config.json
63. Gemma 3 Technical Report: https://arxiv.org/abs/2503.19786
64. Gemma 3 27B config: https://huggingface.co/unsloth/gemma-3-27b-it/blob/main/config.json
65. Gemma 3 1B config: https://huggingface.co/unsloth/gemma-3-1b-it/blob/main/config.json
66. Gemma 2 9B config: https://huggingface.co/unsloth/gemma-2-9b-it/blob/main/config.json
67. Gemma 4 docs: https://ai.google.dev/gemma/docs/core
68. Gemma 4 31B config: https://huggingface.co/google/gemma-4-31B-it/blob/main/config.json
69. Gemma 4 26B A4B config: https://huggingface.co/google/gemma-4-26B-A4B-it/blob/main/config.json
70. Mistral Small 3.1 config: https://huggingface.co/unsloth/Mistral-Small-3.1-24B-Instruct-2503/blob/main/config.json
71. Mistral models overview: https://docs.mistral.ai/getting-started/models/models_overview/
72. DeepSeek-V3 Technical Report: https://arxiv.org/abs/2412.19437
73. DeepSeek-V3 config: https://huggingface.co/deepseek-ai/DeepSeek-V3/blob/main/config.json
74. DeepSeek-R1 config: https://huggingface.co/deepseek-ai/DeepSeek-R1/blob/main/config.json
75. DeepSeek API change log: https://api-docs.deepseek.com/updates
76. DeepSeek-V4-Pro-0813 model card and config: https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro-0813
77. gpt-oss-120b model card and config: https://huggingface.co/openai/gpt-oss-120b
78. gpt-oss-20b model card: https://huggingface.co/openai/gpt-oss-20b
79. gpt-oss model card paper: https://arxiv.org/abs/2508.10925
80. Kimi K2 model card: https://huggingface.co/moonshotai/Kimi-K2-Instruct
81. Hugging Face models API, newest repos per organisation (used for release listings): https://huggingface.co/api/models?author=meta-llama&sort=createdAt&direction=-1

### Hosted model docs and prices
82. Anthropic models overview: https://platform.claude.com/docs/en/about-claude/models/overview
83. Anthropic pricing: https://platform.claude.com/docs/en/about-claude/pricing
84. Anthropic thinking: https://platform.claude.com/docs/en/build-with-claude/thinking
85. OpenAI models: https://developers.openai.com/api/docs/models
86. OpenAI latest model guide: https://developers.openai.com/api/docs/guides/latest-model
87. OpenAI reasoning guide: https://developers.openai.com/api/docs/guides/reasoning
88. OpenAI GPT-5 model page: https://developers.openai.com/api/docs/models/gpt-5
89. Gemini models: https://ai.google.dev/gemini-api/docs/models
90. Gemini thinking: https://ai.google.dev/gemini-api/docs/generate-content/thinking
91. Gemini pricing: https://ai.google.dev/gemini-api/docs/pricing

### Long context and benchmarks
92. Lost in the Middle: https://arxiv.org/abs/2307.03172
93. RULER: https://arxiv.org/abs/2404.06654
94. NoLiMa: https://arxiv.org/abs/2502.05167
95. Chroma, Context Rot: https://www.trychroma.com/research/context-rot
96. The Leaderboard Illusion: https://arxiv.org/abs/2504.20879

### Interview question sources
97. amitshekhariitbhu, AI Engineering Interview Questions (Apache-2.0): https://github.com/amitshekhariitbhu/ai-engineering-interview-questions
98. aced.io (Exponent), AI Engineer Interview Questions: https://www.aced.io/blog/ai-engineer-interview-questions
99. llmgenai, LLMInterviewQuestions (no licence stated): https://github.com/llmgenai/LLMInterviewQuestions
100. techinterview.org, What LLM interviewers actually ask about transformers (updated 2026-07-23): https://www.techinterview.org/post/3233476821/what-llm-interviewers-ask-about-transformers/
101. techinterview.org, ML engineer interview in the post-LLM era (context only, no question used): https://www.techinterview.org/post/3233474925/ml-engineer-interview-post-llm-era/
102. Let's Data Science, 50 LLM and AI Engineer Interview Questions for 2026: https://letsdatascience.com/blog/50-llm-and-ai-engineer-interview-questions-for-2026
103. PracHub, Implement and analyze custom attention (Anthropic): https://prachub.com/interview-questions/implement-and-analyze-custom-attention
104. PracHub, Debug a GRPO training loop and explain ratios (Anthropic): https://prachub.com/interview-questions/debug-a-grpo-training-loop-and-explain-ratios
105. PracHub, Explain Top-k and Top-p Decoding (Cohere): https://prachub.com/interview-questions/explain-top-k-and-top-p-decoding
106. PracHub, Implement Top-p (Nucleus) Sampling in NumPy (Amazon): https://prachub.com/coding-questions/implement-top-p-nucleus-sampling-in-numpy
107. PracHub, Implement a Byte Pair Encoding (BPE) Tokenizer (Glean): https://prachub.com/interview-questions/implement-a-byte-pair-encoding-bpe-tokenizer
108. PracHub, Implement Multi-Head Attention from Scratch in NumPy (Amazon): https://prachub.com/coding-questions/implement-multi-head-attention-from-scratch-in-numpy
109. PracHub, Anthropic machine-learning question list: https://prachub.com/companies/anthropic/categories/machine-learning
110. tianpan.co forum thread on OpenAI questions (judged unreliable, not used): https://tianpan.co/forum/t/collecting-openai-interview-questions-2025-edition-share-your-experience/38
