// Named lists. Core 100 is computed from `core: true` in problem frontmatter; the crunch path is a fixed id list.

export type NamedList = { slug: string; title: string; description: string };

export const CORE: NamedList = {
  slug: 'core',
  title: 'Core 100',
  description: 'The problems marked core across every track: the default path through the bank.',
};

// The crunch path, in reading order, from research/curriculum-v2.json (crunch).
// npm run validate fails on an unknown or repeated id.
export const CRUNCH: NamedList & { ids: string[] } = {
  slug: 'crunch',
  title: 'Crunch path',
  description:
    'For a loop that starts within a week: 25 problems from 14 tracks, starting with agents and harnesses, mixing debug, critique, workflow, estimate, code, design and behavioural rounds.',
  ids: [
    'agt-002', // agent-loop, debug
    'hrn-002', // harness-anatomy, critique
    'hrn-022', // cache-cost-latency, debug
    'api-023', // prompting, workflow
    'wfl-001', // patterns, workflow
    'wfl-024', // approvals-handoffs, critique
    'hrn-030', // permissions-sandboxing, estimate
    'hrn-046', // evaluating-harnesses, concept
    'sec-001', // secure-architecture, workflow
    'sec-014', // sandboxing-secrets, concept
    'evl-009', // llm-judge, code
    'wfl-008', // durable-execution, debug
    'rag-033', // vector-systems, debug
    'inf-006', // batching, code
    'rnd-018', // hand-write, code
    'rnd-023', // llm-app-coding, multistage
    'rnd-028', // take-home-debug, worksample
    'rnd-032', // codebase-rounds, repo
    'sfe-021', // injection-defences, workflow
    'rnd-054', // behavioural, behavioural
    'ops-007', // releases-experiments, estimate
    'trn-013', // distributed, design
    'sys-018', // framework, workflow
    'fnd-008', // sampling, debug
    'sec-028', // output-data, debug
  ],
};
