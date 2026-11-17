// One small line-icon set (16px, 1.5 stroke), drawn inline so it adds no dependency.
const PATHS = {
  check: "M8 14.25a6.25 6.25 0 1 0 0-12.5 6.25 6.25 0 0 0 0 12.5ZM5.25 8.25l1.9 1.9 3.6-3.9",
  alert: "M8 2 14.5 13.25h-13L8 2ZM8 6.5v3M8 11.6v.02",
  cross: "M8 14.25a6.25 6.25 0 1 0 0-12.5 6.25 6.25 0 0 0 0 12.5ZM5.9 5.9l4.2 4.2M10.1 5.9l-4.2 4.2",
  minus: "M8 14.25a6.25 6.25 0 1 0 0-12.5 6.25 6.25 0 0 0 0 12.5ZM5.5 8h5",
  right: "M3 8h10M8.5 3.5 13 8l-4.5 4.5",
  left: "M13 8H3M7.5 3.5 3 8l4.5 4.5",
  reset: "M2.75 8a5.25 5.25 0 1 0 1.6-3.75M2.75 2.5v2.5H5.25",
  down: "M3.5 6 8 10.5 12.5 6",
  up: "M8 13V3M3.5 7.5 8 3l4.5 4.5",
  mail: "M2.5 4h11v8h-11V4ZM2.75 4.5 8 8.75l5.25-4.25",
  flask: "M6 2h4M6.75 2v4.25L3 13a1 1 0 0 0 .9 1.5h8.2A1 1 0 0 0 13 13L9.25 6.25V2M4.9 10h6.2",
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg className={`icon ${className ?? ""}`} data-icon={name} viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  );
}
