import { lazy, useEffect } from "react";
import { installSmoothAnchors } from "./lib/smoothAnchors";
import { useScrollRestore } from "./lib/scrollRestore";
import { LazySlot } from "./components/LazySlot";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Hero } from "./sections/Hero";
import { Problem } from "./sections/Problem";

// The first screen (Hero) and the section right under it (Problem) load with the page.
// Everything below is its own chunk, fetched when the reader gets near it (see LazySlot),
// and fetched quietly in the background once the browser is idle, so scrolling never waits.
const load = {
  pipeline: () => import("./sections/Pipeline").then((m) => ({ default: m.Pipeline })),
  findings: () => import("./sections/Findings").then((m) => ({ default: m.Findings })),
  calibration: () => import("./sections/Calibration").then((m) => ({ default: m.Calibration })),
  explain: () => import("./sections/Explain").then((m) => ({ default: m.Explain })),
  demo: () => import("./sections/Demo").then((m) => ({ default: m.Demo })),
  papers: () => import("./sections/Papers").then((m) => ({ default: m.Papers })),
  team: () => import("./sections/Team").then((m) => ({ default: m.Team })),
  sponsors: () => import("./sections/Sponsors").then((m) => ({ default: m.Sponsors })),
  closing: () => import("./sections/Closing").then((m) => ({ default: m.Closing })),
};

const Pipeline = lazy(load.pipeline);
const Findings = lazy(load.findings);
const Calibration = lazy(load.calibration);
const Explain = lazy(load.explain);
const Demo = lazy(load.demo);
const Papers = lazy(load.papers);
const Team = lazy(load.team);
const Sponsors = lazy(load.sponsors);
const Closing = lazy(load.closing);

// Section heights measured on a phone (390), a tablet (820) and a desktop (1440).
// They only stand in until a section is on screen. After that the real height is remembered.
const slots = [
  { key: "pipeline", id: "pipeline", heights: [487, 937, 767], Section: Pipeline },
  { key: "findings", id: "findings", heights: [1243, 1236, 951], Section: Findings },
  { key: "calibration", id: "calibration", heights: [1182, 1320, 1283], Section: Calibration },
  { key: "explain", id: "explain", heights: [907, 798, 877], Section: Explain },
  { key: "demo", id: "demo", heights: [1561, 1448, 1150], Section: Demo },
  { key: "papers", id: "papers", heights: [824, 747, 618], Section: Papers },
  { key: "team", id: "team", heights: [1019, 1048, 795], Section: Team },
  { key: "sponsors", id: "sponsors", heights: [365, 288, 349], Section: Sponsors },
  { key: "closing", id: undefined, heights: [366, 313, 430], Section: Closing },
] as const;

export function App() {
  useScrollRestore();
  useEffect(() => installSmoothAnchors(), []);

  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((fn: () => void) => window.setTimeout(fn, 1500));
    const handle = idle(() => Object.values(load).forEach((fetchChunk) => void fetchChunk().catch(() => undefined)));
    return () => (window.cancelIdleCallback ? window.cancelIdleCallback(handle as number) : window.clearTimeout(handle as number));
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <Problem />
        {slots.map(({ key, id, heights, Section }) => (
          <LazySlot key={key} slotKey={key} id={id} heights={heights}>
            <Section />
          </LazySlot>
        ))}
      </main>
      <Footer />
    </>
  );
}
