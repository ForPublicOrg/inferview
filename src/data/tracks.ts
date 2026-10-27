// The nine tracks and their modules in site order (SPEC section 4). Slugs are fixed; titles follow research/brief.json.
// Imported by the site and by scripts/validate-content.mjs, so keep this file free of extensionless relative imports.

export type Module = { slug: string; title: string };
export type Track = {
  slug: string;
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
    blurb: 'Enough model internals to reason about cost, latency and failure modes: tokens, embeddings, attention, sampling, training stages and model choice.',
    modules: [
      { slug: 'tokens', title: 'Tokens and tokenization' },
      { slug: 'embeddings', title: 'Embeddings and similarity' },
      { slug: 'attention', title: 'Attention and the transformer in one sitting' },
      { slug: 'sampling', title: 'Next-token prediction and sampling' },
      { slug: 'training', title: 'Training stages and adapting models' },
      { slug: 'model-landscape', title: 'Model landscape and selection' },
    ],
  },
  {
    slug: 'apis',
    code: 'api',
    title: 'Building with model APIs',
    short: 'APIs',
    blurb: 'Prompts treated as production code: streaming, retries, structured outputs, tool calling, context engineering and caching.',
    modules: [
      { slug: 'api-anatomy', title: 'API anatomy, streaming and reliability' },
      { slug: 'prompting', title: 'Prompting that survives production' },
      { slug: 'structured-outputs', title: 'Structured outputs and tool calling' },
      { slug: 'context-engineering', title: 'Context engineering and caching' },
      { slug: 'frameworks', title: 'Frameworks vs no framework' },
    ],
  },
  {
    slug: 'evals',
    code: 'evl',
    title: 'Evals and observability',
    short: 'Evals',
    blurb: 'Error analysis, golden sets, calibrated LLM judges, agent evaluation, and evals that run in CI and in production.',
    modules: [
      { slug: 'eval-thinking', title: 'Eval thinking and error analysis' },
      { slug: 'golden-sets', title: 'Golden sets and metrics' },
      { slug: 'llm-judge', title: 'LLM-as-judge, calibrated' },
      { slug: 'agent-evals', title: 'Evaluating agents and public benchmarks' },
      { slug: 'evals-in-ci', title: 'Evals in CI, monitoring and feedback loops' },
    ],
  },
  {
    slug: 'rag',
    code: 'rag',
    title: 'Retrieval and RAG',
    short: 'RAG',
    blurb: 'Retrieval as search engineering first, then chunking, hybrid search, reranking, advanced patterns and diagnosing a broken pipeline.',
    modules: [
      { slug: 'retrieval-foundations', title: 'Retrieval foundations' },
      { slug: 'ingestion', title: 'Ingestion and chunking' },
      { slug: 'hybrid-search', title: 'Hybrid search, reranking and query transformation' },
      { slug: 'advanced-rag', title: 'Advanced RAG patterns' },
      { slug: 'debugging-rag', title: 'Debugging a broken RAG system' },
    ],
  },
  {
    slug: 'agents',
    code: 'agt',
    title: 'Agents and protocols',
    short: 'Agents',
    blurb: 'The agent loop, tool design with MCP and A2A, memory and durable state, multi-agent failure modes, and coding and computer-use agents.',
    modules: [
      { slug: 'agent-loop', title: 'The agent loop' },
      { slug: 'tools-mcp-a2a', title: 'Tool design, MCP and A2A' },
      { slug: 'memory-state', title: 'Memory, state and durable execution' },
      { slug: 'multi-agent', title: 'Multi-agent systems and failure modes' },
      { slug: 'coding-agents', title: 'Computer use, coding agents and autonomy controls' },
    ],
  },
  {
    slug: 'safety',
    code: 'sfe',
    title: 'Security, safety and guardrails',
    short: 'Safety',
    blurb: 'Threat models for LLM systems, prompt injection, guardrails, permissions and isolation, and hallucination.',
    modules: [
      { slug: 'threat-modeling', title: 'Threat modeling LLM systems' },
      { slug: 'red-team', title: 'Red-team game' },
      { slug: 'guardrails', title: 'Guardrails, permissions and isolation' },
      { slug: 'hallucination', title: 'Hallucination, safety and responsible AI' },
    ],
  },
  {
    slug: 'inference',
    code: 'inf',
    title: 'Inference, serving and cost',
    short: 'Inference',
    blurb: 'Prefill and decode, the KV cache, continuous batching, quantization and speculative decoding, gateways and cost control.',
    modules: [
      { slug: 'inference-anatomy', title: 'Anatomy of inference' },
      { slug: 'batching', title: 'Batching and PagedAttention' },
      { slug: 'faster-cheaper', title: 'Making it faster and cheaper' },
      { slug: 'gateways-finops', title: 'Gateways, routing and FinOps' },
      { slug: 'operating', title: 'Deploying and operating LLM services' },
    ],
  },
  {
    slug: 'system-design',
    code: 'sys',
    title: 'AI system design',
    short: 'System design',
    blurb: 'A repeatable framework for the design round, capacity and cost estimates, and case studies for retrieval, agentic and real-time systems.',
    modules: [
      { slug: 'framework', title: 'Delivery framework and rubric' },
      { slug: 'capacity', title: 'Capacity and cost workshop' },
      { slug: 'case-retrieval', title: 'Case studies: retrieval-centric systems' },
      { slug: 'case-agents', title: 'Case studies: agentic systems' },
      { slug: 'case-realtime', title: 'Case studies: real-time and specialized systems' },
    ],
  },
  {
    slug: 'rounds',
    code: 'rnd',
    title: 'Coding rounds, behavioural and customer craft',
    short: 'Rounds',
    blurb: 'Hand-written model code, LLM-app coding, take-home and debug rounds, AI-collaborative coding, customer craft and behavioural stories.',
    modules: [
      { slug: 'hand-write', title: 'Hand-write it' },
      { slug: 'llm-app-coding', title: 'LLM-app coding problems' },
      { slug: 'take-home-debug', title: 'Take-home and debug rounds' },
      { slug: 'ai-collab-coding', title: 'AI-collaborative coding round' },
      { slug: 'customer-craft', title: 'Customer craft and product sense' },
      { slug: 'behavioural', title: 'Behavioural, stories and company loops' },
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
