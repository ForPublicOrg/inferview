// Post-build check: every inline script in dist must be hash-allowed by the CSP in vercel.json, and no HTML may use
// inline event handlers or javascript: URLs, which the CSP would block in production.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const vercel = JSON.parse(readFileSync(join(root, 'vercel.json'), 'utf8'));
const pageRule = vercel.headers.find((h) => h.source === '/((?!workers/).*)');
const csp = pageRule?.headers.find((h) => h.key === 'Content-Security-Policy')?.value ?? '';
const scriptSrc = csp.split(';').map((d) => d.trim()).find((d) => d.startsWith('script-src ')) ?? '';

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return htmlFiles(p);
    return name.endsWith('.html') ? [p] : [];
  });
}

const problems = [];
const hashes = new Set();
for (const file of htmlFiles(dist)) {
  const html = readFileSync(file, 'utf8');
  const rel = relative(dist, file);
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
    const attrs = m[1];
    if (/\bsrc=/.test(attrs) || /type="application\/(ld\+)?json"/.test(attrs)) continue;
    const hash = `'sha256-${createHash('sha256').update(m[2]).digest('base64')}'`;
    hashes.add(hash);
    if (!scriptSrc.includes(hash)) problems.push(`${rel}: inline script not allowed by the CSP; add ${hash} to script-src in vercel.json`);
  }
  for (const m of html.matchAll(/<[a-z][^>]*\son[a-z]+=/gi)) problems.push(`${rel}: inline event handler (${m[0].slice(0, 60)}...)`);
  if (/href="javascript:/i.test(html)) problems.push(`${rel}: javascript: URL`);
}

if (!csp) problems.push('vercel.json: no Content-Security-Policy on the page rule');

// The auth frame wildcard is a placeholder until the Firebase project exists (docs/firebase-setup.md, section 1).
const envFile = join(root, '.env');
const dotenvDomain = existsSync(envFile)
  ? readFileSync(envFile, 'utf8').match(/^PUBLIC_FIREBASE_AUTH_DOMAIN=(.+)$/m)?.[1]?.trim()
  : undefined;
const authDomain = process.env.PUBLIC_FIREBASE_AUTH_DOMAIN || dotenvDomain;
if (authDomain && csp.includes('https://*.firebaseapp.com')) {
  console.warn(`CSP warning: frame-src still allows https://*.firebaseapp.com; replace it with https://${authDomain} in vercel.json.`);
}
if (problems.length) {
  console.error(`CSP check failed:\n${[...new Set(problems)].map((p) => `  - ${p}`).join('\n')}`);
  process.exit(1);
}
console.log(`CSP check OK: ${hashes.size} inline script hash(es), all allowed.`);
