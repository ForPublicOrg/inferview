// Local preview of dist/ with the response headers from vercel.json, so the CSP is exercised before deploying.
// Supports the regex-style `source` patterns used in vercel.json; it is not a full Vercel emulator.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { join, normalize, extname, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const port = Number(process.env.PORT ?? 4321);
const rules = JSON.parse(readFileSync(join(root, 'vercel.json'), 'utf8')).headers.map((r) => ({
  re: new RegExp(`^${r.source}$`),
  headers: r.headers,
}));

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain; charset=utf-8',
  '.py': 'text/plain; charset=utf-8',
  '.wasm': 'application/wasm',
  '.pf_meta': 'application/octet-stream',
  '.pf_index': 'application/octet-stream',
  '.pf_fragment': 'application/octet-stream',
  '.pagefind': 'application/octet-stream',
};

async function resolveFile(pathname) {
  const clean = normalize(decodeURIComponent(pathname)).replace(/^([/\\])+/, '');
  const base = join(dist, clean);
  if (!base.startsWith(dist + sep) && base !== dist) return null;
  for (const candidate of [base, join(base, 'index.html'), `${base}.html`]) {
    try {
      if ((await stat(candidate)).isFile()) return candidate;
    } catch {
      // try the next candidate
    }
  }
  return null;
}

createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://localhost:${port}`);
  for (const rule of rules) {
    if (rule.re.test(url.pathname)) for (const h of rule.headers) res.setHeader(h.key, h.value);
  }
  const file = await resolveFile(url.pathname);
  const target = file ?? join(dist, '404.html');
  try {
    const body = await readFile(target);
    res.statusCode = file ? 200 : 404;
    res.setHeader('Content-Type', TYPES[extname(target)] ?? 'application/octet-stream');
    res.end(body);
  } catch {
    res.statusCode = 500;
    res.end('dist/ is missing. Run npm run build first.');
  }
}).listen(port, '127.0.0.1', () => console.log(`Serving dist/ with vercel.json headers at http://localhost:${port}`));
