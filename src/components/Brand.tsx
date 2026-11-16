// The WarfaRisk mark: a dose range with the predicted dose marked inside it.
export function Brand({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="var(--ink)" />
      <rect x="7" y="14.5" width="18" height="3" rx="1.5" fill="#ffffff" />
      <rect x="7" y="11" width="2" height="10" rx="1" fill="#ffffff" />
      <rect x="23" y="11" width="2" height="10" rx="1" fill="#ffffff" />
      <circle cx="16" cy="16" r="3.6" fill="var(--accent)" />
    </svg>
  );
}
