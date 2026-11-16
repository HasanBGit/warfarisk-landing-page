import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { Icon } from "../components/Icon";
import { Collapse, Disclosure } from "../components/Disclosure";
import { Reveal } from "../components/Reveal";
import { useMediaQuery } from "../lib/hooks";
import { shap } from "../data/numbers";

const top = Math.max(...shap.rows.map((r) => r.value));
const SCALE = Math.ceil(top + 0.4); // shared scale for the paired chart
const pos = (v: number) => `${(v / SCALE) * 100}%`;
const TICKS = Array.from({ length: Math.floor(SCALE / 2) + 1 }, (_, i) => i * 2);
const tabs = [
  { id: "leans", label: "What the model leans on" },
  { id: "black", label: "For Black patients" },
] as const;


type ShapRow = (typeof shap.rows)[number];

function PairAxis() {
  return (
    <div className="pairs-axis" aria-hidden="true">
      <span className="pairs-plot-axis">
        {TICKS.map((t) => (
          <span key={t} style={{ left: pos(t) }}>
            {t}
          </span>
        ))}
      </span>
    </div>
  );
}

function PairRow({ row, idx }: { row: ShapRow; idx: number }) {
  const drop = row.feature === "VKORC1 (AA)";
  return (
    <li className={drop ? "is-drop" : ""} style={{ "--b": pos(row.value), "--a": pos(row.black), "--i": idx } as CSSProperties}>
      <span className="pairs-label">{row.feature}</span>
      <span className="pairs-plot" aria-hidden="true">
        <span className="pairs-link" />
        <span className="pd-all pairs-pt" style={{ left: pos(row.value) }} />
        <span className="pd-black pairs-pt pairs-move" style={{ left: pos(row.black) }} />
      </span>
      <span className="pairs-val">
        {row.value.toFixed(1)}
        <Icon name="right" />
        <b>{row.black.toFixed(2)}</b>
        <span className="sr-only"> from all patients to patients labelled Black</span>
      </span>
    </li>
  );
}

// Desktop: all seven inputs on one scale. Phone: the big drop first, the other six one tap away.
function Pairs() {
  const phone = useMediaQuery("(max-width: 559px)");
  const step = { "--step": `${(2 / SCALE) * 100}%` } as CSSProperties;
  const first = shap.rows[0];
  const rest = shap.rows.slice(1);
  return (
    <div className="pairs">
      <p className="pairs-key" aria-hidden="true">
        <span>
          <i className="pd-all" /> All patients
        </span>
        <span>
          <i className="pd-black" /> Patients labelled Black
        </span>
      </p>
      <PairAxis />
      {phone ? (
        <>
          <ul className="pairs-list" style={step}>
            <PairRow row={first} idx={0} />
          </ul>
          <Disclosure className="pairs-more" summary={`The other ${rest.length} inputs`}>
            <PairAxis />
            <ul className="pairs-list" style={step}>
              {rest.map((row, i) => (
                <PairRow key={row.feature} row={row} idx={i + 1} />
              ))}
            </ul>
          </Disclosure>
        </>
      ) : (
        <ul className="pairs-list" style={step}>
          {shap.rows.map((row, idx) => (
            <PairRow key={row.feature} row={row} idx={idx} />
          ))}
        </ul>
      )}
      <p className="note">Same scale for both. Black label: 74 patients.</p>
    </div>
  );
}

export function Explain() {
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("leans");
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: KeyboardEvent, i: number) => {
    const last = tabs.length - 1;
    const next = e.key === "ArrowRight" ? (i + 1) % tabs.length : e.key === "ArrowLeft" ? (i + last) % tabs.length : e.key === "Home" ? 0 : e.key === "End" ? last : -1;
    if (next < 0) return;
    e.preventDefault();
    setTab(tabs[next].id);
    refs.current[next]?.focus();
  };

  return (
    <section id="explain" className="section-tight" aria-labelledby="explain-title">
      <div className="container">
        <Reveal className="center-head">
          <h2 id="explain-title">Why a dose comes out as it does, and where the model runs short.</h2>
          <p className="lead">
            <span className="d-only">
              The tool shows which inputs pushed each dose up or down. Across patients genes carry about {shap.geneShare}% of that weight,
              led by VKORC1.
            </span>
            <span className="p-only">Genes carry about {shap.geneShare}% of the weight, led by VKORC1.</span>
          </p>
        </Reveal>

        <Reveal className="plain">
          <div className="tabbed">
            <div className="tablist" role="tablist" aria-label="Explanation" style={{ "--i": tabs.findIndex((t) => t.id === tab) } as CSSProperties}>
              <span className="tab-thumb" aria-hidden="true" />
              {tabs.map((t, i) => (
                <button
                  key={t.id}
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  id={`tab-${t.id}`}
                  type="button"
                  role="tab"
                  aria-selected={tab === t.id}
                  aria-controls={`panel-${t.id}`}
                  tabIndex={tab === t.id ? 0 : -1}
                  className={tab === t.id ? "is-on" : ""}
                  onClick={() => setTab(t.id)}
                  onKeyDown={(e) => onKey(e, i)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div key={tab} className="tabpanel" role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
              {tab === "leans" ? (
                <div className="card shap-card">
                  <div className="split" role="img" aria-label={`Genes carry ${shap.geneShare}% of the model's total weight, clinical details ${100 - shap.geneShare}%.`}>
                    <span className="split-gene" style={{ width: `${shap.geneShare}%` }}>
                      Genes {shap.geneShare}%
                    </span>
                    <span className="split-clin">Clinical details {100 - shap.geneShare}%</span>
                  </div>

                  <ul className="shap-bars">
                    {shap.rows.map((row) => (
                      <li key={row.feature} className={row.kind === "gene" ? "is-gene" : "is-clinical"}>
                        <span className="shap-label">
                          {row.feature}
                          <small>{row.kind === "gene" ? "Gene" : "Clinical"}</small>
                        </span>
                        <span className="shap-track" aria-hidden="true">
                          <span className="shap-fill" style={{ width: `${(row.value / top) * 100}%` }} />
                        </span>
                        <span className="shap-value">{row.value.toFixed(1)}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="note">
                    Average push on the dose. Top 7 of 11 inputs, 1,780-patient cohort.
                  </p>
                </div>
              ) : (
                <div className="vs">
                  <Pairs />
                  <div className="vs-text">
                    <h3>For Black patients, the main gene nearly drops out.</h3>
                    <p>
                      VKORC1 (AA) falls from {shap.vkorc1All.toFixed(1)} to {shap.vkorc1Black.toFixed(2)}. Age and weight take over.
                    </p>
                    <Collapse label="Why does it drop?">
                      <p>
                        The standard gene test leaves out variants common in people of African ancestry. The papers name that as the likely
                        reason, but it is not proven here.
                      </p>
                    </Collapse>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
