// Validates every lesson, problem and lab under src/content without a full build. Run with `npm run validate`.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { lessonSchema, problemSchema, labSchema, problemTypeIssues, PROBLEM_TYPES, PROBLEM_SECTIONS, PROBLEM_REQUIRED, SLUG_RE } from '../src/lib/schemas.ts';
import { TRACKS } from '../src/data/tracks.ts';
import { CRUNCH } from '../src/data/lists.ts';
import { LOOPS } from '../src/data/loops.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const contentDir = join(root, 'src', 'content');
const errors = [];
const err = (file, msg) => errors.push(`${relative(root, file).split(sep).join('/')}: ${msg}`);

function walk(dir) {
  let out = [];
  let names = [];
  try {
    names = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of names) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out = out.concat(walk(p));
    else if (/\.mdx?$/.test(name)) out.push(p);
  }
  return out;
}

// Body text with fenced code removed, so code samples are not checked for prose rules.
function proseOnly(body) {
  return body.replace(/^(```|~~~)[^\n]*\n[\s\S]*?^\1[ \t]*$/gm, '');
}

function headings(body, level) {
  const marks = '#'.repeat(level);
  const re = new RegExp(`^${marks} +(.+?) *$`, 'gm');
  return [...proseOnly(body).matchAll(re)].map((m) => m[1].trim());
}

function lineOf(text, index) {
  return text.slice(0, index).split('\n').length;
}

// An em dash anywhere is an error; an en dash is allowed only between digits, as in a number range.
const EM_DASH = new RegExp(String.fromCharCode(0x2014), 'g');
const EN_DASH = new RegExp(String.fromCharCode(0x2013), 'g');
function checkDashes(file, text, where, offset = 0) {
  for (const m of text.matchAll(EM_DASH)) err(file, `${where} line ${lineOf(text, m.index) + offset}: em dash found; rewrite the sentence`);
  for (const m of text.matchAll(EN_DASH)) {
    const before = text[m.index - 1] ?? '';
    const after = text[m.index + 1] ?? '';
    if (!(/\d/.test(before) && /\d/.test(after))) err(file, `${where} line ${lineOf(text, m.index) + offset}: en dash used as a dash; rewrite the sentence`);
  }
}

function checkStrings(file, value, path = 'frontmatter') {
  if (typeof value === 'string') checkDashes(file, value, path);
  else if (Array.isArray(value)) value.forEach((v, i) => checkStrings(file, v, `${path}[${i}]`));
  else if (value && typeof value === 'object' && !(value instanceof Date)) {
    for (const [k, v] of Object.entries(value)) checkStrings(file, v, `${path}.${k}`);
  }
}

// Run outside Zod too, because Zod skips refinements when the base object already failed.
function checkSlugs(file, data, kind) {
  const track = TRACKS.find((t) => t.slug === data.track);
  if (!track) return err(file, `track "${data.track}" does not exist; use one of ${TRACKS.map((t) => t.slug).join(', ')}`);
  if (!track.modules.some((m) => m.slug === data.module)) {
    err(file, `module "${data.module}" is not in track "${track.slug}"; use one of ${track.modules.map((m) => m.slug).join(', ')}`);
  }
  if (kind === 'problem' && typeof data.id === 'string' && !data.id.startsWith(`${track.code}-`)) {
    err(file, `id "${data.id}" must start with "${track.code}-" for track ${track.slug}`);
  }
}

function zodErrors(file, result) {
  for (const issue of result.error.issues) {
    // Slug and type rules are reported by checkSlugs and problemTypeIssues, which also run when the schema failed.
    if (issue.code === 'custom' && (issue.params?.typeRule || /is not in track|id prefix must be/.test(issue.message))) continue;
    err(file, `frontmatter ${issue.path.join('.') || '(root)'}: ${issue.message}`);
  }
}

function load(file) {
  const raw = readFileSync(file, 'utf8');
  const parsed = matter(raw);
  const fmLines = raw.slice(0, raw.length - parsed.content.length).split('\n').length - 1;
  return { raw, data: parsed.data, body: parsed.content, bodyOffset: fmLines };
}

const lessonFiles = walk(join(contentDir, 'lessons'));
const problemFiles = walk(join(contentDir, 'problems'));
const labFiles = walk(join(contentDir, 'labs'));
const lessonKeys = new Set();
const problemIds = new Map();
const orders = new Map();
const multistageFiles = [];

for (const file of lessonFiles) {
  const { data, body, bodyOffset } = load(file);
  const rel = relative(join(contentDir, 'lessons'), file).split(sep);
  const result = lessonSchema.safeParse(data);
  if (!result.success) zodErrors(file, result);
  checkSlugs(file, data, 'lesson');
  if (!file.endsWith('.mdx')) err(file, 'lessons must be .mdx files');
  if (rel.length !== 3) err(file, 'lessons live at src/content/lessons/<track>/<module>/<lesson-slug>.mdx');
  const [folder, modFolder] = rel;
  const name = basename(file).replace(/\.mdx?$/, '');
  const track = TRACKS.find((t) => t.slug === folder);
  if (data.track && folder !== data.track) err(file, `folder "${folder}" does not match track "${data.track}"`);
  if (rel.length === 3 && track && !track.modules.some((m) => m.slug === modFolder)) {
    err(file, `folder "${modFolder}" is not a module of track "${folder}"; use one of ${track.modules.map((m) => m.slug).join(', ')}`);
  }
  if (rel.length === 3 && data.module && modFolder !== data.module) err(file, `folder "${modFolder}" does not match module "${data.module}"`);
  if (!SLUG_RE.test(name)) err(file, `file name "${name}" is the lesson slug; use lowercase words joined by hyphens`);
  lessonKeys.add(`${folder}/${modFolder}/${name}`);
  if (data.track && data.module && Number.isInteger(data.order)) {
    const k = `${data.track}/${data.module}:${data.order}`;
    if (orders.has(k)) err(file, `order ${data.order} is also used by ${orders.get(k)}; each lesson in a module needs its own order`);
    else orders.set(k, relative(root, file).split(sep).join('/'));
  }

  const h2 = headings(body, 2);
  if ((data.kind ?? 'lesson') === 'lesson') {
    const room = h2.indexOf('In the room');
    const wrong = h2.indexOf('When this is wrong');
    if (room === -1) err(file, 'missing "## In the room" section (SPEC section 5, part 6)');
    if (wrong === -1) err(file, 'missing "## When this is wrong" section (SPEC section 5, part 7)');
    if (room !== -1 && wrong !== -1 && wrong < room) err(file, '"When this is wrong" must come after "In the room"');
    if (room !== -1 && !/<Depth[\s>]/.test(body)) err(file, '"In the room" needs a <Depth> block');
  }
  if (data.kind === 'teardown') {
    if (!/<Diagram[\s>]/.test(body)) err(file, 'a teardown draws the system with <Diagram> (SPEC section 5)');
    if (!/<Trace[\s>]/.test(body)) err(file, 'a teardown walks the request lifecycle with <Trace> (SPEC section 5)');
    if (!/<Depth[\s>]/.test(body)) err(file, 'a teardown answers its interview questions with a <Depth> block');
  }
  const selfRateId = `lesson:${folder}/${modFolder}/${name}`;
  if (!body.includes(`<SelfRate id="${selfRateId}"`)) err(file, `end the lesson with <SelfRate id="${selfRateId}" />`);
  checkDashes(file, proseOnly(body), 'body', bodyOffset);
  checkStrings(file, data);
}

for (const file of problemFiles) {
  const { data, body, bodyOffset } = load(file);
  const rel = relative(join(contentDir, 'problems'), file).split(sep);
  const result = problemSchema.safeParse(data);
  if (!result.success) zodErrors(file, result);
  checkSlugs(file, data, 'problem');
  if (!file.endsWith('.mdx')) err(file, 'problems must be .mdx files');
  if (rel.length !== 2) err(file, 'problems live at src/content/problems/<track>/<id>.mdx');
  const name = basename(file).replace(/\.mdx?$/, '');
  if (data.id !== name) err(file, `id "${data.id}" must equal the file name "${name}"`);
  if (data.track && rel[0] !== data.track) err(file, `folder "${rel[0]}" does not match track "${data.track}"`);
  if (problemIds.has(data.id)) err(file, `duplicate id ${data.id}, also in ${problemIds.get(data.id)}`);
  for (const i of problemTypeIssues(data)) err(file, `frontmatter ${i.path}: ${i.message}`);
  if (data.type === 'multistage' && typeof data.id === 'string') multistageFiles.push([file, data.id]);
  problemIds.set(data.id, relative(root, file));

  const h2 = headings(body, 2);
  const unknown = h2.filter((h) => !PROBLEM_SECTIONS.includes(h));
  if (unknown.length) err(file, `unexpected section heading(s): ${unknown.map((h) => `"${h}"`).join(', ')}; allowed: ${PROBLEM_SECTIONS.join(', ')}`);
  const known = h2.filter((h) => PROBLEM_SECTIONS.includes(h));
  const positions = known.map((h) => PROBLEM_SECTIONS.indexOf(h));
  if (positions.some((p, i) => i > 0 && p <= positions[i - 1])) err(file, `sections out of order or repeated: ${known.join(', ')}; expected order ${PROBLEM_SECTIONS.join(', ')}`);
  for (const req of PROBLEM_REQUIRED) if (!known.includes(req)) err(file, `missing "## ${req}" section`);
  if (known.includes('Hints')) {
    const hints = proseOnly(body).split(/^## Hints *$/m)[1]?.split(/^## /m)[0] ?? '';
    if (!/<details/.test(hints)) err(file, 'each hint goes inside a <details class="hint"> element');
  }
  if (['concept', 'estimate', 'design', 'behavioural'].includes(data.type)) {
    const answer = proseOnly(body).split(/^## Answer *$/m)[1] ?? '';
    if (!/<Depth[\s>]/.test(answer)) err(file, `${data.type} problems start the Answer with a <Depth> block`);
  }
  checkDashes(file, proseOnly(body), 'body', bodyOffset);
  checkStrings(file, data);
}

for (const file of lessonFiles) {
  const { data } = load(file);
  for (const pre of data.prerequisites ?? []) {
    if (!lessonKeys.has(pre)) err(file, `prerequisite "${pre}" is not an existing lesson; use "track/module/lesson-slug"`);
  }
}

// Firestore rules cannot loop over map entries, so each lab slug is listed there by name to cap its stored code.
const rules = readFileSync(join(root, 'firestore.rules'), 'utf8');
const ruleSlugs = rules.match(/function labSlugs\(\)\s*\{\s*return \[([^\]]*)\]/)?.[1] ?? '';
const inRules = (key) => ruleSlugs.includes(`'${key}'`) && rules.includes(`'${key}' in m`);
for (const [file, id] of multistageFiles) {
  if (!inRules(`problem:${id}`)) err(file, `add 'problem:${id}' to labSlugs() and validLabs() in firestore.rules so the stored stage and code are size-checked`);
}
for (const file of labFiles) {
  const { data, body, bodyOffset } = load(file);
  const rel = relative(join(contentDir, 'labs'), file).split(sep);
  const slug = basename(file).replace(/\.mdx?$/, '');
  const result = labSchema.safeParse(data);
  if (!result.success) zodErrors(file, result);
  checkSlugs(file, data, 'lab');
  if (!file.endsWith('.mdx')) err(file, 'labs must be .mdx files');
  if (rel.length !== 1) err(file, 'labs live at src/content/labs/<lab-slug>.mdx');
  if (!SLUG_RE.test(slug)) err(file, `file name "${slug}" is the lab slug; use lowercase words joined by hyphens`);
  (Array.isArray(data.steps) ? data.steps : []).forEach((step, i) => {
    for (const field of ['title', 'brief', 'starter', 'tests', 'solution']) {
      if (typeof step?.[field] !== 'string' || !step[field].trim()) err(file, `step ${i + 1} needs a non-empty ${field}`);
    }
  });
  if (!inRules(slug)) {
    err(file, `add '${slug}' to labSlugs() and validLabs() in firestore.rules so its stored code is size-checked`);
  }
  checkDashes(file, proseOnly(body), 'body', bodyOffset);
  checkStrings(file, data);
}

for (const loop of LOOPS) {
  for (const t of Object.keys(loop.tracks)) if (!TRACKS.some((x) => x.slug === t)) errors.push(`src/data/loops.ts: preset "${loop.slug}" weights unknown track "${t}"`);
  for (const t of Object.keys(loop.types)) if (!PROBLEM_TYPES.includes(t)) errors.push(`src/data/loops.ts: preset "${loop.slug}" weights unknown type "${t}"`);
}

const crunchSeen = new Set();
for (const id of CRUNCH.ids) {
  if (!problemIds.has(id)) errors.push(`src/data/lists.ts: crunch path id "${id}" has no problem file`);
  if (crunchSeen.has(id)) errors.push(`src/data/lists.ts: crunch path lists "${id}" twice`);
  crunchSeen.add(id);
}

const summary = `${lessonFiles.length} lesson(s), ${problemFiles.length} problem(s), ${labFiles.length} lab(s)`;
if (errors.length) {
  console.error(`Content validation failed (${summary}), ${errors.length} error(s):\n`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`Content OK: ${summary}.`);
