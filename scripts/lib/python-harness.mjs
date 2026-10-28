// Runs public/workers/harness.py (the harness the Pyodide worker uses) in local Python with -I, one process per run.
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const HARNESS = readFileSync(join(root, 'public', 'workers', 'harness.py'), 'utf8');
const DRIVER = `
_req = json.loads(sys.stdin.buffer.read().decode("utf-8"))
_files = json.dumps(_req["files"]) if _req.get("files") else ""
print(_inferview_run(_req["code"], _req["tests"], _req.get("hidden") or "", _files))
`;

export const python = process.env.PYTHON ?? (process.platform === 'win32' ? 'python' : 'python3');

/**
 * Returns { ok, detail, count } where detail explains a failure. `files` (repo problems) are written into a temporary
 * directory that the tests import from.
 */
export function runPython({ code = '', tests, hidden = '', files = null }) {
  const res = spawnSync(python, ['-I', '-c', HARNESS + DRIVER], {
    input: JSON.stringify({ code, tests, hidden, files }),
    encoding: 'utf8',
    timeout: 60000,
  });
  if (res.error || res.status !== 0) return { ok: false, count: 0, detail: `could not run ${python}: ${res.error?.message ?? res.stderr}` };
  const run = JSON.parse(res.stdout);
  const failed = run.results.filter((r) => !r.ok);
  const hiddenCount = run.results.filter((r) => r.hidden).length;
  if (run.error) return { ok: false, count: run.results.length, detail: run.error };
  if (run.results.length === 0) return { ok: false, count: 0, detail: 'no asserts ran' };
  if (hidden.trim() && hiddenCount === 0) return { ok: false, count: run.results.length, detail: 'the hidden tests ran no asserts' };
  if (failed.length) return { ok: false, count: run.results.length, detail: failed.map((r) => `${r.src} -> ${r.msg ?? 'failed'}`).join('\n  ') };
  return { ok: true, count: run.results.length, hidden: hiddenCount, detail: '' };
}
