// Zod schemas for lessons, problems and labs (SPEC sections 5, 6 and 10), shared by content.config.ts and scripts/validate-content.mjs.
// Node runs this file directly with type stripping, so imports must carry their .ts extension.
import { z } from 'astro/zod';
import { TRACKS, TRACK_SLUGS, TRACK_CODES, getModule } from '../data/tracks.ts';

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

const date = z.coerce.date({ errorMap: () => ({ message: 'use a date such as 2026-10-28: the day the content was checked against its sources' }) });
const nonEmpty = z.string().trim().min(1);

export const LESSON_KINDS = ['lesson', 'teardown', 'playbook', 'paper'] as const;
export const LEVELS = ['senior', 'staff'] as const;
/** Lesson and lab file names: lowercase words joined by hyphens. */
export const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
/** Problem ids: a track code from src/data/tracks.ts, a hyphen and three digits. */
export const PROBLEM_ID_RE = new RegExp(`^(${TRACK_CODES.join('|')})-\\d{3}$`);

export const lessonSchema = z
  .object({
    title: nonEmpty,
    track: z.enum(TRACK_SLUGS),
    module: nonEmpty,
    order: z
      .number({
        required_error: 'order is required: the position inside the module (0 for an overview, then 1, 2, 3)',
        invalid_type_error: 'order must be a whole number such as 1, not text',
      })
      .int('order must be a whole number such as 1')
      .nonnegative('order must be 0 or more'),
    kind: z.enum(LESSON_KINDS),
    level: z.enum(LEVELS),
    minutes: z.number().int().positive(),
    summary: nonEmpty,
    prerequisites: z.array(z.string().regex(/^[a-z0-9-]+\/[a-z0-9-]+\/[a-z0-9-]+$/, 'use "track/module/lesson"')).default([]),
    updated: date,
    sources: z.array(sourceSchema).min(1),
  })
  .strict()
  .superRefine((d, ctx) => {
    if (!getModule(d.track, d.module)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['module'], message: `module "${d.module}" is not in track "${d.track}"` });
    }
  });

export const PROBLEM_TYPES = [
  'concept', 'estimate', 'debug', 'code', 'design', 'behavioural', 'mcq', 'critique', 'workflow',
  'replay', 'multistage', 'repo', 'worksample', 'presentation',
] as const;
export type ProblemType = (typeof PROBLEM_TYPES)[number];
/** Readable names for the catalog, the problem page and the mock loop. */
export const TYPE_LABELS: Record<ProblemType, string> = {
  concept: 'Concept',
  estimate: 'Estimate',
  debug: 'Debug',
  code: 'Coding',
  design: 'Design',
  behavioural: 'Behavioural',
  mcq: 'Multiple choice',
  critique: 'Critique',
  workflow: 'Workflow',
  replay: 'Incident replay',
  multistage: 'Multi-stage coding',
  repo: 'Repository',
  worksample: 'Work sample',
  presentation: 'Presentation',
};
export const CHECKLIST_TYPES = ['critique', 'workflow', 'worksample', 'presentation'] as const;
export const CODE_TYPES = ['code', 'multistage', 'repo'] as const;
export const GRADABLE_TYPES = ['mcq', 'debug', 'code', 'estimate', 'replay', 'multistage', 'repo'] as const;
/** Gradable types short enough for the daily problem; multistage and repo problems run an hour or more. */
export const DAILY_TYPES = ['mcq', 'debug', 'code', 'estimate', 'replay'] as const;
export const DIFFICULTIES = ['easy', 'medium', 'hard'] as const;
export const SENIORITIES = ['senior', 'staff'] as const;
export const MIN_STAGES = 3;
export const MAX_STAGES = 4;
export const MIN_CHECKPOINTS = 2;

const exactlyOneCorrect = (cs: { correct: boolean }[]) => cs.filter((c) => c.correct).length === 1;

export const choiceSchema = z
  .object({
    text: nonEmpty,
    correct: z.boolean().default(false),
    why: nonEmpty,
  })
  .strict();

/** A file path inside a repo problem: relative, forward slashes, no "..". */
const FILE_PATH_RE = /^(?!.*(^|\/)\.\.?(\/|$))[A-Za-z0-9_.-]+(\/[A-Za-z0-9_.-]+)*$/;

// One shape for code, multistage and repo problems; which fields each type needs is checked in problemTypeIssues.
export const codeSchema = z
  .object({
    starter: z.string().min(1).optional(),
    tests: z.string().min(1).optional(),
    solution: z.string().min(1),
    hidden: z.string().min(1).optional(),
    files: z.record(z.string().regex(FILE_PATH_RE, 'file paths are relative, use forward slashes and never ".."'), z.string()).optional(),
    target: z.string().min(1).optional(),
  })
  .strict();

export const stageSchema = z
  .object({
    title: nonEmpty,
    brief: nonEmpty,
    tests: z.string().min(1),
    hidden: z.string().min(1).optional(),
  })
  .strict();

export const replayEventSchema = z
  .object({
    event: nonEmpty,
    choices: z
      .array(choiceSchema)
      .min(2)
      .max(5)
      .refine(exactlyOneCorrect, { message: 'a checkpoint needs exactly one choice with correct: true' })
      .optional(),
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

export type TypeIssue = { path: string; message: string };
const isObj = (x: unknown): x is Record<string, unknown> => Boolean(x) && typeof x === 'object' && !Array.isArray(x);
const filled = (x: unknown) => typeof x === 'string' && x.trim().length > 0;

/**
 * The fields each problem type needs and the ones it must not carry. Works on raw frontmatter as well as parsed data,
 * so scripts/validate-content.mjs reports these even when another field already failed the schema.
 */
export function problemTypeIssues(d: Record<string, unknown>): TypeIssue[] {
  const out: TypeIssue[] = [];
  const issue = (path: string, message: string) => out.push({ path, message });
  const type = String(d.type ?? '');
  const has = (k: string) => d[k] !== undefined;

  if (type === 'mcq' || type === 'debug') {
    if (!has('choices')) issue('choices', `${type} problems need choices: 3 to 5 entries of { text, correct, why }, exactly one correct`);
  } else if (has('choices')) issue('choices', 'choices are only for mcq and debug problems (replay checkpoints carry their own choices)');

  if (type === 'estimate' && !has('range')) issue('range', 'estimate problems need a range: { low, high, unit }');
  if (type !== 'estimate' && has('range')) issue('range', 'range is only for estimate problems');

  const needsChecklist = (CHECKLIST_TYPES as readonly string[]).includes(type);
  if (needsChecklist && !has('checklist')) issue('checklist', `${type} problems need a checklist of 4 to 12 entries: what a strong answer covers`);
  if (!needsChecklist && has('checklist')) issue('checklist', `checklist is only for ${CHECKLIST_TYPES.join(', ')} problems`);

  const code = d.code;
  if ((CODE_TYPES as readonly string[]).includes(type)) {
    if (!isObj(code)) issue('code', `${type} problems need a code block`);
  } else if (has('code')) issue('code', `code is only for ${CODE_TYPES.join(', ')} problems`);
  if (isObj(code)) {
    const need = (k: string, why: string) => {
      if (!filled(code[k])) issue(`code.${k}`, why);
    };
    const forbid = (k: string, why: string) => {
      if (code[k] !== undefined) issue(`code.${k}`, why);
    };
    if (type === 'code') {
      need('starter', 'code problems need code.starter');
      need('tests', 'code problems need code.tests (visible asserts)');
      need('solution', 'code problems need code.solution');
      forbid('files', 'code.files is only for repo problems');
      forbid('target', 'code.target is only for repo problems');
    }
    if (type === 'multistage') {
      need('starter', 'multistage problems need code.starter, the starting point for stage 1');
      need('solution', 'multistage problems need code.solution, a program that passes every stage');
      forbid('tests', 'multistage tests go on each stage as stages[n].tests, not in code.tests');
      forbid('hidden', 'multistage hidden tests go on each stage as stages[n].hidden');
      forbid('files', 'code.files is only for repo problems');
      forbid('target', 'code.target is only for repo problems');
    }
    if (type === 'repo') {
      const files = isObj(code.files) ? code.files : null;
      if (!files) issue('code.files', 'repo problems need code.files: a map of path to file content with at least two files');
      else if (Object.keys(files).length < 2) issue('code.files', `repo problems need at least two files in code.files, found ${Object.keys(files).length}`);
      if (!filled(code.target)) issue('code.target', 'repo problems need code.target: the path in code.files the reader edits');
      else if (files && !(String(code.target) in files)) {
        issue('code.target', `code.target "${String(code.target)}" is not a key of code.files; use one of ${Object.keys(files).join(', ')}`);
      }
      need('tests', 'repo problems need code.tests (visible asserts)');
      need('solution', 'repo problems need code.solution: the full fixed content of the target file');
      forbid('starter', 'repo problems take the starter from code.files[code.target]; remove code.starter');
    }
  }

  if (type === 'multistage') {
    const stages = d.stages;
    if (!Array.isArray(stages) || stages.length === 0) {
      issue('stages', `multistage problems need stages: ${MIN_STAGES} or ${MAX_STAGES} entries of { title, brief, tests, hidden }`);
    } else if (stages.length < MIN_STAGES || stages.length > MAX_STAGES) {
      issue('stages', `multistage problems have ${MIN_STAGES} or ${MAX_STAGES} stages, found ${stages.length}`);
    }
  } else if (has('stages')) issue('stages', 'stages are only for multistage problems');

  if (type === 'replay') {
    const events = d.replay;
    const checkpoints = Array.isArray(events) ? events.filter((e) => isObj(e) && Array.isArray(e.choices)) : [];
    if (!Array.isArray(events) || events.length === 0) {
      issue('replay', `replay problems need a replay timeline: entries of { event } with at least ${MIN_CHECKPOINTS} checkpoints that add choices`);
    } else if (checkpoints.length < MIN_CHECKPOINTS) {
      issue('replay', `a replay needs at least ${MIN_CHECKPOINTS} checkpoints (events with choices), found ${checkpoints.length}`);
    }
    if (Array.isArray(events)) {
      events.forEach((e, i) => {
        if (isObj(e) && Array.isArray(e.choices) && e.choices.filter((c) => isObj(c) && c.correct === true).length !== 1) {
          issue(`replay.${i}.choices`, `checkpoint at event ${i + 1} needs exactly one choice with correct: true`);
        }
      });
    }
  } else if (has('replay')) issue('replay', 'replay is only for replay problems');

  return out;
}

export const problemSchema = z
  .object({
    id: z.string().regex(PROBLEM_ID_RE, `id must look like agt-002, with a track code (${TRACK_CODES.join(', ')})`),
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
      .refine(exactlyOneCorrect, { message: 'exactly one choice must have correct: true' })
      .optional(),
    range: rangeSchema.optional(),
    code: codeSchema.optional(),
    stages: z.array(stageSchema).min(MIN_STAGES).max(MAX_STAGES).optional(),
    replay: z.array(replayEventSchema).min(2).optional(),
    checklist: z.array(nonEmpty).min(4).max(12).optional(),
  })
  .strict()
  .superRefine((d, ctx) => {
    // `params.typeRule` lets the validator skip these, since it runs problemTypeIssues on the raw data itself.
    const issue = (path: string, message: string) =>
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: path.split('.').map((p) => (/^\d+$/.test(p) ? Number(p) : p)), message, params: { typeRule: true } });
    if (!getModule(d.track, d.module)) issue('module', `module "${d.module}" is not in track "${d.track}"`);
    if (d.id.slice(0, 3) !== TRACK_CODE[d.track]) issue('id', `id prefix must be "${TRACK_CODE[d.track]}" for track ${d.track}`);
    for (const i of problemTypeIssues(d as unknown as Record<string, unknown>)) issue(i.path, i.message);
  });

export const labStepSchema = z
  .object({
    title: nonEmpty,
    brief: nonEmpty,
    starter: z.string().min(1),
    tests: z.string().min(1),
    hidden: z.string().min(1).optional(),
    solution: z.string().min(1),
  })
  .strict();

export const LAB_KINDS = ['lab', 'multistage'] as const;

export const labSchema = z
  .object({
    title: nonEmpty,
    track: z.enum(TRACK_SLUGS),
    module: nonEmpty,
    kind: z.enum(LAB_KINDS).default('lab'),
    minutes: z.number().int().positive(),
    summary: nonEmpty,
    updated: date,
    sources: z.array(sourceSchema).min(1),
    steps: z.array(labStepSchema).min(MIN_STAGES).max(10),
  })
  .strict()
  .superRefine((d, ctx) => {
    if (!getModule(d.track, d.module)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['module'], message: `module "${d.module}" is not in track "${d.track}"` });
    }
    if (d.kind === 'lab' && d.steps.length < 5) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['steps'], message: `a lab has 5 to 10 steps, found ${d.steps.length}; a shorter build is kind: multistage (3 to 10 stages)` });
    }
  });

export type LessonData = z.infer<typeof lessonSchema>;
export type ProblemData = z.infer<typeof problemSchema>;
export type LabData = z.infer<typeof labSchema>;
export type LabStep = z.infer<typeof labStepSchema>;
export type Stage = z.infer<typeof stageSchema>;
export type ReplayEvent = z.infer<typeof replayEventSchema>;

export function isGradable(type: string): boolean {
  return (GRADABLE_TYPES as readonly string[]).includes(type);
}

export function inDailyPool(type: string): boolean {
  return (DAILY_TYPES as readonly string[]).includes(type);
}

export function typeLabel(type: string): string {
  return TYPE_LABELS[type as ProblemType] ?? type;
}

// Problem body headings, in the order SPEC section 6 requires.
export const PROBLEM_SECTIONS = ['Question', 'Hints', 'Answer', 'Follow-ups', 'Common mistakes'] as const;
export const PROBLEM_REQUIRED = ['Question', 'Answer'] as const;
