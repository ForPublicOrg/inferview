// Browser client for public/workers/pyodide-worker.js, shared by CodeRunner and LabRunner: one worker per page,
// a timeout per run, plus the editor key handling and the results rendering both runners use.

export type TestResult = { src: string; ok: boolean; msg?: string; hidden?: boolean };
/** Extra tests run after the visible ones, and for repo problems the files written into the worker filesystem. */
export type RunExtras = { hidden?: string; files?: Record<string, string> };
export type RunResult = { stdout: string; error: string | null; results: TestResult[] };
type Reply = { type: 'status'; text: string } | ({ type: 'result'; runId: number } & RunResult);

export const TIMEOUT_MS = 30000;
let worker: Worker | null = null;
let runSeq = 0;
// The worker is shared by every runner on the page; its error listener ends whichever run is active.
let activeFail: ((msg: string) => void) | null = null;

function getWorker(): Worker {
  if (!worker) {
    worker = new Worker('/workers/pyodide-worker.js');
    worker.addEventListener('error', () => {
      activeFail?.('Python could not start. Check your connection; it loads from cdn.jsdelivr.net.');
    });
  }
  return worker;
}

/** Runs `code`, then each top-level statement of `tests`, then `extras.hidden`. Rejects with a readable message on timeout or load failure. */
export function runTests(code: string, tests: string, onStatus: (text: string) => void = () => {}, extras: RunExtras = {}): Promise<RunResult> {
  const runId = ++runSeq;
  const w = getWorker();
  return new Promise((resolve, reject) => {
    let timer: ReturnType<typeof setTimeout>;
    const cleanup = () => {
      clearTimeout(timer);
      w.removeEventListener('message', onMsg);
      if (activeFail === fail) activeFail = null;
    };
    const fail = (msg: string) => {
      cleanup();
      reject(new Error(msg));
    };
    const onTimeout = () => {
      w.terminate();
      worker = null;
      fail(`Stopped after ${TIMEOUT_MS / 1000} seconds. Look for an infinite loop, or try again if Python was still loading.`);
    };
    // Re-armed when the tests start, so a slow first download of Python does not count against the code.
    timer = setTimeout(onTimeout, TIMEOUT_MS);
    const onMsg = (e: MessageEvent<Reply>) => {
      const m = e.data;
      if (m.type === 'status') {
        if (m.text === 'Running tests') {
          clearTimeout(timer);
          timer = setTimeout(onTimeout, TIMEOUT_MS);
        }
        onStatus(m.text);
        return;
      }
      if (m.runId !== runId) return;
      cleanup();
      resolve({ stdout: m.stdout, error: m.error, results: m.results });
    };
    activeFail = fail;
    w.addEventListener('message', onMsg);
    w.postMessage({ type: 'run', runId, code, tests, hidden: extras.hidden ?? '', files: extras.files ?? null });
  });
}

/** Tab inserts four spaces; Esc releases the next Tab so keyboard users can leave the editor. */
export function bindEditor(editor: HTMLTextAreaElement): void {
  let released = false;
  editor.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      released = true;
      return;
    }
    if (e.key === 'Tab' && !released && !e.shiftKey) {
      e.preventDefault();
      const { selectionStart: s, selectionEnd: end, value } = editor;
      editor.value = value.slice(0, s) + '    ' + value.slice(end);
      editor.selectionStart = editor.selectionEnd = s + 4;
      editor.dispatchEvent(new Event('input', { bubbles: true }));
    }
    released = false;
  });
}

/**
 * Fills the [data-out] block inside `root` ([data-summary], [data-results], [data-stdout], [data-stdout-wrap]).
 * Returns true when every test passed and the code raised nothing.
 */
export function renderRun(root: HTMLElement, run: RunResult): boolean {
  const out = root.querySelector<HTMLElement>('[data-out]');
  const summary = root.querySelector<HTMLElement>('[data-summary]');
  const list = root.querySelector<HTMLElement>('[data-results]');
  const stdout = root.querySelector<HTMLElement>('[data-stdout]');
  const stdoutWrap = root.querySelector<HTMLElement>('[data-stdout-wrap]');
  const { results, error } = run;
  const passed = results.filter((r) => r.ok).length;
  const allPass = !error && results.length > 0 && passed === results.length;
  if (!out || !summary || !list || !stdout || !stdoutWrap) return allPass;
  out.hidden = false;
  summary.textContent = error ? 'Your code raised an error before the tests ran.' : `${passed} of ${results.length} tests pass`;
  list.replaceChildren(
    ...results.map((r) => {
      const li = document.createElement('li');
      const mark = document.createElement('span');
      mark.className = r.ok ? 'pass' : 'fail';
      mark.textContent = r.ok ? 'pass ' : 'fail ';
      const code = document.createElement('code');
      code.textContent = r.src;
      li.append(mark, code);
      if (r.msg) li.append(` ${r.msg}`);
      return li;
    }),
  );
  const shown = [run.stdout, error].filter(Boolean).join('\n');
  stdoutWrap.hidden = !shown;
  stdout.textContent = shown;
  return allPass;
}
