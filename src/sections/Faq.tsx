import { Disclosure } from "../components/Disclosure";
import { Reveal } from "../components/Reveal";
import { faq } from "../data/faq";

// Plain questions with short answers that start with the answer. Each row opens and closes on a click.
// The same questions and answers are in the structured data, and on their own page at /faq/.
export function Faq() {
  return (
    <section className="section-tight" aria-labelledby="faq-title">
      <div className="container">
        <Reveal className="center-head">
          <h2 id="faq-title">Common questions.</h2>
          <p className="lead">Short answers, with the numbers from the papers.</p>
        </Reveal>

        <div className="faq">
          {faq.map((item) => (
            <Disclosure key={item.q} heading className="disc-line" summary={item.q}>
              <p>{item.a}</p>
            </Disclosure>
          ))}
        </div>
      </div>
    </section>
  );
}
