import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "../lib/hooks";

// Fades a block in once, when it first enters the screen. Reduced motion shows it at once.
export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || shown) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [shown]);

  return (
    <div ref={ref} className={`reveal ${shown || reduced ? "is-shown" : ""} ${className}`}>
      {children}
    </div>
  );
}
