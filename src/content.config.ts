// Content collections: lessons, problems and labs, validated by the shared schemas in src/lib/schemas.ts.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { lessonSchema, problemSchema, labSchema } from './lib/schemas.ts';

const stripExt = (p: string) => p.replace(/\.mdx?$/, '');
const fileName = (p: string) => stripExt(p.split('/').pop() ?? p);

// Lesson ids are "<track>/<module>/<lesson-slug>", the path under src/content/lessons.
const lessons = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/lessons', generateId: ({ entry }) => stripExt(entry) }),
  schema: lessonSchema,
});

const problems = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/problems', generateId: ({ entry }) => fileName(entry) }),
  schema: problemSchema,
});

const labs = defineCollection({
  loader: glob({ pattern: '*.mdx', base: './src/content/labs', generateId: ({ entry }) => fileName(entry) }),
  schema: labSchema,
});

export const collections = { lessons, problems, labs };
