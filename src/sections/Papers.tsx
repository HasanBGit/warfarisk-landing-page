import { Icon } from "../components/Icon";
import { Reveal } from "../components/Reveal";
import { papers } from "../data/papers";


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
