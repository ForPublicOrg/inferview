# Learning formats beyond read-then-quiz

Research angle: how the strongest technical learning products teach in 2025 and 2026, what evidence they give, and which formats Inferview can build on a static site with Pyodide and vanilla TypeScript.

Every source below was opened and read on 2026-10-28 unless the line says otherwise. Where a primary page refused the fetch (HTTP 403) the line says how the text was obtained. Vendor claims are labelled as vendor claims. Nothing here is a measured Inferview result.

---

## 1. What exists on Inferview today, and what is missing

### 1.1 Inventory (measured in the repository on 2026-10-28)

- 45 lessons, one per module. The committed layout is `src/content/lessons/<track>/<lesson>.mdx`; the working tree (uncommitted) has moved them to `src/content/lessons/<track>/<module>/overview.mdx`. Word counts run from 1,929 (`rounds/behavioural`) to 3,488 (`inference/faster-cheaper`). Every lesson has the same shape: hook, idea, one widget or one `<Predict>`, sourced numbers, code, one "In the room" question, "When this is wrong", `<SelfRate>`.
- 154 problems: 29 debug, 29 design, 27 code, 24 concept, 21 mcq, 20 estimate, 4 behavioural. Gradable (mcq, debug, code, estimate): 97. Self-rated: 57.
- 34 widgets in `src/components/widgets/`. One recorded trace exists (`src/data/traces/agt-002.ts`, synthetic, used by `AgentTrace.astro` with fault injection).
- `CodeRunner.astro` runs one file of Python in Pyodide v0.29.5 (`public/workers/pyodide-worker.js`) inside a Web Worker, with a 30 second timeout that calls `worker.terminate()`. There is no mock LLM, no multi-file filesystem, and no persisted code between visits.
- Review scheduling (`src/lib/schedule.ts`) uses fixed intervals of 1, 3, 7 and 21 days from a 1 to 4 self-rating, doubling to a 120 day cap. The unit of review is a whole lesson or a whole problem, never a single fact.
- In-progress SPEC changes in the working tree (uncommitted): lesson `kind` (lesson, teardown, playbook, paper), a `level` field (senior or staff), problem types `critique` and `workflow` with checklists, `src/content/labs/` with 5 to 10 step labs and a `<LabRunner>`, and a `/mock` timed loop page. None of these has content or components yet: `src/content/labs/` does not exist, and there is no `LabRunner`, `Diagram` or `Trace` component.

### 1.2 Format by format

| Format | What exists | What is missing |
|---|---|---|
| Read then quiz | Every lesson; 21 mcq problems; `<Predict>` asks for a number | Free-text recall before reveal. MCQ is recognition, and the evidence below favours short-answer retrieval with feedback. The three rounds lessons `rounds/ai-collab-coding`, `rounds/behavioural` and `rounds/customer-craft` have no `<Predict>` at all |
| Progressive build lab | Nothing. 27 single-file code problems (for example `agt-003` "Write a minimal agent loop", `api-008` "Write the tool-use loop") | A lab that grows one program over several steps; a deterministic mock LLM; multi-file state; persisted code; tests that check behaviour, not implementation |
| Teardown of a real system | Nothing as a format. `agents/coding-agents/overview.mdx` has a section "The harness is most of the product" and cites Anthropic's long-running harness post and OpenAI's "Unrolling the Codex agent loop" | A page per named system with a diagram, an annotated request trace, the permission model, cost, failure modes and a plain list of what is not public |
| Trace reading and incident replay | `agt-002` (synthetic looping-agent trace). `inference/operating/overview.mdx` tells the reader to write blameless postmortems but replays none. `safety/threat-modeling/overview.mdx` cites EchoLeak, the GitHub MCP and the Supabase MCP incidents in prose | Replays of real, publicly documented incidents with a timeline the reader steps through and must diagnose before the reveal. No replay of the Anthropic August to September 2025 quality postmortem or of the OpenAI GPT-4o sycophancy rollback, both of which are eval failures |
| Design critique | 29 design problems, all "design from blank, self-score" | The `critique` type is in the in-progress spec, but no critiques exist. Review work is mostly finding flaws in someone else's design, not designing from nothing |
| Workflow design | The `workflow` type is in the in-progress spec; none exist. `agents/agent-loop` and `agents/multi-agent` mention orchestrator patterns | Exercises that hand over a business process and constraints and grade the workflow (steps, state, retries, idempotency, approvals, budgets) against a checklist. This is the direct answer to "how do I create an AI workflow" |
| Security implementation | `safety/*` lessons cite OWASP 2026, the lethal trifecta and the Agents Rule of Two; problems such as `sfe-003` and `sfe-011` | A build-it lab for a guarded tool executor; a walkthrough of the six design patterns paper (arXiv 2506.08837, not cited anywhere in `src/content`); critiques that make the reader find the exfiltration path before the fix |
| Timed mock loop | Spec section 11 only | Loop presets with sourced round shapes; only 4 behavioural problems exist to fill a behavioural slot |
| Paper walkthrough | Spec `kind: paper` only | Walkthroughs that end in a runnable reproduction of the paper's key number |
| Annotated code reading | Not in the spec at all | Line-by-line reading of permissively licensed agent and serving code (licences checked in section 4) |
| Numbers-to-know cards | Numbers live inside 2,000-word lessons | Atomic cards (one fact, one source, one date) reviewed by the scheduler, typed recall, and an expiry date per card |
| Decision playbooks | Spec `kind: playbook`; concept problems such as "Prompt, RAG or fine-tune?" and "Skills, MCP tools or fine-tuning?" | Playbook pages with inputs, options, the conditions under which each wins, and a worked case |
| "What changed this quarter" | PLAN.md section 4 lists a monthly "what changed" digest as P0; nothing exists | Dated pages with a status per item and links to the lessons each change invalidates |

### 1.3 Why the first build reads as easy (evidence, not opinion)

- The reader is a senior engineer. Instruction designed for novices can stop helping, or hurt, people with more domain knowledge (the expertise reversal effect, Kalyuga, Ayres, Chandler and Sweller, Educational Psychologist 38(1), 2003). Explaining first and testing second is the novice order.
- Problem solving before instruction beat instruction first in a meta-analysis of 53 studies (Sinha and Kapur 2021), with the opposite result for young learners. For this audience the order should be: attempt, fail, then read.
- An MCQ quiz without feedback did no better than re-reading the same statements, and a short-answer quiz with feedback produced the best retention three days later (Kang, McDermott and Roediger 2007). Inferview's checks are mostly MCQ and numeric guesses.
- 57 of 154 problems are self-rated, and every lesson ends in a self-rating. Self-rating is not retrieval.

---

## 2. The material to add

### 2.1 What the strongest products do, and how good their evidence is

Each entry: what the product does, what evidence it publishes, and what Inferview should borrow. "No outcome data" means the page makes no measured claim about learning.

1. **Brilliant.** Interactive problems before explanation ("We don't teach how to do something before asking questions"), mixed practice across concepts, an AI tutor that "asks instead of tells". No outcome data on the about page; the only number is usage volume. Borrow: problem first, interleaved review. Source: https://brilliant.org/about/ (checked 2026-10-28).
2. **Execute Program.** Short lessons where every prompt is executed code; reviews start the next day and must be answered correctly; lessons unlock only after prerequisites are reviewed. Vendor numbers: 4,821 explanatory paragraphs and 3,751 live code examples, an average course of 289 examples, reviews under 10% of total time. No independent outcome data. Borrow: executable prompts as review items, prerequisite gating by review. Sources: https://www.executeprogram.com/why-ep and https://www.executeprogram.com/spaced-repetition (read through r.jina.ai because the pages render client-side; checked 2026-10-28); Andy Matuschak's notes, https://notes.andymatuschak.org/Execute_Program (checked 2026-10-28).
3. **CodeCrafters and build-your-own-x.** Rebuild a real system (Redis, Git, SQLite, Kafka, a shell) in stages; `git push` runs the stage's tests. It now has "Build your own Claude Code" (beta, 13 stages): communicate with the LLM, advertise and execute a read tool, the agent loop, write and bash tools, then a skills track ending in "Run a skill in a subagent". The page does not say whether tests use a mock model. Borrow: the stage list as a lab skeleton for a harness. Sources: https://codecrafters.io/ and https://app.codecrafters.io/courses/claude-code/overview (checked 2026-10-28); https://github.com/codecrafters-io/build-your-own-x (no licence reported by the GitHub API, checked 2026-10-28).
4. **Exercism.** An exercise is complete when the implementation passes all the tests, which unlocks more; human mentors on request; "85 programming languages" on the getting-started page (the about page menu says "65+"). Borrow: tests as the definition of done. Mentoring needs people, so use GitHub Discussions instead. Source: https://exercism.org/docs/using/getting-started (read through r.jina.ai, checked 2026-10-28).
5. **NeetCode.** An ordered list where each problem builds on earlier ones; the 250 list is the 150 plus 100. Borrow: the finite ordered path (already in PLAN). Source: https://neetcode.io/courses/lessons/how-to-use-neetcode-effectively (via search result, checked 2026-10-28).
6. **Hello Interview.** Guided Practice walks a system design question one step at a time with per-step rubric feedback from an LLM reading the whiteboard; Live Practice is a separate AI mock. Counts conflict across its own pages (66 Guided Practice problems on the homepage, 36 on a checkout page). No outcome data. Borrow: step-by-step design with feedback per step, which a static site can do with a checklist per step. Sources: https://www.hellointerview.com/ (checked 2026-10-28); https://www.hellointerview.com/practice (via search, checked 2026-10-28).
7. **ByteByteGo GenAI System Design Interview.** A seven-step framework (clarify requirements, frame as an ML task, data, model, evaluation, overall system design, deployment and monitoring) and ten cases: Smart Compose, Translate, a ChatGPT-style assistant, image captioning, RAG, and five image or video generation cases. No agent, harness or workflow case. Note the gap Inferview can own. Source: https://bytebytego.com/courses/genai-system-design-interview/introduction-and-overview (checked 2026-10-28).
8. **Explorable explanations (Bret Victor, Bartosz Ciechanowski, 3Blue1Brown).** Victor's 2011 essay argues for text as "an environment to think in", with reactive documents and explorable examples. Ciechanowski publishes a few long interactive articles a year (Moon, Dec 2024; Airfoil, Feb 2024; Bicycle, Mar 2023). 3Blue1Brown's animation engine manim is MIT licensed. The best evidence review (Hohman, Conlen, Heer and Chau, Distill 2020) says there is "limited empirical evaluation of the effectiveness of interactive articles" and that authoring one "is closer to building a website than writing a blog post". Borrow sparingly: only where a mechanism has a continuous parameter. Sources: https://worrydream.com/ExplorableExplanations/ (via search), https://ciechanow.ski/archives/, https://github.com/3b1b/manim, https://distill.pub/2020/communicating-with-interactive-articles/ (all checked 2026-10-28).
9. **Karpathy's code-first walkthroughs.** micrograd: an autograd engine and a neural net library of about 100 and 50 lines (MIT). nanoGPT: about 300 lines of training loop and 300 of model, reproducing GPT-2 124M on OpenWebText in about 4 days on one 8xA100 40GB node to a loss of about 2.85; the README now calls it "very old and deprecated" and points to nanochat. llm.c: a CPU fp32 reference of "~1,000 lines of clean code in one file" (MIT). nanochat: "the simplest experimental harness for training LLMs", a GPT-2 capability model for about $48 (about 2 hours of an 8xH100 node), MIT. Borrow: the smallest complete working system, read top to bottom. Sources: https://github.com/karpathy/micrograd, https://github.com/karpathy/nanoGPT, https://github.com/karpathy/llm.c, https://github.com/karpathy/nanochat (checked 2026-10-28).
10. **MIT Missing Semester, 2026 edition.** Nine lectures, January 12 to 23, 2026, including a new "Agentic Coding" lecture whose exercises include: do one task four ways (by hand, autocomplete, inline chat, agent); create an AGENTS.md, a skill and a subagent and decide when to use each; run an agent in autonomous mode only inside a VM or container. Licence CC BY-NC-SA (non-commercial, so its text cannot be copied into CC BY-SA content). Borrow: exercise lists at the end of each unit that require doing, not answering. Sources: https://missing.csail.mit.edu/ and https://missing.csail.mit.edu/2026/agentic-coding/ (checked 2026-10-28).
11. **Advent of Code.** From 2025: 12 puzzles instead of 25, the global leaderboard removed, and the FAQ answers "Should I use AI to solve Advent of Code puzzles?" with "No". Borrow: a short seasonal calendar with private, shareable boards; no global leaderboard. Sources: https://adventofcode.com/2025/about (checked 2026-10-28); the 12-puzzle count and the October 22, 2025 announcement date via https://en.wikipedia.org/wiki/Advent_of_Code (secondary, checked 2026-10-28).
12. **Kaggle and Google 5-Day AI Agents Intensive (November 2025).** Whitepapers, zero-setup notebooks, livestreams and an optional capstone; Google reports "over 1.5 million learners", 11,000+ capstone submissions, 3.3 million notebook views, and no completion figure. Borrow: pair each reading with a notebook the reader must run. Source: https://blog.google/innovation-and-ai/technology/developers-tools/ai-agents-intensive-recap/ (checked 2026-10-28).
13. **Jupyter in the browser.** JupyterLite runs JupyterLab "entirely in the browser" with a Pyodide kernel and "Requires no dedicated application server" (BSD-3-Clause). nbgrader creates and grades notebook assignments. Borrow: the notebook cell model for labs; do not embed JupyterLab itself (too heavy for a lesson page). Sources: https://jupyterlite.readthedocs.io/en/latest/, https://nbgrader.readthedocs.io/en/stable/ (checked 2026-10-28).
14. **Anki and FSRS.** Anki has offered FSRS alongside its older algorithm since 23.10; FSRS needs "fewer reviews than with Anki's default algorithm to achieve the same retention level", with no number given; default desired retention is 90%, and workload "increases drastically" as it nears 100%. The open benchmark (about 10,000 users, about 727 million reviews) reports log loss, calibration RMSE and AUC per algorithm. ts-fsrs is an MIT TypeScript implementation. Borrow: replace fixed 1, 3, 7, 21 day intervals with FSRS and let the reader choose desired retention. Sources: https://docs.ankiweb.net/faqs/what-spaced-repetition-algorithm, https://docs.ankiweb.net/deck-options.html, https://github.com/open-spaced-repetition/srs-benchmark, https://github.com/open-spaced-repetition/ts-fsrs (checked 2026-10-28).
15. **Duolingo.** Half-life regression estimates how long each item stays in memory; the ACL 2016 paper reports error reduced by 45%+ against baselines and daily engagement up 12% in an operational study. Engagement is not learning. Borrow: per-item memory estimates, not per-lesson ones. Source: https://aclanthology.org/P16-1174.pdf (checked 2026-10-28).
16. **Mock-interview services.** interviewing.io's survey analysis (158 respondents for Google) found the number of its mocks "had the clearest association with interview success", with a modelled pass chance of 69% at 2 mocks and 76% at 3; the authors flag selection bias, and the "5 or more" finding is about real interviews, not mocks. No date on the page. Borrow: timed, full-loop practice; claim nothing about pass rates. Source: https://interviewing.io/blog/how-know-ready-interview-faang (checked 2026-10-28).
17. **Paper-reading clubs.** Papers We Love lists 53 chapters and a repository of papers; a session is a speaker presenting one paper. Source: https://paperswelove.org/ (checked 2026-10-28).
18. **Incident post-mortem learning (Google SRE).** Teams run "postmortem reading clubs"; new SREs do the "Wheel of Misfortune", in which "a previous postmortem is reenacted with a cast of engineers playing roles"; Google teaches a class called "Reverse Engineering a Production Service (without help from its owners)"; and "Any type of training is better than random tickets and interrupts". Sources: https://sre.google/sre-book/postmortem-culture/ and https://sre.google/sre-book/accelerating-sre-on-call/ (checked 2026-10-28).
19. **Code Reading Club.** A facilitator brings a short piece of code and "guides the group through a series of exploratory exercises", "a bit like a book club, and a bit like an escape room". Source: https://codereading.club/ (checked 2026-10-28).
20. **LeetCode contests.** Not verified: leetcode.com returned HTTP 403 to the fetch on 2026-10-28. Treat any contest or rating detail as unverified.

### 2.2 Learning-science evidence that should shape the formats

| Finding | What it implies for Inferview | Source (checked 2026-10-28) |
|---|---|---|
| Practice testing and distributed practice rated high utility; rereading and highlighting among five rated low | Every format must make the reader retrieve or produce something, spaced over days | Dunlosky et al. 2013, abstract at https://pubmed.ncbi.nlm.nih.gov/26173288/ |
| Short-answer quiz with feedback beat MCQ and re-reading on a test 3 days later; MCQ without feedback did not differ from re-reading | Add typed short answers before reveal; always show feedback | Kang, McDermott, Roediger 2007, https://www.gwern.net/docs/spaced-repetition/2007-kang.pdf |
| Active learning: exam scores up 0.47 SD; failure 21.8% vs 33.8% under lecture | Support for doing over reading (university STEM, not professionals) | Freeman et al. 2014, https://pmc.ncbi.nlm.nih.gov/articles/PMC4060654/ |
| Problem solving before instruction: Hedges' g 0.36 over 53 studies and 166 comparisons; grades 2 to 5 favoured instruction first | Attempt first, then teach, for adults | Sinha and Kapur 2021, abstract via https://www.x-mol.com/paper/1406031499744456704 (the publisher refused the fetch) |
| Guidance that helps novices can stop helping experts | Do not open senior content with worked examples | Kalyuga et al. 2003, https://typeset.io/pdf/the-expertise-reversal-effect-5y3mqyx7oo.pdf |
| Predicting data and self-explaining the gap improved recall and comprehension | Keep predict-then-reveal; add "explain the gap" after the reveal | Kim, Reinecke, Hullman, CHI 2017, https://idl.uw.edu/papers/explaining-the-gap (via search) |
| Interactive articles: "limited empirical evaluation"; costly to author | Build widgets only where a parameter matters | Hohman et al. 2020, https://distill.pub/2020/communicating-with-interactive-articles/ |
| Deliberate practice explained under 1% of performance variance in professions | Do not promise mastery from drills | Macnamara, Hambrick, Oswald 2014, figures reported in https://pmc.ncbi.nlm.nih.gov/articles/PMC4101876/ |

### 2.3 Formats to build (static site, Pyodide in a worker, vanilla TypeScript)

#### F1. Progressive build lab with tests

- **What it is.** One program grown over 5 to 10 steps; each step adds one capability and its tests; the next step unlocks when the tests pass (the in-progress SPEC section 10 defines the schema).
- **Why it teaches better than a lesson.** It forces production, not recognition, and it is spaced by construction because each step depends on code written earlier. CodeCrafters and Exercism use tests as the definition of done. The Missing Semester agentic-coding exercises and the CodeCrafters Claude Code stage list show that the harness itself is now a standard thing to build.
- **Inferview examples.**
  - *Build a mini agent harness* (8 steps): the loop with a step cap; tool schema and dispatch; a permission gate that parses the whole shell command, not the first word (ties to the existing allowlist problem); a token and dollar budget; context compaction when the transcript passes a budget; a progress file and feature list that survive a "new session" (the Anthropic long-running pattern); a sensor step that runs tests and feeds failures back (Böckeler's feedback controls); a skill loader that reads a SKILL.md and adds it only when selected.
  - *Build an eval harness* (7 steps): load a golden set; a binary judge against a scripted mock; TPR and TNR on labelled data; correct the observed pass rate; pass^k from repeated trials; a regression gate with a significance check; a report.
  - *Build a RAG pipeline with failure-stage tests* (7 steps): chunker, BM25, a dense stub with fixed vectors, RRF, a reranker stub, a citation check, one test per failure stage.
  - *Build a durable workflow engine* (8 steps): steps as functions; a checkpoint store; idempotency keys per side-effecting step; retries with backoff and a retry budget; a human-approval interrupt that suspends and resumes from the checkpoint; compensation on failure; a cost ledger; a replay test that kills the process mid-run.
  - *Build a guarded tool executor* (6 steps, security): label every value with its origin; refuse a tool call that combines untrusted input, private data and an outbound channel (Rule of Two); an egress allowlist; plan-then-execute so untrusted data cannot change the plan; a Dual LLM quarantine; an attack suite that must all fail.
- **What it needs from the build.** A deterministic mock LLM in Python (a scripted policy keyed on the last message, plus fault modes), shipped as a module the worker loads; a multi-file in-memory filesystem (Pyodide's Emscripten FS); `<LabRunner>` with persisted code per lab (`lab:<slug>`); tests written against behaviour and outputs, never internal names, because OpenAI's audit of SWE-bench Verified found at least 59.4% of an audited subset had tests that "reject functionally correct submissions"; a visible time estimate per step; worker restart on timeout (already done).

#### F2. Teardown of a real system with an annotated trace

- **What it is.** One page per named system, from public sources only: what it is, a diagram, one request traced step by step with annotations, context strategy, tools and permission model, cost and latency, failure modes, and a list of what is not public.
- **Why it teaches better.** It is the SRE book's "reverse engineering a production service" class in reading form, and it gives seniors what design rounds probe: how a real system made its trade-offs. It is also where "harness engineering first" starts.
- **Inferview examples.** OpenAI Codex CLI's agent loop (Apache-2.0 code plus OpenAI's "Unrolling the Codex agent loop" post, already cited in the repo); Anthropic's two-agent long-running harness (the initializer writes `init.sh`, a JSON feature list of 200+ features all marked failing, a progress file and a first commit; coding agents only flip `passes`); OpenAI's harness-engineering repository (an AGENTS.md of about 100 lines as a table of contents, a `docs/` system of record checked by linters and a doc-gardening agent, per-worktree observability queried with LogQL and PromQL); mini-swe-agent (about 100 lines, bash only, linear history, `subprocess.run` per action); vLLM's request path for the inference track.
- **What it needs.** `<Diagram>` and `<Trace>` components (already named in the in-progress SPEC); one trace JSON format close to the OpenTelemetry GenAI conventions so teardowns, replays and trace-reading problems share data; a "not public" section that the validator requires.

#### F3. Trace reading and incident replay

- **What it is.** The reader steps through a recorded timeline (alerts, user reports, deploys, metrics, trace excerpts) and must commit to a hypothesis at marked points before the next event appears; the reveal is the published postmortem. A variant hands over 30 traces and asks for open coding and failure categories before showing the answer key.
- **Why it teaches better.** It is the Wheel of Misfortune, where "a previous postmortem is reenacted". It trains diagnosis under ambiguity, which is what debug rounds test, and the reveal comes from the operator's own account.
- **Inferview examples.**
  - Anthropic, August to September 2025: three overlapping bugs (context-window routing that grew from 0.8% of Sonnet 4 requests to 16% at the worst hour; TPU output corruption; an approximate top-k miscompilation). Lesson: noisy evals and privacy limits slowed detection.
  - OpenAI, GPT-4o update of April 25, 2025, rolled back from April 28: offline evals and A/B tests looked good, expert testers said it "felt" off, and there was no deployment eval for sycophancy. Lesson: the launch gate.
  - GitHub MCP toxic agent flow (Invariant Labs, May 26, 2025) and the Supabase MCP with a service_role key (July 2025): trifecta replays.
  - Amazon Q Developer extension 1.84.0 (AWS-2025-015, July 23, 2025): an over-scoped GitHub token in CodeBuild let an attacker ship code in a release.
  - Replit agent deleting a production database during a code freeze (July 2025): accounts conflict on backups, so the replay must show both.
- **What it needs.** A timeline player (an extension of `AgentTrace`), a hypothesis prompt with free text and a commit button, a reveal keyed to the published source, and a rule that every event in a replay carries its source URL. Gradable variant: a debug-type pick among hypotheses at each checkpoint.

#### F4. Design critique

- **What it is.** A design (diagram, config, prompt, tool list or code) with planted flaws; the reader lists them in free text, then opens a checklist and ticks what they found (the `critique` type in the in-progress SPEC).
- **Why it teaches better.** Review is how seniors spend their time, and critique removes the blank-page problem of the 29 existing design problems. Writing the list before seeing the checklist is short-answer retrieval with feedback.
- **Inferview examples.** An email agent that reads, summarizes and sends (fix with the Rule of Two or one of the six patterns); a coding agent with an org-wide token that reviews public issues; a CI pipeline where the agent can edit its own tests; an AGENTS.md of 1,000 lines; a RAG design that mixes two embedding models in one index; a launch plan that ships on A/B wins alone.
- **What it needs.** The checklist component; a free-text box saved locally; the number of planted flaws shown up front; a rule that each checklist item cites a source.

#### F5. Workflow-design exercise with a checklist grader

- **What it is.** A business process plus constraints (volume, latency, cost cap, approval rules, data sensitivity). The reader writes the workflow: steps, which steps are LLM calls, state and checkpoints, retries and idempotency, human approvals, budgets, evals and rollout. Graded against a checklist; an optional "simulate" button runs the reader's step list through a small JSON workflow interpreter with injected faults.
- **Why it teaches better.** It is the form in which "build an AI workflow" is actually asked (Scale AI's insurance-claims agent and Sierra's third-party integration prompt, both in section 3). Fault simulation turns a self-rated answer into a partly graded one.
- **Inferview examples.** Refund approvals under a dollar limit; invoice extraction into an ERP; a PR review bot; on-call triage; a research report; a KYC document check. Each asks first whether a fixed workflow or an agent is right, using Anthropic's "simplest solution possible" rule and its workflow patterns.
- **What it needs.** A JSON workflow schema (steps, edges, retry policy, approval nodes, budget); a TypeScript interpreter with fault injection (a tool 500, a timeout, a duplicate delivery, a judge disagreement); the checklist component.

#### F6. Timed mock loop

- **What it is.** SPEC section 11: a seeded, timed run of problems shaped like a real loop, ending in a self-graded summary.
- **Why it teaches better.** Time pressure and switching between round types are what full mocks add. The mock-interview data is observational, so claim nothing about pass rates.
- **Inferview examples.** Presets with sourced shapes: Meta's AI-enabled coding round (a multi-file codebase, three phases: fix bugs, implement, optimize; reported by Hello Interview); Canva's AI-Assisted Coding round (an ambiguous product problem, AI expected); a no-AI preset that follows Anthropic's own guidance for live interviews.
- **What it needs.** `src/data/loops.ts` with a source URL per preset; at least 12 behavioural problems so a behavioural slot does not repeat; an "AI allowed" flag per slot.

#### F7. Paper walkthrough with a runnable number

- **What it is.** The problem, the mechanism in engineering terms, the key number, a Pyodide cell that reproduces a toy version of that number, what changed in practice, and what to say in an interview.
- **Why it teaches better.** Reproducing the number is production; reading the abstract is not.
- **Inferview examples.** "Design Patterns for Securing LLM Agents against Prompt Injections" (arXiv 2506.08837, June 2025): the six patterns, each with a toy executor. "Why Do Multi-Agent LLM Systems Fail?" (MAST, arXiv 2503.13657, already cited in `agt-017`): code 20 traces with the taxonomy. Half-life regression (ACL 2016) for the review system itself.
- **What it needs.** The `kind: paper` skeleton (in progress) and a rule that each walkthrough states the paper's licence before reproducing figures.

#### F8. Annotated code reading

- **What it is.** A permissively licensed file shown with margin notes; the reader answers "what happens if" questions about specific lines before the notes reveal.
- **Why it teaches better.** Code Reading Club starts from the point that developers read more code than they write and are rarely taught to read; the SRE reverse-engineering class is the same idea for systems.
- **Inferview examples.** mini-swe-agent's agent class (MIT); Codex CLI's tool approval code (Apache-2.0); LangGraph checkpointer interfaces (MIT); the vLLM scheduler (Apache-2.0); micrograd's engine (MIT).
- **What it needs.** A code viewer with line anchors and notes; a pinned commit hash per excerpt; licence and copyright notice beside every excerpt; no excerpts from repositories without a licence.

#### F9. Numbers-to-know cards

- **What it is.** One fact per card with a source URL, a date checked and an expiry date; the reader types the number or picks the order of magnitude; the scheduler reviews cards, not lessons.
- **Why it teaches better.** Spaced, typed retrieval is the best-supported technique in section 2.2; Execute Program and Anki review small items, not chapters.
- **Inferview examples.** KV-cache bytes per token for a named model; MCP's current revision date and deprecation window; the incident numbers in section 4.
- **What it needs.** A `cards` collection with `source`, `checked`, `expires`; FSRS state per item (new fields in the progress shape and a Firestore rules change); a stale-card report in `scripts/validate-content.mjs`.

#### F10. Decision playbook

- **What it is.** The decision, the inputs that change it, the options and when each wins, a worked case, and what to measure afterwards.
- **Why it teaches better.** Staff rounds probe judgment under constraints; a playbook gives a structure that the critiques and workflow exercises then test.
- **Inferview examples.** Workflow or agent; which prompt-injection pattern for which task; computational or inferential control for a given risk (Böckeler); ship or hold when offline evals pass and expert testers say "off" (the sycophancy case).
- **What it needs.** The `kind: playbook` skeleton (in progress) and a link from each playbook to at least one critique and one workflow problem.

#### F11. "What changed this quarter" dated pages

- **What it is.** One page per quarter listing changes with a date, a status (draft, current, deprecated, removed) and the Inferview pages each change affects.
- **Why it teaches better.** Interviewers ask about current practice, and the field moves faster than lessons are revised. MDN's Baseline labels are a working model: a status with a dated rule.
- **Inferview examples (seed items for 2026 Q3 and Q4).** MCP current revision 2026-07-28 (per-request version negotiation, `server/discover`); the OpenTelemetry GenAI conventions moved to their own repository; OpenAI stopped reporting SWE-bench Verified (February 2026); "harness engineering" as a named practice (OpenAI, February 2026; martinfowler.com, April 2026); Hamel Husain and Shreya Shankar's evals FAQ revised in September 2026.
- **What it needs.** A `changes` collection with `date`, `status`, `source` and `affects: [lesson ids]`; a build check that flags lessons whose `updated` date is older than an affecting change.

#### F12. Predict, explain the gap, then reveal (an upgrade to every lesson)

- **What it is.** Keep `<Predict>`, then ask for one sentence on why the guess was off before the explanation shows.
- **Why.** Kim et al. 2017 found prediction plus self-explanation improved recall; Kang et al. 2007 favour short answers with feedback.
- **What it needs.** A text box in `<Predict>`, stored locally and never sent anywhere.

Rejected or deferred: a global leaderboard (Advent of Code removed its own in 2025, and there is no server); human mentoring (no people; GitHub Discussions instead); full JupyterLab embeds (page weight); new widgets for mechanisms without a continuous parameter (Hohman's cost warning).

### 2.4 Topic list

Kind is lesson, teardown, lab, playbook or paper, plus critique or workflow problem sets where marked.

1. **Build a mini agent harness** (lab, harness track). The loop, tools, permission gate, budget, compaction, session-surviving progress, a test sensor and a skill loader, against a scripted mock model. Sources: https://app.codecrafters.io/courses/claude-code/overview; https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents; https://martinfowler.com/articles/harness-engineering.html; https://missing.csail.mit.edu/2026/agentic-coding/ (all checked 2026-10-28).
2. **Anatomy of a long-running coding harness** (teardown). Initializer and coding agents, the JSON feature list, the progress file, browser testing "as a human user would", and what still failed (browser-native alert modals). Source: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents (Nov 26, 2025; checked 2026-10-28).
3. **Harness engineering: the repository as the system of record** (teardown). AGENTS.md as a 100-line map, `docs/` checked by linters, plans checked in, a bootable app and observability stack per worktree, agent-to-agent review loops, and the stated numbers. Source: https://openai.com/index/harness-engineering/ (HTTP 403 to direct fetch; read through r.jina.ai on 2026-10-28).
4. **Guides and sensors: a control map for agent harnesses** (playbook). Feedforward and feedback controls, computational and inferential, the maintainability, architecture-fitness and behaviour harnesses, and where each check runs in the lifecycle. Source: https://martinfowler.com/articles/harness-engineering.html (2 April 2026; checked 2026-10-28).
5. **Workflow or agent, and which workflow** (playbook plus workflow problem set). Prompt chaining, routing, parallelization, orchestrator-workers, evaluator-optimizer, autonomous agents; the "simplest solution possible" rule; tool design as an interface ("Poka-yoke your tools"). Source: https://www.anthropic.com/engineering/building-effective-agents (Dec 19, 2024; checked 2026-10-28).
6. **Build a durable workflow engine** (lab). Checkpoints, idempotency keys, retry budgets, approval interrupts, compensation, replay after a crash. Sources: https://www.anthropic.com/engineering/building-effective-agents; https://github.com/langchain-ai/langgraph (MIT); https://github.com/temporalio/temporal (MIT) (all checked 2026-10-28).
7. **Build an eval harness** (lab). Golden set, binary judge, TPR and TNR, corrected pass rate, pass^k, a regression gate. Sources: https://hamel.dev/blog/posts/evals-faq/; https://github.com/sierra-research/tau2-bench (MIT) (checked 2026-10-28).
8. **Build a RAG pipeline with failure-stage tests** (lab). One test per failure stage so the reader learns to localize. Sources: the existing `rag/*` lesson sources; https://www.techinterview.org/post/3233476824/ai-engineer-interview-rag-agents-evals/ for the take-home shape (checked 2026-10-28).
9. **Build a guarded tool executor** (lab, security). Origin labels, Rule of Two enforcement, an egress allowlist, plan-then-execute, Dual LLM, an attack suite. Sources: https://ai.meta.com/blog/practical-ai-agent-security/ (Oct 31, 2025); https://arxiv.org/abs/2506.08837; https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/ (all checked 2026-10-28).
10. **Securing an agent: choose the pattern for the task** (playbook, security). Action-Selector, Plan-Then-Execute, LLM Map-Reduce, Dual LLM, Code-Then-Execute, Context-Minimization, and the utility each gives up. Source: https://arxiv.org/html/2506.08837 (checked 2026-10-28).
11. **Design Patterns for Securing LLM Agents against Prompt Injections** (paper). A walkthrough with a toy executor per pattern. Source: https://arxiv.org/abs/2506.08837 (submitted June 10, 2025, revised June 27, 2025; checked 2026-10-28).
12. **Trifecta critiques** (critique problem set). GitHub MCP, Supabase MCP, an email agent, a browser agent; each asks for the exfiltration path first. Sources: https://invariantlabs.ai/blog/mcp-github-vulnerability; https://simonwillison.net/2025/Jul/06/supabase-mcp-lethal-trifecta/ (via search); https://ai.meta.com/blog/practical-ai-agent-security/ (checked 2026-10-28).
13. **Replay: three bugs, one month of degraded quality** (incident replay, evals or inference track). Source: https://www.anthropic.com/engineering/a-postmortem-of-three-recent-issues (Sep 17, 2025; checked 2026-10-28).
14. **Replay: the sycophancy rollback and the launch gate** (incident replay, evals track). Source: https://openai.com/index/expanding-on-sycophancy/ (HTTP 403 to direct fetch; read through r.jina.ai on 2026-10-28).
15. **Replay: an over-scoped CI token ships into an AI coding extension** (incident replay, safety track). Source: https://aws.amazon.com/security/security-bulletins/AWS-2025-015/ (checked 2026-10-28).
16. **Replay: an agent deletes production during a code freeze** (incident replay, agents track), with the conflicting accounts side by side. Sources (secondary, via search, checked 2026-10-28): https://www.theregister.com/2025/07/22/replit_saastr_response/ and https://incidentdatabase.ai/es/reports/5577/. Read the primary posts by Jason Lemkin and Amjad Masad before writing.
17. **Reading mini-swe-agent** (teardown plus annotated code reading). A 100-line agent that only uses bash; why linear history and `subprocess.run` make it debuggable. Source: https://github.com/SWE-agent/mini-swe-agent (MIT; checked 2026-10-28).
18. **Benchmarks you can no longer quote** (lesson, evals track). SWE-bench Verified's flawed tests and contamination, and what to say instead in an interview. Source: https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/ (read through r.jina.ai on 2026-10-28).
19. **AI-assisted and AI-enabled coding rounds** (update to `rounds/ai-collab-coding` plus mock presets). Canva's format and its failure patterns ("AI Showcase", "Feature Marathon", "Hands-Off"); Meta's three-phase round as reported; Anthropic's own rule for live rounds. Sources: https://canva.dev/blog/engineering/yes-you-can-use-ai-in-our-interviews (June 11, 2025); https://www.canva.dev/blog/engineering/ai-interview-success/ (Oct 20, 2025); https://hellointerview.com/blog/meta-ai-enabled-coding; https://www.anthropic.com/candidate-ai-guidance (all checked 2026-10-28).
20. **Numbers deck v1** (cards). The facts in section 4, each with an expiry date. Sources: as listed in section 4.
21. **What changed, 2026 Q3 and Q4** (dated page). The seed items in F11. Sources: https://modelcontextprotocol.io/specification/versioning; https://github.com/open-telemetry/semantic-conventions-genai; https://opentelemetry.io/docs/specs/semconv/gen-ai/; https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/ (checked 2026-10-28).
22. **Error analysis on 30 traces** (lab variant in Pyodide, evals track). Open coding, then axial coding, then counts, against an answer key. Sources: https://hamel.dev/blog/posts/evals-faq/ (checked 2026-10-28); https://arxiv.org/abs/2503.13657 (already cited in `agt-017`).
23. **How the review system works and why** (short lesson for the about page). FSRS, desired retention, typed answers. Sources: https://docs.ankiweb.net/deck-options.html; https://aclanthology.org/P16-1174.pdf; https://www.gwern.net/docs/spaced-repetition/2007-kang.pdf (checked 2026-10-28).

---

## 3. Interview questions collected

Types use Inferview's types (concept, estimate, debug, code, design, behavioural, mcq, critique, workflow; "lab" marks a build that maps to a lab). "Reported" means the source says the question was asked; every reported source here is a third-party aggregation of candidate reports unless marked as the company's own page, so treat company names as reported, not confirmed. "Derived" means an Inferview prompt written from a primary source; it has no company. All checked 2026-10-28.

| # | Question | Type | Level | Source | Company named by source |
|---|---|---|---|---|---|
| 1 | Design an inference batching system for a single GPU handling up to 100 inputs per batch while users wait synchronously | design | senior | https://www.aced.io/blog/ai-engineer-interview-questions | Anthropic (reported) |
| 2 | Design an end-to-end batching system for LLM queries | design | staff | https://www.aced.io/blog/ai-engineer-interview-questions | Anthropic (reported) |
| 3 | Design an insurance-claims agent that ingests claims and outputs an approval decision using RAG | workflow | senior | https://www.aced.io/blog/ai-engineer-interview-questions | Scale AI (reported) |
| 4 | Build your own customer service AI agent for a hypothetical outdoors company | code (lab) | senior | https://www.aced.io/blog/ai-engineer-interview-questions | Sierra (reported) |
| 5 | Investigate and mitigate a model that gives confident but factually wrong answers in high-risk contexts | debug | staff | https://www.aced.io/blog/ai-engineer-interview-questions | Anthropic (reported) |
| 6 | Design an AI system that integrates with a third-party company's data and workflows | workflow | staff | https://www.aced.io/blog/ai-engineer-interview-questions | Sierra (reported) |
| 7 | Design a document processing pipeline that ingests and indexes large volumes of heterogeneous documents for LLM use | design | senior | https://www.aced.io/blog/ai-engineer-interview-questions | Databricks (reported) |
| 8 | Design a file uploader for an AI chat app that handles large multimodal uploads and feeds them into a model's context | design | senior | https://www.aced.io/blog/ai-engineer-interview-questions | xAI (reported) |
| 9 | Debug and extend a Python codebase to add an async exponential retry mechanism with timeouts and backoff | code | senior | https://www.aced.io/blog/ai-engineer-interview-questions | Sierra (reported) |
| 10 | Convert profiler stack samples into a trace, given example inputs and outputs | code | senior | https://www.aced.io/blog/ai-engineer-interview-questions | Anthropic (reported) |
| 11 | Design and implement an in-memory key-value store with set, transactional begin, commit, and abort | code | senior | https://www.aced.io/blog/ai-engineer-interview-questions | OpenAI, xAI (reported) |
| 12 | How do you catch regressions when you change a prompt or swap a model? | concept | senior | https://www.aced.io/blog/ai-engineer-interview-questions | none |
| 13 | What does LLM-as-a-judge do, and what are its failure modes? | concept | senior | https://www.aced.io/blog/ai-engineer-interview-questions | none |
| 14 | How would you define success metrics for an AI-oriented feature or product? | concept | senior | https://www.aced.io/blog/ai-engineer-interview-questions | Perplexity (reported) |
| 15 | Tell me about a time you were confident in a solution and later realized it was wrong | behavioural | senior | https://www.aced.io/blog/ai-engineer-interview-questions | Anthropic (reported) |
| 16 | You have a 200-page PDF and a question. What happens between enter and the answer? | concept (teardown-shaped) | senior | https://www.techinterview.org/post/3233476824/ai-engineer-interview-rag-agents-evals/ | none |
| 17 | Here are 50 markdown docs. Build a Q&A system, an eval set of 20 questions, and report recall@5 and faithfulness | code (lab, take-home) | senior | https://www.techinterview.org/post/3233476824/ai-engineer-interview-rag-agents-evals/ | none |
| 18 | This agent loops forever on some inputs. Find out why and fix it | debug | senior | https://www.techinterview.org/post/3233476824/ai-engineer-interview-rag-agents-evals/ | none |
| 19 | How do you cap tool calls and spend per request so one runaway session can't cost fifty dollars? | workflow | senior | https://www.techinterview.org/post/3233476824/ai-engineer-interview-rag-agents-evals/ | none |
| 20 | How do you trace a multi-step run so you can see which tool call went sideways? | concept | senior | https://www.techinterview.org/post/3233476824/ai-engineer-interview-rag-agents-evals/ | none |
| 21 | What happens when the model asks to run an action it shouldn't? | critique | senior | https://www.techinterview.org/post/3233476824/ai-engineer-interview-rag-agents-evals/ | none |
| 22 | Here's an agent that can read and send email. Show me an indirect injection that exfiltrates a user's inbox to an attacker | critique | senior | https://www.techinterview.org/post/3233477256/prompt-injection-llm-security-interview-questions/ | none |
| 23 | A product team wants to give the support agent write access to the payments database to speed up refunds. Talk them out of it, or tell me the guardrails that would make it acceptable | design (playbook) | staff | https://www.techinterview.org/post/3233477256/prompt-injection-llm-security-interview-questions/ | none |
| 24 | You have five minutes with this toy agent. Get it to run a shell command it wasn't meant to | code (lab, red team) | senior | https://www.techinterview.org/post/3233477256/prompt-injection-llm-security-interview-questions/ | none |
| 25 | What happens to the model's answer after the model is finished with it? (output handling) | concept | senior | https://www.techinterview.org/post/3233477256/prompt-injection-llm-security-interview-questions/ | none |
| 26 | Build a control system for managing aircraft takeoffs and landings at a busy airport (AI tools expected) | code | senior | https://canva.dev/blog/engineering/yes-you-can-use-ai-in-our-interviews (company's own page) | Canva |
| 27 | In an unfamiliar multi-file codebase with an AI assistant: fix the bugs, implement the core feature, then optimize for larger inputs (for example a maze solver) | code | senior | https://hellointerview.com/blog/meta-ai-enabled-coding | Meta (reported) |
| 28 | Implement a TTL-based eviction policy in this cache.py file (AI-collaborative round) | code | senior | https://www.techinterview.org/post/3233474914/anthropic-interview-process-ai-collaborative-2026/ | Anthropic (reported; conflicts with https://www.anthropic.com/candidate-ai-guidance, see section 5) |
| 29 | Why did you decompose it that way? What made you choose this approach over the alternative? | behavioural (follow-up) | senior | https://www.techinterview.org/post/3233474914/anthropic-interview-process-ai-collaborative-2026/ | Anthropic (reported) |
| 30 | Three independent infrastructure bugs produce overlapping, platform-dependent quality complaints for a month. Walk the timeline: what would you have instrumented, and which eval would have caught each bug? | debug (incident replay) | staff | https://www.anthropic.com/engineering/a-postmortem-of-three-recent-issues | none (derived) |
| 31 | Offline evals and the A/B test are positive; expert testers say the model "feels off". Ship or hold, and what gate do you add? | design (playbook) | staff | https://openai.com/index/expanding-on-sycophancy/ | none (derived) |
| 32 | An agent with a token that reads private repos is asked to triage issues in a public repo. Find the leak path and fix it with the smallest change | critique | senior | https://invariantlabs.ai/blog/mcp-github-vulnerability | none (derived) |
| 33 | An IDE agent holding a service_role database key is asked to summarize the support queue. What can a ticket author make it do? | critique | senior | https://simonwillison.net/2025/Jul/06/supabase-mcp-lethal-trifecta/ | none (derived) |
| 34 | A release of an AI coding extension shipped injected code through an over-scoped CI token. Which controls in the build and in the agent would each have stopped it? | critique | staff | https://aws.amazon.com/security/security-bulletins/AWS-2025-015/ | none (derived) |
| 35 | Design the harness for a coding agent that must work across many context resets: what persists between sessions, in what format, and who may edit it? | workflow | staff | https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents | none (derived) |
| 36 | AGENTS.md has grown to 1,000 lines and agents ignore half of it. Redesign the repository knowledge for agents and say how you enforce it mechanically | design | staff | https://openai.com/index/harness-engineering/ | none (derived) |
| 37 | Classify these harness controls as guides or sensors, computational or inferential, and name the risk nothing covers | critique | senior | https://martinfowler.com/articles/harness-engineering.html | none (derived) |
| 38 | For invoice extraction into an ERP, choose prompt chaining, routing, orchestrator-workers, evaluator-optimizer or an autonomous agent, and defend it | workflow | senior | https://www.anthropic.com/engineering/building-effective-agents | none (derived) |
| 39 | Apply the Agents Rule of Two to a travel assistant that browses and books. Which property do you drop and what does the product lose? | critique | senior | https://ai.meta.com/blog/practical-ai-agent-security/ | none (derived) |
| 40 | Pick one of the six prompt-injection design patterns for an agent that summarizes email and drafts replies, and state the utility you give up | design | staff | https://arxiv.org/abs/2506.08837 | none (derived) |
| 41 | A vendor shows a 3-point gain on SWE-bench Verified for its new harness. What does that tell you? | concept | senior | https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/ | none (derived) |
| 42 | Your support bot quoted a refund rule that contradicts the policy page, and a tribunal held the company liable. What do you change in the system? | critique | senior | https://www.mccarthy.ca/en/insights/blogs/techlex/moffatt-v-air-canada-misrepresentation-ai-chatbot (secondary, via search) | none (derived) |

Already in the bank under a matching title (do not duplicate; turn into replays or critiques instead): 1 ("Batching for a single GPU with synchronous callers"), 5 ("Confident but wrong in a high-risk domain"), 9 ("Retry a model call without making the outage worse"), 18 (`agt-002` "Agent loops forever"), 22 ("Secure an email agent that can read and send"), 23 ("Talk them out of write access to the payments database").

---

## 4. Numbers and facts to know

All checked 2026-10-28.

### Learning evidence

- Freeman et al. 2014: 158 studies on exam scores and 67 on failure rates; exam performance up 0.47 SD (about 6%); average failure 21.8% under active learning and 33.8% under lecture; failure odds ratio 1.95. https://pmc.ncbi.nlm.nih.gov/articles/PMC4060654/
- Dunlosky et al. 2013: of ten techniques, practice testing and distributed practice rated high utility; elaborative interrogation, self-explanation and interleaved practice moderate; five low, including rereading and highlighting. https://pubmed.ncbi.nlm.nih.gov/26173288/
- Kang, McDermott, Roediger 2007: final test 3 days after study; with corrective feedback a short-answer initial test gave the best final performance; without feedback the MCQ condition did not differ significantly from reading the statements. https://www.gwern.net/docs/spaced-repetition/2007-kang.pdf
- Sinha and Kapur 2021: 53 studies, 166 comparisons, Hedges' g 0.36 favouring problem solving first; g 0.37 to 0.58 with high fidelity to productive-failure design; grades 2 to 5 favoured instruction first. Abstract via https://www.x-mol.com/paper/1406031499744456704
- Macnamara, Hambrick, Oswald 2014: deliberate practice explained 26% of performance variance in games, 21% music, 18% sports, 4% education, under 1% professions. Figures reported in https://pmc.ncbi.nlm.nih.gov/articles/PMC4101876/
- Settles and Meeder 2016 (Duolingo half-life regression): error reduced by 45%+ against baselines; daily engagement up 12% in an operational study. https://aclanthology.org/P16-1174.pdf
- Anki: FSRS available since 23.10; default desired retention 90%. https://docs.ankiweb.net/faqs/what-spaced-repetition-algorithm and https://docs.ankiweb.net/deck-options.html
- FSRS benchmark: about 10,000 users and about 727 million reviews in the dataset; FSRS-6 log loss 0.3460 without same-day reviews. https://github.com/open-spaced-repetition/srs-benchmark
- Hohman et al. 2020: "limited empirical evaluation of the effectiveness of interactive articles". https://distill.pub/2020/communicating-with-interactive-articles/

### Products (vendor numbers are vendor claims)

- Execute Program: 4,821 explanatory paragraphs, 3,751 live code examples, an average course of 289 examples, reviews under 10% of total time. https://www.executeprogram.com/why-ep
- CodeCrafters "Build your own Claude Code": 13 stages, beta. https://app.codecrafters.io/courses/claude-code/overview
- Exercism: 85 languages on the getting-started page, "65+" in the about page menu. https://exercism.org/docs/using/getting-started
- Hello Interview: "250,000+" users and 66 Guided Practice problems on the homepage; 36 on a checkout listing (via search). https://www.hellointerview.com/
- interviewing.io Google survey: 158 respondents; modelled pass chance 69% at 2 mocks and 76% at 3; selection bias flagged by the authors. https://interviewing.io/blog/how-know-ready-interview-faang
- Advent of Code from 2025: 12 puzzles, global leaderboard removed, AI use discouraged. https://adventofcode.com/2025/about ; count via https://en.wikipedia.org/wiki/Advent_of_Code
- Google and Kaggle AI Agents Intensive (November 2025): over 1.5 million learners, 11,000+ capstone submissions, no completion figure. https://blog.google/innovation-and-ai/technology/developers-tools/ai-agents-intensive-recap/
- micrograd about 100 and 50 lines; nanoGPT about 300 and 300 lines, 8xA100 40GB for about 4 days to a loss of about 2.85, deprecated; llm.c about 1,000 lines; nanochat about $48 for about 2 hours of 8xH100. https://github.com/karpathy/micrograd , https://github.com/karpathy/nanoGPT , https://github.com/karpathy/llm.c , https://github.com/karpathy/nanochat
- mini-swe-agent: about 100 lines for the agent class; self-reported ">74%" on SWE-bench Verified. https://github.com/SWE-agent/mini-swe-agent
- ByteByteGo GenAI book: a 7-step framework and 10 cases, none of them an agent. https://bytebytego.com/courses/genai-system-design-interview/introduction-and-overview

### Harness, workflow and incidents

- OpenAI harness engineering: first commit in late August 2025; on the order of a million lines; roughly 1,500 merged PRs; three engineers growing to seven; 3.5 PRs per engineer per day; an AGENTS.md of roughly 100 lines; single Codex runs "upwards of six hours". https://openai.com/index/harness-engineering/
- Anthropic long-running harness: a feature list of over 200 features in the claude.ai-clone example, all initially failing; JSON chosen because models are less likely to overwrite it than Markdown. https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
- Anthropic postmortem (Sep 17, 2025): a routing error hit 0.8% of Sonnet 4 requests from August 5 and 16% at the worst hour on August 31; about 30% of Claude Code users had at least one misrouted message; Bedrock peak 0.18%; Vertex AI under 0.0004%. https://www.anthropic.com/engineering/a-postmortem-of-three-recent-issues
- OpenAI GPT-4o: update on April 25, rollback began April 28 (2025); five major GPT-4o updates in ChatGPT before it; no deployment eval for sycophancy at the time. https://openai.com/index/expanding-on-sycophancy/
- OpenAI on SWE-bench Verified: state of the art went from 74.9% to 80.9% in six months; in an audited 27.6% subset, at least 59.4% of problems had flawed tests; OpenAI stopped reporting the score. https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/
- Amazon Q Developer extension: malicious code in 1.84.0, fixed in 1.85.0, CVE-2025-8217; root cause an "inappropriately scoped GitHub token" in CodeBuild. https://aws.amazon.com/security/security-bulletins/AWS-2025-015/
- Agents Rule of Two (Oct 31, 2025): within a session, at most two of untrustworthy input, access to sensitive systems or private data, and changing state or communicating externally. https://ai.meta.com/blog/practical-ai-agent-security/
- Lethal trifecta (June 16, 2025): private data, untrusted content, external communication; a claim of "95% of attacks" caught is "very much a failing grade". https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/
- Six prompt-injection design patterns: Action-Selector, Plan-Then-Execute, LLM Map-Reduce, Dual LLM, Code-Then-Execute, Context-Minimization. https://arxiv.org/html/2506.08837
- Hamel Husain and Shreya Shankar: review at least 100 traces; prefer binary labels; their projects spent 60 to 80% of development time on error analysis and evaluation. https://hamel.dev/blog/posts/evals-faq/
- Canva: AI-Assisted Coding replaced the Computer Science Fundamentals screen for backend and frontend roles (June 11, 2025). https://canva.dev/blog/engineering/yes-you-can-use-ai-in-our-interviews
- Anthropic's own rule: live interviews have "no AI assistance unless we indicate otherwise"; take-homes are done without Claude unless told otherwise. https://www.anthropic.com/candidate-ai-guidance

### Platform facts for the build

- Pyodide's "stable" docs are for version 314.0.7, whose package list includes numpy 2.4.6, pandas 3.0.2, scikit-learn 1.8.0, networkx 3.6.1, pydantic 2.12.5 and tiktoken 0.12.0. Inferview's worker pins v0.29.5, so check each package against the pinned version before a lab depends on it. https://pyodide.org/en/stable/usage/packages-in-pyodide.html
- Interrupting Python in Pyodide needs a Web Worker, a SharedArrayBuffer and `setInterruptBuffer`. https://pyodide.org/en/stable/usage/keyboard-interrupts.html
- SharedArrayBuffer needs cross-origin isolation: `Cross-Origin-Opener-Policy: same-origin` plus `Cross-Origin-Embedder-Policy: require-corp`; COOP same-origin cuts a popup's `window.opener`. https://web.dev/articles/coop-coep . Inferview's `vercel.json` sends `same-origin-allow-popups` for Google sign-in, so its pages are not isolated; keep terminate-and-restart for timeouts.
- MCP: current revision 2026-07-28; deprecated features stay at least twelve months (ninety days under the expedited exception). https://modelcontextprotocol.io/specification/versioning
- The OpenTelemetry GenAI semantic conventions now live in their own repository; the old page is no longer maintained. https://opentelemetry.io/docs/specs/semconv/gen-ai/ and https://github.com/open-telemetry/semantic-conventions-genai
- MDN Baseline: "Widely available" means 30 months after "Newly available". https://web.dev/baseline
- Licences from the GitHub API (https://api.github.com/repos/OWNER/REPO): Codex CLI Apache-2.0; Gemini CLI Apache-2.0; opencode MIT (repository now anomalyco/opencode); LangGraph MIT; vLLM Apache-2.0; SGLang Apache-2.0; smolagents Apache-2.0; aider Apache-2.0; Temporal MIT; nanochat MIT; mini-swe-agent MIT; SWE-agent MIT; tau2-bench MIT; ts-fsrs MIT; Pyodide MPL-2.0; JupyterLite BSD-3-Clause. No licence reported for SWE-bench/experiments (trajectories), danluu/post-mortems, ray-project/llm-numbers or codecrafters-io/build-your-own-x.

---

## 5. Misconceptions a reviewer should check

1. **"Interactive teaching is proven better."** The best review says the evidence is limited and the authoring cost is high (Hohman et al. 2020). Brilliant's about page publishes no outcome figures. Any sentence on the site that says interactivity improves learning by some amount is invented unless it cites a study.
2. **"A quiz after the lesson is retrieval practice."** Recognition MCQ without feedback did not beat re-reading in Kang et al. 2007; short answer with feedback did best. Flag lessons whose only check is MCQ.
3. **"Worked examples first is good teaching."** For senior readers it can be the wrong order (expertise reversal). Problem first has a moderate pooled effect for adults, with moderators (Sinha and Kapur 2021); it is not universal.
4. **"Self-rated means graded."** Critique, workflow, design and behavioural problems are self-rated from ticks. They must not count toward the streak (the SPEC keeps this) and must not be presented as scores.
5. **"Mock interviews double your pass rate."** The interviewing.io analysis is a self-selected survey of 158 people for Google, modelled, with selection bias stated by its authors; the "5 or more" result is about real interviews. Do not repeat a pass-rate claim.
6. **"Anthropic lets you use AI in its coding rounds."** A third-party page calls the AI-collaborative round Anthropic's "signature round"; Anthropic's own guidance says live interviews have no AI assistance unless the interviewer says so. The primary source wins; if both are mentioned, name each source.
7. **"Meta's AI-enabled round format is official."** Most details (three phases, CoderPad, the model list) come from candidate reports via Hello Interview and others; the quoted Meta line describes the idea, not the rubric.
8. **"A SWE-bench Verified score shows a harness is good."** OpenAI stopped reporting it in February 2026 because of flawed tests and contamination. Labs and teardowns must not use it as evidence of harness quality, including mini-swe-agent's self-reported score.
9. **"A prompt-injection classifier solves injection."** A 95% catch rate is a failing grade in security terms (Willison); Invariant reports that off-the-shelf detectors missed the GitHub MCP attack. Security content should lead with architecture (Rule of Two, the six patterns).
10. **"The GitHub MCP leak was a server bug."** Invariant states it is not a flaw in the server's code but an agent-system architecture issue. For Supabase, the risk came from handing the agent a service_role key; Supabase's position (via secondary coverage) is that MCP itself does not bypass RLS.
11. **"Lab tests can check against the reference implementation."** Tests coupled to one implementation reject correct solutions (59.4% of an audited SWE-bench Verified subset). Review every lab test for behaviour-only assertions and for non-deterministic mock outputs.
12. **"Public on GitHub means reusable."** SWE-bench trajectories, danluu's post-mortems list and llm-numbers have no licence on GitHub; Missing Semester is non-commercial. Link to them; do not copy text or data into CC BY-SA content.
13. **"nanoGPT is the current Karpathy reference."** Its README calls it deprecated and points to nanochat.
14. **"Numbers every LLM developer should know" is current.** Its last update is 2023-05-17 and its ratios are tied to GPT-3.5 and GPT-4 prices. A card that reuses it needs a new source.
15. **"FSRS cuts reviews by some percent."** Anki's docs give the direction, not a number. The benchmark measures prediction error, not study time.
16. **"Duolingo's +12% proves spaced repetition improves learning."** It measured daily engagement in an operational study.
17. **"Deliberate practice explains expertise."** In professions it explained under 1% of variance in the 2014 meta-analysis. Do not promise mastery.
18. **"OpenAI coined harness engineering."** The OpenAI post is from February 2026 and Böckeler's first memo is dated 17 February 2026; a reader comment credits Mitchell Hashimoto, which is unverified. Say "named in early 2026 by several practitioners" unless a primary source settles it.
19. **"Pyodide can interrupt a runaway loop on this site."** Not without cross-origin isolation, which conflicts with the sign-in popup. Terminate and restart is the design.
20. **"The Replit agent's deletion was unrecoverable."** Lemkin's and Masad's accounts disagree on backups and rollback. A replay must show both and should not be written until the primary posts are read.
21. **"Pyodide's stable docs match our runtime."** The docs page is for 314.0.7; the worker pins v0.29.5, and package versions differ.
22. **"Hello Interview has N guided problems."** Its own pages disagree (66 and 36). Do not cite either as fact.
23. **"Advent of Code is 25 days with a global leaderboard."** Changed for 2025: 12 puzzles and no global leaderboard.
24. **"The OpenTelemetry GenAI page is the spec."** It moved to its own repository; link there.
