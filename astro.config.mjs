// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://inferview.io',
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  integrations: [mdx()],
  // Plain code blocks styled by inferview.css, as in the prototypes; no inline theme colours.
  markdown: { syntaxHighlight: false },
  devToolbar: { enabled: false },
  vite: {
    // Keep every script in an external file so the CSP needs no inline-script hashes beyond the theme snippet.
    build: { assetsInlineLimit: 0 },
  },
});
