// Checks every internal href in dist/ points at a built page or file. Run after npm run build.
import fs from 'node:fs';
import path from 'node:path';

const root = 'dist';
const pages = [];
(function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (f.endsWith('.html')) pages.push(p);
  }
})(root);

const dead = new Set();
let total = 0;
for (const p of pages) {
  const html = fs.readFileSync(p, 'utf8');
  for (const m of html.matchAll(/href="([^"#?]+)[^"]*"/g)) {
    const h = m[1];
    if (/^(https?:|mailto:|data:)/.test(h)) continue;
    total++;
    const dir = path.dirname(p).split(path.sep).join('/').replace(/^dist/, '');
    let t = h.startsWith('/') ? h : path.posix.join(dir, h);
    t = t.replace(/\/$/, '');
    const cands = [path.join(root, t), path.join(root, t, 'index.html'), path.join(root, t + '.html')];
    if (!cands.some((c) => fs.existsSync(c))) dead.add(`${p} -> ${h}`);
  }
}
console.log(`pages ${pages.length}, internal links ${total}, dead ${dead.size}`);
for (const d of dead) console.log(d);
process.exit(dead.size ? 1 : 0);
