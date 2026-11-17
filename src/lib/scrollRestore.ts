import { useLayoutEffect } from "react";

// The page is drawn by script, so when the browser tries to restore the scroll position after a refresh or
// a back button, the page is still empty and there is nothing to scroll to. So we do it ourselves:
// remember where the reader was, and put them back as soon as the first render is in place.
// The sections below the first screen already hold their real height at that point (see LazySlot).

const KEY = "wr:y";

// True when the reader arrived through a link with a #section in it, not through a refresh.
export const landing = { byHash: false };

function arrivedByReload(): boolean {
  const entry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  return !!entry && entry.type !== "navigate";
}

export function useScrollRestore(): void {
  useLayoutEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";

    let saved = 0;
    try {
      saved = Number(sessionStorage.getItem(KEY)) || 0;
    } catch {
      // Storage can be blocked. Then a refresh simply starts at the link's section, or the top.
    }
    const hash = window.location.hash ? decodeURIComponent(window.location.hash.slice(1)) : "";
    const target = hash ? document.getElementById(hash) : null;

    if (arrivedByReload() && saved > 0) {
      window.scrollTo({ top: saved, behavior: "instant" });
    } else if (target) {
      target.scrollIntoView();
      landing.byHash = true;
    }

    let frame = 0;
    const remember = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        try {
          sessionStorage.setItem(KEY, String(Math.round(window.scrollY)));
        } catch {
          // Not saving is fine.
        }
      });
    };
    window.addEventListener("scroll", remember, { passive: true });
    return () => {
      window.removeEventListener("scroll", remember);
      cancelAnimationFrame(frame);
    };
  }, []);
}
