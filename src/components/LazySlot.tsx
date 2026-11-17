import { landing } from "../lib/scrollRestore";
import { Component, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

// One slot per section below the first screen. The slot is in the page from the start, so the anchor,
// the scroll position and the nav highlight all work before the section has loaded. The section itself
// is mounted (and its code fetched) only when the slot is within about a screen and a half of the viewport.
//
// Until then the slot holds the section's real height, so nothing below it moves. The height is the one
// measured last time on this device and width, or a measured default. That is also what makes a refresh
// partway down the page land in the right place.

type Heights = readonly [phone: number, tablet: number, desktop: number];

const bucket = () => (window.innerWidth < 560 ? 0 : window.innerWidth < 960 ? 1 : 2);
const storeKey = (key: string) => `wr:h:${key}:${bucket()}:${Math.round(window.innerWidth / 20)}`;

function startHeight(key: string, defaults: Heights): number {
  try {
    const saved = Number(sessionStorage.getItem(storeKey(key)));
    if (saved > 100) return saved;
  } catch {
    // Storage can be blocked. The measured defaults are close enough.
  }
  return defaults[bucket()];
}

// Once the reader moves the page themselves, nothing may scroll it back.
let moved = false;
if (typeof window !== "undefined") {
  for (const type of ["wheel", "touchstart", "keydown", "pointerdown"]) {
    window.addEventListener(type, () => (moved = true), { once: true, passive: true });
  }
}

// If a section's code cannot be fetched (a tab left open across a new release, or a dropped connection),
// show a plain message and a way out instead of a blank page.
class SectionBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="container section-error" role="alert">
        <p>This part of the page did not load.</p>
        <button type="button" className="button button-ghost" onClick={() => window.location.reload()}>
          Reload the page
        </button>
      </div>
    );
  }
}

function Loaded({ onLoad }: { onLoad: () => void }) {
  useLayoutEffect(onLoad, [onLoad]);
  return null;
}

export function LazySlot({ slotKey, id, heights, children }: { slotKey: string; id?: string; heights: Heights; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [minHeight] = useState(() => startHeight(slotKey, heights));
  const markLoaded = useCallback(() => setLoaded(true), []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setNear(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "1200px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Remember the real height for the next visit and the next refresh.
  useEffect(() => {
    const el = ref.current;
    if (!loaded || !el) return;
    const timer = window.setTimeout(() => {
      try {
        sessionStorage.setItem(storeKey(slotKey), String(Math.round(el.getBoundingClientRect().height)));
      } catch {
        // Not saving is fine.
      }
    }, 800);
    return () => window.clearTimeout(timer);
  }, [loaded, slotKey]);

  // A link such as warfarisk.com/#team lands on the slot first. Once the section is in, line it up again.
  // Only for a link, never for a refresh, where the reader may have scrolled elsewhere.
  useEffect(() => {
    if (!loaded || !id || moved || !landing.byHash || window.location.hash !== `#${id}`) return;
    ref.current?.scrollIntoView();
  }, [loaded, id]);

  return (
    <div ref={ref} id={id} className="lazy-slot" style={loaded ? undefined : { minHeight }} aria-busy={near && !loaded ? true : undefined}>
      {near && (
        <SectionBoundary>
          <Suspense fallback={null}>
            {children}
            <Loaded onLoad={markLoaded} />
          </Suspense>
        </SectionBoundary>
      )}
    </div>
  );
}
