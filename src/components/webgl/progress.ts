export interface ProgressPair {
  from: number;
  to: number;
  t: number;
}

export function mapProgress(progress: number, count: number): ProgressPair {
  if (count <= 1) return { from: 0, to: 0, t: 0 };
  const clamped = Math.min(Math.max(progress, 0), 1);
  const scaled = clamped * (count - 1);
  const from = Math.min(Math.floor(scaled), count - 2);
  const to = from + 1;
  const t = scaled - from;
  return { from, to, t };
}
