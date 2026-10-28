# Test harness shared by the Pyodide worker and scripts/check-labs.mjs and scripts/check-code.mjs (run there with python -I).
# Each top-level test statement is reported separately; hidden tests run after the visible ones under a numbered label.
import ast, io, json, os, shutil, sys, tempfile, traceback, importlib


def _inferview_statements(src, ns, results, hidden=False):
    try:
        tree = ast.parse(src)
    except SyntaxError:
        return ("The hidden tests" if hidden else "The tests") + " do not parse:\n" + traceback.format_exc(limit=0)
    n = 0
    for node in tree.body:
        shown = ast.get_source_segment(src, node) or ""
        reported = isinstance(node, ast.Assert)
        try:
            exec(compile(ast.Module(body=[node], type_ignores=[]), "<tests>", "exec"), ns)
            msg = None
        except AssertionError as e:
            reported, msg = True, str(e) if not hidden else "assertion failed"
        except BaseException as e:
            reported, msg = True, type(e).__name__ + ("" if hidden else ": " + str(e))
        if not reported:
            continue
        entry = {"src": shown, "ok": msg is None}
        if hidden:
            n += 1
            entry = {"src": f"hidden test {n}", "ok": msg is None, "hidden": True}
        if msg is not None:
            entry["msg"] = msg
        results.append(entry)
    return None


def _inferview_run(user_src, tests_src, hidden_src="", files_json=""):
    out = io.StringIO()
    saved = sys.stdout, sys.stderr
    old_cwd = os.getcwd()
    run_dir = None
    sys.stdout = sys.stderr = out
    ns = {"__name__": "__main__"}
    results, error = [], None
    try:
        if files_json:
            # Repo problems: a fresh directory per run, so modules imported by an earlier run are not reused.
            for name, mod in list(sys.modules.items()):
                if (getattr(mod, "__file__", None) or "").startswith(tempfile.gettempdir() + os.sep + "inferview-repo-"):
                    del sys.modules[name]
            run_dir = tempfile.mkdtemp(prefix="inferview-repo-")
            for path, content in json.loads(files_json).items():
                full = os.path.join(run_dir, *path.split("/"))
                os.makedirs(os.path.dirname(full), exist_ok=True)
                with open(full, "w", encoding="utf-8") as f:
                    f.write(content)
            sys.path.insert(0, run_dir)
            os.chdir(run_dir)
            importlib.invalidate_caches()
        try:
            exec(compile(user_src, "<your code>", "exec"), ns)
        except BaseException:
            error = traceback.format_exc(limit=-4)
        if error is None:
            error = _inferview_statements(tests_src, ns, results)
        if error is None and hidden_src.strip():
            error = _inferview_statements(hidden_src, ns, results, hidden=True)
    finally:
        sys.stdout, sys.stderr = saved
        if run_dir:
            os.chdir(old_cwd)
            if run_dir in sys.path:
                sys.path.remove(run_dir)
            shutil.rmtree(run_dir, ignore_errors=True)
    return json.dumps({"stdout": out.getvalue(), "error": error, "results": results})
