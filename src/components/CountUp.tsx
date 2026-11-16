import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../lib/hooks";

// Counts up to a number once, when it first scrolls into view. Screen readers get the final number at once.
export function CountUp({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const calm = useReducedMotion();
  const [shown, setShown] = useState(calm ? value : 0);

  useEffect(() => {
    if (calm) {
      setShown(value);
      return;
    }
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const run = () => {
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min((t - t0) / 1100, 1);
        setShown(value * (1 - (1 - p) ** 3));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          run();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, calm]);

  return (
    <span ref={ref}>
      <span className="sr-only">{value.toFixed(decimals)}</span>
      <span aria-hidden="true">{shown.toFixed(decimals)}</span>
    </span>
  );
}
