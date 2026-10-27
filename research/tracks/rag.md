# Track research: Retrieval and RAG (slug `rag`)

Checked: 2026-10-28. Every fact below carries the URL it came from, and every URL in this file was checked on 2026-10-28 unless a line says otherwise. Where a number could not be traced to a primary source, the entry says so.

Modules (fixed slugs): `retrieval-foundations`, `ingestion`, `hybrid-search`, `advanced-rag`, `debugging-rag`.

Inputs read: `SPEC.md` (sections 4 to 7), `research/brief.json` (curriculum entry "3. Retrieval and RAG", `interview_question_taxonomy`, `all_sources`), `research/raw-research.json`.

Note on brief.json order: the curriculum array lists this track third ("3. Retrieval and RAG") while SPEC section 4 puts it fourth. The modules map one to one onto the SPEC slugs in order: Retrieval Foundations = `retrieval-foundations`, Ingestion and Chunking = `ingestion`, Hybrid Search, Reranking and Query Transformation = `hybrid-search`, Advanced RAG Patterns = `advanced-rag`, Debugging a Broken RAG System = `debugging-rag`.

Note on brief.json numbers: the "35.9%" (RAG) and "10.8%" (vector DBs) share-of-JD figures in the brief have no URL attached. Do not use them in lessons unless a source is found.

---

## 1. Verified facts by module

### 1.1 retrieval-foundations

**BM25 and lexical search**

| Fact | Value | Source |
|---|---|---|
| Lucene `BM25Similarity()` defaults | k1 = 1.2, b = 0.75 | https://lucene.apache.org/core/9_0_0/core/org/apache/lucene/search/similarities/BM25Similarity.html |
| Lucene IDF | `log(1 + (docCount - docFreq + 0.5)/(docFreq + 0.5))`; the `1 +` keeps IDF positive for very common terms | same |
| Postgres `ts_rank` and `ts_rank_cd` are not BM25 | Postgres 18 docs: "the ranking functions do not use any global information" (no corpus IDF). `ts_rank` uses term frequency and label weights (default `{0.1, 0.2, 0.4, 1.0}`); `ts_rank_cd` adds proximity (cover density) | https://www.postgresql.org/docs/current/textsearch-controls.html |
| BM25 as a baseline | BEIR (18 datasets, 10 systems, NeurIPS 2021 Datasets and Benchmarks): "BM25 is a robust baseline"; reranking and late-interaction models are best on average zero-shot, at high compute cost | https://arxiv.org/abs/2104.08663 |
| Single-vector limits (2025, ICLR 2026) | Weller et al. (Google DeepMind): the top-k subsets a set of queries can return are bounded by embedding dimension. On the full LIMIT dataset, recall@100: BM25 93.6, GTE-ModernColBERT (multi-vector) 54.8, best single-vector (Promptriever Llama3 8B, 4096 dims) 18.9. LIMIT is a synthetic stress test, not a typical corpus. | https://arxiv.org/abs/2508.21038 ; table values from https://arxiv.org/html/2508.21038v2 |

**Bi-encoders and cross-encoders**

| Fact | Value | Source |
|---|---|---|
| Cost of cross-encoding every pair | Sentence-BERT (EMNLP 2019): finding the most similar pair in 10,000 sentences with BERT needs about 50 million inference computations, about 65 hours; SBERT about 5 seconds | https://arxiv.org/abs/1908.10084 |
| Retrieve then rerank | Lexical or bi-encoder retrieval returns candidates ("e.g. 100 possible hits"), then a cross-encoder scores each query-document pair. A cross-encoder outputs one score per pair, not a reusable vector. | https://www.sbert.net/examples/sentence_transformer/applications/retrieve_rerank/README.html |

**Embedding models (inputs for estimate problems)**

| Model | Default dims | Max input | Price per 1M tokens | Source |
|---|---|---|---|---|
| OpenAI text-embedding-3-small | 1536 | 8192 tokens | $0.02 | https://developers.openai.com/api/docs/guides/embeddings ; https://developers.openai.com/api/docs/pricing |
| OpenAI text-embedding-3-large | 3072 | 8192 tokens | $0.13 | same |
| OpenAI text-embedding-ada-002 | 1536 | 8192 tokens | $0.10 | same |
| Cohere embed-v4.0 | 1536 default; 256, 512, 1024 or 1536 | 128k context | not stated on the docs page | https://docs.cohere.com/docs/models |

Also from the OpenAI guide: MTEB 62.3% (3-small), 64.6% (3-large), 61.0% (ada-002). OpenAI embeddings are "normalized to length 1", so dot product equals cosine, and cosine and Euclidean give the same ranking. The `dimensions` parameter shortens v3 embeddings; a vector truncated by hand must be renormalized. The guide's pages-per-dollar figures assume about 800 tokens per page.

**ANN indexes**

| Fact | Value | Source |
|---|---|---|
| HNSW paper | Malkov and Yashunin, arXiv 1603.09320 (v4, 2018). Multi-layer proximity graphs; each element's top layer is drawn from an exponentially decaying distribution; "logarithmic complexity scaling" | https://arxiv.org/abs/1603.09320 |
| Faiss paper | Douze et al., "The Faiss library", v4 dated 2025-10-23; indexing, compression (PQ), clustering and their trade-offs | https://arxiv.org/abs/2401.08281 |
| Product quantization in Qdrant | up to 64x compression, slower than scalar quantization | https://qdrant.tech/documentation/guides/quantization/ |

**pgvector (current release 0.8.7, dated 2026-10-01)**

| Setting | Value | Source |
|---|---|---|
| HNSW `m` | 16 by default (max connections per layer) | https://github.com/pgvector/pgvector |
| HNSW `ef_construction` | 64 by default | same |
| `hnsw.ef_search` | 40 by default | same |
| IVFFlat `lists` | no default; start with rows/1000 up to 1M rows, sqrt(rows) above 1M | same |
| `ivfflat.probes` | 1 by default; start with sqrt(lists) | same |
| `hnsw.max_scan_tuples` (iterative scans) | 20,000 by default | same |
| Iterative scan modes | `hnsw.iterative_scan`: `strict_order` or `relaxed_order`; `ivfflat.iterative_scan`: `relaxed_order` | same |
| Indexable dimensions | `vector` 2,000; `halfvec` 4,000; `bit` 64,000; `sparsevec` 1,000 non-zero elements | same |
| Stored dimensions | `vector` and `halfvec` up to 16,000 | same |
| Operators | `<->` L2, `<#>` negative inner product, `<=>` cosine distance, `<+>` L1, `<~>` Hamming, `<%>` Jaccard | same |
| Exact by default | "By default, pgvector performs exact nearest neighbor search, which provides perfect recall." | same |
| HNSW vs IVFFlat | HNSW: better speed-recall trade-off, slower builds, more memory. IVFFlat: faster builds, less memory, lower query performance. HNSW builds much faster when the graph fits in `maintenance_work_mem`. | same |
| Filtering after the scan | "If a condition matches 10% of rows, with HNSW and the default hnsw.ef_search of 40, only 4 rows will match on average." | same |
| Binary quantization index | `CREATE INDEX ON items USING hnsw ((binary_quantize(embedding)::bit(3)) bit_hamming_ops);` | same |
| Hybrid search | Postgres full-text search plus pgvector, merged with Reciprocal Rank Fusion or a cross-encoder | same |
| Version history | 0.7.0 (2024-04-29): halfvec, sparsevec, bit indexing, `binary_quantize`. 0.8.0 (2024-10-30): iterative index scans, better cost estimates for filtered queries. 0.8.1 (2025-09-04): Postgres 18 support, faster `binary_quantize`. 0.8.3 (2026-06-17): fixes possible HNSW index corruption during vacuuming. 0.8.7 (2026-10-01). 0.9.0 unreleased. | https://github.com/pgvector/pgvector/blob/master/CHANGELOG.md |

Consequence worth computing in a lesson: text-embedding-3-large (3072 dims) exceeds the 2,000-dimension `vector` index limit, so in pgvector it needs `halfvec` (up to 4,000) or the `dimensions` parameter before it can be HNSW-indexed.

**Retrieval metrics**

| Fact | Value | Source |
|---|---|---|
| nDCG | scikit-learn `ndcg_score` (docs v1.9.1): sum of true relevance in predicted order with a logarithmic discount, divided by ideal DCG, range 0 to 1; `k=None` uses all outputs. Docs example `true=[10,0,0,1,5]`, `scores=[.1,.2,.3,4,70]` prints 0.69 (exact value 0.6957, recomputed in section 5). | https://scikit-learn.org/stable/modules/generated/sklearn.metrics.ndcg_score.html |
| MRR, P@k, R@k, DCG, ERR | Elasticsearch rank evaluation API supports all five. MRR: mean over queries of 1/rank of the first relevant document. DCG has a `normalize` flag for nDCG. API defaults: k = 10, `relevant_rating_threshold` = 1. | https://www.elastic.co/docs/reference/elasticsearch/rest-apis/search-rank-eval ; https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-rank-eval |
| Retrieval failure rate used by Anthropic | 1 minus recall@20 | https://www.anthropic.com/news/contextual-retrieval |

Not sourced here: the original MRR definition (the TREC-8 QA report PDF is image-only and could not be read) and the original nDCG paper (Järvelin and Kekäläinen 2002, not fetched). Cite the Elastic and scikit-learn pages instead.

### 1.2 ingestion

| Fact | Value | Source |
|---|---|---|
| OpenAI vector store auto chunking | `max_chunk_size_tokens` 800, `chunk_overlap_tokens` 400 | https://developers.openai.com/api/reference/resources/vector_stores/subresources/files/methods/create |
| OpenAI static chunking limits | chunk size min 100, max 4096; "the overlap must not exceed half of `max_chunk_size_tokens`" | same |
| OpenAI file search pricing | $2.50 per 1k tool calls (Responses API); vector storage $0.10 per GB per day, first 1 GB free | https://developers.openai.com/api/docs/pricing |
| LangChain `TextSplitter` defaults | `chunk_size=4000`, `chunk_overlap=200`, `length_function=len` (characters, not tokens), base `keep_separator=False` | https://raw.githubusercontent.com/langchain-ai/langchain/master/libs/text-splitters/langchain_text_splitters/base.py |
| `RecursiveCharacterTextSplitter` | default separators `["\n\n", "\n", " ", ""]`; its own `keep_separator` default is `True` | https://raw.githubusercontent.com/langchain-ai/langchain/master/libs/text-splitters/langchain_text_splitters/character.py ; https://reference.langchain.com/python/langchain-text-splitters/character/RecursiveCharacterTextSplitter |
| Chroma chunking evaluation (2024-07-03) | Token-level recall, precision and IoU; text-embedding-3-large, 5 retrieved chunks. Recursive 200 tokens, no overlap: recall 88.1, IoU 6.9. Recursive 400, no overlap: recall 89.5, IoU 3.6. Recursive 400 with 200 overlap: recall 88.1, IoU 3.3. OpenAI-style 800/400 (TokenTextSplitter): recall 87.9, IoU 1.4, lowest on precision and IoU. LLM chunker: highest recall, 91.9. ClusterSemanticChunker at 200: best IoU, 8.0. One benchmark, one embedding model. | https://www.trychroma.com/research/evaluating-chunking |
| Contextual Retrieval (Anthropic, 2024-09-19) | Claude writes 50 to 100 tokens of chunk-specific context, prepended before embedding and BM25 indexing. Top-20 failure rate: 5.7% baseline; contextual embeddings 3.7% (35% fewer failures); plus contextual BM25 2.9% (49%); plus reranking 1.9% (67%). One-time cost $1.02 per million document tokens with prompt caching (estimate assumes 800-token chunks). Below about 200,000 tokens (about 500 pages), put the whole knowledge base in the prompt instead. Top-K tried: 5, 10, 20; 20 worked best. Reranker: Cohere. Gemini and Voyage embeddings were best of those tested. | https://www.anthropic.com/news/contextual-retrieval |
| Late chunking | Günther et al. (Jina): run a long-context embedding model over the whole text, then mean-pool token embeddings per chunk after the transformer; "works without additional training"; v3 dated 2025-07-07 | https://arxiv.org/abs/2409.04701 |
| Visually rich documents | ColPali (ICLR 2025, v6 dated 2025-02-28): embed page images with a vision language model, multi-vector late interaction, ViDoRe benchmark; claims it outperforms text-extraction pipelines | https://arxiv.org/abs/2407.01449 |

No primary source was found for any "best chunk size" rule. Lessons should treat chunk size as something measured on the reader's own eval set, with Chroma's report as one data point.

### 1.3 hybrid-search

| Fact | Value | Source |
|---|---|---|
| RRF formula and k | RRFscore(d) = sum over rankings r of 1 / (k + r(d)); "k = 60 was fixed during a pilot investigation"; the pilot showed k = 60 "was near-optimal, but that the choice was not critical" | Cormack, Clarke, Büttcher, SIGIR 2009: http://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf (text extracted from the PDF) |
| Elasticsearch RRF retriever | `rank_constant` default 60 (min 1); `rank_window_size` default 10 and at least `size`; per-retriever weights GA since 9.2 (default 1.0); multi-field `query` and `fields` GA since 9.1 | https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/rrf-retriever |
| Qdrant fusion | `rrf` and `dbsf`. RRF k "set to 2 by default", configurable from v1.16.0; weighted RRF from v1.17.0; DBSF (mean and 3-sigma normalization) from v1.11.0; prefetch multi-stage queries from v1.10.0, for example 100 dense candidates rescored by a ColBERT multivector down to 10 | https://qdrant.tech/documentation/concepts/hybrid-queries/ |
| Weaviate hybrid | `alpha` 1 = pure vector, 0 = pure keyword. Relative Score Fusion is the default since v1.24; Ranked Fusion is the rank-based alternative. The search page states no numeric alpha default. | https://docs.weaviate.io/weaviate/search/hybrid |
| ColBERT | Khattab and Zaharia, SIGIR 2020: query and document encoded separately, then compared token by token (late interaction); "two orders-of-magnitude faster" and "four orders-of-magnitude fewer FLOPs per query" than BERT-based rankers | https://arxiv.org/abs/2004.12832 |
| ColBERTv2 | residual compression reduces late-interaction storage "6--10×" (NAACL 2022) | https://arxiv.org/abs/2112.01488 |
| Cohere Rerank models | rerank-v5.0-pro and rerank-v5.0-fast: 32k context, Context Focus, calibrated scores. rerank-v4.0-pro and rerank-v4.0-fast: 32k. rerank-v3.5: 4k. Query plus document tokens count toward the per-document limit; longer documents are chunked into multiple inferences. | https://docs.cohere.com/docs/models |
| Rerank 4 launch date | Cohere changelog has the entry "Cohere's Rerank v4.0 Model is Here!" without a date on the page. A third-party release-note aggregator dates it 2025-12-11. Not confirmed from a dated Cohere page. | https://docs.cohere.com/changelog ; https://releasebot.io/updates/cohere |
| Rerank 5 (2026-10-21) | Pro and Fast. Context Focus returns scored text spans. Vendor claims: removing half the retrieved text kept 96% of answer quality, removing three-quarters kept 87%; `relevance_score` calibrated, with a "more likely useful than not" threshold of 0.50 (Pro) and 0.45 (Fast); expected calibration error about 0.06; BRIGHT 82.2 for Pro. Price $0.05 per 1M tokens (Pro), $0.02 per 1M tokens (Fast). | https://cohere.com/blog/rerank-5 |
| Cohere search unit | "one query with up to 100 documents to be ranked"; documents over 500 tokens including the query are split and each chunk counts as a document | https://cohere.com/pricing |
| HyDE | Gao, Ma, Lin, Callan (arXiv 2212.10496, 2022): an instruction-following LLM writes a hypothetical document, an unsupervised contrastive encoder (Contriever) embeds it, and real documents near that vector are retrieved | https://arxiv.org/abs/2212.10496 |
| Citations over retrieved text (Claude) | `search_result` content blocks carry source and title; beta 2025-07-03, out of beta on the Claude API and Vertex AI 2025-08-08, on Amazon Bedrock 2025-11-21; supported on all active models except Claude Haiku 3 | https://platform.claude.com/docs/en/build-with-claude/search-results ; https://platform.claude.com/docs/en/release-notes/api.md |

No source was found for a per-candidate cross-encoder latency. Reranker latency in problems must be a scenario input, not stated as fact.

### 1.4 advanced-rag

| Fact | Value | Source |
|---|---|---|
| GraphRAG | Edge et al. (Microsoft), v2 dated 2025-02-19: an LLM builds an entity knowledge graph, then pregenerates community summaries; targets global sensemaking questions ("What are the main themes in the dataset?") over corpora around 1 million tokens; improves comprehensiveness and diversity over a vector RAG baseline | https://arxiv.org/abs/2404.16130 |
| GraphRAG query modes | Global, Local, DRIFT, Basic (top-k vector) | https://microsoft.github.io/graphrag/ |
| GraphRAG cost warning | "GraphRAG indexing can be an expensive operation, please read all of the documentation" | https://github.com/microsoft/graphrag |
| LazyGraphRAG (2024-11-25) | Indexing with NLP noun-phrase extraction, "identical to vector RAG and 0.1% of the costs of full GraphRAG"; LLM use deferred to query time; global-query quality comparable to GraphRAG Global Search at "more than 700 times lower query cost". Vendor-reported. | https://www.microsoft.com/en-us/research/blog/lazygraphrag-setting-a-new-standard-for-quality-and-cost/ |
| LightRAG | Guo et al., v3 dated 2025-04-28: graph plus vectors, dual-level (low and high) retrieval, incremental update algorithm; self-reported gains | https://arxiv.org/abs/2410.05779 |
| Agentic RAG survey | Singh et al., v1 2025-01-15, v4 2026-04-01: agents inside the RAG pipeline using reflection, planning, tool use and multi-agent collaboration; taxonomy by agent cardinality, control structure, autonomy, knowledge representation | https://arxiv.org/abs/2501.09136 |
| Agentic RAG in LangGraph | Official tutorial graph: `generate_query_or_respond`, `retrieve` (ToolNode), `grade_documents` (binary relevance via structured output), `rewrite_question`, `generate_answer`. A "no" from the grader routes to a rewrite and another retrieval. | https://docs.langchain.com/oss/python/langgraph/agentic-rag |
| Self-RAG | Asai et al. (2023): the model retrieves on demand and emits reflection tokens to critique passages and its own output | https://arxiv.org/abs/2310.11511 |
| CRAG | Yan et al. (2024): a lightweight retrieval evaluator returns a confidence that triggers different actions, web search as fallback, decompose-then-recompose filtering | https://arxiv.org/abs/2401.15884 |
| Long context vs RAG (1) | Li et al. (submitted 2024-12-27): LC generally beats RAG on QA, especially Wikipedia-based; summarization-based retrieval is comparable to LC; chunk-based retrieval lags; RAG is better for dialogue-based and general queries | https://arxiv.org/abs/2501.01880 |
| Long context vs RAG (2) | LaRA (2025-02-14, v2 2025-03-05): 2,326 test cases, 7 open and 4 proprietary LLMs; "the optimal choice between RAG and LC depends on a complex interplay of factors" | https://arxiv.org/abs/2502.09977 |
| Context Rot (Chroma, 2025-07-14) | 18 LLMs; "across all experiments, model performance consistently degrades with increasing input length"; LongMemEval focused prompts (about 300 tokens) scored well above full prompts (about 113k tokens); one distractor already hurts; needle position showed no notable effect in their setup; shuffled haystacks scored better than coherent ones | https://www.trychroma.com/research/context-rot |
| Lost in the Middle | Liu et al. (TACL): U-shaped accuracy by position of the relevant passage, on multi-document QA and key-value retrieval, tested on 2023 models | https://arxiv.org/abs/2307.03172 |
| Claude long-context guidance | Put long documents near the top and the query at the end: "Queries at the end can improve response quality by up to 30 percent in tests" (vendor claim) | https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices |
| Multimodal retrieval | ColPali (section 1.2); Cohere embed-v4.0 accepts text, images, and mixed text and images such as PDFs | https://arxiv.org/abs/2407.01449 ; https://docs.cohere.com/docs/models |

### 1.5 debugging-rag

| Fact | Value | Source |
|---|---|---|
| Seven failure points (Barnett et al., 2024) | FP1 Missing Content; FP2 Missed the Top Ranked Documents; FP3 Not in Context (consolidation strategy limitations); FP4 Not Extracted; FP5 Wrong Format; FP6 Incorrect Specificity; FP7 Incomplete. Three case studies: research, education, biomedical. | https://arxiv.org/html/2401.05856v1 |
| Ragas faithfulness | claims in the response supported by the retrieved context, divided by total claims; 0 to 1; worked example 1/2 = 0.5. `FaithfulnesswithHHEM` replaces the LLM verifier with Vectara's HHEM-2.1-Open (T5 classifier). The legacy metrics API "will be deprecated in version 0.4 and removed in 1.0". Page dated 2025-12-09. | https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/faithfulness/ |
| RAGAS paper | reference-free RAG metrics (faithfulness, answer relevance, context relevance) | https://arxiv.org/abs/2309.15217 |
| Separating retrieval from generation | Anthropic measures retrieval alone as 1 minus recall@20 before any generation step | https://www.anthropic.com/news/contextual-retrieval |

---

## 2. Latest developments interviews ask about (2025 and 2026 sources)

Where the method itself is older, a 2025 or 2026 primary source for its current state is listed with it. Two items have no 2025 or 2026 primary source and are flagged.

| Topic | What to teach | Primary source (date) |
|---|---|---|
| Hybrid search with RRF | RRF fuses ranks, not scores. Engine defaults differ: Elasticsearch k = 60 with a window of 10; Qdrant k = 2. Weighted RRF shipped in Elasticsearch 9.2 and Qdrant 1.17. | https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/rrf-retriever (current, 9.2) ; https://qdrant.tech/documentation/concepts/hybrid-queries/ (v1.16, v1.17); method from SIGIR 2009 |
| BM25 vs dense | Lexical retrieval wins on rare identifiers and exact strings; single-vector embeddings have a dimension-bounded limit on which top-k sets they can return | https://arxiv.org/abs/2508.21038 (2025-08-28, v2 2026-03-12, ICLR 2026) |
| Rerankers: cross-encoders | Score each pair jointly; no precomputation; latency grows with candidate count | https://www.sbert.net/examples/sentence_transformer/applications/retrieve_rerank/README.html (current) |
| Rerankers: Cohere Rerank | v3.5 4k context; v4 32k (aggregator date 2025-12-11); v5 (2026-10-21) adds Context Focus spans and calibrated scores, priced per token | https://docs.cohere.com/docs/models ; https://cohere.com/blog/rerank-5 |
| ColBERT late interaction | Per-token vectors with MaxSim scoring; used as a rescoring stage in Qdrant prefetch pipelines; ColPali applies it to page images | https://arxiv.org/abs/2407.01449 (ICLR 2025, v6 2025-02-28) ; Qdrant hybrid queries docs; ColBERT 2020 |
| Late chunking | Embed the whole document, pool per chunk afterwards; needs a long-context embedding model with token-level outputs | https://arxiv.org/abs/2409.04701 (v3 2025-07-07) |
| Contextual retrieval | LLM-written chunk context before embedding and BM25; prompt caching keeps the one-time cost low | https://www.anthropic.com/news/contextual-retrieval (2024-09-19). No 2025 or 2026 Anthropic update found; lessons must show the date. |
| GraphRAG and LightRAG | Graph index for global and multi-hop questions; LLM-heavy indexing; LazyGraphRAG moves LLM cost to query time | https://arxiv.org/abs/2404.16130 (v2 2025-02-19) ; https://arxiv.org/abs/2410.05779 (v3 2025-04-28) |
| Agentic RAG | Retrieval as a tool inside a loop, with a relevance grader and query rewrite | https://arxiv.org/abs/2501.09136 (2025-01-15, v4 2026-04-01) ; https://docs.langchain.com/oss/python/langgraph/agentic-rag (current) |
| Long context vs RAG | No universal winner; performance drops with length and distractors; put documents before the question | https://arxiv.org/abs/2502.09977 (2025-02-14) ; https://www.trychroma.com/research/context-rot (2025-07-14) |
| pgvector and HNSW parameters | `m` 16, `ef_construction` 64, `ef_search` 40; iterative scans for filtered queries; vacuum corruption fix in 0.8.3 | https://github.com/pgvector/pgvector/blob/master/CHANGELOG.md (0.8.1 2025-09-04 to 0.8.7 2026-10-01) |
| Quantized vectors | int8 4x, binary 32x, 1.5-bit about 21x and 2-bit 16x (Qdrant v1.15), asymmetric quantization (v1.15), TurboQuant (v1.18; `bits8` in v1.20). Oversampling plus float rescoring recovers recall; Qdrant suggests 3x oversampling as a start for binary. pgvector offers `halfvec` and `binary_quantize` expression indexes. | https://qdrant.tech/documentation/guides/quantization/ (current) ; pgvector README ; https://huggingface.co/blog/embedding-quantization (2024-03-22) |
| Retrieval evaluation | recall@k, precision@k, MRR, nDCG, ERR as exposed by production search APIs | Elastic rank evaluation docs (current) ; scikit-learn 1.9.1 `ndcg_score` |
| Generation evaluation | Claim-level faithfulness, verified by an LLM or by the HHEM classifier; judge noise | https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/faithfulness/ (2025-12-09) |
| Hosted RAG and native citations | OpenAI file search (800/400 chunking, $2.50 per 1k calls); Claude `search_result` blocks (GA 2025-08-08) | OpenAI API reference and pricing (current) ; Claude release notes |
| Chunking evidence | Overlap did not raise recall in Chroma's test; the 800/400 default scored lowest on IoU | https://www.trychroma.com/research/evaluating-chunking (2024-07-03). No 2025 or 2026 replication found. |

Quantization figures by source. Hugging Face (mxbai-embed-large-v1, 2024): binary keeps 92.53% of MTEB retrieval performance without rescoring and 96.45% with rescoring; int8 about 97% without rescoring; CPU exact-search mean speedups 3.66x (int8) and 24.76x (binary); 250M 1024-dim embeddings shrink from 953.67 GB to 29.80 GB. Qdrant (binary, 3x oversampling plus rescoring): 0.9966 (3-large, 3072d), 0.9826 (3-large at 1536d), 0.9847 (3-small); its 2024 sweep on 100 queries and 100K vectors says the ranges are "indicative, not as confidence intervals". Both sets are model-specific.

---

## 3. Interview questions collected (39)

Types follow SPEC section 6. "Company" is filled only where the source names one, with the strength of that attribution. Difficulty is my assignment, not the source's.

| # | Question (source wording, trimmed where long) | Type | Diff. | Module | Source | Company named by source |
|---|---|---|---|---|---|---|
| 1 | "Explain how RAG works." | concept | easy | retrieval-foundations | https://www.aced.io/blog/ai-engineer-interview-questions | Sierra (aggregator list, no candidate report linked) |
| 2 | "You have a 200-page PDF and a question. What happens between enter and the answer?" | concept | easy | ingestion | https://www.techinterview.org/post/3233476824/ai-engineer-interview-rag-agents-evals/ (2026-07-23) | none |
| 3 | "What's your k, and what breaks when you raise it?" | concept | medium | hybrid-search | same | none |
| 4 | "Here are 50 markdown docs. Build a Q&A system, an eval set of 20 questions, and report recall@5 and faithfulness." | code (take-home) | hard | debugging-rag | same | none (the article names Anthropic only as a process reference, not for this prompt) |
| 5 | "Design a system that answers employee questions from our internal wiki." | design | medium | debugging-rag | https://www.techinterview.org/post/3233476088/rag-system-design-interview/ (updated 2026-07-02) | none |
| 6 | "The corpus is 50 million chunks. Does your index still fit in memory, and what happens when it doesn't?" | estimate | medium | retrieval-foundations | same | none |
| 7 | "A user asks something whose answer spans three documents. What does your retriever return?" | concept | medium | advanced-rag | same | none |
| 8 | "The model just cited a policy we deleted last week. Why did that happen, and how do you stop it?" | debug | medium | ingestion | same | none |
| 9 | Design search over a company's documents; "Where do you enforce access control?" | design | hard | ingestion | https://www.techinterview.org/post/3233476794/glean-engineering-interview/ (updated 2026-07-20) | Glean (third-party guide; basis not stated) |
| 10 | "Design a RAG system for a customer support chatbot" with "5 million documents, 300 QPS, p95 latency under 1.2 seconds, budget under $0.002 per query." | estimate | hard | hybrid-search | https://datadriven.io/blog/data-engineer-interviews-are-60-ai-now-2026 (2026-03-03) | none |
| 11 | "Your RAG system returns correct documents but the LLM still hallucinates. Diagnose and fix." Same question in another source: "Your RAG system is hallucinating despite having the right context. How do you fix it?" | debug | medium | debugging-rag | same ; https://github.com/amitshekhariitbhu/ai-engineering-interview-questions | none |
| 12 | Vector DB coding round: "implement HNSW nearest-neighbor search" | code | hard | retrieval-foundations | https://datadriven.io/blog/data-engineer-interviews-are-60-ai-now-2026 | none |
| 13 | "Compare HNSW, IVF, and flat indexes. How do you pick one, and what does recall@k cost in latency?" Also "HNSW vs. IVF vs. LSH. Trade-offs on memory, latency, recall." | concept | medium | retrieval-foundations | https://github.com/amitshekhariitbhu/ai-engineering-interview-questions ; https://datadriven.io/blog/data-engineer-interviews-are-60-ai-now-2026 | none |
| 14 | "What is hybrid search, and why is it better than pure vector search?" | concept | easy | hybrid-search | https://github.com/amitshekhariitbhu/ai-engineering-interview-questions | none |
| 15 | "What is ColBERT, and how does late interaction retrieval work?" | concept | medium | hybrid-search | same | none |
| 16 | "Compare reranker architectures: cross-encoder, ColBERT, and LLM-based rerankers." | concept | medium | hybrid-search | same | none |
| 17 | "What is Contextual Retrieval, and how does it improve RAG?" | concept | medium | ingestion | same | none |
| 18 | "What is GraphRAG, and when would you use it over traditional RAG?" | concept | medium | advanced-rag | same | none |
| 19 | "Long context windows keep getting cheaper. When should you use retrieval (RAG) vs putting everything in the context window?" | concept | medium | advanced-rag | same | none |
| 20 | "Your RAG system needs per-user access control on internal documents. How do you implement it?" | design | hard | ingestion | same | none |
| 21 | "Your RAG system fails on domain-specific jargon. How do you fix it?" | debug | medium | hybrid-search | same | none |
| 22 | "Your RAG system struggles with PDF documents containing tables and layouts. How do you fix PDF parsing?" | debug | medium | ingestion | same | none |
| 23 | "What is quantization of embeddings, and how does it reduce storage costs?" | estimate | easy | retrieval-foundations | same | none |
| 24 | "How do you handle embedding drift when the embedding model is updated?" | concept | medium | ingestion | same | none |
| 25 | "If you have search results from multiple methods, how would you merge and homogenize the rankings into a single result set?" | code | medium | hybrid-search | https://github.com/llmgenai/LLMInterviewQuestions | none |
| 26 | "How to handle tables during chunking?" | concept | medium | ingestion | same | none |
| 27 | "Explain product quantization (PQ) indexing method?" | concept | hard | retrieval-foundations | same | none |
| 28 | "Explain different types and challenges associated with filtering in vector DB?" | debug | hard | retrieval-foundations | same | none |
| 29 | Quora-like Q&A system: which evaluation metric to use for finding pertinent answers quickly | mcq | easy | retrieval-foundations | same | none |
| 30 | Small dataset of customer reviews, perfect accuracy required, speed not a priority: which search strategy and why | mcq | easy | retrieval-foundations | same | none |
| 31 | "Design an insurance-claims agent that ingests claims and outputs an approval decision using RAG" | design | hard | advanced-rag | https://www.aced.io/blog/ai-engineer-interview-questions | Scale AI (aggregator) |
| 32 | "Design a document processing pipeline that ingests and indexes large volumes of heterogeneous documents for LLM use." | design | hard | ingestion | same | Databricks (aggregator) |
| 33 | "Design a Retrieval-Augmented Generation (RAG) system that enhances large language model responses" covering ingestion, indexing, retrieval and generation; variant "Design an ML-powered enterprise search system using Retrieval-Augmented Generation (RAG)" | design | hard | debugging-rag | https://www.hellointerview.com/community/questions/rag-system-design/cmoaemvhf1emv09adwqq9wk3f | Scale AI (Senior, late April 2026; Principal, late July 2026); Atlassian (Staff, mid July 2026). Community reports. |
| 34 | "Implement a low-level design for a Retrieval-Augmented Generation (RAG) pipeline that retrieves relevant documents" | code | medium | retrieval-foundations | https://www.hellointerview.com/community/questions/rag-pipeline-design/cms3ph2vm23in07adi4qja9op | Visa (Senior, late July 2026, community report) |
| 35 | Technical phone screen, practical Python: "building a retrieval scorer" | code | medium | retrieval-foundations | https://getperspective.ai/blog/anthropic-applied-ai-engineer-interview-process-frontier-lab-2026/markdown (2026-05-29) | Anthropic (vendor blog, unverified) |
| 36 | "What is late chunking and how is it different from traditional chunking methods?" | concept | medium | ingestion | https://www.datacamp.com/blog/rag-interview-questions (modified 2026-01-22) | none |
| 37 | "What is CAG, and how does it differ from traditional RAG? When would you prefer CAG over RAG in production?" | concept | medium | advanced-rag | same | none |
| 38 | "Compare vector databases: Pinecone vs Weaviate vs Chroma vs pgvector." | concept | medium | retrieval-foundations | https://careery.pro/blog/ai-careers/ai-engineer-interview-questions (2026-02-12) | none |
| 39 | "How do you evaluate RAG quality?" | concept | medium | debugging-rag | same | none |

Seen but not counted (duplicates or other tracks): "Describe a situation where you chose between RAG and fine-tuning" (behavioural, careery.pro; belongs to the rounds track) and "How do you evaluate a RAG system? Explain faithfulness, relevance, and context precision/recall" (amitshekhariitbhu; same as 39).

Attribution strength for the `companies` field (SPEC section 6): Hello Interview (33, 34) is the strongest, since each report names company, level and month. aced.io (1, 31, 32), techinterview.org (9) and getperspective.ai (35) are secondary write-ups. Under a strict rule, use only 33 and 34.

### 3.1 Recommended for the problem bank (15), 11 of them core

| Slot | From # | Module | Type | Diff. | Core | Problem shape |
|---|---|---|---|---|---|---|
| rag-001 | 29 | retrieval-foundations | mcq | easy | yes | A Q&A system where the first good answer is what matters: pick MRR over recall@k, precision@k or nDCG; each wrong choice explains when it would be right |
| rag-002 | 35, 34 | retrieval-foundations | code | medium | yes | Implement BM25 scoring (Lucene IDF) and top-k; tests include an identifier query that dense search tends to miss |
| rag-003 | 13 | retrieval-foundations | concept | medium | yes | HNSW vs IVFFlat vs flat; what `m`, `ef_construction` and `ef_search` trade; when exact search (pgvector's default) is right |
| rag-004 | 28 | retrieval-foundations | debug | hard | yes | A pgvector query with `WHERE tenant_id = ...` returns 3 rows for `LIMIT 10`; choices include raising `hnsw.ef_search`, iterative scans, a partial index or partition per tenant, and a tempting wrong one (rebuild with higher `m`) |
| rag-005 | 6, 23 | retrieval-foundations | estimate | medium | yes | 50M chunks at 1536 dims: float32 vs halfvec vs binary memory; band computed in front of the reader |
| rag-006 | 2, 26 | ingestion | concept | medium | no | Chunk a 200-page PDF with tables and headings: structure-aware chunking, parent-child retrieval, measured on an eval set |
| rag-007 | 8 | ingestion | debug | medium | yes | The model cites a deleted policy; the trace shows upsert-only ingestion with no tombstones; fix deletes and versioned ids |
| rag-008 | 20, 9 | ingestion | design | hard | no | Per-user access control: ACLs replicated into the index with pre-filtering vs live permission checks; recall loss from post-filtering |
| rag-009 | 25 | hybrid-search | code | medium | yes | Implement RRF with k and optional weights; tests check ranks start at 1 and the k-flip example in section 5 |
| rag-010 | 14, 21 | hybrid-search | mcq | easy | no | Which query fails on dense-only retrieval (an error code such as `E1234`, a SKU, a rare acronym) and why BM25 catches it |
| rag-011 | 10 | hybrid-search | estimate | hard | yes | 300 QPS, p95 1.2 s, $0.002 per query: how many candidates can be reranked; reranker latency and price are scenario inputs |
| rag-012 | 19, 37 | advanced-rag | concept | medium | yes | Long context vs RAG vs CAG, using LaRA, Li et al., Context Rot and Anthropic's 200k-token threshold |
| rag-013 | 18 | advanced-rag | concept | hard | no | When GraphRAG beats vector RAG (global sensemaking), what indexing costs, LazyGraphRAG as the cheaper variant |
| rag-014 | 11 | debugging-rag | debug | medium | yes | recall@5 is fine but answers are wrong: oracle context, truncation and ordering, per-claim faithfulness |
| rag-015 | 4 | debugging-rag | code | hard | yes | Mini take-home: 12 short docs and 8 labelled questions; compute recall@5 and a claim-support faithfulness score from provided claim labels (no LLM call inside Pyodide) |

Core: rag-001, 002, 003, 004, 005, 007, 009, 011, 012, 014, 015 (11).

Type coverage: mcq (001, 010), concept (003, 006, 012, 013), estimate (005, 011), debug (004, 007, 014), code (002, 009, 015), design (008). Behavioural stays in the rounds track. If the track needs up to 18, the next candidates are 7 (multi-hop retrieval, concept), 16 (reranker architectures, as an mcq) and 32 (heterogeneous ingestion pipeline, design, Databricks via aced.io).

---

## 4. Misconceptions and gotchas for reviewers

1. **"Postgres full-text search is BM25."** It is not. `ts_rank` and `ts_rank_cd` use no corpus-level statistics (Postgres 18 docs). A hybrid lesson built on pgvector plus `tsvector` must say the lexical side is not BM25. https://www.postgresql.org/docs/current/textsearch-controls.html
2. **"chunk_size=1000 means 1,000 tokens."** LangChain's `TextSplitter` defaults to `length_function=len`, so sizes are characters unless a token counter is passed. Defaults are 4000 and 200 (LangChain `base.py`, URL in 1.2).
3. **recall@k vs hit rate.** recall@k is the fraction of all relevant items found in the top k. "At least one relevant item in the top k" is hit rate or success@k. Many blogs blur the two, and Elastic's page describes R@k loosely. Lessons must say which one they compute; recall@k needs the total number of relevant items per query.
4. **The RRF constant.** k = 60 comes from a pilot study in the 2009 paper, where it was near-optimal but "not critical". Engines differ: Elasticsearch defaults to 60, Qdrant states 2. Ranks start at 1. RRF ignores raw scores, so it cannot express "this BM25 hit is far stronger than the rest".
5. **Fusion window.** Elasticsearch `rank_window_size` defaults to 10 (the `size`). A lesson that assumes "fuse the top 100 from each retriever" must set it explicitly.
6. **Weaviate does not default to rank fusion.** Since v1.24 the default is Relative Score Fusion.
7. **Approximate index plus filter loses rows.** pgvector filters after the HNSW scan: a 10% filter with `ef_search` 40 returns about 4 rows. Fixes: iterative index scans (0.8.0 and later), a higher `ef_search`, partial indexes or partitioning. Reject lessons that say "just add a WHERE clause".
8. **pgvector dimension limit.** `vector` indexes stop at 2,000 dimensions; 3072-dim text-embedding-3-large needs `halfvec` (up to 4,000) or the `dimensions` parameter.
9. **One engine's defaults are not the algorithm's.** `m` 16, `ef_construction` 64, `ef_search` 40 are pgvector's choices. Other engines choose differently.
10. **Truncating embeddings.** Valid only for models trained for it (Matryoshka-style; OpenAI v3 via `dimensions`). An OpenAI vector truncated by hand must be renormalized before dot-product search.
11. **Cosine vs dot product.** Equivalent only for unit-length vectors. OpenAI embeddings are normalized; other models may not be.
12. **Cross-encoders do not produce embeddings.** They cannot be precomputed or indexed, and cost scales with candidates times queries. ColBERT is not a cross-encoder: it stores per-token vectors and scores late, which costs storage (ColBERTv2 compresses 6 to 10x).
13. **Contextual retrieval numbers are relative and dated.** 35%, 49% and 67% are reductions in a top-20 failure rate from a 5.7% baseline on Anthropic's 2024 datasets. A lesson must state the baseline and date, never "67% better retrieval".
14. **Late chunking needs token-level outputs from a long-context embedding model.** It cannot be applied through an API that returns only one pooled vector per input unless the provider exposes it as an option. (This follows from the method description; it is not a quoted claim.)
15. **Overlap is not free recall.** In Chroma's test, 400-token chunks with 200 overlap had lower recall (88.1) than 400 without overlap (89.5), and lower IoU. One benchmark, but enough to stop a lesson asserting that overlap always helps. Overlap also inflates storage: 800/400 stores about 2x the corpus (computed in section 5).
16. **"Lost in the middle" is not a law.** The 2023 paper found a U-shape on 2023 models. Chroma's 2025 Context Rot report found no notable effect of needle position in its setup, but strong degradation with length and distractors. Teach length and distractors as the robust finding and position as model-dependent.
17. **"Long context replaces RAG."** LaRA (2025) finds no single winner; Li et al. find long context better on Wikipedia QA and RAG better on dialogue and general queries. Cost and freshness differ too. Anthropic's rule of thumb is to put the whole knowledge base in the prompt only below about 200k tokens.
18. **Faithful is not correct.** Faithfulness scores agreement with the retrieved context; a faithful answer drawn from a stale or wrong chunk still fails the user. LLM-verified faithfulness inherits judge noise. Ragas's legacy metrics API is scheduled for deprecation, so code pinned to it will break.
19. **Binary quantization without rescoring.** Recall drops sharply for smaller embeddings (Qdrant: 3-small at 512d scored 53 to 55% without rescoring vs 71 to 91% with). Pair binary with oversampling and float rescoring. The "about 96%" figure is for mxbai-embed-large-v1 with rescoring.
20. **Reranker scores are not probabilities unless calibrated.** Cohere claims calibration for Rerank 5 only (thresholds 0.50 Pro, 0.45 Fast). A fixed threshold on older rerankers or other vendors needs tuning per domain.
21. **Cohere limits and billing changed by version.** Rerank 3.5 has a 4k context; 4 and 5 have 32k. Per-search billing counts documents over 500 tokens as several documents; Rerank 5 is priced per token. Lessons must name the version.
22. **GraphRAG is not a general upgrade.** It targets global sensemaking questions, and indexing is LLM-heavy ("can be an expensive operation"). LazyGraphRAG's "0.1% of the costs" and "more than 700 times lower query cost" are Microsoft's own claims.
23. **Failure point names.** Use the paper's names (Missing Content, Missed the Top Ranked Documents, Not in Context, Not Extracted, Wrong Format, Incorrect Specificity, Incomplete). "Missing Content" means the corpus lacks the answer, not that parsing lost it. Do not invent extra "official" stages.
24. **Single-vector embeddings have hard limits, but LIMIT is adversarial.** BM25 93.6 vs 18.9 recall@100 is on a deliberately constructed synthetic set. Do not present it as typical production performance; it is a sourced reason hybrid search exists.
25. **Dates that are easy to get wrong.** Rerank 4's launch date is confirmed only by a third-party aggregator (2025-12-11). Claude search results left beta on 2025-08-08 per Anthropic's release notes (a search-engine summary said 2025-09-10, which is wrong). pgvector 0.8.3 fixed possible HNSW index corruption during vacuuming, so lessons recommending pgvector should say "0.8.3 or later".
26. **Agentic RAG loops need a cap.** The LangGraph tutorial graph routes "not relevant" back to rewrite and retrieve. A lesson or code problem built on it should add a retry limit and say so. (From the tutorial's edge list; whether the tutorial sets a recursion limit was not checked.)

---

## 5. Runnable Python snippets

All snippets use the Python standard library only, so they should run in Pyodide; they were not run inside Pyodide. Each was run with CPython 3.12.6 (`python -I`) on 2026-10-28 and its asserts passed. The output shown is the actual output.

### 5.1 BM25 from scratch (retrieval-foundations, hybrid-search)

```python
import math
from collections import Counter

def bm25_scores(query, docs, k1=1.2, b=0.75):
    """Okapi BM25 with the Lucene IDF: log(1 + (N - df + 0.5) / (df + 0.5))."""
    toks = [d.lower().split() for d in docs]
    n = len(toks)
    avgdl = sum(len(t) for t in toks) / n
    df = Counter(term for t in toks for term in set(t))
    scores = []
    for t in toks:
        tf = Counter(t)
        s = 0.0
        for q in query.lower().split():
            if q not in tf:
                continue
            idf = math.log(1 + (n - df[q] + 0.5) / (df[q] + 0.5))
            s += idf * tf[q] * (k1 + 1) / (tf[q] + k1 * (1 - b + b * len(t) / avgdl))
        scores.append(s)
    return scores

docs = [
    "error E1234 in the payment service",
    "how to reset your password",
    "payment failed with a timeout error",
    "the checkout page shows a timeout",
]
s = bm25_scores("E1234 timeout", docs)
print([round(x, 3) for x in s])
assert s.index(max(s)) == 0   # the rare identifier outweighs the common word
assert s[1] == 0.0
```

Output: `[1.183, 0.0, 0.681, 0.681]`

### 5.2 Reciprocal rank fusion (hybrid-search)

```python
def rrf(rankings, k=60, weights=None):
    """Reciprocal rank fusion. rankings: lists of doc ids, best first. Ranks start at 1."""
    weights = weights or [1.0] * len(rankings)
    scores = {}
    for w, ranking in zip(weights, rankings):
        for rank, doc in enumerate(ranking, start=1):
            scores[doc] = scores.get(doc, 0.0) + w / (k + rank)
    return sorted(scores, key=lambda d: (-scores[d], d))

bm25 = ["d3", "d1", "d7", "d2"]
dense = ["d1", "d5", "d3", "d9"]
fused = rrf([bm25, dense])
print(fused)
assert fused[:2] == ["d1", "d3"]          # in both lists near the top
assert set(fused) == {"d1", "d2", "d3", "d5", "d7", "d9"}
# k sets how much rank 1 beats rank 4. "x" and "z" each top one list; "y" is fourth in both.
# Ties break by id, so "x" beats "z" at k=1.
a = ["x", "p", "q", "y"]
b = ["z", "s", "t", "y"]
print(rrf([a, b], k=60)[0], rrf([a, b], k=1)[0])
assert rrf([a, b], k=60)[0] == "y" and rrf([a, b], k=1)[0] == "x"
```

Output:
```
['d1', 'd3', 'd5', 'd7', 'd2', 'd9']
y x
```

### 5.3 recall@k, hit rate, MRR, nDCG (retrieval-foundations, debugging-rag)

```python
import math

def recall_at_k(ranked, relevant, k):
    """Fraction of all relevant docs that appear in the top k."""
    return len(set(ranked[:k]) & relevant) / len(relevant)

def hit_at_k(ranked, relevant, k):
    """1 if at least one relevant doc is in the top k. Often mislabelled as recall@k."""
    return 1.0 if set(ranked[:k]) & relevant else 0.0

def reciprocal_rank(ranked, relevant):
    for i, doc in enumerate(ranked, start=1):
        if doc in relevant:
            return 1.0 / i
    return 0.0

def ndcg_at_k(ranked, gains, k):
    """gains maps doc id to graded relevance. DCG uses gain / log2(rank + 1)."""
    dcg = sum(gains.get(d, 0) / math.log2(i + 1) for i, d in enumerate(ranked[:k], start=1))
    ideal = sorted(gains.values(), reverse=True)[:k]
    idcg = sum(g / math.log2(i + 1) for i, g in enumerate(ideal, start=1))
    return dcg / idcg if idcg else 0.0

ranked = ["a", "b", "c", "d", "e"]
relevant = {"c", "e", "z"}               # "z" was never retrieved
print(recall_at_k(ranked, relevant, 5))  # 2/3
print(hit_at_k(ranked, relevant, 5))     # 1.0
print(reciprocal_rank(ranked, relevant)) # first hit at rank 3
assert abs(recall_at_k(ranked, relevant, 5) - 2 / 3) < 1e-9
assert reciprocal_rank(ranked, relevant) == 1 / 3

# Cross-check against the scikit-learn ndcg_score docs example, which prints 0.69 (truncated).
# True relevance [10, 0, 0, 1, 5] with scores [.1, .2, .3, 4, 70] gives this order.
true = {"d0": 10, "d1": 0, "d2": 0, "d3": 1, "d4": 5}
order = ["d4", "d3", "d2", "d1", "d0"]
v = ndcg_at_k(order, true, 5)
print(round(v, 4))
assert 0.69 <= v < 0.70
```

Output:
```
0.6666666666666666
1.0
0.3333333333333333
0.6957
```

The nDCG value matches a hand computation: DCG = 5 + 1/log2(3) + 10/log2(6) = 9.499; ideal DCG = 10 + 5/log2(3) + 1/2 = 13.655; ratio 0.6957. scikit-learn was not installed, so the comparison is against the printed docs example only.

### 5.4 Fixed-size chunker with overlap (ingestion)

```python
def chunk(tokens, size, overlap):
    """Fixed-size windows over a token list. Each chunk starts size - overlap after the last."""
    if not 0 <= overlap < size:
        raise ValueError("need 0 <= overlap < size")
    step = size - overlap
    out = []
    for start in range(0, len(tokens), step):
        out.append(tokens[start:start + size])
        if start + size >= len(tokens):
            break
    return out

words = [f"w{i}" for i in range(10)]
parts = chunk(words, size=4, overlap=1)
print(parts)
assert parts[0] == ["w0", "w1", "w2", "w3"]
assert parts[1][0] == "w3"                       # one word of overlap
assert parts[-1][-1] == "w9"                     # nothing dropped at the end
assert sum(len(p) for p in parts) == len(words) + (len(parts) - 1) * 1
# Overlap costs index size: stored tokens grow by about size / (size - overlap).
# 800-token chunks with 400 overlap store roughly 2x the corpus.
print(len(chunk(list(range(8000)), 800, 400)), "chunks for 8,000 tokens at 800/400")
```

Output:
```
[['w0', 'w1', 'w2', 'w3'], ['w3', 'w4', 'w5', 'w6'], ['w6', 'w7', 'w8', 'w9']]
19 chunks for 8,000 tokens at 800/400
```

19 chunks of up to 800 tokens for an 8,000-token document is 15,200 stored tokens, 1.9x the source.

### 5.5 Binary quantization with oversampling and rescoring (retrieval-foundations)

```python
import random, math

def normalize(v):
    n = math.sqrt(sum(x * x for x in v))
    return [x / n for x in v]

def dot(a, b):
    return sum(x * y for x, y in zip(a, b))

def to_bits(v):
    """1 bit per dimension: a positive value becomes 1. Packed into an int for fast XOR."""
    out = 0
    for i, x in enumerate(v):
        if x > 0:
            out |= 1 << i
    return out

def hamming(a, b):
    return bin(a ^ b).count("1")

random.seed(7)
dim, n = 256, 2000
docs = [normalize([random.gauss(0, 1) for _ in range(dim)]) for _ in range(n)]
query = normalize([d + random.gauss(0, 0.03) for d in docs[42]])   # near doc 42

exact = sorted(range(n), key=lambda i: -dot(query, docs[i]))[:10]

qbits, dbits = to_bits(query), [to_bits(d) for d in docs]
k, oversample = 10, 4
coarse = sorted(range(n), key=lambda i: hamming(qbits, dbits[i]))[:k * oversample]
rescored = sorted(coarse, key=lambda i: -dot(query, docs[i]))[:k]   # rescore with float vectors

recall = len(set(rescored) & set(exact)) / k
# Random Gaussian vectors are a worst case: neighbours 2 to 10 are near ties, so recall@10 is low
# even though the true nearest neighbour is found.
print("top hit", rescored[0], "recall@10 vs exact:", recall)
print("float32 bytes:", dim * 4, "binary bytes:", dim // 8)          # 32x smaller
assert exact[0] == 42 and rescored[0] == 42
assert dim * 4 // (dim // 8) == 32
```

Output:
```
top hit 42 recall@10 vs exact: 0.6
float32 bytes: 1024 binary bytes: 32
```

The 0.6 is specific to random data and seed 7; it is a teaching illustration, not a benchmark. Real embedding figures are in section 2.

### 5.6 Index napkin math (estimate problems)

```python
# Napkin math for an index. Prices and limits are from the sources listed with each line.
docs = 5_000_000            # scenario input
tokens_per_doc = 1_000      # scenario input
chunk, overlap = 800, 400   # OpenAI vector store auto chunking defaults

stride = chunk - overlap
chunks_per_doc = max(1, -(-(tokens_per_doc - overlap) // stride))   # ceil
chunks = docs * chunks_per_doc
embedded_tokens = chunks * chunk                 # upper bound: every chunk full

price_small = 0.02 / 1_000_000                   # text-embedding-3-small, USD per token
dims = 1536                                      # text-embedding-3-small default
float_bytes = chunks * dims * 4
half_bytes = chunks * dims * 2                   # pgvector halfvec
bit_bytes = chunks * dims // 8                   # binary quantization

print(f"chunks: {chunks:,}")
print(f"embedding cost (one pass): ${embedded_tokens * price_small:,.0f}")
print(f"raw vectors float32: {float_bytes / 1e9:,.1f} GB, halfvec: {half_bytes / 1e9:,.1f} GB, bits: {bit_bytes / 1e9:,.2f} GB")

# pgvector filtering: filters apply after the HNSW scan returns ef_search candidates.
ef_search, selectivity = 40, 0.10
print("expected rows after a 10% filter:", ef_search * selectivity)
assert chunks_per_doc == 2 and ef_search * selectivity == 4
```

Output:
```
chunks: 10,000,000
embedding cost (one pass): $160
raw vectors float32: 61.4 GB, halfvec: 30.7 GB, bits: 1.92 GB
expected rows after a 10% filter: 4.0
```

Raw vector bytes only; HNSW graph links, metadata and the text itself add more, and no sourced per-node overhead figure was found. Problems should give that overhead as a scenario input.

### 5.7 First-failing-stage triage for one eval question (debugging-rag)

```python
def triage(gold_ids, index_ids, retrieved_ids, context_ids, answer_correct):
    """Name the first pipeline stage that lost the gold evidence for one eval question.
    Labels are adapted from Barnett et al. 2024 (Seven Failure Points). Their "Missing Content"
    means the corpus never had the answer; here the first branch also covers text lost in parsing."""
    gold = set(gold_ids)
    if not gold & set(index_ids):
        return "missing from index (not in the corpus, or lost in parsing or chunking)"
    if not gold & set(retrieved_ids):
        return "missed top-ranked documents (retrieval or ranking)"
    if not gold & set(context_ids):
        return "not in context (dropped by truncation, dedup or token budget)"
    if not answer_correct:
        return "not extracted (generation: rerun with oracle context to confirm)"
    return "ok"

case = dict(gold_ids=["c17"], index_ids=["c1", "c17", "c30"],
            retrieved_ids=["c30", "c17", "c1"], context_ids=["c30"], answer_correct=False)
print(triage(**case))
assert triage(**case).startswith("not in context")
assert triage(["c9"], ["c1"], [], [], False).startswith("missing from index")
```

Output: `not in context (dropped by truncation, dedup or token budget)`

Not provided: an HNSW implementation (question 12). A correct small HNSW is long enough that it should be written and tested as its own code problem rather than pasted here unverified.

---

## 6. Sources (all checked 2026-10-28)

Primary and official:
1. https://lucene.apache.org/core/9_0_0/core/org/apache/lucene/search/similarities/BM25Similarity.html
2. https://www.postgresql.org/docs/current/textsearch-controls.html
3. https://arxiv.org/abs/2104.08663 (BEIR)
4. https://arxiv.org/abs/2508.21038 and https://arxiv.org/html/2508.21038v2 (LIMIT)
5. https://arxiv.org/abs/1908.10084 (Sentence-BERT)
6. https://www.sbert.net/examples/sentence_transformer/applications/retrieve_rerank/README.html
7. https://developers.openai.com/api/docs/guides/embeddings
8. https://developers.openai.com/api/docs/pricing
9. https://developers.openai.com/api/reference/resources/vector_stores/subresources/files/methods/create
10. https://developers.openai.com/api/docs/guides/tools-file-search
11. https://docs.cohere.com/docs/models
12. https://docs.cohere.com/docs/rerank-overview
13. https://docs.cohere.com/changelog
14. https://cohere.com/blog/rerank-5
15. https://cohere.com/pricing
16. https://arxiv.org/abs/1603.09320 (HNSW)
17. https://arxiv.org/abs/2401.08281 (Faiss)
18. https://github.com/pgvector/pgvector
19. https://github.com/pgvector/pgvector/blob/master/CHANGELOG.md
20. https://qdrant.tech/documentation/guides/quantization/
21. https://qdrant.tech/documentation/concepts/hybrid-queries/
22. https://huggingface.co/blog/embedding-quantization
23. https://scikit-learn.org/stable/modules/generated/sklearn.metrics.ndcg_score.html
24. https://www.elastic.co/docs/reference/elasticsearch/rest-apis/search-rank-eval
25. https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-rank-eval
26. https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/rrf-retriever
27. https://www.elastic.co/docs/reference/elasticsearch/rest-apis/reciprocal-rank-fusion
28. http://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf (RRF, SIGIR 2009)
29. https://docs.weaviate.io/weaviate/search/hybrid
30. https://arxiv.org/abs/2004.12832 (ColBERT)
31. https://arxiv.org/abs/2112.01488 (ColBERTv2)
32. https://arxiv.org/abs/2407.01449 (ColPali)
33. https://arxiv.org/abs/2212.10496 (HyDE)
34. https://arxiv.org/abs/2205.13147 (Matryoshka Representation Learning)
35. https://www.anthropic.com/news/contextual-retrieval
36. https://arxiv.org/abs/2409.04701 (late chunking)
37. https://www.trychroma.com/research/evaluating-chunking
38. https://www.trychroma.com/research/context-rot
39. https://raw.githubusercontent.com/langchain-ai/langchain/master/libs/text-splitters/langchain_text_splitters/base.py
40. https://raw.githubusercontent.com/langchain-ai/langchain/master/libs/text-splitters/langchain_text_splitters/character.py
41. https://reference.langchain.com/python/langchain-text-splitters/character/RecursiveCharacterTextSplitter
42. https://platform.claude.com/docs/en/build-with-claude/search-results
43. https://platform.claude.com/docs/en/release-notes/api.md
44. https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices
45. https://arxiv.org/abs/2404.16130 (GraphRAG)
46. https://microsoft.github.io/graphrag/
47. https://github.com/microsoft/graphrag
48. https://www.microsoft.com/en-us/research/blog/lazygraphrag-setting-a-new-standard-for-quality-and-cost/
49. https://arxiv.org/abs/2410.05779 (LightRAG)
50. https://arxiv.org/abs/2501.09136 (Agentic RAG survey)
51. https://docs.langchain.com/oss/python/langgraph/agentic-rag
52. https://arxiv.org/abs/2310.11511 (Self-RAG)
53. https://arxiv.org/abs/2401.15884 (CRAG)
54. https://arxiv.org/abs/2501.01880 (Long Context vs RAG)
55. https://arxiv.org/abs/2502.09977 (LaRA)
56. https://arxiv.org/abs/2307.03172 (Lost in the Middle)
57. https://arxiv.org/abs/2401.05856 and https://arxiv.org/html/2401.05856v1 (Seven Failure Points)
58. https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/faithfulness/
59. https://arxiv.org/abs/2309.15217 (RAGAS)

Interview question sources and secondary:
60. https://github.com/amitshekhariitbhu/ai-engineering-interview-questions
61. https://github.com/llmgenai/LLMInterviewQuestions
62. https://www.techinterview.org/post/3233476824/ai-engineer-interview-rag-agents-evals/
63. https://www.techinterview.org/post/3233476088/rag-system-design-interview/
64. https://www.techinterview.org/post/3233476794/glean-engineering-interview/
65. https://datadriven.io/blog/data-engineer-interviews-are-60-ai-now-2026
66. https://www.aced.io/blog/ai-engineer-interview-questions
67. https://www.hellointerview.com/community/questions/rag-system-design/cmoaemvhf1emv09adwqq9wk3f
68. https://www.hellointerview.com/community/questions/rag-pipeline-design/cms3ph2vm23in07adi4qja9op
69. https://getperspective.ai/blog/anthropic-applied-ai-engineer-interview-process-frontier-lab-2026/markdown
70. https://www.datacamp.com/blog/rag-interview-questions
71. https://careery.pro/blog/ai-careers/ai-engineer-interview-questions
72. https://github.com/ombharatiya/ai-system-design-guide (multi-tenant RAG prompt and case studies; question bank text not readable through the fetch)
73. https://releasebot.io/updates/cohere (third-party date for Rerank 4 only)

Tried and not usable: https://trec.nist.gov/pubs/trec8/papers/qa_report.pdf (image-only PDF), https://www.1point3acres.com/interview/problems/post/7100051 (HTTP 403).
