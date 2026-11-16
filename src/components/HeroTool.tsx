import { lazy, Suspense, useEffect, useId, useRef, useState } from "react";
import { cases } from "../demo/demoData";
import { Icon } from "./Icon";
import { pct, STATUS, STATUS_ICON } from "../lib/status";
import { hasWebGL, useReducedMotion } from "../lib/hooks";
import { pillboxLabel } from "../lib/pillbox";
import { Pillbox2D } from "./Pillbox2D";

// Counts a shown number to its new value, so a change reads as a change. Instant with reduced motion.
function useTween(value: number, instant: boolean, ms = 450) {
  const [v, setV] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    if (instant) {
      from.current = value;
      setV(value);
      return;
    }
    const f = from.current;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - t0) / ms, 1);
      const now = f + (value - f) * (1 - (1 - p) ** 3);
      from.current = now;
      setV(now);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, instant, ms]);
  return v;
}

const PillboxScene = lazy(() => import("../scene/PillboxScene"));

const LABELS: Record<string, string> = {
  a: "Han Chinese",
  b: "Black or African American",
  c: "Caucasian",
  d: "No genes",
};

// The real tool output on four example patients, drawn as a weekly pillbox.
export function HeroTool() {
  const [id, setId] = useState("a");
  const [ready, setReady] = useState(false);
  const name = useId();
  const calm = useReducedMotion();
  const [webgl] = useState(hasWebGL);
  const c = cases.find((x) => x.id === id) ?? cases[0];
  const p = c.patient;
  const dose = Math.round(c.dose);
  const high = Math.round(c.interval[1]);
  const show3d = !calm && webgl;
  const shownDose = useTween(c.dose, calm);
  const shownLow = useTween(c.interval[0], calm);
  const shownHigh = useTween(c.interval[1], calm);

  return (
    <figure className="hero-tool">
      <fieldset className="seg">
        <legend>Example patient</legend>
        <div className="seg-track" style={{ "--i": cases.findIndex((x) => x.id === id) } as React.CSSProperties}>
          <span className="seg-thumb" aria-hidden="true" />
          {cases.map((x) => (
            <label key={x.id} className={x.id === id ? "is-on" : ""}>
              <input type="radio" name={name} value={x.id} checked={x.id === id} onChange={() => setId(x.id)} />
              <span>{LABELS[x.id]}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className={`pillbox ${show3d ? "is-3d" : ""} ${ready || !show3d ? "is-ready" : ""}`} role="img" aria-label={pillboxLabel(dose, high - dose)}>
        {show3d ? (
          <Suspense fallback={null}>
            <PillboxScene dose={dose} high={high} onReady={() => setReady(true)} />
          </Suspense>
        ) : (
          <Pillbox2D dose={dose} high={high} />
        )}
      </div>

      <div className="readout">
        <dl className="tool-readout">
          <div>
            <dt>
              <i className="key-tablet" aria-hidden="true" /> Weekly dose
            </dt>
            <dd className="tool-dose-num">
              {shownDose.toFixed(1)} <small>mg</small>
            </dd>
          </div>
          <div>
            <dt>
              <i className="key-ghost" aria-hidden="true" /> 90% range
            </dt>
            <dd>
              {shownLow.toFixed(1)} to {shownHigh.toFixed(1)} <small>mg</small>
            </dd>
          </div>
        </dl>
        <p className="tool-status" aria-live="polite" key={id}>
          <b className={`status-mark mark-${c.status}`}>
            <Icon name={STATUS_ICON[c.status]} />
            {STATUS[c.status]}
          </b>
          <span>
            {c.coverage !== null ? (
              <>
                <span className="d-only">
                  For {p.ancestry} patients the true dose was inside the range {pct(c.coverage)} of the time. Goal: 90%.
                </span>
                <span className="p-only">
                  Inside the range {pct(c.coverage)} of the time. Goal: 90%.
                </span>
              </>
            ) : (
              "No genes entered, so no group check."
            )}
          </span>
        </p>
      </div>
      <figcaption className="hero-caption">Tablets are an illustration. Research prototype.</figcaption>
    </figure>
  );
}
