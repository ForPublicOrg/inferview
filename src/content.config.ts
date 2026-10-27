// Content collections: lessons and problems, validated by the shared schemas in src/lib/schemas.ts.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { lessonSchema, problemSchema } from './lib/schemas.ts';

const stripExt = (p: string) => p.replace(/\.mdx?$/, '');

const lessons = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/lessons', generateId: ({ entry }) => stripExt(entry) }),
  schema: lessonSchema,
});

const problems = defineCollection({
  loader: glob({
    pattern: '**/*.mdx',
    base: './src/content/problems',
    generateId: ({ entry }) => stripExt(entry.split('/').pop() ?? entry),
  }),
  schema: problemSchema,
});

export const collections = { lessons, problems };
