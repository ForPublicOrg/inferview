# Inferview design direction

Scope: the prototypes in `prototypes/`. The anti-slop rules (R-31, R-37) ask for a written direction and a one-line reason per decision. This is it. Revised after the first round of prototypes read as generic.

## The learning pattern

Nine tracks in one order, each a set of modules with lessons, widgets and interview questions. The landing page shows the daily problem, the track list with progress, and one live widget. Lessons follow a fixed skeleton (hook, toy numbers, one widget, real numbers, code, three-depth answer, self-rating) and every question becomes a review card. Two graph-style home pages were tried and rejected as too much to read; the graph data is kept in research notes.

## Character

A reading-first site for working engineers that treats interactive tools as instruments, not decoration. The landing page is a short pitch, the daily problem, and the track list; the rest is lessons and problems.

Dials: ENERGY 2, RHYTHM 3, MOTION 1 (only widget state changes animate; nothing loops).

## Decisions and reasons

- Typography: IBM Plex in three cuts. Plex Sans for UI because it stays legible at small sizes in tables and tags; Plex Serif for lesson prose because long technical reading is easier in a serif and it separates "reading" from "doing"; Plex Mono for tokens, traces and code. One family, so the three registers belong together. Reason for leaving Inter: it was the default pick, not a choice.
- Palette: warm paper and ink, one accent (deep green) for interactive state and links, amber only for warnings, and three status colours used only for difficulty. No other colour, so the accent keeps its meaning.
- Theme: follows the system, with a toggle that persists. Reason: people study at night; the reader chooses.
- Phone: every layout collapses to one column; the problem page moves the trace above the prompt so the order matches the instructions.
- Numbers: every number on a page is measured (tokens), from a published spec (vocabulary sizes, model configs), or sample state under a visible "Prototype" banner.
- Links point only at pages that exist in the prototype or at real external sources.
- No icons, no emoji, no arrows, no shadows, no gradients. Cards have a 1px border; widgets have a heavier border so tools read differently from text.

## Copy rules

Plain sentences, a candid first-person voice in lessons, one running metaphor per lesson. No em dashes, no buzzwords, no fabricated anecdotes (scenarios are labelled as scenarios), no announcing what the text is about to do. Lists have as many items as the content has. Emphasis is written into the sentence, not shouted with caps or bold.
