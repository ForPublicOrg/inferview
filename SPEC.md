# Inferview build spec

The contract between the site scaffold and the content. Everything that writes code or content follows this file. Design decisions and reasons stay in `DESIGN.md`; product reasoning stays in `PLAN.md`.

## 1. Product in one paragraph

Inferview (inferview.io) is a free, open-source interview-prep site for AI engineering, written for experienced software engineers. Nine tracks in one order, each a set of modules with one lesson per module and a bank of problems. Every problem is a review card. A daily problem is derived from the date. Progress lives in the browser and, after Google sign-in, in the user's own Firestore document. No server of our own.

## 2. Stack (fixed)

- Astro 5, static output (`output: 'static'`), TypeScript, MDX content collections with Zod schemas (Astro 5 `glob` loader).
- No UI framework. Widgets are Astro components with vanilla TypeScript in `<script>` tags. No Tailwind: the stylesheet is `src/styles/inferview.css`, ported from `prototypes/inferview.css` (same tokens, IBM Plex, deep green accent).
- Fonts self-hosted with `@fontsource/ibm-plex-sans`, `@fontsource/ibm-plex-serif`, `@fontsource/ibm-plex-mono` (no Google Fonts request).
- Firebase JS SDK v10+ modular: Authentication (Google provider, popup with redirect fallback) and Firestore. Config from `PUBLIC_FIREBASE_*` env vars; `.env.example` lists them. These keys are public identifiers, not secrets; security comes from Firestore rules and the authorised-domain list.
- Pyodide loaded from the jsDelivr CDN on first use, only on code problems, inside a Web Worker.
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
scripts/validate-content.mjs   validates every lesson and problem against the schema without a full build
scripts/tokens.mjs         regenerates measured token data
src/
  styles/inferview.css
  content.config.ts        collections: lessons, problems
  content/
    lessons/<track>/<lesson-slug>.mdx
    problems/<track>/<id>.mdx
  data/tracks.ts           the nine tracks and their modules (slugs below)
  data/lists.ts            named lists (Core 100 is computed from `core: true`; crunch path is a fixed id list)
  lib/
    firebase.ts            lazy init, auth, firestore
    progress.ts            progress store: localStorage + Firestore sync, review scheduling, streak
    daily.ts               daily problem from the date
    schedule.ts            review intervals
  components/
    Nav.astro Footer.astro ThemeToggle.astro SignIn.astro
    Callout.astro Depth.astro Predict.astro SelfRate.astro Choices.astro CodeRunner.astro
    widgets/               TokenStrip.astro BpeStepper.astro SamplingLab.astro ... (one file per widget)
  layouts/Base.astro Lesson.astro Problem.astro
  pages/
    index.astro            landing (port of prototypes/index.html with live data)
    learn/index.astro      track list
    learn/[track]/index.astro
    learn/[track]/[lesson].astro
    problems/index.astro   catalog with client-side filters
    problems/[id].astro
    daily.astro            today's problem and the archive
    review.astro           cards due
    lists.astro            named lists
    account.astro          sign in/out, export/import JSON, delete data
    about.astro privacy.astro contribute.astro 404.astro
```

## 4. Tracks and modules (slugs are fixed)

| # | track slug | title | module slugs |
|---|---|---|---|
| 1 | foundations | LLM foundations for software engineers | tokens, embeddings, attention, sampling, training, model-landscape |
| 2 | apis | Building with model APIs | api-anatomy, prompting, structured-outputs, context-engineering, frameworks |
| 3 | evals | Evals and observability | eval-thinking, golden-sets, llm-judge, agent-evals, evals-in-ci |
| 4 | rag | Retrieval and RAG | retrieval-foundations, ingestion, hybrid-search, advanced-rag, debugging-rag |
| 5 | agents | Agents and protocols | agent-loop, tools-mcp-a2a, memory-state, multi-agent, coding-agents |
| 6 | safety | Security, safety and guardrails | threat-modeling, red-team, guardrails, hallucination |
| 7 | inference | Inference, serving and cost | inference-anatomy, batching, faster-cheaper, gateways-finops, operating |
| 8 | system-design | AI system design | framework, capacity, case-retrieval, case-agents, case-realtime |
| 9 | rounds | Coding rounds, behavioural and customer craft | hand-write, llm-app-coding, take-home-debug, ai-collab-coding, customer-craft, behavioural |

Track order on the site is the table order (evals sits third on purpose: see PLAN.md). Module detail (lesson bullets, widget ideas, questions) is in `research/brief.json` under `curriculum`, in the same order.

## 5. Lessons

Path: `src/content/lessons/<track>/<lesson-slug>.mdx`. URL: `/learn/<track>/<lesson-slug>`. One lesson per module in this build (slug = module slug), 1,500 to 2,500 words, covering the module's lesson bullets as sections.

Frontmatter (all required unless marked):

```yaml
title: Tokens and tokenization
track: foundations
module: tokens
order: 1                 # position inside the track
minutes: 22              # honest reading estimate: words / 200, plus widget time
summary: One plain sentence, no colon-led teaser.
prerequisites: []        # lesson slugs as "track/lesson"
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
8. `<SelfRate id="lesson:<track>/<slug>" />` at the end.

Components available in MDX (import from `../../../components/...`):

- `<Callout kind="interview|gotcha|aside">` text `</Callout>`
- `<Depth short="..." long="..." followups={[...]} />` or with slots `<Fragment slot="short">`, `long`, `followups`
- `<Predict id question tolerance answer unit>` for a numeric guess, children = the reveal text
- `<SelfRate id>` writes the rating to the progress store and schedules the review

## 6. Problems

Path: `src/content/problems/<track>/<id>.mdx`. URL: `/problems/<id>`. The id is `<trackcode>-<nnn>` with codes `fnd, api, evl, rag, agt, sfe, inf, sys, rnd` (example `agt-002`).

Frontmatter:

```yaml
id: agt-002
title: Agent loops forever
subtitle: find and fix            # optional
track: agents
module: agent-loop
type: debug                       # concept | estimate | debug | code | design | behavioural | mcq
difficulty: medium                # easy | medium | hard
seniority: [senior, staff]        # any of mid, senior, staff
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
code:                             # code: Python 3, runs in Pyodide (stdlib only, no torch)
  starter: |
    def top_p(logits, p): ...
  tests: |
    assert ...
  solution: |
    ...
```

Body sections, in this order (omit a section only when the type has no use for it):

- `## Question` the prompt as the interviewer would give it, with any trace, code or data.
- `## Hints` two or three, each one sentence, inside `<details>`.
- `## Answer` for concept/estimate/design/behavioural: a `<Depth>` block, then the worked answer. For debug/mcq: why the correct choice is correct and why each wrong one is tempting. For code: the reference solution explained.
- `## Follow-ups` what the interviewer asks next.
- `## Common mistakes`.

Gradable types (count for the daily problem and the streak): mcq, debug, code, estimate. Concept, design and behavioural are self-rated.

## 7. Bank size and coverage for this build

Per track: one lesson per module, and 14 to 18 problems that together cover every type that makes sense for the track (every track has at least one mcq, concept, estimate and debug; apis, rag, agents, inference and rounds have code problems; system-design has at least six design problems; rounds carries the behavioural problems). Core 100 counts: foundations 12, apis 11, rag 11, agents 12, evals 12, safety 10, inference 10, system-design 11, rounds 11.

Latest material that must be covered somewhere, with sources dated 2025 or 2026: Agent Skills (SKILL.md), MCP (current spec revision, transports, auth), A2A, LangGraph 1.x (state graphs, checkpointers, interrupts, human-in-the-loop), OpenAI Agents SDK and Responses API, Claude Agent SDK, agentic coding tools and their harnesses, computer use, prompt caching and context engineering, structured outputs and constrained decoding, reasoning models and test-time compute, GRPO and RL with verifiable rewards, LoRA/QLoRA, speculative decoding, continuous batching and PagedAttention, vLLM and SGLang, quantization formats, hybrid search and reranking, GraphRAG and late chunking, LLM-as-judge calibration, OpenTelemetry GenAI semantic conventions, OWASP Top 10 for LLM applications, prompt injection defences, and guardrail patterns.

## 8. Progress, auth and security

Progress document (same shape in localStorage key `inferview-progress` and Firestore `users/{uid}`):

```ts
type Progress = {
  v: 1
  streak: { count: number; last: string }            // last = YYYY-MM-DD of the last gradable completion
  items: Record<string, { s: 'seen' | 'done'; r?: 1|2|3|4; due?: string; n: number; at: number }>
}
```

- Keys in `items` are `lesson:<track>/<slug>` or `problem:<id>`. Ratings 1 to 4 map to review intervals 1, 3, 7, 21 days (`schedule.ts`); a lower rating resets the interval.
- Signed out: localStorage only. On sign-in: merge local and remote per item by the newer `at`, write the merge back to both, keep syncing on every change (debounced).
- Account page: export JSON, import JSON (validated against the shape, size capped), delete all data (Firestore document and local), sign out.
- `firestore.rules`: `users/{uid}` readable and writable only when `request.auth.uid == uid`; the write must match the shape above (v == 1, streak map, items map) and nothing else; no other collections.
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
