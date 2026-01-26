import { JsonValue } from "../../Domain/types/JsonValue";
import { isJsonArray } from "../json/isJsonArray";
import { isJsonObject } from "../json/isJsonObject";

function toFiniteInt(v: JsonValue): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return Math.trunc(v);
  if (typeof v === "string") {
    const n = Number(v);
    if (Number.isFinite(n)) return Math.trunc(n);
  }
  return null;
}

export function extractNumericEventIds(raw: JsonValue): number[] {
  if (!isJsonArray(raw)) return [];

  const out: number[] = [];

  for (const item of raw) {
    // case 1: array of numbers / numeric strings
    const direct = toFiniteInt(item);
    if (direct !== null && direct > 0) {
      out.push(direct);
      continue;
    }

    // case 2: array of objects with "id"
    if (isJsonObject(item)) {
      const fromId = toFiniteInt(item["id"]);
      if (fromId !== null && fromId > 0) out.push(fromId);
    }
  }

  // de-duplicate, keep order
  const seen = new Set<number>();
  const unique: number[] = [];
  for (const id of out) {
    if (!seen.has(id)) {
      seen.add(id);
      unique.push(id);
    }
  }

  return unique;
}
