import { DemoShell } from "../demo/DemoShell";
import { Collapse } from "../components/Disclosure";
import { Reveal } from "../components/Reveal";

export function Demo() {
  return (
    <section className="section-tight demo" aria-labelledby="demo-title">
      <div className="container">
        <Reveal className="center-head">
          <h2 id="demo-title">Here is the tool, with four real examples.</h2>
          <p className="lead">
            <span className="d-only">
              Pick a patient and follow the three screens a clinician would see. Dose, range and input effects come from the real model;
              group figures come from the papers. Research prototype, not for clinical use.
            </span>
            <span className="p-only">Pick a patient and follow the three screens. Research prototype, not for clinical use.</span>
          </p>
          <Collapse hideOnDesktop label="Where the numbers come from">
            <p className="lead">Dose, range and input effects come from the real model. Group figures come from the papers.</p>
          </Collapse>
        </Reveal>
        <DemoShell />
      </div>
    </section>
  );
}
