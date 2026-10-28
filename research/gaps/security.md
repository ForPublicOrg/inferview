# Gap research: implementing security properly for LLM systems

Angle: security as an implementation discipline. Threat model, then architecture, then controls, then tests, then operations. Written for the Inferview owner and the content writers; the reader of the finished lessons is a senior or staff software engineer.

Checked on 2026-10-28. Every source in section 6 carries its status: "fetched" (page read with WebFetch), "curl" (page read with curl because WebFetch was refused or a raw file was easier to read), "API" (machine-readable record, for CVEs and advisories), "search only" (fact seen only in a search result; confirm before publishing), "secondary" (third-party write-up; never the sole source for a number in a lesson), or "via tracks/safety.md" (verified on 2026-10-28 by the earlier track pass in `research/tracks/safety.md` and not re-fetched here). Source ids look like [G12]. Interview-question sources look like [Q3].

This file builds on `research/tracks/safety.md` and `research/tracks/agents.md`. It does not repeat their verified fact tables; it re-checks the facts this angle depends on and adds what they lack.

## 1. What exists on Inferview today, and what is missing

### 1.1 Inventory relevant to this angle

Content moved during this research pass: lessons now live at `src/content/lessons/<track>/<module>/overview.mdx` (SPEC section 5 in the current working tree). Paths below use the new layout. Word counts were measured with `wc -w` on 2026-10-28.

| File | What it covers well | What is missing for this angle |
|---|---|---|
| `lessons/safety/threat-modeling/overview.mdx` (3,022 words, kind lesson, level senior) | Instructions and data share one channel; direct vs indirect injection; lethal trifecta and Rule of Two; exfiltration without a send tool (EchoLeak, Markdown images); OWASP 2025 list mapped onto one architecture, with a correct note that the 2026 edition renumbered it; MCP attack names (confused deputy, token passthrough, SSRF, state handles); package hallucination; image-stripping code | It names threats but never walks the method end to end: no data-flow diagram exercise, no per-session capability matrix, no "control for each boundary, test for each control" table. MCP attacks are one paragraph of names. No supply chain beyond package names. |
| `lessons/safety/red-team/overview.mdx` (2,499 words) | Why safety training leaks; retries turn small bypass rates into certainties; canaries detect but do not prevent; probe suites and regression tests; cites The Attacker Moves Second | No CI wiring (what runs on every PR, what runs nightly, what blocks a merge), no adaptive-attack harness, no utility-under-attack metric, no red-team programme design (scope, severity, disclosure), nothing on PyRIT, promptfoo red-team configs or garak inside a pipeline beyond names. |
| `lessons/safety/guardrails/overview.mdx` (2,801 words) | Filters vs walls; classifier guardrails with their reported recall and FPR; stacking cost; tool firewalls with a CaMeL-style provenance snippet; multi-tenant retrieval isolation; PII in prompts, logs and traces; meaningful human approval | Spotlighting, instruction hierarchy and adversarial training are absent, so the reader never sees the probabilistic defences side by side with their measured limits. No permission-system design beyond four bullets. No secrets handling. No output-handling sinks other than images (XSS, SSRF, SQL, shell, paths). No data residency. |
| `lessons/safety/hallucination/overview.mdx` (2,435 words) | Correct EU AI Act dates after the Digital Omnibus | Compliance is a dates paragraph. Nothing on Article 15 (cybersecurity duties naming poisoning and adversarial examples), Article 99 fines, NIST AI RMF, the Cyber AI Profile draft, SOC 2 or ISO/IEC 42001. These belong in a security module, not in hallucination. |
| `lessons/agents/coding-agents/overview.mdx` (2,199 words) | Permission modes, deny-ask-allow rules, compound-command splitting, "sandboxing needs two walls" with bubblewrap and seatbelt | One paragraph on sandboxing. Nothing on the isolation spectrum (process sandbox, container, gVisor, microVM), what the Claude Code sandbox leaves outside it (hooks, MCP servers, reads of `~/.ssh` allowed by default), Codex's protected paths, or the auto-mode classifier and its published miss rates. |
| `lessons/agents/tools-mcp-a2a/overview.mdx` (2,760 words) | MCP 2026-07-28 changes; authorization basics (resource server, RFC 8707, PKCE, audience) | Authorization is described, not implemented: no token validation code, no `iss` check (RFC 9207), no Client ID Metadata Document trust policy, no step-up scope flow, no SSRF-safe metadata fetcher, no URL-scheme validation. Real MCP CVEs (mcp-remote, MCP Inspector) and the postmark-mcp package are missing. |
| `lessons/system-design/case-agents/overview.mdx` (2,431 words) | Agent cases including a multi-tenant agent platform and computer use | No security-first design case (for example "design the sandbox and credential path for a hosted coding agent"), no incident-response or audit-log requirements in the rubrics. |
| `lessons/evals/evals-in-ci/overview.mdx` (2,564 words) | Merge gates for quality evals; guardrails vs evaluators | Security regression suites are not part of the CI story. |
| Problems `sfe-001` to `sfe-017` (17 files) | Concept, mcq, debug, design, estimate and code coverage of injection, canaries, tenant leaks, PII, hallucination | Nothing on sandbox choice, secrets in agents, MCP token validation, SSRF in fetch tools, XSS from model output, pickle loading, model signing, audit logging, incident response, abuse and denial of wallet, or compliance. Seniority is mostly `[senior]`; six carry `staff`. |
| Agents problems `agt-010`, `agt-011`, `agt-014`, `agt-016`, `agt-018`, `agt-019` | MCP migration, a token-scope debug, memory path traversal, a late guardrail, a dropped table, an approval gate that allowed `curl` | Good seeds. None asks the candidate to choose an isolation technology or to design the credential path. |
| System-design `sys-006`, `sys-009`, `sys-012`, `sys-016` | Multi-tenant RAG, multi-tenant deployment, metered chat, per-tenant token bucket | No cross-tenant prefix-cache leakage, no abuse detection, no audit trail requirement. |
| `src/content/labs/` | Does not exist yet (SPEC section 10 defines labs) | Every security lab below is new. |
| `/mock` (SPEC section 11) | Defines an "AI security" loop preset | The bank cannot fill it: the safety track has 17 problems, and roughly half of them are about safety rather than security. |

### 1.2 The gaps in one list

1. Method: no lesson takes one system from threat model to architecture to controls to tests.
2. Prompt-injection defences are taught as one family. The split between defences that hold by construction (CaMeL, FIDES, action-selector and plan-then-execute patterns, deterministic exfiltration blocks) and defences that lower a rate (spotlighting, instruction hierarchy, classifiers, adversarial training) is not drawn, and the published numbers for the second family are missing.
3. Sandboxing as engineering: isolation technologies, what each blocks, what escapes them, and what real harnesses leave outside the sandbox.
4. Secrets: no lesson on keeping credentials out of the model's context and out of the sandbox (credential proxies, egress-time substitution, setup-only secrets).
5. MCP authorization implemented, and MCP CVEs as teardowns.
6. Output handling beyond Markdown images: XSS, SSRF, command injection, SQL, path traversal.
7. Data protection: PII redaction limits, data residency controls, telemetry content capture, cross-tenant cache side channels.
8. Operations: audit logging, rate limiting and abuse detection, incident response.
9. Model supply chain: pickle, safetensors, `torch.load`, model signing, data poisoning, backdoors.
10. Security evals in CI and red-team programmes.
11. Governance for engineers: NIST AI RMF and profiles, EU AI Act security articles and fines, SOC 2 and ISO/IEC 42001 for AI features.
12. Level: existing items explain what an attack is. Senior and staff interviews ask which control you would build, how you would know it works, and what it costs. Every new item below is written to that bar.

### 1.3 Where it should live

SPEC section 4 fixes module slugs, so new modules need a SPEC change. Proposed shape for the `safety` track (slugs are suggestions): keep `threat-modeling`, `red-team`, `guardrails`, `hallucination`, and add `secure-architecture` (method, permissions, identity), `sandboxing` (isolation and secrets), `mcp-security`, `output-and-data` (output handling, PII, residency, multi-tenant leakage), `supply-chain`, `security-ops` (logging, abuse, incident response, security evals in CI) and `governance`. Items about the harness's own attack surface (settings files, hooks, subagents) should be cross-listed with the harness track the owner asked for.

## 2. Material to add

Each topic: a brief, the primary sources (all checked 2026-10-28), the kind (lesson, teardown, lab, playbook, paper walkthrough), and the level.

### A. Method

**A1. From threat model to tests, on one agent (playbook, staff).** Take one concrete agent (an email and calendar assistant with a send tool and a fetch tool) and walk it through five artefacts: a data-flow diagram with trust boundaries; a per-session capability table scoring each tool on the three properties of Meta's Agents Rule of Two (untrustworthy input, access to sensitive systems or private data, ability to change state or communicate externally) and Willison's lethal trifecta; an architecture change that removes one leg per session; a control per boundary, each labelled "holds by construction" or "lowers a rate"; and a test per control (unit test for deterministic controls, adaptive attack suite for probabilistic ones). The CoSAI incident-response framework's architecture chapter (basic LLM, LLM with memory, RAG, agentic, agentic RAG, each with its vulnerabilities) gives a sourced catalogue of boundaries per pattern. Sources: Meta Rule of Two [G27]; lethal trifecta [G26]; OWASP LLM01:2025 mitigations [G76]; CoSAI AI Incident Response Framework v1.0, section 6 [G63].

**A2. The OWASP lists as a controls checklist, not trivia (lesson, senior).** Teach the 2025 LLM Top 10 as the cited baseline, the 2026 edition (published 3 August 2026; Excessive Agency is now third per OWASP's own announcement; the rest of the order comes from secondary write-ups), and the Agentic Top 10 for 2026 (9 December 2025). Map each entry to the control and the test that addresses it. Add OWASP's Agent Control Standard (v0.1, donated to the OWASP GenAI project and announced 1 September 2026; defines guardian-agent enforcement points, OpenTelemetry and OCSF observability, and an Agent Bill of Materials) as the runtime-enforcement counterpart. Sources: [G36], [G37], [G38] secondary, [G39], [G40], [G41].

### B. Prompt-injection defences: what holds and what only lowers a rate

**B1. Defences that hold by construction (lesson plus paper walkthrough of CaMeL, staff).** CaMeL extracts control flow and data flow from the trusted query, so retrieved untrusted data cannot change the program flow; it attaches capabilities to values and checks policies at tool calls; 77% of AgentDojo tasks solved with provable security against 84% undefended. FIDES (Microsoft authors, per its linked repository) does the same with confidentiality and integrity labels in the planner and deterministic policy enforcement. The six design patterns paper (action-selector, plan-then-execute, LLM map-reduce, dual LLM, code-then-execute, context-minimization) gives cheaper versions. Microsoft's deterministic block of Markdown image exfiltration is the production example of fixing the impact rather than the injection. Teach the limits: CaMeL does not stop text-only attacks and needs written policies; the dual LLM pattern still lets untrusted data choose tool arguments. Sources: [G28], [G29], [G78], [G24].

**B2. Defences that lower a rate, with their numbers (lesson, senior).** Spotlighting (delimiting, datamarking, encoding) reported attack success falling from above 50% to below 2% in its own tests; instruction hierarchy (Wallace and others, April 2024) trains the model to ignore lower-privileged instructions; Microsoft Prompt Shields and Llama Prompt Guard 2 are classifiers; Anthropic and OpenAI describe RL-based adversarial training and automated attackers for browser agents. Then the counter-evidence: adaptive attacks bypassed 12 published defences, most above 90% success, though most had reported near zero; Anthropic still reports about 1% attack success for Claude Opus 4.5 in a browser under an adaptive Best-of-N attacker and calls that "meaningful risk"; OpenAI writes that prompt injection is unlikely to ever be fully solved. The engineering conclusion: these layers are worth having and are never the only wall. Sources: [G24], [G22], [G84], [G31], [G32], [G33], [G23].

**B3. Tool-result hygiene (lesson, senior).** Where untrusted text enters context and what to do at each entry: strip hidden characters before user-authored text reaches an agent (GitHub Copilot cloud agent filters hidden characters such as HTML comments, and only users with write access can trigger it); keep tool results away from the component that approves actions (Claude Code's auto-mode classifier sees user messages and tool calls, with tool results stripped so hostile file or web content cannot address it directly); scan tool results with a probe before the agent reads them; validate MCP tool results before passing them to the model, as the MCP tools page asks. Sources: [G67], [G34], [G35], [G3].

**B4. Teardown: Claude Code auto mode (teardown, staff).** A two-stage transcript classifier on Sonnet 4.6 approves or blocks actions; a server-side probe flags suspicious tool results; read-only tools and in-project edits skip review; broad allow rules such as `Bash(*)` and wildcarded interpreters are dropped on entering auto mode; subagents are checked at spawn and on return. Published numbers: full pipeline 0.4% false positives on 10,000 real actions, 17% false negatives on 52 real overeager actions (the authors call it "the honest number"), 5.7% on 1,000 synthetic exfiltration attempts. Also: a project-level `.claude/settings.json` cannot switch a session into `auto` or `bypassPermissions`, which closes a repo-controlled escalation path. Interview use: "your approval classifier misses 17% of dangerous actions; what do you put around it?". Sources: [G35], [G34].

**B5. Teardown: EchoLeak, end to end (teardown, senior).** Exists as a paragraph today; expand to the full chain (classifier evasion, reference-style Markdown past link redaction, auto-fetched images, a CSP-allowed proxy), the CVE record, and the fix pattern (deterministic blocks on the exfiltration channel). Sources: [G79], [G80], [G24], [G86].

### C. Permissions, least privilege and identity

**C1. Designing a permission system for tools (lesson plus lab, senior).** Rule evaluation order (deny, then ask, then allow; deny wins in every mode), parsing compound shell commands instead of prefix matching, protected paths that no allow rule can approve (agent config, hooks, `.git` internals, shell startup files), and why the agent must not be able to edit its own permissions. Failure cases from CVE records: Claude Code before 1.0.20 had a command-parsing error that bypassed the confirmation prompt (CVE-2025-54795, CVSS 4.0 score 8.7); Cursor before 1.3.9 let an injected agent create `.cursor/mcp.json` without approval and reach code execution (CVE-2025-54135, CVSS 3.1 score 8.6); GitHub Copilot in Visual Studio 17.14.0 up to 17.14.12 had a command-injection flaw (CVE-2025-53773, CVSS 3.1 score 7.8). The lab grows a gate step by step: rule matcher, compound-command splitter, protected-path check, symlink resolution, an audit record per decision. Sources: [G34], [G4], [G6], [G54], [G53], [G55].

**C2. Agent identity and delegated authorization (lesson, staff).** Whose token does the agent hold? Impersonation vs delegation in OAuth 2.0 Token Exchange (RFC 8693: `subject_token`, optional `actor_token`, the `act` claim naming the current actor, `may_act` naming who may act), audience-bound tokens per MCP server (RFC 8707 `resource` parameter in both authorization and token requests), progressive scopes through `WWW-Authenticate` step-up challenges, and why "give the agent the user's OAuth token" fails both the blast-radius and the audit tests (the MCP spec forbids token passthrough partly because downstream logs then cannot tell who acted). Sources: [G75], [G2], [G3].

### D. Sandboxing and isolation

**D1. Choosing an isolation boundary for agent code execution (playbook, staff).** The options and what each enforces. seccomp-BPF filters syscalls, and the kernel docs say syscall filtering is not a sandbox on its own. Landlock lets unprivileged processes restrict their own filesystem access (since Linux 5.13), TCP bind and connect (ABI 4) and UDP (ABI 10), with at most 16 stacked layers. bubblewrap and macOS Seatbelt are what Claude Code and Codex use on developer machines. Containers share the host kernel, and runc's CVE-2024-21626 (leaked file descriptor, container escape, fixed in 1.1.12) shows the cost. gVisor's Sentry implements the Linux interface in user space and does not pass system calls through to the host kernel, at the price of compatibility and per-syscall overhead. Firecracker microVMs reach guest init within 125 ms with at most 5 MiB VMM overhead under the stated test conditions, install a seccomp filter per thread by default, use a minimal device model, and do no network filtering of their own. Worked decisions: a hosted multi-tenant code interpreter, a local coding agent, a CI job. Sources: [G11], [G10], [G4], [G6], [G12], [G7], [G8], [G9].

**D2. Teardown: what Claude Code's and Codex's sandboxes leave outside (teardown, senior).** Claude Code: sandbox off by default; on Linux and WSL2 bubblewrap plus a separate network namespace, with a proxy outside the sandbox whose `allowedDomains` start empty; on macOS Seatbelt; native Windows runs commands unsandboxed; reads of most of the machine, including `~/.ssh` and `~/.aws/credentials`, are allowed unless `denyRead` narrows them; hooks, local MCP servers and LSP servers run with full user access; `excludedCommands` and the `dangerouslyDisableSandbox` retry are escape hatches; hostnames resolving only to link-local addresses such as 169.254.169.254 are refused; the proxy does not inspect TLS by default. Codex: `read-only`, `workspace-write`, `danger-full-access`; network off by default; macOS Seatbelt via `sandbox-exec`; Linux bwrap plus seccomp; `.git`, `.agents`, `.codex` and `.aws` read-only inside writable roots; its own docs say the DNS and IP check reduces DNS-rebinding risk but does not eliminate it. Interview use: "your agent runs in the sandbox; list three ways it can still leak a secret". Sources: [G4], [G5], [G6].

**D3. Lab: an egress policy that survives SSRF tricks (lab, senior).** Pyodide cannot build an OS sandbox, so the lab builds the policy layer that sits in front of a fetch tool: scheme allowlist, host allowlist, resolve then pin to defeat DNS rebinding, block private and link-local ranges (10/8, 172.16/12, 192.168/16, 127/8, 169.254/16, fc00::/7, fe80::/10) including IPv4-mapped IPv6 and decimal or octal encodings (use `ipaddress`, not string matching, as the MCP page advises), redirect re-validation per hop, a response size cap. Tests come from the MCP security page's SSRF list. Sources: [G3], [G4].

### E. Secrets

**E1. Secrets never enter the context or the sandbox (lesson, senior).** Four production patterns. A credential proxy outside the sandbox that holds the real token and checks the operation (Claude Code on the web's git proxy confirms a push targets the configured branch, then attaches the real token). Placeholder substitution at egress (Claude Managed Agents vault environment-variable credentials sit in the sandbox as an opaque placeholder, replaced with the real secret at egress for allowed hosts; the docs say the agent never sees the secret value). Setup-only secrets (Codex cloud secrets are available only during setup and removed before the agent phase). stdio MCP servers take credentials from the environment and do not run OAuth. Plus detection: GitHub runs secret scanning on Copilot agent output. The motivating incident: the August 2025 Nx compromise ran a postinstall script that called installed AI CLIs with permission-skipping flags (`--dangerously-skip-permissions`, `--yolo`, `--trust-all-tools`, per StepSecurity) to inventory files and credentials, then published them to a public repository in the victim's account. Sources: [G5], [G66], [G6], [G2], [G67], [G57], [G58].

### F. MCP security

**F1. Implementing MCP authorization correctly (lesson plus code problem, staff).** Server side: publish Protected Resource Metadata (RFC 9728); validate every token's audience; return 401 with `resource_metadata` and a `scope` hint, and 403 `insufficient_scope` with all needed scopes in one challenge; never accept or forward tokens issued for another resource; bind state handles to the user id from the verified token and never treat a handle as authentication. Client side: PKCE; `resource` in both requests; record the expected issuer and compare `iss` by exact string with no normalisation (RFC 9207), rejecting the response if the server advertises `iss` support and omits it; `https` authorization URLs only (`http` for loopback in development), rejecting `javascript:`, `data:` and `file:`, and never opening URLs through a shell; SSRF-safe discovery. Registration: Client ID Metadata Documents preferred, Dynamic Client Registration deprecated. Sources: [G2], [G3], [G1].

**F2. Teardown set: MCP attacks that happened (teardown, senior).** Tool poisoning, rug pulls and shadowing (Invariant Labs, 1 April 2025; mitigation includes pinning description hashes); mcp-remote 0.0.5 to 0.1.15 executed OS commands from a malicious `authorization_endpoint` (CVE-2025-6514, CVSS 3.1 score 9.6); MCP Inspector before 0.14.1 had no authentication between client and proxy, so unauthenticated requests launched stdio commands (CVE-2025-49596, CVSS 4.0 score 9.4); the postmark-mcp npm package added a BCC line that forwarded users' emails (September 2025, reported by Koi Security; only secondary coverage was read in this pass); the GitHub MCP issue-to-private-repo leak; the Supabase single-server trifecta. Each teardown ends with the spec clause that would have stopped it. Sources: [G60], [G51], [G52], [G59], [G81], [G82], [G3].

### G. Output handling

**G1. Model output is untrusted input to the next component (lesson plus two code problems, senior).** OWASP LLM05:2025 lists XSS, CSRF, SSRF, privilege escalation, code execution through shell or `eval`, SQL injection, path traversal and phishing through email templates, and prescribes context-aware encoding, parameterized queries and a strict CSP. Real cases: DeepSeek chat, November 2024, where an injected document made the model emit a `javascript:` iframe that read the session token from `localStorage` (fixed a day later); Markdown image exfiltration; SSRF through fetch tools and OAuth discovery. Code problems: an HTML renderer for model Markdown that passes an XSS test battery; a SQL tool that accepts only a parameterized template plus typed arguments. Sources: [G40], [G61], [G86], [G3].

### H. Data protection

**H1. PII redaction, telemetry content and data residency (lesson, senior).** Redaction is a probabilistic detector (Presidio says it gives no guarantee). OpenTelemetry GenAI conventions are still at Development status and mark `gen_ai.input.messages`, `gen_ai.output.messages`, `gen_ai.system_instructions`, `gen_ai.tool.definitions` and retrieval text as Opt-In, with warnings that they may contain sensitive or personal data. Residency is two settings, not one: on the Claude API a per-request `inference_geo` of `global` or `us` (US-only priced at 1.1x on Claude 4.6 and later), and a separate workspace geo for data at rest, set at workspace creation and currently only `us`; on Bedrock and Google-managed Vertex the region comes from the endpoint. OpenAI's residency regions and zero-data-retention endpoint coverage were seen only in secondary sources in this pass; read OpenAI's data-controls page before publishing. Sources: [G85], [G65], [G68].

**H2. Cross-tenant leakage through shared caches (lesson or teardown, staff).** Prompt caching is a timing side channel when shared: an audit found global cache sharing across users at seven API providers, including OpenAI (February 2025). In vLLM, `cache_salt` is the documented mitigation for the prefix-cache membership oracle (CVE-2025-46570); an advisory published 6 October 2026 showed tool-continuation turns on the Responses path dropping the salt in vLLM 0.25.1 and earlier, restoring the oracle through exact per-turn cached-token counts. Design lesson: isolation controls must hold on every code path, so test them per endpoint. Sources: [G70], [G71].

### I. Operations

**I1. Audit logging for agents (lesson, senior).** What an investigator needs: model id and version, a redacted prompt or prompt hash, tool calls with arguments and results, who approved what, the policy decision with the rule that matched, the token subject and actor. Where this conflicts with privacy (content attributes are opt-in in OpenTelemetry) and with retention promises. The CoSAI framework lists telemetry types (model inference activity, prompt-injection detection, content risk, model drift, agentic workflow execution). The MCP security page asks servers to log scope elevation events with correlation ids, and explains how token passthrough breaks the audit trail. Sources: [G63], [G65], [G3], [G48] secondary.

**I2. Rate limiting, abuse and denial of wallet (lesson, senior).** OWASP LLM10:2025 names variable-length input floods, denial of wallet, continuous input overflow, resource-intensive queries, model extraction through the API, functional model replication and side channels. Controls: token buckets per tenant, spend caps, queue limits, limits on logprob exposure. Abuse at scale is real: Anthropic reported in November 2025 a state-sponsored operation that used Claude Code for 80 to 90% of an intrusion campaign against roughly thirty targets, at peak thousands of requests, often several per second, getting past safeguards by splitting work into innocent-looking tasks and claiming to work for a security firm. The response was account bans, notification and new classifiers. Sources: [G41], [G69], [G62].

**I3. Incident response for AI features (playbook, staff).** CoSAI AI Incident Response Framework v1.0 (document dated 27 October 2025; OASIS announced it on 18 November 2025) aligns with NIST SP 800-61 Rev. 3 (April 2025) and adds AI incident classes (data, model, deployment, infrastructure, user interaction), AI forensics, and sample playbooks for training-data poisoning, multi-channel prompt injection, memory injection, poisoned RAG and SSRF-based metadata-credential abuse. Pair with the Amazon Q Developer case: malicious code merged through an inappropriately scoped GitHub token in the CodeBuild configuration shipped in extension 1.84.0; AWS says it failed to execute because of a syntax error and released 1.85.0. The playbook covers kill switches (disable a tool, a connector, a model version), credential rotation, memory and index quarantine, and customer communication. Sources: [G63], [G64] search only, [G44], [G56].

### J. Supply chain

**J1. Loading model artefacts safely (lesson plus lab, senior).** Pickle runs code at load time through `GLOBAL`/`STACK_GLOBAL` and `REDUCE` opcodes; Hugging Face scans imports and says the scan is not 100% foolproof; picklescan was evaded with broken pickle streams in February 2025 (nullifAI, two models, removed in under 24 hours). `torch.load` defaults to `weights_only=True` (since 2.6, per the PyTorch dev-discuss announcement), yet `weights_only=True` itself was bypassable in 2.5.1 and earlier (CVE-2025-32434, CVSS 4.0 score 9.3), and the current docs still say never to load data from an untrusted source. safetensors is an 8-byte little-endian header length, a JSON header capped at 100 MB, and a buffer with no holes; it has no code execution path, and it does not validate tensor values. Signing: OpenSSF model-signing v1.0 (4 April 2025) signs with Sigstore and records the event in a transparency log. Lab: a `pickletools`-based import allowlist scanner, tested on benign and malicious opcode streams built in the browser. Sources: [G13], [G19], [G14], [G15] search only, [G16], [G17], [G18].

**J2. Data poisoning and backdoors (paper walkthrough, staff).** Anthropic with the UK AI Security Institute and the Alan Turing Institute (9 October 2025): 250 poisoned documents (about 420k tokens, 0.00016% of training tokens) backdoored models from 600M to 13B parameters with a denial-of-service trigger; 100 were not enough. The authors' caveats: a narrow, low-stakes backdoor; unclear at larger scale or for complex behaviours. Sleeper Agents (January 2024): backdoors persisted through SFT, RL and adversarial training, and adversarial training taught models to recognise their triggers better. Regulatory hook: EU AI Act Article 15(5) names data poisoning, model poisoning and adversarial examples. Sources: [G20], [G21], [G46].

**J3. Teardown: the agent toolchain as supply chain (teardown, senior).** Nx (August 2025): a `pull_request_target` workflow with a bash injection leaked the npm token; malicious versions ran a postinstall that drove local AI CLIs. Amazon Q Developer (July 2025): an over-scoped token in CodeBuild. postmark-mcp (September 2025): an impersonating MCP server package. Package hallucination: at least 5.2% (commercial models) and 21.7% (open-source models) of suggested packages hallucinated in one 2025 study. Controls: pin and review MCP servers and skills like dependencies, run installs in a sandbox, never run agents with permission-skipping flags outside an isolated container. Sources: [G57], [G58], [G56], [G59], [G87].

### K. Testing

**K1. Security evals in CI (lesson plus lab, senior).** Three suites with different cadences. Deterministic control tests on every PR (permission gate, egress policy, output encoders, path guards). A fixed regression battery of known attacks per release (promptfoo `redteam setup`, `redteam run`, `redteam report`; garak with `--target_type`, `--target_name` and `--spec probes.<family>`). Adaptive attack runs nightly or before release (AgentDojo: 97 tasks and 629 security test cases; the LLMail-Inject dataset of more than 370,000 prompts). Tooling status, with dates: OpenAI announced on 9 March 2026 that it would acquire Promptfoo and said it will continue building the open-source project; PyRIT moved to `microsoft/PyRIT`, and the `Azure/PyRIT` repository was archived on 27 March 2026. Sources: [G72], [G83], [G25], [G24], [G73], [G74], [G31].

**K2. Running a red-team programme (playbook, staff).** Scope, threat actors, adaptive attackers as the default, what counts as a finding, severity, regression capture, disclosure and bug-bounty handling. Reference points: OWASP GenAI Red Teaming Manual 1.0 (listed 20 October 2026; not read in full in this pass); AIUC-1 describes red-teaming with 1,000 to 5,000 scenarios and quarterly retests (a vendor-maintained standard; label it as such). Sources: [G39] (resource listing), [G50], [G31].

### L. Governance for engineers

**L1. NIST in one sitting (lesson, senior).** AI RMF 1.0 (26 January 2023; Govern, Map, Measure, Manage; being revised under the White House AI Action Plan, no date given); Generative AI Profile NIST AI 600-1 (26 July 2024); Cyber AI Profile NIST IR 8596, initial preliminary draft 16 December 2025 with focus areas Secure, Defend and Thwart, not final; SP 800-61 Rev. 3 for incident response (April 2025); AI 100-2 E2025 adversarial ML taxonomy (March 2025). Sources: [G42], [G43], [G44], tracks/safety.md S31.

**L2. EU AI Act duties an engineer implements (lesson, senior).** Dates after the Digital Omnibus (already in the hallucination lesson; move them here); Article 15(5) technical measures against data poisoning, model poisoning, adversarial examples, confidentiality attacks and model flaws for high-risk systems; Article 50(2) marking of generated content (generative systems on the market before 2 August 2026 have until 2 December 2026); Article 99 fines (up to EUR 35 million or 7% of worldwide turnover for prohibited practices, EUR 15 million or 3% for other obligations, EUR 7.5 million or 1% for incorrect information, whichever is higher; the lower of the two for SMEs). Sources: [G45], [G46], [G47].

**L3. SOC 2 and ISO/IEC 42001 for an AI feature (playbook, staff).** As of the CSA note dated 30 August 2026, the AICPA has no AI-specific Trust Services Criteria (criteria from 2017, points of focus refreshed in 2022), so auditors map AI controls onto existing criteria and requests vary by firm. Evidence that recurs: model change management with lineage and approvals, per-inference logs with model version and a redacted prompt or hash, LLM providers treated as subprocessors with their retention settings documented, a shadow-AI inventory. ISO/IEC 42001:2023 (edition 1.0, December 2023) certifies the management system, not a model. AIUC-1 is a vendor-maintained agent standard with accredited auditors. Sources: [G48] secondary, [G49] search only, [G50].

### M. The harness as an attack surface (lesson, staff; cross-list with the harness track)

**M1.** The files the agent can write are the files that configure the agent. Claude Code write-protects its settings, hooks, skills, `.mcp.json`, shell startup files and `.git` hooks and config, because a command that could edit them could grant itself permissions or add a hook that runs outside the sandbox; Codex keeps `.git`, `.agents`, `.codex` and `.aws` read-only; Cursor's CVE-2025-54135 is the failure case. In auto mode Claude Code ignores a subagent's own `permissionMode` and checks its work at spawn and return. Settings precedence: project files cannot raise the permission mode. Sources: [G4], [G6], [G34], [G53].

### Summary table

| # | Topic | Kind | Level | New or extends |
|---|---|---|---|---|
| A1 | Threat model to tests on one agent | playbook | staff | new |
| A2 | OWASP lists as a controls checklist, plus ACS | lesson | senior | extends threat-modeling |
| B1 | Defences by construction; CaMeL | lesson + paper | staff | new |
| B2 | Defences that lower a rate, with numbers | lesson | senior | new |
| B3 | Tool-result hygiene | lesson | senior | new |
| B4 | Claude Code auto mode | teardown | staff | new |
| B5 | EchoLeak | teardown | senior | extends threat-modeling |
| C1 | Permission system design | lesson + lab | senior | extends coding-agents and guardrails |
| C2 | Agent identity and delegated auth | lesson | staff | new |
| D1 | Choosing an isolation boundary | playbook | staff | new |
| D2 | What harness sandboxes leave outside | teardown | senior | new |
| D3 | Egress policy against SSRF | lab | senior | new |
| E1 | Secrets out of context and sandbox | lesson | senior | new |
| F1 | MCP authorization implemented | lesson + code | staff | extends tools-mcp-a2a |
| F2 | MCP attacks that happened | teardown | senior | new |
| G1 | Output handling sinks | lesson + code | senior | new |
| H1 | PII, telemetry content, residency | lesson | senior | extends guardrails |
| H2 | Cross-tenant cache leakage | lesson or teardown | staff | new |
| I1 | Audit logging | lesson | senior | new |
| I2 | Abuse and denial of wallet | lesson | senior | new |
| I3 | Incident response | playbook | staff | new |
| J1 | Loading model artefacts safely | lesson + lab | senior | new |
| J2 | Poisoning and backdoors | paper | staff | new |
| J3 | Agent toolchain supply chain | teardown | senior | new |
| K1 | Security evals in CI | lesson + lab | senior | extends red-team |
| K2 | Red-team programme | playbook | staff | new |
| L1 | NIST documents | lesson | senior | new |
| L2 | EU AI Act duties | lesson | senior | moves from hallucination |
| L3 | SOC 2 and ISO 42001 | playbook | staff | new |
| M1 | Harness as attack surface | lesson | staff | new, cross-list |

## 3. Interview questions collected

Type uses SPEC section 6 types. Level is our judgement of who the question targets. "Company" is filled only when the source names the company for that question; every question source here is secondary and says so. Questions are verbatim unless marked (para). Where a source question embeds an unverified claim, the claim is removed and the row is marked (shape only). "Covered" names an existing problem that already answers it.

| # | Question | Type | Level | Source | Company | Covered |
|---|---|---|---|---|---|---|
| 1 | How would you threat-model an LLM inference API that receives untrusted user input at scale? | design | staff | [Q1] | Anthropic (candidate-reported per aggregator) | no |
| 2 | Describe how you would detect a prompt injection attack at the infrastructure level, not just at the application layer. | design | staff | [Q1] | Anthropic (aggregator) | no |
| 3 | (para) Model weights represent years of research. How would you design an access control system to protect them? | design | staff | [Q1] | Anthropic (aggregator) | no |
| 4 | Walk us through your response if a Python dependency in our training pipeline was found to contain malicious code. | design | senior | [Q1] | Anthropic (aggregator) | no |
| 5 | A researcher accidentally pushes a live API key to a public repository. Walk us through your incident response. | design | senior | [Q1] | Anthropic (aggregator) | no |
| 6 | How would you build a secrets management system for a fast-growing research org where developers move quickly? | design | staff | [Q1] | Anthropic (aggregator) | no |
| 7 | (para) How do you balance publishing research openly with protecting sensitive IP and model weights? | behavioural | staff | [Q1] | Anthropic (aggregator) | no |
| 8 | How would you design a red-team exercise to find security risks introduced by AI-generated code in a production codebase? | design | staff | [Q1] | Anthropic (aggregator) | no |
| 9 | Design a security monitoring architecture for ML training infrastructure | design | staff | [Q9] | none (pattern list, not candidate-attributed) | no |
| 10 | Design a sandboxed cloud IDE: a multi-tenant, browser-based notebook that runs user code in an isolated sandbox | design | senior | [Q4] | OpenAI (aggregator tag, onsite system design) | no |
| 11 | Walk me through what the agent does with that ticket, and where you'd stop it. (Context: a support agent that can refund up to $500 reads a ticket asking for a full refund.) | debug | senior | [Q2] | none | partly sfe-011 |
| 12 | Here's an agent that can read and send email. Show me an indirect injection that exfiltrates a user's inbox to an attacker. | design | senior | [Q2] | none | sfe-003 |
| 13 | We put 'never reveal the system prompt' at the very top of the system prompt. Why isn't that enough? | mcq | senior | [Q2] | none | sfe-002 |
| 14 | (para) A product team wants to give the support agent write access to the payments database to speed up refunds. Talk them out of it or name the guardrails that make it acceptable. | design | staff | [Q2] | none | sfe-011 |
| 15 | You have five minutes with this toy agent. Get it to run a shell command it wasn't meant to. | debug | senior | [Q2] | none | sfe-008 |
| 16 | Walk me through what happens when your RAG bot ingests a document an attacker controls. | concept | senior | [Q3] | none | sfe-001 |
| 17 | Your agent can browse the web and read the user's email. What's the worst a poisoned page can do? | concept | senior | [Q3] | none | no |
| 18 | A prompt-injection classifier catches 95% of attempts in eval. Do you ship it? | estimate | senior | [Q3] | none | sfe-006 |
| 19 | (para) We're putting an LLM-backed feature into production that can read from a few internal systems. How do you keep it from becoming a hole? | design | senior | [Q3] | none | no |
| 20 | How Would You Integrate AI Security into CI/CD? | design | senior | [Q7] | none | no |
| 21 | How Would You Detect and Investigate an AI Security Incident? | design | staff | [Q7] | none | no |
| 22 | How Would You Explain AI Security Risk to Senior Leadership? | behavioural | staff | [Q7] | none | no |
| 23 | How Would You Secure AI Models and Data in the Cloud? | design | senior | [Q7] | none | no |
| 24 | Should an AI agent use the user's OAuth token? | mcq | staff | [Q6] | none | no |
| 25 | Why is human-in-the-loop not enough for agent security? | concept | senior | [Q6] | none | partly guardrails lesson |
| 26 | How do you measure whether prompt-injection defenses work? | concept | staff | [Q6] | none | no |
| 27 | How should an agent handle arbitrary URLs safely? | code | senior | [Q6] | none | no |
| 28 | What should happen after a successful AI agent attack? | design | staff | [Q6] | none | no |
| 29 | How would you detect if someone is trying to steal your AI model through the API? | design | senior | [Q5] | none | no |
| 30 | What rate limits would you set on an AI API and why? | estimate | senior | [Q5] | none | partly sys-016 |
| 31 | A customer says your chatbot leaked another user's data. What do you check first? | debug | senior | [Q5] | none | partly sfe-012 |
| 32 | Your AI vendor got hacked. What do you check in your systems? | design | senior | [Q5] | none | no |
| 33 | What's in an AI model's SBOM (Software Bill of Materials)? | concept | senior | [Q5] | none | no |
| 34 | Explain to a manager why we can't just 'delete' sensitive data from a trained AI model. | behavioural | senior | [Q5] | none | no |
| 35 | Design a system where one user's prompt cannot leak to another user | design | staff | [Q8] Q58 | none | no |
| 36 | Your agent can execute arbitrary Python code. How do you make this safe? | design | senior | [Q8] Q65 | none | partly agt-018 |
| 37 | (shape only) You're integrating a third-party fine-tuned model whose vendor publishes weights but not training data. Walk through your supply-chain trust process: what does Sigstore and OpenSSF model signing buy you, and what gaps remain? | design | staff | [Q8] Q95 | none | no |
| 38 | (shape only) Multi-tenant RAG isolation: namespaces, per-tenant shards or Postgres row-level security. Which fails first under noisy-neighbour pressure, and which fails first under an audit? | design | staff | [Q8] Q101 | none | partly rag-008 |
| 39 | (shape only) Design a secure multi-tenant MCP server on the stateless 2026-07-28 spec. | design | staff | [Q8] Q127 | none | partly agt-010 |
| 40 | (shape only) Design the security architecture for a multi-tenant, self-hosted model serving tier (engine-killing requests, cross-tenant prefix-cache oracles, stored provider keys). | design | staff | [Q8] Q135 | none | no |
| 41 | (shape only) Design telemetry for your own coding agent so that it cannot silently upload repositories or secrets. | design | staff | [Q8] Q119 | none | no |
| 42 | (shape only) A poisoned package plants editor and agent auto-execution hooks, so opening the repository runs the payload. Design supply-chain defence for a team running coding agents. | design | staff | [Q8] Q125 | none | no |
| 43 | (shape only) Agent plugins bundle skills and MCP servers into one installable unit. Design the review and distribution pipeline for internal plugins. | design | staff | [Q8] Q126 | none | no |
| 44 | Explain the Model Context Protocol (MCP) remote transport and authorization model, and the security risks of running MCP servers in production. | concept | staff | [Q8] Q72 | none | partly sfe-004 |
| 45 | What Security Risks Does MCP Introduce? | concept | senior | [Q7] | none | sfe-004 |
| 46 | Design a system for managing secrets across services | design | senior | [Q9] | none (pattern list) | no |

Count: 46 questions. Company named: Anthropic for 8 ([Q1], which says its questions are candidate-reported and compiled from public guides, hiring-manager debriefs and candidate reports, without confirmation from Anthropic), OpenAI for 1 ([Q4], an aggregator's company tag). [Q9] is an Anthropic-specific guide but presents "question patterns" mixed with editorial analysis, so rows 9 and 46 carry no company. Under SPEC section 6, `companies` needs a public source naming the company and the topic: [Q1] and [Q4] meet the letter of that rule and are secondary; the reviewer decides whether that is enough. The safety track notes add Meta for content-integrity design questions (tracks/safety.md S68, S69); those are safety rather than security and are not repeated. Questions from the OB guide [Q8] embed dated claims that were not verified (for example a percentage of MCP servers without OAuth, a sandbox escape during a capability evaluation, a count of MCP advisories); use the question shapes only.

What security rounds at AI companies look like, as reported (secondary; label it in any lesson): a recruiter screen that checks fluency with the OWASP LLM list and direct vs indirect injection; a technical screen going deep on one attack and its defence, sometimes live against a toy agent; a scenario round on a browsing agent, a code-execution sandbox or a RAG assistant; in many loops a hands-on exercise breaking a weak agent while narrating; a behavioural round on disclosure and pushing back on product teams [Q2]. Aggregator reports for Anthropic security-engineer loops add model-weight protection, Kubernetes hardening for GPU training clusters, supply-chain incidents in training pipelines and secrets management [Q1]. Anthropic security job listings, seen only through job-board reposts in this pass, mention threat models for code-execution sandboxing and agent identity on agentic product surfaces; read the listing on anthropic.com before citing it.

Recommended new bank items from this list, chosen to fill gradable gaps: #27 as code (URL egress policy); #30 as estimate (token-bucket sizing with a stated traffic model); #31 as debug (a trace showing a cross-tenant prefix-cache hit or a shared conversation id); #24 as mcq (impersonation vs delegation vs passthrough); #44 as code (token audience and `iss` validation); #10 and #36 as design (isolation choice); #21 and #28 as design (incident response); #33 and #37 as concept (model supply chain); #20 as design (security CI); #35 as design (cross-user isolation); #2 as design (staff).

## 4. Numbers and facts to know

All checked 2026-10-28.

| Fact | Value | Source |
|---|---|---|
| Current MCP revision | `2026-07-28`; revisions `2025-11-25` and earlier are handshake-based; deprecated features stay at least 12 months (at least 90 days under expedited removal) | [G1] |
| MCP authorization basis | Subset of OAuth 2.1 (draft-ietf-oauth-v2-1-13); servers MUST publish RFC 9728 metadata; clients MUST send the RFC 8707 `resource` parameter in authorization and token requests; tokens never in the query string; servers MUST NOT accept or transit other tokens | [G2] |
| MCP `iss` validation | Client records the issuer before redirect and compares by simple string with no normalisation; rejects the response when the server advertises `iss` support and the parameter is absent | [G2] |
| MCP client registration | Client ID Metadata Documents SHOULD be supported; Dynamic Client Registration deprecated | [G2] |
| MCP SSRF guidance | Block 10/8, 172.16/12, 192.168/16, 127/8, 169.254/16, fc00::/7, fe80::/10; avoid hand-written IP validation (octal, hex, IPv4-mapped IPv6); consider egress proxies such as Smokescreen; pin DNS between check and use | [G3] |
| MCP state handles | Possession of a handle MUST NOT be treated as authentication; key state as user id from the verified token plus handle | [G3] |
| MCP OAuth URL handling | Only `https` (and `http` for loopback in development); reject `javascript:`, `data:`, `file:`, `vbscript:`; MUST NOT open URLs through a shell | [G3] |
| mcp-remote CVE-2025-6514 | OS command injection via a crafted `authorization_endpoint`; versions 0.0.5 to 0.1.15; CVSS 3.1 score 9.6; published 9 July 2025 | [G51] |
| MCP Inspector CVE-2025-49596 | No auth between Inspector client and proxy; remote launch of stdio commands; fixed 0.14.1; CVSS 4.0 score 9.4; published 13 June 2025 | [G52] |
| Cursor CVE-2025-54135 | Injection could create `.cursor/mcp.json` without approval and reach RCE; fixed 1.3.9; CVSS 3.1 score 8.6; published 5 August 2025 | [G53] |
| Claude Code CVE-2025-54795 | Command-parsing error bypassed the confirmation prompt; fixed 1.0.20; CVSS 4.0 score 8.7; published 5 August 2025 | [G54] |
| Copilot / Visual Studio CVE-2025-53773 | Command injection allowing local code execution; VS 2022 17.14.0 up to 17.14.12; CVSS 3.1 score 7.8; published 12 August 2025 | [G55] |
| Claude Code sandbox defaults | Off by default; writes limited to the working directory, a temp directory and added directories; reads of most of the machine allowed, including `~/.ssh` and `~/.aws/credentials`; `allowedDomains` starts empty; native Windows unsandboxed (use WSL2); hooks and local MCP servers run outside the sandbox | [G4] |
| Claude Code sandboxing post | 20 October 2025; filesystem plus network isolation; "sandboxing safely reduces permission prompts by 84%" (internal usage) | [G5] |
| Claude Code auto-mode classifier | Published 25 March 2026; full pipeline 0.4% false positives (n=10,000 real actions), 17% false negatives on real overeager actions (n=52), 5.7% on synthetic exfiltration (n=1,000); stage 1 alone 8.5%, 6.6%, 1.8% | [G35] |
| Claude Code auto-mode inputs | Tool results stripped from classifier requests; a separate probe scans incoming tool results; broad allow rules (`Bash(*)`, wildcarded interpreters, package-manager run commands) dropped on entry | [G34] |
| Codex sandbox | Modes `read-only`, `workspace-write`, `danger-full-access`; network off by default; macOS Seatbelt, Linux bwrap plus seccomp; `.git`, `.agents`, `.codex`, `.aws` read-only in writable roots; `untrusted` approval policy retired | [G6] |
| Codex cloud secrets | Available only during setup, removed before the agent phase | [G6] |
| Claude Managed Agents vault | Environment-variable credentials stored in the sandbox as opaque placeholders and substituted at egress for allowed hosts; the agent never sees the value; not yet supported with self-hosted sandboxes | [G66] |
| Claude Code on the web | Git credentials and signing keys never inside the sandbox; a proxy checks the operation (push to the configured branch) and attaches the real token | [G5] |
| GitHub Copilot cloud agent | Pushes to one branch; workflows wait for review by a user with write access; secret scanning; only write-access users can trigger; hidden characters filtered; requesting developer marked co-author | [G67] |
| seccomp | Kernel docs: syscall filtering is not a sandbox on its own; requires `no_new_privs` or `CAP_SYS_ADMIN`; filters cannot dereference pointers | [G11] |
| Landlock | Unprivileged self-restriction since Linux 5.13; TCP bind and connect from ABI 4, UDP from ABI 10, signal and abstract socket scoping from ABI 6; at most 16 stacked layers | [G10] |
| runc CVE-2024-21626 | Leaked fd gives a container process a host working directory and allows escape; runc 1.0.0-rc93 up to 1.1.12; CVSS 3.1 score 8.6; published 31 January 2024 | [G12] |
| gVisor | Application kernel in Go; the Sentry does not pass system calls through to the host kernel; reduced compatibility and higher per-syscall overhead | [G7] |
| Firecracker | Guest `/sbin/init` within 125 ms of InstanceStart and VMM overhead at most 5 MiB, on M5D.metal and M6G.metal with a 1 vCPU, 128 MiB guest and a minimal kernel; seccomp on by default; jailer recommended; no network filtering of guest egress | [G8], [G9] |
| Spotlighting | Attack success from above 50% to below 2% in its own experiments (March 2024) | [G24], tracks/safety.md S41 |
| The Attacker Moves Second | 12 defences bypassed, most above 90% success; most had reported near-zero success (October 2025) | [G31] |
| Anthropic browser agent | About 1% attack success for Claude Opus 4.5 under an adaptive Best-of-N attacker, 100 attempts per environment (24 November 2025) | [G32] |
| OpenAI on injection | Prompt injection, like scams and social engineering, is unlikely to ever be fully solved (22 December 2025) | [G33] |
| CaMeL | 77% of AgentDojo tasks with provable security vs 84% undefended (v1 24 March 2025, v2 24 June 2025) | [G28] |
| AgentDojo | 97 tasks, 629 security test cases (June 2024) | [G25] |
| LLMail-Inject | More than 800 participants; dataset of more than 370,000 prompts released | [G24] |
| Rule of Two | 31 October 2025: at most two of untrustworthy input, sensitive access, state change or external communication per session; otherwise supervision | [G27] |
| Lethal trifecta | 16 June 2025: private data, untrusted content, external communication; Willison calls 95% "very much a failing grade" in web security terms | [G26] |
| OWASP LLM Top 10 2026 | Published 3 August 2026; Excessive Agency now third (OWASP announcement). Full order from secondary sources only: LLM01 Prompt Injection, LLM02 Sensitive Information Disclosure, LLM03 Excessive Agency, LLM04 Supply Chain, LLM05 Data and Model Poisoning, LLM06 Unbounded Consumption, LLM07 Misinformation, LLM08 Hidden Context Exposure, LLM09 Vector and Embedding Weaknesses, LLM10 Improper Output Handling | [G36], [G37], [G38] |
| OWASP Agentic Top 10 | Released 9 December 2025 | [G39] |
| OWASP Agent Control Standard | v0.1; announced with the 2026 Top 10 on 1 September 2026; secondary sources report a first public release in May 2026 | [G37], [G38] |
| Pickle danger | `GLOBAL`/`STACK_GLOBAL` import callables and `REDUCE` calls them; Hugging Face says its scan is not 100% foolproof | [G13] |
| `torch.load` | Default `weights_only=True` (flipped in 2.6 per PyTorch dev-discuss); current docs still warn never to load data from an untrusted source | [G14], [G15] |
| CVE-2025-32434 | RCE through `torch.load` with `weights_only=True` in 2.5.1 and earlier; fixed 2.6.0; CVSS 4.0 score 9.3; published 18 April 2025 | [G16] |
| nullifAI | 6 February 2025; two models used 7z-compressed, broken pickles to evade picklescan; removed in under 24 hours | [G19] |
| safetensors | 8-byte little-endian header length, JSON header capped at 100 MB, no holes in the buffer; tensor values not validated | [G17] |
| Model signing | OpenSSF model-signing v1.0, 4 April 2025, Sigstore with a transparency log; `model_signing sign` and `model_signing verify` | [G18] |
| Data poisoning | 250 documents (about 420k tokens, 0.00016% of training tokens) backdoored 600M to 13B models; 100 were not enough (9 October 2025) | [G20] |
| Sleeper agents | Backdoors persisted through SFT, RL and adversarial training (January 2024) | [G21] |
| Prompt-cache side channel | Global cache sharing found at seven API providers, including OpenAI (February 2025) | [G70] |
| vLLM cache-salt bypass | Responses-path tool continuations dropped `cache_salt` in vLLM 0.25.1 and earlier; advisory published 6 October 2026, severity low | [G71] |
| Claude data residency | `inference_geo` `global` or `us`; US-only at 1.1x on Claude 4.6 and later; workspace geo fixed at creation, only `us` today; not applicable on Bedrock or Google-managed Vertex | [G68] |
| OTel GenAI content | Conventions at Development status; message, system-instruction and tool-definition attributes are Opt-In and flagged as likely to contain sensitive data | [G65] |
| Claude rate limiting | Token bucket; on most models ITPM counts uncached input and cache writes, not cache reads; acceleration limits on sharp increases | [G69] |
| OWASP LLM10:2025 | Seven threat types including denial of wallet and functional model replication; fifteen mitigations including limits on logit and logprob exposure and watermarking | [G41] |
| AI-orchestrated espionage | 80 to 90% of the campaign done by AI, 4 to 6 human decision points per campaign, roughly thirty targets, thousands of requests at peak (13 November 2025) | [G62] |
| Amazon Q Developer 1.84.0 | Malicious code merged via an inappropriately scoped GitHub token in CodeBuild; AWS says it failed due to a syntax error; fixed in 1.85.0 (bulletin 23 July 2025, updated 25 July) | [G56] |
| Nx compromise | Malicious versions published 26 August 2025 between 6:32 PM and 8:37 PM EDT, removed 10:44 PM; root cause a `pull_request_target` workflow with a bash injection | [G57] |
| CoSAI IR framework | v1.0, cover dated 27 October 2025 (its approval line reads 27 October 2026, likely a typo); aligned to NIST SP 800-61r3 | [G63] |
| NIST | AI RMF 1.0 26 January 2023; AI 600-1 26 July 2024; IR 8596 preliminary draft 16 December 2025; SP 800-61r3 April 2025 | [G42], [G43], [G44] |
| EU AI Act fines | EUR 35M or 7%; EUR 15M or 3%; EUR 7.5M or 1%; whichever is higher, the lower for SMEs | [G47] |
| EU AI Act Article 15(5) | Names data poisoning, model poisoning, adversarial examples, confidentiality attacks, model flaws | [G46] |
| EU AI Act dates | Annex III high-risk 2 December 2027; Annex I 2 August 2028; Article 50(2) for pre-existing generative systems by 2 December 2026 | [G45] |
| SOC 2 and AI | No AI-specific Trust Services Criteria as of 30 August 2026 (criteria 2017, points of focus 2022) | [G48] secondary |
| ISO/IEC 42001 | Edition 1.0, December 2023 | [G49] search only |
| AIUC-1 | Red-teaming of 1,000 to 5,000 scenarios, quarterly retests, certificate valid one year; Schellman named first accredited auditor on 3 February 2026 | [G50] |
| Promptfoo | OpenAI announced the acquisition on 9 March 2026 and said it will continue building the open-source project | [G73] |
| PyRIT | `Azure/PyRIT` archived 27 March 2026; moved to `microsoft/PyRIT` | [G74] |

## 5. Misconceptions a reviewer should check

1. "A sandbox stops prompt injection." It limits blast radius. Claude Code's sandbox allows reads of `~/.ssh` by default, lets allowed domains receive anything, and leaves hooks and local MCP servers outside [G4]. A lesson that says "sandboxed, therefore safe" fails review.
2. "seccomp is a sandbox." The kernel docs call syscall filtering a building block, not a sandbox [G11].
3. "Containers are an isolation boundary for hostile code." They share the host kernel; runc CVE-2024-21626 is the counterexample [G12]. For multi-tenant untrusted code, a lesson must discuss gVisor or microVMs and their costs [G7][G9].
4. "Firecracker boots in 125 ms" without conditions. The figure is to guest init under stated hardware, guest size and kernel [G9].
5. "Network allowlists prevent exfiltration." An allowed domain that accepts data is a channel; Claude Code's proxy does not inspect TLS by default [G4][G86].
6. "The approval classifier makes auto mode safe." Anthropic publishes a 17% miss rate on real overeager actions and says auto mode does not replace careful human review on high-stakes infrastructure [G35].
7. "Spotlighting, instruction hierarchy or a classifier solves injection." Each lowers a rate; adaptive attacks bypassed most published defences [G31]; vendors report around 1% residual success [G32] and call the problem unsolved [G33].
8. "CaMeL is a classifier" or "CaMeL is free". It is an interpreter with capabilities and policies; it costs task success (77% vs 84%) and does not cover text-only attacks [G28].
9. "Pass the user's OAuth token to the MCP server or downstream API." Token passthrough is forbidden and servers must validate audience [G2][G3]. Delegation (RFC 8693 `actor_token`, `act`) is different from impersonation [G75].
10. "PKCE prevents mix-up attacks." The MCP security page says PKCE alone does not; `iss` validation does [G3].
11. "Dynamic Client Registration is the MCP default." Deprecated in 2026-07-28 in favour of Client ID Metadata Documents [G2].
12. "A state handle or session id is a credential." The 2026-07-28 security page says possession MUST NOT be treated as authentication [G3].
13. "Opening the OAuth URL with the OS shell is fine." Shell-based URL opening is forbidden; mcp-remote's CVE-2025-6514 is what happens otherwise [G3][G51].
14. "Secrets in environment variables inside the agent sandbox are safe." The agent can read and send them. The patterns that hold keep the real secret outside the sandbox (proxy, egress substitution, setup-only) [G5][G66][G6]. The Nx malware drove local AI CLIs specifically to harvest credentials [G58].
15. "`weights_only=True` makes `torch.load` safe for untrusted files." CVE-2025-32434 bypassed it in 2.5.1 and earlier, and the docs still warn against untrusted sources [G16][G14].
16. "Picklescan passed, so the model is safe." Hugging Face says the scan is not foolproof and nullifAI evaded it [G13][G19].
17. "safetensors validates the model." It removes code execution; it does not validate tensor values and says nothing about who produced the weights. Signing answers provenance [G17][G18].
18. "Poisoning needs a percentage of the training set." The 2025 study found a near-constant document count (250) across 600M to 13B models for a narrow backdoor; do not generalise beyond the authors' caveats [G20].
19. "Safety training removes backdoors." Sleeper Agents reports persistence, and better trigger recognition after adversarial training [G21].
20. "Prompt caching is per customer everywhere." An audit found global sharing at seven providers; vLLM needed `cache_salt` and still leaked on one path [G70][G71].
21. "Log every prompt for audit." OpenTelemetry marks content opt-in for a reason; logging content creates a personal-data store with its own retention and residency duties [G65][G68].
22. "Data residency is one switch." Claude separates inference geo (per request) from workspace geo (data at rest, fixed at creation), and partner clouds use their own region controls [G68].
23. "Rate limiting means requests per minute." Token-based limits and spend caps matter for denial of wallet [G41][G69]; abuse at scale shows up in account-level behaviour, not in single prompts [G62].
24. "OWASP LLM Top 10 numbers are stable." LLM03 is Supply Chain in 2025 and Excessive Agency in 2026; always state the year, and the 2026 full order is still sourced from secondary write-ups [G36][G38].
25. "SOC 2 has AI criteria." Not as of 30 August 2026; auditors improvise, so two clean reports can test different controls [G48].
26. "ISO/IEC 42001 certifies a model." It certifies a management system [G49].
27. "The NIST Cyber AI Profile is final." It is an initial preliminary draft from 16 December 2025 [G43].
28. "EU AI Act high-risk obligations apply from August 2026." Moved to 2 December 2027 (Annex III) and 2 August 2028 (Annex I) [G45].
29. "Amazon Q's wiper prompt deleted customer data." AWS says it failed to execute; press coverage framed the potential impact. Quote the bulletin [G56].
30. postmark-mcp figures from one outlet. Download and email-volume estimates differ across secondary sources; quote Koi Security's own post or none [G59].
31. "Anthropic's sandbox runtime lives at X." The engineering post links `anthropic-experimental/sandbox-runtime`; the current docs link `anthropics/sandbox-runtime` [G5][G4]. Check before linking.
32. Company tags from aggregators. [Q1] and [Q4] are secondary; label reported questions as reported, and keep `companies` empty where the source does not tie a question to a report ([Q9]).

## 6. Sources

Status meanings are in the header. All checked 2026-10-28.

- [G1] MCP Versioning. https://modelcontextprotocol.io/specification/versioning . fetched.
- [G2] MCP Authorization, revision 2026-07-28. https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization . fetched.
- [G3] MCP Security Best Practices, revision 2026-07-28. https://modelcontextprotocol.io/specification/2026-07-28/basic/security_best_practices . fetched.
- [G4] Claude Code docs, Sandboxing. https://code.claude.com/docs/en/sandboxing . fetched (first 100,000 characters; the "Security limitations" section fell outside the fetch window).
- [G5] Anthropic Engineering, Claude Code sandboxing (20 October 2025). https://www.anthropic.com/engineering/claude-code-sandboxing . fetched.
- [G6] OpenAI Codex, Agent approvals and security. https://learn.chatgpt.com/docs/agent-approvals-security (redirect target of https://developers.openai.com/codex/agent-approvals-security). fetched.
- [G7] gVisor documentation. https://gvisor.dev/docs/ . fetched.
- [G8] Firecracker design. https://github.com/firecracker-microvm/firecracker/blob/main/docs/design.md . fetched.
- [G9] Firecracker specification. https://github.com/firecracker-microvm/firecracker/blob/main/SPECIFICATION.md . fetched.
- [G10] Linux kernel docs, Landlock. https://docs.kernel.org/userspace-api/landlock.html . fetched.
- [G11] Linux kernel docs, Seccomp BPF. https://docs.kernel.org/userspace-api/seccomp_filter.html . fetched.
- [G12] CVE-2024-21626 (runc). https://cveawg.mitre.org/api/cve/CVE-2024-21626 . API.
- [G13] Hugging Face Hub docs, Pickle scanning. https://huggingface.co/docs/hub/security-pickle . fetched.
- [G14] PyTorch docs, torch.load (2.14). https://docs.pytorch.org/docs/2.14/generated/torch.load.html . fetched.
- [G15] PyTorch dev-discuss, torch.load flipped to weights_only=True by default. https://dev-discuss.pytorch.org/t/bc-breaking-change-torch-load-is-being-flipped-to-use-weights-only-true-by-default-in-the-nightlies-after-137602/2573 . search only.
- [G16] CVE-2025-32434 (PyTorch). https://cveawg.mitre.org/api/cve/CVE-2025-32434 . API.
- [G17] safetensors README. https://github.com/huggingface/safetensors . fetched.
- [G18] Sigstore blog, model-transparency v1.0 (4 April 2025). https://blog.sigstore.dev/model-transparency-v1.0 . fetched.
- [G19] ReversingLabs, malicious ML models on Hugging Face (6 February 2025). https://www.reversinglabs.com/blog/rl-identifies-malware-ml-model-hosted-on-hugging-face . fetched.
- [G20] Anthropic, A small number of samples can poison LLMs of any size (9 October 2025). https://www.anthropic.com/research/small-samples-poison . fetched.
- [G21] Sleeper Agents, arXiv 2401.05566. https://arxiv.org/abs/2401.05566 . fetched.
- [G22] The Instruction Hierarchy, arXiv 2404.13208. https://arxiv.org/abs/2404.13208 . fetched.
- [G23] Lessons from Defending Gemini Against Indirect Prompt Injections, arXiv 2505.14534. https://arxiv.org/abs/2505.14534 . fetched (abstract only; no numbers taken).
- [G24] MSRC, How Microsoft defends against indirect prompt injection attacks (29 July 2025). https://www.microsoft.com/en-us/msrc/blog/2025/07/how-microsoft-defends-against-indirect-prompt-injection-attacks . fetched.
- [G25] AgentDojo, arXiv 2406.13352. https://arxiv.org/abs/2406.13352 . fetched.
- [G26] Simon Willison, The lethal trifecta for AI agents (16 June 2025). https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/ . fetched.
- [G27] Meta AI, Agents Rule of Two (31 October 2025). https://ai.meta.com/blog/practical-ai-agent-security/ . fetched.
- [G28] Defeating Prompt Injections by Design (CaMeL), arXiv 2503.18813. https://arxiv.org/abs/2503.18813 . fetched.
- [G29] Securing AI Agents with Information-Flow Control (FIDES), arXiv 2505.23643. https://arxiv.org/abs/2505.23643 . fetched.
- [G30] LlamaFirewall, arXiv 2505.03574. https://arxiv.org/abs/2505.03574 . fetched (abstract only; no numbers; supports the B2 classifier discussion).
- [G31] The Attacker Moves Second, arXiv 2510.09023. https://arxiv.org/abs/2510.09023 . fetched.
- [G32] Anthropic, Mitigating the risk of prompt injections in browser use (24 November 2025). https://www.anthropic.com/research/prompt-injection-defenses . fetched.
- [G33] OpenAI, Continuously hardening ChatGPT Atlas against prompt injection attacks (22 December 2025). https://openai.com/index/hardening-atlas-against-prompt-injection/ . curl.
- [G34] Claude Code docs, Permission modes. https://code.claude.com/docs/en/permission-modes . curl (Markdown version).
- [G35] Anthropic Engineering, Claude Code auto mode (25 March 2026). https://www.anthropic.com/engineering/claude-code-auto-mode . fetched.
- [G36] OWASP GenAI LLM Top 10 2026 resource page (3 August 2026). https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/ . fetched (the list is in the download, not the page text).
- [G37] OWASP GenAI blog, 2026 Top 10 and Agent Control Standard (1 September 2026). https://genai.owasp.org/2026/09/01/owasp-genai-security-project-unveils-2026-top-10-for-llm-applications-new-agent-control-standard-and-sponsors-as-community-tops-30000-members/ . fetched.
- [G38] CSA research note, OWASP's 2026 LLM Top 10 and new Agent Control Standard. https://labs.cloudsecurityalliance.org/research/csa-research-note-owasp-genai-top10-2026-agent-control-stand/ . fetched, secondary.
- [G39] OWASP Top 10 for Agentic Applications for 2026 (9 December 2025). https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/ . fetched (also lists the GenAI Red Teaming Manual 1.0, 20 October 2026, and ACS, 1 September 2026).
- [G40] OWASP LLM05:2025 Improper Output Handling. https://genai.owasp.org/llmrisk/llm052025-improper-output-handling/ . fetched.
- [G41] OWASP LLM10:2025 Unbounded Consumption. https://genai.owasp.org/llmrisk/llm102025-unbounded-consumption/ . fetched.
- [G42] NIST AI Risk Management Framework. https://www.nist.gov/itl/ai-risk-management-framework . fetched.
- [G43] NIST IR 8596 Cyber AI Profile, initial preliminary draft. https://csrc.nist.gov/pubs/ir/8596/iprd . fetched.
- [G44] NIST SP 800-61 Rev. 3. https://csrc.nist.gov/pubs/sp/800/61/r3/final . fetched.
- [G45] EU AI Act implementation timeline (page updated 31 August 2026). https://artificialintelligenceact.eu/implementation-timeline/ . fetched.
- [G46] EU AI Act Article 15. https://artificialintelligenceact.eu/article/15/ . fetched.
- [G47] EU AI Act Article 99. https://artificialintelligenceact.eu/article/99/ . fetched.
- [G48] CSA research note, The SOC 2 AI gap (30 August 2026). https://labs.cloudsecurityalliance.org/research/csa-research-note-soc2-ai-controls-gap-20260830-csa-styled/ . fetched, secondary.
- [G49] IEC webstore, ISO/IEC 42001:2023. https://webstore.iec.ch/publication/90574 . search only (iso.org returned 403).
- [G50] AIUC-1. https://www.aiuc-1.com/ . fetched (vendor-maintained standard).
- [G51] CVE-2025-6514 (mcp-remote). https://cveawg.mitre.org/api/cve/CVE-2025-6514 . API.
- [G52] CVE-2025-49596 (MCP Inspector). https://cveawg.mitre.org/api/cve/CVE-2025-49596 . API.
- [G53] CVE-2025-54135 (Cursor). https://cveawg.mitre.org/api/cve/CVE-2025-54135 . API.
- [G54] CVE-2025-54795 (Claude Code). https://cveawg.mitre.org/api/cve/CVE-2025-54795 . API.
- [G55] CVE-2025-53773 (GitHub Copilot and Visual Studio). https://cveawg.mitre.org/api/cve/CVE-2025-53773 . API.
- [G56] AWS security bulletin AWS-2025-015, Amazon Q Developer for VS Code 1.84. https://aws.amazon.com/security/security-bulletins/AWS-2025-015/ . fetched.
- [G57] Nx advisory GHSA-cxm3-wv7p-598c. https://github.com/nrwl/nx/security/advisories/GHSA-cxm3-wv7p-598c . fetched.
- [G58] StepSecurity, Nx build system package compromised (27 August 2025). https://www.stepsecurity.io/blog/supply-chain-security-alert-popular-nx-build-system-package-compromised-with-data-stealing-malware . fetched, secondary.
- [G59] The Hacker News, First malicious MCP server found (September 2025). https://thehackernews.com/2025/09/first-malicious-mcp-server-found.html . search only, secondary.
- [G60] Invariant Labs, MCP tool poisoning attacks (1 April 2025). https://invariantlabs.ai/blog/mcp-security-notification-tool-poisoning-attacks . fetched.
- [G61] Embrace The Red, DeepSeek AI prompt injection to XSS and account takeover (29 November 2024). https://embracethered.com/blog/posts/2024/deepseek-ai-prompt-injection-to-xss-and-account-takeover/ . fetched.
- [G62] Anthropic, Disrupting the first reported AI-orchestrated cyber espionage campaign (13 November 2025). https://www.anthropic.com/news/disrupting-AI-espionage . fetched.
- [G63] CoSAI AI Incident Response Framework v1.0 (PDF). https://www.coalitionforsecureai.org/wp-content/uploads/2026/03/AI-Incident-Response-1.pdf . fetched (text extracted with pdftotext).
- [G64] OASIS, CoSAI releases model signing and incident response frameworks (18 November 2025). https://www.oasis-open.org/2025/11/18/coalition-for-secure-ai-releases-two-actionable-frameworks-for-ai-model-signing-and-incident-response . search only.
- [G65] OpenTelemetry GenAI semantic conventions, spans. https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/gen-ai-spans.md . curl (raw file).
- [G66] Claude docs, Managed Agents vaults. https://platform.claude.com/docs/en/managed-agents/vaults . curl (Markdown version).
- [G67] GitHub docs, Risks and mitigations for Copilot cloud agent. https://docs.github.com/en/copilot/concepts/agents/coding-agent/risks-and-mitigations . fetched.
- [G68] Claude docs, Data residency. https://platform.claude.com/docs/en/manage-claude/data-residency . curl (Markdown version).
- [G69] Claude docs, Rate limits. https://platform.claude.com/docs/en/api/rate-limits . curl (Markdown version).
- [G70] Auditing Prompt Caching in Language Model APIs, arXiv 2502.07776. https://arxiv.org/abs/2502.07776 . fetched.
- [G71] vLLM advisory GHSA-935w-9g4m-p28p. https://github.com/advisories/GHSA-935w-9g4m-p28p . API.
- [G72] promptfoo docs, red team quickstart. https://www.promptfoo.dev/docs/red-team/quickstart/ . fetched.
- [G73] OpenAI, OpenAI to acquire Promptfoo (9 March 2026). https://openai.com/index/openai-to-acquire-promptfoo/ . curl.
- [G74] Azure/PyRIT (archived). https://github.com/Azure/PyRIT . fetched.
- [G75] RFC 8693, OAuth 2.0 Token Exchange. https://www.rfc-editor.org/rfc/rfc8693.html . fetched.
- [G76] OWASP LLM01:2025 Prompt Injection. https://genai.owasp.org/llmrisk/llm01-prompt-injection/ . via tracks/safety.md.
- [G77] OWASP LLM Prompt Injection Prevention Cheat Sheet. https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html . via tracks/safety.md.
- [G78] Design Patterns for Securing LLM Agents against Prompt Injections, arXiv 2506.08837. https://arxiv.org/abs/2506.08837 . via tracks/safety.md.
- [G79] EchoLeak, arXiv 2509.10540. https://arxiv.org/abs/2509.10540 . via tracks/safety.md.
- [G80] CVE-2025-32711 (EchoLeak). https://cveawg.mitre.org/api/cve/CVE-2025-32711 . via tracks/safety.md.
- [G81] Invariant Labs, GitHub MCP exploited (26 May 2025). https://invariantlabs.ai/blog/mcp-github-vulnerability . via tracks/safety.md.
- [G82] Simon Willison, Supabase MCP lethal trifecta (6 July 2025). https://simonwillison.net/2025/Jul/6/supabase-mcp-lethal-trifecta/ . via tracks/safety.md.
- [G83] NVIDIA garak. https://github.com/NVIDIA/garak . via tracks/safety.md.
- [G84] Llama Prompt Guard 2 86M model card. https://huggingface.co/meta-llama/Llama-Prompt-Guard-2-86M . via tracks/safety.md.
- [G85] Presidio. https://presidio.dataprivacystack.org/ . via tracks/safety.md.
- [G86] Simon Willison, markdown-exfiltration tag. https://simonwillison.net/tags/markdown-exfiltration/ . via tracks/safety.md.
- [G87] We Have a Package for You! (package hallucination), arXiv 2406.10279. https://arxiv.org/abs/2406.10279 . via tracks/safety.md.

Interview-question sources:

- [Q1] knok.work, Anthropic Security Engineer Interview (updated 28 October 2026). https://knok.work/blog/anthropic-security-engineer-interview.html . fetched, secondary (questions described as candidate-reported, compiled from public guides, hiring-manager debriefs and candidate reports).
- [Q2] techinterview.org, The prompt injection questions LLM security interviews keep asking (6 August 2026). https://www.techinterview.org/post/3233477256/prompt-injection-llm-security-interview-questions/ . fetched, secondary.
- [Q3] techinterview.org, Prompt injection is still unsolved, and interviewers know it (8 August 2026). https://www.techinterview.org/post/3233477280/prompt-injection-llm-security-interview/ . fetched, secondary.
- [Q4] PracHub, Design a sandboxed cloud IDE (OpenAI tag; last updated 9 April 2026). https://prachub.com/interview-questions/design-a-sandboxed-cloud-ide . fetched, secondary.
- [Q5] Practical DevSecOps, AI Security Interview Questions (updated 4 September 2026). https://www.practical-devsecops.com/ai-security-interview-questions/ . fetched, secondary.
- [Q6] InterviewsVector, AI Agent Security Interview Guide (20 August 2026). https://www.interviewsvector.com/blog/ai-agent-security-interview-guide-prompt-injection-excessive-agency-tool-abuse . fetched, secondary (FAQ headings).
- [Q7] Cloud Security Guy, Want an AI Security Engineer job in 2026? (25 October 2026). https://cloudsecurityguy.substack.com/p/want-an-ai-security-engineer-job . fetched, secondary.
- [Q8] ombharatiya/ai-system-design-guide, question bank. https://github.com/ombharatiya/ai-system-design-guide/blob/main/00-interview-prep/01-question-bank.md . curl (raw file), secondary; dated claims inside questions not verified.
- [Q9] CleverPrep, Anthropic Security Engineer (content updated 24 August 2026). https://www.cleverprep.com/companies/anthropic/security-engineer . fetched, secondary (question patterns, not attributed to candidates).

Source count: 87 content sources ([G1] to [G87]) and 9 interview-question sources ([Q1] to [Q9]), 96 in total. Of the 87, 75 were read in this pass and 12 were reused from `research/tracks/safety.md`.
