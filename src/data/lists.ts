// Named lists. Core 100 is computed from `core: true` in problem frontmatter; the crunch path is a fixed id list.

export type NamedList = { slug: string; title: string; description: string };

export const CORE: NamedList = {
  slug: 'core',
  title: 'Core 100',
  description: 'The problems marked core across all nine tracks. The target is one hundred; the count shown is what exists today.',
};

export const CRUNCH: NamedList & { ids: string[]; placeholder: boolean } = {
  slug: 'crunch',
  title: 'Crunch path',
  description: 'A short path for a loop that starts within a week.',
  // Placeholder chosen from the sample content until authors pick the real list; validate fails on unknown ids.
  ids: ['agt-002'],
  placeholder: true,
};
