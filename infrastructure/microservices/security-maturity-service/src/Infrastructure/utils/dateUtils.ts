export function isValidDate(d: Date): boolean {
  return d instanceof Date && !Number.isNaN(d.getTime());
}

export function diffMinutesNonNegative(later: Date, earlier: Date): number {
  if (!isValidDate(later) || !isValidDate(earlier)) return -1;

  const ms = later.getTime() - earlier.getTime();
  if (ms < 0) return -1;

  return ms / 60000;
}
