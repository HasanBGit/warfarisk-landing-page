import { Icon } from "../components/Icon";
import type { Case } from "./demoData";

function Row({ label, value, unit }: { label: string; value: string | number; unit?: string }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>
        {value}
        {unit && <small>{unit}</small>}
      </dd>
    </div>
  );
}

function Medicine({ label, on }: { label: string; on: boolean }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>
        <Icon name={on ? "check" : "minus"} />
        {on ? "Yes" : "No"}
      </dd>
    </div>
  );
}

// The example inputs are fixed, so they are shown as plain text, not as form fields.
export function StepInput({ c, onNext }: { c: Case; onNext: () => void }) {
  const p = c.patient;
  return (
    <div className="step">
      <p className="demo-note">Example values, so they cannot be edited. Pick another patient above to see a different result.</p>
      <div className="step-grid">
        <section className="panel">
          <h3>Patient</h3>
          <dl className="kv">
            <Row label="Age" value={p.age} unit="years" />
            <Row label="Weight" value={p.weight} unit="kg" />
            <Row label="Height" value={p.height} unit="cm" />
            <Row label="Target INR" value={p.targetInr} unit="range 2.0 to 3.0" />
            <Row label="Reason for warfarin" value={p.indication} />
            <Row label="Ancestry" value={p.ancestry} />
          </dl>
        </section>

        <div className="stack">
          <section className="panel">
            <h3>Other medicines</h3>
            <dl className="kv">
              <Medicine label="Amiodarone" on={p.amiodarone} />
              <Medicine label="Statin" on={p.statin} />
              <Medicine label="Enzyme inducer" on={p.inducer} />
            </dl>
          </section>
          <section className="panel">
            <h3>Genes</h3>
            <dl className="kv">
              <Row label="CYP2C9" value={p.cyp2c9 ?? "Not entered"} />
              <Row label="VKORC1 -1639G>A" value={p.vkorc1 ?? "Not entered"} />
            </dl>
            <p className="panel-note">Optional. Without genes the model uses clinical details alone.</p>
          </section>
        </div>
      </div>

      <div className="step-foot">
        <span className="step-count">Step 1 of 3</span>
        <button type="button" className="button button-primary" onClick={onNext}>
          Predict dose
          <Icon name="right" />
        </button>
      </div>
    </div>
  );
}
