import { useId, useState, type ReactNode } from "react";
import { useMediaQuery } from "../lib/hooks";
import { Icon } from "./Icon";

export const PHONE = "(max-width: 559px)";

// An open/close row with a smooth height change. Closed content is inert, so it cannot be tabbed into or read out.
export function Disclosure({
  summary,
  children,
  defaultOpen = false,
  className = "",
  heading = false,
}: {
  summary: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  heading?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  const button = (
    <button type="button" className="disc-btn" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
      <span className="disc-label">{summary}</span>
      <Icon name="down" className="chev" />
    </button>
  );
  return (
    <div className={`disc ${open ? "is-open" : ""} ${className}`}>
      {heading ? <h3 className="disc-h">{button}</h3> : button}
      <div id={id} className="disc-panel" inert={!open}>
        <div className="disc-in">{children}</div>
      </div>
    </div>
  );
}

// Secondary text. On a phone it sits behind a tap. On a larger screen it is shown in place
// (or not at all, with hideOnDesktop, when the same words already appear in full elsewhere).
export function Collapse({ label, children, hideOnDesktop = false, defaultOpen = false }: { label: string; children: ReactNode; hideOnDesktop?: boolean; defaultOpen?: boolean }) {
  const phone = useMediaQuery(PHONE);
  if (!phone) return hideOnDesktop ? null : <>{children}</>;
  return (
    <Disclosure summary={label} className="disc-line" defaultOpen={defaultOpen}>
      {children}
    </Disclosure>
  );
}

// A titled card. On a phone the title is a tap row that opens the card, on a larger screen it is an ordinary card.
export function FoldCard({
  title,
  children,
  className,
  as: Tag = "article",
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  className: string;
  as?: "article" | "section";
  defaultOpen?: boolean;
}) {
  const phone = useMediaQuery(PHONE);
  if (!phone)
    return (
      <Tag className={className}>
        <h3>{title}</h3>
        {children}
      </Tag>
    );
  return (
    <Disclosure heading summary={title} className={`${className} is-fold`} defaultOpen={defaultOpen}>
      {children}
    </Disclosure>
  );
}
