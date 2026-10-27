# Deploying on Vercel

The site is a static Astro build. Vercel runs `npm run build`, which validates the content, builds to `dist/`, builds the Pagefind search index, and checks that every inline script is allowed by the Content-Security-Policy in `vercel.json`. Any of those failing stops the deploy.

## 1. Import the repository

1. Push the repository to GitHub (or GitLab or Bitbucket).
2. In Vercel, Add New, Project, and import it. The framework preset is detected as Astro; `vercel.json` also sets the build command (`npm run build`) and the output directory (`dist`).
3. Node.js version: 22 or later (Project settings, General). `scripts/validate-content.mjs` imports TypeScript files directly, which needs Node 22.18 or later.

## 2. Environment variables

Project settings, Environment Variables. Add these for Production and Preview:

| Name | Value |
|---|---|
| `PUBLIC_FIREBASE_API_KEY` | from the Firebase web app config |
| `PUBLIC_FIREBASE_AUTH_DOMAIN` | `<project-id>.firebaseapp.com` |
| `PUBLIC_FIREBASE_PROJECT_ID` | the Firebase project id |
| `PUBLIC_FIREBASE_APP_ID` | from the Firebase web app config |

They are read at build time and inlined into the JavaScript, so redeploy after changing them. They are public identifiers, not secrets. Leave them unset to deploy without sign-in. Do not add `PUBLIC_FIREBASE_MEASUREMENT_ID`; the site has no analytics.

## 3. Domains

Project settings, Domains:

1. Add `inferview.io`. Vercel shows the DNS records to create at your registrar (an A record for the apex domain).
2. Add `www.inferview.io` and choose to redirect it to `inferview.io` (or the other way round; pick one canonical host). The canonical URLs in the pages use `https://inferview.io`, set as `site` in `astro.config.mjs`.
3. HTTPS certificates are issued automatically.

The `Strict-Transport-Security` header includes `preload`. Submit the domain to hstspreload.org only once you are sure every subdomain will serve HTTPS.

## 4. Preview deployments and sign-in

Every pull request gets a preview URL such as `inferview-git-<branch>-<team>.vercel.app`. Google sign-in only works on hosts listed in Firebase, Authentication, Settings, Authorised domains. Add the preview hosts you want to test sign-in on (Firebase does not accept wildcards), or test sign-in on production and `localhost` only. Everything except sign-in works on any preview URL.

## 5. Headers

`vercel.json` sets, for every page:

- `Content-Security-Policy`: scripts from the site itself plus the hash of the one inline theme snippet; `wasm-unsafe-eval` for the Pagefind search index; `apis.google.com` for the Google sign-in popup; connections to the Firebase Auth and Firestore hosts; frames from the Firebase auth domain and accounts.google.com; workers from the site only; no plugins, no framing.
- `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` denying camera, microphone, geolocation and more, `X-Frame-Options: DENY`.
- `Cross-Origin-Opener-Policy: same-origin-allow-popups`, which keeps the sign-in popup able to report back.

The Pyodide worker at `/workers/pyodide-worker.js` gets its own CSP: scripts and fetches from the site and `cdn.jsdelivr.net`, plus `wasm-unsafe-eval`. Pyodide runs without `unsafe-eval` in current Chrome; if a browser reports an eval CSP error from the worker, add `'unsafe-eval'` to that rule only.

If you change the inline theme script in `src/layouts/Base.astro`, the post-build check prints the new hash to put in `script-src`.

## 6. Check before you ship

```bash
npm run build
npm run preview        # serves dist/ on http://localhost:4321 with the vercel.json headers
```

Open a lesson, run the code cell, open a problem and pick an answer, and watch the browser console for CSP errors. Then, with the Firebase variables set in `.env`, sign in on `localhost`.

## 7. Known advisories

`npm audit` (checked 2026-10-28) reports advisories that only a major upgrade resolves: `npm audit fix --force` would move to Astro 7 and, for the gRPC advisories, downgrade Firebase to 9.14.0. Do not run it on a release branch. None of the advisories is reachable in this static build:

- Astro (`astro` and `@astrojs/mdx`, including the critical one): the XSS and SSRF advisories cover `define:vars`, `transition:*` directives, server islands, image optimisation, on-demand rendering, and attribute or slot names taken from request input. The site is `output: 'static'`, renders only content from this repository, uses none of the listed directives or features, and has no request input at build time.
- `esbuild`: arbitrary file read through the development server on Windows. It affects `npm run dev` only; production serves the files in `dist/`. Do not expose the dev server on a shared network.
- `sharp` (libvips, libheif, librsvg): the site does not use `astro:assets` or any image processing, so sharp never runs on untrusted images.
- `zod` and `zod-to-ts`: memory exhaustion on oversized collections. Zod only validates the content collections at build time, and that content is in the repository.
- `@grpc/grpc-js` (through `@firebase/firestore`): used by the Node.js build of Firestore only. The browser bundle comes from the package's `browser` entry and talks to Firestore over HTTPS.

Plan the Astro 7 upgrade as a separate change, then rerun `npm audit` and update this list.
