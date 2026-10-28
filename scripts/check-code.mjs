// Runs the reference solution of every code, multistage and repo problem against its visible and hidden tests in local
// Python (python -I), the way CodeRunner and LabRunner run them in the browser. Run with `npm run code`.
// A multistage solution must pass every stage; a repo solution replaces the target file before the tests import it.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { runPython } from './lib/python-harness.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const problemsDir = join(root, 'src', 'content', 'problems');

function walk(dir) {
  let names = [];
  try {
    names = readdirSync(dir);
  } catch {
    return [];
  }
  return names.flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : /\.mdx?$/.test(name) ? [p] : [];
  });
}

let failures = 0;
let checked = 0;
const report = (label, run) => {
  if (!run.ok) {
    failures++;
    console.error(`${label}: ${run.detail}`);
  } else {
    const hidden = run.hidden ? `, ${run.hidden} hidden` : '';
    console.log(`${label}: ${run.count} of ${run.count} tests pass${hidden}`);
  }
};

for (const file of walk(problemsDir)) {
  const { data } = matter(readFileSync(file, 'utf8'));
  const rel = relative(root, file).split(sep).join('/');
  const code = data.code ?? {};
  if (data.type === 'code') {
    checked++;
    report(rel, runPython({ code: code.solution ?? '', tests: code.tests ?? '', hidden: code.hidden ?? '' }));
  } else if (data.type === 'multistage') {
    checked++;
    const stages = Array.isArray(data.stages) ? data.stages : [];
    if (!stages.length) report(rel, { ok: false, detail: 'no stages to run' });
    stages.forEach((s, i) => report(`${rel} stage ${i + 1} (${s.title})`, runPython({ code: code.solution ?? '', tests: s.tests ?? '', hidden: s.hidden ?? '' })));
  } else if (data.type === 'repo') {
    checked++;
    const files = code.files && typeof code.files === 'object' ? { ...code.files } : null;
    if (!files || !code.target || !(code.target in files)) {
      report(rel, { ok: false, detail: 'code.files and a code.target inside it are needed to run a repo problem' });
      continue;
    }
    files[code.target] = code.solution ?? '';
    report(rel, runPython({ tests: code.tests ?? '', hidden: code.hidden ?? '', files }));
  }
}
if (failures) process.exit(1);
console.log(`Code OK: ${checked} problem(s).`);
