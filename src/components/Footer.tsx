import { Brand } from "./Brand";
import { Icon } from "./Icon";
import { links as urls } from "../data/numbers";

const links = [
  { href: "#problem", label: "The problem" },
  { href: "#pipeline", label: "What we built" },
  { href: "#findings", label: "What we found" },
  { href: "#calibration", label: "Who it misses" },
  { href: "#demo", label: "Try it" },
  { href: "#papers", label: "Papers" },
  { href: "#team", label: "Team" },
];

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <a className="brand" href="#top">
            <Brand size={28} />
            <span>WarfaRisk</span>
          </a>
          <p>
            Research prototype. Not tested in patients and not for clinical use.
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="footer-links">
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href}>
                  {link.label}
                  <Icon name="right" />
                </a>
              </li>
            ))}
            <li>
              <a href={urls.code} rel="noreferrer">
                Code
                <Icon name="right" />
              </a>
            </li>
          </ul>
        </nav>

        <a className="button button-ghost footer-top" href="#top">
          <Icon name="up" />
          <span className="footer-top-text">Back to top</span>
        </a>
      </div>
    </footer>
  );
}
