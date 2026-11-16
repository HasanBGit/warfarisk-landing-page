import { DotField } from "../components/DotField";
import { Reveal } from "../components/Reveal";
import { best, testSize } from "../data/numbers";

// Two tests side by side: the small one behind the best published error, and the careful one used here.
export function Problem() {
  return (
    <section id="problem" className="problem" aria-labelledby="problem-title">
      <div className="container problem-grid">
        <Reveal className="problem-copy">
          <h2 id="problem-title">A good score can come from a small test.</h2>
          <p className="lead">
            Warfarin is hard to dose. The right dose can differ ten times between patients, and too much or too little is dangerous.
          </p>
          <dl className="problem-stats">
            <div>
              <dt>Best published error</dt>
              <dd className="stat-num">
                {testSize.bestPublishedMae} <small>mg/week</small>
              </dd>
              <dd className="stat-note">Tested on only {testSize.small} patients.</dd>
            </div>
            <div>
              <dt>Our best model</dt>
              <dd className="stat-num">
                {best.mae} <small>mg/week</small>
              </dd>
              <dd className="stat-note">Tested on {testSize.large.toLocaleString("en-US")} patients.<span className="d-only"> A careful test is less flattering.</span></dd>
            </div>
          </dl>
        </Reveal>

        <figure className="dotfield">
          <DotField />
          <figcaption>
            <span>
              <i className="dot-key-small" aria-hidden="true" />
              {testSize.small} patients, the small test
            </span>
            <span>
              <i className="dot-key-rest" aria-hidden="true" />
              {testSize.large.toLocaleString("en-US")} patients, our test
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
