export const NOT_FOUND = -1 as const;

export function isNotFound(value: number): boolean {
  return value === NOT_FOUND;
}

