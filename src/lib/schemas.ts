// Zod schemas for lessons and problems (SPEC sections 5 and 6), shared by content.config.ts and scripts/validate-content.mjs.
// Node runs this file directly with type stripping, so imports must carry their .ts extension.
import { z } from 'astro/zod';
import { TRACKS, TRACK_SLUGS, getModule } from '../data/tracks.ts';

const TRACK_CODE: Record<string, string> = Object.fromEntries(TRACKS.map((t) => [t.slug, t.code]));

const httpUrl = z
  .string()
  .url()
  .refine((u) => /^https?:\/\//.test(u), { message: 'must be an http or https URL' });

export const sourceSchema = z
  .object({
    title: z.string().min(1),
    url: httpUrl,
    note: z.string().optional(),
  })
  .strict();

const date = z.coerce.date();
const nonEmpty = z.string().trim().min(1);

export const lessonSchema = z
  .object({
    title: nonEmpty,
    track: z.enum(TRACK_SLUGS),
    module: nonEmpty,
    order: z.number().int().positive(),
    minutes: z.number().int().positive(),
    summary: nonEmpty,
    prerequisites: z.array(z.string().regex(/^[a-z0-9-]+\/[a-z0-9-]+$/, 'use "track/lesson"')).default([]),
    updated: date,
    sources: z.array(sourceSchema).min(1),
  })
  .strict()
  .superRefine((d, ctx) => {
    if (!getModule(d.track, d.module)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['module'], message: `module "${d.module}" is not in track "${d.track}"` });
    }
  });

export const PROBLEM_TYPES = ['concept', 'estimate', 'debug', 'code', 'design', 'behavioural', 'mcq'] as const;
export const GRADABLE_TYPES = ['mcq', 'debug', 'code', 'estimate'] as const;
export const DIFFICULTIES = ['easy', 'medium', 'hard'] as const;
export const SENIORITIES = ['mid', 'senior', 'staff'] as const;

export const choiceSchema = z
  .object({
    text: nonEmpty,
    correct: z.boolean().default(false),
    why: nonEmpty,
  })
  .strict();

export const codeSchema = z
  .object({
    starter: z.string().min(1),
    tests: z.string().min(1),
    solution: z.string().min(1),
  })
  .strict();

export const rangeSchema = z
  .object({
    low: z.number(),
    high: z.number(),
    unit: nonEmpty,
  })
  .strict()
  .refine((r) => r.low <= r.high, { message: 'range.low must be <= range.high' });

export const companySchema = z.object({ name: nonEmpty, url: httpUrl }).strict();

export const problemSchema = z
  .object({
    id: z.string().regex(/^(fnd|api|evl|rag|agt|sfe|inf|sys|rnd)-\d{3}$/, 'id must look like agt-002'),
    title: nonEmpty,
    subtitle: z.string().optional(),
    track: z.enum(TRACK_SLUGS),
    module: nonEmpty,
    type: z.enum(PROBLEM_TYPES),
    difficulty: z.enum(DIFFICULTIES),
    seniority: z.array(z.enum(SENIORITIES)).min(1),
    minutes: z.number().int().positive(),
    core: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    companies: z.array(companySchema).default([]),
    updated: date,
    sources: z.array(sourceSchema).default([]),
    choices: z
      .array(choiceSchema)
      .min(3)
      .max(5)
      .refine((cs) => cs.filter((c) => c.correct).length === 1, { message: 'exactly one choice must have correct: true' })
      .optional(),
    range: rangeSchema.optional(),
    code: codeSchema.optional(),
  })
  .strict()
  .superRefine((d, ctx) => {
    const issue = (path: string, message: string) => ctx.addIssue({ code: z.ZodIssueCode.custom, path: [path], message });
    if (!getModule(d.track, d.module)) issue('module', `module "${d.module}" is not in track "${d.track}"`);
    if (d.id.slice(0, 3) !== TRACK_CODE[d.track]) issue('id', `id prefix must be "${TRACK_CODE[d.track]}" for track ${d.track}`);
    if ((d.type === 'mcq' || d.type === 'debug') && !d.choices) issue('choices', `${d.type} problems need choices`);
    if (d.type !== 'mcq' && d.type !== 'debug' && d.choices) issue('choices', 'choices are only for mcq and debug problems');
    if (d.type === 'estimate' && !d.range) issue('range', 'estimate problems need a range');
    if (d.type !== 'estimate' && d.range) issue('range', 'range is only for estimate problems');
    if (d.type === 'code' && !d.code) issue('code', 'code problems need code.starter, code.tests and code.solution');
    if (d.type !== 'code' && d.code) issue('code', 'code is only for code problems');
  });

export type LessonData = z.infer<typeof lessonSchema>;
export type ProblemData = z.infer<typeof problemSchema>;
export type ProblemType = (typeof PROBLEM_TYPES)[number];

export function isGradable(type: string): boolean {
  return (GRADABLE_TYPES as readonly string[]).includes(type);
}

// Problem body headings, in the order SPEC section 6 requires.
export const PROBLEM_SECTIONS = ['Question', 'Hints', 'Answer', 'Follow-ups', 'Common mistakes'] as const;
export const PROBLEM_REQUIRED = ['Question', 'Answer'] as const;
