import { renderToStaticMarkup } from "react-dom/server";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Hero } from "./sections/Hero";
import { Problem } from "./sections/Problem";
import { Pipeline } from "./sections/Pipeline";
import { Findings } from "./sections/Findings";
import { Calibration } from "./sections/Calibration";
import { Explain } from "./sections/Explain";
import { Demo } from "./sections/Demo";
import { Papers } from "./sections/Papers";
import { Team } from "./sections/Team";
import { Sponsors } from "./sections/Sponsors";
import { Closing } from "./sections/Closing";

// The whole page as plain HTML, with every section in place. It is built at deploy time from the same
// components as the live page and served to crawlers that do not run scripts (see worker/index.js),
// so what they read is always the same text and numbers as the page.
const sections = [
  ["pipeline", Pipeline],
  ["findings", Findings],
  ["calibration", Calibration],
  ["explain", Explain],
  ["demo", Demo],
  ["papers", Papers],
  ["team", Team],
  ["sponsors", Sponsors],
] as const;

export function renderPage(): string {
  return renderToStaticMarkup(
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <Problem />
        {sections.map(([id, Section]) => (
          <div key={id} id={id} className="lazy-slot">
            <Section />
          </div>
        ))}
        <div className="lazy-slot">
          <Closing />
        </div>
      </main>
      <Footer />
    </>,
  );
}
