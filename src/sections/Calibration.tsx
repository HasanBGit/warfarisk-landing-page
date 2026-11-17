import { CoverageBars } from "../components/CoverageBars";
import { Collapse, FoldCard } from "../components/Disclosure";
import { Icon } from "../components/Icon";
import { Reveal } from "../components/Reveal";
import { coverage, mondrian } from "../data/numbers";

export function Calibration() {
  return (
    <section className="section-tight" aria-labelledby="calibration-title">
      <div className="container">
        <Reveal className="center-head">
          <h2 id="calibration-title">The tool says how sure it is. For some groups it is too sure.</h2>
          <p className="lead">
            Each dose comes with a range that should hold the true dose 9 times out of 10. Across all patients it does: {coverage.overall}%.
            <span className="d-only"> A common shortcut, averaging five neural networks, reached only {coverage.deepEnsemble}%.</span>
          </p>
          <Collapse hideOnDesktop label="The common shortcut">
            <p className="lead">Averaging five neural networks reached only {coverage.deepEnsemble}%.</p>
          </Collapse>
        </Reveal>

        <Reveal className="plain">
          <CoverageBars />
        </Reveal>
        <div className="calib-side">
          <FoldCard className="calib-card" title="Split by ancestry, it does not" defaultOpen>
            <p>
              For the two red groups, about 1 true dose in 3 fell outside the range, against about 1 in 10 overall. Every range was the
              same width, about {coverage.widthAll} mg/week, so the tool sounded just as sure.
            </p>
          </FoldCard>
          <FoldCard className="calib-card" title="Calibrating each group helps">
            <ul className="fixes">
              {mondrian.slice(0, 2).map((m) => (
                <li key={m.label}>
                  <span>{m.label}</span>
                  <b>
                    {m.before}% <Icon name="right" /> {m.after}%
                  </b>
                </li>
              ))}
            </ul>
            <p>Ranges get wider, and groups too small to measure stay out of reach.</p>
          </FoldCard>
        </div>
      </div>
    </section>
  );
}
