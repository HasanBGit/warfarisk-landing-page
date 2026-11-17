// Section links and buttons scroll with a short, eased glide. The time is capped, so a jump across the
// whole page is no slower to reach than a jump to the next section, and any touch of the wheel, keys or screen stops it.
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

export function installSmoothAnchors(): () => void {
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
  let raf = 0;

  const stop = () => cancelAnimationFrame(raf);

  const onClick = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link) return;
    const id = decodeURIComponent(link.getAttribute("href")!.slice(1));
    const target = id === "" || id === "top" ? null : document.getElementById(id);
    if (id !== "" && id !== "top" && !target) return;
    event.preventDefault();

    const offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    // Sections below load as the reader comes near them, so the target can move while we scroll. Measure it again each time.
    const targetY = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return Math.min(Math.max(target ? target.getBoundingClientRect().top + window.scrollY - offset : 0, 0), max);
    };
    const finish = () => {
      history.pushState(null, "", id ? `#${id}` : window.location.pathname + window.location.search);
      if (target) {
        if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }
    };

    stop();
    const glide = (attempt: number) => {
      const from = window.scrollY;
      const to = targetY();
      const distance = Math.abs(to - from);
      if (calm.matches || distance < 4) {
        window.scrollTo({ top: to, behavior: "instant" });
        finish();
        return;
      }
      const duration = Math.min(700, Math.max(350, distance * 0.3));
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        window.scrollTo({ top: from + (to - from) * easeInOut(t), behavior: "instant" });
        if (t < 1) raf = requestAnimationFrame(step);
        else if (attempt < 2 && Math.abs(targetY() - window.scrollY) > 8) glide(attempt + 1);
        else finish();
      };
      raf = requestAnimationFrame(step);
    };
    glide(0);
  };

  document.addEventListener("click", onClick);
  window.addEventListener("wheel", stop, { passive: true });
  window.addEventListener("touchstart", stop, { passive: true });
  window.addEventListener("keydown", stop);
  return () => {
    stop();
    document.removeEventListener("click", onClick);
    window.removeEventListener("wheel", stop);
    window.removeEventListener("touchstart", stop);
    window.removeEventListener("keydown", stop);
  };
}
