import { Reveal } from "../components/Reveal";
import { links } from "../data/numbers";

const partners = [
  { name: "Alfaisal AI Center", href: links.aic, src: "/alfaisal-ai-center.jpeg", width: 200, height: 200 },
  { name: "Alfaisal University", href: "https://alfaisal.edu", src: "/alfaisal-university.png", width: 186, height: 285 },
] as const;

export function Sponsors() {
  return (
    <section className="section-tight sponsors" aria-labelledby="sponsors-title">
      <div className="container">
        <Reveal className="plain sponsors-block">
          <h2 id="sponsors-title">Supported by</h2>
          <ul className="partners">
            {partners.map((p) => (
              <li key={p.name}>
                <a href={p.href} rel="noreferrer">
                  <span className="partner-logo">
                    <img src={p.src} alt="" width={p.width} height={p.height} loading="lazy" />
                  </span>
                  {p.name}
                </a>
              </li>
            ))}
          </ul>
          <p>The authors thank the Alfaisal AI Center at Alfaisal University for infrastructure support.</p>
        </Reveal>
      </div>
    </section>
  );
}
