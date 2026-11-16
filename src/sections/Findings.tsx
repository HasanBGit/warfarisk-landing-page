import { CountUp } from "../components/CountUp";
import { Icon } from "../components/Icon";
import { Reveal } from "../components/Reveal";
import { accuracy, best, pw20Mark, rigor } from "../data/numbers";

const max = Math.max(...accuracy.map((a) => a.mae));

const stats = [
  { label: "Average error", value: best.mae, decimals: 2, unit: "mg/week", note: "Lower is better. Best model, public IWPC data.", short: "Lower is better." },
  { label: "Doses within 20% of the true dose", value: best.pw20 * 100, decimals: 1, unit: "%", note: `The usual bar is ${pw20Mark * 100}%. We did not reach it.`, short: `The usual bar is ${pw20Mark * 100}%. Not reached.` },
  { label: "Dose variation explained", value: best.r2 * 100, decimals: 1, unit: "%", note: "Genes added roughly 10 to 20 points over clinical details alone.", short: "Genes add 10 to 20 points." },
];

export function Findings() {
  return (
    <section id="findings" className="section-tight" aria-labelledby="findings-title">
      <div className="container">
        <Reveal className="center-head">
          <h2 id="findings-title">The first result: genes help, but not enough yet.</h2>
          <p className="lead">
            On {rigor.testPatients.toLocaleString("en-US")} test patients, every model that used genes beat the same model without them.
          </p>
        </Reveal>

        <Reveal className="plain stat-row">
          {stats.map((s, i) => (
            <article key={s.label} className="stat-card stagger-item" style={{ "--i": i } as React.CSSProperties}>
              <p className="stat-label">{s.label}</p>
              <p className="stat-big">
                <CountUp value={s.value} decimals={s.decimals} />
                <small>{s.unit}</small>
              </p>
              <p className="stat-note">
                <span className="d-only">{s.note}</span>
                <span className="p-only">{s.short}</span>
              </p>
            </article>
          ))}
        </Reveal>

        <Reveal className="plain findings-grid">
          <div className="card stagger-item" style={{ "--i": 3 } as React.CSSProperties}>
            <h3>Average error by method, mg/week</h3>
            <ul className="mae-bars">
              {accuracy.map((row, index) => (
                <li key={row.label} className={index === accuracy.length - 1 ? "is-best" : ""}>
                  <span className="mae-label">{row.label}</span>
                  <span className="mae-track" aria-hidden="true">
                    <span className="mae-fill" style={{ width: `${(row.mae / max) * 100}%` }} />
                  </span>
                  <span className="mae-value">{row.mae.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card card-check stagger-item" style={{ "--i": 4 } as React.CSSProperties}>
            <Icon name="check" className="card-icon" />
            <h3>{rigor.leakChecks} leak checks before any model trains</h3>
            <p>Training and test patients never overlap.</p>
          </div>
        </Reveal>

        <Reveal className="bridge">
          <p>An average says nothing about who the tool works for. So we checked.</p>
        </Reveal>
      </div>
    </section>
  );
}
