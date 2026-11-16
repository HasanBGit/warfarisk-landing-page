// Clamp a value to 0..1, and an ease-in-out curve for smooth motion.
export function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function ease(value: number): number {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
}
