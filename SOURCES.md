# Sources and credits

## Borrowed examples

- The BPE merge stepper corpus (`low`, `lower`, `newest`, `widest`) is the worked example from Sennrich, Haddow and Birch, "Neural Machine Translation of Rare Words with Subword Units" (ACL 2016). Used as a teaching example; the stepper code is original.
- The BPE Python listing in the tokens lesson is original, written in the style of Karpathy's minbpe (MIT), which is linked from the lesson for depth.

## Measurements

- Token counts in `prototypes/tokens-real.js` and `research/tokens.json` were measured on 28 October 2026 with js-tiktoken 1.0.15 (`cl100k_base` and `o200k_base`). Token ids are shown as ranks because tiktoken assigns ids in merge order.
- Vocabulary sizes quoted in the lesson table come from the tokenizers' published vocabulary files: cl100k_base 100,256; o200k_base 199,998; Llama 3 128,256; Gemma 256,000.
- Prices on the prototype pages ($2.50 per million input tokens) are illustrative and labelled as such.

## Research

- `research/brief.json` and `research/raw-research.json` cite 89 external sources by URL. Each was fetched on 27 October 2026. Interview-format claims come from candidate reports on blogs and aggregators and are labelled as indicative in `PLAN.md`.

## Rules applied to copy and UI

- Anti-slop rules from https://github.com/miqdadbadjuber/anti-slop (version 3.2.23), copied into `research/antislop/` for reference and installed as skills in the user's Claude Code skills folder.

## Licences

- Code: MIT.
- Content (lessons, problems, answers): CC BY-SA 4.0.
- Fonts: Inter (SIL OFL), Fraunces (SIL OFL), JetBrains Mono (SIL OFL), loaded from Google Fonts.
