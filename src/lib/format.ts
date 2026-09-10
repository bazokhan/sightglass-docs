export function num(n: number): string {
  return n.toLocaleString("en-US");
}

export function compact(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 1 : 2)}M`;
  if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 1 : 2)}K`;
  return `${Math.round(n)}`;
}

export function ms(v: number): string {
  if (v >= 1000) return `${(v / 1000).toFixed(v >= 10_000 ? 1 : 2)}s`;
  return `${Math.round(v)}ms`;
}

export function pct(v: number, digits = 1): string {
  return `${(v * 100).toFixed(digits)}%`;
}

export function scale(value: number, factor: number): number {
  return Math.max(0, Math.round(value * factor));
}
