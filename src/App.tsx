import { lazy, Suspense, useEffect, type ReactNode } from "react";
import { installSmoothAnchors } from "./lib/smoothAnchors";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Hero } from "./sections/Hero";
import { Problem } from "./sections/Problem";

// Sections below the first screen load when the page needs them, so the first paint stays light.
// Each keeps its own height while it loads, so the page does not jump when it arrives.
const Pipeline = lazy(() => import("./sections/Pipeline").then((m) => ({ default: m.Pipeline })));
const Findings = lazy(() => import("./sections/Findings").then((m) => ({ default: m.Findings })));
const Calibration = lazy(() => import("./sections/Calibration").then((m) => ({ default: m.Calibration })));
const Explain = lazy(() => import("./sections/Explain").then((m) => ({ default: m.Explain })));
const Demo = lazy(() => import("./sections/Demo").then((m) => ({ default: m.Demo })));
const Papers = lazy(() => import("./sections/Papers").then((m) => ({ default: m.Papers })));
const Team = lazy(() => import("./sections/Team").then((m) => ({ default: m.Team })));
const Sponsors = lazy(() => import("./sections/Sponsors").then((m) => ({ default: m.Sponsors })));
const Closing = lazy(() => import("./sections/Closing").then((m) => ({ default: m.Closing })));

function Pending({ children, minHeight = 480 }: { children: ReactNode; minHeight?: number }) {
  return <Suspense fallback={<div style={{ minHeight }} aria-hidden="true" />}>{children}</Suspense>;
}

export function App() {
  useEffect(() => installSmoothAnchors(), []);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <Problem />
        <Pending minHeight={900}>
          <Pipeline />
        </Pending>
        <Pending minHeight={700}>
          <Findings />
        </Pending>
        <Pending minHeight={900}>
          <Calibration />
        </Pending>
        <Pending minHeight={600}>
          <Explain />
        </Pending>
        <Pending minHeight={900}>
          <Demo />
        </Pending>
        <Pending minHeight={420}>
          <Papers />
        </Pending>
        <Pending minHeight={700}>
          <Team />
        </Pending>
        <Pending minHeight={260}>
          <Sponsors />
        </Pending>
        <Pending minHeight={260}>
          <Closing />
        </Pending>
      </main>
      <Footer />
    </>
  );
}
