# Inferview build spec

The contract between the site scaffold and the content. Everything that writes code or content follows this file. Design decisions and reasons stay in `DESIGN.md`; product reasoning stays in `PLAN.md`.

## 1. Product in one paragraph

Inferview (inferview.io) is a free, open-source interview-prep site for AI engineering, written for senior and staff software engineers. Fifteen tracks in one order, each a set of modules with an ordered list of lessons, a bank of problems and, where the module has one, a lab. Every problem is a review card. A daily problem is derived from the date. Progress lives in the browser and, after Google sign-in, in the user's own Firestore document. No server of our own.

## 2. Stack (fixed)

- Astro 5, static output (`output: 'static'`), TypeScript, MDX content collections with Zod schemas (Astro 5 `glob` loader).
- No UI framework. Widgets are Astro components with vanilla TypeScript in `<script>` tags. No Tailwind: the stylesheet is `src/styles/inferview.css`, ported from `prototypes/inferview.css` (same tokens, IBM Plex, deep green accent).
- Fonts self-hosted with `@fontsource/ibm-plex-sans`, `@fontsource/ibm-plex-serif`, `@fontsource/ibm-plex-mono` (no Google Fonts request).
- Firebase JS SDK v10+ modular: Authentication (Google provider, popup with redirect fallback) and Firestore. Config from `PUBLIC_FIREBASE_*` env vars; `.env.example` lists them. These keys are public identifiers, not secrets; security comes from Firestore rules and the authorised-domain list.
- Pyodide loaded from the jsDelivr CDN on first use, only on pages with code (code, multistage and repo problems, labs), inside a Web Worker. The Python test harness is `public/workers/harness.py`; the worker fetches it, and `npm run code` and `npm run labs` run the same file in local Python with `python -I`.
- Pagefind for search (`postbuild` runs `pagefind --site dist`).
- Deployed on Vercel as a static site. `vercel.json` sets security headers (see section 8).
- Tokenizer measurements come from `js-tiktoken` (dev-time script), the live tokenizer in the browser is the toy BPE from the prototype plus the precomputed real strips.

## 3. Repository layout

```
astro.config.mjs
package.json
vercel.json
firestore.rules
firebase.json              (rules deploy only)
.env.example
public/                    favicon, robots.txt
scripts/validate-content.mjs   validates every lesson, problem and lab against the schema without a full build (npm run validate)
scripts/check-code.mjs     runs every code, multistage and repo solution against its visible and hidden tests (npm run code)
scripts/check-labs.mjs     runs every lab step's tests against the reference solutions (npm run labs)
scripts/tokens.mjs         regenerates measured token data
src/
  styles/inferview.css
  content.config.ts        collections: lessons, problems
  content/
    lessons/<track>/<module>/<lesson-slug>.mdx
    problems/<track>/<id>.mdx
    labs/<lab-slug>.mdx
  data/tracks.ts           the 15 tracks and their modules (slugs below), generated from research/curriculum-v2.json
  data/loops.ts            mock loop presets
  data/lists.ts            named lists (Core 100 is computed from `core: true`; crunch path is a fixed id list)
  lib/
    firebase.ts            lazy init, auth, firestore
    progress.ts            progress store: localStorage + Firestore sync, review scheduling, streak
    daily.ts               daily problem from the date
    schedule.ts            review intervals
  components/
    Nav.astro Footer.astro ThemeToggle.astro SignIn.astro
    Callout.astro Depth.astro Predict.astro SelfRate.astro Choices.astro Checklist.astro Estimate.astro
    CodeRunner.astro (code and repo problems) LabRunner.astro (labs and multistage problems) Replay.astro (replay problems)
    Diagram.astro Trace.astro (teardowns)
    widgets/               TokenStrip.astro BpeStepper.astro SamplingLab.astro ... (one file per widget)
  layouts/Base.astro Lesson.astro Problem.astro
  pages/
    index.astro            landing (port of prototypes/index.html with live data)
    learn/index.astro      track list
    learn/[track]/index.astro            modules with their lesson lists and progress
    learn/[track]/[module]/index.astro   the module: ordered lessons, its problems, its lab if any
    learn/[track]/[module]/[lesson].astro
    labs/index.astro labs/[lab].astro     progressive builds with tests (section 10)
    teardowns.astro        every lesson of kind teardown, by track, with a level filter
    problems/index.astro   catalog with client-side filters, 50 problems to a page (src/lib/pager.ts; page number in ?page=)
    problems/[id].astro
    daily.astro            today's problem and the archive
    mock.astro             timed mock loop (section 11)
    review.astro           cards due
    lists.astro            named lists
    account.astro          sign in/out, export/import JSON, delete data
    about.astro privacy.astro contribute.astro 404.astro
```

## 4. Tracks and modules (slugs are fixed)

| # | track slug | code | title | module slugs | new track |
|---|---|---|---|---|---|
| 1 | foundations | fnd | LLM foundations for software engineers | tokens, embeddings, attention, sampling, training, model-landscape |  |
| 2 | apis | api | Building with model APIs | api-anatomy, prompting, structured-outputs, context-engineering, frameworks |  |
| 3 | evals | evl | Evals and observability | eval-thinking, golden-sets, llm-judge, agent-evals, evals-in-ci |  |
| 4 | workflows | wfl | AI workflows and durable execution | patterns, durable-execution, retries-flow-control, approvals-handoffs, batch-pipelines, operating-workflows | New in v2. Workflows with model steps: patterns, durable execution, retries and budgets, approvals and batch stages. It sits before agents because most production systems are workflows with model steps. |
| 5 | rag | rag | Retrieval and RAG | retrieval-foundations, ingestion, hybrid-search, advanced-rag, debugging-rag, vector-systems, search-quality |  |
| 6 | agents | agt | Agents and protocols | agent-loop, tools-mcp-a2a, memory-state, multi-agent, coding-agents |  |
| 7 | harness | hrn | Harness engineering and agentic coding tools | harness-anatomy, tools-aci, context-management, cache-cost-latency, permissions-sandboxing, verification, long-running-parallel, evaluating-harnesses | New in v2. Everything between the user and the sampler in a coding agent, with a teardown of each public tool; built first. |
| 8 | safety | sfe | Prompt injection, guardrails and model safety | threat-modeling, red-team, injection-defences, guardrails, hallucination |  |
| 9 | security | sec | Implementing security for AI systems | secure-architecture, permissions-identity, sandboxing-secrets, mcp-security, output-data, supply-chain, security-ops, governance | New in v2. Security implemented for model systems, from threat model to controls, tests and operations; the model-facing half (injection, guardrails) stays in safety. |
| 10 | inference | inf | Inference, serving and cost | inference-anatomy, batching, faster-cheaper, gateways-finops, operating, fleet |  |
| 11 | llmops | ops | LLMOps, fine-tuning and AI product economics | prompt-lifecycle, releases-experiments, monitoring-feedback, data-curation, fine-tuning, economics-selection, platform-strategy | New in v2. Prompt lifecycle, releases and experiments, drift and feedback, data curation, fine-tuning projects and unit economics. |
| 12 | training | trn | Training, post-training and infrastructure | compute-scaling, gpu-kernels, distributed, numerics, reliability, pretraining-data, moe, post-training, rl, distill-merge, adapting | New in v2. Training, post-training and distributed infrastructure for ML infra and research-engineer loops; its labs are Python simulators, never real training in the browser. |
| 13 | multimodal | mml | Long context, architectures, multimodal and voice | long-context, architectures, vision-language, speech-voice, generation | New in v2. Long context, architectures beyond the dense transformer, vision-language costs, speech and voice turns, and image and video generation. |
| 14 | system-design | sys | AI system design | framework, capacity, case-retrieval, case-agents, case-realtime, case-platforms |  |
| 15 | rounds | rnd | Coding rounds, work samples, behavioural and customer craft | hand-write, llm-app-coding, take-home-debug, codebase-rounds, ai-collab-coding, customer-craft, deep-dives, behavioural |  |

Track order on the site is the table order (evals sits third on purpose: the other tracks depend on it). `src/data/tracks.ts` is generated from `research/curriculum-v2.json` (`tracks`, in order) and holds the same slugs, codes and module titles; module detail (lesson list, kinds, levels, problems, sources) is in the curriculum file under each track's `modules`.

## 5. Lessons

Path: `src/content/lessons/<track>/<module>/<lesson-slug>.mdx`. URL: `/learn/<track>/<module>/<lesson-slug>`. Every module has its full ordered lesson list from `research/curriculum-v2.json`; each lesson is 1,200 to 2,500 words and teaches one decision or mechanism. The lesson page shows the kind and the level; `/teardowns` lists every teardown across tracks.

Frontmatter (all required unless marked):

```yaml
title: Tokens and tokenization
track: foundations
module: tokens
order: 1                 # position inside the module: a whole number, 0 or more, unique in the module
kind: lesson             # lesson | teardown | playbook | paper
level: senior            # senior | staff: who the lesson is written for (never below senior)
minutes: 22              # honest reading estimate: words / 200, plus widget time
summary: One plain sentence, no colon-led teaser.
prerequisites: []        # "track/module/lesson" slugs
updated: 2026-10-28
sources:                 # every number, quote or borrowed example has an entry
  - title: Neural Machine Translation of Rare Words with Subword Units
    url: https://arxiv.org/abs/1508.07909
    note: BPE merge example (low, lower, newest, widest)
```

Lesson skeleton (fixed, from PLAN.md):

1. Hook: a scenario labelled as a scenario, never an anecdote presented as true.
2. The idea with toy numbers, in a software engineer's terms (analogies to compilers, caches, databases, queues).
3. One widget where the module has one (import from `src/components/widgets/`), or a `<Predict>` block.
4. Real numbers, each with a source.
5. Code where it helps (Python, runnable, short).
6. "In the room": one interview question with a `<Depth>` block (30-second answer, 3-minute answer, follow-ups).
7. "When this is wrong": the limits of the lesson's model of the world.
8. `<SelfRate id="lesson:<track>/<module>/<slug>" />` at the end.

Kinds other than `lesson` use their own skeleton:

- `teardown` (how a real system works, from public sources only; the file imports `Diagram` and `Trace`): what it is and who runs it; the system design as a diagram (`<Diagram>` component: an SVG drawn from a declarative list of boxes and edges, no hand-written SVG) with one paragraph per component; the request lifecycle as an annotated trace (`<Trace>` component with steps); context strategy; tools and permission model; cost and latency; failure modes; what is not public (stated plainly, never guessed); interview questions about it with a `<Depth>` block; sources.
- `playbook` (a decision guide): the decision, the inputs that change it, the options with the conditions under which each wins, a worked decision on a stated case, what to measure after deciding.
- `paper` (a paper walkthrough): the problem the paper solves, the mechanism in engineering terms, the key figure or number with the source, what changed in practice because of it, what to say about it in an interview.

Components available in MDX (lessons import from `../../../../components/...`, problems from `../../../components/...`; teardowns also use `<Diagram>` and `<Trace>`):

- `<Callout kind="interview|gotcha|aside">` text `</Callout>`
- `<Depth short="..." long="..." followups={[...]} />` or with slots `<Fragment slot="short">`, `long`, `followups`
- `<Predict id question tolerance answer unit>` for a numeric guess, children = the reveal text
- `<SelfRate id>` writes the rating to the progress store and schedules the review

## 6. Problems

Path: `src/content/problems/<track>/<id>.mdx`. URL: `/problems/<id>`. The id is `<trackcode>-<nnn>` with the codes from section 4: `fnd, api, evl, wfl, rag, agt, hrn, sfe, sec, inf, ops, trn, mml, sys, rnd` (example `agt-002`). Use the id the curriculum assigns.

Frontmatter:

```yaml
id: agt-002
title: Agent loops forever
subtitle: find and fix            # optional
track: agents
module: agent-loop
type: debug                       # concept | estimate | debug | code | design | behavioural | mcq | critique | workflow
                                  # | replay | multistage | repo | worksample | presentation
difficulty: medium                # easy | medium | hard; at most one easy per module
seniority: [senior, staff]        # any of senior, staff
minutes: 25
core: true                        # Core 100 membership; counts per track in section 7
tags: [tool-calling, retries]
companies:                        # ONLY with a public source that names the company and the topic
  - name: Anthropic
    url: https://...
updated: 2026-10-28
sources: [...]                    # as in lessons
# type-specific:
choices:                          # mcq and debug: 3 to 5 entries, exactly one correct
  - text: ...
    correct: true
    why: one sentence shown after answering
range: { low: 70, high: 100, unit: GB }   # estimate: accepted band for self-check
checklist:                        # critique, workflow, worksample, presentation: 4 to 12 points a strong answer covers
  - Names the unbounded retry as the cause of the cost spike
  - Proposes an idempotency key per tool call
code:                             # code: Python 3, runs in Pyodide (stdlib only, no torch)
  starter: |
    def top_p(logits, p): ...
  tests: |                        # visible asserts, each top-level statement reported separately
    assert ...
  hidden: |                       # optional: run after the visible tests, never shown, reported as "hidden test n"
    assert ...
  solution: |
    ...
```

Fields for the types added in v2:

```yaml
# replay: an incident timeline; an event with choices is a checkpoint (at least two, exactly one correct each)
replay:
  - event: The update ships after offline evals and a small A/B test look positive.
  - event: Users post examples of the model flattering weak ideas.
    choices:
      - text: Roll back to the previous model while the cause is found
        correct: true
        why: one sentence shown after the pick
      - text: Patch the system prompt and keep the new model live
        correct: false
        why: ...

# multistage: 3 or 4 stages; only stage 1 has a starter, later stages continue from the reader's code
code:
  starter: |
    class Store: ...
  solution: |                     # one program that passes every stage
    ...
stages:
  - title: Set, get and delete
    brief: one paragraph
    tests: |
      assert ...
    hidden: |                     # optional
      assert ...

# repo: a multi-file package written into the worker filesystem; the reader edits code.target
code:
  files:                          # path to content, at least two files
    ledger/__init__.py: ""
    ledger/book.py: |
      ...
  target: ledger/book.py          # must be a key of files
  tests: |                        # the tests import from the files
    from ledger.book import balance
    assert ...
  hidden: |
    assert ...
  solution: |                     # the whole fixed target file
    ...
```

Body sections, in this order (omit a section only when the type has no use for it):

- `## Question` the prompt as the interviewer would give it, with any trace, code or data.
- `## Hints` two or three, each one sentence, inside `<details>`.
- `## Answer` for concept/estimate/design/behavioural: a `<Depth>` block, then the worked answer. For debug/mcq: why the correct choice is correct and why each wrong one is tempting. For code: the reference solution explained.
- `## Follow-ups` what the interviewer asks next.
- `## Common mistakes`.

Types and how they are answered:

- `critique`: the question gives a design, a trace, a prompt or a piece of code that is flawed; the reader lists the flaws, then opens the checklist and ticks what they found. Self-rated from the tick ratio.
- `workflow`: the question gives a business process and constraints; the reader designs the workflow (steps, state, retries, approvals, budgets), then checks it against the checklist. Self-rated.
- `replay`: `Replay.astro` shows the timeline one event at a time; at a checkpoint the reader picks before the next event appears, and the first pick counts. When every checkpoint is answered it shows picks correct over checkpoints, records a gradable completion and opens the answer, which carries the published postmortem and the self-rated question of which control would have caught it.
- `multistage`: `LabRunner` with the stages as steps. Stage n runs its tests, then its hidden tests, against the reader's program. The stage reached and the code persist under `labs["problem:<id>"]`; passing the last stage records `problem:<id>` as a gradable completion and opens the answer.
- `repo`: `CodeRunner` writes every file into the Pyodide filesystem (a fresh directory per run) with the editor contents as the target file, then runs the tests and hidden tests, which import from the files. The other files are shown read-only.
- `worksample` and `presentation`: the checklist, as for critique and workflow. Self-rated and never counted for the streak.
- The rest as before.

Gradable types (count for the streak): mcq, debug, code, estimate, replay, multistage, repo. The daily problem is drawn from the gradable types short enough for one sitting: mcq, debug, code, estimate and replay. Concept, design, behavioural, critique, workflow, worksample and presentation are self-rated. The catalog shows a type filter chip, with a readable label, for every type that has at least one problem. Lists built in the browser that can grow past one screen (the catalog, the review deck's due list) are paged with `src/lib/pager.ts`: Previous and Next, the range on screen, the page number in `?page=`, back to page 1 on a filter change, and no controls while the list fits on one page.

## 7. Bank size and coverage for this build

The bank is the one `research/curriculum-v2.json` lists: per module, the lessons with kind and level, and the problems with id, type, difficulty and level; `core100` and `crunch` name the Core 100 and crunch-path ids, and `retiredProblems` the ids that were removed and must not be reused. The curriculum's `counts` holds the totals per type, kind and track.

Latest material that must be covered somewhere, with sources dated 2025 or 2026: Agent Skills (SKILL.md), MCP (current spec revision, transports, auth), A2A, LangGraph 1.x (state graphs, checkpointers, interrupts, human-in-the-loop), OpenAI Agents SDK and Responses API, Claude Agent SDK, agentic coding tools and their harnesses, computer use, prompt caching and context engineering, structured outputs and constrained decoding, reasoning models and test-time compute, GRPO and RL with verifiable rewards, LoRA/QLoRA, speculative decoding, continuous batching and PagedAttention, vLLM and SGLang, quantization formats, hybrid search and reranking, GraphRAG and late chunking, LLM-as-judge calibration, OpenTelemetry GenAI semantic conventions, OWASP Top 10 for LLM applications, prompt injection defences, and guardrail patterns.

## 8. Progress, auth and security

Progress document (same shape in localStorage key `inferview-progress` and Firestore `users/{uid}`):

```ts
type Progress = {
  v: 1
  streak: { count: number; last: string }            // last = YYYY-MM-DD of the last gradable completion
  items: Record<string, { s: 'seen' | 'done'; r?: 1|2|3|4; due?: string; n: number; at: number }>
  labs?: Record<string, { step: number; code: string; at: number }>   // lab slug, or "problem:<id>" for a multistage problem
}
```

- Keys in `items` are `lesson:<track>/<module>/<slug>`, `problem:<id>` or `lab:<slug>/<n>`. Keys in `labs` are a lab slug or `problem:<id>` for a multistage problem, with the step or stage reached (1 to 10) and the code (at most 20,000 characters). Ratings 1 to 4 map to review intervals 1, 3, 7, 21 days (`schedule.ts`); a lower rating resets the interval.
- When the `PUBLIC_FIREBASE_*` variables are not set at build time, the site shows no sign-in control anywhere; the account page says progress is stored in this browser and offers export and import. Nothing on the site says "not configured".
- `PUBLIC_FIREBASE_REGION` (optional) names the Firestore location on the privacy page; when unset the sentence about location is omitted.
- Signed out: localStorage only. On sign-in: merge local and remote per item by the newer `at`, write the merge back to both, keep syncing on every change (debounced).
- Account page: export JSON, import JSON (validated against the shape, size capped), delete all data (Firestore document and local), sign out.
- `firestore.rules`: `users/{uid}` readable and writable only when `request.auth.uid == uid`; the write must match the shape above (v == 1, streak map, items map, optional labs map) and nothing else; no other collections. Rules cannot loop over a map, so `labSlugs()` lists every allowed `labs` key (every lab in the curriculum's `kinds.labs` and every multistage problem as `problem:<id>`) and `validLabs()` checks each by name; `npm run validate` fails when a lab file or multistage problem is missing from either.
- Firebase Auth: `GoogleAuthProvider`, `signInWithPopup` with `signInWithRedirect` fallback, `browserLocalPersistence`. Authorised domains documented in `docs/firebase-setup.md`: inferview.io, www.inferview.io, localhost, and the Vercel preview domain.
- App Check with reCAPTCHA v3 is documented as an optional step, off by default (it needs a site key).
- `vercel.json` headers: Content-Security-Policy (self, Firebase auth and Firestore hosts, apis.google.com for the popup, cdn.jsdelivr.net for Pyodide, blob: and worker-src for the worker, no unsafe-eval except what Pyodide needs inside its worker), Strict-Transport-Security, X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy denying camera, microphone and geolocation, X-Frame-Options DENY. Firebase's `__/auth` handler is not needed on Vercel when the popup flow runs on the Firebase authDomain; document the `authDomain` choice.
- No user-supplied HTML is ever injected. The imported progress JSON is parsed and validated, never evaluated.
- No secrets in the repository. `.env` is gitignored.

## 9. Copy and content rules (short form)

The global anti-slop rules apply (the CLAUDE.md in the home directory). In addition:

- Every number is measured, sourced, or computed in front of the reader. No "studies show". No testimonials.
- Company attributions only with a public source URL. Otherwise leave `companies` empty.
- Write for someone who already ships software: name the systems analogy, then the difference.
- Predict-then-reveal before any surprising number.
- Three-depth answers for every interview question.
- Plain sentences, no em dashes, no bullet lists that restate the paragraph, no closing summaries that repeat the lesson.
- Dates: `updated` is the date the content was last checked against its sources.

The level bar in `research/curriculum-v2.json` (`levelBar`) is binding for every lesson and problem: the reader is a senior or staff software engineer; nothing below that level is explained.

## 10. Labs

A lab is a progressive build: one program grown over 5 to 10 steps, each step a code problem whose tests build on the previous step. Path `src/content/labs/<lab-slug>.mdx`, URL `/labs/<lab-slug>`.

```yaml
title: Build a mini agent harness
track: harness            # the track it belongs to; the module page links to it
module: harness-anatomy
kind: lab                 # lab (default, 5 to 10 steps) | multistage (3 to 10 stages, labelled as stages)
minutes: 120
summary: ...
updated: 2026-10-28
sources: [...]
steps:
  - title: The loop
    brief: one paragraph of what this step adds and why
    starter: |
      ...
    tests: |
      ...
    hidden: |             # optional: run after the visible tests, never shown, reported as "hidden test n"
      ...
    solution: |
      ...
```

The lab page renders the intro from the body, then a `<LabRunner>`: one editor whose code persists per lab in the progress store (`labs[<slug>]` with the step reached and the current code), a step list, Run tests for the current step, and Next step unlocked when all tests pass. Each passed step records a gradable completion `lab:<slug>/<n>`. `npm run labs` runs, for each step n, the solutions of steps 1 to n, then step n's tests and hidden tests, in local Python.

## 11. Mock loop

`/mock` builds a timed session from the bank: the reader picks a loop shape (a preset per role: applied AI engineer, ML infra, AI security, research engineer; each preset is a list of track and type weights with a stated source, or a plain note that the shape is Inferview's own, in `src/data/loops.ts`; ML infra weights training and inference, AI security weights security and safety, research engineer weights training and multimodal; `npm run validate` fails on a weight for an unknown track or type), the site picks problems deterministically from a seed the reader can share, shows them one at a time with a visible timer per problem, and ends with a self-graded summary that writes to the progress store. No server, no scoring claims beyond the reader's own ticks.
