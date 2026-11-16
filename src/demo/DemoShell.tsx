import { useEffect, useRef, useState } from "react";
import { Brand } from "../components/Brand";
import { Icon } from "../components/Icon";
import { cases } from "./demoData";
import { StepInput } from "./StepInput";
import { StepDose } from "./StepDose";
import { StepExplain } from "./StepExplain";

const steps = ["Patient", "Dose", "Why"] as const;

// All demo state lives here: which example is chosen, which screen is open, and whether the next
// screen is still "running". The result itself is derived from the chosen case, never stored twice.
export function DemoShell() {
  const [caseId, setCaseId] = useState(cases[0].id);
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [dir, setDir] = useState<"fwd" | "back" | "none">("none");
  const [height, setHeight] = useState<number>();
  const inner = useRef<HTMLDivElement>(null);
  const app = useRef<HTMLDivElement>(null);
  const current = cases.find((c) => c.id === caseId) ?? cases[0];

  // Moving to a new screen takes a moment, as the real model does: the dose first, the explanation after.
  useEffect(() => {
    if (!busy) return;
    const timer = window.setTimeout(() => setBusy(false), step === 1 ? 650 : 500);
    return () => window.clearTimeout(timer);
  }, [busy, step]);

  // The window grows and shrinks to fit each screen. It is pinned to a height only while it animates,
  // then goes back to automatic, so it can never cut content off.
  const last = useRef<number | undefined>(undefined);
  useEffect(() => {
    const el = inner.current;
    if (!el) return;
    let raf = 0;
    const observer = new ResizeObserver(([entry]) => {
      const next = Math.round(entry.borderBoxSize?.[0]?.blockSize ?? el.offsetHeight);
      const prev = last.current;
      last.current = next;
      if (prev === undefined || prev === next) return;
      setHeight(prev);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        raf = requestAnimationFrame(() => setHeight(next));
      });
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  // A new screen starts at its top. If the button that was pressed sits near the bottom of a tall screen,
  // the page would otherwise stay put and show the end of the new screen instead of its start.
  const showTop = () => {
    const el = app.current;
    if (!el) return;
    const nav = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-height")) || 68;
    if (el.getBoundingClientRect().top >= nav) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ block: "start", behavior: calm ? "auto" : "smooth" });
  };

  const go = (next: number) => {
    setDir(next > step ? "fwd" : "back");
    setStep(next);
    setBusy(next > 0);
    showTop();
  };

  const pick = (id: string) => {
    setDir("none");
    setCaseId(id);
    setStep(0);
    setBusy(false);
    showTop();
  };

  return (
    <div className="demo-wrap">
      <div className="case-seg" role="group" aria-label="Example patient">
        {cases.map((c) => (
          <button key={c.id} type="button" className={`case-btn ${c.id === caseId ? "is-on" : ""}`} aria-pressed={c.id === caseId} onClick={() => pick(c.id)}>
            {c.title}
          </button>
        ))}
      </div>

      <div className="app" ref={app}>
        <div className="app-top">
          <div className="app-brand">
            <Brand size={26} />
            <strong>WarfaRisk</strong>
          </div>
          <ol className="stepper" aria-label="Screens">
            {steps.map((label, i) => (
              <li key={label} className={i <= step ? "is-reached" : ""}>
                <button
                  type="button"
                  className={`stepper-btn ${i === step ? "is-on" : ""} ${i < step ? "is-done" : ""}`}
                  aria-current={i === step ? "step" : undefined}
                  onClick={() => go(i)}
                >
                  <span className="stepper-dot">{i + 1}</span>
                  {label}
                </button>
              </li>
            ))}
          </ol>
          <span className="app-tag">
            <Icon name="flask" />
            Research prototype
          </span>
        </div>

        <div
          className="app-body"
          aria-live="polite"
          style={height ? { height } : undefined}
          onTransitionEnd={(e) => e.target === e.currentTarget && e.propertyName === "height" && setHeight(undefined)}
        >
          <div ref={inner} className="app-inner">
            <div key={`${step}-${caseId}-${busy}`} className={`screen dir-${dir}`}>
              {step === 0 && <StepInput c={current} onNext={() => go(1)} />}
              {step === 1 && <StepDose c={current} busy={busy} onBack={() => go(0)} onNext={() => go(2)} />}
              {step === 2 && <StepExplain c={current} busy={busy} onBack={() => go(1)} onReset={() => go(0)} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
