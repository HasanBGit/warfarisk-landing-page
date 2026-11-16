import { Icon } from "../components/Icon";
import { Reveal } from "../components/Reveal";

export function Closing() {
  return (
    <section className="closing" aria-labelledby="closing-title">
      <div className="container">
        <Reveal className="plain closing-panel">
          <h2 id="closing-title">An average can hide who a tool fails. Check every group.</h2>
          <div className="actions">
            <a className="button button-light" href="#papers">
              Read the papers
              <Icon name="right" />
            </a>
            <a className="button button-outline-light" href="#demo">
              Try the example again
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
