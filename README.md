# WarfaRisk landing page

A one-page site that explains two open papers on warfarin dose prediction and lets you try a four-example demo of the WarfaRisk prototype. It shows a predicted weekly dose, a 90% range around it, and how well that range held up for each ancestry group.

> **Research prototype. Not tested in patients and not for clinical use.** The dose and range shown here come from a model trained on public research data. They must not be used to make dosing decisions.

## What the page shows

| Section | What it does |
| --- | --- |
| Hero | A seven-day pillbox in 3D. Tablets are the predicted weekly dose, outlines are the extra room up to the top of the 90% range. Switch between four example patients. |
| The problem | Why a good score can come from a small test: 64 patients against 1,207. |
| What we built | The nine steps of the careful test. A swipeable card deck on phones. |
| What we found | Average error, the share of doses within 20%, and the variation explained, with a comparison against simple methods. |
| Who it misses | The share of true doses inside the 90% range for each ancestry group, with the paper's 95% intervals. |
| Why a dose comes out as it does | Which inputs push the dose up or down, and how that changes for patients labelled Black. |
| Try it | A three-screen demo (Patient, Dose, Why) with four fixed examples. |
| Papers | Links to the two papers. |
| Team | The three project leads first, with email for the leads, then the team. A LinkedIn icon shows for anyone with an address in `src/data/team.ts`. |

## Where the numbers come from

Every number on the page lives in one of two files, each with the paper table or section it comes from:

- `src/data/numbers.ts` holds the figures from the papers.
- `src/demo/demoData.ts` holds the demo outputs, which are real predictions of the exported CatBoost model run locally on four example patients.

[docs/DATA.md](docs/DATA.md) lists the source of each figure. Do not type a figure into a component. Add it to the data file with its source.

## Live site

The page is published at https://warfarisk.com from a Cloudflare Worker that serves the built `dist/` folder. To update it, run `bun run build` and then `bunx wrangler deploy`. See [docs/DEPLOY.md](docs/DEPLOY.md) for how the domain is set up.

## Getting started

You need [Bun](https://bun.sh) (the lockfile is `bun.lock`).

```
bun install
bun run dev       # http://localhost:5173
bun run build     # type-check, then build to dist/
bun run preview   # serve the built site
```

The build is a static site. `dist/` can be served from any static host.

## Built with

- Vite 8, React 19 and TypeScript 7
- three.js 0.186 through @react-three/fiber 9, loaded as a separate chunk only when the 3D pillbox is shown
- Plain CSS with design tokens in `src/styles.css`, and Inter for type

There is no backend, no analytics and no cookies. The page stores nothing in the browser and sends nothing anywhere. The only outside request is the Inter font from Google Fonts.

## Project structure

```
src/
  App.tsx            page order, lazy-loaded sections
  sections/          one file per section of the page
  components/        shared pieces: charts, icons, the open and close rows, the hero tool
  demo/              the three-screen demo and its example patients
  scene/             the 3D pillbox
  data/numbers.ts    every figure from the papers, with its source
  lib/               small helpers: hooks, status wording, smooth anchor scrolling
  styles.css         tokens and all styles
public/              partner logos, team photos and the link preview image
.github/             issue and pull request templates
wrangler.jsonc       Cloudflare Worker config and custom domains
docs/                data sources, deploy guide, research notes
```

## Design rules in short

- Plain words, short sentences, no hype, no em dashes.
- One accent colour. Green, amber and red mean status only, and status is always shown with an icon and a word, never colour alone.
- Three corner sizes (8, 16 and 28 px). One separation device per box: a tint, a border or a shadow, not all three.
- Nothing smaller than 14 px.
- Every 3D scene has a flat fallback. Motion is off when the visitor prefers reduced motion.

The full list is in [CONTRIBUTING.md](CONTRIBUTING.md).

## Phones

Everything on the desktop page is on the phone too, laid out for a narrow screen. The nine steps become a swipeable deck, long explanations sit behind a tap, and the two charts are regrouped so they stay readable. The 3D pillbox is shown on phones too, with the flat version as the fallback when WebGL or motion is not available.

## Accessibility

Before the first release the page was checked with axe-core at phone and desktop widths, and no violations were found. These are automated checks only. The charts have a hidden table with the same values, the section links move keyboard focus to the section, and the tabs and open and close rows work with the keyboard. Please report anything that fails.

## The papers

- Beyond Mean Absolute Error: Ancestry-Stratified Calibration and Explainability for Warfarin Dosing Models. *Journal of Personalized Medicine*, 2026, 16(10), 531. DOI [10.3390/jpm16100531](https://doi.org/10.3390/jpm16100531)
- WarfaRisk: A Reproducible, Fairness-Aware Machine Learning Pipeline for Warfarin Dose Prediction (Prototype). *AI*, 2026, 7(10), 431. DOI [10.3390/ai7100431](https://doi.org/10.3390/ai7100431)

Related repositories:

- [WarfaRisk](https://github.com/HasanBGit/WarfaRisk): the pipeline code and the prototype app
- [WarfaRisk-Prototype-UI](https://github.com/HasanBGit/WarfaRisk-Prototype-UI): the interface demo in React
- [Trained models](https://huggingface.co/collections/HassanB4/beyond-mae-ancestry-stratified-warfarin-dose-prediction) on Hugging Face

## Releases

Versions are tagged `vMAJOR.MINOR.PATCH`. Each release on the Releases page has notes and a zip of the built site. Changes are listed in [CHANGELOG.md](CHANGELOG.md). To make your own build, run `bun run build` and zip the contents of `dist/`.

## Contributing and security

- [CONTRIBUTING.md](CONTRIBUTING.md) explains how to run the page, the rules for numbers and wording, and how to open a pull request.
- [SECURITY.md](SECURITY.md) explains how to report a problem privately.

## Supported by

The authors thank the Alfaisal AI Center at Alfaisal University for infrastructure support.

## License

The source code is licensed under the Apache License 2.0, see [LICENSE](LICENSE). The partner logos, and the text, tables and figures of the papers, are not covered by that license, see [NOTICE](NOTICE). The logos in `public/` are low resolution, so ask Alfaisal for SVG versions before using them large.
