import { useEffect, useRef, useState } from "react";
import { Icon } from "../components/Icon";
import { Reveal } from "../components/Reveal";
import { phases } from "../data/numbers";
import { useMediaQuery, useReducedMotion } from "../lib/hooks";

// The nine steps as a grid of cards. They are a real sequence, so they are numbered.
// On a phone the grid becomes a swipeable row of cards with a peek of the next one and previous and next buttons.
export function Pipeline() {
  const phone = useMediaQuery("(max-width: 559px)");
  const calm = useReducedMotion();
  const list = useRef<HTMLOListElement>(null);
  const [now, setNow] = useState(0);

  useEffect(() => {
    const el = list.current;
    if (!el || !phone) return;
    let raf = 0;
    const update = () => {
      const cards = Array.from(el.children) as HTMLElement[];
      const left = el.scrollLeft;
      let best = 0;
      let gap = Infinity;
      cards.forEach((card, i) => {
        const d = Math.abs(card.offsetLeft - el.offsetLeft - left - parseFloat(getComputedStyle(el).paddingLeft));
        if (d < gap) {
          gap = d;
          best = i;
        }
      });
      setNow(best);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [phone]);

  const go = (to: number) => {
    const card = list.current?.children[Math.min(Math.max(to, 0), phases.length - 1)] as HTMLElement | undefined;
    card?.scrollIntoView({ behavior: calm ? "auto" : "smooth", inline: "start", block: "nearest" });
  };

  return (
    <section id="pipeline" className="section-tight" aria-labelledby="pipeline-title">
      <div className="container">
        <Reveal className="center-head">
          <h2 id="pipeline-title">So we built a careful test, in nine steps.</h2>
          <p className="lead">Steps 1 to 6 are the evaluated core. Steps 7 to 9 are prototype extensions.</p>
        </Reveal>
        <div className="steps-wrap" role="group" aria-roledescription="carousel" aria-label="The nine steps">
          <ol className="steps" ref={list} tabIndex={phone ? 0 : undefined}>
            {phases.map((phase, index) => (
              <li key={phase.name} className="pstep">
                <span className="pstep-n">{index + 1}</span>
                <h3>{phase.name}</h3>
                <p>{phase.line}</p>
              </li>
            ))}
          </ol>
          {phone && (
            <div className="steps-nav">
              <button type="button" className="round-btn" aria-label="Previous step" disabled={now === 0} onClick={() => go(now - 1)}>
                <Icon name="left" />
              </button>
              <div className="steps-count" aria-live="polite">
                <span>
                  Step {now + 1} of {phases.length}
                </span>
                <span className="steps-bar" aria-hidden="true">
                  <i style={{ width: `${((now + 1) / phases.length) * 100}%` }} />
                </span>
              </div>
              <button type="button" className="round-btn" aria-label="Next step" disabled={now === phases.length - 1} onClick={() => go(now + 1)}>
                <Icon name="right" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
