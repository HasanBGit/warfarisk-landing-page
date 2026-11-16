# WarfaRisk landing page: research notes

31 pages fetched and read (2026-11-16). Every URL below was fetched successfully. Two fetches returned 404 (web.dev baseline-and-built-in-animations, threejs.org useful-links), one returned 500 (robinwaite.com), and one (Material 3 easing tokens) returned no usable values; none of these are listed. Several sources are agency blogs (marked "blog"); numbers from them are directional, not proven.

## Landing page UX and conversion

1. Landing Page Structure: Key Elements & Best Layout (fibr.ai, blog) - https://fibr.ai/landing-page/structure
   Order: headline (under 20 words), subhead, one primary CTA, visual, social proof, trust badges, FAQ, minimal footer; limit nav and exit links.

## Scroll-driven animation, pinned storytelling

2. Scrollytelling guide (Chrome for Developers) - https://developer.chrome.com/docs/modern-web-guidance/guides/ui-behaviors/scrollytelling
   Feature-detect native scroll timelines, animate only transform/opacity, reset to visible under reduced motion, hide content only after JS adds a class.
3. Scroll-driven animations (Chrome for Developers) - https://developer.chrome.com/docs/css-ui/scroll-driven-animations
   `scroll()` vs `view()` timelines, `animation-range`, `animation-duration: auto`; can run off the main thread.
4. Sticky scrollytelling (The Pudding) - https://pudding.cool/process/scrollytelling-sticky/
   `position: sticky` beats scroll listeners: less JS, no jump, degrades to static content.
5. ScrollTrigger docs (GSAP) - https://gsap.com/docs/v3/Plugins/ScrollTrigger/
   Do not animate the pinned element itself, animate children; `scrub: 1` smooths; create triggers top to bottom; avoid `content-visibility` on pinned content; use `gsap.matchMedia()` for breakpoints.

## Smooth scroll (Lenis)

6. Lenis with Motion (motion.dev) - https://motion.dev/docs/lenis
   Run one RAF loop (`autoRaf: false`), `data-lenis-prevent` on inner scrollers, no CSS scroll-snap support, Safari capped at 60/30 fps, long JS tasks stall scroll.
7. Lenis README (GitHub, darkroomengineering) - https://github.com/darkroomengineering/lenis
   Defaults: `lerp` 0.1, duration 1.2 s, `syncTouch` false; `respectReducedMotion` true makes scroll 1:1 and anchors jump.
8. You probably don't need behavior: smooth in scrollIntoView (osvaldas.info) - https://osvaldas.info/you-probably-dont-need-behaviour-smooth-in-scrollintoview/
   Put smooth scrolling in CSS under `prefers-reduced-motion: no-preference`; do not hardcode `behavior: "smooth"`.

## 3D on the web (react-three-fiber / three.js)

9. Scaling performance (R3F docs) - https://r3f.docs.pmnd.rs/advanced/scaling-performance
   `frameloop="demand"` for static scenes, draw calls under 1000 (ideally a few hundred), instancing, shared geometry/material, PerformanceMonitor with dpr 1 to 2.
10. Performance pitfalls (R3F docs) - https://r3f.docs.pmnd.rs/advanced/pitfalls
    No setState per frame, mutate refs in `useFrame` with `delta`, no object allocation in loops, toggle `visible` instead of unmounting.
11. PerformanceMonitor (drei docs) - https://drei.docs.pmnd.rs/performances/performance-monitor
    Adaptive quality via `onDecline`/`onIncline`/`factor`; `flipflops` triggers a stable fallback.
12. Tips and tricks (discoverthree.js) - https://discoverthreejs.com/tips-and-tricks/
    Cap mobile pixel ratio at 2 to 3, Draco often under 10% of original size, smallest possible textures.
13. glTF-Transform - https://gltf-transform.dev/
    Pipeline for Draco/meshopt geometry, KTX2 or WebP textures, resize to 1024.

## prefers-reduced-motion and motion accessibility

14. prefers-reduced-motion: Sometimes less animation is better (web.dev) - https://web.dev/articles/prefers-reduced-motion
    Opt in to decorative motion under `no-preference`; JS animations need a `matchMedia` change listener; keep essential feedback motion.
15. prefers-reduced-motion and accessible animation (OpenReplay, blog) - https://blog.openreplay.com/prefers-reduced-motion-accessible-animation/
    Reduce or replace rather than delete: fades and short durations; durations as CSS variables overridden in one place; test with DevTools emulation.
16. Understanding SC 2.3.3 Animation from Interactions (W3C) - https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
    Non-essential interaction motion must be switchable off (AAA); scroll itself is exempt.

## WCAG 2.2 AA for marketing pages

17. Understanding SC 2.5.8 Target Size (Minimum) (W3C) - https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
    Pointer targets at least 24x24 CSS px, or spaced by a 24 px circle.
18. Understanding SC 2.4.11 Focus Not Obscured (W3C) - https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html
    Sticky headers must not fully cover focused items; use `scroll-padding-top`.
19. Understanding SC 2.2.2 Pause, Stop, Hide (W3C) - https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html
    Auto-moving content over 5 s needs a pause control (applies to looping 3D or video).
20. Color contrast (MDN) - https://developer.mozilla.org/en-US/docs/Web/Accessibility/Guides/Understanding_WCAG/Perceivable/Color_contrast
    AA: 4.5:1 body, 3:1 large text (18pt or 14pt bold), 3:1 for UI components and graphics.

## Core Web Vitals and animated pages

21. Optimize LCP (web.dev) - https://web.dev/articles/optimize-lcp
    Good is 2.5 s or less at p75; LCP resource in initial HTML, `fetchpriority="high"` on one or two images, never lazy-load it.
22. Optimize CLS (web.dev) - https://web.dev/articles/optimize-cls
    Good is 0.1 or less; reserve space (`aspect-ratio`, width/height), animate with `transform`, font metric overrides.
23. Optimize INP (web.dev) - https://web.dev/articles/optimize-inp
    Good is 200 ms or less; keep handlers short, yield to the main thread.
24. Animations guide (web.dev) - https://web.dev/articles/animations-guide
    Only `transform` and `opacity` are cheap; use `will-change` sparingly; verify with DevTools FPS meter and paint flashing.

## Typography and spacing

25. 8-Point Grid: Typography on the Web (freeCodeCamp) - https://www.freecodecamp.org/news/8-point-grid-typography-on-the-web-be5dc97db6bc/
    4 px baseline for line-heights, fixed pixel line-heights per size, marketing type is art-directed and fluid.
26. Spacing best practices (Cieden) - https://cieden.com/book/sub-atomic/spacing/spacing-best-practices
    Multiples of 8, internal spacing no larger than external, 12-column grid with 24 px gutter, 60 px side margins at 1440.

## Healthcare, research, scientific trust patterns

27. Trust signals for life sciences websites (eseospace, blog) - https://eseospace.com/blog/trust-signals-life-sciences-websites/
    Primary citations, named authors with disclosed ties, risk information next to benefit claims, visible review line and date, "cleared" not "approved".
28. Eight proven ways to inspire trust (PSQH) - https://psqh.com/analysis/eight-proven-ways-to-inspire-trust-and-credibility-with-your-healthcare-website
    Plain language, contact on every page, fast load, accessibility and white space, keep PHI off the site.

## Avoiding AI-looking slop

29. The "Built with AI" Tell: 12 Signals (Utsubo, blog) - https://www.utsubo.com/blog/built-with-ai-trust-signals-2026
    Stacked defaults hurt: gradient, Inter, centered hero, three equal cards, decorative fades, no real proof; tie motion to meaning.
30. How to Fix AI Slop in Web Design, Tell by Tell (Capital & Compute, blog) - https://capitalandcompute.net/blog/fix-ai-slop-design/
    Write a direction first (4 to 6 named colors, 1 to 2 typefaces); do not swap to the second-wave defaults (cream and terracotta, black and neon); no invented stats.
31. AI Slop Fonts and Gradients (925 Studios, blog) - https://www.925studios.co/blog/ai-slop-design-tells
    Palette from the product, break the three-card pattern, headlines that name audience and outcome.

## Rules we will apply

1. One primary CTA per viewport, repeated at hero, mid-page and final section; nav has at most 5 links plus one button. (fibr, Utsubo)
2. Hero headline under 20 words, naming the audience and the outcome (clinicians, warfarin dosing, fairness gap); one supporting proof element in the hero, such as paper venue or key metric.
3. Every number on the page links to its source (paper, table, dataset version). No invented statistics; each claim sits beside its limitation or population. (eseospace, Capital & Compute)
4. Disclaimer block states "research prototype, not for clinical use, not a medical device" in the hero footer area and again before the footer, plain language, at least body size, 4.5:1 contrast.
5. Show a "last reviewed" date, named authors with affiliations and a conflict-of-interest line; say "validated retrospectively" never "approved". (eseospace)
6. Lenis: `lerp` 0.1 (or duration 1.2 s), `autoRaf: false` with one RAF loop (or GSAP ticker), `syncTouch: false`, `respectReducedMotion` left true, `data-lenis-prevent` on any inner scroller. (Lenis, Motion)
7. Pinned stories use CSS `position: sticky` first; use GSAP ScrollTrigger only for scrubbed timelines, with `scrub: 1`, animating children not the pinned node. Each pin lasts at most about 3 viewport heights, with a visible step counter. (Pudding, GSAP)
8. Animate only `transform` and `opacity`; `will-change` only on elements currently animating; no layout-property animation. (web.dev)
9. Motion tokens as CSS variables: 150 ms micro (hover), 300 ms UI transitions, 600 to 800 ms reveals; ease-out `cubic-bezier(0.22, 1, 0.36, 1)` for entrances. Reveals shown once, no repeated fade-up on every block. (OpenReplay, Utsubo; specific curve is our choice)
10. `prefers-reduced-motion: reduce`: no smoothing, no parallax, pinned scenes become stacked static sections, reveals become instant or 150 ms fades, 3D shows a static poster. Test with DevTools emulation. (web.dev, Chrome)
11. Any auto-moving element lasting over 5 s (looping 3D, video) has a visible pause button. (WCAG 2.2.2)
12. Feature-detect native scroll timelines; content stays visible if JS or the effect fails (hide only after a JS-added class). (Chrome)
13. R3F: `frameloop="demand"` for scenes that are static between interactions; at most 3 canvases mounted at once; mount the canvas only when its section is within one viewport of view and unmount or `visible=false` off screen. (R3F docs)
14. 3D budgets: under 200 draw calls per scene (hard ceiling 1000), `dpr` clamped to [1, 2] on desktop and [1, 1.5] on mobile via PerformanceMonitor, no per-frame allocation, no `setState` in `useFrame`, assets under 500 KB per scene (Draco/meshopt, textures 1024 or smaller, KTX2 or WebP). (R3F, discoverthree.js, glTF-Transform; the 200 and 500 KB figures are our targets)
15. Every 3D scene has a static fallback image (same framing) for no-WebGL, reduced motion, Save-Data and low-end mobile; text content never depends on the canvas.
16. Core Web Vitals targets at p75 mobile: LCP 2.5 s or less, CLS 0.1 or less, INP 200 ms or less. Hero is text plus a poster image, not a 3D canvas; `fetchpriority="high"` on the single LCP image, never lazy-load it. (web.dev)
17. Reserve space for every image, canvas and chart (`aspect-ratio`); load fonts with `font-display: swap` plus metric-adjusted fallback to avoid shifts.
18. Contrast: 4.5:1 body, 3:1 large text and UI components including chart marks and focus rings; no information by color alone (fairness subgroups also get labels or patterns). (MDN, PSQH)
19. Interactive targets at least 24x24 px (aim 44 px on mobile); sticky header gets `scroll-padding-top` equal to its height so focus is never hidden. (WCAG 2.5.8, 2.4.11)
20. Smooth-scroll anchors and `scrollIntoView` go through CSS or Lenis, never a hardcoded `behavior: "smooth"`. (osvaldas)
21. Spacing on an 8 px scale (8, 16, 24, 32, 48, 64, 96, 128), line-heights on a 4 px step, inner padding no larger than outer margin; 12-column grid, 24 px gutter, 60 px side margin at 1440. (Cieden, freeCodeCamp)
22. Type: one family pair at most (a distinctive sans plus a mono for numbers), a 5 to 6 step scale, body 16 to 18 px at 1.5 to 1.6 line-height, headings 1.05 to 1.15 with slight negative tracking, measure 60 to 75 characters; fluid heading size via `clamp()`. (freeCodeCamp; ranges are our choice)
23. Palette: 4 to 6 named colors with roles, one accent, no purple-blue gradients, no glass blur, no glow, no emoji icons, no uppercase eyebrow over every heading, no three-identical-cards row; vary layout rhythm. (Utsubo, Capital & Compute, 925 Studios)
24. Use real artifacts instead of mock UI: actual figures from the pipeline, real tables, real SHAP or calibration plots, real citations.
25. Keep patient data and any PHI off the site; use only aggregate or synthetic examples and say which. (PSQH)
