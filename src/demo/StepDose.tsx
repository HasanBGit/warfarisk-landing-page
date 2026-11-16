import { CountUp } from "../components/CountUp";
import { Collapse } from "../components/Disclosure";
import { Icon } from "../components/Icon";
import { coverage } from "../data/numbers";
import { pct, STATUS, STATUS_ICON } from "../lib/status";
import { model, type Case } from "./demoData";

const SCALE_MAX = 60; // mg/week, the end of the range bar

function IntervalBar({ low, high, dose }: { low: number; high: number; dose: number }) {
  const at = (v: number) => `${(v / SCALE_MAX) * 100}%`;
  return (
    <div className="interval" role="img" aria-label={`Predicted dose ${dose} with a 90% range from ${low} to ${high} mg per week`}>
      <div className="interval-bar">
        <span className="interval-range" style={{ left: at(low), width: `calc(${at(high)} - ${at(low)})` }} />
        <span className="interval-dose" style={{ left: at(dose) }} />
      </div>
      <div className="interval-ends" aria-hidden="true">
        <span style={{ left: at(low) }}>{low.toFixed(1)}</span>
        <span style={{ left: at(high) }}>{high.toFixed(1)}</span>
      </div>
    </div>
  );
}

export function StepDose({ c, busy, onBack, onNext }: { c: Case; busy: boolean; onBack: () => void; onNext: () => void }) {
  const p = c.patient;
  const summary = `${p.age} years, ${p.weight} kg, ${p.ancestry}, ${p.indication.toLowerCase()}`;
  const width = c.interval[1] - c.interval[0];

  if (busy) {
    return (
      <div className="step" aria-busy="true">
        <p className="strip">Running the model for {summary}</p>
        <div className="step-grid">
          <div className="skeleton skeleton-dose" />
          <div className="skeleton skeleton-dose" />
        </div>
      </div>
    );
  }

  return (
    <div className="step">
      <p className="strip">{summary}</p>

      <div className="step-grid">
        <section className="panel">
          <p className="dose-label">Predicted weekly dose</p>
          <p className="dose-number">
            <CountUp value={c.dose} decimals={1} />
          </p>
          <p className="dose-unit">mg per week, about {(c.dose / 7).toFixed(1)} mg a day</p>
          <h3 className="h-sub range-title">90% range</h3>
          <IntervalBar low={c.interval[0]} high={c.interval[1]} dose={c.dose} />
          <p className="panel-note">
            {c.interval[0] <= 5
              ? `Same width for every patient, about ${coverage.widthAll} mg/week. Its low end is cut at 5 mg/week.`
              : `${width.toFixed(1)} mg/week wide, about the same for every patient.`}
          </p>
        </section>

        <div className="stack">
          <section className="panel">
            <h3>Did the range hold for this group?</h3>
            <p className={`status-mark mark-${c.status}`}>
              <Icon name={STATUS_ICON[c.status]} />
              {STATUS[c.status]}
            </p>
            {c.coverage !== null && (
              <p className="ink">
                For {p.ancestry} patients the true dose was inside the range {pct(c.coverage)} of the time. Goal: {coverage.target}%.
              </p>
            )}
            {c.status !== "green" && <p>{c.notice}</p>}
          </section>
          {c.penalty && (
            <section className="panel">
              <h3>A different problem: a new group</h3>
              <p>{c.penalty}</p>
            </section>
          )}
        </div>
      </div>

      <dl className="facts">
        <div>
          <dt>Average error</dt>
          <dd>
            {model.mae}
            <small>mg/week</small>
          </dd>
        </div>
        <div>
          <dt>Variation explained</dt>
          <dd>
            {model.r2}
            <small>R²</small>
          </dd>
        </div>
        <div>
          <dt>Within 20%</dt>
          <dd>
            {model.pw20}
            <small>of true dose</small>
          </dd>
        </div>
      </dl>
      <Collapse label="About the range">
        <p className="foot-note">
          The range is the model's 90th-percentile error on {model.testPatients.toLocaleString("en-US")} test patients, {model.halfWidth}{" "}
          mg/week either side. The papers use a similar width ({coverage.widthAll} mg/week). Group figures come from the papers.
        </p>
      </Collapse>

      <div className="step-foot">
        <button type="button" className="button button-ghost" onClick={onBack}>
          <Icon name="left" />
          Back
        </button>
        <span className="step-count">Step 2 of 3</span>
        <button type="button" className="button button-primary" onClick={onNext}>
          See why
          <Icon name="right" />
        </button>
      </div>
    </div>
  );
}
