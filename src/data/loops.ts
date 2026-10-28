// Mock loop presets (SPEC section 11) and the seeded pick that turns a preset, a length and a seed into a session.
// A preset weights each problem by track times type; a track or type missing from the preset has weight 0.
// Each preset either cites the public source its shape follows or says plainly that the shape is Inferview's own.

export type LoopSource = { title: string; url: string };

export type LoopPreset = {
  slug: string;
  title: string;
  summary: string;
  tracks: Record<string, number>;
  types: Record<string, number>;
  source?: LoopSource;
  /** How the weights relate to the source, or why there is none. */
  note: string;
};

export const LOOP_MINUTES = [30, 45, 60, 90] as const;
export const DEFAULT_MINUTES = 60;

export const LOOPS: LoopPreset[] = [
  {
    slug: 'applied-ai',
    title: 'Applied AI engineer',
    summary: 'Retrieval, prompting, evals, workflows and agents, with coding and debugging rounds and one design round.',
    tracks: { apis: 3, rag: 3, evals: 3, agents: 3, workflows: 2, llmops: 2, 'system-design': 2, rounds: 2, harness: 1, foundations: 1, safety: 1, inference: 1 },
    types: { code: 3, debug: 3, design: 2, concept: 2, critique: 2, workflow: 2, multistage: 1, worksample: 1, estimate: 1, mcq: 1, behavioural: 1 },
    source: {
      title: 'What applied-AI engineer interviews test in 2026 (techinterview.org, vendor guide)',
      url: 'https://www.techinterview.org/post/3233476824/ai-engineer-interview-rag-agents-evals/',
    },
    note: 'The source describes a phone screen on retrieval and prompting, a take-home that builds and measures an LLM system, live coding and debugging, a system design round around evals and serving, and a customer or product-sense round. It gives no weights; the numbers here are Inferview\'s.',
  },
  {
    slug: 'ml-infra',
    title: 'ML infrastructure engineer',
    summary: 'Serving, batching, KV cache, distributed training and capacity estimates, with design rounds and some model internals.',
    tracks: { inference: 4, training: 4, 'system-design': 3, foundations: 2, llmops: 1, evals: 1, apis: 1, rounds: 1 },
    types: { estimate: 3, design: 3, debug: 2, code: 2, concept: 2, multistage: 1, replay: 1, mcq: 1, critique: 1, workflow: 1 },
    note: 'No public source describing this loop was found. The shape is Inferview\'s own: the heaviest weights go to inference and training, the tracks written for infrastructure loops, and no company\'s loop is implied.',
  },
  {
    slug: 'ai-security',
    title: 'AI security engineer',
    summary: 'Threat modeling, prompt injection, agent permissions, sandboxes and MCP security, and RAG isolation, mostly design and debug.',
    tracks: { security: 4, safety: 4, agents: 2, harness: 1, rag: 1, 'system-design': 1, apis: 1 },
    types: { design: 3, debug: 3, concept: 2, critique: 2, replay: 1, code: 1, mcq: 1, estimate: 1, workflow: 1 },
    source: {
      title: 'Want an AI Security Engineer job in 2026? (Cloud Security Guy)',
      url: 'https://cloudsecurityguy.substack.com/p/want-an-ai-security-engineer-job',
    },
    note: 'The source lists skills from AI security job descriptions, among them threat modelling, prompt injection, RAG security, AI agents and AI red teaming, and interview questions built on them. It describes no rounds; the weights here are Inferview\'s.',
  },
  {
    slug: 'research-engineer',
    title: 'Research engineer',
    summary: 'Model internals written by hand, training and post-training, long context and multimodal models, evals and estimates, with fewer product and design rounds.',
    tracks: { foundations: 3, training: 4, multimodal: 3, evals: 3, inference: 2, rounds: 2, rag: 1 },
    types: { code: 3, concept: 2, estimate: 2, debug: 2, mcq: 1, design: 1, critique: 1, presentation: 1 },
    note: 'No public source describing this loop was found. The shape is Inferview\'s own: the heaviest weights go to training, multimodal, foundations and evals, the tracks closest to model internals, and no company\'s loop is implied.',
  },
];

export function getLoop(slug: string | null | undefined): LoopPreset {
  return LOOPS.find((l) => l.slug === slug) ?? LOOPS[0]!;
}

export type LoopProblem = { id: string; track: string; type: string; minutes: number };

/** FNV-1a over the string, the same hash the daily problem uses. */
function hash(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/** mulberry32: a small seeded generator, so the same seed gives the same sequence in every browser. */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Weighted draw without replacement until no remaining problem fits the minutes left. `pool` must be sorted by id
 * (the build does that), so a seed reproduces the same session for as long as the bank is unchanged.
 */
export function pickSession<T extends LoopProblem>(pool: T[], preset: LoopPreset, minutes: number, seed: string): T[] {
  const next = rng(hash(`${preset.slug}|${minutes}|${seed}`));
  let left = minutes;
  let cands = pool
    .map((p) => ({ p, w: (preset.tracks[p.track] ?? 0) * (preset.types[p.type] ?? 0) }))
    .filter((c) => c.w > 0);
  const out: T[] = [];
  for (;;) {
    const fit = cands.filter((c) => c.p.minutes <= left);
    if (!fit.length) break;
    const total = fit.reduce((n, c) => n + c.w, 0);
    let t = next() * total;
    const pick = fit.find((c) => (t -= c.w) < 0) ?? fit[fit.length - 1]!;
    out.push(pick.p);
    left -= pick.p.minutes;
    cands = cands.filter((c) => c !== pick);
  }
  return out;
}

export function cleanSeed(s: string | null | undefined): string {
  return (s ?? '').toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 32);
}
