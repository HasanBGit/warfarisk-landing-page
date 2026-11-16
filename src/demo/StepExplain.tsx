import { Collapse, FoldCard } from "../components/Disclosure";
import { Icon } from "../components/Icon";
import type { Case } from "./demoData";

export function StepExplain({ c, busy, onBack, onReset }: { c: Case; busy: boolean; onBack: () => void; onReset: () => void }) {
  const p = c.patient;
  const reach = Math.max(...c.impacts.map((i) => Math.abs(i.value)), 1);
  const total = c.impacts.reduce((sum, i) => sum + Math.abs(i.value), 0);
  const gene = c.impacts.filter((i) => i.kind === "gene").reduce((sum, i) => sum + Math.abs(i.value), 0);
  const genePct = total === 0 ? 0 : Math.round((gene / total) * 100);

  if (busy) {
    return (
      <div className="step" aria-busy="true">
        <p className="strip">Working out what moved the dose</p>
        <div className="step-grid">
          <div className="skeleton skeleton-dose" />
          <div className="skeleton skeleton-dose" />
        </div>
      </div>
    );
  }

  return (
    <div className="step">
      <p className="strip">
        Predicted {c.dose.toFixed(1)} mg/week for a {p.age}-year-old, {p.ancestry}
      </p>

      <div className="step-grid step-grid-wide">
        <section className="panel">
          <h3>How much each input moved the dose</h3>
          <p className="why-key" aria-hidden="true">
            <span>
              <i className="key-up" /> Raises the dose
            </span>
            <span>
              <i className="key-down" /> Lowers it
            </span>
          </p>
          <ul className="why-bars">
            {c.impacts.map((i, idx) => (
              <li key={i.label} className={i.value >= 0 ? "up" : "down"} style={{ "--i": idx } as React.CSSProperties}>
                <span className="why-label">
                  {i.label}
                  <small>{i.kind === "gene" ? "Gene" : "Clinical"}</small>
                </span>
                <span className="why-track" aria-hidden="true">
                  <span className="why-mid" />
                  <span className="why-fill" style={{ width: `${(Math.abs(i.value) / reach) * 50}%`, [i.value >= 0 ? "left" : "right"]: "50%" }} />
                </span>
                <span className="why-value">
                  {i.value > 0 ? "+" : ""}
                  {i.value.toFixed(1)}
                  <span className="sr-only"> mg per week, {i.value >= 0 ? "raises" : "lowers"} the dose</span>
                </span>
              </li>
            ))}
          </ul>
          <Collapse label="How this is measured">
            <p className="panel-note">In mg/week. Each input is set back to the typical value to see how the model's dose changes.</p>
          </Collapse>
        </section>

        <div className="stack">
          <section className="panel">
            <h3>Genes and clinical details</h3>
            {p.cyp2c9 === null ? (
              <p>No genes were entered, so none could shape this dose.</p>
            ) : gene === 0 ? (
              <p>Both genes sit at the model's typical value, so clinical details moved this dose.</p>
            ) : (
              <>
                <div className="split" role="img" aria-label={`Genes ${genePct}% of the push on this dose, clinical details ${100 - genePct}%.`}>
                  <span className="split-gene" style={{ width: `${genePct}%` }}>
                    Genes {genePct}%
                  </span>
                  <span className="split-clin">Clinical {100 - genePct}%</span>
                </div>
              </>
            )}
          </section>
          <FoldCard as="section" className="panel" title="Where the rules come from">
            <ul className="links">
              <li>
                <a href="https://cpicpgx.org/guidelines/guideline-for-warfarin-and-cyp2c9-and-vkorc1/" rel="noreferrer">
                  CPIC warfarin guideline
                  <Icon name="right" />
                </a>
              </li>
              <li>
                <a href="https://doi.org/10.1056/NEJMoa0809329" rel="noreferrer">
                  IWPC dosing formula
                  <Icon name="right" />
                </a>
              </li>
            </ul>
          </FoldCard>
          <FoldCard as="section" className="panel" title="Plain-language reason">
            <p>A language model writes a short reason that cites its sources. That step is a prototype-stage extension, so it is not shown here.</p>
          </FoldCard>
        </div>
      </div>

      <div className="step-foot">
        <button type="button" className="button button-ghost" onClick={onBack}>
          <Icon name="left" />
          Back
        </button>
        <span className="step-count">Step 3 of 3</span>
        <button type="button" className="button button-primary" onClick={onReset}>
          <Icon name="reset" />
          New patient
        </button>
      </div>
    </div>
  );
}
