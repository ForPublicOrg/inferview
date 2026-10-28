// The 15 tracks and their modules in site order (SPEC section 4), generated from research/curriculum-v2.json.
// Slugs and codes are fixed. Imported by the site and by scripts/validate-content.mjs, so keep this file free of
// extensionless relative imports.

export type Module = { slug: string; title: string };
export type Track = {
  slug: string;
  /** Three-letter prefix of every problem id in the track. */
  code: string;
  title: string;
  short: string;
  blurb: string;
  modules: Module[];
};

export const TRACKS: Track[] = [
  {
    slug: 'foundations',
    code: 'fnd',
    title: 'LLM foundations for software engineers',
    short: 'Foundations',
    blurb: 'The internals that set cost, latency and failure modes, taught at the level of a design review rather than an introduction.',
    modules: [
      { slug: 'tokens', title: 'Tokenizers as cost, capacity and security surface' },
      { slug: 'embeddings', title: 'Embeddings: operation and training' },
      { slug: 'attention', title: 'Attention layouts as serving decisions' },
      { slug: 'sampling', title: 'Decoding, determinism and constrained output' },
      { slug: 'training', title: 'The training pipeline, mapped for application engineers' },
      { slug: 'model-landscape', title: 'Model selection from evidence' },
    ],
  },
  {
    slug: 'apis',
    code: 'api',
    title: 'Building with model APIs',
    short: 'APIs',
    blurb: 'Client engineering against model APIs as a reliability discipline: stream contracts, the two kinds of 429, failover that does not change behaviour, prompts that survive upgrades, structured output guarantees, prompt caching mechanics, and what a framework or agent SDK buys.',
    modules: [
      { slug: 'api-anatomy', title: 'Client reliability against model APIs' },
      { slug: 'prompting', title: 'Prompts that survive model upgrades' },
      { slug: 'structured-outputs', title: 'Structured outputs and tool calling' },
      { slug: 'context-engineering', title: 'Context and prompt caching' },
      { slug: 'frameworks', title: 'Frameworks, SDKs and what to own' },
    ],
  },
  {
    slug: 'evals',
    code: 'evl',
    title: 'Evals and observability',
    short: 'Evals',
    blurb: 'Evaluation as an operating discipline: error analysis and the labelling operation, golden sets that expose known failures, judges validated like classifiers, agent evaluation over repeated trials, and merge gates with statistics that survive review.',
    modules: [
      { slug: 'eval-thinking', title: 'Error analysis and the labelling operation' },
      { slug: 'golden-sets', title: 'Golden sets and metrics' },
      { slug: 'llm-judge', title: 'LLM-as-judge, calibrated' },
      { slug: 'agent-evals', title: 'Evaluating agents' },
      { slug: 'evals-in-ci', title: 'Gates, online evals and success metrics' },
    ],
  },
  {
    slug: 'workflows',
    code: 'wfl',
    title: 'AI workflows and durable execution',
    short: 'Workflows',
    blurb: 'How to design and run AI workflows in production: the workflow-or-agent decision, the five patterns as code, durable execution engines and how each one replays, retries and idempotency when a step is a metered non-deterministic model call, approvals as a security boundary, batch stages, queues and per-step budgets, and workflow tracing and replay testing.',
    modules: [
      { slug: 'patterns', title: 'Workflow or agent, and which pattern' },
      { slug: 'durable-execution', title: 'Durable execution engines' },
      { slug: 'retries-flow-control', title: 'Retries, queues and per-step budgets' },
      { slug: 'approvals-handoffs', title: 'Approvals and handoffs between steps' },
      { slug: 'batch-pipelines', title: 'Batch stages and document pipelines' },
      { slug: 'operating-workflows', title: 'Observing, testing and choosing workflow tools' },
    ],
  },
  {
    slug: 'rag',
    code: 'rag',
    title: 'Retrieval and RAG',
    short: 'RAG',
    blurb: 'Retrieval as a systems problem: lexical and dense retrieval and what each misses, permissions and freshness against an ANN index, chunking chosen by eval, fusion and trained rerankers, late interaction and GraphRAG with their costs, locating failures by stage, vector index internals (HNSW by hand, filtered search, quantisation, object storage), and search evaluation with judgment pools and LLM assessors.',
    modules: [
      { slug: 'retrieval-foundations', title: 'Retrieval with permissions and freshness' },
      { slug: 'ingestion', title: 'Ingestion, parsing and chunking' },
      { slug: 'hybrid-search', title: 'Fusion, reranking and query transformation' },
      { slug: 'advanced-rag', title: 'Late interaction, GraphRAG and agentic retrieval' },
      { slug: 'debugging-rag', title: 'Locating RAG failures' },
      { slug: 'vector-systems', title: 'Vector index internals' },
      { slug: 'search-quality', title: 'Search evaluation' },
    ],
  },
  {
    slug: 'agents',
    code: 'agt',
    title: 'Agents and protocols',
    short: 'Agents',
    blurb: 'The agent loop and its economics, tools and protocols (MCP at the 2026-07-28 revision, A2A, Agent Skills), memory and long-lived state, multi-agent systems and their failure modes, and computer-use agents with autonomy controls.',
    modules: [
      { slug: 'agent-loop', title: 'The agent loop and its economics' },
      { slug: 'tools-mcp-a2a', title: 'Tools, MCP, A2A and skills' },
      { slug: 'memory-state', title: 'Memory and long-lived state' },
      { slug: 'multi-agent', title: 'Multi-agent systems and their failure modes' },
      { slug: 'coding-agents', title: 'Computer use, browser agents and autonomy controls' },
    ],
  },
  {
    slug: 'harness',
    code: 'hrn',
    title: 'Harness engineering and agentic coding tools',
    short: 'Harness',
    blurb: 'Everything between the user and the sampler in a coding agent: how a harness assembles each request, which controls are deterministic and which are the model deciding, tool sets built for models, memory files and compaction, prompt caching inside a harness, rule engines, sandboxes, hooks and classifier approvers, verification loops, long-running and parallel agents, and how to tell a harness effect from a model or infrastructure effect.',
    modules: [
      { slug: 'harness-anatomy', title: 'What the harness owns' },
      { slug: 'tools-aci', title: 'Tool sets for coding agents' },
      { slug: 'context-management', title: 'Context management in a harness' },
      { slug: 'cache-cost-latency', title: 'The harness\'s bill' },
      { slug: 'permissions-sandboxing', title: 'Permissions and policy in the harness' },
      { slug: 'verification', title: 'Verification: how the agent knows it is done' },
      { slug: 'long-running-parallel', title: 'Long-running and parallel agents' },
      { slug: 'evaluating-harnesses', title: 'Is harness B better than harness A?' },
    ],
  },
  {
    slug: 'safety',
    code: 'sfe',
    title: 'Prompt injection, guardrails and model safety',
    short: 'Safety',
    blurb: 'The model-facing half of AI security and safety: trust boundaries and exfiltration channels, adaptive red-teaming, prompt-injection defences split into those that hold by construction (CaMeL, FIDES, deterministic exfiltration blocks, the six design patterns) and those that only lower a rate (spotlighting, instruction hierarchy, classifiers) with their published limits, guardrails and tenant isolation, and hallucination and alignment topics engineers are asked about.',
    modules: [
      { slug: 'threat-modeling', title: 'Trust boundaries and exfiltration' },
      { slug: 'red-team', title: 'Adaptive red-teaming' },
      { slug: 'injection-defences', title: 'Prompt-injection defences: what holds and what lowers a rate' },
      { slug: 'guardrails', title: 'Guardrails, tool firewalls and tenant isolation' },
      { slug: 'hallucination', title: 'Hallucination, abstention and model safety' },
    ],
  },
  {
    slug: 'security',
    code: 'sec',
    title: 'Implementing security for AI systems',
    short: 'Security',
    blurb: 'Security as an implementation discipline for model systems, taken from threat model to architecture to controls to tests to operations: capability matrices and a test per control, permission systems and agent identity, isolation technology and what harness sandboxes leave outside, secrets kept out of context and sandbox, MCP authorisation implemented against its real CVEs, output-handling sinks and cross-tenant cache leakage, model supply chain (pickle, the weights_only bypass, safetensors, signing, poisoning), audit logging, abuse and incident response, security evals in CI, and the NIST, EU AI Act, SOC 2, ISO 42001 and privacy duties engineers implement.',
    modules: [
      { slug: 'secure-architecture', title: 'From threat model to tests' },
      { slug: 'permissions-identity', title: 'Permissions and agent identity' },
      { slug: 'sandboxing-secrets', title: 'Isolation and secrets' },
      { slug: 'mcp-security', title: 'MCP security implemented' },
      { slug: 'output-data', title: 'Output handling and data protection' },
      { slug: 'supply-chain', title: 'Model and agent supply chain' },
      { slug: 'security-ops', title: 'Security operations for AI features' },
      { slug: 'governance', title: 'Governance and privacy duties engineers implement' },
    ],
  },
  {
    slug: 'inference',
    code: 'inf',
    title: 'Inference, serving and cost',
    short: 'Inference',
    blurb: 'Serving models as a capacity and scheduling problem: prefill and decode on the roofline, KV capacity and compression, continuous batching, paged KV and chunked prefill, quantisation and speculative decoding, disaggregation, gateways and routing, SLOs and quality incidents with no model change, and fleet-scale routing, release pipelines, quota ledgers and adapter serving.',
    modules: [
      { slug: 'inference-anatomy', title: 'Prefill, decode and KV capacity' },
      { slug: 'batching', title: 'Continuous batching and the KV allocator' },
      { slug: 'faster-cheaper', title: 'Quantisation, speculation, caching and disaggregation' },
      { slug: 'gateways-finops', title: 'Gateways, routing and break-even' },
      { slug: 'operating', title: 'Operating model services' },
      { slug: 'fleet', title: 'Inference fleets: routing, release, quotas and adapters' },
    ],
  },
  {
    slug: 'llmops',
    code: 'ops',
    title: 'LLMOps, fine-tuning and AI product economics',
    short: 'LLMOps',
    blurb: 'The operating discipline around a model feature: prompts as versioned artefacts and the optimisers that search over them, releases with the statistics that make an A/B test defensible, drift and feedback loops that do not train sycophancy, curating data from production, fine-tuning as a project (with OpenAI\'s self-serve fine-tuning closed to new organisations and ending new jobs on 6 January 2027), unit economics per outcome and licence clauses, and the staff-level strategy, platform and governance questions.',
    modules: [
      { slug: 'prompt-lifecycle', title: 'Prompt registries and optimisers' },
      { slug: 'releases-experiments', title: 'Releases and experiments' },
      { slug: 'monitoring-feedback', title: 'Drift and feedback loops' },
      { slug: 'data-curation', title: 'Curating data from production' },
      { slug: 'fine-tuning', title: 'Fine-tuning in practice' },
      { slug: 'economics-selection', title: 'Unit economics, build or buy, and licences' },
      { slug: 'platform-strategy', title: 'Staff strategy, platforms and decision rights' },
    ],
  },
  {
    slug: 'training',
    code: 'trn',
    title: 'Training, post-training and infrastructure',
    short: 'Training',
    blurb: 'What ML infra and research-engineer loops ask first: training FLOPs, MFU and scaling laws, GPUs and kernels, distributed training (collectives, ZeRO and FSDP2, tensor, pipeline, context and expert parallelism), numerics and loss spikes, reliability at scale, pretraining data and ablations, mixture of experts, SFT and reward models, RL for LLMs (PPO, the GRPO family, verifiers, reward hacking, rollout-trainer mismatch), distillation and merging, and adapting models.',
    modules: [
      { slug: 'compute-scaling', title: 'Compute, scaling laws and the training budget' },
      { slug: 'gpu-kernels', title: 'GPUs, roofline and kernels for training' },
      { slug: 'distributed', title: 'Distributed training' },
      { slug: 'numerics', title: 'Precision, optimizers and stability' },
      { slug: 'reliability', title: 'Reliability at scale' },
      { slug: 'pretraining-data', title: 'Pretraining data and ablations' },
      { slug: 'moe', title: 'Mixture of experts in training' },
      { slug: 'post-training', title: 'SFT, preferences and reward models' },
      { slug: 'rl', title: 'Reinforcement learning for LLMs' },
      { slug: 'distill-merge', title: 'Distillation, merging and synthetic data' },
      { slug: 'adapting', title: 'Adapting models: LoRA, QLoRA and continued pretraining' },
    ],
  },
  {
    slug: 'multimodal',
    code: 'mml',
    title: 'Long context, architectures, multimodal and voice',
    short: 'Multimodal',
    blurb: 'RoPE scaling and attention sinks, testing long context when needle scores mislead, architectures beyond the dense transformer, what images, pages, video and audio cost in vision-language models, speech models and a voice turn measured stage by stage, and image and video generation for engineers who design and serve them.',
    modules: [
      { slug: 'long-context', title: 'Stretching and testing long context' },
      { slug: 'architectures', title: 'Architectures beyond the dense transformer' },
      { slug: 'vision-language', title: 'Vision-language models and their costs' },
      { slug: 'speech-voice', title: 'Speech models and voice agents' },
      { slug: 'generation', title: 'Image and video generation for engineers' },
    ],
  },
  {
    slug: 'system-design',
    code: 'sys',
    title: 'AI system design',
    short: 'System design',
    blurb: 'The design round taught as decisions under conflicting constraints: the delivery framework as a reference, capacity and cost with every assumption labelled, retrieval-centric, agentic and real-time cases, and platform cases (coding-agent platforms, agent platforms, shared eval platforms) that staff loops ask for.',
    modules: [
      { slug: 'framework', title: 'Design answers as decisions' },
      { slug: 'capacity', title: 'Capacity and cost' },
      { slug: 'case-retrieval', title: 'Retrieval-centric cases' },
      { slug: 'case-agents', title: 'Agentic cases' },
      { slug: 'case-realtime', title: 'Real-time and specialised cases' },
      { slug: 'case-platforms', title: 'Platform cases' },
    ],
  },
  {
    slug: 'rounds',
    code: 'rnd',
    title: 'Coding rounds, work samples, behavioural and customer craft',
    short: 'Rounds',
    blurb: 'The formats 2026 loops actually use: hand-written ML code with invariants, progressive multi-stage coding (in-memory database, KV store, file system, credit ledger) and integration exercises, take-homes and build-and-defend work samples (Sierra\'s Plan, Build and Review), repository bug squash and PR review, AI-assisted rounds scored on verification, customer discovery, product sense and FDE decomposition with regulated and government constraints, project deep dives and paper presentations, and staff behavioural stories with a dated loop atlas.',
    modules: [
      { slug: 'hand-write', title: 'Hand-written ML code' },
      { slug: 'llm-app-coding', title: 'Progressive-spec and integration coding' },
      { slug: 'take-home-debug', title: 'Take-homes and work samples' },
      { slug: 'codebase-rounds', title: 'Bug squash, PR review and code comprehension' },
      { slug: 'ai-collab-coding', title: 'AI-assisted rounds' },
      { slug: 'customer-craft', title: 'Customer discovery, product sense and decomposition' },
      { slug: 'deep-dives', title: 'Deep dives, presentations and quizzes' },
      { slug: 'behavioural', title: 'Staff behavioural stories and the loop atlas' },
    ],
  },
];

export const TRACK_SLUGS = TRACKS.map((t) => t.slug) as [string, ...string[]];
export const TRACK_CODES = TRACKS.map((t) => t.code);

export function getTrack(slug: string): Track | undefined {
  return TRACKS.find((t) => t.slug === slug);
}

export function getModule(track: string, module: string): Module | undefined {
  return getTrack(track)?.modules.find((m) => m.slug === module);
}

export function trackIndex(slug: string): number {
  return TRACKS.findIndex((t) => t.slug === slug);
}

export const MODULE_COUNT = TRACKS.reduce((n, t) => n + t.modules.length, 0);
