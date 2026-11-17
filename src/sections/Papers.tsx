import { Icon } from "../components/Icon";
import { Reveal } from "../components/Reveal";
import { links } from "../data/numbers";

const papers = [
  {
    title: "Beyond Mean Absolute Error: Ancestry-Stratified Calibration and Explainability for Warfarin Dosing Models",
    venue: "Journal of Personalized Medicine, 2026, 16(10), 531",
    point: "Accuracy, who the tool misses, how sure it is, and why, on the same patients.",
    href: links.jpm,
    doi: "10.3390/jpm16100531",
  },
  {
    title: "WarfaRisk: A Reproducible, Fairness-Aware Machine Learning Pipeline for Warfarin Dose Prediction (Prototype)",
    venue: "AI, 2026, 7(10), 431",
    point: "The tool: the nine steps, the three screens, and what it takes to reach a clinician.",
    href: links.ai,
    doi: "10.3390/ai7100431",
  },
];

export function Papers() {
  return (
    <section className="section-tight" aria-labelledby="papers-title">
      <div className="container">
        <Reveal className="center-head">
          <h2 id="papers-title">Everything above is in two open papers.</h2>
          <p className="lead">Both are free to read. The code and trained models are open too.</p>
        </Reveal>

        <Reveal className="plain paper-grid">
          {papers.map((paper, i) => (
            <article key={paper.doi} className="card paper stagger-item" style={{ "--i": i } as React.CSSProperties}>
              <p className="paper-venue">{paper.venue}</p>
              <h3>{paper.title}</h3>
              <p>{paper.point}</p>
              <a className="button button-primary" href={paper.href} rel="noreferrer">
                Read the paper
                <Icon name="right" />
              </a>
              <p className="doi">DOI {paper.doi}</p>
            </article>
          ))}
        </Reveal>

      </div>
    </section>
  );
}
