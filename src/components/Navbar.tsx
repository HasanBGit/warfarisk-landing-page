import { useEffect, useRef, useState } from "react";
import { Brand } from "./Brand";

const links = [
  { id: "problem", label: "The problem" },
  { id: "pipeline", label: "What we built" },
  { id: "findings", label: "What we found" },
  { id: "calibration", label: "Who it misses" },
  { id: "demo", label: "Try it" },
  { id: "papers", label: "Papers" },
];

// The section in the middle of the screen, so the nav can show where the reader is.
function useActiveSection(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sections = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const [ids] = useState(() => links.map((link) => link.id));
  // Sections load lazily, so look them up again once the page has settled.
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 1200);
    return () => window.clearTimeout(timer);
  }, []);
  const active = useActiveSection(ready ? ids : []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => firstLinkRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={`nav ${scrolled ? "is-scrolled" : ""} ${open ? "is-menu-open" : ""}`}>
      <div className="container nav-inner">
        <a className="brand" href="#top" onClick={close}>
          <Brand size={30} />
          <span>WarfaRisk</span>
        </a>

        <button
          ref={toggleRef}
          className="nav-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="nav-menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <span className="nav-toggle-bars" aria-hidden="true" />
        </button>

        <nav id="nav-menu" className={`nav-menu ${open ? "is-open" : ""}`} aria-label="Main">
          <ul>
            {links.map((link, index) => (
              <li key={link.id}>
                <a
                  ref={index === 0 ? firstLinkRef : undefined}
                  href={`#${link.id}`}
                  className="nav-link"
                  aria-current={active === link.id ? "location" : undefined}
                  onClick={close}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a className="button button-primary nav-cta" href="#papers" onClick={close}>
            Read the papers
          </a>
        </nav>
      </div>
    </header>
  );
}
