// Regenerates src/data/tokens-real.json: real cl100k_base and o200k_base tokenizations of the lesson presets.
import { writeFileSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getEncoding } from 'js-tiktoken';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const version = JSON.parse(readFileSync(join(root, 'node_modules/js-tiktoken/package.json'), 'utf8')).version;

// Keep these strings identical to the presets in src/components/widgets/TokenStrip.astro.
const PRESETS = {
  english: 'The quick brown fox jumps over the lazy dog, then reconsiders.',
  hindi: 'तेज़ भूरी लोमड़ी आलसी कुत्ते के ऊपर कूदती है, फिर पुनर्विचार करती है।',
  japanese: 'フランスの首都はパリです。',
  strawberry: "How many r's are in strawberry?",
  strawberry_word: 'strawberry',
  numbers: 'Total: 1234567 + 7654321 = ?',
  code: 'def retry(fn, n=3):\n    for i in range(n):\n        try: return fn()\n        except Exception: pass',
};

// rankMap is internal to js-tiktoken; its size is the number of mergeable tokens in the published file.
const encodings = { cl100k: getEncoding('cl100k_base'), o200k: getEncoding('o200k_base') };
const presets = {};
for (const [key, text] of Object.entries(PRESETS)) {
  const entry = { text, chars: Array.from(text).length };
  for (const [name, enc] of Object.entries(encodings)) {
    const ids = enc.encode(text);
    entry[name] = { toks: ids.map((id) => enc.decode([id])), ids };
  }
  presets[key] = entry;
}

const out = {
  measuredWith: `js-tiktoken ${version}`,
  measuredOn: new Date().toLocaleDateString('en-CA'),
  vocab: { cl100k: encodings.cl100k.rankMap.size, o200k: encodings.o200k.rankMap.size },
  presets,
};
writeFileSync(join(root, 'src/data/tokens-real.json'), JSON.stringify(out) + '\n');
for (const [k, v] of Object.entries(presets)) console.log(`${k.padEnd(16)} cl100k ${String(v.cl100k.ids.length).padStart(3)}  o200k ${String(v.o200k.ids.length).padStart(3)}  chars ${v.chars}`);
