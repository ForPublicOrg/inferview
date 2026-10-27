// Runs learner code and assert-style tests in Pyodide, off the main thread. Loaded by CodeRunner on the first Run.
/* global loadPyodide, importScripts */
const PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.29.5/full/';

const HARNESS = `
import ast, io, sys, json, traceback

def _inferview_run(user_src, tests_src):
    out = io.StringIO()
    saved = sys.stdout, sys.stderr
    sys.stdout = sys.stderr = out
    ns = {"__name__": "__main__"}
    results, error = [], None
    try:
        try:
            exec(compile(user_src, "<your code>", "exec"), ns)
        except BaseException:
            error = traceback.format_exc(limit=-4)
        if error is None:
            try:
                tree = ast.parse(tests_src)
            except SyntaxError:
                error = "The tests do not parse:\\n" + traceback.format_exc(limit=0)
                tree = ast.Module(body=[], type_ignores=[])
            for node in tree.body:
                src = ast.get_source_segment(tests_src, node) or ""
                mod = ast.Module(body=[node], type_ignores=[])
                try:
                    exec(compile(mod, "<tests>", "exec"), ns)
                    if isinstance(node, ast.Assert):
                        results.append({"src": src, "ok": True})
                except AssertionError as e:
                    results.append({"src": src, "ok": False, "msg": str(e)})
                except BaseException as e:
                    results.append({"src": src, "ok": False, "msg": type(e).__name__ + ": " + str(e)})
    finally:
        sys.stdout, sys.stderr = saved
    return json.dumps({"stdout": out.getvalue(), "error": error, "results": results})
`;

let ready = null;

function boot() {
  if (!ready) {
    ready = (async () => {
      postMessage({ type: 'status', text: 'Loading Python (first run only)' });
      importScripts(PYODIDE_URL + 'pyodide.js');
      const py = await loadPyodide({ indexURL: PYODIDE_URL });
      py.runPython(HARNESS);
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
    const json = run(String(msg.code), String(msg.tests));
    run.destroy();
    postMessage({ type: 'result', runId: msg.runId, ...JSON.parse(json) });
  } catch (err) {
    ready = null;
    postMessage({ type: 'result', runId: msg.runId, stdout: '', error: String(err && err.message ? err.message : err), results: [] });
  }
};
