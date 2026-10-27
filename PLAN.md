# Inferview: plan

Free, open-source, one-stop AI engineering interview prep for experienced software engineers. The goal is the site people open when they are preparing for an AI engineering loop, and keep opening afterwards.

Research inputs: 8 agents, 89 sources, 143 page fetches. Raw data in `research/brief.json` and `research/raw-research.json`. A Fable review of the first draft and prototypes produced 12 findings; all are folded in below and in the prototypes.

## 1. What the research says

The market splits into five camps, and none of them is interview prep.

| Camp | Examples | What they do well | What they miss |
|---|---|---|---|
| From-scratch mega courses | rohitg00/ai-engineering-from-scratch (542 lessons), mlabonne/llm-course, Hugging Face LLM and Agents courses | Free, deep | Sprawl into math, vision and speech; no practice, no difficulty or seniority tags, little interactivity |
| Static question banks | amitshekhariitbhu (about 570 questions), guocong-bincai (28 modules), llmgenai (119 questions) | Good taxonomies | Answers are links or missing; no execution, no tracking, no difficulty |
| Reference books and guides | Chip Huyen, "AI Engineering"; ombharatiya/ai-system-design-guide (147 questions, 15 case studies) | Closest to the canonical syllabus | Static reading |
| Paid cohorts | Maven evals course ($4,200), aiengg.dev, Udemy bootcamps | Accountability, community | Not reusable, not open, not calibrated to interviews |
| Best-in-class explainers | Transformer Explainer, Alammar, Tiktokenizer, bbycroft, Brilliant, Comeau | Prove that interactive teaching works | Single topic, no graded questions, no path |

Interview formats have changed and look little like LeetCode: a take-home with an eval report, "debug this looping agent", AI-collaborative coding scored on prompt clarity and verification, customer-discovery simulations, LLM system design rounds, hand-written attention. Nobody drills them. Evals is the most rewarded skill in loops and sits behind a paywall. Inference internals (KV cache, continuous batching) are asked at labs and have no interactive teaching anywhere.

The wedge: be the practice layer on top of the reading material that already exists. Link out for depth. Own the drills, the widgets and the habit loop.

### Interview question taxonomy

Shares are indicative, from candidate reports and job-description analysis in the research; they are not measured.

| Category | Share of loop | Example | Who asks |
|---|---|---|---|
| LLM fundamentals | 10 to 20% | Why divide attention scores by sqrt(d_k)? Why is temperature 0 not deterministic? | OpenAI, Anthropic, Google, Meta |
| RAG and retrieval | 15 to 25%, the top job-description skill | Q&A over 50 docs, 20-question eval set, report recall@5 and faithfulness | Anthropic, Scale, Glean, Databricks, Perplexity |
| Agents, tools, MCP | 15 to 20% | Agent loops forever: find and fix. Design a customer-service agent | Anthropic, Sierra, OpenAI |
| Evals and observability | 10 to 15%, the discriminating signal | How do you know your LLM judge is trustworthy? | Anthropic, Perplexity, Sierra |
| LLM system design | 15 to 25%, one dedicated round | Multi-tenant chat backend with token billing. Moderation pipeline | OpenAI, Anthropic, Meta, Google |
| Inference and serving | 5 to 15% (30% or more for infra roles) | Single-GPU batching for 100 synchronous inputs | OpenAI infra, Anthropic, xAI, Databricks |
| Practical coding | 1 or 2 rounds everywhere | Async retries with backoff. In-memory KV store with transactions | Everyone |
| Classic ML basics | 5 to 10% (big tech) | Bias and variance, precision and recall | Google, Meta, Amazon |
| Safety and security | 5 to 10% | Prompt-injection defence for an email agent | Anthropic, OpenAI, Scale |
| Behavioural and customer craft | 10 to 15% | Customer-discovery simulation (pass/fail) | Anthropic, OpenAI, Sierra |

## 2. Product thesis

Three things make a prep site the default destination, and they compound.

1. A finite, ordered path with a visible "next up" (the NeetCode roadmap effect). Core 100 is the product; the catalog is secondary.
2. Graded practice that runs in the browser with no API key and no backend: Pyodide for Python, a deterministic mock LLM for app exercises, recorded traces for agent debugging.
3. A habit loop: a daily problem seeded by the date, a streak that forgives one miss a week, client-side spaced repetition over every concept and question, and a monthly "what changed" digest.

Everything is free. Company tags, seniority tags and provenance are free too; they are the paid tier everywhere else.

Two decisions from the review:

- The first-run path lands on a gradable problem (the agent debug round), not on the most commoditised lesson. The wedge is the rounds nobody drills, so the first click shows one.
- The daily problem is always a gradable type (`code`, `estimate` with tolerance, or `debug` with a hypothesis pick). A streak built on "I read and rated myself" is not the LeetCode streak.

A skill-graph home page was prototyped twice (a wired 9-by-5 grid, then one row of five round blocks per track) and rejected both times as too much to read. The landing stays a plain list of nine tracks with a daily problem; the graph data (skills, prerequisites, round types) is kept in the research notes for a possible readiness readout later.

### Design principles

Write for people who ship software. KV cache is memoisation, continuous batching is event-loop scheduling, a tokenizer is a lexer, an eval suite is a test suite. Never explain a hash map.

Predict, then reveal. Every widget asks for a guess first. That is the moment an interview tests.

Toy numbers first, real numbers second. Four-dimensional vectors, then 4096. Shapes and units labelled. Vectors drawn as heatmaps, not digits.

Answers at three depths. The 30-second conclusion, the 3-minute version with trade-offs, then the follow-ups interviewers ask: how do you verify it, how does it fail, what is the alternative. Self-rating feeds spaced repetition.

Every number carries a source. A cost, latency or accuracy claim comes with a number, an assumption, a date, and either a source or a measurement we ran. No number at all beats an invented one. The tokens lesson measures its counts with js-tiktoken rather than quoting folklore.

One running metaphor per lesson, one payoff line, a candid first-person voice. Fun comes from interactivity and voice, not from memes or decoration.

Original content only. Link out to Alammar, Weng, Karpathy, Huyen and Husain for depth. Borrowed examples and licences go in `SOURCES.md`.

Every widget has a fallback (recorded output or a static figure), works from the keyboard, and loads heavy models only on an explicit button.

Copy and UI pass the anti-slop filter (`~/.claude/skills/antislop*`, from miqdadbadjuber/anti-slop): no em dashes, no buzzwords, no invented statistics or social proof, no decorative emoji or arrows, no dead controls, no navigation to pages that do not exist.

### Lesson skeleton (15 to 30 minutes, time shown)

1. Hook: a real interview prompt or a production scenario, labelled as such
2. Intuition with toy numbers
3. One widget isolating one variable: predict, play, reveal
4. Real-scale numbers, measured or sourced
5. Editable code
6. Interview question with the three-depth answer and self-rating
7. "When this is wrong" and "what I would say in the room"

## 3. Curriculum: 9 tracks, 45 modules

Ordered for an experienced engineer who knows software but not ML. Track 1 is skippable after a placement check. Evals sits at position 3, right after the API basics it needs, because it is the most rewarded skill and the one nobody else teaches for free. Each module ships lessons, one to three widgets and two to four real interview questions. Full lesson lists are in `research/brief.json`.

| # | Track | Modules | Signature widget |
|---|---|---|---|
| 1 | LLM foundations for software engineers | Tokens and tokenization; embeddings and similarity; attention and the transformer in one sitting; next-token prediction and sampling; training stages and adapting models; model landscape and selection | Tokenizer playground with real and toy strips; live attention heatmap on GPT-2 small; sampling lab |
| 2 | Building with model APIs | API anatomy, streaming and reliability; prompting that survives production; structured outputs and tool calling; context engineering and caching; frameworks vs no framework | Streaming and retry simulator; prompt-cache break-even calculator |
| 3 | Evals and observability (flagship) | Eval thinking and error analysis; golden sets and metrics; LLM-as-judge, calibrated; evaluating agents and public benchmarks; evals in CI, monitoring, feedback loops | Trace-coding workbench; judge TPR/TNR calculator; recall@k, NDCG and pass^k calculators |
| 4 | Retrieval and RAG | Retrieval foundations; ingestion and chunking; hybrid search, reranking, query transformation; advanced RAG patterns; debugging a broken RAG system | RAG pipeline builder and failure-stage debugger (in-browser MiniLM embeddings) |
| 5 | Agents and protocols | The agent loop; tool design, MCP and A2A; memory, state, durable execution; multi-agent systems and failure modes; computer use, coding agents, autonomy controls | Agent trace stepper with fault injection; error-compounding calculator |
| 6 | Security, safety and guardrails | Threat modelling LLM systems; red-team game; guardrails, permissions, isolation; hallucination, safety, responsible AI | Prompt-injection game against a scripted target with layered defences |
| 7 | Inference, serving and cost | Anatomy of inference; batching and PagedAttention; making it faster and cheaper; gateways, routing, FinOps; deploying and operating LLM services | Continuous-batching and PagedAttention simulator; KV-cache, GPU memory and cost calculators |
| 8 | AI system design | Delivery framework and rubric; capacity and cost workshop; retrieval-centric case studies; agentic case studies; real-time and specialised case studies | Whiteboard with rubric and live cost, latency and quality gauges |
| 9 | Coding rounds, behavioural and customer craft | Hand-write it (attention, BPE, sampler); LLM-app coding problems; take-home and debug rounds; AI-collaborative coding round; customer craft and product sense; behavioural, stories, company loops | Pyodide runner with hidden tests and mock LLM; customer-discovery conversation simulator |

Problem types, each tagged with difficulty, seniority, track, company, provenance and last-verified date: `concept` (quiz, predict-then-reveal), `code` (Pyodide, hidden tests), `debug` (trace or broken pipeline), `design` (rubric self-score), `take-home` (spec plus eval-report rubric), `behavioural` (story bank plus rubric), `estimate` (napkin math with tolerance).

## 4. Retention mechanics, by priority

| Priority | Mechanic | How it works on a static site |
|---|---|---|
| P0 | Ordered path with "next up"; Core 100 | Skill-graph JSON with stable node ids; progress in localStorage |
| P0 | Daily problem (seed = date), gradable types only, with archive | No server needed |
| P0 | Streak that forgives one miss a week | Client side; export and import as JSON |
| P0 | Spaced repetition (FSRS) over questions and concept cards; "N due" badge | Pure JS, IndexedDB |
| P0 | Predict-then-reveal lessons; three-depth answers with self-rating | The content format |
| P0 | Freshness: changelog, "what changed this month", last-verified badges, RSS | Git based; CI flags stale pages |
| P1 | Placement check and readiness score per role track, self-reported | Client side |
| P1 | Company and role tags with provenance; anonymous loop reports via a form that opens a PR | Schema-validated content |
| P1 | Per-problem discussion (Giscus on GitHub Discussions) | Free |
| P1 | Contributor credits; "add a question in ten minutes" path | Repo workflow |
| P2 | Weekly challenge, seasonal event, friend leaderboards via share codes | Needs a light backend later |
| P2 | Optional GitHub login and sync; public profiles | Later |

## 5. Tech stack

Astro 5 with MDX content collections (Zod-validated frontmatter), React islands hydrated with `client:visible`, Tailwind, deployed as a static site on Cloudflare Pages.

Widgets: Pyodide in a Web Worker (numpy, pandas, scikit-learn; no torch), CodeMirror 6, js-tiktoken, transformers.js (WASM q8, WebGPU optional), WebLLM strictly opt-in, Pagefind for search, nanostores plus localStorage and IndexedDB for progress and spaced repetition.

Why: no JavaScript by default on reading pages, lazy hydration for heavy widgets, content as files that fail the build on bad metadata, no backend, free hosting with a preview deploy per PR.

Risks and mitigations: Pyodide cold start (preload on idle, numpy-only exercises, kill on timeout); WebGPU fragmentation (opt-in, precomputed fallbacks, weights from the Hugging Face CDN); progress stuck on one device (export and import early, optional sync later); content staleness (last-verified dates, CI flag after N months); Cloudflare's 20k-file cap (chunked catalog JSON); widget authoring cost (a small reusable library: slider, stepper, token strip, heatmap, matrix, live-code cell, quiz).

Licensing: code MIT, content CC BY-SA 4.0, stated in the repo from day one.

Content schema per item:

```yaml
id: tok-001            # stable
title: ...
type: concept | code | debug | design | take-home | behavioural | estimate
track: llm-foundations
module: tokens
difficulty: easy | medium | hard
seniority: [mid, senior]
companies: [{ name: Anthropic, provenance: candidate-report, date: 2026-03 }]
estMinutes: 20
prerequisites: [tok-000]
core100: true
lastVerified: 2026-10-01
license: CC-BY-SA-4.0
```

## 6. Roadmap

### Done, 28 Oct 2026: the first full build

The site described in `SPEC.md` exists in this folder: Astro 5 static site, content schema with build-time validation, the component set (predict, three-depth answer, self-rating, choices, Pyodide code runner, estimate check), progress store with Google sign-in and Firestore sync, daily problem, review scheduling, catalog with filters, search. All nine tracks have one lesson per module and a problem bank; the exact counts are computed at build time and shown on the landing page. Each track's research notes with sources are in `research/tracks/`.

Every track went through an independent fact and code review before this build; findings and the fixes applied are recorded in the build log of that session, not in the repository.

### Next

- Create the Firebase project and the Vercel project (both need the owner's accounts): `docs/firebase-setup.md`, `docs/deploy-vercel.md`. Until then sign-in shows "not configured" and progress stays in the browser.
- Second lesson per module where the module's lesson list in `research/brief.json` has more than the core lesson covers.
- The mock LLM for trace-coding problems, the RAG failure-stage debugger and the design whiteboard with rubric (ideas kept from the earlier roadmap; none exists yet).
- Streak forgiveness (one missed day a week) needs a field in the progress shape and a rules change; the site makes no such promise today.
- A privacy-respecting counter before any usage number appears on the site.

## 7. Decisions and open questions

Decided: domain inferview.io; voice first-person candid; exercises are Python only (Pyodide); a daily problem counts toward the streak only when graded correct (mcq, debug, code, estimate within range).

Open: whether to add TypeScript exercises later; whether to upgrade from Astro 5 (its remaining advisories concern server rendering and image processing, neither used by this static build).
