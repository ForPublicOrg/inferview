// Runs every lab's tests against its reference solutions in local Python (python -I), the way LabRunner runs them in
// the browser: step n executes the solutions of steps 1 to n, then step n's tests, then its hidden tests. Run with `npm run labs`.
import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { runPython } from './lib/python-harness.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const labsDir = join(root, 'src', 'content', 'labs');

let failures = 0;
let files = [];
try {
  files = readdirSync(labsDir).filter((f) => f.endsWith('.mdx'));
} catch {
  files = [];
}
for (const file of files) {
  const { data } = matter(readFileSync(join(labsDir, file), 'utf8'));
  const steps = data.steps ?? [];
  steps.forEach((step, i) => {
    const code = steps.slice(0, i + 1).map((s) => s.solution).join('\n\n');
    const run = runPython({ code, tests: step.tests ?? '', hidden: step.hidden ?? '' });
    if (!run.ok) {
      failures++;
      console.error(`${file} step ${i + 1} (${step.title}): ${run.detail}`);
    } else {
      const hidden = run.hidden ? `, ${run.hidden} hidden` : '';
      console.log(`${file} step ${i + 1} (${step.title}): ${run.count} of ${run.count} tests pass${hidden}`);
    }
  });
}
if (failures) process.exit(1);
console.log(`Labs OK: ${files.length} lab(s).`);
