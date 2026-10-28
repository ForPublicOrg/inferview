// Runs learner code and assert-style tests in Pyodide, off the main thread. Loaded by CodeRunner and LabRunner on the first Run.
// The Python side is harness.py next to this file, which scripts/check-labs.mjs and scripts/check-code.mjs also run.
/* global loadPyodide, importScripts */
const PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.29.5/full/';

let ready = null;

function boot() {
  if (!ready) {
    ready = (async () => {
      postMessage({ type: 'status', text: 'Loading Python (first run only)' });
      importScripts(PYODIDE_URL + 'pyodide.js');
      const [py, harness] = await Promise.all([
        loadPyodide({ indexURL: PYODIDE_URL }),
        fetch(new URL('harness.py', self.location.href)).then((r) => {
          if (!r.ok) throw new Error('The test harness did not load.');
          return r.text();
        }),
      ]);
      py.runPython(harness);
      return py;
    })();
  }
  return ready;
}

self.onmessage = async (e) => {
  const msg = e.data || {};
  if (msg.type !== 'run') return;
  try {
    const py = await boot();
    postMessage({ type: 'status', text: 'Running tests' });
    const run = py.globals.get('_inferview_run');
    const files = msg.files && typeof msg.files === 'object' ? JSON.stringify(msg.files) : '';
    const json = run(String(msg.code ?? ''), String(msg.tests ?? ''), String(msg.hidden ?? ''), files);
    run.destroy();
    postMessage({ type: 'result', runId: msg.runId, ...JSON.parse(json) });
  } catch (err) {
    ready = null;
    postMessage({ type: 'result', runId: msg.runId, stdout: '', error: String(err && err.message ? err.message : err), results: [] });
  }
};
