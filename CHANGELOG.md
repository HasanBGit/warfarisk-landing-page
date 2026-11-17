# Changelog

All notable changes to the landing page are listed here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Deployment to a Cloudflare Worker with the custom domain warfarisk.com, set up in `wrangler.jsonc`.
- A link preview image and Open Graph and Twitter card tags, so a pasted link shows a preview.
- A Team section: the project leads on top, then the team, with photos, email for the leads and LinkedIn links.
- A deploy guide in `docs/DEPLOY.md`.

### Changed

- Colours: near-duplicate pinks and the two dark plums are merged into the shared tonal ramp, notes and focus use the accent tokens, and the neutral bar and amber status mark are slightly deeper so chart marks reach 3:1 contrast. An automated check finds no text contrast failures on desktop or phone.
- Sections below the first screen now mount only when the reader gets near them, each held in a slot that keeps the real height. A refresh or a link such as `/#team` lands in the right place with no layout shift, and a section that fails to load shows a message with a reload button instead of a blank page.
- Hover styles now apply only on devices that can hover, so they no longer stick after a tap on a phone.
- No grey flash on tap, and a press state on the small controls.
- Shorter entrances and chart fills, capped stagger delays, and one stronger ease-out curve across the page.
- Text entries (papers, pipeline steps, problem stats, team leads, notes) are grouped by space and one hairline instead of filled cards. Boxes are kept for charts, figures, the stat cards and the demo window.
- Reduced motion now keeps short fades and colour changes and drops movement, instead of switching everything off.
- The dose in the demo shows at once and no longer counts up through wrong numbers.
- The menu icon and the sliding dots animate with transforms only.

### Removed

- The saved screenshots of third-party websites, so the repository can be public.

## [0.1.0] - 2026-11-17

First release.

### Added

- Hero with a 3D seven-day pillbox that shows the predicted weekly dose and the 90% range for four example patients, with a flat fallback.
- Sections for the problem, the nine steps of the careful test, the findings, group coverage, why a dose comes out as it does, and the two papers.
- Group coverage chart with the paper's 95% intervals, sorted from best to worst and shown with icons as well as colour.
- Comparison of what the model leans on for all patients and for patients labelled Black.
- A three-screen demo (Patient, Dose, Why) with four fixed example patients.
- A phone layout with the same features as the desktop page: a swipeable deck for the nine steps, regrouped charts, and open and close rows for longer text.
- Smooth, time-capped scrolling for section links and buttons.
- Hidden accessible tables for the charts, keyboard support for tabs and open and close rows, and reduced-motion support.
- Source notes for every figure in `src/data/numbers.ts`, and a table of sources in `docs/DATA.md`.

[0.1.0]: https://github.com/HasanBGit/warfarisk-landing-page/releases/tag/v0.1.0
