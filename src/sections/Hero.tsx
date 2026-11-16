import { HeroTool } from "../components/HeroTool";
import { Logos } from "../components/Logos";

export function Hero() {
  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <div className="hero-panel">
      <div className="container hero-grid">
        <div className="hero-copy">
          <h1 id="hero-title">A warfarin dose, and how far to trust it.</h1>
          <p className="lead">
            <span className="d-only">
              WarfaRisk predicts a weekly warfarin dose and a 90% range, then checks how well that range held up for the patient's ancestry group.
            </span>
            <span className="p-only">Predicts a weekly dose with a 90% range, and checks it for each ancestry group.</span>
          </p>
          <div className="actions">
            <a className="button button-primary" href="#demo">
              Try the tool
              <svg className="btn-icon btn-icon-down" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M8 3v10M3.5 8.5 8 13l4.5-4.5" />
              </svg>
            </a>
            <a className="button button-ghost" href="#papers">
              <svg className="btn-icon" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 1.75h5.5L12.5 4.75v9.5H4zM9.5 1.75v3h3M6 8h4.5M6 10.75h4.5" />
              </svg>
              Read the papers
            </a>
          </div>
          <div className="hero-support">
            <p>Supported by</p>
            <Logos size="sm" />
          </div>
        </div>
        <div className="hero-graph">
          <HeroTool />
        </div>
      </div>
      </div>
    </section>
  );
}
