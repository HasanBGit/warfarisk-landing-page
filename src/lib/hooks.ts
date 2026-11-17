import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  // On the server there is no screen, so the desktop layout is the answer.
  const [matches, setMatches] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = () => setMatches(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

let webglSupport: boolean | null = null;

// Checked once, and the test context is released straight away so it does not count against
// the browser's limit on live WebGL contexts.
export function hasWebGL(): boolean {
  if (typeof document === "undefined") return false;
  if (webglSupport !== null) return webglSupport;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    webglSupport = Boolean(gl);
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}

// True while the element is on screen. 3D scenes use it to stop drawing when nobody can see them.
export function useInView(ref: { current: Element | null }): boolean {
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: "100px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  return inView;
}
