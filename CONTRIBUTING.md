# Contributing

Thank you for helping. This page explains two papers on a medical topic, so accuracy matters more than anything else.

## Run it

```
bun install
bun run dev
```

Before you open a pull request, run `bun run build`. It type-checks the code and builds the site, and it must pass.

## Numbers

- Every figure comes from `src/data/numbers.ts` or `src/demo/demoData.ts`, with the paper table or section it comes from.
- Do not type a figure into a component, and do not round or restate one in prose.
- If a figure changes, change it in the data file, add the source in the comment, and update `docs/DATA.md`.
- Never invent a number, a claim or a source. If the papers do not say it, the page does not say it.

## Wording

- Plain words and short sentences. No hype, no exclamation marks, no em dashes.
- Keep the research-prototype notice in the demo and in the footer. The tool is not validated for clinical use.
- Do not call the nine steps "tested" unless the papers report results for them. Steps 7 to 9 are described as prototype extensions.

## Design

- Colours, radii and type are tokens in `src/styles.css`. Use the tokens, not new values.
- One accent colour. Green, amber and red mean status only. Status always has an icon and a word as well as a colour.
- Three corner sizes: 8 px for controls, 16 px for cards, 28 px for large panels.
- Give each box one separation device: a tint, a border or a shadow, not several.
- No text under 14 px. Do not fade text with opacity.
- Every 3D scene needs a flat fallback, and motion must stop for visitors who prefer reduced motion.
- Every feature on the desktop page must also exist on a phone.

## Accessibility

- Charts need a text alternative with the same values.
- Everything must work with a keyboard, with a visible focus ring.
- Run axe-core on the page at 320, 390 and 1440 px before you open a pull request. There should be no violations.

## Dependencies

Open an issue before adding a dependency. The page is small on purpose.

## Pull requests

- Keep each pull request to one change.
- Write the commit message as a short plain sentence that says what changed and why.
- Fill in the pull request template, including how you checked the numbers.
