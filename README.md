# Inferview

Free, open-source interview prep for AI engineering, written for software engineers who already ship. Nine tracks, one lesson per module, a problem bank graded in the browser, a daily problem, and review scheduling. Progress stays in the browser, or syncs to the reader's own Firestore document after Google sign-in.

An Astro 5 static site, built from `SPEC.md`. Content lives in `src/content/` as MDX with a validated schema; `src/components/` holds the components lessons and problems import; `src/lib/` holds the progress store, auth and scheduling.

Other files:

- `SPEC.md`: the contract for code and content (stack, layout, schemas, progress shape, security).
- `PLAN.md`: research findings, product thesis, curriculum, retention mechanics, what is done and what is next.
- `DESIGN.md`: the visual and copy direction, with a one-line reason per decision.
- `SOURCES.md`: borrowed examples, measurements and licences. Each lesson and problem also lists its own sources in frontmatter.
- `docs/`: Firebase setup and Vercel deployment.
- `research/`: the research behind the plan and, under `research/tracks/`, the sourced notes behind each track.
- `prototypes/`: the static HTML prototypes the site was designed from (no build step; `npx -y serve prototypes -l 4173`).

## Working on it

```bash
npm install
npm run dev          # local dev server
npm run validate     # check every lesson and problem against the schema and the copy rules
npm run build        # validate, build to dist/, build the search index, check the CSP
npm run preview      # serve dist/ with the vercel.json headers on http://localhost:4321
npm run tokens       # re-measure the real token strips used by the tokens lesson
```

Sign-in is optional and needs a Firebase project: see `docs/firebase-setup.md`. Deployment: `docs/deploy-vercel.md`.
