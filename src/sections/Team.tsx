import { useState } from "react";
import { Icon } from "../components/Icon";
import { Reveal } from "../components/Reveal";
import { leads, members, type Person } from "../data/team";

// Initials from the first two real words of the name. Titles are skipped, and Array.from keeps emoji and accents whole.
function initials(name: string): string {
  const words = name
    .replace(/^(dr|eng|prof)\.?\s+/i, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  return words
    .slice(0, 2)
    .map((w) => Array.from(w)[0]?.toLocaleUpperCase() ?? "")
    .join("");
}

function Avatar({ person, size }: { person: Person; size: "lead" | "member" }) {
  const px = size === "lead" ? 104 : 88;
  // A photo that fails to load falls back to the initials, so a wrong file name never shows a broken image.
  const [failed, setFailed] = useState(false);
  if (person.photo && !failed) {
    return <img className={`avatar avatar-${size}`} src={person.photo} alt="" width={px} height={px} loading="lazy" onError={() => setFailed(true)} />;
  }
  return (
    <span className={`avatar avatar-${size} avatar-initials`} aria-hidden="true">
      {initials(person.name)}
    </span>
  );
}

function LinkedInLink({ person }: { person: Person }) {
  if (!person.linkedin) return null;
  return (
    <a className="person-social" href={person.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${person.name} on LinkedIn, opens in a new tab`}>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    </a>
  );
}

// The names are printed next to the photos, so the photos carry no alt text of their own.
function Lead({ person }: { person: Person }) {
  return (
    <li className="lead-card">
      <Avatar person={person} size="lead" />
      <div className="lead-body">
        <h4 className="person-name">{person.name}</h4>
        {person.role && <p className="person-role">{person.role}</p>}
        {person.detail && <p className="person-detail">{person.detail}</p>}
        {(person.email || person.linkedin) && (
          <div className="person-links">
            {person.email && (
              <a className="person-mail" href={`mailto:${person.email}`}>
                <Icon name="mail" />
                {person.email}
              </a>
            )}
            <LinkedInLink person={person} />
          </div>
        )}
      </div>
    </li>
  );
}

function Member({ person }: { person: Person }) {
  return (
    <li className="member">
      <Avatar person={person} size="member" />
      <h4 className="person-name">{person.name}</h4>
      {person.linkedin && <LinkedInLink person={person} />}
    </li>
  );
}

export function Team() {
  return (
    <section className="section-tight team" aria-labelledby="team-title">
      <div className="container">
        <Reveal className="center-head">
          <h2 id="team-title">Meet the team.</h2>
          <p className="lead">The people working on WarfaRisk.</p>
        </Reveal>

        {leads.length > 0 && (
          <>
            <h3 className="team-group">Project leads</h3>
            <ul className="leads">
              {leads.map((p) => (
                <Lead key={p.id} person={p} />
              ))}
            </ul>
          </>
        )}

        {members.length > 0 && (
          <>
            <h3 className="team-group">Team</h3>
            <ul className="members">
              {members.map((p) => (
                <Member key={p.id} person={p} />
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}
