import { Disclosure } from "./Disclosure";
import { Icon, type IconName } from "./Icon";
import { coverage, coverageBars } from "../data/numbers";
import { useMediaQuery } from "../lib/hooks";

// Share of true doses that landed inside the tool's 90% range, for each ancestry group.
// A dot per group on one shared scale, with the paper's exact 95% interval as a line.
// Small groups get long lines, so how far to trust a dot is visible. Sorted from best to worst.
// On a phone the same rows are grouped by result: the worst group is open, the others are one tap away.
const MIN = 40;
const MAX = 104; // headroom so the dots at 100% do not touch the number beside them
const TICKS = [50, 60, 70, 80, 90, 100];
const PHONE_TICKS = [60, 80, 100];
const x = (v: number) => `${((Math.min(Math.max(v, MIN), MAX) - MIN) / (MAX - MIN)) * 100}%`;

type Row = (typeof coverageBars)[number];
const rows: Row[] = [...coverageBars].sort((a, b) => (a.label === "All patients" ? -1 : b.label === "All patients" ? 1 : b.coverage - a.coverage));

type Tone = "ok" | "warn" | "bad";
const toneOf = (g: Row): Tone => (g.coverage >= coverage.target || g.label === "All patients" ? "ok" : g.significant ? "bad" : "warn");
const ICON: Record<Tone, IconName> = { ok: "check", warn: "alert", bad: "cross" };
const WORD: Record<Tone, string> = { ok: "Met the target", warn: "Below target, could be chance", bad: "Below target, not chance" };

function A11yTable() {
  return (
    <div className="sr-only">
      <table>
        <caption>Share of true doses inside the 90% range, by ancestry group, highest first. The target is 90%.</caption>
        <thead>
          <tr>
            <th>Group</th>
            <th>Patients</th>
            <th>Inside the range</th>
            <th>95% interval</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((g) => (
            <tr key={g.label}>
              <td>{g.label}</td>
              <td>{g.n}</td>
              <td>{g.coverage.toFixed(1)}%</td>
              <td>{g.ci ? `${g.ci[0]} to ${g.ci[1]}` : "not reported"}</td>
              <td>{WORD[toneOf(g)]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Legend({ phone = false }: { phone?: boolean }) {
  const Tag = phone ? "div" : "figcaption";
  return (
    <Tag className={phone ? "cov-cap" : undefined}>
      <span>Dot: share of true doses inside the range. Line: the 95% interval, longer for smaller groups.</span>
      <span className="cov-legend">
        <span className="tone-ok">
          <Icon name="check" /> Met the target
        </span>
        <span className="tone-warn">
          <Icon name="alert" /> Below it, could be chance
        </span>
        <span className="tone-bad">
          <Icon name="cross" /> Below it, not chance
        </span>
      </span>
    </Tag>
  );
}

function PhoneRow({ g }: { g: Row }) {
  const tone = toneOf(g);
  return (
    <div className={`cov-m-row tone-${tone} ${g.label === "All patients" ? "is-all" : ""}`}>
      <div className="cov-m-top">
        <span className="cov-m-name">
          {g.label}
          <small>{g.n.toLocaleString("en-US")} patients</small>
        </span>
        <span className="cov-m-val">
          <b>{g.coverage.toFixed(1)}%</b>
          <Icon name={ICON[tone]} />
        </span>
      </div>
      <div className="cov-mplot">
        {g.ci && <span className="cov-whisker" style={{ left: x(g.ci[0]), width: `calc(${x(g.ci[1])} - ${x(g.ci[0])})` }} />}
        <span className="cov-dot" style={{ left: x(g.coverage) }} />
      </div>
    </div>
  );
}

function PhoneAxis() {
  return (
    <div className="cov-m-axis" aria-hidden="true">
      {PHONE_TICKS.map((t) => (
        <span key={t} style={{ left: x(t) }}>
          {t}%
        </span>
      ))}
    </div>
  );
}

function PhoneCoverage() {
  const groups = rows.filter((g) => g.label !== "All patients");
  const buckets = (["bad", "warn", "ok"] as Tone[]).map((tone) => ({ tone, items: groups.filter((g) => toneOf(g) === tone) })).filter((b) => b.items.length > 0);
  return (
    <figure className="coverage cov-phone">
      <div className="cov-m-card">
        <PhoneAxis />
        <PhoneRow g={rows[0]} />
        <p className="cov-m-line">Dark vertical line: the 90% the range promises.</p>
      </div>
      {buckets.map((b, i) => (
        <Disclosure
          key={b.tone}
          className={`cov-m-group tone-${b.tone}`}
          defaultOpen={i === 0}
          summary={
            <>
              <Icon name={ICON[b.tone]} />
              <span>
                {WORD[b.tone]}
                <small>
                  {b.items.length} {b.items.length === 1 ? "group" : "groups"}
                </small>
              </span>
            </>
          }
        >
          <div className="cov-m-body">
            <PhoneAxis />
            {b.items.map((g) => (
              <PhoneRow key={g.label} g={g} />
            ))}
          </div>
        </Disclosure>
      ))}
      <A11yTable />
      <Disclosure className="disc-line" summary="How to read this chart">
        <Legend phone />
      </Disclosure>
    </figure>
  );
}

export function CoverageBars() {
  const phone = useMediaQuery("(max-width: 559px)");
  if (phone) return <PhoneCoverage />;
  return (
    <figure className="coverage">
      <div className="cov-chart" aria-hidden="true">
        <div className="cov-head cov-head-label">Group</div>
        <div className="cov-head cov-axis">
          {TICKS.map((t) => (
            <span key={t} style={{ left: x(t) }}>
              {t}%
            </span>
          ))}
        </div>
        <div className="cov-head" />

        <div className="cov-lines">
          {TICKS.map((t) => (
            <i key={t} style={{ left: x(t) }} />
          ))}
          <b style={{ left: x(coverage.target) }}>
            <span>90% promised</span>
          </b>
        </div>

        {rows.map((g, i) => {
          const tone = toneOf(g);
          return (
            <div key={g.label} className={`cov-row tone-${tone} ${g.label === "All patients" ? "is-all" : ""}`} style={{ "--r": i + 2 } as React.CSSProperties}>
              <div className="cov-name">
                {g.label}
                <small>{g.n.toLocaleString("en-US")} patients</small>
              </div>
              <div className="cov-plot">
                {g.ci && <span className="cov-whisker" style={{ left: x(g.ci[0]), width: `calc(${x(g.ci[1])} - ${x(g.ci[0])})` }} />}
                <span className="cov-dot" style={{ left: x(g.coverage) }} />
              </div>
              <div className="cov-val">
                <b>{g.coverage.toFixed(1)}%</b>
                <Icon name={ICON[tone]} />
              </div>
            </div>
          );
        })}
      </div>
      <A11yTable />
      <Legend />
    </figure>
  );
}
