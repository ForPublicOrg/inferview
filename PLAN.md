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

A skill-graph home page was prototyped twice (a wired 9-by-5 grid, then one row of five round blocks per track) and rejected both times as too much to read. The landing stays a plain list of tracks (nine then, fifteen now) with a daily problem; the graph data (skills, prerequisites, round types) is kept in the research notes for a possible readiness readout later.

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

## 3. Curriculum: 15 tracks, 98 modules

Ordered for an experienced engineer who knows software but not ML. Evals sits third because the other tracks depend on it; workflows sits before agents because most production systems are workflows with model steps. The full curriculum (every lesson with kind and level, every problem with id, type and difficulty, the teardowns, the labs, the level bar, Core 100 and the crunch path) is `research/curriculum-v2.json`, with a readable copy in `research/curriculum-v2.md`. The table in `SPEC.md` section 4 lists the module slugs.

| # | Track | What it covers |
|---|---|---|
| 1 | LLM foundations | Tokens, embeddings, attention, sampling, training stages, model landscape |
| 2 | Building with model APIs | API anatomy, prompting, structured outputs, context engineering, frameworks |
| 3 | Evals and observability | Eval thinking, golden sets, LLM judges, agent evals, evals in CI |
| 4 | AI workflows and durable execution | Patterns, replay engines, retries and budgets, approvals and handoffs, batch pipelines, operating workflows |
| 5 | Retrieval and RAG | Retrieval foundations, ingestion, hybrid search, advanced RAG, debugging, vector systems, search quality |
| 6 | Agents and protocols | The agent loop, tools with MCP and A2A, memory and state, multi-agent systems, coding agents |
| 7 | Harness engineering and agentic coding tools | Harness anatomy, tool interfaces, context management, cache and cost, permissions and sandboxing, verification, long-running and parallel agents, evaluating harnesses; teardowns of the public coding agents |
| 8 | Prompt injection, guardrails and model safety | Threat modelling, red teaming, injection defences, guardrails, hallucination |
| 9 | Implementing security for AI systems | Secure architecture, permissions and identity, sandboxing and secrets, MCP security, output and data handling, supply chain, security operations, governance |
| 10 | Inference, serving and cost | Inference anatomy, batching, speed and cost techniques, gateways and FinOps, operating, fleet management |
| 11 | LLMOps, fine-tuning and AI product economics | Prompt lifecycle, releases and experiments, monitoring and feedback, data curation, fine-tuning, economics and model selection, platform strategy |
| 12 | Training, post-training and infrastructure | Compute and scaling, GPU kernels, distributed training, numerics, reliability, pretraining data, mixture of experts, post-training, RL, distillation and merging, adapting |
| 13 | Long context, architectures, multimodal and voice | Long context, architectures beyond the dense transformer, vision-language, speech and voice, generation |
| 14 | AI system design | Framework and rubric, capacity, retrieval cases, agent cases, real-time cases, platform cases |
| 15 | Coding rounds, work samples, behavioural and customer craft | Hand-write it, LLM-app coding, take-home and debug, codebase rounds, AI-collaborative coding, customer craft, deep dives, behavioural |

Lesson kinds: lesson, playbook (a procedure to run), paper (a walkthrough of one paper with its numbers), teardown (how a public system works, drawn from public sources, with a Diagram, a Trace and a section on what is not public). Every lesson and problem carries a level, senior or staff; nothing is written for a reader who has not shipped software.

Problem types, each tagged with difficulty, seniority, track, company and sources: concept, estimate, debug, code (Pyodide with visible and hidden tests), design, behavioural, mcq, critique, workflow, replay (an incident timeline with graded checkpoints), multistage (timed stages that build on your own code), repo (a bug fix across files), worksample and presentation. Labs are multi-step builds graded in the browser.

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

The site described in `SPEC.md` exists in this folder: Astro 5 static site, content schema with build-time validation, the component set (predict, three-depth answer, self-rating, choices, Pyodide code runner, estimate check), progress store with Google sign-in and Firestore sync, daily problem, review scheduling, catalog with filters, search. Nine tracks with one lesson per module.

### Done, 28 Oct 2026: curriculum v2

The first build read as too easy and too thin, so the curriculum was rebuilt from a gap study (`research/gaps/`) and a level audit of the existing files. What changed:

- 15 tracks and 98 modules, each module a set of ordered lessons instead of one overview. Six tracks are new: workflows, harness engineering, security implementation, LLMOps, training, and long context with multimodal and voice.
- 369 lessons: 269 lessons, 37 playbooks, 24 paper walkthroughs and 39 teardowns of public systems (Claude Code, Codex CLI, Cursor, Copilot's cloud agent, OpenHands, Aider, Cline, Gemini CLI, Goose, Jules, Devin, vLLM, DeepSeek V3 and R1, Llama 3 405B training, and others). Teardowns state what is not public rather than guessing.
- 613 problems with no easy ones, 20 of the old problems retired as below the bar. New types: replay, multistage, repo, worksample and presentation. Code problems run hidden tests. Core 100 and a 25-problem crunch path are curated from the curriculum.
- 34 labs with a step runner, and a mock interview loop at `/mock` with role presets and shareable seeds.
- A 52-rule level bar (`levelBar` in the curriculum file) that every author and reviewer worked against; the documented corrections (`corrections`) fix errors the gap study found in common sources.

Every module was written by one or two authoring agents, each track reviewed by a separate model against the level bar and the sources, and the findings applied; `npm run build`, `npx astro check`, the link check, `npm run labs` and `npm run code` all pass.

### Next

- Create the Firebase project and the Vercel project (both need the owner's accounts): `docs/firebase-setup.md`, `docs/deploy-vercel.md`. Until then no sign-in control renders and progress stays in the browser.
- Streak forgiveness (one missed day a week) needs a field in the progress shape and a rules change; the site makes no such promise today.
- A privacy-respecting counter before any usage number appears on the site.
- The curriculum file gives the lesson and the teardown in harness/long-running-parallel the same slug; the teardown on disk is `anthropic-long-running-harness`. Rename the curriculum entry to match.

## 7. Decisions and open questions

Decided: domain inferview.io; voice first-person candid; exercises are Python only (Pyodide); a daily problem counts toward the streak only when graded correct (mcq, debug, code, estimate within range).

Open: whether to add TypeScript exercises later; whether to upgrade from Astro 5 (its remaining advisories concern server rendering and image processing, neither used by this static build).
