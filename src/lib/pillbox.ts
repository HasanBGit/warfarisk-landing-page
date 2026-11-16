// Shared layout for the hero pillbox, used by the 3D scene and the flat fallback.
// One tablet is 1 mg. The weekly total is spread as evenly as possible over seven days.
export const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
export const SLOTS = 8; // most tablets a compartment holds, in two columns of four

export function spread(total: number): number[] {
  const base = Math.floor(total / 7);
  const extra = total % 7;
  return DAYS.map((_, d) => base + (d < extra ? 1 : 0));
}

// Position of tablet k inside its compartment, in tablet-diameter units: x across, z along.
export function slotXZ(k: number): [number, number] {
  return [(k % 2) - 0.5, Math.floor(k / 2) - 1.5];
}

export function pillboxLabel(tablets: number, extra: number): string {
  return `A seven-day pillbox holding ${tablets} one-milligram tablets, plus ${extra} faint tablets that show the extra amount up to the top of the 90% range.`;
}
