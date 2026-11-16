import { links } from "../data/numbers";

// Supporters. The Alfaisal University logo is a transparent PNG made for light backgrounds,
// the AI Center logo is a navy square, so both sit on white tiles.
export function Logos({ size = "sm" }: { size?: "sm" | "lg" }) {
  return (
    <ul className={`logos logos-${size}`}>
      <li>
        <a href={links.aic} rel="noreferrer" aria-label="Alfaisal AI Center">
          <img src="/alfaisal-ai-center.jpeg" alt="Alfaisal AI Center" width="200" height="200" loading="lazy" />
        </a>
      </li>
      <li>
        <a href="https://alfaisal.edu" rel="noreferrer" aria-label="Alfaisal University">
          <img src="/alfaisal-university.png" alt="Alfaisal University" width="186" height="285" loading="lazy" />
        </a>
      </li>
    </ul>
  );
}
