import type { IconName } from "../components/Icon";

// One status pattern for the hero and the demo: an icon and a word, never colour alone.
export const STATUS = {
  green: "Held up",
  amber: "Close",
  red: "Fell short",
  none: "Not checked",
} as const;

export const STATUS_ICON: Record<keyof typeof STATUS, IconName> = { green: "check", amber: "alert", red: "cross", none: "minus" };

export const pct = (v: number) => (Number.isInteger(v) ? `${v}%` : `${v.toFixed(1)}%`);
